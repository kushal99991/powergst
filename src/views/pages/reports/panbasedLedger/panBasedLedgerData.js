import React, { useState } from 'react'
import { Fragment, useRef } from "react";
import Breadcrumbs from '@components/breadcrumbs'
import { Button, Card, CardBody, Col, Row, UncontrolledTooltip , Badge } from 'reactstrap';
import { HotTable } from '@handsontable/react';
import { RowSize, columnHeaderSize, keysMap, enableOnFormTags } from '../../../../configs/config';
import { registerAllModules } from "handsontable/registry";
import { useHotkeys } from 'react-hotkeys-hook';
import { useEffect } from 'react';
import panLedgerService from '../../../../services/ledgersServices/panLedgerService';
import { globleVariable } from '../../../../configs/globalVariable';
import getSessionFunction from '../../../../configs/getSessionFunction';
import getLocalFunction from '../../../../configs/getLocalFunction';
import Swal from "sweetalert2"
import errorCodeConfig from '../../../../configs/apiErrorCodeConfig';
import toast from 'react-hot-toast'
import { downloadURL } from '@helper/downloadUrl'
import { Search , Download } from 'react-feather'
import { useNavigate } from "react-router-dom";
import {urlEndpointConfig} from '@configs/urlEndpoint'

const panBasedLedgerData = () => {

    //** register Handsontable's modules
    registerAllModules();
    const navigate = useNavigate();

    //** EXPORT_ALL_DATA sortcut
    useHotkeys(
        keysMap.EXPORT_ALL_DATA,
        () => {
            !block && getPanLedgerExport();
        },
        { enableOnFormTags }
    );

    //** panbased ledger Column
    const panbasedLedgerColumns = [
        {
            data: "",
            title: "",
            width: 20,
            minwidth: 40,
            maxwidth: 80,
        },
        {
            data: "Description",
            title: "Description",
            width: 130,
        },
        {
            data: "TotalTax",
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
            data: "Cess",
            title: "CESS (₹)",
        },
    ];
    //** panbased ledger data
    // const panbasedLedgerData = [
    //     {
    //         Description: 'Cash Ledger',
    //         TotalTax: 0,
    //         IGST: 0,
    //         CGST: 0,
    //         SGST: 0,
    //         Cess: 0,

    //     },
    //     {
    //         Description: 'Credit Ledger',
    //         TotalTax: 0,
    //         IGST: 0,
    //         CGST: 0,
    //         SGST: 0,
    //         Cess: 0,

    //     },
    // ];

    //** panbased companywise ledger Column
    const panbasedCompanywiseColumns = [
        {
            data: "GSTIN",
            title: "GSTIN",
        },
        {
            data: "TotalTax",
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
            data: "Cess",
            title: "CESS (₹)",
        },

    ];

    //** panbased companywise ledger data
    // const panbasedCompanywiseData = [
    //     {
    //         gstin: '05AAACP6287B1ZM',
    //         totalTax: 0,
    //         igst: 0,
    //         cgst: 0,
    //         sgst: 0,
    //         cess: 0,
    //         __children: [
    //             {
    //                 gstin: "Cash Ledger",
    //                 totalTax: 0,
    //                 igst: 0,
    //                 cgst: 0,
    //                 sgst: 0,
    //                 cess: 0,
    //             },
    //             {
    //                 gstin: 'Credit Ledger',
    //                 totalTax: 0,
    //                 igst: 0,
    //                 cgst: 0,
    //                 sgst: 0,
    //                 cess: 0,
    //             },

    //         ],
    //     },
    //     {
    //         gstin: '24AAACP6287B1ZM',
    //         totalTax: 0,
    //         igst: 0,
    //         cgst: 0,
    //         sgst: 0,
    //         cess: 0,
    //         __children: [
    //             {
    //                 gstin: "Cash Ledger",
    //                 totalTax: 0,
    //                 igst: 0,
    //                 cgst: 0,
    //                 sgst: 0,
    //                 cess: 0,
    //             },
    //             {
    //                 gstin: 'Credit Ledger',
    //                 totalTax: 0,
    //                 igst: 0,
    //                 cgst: 0,
    //                 sgst: 0,
    //                 cess: 0,
    //             },

    //         ],
    //     },
    //     {
    //         gstin: '26AAACP6287B1ZI',
    //         totalTax: 0,
    //         igst: 0,
    //         cgst: 0,
    //         sgst: 0,
    //         cess: 0,
    //         __children: [
    //             {
    //                 gstin: "Cash Ledger",
    //                 totalTax: 0,
    //                 igst: 0,
    //                 cgst: 0,
    //                 sgst: 0,
    //                 cess: 0,
    //             },
    //             {
    //                 gstin: 'Credit Ledger',
    //                 totalTax: 0,
    //                 igst: 0,
    //                 cgst: 0,
    //                 sgst: 0,
    //                 cess: 0,
    //             },

    //         ],
    //     },

    // ];

    // const panbasedCompanywiseData =
    //     [
    //         {
    //             "gstin": "24AAACD5352M1ZN",
    //             "igst": 25128,
    //             "cgst": 12627263.05,
    //             "sgst": 125977795,
    //             "cess": 170941465,
    //             "totalTax": 309571651.05,
    //             "__children": [
    //                 {
    //                     "gstin": "Cash Ledger",
    //                     "igst": 25128,
    //                     "cgst": 22910,
    //                     "sgst": 17224,
    //                     "cess": 0,
    //                     "totalTax": 65262
    //                 },
    //                 {
    //                     "gstin": "Credit Ledger",
    //                     "igst": 0,
    //                     "cgst": 12604353.05,
    //                     "sgst": 125960571,
    //                     "cess": 170941465,
    //                     "totalTax": 309506389.05
    //                 }
    //             ]
    //         }
    //     ]

    const [block, setBlock] = useState(false);
    const [panLedgerData, setPanLedgerData] = useState([]);
    const [companywisePanLedgerData, setCompanyPanLedgerData] = useState([]);
    const [allData, setAllData] = useState([]);
    const [options, setOptions] = useState([]);
    const [value, setValue] = useState([]);
    const [lastGeneratedDate, setLastGeneratedDate] = useState(false);
    const [selectedYear, setSelectedYear] = useState("");

    const hotRef = useRef(null);
    const hotRef1 = useRef(null);

    const token = localStorage.getItem(globleVariable.tokenKey) && getLocalFunction.getLocalValue(globleVariable.tokenKey, true)

    const G_UCParId = sessionStorage.getItem(globleVariable.G_UCParId) && getSessionFunction.getSessionValue(globleVariable.G_UCParId, true);
    const UserId = localStorage.getItem(globleVariable.userId) && getLocalFunction.getLocalValue(globleVariable.userId, true);
    const subscriptionId = localStorage.getItem(globleVariable.subscriptionId) && getLocalFunction.getLocalValue(globleVariable.subscriptionId, true);
    const G_GSTIN = getSessionFunction.getSessionValue(globleVariable.G_GSTIN, true);

    const UserClientId =
        sessionStorage.getItem(globleVariable.G_UCParId) &&
        getSessionFunction.getSessionValue(globleVariable.G_UCParId, true);

    const GGSTIN =
        sessionStorage.getItem(globleVariable.G_GSTIN) &&
        getSessionFunction.getSessionValue(globleVariable.G_GSTIN, true);

    const word =
        selectedYear?.label ??
        sessionStorage.getItem("combinationYear") ??
        "2023-2024";

    const [startYear, endYear] =
        word != undefined && word != null && word?.split("-");

    console.log(G_UCParId, UserId, subscriptionId, G_GSTIN, '--ids--');

    useEffect(() => {
        return () => setBlock(false);
    }, []);

    useEffect(() => {
        CheckExistDataService();
    }, []);


    const collapseFunction = () => {
        setTimeout(() => {
            const hotMatching = hotRef?.current?.hotInstance;
            hotMatching?.getPlugin("nestedRows")?.collapsingUI.collapseAll();
        }, 300);
    };

    const collapseFunction1 = () => {
        setTimeout(() => {
            const hotMatching = hotRef1?.current?.hotInstance;
            hotMatching?.getPlugin("nestedRows")?.collapsingUI.collapseAll();
        }, 300);
    };

    const ClearDataFunc = () => {
        setBlock(false)
        collapseFunction()
        collapseFunction1()
    };

    async function CheckExistDataService() {
        try {
            setBlock(true)
            const response = await panLedgerService.getPanBasedLadderCheckExistData(
                UserClientId,
                subscriptionId,
                GGSTIN,
                'PanBasedLedger'
            );

            if (response !== null) {
                setBlock(false)

                if (response?.[0]?.PanLevelData?.Ledgers) {
                    setPanLedgerData(response?.[0]?.PanLevelData?.Ledgers)
                }

                if (response?.[0]?.CompanyWiseData) {
                    setCompanyPanLedgerData(response?.[0]?.CompanyWiseData)
                }

            } else {
                ClearDataFunc()
            }
        } catch (error) {
            // Handle error
            console.log(error);
        }
    };


    //** get PanLedger Details
    // const getPanLedgerDetails = () => {
    //     setBlock(true)
    //     panLedgerService.getPanLedger(G_UCParId, UserId, subscriptionId, G_GSTIN)
    //         .then((res) => {
    //             setBlock(false);

    //             if (res !== null) {
    //                 if (res?.[0]?.LastGeneratedReportDate) {
    //                     setLastGeneratedDate(res?.[0]?.LastGeneratedReportDate)
    //                 }

    //                 // TODO: Verify with response
    //                 if (res?.panLevelData?.ledgers) {
    //                     setPanLedgerData(res?.panLevelData?.ledgers)
    //                 }

    //                 if (res?.companyWiseData) {
    //                     setCompanyPanLedgerData(res?.companyWiseData)
    //                 }
    //             }
    //         })
    //         .catch((error) => {
    //             setBlock(false);
    //             Swal.fire({
    //                 icon: "error",
    //                 title: "",
    //                 text: error?.message,
    //                 customClass: {
    //                     confirmButton: "btn btn-danger",
    //                 },
    //                 buttonsStyling: false,
    //             });
    //         });
    // }

    async function getPanLedgerDetails() {
        try {
          setBlock(true)
            const response = await panLedgerService.getPanLedger(
                G_UCParId, UserId, subscriptionId, G_GSTIN
            );

            if (response !== null) {
                setBlock(false)


                if (response == -11005 ) {
                    navigate(urlEndpointConfig.REQUESTOTP)
                } else {
                    if (response?.[0]?.PanLevelData?.Ledgers) {
                        setPanLedgerData(response?.[0]?.PanLevelData?.Ledgers)
                    }

                    if (response?.[0]?.CompanyWiseData) {
                        setCompanyPanLedgerData(response?.[0]?.CompanyWiseData)
                    }
                }



            } else {
                ClearDataFunc()
            }


        } catch (error) {
          setBlock(false)
         console.error(error);
        }
      }


    //** get Export PanLedger Details
    const getPanLedgerExport = () => {
        setBlock(true)
        panLedgerService.panLedgerExportData(G_UCParId, UserId, subscriptionId, G_GSTIN,token)
            .then((res) => {
                setBlock(false);
                if (
                    res.status === 200 &&
                    res.data.status === errorCodeConfig.APIDefaultCode.Success

                ) {
                    console.log(res?.data?.data, 'msg')
                    downloadURL(res.data.data);
                } else {
                    setBlock(false);
                    toast.error(res?.data?.errorMessage, {
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
                        confirmButton: "btn btn-danger",
                    },
                    buttonsStyling: false,
                });
            });
    }



    //** Hide filter / text align option
    const theader1 = (col, TH) => {
        if (col < 2) {
            TH.className = "htLeft";
        } else {
            TH.className = "htRight";
        }
    };


    //** Hide filter / text align option
    const theader2 = (col, TH) => {
        if (col < 1) {
            TH.className = "htLeft";
        } else {
            TH.className = "htRight";
        }
    };


    return (
        <Fragment>
            {block && <div className="loading1">Loading&#8230;</div>}
            <div className="content-header row py-1">
                <div className="content-header-left col-md-5 col-6">
                    <div className="row breadcrumbs-top mb-0">
                        <div className="col-12">
                            <Breadcrumbs
                                title="PAN Based Ledger"
                                data={[
                                    { title: "Reports",link: urlEndpointConfig.REPORT_ALL  },
                                    { title: "PAN Based Ledger"},
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

                     &nbsp;&nbsp;&nbsp;
                    {/* Export Button  */}
                    <Button
                        type="button"
                        className="btn-icon"
                        outline
                        onClick={getPanLedgerExport}
                        id="exportData"
                        // disabled={activeTab.btnDisable1}
                        color="danger"
                    >
                        <i className="fa fa-file-excel-o"></i> Export
                    </Button>
                    <UncontrolledTooltip placement="top" target="exportData">
                        Export   [{keysMap.EXPORT_ALL_DATA}]
                    </UncontrolledTooltip>


                    &nbsp;&nbsp;&nbsp;
                    <Button
                        type="button"
                        className="btn-icon"
                        outline
                        onClick={getPanLedgerDetails}
                        id="exportData1"
                        // disabled={activeTab.btnDisable1}
                        color="danger"
                    >
                          <Download size={14} /> {" "} Generate Ledger
                        {/* <i className="fa fa-file-search-o"></i>  */}
                    </Button>
                </div>
            </div>
            <div>
                <h3 className='heading-font-18-weight'>Pan Level</h3>
                <Row>
                    <Col>
                        {/* Pan-level ledger Data-Table */}
                        <Card>
                            <CardBody className="CardBody  p-0">
                                <Row>
                                    <Col md="12">
                                        <div>
                                            {panLedgerData.length > 0 ? (
                                                <HotTable
                                                    id="panlevelLedger"
                                                    data={panLedgerData}
                                                    rowHeights={RowSize}
                                                    columnHeaderHeight={columnHeaderSize}
                                                    autoColumnSize={true}
                                                    readOnly={true}
                                                    cells={function (row, col) {
                                                        var cp = {}
                                                        cp.className = 'child'
                                                        if (col > 1) {
                                                            cp.className = 'text-end'
                                                        }
                                                        return cp
                                                    }}
                                                    ref={hotRef}
                                                    stretchH="all"
                                                    preventOverflow="horizontal"
                                                    afterGetColHeader={theader1}
                                                    columns={panbasedLedgerColumns}
                                                    contextMenu={false}
                                                    bindRowsWithHeaders={true}
                                                    licenseKey="non-commercial-and-evaluation"
                                                    height="auto"
                                                    mergeCells={false}
                                                    filters={true}
                                                    comments={true}
                                                />
                                            ) : (
                                                <HotTable
                                                    id="panlevelLedger"
                                                    data={[{ discription: "No Data Found!" }]}
                                                    mergeCells={[{ row: 0, col: 0, rowspan: 1, colspan: 6 }]}
                                                    readOnly={true}
                                                    columns={panbasedLedgerColumns}
                                                    afterGetColHeader={theader1}
                                                    stretchH='all'
                                                    preventOverflow="horizontal"
                                                    cells={function (row, col) {
                                                        var cp = {}
                                                        // cp.className = 'child'
                                                        if (col == 0) {
                                                            cp.className = 'text-center'
                                                        }

                                                        return cp
                                                    }}
                                                    rowHeaders={false}
                                                    contextMenu={false}
                                                    bindRowsWithHeaders={true}
                                                    licenseKey="non-commercial-and-evaluation"
                                                    height="auto"
                                                    filters={true}
                                                />
                                            )}
                                        </div>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
            <div>
                <h3 className='heading-font-18-weight'>Company Wise</h3>
                <Row>
                    <Col>
                        {/* Pan-level companywise ledger Data-Table */}
                        <Card>
                            <CardBody className="CardBody  p-0">
                                <Row>
                                    <Col md="12">
                                        {companywisePanLedgerData?.[0]?.__children ? <div>
                                            <HotTable
                                                id="Itc"
                                                columnHeaderHeight={columnHeaderSize}
                                                data={companywisePanLedgerData}
                                                preventOverflow="horizontal"
                                                rowHeights={RowSize}
                                                autoColumnSize={true}
                                                stretchH="all"
                                                cells={function (row, col) {
                                                    var cp = {}
                                                    cp.className = 'child'
                                                    if (col > 0) {
                                                        cp.className = 'text-end'
                                                    }
                                                    if (row % 3 === 0 && col === 0) {
                                                        cp.className = "parent";
                                                    }

                                                    // else {
                                                    //   cp.className = "child";
                                                    // }
                                                    return cp
                                                }}
                                                columns={panbasedCompanywiseColumns}
                                                rowHeaders={function (index) {
                                                    return "";
                                                }}
                                                nestedRows={true}
                                                contextMenu={true}
                                                bindRowsWithHeaders={true}
                                                autoWrapRow={true}
                                                autoWrapCol={true}
                                                licenseKey="non-commercial-and-evaluation"
                                                height="auto"
                                                readOnly={true}
                                                comments={true}
                                                afterGetColHeader={theader2}
                                            />
                                        </div> :

                                            <HotTable
                                                id="panlevelLedger"
                                                data={[{ gstin: "No Data Found!" }]}
                                                mergeCells={[{ row: 0, col: 0, rowspan: 1, colspan: 6 }]}
                                                readOnly={true}
                                                columns={panbasedCompanywiseColumns}
                                                afterGetColHeader={theader2}
                                                stretchH='all'
                                                preventOverflow="horizontal"
                                                cells={function (row, col) {
                                                    var cp = {}
                                                    // cp.className = 'child'
                                                    if (col == 0) {
                                                        cp.className = 'text-center'
                                                    }

                                                    return cp
                                                }}
                                                rowHeaders={false}
                                                contextMenu={false}
                                                bindRowsWithHeaders={true}
                                                licenseKey="non-commercial-and-evaluation"
                                                height="auto"
                                                filters={true}
                                            />

                                        }
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        </Fragment>
    )
}

export default panBasedLedgerData
