import { Fragment, useState, useEffect, useRef } from "react";
import {
  Button,
  Col,
  Row,
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  Modal,
  ModalBody,
} from "reactstrap";
import {
  Download,
  Upload,
  ArrowLeft,
  ArrowRight,
  X,
} from "react-feather";
import GSTR3BDownloadService from "../../../services/gstr3b/gstr3bDownloadService";
import gstr3bDownloadService from "../../../services/gstr3b/gstr3bDownloadService";
import { SELECT_MAXSIZE, PROJECT_URL, RowSize, columnHeaderSize } from "../../../configs/config";
import makeAnimated from "react-select/animated";
import { globleVariable } from "../../../configs/globalVariable";
import LocalFunction from "../../../configs/getLocalFunction";
import SessionFunction from "../../../configs/getSessionFunction";
import Swal from "sweetalert2";
import errorCodeConfig from "../../../configs/apiErrorCodeConfig";
import toast from "react-hot-toast";
import { useForm, Controller } from "react-hook-form";
import $ from 'jquery'
import { HotTable } from "@handsontable/react";
import { registerRenderer, textRenderer } from "handsontable/renderers";
import { registerAllModules } from "handsontable/registry";
import ReactPaginate from "react-paginate";
import VerificationModal from '../../../views/pages/verification-otp/index'
import WithoutOtpModel from "../../components/WithoutOtpModel/WithoutOtpModel";


const defaultValues = {
  otp: "",
};

