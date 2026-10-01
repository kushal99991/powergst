import { HotTable } from "@handsontable/react";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import { selectThemeColors } from "@utils";
import Handsontable from "handsontable";
import { registerAllModules } from "handsontable/registry";
import { textRenderer } from "handsontable/renderers";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { AlertCircle, DownloadCloud } from "react-feather";
import toast from "react-hot-toast";
import ReactPaginate from "react-paginate";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { Alert, Button, Col, Label, Row, UncontrolledTooltip } from "reactstrap";
import Swal from "sweetalert2";
import errorCodeConfig from "@configs/apiErrorCodeConfig";
import { columnHeaderSize, LINK_MESSAGE, PageSize, RowSize } from "@configs/config";
import GSTR9CFiledService from "../../../../services/gstr9CFiled/gstr9CFiledService";

import { useHotkeys } from "react-hotkeys-hook";
import { enableOnFormTags, keysMap } from "@configs/config";

// ** Session get and set
import LocalFunction from "@configs/getLocalFunction";
import SessionFunction from "@configs/getSessionFunction";
import { globleVariable } from "@configs/globalVariable";

import db from "@firebaseDb/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import DownloadHistoryLog from "../common/DownloadHistoryLog";
import { paginationList, paginationTitle } from "../../../../configs/config";
import { showTotalRowPerPage } from "../../../../helper/tableRowsPerPage";

const animatedComponents = makeAnimated();

registerAllModules();

let isActive = false;

