import { useState, useRef, useEffect } from "react";
import { HotTable } from "@handsontable/react";
import Handsontable from "handsontable";
import { textRenderer } from "handsontable/renderers";
import { registerAllModules } from "handsontable/registry";
import GSTR1FileDataAPIService from "../../../../services/gstr1/gstr1DataFileService/gstr1FileDataService";
import errorCodeConfig from "../../../../configs/apiErrorCodeConfig";
import Select from "react-select"; // eslint-disable-line
import makeAnimated from "react-select/animated";
import { selectThemeColors } from "@utils";
import {
  useNavigate,
  useParams,
  useLocation,
  useOutletContext,
} from "react-router-dom";
import $ from "jquery";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

// ** Spinner (Splash Screen)
import { LINK_MESSAGE, RowSize, checkBoxTitle, columnHeaderSize, paginationList, PageSize, paginationTitle, checkboxFilterCss } from "../../../../configs/config";
const MySwal = withReactContent(Swal);
const animatedComponents = makeAnimated();
import { tokenExpiresRedirect } from "../../../../utility/Utils";

import { globleVariable } from "../../../../configs/globalVariable";
import LocalFunction from "../../../../configs/getLocalFunction";
import SessionFunction from "../../../../configs/getSessionFunction";
import { urlEndpointConfig } from '@configs/urlEndpoint';
import { getGSTR1FiledSummary } from "../../../apps/user/store";
import { useDispatch, useSelector } from "react-redux";

registerAllModules();

// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  Label,
  TabContent,
  TabPane,
  CardBody,
} from "reactstrap";
import { useForm } from "react-hook-form";

import ReactPaginate from "react-paginate";
import Tabs from "./tabs";
import encryptData from "../../../../auth/crypto/crypto";
import { downloadURL } from "../../../../helper/downloadUrl";
import GSTR1FiledMOckData from "./mockData";
import moment from "moment";
import { showTotalRowPerPage } from "../../../../helper/tableRowsPerPage";
// import { event } from 'jquery';

let isChecked = false;
const optionField = { label: "--Select--", value: "-1" };
var unitList = [];

var taxList = [];
var placeOfSupplyList = [];

const finYearOption = LocalFunction.getLocalValue(
  globleVariable.rangeFilters,
  true
);
const YearList = JSON.parse(finYearOption);
const refershData = "refData";

