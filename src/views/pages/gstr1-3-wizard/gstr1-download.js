import { Fragment, useState, useEffect, useRef } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  Col,
  Row,
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
} from "reactstrap";
import {
  Download,
  CheckCircle,
  Upload,
  ArrowLeft,
  ArrowRight, X
} from "react-feather";
import GSTR1DownloadService from "../../../services/gstr1/gstr1Services/gstr1DownloadService";
import { SELECT_MAXSIZE, PROJECT_URL } from "../../../configs/config";
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
import { useNavigate, useOutletContext, useLocation } from "react-router-dom";
import { RowSize, columnHeaderSize } from "@configs/config";
import { useDispatch, useSelector } from "react-redux";
import { getGSTR1FiledSummary } from "../../apps/user/store";
import  VerificationModal  from '../../../views/pages/verification-otp/index'
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);

const defaultValues = {
  otp: "",
};

const Gstr1Download = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const clientId =
    sessionStorage.getItem(globleVariable.G_UCParId) &&
    SessionFunction.getSessionValue(globleVariable.G_UCParId, true);
  const subId =
    localStorage.getItem(globleVariable.subscriptionId) &&
    LocalFunction.getLocalValue(globleVariable.subscriptionId, true);
  const GGSTIN =
    sessionStorage.getItem(globleVariable.G_GSTIN) &&
    SessionFunction.getSessionValue(globleVariable.G_GSTIN, true);
    let GFY =
    sessionStorage.getItem(globleVariable.G_FY) &&
    SessionFunction.getSessionValue(globleVariable.G_FY, true);
     let GFM =
    sessionStorage.getItem(globleVariable.G_FM) &&
    SessionFunction.getSessionValue(globleVariable.G_FM, true);


  let hotRef = useRef(null);
  let hotRefDocumentLevel = useRef(null)
  let hotRefSummaryLevel = useRef(null)
  const { stepper, processGSTR1Filled } = props;
  const [pageSize, setPageSize] = useState(15);
  const [pages, setPages] = useState(0);
  const [logPages, setLogPages] = useState(0);
  const [activeClassName, setActiveClassName] = useState("active");
  const [searchApi, setSearchApi] = useState(false);
  const returnDate = sessionStorage.getItem("gstr1DownloadFromDt");
  // console.log(returnDate,"returnDatereturnDatereturnDate")
  const [modalShow, setModalShow] = useState(false);
  const [logData, setLogData] = useState([])
  const [logDataFilter, setLogDataFilter] = useState([])
  const [searchVal1, setSearchVal1] = useState([]);
  const [currentCol, setCurrentCol] = useState([]);
  const [currentCol1, setCurrentCol1] = useState();
  const [documnetLevelData, setDocumnetLevelData] = useState([]);
  const [summaryLevelSummaryData,setSummaryLevelData] = useState([])
  const [isQualified, setIsQualified] = useState(true)
  const [msgDisplay, setMsgDisplay] = useState(null);
  const [composeOpen, setComposeOpen] = useState(false)
  const toggleCompose1 = () => setComposeOpen(!composeOpen)
  const location = useLocation()

  let arr = []

  const [data, setData] = useState([
  ]);

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
      title: "Date"
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
      data: 'noteType',
      title: 'Note Type'
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
      data: 'portCode',
      title: 'Port Code'
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
      data: 'to',
      title: 'To'
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

  // ** View Button link
  function emptyRender(instance, td, row, col, prop, value, cellProperties, coords) {
    textRenderer.apply(this, arguments);
    // if row contains negative number
    if (!value) {

      const vId = instance.getDataAtCell(row, "logId");
      const actionValue = instance.getDataAtCell(row, "action");
      const status = instance.getDataAtCell(row, "status");

      let encrptyValue = btoa(vId);
      let urlDirect = PROJECT_URL + '/gst-returns/gstr1/gstr1filed?' + encrptyValue;



      if (actionValue?.toLowerCase() == 'generate gstr1 summary') {

        td.innerHTML = `<a href=${urlDirect}   target='_BLANK' >View</a>`;
        td.className = "text-center";
      } else if (actionValue?.toLowerCase() !== 'generate gstr1 summary' && status?.toLowerCase() !== 'success') {

        td.innerHTML = `<a  class="btn_click" target='_BLANK' >View</a>`;
        td.className = "text-center";
      } else {
        td.innerHTML = `<a>-</a>`;
        td.className = "text-secondary text-center";
      }

      $(td).find('.btn_click').on('click', event => {
        logDetails(vId)
      });


      td.style.cursor = "pointer";
    }
  }

  // ** tobeuplodedclick
  function emptyRender1(instance, td, row, col, prop, value, cellProperties, coords) {
    textRenderer.apply(this, arguments);
    // if row contains negative number
    // if (!coords?.col == 1) {
      if (value) {
      const vId = instance.getDataAtCell(row, "logId");
      // const actionValue = instance.getDataAtCell(row, "action");
      // const status = instance.getDataAtCell(row, "status");
      const actionValue = instance.getDataAtCell(row, "toBeUploaded");
      let encrptyValue = btoa(vId);
      let urlDirect = PROJECT_URL + '/gst-returns/gstr1-sales/gstr1-summary-details' + encrptyValue;

      if (actionValue?.toLowerCase() == 'generate gstr1 summary') {

        if (value !== '0' &&  value !== '' && value !== null && value !== undefined ) {
          td.innerHTML = `<a href=${urlDirect}   target='_BLANK' >toBeUploaded</a>`;
          td.className = "text-center";
        }
      }

      td.style.cursor = "pointer";
    }
  }

  // ** return error log page
  const logDetails = (logid) => {
    GSTR1DownloadService.gstr1GovtReturnErrorLogStatus(logid)
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


        } else if (res.status === 200 &&
          res.data.status == '-13012') {
          setModalShow(!modalShow)
          setLogData(res.data.data)
          setLogDataFilter(res.data.data)
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

  const { userIds, clientIds, GSTIN, wizardIndex } = props;

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
  const [open, setOpen] = useState("1");
  const [moveNext, setMoveNext] = useState(false)


  const pageCount = Math.ceil(data?.length && data?.length / pageSize);
  const para1 = pages * pageSize;
  const para2 = pages * pageSize + pageSize;
  let dataShow = data && data?.slice(para1, para2);

  //**Error Log Data Pagination */
  const pageCount1 = Math.ceil(logData?.length && logData?.length / pageSize);
  const logpara1 = logPages * pageSize;
  const logpara2 = logPages * pageSize + pageSize;
  let logdataShow = logData && logData?.slice(logpara1, logpara2);


  const handlePageClick = (event) => {
    setPages(event);
  };

  const logHandlePageClick = (event) => {
    setLogPages(event);
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
      isFromReconciliation : processGSTR1Filled !== undefined && processGSTR1Filled !== null && processGSTR1Filled !== "" ? true : false
    };

    setBlock(true);
    GSTR1DownloadService.gstr1SaveGovt(payLoad)
      .then((res) => {

        if (res.data.status === errorCodeConfig.APIDefaultCode.GovtOTPExpire) {
          // closeModal();
          setMsgDisplay(res?.data?.errorMessage)
          setBlock(false);

          setComposeOpen(true)

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
            govtErrorLog(0);
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
    GSTR1DownloadService.proceedFileGstr1Govt(payLoad)
      .then((res) => {
        if (res.data.status === errorCodeConfig.APIDefaultCode.GovtOTPExpire) {
          // closeModal();
          setMsgDisplay(res?.data?.errorMessage)
          setBlock(false);
          // loadFunction(false);
          setComposeOpen(true)

        }else{
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
            govtErrorLog(0);
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
    GSTR1DownloadService.getGstr1SummaryGovt(payLoad)
      .then((res) => {
        if (res.data.status === errorCodeConfig.APIDefaultCode.GovtOTPExpire) {
          // closeModal();
          setMsgDisplay(res?.data?.errorMessage)
          setBlock(false);
          // loadFunction(false);
          setComposeOpen(true)

        }else{
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
      res.status === 200
      // &&
      // res.data.status === errorCodeConfig.APIDefaultCode.Success
    ){
      setBlock(false);
      console.log(res?.data?.data,"res?.data?.data?")
              if(res?.data?.data?.isGSTR1Filed){
                sessionStorage.setItem("btnDisable", '5');
                      stepper.next();
              }
              else if (res?.data?.data?.isGSTR1Filed == false){
                setIsQualified(false)
              }
              else if (res?.data?.data == null){
                setIsQualified(false)
              }
              else{
                  /// pending
                //  setIsQualified(true)
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
    return () => setBlock(false);
  }, []);

  useEffect(() => {
    if (wizardIndex == 1) {
      returnFileStatus()
      govtErrorLog(0);
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
    };

    setBlock(true);
    GSTR1DownloadService.gstr1GovtReturnLogStatus(payLoad)
      .then((res) => {
        if (
          res.status === 200 &&
          res.data.status === errorCodeConfig.APIDefaultCode.Success
        ) {
          setBlock(false);
          setData(res?.data?.data?.data);
          setBtnDisable(res?.data?.data?.lastStatus);

          sessionStorage.setItem("btnDisable", res?.data?.data?.lastStatus);

          if (IsNextStep) {
            setBlock(false);
            stepper.next();
          }
        } else {
          setBlock(false);
          setBtnDisable(5)
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
    const hot = hotRef?.current?.hotInstance;
    setCurrentCol1(coords?.col);
    if (coords.row !== -1 && coords.col == 0) {
      console.log('click cell', coords.row)
      let checkValue = hot?.getDataAtRowProp(coords.row, "isActive");
      console.log(checkValue)
      hot?.setDataAtCell(coords.row, 0, !checkValue);
    }
  }

  // ** Theder remove filter
  const theader = (col, TH) => {
    if (col < 3 || col > 10 || col == 5 || col == 6 || col == 7 || col == 8 || col == 9) {
      const button = TH?.children[0]?.children[0];
      button?.parentNode?.removeChild(button);
    }

  }


    // ** log detail table
    const theaderLog = (col, TH) => {

      if (col == 1 || col == 2 || col == 3  ) {
        TH.className = "htLeft";
      }

    }

  function getUniqueListBy(arr, key) {
    return [...new Map(arr.map(item => [item[key], item])).values()]
  }

  //**  For Column Filtering
  function FilterData(arr) {
    let addArr = [];
    var flag = false;
    let updatedData = [];
    let finalObj ={}

    for(let i = 0; i < arr.length; i++ ) {
      Object.assign(finalObj, arr[i]);
    }

       updatedData = logDataFilter
      .filter((item) =>
      finalObj.gstin?.length  ? item.gstin.includes(finalObj.gstin) : item
      )
      .filter((data) =>
      finalObj.invoiceNumber?.length  ? data.invoiceNumber.includes(finalObj.invoiceNumber) : data
      )
      .filter((invoiceval) =>
      finalObj.invoiceValue?.length  ? invoiceval.invoiceValue.includes(finalObj.invoiceValue) : invoiceval
      )
      flag = true;

    addArr.push(...updatedData);
    setPages(0);
    let uniq = [...new Set(addArr)];
   return uniq;
  }

  const documnentLevelSummaryColumns = [
    {
      data: "sectionType",
      title: "Type",
      readOnly:true
    },
    {
      data: "toBeUploaded",
      title: "To Be Uploaded",
      readOnly:true
    },
    {
      data: "uploaded",
      title: "Already Uploaded",
      readOnly:true
    },
    {
      data:"sectionId",
      title:"Section ID",
      readOnly:true
    },

  ]

  const summaryLevelsummaryColumns = [
    {
      data: "sectionType",
      title: "Type",
      readOnly:true
    },
    {
      data: "taxableValue",
      title: "Taxable Value (₹)",
      readOnly:true
    },
    {
      data:"sectionId",
      title:"Section ID",
      readOnly:true
    }
    // {
    //   data: "lastAutoComputed",
    //   title: "Last Autocomputed"
    // },
  ]

  const documnentLevelSummaryData = [
    {
      type: "B2B",
      toBeUploaded: 12,
      uploaded: 18,
      sectionId:"1"
    },
    {
      type: "B2CL",
      toBeUploaded: 12,
      uploaded: 18,
      sectionId:"2"
    },
    {
      type: "EXP",
      toBeUploaded: 12,
      uploaded: 18,
      sectionId:"3"
    },
    {
      type: "CDN",
      toBeUploaded: 12,
      uploaded: 18,
      sectionId:"4"
    },
    {
      type: "CDNUR",
      toBeUploaded: 12,
      uploaded: 18,
      sectionId:"5"
    },
    {
      type: "B2BA",
      toBeUploaded: 12,
      uploaded: 18,
      sectionId:"6"
    },
    {
      type: "B2CLA",
      toBeUploaded: 12,
      uploaded: 18,
      sectionId:"7"
    },
    {
      type: "EXPA",
      toBeUploaded: 12,
      uploaded: 18,
      sectionId:"8"

    }, {
      type: "CDNRA",
      toBeUploaded: 12,
      uploaded: 18,
      sectionId:"9"
    }, {
      type: "CDNURA",
      toBeUploaded: 12,
      uploaded: 18,
      section:"10"
    },
  ]


  const chckREco = sessionStorage.getItem("checkReconnectivity")
  const gstr1SaveGovtSummary = () => {
    const payLoad = {
      userClientId: clientIds,
      userId: userIds,
      returnPeriod: returnDate,
      // returnPeriod: "112023",
      loggedGSTIN: GSTIN,
      isFromReconciliation : (processGSTR1Filled !== undefined && processGSTR1Filled !== null && processGSTR1Filled !== "") || chckREco ? true : false
      // isFromReconciliation: true
    };

    setBlock(true);
    GSTR1DownloadService.gstr1SaveToGovtSummary(payLoad)
      .then((res) => {
        if (
          res.status === 200 &&
          res.data.status === errorCodeConfig.APIDefaultCode.Success
        ) {
          setBlock(false);
          console.log(res?.data?.data, "resssssssult")
          setDocumnetLevelData(res?.data?.data?.gstr1DocumentLevelAPIModel)
          setSummaryLevelData(res?.data?.data?.gstr1SummaryLevelAPIModels)
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
  }

  useEffect(() => {
    if (wizardIndex == 1 || chckREco == true || chckREco == "true") {
      gstr1SaveGovtSummary()

    }
  }, [wizardIndex,chckREco])

  const theaderLogSummaryData = (col, TH) => {

    if (col == 0) {
      TH.className = "htLeft";
    }
    else {
      TH.className = "htRight";
    }

  }

  let isFromReconciliation = null;
  let isFromFiling = null

  if (location.state !== null) {
      (isFromReconciliation =
        location.state.isFromReconciliation !== null &&
        location.state.isFromReconciliation !== "null"
            ? location.state.isFromReconciliation
            : null);
      (isFromFiling =
        location.state.isFromFiling !== null &&
        location.state.isFromFiling !== "null"
          ? location.state.isFromFiling
          : null);
  }

  const localAfterOnCellMouseDowndocumentLevelSummary = (event, coords, td, row) =>{
    console.log(coords,"coordssss")
    const hot  = hotRefDocumentLevel?.current?.hotInstance;
    const invCount = hot?.getDataAtRow(coords.row)[1];

    const typeofInvoiceId = hot?.getDataAtRow(coords.row)[3];

    if(coords?.col == 1) {
      if (invCount !== '0' && invCount !== null && invCount !== undefined && invCount !== '') {

        let isRecoValue = (isFromReconciliation == 1 || chckREco) ? 1: 0;
        let retrunDates =  sessionStorage.getItem("gstr1DownloadFromDt")

        const newState = { sectionId: typeofInvoiceId,
          isFromReconciliation: isFromReconciliation == 1 ? 1: 0,
          isFromFiling : 1
         };

         const redirectUrl =  `/gst-returns/gstr1-sales/gstr1-summary-details?s=${typeofInvoiceId}&r=${isRecoValue}&f=${1}&fr=${retrunDates}&tr=${retrunDates}`;

         window.open(redirectUrl.toString(), '_blank');

      }
    }

  }

  const localAfterOnCellMouseSummaryLevelSummary = (event, coords, td, row) =>{

    const hot  = hotRefSummaryLevel?.current?.hotInstance;
    const invCount = hot?.getDataAtRow(coords.row)[1];

    const typeofInvoiceId = hot?.getDataAtRow(coords?.row)?.[2];

    if(coords?.col == 1) {
      if ((invCount != 0 || invCount != 0.00 )  && invCount !== null && invCount !== undefined && invCount !== '') {

        let isRecoValue = (isFromReconciliation == 1 || chckREco) ? 1: 0;
        let retrunDates =  sessionStorage.getItem("gstr1DownloadFromDt")

        const newState = { sectionId: typeofInvoiceId,
          isFromReconciliation: isFromReconciliation == 1 ? 1: 0,
          isFromFiling : 1
         };

         const redirectUrl =  `/gst-returns/gstr1-sales/gstr1-summary-details?s=${typeofInvoiceId}&r=${isRecoValue}&f=${1}&fr=${retrunDates}&tr=${retrunDates}`;

         window.open(redirectUrl.toString(), '_blank');

      }
    }

  }
// console.log(gstrfiledDataDetailState,"gstrfiledDataDetailStategstrfiledDataDetailState")

useEffect(() => {
  if(isQualified == false){
    if (wizardIndex === 1 && !processGSTR1Filled && (chckREco=="false" || chckREco == false || chckREco == null)) {
      MySwal.fire({
        title: "GSRT1 Reconciling Filing",
        text: "Do you wish to file GSTR 1 after reconciling data with auto populated E-Invoice data",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText:"No",
        customClass: {
          confirmButton: "btn btn-outline-danger",
          cancelButton: "btn btn-outline-dark ms-1",
        },
        buttonsStyling: false,
      }).then(function (result) {
        console.log(result,"ressssilt")
        if (result.value) {
          const payLoad = {
            UserClientId: clientIds,
            UserId: userIds,
            FromRange: returnDate,
            ToRange:returnDate,
            gstNumber: GSTIN,
          };
          setBlock(true)
          GSTR1DownloadService.checkRecoAPI(clientIds,userIds,returnDate,GSTIN)
          .then((res) => {
            if (
              res.status === 200 &&
              res.data.status === errorCodeConfig.APIDefaultCode.Success
            ) {
              setBlock(false);
              console.log(res?.data?.data,"res?.data?.datares?.data?.datares?.data?.data")
              sessionStorage.setItem("checkReconnectivity",res?.data?.data)
              if(!res?.data?.data){
                navigate("/reconcilation/gstr1-vs-e-invoice")
              }
              else{
                // gstr1SaveGovtSummary()
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
        } else if (result.dismiss === MySwal.DismissReason.cancel) {
           reset();
        }
      });
    }
  }


}, [!isQualified]);

console.log(typeof(chckREco),"chckREcochckREco")

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
                    <h3 style={{ fontSize: "20px", fontWeight: "bold" }} className=""> Document Level </h3>
                    <div style={{marginBottom:"20px",maxHeight:"136px", overflow:"auto"}}>
                    {/* <div style={{ marginBottom: "20px" }}> */}
                            <HotTable
                              afterGetColHeader={theaderLogSummaryData}
                              height="auto"
                              // height="136px"
                              className="myRow"
                              rowHeights={RowSize}
                              style={!documnetLevelData?.length ? { overflowX: "hidden", textAlign: "center" } :""}
                              columnHeaderHeight={columnHeaderSize}
                              data={ !documnetLevelData?.length ?  [{sectionType : "No data found" }] : documnetLevelData }
                              ref={hotRefDocumentLevel}
                              stretchH="all"
                              preventOverflow="horizontal"
                              columns={documnentLevelSummaryColumns}
                              contextMenu={false}
                              bindRowsWithHeaders={true}
                              licenseKey="non-commercial-and-evaluation"
                              autoWrapRow={true}
                              cells={function (row, col) {
                                const hot = hotRefDocumentLevel?.current?.hotInstance;
                                const cellProperties = {};
                                if (col == 1) {
                                  if(documnetLevelData?.[row]?.toBeUploaded != 0 || documnetLevelData?.[row]?.toBeUploaded != 0.00){
                                    cellProperties.className = "text-end text-danger cursor-pointer"
                                 }
                                 else{
                                   cellProperties.className = "text-end"
                                 }
                               }

                                if(col ==2){
                                    cellProperties.className = "text-end"

                                }
                                return cellProperties;
                              }}
                              mergeCells={!documnetLevelData?.length ? [{ row: 0, col: 0, rowspan: 1, colspan: 3}]  : false}
                              afterOnCellMouseDown={documnetLevelData?.length > 0 ? localAfterOnCellMouseDowndocumentLevelSummary:""}
                              hiddenColumns={{
                                columns: [3],
                              }}

                            />
                      {/* <hr/> */}
                    </div>

                    <h3 style={{fontSize:"20px",fontWeight:"bold"}}  className="">Summary Level </h3>
                    <div style={{marginBottom:"20px",maxHeight:"136px", overflow:"auto"}}>
                    <HotTable
                      afterGetColHeader={theaderLogSummaryData}
                      className="myRow"
                      rowHeights={RowSize}
                      columnHeaderHeight={columnHeaderSize}
                      mergeCells={!dataShow ? [{ row: 0, col: 0, rowspan: 1, colspan: 5 }] : false}
                      data={summaryLevelSummaryData}
                      ref={hotRefSummaryLevel}
                      stretchH="all"
                      preventOverflow="horizontal"
                      columns={summaryLevelsummaryColumns}
                      contextMenu={false}
                      bindRowsWithHeaders={true}
                      licenseKey="non-commercial-and-evaluation"
                      // height="136px"
                      height="auto"
                      autoWrapRow={true}
                      cells={function (row, col) {

                        const hot = hotRef?.current?.hotInstance;
                        const cellProperties = {};
                        if(col > 0){
                          cellProperties.className="text-end"
                        }
                        if(col ==0 ){
                          cellProperties.className="cursorTest"
                        }
                        if (col == 1) {
                           if(summaryLevelSummaryData?.[row]?.taxableValue != 0.00 || summaryLevelSummaryData?.[row]?.taxableValue != 0){
                             cellProperties.className = "text-end text-danger cursor-pointer"
                          }
                          else{
                            cellProperties.className = "text-end"
                          }
                        }

                        return cellProperties;
                      }}
                      afterOnCellMouseDown={summaryLevelSummaryData.length > 0 ? localAfterOnCellMouseSummaryLevelSummary:""}
                      hiddenColumns={{
                        columns: [2],
                      }}
                    />
                    </div>
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
                      disabled={ btnDisable == 5 ? true :  btnDisable >= 2  ? false : true}
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
                      disabled={   btnDisable == 5 ? true : btnDisable >= 3 ? false : true}
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
                  afterGetColHeader={theaderLog}
                  className="myRow"
                  rowHeights={RowSize}
                  columnHeaderHeight={columnHeaderSize}
                 // style={!dataShow ? { overflowX: "hidden", textAlign: "center" } : "" }
                  mergeCells={ !dataShow ?  [{ row: 0, col: 0, rowspan: 1, colspan: 5 }] : false }
                  data={ !dataShow ?  [{logId : "No data found" }] : dataShow }
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
                    if (dataShow) {
                      if (row != -1 && col == 4) {
                        cellProperties.renderer = emptyRender;
                        cellProperties.className = "text-center";
                      }
                    } else {
                      if (col == 0) {
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
            {
              logData?.length ? <HotTable
              rowHeights={RowSize}
              columnHeaderHeight={columnHeaderSize}
                className="myRow"
                data={logdataShow ? logdataShow : []}
                ref={hotRef}
                mergeCells={false}
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
                afterGetColHeader={theader}
                cells={function (row, col) {
                  const hot = hotRef?.current?.hotInstance;
                  const cellProperties = {};
                  if (row != -1) {
                    // cellProperties.renderer = emptyRender;
                    cellProperties.className = "text-center";
                  }
                  return cellProperties;
                }}

                dropdownMenu={{
                  items: {
                    filter_by_value: {
                      name: "Search Value",
                    },
                    clear: {
                      name: `<button id='btnClear' name='Clear'   value='Clear'>Clear</button>`,
                      //disabled: true,
                      callback: function (key, selection, clickEvent) {
                        console.log("date picker clicked");
                        var src = clickEvent.target;
                        console.log("name", src.tagName);
                        if (src.tagName.toLowerCase() === "button") {
                          if (clickEvent.target.id == "btnClear") {
                            // console.log("custom menu2", key, selection, clickEvent, src,data);

                            const hot = hotRef?.current?.hotInstance;

                            var searchInput = document.querySelector(
                              ".htUIMultipleSelectSearch.htUIInput"
                            );
                            var value = "";
                            const x = searchVal1;
                            if (!searchVal1?.length) {
                              x.push(value);
                              let y = currentCol;
                              y.push(
                                logColumns[currentCol1]?.data
                              );
                              // console.log("jsx=",x,y)
                              setSearchVal1(x);
                              setCurrentCol(y);
                              // forceUpdate();
                            } else {
                              const Index = currentCol?.findIndex(
                                (item) =>
                                logColumns[currentCol1]?.data ==
                                  item
                              );
                              // if (item == backgroundColumns[currentCol1]?.data)
                              if (Index != -1) {
                                const xyz = searchVal1;
                                xyz[Index] = value;
                                setSearchVal1(xyz);
                              } else {
                                x.push(value);
                                let y = currentCol;
                                y.push(
                                  logColumns[currentCol1]?.data
                                );
                                setSearchVal1(x);
                                setCurrentCol(y);
                              }
                            }
                           let uniq = [...new Set(currentCol)];

                           for (let i = 0; i < uniq.length; i++) {
                             var obj = {};

                             for (let j = 0; j < searchVal1.length; j++) {
                               console.log(searchVal1[j])
                               if (i == j) {
                                 obj[uniq[i]] = searchVal1[j];
                                 arr.push(obj)
                               }
                             }
                           }
                           let newFilterData = FilterData(arr);
                           setLogData([...newFilterData])

                          }

                          clickEvent.stopImmediatePropagation();
                        }

                        console.log("custom value", src.value);
                        clickEvent.stopImmediatePropagation();
                      },
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
                      let y = currentCol;
                      y.push(logColumns[currentCol1]?.data);
                      // console.log("jsx=",x,y)
                      setSearchVal1(x);
                      setCurrentCol(y);
                      // forceUpdate();
                    } else {
                      const Index = currentCol?.findIndex(
                        (item) =>
                        logColumns[currentCol1]?.data == item
                      );
                      // if (item == backgroundColumns[currentCol1]?.data)
                      if (Index != -1) {
                        const xyz = searchVal1;
                        xyz[Index] = value;
                        setSearchVal1(xyz);
                      } else {
                        x.push(value);
                        let y = currentCol;
                        y.push(logColumns[currentCol1]?.data);
                        // console.log("jsx=",x,y)
                        setSearchVal1(x);
                        setCurrentCol(y);
                      }
                    }
                    let uniq = [...new Set(currentCol)];

                    for (let i = 0; i < uniq.length; i++) {

                      var obj = {};

                      for (let j = 0; j < searchVal1.length; j++) {
                        console.log(searchVal1[j])
                        if (i == j) {
                          obj[uniq[i]] = searchVal1[j];
                          arr.push(obj)
                        }
                      }
                    }
                    let newFilterData = FilterData(arr);
                    setLogData([...newFilterData])
                  }
                }
                afterOnCellMouseDown={localAfterOnCellMouseDown}

              />
                : <HotTable
                rowHeights={RowSize}
                columnHeaderHeight={columnHeaderSize}
                  autoColumnSize={true}
                  height='auto'
                  stretchH='all'
                  className="myRow"
                  preventOverflow="horizontal"
                  autoWrapRow={true}
                   afterOnCellMouseDown={localAfterOnCellMouseDown}
                  columns={logColumns}
                  filters={true}
                  ref={hotRef}
                  commentedCellClassName="custom-cell"
                  licenseKey="non-commercial-and-evaluation"
                  afterGetColHeader={theader}
                  style={{ textAlign: "center" }}
                  data={[{ sectionName: "No Data Found!" }]}
                  mergeCells={[{ row: 0, col: 0, rowspan: 1, colspan: 15 }]}

                  dropdownMenu={{
                    items: {
                      filter_by_value: {
                        name: "Search Value",
                      },

                      clear: {
                        name: `<button id='btnClear' name='Clear'   value='Clear'>Clear</button>`,
                        //disabled: true,
                        callback: function (key, selection, clickEvent) {
                          console.log("date picker clicked");
                          var src = clickEvent.target;
                          console.log("name", src.tagName);
                          if (src.tagName.toLowerCase() === "button") {
                            if (clickEvent.target.id == "btnClear") {
                              // console.log("custom menu2", key, selection, clickEvent, src,data);

                              const hot = hotRef?.current?.hotInstance;

                              var searchInput = document.querySelector(
                                ".htUIMultipleSelectSearch.htUIInput"
                              );
                              var value = "";
                              const x = searchVal1;
                              if (!searchVal1?.length) {
                                x.push(value);
                                let y = currentCol;
                                y.push(
                                  logColumns[currentCol1]?.data
                                );
                                // console.log("jsx=",x,y)
                                setSearchVal1(x);
                                setCurrentCol(y);
                                // forceUpdate();
                              } else {
                                const Index = currentCol?.findIndex(
                                  (item) =>
                                  logColumns[currentCol1]?.data ==
                                    item
                                );
                                // if (item == backgroundColumns[currentCol1]?.data)
                                if (Index != -1) {
                                  const xyz = searchVal1;
                                  xyz[Index] = value;
                                  setSearchVal1(xyz);
                                } else {
                                  x.push(value);
                                  let y = currentCol;
                                  y.push(
                                    logColumns[currentCol1]?.data
                                  );
                                  setSearchVal1(x);
                                  setCurrentCol(y);
                                }
                              }
                             let uniq = [...new Set(currentCol)];

                             for (let i = 0; i < uniq.length; i++) {
                               var obj = {};

                               for (let j = 0; j < searchVal1.length; j++) {
                                 console.log(searchVal1[j])
                                 if (i == j) {
                                   obj[uniq[i]] = searchVal1[j];
                                   arr.push(obj)
                                 }
                               }
                             }
                             let newFilterData = FilterData(arr);
                             setLogData([...newFilterData])

                            }

                            clickEvent.stopImmediatePropagation();
                          }

                          console.log("custom value", src.value);
                          clickEvent.stopImmediatePropagation();
                        },
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


                      let uniq = [...new Set(currentCol)];

                      for (let i = 0; i < uniq.length; i++) {

                        var obj = {};

                        for (let j = 0; j < searchVal1.length; j++) {
                          console.log(searchVal1[j])
                          if (i == j) {
                            obj[uniq[i]] = searchVal1[j];
                            arr.push(obj)

                          }
                        }
                      }
                      let newFilterData = FilterData(arr);

                      setLogData([...newFilterData])
                    }}
                />}
          </div>
          <ReactPaginate
            breakLabel="..."
            nextLabel=""
            onPageChange={(e) => logHandlePageClick(e?.selected)}
            pageRangeDisplayed={2}
            pageCount={pageCount1}
            forcePage={logPages}
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
          <Button color='danger' onClick={() => setModalShow(!modalShow)} outline>
            Close
          </Button>
        </ModalFooter>
      </Modal>
      <VerificationModal composeOpen={composeOpen} toggleCompose={toggleCompose1} userClientIds={clientId}
       messageDisplay={msgDisplay} otpGSTIN={GGSTIN}
     ></VerificationModal>
    </Fragment>
  );
};

export default Gstr1Download;