const Gstr3Download = (props) => {
  
  let hotRef = useRef(null);
  const { stepper, } = props;
  const [pageSize, setPageSize] = useState(8);
  const [pages, setPages] = useState(0);
  const [activeClassName, setActiveClassName] = useState("active");

  const returnDate = sessionStorage.getItem(globleVariable.gstr3bDownloadFromDt);

  const [data, setData] = useState([
  ]);

  const [msgDisplay, setMsgDisplay] = useState(null);
  const [composeOpen, setComposeOpen] = useState(false);
  const [logData, setLogData] = useState([])
  const [logDataFilter, setLogDataFilter] = useState([])
  const [isShowModel, setIsShowModel] = useState(false);
const [openWithoutOtpFailed, setopenWithoutOtpFailed] = useState(false);
  const toggleCompose1 = () => setComposeOpen(!composeOpen)

  let GFY =
  sessionStorage.getItem(globleVariable.G_FY) &&
  SessionFunction.getSessionValue(globleVariable.G_FY, true);
   let GFM =
  sessionStorage.getItem(globleVariable.G_FM) &&
  SessionFunction.getSessionValue(globleVariable.G_FM, true);

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




  function emptyRender(instance, td, row, col, prop, value, cellProperties, coords) {
    textRenderer.apply(this, arguments);
    // if row contains negative number
    if (!value) {
      const vId = instance.getDataAtCell(row, "logId");
      const actionValue = instance.getDataAtCell(row, "action");
      const status = instance.getDataAtCell(row, "status");

      let encrptyValue = btoa(vId);

      let urlDirect = PROJECT_URL + '/gst-returns/gstr3b/gstr3bfiled?' + encrptyValue;

      if (actionValue?.toLowerCase() == 'generate gstr3b summary') {
        td.innerHTML = `<a href=${urlDirect} target='_BLANK'  >View</a>`;
        td.className = "text-center";
      }
      else if (actionValue?.toLowerCase() !== 'generate gstr3b summary' && status?.toLowerCase() !== 'success') {
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
  }

  const logDetails = (logid) => {
    gstr3bDownloadService.gstr3bGovtReturnErrorLogStatus(logid)
      .then((res) => {
        console.log("res", res.data.data);
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

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors },
    clearErrors,
    setValue,
    reset,
  } = useForm({ defaultValues });

  const { userIds, clientIds, GSTIN, wizardIndex ,isGSTR3BFiledStatus} = props;


  // ** Hook
  const [fromDate, setFromDate] = useState([]);
  const [block, setBlock] = useState(false);
  const [finFromYear, setFinFormYear] = useState(null);
  const [modal, setModal] = useState(false);
  const [show, setShow] = useState(false);
  const [btnDisable, setBtnDisable] = useState(false);
  const [open, setOpen] = useState("1");

  const pageCount = Math.ceil(data?.length && data?.length / pageSize);
  const para1 = pages * pageSize;
  const para2 = pages * pageSize + pageSize;
  let dataShow = data && data?.slice(para1, para2);


  const handlePageClick = (event) => {
    setPages(event);
  };


  useEffect(() => {
    return () => setBlock(false);
  }, []);

  // ** gstr1 Save Govt
  // const gstr1SaveGovtOnClick = () => {

  //   const payLoad = {
  //     userClientId: clientIds,
  //     userId: userIds,
  //     returnPeriod: returnDate,
  //     loggedGSTIN: GSTIN,
  //   };

  //   setBlock(true);
  //   GSTR3BDownloadService.gstr3bSaveGovt(payLoad)
  //     .then((res) => {

  //       if (res.data.status === errorCodeConfig.APIDefaultCode.GovtOTPExpire) {

  //         setMsgDisplay(res?.data?.errorMessage)
  //         setBlock(false);
  //         setComposeOpen(true)

  //       } else {
  //         if (
  //           res.status === 200 &&
  //           res.data.status === errorCodeConfig.APIDefaultCode.Success
  //         ) {
  //           setBlock(false);
  //           toast.success(res?.data?.successMessage, {
  //             position: "top-right",
  //           });
  //           govtErrorLog(0);
  //           stepper.to(2)

  //         } else {
  //           setBlock(false);
  //           Swal.fire({
  //             icon: "warning",
  //             title: "",
  //             text: res?.data?.errorMessage,
  //             customClass: {
  //               confirmButton: "btn btn-danger",
  //             },
  //             buttonsStyling: false,
  //           });
  //           stepper.to(1)
  //         }
  //       }
  //     })
  //     .catch((error) => {
  //       setBlock(false);
  //       Swal.fire({
  //         icon: "error",
  //         title: "",
  //         text: error?.message,
  //         customClass: {
  //           confirmButton: "btn btn-danger",
  //         },
  //         buttonsStyling: false,
  //       });
  //       stepper.to(1)
  //     });
  // };
  const gstr1SaveGovtOnClick = (withOtp) => {

    const payLoad = {
      userClientId: clientIds,
      userId: userIds,
      returnPeriod: returnDate,
      loggedGSTIN: GSTIN,
    };

    setBlock(true);

    const gstr3bSaveGovtService = withOtp ?  GSTR3BDownloadService.gstr3bSaveGovt :  GSTR3BDownloadService.gstr3bSaveGovtWithoutOtp

    gstr3bSaveGovtService(payLoad)
      .then((res) => {

        if (res.data.status === errorCodeConfig.APIDefaultCode.GovtOTPExpire) {

          setMsgDisplay(res?.data?.errorMessage)
          setBlock(false);
         withOtp ?  setComposeOpen(true) : setopenWithoutOtpFailed(true)

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
            stepper.to(2);
            if (!withOtp) {
              setBtnDisable(undefined);
              sessionStorage.setItem("btnDisable", undefined);
            }

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
            stepper.to(1)
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
        stepper.to(1)
      });
  };


  // ** Generate Summary
  const generateSummaryOnClick = (isOpenUrl) => {
    const payLoad = {
      userClientId: clientIds,
      userId: userIds,
      returnPeriod: returnDate,
      loggedGSTIN: GSTIN,
    };

    setBlock(true);
    GSTR3BDownloadService.getGstr3bSummaryGovt(payLoad)
      .then((res) => {
        if (res.data.status === errorCodeConfig.APIDefaultCode.GovtOTPExpire) {
          setMsgDisplay(res?.data?.errorMessage)
          setBlock(false);
          setComposeOpen(true)
          stepper.to(2)
        } else {
          if (
            res.status === 200 &&
            res.data.status === errorCodeConfig.APIDefaultCode.Success
          ) {
            govtErrorLog(0, true, "isOpenUrl");

            toast.success(res?.data?.successMessage, {
              position: "top-right",
            })
            stepper.to(3)
          } else {
            setBlock(false);
            govtErrorLog(0, true);
            Swal.fire({
              icon: "warning",
              title: "",
              text: res?.data?.errorMessage,
              customClass: {
                confirmButton: "btn btn-danger",
              },
              buttonsStyling: false,
            });
            stepper.to(2)
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
        stepper.to(3)

      });
  };

  

  useEffect(() => {
    if (wizardIndex == 4 && stepper != null) {
      returnFileStatus();
    }
  }, [wizardIndex, stepper]);



  useEffect(() => {
    if (wizardIndex == 1) {
      govtErrorLog(0);
      if(isGSTR3BFiledStatus){
        sessionStorage.setItem("btnDisable3b", '5');
      }
      // returnFileStatus()
    }
  }, [wizardIndex]);


 // ** Govt Error Log

 //Don't remove this commented code
  // const govtErrorLog = (pageNo, IsNextStep , isOpenUrl) => {

  //   const payLoad = {
  //     userClientId: clientIds,
  //     userId: userIds,
  //     loggedGSTIN: GSTIN,
  //     pageStart: pages + 1,
  //     pageSize: pageSize,
  //     returnPeriod:returnDate
  //   };

  //   setBlock(true);
  //   GSTR3BDownloadService.gstr3bGovtReturnLogStatus(payLoad)
  //     .then((res) => {
  //       if (
  //         res.status === 200 &&
  //         res.data.status === errorCodeConfig.APIDefaultCode.Success
  //       ) {
  //         setBlock(false);
  //         setData(res?.data?.data?.data);
  //         setBtnDisable(res?.data?.data?.lastStatus);
  //         sessionStorage.setItem("btnDisable3b", res?.data?.data?.lastStatus);

  //         if (isOpenUrl == "isOpenUrl") {
  //           if (res?.data?.data?.data?.length > 0) {
  //             let redirectFirstRow = res?.data?.data?.data[0];
  //             const vId = redirectFirstRow?.logId;
  //             const actionValue = redirectFirstRow?.action;
  //             const status = redirectFirstRow?.status;

  //             let encrptyValue = btoa(vId);
  //             let urlDirect =
  //               PROJECT_URL + "/gst-returns/gstr3b/gstr3bfiled?" + encrptyValue;

  //             if (actionValue?.toLowerCase() == "generate gstr1 summary") {
  //               window.open(urlDirect.toString(), "_blank");
  //             } else if (
  //               actionValue?.toLowerCase() !== "generate gstr1 summary" &&
  //               status?.toLowerCase() !== "success"
  //             ) {
  //               window.open(urlDirect.toString(), "_blank");
  //             }
  //           }
  //         }

  //         if (IsNextStep) {
  //           setBlock(false);
  //           stepper.next();
  //         }
  //       } else {

  //         setBtnDisable(5);
  //         setBlock(false);
  //         Swal.fire({
  //           icon: "warning",
  //           title: "",
  //           text: res?.data?.errorMessage,
  //           customClass: {
  //             confirmButton: "btn btn-danger",
  //           },
  //           buttonsStyling: false,
  //         });
  //       }
  //     })
  //     .catch((error) => {
  //       setBlock(false);
  //       Swal.fire({
  //         icon: "error",
  //         title: "",
  //         text: error?.message,
  //         customClass: {
  //           confirmButton: "btn btn-danger",
  //         },
  //         buttonsStyling: false,
  //       });
  //     });
  // };

  const govtErrorLog = (pageNo, IsNextStep, isOpenUrl) => {
    const payLoad = {
      userClientId: clientIds,
      userId: userIds,
      loggedGSTIN: GSTIN,
      pageStart: pages + 1,
      pageSize: pageSize,
      returnPeriod: returnDate
    };
  
    console.log('Payload:', payLoad);
  
    setBlock(true);
    GSTR3BDownloadService.gstr3bGovtReturnLogStatus(payLoad)
      .then((res) => {
        console.log('Response:', res);
  
        if (
          res.status === 200 &&
          res.data.status === errorCodeConfig.APIDefaultCode.Success
        ) {
          setBlock(false);
          setData(res?.data?.data?.data);
          setBtnDisable(res?.data?.data?.lastStatus);
          sessionStorage.setItem("btnDisable3b", res?.data?.data?.lastStatus);
  
          if (isOpenUrl === "isOpenUrl") {
            console.log('isOpenUrl condition met');
  
            if (res?.data?.data?.data?.length > 0) {
              let redirectFirstRow = res?.data?.data?.data[0];
              const vId = redirectFirstRow?.logId;
              const actionValue = redirectFirstRow?.action;
              const status = redirectFirstRow?.status;
              let encrptyValue = btoa(vId);
              let urlDirect =
                PROJECT_URL + "/gst-returns/gstr3b/gstr3bfiled?" + encrptyValue;

  
              console.log('URL to open:', urlDirect);
              if (
                actionValue?.toLowerCase() === "generate gstr1 summary" 
            ) {
              console.log('Opening URL in the same tab:', urlDirect);
              window.location.href = urlDirect;
            }else if(
              actionValue?.toLowerCase() !== "generate gstr1 summary" && status?.toLowerCase() !== "success"
            ){
              console.log('Opening URL in the same tab:', urlDirect);
              window.location.href = urlDirect;
            }{
                console.log('Opening new tab with URL:', urlDirect);
                window.open(urlDirect, "_blank");
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
        console.log('Error:', error);
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
  
 
  
  const toggle = (id) => {
    open === id ? setOpen() : setOpen(id);
  };
  const theader = (col, TH) => {
    if (col == 1 ||
      col == 2 ||
      col == 3 ||
      col == 4) {
      TH.className = 'htLeft'
    }
  }

  const gstR3AckNumber =
  sessionStorage.getItem("gstR3AckNumber") !== null &&
  sessionStorage.getItem("gstR3AckNumber") !== "" &&
  sessionStorage.getItem("gstR3AckNumber") !== undefined
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
                      onClick={()=>setIsShowModel(true)}
                      disabled={ gstR3AckNumber || btnDisable == 5 ? true : false}
                    >
                      <Upload size={25} />
                      <span className="align-middle  gstr1FilingButton">
                        {" "}
                        Upload Data To Government
                      </span>
                    </Button>
                  </div>
                </AccordionBody>
              </AccordionItem>

              <AccordionItem>
                <AccordionHeader targetId="2">
                  {" "}
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
                      disabled={ gstR3AckNumber || btnDisable == 5 ? true : btnDisable >= 2 ? false : true}
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

      <div className="d-flex justify-content-between">
        <Button
          color="danger"
          className="btn-prev"
          onClick={() => stepper.previous()}
        >
          <ArrowLeft
            size={18}
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
      <VerificationModal composeOpen={composeOpen} toggleCompose={toggleCompose1} userClientIds={clientIds}
        messageDisplay={msgDisplay}  otpGSTIN={GSTIN}
      ></VerificationModal>
       {isShowModel == true && (
      <Modal backdrop="static" isOpen={isShowModel} className="modal-dialog-centered modal-sm">
      <div className="modal-header">
        <h2 className="modal-title w-100 text-center">Upload Data</h2>
        <div className="modal-actions">
          <a onClick={() => setIsShowModel(!isShowModel)} className="text-body">
            <X size={14} />
          </a>
        </div>
      </div>
      <hr />
      <ModalBody className="px-sm-2 mx-30 pb-2">
        <h2 className="text-center"><b>How you want to Upload Data?</b></h2>
        <Row tag="form" className="gy-1 pt-75">
          <Col xs={12} className="text-center pt-50">
            <Button type="submit" className="me-1" color="danger" onClick={() => gstr1SaveGovtOnClick(true)} outline>
              With OTP
            </Button>
            <Button type="reset" color="secondary" outline onClick={() => gstr1SaveGovtOnClick(false)}>
              Without OTP
            </Button>
          </Col>
        </Row>
      </ModalBody>
    </Modal>
      )}
       {openWithoutOtpFailed == true && (
      <WithoutOtpModel
       openWithoutOtpFailed={openWithoutOtpFailed}
       setopenWithoutOtpFailed={setopenWithoutOtpFailed}
       G_UCParId={clientIds}>
      </WithoutOtpModel>) }
    </Fragment>
  );
};

export default Gstr3Download;
