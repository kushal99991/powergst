import React, { useState, useEffect } from 'react'
import { Fragment, useRef } from "react";
import { Button, Col, Label, Row, Input, Card, CardBody, UncontrolledTooltip, Badge } from "reactstrap";
import { HotTable } from "@handsontable/react";
import { selectThemeColors } from "@utils";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { RowSize, SELECT_MAXSIZE, columnHeaderSize, keysMap, enableOnFormTags, paginationList, checkboxFilterCss } from "../../../../configs/config";
import { Search } from "react-feather";
import Breadcrumbs from '@components/breadcrumbs'
import { registerAllModules } from "handsontable/registry";
import { globleVariable } from "@configs/globalVariable";
import LocalFunction from "@configs/getLocalFunction";
import SessionFunction from "@configs/getSessionFunction";
import errorCodeConfig from "@configs/apiErrorCodeConfig";
import { useDispatch, useSelector } from 'react-redux';
import { getgstr1HsnSumData, gstr1CheckReportExistData, handleGstr1CheckExistData } from './store'
import { useNavigate } from "react-router-dom";
import { PageSize } from '@configs/config'
import ReactPaginate from "react-paginate";
import { downloadURL } from '@helper/downloadUrl'
import hsnSummaryServices from "../../../../services/hsnSummaryReport/hsnSummaryService"
import { useHotkeys } from 'react-hotkeys-hook';
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import Handsontable from "handsontable";
import $ from "jquery";
import { grabAndSetDetails, sortByMonthYear } from '../../../../utility/Utils';
import { showTotalRowPerPage } from '@helper/tableRowsPerPage';
import { urlEndpointConfig } from "@configs/urlEndpoint";


const searchValueCols = [1, 2]
const fromToCols = [4, 5, 6, 8, 9, 10, 11]


