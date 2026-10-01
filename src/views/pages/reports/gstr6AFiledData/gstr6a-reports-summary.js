import { Fragment, useRef } from "react"
import { Col, Label, Row, Button } from "reactstrap"
import { HotTable } from "@handsontable/react"
import { selectThemeColors } from '@utils'
import Select from 'react-select'
import { useState } from "react"
import { RowSize, SELECT_MAXSIZE, columnHeaderSize } from '../../../../configs/config'
import toast from 'react-hot-toast'
import makeAnimated from 'react-select/animated'
import { useEffect } from "react"
import { useNavigate, useOutletContext } from "react-router-dom"
// import gstr6aSummaryService from "../../../../services/gstr6Filed/gstr6filedService"
import gstr6aSummaryService from "../../../../services/gstr6A/gstr6aSummaryInvoice"
import Swal from "sweetalert2"
import errorCodeConfig from "../../../../configs/apiErrorCodeConfig"
import { registerRenderer, textRenderer } from 'handsontable/renderers';
import { registerAllModules } from 'handsontable/registry';
import { globleVariable } from '../../../../configs/globalVariable'
import LocalFunction from '../../../../configs/getLocalFunction'
import SessionFunction from '../../../../configs/getSessionFunction'
import { useSelector, useDispatch } from "react-redux";
import { getGSTR6AData } from "./store";
import { handleExportData } from '@store/layout'

// ** Icons Imports
import { Search } from 'react-feather'

const finYearOption = localStorage.getItem(globleVariable.rangeFilters) && LocalFunction.getLocalValue(globleVariable.rangeFilters, true)
const YearList = finYearOption !== undefined && finYearOption !== null && finYearOption !== "" && finYearOption !== 'undefined' ? JSON.parse(finYearOption) : []

registerAllModules();

