import { Fragment, useState, useEffect, useRef } from "react";
import {
    Accordion,
    AccordionBody,
    AccordionHeader,
    AccordionItem,
    Button,
    Col,
    Row
} from "reactstrap";
import {
    ArrowLeft, ArrowRight, Download, Upload
} from "react-feather";
import { HotTable } from "@handsontable/react";
import ReactPaginate from "react-paginate";
import { RowSize, columnHeaderSize, PROJECT_URL } from "../../../configs/config";
import { textRenderer } from "handsontable/renderers";
import $ from 'jquery'
import Swal from "sweetalert2";
import errorCodeConfig from "../../../configs/apiErrorCodeConfig";
import VerificationModal from "../../../views/pages/verification-otp/index";
import { globleVariable } from "../../../configs/globalVariable";
import GSTR9CService from "../../../services/gstr9c/gstr9cService";

const UploadGstr9c = (props) => {
    const [block, setBlock] = useState(false);
    const [open, setOpen] = useState("1");
    const [data, setData] = useState([]);
    const [pages, setPages] = useState(0);
    const [pageSize, setPageSize] = useState(8);
    const [activeClassName, setActiveClassName] = useState("active");
    const [logData, setLogData] = useState([]);
    const [logDataFilter, setLogDataFilter] = useState([]);
    const [msgDisplay, setMsgDisplay] = useState(null);
    const [btnDisable, setBtnDisable] = useState(false);
    const [composeOpen, setComposeOpen] = useState(false);

    const hotRef = useRef(null);

    const { stepper, clientIds, GSTIN, userIds, wizardIndex, isGSTR9CFiledStatus, finYearId } = props;

    const para1 = pages * pageSize;
    const para2 = pages * pageSize + pageSize;
    const pageCount = Math.ceil(data?.length && data?.length / pageSize);
    const toggleCompose1 = () => setComposeOpen(!composeOpen);

    let dataShow = data && data?.slice(para1, para2);

    useEffect(() => {
        return () => setBlock(false);
    }, []);

    useEffect(() => {
        if (wizardIndex == 2) {
            govtErrorLog(0);
            if (isGSTR9CFiledStatus) {
                stepper.next()
                sessionStorage.setItem("btnDisable9c", '5');
            }
            // returnFileStatus()
        }

    }, [wizardIndex]);

    const toggle = (id) => {
        open === id ? setOpen() : setOpen(id);
    };

    const Columns = [
        {
            data: "logId",
            readOnly: true,
            title: "logId",
        },

        {
            data: "date",
            readOnly: true,
            title: "Date",
        },
        {
            data: "action",
            readOnly: true,
            title: "Action",
        },

        {
            data: "status",
            readOnly: true,
            title: "Status",
        },

        {
            title: "#",
            readOnly: true,

        },
    ];

    const theader = (col, TH) => {
        if (col == 1 ||
            col == 2 ||
            col == 3 ||
            col == 4) {
            TH.className = 'htLeft'
        }
    }


    const logDetails = (logid) => {
        GSTR9CService.gstr9CGovtReturnErrorLogStatus(logid)
            .then((res) => {
                if (
                    res.status === 200 &&
                    res.data.status === errorCodeConfig.APIDefaultCode.Success
                ) {
                    setLogData(res.data.data)
                    setLogDataFilter(res.data.data)
                } else if (res.status === 200 &&
                    res.data.status == '-13011') {
                    Swal.fire({
                        icon: "error",
                        title: "",
                        text: res?.data?.data,
                        customClass: {
                            confirmButton: "btn btn-danger",
                        },
                        buttonsStyling: false,
                    });
                }
                // else if (res.status === 200 &&
                //   res.data.status == '-13012') {
                //   setModalShow(!modalShow)
                //   setLogData(res.data.data)
                //   setLogDataFilter(res.data.data)
                // }
            })
            .catch((error) => {
                setBlock(false)
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

    function emptyRender(instance, td, row, col, prop, value, cellProperties, coords) {
        textRenderer.apply(this, arguments);
        // if row contains negative number
        if (!value) {
            const vId = instance.getDataAtCell(row, "logId");
            const actionValue = instance.getDataAtCell(row, "action");
            const status = instance.getDataAtCell(row, "status");

            const encrptyValue = btoa(vId);

            const urlDirect = PROJECT_URL + '/gst-returns/gstr9c/gstr9cfiled?' + encrptyValue;

            if (actionValue?.toLowerCase() == 'generate gstr9c summary') {
                td.innerHTML = `<a href=${urlDirect} target='_BLANK'  >View</a>`;
                td.className = "text-center";
            }
            else if (actionValue?.toLowerCase() !== 'generate gstr9c summary' && status?.toLowerCase() !== 'success') {
                td.innerHTML = `<a class="btn_click"   target='_BLANK' >View</a>`;
                td.className = "text-center";
            }
            else {
                td.innerHTML = `<a>-</a>`;
                td.className = "text-secondary text-center";
            }

            $(td).find('.btn_click').on('click', event => {
                logDetails(vId)
            });

            td.style.cursor = "pointer";
        }
    };


    const govtErrorLog = (pageNo, IsNextStep, isOpenUrl) => {
        const payLoad = {
            userClientId: clientIds,
            userId: userIds,
            loggedGSTIN: GSTIN,
            pageStart: pages + 1,
            pageSize: pageSize,
            financialYearId:finYearId
        };

        setBlock(true);
        GSTR9CService.gstr9CGovtReturnLogStatus(payLoad)
            .then((res) => {
                if (
                    res.status === 200 &&
                    res.data.status === errorCodeConfig.APIDefaultCode.Success
                ) {
                    setBlock(false);
                    setData(res?.data?.data?.data);
                    setBtnDisable(res?.data?.data?.lastStatus);

                    sessionStorage.setItem("btnDisable9c", res?.data?.data?.lastStatus);

                    if (isOpenUrl == "isOpenUrl") {
                        if (res?.data?.data?.data?.length > 0) {
                            let redirectFirstRow = res?.data?.data?.data[0];
                            const vId = redirectFirstRow?.logId;
                            const actionValue = redirectFirstRow?.action;
                            const status = redirectFirstRow?.status;

                            let encrptyValue = btoa(vId);
                            let urlDirect =
                                PROJECT_URL + "/gst-returns/gstr9c/gstr9cfiled?" + encrptyValue;

                            if (actionValue?.toLowerCase() == "generate gstr1 summary") {
                                window.open(urlDirect.toString(), "_blank");
                            } else if (
                                actionValue?.toLowerCase() !== "generate gstr1 summary" &&
                                status?.toLowerCase() !== "success"
                            ) {
                                window.open(urlDirect.toString(), "_blank");
                            }
                        }
                    }

                    if (IsNextStep) {
                        setBlock(false);
                        stepper.next();
                    }
                } else {
                    setBtnDisable(5);
                    setBlock(false);
                    Swal.fire({
                        icon: "warning",
                        title: "",
                        text: res?.data?.errorMessage,
                        customClass: {
                            confirmButton: "btn btn-danger",
                        },
                        buttonsStyling: false,
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
    };

    const gstr9CSaveGovtOnClick = () => {
        const payLoad = {
            userClientId: clientIds,
            userId: userIds,
            financialYearId: finYearId,
            loggedGSTIN: GSTIN,
        };

        setBlock(true);
        GSTR9CService.gstr9CSaveGovt(payLoad)
            .then((res) => {
                if (res.data.status === errorCodeConfig.APIDefaultCode.GovtOTPExpire) {
                    setMsgDisplay(res?.data?.errorMessage)
                    setBlock(false);
                    setComposeOpen(true)
                } else {
                    if (
                        res.status === 200 &&
                        res.data.status === errorCodeConfig.APIDefaultCode.Success
                    ) {
                        setBlock(false);
                        toast.success(res?.data?.successMessage, {
                            position: "top-right",
                        });
                        govtErrorLog(0);
                        toggle("2");

                    } else {
                        setBlock(false);
                        Swal.fire({
                            icon: "warning",
                            title: "",
                            text: res?.data?.errorMessage,
                            customClass: {
                                confirmButton: "btn btn-danger",
                            },
                            buttonsStyling: false,
                        });
                    }
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

    const generateSummaryOnClick = () => {
        const payLoad = {
            userClientId: clientIds,
            userId: userIds,
            financialYearId: finYearId,
            loggedGSTIN: GSTIN,
        };

        setBlock(true);
        GSTR9CService.getGstr9CSummaryGovt(payLoad)
            .then((res) => {
                if (res.data.status === errorCodeConfig.APIDefaultCode.GovtOTPExpire) {
                    setMsgDisplay(res?.data?.errorMessage)
                    setBlock(false);
                    setComposeOpen(true)
                } else {
                    if (
                        res.status === 200 &&
                        res.data.status === errorCodeConfig.APIDefaultCode.Success
                    ) {
                        govtErrorLog(0, true, 'isOpenUrl');
                        toast.success(res?.data?.successMessage, {
                            position: "top-right",
                        })
                    } else {
                        setBlock(false);
                        Swal.fire({
                            icon: "warning",
                            title: "",
                            text: res?.data?.errorMessage,
                            customClass: {
                                confirmButton: "btn btn-danger",
                            },
                            buttonsStyling: false,
                        });
                    }
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

    const handlePageClick = (event) => {
        setPages(event);
    };

    const gstR9CAckNumber =
    sessionStorage.getItem("gstR9CAckNumber") !== null &&
      sessionStorage.getItem("gstR9CAckNumber") !== "" &&
      sessionStorage.getItem("gstR9CAckNumber") !== undefined
      ? true
      : false;

    return (
        <Fragment>
            {block && <div className="loading1">Loading&#8230;</div>}
            <div>
                <Row className="mb-3">
                    <Col md={6}>
                        <style>{`.gstr1Filing{font-size: 18px !important; font-weight:bold}`}</style>
                        <style>{`.gstr1FilingButton{font-size: 18px !important; font-weight:bold}`}</style>
                        <style>{`.gstr1FilingTitle{font-size: 14px !important; font-weight:bold}`}</style>
                        <Accordion className="accordion-border" open={open} toggle={toggle}>
                            <AccordionItem>
                                <AccordionHeader targetId="1">
                                    <p className="gstr1Filing"> 1. Upload Data To Government </p>
                                </AccordionHeader>
                                <AccordionBody accordionId="1">
                                    <div className="d-grid mb-1 mb-lg-0">
                                        <Button
                                            className="btn-icon me-1"
                                            outline
                                            color="danger"
                                            size="lg"
                                            onClick={gstr9CSaveGovtOnClick}
                                            disabled={gstR9CAckNumber || btnDisable == 5 ? true : false}
                                        >
                                            <Upload size={25} />
                                            <span className="align-middle  gstr1FilingButton">
                                                Upload Data To Government
                                            </span>
                                        </Button>
                                    </div>
                                </AccordionBody>
                            </AccordionItem>

                            <AccordionItem>
                                <AccordionHeader targetId="2">
                                    <p className="gstr1Filing">2. Generate Summary </p>
                                </AccordionHeader>
                                <AccordionBody accordionId="2">
                                    <div className="d-grid mb-1 mb-lg-0">
                                        <Button
                                            className="btn-icon me-1"
                                            outline
                                            color="danger"
                                            size="lg"
                                            onClick={generateSummaryOnClick}
                                            disabled={gstR9CAckNumber || btnDisable == 5 ? true : btnDisable >= 2 ? false : true}
                                        >
                                            <Download size={25} />
                                            <span className="align-middle ms-50 gstr1FilingButton">
                                                Generate Summary
                                            </span>
                                        </Button>
                                    </div>
                                </AccordionBody>
                            </AccordionItem>
                        </Accordion>
                    </Col>
                    <Col md={6}>
                        <Row>
                            <Col md={12}>
                                <h3 className="gstr1FilingTitle">JSON Upload Status</h3>
                            </Col>
                        </Row>
                        <Row>

                            <Col md={12}>
                                <HotTable
                                    className="myRow"
                                    style={!dataShow ? { overflowX: "hidden", textAlign: "center" } : ""}
                                    afterGetColHeader={theader}
                                    rowHeights={RowSize}
                                    columnHeaderHeight={columnHeaderSize}
                                    mergeCells={!dataShow ? [{ row: 0, col: 0, rowspan: 1, colspan: 5 }] : false}
                                    data={!dataShow ? [{ logId: "No data found" }] : dataShow}
                                    // data={dataShow ? dataShow : []}
                                    ref={hotRef}
                                    stretchH="all"
                                    preventOverflow="horizontal"
                                    columns={Columns}
                                    contextMenu={false}
                                    bindRowsWithHeaders={true}
                                    licenseKey="non-commercial-and-evaluation"
                                    height="auto"
                                    autoWrapRow={true}
                                    hiddenColumns={{
                                        columns: [0],
                                    }}
                                    cells={function (row, col) {
                                        const hot = hotRef?.current?.hotInstance;
                                        const cellProperties = {};
                                        if (row != -1 && col == 4) {
                                            if (dataShow) {
                                                cellProperties.renderer = emptyRender;
                                                cellProperties.className = "text-center";
                                            }

                                        }
                                        return cellProperties;
                                    }}
                                />
                                {
                                    dataShow &&
                                    <ReactPaginate
                                        breakLabel="..."
                                        nextLabel=""
                                        onPageChange={(e) => handlePageClick(e?.selected)}
                                        pageRangeDisplayed={2}
                                        pageCount={pageCount}
                                        forcePage={pages}
                                        previousLabel=""
                                        renderOnZeroPageCount={null}
                                        marginPagesDisplayed={2}
                                        activeClassName={activeClassName}
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
                                }
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>

            <div style={{ zIndex: "999", }} className='btnFixFooter'>
                <div className="container">
                    <div style={{ margintop: "100px" }} className="d-flex justify-content-between">
                        <Button
                            color="danger"
                            className="btn-prev"
                            onClick={() => stepper.previous()}
                        >
                            <ArrowLeft
                                size={14}
                                className="align-middle me-sm-25 me-0"
                            ></ArrowLeft>
                            <span className="align-middle d-sm-inline-block d-none">
                                Previous
                            </span>
                        </Button>
                        <Button
                            color="danger"
                            className="btn-next"
                            onClick={() => stepper.next()}
                        >
                            <span className="align-middle d-sm-inline-block d-none">Next</span>
                            <ArrowRight
                                size={14}
                                className="align-middle ms-sm-25 ms-0"
                            ></ArrowRight>
                        </Button>
                    </div>
                </div>
            </div>
            <VerificationModal composeOpen={composeOpen} toggleCompose={toggleCompose1} userClientIds={clientIds}
                messageDisplay={msgDisplay} otpGSTIN={GSTIN}
            ></VerificationModal>
        </Fragment>
    );
};

export default UploadGstr9c;
