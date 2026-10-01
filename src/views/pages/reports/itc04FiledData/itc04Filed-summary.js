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
import gstr6SummaryService from "../../../../services/gstr6Filed/gstr6filedService"
import itc04SummaryService from "../../../../services/itc04FiledServices/itc04SummaryService"
import Swal from "sweetalert2"
import errorCodeConfig from "../../../../configs/apiErrorCodeConfig"
import { registerRenderer, textRenderer } from 'handsontable/renderers';
import { registerAllModules } from 'handsontable/registry';
import { globleVariable } from '../../../../configs/globalVariable'
import LocalFunction from '../../../../configs/getLocalFunction'
import SessionFunction from '../../../../configs/getSessionFunction'
import { useDispatch, useSelector } from 'react-redux'
import { getItc04FiledData } from './store'
import { useLocation } from "react-router-dom";
import { Search } from 'react-feather'


const finYearOption = localStorage.getItem(globleVariable.rangeFiltersITC04) && LocalFunction.getLocalValue(globleVariable.rangeFiltersITC04, true)
const YearList = finYearOption !== undefined && finYearOption !== null && finYearOption !== "" && finYearOption !== 'undefined' ? JSON.parse(finYearOption) : []

registerAllModules();


const ITC04SalesSummary = () => {
    // ** Columne
    console.log(YearList, 'YearList')
    const invoiceDetails = [
        {
            data: "TypeofInvoice",
            readOnly: true,
            title: 'Type Of Invoice',
            width: '400'
        },

        {
            data: "DocumentCount",
            readOnly: true,
            title: 'Documents Count',
            width: '100',
            type: 'numeric',
            numericFormat: {
                pattern: ''
            }

        },
        {
            data: "TotalTaxableAmount",
            readOnly: true,
            title: 'Taxable Value',
            type: 'numeric',
            numericFormat: {
                pattern: "0.00",
            }
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
    const { setGSRT1Data, datas, setDatas, block, setBlock, wizardBtn, downloadGovtITC04Filed, downloadStart, setDownloadStart, setExportStart, exportStart, downloadDate, setDownloadDate } = useOutletContext();
    const [data, setData] = useState([])
    const G_UCParId = sessionStorage.getItem(globleVariable.G_UCParId) && SessionFunction.getSessionValue(globleVariable.G_UCParId, true)
    const G_GSTIN = sessionStorage.getItem(globleVariable.G_GSTIN) && SessionFunction.getSessionValue(globleVariable.G_GSTIN, true)

    const itc04DateRange = sessionStorage.getItem(globleVariable.itc04DateRange) && SessionFunction.getSessionValue(globleVariable.itc04DateRange, false)

    const isdefaultYear = sessionStorage.getItem(globleVariable.defaultYear) && SessionFunction.getSessionValue(globleVariable.defaultYear, true)
    const subscriptionId = localStorage.getItem(globleVariable.subscriptionId) && LocalFunction.getLocalValue(globleVariable.subscriptionId, true);
    const G_UserId = localStorage.getItem(globleVariable.userId) && LocalFunction.getLocalValue(globleVariable.userId, true)

    const dispatch = useDispatch();

    // ** redux data
    const storeITC04 = useSelector(
        (state) => state?.itcO4Filed?.ITC04Summary?.[0]?.Summary
    );

    useEffect(() => {

        if (storeITC04 !== undefined) {

            setDownloadStart(false)
            setBlock(false)

        }
    }, [storeITC04]);

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

    useEffect(() => {

        if (exportStart == true && wizardBtn == 1) {
            onDateSelect();
            setExportStart(false)
        }

    }, [exportStart])

    // ** handsontable afterGetColHeader event
    const theader = (col, TH) => {
        if (col == 0) {
            TH.className = 'htLeft'
        } else {
            TH.className = 'htRight'
        }
    }

    useEffect(() => {
        
            if (itc04DateRange !== undefined ) {
                Itc04SalesSummaryService();
            }


    }, [])


    useEffect(() => {
        finFromYear !== null && wizardBtn === 1 && Itc04SalesSummaryService();
    }, [wizardBtn])

    useEffect(() => {
        return () => setBlock(false)
    }, [])

    const onDateSelect = () => {
        console.log('default value');
        let defaultValueFrom = null;
        if (itc04DateRange !== null && itc04DateRange !== "" && itc04DateRange !== undefined) {

            defaultValueFrom = panDataFrom?.filter((item) => item.value == itc04DateRange)[0];
        } else {
            defaultValueFrom = panDataFrom?.filter((item) => Number(item.value) == Number(isdefaultYear))[0];
        }

        if (defaultValueFrom !== null && defaultValueFrom !== "" && defaultValueFrom !== undefined) {
            defaultValueFrom = panDataFrom?.filter((item) => item.value == itc04DateRange)[0];
            setFinFormYear(defaultValueFrom);

            SessionFunction.setSessionValue(globleVariable.itc04DateRange, defaultValueFrom?.value);

        } else {
            setFinFormYear(panData[0])
        }

    }

    useEffect(() => {

        if (downloadDate) {

            onDateSelect();
            
            const userData = {
                UserClientId: G_UCParId,
                range: itc04DateRange,
                SubscriptionId: subscriptionId,
                gstNumber: G_GSTIN
            }
            setBlock(true)
            dispatch(getItc04FiledData(userData))
                .then(() => {
                    setDownloadDate(false)
                    setBlock(false);
                })
                .catch(error => {
                    setDownloadDate(false)
                    console.error('Error fetching data:', error);
                    setBlock(false);
                });

        }
    }, [downloadDate]);

    useEffect(() => {

        if (displayType == true) {

            onDateSelect();

        }
    }, [displayType])

    const selectFromYear = (value) => {
        console.log("value=", value)
        setFinFormYear(value)
        const setDt = Number(monthFrom?.srNo) > Number(value?.srNo) ? monthFrom : panDataFrom[0]
        const x = panDataFrom?.filter((item) => Number(item.srNo) >= Number(value.srNo))
        setMonthFrom(setDt)
        setPanData(x);
    }
    const selectFromMonth = (value) => {

        setMonthFrom(value);

        if (Number(finFromYear?.srNo) > Number(value?.srNo)) {
            const fromFilter = panDataFrom?.filter((item) => Number(item.srNo) == Number(value.srNo))[0]
            setFinFormYear(fromFilter)
        } else {
            // sessionStorage.setItem('gstr1FiledToDt', value?.value)
            //  SessionFunction.setSessionValue(globleVariable.gstr1FiledToDt, value?.value, true)
        }

    }

    function localAfterOnCellMouseDown(event, coords, td) {
        const hot = hotRef?.current?.hotInstance;

        if (coords.row !== -1 && coords.col < 1) {
            // const typeofInvoiceId = hot.getDataAtRow(coords.row)[6]
            const typeofInvoiceId = hot.getDataAtRow(coords.row)[3]
            console.log(typeofInvoiceId, "typeofInvoiceId")
            const data = hot.getDataAtRow(coords.row)[0];

            navigate('/reports/itc04-filed-data/itc04-file-summary-data-details', {
                state:
                {
                    titles: "", finyear: finFromYear.value, finmonth: finFromYear.value, sectionId: typeofInvoiceId, subscriptionId: subscriptionId,
                    G_GSTIN: G_GSTIN, G_UserId: G_UserId
                }
            })
        }

    }

    const Itc04SalesSummaryService = () => {

        if (finFromYear?.value !== undefined) {
            const userData = {
                UserClientId: G_UCParId,
                range: finFromYear?.value,
                SubscriptionId: subscriptionId,
                gstNumber: G_GSTIN
            }
            SessionFunction.setSessionValue(globleVariable.itc04DateRange, userData.range)
            setBlock(true)
            dispatch(getItc04FiledData(userData))
                .then(() => {
                    setBlock(false);
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                    setBlock(false);
                });
        }
    }

    const onClickSearch = () => {
        Itc04SalesSummaryService();
    }

    // ** For Currency Formating
    function formatINR(x) {
        return x.toLocaleString("en-IN", { minimumFractionDigits: 2 });
    }
    function formatTotalWithoutDecimal(x) {
        return x.toLocaleString("en-IN");
    }

    // *** Currency formate with round figer value
    function emptyRender(instance, td, row, col, prop, value, cellProperties) {
        textRenderer.apply(this, arguments);

        textRenderer.apply(this, arguments);
        if (
            col == 1 ||
            col == 2

        ) {
            let currnecyVal = formatINR(Number(value));
            if (currnecyVal !== 0) {
                td.innerText = currnecyVal;
            }
        }

    }

    return (
        <Fragment>
            {block && <div className="loading1">Loading&#8230;</div>}
            <div className='content-header-left col-md-12 col-12'>
                <div className='row breadcrumbs-top mb-1'>
                    <div className="col-md-5"></div>
                    <div className="col-md-7">
                        <div className="row">
                            {/* <div className="col-md-2 ps-0"></div> */}
                            <div className="col-md-10">
                                <div className="row">
                                    <div className="col-md-2 "></div>
                                    <Label className='form-label col-md-4 pt-half text-end' >
                                        Return Period
                                    </Label>

                                    <Select
                                        id="from"
                                        placeholder="From"
                                        isClearable={false}
                                        theme={selectThemeColors}
                                        closeMenuOnSelect={true}
                                        options={panDataFrom}
                                        className="basic-multi-select col-md-6 "
                                        classNamePrefix='select'
                                        components={animatedComponents}
                                        onChange={selectFromYear}
                                        value={finFromYear}
                                        maxMenuHeight={SELECT_MAXSIZE}
                                    />
                                </div>
                            </div>
                            <div className='col-md-2 text-md-end'>
                                <Button onClick={onClickSearch}
                                    className="btn-icon btn-round" color="danger" outline>
                                    <Search size={12} />&nbsp;Search
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='col-12 '>
                <Row>
                    <div>
                        {/* <style>{`.gstr3bHeading{font-size: 14px !important; font-weight:bold}`}</style> */}
                        <h2 className="gstr3bHeading">Invoice Details</h2>
                    </div>
                    <Col md={12}>
                        <HotTable
                            autoWrapRow={true}
                            data={storeITC04 !== undefined && storeITC04 !== null && storeITC04 !== "" ? storeITC04 : [{ typeofInvoice: "No Data Found!" }]}
                            // autoColumnSize={true}
                            autoColumnSize={{
                                samplingRatio: 23  // Adjust the samplingRatio as needed
                            }}
                            manualColumnResize={true}
                            rowHeights={RowSize}
                            columnHeaderHeight={columnHeaderSize}
                            afterGetColHeader={theader}
                            stretchH='all'
                            preventOverflow="horizontal"
                            columns={invoiceDetails}
                            contextMenu={false}
                            bindRowsWithHeaders={true}
                            licenseKey="non-commercial-and-evaluation"
                            height="auto"
                            ref={hotRef}
                            afterOnCellMouseDown={localAfterOnCellMouseDown}
                            mergeCells={false}
                            hiddenColumns={{
                                columns: [3]
                            }}
                            cells={function (row, col) {
                                var cp = {}
                                const hot = hotRef?.current?.hotInstance;
                                cp.className = 'child'
                                if (col > 0) {
                                    cp.className = 'text-end'
                                }
                                if (col == 0) {
                                    cp.className = "text-danger cursor-pointer"
                                }
                                if (col !== null) {
                                    cp.renderer = emptyRender;
                                }

                                return cp
                            }}
                        />
                    </Col>
                </Row>
            </div>
        </Fragment>
    )
}
export default ITC04SalesSummary