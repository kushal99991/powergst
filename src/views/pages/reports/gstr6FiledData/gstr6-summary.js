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
import { useSelector, useDispatch } from "react-redux";
import { Search } from 'react-feather'

import gstr6SummaryService from "../../../../services/gstr6Filed/gstr6filedService"
import Swal from "sweetalert2"
import errorCodeConfig from "../../../../configs/apiErrorCodeConfig"
import { registerRenderer, textRenderer } from 'handsontable/renderers';
import { registerAllModules } from 'handsontable/registry';
import { globleVariable } from '../../../../configs/globalVariable'
import LocalFunction from '../../../../configs/getLocalFunction'
import extractZip from "../../../../helper/extraZip"
import SessionFunction from '../../../../configs/getSessionFunction'
import { getGSTR6SummaryRedux } from "../../../apps/user/store"


const finYearOption = localStorage.getItem(globleVariable.rangeFilters) && LocalFunction.getLocalValue(globleVariable.rangeFilters, true)
const YearList = finYearOption !== undefined && finYearOption !== null && finYearOption !== "" && finYearOption !== 'undefined' ? JSON.parse(finYearOption) : []

registerAllModules();

const Gstr6SalesSummary = () => {
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
            data: "totalITC",
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

    const itcDistributionDetails = [
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
    const hotRefAmendment = useRef(null);
    const { setGSRT1Data, datas, setDatas, block, setBlock, wizardBtn, displayDownload, setDisplayDownload, displayType1, setDisplayType1, downloadGovtGstr6Filed, downloadStart, setDownloadStart,downloadDate,setDownloadDate } = useOutletContext();
    const [data, setData] = useState([])
    const G_UCParId = sessionStorage.getItem(globleVariable.G_UCParId) && SessionFunction.getSessionValue(globleVariable.G_UCParId, true)
    const G_GSTIN = sessionStorage.getItem(globleVariable.G_GSTIN) && SessionFunction.getSessionValue(globleVariable.G_GSTIN, true)
    const subId = localStorage.getItem(globleVariable.subscriptionId) && LocalFunction.getLocalValue(globleVariable.subscriptionId, true);

    // const gstr1Range = sessionStorage.getItem(globleVariable.gstr6FileFromDt) 
    const gstr1FiledFromDt = sessionStorage.getItem(globleVariable.gstr1FiledFromDt) && SessionFunction.getSessionValue(globleVariable.gstr1FiledFromDt, true)
    const gstr1FiledToDt = sessionStorage.getItem(globleVariable.gstr1FiledToDt) && SessionFunction.getSessionValue(globleVariable.gstr1FiledToDt, true)
    const isdefaultYear = sessionStorage.getItem(globleVariable.defaultYear) && SessionFunction.getSessionValue(globleVariable.defaultYear, true)
    // && SessionFunction.getSessionValue(globleVariable.gstr1FromDt, true)
    const token = LocalFunction.getLocalValue(globleVariable.tokenKey, true);
    const dispatch = useDispatch();


    const store6Summary = useSelector((state) => state?.users?.GSTR6FiledSummary?.[0]?.Summary);
    const loader = useSelector((state) => state?.users);


    useEffect(() => {
        if(loader?.isLoading == true || loader?.isLoading == "true"){
            setBlock(true)
        } else{
            setBlock(false)
        }
    }, [loader?.isLoading])


    useEffect(() => {

        let activeTabData = {
            InvoiceList: datas,
        }
        setGSRT1Data(true, activeTabData)
    }, [datas])


    const renewFun = () => {
        setDisplayType([]);
        setDisplayType(true);
    }


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
        if (
            col == 3 ||
            col == 4 ||
            col == 5 ||
            col == 6) {
            let currnecyVal = formatINR(Number(value));
            if (currnecyVal !== 0) {
                td.innerText = currnecyVal;
            }
        }
    }




    const theader = (col, TH) => {
        if (col == 0) {
            TH.className = 'htLeft'
        } else {
            TH.className = 'htRight'
        }
    }


    // useEffect(() => {
    //     if (downloadStart) {
    //         if (store6Summary?.length < 1) {
    //             const userData = {
    //                 UserClientId: G_UCParId,
    //                 FinancialYear: gstr1FiledFromDt,
    //                 FinMonth: gstr1FiledToDt,
    //                 subId: subId,
    //                 G_GSTIN: G_GSTIN
    //             }

    //             console.log("gstr6 payload=", userData);
    //             //   setBlock(true)
    //             dispatch(getGSTR6SummaryRedux(userData))

    //         } else {
    //             setBlock(false)
    //             // alert("hii")
    //             setData(store6Summary?.[0]?.Summary ? store6Summary?.[0]?.Summary : [])
    //             setDatas(store6Summary?.[0]?.Summary ? store6Summary?.[0]?.Summary : [])
    //             setSearchData(true)
    //             setDownloadStart(false)
    //         }
    //         // GSTR1SalesSummaryService();
    //     }
    // }, [downloadStart])

    // useEffect(() => {
    //     if (store6Summary?.length < 1) {
    //         // alert("hii1")

    //         const userData = {
    //             UserClientId: G_UCParId,
    //             FinancialYear: gstr1FiledFromDt,
    //             FinMonth: gstr1FiledToDt,
    //             subId: subId,
    //             G_GSTIN: G_GSTIN
    //         }

    //         console.log("gstr6 payload=", userData);
    //         //   setBlock(true)
    //         dispatch(getGSTR6SummaryRedux(userData))

    //     } else {
    //         setBlock(false)

    //         setData(store6Summary?.[0]?.Summary ? store6Summary?.[0]?.Summary : [])
    //         setDatas(store6Summary?.[0]?.Summary ? store6Summary?.[0]?.Summary : [])
    //         setSearchData(true)
    //         setDownloadStart(false)
    //     }

    // }, [store6Summary]);


    // useEffect(() => {
    //     if (store6Summary?.length < 1) {
    //         // alert("hii1")

    //         const userData = {
    //             UserClientId: G_UCParId,
    //             FinancialYear: gstr1FiledFromDt,
    //             FinMonth: gstr1FiledToDt,
    //             subId: subId,
    //             G_GSTIN: G_GSTIN
    //         }

    //         console.log("gstr6 payload=", userData);
    //         setBlock(true)
    //         dispatch(getGSTR6SummaryRedux(userData))

    //     } else {
    //         setBlock(false)

    //         setData(store6Summary?.[0]?.Summary ? store6Summary?.[0]?.Summary : [])
    //         setDatas(store6Summary?.[0]?.Summary ? store6Summary?.[0]?.Summary : [])
    //         setSearchData(true)
    //         setDownloadStart(false)
    //     }
    // }, [monthFrom, finFromYear, wizardBtn])

    // useEffect(() => {
    //     return () => setBlock(false)
    // }, [])


    // useEffect(() => {
    //     console.log('default value');
    //     if (displayType == true) {
    //         // alert("are")
    //         let defaultValueFrom = null;
    //         let defaultValueTo = null;
    //         if (gstr1FiledFromDt !== null && gstr1FiledFromDt !== "" && gstr1FiledFromDt !== undefined) {
    //             console.log('set from date')
    //             defaultValueFrom = panData?.filter((item) => item.value == gstr1FiledFromDt)[0];
    //         } else {
    //             defaultValueFrom = panData?.filter((item) => Number(item.value) == Number(isdefaultYear))[0];
    //         }

    //         if (gstr1FiledToDt !== null && gstr1FiledToDt !== "" && gstr1FiledToDt !== undefined) {
    //             defaultValueTo = panData?.filter((item) => item.value == gstr1FiledToDt)[0];
    //         } else {
    //             defaultValueTo = panData?.filter((item) => Number(item.value) == Number(isdefaultYear))[0];
    //         }

    //         if (defaultValueFrom !== undefined && defaultValueFrom !== null && defaultValueFrom !== "") {
    //             setFinFormYear(defaultValueFrom)
    //             // sessionStorage.setItem('gstr1FiledFromDt', defaultValueFrom?.value)
    //             SessionFunction.setSessionValue(globleVariable.gstr1FiledFromDt, defaultValueFrom?.value, true)
    //         }
    //         if (defaultValueTo !== undefined && defaultValueTo !== null && defaultValueTo !== "") {
    //             setMonthFrom(defaultValueTo)
    //             SessionFunction.setSessionValue(globleVariable.gstr1FiledToDt, defaultValueTo?.value, true)

    //             // sessionStorage.setItem('gstr1FiledToDt', defaultValueTo?.value)
    //         }
    //     }

    // }, [displayType, displayType1])

    const onDateSelect = () => {
        let defaultValueFrom = null;
        let defaultValueTo = null;
        if (gstr1FiledFromDt !== null && gstr1FiledFromDt !== "" && gstr1FiledFromDt !== undefined) {
            console.log('set from date')
            defaultValueFrom = panData?.filter((item) => item.value == gstr1FiledFromDt)[0];
        } else {
            defaultValueFrom = panData?.filter((item) => Number(item.value) == Number(isdefaultYear))[0];
        }

        if (gstr1FiledToDt !== null && gstr1FiledToDt !== "" && gstr1FiledToDt !== undefined) {
            defaultValueTo = panData?.filter((item) => item.value == gstr1FiledToDt)[0];
        } else {
            defaultValueTo = panData?.filter((item) => Number(item.value) == Number(isdefaultYear))[0];
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
      // ** Set From and to Date by session
      useEffect(() => {
        if (displayType == true) {
            onDateSelect()

        }
    }, [displayType,displayType1])

    useEffect(() => {
        if(downloadDate){
            onDateSelect();
            
            const userData = {
                UserClientId: G_UCParId,
                FinancialYear: gstr1FiledFromDt,
                FinMonth:gstr1FiledToDt,
                subId: subId,
                G_GSTIN: G_GSTIN
            }
            // setBlock(true)
            dispatch(getGSTR6SummaryRedux(userData))
            setDownloadDate(false)
        }
    }, [downloadDate]);

    // const checkAPIFire = sessionStorage.getItem("setRefreshAPIReportDataDeletGSTR6Filed");

//   useEffect(() => {
//     if ((checkAPIFire== "true" || checkAPIFire==true) && finFromYear?.value == undefined){
//       const userData = {
//         clientid: G_UCParId,
//         finyear: finFromYear?.value,
//         finmonth: monthFrom?.value,
//         subscriptionId: subId,
//         gstNumber: G_GSTIN,
//       };

//       setBlock(true);
//       dispatch(getGSTR6SummaryRedux(userData));
//       sessionStorage.setItem("setRefreshAPIReportDataDeletGSTR6Filed",false)
//     }
//   }, [checkAPIFire,finFromYear?.value]);

    useEffect(() => {
        if (displayDownload) {
            // alert("sdema")
            onClickSearch()
        }
    }, [displayDownload])

    useEffect(() => {
        finFromYear !== null && wizardBtn === 1 && onClickSearch();
    }, [wizardBtn])

    const onClickSearch = () => {
        const userData = {
            UserClientId: G_UCParId,
            FinancialYear: finFromYear?.value ? finFromYear?.value : gstr1FiledFromDt,
            FinMonth: monthFrom?.value ? monthFrom?.value : gstr1FiledToDt,
            subId: subId,
            G_GSTIN: G_GSTIN
        }

        console.log("gstr6 payload=", userData);
        SessionFunction.setSessionValue(globleVariable.gstr1FiledFromDt, finFromYear?.value ? finFromYear?.value : gstr1FiledFromDt, true);
        SessionFunction.setSessionValue(globleVariable.gstr1FiledToDt, monthFrom?.value ? monthFrom?.value : gstr1FiledToDt, true)

        setBlock(true)
        dispatch(getGSTR6SummaryRedux(userData))
        setDisplayDownload(false)
        // if (finFromYear?.value || monthFrom?.value) {
    }

    const selectFromYear = (value) => {
        console.log("value=", value)
        setFinFormYear(value)
        const setDt = Number(monthFrom?.srNo) > Number(value?.srNo) ? monthFrom : panDataFrom[0]
        const x = panDataFrom?.filter((item) => Number(item.srNo) >= Number(value.srNo))
        // sessionStorage.setItem('gstr1FiledFromDt', value?.value)

        setMonthFrom(setDt)
        setPanData(x);

        // SessionFunction.setSessionValue(globleVariable.gstr1FiledFromDt, value?.value, true);
        // SessionFunction.setSessionValue(globleVariable.gstr1FiledToDt, setDt?.value, true)

    }
    const selectFromMonth = (value) => {

        setMonthFrom(value);

        if (Number(finFromYear?.srNo) > Number(value?.srNo)) {
            const fromFilter = panDataFrom?.filter((item) => Number(item.srNo) == Number(value.srNo))[0]
            setFinFormYear(fromFilter)
            // sessionStorage.setItem('gstr1FiledFromDt', fromFilter?.value)
            // sessionStorage.setItem('gstr1FiledToDt', fromFilter?.value)
            // SessionFunction.setSessionValue(globleVariable.gstr1FiledFromDt, fromFilter?.value, true)
            // SessionFunction.setSessionValue(globleVariable.gstr1FiledToDt, fromFilter?.value, true)
        } else {
            // sessionStorage.setItem('gstr1FiledToDt', value?.value)
            // SessionFunction.setSessionValue(globleVariable.gstr1FiledToDt, value?.value, true)
        }

    }


    function localAfterOnCellMouseDown(event, coords, td) {
        const hot = hotRef?.current?.hotInstance;
        if (coords.row !== -1 && coords.col < 1) {
            const TypeofInvoiceId = hot.getDataAtRow(coords.row)[7];
            console.log(TypeofInvoiceId, "typeofInvoiceId", hot.getDataAtRow(coords.row))
            const data = hot.getDataAtRow(coords.row)[0];
            navigate('/reports/gstr6-filed-data/gstr6-summary-invoices', {
                state:
                {
                    titles: "", finyear: finFromYear.value, finmonth: finFromYear.value, sectionId: TypeofInvoiceId,
                }
            })
        }

    }
    function localAfterOnCellMouseDownAmendment(event, coords, td) {
        const hot = hotRefAmendment?.current?.hotInstance;
        if (coords.row !== -1 && coords.col < 1) {
            const typeofInvoiceId = hot.getDataAtRow(coords.row)[7];
            navigate('/reports/gstr6-filed-data/gstr6-summary-invoices', {
                state:
                {
                    titles: "", finyear: finFromYear.value, finmonth: finFromYear.value, sectionId: typeofInvoiceId,
                }
            })
        }
    }



    const GSTR1SalesSummaryService = () => {
        // setBlock(true)
        gstr6SummaryService.getGSTR6Summary(G_UCParId, gstr1FiledFromDt, gstr1FiledToDt, subId, G_GSTIN).then(res => {
            if (res.data !== null) {
                console.log("summary data", res)
                setBlock(false)
                const userData = extractZip(res.data.data);
                dispatch(getGSTR6SummaryRedux(userData))
                // setData(res.data.data)
                // setDatas(res.data.data)
                // setSearchData(true)
                // setDownloadStart(false)

            } else {
                setBlock(false)
                toast.error(res?.data?.errorMessage, {
                    position: "top-right",
                });
            }
        })
            .catch(error => {
                setBlock(false)
                Swal.fire({
                    icon: 'error',
                    title: '',
                    text: error?.message,
                    customClass: {
                        confirmButton: 'btn btn-danger'
                    },
                    buttonsStyling: false
                })
            })
    }

    return (
        <Fragment>
            {(block ||loader?.isLoading) && <div className="loading1">Loading&#8230;</div>}
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
                                        maxMenuHeight={SELECT_MAXSIZE}
                                    />

                                </div>

                            </div>
                            <div className="col-md-2 text-md-end ps-0">
                                <Button onClick={onClickSearch}
                                    className="btn-icon btn-round"
                                    color="danger" outline>
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
                        {console.log("hello c2", data)}
                        <HotTable
                            autoWrapRow={true}
                            data={store6Summary?.length > 0 ? store6Summary?.slice(0, 4):[]}
                            // autoColumnSize={true}
                            autoColumnSize={{
                                samplingRatio: 23  // Adjust the samplingRatio as needed
                              }}
                              manualColumnResize={true}
                            afterGetColHeader={theader}
                            stretchH='all'
                            preventOverflow="horizontal"
                            rowHeights={RowSize}
                            columnHeaderHeight={columnHeaderSize}
                            columns={invoiceDetails}
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
                                    // cp.renderer = emptyRender;
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
                    <div >
                        <h2 className="mt-1 gstr3bHeading">ITC Distribution Details</h2>
                    </div>
                    <Col md={12}>
                        <HotTable
                            data={store6Summary?.length > 0? store6Summary?.slice(4, 8):[]}
                            afterGetColHeader={theader}
                            stretchH='all'
                            preventOverflow="horizontal"
                            columns={itcDistributionDetails}
                            contextMenu={false}
                            bindRowsWithHeaders={true}
                            rowHeights={RowSize}
                            columnHeaderHeight={columnHeaderSize}
                            licenseKey="non-commercial-and-evaluation"
                            height="auto"
                            ref={hotRefAmendment}
                            autoColumnSize={{
                                samplingRatio: 23  // Adjust the samplingRatio as needed
                              }}
                              manualColumnResize={true}
                            autoWrapRow={true}
                            afterOnCellMouseDown={localAfterOnCellMouseDownAmendment}
                            mergeCells={false}
                            hiddenColumns={{
                                columns: [2, 7]
                            }}
                            cells={function (row, col) {
                                var cp = {}
                                const hot = hotRefAmendment?.current?.hotInstance;
                                cp.className = 'child'
                                if (col !== null) {
                                    // cp.renderer = emptyRender;
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
export default Gstr6SalesSummary