import { Fragment, useState, useEffect, useRef } from "react";
import {
  Button,
  Col,
  Row,
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
} from "reactstrap";
import { Download, Upload, ArrowLeft, ArrowRight } from "react-feather";
import itc04DownloadService from "../../../services/itc04Services/itc04DownloadService";
import { PROJECT_URL } from "../../../configs/config";
import { globleVariable } from "../../../configs/globalVariable";
import Swal from "sweetalert2";
import errorCodeConfig from "../../../configs/apiErrorCodeConfig";
import toast from "react-hot-toast";
import { HotTable } from "@handsontable/react";
import { registerRenderer, textRenderer } from "handsontable/renderers";
import { registerAllModules } from "handsontable/registry";
import ReactPaginate from "react-paginate";
import  VerificationModal  from '../../../views/pages/verification-otp/index'
import GSTR1DownloadService from "../../../services/gstr1/gstr1Services/gstr1DownloadService";
import SessionFunction from "../../../configs/getSessionFunction";


registerAllModules();


const itcDownload = (props) => {

  const { userIds, clientIds, GSTIN, wizardIndex, stepper } = props;

  let hotRef = useRef(null);
  //const { stepper } = props;

  const [pageSize, setPageSize] = useState(8);
  const [pages, setPages] = useState(0);
  const [activeClassName, setActiveClassName] = useState("active");

  const returnDate = sessionStorage.getItem(
    globleVariable.itc04DownloadFromDt
  );
  const [msgDisplay, setMsgDisplay] = useState(null);
  const [composeOpen, setComposeOpen] = useState(false)
  const toggleCompose1 = () => setComposeOpen(!composeOpen)

  const [data, setData] = useState([]);

  let GFY =
    sessionStorage.getItem(globleVariable.G_FY) &&
    SessionFunction.getSessionValue(globleVariable.G_FY, true);
     let GFM =
    sessionStorage.getItem(globleVariable.G_FM) &&
    SessionFunction.getSessionValue(globleVariable.G_FM, true);

  // ** Column
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

  function emptyRender(
    instance,
    td,
    row,
    value
  ) {
    textRenderer.apply(this, arguments);
    // if row contains negative number
    if (!value) {
      const vId = instance.getDataAtCell(row, "logId");
      const actionValue = instance.getDataAtCell(row, "action");
      const status = instance.getDataAtCell(row, "status");

      let encrptyValue = btoa(vId);
      let urlDirect = PROJECT_URL + "/gstr3/gstr3filed?" + encrptyValue;

      if (actionValue?.toLowerCase() == "generate gstr1 summary") {
        td.innerHTML = `<a href=${urlDirect}   target='_BLANK' >View</a>`;
        td.className = "text-center";
      } else if (
        actionValue?.toLowerCase() !== "generate gstr1 summary" &&
        status?.toLowerCase() !== "success"
      ) {
        td.innerHTML = `<a href=${urlDirect}   target='_BLANK' >View</a>`;
        td.className = "text-center";
      } else {
        td.innerHTML = `<a>-</a>`;
        td.className = "text-secondary text-center";
      }
      td.style.cursor = "pointer";
    }
  }


  // ** Hook
  const [block, setBlock] = useState(false);
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

  // ** itc04 Save Govt
  const itc04SaveGovtOnClick = () => {
    const payLoad = {
      userClientId: clientIds,
      userId: userIds,
      returnPeriod: returnDate,
      loggedGSTIN: GSTIN,
    };

    setBlock(true);
    itc04DownloadService.itc04SaveGovt(payLoad)
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

  // ** Generate Summary
  const generateSummaryOnClick = () => {
    const payLoad = {
      userClientId: clientIds,
      userId: userIds,
      returnPeriod: returnDate,
      loggedGSTIN: GSTIN,
    };

    setBlock(true);
    itc04DownloadService.getitc04SummaryGovt(payLoad)
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
            govtErrorLog(0, true);

            toast.success(res?.data?.successMessage, {
              position: "top-right",
            });
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

  useEffect(() => {
    return () => setBlock(false);
  }, []);
  // **  check user returnFileStatus
  const returnFileStatus=()=>{

    sessionStorage.removeItem("gstR4AckNumber")
    sessionStorage.removeItem("gstR4AckNumberDate")

    const payLoad = {
      clientId: clientIds,
      gstinNumber: GSTIN,
      financialYearIdID:parseInt(GFY),
      month:parseInt(GFM) ,
    };
          setBlock(true);
    GSTR1DownloadService.checkFiledUserStatus(payLoad).then((res)=>{

      if (
        res.status === 200 &&
        res.data.status === errorCodeConfig.APIDefaultCode.Success
      ){
        setBlock(false);
                if(res?.data?.data?.isITC04FiledFiled){

                  if(res?.data?.data?.itC04AcknowledgementNumber){

                    sessionStorage.setItem("gstR4AckNumber", res?.data?.data?.itC04AcknowledgementNumber);
                    sessionStorage.setItem("gstR4AckNumberDate", res?.data?.data?.itC04AcknowledgementDate);
                  } else {
                    sessionStorage.removeItem("gstR4AckNumber")
                    sessionStorage.removeItem("gstR4AckNumberDate")
                  }

                stepper.next();
                sessionStorage.setItem("btnDisable4", '5');
                }
      }
     } ).catch((error) => {
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

  useEffect(() => {
    if (wizardIndex == 1) {
      govtErrorLog(0);
      returnFileStatus()
    }
  }, [wizardIndex]);

  const govtErrorLog = (pageNo, IsNextStep) => {
    const payLoad = {
      userClientId: clientIds,
      userId: userIds,
      loggedGSTIN: GSTIN,
      pageStart: pages + 1,
      pageSize: pageSize,
      returnPeriod :returnDate
    };
    setBlock(true);
    itc04DownloadService.itc04GovtReturnLogStatus(payLoad)
      .then((res) => {

        if (
          res.status === 200 &&
          res.data.status === errorCodeConfig.APIDefaultCode.Success
        ) {
          setBlock(false);
          console.log("gstr1GovtReturnLogStatus---", res.data);
          setData(res?.data?.data?.data);
          setBtnDisable(res?.data?.data?.lastStatus);

          sessionStorage.setItem("btnDisable4", res?.data?.data?.lastStatus);

          if (IsNextStep) {
            setBlock(false);
            stepper.next();
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

  const toggle = (id) => {
    open === id ? setOpen() : setOpen(id);
  };

  const theader = (col, TH) => {
    if (col == 1 ||
      col == 2 ||
      col == 3) {
      TH.className = 'htLeft'
    }
  }

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
                      onClick={itc04SaveGovtOnClick}
                      disabled={btnDisable == 5 ? true : false}
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
                      disabled={btnDisable == 5 ? true : btnDisable >= 2 ? false : true}
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
                  data={dataShow?.length ? dataShow : [{ logId: "No Data Found!" }]}
                  ref={hotRef}
                  stretchH="all"
                  preventOverflow="horizontal"
                  afterGetColHeader={theader}
                  columns={Columns}
                  contextMenu={false}
                  bindRowsWithHeaders={true}
                  licenseKey="non-commercial-and-evaluation"
                  height="auto"
                  autoWrapRow={true}
                  hiddenColumns={{
                    columns: [0, 4],
                  }}
                  style={!dataShow?.length ? { textAlign: "center" } : ''}
                  mergeCells={dataShow?.length ? false : [{ row: 0, col: 0, rowspan: 1, colspan: 4 }]}
                  cells={function (row, col) {
                    const cellProperties = {};
                    if (row != -1 && col == 4) {
                      cellProperties.renderer = emptyRender;
                      cellProperties.className = "text-center";
                    }
                    return cellProperties;
                  }}
                />{dataShow?.length ?
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
                  /> : ' '}
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
        messageDisplay={msgDisplay} otpGSTIN={GSTIN}
      ></VerificationModal>
    </Fragment>
  );
};

export default itcDownload;