const Gstr6ASalesSummary = () => {

    const dispatch = useDispatch();
    const storeGSTR6A = useSelector(
        (state) => state?.gstr6AData?.GSTR6AREPORTS[0]?.Summary
    );

    const storeExport = useSelector(state => state?.layout?.exportData);

    useEffect(() => {
        console.log("storeExport-->", storeExport)
        if (storeExport == true) {
            onDateSelect();
        }
    }, [storeExport])

    // ** Columne
    const invoiceDetails = [
        {
            data: "TypeofInvoice",
            readOnly: true,
            title: 'Type Of Invoice',
            // width: '300'
        },
        {
            data: "DocumentCount",
            readOnly: true,
            title: 'Documents Count',

        },
        {
            data: "TotalITC",
            readOnly: true,
            title: 'Total ITC'
        },
        {
            data: "IGST",
            readOnly: true,
            title: 'IGST (₹)'
        },
        {
            data: "CGST",
            readOnly: true,
            title: 'CGST (₹)'
        },
        {
            data: "SGST",
            readOnly: true,
            title: 'SGST (₹)'
        },
        {
            data: "Cess",
            readOnly: true,
            title: 'CESS (₹)'
        },
        {
            data: "TypeofInvoiceId",
            title: "Section ID"
        }
    ]


    const [searchData, setSearchData] = useState(false)
    // const [block, setBlock] = useState(false)
    const navigate = useNavigate()
    const animatedComponents = makeAnimated()
    const [panDataFrom, setPanDataFrom] = useState([]);
    const [panData, setPanData] = useState([]);
    const [displayType, setDisplayType] = useState([]);
    const [finFromYear, setFinFormYear] = useState(null);
    const [monthFrom, setMonthFrom] = useState(null);
    const hotRef = useRef(null);

    const { setGSRT1Data, datas, setDatas, block, setBlock, wizardBtn, downloadGovtGstr6Filed, downloadStart, setDownloadStart, setExportStart, exportStart,downloadDate,setDownloadDate } = useOutletContext();
    const [gstr6Adata, setGstr6AData] = useState([])
    const G_UCParId = sessionStorage.getItem(globleVariable.G_UCParId) && SessionFunction.getSessionValue(globleVariable.G_UCParId, true)
    const G_GSTIN = sessionStorage.getItem(globleVariable.G_GSTIN) && SessionFunction.getSessionValue(globleVariable.G_GSTIN, true)
    // const gstr1Range = sessionStorage.getItem(globleVariable.gstr6FileFromDt)
    const gstr1FiledFromDt = sessionStorage.getItem(globleVariable.gstr1FiledFromDt) && SessionFunction.getSessionValue(globleVariable.gstr1FiledFromDt, true)
    const gstr1FiledToDt = sessionStorage.getItem(globleVariable.gstr1FiledToDt) && SessionFunction.getSessionValue(globleVariable.gstr1FiledToDt, true)
    const isdefaultYear = sessionStorage.getItem(globleVariable.defaultYear) && SessionFunction.getSessionValue(globleVariable.defaultYear, true)
    // && SessionFunction.getSessionValue(globleVariable.gstr1FromDt, true)
    const token = LocalFunction.getLocalValue(globleVariable.tokenKey, true);
    const SubscriptionId = localStorage.getItem(globleVariable.subscriptionId) && LocalFunction.getLocalValue(globleVariable.subscriptionId, true)
    const G_UserId = localStorage.getItem(globleVariable.userId) && LocalFunction.getLocalValue(globleVariable.userId, true)


    // ** store data
    useEffect(() => {
        //  if (isCmpySelection == true) {
        if (storeGSTR6A !== undefined) {
            console.log(storeGSTR6A, 'storeGSTR6A')
            setGstr6AData(storeGSTR6A);
            // setSearchData(true)
            setDownloadStart(false)
            setBlock(false)
        }
        // }
    }, [storeGSTR6A]);


    useEffect(() => {
        let activeTabData = {
            InvoiceList: datas,
        }
        setGSRT1Data(true, activeTabData)
    }, [datas])


    useEffect(() => {
        setPanDataFrom(YearList)
        setPanData(YearList)
        setDisplayType(true)
        setGSRT1Data(true)

    }, [])

    function formatINR(x) {
        return x.toLocaleString("en-IN", { minimumFractionDigits: 2 });
    }
    function formatTotalWithoutDecimal(x) {
        return x.toLocaleString("en-IN");
    }

    // *** with round figer value
    function emptyRender(instance, td, row, col, prop, value, cellProperties) {
        textRenderer.apply(this, arguments);
        if (col == 1 ||
            col == 2 ||
            col == 3 ||
            col == 4 ||
            col == 5) {
            // let currnecyVal = formatINR(Number(value));
            // if (currnecyVal !== 0) {
            //     td.innerText = currnecyVal;
            // }
        }
    }




    const theader = (col, TH) => {
        if (col == 0) {
            TH.className = 'htLeft'
        } else {
            TH.className = 'htRight'
        }
    }

    useEffect(() => {
        if (downloadStart) {
            GSTR1SalesSummaryService();
        }
    }, [downloadStart])


    useEffect(() => {
        console.log("wizardBtn", wizardBtn, exportStart);
        if (exportStart == true && wizardBtn == 1) {
            // debugger
            onDateSelect();
            setExportStart(false)

            // dispatch(handleExportData(false))
        }

    }, [exportStart])


    useEffect(() => {
        if (wizardBtn == 1) {
            //   debugger
            // dispatch(handleExportData(true))
        }

    }, [exportStart])



    useEffect(() => {
        finFromYear !== null && wizardBtn === 1 && GSTR1SalesSummaryService();
    }, [wizardBtn])

    useEffect(() => {
        return () => setBlock(false)
    }, [])

    const onDateSelect = () => {
        let defaultValueFrom = null;
        let defaultValueTo = null;
        if (gstr1FiledFromDt !== null && gstr1FiledFromDt !== "" && gstr1FiledFromDt !== undefined) {
            defaultValueFrom = panDataFrom?.filter((item) => item.value == gstr1FiledFromDt)[0];
        } else {
            defaultValueFrom = panDataFrom?.filter((item) => Number(item.value) == Number(isdefaultYear))[0];
        }

        if (gstr1FiledToDt !== null && gstr1FiledToDt !== "" && gstr1FiledToDt !== undefined) {
            defaultValueTo = panDataFrom?.filter((item) => item.value == gstr1FiledToDt)[0];
        } else {
            defaultValueTo = panDataFrom?.filter((item) => Number(item.value) == Number(isdefaultYear))[0];
        }

        if (defaultValueFrom !== undefined && defaultValueFrom !== null && defaultValueFrom !== "") {
            setFinFormYear(defaultValueFrom)
            // sessionStorage.setItem('gstr1FiledFromDt', defaultValueFrom?.value)
            SessionFunction.setSessionValue(globleVariable.gstr1FiledFromDt, defaultValueFrom?.value, true)
        }
        if (defaultValueTo !== undefined && defaultValueTo !== null && defaultValueTo !== "") {
            setMonthFrom(defaultValueTo)
            SessionFunction.setSessionValue(globleVariable.gstr1FiledToDt, defaultValueTo?.value, true)
            // sessionStorage.setItem('gstr1FiledToDt', defaultValueTo?.value)
        }
    }

    useEffect(() => {
        if(downloadDate){
            onDateSelect();
            
           
        const userData = {
            UserClientId: G_UCParId,
            FromRange:gstr1FiledFromDt,
            ToRange: gstr1FiledToDt,
            SubscriptionId: SubscriptionId,
            gstNumber: G_GSTIN
        }
        
        setDownloadDate(false)
        setBlock(true)
        dispatch(getGSTR6AData(userData))
        }
    }, [downloadDate]);


    useEffect(() => {

        if (displayType == true) {
            onDateSelect()
            setSearchData(true)
        }
    }, [displayType,])


    // ** Search - onclick
    const onClickSearch = () => {
        GSTR1SalesSummaryService();
    }


    // ** From date
    const selectFromYear = (value) => {
        console.log("value=", value)
        setFinFormYear(value)
        const setDt = Number(monthFrom?.srNo) > Number(value?.srNo) ? monthFrom : panDataFrom[0]
        const x = panDataFrom?.filter((item) => Number(item.srNo) >= Number(value.srNo))
        setMonthFrom(setDt)
        setPanData(x);
    }

    // ** To Date
    const selectFromMonth = (value) => {
        setMonthFrom(value);
        if (Number(finFromYear?.srNo) > Number(value?.srNo)) {
            const fromFilter = panDataFrom?.filter((item) => Number(item.srNo) == Number(value.srNo))[0]
            setFinFormYear(fromFilter)
        }
    }


    // ** Grid mouse click naivagation
    function localAfterOnCellMouseDown(event, coords, td) {
        const hot = hotRef?.current?.hotInstance;
        if (coords.row !== -1 && coords.col < 1) {
            const typeofInvoiceId = hot.getSourceDataAtRow(coords.row)['TypeofInvoiceId']
            const sectionName = hot.getSourceDataAtRow(coords.row)['Sectionname']

            navigate('/reports/gstr6a-filed-data/gstr6a-file-summary-data-details', {
                state:
                {
                    titles: "", fromDate: finFromYear.value, toDate: finFromYear.value, sectionId: typeofInvoiceId,
                    sectionname: sectionName,
                    subscriptionId: SubscriptionId,
                    G_GSTIN: G_GSTIN,
                    G_UserId: G_UserId
                }
            })
        }
    }


    // ** Search
    const GSTR1SalesSummaryService = () => {

        const userData = {
            UserClientId: G_UCParId,
            FromRange: finFromYear?.value,
            ToRange: monthFrom?.value,
            SubscriptionId: SubscriptionId,
            gstNumber: G_GSTIN
        }

        SessionFunction.setSessionValue(globleVariable.gstr1FiledFromDt, userData?.FromRange, true)
        SessionFunction.setSessionValue(globleVariable.gstr1FiledToDt, userData?.ToRange, true)

        setBlock(true)
        dispatch(getGSTR6AData(userData))

        // gstr6aSummaryService.getGSTR6Summary(G_UCParId, gstr1FiledFromDt, gstr1FiledToDt).then(res => {
        //     if (res.status === 200 && res.data.status === errorCodeConfig.APIDefaultCode.Success) {
        //         setBlock(false)
        //         setData(res.data.data)
        //         setDatas(res.data.data)
        //         setSearchData(true)
        //         setDownloadStart(false)

        //     } else {
        //         setBlock(false)
        //         toast.error(res?.data?.errorMessage, {
        //             position: "top-right",
        //         });
        //     }
        // }).catch(error => {
        //     setBlock(false)
        //     Swal.fire({
        //         icon: 'error',
        //         title: '',
        //         text: error?.message,
        //         customClass: {
        //             confirmButton: 'btn btn-danger'
        //         },
        //         buttonsStyling: false
        //     })
        // })
    }

    return (
        <Fragment>
            {block && <div className="loading1">Loading&#8230;</div>}
            <div className='content-header-left col-md-12 col-12'>
                <div className='row breadcrumbs-top mb-1'>
                    <div className="col-md-6"></div>
                    <div className="col-md-6">
                        <div className="row">
                            <div className="col-md-2"></div>
                            <div className="col-md-4">
                                <div className="row">
                                    <Label className='form-label col-md-2 pt-half ps-0' >
                                        From
                                    </Label>
                                    <Select
                                        id="from"
                                        placeholder="From"
                                        isClearable={false}
                                        theme={selectThemeColors}
                                        closeMenuOnSelect={true}
                                        options={panDataFrom}
                                        className="basic-multi-select col-md-10"
                                        classNamePrefix='select'
                                        components={animatedComponents}
                                        onChange={selectFromYear}
                                        value={finFromYear}
                                        maxMenuHeight={SELECT_MAXSIZE}
                                    />
                                </div>
                            </div>
                            <div className='col-md-4'>
                                <div className='row'>
                                    <Label className='form-label col-md-2 pt-half' >
                                        To
                                    </Label>
                                    <Select
                                        id="to"
                                        placeholder="To"
                                        isClearable={false}
                                        theme={selectThemeColors}
                                        closeMenuOnSelect={true}
                                        options={panData}
                                        components={animatedComponents}
                                        className="basic-multi-select col-md-10"
                                        classNamePrefix='select'
                                        onChange={selectFromMonth}
                                        value={monthFrom}
                                        maxMenuHeight={SELECT_MAXSIZE} />
                                </div>
                            </div>
                            <div className="col-md-2 text-md-end  ps-0">
                                <Button onClick={onClickSearch}
                                    color="danger"
                                    className="btn-icon btn-round"
                                    outline >
                                    <Search size={12} />&nbsp;Search
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
            <div className='col-12 '>
                <Row>
                    <div>
                        {/* <style>{`.gstr3bHeading{font-size: 14px !important; font-weight:bold}`}</style> */}
                        <h2 className="gstr3bHeading">Invoice Details</h2>
                    </div>
                    <Col md={12}>
                        <HotTable
                            autoWrapRow={true}
                            data={storeGSTR6A !== undefined && storeGSTR6A !== null && storeGSTR6A !== "" ? storeGSTR6A : [{ typeofInvoice: "No Data Found!" }]}
                            // autoColumnSize={true}
                            autoColumnSize={{
                                samplingRatio: 23  // Adjust the samplingRatio as needed
                              }}
                              manualColumnResize={true}
                            afterGetColHeader={theader}
                            stretchH='all'
                            preventOverflow="horizontal"
                            columns={invoiceDetails}
                            rowHeights={RowSize}
                            columnHeaderHeight={columnHeaderSize}
                            contextMenu={false}
                            bindRowsWithHeaders={true}
                            licenseKey="non-commercial-and-evaluation"
                            height="auto"
                            ref={hotRef}
                            afterOnCellMouseDown={localAfterOnCellMouseDown}
                            mergeCells={false}
                            hiddenColumns={{
                                columns: [2, 7]
                            }}
                            cells={function (row, col) {
                                var cp = {}
                                const hot = hotRef?.current?.hotInstance;
                                cp.className = 'child'
                                if (col !== null) {
                                    cp.renderer = emptyRender;
                                }
                                if (col > 0) {
                                    cp.className = 'text-end'
                                }
                                if(col ==0){
                                    cp.className="text-danger cursor-pointer"
                                }
                                return cp
                            }}
                        />
                    </Col>

                </Row>
            </div>
        </Fragment >
    )
}
export default Gstr6ASalesSummary