const GSTR1FileDataInvoices = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let fromPath = window.location.pathname;

  const [block, setBlock] = useState(false);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [page1, setPage1] = useState(0);
  const [pageSummary, setPageSummary] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(PageSize);
  const [paginationUi, setPaginationUi] = useState();
  const [currentCol, setCurrentCol] = useState([]);
  const [currentCol1, setCurrentCol1] = useState();
  const [searchVal1, setSearchVal1] = useState([]);
  const [docsData, setDocData] = useState([]);
  const [searchDate, setSearchDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [searchDate1, setSearchDate1] = useState("");
  const [searchDate2, setSearchDate2] = useState("");
  const [typeofDocument, setTypeOfDocumnent] = useState([]);

  const [b2csData, setB2csData] = useState([]);
  const [currentColb2cs, setCurrentColb2cs] = useState([]);
  const [currentCol1b2cs, setCurrentCol1b2cs] = useState();
  const [searchValb2cs, setSearchValb2cs] = useState([]);

  const [atSummaryData, setAtSummaryData] = useState([]);

  const [currentColcrdr, setCurrentColcrdr] = useState([]);
  const [currentCol1crdr, setCurrentCol1crdr] = useState();
  const [searchValcrdr, setSearchValcrdr] = useState([]);

  const [currentColdoc, setCurrentColdoc] = useState([]);
  const [currentCol1doc, setCurrentCol1doc] = useState();
  const [searchValdoc, setSearchValdoc] = useState([]);


  const [count, setCount] = useState(0);
  const [modalshow, setModalshow] = useState(false);
  const [activeTab, setActiveTab] = useState("1");

  const [showList, setShowList] = useState(false);
  const [hsnShow, setHsnShow] = useState(false);
  const [docShow, setDocShow] = useState(false);
  const [advShow, setAdvShow] = useState(false);
  const [finFromYear, setFinFormYear] = useState(null);
  const [panData, setPanData] = useState([]);
  const [panDataFrom, setPanDataFrom] = useState([]);

  const [monthFrom, setMonthFrom] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [displayType, setDisplayType] = useState(false);
  const [searchApi, setSearchApi] = useState(false);
  const [serverSidePage, setServerSidePage] = useState(false);
  const [invoiceSecID, setInvoiceSecID] = useState();
  // filter value set
  const [invoiceTypeList, setInvoiceTypeList] = useState([]);
  const [crdrInvoiceTypeList, setCrDrInvoiceTypeList] = useState([]);
  const [crdrInvoiceType, setCrDrInvoiceType] = useState([]);

  const [b2csInvoiceTypeList, setB2csInvoiceTypeList] = useState([]);
  const [b2csInvoiceType, setB2csInvoiceType] = useState([]);
  const [atInvoiceTypeList, setAtInvoiceTypeList] = useState([]);
  const [atInvoiceType, setAtInvoiceType] = useState([]);

  // set values
  const [invoceTypes, setInvoceTypes] = useState([]);
  const [docInvoiceType, setDocInvoiceType] = useState([]);

  const [activeClassName, setActiveClassName] = useState("active");
  const [totalCGST, setTotalCGST] = useState(0);
  const [hsn, setHsn] = useState(0);
  const [hsnValue, setHsnValue] = useState(0);
  const [totalCess, setTotalCess] = useState(0);
  const [totalIGST, setTotalIGST] = useState(0);
  const [totalInvoice, setTotalInvoice] = useState(0);
  const [totalInvoiceValue, setTotalInvoiceValue] = useState(0);
  const [totalSGST, setTotalSGST] = useState(0);
  const [totalTaxableValue, setTotalTaxableValue] = useState(0);

  //ITC
  const [btnDisable, setbtnDisable] = useState(true);
  const [btnDisable1, setbtnDisable1] = useState(false);

  const [srcLoad, setSrcLoad] = useState(false);
  const { setGSRT1Data, stepper } = useOutletContext();

  // Advance filter
  const [reverseCharge, setReverseCharge] = useState([]);
  const [unitOfMeasurement, setunitOfMeasurement] = useState([]);
  const [placeOfSupply, setplaceOfSupply] = useState([]);
  const [creditDebit, setcreditDebit] = useState([]);
  const [rate, setRate] = useState([]);
  const [gridCustomFilter, setGridCustomFilter] = useState([]);
  const [pageNoSelect, setPageNoSelect] = useState(paginationList[0]);
  const [pageTotTitle, setpageTotTitle] = useState(paginationTitle);
  let arrChk = []

  const [filterDropDownList, setFilterDropDownList] = useState({
    rateDropDownList: [],
    rcmDropDownList: [],
    noteTypeDropDownList: [],
    posDropDownList: [],
    uqcDropDownList: [],
  })

  // for Invoice Value State Maintain For Tab-1
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [fromValue, setFromValue] = useState('');
  const [toValue, setToValue] = useState('');
  const [fromTax, setFromTax] = useState('');
  const [toTax, setToTax] = useState('');
  const [fromIgst, setFromIgst] = useState('');
  const [toIgst, setToIgst] = useState('');
  const [fromCgst, setFromCgst] = useState('');
  const [toCgst, setToCgst] = useState('');
  const [fromSgst, setFromSgst] = useState('');
  const [toSgst, setToSgst] = useState('');
  const [fromCess, setFromCess] = useState('');
  const [toCess, setToCess] = useState('');
  const [fromQun, setFromQun] = useState('');
  const [toQun, setToQun] = useState('');
  let itcReadable = true;
  let exempReadable = true;

  const defaultValues = {
    hsn: "",
    description: "",
    uqc: "",
    totalQty: "",
    taxableAmount: "",
    rate: "",
    totalValue: "",
    igst: "",
    cgst: "",
    sgst: "",
    cess: "",
  };

  const defaultValuesDoc = {
    natureOfDocument: "",
    srNoFrom: "",
    srNoTo: "",
    totalNumber: "",
    cancelled: "",
    netIssued: "",
  };

  const defaultValueAdvanceSummary = {
    originalMonthyear: "",
    placeOfSupply: "",
    rate: "",
    igst: "",
    cgst: "",
    sgst: "",
    cess: "",
    grossAdvance: "",
  };

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors },
    clearErrors,
    setValue,
    getValues,
    getFieldState,
    reset,
  } = useForm({ defaultValues, defaultValuesDoc, defaultValueAdvanceSummary });

  const openHsn = () => {
    setHsn(true);
  };

  const toggleModal = () => setModalshow(!modalshow);

  let itcEligibilityList = [];

  const G_UCParId = SessionFunction.getSessionValue(
    globleVariable.G_UCParId,
    true
  );
  const G_GSTIN = SessionFunction.getSessionValue(globleVariable.G_GSTIN, true);
  const G_FY = SessionFunction.getSessionValue(globleVariable.G_FY, true);
  const G_FM = SessionFunction.getSessionValue(globleVariable.G_FM, true);
  const gstr1FiledFromDt = SessionFunction.getSessionValue(
    globleVariable.gstr1FiledFromDt,
    true
  );
  const gstr1FiledToDt = SessionFunction.getSessionValue(
    globleVariable.gstr1FiledToDt,
    true
  );
  const token = LocalFunction.getLocalValue(globleVariable.tokenKey, true);

  const userIds = LocalFunction.getLocalValue(globleVariable.userId, true);
  const subscriptionId = LocalFunction.getLocalValue(
    globleVariable.subscriptionId,
    true
  );

  useEffect(() => {
    let activeTabData = {
      activeTab: activeTab,
      btnDisable1: btnDisable1,
      deleteSaleInvoice: deleteSaleInvoice,
      ExportSectionWiseData: ExportSectionWiseData,
      ClearFilter: ClearFilter,
      setHsnShow: setHsnShow,
      setAdvShow: setAdvShow,
      reset: reset,
      setDocShow: setDocShow,
      btnDisable: btnDisable,
    };
    setGSRT1Data(false, activeTabData);
  }, [invoceTypes, activeTab, data,btnDisable1]);

  useEffect(() => {
    stepper != null && stepper.to(2);
  }, [stepper]);

  useEffect(() => {
    console.log("GSTR!", data);
  }, [data]);

  const location = useLocation();


  let searchUrlValue = null;

  //** Set As per SectionWise Column InvoiceNumber/InvoiceDate Value
  let checkInvoiceNumber;
  let checkInvoiceDate;
  if (invoiceSecID == 2 || invoiceSecID == 12 || invoiceSecID == 4) {
    checkInvoiceNumber = 'RevisedInvoiceNumber'
    checkInvoiceDate = 'RevisedInvoiceDate'
  } else {
    checkInvoiceNumber = 'InvoiceNumber'
    checkInvoiceDate = 'InvoiceDate'
  }


  //** Set As per SectionWise Column GrossAdvance Value
  let checkInvoiceNumberAt;
  let checkInvoiceNumberAtTitle;
  if (invoiceSecID == 15 || invoiceSecID == 16) {
    checkInvoiceNumberAt = 'GrossAdvanceAdjusted'
    checkInvoiceNumberAtTitle = 'Gross advance Adjusted (₹)'
  } else {
    checkInvoiceNumberAt = 'GrossAdvanceReceived'
    checkInvoiceNumberAtTitle = 'Gross advance Received (₹)'
  }


  const invalidColumns = [
    // {
    //   data: "select",
    //   type: "checkbox",
    //   width: 20,
    //   readOnly: false,
    // },

    {
      data: "RecipientGSTIN",
      title: "Buyer GSTIN",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "ReceiverName",
      title: "Receiver Name",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: checkInvoiceNumber,
      title: "Invoice Number",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: checkInvoiceDate,
      title: "Invoice Date",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      // data: "totalTaxableAmount", title: "Total Taxable Amt (₹)", readOnly: true,
      data: "TaxableValue",
      title: "Taxable Value (₹)",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "TotalTaxAmount",
      title: "Total Tax (₹)",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "InvoiceValue",
      title: "Invoice Value (₹)",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "ReverseCharge",
      title: "RCM",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
  ];
  const B2CsInvalidColumns = [
    // {
    //   data: "select",
    //   type: "checkbox",
    //   width: 20,
    //   readOnly: false,
    // },
    {
      data: "ReceiverName",
      title: "Receiver Name",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "InvoiceNumber",
      title: "Invoice Number",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "InvoiceDate",
      title: "Invoice Date",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      // data: "totalTaxableAmount", title: "Total Taxable Amt (₹)", readOnly: true,
      data: "TaxableValue",
      title: "Taxable Value (₹)",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "TotalTaxAmount",
      title: "Total Tax (₹)",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "InvoiceValue",
      title: "Invoice Value (₹)",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "ReverseCharge",
      title: "RCM",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
  ];

  // B2cs Columns
  const b2csColumns = [
    {
      data: "SupplyType",
      title: "Supply Type",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "PlaceOfSupply",
      title: "Place Of Supply",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "Rate",
      title: "Rate of Tax (₹)",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "TotalTaxableValue",
      title: "Total Taxable Value (₹)",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "IGSTAmount",
      title: "IGST (₹)",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "CGSTAmount",
      title: "CGST (₹)",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "SGSTAmount",
      title: "SGST (₹)",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },

    {
      data: "Cess",
      title: "Cess (₹)",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
  ];

  //AT/ATA/ATADJ/ATADJA Columns
  const atSummaryColumns = [
    {
      data: "SectionName",
      title: "Section Name",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "SupplyType",
      title: "Supply Type",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },

    {
      data: "PlaceOfSupply",
      title: "Place Of Supply",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "Rate",
      title: "Rate",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "GrossAdvanceAmount",
      title: "Gross advance amount",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "IGST",
      title: "IGST",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "CGST",
      title: "CGST",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "SGST",
      title: "SGST",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "Cess",
      title: "Cess",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
  ];

  const atAmedmentSummaryColumns = [
    {
      data: "SectionName",
      title: "Section Name",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "OriginalReturnPeriod",
      title: "Originally Return Period",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "SupplyType",
      title: "Supply Type",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "PlaceOfSupply",
      title: "Place Of Supply",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "Rate",
      title: "Rate (₹)",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "GrossAdvanceAmount",
      title: "Gross advance amount (₹)",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "IGST",
      title: "IGST (₹)",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "CGST",
      title: "CGST (₹)",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "SGST",
      title: "SGST (₹)",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "Cess",
      title: "Cess (₹)",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
  ];

  const atColumns = [
    // {
    //   data: "select",
    //   type: "checkbox",
    //   width: 20,
    //   readOnly: false,
    // },
    {
      data: "SheetName",
      title: "Section",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "RecipientGSTIN",
      title: "GSTIN",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "ReceiverName",
      title: "Party Name",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "InvoiceNumber",
      title: "Advance Receipt Number",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "InvoiceDate",
      title: "Advance Receipt Date",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      // data: "TotalTaxableAmount",
      // title: "Gross advance Received (₹)",
      data: checkInvoiceNumberAt,
      title: checkInvoiceNumberAtTitle,
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },

    {
      data: "TotalTaxAmount",
      title: "Total Tax (₹)",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },

    {
      data: "PlaceOfSupply",
      title: "Place Of Supply",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
  ];

  //CDNR/CDNRA/CDNUR/CDNURA
  const crDrInvalidColumns = [
    // {
    //   data: "select",
    //   type: "checkbox",
    //   width: 20,
    //   readOnly: false,
    // },
    {
      data: "RecipientGSTIN",
      title: "Buyer GSTIN",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "InvoiceNumber",
      title: "Invoice No",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "ReceiverName",
      title: "Vendor Name",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "InvoiceDate",
      title: "Invoice Date",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    // {
    //   data: "TotalTaxableAmount",
    //   title: "Total Taxable Amt (₹)",
    //   readOnly: true,
    //   columnSorting: {
    //     indicator: false,
    //     headerAction: false,
    //   },
    // },
    {
      data: "TaxableValue",
      title: "Taxable Value (₹)",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },

    {
      data: "TotalTaxAmount",
      title: "Total Tax(₹)",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "InvoiceValue",
      title: "Invoice Value (₹)",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "NoteType",
      title: "Document Type",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "ReverseCharge",
      title: "RCM",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    { data: "PurchaseId", title: "purchaseId" },
  ];

  const crDrInvalidColumnsEmpty = [
    // {
    //   data: "select",
    //   title: "",
    //   width: 1,
    //   readOnly: true,
    // },
    {
      data: "RecipientGSTIN",
      title: "Buyer GSTIN",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "InvoiceNumber",
      title: "Invoice No",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "ReceiverName",
      title: "Vendor Name",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "InvoiceDate",
      title: "Invoice Date",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    // {
    //   data: "TotalTaxableAmount",
    //   title: "Total Taxable Amt (₹)",
    //   readOnly: true,
    //   columnSorting: {
    //     indicator: false,
    //     headerAction: false,
    //   },
    // },
    {
      data: "TaxableValue",
      title: "Taxable Value (₹)",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },

    {
      data: "TotalTaxAmount",
      title: "Total Tax(₹)",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "InvoiceValue",
      title: "Invoice Value (₹)",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "NoteType",
      title: "Document Type",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "ReverseCharge",
      title: "RCM",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    { data: "PurchaseId", title: "purchaseId" },
  ];

  //HSN
  const hsnInvalidColumns = [

    {
      data: "HSN",
      title: "HSN",
      readOnly: true,

    },
    {
      data: "Description",
      title: "Description",
      readOnly: true,

      width: 100,
    },
    {
      data: "UQC",
      title: "Unit of Measurement",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "TotalQty",
      title: "Total Quantity",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },

    },
    {
      data: "TaxableValue",
      title: "Taxable Value (₹)",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "Rate",
      title: "Rate (₹)",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "TotalValue",
      title: "Total Value (₹)",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "IGST",
      title: "IGST (₹)",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "CGST",
      title: "CGST (₹)",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "SGST",
      title: "SGST (₹)",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "Cess",
      title: "Cess (₹)",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
  ];


  const hsnInvalidColumnsEmpty = [

    {
      data: "HSN",
      title: "HSN",
      readOnly: true,
      // columnSorting: {
      //   indicator: false,
      //   headerAction: false,
      // },
    },
    {
      data: "Description",
      title: "Description",
      readOnly: true,
      // columnSorting: {
      //   indicator: false,
      //   headerAction: false,
      // },
      width: 100,
    },
    {
      data: "UQC",
      title: "Unit of Measurement",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "TotalQty",
      title: "Total Quantity",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
      // readOnly: hsnQty
    },
    {
      data: "TaxableValue",
      title: "Taxable Value (₹)",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "Rate",
      title: "Rate (₹)",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "TotalValue",
      title: "Total Value (₹)",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "IGST",
      title: "IGST (₹)",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "CGST",
      title: "CGST (₹)",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "SGST",
      title: "SGST (₹)",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "Cess",
      title: "Cess (₹)",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },

  ];

  //DOC
  const DocColumns = [
    {
      data: "NatureOfDocument",
      title: "Nature of Document",
      readOnly: true,
    },
    {
      data: "SrNoFrom",
      title: "Sr.No.From",
      readOnly: true,
    },
    {
      data: "SrNoTo",
      title: "Sr.No.To",
      readOnly: true,
    },
    {
      data: "TotalNumber",
      title: "Total Number",
    },
    {
      data: "Cancelled",
      title: "Cancelled",
    },
    {
      data: "NetIssued",
      title: "Net Issued",
    },
  ];

  //Nil-Exempt
  const ExempColumn = [
    {
      data: "Description",
      title: "Description",
      readOnly: true,
    },

    {
      data: "NilRatedSupplies",
      title: "Nil Rated Supplies",
      readOnly: true,
    },
    {
      data: "Exempted",
      title: "Exempted(other than nil-rated/non GST supply)",
      readOnly: true,
    },
    {
      data: "NonGSTSupplies",
      title: "Non-GST supplies",
      readOnly: true,
    },
  ];

  let dropDonwNameAssign;

  if (activeTab == 1) {
    if (invalidColumns[currentCol1]?.data === "ReverseCharge") { //7
      dropDonwNameAssign = reverseCharge;
    }

  } else if (activeTab == 2) {
    if (crDrInvalidColumns[currentCol1crdr]?.data === "ReverseCharge") { //7
      dropDonwNameAssign = reverseCharge;
    } else if (crDrInvalidColumns[currentCol1crdr]?.data === "NoteType") { //6
      dropDonwNameAssign = creditDebit;
    }
  } else if (activeTab == 7) {

    if (B2CsInvalidColumns[currentCol1]?.data === "ReverseCharge") { //7
      dropDonwNameAssign = reverseCharge;
    }
  } else if (activeTab == 6) {

    if (atColumns[currentCol1]?.data === "PlaceOfSupply") { //7
      dropDonwNameAssign = placeOfSupply;
    }
  } else if (activeTab == 3) {

    if (hsnInvalidColumns[currentCol1crdr]?.data === "Rate") { //7
      dropDonwNameAssign = rate;
    } else if (hsnInvalidColumns[currentCol1crdr]?.data === "UQC") { //6
      dropDonwNameAssign = unitOfMeasurement;
    }
  }

  let dropDonwName = dropDonwNameAssign !== undefined && dropDonwNameAssign !== null ? dropDonwNameAssign : reverseCharge;


  function myBtns(instance, td, row, col, prop, value, cellProperties) {
    Handsontable.renderers.textRenderer.apply(this, arguments);

    td.innerHTML =
      '<button class="btn add-edit"><i class="fa fa-edit" title="Edit"></i></button><button class="btn add-deactive" title="Delete"><i class="fa fa-trash"></i></button>';

    const hot = hotRef?.current?.hotInstance;
    $(td)
      .find(".add-deactive")
      .on("click", (event) => {

        let { gstr1HSNId } = hot?.getSourceDataAtRow(cellProperties.row);
        deleteGSTR1HSNInvoice(gstr1HSNId);

      });

    $(td)
      .find(".add-edit")
      .on("click", (event) => {
        const { clientId } = hot?.getSourceDataAtRow(cellProperties.row);

        // console.log("edit data=", hot?.getSourceDataAtRow(cellProperties.row));
        let {
          gstr1HSNId,
          hsn,
          description,
          uqc,
          totalQty,
          taxableAmount,
          rate,
          totalValue,
          igst,
          cgst,
          sgst,
          cess,
        } = hot?.getSourceDataAtRow(cellProperties.row);
        // console.log(gstr1HSNId, "gstr1HSNId");

        setBlock(true);

        GSTR1FileDataAPIService.getHSNbyId(gstr1HSNId, G_UCParId)
          .then((res) => {
            // set filters

            if (
              res.status === 200 &&
              res.data.status === errorCodeConfig.APIDefaultCode.Success
            ) {
              //  console.log("hsn resp=", res?.data?.data);
              setBlock(false);

              let {
                gstr1HSNId,
                hsn,
                description,
                uqc,
                totalQty,
                taxableAmount,
                rate,
                totalValue,
                igst,
                cgst,
                sgst,
                cess,
              } = res?.data?.data;

              const newX = unitList?.filter((item) => item.value == uqc);

              // console.log('description' , description)
              setValue("hsn", hsn !== null && hsn !== "" ? hsn : "");
              setValue(
                "description",
                description !== null && description !== "" ? description : ""
              );
              setValue("uqc", newX);
              setValue(
                "totalQty",
                totalQty !== null && totalQty !== "" ? totalQty : ""
              );
              setValue(
                "taxableAmount",
                taxableAmount !== null && taxableAmount !== ""
                  ? taxableAmount
                  : ""
              );
              setValue("rate", rate !== null && rate !== "" ? rate : "");
              setValue(
                "totalValue",
                totalValue !== null && totalValue !== "" ? totalValue : ""
              );
              setValue("igst", igst !== null && igst !== "" ? igst : "");
              setValue("cgst", cgst !== null && cgst !== "" ? cgst : "");
              setValue("sgst", sgst !== null && sgst !== "" ? sgst : "");
              setValue("cess", cess !== null && cess !== "" ? cess : "");
              setValue("gstr1HSNId", gstr1HSNId);

              setHsnShow(true);

            } else {
              setBlock(false);
              Swal.fire({
                icon: "error",
                title: "",
                text: res.headers.errormessage,
              });
              // setData([])
            }
          })
          .catch((error) => {
            setBlock(false);
            Swal.fire({
              icon: "error",
              title: "",
              text: error?.message,
            });
          });


      });
  }

  function myBtnsofDocs(instance, td, row, col, prop, value, cellProperties) {
    textRenderer.apply(this, arguments);

    td.innerHTML =
      '<button class="btn add-deactive" title="Delete"><i class="fa fa-trash"></i></button>';

    const hot = hotRefInputCredit?.current?.hotInstance;
    $(td)
      .find(".add-deactive")
      .on("click", (event) => {
        // console.log("click delete of Docs");
        //  console.log(hot?.getSourceDataAtRow(cellProperties.row))
        let { Gstr1FiledDocsId } = hot?.getSourceDataAtRow(cellProperties.row);

        deleteGSRT1DocsDetails(Gstr1FiledDocsId);

      });

    $(td)
      .find(".add-edit")
      .on("click", (event) => {
        const { clientId } = hot?.getSourceDataAtRow(cellProperties.row);

        let {
          gstr1DocsId,
          natureOfDocument,
          srNoFrom,
          srNoTo,
          totalNumber,
          cancelled,
          netIssued,
        } = hot?.getSourceDataAtRow(cellProperties.row);

        // console.log(gstr1DocsId, "edit data=");

        setBlock(true);

        GSTR1FileDataAPIService.getDocById(gstr1DocsId, G_UCParId)
          .then((res) => {
            // set filters

            if (
              res.status === 200 &&
              res.data.status === errorCodeConfig.APIDefaultCode.Success
            ) {

              setBlock(false);

              let {
                gstr1DocsId,
                natureOfDocument,
                srNoFrom,
                srNoTo,
                totalNumber,
                cancelled,
                netIssued,
              } = res?.data?.data;
              const optionValueEditable =
                typeofDocument.filter((e) => e.value == natureOfDocument)?.[0]
                  ?.label || "";
              console.log(optionValueEditable, "optionValueEditable");
              setValue(
                "natureOfDocument",
                natureOfDocument !== null &&
                  natureOfDocument !== "" &&
                  optionValueEditable
                  ? { label: optionValueEditable, value: natureOfDocument }
                  : ""
              );
              setValue(
                "srNoFrom",
                srNoFrom !== null && srNoFrom !== "" ? srNoFrom : ""
              );
              setValue(
                "srNoTo",
                srNoTo !== null && srNoTo !== "" ? srNoTo : ""
              );
              setValue(
                "totalNumber",
                totalNumber !== null && totalNumber !== "" ? totalNumber : ""
              );
              setValue(
                "cancelled",
                cancelled !== null && cancelled !== "" ? cancelled : ""
              );
              setValue(
                "netIssued",
                netIssued !== null && netIssued !== "" ? netIssued : ""
              );
              setValue("gstr1DocsId", gstr1DocsId);

              setDocShow(true);

            } else {
              setBlock(false);
              Swal.fire({
                icon: "error",
                title: "",
                text: res.headers.errormessage,
              });
              // setData([])
            }
          })
          .catch((error) => {
            setBlock(false);
            Swal.fire({
              icon: "error",
              title: "",
              text: error?.message,
            });
          });
      });
  }

  let finYear = null;
  let finMonth = null;
  let url = null;
  let gstrfiledDataDetailState = null;
  let alreadyUploaded = null;

  // console.log(location?.state,"location?.state")
  
  let paramsEncoded = window.location.href.split('?');

  if (location.state !== null) {

    finYear =
      location.state.finyear !== null &&
        location.state.finyear !== "null" &&
        (gstr1FiledFromDt == null || gstr1FiledFromDt == undefined)
        ? location.state.finyear
        : gstr1FiledFromDt;
    finMonth =
      location.state.finmonth !== null &&
        location.state.finmonth !== "null" &&
        (gstr1FiledToDt == null || gstr1FiledToDt == undefined)
        ? location.state.finmonth
        : gstr1FiledToDt;
    url =
      location.state.sectionId !== null && location.state.sectionId !== "null"
        ? location.state.sectionId
        : "";
    gstrfiledDataDetailState =
      location.state.gstrfiledDataDetailState !== null &&
        location.state.gstrfiledDataDetailState !== "null"
        ? location.state.gstrfiledDataDetailState
        : null;
  } else {


    if (paramsEncoded[1]) {
      // const setUrl = searchParams[0].replaceAll(" ", "+");
      const decrptyUrl = encryptData.decrypt(paramsEncoded[1]);
      const queryStr = decrptyUrl?.split("&");
      url = queryStr[0]?.split("=")[1];
      finYear = queryStr[3]?.split("=")[1];
      finMonth = queryStr[4]?.split("=")[1];
      alreadyUploaded = queryStr[5]?.split("=")[1];

    }

  }



  useEffect(() => {
    setPanData(YearList);
    setPanDataFrom(YearList);
  }, []);

  useEffect(() => {
    setbtnDisable1(false);
    console.log("display Search " + displayType);

    if (displayType == true || displayType == "true") {
      const defaultValueFrom = panData?.filter(
        (item) => item.value == finYear
      )[0];
      const defaultValueTo = panData?.filter(
        (item) => item.value == finMonth
      )[0];

      if (
        defaultValueFrom !== undefined &&
        defaultValueFrom !== null &&
        defaultValueFrom !== ""
      ) {
        setFinFormYear(defaultValueFrom);
      }
      if (
        defaultValueTo !== undefined &&
        defaultValueTo !== null &&
        defaultValueTo !== ""
      ) {
        setMonthFrom(defaultValueTo);
      }

      setSearchApi(true);
    } else {
      if (gstr1FiledFromDt == null || gstr1FiledFromDt == "" || gstr1FiledFromDt == undefined) {
        navigate(urlEndpointConfig.GSTR1_FILED_REPORT)
      }
    }
  }, [displayType, activeTab]);

  const selectFromYear = (value) => {
    setPage(0);
    setFinFormYear(value);
    setErrorMsg("");
    const monthFr = monthFrom?.srNo > value?.srNo ? monthFrom : panDataFrom[0];
    setMonthFrom(monthFr);
    const x = panDataFrom?.filter(
      (item) => Number(item.srNo) >= Number(value.srNo)
    );
    setPanData(x);

    let invType = null;
    if (activeTab == 1) {
      invType = count == 1 ? url : invoceTypes?.value;
    } else if (activeTab == 7) {
      invType = count == 1 ? url : b2csInvoiceType?.value;
    } else if (activeTab == 6) {
      invType = count == 1 ? url : atInvoiceType?.value;
    } else {
      invType = count == 1 ? url : crdrInvoiceType?.value;
    }

    // const invType = count == 1 ? url : invoceTypes?.value
    console.log(invType);

    //** ITC Tab
    // if (activeTab == 4) {
    if (activeTab == 11) {
      CompareMonth(value?.value, monthFr?.value); // From and To
      // ItcSearch(value?.value, monthFr?.value)
    } else if (activeTab == 5) {
      CompareMonth(value?.value, monthFr?.value); // From and To
      // getExempList(value?.value, monthFr?.value)
      gstr1FiledSummaryList(
        activeTab,
        "",
        "",
        activeTab == 3 ? "0" : invType,
        value?.value,
        monthFr?.value,
        refershData
      );
    } else {
      gstr1FiledSummaryList(
        activeTab,
        "",
        "",
        activeTab == 3 ? "0" : invType,
        value?.value,
        monthFr?.value,
        refershData
      );
    }
  };

  const selectFromMonth = (value) => {
    setPage(0);
    setErrorMsg("");
    setMonthFrom(value);

    let invType = null;
    if (activeTab == 1) {
      invType = count == 1 ? url : invoceTypes?.value;
    } else if (activeTab == 7) {
      invType = count == 1 ? url : b2csInvoiceType?.value;
    } else if (activeTab == 6) {
      invType = count == 1 ? url : atInvoiceType?.value;
    } else {
      invType = count == 1 ? url : crdrInvoiceType?.value;
    }

    if (Number(finFromYear?.srNo) > Number(value?.srNo)) {
      const fromFilter = panDataFrom?.filter(
        (item) => Number(item.srNo) == Number(value.srNo)
      )[0];
      setFinFormYear(fromFilter);
    }

    //** ITC Tab
    // if (activeTab == 4) {
    if (activeTab == 11) {
      CompareMonth(finFromYear?.value, value?.value); // From and To
      // ItcSearch(finFromYear?.value, value?.value)
    } else if (activeTab == 5) {
      CompareMonth(finFromYear?.value, value?.value); // From and To
      // getExempList(finFromYear?.value, value?.value)
      gstr1FiledSummaryList(
        activeTab,
        "",
        "",
        activeTab == 3 ? "0" : invType,
        finFromYear?.value,
        value?.value,
        refershData
      );
    } else {
      gstr1FiledSummaryList(
        activeTab,
        "",
        "",
        activeTab == 3 ? "0" : invType,
        finFromYear?.value,
        value?.value,
        refershData
      );
    }
  };

  useEffect(() => {
    if (
      sessionStorage.getItem(globleVariable.isCompany) == false ||
      sessionStorage.getItem(globleVariable.isCompany) == "false"
    ) {
      toast.error(LINK_MESSAGE, {
        position: "top-right",
      });

      setTimeout(() => {
        navigate("/dashboard/company");
      }, 1000);
    }
  }, []);

  // ** Get data on mount
  useEffect(() => {
    console.log("re-render", searchApi);
    if (searchApi == true) {


      searchUrlValue = url;
      // decryptData?.decrypt(id)
      let invType = null;

      if (activeTab == 1) {
        if (url == "17" || url == "18" || url == "19") {
          invType = "1";
        } else {
          invType =
            invoceTypes?.value !== null &&
              invoceTypes?.value !== "" &&
              invoceTypes?.value !== undefined
              ? invoceTypes?.value
              : url;
        }
      } else if (activeTab == 7) {
        if (url == "17" || url == "18" || url == "19") {
          invType = "5";
        } else {
          invType =
            b2csInvoiceType?.value !== null &&
              b2csInvoiceType?.value !== "" &&
              b2csInvoiceType?.value !== undefined
              ? b2csInvoiceType?.value
              : url;
        }
      } else if (activeTab == 6) {
        if (url == "17" || url == "18" || url == "19") {
          invType = "13";
        } else {
          invType =
            atInvoiceType?.value !== null &&
              atInvoiceType?.value !== "" &&
              atInvoiceType?.value !== undefined
              ? atInvoiceType?.value
              : url;
        }
      } else {
        if (url == "17" || url == "18" || url == "19") {
          invType = "7";
        } else {
          invType =
            crdrInvoiceType?.value !== null &&
              crdrInvoiceType?.value !== "" &&
              crdrInvoiceType?.value !== undefined
              ? crdrInvoiceType?.value
              : url;
        }
      }

      // ** ITC
      if (activeTab == 11) {
        // if (activeTab == 4) {
        CompareMonth(finFromYear?.value, monthFrom?.value);
        // ItcSearch(finFromYear?.value, monthFrom?.value)
      } else if (activeTab == 5) {
        CompareMonth(finFromYear?.value, monthFrom?.value);
        // getExempList(finFromYear?.value, monthFrom?.value)
        gstr1FiledSummaryList(
          activeTab,
          "",
          "",
          activeTab == 3 ? "0" : invType,
          finFromYear?.value,
          monthFrom?.value,
          refershData
        );
      } else {
        //  activeTab == 3 ? 11 : activeTab == 5 ? 9 : activeTab == 4 ? 10 : invoceTypes.value
        gstr1FiledSummaryList(
          activeTab,
          "",
          "",
          activeTab == 3 ? "0" : invType,
          finFromYear?.value,
          monthFrom?.value,
          ""
        );
      }
    }
  }, [searchApi, activeTab]);

  useEffect(() => {
    // console.log("searchVal1", searchVal1.length);
    if (serverSidePage == true) {
      // const invType = count == 1 ? url : invoceTypes?.value

      let invType = null;
      if (activeTab == 1) {
        invType = count == 1 ? url : invoceTypes?.value;
      } else if (activeTab == 7) {
        invType = count == 1 ? url : b2csInvoiceType?.value;
      } else if (activeTab == 6) {
        invType = count == 1 ? url : atInvoiceType?.value;
      } else {
        invType = count == 1 ? url : crdrInvoiceType?.value;
      }
      // gstr1FiledSummaryList(
      //   activeTab,
      //   "",
      //   "",
      //   activeTab == 3 ? "0" : invType,
      //   finFromYear?.value,
      //   monthFrom?.value,
      //   ""
      // );
    }
  }, [searchVal1, serverSidePage]);

  useEffect(() => {
    setCurrentCol([]);
    setCurrentCol1();
    setSearchVal1([]);
    setCurrentColcrdr([]);
    setCurrentCol1crdr();
    setCurrentColb2cs([]);
    setCurrentCol1b2cs();
    setSearchValcrdr([]);
    setSearchValb2cs([]);
    setCurrentColdoc([]);
    setCurrentCol1doc([]);
    setSearchValdoc([]);
    setGridCustomFilter([]);
    setFilterDropDownList({
      rateDropDownList: [],
      rcmDropDownList: [],
      noteTypeDropDownList: [],
      posDropDownList: [],
      uqcDropDownList: [],

    });
    setRowsPerPage(PageSize);
    setPageNoSelect(paginationList[0]);

  }, [activeTab]);

  let addArray1 = [];
  useEffect(() => {
    // set Value
    if (showList == true && invoiceTypeList) {
      const filterInv = invoiceTypeList?.filter((p) => p.value == url);
      const filterInvb2CS = b2csInvoiceTypeList?.filter((p) => p.value == url);
      const filterInvAt = atInvoiceTypeList?.filter((p) => p.value == url);
      const filterInvCrdr = crdrInvoiceTypeList?.filter((p) => p.value == url);
      //const filterInvAdvPayment = sectionAdvPaymentList?.filter(p => p.value == url);
      console.log(filterInv, "filterInv");

      if (filterInv?.length > 0) {
        setInvoceTypes(filterInv[0]);
      } else {
        setInvoceTypes(invoiceTypeList[0]);
      }

      if (filterInvb2CS?.length > 0) {
        setB2csInvoiceType(filterInvb2CS[0]);
      } else {
        setB2csInvoiceType(b2csInvoiceTypeList[0]);
      }
      if (filterInvAt?.length > 0) {
        setAtInvoiceType(filterInvAt[0]);
      } else {
        setAtInvoiceType(atInvoiceTypeList[0]);
      }
      if (filterInvCrdr?.length > 0) {
        setCrDrInvoiceType(filterInvCrdr[0]);
      } else {
        setCrDrInvoiceType(crdrInvoiceTypeList[0]);
      }
    }
  }, [showList]);

  const toggleTab = (tab) => {

    setCurrentCol([]);
    setCurrentCol1();
    setSearchVal1([]);
    setCurrentColcrdr([]);
    setCurrentCol1crdr();
    setCurrentColb2cs([]);
    setCurrentCol1b2cs();
    setSearchValcrdr([]);
    setSearchValb2cs([]);
    setCurrentColdoc([]);
    setCurrentCol1doc([]);
    setSearchValdoc([]);
    setActiveTab(tab);
    setGridCustomFilter([])
    setPageNoSelect(paginationList[0]);
    setFilterDropDownList({
      rateDropDownList: [],
      rcmDropDownList: [],
      noteTypeDropDownList: [],
      posDropDownList: [],
      uqcDropDownList: [],

    });
    setRowsPerPage(PageSize)
    setSearchDate('');
    setToDate('');
    setFromAmount('');
    setToAmount('');
    setFromValue('');
    setToValue('');
    setFromTax('')
    setToTax('');
    var addArray = [];
    var craddArray = [];
    isChecked = false;

    const filterInv = invoiceTypeList.filter((p) => p.value == url);
    const filterInvCrdr = crdrInvoiceTypeList.filter((p) => p.value == url);
    const filterInvB2cs = b2csInvoiceTypeList?.filter((p) => p.value == url);
    const filterInvAt = atInvoiceTypeList?.filter((p) => p.value == url);

    if (tab == 1) {
      if (filterInv.length > 0) {
        setInvoceTypes(filterInv[0]);
      } else {
        setInvoceTypes(invoiceTypeList[0]);
      }
    } else if (tab == 7) {
      if (filterInvB2cs?.length > 0) {
        setB2csInvoiceType(filterInvB2cs[0]);
      } else {
        setB2csInvoiceType(b2csInvoiceTypeList[0]);
      }
    } else if (tab == 6) {
      if (filterInvAt?.length > 0) {
        setAtInvoiceType(filterInvAt[0]);
      } else {
        setAtInvoiceType(atInvoiceTypeList[0]);
      }
    } else {
      if (filterInvCrdr.length > 0) {
        setCrDrInvoiceType(filterInvCrdr[0]);
      } else {
        setCrDrInvoiceType(crdrInvoiceTypeList[0]);
      }
    }

    setPage(0);
    setDisplayType(true);
  };

  const actualData = (activeTabs = 0, searchType = 0) => {

    console.log(gstrfiledDataDetailState, gstrfiledDataDetailStateData, "gstrfiledDataDetailStatex");

    if (gstrfiledDataDetailStateData !== undefined && gstrfiledDataDetailStateData !== null) {
      gstrfiledDataDetailState = gstrfiledDataDetailStateData
    }

    let tableDataArr = [];
    let symmaryTableDataArr = [];
    if (activeTabs == 1 || activeTab == 1) {
      if (searchType == 1) {
        tableDataArr =
          gstrfiledDataDetailState && gstrfiledDataDetailState.B2B.length > 0
            ? gstrfiledDataDetailState.B2B
            : GSTR1FiledMOckData && GSTR1FiledMOckData.B2B.length > 0
              ? GSTR1FiledMOckData?.B2B
              : [];
      } else if (searchType == 2) {
        tableDataArr =
          gstrfiledDataDetailState && gstrfiledDataDetailState.B2BA.length > 0
            ? gstrfiledDataDetailState.B2BA
            : GSTR1FiledMOckData && GSTR1FiledMOckData.B2BA.length > 0
              ? GSTR1FiledMOckData?.B2BA
              : [];
      } else if (searchType == 3) {
        tableDataArr =
          gstrfiledDataDetailState && gstrfiledDataDetailState.B2CL.length > 0
            ? gstrfiledDataDetailState.B2CL
            : GSTR1FiledMOckData && GSTR1FiledMOckData.B2CL.length > 0
              ? GSTR1FiledMOckData?.B2CL
              : [];
      } else if (searchType == 4) {
        tableDataArr =
          gstrfiledDataDetailState && gstrfiledDataDetailState.B2CLA.length > 0
            ? gstrfiledDataDetailState.B2CLA
            : GSTR1FiledMOckData && GSTR1FiledMOckData.B2CLA.length > 0
              ? GSTR1FiledMOckData?.B2CLA
              : [];
      } else if (searchType == 11) {
        tableDataArr =
          gstrfiledDataDetailState && gstrfiledDataDetailState.EXP.length > 0
            ? gstrfiledDataDetailState.EXP
            : GSTR1FiledMOckData && GSTR1FiledMOckData.EXP.length > 0
              ? GSTR1FiledMOckData?.EXP
              : [];
      } else if (searchType == 12) {
        tableDataArr =
          gstrfiledDataDetailState && gstrfiledDataDetailState.EXPA.length > 0
            ? gstrfiledDataDetailState.EXPA
            : GSTR1FiledMOckData && GSTR1FiledMOckData.EXPA.length > 0
              ? GSTR1FiledMOckData?.EXPA
              : [];
      }


    } else if (activeTabs == 2 || activeTab == 2) {
      if (searchType == 7) {
        tableDataArr =
          gstrfiledDataDetailState && gstrfiledDataDetailState.CDNR.length > 0
            ? gstrfiledDataDetailState.CDNR
            : GSTR1FiledMOckData && GSTR1FiledMOckData.CDNR.length > 0
              ? GSTR1FiledMOckData?.CDNR
              : [];
      } else if (searchType == 8) {
        tableDataArr =
          gstrfiledDataDetailState && gstrfiledDataDetailState.CDNRA.length > 0
            ? gstrfiledDataDetailState.CDNRA
            : GSTR1FiledMOckData && GSTR1FiledMOckData.CDNRA.length > 0
              ? GSTR1FiledMOckData?.CDNRA
              : [];
      } else if (searchType == 9) {
        tableDataArr =
          gstrfiledDataDetailState && gstrfiledDataDetailState.CDNUR.length > 0
            ? gstrfiledDataDetailState.CDNUR
            : GSTR1FiledMOckData && GSTR1FiledMOckData.CDNUR.length > 0
              ? GSTR1FiledMOckData?.CDNUR
              : [];
      } else if (searchType == 10) {
        tableDataArr =
          gstrfiledDataDetailState && gstrfiledDataDetailState.CDNURA.length > 0
            ? gstrfiledDataDetailState.CDNURA
            : GSTR1FiledMOckData && GSTR1FiledMOckData.CDNURA.length > 0
              ? GSTR1FiledMOckData?.CDNURA
              : [];
      }

    } else if (activeTabs == 7 || activeTab == 7) {
      if (searchType == 5) {
        tableDataArr =
          gstrfiledDataDetailState && gstrfiledDataDetailState.B2CS.length > 0
            ? gstrfiledDataDetailState.B2CS
            : GSTR1FiledMOckData && GSTR1FiledMOckData.B2CS.length > 0
              ? GSTR1FiledMOckData?.B2CS
              : [];
        symmaryTableDataArr =
          gstrfiledDataDetailState &&
            gstrfiledDataDetailState.B2CSSummary &&
            gstrfiledDataDetailState.B2CSSummary !== null &&
            gstrfiledDataDetailState.B2CSSummary.length > 0
            ? gstrfiledDataDetailState.B2CSSummary
            : GSTR1FiledMOckData && GSTR1FiledMOckData.B2CSSummary.length > 0
              ? GSTR1FiledMOckData?.B2CSSummary
              : [];
      } else if (searchType == 6) {
        tableDataArr =
          gstrfiledDataDetailState && gstrfiledDataDetailState.B2CSA.length > 0
            ? gstrfiledDataDetailState.B2CSA
            : GSTR1FiledMOckData && GSTR1FiledMOckData.B2CSA.length > 0
              ? GSTR1FiledMOckData?.B2CSA
              : [];
        symmaryTableDataArr =
          gstrfiledDataDetailState &&
            gstrfiledDataDetailState.B2CSASummary &&
            gstrfiledDataDetailState.B2CSASummary !== null &&
            gstrfiledDataDetailState.B2CSASummary.length > 0
            ? gstrfiledDataDetailState.B2CSASummary
            : GSTR1FiledMOckData && GSTR1FiledMOckData.B2CSASummary.length > 0
              ? GSTR1FiledMOckData?.B2CSASummary
              : [];
      }

    } else if (activeTabs == 6 || activeTab == 6) {
      if (searchType == 13) {
        tableDataArr =
          gstrfiledDataDetailState && gstrfiledDataDetailState.AT.length > 0
            ? gstrfiledDataDetailState.AT
            : GSTR1FiledMOckData && GSTR1FiledMOckData.AT.length > 0
              ? GSTR1FiledMOckData?.AT
              : [];
        symmaryTableDataArr =
          gstrfiledDataDetailState &&
            gstrfiledDataDetailState.ATSummary &&
            gstrfiledDataDetailState.ATSummary !== null &&
            gstrfiledDataDetailState.ATSummary.length > 0
            ? gstrfiledDataDetailState.ATSummary
            : GSTR1FiledMOckData && GSTR1FiledMOckData.ATSummary.length > 0
              ? GSTR1FiledMOckData?.ATSummary
              : [];
      } else if (searchType == 14) {
        tableDataArr =
          gstrfiledDataDetailState && gstrfiledDataDetailState.ATA.length > 0
            ? gstrfiledDataDetailState.ATA
            : GSTR1FiledMOckData && GSTR1FiledMOckData.ATA.length > 0
              ? GSTR1FiledMOckData?.ATA
              : [];

        symmaryTableDataArr =
          gstrfiledDataDetailState &&
            gstrfiledDataDetailState.ATASummary &&
            gstrfiledDataDetailState.ATASummary !== null &&
            gstrfiledDataDetailState.ATASummary.length > 0
            ? gstrfiledDataDetailState.ATASummary
            : GSTR1FiledMOckData && GSTR1FiledMOckData.ATASummary.length > 0
              ? GSTR1FiledMOckData?.ATASummary
              : [];
      } else if (searchType == 15) {
        tableDataArr =
          gstrfiledDataDetailState && gstrfiledDataDetailState.ATADJ.length > 0
            ? gstrfiledDataDetailState.ATADJ
            : GSTR1FiledMOckData && GSTR1FiledMOckData.ATADJ.length > 0
              ? GSTR1FiledMOckData?.ATADJ
              : [];

        symmaryTableDataArr =
          gstrfiledDataDetailState &&
            gstrfiledDataDetailState.ATADJSummary &&
            gstrfiledDataDetailState.ATADJSummary !== null &&
            gstrfiledDataDetailState.ATADJSummary.length > 0
            ? gstrfiledDataDetailState.ATADJSummary
            : GSTR1FiledMOckData && GSTR1FiledMOckData.ATADJSummary.length > 0
              ? GSTR1FiledMOckData?.ATADJSummary
              : [];
      } else if (searchType == 16) {
        tableDataArr =
          gstrfiledDataDetailState && gstrfiledDataDetailState.ATADJA.length > 0
            ? gstrfiledDataDetailState.ATADJA
            : GSTR1FiledMOckData && GSTR1FiledMOckData.ATADJA.length > 0
              ? GSTR1FiledMOckData?.ATADJA
              : [];

        symmaryTableDataArr =
          gstrfiledDataDetailState &&
            gstrfiledDataDetailState.ATADJASummary &&
            gstrfiledDataDetailState.ATADJASummary !== null &&
            gstrfiledDataDetailState.ATADJASummary.length > 0
            ? gstrfiledDataDetailState.ATADJASummary
            : GSTR1FiledMOckData && GSTR1FiledMOckData.ATADJASummary.length > 0
              ? GSTR1FiledMOckData?.ATADJASummary
              : [];
      }

    } else if (activeTabs == 5 || activeTab == 5) {
      if (searchType == 7) {
        tableDataArr =
          gstrfiledDataDetailState && gstrfiledDataDetailState.EXEMP.length > 0
            ? gstrfiledDataDetailState.EXEMP
            : GSTR1FiledMOckData && GSTR1FiledMOckData.EXEMP.length > 0
              ? GSTR1FiledMOckData?.EXEMP
              : [];
      }

    } else if (activeTabs == 4 || activeTab == 4) {
      if (searchType == 7) {
        tableDataArr =
          gstrfiledDataDetailState && gstrfiledDataDetailState.DOCS?.length > 0
            ? gstrfiledDataDetailState.DOCS
            : GSTR1FiledMOckData && GSTR1FiledMOckData.DOCS.length > 0
              ? GSTR1FiledMOckData?.DOCS
              : [];
      }

    } else if (activeTabs == 3 || activeTab == 3) {
      if (searchType == 0) {
        tableDataArr =
          gstrfiledDataDetailState && gstrfiledDataDetailState.HSN.length > 0
            ? gstrfiledDataDetailState.HSN
            : GSTR1FiledMOckData && GSTR1FiledMOckData.HSN.length > 0
              ? GSTR1FiledMOckData?.HSN
              : [];
      }

    }
    return { tableDataArr, symmaryTableDataArr };
  };

  function FilterData(arr) {

    let addArr = [];
    var flag = false;
    let updatedData = [];
    let finalObj = {};
    console.log(arr, 'partFilter')
    // ** date format
    if (arr?.length) {
      for (let i = 0; i < arr.length; i++) {
        Object.assign(finalObj, arr[i]);
      }
    }

    // console.log(activeTab ,  docInvoiceType.value , " docInvoiceType.value" )
    const mapArrRate = arr?.map(type => Number(type?.Rate))
    const mapArrRCM = arr?.map(type => type?.ReverseCharge)
    const mapArrNote = arr?.map(type => type?.NoteType)
    const mapArrpos = arr?.map(type => type?.PlaceOfSupply)
    const mapArrUqc = arr?.map(type => type?.UQC)


    let searchType =
      activeTab == 1
        ? invoceTypes?.value
        : activeTab == 2
          ? crdrInvoiceType?.value
          : activeTab == 4
            ? "7"
            : activeTab == 7
              ? b2csInvoiceType?.value
              : activeTab == 6
                ? atInvoiceType?.value
                : 0;

    let { tableDataArr } = actualData(0, searchType);

    updatedData = tableDataArr
      .filter((itemGSTIN) =>
        finalObj.RecipientGSTIN?.length
          ? itemGSTIN?.RecipientGSTIN?.toLowerCase().includes(
            finalObj?.RecipientGSTIN?.toLowerCase()
          )
          : itemGSTIN
      )
      .filter((itemReceiverName) =>
        finalObj.ReceiverName?.length
          ? itemReceiverName?.ReceiverName?.toLowerCase().includes(
            finalObj?.ReceiverName?.toLowerCase()
          )
          : itemReceiverName
      )
      .filter((itemInvoiceNo) =>
        finalObj.InvoiceNumber?.length
          ? itemInvoiceNo?.InvoiceNumber?.toLowerCase().includes(
            finalObj?.InvoiceNumber?.toLowerCase()
          )
          : itemInvoiceNo
      )
      .filter((itemInvoiceDate) => {
        if (finalObj?.InvoiceDate?.length) {
          const [a, b] = finalObj?.InvoiceDate?.split("to")
          const startDate = moment(a, 'YYYY-MM-DD');
          const toDate = moment(b, 'YYYY-MM-DD');
          const invoiceDate = moment(itemInvoiceDate?.InvoiceDate, 'DD-MM-YYYY');
          return invoiceDate.isBetween(startDate, toDate, null, '[]');
        }
        else {
          return itemInvoiceDate
        }
      })
      .filter((itemTotalTaxAmount) => {
        if (finalObj?.TotalTaxableAmount?.length) {
          const [a, b] = finalObj?.TotalTaxableAmount?.split("to");
          const fromValue = parseFloat(a.trim());
          const toValue = parseFloat(b.trim());
          const TaxableValue = parseFloat(itemTotalTaxAmount?.TotalTaxableAmount);

          if (!isNaN(TaxableValue)) {
            if (!isNaN(fromValue) && !isNaN(toValue)) {
              return TaxableValue >= fromValue && TaxableValue <= toValue;
            }
            else if (!isNaN(fromValue)) {
              return TaxableValue >= fromValue;
            }
            else {
              return TaxableValue <= toValue;
            }
          }
        }
        return true;
      })
      .filter((itemTotalTaxAmount) => {
        if (finalObj?.TotalTaxAmount?.length) {
          const [a, b] = finalObj?.TotalTaxAmount?.split("to");
          const fromValue = parseFloat(a.trim());
          const toValue = parseFloat(b.trim());
          const TaxableValue = parseFloat(itemTotalTaxAmount?.TotalTaxAmount);

          if (!isNaN(TaxableValue)) {
            if (!isNaN(fromValue) && !isNaN(toValue)) {
              return TaxableValue >= fromValue && TaxableValue <= toValue;
            }
            else if (!isNaN(fromValue)) {
              return TaxableValue >= fromValue;
            }
            else {
              return TaxableValue <= toValue;
            }
          }
        }
        return true;
      })
      .filter((itemInvoiceValue) => {
        if (finalObj?.InvoiceValue?.length) {
          const [a, b] = finalObj?.InvoiceValue?.split("to");
          const fromValue = parseFloat(a.trim());
          const toValue = parseFloat(b.trim());
          const TaxableValue = parseFloat(itemInvoiceValue?.InvoiceValue);

          if (!isNaN(TaxableValue)) {
            if (!isNaN(fromValue) && !isNaN(toValue)) {
              return TaxableValue >= fromValue && TaxableValue <= toValue;
            }
            else if (!isNaN(fromValue)) {
              return TaxableValue >= fromValue;
            }
            else {
              return TaxableValue <= toValue;
            }
          }
        }
        return true;
      })
      .filter((item) => {
        if (finalObj?.GrossAdvanceAdjusted?.length) {
          const [a, b] = finalObj?.GrossAdvanceAdjusted?.split("to");
          const fromValue = parseFloat(a.trim());
          const toValue = parseFloat(b.trim());
          const TaxableValue = parseFloat(item?.GrossAdvanceAdjusted);

          if (!isNaN(TaxableValue)) {
            if (!isNaN(fromValue) && !isNaN(toValue)) {
              return TaxableValue >= fromValue && TaxableValue <= toValue;
            }
            else if (!isNaN(fromValue)) {
              return TaxableValue >= fromValue;
            }
            else {
              return TaxableValue <= toValue;
            }
          }
        }
        return true;
      }).filter((item) => {
        if (finalObj?.GrossAdvanceReceived?.length) {
          const [a, b] = finalObj?.GrossAdvanceReceived?.split("to");
          const fromValue = parseFloat(a.trim());
          const toValue = parseFloat(b.trim());
          const TaxableValue = parseFloat(item?.GrossAdvanceReceived);

          if (!isNaN(TaxableValue)) {
            if (!isNaN(fromValue) && !isNaN(toValue)) {
              return TaxableValue >= fromValue && TaxableValue <= toValue;
            }
            else if (!isNaN(fromValue)) {
              return TaxableValue >= fromValue;
            }
            else {
              return TaxableValue <= toValue;
            }
          }
        }
        return true;
      })
      .filter((itemReverseCharge) =>
        finalObj.ReverseCharge?.length ?
          mapArrRCM?.includes(itemReverseCharge['ReverseCharge']) : itemReverseCharge
      )
      .filter((item) =>
        finalObj.PlaceOfSupply?.length ?
          mapArrpos?.includes(item['PlaceOfSupply']) : item
      )
      .filter((item) =>
        finalObj.NoteType?.length ?
          mapArrNote?.includes(item['NoteType']) : item
      )
      .filter((itemHSN) =>
        finalObj.HSN?.length
          ? itemHSN?.HSN?.toLowerCase().includes(finalObj?.HSN?.toLowerCase())
          : itemHSN
      )
      .filter((itemDesc) =>
        finalObj.Description?.length
          ? itemDesc?.Description?.toLowerCase().includes(
            finalObj?.Description?.toLowerCase()
          )
          : itemDesc
      )
      .filter((item) =>
        finalObj.UQC?.length ?
          mapArrUqc?.includes(item['UQC']) : item
      )
      .filter((item) => {
        if (finalObj?.TotalQty?.length) {
          const [a, b] = finalObj?.TotalQty?.split("to");
          const fromValue = parseFloat(a.trim());
          const toValue = parseFloat(b.trim());
          const rangeValue = parseFloat(item?.TotalQty);

          if (!isNaN(rangeValue)) {
            if (!isNaN(fromValue) && !isNaN(toValue)) {
              return rangeValue >= fromValue && rangeValue <= toValue;
            }
            else if (!isNaN(fromValue)) {
              return rangeValue >= fromValue;
            }
            else {
              return rangeValue <= toValue;
            }
          }
        }
        return true;
      })
      .filter((item) => {
        if (finalObj?.TaxableAmount?.length) {
          const [a, b] = finalObj?.TaxableAmount?.split("to");
          const fromValue = parseFloat(a.trim());
          const toValue = parseFloat(b.trim());
          const TaxableValue = parseFloat(item?.TaxableAmount);

          if (!isNaN(TaxableValue)) {
            if (!isNaN(fromValue) && !isNaN(toValue)) {
              return TaxableValue >= fromValue && TaxableValue <= toValue;
            }
            else if (!isNaN(fromValue)) {
              return TaxableValue >= fromValue;
            }
            else {
              return TaxableValue <= toValue;
            }
          }
        }
        return true;
      })
      .filter((item) =>
        finalObj.Rate?.length ?
          mapArrRate?.includes(Number(item['Rate'])) : item
      )
      .filter((item) => {
        if (finalObj?.TotalValue?.length) {
          const [a, b] = finalObj?.TotalValue?.split("to");
          const fromValue = parseFloat(a.trim());
          const toValue = parseFloat(b.trim());
          const TaxableValue = parseFloat(item?.TotalValue);

          if (!isNaN(TaxableValue)) {
            if (!isNaN(fromValue) && !isNaN(toValue)) {
              return TaxableValue >= fromValue && TaxableValue <= toValue;
            }
            else if (!isNaN(fromValue)) {
              return TaxableValue >= fromValue;
            }
            else {
              return TaxableValue <= toValue;
            }
          }
        }
        return true;
      })
      .filter((item) => {
        if (finalObj?.IGST?.length) {
          const [a, b] = finalObj?.IGST?.split("to");
          const fromValue = parseFloat(a.trim());
          const toValue = parseFloat(b.trim());
          const TaxableValue = parseFloat(item?.IGST);

          if (!isNaN(TaxableValue)) {
            if (!isNaN(fromValue) && !isNaN(toValue)) {
              return TaxableValue >= fromValue && TaxableValue <= toValue;
            }
            else if (!isNaN(fromValue)) {
              return TaxableValue >= fromValue;
            }
            else {
              return TaxableValue <= toValue;
            }
          }
        }
        return true;
      }).filter((item) => {
        if (finalObj?.CGST?.length) {
          const [a, b] = finalObj?.CGST?.split("to");
          const fromValue = parseFloat(a.trim());
          const toValue = parseFloat(b.trim());
          const TaxableValue = parseFloat(item?.CGST);

          if (!isNaN(TaxableValue)) {
            if (!isNaN(fromValue) && !isNaN(toValue)) {
              return TaxableValue >= fromValue && TaxableValue <= toValue;
            }
            else if (!isNaN(fromValue)) {
              return TaxableValue >= fromValue;
            }
            else {
              return TaxableValue <= toValue;
            }
          }
        }
        return true;
      })
      .filter((item) => {
        if (finalObj?.SGST?.length) {
          const [a, b] = finalObj?.SGST?.split("to");
          const fromValue = parseFloat(a.trim());
          const toValue = parseFloat(b.trim());
          const TaxableValue = parseFloat(item?.SGST);

          if (!isNaN(TaxableValue)) {
            if (!isNaN(fromValue) && !isNaN(toValue)) {
              return TaxableValue >= fromValue && TaxableValue <= toValue;
            }
            else if (!isNaN(fromValue)) {
              return TaxableValue >= fromValue;
            }
            else {
              return TaxableValue <= toValue;
            }
          }
        }
        return true;
      })
      .filter((item) => {
        if (finalObj?.Cess?.length) {
          const [a, b] = finalObj?.Cess?.split("to");
          const fromValue = parseFloat(a.trim());
          const toValue = parseFloat(b.trim());
          const TaxableValue = parseFloat(item?.Cess);

          if (!isNaN(TaxableValue)) {
            if (!isNaN(fromValue) && !isNaN(toValue)) {
              return TaxableValue >= fromValue && TaxableValue <= toValue;
            }
            else if (!isNaN(fromValue)) {
              return TaxableValue >= fromValue;
            }
            else {
              return TaxableValue <= toValue;
            }
          }
        }
        return true;
      })
      .filter((item) => {
        if (finalObj?.TaxableValue?.length) {
          const [a, b] = finalObj?.TaxableValue?.split("to");
          const fromValue = parseFloat(a.trim());
          const toValue = parseFloat(b.trim());
          const invoiceValue = parseFloat(item?.TaxableValue);

          if (!isNaN(invoiceValue)) {
            if (!isNaN(fromValue) && !isNaN(toValue)) {
              return invoiceValue >= fromValue && invoiceValue <= toValue;
            }
            else if (!isNaN(fromValue)) {
              return invoiceValue >= fromValue;
            }
            else {
              return invoiceValue <= toValue;
            }
          }
        }
        return true;
      })
      .filter((itemNatureOfDocument) =>
        finalObj.NatureOfDocument?.length
          ? itemNatureOfDocument?.NatureOfDocument?.toString().toLowerCase().includes(
            finalObj?.NatureOfDocument?.toString().toLowerCase()
          )
          : itemNatureOfDocument
      )
      .filter((itemSrNoFrom) =>
        finalObj.SrNoFrom?.length
          ? itemSrNoFrom?.SrNoFrom?.toString().toLowerCase().includes(
            finalObj?.SrNoFrom?.toString().toLowerCase()
          )
          : itemSrNoFrom
      )
      .filter((itemSrNoTo) =>
        finalObj.SrNoTo?.length
          ? itemSrNoTo?.SrNoTo?.toString().toLowerCase().includes(
            finalObj?.SrNoTo?.toString().toLowerCase()
          )
          : itemSrNoTo
      )
      .filter((itemTotalNumber) =>
        finalObj.TotalNumber?.length
          ? itemTotalNumber?.TotalNumber?.toString().toLowerCase().includes(
            finalObj?.TotalNumber?.toString().toLowerCase()
          )
          : itemTotalNumber
      )
      .filter((itemCancelled) =>
        finalObj.Cancelled?.length
          ? itemCancelled?.Cancelled?.toString().toLowerCase().includes(
            finalObj?.Cancelled?.toString().toLowerCase()
          )
          : itemCancelled
      )
      .filter((itemNetIssued) =>
        finalObj.NetIssued?.length
          ? itemNetIssued?.NetIssued?.toString().toLowerCase().includes(
            finalObj?.NetIssued?.toString().toLowerCase()
          )
          : itemNetIssued
      )
      .filter((item) =>
        finalObj.RevisedInvoiceNumber?.length
          ? item?.RevisedInvoiceNumber?.toString().toLowerCase().includes(
            finalObj?.RevisedInvoiceNumber?.toString().toLowerCase()
          )
          : item
      )
      .filter((item) => {
        if (finalObj?.RevisedInvoiceDate?.length) {
          const [a, b] = finalObj?.RevisedInvoiceDate?.split("to")
          const startDate = moment(a, 'YYYY-MM-DD');
          const toDate = moment(b, 'YYYY-MM-DD');
          const invoiceDate = moment(item?.RevisedInvoiceDate, 'DD-MM-YYYY');
          return invoiceDate.isBetween(startDate, toDate, null, '[]');
        }
        else {
          return item
        }
      })


    flag = true;
    addArr.push(...updatedData);
    setPage(0);
    let uniq = [...new Set(addArr)];
    calcutions(uniq , invoiceSecID);
    return uniq;
  }

  // *** with round figer value
  function emptyRenderAt(instance, td, row, col, prop, value, cellProperties) {
    textRenderer.apply(this, arguments);

    if (purchaseData?.length && col == 0) {
      td.innerText = value?.toString()?.toUpperCase()
    }

    if ((col == 4 || col == 5 || col == 6)) {
      // if (col == 4 || col == 6) {
      let currnecyVal = formatINR(Number(value));

      if (currnecyVal !== 0) {
        td.innerText = currnecyVal;
      }
    }
  }
  function emptyRender(instance, td, row, col, prop, value, cellProperties) {
    textRenderer.apply(this, arguments);

    if (activeTab == 1) {
      if (col == 5 || col == 6 || col == 4) {
        let currnecyVal = formatINR(Number(value));

        if (currnecyVal !== 0) {
          td.innerText = currnecyVal;
        }
      }
    } else if (activeTab == 2) {
      if (col == 5 || col == 6 || col == 4) {
        let currnecyVal = formatINR(Number(value));

        if (currnecyVal !== 0) {
          td.innerText = currnecyVal;
        }
      }
    } else if (activeTab == 3) {
      if (
        col == 4 ||
        col == 3 ||
        col == 5 ||
        col == 6 ||
        col == 7 ||
        col == 8 ||
        col == 9 ||
        col == 10 ||
        col == 11
      ) {
        let currnecyVal = formatINR(Number(value));

        if (currnecyVal !== 0) {
          td.innerText = currnecyVal;
        }
      }
    } else if (activeTab == 4) {
      if (col == 3) {
        let currnecyVal = formatINR(Number(value));

        if (currnecyVal !== 0) {
          td.innerText = currnecyVal;
        }
      }
    } else if (activeTab == 5) {
      if (col == 2 || col == 3 || col == 4) {
        let currnecyVal = formatINR(Number(value));

        if (currnecyVal !== 0) {
          td.innerText = currnecyVal;
        }
      }
    } else if (activeTab == 6) {
      if (col == 4 || col == 6 || col == 7) {
        let currnecyVal = formatINR(Number(value));

        if (currnecyVal !== 0) {
          td.innerText = currnecyVal;
        }
      }
    } else if (activeTab == 7) {
      if (col == 3 || col == 4 || col == 5 || col == 7) {
        let currnecyVal = formatINR(Number(value));

        if (currnecyVal !== 0) {
          td.innerText = currnecyVal;
        }
      }
    }
  }
  function emptySummaryRender(
    instance,
    td,
    row,
    col,
    prop,
    value,
    cellProperties
  ) {
    textRenderer.apply(this, arguments);

    if (activeTab == 6) {
      if (
        (col == 3 ||
          col == 4 ||
          col == 5 ||
          col == 6 ||
          col == 7 ||
          col == 8 ||
          col == 9 ||
          col == 10) &&
        !isNaN(value)
      ) {
        let currnecyVal = formatINR(Number(value));

        if (currnecyVal !== 0) {
          td.innerText = currnecyVal;
        }
      }
    } else if (activeTab == 7) {
      if (
        col == 2 ||
        col == 3 ||
        col == 4 ||
        col == 5 ||
        col == 6 ||
        col == 7
      ) {
        let currnecyVal = formatINR(Number(value));

        if (currnecyVal !== 0) {
          td.innerText = currnecyVal;
        }
      }
    }
  }

  function formatINR(x) {
    return x.toLocaleString("en-IN", { minimumFractionDigits: 2 });
  }
  function formatTotalWithoutDecimal(x) {
    return x.toLocaleString("en-IN");
  }
  const gstr1FiledSummaryList = (
    activeTabs,
    colName,
    orderBy,
    invType,
    frDate,
    toDate,
    clearBy
  ) => {
    var newValuesArr = [];

    // console.log("get data");
    // console.log(invType);
    setInvoiceSecID(invType);
    if (activeTabs == 1) {
      newValuesArr = invType !== undefined ? [invType] : [invoceTypes?.value];
      // newValuesArr = invoceTypes && invoceTypes?.map(item => item.value);
    } else if (activeTabs == 7) {
      newValuesArr =
        invType !== undefined ? [invType] : [b2csInvoiceType?.value];
    } else if (activeTabs == 6) {
      newValuesArr = invType !== undefined ? [invType] : [atInvoiceType?.value];
    } else {
      newValuesArr =
        invType !== undefined ? [invType] : [crdrInvoiceType?.value];
    }

    var searchPayload = {};
    var searchPayloadB2cs = {};
    var defaultType = null;
    var searchType = "";



    if (newValuesArr.length == 0) {
      defaultType =
        searchUrlValue !== null && searchUrlValue !== "" ? [url] : [];
    } else {
      searchType = newValuesArr;
    }

    var currentColval = null;
    var searchValue = null;

    if (activeTab == 1 || activeTab == 7 || activeTab == 6) {
      currentColval = clearBy == refershData ? [] : currentCol;
      searchValue = clearBy == refershData ? [] : searchVal1;
    } else {
      currentColval = clearBy == refershData ? [] : currentColcrdr;
      searchValue = clearBy == refershData ? [] : searchValcrdr;
    }

    searchPayload = {
      userClientId: G_UCParId,
      pageStart: page + 1,
      pageSize: rowsPerPage,
      orderByColumnName: colName,
      orderBy: orderBy,
      searchColumnName: currentColval,
      searchValue: searchValue,
      sectionId:
        searchType !== null && searchType !== "" && searchType !== undefined
          ? searchType
          : defaultType,
      creditDebit: "",
      tabId: activeTab == 7 ? 3 : activeTab == 6 ? 4 : activeTab,
      fromRange: frDate,
      // "fromRange": "012023",
      toRange: toDate,
      // "toRange": "052023",
      gstin: [],
      vendorName: "",
    };

    setBlock(true);
    console.log(searchPayload, "searchPaylaod");

    SessionFunction.setSessionValue(
      globleVariable.gstr1FiledFromDt,
      frDate,
      true
    );
    SessionFunction.setSessionValue(
      globleVariable.gstr1FiledToDt,
      toDate,
      true
    );

    let { tableDataArr, symmaryTableDataArr } = actualData(
      activeTabs,
      searchType[0]
    );

    GSTR1FileDataAPIService.getGSTR1FiledPagination(searchPayload)
      .then((res) => {
        console.log("this api is calling now var check", invType);
        if (res.status === 200) {
          setCount(count + 1);
          if (count == 0) {
            setInvoiceTypeList(res?.data?.data?.sectionList);
            setCrDrInvoiceTypeList(res?.data?.data?.sectionListTabTwo);
            setB2csInvoiceTypeList(res?.data?.data?.sectionListTabThree);
            setAtInvoiceTypeList(res?.data?.data?.sectionListTabFour);
            setShowList(true);
            setReverseCharge(res?.data?.data?.reverseCharge)
            setunitOfMeasurement(res?.data?.data?.unitOfMeasurement)
            setplaceOfSupply(res?.data?.data?.placeOfSupply)
            setcreditDebit(res?.data?.data?.creditDebit)
            setRate(res?.data?.data?.rate)

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

    console.log(tableDataArr, "tableDataArr");
    symmaryTableDataArr && symmaryTableDataArr.length > 0
      ? setB2csData(symmaryTableDataArr)
      : setB2csData([]);


    setData(tableDataArr);
    setDocData(tableDataArr)
    calcutions(tableDataArr, invType);
    setBlock(false);
  };
  console.log(data, "datahdhhhdd")
  const purchaseData = data;
  const pageCount = Math.ceil(
    purchaseData?.length && purchaseData?.length / rowsPerPage
  );

  const b2csSummaryData = b2csData
  const summaryPageCount = Math.ceil(
    b2csSummaryData?.length && b2csSummaryData?.length / rowsPerPage
  );

  const spara1 = pageSummary * rowsPerPage;
  const spara2 = pageSummary * rowsPerPage + rowsPerPage;
  let GSTR1FiledSummary = b2csData && b2csData.slice(spara1, spara2);


  const para1 = page * rowsPerPage;
  const para2 = page * rowsPerPage + rowsPerPage;
  // let GSTR6AData = gstr6aData && gstr6aData.slice(para1, para2);
  //** Mock data */
  let GSTR1FiledData = data && data.slice(para1, para2);
  let gstr1Docsdata = docsData && docsData.slice(para1, para2);
  const gstr1Docs = docsData;
  const pageCountdoc = Math.ceil(
    gstr1Docs?.length && gstr1Docs?.length / rowsPerPage
  );

  useEffect(() => {
    if(GSTR1FiledData.length > 0 ){
      setbtnDisable1(false)
    } 
    else{
      setbtnDisable1(true)
    }

  },[GSTR1FiledData])

  const b2csTableData = b2csData;
  // withot pagination property
  const handlePageClick = (event) => {
    setPage(event);
    setServerSidePage(true);

  };

  //** Dropdown with pagination func - new functionality
  const onPageChangeFunc = (e) => {
    setPageNoSelect(e);
    setRowsPerPage(e.value);
    setPage(0);

  };

  // ** Advance Pagination Rows per Page Show
  useEffect(() => {

    const pageUi = showTotalRowPerPage(page, rowsPerPage, purchaseData?.length)
    setPaginationUi(pageUi)

  }, [purchaseData?.length, page, rowsPerPage])

  const handleDocsPageClick = (event) => {
    setPage(event);
    // setServerSidePage(true);
  };


  const handlePageClickSummary = (event) => {
    setPageSummary(event);
    setServerSidePage(true);
  };

  const hotRef = useRef(null);
  const hotRefB2cs = useRef(null);
  const hotRefB2csInv = useRef(null);
  const hotRef1 = useRef(null);
  const hotRefCrdrVendor = useRef(null);
  const hotRefCrdrVendor1 = useRef(null);
  const hotRefCrdr = useRef(null);
  const hotRefInputCredit = useRef(null);
  const hotRefExemp = useRef(null);
  const hotRefHsn = useRef(null);
  const hotRefAt = useRef(null);
  const hotRefAtSummary = useRef(null);

  const hot = hotRef?.current?.hotInstance;

  let arrFilter = [];
  const theader = (col, TH) => {

    if (activeTab == 1) {
      if (gridCustomFilter.length > 0) {

        let finalObj = {};
        for (let i = 0; i < gridCustomFilter.length; i++) {
          Object.assign(finalObj, gridCustomFilter[i]);
        }


        invalidColumns.forEach((ele, index) => {
          const columnIndex = index;
          const buttonExists = document.querySelector(`#test1 .ht_clone_top thead th:nth-child(${columnIndex + 1}) button`);

          const columnMatchesCondition = Object.keys(finalObj).includes(ele.data);
          // uniq.some(col1 => ele?.data.includes(col1));

          // Check if column value is not null
          const columnValueValid = finalObj[ele.data] !== null && finalObj[ele.data] !== "";

          if (buttonExists && columnMatchesCondition && columnValueValid) {
            const TH = document.querySelector(`#test1 .ht_clone_top thead th:nth-child(${columnIndex + 1})`);

            if (TH) {
              TH?.classList?.add("htFiltersActive");
            } else {
              TH?.classList?.remove("htFiltersActive");
            }
          }
        });
      }
    }

    if (activeTab == 2) {
      if (gridCustomFilter.length > 0) {


        let finalObj = {};
        for (let i = 0; i < gridCustomFilter.length; i++) {
          Object.assign(finalObj, gridCustomFilter[i]);
        }


        crDrInvalidColumns.forEach((ele, index) => {
          const columnIndex = index;
          const buttonExists = document.querySelector(`.ht_clone_top thead th:nth-child(${columnIndex + 1}) button`);

          const columnMatchesCondition = Object.keys(finalObj).includes(ele.data);
          // uniq.some(col1 => ele?.data.includes(col1));

          // Check if column value is not null
          const columnValueValid = finalObj[ele.data] !== null && finalObj[ele.data] !== "";

          if (buttonExists && columnMatchesCondition && columnValueValid) {
            const TH = document.querySelector(`.tab-pane.active .ht_clone_top thead th:nth-child(${columnIndex + 1})`);

            if (TH) {
              TH?.classList?.add("htFiltersActive");
            } else {
              TH?.classList?.remove("htFiltersActive");
            }
          }
        });
      }
    }
    if (activeTab == 7) {
      if (gridCustomFilter.length > 0) {

        let finalObj = {};
        for (let i = 0; i < gridCustomFilter?.length; i++) {
          Object.assign(finalObj, gridCustomFilter[i]);
        }


        B2CsInvalidColumns.forEach((ele, index) => {
          const columnIndex = index;
          // const buttonExists = document.querySelector(`.tab-pane.active .ht_clone_top thead th:nth-child(${columnIndex + 1}) button`);
          const buttonExists = document.querySelector(`#b2csInvalidCol .ht_clone_top thead th:nth-child(${columnIndex + 1})`);

          const columnMatchesCondition = Object.keys(finalObj).includes(ele.data);
          // uniq.some(col1 => ele?.data.includes(col1));

          // Check if column value is not null
          const columnValueValid = finalObj[ele.data] !== null && finalObj[ele.data] !== "";

          if (buttonExists && columnMatchesCondition && columnValueValid) {
            // const TH = document.querySelector(`.tab-pane.active .ht_clone_top thead th:nth-child(${columnIndex + 1}) button`);
            const TH = document.querySelector(`#b2csInvalidCol .ht_clone_top thead th:nth-child(${columnIndex + 1})`);
            // console.log(TH,"THHHH")
            if (TH) {
              TH?.classList?.add("htFiltersActive");
            } else {
              TH?.classList?.remove("htFiltersActive");
            }
          }
        });
      }
    }

    if (activeTab == 6) {
      if (gridCustomFilter?.length > 0) {

        let finalObj = {};
        for (let i = 0; i < gridCustomFilter?.length; i++) {
          Object.assign(finalObj, gridCustomFilter[i]);
        }


        atColumns.forEach((ele, index) => {
          const columnIndex = index;
          // const buttonExists = document.querySelector(`.tab-pane.active .ht_clone_top thead th:nth-child(${columnIndex + 1}) button`);
          const buttonExists = document.querySelector(`#atColumns .ht_clone_top thead th:nth-child(${columnIndex + 1})`);

          const columnMatchesCondition = Object.keys(finalObj).includes(ele.data);
          // uniq.some(col1 => ele?.data.includes(col1));

          // Check if column value is not null
          const columnValueValid = finalObj[ele.data] !== null && finalObj[ele.data] !== "";

          if (buttonExists && columnMatchesCondition && columnValueValid) {
            // const TH = document.querySelector(`.tab-pane.active .ht_clone_top thead th:nth-child(${columnIndex + 1}) button`);
            const TH = document.querySelector(`#atColumns .ht_clone_top thead th:nth-child(${columnIndex + 1})`);
            console.log(TH, "THHHH")
            if (TH) {
              TH?.classList?.add("htFiltersActive");
            } else {
              TH?.classList?.remove("htFiltersActive");
            }
          }
        });
      }
    }

    if (activeTab == 6) {
      if (col === 0 || col === 8) {
        const button = TH.children[0].children[0];
        button.parentNode.removeChild(button);
      }
    }

    if (activeTab == 1) {
      if (col == 5 || col == 6 || col == 4) {
        TH.className = "htRight";
      } else {
        TH.className = "htLeft";
      }
    } else if (activeTab == 2) {
      if (col == 5 || col == 6 || col == 4) {
        TH.className = "htRight";
      } else {
        TH.className = "htLeft";
      }
    } else if (activeTab == 7) {
      if (col == 5 || col == 3 || col == 4) {
        TH.className = "htRight";
      } else {
        TH.className = "htLeft";
      }
    } else if (activeTab == 6) {
      if (col == 3 || col == 5 || col == 6) {
        TH.className = "htRight";
      } else {
        TH.className = "htLeft";
      }
    }
  };

  const theader1 = (col, TH) => {

    if (activeTab == 3) {
      if (gridCustomFilter.length > 0) {

        let finalObj = {};
        for (let i = 0; i < gridCustomFilter.length; i++) {
          Object.assign(finalObj, gridCustomFilter[i]);
        }


        hsnInvalidColumns.forEach((ele, index) => {
          const columnIndex = index;
          const buttonExists = document.querySelector(`.ht_clone_top thead th:nth-child(${columnIndex + 1}) button`);

          const columnMatchesCondition = Object.keys(finalObj).includes(ele.data);
          // uniq.some(col1 => ele?.data.includes(col1));

          // Check if column value is not null
          const columnValueValid = finalObj[ele.data] !== null && finalObj[ele.data] !== "";

          if (buttonExists && columnMatchesCondition && columnValueValid) {
            const TH = document.querySelector(`.tab-pane.active .ht_clone_top thead th:nth-child(${columnIndex + 1})`);

            if (TH) {
              TH?.classList?.add("htFiltersActive");
            } else {
              TH?.classList?.remove("htFiltersActive");
            }
          }
        });
      }
    }
    if (activeTab == 4) {
      if (currentColdoc.length > 0) {

        let uniq = [...new Set(currentColdoc)];


        for (let i = 0; i < uniq.length; i++) {
          var obj = {};

          for (let j = 0; j < searchValdoc.length; j++) {
            if (i == j) {
              obj[uniq[i]] = searchValdoc[j]?.trim();
              arrFilter.push(obj);
            }
          }
        }


        let finalObj = {};
        for (let i = 0; i < arrFilter.length; i++) {
          Object.assign(finalObj, arrFilter[i]);
        }


        DocColumns.forEach((ele, index) => {
          const columnIndex = index;
          const buttonExists = document.querySelector(`.ht_clone_top thead th:nth-child(${columnIndex + 1}) button`);

          const columnMatchesCondition = Object.keys(finalObj).includes(ele.data);
          // uniq.some(col1 => ele?.data.includes(col1));

          // Check if column value is not null
          const columnValueValid = finalObj[ele.data] !== null && finalObj[ele.data] !== "";

          if (buttonExists && columnMatchesCondition && columnValueValid) {
            const TH = document.querySelector(`.tab-pane.active .ht_clone_top thead th:nth-child(${columnIndex + 1})`);

            if (TH) {
              TH?.classList?.add("htFiltersActive");
            } else {
              TH?.classList?.remove("htFiltersActive");
            }
          }
        });
      }
    }
    if (activeTab == 7) {
      if (col > 1) {
        TH.className = "htRight";
      } else {
        TH.className = "htLeft";
      }
    } else if (activeTab == 6) {
      if (col > 2) {
        TH.className = "htRight";
      } else {
        TH.className = "htLeft";
      }
    } else if (activeTab == 5) {
      if (col > 0) {
        TH.className = "htRight";
      } else {
        TH.className = "htLeft";
      }
    } else if (activeTab == 4) {
      if (col > 2 && col < 6) {
        TH.className = "htRight";
      } else if (col == 6) {
        TH.className = "htCenter";
      } else {
        TH.className = "htLeft";
      }
    } else if (activeTab == 3) {
      if (col > 2 && col < 12) {
        TH.className = "htRight";
      } else if (col == 12) {
        TH.className = "htCenter";
      } else {
        TH.className = "htLeft";
      }
    }
  };

  function colHeaders(col) {
    let txt;
    switch (col) {
      case 0:
        txt = "<input type='checkbox' class='checker'  ";
        txt += isChecked ? 'checked="checked"' : "";
        txt += ">";
        return txt;
    }
  }

  const deleteGSTR1HSNInvoice = (id) => {
    if (activeTab == 3) {
      return MySwal.fire({
        title: "Are you sure delete this hsn ?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        customClass: {
          confirmButton: "btn btn-danger",
          cancelButton: "btn btn-outline-dark ms-1",
        },
        buttonsStyling: false,
      }).then(function (result) {
        if (result.value) {
          console.log(purchaseData);

          const HSNpurchaseObj = {
            gstr1HSNId: [id],
          };

          setBlock(true);
          GSTR1FileDataAPIService.hsnGSTR1InvoiceDelete(HSNpurchaseObj)
            .then((res) => {
              // PurchaseSummaryInvoice.hsnPurchaseInvoiceDelete(purchaseObj).then(res => {
              if (
                res.status === 200 &&
                res.data.status === errorCodeConfig.APIDefaultCode.Success
              ) {
                setBlock(false);

                toast.success(res.data.successMessage, {
                  position: "top-right",
                });

                // gstr1FiledSummaryList(activeTab, "", "")
                let invType = null;

                if (activeTab == 1) {
                  invType =
                    invoceTypes?.value !== null &&
                      invoceTypes?.value !== "" &&
                      invoceTypes?.value !== undefined
                      ? invoceTypes?.value
                      : url;
                } else {
                  invType =
                    crdrInvoiceType?.value !== null &&
                      crdrInvoiceType?.value !== "" &&
                      crdrInvoiceType?.value !== undefined
                      ? crdrInvoiceType?.value
                      : url;
                }

                gstr1FiledSummaryList(
                  activeTab,
                  "",
                  "",
                  activeTab == 3 ? "0" : invType,
                  finFromYear?.value,
                  monthFrom?.value,
                  ""
                );
              } else {
                setBlock(false);
                toast.success(res.data.errorMessage, {
                  position: "top-right",
                });
              }
            })
            .catch((error) => {
              setBlock(false);
              toast.error(error.message, {
                position: "top-right",
              });
            });
        }
      });
    }
  };

  const deleteGSRT1DocsDetails = (id) => {
    // purchaseHSNId
    // if (activeTab == 3) {

    return MySwal.fire({
      title: "Are you sure delete this DOC Details ?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      customClass: {
        confirmButton: "btn btn-danger",
        cancelButton: "btn btn-outline-dark ms-1",
      },
      buttonsStyling: false,
    }).then(function (result) {
      if (result.value) {
        console.log(purchaseData, "pd");
        console.log(result, "ressssss");

        const DocsIdContainer = {
          Gstr1FilingDocsId: [id],
        };

        setBlock(true);
        GSTR1FileDataAPIService.gstr1DocsDeleted(DocsIdContainer)
          .then((res) => {
            // PurchaseSummaryInvoice.hsnPurchaseInvoiceDelete(purchaseObj).then(res => {
            if (
              res.status === 200 &&
              res.data.status === errorCodeConfig.APIDefaultCode.Success
            ) {
              setBlock(false);

              toast.success(res.data.successMessage, {
                position: "top-right",
              });

              // gstr1FiledSummaryList(activeTab, "", "")
              let invType = null;

              if (activeTab == 1) {
                invType =
                  invoceTypes?.value !== null &&
                    invoceTypes?.value !== "" &&
                    invoceTypes?.value !== undefined
                    ? invoceTypes?.value
                    : url;
              } else {
                invType =
                  crdrInvoiceType?.value !== null &&
                    crdrInvoiceType?.value !== "" &&
                    crdrInvoiceType?.value !== undefined
                    ? crdrInvoiceType?.value
                    : url;
              }

              gstr1FiledSummaryList(
                activeTab,
                "",
                "",
                activeTab == 4 ? "0" : invType,
                finFromYear?.value,
                monthFrom?.value,
                ""
              );
            } else {
              setBlock(false);
              toast.success(res.data.errorMessage, {
                position: "top-right",
              });
            }
          })
          .catch((error) => {
            setBlock(false);
            toast.error(error.message, {
              position: "top-right",
            });
          });
      }
    });

    // }
  };

  const deleteSaleInvoice = () => {
    console.log("delete data");
    console.log(purchaseData, "purchaseData");
    // GSTR1HSNId
    if (activeTab == 3) {
      var delArr = [];
      if (purchaseData.length > 0) {
        for (let i = 0; i < purchaseData.length; i++) {
          // debugger
          if (
            purchaseData[i].select == "true" ||
            purchaseData[i].select == true
          ) {
            delArr.push(purchaseData[i].gstr1FiledHSNId);
          }
        }
      }

      if (delArr.length > 0) {
        return MySwal.fire({
          title: "Are you sure delete this hsn?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, delete it!",
          customClass: {
            confirmButton: "btn btn-danger",
            cancelButton: "btn btn-outline-dark ms-1",
          },
          buttonsStyling: false,
        }).then(function (result) {
          if (result.value) {
            console.log(purchaseData);

            const purchaseObj = {
              gstr1FiledHSNId: delArr,
            };

            setBlock(true);
            // PurchaseSummaryInvoice.hsnPurchaseInvoiceDelete(purchaseObj).then(res => {
            GSTR1FileDataAPIService.hsnGSTR1FileDataInvoiceDelete(purchaseObj)
              .then((res) => {
                if (
                  res.status === 200 &&
                  res.data.status === errorCodeConfig.APIDefaultCode.Success
                ) {
                  setBlock(false);

                  toast.success(res.data.successMessage, {
                    position: "top-right",
                  });

                  // gstr1FiledSummaryList(activeTab, "", "")
                  let invType = null;

                  if (activeTab == 1) {
                    invType =
                      invoceTypes?.value !== null &&
                        invoceTypes?.value !== "" &&
                        invoceTypes?.value !== undefined
                        ? invoceTypes?.value
                        : url;
                  } else {
                    invType =
                      crdrInvoiceType?.value !== null &&
                        crdrInvoiceType?.value !== "" &&
                        crdrInvoiceType?.value !== undefined
                        ? crdrInvoiceType?.value
                        : url;
                  }

                  setPage(0);
                  gstr1FiledSummaryList(
                    activeTab,
                    "",
                    "",
                    activeTab == 3 ? "0" : invType,
                    finFromYear?.value,
                    monthFrom?.value,
                    ""
                  );
                } else {
                  setBlock(false);
                  toast.success(res.data.errorMessage, {
                    position: "top-right",
                  });
                }
              })
              .catch((error) => {
                setBlock(false);
                toast.error(error.message, {
                  position: "top-right",
                });
              });
          }
        });
      } else {
        toast.error("Please select atleast one record this is HSN .", {
          position: "top-right",
        });
      }
    } else {
      var delArr = [];
      if (purchaseData.length > 0) {
        for (let i = 0; i < purchaseData.length; i++) {
          if (
            purchaseData[i].select == "true" ||
            purchaseData[i].select == true
          ) {
            delArr.push(purchaseData[i].gstr1FiledId);
          }
        }
      }

      if (delArr.length > 0) {
        return MySwal.fire({
          title: "Are you sure delete this invoice ?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, delete it!",
          customClass: {
            confirmButton: "btn btn-danger",
            cancelButton: "btn btn-outline-dark ms-1",
          },
          buttonsStyling: false,
        }).then(function (result) {
          if (result.value) {
            console.log(purchaseData);

            const deleteGSRT1Invoices = {
              userClientId: G_UCParId,
              financialYearId: G_FY,
              deletedBy: userIds,
              gstr1FiledId: delArr,
            };

            setBlock(true);
            // PurchaseSummaryInvoice.PurchaseInvoiceDelete(purchaseObj).then(res => {
            GSTR1FileDataAPIService.GSTR1FiledInvoiceDelete(deleteGSRT1Invoices)
              .then((res) => {
                if (
                  res.status === 200 &&
                  res.data.status === errorCodeConfig.APIDefaultCode.Success
                ) {
                  setBlock(false);

                  toast.success(res.data.successMessage, {
                    position: "top-right",
                  });

                  // gstr1FiledSummaryList(activeTab, "", "")
                  let invType = null;

                  if (activeTab == 1) {
                    invType =
                      invoceTypes?.value !== null &&
                        invoceTypes?.value !== "" &&
                        invoceTypes?.value !== undefined
                        ? invoceTypes?.value
                        : url;
                  } else if (activeTab == 7) {
                    invType =
                      b2csInvoiceType?.value !== null &&
                        b2csInvoiceType?.value !== "" &&
                        b2csInvoiceType?.value !== undefined
                        ? b2csInvoiceType?.value
                        : url;
                  } else if (activeTab == 6) {
                    invType =
                      atInvoiceType?.value !== null &&
                        atInvoiceType?.value !== "" &&
                        atInvoiceType?.value !== undefined
                        ? atInvoiceType?.value
                        : url;
                  } else {
                    invType =
                      crdrInvoiceType?.value !== null &&
                        crdrInvoiceType?.value !== "" &&
                        crdrInvoiceType?.value !== undefined
                        ? crdrInvoiceType?.value
                        : url;
                  }

                  gstr1FiledSummaryList(
                    activeTab,
                    "",
                    "",
                    activeTab == 3 ? "0" : invType,
                    finFromYear?.value,
                    monthFrom?.value,
                    ""
                  );
                } else {
                  setBlock(false);
                  toast.success(res.data.errorMessage, {
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
                  // toast.error(error.message, {
                  //     position: "top-right",
                });
              });
          }
        });
      } else {
        toast.error("Please select atleast one record.", {
          position: "top-right",
        });
      }
    }
  };

  // purchase cell mouse down
  function localAfterOnCellMouseDown(event, coords, td) {
    let hot = null;

    if (activeTab == 1) {
      hot = hotRef?.current?.hotInstance;
    } else if (activeTab == 7) {
      hot = hotRefB2csInv?.current?.hotInstance;
    } else if (activeTab == 6) {
      hot = hotRefAt?.current?.hotInstance;
    }

    const totalRows = hot?.countRows();
    console.log(totalRows, "modularCheck");
    setCurrentCol1(coords?.col);

    activeTab == 7 && setCurrentCol1b2cs(coords?.col);
    if (event.target.classList.contains("checker")) {
      if (!isChecked) {
        isChecked = true;
        for (let index = 0; index < totalRows; index++) {
          hot?.setDataAtCell(index, 0, true);
        }
      } else {
        isChecked = false;
        for (let index = 0; index < totalRows; index++) {
          hot?.setDataAtCell(index, 0, false);
        }
      }
    }

    let handsontableColumns =
      activeTab == 1
        ? invalidColumns
        : activeTab == 7
          ? B2CsInvalidColumns
          : activeTab == 6
            ? atColumns
            : undefined;
    if (handsontableColumns) {
      const Index = currentCol?.findIndex(
        (item) => handsontableColumns[coords?.col]?.data == item
      );

      if (Index != -1) {
        setTimeout(function () {
          var searchInput = document?.querySelector(
            ".htUIMultipleSelectSearch.htUIInput"
          );
          if (searchInput !== null) {

            searchInput.children[0].value = searchVal1[Index];
          }
        }, 200);
      } else {
        setTimeout(function () {
          var searchInput = document?.querySelector(
            ".htUIMultipleSelectSearch.htUIInput"
          ); // searchInput.children[0].innerHTML ="hii1"
          if (searchInput !== null) {
            searchInput.children[0].value = "";
          }
        }, 100);
      }
    }
  }

  // Vendor onCellMouseDown
  function CrDrlocalAfterOnCellMouseDown(event, coords, td) {
    const hot = hotRefCrdrVendor?.current?.hotInstance;
    setCurrentCol1crdr(coords?.col);
    const totalRows = hot?.countRows();

    if (event.target.classList.contains("checker")) {
      if (!isChecked) {
        isChecked = true;
        for (let index = 0; index < totalRows; index++) {
          hot?.setDataAtCell(index, 0, true);
        }
      } else {
        isChecked = false;
        for (let index = 0; index < totalRows; index++) {
          hot?.setDataAtCell(index, 0, false);
        }
      }
    }

    if (coords.row !== -1) {
      if (coords.col == 1 || coords.col == 2) {
        const { purchaseId, sectionId, sheetName } = hot?.getSourceDataAtRow(
          coords.row
        );
        console.log(purchaseId);
        if (
          purchaseId !== null &&
          purchaseId !== "" &&
          purchaseId !== undefined
        ) {
          const queryStr =
            "purchaseId=" +
            purchaseId +
            "&finId=" +
            G_FY +
            "&finMonth=" +
            G_FM +
            "&sectionId=" +
            sectionId;
          const encrypData = encryptData.encrypt(queryStr);
          console.log("purchaseId=" + purchaseId);
          navigate("/reconcilation/purchase/purchase-invoice?" + encrypData, {
            state: { pathname: fromPath, sectionName: sheetName },
          });
        }
      }
    }
    let handsontableColumns = crDrInvalidColumns;
    if (handsontableColumns) {
      const Index = currentColcrdr?.findIndex(
        (item) => handsontableColumns[coords?.col]?.data == item
      );

      if (Index != -1) {
        setTimeout(function () {
          var searchInput = document?.querySelector(
            ".htUIMultipleSelectSearch.htUIInput"
          );
          if (searchInput !== null) {
            searchInput.children[0].value = searchValcrdr[Index];
          }
        }, 200);
      } else {
        setTimeout(function () {
          var searchInput = document?.querySelector(
            ".htUIMultipleSelectSearch.htUIInput"
          ); // searchInput.children[0].innerHTML ="hii1"
          if (searchInput !== null) {
            searchInput.children[0].value = "";
          }
        }, 100);
      }
    }
  }


  function docslocalAfterOnCellMouseDown(event, coords, td) {
    const hot = hotRefInputCredit?.current?.hotInstance;
    setCurrentCol1doc(coords?.col);
    const totalRows = hot?.countRows();

    let handsontableColumns = DocColumns;
    if (handsontableColumns) {
      const Index = currentColdoc?.findIndex(
        (item) => handsontableColumns[coords?.col]?.data == item
      );

      if (Index != -1) {
        setTimeout(function () {
          var searchInput = document?.querySelector(
            ".htUIMultipleSelectSearch.htUIInput"
          );
          if (searchInput !== null) {
            searchInput.children[0].value = searchValdoc[Index];
          }
        }, 200);
      } else {
        setTimeout(function () {
          var searchInput = document?.querySelector(
            ".htUIMultipleSelectSearch.htUIInput"
          ); // searchInput.children[0].innerHTML ="hii1"
          if (searchInput !== null) {
            searchInput.children[0].value = "";
          }
        }, 100);
      }
    }
  }
  function hsnlocalAfterOnCellMouseDown(event, coords, td) {
    const hot = hotRefHsn?.current?.hotInstance;
    setCurrentCol1crdr(coords?.col);
    const totalRows = hot?.countRows();

    if (event.target.classList.contains("checker")) {
      if (!isChecked) {
        isChecked = true;
        for (let index = 0; index < totalRows; index++) {
          hot?.setDataAtCell(index, 0, true);
        }
      } else {
        isChecked = false;
        for (let index = 0; index < totalRows; index++) {
          hot?.setDataAtCell(index, 0, false);
        }
      }
    }

    let handsontableColumns = hsnInvalidColumns;
    if (handsontableColumns) {
      const Index = currentColcrdr?.findIndex(
        (item) => handsontableColumns[coords?.col]?.data == item
      );

      if (Index != -1) {
        setTimeout(function () {
          var searchInput = document?.querySelector(
            ".htUIMultipleSelectSearch.htUIInput"
          );
          if (searchInput !== null) {
            searchInput.children[0].value = searchValcrdr[Index];
          }
        }, 200);
      } else {
        setTimeout(function () {
          var searchInput = document?.querySelector(
            ".htUIMultipleSelectSearch.htUIInput"
          ); // searchInput.children[0].innerHTML ="hii1"
          if (searchInput !== null) {
            searchInput.children[0].value = "";
          }
        }, 100);
      }
    }
  }

  const filterInvoiceType = (event) => {

    setCurrentCol([]);
    setCurrentCol1(null);
    setSearchVal1([]);

    setPage(0);
    setInvoceTypes(event);
    gstr1FiledSummaryList(
      activeTab,
      "",
      "",
      event?.value,
      finFromYear?.value,
      monthFrom?.value,
      refershData
    );
    setGridCustomFilter([])
    setFilterDropDownList({
      rateDropDownList: [],
      rcmDropDownList: [],
      noteTypeDropDownList: [],
      posDropDownList: [],
      uqcDropDownList: [],

    });
    setPageNoSelect(paginationList[0]);
    setSearchDate('');
    setToDate('');
    setFromAmount('');
    setToAmount('');
    setFromValue('');
    setToValue('');
    setFromTax('')
    setToTax('');
  };

  const filterInvoiceTypeB2cs = (event) => {

    setCurrentCol([]);
    setCurrentCol1(null);
    setSearchVal1([]);
    setPage(0);
    setB2csInvoiceType(event);

    gstr1FiledSummaryList(
      activeTab,
      "",
      "",
      event?.value,
      finFromYear?.value,
      monthFrom?.value,
      refershData
    );
    setPageNoSelect(paginationList[0]);
    setGridCustomFilter([])
    setFilterDropDownList({
      rateDropDownList: [],
      rcmDropDownList: [],
      noteTypeDropDownList: [],
      posDropDownList: [],
      uqcDropDownList: [],

    });
    setSearchDate('');
    setToDate('');
    setFromAmount('');
    setToAmount('');
    setFromValue('');
    setToValue('');
    setFromTax('')
    setToTax('');
  };

  const filterInvoiceTypeAt = (event) => {

    setCurrentCol([]);
    setCurrentCol1(null);
    setSearchVal1([]);
    setPage(0);
    setAtInvoiceType(event);
    gstr1FiledSummaryList(
      activeTab,
      "",
      "",
      event?.value,
      finFromYear?.value,
      monthFrom?.value,
      refershData
    );
    setGridCustomFilter([]);
    setPageNoSelect(paginationList[0]);
    setFilterDropDownList({
      rateDropDownList: [],
      rcmDropDownList: [],
      noteTypeDropDownList: [],
      posDropDownList: [],
      uqcDropDownList: [],

    });
    setSearchDate('');
    setToDate('');
    setFromAmount('');
    setToAmount('');
    setFromValue('');
    setToValue('');
    setFromTax('')
    setToTax('');
    //getAdvanceSummaryList(finFromYear?.value, monthFrom?.value)
  };

  const crdrFilterInvoiceType = (event) => {
    setCurrentColcrdr([]);
    setCurrentCol1crdr(null);
    setSearchValcrdr([]);
    setPage(0);
    setCrDrInvoiceType(event);
    gstr1FiledSummaryList(
      activeTab,
      "",
      "",
      event?.value,
      finFromYear?.value,
      monthFrom?.value,
      refershData
    );
    setGridCustomFilter([]);
    setPageNoSelect(paginationList[0]);
    setFilterDropDownList({
      rateDropDownList: [],
      rcmDropDownList: [],
      noteTypeDropDownList: [],
      posDropDownList: [],
      uqcDropDownList: [],

    });
    setSearchDate('');
    setToDate('');
    setFromAmount('');
    setToAmount('');
    setFromValue('');
    setToValue('');
    setFromTax('')
    setToTax('');
  };


  const ExportSectionWiseData = () => {
    console.log("export data");

    setBlock(true);
    // setTimeout(() => {
    //     setSrcLoad(true)
    // }, 5);
    const gstr1FiledSectionId =
      activeTab == 3
        ? 18
        : activeTab == 2 ? crdrInvoiceType.value
          : activeTab == 5
            ? 17
            : activeTab == 4
              ? 19
              : activeTab == 7
                ? b2csInvoiceType?.value
                : activeTab == 6
                  ? atInvoiceType?.value
                  : invoceTypes?.value;

    GSTR1FileDataAPIService.exportGSTR1FiledExportDataSection(
      G_UCParId,
      finFromYear?.value,
      monthFrom?.value,
      gstr1FiledSectionId,
      subscriptionId,
      userIds,
      token
    )
      .then((res) => {
        if (res?.status == 200) {

          setBlock(false);
          // setTimeout(() => {
          //     setSrcLoad(false);
          // }, 1000);
          if (res.data.data !== null) {
            downloadURL(res.data.data);
          } else {
            toast.error(res.data.errorMessage, {
              position: "top-right",
            });
          }
        } else if (res?.status == 401) {
          tokenExpiresRedirect();
        } else {

          setBlock(false);
          toast.error(res.headers.errormessage, {
            position: "top-right",
          });
        }
      })
      .catch((error) => {
        setBlock(false);
        setSrcLoad(false);
        Swal.fire({
          icon: "error",
          title: "",
          text: error?.message,
          customClass: {
            confirmButton: "btn btn-outline-danger",
          },
          buttonsStyling: false,
        });
      });
  };

  //** Compare Month
  const CompareMonth = (frMonth, toMonth) => {
    console.log(frMonth, toMonth);
    if (frMonth == toMonth) {
      setbtnDisable(false);
      itcReadable = true;
    } else {
      setbtnDisable(true);
      itcReadable = false;
    }
  };

  const getExempList = (fromRange, toRange) => {
    const FKUserClientId = G_UCParId;

    setBlock(true);

    SessionFunction.setSessionValue(
      globleVariable.gstr1FiledFromDt,
      fromRange,
      true
    );
    SessionFunction.setSessionValue(
      globleVariable.gstr1FiledToDt,
      toRange,
      true
    );
    GSTR1FileDataAPIService.getExemptFileData(
      FKUserClientId,
      fromRange,
      toRange
    )
      .then((res) => {
        setBlock(false);
        if (
          res.status === 200 &&
          res.data.status === errorCodeConfig.APIDefaultCode.Success
        ) {
          if (res?.data?.data?.data?.length < 1) {
            setbtnDisable1(true);
          } else {
            setbtnDisable1(false);
          }
          setData(res?.data?.data?.data);
          if (res?.data?.data?.data?.length < 1) {
            setbtnDisable1(true);
          } else {
            setbtnDisable1(false);
          }

          console.log(res?.data?.data?.summary);

          if (res?.data?.data?.summary !== null) {
            const {
              totalExempted,
              totalNilRatedSupplies,
              totalNonGSTSupplies,
            } = res?.data?.data?.summary;
            setTotalSGST(
              totalExempted !== null && totalExempted !== "" ? totalExempted : 0
            );
            setTotalIGST(
              totalNilRatedSupplies !== null && totalNilRatedSupplies !== ""
                ? totalNilRatedSupplies
                : 0
            );
            setTotalCess(
              totalNonGSTSupplies !== null && totalNonGSTSupplies !== ""
                ? totalNonGSTSupplies
                : 0
            );
          }
        } else {
          Swal.fire({
            icon: "error",
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

  const getAdvanceSummaryList = (fromRange, toRange, invType) => {
    const FKUserClientId = G_UCParId;
    const gstIn = G_GSTIN;

    SessionFunction.setSessionValue(
      globleVariable.gstr1FiledFromDt,
      fromRange,
      true
    );
    SessionFunction.setSessionValue(
      globleVariable.gstr1FiledToDt,
      toRange,
      true
    );

    GSTR1FileDataAPIService.getGSTR1FiledAdvanceSummary(
      FKUserClientId,
      fromRange,
      toRange,
      gstIn,
      invType
    )
      .then((res) => {
        // setBlock(false)
        if (
          res.status === 200 &&
          res.data.status === errorCodeConfig.APIDefaultCode.Success
        ) {
          if (invType == "13" || invType == "15") {
            setAtSummaryData(res?.data?.data?.getATSummaryAPIModels);
          } else {
            setAtSummaryData(res?.data?.data?.getExtraATSummaryAPIModels);
          }
        } else {
          Swal.fire({
            icon: "error",
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
        // setBlock(false)
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

  //** Clear filter
  const ClearFilter = () => {
    console.log("clear filter");
    setCurrentCol([]);
    setCurrentCol1();
    setSearchVal1([]);
    setSearchDate("");
    setSearchDate1("");
    setSearchDate2("");
    setSearchApi(true);
    setCurrentColcrdr([])
    setCurrentCol1crdr()
    setSearchValcrdr([]);
    setSearchValdoc([]);
    setCurrentColdoc([]);
    setGridCustomFilter([])
    setPageNoSelect(paginationList[0]);
    setFilterDropDownList({
      rateDropDownList: [],
      rcmDropDownList: [],
      noteTypeDropDownList: [],
      posDropDownList: [],
      uqcDropDownList: [],

    });
    setRowsPerPage(PageSize)
    setToDate('');
    setFromAmount('');
    setToAmount('');
    setFromValue('');
    setToValue('');
    setFromTax('')
    setToTax('');
    setFromIgst('')
    setToIgst('')
    setFromCgst('');
    setToCgst('');
    setFromSgst('');
    setToSgst('');
    setFromCess('');
    setToCess('');
    setFromQun('');
    setToQun('');
  };

  useEffect(() => {

    if (searchApi == true) {
      if (location.state) {
        actualData(activeTab, 0);
      }
      setSearchApi(false);
    }
  }, [searchApi, activeTab]);

  // ** Calculation function
  const calcutions = (values, invType) => {
    let tValue = 0;
    let sgst = 0;
    let cgst = 0;
    let cess = 0;
    let igst = 0;
    let count = 0;
    // debugger
    values.length
      ? values?.map((ele, index) => {
        count += parseFloat(ele?.InvoiceValue);
        tValue +=
          activeTab == 3
            ? parseFloat(ele?.TaxableValue)
            : parseFloat(ele?.TaxableValue);
        // ? parseFloat(ele?.TaxableAmount)
        // : parseFloat(ele?.TotalTaxableAmount);
        // TaxableValue
        sgst += parseFloat(ele?.SGST);
        cess += parseFloat(ele?.Cess);
        cgst += parseFloat(ele?.CGST);
        igst += parseFloat(ele?.IGST);
      })
      : "";



    function getUniqueInvoiceLength(values) {

      const uniqueInvoices = new Set();
      console.log(invType, 'invoceTypes')
      values.forEach(item => {
        
        if (invType == 1 || invType == 7) {
          if (item.InvoiceNumber && item.InvoiceDate && item.RecipientGSTIN) {
            const uniqueKey = item.InvoiceNumber + '|' + item.InvoiceDate + '|' + item.RecipientGSTIN;
            uniqueInvoices.add(uniqueKey);
          }
        } else if (invType == 2 || invType == 8) {
          if (item.RevisedInvoiceNumber && item.RevisedInvoiceDate && item.RecipientGSTIN) {
            const uniqueKey = item.RevisedInvoiceNumber + '|' + item.RevisedInvoiceDate + '|' + item.RecipientGSTIN;
            uniqueInvoices.add(uniqueKey);
          }
        } else if (invType == 3 || invType == 9 || invType == 11) {
          if (item.InvoiceNumber && item.InvoiceDate ) {
            const uniqueKey = item.InvoiceNumber + '|' + item.InvoiceDate ;
            uniqueInvoices.add(uniqueKey);
          }
        }else if (invType == 4 || invType == 10 || invType == 12) {
          if (item.RevisedInvoiceNumber && item.RevisedInvoiceDate ) {
            const uniqueKey = item.RevisedInvoiceNumber + '|' + item.RevisedInvoiceDate ;
            uniqueInvoices.add(uniqueKey);
          }
        }

      });

      return uniqueInvoices.size;
    }

    const uniqueLength = getUniqueInvoiceLength(values);
    if(invType == 5 || invType == 6 || invType == 13 || invType == 14 || invType == 15 || invType == 16 ||invType == 0){
      setTotalInvoice(values?.length);

    }else{
      setTotalInvoice(uniqueLength);

    } 

    // setTotalInvoice(values.length);
    setTotalIGST(igst);
    setTotalCess(cess);
    setTotalCGST(cgst);
    setTotalSGST(sgst);

    if (activeTab == 3 || activeTab == 4) {
      setTotalInvoiceValue(tValue + sgst + cess + cgst + igst); // Invoice Value Set
    } else {
      setTotalInvoiceValue(count); // Invoice Value Set
    }

    setTotalTaxableValue(tValue);
  };


  //** button - Action column
  function myLables(instance, td, row, col, prop, value, cellProperties) {
    Handsontable.renderers.TextRenderer.apply(this, arguments);
    td.innerHTML = `<div class="truncated">${value !== null && value !== "" ? value : ""}</div>`
  }


  useEffect(() => {

    if (paramsEncoded[1]) {
      setDisplayType(true)
      const userData = {
        clientid: G_UCParId,
        finyear: finYear,
        finmonth: finMonth,
        subscriptionId: subscriptionId,
        gstNumber: G_GSTIN,
        upload: alreadyUploaded
      };
      // debugger
      gstr1FiledSummaryList(
        activeTab,
        "",
        "",
        url,
        finYear,
        finYear,
        ""
      );
      console.log(url, "useEffeect")

      setBlock(true);
      dispatch(getGSTR1FiledSummary(userData));
    }
  }, []);


  // if (location.state == null )  {
  const gstrfiledDataDetailStateData = useSelector(
    (state) => state?.users?.GSTR1FiledSummary[0]?.Data
  );

  const loading = useSelector(
    (state) => state?.users?.isLoading
  );

  useEffect(() => {
    if (gstrfiledDataDetailStateData == undefined) {
      setBlock(true)
    }
    else {
      setBlock(false)
    }

  }, [gstrfiledDataDetailStateData])

  useEffect(() => {

    if (paramsEncoded[1]) {
      if (gstrfiledDataDetailStateData) {
        //  gstrfiledDataDetailState = gstrfiledDataDetailStateData

        let searchType =
          activeTab == 1
            ? invoceTypes?.value
            : activeTab == 2
              ? crdrInvoiceType?.value
              : activeTab == 4
                ? "7"
                : activeTab == 7
                  ? b2csInvoiceType?.value
                  : activeTab == 6
                    ? atInvoiceType?.value
                    : 0;

        let { tableDataArr } = actualData(activeTab, searchType);

        setData(tableDataArr);
        setDocData(tableDataArr)
        
        calcutions(tableDataArr,invoiceSecID);
        setBlock(false);
      }
    }

  }, [gstrfiledDataDetailStateData]);

  // For Design part of FromRange ToRange Filter
  const createOptionMinMax = (from, to, targetColumn) => ({
    name: `<div style="margin-top:10px">Min Value <br><input type='text' class='custom-date col-md-11' placeholder='Min Amount' id='amount1' name='amount1' value=${from}> <br>
    Max Value <br> <input type='text' class='custom-date col-md-11' placeholder='Max Amount' id='amount2' name='amount2' value=${to}>
    </div>`,
    hidden() {
      return this.getSelectedRangeLast().to.col !== targetColumn;
    },
    callback: function (key, selection, clickEvent) {
      console.log("input clicked");
      const src = clickEvent.target;
      if (src.tagName === "INPUT") {
        clickEvent.stopImmediatePropagation();
      }
      clickEvent.stopImmediatePropagation();
    },
  });

  document.addEventListener('input', function(event) {
    if (event.target.id === 'amount1' || event.target.id === 'amount2') {
      event.target.value = event.target.value.replace(/[^0-9,\.,\-]/g, '');
    }
  });

  // For custom Pagination
  const customPagination = () => {
    return (
      <Row className="justify-content-end mx-0">
        <Col
          className="d-flex align-items-center justify-content-end"
          md="12"
          sm="12"
        >
          {purchaseData?.length ? (<span>
            <b>{`${pageTotTitle}`}</b>  {" "}  &nbsp; &nbsp;
          </span>) : <></>}
          {purchaseData?.length ? (<Select
            id="pageId"
            isClearable={false}
            theme={selectThemeColors}
            closeMenuOnSelect={true}
            options={paginationList}
            className="basic-multi-select"
            classNamePrefix="select"
            components={animatedComponents}
            onChange={onPageChangeFunc}
            value={pageNoSelect}
            menuPlacement="auto"
          />) : (<></>)}
          &nbsp; &nbsp; {purchaseData?.length ? (<span  >
            <b>  {` ${paginationUi}`}</b>
          </span>) : <></>}     &nbsp; &nbsp;

          <ReactPaginate
            breakLabel="..."
            nextLabel=""
            onPageChange={(e) => handlePageClick(e?.selected)}
            pageRangeDisplayed={2}
            pageCount={pageCount}
            forcePage={page}
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
        </Col>
      </Row>

    );
  };


  return (
    <div>
      {(block || loading) && <div className="loading1">Loading&#8230;</div>}

      <div>
        <Row>
          <Col xs={12}>
            <Tabs
              className="mb-2"
              activeTab={activeTab}
              toggleTab={toggleTab}
              btnType={url}
            />
            <TabContent activeTab={activeTab}>
              {/*  Invoice  */}
              {activeTab == 1 &&
                <TabPane tabId="1" key="1">
                  <Card>
                    <CardBody className="CardBody p-0">
                      <Row className="p-1">
                        <Col md={8}>
                          <table className="table table-bordered summary-table">
                            <tbody>
                              <tr>
                                <td>
                                  <p className="mb-0">
                                    Invoices <br />
                                    <span>
                                      {" "}
                                      {totalInvoice
                                        ? formatTotalWithoutDecimal(totalInvoice)
                                        : 0}
                                    </span>
                                  </p>
                                </td>

                                <td>
                                  <p className="mb-0">
                                    {" "}
                                    Invoice Values (₹)
                                    <br />
                                    <span>
                                      {" "}
                                      {totalInvoiceValue
                                        ? formatINR(totalInvoiceValue)
                                        : 0}
                                    </span>
                                  </p>
                                </td>
                                <td>
                                  <p className="mb-0">
                                    Taxable Values{"  "} (₹)
                                    <br />
                                    <span>
                                      {totalTaxableValue
                                        ? formatINR(totalTaxableValue)
                                        : 0}
                                    </span>
                                  </p>
                                </td>

                                <td>
                                  <p className="mb-0">
                                    IGST (₹)
                                    <br />
                                    <span>
                                      {" "}
                                      {totalIGST ? formatINR(totalIGST) : 0}
                                    </span>
                                  </p>
                                </td>
                                <td>
                                  <p className="mb-0">
                                    SGST (₹)
                                    <br />
                                    <span>
                                      {" "}
                                      {totalSGST ? formatINR(totalSGST) : 0}
                                    </span>
                                  </p>
                                </td>
                                <td>
                                  <p className="mb-0">
                                    CGST (₹)
                                    <br />
                                    <span>
                                      {" "}
                                      {totalCGST ? formatINR(totalCGST) : 0}
                                    </span>
                                  </p>
                                </td>
                                <td>
                                  <p className="mb-0">
                                    Cess (₹)
                                    <br />
                                    <span>
                                      {totalCess ? formatINR(totalCess) : 0}
                                    </span>
                                  </p>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </Col>
                        <Col md={4}>
                          <Row>
                            <Col sm={4}>
                              <Label className="form-label">Invoice Type</Label>
                              <Select
                                id="purchaseId_invtype"
                                placeholder="Invoice Type"
                                theme={selectThemeColors}
                                components={animatedComponents}
                                options={invoiceTypeList}
                                classNamePrefix="select"
                                onChange={filterInvoiceType}
                                value={invoceTypes}

                              />
                            </Col>
                            <Col sm={4}>
                              <Label className="form-label">From</Label>
                              <Select
                                id="from"
                                placeholder="From"
                                isClearable={false}
                                theme={selectThemeColors}
                                closeMenuOnSelect={true}
                                options={panDataFrom}
                                // options={panData}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                components={animatedComponents}
                                onChange={selectFromYear}
                                value={finFromYear}
                                isDisabled={true}
                              />
                            </Col>

                            <Col sm={4}>
                              <Label className="form-label">To</Label>
                              <Select
                                id="to"
                                placeholder="To"
                                isClearable={false}
                                theme={selectThemeColors}
                                closeMenuOnSelect={true}
                                options={panData}
                                components={animatedComponents}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                onChange={selectFromMonth}
                                value={monthFrom}
                                isDisabled={true}
                              />
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                  <Card>
                    <CardBody className="CardBody p-0">
                      <Row>
                        <Col sm="12">
                          <div>
                            {/* Active tab 1 */}
                            {activeTab == 1 && (
                              <HotTable
                                id="test1"
                                ref={hotRef}
                                columnSorting={true}
                                renderAllRows={false}
                                rowHeights={RowSize}
                                columns={invalidColumns}
                                columnHeaderHeight={columnHeaderSize}
                                manualColumnResize={false}
                                dropdownMenu={{
                                  items: {
                                    filter_by_value: {
                                      name: "Search Value",
                                      // hide the 'Filter by value' list from all columns but the first one
                                      hidden() {
                                        const selectedValue = this.getSelected()[0][1];
                                        const isValidColumn = [3, 4, 5, 6, 7].includes(selectedValue);

                                        return isValidColumn;
                                      },
                                    },
                                    about: { // For CheckBox custom option

                                      name: `<div  style="margin-left:6px">${checkBoxTitle}<label class="float-end text-danger "><a><u id="selectAll">Select All</u></a></label></div> <div  class="checkboxmenu custom-scrollbar"> <div >  <table id="searchTable" >
                                      ${dropDonwName &&
                                        dropDonwName?.map((index) => (
                                          `<tr><td><input class="checkBoxClass" type="checkbox" value="${index?.label}" /> <span class="fw-normal">${index?.label?.length > 20 ? index?.label?.substring(0, 20) + "..." : index?.label}</span> </td></tr>`
                                        )).join('')
                                        }

                                        </table></div>
                                        </div>`, // Name can contain HTML
                                      hidden() {
                                        const selectedCol = this.getSelectedRangeLast().to.col;
                                        const isHiddenCol = ![7].includes(selectedCol);

                                        return isHiddenCol;
                                      },

                                      callback: function (key, selection, clickEvent) {

                                        var src = clickEvent.target;
                                        if (src.tagName == 'U') {
                                          if (clickEvent.target.id == 'selectAll') {
                                            $(".checkBoxClass").prop('checked', true);
                                          }

                                        }
                                        if (src.tagName == 'SPAN') {
                                          $('input[type="checkbox]').trigger('click').prop('checked', true);

                                        }
                                        clickEvent.stopImmediatePropagation();
                                      },

                                    },

                                    option6: createOptionMinMax(fromAmount, toAmount, 6),
                                    option4: createOptionMinMax(fromValue, toValue, 4),
                                    option5: createOptionMinMax(fromTax, toTax, 5),

                                    option3: {

                                      name: `<div style=${checkboxFilterCss}> From Date <br><input type='date' data-date="" data-date-format="DD MMMM YYYY" min='2017-07-01' max=${new Date()
                                        .toISOString()
                                        .slice(
                                          0,
                                          10
                                        )}  class='custom-date col-md-11' placeholder='DD-MM-YYYY' id='custom1' name='date' value=${searchDate ? searchDate : toDate} > <br/>

                                            To Date <br><input type='date' data-date="" data-date-format="DD MMMM YYYY" min='2017-07-01' max=${new Date()
                                          .toISOString()
                                          .slice(
                                            0,
                                            10
                                          )}  class='custom-date col-md-11' placeholder='DD-MM-YYYY' id='custom2' name='date' value=${toDate ? toDate : searchDate} >
                                           </div> `,
                                      hidden() {
                                        return (
                                          this.getSelectedRangeLast().to.col != 3
                                        );
                                      },

                                      //disabled: true,
                                      callback: function (
                                        key,
                                        selection,
                                        clickEvent
                                      ) {
                                        console.log("date picker clicked");
                                        var src = clickEvent.target;

                                        if (src.tagName === "INPUT") {
                                          console.log(
                                            "custom menu2",
                                            key,
                                            selection,
                                            clickEvent,
                                            src
                                          );
                                          clickEvent.stopImmediatePropagation();
                                        }

                                        console.log("custom value", src.value);

                                        clickEvent.stopImmediatePropagation();
                                      },
                                    },
                                    clear: {
                                      name: `<button id='btnClear' name='Clear'   value='Clear'>Clear</button>`,
                                      //disabled: true,
                                      callback: function (
                                        key,
                                        selection,
                                        clickEvent
                                      ) {
                                        console.log("date picker clicked");
                                        var src = clickEvent.target;
                                        console.log("name", src.tagName);
                                        if (
                                          src.tagName.toLowerCase() === "button"
                                        ) {
                                          if (
                                            clickEvent.target.id == "btnClear"
                                          ) {
                                            //** start
                                            if (hot?.getSelected()?.[0]?.[1] != 3 && hot?.getSelected()?.[0]?.[1] !== 7 && hot?.getSelected()?.[0]?.[1] !== 4 && hot?.getSelected()[0][1] !== 5 && hot?.getSelected()[0][1] !== 6) {
                                              var searchInput = document.querySelector(
                                                ".htUIMultipleSelectSearch.htUIInput"
                                              );
                                              var value = '';
                                              var x = searchVal1;
                                              var columnName = invalidColumns[currentCol1]?.data;
                                              let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                                              filterObject.push({ [columnName]: value });

                                              if (!searchVal1?.length) {

                                                x.push(value);
                                                let y = currentCol;
                                                y.push(
                                                  invalidColumns[currentCol1]?.data
                                                );
                                                setSearchVal1(x);
                                                setCurrentCol(y);
                                              } else {

                                                const Index = currentCol?.findIndex(
                                                  (item) =>
                                                    invalidColumns[currentCol1]?.data ==
                                                    item
                                                );
                                                if (Index != -1) {
                                                  const xyz = searchVal1;
                                                  xyz[Index] = value;
                                                  setSearchVal1(xyz);
                                                } else {
                                                  x.push(value);
                                                  let y = currentCol;
                                                  y.push(
                                                    invalidColumns[currentCol1]?.data
                                                  );
                                                  setSearchVal1(x);
                                                  setCurrentCol(y);
                                                }
                                              }

                                              setGridCustomFilter(filterObject)
                                              let newFilterData = FilterData(filterObject);
                                              setData([...newFilterData]);
                                            } else if (hot?.getSelected()?.[0]?.[1] == 7) {

                                              var checkboxes = document.getElementsByClassName('checkBoxClass');
                                              arrChk = []
                                              setFilterDropDownList([]);
                                              var columnName = invalidColumns[currentCol1]?.data;
                                              let filterObject = !gridCustomFilter ? [] : gridCustomFilter

                                              filterObject = filterObject == null || filterObject.length <= 0 ? [] : filterObject;

                                              for (let i = 0; i < checkboxes.length; i++) {
                                                if (checkboxes[i].checked) {

                                                  let uniqueArray = filterObject.filter((obj, index, self) =>
                                                    index === self.findIndex((t) => (
                                                      JSON.stringify(t) === JSON.stringify(obj)
                                                    ))
                                                  );
                                                  filterObject = uniqueArray
                                                  const index = filterObject.findIndex(obj => obj[columnName] === checkboxes[i].value);
                                                  if (index !== -1) {

                                                    delete filterObject[index][columnName];
                                                  }
                                                }
                                              }
                                              setGridCustomFilter(filterObject)
                                              let newFilterData = FilterData(filterObject);
                                              setData([...newFilterData]);

                                              const updatedFilterDropDownList = filterObject.reduce((acc, item) => {
                                                const { Rate, ReverseCharge, NoteType, InvoiceType, PlaceOfSupply, ITCAvaliable } = item;

                                                const updateList = (list, value) => {
                                                  return list.includes(value) ? list : [...list, value];
                                                };

                                                if (Rate !== undefined) {
                                                  acc.rateDropDownList = updateList(acc.rateDropDownList, Rate);
                                                } else if (ReverseCharge !== undefined) {
                                                  acc.rcmDropDownList = updateList(acc.rcmDropDownList, ReverseCharge);
                                                } else if (NoteType !== undefined) {
                                                  acc.noteTypeDropDownList = updateList(acc.noteTypeDropDownList, NoteType);
                                                } else if (PlaceOfSupply !== undefined) {
                                                  acc.posDropDownList = updateList(acc.posDropDownList, PlaceOfSupply);
                                                }

                                                return acc;
                                              }, { rateDropDownList: [], rcmDropDownList: [], noteTypeDropDownList: [], invoiceTypeDropDownList: [], posDropDownList: [], itcDropDownList: [] });

                                              setFilterDropDownList(updatedFilterDropDownList);

                                            } else if (hot?.getSelected()[0][1] == 4 || hot?.getSelected()[0][1] == 5 || hot?.getSelected()[0][1] == 6) {


                                              var columnName = invalidColumns[currentCol1]?.data;
                                              var value = '';
                                              hot?.getSelected()[0][1] == 6 && setFromAmount('');
                                              hot?.getSelected()[0][1] == 6 && setToAmount('');
                                              hot?.getSelected()[0][1] == 4 && setFromValue('');
                                              hot?.getSelected()[0][1] == 4 && setToValue('');
                                              hot?.getSelected()[0][1] == 5 && setFromTax('');
                                              hot?.getSelected()[0][1] == 5 && setToTax('');
                                              let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                                              filterObject.push({ [columnName]: value });
                                              setGridCustomFilter(filterObject)
                                              let newFilterData = FilterData(filterObject);
                                              setData([...newFilterData]);

                                            } else {

                                              var searchInput1 = document.getElementById("custom1");
                                              var searchInput2 = document.getElementById("custom2");
                                              const invFromDate = searchInput1?.value
                                              const invToDate = searchInput2?.value
                                              var columnName = invalidColumns[currentCol1]?.data;
                                              var value = '';
                                              setSearchDate('');
                                              setToDate('');
                                              let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                                              filterObject.push({ [columnName]: value });
                                              setGridCustomFilter(filterObject)
                                              let newFilterData = FilterData(filterObject);
                                              setData([...newFilterData]);
                                            }
                                            //** End
                                          }

                                          clickEvent.stopImmediatePropagation();
                                        }

                                        console.log("custom value", src.value);

                                        clickEvent.stopImmediatePropagation();
                                      },
                                    },

                                    filter_action_bar: {},
                                  },
                                }}
                                afterDropdownMenuShow={function (instance) {
                                  var checkboxes = document.getElementsByClassName('checkBoxClass');

                                  const {
                                    rcmDropDownList,
                                  } = filterDropDownList;

                                  const listsToCheck = [
                                    rcmDropDownList,
                                  ];

                                  for (var j = 0; j < checkboxes.length; j++) {
                                    for (var k = 0; k < listsToCheck.length; k++) {
                                      if (listsToCheck[k]) {

                                        // For rcmDropDownList, check both conditions listsToCheck[k][i] == checkboxes[j].value and checkboxes?.length == 2
                                        if (k === 0) {

                                          for (var i = 0; i < listsToCheck[k].length; i++) {
                                            if (listsToCheck[k][i] == checkboxes[j].value) {
                                              $(checkboxes[j]).prop("checked", true);
                                              break;
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }}
                                afterFilter={function (data, coords) {
                                  const hot = hotRef?.current?.hotInstance;

                                  if (hot?.getSelected()?.[0]?.[1] != 3 && hot?.getSelected()?.[0]?.[1] !== 7 && hot?.getSelected()?.[0]?.[1] !== 4 && hot?.getSelected()[0][1] !== 5 && hot?.getSelected()[0][1] !== 6) {
                                    var searchInput = document.querySelector(
                                      ".htUIMultipleSelectSearch.htUIInput"
                                    );
                                    var value = searchInput?.children[0]?.value;
                                    var x = searchVal1;
                                    var columnName = invalidColumns[currentCol1]?.data;
                                    let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                                    filterObject.push({ [columnName]: value });

                                    if (!searchVal1?.length) {

                                      x.push(value);
                                      let y = currentCol;
                                      y.push(
                                        invalidColumns[currentCol1]?.data
                                      );
                                      setSearchVal1(x);
                                      setCurrentCol(y);
                                    } else {

                                      const Index = currentCol?.findIndex(
                                        (item) =>
                                          invalidColumns[currentCol1]?.data ==
                                          item
                                      );
                                      if (Index != -1) {
                                        const xyz = searchVal1;
                                        xyz[Index] = value;
                                        setSearchVal1(xyz);
                                      } else {
                                        x.push(value);
                                        let y = currentCol;
                                        y.push(
                                          invalidColumns[currentCol1]?.data
                                        );
                                        setSearchVal1(x);
                                        setCurrentCol(y);
                                      }
                                    }

                                    setGridCustomFilter(filterObject)
                                    let newFilterData = FilterData(filterObject);
                                    setData([...newFilterData]);
                                  } else if (hot?.getSelected()?.[0]?.[1] == 7) {

                                    var checkboxes = document.getElementsByClassName('checkBoxClass');
                                    arrChk = []
                                    setFilterDropDownList([]);
                                    var columnName = invalidColumns[currentCol1]?.data;
                                    let filterObject = !gridCustomFilter ? [] : gridCustomFilter

                                    filterObject = filterObject == null || filterObject.length <= 0 ? [] : filterObject;

                                    for (let i = 0; i < checkboxes.length; i++) {
                                      if (checkboxes[i].checked) {

                                        arrChk.push({ [columnName]: checkboxes[i].value });

                                        filterObject.push({ [columnName]: checkboxes[i].value });
                                      } else {

                                        let uniqueArray = filterObject.filter((obj, index, self) =>
                                          index === self.findIndex((t) => (
                                            JSON.stringify(t) === JSON.stringify(obj)
                                          ))
                                        );
                                        filterObject = uniqueArray
                                        const index = filterObject.findIndex(obj => obj[columnName] === checkboxes[i].value);
                                        if (index !== -1) {

                                          delete filterObject[index][columnName];
                                        }
                                      }
                                    }
                                    setGridCustomFilter(filterObject)
                                    let newFilterData = FilterData(filterObject);
                                    setData([...newFilterData]);

                                    const updatedFilterDropDownList = filterObject.reduce((acc, item) => {
                                      const { Rate, ReverseCharge, NoteType, InvoiceType, PlaceOfSupply, ITCAvaliable } = item;

                                      const updateList = (list, value) => {
                                        return list.includes(value) ? list : [...list, value];
                                      };

                                      if (Rate !== undefined) {
                                        acc.rateDropDownList = updateList(acc.rateDropDownList, Rate);
                                      } else if (ReverseCharge !== undefined) {
                                        acc.rcmDropDownList = updateList(acc.rcmDropDownList, ReverseCharge);
                                      } else if (NoteType !== undefined) {
                                        acc.noteTypeDropDownList = updateList(acc.noteTypeDropDownList, NoteType);
                                      } else if (PlaceOfSupply !== undefined) {
                                        acc.posDropDownList = updateList(acc.posDropDownList, PlaceOfSupply);
                                      }

                                      return acc;
                                    }, { rateDropDownList: [], rcmDropDownList: [], noteTypeDropDownList: [], invoiceTypeDropDownList: [], posDropDownList: [], itcDropDownList: [] });

                                    setFilterDropDownList(updatedFilterDropDownList);

                                  } else if (hot?.getSelected()[0][1] == 4 || hot?.getSelected()[0][1] == 5 || hot?.getSelected()[0][1] == 6) {

                                    var searchInput1 = document.getElementById("amount1");
                                    var searchInput2 = document.getElementById("amount2");
                                    const invFromDate = (searchInput1?.value)?.replaceAll(",", "")
                                    const invToDate = (searchInput2?.value)?.replaceAll(",", "")
                                    var columnName = invalidColumns[currentCol1]?.data;
                                    var value = `${invFromDate}to${invToDate}`;

                                    hot?.getSelected()[0][1] == 6 && setFromAmount(searchInput1?.value);
                                    hot?.getSelected()[0][1] == 6 && setToAmount(searchInput2?.value);
                                    hot?.getSelected()[0][1] == 4 && setFromValue(searchInput1?.value);
                                    hot?.getSelected()[0][1] == 4 && setToValue(searchInput2?.value);
                                    hot?.getSelected()[0][1] == 5 && setFromTax(searchInput1?.value);
                                    hot?.getSelected()[0][1] == 5 && setToTax(searchInput2?.value);
                                    let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                                    filterObject.push({ [columnName]: value });
                                    setGridCustomFilter(filterObject)
                                    let newFilterData = FilterData(filterObject);
                                    setData([...newFilterData]);

                                  } else {

                                    var searchInput1 = document.getElementById("custom1");
                                    var searchInput2 = document.getElementById("custom2");
                                    const invFromDate = searchInput1?.value
                                    const invToDate = searchInput2?.value
                                    var columnName = invalidColumns[currentCol1]?.data;
                                    var value = (searchInput1?.value || searchInput2?.value) && `${invFromDate ? invFromDate : invToDate}to${invToDate ? invToDate : invFromDate}`;
                                    setSearchDate(searchInput1?.value);
                                    setToDate(searchInput2?.value);
                                    let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                                    filterObject.push({ [columnName]: value });
                                    setGridCustomFilter(filterObject)
                                    let newFilterData = FilterData(filterObject);
                                    setData([...newFilterData]);
                                  }

                                }}
                                stretchH="all"
                                data={GSTR1FiledData.length > 0 ? GSTR1FiledData : [{ RecipientGSTIN: "No Data Found!" }]}
                                mergeCells={[GSTR1FiledData.length > 0 ? false :
                                  { row: 0, col: 0, rowspan: 1, colspan: 7 },
                                ]}
                                afterGetColHeader={theader}
                                rowHeaders={false}
                                filters={true}

                                viewportColumnRenderingOffset={200}
                                bindRowsWithHeaders={false}
                                licenseKey="non-commercial-and-evaluation"
                                afterOnCellMouseDown={localAfterOnCellMouseDown}
                                selectionMode="range"
                                cells={function (row, col) {
                                  var cp = {};
                                  const hot = hotRef?.current?.hotInstance;
                                  if (col == 0 && !GSTR1FiledData.length > 0) {

                                    cp.className = "text-center";
                                  }
                                  if (col !== null) {
                                    cp.renderer = emptyRender;
                                  }
                                  if (col == 5 || col == 6 || col == 4) {
                                    cp.className = "text-end";
                                  }
                                  return cp;
                                }}
                                height="auto"

                              />
                            )}

                            {customPagination()}

                          </div>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </TabPane>
              }
              {/*  credit / debit  */}
              {activeTab == 2 &&
                <TabPane tabId="2" key="2">
                  <Card>
                    <CardBody className="CardBody p-0">
                      <Row className="p-1">
                        <Col md={8}>
                          <table className="table table-bordered summary-table">
                            <tbody>
                              <tr>
                                <td>
                                  <p className="mb-0">
                                    Invoices <br />
                                    <span>
                                      {" "}
                                      {totalInvoice
                                        ? formatTotalWithoutDecimal(totalInvoice)
                                        : 0}
                                    </span>
                                  </p>
                                </td>

                                <td>
                                  <p className="mb-0">
                                    {" "}
                                    Invoice Values (₹) <br />
                                    <span>
                                      {" "}
                                      {totalInvoiceValue
                                        ? formatINR(totalInvoiceValue)
                                        : 0}
                                    </span>
                                  </p>
                                </td>
                                <td>
                                  <p className="mb-0">
                                    Taxable Values (₹){"  "} <br />
                                    <span>
                                      {totalTaxableValue
                                        ? formatINR(totalTaxableValue)
                                        : 0}
                                    </span>
                                  </p>
                                </td>

                                <td>
                                  <p className="mb-0">
                                    IGST (₹) <br />
                                    <span>
                                      {" "}
                                      {totalIGST ? formatINR(totalIGST) : 0}
                                    </span>
                                  </p>
                                </td>
                                <td>
                                  <p className="mb-0">
                                    SGST (₹) <br />
                                    <span>
                                      {" "}
                                      {totalSGST ? formatINR(totalSGST) : 0}
                                    </span>
                                  </p>
                                </td>
                                <td>
                                  <p className="mb-0">
                                    CGST (₹) <br />
                                    <span>
                                      {" "}
                                      {totalCGST ? formatINR(totalCGST) : 0}
                                    </span>
                                  </p>
                                </td>
                                <td>
                                  <p className="mb-0">
                                    Cess (₹)
                                    <br />
                                    <span>
                                      {totalCess ? formatINR(totalCess) : 0}
                                    </span>
                                  </p>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </Col>
                        <Col md={4}>
                          <Row>
                            <Col sm={4}>
                              <Label className="form-label">Invoice Type</Label>
                              <Select
                                id="crdr_invtype"
                                placeholder="Invoice Type"
                                theme={selectThemeColors}
                                components={animatedComponents}
                                //  isMulti
                                options={crdrInvoiceTypeList}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                onChange={crdrFilterInvoiceType}
                                value={crdrInvoiceType}
                              />
                            </Col>
                            <Col sm={4}>
                              <Label className="form-label">From</Label>
                              <Select
                                id="from1"
                                placeholder="From"
                                isClearable={false}
                                theme={selectThemeColors}
                                closeMenuOnSelect={true}
                                options={panDataFrom}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                components={animatedComponents}
                                onChange={selectFromYear}
                                value={finFromYear}
                                isDisabled={true}
                              />
                            </Col>
                            <Col sm={4}>
                              <Label className="form-label">To</Label>
                              <Select
                                id="to1"
                                placeholder="To"
                                isClearable={false}
                                theme={selectThemeColors}
                                closeMenuOnSelect={true}
                                options={panData}
                                components={animatedComponents}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                onChange={selectFromMonth}
                                value={monthFrom}
                                isDisabled={true}
                              />
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                  <CardBody className="CardBody p-0">
                    <Row>
                      <Col sm="12">
                        <div>
                          {/* Active tab 2 */}
                          {activeTab == 2 && (
                            <HotTable
                              ref={hotRefCrdrVendor}
                              viewportColumnRenderingOffset={100}
                              columnSorting={true}
                              renderAllRows={false}
                              rowHeights={RowSize}
                              data={GSTR1FiledData.length > 0 ? GSTR1FiledData : [{ RecipientGSTIN: "No Data Found!" }]}
                              columns={GSTR1FiledData.length > 0 ? crDrInvalidColumns : crDrInvalidColumnsEmpty}
                              columnHeaderHeight={columnHeaderSize}
                              autoColumnSize={{
                                samplingRatio: 23  // Adjust the samplingRatio as needed
                              }}
                              mergeCells={[GSTR1FiledData.length > 0 ? false :
                                { row: 0, col: 0, rowspan: 1, colspan: 9 },
                              ]}
                              manualColumnResize={false}
                              dropdownMenu={{
                                items: {
                                  filter_by_value: {
                                    name: "Search Value",
                                    // hide the 'Filter by value' list from all columns but the first one
                                    hidden() {
                                      const selectedValue = this.getSelected()[0][1];
                                      const isValidColumn = [3, 4, 5, 6, 8, 7].includes(selectedValue);
                                      return isValidColumn;
                                    },
                                  },
                                  about: { // For CheckBox custom option

                                    name: `<div  style=${checkboxFilterCss}>${checkBoxTitle}<label class="float-end text-danger "><a><u id="selectAll">Select All</u></a></label></div> <div  class="checkboxmenu custom-scrollbar"> <div >  <table id="searchTable" >
                                    ${dropDonwName &&
                                      dropDonwName?.map((index) => (
                                        `<tr><td><input class="checkBoxClass" type="checkbox" value="${index?.label}" /> <span class="fw-normal">${index?.label?.length > 20 ? index?.label?.substring(0, 20) + "..." : index?.label}</span> </td></tr>`
                                      )).join('')
                                      }

                                      </table></div>
                                      </div>`, // Name can contain HTML
                                    hidden() {
                                      const selectedCol = this.getSelectedRangeLast().to.col;
                                      const isHiddenCol = ![8, 7].includes(selectedCol);

                                      return isHiddenCol;
                                    },

                                    callback: function (key, selection, clickEvent) {

                                      var src = clickEvent.target;
                                      if (src.tagName == 'U') {
                                        if (clickEvent.target.id == 'selectAll') {
                                          $(".checkBoxClass").prop('checked', true);
                                        }

                                      }
                                      if (src.tagName == 'SPAN') {
                                        $('input[type="checkbox]').trigger('click').prop('checked', true);

                                      }
                                      clickEvent.stopImmediatePropagation();
                                    },

                                  },
                                  option4: createOptionMinMax(fromValue, toValue, 4),
                                  option5: createOptionMinMax(fromTax, toTax, 5),
                                  option6: createOptionMinMax(fromAmount, toAmount, 6),
                                  option3: {

                                    name: `<div style="margin-top:10px"> From Date <br><input type='date' data-date="" data-date-format="DD MMMM YYYY" min='2017-07-01' max=${new Date()
                                      .toISOString()
                                      .slice(
                                        0,
                                        10
                                      )}  class='custom-date col-md-11' placeholder='DD-MM-YYYY' id='custom1' name='date' value=${searchDate ? searchDate : toDate} > <br/>

                                            To Date <br><input type='date' data-date="" data-date-format="DD MMMM YYYY" min='2017-07-01' max=${new Date()
                                        .toISOString()
                                        .slice(
                                          0,
                                          10
                                        )}  class='custom-date col-md-11' placeholder='DD-MM-YYYY' id='custom2' name='date' value=${toDate ? toDate : searchDate} >
                                           </div> `,
                                    hidden() {
                                      return (
                                        this.getSelectedRangeLast().to.col != 3
                                      );
                                    },

                                    //disabled: true,
                                    callback: function (
                                      key,
                                      selection,
                                      clickEvent
                                    ) {
                                      console.log("date picker clicked");
                                      var src = clickEvent.target;

                                      if (src.tagName === "INPUT") {
                                        console.log(
                                          "custom menu2",
                                          key,
                                          selection,
                                          clickEvent,
                                          src
                                        );
                                        clickEvent.stopImmediatePropagation();
                                      }

                                      console.log("custom value", src.value);

                                      clickEvent.stopImmediatePropagation();
                                    },
                                  },

                                  clear: {
                                    name: `<button id='btnClear' name='Clear'   value='Clear'>Clear</button>`,
                                    //disabled: true,
                                    callback: function (
                                      key,
                                      selection,
                                      clickEvent
                                    ) {
                                      console.log("date picker clicked");
                                      var src = clickEvent.target;
                                      console.log("name", src.tagName);
                                      if (
                                        src.tagName.toLowerCase() === "button"
                                      ) {
                                        if (clickEvent.target.id == "btnClear") {
                                          //** start
                                          const hot =
                                            hotRefCrdrVendor?.current
                                              ?.hotInstance;

                                          if (hot?.getSelected()?.[0]?.[1] != 3 && hot?.getSelected()?.[0]?.[1] != 4 && hot?.getSelected()?.[0]?.[1] != 5 && hot?.getSelected()?.[0]?.[1] != 6 && hot?.getSelected()?.[0]?.[1] !== 7 && hot?.getSelected()?.[0]?.[1] !== 8) {
                                            const x = searchValcrdr;

                                            var value = '';

                                            var columnName = crDrInvalidColumns[currentCol1crdr]?.data;
                                            let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                                            filterObject.push({ [columnName]: value });

                                            if (!searchValcrdr?.length) {
                                              x.push(value);
                                              let y = currentColcrdr;
                                              y.push(
                                                crDrInvalidColumns[currentCol1crdr]
                                                  ?.data
                                              );
                                              setSearchValcrdr(x);
                                              setCurrentColcrdr(y);
                                            } else {
                                              const Index =
                                                currentColcrdr?.findIndex(
                                                  (item) =>
                                                    crDrInvalidColumns[
                                                      currentCol1crdr
                                                    ]?.data == item
                                                );
                                              if (Index != -1) {
                                                const xyz = searchValcrdr;
                                                xyz[Index] = value;
                                                setSearchValcrdr(xyz);
                                              } else {
                                                x.push(value);
                                                let y = currentColcrdr;
                                                y.push(
                                                  crDrInvalidColumns[
                                                    currentCol1crdr
                                                  ]?.data
                                                );

                                                setSearchValcrdr(x);
                                                setCurrentColcrdr(y);
                                              }
                                            }

                                            setGridCustomFilter(filterObject)
                                            let newFilterData = FilterData(filterObject);
                                            setData([...newFilterData]);
                                          } else if (hot?.getSelected()?.[0]?.[1] == 7 || hot?.getSelected()?.[0]?.[1] == 8) {

                                            var checkboxes = document.getElementsByClassName('checkBoxClass');
                                            arrChk = []
                                            setFilterDropDownList([]);
                                            var columnName = crDrInvalidColumns[currentCol1crdr]?.data;
                                            let filterObject = !gridCustomFilter ? [] : gridCustomFilter

                                            filterObject = filterObject == null || filterObject.length <= 0 ? [] : filterObject;

                                            for (let i = 0; i < checkboxes.length; i++) {
                                              if (checkboxes[i].checked) {
                                                let uniqueArray = filterObject.filter((obj, index, self) =>
                                                  index === self.findIndex((t) => (
                                                    JSON.stringify(t) === JSON.stringify(obj)
                                                  ))
                                                );
                                                filterObject = uniqueArray
                                                const index = filterObject.findIndex(obj => obj[columnName] === checkboxes[i].value);
                                                if (index !== -1) {

                                                  delete filterObject[index][columnName];
                                                }
                                              }
                                            }
                                            setGridCustomFilter(filterObject)
                                            let newFilterData = FilterData(filterObject);
                                            setData([...newFilterData]);

                                            const updatedFilterDropDownList = filterObject.reduce((acc, item) => {
                                              const { Rate, ReverseCharge, NoteType, InvoiceType, PlaceOfSupply, ITCAvaliable } = item;

                                              const updateList = (list, value) => {
                                                return list.includes(value) ? list : [...list, value];
                                              };

                                              if (Rate !== undefined) {
                                                acc.rateDropDownList = updateList(acc.rateDropDownList, Rate);
                                              } else if (ReverseCharge !== undefined) {
                                                acc.rcmDropDownList = updateList(acc.rcmDropDownList, ReverseCharge);
                                              } else if (NoteType !== undefined) {
                                                acc.noteTypeDropDownList = updateList(acc.noteTypeDropDownList, NoteType);
                                              } else if (PlaceOfSupply !== undefined) {
                                                acc.posDropDownList = updateList(acc.posDropDownList, PlaceOfSupply);
                                              }

                                              return acc;
                                            }, { rateDropDownList: [], rcmDropDownList: [], noteTypeDropDownList: [], invoiceTypeDropDownList: [], posDropDownList: [], itcDropDownList: [] });

                                            setFilterDropDownList(updatedFilterDropDownList);

                                          } else if (hot?.getSelected()[0][1] == 4 || hot?.getSelected()[0][1] == 5 || hot?.getSelected()[0][1] == 6) {


                                            var columnName = crDrInvalidColumns[currentCol1crdr]?.data;
                                            var value = '';

                                            hot?.getSelected()[0][1] == 4 && setFromValue('');
                                            hot?.getSelected()[0][1] == 4 && setToValue('');
                                            hot?.getSelected()[0][1] == 5 && setFromTax('');
                                            hot?.getSelected()[0][1] == 5 && setToTax('');
                                            hot?.getSelected()[0][1] == 6 && setFromAmount('');
                                            hot?.getSelected()[0][1] == 6 && setToAmount('');
                                            let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                                            filterObject.push({ [columnName]: value });
                                            setGridCustomFilter(filterObject)
                                            let newFilterData = FilterData(filterObject);
                                            setData([...newFilterData]);

                                          } else {


                                            var columnName = crDrInvalidColumns[currentCol1crdr]?.data;
                                            var value = '';
                                            setSearchDate('');
                                            setToDate('');
                                            let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                                            filterObject.push({ [columnName]: value });
                                            setGridCustomFilter(filterObject)
                                            let newFilterData = FilterData(filterObject);
                                            setData([...newFilterData]);
                                          }



                                        }
                                        clickEvent.stopImmediatePropagation();
                                      }
                                      console.log("custom value", src.value);
                                      clickEvent.stopImmediatePropagation();
                                    },
                                  },
                                  filter_action_bar: {},
                                },
                              }}
                              afterDropdownMenuShow={function (instance) {
                                var checkboxes = document.getElementsByClassName('checkBoxClass');
                                const {
                                  rcmDropDownList, noteTypeDropDownList
                                } = filterDropDownList;

                                const listsToCheck = [
                                  rcmDropDownList, noteTypeDropDownList
                                ];


                                for (var j = 0; j < checkboxes.length; j++) {

                                  for (var k = 0; k < listsToCheck.length; k++) {
                                    if (listsToCheck[k]) {


                                      if (k === 0 || k === 1) {

                                        for (var i = 0; i < listsToCheck[k].length; i++) {
                                          if (listsToCheck[k][i] == checkboxes[j].value) {
                                            $(checkboxes[j]).prop("checked", true);
                                            break;
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }}
                              afterFilter={function (data, coords) {
                                const hot =
                                  hotRefCrdrVendor?.current?.hotInstance;

                                if (hot?.getSelected()?.[0]?.[1] != 3 && hot?.getSelected()?.[0]?.[1] != 4 && hot?.getSelected()?.[0]?.[1] != 5 && hot?.getSelected()?.[0]?.[1] != 6 && hot?.getSelected()?.[0]?.[1] !== 7 && hot?.getSelected()?.[0]?.[1] !== 8) {

                                  var searchInput = document.querySelector(
                                    ".htUIMultipleSelectSearch.htUIInput"
                                  );
                                  var value = searchInput.children[0].value;
                                  const x = searchValcrdr;

                                  var columnName = crDrInvalidColumns[currentCol1crdr]?.data;
                                  let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                                  filterObject.push({ [columnName]: value });


                                  if (!searchValcrdr?.length) {
                                    x.push(value);
                                    let y = currentColcrdr;
                                    y.push(
                                      crDrInvalidColumns[currentCol1crdr]
                                        ?.data
                                    );
                                    setSearchValcrdr(x);
                                    setCurrentColcrdr(y);
                                  } else {
                                    const Index =
                                      currentColcrdr?.findIndex(
                                        (item) =>
                                          crDrInvalidColumns[
                                            currentCol1crdr
                                          ]?.data == item
                                      );
                                    if (Index != -1) {
                                      const xyz = searchValcrdr;
                                      xyz[Index] = value;
                                      setSearchValcrdr(xyz);
                                    } else {
                                      x.push(value);
                                      let y = currentColcrdr;
                                      y.push(
                                        crDrInvalidColumns[
                                          currentCol1crdr
                                        ]?.data
                                      );

                                      setSearchValcrdr(x);
                                      setCurrentColcrdr(y);
                                    }
                                  }

                                  setGridCustomFilter(filterObject)
                                  let newFilterData = FilterData(filterObject);
                                  setData([...newFilterData]);
                                } else if (hot?.getSelected()?.[0]?.[1] == 7 || hot?.getSelected()?.[0]?.[1] == 8) {

                                  var checkboxes = document.getElementsByClassName('checkBoxClass');
                                  arrChk = []
                                  setFilterDropDownList([]);
                                  var columnName = crDrInvalidColumns[currentCol1crdr]?.data;
                                  let filterObject = !gridCustomFilter ? [] : gridCustomFilter

                                  filterObject = filterObject == null || filterObject.length <= 0 ? [] : filterObject;

                                  for (let i = 0; i < checkboxes.length; i++) {
                                    if (checkboxes[i].checked) {

                                      arrChk.push({ [columnName]: checkboxes[i].value });

                                      filterObject.push({ [columnName]: checkboxes[i].value });
                                    } else {

                                      let uniqueArray = filterObject.filter((obj, index, self) =>
                                        index === self.findIndex((t) => (
                                          JSON.stringify(t) === JSON.stringify(obj)
                                        ))
                                      );
                                      filterObject = uniqueArray
                                      const index = filterObject.findIndex(obj => obj[columnName] === checkboxes[i].value);
                                      if (index !== -1) {

                                        delete filterObject[index][columnName];
                                      }
                                    }
                                  }
                                  setGridCustomFilter(filterObject)
                                  let newFilterData = FilterData(filterObject);
                                  setData([...newFilterData]);

                                  const updatedFilterDropDownList = filterObject.reduce((acc, item) => {
                                    const { ReverseCharge, NoteType, } = item;

                                    const updateList = (list, value) => {
                                      return list.includes(value) ? list : [...list, value];
                                    };

                                    if (ReverseCharge !== undefined) {
                                      acc.rcmDropDownList = updateList(acc.rcmDropDownList, ReverseCharge);
                                    } else if (NoteType !== undefined) {
                                      acc.noteTypeDropDownList = updateList(acc.noteTypeDropDownList, NoteType);
                                    }

                                    return acc;
                                  }, { rcmDropDownList: [], noteTypeDropDownList: [] });

                                  setFilterDropDownList(updatedFilterDropDownList);

                                } else if (hot?.getSelected()[0][1] == 4 || hot?.getSelected()[0][1] == 5 || hot?.getSelected()[0][1] == 6) {

                                  var searchInput1 = document.getElementById("amount1");
                                  var searchInput2 = document.getElementById("amount2");
                                  const invFromDate = searchInput1?.value
                                  const invToDate = searchInput2?.value
                                  var columnName = crDrInvalidColumns[currentCol1crdr]?.data;
                                  var value = `${invFromDate}to${invToDate}`;

                                  hot?.getSelected()[0][1] == 4 && setFromValue(searchInput1?.value);
                                  hot?.getSelected()[0][1] == 4 && setToValue(searchInput2?.value);
                                  hot?.getSelected()[0][1] == 5 && setFromTax(searchInput1?.value);
                                  hot?.getSelected()[0][1] == 5 && setToTax(searchInput2?.value);
                                  hot?.getSelected()[0][1] == 6 && setFromAmount(searchInput1?.value);
                                  hot?.getSelected()[0][1] == 6 && setToAmount(searchInput2?.value);
                                  let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                                  filterObject.push({ [columnName]: value });
                                  setGridCustomFilter(filterObject)
                                  let newFilterData = FilterData(filterObject);
                                  setData([...newFilterData]);

                                } else {

                                  var searchInput1 = document.getElementById("custom1");
                                  var searchInput2 = document.getElementById("custom2");
                                  const invFromDate = searchInput1?.value
                                  const invToDate = searchInput2?.value
                                  var columnName = crDrInvalidColumns[currentCol1crdr]?.data;
                                  var value = (searchInput1?.value || searchInput2?.value) && `${invFromDate ? invFromDate : invToDate}to${invToDate ? invToDate : invFromDate}`;
                                  setSearchDate(searchInput1?.value);
                                  setToDate(searchInput2?.value);
                                  let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                                  filterObject.push({ [columnName]: value });
                                  setGridCustomFilter(filterObject)
                                  let newFilterData = FilterData(filterObject);
                                  setData([...newFilterData]);
                                }

                                // const x = searchValcrdr;
                                // if (!searchValcrdr?.length) {
                                //   x.push(value);
                                //   let y = currentColcrdr;
                                //   y.push(
                                //     crDrInvalidColumns[currentCol1crdr]?.data
                                //   );
                                //   setSearchValcrdr(x);
                                //   setCurrentColcrdr(y);
                                // } else {
                                //   const Index = currentColcrdr?.findIndex(
                                //     (item) =>
                                //       crDrInvalidColumns[currentCol1crdr]?.data ==
                                //       item
                                //   );
                                //   if (Index != -1) {
                                //     const xyz = searchValcrdr;
                                //     xyz[Index] = value;
                                //     setSearchValcrdr(xyz);
                                //   } else {
                                //     x.push(value);
                                //     let y = currentColcrdr;
                                //     y.push(
                                //       crDrInvalidColumns[currentCol1crdr]?.data
                                //     );

                                //     setSearchValcrdr(x);
                                //     setCurrentColcrdr(y);
                                //   }
                                // }

                                // let arrFilter = [];
                                // let uniq = [...new Set(currentColcrdr)];

                                // for (let i = 0; i < uniq.length; i++) {
                                //   var obj = {};

                                //   for (let j = 0; j < searchValcrdr.length; j++) {
                                //     if (i == j) {
                                //       obj[uniq[i]] = searchValcrdr[j];
                                //       arrFilter.push(obj);
                                //     }
                                //   }
                                // }
                                // let newFilterData = FilterData(arrFilter);
                                // setData([...newFilterData]);
                              }}
                              // autoColumnSize={true}
                              stretchH="all"
                              afterGetColHeader={theader}
                              colHeaders={colHeaders}
                              rowHeaders={false}
                              filters={true}
                              hiddenColumns={{
                                columns: [9],
                              }}
                              height="auto"
                              bindRowsWithHeaders={false}
                              licenseKey="non-commercial-and-evaluation"
                              afterOnCellMouseDown={CrDrlocalAfterOnCellMouseDown}
                              selectionMode="range"
                              cells={function (row, col) {
                                var cp = {};
                                const hot =
                                  hotRefCrdrVendor?.current?.hotInstance;
                                if (col !== null) {
                                  cp.renderer = emptyRender;
                                }
                                if (col == 0 && !GSTR1FiledData.length > 0) {

                                  cp.className = "text-center";
                                }
                                if (col == 5 || col == 6 || col == 4) {
                                  cp.className = "text-end";
                                }
                                return cp;
                              }}
                            />
                          )}

                        </div>
                      </Col>
                    </Row>
                    {customPagination()}

                  </CardBody>
                </TabPane>
              }
              {/* B2CS/B2CSA */}
              {activeTab == 7 &&
                <TabPane tabId="7" key="7">
                  <Card>
                    <CardBody className="CardBody p-0">
                      <Row className="p-1">
                        <Col md={8}>
                          <table className="table table-bordered summary-table">
                            <tbody>
                              <tr>
                                <td>
                                  <p className="mb-0">
                                    Invoices <br />
                                    <span>
                                      {totalInvoice
                                        ? formatTotalWithoutDecimal(totalInvoice)
                                        : 0}
                                    </span>
                                  </p>
                                </td>

                                <td>
                                  <p className="mb-0">
                                    {" "}
                                    Invoice Values (₹)
                                    <br />
                                    <span>
                                      {totalInvoiceValue
                                        ? formatINR(totalInvoiceValue)
                                        : 0}
                                    </span>
                                  </p>
                                </td>
                                <td>
                                  <p className="mb-0">
                                    Taxable Values{"  "} (₹)
                                    <br />
                                    <span>
                                      {totalTaxableValue
                                        ? formatINR(totalTaxableValue)
                                        : 0}
                                    </span>
                                  </p>
                                </td>

                                <td>
                                  <p className="mb-0">
                                    IGST (₹)
                                    <br />
                                    <span>
                                      {totalIGST ? formatINR(totalIGST) : 0}
                                    </span>
                                  </p>
                                </td>
                                <td>
                                  <p className="mb-0">
                                    SGST (₹)
                                    <br />
                                    <span>
                                      {totalSGST ? formatINR(totalSGST) : 0}
                                    </span>
                                  </p>
                                </td>
                                <td>
                                  <p className="mb-0">
                                    CGST (₹)
                                    <br />
                                    <span>
                                      {totalCGST ? formatINR(totalCGST) : 0}
                                    </span>
                                  </p>
                                </td>
                                <td>
                                  <p className="mb-0">
                                    Cess (₹)
                                    <br />
                                    <span>
                                      {totalCess ? formatINR(totalCess) : 0}
                                    </span>
                                  </p>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </Col>
                        <Col md={4}>
                          <Row>
                            <Col sm={4}>
                              <Label className="form-label">Invoice Type</Label>
                              <Select
                                id="purchaseId_invtype"
                                placeholder="Invoice Type"
                                theme={selectThemeColors}
                                // closeMenuOnSelect={false}
                                components={animatedComponents}
                                //  isMulti
                                options={b2csInvoiceTypeList}
                                value={b2csInvoiceType}
                                // className="basic-multi-select"
                                classNamePrefix="select"
                                onChange={filterInvoiceTypeB2cs}
                              //onChange={setInvoceTypes}
                              />
                            </Col>
                            <Col sm={4}>
                              <Label className="form-label">From</Label>
                              <Select
                                id="from"
                                placeholder="From"
                                isClearable={false}
                                theme={selectThemeColors}
                                closeMenuOnSelect={true}
                                options={panDataFrom}
                                // options={panData}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                components={animatedComponents}
                                onChange={selectFromYear}
                                value={finFromYear}
                                isDisabled={true}
                              />
                            </Col>

                            <Col sm={4}>
                              <Label className="form-label">To</Label>
                              <Select
                                id="to"
                                placeholder="To"
                                isClearable={false}
                                theme={selectThemeColors}
                                closeMenuOnSelect={true}
                                options={panData}
                                components={animatedComponents}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                onChange={selectFromMonth}
                                value={monthFrom}
                                isDisabled={true}
                              />
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                  <div>
                    <h2 className="mt-2 mb-1">Summary</h2>
                  </div>
                  <Card>
                    <CardBody className="CardBody p-0">
                      <div
                        className=""
                      // style={{
                      //   maxHeight: "370px",
                      //   overflowY: "auto",
                      //   overflowX: "hidden",
                      // }}
                      >
                        <Row>
                          <Col sm="12">
                            <div>
                              {b2csSummaryData?.length ? (
                                <HotTable
                                  ref={hotRefB2cs}
                                  columnSorting={true}
                                  renderAllRows={false}
                                  // autoColumnSize={true}
                                  autoColumnSize={{
                                    samplingRatio: 23  // Adjust the samplingRatio as needed
                                  }}
                                  height="auto"
                                  manualColumnResize={false}
                                  rowHeights={RowSize}
                                  columnHeaderHeight={columnHeaderSize}
                                  stretchH="all"
                                  data={GSTR1FiledSummary ? GSTR1FiledSummary : []}
                                  columns={b2csColumns}
                                  // afterGetColHeader={theader}
                                  colHeaders={colHeaders}
                                  rowHeaders={false}
                                  filters={false}
                                  afterGetColHeader={theader1}
                                  overflow={"auto"}
                                  bindRowsWithHeaders={false}
                                  licenseKey="non-commercial-and-evaluation"
                                  afterOnCellMouseDown={localAfterOnCellMouseDown}
                                  selectionMode="range"
                                  mergeCells={false}
                                  cells={function (row, col) {
                                    var cp = {};
                                    const hot = hotRefB2cs?.current?.hotInstance;
                                    if (col !== null) {
                                      cp.renderer = emptySummaryRender;
                                    }
                                    if (
                                      col == 2 ||
                                      col == 3 ||
                                      col == 4 ||
                                      col == 5 ||
                                      col == 6 ||
                                      col == 7
                                    ) {
                                      cp.className = "text-end";
                                    }
                                    return cp;
                                  }}
                                  viewportColumnRenderingOffset={100}
                                />
                              ) : (
                                <HotTable
                                  ref={hotRefB2cs}
                                  viewportColumnRenderingOffset={100}
                                  // autoColumnSize={true}
                                  autoColumnSize={{
                                    samplingRatio: 23  // Adjust the samplingRatio as needed
                                  }}
                                  height="auto"
                                  manualColumnResize={false}
                                  renderAllRows={false}
                                  stretchH="all"
                                  rowHeaders={false}
                                  rowHeights={RowSize}
                                  columnHeaderHeight={columnHeaderSize}


                                  data={[{ SupplyType: "No Data Found!" }]}
                                  afterGetColHeader={theader1}
                                  mergeCells={[
                                    {
                                      row: 0,
                                      col: 0,
                                      rowspan: 1,
                                      colspan: 8,
                                    },
                                  ]}
                                  cells={function (row, col) {
                                    var cp = {};

                                    if (col == 0) {

                                      cp.className = "text-center";
                                    }
                                    return cp;

                                  }}
                                  preventOverflow="horizontal"
                                  colHeaders={colHeaders}
                                  columns={b2csColumns}
                                  filters={false}
                                  licenseKey="non-commercial-and-evaluation"
                                  selectionMode="range"
                                  afterOnCellMouseDown={localAfterOnCellMouseDown}
                                />
                              )}
                              <ReactPaginate
                                breakLabel="..."
                                nextLabel=""
                                onPageChange={(e) => handlePageClickSummary(e?.selected)}
                                pageRangeDisplayed={2}
                                pageCount={summaryPageCount}
                                previousLabel=""
                                renderOnZeroPageCount={null}
                                marginPagesDisplayed={2}
                                forcePage={pageSummary}
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
                            </div>
                          </Col>
                        </Row>
                      </div>
                    </CardBody>
                  </Card>
                  <div>
                    <h2 className="mt-2 mb-1">Invoices</h2>
                  </div>
                  <Card>
                    <CardBody className="CardBody p-0">
                      <Row>
                        <Col sm="12">
                          <div>
                            {/* Active tab 7 */}
                            {activeTab == 7 && (
                              <HotTable
                                ref={hotRefB2csInv}
                                id="b2csInvalidCol"
                                columnSorting={true}
                                renderAllRows={false}
                                rowHeights={RowSize}
                                columnHeaderHeight={columnHeaderSize}
                                height="auto"
                                // afterColumnSort={ServerSideSorting}
                                dropdownMenu={{
                                  items: {
                                    filter_by_value: {
                                      name: "Search Value",
                                      // hide the 'Filter by value' list from all columns but the first one
                                      hidden() {
                                        const selectedValue = this.getSelected()[0][1];
                                        const isValidColumn = [2, 3, 4, 5, 6].includes(selectedValue);

                                        return isValidColumn;;
                                      },
                                    },
                                    about: { // For CheckBox custom option

                                      name: `<div  style=${checkboxFilterCss}>${checkBoxTitle}<label class="float-end text-danger "><a><u id="selectAll">Select All</u></a></label></div> <div  class="checkboxmenu custom-scrollbar"> <div >  <table id="searchTable" >
                                      ${dropDonwName &&
                                        dropDonwName?.map((index) => (
                                          `<tr><td><input class="checkBoxClass" type="checkbox" value="${index?.label}" /> <span class="fw-normal">${index?.label?.length > 20 ? index?.label?.substring(0, 20) + "..." : index?.label}</span> </td></tr>`
                                        )).join('')
                                        }

                                        </table></div>
                                        </div>`, // Name can contain HTML
                                      hidden() {
                                        const selectedCol = this.getSelectedRangeLast().to.col;
                                        const isHiddenCol = ![6].includes(selectedCol);

                                        return isHiddenCol;
                                      },

                                      callback: function (key, selection, clickEvent) {

                                        var src = clickEvent.target;
                                        if (src.tagName == 'U') {
                                          if (clickEvent.target.id == 'selectAll') {
                                            $(".checkBoxClass").prop('checked', true);
                                          }

                                        }
                                        if (src.tagName == 'SPAN') {
                                          $('input[type="checkbox]').trigger('click').prop('checked', true);

                                        }
                                        clickEvent.stopImmediatePropagation();
                                      },

                                    },
                                    option2: {

                                      name: `<div style="margin-top:10px"> From Date <br><input type='date' data-date="" data-date-format="DD MMMM YYYY" min='2017-07-01' max=${new Date()
                                        .toISOString()
                                        .slice(
                                          0,
                                          10
                                        )}  class='custom-date col-md-11' placeholder='DD-MM-YYYY' id='custom1' name='date' value=${searchDate ? searchDate : toDate} > <br/>

                                            To Date <br><input type='date' data-date="" data-date-format="DD MMMM YYYY" min='2017-07-01' max=${new Date()
                                          .toISOString()
                                          .slice(
                                            0,
                                            10
                                          )}  class='custom-date col-md-11' placeholder='DD-MM-YYYY' id='custom2' name='date' value=${toDate ? toDate : searchDate} >
                                           </div> `,
                                      hidden() {
                                        return (
                                          this.getSelectedRangeLast().to.col != 2
                                        );
                                      },

                                      //disabled: true,
                                      callback: function (
                                        key,
                                        selection,
                                        clickEvent
                                      ) {
                                        console.log("date picker clicked");
                                        var src = clickEvent.target;

                                        if (src.tagName === "INPUT") {
                                          console.log(
                                            "custom menu2",
                                            key,
                                            selection,
                                            clickEvent,
                                            src
                                          );
                                          clickEvent.stopImmediatePropagation();
                                        }

                                        console.log("custom value", src.value);

                                        clickEvent.stopImmediatePropagation();
                                      },
                                    },
                                    option3: createOptionMinMax(fromValue, toValue, 3),
                                    option4: createOptionMinMax(fromTax, toTax, 4),
                                    option5: createOptionMinMax(fromAmount, toAmount, 5),
                                    clear: {
                                      name: `<button id='btnClear' name='Clear'   value='Clear'>Clear</button>`,
                                      //disabled: true,
                                      callback: function (
                                        key,
                                        selection,
                                        clickEvent
                                      ) {

                                        var src = clickEvent.target;

                                        if (
                                          src.tagName.toLowerCase() === "button"
                                        ) {
                                          if (
                                            clickEvent.target.id == "btnClear"
                                          ) {
                                            //** start
                                            const hot =
                                              hotRefB2csInv?.current?.hotInstance;

                                            if (hot?.getSelected()[0][1] == 0 || hot?.getSelected()[0][1] == 1) {

                                              let x = searchVal1
                                              var value = '';

                                              var columnName = B2CsInvalidColumns[currentCol1]?.data;
                                              let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                                              filterObject.push({ [columnName]: value });

                                              if (!searchVal1?.length) {

                                                x.push(value);
                                                let y = currentCol;
                                                y.push(
                                                  B2CsInvalidColumns[currentCol1]?.data
                                                );
                                                setSearchVal1(x);
                                                setCurrentCol(y);
                                              } else {

                                                const Index = currentCol?.findIndex(
                                                  (item) =>
                                                    B2CsInvalidColumns[currentCol1]?.data ==
                                                    item
                                                );
                                                if (Index != -1) {
                                                  const xyz = searchVal1;
                                                  xyz[Index] = value;
                                                  setSearchVal1(xyz);
                                                } else {
                                                  x.push(value);
                                                  let y = currentCol;
                                                  y.push(
                                                    B2CsInvalidColumns[currentCol1]?.data
                                                  );
                                                  setSearchVal1(x);
                                                  setCurrentCol(y);
                                                }
                                              }

                                              setGridCustomFilter(filterObject)
                                              let newFilterData = FilterData(filterObject);
                                              setData([...newFilterData]);
                                            } else if (hot?.getSelected()?.[0]?.[1] == 6) {

                                              var checkboxes = document.getElementsByClassName('checkBoxClass');
                                              arrChk = []
                                              setFilterDropDownList([]);
                                              var columnName = B2CsInvalidColumns[currentCol1]?.data;
                                              let filterObject = !gridCustomFilter ? [] : gridCustomFilter

                                              filterObject = filterObject == null || filterObject.length <= 0 ? [] : filterObject;

                                              for (let i = 0; i < checkboxes.length; i++) {
                                                if (checkboxes[i].checked) {
                                                  let uniqueArray = filterObject.filter((obj, index, self) =>
                                                    index === self.findIndex((t) => (
                                                      JSON.stringify(t) === JSON.stringify(obj)
                                                    ))
                                                  );
                                                  filterObject = uniqueArray
                                                  const index = filterObject.findIndex(obj => obj[columnName] === checkboxes[i].value);
                                                  if (index !== -1) {

                                                    delete filterObject[index][columnName];
                                                  }
                                                }
                                              }
                                              setGridCustomFilter(filterObject)
                                              let newFilterData = FilterData(filterObject);
                                              setData([...newFilterData]);

                                              const updatedFilterDropDownList = filterObject.reduce((acc, item) => {
                                                const { ReverseCharge } = item;

                                                const updateList = (list, value) => {
                                                  return list.includes(value) ? list : [...list, value];
                                                };

                                                if (ReverseCharge !== undefined) {
                                                  acc.rcmDropDownList = updateList(acc.rcmDropDownList, ReverseCharge);
                                                }

                                                return acc;
                                              }, { rcmDropDownList: [] });

                                              setFilterDropDownList(updatedFilterDropDownList);

                                            } else if (hot?.getSelected()[0][1] == 3 || hot?.getSelected()[0][1] == 4 || hot?.getSelected()[0][1] == 5) {


                                              var columnName = B2CsInvalidColumns[currentCol1]?.data;
                                              var value = '';

                                              hot?.getSelected()[0][1] == 3 && setFromValue('');
                                              hot?.getSelected()[0][1] == 3 && setToValue('');
                                              hot?.getSelected()[0][1] == 4 && setFromTax('');
                                              hot?.getSelected()[0][1] == 4 && setToTax('');
                                              hot?.getSelected()[0][1] == 5 && setFromAmount('');
                                              hot?.getSelected()[0][1] == 5 && setToAmount('');
                                              let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                                              filterObject.push({ [columnName]: value });
                                              setGridCustomFilter(filterObject)
                                              let newFilterData = FilterData(filterObject);
                                              setData([...newFilterData]);

                                            } else {

                                              var columnName = invalidColumns[currentCol1]?.data;
                                              var value = '';
                                              setSearchDate('');
                                              setToDate('');
                                              let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                                              filterObject.push({ [columnName]: value });
                                              setGridCustomFilter(filterObject)
                                              let newFilterData = FilterData(filterObject);
                                              setData([...newFilterData]);
                                            }
                                            //** End
                                          }

                                          clickEvent.stopImmediatePropagation();
                                        }

                                        clickEvent.stopImmediatePropagation();
                                      },
                                    },
                                    filter_action_bar: {},
                                  },
                                }}
                                afterDropdownMenuShow={function (instance) {
                                  var checkboxes = document.getElementsByClassName('checkBoxClass');

                                  const {
                                    rcmDropDownList,
                                  } = filterDropDownList;

                                  const listsToCheck = [
                                    rcmDropDownList,
                                  ];

                                  for (var j = 0; j < checkboxes.length; j++) {
                                    for (var k = 0; k < listsToCheck.length; k++) {
                                      if (listsToCheck[k]) {

                                        // For rcmDropDownList, check both conditions listsToCheck[k][i] == checkboxes[j].value and checkboxes?.length == 2
                                        if (k === 0) {

                                          for (var i = 0; i < listsToCheck[k].length; i++) {
                                            if (listsToCheck[k][i] == checkboxes[j].value) {
                                              $(checkboxes[j]).prop("checked", true);
                                              break;
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }}
                                afterFilter={function (data, coords) {
                                  const hot = hotRefB2csInv?.current?.hotInstance;
                                  if (hot?.getSelected()[0][1] == 0 || hot?.getSelected()[0][1] == 1) {
                                    var searchInput = document.querySelector(
                                      ".htUIMultipleSelectSearch.htUIInput"
                                    );
                                    let x = searchVal1
                                    var value = searchInput?.children[0]?.value;

                                    var columnName = B2CsInvalidColumns[currentCol1]?.data;
                                    let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                                    filterObject.push({ [columnName]: value });

                                    if (!searchVal1?.length) {

                                      x.push(value);
                                      let y = currentCol;
                                      y.push(
                                        B2CsInvalidColumns[currentCol1]?.data
                                      );
                                      setSearchVal1(x);
                                      setCurrentCol(y);
                                    } else {

                                      const Index = currentCol?.findIndex(
                                        (item) =>
                                          B2CsInvalidColumns[currentCol1]?.data ==
                                          item
                                      );
                                      if (Index != -1) {
                                        const xyz = searchVal1;
                                        xyz[Index] = value;
                                        setSearchVal1(xyz);
                                      } else {
                                        x.push(value);
                                        let y = currentCol;
                                        y.push(
                                          B2CsInvalidColumns[currentCol1]?.data
                                        );
                                        setSearchVal1(x);
                                        setCurrentCol(y);
                                      }
                                    }

                                    setGridCustomFilter(filterObject)
                                    let newFilterData = FilterData(filterObject);
                                    setData([...newFilterData]);
                                  } else if (hot?.getSelected()?.[0]?.[1] == 6) {

                                    var checkboxes = document.getElementsByClassName('checkBoxClass');
                                    arrChk = []
                                    setFilterDropDownList([]);
                                    var columnName = B2CsInvalidColumns[currentCol1]?.data;
                                    let filterObject = !gridCustomFilter ? [] : gridCustomFilter

                                    filterObject = filterObject == null || filterObject.length <= 0 ? [] : filterObject;

                                    for (let i = 0; i < checkboxes.length; i++) {
                                      if (checkboxes[i].checked) {

                                        arrChk.push({ [columnName]: checkboxes[i].value });

                                        filterObject.push({ [columnName]: checkboxes[i].value });
                                      } else {

                                        let uniqueArray = filterObject.filter((obj, index, self) =>
                                          index === self.findIndex((t) => (
                                            JSON.stringify(t) === JSON.stringify(obj)
                                          ))
                                        );
                                        filterObject = uniqueArray
                                        const index = filterObject.findIndex(obj => obj[columnName] === checkboxes[i].value);
                                        if (index !== -1) {

                                          delete filterObject[index][columnName];
                                        }
                                      }
                                    }
                                    setGridCustomFilter(filterObject)
                                    let newFilterData = FilterData(filterObject);
                                    setData([...newFilterData]);

                                    const updatedFilterDropDownList = filterObject.reduce((acc, item) => {
                                      const { ReverseCharge } = item;

                                      const updateList = (list, value) => {
                                        return list.includes(value) ? list : [...list, value];
                                      };

                                      if (ReverseCharge !== undefined) {
                                        acc.rcmDropDownList = updateList(acc.rcmDropDownList, ReverseCharge);
                                      }

                                      return acc;
                                    }, { rcmDropDownList: [] });

                                    setFilterDropDownList(updatedFilterDropDownList);

                                  } else if (hot?.getSelected()[0][1] == 3 || hot?.getSelected()[0][1] == 4 || hot?.getSelected()[0][1] == 5) {

                                    var searchInput1 = document.getElementById("amount1");
                                    var searchInput2 = document.getElementById("amount2");
                                    const invFromDate = searchInput1?.value
                                    const invToDate = searchInput2?.value
                                    var columnName = B2CsInvalidColumns[currentCol1]?.data;
                                    var value = `${invFromDate}to${invToDate}`;

                                    hot?.getSelected()[0][1] == 3 && setFromValue(searchInput1?.value);
                                    hot?.getSelected()[0][1] == 3 && setToValue(searchInput2?.value);
                                    hot?.getSelected()[0][1] == 4 && setFromTax(searchInput1?.value);
                                    hot?.getSelected()[0][1] == 4 && setToTax(searchInput2?.value);
                                    hot?.getSelected()[0][1] == 5 && setFromAmount(searchInput1?.value);
                                    hot?.getSelected()[0][1] == 5 && setToAmount(searchInput2?.value);
                                    let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                                    filterObject.push({ [columnName]: value });
                                    setGridCustomFilter(filterObject)
                                    let newFilterData = FilterData(filterObject);
                                    setData([...newFilterData]);

                                  } else {

                                    var searchInput1 = document.getElementById("custom1");
                                    var searchInput2 = document.getElementById("custom2");
                                    const invFromDate = searchInput1?.value
                                    const invToDate = searchInput2?.value
                                    var columnName = invalidColumns[currentCol1]?.data;
                                    var value = (searchInput1?.value || searchInput2?.value) && `${invFromDate ? invFromDate : invToDate}to${invToDate ? invToDate : invFromDate}`;
                                    setSearchDate(searchInput1?.value);
                                    setToDate(searchInput2?.value);
                                    let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                                    filterObject.push({ [columnName]: value });
                                    setGridCustomFilter(filterObject)
                                    let newFilterData = FilterData(filterObject);
                                    setData([...newFilterData]);
                                  }

                                  // const x = searchVal1;
                                  // if (!searchVal1?.length) {
                                  //   x.push(value);
                                  //   let y = currentCol;
                                  //   y.push(B2CsInvalidColumns[currentCol1]?.data);

                                  //   setSearchVal1(x);
                                  //   setCurrentCol(y);
                                  // } else {
                                  //   const Index = currentCol?.findIndex(
                                  //     (item) =>
                                  //       B2CsInvalidColumns[currentCol1]?.data ==
                                  //       item
                                  //   );

                                  //   if (Index != -1) {
                                  //     const xyz = searchVal1;
                                  //     xyz[Index] = value;
                                  //     setSearchVal1(xyz);
                                  //   } else {
                                  //     x.push(value);
                                  //     let y = currentCol;
                                  //     y.push(
                                  //       B2CsInvalidColumns[currentCol1]?.data
                                  //     );

                                  //     setSearchVal1(x);
                                  //     setCurrentCol(y);
                                  //   }
                                  // }

                                  // let arrFilter = [];
                                  // let uniq = [...new Set(currentCol)];

                                  // for (let i = 0; i < uniq.length; i++) {
                                  //   var obj = {};

                                  //   for (let j = 0; j < searchVal1.length; j++) {
                                  //     if (i == j) {
                                  //       obj[uniq[i]] = searchVal1[j];
                                  //       arrFilter.push(obj);
                                  //     }
                                  //   }
                                  // }
                                  // let newFilterData = FilterData(arrFilter);
                                  // setData([...newFilterData]);
                                }}
                                // autoColumnSize={true}
                                autoColumnSize={{
                                  samplingRatio: 23  // Adjust the samplingRatio as needed
                                }}
                                manualColumnResize={false}
                                stretchH="all"
                                data={GSTR1FiledData.length > 0 ? GSTR1FiledData : [{ ReceiverName: "No Data Found!" }]}
                                columns={B2CsInvalidColumns}
                                afterGetColHeader={theader}
                                colHeaders={colHeaders}
                                rowHeaders={false}
                                filters={true}
                                viewportColumnRenderingOffset={100}
                                // hiddenColumns={false}

                                bindRowsWithHeaders={false}
                                licenseKey="non-commercial-and-evaluation"
                                afterOnCellMouseDown={localAfterOnCellMouseDown}
                                selectionMode="range"
                                mergeCells={[GSTR1FiledData.length > 0 ? false :
                                  { row: 0, col: 0, rowspan: 1, colspan: 7 },
                                ]}
                                // hiddenColumns={{
                                //   columns: [0],
                                // }}
                                cells={function (row, col) {
                                  var cp = {};
                                  const hot = hotRefB2csInv?.current?.hotInstance;
                                  if (col !== null) {
                                    cp.renderer = emptyRender;
                                  }
                                  if (col == 0 && !GSTR1FiledData.length > 0) {

                                    cp.className = "text-center";
                                  }
                                  if (
                                    col == 4 ||
                                    col == 5 ||
                                    col == 3
                                    // col == 7
                                  ) {
                                    cp.className = "text-end";
                                  }
                                  return cp;
                                }}
                              />
                            )}

                            {customPagination()}

                          </div>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </TabPane>
              }



              {/* AT/ATA/ATADJ/ATADJA */}
              {
                activeTab == 6 &&
                <TabPane tabId="6" key="6">
                  <Card>
                    <CardBody className="CardBody p-0">
                      <Row className="p-1">
                        <Col md={8}>
                          <table className="table table-bordered summary-table">
                            <tbody>
                              <tr>
                                <td>
                                  <p className="mb-0">
                                    Invoices <br />
                                    <span>
                                      {totalInvoice
                                        ? formatTotalWithoutDecimal(totalInvoice)
                                        : 0}
                                    </span>
                                  </p>
                                </td>

                                <td>
                                  <p className="mb-0">
                                    {" "}
                                    Invoice Values (₹)
                                    <br />
                                    <span>
                                      {totalInvoiceValue
                                        ? formatINR(totalInvoiceValue)
                                        : 0}
                                    </span>
                                  </p>
                                </td>
                                <td>
                                  <p className="mb-0">
                                    Taxable Values{"  "} (₹)
                                    <br />
                                    <span>
                                      {totalTaxableValue
                                        ? formatINR(totalTaxableValue)
                                        : 0}
                                    </span>
                                  </p>
                                </td>

                                <td>
                                  <p className="mb-0">
                                    IGST (₹)
                                    <br />
                                    <span>
                                      {totalIGST ? formatINR(totalIGST) : 0}
                                    </span>
                                  </p>
                                </td>
                                <td>
                                  <p className="mb-0">
                                    SGST (₹)
                                    <br />
                                    <span>
                                      {totalSGST ? formatINR(totalSGST) : 0}
                                    </span>
                                  </p>
                                </td>
                                <td>
                                  <p className="mb-0">
                                    CGST (₹)
                                    <br />
                                    <span>
                                      {totalCGST ? formatINR(totalCGST) : 0}
                                    </span>
                                  </p>
                                </td>
                                <td>
                                  <p className="mb-0">
                                    Cess (₹)
                                    <br />
                                    <span>
                                      {totalCess ? formatINR(totalCess) : 0}
                                    </span>
                                  </p>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </Col>
                        <Col md={4}>
                          <Row>
                            <Col sm={4}>
                              <Label className="form-label">Invoice Type</Label>
                              <Select
                                id="purchaseId_invtype"
                                placeholder="Invoice Type"
                                theme={selectThemeColors}
                                components={animatedComponents}
                                //  isMulti
                                options={atInvoiceTypeList}
                                value={atInvoiceType}
                                classNamePrefix="select"
                                onChange={filterInvoiceTypeAt}
                              />
                            </Col>
                            <Col sm={4}>
                              <Label className="form-label">From</Label>
                              <Select
                                id="from"
                                placeholder="From"
                                isClearable={false}
                                theme={selectThemeColors}
                                closeMenuOnSelect={true}
                                options={panDataFrom}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                components={animatedComponents}
                                onChange={selectFromYear}
                                value={finFromYear}
                                isDisabled={true}
                              />
                            </Col>

                            <Col sm={4}>
                              <Label className="form-label">To</Label>
                              <Select
                                id="to"
                                placeholder="To"
                                isClearable={false}
                                theme={selectThemeColors}
                                closeMenuOnSelect={true}
                                options={panData}
                                components={animatedComponents}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                onChange={selectFromMonth}
                                value={monthFrom}
                                isDisabled={true}
                              />
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                  <div>
                    <h2 className="mt-2 mb-1">Summary</h2>
                  </div>
                  <Card>
                    <CardBody className="CardBody p-0">
                      <div
                        className=""
                      // style={{
                      //   maxHeight: "370px",
                      //   overflowY: "auto",
                      //   overflowX: "hidden",
                      // }}
                      >
                        <Row>
                          <Col sm="12">
                            <div>
                              {b2csSummaryData?.length ? (
                                <HotTable
                                  ref={hotRefAtSummary}
                                  columnSorting={true}
                                  renderAllRows={false}
                                  rowHeights={RowSize}
                                  columnHeaderHeight={columnHeaderSize}
                                  overflow={"auto"}
                                  height="auto"
                                  // autoColumnSize={true}
                                  autoColumnSize={{
                                    samplingRatio: 23  // Adjust the samplingRatio as needed
                                  }}
                                  manualColumnResize={false}
                                  stretchH="all"
                                  data={GSTR1FiledSummary ? GSTR1FiledSummary : []}
                                  columns={
                                    atInvoiceType?.value == "13" ||
                                      atInvoiceType?.value == "15"
                                      ? atSummaryColumns
                                      : atAmedmentSummaryColumns
                                  }
                                  colHeaders={colHeaders}
                                  rowHeaders={false}
                                  filters={true}
                                  afterGetColHeader={theader1}
                                  bindRowsWithHeaders={false}
                                  licenseKey="non-commercial-and-evaluation"
                                  afterOnCellMouseDown={localAfterOnCellMouseDown}
                                  selectionMode="range"
                                  mergeCells={false}
                                  cells={function (row, col) {
                                    var cp = {};
                                    const hot =
                                      hotRefAtSummary?.current?.hotInstance;
                                    if (col !== null) {
                                      cp.renderer = emptySummaryRender;
                                    }
                                    if (
                                      (col == 3 &&
                                        (atInvoiceType?.value == "13" ||
                                          atInvoiceType?.value == "15")) ||
                                      col == 4 ||
                                      col == 5 ||
                                      col == 6 ||
                                      col == 7 ||
                                      col == 8
                                    ) {
                                      cp.className = "text-end";
                                    }

                                    return cp;
                                  }}
                                />
                              ) : (
                                <HotTable
                                  ref={hotRefAtSummary}
                                  // autoColumnSize={true}
                                  autoColumnSize={{
                                    samplingRatio: 23  // Adjust the samplingRatio as needed
                                  }}
                                  manualColumnResize={false}
                                  renderAllRows={false}
                                  rowHeights={RowSize}
                                  columnHeaderHeight={columnHeaderSize}
                                  stretchH="all"
                                  rowHeaders={false}
                                  height="auto"

                                  data={[{ SectionName: "No Data Found!" }]}
                                  afterGetColHeader={theader1}
                                  mergeCells={[
                                    {
                                      row: 0,
                                      col: 0,
                                      rowspan: 1,
                                      colspan:
                                        atInvoiceType?.value == "13" ||
                                          atInvoiceType?.value == "15"
                                          ? 9
                                          : 10,
                                    },
                                  ]}
                                  cells={function (row, col) {
                                    var cp = {};

                                    if (col == 0) {

                                      cp.className = "text-center";
                                    }
                                    return cp;

                                  }}
                                  preventOverflow="horizontal"
                                  colHeaders={colHeaders}
                                  columns={
                                    atInvoiceType?.value == "13" ||
                                      atInvoiceType?.value == "15"
                                      ? atSummaryColumns
                                      : atAmedmentSummaryColumns
                                  }
                                  filters={true}
                                  licenseKey="non-commercial-and-evaluation"
                                  selectionMode="range"
                                />
                              )}
                              <ReactPaginate
                                breakLabel="..."
                                nextLabel=""
                                onPageChange={(e) => handlePageClickSummary(e?.selected)}
                                pageRangeDisplayed={2}
                                pageCount={summaryPageCount}
                                previousLabel=""
                                renderOnZeroPageCount={null}
                                marginPagesDisplayed={2}
                                forcePage={pageSummary}
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
                            </div>
                          </Col>
                        </Row>
                      </div>
                    </CardBody>
                  </Card>
                  <div>
                    <h2 className="mt-2 mb-1">Invoices</h2>
                  </div>
                  <Card>
                    <CardBody className="CardBody p-0">
                      <Row>
                        <Col sm="12">
                          <div>
                            {/* Active tab 6 */}
                            {activeTab == 6 && (
                              <HotTable
                                id="atColumns"
                                ref={hotRefAt}
                                columnSorting={true}
                                renderAllRows={false}
                                rowHeights={RowSize}
                                data={GSTR1FiledData.length > 0 ? GSTR1FiledData : [{ SheetName: "No Data Found!" }]}
                                columns={atColumns}
                                columnHeaderHeight={columnHeaderSize}
                                mergeCells={
                                  [GSTR1FiledData.length > 0 ? false :
                                    { row: 0, col: 0, rowspan: 1, colspan: 8 },
                                  ]}
                                //afterColumnSort={ServerSideSorting}
                                dropdownMenu={{
                                  items: {
                                    filter_by_value: {
                                      name: "Search Value",
                                      // hide the 'Filter by value' list from all columns but the first one
                                      hidden() {
                                        const selectedValue = this.getSelected()[0][1];
                                        const isValidColumn = [4, 5, 6, 7].includes(selectedValue);

                                        return isValidColumn;
                                      },
                                    },
                                    about: { // For CheckBox custom option

                                      name: `<div  style=${checkboxFilterCss}>${checkBoxTitle}<label class="float-end text-danger "><a><u id="selectAll">Select All</u></a></label></div> <div  class="checkboxmenu custom-scrollbar"> <div >  <table id="searchTable" >
                                      ${dropDonwName &&
                                        dropDonwName?.map((index) => (
                                          `<tr><td><input class="checkBoxClass" type="checkbox" value="${index?.label}" /> <span class="fw-normal">${index?.label?.length > 20 ? index?.label?.substring(0, 20) + "..." : index?.label}</span> </td></tr>`
                                        )).join('')
                                        }

                                        </table></div>
                                        </div>`, // Name can contain HTML
                                      hidden() {
                                        const selectedCol = this.getSelectedRangeLast().to.col;
                                        const isHiddenCol = ![7].includes(selectedCol);

                                        return isHiddenCol;
                                      },

                                      callback: function (key, selection, clickEvent) {

                                        var src = clickEvent.target;
                                        if (src.tagName == 'U') {
                                          if (clickEvent.target.id == 'selectAll') {
                                            $(".checkBoxClass").prop('checked', true);
                                          }

                                        }
                                        if (src.tagName == 'SPAN') {
                                          $('input[type="checkbox]').trigger('click').prop('checked', true);

                                        }
                                        clickEvent.stopImmediatePropagation();
                                      },

                                    },
                                    option4: {

                                      name: `<div style="margin-top:10px"> From Date <br><input type='date' data-date="" data-date-format="DD MMMM YYYY" min='2017-07-01' max=${new Date()
                                        .toISOString()
                                        .slice(
                                          0,
                                          10
                                        )}  class='custom-date col-md-11' placeholder='DD-MM-YYYY' id='custom1' name='date' value=${searchDate ? searchDate : toDate} > <br/>

                                            To Date <br><input type='date' data-date="" data-date-format="DD MMMM YYYY" min='2017-07-01' max=${new Date()
                                          .toISOString()
                                          .slice(
                                            0,
                                            10
                                          )}  class='custom-date col-md-11' placeholder='DD-MM-YYYY' id='custom2' name='date' value=${toDate ? toDate : searchDate} >
                                           </div> `,
                                      hidden() {
                                        return (
                                          this.getSelectedRangeLast().to.col != 4
                                        );
                                      },

                                      //disabled: true,
                                      callback: function (
                                        key,
                                        selection,
                                        clickEvent
                                      ) {
                                        console.log("date picker clicked");
                                        var src = clickEvent.target;

                                        if (src.tagName === "INPUT") {
                                          console.log(
                                            "custom menu2",
                                            key,
                                            selection,
                                            clickEvent,
                                            src
                                          );
                                          clickEvent.stopImmediatePropagation();
                                        }

                                        console.log("custom value", src.value);

                                        clickEvent.stopImmediatePropagation();
                                      },
                                    },
                                    option5: createOptionMinMax(fromAmount, toAmount, 5),
                                    option6: createOptionMinMax(fromTax, toTax, 6),
                                    clear: {
                                      name: `<button id='btnClear' name='Clear'   value='Clear'>Clear</button>`,
                                      //disabled: true,
                                      callback: function (
                                        key,
                                        selection,
                                        clickEvent
                                      ) {

                                        var src = clickEvent.target;

                                        if (
                                          src.tagName.toLowerCase() === "button"
                                        ) {
                                          if (
                                            clickEvent.target.id == "btnClear"
                                          ) {
                                            //** start
                                            const hot =
                                              hotRefAt?.current?.hotInstance;

                                            if (hot?.getSelected()[0][1] != 4 && hot?.getSelected()[0][1] != 5 && hot?.getSelected()[0][1] != 6 && hot?.getSelected()[0][1] != 7) {
                                              var searchInput = document.querySelector(
                                                ".htUIMultipleSelectSearch.htUIInput"
                                              );
                                              var value = '';
                                              var x = searchVal1;
                                              var columnName = atColumns[currentCol1]?.data;
                                              let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                                              filterObject.push({ [columnName]: value });

                                              if (!searchVal1?.length) {

                                                x.push(value);
                                                let y = currentCol;
                                                y.push(
                                                  atColumns[currentCol1]?.data
                                                );
                                                setSearchVal1(x);
                                                setCurrentCol(y);
                                              } else {

                                                const Index = currentCol?.findIndex(
                                                  (item) =>
                                                    atColumns[currentCol1]?.data ==
                                                    item
                                                );
                                                if (Index != -1) {
                                                  const xyz = searchVal1;
                                                  xyz[Index] = value;
                                                  setSearchVal1(xyz);
                                                } else {
                                                  x.push(value);
                                                  let y = currentCol;
                                                  y.push(
                                                    atColumns[currentCol1]?.data
                                                  );
                                                  setSearchVal1(x);
                                                  setCurrentCol(y);
                                                }
                                              }

                                              setGridCustomFilter(filterObject)
                                              let newFilterData = FilterData(filterObject);
                                              setData([...newFilterData]);
                                            } else if (hot?.getSelected()?.[0]?.[1] == 7) {

                                              var checkboxes = document.getElementsByClassName('checkBoxClass');
                                              arrChk = []
                                              setFilterDropDownList([]);
                                              var columnName = atColumns[currentCol1]?.data;
                                              let filterObject = !gridCustomFilter ? [] : gridCustomFilter

                                              filterObject = filterObject == null || filterObject.length <= 0 ? [] : filterObject;

                                              for (let i = 0; i < checkboxes.length; i++) {
                                                if (checkboxes[i].checked) {
                                                  let uniqueArray = filterObject.filter((obj, index, self) =>
                                                    index === self.findIndex((t) => (
                                                      JSON.stringify(t) === JSON.stringify(obj)
                                                    ))
                                                  );
                                                  filterObject = uniqueArray
                                                  const index = filterObject.findIndex(obj => obj[columnName] === checkboxes[i].value);
                                                  if (index !== -1) {

                                                    delete filterObject[index][columnName];
                                                  }
                                                }
                                              }
                                              setGridCustomFilter(filterObject)
                                              let newFilterData = FilterData(filterObject);
                                              setData([...newFilterData]);

                                              const updatedFilterDropDownList = filterObject.reduce((acc, item) => {
                                                const { PlaceOfSupply } = item;

                                                const updateList = (list, value) => {
                                                  return list.includes(value) ? list : [...list, value];
                                                };

                                                if (PlaceOfSupply !== undefined) {
                                                  acc.posDropDownList = updateList(acc.posDropDownList, PlaceOfSupply);
                                                }

                                                return acc;
                                              }, { posDropDownList: [] });

                                              setFilterDropDownList(updatedFilterDropDownList);

                                            } else if (hot?.getSelected()[0][1] == 5 || hot?.getSelected()[0][1] == 6) {

                                              var searchInput1 = document.getElementById("amount1");
                                              var searchInput2 = document.getElementById("amount2");
                                              const invFromDate = ''
                                              const invToDate = ''
                                              var columnName = atColumns[currentCol1]?.data;
                                              var value = (searchInput1?.value || searchInput2?.value) && `${invFromDate ? invFromDate : invToDate}to${invToDate ? invToDate : invFromDate}`;
                                              hot?.getSelected()[0][1] == 5 && setFromAmount('');
                                              hot?.getSelected()[0][1] == 5 && setToAmount('');
                                              hot?.getSelected()[0][1] == 6 && setFromTax('');
                                              hot?.getSelected()[0][1] == 6 && setToTax('');
                                              let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                                              filterObject.push({ [columnName]: value });
                                              setGridCustomFilter(filterObject)
                                              let newFilterData = FilterData(filterObject);
                                              setData([...newFilterData]);

                                            } else if (hot?.getSelected()?.[0]?.[1] == 4) {

                                              var searchInput1 = document.getElementById("custom1");
                                              var searchInput2 = document.getElementById("custom2");
                                              const invFromDate = searchInput1?.value
                                              const invToDate = searchInput2?.value
                                              var columnName = atColumns[currentCol1]?.data;
                                              var value = (searchInput1?.value || searchInput2?.value) && `${invFromDate ? invFromDate : invToDate}to${invToDate ? invToDate : invFromDate}`;
                                              setSearchDate('');
                                              setToDate('');
                                              let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                                              filterObject.push({ [columnName]: value });
                                              setGridCustomFilter(filterObject)
                                              let newFilterData = FilterData(filterObject);
                                              setData([...newFilterData]);
                                            }
                                            //** End
                                          }
                                          clickEvent.stopImmediatePropagation();
                                        }

                                        clickEvent.stopImmediatePropagation();
                                      },
                                    },
                                    filter_action_bar: {},
                                  },
                                }}
                                afterDropdownMenuShow={function (instance) {
                                  var checkboxes = document.getElementsByClassName('checkBoxClass');

                                  const {
                                    posDropDownList,
                                  } = filterDropDownList;

                                  const listsToCheck = [
                                    posDropDownList,
                                  ];

                                  for (var j = 0; j < checkboxes.length; j++) {
                                    for (var k = 0; k < listsToCheck.length; k++) {
                                      if (listsToCheck[k]) {

                                        // For rcmDropDownList, check both conditions listsToCheck[k][i] == checkboxes[j].value and checkboxes?.length == 2
                                        if (k === 0) {

                                          for (var i = 0; i < listsToCheck[k].length; i++) {
                                            if (listsToCheck[k][i] == checkboxes[j].value) {
                                              $(checkboxes[j]).prop("checked", true);
                                              break;
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }}
                                afterFilter={function (data, coords) {
                                  const hot = hotRefAt?.current?.hotInstance;
                                  if (hot?.getSelected()[0][1] != 4 && hot?.getSelected()[0][1] != 5 && hot?.getSelected()[0][1] != 6 && hot?.getSelected()[0][1] != 7) {
                                    var searchInput = document.querySelector(
                                      ".htUIMultipleSelectSearch.htUIInput"
                                    );
                                    var value = searchInput?.children[0]?.value;
                                    var x = searchVal1;
                                    var columnName = atColumns[currentCol1]?.data;
                                    let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                                    filterObject.push({ [columnName]: value });

                                    if (!searchVal1?.length) {

                                      x.push(value);
                                      let y = currentCol;
                                      y.push(
                                        atColumns[currentCol1]?.data
                                      );
                                      setSearchVal1(x);
                                      setCurrentCol(y);
                                    } else {

                                      const Index = currentCol?.findIndex(
                                        (item) =>
                                          atColumns[currentCol1]?.data ==
                                          item
                                      );
                                      if (Index != -1) {
                                        const xyz = searchVal1;
                                        xyz[Index] = value;
                                        setSearchVal1(xyz);
                                      } else {
                                        x.push(value);
                                        let y = currentCol;
                                        y.push(
                                          atColumns[currentCol1]?.data
                                        );
                                        setSearchVal1(x);
                                        setCurrentCol(y);
                                      }
                                    }

                                    setGridCustomFilter(filterObject)
                                    let newFilterData = FilterData(filterObject);
                                    setData([...newFilterData]);
                                  } else if (hot?.getSelected()?.[0]?.[1] == 7) {

                                    var checkboxes = document.getElementsByClassName('checkBoxClass');
                                    arrChk = []
                                    setFilterDropDownList([]);
                                    var columnName = atColumns[currentCol1]?.data;
                                    let filterObject = !gridCustomFilter ? [] : gridCustomFilter

                                    filterObject = filterObject == null || filterObject.length <= 0 ? [] : filterObject;

                                    for (let i = 0; i < checkboxes.length; i++) {
                                      if (checkboxes[i].checked) {

                                        arrChk.push({ [columnName]: checkboxes[i].value });

                                        filterObject.push({ [columnName]: checkboxes[i].value });
                                      } else {

                                        let uniqueArray = filterObject.filter((obj, index, self) =>
                                          index === self.findIndex((t) => (
                                            JSON.stringify(t) === JSON.stringify(obj)
                                          ))
                                        );
                                        filterObject = uniqueArray
                                        const index = filterObject.findIndex(obj => obj[columnName] === checkboxes[i].value);
                                        if (index !== -1) {

                                          delete filterObject[index][columnName];
                                        }
                                      }
                                    }
                                    setGridCustomFilter(filterObject)
                                    let newFilterData = FilterData(filterObject);
                                    setData([...newFilterData]);

                                    const updatedFilterDropDownList = filterObject.reduce((acc, item) => {
                                      const { PlaceOfSupply } = item;

                                      const updateList = (list, value) => {
                                        return list.includes(value) ? list : [...list, value];
                                      };

                                      if (PlaceOfSupply !== undefined) {
                                        acc.posDropDownList = updateList(acc.posDropDownList, PlaceOfSupply);
                                      }

                                      return acc;
                                    }, { posDropDownList: [] });

                                    setFilterDropDownList(updatedFilterDropDownList);

                                  } else if (hot?.getSelected()[0][1] == 5 || hot?.getSelected()[0][1] == 6) {

                                    var searchInput1 = document.getElementById("amount1");
                                    var searchInput2 = document.getElementById("amount2");
                                    const invFromDate = searchInput1?.value
                                    const invToDate = searchInput2?.value
                                    var columnName = atColumns[currentCol1]?.data;
                                    var value = `${invFromDate}to${invToDate}`;
                                    hot?.getSelected()[0][1] == 5 && setFromAmount(searchInput1?.value);
                                    hot?.getSelected()[0][1] == 5 && setToAmount(searchInput2?.value);
                                    hot?.getSelected()[0][1] == 6 && setFromTax(searchInput1?.value);
                                    hot?.getSelected()[0][1] == 6 && setToTax(searchInput2?.value);
                                    let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                                    filterObject.push({ [columnName]: value });
                                    setGridCustomFilter(filterObject)
                                    let newFilterData = FilterData(filterObject);
                                    setData([...newFilterData]);

                                  } else if (hot?.getSelected()?.[0]?.[1] == 4) {

                                    var searchInput1 = document.getElementById("custom1");
                                    var searchInput2 = document.getElementById("custom2");
                                    const invFromDate = searchInput1?.value
                                    const invToDate = searchInput2?.value
                                    var columnName = atColumns[currentCol1]?.data;
                                    var value = (searchInput1?.value || searchInput2?.value) && `${invFromDate ? invFromDate : invToDate}to${invToDate ? invToDate : invFromDate}`;
                                    setSearchDate(searchInput1?.value);
                                    setToDate(searchInput2?.value);
                                    let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                                    filterObject.push({ [columnName]: value });
                                    setGridCustomFilter(filterObject)
                                    let newFilterData = FilterData(filterObject);
                                    setData([...newFilterData]);
                                  }
                                }}
                                // autoColumnSize={true}
                                autoColumnSize={{
                                  samplingRatio: 23  // Adjust the samplingRatio as needed
                                }}
                                height="auto"
                                manualColumnResize={false}
                                stretchH="all"
                                afterGetColHeader={theader}
                                colHeaders={colHeaders}
                                rowHeaders={false}
                                filters={true}
                                bindRowsWithHeaders={false}
                                licenseKey="non-commercial-and-evaluation"
                                viewportColumnRenderingOffset={100}
                                afterOnCellMouseDown={localAfterOnCellMouseDown}
                                selectionMode="range"
                                cells={function (row, col) {
                                  var cp = {};
                                  const hot = hotRefAt?.current?.hotInstance;
                                  if (col !== null) {
                                    cp.renderer = emptyRenderAt;
                                  }
                                  if (col == 0 && !GSTR1FiledData.length > 0) {

                                    cp.className = "text-center";
                                  }
                                  if (
                                    col == 5 ||
                                    col == 6
                                  ) {
                                    cp.className = "text-end";
                                  }
                                  return cp;
                                }}
                              // hiddenColumns={false}
                              // hiddenColumns={{
                              //   columns: [0],
                              // }}
                              />
                            )}

                            {customPagination()}

                          </div>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </TabPane>
              }


              {/* Nil-Exempt Data */}
              {
                activeTab == 5 &&
                <TabPane tabId="5" key="5">
                  <Card>
                    <CardBody className="CardBody p-0">
                      <Row className="p-1">
                        <Col md={8}>
                          <table className="table table-bordered summary-table">
                            <tbody>
                              <tr>
                                <td>
                                  <p className="mb-0">
                                    Nil-Rated Supplies <br />
                                    <span> {totalIGST ? totalIGST : 0}</span>
                                  </p>
                                </td>
                                <td>
                                  <p className="mb-0">
                                    Exempted <br />
                                    <span> {totalSGST ? totalSGST : 0}</span>
                                  </p>
                                </td>
                                <td>
                                  <p className="mb-0">
                                    Non-GST Supplies
                                    <br />
                                    <span>{totalCess ? totalCess : 0}</span>
                                  </p>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </Col>
                        <Col md={4}>
                          <Row>
                            <Col sm={4}>
                              <Label className="form-label">Invoice Type</Label>
                              <Select
                                id="tax_invtype"
                                placeholder="Invoice Type"
                                theme={selectThemeColors}
                                components={animatedComponents}
                                isDisabled={true}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                value={{ label: "Exemp", value: "exemp" }}
                              />
                            </Col>
                            <Col sm={4}>
                              <Label className="form-label">From</Label>
                              <Select
                                id="tax_frDt"
                                placeholder="From"
                                isClearable={false}
                                theme={selectThemeColors}
                                closeMenuOnSelect={true}
                                options={panDataFrom}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                components={animatedComponents}
                                onChange={selectFromYear}
                                value={finFromYear}
                                isDisabled={true}
                              />
                            </Col>
                            <Col sm={4}>
                              <Label className="form-label">To</Label>
                              <Select
                                id="tax_frTo"
                                placeholder="To"
                                isClearable={false}
                                theme={selectThemeColors}
                                closeMenuOnSelect={true}
                                options={panData}
                                components={animatedComponents}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                onChange={selectFromMonth}
                                value={monthFrom}
                                isDisabled={true}
                              />
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                  <CardBody className="CardBody p-0">
                    <Row

                    >
                      <Col sm="12">
                        <div>
                          {/* Active tab 5 */}
                          {activeTab == 5 && purchaseData?.length ? (
                            <HotTable
                              ref={hotRefExemp}
                              columnSorting={false}
                              // autoColumnSize={true}
                              autoColumnSize={{
                                samplingRatio: 23  // Adjust the samplingRatio as needed
                              }}
                              height="auto"
                              manualColumnResize={false}
                              renderAllRows={false}
                              stretchH="all"
                              rowHeights={RowSize}
                              columnHeaderHeight={columnHeaderSize}
                              data={purchaseData ? purchaseData : []}
                              columns={ExempColumn}
                              colHeaders={colHeaders}
                              rowHeaders={false}
                              bindRowsWithHeaders={false}
                              licenseKey="non-commercial-and-evaluation"
                              selectionMode="range"
                              mergeCells={false}
                              afterGetColHeader={theader1}
                              cells={function (row, col) {
                                const cellPrp = {};
                                if (col !== null) {
                                  cellPrp.renderer = emptyRender;
                                }
                                if (col == 0 && row == 0) {
                                  cellPrp.readOnly = true;
                                }
                                if (
                                  col === 2 ||
                                  col === 3 ||
                                  col === 4 ||
                                  col === 1
                                ) {
                                  cellPrp.className = "text-end";
                                }
                                return cellPrp;
                              }}
                            />
                          ) : (
                            <HotTable
                              // autoColumnSize={true}
                              autoColumnSize={{
                                samplingRatio: 23  // Adjust the samplingRatio as needed
                              }}
                              manualColumnResize={false}
                              afterGetColHeader={theader1}
                              rowHeights={RowSize}
                              columnHeaderHeight={columnHeaderSize}
                              renderAllRows={false}
                              stretchH="all"
                              rowHeaders={false}
                              height="auto"

                              data={[{ Description: "No Data Found!" }]}
                              cells={function (row, col) {
                                var cp = {};

                                if (col == 0) {

                                  cp.className = "text-center";
                                }
                                return cp;

                              }}
                              mergeCells={[
                                { row: 0, col: 0, rowspan: 1, colspan: 4 },
                              ]}
                              preventOverflow="horizontal"
                              colHeaders={colHeaders}
                              columns={ExempColumn}
                              licenseKey="non-commercial-and-evaluation"
                              selectionMode="range"
                            />
                          )}
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </TabPane>
              }


              {/* doc */}
              {
                activeTab == 4 &&
                <TabPane tabId="4" key="4">
                  <Card>
                    <CardBody className="CardBody p-0">
                      <Row className="p-1">
                        <Col md={8}></Col>
                        <Col md={4}>
                          <Row>
                            <Col sm={4}>
                              <Label className="form-label">Invoice Type</Label>
                              <Select
                                id="tax_invtype"
                                placeholder="Invoice Type"
                                theme={selectThemeColors}
                                components={animatedComponents}
                                isDisabled={true}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                value={{ label: "Docs", value: "docs" }}
                              />
                            </Col>
                            <Col sm={4}>
                              <Label className="form-label">From Date</Label>
                              <Select
                                id="tax_frDt"
                                placeholder="From"
                                isClearable={false}
                                theme={selectThemeColors}
                                closeMenuOnSelect={true}
                                options={panDataFrom}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                components={animatedComponents}
                                onChange={selectFromYear}
                                value={finFromYear}
                                isDisabled={true}
                              />
                            </Col>
                            <Col sm={4}>
                              <Label className="form-label">To Date</Label>
                              <Select
                                id="tax_frTo"
                                placeholder="To"
                                isClearable={false}
                                theme={selectThemeColors}
                                closeMenuOnSelect={true}
                                options={panData}
                                components={animatedComponents}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                onChange={selectFromMonth}
                                value={monthFrom}
                                isDisabled={true}
                              />
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                  <CardBody className="CardBody p-0">
                    <Row>
                      <Col sm="12">
                        <div>

                          {/* Active tab 4 docs */}
                          {activeTab == 4 && gstr1Docsdata?.length ? (
                            <HotTable
                              height="auto"
                              ref={hotRefInputCredit}
                              columnSorting={false}
                              // autoColumnSize={true}
                              autoColumnSize={{
                                samplingRatio: 23  // Adjust the samplingRatio as needed
                              }}
                              manualColumnResize={false}
                              renderAllRows={false}
                              rowHeights={RowSize}
                              columnHeaderHeight={columnHeaderSize}
                              stretchH="all"
                              filters={true}
                              readOnly={true}
                              data={gstr1Docsdata ? gstr1Docsdata : []}
                              columns={DocColumns}
                              rowHeaders={false}
                              bindRowsWithHeaders={false}
                              licenseKey="non-commercial-and-evaluation"
                              selectionMode="range"
                              mergeCells={false}
                              afterGetColHeader={theader1}
                              afterOnCellMouseDown={docslocalAfterOnCellMouseDown}
                              dropdownMenu={{
                                items: {
                                  filter_by_value: {
                                    name: "Search Value"
                                  },
                                  clear: {
                                    name: `<button id='btnClear' name='Clear'   value='Clear'>Clear</button>`,
                                    //disabled: true,
                                    callback: function (
                                      key,
                                      selection,
                                      clickEvent
                                    ) {
                                      console.log("date picker clicked");
                                      var src = clickEvent.target;
                                      console.log("name", src.tagName);
                                      if (
                                        src.tagName.toLowerCase() === "button"
                                      ) {
                                        if (clickEvent.target.id == "btnClear") {
                                          //** start
                                          const hot =
                                            hotRefInputCredit?.current?.hotInstance;

                                          var searchInput1 =
                                            document.getElementById("custom3");
                                          var value = "";
                                          setSearchDate(value);

                                          const x = searchValdoc;
                                          if (!searchValdoc?.length) {
                                            x.push(value);
                                            let y = currentCol;
                                            y.push(
                                              DocColumns[currentCol1doc]?.data
                                            );

                                            setSearchValdoc(x);
                                            setCurrentColdoc(y);
                                          } else {
                                            const Index =
                                              currentColdoc?.findIndex(
                                                (item) =>
                                                  DocColumns[
                                                    currentCol1doc
                                                  ]?.data == item
                                              );

                                            if (Index != -1) {
                                              const xyz = searchValdoc;
                                              xyz[Index] = value;
                                              setSearchValdoc(xyz);
                                            } else {
                                              x.push(value);
                                              let y = currentCol;
                                              y.push(
                                                DocColumns[currentCol1doc]?.data
                                              );

                                              setSearchValdoc(x);
                                              setCurrentColdoc(y);
                                            }
                                          }

                                          const invType = 0;
                                          setPage(0);

                                          let uniq = [...new Set(currentColdoc)];

                                          for (let i = 0; i < uniq.length; i++) {
                                            var obj = {};

                                            for (let j = 0; j < searchValdoc.length; j++) {
                                              if (i == j) {
                                                obj[uniq[i]] = searchValdoc[j];
                                                arrFilter.push(obj);
                                              }
                                            }
                                          }
                                          let newFilterData = FilterData(arrFilter);
                                          //  setDocData()
                                          setDocData([...newFilterData]);

                                          //** End
                                        }

                                        clickEvent.stopImmediatePropagation();
                                      }



                                      clickEvent.stopImmediatePropagation();
                                    },
                                  },

                                  filter_action_bar: {},
                                },
                              }}
                              afterFilter={function (data, coords) {
                                var searchInput = document.querySelector(
                                  ".htUIMultipleSelectSearch.htUIInput"
                                );
                                var value = searchInput?.children[0].value;
                                const x = searchValdoc;
                                if (!searchValdoc?.length) {
                                  x.push(value);
                                  let y = currentColdoc;
                                  y.push(
                                    DocColumns[currentCol1doc]?.data
                                  );
                                  setSearchValdoc(x);
                                  setCurrentColdoc(y);
                                } else {
                                  const Index = currentColdoc?.findIndex(
                                    (item) =>
                                      DocColumns[currentCol1doc]?.data ==
                                      item
                                  );
                                  if (Index != -1) {
                                    const xyz = searchValdoc;
                                    xyz[Index] = value;
                                    setSearchValdoc(xyz);
                                  } else {
                                    x.push(value);
                                    let y = currentColdoc;
                                    y.push(
                                      DocColumns[currentCol1doc]?.data
                                    );

                                    setSearchValdoc(x);
                                    setCurrentColdoc(y);
                                  }
                                }
                                let arrFilter = [];
                                let uniq = [...new Set(currentColdoc)];

                                for (let i = 0; i < uniq.length; i++) {
                                  var obj = {};

                                  for (let j = 0; j < searchValdoc.length; j++) {
                                    if (i == j) {
                                      obj[uniq[i]] = searchValdoc[j];
                                      arrFilter.push(obj);
                                    }
                                  }
                                }
                                let newFilterData = FilterData(arrFilter);
                                setDocData([...newFilterData]);
                              }}

                              cells={function (row, col) {
                                const cellPrp = {};
                                // if (finFromYear?.value == monthFrom?.value) {
                                //   if (
                                //     col === 2 ||
                                //     col === 3 ||
                                //     col === 4 ||
                                //     col === 5
                                //   ) {
                                //     cellPrp.readOnly = false;
                                //   }
                                // } else {
                                //   cellPrp.readOnly = true;
                                // }

                                if (

                                  col === 3 ||
                                  col === 4 ||
                                  col === 5

                                ) {
                                  cellPrp.className = "text-end";
                                }
                                if (col !== null) {
                                  cellPrp.renderer = emptyRender;
                                }
                                if (col === 6) {
                                  cellPrp.renderer = myBtnsofDocs;
                                  cellPrp.readOnly = true;
                                  cellPrp.className = "text-center";
                                }
                                return cellPrp;
                              }}
                              beforeKeyDown={function (e, col) {
                                if (e.key == "Backspace" || e.key == "Delete") {
                                } else {
                                  var reg = /^[0-9.]+|[\b]+$/;
                                  //  console.log(this.getSelectedLast()[1]);
                                  let col = this.getSelectedLast()[1];

                                  // if (
                                  //   col == 2 ||
                                  //   col == 3 ||
                                  //   col == 4 ||
                                  //   col == 5
                                  // ) {
                                  //   if (!reg.test(e.key)) {
                                  //     e.preventDefault();
                                  //   }
                                  // }
                                }
                              }}
                            />
                          ) : (
                            <HotTable
                              // autoColumnSize={true}
                              autoColumnSize={{
                                samplingRatio: 23  // Adjust the samplingRatio as needed
                              }}
                              manualColumnResize={false}
                              renderAllRows={false}
                              rowHeights={RowSize}
                              columnHeaderHeight={columnHeaderSize}
                              stretchH="all"
                              rowHeaders={false}
                              height="auto"

                              data={[{ NatureOfDocument: "No Data Found!" }]}

                              cells={function (row, col) {
                                var cp = {};

                                if (col == 0) {

                                  cp.className = "text-center";
                                }
                                return cp;

                              }}
                              mergeCells={[
                                { row: 0, col: 0, rowspan: 1, colspan: 6 },
                              ]}
                              preventOverflow="horizontal"
                              colHeaders={colHeaders}
                              columns={DocColumns}
                              licenseKey="non-commercial-and-evaluation"
                              selectionMode="range"
                              afterGetColHeader={theader1}
                              afterOnCellMouseDown={docslocalAfterOnCellMouseDown}
                              filters={true}
                              dropdownMenu={{
                                items: {
                                  filter_by_value: {
                                    name: "Search Value"
                                  },
                                  clear: {
                                    name: `<button id='btnClear' name='Clear'   value='Clear'>Clear</button>`,
                                    //disabled: true,
                                    callback: function (
                                      key,
                                      selection,
                                      clickEvent
                                    ) {
                                      console.log("date picker clicked");
                                      var src = clickEvent.target;
                                      console.log("name", src.tagName);
                                      if (
                                        src.tagName.toLowerCase() === "button"
                                      ) {
                                        if (clickEvent.target.id == "btnClear") {
                                          //** start
                                          const hot =
                                            hotRefInputCredit?.current?.hotInstance;

                                          var searchInput1 =
                                            document.getElementById("custom3");
                                          var value = "";
                                          setSearchDate(value);

                                          const x = searchValdoc;
                                          if (!searchValdoc?.length) {
                                            x.push(value);
                                            let y = currentCol;
                                            y.push(
                                              DocColumns[currentCol1doc]?.data
                                            );

                                            setSearchValdoc(x);
                                            setCurrentColdoc(y);
                                          } else {
                                            const Index =
                                              currentColdoc?.findIndex(
                                                (item) =>
                                                  DocColumns[
                                                    currentCol1doc
                                                  ]?.data == item
                                              );

                                            if (Index != -1) {
                                              const xyz = searchValdoc;
                                              xyz[Index] = value;
                                              setSearchValdoc(xyz);
                                            } else {
                                              x.push(value);
                                              let y = currentCol;
                                              y.push(
                                                DocColumns[currentCol1doc]?.data
                                              );

                                              setSearchValdoc(x);
                                              setCurrentColdoc(y);
                                            }
                                          }

                                          const invType = 0;
                                          setPage(0);

                                          let uniq = [...new Set(currentColdoc)];

                                          for (let i = 0; i < uniq.length; i++) {
                                            var obj = {};

                                            for (let j = 0; j < searchValdoc.length; j++) {
                                              if (i == j) {
                                                obj[uniq[i]] = searchValdoc[j];
                                                arrFilter.push(obj);
                                              }
                                            }
                                          }
                                          let newFilterData = FilterData(arrFilter);
                                          //  setDocData()
                                          setDocData([...newFilterData]);

                                          //** End
                                        }

                                        clickEvent.stopImmediatePropagation();
                                      }



                                      clickEvent.stopImmediatePropagation();
                                    },
                                  },

                                  filter_action_bar: {},
                                },
                              }}
                              afterFilter={function (data, coords) {
                                var searchInput = document.querySelector(
                                  ".htUIMultipleSelectSearch.htUIInput"
                                );
                                var value = searchInput?.children[0].value;
                                const x = searchValdoc;
                                if (!searchValdoc?.length) {
                                  x.push(value);
                                  let y = currentColdoc;
                                  y.push(
                                    DocColumns[currentCol1doc]?.data
                                  );
                                  setSearchValdoc(x);
                                  setCurrentColdoc(y);
                                } else {
                                  const Index = currentColdoc?.findIndex(
                                    (item) =>
                                      DocColumns[currentCol1doc]?.data ==
                                      item
                                  );
                                  if (Index != -1) {
                                    const xyz = searchValdoc;
                                    xyz[Index] = value;
                                    setSearchValdoc(xyz);
                                  } else {
                                    x.push(value);
                                    let y = currentColdoc;
                                    y.push(
                                      DocColumns[currentCol1doc]?.data
                                    );

                                    setSearchValdoc(x);
                                    setCurrentColdoc(y);
                                  }
                                }
                                let arrFilter = [];
                                let uniq = [...new Set(currentColdoc)];

                                for (let i = 0; i < uniq.length; i++) {
                                  var obj = {};

                                  for (let j = 0; j < searchValdoc.length; j++) {
                                    if (i == j) {
                                      obj[uniq[i]] = searchValdoc[j];
                                      arrFilter.push(obj);
                                    }
                                  }
                                }
                                let newFilterData = FilterData(arrFilter);
                                setDocData([...newFilterData]);
                              }}
                              viewportColumnRenderingOffset={100}
                            />
                          )}
                          <ReactPaginate
                            breakLabel="..."
                            nextLabel=""
                            onPageChange={(e) => handleDocsPageClick(e?.selected)}
                            pageRangeDisplayed={2}
                            pageCount={pageCountdoc}
                            forcePage={page}
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
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </TabPane>
              }


              {/* hsn starts here */}
              {
                activeTab == 3 &&
                <TabPane tabId="3" key="3">
                  <Card>
                    <CardBody className="CardBody p-0">
                      <Row className="p-1">
                        <Col md={8}>
                          <table className="table table-bordered summary-table">
                            <tbody>
                              <tr>
                                <td>
                                  <p className="mb-0">
                                    HSN <br />
                                    <span>
                                      {" "}
                                      {totalInvoice ? formatTotalWithoutDecimal(totalInvoice) : 0}
                                    </span>
                                  </p>
                                </td>

                                <td>
                                  <p className="mb-0">
                                    HSN Values <br />
                                    <span>
                                      {" "}
                                      {totalInvoiceValue
                                        ? formatINR(totalInvoiceValue)
                                        : 0}
                                    </span>
                                  </p>
                                </td>
                                <td>
                                  <p className="mb-0">
                                    Taxable Values{"  "} (₹) <br />
                                    <span>
                                      {totalTaxableValue
                                        ? formatINR(totalTaxableValue)
                                        : 0}
                                    </span>
                                  </p>
                                </td>

                                <td>
                                  <p className="mb-0">
                                    IGST (₹) <br />
                                    <span>
                                      {" "}
                                      {totalIGST ? formatINR(totalIGST) : 0}
                                    </span>
                                  </p>
                                </td>
                                <td>
                                  <p className="mb-0">
                                    SGST (₹) <br />
                                    <span>
                                      {" "}
                                      {totalSGST ? formatINR(totalSGST) : 0}
                                    </span>
                                  </p>
                                </td>
                                <td>
                                  <p className="mb-0">
                                    CGST (₹) <br />
                                    <span>
                                      {" "}
                                      {totalCGST ? formatINR(totalCGST) : 0}
                                    </span>
                                  </p>
                                </td>
                                <td>
                                  <p className="mb-0">
                                    Cess (₹) <br />
                                    <span>
                                      {totalCess ? formatINR(totalCess) : 0}
                                    </span>
                                  </p>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </Col>
                        <Col md={4}>
                          <Row>
                            <Col sm={4}>
                              <Label className="form-label">Invoice Type</Label>
                              <Select
                                id="crdr_invtype"
                                placeholder="Invoice Type"
                                theme={selectThemeColors}
                                components={animatedComponents}
                                isDisabled={true}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                value={{ label: "HSN", value: "hsn" }}
                              />
                            </Col>
                            <Col sm={4}>
                              <Label className="form-label">From</Label>
                              <Select
                                id="from1"
                                placeholder="From"
                                isClearable={false}
                                theme={selectThemeColors}
                                closeMenuOnSelect={true}
                                options={panDataFrom}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                components={animatedComponents}
                                onChange={selectFromYear}
                                value={finFromYear}
                                isDisabled={true}
                              />
                            </Col>
                            <Col sm={4}>
                              <Label className="form-label">To</Label>
                              <Select
                                id="to1"
                                placeholder="To"
                                isClearable={false}
                                theme={selectThemeColors}
                                closeMenuOnSelect={true}
                                options={panData}
                                components={animatedComponents}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                onChange={selectFromMonth}
                                value={monthFrom}
                                isDisabled={true}
                              />
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                  <CardBody className="CardBody p-0">
                    <Row>
                      <Col sm="12">
                        <div>
                          {console.log(GSTR1FiledData, "GSTR1FiledData")}
                          {/* Active tab 3 */}
                          {activeTab == 3 && (
                            <HotTable
                              ref={hotRefHsn}
                              columnSorting={true}
                              renderAllRows={false}
                              rowHeights={RowSize}
                              columnHeaderHeight={columnHeaderSize}
                              filters={true}
                              data={GSTR1FiledData.length > 0 ? GSTR1FiledData : [{ HSN: "No Data Found!" }]}
                              columns={GSTR1FiledData.length > 0 ? hsnInvalidColumns : hsnInvalidColumnsEmpty}
                              mergeCells={
                                [GSTR1FiledData.length > 0 ? false :
                                  { row: 0, col: 0, rowspan: 1, colspan: 10 },
                                ]}
                              dropdownMenu={{
                                items: {
                                  filter_by_value: {
                                    name: "Search Value",
                                    hidden() {
                                      const selectedValue = this.getSelected()[0][1];
                                      const isValidColumn = ![0, 1].includes(selectedValue);

                                      return isValidColumn;
                                    },
                                  },
                                  about: { // For CheckBox custom option

                                    name: `<div  style=${checkboxFilterCss}>${checkBoxTitle}<label class="float-end text-danger "><a><u id="selectAll">Select All</u></a></label></div> <div  class="checkboxmenu custom-scrollbar"> <div >  <table id="searchTable" >
                                    ${dropDonwName &&
                                      dropDonwName?.map((index) => (
                                        `<tr><td><input class="checkBoxClass" type="checkbox" value="${index?.label}" /> <span class="fw-normal">${index?.label?.length > 20 ? index?.label?.substring(0, 20) + "..." : index?.label}</span> </td></tr>`
                                      )).join('')
                                      }

                                      </table></div>
                                      </div>`, // Name can contain HTML
                                    hidden() {
                                      const selectedCol = this.getSelectedRangeLast().to.col;
                                      const isHiddenCol = ![2, 5].includes(selectedCol);

                                      return isHiddenCol;
                                    },

                                    callback: function (key, selection, clickEvent) {

                                      var src = clickEvent.target;
                                      if (src.tagName == 'U') {
                                        if (clickEvent.target.id == 'selectAll') {
                                          $(".checkBoxClass").prop('checked', true);
                                        }

                                      }
                                      if (src.tagName == 'SPAN') {
                                        $('input[type="checkbox]').trigger('click').prop('checked', true);

                                      }
                                      clickEvent.stopImmediatePropagation();
                                    },

                                  },

                                  option3: createOptionMinMax(fromQun, toQun, 3),
                                  option4: createOptionMinMax(fromTax, toTax, 4),
                                  option6: createOptionMinMax(fromValue, toValue, 6),
                                  option7: createOptionMinMax(fromIgst, toIgst, 7),
                                  option8: createOptionMinMax(fromCgst, toCgst, 8),
                                  option9: createOptionMinMax(fromSgst, toSgst, 9),
                                  option10: createOptionMinMax(fromCess, toCess, 10),

                                  clear: {
                                    name: `<button id='btnClear' name='Clear'   value='Clear'>Clear</button>`,
                                    //disabled: true,
                                    callback: function (
                                      key,
                                      selection,
                                      clickEvent
                                    ) {
                                      console.log("date picker clicked");
                                      var src = clickEvent.target;
                                      console.log("name", src.tagName);
                                      if (
                                        src.tagName.toLowerCase() === "button"
                                      ) {
                                        if (clickEvent.target.id == "btnClear") {
                                          //** start
                                          const hot =
                                            hotRefHsn?.current?.hotInstance;

                                          if (hot?.getSelected()?.[0]?.[1] == 0 || hot?.getSelected()?.[0]?.[1] == 1) {
                                            var searchInput = document.querySelector(
                                              ".htUIMultipleSelectSearch.htUIInput"
                                            );

                                            var value = '';
                                            var x = searchValcrdr;
                                            var columnName = hsnInvalidColumns[currentCol1crdr]?.data;
                                            let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                                            filterObject.push({ [columnName]: value });

                                            if (!searchValcrdr?.length) {
                                              x.push(value);
                                              let y = currentColcrdr;
                                              y.push(
                                                hsnInvalidColumns[currentCol1crdr]?.data
                                              );
                                              setSearchValcrdr(x);
                                              setCurrentColcrdr(y);
                                            } else {
                                              const Index = currentColcrdr?.findIndex(
                                                (item) =>
                                                  hsnInvalidColumns[currentCol1crdr]?.data ==
                                                  item
                                              );
                                              if (Index != -1) {
                                                const xyz = searchValcrdr;
                                                xyz[Index] = value;
                                                setSearchValcrdr(xyz);
                                              } else {
                                                x.push(value);
                                                let y = currentColcrdr;
                                                y.push(
                                                  hsnInvalidColumns[currentCol1crdr]?.data
                                                );

                                                setSearchValcrdr(x);
                                                setCurrentColcrdr(y);
                                              }
                                            }

                                            setGridCustomFilter(filterObject)
                                            let newFilterData = FilterData(filterObject);
                                            setData([...newFilterData]);
                                          } else if (hot?.getSelected()?.[0]?.[1] == 2 || hot?.getSelected()?.[0]?.[1] == 5) {

                                            var checkboxes = document.getElementsByClassName('checkBoxClass');
                                            arrChk = []
                                            setFilterDropDownList([]);
                                            var columnName = hsnInvalidColumns[currentCol1crdr]?.data;
                                            let filterObject = !gridCustomFilter ? [] : gridCustomFilter

                                            filterObject = filterObject == null || filterObject.length <= 0 ? [] : filterObject;

                                            for (let i = 0; i < checkboxes.length; i++) {
                                              if (checkboxes[i].checked) {
                                                let uniqueArray = filterObject.filter((obj, index, self) =>
                                                  index === self.findIndex((t) => (
                                                    JSON.stringify(t) === JSON.stringify(obj)
                                                  ))
                                                );
                                                filterObject = uniqueArray
                                                const index = filterObject.findIndex(obj => obj[columnName] === checkboxes[i].value);
                                                if (index !== -1) {

                                                  delete filterObject[index][columnName];
                                                }
                                              }
                                            }
                                            setGridCustomFilter(filterObject)
                                            let newFilterData = FilterData(filterObject);
                                            setData([...newFilterData]);

                                            const updatedFilterDropDownList = filterObject.reduce((acc, item) => {
                                              const { Rate, PlaceOfSupply } = item;

                                              const updateList = (list, value) => {
                                                return list.includes(value) ? list : [...list, value];
                                              };

                                              if (Rate !== undefined) {
                                                acc.rateDropDownList = updateList(acc.rateDropDownList, Rate);
                                              } else if (PlaceOfSupply !== undefined) {
                                                acc.posDropDownList = updateList(acc.posDropDownList, PlaceOfSupply);
                                              }

                                              return acc;
                                            }, { rateDropDownList: [], posDropDownList: [] });

                                            setFilterDropDownList(updatedFilterDropDownList);

                                          } else {

                                            var columnName = hsnInvalidColumns[currentCol1crdr]?.data;

                                            var value = '';
                                            hot?.getSelected()[0][1] == 3 && setFromQun('');
                                            hot?.getSelected()[0][1] == 3 && setToQun('');
                                            hot?.getSelected()[0][1] == 4 && setFromTax('');
                                            hot?.getSelected()[0][1] == 4 && setToTax('');
                                            hot?.getSelected()[0][1] == 6 && setFromValue('');
                                            hot?.getSelected()[0][1] == 6 && setToValue('');
                                            hot?.getSelected()[0][1] == 7 && setFromIgst('');
                                            hot?.getSelected()[0][1] == 7 && setToIgst('');
                                            hot?.getSelected()[0][1] == 8 && setFromCgst('');
                                            hot?.getSelected()[0][1] == 8 && setToCgst('');
                                            hot?.getSelected()[0][1] == 9 && setFromSgst('');
                                            hot?.getSelected()[0][1] == 9 && setToSgst('');
                                            hot?.getSelected()[0][1] == 10 && setFromCess('');
                                            hot?.getSelected()[0][1] == 10 && setToCess('');
                                            let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                                            filterObject.push({ [columnName]: value });
                                            setGridCustomFilter(filterObject)
                                            let newFilterData = FilterData(filterObject);
                                            setData([...newFilterData]);

                                          }

                                          //** End
                                        }

                                        clickEvent.stopImmediatePropagation();
                                      }



                                      clickEvent.stopImmediatePropagation();
                                    },
                                  },

                                  filter_action_bar: {},
                                },
                              }}
                              afterDropdownMenuShow={function (instance) {
                                var checkboxes = document.getElementsByClassName('checkBoxClass');
                                const {
                                  uqcDropDownList, rateDropDownList
                                } = filterDropDownList;

                                const listsToCheck = [
                                  uqcDropDownList, rateDropDownList
                                ];


                                for (var j = 0; j < checkboxes.length; j++) {

                                  for (var k = 0; k < listsToCheck.length; k++) {
                                    if (listsToCheck[k]) {


                                      if (k === 0 || k === 1) {

                                        for (var i = 0; i < listsToCheck[k].length; i++) {
                                          if (listsToCheck[k][i] == checkboxes[j].value) {
                                            $(checkboxes[j]).prop("checked", true);
                                            break;
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }}
                              afterFilter={function (data, coords) {
                                const hot = hotRefHsn?.current?.hotInstance;
                                console.log(hot?.getSelected()?.[0]?.[1], 'partcol', hot)
                                if (hot?.getSelected()?.[0]?.[1] == 0 || hot?.getSelected()?.[0]?.[1] == 1) {
                                  var searchInput = document.querySelector(
                                    ".htUIMultipleSelectSearch.htUIInput"
                                  );

                                  var value = searchInput?.children[0]?.value;
                                  var x = searchValcrdr;
                                  var columnName = hsnInvalidColumns[currentCol1crdr]?.data;
                                  let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                                  filterObject.push({ [columnName]: value });

                                  if (!searchValcrdr?.length) {
                                    x.push(value);
                                    let y = currentColcrdr;
                                    y.push(
                                      hsnInvalidColumns[currentCol1crdr]?.data
                                    );
                                    setSearchValcrdr(x);
                                    setCurrentColcrdr(y);
                                  } else {
                                    const Index = currentColcrdr?.findIndex(
                                      (item) =>
                                        hsnInvalidColumns[currentCol1crdr]?.data ==
                                        item
                                    );
                                    if (Index != -1) {
                                      const xyz = searchValcrdr;
                                      xyz[Index] = value;
                                      setSearchValcrdr(xyz);
                                    } else {
                                      x.push(value);
                                      let y = currentColcrdr;
                                      y.push(
                                        hsnInvalidColumns[currentCol1crdr]?.data
                                      );

                                      setSearchValcrdr(x);
                                      setCurrentColcrdr(y);
                                    }
                                  }

                                  setGridCustomFilter(filterObject)
                                  let newFilterData = FilterData(filterObject);
                                  setData([...newFilterData]);
                                } else if (hot?.getSelected()?.[0]?.[1] == 2 || hot?.getSelected()?.[0]?.[1] == 5) {

                                  var checkboxes = document.getElementsByClassName('checkBoxClass');
                                  arrChk = []
                                  setFilterDropDownList([]);
                                  var columnName = hsnInvalidColumns[currentCol1crdr]?.data;
                                  let filterObject = !gridCustomFilter ? [] : gridCustomFilter

                                  filterObject = filterObject == null || filterObject.length <= 0 ? [] : filterObject;

                                  for (let i = 0; i < checkboxes.length; i++) {
                                    if (checkboxes[i].checked) {

                                      arrChk.push({ [columnName]: checkboxes[i].value });

                                      filterObject.push({ [columnName]: checkboxes[i].value });
                                    } else {

                                      let uniqueArray = filterObject.filter((obj, index, self) =>
                                        index === self.findIndex((t) => (
                                          JSON.stringify(t) === JSON.stringify(obj)
                                        ))
                                      );
                                      filterObject = uniqueArray
                                      const index = filterObject.findIndex(obj => obj[columnName] === checkboxes[i].value);
                                      if (index !== -1) {

                                        delete filterObject[index][columnName];
                                      }
                                    }
                                  }
                                  setGridCustomFilter(filterObject)
                                  let newFilterData = FilterData(filterObject);
                                  setData([...newFilterData]);

                                  const updatedFilterDropDownList = filterObject.reduce((acc, item) => {
                                    const { Rate, UQC } = item;

                                    const updateList = (list, value) => {
                                      return list.includes(value) ? list : [...list, value];
                                    };

                                    if (Rate !== undefined) {
                                      acc.rateDropDownList = updateList(acc.rateDropDownList, Rate);
                                    } else if (UQC !== undefined) {
                                      acc.uqcDropDownList = updateList(acc.uqcDropDownList, UQC);
                                    }

                                    return acc;
                                  }, { rateDropDownList: [], uqcDropDownList: [] });

                                  setFilterDropDownList(updatedFilterDropDownList);

                                } else {

                                  var searchInput1 = document.getElementById("amount1");
                                  var searchInput2 = document.getElementById("amount2");
                                  const invFromDate = searchInput1?.value
                                  const invToDate = searchInput2?.value
                                  var columnName = hsnInvalidColumns[currentCol1crdr]?.data;

                                  var value = `${invFromDate}to${invToDate}`;
                                  hot?.getSelected()[0][1] == 3 && setFromQun(searchInput1?.value);
                                  hot?.getSelected()[0][1] == 3 && setToQun(searchInput2?.value);
                                  hot?.getSelected()[0][1] == 4 && setFromTax(searchInput1?.value);
                                  hot?.getSelected()[0][1] == 4 && setToTax(searchInput2?.value);
                                  hot?.getSelected()[0][1] == 6 && setFromValue(searchInput1?.value);
                                  hot?.getSelected()[0][1] == 6 && setToValue(searchInput2?.value);
                                  hot?.getSelected()[0][1] == 7 && setFromIgst(searchInput1?.value);
                                  hot?.getSelected()[0][1] == 7 && setToIgst(searchInput2?.value);
                                  hot?.getSelected()[0][1] == 8 && setFromCgst(searchInput1?.value);
                                  hot?.getSelected()[0][1] == 8 && setToCgst(searchInput2?.value);
                                  hot?.getSelected()[0][1] == 9 && setFromSgst(searchInput1?.value);
                                  hot?.getSelected()[0][1] == 9 && setToSgst(searchInput2?.value);
                                  hot?.getSelected()[0][1] == 10 && setFromCess(searchInput1?.value);
                                  hot?.getSelected()[0][1] == 10 && setToCess(searchInput2?.value);
                                  let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                                  filterObject.push({ [columnName]: value });
                                  setGridCustomFilter(filterObject)
                                  let newFilterData = FilterData(filterObject);
                                  setData([...newFilterData]);

                                }

                              }}
                              // autoColumnSize={true}
                              autoColumnSize={{
                                samplingRatio: 23  // Adjust the samplingRatio as needed
                              }}
                              height="auto"
                              manualColumnResize={false}
                              stretchH="all"
                              afterGetColHeader={theader1}
                              colHeaders={colHeaders}
                              rowHeaders={false}
                              bindRowsWithHeaders={false}
                              licenseKey="non-commercial-and-evaluation"
                              afterOnCellMouseDown={hsnlocalAfterOnCellMouseDown}
                              selectionMode="range"
                              cells={function (row, col) {
                                var cp = {};
                                const hot = hotRefCrdr?.current?.hotInstance;
                                if (col !== null && purchaseData?.length > 0) {
                                  cp.renderer = emptyRender;
                                }
                                if (col == 0 && !GSTR1FiledData.length > 0) {

                                  cp.className = "text-center";
                                }

                                if (
                                  col == 3 ||
                                  col == 4 ||
                                  col == 5 ||
                                  col == 6 ||
                                  col == 7 ||
                                  col == 8 ||
                                  col == 9 ||
                                  col == 10 ||
                                  col == 11
                                ) {
                                  cp.className = "text-end";
                                }

                                if (col === 12) {
                                  cp.renderer = myBtns;
                                  cp.readOnly = true;
                                }
                                if (row == 3) {
                                  cp.editor == false;
                                }
                                if (col == 1) {
                                  if (GSTR1FiledData[row]?.Description?.length > 12) {
                                    cp.comment = {
                                      value: GSTR1FiledData?.[row]?.Description,
                                      readOnly: true,
                                    };
                                    cp.renderer = myLables;
                                  }
                                }
                                return cp;
                              }}
                              comments={true}

                            />
                          )}
                          {customPagination()}

                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </TabPane>
              }

            </TabContent>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default GSTR1FileDataInvoices;


