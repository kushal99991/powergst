import { Fragment, useState, useEffect, useRef } from "react";
import {
  Button,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  Col,
  Row,
  Input,
  Form,
  FormFeedback,
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
} from "reactstrap";
import {
  FilePlus,
  FileText,
  Save,
  RefreshCw,
  Send,
  Download,
  DownloadCloud,
  CheckCircle,
  Upload,
  ArrowLeft,
  ArrowRight,X
} from "react-feather";
import Select from "react-select";
import GSTR6DownloadService from "../../../services/gstr6/gstr6DownloadService";
import { selectThemeColors } from "@utils";
import GSTR1DownloadService from "../../../services/gstr1/gstr1Services/gstr1DownloadService";
import { SELECT_MAXSIZE , PROJECT_URL, PageSize,RowSize, columnHeaderSize } from "../../../configs/config";
import makeAnimated from "react-select/animated";
const animatedComponents = makeAnimated();
import { globleVariable } from "../../../configs/globalVariable";
import LocalFunction from "../../../configs/getLocalFunction";
import SessionFunction from "../../../configs/getSessionFunction";
import Swal from "sweetalert2";
import errorCodeConfig from "../../../configs/apiErrorCodeConfig";
import toast from "react-hot-toast";
import { useForm, Controller, set } from "react-hook-form";
// import Gstr1DownloadForm from "../gstr1/gstr1-download-wizard/index";
import $ from 'jquery'
import { HotTable } from "@handsontable/react";
import { registerRenderer, textRenderer } from "handsontable/renderers";
import { registerAllModules } from "handsontable/registry";
import ReactPaginate from "react-paginate";
import  VerificationModal  from '../../../views/pages/verification-otp/index'


const defaultValues = {
  otp: "",
};

