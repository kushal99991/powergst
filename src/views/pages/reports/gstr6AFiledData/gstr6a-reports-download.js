import React, { Fragment, useState, useEffect, useRef } from "react";
import { HotTable, HotColumn } from "@handsontable/react";
import { LINK_MESSAGE, RowSize, columnHeaderSize, paginationList, paginationTitle } from "../../../../configs/config";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import Swal from "sweetalert2";
import { Download, DownloadCloud, AlertCircle } from "react-feather";
import toast from "react-hot-toast";
import { Row, Col, Card, Input, Label, Button, CardText, UncontrolledTooltip, Alert } from "reactstrap";
import makeAnimated from "react-select/animated";
const animatedComponents = makeAnimated();
import { registerRenderer, textRenderer } from "handsontable/renderers";
import { selectThemeColors } from "@utils";
import errorCodeConfig from "../../../../configs/apiErrorCodeConfig";
import Select from "react-select"; // eslint-disable-line
import ReactPaginate from "react-paginate";
import Handsontable from "handsontable";
import gstr6filedService from "../../../../services/gstr6Filed/gstr6filedService";
import gstr6aPurchaseInvoice from "../../../../services/gstr6A/gstr6aPurchaseInvoice";
import { registerAllModules } from "handsontable/registry";
import { useNavigate } from "react-router-dom";
import withReactContent from "sweetalert2-react-content";
import { useHotkeys } from "react-hotkeys-hook";
import { keysMap, enableOnFormTags, DROPDOWN_PLACEHOLDER, SELECT_MAXSIZE } from "../../../../configs/config";
// ** Session get and set
import { globleVariable } from "../../../../configs/globalVariable";
import LocalFunction from "../../../../configs/getLocalFunction";
import { PageSize } from '@configs/config'
import SessionFunction from '../../../../configs/getSessionFunction'

import db from "@firebaseDb/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import DownloadHistoryLog from "../common/DownloadHistoryLog";
import { showTotalRowPerPage } from "../../../../helper/tableRowsPerPage";

