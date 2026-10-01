import React, { useState } from 'react'
import { Fragment, useRef } from "react";
import { Button, Col, Label, Row, Input, Card, CardBody, UncontrolledTooltip,Badge } from "reactstrap";
import { HotTable } from "@handsontable/react";
import { selectThemeColors } from "@utils";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { RowSize, SELECT_MAXSIZE, columnHeaderSize, keysMap, enableOnFormTags } from "@configs/config";
import { Search } from "react-feather";
import Breadcrumbs from '@components/breadcrumbs'
import { registerAllModules } from "handsontable/registry";
import { globleVariable } from "../../../../configs/globalVariable";
import LocalFunction from "../../../../configs/getLocalFunction";
import SessionFunction from "../../../../configs/getSessionFunction";
import { useDispatch, useSelector } from 'react-redux';
import { getgstr1filedRateData, gstr1CheckReportExistData } from './store'
import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import { PageSize } from '@configs/config'
import { downloadURL } from '@helper/downloadUrl'
import errorCodeConfig from "../../../../configs/apiErrorCodeConfig";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import Handsontable from "handsontable";
import { useHotkeys } from 'react-hotkeys-hook';
import hsnSummaryServices from "../../../../services/hsnSummaryReport/hsnSummaryService"
import $ from "jquery";
import { checkboxFilterCss, paginationList } from '../../../../configs/config';
import { grabAndSetDetails, sortByMonthYear } from '../../../../utility/Utils';
import { showTotalRowPerPage } from '../../../../helper/tableRowsPerPage';
import { urlEndpointConfig } from "@configs/urlEndpoint";


