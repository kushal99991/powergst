import { Fragment, useRef } from "react"
import { Col, Label, Row, Button } from "reactstrap"
import { HotTable } from "@handsontable/react"
import { selectThemeColors } from '@utils'
import Select from 'react-select'
import { useState } from "react"
import { SELECT_MAXSIZE, RowSize, columnHeaderSize } from '../../../configs/config'
import toast from 'react-hot-toast'
import makeAnimated from 'react-select/animated'
import { useEffect } from "react"
import { useNavigate, useOutletContext } from "react-router-dom"
import itc04SummaryService from "../../../services/itc04Services/itc04SummaryService"
import Swal from "sweetalert2"
import errorCodeConfig from "../../../configs/apiErrorCodeConfig"
import { registerAllModules } from 'handsontable/registry';
import { Search } from 'react-feather'
import { globleVariable } from '../../../configs/globalVariable'
import LocalFunction from '../../../configs/getLocalFunction'
import SessionFunction from '../../../configs/getSessionFunction'

const finYearOption = LocalFunction.getLocalValue(globleVariable.rangeFiltersITC04, true)
const YearList = finYearOption !== undefined && finYearOption !== null && finYearOption !== "" && finYearOption !== 'undefined' ? JSON.parse(finYearOption) : []

console.log(YearList, "finYearOption")

registerAllModules();