const gstr1HsnData = () => {

  const [block, setBlock] = useState(false);
  const [panDataFrom, setPanDataFrom] = useState([]);
  const [finFromYear, setFinFormYear] = useState(null);
  const [panData, setPanData] = useState([]);
  const [displayType, setDisplayType] = useState([]);
  const [searchApi, setSearchApi] = useState(false);
  const [monthFrom, setMonthFrom] = useState(null);
  const [checked, setChecked] = useState('1');
  const [hsnSumData, setHsnSumData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(paginationList[0].value);
  const [currentCol, setCurrentCol] = useState([]);
  const [currentCol1, setCurrentCol1] = useState();
  const [searchVal1, setSearchVal1] = useState([]);
  const [fromExpDate, setFromExpDate] = useState(null);
  const [toExpDate, setToExpDate] = useState(null);
  const [pageNoSelect, setPageNoSelect] = useState(paginationList[0]);

  const defaultFromTo = { from: "", to: "" };

  const initialAdvanceFilters = {
    selectedMonths: [],
    selectedRate: [],
    CGST: defaultFromTo,
    SGST: defaultFromTo,
    IGST: defaultFromTo,
    Cess: defaultFromTo,
    TaxableValue: defaultFromTo,
    TotalQty: defaultFromTo,
    TotalValue: defaultFromTo,
    HSN: "",
    Description: "",
    selectedUQC: [],
  }

  const [advanceFilters, setAdvanceFilters] = useState({ ...initialAdvanceFilters });
  const [minMaxValue, setMinMaxValue] = useState({ from: "", to: "" });
  const [monthDropdown, setMonthDropdown] = useState([])
  const [rateDropdown, setRateDropdown] = useState([])
  const [UQCDropdown, setUQCDropdown] = useState([])

  const [filteredData, setFilteredData] = useState([])
  const [lastGeneratedDate, setLastGeneratedData] = useState("")


  const hotRef = useRef(null);
  const animatedComponents = makeAnimated();
  const dispatch = useDispatch()
  const navigate = useNavigate();
  registerAllModules();

  const finYearOption = localStorage.getItem(globleVariable.rangeFilters) && LocalFunction.getLocalValue(globleVariable.rangeFilters, true);
  const YearList = finYearOption !== undefined && finYearOption !== null && finYearOption !== "" && finYearOption !== "undefined" ? JSON.parse(finYearOption) : [];
  const GGSTIN = sessionStorage.getItem(globleVariable.G_GSTIN) && SessionFunction.getSessionValue(globleVariable.G_GSTIN, true);
  const UserClientId = sessionStorage.getItem(globleVariable.G_UCParId) && SessionFunction.getSessionValue(globleVariable.G_UCParId, true)
  const UserId = localStorage.getItem(globleVariable.userId) && LocalFunction.getLocalValue(globleVariable.userId, true)
  const token = localStorage.getItem(globleVariable.tokenKey) && LocalFunction.getLocalValue(globleVariable.tokenKey, true);
  const isdefaultYear = sessionStorage.getItem(globleVariable.defaultYear) && SessionFunction.getSessionValue(globleVariable.defaultYear, true);
  const subscriptionId = localStorage.getItem(globleVariable.subscriptionId) && LocalFunction.getLocalValue(globleVariable.subscriptionId, true);


  

  useHotkeys(
    keysMap.EXPORT_SUMMARY_DATA,
    () => {
      !block && exportHsnReportSummary();
    },
    { enableOnFormTags }
  );

  useHotkeys(
    keysMap.CLEAR_DATA,
    () => {
      !block && ClearFilter();
    },
    { enableOnFormTags }
  );

  //** gstr1Hsn Data Column
  const gstr1HsnColumns = [
    {
      data: "FinMonthYear",
      title: "Month",
    },
    {
      data: "HSN",
      title: "HSN/SAC Code",
    },
    {
      data: "Description",
      title: "Description",
      width: 170,
    },
    {
      data: "UQC",
      title: "UQC",
    },
    {
      data: "TotalQty",
      title: "Total Quantity",
    },
    {
      data: "TotalValue",
      title: "Total Amount (₹)",
    },
    {
      data: "TaxableValue",
      title: "Taxable Value (₹)",
    },
    {
      data: 'Rate',
      title: 'Rate (%)',
    },
    {
      data: "IGST",
      title: "IGST (₹)",
    },
    {
      data: "CGST",
      title: "CGST (₹)",
    },
    {
      data: "SGST",
      title: "SGST (₹)",
    },
    {
      data: "Cess",
      title: "CESS (₹)",
    }

  ];

  //** button - Action column
  function myLables(instance, td, row, col, prop, value, cellProperties) {
    Handsontable.renderers.TextRenderer.apply(this, arguments);
    td.innerHTML = `<div class="truncated">${value !== null && value !== "" ? value : ""}</div>`
  }

  // ** redux data
  const storeHsnSum = useSelector(
    (state) => state?.hsnSumReport?.gstr1HSnSummary
  );

  console.log("COMING", storeHsnSum)

  // const storeHsnCheckExistData = useSelector(
  //   (state) => state?.hsnSumReport?.gstr1CheckExistData
  // );


  useEffect(() => {

    if (storeHsnSum !== undefined) {
      // alert("kudiyani haye oye")
      setBlock(false)
      const defaultValueFrom = panData?.filter((item) => Number(item.value) == Number(storeHsnSum?.[0]?.FromRange))[0];
      const defaultValueTo = panData?.filter((item) => Number(item.value) == Number(storeHsnSum?.[0]?.ToRange))[0];
      if (!(finFromYear?.value && monthFrom?.value)) {
        setFinFormYear(defaultValueFrom)
        setMonthFrom(defaultValueTo)
        setFromExpDate(defaultValueFrom?.value)
        setToExpDate(defaultValueTo?.value)
      }


      if (storeHsnSum?.[0]?.LastGeneratedReportDate !== null && storeHsnSum?.[0]?.LastGeneratedReportDate !== "") {
        setLastGeneratedData(storeHsnSum?.[0]?.LastGeneratedReportDate)
      } else {
        setLastGeneratedData("")
      }

      setHsnSumData(storeHsnSum?.[0]?.NormalViewData?.HSN)
      setFilteredData(storeHsnSum?.[0]?.NormalViewData?.HSN ?? [])

      grabAndSetDetails(storeHsnSum?.[0]?.NormalViewData?.HSN, "Rate", setRateDropdown)
      grabAndSetDetails(storeHsnSum?.[0]?.NormalViewData?.HSN, "UQC", setUQCDropdown)
      // setMonthDropdown(storeHsnSum?.[0]?.Month ?? [])
      setAdvanceFilters(initialAdvanceFilters)

      console.log("COMING", storeHsnSum?.[0]?.NormalViewData?.HSN)

      const months = storeHsnSum?.[0]?.NormalViewData?.HSN?.reduce((pre, curr) => {
        if (curr?.FinMonthYear) {pre.push(curr?.FinMonthYear)}
         return pre
        }, []);
        setMonthDropdown(sortByMonthYear(months));
    }
  }, [storeHsnSum]);



  // useEffect(() => {

  //   if (storeHsnSum !== undefined) {
  //     setBlock(false)
  //     setHsnSumData(storeHsnSum?.[0]?.Data?.HSN)
  //     setFilteredData(storeHsnSum?.[0]?.Data?.HSN ?? [])
  //     // setRateDropdown(storeHsnSum?.[0]?.Rate ?? [])
  //     grabAndSetDetails(storeHsnSum?.[0]?.Data?.HSN, "Rate", setRateDropdown)
  //     grabAndSetDetails(storeHsnSum?.[0]?.Data?.HSN, "UQC", setUQCDropdown)
  //     setMonthDropdown(storeHsnSum?.[0]?.Month ?? [])
  //     setAdvanceFilters(initialAdvanceFilters)
  //   }
  // }, [storeHsnSum]);


  let storeHsnData;
  if (storeHsnSum !== undefined) {
    storeHsnData = storeHsnSum?.[0]?.NormalViewData?.HSN
  } else {
    storeHsnData = storeHsnSum
  }

  useEffect(() => {
    setPanDataFrom(YearList);
    setPanData(YearList);
    setDisplayType(true);
  }, []);


  useEffect(() => {
    if (displayType == true) {
      // const defaultValueFrom = panData?.filter((item) => Number(item.value) == Number(isdefaultYear))[0];
      // setFinFormYear(defaultValueFrom)
      // selectFromMonth(defaultValueFrom)
      setSearchApi(true)
    }

  }, [displayType]);


  const selectFromYear = (value) => {

    setFinFormYear(value);
    const setDt =
      Number(monthFrom?.srNo) > Number(value?.srNo)
        ? monthFrom
        : panDataFrom[0];
    const x = panDataFrom?.filter(
      (item) => Number(item.srNo) >= Number(value.srNo)
    );
    setMonthFrom(setDt);
    setPanData(x);

  };

  const selectFromMonth = (value) => {
    setMonthFrom(value);

    if (Number(finFromYear?.srNo) > Number(value?.srNo)) {
      const fromFilter = panDataFrom?.filter(
        (item) => Number(item.srNo) == Number(value.srNo)
      )[0];
      setFinFormYear(fromFilter);

    }
  };

  console.log(monthFrom, "search fine from year", finFromYear);

  const onClickSearch = () => {


    // dispatch(handleGstr1CheckExistData([]))
    if (finFromYear?.value !== undefined && monthFrom?.value !== undefined) {
      setSearchApi(false)
      const userData = {
        UserClientId: UserClientId,
        UserId: subscriptionId,
        FromRange: finFromYear?.value,
        ToRange: monthFrom?.value,
        gstNumber: GGSTIN,
        Type: checked,
        subId: subscriptionId,
        advanceFilters
      }

      setFromExpDate(finFromYear?.value);
      setToExpDate(monthFrom?.value);
      setBlock(true)
      setPage(0)
      dispatch(getgstr1HsnSumData(userData))
    } else {
      toast.error("Please select from and to date.", {
        position: "top-right",
      });
    }

  };

  const searchDataExists = () => {
    setSearchApi(false)
    const userData = {
      UserClientId: UserClientId,
      UserId: subscriptionId,
      gstNumber: GGSTIN,
      Type: 'GSTR1HsnSummaryReport',
    }


    setBlock(true)
    setPage(0)
    dispatch(gstr1CheckReportExistData(userData))
  };


  const applyFilters = (advanceFilterValue) => {
    setPage(0)
    const convertIntoInt = (num) => {
      if (num) {
        return parseFloat(num.replaceAll(",", ""))
      }
      return 0;
    }
    if (hsnSumData?.length > 0) {
      let newFilteredData = [...hsnSumData]

      const advance = advanceFilterValue;

      const applyThisFrom = (dataForApply, Filed) => {
        let newDataForApply = [...dataForApply]
        if (!isNaN(parseFloat(advance[Filed].from))) {
          newDataForApply = dataForApply.filter((item) => convertIntoInt(item[Filed]) >= parseFloat(advance[Filed].from));
        }

        if (!isNaN(parseFloat(advance[Filed].to))) {
          newDataForApply = newDataForApply.filter((item) => convertIntoInt(item[Filed]) <= parseFloat(advance[Filed].to));
        }

        return newDataForApply;
      }

      const applySearchFilter = (dataToApply, Field) => {
        if (advance[Field]) {
          return dataToApply.filter((item) => item[Field]?.toLowerCase()?.includes(advance?.[Field]?.toLowerCase()))
        } else return dataToApply
      }

      if (advance.selectedMonths.length > 0) {
        newFilteredData = newFilteredData.filter((item) => advance.selectedMonths.includes(item.FinMonthYear))
      }

      if (advance.selectedRate.length > 0) {
        newFilteredData = newFilteredData.filter((item) => !!advance.selectedRate.find((rate) => rate?.toLowerCase() === item?.Rate?.toLowerCase()))
      }

      if (advance.selectedUQC.length > 0) {
        newFilteredData = newFilteredData.filter((item) => !!advance.selectedUQC.find((uqc) => uqc?.toLowerCase() === item?.UQC?.toLowerCase()))
      }
      newFilteredData = applyThisFrom(newFilteredData, "Cess")
      newFilteredData = applyThisFrom(newFilteredData, "CGST")
      newFilteredData = applyThisFrom(newFilteredData, "IGST")
      newFilteredData = applyThisFrom(newFilteredData, "SGST")
      newFilteredData = applyThisFrom(newFilteredData, "TaxableValue")
      newFilteredData = applyThisFrom(newFilteredData, "TotalValue")
      newFilteredData = applyThisFrom(newFilteredData, "TotalQty")
      newFilteredData = applySearchFilter(newFilteredData, "HSN")
      newFilteredData = applySearchFilter(newFilteredData, "Description")

      setFilteredData(newFilteredData)
    }
  }

  useEffect(() => {
    if (
      sessionStorage.getItem(globleVariable.isCompany) == false ||
      sessionStorage.getItem(globleVariable.isCompany) == "false"
    ) {
      setTimeout(() => {
        navigate("/dashboard/company");
      }, 1000);
    }
  }, []);

  //** Radio-btn function
  const onChangeValue = (e) => {
    setChecked(e.target.value);
    setBlock(true)

    if (e.target.value == '1') {

      if (storeHsnSum !== undefined) {

        setPage(0)
        setHsnSumData(storeHsnSum?.[0]?.NormalViewData?.HSN)
        setFilteredData(storeHsnSum?.[0]?.NormalViewData?.HSN ?? [])

        grabAndSetDetails(storeHsnSum?.[0]?.NormalViewData?.HSN, "Rate", setRateDropdown)
        grabAndSetDetails(storeHsnSum?.[0]?.NormalViewData?.HSN, "UQC", setUQCDropdown)
        setAdvanceFilters(initialAdvanceFilters)
      }

    } else {
      if (storeHsnSum !== undefined) {

        setPage(0)
        setHsnSumData(storeHsnSum?.[0]?.CombineViewData?.HSN)
        setFilteredData(storeHsnSum?.[0]?.CombineViewData?.HSN ?? [])

        grabAndSetDetails(storeHsnSum?.[0]?.CombineViewData?.HSN, "Rate", setRateDropdown)
        grabAndSetDetails(storeHsnSum?.[0]?.CombineViewData?.HSN, "UQC", setUQCDropdown)
        setAdvanceFilters(initialAdvanceFilters)
      }
    }

    if (storeHsnSum) {
      const months = storeHsnSum?.[0]?.NormalViewData?.HSN?.reduce((pre, curr) => {
        if (curr?.FinMonthYear) {pre.push(curr?.FinMonthYear)}
         return pre
        }, []);
        setMonthDropdown(sortByMonthYear(months));
    }

    setTimeout(() => {
      setBlock(false)
    }, 500);

    // setSearchApi(true)
  };

  //**  pagination
  const purchaseData = filteredData;
  const pageCount = Math.ceil(
    purchaseData?.length && purchaseData?.length / rowsPerPage
  );

  const para1 = page * rowsPerPage;
  const para2 = page * rowsPerPage + rowsPerPage;
  let hsnSumTableData = filteredData && filteredData.slice(para1, para2);

  useEffect(() => {

    if (searchApi == true) {
      setDisplayType(false);
      //  onClickSearch()
      searchDataExists()
    }

  }, [searchApi]);

  //**  page click event
  const handlePageClick = (event) => {
    setPage(event);
  };

  //** theader for alignment
  const theader = (col, TH) => {

    if (
      col == 0 ||
      col == 1 ||
      col == 2 ||
      col == 3
    ) {
      TH.className = "htLeft";
    } else {
      TH.className = "htRight";
    }


    const columnName = gstr1HsnColumns[col]?.data;

    let filterApplied = false

    if (fromToCols.includes(col)) {
      filterApplied = advanceFilters[columnName].from !== "" || advanceFilters[columnName].to !== ""
    } else if (searchValueCols.includes(col)) {
      filterApplied = !!advanceFilters[columnName]
    }
    else if (col == 0) {
      filterApplied = advanceFilters?.selectedMonths?.length > 0
    } else if (col == 7) {
      filterApplied = advanceFilters?.selectedRate?.length > 0
    } else if (col == 3) {
      filterApplied = advanceFilters?.selectedUQC?.length > 0
    }

    if (filterApplied) {
      TH.classList.add("htFiltersActive");
    } else {
      TH.classList.remove("htFiltersActive");
    }

  };

  function localAfterOnCellMouseDown1(event, coords, td) {
    const columnName = gstr1HsnColumns[coords?.col]?.data;

    if (fromToCols.includes(coords?.col)) setMinMaxValue(advanceFilters[columnName]);

    setCurrentCol1(coords?.col);
  }

  //**  Select FromDate ToDate */
  let expFromDt;
  let expToDt;
  const dateSelect = () => {
    const expFromDate = fromExpDate
    const expToDate = toExpDate

    if (expFromDate !== undefined) {
      expFromDt = expFromDate
    } else {
      expFromDt = finFromYear?.value
    }
    const fromFilter = panDataFrom?.filter(
      (item) => Number(item.value) == expFromDt
    )[0];

    setFinFormYear(fromFilter)

    if (expToDate !== undefined) {
      expToDt = expToDate
    } else {
      expToDt = finFromYear?.value
    }
    const toFilter = panDataFrom?.filter(
      (item) => Number(item.value) == expToDt
    )[0];
    setMonthFrom(toFilter)


  }

  // ** Export
  const exportHsnReportSummary = () => {

    setBlock(true);
    dateSelect();
    hsnSummaryServices
      .exportgstr1HsnReportData(
        UserClientId,
        UserId,
        expFromDt,
        expToDt,
        subscriptionId,
        GGSTIN,
        checked,
        token
      )
      .then((res) => {
        if (res?.status == 200 && res?.data?.status == errorCodeConfig.APIDefaultCode.Success) {

          setBlock(false);
          downloadURL(res.data.data)

        } else {

          setBlock(false);
          toast.error(res.data.errorMessage, {
            position: "top-right",
          });
        }
      })
      .catch((error) => {
        setBlock(false);
        Swal.fire({
          icon: "error",
          title: "",
          text: error?.message,
          customClass: {
            confirmButton: "btn btn-outline-danger",
          },
          buttonsStyling: false,
        });
      });
  };


  //** Clear filter
  const ClearFilter = () => {
    setCurrentCol([]);
    setCurrentCol1();
    setSearchVal1([]);
    setPage(0);
    setAdvanceFilters(initialAdvanceFilters);
    applyFilters(initialAdvanceFilters)
  };

  useEffect(() => {
    return () => setBlock(false);
  }, []);



  const hasData = hsnSumTableData?.length > 0;

  return (
    <Fragment>
      {block && <div className="loading1">Loading&#8230;</div>}
      <div className="content-header row py-1">
        <div className="content-header-left col-md-5 col-6">
          <div className="row breadcrumbs-top">
            <div className="col-12">
              <Breadcrumbs
                title="Purchase Summary"
                data={[
                  { title: "Reports",link: urlEndpointConfig.REPORT_ALL },
                  { title: "GSTR1 HSN Summary Report" },
                ]}
              />
            </div>
          </div>
        </div>
        <div className="content-header-right text-md-end col-md-7 col-6 d-md-block d-none">

          {
            lastGeneratedDate &&
            <Badge className="me-1" color='light-warning'>  Last Generated Report Date :  {lastGeneratedDate} </Badge>
          }


          <Button
            className="btn-icon me-1"
            outline
            color="danger"
            id="btnhsnclr"
            onClick={ClearFilter}
          >
            <i className="fa fa-filter fa-lg"></i>
            <span className="align-middle ms-50">
              Clear
            </span>
          </Button>
          <UncontrolledTooltip placement="top" target="btnhsnclr">
            Clear [{keysMap.CLEAR_DATA}]
          </UncontrolledTooltip>

          <Button
            className="btn-icon"
            outline
            color="danger"
            id="btnhsnexp"
            onClick={finFromYear?.value && monthFrom?.value && exportHsnReportSummary}
          >
            <i className="fa fa-file-excel-o"></i>

            <span className="align-middle ms-50">
              Export
            </span>
          </Button>
          <UncontrolledTooltip placement="top" target="btnhsnexp">
            Export [{keysMap.EXPORT_SUMMARY_DATA}]
          </UncontrolledTooltip>

        </div>
      </div>
      <div className="content-header-left col-md-12 col-12">
        <div className="row breadcrumbs-top mb-1">
          {/* Radio-Btn  Part1 */}
          <div className="col-md-6">
            <div className="d-flex align-items-center mt-1 " onChange={onChangeValue}>
              <div className="col-md-3">
                <Input
                  type="radio"
                  id="radio-hsn-yes"
                  name="hsn-radio"
                  value="1"
                  checked={checked == "1"}
                />
                <Label className="ms-1">
                  Normal View
                </Label>
              </div>
              <div className="col-md-4">
                <Input
                  type="radio"
                  id="radio-hsn-no"
                  name="hsn-radio"
                  value="2"
                  checked={checked == "2"}
                />
                <Label className="ms-1">
                  Combined View
                </Label>
              </div>
            </div>
          </div>

          {/* From-to Date Part2 */}
          <div className="col-md-6 mt-1">
            <div className="row">
              <div className="col-md-2 ">

              </div>
              <div className="col-md-4">
                <div className="row">
                  <Label className="form-label col-md-2 pt-half ps-0">From</Label>
                  <Select
                    id="from"
                    placeholder="From"
                    isClearable={false}
                    theme={selectThemeColors}
                    closeMenuOnSelect={true}
                    options={panDataFrom}
                    className="basic-multi-select col-md-10"
                    classNamePrefix="select"
                    components={animatedComponents}
                    onChange={selectFromYear}
                    value={finFromYear}
                    maxMenuHeight={SELECT_MAXSIZE}
                  />
                </div>
              </div>

              <div className="col-md-4">
                <div className="row">
                  <Label className="form-label col-md-2 pt-half">To</Label>
                  <Select
                    id="to"
                    placeholder="To"
                    isClearable={false}
                    theme={selectThemeColors}
                    closeMenuOnSelect={true}
                    options={panData}
                    components={animatedComponents}
                    className="basic-multi-select col-md-10"
                    classNamePrefix="select"
                    onChange={selectFromMonth}
                    value={monthFrom}
                    maxMenuHeight={SELECT_MAXSIZE}
                  />
                </div>
              </div>
              <div className="col-md-2 text-md-end ps-0">
                <Button
                  onClick={onClickSearch}
                  className="btn-icon btn-round"
                  color="danger"
                  outline
                >
                  <Search size={12} />&nbsp;Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sales Hsn Data-Table */}

      {/* <div className="col-12">
    </div> */}
      <Card>
        <CardBody className="CardBody p-0">
          <div>
            <Row>
              <Col md={12}>
                <HotTable
                  id='hsnSumTable'
                  ref={hotRef}
                  data={hasData ? hsnSumTableData : [{ FinMonthYear: "No Data Found!" }]}
                  rowHeights={RowSize}
                  columnHeaderHeight={columnHeaderSize}
                  autoColumnSize={true}
                  readOnly={true}
                  stretchH="all"
                  preventOverflow="horizontal"
                  columns={gstr1HsnColumns}
                  contextMenu={false}
                  bindRowsWithHeaders={true}
                  licenseKey="non-commercial-and-evaluation"
                  height="auto"
                  mergeCells={hasData ? false : [{ row: 0, col: 0, rowspan: 1, colspan: 12 }]}
                  comments={true}

                  cells={function (row, col) {
                    var cp = {};

                    if (col > 3) {
                      cp.className = "text-end";
                    }
                    if (col == 2) {
                      if (hsnSumTableData?.[row]?.Description?.length > 19) {
                        cp.comment = {
                          value: hsnSumTableData[row]?.Description, style: { width: 200, height: 70 },
                          readOnly: true
                        }
                      }
                    }

                    if (!hasData) cp.className = "text-center"

                    cp.renderer = myLables;
                    return cp;
                  }}
                  afterGetColHeader={theader}
                  filters={true}
                  dropdownMenu={{
                    items: {
                      filter_by_value: {
                        name: "Search Value",
                        hidden() {
                          return !searchValueCols.includes(this.getSelectedRangeLast().to.col);
                        },
                      },
                      month: {
                        name: `<div  style="${checkboxFilterCss}">Select Month<label class="float-end text-danger "><a><u id="selectAll">Select All</u></a></label></div> <div  class="checkboxmenu custom-scrollbar"> <div >  <table id="searchTable" >
                            ${monthDropdown &&
                          monthDropdown
                            ?.map(
                              (index) =>
                                `<tr><td><input class="checkBoxClass monthCheckBox" type="checkbox" value="${index
                                }" /> <span class="fw-normal">${index?.length > 20
                                  ? index?.substring(0, 20) + "..."
                                  : index
                                }</span> </td></tr>`
                            )
                            .join("")
                          }

                              </table></div>
                              </div>`, // Name can contain HTML
                        hidden() {
                          return this.getSelectedRangeLast().to.col != 0;
                        },
                        callback: function (key, selection, clickEvent) {
                          var src = clickEvent.target;
                          if (src.tagName == "U") {
                            if (clickEvent.target.id == "selectAll") {
                              $(".checkBoxClass").prop("checked", true);
                            }
                          }
                          if (src.tagName == "SPAN") {
                            $('input[type="checkbox]')
                              .trigger("click")
                              .prop("checked", true);
                          }
                          clickEvent.stopImmediatePropagation();
                        },
                      },
                      rate: {
                        name: `<div  style="${checkboxFilterCss}">Select Rate<label class="float-end text-danger "><a><u id="selectAll">Select All</u></a></label></div> <div  class="checkboxmenu custom-scrollbar"> <div >  <table id="searchTable" >
                            ${rateDropdown &&
                          rateDropdown
                            ?.map(
                              (index) =>
                                `<tr><td><input class="checkBoxClass rateCheckBox" type="checkbox" value="${index
                                }" /> <span class="fw-normal">${index?.length > 20
                                  ? index?.substring(0, 20) + "..."
                                  : index
                                }</span> </td></tr>`
                            )
                            .join("")
                          }

                              </table></div>
                              </div>`, // Name can contain HTML
                        hidden() {
                          return this.getSelectedRangeLast().to.col != 7;
                        },
                        callback: function (key, selection, clickEvent) {
                          var src = clickEvent.target;
                          if (src.tagName == "U") {
                            if (clickEvent.target.id == "selectAll") {
                              $(".checkBoxClass").prop("checked", true);
                            }
                          }
                          if (src.tagName == "SPAN") {
                            $('input[type="checkbox]')
                              .trigger("click")
                              .prop("checked", true);
                          }
                          clickEvent.stopImmediatePropagation();
                        },
                      },
                      uqc: {
                        name: `<div  style="${checkboxFilterCss}">Select UQC<label class="float-end text-danger "><a><u id="selectAll">Select All</u></a></label></div> <div  class="checkboxmenu custom-scrollbar"> <div >  <table id="searchTable" >
                            ${UQCDropdown &&
                          UQCDropdown
                            ?.map(
                              (index) =>
                                `<tr><td><input class="checkBoxClass UQCCheckBox" type="checkbox" value="${index
                                }" /> <span class="fw-normal">${index?.length > 20
                                  ? index?.substring(0, 20) + "..."
                                  : index
                                }</span> </td></tr>`
                            )
                            .join("")
                          }

                              </table></div>
                              </div>`, // Name can contain HTML
                        hidden() {
                          return this.getSelectedRangeLast().to.col != 3;
                        },
                        callback: function (key, selection, clickEvent) {
                          var src = clickEvent.target;
                          if (src.tagName == "U") {
                            if (clickEvent.target.id == "selectAll") {
                              $(".checkBoxClass").prop("checked", true);
                            }
                          }
                          if (src.tagName == "SPAN") {
                            $('input[type="checkbox]')
                              .trigger("click")
                              .prop("checked", true);
                          }
                          clickEvent.stopImmediatePropagation();
                        },
                      },
                      select_min_max: {
                        name: `<div style="margin-top:10px">Min Value <br><input type='number' autocomplete="off" class='custom-date col-md-11' placeholder='Min Amount' id='amount1' name='amount1' value=${minMaxValue.from ?? ""} > <br/>
                                   Max Value <br> <input type='number' class='custom-date col-md-11' autocomplete="off" placeholder='Max Amount' id='amount2' name='amount2' value=${minMaxValue.to ?? ""}>
                                   </div>`,
                        hidden() {
                          return !fromToCols.includes(
                            this.getSelectedRangeLast().to.col
                          );
                        },
                        callback: function (key, selection, clickEvent) {
                          var src = clickEvent.target;

                          if (src.tagName === "INPUT") {
                            clickEvent.stopImmediatePropagation();
                          }

                          clickEvent.stopImmediatePropagation();
                        },
                      },
                      clear: {
                        name: `<button id='btnClear' name='Clear' tabIndex="-1"  value='Clear'>Clear</button>`,
                        //disabled: true,
                        callback: function (key, selection, clickEvent) {
                          var src = clickEvent.target;
                          if (src.tagName.toLowerCase() === "button") {
                            if (clickEvent.target.id == "btnClear") {
                              const selectedColumn = this.getSelected()[0][1];

                              const newAdvanceFilter = { ...advanceFilters };

                              const columnName =
                                gstr1HsnColumns[selectedColumn]?.data;

                              if (fromToCols.includes(selectedColumn)) {
                                newAdvanceFilter[columnName] = {
                                  from: "",
                                  to: "",
                                };
                              } else if (searchValueCols.includes(selectedColumn)) {
                                newAdvanceFilter[columnName] = ""
                              }
                              else if (selectedColumn == 0) {
                                newAdvanceFilter.selectedMonths = [];
                              } else if (selectedColumn == 7) {
                                newAdvanceFilter.selectedRate = [];
                              } else if (selectedColumn == 3) {
                                newAdvanceFilter.selectedUQC = [];
                              }

                              setAdvanceFilters(newAdvanceFilter);
                              applyFilters(newAdvanceFilter);
                            }
                            clickEvent.stopImmediatePropagation();
                          }
                          clickEvent.stopImmediatePropagation();
                        },
                      },
                      filter_action_bar: {},
                    },
                  }}
                  afterDropdownMenuShow={function () {
                    const monthCheckboxes =
                      document.getElementsByClassName("monthCheckBox");

                    for (let i = 0; i < monthCheckboxes.length; i++) {
                      if (
                        advanceFilters.selectedMonths.includes(
                          monthCheckboxes[i].value
                        )
                      ) {
                        $(monthCheckboxes[i]).prop("checked", true);
                      }
                    }

                    const rateCheckboxes =
                      document.getElementsByClassName("rateCheckBox");

                    for (let i = 0; i < rateCheckboxes.length; i++) {
                      if (
                        advanceFilters.selectedRate.includes(
                          rateCheckboxes[i].value
                        )
                      ) {
                        $(rateCheckboxes[i]).prop("checked", true);
                      }
                    }

                    const uqcCheckboxes =
                      document.getElementsByClassName("UQCCheckBox");

                    for (let i = 0; i < uqcCheckboxes.length; i++) {
                      if (
                        advanceFilters.selectedUQC.includes(
                          uqcCheckboxes[i].value
                        )
                      ) {
                        $(uqcCheckboxes[i]).prop("checked", true);
                      }
                    }

                    const selectedColumn = this.getSelected()[0][1];

                    if (searchValueCols.includes(selectedColumn)) {
                      const columnName =
                        gstr1HsnColumns[selectedColumn]?.data;

                      const searchValueText = advanceFilters[columnName];

                      document.querySelector(".htUIMultipleSelectSearch.htUIInput input").value = searchValueText
                    }
                  }}
                  afterFilter={function (data) {
                    const selectedColumn = this.getSelected()[0][1];

                    const newAdvanceFilter = { ...advanceFilters };
                    const columnName =
                      gstr1HsnColumns[selectedColumn]?.data;

                    if (fromToCols.includes(selectedColumn)) {
                      const fromAmount =
                        document.getElementById("amount1")?.value;
                      const toAmount =
                        document.getElementById("amount2")?.value;

                      newAdvanceFilter[columnName] = {
                        from: fromAmount !== "" ? parseFloat(fromAmount) : "",
                        to: toAmount !== "" ? parseFloat(toAmount) : "",
                      };
                    } else if (searchValueCols.includes(selectedColumn)) {
                      const searchInput = document.querySelector(
                        ".htUIMultipleSelectSearch.htUIInput"
                      );
                      const value = searchInput.children[0].value;

                      newAdvanceFilter[columnName] = value ?? ""
                    }
                    else if (selectedColumn == 0) {
                      const checkboxes =
                        document.getElementsByClassName("monthCheckBox");

                      const selectedMonths = [];
                      for (let i = 0; i < checkboxes.length; i++) {
                        if (checkboxes[i].checked) {
                          selectedMonths.push(checkboxes[i].value);
                        }
                      }

                      newAdvanceFilter.selectedMonths = selectedMonths;
                    } else if (selectedColumn == 7) {
                      const checkboxes =
                        document.getElementsByClassName("rateCheckBox");

                      const selectedRate = [];
                      for (let i = 0; i < checkboxes.length; i++) {
                        if (checkboxes[i].checked) {
                          selectedRate.push(checkboxes[i].value);
                        }
                      }

                      newAdvanceFilter.selectedRate = selectedRate;
                    } else if (selectedColumn == 3) {
                      const checkboxes =
                        document.getElementsByClassName("UQCCheckBox");

                      const selectedUQC = [];
                      for (let i = 0; i < checkboxes.length; i++) {
                        if (checkboxes[i].checked) {
                          selectedUQC.push(checkboxes[i].value);
                        }
                      }

                      newAdvanceFilter.selectedUQC = selectedUQC;
                    }

                    setAdvanceFilters(newAdvanceFilter);
                    applyFilters(newAdvanceFilter);
                  }}
                  afterOnCellMouseDown={localAfterOnCellMouseDown1}

                />
                {hsnSumTableData?.length > 0 && (
                  <>
                    <Row className="justify-content-end mx-0">
                      <Col
                        className="d-flex align-items-center justify-content-end"
                        md="12"
                        sm="12"
                      >
                        <Select
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
                          onPageChange={(e) => handlePageClick(e?.selected)}
                          pageRangeDisplayed={2}
                          pageCount={pageCount}
                          previousLabel=""
                          renderOnZeroPageCount={null}
                          marginPagesDisplayed={2}
                          forcePage={page}
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
                )}
              </Col>
            </Row>
          </div>
        </CardBody>
      </Card>
    </Fragment>
  )
}

export default gstr1HsnData
