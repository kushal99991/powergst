import { Fragment, useLayoutEffect, useState, useRef } from "react";
import { useEffect, useReducer } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  CardText,
  Row,
  Col,
  Label,
  UncontrolledTooltip,
} from "reactstrap";
// ** Third Party Components
import toast from "react-hot-toast";

import Gstr2bService from "../../../services/gstr/gstr2bService";
import errorCodeConfig from "../../../configs/apiErrorCodeConfig";
import {
  API_URL_GSTR,
  PageSize,
  checkBoxTitle,
  checkboxFilterCss,
  paginationList,
  paginationTitle,
} from "../../../configs/config";
import { ChevronLeft } from "react-feather";
import Breadcrumbs from "@components/breadcrumbs";
import ReactPaginate from "react-paginate";
// ** Styles
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/pages/page-form-validation.scss";

import { useSelector, useDispatch } from "react-redux";
import Swal from "sweetalert2";
import moment from "moment/moment";
//** Handsontable
import { HotTable, HotColumn } from "@handsontable/react";
import Handsontable from "handsontable";
import { registerRenderer, textRenderer } from "handsontable/renderers";
import { registerAllModules } from "handsontable/registry";
// ** Utils
import Select, { components } from "react-select"; // eslint-disable-line
import { selectThemeColors } from "@utils";
import makeAnimated from "react-select/animated";
import { tokenExpiresRedirect } from "../../../utility/Utils";
import { useHotkeys } from "react-hotkeys-hook";
import {
  keysMap,
  enableOnFormTags,
  LINK_MESSAGE,
  RowSize,
  columnHeaderSize,
} from "@configs/config";
import { globleVariable } from "../../../configs/globalVariable";
import LocalFunction from "../../../configs/getLocalFunction";
import SessionFunction from "../../../configs/getSessionFunction";
import { downloadURL } from "@helper/downloadUrl";
import { getGSTR2BSummary } from "../../apps/user/store";
import { urlEndpointConfig } from '@configs/urlEndpoint';
import $ from 'jquery'
import { showTotalRowPerPage } from "../../../helper/tableRowsPerPage";
import commonService from "../../../services/commonService";


const animatedComponents = makeAnimated();
const finYearOption = LocalFunction.getLocalValue(
  globleVariable.rangeFiltersGSTR2B,
  true
);
// localStorage.getItem("rangeFiltersGSTR2B");
const YearList = JSON.parse(finYearOption);

//** Handsontable registerAllModules
registerAllModules();
var searchDo = false;
let summaryData1 = false;

