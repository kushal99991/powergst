import { useState, useEffect, useRef } from "react";
import { PageSize, RowSize, checkBoxTitle, columnHeaderSize, paginationList, paginationTitle } from "../../../configs/config";
import { HotTable } from "@handsontable/react";
import { registerAllModules } from "handsontable/registry";
import GSRT1SummaryInvoice from "../../../services/gstr1/gstr1Services/gstr1PurchaseInvoiceService";
import errorCodeConfig from "../../../configs/apiErrorCodeConfig";
import makeAnimated from "react-select/animated";
import Select from "react-select"; // eslint-disable-line
import { selectThemeColors } from "@utils";
import {
  useNavigate,
  useParams,
  useLocation,
  useOutletContext,
} from "react-router-dom";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { globleVariable } from "../../../configs/globalVariable";
import LocalFunction from "../../../configs/getLocalFunction";
import SessionFunction from "../../../configs/getSessionFunction";
import { downloadURL } from "@helper/downloadUrl";
import iifPurchaseInvoice from "../../../services/iffServices/iifPurchaseInvoice";
import iifSummaryService from "../../../services/iffServices/iifSummaryService";
import encryptData from "../../../auth/crypto/crypto";
import TableCardDetails from "./tableCardDetails";
import $ from 'jquery'


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
import { showTotalRowPerPage } from "@helper/tableRowsPerPage";


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