const gstr1filedRatewiseData = () => {

    const [block, setBlock] = useState(false);
    const [panDataFrom, setPanDataFrom] = useState([]);
    const [finFromYear, setFinFormYear] = useState(null);
    const [panData, setPanData] = useState([]);
    const [displayType, setDisplayType] = useState([]);
    const [searchApi, setSearchApi] = useState(false);
    const [monthFrom, setMonthFrom] = useState(null);
    const hotRef = useRef(null);
    const animatedComponents = makeAnimated();
    const [RateSumData, setRateSumData] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(paginationList[0].value);
    const [currentCol, setCurrentCol] = useState([]);
    const [currentCol1, setCurrentCol1] = useState();
    const [searchVal1, setSearchVal1] = useState([]);
    const [fromExpDate, setFromExpDate] = useState(null);
    const [toExpDate, setToExpDate] = useState(null);
    const [pageNoSelect, setPageNoSelect] = useState(paginationList[0]);
    const dispatch = useDispatch()
    const navigate = useNavigate();

    const defaultFromTo = { from: "", to: "" };

    const initialAdvanceFilters = {
        selectedMonths: [],
        selectedRate: [],
        CGST: defaultFromTo,
        SGST: defaultFromTo,
        IGST: defaultFromTo,
        Cess: defaultFromTo,
        TotalTaxableAmount: defaultFromTo,
        TotalTaxAmount: defaultFromTo,
    };

    const [advanceFilters, setAdvanceFilters] = useState(initialAdvanceFilters);

    const [minMaxValue, setMinMaxValue] = useState({ from: "", to: "" });

    const [monthDropdown, setMonthDropdown] = useState([])
    const [rateDropdown, setRateDropdown] = useState([])

    const [filteredData, setFilteredData] = useState([])
    const [lastGeneratedDate , setLastGeneratedData] = useState("")

    let arrFilter = [];

    const finYearOption =
        localStorage.getItem(globleVariable.rangeFilters) &&
        LocalFunction.getLocalValue(globleVariable.rangeFilters, true);

    const GGSTIN =
        sessionStorage.getItem(globleVariable.G_GSTIN) &&
        SessionFunction.getSessionValue(globleVariable.G_GSTIN, true);
    const YearList =
        finYearOption !== undefined &&
            finYearOption !== null &&
            finYearOption !== "" &&
            finYearOption !== "undefined"
            ? JSON.parse(finYearOption)
            : [];
    const UserClientId = sessionStorage.getItem(globleVariable.G_UCParId) && SessionFunction.getSessionValue(globleVariable.G_UCParId, true)
    const UserId = localStorage.getItem(globleVariable.userId) && LocalFunction.getLocalValue(globleVariable.userId, true)
    const subscriptionId = localStorage.getItem(globleVariable.subscriptionId) && LocalFunction.getLocalValue(globleVariable.subscriptionId, true);
    const token = LocalFunction.getLocalValue(globleVariable.tokenKey, true);
    const isdefaultYear = sessionStorage.getItem(globleVariable.defaultYear) && SessionFunction.getSessionValue(globleVariable.defaultYear, true);
    registerAllModules();
    useHotkeys(
        keysMap.EXPORT_SUMMARY_DATA,
        () => {
            !block && exportGstr1filedRateReport();

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
    //** salesRate Data Column
    const gstr1filedRateColumns = [
        {
            data: "Month",
            title: "Month",
        },
        {
            data: "Rate",
            title: "Rate (%)",
        },
        {
            data: "TotalTaxableAmount",
            title: "Total Taxable (₹)",
        },
        {
            data: "TotalTaxAmount",
            title: "Total Tax (₹)",
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
            data: 'Cess',
            title: 'Cess (₹)',
        },
    ];

    //** button - Action column
    function myLables(instance, td, row, col, prop, value, cellProperties) {
        Handsontable.renderers.TextRenderer.apply(this, arguments);
        td.innerHTML = `<div class="truncated">${value !== null && value !== "" ? value : ""}</div>`
    }

    // ** redux data
    const storeRateSum = useSelector(
        (state) => state?.gstr1filedRateReport?.gstr1filedRate
    );

    console.log(storeRateSum, 'storeRateSum')

    useEffect(() => {
        if (storeRateSum !== undefined) {
            setBlock(false)
            const defaultValueFrom = panData?.filter((item) => Number(item.value) == Number(storeRateSum?.[0]?.FromRange))[0];
            const defaultValueTo = panData?.filter((item) => Number(item.value) == Number(storeRateSum?.[0]?.ToRange))[0];

            if (defaultValueFrom){
                setFinFormYear(defaultValueFrom)
                setFromExpDate(defaultValueFrom?.value)
            }

            if(defaultValueTo) {
                setMonthFrom(defaultValueTo)
                setToExpDate(defaultValueTo?.value)
            }

            if (storeRateSum?.[0]?.LastGeneratedReportDate !== null && storeRateSum?.[0]?.LastGeneratedReportDate !== "") {
                setLastGeneratedData(storeRateSum?.[0]?.LastGeneratedReportDate)
              }


            setRateSumData(storeRateSum?.[0]?.Data ?? [])
            setFilteredData(storeRateSum?.[0]?.Data ?? [])
            // setMonthDropdown(storeRateSum?.[0]?.Month ?? [])
            grabAndSetDetails(storeRateSum?.[0]?.Data, "Rate", setRateDropdown)
            setAdvanceFilters(initialAdvanceFilters)

                const months = storeRateSum?.[0]?.Data?.reduce((pre, curr) => {
                  if (curr?.Month) {pre.push(curr.Month)}
                   return pre
                  }, []);
                  setMonthDropdown(sortByMonthYear(months));
        }
    }, [storeRateSum]);


    let storeRateData;
    if (storeRateSum !== undefined) {
        storeRateData = storeRateSum?.[0]
    } else {
        storeRateData = storeRateSum
    }

    useEffect(() => {
        setPanDataFrom(YearList);
        setPanData(YearList);
        setDisplayType(true);
    }, []);


    useEffect(() => {
        if (displayType == true) {
            const defaultValueFrom = panData?.filter((item) => Number(item.value) == Number(isdefaultYear))[0];
            const defaultValueTo = panData?.filter((item) => Number(item.value) == Number(isdefaultYear))[0];
            // setFinFormYear(defaultValueFrom)
            // selectFromMonth(defaultValueTo)
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


    const onClickSearch = () => {
        setSearchApi(false)

        if (finFromYear?.value !== undefined ||  monthFrom?.value !== undefined) {
            const userData = {
                UserClientId: UserClientId,
                UserId: subscriptionId,
                FromRange: finFromYear?.value,
                ToRange: monthFrom?.value,
                gstNumber: GGSTIN,
                subId: subscriptionId,
            }
            setFromExpDate(finFromYear?.value);
            setToExpDate(monthFrom?.value);
            setBlock(true)
            setPage(0)
            dispatch(getgstr1filedRateData(userData))
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
          Type: 'GSTR1RateWiseReport',
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

        if (RateSumData?.length > 0) {
            let newFilteredData = [...RateSumData]

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

            if (advance.selectedMonths.length > 0) {
                newFilteredData = newFilteredData.filter((item) => advance.selectedMonths.includes(item.Month))
            }

            if (advance.selectedRate.length > 0) {
                // newFilteredData = newFilteredData.filter((item) => !item?.Rate || (+item?.Rate && advance.selectedRate.includes(Math.floor(+item.Rate).toString())))
                newFilteredData = newFilteredData.filter((item) => !!advance.selectedRate.find((rate) => rate?.toLowerCase() === item?.Rate?.toLowerCase()))
            }
                newFilteredData = applyThisFrom(newFilteredData, "Cess")
                newFilteredData = applyThisFrom(newFilteredData, "CGST")
                newFilteredData = applyThisFrom(newFilteredData, "IGST")
                newFilteredData = applyThisFrom(newFilteredData, "SGST")
                newFilteredData = applyThisFrom(newFilteredData, "TotalTaxAmount")
                newFilteredData = applyThisFrom(newFilteredData, "TotalTaxableAmount")

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

    //** theader for alignment
    const theader = (col, TH) => {
        if (
            col == 0
        ) {
            TH.className = "htLeft";
        } else {
            TH.className = "htRight";
        }

            const columnName = gstr1filedRateColumns[col]?.data;

            let filterApplied = false

            if (col > 1) {
              filterApplied = advanceFilters[columnName].from !== "" || advanceFilters[columnName].to !== ""
            } else if (col == 0) {
              filterApplied = advanceFilters?.selectedMonths?.length > 0
            } else if (col == 1) {
              filterApplied = advanceFilters?.selectedRate?.length > 0
            }

            if (filterApplied) {
              TH.classList.add("htFiltersActive");
            } else {
              TH.classList.remove("htFiltersActive");
            }
    }

    //**  Pagination */
    const purchaseData = filteredData;
    const pageCount = Math.ceil(
        purchaseData?.length && purchaseData?.length / rowsPerPage
    );

    const para1 = page * rowsPerPage;
    const para2 = page * rowsPerPage + rowsPerPage;
    let storeRateDataTable = filteredData && filteredData.slice(para1, para2);

    useEffect(() => {

        if (searchApi == true) {
            searchDataExists()
            // onClickSearch()
            setSearchApi(false)
        }


    }, [searchApi]);

    //**  page click event
    const handlePageClick = (event) => {
        setPage(event);
    };

    function localAfterOnCellMouseDown1(event, coords, td) {
        const columnName = gstr1filedRateColumns[coords?.col]?.data;

        if (coords?.col > 1) setMinMaxValue(advanceFilters[columnName]);

        setCurrentCol1(coords?.col);
    }

    //**  set FromDate ToDate
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
    const exportGstr1filedRateReport = () => {

        dateSelect()
        if (expFromDt !== undefined  || expToDt !== undefined ) {
            setBlock(true);
        hsnSummaryServices
            .exportgstr1filedRateReportData(
                UserClientId,
                UserId,
                expFromDt,
                expToDt,
                subscriptionId,
                GGSTIN,
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
        }
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

    const hasData = storeRateDataTable?.length > 0;


    return (
        <Fragment>
            {block && <div className="loading1">Loading&#8230;</div>}
            <div className="content-header row py-1">
                <div className="content-header-left col-md-5 col-6">
                    <div className="row breadcrumbs-top">
                        <div className="col-12">
                            <Breadcrumbs
                                title="GSTR 1 Rate Wise Report"
                                data={[
                                    { title: "Reports" ,link: urlEndpointConfig.REPORT_ALL},
                                    { title: "GSTR 1 Rate Wise Report" },
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
                        id="btnExportSum"
                        onClick={exportGstr1filedRateReport}
                    >
                        <i className="fa fa-file-excel-o"></i>

                        <span className="align-middle ms-50">
                            Export
                        </span>
                    </Button>
                    <UncontrolledTooltip placement="top" target="btnExportSum">
                        Export [{keysMap.EXPORT_SUMMARY_DATA}]
                    </UncontrolledTooltip>

                </div>
            </div>

            <div className="content-header-left col-md-12 col-12">
                <div className="row breadcrumbs-top mb-1">

                    {/* From-to Date Part2 */}
                    <div className="col-md-6"></div>
                    <div className="col-md-6 mt-1">

                        <div className="row">
                            <div className="col-md-2 "></div>
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

            {/* Sales Rate Data-Table */}
            <Card>
                <CardBody className="CardBody p-0">
                    <div>
                        <Row>
                            <Col md={12}>
                                {/* {console.log(storeRateDataTable,'storeRateDataTable')} */}
                                <HotTable
                                    id="saleRate"
                                    // data={data}
                                    data={hasData ? storeRateDataTable : [{ Month: "No Data Found!" }]}
                                    rowHeights={RowSize}
                                    columnHeaderHeight={columnHeaderSize}
                                    autoColumnSize={true}
                                    readOnly={true}
                                    ref={hotRef}
                                    mergeCells={
                                        hasData
                                            ? false
                                            : [{ row: 0, col: 0, rowspan: 1, colspan: 8 }]
                                    }
                                    stretchH="all"
                                    preventOverflow="horizontal"
                                    columns={gstr1filedRateColumns}
                                    contextMenu={false}
                                    bindRowsWithHeaders={true}
                                    licenseKey="non-commercial-and-evaluation"
                                    height="auto"
                                    filters={true}
                                    comments={true}

                                    dropdownMenu={{
                                        items: {
                                            month: {
                                                name: `<div  style="${checkboxFilterCss}">Select Month<label class="float-end text-danger "><a><u id="selectAll">Select All</u></a></label></div> <div  class="checkboxmenu custom-scrollbar"> <div >  <table id="searchTable" >
                                                  ${monthDropdown &&
                                                    monthDropdown
                                                        ?.map(
                                                            (index) =>
                                                                `<tr><td><input class="checkBoxClass monthCheckBox" type="checkbox" value="${index
                                                                }" /> <span class="fw-normal">${index > 20
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
                                                    return this.getSelectedRangeLast().to.col != 1;
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
                                                name: `<div style="margin-top:10px">Min Value <br><input type='number' autocomplete="off" class='custom-date col-md-11' placeholder='Min Amount' id='amount1' name='amount1' value=${minMaxValue?.from ?? ""} > <br/>
                                                         Max Value <br> <input type='number' class='custom-date col-md-11' autocomplete="off" placeholder='Max Amount' id='amount2' name='amount2' value=${minMaxValue?.to ?? ""}>
                                                         </div>`,
                                                hidden() {
                                                    return [0, 1].includes(
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

                                                            const newAdvanceFilter = { ...advanceFilters }


                                                            if (selectedColumn > 1) {
                                                                const columnName =
                                                                    gstr1filedRateColumns[selectedColumn]?.data;

                                                                newAdvanceFilter[columnName] = {
                                                                    from: "",
                                                                    to: "",
                                                                }
                                                            } else if (selectedColumn == 0) {
                                                                newAdvanceFilter.selectedMonths = []
                                                            } else if (selectedColumn == 1) {
                                                                newAdvanceFilter.selectedRate = []
                                                            }

                                                            setAdvanceFilters(newAdvanceFilter)
                                                            applyFilters(newAdvanceFilter)
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
                                        const monthCheckboxes = document.getElementsByClassName('monthCheckBox');

                                        for (let i = 0; i < monthCheckboxes.length; i++) {
                                            if (advanceFilters.selectedMonths.includes(monthCheckboxes[i].value)) {
                                                $(monthCheckboxes[i]).prop("checked", true);
                                            }
                                        }

                                        const rateCheckboxes = document.getElementsByClassName('rateCheckBox');

                                        for (let i = 0; i < rateCheckboxes.length; i++) {
                                            if (advanceFilters.selectedRate.includes(rateCheckboxes[i].value)) {
                                                $(rateCheckboxes[i]).prop("checked", true);
                                            }
                                        }
                                    }}
                                    afterFilter={function (data) {
                                        const selectedColumn = this.getSelected()[0][1];

                                        const newAdvanceFilter = { ...advanceFilters };
                                        const columnName =
                                            gstr1filedRateColumns[selectedColumn]?.data;

                                        if (selectedColumn > 1) {
                                            const fromAmount =
                                                document.getElementById("amount1")?.value;
                                            const toAmount =
                                                document.getElementById("amount2")?.value;


                                            newAdvanceFilter[columnName] = {
                                                from: fromAmount !== "" ? parseFloat(fromAmount) : "",
                                                to: toAmount !== "" ? parseFloat(toAmount) :"",
                                            };
                                        } else if (selectedColumn == 0) {
                                            const checkboxes =
                                                document.getElementsByClassName("monthCheckBox");

                                            const selectedMonths = []
                                            for (let i = 0; i < checkboxes.length; i++) {
                                                if (checkboxes[i].checked) {
                                                    selectedMonths.push(checkboxes[i].value)
                                                }
                                            }

                                            newAdvanceFilter.selectedMonths = selectedMonths;
                                        } else if (selectedColumn == 1) {
                                            const checkboxes =
                                                document.getElementsByClassName("rateCheckBox");

                                            const selectedRate = []
                                            for (let i = 0; i < checkboxes.length; i++) {
                                                if (checkboxes[i].checked) {
                                                    selectedRate.push(checkboxes[i].value)
                                                }
                                            }

                                            newAdvanceFilter.selectedRate = selectedRate;
                                        }

                                        setAdvanceFilters(newAdvanceFilter);

                                        applyFilters(newAdvanceFilter)
                                    }}
                                    afterOnCellMouseDown={localAfterOnCellMouseDown1}
                                    cells={function (row, col) {
                                        var cp = {};

                                        if (col == 1 || col == 2 || col == 3 || col == 4 || col == 5 || col == 6 || col == 7) {
                                            cp.className = "text-end";
                                        }
                                        if (col == 2) {
                                            if (storeRateDataTable?.[row]?.Description?.length > 20) {
                                                cp.comment = {
                                                    value: storeRateDataTable[row]?.Description, style: { width: 200, height: 70 },
                                                    readOnly: true
                                                }
                                            }
                                        }

                                        if (!hasData) cp.className = "text-center"

                                        cp.renderer = myLables;
                                        return cp;
                                    }}
                                    afterGetColHeader={theader}
                                />
                            </Col>
                        </Row>
                    </div>
                    <div>
            {storeRateData && (
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
          </div>
                </CardBody>
            </Card>
        </Fragment>
    )
}

export default gstr1filedRatewiseData
