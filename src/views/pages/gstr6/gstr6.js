import { Fragment, useState, useEffect, useRef } from "react";
import { API_URL_GSTR6, PageSize,RowSize, columnHeaderSize } from "../../../configs/config";
import { HotTable } from "@handsontable/react";
import Handsontable from "handsontable";
import { textRenderer } from "handsontable/renderers";
import { registerAllModules } from "handsontable/registry";
import GSRT1SummaryInvoice from "../../../services/gstr1/gstr1Services/gstr1PurchaseInvoiceService";
import gstr6PurchaseInvoice from "../../../services/gstr6/gstr6PurchaseInvoice";
import gstr6SummaryService from "../../../services/gstr6/gstr6SummaryService";
import errorCodeConfig from "../../../configs/apiErrorCodeConfig";
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
import { showTotalRowPerPage } from "../../../helper/tableRowsPerPage";
import { DROPDOWN_PLACEHOLDER, SELECT_MAXSIZE,paginationList } from "../../../configs/config";
import { globleVariable } from "../../../configs/globalVariable";
import LocalFunction from "../../../configs/getLocalFunction";
import SessionFunction from "../../../configs/getSessionFunction";
import { downloadURL } from "@helper/downloadUrl";
const MySwal = withReactContent(Swal);
const animatedComponents = makeAnimated();

registerAllModules();

// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  Input,
  Label,
  TabContent,
  TabPane,
  CardBody,
  Table,
} from "reactstrap";
import ReactPaginate from "react-paginate";
import Tabs from "./tabs";
import withReactContent from "sweetalert2-react-content";
import { filterCurrentDate } from "../../../helper/filterArray";

let isChecked = false;
const optionField = { label: "--Select--", value: "-1" };
var unitList = [];
var taxList = [];
var placeOfSupplyList = [];
let itcEligibilityList = [];

const finYearOption = LocalFunction.getLocalValue(
  globleVariable.rangeFilters,
  true
);
const YearList = JSON.parse(finYearOption);
const refershData = "refData";

const FinDateTime = LocalFunction.getLocalValue(
  globleVariable.serverDateTime,
  true
);
const Gstr6Invoices = ({ returnDate }) => {
  let fromPath = window.location.pathname;
  const navigate = useNavigate();

  const { setGSRT1Data, stepper } = useOutletContext();
  const [block, setBlock] = useState(false);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(PageSize);
  const [currentCol, setCurrentCol] = useState([]);
  const [currentCol1, setCurrentCol1] = useState();
  const [searchVal1, setSearchVal1] = useState([]);
  const [searchDate, setSearchDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [pageNoTitle , setPageNoTitle] = useState("");
  const [ totalRowsShow ,setTotalRowsShow] = useState(0)


  useEffect(() => {
    let rope = showTotalRowPerPage(page,rowsPerPage,totalRowsShow)
    console.log(totalRowsShow,"totalRowsShow")
    console.log("totalRowsShow",rowsPerPage)
    console.log("totalRowsShow",page)
    setPageNoTitle(rope)
    
  },[page,rowsPerPage,totalRowsShow])

     // checkBox State
     const [supplyType,setSupplyType] = useState([]);
     const [unitType,setUnitType] = useState([]);
     const [originalUnitType,setOriginalUnitType] = useState([]);
     const [placeOfSupply,setPlaceOfSupply] = useState([]);
     const [sezSupplier,setSezSupplier] = useState([]);
     const [eligibilityofITC,setEligibilityofITC] = useState([]);
     const [noteType, setNoteType] = useState([]);
     const [isdDocumentType,setIsdDocumentType] = useState([])
     const [isLocatedInSez,setIsLocatedInSez] = useState([]);
     const [rate,setRate] = useState([]);
     const [action,setAction] = useState([]);
     const [pageTotTitle, setpageTotTitle] = useState("Rows Per Page :");
     const [pageNoSelect, setPageNoSelect] = useState(paginationList[0]);
     var arrChk = [];
     
     console.log(supplyType,unitType,"unitTypeunitType")
   
     const [filterDropDownList, setFilterDropDownList] = useState({
       supplyTypeDropdownList : [],
       unitTypeDropDownList : [],
       originalUnitTypeDropDownList : [],
       posDropDownList: [],
       sezDropDownList: [],
       eligibilityofITCDropDownList: [],
       noteTypeDropDownList: [],
       docTypeDropDownList: [],
       isLocatedDropDownList: [],
       rateDropDownList: [],
       actionDropDownList: []
     })
  
  // for Invoice Value State Maintain
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");

  // for Taxable Value State Value
  const [fromAmountTaxable, setFromAmountTaxable] = useState("");
  const [toAmountTaxable, setToAmountTaxable] = useState("");

  // for ISGT Value State Value
  const [fromAmountIGST, setFromAmountIGST] = useState("");
  const [toAmountIGST, setToAmountIGST] = useState("");

   // for CGST Value State Value
   const [fromAmountCGST, setFromAmountCGST] = useState("");
   const [toAmountCGST, setToAmountCGST] = useState("");

   // for SGST Value State Value
   const [fromAmountSGST, setFromAmountSGST] = useState("");
   const [toAmountSGST, setToAmountSGST] = useState("");

   // for Cess Value State Value
  const [fromAmountCESS, setFromAmountCESS] = useState("");
  const [toAmountCESS, setToAmountCESS] = useState("");
  const [gridCustomFilter, setGridCustomFilter] = useState([]);
  const [searchDate1, setSearchDate1] = useState("");
  const [searchDate1To, setSearchDate1To] = useState("");
  const [searchDate2, setSearchDate2] = useState("");
  const [searchDate2To, setSearchDate2To] = useState("");
  const [searchDate3, setSearchDate3] = useState("");
  const [searchDate3To, setSearchDate3To] = useState("");
  const [typeofDocument, setTypeOfDocumnent] = useState([]);

  const [b2csData, setB2csData] = useState([]);
  const [b2csPage, setB2csPage] = useState(0);
  const [currentColb2cs, setCurrentColb2cs] = useState([]);
  const [currentCol1b2cs, setCurrentCol1b2cs] = useState();
  const [searchValb2cs, setSearchValb2cs] = useState([]);

  const [atSummaryData, setAtSummaryData] = useState([]);
  const [currentColcrdr, setCurrentColcrdr] = useState([]);
  const [currentCol1crdr, setCurrentCol1crdr] = useState();
  const [searchValcrdr, setSearchValcrdr] = useState([]);

  const [count, setCount] = useState(0);
  const [row1, setRow1] = useState([]);
  const [modalshow, setModalshow] = useState(false);
  const [activeTab, setActiveTab] = useState("1");
  const [selectedFrameworks, setSelectedFrameworks] = useState([]);
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
  const [searchBy, setSerchBy] = useState(false);

  // filter value set
  const [invoiceTypeList, setInvoiceTypeList] = useState([]);
  const [subTypeList, setSubTypeList] = useState([optionField]);
  const [vendorList, setVendorList] = useState([]);
  const [reverchargeList, setReverchargeList] = useState([]);
  const [crDrList, setCrDrList] = useState([]);
  const [crdrInvoiceTypeList, setCrDrInvoiceTypeList] = useState([]);
  const [crdrInvoiceType, setCrDrInvoiceType] = useState([]);

  const [b2csInvoiceTypeList, setB2csInvoiceTypeList] = useState([]);
  const [b2csInvoiceType, setB2csInvoiceType] = useState([]);
  const [atInvoiceTypeList, setAtInvoiceTypeList] = useState([]);
  const [atInvoiceType, setAtInvoiceType] = useState([]);

  // Fin year and month
  const [finFromYearList, setFinFromYearList] = useState([]);
  const [finToYearList, setFinToYearList] = useState([]);
  const [monthFromList, setMonthFromList] = useState([]);
  const [monthToList, setMonthToList] = useState([]);

  // set values
  const [gstinList, setGstinList] = useState([]);
  const [gstIn, setGstIn] = useState(null);
  const [invoceTypes, setInvoceTypes] = useState([]);
  const [invoceTypesAdvPayment, setInvoceTypesAdvPayment] = useState([]);

  const [subTypes, setsubTypes] = useState(null);
  const [vendorName, setVendorName] = useState(null);
  const [reverseChargeType, setReverseChargeType] = useState(null);
  const [crDrType, setCrDrType] = useState(null);
  const [multiSelection, setMultiSelection] = useState(false);
  const [crMultiSelection, setCrMultiSelection] = useState(false);

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

  //hsn changeable data
  const [hsnCheck, setHsnCheck] = useState(true);
  const [docsCheck, setDocsCheck] = useState(true);
  const [hsnEvenCheck, setHsnEvenCheck] = useState(true);
  const [disableSaveExempt, setDisableSaveExempt] = useState(false);

  //ITC
  const [btnDisable1, setbtnDisable1] = useState(false);
  const [srcLoad, setSrcLoad] = useState(false);
  const [exemptErrorArr, setExemptErrorArr] = useState([]);
  const [returnPeriodDisable, setReturnPeriodIdDisable] = useState(true);
  const [financialYearList, setFinancialYearList] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);

  const [itcErrorArr, setItcErrorArr] = useState([]);
  const [lateFeeErrorArr, setLateFeeErrorArr] = useState([]);

  const G_UCParId = SessionFunction.getSessionValue(
    globleVariable.G_UCParId,
    true
  );
  const G_FY = SessionFunction.getSessionValue(globleVariable.G_FY, true);
  const G_FM = SessionFunction.getSessionValue(globleVariable.G_FM, true);
  const G_GSTIN = SessionFunction.getSessionValue(globleVariable.G_GSTIN, true);
  const G_UCID = SessionFunction.getSessionValue(globleVariable.G_UCID, true);
//  const gstr1Range =
//     sessionStorage.getItem(globleVariable.defaultYear) &&
//     SessionFunction.getSessionValue(globleVariable.defaultYear, true);
const gstr1Range =
    sessionStorage.getItem(globleVariable.defaultYear) &&
    SessionFunction.getSessionValue(globleVariable.defaultYear, true);

  const token = LocalFunction.getLocalValue(globleVariable.tokenKey, true);

  useEffect(() => {
    console.log("open modal");
    const currDateTime = JSON.parse(FinDateTime).toString().split("T")[0];
    const frDataFilter = filterCurrentDate(YearList, currDateTime);
    if (frDataFilter?.length > 0) {
      setFinancialYearList(frDataFilter);
    }
    const frData = frDataFilter?.filter((item) => item.value == returnDate)[0];
    if (frData !== undefined) {
      setSelectedYear(frData);
    } else {
      setSelectedYear(frDataFilter?.length > 0 ? frDataFilter[0] : null);
    }
  }, [hsnShow, docShow]);

  useEffect(() => {
    let activeTabData = {
      activeTab: activeTab,
      btnDisable1: btnDisable1,
      deleteSaleInvoice:
        activeTab == 7
          ? deleteITC
          : activeTab == 8
          ? deleteLateFee
          : deleteSaleInvoice,
      ExportSectionWiseData: ExportSectionWiseData,
      ClearFilter: ClearFilter,
      ItcSaveInvoice: ItcSaveInvoice,
      lateFeeSaveInvoice: lateFeeSaveInvoice,
    };
    setGSRT1Data(false, activeTabData);
  }, [invoceTypes, activeTab, data]);

  useEffect(() => {
    // Purchase Master
    GSRT1SummaryInvoice.saletblStaticDataMaster()
      .then((res) => {
        console.log(res);
        if (
          res.status == 200 &&
          res.data.status === errorCodeConfig.APIDefaultCode.Success
        ) {
          var resData = res.data.data;
          // setTaxrate(resData.taxrate)
          // setUnitMeasurement(resData.unitMeasurement)
          unitList = resData?.unitMeasurement;
          for (let i = 0; i < unitList?.length; i++) {
            unitList[i].label = unitList[i]["text"];
            delete unitList[i].text;
          }

          taxList = resData?.taxrate;
          for (let i = 0; i < taxList?.length; i++) {
            taxList[i].label = taxList[i]["text"];
            delete taxList[i].text;
          }

          placeOfSupplyList = resData?.placeOfSupply;
          console.log(placeOfSupplyList, "placeOfSupplyList");
          for (let i = 0; i < placeOfSupplyList?.length; i++) {
            placeOfSupplyList[i].label = placeOfSupplyList[i]["text"];
            delete placeOfSupplyList[i].text;
          }
          // taxList = resData?.taxrate?.map((X) => X.text);
          // placeOfSupplyList = resData?.placeOfSupply
          // itcEligibilityList = resData?.itcEligibility?.map((X) => X?.text);
          console.log("unit list=", unitList);
        } else {
          toast.error(res.errorMessage, {
            position: "top-right",
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
  }, []);



  // useEffect(() => {
  //   stepper != null && stepper.to(2);
  // }, [stepper]);

  const location = useLocation();
  let { id } = useParams();

  let searchUrlValue = null;

  //** GSTR 6 Columns
  const b2bColumns = [
    {
      data: "select",
      type: "checkbox",
      width: 25,
      readOnly: false,
    },
    {
      data: "supplierGSTIN",
      title: "Supplier GSTIN",
      readOnly:true
    },
    {
      data: "supplierName",
      title: "Supplier Name",
      readOnly:true
    },
    {
      data: "invoiceNumber",
      title: "Invoice No",
    },
    {
      data: "invoiceDateLabel",
      title: "Invoice Date",
    },

    {
      data: "invoiceValue",
      title: "Invoice Value (₹)",
    },
    {
      data: "placeOfSupply",
      title: "Place of Supply",
    },
    {
      data: "supplyType",
      title: "Supply Type",
    },
    {
      data: "rate",
      title: "Rate",
    },
    {
      data: "taxableValue",
      title: "Taxable Value (₹)"
    },
    {
      data: "igst",
      title: "Integrated Tax (₹)",
    },

    {
      data: "cgst",
      title: "Central Tax (₹)",
    },
    {
      data: "sgst",
      title: "State/UT Tax (₹)",
    },
    {
      data: "cess",
      title: "CESS (₹)",
    },
    {
      data: "statusofGSTR1of5",
      title: "Status of GSTR1/5",
    },
    {
      data: "invoiceStatus",
      title: "Invoice Status",
    },
    {
      data: "action",
      title: "Action",
    },
  ];
  const b2bColumnsEmpty = [
    {
      data: "select",
      title: "",
      width: 1,
      readOnly: true,
    },
    {
      data: "supplierGSTIN",
      title: "Supplier GSTIN",
      readOnly:true
    },
    {
      data: "supplierName",
      title: "Supplier Name",
      readOnly:true
    },
    {
      data: "invoiceNumber",
      title: "Invoice No",
    },
    {
      data: "invoiceDateLabel",
      title: "Invoice Date",
    },

    {
      data: "invoiceValue",
      title: "Invoice Value (₹)",
    },
    {
      data: "placeOfSupply",
      title: "Place of Supply",
    },
    {
      data: "supplyType",
      title: "Supply Type",
    },
    {
      data: "rate",
      title: "Rate",
    },
    {
      data: "taxableValue",
      title: "Taxable Value (₹)"
    },
    {
      data: "igst",
      title: "Integrated Tax (₹)",
    },

    {
      data: "cgst",
      title: "Central Tax (₹)",
    },
    {
      data: "sgst",
      title: "State/UT Tax (₹)",
    },
    {
      data: "cess",
      title: "CESS (₹)",
    },
    {
      data: "statusofGSTR1of5",
      title: "Status of GSTR1/5",
    },
    {
      data: "invoiceStatus",
      title: "Invoice Status",
    },
    {
      data: "action",
      title: "Action",
    },
  ];

  const ITCrevisedColumns = [
    {
      data: "select",
      type: "checkbox",
      width: 25,
      readOnly: false,
    },

    {
      data: "originalSupplierGSTIN",
      title: "Original GSTIN Supplier",
      readOnly: true,
    },
    {
      data: "originalInvoiceNumber",
      title: "Original Invoice Number",
      readOnly: true,
    },
    {
      data: "originalInvoiceDateLabel",
      title: "Original Invoice Date",
      readOnly: true,
    },
    {
      data: "supplierGSTIN",
      title: "Suppliers GSTIN",
      readOnly: true,
    },
    {
      data: "supplierName",
      title: "Supplier Name",
      readOnly:true
    },
    {
      data: "revisedInvoiceDateLabel",
      title: "Revised Invoice Date",
      readOnly: true,
    },
    {
      data: "revisedInvoiceNumber",
      title: "Invoice No",
      readOnly: true,
    },
    {
      data: "revisedInvoiceValue",
      title: "Invoice Value (₹)",
      readOnly: true,
      //   width:"500"
    },
    {
      data: "placeOfSupply",
      title: "Place of Supply",
      readOnly: true,
    },

    {
      data: "sezSupplier",
      title: "SEZ Supplier (Yes/No)",
      readOnly: true,
    },
    {
      data: "rate",
      title: "Rate",
      readOnly: true,
      //   width:"500"
    },
    {
      data: "taxableValue",
      title: "Taxable Value (₹)",
      readOnly: true,
    },
    {
      data: "igst",
      title: "Integrated Tax (₹)",
      readOnly: true,
    },

    {
      data: "cgst",
      title: "Central Tax (₹)",
      readOnly: true,
    },
    {
      data: "sgst",
      title: "State/UT Tax (₹)",
      readOnly: true,
    },
    {
      data: "cess",
      title: "CESS (₹)",
      readOnly: true,
    },
    {
      data: "statusofGSTR1of5",
      title: "Status of GSTR1/5",
      readOnly: true,
    },
    {
      data: "invoiceStatus",
      title: "Invoice Status",
      readOnly: true,
    },
    {
      data: "action",
      title: "Action",
      readOnly: true,
    },
  ];

  const ITCrevisedColumnsEmpty = [
    {
      data: "select",
      title: "",
      width: 1,
      readOnly: false,
    },

    {
      data: "originalSupplierGSTIN",
      title: "Original GSTIN Supplier",
      readOnly: true,
    },
    {
      data: "originalInvoiceNumber",
      title: "Original Invoice Number",
      readOnly: true,
    },
    {
      data: "originalInvoiceDateLabel",
      title: "Original Invoice Date",
      readOnly: true,
    },
    {
      data: "supplierGSTIN",
      title: "Suppliers GSTIN",
      readOnly: true,
    },
    {
      data: "supplierName",
      title: "Supplier Name",
      readOnly:true
    },
    {
      data: "revisedInvoiceDateLabel",
      title: "Revised Invoice Date",
      readOnly: true,
    },
    {
      data: "revisedInvoiceNumber",
      title: "Invoice No",
      readOnly: true,
    },
    {
      data: "revisedInvoiceValue",
      title: "Invoice Value (₹)",
      readOnly: true,
      //   width:"500"
    },
    {
      data: "placeOfSupply",
      title: "Place of Supply",
      readOnly: true,
    },

    {
      data: "sezSupplier",
      title: "SEZ Supplier (Yes/No)",
      readOnly: true,
    },
    {
      data: "rate",
      title: "Rate",
      readOnly: true,
      //   width:"500"
    },
    {
      data: "taxableValue",
      title: "Taxable Value (₹)",
      readOnly: true,
    },
    {
      data: "igst",
      title: "Integrated Tax (₹)",
      readOnly: true,
    },

    {
      data: "cgst",
      title: "Central Tax (₹)",
      readOnly: true,
    },
    {
      data: "sgst",
      title: "State/UT Tax (₹)",
      readOnly: true,
    },
    {
      data: "cess",
      title: "CESS (₹)",
      readOnly: true,
    },
    {
      data: "statusofGSTR1of5",
      title: "Status of GSTR1/5",
      readOnly: true,
    },
    {
      data: "invoiceStatus",
      title: "Invoice Status",
      readOnly: true,
    },
    {
      data: "action",
      title: "Action",
      readOnly: true,
    },
  ];

  const cdnColumns = [
    {
      data: "select",
      type: "checkbox",
      width: 25,
      readOnly: false,
    },

    {
      data: "supplierGSTIN",
      title: "Supplier GSTIN",
      readOnly: true,
    },
    {
      data: "supplierName",
      title: "Supplier Name",
      readOnly:true
    },
    {
      data: "noteType",
      title: "Note Type",
      readOnly: true,
    },

    {
      data: "noteNumber",
      title: "Note Number",
      readOnly: true,
    },
    {
      data: "noteDateLabel",
      title: "Note Date",
      readOnly: true,
    },
    {
      data: "invoiceValue",
      title: "Value (₹)",
      readOnly: true,
    },
    {
      data: "originalInvoiceofCreditNote",
      title: "Original Invoice No",
      readOnly: true,
    },

    {
      data: "dateofOriginalInvoiceofCreditNoteLabel",
      title: "Original Invoice Date",
      readOnly: true,
    },

    {
      data: "placeOfSupply",
      title: "Place of Supply",
      readOnly: true,
    },

    {
      data: "supplyType",
      title: "Supply Type",
      readOnly: true,
    },
    {
      data: "rate",
      title: "Rate",
      readOnly: true,
    },
    {
      data: "taxableValue",
      title: "Taxable Value (₹)",
      readOnly: true,
    },
    {
      data: "igst",
      title: "Integrated Tax (₹)",
      readOnly: true,
    },

    {
      data: "cgst",
      title: "Central Tax (₹)",
      readOnly: true,
    },
    {
      data: "sgst",
      title: "State/UT Tax (₹)",
      readOnly: true,
    },
    {
      data: "cess",
      title: "CESS (₹)",
      readOnly: true,
    },
    {
      data: "filingStatusofGSTR1of5",
      title: "Filing Status of GSTR1/5",
      readOnly: true,
    },
    {
      data: "invoiceStatus",
      title: "Invoice Status",
      readOnly: true,
    },
    {
      data: "action",
      title: "Action",
      readOnly: true,
    },
  ];
  const cdnColumnsEmpty = [
    {
      data: "select",
      title:'',
      width: 1,
      readOnly: true,
    },

    {
      data: "supplierGSTIN",
      title: "Supplier GSTIN",
      readOnly: true,
    },
    {
      data: "supplierName",
      title: "Supplier Name",
      readOnly:true
    },
    {
      data: "noteType",
      title: "Note Type",
      readOnly: true,
    },

    {
      data: "noteNumber",
      title: "Note Number",
      readOnly: true,
    },
    {
      data: "noteDateLabel",
      title: "Note Date",
      readOnly: true,
    },
    {
      data: "invoiceValue",
      title: "Value (₹)",
      readOnly: true,
    },
    {
      data: "originalInvoiceofCreditNote",
      title: "Original Invoice No",
      readOnly: true,
    },

    {
      data: "dateofOriginalInvoiceofCreditNoteLabel",
      title: "Original Invoice Date",
      readOnly: true,
    },

    {
      data: "placeOfSupply",
      title: "Place of Supply",
      readOnly: true,
    },

    {
      data: "supplyType",
      title: "Supply Type",
      readOnly: true,
    },
    {
      data: "rate",
      title: "Rate",
      readOnly: true,
    },
    {
      data: "taxableValue",
      title: "Taxable Value (₹)",
      readOnly: true,
    },
    {
      data: "igst",
      title: "Integrated Tax (₹)",
      readOnly: true,
    },

    {
      data: "cgst",
      title: "Central Tax (₹)",
      readOnly: true,
    },
    {
      data: "sgst",
      title: "State/UT Tax (₹)",
      readOnly: true,
    },
    {
      data: "cess",
      title: "CESS (₹)",
      readOnly: true,
    },
    {
      data: "filingStatusofGSTR1of5",
      title: "Filing Status of GSTR1/5",
      readOnly: true,
    },
    {
      data: "invoiceStatus",
      title: "Invoice Status",
      readOnly: true,
    },
    {
      data: "action",
      title: "Action",
      readOnly: true,
    },
  ];

  const cdnaColumns = [
    {
      data: "select",
      type: "checkbox",
      width: 25,
      readOnly: false,
    },

    {
      data: "originalSupplierGSTIN",
      title: "Original Supplier GSTIN",
      readOnly: true,
    },
    {
      data: "originalInvoiceNumber",
      title: "Original Document No",
      readOnly: true,
    },

    {
      data: "originalInvoiceDateLabel",
      title: "Original Document Date",
      readOnly: true,
    },
    {
      data: "supplierGSTIN",
      title: "Supplier GSTIN",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
      width: "150",
    },
    {
      data: "supplierName",
      title: "Supplier Name",
      readOnly:true
    },

    {
      data: "noteType",
      title: "Note Type",
      readOnly: true,
    },

    {
      data: "revisedNoteNumber",
      title: "Note Number",
      readOnly: true,
    },
    {
      data: "revisedInvoiceValue",
      title: "Value (₹)",
      readOnly: true,
    },
    {
      data: "revisedNoteDateLabel",
      title: "Note Date",
      readOnly: true,
    },
    {
      data: "revisedInvoiceNumber",
      title: "Original Invoice No",
      readOnly: true,
    },

    {
      data: "revisedInvoiceDateLabel",
      title: "Original Invoice Date",
      readOnly: true,
    },

    {
      data: "placeOfSupply",
      title: "Place of Supply",
      readOnly: true,
    },

    {
      data: "supplyType",
      title: "Supply Type",
      readOnly: true,
    },
    {
      data: "rate",
      title: "Rate",
      readOnly: true,
    },
    {
      data: "taxableValue",
      title: "Taxable Value (₹)",
      readOnly: true,
    },
    {
      data: "igst",
      title: "Integrated Tax (₹)",
      readOnly: true,
    },

    {
      data: "cgst",
      title: "Central Tax (₹)",
      readOnly: true,
    },
    {
      data: "sgst",
      title: "State/UT Tax (₹)",
      readOnly: true,
    },
    {
      data: "cess",
      title: "CESS (₹)",
      readOnly: true,
    },
    {
      data: "filingSstatusofGSTR1of5",
      title: "Filing Status of GSTR1/5",
      readOnly: true,
    },
    {
      data: "invoiceStatus",
      title: "Invoice Status",
      readOnly: true,
    },
    {
      data: "action",
      title: "Action",
      readOnly: true,
    },
 
  ];
  const cdnaColumnsEmpty = [
    {
      data: "select",
      title:'',
      width: 1,
      readOnly: true,
    },

    {
      data: "originalSupplierGSTIN",
      title: "Original Supplier GSTIN",
      readOnly: true,
    },
    {
      data: "originalInvoiceNumber",
      title: "Original Document No",
      readOnly: true,
    },

    {
      data: "originalInvoiceDateLabel",
      title: "Original Document Date",
      readOnly: true,
    },
    {
      data: "supplierGSTIN",
      title: "Supplier GSTIN",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
      width: "150",
    },
    {
      data: "supplierName",
      title: "Supplier Name",
      readOnly:true
    },

    {
      data: "noteType",
      title: "Note Type",
      readOnly: true,
    },

    {
      data: "revisedNoteNumber",
      title: "Note Number",
      readOnly: true,
    },
    {
      data: "revisedInvoiceValue",
      title: "Value (₹)",
      readOnly: true,
    },
    {
      data: "revisedNoteDateLabel",
      title: "Note Date",
      readOnly: true,
    },
    {
      data: "revisedInvoiceNumber",
      title: "Original Invoice No",
      readOnly: true,
    },

    {
      data: "revisedInvoiceDateLabel",
      title: "Original Invoice Date",
      readOnly: true,
    },

    {
      data: "placeOfSupply",
      title: "Place of Supply",
      readOnly: true,
    },

    {
      data: "supplyType",
      title: "Supply Type",
      readOnly: true,
    },
    {
      data: "rate",
      title: "Rate",
      readOnly: true,
    },
    {
      data: "taxableValue",
      title: "Taxable Value (₹)",
      readOnly: true,
    },
    {
      data: "igst",
      title: "Integrated Tax (₹)",
      readOnly: true,
    },

    {
      data: "cgst",
      title: "Central Tax (₹)",
      readOnly: true,
    },
    {
      data: "sgst",
      title: "State/UT Tax (₹)",
      readOnly: true,
    },
    {
      data: "cess",
      title: "CESS (₹)",
      readOnly: true,
    },
    {
      data: "filingSstatusofGSTR1of5",
      title: "Filing Status of GSTR1/5",
      readOnly: true,
    },
    {
      data: "invoiceStatus",
      title: "Invoice Status",
      readOnly: true,
    },
    {
      data: "action",
      title: "Action",
      readOnly: true,
    },
  ];

  const distributionOfItcColumns = [
    {
      data: "select",
      type: "checkbox",
      width: 25,
      readOnly: false,
    },
    {
      data: "eligibilityOfITC",
      title: "Eligibility of ITC",
      readOnly: true,
    },
    {
      data: "unitType",
      title: "Unit Type",
      readOnly: true,
    },

    {
      data: "recipientGSTIN",
      title: "Recipient Supplier GSTIN",
      readOnly: true,
    },
    {
      data: "supplierName",
      title: "Recipient Supplier Name",
      readOnly:true
    },
    {
      data: "noteType",
      title: "ISD Document Type",
      readOnly: true,
    },
    {
      data: "invoiceNumber",
      title: "ISD Invoice Number",
      readOnly: true,
    },

    {
      data: "invoiceDateLabel",
      title: "ISD Invoice Date",
      readOnly: true,
    },
    {
      data: "noteNumber",
      title: "ISD Credit Note Number",
      readOnly: true,
    },
    {
      data: "noteDateLabel",
      title: "ISD Credit Note Date",
      readOnly: true,
    },
    {
      data: "originalInvoiceofCreditNote",
      title: "Original Invoice No",
      readOnly: true,
    },

    {
      data: "dateofOriginalInvoiceofCreditNoteLabel",
      title: "Original Invoice Date",
      readOnly: true,
    },

    {
      data: "sezSupplier",
      title: "Is unit located in SEZ",
      readOnly: true,
    },

    {
      data: "igst",
      title: "Integrated Tax (₹)",
      readOnly: true,
    },

    {
      data: "cgst",
      title: "Central Tax (₹)",
      readOnly: true,
    },
    {
      data: "sgst",
      title: "State/UT Tax (₹)",
      readOnly: true,
    },
    {
      data: "cess",
      title: "CESS (₹)",
      readOnly: true,
    },
    {
      data: "integratedTaxReversal",
      title: "Integrated Tax (₹)",
      readOnly: true,
    },

    {
      data: "centralTaxReversal",
      title: "Central Tax (₹)",
      readOnly: true,
    },
    {
      data: "stateUTTaxReversal",
      title: "State/UT Tax (₹)",
      readOnly: true,
    },
    {
      data: "cessReversal",
      title: "CESS (₹)",
      readOnly: true,
    },
    {
      data: "action",
      title: "Action",
      readOnly: true,
    },
  ];
  const distributionOfItcColumnsEmpty = [
    {
      data: "select",
      title:'',
      width: 1,
      readOnly: true,
    },
    {
      data: "eligibilityOfITC",
      title: "Eligibility of ITC",
      readOnly: true,
    },
    {
      data: "unitType",
      title: "Unit Type",
      readOnly: true,
    },

    {
      data: "recipientGSTIN",
      title: "Recipient Supplier GSTIN",
      readOnly: true,
    },
    {
      data: "supplierName",
      title: "Recipient Supplier Name",
      readOnly:true
    },
    {
      data: "noteType",
      title: "ISD Document Type",
      readOnly: true,
    },
    {
      data: "invoiceNumber",
      title: "ISD Invoice Number",
      readOnly: true,
    },

    {
      data: "invoiceDateLabel",
      title: "ISD Invoice Date",
      readOnly: true,
    },
    {
      data: "noteNumber",
      title: "ISD Credit Note Number",
      readOnly: true,
    },
    {
      data: "noteDateLabel",
      title: "ISD Credit Note Date",
      readOnly: true,
    },
    {
      data: "originalInvoiceofCreditNote",
      title: "Original Invoice No",
      readOnly: true,
    },

    {
      data: "dateofOriginalInvoiceofCreditNoteLabel",
      title: "Original Invoice Date",
      readOnly: true,
    },

    {
      data: "sezSupplier",
      title: "Is unit located in SEZ*",
      readOnly: true,
    },

    {
      data: "igst",
      title: "Integrated Tax (₹)",
      readOnly: true,
    },

    {
      data: "cgst",
      title: "Central Tax (₹)",
      readOnly: true,
    },
    {
      data: "sgst",
      title: "State/UT Tax (₹)",
      readOnly: true,
    },
    {
      data: "cess",
      title: "CESS (₹)",
      readOnly: true,
    },
    {
      data: "integratedTaxReversal",
      title: "Integrated Tax (₹)",
      readOnly: true,
    },

    {
      data: "centralTaxReversal",
      title: "Central Tax (₹)",
      readOnly: true,
    },
    {
      data: "stateUTTaxReversal",
      title: "State/UT Tax (₹)",
      readOnly: true,
    },
    {
      data: "cessReversal",
      title: "CESS (₹)",
      readOnly: true,
    },
    {
      data: "action",
      title: "Action",
      readOnly: true,
    },
  ];

  const ammendDistributionItcdetailsColumn = [
    {
      data: "select",
      type: "checkbox",
      width: 25,
      readOnly: false,
    },
    // {
    //     data: "sheetName", title: "Section", readOnly: true,
    //     width: 55,
    // },
    {
      data: "originalUnitType",
      title: "Unit Type",
      readOnly: true,
    },
    {
      data: "originalRecipientGSTIN",
      title: "Original Recipient GSTIN",
      readOnly: true,
    },

    {
      data: "originalInvoiceNumber",
      title: "Original Document Number",
      readOnly: true,
    },
    {
      data: "originalInvoiceDateLabel",
      title: "Original Document Date",
      readOnly: true,
    },
    {
      data: "eligibilityOfITC",
      title: "Eligibility of ITC",
      readOnly: true,
    },
    {
      data: "unitType",
      title: "Revised Unit Type",
      readOnly: true,
    },

    {
      data: "recipientGSTIN",
      title: "Recipient GSTIN",
      readOnly: true,
    },
    {
      data: "supplierName",
      title: "Recipient Supplier Name",
      readOnly:true
    },
    {
      data: "revisedInvoiceNumber",
      title: "ISD Invoice Number",
      readOnly: true,
    },

    {
      data: "revisedNoteNumber",
      title: "ISD Credit Note Number",
      readOnly: true,
    },
    {
      data: "revisedInvoiceDateLabel",
      title: "ISD Invoice Date",
      readOnly: true,
    },
    {
      data: "revisedNoteDateLabel",
      title: "ISD Credit Note Date",
      readOnly: true,
    },

    {
      data: "originalInvoiceofCreditNote",
      title: "Original Invoice Number",
      readOnly: true,
    },
    {
      data: "originalInvoiceDateLabel",
      title: "Original Invoice Date",
      readOnly: true,
    },
    {
      data: "sezSupplier",
      title: "Is Unit Located in SEZ",
      readOnly: true,
    },

    {
      data: "igst",
      title: "Integrated Tax (₹)",
      readOnly: true,
    },

    {
      data: "cgst",
      title: "Central Tax (₹)",
      readOnly: true,
    },
    {
      data: "sgst",
      title: "State/UT Tax (₹)",
      readOnly: true,
    },
    {
      data: "cess",
      title: "CESS (₹)",
      readOnly: true,
    },
    {
      data: "integratedTaxReversal",
      title: "Integrated Tax (₹)",
      readOnly: true,
    },

    {
      data: "centralTaxReversal",
      title: "Central Tax (₹)",
      readOnly: true,
    },
    {
      data: "stateUTTaxReversal",
      title: "State/UT Tax (₹)",
      readOnly: true,
    },
    {
      data: "cessReversal",
      title: "CESS (₹)",
      readOnly: true,
    },
    {
      data: "action",
      title: "Action",
      readOnly: true,
    },
    {
      data: "noteType",
      title: "ISD Document Type",
      readOnly: true,
    }
  ];
  const ammendDistributionItcdetailsColumnEmpty = [
    {
      data: "select",
      title:'',
      width: 1,
      readOnly: true,
    },
    // {
    //     data: "sheetName", title: "Section", readOnly: true,
    //     width: 55,
    // },
    {
      data: "originalUnitType",
      title: "Unit Type",
      readOnly: true,
    },
    {
      data: "originalRecipientGSTIN",
      title: "Original Recipient GSTIN",
      readOnly: true,
    },

    {
      data: "originalInvoiceNumber",
      title: "Original Document Number",
      readOnly: true,
    },
    {
      data: "originalInvoiceDateLabel",
      title: "Original Document Date",
      readOnly: true,
    },
    {
      data: "eligibilityOfITC",
      title: "Eligibility of ITC",
      readOnly: true,
    },
    {
      data: "unitType",
      title: "Revised Unit Type",
      readOnly: true,
    },

    {
      data: "recipientGSTIN",
      title: "Recipient GSTIN",
      readOnly: true,
    },
    {
      data: "supplierName",
      title: "Recipient Supplier Name",
      readOnly:true
    },
    {
      data: "revisedInvoiceNumber",
      title: "ISD Invoice Number",
      readOnly: true,
    },

    {
      data: "revisedNoteNumber",
      title: "ISD Credit Note Number",
      readOnly: true,
    },
    {
      data: "revisedInvoiceDateLabel",
      title: "ISD Invoice Date",
      readOnly: true,
    },
    {
      data: "revisedNoteDateLabel",
      title: "ISD Credit Note Date",
      readOnly: true,
    },

    {
      data: "originalInvoiceofCreditNote",
      title: "Original Invoice Number",
      readOnly: true,
    },
    {
      data: "originalInvoiceDateLabel",
      title: "Original Invoice Date",
      readOnly: true,
    },
    {
      data: "sezSupplier",
      title: "Is Unit Located in SEZ",
      readOnly: true,
    },

    {
      data: "igst",
      title: "Integrated Tax (₹)",
      readOnly: true,
    },

    {
      data: "cgst",
      title: "Central Tax (₹)",
      readOnly: true,
    },
    {
      data: "sgst",
      title: "State/UT Tax (₹)",
      readOnly: true,
    },
    {
      data: "cess",
      title: "CESS (₹)",
      readOnly: true,
    },
    {
      data: "integratedTaxReversal",
      title: "Integrated Tax (₹)",
      readOnly: true,
    },

    {
      data: "centralTaxReversal",
      title: "Central Tax (₹)",
      readOnly: true,
    },
    {
      data: "stateUTTaxReversal",
      title: "State/UT Tax (₹)",
      readOnly: true,
    },
    {
      data: "cessReversal",
      title: "CESS (₹)",
      readOnly: true,
    },
    {
      data: "action",
      title: "Action",
      readOnly: true,
    },
    {
      data: "noteType",
      title: "ISD Document Type",
      readOnly: true,
    },
  ];

  const totalITC = [
    {
      data: "description",
      title: "Description",
      readOnly: true,
    },
    {
      data: "igst",
      title: "Integrated Tax (₹)",
      readOnly: false,
      type: "numeric",
      numericFormat: {
        pattern: "0,0.00",
        culture: "en-IN",
      },
    },
    {
      data: "cgst",
      title: "Central Tax (₹)",
      readOnly: false,
      type: "numeric",
      numericFormat: {
        pattern: "0,0.00",
        culture: "en-IN",
      },
    },
    {
      data: "sgst",
      title: "State/UT Tax (₹)",
      readOnly: false,
      type: "numeric",
      numericFormat: {
        pattern: "0,0.00",
        culture: "en-IN",
      },
    },
    {
      data: "cess",
      title: "Cess (₹)",
      readOnly: false,
      type: "numeric",
      numericFormat: {
        pattern: "0,0.00",
        culture: "en-IN",
      },
    },
  ];

  const destributedCreditCols = [
    {
      data: "Description",
      title: "Description",
    },
    {
      data: "amout",
      title: "Amout of ITC distributed including negative amouonts in table 4A",
    },
    {
      data: "IGST",
      title: "Integrated Tax (₹)",
    },
    {
      data: "CGST",
      title: "Central Tax (₹)",
    },
    {
      data: "SGST",
      title: "State/UT Tax (₹)",
    },
    {
      data: "Cess",
      title: "Cess (₹)",
    },
  ];

  const lateFeeColumns = [
    {
      data: "description",
      title: "Description",
      readOnly: true,
    },
    {
      data: "cgst",
      title: "Central Tax (₹)",
      readOnly: false,
      type: "numeric",
      numericFormat: {
        pattern: "0,0.00",
        culture: "en-IN",
      },
    },
    {
      data: "sgst",
      title: "State/UT Tax (₹)",
      readOnly: false,
      type: "numeric",
      numericFormat: {
        pattern: "0,0.00",
        culture: "en-IN",
      },
    },
    {
      data: "debitNumber",
      title: "Debit number",
      readOnly: false,
    },
  ];


  let finYear = null;
  let finMonth = null;
  let url = null;
  let typeOfInvoice = [];

  if (location.state !== null) {
    // finYear = location.state.finyear !== null && location.state.finyear !== "null" ? location.state.finyear : sessionStorage.getItem("purchaeFrdt")
    finYear =
      location.state.finyear !== null &&
      location.state.finyear !== "null" &&
      (gstr1Range == null || gstr1Range == undefined)
        ? location.state.finyear
        : gstr1Range;
    finMonth =
      location.state.finmonth !== null && location.state.finmonth !== "null"
        ? location.state.finmonth
        : gstr1Range;
    (url =
      location.state.sectionId !== null && location.state.sectionId !== "null"
        ? location.state.sectionId
        : ""),
      (typeOfInvoice =
        location.state.sectionType !== null &&
        location.state.sectionType !== "null"
          ? location.state.sectionType
          : []);
  }

  useEffect(() => {
    setPanData(YearList);
    setPanDataFrom(YearList);
  }, []);

  useEffect(() => {
    setbtnDisable1(false);
   // console.log("display Search " + displayType);

    if (displayType == true) {
      let defaultValueFrom = null;
      let defaultValueTo = null;
      if (
        gstr1Range !== null &&
        gstr1Range !== "" &&
        gstr1Range !== undefined
      ) {
        console.log("set from date");
        defaultValueFrom = panData?.filter(
          (item) => item.value == gstr1Range
        )[0];
      } else {
        defaultValueFrom = panData?.filter(
          (item) =>
            Number(item.value) ==
            Number(
              sessionStorage.getItem(globleVariable.defaultYear) &&
              SessionFunction.getSessionValue(
                globleVariable.defaultYear,
                true
              )
            )
        )[0];
      }
    if (
        defaultValueFrom !== undefined &&
        defaultValueFrom !== null &&
        defaultValueFrom !== ""
      ) {
        // setFinFormYear(defaultValueFrom);
        setFinFormYear(defaultValueFrom);
        sessionStorage.setItem("gstr6DownloadFromDt", defaultValueFrom?.value);
        SessionFunction.setSessionValue(
          globleVariable.gstr1FromDt,
          defaultValueFrom?.value,
          true
        );
      } else {
        setFinFormYear(panData[0])
        sessionStorage.setItem("gstr6DownloadFromDt", panData[0]?.value);
        SessionFunction.setSessionValue(
          globleVariable.gstr1FromDt,
          panData[0]?.value,
          true
        );
      }
      if (
        defaultValueTo !== undefined &&
        defaultValueTo !== null &&
        defaultValueTo !== ""
      ) {
        setMonthFrom(defaultValueTo);
      }

      setSearchApi(true);
    }
  }, [displayType, activeTab]);

  const selectFromYear = (value) => {
    setSelectedYear(value);
    setPage(0);
    setFinFormYear(value);
    setErrorMsg("");
    // const monthFr = monthFrom?.srNo > value?.srNo ? monthFrom : panDataFrom[0];
    const setDt =
    Number(monthFrom?.srNo) > Number(value?.srNo)
      ? monthFrom
      : panDataFrom[0];
  const x = panDataFrom?.filter(
    (item) => Number(item.srNo) >= Number(value.srNo)
  );

    // const x = panDataFrom?.filter(
    //   (item) => Number(item.srNo) >= Number(value.srNo)
    // );
    setMonthFrom(setDt);
    setPanData(x);
    // sessionStorage.setItem('purchaeFrdt', value?.value  )

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

    purchaseSummaryList(
      activeTab,
      "",
      "",
      activeTab == 3 ? "0" : invType,
      value?.value,
      monthFr?.value,
      refershData,
      1
    );

    // }
  };

  useEffect(() => {
    if (
      sessionStorage.getItem(globleVariable.isCompany) == false ||
      sessionStorage.getItem(globleVariable.isCompany) == "false"
    ) {
      setTimeout(() => {
        navigate("/dashboard/company");
      }, 1000);
    }
  }, []);

  // ** Get data on mount
  useEffect(() => {
    console.log("re-render", searchApi);
    if (searchApi == true) {
      //  debugger
      searchUrlValue = url;
      // decryptData?.decrypt(id)
      let invType = null;
      // debugger
      if (activeTab == 1) {
        if (url == "1" || url == "18" || url == "19") {
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

      purchaseSummaryList(
        activeTab,
        "",
        "",
        activeTab == 3 ? "0" : invType,
        finFromYear?.value,
        monthFrom?.value,
        ""
      );
      // }
    }
  }, [searchApi, activeTab]);

  useEffect(() => {
    console.log("searchVal1", searchVal1.length);
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
        invType = count == 1 ? url : crDrType?.value;
      }
      setServerSidePage(false);
      purchaseSummaryList(
        activeTab,
        "",
        "",
        activeTab == 3 ? "0" : invType,
        finFromYear?.value,
        monthFrom?.value,
        ""
      );
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
  }, [activeTab]);

  const toggleTab = (tab) => {
    console.log("tab click", tab);
    setCurrentCol([]);
    setCurrentCol1();
    setSearchVal1([]);
    setCurrentColcrdr([]);
    setCurrentCol1crdr();
    setCurrentColb2cs([]);
    setCurrentCol1b2cs();
    setSearchValcrdr([]);
    setSearchValb2cs([]);
    setActiveTab(tab);
    var addArray = [];
    var craddArray = [];
    isChecked = false;
    setPage(0);
    setDisplayType(true);
    setRowsPerPage(PageSize)
    setSearchDate("");
    setSearchDate1("");
    setSearchDate2("");
    setSearchDate3("");
    setToDate("")
    setSearchDate1To("");
    setSearchDate2To("");
    setSearchDate3To("");
    setPage(0);
    setToDate("")
    setFromAmount("")
    setToAmount("")

    setToAmountIGST("")
    setFromAmountIGST("")

    setFromAmountTaxable("")
    setToAmountTaxable("")

    setToAmountCGST("")
    setFromAmountCGST("")

    setToAmountSGST("")
    setFromAmountSGST("")

    setFromAmountCESS("")
    setToAmountCESS("")
    setFilterDropDownList({
      supplyTypeDropdownList : [],
    unitTypeDropDownList : [],
    originalUnitTypeDropDownList : [],
    posDropDownList: [],
    sezDropDownList: [],
    eligibilityofITCDropDownList: [],
    noteTypeDropDownList: [],
    docTypeDropDownList: [],
    isLocatedDropDownList: [],
    rateDropDownList: [],
    actionDropDownList: []
    });
    setGridCustomFilter([])
    setPageNoSelect(paginationList[0])
  };

  // search api - AdvSearchFilter
  const purchaseSummaryList = (
    activeTabs,
    colName,
    orderBy,
    invType,
    frDate,
    toDate,
    clearBy,
    filterPageNo
  ) => {
    console.log("frDate", frDate);
    console.log("toDate", toDate);
    var newValuesArr = [];
    // debugger
    console.log("get data - activetab", activeTabs);
    console.log(invType);

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

    console.log(newValuesArr, "newValuesArr");

    if (newValuesArr.length == 0) {
      defaultType =
        searchUrlValue !== null && searchUrlValue !== "" ? [url] : [];
    } else {
      searchType = newValuesArr;
    }

    var currentColval = null;
    var searchValue = null;

    //  if (activeTab == 1 || activeTab == 7 || activeTab == 6) {
    currentColval = clearBy == refershData ? [] : currentCol;
    searchValue = clearBy == refershData ? [] : searchVal1;
    //   } else {
    //     currentColval = clearBy == refershData ? [] : currentColcrdr;
    //    searchValue = clearBy == refershData ? [] : searchValcrdr;
    //   }

    searchValue = searchValue?.map((obj) =>
    isNumber(obj?.replaceAll(",", "")) ? obj?.replaceAll(",", "") : obj
  );
  console.log(searchValue,"searchValuesearchValue")

    searchPayload = {
      userClientId: G_UCParId,
      pageStart: filterPageNo !== null && filterPageNo !== undefined && filterPageNo !== "" ?  filterPageNo :  page + 1,
      pageSize: rowsPerPage,
      orderByColumnName: colName,
      orderBy: orderBy,
      searchColumnName: currentColval,
      searchValue: searchValue,
      // "sectionId": searchType !== null && searchType !== '' && searchType !== undefined ? searchType : defaultType,
      sectionId:
        activeTab == 1
          ? [1]
          : activeTab == 2
          ? [2]
          : activeTab == 3
          ? [3]
          : activeTab == 4
          ? [4]
          : activeTab == 5
          ? [5]
          : activeTab == 6
          ? [6]
          : "",
      creditDebit: "",
      tabId: activeTab,
      fromRange: frDate,
      toRange: frDate,
      gstin: [],
      vendorName: "",
    };

    setBlock(true);

    SessionFunction.setSessionValue(globleVariable.gstr1FromDt, frDate, true);
    if (activeTab == 7) {
      setTotalCGST(0);
      setTotalCess(0);
      setTotalIGST(0);
      setTotalInvoice(0);
      setTotalInvoiceValue(0);
      setTotalSGST(0);
      setTotalTaxableValue(0);
      let payload = {
        UserClientId: G_UCParId,
        FromRange: frDate,
        ToRange: frDate,
      };
      gstr6PurchaseInvoice
        .getGSRT6TotalITCAvailable(payload)
        .then((res) => {
          if (
            res.status === 200 &&
            res.data.status === errorCodeConfig.APIDefaultCode.Success
          ) {
            setBlock(false);
            console.log("disable data=", res?.data?.data?.paginationData);
            if (res.data?.data.length < 1) {
              setbtnDisable1(true);
            } else {
              setbtnDisable1(false);
            }

            let sgst = 0;
            let cgst = 0;
            let cess = 0;
            let igst = 0;

            res.data.data.length
            ? res.data.data?.map((ele, index) => {
                sgst += parseFloat(ele?.sgst);
                cess += parseFloat(ele?.cess);
                cgst += parseFloat(ele?.cgst);
                igst += parseFloat(ele?.igst);
              })
            : "";
            setTotalCGST(cgst);
            setTotalCess(cess);
            setTotalIGST(igst);
            setTotalSGST(sgst);

            setData(res.data.data);
          } else {
            setbtnDisable1(true);
            setBlock(false);
            setData([]);
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
    } else if (activeTab == 8) {
      setTotalCGST(0);
      setTotalCess(0);
      setTotalIGST(0);
      setTotalInvoice(0);
      setTotalInvoiceValue(0);
      setTotalSGST(0);
      setTotalTaxableValue(0);
      let payload = {
        UserClientId: G_UCParId,
        FromRange: frDate,
        ToRange: frDate,
      };
      gstr6PurchaseInvoice
        .getGSRT6LateFee(payload)
        .then((res) => {
          if (
            res.status === 200 &&
            res.data.status === errorCodeConfig.APIDefaultCode.Success
          ) {
            setBlock(false);
            console.log("disable data=", res?.data?.data?.paginationData);
            if (res.data?.data.length < 1) {
              setbtnDisable1(true);
            } else {
              setbtnDisable1(false);
            }

            let sgst = 0;
            let cgst = 0;

            res.data.data.length
            ? res.data.data?.map((ele, index) => {
                sgst += parseFloat(ele?.sgst);
                cgst += parseFloat(ele?.cgst);
              })
            : "";
            setTotalCGST(cgst);
            setTotalSGST(sgst);

            setData(res.data.data);
          } else {
            setbtnDisable1(true);
            setBlock(false);
            setData([]);
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
    } else {
      console.log("elseisrunningRhodes")
      gstr6PurchaseInvoice
        .getGSRT6PurchasePagination(searchPayload)
        .then((res) => {
          console.log("this api is calling now var check", invType);
          if (res.status === 200) {
            setBlock(false);
            setCount(count + 1);
            if (count == 0) {
              setSubTypeList(res?.data?.data?.goodsService);
              setInvoiceTypeList(res?.data?.data?.sectionList);
              setReverchargeList(res?.data?.data?.reverseCharge);
              setFinFromYearList(res?.data?.data?.financialYearList);
              setFinToYearList(res?.data?.data?.financialYearList);
              setMonthFromList(res?.data?.data?.month);
              setMonthToList(res?.data?.data?.month);
              setCrDrList(res?.data?.data?.creditDebit);
              setCrDrInvoiceTypeList(res?.data?.data?.sectionListTabTwo);
              setB2csInvoiceTypeList(res?.data?.data?.sectionListTabThree);
              setAtInvoiceTypeList(res?.data?.data?.sectionListTabFour);
            }
            setGstinList(res?.data?.data?.gstinList);
            setShowList(true);
            // sessionStorage.setItem("purchaeFrdt", finFromYear?.value)
            // sessionStorage.setItem("purchaeTodt", monthFrom?.value)

            if (
              res?.data?.data?.summary !== null &&
              res?.data?.data?.summary !== undefined
            ) {
              const {
                totalCGST,
                totalCess,
                totalIGST,
                totalInvoice,
                totalInvoiceValue,
                totalSGST,
                totalTaxableValue,
              } = res?.data?.data?.summary;
              console.log(totalCGST, "totalCGSTtotalCGST");
              setTotalCGST(
                totalCGST !== null && totalCGST !== "" ? totalCGST : 0
              );
              // setTotalCGST( res?.data?.data?.summary?  res?.data?.data?.summary : 0);
              setTotalCess(
                totalCess !== null && totalCess !== "" ? totalCess : 0
              );
              setTotalIGST(
                totalIGST !== null && totalIGST !== "" ? totalIGST : 0
              );
              setTotalInvoice(
                totalInvoice !== null && totalInvoice !== "" ? totalInvoice : 0
              );
              setTotalInvoiceValue(
                totalInvoiceValue !== null && totalInvoiceValue !== ""
                  ? totalInvoiceValue
                  : 0
              );
              setTotalSGST(
                totalSGST !== null && totalSGST !== "" ? totalSGST : 0
              );
              setTotalTaxableValue(
                totalTaxableValue !== null && totalTaxableValue !== ""
                  ? totalTaxableValue
                  : 0
              );
            } else {
              setTotalCGST(0);
              setTotalCess(0);
              setTotalIGST(0);
              setTotalInvoice(0);
              setTotalInvoiceValue(0);
              setTotalSGST(0);
              setTotalTaxableValue(0);
            }
          }

          if (
            res.status === 200 &&
            res.data.status === errorCodeConfig.APIDefaultCode.Success
          ) {
            setBlock(false);
            console.log("disable data=", res?.data?.data?.paginationData);
                  // ******************
                  setSupplyType(res?.data?.data?.supplyType);
                  setTotalRowsShow(res?.data?.data?.paginationData[0]?.totalRowCount)
                  setUnitType(res?.data?.data?.unitType)
                  setOriginalUnitType(res?.data?.data?.revisedUnitType)
                  setPlaceOfSupply(res?.data?.data?.placeOfSupply)
                  setSezSupplier(res?.data?.data?.sezSupplier)
                  setEligibilityofITC(res?.data?.data?.eligibilityofITC)
                  setNoteType(res?.data?.data?.noteType)
                  setIsdDocumentType(res?.data?.data?.isdDocumentType)
                  setIsLocatedInSez(res?.data?.data?.isLocatedInSez)
                  setRate(res?.data?.data?.rate)
                  setAction(res?.data?.data?.action)
            if (res?.data?.data?.paginationData?.length < 1) {
              setbtnDisable1(true);
            } else {
              setbtnDisable1(false);
            }

            setData(res.data.data.paginationData);
          } else {
            setbtnDisable1(true);
            setBlock(false);
            setData([]);
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

    // }
  };
  const purchaseData = data;
  console.log(purchaseData, "purchseData");
  // const purchaseData = [];

  const pageCount = Math.ceil(
    purchaseData?.length && purchaseData[0].totalRowCount / rowsPerPage
  );
  console.log(pageCount, "pageCount");
  const b2csTableData = b2csData;
  const pageCountB2cs = Math.ceil(
    b2csTableData?.length && b2csTableData[0].totalRowCount / rowsPerPage
  );

  const onPageChangeFunc = (e) => {
    setPageNoSelect(e);
    setRowsPerPage(e.value);
    setServerSidePage(true);
    setPage(0);
  };
  // withot pagination property
  const handlePageClick = (event) => {
    setPage(event);
    setServerSidePage(true);
  };

  // gstr6 refs

  const hotRef = useRef(null);
  const hotRef1 = useRef(null);
  const hotRef2 = useRef(null);
  const hotRef3 = useRef(null);
  const hotRef4 = useRef(null);
  const hotRef5 = useRef(null);
  const hotRef7 = useRef(null);
  const hotRef8 = useRef(null);

  const hot = hotRef?.current?.hotInstance;
  // const filtersPlugin = hot?.getPlugin("filters");

  // ** B2b Tab
  const theader = (col, TH) => {
    // if ((col === 0 || col > 13 ) && col != 15) {
      if ((col === 0 || col > 13 )) {
      const button = TH.children[0].children[0];
      button?.parentNode?.removeChild(button);
    }

    if(activeTab ==1){

    if (currentCol.length > 0) {

      let uniq = [...new Set(currentCol)];


      for (let i = 0; i < uniq.length; i++) {
          var obj = {};

          for (let j = 0; j < searchVal1.length; j++) {
            if (i == j) {
              obj[uniq[i]] = searchVal1[j]?.trim();
              arrFilter.push(obj);
            }
          }
        }


        let finalObj = {};
        for (let i = 0; i < arrFilter.length; i++) {
          Object.assign(finalObj, arrFilter[i]);
        }


        b2bColumns.forEach((ele, index) => {
          const columnIndex = index;
          const buttonExists = document.querySelector(`.tab-pane.active .ht_clone_top thead th:nth-child(${columnIndex + 1}) button`);

          const columnMatchesCondition = Object.keys(finalObj).includes(ele.data);
          // uniq.some(col1 => ele?.data.includes(col1));

          // Check if column value is not null
       const columnValueValid = finalObj[ele.data] !== null && finalObj[ele.data] !== "";

          if (buttonExists && columnMatchesCondition && columnValueValid) {
              const TH = document.querySelector(`.tab-pane.active .ht_clone_top thead th:nth-child(${columnIndex + 1})`);

              if (TH) {
                  TH.classList.add("htFiltersActive");
              } else {
                  TH.classList.remove("htFiltersActive");
              }
          }
      });
  }
    }
    if (
      col == 0 ||
      col == 1 ||
      col == 2 ||
      col == 3 ||
      col == 14 ||
      col == 13 ||
      col == 5 ||
      col == 6 ||
      col == 15
    ) {
      TH.className = "htLeft";
    } else {
      TH.className = "htRight";
    }
  };

  const theaderTotalITC = (col, TH) => {
    if (col == 1 || col == 2 || col == 3 || col == 4) {
      TH.className = "htRight";
    } else {
      TH.className = "htLeft";
    }
  };

  const theaderLateFee = (col, TH) => {
    if (col == 1 || col == 2) {
      TH.className = "htRight";
    } else {
      TH.className = "htLeft";
    }
  };

  // ** ITC Tab
  const theaderITC = (col, TH) => {
    if ((col == 0 || col > 16)) {
      const button = TH.children[0].children[0];
      button?.parentNode?.removeChild(button);
    }
if(activeTab ==2){
    if (currentCol.length > 0) {

      let uniq = [...new Set(currentCol)];


      for (let i = 0; i < uniq.length; i++) {
          var obj = {};

          for (let j = 0; j < searchVal1.length; j++) {
            if (i == j) {
              obj[uniq[i]] = searchVal1[j]?.trim();
              arrFilter.push(obj);
            }
          }
        }


        let finalObj = {};
        for (let i = 0; i < arrFilter.length; i++) {
          Object.assign(finalObj, arrFilter[i]);
        }


        ITCrevisedColumns.forEach((ele, index) => {
          const columnIndex = index;
          const buttonExists = document.querySelector(`.tab-pane.active .ht_clone_top thead th:nth-child(${columnIndex + 1}) button`);

          const columnMatchesCondition = Object.keys(finalObj).includes(ele.data);
          // uniq.some(col1 => ele?.data.includes(col1));

          // Check if column value is not null
       const columnValueValid = finalObj[ele.data] !== null && finalObj[ele.data] !== "";

          if (buttonExists && columnMatchesCondition && columnValueValid) {
              const TH = document.querySelector(`.tab-pane.active .ht_clone_top thead th:nth-child(${columnIndex + 1})`);
              console.log(TH,"TH");
              if (TH) {
                  TH.classList.add("htFiltersActive");
              } else {
                  TH.classList.remove("htFiltersActive");
              }
          }
      });
  }
}
    if (
      col == 0 ||
      col == 1 ||
      col == 2 ||
      col == 3 ||
      col == 14 ||
      col == 13 ||
      col == 5 ||
      col == 6 ||
      col == 15
    ) {
      TH.className = "htLeft";
    } else {
      TH.className = "htRight";
    }
  };

//   const theaderITCEmpty = (col, TH) => {
//     if (col == 0 || col > 15) {
//       const button = TH.children[0].children[0];
//       button?.parentNode?.removeChild(button);
//     }

//     if(activeTab == 2 && purchaseData.length <=0 ){
//     if (currentCol.length > 0) {

//       let uniq = [...new Set(currentCol)];


//       for (let i = 0; i < uniq.length; i++) {
//           var obj = {};

//           for (let j = 0; j < searchVal1.length; j++) {
//             if (i == j) {
//               obj[uniq[i]] = searchVal1[j]?.trim();
//               arrFilter.push(obj);
//             }
//           }
//         }


//         let finalObj = {};
//         for (let i = 0; i < arrFilter.length; i++) {
//           Object.assign(finalObj, arrFilter[i]);
//         }


//         ITCrevisedColumnsEmpty.forEach((ele, index) => {
//           const columnIndex = index;
//           const buttonExists = document.querySelector(`.ht_clone_top thead th:nth-child(${columnIndex + 1}) button`);

//           const columnMatchesCondition = Object.keys(finalObj).includes(ele.data);
//           // uniq.some(col1 => ele?.data.includes(col1));

//           // Check if column value is not null
//        const columnValueValid = finalObj[ele.data] !== null && finalObj[ele.data] !== "";

//           if (buttonExists && columnMatchesCondition && columnValueValid) {
//               const TH = document.querySelector(`.ht_clone_top thead th:nth-child(${columnIndex + 1})`);

//               if (TH) {
//                   TH.classList.add("htFiltersActive");
//               } else {
//                   TH.classList.remove("htFiltersActive");
//               }
//           }
//       });
//   }
// }

//     if (
//       col == 0 ||
//       col == 1 ||
//       col == 2 ||
//       col == 3 ||
//       col == 14 ||
//       col == 13 ||
//       col == 5 ||
//       col == 6 ||
//       col == 15
//     ) {
//       TH.className = "htLeft";
//     } else {
//       TH.className = "htRight";
//     }
//   };

  // ** CDN

  const theaderCdn = (col, TH) => {
    if ((col == 0 || col > 16)) {
      const button = TH.children[0].children[0];
      button?.parentNode?.removeChild(button);
    }

    if(activeTab == 3){
    if (currentCol.length > 0) {

      let uniq = [...new Set(currentCol)];


      for (let i = 0; i < uniq.length; i++) {
          var obj = {};

          for (let j = 0; j < searchVal1.length; j++) {
            if (i == j) {
              obj[uniq[i]] = searchVal1[j]?.trim();
              arrFilter.push(obj);
            }
          }
        }


        let finalObj = {};
        for (let i = 0; i < arrFilter.length; i++) {
          Object.assign(finalObj, arrFilter[i]);
        }


        cdnColumns.forEach((ele, index) => {
          const columnIndex = index;
          const buttonExists = document.querySelector(`.tab-pane.active .ht_clone_top thead th:nth-child(${columnIndex + 1}) button`);

          const columnMatchesCondition = Object.keys(finalObj).includes(ele.data);
          // uniq.some(col1 => ele?.data.includes(col1));

          // Check if column value is not null
       const columnValueValid = finalObj[ele.data] !== null && finalObj[ele.data] !== "";

          if (buttonExists && columnMatchesCondition && columnValueValid) {
              const TH = document.querySelector(`.tab-pane.active .ht_clone_top thead th:nth-child(${columnIndex + 1})`);

              if (TH) {
                  TH.classList.add("htFiltersActive");
              } else {
                  TH.classList.remove("htFiltersActive");
              }
          }
      });
  }
    }

    if (
      col == 0 ||
      col == 1 ||
      col == 2 ||
      col == 3 ||
      col == 14 ||
      col == 13 ||
      col == 5 ||
      col == 6 ||
      col == 15
    ) {
      TH.className = "htLeft";
    } else {
      TH.className = "htRight";
    }
  };

  let arrFilter = [];

  const deleteITC = () => {
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
        const deleteGSRT1Invoices = {
          userClientId: G_UCParId,
          deleteRange: finFromYear?.value,
          userId: LocalFunction.getLocalValue(globleVariable.userId, true),
        };

        setBlock(true);
        gstr6PurchaseInvoice
          .gstrTotalITCDelete(deleteGSRT1Invoices)
          .then((res) => {
            if (
              res.status === 200 &&
              res.data.status === errorCodeConfig.APIDefaultCode.Success
            ) {
              setBlock(false);
              setCurrentCol1([]);
              toast.success(res.data.successMessage, {
                position: "top-right",
              });

              // purchaseSummaryList(activeTab, "", "")
              let invType = null;

              purchaseSummaryList(
                activeTab,
                "",
                "",
                "0",
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
            });
          });
      }
    });
  };

  const deleteLateFee = () => {
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
        const deleteGSRT1Invoices = {
          userClientId: G_UCParId,
          deleteRange: finFromYear?.value,
          userId: LocalFunction.getLocalValue(globleVariable.userId, true),
        };

        setBlock(true);
        gstr6PurchaseInvoice
          .gstrLateFeeDelete(deleteGSRT1Invoices)
          .then((res) => {
            if (
              res.status === 200 &&
              res.data.status === errorCodeConfig.APIDefaultCode.Success
            ) {
              setBlock(false);
              setCurrentCol1([]);
              toast.success(res.data.successMessage, {
                position: "top-right",
              });

              // purchaseSummaryList(activeTab, "", "")
              let invType = null;

              purchaseSummaryList(
                activeTab,
                "",
                "",
                "0",
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
            });
          });
      }
    });
  };

  function emptyRenderLateFee(
    instance,
    td,
    row,
    col,
    prop,
    value,
    cellProperties
  ) {
    textRenderer.apply(this, arguments);
    if (col == 2 || col == 3) {
      let currnecyVal = formatINR(Number(value));

      if (currnecyVal !== 0) {
        td.innerText = currnecyVal;
      }
    }
  }

  function emptyRenderTotalAvailableITC(
    instance,
    td,
    row,
    col,
    prop,
    value,
    cellProperties
  ) {
    textRenderer.apply(this, arguments);
    if (col == 1 || col == 2 || col == 3 || col == 4) {
      let currnecyVal = formatINR(Number(value));

      if (currnecyVal !== 0) {
        td.innerText = currnecyVal;
      }
    }
  }

  const cellChange = (change, source) => {
    if (
      source === "CopyPaste.paste" ||
      source === "edit" ||
      source === "Autofill.fill"
    ) {
      const hot = hotRef7?.current?.hotInstance;

      for (let i = 0; i < change.length; i++) {
        const [row, col, , value] = change[i]; // Get the edited cell value
        const colIndex = totalITC.findIndex((obj) => obj.data === col);

        if (colIndex > 0) {
          const oldVal = change[i][2];
          const cellObj = {
            row: row,
            col: colIndex,
            tab: activeTab,
          };
          // Check if the edited value is numeric
          if (isNaN(value)) {
            setItcErrorArr((pre) => [...pre, cellObj]);
          } else {
            if (
              itcErrorArr.findIndex(
                (y) =>
                  y.row == cellObj.row &&
                  y.col == cellObj.col &&
                  y.tab == cellObj.tab
              ) != -1
            ) {
              setItcErrorArr(
                itcErrorArr.filter(
                  (x) =>
                    x.row !== cellObj.row ||
                    x.col !== cellObj.col ||
                    x.tab !== cellObj.tab
                )
              );
            }
          }
        }
      }
    }
  };

  const cellChangeLateFee = (change, source) => {
    if (
      source === "CopyPaste.paste" ||
      source === "edit" ||
      source === "Autofill.fill"
    ) {
      const hot = hotRef8?.current?.hotInstance;

      for (let i = 0; i < change.length; i++) {
        const [row, col, , value] = change[i]; // Get the edited cell value
        const colIndex = lateFeeColumns.findIndex((obj) => obj.data === col);

        if (colIndex > 0) {
          const oldVal = change[i][2];
          const cellObj = {
            row: row,
            col: colIndex,
            tab: activeTab,
          };
          // Check if the edited value is numeric
          if (isNaN(value)) {
            setLateFeeErrorArr((pre) => [...pre, cellObj]);
          } else {
            if (
              lateFeeErrorArr.findIndex(
                (y) =>
                  y.row == cellObj.row &&
                  y.col == cellObj.col &&
                  y.tab == cellObj.tab
              ) != -1
            ) {
              setLateFeeErrorArr(
                lateFeeErrorArr.filter(
                  (x) =>
                    x.row !== cellObj.row ||
                    x.col !== cellObj.col ||
                    x.tab !== cellObj.tab
                )
              );
            }
          }
        }
      }
    }
  };

  function formatINR(x) {
    return x.toLocaleString("en-IN", { minimumFractionDigits: 2 });
  }

  // ** CDNA
  const theaderCdna = (col, TH) => {
    if ((col == 0 || col > 19)) {
      const button = TH.children[0].children[0];
      button?.parentNode?.removeChild(button);
    }

    if(activeTab == 4){
    if (currentCol.length > 0) {

      let uniq = [...new Set(currentCol)];


      for (let i = 0; i < uniq.length; i++) {
          var obj = {};

          for (let j = 0; j < searchVal1.length; j++) {
            if (i == j) {
              obj[uniq[i]] = searchVal1[j]?.trim();
              arrFilter.push(obj);
            }
          }
        }


        let finalObj = {};
        for (let i = 0; i < arrFilter.length; i++) {
          Object.assign(finalObj, arrFilter[i]);
        }


        cdnaColumns.forEach((ele, index) => {
          const columnIndex = index;
          const buttonExists = document.querySelector(`.tab-pane.active .ht_clone_top thead th:nth-child(${columnIndex + 1}) button`);

          const columnMatchesCondition = Object.keys(finalObj).includes(ele.data);
          // uniq.some(col1 => ele?.data.includes(col1));

          // Check if column value is not null
       const columnValueValid = finalObj[ele.data] !== null && finalObj[ele.data] !== "";

          if (buttonExists && columnMatchesCondition && columnValueValid) {
              const TH = document.querySelector(`.tab-pane.active .ht_clone_top thead th:nth-child(${columnIndex + 1})`);
              // console.log(TH,"TH");
              if (TH) {
                  TH.classList.add("htFiltersActive");
              } else {
                  TH.classList.remove("htFiltersActive");
              }
          }
      });
  }
}

    if (
      col == 0 ||
      col == 1 ||
      col == 2 ||
      col == 3 ||
      col == 14 ||
      col == 13 ||
      col == 5 ||
      col == 6 ||
      col == 15
    ) {
      TH.className = "htLeft";
    } else {
      TH.className = "htRight";
    }
  };

  // ** Distrubution
  const theaderDistrubution = (col, TH) => {
    // if (col == 0 || col > 20) {
      if (col == 0 || col > 16) {
      const button = TH.children[0].children[0];
      button?.parentNode?.removeChild(button);
    }
    if(activeTab == 5){
    if (currentCol.length > 0) {

      let uniq = [...new Set(currentCol)];


      for (let i = 0; i < uniq.length; i++) {
          var obj = {};

          for (let j = 0; j < searchVal1.length; j++) {
            if (i == j) {
              obj[uniq[i]] = searchVal1[j]?.trim();
              arrFilter.push(obj);
            }
          }
        }


        let finalObj = {};
        for (let i = 0; i < arrFilter.length; i++) {
          Object.assign(finalObj, arrFilter[i]);
        }


        distributionOfItcColumns.forEach((ele, index) => {
          const columnIndex = index;
          const buttonExists = document.querySelector(`.tab-pane.active .ht_clone_top thead th:nth-child(${columnIndex + 1}) button`);

          const columnMatchesCondition = Object.keys(finalObj).includes(ele.data);
          // uniq.some(col1 => ele?.data.includes(col1));

          // Check if column value is not null
       const columnValueValid = finalObj[ele.data] !== null && finalObj[ele.data] !== "";

          if (buttonExists && columnMatchesCondition && columnValueValid) {
              const TH = document.querySelector(`.tab-pane.active .ht_clone_top thead th:nth-child(${columnIndex + 1})`);
              console.log(TH,"TH");
              if (TH) {
                  TH.classList.add("htFiltersActive");
              } else {
                  TH.classList.remove("htFiltersActive");
              }
          }
      });
  }
}
    if (
      col == 0 ||
      col == 1 ||
      col == 2 ||
      col == 3 ||
      col == 14 ||
      col == 13 ||
      col == 5 ||
      col == 6 ||
      col == 15
    ) {
      TH.className = "htLeft";
    } else {
      TH.className = "htRight";
    }
  };

  // ** Amend
  const theaderAmends = (col, TH) => {
    if (col == 0 || col > 19) {
      // if (col == 0 || col > 23) {
      const button = TH.children[0].children[0];
      button?.parentNode?.removeChild(button);
    }
    if(activeTab  == 6){
    if (currentCol?.length > 0) {

      let uniq = [...new Set(currentCol)];


      for (let i = 0; i < uniq.length; i++) {
          var obj = {};

          for (let j = 0; j < searchVal1.length; j++) {
            if (i == j) {
              obj[uniq[i]] = searchVal1[j]?.trim();
              arrFilter.push(obj);
            }
          }
        }


        let finalObj = {};
        for (let i = 0; i < arrFilter.length; i++) {
          Object.assign(finalObj, arrFilter[i]);
        }


        ammendDistributionItcdetailsColumn.forEach((ele, index) => {
          const columnIndex = index;
          const buttonExists = document.querySelector(`.tab-pane.active .ht_clone_top thead th:nth-child(${columnIndex + 1}) button`);

          const columnMatchesCondition = Object.keys(finalObj).includes(ele.data);
          // uniq.some(col1 => ele?.data.includes(col1));

          // Check if column value is not null
       const columnValueValid = finalObj[ele.data] !== null && finalObj[ele.data] !== "";

          if (buttonExists && columnMatchesCondition && columnValueValid) {
              const TH = document.querySelector(`.tab-pane.active .ht_clone_top thead th:nth-child(${columnIndex + 1})`);
              if (TH) {
                  TH.classList.add("htFiltersActive");
              } else {
                  TH?.classList?.remove("htFiltersActive");
              }
          }
      });
  }
}

    if (
      col == 0 ||
      col == 1 ||
      col == 2 ||
      col == 3 ||
      col == 14 ||
      col == 13 ||
      col == 5 ||
      col == 6 ||
      col == 15
    ) {
      TH.className = "htLeft";
    } else {
      TH.className = "htRight";
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

  const deleteSaleInvoice = () => {
    console.log("delete data");

    var delArr = [];
    if (purchaseData.length > 0) {
      for (let i = 0; i < purchaseData.length; i++) {
        if (
          purchaseData[i].select == "true" ||
          purchaseData[i].select == true
        ) {
          delArr.push(purchaseData[i].gstR6Id);
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
            deletedBy: LocalFunction.getLocalValue(globleVariable.userId, true),
            Gstr6Id: delArr,
          };

          setBlock(true);
          gstr6PurchaseInvoice
            .gstrPaginationDataDelete(deleteGSRT1Invoices)
            .then((res) => {
              if (
                res.status === 200 &&
                res.data.status === errorCodeConfig.APIDefaultCode.Success
              ) {
                setBlock(false);
                setCurrentCol1([]);
                toast.success(res.data.successMessage, {
                  position: "top-right",
                });

                // purchaseSummaryList(activeTab, "", "")
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

                purchaseSummaryList(
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
              });
            });
        }
      });
    } else {
      toast.error("Please select atleast one record.", {
        position: "top-right",
      });
    }
    // }
  };

  // purchase cell mouse down
  function localAfterOnCellMouseDown(event, coords, td) {
    let hot = null;

    if (activeTab == 7) {
      hot = hotRef?.current?.hotInstance;
    } else if (activeTab == 2) {
      hot = hotRef1?.current?.hotInstance;
    } else if (activeTab == 3) {
      hot = hotRef2?.current?.hotInstance;
    } else if (activeTab == 4) {
      hot = hotRef3?.current?.hotInstance;
    } else if (activeTab == 5) {
      hot = hotRef4?.current?.hotInstance;
    } else if (activeTab == 6) {
      hot = hotRef5?.current?.hotInstance;
    }

    if (activeTab == 1) {
      hot = hotRef?.current?.hotInstance;

      const Index = currentCol?.findIndex(
        (item) => b2bColumns[coords?.col]?.data == item
      );
      console.log("search index", Index);

      if (Index != -1) {
        setTimeout(function () {
          var searchInput = document?.querySelector(
            ".htUIMultipleSelectSearch.htUIInput"
          );
          if (searchInput?.children[0]) {
            searchInput.children[0].value = searchVal1[Index];
          }
        }, 200);
      } else {
        setTimeout(function () {
          var searchInput = document?.querySelector(
            ".htUIMultipleSelectSearch.htUIInput"
          );
          if (searchInput?.children[0]) {
            searchInput.children[0].value = "";
          }
        }, 100);
      }
    }

    const totalRows = hot?.countRows();
    console.log(totalRows, "modularCheck");
    setCurrentCol1(coords?.col);
    if (coords.row == -1 && coords.col == 0) {
      if (
        !event.target.classList.contains("checker") ||
        event.target.classList.contains("checker")
      ) {
        if (!isChecked) {
          isChecked = true;
          for (let index = 0; index < totalRows; index++) {
            hot.setDataAtCell(index, 0, true);
          }
        } else {
          isChecked = false;
          for (let index = 0; index < totalRows; index++) {
            hot.setDataAtCell(index, 0, false);
          }
        }
      }
    }

    activeTab == 7 && setCurrentCol1b2cs(coords?.col);
  }

  function localAfterOnCellMouseDown1(event, coords, td) {
    let hot = hotRef?.current?.hotInstance;

    const Index = currentCol?.findIndex(
      (item) => b2bColumns[coords?.col]?.data == item
    );
    console.log("search index", Index);

    if (Index != -1) {
      setTimeout(function () {
        var searchInput = document?.querySelector(
          ".htUIMultipleSelectSearch.htUIInput"
        );
        if (searchInput?.children[0]) {
          searchInput.children[0].value = searchVal1[Index];
        }
      }, 200);
    } else {
      setTimeout(function () {
        var searchInput = document?.querySelector(
          ".htUIMultipleSelectSearch.htUIInput"
        );
        if (searchInput?.children[0]) {
          searchInput.children[0].value = "";
        }
      }, 100);
    }
    const totalRows = hot?.countRows();
    console.log(totalRows, "modularCheck");
    setCurrentCol1(coords?.col);
    if (coords.row == -1 && coords.col == 0) {
      if (
        !event.target.classList.contains("checker") ||
        event.target.classList.contains("checker")
      ) {
        if (!isChecked) {
          isChecked = true;
          for (let index = 0; index < totalRows; index++) {
            hot.setDataAtCell(index, 0, true);
          }
        } else {
          isChecked = false;
          for (let index = 0; index < totalRows; index++) {
            hot.setDataAtCell(index, 0, false);
          }
        }
      }
    }

    // activeTab == 7 &&
    setCurrentCol1b2cs(coords?.col);
  }

  function localAfterOnCellMouseDown2(event, coords, td) {
    let hot = hotRef1?.current?.hotInstance;

    const Index = currentCol?.findIndex(
      (item) => ITCrevisedColumns[coords?.col]?.data == item
    );
    console.log("search index", Index);

    if (Index != -1) {
      setTimeout(function () {
        var searchInput = document?.querySelector(
          ".htUIMultipleSelectSearch.htUIInput"
        );
        if (searchInput?.children[0]) {
          searchInput.children[0].value = searchVal1[Index];
        }
      }, 200);
    } else {
      setTimeout(function () {
        var searchInput = document?.querySelector(
          ".htUIMultipleSelectSearch.htUIInput"
        );
        if (searchInput?.children[0]) {
          searchInput.children[0].value = "";
        }
      }, 100);
    }
    const totalRows = hot?.countRows();
    console.log(totalRows, "modularCheck");
    setCurrentCol1(coords?.col);
    if (coords.row == -1 && coords.col == 0) {
      if (
        !event.target.classList.contains("checker") ||
        event.target.classList.contains("checker")
      ) {
        if (!isChecked) {
          isChecked = true;
          for (let index = 0; index < totalRows; index++) {
            hot.setDataAtCell(index, 0, true);
          }
        } else {
          isChecked = false;
          for (let index = 0; index < totalRows; index++) {
            hot.setDataAtCell(index, 0, false);
          }
        }
      }
    }

    // activeTab == 7 &&
    setCurrentCol1b2cs(coords?.col);
  }

  function localAfterOnCellMouseDown3(event, coords, td) {
    let hot = hotRef2?.current?.hotInstance;

    const Index = currentCol?.findIndex(
      (item) => cdnColumns[coords?.col]?.data == item
    );
    console.log("search index", Index);

    if (Index != -1) {
      setTimeout(function () {
        var searchInput = document?.querySelector(
          ".htUIMultipleSelectSearch.htUIInput"
        );
        if (searchInput?.children[0]) {
          searchInput.children[0].value = searchVal1[Index];
        }
      }, 200);
    } else {
      setTimeout(function () {
        var searchInput = document?.querySelector(
          ".htUIMultipleSelectSearch.htUIInput"
        );
        if (searchInput?.children[0]) {
          searchInput.children[0].value = "";
        }
      }, 100);
    }
    const totalRows = hot?.countRows();
    console.log(totalRows, "modularCheck");
    setCurrentCol1(coords?.col);
    if (coords.row == -1 && coords.col == 0) {
      if (
        !event.target.classList.contains("checker") ||
        event.target.classList.contains("checker")
      ) {
        if (!isChecked) {
          isChecked = true;
          for (let index = 0; index < totalRows; index++) {
            hot.setDataAtCell(index, 0, true);
          }
        } else {
          isChecked = false;
          for (let index = 0; index < totalRows; index++) {
            hot.setDataAtCell(index, 0, false);
          }
        }
      }
    }

    // activeTab == 7 &&
    setCurrentCol1b2cs(coords?.col);
  }

  function localAfterOnCellMouseDown4(event, coords, td) {
    let hot = hotRef3?.current?.hotInstance;

    const Index = currentCol?.findIndex(
      (item) => cdnaColumns[coords?.col]?.data == item
    );
    console.log("search index", Index);

    if (Index != -1) {
      setTimeout(function () {
        var searchInput = document?.querySelector(
          ".htUIMultipleSelectSearch.htUIInput"
        );
        if (searchInput?.children[0]) {
          searchInput.children[0].value = searchVal1[Index];
        }
      }, 200);
    } else {
      setTimeout(function () {
        var searchInput = document?.querySelector(
          ".htUIMultipleSelectSearch.htUIInput"
        );
        if (searchInput?.children[0]) {
          searchInput.children[0].value = "";
        }
      }, 100);
    }
    const totalRows = hot?.countRows();
    console.log(totalRows, "modularCheck");
    setCurrentCol1(coords?.col);
    if (coords.row == -1 && coords.col == 0) {
      if (
        !event.target.classList.contains("checker") ||
        event.target.classList.contains("checker")
      ) {
        if (!isChecked) {
          isChecked = true;
          for (let index = 0; index < totalRows; index++) {
            hot.setDataAtCell(index, 0, true);
          }
        } else {
          isChecked = false;
          for (let index = 0; index < totalRows; index++) {
            hot.setDataAtCell(index, 0, false);
          }
        }
      }
    }

    // activeTab == 7 &&
    setCurrentCol1b2cs(coords?.col);
  }

  function localAfterOnCellMouseDown5(event, coords, td) {
    let hot = hotRef4?.current?.hotInstance;

    const Index = currentCol?.findIndex(
      (item) => distributionOfItcColumns[coords?.col]?.data == item
    );
    console.log("search index", Index);

    if (Index != -1) {
      setTimeout(function () {
        var searchInput = document?.querySelector(
          ".htUIMultipleSelectSearch.htUIInput"
        );
        if (searchInput?.children[0]) {
          searchInput.children[0].value = searchVal1[Index];
        }
      }, 200);
    } else {
      setTimeout(function () {
        var searchInput = document?.querySelector(
          ".htUIMultipleSelectSearch.htUIInput"
        );
        if (searchInput?.children[0]) {
          searchInput.children[0].value = "";
        }
      }, 100);
    }
    const totalRows = hot?.countRows();
    console.log(totalRows, "modularCheck");
    setCurrentCol1(coords?.col);
    if (coords.row == -1 && coords.col == 0) {
      if (
        !event.target.classList.contains("checker") ||
        event.target.classList.contains("checker")
      ) {
        if (!isChecked) {
          isChecked = true;
          for (let index = 0; index < totalRows; index++) {
            hot.setDataAtCell(index, 0, true);
          }
        } else {
          isChecked = false;
          for (let index = 0; index < totalRows; index++) {
            hot.setDataAtCell(index, 0, false);
          }
        }
      }
    }

    // activeTab == 7 &&
    setCurrentCol1b2cs(coords?.col);
  }

  function localAfterOnCellMouseDown6(event, coords, td) {
    let hot = hotRef5?.current?.hotInstance;

    const Index = currentCol?.findIndex(
      (item) => ammendDistributionItcdetailsColumn[coords?.col]?.data == item
    );
    console.log("search index", Index);

    if (Index != -1) {
      setTimeout(function () {
        var searchInput = document?.querySelector(
          ".htUIMultipleSelectSearch.htUIInput"
        );
        if (searchInput?.children[0]) {
          searchInput.children[0].value = searchVal1[Index];
        }
      }, 200);
    } else {
      setTimeout(function () {
        var searchInput = document?.querySelector(
          ".htUIMultipleSelectSearch.htUIInput"
        );
        if (searchInput?.children[0]) {
          searchInput.children[0].value = "";
        }
      }, 100);
    }
    const totalRows = hot?.countRows();
    console.log(totalRows, "modularCheck");
    setCurrentCol1(coords?.col);
    if (coords.row == -1 && coords.col == 0) {
      if (
        !event.target.classList.contains("checker") ||
        event.target.classList.contains("checker")
      ) {
        if (!isChecked) {
          isChecked = true;
          for (let index = 0; index < totalRows; index++) {
            hot.setDataAtCell(index, 0, true);
          }
        } else {
          isChecked = false;
          for (let index = 0; index < totalRows; index++) {
            hot.setDataAtCell(index, 0, false);
          }
        }
      }
    }

    // activeTab == 7 &&
    setCurrentCol1b2cs(coords?.col);
  }

  const filterInvoiceType = (event) => {
    console.log("filter type", url);
    setCurrentCol([]);
    setCurrentCol1(null);
    setSearchVal1([]);
    setPage(0);
    setInvoceTypes(event);
    purchaseSummaryList(
      activeTab,
      "",
      "",
      event?.value,
      finFromYear?.value,
      monthFrom?.value,
      refershData,
      1
    );
  };

  const filterInvoiceTypeAdvPayment = (event) => {
    console.log("filter type", url);
    setCurrentCol([]);
    setCurrentCol1(null);
    setSearchVal1([]);
    setPage(0);
    setInvoceTypesAdvPayment(event);
    purchaseSummaryList(
      activeTab,
      "",
      "",
      event?.value,
      finFromYear?.value,
      monthFrom?.value,
      refershData,
      1
    );
  };

  const filterInvoiceTypeB2cs = (event) => {
    console.log("filter type", url);
    setCurrentCol([]);
    setCurrentCol1(null);
    setSearchVal1([]);
    setPage(0);
    setB2csInvoiceType(event);

    purchaseSummaryList(
      activeTab,
      "",
      "",
      event?.value,
      finFromYear?.value,
      monthFrom?.value,
      refershData,
      1
    );
  };

  const filterInvoiceTypeAt = (event) => {
    console.log("filter type", url);
    setCurrentCol([]);
    setCurrentCol1(null);
    setSearchVal1([]);
    setPage(0);
    setAtInvoiceType(event);
    purchaseSummaryList(
      activeTab,
      "",
      "",
      event?.value,
      finFromYear?.value,
      monthFrom?.value,
      refershData,
      1
    );
  };

  const crdrFilterInvoiceType = (event) => {
    setCurrentColcrdr([]);
    setCurrentCol1crdr(null);
    setSearchValcrdr([]);
    setPage(0);
    setCrDrInvoiceType(event);
    purchaseSummaryList(
      activeTab,
      "",
      "",
      event?.value,
      finFromYear?.value,
      monthFrom?.value,
      refershData,
      1
    );
  };

  const ExportSectionWiseData = () => {
    // console.log(finFromYear?.value);
    // console.log(monthFrom?.value);
    console.log("export data");

    setBlock(true);

    const gstr1SectionId =
      activeTab == 1
        ? 1
        : activeTab == 2
        ? 2
        : activeTab == 3
        ? 3
        : activeTab == 4
        ? 4
        : activeTab == 5
        ? 5
        : activeTab == 6
        ? 6
        : 0;

    gstr6SummaryService
      .exportGSTR6ExportData(
        G_UCParId,
        finFromYear?.value,
        monthFrom?.value,
        gstr1SectionId,
        token,
        G_GSTIN
      )
      .then((res) => {
        if (res?.status == 200) {
          console.log("res1", res.data.data);
          setBlock(false);
          downloadURL(res.data.data);
        } else {
          console.log("res2");
          setBlock(false);

          toast.error(res.headers.errormessage, {
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
            confirmButton: "btn btn-outline-danger",
          },
          buttonsStyling: false,
        });
      });
  };

  const ItcSaveInvoice = () => {
    let data = purchaseData.map((obj) => {
      console.log(obj,"ojjjjjjj")

      obj.cgst = obj?.cgst? obj?.cgst?.toString():"0";
      obj.sgst = obj?.sgst? obj?.sgst?.toString() :"0";
      obj.igst = obj?.igst? obj?.igst?.toString() : "0";
      obj.cess = obj?.cess? obj?.cess?.toString(): "0";
      return obj
    })
    let errorArray = [];
    let isValid = true;

    let payload = {
      userClientId: G_UCParId,
      userId: LocalFunction.getLocalValue(globleVariable.userId, true),
      range: gstr1Range,
      data: [...data],
    };

    console.log("purchaseData save", purchaseData);

    if (activeTab == 7) {
      console.log(purchaseData);

      for (let i = 0; i < purchaseData.length; i++) {
        let cess = null;
        let cgst = null;
        let igst = null;
        let sgst = null;

        let cessValid = true;
        let cgstValid = true;
        let sgstValid = true;
        let igstValid = true;

        console.log(purchaseData[i]);

        if (
          purchaseData[i]["cess"] !== "" &&
          purchaseData[i]["cess"] !== null
        ) {
          if (isNumber(purchaseData[i]["cess"]) == false) {
            isValid = false;
            cess = purchaseData[i]["cess"];
            cessValid = false;
          }
        }

        if (
          purchaseData[i]["cgst"] !== "" &&
          purchaseData[i]["cgst"] !== null
        ) {
          if (isNumber(purchaseData[i]["cgst"]) == false) {
            isValid = false;
            cgst = purchaseData[i]["cgst"];
            cgstValid = false;
          }
        }

        if (
          purchaseData[i]["sgst"] !== "" &&
          purchaseData[i]["sgst"] !== null
        ) {
          if (isNumber(purchaseData[i]["sgst"]) == false) {
            isValid = false;
            sgst = purchaseData[i]["sgst"];
            sgstValid = false;
          }
        }

        if (
          purchaseData[i]["igst"] !== "" &&
          purchaseData[i]["igst"] !== null
        ) {
          if (isNumber(purchaseData[i]["igst"]) == false) {
            isValid = false;
            igst = purchaseData[i]["igst"];
            igstValid = false;
          }
        }

        if (
          cessValid == true &&
          cgstValid == true &&
          sgstValid == true &&
          igstValid == true
        ) {
        } else {
          errorArray.push({
            rowid: purchaseData[i]["description"],
            cess: cess,
            cgst: cgst,
            sgst: sgst,
            igst: igst,
          });
        }
      }

      if (isValid == false) {

        let csssClass = "";
        let htmltblData =
          "<div  class='import-error-height' ><table class='table text-start'><thead style='" +
          csssClass +
          "' ><tr style='" +
          csssClass +
          "'><th style='" +
          csssClass +
          "'>Row No</th><th style='" +
          csssClass +
          "'>Error</th>";
        for (let i = 0; i < errorArray.length; i++) {
          htmltblData += `<tr style="${csssClass}"><td style="${csssClass}">${
            i + 1
          }</td><td style="${csssClass};">${
            errorArray[i].rowid
          } - only numeric value allow. </td></tr>`;
        }

        htmltblData += "</tbody></table></div>";

        return MySwal.fire({
          title: "<strong>Error2</strong>",
          html: htmltblData,
          // <List errorDataList={errorArray}></List>,
          customClass: {
            confirmButton: "btn btn-danger",
          },
          buttonsStyling: false,
          width: "60%",
          height: "350px",
        });
      } else {
        setBlock(true);
        gstr6PurchaseInvoice
      .gstrItcSaveInvoice(payload)
      .then((res) => {
        if (res?.status == 200 && res?.data?.status == 1) {
          console.log("res1", res.data.data);
          setBlock(false);
          toast.success(res.data.successMessage, {
            position: "top-right",
          });
        } else if(res?.data?.status == 400){
          setBlock(false);
          toast.error("something went wrong!", {
            position: "top-right",
          });
        }else {
          console.log("res2");
          setBlock(false);
          toast.error(res.headers.errormessage, {
            position: "top-right",
          });
        }
        purchaseSummaryList(
          activeTab,
          "",
          "",
          "0",
          finFromYear?.value,
          monthFrom?.value,
          ""
        );
      })
      .catch((error) => {
        setBlock(false);
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

      }
    }

  };

  const lateFeeSaveInvoice = () => {
    let data = purchaseData.map((obj) => {
      console.log(obj,"objectobjectobject")
      obj.cgst = obj.cgst? obj.cgst.toString(): "0";
      obj.sgst = obj.sgst? obj.sgst.toString(): "0";
      obj.debitNumber = obj.debitNumber? obj.debitNumber.toString(): "0";
      return obj
    })
    let errorArray = [];
    let isValid = true;

    let payload = {
      userClientId: G_UCParId,
      userId: LocalFunction.getLocalValue(globleVariable.userId, true),
      range: gstr1Range,
      data: [...data],
    };

    console.log("purchaseData save", purchaseData);

    if (activeTab == 8) {
      console.log(purchaseData);

      for (let i = 0; i < purchaseData.length; i++) {
        let cgst = null;
        let sgst = null;


        let cgstValid = true;
        let sgstValid = true;


        console.log(purchaseData[i]);



        if (
          purchaseData[i]["cgst"] !== "" &&
          purchaseData[i]["cgst"] !== null
        ) {
          if (isNumber(purchaseData[i]["cgst"]) == false) {
            isValid = false;
            cgst = purchaseData[i]["cgst"];
            cgstValid = false;
          }
        }

        if (
          purchaseData[i]["sgst"] !== "" &&
          purchaseData[i]["sgst"] !== null
        ) {
          if (isNumber(purchaseData[i]["sgst"]) == false) {
            isValid = false;
            sgst = purchaseData[i]["sgst"];
            sgstValid = false;
          }
        }


        if (

          cgstValid == true &&
          sgstValid == true
        ) {
        } else {
          errorArray.push({
            rowid: purchaseData[i]["description"],
            cgst: cgst,
            sgst: sgst
          });
        }
      }

      if (isValid == false) {

        let csssClass = "";
        let htmltblData =
          "<div  class='import-error-height' ><table class='table text-start'><thead style='" +
          csssClass +
          "' ><tr style='" +
          csssClass +
          "'><th style='" +
          csssClass +
          "'>Row No</th><th style='" +
          csssClass +
          "'>Error</th>";
        for (let i = 0; i < errorArray.length; i++) {
          htmltblData += `<tr style="${csssClass}"><td style="${csssClass}">${
            i + 1
          }</td><td style="${csssClass};">${
            errorArray[i].rowid
          } - only numeric value allow. </td></tr>`;
        }

        htmltblData += "</tbody></table></div>";

        return MySwal.fire({
          title: "<strong>Error2</strong>",
          html: htmltblData,
          // <List errorDataList={errorArray}></List>,
          customClass: {
            confirmButton: "btn btn-danger",
          },
          buttonsStyling: false,
          width: "60%",
          height: "350px",
        });
      } else {
        setBlock(true);
        gstr6PurchaseInvoice
        .gstrLateFeeSaveInvoice(payload)
        .then((res) => {
          if (res?.status == 200 && res?.data?.status == 1) {
            console.log("res1", res.data.data);
            setBlock(false);
            toast.success(res.data.successMessage, {
              position: "top-right",
            });
            purchaseSummaryList(
              activeTab,
              "",
              "",
              "0",
              finFromYear?.value,
              monthFrom?.value,
              ""
            );
          } else if(res?.data?.status == 400){
            setBlock(false);
            toast.error("something went wrong!", {
              position: "top-right",
            });
          } else {
            console.log("res2");
            setBlock(false);
            toast.error(res.headers.errormessage, {
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
              confirmButton: "btn btn-outline-danger",
            },
            buttonsStyling: false,
          });
        });


      }
    }

  };


  function isNumber(n) {
    return /^-?[\d.]+(?:e-?\d+)?$/.test(n);
  }

  //** Clear filter
  const ClearFilter = () => {
    console.log("clear filter");
    setCurrentCol([]);
    setCurrentCol1();
    setSearchVal1([]);
    setSearchDate("");
    setSearchDate1("");
    setSearchDate2("");
    setSearchDate3("");
    setToDate("")
    setSearchDate1To("");
    setSearchDate2To("");
    setSearchDate3To("");
    setPage(0);
    setToDate("")
    setFromAmount("")
    setToAmount("")

    setToAmountIGST("")
    setFromAmountIGST("")

    setFromAmountTaxable("")
    setToAmountTaxable("")

    setToAmountCGST("")
    setFromAmountCGST("")

    setToAmountSGST("")
    setFromAmountSGST("")

    setFromAmountCESS("")
    setToAmountCESS("")
    setFilterDropDownList({
      supplyTypeDropdownList : [],
      unitTypeDropDownList : [],
      originalUnitTypeDropDownList : [],
      posDropDownList: [],
      sezDropDownList: [],
      eligibilityofITCDropDownList: [],
      noteTypeDropDownList: [],
      docTypeDropDownList: [],
      isLocatedDropDownList: [],
      rateDropDownList: [],
      actionDropDownList: []
    });
    setGridCustomFilter([])
    setPageNoSelect(paginationList[0])
    isChecked = false;

    // setCurrentPage(0);

    const invType =
      activeTab == 1
        ? invoceTypes?.value
        : activeTab == 2
        ? crdrInvoiceType?.value
        : activeTab == 7
        ? b2csInvoiceType?.value
        : activeTab == 6
        ? atInvoiceType?.value
        : url;
    console.log(invType, "invType");
    setPage(0);
    purchaseSummaryList(
      activeTab,
      "",
      "",
      invType,
      finFromYear?.value,
      monthFrom?.value,
      refershData,
      1
    );
    console.log(
      activeTab,
      invType,
      finFromYear?.value,
      monthFrom?.value,
      refershData,
      "clearFilter"
    );
  };

  const generateOption = (col, from, to) => ({
    name: `<div style="margin-top:10px">Min Value <br><input type='text' class='custom-date col-md-11' placeholder='Min Amount' id='amount1' name='amount1' value=${from} > <br/> 
        Max Value <br> <input type='text' class='custom-date col-md-11' placeholder='Max Amount' id='amount2' name='amount2' value=${to}>
        </div>`,
    hidden() {
        return this.getSelectedRangeLast().to.col !== col;
    },
    callback: function (key, selection, clickEvent) {
        console.log("date picker clicked");
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


// *************************for Tab1  **********

let dropDonwNameAssign;
if (b2bColumns[currentCol1]?.data === "supplyType") {
  dropDonwNameAssign = supplyType;
} else if (b2bColumns[currentCol1]?.data === "rate") {
  dropDonwNameAssign = rate;
}else if (b2bColumns[currentCol1]?.data === "placeOfSupply") {
  dropDonwNameAssign = placeOfSupply;
} else if (b2bColumns[currentCol1]?.data === "action") {
  dropDonwNameAssign = action;
}

let dropDonwName = dropDonwNameAssign !== undefined && dropDonwNameAssign !== null ? dropDonwNameAssign : supplyType;

// ************************for Tab2 ********************

let dropDonwNameAssignTab2;
if (ITCrevisedColumns[currentCol1]?.data === "sezSupplier") {
  dropDonwNameAssignTab2 = sezSupplier;
} else if (ITCrevisedColumns[currentCol1]?.data === "rate") {
  dropDonwNameAssignTab2 = rate;
}else if (ITCrevisedColumns[currentCol1]?.data === "placeOfSupply") {
  dropDonwNameAssignTab2 = placeOfSupply;
} else if (ITCrevisedColumns[currentCol1]?.data === "action") {
  dropDonwNameAssignTab2 = action;
}

let dropDonwNameTab2 = dropDonwNameAssignTab2 !== undefined && dropDonwNameAssignTab2 !== null ? dropDonwNameAssignTab2 : sezSupplier;

// ****************************** for Tab 3 ***************

let dropDonwNameAssignTab3;
if (cdnColumns[currentCol1]?.data === "supplyType") {
dropDonwNameAssignTab3 = supplyType;
} else if (cdnColumns[currentCol1]?.data === "rate") {
dropDonwNameAssignTab3 = rate;
}else if (cdnColumns[currentCol1]?.data === "placeOfSupply") {
dropDonwNameAssignTab3 = placeOfSupply;
} else if (cdnColumns[currentCol1]?.data === "action") {
dropDonwNameAssignTab3 = action;
}
else if (cdnColumns[currentCol1]?.data === "noteType") {
dropDonwNameAssignTab3 = noteType;
}

let dropDonwNameTab3 = dropDonwNameAssignTab3 !== undefined && dropDonwNameAssignTab3 !== null ? dropDonwNameAssignTab3 : noteType;

// ****************************** for Tab 4 ***************

let dropDonwNameAssignTab4;
if (cdnaColumns[currentCol1]?.data === "supplyType") {
dropDonwNameAssignTab4 = supplyType;
} else if (cdnaColumns[currentCol1]?.data === "rate") {
dropDonwNameAssignTab4 = rate;
}else if (cdnaColumns[currentCol1]?.data === "placeOfSupply") {
dropDonwNameAssignTab4 = placeOfSupply;
} else if (cdnaColumns[currentCol1]?.data === "action") {
dropDonwNameAssignTab4 = action;
}
else if (cdnaColumns[currentCol1]?.data === "noteType") {
dropDonwNameAssignTab4 = noteType;
}

let dropDonwNameTab4 = dropDonwNameAssignTab4 !== undefined && dropDonwNameAssignTab4 !== null ? dropDonwNameAssignTab4 : supplyType;

// ****************************** for Tab 5 ***************

let dropDonwNameAssignTab5;
if (distributionOfItcColumns[currentCol1]?.data === "eligibilityOfITC") {
dropDonwNameAssignTab5 = eligibilityofITC;
} else if (distributionOfItcColumns[currentCol1]?.data === "unitType") {
dropDonwNameAssignTab5 = unitType;
}else if (distributionOfItcColumns[currentCol1]?.data === "sezSupplier") {
dropDonwNameAssignTab5 = sezSupplier;
} else if (distributionOfItcColumns[currentCol1]?.data === "action") {
dropDonwNameAssignTab5 = action;
}
else if (distributionOfItcColumns[currentCol1]?.data === "noteType") {
dropDonwNameAssignTab5 = isdDocumentType;
}

let dropDonwNameTab5 = dropDonwNameAssignTab5 !== undefined && dropDonwNameAssignTab5 !== null ? dropDonwNameAssignTab5 : eligibilityofITC;

// ****************************** for Tab 6 ***************

let dropDonwNameAssignTab6;
if (ammendDistributionItcdetailsColumn[currentCol1]?.data === "eligibilityOfITC") {
dropDonwNameAssignTab6 = eligibilityofITC;
} else if (ammendDistributionItcdetailsColumn[currentCol1]?.data === "unitType") {
dropDonwNameAssignTab6 = unitType;
}else if (ammendDistributionItcdetailsColumn[currentCol1]?.data === "sezSupplier") {
dropDonwNameAssignTab6 = sezSupplier;
} else if (ammendDistributionItcdetailsColumn[currentCol1]?.data === "action") {
dropDonwNameAssignTab6 = action;
}
else if (ammendDistributionItcdetailsColumn[currentCol1]?.data === "originalUnitType") {
  dropDonwNameAssignTab6 =originalUnitType;
  }

let dropDonwNameTab6 = dropDonwNameAssignTab6 !== undefined && dropDonwNameAssignTab6 !== null ? dropDonwNameAssignTab6 : eligibilityofITC;



  return (
    <div>
      {block && <div className="loading1">Loading&#8230;</div>}
      <Row>
        <Col xs={12}>
          <Tabs
            className="mb-2"
            activeTab={activeTab}
            toggleTab={toggleTab}
            btnType={url}
          />
          <TabContent activeTab={activeTab}>
            {/* B2B Table  */}
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
                                <span> {totalInvoice ? totalInvoice : 0}</span>
                              </p>
                            </td>

                            <td>
                              <p className="mb-0">
                                {" "}
                                Invoice Values (₹)
                                <br />
                                <span>
                                  {" "}
                                  {totalInvoiceValue ? totalInvoiceValue : 0}
                                </span>
                              </p>
                            </td>
                            <td>
                              <p className="mb-0">
                                Taxable Values{"  "} (₹)
                                <br />
                                <span>
                                  {totalTaxableValue ? totalTaxableValue : 0}
                                </span>
                              </p>
                            </td>

                            <td>
                              <p className="mb-0">
                                IGST (₹)
                                <br />
                                <span> {totalIGST ? totalIGST : 0}</span>
                              </p>
                            </td>
                            <td>
                              <p className="mb-0">
                                SGST (₹)
                                <br />
                                <span> {totalSGST ? totalSGST : 0}</span>
                              </p>
                            </td>
                            <td>
                              <p className="mb-0">
                                CGST (₹)
                                <br />
                                <span> {totalCGST ? totalCGST : 0}</span>
                              </p>
                            </td>
                            <td>
                              <p className="mb-0">
                                Cess (₹)
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
                        <Col sm={6}>
                          <Label className="form-label">Invoice Type</Label>
                          <Select
                            id="purchaseId_invtype"
                            placeholder="Invoice Type"
                            theme={selectThemeColors}
                            components={animatedComponents}
                            options={invoiceTypeList}
                            classNamePrefix="select"
                            onChange={filterInvoiceType}
                            isDisabled={true}
                            value={{ label: "B2B", value: "b2b" }}
                          />
                        </Col>
                        <Col sm={6}>
                          <Label className="form-label">
                             Return Period
                          </Label>
                          <div>
                            {console.log(finFromYear, "finFromYearfinFromYear")}
                          </div>
                          <Select
                            id="from"
                            placeholder="Range"
                            isClearable={false}
                            theme={selectThemeColors}
                            closeMenuOnSelect={true}
                            options={panDataFrom}
                            isDisabled={true}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            components={animatedComponents}
                            onChange={selectFromYear}
                            value={finFromYear}
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

                        {/* {purchaseData.length > 0 ? ( */}
                          <HotTable
                            ref={hotRef}
                            style={purchaseData.length > 0 ? "" : { textAlign: "center", overflowX: "hidden" }}
                            viewportColumnRenderingOffset={100}
                            readOnly={true}
                            autoWrapRow={true}
                            data={purchaseData.length > 0 ? purchaseData : [{ select: "No Data Found" }]}
                            rowHeights={RowSize}
                            columnHeaderHeight={columnHeaderSize}
                            autoColumnSize= {{
                              samplingRatio: 23  // Adjust the samplingRatio as needed
                            }}
                            manualColumnResize={true}
                            afterGetColHeader={theader}
                            colHeaders={colHeaders}
                            stretchH="all"
                            preventOverflow="horizontal"
                            columns={purchaseData.length > 0 ? b2bColumns : b2bColumnsEmpty}
                            contextMenu={false}
                            bindRowsWithHeaders={true}
                            licenseKey="non-commercial-and-evaluation"
                            height="auto"
                            afterOnCellMouseDown={localAfterOnCellMouseDown1}
                            mergeCells={purchaseData.length > 0 ? false: [
                              { row: 0, col: 0, rowspan: 1, colspan: 12 },
                            ]}
                            hiddenColumns={false}
                            cells={function (row, col) {
                              var cp = {};
                              const hot = hotRef?.current?.hotInstance;
                              cp.className = "child";
                              if (
                                col == 4 ||
                                col == 7 ||
                                col == 8 ||
                                col == 9 ||
                                col == 10 ||
                                col == 11 ||
                                col == 12
                              ) {
                                cp.className = "text-end";
                              }

                              return cp;
                            }}
                            filters={true}
                            dropdownMenu={{
                              items: {
                                filter_by_value: {
                                  name: "Search Value",
                                  // hide the 'Filter by value' list from all columns but the first one
                                  hidden() {
                                    const hot = hotRef?.current?.hotInstance;
                                    const selectedValue = this.getSelected()[0][1];
                                    const isValidColumn = [4,5,6,7,8,9,10,11,12,13].includes(selectedValue);
          
                                    return isValidColumn;
                                  },
                                },
          
                                about: { // For CheckBox custom option

                                  name: `<div  style="margin-left:6px">Select Options<label class="float-end text-danger "><a><u id="selectAll">Select All</u></a></label></div> <div  class="checkboxmenu custom-scrollbar"> <div >  <table id="searchTable" >
                                  ${dropDonwName &&
                                    dropDonwName?.map((index) => (
                                      `<tr><td><input class="checkBoxClass" type="checkbox" value="${index?.value}" /> <span class="fw-normal">${index?.label?.length > 20 ? index?.label?.substring(0, 20) + "..." : index?.label}</span> </td></tr>`
                                    )).join('')
                                    }
          
                                    </table></div>
                                    </div>`, // Name can contain HTML 
                                  hidden() {
                                    const selectedCol = this.getSelectedRangeLast().to.col;
                                    const isHiddenCol = ![6,7,8].includes(selectedCol);
          
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
          
                                option5: {
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
                                      )}  class='custom-date col-md-11' placeholder='DD-MM-YYYY' id='custom2' name='date' value=${toDate?toDate:searchDate} >
                                     </div> `,
                                  hidden() {
                                    return this.getSelectedRangeLast().to.col != 4;
                                  },
          
                                  //disabled: true,
                                  callback: function (key, selection, clickEvent) {
          
                                    console.log("date picker clicked");
                                    var src = clickEvent.target;
          
                                    if (src.tagName === "INPUT") {
                                      clickEvent.stopImmediatePropagation();
                                    }
          
                                    clickEvent.stopImmediatePropagation();
                                  },
                                },
          
                                option6: generateOption(5, fromAmount, toAmount),
                                option7: generateOption(9, fromAmountTaxable, toAmountTaxable),
                                option8: generateOption(10, fromAmountIGST, toAmountIGST),
                                option9: generateOption(11, fromAmountCGST, toAmountCGST),
                                option10: generateOption(12, fromAmountSGST, toAmountSGST),
                                option11: generateOption(13, fromAmountCESS, toAmountCESS),
          
                                clear: {
                                  name: `<button id='btnClear'  name='Clear' tabIndex="-1"   value='Clear'>Clear</button>`,
                                  
                                  callback: function (key, selection, clickEvent) {
          
                                    var src = clickEvent.target;
          
                                    if (src?.tagName?.toLowerCase() === "button") {
                                      if (clickEvent.target.id == "btnClear") {
                                        const hot = hotRef?.current?.hotInstance;
                                        const selectedValue = hot?.getSelected()[0][1];
                                        const isValidTextColumn = [4,5,6,7,8,9,10,11,12,13].includes(selectedValue);
                                        const isValidCheckBoxColumn = [6,7,8].includes(selectedValue);

                                        if (!isValidTextColumn) {
                                          let x = searchVal1
                                          var value = "";
                                          var columnName = b2bColumns[currentCol1]?.data;
                                          let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
          
                                          filterObject.push({ [columnName]: value });
                                          if (!searchVal1?.length) {
                                            x.push(value);
                                            let y = currentCol;
                                            y.push(
                                              b2bColumns[currentCol1]?.data
                                            );
                                            // console.log("jsx=",x,y)
                                            setSearchVal1(x);
                                            setCurrentCol(y);
                                          } else {
                                            const Index = currentCol?.findIndex(
                                              (item) =>
                                                b2bColumns[currentCol1]?.data ==
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
                                                b2bColumns[currentCol1]?.data
                                              );
                                              setSearchVal1(x);
                                              setCurrentCol(y);
                                            }
                                          }

                                          setPage(0);
                                          purchaseSummaryList(
                                            activeTab,
                                            "",
                                            "asc",
                                            invoceTypes?.value,
                                            finFromYear?.value,
                                            monthFrom?.value,
                                            "", 1
                                          );
                                        
          
                                        }
                                        else if (hot?.getSelected()[0][1] == 4) {
                                          var columnName = b2bColumns[currentCol1]?.data;
                                          var value = '';
                                          setSearchDate('');
                                          setToDate('');
                                          let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                          filterObject.push({ [columnName]: value });
                                          if (!searchVal1?.length) {
          
                                            x.push(value);
                                            let y = currentCol;
                                            y.push(
                                              b2bColumns[currentCol1]?.data
                                            );
                                            // console.log("jsx=",x,y)
                                            setSearchVal1(x);
                                            setCurrentCol(y);
                                          } else {
                    
                                            const Index = currentCol?.findIndex(
                                              (item) =>
                                              b2bColumns[currentCol1]?.data ==
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
                                                b2bColumns[currentCol1]?.data
                                              );
                                              setSearchVal1(x);
                                              setCurrentCol(y);
                                            }
                                          }
          
                                          setPage(0);
                                          purchaseSummaryList(
                                            activeTab,
                                            "",
                                            "asc",
                                            invoceTypes?.value,
                                            finFromYear?.value,
                                            monthFrom?.value,
                                            "", 1
                                          );
      
          
                                        }
                             
                                        else if (hot?.getSelected()[0][1] == 5) {
                                          const x = searchVal1
                                          var columnName = b2bColumns[currentCol1]?.data;
                                          var value = '';
                                          setFromAmount('');
                                          setToAmount('');
                                          let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                          filterObject.push({ [columnName]: value });
                                          if (!searchVal1?.length) {
          
                                            x.push(value);
                                            let y = currentCol;
                                            y.push(
                                              b2bColumns[currentCol1]?.data
                                            );
                                            // console.log("jsx=",x,y)
                                            setSearchVal1(x);
                                            setCurrentCol(y);
                                          } else {
                    
                                            const Index = currentCol?.findIndex(
                                              (item) =>
                                              b2bColumns[currentCol1]?.data ==
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
                                                b2bColumns[currentCol1]?.data
                                              );
                                              setSearchVal1(x);
                                              setCurrentCol(y);
                                            }
                                          }
          
                                          setPage(0);
                                          purchaseSummaryList(
                                            activeTab,
                                            "",
                                            "asc",
                                            invoceTypes?.value,
                                            finFromYear?.value,
                                            monthFrom?.value,
                                            "", 1
                                          );
                                       
          
                                        }
                                        else if (hot?.getSelected()[0][1] == 9) {
                                          const x = searchVal1
                                          var columnName = b2bColumns[currentCol1]?.data;
                                          var value = '';
                                          setFromAmountTaxable('');
                                          setToAmountTaxable('');
          
                                          let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
          
                                          filterObject.push({ [columnName]: value });
                                          if (!searchVal1?.length) {
          
                                            x.push(value);
                                            let y = currentCol;
                                            y.push(
                                              b2bColumns[currentCol1]?.data
                                            );
                                            // console.log("jsx=",x,y)
                                            setSearchVal1(x);
                                            setCurrentCol(y);
                                          } else {
                    
                                            const Index = currentCol?.findIndex(
                                              (item) =>
                                              b2bColumns[currentCol1]?.data ==
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
                                                b2bColumns[currentCol1]?.data
                                              );
                                              setSearchVal1(x);
                                              setCurrentCol(y);
                                            }
                                          }
          
                                          setPage(0);
                                          purchaseSummaryList(
                                            activeTab,
                                            "",
                                            "asc",
                                            invoceTypes?.value,
                                            finFromYear?.value,
                                            monthFrom?.value,
                                            "", 1
                                          );
          
                                        }
                                        else if (hot?.getSelected()[0][1] == 10) {
                                          const x = searchVal1
                                          var columnName = b2bColumns[currentCol1]?.data;
                                          var value = '';
                                          setFromAmountIGST('');
                                          setToAmountIGST('');
          
                                          let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
          
                                          filterObject.push({ [columnName]: value });
                                          if (!searchVal1?.length) {
          
                                            x.push(value);
                                            let y = currentCol;
                                            y.push(
                                              b2bColumns[currentCol1]?.data
                                            );
                                            // console.log("jsx=",x,y)
                                            setSearchVal1(x);
                                            setCurrentCol(y);
                                          } else {
                    
                                            const Index = currentCol?.findIndex(
                                              (item) =>
                                              b2bColumns[currentCol1]?.data ==
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
                                                b2bColumns[currentCol1]?.data
                                              );
                                              setSearchVal1(x);
                                              setCurrentCol(y);
                                            }
                                          }
          
                                          setPage(0);
                                          purchaseSummaryList(
                                            activeTab,
                                            "",
                                            "asc",
                                            invoceTypes?.value,
                                            finFromYear?.value,
                                            monthFrom?.value,
                                            "", 1
                                          );
          
                                        }
                                        else if (hot?.getSelected()[0][1] == 11) {
                                          const x = searchVal1
                                          var columnName = b2bColumns[currentCol1]?.data;
                                          var value = '';
                                          setFromAmountCGST('');
                                          setToAmountCGST('');
          
                                          let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
          
                                          filterObject.push({ [columnName]: value });
                                          if (!searchVal1?.length) {
          
                                            x.push(value);
                                            let y = currentCol;
                                            y.push(
                                              b2bColumns[currentCol1]?.data
                                            );
                                            // console.log("jsx=",x,y)
                                            setSearchVal1(x);
                                            setCurrentCol(y);
                                          } else {
                    
                                            const Index = currentCol?.findIndex(
                                              (item) =>
                                              b2bColumns[currentCol1]?.data ==
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
                                                b2bColumns[currentCol1]?.data
                                              );
                                              setSearchVal1(x);
                                              setCurrentCol(y);
                                            }
                                          }
          
                                          setPage(0);
                                          purchaseSummaryList(
                                            activeTab,
                                            "",
                                            "asc",
                                            invoceTypes?.value,
                                            finFromYear?.value,
                                            monthFrom?.value,
                                            "", 1
                                          );
          
                                        }
                                        else if (hot?.getSelected()[0][1] == 12) {
                                          const x = searchVal1
                                          var columnName = b2bColumns[currentCol1]?.data;
                                          var value = '';
                                          setFromAmountSGST('');
                                          setToAmountSGST('');
          
                                          let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
          
                                          filterObject.push({ [columnName]: value });
                                          if (!searchVal1?.length) {
          
                                            x.push(value);
                                            let y = currentCol;
                                            y.push(
                                              b2bColumns[currentCol1]?.data
                                            );
                                            // console.log("jsx=",x,y)
                                            setSearchVal1(x);
                                            setCurrentCol(y);
                                          } else {
                    
                                            const Index = currentCol?.findIndex(
                                              (item) =>
                                              b2bColumns[currentCol1]?.data ==
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
                                                b2bColumns[currentCol1]?.data
                                              );
                                              setSearchVal1(x);
                                              setCurrentCol(y);
                                            }
                                          }
          
                                          setPage(0);
                                          purchaseSummaryList(
                                            activeTab,
                                            "",
                                            "asc",
                                            invoceTypes?.value,
                                            finFromYear?.value,
                                            monthFrom?.value,
                                            "", 1
                                          );
          
                                        }
                                        else if (hot?.getSelected()[0][1] == 13) {
                                          const x = searchVal1
                                          var columnName = b2bColumns[currentCol1]?.data;
                                          var value = '';
                                          setFromAmountCESS('');
                                          setToAmountCESS('');
          
                                          let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
          
                                          filterObject.push({ [columnName]: value });
                                          if (!searchVal1?.length) {
          
                                            x.push(value);
                                            let y = currentCol;
                                            y.push(
                                              b2bColumns[currentCol1]?.data
                                            );
                                            // console.log("jsx=",x,y)
                                            setSearchVal1(x);
                                            setCurrentCol(y);
                                          } else {
                    
                                            const Index = currentCol?.findIndex(
                                              (item) =>
                                              b2bColumns[currentCol1]?.data ==
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
                                                b2bColumns[currentCol1]?.data
                                              );
                                              setSearchVal1(x);
                                              setCurrentCol(y);
                                            }
                                          }
          
                                          setPage(0);
                                          purchaseSummaryList(
                                            activeTab,
                                            "",
                                            "asc",
                                            invoceTypes?.value,
                                            finFromYear?.value,
                                            monthFrom?.value,
                                            "", 1
                                          );
          
                                        }
                                        else if (isValidCheckBoxColumn) {
                                          const x = searchVal1
                                          var checkboxes = document.getElementsByClassName('checkBoxClass');
                                          arrChk = []
                                          setFilterDropDownList([]);
                                          var columnName = b2bColumns[currentCol1]?.data;
                                          let filterObject2 = !gridCustomFilter ? [] : gridCustomFilter
                                          let filterObject = []
                                          filterObject2 = filterObject2 == null || filterObject2.length <= 0 ? [] : filterObject2;
          
                                          for (let i = 0; i < checkboxes.length; i++) {
                                            if (checkboxes[i].checked) {
                                              console.log("else is running")
                                              let uniqueArray = filterObject.filter((obj, index, self) =>
                                                index === self.findIndex((t) => (
                                                  JSON.stringify(t) === JSON.stringify(obj)
                                                ))
                                              );
                                              let uniqueArray2 = filterObject2.filter((obj, index, self) =>
                                              index === self.findIndex((t) => (
                                                JSON.stringify(t) === JSON.stringify(obj)
                                              ))
                                            );
                                              console.log(uniqueArray,"uniqArray")
                                              filterObject2 = uniqueArray2
                                              const index = filterObject.findIndex(obj => obj[columnName] === checkboxes[i].value);
                                              const index1 = filterObject2.findIndex(obj => obj[columnName] === checkboxes[i].value);
                                              if (index !== -1 || index1 !== -1)   {
                                                // delete filterObject[index1][columnName];
                                                delete filterObject2[index1][columnName];
                                              }
                                            }
                                          }
                                          setGridCustomFilter(filterObject2);
                                          var value = ""
                                          if (!searchVal1?.length) {
                                            x.push(value);
                                            let y = currentCol;
                                            y.push(
                                              b2bColumns[currentCol1]?.data
                                            );
                                            setSearchVal1(x);
                                            setCurrentCol(y);
                                          } else{
                                            const Index = currentCol?.findIndex(
                                              (item) =>
                                              b2bColumns[currentCol1]?.data ==
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
                                                b2bColumns[currentCol1]?.data
                                              );
                                              setSearchVal1(x);
                                              setCurrentCol(y);
                                            }
                                            
                                          }
                                          setPage(0);
                                          purchaseSummaryList(
                                            activeTab,
                                            "",
                                            "asc",
                                            invoceTypes?.value,
                                            finFromYear?.value,
                                            monthFrom?.value,
                                            "", 1
                                          );
                                          // let newFilterData = FilterData(filterObject);
                                          // setData([...newFilterData]);
          
                                          const updatedFilterDropDownList = filterObject2.reduce((acc, item) => {
                                            const { rate, supplyType, placeOfSupply} = item;
          
                                            const updateList = (list, value) => {
                                              console.log(list,value,"list,value")
                                              return list.includes(value) ? list : [...list, value];
                                            };
          
                                            if (rate !== undefined) {
                                              acc.rateDropDownList = updateList(acc.rateDropDownList, rate);
                                            }  else if (supplyType !== undefined) {
                                              acc.supplyTypeDropdownList = updateList(acc.supplyTypeDropdownList, supplyType);
                                            } else if (placeOfSupply !== undefined) {
                                              acc.posDropDownList = updateList(acc.posDropDownList, placeOfSupply);
                                            } 
          
                                            return acc;
                                          }, { rateDropDownList: [], supplyTypeDropdownList: [],  posDropDownList: []});
          
                                          setFilterDropDownList(updatedFilterDropDownList);
          
                                        }
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
                                rateDropDownList,
                                supplyTypeDropdownList,
                                posDropDownList,
                              } = filterDropDownList;
          
                              const listsToCheck = [
                                rateDropDownList,
                                supplyTypeDropdownList,
                                posDropDownList,
                              ];
          
                              for (var j = 0; j < checkboxes.length; j++) {
                                for (var k = 0; k < listsToCheck.length; k++) {
                                  if (listsToCheck[k]) {
                                   
                                    // For rcmDropDownList, check both conditions listsToCheck[k][i] == checkboxes[j].value and checkboxes?.length == 2
                                    if (k === 0 && checkboxes.length === 13) {
          
                                      for (var i = 0; i < listsToCheck[k].length; i++) {
                                        if (listsToCheck[k][i] == checkboxes[j].value) {
                                          $(checkboxes[j]).prop("checked", true);
                                          break;
                                        }
                                      }
                                    } else if (k === 1 && checkboxes.length === 2) {
          
                                      for (var i = 0; i < listsToCheck[k].length; i++) {
                                        if (listsToCheck[k][i] == checkboxes[j].value) {
                                          $(checkboxes[j]).prop("checked", true);
                                          break;
                                        }
                                      }
                                    }
                                    else {
          
                                      for (var i = 0; i < listsToCheck[k].length; i++) {
                                        if (listsToCheck[k][i] == checkboxes[j].value && k !== 0 && k !== 1) {
                                          $(checkboxes[j]).prop("checked", true);
                                          break;
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }}
                            afterFilter={function (data) {
                              const hot = hotRef?.current?.hotInstance;
                              const selectedValuecol = hot?.getSelected()[0][1];
                              const shouldExcludeTextBox = [4,5,6,7,8,9,10,11,12,13].includes(selectedValuecol);
                              const shouldExcludeCheckBox = [6,7,8].includes(selectedValuecol);
                              
                              if (!shouldExcludeTextBox) {
                                let x = searchVal1
                                var searchInput = document.querySelector(".htUIMultipleSelectSearch.htUIInput");
                                var value = searchInput?.children[0].value;
                                //  x.push(value)
                                var columnName = b2bColumns[currentCol1]?.data;
                                let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
          
                                filterObject.push({ [columnName]: value });
          
                                // setSearchVal1(x);
                                // let y = currentCol;
                                // y.push(handsontableColumns[currentCol1]?.data);
          
                                // setCurrentCol(y)\
                                if (!searchVal1?.length) {
          
                                  x.push(value);
                                  let y = currentCol;
                                  y.push(
                                    b2bColumns[currentCol1]?.data
                                  );
                                  // console.log("jsx=",x,y)
                                  setSearchVal1(x);
                                  setCurrentCol(y);
                                } else {
          
                                  const Index = currentCol?.findIndex(
                                    (item) =>
                                    b2bColumns[currentCol1]?.data ==
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
                                      b2bColumns[currentCol1]?.data
                                    );
                                    setSearchVal1(x);
                                    setCurrentCol(y);
                                  }
                                }

                                setPage(0);
                                purchaseSummaryList(
                                  activeTab,
                                  "",
                                  "asc",
                                  invoceTypes?.value,
                                  finFromYear?.value,
                                  monthFrom?.value,
                                  "", 1
                                );
          
                                // setGridCustomFilter(filterObject)
                                // let newFilterData = FilterData(filterObject);
                                // setData([...newFilterData]);
          
                              }


                              if(selectedValuecol == 4){
                                let x = searchVal1;
                                var searchInput1 = document.getElementById("custom1");
                                var searchInput2 = document.getElementById("custom2");
                                const invFromDate = searchInput1?.value
                                const invToDate = searchInput2?.value
                                var value = (searchInput1?.value || searchInput2?.value) && `${invFromDate ? invFromDate : invToDate}to${invToDate ? invToDate : invFromDate}`;
                                var columnName = b2bColumns[currentCol1]?.data;
                                setSearchDate(searchInput1?.value);
                                setToDate(searchInput2?.value);
                                let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                filterObject.push({ [columnName]: value });
                                if (!searchVal1?.length) {
                                  x.push(value);
                                  let y = currentCol;
                                  y.push(
                                    b2bColumns[currentCol1]?.data
                                  );
                                  setSearchVal1(x);
                                  setCurrentCol(y);
                                } else{
                                  const Index = currentCol?.findIndex(
                                    (item) =>
                                    b2bColumns[currentCol1]?.data ==
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
                                      b2bColumns[currentCol1]?.data
                                    );
                                    setSearchVal1(x);
                                    setCurrentCol(y);
                                  }
                                  
                                }
                                setPage(0);
                                purchaseSummaryList(
                                  activeTab,
                                  "",
                                  "asc",
                                  invoceTypes?.value,
                                  finFromYear?.value,
                                  monthFrom?.value,
                                  "", 1
                                );

                              }
          
                              else if (selectedValuecol == 5) {
                                const x = searchVal1
                                var searchInput1 = document.getElementById("amount1");
                                var searchInput2 = document.getElementById("amount2");
                                const invFromDate = searchInput1?.value?.replaceAll(",", "")
                                const invToDate = searchInput2?.value?.replaceAll(",", "")
                                var columnName = b2bColumns[currentCol1]?.data;
                                // var value = (searchInput1?.value || searchInput2?.value) && `${invFromDate ? invFromDate : invToDate}to${invToDate ? invToDate : invFromDate}`;
                                var value = `${invFromDate}to${invToDate}`;
                                setFromAmount(searchInput1?.value);
                                setToAmount(searchInput2?.value);
                                let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                filterObject.push({ [columnName]: value });
                                if (!searchVal1?.length) {
                                  x.push(value);
                                  let y = currentCol;
                                  y.push(
                                    b2bColumns[currentCol1]?.data
                                  );
                                  setSearchVal1(x);
                                  setCurrentCol(y);
                                } else{
                                  const Index = currentCol?.findIndex(
                                    (item) =>
                                    b2bColumns[currentCol1]?.data ==
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
                                      b2bColumns[currentCol1]?.data
                                    );
                                    setSearchVal1(x);
                                    setCurrentCol(y);
                                  }
                                  
                                }
                                setPage(0);
                                purchaseSummaryList(
                                  activeTab,
                                  "",
                                  "asc",
                                  invoceTypes?.value,
                                  finFromYear?.value,
                                  monthFrom?.value,
                                  "", 1
                                );
                                // x.push(value)
                                // setSearchVal1(x);
                                // let y = currentCol;
                                // y.push(b2bColumns[currentCol1]?.data);
                                // setCurrentCol(y)
                           
          
                              }
          
                              else if (selectedValuecol == 9) {
                                const x = searchVal1
                                var searchInput1 = document.getElementById("amount1");
                                var searchInput2 = document.getElementById("amount2");
                                const invFromDate = searchInput1?.value?.replaceAll(",", "")
                                const invToDate = searchInput2?.value?.replaceAll(",", "")
                                var columnName = b2bColumns[currentCol1]?.data;
                                // var value = (searchInput1?.value || searchInput2?.value) && `${invFromDate ? invFromDate : invToDate}to${invToDate ? invToDate : invFromDate}`;
                                var value = `${invFromDate}to${invToDate}`;
                                setFromAmountTaxable(searchInput1?.value);
                                setToAmountTaxable(searchInput2?.value);
                                let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                filterObject.push({ [columnName]: value });
                                if (!searchVal1?.length) {
                                  x.push(value);
                                  let y = currentCol;
                                  y.push(
                                    b2bColumns[currentCol1]?.data
                                  );
                                  setSearchVal1(x);
                                  setCurrentCol(y);
                                } else{
                                  const Index = currentCol?.findIndex(
                                    (item) =>
                                    b2bColumns[currentCol1]?.data ==
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
                                      b2bColumns[currentCol1]?.data
                                    );
                                    setSearchVal1(x);
                                    setCurrentCol(y);
                                  }
                                  
                                }
                                setPage(0);
                                purchaseSummaryList(
                                  activeTab,
                                  "",
                                  "asc",
                                  invoceTypes?.value,
                                  finFromYear?.value,
                                  monthFrom?.value,
                                  "", 1
                                );
                                // x.push(value)
                                // setSearchVal1(x);
                                // let y = currentCol;
                                // y.push(b2bColumns[currentCol1]?.data);
                                // setCurrentCol(y)
                             
          
                              }
          
                              else if (selectedValuecol == 10) {
                                const x = searchVal1
                                var searchInput1 = document.getElementById("amount1");
                                var searchInput2 = document.getElementById("amount2");
                                const fromAmount = searchInput1?.value?.replaceAll(",", "")
                                const toAmount = searchInput2?.value?.replaceAll(",", "")
                                var columnName = b2bColumns[currentCol1]?.data;
                                // var value = (searchInput1?.value || searchInput2?.value) && `${fromAmount ? fromAmount : toAmount}to${toAmount ? toAmount : fromAmount}`;
                                var value = `${fromAmount}to${toAmount}`;
                                setFromAmountIGST(searchInput1?.value);
                                setToAmountIGST(searchInput2?.value);
                                let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                filterObject.push({ [columnName]: value });
                                // x.push(value)
                                // setSearchVal1(x);
                                // let y = currentCol;
                                // y.push(b2bColumns[currentCol1]?.data);
                                // setCurrentCol(y)
                                if (!searchVal1?.length) {
                                  x.push(value);
                                  let y = currentCol;
                                  y.push(
                                    b2bColumns[currentCol1]?.data
                                  );
                                  setSearchVal1(x);
                                  setCurrentCol(y);
                                } else{
                                  const Index = currentCol?.findIndex(
                                    (item) =>
                                    b2bColumns[currentCol1]?.data ==
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
                                      b2bColumns[currentCol1]?.data
                                    );
                                    setSearchVal1(x);
                                    setCurrentCol(y);
                                  }
                                  
                                }
                                setPage(0);
                                purchaseSummaryList(
                                  activeTab,
                                  "",
                                  "asc",
                                  invoceTypes?.value,
                                  finFromYear?.value,
                                  monthFrom?.value,
                                  "", 1
                                );
                            
          
                              }
          
                              else if (selectedValuecol == 11) {
                                const x = searchVal1
                                var searchInput1 = document.getElementById("amount1");
                                var searchInput2 = document.getElementById("amount2");
                                const fromAmount = searchInput1?.value?.replaceAll(",", "")
                                const toAmount = searchInput2?.value?.replaceAll(",", "")
                                var columnName = b2bColumns[currentCol1]?.data;
                                // var value = (searchInput1?.value || searchInput2?.value) && `${fromAmount ? fromAmount : toAmount}to${toAmount ? toAmount : fromAmount}`;
                                var value = `${fromAmount}to${toAmount}`;
                                setFromAmountCGST(searchInput1?.value);
                                setToAmountCGST(searchInput2?.value);
                                let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                filterObject.push({ [columnName]: value });
                                // x.push(value)
                                // setSearchVal1(x);
                                // let y = currentCol;
                                // y.push(b2bColumns[currentCol1]?.data);
                                // setCurrentCol(y)
                                if (!searchVal1?.length) {
                                  x.push(value);
                                  let y = currentCol;
                                  y.push(
                                    b2bColumns[currentCol1]?.data
                                  );
                                  setSearchVal1(x);
                                  setCurrentCol(y);
                                } else{
                                  const Index = currentCol?.findIndex(
                                    (item) =>
                                    b2bColumns[currentCol1]?.data ==
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
                                      b2bColumns[currentCol1]?.data
                                    );
                                    setSearchVal1(x);
                                    setCurrentCol(y);
                                  }
                                  
                                }
                                setPage(0);
                                purchaseSummaryList(
                                  activeTab,
                                  "",
                                  "asc",
                                  invoceTypes?.value,
                                  finFromYear?.value,
                                  monthFrom?.value,
                                  "", 1
                                );
                          
          
                              }
          
                              else if (selectedValuecol == 12) {
                                const x =  searchVal1
                                var searchInput1 = document.getElementById("amount1");
                                var searchInput2 = document.getElementById("amount2");
                                const fromAmount = searchInput1?.value?.replaceAll(",", "")
                                const toAmount = searchInput2?.value?.replaceAll(",", "")
                                var columnName = b2bColumns[currentCol1]?.data;
                                var value = `${fromAmount}to${toAmount}`;
                                // var value = (searchInput1?.value || searchInput2?.value) && `${fromAmount ? fromAmount : toAmount}to${toAmount ? toAmount : fromAmount}`;
                                setFromAmountSGST(searchInput1?.value);
                                setToAmountSGST(searchInput2?.value);
                                let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                filterObject.push({ [columnName]: value });
                                // x.push(value)
                                // setSearchVal1(x);
                                // let y = currentCol;
                                // y.push(b2bColumns[currentCol1]?.data);
                                // setCurrentCol(y)
                                if (!searchVal1?.length) {
                                  x.push(value);
                                  let y = currentCol;
                                  y.push(
                                    b2bColumns[currentCol1]?.data
                                  );
                                  setSearchVal1(x);
                                  setCurrentCol(y);
                                } else{
                                  const Index = currentCol?.findIndex(
                                    (item) =>
                                    b2bColumns[currentCol1]?.data ==
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
                                      b2bColumns[currentCol1]?.data
                                    );
                                    setSearchVal1(x);
                                    setCurrentCol(y);
                                  }
                                  
                                }
                                setPage(0);
                                purchaseSummaryList(
                                  activeTab,
                                  "",
                                  "asc",
                                  invoceTypes?.value,
                                  finFromYear?.value,
                                  monthFrom?.value,
                                  "", 1
                                );
                             
          
                              }
          
                              else if (selectedValuecol == 13) {
                                const x = searchVal1
                                var searchInput1 = document.getElementById("amount1");
                                var searchInput2 = document.getElementById("amount2");
                                const fromAmount = searchInput1?.value?.replaceAll(",", "")
                                const toAmount = searchInput2?.value?.replaceAll(",", "")
                                var columnName = b2bColumns[currentCol1]?.data;
                                // var value = (searchInput1?.value || searchInput2?.value) && `${fromAmount ? fromAmount : toAmount}to${toAmount ? toAmount : fromAmount}`;
                                var value = `${fromAmount}to${toAmount}`;
                                setFromAmountCESS(searchInput1?.value);
                                setToAmountCESS(searchInput2?.value);
                                let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                filterObject.push({ [columnName]: value });
                                // x.push(value)
                                // setSearchVal1(x);
                                // let y = currentCol;
                                // y.push(b2bColumns[currentCol1]?.data);
                                // setCurrentCol(y)
                                if (!searchVal1?.length) {
                                  x.push(value);
                                  let y = currentCol;
                                  y.push(
                                    b2bColumns[currentCol1]?.data
                                  );
                                  setSearchVal1(x);
                                  setCurrentCol(y);
                                } else{
                                  const Index = currentCol?.findIndex(
                                    (item) =>
                                    b2bColumns[currentCol1]?.data ==
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
                                      b2bColumns[currentCol1]?.data
                                    );
                                    setSearchVal1(x);
                                    setCurrentCol(y);
                                  }
                                  
                                }
                                setPage(0);
                                purchaseSummaryList(
                                  activeTab,
                                  "",
                                  "asc",
                                  invoceTypes?.value,
                                  finFromYear?.value,
                                  monthFrom?.value,
                                  "", 1
                                );

                             
          
                              }
          
                              else if (shouldExcludeCheckBox) {
                                const x = searchVal1
                                var checkboxes = document.getElementsByClassName('checkBoxClass');
                                arrChk = []
                                setFilterDropDownList([]);
                                var columnName = b2bColumns[currentCol1]?.data;
                                let filterObject2 = !gridCustomFilter ? [] : gridCustomFilter
                                let filterObject = []
                                filterObject2 = filterObject2 == null || filterObject2.length <= 0 ? [] : filterObject2;
          
                                for (let i = 0; i < checkboxes.length; i++) {
                                  if (checkboxes[i].checked) {
                                    arrChk.push({ [columnName]: checkboxes[i].value });
                                    filterObject2.push({ [columnName]: checkboxes[i].value });
                                    filterObject.push(checkboxes[i].value);
                                  } else {
                                    console.log("else is running")
                                    let uniqueArray = filterObject.filter((obj, index, self) =>
                                      index === self.findIndex((t) => (
                                        JSON.stringify(t) === JSON.stringify(obj)
                                      ))
                                    );
                                    let uniqueArray2 = filterObject2.filter((obj, index, self) =>
                                    index === self.findIndex((t) => (
                                      JSON.stringify(t) === JSON.stringify(obj)
                                    ))
                                  );
                                    console.log(uniqueArray,"uniqArray")
                                    filterObject2 = uniqueArray2
                                    const index = filterObject.findIndex(obj => obj[columnName] === checkboxes[i].value);
                                    const index1 = filterObject2.findIndex(obj => obj[columnName] === checkboxes[i].value);
                                    if (index !== -1 || index1 !== -1)   {
          
                                      // delete filterObject[index1][columnName];
                                      delete filterObject2[index1][columnName];
                                    }
                                  }
                                }
                                setGridCustomFilter(filterObject2)
                                var value = filterObject?.join("@#@#")
                                if (!searchVal1?.length) {
                                  x.push(value);
                                  let y = currentCol;
                                  y.push(
                                    b2bColumns[currentCol1]?.data
                                  );
                                  setSearchVal1(x);
                                  setCurrentCol(y);
                                } else{
                                  const Index = currentCol?.findIndex(
                                    (item) =>
                                    b2bColumns[currentCol1]?.data ==
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
                                      b2bColumns[currentCol1]?.data
                                    );
                                    setSearchVal1(x);
                                    setCurrentCol(y);
                                  }
                                  
                                }
                                setPage(0);
                                purchaseSummaryList(
                                  activeTab,
                                  "",
                                  "asc",
                                  invoceTypes?.value,
                                  finFromYear?.value,
                                  monthFrom?.value,
                                  "", 1
                                );
                                // setGridCustomFilter(filterObject)
                                // let newFilterData = FilterData(filterObject);
                                // setData([...newFilterData]);
          
                                const updatedFilterDropDownList = filterObject2.reduce((acc, item) => {
                                  const { rate, supplyType, placeOfSupply,  } = item;
          
                                  const updateList = (list, value) => {
                                    return list.includes(value) ? list : [...list, value];
                                  };
          
                                  if (rate !== undefined) {
                                    acc.rateDropDownList = updateList(acc.rateDropDownList, rate);
                                  }  else if (supplyType !== undefined) {
                                    acc.supplyTypeDropdownList = updateList(acc.supplyTypeDropdownList, supplyType);
                                  } else if (placeOfSupply !== undefined) {
                                    acc.posDropDownList = updateList(acc.posDropDownList, placeOfSupply);
                                  } 

                                  return acc;
                                }, { rateDropDownList: [], supplyTypeDropdownList: [],  posDropDownList: []});

                                setFilterDropDownList(updatedFilterDropDownList);
          
                              }
                            }}
                          />
                        {/* {purchaseData && (
                          <ReactPaginate
                            breakLabel="..."
                            nextLabel=""
                            onPageChange={(e) => handlePageClick(e?.selected)}
                            pageRangeDisplayed={2}
                            pageCount={pageCount}
                            previousLabel=""
                            renderOnZeroPageCount={null}
                            marginPagesDisplayed={2}
                            forcePage={page}
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
                        )} */}
                           <Row className="justify-content-end mx-0">
                              <Col
                                className="d-flex align-items-center justify-content-end"
                                md="12"
                                sm="12"
                              >
                                {purchaseData?.length ? (<span>
                                  <b>{`${pageTotTitle}`}</b>  {" "}  &nbsp; &nbsp;
                                </span>) :  <></>}
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
                                // styles={customStyles}
                                />) : (<></>)}
                                &nbsp; &nbsp;
                                {purchaseData?.length ? ( <span  >
                                  <b>  { ` ${pageNoTitle}`}</b>
                                </span>) : <></>}

                                &nbsp; &nbsp;
                                <ReactPaginate
                                  breakLabel="..."
                                  nextLabel=""
                                  onPageChange={(e) => handlePageClick(e?.selected)}
                                  pageRangeDisplayed={2}
                                  pageCount={pageCount}
                                  previousLabel=""
                                  renderOnZeroPageCount={null}
                                  marginPagesDisplayed={2}
                                  forcePage={page}
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
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </TabPane>

            {/* ITC Revised B2BA */}
            <TabPane tabId="2" key="2">
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
                                    {totalInvoice ? totalInvoice : 0}
                                  </span>
                                </p>
                              </td>

                              <td>
                                <p className="mb-0">
                                  {" "}
                                  Invoice Values (₹) <br />
                                  <span>
                                    {" "}
                                    {totalInvoiceValue ? totalInvoiceValue : 0}
                                  </span>
                                </p>
                              </td>
                              <td>
                                <p className="mb-0">
                                  Taxable Values (₹){"  "} <br />
                                  <span>
                                    {totalTaxableValue ? totalTaxableValue : 0}
                                  </span>
                                </p>
                              </td>

                              <td>
                                <p className="mb-0">
                                  IGST (₹) <br />
                                  <span> {totalIGST ? totalIGST : 0}</span>
                                </p>
                              </td>
                              <td>
                                <p className="mb-0">
                                  SGST (₹) <br />
                                  <span> {totalSGST ? totalSGST : 0}</span>
                                </p>
                              </td>
                              <td>
                                <p className="mb-0">
                                  CGST (₹) <br />
                                  <span> {totalCGST ? totalCGST : 0}</span>
                                </p>
                              </td>
                              <td>
                                <p className="mb-0">
                                  Cess (₹)
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
                          <Col sm={6}>
                            <Label className="form-label">Invoice Type</Label>
                            <Select
                              id="crdr_invtype"
                              placeholder="Invoice Type"
                              theme={selectThemeColors}
                              components={animatedComponents}
                              options={crdrInvoiceTypeList}
                              className="basic-multi-select"
                              classNamePrefix="select"
                              onChange={crdrFilterInvoiceType}
                              isDisabled={true}
                              value={{ label: "B2BA", value: "b2ba" }}
                            />
                          </Col>
                          <Col sm={6}>
                            <Label className="form-label">
                               Return Period
                            </Label>
                            <Select
                              id="from1"
                              placeholder="From"
                              isClearable={false}
                              theme={selectThemeColors}
                              closeMenuOnSelect={true}
                              options={panDataFrom}
                              isDisabled={true}
                              className="basic-multi-select"
                              classNamePrefix="select"
                              components={animatedComponents}
                              onChange={selectFromYear}
                              value={finFromYear}
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
                        {/* {purchaseData.length > 0 && activeTab == "2"  ? ( */}
                          <HotTable
                            autoWrapRow={true}
                            style={ purchaseData.length > 0 ?"":{ textAlign: "center", overflowX: "hidden" }}
                            data={purchaseData.length > 0 ?  purchaseData: [{ originalSupplierGSTIN: "No Data Found" }]}
                            rowHeights={RowSize}
                            viewportColumnRenderingOffset={100}
                            afterGetColHeader={theaderITC}
                            afterOnCellMouseDown={localAfterOnCellMouseDown2}
                            colHeaders={colHeaders}
                            columns={purchaseData.length > 0 ? ITCrevisedColumns : ITCrevisedColumnsEmpty}
                            licenseKey="non-commercial-and-evaluation"
                            height="auto"
                            ref={hotRef1}
                            hiddenColumns={false}
                            mergeCells={purchaseData.length > 0 ? false : [{ row: 0, col: 1, rowspan: 1, colspan: 9 },]}
                            cells={function (row, col) {
                              var cp = {};

                              cp.className = "child";
                              if (
                                col == 7 ||
                                col == 10 ||
                                col == 11 ||
                                col == 12 ||
                                col == 13 ||
                                col == 14 ||
                                col == 15
                              ) {
                                cp.className = "text-end";
                              }
                              return cp;
                            }}
                            filters={true}
                            dropdownMenu={{
                              items: {
                                filter_by_value: {
                                  name: "Search Value",
                                  // hide the 'Filter by value' list from all columns but the first one
                                  hidden() {
                                    const hot = hotRef1?.current?.hotInstance;
                                    const selectedValue = this.getSelected()[0][1];
                                    // [3,6,8,12,13,14,15,16] wihtout Select option
                                    const isValidColumn = [3,6,8,9,10,11,12,13,14,15,16].includes(selectedValue);
                                    return isValidColumn;
                                  },
                                },

                                about: { // For CheckBox custom option

                                  name: `<div  style="margin-left:6px">Select Options<label class="float-end text-danger "><a><u id="selectAll">Select All</u></a></label></div> <div  class="checkboxmenu custom-scrollbar"> <div >  <table id="searchTable" >
                                  ${dropDonwNameTab2 &&
                                    dropDonwNameTab2?.map((index) => (
                                      `<tr><td><input class="checkBoxClass" type="checkbox" value="${index?.value}" /> <span class="fw-normal">${index?.label?.length > 20 ? index?.label?.substring(0, 20) + "..." : index?.label}</span> </td></tr>`
                                    )).join('')
                                    }
          
                                    </table></div>
                                    </div>`, // Name can contain HTML 
                                  hidden() {
                                    const selectedCol = this.getSelectedRangeLast().to.col;
                                    const isHiddenCol = ![9,10,11].includes(selectedCol);
          
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

                                option5: {
                                  name: `<div style="margin-top:10px"> From Date <br><input type='date' data-date="" data-date-format="DD MMMM YYYY" min='2017-07-01' max=${new Date()
                                    .toISOString()
                                    .slice(
                                      0,
                                      10
                                    )}  class='custom-date col-md-11' placeholder='DD-MM-YYYY' id='custom1' name='date' value=${searchDate} > <br/> 
                                      
                                      To Date <br><input type='date' data-date="" data-date-format="DD MMMM YYYY" min='2017-07-01' max=${new Date()
                                      .toISOString()
                                      .slice(
                                        0,
                                        10
                                      )}  class='custom-date col-md-11' placeholder='DD-MM-YYYY' id='custom2' name='date' value=${toDate} >
                                     </div> `,
                                  hidden() {
                                    return this.getSelectedRangeLast().to.col != 3;
                                  },
          
                                  //disabled: true,
                                  callback: function (key, selection, clickEvent) {
          
                                    console.log("date picker clicked");
                                    var src = clickEvent.target;
          
                                    if (src.tagName === "INPUT") {
                                      clickEvent.stopImmediatePropagation();
                                    }
          
                                    clickEvent.stopImmediatePropagation();
                                  },
                                },

                                option6: {
                                  name: `<div style="margin-top:10px"> From Date <br><input type='date' data-date="" data-date-format="DD MMMM YYYY" min='2017-07-01' max=${new Date()
                                    .toISOString()
                                    .slice(
                                      0,
                                      10
                                    )}  class='custom-date col-md-11' placeholder='DD-MM-YYYY' id='custom1' name='date' value=${searchDate1} > <br/> 
                                      
                                      To Date <br><input type='date' data-date="" data-date-format="DD MMMM YYYY" min='2017-07-01' max=${new Date()
                                      .toISOString()
                                      .slice(
                                        0,
                                        10
                                      )}  class='custom-date col-md-11' placeholder='DD-MM-YYYY' id='custom2' name='date' value=${searchDate1To} >
                                     </div> `,
                                  hidden() {
                                    return this.getSelectedRangeLast().to.col != 6;
                                  },
          
                                  //disabled: true,
                                  callback: function (key, selection, clickEvent) {
          
                                    console.log("date picker clicked");
                                    var src = clickEvent.target;
          
                                    if (src.tagName === "INPUT") {
                                      clickEvent.stopImmediatePropagation();
                                    }
          
                                    clickEvent.stopImmediatePropagation();
                                  },
                                },
                                option7: generateOption(8, fromAmount, toAmount),
                                option8: generateOption(12, fromAmountTaxable, toAmountTaxable),
                                option9: generateOption(13, fromAmountIGST, toAmountIGST),
                                option10: generateOption(14, fromAmountCGST, toAmountCGST),
                                option11: generateOption(15, fromAmountSGST, toAmountSGST),
                                option12: generateOption(16, fromAmountCESS, toAmountCESS),

                                clear: {
                                  name: `<button id='btnClear'  name='Clear' tabIndex="-1"   value='Clear'>Clear</button>`,
                                  
                                  callback: function (key, selection, clickEvent) {
          
                                    var src = clickEvent.target;
          
                                    if (src?.tagName?.toLowerCase() === "button") {
                                      if (clickEvent.target.id == "btnClear") {
                                        const hot = hotRef1?.current?.hotInstance;
                                        const selectedValue = hot?.getSelected()[0][1];
                                        const isValidTextColumn = [3,6,8,9,10,11,12,13,14,15,16].includes(selectedValue);
                                        const isValidCheckBoxColumn = [9,10,11].includes(selectedValue);

                                        if (!isValidTextColumn) {
                                          let x = searchVal1
                                          var value = "";
                                          var columnName = ITCrevisedColumns[currentCol1]?.data;
                                          let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                                          filterObject.push({ [columnName]: value });
                                          if (!searchVal1?.length) {
                                            x.push(value);
                                            let y = currentCol;
                                            y.push(
                                              ITCrevisedColumns[currentCol1]?.data
                                            );
                                            // console.log("jsx=",x,y)
                                            setSearchVal1(x);
                                            setCurrentCol(y);
                                          } else {
                                            const Index = currentCol?.findIndex(
                                              (item) =>
                                              ITCrevisedColumns[currentCol1]?.data ==
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
                                                ITCrevisedColumns[currentCol1]?.data
                                              );
                                              setSearchVal1(x);
                                              setCurrentCol(y);
                                            }
                                          }
                                          setPage(0);
                                          purchaseSummaryList(
                                            activeTab,
                                            "",
                                            "asc",
                                            invoceTypes?.value,
                                            finFromYear?.value,
                                            monthFrom?.value,
                                            "", 1
                                          );
                                        }

                                        else if (hot?.getSelected()[0][1] == 3) {
          
                                          var columnName = ITCrevisedColumns[currentCol1]?.data;
                                          var value = '';
                                          setSearchDate('');
                                          setToDate('');
                                          let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
          
                                          filterObject.push({ [columnName]: value });
                                          if (!searchVal1?.length) {
          
                                            x.push(value);
                                            let y = currentCol;
                                            y.push(
                                              ITCrevisedColumns[currentCol1]?.data
                                            );
                                            // console.log("jsx=",x,y)
                                            setSearchVal1(x);
                                            setCurrentCol(y);
                                          } else {
                    
                                            const Index = currentCol?.findIndex(
                                              (item) =>
                                              ITCrevisedColumns[currentCol1]?.data ==
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
                                                ITCrevisedColumns[currentCol1]?.data
                                              );
                                              setSearchVal1(x);
                                              setCurrentCol(y);
                                            }
                                          }
          
                                          setPage(0);
                                          purchaseSummaryList(
                                            activeTab,
                                            "",
                                            "asc",
                                            invoceTypes?.value,
                                            finFromYear?.value,
                                            monthFrom?.value,
                                            "", 1
                                          );
          
                                        }
                                        else if (hot?.getSelected()[0][1] == 6) {
          
                                          var columnName = ITCrevisedColumns[currentCol1]?.data;
                                          var value = '';
                                          setSearchDate1('');
                                          setSearchDate1To('');
                                          let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
          
                                          filterObject.push({ [columnName]: value });
                                          if (!searchVal1?.length) {
          
                                            x.push(value);
                                            let y = currentCol;
                                            y.push(
                                              ITCrevisedColumns[currentCol1]?.data
                                            );
                                            // console.log("jsx=",x,y)
                                            setSearchVal1(x);
                                            setCurrentCol(y);
                                          } else {
                    
                                            const Index = currentCol?.findIndex(
                                              (item) =>
                                              ITCrevisedColumns[currentCol1]?.data ==
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
                                                ITCrevisedColumns[currentCol1]?.data
                                              );
                                              setSearchVal1(x);
                                              setCurrentCol(y);
                                            }
                                          }
          
                                          setPage(0);
                                          purchaseSummaryList(
                                            activeTab,
                                            "",
                                            "asc",
                                            invoceTypes?.value,
                                            finFromYear?.value,
                                            monthFrom?.value,
                                            "", 1
                                          );
          
                                        }
                                        else if (hot?.getSelected()[0][1] == 8) {
                                          const x = searchVal1
                                          var columnName = ITCrevisedColumns[currentCol1]?.data;
                                          var value = '';
                                          setFromAmount('');
                                          setToAmount('');
          
                                          let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                          filterObject.push({ [columnName]: value });
                                          if (!searchVal1?.length) {
          
                                            x.push(value);
                                            let y = currentCol;
                                            y.push(
                                              ITCrevisedColumns[currentCol1]?.data
                                            );
                                            // console.log("jsx=",x,y)
                                            setSearchVal1(x);
                                            setCurrentCol(y);
                                          } else {
                    
                                            const Index = currentCol?.findIndex(
                                              (item) =>
                                              ITCrevisedColumns[currentCol1]?.data ==
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
                                                ITCrevisedColumns[currentCol1]?.data
                                              );
                                              setSearchVal1(x);
                                              setCurrentCol(y);
                                            }
                                          }
          
                                          setPage(0);
                                          purchaseSummaryList(
                                            activeTab,
                                            "",
                                            "asc",
                                            invoceTypes?.value,
                                            finFromYear?.value,
                                            monthFrom?.value,
                                            "", 1
                                          );
          
                                        }
                                        else if (hot?.getSelected()[0][1] == 12) {
                                          const x = searchVal1
                                          var columnName = ITCrevisedColumns[currentCol1]?.data;
                                          var value = '';
                                          setFromAmountTaxable('');
                                          setToAmountTaxable('');
          
                                          let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
          
                                          filterObject.push({ [columnName]: value });
                                          if (!searchVal1?.length) {
          
                                            x.push(value);
                                            let y = currentCol;
                                            y.push(
                                              ITCrevisedColumns[currentCol1]?.data
                                            );
                                            // console.log("jsx=",x,y)
                                            setSearchVal1(x);
                                            setCurrentCol(y);
                                          } else {
                    
                                            const Index = currentCol?.findIndex(
                                              (item) =>
                                              ITCrevisedColumns[currentCol1]?.data ==
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
                                                ITCrevisedColumns[currentCol1]?.data
                                              );
                                              setSearchVal1(x);
                                              setCurrentCol(y);
                                            }
                                          }
          
                                          setPage(0);
                                          purchaseSummaryList(
                                            activeTab,
                                            "",
                                            "asc",
                                            invoceTypes?.value,
                                            finFromYear?.value,
                                            monthFrom?.value,
                                            "", 1
                                          );
          
                                        }
                                        else if (hot?.getSelected()[0][1] == 13) {
                                          const x = searchVal1
                                          var columnName = ITCrevisedColumns[currentCol1]?.data;
                                          var value = '';
                                          setFromAmountIGST('');
                                          setToAmountIGST('');
          
                                          let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
          
                                          filterObject.push({ [columnName]: value });
                                          if (!searchVal1?.length) {
          
                                            x.push(value);
                                            let y = currentCol;
                                            y.push(
                                              ITCrevisedColumns[currentCol1]?.data
                                            );
                                            // console.log("jsx=",x,y)
                                            setSearchVal1(x);
                                            setCurrentCol(y);
                                          } else {
                    
                                            const Index = currentCol?.findIndex(
                                              (item) =>
                                              ITCrevisedColumns[currentCol1]?.data ==
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
                                                ITCrevisedColumns[currentCol1]?.data
                                              );
                                              setSearchVal1(x);
                                              setCurrentCol(y);
                                            }
                                          }
          
                                          setPage(0);
                                          purchaseSummaryList(
                                            activeTab,
                                            "",
                                            "asc",
                                            invoceTypes?.value,
                                            finFromYear?.value,
                                            monthFrom?.value,
                                            "", 1
                                          );
          
                                        }
                                        else if (hot?.getSelected()[0][1] == 14) {
                                          const x = searchVal1
                                          var columnName = ITCrevisedColumns[currentCol1]?.data;
                                          var value = '';
                                          setFromAmountCGST('');
                                          setToAmountCGST('');
          
                                          let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
          
                                          filterObject.push({ [columnName]: value });
                                          if (!searchVal1?.length) {
          
                                            x.push(value);
                                            let y = currentCol;
                                            y.push(
                                              ITCrevisedColumns[currentCol1]?.data
                                            );
                                            // console.log("jsx=",x,y)
                                            setSearchVal1(x);
                                            setCurrentCol(y);
                                          } else {
                    
                                            const Index = currentCol?.findIndex(
                                              (item) =>
                                              ITCrevisedColumns[currentCol1]?.data ==
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
                                                ITCrevisedColumns[currentCol1]?.data
                                              );
                                              setSearchVal1(x);
                                              setCurrentCol(y);
                                            }
                                          }
          
                                          setPage(0);
                                          purchaseSummaryList(
                                            activeTab,
                                            "",
                                            "asc",
                                            invoceTypes?.value,
                                            finFromYear?.value,
                                            monthFrom?.value,
                                            "", 1
                                          );
          
                                        }
                                        else if (hot?.getSelected()[0][1] == 15) {
                                          const x = searchVal1
                                          var columnName = ITCrevisedColumns[currentCol1]?.data;
                                          var value = '';
                                          setFromAmountSGST('');
                                          setToAmountSGST('');
          
                                          let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
          
                                          filterObject.push({ [columnName]: value });
                                          if (!searchVal1?.length) {
          
                                            x.push(value);
                                            let y = currentCol;
                                            y.push(
                                              ITCrevisedColumns[currentCol1]?.data
                                            );
                                            // console.log("jsx=",x,y)
                                            setSearchVal1(x);
                                            setCurrentCol(y);
                                          } else {
                    
                                            const Index = currentCol?.findIndex(
                                              (item) =>
                                              ITCrevisedColumns[currentCol1]?.data ==
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
                                                ITCrevisedColumns[currentCol1]?.data
                                              );
                                              setSearchVal1(x);
                                              setCurrentCol(y);
                                            }
                                          }
          
                                          setPage(0);
                                          purchaseSummaryList(
                                            activeTab,
                                            "",
                                            "asc",
                                            invoceTypes?.value,
                                            finFromYear?.value,
                                            monthFrom?.value,
                                            "", 1
                                          );
          
                                        }
                                        else if (hot?.getSelected()[0][1] == 16) {
                                          const x = searchVal1
                                          var columnName = ITCrevisedColumns[currentCol1]?.data;
                                          var value = '';
                                          setFromAmountCESS('');
                                          setToAmountCESS('');
          
                                          let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
          
                                          filterObject.push({ [columnName]: value });
                                          if (!searchVal1?.length) {
          
                                            x.push(value);
                                            let y = currentCol;
                                            y.push(
                                              ITCrevisedColumns[currentCol1]?.data
                                            );
                                            // console.log("jsx=",x,y)
                                            setSearchVal1(x);
                                            setCurrentCol(y);
                                          } else {
                    
                                            const Index = currentCol?.findIndex(
                                              (item) =>
                                              ITCrevisedColumns[currentCol1]?.data ==
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
                                                ITCrevisedColumns[currentCol1]?.data
                                              );
                                              setSearchVal1(x);
                                              setCurrentCol(y);
                                            }
                                          }
          
                                          setPage(0);
                                          purchaseSummaryList(
                                            activeTab,
                                            "",
                                            "asc",
                                            invoceTypes?.value,
                                            finFromYear?.value,
                                            monthFrom?.value,
                                            "", 1
                                          );
          
                                        }
                                        else if (isValidCheckBoxColumn) {
                                          let x = searchVal1
                                          var checkboxes = document.getElementsByClassName('checkBoxClass');
                                          arrChk = []
                                          setFilterDropDownList([]);
                                          var columnName = ITCrevisedColumns[currentCol1]?.data;
                                          let filterObject2 = !gridCustomFilter ? [] : gridCustomFilter
                                          let filterObject = []
                                          filterObject2 = filterObject2 == null || filterObject2.length <= 0 ? [] : filterObject2;
          
                                          for (let i = 0; i < checkboxes.length; i++) {
                                            if (checkboxes[i].checked) {
                                            //   arrChk.push({ [columnName]: checkboxes[i].value });
                                            //   filterObject2.push({ [columnName]: checkboxes[i].value });
                                            //   filterObject.push(checkboxes[i].value);
                                            // } else {
                                              console.log("else is running")
                                              let uniqueArray = filterObject.filter((obj, index, self) =>
                                                index === self.findIndex((t) => (
                                                  JSON.stringify(t) === JSON.stringify(obj)
                                                ))
                                              );
                                              let uniqueArray2 = filterObject2.filter((obj, index, self) =>
                                              index === self.findIndex((t) => (
                                                JSON.stringify(t) === JSON.stringify(obj)
                                              ))
                                            );
                                              console.log(uniqueArray,"uniqArray")
                                              filterObject2 = uniqueArray2
                                              const index = filterObject.findIndex(obj => obj[columnName] === checkboxes[i].value);
                                              const index1 = filterObject2.findIndex(obj => obj[columnName] === checkboxes[i].value);
                                              if (index !== -1 || index1 !== -1)   {
                    
                                                // delete filterObject[index1][columnName];
                                                delete filterObject2[index1][columnName];
                                              }
                                            }
                                          }
                                          setGridCustomFilter(filterObject2)
                                          var value = ""
                                          if (!searchVal1?.length) {
                                            x.push(value);
                                            let y = currentCol;
                                            y.push(
                                              ITCrevisedColumns[currentCol1]?.data
                                            );
                                            setSearchVal1(x);
                                            setCurrentCol(y);
                                          } else{
                                            const Index = currentCol?.findIndex(
                                              (item) =>
                                              ITCrevisedColumns[currentCol1]?.data ==
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
                                                ITCrevisedColumns[currentCol1]?.data
                                              );
                                              setSearchVal1(x);
                                              setCurrentCol(y);
                                            }
                                            
                                          }
                                          setPage(0);
                                          purchaseSummaryList(
                                            activeTab,
                                            "",
                                            "asc",
                                            invoceTypes?.value,
                                            finFromYear?.value,
                                            monthFrom?.value,
                                            "", 1
                                          );
                                          
          
                                          const updatedFilterDropDownList = filterObject2.reduce((acc, item) => {
                                            const { rate,sezSupplier, placeOfSupply  } = item;
          
                                            const updateList = (list, value) => {
                                              return list.includes(value) ? list : [...list, value];
                                            };
          
                                            if (rate !== undefined) {
                                              acc.rateDropDownList = updateList(acc.rateDropDownList, rate);
                                            }  else if (sezSupplier !== undefined) {
                                              acc.sezDropDownList = updateList(acc.sezDropDownList, sezSupplier);
                                            } else if (placeOfSupply !== undefined) {
                                              acc.posDropDownList = updateList(acc.posDropDownList, placeOfSupply);
                                            } 
          
                                            return acc;
                                          }, { rateDropDownList: [], sezDropDownList: [],  posDropDownList: []});
          
                                          setFilterDropDownList(updatedFilterDropDownList);
          
                                        }
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
                                rateDropDownList,
                                sezDropDownList,
                                posDropDownList,
                              } = filterDropDownList;
          
                              const listsToCheck = [
                                rateDropDownList,
                                sezDropDownList,
                                posDropDownList,
                              ];
          
                              for (var j = 0; j < checkboxes.length; j++) {
                                for (var k = 0; k < listsToCheck.length; k++) {
                                  if (listsToCheck[k]) {
                                    // For rcmDropDownList, check both conditions listsToCheck[k][i] == checkboxes[j].value and checkboxes?.length == 2
                                    if (k === 0 && checkboxes.length === 13) {
          
                                      for (var i = 0; i < listsToCheck[k].length; i++) {
                                        if (listsToCheck[k][i] == checkboxes[j].value) {
                                          $(checkboxes[j]).prop("checked", true);
                                          break;
                                        }
                                      }
                                    } else if (k === 1 && checkboxes.length === 2) {
          
                                      for (var i = 0; i < listsToCheck[k].length; i++) {
                                        if (listsToCheck[k][i] == checkboxes[j].value) {
                                          $(checkboxes[j]).prop("checked", true);
                                          break;
                                        }
                                      }
                                    }
                                    else {
          
                                      for (var i = 0; i < listsToCheck[k].length; i++) {
                                        if (listsToCheck[k][i] == checkboxes[j].value && k !== 0 && k !== 1) {
                                          $(checkboxes[j]).prop("checked", true);
                                          break;
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }}

                            afterFilter={function (data) {
                              const hot = hotRef1?.current?.hotInstance;
                              const selectedValuecol = hot?.getSelected()[0][1];
                              const shouldExcludeTextBox = [3,6,8,9,10,11,12,13,14,15,16].includes(selectedValuecol);
                              const shouldExcludeCheckBox = [9,10,11].includes(selectedValuecol);
                              if (!shouldExcludeTextBox) {
                                let x = searchVal1
                                var searchInput = document.querySelector(".htUIMultipleSelectSearch.htUIInput");
                                var value = searchInput?.children[0].value;
                                //  x.push(value)
                                var columnName = ITCrevisedColumns[currentCol1]?.data;
                                let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
          
                                filterObject.push({ [columnName]: value });
          
                                // setSearchVal1(x);
                                // let y = currentCol;
                                // y.push(handsontableColumns[currentCol1]?.data);
          
                                // setCurrentCol(y)\
                                if (!searchVal1?.length) {
          
                                  x.push(value);
                                  let y = currentCol;
                                  y.push(
                                    ITCrevisedColumns[currentCol1]?.data
                                  );
                                  // console.log("jsx=",x,y)
                                  setSearchVal1(x);
                                  setCurrentCol(y);
                                } else {
          
                                  const Index = currentCol?.findIndex(
                                    (item) =>
                                    ITCrevisedColumns[currentCol1]?.data ==
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
                                      ITCrevisedColumns[currentCol1]?.data
                                    );
                                    setSearchVal1(x);
                                    setCurrentCol(y);
                                  }
                                }

                                setPage(0);
                                purchaseSummaryList(
                                  activeTab,
                                  "",
                                  "asc",
                                  invoceTypes?.value,
                                  finFromYear?.value,
                                  monthFrom?.value,
                                  "", 1
                                );
          
                                // setGridCustomFilter(filterObject)
                                // let newFilterData = FilterData(filterObject);
                                // setData([...newFilterData]);
          
                              }
                              else if (selectedValuecol == 3) {
                                const x = searchVal1
                                var searchInput1 = document.getElementById("custom1");
                                var searchInput2 = document.getElementById("custom2");
                                const invFromDate = searchInput1?.value
                                const invToDate = searchInput2?.value
                                var columnName = ITCrevisedColumns[currentCol1]?.data;
                                var value = (searchInput1?.value || searchInput2?.value) && `${invFromDate ? invFromDate : invToDate}to${invToDate ? invToDate : invFromDate}`;
                                setSearchDate(searchInput1?.value);
                                setToDate(searchInput2?.value);
                                let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                filterObject.push({ [columnName]: value });
                                if (!searchVal1?.length) {
          
                                  x.push(value);
                                  let y = currentCol;
                                  y.push(
                                    ITCrevisedColumns[currentCol1]?.data
                                  );
                                  // console.log("jsx=",x,y)
                                  setSearchVal1(x);
                                  setCurrentCol(y);
                                } else {
          
                                  const Index = currentCol?.findIndex(
                                    (item) =>
                                    ITCrevisedColumns[currentCol1]?.data ==
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
                                      ITCrevisedColumns[currentCol1]?.data
                                    );
                                    setSearchVal1(x);
                                    setCurrentCol(y);
                                  }
                                }

                                setPage(0);
                                purchaseSummaryList(
                                  activeTab,
                                  "",
                                  "asc",
                                  invoceTypes?.value,
                                  finFromYear?.value,
                                  monthFrom?.value,
                                  "", 1
                                );
          
                              }

                              else if (selectedValuecol == 6) {
                                const x = searchVal1
                                var searchInput1 = document.getElementById("custom1");
                                var searchInput2 = document.getElementById("custom2");
                                const invFromDate = searchInput1?.value
                                const invToDate = searchInput2?.value
                                var columnName = ITCrevisedColumns[currentCol1]?.data;
                                var value = (searchInput1?.value || searchInput2?.value) && `${invFromDate ? invFromDate : invToDate}to${invToDate ? invToDate : invFromDate}`;
                                setSearchDate1(searchInput1?.value);
                                setSearchDate1To(searchInput2?.value);
                                let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                filterObject.push({ [columnName]: value });
                                if (!searchVal1?.length) {
          
                                  x.push(value);
                                  let y = currentCol;
                                  y.push(
                                    ITCrevisedColumns[currentCol1]?.data
                                  );
                                  // console.log("jsx=",x,y)
                                  setSearchVal1(x);
                                  setCurrentCol(y);
                                } else {
          
                                  const Index = currentCol?.findIndex(
                                    (item) =>
                                    ITCrevisedColumns[currentCol1]?.data ==
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
                                      ITCrevisedColumns[currentCol1]?.data
                                    );
                                    setSearchVal1(x);
                                    setCurrentCol(y);
                                  }
                                }

                                setPage(0);
                                purchaseSummaryList(
                                  activeTab,
                                  "",
                                  "asc",
                                  invoceTypes?.value,
                                  finFromYear?.value,
                                  monthFrom?.value,
                                  "", 1
                                );
          
                              }
          
                              else if (hot?.getSelected()[0][1] == 8) {
                                const x = searchVal1
                                var searchInput1 = document.getElementById("amount1");
                                var searchInput2 = document.getElementById("amount2");
                                const invFromDate = searchInput1?.value?.replaceAll(",", "")
                                const invToDate = searchInput2?.value?.replaceAll(",", "")
                                var columnName = ITCrevisedColumns[currentCol1]?.data;
                                // var value = (searchInput1?.value || searchInput2?.value) && `${invFromDate ? invFromDate : invToDate}to${invToDate ? invToDate : invFromDate}`;
                                var value = `${invFromDate}to${invToDate}`;
                                console.log(value,"wwwweeee")
                                setFromAmount(searchInput1?.value);
                                setToAmount(searchInput2?.value);
                                let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                filterObject.push({ [columnName]: value });
                                if (!searchVal1?.length) {
          
                                  x.push(value);
                                  let y = currentCol;
                                  y.push(
                                    ITCrevisedColumns[currentCol1]?.data
                                  );
                                  // console.log("jsx=",x,y)
                                  setSearchVal1(x);
                                  setCurrentCol(y);
                                } else {
          
                                  const Index = currentCol?.findIndex(
                                    (item) =>
                                    ITCrevisedColumns[currentCol1]?.data ==
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
                                      ITCrevisedColumns[currentCol1]?.data
                                    );
                                    setSearchVal1(x);
                                    setCurrentCol(y);
                                  }
                                }

                                setPage(0);
                                purchaseSummaryList(
                                  activeTab,
                                  "",
                                  "asc",
                                  invoceTypes?.value,
                                  finFromYear?.value,
                                  monthFrom?.value,
                                  "", 1
                                );
          
                              }
          
                              else if (hot?.getSelected()[0][1] ==12) {
                                const x = searchVal1
                                var searchInput1 = document.getElementById("amount1");
                                var searchInput2 = document.getElementById("amount2");
                                const invFromDate = searchInput1?.value?.replaceAll(",", "")
                                const invToDate = searchInput2?.value?.replaceAll(",", "")
                                var columnName = ITCrevisedColumns[currentCol1]?.data;
                                // var value = (searchInput1?.value || searchInput2?.value) && `${invFromDate ? invFromDate : invToDate}to${invToDate ? invToDate : invFromDate}`;
                                var value = `${invFromDate}to${invToDate}`;
                                setFromAmountTaxable(searchInput1?.value);
                                setToAmountTaxable(searchInput2?.value);
                                let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
          
                                filterObject.push({ [columnName]: value });
                                if (!searchVal1?.length) {
          
                                  x.push(value);
                                  let y = currentCol;
                                  y.push(
                                    ITCrevisedColumns[currentCol1]?.data
                                  );
                                  // console.log("jsx=",x,y)
                                  setSearchVal1(x);
                                  setCurrentCol(y);
                                } else {
          
                                  const Index = currentCol?.findIndex(
                                    (item) =>
                                    ITCrevisedColumns[currentCol1]?.data ==
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
                                      ITCrevisedColumns[currentCol1]?.data
                                    );
                                    setSearchVal1(x);
                                    setCurrentCol(y);
                                  }
                                }

                                setPage(0);
                                purchaseSummaryList(
                                  activeTab,
                                  "",
                                  "asc",
                                  invoceTypes?.value,
                                  finFromYear?.value,
                                  monthFrom?.value,
                                  "", 1
                                );
          
                              }
          
                              else if (hot?.getSelected()[0][1] == 13) {
                                const x = searchVal1
                                var searchInput1 = document.getElementById("amount1");
                                var searchInput2 = document.getElementById("amount2");
                                const fromAmount = searchInput1?.value?.replaceAll(",", "")
                                const toAmount = searchInput2?.value?.replaceAll(",", "")
                                var columnName = ITCrevisedColumns[currentCol1]?.data;
                                // var value = (searchInput1?.value || searchInput2?.value) && `${fromAmount ? fromAmount : toAmount}to${toAmount ? toAmount : fromAmount}`;
                                var value = `${fromAmount}to${toAmount}`;
                                setFromAmountIGST(searchInput1?.value);
                                setToAmountIGST(searchInput2?.value);
                                let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                filterObject.push({ [columnName]: value });
                                if (!searchVal1?.length) {
          
                                  x.push(value);
                                  let y = currentCol;
                                  y.push(
                                    ITCrevisedColumns[currentCol1]?.data
                                  );
                                  // console.log("jsx=",x,y)
                                  setSearchVal1(x);
                                  setCurrentCol(y);
                                } else {
          
                                  const Index = currentCol?.findIndex(
                                    (item) =>
                                    ITCrevisedColumns[currentCol1]?.data ==
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
                                      ITCrevisedColumns[currentCol1]?.data
                                    );
                                    setSearchVal1(x);
                                    setCurrentCol(y);
                                  }
                                }

                                setPage(0);
                                purchaseSummaryList(
                                  activeTab,
                                  "",
                                  "asc",
                                  invoceTypes?.value,
                                  finFromYear?.value,
                                  monthFrom?.value,
                                  "", 1
                                );
          
                              }
          
                              else if (hot?.getSelected()[0][1] == 14) {
                                const x = searchVal1
                                var searchInput1 = document.getElementById("amount1");
                                var searchInput2 = document.getElementById("amount2");
                                const fromAmount = searchInput1?.value?.replaceAll(",", "")
                                const toAmount = searchInput2?.value?.replaceAll(",", "")
                                var columnName = ITCrevisedColumns[currentCol1]?.data;
                                // var value = (searchInput1?.value || searchInput2?.value) && `${fromAmount ? fromAmount : toAmount}to${toAmount ? toAmount : fromAmount}`;
                                var value = `${fromAmount}to${toAmount}`;
                                setFromAmountCGST(searchInput1?.value);
                                setToAmountCGST(searchInput2?.value);
                                let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                filterObject.push({ [columnName]: value });
                                if (!searchVal1?.length) {
          
                                  x.push(value);
                                  let y = currentCol;
                                  y.push(
                                    ITCrevisedColumns[currentCol1]?.data
                                  );
                                  // console.log("jsx=",x,y)
                                  setSearchVal1(x);
                                  setCurrentCol(y);
                                } else {
          
                                  const Index = currentCol?.findIndex(
                                    (item) =>
                                    ITCrevisedColumns[currentCol1]?.data ==
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
                                      ITCrevisedColumns[currentCol1]?.data
                                    );
                                    setSearchVal1(x);
                                    setCurrentCol(y);
                                  }
                                }

                                setPage(0);
                                purchaseSummaryList(
                                  activeTab,
                                  "",
                                  "asc",
                                  invoceTypes?.value,
                                  finFromYear?.value,
                                  monthFrom?.value,
                                  "", 1
                                );
          
                              }
          
                              else if (hot?.getSelected()[0][1] == 15) {
                                const x =  searchVal1
                                var searchInput1 = document.getElementById("amount1");
                                var searchInput2 = document.getElementById("amount2");
                                const fromAmount = searchInput1?.value?.replaceAll(",", "")
                                const toAmount = searchInput2?.value?.replaceAll(",", "")
                                var columnName = ITCrevisedColumns[currentCol1]?.data;
                                // var value = (searchInput1?.value || searchInput2?.value) && `${fromAmount ? fromAmount : toAmount}to${toAmount ? toAmount : fromAmount}`;
                                var value = `${fromAmount}to${toAmount}`;
                                setFromAmountSGST(searchInput1?.value);
                                setToAmountSGST(searchInput2?.value);
                                let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                filterObject.push({ [columnName]: value });
                                if (!searchVal1?.length) {
          
                                  x.push(value);
                                  let y = currentCol;
                                  y.push(
                                    ITCrevisedColumns[currentCol1]?.data
                                  );
                                  // console.log("jsx=",x,y)
                                  setSearchVal1(x);
                                  setCurrentCol(y);
                                } else {
          
                                  const Index = currentCol?.findIndex(
                                    (item) =>
                                    ITCrevisedColumns[currentCol1]?.data ==
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
                                      ITCrevisedColumns[currentCol1]?.data
                                    );
                                    setSearchVal1(x);
                                    setCurrentCol(y);
                                  }
                                }

                                setPage(0);
                                purchaseSummaryList(
                                  activeTab,
                                  "",
                                  "asc",
                                  invoceTypes?.value,
                                  finFromYear?.value,
                                  monthFrom?.value,
                                  "", 1
                                );
          
                              }
          
                              else if (hot?.getSelected()[0][1] == 16) {
                                const x = searchVal1
                                var searchInput1 = document.getElementById("amount1");
                                var searchInput2 = document.getElementById("amount2");
                                const fromAmount = searchInput1?.value?.replaceAll(",", "")
                                const toAmount = searchInput2?.value?.replaceAll(",", "")
                                var columnName = ITCrevisedColumns[currentCol1]?.data;
                                // var value = (searchInput1?.value || searchInput2?.value) && `${fromAmount ? fromAmount : toAmount}to${toAmount ? toAmount : fromAmount}`;
                                var value = `${fromAmount}to${toAmount}`;
                                setFromAmountCESS(searchInput1?.value);
                                setToAmountCESS(searchInput2?.value);
                                let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                filterObject.push({ [columnName]: value });
                                
                                if (!searchVal1?.length) {
          
                                  x.push(value);
                                  let y = currentCol;
                                  y.push(
                                    ITCrevisedColumns[currentCol1]?.data
                                  );
                                  // console.log("jsx=",x,y)
                                  setSearchVal1(x);
                                  setCurrentCol(y);
                                } else {
          
                                  const Index = currentCol?.findIndex(
                                    (item) =>
                                    ITCrevisedColumns[currentCol1]?.data ==
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
                                      ITCrevisedColumns[currentCol1]?.data
                                    );
                                    setSearchVal1(x);
                                    setCurrentCol(y);
                                  }
                                }

                                setPage(0);
                                purchaseSummaryList(
                                  activeTab,
                                  "",
                                  "asc",
                                  invoceTypes?.value,
                                  finFromYear?.value,
                                  monthFrom?.value,
                                  "", 1
                                );
          
                              }
          
                              else if (shouldExcludeCheckBox) {
                                let x =  searchVal1
                                var checkboxes = document.getElementsByClassName('checkBoxClass');
                                arrChk = []
                                setFilterDropDownList([]);
                                var columnName = ITCrevisedColumns[currentCol1]?.data;
                                let filterObject2 = !gridCustomFilter ? [] : gridCustomFilter
                                let filterObject = []
                                filterObject2 = filterObject2 == null || filterObject2.length <= 0 ? [] : filterObject2;
          
                                for (let i = 0; i < checkboxes.length; i++) {
                                  if (checkboxes[i].checked) {
                                    arrChk.push({ [columnName]: checkboxes[i].value });
                                    filterObject2.push({ [columnName]: checkboxes[i].value });
                                    filterObject.push(checkboxes[i].value);
                                  } else {
                                    console.log("else is running")
                                    let uniqueArray = filterObject.filter((obj, index, self) =>
                                      index === self.findIndex((t) => (
                                        JSON.stringify(t) === JSON.stringify(obj)
                                      ))
                                    );
                                    let uniqueArray2 = filterObject2.filter((obj, index, self) =>
                                    index === self.findIndex((t) => (
                                      JSON.stringify(t) === JSON.stringify(obj)
                                    ))
                                  );
                                    console.log(uniqueArray,"uniqArray")
                                    filterObject2 = uniqueArray2
                                    const index = filterObject.findIndex(obj => obj[columnName] === checkboxes[i].value);
                                    const index1 = filterObject2.findIndex(obj => obj[columnName] === checkboxes[i].value);
                                    if (index !== -1 || index1 !== -1)   {
          
                                      // delete filterObject[index1][columnName];
                                      delete filterObject2[index1][columnName];
                                    }
                                  }
                                }
                                
                                setGridCustomFilter(filterObject2)
                                var value = filterObject?.join("@#@#")
                                if (!searchVal1?.length) {
                                  x.push(value);
                                  let y = currentCol;
                                  y.push(
                                    ITCrevisedColumns[currentCol1]?.data
                                  );
                                  setSearchVal1(x);
                                  setCurrentCol(y);
                                } else{
                                  const Index = currentCol?.findIndex(
                                    (item) =>
                                    ITCrevisedColumns[currentCol1]?.data ==
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
                                      ITCrevisedColumns[currentCol1]?.data
                                    );
                                    setSearchVal1(x);
                                    setCurrentCol(y);
                                  }
                                  
                                }
                                setPage(0);
                                purchaseSummaryList(
                                  activeTab,
                                  "",
                                  "asc",
                                  invoceTypes?.value,
                                  finFromYear?.value,
                                  monthFrom?.value,
                                  "", 1
                                );
          
                                const updatedFilterDropDownList = filterObject2.reduce((acc, item) => {
                                  const { rate,sezSupplier, placeOfSupply  } = item;

                                  const updateList = (list, value) => {
                                    return list.includes(value) ? list : [...list, value];
                                  };

                                  if (rate !== undefined) {
                                    acc.rateDropDownList = updateList(acc.rateDropDownList, rate);
                                  }  else if (sezSupplier !== undefined) {
                                    acc.sezDropDownList = updateList(acc.sezDropDownList, sezSupplier);
                                  } else if (placeOfSupply !== undefined) {
                                    acc.posDropDownList = updateList(acc.posDropDownList, placeOfSupply);
                                  } 

                                  return acc;
                                }, { rateDropDownList: [], sezDropDownList: [],  posDropDownList: []});

                                setFilterDropDownList(updatedFilterDropDownList);
          
                              }
                            }}
                          />

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
                                // styles={customStyles}
                                />) : (<></>)}
                                &nbsp; &nbsp;
                                {purchaseData?.length ? ( <span  >
                                  <b>  { ` ${pageNoTitle}`}</b>
                                </span>) : <></>}
                                &nbsp; &nbsp;
                                <ReactPaginate
                                  breakLabel="..."
                                  nextLabel=""
                                  onPageChange={(e) => handlePageClick(e?.selected)}
                                  pageRangeDisplayed={2}
                                  pageCount={pageCount}
                                  previousLabel=""
                                  renderOnZeroPageCount={null}
                                  marginPagesDisplayed={2}
                                  forcePage={page}
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
                        {/* {purchaseData && (
                          <ReactPaginate
                            breakLabel="..."
                            nextLabel=""
                            onPageChange={(e) => handlePageClick(e?.selected)}
                            pageRangeDisplayed={2}
                            pageCount={pageCount}
                            previousLabel=""
                            renderOnZeroPageCount={null}
                            marginPagesDisplayed={2}
                            forcePage={page}
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
                        )} */}
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </TabPane>
            </TabPane>

            {/* CDN*/}
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
                                Invoices <br />
                                <span>{totalInvoice ? totalInvoice : 0}</span>
                              </p>
                            </td>

                            <td>
                              <p className="mb-0">
                                {" "}
                                Invoice Values (₹)
                                <br />
                                <span>
                                  {totalInvoiceValue ? totalInvoiceValue : 0}
                                </span>
                              </p>
                            </td>
                            <td>
                              <p className="mb-0">
                                Taxable Values{"  "} (₹)
                                <br />
                                <span>
                                  {totalTaxableValue ? totalTaxableValue : 0}
                                </span>
                              </p>
                            </td>

                            <td>
                              <p className="mb-0">
                                IGST (₹)
                                <br />
                                <span>{totalIGST ? totalIGST : 0}</span>
                              </p>
                            </td>
                            <td>
                              <p className="mb-0">
                                SGST (₹)
                                <br />
                                <span>{totalSGST ? totalSGST : 0}</span>
                              </p>
                            </td>
                            <td>
                              <p className="mb-0">
                                CGST (₹)
                                <br />
                                <span>{totalCGST ? totalCGST : 0}</span>
                              </p>
                            </td>
                            <td>
                              <p className="mb-0">
                                Cess (₹)
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
                        <Col sm={6}>
                          <Label className="form-label">Invoice Type</Label>
                          <Select
                            id="purchaseId_invtype"
                            placeholder="Invoice Type"
                            theme={selectThemeColors}
                            // closeMenuOnSelect={false}
                            components={animatedComponents}
                            //  isMulti
                            options={b2csInvoiceTypeList}
                            isDisabled={true}
                            value={{ label: "CDN", value: "cdn" }}
                            // className="basic-multi-select"
                            classNamePrefix="select"
                            onChange={filterInvoiceTypeB2cs}
                            //onChange={setInvoceTypes}
                          />
                        </Col>
                        <Col sm={6}>
                          <Label className="form-label">
                             Return Period
                          </Label>
                          <Select
                            id="from"
                            placeholder="From"
                            isClearable={false}
                            theme={selectThemeColors}
                            closeMenuOnSelect={true}
                            options={panDataFrom}
                            isDisabled={true}
                            // options={panData}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            components={animatedComponents}
                            onChange={selectFromYear}
                            value={finFromYear}
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
                        {/* {purchaseData.length > 0 ? ( */}
                          <HotTable
                            autoWrapRow={true}
                            style={purchaseData.length > 0 ? "" : { textAlign: "center", overflowX: "hidden" }}
                            data={purchaseData.length > 0 ? purchaseData : [{ supplierGSTIN: "No Data Found" }] }
                            rowHeights={RowSize}
                            viewportColumnRenderingOffset={100}
                            columnHeaderHeight={columnHeaderSize}
                            autoColumnSize={true}
                            stretchH="all"
                            colHeaders={colHeaders}
                            afterGetColHeader={theaderCdn}
                            preventOverflow="horizontal"
                            columns={purchaseData.length > 0 ? cdnColumns : cdnColumnsEmpty}
                            contextMenu={false}
                            bindRowsWithHeaders={true}
                            licenseKey="non-commercial-and-evaluation"
                            height="auto"
                            ref={hotRef2}
                            afterOnCellMouseDown={localAfterOnCellMouseDown3}
                            mergeCells={purchaseData.length > 0 ? false : [{ row: 0, col: 1, rowspan: 1, colspan: 12 }]}
                            hiddenColumns={false}
                            cells={function (row, col) {
                              var cp = {};
                              const hot = hotRef2?.current?.hotInstance;
                              cp.className = "child";
                              if (col > 0) {
                                cp.className = "text-end";
                              }

                              return cp;
                            }}
                            filters={true}
                            dropdownMenu={{
                              items: {
                                filter_by_value: {
                                  name: "Search Value",
                                  // hide the 'Filter by value' list from all columns but the first one
                                  hidden() {
                                    const hot = hotRef2?.current?.hotInstance;
                                    const selectedValue = this.getSelected()[0][1];
                                    // [5,6,8,12,13,14,15,16] wihtout Select option
                                    const isValidColumn = [3,5,6,8,9,10,11,12,13,14,15,16].includes(selectedValue);
                                    return isValidColumn;
                                  },
                                },

                                about: { // For CheckBox custom option

                                  name: `<div  style="margin-left:6px">Select Options<label class="float-end text-danger "><a><u id="selectAll">Select All</u></a></label></div> <div  class="checkboxmenu custom-scrollbar"> <div >  <table id="searchTable" >
                                  ${dropDonwNameTab3 &&
                                    dropDonwNameTab3?.map((index) => (
                                      `<tr><td><input class="checkBoxClass" type="checkbox" value="${index?.value}" /> <span class="fw-normal">${index?.label?.length > 20 ? index?.label?.substring(0, 20) + "..." : index?.label}</span> </td></tr>`
                                    )).join('')
                                    }
          
                                    </table></div>
                                    </div>`, // Name can contain HTML 
                                  hidden() {
                                    const selectedCol = this.getSelectedRangeLast().to.col;
                                    const isHiddenCol = ![3,9,10,11].includes(selectedCol);
          
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

                                option5: {
                                  name: `<div style="margin-top:10px"> From Date <br><input type='date' data-date="" data-date-format="DD MMMM YYYY" min='2017-07-01' max=${new Date()
                                    .toISOString()
                                    .slice(
                                      0,
                                      10
                                    )}  class='custom-date col-md-11' placeholder='DD-MM-YYYY' id='custom1' name='date' value=${searchDate} > <br/> 
                                      
                                      To Date <br><input type='date' data-date="" data-date-format="DD MMMM YYYY" min='2017-07-01' max=${new Date()
                                      .toISOString()
                                      .slice(
                                        0,
                                        10
                                      )}  class='custom-date col-md-11' placeholder='DD-MM-YYYY' id='custom2' name='date' value=${toDate} >
                                     </div> `,
                                  hidden() {
                                    return this.getSelectedRangeLast().to.col != 5;
                                  },
          
                                  //disabled: true,
                                  callback: function (key, selection, clickEvent) {
          
                                    console.log("date picker clicked");
                                    var src = clickEvent.target;
          
                                    if (src.tagName === "INPUT") {
                                      clickEvent.stopImmediatePropagation();
                                    }
          
                                    clickEvent.stopImmediatePropagation();
                                  },
                                },

                                option6: {
                                  name: `<div style="margin-top:10px"> From Date <br><input type='date' data-date="" data-date-format="DD MMMM YYYY" min='2017-07-01' max=${new Date()
                                    .toISOString()
                                    .slice(
                                      0,
                                      10
                                    )}  class='custom-date col-md-11' placeholder='DD-MM-YYYY' id='custom1' name='date' value=${searchDate1} > <br/> 
                                      
                                      To Date <br><input type='date' data-date="" data-date-format="DD MMMM YYYY" min='2017-07-01' max=${new Date()
                                      .toISOString()
                                      .slice(
                                        0,
                                        10
                                      )}  class='custom-date col-md-11' placeholder='DD-MM-YYYY' id='custom2' name='date' value=${searchDate1To} >
                                     </div> `,
                                  hidden() {
                                    return this.getSelectedRangeLast().to.col != 8;
                                  },
          
                                  //disabled: true,
                                  callback: function (key, selection, clickEvent) {
          
                                    console.log("date picker clicked");
                                    var src = clickEvent.target;
          
                                    if (src.tagName === "INPUT") {
                                      clickEvent.stopImmediatePropagation();
                                    }
          
                                    clickEvent.stopImmediatePropagation();
                                  },
                                },

                                option7: generateOption(6, fromAmount, toAmount),
                                option8: generateOption(12, fromAmountTaxable, toAmountTaxable),
                                option9: generateOption(13, fromAmountIGST, toAmountIGST),
                                option10: generateOption(14, fromAmountCGST, toAmountCGST),
                                option11: generateOption(15, fromAmountSGST, toAmountSGST),
                                option12: generateOption(16, fromAmountCESS, toAmountCESS),

                                clear: {
                                  name: `<button id='btnClear'  name='Clear' tabIndex="-1"   value='Clear'>Clear</button>`,
                                  
                                  callback: function (key, selection, clickEvent) {
          
                                    var src = clickEvent.target;
          
                                    if (src?.tagName?.toLowerCase() === "button") {
                                      if (clickEvent.target.id == "btnClear") {
                                        const hot = hotRef2?.current?.hotInstance;
                                        const selectedValue = hot?.getSelected()[0][1];
                                        const isValidTextColumn = [3,5,6,8,9,10,11,12,13,14,15,16].includes(selectedValue);
                                        const isValidCheckBoxColumn = [3,9,10,11].includes(selectedValue);

                                        if (!isValidTextColumn) {
                                          let x = searchVal1
                                          var value = "";
                                          var columnName = cdnColumns[currentCol1]?.data;
                                          let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
          
                                          filterObject.push({ [columnName]: value });
                                          if (!searchVal1?.length) {
                                            x.push(value);
                                            let y = currentCol;
                                            y.push(
                                              cdnColumns[currentCol1]?.data
                                            );
                                            // console.log("jsx=",x,y)
                                            setSearchVal1(x);
                                            setCurrentCol(y);
                                          } else {
                                            const Index = currentCol?.findIndex(
                                              (item) =>
                                              cdnColumns[currentCol1]?.data ==
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
                                                cdnColumns[currentCol1]?.data
                                              );
                                              setSearchVal1(x);
                                              setCurrentCol(y);
                                            }
                                          }
                                          setPage(0);
                                          purchaseSummaryList(
                                            activeTab,
                                            "",
                                            "asc",
                                            invoceTypes?.value,
                                            finFromYear?.value,
                                            monthFrom?.value,
                                            "", 1
                                          );
                                        }

                                        else if (hot?.getSelected()[0][1] == 5) {
          
                                          var columnName = cdnColumns[currentCol1]?.data;
                                          var value = '';
                                          setSearchDate('');
                                          setToDate('');
                                          let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
          
                                          filterObject.push({ [columnName]: value });
                                          if (!searchVal1?.length) {
          
                                            x.push(value);
                                            let y = currentCol;
                                            y.push(
                                              cdnColumns[currentCol1]?.data
                                            );
                                            // console.log("jsx=",x,y)
                                            setSearchVal1(x);
                                            setCurrentCol(y);
                                          } else {
                    
                                            const Index = currentCol?.findIndex(
                                              (item) =>
                                              cdnColumns[currentCol1]?.data ==
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
                                                cdnColumns[currentCol1]?.data
                                              );
                                              setSearchVal1(x);
                                              setCurrentCol(y);
                                            }
                                          }
          
                                          setPage(0);
                                          purchaseSummaryList(
                                            activeTab,
                                            "",
                                            "asc",
                                            invoceTypes?.value,
                                            finFromYear?.value,
                                            monthFrom?.value,
                                            "", 1
                                          );
                                      
          
                                        }
                                        else if (hot?.getSelected()[0][1] == 8) {
          
                                          var columnName = cdnColumns[currentCol1]?.data;
                                          var value = '';
                                          setSearchDate1('');
                                          setSearchDate1To('');
                                          let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                          filterObject.push({ [columnName]: value });
                                          if (!searchVal1?.length) {
          
                                            x.push(value);
                                            let y = currentCol;
                                            y.push(
                                              cdnColumns[currentCol1]?.data
                                            );
                                            // console.log("jsx=",x,y)
                                            setSearchVal1(x);
                                            setCurrentCol(y);
                                          } else {
                    
                                            const Index = currentCol?.findIndex(
                                              (item) =>
                                              cdnColumns[currentCol1]?.data ==
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
                                                cdnColumns[currentCol1]?.data
                                              );
                                              setSearchVal1(x);
                                              setCurrentCol(y);
                                            }
                                          }
          
                                          setPage(0);
                                          purchaseSummaryList(
                                            activeTab,
                                            "",
                                            "asc",
                                            invoceTypes?.value,
                                            finFromYear?.value,
                                            monthFrom?.value,
                                            "", 1
                                          );
          
                                        }
                                        else if (hot?.getSelected()[0][1] == 6) {
                                          const x = searchVal1
                                          var columnName = cdnColumns[currentCol1]?.data;
                                          var value = '';
                                          setFromAmount('');
                                          setToAmount('');
          
                                          let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                          filterObject.push({ [columnName]: value });
                                          if (!searchVal1?.length) {
          
                                            x.push(value);
                                            let y = currentCol;
                                            y.push(
                                              cdnColumns[currentCol1]?.data
                                            );
                                            // console.log("jsx=",x,y)
                                            setSearchVal1(x);
                                            setCurrentCol(y);
                                          } else {
                    
                                            const Index = currentCol?.findIndex(
                                              (item) =>
                                              cdnColumns[currentCol1]?.data ==
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
                                                cdnColumns[currentCol1]?.data
                                              );
                                              setSearchVal1(x);
                                              setCurrentCol(y);
                                            }
                                          }
          
                                          setPage(0);
                                          purchaseSummaryList(
                                            activeTab,
                                            "",
                                            "asc",
                                            invoceTypes?.value,
                                            finFromYear?.value,
                                            monthFrom?.value,
                                            "", 1
                                          );
                                        }
                                        else if (hot?.getSelected()[0][1] == 12) {
                                          const x = searchVal1
                                          var columnName = cdnColumns[currentCol1]?.data;
                                          var value = '';
                                          setFromAmountTaxable('');
                                          setToAmountTaxable('');
                                          let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                          filterObject.push({ [columnName]: value });
                                          if (!searchVal1?.length) {
          
                                            x.push(value);
                                            let y = currentCol;
                                            y.push(
                                              cdnColumns[currentCol1]?.data
                                            );
                                            // console.log("jsx=",x,y)
                                            setSearchVal1(x);
                                            setCurrentCol(y);
                                          } else {
                    
                                            const Index = currentCol?.findIndex(
                                              (item) =>
                                              cdnColumns[currentCol1]?.data ==
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
                                                cdnColumns[currentCol1]?.data
                                              );
                                              setSearchVal1(x);
                                              setCurrentCol(y);
                                            }
                                          }
          
                                          setPage(0);
                                          purchaseSummaryList(
                                            activeTab,
                                            "",
                                            "asc",
                                            invoceTypes?.value,
                                            finFromYear?.value,
                                            monthFrom?.value,
                                            "", 1
                                          );
          
                                        }
                                        else if (hot?.getSelected()[0][1] == 13) {
                                          const x = searchVal1
                                          var columnName = cdnColumns[currentCol1]?.data;
                                          var value = '';
                                          setFromAmountIGST('');
                                          setToAmountIGST('');
                                          let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                          filterObject.push({ [columnName]: value });
                                          if (!searchVal1?.length) {
          
                                            x.push(value);
                                            let y = currentCol;
                                            y.push(
                                              cdnColumns[currentCol1]?.data
                                            );
                                            // console.log("jsx=",x,y)
                                            setSearchVal1(x);
                                            setCurrentCol(y);
                                          } else {
                    
                                            const Index = currentCol?.findIndex(
                                              (item) =>
                                              cdnColumns[currentCol1]?.data ==
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
                                                cdnColumns[currentCol1]?.data
                                              );
                                              setSearchVal1(x);
                                              setCurrentCol(y);
                                            }
                                          }
          
                                          setPage(0);
                                          purchaseSummaryList(
                                            activeTab,
                                            "",
                                            "asc",
                                            invoceTypes?.value,
                                            finFromYear?.value,
                                            monthFrom?.value,
                                            "", 1
                                          );
                                        }
                                        else if (hot?.getSelected()[0][1] == 14) {
                                          const x = searchVal1
                                          var columnName = cdnColumns[currentCol1]?.data;
                                          var value = '';
                                          setFromAmountCGST('');
                                          setToAmountCGST('');
                                          let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                          filterObject.push({ [columnName]: value });
                                          if (!searchVal1?.length) {
          
                                            x.push(value);
                                            let y = currentCol;
                                            y.push(
                                              cdnColumns[currentCol1]?.data
                                            );
                                            // console.log("jsx=",x,y)
                                            setSearchVal1(x);
                                            setCurrentCol(y);
                                          } else {
                    
                                            const Index = currentCol?.findIndex(
                                              (item) =>
                                              cdnColumns[currentCol1]?.data ==
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
                                                cdnColumns[currentCol1]?.data
                                              );
                                              setSearchVal1(x);
                                              setCurrentCol(y);
                                            }
                                          }
          
                                          setPage(0);
                                          purchaseSummaryList(
                                            activeTab,
                                            "",
                                            "asc",
                                            invoceTypes?.value,
                                            finFromYear?.value,
                                            monthFrom?.value,
                                            "", 1
                                          );
                                        }
                                        else if (hot?.getSelected()[0][1] == 15) {
                                          const x = searchVal1
                                          var columnName = cdnColumns[currentCol1]?.data;
                                          var value = '';
                                          setFromAmountSGST('');
                                          setToAmountSGST('');
                                          let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                          filterObject.push({ [columnName]: value });
                                          if (!searchVal1?.length) {
          
                                            x.push(value);
                                            let y = currentCol;
                                            y.push(
                                              cdnColumns[currentCol1]?.data
                                            );
                                            // console.log("jsx=",x,y)
                                            setSearchVal1(x);
                                            setCurrentCol(y);
                                          } else {
                    
                                            const Index = currentCol?.findIndex(
                                              (item) =>
                                              cdnColumns[currentCol1]?.data ==
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
                                                cdnColumns[currentCol1]?.data
                                              );
                                              setSearchVal1(x);
                                              setCurrentCol(y);
                                            }
                                          }
          
                                          setPage(0);
                                          purchaseSummaryList(
                                            activeTab,
                                            "",
                                            "asc",
                                            invoceTypes?.value,
                                            finFromYear?.value,
                                            monthFrom?.value,
                                            "", 1
                                          );
                                        }
                                        else if (hot?.getSelected()[0][1] == 16) {
                                          const x = searchVal1
                                          var columnName = cdnColumns[currentCol1]?.data;
                                          var value = '';
                                          setFromAmountCESS('');
                                          setToAmountCESS('');
          
                                          let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
          
                                          filterObject.push({ [columnName]: value });
                                          if (!searchVal1?.length) {
          
                                            x.push(value);
                                            let y = currentCol;
                                            y.push(
                                              cdnColumns[currentCol1]?.data
                                            );
                                            // console.log("jsx=",x,y)
                                            setSearchVal1(x);
                                            setCurrentCol(y);
                                          } else {
                    
                                            const Index = currentCol?.findIndex(
                                              (item) =>
                                              cdnColumns[currentCol1]?.data ==
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
                                                cdnColumns[currentCol1]?.data
                                              );
                                              setSearchVal1(x);
                                              setCurrentCol(y);
                                            }
                                          }
          
                                          setPage(0);
                                          purchaseSummaryList(
                                            activeTab,
                                            "",
                                            "asc",
                                            invoceTypes?.value,
                                            finFromYear?.value,
                                            monthFrom?.value,
                                            "", 1
                                          );
          
                                        }
                                        else if (isValidCheckBoxColumn) {
                                          const x = searchVal1
                                          var checkboxes = document.getElementsByClassName('checkBoxClass');
                                          arrChk = []
                                          setFilterDropDownList([]);
                                          var columnName = cdnColumns[currentCol1]?.data;
                                          let filterObject2 = !gridCustomFilter ? [] : gridCustomFilter
                                          let filterObject = []
                                          filterObject2 = filterObject2 == null || filterObject2.length <= 0 ? [] : filterObject2;
                                          
                                          for (let i = 0; i < checkboxes.length; i++) {
                                            if (checkboxes[i].checked) {
                                            //   arrChk.push({ [columnName]: checkboxes[i].value });
                                            //   filterObject2.push({ [columnName]: checkboxes[i].value });
                                            //   filterObject.push(checkboxes[i].value);
                                            // } else {
                                              console.log("else is running")
                                              let uniqueArray = filterObject.filter((obj, index, self) =>
                                                index === self.findIndex((t) => (
                                                  JSON.stringify(t) === JSON.stringify(obj)
                                                ))
                                              );
                                              let uniqueArray2 = filterObject2.filter((obj, index, self) =>
                                              index === self.findIndex((t) => (
                                                JSON.stringify(t) === JSON.stringify(obj)
                                              ))
                                            );
                                              console.log(uniqueArray,"uniqArray")
                                              filterObject2 = uniqueArray2
                                              const index = filterObject.findIndex(obj => obj[columnName] === checkboxes[i].value);
                                              const index1 = filterObject2.findIndex(obj => obj[columnName] === checkboxes[i].value);
                                              if (index !== -1 || index1 !== -1)   {
                    
                                                // delete filterObject[index1][columnName];
                                                delete filterObject2[index1][columnName];
                                              }
                                            }
                                          }


                                          setGridCustomFilter(filterObject2)
                                          var value = ""
                                          if (!searchVal1?.length) {
                                            x.push(value);
                                            let y = currentCol;
                                            y.push(
                                              cdnColumns[currentCol1]?.data
                                            );
                                            setSearchVal1(x);
                                            setCurrentCol(y);
                                          } else{
                                            const Index = currentCol?.findIndex(
                                              (item) =>
                                              cdnColumns[currentCol1]?.data ==
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
                                                cdnColumns[currentCol1]?.data
                                              );
                                              setSearchVal1(x);
                                              setCurrentCol(y);
                                            }
                                            
                                          }
                                          setPage(0);
                                          purchaseSummaryList(
                                            activeTab,
                                            "",
                                            "asc",
                                            invoceTypes?.value,
                                            finFromYear?.value,
                                            monthFrom?.value,
                                            "", 1
                                          );
          
                                          const updatedFilterDropDownList = filterObject2.reduce((acc, item) => {
                                            console.log(acc,item,"acc,item")
                                            const { rate, supplyType, placeOfSupply, noteType} = item;
          
                                            const updateList = (list, value) => {
                                              console.log(list,value,"list,value")
                                              return list?.includes(value) ? list : [...list, value];
                                            };
          
                                            if (rate !== undefined) {
                                              acc.rateDropDownList = updateList(acc.rateDropDownList, rate);
                                            }  else if (supplyType !== undefined) {
                                              acc.supplyTypeDropdownList = updateList(acc.supplyTypeDropdownList, supplyType);
                                            } else if (placeOfSupply !== undefined) {
                                              acc.posDropDownList = updateList(acc.posDropDownList, placeOfSupply);
                                            } 
                                            else if (noteType !== undefined) {
                                              acc.noteTypeDropDownList = updateList(acc.noteTypeDropDownList, noteType);
                                            } 
          
                                            return acc;
                                          }, { rateDropDownList: [], supplyTypeDropdownList: [],  posDropDownList: [],noteTypeDropDownList:[]});
          
                                          setFilterDropDownList(updatedFilterDropDownList);
          
                                        }
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
                                rateDropDownList,
                                supplyTypeDropdownList,
                                posDropDownList,
                                noteTypeDropDownList
                              } = filterDropDownList;
          
                              const listsToCheck = [
                                rateDropDownList,
                                supplyTypeDropdownList,
                                posDropDownList,
                                noteTypeDropDownList
                              ];
          
                              for (var j = 0; j < checkboxes.length; j++) {
                                for (var k = 0; k < listsToCheck.length; k++) {
                                  if (listsToCheck[k]) {
                                    // For rcmDropDownList, check both conditions listsToCheck[k][i] == checkboxes[j].value and checkboxes?.length == 2
                                    if (k === 0 && checkboxes.length === 13) {
          
                                      for (var i = 0; i < listsToCheck[k].length; i++) {
                                        if (listsToCheck[k][i] == checkboxes[j].value) {
                                          $(checkboxes[j]).prop("checked", true);
                                          break;
                                        }
                                      }
                                    } else if (k === 1 && checkboxes.length === 2) {
          
                                      for (var i = 0; i < listsToCheck[k].length; i++) {
                                        if (listsToCheck[k][i] == checkboxes[j].value) {
                                          $(checkboxes[j]).prop("checked", true);
                                          break;
                                        }
                                      }
                                    }
                                    else if (k === 2 && checkboxes.length === 2) {
          
                                      for (var i = 0; i < listsToCheck[k].length; i++) {
                                        if (listsToCheck[k][i] == checkboxes[j].value ) {
                                          $(checkboxes[j]).prop("checked", true);
                                          break;
                                        }
                                      }
                                    }
                                    else {
          
                                      for (var i = 0; i < listsToCheck[k].length; i++) {
                                        if (listsToCheck[k][i] == checkboxes[j].value && k !== 0 && k !== 1 && k !== 2) {
                                          $(checkboxes[j]).prop("checked", true);
                                          break;
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }}


                            afterFilter={function (data) {
                              const hot = hotRef2?.current?.hotInstance;
                              const selectedValuecol = hot?.getSelected()[0][1];
                              const shouldExcludeTextBox = [3,5,6,8,9,10,11,12,13,14,15,16].includes(selectedValuecol);
                              const shouldExcludeCheckBox = [3,9,10,11].includes(selectedValuecol);
                              if(!shouldExcludeTextBox){
                                let x = searchVal1
                                  var searchInput = document.querySelector(".htUIMultipleSelectSearch.htUIInput");
                                  var value = searchInput?.children[0].value;
                                  //  x.push(value)
                                  var columnName = cdnColumns[currentCol1]?.data;
                                  let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                                  filterObject.push({ [columnName]: value });

                                  // setSearchVal1(x);
                                  // let y = currentCol;
                                  // y.push(handsontableColumns[currentCol1]?.data);

                                  // setCurrentCol(y)\
                                  if (!searchVal1?.length) {

                                    x.push(value);
                                    let y = currentCol;
                                    y.push(
                                      cdnColumns[currentCol1]?.data
                                    );
                                    // console.log("jsx=",x,y)
                                    setSearchVal1(x);
                                    setCurrentCol(y);
                                  } else {

                                    const Index = currentCol?.findIndex(
                                      (item) =>
                                      cdnColumns[currentCol1]?.data ==
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
                                        cdnColumns[currentCol1]?.data
                                      );
                                      setSearchVal1(x);
                                      setCurrentCol(y);
                                    }
                                  } 
                                  purchaseSummaryList(
                                    activeTab,
                                    "",
                                    "asc",
                                    invoceTypes?.value,
                                    finFromYear?.value,
                                    monthFrom?.value,
                                    "", 1
                                  );
                              }
                              else if (selectedValuecol == 5) {
                                const x = searchVal1
                                var searchInput1 = document.getElementById("custom1");
                                var searchInput2 = document.getElementById("custom2");
                                const invFromDate = searchInput1?.value
                                const invToDate = searchInput2?.value
                                var columnName = cdnColumns[currentCol1]?.data;
                                var value = (searchInput1?.value || searchInput2?.value) && `${invFromDate ? invFromDate : invToDate}to${invToDate ? invToDate : invFromDate}`;
                                // var value = `${invFromDate}to${invToDate}`;
                                setSearchDate(searchInput1?.value);
                                setToDate(searchInput2?.value);
                                let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                filterObject.push({ [columnName]: value });
                                if (!searchVal1?.length) {

                                  x.push(value);
                                  let y = currentCol;
                                  y.push(
                                    cdnColumns[currentCol1]?.data
                                  );
                                  // console.log("jsx=",x,y)
                                  setSearchVal1(x);
                                  setCurrentCol(y);
                                } else {

                                  const Index = currentCol?.findIndex(
                                    (item) =>
                                    cdnColumns[currentCol1]?.data ==
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
                                      cdnColumns[currentCol1]?.data
                                    );
                                    setSearchVal1(x);
                                    setCurrentCol(y);
                                  }
                                } 
                                purchaseSummaryList(
                                  activeTab,
                                  "",
                                  "asc",
                                  invoceTypes?.value,
                                  finFromYear?.value,
                                  monthFrom?.value,
                                  "", 1
                                );
          
                              }

                              else if (selectedValuecol == 8) {
                                const x = searchVal1
                                var searchInput1 = document.getElementById("custom1");
                                var searchInput2 = document.getElementById("custom2");
                                const invFromDate = searchInput1?.value
                                const invToDate = searchInput2?.value
                                var columnName = cdnColumns[currentCol1]?.data;
                                var value = (searchInput1?.value || searchInput2?.value) && `${invFromDate ? invFromDate : invToDate}to${invToDate ? invToDate : invFromDate}`;
                                // var value = `${invFromDate}to${invToDate}`;
                                setSearchDate1(searchInput1?.value);
                                setSearchDate1To(searchInput2?.value);
                                let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                filterObject.push({ [columnName]: value });
                                if (!searchVal1?.length) {

                                  x.push(value);
                                  let y = currentCol;
                                  y.push(
                                    cdnColumns[currentCol1]?.data
                                  );
                                  // console.log("jsx=",x,y)
                                  setSearchVal1(x);
                                  setCurrentCol(y);
                                } else {

                                  const Index = currentCol?.findIndex(
                                    (item) =>
                                    cdnColumns[currentCol1]?.data ==
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
                                      cdnColumns[currentCol1]?.data
                                    );
                                    setSearchVal1(x);
                                    setCurrentCol(y);
                                  }
                                } 
                                purchaseSummaryList(
                                  activeTab,
                                  "",
                                  "asc",
                                  invoceTypes?.value,
                                  finFromYear?.value,
                                  monthFrom?.value,
                                  "", 1
                                );
          
                              }
          
                              else if (hot?.getSelected()[0][1] == 6) {
                                const x = searchVal1
                                var searchInput1 = document.getElementById("amount1");
                                var searchInput2 = document.getElementById("amount2");
                                const invFromDate = searchInput1?.value?.replaceAll(",", "")
                                const invToDate = searchInput2?.value?.replaceAll(",", "")
                                var columnName = cdnColumns[currentCol1]?.data;
                                // var value = (searchInput1?.value || searchInput2?.value) && `${invFromDate ? invFromDate : invToDate}to${invToDate ? invToDate : invFromDate}`;
                                var value = `${invFromDate}to${invToDate}`;
                                console.log(value,"wwwweeee")
                                setFromAmount(searchInput1?.value);
                                setToAmount(searchInput2?.value);
                                let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                filterObject.push({ [columnName]: value });
                                if (!searchVal1?.length) {

                                  x.push(value);
                                  let y = currentCol;
                                  y.push(
                                    cdnColumns[currentCol1]?.data
                                  );
                                  // console.log("jsx=",x,y)
                                  setSearchVal1(x);
                                  setCurrentCol(y);
                                } else {

                                  const Index = currentCol?.findIndex(
                                    (item) =>
                                    cdnColumns[currentCol1]?.data ==
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
                                      cdnColumns[currentCol1]?.data
                                    );
                                    setSearchVal1(x);
                                    setCurrentCol(y);
                                  }
                                } 
                                purchaseSummaryList(
                                  activeTab,
                                  "",
                                  "asc",
                                  invoceTypes?.value,
                                  finFromYear?.value,
                                  monthFrom?.value,
                                  "", 1
                                );
          
                              }
          
                              else if (hot?.getSelected()[0][1] ==12) {
                                const x = searchVal1
                                var searchInput1 = document.getElementById("amount1");
                                var searchInput2 = document.getElementById("amount2");
                                const invFromDate = searchInput1?.value?.replaceAll(",", "")
                                const invToDate = searchInput2?.value?.replaceAll(",", "")
                                var columnName = cdnColumns[currentCol1]?.data;
                                // var value = (searchInput1?.value || searchInput2?.value) && `${invFromDate ? invFromDate : invToDate}to${invToDate ? invToDate : invFromDate}`;
                                var value = `${invFromDate}to${invToDate}`;
                                setFromAmountTaxable(searchInput1?.value);
                                setToAmountTaxable(searchInput2?.value);
                                let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
          
                                filterObject.push({ [columnName]: value });
                                if (!searchVal1?.length) {

                                  x.push(value);
                                  let y = currentCol;
                                  y.push(
                                    cdnColumns[currentCol1]?.data
                                  );
                                  // console.log("jsx=",x,y)
                                  setSearchVal1(x);
                                  setCurrentCol(y);
                                } else {

                                  const Index = currentCol?.findIndex(
                                    (item) =>
                                    cdnColumns[currentCol1]?.data ==
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
                                      cdnColumns[currentCol1]?.data
                                    );
                                    setSearchVal1(x);
                                    setCurrentCol(y);
                                  }
                                } 
                                purchaseSummaryList(
                                  activeTab,
                                  "",
                                  "asc",
                                  invoceTypes?.value,
                                  finFromYear?.value,
                                  monthFrom?.value,
                                  "", 1
                                );
          
                              }
          
                              else if (hot?.getSelected()[0][1] == 13) {
                                const x = searchVal1
                                var searchInput1 = document.getElementById("amount1");
                                var searchInput2 = document.getElementById("amount2");
                                const fromAmount = searchInput1?.value?.replaceAll(",", "")
                                const toAmount = searchInput2?.value?.replaceAll(",", "")
                                var columnName = cdnColumns[currentCol1]?.data;
                                // var value = (searchInput1?.value || searchInput2?.value) && `${fromAmount ? fromAmount : toAmount}to${toAmount ? toAmount : fromAmount}`;
                                var value = `${fromAmount}to${toAmount}`;
                                setFromAmountIGST(searchInput1?.value);
                                setToAmountIGST(searchInput2?.value);
                                let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                filterObject.push({ [columnName]: value });
                                if (!searchVal1?.length) {

                                  x.push(value);
                                  let y = currentCol;
                                  y.push(
                                    cdnColumns[currentCol1]?.data
                                  );
                                  // console.log("jsx=",x,y)
                                  setSearchVal1(x);
                                  setCurrentCol(y);
                                } else {

                                  const Index = currentCol?.findIndex(
                                    (item) =>
                                    cdnColumns[currentCol1]?.data ==
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
                                      cdnColumns[currentCol1]?.data
                                    );
                                    setSearchVal1(x);
                                    setCurrentCol(y);
                                  }
                                } 
                                purchaseSummaryList(
                                  activeTab,
                                  "",
                                  "asc",
                                  invoceTypes?.value,
                                  finFromYear?.value,
                                  monthFrom?.value,
                                  "", 1
                                );
          
                              }
          
                              else if (hot?.getSelected()[0][1] == 14) {
                                const x = searchVal1
                                var searchInput1 = document.getElementById("amount1");
                                var searchInput2 = document.getElementById("amount2");
                                const fromAmount = searchInput1?.value?.replaceAll(",", "")
                                const toAmount = searchInput2?.value?.replaceAll(",", "")
                                var columnName = cdnColumns[currentCol1]?.data;
                                // var value = (searchInput1?.value || searchInput2?.value) && `${fromAmount ? fromAmount : toAmount}to${toAmount ? toAmount : fromAmount}`;
                                var value = `${fromAmount}to${toAmount}`;
                                setFromAmountCGST(searchInput1?.value);
                                setToAmountCGST(searchInput2?.value);
                                let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                filterObject.push({ [columnName]: value });
                                if (!searchVal1?.length) {

                                  x.push(value);
                                  let y = currentCol;
                                  y.push(
                                    cdnColumns[currentCol1]?.data
                                  );
                                  // console.log("jsx=",x,y)
                                  setSearchVal1(x);
                                  setCurrentCol(y);
                                } else {

                                  const Index = currentCol?.findIndex(
                                    (item) =>
                                    cdnColumns[currentCol1]?.data ==
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
                                      cdnColumns[currentCol1]?.data
                                    );
                                    setSearchVal1(x);
                                    setCurrentCol(y);
                                  }
                                } 
                                purchaseSummaryList(
                                  activeTab,
                                  "",
                                  "asc",
                                  invoceTypes?.value,
                                  finFromYear?.value,
                                  monthFrom?.value,
                                  "", 1
                                );
          
                              }
          
                              else if (hot?.getSelected()[0][1] == 15) {
                                const x =  searchVal1
                                var searchInput1 = document.getElementById("amount1");
                                var searchInput2 = document.getElementById("amount2");
                                const fromAmount = searchInput1?.value?.replaceAll(",", "")
                                const toAmount = searchInput2?.value?.replaceAll(",", "")
                                var columnName = cdnColumns[currentCol1]?.data;
                                var value = `${fromAmount}to${toAmount}`;
                                // var value = (searchInput1?.value || searchInput2?.value) && `${fromAmount ? fromAmount : toAmount}to${toAmount ? toAmount : fromAmount}`;
                                setFromAmountSGST(searchInput1?.value);
                                setToAmountSGST(searchInput2?.value);
                                let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                filterObject.push({ [columnName]: value });
                                if (!searchVal1?.length) {

                                  x.push(value);
                                  let y = currentCol;
                                  y.push(
                                    cdnColumns[currentCol1]?.data
                                  );
                                  // console.log("jsx=",x,y)
                                  setSearchVal1(x);
                                  setCurrentCol(y);
                                } else {

                                  const Index = currentCol?.findIndex(
                                    (item) =>
                                    cdnColumns[currentCol1]?.data ==
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
                                      cdnColumns[currentCol1]?.data
                                    );
                                    setSearchVal1(x);
                                    setCurrentCol(y);
                                  }
                                } 
                                purchaseSummaryList(
                                  activeTab,
                                  "",
                                  "asc",
                                  invoceTypes?.value,
                                  finFromYear?.value,
                                  monthFrom?.value,
                                  "", 1
                                );
          
                              }
          
                              else if (hot?.getSelected()[0][1] == 16) {
                                const x = searchVal1
                                var searchInput1 = document.getElementById("amount1");
                                var searchInput2 = document.getElementById("amount2");
                                const fromAmount = searchInput1?.value?.replaceAll(",", "")
                                const toAmount = searchInput2?.value?.replaceAll(",", "")
                                var columnName = cdnColumns[currentCol1]?.data;
                                // var value = (searchInput1?.value || searchInput2?.value) && `${fromAmount ? fromAmount : toAmount}to${toAmount ? toAmount : fromAmount}`;
                                var value = `${fromAmount}to${toAmount}`;
                                setFromAmountCESS(searchInput1?.value);
                                setToAmountCESS(searchInput2?.value);
                                let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                filterObject.push({ [columnName]: value });
                                if (!searchVal1?.length) {

                                  x.push(value);
                                  let y = currentCol;
                                  y.push(
                                    cdnColumns[currentCol1]?.data
                                  );
                                  // console.log("jsx=",x,y)
                                  setSearchVal1(x);
                                  setCurrentCol(y);
                                } else {

                                  const Index = currentCol?.findIndex(
                                    (item) =>
                                    cdnColumns[currentCol1]?.data ==
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
                                      cdnColumns[currentCol1]?.data
                                    );
                                    setSearchVal1(x);
                                    setCurrentCol(y);
                                  }
                                } 
                                purchaseSummaryList(
                                  activeTab,
                                  "",
                                  "asc",
                                  invoceTypes?.value,
                                  finFromYear?.value,
                                  monthFrom?.value,
                                  "", 1
                                );
          
                              }
          
                              else if (shouldExcludeCheckBox) {
                                var x =  searchVal1
                                var checkboxes = document.getElementsByClassName('checkBoxClass');
                                arrChk = []
                                setFilterDropDownList([]);
                                var columnName = cdnColumns[currentCol1]?.data;
                                let filterObject2 = !gridCustomFilter ? [] : gridCustomFilter
                                let filterObject = []
                                filterObject2 = filterObject2 == null || filterObject2.length <= 0 ? [] : filterObject2;
          
                                for (let i = 0; i < checkboxes.length; i++) {
                                  if (checkboxes[i].checked) {
                                    arrChk.push({ [columnName]: checkboxes[i].value });
                                    filterObject2.push({ [columnName]: checkboxes[i].value });
                                    filterObject.push(checkboxes[i].value);
                                  } else {
                                    console.log("else is running")
                                    let uniqueArray = filterObject.filter((obj, index, self) =>
                                      index === self.findIndex((t) => (
                                        JSON.stringify(t) === JSON.stringify(obj)
                                      ))
                                    );
                                    let uniqueArray2 = filterObject2.filter((obj, index, self) =>
                                    index === self.findIndex((t) => (
                                      JSON.stringify(t) === JSON.stringify(obj)
                                    ))
                                  );
                                    console.log(uniqueArray,"uniqArray")
                                    filterObject2 = uniqueArray2
                                    const index = filterObject.findIndex(obj => obj[columnName] === checkboxes[i].value);
                                    const index1 = filterObject2.findIndex(obj => obj[columnName] === checkboxes[i].value);
                                    if (index !== -1 || index1 !== -1)   {
          
                                      // delete filterObject[index1][columnName];
                                      delete filterObject2[index1][columnName];
                                    }
                                  }
                                }
                                setGridCustomFilter(filterObject2)
                                var value = filterObject?.join("@#@#")
                                if (!searchVal1?.length) {
                                  x.push(value);
                                  let y = currentCol;
                                  y.push(
                                    cdnColumns[currentCol1]?.data
                                  );
                                  setSearchVal1(x);
                                  setCurrentCol(y);
                                } else{
                                  const Index = currentCol?.findIndex(
                                    (item) =>
                                    cdnColumns[currentCol1]?.data ==
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
                                      cdnColumns[currentCol1]?.data
                                    );
                                    setSearchVal1(x);
                                    setCurrentCol(y);
                                  }
                                  
                                }
                                setPage(0);
                                purchaseSummaryList(
                                  activeTab,
                                  "",
                                  "asc",
                                  invoceTypes?.value,
                                  finFromYear?.value,
                                  monthFrom?.value,
                                  "", 1
                                );

          
                                const updatedFilterDropDownList = filterObject2.reduce((acc, item) => {
                                  const { rate, supplyType, placeOfSupply, noteType} = item;

                                  const updateList = (list, value) => {
                                    return list.includes(value) ? list : [...list, value];
                                  };

                                  if (rate !== undefined) {
                                    acc.rateDropDownList = updateList(acc.rateDropDownList, rate);
                                  }  else if (supplyType !== undefined) {
                                    acc.supplyTypeDropdownList = updateList(acc.supplyTypeDropdownList, supplyType);
                                  } else if (placeOfSupply !== undefined) {
                                    acc.posDropDownList = updateList(acc.posDropDownList, placeOfSupply);
                                  } 
                                  else if (noteType !== undefined) {
                                    acc.noteTypeDropDownList = updateList(acc.noteTypeDropDownList, noteType);
                                  } 

                                  return acc;
                                }, { rateDropDownList: [], supplyTypeDropdownList: [],  posDropDownList: [],noteTypeDropDownList:[]});
          
                                setFilterDropDownList(updatedFilterDropDownList);
          
                              }
                            }}
                          />

<                     Row className="justify-content-end mx-0">
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
                                // styles={customStyles}
                                />) : (<></>)}
                                 &nbsp; &nbsp;
                                {purchaseData?.length ? ( <span  >
                                  <b>  { ` ${pageNoTitle}`}</b>
                                </span>) : <></>}
                                &nbsp; &nbsp;
                                <ReactPaginate
                                  breakLabel="..."
                                  nextLabel=""
                                  onPageChange={(e) => handlePageClick(e?.selected)}
                                  pageRangeDisplayed={2}
                                  pageCount={pageCount}
                                  previousLabel=""
                                  renderOnZeroPageCount={null}
                                  marginPagesDisplayed={2}
                                  forcePage={page}
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

                        {/* {purchaseData && (
                          <ReactPaginate
                            breakLabel="..."
                            nextLabel=""
                            onPageChange={(e) => handlePageClick(e?.selected)}
                            pageRangeDisplayed={2}
                            pageCount={pageCount}
                            previousLabel=""
                            renderOnZeroPageCount={null}
                            marginPagesDisplayed={2}
                            forcePage={page}
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
                        )} */}
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </TabPane>

            {/*CDNA */}
            <TabPane tabId="4" key="4">
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
                                <span>{totalInvoice ? totalInvoice : 0}</span>
                              </p>
                            </td>

                            <td>
                              <p className="mb-0">
                                {" "}
                                Invoice Values (₹)
                                <br />
                                <span>
                                  {totalInvoiceValue ? totalInvoiceValue : 0}
                                </span>
                              </p>
                            </td>
                            <td>
                              <p className="mb-0">
                                Taxable Values{"  "} (₹)
                                <br />
                                <span>
                                  {totalTaxableValue ? totalTaxableValue : 0}
                                </span>
                              </p>
                            </td>

                            <td>
                              <p className="mb-0">
                                IGST (₹)
                                <br />
                                <span>{totalIGST ? totalIGST : 0}</span>
                              </p>
                            </td>
                            <td>
                              <p className="mb-0">
                                SGST (₹)
                                <br />
                                <span>{totalSGST ? totalSGST : 0}</span>
                              </p>
                            </td>
                            <td>
                              <p className="mb-0">
                                CGST (₹)
                                <br />
                                <span>{totalCGST ? totalCGST : 0}</span>
                              </p>
                            </td>
                            <td>
                              <p className="mb-0">
                                Cess (₹)
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
                        <Col sm={6}>
                          <Label className="form-label">Invoice Type</Label>
                          <Select
                            id="purchaseId_invtype"
                            placeholder="Invoice Type"
                            theme={selectThemeColors}
                            // closeMenuOnSelect={false}
                            components={animatedComponents}
                            //  isMulti
                            options={atInvoiceTypeList}
                            value={{ label: "CDNA", value: "cdna" }}
                            // className="basic-multi-select"
                            classNamePrefix="select"
                            onChange={filterInvoiceTypeAt}
                            isDisabled={true}
                            //onChange={setInvoceTypes}
                          />
                        </Col>
                        <Col sm={6}>
                          <Label className="form-label">
                             Return Period
                          </Label>
                          <Select
                            id="from"
                            placeholder="From"
                            isClearable={false}
                            theme={selectThemeColors}
                            closeMenuOnSelect={true}
                            isDisabled={true}
                            options={panDataFrom}
                            // options={panData}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            components={animatedComponents}
                            onChange={selectFromYear}
                            value={finFromYear}
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
                        {/* {purchaseData?.length > 0 ? ( */}
                          <HotTable
                            autoWrapRow={true}
                            style={purchaseData.length > 0 ? "" : { textAlign: "center", overflowX: "hidden" }}
                            data={purchaseData.length > 0 ? purchaseData : [{ originalSupplierGSTIN: "No Data Found" }] }
                            rowHeights={RowSize}
                            columnHeaderHeight={columnHeaderSize}
                            autoColumnSize={true}
                            viewportColumnRenderingOffset={100}
                            colHeaders={colHeaders}
                            afterGetColHeader={theaderCdna}
                            stretchH="all"
                            preventOverflow="horizontal"
                            columns={purchaseData.length > 0  ? cdnaColumns :  cdnaColumnsEmpty}
                            contextMenu={false}
                            bindRowsWithHeaders={true}
                            licenseKey="non-commercial-and-evaluation"
                            height="auto"
                            ref={hotRef3}
                            afterOnCellMouseDown={localAfterOnCellMouseDown4}
                            mergeCells={purchaseData.length > 0 ?  false : [{ row: 0, col: 1, rowspan: 1, colspan: 11 }] }
                            hiddenColumns={{
                              columns: [21],
                            }}
                            cells={function (row, col) {
                              var cp = {};
                              const hot = hotRef?.current?.hotInstance;
                              cp.className = "child";
                              if (
                                col == 12 ||
                                col == 13 ||
                                col == 14 ||
                                col == 15 ||
                                col == 16 ||
                                col == 17 ||
                                col == 18
                              ) {
                                cp.className = "text-end";
                              }

                              return cp;
                            }}
                            filters={true}
                            dropdownMenu={{
                              items: {
                                filter_by_value: {
                                  name: "Search Value",
                                  // hide the 'Filter by value' list from all columns but the first one
                                  hidden() {
                                    const hot = hotRef3?.current?.hotInstance;
                                    const selectedValue = this.getSelected()[0][1];
                                    // [5,6,8,12,13,14,15,16] wihtout Select option
                                    const isValidColumn = [3,6,8,9,11,12,13,14,15,16,17,18,19,].includes(selectedValue);
                                    return isValidColumn;
                                  },
                                },

                                about: { // For CheckBox custom option

                                  name: `<div  style="margin-left:6px">Select Options<label class="float-end text-danger "><a><u id="selectAll">Select All</u></a></label></div> <div  class="checkboxmenu custom-scrollbar"> <div >  <table id="searchTable" >
                                  ${dropDonwNameTab4 &&
                                    dropDonwNameTab4?.map((index) => (
                                      `<tr><td><input class="checkBoxClass" type="checkbox" value="${index?.value}" /> <span class="fw-normal">${index?.label?.length > 20 ? index?.label?.substring(0, 20) + "..." : index?.label}</span> </td></tr>`
                                    )).join('')
                                    }
          
                                    </table></div>
                                    </div>`, // Name can contain HTML 
                                  hidden() {
                                    const selectedCol = this.getSelectedRangeLast().to.col;
                                    const isHiddenCol = ![6,12,13,14,].includes(selectedCol);
          
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

                                option5: {
                                  name: `<div style="margin-top:10px"> From Date <br><input type='date' data-date="" data-date-format="DD MMMM YYYY" min='2017-07-01' max=${new Date()
                                    .toISOString()
                                    .slice(
                                      0,
                                      10
                                    )}  class='custom-date col-md-11' placeholder='DD-MM-YYYY' id='custom1' name='date' value=${searchDate} > <br/> 
                                      
                                      To Date <br><input type='date' data-date="" data-date-format="DD MMMM YYYY" min='2017-07-01' max=${new Date()
                                      .toISOString()
                                      .slice(
                                        0,
                                        10
                                      )}  class='custom-date col-md-11' placeholder='DD-MM-YYYY' id='custom2' name='date' value=${toDate} >
                                     </div> `,
                                  hidden() {
                                    return this.getSelectedRangeLast().to.col != 3;
                                  },
          
                                  //disabled: true,
                                  callback: function (key, selection, clickEvent) {
          
                                    console.log("date picker clicked");
                                    var src = clickEvent.target;
          
                                    if (src.tagName === "INPUT") {
                                      clickEvent.stopImmediatePropagation();
                                    }
          
                                    clickEvent.stopImmediatePropagation();
                                  },
                                },

                                option6: {
                                  name: `<div style="margin-top:10px"> From Date <br><input type='date' data-date="" data-date-format="DD MMMM YYYY" min='2017-07-01' max=${new Date()
                                    .toISOString()
                                    .slice(
                                      0,
                                      10
                                    )}  class='custom-date col-md-11' placeholder='DD-MM-YYYY' id='custom1' name='date' value=${searchDate1} > <br/> 
                                      
                                      To Date <br><input type='date' data-date="" data-date-format="DD MMMM YYYY" min='2017-07-01' max=${new Date()
                                      .toISOString()
                                      .slice(
                                        0,
                                        10
                                      )}  class='custom-date col-md-11' placeholder='DD-MM-YYYY' id='custom2' name='date' value=${searchDate1To} >
                                     </div> `,
                                  hidden() {
                                    return this.getSelectedRangeLast().to.col != 9;
                                  },
          
                                  //disabled: true,
                                  callback: function (key, selection, clickEvent) {
          
                                    console.log("date picker clicked");
                                    var src = clickEvent.target;
          
                                    if (src.tagName === "INPUT") {
                                      clickEvent.stopImmediatePropagation();
                                    }
          
                                    clickEvent.stopImmediatePropagation();
                                  },
                                },

                                option7: {
                                  name: `<div style="margin-top:10px"> From Date <br><input type='date' data-date="" data-date-format="DD MMMM YYYY" min='2017-07-01' max=${new Date()
                                    .toISOString()
                                    .slice(
                                      0,
                                      10
                                    )}  class='custom-date col-md-11' placeholder='DD-MM-YYYY' id='custom1' name='date' value=${searchDate2} > <br/> 
                                      
                                      To Date <br><input type='date' data-date="" data-date-format="DD MMMM YYYY" min='2017-07-01' max=${new Date()
                                      .toISOString()
                                      .slice(
                                        0,
                                        10
                                      )}  class='custom-date col-md-11' placeholder='DD-MM-YYYY' id='custom2' name='date' value=${searchDate2To} >
                                     </div> `,
                                  hidden() {
                                    return this.getSelectedRangeLast().to.col != 11;
                                  },
          
                                  //disabled: true,
                                  callback: function (key, selection, clickEvent) {
          
                                    console.log("date picker clicked");
                                    var src = clickEvent.target;
          
                                    if (src.tagName === "INPUT") {
                                      clickEvent.stopImmediatePropagation();
                                    }
          
                                    clickEvent.stopImmediatePropagation();
                                  },
                                },

                                option8: generateOption(8, fromAmount, toAmount),
                                option9: generateOption(15, fromAmountTaxable, toAmountTaxable),
                                option10: generateOption(16, fromAmountIGST, toAmountIGST),
                                option11: generateOption(17, fromAmountCGST, toAmountCGST),
                                option12: generateOption(18, fromAmountSGST, toAmountSGST),
                                option13: generateOption(19, fromAmountCESS, toAmountCESS),

                                clear: {
                                  name: `<button id='btnClear'  name='Clear' tabIndex="-1"   value='Clear'>Clear</button>`,
                                  
                                  callback: function (key, selection, clickEvent) {
          
                                    var src = clickEvent.target;
          
                                    if (src?.tagName?.toLowerCase() === "button") {
                                      if (clickEvent.target.id == "btnClear") {
                                        const hot = hotRef3?.current?.hotInstance;
                                        const selectedValue = hot?.getSelected()[0][1];
                                        // const isValidTextColumn = [2,7,8,10,14,15,16,17,18,5,11,12,13].includes(selectedValue);
                                        const isValidTextColumn = [3,6,8,9,11,12,13,14,15,16,17,18,19,].includes(selectedValue);
                                        const isValidCheckBoxColumn = [6,12,13,14,].includes(selectedValue);

                                        if (!isValidTextColumn) {
                                          let x = searchVal1
                                          var value = "";
                                          var columnName = cdnaColumns[currentCol1]?.data;
                                          let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
          
                                          filterObject.push({ [columnName]: value });
                                          if (!searchVal1?.length) {
                                            x.push(value);
                                            let y = currentCol;
                                            y.push(
                                              cdnaColumns[currentCol1]?.data
                                            );
                                            // console.log("jsx=",x,y)
                                            setSearchVal1(x);
                                            setCurrentCol(y);
                                          } else {
                                            const Index = currentCol?.findIndex(
                                              (item) =>
                                              cdnaColumns[currentCol1]?.data ==
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
                                                cdnaColumns[currentCol1]?.data
                                              );
                                              setSearchVal1(x);
                                              setCurrentCol(y);
                                            }
                                          }
                                          setPage(0);
                                          purchaseSummaryList(
                                            activeTab,
                                            "",
                                            "asc",
                                            invoceTypes?.value,
                                            finFromYear?.value,
                                            monthFrom?.value,
                                            "", 1
                                          );
                                          
          
                                        }

                                        else if (hot?.getSelected()[0][1] == 3) {
          
                                          var columnName = cdnaColumns[currentCol1]?.data;
                                          var value = '';
                                          setSearchDate('');
                                          setToDate('');
                                          let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                          filterObject.push({ [columnName]: value });
                                          if (!searchVal1?.length) {

                                            x.push(value);
                                            let y = currentCol;
                                            y.push(
                                              cdnaColumns[currentCol1]?.data
                                            );
                                            // console.log("jsx=",x,y)
                                            setSearchVal1(x);
                                            setCurrentCol(y);
                                          } else {
          
                                            const Index = currentCol?.findIndex(
                                              (item) =>
                                              cdnaColumns[currentCol1]?.data ==
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
                                                cdnaColumns[currentCol1]?.data
                                              );
                                              setSearchVal1(x);
                                              setCurrentCol(y);
                                            }
                                          } 
                                          setPage(0);
                                         purchaseSummaryList(
                                                      activeTab,
                                                      "",
                                                      "asc",
                                                      invoceTypes?.value,
                                                      finFromYear?.value,
                                                      monthFrom?.value,
                                                      "", 1
                                          );
          
                                        }
                                        else if (hot?.getSelected()[0][1] == 9) {
          
                                          var columnName = cdnaColumns[currentCol1]?.data;
                                          var value = '';
                                          setSearchDate1('');
                                          setSearchDate1To('');
                                          let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
          
                                          filterObject.push({ [columnName]: value });
                                          if (!searchVal1?.length) {

                                            x.push(value);
                                            let y = currentCol;
                                            y.push(
                                              cdnaColumns[currentCol1]?.data
                                            );
                                            // console.log("jsx=",x,y)
                                            setSearchVal1(x);
                                            setCurrentCol(y);
                                          } else {
          
                                            const Index = currentCol?.findIndex(
                                              (item) =>
                                              cdnaColumns[currentCol1]?.data ==
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
                                                cdnaColumns[currentCol1]?.data
                                              );
                                              setSearchVal1(x);
                                              setCurrentCol(y);
                                            }
                                          } 
                                          setPage(0);
                                         purchaseSummaryList(
                                                      activeTab,
                                                      "",
                                                      "asc",
                                                      invoceTypes?.value,
                                                      finFromYear?.value,
                                                      monthFrom?.value,
                                                      "", 1
                                          );
          
                                        }
                                        else if (hot?.getSelected()[0][1] == 11) {
            
                                          var columnName = cdnaColumns[currentCol1]?.data;
                                          var value = '';
                                          setSearchDate2('');
                                          setSearchDate2To('');
                                          let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
          
                                          filterObject.push({ [columnName]: value });
                                          if (!searchVal1?.length) {

                                            x.push(value);
                                            let y = currentCol;
                                            y.push(
                                              cdnaColumns[currentCol1]?.data
                                            );
                                            // console.log("jsx=",x,y)
                                            setSearchVal1(x);
                                            setCurrentCol(y);
                                          } else {
          
                                            const Index = currentCol?.findIndex(
                                              (item) =>
                                              cdnaColumns[currentCol1]?.data ==
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
                                                cdnaColumns[currentCol1]?.data
                                              );
                                              setSearchVal1(x);
                                              setCurrentCol(y);
                                            }
                                          } 
                                          setPage(0);
                                         purchaseSummaryList(
                                                      activeTab,
                                                      "",
                                                      "asc",
                                                      invoceTypes?.value,
                                                      finFromYear?.value,
                                                      monthFrom?.value,
                                                      "", 1
                                          );
          
                                        }
                                      
                                        else if (hot?.getSelected()[0][1] == 8) {
                                          const x = searchVal1
                                          var columnName = cdnaColumns[currentCol1]?.data;
                                          var value = '';
                                          setFromAmount('');
                                          setToAmount('');
          
                                          let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                          filterObject.push({ [columnName]: value });
                                          if (!searchVal1?.length) {

                                            x.push(value);
                                            let y = currentCol;
                                            y.push(
                                              cdnaColumns[currentCol1]?.data
                                            );
                                            // console.log("jsx=",x,y)
                                            setSearchVal1(x);
                                            setCurrentCol(y);
                                          } else {
          
                                            const Index = currentCol?.findIndex(
                                              (item) =>
                                              cdnaColumns[currentCol1]?.data ==
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
                                                cdnaColumns[currentCol1]?.data
                                              );
                                              setSearchVal1(x);
                                              setCurrentCol(y);
                                            }
                                          } 
                                          setPage(0);
                                         purchaseSummaryList(
                                                      activeTab,
                                                      "",
                                                      "asc",
                                                      invoceTypes?.value,
                                                      finFromYear?.value,
                                                      monthFrom?.value,
                                                      "", 1
                                          );
          
                                        }
                                        else if (hot?.getSelected()[0][1] == 15) {
                                          const x = searchVal1
                                          var columnName = cdnaColumns[currentCol1]?.data;
                                          var value = '';
                                          setFromAmountTaxable('');
                                          setToAmountTaxable('');
          
                                          let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
          
                                          filterObject.push({ [columnName]: value });
                                          if (!searchVal1?.length) {

                                            x.push(value);
                                            let y = currentCol;
                                            y.push(
                                              cdnaColumns[currentCol1]?.data
                                            );
                                            // console.log("jsx=",x,y)
                                            setSearchVal1(x);
                                            setCurrentCol(y);
                                          } else {
          
                                            const Index = currentCol?.findIndex(
                                              (item) =>
                                              cdnaColumns[currentCol1]?.data ==
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
                                                cdnaColumns[currentCol1]?.data
                                              );
                                              setSearchVal1(x);
                                              setCurrentCol(y);
                                            }
                                          } 
                                          setPage(0);
                                         purchaseSummaryList(
                                                      activeTab,
                                                      "",
                                                      "asc",
                                                      invoceTypes?.value,
                                                      finFromYear?.value,
                                                      monthFrom?.value,
                                                      "", 1
                                          );
          
                                        }
                                        else if (hot?.getSelected()[0][1] == 16) {
                                          const x = searchVal1
                                          var columnName = cdnaColumns[currentCol1]?.data;
                                          var value = '';
                                          setFromAmountIGST('');
                                          setToAmountIGST('');
          
                                          let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
          
                                          filterObject.push({ [columnName]: value });
                                          if (!searchVal1?.length) {

                                            x.push(value);
                                            let y = currentCol;
                                            y.push(
                                              cdnaColumns[currentCol1]?.data
                                            );
                                            // console.log("jsx=",x,y)
                                            setSearchVal1(x);
                                            setCurrentCol(y);
                                          } else {
          
                                            const Index = currentCol?.findIndex(
                                              (item) =>
                                              cdnaColumns[currentCol1]?.data ==
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
                                                cdnaColumns[currentCol1]?.data
                                              );
                                              setSearchVal1(x);
                                              setCurrentCol(y);
                                            }
                                          } 
                                          setPage(0);
                                         purchaseSummaryList(
                                                      activeTab,
                                                      "",
                                                      "asc",
                                                      invoceTypes?.value,
                                                      finFromYear?.value,
                                                      monthFrom?.value,
                                                      "", 1
                                          );
          
                                        }
                                        else if (hot?.getSelected()[0][1] == 17) {
                                          const x = searchVal1
                                          var columnName = cdnaColumns[currentCol1]?.data;
                                          var value = '';
                                          setFromAmountCGST('');
                                          setToAmountCGST('');
          
                                          let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
          
                                          filterObject.push({ [columnName]: value });
                                          if (!searchVal1?.length) {

                                            x.push(value);
                                            let y = currentCol;
                                            y.push(
                                              cdnaColumns[currentCol1]?.data
                                            );
                                            // console.log("jsx=",x,y)
                                            setSearchVal1(x);
                                            setCurrentCol(y);
                                          } else {
          
                                            const Index = currentCol?.findIndex(
                                              (item) =>
                                              cdnaColumns[currentCol1]?.data ==
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
                                                cdnaColumns[currentCol1]?.data
                                              );
                                              setSearchVal1(x);
                                              setCurrentCol(y);
                                            }
                                          } 
                                          setPage(0);
                                         purchaseSummaryList(
                                                      activeTab,
                                                      "",
                                                      "asc",
                                                      invoceTypes?.value,
                                                      finFromYear?.value,
                                                      monthFrom?.value,
                                                      "", 1
                                          );
          
                                        }
                                        else if (hot?.getSelected()[0][1] == 18) {
                                          const x = searchVal1
                                          var columnName = cdnaColumns[currentCol1]?.data;
                                          var value = '';
                                          setFromAmountSGST('');
                                          setToAmountSGST('');
          
                                          let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
          
                                          filterObject.push({ [columnName]: value });
                                          if (!searchVal1?.length) {

                                            x.push(value);
                                            let y = currentCol;
                                            y.push(
                                              cdnaColumns[currentCol1]?.data
                                            );
                                            // console.log("jsx=",x,y)
                                            setSearchVal1(x);
                                            setCurrentCol(y);
                                          } else {
          
                                            const Index = currentCol?.findIndex(
                                              (item) =>
                                              cdnaColumns[currentCol1]?.data ==
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
                                                cdnaColumns[currentCol1]?.data
                                              );
                                              setSearchVal1(x);
                                              setCurrentCol(y);
                                            }
                                          } 
                                          setPage(0);
                                         purchaseSummaryList(
                                                      activeTab,
                                                      "",
                                                      "asc",
                                                      invoceTypes?.value,
                                                      finFromYear?.value,
                                                      monthFrom?.value,
                                                      "", 1
                                          );
          
                                        }
                                        else if (hot?.getSelected()[0][1] == 19) {
                                          const x = searchVal1
                                          var columnName = cdnaColumns[currentCol1]?.data;
                                          var value = '';
                                          setFromAmountCESS('');
                                          setToAmountCESS('');
          
                                          let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
          
                                          filterObject.push({ [columnName]: value });
                                          if (!searchVal1?.length) {

                                            x.push(value);
                                            let y = currentCol;
                                            y.push(
                                              cdnaColumns[currentCol1]?.data
                                            );
                                            // console.log("jsx=",x,y)
                                            setSearchVal1(x);
                                            setCurrentCol(y);
                                          } else {
          
                                            const Index = currentCol?.findIndex(
                                              (item) =>
                                              cdnaColumns[currentCol1]?.data ==
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
                                                cdnaColumns[currentCol1]?.data
                                              );
                                              setSearchVal1(x);
                                              setCurrentCol(y);
                                            }
                                          } 
                                          setPage(0);
                                         purchaseSummaryList(
                                                      activeTab,
                                                      "",
                                                      "asc",
                                                      invoceTypes?.value,
                                                      finFromYear?.value,
                                                      monthFrom?.value,
                                                      "", 1
                                          );
          
                                        }
                                        else if (isValidCheckBoxColumn) {
                                          let x = searchVal1
                                          var checkboxes = document.getElementsByClassName('checkBoxClass');
          
                                          arrChk = []
                                          setFilterDropDownList([]);
                                          var columnName = cdnaColumns[currentCol1]?.data;
                                          let filterObject2 = !gridCustomFilter ? [] : gridCustomFilter
                                          let filterObject = []
                                          filterObject2 = filterObject2 == null || filterObject2.length <= 0 ? [] : filterObject2;
          
                                          for (let i = 0; i < checkboxes.length; i++) {
                                            if (checkboxes[i].checked) {
                                            //   arrChk.push({ [columnName]: checkboxes[i].value });
                                            //   filterObject2.push({ [columnName]: checkboxes[i].value });
                                            //   filterObject.push(checkboxes[i].value);
                                            // } else {
                                              console.log("else is running")
                                              let uniqueArray = filterObject.filter((obj, index, self) =>
                                                index === self.findIndex((t) => (
                                                  JSON.stringify(t) === JSON.stringify(obj)
                                                ))
                                              );
                                              let uniqueArray2 = filterObject2.filter((obj, index, self) =>
                                              index === self.findIndex((t) => (
                                                JSON.stringify(t) === JSON.stringify(obj)
                                              ))
                                            );
                                              console.log(uniqueArray,"uniqArray")
                                              filterObject2 = uniqueArray2
                                              const index = filterObject.findIndex(obj => obj[columnName] === checkboxes[i].value);
                                              const index1 = filterObject2.findIndex(obj => obj[columnName] === checkboxes[i].value);
                                              if (index !== -1 || index1 !== -1)   {
                    
                                                // delete filterObject[index1][columnName];
                                                delete filterObject2[index1][columnName];
                                              }
                                            }
                                          }
                                          setGridCustomFilter(filterObject2)
                                          var value = ""
                                          if (!searchVal1?.length) {
                                            x.push(value);
                                            let y = currentCol;
                                            y.push(
                                              cdnaColumns[currentCol1]?.data
                                            );
                                            setSearchVal1(x);
                                            setCurrentCol(y);
                                          } else{
                                            const Index = currentCol?.findIndex(
                                              (item) =>
                                              cdnaColumns[currentCol1]?.data ==
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
                                                cdnaColumns[currentCol1]?.data
                                              );
                                              setSearchVal1(x);
                                              setCurrentCol(y);
                                            }
                                            
                                          }
                                          setPage(0);
                                          purchaseSummaryList(
                                            activeTab,
                                            "",
                                            "asc",
                                            invoceTypes?.value,
                                            finFromYear?.value,
                                            monthFrom?.value,
                                            "", 1
                                          );
                                          
          
                                          const updatedFilterDropDownList = filterObject2.reduce((acc, item) => {
                                            const { rate, supplyType, placeOfSupply, noteType} = item;
          
                                            const updateList = (list, value) => {
                                              return list.includes(value) ? list : [...list, value];
                                            };
          
                                            if (rate !== undefined) {
                                              acc.rateDropDownList = updateList(acc.rateDropDownList, rate);
                                            }  else if (supplyType !== undefined) {
                                              acc.supplyTypeDropdownList = updateList(acc.supplyTypeDropdownList, supplyType);
                                            } else if (placeOfSupply !== undefined) {
                                              acc.posDropDownList = updateList(acc.posDropDownList, placeOfSupply);
                                            } 
                                            else if (noteType !== undefined) {
                                              acc.noteTypeDropDownList = updateList(acc.noteTypeDropDownList, noteType);
                                            } 
          
                                            return acc;
                                          }, { rateDropDownList: [], supplyTypeDropdownList: [],  posDropDownList: [],noteTypeDropDownList:[]});
          
                                          setFilterDropDownList(updatedFilterDropDownList);
          
                                        }
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
                                rateDropDownList,
                                supplyTypeDropdownList,
                                posDropDownList,
                                noteTypeDropDownList
                              } = filterDropDownList;
          
                              const listsToCheck = [
                                rateDropDownList,
                                supplyTypeDropdownList,
                                posDropDownList,
                                noteTypeDropDownList
                              ];
          
                              for (var j = 0; j < checkboxes.length; j++) {
                                for (var k = 0; k < listsToCheck.length; k++) {
                                  console.log(listsToCheck,"listToCheck")
                                  console.log(checkboxes.length,"listToCheck")
                                  if (listsToCheck[k]) {
                                    // For rcmDropDownList, check both conditions listsToCheck[k][i] == checkboxes[j].value and checkboxes?.length == 2
                                    if (k === 0 && checkboxes.length === 13) {
          
                                      for (var i = 0; i < listsToCheck[k].length; i++) {
                                        if (listsToCheck[k][i] == checkboxes[j].value) {
                                          $(checkboxes[j]).prop("checked", true);
                                          break;
                                        }
                                      }
                                    } else if (k === 1 && checkboxes.length === 2) {
          
                                      for (var i = 0; i < listsToCheck[k].length; i++) {
                                        console.log(checkboxes[j].value,listsToCheck[k][i],"testterr")
                                        if (listsToCheck[k][i] == checkboxes[j].value) {
                                          $(checkboxes[j]).prop("checked", true);
                                          break;
                                        }
                                      }
                                    }else if (k === 2 && checkboxes.length === 39) {
          
                                      for (var i = 0; i < listsToCheck[k].length; i++) {
                                        console.log(checkboxes[j].value,listsToCheck[k][i],"testterr")
                                        if (listsToCheck[k][i] == checkboxes[j].value ) {
                                          $(checkboxes[j]).prop("checked", true);
                                          break;
                                        }
                                      }
                                    }
                                    else {
          
                                      for (var i = 0; i < listsToCheck[k].length; i++) {
                                        if (listsToCheck[k][i] == checkboxes[j].value && k !== 0 && k !== 1 && k !== 2 ) {
                                          $(checkboxes[j]).prop("checked", true);
                                          break;
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }}
                            afterFilter={function (data) {
                              const hot = hotRef3?.current?.hotInstance;
                              const selectedValuecol = hot?.getSelected()[0][1];
                              const shouldExcludeTextBox = [3,6,8,9,11,12,13,14,15,16,17,18,19,].includes(selectedValuecol);
                              const shouldExcludeCheckBox = [6,12,13,14,].includes(selectedValuecol);
                              // if (hot?.getSelected()[0][1] != 2 && hot?.getSelected()[0][1] != 7 && hot?.getSelected()[0][1] != 8 && hot?.getSelected()[0][1] != 10 && hot?.getSelected()[0][1] != 14 && hot?.getSelected()[0][1] != 15 && hot?.getSelected()[0][1] != 16 && hot?.getSelected()[0][1] != 17 && hot?.getSelected()[0][1] != 18  && hot?.getSelected()[0][1] != 5 && hot?.getSelected()[0][1] != 11 && hot?.getSelected()[0][1] != 12 && hot?.getSelected()[0][1] != 13 ) {
                              if(!shouldExcludeTextBox){
                                let x = searchVal1
                                    var searchInput = document.querySelector(".htUIMultipleSelectSearch.htUIInput");
                                    var value = searchInput?.children[0].value;
                                    //  x.push(value)
                                    var columnName = cdnaColumns[currentCol1]?.data;
                                    let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                                    filterObject.push({ [columnName]: value });

                                    // setSearchVal1(x);
                                    // let y = currentCol;
                                    // y.push(handsontableColumns[currentCol1]?.data);

                                    // setCurrentCol(y)\
                                    if (!searchVal1?.length) {

                                      x.push(value);
                                      let y = currentCol;
                                      y.push(
                                        cdnaColumns[currentCol1]?.data
                                      );
                                      // console.log("jsx=",x,y)
                                      setSearchVal1(x);
                                      setCurrentCol(y);
                                    } else {

                                      const Index = currentCol?.findIndex(
                                        (item) =>
                                        cdnaColumns[currentCol1]?.data ==
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
                                          cdnaColumns[currentCol1]?.data
                                        );
                                        setSearchVal1(x);
                                        setCurrentCol(y);
                                      }
                                    }

                                    setPage(0);
                                          purchaseSummaryList(
                                            activeTab,
                                            "",
                                            "asc",
                                            invoceTypes?.value,
                                            finFromYear?.value,
                                            monthFrom?.value,
                                            "", 1
                                          );

                                  
          
                              }
                              else if (selectedValuecol == 3) {
                                const x = searchVal1
                                var searchInput1 = document.getElementById("custom1");
                                var searchInput2 = document.getElementById("custom2");
                                const invFromDate = searchInput1?.value
                                const invToDate = searchInput2?.value
                                var columnName = cdnaColumns[currentCol1]?.data;
                                var value = (searchInput1?.value || searchInput2?.value) && `${invFromDate ? invFromDate : invToDate}to${invToDate ? invToDate : invFromDate}`;
                                // var value = `${invFromDate}to${invToDate}`;
                                setSearchDate(searchInput1?.value);
                                setToDate(searchInput2?.value);
                                let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                filterObject.push({ [columnName]: value });
                                if (!searchVal1?.length) {

                                  x.push(value);
                                  let y = currentCol;
                                  y.push(
                                    cdnaColumns[currentCol1]?.data
                                  );
                                  // console.log("jsx=",x,y)
                                  setSearchVal1(x);
                                  setCurrentCol(y);
                                } else {

                                  const Index = currentCol?.findIndex(
                                    (item) =>
                                    cdnaColumns[currentCol1]?.data ==
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
                                      cdnaColumns[currentCol1]?.data
                                    );
                                    setSearchVal1(x);
                                    setCurrentCol(y);
                                  }
                                } 
                                setPage(0);
                               purchaseSummaryList(
                                            activeTab,
                                            "",
                                            "asc",
                                            invoceTypes?.value,
                                            finFromYear?.value,
                                            monthFrom?.value,
                                            "", 1
                                );
                                
          
                              }

                              else if (selectedValuecol == 9) {
                                const x = searchVal1
                                var searchInput1 = document.getElementById("custom1");
                                var searchInput2 = document.getElementById("custom2");
                                const invFromDate = searchInput1?.value
                                const invToDate = searchInput2?.value
                                var columnName = cdnaColumns[currentCol1]?.data;
                                var value = (searchInput1?.value || searchInput2?.value) && `${invFromDate ? invFromDate : invToDate}to${invToDate ? invToDate : invFromDate}`;
                                // var value = `${invFromDate}to${invToDate}`;
                                setSearchDate1(searchInput1?.value);
                                setSearchDate1To(searchInput2?.value);
                                let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                filterObject.push({ [columnName]: value });
                                if (!searchVal1?.length) {

                                  x.push(value);
                                  let y = currentCol;
                                  y.push(
                                    cdnaColumns[currentCol1]?.data
                                  );
                                  // console.log("jsx=",x,y)
                                  setSearchVal1(x);
                                  setCurrentCol(y);
                                } else {

                                  const Index = currentCol?.findIndex(
                                    (item) =>
                                    cdnaColumns[currentCol1]?.data ==
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
                                      cdnaColumns[currentCol1]?.data
                                    );
                                    setSearchVal1(x);
                                    setCurrentCol(y);
                                  }
                                } 
                                setPage(0);
                               purchaseSummaryList(
                                            activeTab,
                                            "",
                                            "asc",
                                            invoceTypes?.value,
                                            finFromYear?.value,
                                            monthFrom?.value,
                                            "", 1
                                );
                                
          
                              }

                              else if (selectedValuecol == 11) {
                                const x = searchVal1
                                var searchInput1 = document.getElementById("custom1");
                                var searchInput2 = document.getElementById("custom2");
                                const invFromDate = searchInput1?.value
                                const invToDate = searchInput2?.value
                                var columnName = cdnaColumns[currentCol1]?.data;
                                // var value = `${invFromDate}to${invToDate}`;
                                var value = (searchInput1?.value || searchInput2?.value) && `${invFromDate ? invFromDate : invToDate}to${invToDate ? invToDate : invFromDate}`;
                                setSearchDate2(searchInput1?.value);
                                setSearchDate2To(searchInput2?.value);
                                let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                filterObject.push({ [columnName]: value });
                                if (!searchVal1?.length) {

                                  x.push(value);
                                  let y = currentCol;
                                  y.push(
                                    cdnaColumns[currentCol1]?.data
                                  );
                                  // console.log("jsx=",x,y)
                                  setSearchVal1(x);
                                  setCurrentCol(y);
                                } else {

                                  const Index = currentCol?.findIndex(
                                    (item) =>
                                    cdnaColumns[currentCol1]?.data ==
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
                                      cdnaColumns[currentCol1]?.data
                                    );
                                    setSearchVal1(x);
                                    setCurrentCol(y);
                                  }
                                } 
                                setPage(0);
                               purchaseSummaryList(
                                            activeTab,
                                            "",
                                            "asc",
                                            invoceTypes?.value,
                                            finFromYear?.value,
                                            monthFrom?.value,
                                            "", 1
                                );
          
                              }
          
                             

                              else if (selectedValuecol == 8) {
                                const x = searchVal1
                                var searchInput1 = document.getElementById("amount1");
                                var searchInput2 = document.getElementById("amount2");
                                const invFromDate = searchInput1?.value?.replaceAll(",", "")
                                const invToDate = searchInput2?.value?.replaceAll(",", "")
                                var columnName = cdnaColumns[currentCol1]?.data;
                                var value = `${invFromDate}to${invToDate}`;
                                // var value = (searchInput1?.value || searchInput2?.value) && `${invFromDate ? invFromDate : invToDate}to${invToDate ? invToDate : invFromDate}`;
                                console.log(value,"wwwweeee")
                                setFromAmount(searchInput1?.value);
                                setToAmount(searchInput2?.value);
                                let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                filterObject.push({ [columnName]: value });
                                if (!searchVal1?.length) {

                                  x.push(value);
                                  let y = currentCol;
                                  y.push(
                                    cdnaColumns[currentCol1]?.data
                                  );
                                  // console.log("jsx=",x,y)
                                  setSearchVal1(x);
                                  setCurrentCol(y);
                                } else {

                                  const Index = currentCol?.findIndex(
                                    (item) =>
                                    cdnaColumns[currentCol1]?.data ==
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
                                      cdnaColumns[currentCol1]?.data
                                    );
                                    setSearchVal1(x);
                                    setCurrentCol(y);
                                  }
                                } 
                                setPage(0);
                               purchaseSummaryList(
                                            activeTab,
                                            "",
                                            "asc",
                                            invoceTypes?.value,
                                            finFromYear?.value,
                                            monthFrom?.value,
                                            "", 1
                                );
                               
          
                              }
          
                              else if (hot?.getSelected()[0][1] ==15) {
                                const x = searchVal1
                                var searchInput1 = document.getElementById("amount1");
                                var searchInput2 = document.getElementById("amount2");
                                const invFromDate = searchInput1?.value?.replaceAll(",", "")
                                const invToDate = searchInput2?.value?.replaceAll(",", "")
                                var columnName = cdnaColumns[currentCol1]?.data;
                                var value = `${invFromDate}to${invToDate}`;
                                // var value = (searchInput1?.value || searchInput2?.value) && `${invFromDate ? invFromDate : invToDate}to${invToDate ? invToDate : invFromDate}`;
                                setFromAmountTaxable(searchInput1?.value);
                                setToAmountTaxable(searchInput2?.value);
                                let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
          
                                filterObject.push({ [columnName]: value });
                                if (!searchVal1?.length) {

                                  x.push(value);
                                  let y = currentCol;
                                  y.push(
                                    cdnaColumns[currentCol1]?.data
                                  );
                                  // console.log("jsx=",x,y)
                                  setSearchVal1(x);
                                  setCurrentCol(y);
                                } else {

                                  const Index = currentCol?.findIndex(
                                    (item) =>
                                    cdnaColumns[currentCol1]?.data ==
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
                                      cdnaColumns[currentCol1]?.data
                                    );
                                    setSearchVal1(x);
                                    setCurrentCol(y);
                                  }
                                } 
                                setPage(0);
                               purchaseSummaryList(
                                            activeTab,
                                            "",
                                            "asc",
                                            invoceTypes?.value,
                                            finFromYear?.value,
                                            monthFrom?.value,
                                            "", 1
                                );
                                
          
                              }
          
                              else if (hot?.getSelected()[0][1] == 16) {
                                const x = searchVal1
                                var searchInput1 = document.getElementById("amount1");
                                var searchInput2 = document.getElementById("amount2");
                                const fromAmount = searchInput1?.value?.replaceAll(",", "")
                                const toAmount = searchInput2?.value?.replaceAll(",", "")
                                var columnName = cdnaColumns[currentCol1]?.data;
                                var value = `${fromAmount}to${toAmount}`;
                                // var value = (searchInput1?.value || searchInput2?.value) && `${fromAmount ? fromAmount : toAmount}to${toAmount ? toAmount : fromAmount}`;
                                setFromAmountIGST(searchInput1?.value);
                                setToAmountIGST(searchInput2?.value);
                                let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                filterObject.push({ [columnName]: value });
                                if (!searchVal1?.length) {

                                  x.push(value);
                                  let y = currentCol;
                                  y.push(
                                    cdnaColumns[currentCol1]?.data
                                  );
                                  // console.log("jsx=",x,y)
                                  setSearchVal1(x);
                                  setCurrentCol(y);
                                } else {

                                  const Index = currentCol?.findIndex(
                                    (item) =>
                                    cdnaColumns[currentCol1]?.data ==
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
                                      cdnaColumns[currentCol1]?.data
                                    );
                                    setSearchVal1(x);
                                    setCurrentCol(y);
                                  }
                                } 
                                setPage(0);
                               purchaseSummaryList(
                                            activeTab,
                                            "",
                                            "asc",
                                            invoceTypes?.value,
                                            finFromYear?.value,
                                            monthFrom?.value,
                                            "", 1
                                );
                                
          
                              }
          
                              else if (hot?.getSelected()[0][1] == 17) {
                                const x = searchVal1
                                var searchInput1 = document.getElementById("amount1");
                                var searchInput2 = document.getElementById("amount2");
                                const fromAmount = searchInput1?.value?.replaceAll(",", "")
                                const toAmount = searchInput2?.value?.replaceAll(",", "")
                                var columnName = cdnaColumns[currentCol1]?.data;
                                var value = `${fromAmount}to${toAmount}`;
                                // var value = (searchInput1?.value || searchInput2?.value) && `${fromAmount ? fromAmount : toAmount}to${toAmount ? toAmount : fromAmount}`;
                                setFromAmountCGST(searchInput1?.value);
                                setToAmountCGST(searchInput2?.value);
                                let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                filterObject.push({ [columnName]: value });
                                if (!searchVal1?.length) {

                                  x.push(value);
                                  let y = currentCol;
                                  y.push(
                                    cdnaColumns[currentCol1]?.data
                                  );
                                  // console.log("jsx=",x,y)
                                  setSearchVal1(x);
                                  setCurrentCol(y);
                                } else {

                                  const Index = currentCol?.findIndex(
                                    (item) =>
                                    cdnaColumns[currentCol1]?.data ==
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
                                      cdnaColumns[currentCol1]?.data
                                    );
                                    setSearchVal1(x);
                                    setCurrentCol(y);
                                  }
                                } 
                                setPage(0);
                               purchaseSummaryList(
                                            activeTab,
                                            "",
                                            "asc",
                                            invoceTypes?.value,
                                            finFromYear?.value,
                                            monthFrom?.value,
                                            "", 1
                                );
                               
          
                              }
          
                              else if (hot?.getSelected()[0][1] == 18) {
                                const x =  searchVal1
                                var searchInput1 = document.getElementById("amount1");
                                var searchInput2 = document.getElementById("amount2");
                                const fromAmount = searchInput1?.value?.replaceAll(",", "")
                                const toAmount = searchInput2?.value?.replaceAll(",", "")
                                var columnName = cdnaColumns[currentCol1]?.data;
                                var value = `${fromAmount}to${toAmount}`;
                                // var value = (searchInput1?.value || searchInput2?.value) && `${fromAmount ? fromAmount : toAmount}to${toAmount ? toAmount : fromAmount}`;
                                setFromAmountSGST(searchInput1?.value);
                                setToAmountSGST(searchInput2?.value);
                                let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                filterObject.push({ [columnName]: value });
                                if (!searchVal1?.length) {

                                  x.push(value);
                                  let y = currentCol;
                                  y.push(
                                    cdnaColumns[currentCol1]?.data
                                  );
                                  // console.log("jsx=",x,y)
                                  setSearchVal1(x);
                                  setCurrentCol(y);
                                } else {

                                  const Index = currentCol?.findIndex(
                                    (item) =>
                                    cdnaColumns[currentCol1]?.data ==
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
                                      cdnaColumns[currentCol1]?.data
                                    );
                                    setSearchVal1(x);
                                    setCurrentCol(y);
                                  }
                                } 
                                setPage(0);
                               purchaseSummaryList(
                                            activeTab,
                                            "",
                                            "asc",
                                            invoceTypes?.value,
                                            finFromYear?.value,
                                            monthFrom?.value,
                                            "", 1
                                );
          
                              }
          
                              else if (hot?.getSelected()[0][1] == 19) {
                                const x = searchVal1
                                var searchInput1 = document.getElementById("amount1");
                                var searchInput2 = document.getElementById("amount2");
                                const fromAmount = searchInput1?.value?.replaceAll(",", "")
                                const toAmount = searchInput2?.value?.replaceAll(",", "")
                                var columnName = cdnaColumns[currentCol1]?.data;
                                var value = `${fromAmount}to${toAmount}`;
                                // var value = (searchInput1?.value || searchInput2?.value) && `${fromAmount ? fromAmount : toAmount}to${toAmount ? toAmount : fromAmount}`;
                                setFromAmountCESS(searchInput1?.value);
                                setToAmountCESS(searchInput2?.value);
                                let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                filterObject.push({ [columnName]: value });
                                if (!searchVal1?.length) {

                                  x.push(value);
                                  let y = currentCol;
                                  y.push(
                                    cdnaColumns[currentCol1]?.data
                                  );
                                  // console.log("jsx=",x,y)
                                  setSearchVal1(x);
                                  setCurrentCol(y);
                                } else {

                                  const Index = currentCol?.findIndex(
                                    (item) =>
                                    cdnaColumns[currentCol1]?.data ==
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
                                      cdnaColumns[currentCol1]?.data
                                    );
                                    setSearchVal1(x);
                                    setCurrentCol(y);
                                  }
                                } 
                                setPage(0);
                               purchaseSummaryList(
                                            activeTab,
                                            "",
                                            "asc",
                                            invoceTypes?.value,
                                            finFromYear?.value,
                                            monthFrom?.value,
                                            "", 1
                                );
                               
          
                              }
          
                              else if (shouldExcludeCheckBox) {
                                let x = searchVal1
                                var checkboxes = document.getElementsByClassName('checkBoxClass');
                                arrChk = []
                                setFilterDropDownList([]);
                                var columnName = cdnaColumns[currentCol1]?.data;
                                let filterObject2 = !gridCustomFilter ? [] : gridCustomFilter
                                let filterObject = []
                                filterObject2 = filterObject2 == null || filterObject2.length <= 0 ? [] : filterObject2;
          
                                for (let i = 0; i < checkboxes.length; i++) {
                                  if (checkboxes[i].checked) {
                                    arrChk.push({ [columnName]: checkboxes[i].value });
                                    filterObject2.push({ [columnName]: checkboxes[i].value });
                                    filterObject.push(checkboxes[i].value);
                                  } else {
                                    console.log("else is running")
                                    let uniqueArray = filterObject.filter((obj, index, self) =>
                                      index === self.findIndex((t) => (
                                        JSON.stringify(t) === JSON.stringify(obj)
                                      ))
                                    );
                                    let uniqueArray2 = filterObject2.filter((obj, index, self) =>
                                    index === self.findIndex((t) => (
                                      JSON.stringify(t) === JSON.stringify(obj)
                                    ))
                                  );
                                    console.log(uniqueArray,"uniqArray")
                                    filterObject2 = uniqueArray2
                                    const index = filterObject.findIndex(obj => obj[columnName] === checkboxes[i].value);
                                    const index1 = filterObject2.findIndex(obj => obj[columnName] === checkboxes[i].value);
                                    if (index !== -1 || index1 !== -1)   {
          
                                      // delete filterObject[index1][columnName];
                                      delete filterObject2[index1][columnName];
                                    }
                                  }
                                }
                                
                                setGridCustomFilter(filterObject2)
                                var value = filterObject?.join("@#@#")
                                if (!searchVal1?.length) {
                                  x.push(value);
                                  let y = currentCol;
                                  y.push(
                                    cdnaColumns[currentCol1]?.data
                                  );
                                  setSearchVal1(x);
                                  setCurrentCol(y);
                                } else{
                                  const Index = currentCol?.findIndex(
                                    (item) =>
                                    cdnaColumns[currentCol1]?.data ==
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
                                      cdnaColumns[currentCol1]?.data
                                    );
                                    setSearchVal1(x);
                                    setCurrentCol(y);
                                  }
                                  
                                }
                                setPage(0);
                                purchaseSummaryList(
                                  activeTab,
                                  "",
                                  "asc",
                                  invoceTypes?.value,
                                  finFromYear?.value,
                                  monthFrom?.value,
                                  "", 1
                                );

          
                                const updatedFilterDropDownList = filterObject2.reduce((acc, item) => {
                                  const { rate, supplyType, placeOfSupply, noteType} = item;
                                  console.log(iteme,"item")

                                  const updateList = (list, value) => {
                                    return list.includes(value) ? list : [...list, value];
                                  };

                                  if (rate !== undefined) {
                                    acc.rateDropDownList = updateList(acc.rateDropDownList, rate);
                                  }  else if (supplyType !== undefined) {
                                    acc.supplyTypeDropdownList = updateList(acc.supplyTypeDropdownList, supplyType);
                                  } else if (placeOfSupply !== undefined) {
                                    acc.posDropDownList = updateList(acc.posDropDownList, placeOfSupply);
                                  } 
                                  else if (noteType !== undefined) {
                                    acc.noteTypeDropDownList = updateList(acc.noteTypeDropDownList, noteType);
                                  } 

                                  return acc;
                                }, { rateDropDownList: [], supplyTypeDropdownList: [],  posDropDownList: [],noteTypeDropDownList:[]});
          
                                setFilterDropDownList(updatedFilterDropDownList);
          
                              }
                            }}
                          />

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
                                // styles={customStyles}
                                />) : (<></>)}
                                 &nbsp; &nbsp;
                                {purchaseData?.length ? ( <span  >
                                  <b>  { ` ${pageNoTitle}`}</b>
                                </span>) : <></>}
                                &nbsp; &nbsp;
                                <ReactPaginate
                                  breakLabel="..."
                                  nextLabel=""
                                  onPageChange={(e) => handlePageClick(e?.selected)}
                                  pageRangeDisplayed={2}
                                  pageCount={pageCount}
                                  previousLabel=""
                                  renderOnZeroPageCount={null}
                                  marginPagesDisplayed={2}
                                  forcePage={page}
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
                        
                        {/* {purchaseData && (
                          <ReactPaginate
                            breakLabel="..."
                            nextLabel=""
                            onPageChange={(e) => handlePageClick(e?.selected)}
                            pageRangeDisplayed={2}
                            pageCount={pageCount}
                            previousLabel=""
                            renderOnZeroPageCount={null}
                            marginPagesDisplayed={2}
                            forcePage={page}
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
                        )} */}
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </TabPane>

            {/* Distribution of ITc */}
            <TabPane tabId="5" key="5">
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
                                  Invoices <br />
                                  <span>{totalInvoice ? totalInvoice : 0}</span>
                                </p>
                              </td>

                              <td>
                                <p className="mb-0">
                                  {" "}
                                  Invoice Values (₹)
                                  <br />
                                  <span>
                                    {totalInvoiceValue ? totalInvoiceValue : 0}
                                  </span>
                                </p>
                              </td>
                              <td>
                                <p className="mb-0">
                                  Taxable Values{"  "} (₹)
                                  <br />
                                  <span>
                                    {totalTaxableValue ? totalTaxableValue : 0}
                                  </span>
                                </p>
                              </td>

                              <td>
                                <p className="mb-0">
                                  IGST (₹)
                                  <br />
                                  <span>{totalIGST ? totalIGST : 0}</span>
                                </p>
                              </td>
                              <td>
                                <p className="mb-0">
                                  SGST (₹)
                                  <br />
                                  <span>{totalSGST ? totalSGST : 0}</span>
                                </p>
                              </td>
                              <td>
                                <p className="mb-0">
                                  CGST (₹)
                                  <br />
                                  <span>{totalCGST ? totalCGST : 0}</span>
                                </p>
                              </td>
                              <td>
                                <p className="mb-0">
                                  Cess (₹)
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
                          <Col sm={6}>
                            <Label className="form-label">Invoice Type</Label>
                            <Select
                              id="tax_invtype"
                              placeholder="Invoice Type"
                              theme={selectThemeColors}
                              components={animatedComponents}
                              isDisabled={true}
                              className="basic-multi-select"
                              classNamePrefix="select"
                              value={{ label: "ITC", value: "itc" }}
                            />
                          </Col>
                          <Col sm={6}>
                            <Label className="form-label">
                               Return Period
                            </Label>
                            <Select
                              id="tax_frDt"
                              placeholder="From"
                              isClearable={false}
                              theme={selectThemeColors}
                              closeMenuOnSelect={true}
                              isDisabled={true}
                              options={panDataFrom}
                              className="basic-multi-select"
                              classNamePrefix="select"
                              components={animatedComponents}
                              onChange={selectFromYear}
                              value={finFromYear}
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
                        {/* {purchaseData?.length > 0 ? ( */}
                          <HotTable
                            autoWrapRow={true}
                            style={purchaseData.length > 0 ? "": { textAlign: "center", overflowX: "hidden" }}
                            data={purchaseData.length > 0 ? purchaseData : [{ eligibilityOfITC: "No Data Found" }]}
                            autoColumnSize={true}
                            colHeaders={colHeaders}
                            rowHeights={RowSize}
                            columnHeaderHeight={columnHeaderSize}
                            afterGetColHeader={theaderDistrubution}
                            stretchH="all"
                            preventOverflow="horizontal"
                            viewportColumnRenderingOffset={100}
                            columns={purchaseData.length > 0 ? distributionOfItcColumns : distributionOfItcColumnsEmpty}
                            contextMenu={false}
                            bindRowsWithHeaders={true}
                            licenseKey="non-commercial-and-evaluation"
                            height="auto"
                            ref={hotRef4}
                            hiddenColumns={false}
                            afterOnCellMouseDown={localAfterOnCellMouseDown5}
                            mergeCells={purchaseData.length > 0 ? false : [{ row: 0, col: 1, rowspan: 1, colspan: 10 }]}
                            cells={function (row, col) {
                              var cp = {};
                              const hot = hotRef?.current?.hotInstance;
                              cp.className = "child";
                              if (
                                col == 12 ||
                                col == 13 ||
                                col == 14 ||
                                col == 15 ||
                                col == 16 ||
                                col == 17 ||
                                col == 18 ||
                                col == 19
                              ) {
                                cp.className = "text-end";
                              }

                              return cp;
                            }}
                            filters={true}
                            dropdownMenu={{
                              items: {
                                filter_by_value: {
                                  name: "Search Value",
                                  // hide the 'Filter by value' list from all columns but the first one
                                  hidden() {
                                    const hot = hotRef4?.current?.hotInstance;
                                    console.log(
                                      "noon col",
                                      hot.getSelected()[0][1],
                                      hot
                                    );
                                    return (
                                      this.getSelected()[0][1] == 7 ||  // Date
                                      this.getSelected()[0][1] == 9 ||  // Original In date 1
                                      this.getSelected()[0][1] ==11 ||   //  Original Inv Date2
                                      this.getSelected()[0][1] == 13 || 
                                      this.getSelected()[0][1] == 14 ||
                                      this.getSelected()[0][1] == 15 ||
                                      this.getSelected()[0][1] == 1 ||
                                      this.getSelected()[0][1] == 2 ||
                                      this.getSelected()[0][1] == 5 ||
                                      this.getSelected()[0][1] == 12 ||
                                      this.getSelected()[0][1] == 16 
                                    );
                                  },
                                },

                                about: { // For CheckBox custom option

                                  name: `<div  style="margin-left:6px">Select Options<label class="float-end text-danger "><a><u id="selectAll">Select All</u></a></label></div> <div  class="checkboxmenu custom-scrollbar"> <div >  <table id="searchTable" >
                                  ${dropDonwNameTab5 &&
                                    dropDonwNameTab5?.map((index) => (
                                      `<tr><td><input class="checkBoxClass" type="checkbox" value="${index?.value}" /> <span class="fw-normal">${index?.label?.length > 20 ? index?.label?.substring(0, 20) + "..." : index?.label}</span> </td></tr>`
                                    )).join('')
                                    }
          
                                    </table></div>
                                    </div>`, // Name can contain HTML 
                                  hidden() {
                                    const selectedCol = this.getSelectedRangeLast().to.col;
                                    const isHiddenCol = ![1,2,5,12].includes(selectedCol);
          
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

                                option5: {
                                  name: `<div style="margin-top:10px"> From Date <br><input type='date' data-date="" data-date-format="DD MMMM YYYY" min='2017-07-01' max=${new Date()
                                    .toISOString()
                                    .slice(
                                      0,
                                      10
                                    )}  class='custom-date col-md-11' placeholder='DD-MM-YYYY' id='custom1' name='date' value=${searchDate} > <br/> 
                                      
                                      To Date <br><input type='date' data-date="" data-date-format="DD MMMM YYYY" min='2017-07-01' max=${new Date()
                                      .toISOString()
                                      .slice(
                                        0,
                                        10
                                      )}  class='custom-date col-md-11' placeholder='DD-MM-YYYY' id='custom2' name='date' value=${toDate} >
                                     </div> `,
                                  hidden() {
                                    return this.getSelectedRangeLast().to.col != 7;
                                  },
          
                                  //disabled: true,
                                  callback: function (key, selection, clickEvent) {
          
                                    console.log("date picker clicked");
                                    var src = clickEvent.target;
          
                                    if (src.tagName === "INPUT") {
                                      clickEvent.stopImmediatePropagation();
                                    }
          
                                    clickEvent.stopImmediatePropagation();
                                  },
                                },

                                option6: {
                                  name: `<div style="margin-top:10px"> From Date <br><input type='date' data-date="" data-date-format="DD MMMM YYYY" min='2017-07-01' max=${new Date()
                                    .toISOString()
                                    .slice(
                                      0,
                                      10
                                    )}  class='custom-date col-md-11' placeholder='DD-MM-YYYY' id='custom1' name='date' value=${searchDate1} > <br/> 
                                      
                                      To Date <br><input type='date' data-date="" data-date-format="DD MMMM YYYY" min='2017-07-01' max=${new Date()
                                      .toISOString()
                                      .slice(
                                        0,
                                        10
                                      )}  class='custom-date col-md-11' placeholder='DD-MM-YYYY' id='custom2' name='date' value=${searchDate1To} >
                                     </div> `,
                                  hidden() {
                                    return this.getSelectedRangeLast().to.col != 9;
                                  },
          
                                  //disabled: true,
                                  callback: function (key, selection, clickEvent) {
          
                                    console.log("date picker clicked");
                                    var src = clickEvent.target;
          
                                    if (src.tagName === "INPUT") {
                                      clickEvent.stopImmediatePropagation();
                                    }
          
                                    clickEvent.stopImmediatePropagation();
                                  },
                                },

                                option7: {
                                  name: `<div style="margin-top:10px"> From Date <br><input type='date' data-date="" data-date-format="DD MMMM YYYY" min='2017-07-01' max=${new Date()
                                    .toISOString()
                                    .slice(
                                      0,
                                      10
                                    )}  class='custom-date col-md-11' placeholder='DD-MM-YYYY' id='custom1' name='date' value=${searchDate2} > <br/> 
                                      
                                      To Date <br><input type='date' data-date="" data-date-format="DD MMMM YYYY" min='2017-07-01' max=${new Date()
                                      .toISOString()
                                      .slice(
                                        0,
                                        10
                                      )}  class='custom-date col-md-11' placeholder='DD-MM-YYYY' id='custom2' name='date' value=${searchDate2To} >
                                     </div> `,
                                  hidden() {
                                    return this.getSelectedRangeLast().to.col != 11;
                                  },
          
                                  //disabled: true,
                                  callback: function (key, selection, clickEvent) {
          
                                    console.log("date picker clicked");
                                    var src = clickEvent.target;
          
                                    if (src.tagName === "INPUT") {
                                      clickEvent.stopImmediatePropagation();
                                    }
          
                                    clickEvent.stopImmediatePropagation();
                                  },
                                },
                                option10: generateOption(13, fromAmountIGST, toAmountIGST),
                                option11: generateOption(14, fromAmountCGST, toAmountCGST),
                                option12: generateOption(15, fromAmountSGST, toAmountSGST),
                                option13: generateOption(16, fromAmountCESS, toAmountCESS),
                                

                                clear: {
                                  name: `<button id='btnClear'  name='Clear' tabIndex="-1"   value='Clear'>Clear</button>`,
                                  
                                  callback: function (key, selection, clickEvent) {
          
                                    var src = clickEvent.target;
          
                                    if (src?.tagName?.toLowerCase() === "button") {
                                      if (clickEvent.target.id == "btnClear") {
                                        const hot = hotRef4?.current?.hotInstance;
                                        const selectedValue = hot?.getSelected()[0][1];
                                        const isValidTextColumn = [7,9,11,13,14,15,16,1,2,5,12].includes(selectedValue);
                                        const isValidCheckBoxColumn = [1,2,5,12].includes(selectedValue);

                                        if (!isValidTextColumn) {
                                          let x = searchVal1
                                          var value = "";
                                          var columnName = distributionOfItcColumns[currentCol1]?.data;
                                          let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
          
                                          filterObject.push({ [columnName]: value });
                                          if (!searchVal1?.length) {
                                            x.push(value);
                                            let y = currentCol;
                                            y.push(
                                              distributionOfItcColumns[currentCol1]?.data
                                            );
                                            // console.log("jsx=",x,y)
                                            setSearchVal1(x);
                                            setCurrentCol(y);
                                          } else {
                                            const Index = currentCol?.findIndex(
                                              (item) =>
                                              distributionOfItcColumns[currentCol1]?.data ==
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
                                                distributionOfItcColumns[currentCol1]?.data
                                              );
                                              setSearchVal1(x);
                                              setCurrentCol(y);
                                            }
                                          }

                                          setPage(0);
                                          purchaseSummaryList(
                                                       activeTab,
                                                       "",
                                                       "asc",
                                                       invoceTypes?.value,
                                                       finFromYear?.value,
                                                       monthFrom?.value,
                                                       "", 1
                                           );
                        
          
                                        }

                                        else if (hot?.getSelected()[0][1] == 7) {
          
                                          var columnName = distributionOfItcColumns[currentCol1]?.data;
                                          var value = '';
                                          setSearchDate('');
                                          setToDate('');
                                          let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
          
                                          filterObject.push({ [columnName]: value });
                                          if (!searchVal1?.length) {
                                            x.push(value);
                                            let y = currentCol;
                                            y.push(
                                              distributionOfItcColumns[currentCol1]?.data
                                            );
                                            // console.log("jsx=",x,y)
                                            setSearchVal1(x);
                                            setCurrentCol(y);
                                          } else {
                                            const Index = currentCol?.findIndex(
                                              (item) =>
                                              distributionOfItcColumns[currentCol1]?.data ==
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
                                                distributionOfItcColumns[currentCol1]?.data
                                              );
                                              setSearchVal1(x);
                                              setCurrentCol(y);
                                            }
                                          }

                                          setPage(0);
                                          purchaseSummaryList(
                                                       activeTab,
                                                       "",
                                                       "asc",
                                                       invoceTypes?.value,
                                                       finFromYear?.value,
                                                       monthFrom?.value,
                                                       "", 1
                                           );

          
                                        }
                                        else if (hot?.getSelected()[0][1] == 9) {
          
                                          var columnName = distributionOfItcColumns[currentCol1]?.data;
                                          var value = '';
                                          setSearchDate1('');
                                          setSearchDate1To('');
                                          let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
          
                                          filterObject.push({ [columnName]: value });
                                          if (!searchVal1?.length) {
                                            x.push(value);
                                            let y = currentCol;
                                            y.push(
                                              distributionOfItcColumns[currentCol1]?.data
                                            );
                                            // console.log("jsx=",x,y)
                                            setSearchVal1(x);
                                            setCurrentCol(y);
                                          } else {
                                            const Index = currentCol?.findIndex(
                                              (item) =>
                                              distributionOfItcColumns[currentCol1]?.data ==
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
                                                distributionOfItcColumns[currentCol1]?.data
                                              );
                                              setSearchVal1(x);
                                              setCurrentCol(y);
                                            }
                                          }

                                          setPage(0);
                                          purchaseSummaryList(
                                                       activeTab,
                                                       "",
                                                       "asc",
                                                       invoceTypes?.value,
                                                       finFromYear?.value,
                                                       monthFrom?.value,
                                                       "", 1
                                           );
          
                                        }
                                        else if (hot?.getSelected()[0][1] == 11) {
          
                                          var columnName = distributionOfItcColumns[currentCol1]?.data;
                                          var value = '';
                                          setSearchDate2('');
                                          setSearchDate2To('');
                                          let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
          
                                          filterObject.push({ [columnName]: value });
                                          if (!searchVal1?.length) {
                                            x.push(value);
                                            let y = currentCol;
                                            y.push(
                                              distributionOfItcColumns[currentCol1]?.data
                                            );
                                            // console.log("jsx=",x,y)
                                            setSearchVal1(x);
                                            setCurrentCol(y);
                                          } else {
                                            const Index = currentCol?.findIndex(
                                              (item) =>
                                              distributionOfItcColumns[currentCol1]?.data ==
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
                                                distributionOfItcColumns[currentCol1]?.data
                                              );
                                              setSearchVal1(x);
                                              setCurrentCol(y);
                                            }
                                          }

                                          setPage(0);
                                          purchaseSummaryList(
                                                       activeTab,
                                                       "",
                                                       "asc",
                                                       invoceTypes?.value,
                                                       finFromYear?.value,
                                                       monthFrom?.value,
                                                       "", 1
                                           );
                                        }
                                        else if (hot?.getSelected()[0][1] == 13) {
                                          const x = searchVal1
                                          var columnName = distributionOfItcColumns[currentCol1]?.data;
                                          var value = '';
                                          setFromAmountIGST('');
                                          setToAmountIGST('');
          
                                          let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
          
                                          filterObject.push({ [columnName]: value });
                                          if (!searchVal1?.length) {
                                            x.push(value);
                                            let y = currentCol;
                                            y.push(
                                              distributionOfItcColumns[currentCol1]?.data
                                            );
                                            // console.log("jsx=",x,y)
                                            setSearchVal1(x);
                                            setCurrentCol(y);
                                          } else {
                                            const Index = currentCol?.findIndex(
                                              (item) =>
                                              distributionOfItcColumns[currentCol1]?.data ==
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
                                                distributionOfItcColumns[currentCol1]?.data
                                              );
                                              setSearchVal1(x);
                                              setCurrentCol(y);
                                            }
                                          }

                                          setPage(0);
                                          purchaseSummaryList(
                                                       activeTab,
                                                       "",
                                                       "asc",
                                                       invoceTypes?.value,
                                                       finFromYear?.value,
                                                       monthFrom?.value,
                                                       "", 1
                                           );
                                         
                                        }
                                        else if (hot?.getSelected()[0][1] == 14) {
                                          const x = searchVal1
                                          var columnName = distributionOfItcColumns[currentCol1]?.data;
                                          var value = '';
                                          setFromAmountCGST('');
                                          setToAmountCGST('');
          
                                          let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
          
                                          filterObject.push({ [columnName]: value });
                                          if (!searchVal1?.length) {
                                            x.push(value);
                                            let y = currentCol;
                                            y.push(
                                              distributionOfItcColumns[currentCol1]?.data
                                            );
                                            // console.log("jsx=",x,y)
                                            setSearchVal1(x);
                                            setCurrentCol(y);
                                          } else {
                                            const Index = currentCol?.findIndex(
                                              (item) =>
                                              distributionOfItcColumns[currentCol1]?.data ==
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
                                                distributionOfItcColumns[currentCol1]?.data
                                              );
                                              setSearchVal1(x);
                                              setCurrentCol(y);
                                            }
                                          }

                                          setPage(0);
                                          purchaseSummaryList(
                                                       activeTab,
                                                       "",
                                                       "asc",
                                                       invoceTypes?.value,
                                                       finFromYear?.value,
                                                       monthFrom?.value,
                                                       "", 1
                                           );
                                        }
                                        else if (hot?.getSelected()[0][1] == 15) {
                                          const x = searchVal1
                                          var columnName = distributionOfItcColumns[currentCol1]?.data;
                                          var value = '';
                                          setFromAmountSGST('');
                                          setToAmountSGST('');
          
                                          let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
          
                                          filterObject.push({ [columnName]: value });
                                          if (!searchVal1?.length) {
                                            x.push(value);
                                            let y = currentCol;
                                            y.push(
                                              distributionOfItcColumns[currentCol1]?.data
                                            );
                                            // console.log("jsx=",x,y)
                                            setSearchVal1(x);
                                            setCurrentCol(y);
                                          } else {
                                            const Index = currentCol?.findIndex(
                                              (item) =>
                                              distributionOfItcColumns[currentCol1]?.data ==
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
                                                distributionOfItcColumns[currentCol1]?.data
                                              );
                                              setSearchVal1(x);
                                              setCurrentCol(y);
                                            }
                                          }

                                          setPage(0);
                                          purchaseSummaryList(
                                                       activeTab,
                                                       "",
                                                       "asc",
                                                       invoceTypes?.value,
                                                       finFromYear?.value,
                                                       monthFrom?.value,
                                                       "", 1
                                           );
          
                                        }
                                        else if (hot?.getSelected()[0][1] == 16) {
                                          const x = searchVal1
                                          var columnName = distributionOfItcColumns[currentCol1]?.data;
                                          var value = '';
                                          setFromAmountCESS('');
                                          setToAmountCESS('');
                                          let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                          filterObject.push({ [columnName]: value });
                                          if (!searchVal1?.length) {
                                            x.push(value);
                                            let y = currentCol;
                                            y.push(
                                              distributionOfItcColumns[currentCol1]?.data
                                            );
                                            // console.log("jsx=",x,y)
                                            setSearchVal1(x);
                                            setCurrentCol(y);
                                          } else {
                                            const Index = currentCol?.findIndex(
                                              (item) =>
                                              distributionOfItcColumns[currentCol1]?.data ==
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
                                                distributionOfItcColumns[currentCol1]?.data
                                              );
                                              setSearchVal1(x);
                                              setCurrentCol(y);
                                            }
                                          }

                                          setPage(0);
                                          purchaseSummaryList(
                                                       activeTab,
                                                       "",
                                                       "asc",
                                                       invoceTypes?.value,
                                                       finFromYear?.value,
                                                       monthFrom?.value,
                                                       "", 1
                                           );

                                        }
                                        else if (isValidCheckBoxColumn) {
                                          let x = searchVal1
                                          var checkboxes = document.getElementsByClassName('checkBoxClass');
          
                                          arrChk = []
                                          setFilterDropDownList([]);
                                          var columnName = distributionOfItcColumns[currentCol1]?.data;
                                          let filterObject2 = !gridCustomFilter ? [] : gridCustomFilter
                                          let filterObject = []
                                          filterObject2 = filterObject2 == null || filterObject2.length <= 0 ? [] : filterObject2;
          
                                          for (let i = 0; i < checkboxes.length; i++) {
                                            if (checkboxes[i].checked) {
                                            //   arrChk.push({ [columnName]: checkboxes[i].value });
                                            //   filterObject2.push({ [columnName]: checkboxes[i].value });
                                            //   filterObject.push(checkboxes[i].value);
                                            // } else {
                                              console.log("else is running")
                                              let uniqueArray = filterObject.filter((obj, index, self) =>
                                                index === self.findIndex((t) => (
                                                  JSON.stringify(t) === JSON.stringify(obj)
                                                ))
                                              );
                                              let uniqueArray2 = filterObject2.filter((obj, index, self) =>
                                              index === self.findIndex((t) => (
                                                JSON.stringify(t) === JSON.stringify(obj)
                                              ))
                                            );
                                              console.log(uniqueArray,"uniqArray")
                                              filterObject2 = uniqueArray2
                                              const index = filterObject.findIndex(obj => obj[columnName] === checkboxes[i].value);
                                              const index1 = filterObject2.findIndex(obj => obj[columnName] === checkboxes[i].value);
                                              if (index !== -1 || index1 !== -1)   {
                    
                                                // delete filterObject[index1][columnName];
                                                delete filterObject2[index1][columnName];
                                              }
                                            }
                                          }
                                          setGridCustomFilter(filterObject2)
                                          var value = ""
                                          if (!searchVal1?.length) {
                                            x.push(value);
                                            let y = currentCol;
                                            y.push(
                                              distributionOfItcColumns[currentCol1]?.data
                                            );
                                            setSearchVal1(x);
                                            setCurrentCol(y);
                                          } else{
                                            const Index = currentCol?.findIndex(
                                              (item) =>
                                              distributionOfItcColumns[currentCol1]?.data ==
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
                                                distributionOfItcColumns[currentCol1]?.data
                                              );
                                              setSearchVal1(x);
                                              setCurrentCol(y);
                                            }
                                            
                                          }
                                          setPage(0);
                                          purchaseSummaryList(
                                            activeTab,
                                            "",
                                            "asc",
                                            invoceTypes?.value,
                                            finFromYear?.value,
                                            monthFrom?.value,
                                            "", 1
                                          );
          
                                          const updatedFilterDropDownList = filterObject2.reduce((acc, item) => {
                                            const { eligibilityOfITC, unitType, noteType, sezSupplier, } = item;
          
                                            const updateList = (list, value) => {
                                              return list.includes(value) ? list : [...list, value];
                                            };
          
                                            if (eligibilityOfITC !== undefined) {
                                              acc.eligibilityofITCDropDownList = updateList(acc.eligibilityofITCDropDownList, eligibilityOfITC);
                                            } else if (unitType !== undefined) {
                                              acc.unitTypeDropDownList = updateList(acc.unitTypeDropDownList, unitType);
                                            } else if (noteType !== undefined) {
                                              acc.noteTypeDropDownList = updateList(acc.noteTypeDropDownList, noteType);
                                            } else if (sezSupplier !== undefined) {
                                              acc.sezDropDownList = updateList(acc.sezDropDownList, sezSupplier);
                                            } 
          
                                            return acc;
                                          }, { eligibilityofITCDropDownList: [], unitTypeDropDownList: [], noteTypeDropDownList:[], sezDropDownList:[] });
          
                                          setFilterDropDownList(updatedFilterDropDownList);
          
                                        }
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
                                eligibilityofITCDropDownList,
                                unitTypeDropDownList,
                                noteTypeDropDownList,
                                sezDropDownList
                              } = filterDropDownList;
          
                              const listsToCheck = [
                                eligibilityofITCDropDownList,
                                unitTypeDropDownList,
                                noteTypeDropDownList,
                                sezDropDownList
                              ];
          
                              for (var j = 0; j < checkboxes.length; j++) {
                                for (var k = 0; k < listsToCheck.length; k++) {
                                  if (listsToCheck[k]) {
                                    console.log(k,"kkkkkkk")
                                    // console.log(checkboxes.length,"kkkkkkk")
                                    // For rcmDropDownList, check both conditions listsToCheck[k][i] == checkboxes[j].value and checkboxes?.length == 2
                                    if (k === 0 && checkboxes.length === 2) {
          
                                      for (var i = 0; i < listsToCheck[k].length; i++) {
                                        if (listsToCheck[k][i] == checkboxes[j].value) {
                                          $(checkboxes[j]).prop("checked", true);
                                          break;
                                        }
                                      }
                                    } 
                                    // else if (k === 1 && checkboxes.length === 2) {
          
                                    //   for (var i = 0; i < listsToCheck[k].length; i++) {
                                    //     if (listsToCheck[k][i] == checkboxes[j].value) {
                                    //       $(checkboxes[j]).prop("checked", true);
                                    //       break;
                                    //     }
                                    //   }
                                    // }

                                    // else if (k === 2 && checkboxes.length === 2) {
          
                                    //   for (var i = 0; i < listsToCheck[k].length; i++) {
                                    //     if (listsToCheck[k][i] == checkboxes[j].value) {
                                    //       $(checkboxes[j]).prop("checked", true);
                                    //       break;
                                    //     }
                                    //   }
                                    // }
                                    else if (k === 3 && checkboxes.length === 2) {
                                      console.log(k,"testttt")
                                      for (var i = 0; i < listsToCheck[k].length; i++) {
                                        if (listsToCheck[k][i] == checkboxes[j].value) {
                                          $(checkboxes[j]).prop("checked", true);
                                          break;
                                        }
                                      }
                                    }

                                    else {
          
                                      for (var i = 0; i < listsToCheck[k].length; i++ ) {
                                        if (listsToCheck[k][i] == checkboxes[j].value && k != 0  && k !=3) {
                                          $(checkboxes[j]).prop("checked", true);
                                          break;
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }}
                            afterFilter={function (data) {
                              const hot = hotRef4?.current?.hotInstance;
                              const selectedValuecol = hot?.getSelected()[0][1];
                              // const shouldExcludeTextBox = [3, 5, 6, 4, 7, 8, 9, 10, 11, 12, 13, 14, 17].includes(selectedValuecol);
                              const shouldExcludeCheckBox = [1,2,5,12].includes(selectedValuecol);
                              if (hot?.getSelected()[0][1] != 7 && hot?.getSelected()[0][1] != 9 && hot?.getSelected()[0][1] != 11 && hot?.getSelected()[0][1] != 13 && hot?.getSelected()[0][1] != 14 && hot?.getSelected()[0][1] != 15 && hot?.getSelected()[0][1] != 16 && hot?.getSelected()[0][1] != 1 && hot?.getSelected()[0][1] != 2 && hot?.getSelected()[0][1] != 5 && hot?.getSelected()[0][1] != 12) {
                                let x = searchVal1
                                var searchInput = document.querySelector(".htUIMultipleSelectSearch.htUIInput");
                                var value = searchInput?.children[0].value;
                                //  x.push(value)
                                var columnName = distributionOfItcColumns[currentCol1]?.data;
                                let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
          
                                filterObject.push({ [columnName]: value });
          
                                // setSearchVal1(x);
                                // let y = currentCol;
                                // y.push(handsontableColumns[currentCol1]?.data);
          
                                // setCurrentCol(y)\
                                if (!searchVal1?.length) {
          
                                  x.push(value);
                                  let y = currentCol;
                                  y.push(
                                    distributionOfItcColumns[currentCol1]?.data
                                  );
                                  // console.log("jsx=",x,y)
                                  setSearchVal1(x);
                                  setCurrentCol(y);
                                } else {
          
                                  const Index = currentCol?.findIndex(
                                    (item) =>
                                    distributionOfItcColumns[currentCol1]?.data ==
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
                                      distributionOfItcColumns[currentCol1]?.data
                                    );
                                    setSearchVal1(x);
                                    setCurrentCol(y);
                                  }
                                }
                                setPage(0);
                                purchaseSummaryList(
                                             activeTab,
                                             "",
                                             "asc",
                                             invoceTypes?.value,
                                             finFromYear?.value,
                                             monthFrom?.value,
                                             "", 1
                                 );
          
                                
          
                              }
                              else if (selectedValuecol == 7) {
                                const x = searchVal1
                                var searchInput1 = document.getElementById("custom1");
                                var searchInput2 = document.getElementById("custom2");
                                const invFromDate = searchInput1?.value
                                const invToDate = searchInput2?.value
                                var columnName = distributionOfItcColumns[currentCol1]?.data;
                                // var value = `${invFromDate}to${invToDate}`;
                                var value = (searchInput1?.value || searchInput2?.value) && `${invFromDate ? invFromDate : invToDate}to${invToDate ? invToDate : invFromDate}`;
                                setSearchDate(searchInput1?.value);
                                setToDate(searchInput2?.value);
                                let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                filterObject.push({ [columnName]: value });
                                if (!searchVal1?.length) {
          
                                  x.push(value);
                                  let y = currentCol;
                                  y.push(
                                    distributionOfItcColumns[currentCol1]?.data
                                  );
                                  // console.log("jsx=",x,y)
                                  setSearchVal1(x);
                                  setCurrentCol(y);
                                } else {
          
                                  const Index = currentCol?.findIndex(
                                    (item) =>
                                    distributionOfItcColumns[currentCol1]?.data ==
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
                                      distributionOfItcColumns[currentCol1]?.data
                                    );
                                    setSearchVal1(x);
                                    setCurrentCol(y);
                                  }
                                }
                                setPage(0);
                                purchaseSummaryList(
                                             activeTab,
                                             "",
                                             "asc",
                                             invoceTypes?.value,
                                             finFromYear?.value,
                                             monthFrom?.value,
                                             "", 1
                                 );
                                
          
                              }

                              else if (selectedValuecol == 9) {
                                const x = searchVal1
                                var searchInput1 = document.getElementById("custom1");
                                var searchInput2 = document.getElementById("custom2");
                                const invFromDate = searchInput1?.value
                                const invToDate = searchInput2?.value
                                var columnName = distributionOfItcColumns[currentCol1]?.data;
                                // var value = `${invFromDate}to${invToDate}`;
                                var value = (searchInput1?.value || searchInput2?.value) && `${invFromDate ? invFromDate : invToDate}to${invToDate ? invToDate : invFromDate}`;
                                setSearchDate1(searchInput1?.value);
                                setSearchDate1To(searchInput2?.value);
                                let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                filterObject.push({ [columnName]: value });
                                if (!searchVal1?.length) {
          
                                  x.push(value);
                                  let y = currentCol;
                                  y.push(
                                    distributionOfItcColumns[currentCol1]?.data
                                  );
                                  // console.log("jsx=",x,y)
                                  setSearchVal1(x);
                                  setCurrentCol(y);
                                } else {
          
                                  const Index = currentCol?.findIndex(
                                    (item) =>
                                    distributionOfItcColumns[currentCol1]?.data ==
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
                                      distributionOfItcColumns[currentCol1]?.data
                                    );
                                    setSearchVal1(x);
                                    setCurrentCol(y);
                                  }
                                }
                                setPage(0);
                                purchaseSummaryList(
                                             activeTab,
                                             "",
                                             "asc",
                                             invoceTypes?.value,
                                             finFromYear?.value,
                                             monthFrom?.value,
                                             "", 1
                                 );
                                
          
                              }
          
                              else if (selectedValuecol == 11) {
                                const x = searchVal1
                                var searchInput1 = document.getElementById("custom1");
                                var searchInput2 = document.getElementById("custom2");
                                const invFromDate = searchInput1?.value
                                const invToDate = searchInput2?.value
                                var columnName = distributionOfItcColumns[currentCol1]?.data;
                                // var value = `${invFromDate}to${invToDate}`;
                                var value = (searchInput1?.value || searchInput2?.value) && `${invFromDate ? invFromDate : invToDate}to${invToDate ? invToDate : invFromDate}`;
                                setSearchDate2(searchInput1?.value);
                                setSearchDate2To(searchInput2?.value);
                                let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                filterObject.push({ [columnName]: value });
                                if (!searchVal1?.length) {
          
                                  x.push(value);
                                  let y = currentCol;
                                  y.push(
                                    distributionOfItcColumns[currentCol1]?.data
                                  );
                                  // console.log("jsx=",x,y)
                                  setSearchVal1(x);
                                  setCurrentCol(y);
                                } else {
          
                                  const Index = currentCol?.findIndex(
                                    (item) =>
                                    distributionOfItcColumns[currentCol1]?.data ==
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
                                      distributionOfItcColumns[currentCol1]?.data
                                    );
                                    setSearchVal1(x);
                                    setCurrentCol(y);
                                  }
                                }
                                setPage(0);
                                purchaseSummaryList(
                                             activeTab,
                                             "",
                                             "asc",
                                             invoceTypes?.value,
                                             finFromYear?.value,
                                             monthFrom?.value,
                                             "", 1
                                 );
                                
          
                              }

                              else if (hot?.getSelected()[0][1] == 13) {
                                const x = searchVal1
                                var searchInput1 = document.getElementById("amount1");
                                var searchInput2 = document.getElementById("amount2");
                                const fromAmount = searchInput1?.value?.replaceAll(",", "")
                                const toAmount = searchInput2?.value?.replaceAll(",", "")
                                var columnName = distributionOfItcColumns[currentCol1]?.data;
                                var value = `${fromAmount}to${toAmount}`;
                                // var value = (searchInput1?.value || searchInput2?.value) && `${fromAmount ? fromAmount : toAmount}to${toAmount ? toAmount : fromAmount}`;
                                setFromAmountIGST(searchInput1?.value);
                                setToAmountIGST(searchInput2?.value);
                                let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                filterObject.push({ [columnName]: value });
                                if (!searchVal1?.length) {
          
                                  x.push(value);
                                  let y = currentCol;
                                  y.push(
                                    distributionOfItcColumns[currentCol1]?.data
                                  );
                                  // console.log("jsx=",x,y)
                                  setSearchVal1(x);
                                  setCurrentCol(y);
                                } else {
          
                                  const Index = currentCol?.findIndex(
                                    (item) =>
                                    distributionOfItcColumns[currentCol1]?.data ==
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
                                      distributionOfItcColumns[currentCol1]?.data
                                    );
                                    setSearchVal1(x);
                                    setCurrentCol(y);
                                  }
                                }
                                setPage(0);
                                purchaseSummaryList(
                                             activeTab,
                                             "",
                                             "asc",
                                             invoceTypes?.value,
                                             finFromYear?.value,
                                             monthFrom?.value,
                                             "", 1
                                 );
                                
          
                              }
          
                              else if (hot?.getSelected()[0][1] == 14) {
                                const x = searchVal1
                                var searchInput1 = document.getElementById("amount1");
                                var searchInput2 = document.getElementById("amount2");
                                const fromAmount = searchInput1?.value?.replaceAll(",", "")
                                const toAmount = searchInput2?.value?.replaceAll(",", "")
                                var columnName = distributionOfItcColumns[currentCol1]?.data;
                                var value = `${fromAmount}to${toAmount}`;
                                // var value = (searchInput1?.value || searchInput2?.value) && `${fromAmount ? fromAmount : toAmount}to${toAmount ? toAmount : fromAmount}`;
                                setFromAmountCGST(searchInput1?.value);
                                setToAmountCGST(searchInput2?.value);
                                let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                filterObject.push({ [columnName]: value });
                                if (!searchVal1?.length) {
          
                                  x.push(value);
                                  let y = currentCol;
                                  y.push(
                                    distributionOfItcColumns[currentCol1]?.data
                                  );
                                  // console.log("jsx=",x,y)
                                  setSearchVal1(x);
                                  setCurrentCol(y);
                                } else {
          
                                  const Index = currentCol?.findIndex(
                                    (item) =>
                                    distributionOfItcColumns[currentCol1]?.data ==
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
                                      distributionOfItcColumns[currentCol1]?.data
                                    );
                                    setSearchVal1(x);
                                    setCurrentCol(y);
                                  }
                                }
                                setPage(0);
                                purchaseSummaryList(
                                             activeTab,
                                             "",
                                             "asc",
                                             invoceTypes?.value,
                                             finFromYear?.value,
                                             monthFrom?.value,
                                             "", 1
                                 );
          
                              }
          
                              else if (hot?.getSelected()[0][1] == 15) {
                                const x =  searchVal1
                                var searchInput1 = document.getElementById("amount1");
                                var searchInput2 = document.getElementById("amount2");
                                const fromAmount = searchInput1?.value?.replaceAll(",", "")
                                const toAmount = searchInput2?.value?.replaceAll(",", "")
                                var columnName = distributionOfItcColumns[currentCol1]?.data;
                                var value = `${fromAmount}to${toAmount}`;
                                // var value = (searchInput1?.value || searchInput2?.value) && `${fromAmount ? fromAmount : toAmount}to${toAmount ? toAmount : fromAmount}`;
                                setFromAmountSGST(searchInput1?.value);
                                setToAmountSGST(searchInput2?.value);
                                let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                filterObject.push({ [columnName]: value });
                                if (!searchVal1?.length) {
          
                                  x.push(value);
                                  let y = currentCol;
                                  y.push(
                                    distributionOfItcColumns[currentCol1]?.data
                                  );
                                  // console.log("jsx=",x,y)
                                  setSearchVal1(x);
                                  setCurrentCol(y);
                                } else {
          
                                  const Index = currentCol?.findIndex(
                                    (item) =>
                                    distributionOfItcColumns[currentCol1]?.data ==
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
                                      distributionOfItcColumns[currentCol1]?.data
                                    );
                                    setSearchVal1(x);
                                    setCurrentCol(y);
                                  }
                                }
                                setPage(0);
                                purchaseSummaryList(
                                             activeTab,
                                             "",
                                             "asc",
                                             invoceTypes?.value,
                                             finFromYear?.value,
                                             monthFrom?.value,
                                             "", 1
                                 );
          
                              }
          
                              else if (hot?.getSelected()[0][1] == 16) {
                                const x = searchVal1
                                var searchInput1 = document.getElementById("amount1");
                                var searchInput2 = document.getElementById("amount2");
                                const fromAmount = searchInput1?.value?.replaceAll(",", "")
                                const toAmount = searchInput2?.value?.replaceAll(",", "")
                                var columnName = distributionOfItcColumns[currentCol1]?.data;
                                // var value = (searchInput1?.value || searchInput2?.value) && `${fromAmount ? fromAmount : toAmount}to${toAmount ? toAmount : fromAmount}`;
                                var value = `${fromAmount}to${toAmount}`;
                                setFromAmountCESS(searchInput1?.value);
                                setToAmountCESS(searchInput2?.value);
                                let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                filterObject.push({ [columnName]: value });
                                if (!searchVal1?.length) {
          
                                  x.push(value);
                                  let y = currentCol;
                                  y.push(
                                    distributionOfItcColumns[currentCol1]?.data
                                  );
                                  // console.log("jsx=",x,y)
                                  setSearchVal1(x);
                                  setCurrentCol(y);
                                } else {
          
                                  const Index = currentCol?.findIndex(
                                    (item) =>
                                    distributionOfItcColumns[currentCol1]?.data ==
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
                                      distributionOfItcColumns[currentCol1]?.data
                                    );
                                    setSearchVal1(x);
                                    setCurrentCol(y);
                                  }
                                }
                                setPage(0);
                                purchaseSummaryList(
                                             activeTab,
                                             "",
                                             "asc",
                                             invoceTypes?.value,
                                             finFromYear?.value,
                                             monthFrom?.value,
                                             "", 1
                                 );
          
                              }
          
                              else if (shouldExcludeCheckBox) {
                                let x = searchVal1
                                var checkboxes = document.getElementsByClassName('checkBoxClass');
                                arrChk = []
                                setFilterDropDownList([]);
                                var columnName = distributionOfItcColumns[currentCol1]?.data;
                                let filterObject2 = !gridCustomFilter ? [] : gridCustomFilter
                                let filterObject = []
                                filterObject2 = filterObject2 == null || filterObject2.length <= 0 ? [] : filterObject2;
          
                                for (let i = 0; i < checkboxes.length; i++) {
                                  if (checkboxes[i].checked) {
                                    arrChk.push({ [columnName]: checkboxes[i].value });
                                    filterObject2.push({ [columnName]: checkboxes[i].value });
                                    filterObject.push(checkboxes[i].value);
                                  } else {
                                    console.log("else is running")
                                    let uniqueArray = filterObject.filter((obj, index, self) =>
                                      index === self.findIndex((t) => (
                                        JSON.stringify(t) === JSON.stringify(obj)
                                      ))
                                    );
                                    let uniqueArray2 = filterObject2.filter((obj, index, self) =>
                                    index === self.findIndex((t) => (
                                      JSON.stringify(t) === JSON.stringify(obj)
                                    ))
                                  );
                                    console.log(uniqueArray,"uniqArray")
                                    filterObject2 = uniqueArray2
                                    const index = filterObject.findIndex(obj => obj[columnName] === checkboxes[i].value);
                                    const index1 = filterObject2.findIndex(obj => obj[columnName] === checkboxes[i].value);
                                    if (index !== -1 || index1 !== -1)   {
          
                                      // delete filterObject[index1][columnName];
                                      delete filterObject2[index1][columnName];
                                      
                                    }
                                  }
                                }
                                
                                setGridCustomFilter(filterObject2)
                                var value = filterObject?.join("@#@#")
                                if (!searchVal1?.length) {
                                  x.push(value);
                                  let y = currentCol;
                                  y.push(
                                    distributionOfItcColumns[currentCol1]?.data
                                  );
                                  setSearchVal1(x);
                                  setCurrentCol(y);
                                } else{
                                  const Index = currentCol?.findIndex(
                                    (item) =>
                                    distributionOfItcColumns[currentCol1]?.data ==
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
                                      distributionOfItcColumns[currentCol1]?.data
                                    );
                                    setSearchVal1(x);
                                    setCurrentCol(y);
                                  }
                                  
                                }
                                setPage(0);
                                purchaseSummaryList(
                                  activeTab,
                                  "",
                                  "asc",
                                  invoceTypes?.value,
                                  finFromYear?.value,
                                  monthFrom?.value,
                                  "", 1
                                );
          
                                const updatedFilterDropDownList = filterObject2.reduce((acc, item) => {
                                  const { eligibilityOfITC, unitType, noteType, sezSupplier, } = item;

                                  const updateList = (list, value) => {
                                    return list.includes(value) ? list : [...list, value];
                                  };

                                  if (eligibilityOfITC !== undefined) {
                                    acc.eligibilityofITCDropDownList = updateList(acc.eligibilityofITCDropDownList, eligibilityOfITC);
                                  } else if (unitType !== undefined) {
                                    acc.unitTypeDropDownList = updateList(acc.unitTypeDropDownList, unitType);
                                  } else if (noteType !== undefined) {
                                    acc.noteTypeDropDownList = updateList(acc.noteTypeDropDownList, noteType);
                                  } else if (sezSupplier !== undefined) {
                                    acc.sezDropDownList = updateList(acc.sezDropDownList, sezSupplier);
                                  } 

                                  return acc;
                                }, { eligibilityofITCDropDownList: [], unitTypeDropDownList: [], noteTypeDropDownList:[], sezDropDownList:[] });

                                setFilterDropDownList(updatedFilterDropDownList);
          
                              }
                            }}
                          />
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
                                // styles={customStyles}
                                />) : (<></>)}
                                  &nbsp; &nbsp;
                                {purchaseData?.length ? ( <span  >
                                  <b>  { ` ${pageNoTitle}`}</b>
                                </span>) : <></>}
                                &nbsp; &nbsp;
                                <ReactPaginate
                                  breakLabel="..."
                                  nextLabel=""
                                  onPageChange={(e) => handlePageClick(e?.selected)}
                                  pageRangeDisplayed={2}
                                  pageCount={pageCount}
                                  previousLabel=""
                                  renderOnZeroPageCount={null}
                                  marginPagesDisplayed={2}
                                  forcePage={page}
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
                     
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </TabPane>
            </TabPane>

            {/* Amends Distribution of ITc  */}
            <TabPane tabId="6" key="6">
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
                                  <span>{totalInvoice ? totalInvoice : 0}</span>
                                </p>
                              </td>

                              <td>
                                <p className="mb-0">
                                  {" "}
                                  Invoice Values (₹)
                                  <br />
                                  <span>
                                    {totalInvoiceValue ? totalInvoiceValue : 0}
                                  </span>
                                </p>
                              </td>
                              <td>
                                <p className="mb-0">
                                  Taxable Values{"  "} (₹)
                                  <br />
                                  <span>
                                    {totalTaxableValue ? totalTaxableValue : 0}
                                  </span>
                                </p>
                              </td>

                              <td>
                                <p className="mb-0">
                                  IGST (₹)
                                  <br />
                                  <span>{totalIGST ? totalIGST : 0}</span>
                                </p>
                              </td>
                              <td>
                                <p className="mb-0">
                                  SGST (₹)
                                  <br />
                                  <span>{totalSGST ? totalSGST : 0}</span>
                                </p>
                              </td>
                              <td>
                                <p className="mb-0">
                                  CGST (₹)
                                  <br />
                                  <span>{totalCGST ? totalCGST : 0}</span>
                                </p>
                              </td>
                              <td>
                                <p className="mb-0">
                                  Cess (₹)
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
                          <Col sm={6}>
                            <Label className="form-label">Invoice Type</Label>
                            <Select
                              id="tax_invtype"
                              placeholder="Invoice Type"
                              theme={selectThemeColors}
                              components={animatedComponents}
                              isDisabled={true}
                              className="basic-multi-select"
                              classNamePrefix="select"
                              value={{
                                label: "AMD ITC",
                                value: "AmendofDistofITC",
                              }}
                            />
                          </Col>
                          <Col sm={6}>
                            <Label className="form-label">
                               Return Period
                            </Label>
                            <Select
                              id="tax_frDt"
                              placeholder="From"
                              isClearable={false}
                              theme={selectThemeColors}
                              closeMenuOnSelect={true}
                              isDisabled={true}
                              options={panDataFrom}
                              className="basic-multi-select"
                              classNamePrefix="select"
                              components={animatedComponents}
                              onChange={selectFromYear}
                              value={finFromYear}
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
                        <div>
                          {/* {purchaseData?.length > 0 ? ( */}
                            <HotTable
                              autoWrapRow={true}
                              style={purchaseData.length > 0 ? "" :  {
                                textAlign: "center",
                                overflowX: "hidden",
                              }}
                              data={purchaseData.length > 0 ? purchaseData : [{ originalUnitType: "No Data Found" }]}
                              rowHeights={RowSize}
                              viewportColumnRenderingOffset={100}
                              columnHeaderHeight={columnHeaderSize}
                              autoColumnSize={true}
                              colHeaders={colHeaders}
                              afterGetColHeader={theaderAmends}
                              stretchH="all"
                              preventOverflow="horizontal"
                              columns={purchaseData.length > 0  ? ammendDistributionItcdetailsColumn : ammendDistributionItcdetailsColumnEmpty}
                              contextMenu={false}
                              bindRowsWithHeaders={true}
                              licenseKey="non-commercial-and-evaluation"
                              height="auto"
                              ref={hotRef5}
                              afterOnCellMouseDown={localAfterOnCellMouseDown6}
                              mergeCells={purchaseData.length > 0  ? false : [{ row: 0, col: 1, rowspan: 1, colspan: 9 }]}
                              hiddenColumns={{
                                columns: [24],
                              }}
                              cells={function (row, col) {
                                var cp = {};
                                const hot = hotRef?.current?.hotInstance;
                                cp.className = "child";
                                if (
                                  col == 15 ||
                                  col == 16 ||
                                  col == 17 ||
                                  col == 18 ||
                                  col == 19 ||
                                  col == 20 ||
                                  col == 21 ||
                                  col == 22
                                ) {
                                  cp.className = "text-end";
                                }

                                return cp;
                              }}
                              filters={true}
                              dropdownMenu={{
                                items: {
                                  filter_by_value: {
                                    name: "Search Value",
                                    // hide the 'Filter by value' list from all columns but the first one
                                    hidden() {
                                      const hot = hotRef5?.current?.hotInstance;
                                      const selectedValue = this.getSelected()[0][1];
                                      // [5,6,8,12,13,14,15,16] wihtout Select option
                                      const isValidColumn = [4,11,12,14,16,17,18,19,1,5,6,15,].includes(selectedValue);
                                      return isValidColumn;
                                    },
                                  },

                                  about: { // For CheckBox custom option

                                    name: `<div  style="margin-left:6px">Select Options<label class="float-end text-danger "><a><u id="selectAll">Select All</u></a></label></div> <div  class="checkboxmenu custom-scrollbar"> <div >  <table id="searchTable" >
                                    ${dropDonwNameTab6 &&
                                      dropDonwNameTab6?.map((index) => (
                                        `<tr><td><input class="checkBoxClass" type="checkbox" value="${index?.value}" /> <span class="fw-normal">${index?.label?.length > 20 ? index?.label?.substring(0, 20) + "..." : index?.label}</span> </td></tr>`
                                      )).join('')
                                      }
            
                                      </table></div>
                                      </div>`, // Name can contain HTML 
                                    hidden() {
                                      const selectedCol = this.getSelectedRangeLast().to.col;
                                      const isHiddenCol = ![1,5,6,15,].includes(selectedCol);
            
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

                                  option5: {
                                    name: `<div style="margin-top:10px"> From Date <br><input type='date' data-date="" data-date-format="DD MMMM YYYY" min='2017-07-01' max=${new Date()
                                      .toISOString()
                                      .slice(
                                        0,
                                        10
                                      )}  class='custom-date col-md-11' placeholder='DD-MM-YYYY' id='custom1' name='date' value=${searchDate} > <br/> 
                                        
                                        To Date <br><input type='date' data-date="" data-date-format="DD MMMM YYYY" min='2017-07-01' max=${new Date()
                                        .toISOString()
                                        .slice(
                                          0,
                                          10
                                        )}  class='custom-date col-md-11' placeholder='DD-MM-YYYY' id='custom2' name='date' value=${toDate} >
                                       </div> `,
                                    hidden() {
                                      return this.getSelectedRangeLast().to.col != 4;
                                    },
            
                                    //disabled: true,
                                    callback: function (key, selection, clickEvent) {
            
                                      console.log("date picker clicked");
                                      var src = clickEvent.target;
            
                                      if (src.tagName === "INPUT") {
                                        clickEvent.stopImmediatePropagation();
                                      }
            
                                      clickEvent.stopImmediatePropagation();
                                    },
                                  },

                                  option6: {
                                    name: `<div style="margin-top:10px"> From Date <br><input type='date' data-date="" data-date-format="DD MMMM YYYY" min='2017-07-01' max=${new Date()
                                      .toISOString()
                                      .slice(
                                        0,
                                        10
                                      )}  class='custom-date col-md-11' placeholder='DD-MM-YYYY' id='custom1' name='date' value=${searchDate1} > <br/> 
                                        
                                        To Date <br><input type='date' data-date="" data-date-format="DD MMMM YYYY" min='2017-07-01' max=${new Date()
                                        .toISOString()
                                        .slice(
                                          0,
                                          10
                                        )}  class='custom-date col-md-11' placeholder='DD-MM-YYYY' id='custom2' name='date' value=${searchDate1To} >
                                       </div> `,
                                    hidden() {
                                      return this.getSelectedRangeLast().to.col != 11;
                                    },
            
                                    //disabled: true,
                                    callback: function (key, selection, clickEvent) {
            
                                      console.log("date picker clicked");
                                      var src = clickEvent.target;
            
                                      if (src.tagName === "INPUT") {
                                        clickEvent.stopImmediatePropagation();
                                      }
            
                                      clickEvent.stopImmediatePropagation();
                                    },
                                  },

                                  option7: {
                                    name: `<div style="margin-top:10px"> From Date <br><input type='date' data-date="" data-date-format="DD MMMM YYYY" min='2017-07-01' max=${new Date()
                                      .toISOString()
                                      .slice(
                                        0,
                                        10
                                      )}  class='custom-date col-md-11' placeholder='DD-MM-YYYY' id='custom1' name='date' value=${searchDate2} > <br/> 
                                        
                                        To Date <br><input type='date' data-date="" data-date-format="DD MMMM YYYY" min='2017-07-01' max=${new Date()
                                        .toISOString()
                                        .slice(
                                          0,
                                          10
                                        )}  class='custom-date col-md-11' placeholder='DD-MM-YYYY' id='custom2' name='date' value=${searchDate2To} >
                                       </div> `,
                                    hidden() {
                                      return this.getSelectedRangeLast().to.col != 12;
                                    },
            
                                    //disabled: true,
                                    callback: function (key, selection, clickEvent) {
            
                                      console.log("date picker clicked");
                                      var src = clickEvent.target;
            
                                      if (src.tagName === "INPUT") {
                                        clickEvent.stopImmediatePropagation();
                                      }
            
                                      clickEvent.stopImmediatePropagation();
                                    },
                                  },

                                  option8: {
                                    name: `<div style="margin-top:10px"> From Date <br><input type='date' data-date="" data-date-format="DD MMMM YYYY" min='2017-07-01' max=${new Date()
                                      .toISOString()
                                      .slice(
                                        0,
                                        10
                                      )}  class='custom-date col-md-11' placeholder='DD-MM-YYYY' id='custom1' name='date' value=${searchDate3} > <br/> 
                                        
                                        To Date <br><input type='date' data-date="" data-date-format="DD MMMM YYYY" min='2017-07-01' max=${new Date()
                                        .toISOString()
                                        .slice(
                                          0,
                                          10
                                        )}  class='custom-date col-md-11' placeholder='DD-MM-YYYY' id='custom2' name='date' value=${searchDate3To} >
                                       </div> `,
                                    hidden() {
                                      return this.getSelectedRangeLast().to.col != 14;
                                    },
            
                                    //disabled: true,
                                    callback: function (key, selection, clickEvent) {
            
                                      console.log("date picker clicked");
                                      var src = clickEvent.target;
            
                                      if (src.tagName === "INPUT") {
                                        clickEvent.stopImmediatePropagation();
                                      }
            
                                      clickEvent.stopImmediatePropagation();
                                    },
                                  },

                                  option10: generateOption(16, fromAmountIGST, toAmountIGST),
                                  option11: generateOption(17, fromAmountCGST, toAmountCGST),
                                  option12: generateOption(18, fromAmountSGST, toAmountSGST),
                                  option13: generateOption(19, fromAmountCESS, toAmountCESS),

                                  clear: {
                                    name: `<button id='btnClear'  name='Clear' tabIndex="-1"   value='Clear'>Clear</button>`,
                                    
                                    callback: function (key, selection, clickEvent) {
            
                                      var src = clickEvent.target;
            
                                      if (src?.tagName?.toLowerCase() === "button") {
                                        if (clickEvent.target.id == "btnClear") {
                                          const hot = hotRef5?.current?.hotInstance;
                                          const selectedValue = hot?.getSelected()[0][1];
                                          const isValidTextColumn = [4,11,12,14,16,17,18,19,1,5,6,15,].includes(selectedValue);
                                          const isValidCheckBoxColumn = [1,5,6,15,].includes(selectedValue);

                                          if (!isValidTextColumn) {
                                            let x = searchVal1
                                            var value = "";
                                            var columnName = ammendDistributionItcdetailsColumn[currentCol1]?.data;
                                            let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
            
                                            filterObject.push({ [columnName]: value });
                                            if (!searchVal1?.length) {
                                              x.push(value);
                                              let y = currentCol;
                                              y.push(
                                                ammendDistributionItcdetailsColumn[currentCol1]?.data
                                              );
                                              // console.log("jsx=",x,y)
                                              setSearchVal1(x);
                                              setCurrentCol(y);
                                            } else {
                                              const Index = currentCol?.findIndex(
                                                (item) =>
                                                ammendDistributionItcdetailsColumn[currentCol1]?.data ==
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
                                                  ammendDistributionItcdetailsColumn[currentCol1]?.data
                                                );
                                                setSearchVal1(x);
                                                setCurrentCol(y);
                                              }
                                            }
                                            setPage(0);
                                          purchaseSummaryList(
                                                       activeTab,
                                                       "",
                                                       "asc",
                                                       invoceTypes?.value,
                                                       finFromYear?.value,
                                                       monthFrom?.value,
                                                       "", 1
                                           );
                                           
            
                                          }

                                          else if (hot?.getSelected()[0][1] == 4) {
            
                                            var columnName = ammendDistributionItcdetailsColumn[currentCol1]?.data;
                                            var value = '';
                                            setSearchDate('');
                                            setToDate('');
                                            let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
            
                                            filterObject.push({ [columnName]: value });
                                            if (!searchVal1?.length) {
                                              x.push(value);
                                              let y = currentCol;
                                              y.push(
                                                ammendDistributionItcdetailsColumn[currentCol1]?.data
                                              );
                                              // console.log("jsx=",x,y)
                                              setSearchVal1(x);
                                              setCurrentCol(y);
                                            } else {
                                              const Index = currentCol?.findIndex(
                                                (item) =>
                                                ammendDistributionItcdetailsColumn[currentCol1]?.data ==
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
                                                  ammendDistributionItcdetailsColumn[currentCol1]?.data
                                                );
                                                setSearchVal1(x);
                                                setCurrentCol(y);
                                              }
                                            }
                                            setPage(0);
                                          purchaseSummaryList(
                                                       activeTab,
                                                       "",
                                                       "asc",
                                                       invoceTypes?.value,
                                                       finFromYear?.value,
                                                       monthFrom?.value,
                                                       "", 1
                                           );
                                            
            
                                          }
                                          else if (hot?.getSelected()[0][1] == 11) {
            
                                            var columnName = ammendDistributionItcdetailsColumn[currentCol1]?.data;
                                            var value = '';
                                            setSearchDate1('');
                                            setSearchDate1To('');
                                            let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
            
                                            filterObject.push({ [columnName]: value });
                                            if (!searchVal1?.length) {
                                              x.push(value);
                                              let y = currentCol;
                                              y.push(
                                                ammendDistributionItcdetailsColumn[currentCol1]?.data
                                              );
                                              // console.log("jsx=",x,y)
                                              setSearchVal1(x);
                                              setCurrentCol(y);
                                            } else {
                                              const Index = currentCol?.findIndex(
                                                (item) =>
                                                ammendDistributionItcdetailsColumn[currentCol1]?.data ==
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
                                                  ammendDistributionItcdetailsColumn[currentCol1]?.data
                                                );
                                                setSearchVal1(x);
                                                setCurrentCol(y);
                                              }
                                            }
                                            setPage(0);
                                          purchaseSummaryList(
                                                       activeTab,
                                                       "",
                                                       "asc",
                                                       invoceTypes?.value,
                                                       finFromYear?.value,
                                                       monthFrom?.value,
                                                       "", 1
                                           );
                                           
            
                                          }
                                          else if (hot?.getSelected()[0][1] == 12) {
            
                                            var columnName = ammendDistributionItcdetailsColumn[currentCol1]?.data;
                                            var value = '';
                                            setSearchDate2('');
                                            setSearchDate2To('');
                                            let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
            
                                            filterObject.push({ [columnName]: value });
                                            if (!searchVal1?.length) {
                                              x.push(value);
                                              let y = currentCol;
                                              y.push(
                                                ammendDistributionItcdetailsColumn[currentCol1]?.data
                                              );
                                              // console.log("jsx=",x,y)
                                              setSearchVal1(x);
                                              setCurrentCol(y);
                                            } else {
                                              const Index = currentCol?.findIndex(
                                                (item) =>
                                                ammendDistributionItcdetailsColumn[currentCol1]?.data ==
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
                                                  ammendDistributionItcdetailsColumn[currentCol1]?.data
                                                );
                                                setSearchVal1(x);
                                                setCurrentCol(y);
                                              }
                                            }
                                            setPage(0);
                                          purchaseSummaryList(
                                                       activeTab,
                                                       "",
                                                       "asc",
                                                       invoceTypes?.value,
                                                       finFromYear?.value,
                                                       monthFrom?.value,
                                                       "", 1
                                           );
            
                                          }
                                          else if (hot?.getSelected()[0][1] == 14) {
            
                                            var columnName = ammendDistributionItcdetailsColumn[currentCol1]?.data;
                                            var value = '';
                                            setSearchDate3('');
                                            setSearchDate3To('');
                                            let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
            
                                            filterObject.push({ [columnName]: value });
                                            if (!searchVal1?.length) {
                                              x.push(value);
                                              let y = currentCol;
                                              y.push(
                                                ammendDistributionItcdetailsColumn[currentCol1]?.data
                                              );
                                              // console.log("jsx=",x,y)
                                              setSearchVal1(x);
                                              setCurrentCol(y);
                                            } else {
                                              const Index = currentCol?.findIndex(
                                                (item) =>
                                                ammendDistributionItcdetailsColumn[currentCol1]?.data ==
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
                                                  ammendDistributionItcdetailsColumn[currentCol1]?.data
                                                );
                                                setSearchVal1(x);
                                                setCurrentCol(y);
                                              }
                                            }
                                            setPage(0);
                                          purchaseSummaryList(
                                                       activeTab,
                                                       "",
                                                       "asc",
                                                       invoceTypes?.value,
                                                       finFromYear?.value,
                                                       monthFrom?.value,
                                                       "", 1
                                           );
            
                                          }
                                          else if (hot?.getSelected()[0][1] == 16) {
                                            const x = searchVal1
                                            var columnName = ammendDistributionItcdetailsColumn[currentCol1]?.data;
                                            var value = '';
                                            setFromAmountIGST('');
                                            setToAmountIGST('');
            
                                            let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
            
                                            filterObject.push({ [columnName]: value });
                                            if (!searchVal1?.length) {
                                              x.push(value);
                                              let y = currentCol;
                                              y.push(
                                                ammendDistributionItcdetailsColumn[currentCol1]?.data
                                              );
                                              // console.log("jsx=",x,y)
                                              setSearchVal1(x);
                                              setCurrentCol(y);
                                            } else {
                                              const Index = currentCol?.findIndex(
                                                (item) =>
                                                ammendDistributionItcdetailsColumn[currentCol1]?.data ==
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
                                                  ammendDistributionItcdetailsColumn[currentCol1]?.data
                                                );
                                                setSearchVal1(x);
                                                setCurrentCol(y);
                                              }
                                            }
                                            setPage(0);
                                          purchaseSummaryList(
                                                       activeTab,
                                                       "",
                                                       "asc",
                                                       invoceTypes?.value,
                                                       finFromYear?.value,
                                                       monthFrom?.value,
                                                       "", 1
                                           );
            
                                          }
                                          else if (hot?.getSelected()[0][1] == 17) {
                                            const x = searchVal1
                                            var columnName = ammendDistributionItcdetailsColumn[currentCol1]?.data;
                                            var value = '';
                                            setFromAmountCGST('');
                                            setToAmountCGST('');
            
                                            let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
            
                                            filterObject.push({ [columnName]: value });
                                            if (!searchVal1?.length) {
                                              x.push(value);
                                              let y = currentCol;
                                              y.push(
                                                ammendDistributionItcdetailsColumn[currentCol1]?.data
                                              );
                                              // console.log("jsx=",x,y)
                                              setSearchVal1(x);
                                              setCurrentCol(y);
                                            } else {
                                              const Index = currentCol?.findIndex(
                                                (item) =>
                                                ammendDistributionItcdetailsColumn[currentCol1]?.data ==
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
                                                  ammendDistributionItcdetailsColumn[currentCol1]?.data
                                                );
                                                setSearchVal1(x);
                                                setCurrentCol(y);
                                              }
                                            }
                                            setPage(0);
                                          purchaseSummaryList(
                                                       activeTab,
                                                       "",
                                                       "asc",
                                                       invoceTypes?.value,
                                                       finFromYear?.value,
                                                       monthFrom?.value,
                                                       "", 1
                                           );
            
                                          }
                                          else if (hot?.getSelected()[0][1] == 18) {
                                            const x = searchVal1
                                            var columnName = ammendDistributionItcdetailsColumn[currentCol1]?.data;
                                            var value = '';
                                            setFromAmountSGST('');
                                            setToAmountSGST('');
            
                                            let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
            
                                            filterObject.push({ [columnName]: value });
                                            if (!searchVal1?.length) {
                                              x.push(value);
                                              let y = currentCol;
                                              y.push(
                                                ammendDistributionItcdetailsColumn[currentCol1]?.data
                                              );
                                              // console.log("jsx=",x,y)
                                              setSearchVal1(x);
                                              setCurrentCol(y);
                                            } else {
                                              const Index = currentCol?.findIndex(
                                                (item) =>
                                                ammendDistributionItcdetailsColumn[currentCol1]?.data ==
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
                                                  ammendDistributionItcdetailsColumn[currentCol1]?.data
                                                );
                                                setSearchVal1(x);
                                                setCurrentCol(y);
                                              }
                                            }
                                            setPage(0);
                                          purchaseSummaryList(
                                                       activeTab,
                                                       "",
                                                       "asc",
                                                       invoceTypes?.value,
                                                       finFromYear?.value,
                                                       monthFrom?.value,
                                                       "", 1
                                           );
            
                                          }
                                          else if (hot?.getSelected()[0][1] == 19) {
                                            const x = searchVal1
                                            var columnName = ammendDistributionItcdetailsColumn[currentCol1]?.data;
                                            var value = '';
                                            setFromAmountCESS('');
                                            setToAmountCESS('');
            
                                            let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
            
                                            filterObject.push({ [columnName]: value });
                                            if (!searchVal1?.length) {
                                              x.push(value);
                                              let y = currentCol;
                                              y.push(
                                                ammendDistributionItcdetailsColumn[currentCol1]?.data
                                              );
                                              // console.log("jsx=",x,y)
                                              setSearchVal1(x);
                                              setCurrentCol(y);
                                            } else {
                                              const Index = currentCol?.findIndex(
                                                (item) =>
                                                ammendDistributionItcdetailsColumn[currentCol1]?.data ==
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
                                                  ammendDistributionItcdetailsColumn[currentCol1]?.data
                                                );
                                                setSearchVal1(x);
                                                setCurrentCol(y);
                                              }
                                            }
                                            setPage(0);
                                          purchaseSummaryList(
                                                       activeTab,
                                                       "",
                                                       "asc",
                                                       invoceTypes?.value,
                                                       finFromYear?.value,
                                                       monthFrom?.value,
                                                       "", 1
                                           );
            
                                          }
                                          else if (isValidCheckBoxColumn) {
                                            let x = searchVal1
                                            var checkboxes = document.getElementsByClassName('checkBoxClass');
            
                                            arrChk = []
                                            setFilterDropDownList([]);
                                            var columnName = ammendDistributionItcdetailsColumn[currentCol1]?.data;
                                            let filterObject2 = !gridCustomFilter ? [] : gridCustomFilter
                                          let filterObject = []
                                          filterObject2 = filterObject2 == null || filterObject2.length <= 0 ? [] : filterObject2;
          
                                          for (let i = 0; i < checkboxes.length; i++) {
                                            if (checkboxes[i].checked) {
                                            //   arrChk.push({ [columnName]: checkboxes[i].value });
                                            //   filterObject2.push({ [columnName]: checkboxes[i].value });
                                            //   filterObject.push(checkboxes[i].value);
                                            // } else {
                                              console.log("else is running")
                                              let uniqueArray = filterObject.filter((obj, index, self) =>
                                                index === self.findIndex((t) => (
                                                  JSON.stringify(t) === JSON.stringify(obj)
                                                ))
                                              );
                                              let uniqueArray2 = filterObject2.filter((obj, index, self) =>
                                              index === self.findIndex((t) => (
                                                JSON.stringify(t) === JSON.stringify(obj)
                                              ))
                                            );
                                              console.log(uniqueArray,"uniqArray")
                                              filterObject2 = uniqueArray2
                                              const index = filterObject.findIndex(obj => obj[columnName] === checkboxes[i].value);
                                              const index1 = filterObject2.findIndex(obj => obj[columnName] === checkboxes[i].value);
                                              if (index !== -1 || index1 !== -1)   {
                    
                                                // delete filterObject[index1][columnName];
                                                // delete filterObject2[index][columnName];
                                                delete filterObject2[index1][columnName];
                                              }
                                            }
                                          }
                                          setGridCustomFilter(filterObject2)
                                          var value = ""
                                          if (!searchVal1?.length) {
                                            x.push(value);
                                            let y = currentCol;
                                            y.push(
                                              ammendDistributionItcdetailsColumn[currentCol1]?.data
                                            );
                                            setSearchVal1(x);
                                            setCurrentCol(y);
                                          } else{
                                            const Index = currentCol?.findIndex(
                                              (item) =>
                                              ammendDistributionItcdetailsColumn[currentCol1]?.data ==
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
                                                ammendDistributionItcdetailsColumn[currentCol1]?.data
                                              );
                                              setSearchVal1(x);
                                              setCurrentCol(y);
                                            }
                                            
                                          }
                                          setPage(0);
                                          purchaseSummaryList(
                                            activeTab,
                                            "",
                                            "asc",
                                            invoceTypes?.value,
                                            finFromYear?.value,
                                            monthFrom?.value,
                                            "", 1
                                          );
            
                                            const updatedFilterDropDownList = filterObject2.reduce((acc, item) => {
                                              const { eligibilityOfITC, unitType, sezSupplier, originalUnitType } = item;
            
                                              const updateList = (list, value) => {
                                                return list.includes(value) ? list : [...list, value];
                                              };
            
                                              if (eligibilityOfITC !== undefined) {
                                                acc.eligibilityofITCDropDownList = updateList(acc.eligibilityofITCDropDownList, eligibilityOfITC);
                                              } else if (unitType !== undefined) {
                                                acc.unitTypeDropDownList = updateList(acc.unitTypeDropDownList, unitType);
                                              }
                                              //  else if (noteType !== undefined) {
                                              //   acc.noteTypeDropDownList = updateList(acc.noteTypeDropDownList, noteType);
                                              // }
                                               else if (sezSupplier !== undefined) {
                                                acc.sezDropDownList = updateList(acc.sezDropDownList, sezSupplier);
                                              } 
                                              else if (originalUnitType !== undefined) {
                                                acc.originalUnitTypeDropDownList = updateList(acc.originalUnitTypeDropDownList, originalUnitType);
                                              } 
            
                                              return acc;
                                            }, { eligibilityofITCDropDownList: [], unitTypeDropDownList: [], sezDropDownList:[], originalUnitTypeDropDownList:[] });
            
                                            setFilterDropDownList(updatedFilterDropDownList);
            
                                          }
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
                                console.log(checkboxes,"checkbox")
                                const {
                                  eligibilityofITCDropDownList,
                                  unitTypeDropDownList,
                                  sezDropDownList,
                                  originalUnitTypeDropDownList
                                } = filterDropDownList;
            
                                const listsToCheck = [
                                  eligibilityofITCDropDownList,
                                  unitTypeDropDownList,
                                  sezDropDownList,
                                  originalUnitTypeDropDownList
                                ];
                                console.log(listsToCheck,"listTocheck")
            
                                for (var j = 0; j < checkboxes.length; j++) {
                                  for (var k = 0; k < listsToCheck.length; k++) {
                                    if (listsToCheck[k]) {
                                      // For rcmDropDownList, check both conditions listsToCheck[k][i] == checkboxes[j].value and checkboxes?.length == 2
                                     console.log(currentCol1,"curemt")
                                      if (k === 1 && checkboxes.length === 2) {
            
                                        for (var i = 0; i < listsToCheck[k].length; i++) {
                                          console.log(checkboxes[j].value,listsToCheck[k][i],"testterr")
                                          if (listsToCheck[k][i] == checkboxes[j].value) {
                                            $(checkboxes[j]).prop("checked", true);
                                            break;
                                          }
                                        }
                                      } 
                                       if (k === 3 &&  checkboxes.length === 2) {
            
                                        console.log(checkboxes[j].value,"testterr")
                                        for (var i = 0; i < listsToCheck[k].length; i++) {
                                          console.log(checkboxes[j].value,listsToCheck[k][i],"testterr")
                                          if (listsToCheck[k][i] == checkboxes[j].value) {
                                            $(checkboxes[j]).prop("checked", true);
                                            break;
                                          }
                                        }
                                      }
                                      else {
            
                                        for (var i = 0; i < listsToCheck[k].length; i++) {
                                          console.log(checkboxes[j].value,listsToCheck[k][i],"testterr")
                                          if (listsToCheck[k][i] == checkboxes[j].value && k !== 3 && k!==1) {
                                            $(checkboxes[j]).prop("checked", true);
                                            break;
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }}
                              afterFilter={function (data) {
                                const hot = hotRef5?.current?.hotInstance;
                                const selectedValuecol = hot?.getSelected()[0][1];
                                const shouldExcludeTextBox = [4,11,12,14,16,17,18,19,1,5,6,15,].includes(selectedValuecol);
                                const shouldExcludeCheckBox = [1,5,6,15,].includes(selectedValuecol);
                                if(!shouldExcludeTextBox){
                                // if (hot?.getSelected()[0][1] != 3 && hot?.getSelected()[0][1] != 10 && hot?.getSelected()[0][1] != 12 && hot?.getSelected()[0][1] != 14 && hot?.getSelected()[0][1] != 16 && hot?.getSelected()[0][1] != 17 && hot?.getSelected()[0][1] != 18 && hot?.getSelected()[0][1] != 19 && hot?.getSelected()[0][1] != 0 && hot?.getSelected()[0][1] != 4 && hot?.getSelected()[0][1] != 5 && hot?.getSelected()[0][1] != 8 && hot?.getSelected()[0][1] != 15 ) {
                                  let x = searchVal1
                                          var searchInput = document.querySelector(".htUIMultipleSelectSearch.htUIInput");
                                          var value = searchInput?.children[0].value;
                                          //  x.push(value)
                                          var columnName = ammendDistributionItcdetailsColumn[currentCol1]?.data;
                                          let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                                          filterObject.push({ [columnName]: value });

                                          // setSearchVal1(x);
                                          // let y = currentCol;
                                          // y.push(handsontableColumns[currentCol1]?.data);

                                          // setCurrentCol(y)\
                                          if (!searchVal1?.length) {

                                            x.push(value);
                                            let y = currentCol;
                                            y.push(
                                              ammendDistributionItcdetailsColumn[currentCol1]?.data
                                            );
                                            // console.log("jsx=",x,y)
                                            setSearchVal1(x);
                                            setCurrentCol(y);
                                          } else {

                                            const Index = currentCol?.findIndex(
                                              (item) =>
                                              ammendDistributionItcdetailsColumn[currentCol1]?.data ==
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
                                                ammendDistributionItcdetailsColumn[currentCol1]?.data
                                              );
                                              setSearchVal1(x);
                                              setCurrentCol(y);
                                            }
                                          }
                                          setPage(0);
                                          purchaseSummaryList(
                                                      activeTab,
                                                      "",
                                                      "asc",
                                                      invoceTypes?.value,
                                                      finFromYear?.value,
                                                      monthFrom?.value,
                                                      "", 1
                                          );
                 
            
                                }
                                else if (selectedValuecol == 4) {
                                  const x = searchVal1
                                  var searchInput1 = document.getElementById("custom1");
                                  var searchInput2 = document.getElementById("custom2");
                                  const invFromDate = searchInput1?.value
                                  const invToDate = searchInput2?.value
                                  var columnName = ammendDistributionItcdetailsColumn[currentCol1]?.data;
                                  // var value = `${invFromDate}to${invToDate}`;
                                  var value = (searchInput1?.value || searchInput2?.value) && `${invFromDate ? invFromDate : invToDate}to${invToDate ? invToDate : invFromDate}`;
                                  setSearchDate(searchInput1?.value);
                                  setToDate(searchInput2?.value);
                                  let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                  filterObject.push({ [columnName]: value });
                                  if (!searchVal1?.length) {
                                    x.push(value);
                                    let y = currentCol;
                                    y.push(
                                      ammendDistributionItcdetailsColumn[currentCol1]?.data
                                    );
                                    // console.log("jsx=",x,y)
                                    setSearchVal1(x);
                                    setCurrentCol(y);
                                  } else {
                                    const Index = currentCol?.findIndex(
                                      (item) =>
                                      ammendDistributionItcdetailsColumn[currentCol1]?.data ==
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
                                        ammendDistributionItcdetailsColumn[currentCol1]?.data
                                      );
                                      setSearchVal1(x);
                                      setCurrentCol(y);
                                    }
                                  }
                                  setPage(0);
                                purchaseSummaryList(
                                             activeTab,
                                             "",
                                             "asc",
                                             invoceTypes?.value,
                                             finFromYear?.value,
                                             monthFrom?.value,
                                             "", 1
                                 );
            
                                }

                                else if (selectedValuecol == 11) {
                                  const x = searchVal1
                                  var searchInput1 = document.getElementById("custom1");
                                  var searchInput2 = document.getElementById("custom2");
                                  const invFromDate = searchInput1?.value
                                  const invToDate = searchInput2?.value
                                  var columnName = ammendDistributionItcdetailsColumn[currentCol1]?.data;
                                  // var value = `${invFromDate}to${invToDate}`;
                                  var value = (searchInput1?.value || searchInput2?.value) && `${invFromDate ? invFromDate : invToDate}to${invToDate ? invToDate : invFromDate}`;
                                  setSearchDate1(searchInput1?.value);
                                  setSearchDate1To(searchInput2?.value);
                                  let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                  filterObject.push({ [columnName]: value });
                                  if (!searchVal1?.length) {
                                    x.push(value);
                                    let y = currentCol;
                                    y.push(
                                      ammendDistributionItcdetailsColumn[currentCol1]?.data
                                    );
                                    // console.log("jsx=",x,y)
                                    setSearchVal1(x);
                                    setCurrentCol(y);
                                  } else {
                                    const Index = currentCol?.findIndex(
                                      (item) =>
                                      ammendDistributionItcdetailsColumn[currentCol1]?.data ==
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
                                        ammendDistributionItcdetailsColumn[currentCol1]?.data
                                      );
                                      setSearchVal1(x);
                                      setCurrentCol(y);
                                    }
                                  }
                                  setPage(0);
                                purchaseSummaryList(
                                             activeTab,
                                             "",
                                             "asc",
                                             invoceTypes?.value,
                                             finFromYear?.value,
                                             monthFrom?.value,
                                             "", 1
                                 );
            
                                }
            
                                else if (selectedValuecol == 12) {
                                  const x = searchVal1
                                  var searchInput1 = document.getElementById("custom1");
                                  var searchInput2 = document.getElementById("custom2");
                                  const invFromDate = searchInput1?.value
                                  const invToDate = searchInput2?.value
                                  var columnName = ammendDistributionItcdetailsColumn[currentCol1]?.data;
                                  // var value = `${invFromDate}to${invToDate}`;
                                  var value = (searchInput1?.value || searchInput2?.value) && `${invFromDate ? invFromDate : invToDate}to${invToDate ? invToDate : invFromDate}`;
                                  setSearchDate2(searchInput1?.value);
                                  setSearchDate2To(searchInput2?.value);
                                  let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                  filterObject.push({ [columnName]: value });
                                  if (!searchVal1?.length) {
                                    x.push(value);
                                    let y = currentCol;
                                    y.push(
                                      ammendDistributionItcdetailsColumn[currentCol1]?.data
                                    );
                                    // console.log("jsx=",x,y)
                                    setSearchVal1(x);
                                    setCurrentCol(y);
                                  } else {
                                    const Index = currentCol?.findIndex(
                                      (item) =>
                                      ammendDistributionItcdetailsColumn[currentCol1]?.data ==
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
                                        ammendDistributionItcdetailsColumn[currentCol1]?.data
                                      );
                                      setSearchVal1(x);
                                      setCurrentCol(y);
                                    }
                                  }
                                  setPage(0);
                                purchaseSummaryList(
                                             activeTab,
                                             "",
                                             "asc",
                                             invoceTypes?.value,
                                             finFromYear?.value,
                                             monthFrom?.value,
                                             "", 1
                                 );
            
                                }

                                else if (selectedValuecol == 14) {
                                  const x = searchVal1
                                  var searchInput1 = document.getElementById("custom1");
                                  var searchInput2 = document.getElementById("custom2");
                                  const invFromDate = searchInput1?.value
                                  const invToDate = searchInput2?.value
                                  var columnName = ammendDistributionItcdetailsColumn[currentCol1]?.data;
                                  var value = (searchInput1?.value || searchInput2?.value) && `${invFromDate ? invFromDate : invToDate}to${invToDate ? invToDate : invFromDate}`;
                                  // var value = `${invFromDate}to${invToDate}`;
                                  setSearchDate3(searchInput1?.value);
                                  setSearchDate3To(searchInput2?.value);
                                  let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                  filterObject.push({ [columnName]: value });
                                  if (!searchVal1?.length) {
                                    x.push(value);
                                    let y = currentCol;
                                    y.push(
                                      ammendDistributionItcdetailsColumn[currentCol1]?.data
                                    );
                                    // console.log("jsx=",x,y)
                                    setSearchVal1(x);
                                    setCurrentCol(y);
                                  } else {
                                    const Index = currentCol?.findIndex(
                                      (item) =>
                                      ammendDistributionItcdetailsColumn[currentCol1]?.data ==
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
                                        ammendDistributionItcdetailsColumn[currentCol1]?.data
                                      );
                                      setSearchVal1(x);
                                      setCurrentCol(y);
                                    }
                                  }
                                  setPage(0);
                                purchaseSummaryList(
                                             activeTab,
                                             "",
                                             "asc",
                                             invoceTypes?.value,
                                             finFromYear?.value,
                                             monthFrom?.value,
                                             "", 1
                                 );
            
                                }

                                else if (hot?.getSelected()[0][1] == 16) {
                                  const x = searchVal1
                                  var searchInput1 = document.getElementById("amount1");
                                  var searchInput2 = document.getElementById("amount2");
                                  const fromAmount = searchInput1?.value?.replaceAll(",", "")
                                  const toAmount = searchInput2?.value?.replaceAll(",", "")
                                  var columnName = ammendDistributionItcdetailsColumn[currentCol1]?.data;
                                  // var value = (searchInput1?.value || searchInput2?.value) && `${fromAmount ? fromAmount : toAmount}to${toAmount ? toAmount : fromAmount}`;
                                  var value = `${fromAmount}to${toAmount}`;
                                  setFromAmountIGST(searchInput1?.value);
                                  setToAmountIGST(searchInput2?.value);
                                  let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                  filterObject.push({ [columnName]: value });
                                  if (!searchVal1?.length) {
                                    x.push(value);
                                    let y = currentCol;
                                    y.push(
                                      ammendDistributionItcdetailsColumn[currentCol1]?.data
                                    );
                                    // console.log("jsx=",x,y)
                                    setSearchVal1(x);
                                    setCurrentCol(y);
                                  } else {
                                    const Index = currentCol?.findIndex(
                                      (item) =>
                                      ammendDistributionItcdetailsColumn[currentCol1]?.data ==
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
                                        ammendDistributionItcdetailsColumn[currentCol1]?.data
                                      );
                                      setSearchVal1(x);
                                      setCurrentCol(y);
                                    }
                                  }
                                  setPage(0);
                                purchaseSummaryList(
                                             activeTab,
                                             "",
                                             "asc",
                                             invoceTypes?.value,
                                             finFromYear?.value,
                                             monthFrom?.value,
                                             "", 1
                                 );
            
                                }
            
                                else if (hot?.getSelected()[0][1] == 17) {
                                  const x = searchVal1
                                  var searchInput1 = document.getElementById("amount1");
                                  var searchInput2 = document.getElementById("amount2");
                                  const fromAmount = searchInput1?.value?.replaceAll(",", "")
                                  const toAmount = searchInput2?.value?.replaceAll(",", "")
                                  var columnName = ammendDistributionItcdetailsColumn[currentCol1]?.data;
                                  var value = `${fromAmount}to${toAmount}`;
                                  // var value = (searchInput1?.value || searchInput2?.value) && `${fromAmount ? fromAmount : toAmount}to${toAmount ? toAmount : fromAmount}`;
                                  setFromAmountCGST(searchInput1?.value);
                                  setToAmountCGST(searchInput2?.value);
                                  let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                  filterObject.push({ [columnName]: value });
                                  if (!searchVal1?.length) {
                                    x.push(value);
                                    let y = currentCol;
                                    y.push(
                                      ammendDistributionItcdetailsColumn[currentCol1]?.data
                                    );
                                    // console.log("jsx=",x,y)
                                    setSearchVal1(x);
                                    setCurrentCol(y);
                                  } else {
                                    const Index = currentCol?.findIndex(
                                      (item) =>
                                      ammendDistributionItcdetailsColumn[currentCol1]?.data ==
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
                                        ammendDistributionItcdetailsColumn[currentCol1]?.data
                                      );
                                      setSearchVal1(x);
                                      setCurrentCol(y);
                                    }
                                  }
                                  setPage(0);
                                purchaseSummaryList(
                                             activeTab,
                                             "",
                                             "asc",
                                             invoceTypes?.value,
                                             finFromYear?.value,
                                             monthFrom?.value,
                                             "", 1
                                 );
            
                                }
            
                                else if (hot?.getSelected()[0][1] == 18) {
                                  const x =  searchVal1
                                  var searchInput1 = document.getElementById("amount1");
                                  var searchInput2 = document.getElementById("amount2");
                                  const fromAmount = searchInput1?.value?.replaceAll(",", "")
                                  const toAmount = searchInput2?.value?.replaceAll(",", "")
                                  var columnName = ammendDistributionItcdetailsColumn[currentCol1]?.data;
                                  var value = `${fromAmount}to${toAmount}`;
                                  // var value = (searchInput1?.value || searchInput2?.value) && `${fromAmount ? fromAmount : toAmount}to${toAmount ? toAmount : fromAmount}`;
                                  setFromAmountSGST(searchInput1?.value);
                                  setToAmountSGST(searchInput2?.value);
                                  let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                  filterObject.push({ [columnName]: value });
                                  if (!searchVal1?.length) {
                                    x.push(value);
                                    let y = currentCol;
                                    y.push(
                                      ammendDistributionItcdetailsColumn[currentCol1]?.data
                                    );
                                    // console.log("jsx=",x,y)
                                    setSearchVal1(x);
                                    setCurrentCol(y);
                                  } else {
                                    const Index = currentCol?.findIndex(
                                      (item) =>
                                      ammendDistributionItcdetailsColumn[currentCol1]?.data ==
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
                                        ammendDistributionItcdetailsColumn[currentCol1]?.data
                                      );
                                      setSearchVal1(x);
                                      setCurrentCol(y);
                                    }
                                  }
                                  setPage(0);
                                purchaseSummaryList(
                                             activeTab,
                                             "",
                                             "asc",
                                             invoceTypes?.value,
                                             finFromYear?.value,
                                             monthFrom?.value,
                                             "", 1
                                 );
            
                                }
            
                                else if (hot?.getSelected()[0][1] == 19) {
                                  const x = searchVal1
                                  var searchInput1 = document.getElementById("amount1");
                                  var searchInput2 = document.getElementById("amount2");
                                  const fromAmount = searchInput1?.value?.replaceAll(",", "")
                                  const toAmount = searchInput2?.value?.replaceAll(",", "")
                                  var columnName = ammendDistributionItcdetailsColumn[currentCol1]?.data;
                                  var value = `${fromAmount}to${toAmount}`;
                                  // var value = (searchInput1?.value || searchInput2?.value) && `${fromAmount ? fromAmount : toAmount}to${toAmount ? toAmount : fromAmount}`;
                                  setFromAmountCESS(searchInput1?.value);
                                  setToAmountCESS(searchInput2?.value);
                                  let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                  filterObject.push({ [columnName]: value });
                                  if (!searchVal1?.length) {
                                    x.push(value);
                                    let y = currentCol;
                                    y.push(
                                      ammendDistributionItcdetailsColumn[currentCol1]?.data
                                    );
                                    // console.log("jsx=",x,y)
                                    setSearchVal1(x);
                                    setCurrentCol(y);
                                  } else {
                                    const Index = currentCol?.findIndex(
                                      (item) =>
                                      ammendDistributionItcdetailsColumn[currentCol1]?.data ==
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
                                        ammendDistributionItcdetailsColumn[currentCol1]?.data
                                      );
                                      setSearchVal1(x);
                                      setCurrentCol(y);
                                    }
                                  }
                                  setPage(0);
                                purchaseSummaryList(
                                             activeTab,
                                             "",
                                             "asc",
                                             invoceTypes?.value,
                                             finFromYear?.value,
                                             monthFrom?.value,
                                             "", 1
                                 );
            
                                }
            
                                else if (shouldExcludeCheckBox) {
                                  let x = searchVal1
                                  var checkboxes = document.getElementsByClassName('checkBoxClass');
                                  arrChk = []
                                  setFilterDropDownList([]);
                                  var columnName = ammendDistributionItcdetailsColumn[currentCol1]?.data;
                                  let filterObject2 = !gridCustomFilter ? [] : gridCustomFilter
                                let filterObject = []
                                filterObject2 = filterObject2 == null || filterObject2.length <= 0 ? [] : filterObject2;
          
                                for (let i = 0; i < checkboxes.length; i++) {
                                  if (checkboxes[i].checked) {
                                    arrChk.push({ [columnName]: checkboxes[i].value });
                                    filterObject2.push({ [columnName]: checkboxes[i].value });
                                    filterObject.push(checkboxes[i].value);
                                  } else {
                                    console.log("else is running")
                                    let uniqueArray = filterObject.filter((obj, index, self) =>
                                      index === self.findIndex((t) => (
                                        JSON.stringify(t) === JSON.stringify(obj)
                                      ))
                                    );
                                    let uniqueArray2 = filterObject2.filter((obj, index, self) =>
                                    index === self.findIndex((t) => (
                                      JSON.stringify(t) === JSON.stringify(obj)
                                    ))
                                  );
                                    console.log(uniqueArray,"uniqArray")
                                    console.log(uniqueArray2,"uniqArray")
                                    filterObject2 = uniqueArray2
                                    const index = filterObject.findIndex(obj => obj[columnName] === checkboxes[i].value);
                                    const index1 = filterObject2.findIndex(obj => obj[columnName] === checkboxes[i].value);
                                    if (index !== -1 || index1 !== -1)   {
          
                                      // delete filterObject[index1][columnName];
                                      delete filterObject2[index1][columnName];
                                      // delete filterObject2[index][columnName];
                                    }
                                  }
                                }
                                
                                setGridCustomFilter(filterObject2)
                                var value = filterObject?.join("@#@#")
                                if (!searchVal1?.length) {
                                  x.push(value);
                                  let y = currentCol;
                                  y.push(
                                    ammendDistributionItcdetailsColumn[currentCol1]?.data
                                  );
                                  setSearchVal1(x);
                                  setCurrentCol(y);
                                } else{
                                  const Index = currentCol?.findIndex(
                                    (item) =>
                                    ammendDistributionItcdetailsColumn[currentCol1]?.data ==
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
                                      ammendDistributionItcdetailsColumn[currentCol1]?.data
                                    );
                                    setSearchVal1(x);
                                    setCurrentCol(y);
                                  }
                                  
                                }
                                setPage(0);
                                purchaseSummaryList(
                                  activeTab,
                                  "",
                                  "asc",
                                  invoceTypes?.value,
                                  finFromYear?.value,
                                  monthFrom?.value,
                                  "", 1
                                );
            
                                  const updatedFilterDropDownList = filterObject2.reduce((acc, item) => {
                                    console.log(item,"itememmm")
                                    console.log(acc,"itememmm")
                                    const { eligibilityOfITC, unitType, sezSupplier,originalUnitType} = item;
  
                                    const updateList = (list, value) => {
                                      return list.includes(value) ? list : [...list, value];
                                    };
  
                                    if (eligibilityOfITC !== undefined) {
                                      acc.eligibilityofITCDropDownList = updateList(acc.eligibilityofITCDropDownList, eligibilityOfITC);
                                    } else if (unitType !== undefined) {
                                      acc.unitTypeDropDownList = updateList(acc.unitTypeDropDownList, unitType);
                                    }
                                    //  else if (noteType !== undefined) {
                                    //   acc.noteTypeDropDownList = updateList(acc.noteTypeDropDownList, noteType);
                                    // }
                                     else if (sezSupplier !== undefined) {
                                      acc.sezDropDownList = updateList(acc.sezDropDownList, sezSupplier);
                                    } else if (originalUnitType !== undefined) {
                                      acc.originalUnitTypeDropDownList = updateList(acc.originalUnitTypeDropDownList, originalUnitType);
                                    } 
  
                                    return acc;
                                  }, { eligibilityofITCDropDownList: [], unitTypeDropDownList: [], sezDropDownList:[],originalUnitTypeDropDownList:[] });
  
                                  setFilterDropDownList(updatedFilterDropDownList);
            
                                }
                              }}
                            />
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
                                // styles={customStyles}
                                />) : (<></>)}
                                {/* &nbsp; &nbsp; */}
                                &nbsp; &nbsp;
                                {purchaseData?.length ? ( <span  >
                                  <b>  { ` ${pageNoTitle}`}</b>
                                </span>) : <></>}
                                &nbsp; &nbsp;
                                <ReactPaginate
                                  breakLabel="..."
                                  nextLabel=""
                                  onPageChange={(e) => handlePageClick(e?.selected)}
                                  pageRangeDisplayed={2}
                                  pageCount={pageCount}
                                  previousLabel=""
                                  renderOnZeroPageCount={null}
                                  marginPagesDisplayed={2}
                                  forcePage={page}
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

                          {/* {purchaseData && (
                            <ReactPaginate
                              breakLabel="..."
                              nextLabel=""
                              onPageChange={(e) => handlePageClick(e?.selected)}
                              pageRangeDisplayed={2}
                              pageCount={pageCount}
                              previousLabel=""
                              renderOnZeroPageCount={null}
                              marginPagesDisplayed={2}
                              forcePage={page}
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
                          )} */}
                        </div>
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </TabPane>
            </TabPane>

            {activeTab == 7 && (
              <TabPane tabId="7" key="7">
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
                                      {totalInvoice ? totalInvoice : 0}
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
                                        ? totalInvoiceValue
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
                                        ? totalTaxableValue
                                        : 0}
                                    </span>
                                  </p>
                                </td>

                                <td>
                                  <p className="mb-0">
                                    IGST (₹)
                                    <br />
                                    <span>{totalIGST ? formatINR(totalIGST) : 0}</span>
                                  </p>
                                </td>
                                <td>
                                  <p className="mb-0">
                                    SGST (₹)
                                    <br />
                                    <span>{totalSGST ? formatINR(totalSGST) : 0}</span>
                                  </p>
                                </td>
                                <td>
                                  <p className="mb-0">
                                    CGST (₹)
                                    <br />
                                    <span>{totalCGST ? formatINR(totalCGST) : 0}</span>
                                  </p>
                                </td>
                                <td>
                                  <p className="mb-0">
                                    Cess (₹)
                                    <br />
                                    <span>{totalCess ? formatINR(totalCess) : 0}</span>
                                  </p>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </Col>
                        <Col md={4}>
                          <Row>
                            <Col sm={6}>
                              <Label className="form-label">Invoice Type</Label>
                              <Select
                                id="tax_invtype"
                                placeholder="Invoice Type"
                                theme={selectThemeColors}
                                components={animatedComponents}
                                isDisabled={true}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                value={{
                                  label: "Total ITC Available",
                                  value: "totalITCAvailable",
                                }}
                              />
                            </Col>
                            <Col sm={6}>
                              <Label className="form-label">
                                 Return Period
                              </Label>
                              <Select
                                id="tax_frDt"
                                placeholder="From"
                                isClearable={false}
                                theme={selectThemeColors}
                                closeMenuOnSelect={true}
                                options={panDataFrom}
                                isDisabled={true}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                components={animatedComponents}
                                onChange={selectFromYear}
                                value={finFromYear}
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
                          <div>
                            {purchaseData?.length > 0 ? (
                              <HotTable
                                autoWrapRow={true}
                                data={purchaseData}
                                rowHeights={RowSize}
                                columnHeaderHeight={columnHeaderSize}
                                autoColumnSize={true}
                                colHeaders={colHeaders}
                                afterGetColHeader={theaderTotalITC}
                                stretchH="all"
                                preventOverflow="horizontal"
                                columns={totalITC}
                                contextMenu={false}
                                bindRowsWithHeaders={true}
                                licenseKey="non-commercial-and-evaluation"
                                height="auto"
                                ref={hotRef7}
                                afterOnCellMouseDown={localAfterOnCellMouseDown}
                                mergeCells={false}
                                afterChange={cellChange}
                                afterRenderer={(TD, row, col, prop, value) => {
                                  if (
                                    col > 0 &&
                                    itcErrorArr.findIndex(
                                      (y) =>
                                        y.row == row &&
                                        y.col == col &&
                                        y.tab == activeTab
                                    ) != -1
                                  ) {
                                    TD.style.backgroundColor = "red";
                                  }
                                }}
                                cells={function (row, col) {
                                  var cp = {};
                                  const hot = hotRef?.current?.hotInstance;
                                  cp.className = "child";
                                  if (
                                    col == 1 ||
                                    col == 2 ||
                                    col == 3 ||
                                    col == 4
                                  ) {
                                    cp.className = "text-end";
                                  }

                                  return cp;
                                }}
                                beforeKeyDown={function (e, col) {
                                  if (
                                    e.keyCode == 8 ||
                                    e.keyCode == 46 ||
                                    e.keyCode == 67 ||
                                    e.keyCode == 86
                                  ) {
                                  } else {
                                    var reg = /^[0-9.]+|[\b]+$/;
                                    let col = this?.getSelectedLast()[1];

                                    if (col > 0) {
                                      if (!reg.test(e.key)) {
                                        e.preventDefault();
                                      }
                                    }
                                  }
                                }}
                                filters={false}
                                beforeCreateRow={function (index, amount) {
                                  let countRow = this?.countRows();
                                  if (this?.isEmptyRow(countRow - 0)) {
                                    return false;
                                  }
                                  return true;
                                }}

                              />
                            ) : (
                              <HotTable
                                autoWrapRow={true}
                                style={{
                                  textAlign: "center",
                                  overflowX: "hidden",
                                }}
                                data={[{ Description: "No Data Found" }]}
                                rowHeights={RowSize}
                                columnHeaderHeight={columnHeaderSize}
                                autoColumnSize={true}
                                colHeaders={colHeaders}
                                // afterGetColHeader={theaderAmends}
                                stretchH="all"
                                preventOverflow="horizontal"
                                columns={totalITC}
                                contextMenu={false}
                                readOnly={true}
                                bindRowsWithHeaders={true}
                                licenseKey="non-commercial-and-evaluation"
                                height="auto"
                                ref={hotRef5}
                                afterOnCellMouseDown={localAfterOnCellMouseDown}
                                mergeCells={[
                                  { row: 0, col: 0, rowspan: 1, colspan: 5 },
                                ]}
                                cells={function (row, col) {
                                  var cp = {};
                                  const hot = hotRef?.current?.hotInstance;
                                  cp.className = "child";
                                  if (
                                    col == 1 ||
                                    col == 2 ||
                                    col == 3 ||
                                    col == 4
                                  ) {
                                    cp.className = "text-end";
                                  }

                                  return cp;
                                }}
                                filters={false}

                              />
                            )}


                            {purchaseData && (
                              <ReactPaginate
                                breakLabel="..."
                                nextLabel=""
                                onPageChange={(e) =>
                                  handlePageClick(e?.selected)
                                }
                                pageRangeDisplayed={2}
                                pageCount={pageCount}
                                previousLabel=""
                                renderOnZeroPageCount={null}
                                marginPagesDisplayed={2}
                                forcePage={page}
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
                            )}
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </TabPane>
              </TabPane>
            )}

            {activeTab == 8 && (
              <TabPane tabId="8" key="8">
                <TabPane tabId="8" key="8">
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
                                      {totalInvoice ? totalInvoice : 0}
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
                                        ? totalInvoiceValue
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
                                        ? totalTaxableValue
                                        : 0}
                                    </span>
                                  </p>
                                </td>

                                <td>
                                  <p className="mb-0">
                                    IGST (₹)
                                    <br />
                                    <span>{totalIGST ? totalIGST : 0}</span>
                                  </p>
                                </td>
                                <td>
                                  <p className="mb-0">
                                    SGST (₹)
                                    <br />
                                    <span>{totalSGST ? formatINR(totalSGST) : 0}</span>
                                  </p>
                                </td>
                                <td>
                                  <p className="mb-0">
                                    CGST (₹)
                                    <br />
                                    <span>{totalCGST ? formatINR(totalCGST) : 0}</span>
                                  </p>
                                </td>
                                <td>
                                  <p className="mb-0">
                                    Cess (₹)
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
                            <Col sm={6}>
                              <Label className="form-label">Invoice Type</Label>
                              <Select
                                id="tax_invtype"
                                placeholder="Invoice Type"
                                theme={selectThemeColors}
                                components={animatedComponents}
                                isDisabled={true}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                value={{
                                  label: "Late Fee",
                                  value: "AmendofDistofITC",
                                }}
                              />
                            </Col>
                            <Col sm={6}>
                              <Label className="form-label">
                                 Return Period
                              </Label>
                              <Select
                                id="tax_frDt"
                                placeholder="From"
                                isClearable={false}
                                theme={selectThemeColors}
                                closeMenuOnSelect={true}
                                options={panDataFrom}
                                isDisabled={true}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                components={animatedComponents}
                                onChange={selectFromYear}
                                value={finFromYear}
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
                          <div>
                            {purchaseData?.length > 0 ? (
                              <HotTable
                                autoWrapRow={true}
                                data={purchaseData}
                                autoColumnSize={true}
                                rowHeights={RowSize}
                                columnHeaderHeight={columnHeaderSize}
                                colHeaders={colHeaders}
                                afterGetColHeader={theaderLateFee}
                                stretchH="all"
                                preventOverflow="horizontal"
                                columns={lateFeeColumns}
                                contextMenu={false}
                                readOnly={true}
                                bindRowsWithHeaders={true}
                                licenseKey="non-commercial-and-evaluation"
                                height="auto"
                                ref={hotRef8}
                                afterOnCellMouseDown={localAfterOnCellMouseDown}
                                mergeCells={false}
                                afterChange={cellChangeLateFee}
                                beforeKeyDown={function (e, col) {
                                  if (
                                    e.keyCode == 8 ||
                                    e.keyCode == 46 ||
                                    e.keyCode == 67 ||
                                    e.keyCode == 86
                                  ) {
                                  } else {
                                    var reg = /^[0-9.]+|[\b]+$/;
                                    let col = this?.getSelectedLast()[1];

                                    if (col == 1 || col == 2) {
                                      if (!reg.test(e.key)) {
                                        e.preventDefault();
                                      }
                                    }
                                  }
                                }}
                                afterRenderer={(TD, row, col, prop, value) => {
                                  if (
                                    (col == 1 || col == 2) &&
                                    lateFeeErrorArr.findIndex(
                                      (y) =>
                                        y.row == row &&
                                        y.col == col &&
                                        y.tab == activeTab
                                    ) != -1
                                  ) {
                                    TD.style.backgroundColor = "red";
                                  }
                                }}
                                cells={function (row, col) {
                                  var cp = {};
                                  // if (col !== null) {
                                  //   cp.renderer = emptyRenderLateFee;
                                  // }
                                  const hot = hotRef?.current?.hotInstance;
                                  cp.className = "child";
                                  if (col == 1 || col == 2) {
                                    cp.className = "text-end";
                                  }

                                  return cp;
                                }}
                                filters={false}
                                beforeCreateRow={function (index, amount) {
                                  let countRow = this?.countRows();
                                  if (this?.isEmptyRow(countRow - 0)) {
                                    return false;
                                  }
                                  return true;
                                }}
                              />
                            ) : (
                              <HotTable
                                autoWrapRow={true}
                                style={{
                                  textAlign: "center",
                                  overflowX: "hidden",
                                }}
                                data={[{ Description: "No Data Found" }]}
                                autoColumnSize={true}
                                colHeaders={colHeaders}
                                rowHeights={RowSize}
                                columnHeaderHeight={columnHeaderSize}
                                // afterGetColHeader={theaderAmends}
                                stretchH="all"
                                preventOverflow="horizontal"
                                columns={lateFeeColumns}
                                contextMenu={false}
                                readOnly={true}
                                bindRowsWithHeaders={true}
                                licenseKey="non-commercial-and-evaluation"
                                height="auto"
                                ref={hotRef8}
                                afterOnCellMouseDown={localAfterOnCellMouseDown}
                                mergeCells={[
                                  { row: 0, col: 0, rowspan: 1, colspan: 4 },
                                ]}
                                cells={function (row, col) {
                                  var cp = {};
                                  const hot = hotRef?.current?.hotInstance;
                                  cp.className = "child";
                                  if (col == 1 || col == 2) {
                                    cp.className = "text-end";
                                  }

                                  return cp;
                                }}
                                filters={false}
                                                            />
                            )}
                            {purchaseData && (
                              <ReactPaginate
                                breakLabel="..."
                                nextLabel=""
                                onPageChange={(e) =>
                                  handlePageClick(e?.selected)
                                }
                                pageRangeDisplayed={2}
                                pageCount={pageCount}
                                previousLabel=""
                                renderOnZeroPageCount={null}
                                marginPagesDisplayed={2}
                                forcePage={page}
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
                            )}
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </TabPane>
              </TabPane>
            )}
          </TabContent>
        </Col>
      </Row>
    </div>
  );
};

export default Gstr6Invoices;