const FinDateTime = LocalFunction.getLocalValue(
  globleVariable.serverDateTime,
  true
);
const IFFInvoices = ({ returnDate }) => {
  let fromPath = window.location.pathname;
  const navigate = useNavigate();

  const { setGSRT1Data, stepper } = useOutletContext();
  const [block, setBlock] = useState(false);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [pageNoTitle, setPageNoTitle] = useState("")
  const [pageNoSelect, setPageNoSelect] = useState(paginationList[0]);
  const [rowsPerPage, setRowsPerPage] = useState(PageSize);
  const [currentCol, setCurrentCol] = useState([]);
  const [currentCol1, setCurrentCol1] = useState();
  const [searchVal1, setSearchVal1] = useState([]);
  const [searchDate, setSearchDate] = useState("");
  const [toDate, setToDate] = useState("");



  const [fromtotalTaxableAmount, setFromTotalTaxableAmount] = useState("");
  const [tototalTaxableAmount, setToTotalTaxableAmount] = useState("");

  const [fromtotalTaxAmount, setFromTotalTaxAmount] = useState("");
  const [tototalTaxAmount, setToTotalTaxAmount] = useState("");

  const [frominvoiceValue, setFromInvoiceValue] = useState("");
  const [toinvoiceValue, setToInvoiceValue] = useState("");


  const [reverseCharge, setReverseCharge] = useState([]);
  const [noteType, setNoteType] = useState([]);

  const [gridCustomFilter, setGridCustomFilter] = useState([]);


  const [searchDate1, setSearchDate1] = useState("");
  const [searchDate2, setSearchDate2] = useState("");

  const [currentColb2cs, setCurrentColb2cs] = useState([]);
  const [currentCol1b2cs, setCurrentCol1b2cs] = useState();
  const [searchValb2cs, setSearchValb2cs] = useState([]);

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

  const [crDrType, setCrDrType] = useState(null);


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
  const [btnDisable1, setbtnDisable1] = useState(false);
  const [financialYearList, setFinancialYearList] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);

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

  let arrChk = []

  const [filterDropDownList, setFilterDropDownList] = useState({
    reverseChargeDropDownList: [],
    noteTypeDropDownList: []
  })

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
      deleteSaleInvoice: deleteSaleInvoice,
      ExportSectionWiseData: ExportSectionWiseData,
      ClearFilter: ClearFilter,
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


  const location = useLocation();
  let { id } = useParams();

  let searchUrlValue = null;


  const b2bColumns = [
    {
      data: "isChecked",
      type: "checkbox",
      width: 20,
      readOnly: false,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "recipientGSTIN",
      title: "Buyer GSTIN",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "receiverName",
      title: "Receiver Name",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "invoiceNumber",
      title: "Invoice Number",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "invoiceDate",
      title: "Invoice Date",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      // data: "totalTaxableAmount", title: "Total Taxable Amt (₹)", readOnly: true,
      data: "totalTaxableAmount",
      title: "Taxable Value (₹)",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "totalTaxAmount",
      title: "Total Tax (₹)",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "invoiceValue",
      title: "Invoice Value (₹)",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "reverseCharge",
      title: "RCM",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    // {
    //     data: "invoiceType", title: "Invoice Type", readOnly: true,
    //     columnSorting: {
    //         indicator: false,
    //         headerAction: false,
    //     }
    // },
  ];
  const b2bColumnsEmpty = [
    {
      data: "select",
      name: "",
      width: 1,
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "recipientGSTIN",
      title: "Buyer GSTIN",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "receiverName",
      title: "Receiver Name",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "invoiceNumber",
      title: "Invoice Number",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "invoiceDate",
      title: "Invoice Date",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      // data: "totalTaxableAmount", title: "Total Taxable Amt (₹)", readOnly: true,
      data: "totalTaxableAmount",
      title: "Taxable Value (₹)",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "totalTaxAmount",
      title: "Total Tax (₹)",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "invoiceValue",
      title: "Invoice Value (₹)",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "reverseCharge",
      title: "RCM",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    // {
    //     data: "invoiceType", title: "Invoice Type", readOnly: true,
    //     columnSorting: {
    //         indicator: false,
    //         headerAction: false,
    //     }
    // },
  ];

  const ammentmentInvalidColumns = [
    {
      data: "isChecked",
      type: "checkbox",
      width: 20,
      readOnly: false,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "recipientGSTIN",
      title: "Buyer GSTIN",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "receiverName",
      title: "Receiver Name",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "revisedInvoiceNumber",
      title: "Revised Invoice Number",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "revisedInvoiceDate",
      title: "Revised Invoice Date",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      // data: "totalTaxableAmount", title: "Total Taxable Amt (₹)", readOnly: true,
      data: "totalTaxableAmount",
      title: "Taxable Value (₹)",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "totalTaxAmount",
      title: "Total Tax (₹)",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "invoiceValue",
      title: "Invoice Value (₹)",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "reverseCharge",
      title: "RCM",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
  ];
  const ammentmentInvalidColumnsEmpty = [
    {
      data: "select",
      name: "",
      width: 1,
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "recipientGSTIN",
      title: "Buyer GSTIN",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "receiverName",
      title: "Receiver Name",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "revisedInvoiceNumber",
      title: "Revised Invoice Number",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "revisedInvoiceDate",
      title: "Revised Invoice Date",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      // data: "totalTaxableAmount", title: "Total Taxable Amt (₹)", readOnly: true,
      data: "totalTaxableAmount",
      title: "Taxable Value (₹)",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "totalTaxAmount",
      title: "Total Tax (₹)",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "invoiceValue",
      title: "Invoice Value (₹)",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "reverseCharge",
      title: "RCM",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
  ];

  const crDrInvalidColumns = [
    {
      data: "isChecked",
      type: "checkbox",
      width: 25,
      readOnly: false,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "recipientGSTIN",
      title: "Buyer GSTIN",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "receiverName",
      title: "Vendor Name",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "invoiceNumber",
      title: "Note No",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },

    {
      data: "invoiceDate",
      title: "Note Date",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "totalTaxableAmount",
      title: "Total Taxable Amt (₹)",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "totalTaxAmount",
      title: "Total Tax Amt (₹)",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "invoiceValue",
      title: "Invoice Value (₹)",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "noteType",
      title: "Document Type",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "reverseCharge",
      title: "RCM",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    // { data: "purchaseId", title: "purchaseId" },
  ];
  const crDrInvalidColumnsEmpty = [
    {
      data: "select",
      name: "",
      width: 1,
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "recipientGSTIN",
      title: "Buyer GSTIN",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "receiverName",
      title: "Vendor Name",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "invoiceNumber",
      title: "Note No",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },

    {
      data: "invoiceDate",
      title: "Note Date",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "totalTaxableAmount",
      title: "Total Taxable Amt (₹)",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "totalTaxAmount",
      title: "Total Tax Amt (₹)",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "invoiceValue",
      title: "Invoice Value (₹)",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "noteType",
      title: "Document Type",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "reverseCharge",
      title: "RCM",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    // { data: "purchaseId", title: "purchaseId" },
  ];

  const ammendentcrDrInvalidColumns = [
    {
      data: "isChecked",
      type: "checkbox",
      width: 20,
      readOnly: false,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "recipientGSTIN",
      title: "Buyer GSTIN",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "receiverName",
      title: "Vendor Name",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "revisedInvoiceNumber",
      title: "Revised Note Number",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },

    {
      data: "revisedInvoiceDate",
      title: "Revised Note Date",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "totalTaxableAmount",
      title: "Total Taxable Amt (₹)",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "totalTaxAmount",
      title: "Total Tax Amt (₹)",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "invoiceValue",
      title: "Invoice Value (₹)",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "noteType",
      title: "Document Type",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "reverseCharge",
      title: "RCM",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    // { data: "purchaseId", title: "purchaseId" },
  ];
  const ammendentcrDrInvalidColumnsEmpty = [
    {
      data: "select",
      name: "",
      width: 1,
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "recipientGSTIN",
      title: "Buyer GSTIN",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "receiverName",
      title: "Vendor Name",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "revisedInvoiceNumber",
      title: "Revised Note Number",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },

    {
      data: "revisedInvoiceDate",
      title: "Revised Note Date",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "totalTaxableAmount",
      title: "Total Taxable Amt (₹)",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "totalTaxAmount",
      title: "Total Tax Amt (₹)",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "invoiceValue",
      title: "Invoice Value (₹)",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "noteType",
      title: "Document Type",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "reverseCharge",
      title: "RCM",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    // { data: "purchaseId", title: "purchaseId" },
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

  //** Dropdown with pagination func - new functionality
  const onPageChangeFunc = (e) => {
    console.log("page chagne", e);
    setPageNoSelect(e);
    setRowsPerPage(e.value);
    setPage(0);
    setServerSidePage(true);


  };

  useEffect(() => {
    setPanData(YearList);
    setPanDataFrom(YearList);
  }, []);

  useEffect(() => {
    setBlock(true)
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
    isChecked = false;
    setPage(0);
    setDisplayType(true);

    setFromTotalTaxableAmount("");
    setToTotalTaxableAmount("");
    setFromTotalTaxAmount("");
    setToTotalTaxAmount("");
    setFromInvoiceValue("");
    setToInvoiceValue("");

    setSearchDate("");
    setToDate("");

    setFilterDropDownList({
      reverseChargeDropDownList: [],
      noteTypeDropDownList: []
    });
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


    searchValue = searchValue?.map((obj) =>
      isNumber(obj?.replaceAll(",", "")) ? obj?.replaceAll(",", "") : obj
    );

    searchPayload = {
      userClientId: G_UCParId,
      pageStart: filterPageNo !== null && filterPageNo !== undefined && filterPageNo !== "" ? filterPageNo : page + 1,
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
    iifPurchaseInvoice
      .getIffPagination(searchPayload)
      .then((res) => {
        console.log("this api is calling now var check", invType);
        if (res.status === 200) {
          setBlock(false);
          setCount(count + 1);
          if (count == 0) {
            setSubTypeList(res?.data?.data?.goodsService);
            setInvoiceTypeList(res?.data?.data?.sectionList);
            setReverseCharge(res?.data?.data?.reverseCharge);
            setFinFromYearList(res?.data?.data?.financialYearList);
            setFinToYearList(res?.data?.data?.financialYearList);
            setMonthFromList(res?.data?.data?.month);
            setMonthToList(res?.data?.data?.month);
            setNoteType(res?.data?.data?.creditDebit);
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


    // }
  };
  const purchaseData = data;
  const pageCount = Math.ceil(
    purchaseData?.length && purchaseData[0].totalRowCount / rowsPerPage
  );


  useEffect(() => {

    let rowPageCount = showTotalRowPerPage(page, rowsPerPage, purchaseData && purchaseData[0]?.totalRowCount)
    setPageNoTitle(rowPageCount)

  }, [purchaseData && purchaseData[0]?.totalRowCount, page, rowsPerPage])


  const handlePageClick = (event) => {
    setPage(event?.selected);
    setServerSidePage(true);
  };

  // IFF refs
  const hotRef = useRef(null);
  const hotRef1 = useRef(null);
  const hotRef2 = useRef(null);
  const hotRef3 = useRef(null);


  // ** B2b Tab
  const theader = (col, TH) => {
    if ((col === 0 || col > 12) && col != 15) {
      const button = TH.children[0].children[0];
      button?.parentNode?.removeChild(button);
    }
    if (col == 5 || col == 6 || col == 7) {
      TH.className = "htRight";
    } else {
      TH.className = "htLeft";
    }

    if (activeTab == 1) {

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
          const buttonExists = document.querySelector(`.ht_clone_top thead th:nth-child(${columnIndex + 1}) button`);

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

  };



  // ** ITC Tab
  const theaderITC = (col, TH) => {
    if ((col == 0 || col > 15) && col != 18) {
      const button = TH.children[0].children[0];
      button?.parentNode?.removeChild(button);
    }
    if (col == 5 || col == 6 || col == 7) {
      TH.className = "htRight";
    } else {
      TH.className = "htLeft";
    }
    if (activeTab == 2) {
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


        ammentmentInvalidColumns.forEach((ele, index) => {
          const columnIndex = index;
          const buttonExists = document.querySelector(`.ht_clone_top thead th:nth-child(${columnIndex + 1}) button`);

          const columnMatchesCondition = Object.keys(finalObj).includes(ele.data);
          // uniq.some(col1 => ele?.data.includes(col1));

          // Check if column value is not null 
          const columnValueValid = finalObj[ele.data] !== null && finalObj[ele.data] !== "";

          if (buttonExists && columnMatchesCondition && columnValueValid) {
            const TH = document.querySelector(`.tab-pane.active .ht_clone_top thead th:nth-child(${columnIndex + 1})`);
            console.log(TH, "TH");
            if (TH) {
              TH.classList.add("htFiltersActive");
            } else {
              TH.classList.remove("htFiltersActive");
            }
          }
        });
      }
    }

  };
  // ** CDN

  const theaderCdn = (col, TH) => {
    if ((col == 0 || col > 15) && col != 18) {
      const button = TH.children[0].children[0];
      button?.parentNode?.removeChild(button);
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
    if (activeTab == 3) {
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
              TH.classList.add("htFiltersActive");
            } else {
              TH.classList.remove("htFiltersActive");
            }
          }
        });
      }
    }

  };

  let arrFilter = [];

  function formatINR(x) {
    return x.toLocaleString("en-IN", { minimumFractionDigits: 2 });
  }

  // ** CDNA
  const theaderCdna = (col, TH) => {
    if ((col == 0 || col > 15) && col != 20) {
      const button = TH.children[0].children[0];
      button?.parentNode?.removeChild(button);
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
    if (activeTab == 4) {
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


        ammendentcrDrInvalidColumns.forEach((ele, index) => {
          const columnIndex = index;
          const buttonExists = document.querySelector(`.ht_clone_top thead th:nth-child(${columnIndex + 1}) button`);

          const columnMatchesCondition = Object.keys(finalObj).includes(ele.data);
          // uniq.some(col1 => ele?.data.includes(col1));

          // Check if column value is not null 
          const columnValueValid = finalObj[ele.data] !== null && finalObj[ele.data] !== "";

          if (buttonExists && columnMatchesCondition && columnValueValid) {
            const TH = document.querySelector(`.tab-pane.active .ht_clone_top thead th:nth-child(${columnIndex + 1})`);
            console.log(TH, "TH");
            if (TH) {
              TH.classList.add("htFiltersActive");
            } else {
              TH.classList.remove("htFiltersActive");
            }
          }
        });
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

  const deleteSaleInvoice = () => {
    console.log("delete data");

    var delArr = [];
    if (purchaseData.length > 0) {
      for (let i = 0; i < purchaseData.length; i++) {
        if (
          purchaseData[i].isChecked == "true" ||
          purchaseData[i].isChecked == true
        ) {
          console.log(purchaseData[i], "purchaseData[i]")
          delArr.push(purchaseData[i].iffId);
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
            iffId: delArr,
          };

          setBlock(true);
          iifPurchaseInvoice
            .iifPaginationDataDelete(deleteGSRT1Invoices)
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
    if (coords?.row !== -1 && coords?.col == 0) {

      let checkValue = hot?.getDataAtRowProp(coords?.row, "isChecked");
      hot?.setDataAtCell(coords?.row, 0, !checkValue);
    }
    if (coords.row !== -1) {
      if (
        coords.col == 1
      ) {
        if (hot?.getSourceDataAtRow(coords?.row)) {
          console.log(hot?.getSourceDataAtRow(coords?.row), "hot?.getSourceDataAtRow(coords?.row)")
          const { iffId, sectionId, sheetName } = hot?.getSourceDataAtRow(
            coords?.row
          );
          console.log(fromPath);
          if (iffId !== null && iffId !== "" && iffId !== undefined) {
            console.log(hot?.getSourceDataAtRow(coords.row));
            const queryStr =
              "iffId=" +
              iffId +
              "&finId=" +
              G_FY +
              "&finMonth=" +
              G_FM +
              "&sectionId=" +
              sectionId;
            const encrypData = encryptData.encrypt(queryStr);
            // console.log("purchaseId=" + gstr1Id);
            navigate("/gst-returns/iff-sales/iff-sales-invoice?" + encrypData, {
              state: { pathname: fromPath, sectionName: sheetName },
            });
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
      (item) => ammentmentInvalidColumns[coords?.col]?.data == item
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

    if (coords.row !== -1) {
      if (
        coords.col == 1
      ) {
        if (hot?.getSourceDataAtRow(coords?.row)) {
          console.log(hot?.getSourceDataAtRow(coords?.row), "hot?.getSourceDataAtRow(coords?.row)")
          const { iffId, sectionId, sheetName } = hot?.getSourceDataAtRow(
            coords?.row
          );
          console.log(fromPath);
          if (iffId !== null && iffId !== "" && iffId !== undefined) {
            console.log(hot?.getSourceDataAtRow(coords.row));
            const queryStr =
              "iffId=" +
              iffId +
              "&finId=" +
              G_FY +
              "&finMonth=" +
              G_FM +
              "&sectionId=" +
              sectionId;
            const encrypData = encryptData.encrypt(queryStr);
            // console.log("purchaseId=" + gstr1Id);
            navigate("/gst-returns/iff-sales/iff-sales-invoice?" + encrypData, {
              state: { pathname: fromPath, sectionName: sheetName },
            });
          }
        }
      }
    }
    if (coords?.row !== -1 && coords?.col == 0) {

      let checkValue = hot?.getDataAtRowProp(coords?.row, "isChecked");
      hot?.setDataAtCell(coords?.row, 0, !checkValue);
    }
    // activeTab == 7 &&
    setCurrentCol1b2cs(coords?.col);
  }

  function localAfterOnCellMouseDown3(event, coords, td) {
    let hot = hotRef2?.current?.hotInstance;

    const Index = currentCol?.findIndex(
      (item) => crDrInvalidColumns[coords?.col]?.data == item
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

    if (coords.row !== -1) {
      if (
        coords.col == 1
      ) {
        if (hot?.getSourceDataAtRow(coords?.row)) {
          console.log(hot?.getSourceDataAtRow(coords?.row), "hot?.getSourceDataAtRow(coords?.row)")
          const { iffId, sectionId, sheetName } = hot?.getSourceDataAtRow(
            coords?.row
          );
          console.log(fromPath);
          if (iffId !== null && iffId !== "" && iffId !== undefined) {
            console.log(hot?.getSourceDataAtRow(coords.row));
            const queryStr =
              "iffId=" +
              iffId +
              "&finId=" +
              G_FY +
              "&finMonth=" +
              G_FM +
              "&sectionId=" +
              sectionId;
            const encrypData = encryptData.encrypt(queryStr);
            // console.log("purchaseId=" + gstr1Id);
            navigate("/gst-returns/iff-sales/iff-sales-invoice?" + encrypData, {
              state: { pathname: fromPath, sectionName: sheetName },
            });
          }
        }
      }
    }

    if (coords?.row !== -1 && coords?.col == 0) {

      let checkValue = hot?.getDataAtRowProp(coords?.row, "isChecked");
      hot?.setDataAtCell(coords?.row, 0, !checkValue);
    }
    // activeTab == 7 &&
    setCurrentCol1b2cs(coords?.col);
  }

  function localAfterOnCellMouseDown4(event, coords, td) {
    let hot = hotRef3?.current?.hotInstance;

    const Index = currentCol?.findIndex(
      (item) => ammendentcrDrInvalidColumns[coords?.col]?.data == item
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
      }, 100);
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

    if (coords.row !== -1) {
      if (
        coords.col == 1
      ) {
        if (hot?.getSourceDataAtRow(coords?.row)) {
          console.log(hot?.getSourceDataAtRow(coords?.row), "hot?.getSourceDataAtRow(coords?.row)")
          const { iffId, sectionId, sheetName } = hot?.getSourceDataAtRow(
            coords?.row
          );
          console.log(fromPath);
          if (iffId !== null && iffId !== "" && iffId !== undefined) {
            console.log(hot?.getSourceDataAtRow(coords.row));
            const queryStr =
              "iffId=" +
              iffId +
              "&finId=" +
              G_FY +
              "&finMonth=" +
              G_FM +
              "&sectionId=" +
              sectionId;
            const encrypData = encryptData.encrypt(queryStr);
            // console.log("purchaseId=" + gstr1Id);
            navigate("/gst-returns/iff-sales/iff-sales-invoice?" + encrypData, {
              state: { pathname: fromPath, sectionName: sheetName },
            });
          }
        }
      }
    }
    if (coords?.row !== -1 && coords?.col == 0) {

      let checkValue = hot?.getDataAtRowProp(coords?.row, "isChecked");
      hot?.setDataAtCell(coords?.row, 0, !checkValue);
    }
    // activeTab == 7 &&
    setCurrentCol1b2cs(coords?.col);
  }

  let dropDonwNameAssign;
  if (b2bColumns[currentCol1]?.data === "reverseCharge") {
    dropDonwNameAssign = reverseCharge;
  }
  let dropDonwName = dropDonwNameAssign !== undefined && dropDonwNameAssign !== null ? dropDonwNameAssign : reverseCharge;


  let dropDonwNameAssign1;
  if (ammentmentInvalidColumns[currentCol1]?.data === "reverseCharge") {
    dropDonwNameAssign1 = reverseCharge;
  }
  let dropDonwName1 = dropDonwNameAssign1 !== undefined && dropDonwNameAssign1 !== null ? dropDonwNameAssign1 : reverseCharge;


  let dropDonwNameAssign2;
  if (crDrInvalidColumns[currentCol1]?.data === "noteType") {
    dropDonwNameAssign2 = noteType;
  }
  if (crDrInvalidColumns[currentCol1]?.data === "reverseCharge") {
    dropDonwNameAssign2 = reverseCharge;
  }
  let dropDonwName2 = dropDonwNameAssign2 !== undefined && dropDonwNameAssign2 !== null ? dropDonwNameAssign2 : reverseCharge;

  let dropDonwNameAssign3;
  if (ammendentcrDrInvalidColumns[currentCol1]?.data === "noteType") {
    dropDonwNameAssign3 = noteType;
  }
  if (ammendentcrDrInvalidColumns[currentCol1]?.data === "reverseCharge") {
    dropDonwNameAssign3 = reverseCharge;
  }
  let dropDonwName3 = dropDonwNameAssign3 !== undefined && dropDonwNameAssign3 !== null ? dropDonwNameAssign3 : reverseCharge;


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

    iifSummaryService
      .exportIffExportData(
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


    setFromTotalTaxableAmount("");
    setToTotalTaxableAmount("");
    setFromTotalTaxAmount("");
    setToTotalTaxAmount("");
    setFromInvoiceValue("");
    setToInvoiceValue("");

    setSearchDate("");
    setToDate("");

    setFilterDropDownList({
      reverseChargeDropDownList: [],
      noteTypeDropDownList: []
    });
    
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
              <TableCardDetails
                totalInvoice={totalInvoice} totalInvoiceValue={totalInvoiceValue} totalTaxableValue={totalTaxableValue} totalIGST={totalIGST} totalSGST={totalSGST} totalCGST={totalCGST} totalCess={totalCess}
                id="purchaseId_invtype" placeholder="Invoice Type" theme={selectThemeColors} components={animatedComponents} options={invoiceTypeList} className="basic-multi-select" classNamePrefix="select" onChange={filterInvoiceType} isDisabled={true} value={{ label: "B2B", value: "b2b" }}
                idReturnPeriod="from" placholderReturnPeriod="Range" isClearable={false} closeMenuOnSelect={true} optionsReturnPeriod={panDataFrom} onChangeReturnPeriod={selectFromYear} valueReturnPeriod={finFromYear}
              />
              <Card>
                <CardBody className="CardBody p-0">
                  <Row>
                    <Col sm="12">
                      <div>
                        <HotTable
                          ref={hotRef}
                          viewportColumnRenderingOffset={100}
                          readOnly={true}
                          autoWrapRow={true}
                          style={purchaseData.length > 0 ? "" : { textAlign: "center", overflowX: "hidden" }}
                          data={purchaseData.length > 0 ? purchaseData : [{ recipientGSTIN: "No Data Found!" }]}
                          rowHeights={RowSize}
                          columnHeaderHeight={columnHeaderSize}
                          autoColumnSize={{
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
                          mergeCells={purchaseData.length > 0 ? false : [
                            { row: 0, col: 1, rowspan: 1, colspan: 8 },
                          ]}
                          hiddenColumns={purchaseData.length > 0 ? purchaseData : [{ columns: 0 }]}
                          cells={function (row, col) {
                            var cp = {};
                            const hot = hotRef?.current?.hotInstance;
                            cp.className = "child";
                            if (col == 5 || col == 6 || col == 7) {
                              cp.className = "text-end";
                            }
                            if (purchaseData.length > 0) {
                              if (col == 1) {
                                cp.className = "text-danger myRow";
                              }

                            } else {
                              if (col == 1) {
                                cp.className = "myRow";
                              }
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
                                  const isValidColumn = [4, 5, 6, 7, 8].includes(selectedValue);
                                  return isValidColumn;

                                },
                              },
                              table1checkbox: { // For CheckBox custom option

                                name: `<div  style="margin-left:6px">${checkBoxTitle}<label class="float-end text-danger "><a><u id="selectAll">Select All</u></a></label></div> <div  class="checkboxmenu custom-scrollbar"> <div >  <table id="searchTable" >
                                  ${dropDonwName &&
                                  dropDonwName?.map((index) => (
                                    `<tr><td><input class="checkBoxClass" type="checkbox" value="${index?.value}" /> <span class="fw-normal">${index?.label?.length > 20 ? index?.label?.substring(0, 20) + "..." : index?.label}</span> </td></tr>`
                                  )).join('')
                                  }
          
                                    </table></div>
                                    </div>`, // Name can contain HTML 
                                hidden() {
                                  const selectedCol = this.getSelectedRangeLast().to.col;
                                  const isHiddenCol = ![8].includes(selectedCol);

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

                              option10: {
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
                                  return (
                                    this.getSelectedRangeLast().to.col !=
                                    4
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
                                    clickEvent.stopImmediatePropagation();
                                  }

                                  clickEvent.stopImmediatePropagation();
                                },
                              },
                              option6: createOptionMinMax(fromtotalTaxableAmount, tototalTaxableAmount, 5),
                              option7: createOptionMinMax(fromtotalTaxAmount, tototalTaxAmount, 6),
                              option8: createOptionMinMax(frominvoiceValue, toinvoiceValue, 7),

                              clear: {
                                name: `<button id='btnClear' name='Clear' tabIndex="-1"  value='Clear'>Clear</button>`,
                                //disabled: true,
                                callback: function (key, selection, clickEvent) {

                                  var src = clickEvent.target;
                                  console.log("name", src.tagName);
                                  if (src.tagName.toLowerCase() === "button") {
                                    if (clickEvent.target.id == "btnClear") {
                                      const hot = hotRef?.current?.hotInstance;
                                      var value = "";
                                      const selectedValue = this.getSelected()[0][1];
                                      let filterObject = !gridCustomFilter ? [] : gridCustomFilter

                                      const isValidCheckBoxColumn = [8].includes(selectedValue);

                                      if (isValidCheckBoxColumn) {

                                        var checkboxes = document.getElementsByClassName('checkBoxClass');

                                        arrChk = []
                                        setFilterDropDownList([]);
                                        var columnName = b2bColumns[currentCol1]?.data;

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

                                      }
                                      if (
                                        hot?.getSelected()[0][1] == 4
                                      ) {
                                        setSearchDate(value);
                                        setToDate(value);
                                      }

                                      const x = searchVal1;
                                      if (!searchVal1?.length) {
                                        x.push(value);
                                        let y = currentCol;
                                        y.push(
                                          b2bColumns[currentCol1]?.data
                                        );

                                        setSearchVal1(x);
                                        setCurrentCol(y);


                                      } else {
                                        hot?.getSelected()[0][1] == 5 &&
                                          setFromTotalTaxableAmount(value);
                                        hot?.getSelected()[0][1] == 5 &&
                                          setToTotalTaxableAmount(value);
                                        hot?.getSelected()[0][1] == 6 &&
                                          setFromTotalTaxAmount(value);
                                        hot?.getSelected()[0][1] == 6 &&
                                          setToTotalTaxAmount(value);
                                        hot?.getSelected()[0][1] == 7 &&
                                          setFromInvoiceValue(value);
                                        hot?.getSelected()[0][1] == 7 &&
                                          setToInvoiceValue(value);
                                        const Index =
                                          currentCol?.findIndex(
                                            (item) =>
                                              b2bColumns[currentCol1]
                                                ?.data == item
                                          );
                                        // if (item == columnName[currentCol1]?.data)
                                        if (Index != -1) {
                                          const xyz = searchVal1;
                                          xyz[Index] = value;
                                          setSearchVal1(xyz);
                                        } else {
                                          x.push(value);
                                          let y = currentCol;
                                          y.push(
                                            b2bColumns[currentCol1]
                                              ?.data
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
                                        "",
                                        1
                                      );
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
                              reverseChargeDropDownList,

                            } = filterDropDownList;

                            const listsToCheck = [
                              reverseChargeDropDownList,

                            ];

                            for (var j = 0; j < checkboxes.length; j++) {
                              for (var k = 0; k < listsToCheck.length; k++) {
                                if (listsToCheck[k]) {

                                  for (var i = 0; i < listsToCheck[k].length; i++) {
                                    if (listsToCheck[k][i] == checkboxes[j].value) {
                                      $(checkboxes[j]).prop("checked", true);
                                      break;
                                    }
                                  }
                                }
                              }
                            }
                            // }
                          }}

                          afterFilter={function (data) {
                            const hot = hotRef?.current?.hotInstance;
                            const selectedValuecol = hot?.getSelected()[0][1];
                            const shouldExcludeCheckBox = [4, 5, 6, 7, 8].includes(selectedValuecol);

                            if (hot?.getSelected()[0][1] != 4 && hot?.getSelected()[0][1] != 5 && hot?.getSelected()[0][1] != 6 && hot?.getSelected()[0][1] != 7 && hot?.getSelected()[0][1] != 8) {
                              var searchInput = document.querySelector(".htUIMultipleSelectSearch.htUIInput");
                              var value = searchInput?.children[0].value;

                            } else if (
                              hot?.getSelected()[0][1] == 8

                            ) {
                              // debugger
                              var checkboxes =
                                document.getElementsByClassName(
                                  "checkBoxClass"
                                );
                              arrChk = [];

                              var columnName =
                                b2bColumns[currentCol1]?.data;

                              let filterObject = [];

                              for (
                                let i = 0;
                                i < checkboxes.length;
                                i++
                              ) {
                                if (checkboxes[i].checked) {
                                  filterObject?.push(checkboxes[i].value);
                                } else {
                                  let uniqueArray = filterObject.filter(
                                    (obj, index, self) =>
                                      index ===
                                      self.findIndex(
                                        (t) =>
                                          JSON.stringify(t) ===
                                          JSON.stringify(obj)
                                      )
                                  );
                                  filterObject = uniqueArray;
                                  const index = filterObject.findIndex(
                                    (obj) =>
                                      obj[columnName] ===
                                      checkboxes[i].value
                                  );
                                  if (index !== -1) {
                                    delete filterObject[index][
                                      columnName
                                    ];
                                  }
                                }
                              }
                              var value = filterObject?.join("@#@#");
                              const updatedFilterDropDownList = filterObject.reduce((acc, item) => {
                                const { ReverseCharge } = item;

                                const updateList = (list, value) => {
                                  return list.includes(value) ? list : [...list, value];
                                };

                                if (ReverseCharge !== undefined) {
                                  acc.reverseChargeDropDownList = updateList(acc.reverseChargeDropDownList, ReverseCharge);
                                }

                                return acc;
                              }, { reverseChargeDropDownList: [] });


                              const newMenu = {
                                reverseChargeDropDownList: filterObject,
                              }
                              setFilterDropDownList(newMenu);

                            } else if (
                              hot?.getSelected()[0][1] == 5 ||
                              hot?.getSelected()[0][1] == 6 ||
                              hot?.getSelected()[0][1] == 7
                            ) {
                              var searchInput1 =
                                document.getElementById("amount1");
                              var searchInput2 =
                                document.getElementById("amount2");
                              const invFromDate = searchInput1?.value.replaceAll(",", "");
                              const invToDate = searchInput2?.value.replaceAll(",", "");
                              var columnName =
                                b2bColumns[currentCol1]?.data;
                              // var value1 =
                              //   (searchInput1?.value ||
                              //     searchInput2?.value) &&
                              //   `${
                              //     invFromDate ? invFromDate : invToDate
                              //   }to${
                              //     invToDate ? invToDate : invFromDate
                              //   }`;
                              var value1 = `${invFromDate}to${invToDate}`;

                              hot?.getSelected()[0][1] == 5 &&
                                setFromTotalTaxableAmount(searchInput1?.value);
                              hot?.getSelected()[0][1] == 5 &&
                                setToTotalTaxableAmount(searchInput2?.value);
                              hot?.getSelected()[0][1] == 6 &&
                                setFromTotalTaxAmount(searchInput1?.value);
                              hot?.getSelected()[0][1] == 6 &&
                                setToTotalTaxAmount(searchInput2?.value);
                              hot?.getSelected()[0][1] == 7 &&
                                setFromInvoiceValue(searchInput1?.value);
                              hot?.getSelected()[0][1] == 7 &&
                                setToInvoiceValue(searchInput2?.value);

                              console.log(value1, "sfdf");
                              var value = value1;
                            } else {
                              if (hot?.getSelected()[0][1] == 4) {
                                var searchInput1 =
                                  document.getElementById("custom1");
                                var searchInput2 =
                                  document.getElementById("custom2");
                                const invFromDate = searchInput1?.value;
                                const invToDate = searchInput2?.value;
                                var columnName =
                                  b2bColumns[currentCol1]?.data;
                                var value2 = (searchInput1?.value || searchInput2?.value) && `${invFromDate ? invFromDate : invToDate}to${invToDate ? invToDate : invFromDate}`;
                                hot?.getSelected()[0][1] == 4 &&
                                  setSearchDate(searchInput1?.value);
                                hot?.getSelected()[0][1] == 4 &&
                                  setToDate(searchInput2?.value ? searchInput2?.value : searchInput1?.value);


                                var value = value2;
                              } else {
                                if (hot?.getSelected()[0][1] == 4) {
                                  var searchInput1 =
                                    document.getElementById("custom1");
                                  var value = searchInput1.value;
                                  setSearchDate(value);

                                }
                              }
                            }


                            const x = searchVal1;
                            if (!searchVal1?.length) {
                              x.push(value);
                              let y = currentCol;
                              y.push(b2bColumns[currentCol1]?.data);

                              setSearchVal1(x);
                              setCurrentCol(y);
                            } else {
                              const Index = currentCol?.findIndex(
                                (item) =>
                                  b2bColumns[currentCol1]?.data == item
                              );

                              if (Index != -1) {
                                const xyz = searchVal1;
                                xyz[Index] = value;
                                setSearchVal1(xyz);
                              } else {
                                x.push(value);
                                let y = currentCol;
                                y.push(b2bColumns[currentCol1]?.data);
                                // console.log("jsx=",x,y)
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
                          }}
                        />
                      </div>
                    </Col>
                  </Row>

                  <Row className="justify-content-end mx-0">
                    <Col
                      className="d-flex align-items-center justify-content-end"
                      md="12"
                      sm="12"
                    >
                      {purchaseData?.length ? (<span>
                        <b>{`${paginationTitle}`}</b>  {" "}  &nbsp; &nbsp;
                      </span>) : <></>}
                      {purchaseData?.length ? (<Select
                        id="pageId"
                        isClearable={false}
                        theme={selectThemeColors}
                        closeMenuOnSelect={true}
                        options={paginationList}
                        className="basic-multi-select me-1"
                        classNamePrefix="select"
                        components={animatedComponents}
                        onChange={onPageChangeFunc}
                        value={pageNoSelect}
                        menuPlacement="auto"
                      />) : (<></>)}

                      {purchaseData?.length ? (<span  >
                        <b>  {` ${pageNoTitle}`}</b>
                      </span>) : <></>}

                      &nbsp; &nbsp;
                      <ReactPaginate
                        breakLabel="..."
                        nextLabel=""
                        onPageChange={handlePageClick}
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
                </CardBody>
              </Card>
            </TabPane>

            {/* ITC Revised B2BA */}
            <TabPane tabId="2" key="2">
              <TabPane tabId="1" key="1">
                <TableCardDetails
                  totalInvoice={totalInvoice} totalInvoiceValue={totalInvoiceValue} totalTaxableValue={totalTaxableValue} totalIGST={totalIGST} totalSGST={totalSGST} totalCGST={totalCGST} totalCess={totalCess}
                  id="crdr_invtype" placeholder="Invoice Type" theme={selectThemeColors} components={animatedComponents} options={crdrInvoiceTypeList} className="basic-multi-select" classNamePrefix="select" onChange={crdrFilterInvoiceType} isDisabled={true} value={{ label: "B2BA", value: "b2ba" }}
                  idReturnPeriod="from1" placholderReturnPeriod="From" isClearable={false} closeMenuOnSelect={true} optionsReturnPeriod={panDataFrom} onChangeReturnPeriod={selectFromYear} valueReturnPeriod={finFromYear}
                />
                <CardBody className="CardBody p-0">
                  <Row>
                    <Col sm="12">
                      <div>

                        <HotTable
                          autoWrapRow={true}
                          style={purchaseData.length > 0 ? "" : { textAlign: "center", overflowX: "hidden" }}
                          data={purchaseData.length > 0 ? purchaseData : [{ recipientGSTIN: "No Data Found!" }]}
                          // data={data.slice(0, 11)}
                          rowHeights={RowSize}
                          viewportColumnRenderingOffset={100}
                          columnHeaderHeight={columnHeaderSize}
                          autoColumnSize={{
                            samplingRatio: 23  // Adjust the samplingRatio as needed
                          }}
                          // autoColumnSize={true}
                          manualColumnResize={true}
                          afterGetColHeader={theaderITC}
                          afterOnCellMouseDown={localAfterOnCellMouseDown2}
                          colHeaders={colHeaders}
                          readOnly={true}
                          stretchH="all"
                          preventOverflow="horizontal"
                          columns={purchaseData.length > 0 ? ammentmentInvalidColumns : ammentmentInvalidColumnsEmpty}
                          contextMenu={false}
                          bindRowsWithHeaders={true}
                          licenseKey="non-commercial-and-evaluation"
                          height="auto"
                          ref={hotRef1}
                          hiddenColumns={purchaseData.length > 0 ? purchaseData : [{ columns: 0 }]}
                          mergeCells={purchaseData.length > 0 ? false : [{ row: 0, col: 1, rowspan: 1, colspan: 8 }]}
                          cells={function (row, col) {
                            var cp = {};

                            cp.className = "child";
                            if (col == 5 || col == 6 || col == 7) {
                              cp.className = "text-end";
                            }
                            if (purchaseData.length > 0) {
                              if (col == 1) {
                                cp.className = "text-danger myRow";
                              }

                            } else {
                              if (col == 1) {
                                cp.className = "myRow";
                              }
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
                                  const isValidColumn = [4, 5, 6, 7, 8].includes(selectedValue);
                                  return isValidColumn;

                                },
                              },
                              table2checkbox: { // For CheckBox custom option

                                name: `<div  style="margin-left:6px">${checkBoxTitle}<label class="float-end text-danger "><a><u id="selectAll">Select All</u></a></label></div> <div  class="checkboxmenu custom-scrollbar"> <div >  <table id="searchTable" >
                                  ${dropDonwName1 &&
                                  dropDonwName1?.map((index) => (
                                    `<tr><td><input class="checkBoxClass" type="checkbox" value="${index?.value}" /> <span class="fw-normal">${index?.label?.length > 20 ? index?.label?.substring(0, 20) + "..." : index?.label}</span> </td></tr>`
                                  )).join('')
                                  }
          
                                    </table></div>
                                    </div>`, // Name can contain HTML 
                                hidden() {
                                  const selectedCol = this.getSelectedRangeLast().to.col;
                                  const isHiddenCol = ![8].includes(selectedCol);

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

                              option10: {
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
                                  return (
                                    this.getSelectedRangeLast().to.col !=
                                    4
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
                                    clickEvent.stopImmediatePropagation();
                                  }

                                  clickEvent.stopImmediatePropagation();
                                },
                              },
                              option6: createOptionMinMax(fromtotalTaxableAmount, tototalTaxableAmount, 5),
                              option7: createOptionMinMax(fromtotalTaxAmount, tototalTaxAmount, 6),
                              option8: createOptionMinMax(frominvoiceValue, toinvoiceValue, 7),

                              clear: {
                                name: `<button id='btnClear' name='Clear' tabIndex="-1"  value='Clear'>Clear</button>`,
                                //disabled: true,
                                callback: function (key, selection, clickEvent) {

                                  var src = clickEvent.target;
                                  console.log("name", src.tagName);
                                  if (src.tagName.toLowerCase() === "button") {
                                    if (clickEvent.target.id == "btnClear") {
                                      const hot = hotRef1?.current?.hotInstance;
                                      var value = "";
                                      const selectedValue = this.getSelected()[0][1];
                                      let filterObject = !gridCustomFilter ? [] : gridCustomFilter

                                      const isValidCheckBoxColumn = [8].includes(selectedValue);

                                      if (isValidCheckBoxColumn) {

                                        var checkboxes = document.getElementsByClassName('checkBoxClass');

                                        arrChk = []
                                        setFilterDropDownList([]);
                                        var columnName = ammentmentInvalidColumns[currentCol1]?.data;

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

                                      }
                                      if (
                                        hot?.getSelected()[0][1] == 4
                                      ) {
                                        setSearchDate(value);
                                        setToDate(value);
                                      }

                                      const x = searchVal1;
                                      if (!searchVal1?.length) {
                                        x.push(value);
                                        let y = currentCol;
                                        y.push(
                                          ammentmentInvalidColumns[currentCol1]?.data
                                        );

                                        setSearchVal1(x);
                                        setCurrentCol(y);


                                      } else {
                                        hot?.getSelected()[0][1] == 5 &&
                                          setFromTotalTaxableAmount(value);
                                        hot?.getSelected()[0][1] == 5 &&
                                          setToTotalTaxableAmount(value);
                                        hot?.getSelected()[0][1] == 6 &&
                                          setFromTotalTaxAmount(value);
                                        hot?.getSelected()[0][1] == 6 &&
                                          setToTotalTaxAmount(value);
                                        hot?.getSelected()[0][1] == 7 &&
                                          setFromInvoiceValue(value);
                                        hot?.getSelected()[0][1] == 7 &&
                                          setToInvoiceValue(value);
                                        const Index =
                                          currentCol?.findIndex(
                                            (item) =>
                                              ammentmentInvalidColumns[currentCol1]
                                                ?.data == item
                                          );
                                        // if (item == columnName[currentCol1]?.data)
                                        if (Index != -1) {
                                          const xyz = searchVal1;
                                          xyz[Index] = value;
                                          setSearchVal1(xyz);
                                        } else {
                                          x.push(value);
                                          let y = currentCol;
                                          y.push(
                                            ammentmentInvalidColumns[currentCol1]
                                              ?.data
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
                                        "",
                                        1
                                      );
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
                              reverseChargeDropDownList,

                            } = filterDropDownList;

                            const listsToCheck = [
                              reverseChargeDropDownList,

                            ];

                            for (var j = 0; j < checkboxes.length; j++) {
                              for (var k = 0; k < listsToCheck.length; k++) {
                                if (listsToCheck[k]) {

                                  for (var i = 0; i < listsToCheck[k].length; i++) {
                                    if (listsToCheck[k][i] == checkboxes[j].value) {
                                      $(checkboxes[j]).prop("checked", true);
                                      break;
                                    }
                                  }
                                }
                              }
                            }
                            // }
                          }}
                          afterFilter={function (data) {
                            const hot = hotRef1?.current?.hotInstance;
                            const selectedValuecol = hot?.getSelected()[0][1];
                            const shouldExcludeCheckBox = [4, 5, 6, 7, 8].includes(selectedValuecol);

                            if (hot?.getSelected()[0][1] != 4 && hot?.getSelected()[0][1] != 5 && hot?.getSelected()[0][1] != 6 && hot?.getSelected()[0][1] != 7 && hot?.getSelected()[0][1] != 8) {
                              var searchInput = document.querySelector(".htUIMultipleSelectSearch.htUIInput");
                              var value = searchInput?.children[0].value;

                            } else if (
                              hot?.getSelected()[0][1] == 8

                            ) {
                              // debugger
                              var checkboxes =
                                document.getElementsByClassName(
                                  "checkBoxClass"
                                );
                              arrChk = [];

                              var columnName =
                                ammentmentInvalidColumns[currentCol1]?.data;

                              let filterObject = [];

                              for (
                                let i = 0;
                                i < checkboxes.length;
                                i++
                              ) {
                                if (checkboxes[i].checked) {
                                  filterObject?.push(checkboxes[i].value);
                                } else {
                                  let uniqueArray = filterObject.filter(
                                    (obj, index, self) =>
                                      index ===
                                      self.findIndex(
                                        (t) =>
                                          JSON.stringify(t) ===
                                          JSON.stringify(obj)
                                      )
                                  );
                                  filterObject = uniqueArray;
                                  const index = filterObject.findIndex(
                                    (obj) =>
                                      obj[columnName] ===
                                      checkboxes[i].value
                                  );
                                  if (index !== -1) {
                                    delete filterObject[index][
                                      columnName
                                    ];
                                  }
                                }
                              }
                              var value = filterObject?.join("@#@#");
                              const newMenu = {
                                reverseChargeDropDownList: filterObject,
                              }
                              setFilterDropDownList(newMenu);
                            } else if (
                              hot?.getSelected()[0][1] == 5 ||
                              hot?.getSelected()[0][1] == 6 ||
                              hot?.getSelected()[0][1] == 7
                            ) {
                              var searchInput1 =
                                document.getElementById("amount1");
                              var searchInput2 =
                                document.getElementById("amount2");
                              const invFromDate = searchInput1?.value.replaceAll(",", "");
                              const invToDate = searchInput2?.value.replaceAll(",", "");
                              var columnName =
                                ammentmentInvalidColumns[currentCol1]?.data;
                              // var value1 =
                              //   (searchInput1?.value ||
                              //     searchInput2?.value) &&
                              //   `${
                              //     invFromDate ? invFromDate : invToDate
                              //   }to${
                              //     invToDate ? invToDate : invFromDate
                              //   }`;
                              var value1 = `${invFromDate}to${invToDate}`;

                              hot?.getSelected()[0][1] == 5 &&
                                setFromTotalTaxableAmount(searchInput1?.value);
                              hot?.getSelected()[0][1] == 5 &&
                                setToTotalTaxableAmount(searchInput2?.value);
                              hot?.getSelected()[0][1] == 6 &&
                                setFromTotalTaxAmount(searchInput1?.value);
                              hot?.getSelected()[0][1] == 6 &&
                                setToTotalTaxAmount(searchInput2?.value);
                              hot?.getSelected()[0][1] == 7 &&
                                setFromInvoiceValue(searchInput1?.value);
                              hot?.getSelected()[0][1] == 7 &&
                                setToInvoiceValue(searchInput2?.value);

                              console.log(value1, "sfdf");
                              var value = value1;
                            } else {
                              if (hot?.getSelected()[0][1] == 4) {
                                var searchInput1 =
                                  document.getElementById("custom1");
                                var searchInput2 =
                                  document.getElementById("custom2");
                                const invFromDate = searchInput1?.value;
                                const invToDate = searchInput2?.value;
                                var columnName =
                                  ammentmentInvalidColumns[currentCol1]?.data;
                                var value2 = (searchInput1?.value || searchInput2?.value) && `${invFromDate ? invFromDate : invToDate}to${invToDate ? invToDate : invFromDate}`;
                                hot?.getSelected()[0][1] == 4 &&
                                  setSearchDate(searchInput1?.value);
                                hot?.getSelected()[0][1] == 4 &&
                                  setToDate(searchInput2?.value ? searchInput2?.value : searchInput1?.value);



                                var value = value2;
                              } else {
                                if (hot?.getSelected()[0][1] == 4) {
                                  var searchInput1 =
                                    document.getElementById("custom1");
                                  var value = searchInput1.value;
                                  setSearchDate(value);

                                }
                              }
                            }


                            const x = searchVal1;
                            if (!searchVal1?.length) {
                              x.push(value);
                              let y = currentCol;
                              y.push(ammentmentInvalidColumns[currentCol1]?.data);

                              setSearchVal1(x);
                              setCurrentCol(y);
                            } else {
                              const Index = currentCol?.findIndex(
                                (item) =>
                                  ammentmentInvalidColumns[currentCol1]?.data == item
                              );

                              if (Index != -1) {
                                const xyz = searchVal1;
                                xyz[Index] = value;
                                setSearchVal1(xyz);
                              } else {
                                x.push(value);
                                let y = currentCol;
                                y.push(ammentmentInvalidColumns[currentCol1]?.data);
                                // console.log("jsx=",x,y)
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
                          }}
                        />
                      </div>
                    </Col>
                  </Row>

                  <Row className="justify-content-end mx-0">
                    <Col
                      className="d-flex align-items-center justify-content-end"
                      md="12"
                      sm="12"
                    >
                      {purchaseData?.length ? (<span>
                        <b>{`${paginationTitle}`}</b>  {" "}  &nbsp; &nbsp;
                      </span>) : <></>}
                      {purchaseData?.length ? (<Select
                        id="pageId"
                        isClearable={false}
                        theme={selectThemeColors}
                        closeMenuOnSelect={true}
                        options={paginationList}
                        className="basic-multi-select me-1"
                        classNamePrefix="select"
                        components={animatedComponents}
                        onChange={onPageChangeFunc}
                        value={pageNoSelect}
                        menuPlacement="auto"
                      />) : (<></>)}

                      {purchaseData?.length ? (<span  >
                        <b>  {` ${pageNoTitle}`}</b>
                      </span>) : <></>}

                      &nbsp; &nbsp;
                      <ReactPaginate
                        breakLabel="..."
                        nextLabel=""
                        onPageChange={handlePageClick}
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
                </CardBody>
              </TabPane>
            </TabPane>

            {/* CDN*/}
            <TabPane tabId="3" key="3">
              <TableCardDetails
                totalInvoice={totalInvoice} totalInvoiceValue={totalInvoiceValue} totalTaxableValue={totalTaxableValue} totalIGST={totalIGST} totalSGST={totalSGST} totalCGST={totalCGST} totalCess={totalCess}
                id="purchaseId_invtype" placeholder="Invoice Type" theme={selectThemeColors} components={animatedComponents} options={b2csInvoiceTypeList} className="basic-multi-select" classNamePrefix="select" onChange={filterInvoiceTypeB2cs} isDisabled={true} value={{ label: "CDNR", value: "cdnr" }}
                idReturnPeriod="from" placholderReturnPeriod="From" isClearable={false} closeMenuOnSelect={true} optionsReturnPeriod={panDataFrom} onChangeReturnPeriod={selectFromYear} valueReturnPeriod={finFromYear}
              />
              <Card>
                <CardBody className="CardBody p-0">
                  <Row>
                    <Col sm="12">
                      <div>

                        <HotTable
                          autoWrapRow={true}
                          style={purchaseData.length > 0 ? "" : { textAlign: "center", overflowX: "hidden" }}
                          data={purchaseData.length > 0 ? purchaseData : [{ recipientGSTIN: "No Data Found!" }]}
                          rowHeights={RowSize}
                          viewportColumnRenderingOffset={100}
                          columnHeaderHeight={columnHeaderSize}
                          autoColumnSize={true}
                          stretchH="all"
                          colHeaders={colHeaders}
                          afterGetColHeader={theaderCdn}
                          preventOverflow="horizontal"

                          columns={purchaseData.length > 0 ? crDrInvalidColumns : crDrInvalidColumnsEmpty}
                          contextMenu={false}
                          bindRowsWithHeaders={true}
                          licenseKey="non-commercial-and-evaluation"
                          height="auto"
                          ref={hotRef2}
                          afterOnCellMouseDown={localAfterOnCellMouseDown3}
                          mergeCells={purchaseData.length > 0 ? false : [{ row: 0, col: 1, rowspan: 1, colspan: 9 }]}
                          hiddenColumns={purchaseData.length > 0 ? purchaseData : [{ columns: 0 }]}
                          // hiddenColumns={{
                          //   columns: [10],
                          // }}
                          cells={function (row, col) {
                            var cp = {};
                            const hot = hotRef2?.current?.hotInstance;
                            cp.className = "child";
                            if (col == 5 || col == 6 || col == 7) {
                              cp.className = "text-end";
                            }
                            if (purchaseData.length > 0) {
                              if (col == 1) {
                                cp.className = "text-danger myRow";
                              }

                            } else {
                              if (col == 1) {
                                cp.className = "myRow";
                              }
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
                                  const isValidColumn = [4, 5, 6, 7, 8, 9].includes(selectedValue);
                                  return isValidColumn;

                                },
                              },
                              table3checkbox: { // For CheckBox custom option

                                name: `<div  style="margin-left:6px">${checkBoxTitle}<label class="float-end text-danger "><a><u id="selectAll">Select All</u></a></label></div> <div  class="checkboxmenu custom-scrollbar"> <div >  <table id="searchTable" >
                                  ${dropDonwName2 &&
                                  dropDonwName2?.map((index) => (
                                    `<tr><td><input class="checkBoxClass" type="checkbox" value="${index?.value}" /> <span class="fw-normal">${index?.label?.length > 20 ? index?.label?.substring(0, 20) + "..." : index?.label}</span> </td></tr>`
                                  )).join('')
                                  }
          
                                    </table></div>
                                    </div>`, // Name can contain HTML 
                                hidden() {
                                  const selectedCol = this.getSelectedRangeLast().to.col;
                                  const isHiddenCol = ![8, 9].includes(selectedCol);

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

                              option10: {
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
                                  return (
                                    this.getSelectedRangeLast().to.col !=
                                    4
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
                                    clickEvent.stopImmediatePropagation();
                                  }

                                  clickEvent.stopImmediatePropagation();
                                },
                              },
                              option6: createOptionMinMax(fromtotalTaxableAmount, tototalTaxableAmount, 5),
                              option7: createOptionMinMax(fromtotalTaxAmount, tototalTaxAmount, 6),
                              option8: createOptionMinMax(frominvoiceValue, toinvoiceValue, 7),

                              clear: {
                                name: `<button id='btnClear' name='Clear' tabIndex="-1"  value='Clear'>Clear</button>`,
                                //disabled: true,
                                callback: function (key, selection, clickEvent) {

                                  var src = clickEvent.target;
                                  console.log("name", src.tagName);
                                  if (src.tagName.toLowerCase() === "button") {
                                    if (clickEvent.target.id == "btnClear") {
                                      const hot = hotRef2?.current?.hotInstance;
                                      var value = "";
                                      const selectedValue = this.getSelected()[0][1];
                                      let filterObject = !gridCustomFilter ? [] : gridCustomFilter

                                      const isValidCheckBoxColumn = [8, 9].includes(selectedValue);

                                      if (isValidCheckBoxColumn) {

                                        var checkboxes = document.getElementsByClassName('checkBoxClass');

                                        arrChk = []
                                        setFilterDropDownList([]);
                                        var columnName = crDrInvalidColumns[currentCol1]?.data;

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

                                      }
                                      if (
                                        hot?.getSelected()[0][1] == 4
                                      ) {
                                        setSearchDate(value);
                                        setToDate(value);
                                      }

                                      const x = searchVal1;
                                      if (!searchVal1?.length) {
                                        x.push(value);
                                        let y = currentCol;
                                        y.push(
                                          crDrInvalidColumns[currentCol1]?.data
                                        );

                                        setSearchVal1(x);
                                        setCurrentCol(y);


                                      } else {
                                        hot?.getSelected()[0][1] == 5 &&
                                          setFromTotalTaxableAmount(value);
                                        hot?.getSelected()[0][1] == 5 &&
                                          setToTotalTaxableAmount(value);
                                        hot?.getSelected()[0][1] == 6 &&
                                          setFromTotalTaxAmount(value);
                                        hot?.getSelected()[0][1] == 6 &&
                                          setToTotalTaxAmount(value);
                                        hot?.getSelected()[0][1] == 7 &&
                                          setFromInvoiceValue(value);
                                        hot?.getSelected()[0][1] == 7 &&
                                          setToInvoiceValue(value);
                                        const Index =
                                          currentCol?.findIndex(
                                            (item) =>
                                              crDrInvalidColumns[currentCol1]
                                                ?.data == item
                                          );
                                        // if (item == columnName[currentCol1]?.data)
                                        if (Index != -1) {
                                          const xyz = searchVal1;
                                          xyz[Index] = value;
                                          setSearchVal1(xyz);
                                        } else {
                                          x.push(value);
                                          let y = currentCol;
                                          y.push(
                                            crDrInvalidColumns[currentCol1]
                                              ?.data
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
                                        "",
                                        1
                                      );
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
                              reverseChargeDropDownList,
                              noteTypeDropDownList

                            } = filterDropDownList;

                            const listsToCheck = [
                              reverseChargeDropDownList,
                              noteTypeDropDownList

                            ];

                            for (var j = 0; j < checkboxes.length; j++) {
                              for (var k = 0; k < listsToCheck.length; k++) {
                                if (listsToCheck[k]) {

                                  for (var i = 0; i < listsToCheck[k].length; i++) {
                                    if (listsToCheck[k][i] == checkboxes[j].value) {
                                      $(checkboxes[j]).prop("checked", true);
                                      break;
                                    }
                                  }
                                }
                              }
                            }
                            // }
                          }}
                          afterFilter={function (data) {
                            const hot = hotRef2?.current?.hotInstance;
                            const selectedValuecol = hot?.getSelected()[0][1];
                            const shouldExcludeCheckBox = [4, 5, 6, 7, 8, 9].includes(selectedValuecol);

                            if (hot?.getSelected()[0][1] != 4 && hot?.getSelected()[0][1] != 5 && hot?.getSelected()[0][1] != 6 && hot?.getSelected()[0][1] != 7 && hot?.getSelected()[0][1] != 8 && hot?.getSelected()[0][1] != 9) {
                              var searchInput = document.querySelector(".htUIMultipleSelectSearch.htUIInput");
                              var value = searchInput?.children[0].value;

                            } else if (
                              hot?.getSelected()[0][1] == 8 ||
                              hot?.getSelected()[0][1] == 9
                            ) {
                              // debugger
                              var checkboxes =
                                document.getElementsByClassName(
                                  "checkBoxClass"
                                );
                              arrChk = [];

                              var columnName =
                                crDrInvalidColumns[currentCol1]?.data;

                              let filterObject = [];

                              for (
                                let i = 0;
                                i < checkboxes.length;
                                i++
                              ) {
                                if (checkboxes[i].checked) {
                                  filterObject?.push(checkboxes[i].value);
                                } else {
                                  let uniqueArray = filterObject.filter(
                                    (obj, index, self) =>
                                      index ===
                                      self.findIndex(
                                        (t) =>
                                          JSON.stringify(t) ===
                                          JSON.stringify(obj)
                                      )
                                  );
                                  filterObject = uniqueArray;
                                  const index = filterObject.findIndex(
                                    (obj) =>
                                      obj[columnName] ===
                                      checkboxes[i].value
                                  );
                                  if (index !== -1) {
                                    delete filterObject[index][
                                      columnName
                                    ];
                                  }
                                }
                              }
                              var value = filterObject?.join("@#@#");
                              const newMenu = {
                                reverseChargeDropDownList: filterObject,
                                noteTypeDropDownList: filterObject,
                              }
                              setFilterDropDownList(newMenu);
                            } else if (
                              hot?.getSelected()[0][1] == 5 ||
                              hot?.getSelected()[0][1] == 6 ||
                              hot?.getSelected()[0][1] == 7
                            ) {
                              var searchInput1 =
                                document.getElementById("amount1");
                              var searchInput2 =
                                document.getElementById("amount2");
                              const invFromDate = searchInput1?.value.replaceAll(",", "");
                              const invToDate = searchInput2?.value.replaceAll(",", "");
                              var columnName =
                                crDrInvalidColumns[currentCol1]?.data;
                              // var value1 =
                              //   (searchInput1?.value ||
                              //     searchInput2?.value) &&
                              //   `${
                              //     invFromDate ? invFromDate : invToDate
                              //   }to${
                              //     invToDate ? invToDate : invFromDate
                              //   }`;
                              var value1 = `${invFromDate}to${invToDate}`;

                              hot?.getSelected()[0][1] == 5 &&
                                setFromTotalTaxableAmount(searchInput1?.value);
                              hot?.getSelected()[0][1] == 5 &&
                                setToTotalTaxableAmount(searchInput2?.value);
                              hot?.getSelected()[0][1] == 6 &&
                                setFromTotalTaxAmount(searchInput1?.value);
                              hot?.getSelected()[0][1] == 6 &&
                                setToTotalTaxAmount(searchInput2?.value);
                              hot?.getSelected()[0][1] == 7 &&
                                setFromInvoiceValue(searchInput1?.value);
                              hot?.getSelected()[0][1] == 7 &&
                                setToInvoiceValue(searchInput2?.value);

                              console.log(value1, "sfdf");
                              var value = value1;
                            } else {
                              if (hot?.getSelected()[0][1] == 4) {
                                var searchInput1 =
                                  document.getElementById("custom1");
                                var searchInput2 =
                                  document.getElementById("custom2");
                                const invFromDate = searchInput1?.value;
                                const invToDate = searchInput2?.value;
                                var columnName =
                                  crDrInvalidColumns[currentCol1]?.data;
                                var value2 = (searchInput1?.value || searchInput2?.value) && `${invFromDate ? invFromDate : invToDate}to${invToDate ? invToDate : invFromDate}`;
                                hot?.getSelected()[0][1] == 4 &&
                                  setSearchDate(searchInput1?.value);
                                hot?.getSelected()[0][1] == 4 &&
                                  setToDate(searchInput2?.value ? searchInput2?.value : searchInput1?.value);



                                var value = value2;
                              } else {
                                if (hot?.getSelected()[0][1] == 4) {
                                  var searchInput1 =
                                    document.getElementById("custom1");
                                  var value = searchInput1.value;
                                  setSearchDate(value);

                                }
                              }
                            }


                            const x = searchVal1;
                            if (!searchVal1?.length) {
                              x.push(value);
                              let y = currentCol;
                              y.push(crDrInvalidColumns[currentCol1]?.data);

                              setSearchVal1(x);
                              setCurrentCol(y);
                            } else {
                              const Index = currentCol?.findIndex(
                                (item) =>
                                  crDrInvalidColumns[currentCol1]?.data == item
                              );

                              if (Index != -1) {
                                const xyz = searchVal1;
                                xyz[Index] = value;
                                setSearchVal1(xyz);
                              } else {
                                x.push(value);
                                let y = currentCol;
                                y.push(crDrInvalidColumns[currentCol1]?.data);
                                // console.log("jsx=",x,y)
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
                          }}
                        />
                      </div>
                    </Col>
                  </Row>

                  <Row className="justify-content-end mx-0">
                    <Col
                      className="d-flex align-items-center justify-content-end"
                      md="12"
                      sm="12"
                    >
                      {purchaseData?.length ? (<span>
                        <b>{`${paginationTitle}`}</b>  {" "}  &nbsp; &nbsp;
                      </span>) : <></>}
                      {purchaseData?.length ? (<Select
                        id="pageId"
                        isClearable={false}
                        theme={selectThemeColors}
                        closeMenuOnSelect={true}
                        options={paginationList}
                        className="basic-multi-select me-1"
                        classNamePrefix="select"
                        components={animatedComponents}
                        onChange={onPageChangeFunc}
                        value={pageNoSelect}
                        menuPlacement="auto"
                      />) : (<></>)}

                      {purchaseData?.length ? (<span  >
                        <b>  {` ${pageNoTitle}`}</b>
                      </span>) : <></>}

                      &nbsp; &nbsp;
                      <ReactPaginate
                        breakLabel="..."
                        nextLabel=""
                        onPageChange={handlePageClick}
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
                </CardBody>
              </Card>
            </TabPane>

            {/*CDNA */}
            <TabPane tabId="4" key="4">
              <TableCardDetails
                totalInvoice={totalInvoice} totalInvoiceValue={totalInvoiceValue} totalTaxableValue={totalTaxableValue} totalIGST={totalIGST} totalSGST={totalSGST} totalCGST={totalCGST} totalCess={totalCess}
                id="purchaseId_invtype" placeholder="Invoice Type" theme={selectThemeColors} components={animatedComponents} options={atInvoiceTypeList} className="basic-multi-select" classNamePrefix="select" onChange={filterInvoiceTypeAt} isDisabled={true} value={{ label: "CDNRA", value: "cdnra" }}
                idReturnPeriod="from" placholderReturnPeriod="From" isClearable={false} closeMenuOnSelect={true} optionsReturnPeriod={panDataFrom} onChangeReturnPeriod={selectFromYear} valueReturnPeriod={finFromYear}
              />
              <Card>
                <CardBody className="CardBody p-0">
                  <Row>
                    <Col sm="12">
                      <div>

                        <HotTable
                          autoWrapRow={true}
                          style={purchaseData.length > 0 ? "" : { textAlign: "center", overflowX: "hidden" }}
                          data={purchaseData.length > 0 ? purchaseData : [{ recipientGSTIN: "No Data Found!" }]}
                          rowHeights={RowSize}
                          columnHeaderHeight={columnHeaderSize}
                          autoColumnSize={true}
                          viewportColumnRenderingOffset={100}
                          colHeaders={colHeaders}
                          afterGetColHeader={theaderCdna}
                          stretchH="all"
                          preventOverflow="horizontal"
                          columns={purchaseData.length > 0 ? ammendentcrDrInvalidColumns : ammendentcrDrInvalidColumnsEmpty}
                          contextMenu={false}
                          bindRowsWithHeaders={true}
                          licenseKey="non-commercial-and-evaluation"
                          height="auto"
                          ref={hotRef3}
                          afterOnCellMouseDown={localAfterOnCellMouseDown4}
                          mergeCells={purchaseData.length > 0 ? false : [
                            { row: 0, col: 1, rowspan: 1, colspan: 9 }
                          ]}
                          hiddenColumns={purchaseData.length > 0 ? purchaseData : [{ columns: 0 }]}
                          // hiddenColumns={{
                          //   columns: [10],
                          // }}
                          cells={function (row, col) {
                            var cp = {};
                            const hot = hotRef?.current?.hotInstance;
                            cp.className = "child";
                            if (col == 5 || col == 6 || col == 7) {
                              cp.className = "text-end";
                            }
                            if (purchaseData.length > 0) {
                              if (col == 1) {
                                cp.className = "text-danger myRow";
                              }

                            } else {
                              if (col == 1) {
                                cp.className = "myRow";
                              }
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
                                  const isValidColumn = [4, 5, 6, 7, 8, 9].includes(selectedValue);
                                  return isValidColumn;

                                },
                              },
                              table4checkbox: { // For CheckBox custom option

                                name: `<div  style="margin-left:6px">${checkBoxTitle}<label class="float-end text-danger "><a><u id="selectAll">Select All</u></a></label></div> <div  class="checkboxmenu custom-scrollbar"> <div >  <table id="searchTable" >
                                  ${dropDonwName3 &&
                                  dropDonwName3?.map((index) => (
                                    `<tr><td><input class="checkBoxClass" type="checkbox" value="${index?.value}" /> <span class="fw-normal">${index?.label?.length > 20 ? index?.label?.substring(0, 20) + "..." : index?.label}</span> </td></tr>`
                                  )).join('')
                                  }
          
                                    </table></div>
                                    </div>`, // Name can contain HTML 
                                hidden() {
                                  const selectedCol = this.getSelectedRangeLast().to.col;
                                  const isHiddenCol = ![8, 9].includes(selectedCol);

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

                              option10: {
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
                                  return (
                                    this.getSelectedRangeLast().to.col !=
                                    4
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
                                    clickEvent.stopImmediatePropagation();
                                  }

                                  clickEvent.stopImmediatePropagation();
                                },
                              },
                              option6: createOptionMinMax(fromtotalTaxableAmount, tototalTaxableAmount, 5),
                              option7: createOptionMinMax(fromtotalTaxAmount, tototalTaxAmount, 6),
                              option8: createOptionMinMax(frominvoiceValue, toinvoiceValue, 7),

                              clear: {
                                name: `<button id='btnClear' name='Clear' tabIndex="-1"  value='Clear'>Clear</button>`,
                                //disabled: true,
                                callback: function (key, selection, clickEvent) {

                                  var src = clickEvent.target;
                                  console.log("name", src.tagName);
                                  if (src.tagName.toLowerCase() === "button") {
                                    if (clickEvent.target.id == "btnClear") {
                                      const hot = hotRef3?.current?.hotInstance;
                                      var value = "";
                                      const selectedValue = this.getSelected()[0][1];
                                      let filterObject = !gridCustomFilter ? [] : gridCustomFilter

                                      const isValidCheckBoxColumn = [8, 9].includes(selectedValue);

                                      if (isValidCheckBoxColumn) {

                                        var checkboxes = document.getElementsByClassName('checkBoxClass');

                                        arrChk = []
                                        setFilterDropDownList([]);
                                        var columnName = ammendentcrDrInvalidColumns[currentCol1]?.data;

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

                                      }
                                      if (
                                        hot?.getSelected()[0][1] == 4
                                      ) {
                                        setSearchDate(value);
                                        setToDate(value);
                                      }

                                      const x = searchVal1;
                                      if (!searchVal1?.length) {
                                        x.push(value);
                                        let y = currentCol;
                                        y.push(
                                          ammendentcrDrInvalidColumns[currentCol1]?.data
                                        );

                                        setSearchVal1(x);
                                        setCurrentCol(y);


                                      } else {
                                        hot?.getSelected()[0][1] == 5 &&
                                          setFromTotalTaxableAmount(value);
                                        hot?.getSelected()[0][1] == 5 &&
                                          setToTotalTaxableAmount(value);
                                        hot?.getSelected()[0][1] == 6 &&
                                          setFromTotalTaxAmount(value);
                                        hot?.getSelected()[0][1] == 6 &&
                                          setToTotalTaxAmount(value);
                                        hot?.getSelected()[0][1] == 7 &&
                                          setFromInvoiceValue(value);
                                        hot?.getSelected()[0][1] == 7 &&
                                          setToInvoiceValue(value);
                                        const Index =
                                          currentCol?.findIndex(
                                            (item) =>
                                              ammendentcrDrInvalidColumns[currentCol1]
                                                ?.data == item
                                          );
                                        // if (item == columnName[currentCol1]?.data)
                                        if (Index != -1) {
                                          const xyz = searchVal1;
                                          xyz[Index] = value;
                                          setSearchVal1(xyz);
                                        } else {
                                          x.push(value);
                                          let y = currentCol;
                                          y.push(
                                            ammendentcrDrInvalidColumns[currentCol1]
                                              ?.data
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
                                        "",
                                        1
                                      );
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
                              reverseChargeDropDownList,
                              noteTypeDropDownList

                            } = filterDropDownList;

                            const listsToCheck = [
                              reverseChargeDropDownList,
                              noteTypeDropDownList

                            ];

                            for (var j = 0; j < checkboxes.length; j++) {
                              for (var k = 0; k < listsToCheck.length; k++) {
                                if (listsToCheck[k]) {

                                  for (var i = 0; i < listsToCheck[k].length; i++) {
                                    if (listsToCheck[k][i] == checkboxes[j].value) {
                                      $(checkboxes[j]).prop("checked", true);
                                      break;
                                    }
                                  }
                                }
                              }
                            }
                            // }
                          }}
                          afterFilter={function (data) {
                            const hot = hotRef3?.current?.hotInstance;
                            const selectedValuecol = hot?.getSelected()[0][1];
                            const shouldExcludeCheckBox = [4, 5, 6, 7, 8, 9].includes(selectedValuecol);

                            if (hot?.getSelected()[0][1] != 4 && hot?.getSelected()[0][1] != 5 && hot?.getSelected()[0][1] != 6 && hot?.getSelected()[0][1] != 7 && hot?.getSelected()[0][1] != 8 && hot?.getSelected()[0][1] != 9) {
                              var searchInput = document.querySelector(".htUIMultipleSelectSearch.htUIInput");
                              var value = searchInput?.children[0].value;

                            } else if (
                              hot?.getSelected()[0][1] == 8 ||
                              hot?.getSelected()[0][1] == 9
                            ) {
                              // debugger
                              var checkboxes =
                                document.getElementsByClassName(
                                  "checkBoxClass"
                                );
                              arrChk = [];

                              var columnName =
                                ammendentcrDrInvalidColumns[currentCol1]?.data;

                              let filterObject = [];

                              for (
                                let i = 0;
                                i < checkboxes.length;
                                i++
                              ) {
                                if (checkboxes[i].checked) {
                                  filterObject?.push(checkboxes[i].value);
                                } else {
                                  let uniqueArray = filterObject.filter(
                                    (obj, index, self) =>
                                      index ===
                                      self.findIndex(
                                        (t) =>
                                          JSON.stringify(t) ===
                                          JSON.stringify(obj)
                                      )
                                  );
                                  filterObject = uniqueArray;
                                  const index = filterObject.findIndex(
                                    (obj) =>
                                      obj[columnName] ===
                                      checkboxes[i].value
                                  );
                                  if (index !== -1) {
                                    delete filterObject[index][
                                      columnName
                                    ];
                                  }
                                }
                              }
                              var value = filterObject?.join("@#@#");
                              const newMenu = {
                                reverseChargeDropDownList: filterObject,
                                noteTypeDropDownList: filterObject,
                              }
                              setFilterDropDownList(newMenu);
                            } else if (
                              hot?.getSelected()[0][1] == 5 ||
                              hot?.getSelected()[0][1] == 6 ||
                              hot?.getSelected()[0][1] == 7
                            ) {
                              var searchInput1 =
                                document.getElementById("amount1");
                              var searchInput2 =
                                document.getElementById("amount2");
                              const invFromDate = searchInput1?.value.replaceAll(",", "");
                              const invToDate = searchInput2?.value.replaceAll(",", "");
                              var columnName =
                                ammendentcrDrInvalidColumns[currentCol1]?.data;

                              var value1 = `${invFromDate}to${invToDate}`;

                              hot?.getSelected()[0][1] == 5 &&
                                setFromTotalTaxableAmount(searchInput1?.value);
                              hot?.getSelected()[0][1] == 5 &&
                                setToTotalTaxableAmount(searchInput2?.value);
                              hot?.getSelected()[0][1] == 6 &&
                                setFromTotalTaxAmount(searchInput1?.value);
                              hot?.getSelected()[0][1] == 6 &&
                                setToTotalTaxAmount(searchInput2?.value);
                              hot?.getSelected()[0][1] == 7 &&
                                setFromInvoiceValue(searchInput1?.value);
                              hot?.getSelected()[0][1] == 7 &&
                                setToInvoiceValue(searchInput2?.value);

                              console.log(value1, "sfdf");
                              var value = value1;
                            } else {
                              if (hot?.getSelected()[0][1] == 4) {
                                var searchInput1 =
                                  document.getElementById("custom1");
                                var searchInput2 =
                                  document.getElementById("custom2");
                                const invFromDate = searchInput1?.value;
                                const invToDate = searchInput2?.value;
                                var columnName =
                                  ammendentcrDrInvalidColumns[currentCol1]?.data;
                                var value2 = (searchInput1?.value || searchInput2?.value) && `${invFromDate ? invFromDate : invToDate}to${invToDate ? invToDate : invFromDate}`;
                                hot?.getSelected()[0][1] == 4 &&
                                  setSearchDate(searchInput1?.value);
                                hot?.getSelected()[0][1] == 4 &&
                                  setToDate(searchInput2?.value ? searchInput2?.value : searchInput1?.value);




                                var value = value2;
                              } else {
                                if (hot?.getSelected()[0][1] == 4) {
                                  var searchInput1 =
                                    document.getElementById("custom1");
                                  var value = searchInput1.value;
                                  setSearchDate(value);

                                }
                              }
                            }


                            const x = searchVal1;
                            if (!searchVal1?.length) {
                              x.push(value);
                              let y = currentCol;
                              y.push(ammendentcrDrInvalidColumns[currentCol1]?.data);

                              setSearchVal1(x);
                              setCurrentCol(y);
                            } else {
                              const Index = currentCol?.findIndex(
                                (item) =>
                                  ammendentcrDrInvalidColumns[currentCol1]?.data == item
                              );

                              if (Index != -1) {
                                const xyz = searchVal1;
                                xyz[Index] = value;
                                setSearchVal1(xyz);
                              } else {
                                x.push(value);
                                let y = currentCol;
                                y.push(ammendentcrDrInvalidColumns[currentCol1]?.data);
                                // console.log("jsx=",x,y)
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
                          }}
                        />

                      </div>
                    </Col>
                  </Row>

                  <Row className="justify-content-end mx-0">
                    <Col
                      className="d-flex align-items-center justify-content-end"
                      md="12"
                      sm="12"
                    >
                      {purchaseData?.length ? (<span>
                        <b>{`${paginationTitle}`}</b>  {" "}  &nbsp; &nbsp;
                      </span>) : <></>}
                      {purchaseData?.length ? (<Select
                        id="pageId"
                        isClearable={false}
                        theme={selectThemeColors}
                        closeMenuOnSelect={true}
                        options={paginationList}
                        className="basic-multi-select me-1"
                        classNamePrefix="select"
                        components={animatedComponents}
                        onChange={onPageChangeFunc}
                        value={pageNoSelect}
                        menuPlacement="auto"
                      />) : (<></>)}

                      {purchaseData?.length ? (<span  >
                        <b>  {` ${pageNoTitle}`}</b>
                      </span>) : <></>}

                      &nbsp; &nbsp;
                      <ReactPaginate
                        breakLabel="..."
                        nextLabel=""
                        onPageChange={handlePageClick}
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
                </CardBody>
              </Card>
            </TabPane>
          </TabContent>
        </Col>
      </Row>
    </div>
  );
};

export default IFFInvoices;