const Gstr1Download = (props) => {
  let hotRef = useRef(null);
  const { stepper   } = props;

  const [pageSize, setPageSize] = useState(PageSize);
  const [pages, setPages] = useState(0);
  const [activeClassName, setActiveClassName] = useState("active");
  const [modalShow, setModalShow] = useState(false);
  const [searchApi , setSearchApi] = useState(false);
  const [logData, setLogData] = useState([])

  const returnDate = sessionStorage.getItem("gstr6DownloadFromDt");
  const [searchVal1, setSearchVal1] = useState([]);
  const [currentCol, setCurrentCol] = useState([]);
  const [currentCol1, setCurrentCol1] = useState();
  const [getcolumn, setGetColumn] = useState();

  const [msgDisplay, setMsgDisplay] = useState(null);
  const [composeOpen, setComposeOpen] = useState(false)
  const toggleCompose1 = () => setComposeOpen(!composeOpen)

  let GFY =
    sessionStorage.getItem(globleVariable.G_FY) &&
    SessionFunction.getSessionValue(globleVariable.G_FY, true);
     let GFM =
    sessionStorage.getItem(globleVariable.G_FM) &&
    SessionFunction.getSessionValue(globleVariable.G_FM, true);

  const hotRefReport2 = useRef(null);
  let arr = []

  const [data, setData] = useState([
  ]);

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

  const logColumns = [
    {
      data: "sectionName",
      title: "Section Name",
    },
    {
      data: "errorMessage",
      title: "Error Message",
    },
    {
      data: "errorCd",
      title: "ErrorCd",
    },
    {
      data: "gstin",
      title: "Gstin",
    },
    {
      data: "invoiceNumber",
      title: "Invoice Number",
    },
    {
      data: "invoiceDate",
      title: "Invoice Date",
    },
    {
      data: "noteNumber",
      title: "Note Number",
    },
    {
      data: "noteDate",
      title: "Note Date",
    },
    {
      data: "invoiceType",
      title: "Invoice Type",
    },
    {
      data:'noteType',
      title:'Note Type'
    },
    {
      data: "invoiceValue",
      title: "Invoice Value",
    },
    {
      data: "placeOfSupply",
      title: "Place Of Supply",
    },
    {
      data: "originalInvoiceNumber",
      title: "Original Invoice Number",
    },
    {
      data: "originalInvoiceDate",
      title: "Original Invoice Date",
    },
    {
      data: "originalNoteNumber",
      title: "Original Note Number",
    },
    {
      data: "originalNoteDate",
      title: "Original Note Date",
    },
    {
      data: "reverseCharge",
      title: "Reverse Charge",
    },
    {
      data: "supplyType",
      title: "Supply Type",
    },
    {
      data: "taxableValue",
      title: "Taxable Value",
    },
    {
      data: "rate",
      title: "Rate",
    },
    {
      data: "igst",
      title: "Igst",
    },
    {
      data: "cgst",
      title: "Cgst",
    },
    {
      data: "sgst",
      title: "Sgst",
    },
    {
      data: "cess",
      title: "Cess",
    },
    {
      data: "billOfEntryNumber",
      title: "Bill Of EntryNumber",
    },
    {
      data: "billOfEntryDate",
      title: "Bill Of EntryDate",
    },
    {
      data: "grossAdvanceReceived",
      title: "Gross Advance Received",
    },
    {
      data:'portCode',
      title:'Port Code'
    },
    {
      data: "hsn",
      title: "Hsn",
    },
    {
      data: "description",
      title: "Description",
    },
    {
      data: "uqc",
      title: "Uqc",
    },
    {
      data: "quantity",
      title: "Quantity",
    },
    {
      data: "exportType",
      title: "Export Type",
    },
    {
      data: "exempted",
      title: "Exempted",
    },
    {
      data: "nilRatedSupplies",
      title: "Nil Rated Supplies",
    },
    {
      data: "nonGSTSupplies",
      title: "Non GST Supplies",
    },
    {
      data: "natureOfDocument",
      title: "Nature Of Document",
    },
    {
      data: "from",
      title: "From",
    },
    {
      data:'to',
      title:'To'
    },
    {
      data: "totalNumber",
      title: "Total Number",
    },
    {
      data: "cancel",
      title: "Cancel",
    },

    {
      data: "netIssued",
      title: "Net Issued",
    },
    {
      data: "type",
      title: "Type",
    },
    {
      data: "originalMonth",
      title: "Original Month",
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
      let urlDirect = PROJECT_URL + '/gst-returns/gstr1/gstr1filed?'+ encrptyValue;

      if (actionValue?.toLowerCase()  == 'generate gstr1 summary') {

        td.innerHTML = `<a href=${urlDirect}   target='_BLANK' >View</a>`;
        td.className = "text-center";
      } else if (actionValue?.toLowerCase()  !== 'generate gstr1 summary' &&  status?.toLowerCase() !== 'success')  {



        td.innerHTML = `<a  class="btn_click" target='_BLANK' >View</a>`;
        td.className = "text-center";
      }  else {
        td.innerHTML = `<a>-</a>`;
        td.className = "text-secondary text-center";
      }

      $(td).find('.btn_click').on('click', event => {
        console.log('delete')
        //  console.log(instance.col)
        setModalShow(!modalShow)
        logDetails(vId)

      });


      td.style.cursor = "pointer";
    }
  }


    const logDetails = (logid) => {
      GSTR6DownloadService.gstr6GovtReturnErrorLogStatus(logid)
      .then((res) => {
        console.log("res", res.data.data);
        if (
          res.status === 200 &&
          res.data.status === errorCodeConfig.APIDefaultCode.Success
        ) {
          setLogData(res.data.data)
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

  const { userIds, clientIds, GSTIN , wizardIndex } = props;

  const finYearOption = LocalFunction.getLocalValue(
    globleVariable.rangeFilters,
    true
  );

  const YearList =
    finYearOption !== undefined &&
    finYearOption !== null &&
    finYearOption !== "" &&
    finYearOption !== "undefined"
      ? JSON.parse(finYearOption)
      : [];

  // ** Hook
  const [fromDate, setFromDate] = useState([]);
  const [block, setBlock] = useState(false);
  const [finFromYear, setFinFormYear] = useState(null);
  const [modal, setModal] = useState(false);
  const [show, setShow] = useState(false);
  const [btnDisable, setBtnDisable] = useState(false);
  // const [stepper, setStepper] = useState(null);
  // const [wizardBtn, setWizardBtn] = useState(0);
  // const wizardRefDownlaod = useRef(null);
  const [open, setOpen] = useState("1");



  const pageCount = Math.ceil(data?.length && data?.length / pageSize);
  const para1 = pages * pageSize;
  const para2 = pages * pageSize + pageSize;
  let dataShow = data && data?.slice(para1, para2);

  //**Error Log Data Pagination */
  const pageCount1 = Math.ceil(logData?.length && logData?.length / pageSize);
  const logpara1 = pages * pageSize;
  const logpara2 = pages * pageSize + pageSize;
  let logdataShow = logData && logData?.slice(logpara1, logpara2);

  console.log("pages count -", pageCount);

  const handlePageClick = (event) => {
    setPages(event);
  };


    useEffect(() => {
    return () => setBlock(false);
  }, []);

  // ** gstr1 Save Govt
  const gstr1SaveGovtOnClick = () => {
    const payLoad = {
      userClientId: clientIds,
      userId: userIds,
      returnPeriod: returnDate,
      loggedGSTIN: GSTIN,
    };

    setBlock(true);
    GSTR6DownloadService.gstr6SaveGovt(payLoad)
      .then((res) => {
        if (res.data.status === errorCodeConfig.APIDefaultCode.GovtOTPExpire) {
          // closeModal();
          setMsgDisplay(res?.data?.errorMessage)
          setBlock(false);
          // loadFunction(false);
          setComposeOpen(true)
          // toast.dismiss();
         // dispatch(handleModelOTP(!store.layout.modelVerifyOTP));
        }else {
        if (
          res.status === 200 &&
          res.data.status === errorCodeConfig.APIDefaultCode.Success
        ) {
          setBlock(false);
          toast.success(res?.data?.successMessage, {
            position: "top-right",
          });
          govtErrorLog(0);
          // setOpen(2)
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

  // ** Process to file
  const processToFileOnClick = () => {
    const payLoad = {
      userClientId: clientIds,
      userId: userIds,
      returnPeriod: returnDate,
      loggedGSTIN: GSTIN,
    };

    setBlock(true);
    GSTR6DownloadService.proceedFileGstr6Govt(payLoad)
      .then((res) => {
        if (res.data.status === errorCodeConfig.APIDefaultCode.GovtOTPExpire) {
          // closeModal();
          setMsgDisplay(res?.data?.errorMessage)
          setBlock(false);
          // loadFunction(false);
          setComposeOpen(true)
          // toast.dismiss();
         // dispatch(handleModelOTP(!store.layout.modelVerifyOTP));
        }else {
        if (
          res.status === 200 &&
          res.data.status === errorCodeConfig.APIDefaultCode.Success
        ) {
          setBlock(false);

          toast.success(res?.data?.successMessage, {
            position: "top-right",
          });

          govtErrorLog(0);
          toggle("3");
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
    GSTR6DownloadService.getGstr6SummaryGovt(payLoad)
      .then((res) => {
        if (res.data.status === errorCodeConfig.APIDefaultCode.GovtOTPExpire) {
          // closeModal();
          setMsgDisplay(res?.data?.errorMessage)
          setBlock(false);
          // loadFunction(false);
          setComposeOpen(true)
          // toast.dismiss();
         // dispatch(handleModelOTP(!store.layout.modelVerifyOTP));
        }else {
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


  // ** File GSTR1
  const FileGSTR1OnClick = (data) => {
    const payLoad = {
      userClientId: clientIds,
      userId: userIds,
      returnPeriod: finFromYear?.value,
      loggedGSTIN: GSTIN,
      otp: data.otp,
    };

    setBlock(true);
    GSTR6DownloadService.fileGstr6Govt(payLoad)
      .then((res) => {
        if (
          res.status === 200 &&
          res.data.status === errorCodeConfig.APIDefaultCode.Success
        ) {
          setShow(false);
          setBlock(false);
          toast.success(res?.data?.successMessage, {
            position: "top-right",
          });

        } else {
          setShow(false);
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


  useEffect(() => {
    return () => setBlock(false);
  }, []);

  // **  check user returnFileStatus
  const returnFileStatus=()=>{

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
                if(res?.data?.data?.isGSTR6Filed){

                  if(res?.data?.data?.gstR6AcknowledgementNumber) {
                    sessionStorage.setItem("gstR6AckNumber", res?.data?.data?.gstR6AcknowledgementNumber);
                    sessionStorage.setItem("gstR6AckNumberDate", res?.data?.data?.gstR6AcknowledgementDate);
                  } else {
                    sessionStorage.removeItem("gstR6AckNumber");
                    sessionStorage.removeItem("gstR6AckNumberDate");
                  }


                stepper.next();
                sessionStorage.setItem("btnDisable6", '5');

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


  // ** Govt Error Log
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
    GSTR6DownloadService.gstr6GovtReturnLogStatus(payLoad)
      .then((res) => {
        if (
          res.status === 200 &&
          res.data.status === errorCodeConfig.APIDefaultCode.Success
        ) {
          setBlock(false);
          console.log("gstr1GovtReturnLogStatus---", res.data.data);
          setData(res?.data?.data?.data);
          setBtnDisable(res?.data?.data?.lastStatus);

          sessionStorage.setItem("btnDisable6", res?.data?.data?.lastStatus);

          if (IsNextStep) {
            setBlock(false);
            stepper.next();
          }
        } else {
          setBtnDisable(5)
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



   // **  For  filter
   function localAfterOnCellMouseDown(event, coords, td) {
    // debugger
    const hot = hotRef?.current?.hotInstance;
    setCurrentCol1(coords?.col);
    // const totalRows = hot?.countRows();
    //setGetColumn(logColumns[coords.col].data)
   // console.log('col',getcolumn)
    if (coords.row !== -1 && coords.col == 0) {
        console.log('click cell', coords.row)
        let checkValue = hot.getDataAtRowProp(coords.row, "isActive");
        console.log(checkValue)
        hot.setDataAtCell(coords.row, 0, !checkValue);
    }

    if (coords.row !== -1) {
        if (coords.col == 1) {
         //   setCurrentCol([logColumns[0]?.data]);
          //  const { getcolumn } = hot.getSourceDataAtRow(coords.row)

        //    setSearchVal1([getcolumn])
            // setActiveTab('2')
            // setSearchApi(true)
        }
    }
}

// ** Theder remove filter
const theader = (col, TH) => {
  if (col > 32  ) {
      const button = TH.children[0].children[0];
   button?.parentNode?.removeChild(button);

  }
    if (col == 1 ||
      col == 2 ||
      col == 3 ) {
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
                      onClick={gstr1SaveGovtOnClick}
                      disabled={ btnDisable == 5 ? true : false }
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
                  <p className="gstr1Filing"> 2. Proceed To File </p>
                </AccordionHeader>
                <AccordionBody accordionId="2">
                  <div className="d-grid mb-1 mb-lg-0">
                    <Button
                      className="btn-icon me-1"
                      outline
                      color="danger"
                      size="lg"
                      onClick={processToFileOnClick}
                      disabled={  btnDisable == 5 ? true : btnDisable >= 2 ? false : true}
                    >
                      <CheckCircle size={25} />
                      <span className="align-middle ms-50 gstr1FilingButton">
                        Proceed To File
                      </span>
                    </Button>
                  </div>
                </AccordionBody>
              </AccordionItem>
              <AccordionItem>
                <AccordionHeader targetId="3">
                  {" "}
                  <p className="gstr1Filing">3. Generate Summary </p>
                </AccordionHeader>
                <AccordionBody accordionId="3">
                  <div className="d-grid mb-1 mb-lg-0">
                    <Button
                      className="btn-icon me-1"
                      outline
                      color="danger"
                      size="lg"
                      onClick={generateSummaryOnClick}
                      disabled={ btnDisable == 5 ? true : btnDisable >= 3 ? false : true}
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
                  // data={dataShow ? dataShow : []}
                  style={!dataShow ? { overflowX: "hidden", textAlign: "center" } : "" }
                  afterGetColHeader={theader}
                  mergeCells={ !dataShow ?  [{ row: 0, col: 0, rowspan: 1, colspan: 5 }] : false }
                  data={ !dataShow ?  [{logId : "No data found" }] : dataShow }
                  rowHeights={RowSize}
                  columnHeaderHeight={columnHeaderSize}
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
                    columns: [0,4],
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
      <Modal
                backdrop="static"
                isOpen={modalShow}
                toggle={() => setModalShow(!modalShow)}
                className={"modal-dialog-centered modal-xl"}
            >
                <div className="modal-header">
                    <h2 className="modal-title w-100 text-center">
                        {/* Add Pop */}
                    </h2>
                    <div className="modal-actions">
                        <a
                            className="text-body"
                            onClick={() => setModalShow(!modalShow)}
                        >
                             <X size={16} />
                        </a>
                    </div>
                </div>

                <ModalBody>
                  <div>
                    {logData?.length>0? <HotTable
                  className="myRow"
                  data={logdataShow ? logdataShow : []}
                  rowHeights={RowSize}
                  columnHeaderHeight={columnHeaderSize}
                  ref={hotRef}
                  afterOnCellMouseDown={localAfterOnCellMouseDown}
                  stretchH="all"
                  preventOverflow="horizontal"
                  columns={logColumns}
                  contextMenu={false}
                  bindRowsWithHeaders={true}
                  licenseKey="non-commercial-and-evaluation"
                  height="auto"
                  readOnly={true}
                  autoWrapRow={true}
                  filters={true}
                  cells={function (row, col) {
                    const hot = hotRef?.current?.hotInstance;
                    const cellProperties = {};
                    if (row != -1 && col == 4) {
                      cellProperties.renderer = emptyRender;
                      cellProperties.className = "text-center";
                    }
                    return cellProperties;
                  }}

                  dropdownMenu={{
                    items: {

                        filter_by_value: {
                            name: "Search Value",
                        },

                        filter_action_bar: {

                        },
                    }
                }}

                afterFilter={
                  function (data) {
                      var searchInput = document.querySelector('.htUIMultipleSelectSearch.htUIInput');
                      var value = searchInput?.children[0].value;
                      const x = searchVal1;
                      let y = currentCol;
                      if (!searchVal1?.length) {
                        x.push(value);
                        y.push(logColumns[currentCol1]?.data);
                        setSearchVal1(x);
                        setCurrentCol(y);

                      } else {
                        currentCol.map((item, index) => {
                          if (item == logColumns[currentCol1]?.data) {
                            const xyz = searchVal1
                            xyz[index] = value
                            setSearchVal1(xyz)
                          } else {
                            x.push(value);
                            let y = currentCol;
                            y.push(logColumns[currentCol1]?.data);
                            setSearchVal1(x);
                            setCurrentCol(y);
                          }
                        })
                      }
                      console.log(getcolumn , searchVal1)


                      // columne
                      // search
                      console.log('loop start')
                      console.log(currentCol.length , searchVal1 )

                      for (let i = 0; i < currentCol.length ; i++) {
                        console.log('loop')
                          console.log(currentCol[i]);
                          var obj = {};


                          for (let j = 0; j < searchVal1.length ; j++) {
                              console.log(searchVal1[j])
                              if (i == j) {
                                obj[currentCol[i]] = searchVal1[j];
                                arr.push(obj)
                              }


                          }
                      }

                      const seen = new Set();
                      const filteredArr = arr.filter(el => {
                        const duplicate = seen.has(el.id);
                        seen.add(el.id);
                        return !duplicate;
                      });

                      setPages(0)
                     // setLogData(filterValue)

                    }
              }

              afterGetColHeader={theader}
                />
                : <HotTable
                 autoColumnSize={true}
                 height='auto'
                 stretchH='all'
                 className="myRow"
                 preventOverflow="horizontal"
                 autoWrapRow={true}
                 columns={logColumns}
                 filters={true}
                 // ref={hotRefReport2}
                 //  fillHandle={false}
                  licenseKey="non-commercial-and-evaluation"
                  afterOnCellMouseDown={localAfterOnCellMouseDown}
                  afterGetColHeader={theader}

                 // style={{ textAlign: "center" }}
                    data={[{ isChecked: "No Data Found!" }]}
                    rowHeights={RowSize}
                    columnHeaderHeight={columnHeaderSize}
                  dropdownMenu={{
                    items: {

                        filter_by_value: {
                            name: "Search Value",
                        },

                        filter_action_bar: {

                        },
                    }
                }}

                afterFilter={
                  function (data) {
                      var searchInput = document.querySelector('.htUIMultipleSelectSearch.htUIInput');
                      var value = searchInput?.children[0].value;
                      const x = searchVal1;
                      let y = currentCol;
                      if (!searchVal1?.length) {
                        x.push(value);
                        y.push(logColumns[currentCol1]?.data);
                        setSearchVal1(x);
                        setCurrentCol(y);

                      } else {
                        currentCol.map((item, index) => {
                          if (item == logColumns[currentCol1]?.data) {
                            const xyz = searchVal1
                            xyz[index] = value
                            setSearchVal1(xyz)
                          } else {
                            x.push(value);
                            let y = currentCol;
                            y.push(logColumns[currentCol1]?.data);
                            setSearchVal1(x);
                            setCurrentCol(y);
                          }
                        })
                      }

                      const filterValue = logData.filter(p => p.y.includes(searchVal1[0]));
                      setPages(0)
                      setLogData(filterValue)

                    }
              }
                                                            />}
                  </div>
              <ReactPaginate
                  breakLabel="..."
                  nextLabel=""
                  onPageChange={(e) => handlePageClick(e?.selected)}
                  pageRangeDisplayed={2}
                  pageCount={pageCount1}
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
                </ModalBody>
                <ModalFooter>
            <Button color='danger'  onClick={() => setModalShow(!modalShow)} outline>
              Close
            </Button>
          </ModalFooter>
            </Modal>
            <VerificationModal composeOpen={composeOpen} toggleCompose={toggleCompose1} userClientIds={clientIds}
       messageDisplay={msgDisplay}  otpGSTIN={GSTIN}
     ></VerificationModal>
    </Fragment>
  );
};

export default Gstr1Download;