const GSTR9Download = ({ btnType, childFunc }) => {
  let arrFilter = [];
  let arrFilterSummary = [];

  useEffect(() => {
    childFunc.current = ClearFilter;
  }, [childFunc.current]);

  const UserId = LocalFunction.getLocalValue(globleVariable.userId, true);
  const G_GSTIN =
    sessionStorage.getItem(globleVariable.G_GSTIN) &&
    SessionFunction.getSessionValue(globleVariable.G_GSTIN, true);
    const subId =  localStorage.getItem( globleVariable.subscriptionId) &&  LocalFunction.getLocalValue(globleVariable.subscriptionId, true);
    const G_UCParId = sessionStorage.getItem(globleVariable.G_UCParId) && SessionFunction.getSessionValue(globleVariable.G_UCParId, true)

  const [page, setPage] = useState(0);
  const [gstData, setGstData] = useState([]);
  const [gstListData, setGstListData] = useState([]);
  const [backData, setBackData] = useState([]);
  const [selectData, setSelectData] = useState([]);
  const [pageCount, setPageCount] = useState(1);
  const [block, setBlock] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [checkUser, setCheckUser] = useState(false);
  const store = useSelector((state) => state.excelData);
  const [currentCol, setCurrentCol] = useState([]);
  const [currentCol1, setCurrentCol1] = useState();
  const [searchVal1, setSearchVal1] = useState([]);
  // ** Download Grid
  const [currentColDownload, setCurrentColDownload] = useState([]);
  const [currentCol1Download, setCurrentCol1Download] = useState();
  const [searchVal1Download, setSearchVal1Download] = useState([]);

  const [searchDate, setSearchDate] = useState("");

  const [activeHeaderBtn, setActiveHeaderBtn] = useState(false);

  const [gridDataFilter, setGridDataFilter] = useState([]);
  const [reloadDownloadPage, setReloadDownloadPage] = useState(false)

  const [filteredData, setFilteredData] = useState([]);

  const [pageNoSelect, setPageNoSelect] = useState(paginationList[0]);
  const [rowsPerPage, setRowsPerPage] = useState(paginationList[0].value);

  
  const [selectedFromYear, setSelectedFromYear] = useState(null);
  const [selectedToYear, setSelectedToYear] = useState(null);

  let arr = [];
  let arrDownload = [];

  // configure page count
  const perPageCount = rowsPerPage;

  const hotRef = useRef(null);
  const hotRef1 = useRef(null);
  const hotRef2 = useRef(null);

  const historyRef = useRef();

  const navigate = useNavigate();

  //** Shortcut keys
  useHotkeys(
    keysMap.DOWNLOAD_GOVT_DATA,
    () => {
      block == false && checkUser == true ? onSubmit() : "";
    },
    { enableOnFormTags },
  );
  useHotkeys(
    keysMap.CLEAR_DATA,
    () => {
      block == false && ClearFilter();
    },
    { enableOnFormTags },
  );

  const invalidColumns = [
    {
      data: "isActive",
      type: "checkbox",
      readOnly: false,
      width: 20,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
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
      },
    },
  ];

  const emptyColumns = [
    { data: "isActive", readOnly: true, width: 20 },
    {
      data: "gstinNumber",
      title: "GSTIN",
    },
    {
      data: "companyName",
      title: "Company Name",
    },
    {
      data: "userClientId",
      title: "Client Id",
    },
  ];

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
  function myLabels(instance, td, row, col, prop, value, cellProperties) {
    Handsontable.renderers.TextRenderer.apply(this, arguments);
    td.innerHTML = `<div class="truncated">${value !== null && value !== "" ? value : ""}</div>`;
  }

  const isMultipleDownload =
    localStorage.getItem(globleVariable.isMultipleDownload) &&
    localStorage.getItem(globleVariable.isMultipleDownload);

    const isCategory = isMultipleDownload === "true"

  // get list of year option
  const decryptedUserData = LocalFunction.getLocalValue(globleVariable.userData, true);
  const userData = decryptedUserData && JSON.parse(decryptedUserData);
  const yearOptions = userData && userData.data.rangeFiltersGSTR9C;

  useEffect(() => {
    if (
      sessionStorage.getItem("isCompany") == false ||
      sessionStorage.getItem("isCompany") == "false"
    ) {
      toast.error(LINK_MESSAGE, {
        position: "top-right",
      });

      setTimeout(() => {
        navigate("/dashboard/company");
      }, 1000);
    }
  }, []);

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
      (item) => invalidColumns[coords?.col]?.data == item,
    );

    if (Index != -1) {
      setTimeout(function () {
        var searchInput = document?.querySelector(".htUIMultipleSelectSearch.htUIInput");
        if (searchInput !== null) {
          searchInput.children[0].value = searchVal1Download[Index];
        }
      }, 200);
    } else {
      setTimeout(function () {
        var searchInput = document?.querySelector(".htUIMultipleSelectSearch.htUIInput");
        if (searchInput !== null) {
          searchInput.children[0].value = "";
        }
      }, 100);
    }
  }

  // ** MouseDown click - handsontable hotref1
  function localAfterOnCellMouseDown1(event, coords, td) {
    setCurrentCol1(coords?.col);
    const Index = currentCol?.findIndex((item) => backgroundColumns[coords?.col]?.data == item);

    if (Index != -1) {
      setTimeout(function () {
        var searchInput = document?.querySelector(".htUIMultipleSelectSearch.htUIInput");
        if (searchInput !== null) {
          searchInput.children[0].value = searchVal1[Index];
        }
      }, 200);
    } else {
      setTimeout(function () {
        var searchInput = document?.querySelector(".htUIMultipleSelectSearch.htUIInput");
        if (searchInput !== null) {
          searchInput.children[0].value = "";
        }
      }, 100);
    }
  }

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

  const cellChange = (change, source) => {
    const x = change?.length && change[0][0];

    if (change?.length > 0) {
      if (change[0][1] == "isActive") {
        const k = gstData;
        let newK = [];
        k?.map((item, index) => {
          if (item?.isActive) {
            newK.push(item?.userClientId);
          }
        });

        setSelectData(newK);
      }
    }
  };

  const onSubmit = () => {
    const checkCategoryData = !isCategory ? 1 : selectData?.length;

    if (selectedFromYear?.value && selectedToYear?.value && checkCategoryData) {
      setBlock(true);

      const payload = {
        fkUserId: subId,
        fkUserClientId: !isCategory ? [G_UCParId] : selectData, // TODO: take conformation
        // fkUserClientId: selectData,
        fromFinancialYearId: selectedFromYear?.value,
        toFinancialYearId: selectedToYear?.value,
      };

      GSTR9CFiledService.downloadMultiple(payload)
        .then((res) => {
          setBlock(false);

          if (
            res.status === 200 &&
            res.data.status === errorCodeConfig.APIDefaultCode.downloadOTPExpire
          ) {
            Swal.fire({
              confirmButtonText: "Enter OTP",
              icon: "warning",
              text: res?.data?.successMessage,
              customClass: {
                confirmButton: "btn btn-outline-danger",
              },
              buttonsStyling: false,
            }).then(function () {
              navigate("/download-gstin/request-otp");
            });
          } else if (
            res.status === 200 &&
            res.data.status === errorCodeConfig.APIDefaultCode.Success
          ) {
            toast.success(res?.data?.successMessage, {
              position: "top-right",
              duration: 7000,
            });

            funCheck();
            setErrorMsg("");
            const hot = hotRef?.current?.hotInstance;
            const totalRows = hot?.countRows();
            for (let index = 0; index < totalRows; index++) {
              hot?.setDataAtCell(index, 0, false);
            }
             // isActive = false;
            setActiveHeaderBtn(false);
          } else {
            Swal.fire({
              icon: "error",
              title: "",
              text: res?.data?.errorMessage,
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
          });
        });
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


  const checkUserProcess = () => {
    GSTR9CFiledService.checkUserProcess(UserId)
      .then((res) => {
        if (res.status === 200) {
          setCheckUser(res?.data?.data);
        }
      })
      .catch((error) => {
        setBlock(false);
        Swal.fire({
          icon: "error",
          title: "",
          text: error?.message,
        });
      });
  };

  const funCheck = () => {
    setBlock(true);

    const payload = {
      userId: subId,
      pageStart: 1,
      pageSize: PageSize,
      orderByColumnName: "",
      orderBy: "",
      searchColumnName: currentCol,
      Type: "GSTR9C",
      searchValue: searchVal1,
    };

    GSTR9CFiledService.backgroundPagination(payload)
      .then((res) => {
        setBlock(false);
        if (res.status === 200 && res?.data?.status == errorCodeConfig.APIDefaultCode.Success) {
          // setPageCount(res?.data?.data[0]?.totalRowCount / PageSize);
          // setBackData(res?.data?.data);
          // setGridDataFilter(res?.data?.data);

          if (!isCategory) {
            const filterData = res?.data?.data?.filter((p) => p.gstinNumber == G_GSTIN);

            if (filterData !== undefined) {
              setPageCount(filterData?.length / 10);
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
              let status = "";

              switch (true) {
                case data2.status == "0":
                  status = "Pending";
                  break;

                case data2.status == "1":
                  status = "In Progress";
                  break;

                case data2.status == "2":
                  status = "Success";
                  break;

                case data2.status == "3":
                  status = "Failed";
                  break;

                case data2.status == "4":
                  status = "Token";
                  break;

                case data2.status == "5":
                  status = "Authentication Failed";
                  break;
              }

              if (status) {
                setBackData((prevData) => {
                  return prevData.map((data) => {
                    if (data.uniqueId === data1) {
                      // Check against data1, not loopData
                      return { ...data, status };
                    }
                    return data;
                  });
                });

                setGridDataFilter((prevData) => {
                  return prevData.map((data) => {
                    if (data.uniqueId === data1) {
                      // Check against data1, not loopData
                      return { ...data, status };
                    }
                    return data;
                  });
                });
              }
            }),
          );
        }
      })
      .catch((error) => {
        setBlock(false);
        Swal.fire({
          icon: "error",
          title: "",
          text: error?.message,
        });
      });

    checkUserProcess();
  };

  const funCheck1 = (refreshData) => {
    setPage(0);

    setBlock(true);
    const payload = {
      userId: UserId,
      pageStart: 1,
      pageSize: PageSize,
      orderByColumnName: "",
      orderBy: "",
      searchColumnName:
        refreshData !== null && refreshData !== "" && refreshData !== undefined ? [] : currentCol,
      Type: "GSTR9C",
      searchValue:
        refreshData !== null && refreshData !== "" && refreshData !== undefined ? [] : searchVal1,
    };

    GSTR9CFiledService.backgroundPagination(payload)
      .then((res) => {
        if (res.status === 200 && res?.data?.status == errorCodeConfig.APIDefaultCode.Success) {
          setBlock(false);

          setPageCount(res?.data?.data[0]?.totalRowCount / PageSize);
          setBackData(res?.data?.data);
        } else {
          setBlock(false);
        }
      })
      .catch((error) => {
        setBlock(false);
        Swal.fire({
          icon: "error",
          title: "",
          text: error?.message,
        });
      });

    checkUserProcess();
  };

  const getGst = (value) => {
    setBlock(true);
    GSTR9CFiledService.getPanSummery(UserId, value ? value : "")
      .then((res) => {
        if (res.status === 200) {
          setBlock(false);
          setGstData(res?.data?.data?.gstinList);
          setGstListData(res?.data?.data?.gstinList);
        } else {
        }
      })
      .catch((error) => {
        setBlock(false);
        Swal.fire({
          icon: "error",
          title: "",
          text: error?.message,
        });
      });
  };

  useEffect(() => {
    getGst();
    checkUserProcess();
  }, []);

  useEffect(() => {
    funCheck();
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

      invalidColumns.forEach((ele, index) => {
        const columnIndex = index;
        const buttonExists = document.querySelector(
          `#hotDownload .ht_clone_top thead th:nth-child(${columnIndex + 1}) button`,
        );

        const columnMatchesCondition = Object.keys(finalObj).includes(ele.data);

        // Check if column value is not null
        const columnValueValid = finalObj[ele.data] !== null && finalObj[ele.data] !== "";

        if (buttonExists && columnMatchesCondition && columnValueValid) {
          const TH = document.querySelector(
            `#hotDownload .ht_clone_top thead th:nth-child(${columnIndex + 1})`,
          );
          // console.log("active filter" , buttonExists ,  finalObj[ele.data]  )
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
        const buttonExists = document.querySelector(
          `#hotSummary .ht_clone_top thead th:nth-child(${columnIndex + 1}) button`,
        );

        const columnMatchesCondition = Object.keys(finalObj).includes(ele.data);

        // Check if column value is not null
        const columnValueValid = finalObj[ele.data] !== null && finalObj[ele.data] !== "";

        if (buttonExists && columnMatchesCondition && columnValueValid) {
          const TH = document.querySelector(
            `#hotSummary .ht_clone_top thead th:nth-child(${columnIndex + 1})`,
          );

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
    if (value) {
      td.innerText = value.slice(0, 11);
    }
  }

  //** Clear filter
  const ClearFilter = () => {
    setCurrentCol([]);
    setCurrentCol1();
    setCurrentColDownload([]);
    setSearchVal1Download([]);
    setCurrentCol1Download();
    setSearchVal1([]);
    setSearchDate("");

    const hot = hotRef?.current?.hotInstance;
    const totalRows = hot?.countRows();
    for (let index = 0; index < totalRows; index++) {
      hot?.setDataAtCell(index, 0, false);
    }
    setActiveHeaderBtn(false);
  
    setGstData(gstListData);
    historyRef?.current?.clearFilter();
  };

  // ** For Filtering
  function FilterData(arr) {
    let addArr = [];
    var flag = false;
    let updatedData = [];
    let finalObj = {};

    for (let i = 0; i < arr.length; i++) {
      Object.assign(finalObj, arr[i]);
    }

    updatedData = gridDataFilter
      .filter((item) =>
        finalObj.gstinNumber?.length
          ? item.gstinNumber.toLowerCase().includes(finalObj.gstinNumber.toLowerCase())
          : item,
      )
      .filter((data) =>
        finalObj.month?.length
          ? data.month.toLowerCase().includes(finalObj.month.toLowerCase())
          : data,
      )
      .filter((companydata) =>
        finalObj.company?.length
          ? companydata.company.toLowerCase().includes(finalObj.company.toLowerCase())
          : companydata,
      )
      .filter((statusdata) =>
        finalObj.status?.length
          ? statusdata.status.toLowerCase().includes(finalObj.status.toLowerCase())
          : statusdata,
      );

    flag = true;

    addArr.push(...updatedData);
    setPage(0);

    let uniq = [...new Set(addArr)];

    return uniq;
  }

  function gstListFilter(arr) {
    let addArr = [];
    var flag = false;
    let updatedData = [];
    let finalObj = {};

    for (let i = 0; i < arr.length; i++) {
      Object.assign(finalObj, arr[i]);
    }

    updatedData = gstListData
      .filter((item) =>
        finalObj.gstinNumber?.length
          ? item.gstinNumber?.toLowerCase().includes(finalObj.gstinNumber.toLowerCase())
          : item,
      )
      .filter((companydata) =>
        finalObj.companyName?.length
          ? companydata.companyName?.toLowerCase().includes(finalObj.companyName?.toLowerCase())
          : companydata,
      );

    flag = true;

    addArr.push(...updatedData);
    setPage(0);

    let uniq = [...new Set(addArr)];

    return uniq;
  }

  //** Pagination
  const pageCountWithout = Math.ceil(filteredData?.length && filteredData?.length / perPageCount);
  const para1 = page * perPageCount;
  const para2 = page * perPageCount + perPageCount;

  let dataWithout = backData && backData.slice(para1, para2);

  const getStatusDataRealTime = (documentId, callback) => {
    const documentRef = doc(db, "MultipleDownloadData9C", String(documentId));

    const unsubscribe = onSnapshot(documentRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const documentData = docSnapshot.data();
        const res = documentData;
        const obj = {
          status: res?.status,
        };
        callback(obj);
      } else {
        callback({});
      }
    });
    return unsubscribe;
  };

  const onSelectFromYear = (value) => {
    setSelectedFromYear(value);

    let setThisAsToYear = yearOptions?.filter((item) => item.value == value.value + 1)[0];

    if (!setThisAsToYear) setThisAsToYear = value;

    if (!selectedToYear) setSelectedToYear(setThisAsToYear);
    
    if (selectedToYear && value.value > selectedToYear?.value ) {
      setSelectedToYear(setThisAsToYear)
    }

  };

  const onSelectToYear = (value) => {
    setSelectedToYear(value);

    // if (!selectedFromYear) setSelectedFromYear(value);
  };

  return (
    <Fragment>
      {block && <div className="loading1">Loading&#8230;</div>}
      <div>
        <div>
          <Row>
            <Col md="2">
              <Label className="requiredlable">From</Label>
              <Select
                id="purchaseId_invtype"
                maxMenuHeight="120px"
                isClearable={false}
                theme={selectThemeColors}
                closeMenuOnSelect={true}
                components={animatedComponents}
                options={yearOptions
                }
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={onSelectFromYear}
                value={selectedFromYear}
              />
            </Col>
            <Col md="2">
              <Label className="requiredlable">To</Label>
              <Select
                id="purchaseId_invtype1"
                isClearable={false}
                theme={selectThemeColors}
                closeMenuOnSelect={true}
                maxMenuHeight="120px"
                components={animatedComponents}
                options={
                  selectedFromYear?.value
                    ? yearOptions.filter((year) => year.value >= selectedFromYear.value)
                    : yearOptions
                }
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={onSelectToYear}
                value={selectedToYear}
              />
            </Col>
            <Col md="2" className="mb-1 mt-2 pt3">
              <div>
                <Button
                  color="danger"
                  onClick={onSubmit}
                  disabled={!checkUser}
                  className={!checkUser ? "btn-icon btn-round disabledBtn" : "btn-icon btn-round"}
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
              {!checkUser && (
                <Alert color="danger">
                  <div className="alert-body">
                    <AlertCircle size={15} />{" "}
                    <span className="ms-1">
                      Data download is already in progress. please try again after some time.
                    </span>
                  </div>
                </Alert>
              )}
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
        <div>
          <Row>
            <Col hidden={!isCategory} md={6}>
              {gstData?.length ? (
                <HotTable
                  id="hotDownload"
                  autoColumnSize={{
                    samplingRatio: 23, // Adjust the samplingRatio as needed
                  }}
                  manualColumnResize={true}
                  columnSorting={true}
                  fixedRowsTop={0}
                  stretchH="all"
                  ref={hotRef}
                  rowHeights={RowSize}
                  columnHeaderHeight={columnHeaderSize}
                  data={gstData ? gstData : []}
                  preventOverflow="horizontal"
                  rowHeaders={false}
                  height={380}
                  columns={invalidColumns}
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
                          var src = clickEvent.target;

                          if (src.tagName.toLowerCase() === "button") {
                            if (clickEvent.target.id == "btnClear") {
                              var searchInput = document.querySelector(
                                ".htUIMultipleSelectSearch.htUIInput",
                              );
                              var value = "";

                              const x = searchVal1Download;
                              if (!searchVal1Download?.length) {
                                x.push(value);
                                let y = currentColDownload;
                                y.push(invalidColumns[currentCol1Download]?.data);
                                setSearchVal1Download(x);
                                setCurrentColDownload(y);
                              } else {
                                const Index = currentColDownload?.findIndex(
                                  (item) => invalidColumns[currentCol1Download]?.data == item,
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

                              // page == 0 ? getGst() : setPage(0);

                              let uniq = [...new Set(currentColDownload)];

                              for (let i = 0; i < uniq.length; i++) {
                                var obj = {};

                                for (let j = 0; j < searchVal1Download.length; j++) {
                                  if (i == j) {
                                    obj[uniq[i]] = searchVal1Download[j];
                                    arrDownload.push(obj);
                                  }
                                }
                              }
                              let newFilterData = gstListFilter(arrDownload);
                              setGstData([...newFilterData]);
                            }
                            clickEvent.stopImmediatePropagation();
                          }

                          clickEvent.stopImmediatePropagation();
                        },
                      },
                      filter_action_bar: {},
                    },
                  }}
                  filters={true}
                  afterFilter={function (data) {
                    var searchInput = document.querySelector(".htUIMultipleSelectSearch.htUIInput");
                    var value = searchInput.children[0].value;

                    const x = searchVal1Download;
                    if (!searchVal1Download?.length) {
                      x.push(value);
                      let y = currentColDownload;
                      y.push(invalidColumns[currentCol1Download]?.data);
                      setSearchVal1Download(x);
                      setCurrentColDownload(y);
                    } else {
                      const Index = currentColDownload?.findIndex(
                        (item) => invalidColumns[currentCol1Download]?.data == item,
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
                    let uniq = [...new Set(currentColDownload)];

                    for (let i = 0; i < uniq.length; i++) {
                      var obj = {};

                      for (let j = 0; j < searchVal1Download.length; j++) {
                        if (i == j) {
                          obj[uniq[i]] = searchVal1Download[j];
                          arrDownload.push(obj);
                        }
                      }
                    }
                    let newFilterData = gstListFilter(arrDownload);
                    setGstData([...newFilterData]);
                  }}
                  cells={function (row, col, prop) {
                    const cellPrp = {};

                    if (col == 2) {
                      if (col == 2) {
                        if (gstData[row]?.companyName?.length > 44) {
                          cellPrp.comment = {
                            value: gstData[row]?.companyName,
                            style: { width: 200, height: 50 },
                            readOnly: true,
                          };
                        }
                      }
                      cellPrp.renderer = myLabels;
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
                  autoColumnSize={{
                    samplingRatio: 23, // Adjust the samplingRatio as needed
                  }}
                  autoWrapRow={true}
                  manualColumnResize={true}
                  stretchH="all"
                  rowHeights={RowSize}
                  columnHeaderHeight={columnHeaderSize}
                  // style={{ textAlign: "center" }}
                  data={[{ isActive: "No Data Found!" }]}
                  mergeCells={[{ row: 0, col: 0, rowspan: 1, colspan: 3 }]}
                  columns={emptyColumns}
                  nestedRows={true}
                  contextMenu={false}
                  bindRowsWithHeaders={true}
                  afterOnCellMouseDown={localAfterOnCellMouseDown}
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
                        callback: function (key, selection, clickEvent) {
                          var src = clickEvent.target;

                          if (src.tagName.toLowerCase() === "button") {
                            if (clickEvent.target.id == "btnClear") {
                              var searchInput = document.querySelector(
                                ".htUIMultipleSelectSearch.htUIInput",
                              );
                              var value = "";

                              const x = searchVal1Download;
                              if (!searchVal1Download?.length) {
                                x.push(value);
                                let y = currentColDownload;
                                y.push(invalidColumns[currentCol1Download]?.data);
                                setSearchVal1Download(x);
                                setCurrentColDownload(y);
                              } else {
                                const Index = currentColDownload?.findIndex(
                                  (item) => invalidColumns[currentCol1Download]?.data == item,
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

                              // page == 0 ? getGst() : setPage(0);
                              let uniq = [...new Set(currentColDownload)];

                              for (let i = 0; i < uniq.length; i++) {
                                var obj = {};

                                for (let j = 0; j < searchVal1Download.length; j++) {
                                  if (i == j) {
                                    obj[uniq[i]] = searchVal1Download[j];
                                    arrDownload.push(obj);
                                  }
                                }
                              }
                              let newFilterData = gstListFilter(arrDownload);
                              setGstData([...newFilterData]);
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
                    var searchInput = document.querySelector(".htUIMultipleSelectSearch.htUIInput");
                    var value = searchInput.children[0].value;
                    const x = searchVal1Download;
                    if (!searchVal1Download?.length) {
                      x.push(value);
                      let y = currentColDownload;
                      y.push(invalidColumns[currentCol1Download]?.data);
                      setSearchVal1Download(x);
                      setCurrentColDownload(y);
                    } else {
                      const Index = currentColDownload?.findIndex(
                        (item) => invalidColumns[currentCol1Download]?.data == item,
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

                    let uniq = [...new Set(currentColDownload)];

                    for (let i = 0; i < uniq.length; i++) {
                      var obj = {};

                      for (let j = 0; j < searchVal1Download.length; j++) {
                        if (i == j) {
                          obj[uniq[i]] = searchVal1Download[j];
                          arrDownload.push(obj);
                        }
                      }
                    }
                    let newFilterData = gstListFilter(arrDownload);
                    setGstData([...newFilterData]);
                  }}
                  filters={true}
                  readOnly={true}
                  hiddenColumns={{
                    columns: [3],
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
                     {paginationTitle}&nbsp; &nbsp; <Select
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

export default GSTR9Download;
