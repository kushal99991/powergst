import React from 'react'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Breadcrumbs from '@components/breadcrumbs'
import { Fragment } from 'react'
import { useRef } from 'react'
import { Button, Card, CardBody, Col, Row } from 'reactstrap'
import { HotTable, HotColumn } from "@handsontable/react";
import { registerAllModules } from "handsontable/registry";
import { useEffect } from 'react'
import { Plus, PlusSquare } from 'react-feather'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'
import errorCodeConfig from '../../../../configs/apiErrorCodeConfig'
import { keysMap, enableOnFormTags, RowSize, columnHeaderSize } from '../../../../configs/config'
import { textRenderer } from 'handsontable/renderers'
import { useHotkeys } from 'react-hotkeys-hook';
import GSTR3bFiledService from '../../../../services/gstr3bFiled/gstr3bFiledService'
import ReactPaginate from "react-paginate";
import { globleVariable } from '../../../../configs/globalVariable'
import SessionFunction from '../../../../configs/getSessionFunction'
import { urlEndpointConfig } from "@configs/urlEndpoint";

registerAllModules();



const GSTR3BSuppliesMade = () => {

    const tblrows = {
        placeOfSupply: "",
        taxableValue: "",
        igst: "",
    };


    const location = useLocation()
    const [supplyData, setSupplyData] = useState([]);
    const [block, setBlock] = useState(false)
    const [state, setState] = useState([]);
    const [invalidCells, setInvalidCells] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState(100);
    const [currentPage, setCurrentPage] = useState(0);

    const hotRef = useRef()

    const G_UCParId = SessionFunction.getSessionValue(globleVariable.G_UCParId, true)
    const gstr3BFiledFromDt = SessionFunction.getSessionValue(globleVariable.gstr3BFiledFromDt, true)
    const gstr3BFiledToDt = SessionFunction.getSessionValue(globleVariable.gstr3BFiledToDt, true)

    let supplyTitle = '';
    let supplyId = 1;
    let supplyDetails;
    //** Shortcut keys
    useHotkeys(keysMap.SAVE_DATA, () => { block == false && saveSupplyData() }, { enableOnFormTags });

    const supplierColumns = [
        {
            data: "PlaceOfSupply",
            // type: "dropdown",
            // source: state && state.map((item) => item.text),
            title: "Place Of Supply",
            // allowInvalid: false,
            readOnly: true
        },
        {
            data: "TaxableValue",
            title: "Total Taxable Value (₹)",
            type: "numeric",
            readOnly: true
        },

        {
            data: "IGST",
            title: `IGST (₹)`,
            type: "numeric",
            readOnly: true
        },

    ]
    const supplierNoDataColumns = [
        {
            data: "placeOfSupply",
            title: "Place Of Supplay",
            readOnly: true
        },

        {
            data: "taxableValue",
            title: "Total Taxable Value (₹)",
            readOnly: true
        },

        {
            data: "igst",
            title: `IGST (₹)`,
            readOnly: true
        },

    ]

    function formatINR(x) {
        return x.toLocaleString("en-IN", { minimumFractionDigits: 2 });
    }
    // *** with round figer value
    function emptyRender(instance, td, row, col, prop, value, cellProperties) {
        textRenderer.apply(this, arguments);
        if (col == 1 ||
            col == 2 ||
            col == 3) {
            let currnecyVal = formatINR(Number(value));


            if (currnecyVal !== 0) {
                td.innerText = currnecyVal;
            }
        }
    }


    if (location.state !== null) {
        supplyId = location.state.suppliesId !== null && location.state.suppliesId !== "null" ? location.state.suppliesId : 1
        supplyTitle = location.state.title !== null && location.state.title !== "null" ? location.state.title : ''
        supplyDetails = location?.state.rowDetails != null ? location?.state.rowDetails : []
    }

    useEffect(() => {
        // getSuppliesData()

        if (supplyDetails.length > 0) {
            const filterData = supplyDetails.filter((ele, index) => {
                return ele?.Type == supplyId
            })
            setSupplyData(filterData)
        }
    }, [])

    console.log(supplyData, "supplyDAta")

    const theader = (col, TH) => {

        if (col == 2 || col == 1) {
            TH.className = 'htRight'
        } else {
            TH.className = 'htLeft'
        }
    };

    const getSuppliesData = () => {
        setBlock(true)
        GSTR3bFiledService.getGSTR3BFiledSupplies(G_UCParId, gstr3BFiledFromDt, gstr3BFiledToDt, supplyId).then((res) => {

            if (res.status === 200 && res.data.status === errorCodeConfig.APIDefaultCode.Success) {
                setBlock(false)
                console.log(res, "supplies data");
                setState(res.data?.data?.state);
                const supplyDataRes = res.data?.data?.details
                const supplyDataLen = res.data?.data?.details?.length
                const stateData = res.data?.data?.state
                const updatedData = supplyDataRes.map(item => ({
                    ...item,
                    placeOfSupply: stateData.find(place => place.value === item.placeOfSupply)?.text || '',
                    placeOfSupplyValue: item.placeOfSupply
                }));
                console.log(updatedData, "final supply data");
                setSupplyData(updatedData)
            } else {
                setBlock(false)
                toast.error(res?.data?.errorMessage, {
                    position: "top-right",
                });
            }


        }).catch((error) => {
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

    const pageCount = Math.ceil(supplyData?.length && supplyData.length / rowsPerPage);

    // console.log(data.length, "show total data", summaryData.length);

    const para1 = currentPage * rowsPerPage;
    const para2 = currentPage * rowsPerPage + rowsPerPage;
    let supDetails = supplyData && supplyData.slice(para1, para2);

    const handlePageClick = (event) => {
        // serverSidePage = true
        setCurrentPage(event?.selected);
        // setServerSidePage(true);
    };




    return (
        <Fragment>
            {block && <div className="loading1">Loading&#8230;</div>}
            <div className='content-header row py-1'>
                <div className='content-header-left col-md-8 col-12'>
                    <div className='row breadcrumbs-top'>
                        <div className='col-12'>
                            <Breadcrumbs title='Supplies Made'
                                data={[{ title: 'Reports',link: urlEndpointConfig.REPORT_ALL },
                                 { title: 'GSTR 3B Summary',link: urlEndpointConfig.GSTR3B_FILED_REPORT,
                                //   link: `/reports/gstr3b-filed-data?gstr3b=${1}`
                                 }, 
                                 { title: `${supplyTitle}` }]} />
                        </div>
                    </div>
                </div>
                <div className='content-header-right text-md-end col-md-4 col-12 d-md-block d-none'>

                </div>

            </div>
            <div className='p-0'>
                <h2 className="mb-1">{supplyTitle}</h2>
            </div>
            <Card>
                <CardBody className="CardBody p-0">
                    <Row>
                        <div>{console.log(supplyData, "supplyDatasupplyData")}</div>
                        <div className="col-lg-12 ">
                            {supplyData?.length > 0 ?
                                <HotTable
                                    // data={[{ PlaceOfSupply: "No Data Found!" }]}
                                    // data={supplyData}
                                    data={supDetails}
                                    stretchH='all'
                                    preventOverflow="horizontal"
                                    columns={supplierColumns}
                                    rowHeights={RowSize}
                                    columnHeaderHeight={columnHeaderSize}
                                    autoColumnSize={{
                                        samplingRatio: 23  // Adjust the samplingRatio as needed
                                    }}
                                    manualColumnResize={true}
                                    contextMenu={false}
                                    bindRowsWithHeaders={true}
                                    licenseKey="non-commercial-and-evaluation"
                                    height="auto"
                                    ref={hotRef}
                                    mergeCells={false}
                                    afterGetColHeader={theader}
                                    cells={function (row, col) {
                                        var cp = {}
                                        const hot = hotRef?.current?.hotInstance;
                                        if (col !== null) {
                                            cp.renderer = emptyRender;
                                        }
                                        cp.className = 'child'
                                        if (col > 0) {
                                            cp.className = 'text-end'
                                        }

                                        return cp
                                    }}
                                    width="100%"
                                    colWidths={100}



                                /> : <HotTable
                                    mergeCells={[{ row: 0, col: 0, rowspan: 1, colspan: 3 }]}
                                    // autoColumnSize={true}
                                    stretchH='all'
                                    rowHeights={RowSize}
                                    columnHeaderHeight={columnHeaderSize}
                                    autoColumnSize={{
                                        samplingRatio: 23  // Adjust the samplingRatio as needed
                                    }}
                                    manualColumnResize={true}
                                    // style={{ overflowX: "hidden", textAlign: "center" }}
                                    data={[{ PlaceOfSupply: "No Data Found!" }]}
                                    cells={function (row, col) {
                                        var cp = {};

                                        if (col == 0) {

                                            cp.className = "text-center";
                                        }
                                        return cp;

                                    }}
                                    preventOverflow="horizontal"
                                    columns={supplierColumns}
                                    contextMenu={false}
                                    bindRowsWithHeaders={true}
                                    licenseKey="non-commercial-and-evaluation"
                                    height="auto"
                                    afterGetColHeader={theader}
                                />
                            }

                            {supDetails?.length > 100 ? (
                                <ReactPaginate
                                    breakLabel="..."
                                    nextLabel=""
                                    onPageChange={handlePageClick}
                                    pageRangeDisplayed={2}
                                    pageCount={pageCount}
                                    previousLabel=""
                                    renderOnZeroPageCount={null}
                                    forcePage={currentPage}
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
                            ) : (
                                <></>
                            )}
                        </div>
                    </Row>
                </CardBody>
            </Card>


        </Fragment>
    )
}

export default GSTR3BSuppliesMade