const ItcSalesSummary = () => {

    // ** Column
    const invoiceDetails = [
        {
            data: "typeofInvoice",
            readOnly: true,
            title: 'Type Of Invoice',
            width: '400'
        },

        {
            data: "documentCount",
            readOnly: true,
            title: 'Documents Count',
            width: '100'

        },
        {
            data: "totalTaxableAmount",
            readOnly: true,
            title: 'Taxable Value'
        },
        {
            data: "typeofInvoiceId",
            title: "Section ID"
        }
    ]

    // const [block, setBlock] = useState(false)
    const navigate = useNavigate()
    const animatedComponents = makeAnimated()
    const [panDataFrom, setPanDataFrom] = useState([]);
    const [panData, setPanData] = useState([]);
    const [displayType, setDisplayType] = useState([]);
    const [finFromYear, setFinFormYear] = useState(null);
    const [finFromYearDup, setFinFormYearDup] = useState(null);
    const [monthFrom, setMonthFrom] = useState(null);
    const hotRef = useRef(null);
    const [data, setData] = useState([])

    const { setGSRT1Data, datas, setDatas, block, setBlock, wizardBtn } = useOutletContext();

    const G_UCParId = sessionStorage.getItem(globleVariable.G_UCParId) && SessionFunction.getSessionValue(globleVariable.G_UCParId, true)
    const itc04DateRange = sessionStorage.getItem(globleVariable.itc04DateRange) && SessionFunction.getSessionValue(globleVariable.itc04DateRange)

    useEffect(() => {
        let activeTabData = {
            InvoiceList: datas
        }
        setGSRT1Data(true, activeTabData)
    }, [datas])

    useEffect(() => {
        setPanDataFrom(YearList)
        setPanData(YearList)
        setDisplayType(true)
        setGSRT1Data(true)

    }, [])

    const theader = (col, TH) => {

        if (col == 0) {
            TH.className = 'htLeft'
        } else {
            TH.className = 'htRight'
        }
    }

    useEffect(() => {
        finFromYear !== null && wizardBtn == 0 && ITCSalesSummaryService();
    }, [finFromYearDup])

    useEffect(() => {
        return () => setBlock(false)
    }, [])


    useEffect(() => {
        console.log('default value');
        if (displayType == true) {
            let defaultValueFrom = null;
            let defaultValueTo = null;

            if (itc04DateRange !== null && itc04DateRange !== "" && itc04DateRange !== undefined) {
                console.log('set from date')
                defaultValueFrom = panData?.filter((item) => item.value == itc04DateRange)[0];
            } else {
                defaultValueFrom = panData?.filter((item) => Number(item.value) == Number(sessionStorage.getItem(globleVariable.defaultYear) && SessionFunction.getSessionValue(globleVariable.defaultYear, true)))[0];
            }

            if (defaultValueFrom !== undefined && defaultValueFrom !== null && defaultValueFrom !== "") {
                defaultValueFrom = panDataFrom?.filter((item) => item.value == itc04DateRange)[0];
                setFinFormYear(defaultValueFrom)
                setFinFormYearDup(defaultValueFrom)
                // sessionStorage.setItem('gstr1FromDt', defaultValueFrom?.value)
                SessionFunction.setSessionValue(globleVariable.itc04DateRange, defaultValueFrom?.value)
                SessionFunction.setSessionValue(globleVariable.itc04ExpLabel, defaultValueFrom?.label)

                sessionStorage.setItem(globleVariable.itc04DownloadFromDt, defaultValueFrom?.value)
            } else {
                setFinFormYear(panData[0])
                setFinFormYearDup(panData[0])
                sessionStorage.setItem(globleVariable.itc04DownloadFromDt, panData[0].value)
            }
        }

    }, [displayType])


    const selectFromYear = (value) => {
        console.log("value=", value)
        setFinFormYear(value)
        const setDt = Number(monthFrom?.srNo) > Number(value?.srNo) ? monthFrom : panDataFrom[0]
        const x = panDataFrom?.filter((item) => Number(item.srNo) >= Number(value.srNo))
        setMonthFrom(setDt)
        setPanData(x);

        sessionStorage.setItem(globleVariable.itc04DownloadFromDt, setDt?.value)

    }

    function localAfterOnCellMouseDown(event, coords, td) {
        const hot = hotRef?.current?.hotInstance;

        if (coords.row !== -1 && coords.col < 1) {

            const typeofInvoiceId = hot.getDataAtRow(coords.row)[3]
            console.log(typeofInvoiceId, "typeofInvoiceId")
            const data = hot.getDataAtRow(coords.row)[0];

            navigate('/gst-returns/itc-returns/itc-summary-details', {
                state:
                {
                    titles: "", finyear: finFromYear.value, finmonth: finFromYear.value, sectionId: typeofInvoiceId,

                }
            })
        }

    }



    const ITCSalesSummaryService = () => {

        SessionFunction.setSessionValue(globleVariable.itc04DateRange, finFromYear?.value)
        SessionFunction.setSessionValue(globleVariable.itc04ExpLabel, finFromYear?.label)

        setBlock(true)
        itc04SummaryService.getITC04Summary(G_UCParId, finFromYear?.value, finFromYear?.value).then(res => {
            if (res.status === 200 && res.data.status === errorCodeConfig.APIDefaultCode.Success) {
                setBlock(false)
                setData(res.data.data)
                setDatas(res.data.data)
            } else {
                setBlock(false)
                toast.error(res?.data?.errorMessage, {
                    position: "top-right",
                });
            }
        }).catch(error => {
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

    const onClickSearch = () => {
        ITCSalesSummaryService();
    }


    return (
        <Fragment>
            {block && <div className="loading1">Loading&#8230;</div>}
            <div className='content-header-left col-md-12 col-12'>
                <div className='row breadcrumbs-top mb-1'>
                    <div className='col-md-5'></div>
                    <div className="col-md-7">

                        <div className='row'>
                            <div className="col-md-10">
                                <div className="row">
                                    <div className="col-md-2 "></div>
                                    <Label className='form-label col-md-6 pt-half text-end' >
                                        Return Period
                                    </Label>
                                    <Select
                                        id="from"
                                        placeholder="From"
                                        isClearable={false}
                                        theme={selectThemeColors}
                                        closeMenuOnSelect={true}
                                        options={panDataFrom}
                                        className="basic-multi-select col-md-4"
                                        classNamePrefix='select'
                                        components={animatedComponents}
                                        onChange={selectFromYear}
                                        value={finFromYear}
                                        maxMenuHeight={SELECT_MAXSIZE}
                                    // isDisabled={true}
                                    />
                                </div>
                            </div>
                            <div className='col-md-2 text-md-end'>
                                <Button onClick={onClickSearch}
                                    className="btn-icon btn-round"
                                    color="danger" outline>
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
                        <style>{`.gstr3bHeading{font-size: 14px !important; font-weight:bold}`}</style>
                        <h2 className="gstr3bHeading">Invoice Details</h2>
                    </div>
                    <Col md={12}>
                        <HotTable
                            autoWrapRow={true}
                            data={datas?.length ? datas : [{ typeofInvoice: "No Data Found!" }]}
                            autoColumnSize={true}
                            afterGetColHeader={theader}
                            rowHeights={RowSize}
                            columnHeaderHeight={columnHeaderSize}
                            stretchH='all'
                            preventOverflow="horizontal"
                            columns={invoiceDetails}
                            style={!datas?.length ? { textAlign: "center" } : ''}
                            mergeCells={datas?.length ? false : [{ row: 0, col: 0, rowspan: 1, colspan: 3 }]}
                            contextMenu={false}
                            bindRowsWithHeaders={true}
                            licenseKey="non-commercial-and-evaluation"
                            height="auto"
                            ref={hotRef}
                            afterOnCellMouseDown={localAfterOnCellMouseDown}
                            hiddenColumns={{
                                columns: [3]
                            }}

                            cells={function (row, col) {
                                var cp = {}
                                const hot = hotRef?.current?.hotInstance;
                                cp.className = 'child'

                                if (datas?.length > 0) {
                                    if (col == 0) {
                                        cp.className = 'text-danger cursor-pointer'
                                    } else if (col > 0) {
                                        cp.className = 'text-end'
                                    }
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

export default ItcSalesSummary