function GSTR2BClientSummary() {
  // ** store
  const dispatch = useDispatch();
  const storeITC = useSelector(
    (state) => state?.users?.GSTR2BSummary[0]?.ITCAvailable
  );
  const storeNotITC = useSelector(
    (state) => state?.users?.GSTR2BSummary[0]?.ITCNotAvailable
  );
  let arrFilter = [];

  // ** Hooks
  const [data, setData] = useState([]);
  const [title, setTitle] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(PageSize);
  const [paginationUi, setPaginationUi] = useState();
  const hotRef = useRef(null);
  const hotRef2 = useRef(null);
  const [selectionType, setSelectionType] = useState("single");
  const [searchValue, setSearchValue] = useState("");
  const [block, setBlock] = useState(true);
  const [displayTbl, setDisplayTbl] = useState(true);
  const [finFromYear, setFinFormYear] = useState(null);
  const [finFromYear1, setFinFormYear1] = useState(null);
  const [panData, setPanData] = useState([]);
  const [monthFrom, setMonthFrom] = useState(null);
  const [monthFrom1, setMonthFrom1] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [displayType, setDisplayType] = useState(false);
  const [searchApi, setSearchApi] = useState(false);
  const [searchDo1, setSearchDo1] = useState(false);
  const [serverSidePage, setServerSidePage] = useState(false);
  const [searchBy, setSerchBy] = useState(false);
  const [srcLoadSummary, setSrcLoadSummary] = useState(false);
  const [summaryData11, setSummaryData11] = useState([]);
  const [itcEligibility, setItcEligibility] = useState([]);
  const [reverseCharge, setReverseCharge] = useState([]);
  const [sectionList, setSectionList] = useState([]);
  const [rateList, setRateList] = useState([]);
  const [noteTypeList, setNoteTypeList] = useState([]);
  const [pos, setPos] = useState([]);
  const [invoiceType, setInvoiceType] = useState([]);
  const [count, setCount] = useState(0);
  const [searchDate, setSearchDate] = useState("");
  const [toDate, setToDate] = useState("");

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

  const [itcType, setItcType] = useState(null);
  const [reverseType, setReverseType] = useState(null);
  const [sectionType, setSectionType] = useState(null);
  const [sectionType1, setSectionType1] = useState(null);
  const [currentCol, setCurrentCol] = useState([]);
  const [currentCol1, setCurrentCol1] = useState();
  const [searchVal1, setSearchVal1] = useState([]);
  const [panDataFrom, setPanDataFrom] = useState([]);
  const [pageNoSelect, setPageNoSelect] = useState(paginationList[0]);
  // const [pageTotTitle, setpageTotTitle] = useState("");
  const [gridCustomFilter, setGridCustomFilter] = useState([]);
  const [btnDisable, setBtnDisable] = useState(false);

  // total invoice details
  const [totalInvoice, setTotalInvoice] = useState("0");
  const [totalInvoiceValue, setTotalInvoiceValue] = useState();
  const [totalTaxableValue, setTotalTaxableValue] = useState();
  const [IGST, setIGST] = useState();
  const [Cess, setCess] = useState();
  const [CGST, setCGST] = useState();
  const [SGST, setSGST] = useState();
  // const [filterDropDownList, setFilterDropDownList] = useState([])
  const [filterDropDownList, setFilterDropDownList] = useState({
    rateDropDownList: [],
    rcmDropDownList: [],
    noteTypeDropDownList: [],
    invoiceTypeDropDownList: [],
    posDropDownList: [],
    itcDropDownList: []
  })



  let decrptyUrl = null;
  let clientId = null;
  let rowIndex = null;
  let itcFlag = null;
  let finYear = null;
  let finMonth = null;
  let sectionIds = null;
  let subScriptionDetails = null;
  let gstNumber = null;
  const navigate = useNavigate();

  const { search } = useLocation();
  const [searchParams] = new URLSearchParams(search);
  const location = useLocation();
  const GSTR2BFrdt = sessionStorage.getItem(globleVariable.selectExportFromDt) && SessionFunction.getSessionValue(globleVariable.selectExportFromDt);
  let arrChk = []
  const GGSTIN =
    sessionStorage.getItem(globleVariable.G_GSTIN) &&
    SessionFunction.getSessionValue(globleVariable.G_GSTIN, true);


  //** Column
  const handsontableColumns = [
    // {
    //     data: "srNo",
    //     title: 'Sr.No',
    //     columnSorting: {
    //         indicator: false,
    //         headerAction: false,
    //         compareFunctionFactory(sortOrder, columnMeta) {
    //             return (value, nextValue) => 0; // Don't sort the first visual column.
    //         }
    //     }
    // },
    {
      data: "SupplierGSTIN",
      readOnly: true,
      title: "GSTIN",
      //  width: 150,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "SupplierTradeName",
      readOnly: true,
      title: "Trade/Legal Name Of The Supplier",
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "InvoiceNo",
      readOnly: true,
      title: "Invoice No",
      //  width: 180,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "InvoiceType",
      readOnly: true,
      title: "Invoice Type",
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "NoteType",
      readOnly: true,
      title: "Note Type",
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "InvoiceDate",
      readOnly: true,
      title: "Invoice Date",
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "InvoiceValue",
      readOnly: true,
      title: "Invoice Value (₹)",
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "PlaceOfSupply",
      readOnly: true,
      title: "Place Of Supply",
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "SupplyAttractReverse",
      readOnly: true,
      title: "RCM",
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "Rate",
      readOnly: true,
      title: "Rate (%)",
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },

    {
      data: "TaxableValue",
      readOnly: true,
      title: "Taxable Value (₹)",
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "IGST",
      readOnly: true,
      title: "Integrated Tax (₹)",
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "CGST",
      readOnly: true,
      title: "Central Tax (₹)",
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "SGST",
      readOnly: true,
      title: "State/UT Tax (₹)",
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "Cess",
      readOnly: true,
      title: "Cess (₹)",
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "GSTR1Period",
      readOnly: true,
      title: "GSTR-1/5 Period",
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "GSTR15FilingDate",
      readOnly: true,
      title: "GSTR-1/5 Filing Date",
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "ITCAvaliable",
      readOnly: true,
      title: "ITC Available",
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "Reason",
      readOnly: true,
      title: "Reason",
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "TaxRate",
      readOnly: true,
      title: "Applicable % of Tax Rate",
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "Source",
      readOnly: true,
      title: "Source",
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "IRNNumber",
      readOnly: true,
      title: "IRN No",
      width: "490",
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
      //  width: 510
    },
    {
      data: "IRNDate",
      readOnly: true,
      title: "IRN Date",
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
      // width: 80
    },
  ];

  let dropDonwNameAssign;
  if (handsontableColumns[currentCol1]?.data === "SupplyAttractReverse") {
    dropDonwNameAssign = reverseCharge;
  } else if (handsontableColumns[currentCol1]?.data === "Rate") {
    dropDonwNameAssign = rateList;
  } else if (handsontableColumns[currentCol1]?.data === "NoteType") {
    dropDonwNameAssign = noteTypeList;
  } else if (handsontableColumns[currentCol1]?.data === "PlaceOfSupply") {
    dropDonwNameAssign = pos;
  } else if (handsontableColumns[currentCol1]?.data === "InvoiceType") {
    dropDonwNameAssign = invoiceType;
  } else if (handsontableColumns[currentCol1]?.data === "ITCAvaliable") {
    dropDonwNameAssign = itcEligibility;
  }

  let dropDonwName = dropDonwNameAssign !== undefined && dropDonwNameAssign !== null ? dropDonwNameAssign : reverseCharge;

  if (location.state !== null) {
    finYear = location.state.finyear !== null ? location.state.finyear : "";
    finMonth = location.state.finmonth !== null ? location.state.finmonth : "";
    clientId = location.state.clientId !== null ? location.state.clientId : "";
    rowIndex = location.state.rows !== null ? location.state.rows : "";
    itcFlag = location.state.isItc !== null ? location.state.isItc : "";
    sectionIds =
      location.state.sectionId !== null ? location.state.sectionId : "";
    subScriptionDetails =
      location.state.subscriptionId !== null
        ? location.state.subscriptionId
        : "";
    gstNumber =
      location.state.gstNumber !== null ? location.state.gstNumber : "";
  }

  // ** Call api - redux
  useEffect(() => {
    if (storeITC == undefined && searchApi == true) {
      const userData = {
        clientid: clientId,
        finyear: finYear,
        finmonth: finMonth,
        subscriptionId: subScriptionDetails,
        gstNumber: gstNumber,
      };

      setBlock(true);
      dispatch(getGSTR2BSummary(userData));
    }
  }, [searchApi]);

  const GUCParId = SessionFunction.getSessionValue(
    globleVariable.G_UCParId,
    true
  );
  const G_FY = SessionFunction.getSessionValue(globleVariable.G_FY, true);
  const G_FM = SessionFunction.getSessionValue(globleVariable.G_FM, true);
  const userIds = LocalFunction.getLocalValue(globleVariable.userId, true);
  const token = LocalFunction.getLocalValue(globleVariable.tokenKey, true);

  useEffect(() => {
    return () => setBlock(false);
  }, []);

  //** Shortcut keys
  useHotkeys(keysMap.CLEAR_DATA, () => block == false && ClearFilter(), {
    enableOnFormTags,
  });
  useHotkeys(
    keysMap.EXPORT_DATA,
    () => btnDisable == false && block == false && ExportSectionWiseData(),
    { enableOnFormTags }
  );

  useEffect(() => {
    if (location.state !== null) {
      setTitle(location.state.titles !== null ? location.state.titles : "");
    }
  }, []);

  // ** Set From and To Month
  useEffect(() => {
    setPanData(YearList);
    setPanDataFrom(YearList);
    setDisplayType(true);
  }, []);

  // ** Clear Column and Search value
  useEffect(() => {
    setCurrentCol([]);
    setCurrentCol1();
    setSearchVal1([]);
  }, []);

  //** From date and to date set
  useEffect(() => {

    if (displayType == true) {
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
      if (GSTR2BFrdt == null || GSTR2BFrdt == "" || GSTR2BFrdt == undefined) {
        navigate(urlEndpointConfig.GSTR2B)
      }
    }
  }, [displayType]);

  // ** Get data on mount
  useEffect(() => {
    console.log("re-render", searchApi);
    console.log(itcFlag, "itcFlag", location);
    if (searchApi == true) {
      gstr2bServices(
        0,
        "",
        "asc",
        finFromYear?.value,
        monthFrom?.value,
        "",
        ""
      );

      gstr2bSummaryData("multiple", sectionIds);
    }
  }, [searchApi, storeITC]);

  const stateDataFilter = (Type) => {
    let filterData = [];

    if (Type == "single") {
      if (storeITC !== undefined && itcFlag == 1) {
        if (rowIndex == 1) {
          filterData =
            storeITC?.B2BInvoiceReverse !== null &&
              storeITC?.B2BInvoiceReverse !== "" &&
              storeITC?.B2BInvoiceReverse !== undefined &&
              storeITC?.B2BInvoiceReverse.length !== 0
              ? storeITC?.B2BInvoiceReverse
              : [];
        } else if (rowIndex == 2) {
          filterData =
            storeITC?.B2BDebitNoteReverse !== null &&
              storeITC?.B2BDebitNoteReverse !== "" &&
              storeITC?.B2BDebitNoteReverse !== undefined &&
              storeITC?.B2BDebitNoteReverse.length !== 0
              ? storeITC?.B2BDebitNoteReverse
              : [];
        } else if (rowIndex == 3) {
          filterData =
            storeITC?.B2BAInvoiceReverse !== null &&
              storeITC?.B2BAInvoiceReverse !== "" &&
              storeITC?.B2BAInvoiceReverse !== undefined &&
              storeITC?.B2BAInvoiceReverse.length !== 0
              ? storeITC?.B2BAInvoiceReverse
              : [];
        } else if (rowIndex == 4) {
          filterData =
            storeITC?.B2BADebitNoteReverse !== null &&
              storeITC?.B2BADebitNoteReverse !== "" &&
              storeITC?.B2BADebitNoteReverse !== undefined &&
              storeITC?.B2BADebitNoteReverse.length !== 0
              ? storeITC?.B2BADebitNoteReverse
              : [];
        } else if (rowIndex == 5) {
          filterData =
            storeITC?.ISDInvoice !== null &&
              storeITC?.ISDInvoice !== "" &&
              storeITC?.ISDInvoice !== undefined &&
              storeITC?.ISDInvoice.length !== 0
              ? storeITC?.ISDInvoice
              : [];
        } else if (rowIndex == 6) {
          filterData =
            storeITC?.ISDAInvoice !== null &&
              storeITC?.ISDAInvoice !== "" &&
              storeITC?.ISDAInvoice !== undefined &&
              storeITC?.ISDAInvoice.length !== 0
              ? storeITC?.ISDAInvoice
              : [];
        } else if (rowIndex == 7) {
          filterData =
            storeITC?.B2BAInvoice !== null &&
              storeITC?.B2BAInvoice !== "" &&
              storeITC?.B2BAInvoice !== undefined &&
              storeITC?.B2BAInvoice.length !== 0
              ? storeITC?.B2BAInvoice
              : [];
        } else if (rowIndex == 8) {
          filterData =
            storeITC?.B2BADebitNote !== null &&
              storeITC?.B2BADebitNote !== "" &&
              storeITC?.B2BADebitNote !== undefined &&
              storeITC?.B2BADebitNote.length !== 0
              ? storeITC?.B2BADebitNote
              : [];
        } else if (rowIndex == 9) {
          filterData =
            storeITC?.B2BInvoice !== null &&
              storeITC?.B2BInvoice !== "" &&
              storeITC?.B2BInvoice !== undefined &&
              storeITC?.B2BInvoice.length !== 0
              ? storeITC?.B2BInvoice
              : [];
        } else if (rowIndex == 10) {
          filterData =
            storeITC?.B2BDebitNote !== null &&
              storeITC?.B2BDebitNote !== "" &&
              storeITC?.B2BDebitNote !== undefined &&
              storeITC?.B2BDebitNote.length !== 0
              ? storeITC?.B2BDebitNote
              : [];
        } else if (rowIndex == 11) {
          filterData =
            storeITC?.IMPG !== null &&
              storeITC?.IMPG !== "" &&
              storeITC?.IMPG !== undefined &&
              storeITC?.IMPG.length !== 0
              ? storeITC?.IMPG
              : [];
        } else if (rowIndex == 12) {
          filterData =
            storeITC?.IMPGA !== null &&
              storeITC?.IMPGA !== "" &&
              storeITC?.IMPGA !== undefined &&
              storeITC?.IMPGA.length !== 0
              ? storeITC?.IMPGA
              : [];
        } else if (rowIndex == 13) {
          filterData =
            storeITC?.IMPGSEZ !== null &&
              storeITC?.IMPGSEZ !== "" &&
              storeITC?.IMPGSEZ !== undefined &&
              storeITC?.IMPGSEZ.length !== 0
              ? storeITC?.IMPGSEZ
              : [];
        } else if (rowIndex == 14) {
          filterData =
            storeITC?.IMPGSEZA !== null &&
              storeITC?.IMPGSEZA !== "" &&
              storeITC?.IMPGSEZA !== undefined &&
              storeITC?.IMPGSEZA.length !== 0
              ? storeITC?.IMPGSEZA
              : [];
        } else if (rowIndex == 15) {
          filterData =
            storeITC?.B2BCreditNote !== null &&
              storeITC?.B2BCreditNote !== "" &&
              storeITC?.B2BCreditNote !== undefined &&
              storeITC?.B2BCreditNote.length !== 0
              ? storeITC?.B2BCreditNote
              : [];
        } else if (rowIndex == 16) {
          filterData =
            storeITC?.B2BACreditNote !== null &&
              storeITC?.B2BACreditNote !== "" &&
              storeITC?.B2BACreditNote !== undefined &&
              storeITC?.B2BACreditNote.length !== 0
              ? storeITC?.B2BACreditNote
              : [];
        } else if (rowIndex == 17) {
          filterData =
            storeITC?.B2BCreditNoteReverse !== null &&
              storeITC?.B2BCreditNoteReverse !== "" &&
              storeITC?.B2BCreditNoteReverse !== undefined &&
              storeITC?.B2BCreditNoteReverse.length !== 0
              ? storeITC?.B2BCreditNoteReverse
              : [];
        } else if (rowIndex == 18) {
          filterData =
            storeITC?.B2BACreditNoteReverse !== null &&
              storeITC?.B2BACreditNoteReverse !== "" &&
              storeITC?.B2BACreditNoteReverse !== undefined &&
              storeITC?.B2BACreditNoteReverse.length !== 0
              ? storeITC?.B2BACreditNoteReverse
              : [];
        } else if (rowIndex == 19) {
          filterData =
            storeITC?.ISDCreditNote !== null &&
              storeITC?.ISDCreditNote !== "" &&
              storeITC?.ISDCreditNote !== undefined &&
              storeITC?.ISDCreditNote.length !== 0
              ? storeITC?.ISDCreditNote
              : [];
        } else if (rowIndex == 20) {
          filterData =
            storeITC?.ISDACreditNote !== null &&
              storeITC?.ISDACreditNote !== "" &&
              storeITC?.ISDACreditNote !== undefined &&
              storeITC?.ISDACreditNote.length !== 0
              ? storeITC?.ISDACreditNote
              : [];
        } else {
          filterData = [];
        }
      } else if (storeNotITC !== undefined && itcFlag == 0) {
        if (rowIndex == 1) {
          filterData =
            storeNotITC?.B2BInvoiceReverse !== null &&
              storeNotITC?.B2BInvoiceReverse !== "" &&
              storeNotITC?.B2BInvoiceReverse !== undefined &&
              storeNotITC?.B2BInvoiceReverse.length !== 0
              ? storeNotITC?.B2BInvoiceReverse
              : [];
        } else if (rowIndex == 2) {
          filterData =
            storeNotITC?.B2BDebitNoteReverse !== null &&
              storeNotITC?.B2BDebitNoteReverse !== "" &&
              storeNotITC?.B2BDebitNoteReverse !== undefined &&
              storeNotITC?.B2BDebitNoteReverse.length !== 0
              ? storeNotITC?.B2BDebitNoteReverse
              : [];
        } else if (rowIndex == 3) {
          filterData =
            storeNotITC?.B2BAInvoiceReverse !== null &&
              storeNotITC?.B2BAInvoiceReverse !== "" &&
              storeNotITC?.B2BAInvoiceReverse !== undefined &&
              storeNotITC?.B2BAInvoiceReverse.length !== 0
              ? storeNotITC?.B2BAInvoiceReverse
              : [];
        } else if (rowIndex == 4) {
          filterData =
            storeNotITC?.B2BADebitNoteReverse !== null &&
              storeNotITC?.B2BADebitNoteReverse !== "" &&
              storeNotITC?.B2BADebitNoteReverse !== undefined &&
              storeNotITC?.B2BADebitNoteReverse.length !== 0
              ? storeNotITC?.B2BADebitNoteReverse
              : [];
        } else if (rowIndex == 5) {
          filterData =
            storeNotITC?.ISDInvoice !== null &&
              storeNotITC?.ISDInvoice !== "" &&
              storeNotITC?.ISDInvoice !== undefined &&
              storeNotITC?.ISDInvoice.length !== 0
              ? storeNotITC?.ISDInvoice
              : [];
        } else if (rowIndex == 6) {
          filterData =
            storeNotITC?.ISDAInvoice !== null &&
              storeNotITC?.ISDAInvoice !== "" &&
              storeNotITC?.ISDAInvoice !== undefined &&
              storeNotITC?.ISDAInvoice.length !== 0
              ? storeNotITC?.ISDAInvoice
              : [];
        } else if (rowIndex == 7) {
          filterData =
            storeNotITC?.B2BInvoice !== null &&
              storeNotITC?.B2BInvoice !== "" &&
              storeNotITC?.B2BInvoice !== undefined &&
              storeNotITC?.B2BInvoice.length !== 0
              ? storeNotITC?.B2BInvoice
              : [];
        } else if (rowIndex == 8) {
          filterData =
            storeNotITC?.B2BDebitNote !== null &&
              storeNotITC?.B2BDebitNote !== "" &&
              storeNotITC?.B2BDebitNote !== undefined &&
              storeNotITC?.B2BDebitNote.length !== 0
              ? storeNotITC?.B2BDebitNote
              : [];
        } else if (rowIndex == 9) {
          filterData =
            storeNotITC?.B2BAInvoice !== null &&
              storeNotITC?.B2BAInvoice !== "" &&
              storeNotITC?.B2BAInvoice !== undefined &&
              storeNotITC?.B2BAInvoice.length !== 0
              ? storeNotITC?.B2BAInvoice
              : [];
        } else if (rowIndex == 10) {
          filterData =
            storeNotITC?.B2BADebitNote !== null &&
              storeNotITC?.B2BADebitNote !== "" &&
              storeNotITC?.B2BADebitNote !== undefined &&
              storeNotITC?.B2BADebitNote.length !== 0
              ? storeNotITC?.B2BADebitNote
              : [];
        } else if (rowIndex == 11) {
          filterData =
            storeNotITC?.IMPG !== null &&
              storeNotITC?.IMPG !== "" &&
              storeNotITC?.IMPG !== undefined &&
              storeNotITC?.IMPG.length !== 0
              ? storeNotITC?.IMPG
              : [];
        } else if (rowIndex == 12) {
          filterData =
            storeITC?.IMPGA !== null &&
              storeITC?.IMPGA !== "" &&
              storeNotITC?.IMPGA !== undefined &&
              storeITC?.IMPGA.length !== 0
              ? storeITC?.IMPGA
              : [];
        } else if (rowIndex == 13) {
          filterData =
            storeNotITC?.IMPGSEZ !== null &&
              storeNotITC?.IMPGSEZ !== "" &&
              storeNotITC?.IMPGSEZ !== undefined &&
              storeNotITC?.IMPGSEZ.length !== 0
              ? storeNotITC?.IMPGSEZ
              : [];
        } else if (rowIndex == 14) {
          filterData =
            storeNotITC?.IMPGSEZA !== null &&
              storeNotITC?.IMPGSEZA !== "" &&
              storeNotITC?.IMPGSEZA !== undefined &&
              storeNotITC?.IMPGSEZA.length !== 0
              ? storeNotITC?.IMPGSEZA
              : [];
        } else if (rowIndex == 15) {
          filterData =
            storeNotITC?.B2BCreditNote !== null &&
              storeNotITC?.B2BCreditNote !== "" &&
              storeNotITC?.B2BCreditNote !== undefined &&
              storeNotITC?.B2BCreditNote.length !== 0
              ? storeNotITC?.B2BCreditNote
              : [];
        } else if (rowIndex == 16) {
          filterData =
            storeNotITC?.B2BACreditNote !== null &&
              storeNotITC?.B2BACreditNote !== "" &&
              storeNotITC?.B2BACreditNote !== undefined &&
              storeNotITC?.B2BACreditNote !== undefined &&
              storeNotITC?.B2BACreditNote.length !== 0
              ? storeNotITC?.B2BACreditNote
              : [];
        } else if (rowIndex == 17) {
          filterData =
            storeNotITC?.B2BCreditNoteReverse !== null &&
              storeNotITC?.B2BCreditNoteReverse !== "" &&
              storeNotITC?.B2BCreditNoteReverse !== undefined &&
              storeNotITC?.B2BCreditNoteReverse.length !== 0
              ? storeNotITC?.B2BCreditNoteReverse
              : [];
        } else if (rowIndex == 18) {
          filterData =
            storeNotITC?.B2BACreditNoteReverse !== null &&
              storeNotITC?.B2BACreditNoteReverse !== "" &&
              storeNotITC?.B2BACreditNoteReverse !== undefined &&
              storeNotITC?.B2BACreditNoteReverse.length !== 0
              ? storeNotITC?.B2BACreditNoteReverse
              : [];
        } else if (rowIndex == 19) {
          filterData =
            storeNotITC?.ISDCreditNote !== null &&
              storeNotITC?.ISDCreditNote !== "" &&
              storeNotITC?.ISDCreditNote !== undefined &&
              storeNotITC?.ISDCreditNote.length !== 0
              ? storeNotITC?.ISDCreditNote
              : [];
        } else if (rowIndex == 20) {
          filterData =
            storeNotITC?.ISDACreditNote !== null &&
              storeNotITC?.ISDACreditNote !== "" &&
              storeNotITC?.ISDACreditNote !== undefined &&
              storeNotITC?.ISDACreditNote.length !== 0
              ? storeNotITC?.ISDACreditNote
              : [];
        } else {
          filterData = [];
        }
      }
    } else {
      // ** Multiple
      let arrFilterData = null;
      if (storeITC !== undefined && itcFlag == 1) {
        arrFilterData = storeITC;
      } else if (storeNotITC !== undefined && itcFlag == 0) {
        arrFilterData = storeNotITC;
      }

      if (sectionType?.value == 1) {
        let arr1 =
          arrFilterData?.B2BInvoiceReverse !== null &&
            arrFilterData?.B2BInvoiceReverse !== "" &&
            arrFilterData?.B2BInvoiceReverse !== undefined &&
            arrFilterData?.B2BInvoiceReverse?.length !== 0
            ? arrFilterData?.B2BInvoiceReverse
            : [];

        let arr2 =
          arrFilterData?.B2BInvoice !== null &&
            arrFilterData?.B2BInvoice !== "" &&
            arrFilterData?.B2BInvoice !== undefined &&
            arrFilterData?.B2BInvoice?.length !== 0
            ? arrFilterData?.B2BInvoice
            : [];

        filterData = [...arr1, ...arr2];
      } else if (sectionType?.value == 2) {
        let arr1 =
          arrFilterData?.B2BAInvoiceReverse !== null &&
            arrFilterData?.B2BAInvoiceReverse !== "" &&
            arrFilterData?.B2BAInvoiceReverse !== undefined &&
            arrFilterData?.B2BAInvoiceReverse?.length !== 0
            ? arrFilterData?.B2BAInvoiceReverse
            : [];

        let arr2 =
          arrFilterData?.B2BAInvoice !== null &&
            arrFilterData?.B2BAInvoice !== "" &&
            arrFilterData?.B2BAInvoice !== undefined &&
            arrFilterData?.B2BAInvoice?.length !== 0
            ? arrFilterData?.B2BAInvoice
            : [];

        filterData = [...arr1, ...arr2];
      } else if (sectionType?.value == 3) {
        let arr1 =
          arrFilterData?.B2BDebitNoteReverse !== null &&
            arrFilterData?.B2BDebitNoteReverse !== "" &&
            arrFilterData?.B2BDebitNoteReverse !== undefined &&
            arrFilterData?.B2BDebitNoteReverse?.length !== 0
            ? arrFilterData?.B2BDebitNoteReverse
            : [];

        let arr2 =
          arrFilterData?.B2BDebitNote !== null &&
            arrFilterData?.B2BDebitNote !== "" &&
            arrFilterData?.B2BDebitNote !== undefined &&
            arrFilterData?.B2BDebitNote?.length !== 0
            ? arrFilterData?.B2BDebitNote
            : [];

        let arr3 =
          arrFilterData?.B2BCreditNote !== null &&
            arrFilterData?.B2BCreditNote !== "" &&
            arrFilterData?.B2BCreditNote !== undefined &&
            arrFilterData?.B2BCreditNote?.length !== 0
            ? arrFilterData?.B2BCreditNote
            : [];

        let arr4 =
          arrFilterData?.B2BCreditNoteReverse !== null &&
            arrFilterData?.B2BCreditNoteReverse !== "" &&
            arrFilterData?.B2BCreditNoteReverse !== undefined &&
            arrFilterData?.B2BCreditNoteReverse?.length !== 0
            ? arrFilterData?.B2BCreditNoteReverse
            : [];

        filterData = [...arr1, ...arr2, ...arr3, ...arr4];
      } else if (sectionType?.value == 4) {
        let arr1 =
          arrFilterData?.ISDInvoice !== null &&
            arrFilterData?.ISDInvoice !== "" &&
            arrFilterData?.ISDInvoice !== undefined &&
            arrFilterData?.ISDInvoice?.length !== 0
            ? arrFilterData?.ISDInvoice
            : [];

        let arr2 =
          arrFilterData?.ISDCreditNote !== null &&
            arrFilterData?.ISDCreditNote !== "" &&
            arrFilterData?.ISDCreditNote !== undefined &&
            arrFilterData?.ISDCreditNote?.length !== 0
            ? arrFilterData?.ISDCreditNote
            : [];

        filterData = [...arr1, ...arr2];
      } else if (sectionType?.value == 5) {
        let arr1 =
          arrFilterData?.IMPG !== null &&
            arrFilterData?.IMPG !== "" &&
            arrFilterData?.IMPG !== undefined &&
            arrFilterData?.IMPG?.length !== 0
            ? arrFilterData?.IMPG
            : [];

        let arr2 =
          arrFilterData?.IMPGA !== null &&
            arrFilterData?.IMPGA !== "" &&
            arrFilterData?.IMPGA !== undefined &&
            arrFilterData?.IMPGA?.length !== 0
            ? arrFilterData?.IMPGA
            : [];

        filterData = [...arr1, ...arr2];
      } else if (sectionType?.value == 6) {
        let arr1 =
          arrFilterData?.IMPGSEZ !== null &&
            arrFilterData?.IMPGSEZ !== "" &&
            arrFilterData?.IMPGSEZ !== undefined &&
            arrFilterData?.IMPGSEZ?.length !== 0
            ? arrFilterData?.IMPGSEZ
            : [];

        let arr2 =
          arrFilterData?.IMPGSEZA !== null &&
            arrFilterData?.IMPGSEZA !== "" &&
            arrFilterData?.IMPGSEZA !== undefined &&
            arrFilterData?.IMPGSEZA?.length !== 0
            ? arrFilterData?.IMPGSEZA
            : [];

        filterData = [...arr1, ...arr2];
      } else if (sectionType?.value == 7) {
        let arr1 =
          arrFilterData?.B2BADebitNoteReverse !== null &&
            arrFilterData?.B2BADebitNoteReverse !== "" &&
            arrFilterData?.B2BADebitNoteReverse !== undefined &&
            arrFilterData?.B2BADebitNoteReverse.length !== 0
            ? arrFilterData?.B2BADebitNoteReverse
            : [];

        let arr2 =
          arrFilterData?.B2BADebitNote !== null &&
            arrFilterData?.B2BADebitNote !== "" &&
            arrFilterData?.B2BADebitNote !== undefined &&
            arrFilterData?.B2BADebitNote?.length !== 0
            ? arrFilterData?.B2BADebitNote
            : [];

        let arr3 =
          arrFilterData?.B2BACreditNote !== null &&
            arrFilterData?.B2BACreditNote !== "" &&
            arrFilterData?.B2BACreditNote !== undefined &&
            arrFilterData?.B2BACreditNote?.length !== 0
            ? arrFilterData?.B2BACreditNote
            : [];

        let arr4 =
          arrFilterData?.B2BACreditNoteReverse !== null &&
            arrFilterData?.B2BACreditNoteReverse !== "" &&
            arrFilterData?.B2BACreditNoteReverse !== undefined &&
            arrFilterData?.B2BACreditNoteReverse?.length !== 0
            ? arrFilterData?.B2BACreditNoteReverse
            : [];

        filterData = [...arr1, ...arr2, ...arr3, ...arr4];
      } else if (sectionType?.value == 8) {
        let arr1 =
          arrFilterData?.ISDACreditNote !== null &&
            arrFilterData?.ISDACreditNote !== "" &&
            arrFilterData?.ISDACreditNote !== undefined &&
            arrFilterData?.ISDACreditNote?.length !== 0
            ? arrFilterData?.ISDACreditNote
            : [];

        let arr2 =
          arrFilterData?.ISDAInvoice !== null &&
            arrFilterData?.ISDAInvoice !== "" &&
            arrFilterData?.ISDAInvoice !== undefined &&
            arrFilterData?.ISDAInvoice?.length !== 0
            ? arrFilterData?.ISDAInvoice
            : [];

        filterData = [...arr1, ...arr2];
      }
    }

    return filterData;
  };

  // ** Search Summary Data
  const gstr2bSummaryData = (types, sectionIndex) => {
    //  let arrSummaryData = []
    setCurrentPage(0);
    console.log("Search Data with clear", types, sectionIndex, location?.state);

    if (types == "single") {
      if (storeITC !== undefined && itcFlag == 1) {
        setSearchApi(false);

        setBlock(false);
        if (rowIndex == 1) {
          setData(
            storeITC?.B2BInvoiceReverse !== null &&
              storeITC?.B2BInvoiceReverse !== "" &&
              storeITC?.B2BInvoiceReverse !== undefined &&
              storeITC?.B2BInvoiceReverse.length !== 0
              ? storeITC?.B2BInvoiceReverse
              : []
          );
        } else if (rowIndex == 2) {
          setData(
            storeITC?.B2BDebitNoteReverse !== null &&
              storeITC?.B2BDebitNoteReverse !== "" &&
              storeITC?.B2BDebitNoteReverse !== undefined &&
              storeITC?.B2BDebitNoteReverse.length !== 0
              ? storeITC?.B2BDebitNoteReverse
              : []
          );
        } else if (rowIndex == 3) {
          setData(
            storeITC?.B2BAInvoiceReverse !== null &&
              storeITC?.B2BAInvoiceReverse !== "" &&
              storeITC?.B2BAInvoiceReverse !== undefined &&
              storeITC?.B2BAInvoiceReverse.length !== 0
              ? storeITC?.B2BAInvoiceReverse
              : []
          );
        } else if (rowIndex == 4) {
          setData(
            storeITC?.B2BADebitNoteReverse !== null &&
              storeITC?.B2BADebitNoteReverse !== "" &&
              storeITC?.B2BADebitNoteReverse !== undefined &&
              storeITC?.B2BADebitNoteReverse.length !== 0
              ? storeITC?.B2BADebitNoteReverse
              : []
          );
        } else if (rowIndex == 5) {
          setData(
            storeITC?.ISDInvoice !== null &&
              storeITC?.ISDInvoice !== "" &&
              storeITC?.ISDInvoice !== undefined &&
              storeITC?.ISDInvoice.length !== 0
              ? storeITC?.ISDInvoice
              : []
          );
        } else if (rowIndex == 6) {
          setData(
            storeITC?.ISDAInvoice !== null &&
              storeITC?.ISDAInvoice !== "" &&
              storeITC?.ISDAInvoice !== undefined &&
              storeITC?.ISDAInvoice.length !== 0
              ? storeITC?.ISDAInvoice
              : []
          );
        } else if (rowIndex == 7) {
          setData(
            storeITC?.B2BAInvoice !== null &&
              storeITC?.B2BAInvoice !== "" &&
              storeITC?.B2BAInvoice !== undefined &&
              storeITC?.B2BAInvoice.length !== 0
              ? storeITC?.B2BAInvoice
              : []
          );
        } else if (rowIndex == 8) {
          setData(
            storeITC?.B2BADebitNote !== null &&
              storeITC?.B2BADebitNote !== "" &&
              storeITC?.B2BADebitNote !== undefined &&
              storeITC?.B2BADebitNote.length !== 0
              ? storeITC?.B2BADebitNote
              : []
          );
        } else if (rowIndex == 9) {
          setData(
            storeITC?.B2BInvoice !== null &&
              storeITC?.B2BInvoice !== "" &&
              storeITC?.B2BInvoice !== undefined &&
              storeITC?.B2BInvoice.length !== 0
              ? storeITC?.B2BInvoice
              : []
          );
        } else if (rowIndex == 10) {
          setData(
            storeITC?.B2BDebitNote !== null &&
              storeITC?.B2BDebitNote !== "" &&
              storeITC?.B2BDebitNote !== undefined &&
              storeITC?.B2BDebitNote.length !== 0
              ? storeITC?.B2BDebitNote
              : []
          );
        } else if (rowIndex == 11) {
          setData(
            storeITC?.IMPG !== null &&
              storeITC?.IMPG !== "" &&
              storeITC?.IMPG !== undefined &&
              storeITC?.IMPG.length !== 0
              ? storeITC?.IMPG
              : []
          );
        } else if (rowIndex == 12) {
          setData(
            storeITC?.IMPGA !== null &&
              storeITC?.IMPGA !== "" &&
              storeITC?.IMPGA !== undefined &&
              storeITC?.IMPGA.length !== 0
              ? storeITC?.IMPGA
              : []
          );
        } else if (rowIndex == 13) {
          setData(
            storeITC?.IMPGSEZ !== null &&
              storeITC?.IMPGSEZ !== "" &&
              storeITC?.IMPGSEZ !== undefined &&
              storeITC?.IMPGSEZ.length !== 0
              ? storeITC?.IMPGSEZ
              : []
          );
        } else if (rowIndex == 14) {
          setData(
            storeITC?.IMPGSEZA !== null &&
              storeITC?.IMPGSEZA !== "" &&
              storeITC?.IMPGSEZA !== undefined &&
              storeITC?.IMPGSEZA.length !== 0
              ? storeITC?.IMPGSEZA
              : []
          );
        } else if (rowIndex == 15) {
          setData(
            storeITC?.B2BCreditNote !== null &&
              storeITC?.B2BCreditNote !== "" &&
              storeITC?.B2BCreditNote !== undefined &&
              storeITC?.B2BCreditNote.length !== 0
              ? storeITC?.B2BCreditNote
              : []
          );
        } else if (rowIndex == 16) {
          setData(
            storeITC?.B2BACreditNote !== null &&
              storeITC?.B2BACreditNote !== "" &&
              storeITC?.B2BACreditNote !== undefined &&
              storeITC?.B2BACreditNote.length !== 0
              ? storeITC?.B2BACreditNote
              : []
          );
        } else if (rowIndex == 17) {
          setData(
            storeITC?.B2BCreditNoteReverse !== null &&
              storeITC?.B2BCreditNoteReverse !== "" &&
              storeITC?.B2BCreditNoteReverse !== undefined &&
              storeITC?.B2BCreditNoteReverse.length !== 0
              ? storeITC?.B2BCreditNoteReverse
              : []
          );
        } else if (rowIndex == 18) {
          setData(
            storeITC?.B2BACreditNoteReverse !== null &&
              storeITC?.B2BACreditNoteReverse !== "" &&
              storeITC?.B2BACreditNoteReverse !== undefined &&
              storeITC?.B2BACreditNoteReverse.length !== 0
              ? storeITC?.B2BACreditNoteReverse
              : []
          );
        } else if (rowIndex == 19) {
          setData(
            storeITC?.ISDCreditNote !== null &&
              storeITC?.ISDCreditNote !== "" &&
              storeITC?.ISDCreditNote !== undefined &&
              storeITC?.ISDCreditNote.length !== 0
              ? storeITC?.ISDCreditNote
              : []
          );
        } else if (rowIndex == 20) {
          setData(
            storeITC?.ISDACreditNote !== null &&
              storeITC?.ISDACreditNote !== "" &&
              storeITC?.ISDACreditNote !== undefined &&
              storeITC?.ISDACreditNote.length !== 0
              ? storeITC?.ISDACreditNote
              : []
          );
        } else {
          setData([]);
          setBlock(false);
        }
      } else if (storeNotITC !== undefined && itcFlag == 0) {
        setSearchApi(false);
        setBlock(false);
        if (rowIndex == 1) {
          setData(
            storeNotITC?.B2BInvoiceReverse !== null &&
              storeNotITC?.B2BInvoiceReverse !== "" &&
              storeNotITC?.B2BInvoiceReverse !== undefined &&
              storeNotITC?.B2BInvoiceReverse.length !== 0
              ? storeNotITC?.B2BInvoiceReverse
              : []
          );
        } else if (rowIndex == 2) {
          setData(
            storeNotITC?.B2BDebitNoteReverse !== null &&
              storeNotITC?.B2BDebitNoteReverse !== "" &&
              storeNotITC?.B2BDebitNoteReverse !== undefined &&
              storeNotITC?.B2BDebitNoteReverse.length !== 0
              ? storeNotITC?.B2BDebitNoteReverse
              : []
          );
        } else if (rowIndex == 3) {
          setData(
            storeNotITC?.B2BAInvoiceReverse !== null &&
              storeNotITC?.B2BAInvoiceReverse !== "" &&
              storeNotITC?.B2BAInvoiceReverse !== undefined &&
              storeNotITC?.B2BAInvoiceReverse.length !== 0
              ? storeNotITC?.B2BAInvoiceReverse
              : []
          );
        } else if (rowIndex == 4) {
          setData(
            storeNotITC?.B2BADebitNoteReverse !== null &&
              storeNotITC?.B2BADebitNoteReverse !== "" &&
              storeNotITC?.B2BADebitNoteReverse !== undefined &&
              storeNotITC?.B2BADebitNoteReverse.length !== 0
              ? storeNotITC?.B2BADebitNoteReverse
              : []
          );
        } else if (rowIndex == 5) {
          setData(
            storeNotITC?.ISDInvoice !== null &&
              storeNotITC?.ISDInvoice !== "" &&
              storeNotITC?.ISDInvoice !== undefined &&
              storeNotITC?.ISDInvoice.length !== 0
              ? storeNotITC?.ISDInvoice
              : []
          );
        } else if (rowIndex == 6) {
          setData(
            storeNotITC?.ISDAInvoice !== null &&
              storeNotITC?.ISDAInvoice !== "" &&
              storeNotITC?.ISDAInvoice !== undefined &&
              storeNotITC?.ISDAInvoice.length !== 0
              ? storeNotITC?.ISDAInvoice
              : []
          );
        } else if (rowIndex == 7) {
          setData(
            storeNotITC?.B2BInvoice !== null &&
              storeNotITC?.B2BInvoice !== "" &&
              storeNotITC?.B2BInvoice !== undefined &&
              storeNotITC?.B2BInvoice.length !== 0
              ? storeNotITC?.B2BInvoice
              : []
          );
        } else if (rowIndex == 8) {
          setData(
            storeNotITC?.B2BDebitNote !== null &&
              storeNotITC?.B2BDebitNote !== "" &&
              storeNotITC?.B2BDebitNote !== undefined &&
              storeNotITC?.B2BDebitNote.length !== 0
              ? storeNotITC?.B2BDebitNote
              : []
          );
        } else if (rowIndex == 9) {
          setData(
            storeNotITC?.B2BAInvoice !== null &&
              storeNotITC?.B2BAInvoice !== "" &&
              storeNotITC?.B2BAInvoice !== undefined &&
              storeNotITC?.B2BAInvoice.length !== 0
              ? storeNotITC?.B2BAInvoice
              : []
          );
        } else if (rowIndex == 10) {
          setData(
            storeNotITC?.B2BADebitNote !== null &&
              storeNotITC?.B2BADebitNote !== "" &&
              storeNotITC?.B2BADebitNote !== undefined &&
              storeNotITC?.B2BADebitNote.length !== 0
              ? storeNotITC?.B2BADebitNote
              : []
          );
        } else if (rowIndex == 11) {
          setData(
            storeNotITC?.IMPG !== null &&
              storeNotITC?.IMPG !== "" &&
              storeNotITC?.IMPG !== undefined &&
              storeNotITC?.IMPG.length !== 0
              ? storeNotITC?.IMPG
              : []
          );
        } else if (rowIndex == 12) {
          setData(
            storeITC?.IMPGA !== null &&
              storeITC?.IMPGA !== "" &&
              storeNotITC?.IMPGA !== undefined &&
              storeITC?.IMPGA.length !== 0
              ? storeITC?.IMPGA
              : []
          );
        } else if (rowIndex == 13) {
          setData(
            storeNotITC?.IMPGSEZ !== null &&
              storeNotITC?.IMPGSEZ !== "" &&
              storeNotITC?.IMPGSEZ !== undefined &&
              storeNotITC?.IMPGSEZ.length !== 0
              ? storeNotITC?.IMPGSEZ
              : []
          );
        } else if (rowIndex == 14) {
          setData(
            storeNotITC?.IMPGSEZA !== null &&
              storeNotITC?.IMPGSEZA !== "" &&
              storeNotITC?.IMPGSEZA !== undefined &&
              storeNotITC?.IMPGSEZA.length !== 0
              ? storeNotITC?.IMPGSEZA
              : []
          );
        } else if (rowIndex == 15) {
          setData(
            storeNotITC?.B2BCreditNote !== null &&
              storeNotITC?.B2BCreditNote !== "" &&
              storeNotITC?.B2BCreditNote !== undefined &&
              storeNotITC?.B2BCreditNote.length !== 0
              ? storeNotITC?.B2BCreditNote
              : []
          );
        } else if (rowIndex == 16) {
          setData(
            storeNotITC?.B2BACreditNote !== null &&
              storeNotITC?.B2BACreditNote !== "" &&
              storeNotITC?.B2BACreditNote !== undefined &&
              storeNotITC?.B2BACreditNote.length !== 0
              ? storeNotITC?.B2BACreditNote
              : []
          );
        } else if (rowIndex == 17) {
          setData(
            storeNotITC?.B2BCreditNoteReverse !== null &&
              storeNotITC?.B2BCreditNoteReverse !== "" &&
              storeNotITC?.B2BCreditNoteReverse !== undefined &&
              storeNotITC?.B2BCreditNoteReverse.length !== 0
              ? storeNotITC?.B2BCreditNoteReverse
              : []
          );
        } else if (rowIndex == 18) {
          setData(
            storeNotITC?.B2BACreditNoteReverse !== null &&
              storeNotITC?.B2BACreditNoteReverse !== "" &&
              storeNotITC?.B2BACreditNoteReverse !== undefined &&
              storeNotITC?.B2BACreditNoteReverse.length !== 0
              ? storeNotITC?.B2BACreditNoteReverse
              : []
          );
        } else if (rowIndex == 19) {
          setData(
            storeNotITC?.ISDCreditNote !== null &&
              storeNotITC?.ISDCreditNote !== "" &&
              storeNotITC?.ISDCreditNote !== undefined &&
              storeNotITC?.ISDCreditNote.length !== 0
              ? storeNotITC?.ISDCreditNote
              : []
          );
        } else if (rowIndex == 20) {
          setData(
            storeNotITC?.ISDACreditNote !== null &&
              storeNotITC?.ISDACreditNote !== "" &&
              storeNotITC?.ISDACreditNote !== undefined &&
              storeNotITC?.ISDACreditNote.length !== 0
              ? storeNotITC?.ISDACreditNote
              : []
          );
        } else {
          setData([]);
          setBlock(false);
        }
      } else {
        setBlock(false);
      }
    } else {
      // ** Multiple array add - section id - section name

      if (storeITC !== undefined && itcFlag == 1) {
        let count = 0;
        let tValue = 0;
        let sgst = 0;
        let cgst = 0;
        let cess = 0;
        let igst = 0;

        // B2B
        if (sectionIndex == 1) {
          let arr1 =
            storeITC?.B2BInvoiceReverse !== null &&
              storeITC?.B2BInvoiceReverse !== "" &&
              storeITC?.B2BInvoiceReverse !== undefined &&
              storeITC?.B2BInvoiceReverse.length !== 0
              ? storeITC?.B2BInvoiceReverse
              : [];

          let arr2 =
            storeITC?.B2BInvoice !== null &&
              storeITC?.B2BInvoice !== "" &&
              storeITC?.B2BInvoice !== undefined &&
              storeITC?.B2BInvoice.length !== 0
              ? storeITC?.B2BInvoice
              : [];

          let arrMarge = [...arr1, ...arr2];
          arrMarge.length
            ? arrMarge?.map((ele, index) => {
              count += parseFloat(ele?.InvoiceValue);
              tValue += parseFloat(ele?.TaxableValue);
              sgst += parseFloat(ele?.SGST);
              cess += parseFloat(ele?.Cess);
              cgst += parseFloat(ele?.CGST);
              igst += parseFloat(ele?.IGST);
            })
            : ""; /// Method tot set the set the CGST, SGST Total Tax and Invoice Value

          setIGST(igst);
          setCess(cess);
          setCGST(cgst);
          setSGST(sgst);
          setTotalInvoice(arrMarge?.length); // Number of Invoice set
          setTotalInvoiceValue(count); // Invoice Value Set
          setTotalTaxableValue(tValue);
          console.log(arrMarge, "arrMargearrMarge");
          setData(arrMarge);
        } else if (sectionIndex == 2) {
          // B2BA

          let arr1 =
            storeITC?.B2BAInvoiceReverse !== null &&
              storeITC?.B2BAInvoiceReverse !== "" &&
              storeITC?.B2BAInvoiceReverse !== undefined &&
              storeITC?.B2BAInvoiceReverse.length !== 0
              ? storeITC?.B2BAInvoiceReverse
              : [];

          let arr2 =
            storeITC?.B2BAInvoice !== null &&
              storeITC?.B2BAInvoice !== "" &&
              storeITC?.B2BAInvoice !== undefined &&
              storeITC?.B2BAInvoice.length !== 0
              ? storeITC?.B2BAInvoice
              : [];

          let arrMarge = [...arr1, ...arr2];
          arrMarge.length
            ? arrMarge?.map((ele, index) => {
              count += parseInt(ele?.InvoiceValue);
              tValue += parseInt(ele?.TaxableValue);
              sgst += parseInt(ele?.SGST);
              cess += parseInt(ele?.Cess);
              cgst += parseInt(ele?.CGST);
              igst += parseInt(ele?.IGST);
            })
            : ""; /// Method tot set the set the CGST, SGST Total Tax and Invoice Value

          setIGST(igst);
          setCess(cess);
          setCGST(cgst);
          setSGST(sgst);
          setTotalInvoice(arrMarge?.length); // Number of Invoice set
          setTotalInvoiceValue(count); // Invoice Value Set
          setTotalTaxableValue(tValue);
          console.log(arrMarge, "arrMargearrMarge");
          setData(arrMarge);
        } else if (sectionIndex == 3) {
          // B2B-CDNR

          let arr1 =
            storeITC?.B2BDebitNoteReverse !== null &&
              storeITC?.B2BDebitNoteReverse !== "" &&
              storeITC?.B2BDebitNoteReverse !== undefined &&
              storeITC?.B2BDebitNoteReverse.length !== 0
              ? storeITC?.B2BDebitNoteReverse
              : [];

          let arr2 =
            storeITC?.B2BDebitNote !== null &&
              storeITC?.B2BDebitNote !== "" &&
              storeITC?.B2BDebitNote !== undefined &&
              storeITC?.B2BDebitNote.length !== 0
              ? storeITC?.B2BDebitNote
              : [];

          let arr3 =
            storeITC?.B2BCreditNote !== null &&
              storeITC?.B2BCreditNote !== "" &&
              storeITC?.B2BCreditNote !== undefined &&
              storeITC?.B2BCreditNote.length !== 0
              ? storeITC?.B2BCreditNote
              : [];

          let arr4 =
            storeITC?.B2BCreditNoteReverse !== null &&
              storeITC?.B2BCreditNoteReverse !== "" &&
              storeITC?.B2BCreditNoteReverse !== undefined &&
              storeITC?.B2BCreditNoteReverse?.length !== 0
              ? storeITC?.B2BCreditNoteReverse
              : [];

          let arrMarge = [...arr1, ...arr2, ...arr3, ...arr4];
          arrMarge.length
            ? arrMarge?.map((ele, index) => {
              count += parseFloat(ele?.InvoiceValue);
              tValue += parseFloat(ele?.TaxableValue);
              sgst += parseFloat(ele?.SGST);
              cess += parseFloat(ele?.Cess);
              cgst += parseFloat(ele?.CGST);
              igst += parseFloat(ele?.IGST);
            })
            : ""; /// Method tot set the set the CGST, SGST Total Tax and Invoice Value

          setIGST(igst);
          setCess(cess);
          setCGST(cgst);
          setSGST(sgst);
          setTotalInvoice(arrMarge?.length); // Number of Invoice set
          setTotalInvoiceValue(count); // Invoice Value Set
          setTotalTaxableValue(tValue);
          console.log(arrMarge, "arrMargearrMarge");
          setData(arrMarge);
        } else if (sectionIndex == 4) {
          // ISD

          let arr1 =
            storeITC?.ISDInvoice !== null &&
              storeITC?.ISDInvoice !== "" &&
              storeITC?.ISDInvoice !== undefined &&
              storeITC?.ISDInvoice.length !== 0
              ? storeITC?.ISDInvoice
              : [];

          let arr2 =
            storeITC?.ISDCreditNote !== null &&
              storeITC?.ISDCreditNote !== "" &&
              storeITC?.ISDCreditNote !== undefined &&
              storeITC?.ISDCreditNote.length !== 0
              ? storeITC?.ISDCreditNote
              : [];

          let arrMarge = [...arr1, ...arr2];
          arrMarge.length
            ? arrMarge?.map((ele, index) => {
              count += parseFloat(ele?.InvoiceValue);
              tValue += parseFloat(ele?.TaxableValue);
              sgst += parseFloat(ele?.SGST);
              cess += parseFloat(ele?.Cess);
              cgst += parseFloat(ele?.CGST);
              igst += parseFloat(ele?.IGST);
            })
            : ""; /// Method tot set the set the CGST, SGST Total Tax and Invoice Value

          setIGST(igst);
          setCess(cess);
          setCGST(cgst);
          setSGST(sgst);
          setTotalInvoice(arrMarge?.length); // Number of Invoice set
          setTotalInvoiceValue(count); // Invoice Value Set
          setTotalTaxableValue(tValue);
          console.log(arrMarge, "arrMargearrMarge");
          setData(arrMarge);
        } else if (sectionIndex == 5) {
          // IMPG

          let arr1 =
            storeITC?.IMPG !== null &&
              storeITC?.IMPG !== "" &&
              storeITC?.IMPG !== undefined &&
              storeITC?.IMPG.length !== 0
              ? storeITC?.IMPG
              : [];

          let arr2 =
            storeITC?.IMPGA !== null &&
              storeITC?.IMPGA !== "" &&
              storeITC?.IMPGA !== undefined &&
              storeITC?.IMPGA.length !== 0
              ? storeITC?.IMPGA
              : [];

          let arrMarge = [...arr1, ...arr2];
          arrMarge.length
            ? arrMarge?.map((ele, index) => {
              count += parseFloat(ele?.InvoiceValue);
              tValue += parseFloat(ele?.TaxableValue);
              sgst += parseFloat(ele?.SGST);
              cess += parseFloat(ele?.Cess);
              cgst += parseFloat(ele?.CGST);
              igst += parseFloat(ele?.IGST);
            })
            : ""; /// Method tot set the set the CGST, SGST Total Tax and Invoice Value

          setIGST(igst);
          setCess(cess);
          setCGST(cgst);
          setSGST(sgst);
          setTotalInvoice(arrMarge?.length); // Number of Invoice set
          setTotalInvoiceValue(count); // Invoice Value Set
          setTotalTaxableValue(tValue);
          console.log(arrMarge, "arrMargearrMarge");
          setData(arrMarge);
        } else if (sectionIndex == 6) {
          // IMPGSEZ

          let arr1 =
            storeITC?.IMPGSEZ !== null &&
              storeITC?.IMPGSEZ !== "" &&
              storeITC?.IMPGSEZ !== undefined &&
              storeITC?.IMPGSEZ.length !== 0
              ? storeITC?.IMPGSEZ
              : [];

          let arr2 =
            storeITC?.IMPGSEZA !== null &&
              storeITC?.IMPGSEZA !== "" &&
              storeITC?.IMPGSEZA !== undefined &&
              storeITC?.IMPGSEZA.length !== 0
              ? storeITC?.IMPGSEZA
              : [];

          let arrMarge = [...arr1, ...arr2];
          arrMarge.length
            ? arrMarge?.map((ele, index) => {
              count += parseFloat(ele?.InvoiceValue);
              tValue += parseFloat(ele?.TaxableValue);
              sgst += parseFloat(ele?.SGST);
              cess += parseFloat(ele?.Cess);
              cgst += parseFloat(ele?.CGST);
              igst += parseFloat(ele?.IGST);
            })
            : ""; /// Method tot set the set the CGST, SGST Total Tax and Invoice Value

          setIGST(igst);
          setCess(cess);
          setCGST(cgst);
          setSGST(sgst);
          setTotalInvoice(arrMarge?.length); // Number of Invoice set
          setTotalInvoiceValue(count); // Invoice Value Set
          setTotalTaxableValue(tValue);
          console.log(arrMarge, "arrMargearrMarge");
          setData(arrMarge);
        } else if (sectionIndex == 7) {
          // B2B-CDNRA

          let arr1 =
            storeITC?.B2BADebitNoteReverse !== null &&
              storeITC?.B2BADebitNoteReverse !== "" &&
              storeITC?.B2BADebitNoteReverse !== undefined &&
              storeITC?.B2BADebitNoteReverse.length !== 0
              ? storeITC?.B2BADebitNoteReverse
              : [];

          let arr2 =
            storeITC?.B2BADebitNote !== null &&
              storeITC?.B2BADebitNote !== "" &&
              storeITC?.B2BADebitNote !== undefined &&
              storeITC?.B2BADebitNote.length !== 0
              ? storeITC?.B2BADebitNote
              : [];

          let arr3 =
            storeITC?.B2BACreditNote !== null &&
              storeITC?.B2BACreditNote !== "" &&
              storeITC?.B2BACreditNote !== undefined &&
              storeITC?.B2BACreditNote.length !== 0
              ? storeITC?.B2BACreditNote
              : [];

          let arr4 =
            storeITC?.B2BACreditNoteReverse !== null &&
              storeITC?.B2BACreditNoteReverse !== "" &&
              storeITC?.B2BACreditNoteReverse !== undefined &&
              storeITC?.B2BACreditNoteReverse.length !== 0
              ? storeITC?.B2BACreditNoteReverse
              : [];

          let arrMarge = [...arr1, ...arr2, ...arr3, ...arr4];
          arrMarge.length
            ? arrMarge?.map((ele, index) => {
              count += parseFloat(ele?.InvoiceValue);
              tValue += parseFloat(ele?.TaxableValue);
              sgst += parseFloat(ele?.SGST);
              cess += parseFloat(ele?.Cess);
              cgst += parseFloat(ele?.CGST);
              igst += parseFloat(ele?.IGST);
            })
            : ""; /// Method tot set the set the CGST, SGST Total Tax and Invoice Value

          setIGST(igst);
          setCess(cess);
          setCGST(cgst);
          setSGST(sgst);
          setTotalInvoice(arrMarge?.length); // Number of Invoice set
          setTotalInvoiceValue(count); // Invoice Value Set
          setTotalTaxableValue(tValue);
          console.log(arrMarge, "arrMargearrMarge");
          setData(arrMarge);
        } else if (sectionIndex == 8) {
          // ISDA
          let arr1 =
            storeITC?.ISDACreditNote !== null &&
              storeITC?.ISDACreditNote !== "" &&
              storeITC?.ISDACreditNote !== undefined &&
              storeITC?.ISDACreditNote.length !== 0
              ? storeITC?.ISDACreditNote
              : [];

          let arr2 =
            storeITC?.ISDAInvoice !== null &&
              storeITC?.ISDAInvoice !== "" &&
              storeITC?.ISDAInvoice !== undefined &&
              storeITC?.ISDAInvoice.length !== 0
              ? storeITC?.ISDAInvoice
              : [];

          let arrMarge = [...arr1, ...arr2];
          arrMarge.length
            ? arrMarge?.map((ele, index) => {
              count += parseFloat(ele?.InvoiceValue);
              tValue += parseFloat(ele?.TaxableValue);
              sgst += parseFloat(ele?.SGST);
              cess += parseFloat(ele?.Cess);
              cgst += parseFloat(ele?.CGST);
              igst += parseFloat(ele?.IGST);
            })
            : ""; /// Method tot set the set the CGST, SGST Total Tax and Invoice Value

          setIGST(igst);
          setCess(cess);
          setCGST(cgst);
          setSGST(sgst);
          setTotalInvoice(arrMarge?.length); // Number of Invoice set
          setTotalInvoiceValue(count); // Invoice Value Set
          setTotalTaxableValue(tValue);
          console.log(arrMarge, "arrMargearrMarge");
          setData(arrMarge);
        }
      } else if (storeNotITC !== undefined && itcFlag == 0) {
        let count = 0;
        let tValue = 0;
        let sgst = 0;
        let cgst = 0;
        let cess = 0;
        let igst = 0;

        if (sectionIndex == 1) {
          // B2B

          let arr1 =
            storeNotITC?.B2BInvoiceReverse !== null &&
              storeNotITC?.B2BInvoiceReverse !== "" &&
              storeNotITC?.B2BInvoiceReverse !== undefined &&
              storeNotITC?.B2BInvoiceReverse.length !== 0
              ? storeNotITC?.B2BInvoiceReverse
              : [];

          let arr2 =
            storeNotITC?.B2BInvoice !== null &&
              storeNotITC?.B2BInvoice !== "" &&
              storeNotITC?.B2BInvoice !== undefined &&
              storeNotITC?.B2BInvoice.length !== 0
              ? storeNotITC?.B2BInvoice
              : [];

          let arrMarge = [...arr1, ...arr2];
          arrMarge.length
            ? arrMarge?.map((ele, index) => {
              count += parseFloat(ele?.InvoiceValue);
              tValue += parseFloat(ele?.TaxableValue);
              sgst += parseFloat(ele?.SGST);
              cess += parseFloat(ele?.Cess);
              cgst += parseFloat(ele?.CGST);
              igst += parseFloat(ele?.IGST);
            })
            : ""; /// Method tot set the set the CGST, SGST Total Tax and Invoice Value

          setIGST(igst);
          setCess(cess);
          setCGST(cgst);
          setSGST(sgst);
          setTotalInvoice(arrMarge?.length); // Number of Invoice set
          setTotalInvoiceValue(count); // Invoice Value Set
          setTotalTaxableValue(tValue);
          console.log(arrMarge, "arrMargearrMarge");
          setData(arrMarge);
        } else if (sectionIndex == 2) {
          // B2BA

          let arr1 =
            storeNotITC?.B2BAInvoiceReverse !== null &&
              storeNotITC?.B2BAInvoiceReverse !== "" &&
              storeNotITC?.B2BAInvoiceReverse !== undefined &&
              storeNotITC?.B2BAInvoiceReverse.length !== 0
              ? storeNotITC?.B2BAInvoiceReverse
              : [];

          let arr2 =
            storeNotITC?.B2BAInvoice !== null &&
              storeNotITC?.B2BAInvoice !== "" &&
              storeNotITC?.B2BAInvoice !== undefined &&
              storeNotITC?.B2BAInvoice.length !== 0
              ? storeNotITC?.B2BAInvoice
              : [];

          let arrMarge = [...arr1, ...arr2];
          arrMarge.length
            ? arrMarge?.map((ele, index) => {
              count += parseFloat(ele?.InvoiceValue);
              tValue += parseFloat(ele?.TaxableValue);
              sgst += parseFloat(ele?.SGST);
              cess += parseFloat(ele?.Cess);
              cgst += parseFloat(ele?.CGST);
              igst += parseFloat(ele?.IGST);
            })
            : ""; /// Method tot set the set the CGST, SGST Total Tax and Invoice Value

          setIGST(igst);
          setCess(cess);
          setCGST(cgst);
          setSGST(sgst);
          setTotalInvoice(arrMarge?.length); // Number of Invoice set
          setTotalInvoiceValue(count); // Invoice Value Set
          setTotalTaxableValue(tValue);
          console.log(arrMarge, "arrMargearrMarge");
          setData(arrMarge);
        } else if (sectionIndex == 3) {
          // B2B-CDNR

          let arr1 =
            storeNotITC?.B2BDebitNoteReverse !== null &&
              storeNotITC?.B2BDebitNoteReverse !== "" &&
              storeNotITC?.B2BDebitNoteReverse !== undefined &&
              storeNotITC?.B2BDebitNoteReverse?.length !== 0
              ? storeNotITC?.B2BDebitNoteReverse
              : [];

          let arr2 =
            storeNotITC?.B2BDebitNote !== null &&
              storeNotITC?.B2BDebitNote !== "" &&
              storeNotITC?.B2BDebitNote !== undefined &&
              storeNotITC?.B2BDebitNote?.length !== 0
              ? storeNotITC?.B2BDebitNote
              : [];

          let arr3 =
            storeNotITC?.B2BCreditNote !== null &&
              storeNotITC?.B2BCreditNote !== "" &&
              storeNotITC?.B2BCreditNote !== undefined &&
              storeNotITC?.B2BCreditNote?.length !== 0
              ? storeNotITC?.B2BCreditNote
              : [];

          let arrMarge = [...arr1, ...arr2, ...arr3];
          arrMarge.length
            ? arrMarge?.map((ele, index) => {
              count += parseFloat(ele?.InvoiceValue);
              tValue += parseFloat(ele?.TaxableValue);
              sgst += parseFloat(ele?.SGST);
              cess += parseFloat(ele?.Cess);
              cgst += parseFloat(ele?.CGST);
              igst += parseFloat(ele?.IGST);
            })
            : ""; /// Method tot set the set the CGST, SGST Total Tax and Invoice Value

          setIGST(igst);
          setCess(cess);
          setCGST(cgst);
          setSGST(sgst);
          setTotalInvoice(arrMarge?.length); // Number of Invoice set
          setTotalInvoiceValue(count); // Invoice Value Set
          setTotalTaxableValue(tValue);
          console.log(arrMarge, "arrMargearrMarge");
          setData(arrMarge);
        } else if (sectionIndex == 4) {
          // ISD

          let arr1 =
            storeNotITC?.ISDInvoice !== null &&
              storeNotITC?.ISDInvoice !== "" &&
              storeNotITC?.ISDInvoice !== undefined &&
              storeNotITC?.ISDInvoice?.length !== 0
              ? storeNotITC?.ISDInvoice
              : [];

          let arr2 =
            storeNotITC?.ISDCreditNote !== null &&
              storeNotITC?.ISDCreditNote !== "" &&
              storeNotITC?.ISDCreditNote !== undefined &&
              storeNotITC?.ISDCreditNote?.length !== 0
              ? storeNotITC?.ISDCreditNote
              : [];

          let arrMarge = [...arr1, ...arr2];
          arrMarge.length
            ? arrMarge?.map((ele, index) => {
              count += parseFloat(ele?.InvoiceValue);
              tValue += parseFloat(ele?.TaxableValue);
              sgst += parseFloat(ele?.SGST);
              cess += parseFloat(ele?.Cess);
              cgst += parseFloat(ele?.CGST);
              igst += parseFloat(ele?.IGST);
            })
            : ""; /// Method tot set the set the CGST, SGST Total Tax and Invoice Value

          setIGST(igst);
          setCess(cess);
          setCGST(cgst);
          setSGST(sgst);
          setTotalInvoice(arrMarge?.length); // Number of Invoice set
          setTotalInvoiceValue(count); // Invoice Value Set
          setTotalTaxableValue(tValue);
          console.log(arrMarge, "arrMargearrMarge");
          setData(arrMarge);
        } else if (sectionIndex == 5) {
          // IMPG

          let arr1 =
            storeNotITC?.IMPG !== null &&
              storeNotITC?.IMPG !== "" &&
              storeNotITC?.IMPG !== undefined &&
              storeNotITC?.IMPG?.length !== 0
              ? storeNotITC?.IMPG
              : [];

          let arr2 =
            storeNotITC?.IMPGA !== null &&
              storeNotITC?.IMPGA !== "" &&
              storeNotITC?.IMPGA !== undefined &&
              storeNotITC?.IMPGA?.length !== 0
              ? storeNotITC?.IMPGA
              : [];

          let arrMarge = [...arr1, ...arr2];
          arrMarge.length
            ? arrMarge?.map((ele, index) => {
              count += parseFloat(ele?.InvoiceValue);
              tValue += parseFloat(ele?.TaxableValue);
              sgst += parseFloat(ele?.SGST);
              cess += parseFloat(ele?.Cess);
              cgst += parseFloat(ele?.CGST);
              igst += parseFloat(ele?.IGST);
            })
            : ""; /// Method tot set the set the CGST, SGST Total Tax and Invoice Value

          setIGST(igst);
          setCess(cess);
          setCGST(cgst);
          setSGST(sgst);
          setTotalInvoice(arrMarge?.length); // Number of Invoice set
          setTotalInvoiceValue(count); // Invoice Value Set
          setTotalTaxableValue(tValue);
          console.log(arrMarge, "arrMargearrMarge");
          setData(arrMarge);
        } else if (sectionIndex == 6) {
          // IMPGSEZ

          let arr1 =
            storeNotITC?.IMPGSEZ !== null &&
              storeNotITC?.IMPGSEZ !== "" &&
              storeNotITC?.IMPGSEZ !== undefined &&
              storeNotITC?.IMPGSEZ?.length !== 0
              ? storeNotITC?.IMPGSEZ
              : [];

          let arr2 =
            storeNotITC?.IMPGSEZA !== null &&
              storeNotITC?.IMPGSEZA !== "" &&
              storeNotITC?.IMPGSEZA !== undefined &&
              storeNotITC?.IMPGSEZA?.length !== 0
              ? storeNotITC?.IMPGSEZA
              : [];

          let arrMarge = [...arr1, ...arr2];
          arrMarge.length
            ? arrMarge?.map((ele, index) => {
              count += parseFloat(ele?.InvoiceValue);
              tValue += parseFloat(ele?.TaxableValue);
              sgst += parseFloat(ele?.SGST);
              cess += parseFloat(ele?.Cess);
              cgst += parseFloat(ele?.CGST);
              igst += parseFloat(ele?.IGST);
            })
            : ""; /// Method tot set the set the CGST, SGST Total Tax and Invoice Value

          setIGST(igst);
          setCess(cess);
          setCGST(cgst);
          setSGST(sgst);
          setTotalInvoice(arrMarge?.length); // Number of Invoice set
          setTotalInvoiceValue(count); // Invoice Value Set
          setTotalTaxableValue(tValue);
          console.log(arrMarge, "arrMargearrMarge");
          setData(arrMarge);
        } else if (sectionIndex == 7) {
          // B2B-CDNRA

          let arr1 =
            storeNotITC?.B2BADebitNoteReverse !== null &&
              storeNotITC?.B2BADebitNoteReverse !== "" &&
              storeNotITC?.B2BADebitNoteReverse !== undefined &&
              storeNotITC?.B2BADebitNoteReverse.length !== 0
              ? storeNotITC?.B2BADebitNoteReverse
              : [];

          let arr2 =
            storeNotITC?.B2BADebitNote !== null &&
              storeNotITC?.B2BADebitNote !== "" &&
              storeNotITC?.B2BADebitNote !== undefined &&
              storeNotITC?.B2BADebitNote?.length !== 0
              ? storeNotITC?.B2BADebitNote
              : [];

          let arr3 =
            storeNotITC?.B2BACreditNote !== null &&
              storeNotITC?.B2BACreditNote !== "" &&
              storeNotITC?.B2BACreditNote !== undefined &&
              storeNotITC?.B2BACreditNote?.length !== 0
              ? storeNotITC?.B2BACreditNote
              : [];

          let arr4 =
            storeNotITC?.B2BACreditNoteReverse !== null &&
              storeNotITC?.B2BACreditNoteReverse !== "" &&
              storeNotITC?.B2BACreditNoteReverse !== undefined &&
              storeNotITC?.B2BACreditNoteReverse?.length !== 0
              ? storeNotITC?.B2BACreditNoteReverse
              : [];

          let arrMarge = [...arr1, ...arr2, ...arr3, ...arr4];
          arrMarge.length
            ? arrMarge?.map((ele, index) => {
              count += parseFloat(ele?.InvoiceValue);
              tValue += parseFloat(ele?.TaxableValue);
              sgst += parseFloat(ele?.SGST);
              cess += parseFloat(ele?.Cess);
              cgst += parseFloat(ele?.CGST);
              igst += parseFloat(ele?.IGST);
            })
            : ""; /// Method tot set the set the CGST, SGST Total Tax and Invoice Value

          setIGST(igst);
          setCess(cess);
          setCGST(cgst);
          setSGST(sgst);
          setTotalInvoice(arrMarge?.length); // Number of Invoice set
          setTotalInvoiceValue(count); // Invoice Value Set
          setTotalTaxableValue(tValue);
          console.log(arrMarge, "arrMargearrMarge");
          setData(arrMarge);
        } else if (sectionIndex == 8) {
          // ISDA
          let arr1 =
            storeNotITC?.ISDACreditNote !== null &&
              storeNotITC?.ISDACreditNote !== "" &&
              storeNotITC?.ISDACreditNote !== undefined &&
              storeNotITC?.ISDACreditNote?.length !== 0
              ? storeNotITC?.ISDACreditNote
              : [];

          let arr2 =
            storeNotITC?.ISDAInvoice !== null &&
              storeNotITC?.ISDAInvoice !== "" &&
              storeNotITC?.ISDAInvoice !== undefined &&
              storeNotITC?.ISDAInvoice?.length !== 0
              ? storeNotITC?.ISDAInvoice
              : [];

          let arrMarge = [...arr1, ...arr2];
          arrMarge.length
            ? arrMarge?.map((ele, index) => {
              count += parseFloat(ele?.InvoiceValue);
              tValue += parseFloat(ele?.TaxableValue);
              sgst += parseFloat(ele?.SGST);
              cess += parseFloat(ele?.Cess);
              cgst += parseFloat(ele?.CGST);
              igst += parseFloat(ele?.IGST);
            })
            : ""; /// Method tot set the set the CGST, SGST Total Tax and Invoice Value

          setIGST(igst);
          setCess(cess);
          setCGST(cgst);
          setSGST(sgst);
          setTotalInvoice(arrMarge?.length); // Number of Invoice set
          setTotalInvoiceValue(count); // Invoice Value Set
          setTotalTaxableValue(tValue);
          console.log(arrMarge, "arrMargearrMarge");
          setData(arrMarge);
        }
      }
    }
  };

  useEffect(() => {
    if (searchDo1) {
      setCurrentCol([]);
      setCurrentCol1();
      setSearchVal1([]);
      gstr2bSummaryData("multiple", sectionType?.value);
    }
  }, [sectionType1]);

  // ** Select From Date
  const selectFromYear = (value) => {
    searchDo = true;
    setSearchDo1(true);
    setFinFormYear(value);
    setFinFormYear1(value);
    setErrorMsg("");
    setMonthFrom(monthFrom?.srNo > value?.srNo ? monthFrom : panDataFrom[0]);
    setMonthFrom1(monthFrom?.srNo > value?.srNo ? monthFrom : panDataFrom[0]);
    const x = panDataFrom?.filter(
      (item) => Number(item.srNo) >= Number(value.srNo)
    );
    setPanData(x);
    sessionStorage.setItem(globleVariable.selectExportFromDt, value?.value);
    const setDt = monthFrom?.srNo > value?.srNo ? monthFrom : panDataFrom[0];
    sessionStorage.setItem(globleVariable.selectExportToDt, setDt?.value);
  };

  //**  Select To Date
  const selectFromMonth = (value) => {
    if (Number(finFromYear?.srNo) > Number(value?.srNo)) {
      const fromFilter = panDataFrom?.filter(
        (item) => Number(item.srNo) == Number(value.srNo)
      )[0];
      setFinFormYear(fromFilter);
      setFinFormYear1(fromFilter);
      sessionStorage.setItem(
        globleVariable.selectExportFromDt,
        fromFilter?.value
      );
      sessionStorage.setItem(
        globleVariable.selectExportToDt,
        fromFilter?.value
      );
    } else {
      sessionStorage.setItem(globleVariable.selectExportToDt, value?.value);
    }

    searchDo = true;
    setSearchDo1(true);
    setErrorMsg("");
    setMonthFrom(value);
    setMonthFrom1(value);
  };

  //** Search
  const gstr2bServices = (
    flags,
    colName,
    orderBy,
    frDate,
    toDate,
    clearBy,
    startWith,
    pageNo,
    pageStartWith
  ) => {
    // console.log(" gstr2bServices called" ,  pageNo,  pageStartWith );
    searchDo = false;
    setServerSidePage(false);
    setSearchDo1(true);
    setDisplayType(false);

    const itcValue =
      itcType?.value !== null &&
        itcType?.value !== "" &&
        itcType?.value !== undefined
        ? itcType.value
        : itcFlag;

    let sectionValue = null;
    if (sectionType?.value !== undefined) {
      sectionValue =
        sectionType?.value !== null &&
          sectionType?.value !== "" &&
          sectionType?.value !== undefined
          ? sectionType.value
          : null;
    } else {
      sectionValue = sectionIds;
    }

    const payload = {
      userClientId: clientId,
      flag: flags, // rowIndex
      isITCAvaliable: itcValue,
      financialYearId: G_FY,
      month: G_FM,
      pageStart:
        pageStartWith !== null &&
          pageStartWith !== "" &&
          pageStartWith !== undefined
          ? pageStartWith
          : currentPage + 1,
      pageSize:
        pageNo !== null && pageNo !== "" && pageNo !== undefined
          ? pageNo
          : rowsPerPage,
      orderByColumnName: colName,
      orderBy: orderBy,
      searchColumnName: clearBy !== "" ? currentCol : [],
      searchValue: clearBy != "" ? searchVal1 : [],
      fromRange: frDate,
      toRange: toDate,
      sectionId: sectionValue,
    };

    setBlock(true);
    Gstr2bService.paginationGSTR2bData(payload)
      .then((res) => {
        setBlock(false);
        // console.log("api calling");
        sessionStorage.setItem(globleVariable.GSTR_2BFrdt, finFromYear?.value);
        sessionStorage.setItem(globleVariable.GSTR_2BTodt, monthFrom?.value);
        //** first response data set
        if (
          res.status === 200 &&
          res.data.status === errorCodeConfig.APIDefaultCode.Success
        ) {
          //  setCount(count + 1);
          //  if (count == 0) {

          setItcEligibility(res?.data?.data?.itcEligibility);
          setReverseCharge(res?.data?.data?.reverseCharge);
          setSectionList(res?.data?.data?.sectionList);
          setSummaryData11(res?.data?.data?.summaryData);
          setRateList(res?.data?.data?.rate);
          setNoteTypeList(res?.data?.data?.noteType);
          setPos(res?.data?.data?.pos);
          setInvoiceType(res?.data?.data?.invoiceType)
          summaryData1 = res?.data?.data?.summaryData;
          const sectionArr = res?.data?.data?.sectionList;
          //filter set
          const defaultSection = sectionArr.filter(
            (item) => item.value == sectionIds
          );

          if (
            defaultSection !== undefined &&
            defaultSection !== null &&
            defaultSection !== ""
          ) {
            setSectionType(defaultSection[0]);
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
    // }
  };

  const summaryData = data;

  const pageCount = Math.ceil(data?.length && data.length / rowsPerPage);

  console.log(data.length, "show total data", summaryData.length);

  const para1 = currentPage * rowsPerPage;
  const para2 = currentPage * rowsPerPage + rowsPerPage;
  let dataITC = data && data.slice(para1, para2);

  console.log("page count -> ", pageCount, summaryData);


  //** Pagination Onclick
  const handlePageClick = (event) => {
    // serverSidePage = true
    setCurrentPage(event?.selected);
    setServerSidePage(true);
  };

  //** Cell mouse down filtering
  function localAfterOnCellMouseDown(event, coords, td) {
    setCurrentCol1(coords?.col);

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
      }, 500);
    } else {
      setTimeout(function () {
        var searchInput = document?.querySelector(
          ".htUIMultipleSelectSearch.htUIInput"
        );
        if (searchInput !== null) {
          searchInput.children[0].value = "";
        }
      }, 500);
    }
  }

  //** Disble filter option
  const theader = (col, TH) => {
    if (gridCustomFilter?.length > 0) {

      let finalObj = {};
      for (let i = 0; i < gridCustomFilter?.length; i++) {
        Object.assign(finalObj, gridCustomFilter[i]);
      }


      handsontableColumns.forEach((ele, index) => {
        const columnIndex = index;
        const buttonExists = document.querySelector(
          `.ht_clone_top thead th:nth-child(${columnIndex + 1}) button`
        );

        const columnMatchesCondition = gridCustomFilter !== null ? Object?.keys(finalObj)?.includes(ele.data) : '';

        // Check if column value is not null
        const columnValueValid =
          finalObj[ele.data] !== null && finalObj[ele.data] !== "";

        if (buttonExists && columnMatchesCondition && columnValueValid) {
          const TH = document.querySelector(
            `.ht_clone_top thead th:nth-child(${columnIndex + 1})`
          );

          if (TH) {
            TH.classList.add("htFiltersActive");
          } else {
            TH.classList.remove("htFiltersActive");
          }
        }
      });
    }

    if (col !== null) {
      if (
        // col === 8 ||
        col === 15 ||
        col === 16 ||
        col === 18 ||
        col === 19 ||
        col === 20 ||
        col === 21 ||
        col === 22
      ) {
        const button = TH?.children[0].children[0];
        button?.parentNode?.removeChild(button);
      }

      if (col <= 3) {
        TH.className = "htLeft";
      }
    }
  };

  // ** Check company selection
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

  //** Export
  const ExportSectionWiseData = () => {
    setBlock(true);
    // setSrcLoadSummary(true);

    Gstr2bService.exportGstr2bExportSectionWiseData(
      GUCParId,
      finFromYear?.value,
      monthFrom?.value,
      sectionType.value,
      subScriptionDetails,
      gstNumber,
      userIds
    )

      .then((res) => {
        console.log("export res=", res?.status, res);

        if (
          res?.status == 200 &&
          res?.data?.status == errorCodeConfig.APIDefaultCode.Success
        ) {
          console.log("res1");
          // setTimeout(() => {
          setBlock(false);
          // setSrcLoadSummary(false);
          downloadURL(res.data.data);

          // }, 1000);
        } else if (res.status == 401) {
          tokenExpiresRedirect();
        } else {
          console.log("res2");
          setBlock(false);
          //  setSrcLoadSummary(false);

          toast.error(res.data.errorMessage, {
            position: "top-right",
          });
        }
      })
      .catch((error) => {
        console.log("res2");
        setBlock(false);
        //  setSrcLoadSummary(false);

        // toast.dismiss();
        console.log(error.message);
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

  //** Dropdown with pagination func - new functionality
  const onPageChangeFunc = (e) => {
    console.log("page chagne", e);
    setPageNoSelect(e);
    setRowsPerPage(e.value);
    setCurrentPage(0);
  };

  // ** Advance Pagination Rows per Page Show
  useEffect(() => {

    const pageUi = showTotalRowPerPage(currentPage, rowsPerPage, data?.length)
    setPaginationUi(pageUi)

  }, [data?.length, currentPage, rowsPerPage])


  //** Clear filter
  const ClearFilter = () => {
    console.log("clear button");
    setCurrentCol([]);
    setCurrentCol1();
    setSearchVal1([]);
    setCurrentPage(0);
    setSearchDate("");
    // setSearchApi(true)
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
    gstr2bSummaryData("multiple", sectionType?.value);
    setFilterDropDownList({
      rateDropDownList: [],
      rcmDropDownList: [],
      noteTypeDropDownList: [],
      invoiceTypeDropDownList: [],
      posDropDownList: [],
      itcDropDownList: []
    });
    setGridCustomFilter([]);
    setRowsPerPage(PageSize);
    setPageNoSelect(paginationList[0]);
    // gstr2bServices(
    //   0,
    //   "",
    //   "asc",
    //   finFromYear?.value,
    //   monthFrom?.value,
    //   "",
    //   0,
    //   "",
    //   1
    // );
  };

  function formatINR(x) {
    return x.toLocaleString("en-IN", { minimumFractionDigits: 2 });
  }
  function formatTotalWithoutDecimal(x) {
    return x.toLocaleString("en-IN");
  }

  // *** with round figer value
  function emptyRender(instance, td, row, col, prop, value, cellProperties) {
    textRenderer.apply(this, arguments);
    if (
      col == 6 ||
      col == 9 ||
      col == 10 ||
      col == 11 ||
      col == 12 ||
      col == 13 ||
      col == 14 ||
      col == 19
    ) {
      let currnecyVal = formatINR(Number(value));

      if (currnecyVal !== 0) {
        td.innerText = currnecyVal;
      }
    }
  }

  function FilterData(arr) {
    let addArr = [];
    var flag = false;
    let updatedData = [];
    let finalObj = {};
    let count = 0;
    let tValue = 0;
    let sgst = 0;
    let cgst = 0;
    let cess = 0;
    let igst = 0;
    console.log(arr, 'partFilter', finalObj)
    // ** date format
    if (arr?.length) {
      for (let i = 0; i < arr.length; i++) {
        Object.assign(finalObj, arr[i]);
      }
    }

    const mapArrRate = arr?.map(type => Number(type?.Rate))
    const mapArrRCM = arr?.map(type => type?.SupplyAttractReverse)
    const mapArrNote = arr?.map(type => type?.NoteType)
    const mapArrInvoiceType = arr?.map(type => type?.InvoiceType)
    const mapArrpos = arr?.map(type => type?.PlaceOfSupply)
    const mapArrItc = arr?.map(type => type?.ITCAvaliable)

    updatedData = stateDataFilter("multiple")
      .filter((itemGSTIN) =>
        finalObj.SupplierGSTIN?.length
          ? itemGSTIN?.SupplierGSTIN?.toString()
            .toLowerCase()
            .includes(finalObj?.SupplierGSTIN?.toLowerCase())
          : itemGSTIN
      )
      .filter((itemTradeName) =>
        finalObj.SupplierTradeName?.length
          ? itemTradeName?.SupplierTradeName?.toString()
            .toLowerCase()
            .includes(finalObj?.SupplierTradeName?.toString().toLowerCase())
          : itemTradeName
      )
      .filter((itemInvoiceNo) =>
        finalObj.InvoiceNo?.length
          ? itemInvoiceNo?.InvoiceNo?.toString()
            .toLowerCase()
            .includes(finalObj?.InvoiceNo?.toString().toLowerCase())
          : itemInvoiceNo
      )
      .filter((itemInvoiceType) =>
        finalObj.InvoiceType?.length ?
          mapArrInvoiceType?.includes(itemInvoiceType['InvoiceType'])
          : itemInvoiceType
      )
      .filter((itemNoteType) =>
        finalObj.NoteType?.length ?
          mapArrNote?.includes(itemNoteType['NoteType']) : itemNoteType
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
      .filter((itemInvoiceValue) => {
        if (finalObj?.InvoiceValue?.length) {
          const [a, b] = finalObj?.InvoiceValue?.split("to");
          const fromValue = parseFloat(a.trim());
          const toValue = parseFloat(b.trim());
          const invoiceValue = parseFloat(itemInvoiceValue?.InvoiceValue);

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
      .filter((itemPlaceOfSupply) =>
        finalObj.PlaceOfSupply?.length ?
          mapArrpos?.includes(itemPlaceOfSupply['PlaceOfSupply']) : itemPlaceOfSupply
      )

      .filter((itemSupplyAttractReverse) =>
        finalObj.SupplyAttractReverse?.length ?
          mapArrRCM?.includes(itemSupplyAttractReverse['SupplyAttractReverse']) : itemSupplyAttractReverse
      )
      .filter((itemRate) =>

        finalObj.Rate?.length ?
          mapArrRate?.includes(Number(itemRate['Rate'])) : itemRate
      )

      .filter((itemTaxableValue) => {
        if (finalObj?.TaxableValue?.length) {
          const [a, b] = finalObj?.TaxableValue?.split("to");
          const fromValue = parseFloat(a.trim());
          const toValue = parseFloat(b.trim());
          const invoiceValue = parseFloat(itemTaxableValue?.TaxableValue);

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
      .filter((itemIGST) => {
        if (finalObj?.IGST?.length) {
          const [a, b] = finalObj?.IGST?.split("to");
          const fromValue = parseFloat(a.trim());
          const toValue = parseFloat(b.trim());
          const invoiceValue = parseFloat(itemIGST?.IGST);

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
      .filter((itemCGST) => {
        if (finalObj?.CGST?.length) {
          const [a, b] = finalObj?.CGST?.split("to");
          const fromValue = parseFloat(a.trim());
          const toValue = parseFloat(b.trim());
          const invoiceValue = parseFloat(itemCGST?.CGST);

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
      .filter((itemSGST) => {
        if (finalObj?.SGST?.length) {
          const [a, b] = finalObj?.SGST?.split("to");
          const fromValue = parseFloat(a.trim());
          const toValue = parseFloat(b.trim());
          const invoiceValue = parseFloat(itemSGST?.SGST);
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
      .filter((itemCess) => {
        if (finalObj?.Cess?.length) {
          const [a, b] = finalObj?.Cess?.split("to");
          const fromValue = parseFloat(a.trim());
          const toValue = parseFloat(b.trim());
          const invoiceValue = parseFloat(itemCess?.Cess);

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
      .filter((itemITCAvaliable) =>
        finalObj.ITCAvaliable?.length ?
          mapArrItc?.includes(itemITCAvaliable['ITCAvaliable']) : itemITCAvaliable
      );

    flag = true;
    addArr.push(...updatedData);
    setCurrentPage(0);
    let uniq = [...new Set(addArr)];
    console.log(uniq, "uniqqqq");
    setTotalInvoice(uniq.length);
    uniq.length
      ? uniq?.map((ele, index) => {
        count += parseFloat(ele?.InvoiceValue);
        tValue += parseFloat(ele?.TaxableValue);
        sgst += parseFloat(ele?.SGST);
        cess += parseFloat(ele?.Cess);
        cgst += parseFloat(ele?.CGST);
        igst += parseFloat(ele?.IGST);
      })
      : "";
    setIGST(igst);
    setCess(cess);
    setCGST(cgst);
    setSGST(sgst);
    // setTotalInvoice(arrMarge?.length);  // Number of Invoice set
    setTotalInvoiceValue(count); // Invoice Value Set
    setTotalTaxableValue(tValue);

    return uniq;
  }

  const onClickDeleteReportData = () => {
    const payload = {
      "userClientId": GUCParId,
      "userId": userIds,
      "fromRange": finFromYear?.value,
      "toRange": monthFrom?.value,
      "gstNumber": GGSTIN,
      "module": "GSTR2B"
    }
    commonService.deleteReportData(payload)
      .then((res) => {
        console.log(res,"resss")
        if (res?.status == 200 && res?.data?.status == errorCodeConfig.APIDefaultCode.Success) {
          setBlock(false);
          // navigate("/gst-returns/gstr2b-summary",{state:{refreshAPI:true}})
          sessionStorage.setItem("setRefreshAPIReportDataDeletGSTR2B",true)
          navigate("/gst-returns/gstr2b-summary")
        } 
        else {
          setBlock(false);
          toast.error(res.data.errorMessage, {
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

  useEffect(() => {
    if(dataITC?.length > 0){
      setBtnDisable(false)
    }else{
      setBtnDisable(true)
    }
  },[dataITC])


  return (
    <Fragment>
      {block && <div className="loading1">Loading&#8230;</div>}
      <div className="content-header row py-1">
        <div className="content-header-left col-md-6 col-12">
          <div className="row breadcrumbs-top mb-0">
            <div className="col-12">
              <Breadcrumbs
                title={title}
                data={[
                  { title: "GST Returns",link: urlEndpointConfig.GSTR_All},
                  {
                    title: "GSTR 2B Summary",
                    link: "/gst-returns/gstr2b-summary",
                  },
                  { title: title },
                ]}
              />
            </div>
          </div>
        </div>
        <div className="content-header-right text-md-end col-md-6 col-12 d-md-block d-none">
        <Button
              type="button"
              className="me-1 btn-sm float-end"
              outline
              id="back"
              onClick={() => navigate("/gst-returns/gstr2b-summary")}
              color="danger"
            >
              <ChevronLeft size={18} /> Back To Summary

            </Button>
          <Button
            type="button"
            className="me-1"
            outline
            color="danger"
            onClick={onClickDeleteReportData}
            disabled={btnDisable}
            id="refreshName"
          >
            {/* <i className="fa fa-filter fa-lg"></i> */}
            <span className="align-middle ms-50">Get Party Name</span>
            <UncontrolledTooltip placement="top" target="refreshName">
            Get Party Name
            </UncontrolledTooltip>
          </Button>

          <Button
            type="button"
            className="me-1"
            outline
            onClick={ExportSectionWiseData}
            color="danger"
            disabled={btnDisable}
            id="SalesExp"
          >
            <i className="fa fa-file-excel-o"></i>
            <span className="align-middle ms-50">Export</span>
            <UncontrolledTooltip placement="top" target="SalesExp">
              Export [{keysMap.EXPORT_DATA}]
            </UncontrolledTooltip>
          </Button>

          <Button
            type="button"
            className="me-1"
            outline
            color="danger"
            onClick={ClearFilter}
            id="clr2b"
          >
            <i className="fa fa-filter fa-lg"></i>
            <span className="align-middle ms-50">Clear</span>
            <UncontrolledTooltip placement="top" target="clr2b">
              Clear [{keysMap.CLEAR_DATA}]
            </UncontrolledTooltip>
          </Button>
        </div>
      </div>
      <Card>
        <CardBody className="summary-main-panel">
          <Row>
            <Col md={8}>
              <table className="table table-bordered summary-table">
                <tbody>
                  <tr>
                    <td>
                      <p className="mb-0">
                        Invoices <br />
                        {console.log(totalInvoice, "totalIvloceiee")}
                        <span>
                          {" "}
                          {/* {summaryData1?.totalInvoice
                            ? summaryData1?.totalInvoice
                            : 0} */}
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
                          {/* {summaryData1?.totalInvoiceValue
                            ? summaryData1?.totalInvoiceValue
                            : 0} */}
                          {totalInvoiceValue
                            ? formatINR(Number(totalInvoiceValue))
                            : 0}
                        </span>
                      </p>
                    </td>
                    <td>
                      <p className="mb-0">
                        Taxable Values (₹) <br />
                        <span>
                          {/* {summaryData1?.totalTaxableValue
                            ? summaryData1?.totalTaxableValue
                            : 0} */}
                          {totalTaxableValue
                            ? formatINR(Number(totalTaxableValue))
                            : 0}
                        </span>
                      </p>
                    </td>
                    <td>
                      <p className="mb-0">
                        IGST (₹) <br />
                        <span>
                          {" "}
                          {/* {summaryData1?.totalIGST
                            ? summaryData1?.totalIGST
                            : 0} */}
                          {IGST ? formatINR(Number(IGST)) : 0}
                        </span>
                      </p>
                    </td>
                    <td>
                      <p className="mb-0">
                        SGST (₹) <br />
                        <span>
                          {" "}
                          {/* {summaryData1?.totalSGST
                            ? summaryData1?.totalSGST
                            : 0} */}
                          {SGST ? formatINR(Number(SGST)) : 0}
                        </span>
                      </p>
                    </td>
                    <td>
                      <p className="mb-0">
                        CGST (₹) <br />
                        <span> {CGST ? formatINR(Number(CGST)) : 0}</span>
                      </p>
                    </td>
                    <td>
                      <p className="mb-0">
                        Cess (₹)<br></br>
                        <span>{Cess ? formatINR(Number(Cess)) : 0}</span>
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Col>
            <Col md={4}>
              <Row>
                <Col md={4}>
                  <Label className="form-label form-label">Sections</Label>
                  <Select
                    id="sectionList"
                    placeholder="Section List"
                    isClearable={false}
                    theme={selectThemeColors}
                    closeMenuOnSelect={true}
                    options={sectionList}
                    components={animatedComponents}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    value={sectionType}
                    onChange={(value) => {
                      searchDo = true;
                      setSearchDo1(true);
                      setSectionType(value);
                      setSectionType1(value);
                      setSelectionType("multi");
                      setFilterDropDownList({
                        rateDropDownList: [],
                        rcmDropDownList: [],
                        noteTypeDropDownList: [],
                        invoiceTypeDropDownList: [],
                        posDropDownList: [],
                        itcDropDownList: []
                      });
                      setGridCustomFilter([]);
                      setRowsPerPage(PageSize);
                      setPageNoSelect(paginationList[0]);
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

                    }}
                  />
                </Col>
                <Col md={4}>
                  <Label className="form-label form-label">From</Label>
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
                    maxMenuHeight="150px"
                    isDisabled={true}
                  />
                </Col>

                <Col md={4}>
                  <Label className="form-label form-label">To</Label>
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
                    maxMenuHeight="150px"
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
            <Col md={12}>
              <div>
                {/* {data?.length > 0 ? ( */}
                <HotTable
                  autoColumnSize={{
                    samplingRatio: 23, // Adjust the samplingRatio as needed
                  }}
                  columnHeaderHeight={columnHeaderSize}
                  rowHeights={RowSize}
                  fillHandle={false}
                  viewportColumnRenderingOffset={200}
                  // autoColumnSize={true}
                  stretchH="all"
                  data={dataITC.length > 0 ? dataITC : [{ SupplierGSTIN: "No Data Found!" }]}
                  // data={summaryData}
                  preventOverflow="horizontal"
                  columnSorting={false}
                  columns={handsontableColumns}
                  bindRowsWithHeaders={true}
                  licenseKey="non-commercial-and-evaluation"
                  height="auto"
                  ref={hotRef}
                  // afterColumnSort={ServerSideSorting}
                  mergeCells={dataITC.length > 0 ? false : [{ row: 0, col: 0, rowspan: 1, colspan: 12 }]}
                  filters={true}
                  dropdownMenu={{
                    items: {
                      filter_by_value: {
                        name: "Search Value",
                        // hide the 'Filter by value' list from all columns but the first one
                        hidden() {
                          const hot = hotRef?.current?.hotInstance;
                          const selectedValue = this.getSelected()[0][1];
                          const isValidColumn = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 17].includes(selectedValue);

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
                          const isHiddenCol = ![3, 4, 7, 8, 9, 17].includes(selectedCol);

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
                            )}  class='custom-date col-md-11' placeholder='DD-MM-YYYY' id='custom2' name='date' value=${toDate ? toDate : searchDate} >
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
                        name: `<div style="margin-top:10px">Min Value <br><input type='text' class='custom-date col-md-11' placeholder='Min Amount' id='amount1' name='amount1' value=${fromAmount} > <br/> 
                            
                            Max Value <br> <input type='text' class='custom-date col-md-11' placeholder='Max Amount' id='amount2' name='amount2' value=${toAmount}>
                            </div>`,
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
                          document.addEventListener('input', function(event) {
                            if (event.target.id === 'amount1' || event.target.id === 'amount2') {
                              event.target.value = event.target.value.replace(/[^0-9,\.,\-]/g, '');
                            }
                          });
                        },
                        
                      },

                      option7: {
                        name: `<div style="margin-top:10px">Min Value <br><input type='text' class='custom-date col-md-11' placeholder='Min Amount' id='amount1' name='amount1' value=${fromAmountTaxable} > <br/> 
                            
                            Max Value <br> <input type='text' class='custom-date col-md-11' placeholder='Max Amount' id='amount2' name='amount2' value=${toAmountTaxable}>
                            </div>`,
                        hidden() {
                          return this.getSelectedRangeLast().to.col != 10;
                        },

                        //disabled: true,
                        callback: function (key, selection, clickEvent) {

                          console.log("date picker clicked");
                          var src = clickEvent.target;

                          if (src.tagName === "INPUT") {
                            clickEvent.stopImmediatePropagation();
                          }

                          clickEvent.stopImmediatePropagation();
                          document.addEventListener('input', function(event) {
                            if (event.target.id === 'amount1' || event.target.id === 'amount2') {
                              event.target.value = event.target.value.replace(/[^0-9,\.,\-]/g, '');
                            }
                          });
                        },
                        
                      },

                      option8: {
                        name: `<div style="margin-top:10px">Min Value <br><input type='text' class='custom-date col-md-11' placeholder='Min Amount' id='amount1' autocomplete="off" name='amount1' value=${fromAmountIGST} > <br/> 
                            
                            Max Value <br> <input type='text' class='custom-date col-md-11' placeholder='Max Amount' autocomplete="off" id='amount2' name='amount2' value=${toAmountIGST}>
                            </div>`,
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
                          document.addEventListener('input', function(event) {
                            if (event.target.id === 'amount1' || event.target.id === 'amount2') {
                              event.target.value = event.target.value.replace(/[^0-9,\.,\-]/g, '');
                            }
                          });
                        },
                      },

                      option9: {
                        name: `<div style="margin-top:10px">Min Value <br><input type='text' class='custom-date col-md-11' placeholder='Min Amount' id='amount1' name='amount1' value=${fromAmountCGST} > <br/> 
                            
                            Max Value <br> <input type='text' class='custom-date col-md-11' placeholder='Max Amount' id='amount2' name='amount2' value=${toAmountCGST}>
                            </div>`,
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
                          document.addEventListener('input', function(event) {
                            if (event.target.id === 'amount1' || event.target.id === 'amount2') {
                              event.target.value = event.target.value.replace(/[^0-9,\.,\-]/g, '');
                            }
                          });
                        },
                      },

                      option10: {
                        name: `<div style="margin-top:10px">Min Value <br><input type='text' class='custom-date col-md-11' placeholder='Min Amount' id='amount1' name='amount1' value=${fromAmountSGST} > <br/> 
                            
                            Max Value <br> <input type='text' class='custom-date col-md-11' placeholder='Max Amount' id='amount2' name='amount2' value=${toAmountSGST}>
                            </div>`,
                        hidden() {
                          return this.getSelectedRangeLast().to.col != 13;
                        },

                        //disabled: true,
                        callback: function (key, selection, clickEvent) {

                          console.log("date picker clicked");
                          var src = clickEvent.target;

                          if (src.tagName === "INPUT") {
                            clickEvent.stopImmediatePropagation();
                          }

                          clickEvent.stopImmediatePropagation();
                          document.addEventListener('input', function(event) {
                            if (event.target.id === 'amount1' || event.target.id === 'amount2') {
                              event.target.value = event.target.value.replace(/[^0-9,\.,\-]/g, '');
                            }
                          });
                        },
                      },

                      option11: {
                        name: `<div style="margin-top:10px">Min Value <br><input type='text' class='custom-date col-md-11' placeholder='Min Amount' id='amount1' name='amount1' value=${fromAmountCESS} > <br/> 
                            
                            Max Value <br> <input type='text' class='custom-date col-md-11' placeholder='Max Amount' id='amount2' name='amount2' value=${toAmountCESS}>
                            </div>`,
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
                          document.addEventListener('input', function(event) {
                            if (event.target.id === 'amount1' || event.target.id === 'amount2') {
                              event.target.value = event.target.value.replace(/[^0-9,\.,\-]/g, '');
                            }
                          });
                        },
                      },

                      clear: {
                        name: `<button id='btnClear'  name='Clear' tabIndex="-1"   value='Clear'>Clear</button>`,
                        // name: `<button id='btnClear' style="margin-top: ${this.getSelected()[0][1] == 5 ? '22px' : ''}" name='Clear' tabIndex="-1" value='Clear'>Clear</button>`,
                        // disabled: true,
                        callback: function (key, selection, clickEvent) {

                          var src = clickEvent.target;

                          if (src?.tagName?.toLowerCase() === "button") {
                            if (clickEvent.target.id == "btnClear") {
                              const hot = hotRef?.current?.hotInstance;
                              const selectedValue = hot?.getSelected()[0][1];
                              const isValidTextColumn = [3, 5, 6, 4, 7, 8, 9, 10, 11, 12, 13, 14, 17].includes(selectedValue);
                              const isValidCheckBoxColumn = [3, 5, 6, 4, 7, 8, 9, 10, 11, 12, 13, 14, 17].includes(selectedValue);

                              if (!isValidTextColumn) {

                                var value = "";
                                var columnName = handsontableColumns[currentCol1]?.data;
                                let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                let x = searchVal1

                                filterObject.push({ [columnName]: value });
                                if (!searchVal1?.length) {
                                  x?.push(value);
                                  let y = currentCol;
                                  y?.push(
                                    handsontableColumns[currentCol1]?.data
                                  );
                                  // console.log("jsx=",x,y)
                                  setSearchVal1(x);
                                  setCurrentCol(y);
                                } else {
                                  const Index = currentCol?.findIndex(
                                    (item) =>
                                      handsontableColumns[currentCol1]?.data ==
                                      item
                                  );
                                  if (Index != -1) {
                                    const xyz = searchVal1;
                                    xyz[Index] = value;
                                    setSearchVal1(xyz);
                                  } else {
                                    x?.push(value);
                                    let y = currentCol;
                                    y?.push(
                                      handsontableColumns[currentCol1]?.data
                                    );
                                    setSearchVal1(x);
                                    setCurrentCol(y);
                                  }
                                }
                                // setSearchVal1(x);
                                // let y = currentCol;
                                // y.push(handsontableColumns[currentCol1]?.data);
                                // setCurrentCol(y)

                                setGridCustomFilter(filterObject)
                                let newFilterData = FilterData(filterObject);
                                setData([...newFilterData]);

                              }
                              else if (hot?.getSelected()[0][1] == 5) {

                                var columnName = handsontableColumns[currentCol1]?.data;
                                var value = '';
                                setSearchDate('');
                                setToDate('');
                                let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                                filterObject.push({ [columnName]: value });
                                setGridCustomFilter(filterObject)
                                let newFilterData = FilterData(filterObject);
                                setData([...newFilterData]);

                              }
                              else if (hot?.getSelected()[0][1] == 6) {

                                var columnName = handsontableColumns[currentCol1]?.data;
                                var value = '';
                                setFromAmount('');
                                setToAmount('');

                                let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                                filterObject.push({ [columnName]: value });
                                setGridCustomFilter(filterObject)
                                let newFilterData = FilterData(filterObject);
                                setData([...newFilterData]);

                              }
                              else if (hot?.getSelected()[0][1] == 10) {

                                var columnName = handsontableColumns[currentCol1]?.data;
                                var value = '';
                                setFromAmountTaxable('');
                                setToAmountTaxable('');

                                let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                                filterObject.push({ [columnName]: value });
                                setGridCustomFilter(filterObject)
                                let newFilterData = FilterData(filterObject);
                                setData([...newFilterData]);

                              }
                              else if (hot?.getSelected()[0][1] == 11) {

                                var columnName = handsontableColumns[currentCol1]?.data;
                                var value = '';
                                setFromAmountIGST('');
                                setToAmountIGST('');

                                let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                                filterObject.push({ [columnName]: value });
                                setGridCustomFilter(filterObject)
                                let newFilterData = FilterData(filterObject);
                                setData([...newFilterData]);

                              }
                              else if (hot?.getSelected()[0][1] == 12) {

                                var columnName = handsontableColumns[currentCol1]?.data;
                                var value = '';
                                setFromAmountCGST('');
                                setToAmountCGST('');

                                let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                                filterObject.push({ [columnName]: value });
                                setGridCustomFilter(filterObject)
                                let newFilterData = FilterData(filterObject);
                                setData([...newFilterData]);

                              }
                              else if (hot?.getSelected()[0][1] == 13) {

                                var columnName = handsontableColumns[currentCol1]?.data;
                                var value = '';
                                setFromAmountSGST('');
                                setToAmountSGST('');

                                let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                                filterObject.push({ [columnName]: value });
                                setGridCustomFilter(filterObject)
                                let newFilterData = FilterData(filterObject);
                                setData([...newFilterData]);

                              }
                              else if (hot?.getSelected()[0][1] == 14) {

                                var columnName = handsontableColumns[currentCol1]?.data;
                                var value = '';
                                setFromAmountCESS('');
                                setToAmountCESS('');

                                let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                                filterObject.push({ [columnName]: value });
                                setGridCustomFilter(filterObject)
                                let newFilterData = FilterData(filterObject);
                                setData([...newFilterData]);

                              }
                              else if (isValidCheckBoxColumn) {

                                var checkboxes = document.getElementsByClassName('checkBoxClass');

                                arrChk = []
                                setFilterDropDownList([]);
                                var columnName = handsontableColumns[currentCol1]?.data;
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
                                  const { Rate, SupplyAttractReverse, NoteType, InvoiceType, PlaceOfSupply, ITCAvaliable } = item;

                                  const updateList = (list, value) => {
                                    return list.includes(value) ? list : [...list, value];
                                  };

                                  if (Rate !== undefined) {
                                    acc.rateDropDownList = updateList(acc.rateDropDownList, Rate);
                                  } else if (SupplyAttractReverse !== undefined) {
                                    acc.rcmDropDownList = updateList(acc.rcmDropDownList, SupplyAttractReverse);
                                  } else if (NoteType !== undefined) {
                                    acc.noteTypeDropDownList = updateList(acc.noteTypeDropDownList, NoteType);
                                  } else if (InvoiceType !== undefined) {
                                    acc.invoiceTypeDropDownList = updateList(acc.invoiceTypeDropDownList, InvoiceType);
                                  } else if (PlaceOfSupply !== undefined) {
                                    acc.posDropDownList = updateList(acc.posDropDownList, PlaceOfSupply);
                                  } else if (ITCAvaliable !== undefined) {
                                    acc.itcDropDownList = updateList(acc.itcDropDownList, ITCAvaliable);
                                  }

                                  return acc;
                                }, { rateDropDownList: [], rcmDropDownList: [], noteTypeDropDownList: [], invoiceTypeDropDownList: [], posDropDownList: [], itcDropDownList: [] });

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
                      rcmDropDownList,
                      noteTypeDropDownList,
                      invoiceTypeDropDownList,
                      posDropDownList,
                      itcDropDownList
                    } = filterDropDownList;

                    const listsToCheck = [
                      rateDropDownList,
                      rcmDropDownList,
                      noteTypeDropDownList,
                      invoiceTypeDropDownList,
                      posDropDownList,
                      itcDropDownList
                    ];

                    for (var j = 0; j < checkboxes.length; j++) {
                      for (var k = 0; k < listsToCheck.length; k++) {
                        if (listsToCheck[k]) {
                          // For rcmDropDownList, check both conditions listsToCheck[k][i] == checkboxes[j].value and checkboxes?.length == 2
                          if (k === 1 && checkboxes.length === 2) {

                            for (var i = 0; i < listsToCheck[k].length; i++) {
                              if (listsToCheck[k][i] == checkboxes[j].value) {
                                $(checkboxes[j]).prop("checked", true);
                                break;
                              }
                            }
                          } else if (k === 5 && checkboxes.length === 3) {

                            for (var i = 0; i < listsToCheck[k].length; i++) {
                              if (listsToCheck[k][i] == checkboxes[j].value) {
                                $(checkboxes[j]).prop("checked", true);
                                break;
                              }
                            }
                          }
                          else {

                            for (var i = 0; i < listsToCheck[k].length; i++) {
                              if (listsToCheck[k][i] == checkboxes[j].value && k !== 5 && k !== 1) {
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
                    const shouldExcludeTextBox = [3, 5, 6, 4, 7, 8, 9, 10, 11, 12, 13, 14, 17].includes(selectedValuecol);
                    const shouldExcludeCheckBox = [3, 4, 7, 8, 9, 17].includes(selectedValuecol);

                    if (hot?.getSelected()[0][1] != 3 && hot?.getSelected()[0][1] != 5 && hot?.getSelected()[0][1] != 6 && hot?.getSelected()[0][1] != 4 && hot?.getSelected()[0][1] != 7 && hot?.getSelected()[0][1] != 8 && hot?.getSelected()[0][1] != 9 && hot?.getSelected()[0][1] != 10 && hot?.getSelected()[0][1] != 11 && hot?.getSelected()[0][1] != 12 && hot?.getSelected()[0][1] != 13 && hot?.getSelected()[0][1] != 14 && hot?.getSelected()[0][1] != 17) {
                      let x = searchVal1
                      var searchInput = document.querySelector(".htUIMultipleSelectSearch.htUIInput");
                      var value = searchInput?.children[0].value;
                      //  x.push(value)
                      var columnName = handsontableColumns[currentCol1]?.data;
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
                          handsontableColumns[currentCol1]?.data
                        );
                        // console.log("jsx=",x,y)
                        setSearchVal1(x);
                        setCurrentCol(y);
                      } else {

                        const Index = currentCol?.findIndex(
                          (item) =>
                            handsontableColumns[currentCol1]?.data ==
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
                            handsontableColumns[currentCol1]?.data
                          );
                          setSearchVal1(x);
                          setCurrentCol(y);
                        }
                      }

                      setGridCustomFilter(filterObject)
                      let newFilterData = FilterData(filterObject);
                      setData([...newFilterData]);

                    }
                    else if (selectedValuecol == 5) {

                      var searchInput1 = document.getElementById("custom1");
                      var searchInput2 = document.getElementById("custom2");
                      const invFromDate = searchInput1?.value
                      const invToDate = searchInput2?.value
                      var columnName = handsontableColumns[currentCol1]?.data;
                      var value = (searchInput1?.value || searchInput2?.value) && `${invFromDate ? invFromDate : invToDate}to${invToDate ? invToDate : invFromDate}`;
                      // var value =`${invFromDate}to${invToDate}`;
                      setSearchDate(searchInput1?.value);
                      setToDate(searchInput2?.value);
                      let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                      filterObject.push({ [columnName]: value });
                      setGridCustomFilter(filterObject)
                      let newFilterData = FilterData(filterObject);
                      setData([...newFilterData]);

                    }

                    else if (hot?.getSelected()[0][1] == 6) {

                      var searchInput1 = document.getElementById("amount1");
                      var searchInput2 = document.getElementById("amount2");
                      const invFromDate = (searchInput1?.value)?.replaceAll(",", "")
                      const invToDate = (searchInput2?.value)?.replaceAll(",", "")
                      var columnName = handsontableColumns[currentCol1]?.data;
                      // var value = (searchInput1?.value || searchInput2?.value) && `${invFromDate ? invFromDate : invToDate}to${invToDate ? invToDate : invFromDate}`;
                      var value = `${invFromDate}to${invToDate}`;
                      setFromAmount(searchInput1?.value);
                      setToAmount(searchInput2?.value);
                      let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                      filterObject.push({ [columnName]: value });
                      setGridCustomFilter(filterObject)
                      let newFilterData = FilterData(filterObject);
                      setData([...newFilterData]);

                    }

                    else if (hot?.getSelected()[0][1] == 10) {

                      var searchInput1 = document.getElementById("amount1");
                      var searchInput2 = document.getElementById("amount2");
                      const invFromDate = (searchInput1?.value)?.replaceAll(",", "")
                      const invToDate = (searchInput2?.value)?.replaceAll(",", "")
                      var columnName = handsontableColumns[currentCol1]?.data;
                      // var value = (searchInput1?.value || searchInput2?.value) && `${invFromDate ? invFromDate : invToDate}to${invToDate ? invToDate : invFromDate}`;
                      var value = `${invFromDate}to${invToDate}`;
                      setFromAmountTaxable(searchInput1?.value);
                      setToAmountTaxable(searchInput2?.value);
                      let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                      filterObject.push({ [columnName]: value });
                      setGridCustomFilter(filterObject)
                      let newFilterData = FilterData(filterObject);
                      setData([...newFilterData]);

                    }

                    else if (hot?.getSelected()[0][1] == 11) {

                      var searchInput1 = document.getElementById("amount1");
                      var searchInput2 = document.getElementById("amount2");
                      const fromAmount = (searchInput1?.value)?.replaceAll(",", "")
                      const toAmount = (searchInput2?.value)?.replaceAll(",", "")
                      var columnName = handsontableColumns[currentCol1]?.data;
                      // var value = (searchInput1?.value || searchInput2?.value) && `${fromAmount ? fromAmount : toAmount}to${toAmount ? toAmount : fromAmount}`;
                      var value = `${fromAmount}to${toAmount}`;
                      setFromAmountIGST(searchInput1?.value);
                      setToAmountIGST(searchInput2?.value);
                      let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                      filterObject.push({ [columnName]: value });
                      setGridCustomFilter(filterObject)
                      let newFilterData = FilterData(filterObject);
                      setData([...newFilterData]);

                    }

                    else if (hot?.getSelected()[0][1] == 12) {

                      var searchInput1 = document.getElementById("amount1");
                      var searchInput2 = document.getElementById("amount2");
                      const fromAmount = (searchInput1?.value)?.replaceAll(",", "")
                      const toAmount = (searchInput2?.value)?.replaceAll(",", "")
                      var columnName = handsontableColumns[currentCol1]?.data;
                      var value = `${fromAmount}to${toAmount}`;
                      setFromAmountCGST(searchInput1?.value);
                      setToAmountCGST(searchInput2?.value);
                      let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                      filterObject.push({ [columnName]: value });
                      setGridCustomFilter(filterObject)
                      let newFilterData = FilterData(filterObject);
                      setData([...newFilterData]);

                    }

                    else if (hot?.getSelected()[0][1] == 13) {

                      var searchInput1 = document.getElementById("amount1");
                      var searchInput2 = document.getElementById("amount2");
                      const fromAmount = (searchInput1?.value)?.replaceAll(",", "")
                      const toAmount = (searchInput2?.value)?.replaceAll(",", "")
                      var columnName = handsontableColumns[currentCol1]?.data;
                      // var value = (searchInput1?.value || searchInput2?.value) && `${fromAmount ? fromAmount : toAmount}to${toAmount ? toAmount : fromAmount}`;
                      var value = `${fromAmount}to${toAmount}`;
                      setFromAmountSGST(searchInput1?.value);
                      setToAmountSGST(searchInput2?.value);
                      let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                      filterObject.push({ [columnName]: value });
                      setGridCustomFilter(filterObject)
                      let newFilterData = FilterData(filterObject);
                      setData([...newFilterData]);

                    }

                    else if (hot?.getSelected()[0][1] == 14) {

                      var searchInput1 = document.getElementById("amount1");
                      var searchInput2 = document.getElementById("amount2");
                      const fromAmount = (searchInput1?.value)?.replaceAll(",", "")
                      const toAmount = (searchInput2?.value)?.replaceAll(",", "")
                      var columnName = handsontableColumns[currentCol1]?.data;
                      var value = `${fromAmount}to${toAmount}`;
                      setFromAmountCESS(searchInput1?.value);
                      setToAmountCESS(searchInput2?.value);
                      let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                      filterObject.push({ [columnName]: value });
                      setGridCustomFilter(filterObject)
                      let newFilterData = FilterData(filterObject);
                      setData([...newFilterData]);

                    }

                    else if (shouldExcludeCheckBox) {

                      var checkboxes = document.getElementsByClassName('checkBoxClass');
                      arrChk = []
                      setFilterDropDownList([]);
                      var columnName = handsontableColumns[currentCol1]?.data;
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
                        const { Rate, SupplyAttractReverse, NoteType, InvoiceType, PlaceOfSupply, ITCAvaliable } = item;

                        const updateList = (list, value) => {
                          return list.includes(value) ? list : [...list, value];
                        };

                        if (Rate !== undefined) {
                          acc.rateDropDownList = updateList(acc.rateDropDownList, Rate);
                        } else if (SupplyAttractReverse !== undefined) {
                          acc.rcmDropDownList = updateList(acc.rcmDropDownList, SupplyAttractReverse);
                        } else if (NoteType !== undefined) {
                          acc.noteTypeDropDownList = updateList(acc.noteTypeDropDownList, NoteType);
                        } else if (InvoiceType !== undefined) {
                          acc.invoiceTypeDropDownList = updateList(acc.invoiceTypeDropDownList, InvoiceType);
                        } else if (PlaceOfSupply !== undefined) {
                          acc.posDropDownList = updateList(acc.posDropDownList, PlaceOfSupply);
                        } else if (ITCAvaliable !== undefined) {
                          acc.itcDropDownList = updateList(acc.itcDropDownList, ITCAvaliable);
                        }

                        return acc;
                      }, { rateDropDownList: [], rcmDropDownList: [], noteTypeDropDownList: [], invoiceTypeDropDownList: [], posDropDownList: [], itcDropDownList: [] });

                      setFilterDropDownList(updatedFilterDropDownList);

                    }
                  }
                  }
                  afterGetColHeader={theader}
                  afterOnCellMouseDown={localAfterOnCellMouseDown}
                  cells={function (row, col) {
                    var cp = {};
                    const hot = hotRef?.current?.hotInstance;

                    if (dataITC?.length <= 0) {
                      if (col == 0) {
                        cp.className = "text-center";
                      }
                    }
                    if (col !== null && dataITC.length > 0) {
                      cp.renderer = emptyRender;
                    }

                    if (col == 6) {
                      const invoiceValue =
                        hot?.getSourceDataAtRow(row)?.InvoiceValue;
                      if (
                        invoiceValue !== null &&
                        invoiceValue !== "null" &&
                        invoiceValue !== undefined
                      ) {
                        cp.className = "text-end";
                      }
                    }
                    if (col == 9) {
                      const rate = hot?.getSourceDataAtRow(row)?.Rate;
                      if (
                        rate !== null &&
                        rate !== "null" &&
                        rate !== undefined
                      ) {
                        cp.className = "text-end";
                      }
                    }
                    if (col == 10) {
                      const taxableValue =
                        hot?.getSourceDataAtRow(row)?.TaxableValue;
                      if (
                        taxableValue !== null &&
                        taxableValue !== "null" &&
                        taxableValue !== undefined
                      ) {
                        cp.className = "text-end";
                      }
                    }
                    if (col == 11) {
                      const igst = hot?.getSourceDataAtRow(row)?.IGST;
                      if (
                        igst !== null &&
                        igst !== "null" &&
                        igst !== undefined
                      ) {
                        cp.className = "text-end";
                      }
                    }
                    if (col == 12) {
                      const sgst = hot?.getSourceDataAtRow(row)?.SGST;
                      if (
                        sgst !== null &&
                        sgst !== "null" &&
                        sgst !== undefined
                      ) {
                        cp.className = "text-end";
                      }
                    }
                    if (col == 13) {
                      const cgst = hot?.getSourceDataAtRow(row)?.CGST;
                      if (
                        cgst !== null &&
                        cgst !== "null" &&
                        cgst !== undefined
                      ) {
                        cp.className = "text-end";
                      }
                    }
                    if (col == 14) {
                      const cess = hot?.getSourceDataAtRow(row)?.Cess;
                      if (
                        cess !== null &&
                        cess !== "null" &&
                        cess !== undefined
                      ) {
                        cp.className = "text-end";
                      }
                    }
                    if (col == 19) {
                      const taxRate = hot?.getSourceDataAtRow(row)?.TaxRate;
                      if (
                        taxRate !== null &&
                        taxRate !== "null" &&
                        taxRate !== undefined
                      ) {
                        cp.className = "text-end";
                      }
                    }
                    return cp;
                  }}
                  manualColumnResize={true}
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
              {/* new development for dropdown pagingation (don't delete this code) */}
              {data?.length ? (<span>
                <b>{`${paginationTitle}`}</b>  {" "}  &nbsp; &nbsp;
              </span>) : <></>}
              {data?.length ? (<Select
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
              {data?.length ? (<span  >
                <b>  {` ${paginationUi}`}</b>
              </span>) : <></>}     &nbsp; &nbsp;

              <ReactPaginate
                breakLabel="..."
                nextLabel=""
                onPageChange={handlePageClick}
                pageRangeDisplayed={2}
                pageCount={pageCount}
                forcePage={currentPage}
                previousLabel=""
                renderOnZeroPageCount={null}
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
                containerClassName="pagination react-paginate separated-pagination pagination-sm  pe-1 mt-1"
              />

            </Col>
          </Row>
        </CardBody>
      </Card>
    </Fragment>
  );
}

export default GSTR2BClientSummary;