registerAllModules();
let isActive = false;
const Gstr6download = ({ wizardBtn, data, btnType, tabRecord, childFunc }) => {


  let arrFilter = [];
  let arrFilterSummary = []

  useEffect(() => {
    childFunc.current = ClearFilter

  }, [childFunc.current]);
  // ** useState
  const [page, setPage] = useState(0);
  const [panData, setPanData] = useState([]);
  const [gstData, setGstData] = useState([]);
  const [panDataFrom, setPanDataFrom] = useState([]);
  const [backData, setBackData] = useState([]);
  const [selectData, setSelectData] = useState([]);
  const [pageCount, setPageCount] = useState(1);
  const [pageSize, setPageSize] = useState(PageSize);
  const [block, setBlock] = useState(false);
  const [finFromYear, setFinFormYear] = useState(null);
  const [finToYear, setFinToYear] = useState(null);
  const [monthFrom, setMonthFrom] = useState(null);
  const [monthTo, setMonthTo] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [checkUser, setCheckUser] = useState(false);
  const [currentCol, setCurrentCol] = useState([]);
  const [currentCol1, setCurrentCol1] = useState();
  const [searchVal1, setSearchVal1] = useState([]);
  // ** Download Grid
  const [currentColDownload, setCurrentColDownload] = useState([]);
  const [currentCol1Download, setCurrentCol1Download] = useState();
  const [searchVal1Download, setSearchVal1Download] = useState([]);

  const [activeHeaderBtn, setActiveHeaderBtn] = useState(false);

  const [searchDate, setSearchDate] = useState("");
  const [gridDataFilter, setGridDataFilter] = useState([]);
  const [reloadDownloadPage, setReloadDownloadPage] = useState(false)

  // const [perPageCount, setPerPageCount] = useState(PageSize);
  const [gstListData, setGstListData] = useState([])

  const [filteredData, setFilteredData] = useState([]);

  const [pageNoSelect, setPageNoSelect] = useState(paginationList[0]);
  const [rowsPerPage, setRowsPerPage] = useState(paginationList[0].value);

  const isMultipleDownload = localStorage.getItem(globleVariable.isMultipleDownload) && localStorage.getItem(globleVariable.isMultipleDownload)
  const G_UCID = sessionStorage.getItem(globleVariable.G_UCID) && SessionFunction.getSessionValue(globleVariable.G_UCID, true)
  const G_UCParId = sessionStorage.getItem(globleVariable.G_UCParId) && SessionFunction.getSessionValue(globleVariable.G_UCParId, true)
  const isCategory = isMultipleDownload === "true"; // For Check UserCategory
  const G_GSTIN = sessionStorage.getItem(globleVariable.G_GSTIN) && SessionFunction.getSessionValue(globleVariable.G_GSTIN, true)
  const subId =  localStorage.getItem( globleVariable.subscriptionId) &&  LocalFunction.getLocalValue(globleVariable.subscriptionId, true);


  let arr = [];
  let arrDownload = []
  const perPageCount = rowsPerPage;

  const historyRef = useRef();

  const hotRef = useRef(null);
  const hotRef1 = useRef(null);
  const hotRef2 = useRef(null);

  const navigate = useNavigate();

  //** Shortcut keys
  useHotkeys(
    keysMap.DOWNLOAD_GOVT_DATA,
    () => {
      block == false && checkUser == true ? onSubmit() : "";
    },
    { enableOnFormTags }
  );
  useHotkeys(
    keysMap.CLEAR_DATA,
    () => {
      block == false && ClearFilter();
    },
    { enableOnFormTags }
  );

  const UserId =
    localStorage.getItem(globleVariable.userId) &&
    LocalFunction.getLocalValue(globleVariable.userId, true);

  // ** Column - Download grid
  const invalidColumns = [
    { data: "isActive", type: "checkbox", readOnly: false, width: 20 ,
    columnSorting: {
      indicator: false,
      headerAction: false,
    }
  },
    {
      data: "gstinNumber",
      title: "GSTIN",
      width: 100,
    },
    {
      data: "companyName",
      title: "Company Name",
      width: 150,
    },
    {
      data: "userClientId",
      title: "Client Id",
      columnSorting: {
        indicator: false,
        headerAction: false,
      }
    },
  ];

  // ** Column - Download grid
  const emptyColumns = [
    { data: "isActive", readOnly: true, width: 20 },
    {
      data: "gstinNumber",
      title: "GSTIN",
      width: 100,
    },
    {
      data: "companyName",
      title: "Company Name",
      width: 150,
    },
    {
      data: "userClientId",
      title: "Client Id",
    },
  ];

  // ** Column - Download detail data grid
  const backgroundColumns = [
    {
      data: "gstinNumber",
      title: "GSTIN",
      width: 132,
    },
    {
      data: "company",
      title: "Company Name",
      width: 130,
    },

    {
      data: "requestedDate",
      title: "Last Date",

      // renderer: "date",
    },
    {
      data: "month",
      title: "Month",
    },
    {
      data: "status",
      title: "Status",
    },
    {
      data: "year",
      title: "Year",
      width: 50,
    },
    {
      data: "userClientId",
      title: "Client Id",
    },
  ];

  //** button - Action column
  function myLables(instance, td, row, col, prop, value, cellProperties) {
    Handsontable.renderers.TextRenderer.apply(this, arguments);
    td.innerHTML = `<div class="truncated">${value !== null && value !== "" ? value : ""}</div>`
  }


  const finYearOption = LocalFunction.getLocalValue(globleVariable.rangeFilters, true);
  const YearList = JSON.parse(finYearOption);


  useEffect(() => {
    return () => setBlock(false);
  }, []);

  useEffect(() => {
    if (
      sessionStorage.getItem(globleVariable.isCompany) == false ||
      sessionStorage.getItem(globleVariable.isCompany) == "false"
    ) {
      toast.error(LINK_MESSAGE, {
        position: "top-right",
      });

      setTimeout(() => {
        navigate("/dashboard/company");
      }, 1000);
    }
  }, []);

  // ** From Date
  const selectFromYear = (value) => {
    setFinFormYear(value?.value);
    setErrorMsg("");
    setFinToYear(value);
    setMonthTo(
      Number(monthTo?.srNo) > Number(value?.srNo) ? monthTo : panDataFrom[0]
    );

    const x = panDataFrom?.filter(
      (item) => Number(item.srNo) >= Number(value.srNo)
    );

    setPanData(x);
  };

  // ** To date
  const selectFromMonth = (value) => {
    setErrorMsg("");
    setMonthTo(value);
    setMonthFrom(value?.value);
  };

  // ** Pagination
  const handlePageClick = (event) => {
    setPage(event?.selected);
  };

  // ** MouseDown click - handsontable hotref
  function localAfterOnCellMouseDown(event, coords, td) {
    const hot = hotRef?.current?.hotInstance;
    const totalRows = hot?.countRows();
    setCurrentCol1Download(coords?.col);


    if (coords?.row == -1 && coords?.col == 0) {
      if (
        !event.target.classList.contains("checker1") ||
        event.target.classList.contains("checker1")
      ) {
        if (!activeHeaderBtn) {
          // isActive = true;
          setActiveHeaderBtn(true);
          for (let index = 0; index < totalRows; index++) {
            hot?.setDataAtCell(index, 0, true);
          }
        } else {
          // isActive = false;
          setActiveHeaderBtn(false);
          for (let index = 0; index < totalRows; index++) {
            hot?.setDataAtCell(index, 0, false);
          }
        }
      }
    }
    if (coords?.row !== -1 && coords?.col == 0) {
      let checkValue = hot?.getDataAtRowProp(coords?.row, "isActive");
      hot?.setDataAtCell(coords?.row, 0, !checkValue);
    }


    //** Set Value
    const Index = currentColDownload?.findIndex(
      (item) => invalidColumns[coords?.col]?.data == item
    );

    if (Index != -1) {
      setTimeout(function () {
        var searchInput = document?.querySelector(
          ".htUIMultipleSelectSearch.htUIInput"
        );
        if (searchInput !== null) {
          searchInput.children[0].value = searchVal1Download[Index];
        }
      }, 200);
    } else {
      setTimeout(function () {
        var searchInput = document?.querySelector(
          ".htUIMultipleSelectSearch.htUIInput"
        ); // searchInput.children[0].innerHTML ="hii1"
        if (searchInput !== null) {
          searchInput.children[0].value = "";
        }
      }, 100);
    }


  }

  // ** MouseDown click - handsontable hotref1
  function localAfterOnCellMouseDown1(event, coords, td) {
    setCurrentCol1(coords?.col);


    const Index = currentCol?.findIndex(
      (item) => backgroundColumns[coords?.col]?.data == item
    );

    if (Index != -1) {
      setTimeout(function () {
        var searchInput = document?.querySelector(
          ".htUIMultipleSelectSearch.htUIInput"
        );
        if (searchInput !== null) {
          searchInput.children[0].value = searchVal1[Index];
        }
      }, 200);
    } else {
      setTimeout(function () {
        var searchInput = document?.querySelector(
          ".htUIMultipleSelectSearch.htUIInput"
        ); // searchInput.children[0].innerHTML ="hii1"
        if (searchInput !== null) {
          searchInput.children[0].value = "";
        }
      }, 100);
    }
  }

  // ** handsontable  checkbox  column
  const colHeaders = (col) => {
    let txt;
    switch (col) {
      case 0:
        txt = "<input type='checkbox' class='checker1'  ";
        txt += activeHeaderBtn ? 'checked="checked"' : "";
        txt += ">";
        return txt;
    }
  };

  // ** Cell Change
  const cellChange = (change, source) => {
    const x = change?.length && change[0][0];
    console.log("length=", x);
    if (change?.length > 0) {
      if (change[0][1] == "isActive") {
        const k = gstData;
        let newK = [];
        k?.map((item, index) => {
          if (item?.isActive) {
            newK.push(item?.userClientId);
          }
        });
        console.log("y=", newK);
        setSelectData(newK);
      }
    }
  };

  // ** Download
  const onSubmit = () => {
    const checkCategoryData = !isCategory ? 1 : selectData?.length

    if (finFromYear && monthTo?.value && checkCategoryData) {
      setBlock(true);
      console.log("submit data", finFromYear, monthFrom, selectData);
      const payload = {
        fkUserId: subId,
        fkUserClientId: !isCategory ? [G_UCParId] : selectData,
        fromRange: finFromYear,
        toRange: monthTo?.value,
      };
      console.log("payload=", payload);
      gstr6aPurchaseInvoice
        .downloadMultiple(payload)
        .then((res) => {
          setBlock(false);

          if (
            res.status === 200 &&
            res.data.status === errorCodeConfig.APIDefaultCode.downloadOTPExpire
          ) {

            Swal.fire({
              confirmButtonText : "Enter OTP",
              icon: "warning",
              text:  res?.data?.successMessage,
              customClass: {
                confirmButton: "btn btn-outline-danger",
              },
              buttonsStyling: false,
            }).then(function() {
              navigate("/download-gstin/request-otp")

            })

          } else  if (
            res.status === 200 &&
            res.data.status === errorCodeConfig.APIDefaultCode.Success
          ) {

            toast.success(res?.data?.successMessage, {
              position: "top-right",
              duration: 7000,
            });

            funcSearch();
            setErrorMsg("");
            const hot = hotRef?.current?.hotInstance;
            // setCurrentCol1(coords?.col)
            const totalRows = hot?.countRows();
            for (let index = 0; index < totalRows; index++) {
              hot?.setDataAtCell(index, 0, false);
            }
            // isActive = false;
            setActiveHeaderBtn(false);

            gstr6filedService
              .checkUserProcess(UserId)
              .then((res) => {
                if (res.status === 200) {
                  console.log("res2=", res?.data);
                  setCheckUser(res?.data?.data);
                }
              })
              .catch((error) => {
                setBlock(false);
                Swal.fire({
                  icon: "error",
                  title: "",
                  text: error?.message,
                  customClass: {
                    confirmButton: "btn btn-danger",
                  },
                  buttonsStyling: false,
                });
              });
          } else {
            Swal.fire({
              icon: "error",
              title: "",
              text: res?.data?.errorMessage,
              customClass: {
                confirmButton: "btn btn-danger",
              },
              buttonsStyling: false,
            });
            setBlock(false);
            const hot = hotRef?.current?.hotInstance;
            const totalRows = hot?.countRows();
            for (let index = 0; index < totalRows; index++) {
              hot?.setDataAtCell(index, 0, false);
            }
            // isActive = false;
            setActiveHeaderBtn(false);
          }
        })
        .catch((error) => {
          setBlock(false);
          Swal.fire({
            icon: "error",
            title: "",
            text: error?.message,
            customClass: {
              confirmButton: "btn btn-danger",
            },
            buttonsStyling: false,
          });
        });

      // isActive = false;
      setActiveHeaderBtn(false);
      const hot = hotRef?.current?.hotInstance;
      const totalRows = hot?.countRows();
      for (let index = 0; index < totalRows; index++) {
        hot?.setDataAtCell(index, 0, false);
      }
    } else {
      if (isCategory) {
        if (!selectData?.length) {
          setErrorMsg("Please select atleast one gst number!");
        } else {
          setErrorMsg("Please fill all dates!");
        }
      } else {
        setErrorMsg("Please fill all dates!");
      }
      setBlock(false);
    }
  };

  // ** Search
  const funcSearch = (refreshData) => {
    const payload = {
      userId: subId,
      pageStart: page + 1,
      pageSize: pageSize,
      orderByColumnName: "",
      orderBy: "",
      searchColumnName:
        refreshData !== null && refreshData !== "" && refreshData !== undefined
          ? []
          : currentCol,
      type: "6a",
      searchValue:
        refreshData !== null && refreshData !== "" && refreshData !== undefined
          ? []
          : searchVal1,
    };

    setBlock(true);
    gstr6filedService
      .backgroundPagination(payload)
      .then((res) => {
        if (
          res.status === 200 &&
          res.data.status === errorCodeConfig.APIDefaultCode.Success
        ) {
          setBlock(false);


          if (!isCategory) {

            const filterData = res?.data?.data?.filter(p => p.gstinNumber == G_GSTIN);

          if (filterData !== undefined ) {
              setPageCount(filterData?.length  / 10);
            }
            setBackData(filterData);
            setGridDataFilter(filterData);

          } else {
            setPageCount(res?.data?.data[0]?.totalRowCount / PageSize);
            setBackData(res?.data?.data);
            setGridDataFilter(res?.data?.data);
          }


          setReloadDownloadPage(pre => !pre)
          const GstDatas = res?.data?.data.map((x) => x.uniqueId);

          GstDatas.forEach((data1) =>
            getStatusDataRealTime(data1, (data2) => {

              if (data2.status == '0') {

                setBackData(prevData => {
                  return prevData.map(data => {
                    if (data.uniqueId === data1) { // Check against data1, not loopData
                      return { ...data, status: "Pending" };
                    }
                    return data;
                  });
                });

                setGridDataFilter(prevData => {
                  return prevData.map(data => {
                    if (data.uniqueId === data1) { // Check against data1, not loopData
                      return { ...data, status: "Pending" };
                    }
                    return data;
                  });
                });

              } else if (data2.status == '1') {

                setBackData(prevData => {
                  return prevData.map(data => {
                    if (data.uniqueId === data1) { // Check against data1, not loopData
                      return { ...data, status: "In Progress" };
                    }
                    return data;
                  });
                });

                setGridDataFilter(prevData => {
                  return prevData.map(data => {
                    if (data.uniqueId === data1) { // Check against data1, not loopData
                      return { ...data, status: "In Progress" };
                    }
                    return data;
                  });
                });

              } else if (data2.status == '2') {

                setBackData(prevData => {
                  return prevData.map(data => {
                    if (data.uniqueId === data1) { // Check against data1, not loopData
                      return { ...data, status: "Success" };
                    }
                    return data;
                  });
                });

                setGridDataFilter(prevData => {
                  return prevData.map(data => {
                    if (data.uniqueId === data1) { // Check against data1, not loopData
                      return { ...data, status: "Success" };
                    }
                    return data;
                  });
                });
              } else if (data2.status == '3') {

                setBackData(prevData => {
                  return prevData.map(data => {
                    if (data.uniqueId === data1) { // Check against data1, not loopData
                      return { ...data, status: "Failed" };
                    }
                    return data;
                  });
                });

                setGridDataFilter(prevData => {
                  return prevData.map(data => {
                    if (data.uniqueId === data1) { // Check against data1, not loopData
                      return { ...data, status: "Failed" };
                    }
                    return data;
                  });
                });
              }
              else if (data2.status == '4') {

                setBackData(prevData => {
                  return prevData.map(data => {
                    if (data.uniqueId === data1) { // Check against data1, not loopData
                      return { ...data, status: "Token" };
                    }
                    return data;
                  });
                });

                setGridDataFilter(prevData => {
                  return prevData.map(data => {
                    if (data.uniqueId === data1) { // Check against data1, not loopData
                      return { ...data, status: "Token" };
                    }
                    return data;
                  });
                });
              }

              else if (data2.status == '5') {

                setBackData(prevData => {
                  return prevData.map(data => {
                    if (data.uniqueId === data1) { // Check against data1, not loopData
                      return { ...data, status: "Authentication Failed" };
                    }
                    return data;
                  });
                });

                setGridDataFilter(prevData => {
                  return prevData.map(data => {
                    if (data.uniqueId === data1) { // Check against data1, not loopData
                      return { ...data, status: "Authentication Failed" };
                    }
                    return data;
                  });
                });
              }
            }))


        } else {
          setBlock(false);
          // toast.error(res?.data?.errorMessage, {
          //   position: "top-right",
          //   duration: 7000,
          // });
        }
      })
      .catch((error) => {
        setBlock(false);
        Swal.fire({
          icon: "error",
          title: "",
          text: error?.message,
          customClass: {
            confirmButton: "btn btn-danger",
          },
          buttonsStyling: false,
        });
      });
  };


  // ** GST - Search
  const getGst = (value) => {
    setBlock(true);
    gstr6filedService
      .getGstr6PanSummary(UserId, value ? value : "")
      .then((res) => {
        if (res.status === 200) {
          setBlock(false);
          setGstData(res?.data?.data?.gstinList);
          setGstListData(res?.data?.data?.gstinList);
          setPanData(YearList);
          setPanDataFrom(YearList);
        }
      })
      .catch((error) => {
        setBlock(false);
        Swal.fire({
          icon: "error",
          title: "",
          text: error?.message,
          customClass: {
            confirmButton: "btn btn-danger",
          },
          buttonsStyling: false,
        });
      });
  };

  useEffect(() => {
    gstr6filedService
      .getGstr6PanSummary(UserId, "")
      .then((res) => {
        if (res.status === 200) {
          setGstData(res?.data?.data?.gstinList);
          setGstListData(res?.data?.data?.gstinList);
          setPanData(YearList);
          setPanDataFrom(YearList);
        }
      })
      .catch((error) => {
        // setBlock(false)
        Swal.fire({
          icon: "error",
          title: "",
          text: error?.message,
          customClass: {
            confirmButton: "btn btn-danger",
          },
          buttonsStyling: false,
        });
      });

    gstr6filedService
      .checkUserProcess(UserId)
      .then((res) => {
        if (res.status === 200) {
          setCheckUser(res?.data?.data);
        }
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "",
          text: error?.message,
          customClass: {
            confirmButton: "btn btn-danger",
          },
          buttonsStyling: false,
        });
      });
  }, []);

  // ** Pagniation Search
  useEffect(() => {
    funcSearch();
  }, []);

  const theader = (col, TH) => {
    if (col === 0) {
      const button = TH.children[0].children[0];
      button.parentNode.removeChild(button);
    }
    TH.className = "htLeft";


    if (currentColDownload.length > 0) {

      let uniq = [...new Set(currentColDownload)];

      for (let i = 0; i < uniq.length; i++) {
        var obj = {};

        for (let j = 0; j < searchVal1Download.length; j++) {
          if (i == j) {
            obj[uniq[i]] = searchVal1Download[j]?.trim();
            arrFilter.push(obj);
          }
        }
      }

      let finalObj = {};
      for (let i = 0; i < arrFilter.length; i++) {
        Object.assign(finalObj, arrFilter[i]);
      }

      console.log(arrFilter, "arrFilter")

      invalidColumns.forEach((ele, index) => {
        const columnIndex = index;
        const buttonExists = document.querySelector(`#hotDownload .ht_clone_top thead th:nth-child(${columnIndex + 1}) button`);

        const columnMatchesCondition = Object.keys(finalObj).includes(ele.data);

        // Check if column value is not null
        const columnValueValid = finalObj[ele.data] !== null && finalObj[ele.data] !== "";

        if (buttonExists && columnMatchesCondition && columnValueValid) {
          const TH = document.querySelector(`#hotDownload .ht_clone_top thead th:nth-child(${columnIndex + 1})`);
          console.log("active filter", buttonExists, finalObj[ele.data])
          if (TH) {
            TH.classList.add("htFiltersActive");
          } else {
            TH.classList.remove("htFiltersActive");
          }
        }
      });
    }

  };

  const theader1 = (col, TH) => {
    if (col === 2) {
      const button = TH.children[0].children[0];
      button.parentNode.removeChild(button);
    }

    TH.className = "htLeft";

    if (currentCol.length > 0) {

      let uniq = [...new Set(currentCol)];

      for (let i = 0; i < uniq.length; i++) {
        var obj = {};

        for (let j = 0; j < searchVal1.length; j++) {
          if (i == j) {
            obj[uniq[i]] = searchVal1[j]?.trim();
            arrFilterSummary.push(obj);
          }
        }
      }

      let finalObj = {};
      for (let i = 0; i < arrFilterSummary.length; i++) {
        Object.assign(finalObj, arrFilterSummary[i]);
      }


      backgroundColumns.forEach((ele, index) => {
        const columnIndex = index;
        const buttonExists = document.querySelector(`#hotSummary .ht_clone_top thead th:nth-child(${columnIndex + 1}) button`);

        const columnMatchesCondition = Object.keys(finalObj).includes(ele.data);

        // Check if column value is not null
        const columnValueValid = finalObj[ele.data] !== null && finalObj[ele.data] !== "";

        if (buttonExists && columnMatchesCondition && columnValueValid) {
          const TH = document.querySelector(`#hotSummary .ht_clone_top thead th:nth-child(${columnIndex + 1})`);
          //  console.log("active filter-2" , buttonExists ,  finalObj[ele.data]  )
          if (TH) {
            TH.classList.add("htFiltersActive");
          } else {
            TH.classList.remove("htFiltersActive");
          }
        }
      });
    }

  };

  const var1 = document?.querySelector("htUIMultipleSelectHot");
  console.log("var1", var1);
  if (var1) {
    var1.style.display = "none";
  }

  function emptyRender(instance, td, row, col, prop, value, cellProperties) {
    textRenderer.apply(this, arguments);
    if (value?.toLowerCase() == "failed") {

      td.className = "text-danger-error-red";
    } else if (value?.toLowerCase() == "success") {
      td.className = "text-success";
    } else if (value?.toLowerCase() == "in progress") {
      td.className = "text-info";
    } else if (value?.toLowerCase() == "pending") {
      td.className = "text-warning";
    } else if (value?.toLowerCase() == "token") {
      td.className = "text-warning";
    } else if (value?.toLowerCase() == "authentication failed") {
      td.className = "text-warning";
    }
  }

  function splitRender(instance, td, row, col, prop, value, cellProperties) {
    textRenderer.apply(this, arguments);
    // if row contains negative number
    if (value) {
      td.innerText = value.slice(0, 11);
    }
  }

  //** Clear filter
  const ClearFilter = () => {
    setCurrentCol([]);
    setCurrentCol1();
    setSearchVal1([]);
    setSearchDate("");
    setCurrentColDownload([]);
    setCurrentCol1Download();
    setSearchVal1Download([]);

    const hot = hotRef?.current?.hotInstance;
    const totalRows = hot?.countRows();
    for (let index = 0; index < totalRows; index++) {
      hot?.setDataAtCell(index, 0, false);
    }
    setActiveHeaderBtn(false);

    setGstData(gstListData);
     historyRef?.current?.clearFilter();
  };

  // ** Filter
  function FilterData(arr) {
    let addArr = [];

    let updatedData = [];
    let finalObj = {};

    for (let i = 0; i < arr.length; i++) {
      Object.assign(finalObj, arr[i]);
    }

    updatedData = gridDataFilter
      .filter((item) =>
        finalObj.gstinNumber?.length
          ? item.gstinNumber?.toString().toLowerCase().includes(finalObj?.gstinNumber?.toString().toLowerCase())
          : item
      )
      .filter((data) =>
        finalObj.month?.length ? data.month.toString().toLowerCase().includes(finalObj.month?.toString().toLowerCase()) : data
      )
      .filter((companydata) =>
        finalObj.company?.length
          ? companydata.company?.toString().toLowerCase().includes(finalObj.company?.toString().toLowerCase())
          : companydata
      )
      .filter((statusdata) =>
        finalObj.status?.length
          ? statusdata.status?.toString().toLowerCase().includes(finalObj.status?.toString().toLowerCase())
          : statusdata
      );

    addArr.push(...updatedData);
    let uniq = [...new Set(addArr)];

    return uniq;
  }

  function gstListFilter(arr) {
    //  debugger
    let addArr = [];
    var flag = false;
    let updatedData = [];
    let finalObj = {}

    for (let i = 0; i < arr.length; i++) {
      Object.assign(finalObj, arr[i]);
    }

    updatedData = gstListData
      .filter((item) =>
        finalObj.gstinNumber?.length ? item.gstinNumber?.toLowerCase().includes(finalObj.gstinNumber.toLowerCase()) : item
      )
      .filter((companydata) =>
        finalObj.companyName?.length ? companydata.companyName?.toLowerCase().includes(finalObj.companyName?.toLowerCase()) : companydata
      )

    flag = true;

    addArr.push(...updatedData);
    setPage(0);

    console.log(addArr.length);

    let uniq = [...new Set(addArr)];
    console.log("unique", uniq.length);
    return uniq;
  }


  //** Pagination set
  const pageCountWithout = Math.ceil(
    filteredData?.length && filteredData?.length / perPageCount
  );
  const para1 = page * perPageCount;
  const para2 = page * perPageCount + perPageCount;
  let dataWithout = backData && backData.slice(para1, para2);


  const getStatusDataRealTime = (documentId, callback) => {
    console.log(documentId, "documentId-documentId");
    const documentRef = doc(db, "MultipleDownloadData6A", String(documentId));

    const unsubscribe = onSnapshot(documentRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const documentData = docSnapshot.data();
        console.log(documentData, "realtime data")
        const res = documentData;
        const obj = {
          status: res?.status,
        };
        callback(obj);
      } else {
        console.log("Document does not exist");
        callback({});
      }
    });
    return unsubscribe;
  };

  return (
    <Fragment>
      {block && <div className="loading1">Loading&#8230;</div>}
      <div
      // style={{ display: "flex", flexDirection: "column" }}
      >
        <div
        // style={{ marginBottom: "10px", marginRight: "20px" }}
        >
          <Row
          // style={{ marginBottom: "10px" }}
          >
            <Col md="2">
              <Label className="requiredlable">From</Label>
              <Select
                id="fromdate"
                placeholder={DROPDOWN_PLACEHOLDER}
                maxMenuHeight={SELECT_MAXSIZE}
                isClearable={false}
                theme={selectThemeColors}
                closeMenuOnSelect={true}
                components={animatedComponents}
                options={panDataFrom}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={selectFromYear}
                value={finToYear}
              />
            </Col>
            <Col md="2">
              <Label className="requiredlable">To</Label>
              <Select
                id="toDate"
                placeholder={DROPDOWN_PLACEHOLDER}
                isClearable={false}
                theme={selectThemeColors}
                closeMenuOnSelect={true}
                maxMenuHeight={SELECT_MAXSIZE}
                components={animatedComponents}
                options={panData}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={selectFromMonth}
                value={monthTo}
              />
            </Col>
            <Col md="2" className="mb-1 mt-2 pt3">
              <div
              // style={{ marginTop: "18px" }}
              >
                <Button
                  color="danger"
                  onClick={onSubmit}
                  disabled={!checkUser}
                  className= {!checkUser ? "btn-icon btn-round disabledBtn" : "btn-icon btn-round"}
                  id="downloaddata"
                  outline
                >
                  <DownloadCloud size={14} /> {"     "}
                  Download
                </Button>
                <UncontrolledTooltip placement="top" target="downloaddata">
                  Download [{keysMap.DOWNLOAD_GOVT_DATA}]
                </UncontrolledTooltip>
                <p className="text-danger-error-red mt-1">{errorMsg}</p>
              </div>
            </Col>

            <Col md="6" className="mb-1 mt-2 pt3">
                {
                  !checkUser  &&  <Alert color='danger'>
                  <div className='alert-body'>
                    <AlertCircle size={15} />{' '}
                    <span className='ms-1'>
                    Data download is already in progress. please try again after some time.
                    </span>
                  </div>
                </Alert>
                  }
                </Col>

          </Row>
        </div>

        <div>
          <Row>
            <Col hidden={!isCategory} md="6" className="pl-1">
              <h3 className="heading-font-18-weight">List Of Companies</h3>
            </Col>

            <Col md="6" className="pl-1">
              <h3 className="heading-font-18-weight">Download History Log</h3>
            </Col>
          </Row>
        </div>
        <div
          className=""
        // style={{
        //   maxHeight: "350px",
        //   overflowY: "auto",
        //   overflowX: "hidden",
        // }}
        >
          <Row>
            <Col hidden={!isCategory} md={6}>

              {gstData?.length ? (
                <HotTable
                  id="hotDownload"
                  // autoColumnSize={true}
                  columnSorting={true}
                  fixedRowsTop={0}
                  stretchH="all"
                  ref={hotRef}
                  rowHeights={RowSize}
                  autoColumnSize={{
                    samplingRatio: 23  // Adjust the samplingRatio as needed
                  }}
                  manualColumnResize={true}
                  columnHeaderHeight={columnHeaderSize}
                  data={gstData !== undefined && gstData !== null && gstData !== "" ? gstData : []}
                  preventOverflow="horizontal"
                  rowHeaders={false}
                  columns={invalidColumns}
                  height={380}
                  colHeaders={(x) => colHeaders(x)}
                  comments={true}
                  afterChange={(x, y) => cellChange(x, y)}
                  // commentedCellClassName="custom-cell"
                  afterGetColHeader={theader}
                  dropdownMenu={{
                    items: {
                      filter_by_value: {
                        name: "Search Value",
                      },

                      clear: {
                        name: `<button id='btnClear' name='Clear'  tabIndex="-1"  value='Clear'>Clear</button>`,
                        callback: function (key, selection, clickEvent) {
                          console.log("date picker clicked");
                          var src = clickEvent.target;
                          console.log("name", src.tagName);
                          if (src.tagName.toLowerCase() === "button") {
                            if (clickEvent.target.id == "btnClear") {
                              var searchInput = document.querySelector(
                                ".htUIMultipleSelectSearch.htUIInput"
                              );
                              var value = ""; // alert(data);

                              const x = searchVal1Download;
                              if (!searchVal1Download?.length) {
                                x.push(value);
                                let y = currentColDownload;
                                y.push(invalidColumns[currentCol1Download]?.data);
                                setSearchVal1Download(x);
                                setCurrentColDownload(y);

                              } else {
                                const Index = currentColDownload?.findIndex(
                                  (item) => invalidColumns[currentCol1Download]?.data == item
                                );

                                if (Index != -1) {
                                  const xyz = searchVal1Download;
                                  xyz[Index] = value;
                                  setSearchVal1Download(xyz);
                                } else {
                                  x.push(value);
                                  let y = currentColDownload;
                                  y.push(invalidColumns[currentCol1Download]?.data);
                                  // console.log("jsx=",x,y)
                                  setSearchVal1Download(x);
                                  setCurrentColDownload(y);
                                }
                              }

                              // page == 0 ? getGst() : setPage(0);

                              let uniq = [...new Set(currentColDownload)];

                              for (let i = 0; i < uniq.length; i++) {
                                var obj = {};

                                for (let j = 0; j < searchVal1Download.length; j++) {
                                  console.log(searchVal1Download[j])
                                  if (i == j) {
                                    obj[uniq[i]] = searchVal1Download[j];
                                    arrDownload.push(obj)
                                  }
                                }
                              }
                              let newFilterData = gstListFilter(arrDownload);
                              setGstData([...newFilterData])
                            }
                            clickEvent.stopImmediatePropagation();
                          }
                          console.log("custom value", src.value);
                          clickEvent.stopImmediatePropagation();
                        },
                      },
                      filter_action_bar: {},
                    },
                  }}
                  filters={true}
                  afterFilter={function (data) {
                    var searchInput = document.querySelector(
                      ".htUIMultipleSelectSearch.htUIInput"
                    );
                    var value = searchInput.children[0].value; // alert(data);

                    const x = searchVal1Download;
                    if (!searchVal1Download?.length) {
                      x.push(value);
                      let y = currentColDownload;
                      y.push(invalidColumns[currentCol1Download]?.data);
                      setSearchVal1Download(x);
                      setCurrentColDownload(y);

                    } else {
                      const Index = currentColDownload?.findIndex(
                        (item) => invalidColumns[currentCol1Download]?.data == item
                      );

                      if (Index != -1) {
                        const xyz = searchVal1Download;
                        xyz[Index] = value;
                        setSearchVal1Download(xyz);
                      } else {
                        x.push(value);
                        let y = currentColDownload;
                        y.push(invalidColumns[currentCol1Download]?.data);
                        // console.log("jsx=",x,y)
                        setSearchVal1Download(x);
                        setCurrentColDownload(y);
                      }
                    }
                    let uniq = [...new Set(currentColDownload)];

                    for (let i = 0; i < uniq.length; i++) {
                      var obj = {};

                      for (let j = 0; j < searchVal1Download.length; j++) {
                        console.log(searchVal1Download[j])
                        if (i == j) {
                          obj[uniq[i]] = searchVal1Download[j];
                          arrDownload.push(obj)
                        }
                      }
                    }
                    let newFilterData = gstListFilter(arrDownload);
                    setGstData([...newFilterData])

                    // ** filter
                    // getGst(value);
                  }}
                  cells={function (row, col, prop) {

                    const cellPrp = {};

                    if (col == 2) {
                      if (col == 2) {
                        if (gstData[row]?.companyName?.length > 44) {
                          cellPrp.comment = {
                            value: gstData[row]?.companyName, style: { width: 200, height: 50 },
                            readOnly: true
                          }
                        }
                      }
                      cellPrp.renderer = myLables;
                    }
                    return cellPrp;
                  }}
                  nestedRows={true}
                  afterOnCellMouseDown={localAfterOnCellMouseDown}
                  contextMenu={false}
                  bindRowsWithHeaders={true}
                  readOnly={btnType == "btnInvalidData" ? false : true}
                  licenseKey="non-commercial-and-evaluation"
                  hiddenColumns={{
                    columns: [3],
                  }}
                  mergeCells={false}
                />
              ) : (
                <HotTable
                  id="hotDownload"
                  // autoColumnSize={true}
                  stretchH="all"
                  rowHeights={RowSize}
                  autoColumnSize={{
                    samplingRatio: 23  // Adjust the samplingRatio as needed
                  }}
                  manualColumnResize={true}
                  columnHeaderHeight={columnHeaderSize}
                  // style={{ textAlign: "center" }}
                  data={[{ isActive: "No Data Found!" }]}
                  mergeCells={[{ row: 0, col: 0, rowspan: 1, colspan: 3 }]}
                  columns={emptyColumns}
                  nestedRows={true}
                  contextMenu={false}
                  bindRowsWithHeaders={true}
                  licenseKey="non-commercial-and-evaluation"
                  height="auto"
                  afterGetColHeader={theader}
                  cells={function (row, col) {
                    var cp = {};

                    if (col == 0) {

                      cp.className = "text-center";
                    }
                    return cp;

                  }}
                  dropdownMenu={{
                    items: {
                      filter_by_value: {
                        name: "Search Value",
                      },

                      clear: {
                        name: `<button id='btnClear' name='Clear'   tabIndex="-1" value='Clear'>Clear</button>`,
                        //disabled: true,
                        callback: function (key, selection, clickEvent) {
                          console.log("date picker clicked");
                          var src = clickEvent.target;
                          console.log("name", src.tagName);
                          if (src.tagName.toLowerCase() === "button") {
                            if (clickEvent.target.id == "btnClear") {
                              var searchInput = document.querySelector(
                                ".htUIMultipleSelectSearch.htUIInput"
                              );
                              var value = ""; // alert(data);

                              const x = searchVal1Download;
                              if (!searchVal1Download?.length) {
                                x.push(value);
                                let y = currentColDownload;
                                y.push(invalidColumns[currentCol1Download]?.data);
                                setSearchVal1Download(x);
                                setCurrentColDownload(y);

                              } else {
                                const Index = currentColDownload?.findIndex(
                                  (item) => invalidColumns[currentCol1Download]?.data == item
                                );

                                if (Index != -1) {
                                  const xyz = searchVal1Download;
                                  xyz[Index] = value;
                                  setSearchVal1Download(xyz);
                                } else {
                                  x.push(value);
                                  let y = currentColDownload;
                                  y.push(invalidColumns[currentCol1Download]?.data);
                                  // console.log("jsx=",x,y)
                                  setSearchVal1Download(x);
                                  setCurrentColDownload(y);
                                }
                              }

                              // page == 0 ? getGst() : setPage(0);
                              let uniq = [...new Set(currentColDownload)];

                              for (let i = 0; i < uniq.length; i++) {
                                var obj = {};

                                for (let j = 0; j < searchVal1Download.length; j++) {
                                  console.log(searchVal1Download[j])
                                  if (i == j) {
                                    obj[uniq[i]] = searchVal1Download[j];
                                    arrDownload.push(obj)
                                  }
                                }
                              }
                              let newFilterData = gstListFilter(arrDownload);
                              setGstData([...newFilterData])
                            }

                            clickEvent.stopImmediatePropagation();
                          }
                          clickEvent.stopImmediatePropagation();
                        },
                      },
                      filter_action_bar: {},
                    },
                  }}
                  afterFilter={function (data) {
                    var searchInput = document.querySelector(
                      ".htUIMultipleSelectSearch.htUIInput"
                    );
                    var value = searchInput.children[0].value; // alert(data);
                    const x = searchVal1Download;
                    if (!searchVal1Download?.length) {
                      x.push(value);
                      let y = currentColDownload;
                      y.push(invalidColumns[currentCol1Download]?.data);
                      setSearchVal1Download(x);
                      setCurrentColDownload(y);

                    } else {
                      const Index = currentColDownload?.findIndex(
                        (item) => invalidColumns[currentCol1Download]?.data == item
                      );

                      if (Index != -1) {
                        const xyz = searchVal1Download;
                        xyz[Index] = value;
                        setSearchVal1Download(xyz);
                      } else {
                        x.push(value);
                        let y = currentColDownload;
                        y.push(invalidColumns[currentCol1Download]?.data);
                        setSearchVal1Download(x);
                        setCurrentColDownload(y);
                      }
                    }

                    // getGst(value);
                    let uniq = [...new Set(currentColDownload)];

                    for (let i = 0; i < uniq.length; i++) {
                      var obj = {};

                      for (let j = 0; j < searchVal1Download.length; j++) {
                        console.log(searchVal1Download[j])
                        if (i == j) {
                          obj[uniq[i]] = searchVal1Download[j];
                          arrDownload.push(obj)
                        }
                      }
                    }
                    let newFilterData = gstListFilter(arrDownload);
                    setGstData([...newFilterData])
                  }}

                  filters={true}
                  readOnly={true}
                  hiddenColumns={{
                    columns: [3]
                  }}
                />
              )}
            </Col>
            <Col md={!isCategory ? 12 : 6}>
              <DownloadHistoryLog filteredData={filteredData} reloadDownloadPage={reloadDownloadPage} gridDataFilter={gridDataFilter} perPageCount={perPageCount} setFilteredData={setFilteredData} page={page} setPage={setPage} ref={historyRef} />
            </Col>
          </Row>
        </div>


        <div>
          {backData?.length ? (
            <>
              <Row className="justify-content-end mx-0">
                <Col
                  className="d-flex align-items-center justify-content-end"
                  md="12"
                  sm="12"
                >
                  {paginationTitle}&nbsp; &nbsp;  <Select
                    id="pageId"
                    isClearable={false}
                    theme={selectThemeColors}
                    closeMenuOnSelect={true}
                    options={paginationList}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    components={animatedComponents}
                    onChange={(e) => {
                      setPageNoSelect(e);
                      setRowsPerPage(e.value);
                      setPage(0);
                    }}
                    value={pageNoSelect}
                    menuPlacement="auto"
                  />

                  &nbsp; &nbsp;
                  <span>
                    <strong> {``} </strong>{" "}
                  </span>{" "}
                  &nbsp; &nbsp;
                  {showTotalRowPerPage(page, rowsPerPage, filteredData?.length ?? 0)}
                    &nbsp; &nbsp; &nbsp;
                  <ReactPaginate
                    breakLabel="..."
                    nextLabel=""
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={2}
                    pageCount={pageCountWithout}
                    previousLabel=""
                    renderOnZeroPageCount={null}
                    forcePage={page}
                    marginPagesDisplayed={2}
                    activeClassName="active"
                    pageClassName="page-item"
                    breakClassName="page-item"
                    nextLinkClassName="page-link"
                    pageLinkClassName="page-link"
                    breakLinkClassName="page-link"
                    previousLinkClassName="page-link"
                    nextClassName="page-item next-item"
                    previousClassName="page-item prev-item"
                    containerClassName="pagination react-paginate separated-pagination pagination-sm justify-content-end pe-1 mt-1"
                  />
                </Col>
              </Row>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    </Fragment>
  );
};
export default Gstr6download;
