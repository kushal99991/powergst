import { Fragment, useState, useEffect, useRef } from "react";
import { API_URL_GSTR6, RowSize, columnHeaderSize } from "../../../../configs/config";
import { HotTable } from "@handsontable/react";
import Handsontable from "handsontable";
import { textRenderer } from "handsontable/renderers";
import { registerAllModules } from "handsontable/registry";
import GSRT1SummaryInvoice from "../../../../services/gstr1/gstr1Services/gstr1PurchaseInvoiceService";
import gstr6PurchaseInvoice from "../../../../services/gstr6Filed/gstr6filedService";
import errorCodeConfig from "../../../../configs/apiErrorCodeConfig";
import Select from "react-select"; // eslint-disable-line
import makeAnimated from "react-select/animated";
import { paginationList } from "../../../../configs/config";
import { selectThemeColors } from "@utils";
import {
  b2bColumns,
  cdnColumns,
  cdnaColumns,
  distributionOfItcColumns,
  ammendDistributionItcdetailsColumn,
  ITCrevisedColumns,
  totalITC,
  destributedCreditCols,
  lateFeeColumns,
} from "./gstr6Column";
import moment from "moment";
import {
  useNavigate,
  useParams,
  useLocation,
  useOutletContext,
} from "react-router-dom";
import $ from "jquery";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import {
  DROPDOWN_PLACEHOLDER,
  SELECT_MAXSIZE,
} from "../../../../configs/config";
import { globleVariable } from "../../../../configs/globalVariable";
import LocalFunction from "../../../../configs/getLocalFunction";
import SessionFunction from "../../../../configs/getSessionFunction";
import { downloadURL } from "@helper/downloadUrl";
import { useSelector, useDispatch } from "react-redux";
import { getGSTR6SummaryRedux } from "../../../apps/user/store";
import {urlEndpointConfig} from '@configs/urlEndpoint'
import { b2b, cdn, cdna, itc, distITC } from "./mockdata";
// import { showTotalRowPerPage } from "../../../helper/tableRowsPerPage";
import { showTotalRowPerPage } from "../../../../helper/tableRowsPerPage";
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
import encryptData from "../../../../auth/crypto/crypto";
import withReactContent from "sweetalert2-react-content";
import { filterCurrentDate } from "../../../../helper/filterArray";

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

const Gstr6Invoices = ({ returnDate }) => {

  const navigate = useNavigate();

  const { setGSRT1Data, stepper } = useOutletContext();
  const [block, setBlock] = useState(false);
  const [data, setData] = useState([]);
  const [dataB2B, setDataB2B] = useState([]);
  const [dataB2BA, setDataB2BA] = useState([]);
  const [dataCDN, setDataCDN] = useState([]);
  const [dataCDNA, setDataCDNA] = useState([]);
  const [dataITC, setDataITC] = useState([]);
  const [dataITCA, setDataITCA] = useState([]);
  const [activeClassName, setActiveClassName] = useState("active");
  const [pageTotTitle, setpageTotTitle] = useState("Rows Per Page :");
  const [pageNoSelect, setPageNoSelect] = useState(paginationList[0]);

  // checkBox State
  const [supplyType,setSupplyType] = useState([]);
  const [unitType,setUnitType] = useState([]);
  const [placeOfSupply,setPlaceOfSupply] = useState([]);
  const [sezSupplier,setSezSupplier] = useState([]);
  const [eligibilityofITC,setEligibilityofITC] = useState([]);
  const [noteType, setNoteType] = useState([]);
  const [isdDocumentType,setIsdDocumentType] = useState([])
  const [isLocatedInSez,setIsLocatedInSez] = useState([]);
  const [rate,setRate] = useState([]);
  const [action,setAction] = useState([])
  var arrChk = [];

  const [filterDropDownList, setFilterDropDownList] = useState({
    supplyTypeDropdownList : [],
    unitTypeDropDownList : [],
    posDropDownList: [],
    sezDropDownList: [],
    eligibilityofITCDropDownList: [],
    noteTypeDropDownList: [],
    docTypeDropDownList: [],
    isLocatedDropDownList: [],
    rateDropDownList: [],
    actionDropDownList: []
  })

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [currentCol, setCurrentCol] = useState([]);
  const [currentCol1, setCurrentCol1] = useState();
  const [searchVal1, setSearchVal1] = useState([]);
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
   const [gridCustomFilter, setGridCustomFilter] = useState([]);
  const [searchDate1, setSearchDate1] = useState("");
  const [searchDate1To, setSearchDate1To] = useState("");
  const [searchDate2, setSearchDate2] = useState("");
  const [searchDate2To, setSearchDate2To] = useState("");
  const [searchDate3, setSearchDate3] = useState("");
  const [searchDate3To, setSearchDate3To] = useState("");
  const [b2csData, setB2csData] = useState([]);

  const [currentColb2cs, setCurrentColb2cs] = useState([]);
  const [currentCol1b2cs, setCurrentCol1b2cs] = useState();
  const [searchValb2cs, setSearchValb2cs] = useState([]);

  const [currentColcrdr, setCurrentColcrdr] = useState([]);
  const [currentCol1crdr, setCurrentCol1crdr] = useState();
  const [searchValcrdr, setSearchValcrdr] = useState([]);

  const [count, setCount] = useState(0);
  const [activeTab, setActiveTab] = useState("1");
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
  const [invoceTypes, setInvoceTypes] = useState([]);
  const [reverseChargeType, setReverseChargeType] = useState(null);
  const [crDrType, setCrDrType] = useState(null);
  const [totalCGST, setTotalCGST] = useState(0);
  const [hsn, setHsn] = useState(0);
  const [totalCess, setTotalCess] = useState(0);
  const [totalIGST, setTotalIGST] = useState(0);
  const [totalInvoice, setTotalInvoice] = useState(0);
  const [totalInvoiceValue, setTotalInvoiceValue] = useState(0);
  const [totalSGST, setTotalSGST] = useState(0);
  const [totalTaxableValue, setTotalTaxableValue] = useState(0);
  const [IGST, setIGST] = useState(0);
  const [Cess, setCess] = useState(0);
  const [CGST, setCGST] = useState(0);
  const [SGST, setSGST] = useState(0);

  const [pageNoTitle , setPageNoTitle] = useState("");
  const [ totalRowsShow ,setTotalRowsShow] = useState(0)

  //ITC
  const [btnDisable1, setbtnDisable1] = useState(false);
  const [financialYearList, setFinancialYearList] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);

  const G_UCParId = SessionFunction.getSessionValue(
    globleVariable.G_UCParId,
    true
  );
  const G_FY = SessionFunction.getSessionValue(globleVariable.G_FY, true);
  const gstr1FiledFromDt = SessionFunction.getSessionValue(
    globleVariable.gstr1FiledFromDt,
    true
  );
  const G_GSTIN = SessionFunction.getSessionValue(globleVariable.G_GSTIN, true);
  const gstr1FiledToDt = SessionFunction.getSessionValue(
    globleVariable.gstr1FiledToDt,
    true
  );
  const subId =
    localStorage.getItem(globleVariable.subscriptionId) &&
    LocalFunction.getLocalValue(globleVariable.subscriptionId, true);
  const token = LocalFunction.getLocalValue(globleVariable.tokenKey, true);

  const dispatch = useDispatch();

  const store6Summary = useSelector((state) => state?.users?.GSTR6FiledSummary);

  //remaining clear filter, all filter, all currency filter

  let arrFilter = [];

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
    let rope = showTotalRowPerPage(page,rowsPerPage,totalInvoice)
    // console.log(totalRowsShow,"totalRowsShow")
    console.log("totalRowsShow",rowsPerPage)
    console.log("totalRowsShow",page)
    setPageNoTitle(rope)
    
  },[page,rowsPerPage,totalInvoice])

  useEffect(() => {
    let activeTabData = {
      activeTab: activeTab,
      btnDisable1: btnDisable1,
      deleteSaleInvoice: deleteSaleInvoice,
      ExportSectionWiseData: ExportSectionWiseData,
      ClearFilter: ClearFilter,
    };
    setGSRT1Data(false, activeTabData);
  }, [invoceTypes, activeTab, data,btnDisable1]);

  useEffect(() => {
    newList(activeTab);
    // Purchase Master
    GSRT1SummaryInvoice.saletblStaticDataMaster()
      .then((res) => {
        console.log(res);
        if (
          res.status == 200 &&
          res.data.status === errorCodeConfig.APIDefaultCode.Success
        ) {
          var resData = res.data.data;

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

  useEffect(() => {
    stepper != null && stepper.to(2);
  }, [stepper]);

  useEffect(() => {
    newList(activeTab);
  }, [store6Summary]);

  const location = useLocation();
  let { id } = useParams();

  let searchUrlValue = null;
  //** GSTR 6 Columns

  function formatINR(x) {
    return x.toLocaleString("en-IN", { minimumFractionDigits: 2 });
  }
  function formatTotalWithoutDecimal(x) {
    return x.toLocaleString("en-IN");
  }

  function emptyRender(instance, td, row, col, prop, value, cellProperties) {
    textRenderer.apply(this, arguments);
    if (

      col == 4 ||
      // col == 6 ||
      col == 7 ||
      col == 8 ||
      col == 9 ||
      col == 10 ||
      col == 11 ||
      col == 12
    ) {
      let currnecyVal = formatINR(Number(value));

      if (currnecyVal !== 0) {
        td.innerText = currnecyVal;
      }
    }
  }

  function emptyRenderITC(instance, td, row, col, prop, value, cellProperties) {
    textRenderer.apply(this, arguments);
    if (col == 7 || col == 13 || col == 14 || col == 11 || col == 12) {
      let currnecyVal = formatINR(Number(value));

      if (currnecyVal !== 0) {
        td.innerText = currnecyVal;
      }
    }
  }

  function emptyRenderCDN(instance, td, row, col, prop, value, cellProperties) {
    textRenderer.apply(this, arguments);
    if (col == 14 || col == 15 || col == 13 || col == 11 || col == 12) {
      let currnecyVal = formatINR(Number(value));

      if (currnecyVal !== 0) {
        td.innerText = currnecyVal;
      }
    }
  }

  function emptyRenderCDNA(
    instance,
    td,
    row,
    col,
    prop,
    value,
    cellProperties
  ) {
    textRenderer.apply(this, arguments);
    if (col == 14 || col == 15 || col == 18 || col == 16 || col == 13) {
      let currnecyVal = formatINR(Number(value));

      if (currnecyVal !== 0) {
        td.innerText = currnecyVal;
      }
    }
  }

  function emptyRenderDITC(
    instance,
    td,
    row,
    col,
    prop,
    value,
    cellProperties
  ) {
    textRenderer.apply(this, arguments);
    if (col == 14 || col == 15 || col == 13 || col == 12 || col == 14) {
      let currnecyVal = formatINR(Number(value));

      if (currnecyVal !== 0) {
        td.innerText = currnecyVal;
      }
    }
  }

  function emptyRenderAITC(
    instance,
    td,
    row,
    col,
    prop,
    value,
    cellProperties
  ) {
    textRenderer.apply(this, arguments);
    if (col == 16 || col == 17 || col == 18 || col == 19) {

      let currnecyVal = formatINR(Number(value));

      if (currnecyVal !== 0) {
        td.innerText = currnecyVal;
      }
    }
  }

  function emptyRenderLatefee(
    instance,
    td,
    row,
    col,
    prop,
    value,
    cellProperties
  ) {
    textRenderer.apply(this, arguments);
    if (col == 1 || col == 2 || col == 3) {

      let currnecyVal = formatINR(Number(value));

      if (currnecyVal !== 0) {
        td.innerText = currnecyVal;
      }
    }
  }

  function emptyRenderTotalITCAvailable(
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

  function FilterData(arr) {
    console.log(arr,"arrrrayy")
    let addArr = [];
    var flag = false;
    let updatedData = [];
    let finalObj = {};

    for (let i = 0; i < arr.length; i++) {
      Object.assign(finalObj, arr[i]);
    }

    const statedata =
      activeTab == 1
        ? dataB2B
        : activeTab == 2
          ? dataB2BA
          : activeTab == 3
            ? dataCDN
            : activeTab == 4
              ? dataCDNA
              : activeTab == 5
                ? dataITC
                : dataITCA;

   const mapArrRate = arr?.map(type => Number(type?.Rate))   
   const mapArrpos = arr?.map(type => type?.PlaceOfSupply)
   const mapArrSupplyType = arr?.map(type => type?.SupplyType)
   const mapArrNoteType = arr?.map(type => type?.NoteType)
   const mapArrSezSupplier = arr?.map(type => type?.SezSupplier)
   const mapArrEligbilityofITC = arr?.map(type => type?.EligibilityOfITC)
   const mapArrUnitType = arr?.map(type => type?.UnitType)
   console.log(mapArrRate,"mapArrRate")         

    updatedData = statedata
      .filter((itemGSTIN) =>
        finalObj.SupplierGSTIN?.length
          ? itemGSTIN?.SupplierGSTIN?.toLowerCase().includes(
            finalObj?.SupplierGSTIN?.toLowerCase()
          )
          : itemGSTIN
      )
  
      .filter((itemGSTIN) =>
        finalObj.SupplierName?.length
          ? itemGSTIN?.SupplierName?.toLowerCase().includes(
            finalObj?.SupplierName?.toLowerCase()
          )
          : itemGSTIN
      )
      .filter((itemGSTIN) =>
        finalObj.OriginalSupplierGSTIN?.length
          ? itemGSTIN?.OriginalSupplierGSTIN?.toLowerCase().includes(
            finalObj?.OriginalSupplierGSTIN?.toLowerCase()
          )
          : itemGSTIN
      )
      .filter((itemSupplyType) =>
      finalObj.SupplyType?.length ?
        mapArrSupplyType?.includes(itemSupplyType['SupplyType']) : itemSupplyType
    )
    .filter((itemInvoiceNo) =>
    finalObj.SezSupplier?.length ?
      mapArrSezSupplier?.includes(itemInvoiceNo['SezSupplier']) : itemInvoiceNo
  )

  .filter((itemInvoiceNo) =>
  finalObj.NoteType?.length ?
    mapArrNoteType?.includes(itemInvoiceNo['NoteType']) : itemInvoiceNo
)
.filter((itemInvoiceNo) =>
finalObj.EligibilityOfITC?.length ?
  mapArrEligbilityofITC?.includes(itemInvoiceNo['EligibilityOfITC']) : itemInvoiceNo
)

.filter((itemInvoiceNo) =>
finalObj.UnitType?.length ?
  mapArrUnitType?.includes(itemInvoiceNo['UnitType']) : itemInvoiceNo
)
  

      .filter((itemTradeName) =>
        finalObj.SupplierTradeName?.length
          ? itemTradeName?.SupplierTradeName?.toLowerCase().includes(
            finalObj?.SupplierTradeName?.toLowerCase()
          )
          : itemTradeName
      )
      .filter((itemInvoiceNo) =>
        finalObj.InvoiceNumber?.length
          ? itemInvoiceNo?.InvoiceNumber?.toLowerCase().includes(
            finalObj?.InvoiceNumber?.toLowerCase()
          )
          : itemInvoiceNo
      )

      .filter((itemInvoiceNo) =>
        finalObj.OriginalInvoiceNumber?.length
          ? itemInvoiceNo?.OriginalInvoiceNumber?.toLowerCase().includes(
            finalObj?.OriginalInvoiceNumber?.toLowerCase()
          )
          : itemInvoiceNo
      )
      .filter((itemInvoiceNo) =>
        finalObj.RevisedInvoiceNumber?.length
          ? itemInvoiceNo?.RevisedInvoiceNumber?.toLowerCase().includes(
            finalObj?.RevisedInvoiceNumber?.toLowerCase()
          )
          : itemInvoiceNo
      )
      .filter((itemInvoiceNo) =>
        finalObj.RevisedInvoiceValue?.length
          ? itemInvoiceNo?.RevisedInvoiceValue?.toLowerCase().includes(
            finalObj?.RevisedInvoiceValue?.toLowerCase()
          )
          : itemInvoiceNo
      )
      // .filter((itemInvoiceNo) =>
      //   finalObj.SezSupplier?.length
      //     ? itemInvoiceNo?.SezSupplier?.toLowerCase().includes(
      //       finalObj?.SezSupplier?.toLowerCase()
      //     )
      //     : itemInvoiceNo
      // )

      //cdn filters
      // .filter((itemInvoiceNo) =>
      //   finalObj.NoteType?.length
      //     ? itemInvoiceNo?.NoteType?.toLowerCase().includes(
      //       finalObj?.NoteType?.toLowerCase()
      //     )
      //     : itemInvoiceNo
      // )
      .filter((itemInvoiceNo) =>
        finalObj.NoteNumber?.length
          ? itemInvoiceNo?.NoteNumber?.toLowerCase().includes(
            finalObj?.NoteNumber?.toLowerCase()
          )
          : itemInvoiceNo
      )
      .filter((itemInvoiceNo) =>
        finalObj.OriginalInvoiceofCreditNote?.length
          ? itemInvoiceNo?.OriginalInvoiceofCreditNote?.toLowerCase().includes(
            finalObj?.OriginalInvoiceofCreditNote?.toLowerCase()
          )
          : itemInvoiceNo
      )
      // .filter((itemInvoiceDate) =>
      //   finalObj.OriginalInvoiceDateLabel?.length
      //     ? itemInvoiceDate?.OriginalInvoiceDateLabel?.toLowerCase().includes(
      //       // finalObj?.InvoiceDate?.toLowerCase()
      //       moment(finalObj?.OriginalInvoiceDateLabel).format("DD-MM-YYYY")
      //     )
      //     : itemInvoiceDate
      // )

      .filter((itemInvoiceDate) => {
        if (finalObj?.OriginalInvoiceDateLabel?.length) {
          const [a, b] = finalObj?.OriginalInvoiceDateLabel?.split("to")
          const startDate = moment(a, 'YYYY-MM-DD');
          const toDate = moment(b, 'YYYY-MM-DD');
          const invoiceDate = moment(itemInvoiceDate?.OriginalInvoiceDateLabel, 'DD-MM-YYYY');
          return invoiceDate.isBetween(startDate, toDate, null, '[]');
        }
        else {
          return itemInvoiceDate
        }
      })

      // .filter((itemInvoiceDate) =>
      //   finalObj.OriginalInvoiceDateLabel?.length
      //     ? itemInvoiceDate?.OriginalInvoiceDateLabel?.toLowerCase().includes(
      //       // finalObj?.InvoiceDate?.toLowerCase()
      //       moment(finalObj?.OriginalInvoiceDateLabel).format("DD-MM-YYYY")
      //     )
      //     : itemInvoiceDate
      // )
      // .filter((itemInvoiceDate) =>
      //   finalObj.RevisedInvoiceDateLabel?.length
      //     ? itemInvoiceDate?.RevisedInvoiceDateLabel?.toLowerCase().includes(
      //       // finalObj?.InvoiceDate?.toLowerCase()
      //       moment(finalObj?.RevisedInvoiceDateLabel).format("DD-MM-YYYY")
      //     )
      //     : itemInvoiceDate
      // )
      .filter((itemInvoiceDate) => {
        if (finalObj?.RevisedInvoiceDateLabel?.length) {
          const [a, b] = finalObj?.RevisedInvoiceDateLabel?.split("to")
          const startDate = moment(a, 'YYYY-MM-DD');
          const toDate = moment(b, 'YYYY-MM-DD');
          const invoiceDate = moment(itemInvoiceDate?.RevisedInvoiceDateLabel, 'DD-MM-YYYY');
          return invoiceDate.isBetween(startDate, toDate, null, '[]');
        }
        else {
          return itemInvoiceDate
        }
      })
      

      .filter((itemInvoiceDate) => {
        if (finalObj?.RevisedNoteDateLabel?.length) {
          const [a, b] = finalObj?.RevisedNoteDateLabel?.split("to")
          const startDate = moment(a, 'YYYY-MM-DD');
          const toDate = moment(b, 'YYYY-MM-DD');
          const invoiceDate = moment(itemInvoiceDate?.RevisedNoteDateLabel, 'DD-MM-YYYY');
          return invoiceDate.isBetween(startDate, toDate, null, '[]');
        }
        else {
          return itemInvoiceDate
        }
      })

      // .filter((itemInvoiceDate) =>
      //   finalObj.InvoiceDateLabel?.length
      //     ? itemInvoiceDate?.InvoiceDateLabel?.toLowerCase().includes(
      //       // finalObj?.InvoiceDate?.toLowerCase()
      //       moment(finalObj?.InvoiceDateLabel).format("DD-MM-YYYY")
      //     )
      //     : itemInvoiceDate
      // )

      .filter((itemInvoiceDate) => {
        if (finalObj?.InvoiceDateLabel?.length) {
          const [a, b] = finalObj?.InvoiceDateLabel?.split("to")
          const startDate = moment(a, 'YYYY-MM-DD');
          const toDate = moment(b, 'YYYY-MM-DD');
          console.log(startDate,toDate,"startDatestartDatestartDate")
          const invoiceDate = moment(itemInvoiceDate?.InvoiceDateLabel, 'DD-MM-YYYY');
          return invoiceDate.isBetween(startDate, toDate, null, '[]');
        }
        else {
          return itemInvoiceDate
        }
      })
      
      // .filter((itemInvoiceDate) =>
      //   finalObj.NoteDateLabel?.length
      //     ? itemInvoiceDate?.NoteDateLabel?.toLowerCase().includes(
      //       // finalObj?.InvoiceDate?.toLowerCase()
      //       moment(finalObj?.NoteDateLabel).format("DD-MM-YYYY")
      //     )
      //     : itemInvoiceDate
      // )
      .filter((itemInvoiceDate) => {
        if (finalObj?.NoteDateLabel?.length) {
          const [a, b] = finalObj?.NoteDateLabel?.split("to")
          const startDate = moment(a, 'YYYY-MM-DD');
          const toDate = moment(b, 'YYYY-MM-DD');
          const invoiceDate = moment(itemInvoiceDate?.NoteDateLabel, 'DD-MM-YYYY');
          return invoiceDate.isBetween(startDate, toDate, null, '[]');
        }
        else {
          return itemInvoiceDate
        }
      })
      // .filter((itemInvoiceDate) =>
      //   finalObj.DateofOriginalInvoiceofCreditNoteLabel?.length
      //     ? itemInvoiceDate?.DateofOriginalInvoiceofCreditNoteLabel?.toLowerCase().includes(
      //       // finalObj?.InvoiceDate?.toLowerCase()
      //       moment(finalObj?.DateofOriginalInvoiceofCreditNoteLabel).format(
      //         "DD-MM-YYYY"
      //       )
      //     )
      //     : itemInvoiceDate
      // )
      .filter((itemInvoiceDate) => {
        if (finalObj?.DateofOriginalInvoiceofCreditNoteLabel?.length) {
          const [a, b] = finalObj?.DateofOriginalInvoiceofCreditNoteLabel?.split("to")
          const startDate = moment(a, 'YYYY-MM-DD');
          const toDate = moment(b, 'YYYY-MM-DD');
          const invoiceDate = moment(itemInvoiceDate?.DateofOriginalInvoiceofCreditNoteLabel, 'DD-MM-YYYY');
          return invoiceDate.isBetween(startDate, toDate, null, '[]');
        }
        else {
          return itemInvoiceDate
        }
      })
      // .filter((itemInvoiceDate) =>
      //   finalObj.NoteDateLabel?.length
      //     ? itemInvoiceDate?.NoteDateLabel?.toLowerCase().includes(
      //       // finalObj?.InvoiceDate?.toLowerCase()
      //       moment(finalObj?.NoteDateLabel).format("DD-MM-YYYY")
      //     )
      //     : itemInvoiceDate
      // )

      //distribution of itc
      // .filter((itemInvoiceNo) =>
      //   finalObj.EligibilityOfITC?.length
      //     ? itemInvoiceNo?.EligibilityOfITC?.toLowerCase().includes(
      //       finalObj?.EligibilityOfITC?.toLowerCase()
      //     )
      //     : itemInvoiceNo
      // )

      // .filter((itemInvoiceNo) =>
      //   finalObj.UnitType?.length
      //     ? itemInvoiceNo?.UnitType?.toLowerCase().includes(
      //       finalObj?.UnitType?.toLowerCase()
      //     )
      //     : itemInvoiceNo
      // )
      // .filter((itemInvoiceNo) =>
      //   finalObj.EligibilityOfITC?.length
      //     ? itemInvoiceNo?.EligibilityOfITC?.toLowerCase().includes(
      //       finalObj?.EligibilityOfITC?.toLowerCase()
      //     )
      //     : itemInvoiceNo
      // )
      // .filter((itemInvoiceNo) =>
      //   finalObj.EligibilityOfITC?.length
      //     ? itemInvoiceNo?.EligibilityOfITC?.toLowerCase().includes(
      //       finalObj?.EligibilityOfITC?.toLowerCase()
      //     )
      //     : itemInvoiceNo
      // )

      .filter((itemInvoiceNo) =>
        finalObj.RecipientGSTIN?.length
          ? itemInvoiceNo?.RecipientGSTIN?.toLowerCase().includes(
            finalObj?.RecipientGSTIN?.toLowerCase()
          )
          : itemInvoiceNo
      )
      .filter((itemInvoiceType) =>
        finalObj.InvoiceType?.length
          ? itemInvoiceType?.InvoiceType?.toLowerCase().includes(
            finalObj?.InvoiceType?.toLowerCase()
          )
          : itemInvoiceType
      )
      // .filter((itemNoteType) =>
      //   finalObj.NoteType?.length
      //     ? itemNoteType?.NoteType?.toLowerCase().includes(
      //       finalObj?.NoteType?.toLowerCase()
      //     )
      //     : itemNoteType
      // )

      
      .filter((itemInvoiceValue) => {
        if (finalObj?.InvoiceValue?.length) {
            const [a, b] = finalObj?.InvoiceValue?.split("to");
            const fromValue = parseFloat(a.trim());
            const toValue = parseFloat(b.trim());
            const invoiceValue = parseFloat(itemInvoiceValue?.InvoiceValue);
            if ( !isNaN(invoiceValue)) {
              if (!isNaN(fromValue) && !isNaN(toValue)) {
                return invoiceValue >= fromValue && invoiceValue <= toValue;
              }
              else if(!isNaN(fromValue)){
                return invoiceValue >= fromValue;
              }
               else {
                return invoiceValue <= toValue;
              }
            }
        }
        return true;
    })
    
    
      // .filter((itemPlaceOfSupply) =>
      //   finalObj.PlaceOfSupply?.length
      //     ? itemPlaceOfSupply?.PlaceOfSupply?.toLowerCase().includes(
      //       finalObj?.PlaceOfSupply?.toLowerCase()
      //     )
      //     : itemPlaceOfSupply
      // )
      .filter((itemPlaceOfSupply) =>
        finalObj.PlaceOfSupply?.length ?
          mapArrpos?.includes(itemPlaceOfSupply['PlaceOfSupply']) : itemPlaceOfSupply
      )

      .filter((itemSupplyAttractReverse) =>
        finalObj.SupplyAttractReverse?.length
          ? itemSupplyAttractReverse?.SupplyAttractReverse?.toLowerCase().includes(
            finalObj?.SupplyAttractReverse?.toLowerCase()
          )
          : itemSupplyAttractReverse
      )
      // .filter((itemRate) =>
      //   finalObj.Rate?.length
      //     ? itemRate?.Rate?.toLowerCase().includes(
      //       finalObj?.Rate?.toLowerCase()
      //     )
      //     : itemRate
      // )

      .filter((itemRate) =>

        finalObj.Rate?.length ?
          mapArrRate?.includes(Number(itemRate['Rate'])) : itemRate
      )

 

      .filter((itemTaxableValue) => {
        if (finalObj?.TaxableValue?.length) {
            const [a, b] = finalObj?.TaxableValue?.split("to");
            console.log(a,b,"wwwweeee")
            const fromValue = parseFloat(a.trim());
            const toValue = parseFloat(b.trim());
            const invoiceValue = parseFloat(itemTaxableValue?.TaxableValue);
    
            if ( !isNaN(invoiceValue)) {
              if (!isNaN(fromValue) && !isNaN(toValue)) {
                return invoiceValue >= fromValue && invoiceValue <= toValue;
              }
              else if(!isNaN(fromValue)){
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
            console.log(a,b,"wwwweeee")
            const fromValue = parseFloat(a.trim());
            const toValue = parseFloat(b.trim());
            const invoiceValue = parseFloat(itemIGST?.IGST);
    
            if ( !isNaN(invoiceValue)) {
              if (!isNaN(fromValue) && !isNaN(toValue)) {
                return invoiceValue >= fromValue && invoiceValue <= toValue;
              }
              else if(!isNaN(fromValue)){
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
            console.log(a,b,"wwwweeee")
            const fromValue = parseFloat(a.trim());
            const toValue = parseFloat(b.trim());
            const invoiceValue = parseFloat(itemCGST?.CGST);
    
            if ( !isNaN(invoiceValue)) {
              if (!isNaN(fromValue) && !isNaN(toValue)) {
                return invoiceValue >= fromValue && invoiceValue <= toValue;
              }
              else if(!isNaN(fromValue)){
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
            console.log(a,b,"wwwweeee")
            const fromValue = parseFloat(a.trim());
            const toValue = parseFloat(b.trim());
            const invoiceValue = parseFloat(itemSGST?.SGST);
    
            if ( !isNaN(invoiceValue)) {
              if (!isNaN(fromValue) && !isNaN(toValue)) {
                return invoiceValue >= fromValue && invoiceValue <= toValue;
              }
              else if(!isNaN(fromValue)){
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
            console.log(a,b,"wwwweeee")
            const fromValue = parseFloat(a.trim());
            const toValue = parseFloat(b.trim());
            const invoiceValue = parseFloat(itemCess?.Cess);
    
            if ( !isNaN(invoiceValue)) {
              if (!isNaN(fromValue) && !isNaN(toValue)) {
                return invoiceValue >= fromValue && invoiceValue <= toValue;
              }
              else if(!isNaN(fromValue)){
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
        finalObj.ITCAvaliable?.length
          ? itemITCAvaliable?.ITCAvaliable?.toLowerCase().includes(
            finalObj?.ITCAvaliable?.toLowerCase()
          )
          : itemITCAvaliable
      );

    flag = true;
    addArr.push(...updatedData);
    setPage(0);
    // setCurrentPage(0);
    let uniq = [...new Set(addArr)];
    console.log(uniq, "uniqqqq");

    newCalc(uniq);

    return uniq;
  }

  let finYear = null;
  let finMonth = null;
  let url = null;

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
  }

  useEffect(() => {
    setPanData(YearList);
    setPanDataFrom(YearList);
    if (true) {
      const defaultValueFrom = YearList?.filter(
        (item) => item.value == finYear
      )[0];
      const defaultValueTo = YearList?.filter(
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

      console.log(
        "tData=",
        panData,
        defaultValueFrom,
        defaultValueTo,
        finYear,
        finMonth
      );

      setSearchApi(true);
    }
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
    }else {

      if (gstr1FiledFromDt == null || gstr1FiledFromDt == "" || gstr1FiledFromDt == undefined ) {
        navigate(urlEndpointConfig.GSTR6_FILED_REPORT)
      }
    }
  }, [displayType, activeTab]);

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
      getExempList(finFromYear?.value, value?.value);
    } else {
      newList(activeTab);
      // purchaseSummaryList(activeTab, "", "", activeTab == 3 ? '0' : invType, finFromYear?.value, value?.value, refershData)
    }
  };

  const selectFromYear = (value) => {
    setSelectedYear(value);
    setPage(0);
    setFinFormYear(value);
    setErrorMsg("");
    const monthFr = monthFrom?.srNo > value?.srNo ? monthFrom : panDataFrom[0];
    setMonthFrom(monthFr);
    const x = panDataFrom?.filter(
      (item) => Number(item.srNo) >= Number(value.srNo)
    );
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
      refershData
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

      newList(activeTab);
    }
  }, [searchApi, activeTab]);

  useEffect(() => {
    // console.log("searchVal1", searchVal1.length);
    // console.log("searchVal1", searchVal1);
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

      newList(activeTab);

      // purchaseSummaryList(
      //   activeTab,
      //   "",
      //   "",
      //   activeTab == 3 ? "0" : invType,
      //   finFromYear?.value,
      //   monthFrom?.value,
      //   ""
      // );
    }
  }, [page, searchVal1, serverSidePage]);

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
  };

  // const b2bFun = (X,x)=>{
  //   if (store6Summary?.[0]?.Data?.[X]?.length > 0) {
  //     setData(store6Summary?.[0]?.Data?.[X])
  //     newCalc(store6Summary?.[0]?.Data?.[X])
  //   } else {
  //     setData(x)
  //     newCalc(x)
  //   }
  // }

  const newList = (activeTabs) => {
    if (store6Summary?.length < 1) {
      const userData = {
        UserClientId: G_UCParId,
        FinancialYear: gstr1FiledFromDt,
        FinMonth: gstr1FiledToDt,
        subId: subId,
        G_GSTIN: G_GSTIN,
      };

      console.log("gstr6 payload=", userData);
      setBlock(true);
      dispatch(getGSTR6SummaryRedux(userData));
    } else {
      setBlock(false);

      console.log("store6 token data=", store6Summary);
      if (activeTabs == 1) {
        if (store6Summary?.[0]?.Data?.B2B?.length > 0) {
          setData(store6Summary?.[0]?.Data?.B2B);
          setDataB2B(store6Summary?.[0]?.Data?.B2B);
          newCalc(store6Summary?.[0]?.Data?.B2B);
        } else {
          setData([]);
          newCalc([]);
        }
      } else if (activeTabs == 2) {
        if (store6Summary?.[0]?.Data?.B2BA?.length > 0) {
          setData(store6Summary?.[0]?.Data?.B2BA);
          setDataB2BA(store6Summary?.[0]?.Data?.B2BA);
          newCalc(store6Summary?.[0]?.Data?.B2BA);
        } else {
          setData([]);
          newCalc([]);
        }
      } else if (activeTabs == 3) {
        if (store6Summary?.[0]?.Data?.CDN?.length > 0) {
          setData(store6Summary?.[0]?.Data?.CDN);
          setDataCDN(store6Summary?.[0]?.Data?.CDN);
          newCalc(store6Summary?.[0]?.Data?.CDN);
        } else {
          setData([]);
          newCalc([]);
        }
      } else if (activeTabs == 4) {
        if (store6Summary?.[0]?.Data?.CDN?.length > 0) {
          setDataCDNA(store6Summary?.[0]?.Data?.CDN);
          setData(store6Summary?.[0]?.Data?.CDN);
          newCalc(store6Summary?.[0]?.Data?.CDN);
        } else {
          setData([]);
          newCalc([]);
        }
      } else if (activeTabs == 5) {
        if (store6Summary?.[0]?.Data?.DistofITC?.length > 0) {
          setData(store6Summary?.[0]?.Data?.DistofITC);
          setDataITC(store6Summary?.[0]?.Data?.DistofITC);
          newCalc(store6Summary?.[0]?.Data?.DistofITC);
        } else {
          setData([]);
          newCalc([]);
        }
      } else if (activeTabs == 6) {
        if (store6Summary?.[0]?.Data?.AmendofDistofITC?.length > 0) {
          setData(store6Summary?.[0]?.Data?.AmendofDistofITC);
          setDataITCA(store6Summary?.[0]?.Data?.AmendofDistofITC);
          newCalc(store6Summary?.[0]?.Data?.AmendofDistofITC);
        } else {
          setData([]);
          newCalc([]);
        }
      } else if (activeTabs == 7) {
        if (store6Summary?.[0]?.Data?.TotalITCAvailable?.length > 0) {
          setData(store6Summary?.[0]?.Data?.TotalITCAvailable);
          setDataITCA(store6Summary?.[0]?.Data?.TotalITCAvailable);
          newCalc(store6Summary?.[0]?.Data?.TotalITCAvailable);
        } else {
          setData([]);
          newCalc([]);
        }
      } else if (activeTabs == 8) {
        if (store6Summary?.[0]?.Data?.LateFee?.length > 0) {
          setData(store6Summary?.[0]?.Data?.LateFee);
          setDataITCA(store6Summary?.[0]?.Data?.LateFee);
          newCalc(store6Summary?.[0]?.Data?.LateFee);
        } else {
          setData([]);
          newCalc([]);
        }
      }
      // alert("hii")
      // setData(store6Summary?.[0]?.Summary ? store6Summary?.[0]?.Summary : [])
      // setDatas(store6Summary?.[0]?.Summary ? store6Summary?.[0]?.Summary : [])
      // setSearchData(true)
      // setDownloadStart(false)
    }
  };

  const newCalc = (uniq) => {
    let count = 0;
    let tValue = 0;
    let sgst = 0;
    let cgst = 0;
    let cess = 0;
    let igst = 0;

    function getUniqueInvoiceLength(values) {

      const uniqueInvoices = new Set();
      console.log(activeTab, 'activeTab')
      values.forEach(item => {
        
        if (activeTab == 1 ) {
          if (item.InvoiceNumber && item.InvoiceDateLabel && item.SupplierGSTIN) {
            const uniqueKey = item.InvoiceNumber + '|' + item.InvoiceDateLabel + '|' + item.SupplierGSTIN;
            uniqueInvoices.add(uniqueKey);
            console.log(activeTab,uniq, 'activeTab')

          }
          } else if (activeTab == 2) {
          if (item.OriginalSupplierGSTIN && item.RevisedInvoiceNumber && item.RevisedInvoiceDateLabel) {
            const uniqueKey = item.OriginalSupplierGSTIN + '|' + item.RevisedInvoiceNumber + '|' + item.RevisedInvoiceDateLabel;
            uniqueInvoices.add(uniqueKey);
          }
          } else if (activeTab == 3 ) {
          if (item.SupplierGSTIN && item.NoteType && item.NoteNumber && item.NoteDateLabel ) {
            const uniqueKey = item.SupplierGSTIN + '|' + item.NoteType + '|' + item.NoteNumber + '|' + item.NoteDateLabel;
            uniqueInvoices.add(uniqueKey);
          }
          }else if (activeTab == 4 ) {
          if (item.OriginalSupplierGSTIN && item.NoteType && item.RevisedNoteNumber && item.RevisedNoteDateLabel) {
            const uniqueKey = item.OriginalSupplierGSTIN + '|' + item.NoteType + '|' + item.RevisedNoteNumber + '|' + item.RevisedNoteDateLabel;
            uniqueInvoices.add(uniqueKey);
          }
          }else if (activeTab == 5 ) {
          if (item.RecipientGSTIN && item.NoteType && item.InvoiceNumber && item.InvoiceDateLabel) {
            const uniqueKey = item.RecipientGSTIN + '|' + item.NoteType + '|' + item.InvoiceNumber + '|' + item.InvoiceDateLabel;
            uniqueInvoices.add(uniqueKey);
          }
          }else if (activeTab == 6 ) {
          if (item.OriginalRecipientGSTIN && item.NoteType && item.OriginalInvoiceNumber && item.OriginalInvoiceDateLabel) {
            const uniqueKey = item.OriginalRecipientGSTIN + '|' + item.NoteType + '|' + item.OriginalInvoiceNumber + '|' + item.OriginalInvoiceDateLabel;
            uniqueInvoices.add(uniqueKey);
          }
        }

      });

      return uniqueInvoices.size;
    }
    const uniqueLength = getUniqueInvoiceLength(uniq);
    if(activeTab == 7 || activeTab == 8){
      console.log(activeTab,uniq,uniqueLength, 'activeTab')
      setTotalInvoice(uniq.length);

    }else{
      setTotalInvoice(uniqueLength);

    }

    

    // setTotalInvoice(uniq.length);

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

    console.log("new sum", sgst, cess, cgst, igst);

    setIGST(igst);
    setCess(cess);
    setCGST(cgst);
    setSGST(sgst);
    setTotalInvoiceValue(count);
    setTotalTaxableValue(tValue);
  };

  // search api - AdvSearchFilter
  const purchaseSummaryList = (
    activeTabs,
    colName,
    orderBy,
    invType,
    frDate,
    toDate,
    clearBy
  ) => {
    console.log("frDate", frDate);
    console.log("toDate", toDate);
    var newValuesArr = [];
    // debugger
    console.log("get data - activetab", activeTabs);
    // console.log(invType);

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

    searchPayload = {
      userClientId: G_UCParId,
      pageStart: page + 1,
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
      toRange: toDate,
      gstin: [],
      vendorName: "",
    };

    setBlock(true);

    SessionFunction.setSessionValue(globleVariable.gstr1FromDt, frDate, true);
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

  const pageCount = Math.ceil(data?.length && data.length / rowsPerPage);

  console.log(pageCount, "pageCount");
  const para1 = page * rowsPerPage;
  const para2 = page * rowsPerPage + rowsPerPage;
  let dataITC1 = data && data.slice(para1, para2);

  const purchaseData = dataITC1;

  console.log(purchaseData, "purchseData");
  // const purchaseData = [];

  const b2csTableData = b2csData;
  const pageCountB2cs = Math.ceil(
    b2csTableData?.length && b2csTableData[0].totalRowCount / rowsPerPage
  );

  const onPageChangeFunc = (e) => {
    setPageNoSelect(e);
    setRowsPerPage(e.value);
    setPage(0);
  };
  // withot pagination property
  const handlePageClick = (event) => {
    setPage(event);
    // setServerSidePage(true);
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

    if(activeTab == 1){
      if (currentCol.length > 0) {
        // debugger
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
        for (let i = 0; i < arrFilter?.length; i++) {
          Object.assign(finalObj, arrFilter[i]);
        }

                 b2bColumns.forEach((ele, index) => {
            const columnIndex = index;
            const buttonExists = document?.querySelector(`#test .ht_clone_top thead th:nth-child(${columnIndex + 1}) button`);
            const columnMatchesCondition = Object.keys(finalObj).includes(ele.data);
            const columnValueValid = finalObj[ele.data] !== null && finalObj[ele.data] !== undefined && finalObj[ele.data] !== "";
            if (buttonExists && columnMatchesCondition && columnValueValid) {
                const TH = document.querySelector(`#test .ht_clone_top thead th:nth-child(${columnIndex + 1})`);
                // console.log(TH,"THHHH")
                if (TH) {
                    TH.classList.add("htFiltersActive");
                } else {
                    TH.classList.remove("htFiltersActive");
                }
            }
        });
    }
    }

    if (col > 12) {
      const button = TH.children[0].children[0];
      button?.parentNode?.removeChild(button);
    }

    if (
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

  // ** ITC Tab
  const theaderITC = (col, TH) => {
    if(activeTab == 2){
      if (currentCol.length > 0) {
        // debugger
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

          console.log(finalObj,"finalObj")

          ITCrevisedColumns.forEach((ele, index) => {
            const columnIndex = index;
            const buttonExists = document?.querySelector(`#theaderITC .ht_clone_top thead th:nth-child(${columnIndex + 1}) button`);

            const columnMatchesCondition = Object.keys(finalObj).includes(ele.data);
           
         const columnValueValid = finalObj[ele.data] !== null && finalObj[ele.data] !== undefined && finalObj[ele.data] !== "";
      

            if (buttonExists && columnMatchesCondition && columnValueValid) {
                const TH = document.querySelector(`#theaderITC .ht_clone_top thead th:nth-child(${columnIndex + 1})`);
                // console.log(TH,"THHHH")
                if (TH) {
                    TH.classList.add("htFiltersActive");
                } else {
                    TH.classList.remove("htFiltersActive");
                }
            }
        });
    }
    }
    if (col > 15) {
      const button = TH.children[0].children[0];
      button?.parentNode?.removeChild(button);
    }

    if (
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

  // ** CDN
  const theaderCdn = (col, TH) => {

    if(activeTab == 3){
      if (currentCol.length > 0) {
        // debugger
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
            const buttonExists = document?.querySelector(`#theaderCdn .ht_clone_top thead th:nth-child(${columnIndex + 1}) button`);

            const columnMatchesCondition = Object.keys(finalObj).includes(ele.data);
            // uniq.some(col1 => ele?.data.includes(col1));

            // Check if column value is not null
         const columnValueValid = finalObj[ele.data] !== null && finalObj[ele.data] !== "";
        

            if (buttonExists && columnMatchesCondition && columnValueValid) {
                const TH = document.querySelector(`#theaderCdn .ht_clone_top thead th:nth-child(${columnIndex + 1})`);
                // console.log(TH,"THHHH")
                if (TH) {
                    TH.classList.add("htFiltersActive");
                } else {
                    TH.classList.remove("htFiltersActive");
                }
            }
        });
    }
    }
    if (col > 15) {
      const button = TH.children[0].children[0];
      button?.parentNode?.removeChild(button);
    }

    if (
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

  // ** CDNA
  const theaderCdna = (col, TH) => {
    if(activeTab == 4){
      if (currentCol.length > 0) {
        // debugger
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
            const buttonExists = document?.querySelector(`#theaderCdna .ht_clone_top thead th:nth-child(${columnIndex + 1}) button`);

            const columnMatchesCondition = Object.keys(finalObj).includes(ele.data);
            // uniq.some(col1 => ele?.data.includes(col1));

            // Check if column value is not null
         const columnValueValid = finalObj[ele.data] !== null && finalObj[ele.data] !== "";
        //  console.log(columnIndex,"columnValueValid")
        //  console.log(buttonExists,"columnValueValid")
        //  console.log(columnMatchesCondition,"columnValueValid")
        //  console.log(columnValueValid,"columnValueValid")

            if (buttonExists && columnMatchesCondition && columnValueValid) {
                const TH = document.querySelector(`#theaderCdna .ht_clone_top thead th:nth-child(${columnIndex + 1})`);
                // console.log(TH,"THHHH")
                if (TH) {
                    TH.classList.add("htFiltersActive");
                } else {
                    TH.classList.remove("htFiltersActive");
                }
            }
        });
    }
    }
    if (col > 18) {
      const button = TH.children[0].children[0];
      button?.parentNode?.removeChild(button);
    }

    if (
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
    if(activeTab == 5){
      if (currentCol.length > 0) {
        // debugger
        // debugger
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
            const buttonExists = document?.querySelector(`#theaderDistrubution .ht_clone_top thead th:nth-child(${columnIndex + 1}) button`);

            const columnMatchesCondition = Object.keys(finalObj).includes(ele.data);
            // uniq.some(col1 => ele?.data.includes(col1));

            // Check if column value is not null
         const columnValueValid = finalObj[ele.data] !== null && finalObj[ele.data] !== "";
        //  console.log(columnIndex,"columnValueValid")
        //  console.log(buttonExists,"columnValueValid")
        //  console.log(columnMatchesCondition,"columnValueValid")
        //  console.log(columnValueValid,"columnValueValid")

            if (buttonExists && columnMatchesCondition && columnValueValid) {
                const TH = document.querySelector(`#theaderDistrubution .ht_clone_top thead th:nth-child(${columnIndex + 1})`);
                console.log(TH,"THHHH")
                if (TH) {
                    TH.classList.add("htFiltersActive");
                    // TH.style.color="red"
                } else {
                    TH.classList.remove("htFiltersActive");
                }
            }
        });
    }
    }
    if (col > 15) {
      const button = TH.children[0].children[0];
      button?.parentNode?.removeChild(button);
    }

    if (
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

    if(activeTab == 6){
      if (currentCol.length > 0) {
        // debugge
        // debugger
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
          console.log(finalObj,"finalObj")
          ammendDistributionItcdetailsColumn.forEach((ele, index) => {
            const columnIndex = index;
            const buttonExists = document?.querySelector(`#theaderAmends .ht_clone_top thead th:nth-child(${columnIndex + 1}) button`);

            const columnMatchesCondition = Object.keys(finalObj).includes(ele.data);
            // uniq.some(col1 => ele?.data.includes(col1));

            // Check if column value is not null
         const columnValueValid = finalObj[ele.data] !== null &&  finalObj[ele.data] !== undefined && finalObj[ele.data] !== "";
        //  console.log(columnIndex,"columnValueValid")
        //  console.log(buttonExists,"columnValueValid")
        //  console.log(columnMatchesCondition,"columnValueValid")
        //  console.log(columnValueValid,"columnValueValid")

            if (buttonExists && columnMatchesCondition && columnValueValid) {
                const TH = document.querySelector(`#theaderAmends .ht_clone_top thead th:nth-child(${columnIndex + 1})`);
                if (TH) {
                    TH.classList.add("htFiltersActive");
                    TH.style.color="red"
                } else {
                    TH.classList.remove("htFiltersActive");
                }
            }
        });
    }
    }

    if (col > 19) {
      const button = TH.children[0].children[0];
      button?.parentNode?.removeChild(button);
    }

    if (
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
          delArr.push(purchaseData[i].gstr6Id);
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

                newList(activeTab);

                // purchaseSummaryList(
                //   activeTab,
                //   "",
                //   "",
                //   activeTab == 3 ? "0" : invType,
                //   finFromYear?.value,
                //   monthFrom?.value,
                //   ""
                // );
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

    console.log("searchVal1searchVal1searchVal1", currentCol);

    if (activeTab == 1) {
      hot = hotRef?.current?.hotInstance;

      const Index = currentCol?.findIndex(
        (item) => b2bColumns[coords?.col]?.data == item
      );
      console.log("searchVal1searchVal1searchVal1", Index);
      console.log(searchVal1,"searchVal1searchVal1searchVal1")


      if (Index != -1) {
        setTimeout(function () {
          var searchInput = document?.querySelector(
            ".htUIMultipleSelectSearch.htUIInput"
          );
          if (searchInput !== null) {
            searchInput.children[0].value = searchVal1[Index];
          }
        }, 900);
      } else {
        setTimeout(function () {
          var searchInput = document?.querySelector(
            ".htUIMultipleSelectSearch.htUIInput"
          );
          if (searchInput !== null) {
            searchInput.children[0].value = "";
          }
        }, 900);
      }
    } 
    else if (activeTab == 2) {
      hot = hotRef1?.current?.hotInstance;

      const Index = currentCol?.findIndex(
        (item) => ITCrevisedColumns[coords?.col]?.data == item
      );
      console.log("searchVal1searchVal1searchVal1", Index);
      console.log(searchVal1,"searchVal1searchVal1searchVal1")

      if (Index != -1) {
        setTimeout(function () {
          var searchInput = document?.querySelector(
            ".htUIMultipleSelectSearch.htUIInput"
          );
          if (searchInput?.children[0]) {
            searchInput.children[0].value = searchVal1[Index];
          }
        }, 1000);
      } else {
        setTimeout(function () {
          var searchInput = document?.querySelector(
            ".htUIMultipleSelectSearch.htUIInput"
          );
          if (searchInput?.children[0]) {
            searchInput.children[0].value = "";
          }
        }, 1000);
      }
    } 
    else if (activeTab == 3) {
      hot = hotRef2?.current?.hotInstance;

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
    } 
    else if (activeTab == 4) {
      hot = hotRef3?.current?.hotInstance;
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
    } 
    else if (activeTab == 5) {
      hot = hotRef4?.current?.hotInstance;
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
    } 
    else if (activeTab == 6) {
      hot = hotRef5?.current?.hotInstance;
      const Index = currentCol?.findIndex(
        (item) => ammendDistributionItcdetailsColumn[coords?.col]?.data == item
      );
      console.log("searchVal1searchVal1searchVal1", Index);
      console.log(searchVal1,"searchVal1searchVal1searchVal1")

      if (Index != -1) {
        setTimeout(function () {
          var searchInput = document?.querySelector(
            ".htUIMultipleSelectSearch.htUIInput"
          );
          if (searchInput?.children[0]) {
            searchInput.children[0].value = searchVal1[Index];
          }
        }, 1000);
      } else {
        setTimeout(function () {
          var searchInput = document?.querySelector(
            ".htUIMultipleSelectSearch.htUIInput"
          );
          if (searchInput?.children[0]) {
            searchInput.children[0].value = "";
          }
        }, 1000);
      }
    }
     else if (activeTab == 7) {
      hot = hotRef7?.current?.hotInstance;
      const Index = currentCol?.findIndex(
        (item) => totalITC[coords?.col]?.data == item
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
     else if (activeTab == 8) {
      hot = hotRef8?.current?.hotInstance;
      const Index = currentCol?.findIndex(
        (item) => lateFeeColumns[coords?.col]?.data == item
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
    // if (coords.row == -1 && coords.col == 0) {
    //   if (
    //     !event.target.classList.contains("checker") ||
    //     event.target.classList.contains("checker")
    //   ) {
    //     if (!isChecked) {
    //       isChecked = true;
    //       for (let index = 0; index < totalRows; index++) {
    //         hot?.setDataAtCell(index, 0, true);
    //       }
    //     } else {
    //       isChecked = false;
    //       for (let index = 0; index < totalRows; index++) {
    //         hot?.setDataAtCell(index, 0, false);
    //       }
    //     }
    //   }
    // }

    activeTab == 7 && setCurrentCol1b2cs(coords?.col);
  }

  const filterInvoiceType = (event) => {
    console.log("filter type", url);
    setCurrentCol([]);
    setCurrentCol1(null);
    setSearchVal1([]);
    setPage(0);
    setInvoceTypes(event);

    newList(activeTab);
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

    gstr6PurchaseInvoice
      .exportGSTR6ExportData(
        G_UCParId,
        finFromYear?.value,
        monthFrom?.value,
        gstr1SectionId,
        token,
        subId,
        G_GSTIN,
        LocalFunction.getLocalValue(globleVariable.userId, true)
      )
      .then((res) => {
        if (res?.data?.status == 1 && res?.status == 200) {
          console.log("res1", res);
          setBlock(false);
          downloadURL(res.data.data);
        } else {
          console.log("res2", res);
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
            confirmButton: "btn btn-outline-danger",
          },
          buttonsStyling: false,
        });
      });
  };

  const getOptionsList = () => {
    setBlock(true)
    gstr6PurchaseInvoice
    .getOptionsListForCheckbox()
    .then((res) => {
      if (res?.data?.status == 1 && res?.status == 200) {
        console.log("resultAyega", res?.data?.data);
        setBlock(false);
        setSupplyType(res?.data?.data?.supplyType);
        setUnitType(res?.data?.data?.unitType)
        setPlaceOfSupply(res?.data?.data?.placeOfSupply)
        setSezSupplier(res?.data?.data?.sezSupplier)
        setEligibilityofITC(res?.data?.data?.eligibilityofITC)
        setNoteType(res?.data?.data?.noteType)
        setIsdDocumentType(res?.data?.data?.isdDocumentType)
        setIsLocatedInSez(res?.data?.data?.isLocatedInSez)
        setRate(res?.data?.data?.rate)
        setAction(res?.data?.data?.action)
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
          confirmButton: "btn btn-outline-danger",
        },
        buttonsStyling: false,
      });
    });
  }
 
  useEffect(() => {
    getOptionsList()
  },[])

// *************************for Tab1  **********

  let dropDonwNameAssign;
  if (b2bColumns[currentCol1]?.data === "SupplyType") {
    dropDonwNameAssign = supplyType;
  } else if (b2bColumns[currentCol1]?.data === "Rate") {
    dropDonwNameAssign = rate;
  }else if (b2bColumns[currentCol1]?.data === "PlaceOfSupply") {
    dropDonwNameAssign = placeOfSupply;
  } else if (b2bColumns[currentCol1]?.data === "Action") {
    dropDonwNameAssign = action;
  }

  let dropDonwName = dropDonwNameAssign !== undefined && dropDonwNameAssign !== null ? dropDonwNameAssign : supplyType;

// ************************for Tab2 ********************

  let dropDonwNameAssignTab2;
  if (ITCrevisedColumns[currentCol1]?.data === "SezSupplier") {
    dropDonwNameAssignTab2 = sezSupplier;
  } else if (ITCrevisedColumns[currentCol1]?.data === "Rate") {
    dropDonwNameAssignTab2 = rate;
  }else if (ITCrevisedColumns[currentCol1]?.data === "PlaceOfSupply") {
    dropDonwNameAssignTab2 = placeOfSupply;
  } else if (ITCrevisedColumns[currentCol1]?.data === "Action") {
    dropDonwNameAssignTab2 = action;
  }

  let dropDonwNameTab2 = dropDonwNameAssignTab2 !== undefined && dropDonwNameAssignTab2 !== null ? dropDonwNameAssignTab2 : sezSupplier;

// ****************************** for Tab 3 ***************

let dropDonwNameAssignTab3;
if (cdnColumns[currentCol1]?.data === "SupplyType") {
  dropDonwNameAssignTab3 = supplyType;
} else if (cdnColumns[currentCol1]?.data === "Rate") {
  dropDonwNameAssignTab3 = rate;
}else if (cdnColumns[currentCol1]?.data === "PlaceOfSupply") {
  dropDonwNameAssignTab3 = placeOfSupply;
} else if (cdnColumns[currentCol1]?.data === "Action") {
  dropDonwNameAssignTab3 = action;
}
else if (cdnColumns[currentCol1]?.data === "NoteType") {
  dropDonwNameAssignTab3 = noteType;
}

let dropDonwNameTab3 = dropDonwNameAssignTab3 !== undefined && dropDonwNameAssignTab3 !== null ? dropDonwNameAssignTab3 : supplyType;

// ****************************** for Tab 4 ***************

let dropDonwNameAssignTab4;
if (cdnaColumns[currentCol1]?.data === "SupplyType") {
  dropDonwNameAssignTab4 = supplyType;
} else if (cdnaColumns[currentCol1]?.data === "Rate") {
  dropDonwNameAssignTab4 = rate;
}else if (cdnaColumns[currentCol1]?.data === "PlaceOfSupply") {
  dropDonwNameAssignTab4 = placeOfSupply;
} else if (cdnaColumns[currentCol1]?.data === "Action") {
  dropDonwNameAssignTab4 = action;
}
else if (cdnaColumns[currentCol1]?.data === "NoteType") {
  dropDonwNameAssignTab4 = noteType;
}

let dropDonwNameTab4 = dropDonwNameAssignTab4 !== undefined && dropDonwNameAssignTab4 !== null ? dropDonwNameAssignTab4 : supplyType;

// ****************************** for Tab 5 ***************

let dropDonwNameAssignTab5;
if (distributionOfItcColumns[currentCol1]?.data === "EligibilityOfITC") {
  dropDonwNameAssignTab5 = eligibilityofITC;
} else if (distributionOfItcColumns[currentCol1]?.data === "UnitType") {
  dropDonwNameAssignTab5 = unitType;
}else if (distributionOfItcColumns[currentCol1]?.data === "SezSupplier") {
  dropDonwNameAssignTab5 = sezSupplier;
} else if (distributionOfItcColumns[currentCol1]?.data === "Action") {
  dropDonwNameAssignTab5 = action;
}
else if (distributionOfItcColumns[currentCol1]?.data === "NoteType") {
  dropDonwNameAssignTab5 = isdDocumentType;
}

let dropDonwNameTab5 = dropDonwNameAssignTab5 !== undefined && dropDonwNameAssignTab5 !== null ? dropDonwNameAssignTab5 : eligibilityofITC;

// ****************************** for Tab 6 ***************

let dropDonwNameAssignTab6;
if (ammendDistributionItcdetailsColumn[currentCol1]?.data === "EligibilityOfITC") {
  dropDonwNameAssignTab6 = eligibilityofITC;
} else if (ammendDistributionItcdetailsColumn[currentCol1]?.data === "UnitType") {
  dropDonwNameAssignTab6 = unitType;
}else if (ammendDistributionItcdetailsColumn[currentCol1]?.data === "SezSupplier") {
  dropDonwNameAssignTab6 = sezSupplier;
} else if (ammendDistributionItcdetailsColumn[currentCol1]?.data === "Action") {
  dropDonwNameAssignTab6 = action;
}
else if (ammendDistributionItcdetailsColumn[currentCol1]?.data === "NoteType") {
  dropDonwNameAssignTab6 = isdDocumentType;
}

let dropDonwNameTab6 = dropDonwNameAssignTab6 !== undefined && dropDonwNameAssignTab6 !== null ? dropDonwNameAssignTab6 : eligibilityofITC;

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
    newList(activeTab);
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

  const upperContent = () => {
    return (
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
                      {totalInvoiceValue
                        ? formatINR(Number(totalInvoiceValue))
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
                        ? formatINR(Number(totalTaxableValue))
                        : 0}
                    </span>
                  </p>
                </td>

                <td>
                  <p className="mb-0">
                    IGST (₹)
                    <br />
                    <span> {IGST ? formatINR(Number(IGST)) : 0}</span>
                  </p>
                </td>
                <td>
                  <p className="mb-0">
                    SGST (₹)
                    <br />
                    <span> {SGST ? formatINR(Number(SGST)) : 0}</span>
                  </p>
                </td>
                <td>
                  <p className="mb-0">
                    CGST (₹)
                    <br />
                    <span> {CGST ? formatINR(Number(CGST)) : 0}</span>
                  </p>
                </td>
                <td>
                  <p className="mb-0">
                    Cess (₹)
                    <br />
                    <span>{Cess ? formatINR(Number(Cess)) : 0}</span>
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
                isDisabled={true}
                value={
                  activeTab == 1
                    ? { label: "B2B", value: "b2b" }
                    : activeTab == 2
                      ? { label: "B2BA", value: "b2ba" }
                      : activeTab == 3
                        ? { label: "CDN", value: "cdn" }
                        : activeTab == 4
                          ? { label: "CDNA", value: "cdna" }
                          : activeTab == 5
                            ? { label: "ITC", value: "itc" }
                            : activeTab == 6
                              ? {
                                label: "AMD ITC",
                                value: "AmendofDistofITC",
                              }
                              : activeTab == 7
                                ? {
                                  label: "Total ITC Available",
                                  value: "totalITCAvailable",
                                }
                                : activeTab == 8
                                  ? {
                                    label: "Late Fee",
                                    value: "AmendofDistofITC",
                                  }
                                  : {}
                }
              />
            </Col>
            {/* <Col sm={6}>
        <Label className="form-label">
          Select Return Period
        </Label>
        <Select
          id="from"
          placeholder="Range"
          isClearable={false}
          theme={selectThemeColors}
          closeMenuOnSelect={true}
          options={panDataFrom}
          className="basic-multi-select"
          classNamePrefix="select"
          components={animatedComponents}
          onChange={selectFromYear}
          value={finFromYear}
        />
      </Col> */}
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
                isDisabled={true}
                value={finFromYear}
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
                isDisabled={true}
                value={monthFrom}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    );
  };

  const paginationComponent = () => {
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
      // <ReactPaginate
      //   breakLabel="..."
      //   nextLabel=""
      //   onPageChange={(e) => handlePageClick(e?.selected)}
      //   pageRangeDisplayed={2}
      //   pageCount={pageCount}
      //   previousLabel=""
      //   renderOnZeroPageCount={null}
      //   marginPagesDisplayed={2}
      //   forcePage={page}
      //   activeClassName="active"
      //   pageClassName="page-item"
      //   breakClassName="page-item"
      //   nextLinkClassName="page-link"
      //   pageLinkClassName="page-link"
      //   breakLinkClassName="page-link"
      //   previousLinkClassName="page-link"
      //   nextClassName="page-item next-item"
      //   previousClassName="page-item prev-item"
      //   containerClassName="pagination react-paginate separated-pagination pagination-sm justify-content-end pe-1 mt-1"
      // />
    );
  };

  useEffect(() => {
    if(purchaseData.length > 0 ){
      setbtnDisable1(false)
    } 
    else{
      setbtnDisable1(true)
    }

  },[purchaseData])


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
            {/* Invoice Table  */}
            {activeTab == 1 && (
              <TabPane tabId="1" key="1">
                {console.log("inv-tab")}

                <Card>
                  <CardBody className="CardBody p-0">{upperContent()}</CardBody>
                </Card>
                <Card>
                  <CardBody className="CardBody p-0">
                    <Row>
                      <Col sm="12">
                        <div>
                          {/* {purchaseData.length > 0 ? ( */}
                            <HotTable
                              id="test"
                              ref={hotRef}
                              style={purchaseData.length > 0 ? "" :  {
                                textAlign: "center",
                                overflowX: "hidden",
                              }}
                              readOnly={true}
                              autoWrapRow={true}
                              data={purchaseData.length > 0 ? purchaseData : [{ SupplierGSTIN: "No Data Found" }] }
                              autoColumnSize={{
                                samplingRatio: 23  // Adjust the samplingRatio as needed
                              }}
                              manualColumnResize={false}
                              afterGetColHeader={theader}
                              rowHeights={RowSize}
                              columnHeaderHeight={columnHeaderSize}
                              stretchH="all"
                              preventOverflow="horizontal"
                              columns={b2bColumns}
                              contextMenu={false}
                              bindRowsWithHeaders={true}
                              licenseKey="non-commercial-and-evaluation"
                              height="auto"
                              afterOnCellMouseDown={localAfterOnCellMouseDown}
                              mergeCells={purchaseData.length > 0 ? false : [{ row: 0, col: 0, rowspan: 1, colspan: 12 }]}
                           
                              cells={function (row, col) {
                                var cp = {};
                                if (col !== null && purchaseData.length > 0) {
                                  cp.renderer = emptyRender;
                                }

                                const hot = hotRef?.current?.hotInstance;
                                cp.className = "child";
                                if (
                                  col == 3 ||
                                  col == 6 ||
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
                                      // const isValidColumn = [0,3, 4, 5, 6, 7, 8, 9,10,11,12,13,14,17].includes(selectedValue);
                                      const isValidColumn = [3,4,5,6,7,8,9,10,11,12].includes(selectedValue);
            
                                      return isValidColumn;
                                    },
                                  },
            
                                  about: { // For CheckBox custom option

                                    name: `<div  style="margin-left:6px">Select Options<label class="float-end text-danger "><a><u id="selectAll">Select All</u></a></label></div> <div  class="checkboxmenu custom-scrollbar"> <div >  <table id="searchTable" >
                                    ${dropDonwName &&
                                      dropDonwName?.map((index) => (
                                        `<tr><td><input class="checkBoxClass" type="checkbox" value="${index?.label}" /> <span class="fw-normal">${index?.label?.length > 20 ? index?.label?.substring(0, 20) + "..." : index?.label}</span> </td></tr>`
                                      )).join('')
                                      }
            
                                      </table></div>
                                      </div>`, // Name can contain HTML 
                                    hidden() {
                                      const selectedCol = this.getSelectedRangeLast().to.col;
                                      const isHiddenCol = ![5,6,7].includes(selectedCol);
            
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
            
                                  option6: generateOption(4, fromAmount, toAmount),
                                  option7: generateOption(8, fromAmountTaxable, toAmountTaxable),
                                  option8: generateOption(9, fromAmountIGST, toAmountIGST),
                                  option9: generateOption(10, fromAmountCGST, toAmountCGST),
                                  option10: generateOption(11, fromAmountSGST, toAmountSGST),
                                  option11: generateOption(12, fromAmountCESS, toAmountCESS),
            
                                  clear: {
                                    name: `<button id='btnClear'  name='Clear' tabIndex="-1"   value='Clear'>Clear</button>`,
                                    
                                    callback: function (key, selection, clickEvent) {
            
                                      var src = clickEvent.target;
            
                                      if (src?.tagName?.toLowerCase() === "button") {
                                        if (clickEvent.target.id == "btnClear") {
                                          const hot = hotRef?.current?.hotInstance;
                                          const selectedValue = hot?.getSelected()[0][1];
                                          const isValidTextColumn = [3,4,8,9,10,11,12,5,6,7].includes(selectedValue);
                                          const isValidCheckBoxColumn = [5,6,7].includes(selectedValue);

                                          if (!isValidTextColumn) {
                                            let x = searchVal1
                                            var value = "";
                                            var columnName = b2bColumns[currentCol1]?.data;
                                            let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
            
                                            // filterObject.push({ [columnName]: value });
                                            if (!searchVal1?.length) {
                                              x.push(value);
                                              let y = currentCol;
                                              y.push(
                                                b2bColumns[currentCol1]?.data
                                              );
                                              filterObject.push({ [columnName]: value });

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
                                                filterObject[Index] = { [columnName]: value }
                                              } else {
                                                x.push(value);
                                                let y = currentCol;
                                                y.push(
                                                  b2bColumns[currentCol1]?.data
                                                );
                                                filterObject.push({ [columnName]: value });
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

                                          else if (hot?.getSelected()[0][1] == 3) {
            
                                            var columnName = b2bColumns[currentCol1]?.data;
                                            var value = '';
                                            setSearchDate('');
                                            setToDate('');
                                            let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
            
                                            // filterObject.push({ [columnName]: value });
                                            if (!searchVal1?.length) {
          
                                              x.push(value);
                                              let y = currentCol;
                                              y.push(
                                                b2bColumns[currentCol1]?.data
                                              );
                                              filterObject.push({ [columnName]: value });
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
                                                filterObject[Index] = { [columnName]: value }
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
                                            setGridCustomFilter(filterObject)
                                            let newFilterData = FilterData(filterObject);
                                            setData([...newFilterData]);
            
                                          }
                                          else if (hot?.getSelected()[0][1] == 4) {
                                            const x = searchVal1
                                            var columnName = b2bColumns[currentCol1]?.data;
                                            var value = '';
                                            setFromAmount('');
                                            setToAmount('');
            
                                            let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                            // filterObject.push({ [columnName]: value });
                                            if (!searchVal1?.length) {
          
                                              x.push(value);
                                              let y = currentCol;
                                              y.push(
                                                b2bColumns[currentCol1]?.data
                                              );
                                              filterObject.push({ [columnName]: value });
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
                                                filterObject[Index] = { [columnName]: value }
                                              } else {
                                                x.push(value);
                                                let y = currentCol;
                                                y.push(
                                                  b2bColumns[currentCol1]?.data
                                                );
                                                filterObject.push({ [columnName]: value });
                                                setSearchVal1(x);
                                                setCurrentCol(y);
                                              }
                                            }
                                            setGridCustomFilter(filterObject)
                                            let newFilterData = FilterData(filterObject);
                                            setData([...newFilterData]);
            
                                          }
                                          else if (hot?.getSelected()[0][1] == 8) {
                                            const x = searchVal1
                                            var columnName = b2bColumns[currentCol1]?.data;
                                            var value = '';
                                            setFromAmountTaxable('');
                                            setToAmountTaxable('');
                                            let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                            // filterObject.push({ [columnName]: value });
                                            if (!searchVal1?.length) {
          
                                              x.push(value);
                                              let y = currentCol;
                                              y.push(
                                                b2bColumns[currentCol1]?.data
                                              );
                                              filterObject.push({ [columnName]: value });
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
                                                filterObject[Index] = { [columnName]: value }
                                              } else {
                                                x.push(value);
                                                let y = currentCol;
                                                y.push(
                                                  b2bColumns[currentCol1]?.data
                                                );
                                                filterObject.push({ [columnName]: value });
                                                setSearchVal1(x);
                                                setCurrentCol(y);
                                              }
                                            }
                                            setGridCustomFilter(filterObject)
                                            let newFilterData = FilterData(filterObject);
                                            setData([...newFilterData]);
            
                                          }
                                          else if (hot?.getSelected()[0][1] == 9) {
                                            const x = searchVal1
                                            var columnName = b2bColumns[currentCol1]?.data;
                                            var value = '';
                                            setFromAmountIGST('');
                                            setToAmountIGST('');
            
                                            let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                            // filterObject.push({ [columnName]: value });
                                            if (!searchVal1?.length) {
          
                                              x.push(value);
                                              let y = currentCol;
                                              y.push(
                                                b2bColumns[currentCol1]?.data
                                              );
                                              filterObject.push({ [columnName]: value });
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
                                                filterObject[Index] = { [columnName]: value }
                                              } else {
                                                x.push(value);
                                                let y = currentCol;
                                                y.push(
                                                  b2bColumns[currentCol1]?.data
                                                );
                                                filterObject.push({ [columnName]: value });
                                                setSearchVal1(x);
                                                setCurrentCol(y);
                                              }
                                            }
                                            
                                            setGridCustomFilter(filterObject)
                                            let newFilterData = FilterData(filterObject);
                                            setData([...newFilterData]);
            
                                          }
                                          else if (hot?.getSelected()[0][1] == 10) {
                                            const x = searchVal1
                                            var columnName = b2bColumns[currentCol1]?.data;
                                            var value = '';
                                            setFromAmountCGST('');
                                            setToAmountCGST('');
            
                                            let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                            // filterObject.push({ [columnName]: value });
                                            if (!searchVal1?.length) {
          
                                              x.push(value);
                                              let y = currentCol;
                                              y.push(
                                                b2bColumns[currentCol1]?.data
                                              );
                                              filterObject.push({ [columnName]: value });
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
                                                filterObject[Index] = { [columnName]: value }
                                              } else {
                                                x.push(value);
                                                let y = currentCol;
                                                y.push(
                                                  b2bColumns[currentCol1]?.data
                                                );
                                                filterObject.push({ [columnName]: value });
                                                setSearchVal1(x);
                                                setCurrentCol(y);
                                              }
                                            }
                                            setGridCustomFilter(filterObject)
                                            let newFilterData = FilterData(filterObject);
                                            setData([...newFilterData]);
            
                                          }
                                          else if (hot?.getSelected()[0][1] == 11) {
                                            const x = searchVal1
                                            var columnName = b2bColumns[currentCol1]?.data;
                                            var value = '';
                                            setFromAmountSGST('');
                                            setToAmountSGST('');
            
                                            let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                            // filterObject.push({ [columnName]: value });
                                            if (!searchVal1?.length) {
          
                                              x.push(value);
                                              let y = currentCol;
                                              y.push(
                                                b2bColumns[currentCol1]?.data
                                              );
                                              filterObject.push({ [columnName]: value });
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
                                                filterObject[Index] = { [columnName]: value }
                                              } else {
                                                x.push(value);
                                                let y = currentCol;
                                                y.push(
                                                  b2bColumns[currentCol1]?.data
                                                );
                                                filterObject.push({ [columnName]: value });
                                                setSearchVal1(x);
                                                setCurrentCol(y);
                                              }
                                            }
                                            setGridCustomFilter(filterObject)
                                            let newFilterData = FilterData(filterObject);
                                            setData([...newFilterData]);
            
                                          }
                                          else if (hot?.getSelected()[0][1] == 12) {
                                            const x = searchVal1
                                            var columnName = b2bColumns[currentCol1]?.data;
                                            var value = '';
                                            setFromAmountCESS('');
                                            setToAmountCESS('');
            
                                            let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                            // filterObject.push({ [columnName]: value });
                                            if (!searchVal1?.length) {
          
                                              x.push(value);
                                              let y = currentCol;
                                              y.push(
                                                b2bColumns[currentCol1]?.data
                                              );
                                              filterObject.push({ [columnName]: value });
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
                                                filterObject[Index] = { [columnName]: value }
                                              } else {
                                                x.push(value);
                                                let y = currentCol;
                                                y.push(
                                                  b2bColumns[currentCol1]?.data
                                                );
                                                filterObject.push({ [columnName]: value });
                                                setSearchVal1(x);
                                                setCurrentCol(y);
                                              }
                                            }
                                            setGridCustomFilter(filterObject)
                                            let newFilterData = FilterData(filterObject);
                                            setData([...newFilterData]);
            
                                          }
                                          else if (isValidCheckBoxColumn) {
                                            let x = searchVal1
                                            var checkboxes = document.getElementsByClassName('checkBoxClass');
            
                                            arrChk = []
                                            setFilterDropDownList([]);
                                            var columnName = b2bColumns[currentCol1]?.data;
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
                                            setGridCustomFilter(filterObject)
                                            let newFilterData = FilterData(filterObject);
                                            setData([...newFilterData]);
            
                                            const updatedFilterDropDownList = filterObject.reduce((acc, item) => {
                                              const { Rate, SupplyType, PlaceOfSupply} = item;
            
                                              const updateList = (list, value) => {
                                                return list.includes(value) ? list : [...list, value];
                                              };
            
                                              if (Rate !== undefined) {
                                                acc.rateDropDownList = updateList(acc.rateDropDownList, Rate);
                                              }  else if (SupplyType !== undefined) {
                                                acc.supplyTypeDropdownList = updateList(acc.supplyTypeDropdownList, SupplyType);
                                              } else if (PlaceOfSupply !== undefined) {
                                                acc.posDropDownList = updateList(acc.posDropDownList, PlaceOfSupply);
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
                                const shouldExcludeCheckBox = [5,6,7].includes(selectedValuecol);
                                
                                if (hot?.getSelected()[0][1] != 3 && hot?.getSelected()[0][1] != 4 && hot?.getSelected()[0][1] != 8 && hot?.getSelected()[0][1] != 9 && hot?.getSelected()[0][1] != 10 && hot?.getSelected()[0][1] != 11 && hot?.getSelected()[0][1] != 12  && hot?.getSelected()[0][1] != 5 && hot?.getSelected()[0][1] != 6 && hot?.getSelected()[0][1] != 7 ) {
                                  let x = searchVal1
                                  var searchInput = document.querySelector(".htUIMultipleSelectSearch.htUIInput");
                                  var value = searchInput?.children[0].value;
                                  //  x.push(value)
                                  var columnName = b2bColumns[currentCol1]?.data;
                                  let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
            
                                  // filterObject.push({ [columnName]: value });
                                  if (!searchVal1?.length) {
            
                                    x.push(value);
                                    let y = currentCol;
                                    y.push(
                                      b2bColumns[currentCol1]?.data
                                    );
                                    filterObject.push({ [columnName]: value });
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
                                      filterObject[Index] = { [columnName]: value }
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
            
                                  setGridCustomFilter(filterObject)
                                  let newFilterData = FilterData(filterObject);
                                  setData([...newFilterData]);
            
                                }


                                else if (selectedValuecol == 3) {
                                  const x = searchVal1
                                  var searchInput1 = document.getElementById("custom1");
                                  var searchInput2 = document.getElementById("custom2");
                                  const invFromDate = searchInput1?.value
                                  const invToDate = searchInput2?.value
                                  var columnName = b2bColumns[currentCol1]?.data;
                                  var value = (searchInput1?.value || searchInput2?.value) && `${invFromDate ? invFromDate : invToDate}to${invToDate ? invToDate : invFromDate}`;
                                  setSearchDate(searchInput1?.value);
                                  setToDate(searchInput2?.value);
                                  let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                  // filterObject.push({ [columnName]: value });
                                  if (!searchVal1?.length) {
                                    x.push(value);
                                    let y = currentCol;
                                    y.push(
                                      b2bColumns[currentCol1]?.data
                                    );
                                    filterObject.push({ [columnName]: value })
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
                                      filterObject[Index] = { [columnName]: value }

                                    } else {
                                      x.push(value);
                                      let y = currentCol;
                                      y.push(
                                        b2bColumns[currentCol1]?.data
                                      );
                                      filterObject.push({ [columnName]: value })
                                      setSearchVal1(x);
                                      setCurrentCol(y);
                                    }
                                    
                                  }
                                  setGridCustomFilter(filterObject)
                                  let newFilterData = FilterData(filterObject);
                                  setData([...newFilterData]);
                                  // filterObject[Index] = { [columnName]: value }
                                }
            
                                else if (hot?.getSelected()[0][1] == 4) {
                                  const x = searchVal1
                                  var searchInput1 = document.getElementById("amount1");
                                  var searchInput2 = document.getElementById("amount2");
                                  const invFromDate = (searchInput1?.value)?.replaceAll(",", "")
                                  const invToDate = (searchInput2?.value)?.replaceAll(",", "")
                                  var columnName = b2bColumns[currentCol1]?.data;
                                  var value = `${invFromDate}to${invToDate}`;
                                  console.log(value,"wwwweeee")
                                  setFromAmount(searchInput1?.value);
                                  setToAmount(searchInput2?.value);
                                  let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                  // filterObject.push({ [columnName]: value });
                                  if (!searchVal1?.length) {
                                    x.push(value);
                                    let y = currentCol;
                                    y.push(
                                      b2bColumns[currentCol1]?.data
                                    );
                                    filterObject.push({ [columnName]: value });

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
                                      filterObject[Index] = { [columnName]: value }
                                    } else {
                                      x.push(value);
                                      let y = currentCol;
                                      y.push(
                                        b2bColumns[currentCol1]?.data
                                      );
                                      filterObject.push({ [columnName]: value });
                                      setSearchVal1(x);
                                      setCurrentCol(y);
                                    }
                                    
                                  }
                                  setGridCustomFilter(filterObject)
                                  let newFilterData = FilterData(filterObject);
                                  setData([...newFilterData]);
            
                                }
            
                                else if (hot?.getSelected()[0][1] == 8) {
                                  const x = searchVal1
                                  var searchInput1 = document.getElementById("amount1");
                                  var searchInput2 = document.getElementById("amount2");
                                  const invFromDate = (searchInput1?.value)?.replaceAll(",", "")
                                  const invToDate = (searchInput2?.value)?.replaceAll(",", "")
                                  var columnName = b2bColumns[currentCol1]?.data;
                                  // var value = (searchInput1?.value || searchInput2?.value) && `${invFromDate ? invFromDate : invToDate}to${invToDate ? invToDate : invFromDate}`;
                                  var value = `${invFromDate}to${invToDate}`;
                                  setFromAmountTaxable(searchInput1?.value);
                                  setToAmountTaxable(searchInput2?.value);
                                  let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                  console.log(filterObject)
                                  // filterObject.push({ [columnName]: value });
                                  if (!searchVal1?.length) {
                                    x.push(value);
                                    let y = currentCol;
                                    y.push(
                                      b2bColumns[currentCol1]?.data
                                    );
                                    filterObject.push({ [columnName]: value });
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
                                      filterObject[Index] = { [columnName]: value }
                                    } else {
                                      x.push(value);
                                      let y = currentCol;
                                      y.push(
                                        b2bColumns[currentCol1]?.data
                                      );
                                      filterObject.push({ [columnName]: value });

                                      setSearchVal1(x);
                                      setCurrentCol(y);
                                    }
                                    
                                  }
                                  setGridCustomFilter(filterObject)
                                  let newFilterData = FilterData(filterObject);
                                  setData([...newFilterData]);
            
                                }
            
                                else if (hot?.getSelected()[0][1] == 9) {
                                  const x = searchVal1
                                  var searchInput1 = document.getElementById("amount1");
                                  var searchInput2 = document.getElementById("amount2");
                                  const fromAmount = (searchInput1?.value)?.replaceAll(",", "")
                                  const toAmount = (searchInput2?.value)?.replaceAll(",", "")
                                  var columnName = b2bColumns[currentCol1]?.data;
                                  // var value = (searchInput1?.value || searchInput2?.value) && `${fromAmount ? fromAmount : toAmount}to${toAmount ? toAmount : fromAmount}`;
                                  var value = `${fromAmount}to${toAmount}`;
                                  setFromAmountIGST(searchInput1?.value);
                                  setToAmountIGST(searchInput2?.value);
                                  let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                  // filterObject.push({ [columnName]: value });
                                  if (!searchVal1?.length) {
                                    x.push(value);
                                    let y = currentCol;
                                    y.push(
                                      b2bColumns[currentCol1]?.data
                                    );
                                    filterObject.push({ [columnName]: value });
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
                                      filterObject[Index] = { [columnName]: value }
                                    } else {
                                      x.push(value);
                                      let y = currentCol;
                                      y.push(
                                        b2bColumns[currentCol1]?.data
                                      );
                                      filterObject.push({ [columnName]: value });
                                      setSearchVal1(x);
                                      setCurrentCol(y);
                                    }
                                    
                                  }
                                  setGridCustomFilter(filterObject)
                                  let newFilterData = FilterData(filterObject);
                                  setData([...newFilterData]);
            
                                }
            
                                else if (hot?.getSelected()[0][1] == 10) {
                                  const x = searchVal1
                                  var searchInput1 = document.getElementById("amount1");
                                  var searchInput2 = document.getElementById("amount2");
                                  const fromAmount = (searchInput1?.value)?.replaceAll(",", "")
                                  const toAmount = (searchInput2?.value)?.replaceAll(",", "")
                                  var columnName = b2bColumns[currentCol1]?.data;
                                  // var value = (searchInput1?.value || searchInput2?.value) && `${fromAmount ? fromAmount : toAmount}to${toAmount ? toAmount : fromAmount}`;
                                  var value = `${fromAmount}to${toAmount}`;
                                  setFromAmountCGST(searchInput1?.value);
                                  setToAmountCGST(searchInput2?.value);
                                  let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                  // filterObject.push({ [columnName]: value });
                                  if (!searchVal1?.length) {
                                    x.push(value);
                                    let y = currentCol;
                                    y.push(
                                      b2bColumns[currentCol1]?.data
                                    );
                                    filterObject.push({ [columnName]: value });
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
                                      filterObject[Index] = { [columnName]: value }
                                    } else {
                                      x.push(value);
                                      let y = currentCol;
                                      y.push(
                                        b2bColumns[currentCol1]?.data
                                      );
                                      filterObject.push({ [columnName]: value });
                                      setSearchVal1(x);
                                      setCurrentCol(y);
                                    }
                                    
                                  }
                                  setGridCustomFilter(filterObject)
                                  let newFilterData = FilterData(filterObject);
                                  setData([...newFilterData]);
            
                                }
            
                                else if (hot?.getSelected()[0][1] == 11) {
                                  const x =  searchVal1
                                  var searchInput1 = document.getElementById("amount1");
                                  var searchInput2 = document.getElementById("amount2");
                                  const fromAmount = (searchInput1?.value)?.replaceAll(",", "")
                                  const toAmount = (searchInput2?.value)?.replaceAll(",", "")
                                  var columnName = b2bColumns[currentCol1]?.data;
                                  var value = `${fromAmount}to${toAmount}`;
                                  // var value = (searchInput1?.value || searchInput2?.value) && `${fromAmount ? fromAmount : toAmount}to${toAmount ? toAmount : fromAmount}`;
                                  setFromAmountSGST(searchInput1?.value);
                                  setToAmountSGST(searchInput2?.value);
                                  let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                  // filterObject.push({ [columnName]: value });
                                  if (!searchVal1?.length) {
                                    x.push(value);
                                    let y = currentCol;
                                    y.push(
                                      b2bColumns[currentCol1]?.data
                                    );
                                  filterObject.push({ [columnName]: value });
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
                                      filterObject[Index] = { [columnName]: value }
                                    } else {
                                      x.push(value);
                                      let y = currentCol;
                                      y.push(
                                        b2bColumns[currentCol1]?.data
                                      );
                                      filterObject.push({ [columnName]: value });
                                      setSearchVal1(x);
                                      setCurrentCol(y);
                                    }
                                    
                                  }
                                  setGridCustomFilter(filterObject)
                                  let newFilterData = FilterData(filterObject);
                                  setData([...newFilterData]);
            
                                }
            
                                else if (hot?.getSelected()[0][1] == 12) {
                                  const x = searchVal1
                                  var searchInput1 = document.getElementById("amount1");
                                  var searchInput2 = document.getElementById("amount2");
                                  const fromAmount = (searchInput1?.value)?.replaceAll(",", "")
                                  const toAmount = (searchInput2?.value)?.replaceAll(",", "")
                                  var columnName = b2bColumns[currentCol1]?.data;
                                  // var value = (searchInput1?.value || searchInput2?.value) && `${fromAmount ? fromAmount : toAmount}to${toAmount ? toAmount : fromAmount}`;
                                  var value = `${fromAmount}to${toAmount}`;
                                  setFromAmountCESS(searchInput1?.value);
                                  setToAmountCESS(searchInput2?.value);
                                  let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                  // filterObject.push({ [columnName]: value });
                                  if (!searchVal1?.length) {
                                    x.push(value);
                                    let y = currentCol;
                                    y.push(
                                      b2bColumns[currentCol1]?.data
                                    );
                                    filterObject.push({ [columnName]: value });
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
                                      filterObject[Index] = { [columnName]: value }
                                    } else {
                                      x.push(value);
                                      let y = currentCol;
                                      y.push(
                                        b2bColumns[currentCol1]?.data
                                      );
                                      filterObject.push({ [columnName]: value });
                                      setSearchVal1(x);
                                      setCurrentCol(y);
                                    }
                                    
                                  }
                                  setGridCustomFilter(filterObject)
                                  let newFilterData = FilterData(filterObject);
                                  setData([...newFilterData]);
            
                                }
            
                                else if (shouldExcludeCheckBox) {
                                  let x = searchVal1
                                  var checkboxes = document.getElementsByClassName('checkBoxClass');
                                  arrChk = []
                                  setFilterDropDownList([]);
                                  var columnName = b2bColumns[currentCol1]?.data;
                                  let filterObject = !gridCustomFilter ? [] : gridCustomFilter
                                  let filterObject2 = [] 
                                  filterObject = filterObject == null || filterObject.length <= 0 ? [] : filterObject;
            
                                  for (let i = 0; i < checkboxes.length; i++) {
                                    if (checkboxes[i].checked) {
            
                                      arrChk.push({ [columnName]: checkboxes[i].value });
                                      filterObject2.push(checkboxes[i].value);
                                      filterObject.push({ [columnName]: checkboxes[i].value });
                                    } else {
            
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
                                      filterObject = uniqueArray
                                      const index = filterObject.findIndex(obj => obj[columnName] === checkboxes[i].value);
                                      if (index !== -1) {
            
                                        delete filterObject[index][columnName];
                                      }
                                    }
                                  }
                                  var value = filterObject2.join("@#@#")
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
                                  setGridCustomFilter(filterObject)
                                  let newFilterData = FilterData(filterObject);
                                  setData([...newFilterData]);
            
                                  const updatedFilterDropDownList = filterObject.reduce((acc, item) => {
                                    const { Rate, SupplyType, PlaceOfSupply,  } = item;
            
                                    const updateList = (list, value) => {
                                      return list.includes(value) ? list : [...list, value];
                                    };
            
                                    if (Rate !== undefined) {
                                      acc.rateDropDownList = updateList(acc.rateDropDownList, Rate);
                                    }  else if (SupplyType !== undefined) {
                                      acc.supplyTypeDropdownList = updateList(acc.supplyTypeDropdownList, SupplyType);
                                    } else if (PlaceOfSupply !== undefined) {
                                      acc.posDropDownList = updateList(acc.posDropDownList, PlaceOfSupply);
                                    } 
  
                                    return acc;
                                  }, { rateDropDownList: [], supplyTypeDropdownList: [],  posDropDownList: []});
  
                                  setFilterDropDownList(updatedFilterDropDownList);
            
                                }
                              }}
                              viewportColumnRenderingOffset={100}
                            />
                          {paginationComponent()}
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </TabPane>
            )}

            {/* Credit Debit Note Table */}
            {activeTab == 2 && (
              <TabPane tabId="2" key="2">
                {/* <TabPane tabId="1" key="1"> */}
                  <Card>
                    <CardBody className="CardBody p-0">
                      {upperContent()}
                    </CardBody>
                  </Card>
                  <CardBody className="CardBody p-0">
                    <Row>
                      <Col sm="12">
                        <div>
                          {/* {purchaseData.length > 0 ? ( */}
                            <HotTable
                              autoWrapRow={true}
                              style={purchaseData.length > 0 ? "" :  {
                                textAlign: "center",
                                overflowX: "hidden",
                              }}
                              data={purchaseData.length > 0  ?  purchaseData : [{ OriginalSupplierGSTIN: "No Data Found" }]}
                              id="theaderITC"
                              autoColumnSize={{
                                samplingRatio: 23  // Adjust the samplingRatio as needed
                              }}
                              manualColumnResize={false}
                              rowHeights={RowSize}
                              columnHeaderHeight={columnHeaderSize}
                              afterGetColHeader={theaderITC}
                              afterOnCellMouseDown={localAfterOnCellMouseDown}
                              colHeaders={colHeaders}
                              stretchH="all"
                              preventOverflow="horizontal"
                              columns={ITCrevisedColumns}
                              contextMenu={false}
                              bindRowsWithHeaders={true}
                              licenseKey="non-commercial-and-evaluation"
                              height="auto"
                              ref={hotRef1}
                              viewportColumnRenderingOffset={100}
                              mergeCells={purchaseData.length > 0 ? false  : [{ row: 0, col: 0, rowspan: 1, colspan: 10 }]}
                              cells={function (row, col) {
                                var cp = {};
                                if (col !== null && purchaseData.length > 0 ) {
                                  cp.renderer = emptyRenderITC;
                                }

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
                                      console.log(
                                        "noon col",
                                        hot.getSelected()[0][1],
                                        hot
                                      );
                                      return (
                                        this.getSelected()[0][1] == 2 ||
                                        this.getSelected()[0][1] == 5 ||
                                        this.getSelected()[0][1] == 7 ||
                                        this.getSelected()[0][1] == 8 ||
                                        this.getSelected()[0][1] == 9 ||
                                        this.getSelected()[0][1] == 10 ||
                                        this.getSelected()[0][1] == 11 ||
                                        this.getSelected()[0][1] == 12 ||
                                        this.getSelected()[0][1] == 13 ||
                                        this.getSelected()[0][1] == 14 ||
                                        this.getSelected()[0][1] == 15
                                      );
                                    },
                                  },

                                  about: { // For CheckBox custom option

                                    name: `<div  style="margin-left:6px">Select Options<label class="float-end text-danger "><a><u id="selectAll">Select All</u></a></label></div> <div  class="checkboxmenu custom-scrollbar"> <div >  <table id="searchTable" >
                                    ${dropDonwNameTab2 &&
                                      dropDonwNameTab2?.map((index) => (
                                        `<tr><td><input class="checkBoxClass" type="checkbox" value="${index?.label}" /> <span class="fw-normal">${index?.label?.length > 20 ? index?.label?.substring(0, 20) + "..." : index?.label}</span> </td></tr>`
                                      )).join('')
                                      }
            
                                      </table></div>
                                      </div>`, // Name can contain HTML 
                                    hidden() {
                                      const selectedCol = this.getSelectedRangeLast().to.col;
                                      const isHiddenCol = ![8,9,10].includes(selectedCol);
            
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
                                      return this.getSelectedRangeLast().to.col != 2;
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
                                  option7: generateOption(7, fromAmount, toAmount),
                                  option8: generateOption(11, fromAmountTaxable, toAmountTaxable),
                                  option9: generateOption(12, fromAmountIGST, toAmountIGST),
                                  option10: generateOption(13, fromAmountCGST, toAmountCGST),
                                  option11: generateOption(14, fromAmountSGST, toAmountSGST),
                                  option12: generateOption(15, fromAmountCESS, toAmountCESS),

                                  clear: {
                                    name: `<button id='btnClear'  name='Clear' tabIndex="-1"   value='Clear'>Clear</button>`,
                                    
                                    callback: function (key, selection, clickEvent) {
            
                                      var src = clickEvent.target;
            
                                      if (src?.tagName?.toLowerCase() === "button") {
                                        if (clickEvent.target.id == "btnClear") {
                                          const hot = hotRef1?.current?.hotInstance;
                                          const selectedValue = hot?.getSelected()[0][1];
                                          const isValidTextColumn = [2,5,7,8,9,10,11,12,13,14,15].includes(selectedValue);
                                          const isValidCheckBoxColumn = [8,9,10].includes(selectedValue);

                                          if (!isValidTextColumn) {
                                            let x = searchVal1
                                            var value = "";
                                            var columnName = ITCrevisedColumns[currentCol1]?.data;
                                            let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                                            if (!searchVal1?.length) {
          
                                              x.push(value);
                                              let y = currentCol;
                                              y.push(
                                                ITCrevisedColumns[currentCol1]?.data
                                              );
                                              filterObject.push({ [columnName]: value });
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
                                                filterObject[Index] = { [columnName]: value }
                                              } else {
                                                x.push(value);
                                                let y = currentCol;
                                                y.push(
                                                  ITCrevisedColumns[currentCol1]?.data
                                                );
                                                filterObject.push({ [columnName]: value });
                                                setSearchVal1(x);
                                                setCurrentCol(y);
                                              }
                                            }

                                            setGridCustomFilter(filterObject)
                                            let newFilterData = FilterData(filterObject);
                                            setData([...newFilterData]);
                                          }

                                          else if (hot?.getSelected()[0][1] == 2) {
                                            let x = searchVal1
                                            var columnName = ITCrevisedColumns[currentCol1]?.data;
                                            var value = '';
                                            setSearchDate('');
                                            setToDate('');
                                            let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                            if (!searchVal1?.length) {
          
                                              x.push(value);
                                              let y = currentCol;
                                              y.push(
                                                ITCrevisedColumns[currentCol1]?.data
                                              );
                                              filterObject.push({ [columnName]: value });
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
                                                filterObject[Index] = { [columnName]: value }
                                              } else {
                                                x.push(value);
                                                let y = currentCol;
                                                y.push(
                                                  ITCrevisedColumns[currentCol1]?.data
                                                );
                                                filterObject.push({ [columnName]: value });
                                                setSearchVal1(x);
                                                setCurrentCol(y);
                                              }
                                            }
                                            setGridCustomFilter(filterObject)
                                            let newFilterData = FilterData(filterObject);
                                            setData([...newFilterData]);
            
                                          }
                                          else if (hot?.getSelected()[0][1] == 5) {
                                            let x = searchVal1
                                            var columnName = ITCrevisedColumns[currentCol1]?.data;
                                            var value = '';
                                            setSearchDate1('');
                                            setSearchDate1To('');
                                            let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                            if (!searchVal1?.length) {
          
                                              x.push(value);
                                              let y = currentCol;
                                              y.push(
                                                ITCrevisedColumns[currentCol1]?.data
                                              );
                                              filterObject.push({ [columnName]: value });
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
                                                filterObject[Index] = { [columnName]: value }
                                              } else {
                                                x.push(value);
                                                let y = currentCol;
                                                y.push(
                                                  ITCrevisedColumns[currentCol1]?.data
                                                );
                                                filterObject.push({ [columnName]: value });
                                                setSearchVal1(x);
                                                setCurrentCol(y);
                                              }
                                            }
                                            setGridCustomFilter(filterObject)
                                            let newFilterData = FilterData(filterObject);
                                            setData([...newFilterData]);
            
                                          }
                                          else if (hot?.getSelected()[0][1] == 7) {
                                            let x = searchVal1
                                            var columnName = ITCrevisedColumns[currentCol1]?.data;
                                            var value = '';
                                            setFromAmount('');
                                            setToAmount('');
            
                                            let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                            if (!searchVal1?.length) {
          
                                              x.push(value);
                                              let y = currentCol;
                                              y.push(
                                                ITCrevisedColumns[currentCol1]?.data
                                              );
                                              filterObject.push({ [columnName]: value });
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
                                                filterObject[Index] = { [columnName]: value }
                                              } else {
                                                x.push(value);
                                                let y = currentCol;
                                                y.push(
                                                  ITCrevisedColumns[currentCol1]?.data
                                                );
                                                filterObject.push({ [columnName]: value });
                                                setSearchVal1(x);
                                                setCurrentCol(y);
                                              }
                                            }
                                            setGridCustomFilter(filterObject)
                                            let newFilterData = FilterData(filterObject);
                                            setData([...newFilterData]);
            
                                          }
                                          else if (hot?.getSelected()[0][1] == 11) {
                                            let x = searchVal1
                                            var columnName = ITCrevisedColumns[currentCol1]?.data;
                                            var value = '';
                                            setFromAmountTaxable('');
                                            setToAmountTaxable('');
            
                                            let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                            if (!searchVal1?.length) {
          
                                              x.push(value);
                                              let y = currentCol;
                                              y.push(
                                                ITCrevisedColumns[currentCol1]?.data
                                              );
                                              filterObject.push({ [columnName]: value });
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
                                                filterObject[Index] = { [columnName]: value }
                                              } else {
                                                x.push(value);
                                                let y = currentCol;
                                                y.push(
                                                  ITCrevisedColumns[currentCol1]?.data
                                                );
                                                filterObject.push({ [columnName]: value });
                                                setSearchVal1(x);
                                                setCurrentCol(y);
                                              }
                                            }
                                            setGridCustomFilter(filterObject)
                                            let newFilterData = FilterData(filterObject);
                                            setData([...newFilterData]);
            
                                          }
                                          else if (hot?.getSelected()[0][1] == 12) {
                                            let x = searchVal1
                                            var columnName = ITCrevisedColumns[currentCol1]?.data;
                                            var value = '';
                                            setFromAmountIGST('');
                                            setToAmountIGST('');
            
                                            let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                            if (!searchVal1?.length) {
          
                                              x.push(value);
                                              let y = currentCol;
                                              y.push(
                                                ITCrevisedColumns[currentCol1]?.data
                                              );
                                              filterObject.push({ [columnName]: value });
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
                                                filterObject[Index] = { [columnName]: value }
                                              } else {
                                                x.push(value);
                                                let y = currentCol;
                                                y.push(
                                                  ITCrevisedColumns[currentCol1]?.data
                                                );
                                                filterObject.push({ [columnName]: value });
                                                setSearchVal1(x);
                                                setCurrentCol(y);
                                              }
                                            }
                                            setGridCustomFilter(filterObject)
                                            let newFilterData = FilterData(filterObject);
                                            setData([...newFilterData]);
            
                                          }
                                          else if (hot?.getSelected()[0][1] == 13) {
                                            let x = searchVal1
                                            var columnName = ITCrevisedColumns[currentCol1]?.data;
                                            var value = '';
                                            setFromAmountCGST('');
                                            setToAmountCGST('');
            
                                            let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                            if (!searchVal1?.length) {
          
                                              x.push(value);
                                              let y = currentCol;
                                              y.push(
                                                ITCrevisedColumns[currentCol1]?.data
                                              );
                                              filterObject.push({ [columnName]: value });
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
                                                filterObject[Index] = { [columnName]: value }
                                              } else {
                                                x.push(value);
                                                let y = currentCol;
                                                y.push(
                                                  ITCrevisedColumns[currentCol1]?.data
                                                );
                                                filterObject.push({ [columnName]: value });
                                                setSearchVal1(x);
                                                setCurrentCol(y);
                                              }
                                            }
                                            setGridCustomFilter(filterObject)
                                            let newFilterData = FilterData(filterObject);
                                            setData([...newFilterData]);
            
                                          }
                                          else if (hot?.getSelected()[0][1] == 14) {
                                            let x = searchVal1
                                            var columnName = ITCrevisedColumns[currentCol1]?.data;
                                            var value = '';
                                            setFromAmountSGST('');
                                            setToAmountSGST('');
            
                                            let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                            if (!searchVal1?.length) {
          
                                              x.push(value);
                                              let y = currentCol;
                                              y.push(
                                                ITCrevisedColumns[currentCol1]?.data
                                              );
                                              filterObject.push({ [columnName]: value });
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
                                                filterObject[Index] = { [columnName]: value }
                                              } else {
                                                x.push(value);
                                                let y = currentCol;
                                                y.push(
                                                  ITCrevisedColumns[currentCol1]?.data
                                                );
                                                filterObject.push({ [columnName]: value });
                                                setSearchVal1(x);
                                                setCurrentCol(y);
                                              }
                                            }
                                            setGridCustomFilter(filterObject)
                                            let newFilterData = FilterData(filterObject);
                                            setData([...newFilterData]);
            
                                          }
                                          else if (hot?.getSelected()[0][1] == 15) {
                                            const x = searchVal1
                                            var columnName = ITCrevisedColumns[currentCol1]?.data;
                                            var value = '';
                                            setFromAmountCESS('');
                                            setToAmountCESS('');
            
                                            let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                            if (!searchVal1?.length) {
          
                                              x.push(value);
                                              let y = currentCol;
                                              y.push(
                                                ITCrevisedColumns[currentCol1]?.data
                                              );
                                              filterObject.push({ [columnName]: value });
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
                                                filterObject[Index] = { [columnName]: value }
                                              } else {
                                                x.push(value);
                                                let y = currentCol;
                                                y.push(
                                                  ITCrevisedColumns[currentCol1]?.data
                                                );
                                                filterObject.push({ [columnName]: value });
                                                setSearchVal1(x);
                                                setCurrentCol(y);
                                              }
                                            }
                                            setGridCustomFilter(filterObject)
                                            let newFilterData = FilterData(filterObject);
                                            setData([...newFilterData]);
            
                                          }
                                          else if (isValidCheckBoxColumn) {
                                            let x = searchVal1
                                            var checkboxes = document.getElementsByClassName('checkBoxClass');
            
                                            arrChk = []
                                            setFilterDropDownList([]);
                                            var columnName = ITCrevisedColumns[currentCol1]?.data;
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
                                            setGridCustomFilter(filterObject)
                                            let newFilterData = FilterData(filterObject);
                                            setData([...newFilterData]);
            
                                            const updatedFilterDropDownList = filterObject.reduce((acc, item) => {
                                              const { Rate,SezSupplier, PlaceOfSupply  } = item;
            
                                              const updateList = (list, value) => {
                                                return list.includes(value) ? list : [...list, value];
                                              };
            
                                              if (Rate !== undefined) {
                                                acc.rateDropDownList = updateList(acc.rateDropDownList, Rate);
                                              }  else if (SezSupplier !== undefined) {
                                                acc.sezDropDownList = updateList(acc.sezDropDownList, SezSupplier);
                                              } else if (PlaceOfSupply !== undefined) {
                                                acc.posDropDownList = updateList(acc.posDropDownList, PlaceOfSupply);
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
                                const hot = hotRef1?.current?.hotInstance;
                                const selectedValuecol = hot?.getSelected()[0][1];
                                // const shouldExcludeTextBox = [3, 5, 6, 4, 7, 8, 9, 10, 11, 12, 13, 14, 17].includes(selectedValuecol);
                                const shouldExcludeCheckBox = [8,9,10].includes(selectedValuecol);
                                if (hot?.getSelected()[0][1] != 2 && hot?.getSelected()[0][1] != 5 && hot?.getSelected()[0][1] != 7 && hot?.getSelected()[0][1] != 11 && hot?.getSelected()[0][1] != 12 && hot?.getSelected()[0][1] != 13 && hot?.getSelected()[0][1] != 14 && hot?.getSelected()[0][1] != 15 && hot?.getSelected()[0][1] != 8 && hot?.getSelected()[0][1] != 9 && hot?.getSelected()[0][1] != 10) {
                                  let x = searchVal1
                                  var searchInput = document.querySelector(".htUIMultipleSelectSearch.htUIInput");
                                  var value = searchInput?.children[0].value;
                                  //  x.push(value)
                                  var columnName = ITCrevisedColumns[currentCol1]?.data;
                                  let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
            
                                  // filterObject.push({ [columnName]: value });
                                  if (!searchVal1?.length) {
            
                                    x.push(value);
                                    let y = currentCol;
                                    y.push(
                                      ITCrevisedColumns[currentCol1]?.data
                                    );
                                    filterObject.push({ [columnName]: value });
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
                                      filterObject[Index] = { [columnName]: value }
                                    } else {
                                      x.push(value);
                                      let y = currentCol;
                                      y.push(
                                        ITCrevisedColumns[currentCol1]?.data
                                      );
                                      filterObject.push({ [columnName]: value });
                                      setSearchVal1(x);
                                      setCurrentCol(y);
                                    }
                                  }
            
                                  setGridCustomFilter(filterObject)
                                  let newFilterData = FilterData(filterObject);
                                  setData([...newFilterData]);
            
                                }
                                else if (selectedValuecol == 2) {
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
                                  // filterObject.push({ [columnName]: value });
                                  if (!searchVal1?.length) {
          
                                    x.push(value);
                                    let y = currentCol;
                                    y.push(
                                      ITCrevisedColumns[currentCol1]?.data
                                    );
                                    filterObject.push({ [columnName]: value });
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
                                      filterObject[Index] = { [columnName]: value }
                                    } else {
                                      x.push(value);
                                      let y = currentCol;
                                      y.push(
                                        ITCrevisedColumns[currentCol1]?.data
                                      );
                                      filterObject.push({ [columnName]: value });
                                      setSearchVal1(x);
                                      setCurrentCol(y);
                                    }
                                  }
                                  setCurrentCol(y)
                                  setGridCustomFilter(filterObject)
                                  let newFilterData = FilterData(filterObject);
                                  setData([...newFilterData]);
            
                                }

                                else if (selectedValuecol == 5) {
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

                                  if (!searchVal1?.length) {
          
                                    x.push(value);
                                    let y = currentCol;
                                    y.push(
                                      ITCrevisedColumns[currentCol1]?.data
                                    );
                                    filterObject.push({ [columnName]: value });
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
                                      filterObject[Index] = { [columnName]: value }
                                    } else {
                                      x.push(value);
                                      let y = currentCol;
                                      y.push(
                                        ITCrevisedColumns[currentCol1]?.data
                                      );
                                      filterObject.push({ [columnName]: value });
                                      setSearchVal1(x);
                                      setCurrentCol(y);
                                    }
                                  }
                                  setGridCustomFilter(filterObject)
                                  let newFilterData = FilterData(filterObject);
                                  setData([...newFilterData]);
            
                                }
            
                                else if (hot?.getSelected()[0][1] == 7) {
                                  const x = searchVal1
                                  var searchInput1 = document.getElementById("amount1");
                                  var searchInput2 = document.getElementById("amount2");
                                  const invFromDate = searchInput1?.value
                                  const invToDate = searchInput2?.value
                                  var columnName = ITCrevisedColumns[currentCol1]?.data;
                                  // var value = (searchInput1?.value || searchInput2?.value) && `${invFromDate ? invFromDate : invToDate}to${invToDate ? invToDate : invFromDate}`;
                                  var value = `${invFromDate}to${invToDate}`;
                                  console.log(value,"wwwweeee")
                                  setFromAmount(searchInput1?.value);
                                  setToAmount(searchInput2?.value);
                                  let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                  if (!searchVal1?.length) {
          
                                    x.push(value);
                                    let y = currentCol;
                                    y.push(
                                      ITCrevisedColumns[currentCol1]?.data
                                    );
                                    filterObject.push({ [columnName]: value });
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
                                      filterObject[Index] = { [columnName]: value }
                                    } else {
                                      x.push(value);
                                      let y = currentCol;
                                      y.push(
                                        ITCrevisedColumns[currentCol1]?.data
                                      );
                                      filterObject.push({ [columnName]: value });
                                      setSearchVal1(x);
                                      setCurrentCol(y);
                                    }
                                  }
                                  setGridCustomFilter(filterObject)
                                  let newFilterData = FilterData(filterObject);
                                  setData([...newFilterData]);
            
                                }
            
                                else if (hot?.getSelected()[0][1] ==11) {
                                  const x = searchVal1
                                  var searchInput1 = document.getElementById("amount1");
                                  var searchInput2 = document.getElementById("amount2");
                                  const invFromDate = searchInput1?.value
                                  const invToDate = searchInput2?.value
                                  var columnName = ITCrevisedColumns[currentCol1]?.data;
                                  // var value = (searchInput1?.value || searchInput2?.value) && `${invFromDate ? invFromDate : invToDate}to${invToDate ? invToDate : invFromDate}`;
                                  var value = `${invFromDate}to${invToDate}`;
                                  setFromAmountTaxable(searchInput1?.value);
                                  setToAmountTaxable(searchInput2?.value);
                                  let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                  if (!searchVal1?.length) {
          
                                    x.push(value);
                                    let y = currentCol;
                                    y.push(
                                      ITCrevisedColumns[currentCol1]?.data
                                    );
                                    filterObject.push({ [columnName]: value });
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
                                      filterObject[Index] = { [columnName]: value }
                                    } else {
                                      x.push(value);
                                      let y = currentCol;
                                      y.push(
                                        ITCrevisedColumns[currentCol1]?.data
                                      );
                                      filterObject.push({ [columnName]: value });
                                      setSearchVal1(x);
                                      setCurrentCol(y);
                                    }
                                  }
                                  setGridCustomFilter(filterObject)
                                  let newFilterData = FilterData(filterObject);
                                  setData([...newFilterData]);
            
                                }
            
                                else if (hot?.getSelected()[0][1] == 12) {
                                  const x = searchVal1
                                  var searchInput1 = document.getElementById("amount1");
                                  var searchInput2 = document.getElementById("amount2");
                                  const fromAmount = searchInput1?.value
                                  const toAmount = searchInput2?.value
                                  var columnName = ITCrevisedColumns[currentCol1]?.data;
                                  // var value = (searchInput1?.value || searchInput2?.value) && `${fromAmount ? fromAmount : toAmount}to${toAmount ? toAmount : fromAmount}`;
                                  var value = `${fromAmount}to${toAmount}`;
                                  setFromAmountIGST(searchInput1?.value);
                                  setToAmountIGST(searchInput2?.value);
                                  let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                  if (!searchVal1?.length) {
          
                                    x.push(value);
                                    let y = currentCol;
                                    y.push(
                                      ITCrevisedColumns[currentCol1]?.data
                                    );
                                    filterObject.push({ [columnName]: value });
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
                                      filterObject[Index] = { [columnName]: value }
                                    } else {
                                      x.push(value);
                                      let y = currentCol;
                                      y.push(
                                        ITCrevisedColumns[currentCol1]?.data
                                      );
                                      filterObject.push({ [columnName]: value });
                                      setSearchVal1(x);
                                      setCurrentCol(y);
                                    }
                                  }
                                  setGridCustomFilter(filterObject)
                                  let newFilterData = FilterData(filterObject);
                                  setData([...newFilterData]);
            
                                }
            
                                else if (hot?.getSelected()[0][1] == 13) {
                                  const x = searchVal1
                                  var searchInput1 = document.getElementById("amount1");
                                  var searchInput2 = document.getElementById("amount2");
                                  const fromAmount = searchInput1?.value
                                  const toAmount = searchInput2?.value
                                  var columnName = ITCrevisedColumns[currentCol1]?.data;
                                  // var value = (searchInput1?.value || searchInput2?.value) && `${fromAmount ? fromAmount : toAmount}to${toAmount ? toAmount : fromAmount}`;
                                  var value = `${fromAmount}to${toAmount}`;
                                  setFromAmountCGST(searchInput1?.value);
                                  setToAmountCGST(searchInput2?.value);
                                  let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                  if (!searchVal1?.length) {
          
                                    x.push(value);
                                    let y = currentCol;
                                    y.push(
                                      ITCrevisedColumns[currentCol1]?.data
                                    );
                                    filterObject.push({ [columnName]: value });
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
                                      filterObject[Index] = { [columnName]: value }
                                    } else {
                                      x.push(value);
                                      let y = currentCol;
                                      y.push(
                                        ITCrevisedColumns[currentCol1]?.data
                                      );
                                      filterObject.push({ [columnName]: value });
                                      setSearchVal1(x);
                                      setCurrentCol(y);
                                    }
                                  }
                                  setGridCustomFilter(filterObject)
                                  let newFilterData = FilterData(filterObject);
                                  setData([...newFilterData]);
            
                                }
            
                                else if (hot?.getSelected()[0][1] == 14) {
                                  const x =  searchVal1
                                  var searchInput1 = document.getElementById("amount1");
                                  var searchInput2 = document.getElementById("amount2");
                                  const fromAmount = searchInput1?.value
                                  const toAmount = searchInput2?.value
                                  var columnName = ITCrevisedColumns[currentCol1]?.data;
                                  // var value = (searchInput1?.value || searchInput2?.value) && `${fromAmount ? fromAmount : toAmount}to${toAmount ? toAmount : fromAmount}`;
                                  var value = `${fromAmount}to${toAmount}`;
                                  setFromAmountSGST(searchInput1?.value);
                                  setToAmountSGST(searchInput2?.value);
                                  let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                  if (!searchVal1?.length) {
          
                                    x.push(value);
                                    let y = currentCol;
                                    y.push(
                                      ITCrevisedColumns[currentCol1]?.data
                                    );
                                    filterObject.push({ [columnName]: value });
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
                                      filterObject[Index] = { [columnName]: value }
                                    } else {
                                      x.push(value);
                                      let y = currentCol;
                                      y.push(
                                        ITCrevisedColumns[currentCol1]?.data
                                      );
                                      filterObject.push({ [columnName]: value });
                                      setSearchVal1(x);
                                      setCurrentCol(y);
                                    }
                                  }
                                  setGridCustomFilter(filterObject)
                                  let newFilterData = FilterData(filterObject);
                                  setData([...newFilterData]);
            
                                }
            
                                else if (hot?.getSelected()[0][1] == 15) {
                                  const x = searchVal1
                                  var searchInput1 = document.getElementById("amount1");
                                  var searchInput2 = document.getElementById("amount2");
                                  const fromAmount = searchInput1?.value
                                  const toAmount = searchInput2?.value
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
                                    filterObject.push({ [columnName]: value });
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
                                      filterObject[Index] = { [columnName]: value }
                                    } else {
                                      x.push(value);
                                      let y = currentCol;
                                      y.push(
                                        ITCrevisedColumns[currentCol1]?.data
                                      );
                                      filterObject.push({ [columnName]: value });
                                      setSearchVal1(x);
                                      setCurrentCol(y);
                                    }
                                  }
                                  setGridCustomFilter(filterObject)
                                  let newFilterData = FilterData(filterObject);
                                  setData([...newFilterData]);
            
                                }
            
                                else if (shouldExcludeCheckBox) {
                                  let x = searchVal1
                                  var checkboxes = document.getElementsByClassName('checkBoxClass');
                                  arrChk = []
                                  setFilterDropDownList([]);
                                  var columnName = ITCrevisedColumns[currentCol1]?.data;
                                  let filterObject = !gridCustomFilter ? [] : gridCustomFilter
                                  let filterObject2 = [] 
                                  filterObject = filterObject == null || filterObject.length <= 0 ? [] : filterObject;
            
                                  for (let i = 0; i < checkboxes.length; i++) {
                                    if (checkboxes[i].checked) {
            
                                      arrChk.push({ [columnName]: checkboxes[i].value });
                                      filterObject2.push(checkboxes[i].value);
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
                                  var value = filterObject2.join("@#@#")
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
                                  setGridCustomFilter(filterObject)
                                  let newFilterData = FilterData(filterObject);
                                  setData([...newFilterData]);
            
                                  const updatedFilterDropDownList = filterObject.reduce((acc, item) => {
                                    const { Rate,SezSupplier, PlaceOfSupply  } = item;
  
                                    const updateList = (list, value) => {
                                      return list.includes(value) ? list : [...list, value];
                                    };
  
                                    if (Rate !== undefined) {
                                      acc.rateDropDownList = updateList(acc.rateDropDownList, Rate);
                                    }  else if (SezSupplier !== undefined) {
                                      acc.sezDropDownList = updateList(acc.sezDropDownList, SezSupplier);
                                    } else if (PlaceOfSupply !== undefined) {
                                      acc.posDropDownList = updateList(acc.posDropDownList, PlaceOfSupply);
                                    } 
  
                                    return acc;
                                  }, { rateDropDownList: [], sezDropDownList: [],  posDropDownList: []});
  
                                  setFilterDropDownList(updatedFilterDropDownList);
            
                                }
                              }}

                            />
                          {paginationComponent()}
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                {/* </TabPane> */}
              </TabPane>
            )}

            {/* B2CS/B2CSA */}
            {activeTab == 3 && (
              <TabPane tabId="3" key="3">
                <Card>
                  <CardBody className="CardBody p-0">{upperContent()}</CardBody>
                </Card>
                <Card>
                  <CardBody className="CardBody p-0">
                    <Row>
                      <Col sm="12">
                        <div>
                          {/* {purchaseData.length > 0 ? ( */}
                            <HotTable
                              id="theaderCdn"
                              style={purchaseData.length > 0 ? "" :  {
                                textAlign: "center",
                                overflowX: "hidden",
                              }}
                              autoWrapRow={true}
                              data={purchaseData.length > 0 ? purchaseData : [{ SupplierGSTIN: "No Data Found" }]}
                              // autoColumnSize={true}
                              autoColumnSize={{
                                samplingRatio: 23  // Adjust the samplingRatio as needed
                              }}
                              viewportColumnRenderingOffset={1000}
                              manualColumnResize={false}
                              stretchH="all"
                              colHeaders={colHeaders}
                              afterGetColHeader={theaderCdn}
                              rowHeights={RowSize}
                              columnHeaderHeight={columnHeaderSize}
                              preventOverflow="horizontal"
                              columns={cdnColumns}
                              contextMenu={false}
                              bindRowsWithHeaders={true}
                              licenseKey="non-commercial-and-evaluation"
                              height="auto"
                              ref={hotRef2}
                              afterOnCellMouseDown={localAfterOnCellMouseDown}
                              mergeCells={purchaseData.length > 0 ? false : [
                                { row: 0, col: 0, rowspan: 1, colspan: 11 },
                              ]}
                              cells={function (row, col) {
                                var cp = {};
                                if (col !== null && purchaseData.length > 0) {
                                  cp.renderer = emptyRenderCDN;
                                }
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
                                      console.log(
                                        "noon col",
                                        hot.getSelected()[0][1],
                                        hot
                                      );
                                      return (
                                        this.getSelected()[0][1] == 4 ||  // Date
                                        this.getSelected()[0][1] == 2 ||  // Date
                                        this.getSelected()[0][1] == 5 ||  // Invoice Value
                                        this.getSelected()[0][1] == 7 ||   //  Original Inv Date
                                        this.getSelected()[0][1] == 8 ||   //  Original Inv Date
                                        this.getSelected()[0][1] == 9 ||   //  Original Inv Date
                                        this.getSelected()[0][1] == 10 ||   //  Original Inv Date
                                        this.getSelected()[0][1] == 11 || // 
                                        this.getSelected()[0][1] == 12 || 
                                        this.getSelected()[0][1] == 13 ||
                                        this.getSelected()[0][1] == 14 ||
                                        this.getSelected()[0][1] == 15 
                                      );
                                    },
                                  },

                                  about: { // For CheckBox custom option

                                    name: `<div  style="margin-left:6px">Select Options<label class="float-end text-danger "><a><u id="selectAll">Select All</u></a></label></div> <div  class="checkboxmenu custom-scrollbar"> <div >  <table id="searchTable" >
                                    ${dropDonwNameTab3 &&
                                      dropDonwNameTab3?.map((index) => (
                                        `<tr><td><input class="checkBoxClass" type="checkbox" value="${index?.label}" /> <span class="fw-normal">${index?.label?.length > 20 ? index?.label?.substring(0, 20) + "..." : index?.label}</span> </td></tr>`
                                      )).join('')
                                      }
            
                                      </table></div>
                                      </div>`, // Name can contain HTML 
                                    hidden() {
                                      const selectedCol = this.getSelectedRangeLast().to.col;
                                      const isHiddenCol = ![2,8,9,10].includes(selectedCol);
            
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

                                  option7: generateOption(5, fromAmount, toAmount),
                                  option8: generateOption(11, fromAmountTaxable, toAmountTaxable),
                                  option9: generateOption(12, fromAmountIGST, toAmountIGST),
                                  option10: generateOption(13, fromAmountCGST, toAmountCGST),
                                  option11: generateOption(14, fromAmountSGST, toAmountSGST),
                                  option12: generateOption(15, fromAmountCESS, toAmountCESS),

                                  clear: {
                                    name: `<button id='btnClear'  name='Clear' tabIndex="-1"   value='Clear'>Clear</button>`,
                                    
                                    callback: function (key, selection, clickEvent) {
            
                                      var src = clickEvent.target;
            
                                      if (src?.tagName?.toLowerCase() === "button") {
                                        if (clickEvent.target.id == "btnClear") {
                                          const hot = hotRef2?.current?.hotInstance;
                                          const selectedValue = hot?.getSelected()[0][1];
                                          const isValidTextColumn = [4,5,7,11,12,13,14,15,2,8,9,10].includes(selectedValue);
                                          const isValidCheckBoxColumn = [2,8,9,10].includes(selectedValue);

                                          if (!isValidTextColumn) {
                                            let x = searchVal1
                                            var value = "";
                                            var columnName = cdnColumns[currentCol1]?.data;
                                            let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
            
                                            // filterObject.push({ [columnName]: value });
                                            if (!searchVal1?.length) {
                                              x.push(value);
                                              let y = currentCol;
                                              y.push(
                                                cdnColumns[currentCol1]?.data
                                              );
                                            filterObject.push({ [columnName]: value });

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
                                                filterObject[Index] = { [columnName]: value }
                                              } else {
                                                x.push(value);
                                                let y = currentCol;
                                                y.push(
                                                  cdnColumns[currentCol1]?.data
                                                );
                                                filterObject.push({ [columnName]: value });
                                                setSearchVal1(x);
                                                setCurrentCol(y);
                                              }
                                            }
                                          
                                            setGridCustomFilter(filterObject)
                                            let newFilterData = FilterData(filterObject);
                                            setData([...newFilterData]);
                                          }

                                          else if (hot?.getSelected()[0][1] == 4) {
                                            let x = searchVal1
                                            var columnName = cdnColumns[currentCol1]?.data;
                                            var value = '';
                                            setSearchDate('');
                                            setToDate('');
                                            let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
            
                                            // filterObject.push({ [columnName]: value });
                                            if (!searchVal1?.length) {
          
                                              x.push(value);
                                              let y = currentCol;
                                              y.push(
                                                cdnColumns[currentCol1]?.data
                                              );
                                              filterObject.push({ [columnName]: value });
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
                                                filterObject[Index] = { [columnName]: value }
                                              } else {
                                                x.push(value);
                                                let y = currentCol;
                                                y.push(
                                                  cdnColumns[currentCol1]?.data
                                                );
                                                filterObject.push({ [columnName]: value });
                                                setSearchVal1(x);
                                                setCurrentCol(y);
                                              }
                                            }
                                            setGridCustomFilter(filterObject)
                                            let newFilterData = FilterData(filterObject);
                                            setData([...newFilterData]);
            
                                          }
                                          else if (hot?.getSelected()[0][1] == 5) {
                                            let x = searchVal1
                                            var columnName = cdnColumns[currentCol1]?.data;
                                            var value = '';
                                            setSearchDate1('');
                                            setSearchDate1To('');
                                            let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
            
                                            // filterObject.push({ [columnName]: value });
                                            if (!searchVal1?.length) {
          
                                              x.push(value);
                                              let y = currentCol;
                                              y.push(
                                                cdnColumns[currentCol1]?.data
                                              );
                                              filterObject.push({ [columnName]: value });
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
                                                filterObject[Index] = { [columnName]: value }
                                              } else {
                                                x.push(value);
                                                let y = currentCol;
                                                y.push(
                                                  cdnColumns[currentCol1]?.data
                                                );
                                                filterObject.push({ [columnName]: value });
                                                setSearchVal1(x);
                                                setCurrentCol(y);
                                              }
                                            }
                                            setGridCustomFilter(filterObject)
                                            let newFilterData = FilterData(filterObject);
                                            setData([...newFilterData]);
            
                                          }
                                          else if (hot?.getSelected()[0][1] == 7) {
                                            const x = searchVal1
                                            var columnName = cdnColumns[currentCol1]?.data;
                                            var value = '';
                                            setFromAmount('');
                                            setToAmount('');
            
                                            let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                            if (!searchVal1?.length) {
          
                                              x.push(value);
                                              let y = currentCol;
                                              y.push(
                                                cdnColumns[currentCol1]?.data
                                              );
                                              filterObject.push({ [columnName]: value });
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
                                                filterObject[Index] = { [columnName]: value }
                                              } else {
                                                x.push(value);
                                                let y = currentCol;
                                                y.push(
                                                  cdnColumns[currentCol1]?.data
                                                );
                                                filterObject.push({ [columnName]: value });
                                                setSearchVal1(x);
                                                setCurrentCol(y);
                                              }
                                            }
                                            setGridCustomFilter(filterObject)
                                            let newFilterData = FilterData(filterObject);
                                            setData([...newFilterData]);
            
                                          }
                                          else if (hot?.getSelected()[0][1] == 11) {
                                            const x = searchVal1
                                            var columnName = cdnColumns[currentCol1]?.data;
                                            var value = '';
                                            setFromAmountTaxable('');
                                            setToAmountTaxable('');
            
                                            let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
            
                                            if (!searchVal1?.length) {
          
                                              x.push(value);
                                              let y = currentCol;
                                              y.push(
                                                cdnColumns[currentCol1]?.data
                                              );
                                              filterObject.push({ [columnName]: value });
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
                                                filterObject[Index] = { [columnName]: value }
                                              } else {
                                                x.push(value);
                                                let y = currentCol;
                                                y.push(
                                                  cdnColumns[currentCol1]?.data
                                                );
                                                filterObject.push({ [columnName]: value });
                                                setSearchVal1(x);
                                                setCurrentCol(y);
                                              }
                                            }
                                            setGridCustomFilter(filterObject)
                                            let newFilterData = FilterData(filterObject);
                                            setData([...newFilterData]);
            
                                          }
                                          else if (hot?.getSelected()[0][1] == 12) {
                                            const x = searchVal1
                                            var columnName = cdnColumns[currentCol1]?.data;
                                            var value = '';
                                            setFromAmountIGST('');
                                            setToAmountIGST('');
            
                                            let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                            if (!searchVal1?.length) {
          
                                              x.push(value);
                                              let y = currentCol;
                                              y.push(
                                                cdnColumns[currentCol1]?.data
                                              );
                                              filterObject.push({ [columnName]: value });
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
                                                filterObject[Index] = { [columnName]: value }
                                              } else {
                                                x.push(value);
                                                let y = currentCol;
                                                y.push(
                                                  cdnColumns[currentCol1]?.data
                                                );
                                                filterObject.push({ [columnName]: value });
                                                setSearchVal1(x);
                                                setCurrentCol(y);
                                              }
                                            }
                                            setGridCustomFilter(filterObject)
                                            let newFilterData = FilterData(filterObject);
                                            setData([...newFilterData]);
            
                                          }
                                          else if (hot?.getSelected()[0][1] == 13) {
                                            const x = searchVal1
                                            var columnName = cdnColumns[currentCol1]?.data;
                                            var value = '';
                                            setFromAmountCGST('');
                                            setToAmountCGST('');
            
                                            let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
            
                                            if (!searchVal1?.length) {
          
                                              x.push(value);
                                              let y = currentCol;
                                              y.push(
                                                cdnColumns[currentCol1]?.data
                                              );
                                              filterObject.push({ [columnName]: value });
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
                                                filterObject[Index] = { [columnName]: value }
                                              } else {
                                                x.push(value);
                                                let y = currentCol;
                                                y.push(
                                                  cdnColumns[currentCol1]?.data
                                                );
                                                filterObject.push({ [columnName]: value });
                                                setSearchVal1(x);
                                                setCurrentCol(y);
                                              }
                                            }
                                            setGridCustomFilter(filterObject)
                                            let newFilterData = FilterData(filterObject);
                                            setData([...newFilterData]);
            
                                          }
                                          else if (hot?.getSelected()[0][1] == 14) {
                                            const x = searchVal1
                                            var columnName = cdnColumns[currentCol1]?.data;
                                            var value = '';
                                            setFromAmountSGST('');
                                            setToAmountSGST('');
            
                                            let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
            
                                            if (!searchVal1?.length) {
          
                                              x.push(value);
                                              let y = currentCol;
                                              y.push(
                                                cdnColumns[currentCol1]?.data
                                              );
                                              filterObject.push({ [columnName]: value });
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
                                                filterObject[Index] = { [columnName]: value }
                                              } else {
                                                x.push(value);
                                                let y = currentCol;
                                                y.push(
                                                  cdnColumns[currentCol1]?.data
                                                );
                                                filterObject.push({ [columnName]: value });
                                                setSearchVal1(x);
                                                setCurrentCol(y);
                                              }
                                            }
                                            setGridCustomFilter(filterObject)
                                            let newFilterData = FilterData(filterObject);
                                            setData([...newFilterData]);
            
                                          }
                                          else if (hot?.getSelected()[0][1] == 15) {
                                            const x = searchVal1
                                            var columnName = cdnColumns[currentCol1]?.data;
                                            var value = '';
                                            setFromAmountCESS('');
                                            setToAmountCESS('');
            
                                            let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
            
                                            if (!searchVal1?.length) {
          
                                              x.push(value);
                                              let y = currentCol;
                                              y.push(
                                                cdnColumns[currentCol1]?.data
                                              );
                                              filterObject.push({ [columnName]: value });
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
                                                filterObject[Index] = { [columnName]: value }
                                              } else {
                                                x.push(value);
                                                let y = currentCol;
                                                y.push(
                                                  cdnColumns[currentCol1]?.data
                                                );
                                                filterObject.push({ [columnName]: value });
                                                setSearchVal1(x);
                                                setCurrentCol(y);
                                              }
                                            }
                                            setGridCustomFilter(filterObject)
                                            let newFilterData = FilterData(filterObject);
                                            setData([...newFilterData]);
            
                                          }
                                          else if (isValidCheckBoxColumn) {
            
                                            var checkboxes = document.getElementsByClassName('checkBoxClass');
                                            let x = searchVal1
                                            arrChk = []
                                            setFilterDropDownList([]);
                                            var columnName = cdnColumns[currentCol1]?.data;
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
                                            setGridCustomFilter(filterObject)
                                            let newFilterData = FilterData(filterObject);
                                            setData([...newFilterData]);
            
                                            const updatedFilterDropDownList = filterObject.reduce((acc, item) => {
                                              const { Rate, SupplyType, PlaceOfSupply, NoteType} = item;
            
                                              const updateList = (list, value) => {
                                                return list.includes(value) ? list : [...list, value];
                                              };
            
                                              if (Rate !== undefined) {
                                                acc.rateDropDownList = updateList(acc.rateDropDownList, Rate);
                                              }  else if (SupplyType !== undefined) {
                                                acc.supplyTypeDropdownList = updateList(acc.supplyTypeDropdownList, SupplyType);
                                              } else if (PlaceOfSupply !== undefined) {
                                                acc.posDropDownList = updateList(acc.posDropDownList, PlaceOfSupply);
                                              } 
                                              else if (NoteType !== undefined) {
                                                acc.noteTypeDropDownList = updateList(acc.noteTypeDropDownList, NoteType);
                                              } 
            
                                              return acc;
                                            }, { rateDropDownList: [], supplyTypeDropdownList: [],  posDropDownList: [],NoteType:[]});
            
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
                                const hot = hotRef2?.current?.hotInstance;
                                const selectedValuecol = hot?.getSelected()[0][1];
                                // const shouldExcludeTextBox = [3, 5, 6, 4, 7, 8, 9, 10, 11, 12, 13, 14, 17].includes(selectedValuecol);
                                const shouldExcludeCheckBox = [2,8,9,10].includes(selectedValuecol);
                                if (hot?.getSelected()[0][1] != 4 && hot?.getSelected()[0][1] != 5 && hot?.getSelected()[0][1] != 7 && hot?.getSelected()[0][1] != 11 && hot?.getSelected()[0][1] != 12 && hot?.getSelected()[0][1] != 13 && hot?.getSelected()[0][1] != 14 && hot?.getSelected()[0][1] != 15 && hot?.getSelected()[0][1] != 2 && hot?.getSelected()[0][1] != 8 && hot?.getSelected()[0][1] != 9 && hot?.getSelected()[0][1] != 10) {
                                  let x = searchVal1
                                    var searchInput = document.querySelector(".htUIMultipleSelectSearch.htUIInput");
                                    var value = searchInput?.children[0].value;
                                    //  x.push(value)
                                    var columnName = cdnColumns[currentCol1]?.data;
                                    let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                                    filterObject.push({ [columnName]: value });
                                    if (!searchVal1?.length) {

                                      x.push(value);
                                      let y = currentCol;
                                      y.push(
                                        cdnColumns[currentCol1]?.data
                                      );
                                      filterObject.push({ [columnName]: value });

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
                                        filterObject[Index] = { [columnName]: value }
                                      } else {
                                        x.push(value);
                                        let y = currentCol;
                                        y.push(
                                          cdnColumns[currentCol1]?.data
                                        );
                                        filterObject.push({ [columnName]: value });
                                        setSearchVal1(x);
                                        setCurrentCol(y);
                                      }
                                    }

                                    setGridCustomFilter(filterObject)
                                    let newFilterData = FilterData(filterObject);
                                    setData([...newFilterData]);
            
                                }
                                else if (selectedValuecol == 4) {
                                  const x = searchVal1
                                  var searchInput1 = document.getElementById("custom1");
                                  var searchInput2 = document.getElementById("custom2");
                                  const invFromDate = searchInput1?.value
                                  const invToDate = searchInput2?.value
                                  var columnName = cdnColumns[currentCol1]?.data;
                                  // var value = (searchInput1?.value || searchInput2?.value) && `${invFromDate ? invFromDate : invToDate}to${invToDate ? invToDate : invFromDate}`;
                                  var value = `${invFromDate}to${invToDate}`;
                                  setSearchDate(searchInput1?.value);
                                  setToDate(searchInput2?.value);
                                  let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                  if (!searchVal1?.length) {

                                    x.push(value);
                                    let y = currentCol;
                                    y.push(
                                      cdnColumns[currentCol1]?.data
                                    );
                                    filterObject.push({ [columnName]: value });

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
                                      filterObject[Index] = { [columnName]: value }
                                    } else {
                                      x.push(value);
                                      let y = currentCol;
                                      y.push(
                                        cdnColumns[currentCol1]?.data
                                      );
                                      filterObject.push({ [columnName]: value });
                                      setSearchVal1(x);
                                      setCurrentCol(y);
                                    }
                                  }
                                  setGridCustomFilter(filterObject)
                                  let newFilterData = FilterData(filterObject);
                                  setData([...newFilterData]);
            
                                }

                                else if (selectedValuecol == 7) {
                                  const x = searchVal1
                                  var searchInput1 = document.getElementById("custom1");
                                  var searchInput2 = document.getElementById("custom2");
                                  const invFromDate = searchInput1?.value
                                  const invToDate = searchInput2?.value
                                  var columnName = cdnColumns[currentCol1]?.data;
                                  // var value = (searchInput1?.value || searchInput2?.value) && `${invFromDate ? invFromDate : invToDate}to${invToDate ? invToDate : invFromDate}`;
                                  var value = `${invFromDate}to${invToDate}`;
                                  setSearchDate1(searchInput1?.value);
                                  setSearchDate1To(searchInput2?.value);
                                  let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                  if (!searchVal1?.length) {

                                    x.push(value);
                                    let y = currentCol;
                                    y.push(
                                      cdnColumns[currentCol1]?.data
                                    );
                                    filterObject.push({ [columnName]: value });

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
                                      filterObject[Index] = { [columnName]: value }
                                    } else {
                                      x.push(value);
                                      let y = currentCol;
                                      y.push(
                                        cdnColumns[currentCol1]?.data
                                      );
                                      filterObject.push({ [columnName]: value });
                                      setSearchVal1(x);
                                      setCurrentCol(y);
                                    }
                                  }
                                  setGridCustomFilter(filterObject)
                                  let newFilterData = FilterData(filterObject);
                                  setData([...newFilterData]);
            
                                }
            
                                else if (hot?.getSelected()[0][1] == 5) {
                                  const x = searchVal1
                                  var searchInput1 = document.getElementById("amount1");
                                  var searchInput2 = document.getElementById("amount2");
                                  const invFromDate = searchInput1?.value
                                  const invToDate = searchInput2?.value
                                  var columnName = cdnColumns[currentCol1]?.data;
                                  // var value = (searchInput1?.value || searchInput2?.value) && `${invFromDate ? invFromDate : invToDate}to${invToDate ? invToDate : invFromDate}`;
                                  var value = `${invFromDate}to${invToDate}`;
                                  console.log(value,"wwwweeee")
                                  setFromAmount(searchInput1?.value);
                                  setToAmount(searchInput2?.value);
                                  let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                  if (!searchVal1?.length) {

                                    x.push(value);
                                    let y = currentCol;
                                    y.push(
                                      cdnColumns[currentCol1]?.data
                                    );
                                    filterObject.push({ [columnName]: value });

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
                                      filterObject[Index] = { [columnName]: value }
                                    } else {
                                      x.push(value);
                                      let y = currentCol;
                                      y.push(
                                        cdnColumns[currentCol1]?.data
                                      );
                                      filterObject.push({ [columnName]: value });
                                      setSearchVal1(x);
                                      setCurrentCol(y);
                                    }
                                  }
                                  setGridCustomFilter(filterObject)
                                  let newFilterData = FilterData(filterObject);
                                  setData([...newFilterData]);
            
                                }
            
                                else if (hot?.getSelected()[0][1] ==11) {
                                  const x = searchVal1
                                  var searchInput1 = document.getElementById("amount1");
                                  var searchInput2 = document.getElementById("amount2");
                                  const invFromDate = searchInput1?.value
                                  const invToDate = searchInput2?.value
                                  var columnName = cdnColumns[currentCol1]?.data;
                                  // var value = (searchInput1?.value || searchInput2?.value) && `${invFromDate ? invFromDate : invToDate}to${invToDate ? invToDate : invFromDate}`;
                                  var value = `${invFromDate}to${invToDate}`;
                                  setFromAmountTaxable(searchInput1?.value);
                                  setToAmountTaxable(searchInput2?.value);
                                  let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                  if (!searchVal1?.length) {

                                    x.push(value);
                                    let y = currentCol;
                                    y.push(
                                      cdnColumns[currentCol1]?.data
                                    );
                                    filterObject.push({ [columnName]: value });

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
                                      filterObject[Index] = { [columnName]: value }
                                    } else {
                                      x.push(value);
                                      let y = currentCol;
                                      y.push(
                                        cdnColumns[currentCol1]?.data
                                      );
                                      filterObject.push({ [columnName]: value });
                                      setSearchVal1(x);
                                      setCurrentCol(y);
                                    }
                                  }
                                  setGridCustomFilter(filterObject)
                                  let newFilterData = FilterData(filterObject);
                                  setData([...newFilterData]);
            
                                }
            
                                else if (hot?.getSelected()[0][1] == 12) {
                                  const x = searchVal1
                                  var searchInput1 = document.getElementById("amount1");
                                  var searchInput2 = document.getElementById("amount2");
                                  const fromAmount = searchInput1?.value
                                  const toAmount = searchInput2?.value
                                  var columnName = cdnColumns[currentCol1]?.data;
                                  // var value = (searchInput1?.value || searchInput2?.value) && `${fromAmount ? fromAmount : toAmount}to${toAmount ? toAmount : fromAmount}`;
                                  var value = `${fromAmount}to${toAmount}`;
                                  setFromAmountIGST(searchInput1?.value);
                                  setToAmountIGST(searchInput2?.value);
                                  let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                  if (!searchVal1?.length) {

                                    x.push(value);
                                    let y = currentCol;
                                    y.push(
                                      cdnColumns[currentCol1]?.data
                                    );
                                    filterObject.push({ [columnName]: value });

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
                                      filterObject[Index] = { [columnName]: value }
                                    } else {
                                      x.push(value);
                                      let y = currentCol;
                                      y.push(
                                        cdnColumns[currentCol1]?.data
                                      );
                                      filterObject.push({ [columnName]: value });
                                      setSearchVal1(x);
                                      setCurrentCol(y);
                                    }
                                  }
                                  setGridCustomFilter(filterObject)
                                  let newFilterData = FilterData(filterObject);
                                  setData([...newFilterData]);
            
                                }
            
                                else if (hot?.getSelected()[0][1] == 13) {
                                  const x = searchVal1
                                  var searchInput1 = document.getElementById("amount1");
                                  var searchInput2 = document.getElementById("amount2");
                                  const fromAmount = searchInput1?.value
                                  const toAmount = searchInput2?.value
                                  var columnName = cdnColumns[currentCol1]?.data;
                                  // var value = (searchInput1?.value || searchInput2?.value) && `${fromAmount ? fromAmount : toAmount}to${toAmount ? toAmount : fromAmount}`;
                                  var value = `${fromAmount}to${toAmount}`;
                                  setFromAmountCGST(searchInput1?.value);
                                  setToAmountCGST(searchInput2?.value);
                                  let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                  if (!searchVal1?.length) {

                                    x.push(value);
                                    let y = currentCol;
                                    y.push(
                                      cdnColumns[currentCol1]?.data
                                    );
                                    filterObject.push({ [columnName]: value });

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
                                      filterObject[Index] = { [columnName]: value }
                                    } else {
                                      x.push(value);
                                      let y = currentCol;
                                      y.push(
                                        cdnColumns[currentCol1]?.data
                                      );
                                      filterObject.push({ [columnName]: value });
                                      setSearchVal1(x);
                                      setCurrentCol(y);
                                    }
                                  }
                                  setGridCustomFilter(filterObject)
                                  let newFilterData = FilterData(filterObject);
                                  setData([...newFilterData]);
            
                                }
            
                                else if (hot?.getSelected()[0][1] == 14) {
                                  const x =  searchVal1
                                  var searchInput1 = document.getElementById("amount1");
                                  var searchInput2 = document.getElementById("amount2");
                                  const fromAmount = searchInput1?.value
                                  const toAmount = searchInput2?.value
                                  var columnName = cdnColumns[currentCol1]?.data;
                                  var value = `${fromAmount}to${toAmount}`;
                                  // var value = (searchInput1?.value || searchInput2?.value) && `${fromAmount ? fromAmount : toAmount}to${toAmount ? toAmount : fromAmount}`;
                                  setFromAmountSGST(searchInput1?.value);
                                  setToAmountSGST(searchInput2?.value);
                                  let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                  if (!searchVal1?.length) {

                                    x.push(value);
                                    let y = currentCol;
                                    y.push(
                                      cdnColumns[currentCol1]?.data
                                    );
                                    filterObject.push({ [columnName]: value });

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
                                      filterObject[Index] = { [columnName]: value }
                                    } else {
                                      x.push(value);
                                      let y = currentCol;
                                      y.push(
                                        cdnColumns[currentCol1]?.data
                                      );
                                      filterObject.push({ [columnName]: value });
                                      setSearchVal1(x);
                                      setCurrentCol(y);
                                    }
                                  }
                                  setGridCustomFilter(filterObject)
                                  let newFilterData = FilterData(filterObject);
                                  setData([...newFilterData]);
            
                                }
            
                                else if (hot?.getSelected()[0][1] == 15) {
                                  const x = searchVal1
                                  var searchInput1 = document.getElementById("amount1");
                                  var searchInput2 = document.getElementById("amount2");
                                  const fromAmount = searchInput1?.value
                                  const toAmount = searchInput2?.value
                                  var columnName = cdnColumns[currentCol1]?.data;
                                  // var value = (searchInput1?.value || searchInput2?.value) && `${fromAmount ? fromAmount : toAmount}to${toAmount ? toAmount : fromAmount}`;
                                  var value = `${fromAmount}to${toAmount}`;
                                  setFromAmountCESS(searchInput1?.value);
                                  setToAmountCESS(searchInput2?.value);
                                  let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                  if (!searchVal1?.length) {

                                    x.push(value);
                                    let y = currentCol;
                                    y.push(
                                      cdnColumns[currentCol1]?.data
                                    );
                                    filterObject.push({ [columnName]: value });

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
                                      filterObject[Index] = { [columnName]: value }
                                    } else {
                                      x.push(value);
                                      let y = currentCol;
                                      y.push(
                                        cdnColumns[currentCol1]?.data
                                      );
                                      filterObject.push({ [columnName]: value });
                                      setSearchVal1(x);
                                      setCurrentCol(y);
                                    }
                                  }
                                  setGridCustomFilter(filterObject)
                                  let newFilterData = FilterData(filterObject);
                                  setData([...newFilterData]);
            
                                }
            
                                else if (shouldExcludeCheckBox) {
                                  let x = searchVal1
                                  var checkboxes = document.getElementsByClassName('checkBoxClass');
                                  arrChk = []
                                  setFilterDropDownList([]);
                                  var columnName = cdnColumns[currentCol1]?.data;
                                  let filterObject = !gridCustomFilter ? [] : gridCustomFilter
                                  let filterObject2 = [] 
                                  filterObject = filterObject == null || filterObject.length <= 0 ? [] : filterObject;
            
                                  for (let i = 0; i < checkboxes.length; i++) {
                                    if (checkboxes[i].checked) {
                                      
                                      arrChk.push({ [columnName]: checkboxes[i].value });
                                      filterObject2.push(checkboxes[i].value);
                                      filterObject.push({ [columnName]: checkboxes[i].value });
                                    } else {
            
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
                                      filterObject = uniqueArray
                                      const index = filterObject.findIndex(obj => obj[columnName] === checkboxes[i].value);
                                      if (index !== -1) {
            
                                        delete filterObject[index][columnName];
                                      }
                                    }
                                  }
                                  var value = filterObject2.join("@#@#")
                                  if (!searchVal1?.length) {

                                    x.push(value);
                                    let y = currentCol;
                                    y.push(
                                      cdnColumns[currentCol1]?.data
                                    );
                                    filterObject.push({ [columnName]: value });

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
                                      filterObject[Index] = { [columnName]: value }
                                    } else {
                                      x.push(value);
                                      let y = currentCol;
                                      y.push(
                                        cdnColumns[currentCol1]?.data
                                      );
                                      filterObject.push({ [columnName]: value });
                                      setSearchVal1(x);
                                      setCurrentCol(y);
                                    }
                                  }

                                  setGridCustomFilter(filterObject)
                                  let newFilterData = FilterData(filterObject);
                                  setData([...newFilterData]);
            
                                  const updatedFilterDropDownList = filterObject.reduce((acc, item) => {
                                    const { Rate, SupplyType, PlaceOfSupply, NoteType} = item;
  
                                    const updateList = (list, value) => {
                                      return list.includes(value) ? list : [...list, value];
                                    };
  
                                    if (Rate !== undefined) {
                                      acc.rateDropDownList = updateList(acc.rateDropDownList, Rate);
                                    }  else if (SupplyType !== undefined) {
                                      acc.supplyTypeDropdownList = updateList(acc.supplyTypeDropdownList, SupplyType);
                                    } else if (PlaceOfSupply !== undefined) {
                                      acc.posDropDownList = updateList(acc.posDropDownList, PlaceOfSupply);
                                    } 
                                    else if (NoteType !== undefined) {
                                      acc.noteTypeDropDownList = updateList(acc.noteTypeDropDownList, NoteType);
                                    } 
  
                                    return acc;
                                  }, { rateDropDownList: [], supplyTypeDropdownList: [],  posDropDownList: [],noteTypeDropDownList:[]});
            
                                  setFilterDropDownList(updatedFilterDropDownList);
            
                                }
                              }}
                            />
                         
                          {paginationComponent()}
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </TabPane>
            )}

            {/* AT/ATA/ATADJ/ATADJA - Advance Payment */}
            {activeTab == 4 && (
              <TabPane tabId="4" key="4">
                <Card>
                  <CardBody className="CardBody p-0">{upperContent()}</CardBody>
                </Card>

                <Card>
                  <CardBody className="CardBody p-0">
                    <Row>
                      <Col sm="12">
                        <div>
                          {/* {purchaseData?.length > 0 ? ( */}
                            <HotTable
                              id="theaderCdna"
                              style={purchaseData.length > 0 ? "" :  {
                                textAlign: "center",
                                overflowX: "hidden",
                              }}
                              autoWrapRow={true}
                              data={purchaseData.length > 0 ? purchaseData :[
                                { OriginalSupplierGSTIN: "No Data Found" },
                              ] }
                              autoColumnSize={{
                                samplingRatio: 23  // Adjust the samplingRatio as needed
                              }}
                              viewportColumnRenderingOffset={1000}
                              manualColumnResize={false}
                              afterGetColHeader={theaderCdna}
                              stretchH="all"
                              preventOverflow="horizontal"
                              columns={cdnaColumns}
                              rowHeights={RowSize}
                              columnHeaderHeight={columnHeaderSize}
                              contextMenu={false}
                              bindRowsWithHeaders={true}
                              licenseKey="non-commercial-and-evaluation"
                              height="auto"
                              ref={hotRef3}
                              afterOnCellMouseDown={localAfterOnCellMouseDown}
                              mergeCells={purchaseData.length > 0 ? false : [
                                { row: 0, col: 0, rowspan: 1, colspan: 10 },
                              ]}
                            
                              cells={function (row, col) {
                                var cp = {};
                                if (col !== null && purchaseData.length > 0) {
                                  cp.renderer = emptyRenderCDNA;
                                }
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
                                      console.log(
                                        "noon col",
                                        hot.getSelected()[0][1],
                                        hot
                                      );
                                      return (
                                        this.getSelected()[0][1] == 2 ||  // Date
                                        this.getSelected()[0][1] == 7 ||  // Original In date 1
                                        this.getSelected()[0][1] == 8 ||   // Inv value
                                        this.getSelected()[0][1] ==10 ||   //  Original Inv Date2
                                        this.getSelected()[0][1] == 14 || // 
                                        this.getSelected()[0][1] == 15 || 
                                        this.getSelected()[0][1] == 16 ||
                                        this.getSelected()[0][1] == 17 ||
                                        this.getSelected()[0][1] == 5 ||
                                        this.getSelected()[0][1] == 11 ||
                                        this.getSelected()[0][1] == 12 ||
                                        this.getSelected()[0][1] == 13 ||
                                        this.getSelected()[0][1] == 18 
                                      );
                                    },
                                  },

                                  about: { // For CheckBox custom option

                                    name: `<div  style="margin-left:6px">Select Options<label class="float-end text-danger "><a><u id="selectAll">Select All</u></a></label></div> <div  class="checkboxmenu custom-scrollbar"> <div >  <table id="searchTable" >
                                    ${dropDonwNameTab4 &&
                                      dropDonwNameTab4?.map((index) => (
                                        `<tr><td><input class="checkBoxClass" type="checkbox" value="${index?.label}" /> <span class="fw-normal">${index?.label?.length > 20 ? index?.label?.substring(0, 20) + "..." : index?.label}</span> </td></tr>`
                                      )).join('')
                                      }
            
                                      </table></div>
                                      </div>`, // Name can contain HTML 
                                    hidden() {
                                      const selectedCol = this.getSelectedRangeLast().to.col;
                                      const isHiddenCol = ![5,11,12,13].includes(selectedCol);
            
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
                                      return this.getSelectedRangeLast().to.col != 2;
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
                                    },
                                  },

                                  option8: generateOption(8, fromAmount, toAmount),
                                  option9: generateOption(14, fromAmountTaxable, toAmountTaxable),
                                  option10: generateOption(15, fromAmountIGST, toAmountIGST),
                                  option11: generateOption(16, fromAmountCGST, toAmountCGST),
                                  option12: generateOption(17, fromAmountSGST, toAmountSGST),
                                  option13: generateOption(18, fromAmountCESS, toAmountCESS),

                                  clear: {
                                    name: `<button id='btnClear'  name='Clear' tabIndex="-1"   value='Clear'>Clear</button>`,
                                    
                                    callback: function (key, selection, clickEvent) {
            
                                      var src = clickEvent.target;
            
                                      if (src?.tagName?.toLowerCase() === "button") {
                                        if (clickEvent.target.id == "btnClear") {
                                          const hot = hotRef3?.current?.hotInstance;
                                          const selectedValue = hot?.getSelected()[0][1];
                                          const isValidTextColumn = [2,7,8,10,14,15,16,17,18,5,11,12,13].includes(selectedValue);
                                          const isValidCheckBoxColumn = [5,11,12,13].includes(selectedValue);

                                          if (!isValidTextColumn) {
                                            let x = searchVal1
                                            var value = "";
                                            var columnName = cdnaColumns[currentCol1]?.data;
                                            let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
            
                                            // filterObject.push({ [columnName]: value });
                                            if (!searchVal1?.length) {
                                              x.push(value);
                                              let y = currentCol;
                                              y.push(
                                                cdnaColumns[currentCol1]?.data
                                              );
                                              filterObject.push({ [columnName]: value });
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
                                                filterObject[Index] = { [columnName]: value }
                                              } else {
                                                x.push(value);
                                                let y = currentCol;
                                                y.push(
                                                  cdnaColumns[currentCol1]?.data
                                                );
                                                filterObject.push({ [columnName]: value });
                                                setSearchVal1(x);
                                                setCurrentCol(y);
                                              }
                                            }
                                        
                                            setGridCustomFilter(filterObject)
                                            let newFilterData = FilterData(filterObject);
                                            setData([...newFilterData]);
            
                                          }

                                          else if (hot?.getSelected()[0][1] == 2) {
                                            let x = searchVal1
                                            var columnName = cdnaColumns[currentCol1]?.data;
                                            var value = '';
                                            setSearchDate('');
                                            setToDate('');
                                            let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
            
                                            // filterObject.push({ [columnName]: value });
                                            if (!searchVal1?.length) {
                                              x.push(value);
                                              let y = currentCol;
                                              y.push(
                                                cdnaColumns[currentCol1]?.data
                                              );
                                              filterObject.push({ [columnName]: value });
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
                                                filterObject[Index] = { [columnName]: value }
                                              } else {
                                                x.push(value);
                                                let y = currentCol;
                                                y.push(
                                                  cdnaColumns[currentCol1]?.data
                                                );
                                                filterObject.push({ [columnName]: value });
                                                setSearchVal1(x);
                                                setCurrentCol(y);
                                              }
                                            }
                                            setGridCustomFilter(filterObject)
                                            let newFilterData = FilterData(filterObject);
                                            setData([...newFilterData]);
            
                                          }
                                          else if (hot?.getSelected()[0][1] == 7) {
                                            let x = searchVal1
                                            var columnName = cdnaColumns[currentCol1]?.data;
                                            var value = '';
                                            setSearchDate1('');
                                            setSearchDate1To('');
                                            let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
            
                                            // filterObject.push({ [columnName]: value });
                                            if (!searchVal1?.length) {
                                              x.push(value);
                                              let y = currentCol;
                                              y.push(
                                                cdnaColumns[currentCol1]?.data
                                              );
                                              filterObject.push({ [columnName]: value });
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
                                                filterObject[Index] = { [columnName]: value }
                                              } else {
                                                x.push(value);
                                                let y = currentCol;
                                                y.push(
                                                  cdnaColumns[currentCol1]?.data
                                                );
                                                filterObject.push({ [columnName]: value });
                                                setSearchVal1(x);
                                                setCurrentCol(y);
                                              }
                                            }
                                            setGridCustomFilter(filterObject)
                                            let newFilterData = FilterData(filterObject);
                                            setData([...newFilterData]);
            
                                          }
                                          else if (hot?.getSelected()[0][1] == 10) {
                                            let x = searchVal1
                                            var columnName = cdnaColumns[currentCol1]?.data;
                                            var value = '';
                                            setSearchDate2('');
                                            setSearchDate2To('');
                                            let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
            
                                            // filterObject.push({ [columnName]: value });
                                            if (!searchVal1?.length) {
                                              x.push(value);
                                              let y = currentCol;
                                              y.push(
                                                cdnaColumns[currentCol1]?.data
                                              );
                                              filterObject.push({ [columnName]: value });
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
                                                filterObject[Index] = { [columnName]: value }
                                              } else {
                                                x.push(value);
                                                let y = currentCol;
                                                y.push(
                                                  cdnaColumns[currentCol1]?.data
                                                );
                                                filterObject.push({ [columnName]: value });
                                                setSearchVal1(x);
                                                setCurrentCol(y);
                                              }
                                            }
                                            setGridCustomFilter(filterObject)
                                            let newFilterData = FilterData(filterObject);
                                            setData([...newFilterData]);
            
                                          }
                                          else if (hot?.getSelected()[0][1] == 8) {
                                            const x = searchVal1
                                            var columnName = cdnaColumns[currentCol1]?.data;
                                            var value = '';
                                            setFromAmount('');
                                            setToAmount('');
            
                                            let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                            if (!searchVal1?.length) {
                                              x.push(value);
                                              let y = currentCol;
                                              y.push(
                                                cdnaColumns[currentCol1]?.data
                                              );
                                              filterObject.push({ [columnName]: value });
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
                                                filterObject[Index] = { [columnName]: value }
                                              } else {
                                                x.push(value);
                                                let y = currentCol;
                                                y.push(
                                                  cdnaColumns[currentCol1]?.data
                                                );
                                                filterObject.push({ [columnName]: value });
                                                setSearchVal1(x);
                                                setCurrentCol(y);
                                              }
                                            }
                                            setGridCustomFilter(filterObject)
                                            let newFilterData = FilterData(filterObject);
                                            setData([...newFilterData]);
            
                                          }
                                          else if (hot?.getSelected()[0][1] == 14) {
                                            const x = searchVal1
                                            var columnName = cdnaColumns[currentCol1]?.data;
                                            var value = '';
                                            setFromAmountTaxable('');
                                            setToAmountTaxable('');
            
                                            let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                            if (!searchVal1?.length) {
                                              x.push(value);
                                              let y = currentCol;
                                              y.push(
                                                cdnaColumns[currentCol1]?.data
                                              );
                                              filterObject.push({ [columnName]: value });
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
                                                filterObject[Index] = { [columnName]: value }
                                              } else {
                                                x.push(value);
                                                let y = currentCol;
                                                y.push(
                                                  cdnaColumns[currentCol1]?.data
                                                );
                                                filterObject.push({ [columnName]: value });
                                                setSearchVal1(x);
                                                setCurrentCol(y);
                                              }
                                            }
                                            setGridCustomFilter(filterObject)
                                            let newFilterData = FilterData(filterObject);
                                            setData([...newFilterData]);
            
                                          }
                                          else if (hot?.getSelected()[0][1] == 15) {
                                            const x = searchVal1
                                            var columnName = cdnaColumns[currentCol1]?.data;
                                            var value = '';
                                            setFromAmountIGST('');
                                            setToAmountIGST('');
            
                                            let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                            if (!searchVal1?.length) {
                                              x.push(value);
                                              let y = currentCol;
                                              y.push(
                                                cdnaColumns[currentCol1]?.data
                                              );
                                              filterObject.push({ [columnName]: value });
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
                                                filterObject[Index] = { [columnName]: value }
                                              } else {
                                                x.push(value);
                                                let y = currentCol;
                                                y.push(
                                                  cdnaColumns[currentCol1]?.data
                                                );
                                                filterObject.push({ [columnName]: value });
                                                setSearchVal1(x);
                                                setCurrentCol(y);
                                              }
                                            }
                                            setGridCustomFilter(filterObject)
                                            let newFilterData = FilterData(filterObject);
                                            setData([...newFilterData]);
            
                                          }
                                          else if (hot?.getSelected()[0][1] == 16) {
                                            const x = searchVal1
                                            var columnName = cdnaColumns[currentCol1]?.data;
                                            var value = '';
                                            setFromAmountCGST('');
                                            setToAmountCGST('');
            
                                            let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
            
                                            if (!searchVal1?.length) {
                                              x.push(value);
                                              let y = currentCol;
                                              y.push(
                                                cdnaColumns[currentCol1]?.data
                                              );
                                              filterObject.push({ [columnName]: value });
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
                                                filterObject[Index] = { [columnName]: value }
                                              } else {
                                                x.push(value);
                                                let y = currentCol;
                                                y.push(
                                                  cdnaColumns[currentCol1]?.data
                                                );
                                                filterObject.push({ [columnName]: value });
                                                setSearchVal1(x);
                                                setCurrentCol(y);
                                              }
                                            }
                                            setGridCustomFilter(filterObject)
                                            let newFilterData = FilterData(filterObject);
                                            setData([...newFilterData]);
            
                                          }
                                          else if (hot?.getSelected()[0][1] == 17) {
                                            const x = searchVal1
                                            var columnName = cdnaColumns[currentCol1]?.data;
                                            var value = '';
                                            setFromAmountSGST('');
                                            setToAmountSGST('');
            
                                            let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
            
                                            if (!searchVal1?.length) {
                                              x.push(value);
                                              let y = currentCol;
                                              y.push(
                                                cdnaColumns[currentCol1]?.data
                                              );
                                              filterObject.push({ [columnName]: value });
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
                                                filterObject[Index] = { [columnName]: value }
                                              } else {
                                                x.push(value);
                                                let y = currentCol;
                                                y.push(
                                                  cdnaColumns[currentCol1]?.data
                                                );
                                                filterObject.push({ [columnName]: value });
                                                setSearchVal1(x);
                                                setCurrentCol(y);
                                              }
                                            }
                                            setGridCustomFilter(filterObject)
                                            let newFilterData = FilterData(filterObject);
                                            setData([...newFilterData]);
            
                                          }
                                          else if (hot?.getSelected()[0][1] == 18) {
                                            const x = searchVal1
                                            var columnName = cdnaColumns[currentCol1]?.data;
                                            var value = '';
                                            setFromAmountCESS('');
                                            setToAmountCESS('');
            
                                            let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
            
                                            if (!searchVal1?.length) {
                                              x.push(value);
                                              let y = currentCol;
                                              y.push(
                                                cdnaColumns[currentCol1]?.data
                                              );
                                              filterObject.push({ [columnName]: value });
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
                                                filterObject[Index] = { [columnName]: value }
                                              } else {
                                                x.push(value);
                                                let y = currentCol;
                                                y.push(
                                                  cdnaColumns[currentCol1]?.data
                                                );
                                                filterObject.push({ [columnName]: value });
                                                setSearchVal1(x);
                                                setCurrentCol(y);
                                              }
                                            }
                                            setGridCustomFilter(filterObject)
                                            let newFilterData = FilterData(filterObject);
                                            setData([...newFilterData]);
            
                                          }
                                          else if (isValidCheckBoxColumn) {
                                            let x = searchVal1
                                            var checkboxes = document.getElementsByClassName('checkBoxClass');
            
                                            arrChk = []
                                            setFilterDropDownList([]);
                                            var columnName = cdnaColumns[currentCol1]?.data;
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
                                            var value= ""
                                            if (!searchVal1?.length) {
                                              x.push(value);
                                              let y = currentCol;
                                              y.push(
                                                cdnaColumns[currentCol1]?.data
                                              );
                                              // filterObject.push({ [columnName]: value });
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
                                                // filterObject[Index] = { [columnName]: value }
                                              } else {
                                                x.push(value);
                                                let y = currentCol;
                                                y.push(
                                                  cdnaColumns[currentCol1]?.data
                                                );
                                                // filterObject.push({ [columnName]: value });
                                                setSearchVal1(x);
                                                setCurrentCol(y);
                                              }
                                            }

                                            setGridCustomFilter(filterObject)
                                            let newFilterData = FilterData(filterObject);
                                            setData([...newFilterData]);
            
                                            const updatedFilterDropDownList = filterObject.reduce((acc, item) => {
                                              const { Rate, SupplyType, PlaceOfSupply, NoteType} = item;
            
                                              const updateList = (list, value) => {
                                                return list.includes(value) ? list : [...list, value];
                                              };
            
                                              if (Rate !== undefined) {
                                                acc.rateDropDownList = updateList(acc.rateDropDownList, Rate);
                                              }  else if (SupplyType !== undefined) {
                                                acc.supplyTypeDropdownList = updateList(acc.supplyTypeDropdownList, SupplyType);
                                              } else if (PlaceOfSupply !== undefined) {
                                                acc.posDropDownList = updateList(acc.posDropDownList, PlaceOfSupply);
                                              } 
                                              else if (NoteType !== undefined) {
                                                acc.noteTypeDropDownList = updateList(acc.noteTypeDropDownList, NoteType);
                                              } 
            
                                              return acc;
                                            }, { rateDropDownList: [], supplyTypeDropdownList: [],  posDropDownList: [],NoteType:[]});
            
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
                                const hot = hotRef3?.current?.hotInstance;
                                const selectedValuecol = hot?.getSelected()[0][1];
                                // const shouldExcludeTextBox = [3, 5, 6, 4, 7, 8, 9, 10, 11, 12, 13, 14, 17].includes(selectedValuecol);
                                const shouldExcludeCheckBox = [5,11,12,13].includes(selectedValuecol);
                                if (hot?.getSelected()[0][1] != 2 && hot?.getSelected()[0][1] != 7 && hot?.getSelected()[0][1] != 8 && hot?.getSelected()[0][1] != 10 && hot?.getSelected()[0][1] != 14 && hot?.getSelected()[0][1] != 15 && hot?.getSelected()[0][1] != 16 && hot?.getSelected()[0][1] != 17 && hot?.getSelected()[0][1] != 18  && hot?.getSelected()[0][1] != 5 && hot?.getSelected()[0][1] != 11 && hot?.getSelected()[0][1] != 12 && hot?.getSelected()[0][1] != 13 ) {
                                  let x = searchVal1
                      var searchInput = document.querySelector(".htUIMultipleSelectSearch.htUIInput");
                      var value = searchInput?.children[0].value;
                      //  x.push(value)
                      var columnName = cdnaColumns[currentCol1]?.data;
                      let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                      if (!searchVal1?.length) {
                        x.push(value);
                        let y = currentCol;
                        y.push(
                          cdnaColumns[currentCol1]?.data
                        );
                        filterObject.push({ [columnName]: value });
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
                          filterObject[Index] = { [columnName]: value }
                        } else {
                          x.push(value);
                          let y = currentCol;
                          y.push(
                            cdnaColumns[currentCol1]?.data
                          );
                          filterObject.push({ [columnName]: value });
                          setSearchVal1(x);
                          setCurrentCol(y);
                        }
                      }

                      setGridCustomFilter(filterObject)
                      let newFilterData = FilterData(filterObject);
                      setData([...newFilterData]);
            
                                }
                                else if (selectedValuecol == 2) {
                                  const x = searchVal1
                                  var searchInput1 = document.getElementById("custom1");
                                  var searchInput2 = document.getElementById("custom2");
                                  const invFromDate = searchInput1?.value
                                  const invToDate = searchInput2?.value
                                  var columnName = cdnaColumns[currentCol1]?.data;
                                  // var value = (searchInput1?.value || searchInput2?.value) && `${invFromDate ? invFromDate : invToDate}to${invToDate ? invToDate : invFromDate}`;
                                  var value = `${invFromDate}to${invToDate}`;
                                  setSearchDate(searchInput1?.value);
                                  setToDate(searchInput2?.value);
                                  let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                  filterObject.push({ [columnName]: value });
                                  // x.push(value)
                                  // setSearchVal1(x);
                                  // let y = currentCol;
                                  // y.push(cdnaColumns[currentCol1]?.data);
                                  // setCurrentCol(y)
                                  setGridCustomFilter(filterObject)
                                  let newFilterData = FilterData(filterObject);
                                  setData([...newFilterData]);
            
                                }

                                else if (selectedValuecol == 7) {
                                  const x = searchVal1
                                  var searchInput1 = document.getElementById("custom1");
                                  var searchInput2 = document.getElementById("custom2");
                                  const invFromDate = searchInput1?.value
                                  const invToDate = searchInput2?.value
                                  var columnName = cdnaColumns[currentCol1]?.data;
                                  // var value = (searchInput1?.value || searchInput2?.value) && `${invFromDate ? invFromDate : invToDate}to${invToDate ? invToDate : invFromDate}`;
                                  var value = `${invFromDate}to${invToDate}`;
                                  setSearchDate1(searchInput1?.value);
                                  setSearchDate1To(searchInput2?.value);
                                  let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                  if (!searchVal1?.length) {
                                    x.push(value);
                                    let y = currentCol;
                                    y.push(
                                      cdnaColumns[currentCol1]?.data
                                    );
                                    filterObject.push({ [columnName]: value });
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
                                      filterObject[Index] = { [columnName]: value }
                                    } else {
                                      x.push(value);
                                      let y = currentCol;
                                      y.push(
                                        cdnaColumns[currentCol1]?.data
                                      );
                                      filterObject.push({ [columnName]: value });
                                      setSearchVal1(x);
                                      setCurrentCol(y);
                                    }
                                  }
                                  setGridCustomFilter(filterObject)
                                  let newFilterData = FilterData(filterObject);
                                  setData([...newFilterData]);
            
                                }
            
                                else if (selectedValuecol == 10) {
                                  const x = searchVal1
                                  var searchInput1 = document.getElementById("custom1");
                                  var searchInput2 = document.getElementById("custom2");
                                  const invFromDate = searchInput1?.value
                                  const invToDate = searchInput2?.value
                                  var columnName = cdnaColumns[currentCol1]?.data;
                                  var value = `${invFromDate}to${invToDate}`;
                                  // var value = (searchInput1?.value || searchInput2?.value) && `${invFromDate ? invFromDate : invToDate}to${invToDate ? invToDate : invFromDate}`;
                                  setSearchDate2(searchInput1?.value);
                                  setSearchDate2To(searchInput2?.value);
                                  let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                  if (!searchVal1?.length) {
                                    x.push(value);
                                    let y = currentCol;
                                    y.push(
                                      cdnaColumns[currentCol1]?.data
                                    );
                                    filterObject.push({ [columnName]: value });
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
                                      filterObject[Index] = { [columnName]: value }
                                    } else {
                                      x.push(value);
                                      let y = currentCol;
                                      y.push(
                                        cdnaColumns[currentCol1]?.data
                                      );
                                      filterObject.push({ [columnName]: value });
                                      setSearchVal1(x);
                                      setCurrentCol(y);
                                    }
                                  }
                                  setGridCustomFilter(filterObject)
                                  let newFilterData = FilterData(filterObject);
                                  setData([...newFilterData]);
            
                                }

                                else if (hot?.getSelected()[0][1] == 8) {
                                  const x = searchVal1
                                  var searchInput1 = document.getElementById("amount1");
                                  var searchInput2 = document.getElementById("amount2");
                                  const invFromDate = searchInput1?.value
                                  const invToDate = searchInput2?.value
                                  var columnName = cdnaColumns[currentCol1]?.data;
                                  var value = `${invFromDate}to${invToDate}`;
                                  // var value = (searchInput1?.value || searchInput2?.value) && `${invFromDate ? invFromDate : invToDate}to${invToDate ? invToDate : invFromDate}`;
                                  console.log(value,"wwwweeee")
                                  setFromAmount(searchInput1?.value);
                                  setToAmount(searchInput2?.value);
                                  let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                  if (!searchVal1?.length) {
                                    x.push(value);
                                    let y = currentCol;
                                    y.push(
                                      cdnaColumns[currentCol1]?.data
                                    );
                                    filterObject.push({ [columnName]: value });
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
                                      filterObject[Index] = { [columnName]: value }
                                    } else {
                                      x.push(value);
                                      let y = currentCol;
                                      y.push(
                                        cdnaColumns[currentCol1]?.data
                                      );
                                      filterObject.push({ [columnName]: value });
                                      setSearchVal1(x);
                                      setCurrentCol(y);
                                    }
                                  }
                                  setGridCustomFilter(filterObject)
                                  let newFilterData = FilterData(filterObject);
                                  setData([...newFilterData]);
            
                                }
            
                                else if (hot?.getSelected()[0][1] ==14) {
                                  const x = searchVal1
                                  var searchInput1 = document.getElementById("amount1");
                                  var searchInput2 = document.getElementById("amount2");
                                  const invFromDate = searchInput1?.value
                                  const invToDate = searchInput2?.value
                                  var columnName = cdnaColumns[currentCol1]?.data;
                                  var value = `${invFromDate}to${invToDate}`;
                                  // var value = (searchInput1?.value || searchInput2?.value) && `${invFromDate ? invFromDate : invToDate}to${invToDate ? invToDate : invFromDate}`;
                                  setFromAmountTaxable(searchInput1?.value);
                                  setToAmountTaxable(searchInput2?.value);
                                  let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
            
                                  if (!searchVal1?.length) {
                                    x.push(value);
                                    let y = currentCol;
                                    y.push(
                                      cdnaColumns[currentCol1]?.data
                                    );
                                    filterObject.push({ [columnName]: value });
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
                                      filterObject[Index] = { [columnName]: value }
                                    } else {
                                      x.push(value);
                                      let y = currentCol;
                                      y.push(
                                        cdnaColumns[currentCol1]?.data
                                      );
                                      filterObject.push({ [columnName]: value });
                                      setSearchVal1(x);
                                      setCurrentCol(y);
                                    }
                                  }
                                  setGridCustomFilter(filterObject)
                                  let newFilterData = FilterData(filterObject);
                                  setData([...newFilterData]);
            
                                }
            
                                else if (hot?.getSelected()[0][1] == 15) {
                                  const x = searchVal1
                                  var searchInput1 = document.getElementById("amount1");
                                  var searchInput2 = document.getElementById("amount2");
                                  const fromAmount = searchInput1?.value
                                  const toAmount = searchInput2?.value
                                  var columnName = cdnaColumns[currentCol1]?.data;
                                  var value = `${fromAmount}to${toAmount}`;
                                  // var value = (searchInput1?.value || searchInput2?.value) && `${fromAmount ? fromAmount : toAmount}to${toAmount ? toAmount : fromAmount}`;
                                  setFromAmountIGST(searchInput1?.value);
                                  setToAmountIGST(searchInput2?.value);
                                  let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                  if (!searchVal1?.length) {
                                    x.push(value);
                                    let y = currentCol;
                                    y.push(
                                      cdnaColumns[currentCol1]?.data
                                    );
                                    filterObject.push({ [columnName]: value });
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
                                      filterObject[Index] = { [columnName]: value }
                                    } else {
                                      x.push(value);
                                      let y = currentCol;
                                      y.push(
                                        cdnaColumns[currentCol1]?.data
                                      );
                                      filterObject.push({ [columnName]: value });
                                      setSearchVal1(x);
                                      setCurrentCol(y);
                                    }
                                  }
                                  setGridCustomFilter(filterObject)
                                  let newFilterData = FilterData(filterObject);
                                  setData([...newFilterData]);
            
                                }
            
                                else if (hot?.getSelected()[0][1] == 16) {
                                  const x = searchVal1
                                  var searchInput1 = document.getElementById("amount1");
                                  var searchInput2 = document.getElementById("amount2");
                                  const fromAmount = searchInput1?.value
                                  const toAmount = searchInput2?.value
                                  var columnName = cdnaColumns[currentCol1]?.data;
                                  var value = `${fromAmount}to${toAmount}`;
                                  // var value = (searchInput1?.value || searchInput2?.value) && `${fromAmount ? fromAmount : toAmount}to${toAmount ? toAmount : fromAmount}`;
                                  setFromAmountCGST(searchInput1?.value);
                                  setToAmountCGST(searchInput2?.value);
                                  let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                  if (!searchVal1?.length) {
                                    x.push(value);
                                    let y = currentCol;
                                    y.push(
                                      cdnaColumns[currentCol1]?.data
                                    );
                                    filterObject.push({ [columnName]: value });
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
                                      filterObject[Index] = { [columnName]: value }
                                    } else {
                                      x.push(value);
                                      let y = currentCol;
                                      y.push(
                                        cdnaColumns[currentCol1]?.data
                                      );
                                      filterObject.push({ [columnName]: value });
                                      setSearchVal1(x);
                                      setCurrentCol(y);
                                    }
                                  }
                                  setGridCustomFilter(filterObject)
                                  let newFilterData = FilterData(filterObject);
                                  setData([...newFilterData]);
            
                                }
            
                                else if (hot?.getSelected()[0][1] == 17) {
                                  const x =  searchVal1
                                  var searchInput1 = document.getElementById("amount1");
                                  var searchInput2 = document.getElementById("amount2");
                                  const fromAmount = searchInput1?.value
                                  const toAmount = searchInput2?.value
                                  var columnName = cdnaColumns[currentCol1]?.data;
                                  var value = `${fromAmount}to${toAmount}`;
                                  // var value = (searchInput1?.value || searchInput2?.value) && `${fromAmount ? fromAmount : toAmount}to${toAmount ? toAmount : fromAmount}`;
                                  setFromAmountSGST(searchInput1?.value);
                                  setToAmountSGST(searchInput2?.value);
                                  let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                  if (!searchVal1?.length) {
                                    x.push(value);
                                    let y = currentCol;
                                    y.push(
                                      cdnaColumns[currentCol1]?.data
                                    );
                                    filterObject.push({ [columnName]: value });
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
                                      filterObject[Index] = { [columnName]: value }
                                    } else {
                                      x.push(value);
                                      let y = currentCol;
                                      y.push(
                                        cdnaColumns[currentCol1]?.data
                                      );
                                      filterObject.push({ [columnName]: value });
                                      setSearchVal1(x);
                                      setCurrentCol(y);
                                    }
                                  }
                                  setGridCustomFilter(filterObject)
                                  let newFilterData = FilterData(filterObject);
                                  setData([...newFilterData]);
            
                                }
            
                                else if (hot?.getSelected()[0][1] == 18) {
                                  const x = searchVal1
                                  var searchInput1 = document.getElementById("amount1");
                                  var searchInput2 = document.getElementById("amount2");
                                  const fromAmount = searchInput1?.value
                                  const toAmount = searchInput2?.value
                                  var columnName = cdnaColumns[currentCol1]?.data;
                                  var value = `${fromAmount}to${toAmount}`;
                                  // var value = (searchInput1?.value || searchInput2?.value) && `${fromAmount ? fromAmount : toAmount}to${toAmount ? toAmount : fromAmount}`;
                                  setFromAmountCESS(searchInput1?.value);
                                  setToAmountCESS(searchInput2?.value);
                                  let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                  if (!searchVal1?.length) {
                                    x.push(value);
                                    let y = currentCol;
                                    y.push(
                                      cdnaColumns[currentCol1]?.data
                                    );
                                    filterObject.push({ [columnName]: value });
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
                                      filterObject[Index] = { [columnName]: value }
                                    } else {
                                      x.push(value);
                                      let y = currentCol;
                                      y.push(
                                        cdnaColumns[currentCol1]?.data
                                      );
                                      filterObject.push({ [columnName]: value });
                                      setSearchVal1(x);
                                      setCurrentCol(y);
                                    }
                                  }
                                  setGridCustomFilter(filterObject)
                                  let newFilterData = FilterData(filterObject);
                                  setData([...newFilterData]);
            
                                }
            
                                else if (shouldExcludeCheckBox) {
                                  let x =  searchVal1
                                  var checkboxes = document.getElementsByClassName('checkBoxClass');
                                  arrChk = []
                                  setFilterDropDownList([]);
                                  var columnName = cdnaColumns[currentCol1]?.data;
                                  let filterObject = !gridCustomFilter ? [] : gridCustomFilter
                                  let filterObject2 = [] 
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

                                  var value = filterObject2.join("@#@#")
                                  if (!searchVal1?.length) {
                                    x.push(value);
                                    let y = currentCol;
                                    y.push(
                                      cdnaColumns[currentCol1]?.data
                                    );
                                    // filterObject.push({ [columnName]: value });
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
                                      // filterObject[Index] = { [columnName]: value }
                                    } else {
                                      x.push(value);
                                      let y = currentCol;
                                      y.push(
                                        cdnaColumns[currentCol1]?.data
                                      );
                                      // filterObject.push({ [columnName]: value });
                                      setSearchVal1(x);
                                      setCurrentCol(y);
                                    }
                                  }
                                  
                                  setGridCustomFilter(filterObject)
                                  let newFilterData = FilterData(filterObject);
                                  setData([...newFilterData]);
            
                                  const updatedFilterDropDownList = filterObject.reduce((acc, item) => {
                                    const { Rate, SupplyType, PlaceOfSupply, NoteType} = item;
  
                                    const updateList = (list, value) => {
                                      return list.includes(value) ? list : [...list, value];
                                    };
  
                                    if (Rate !== undefined) {
                                      acc.rateDropDownList = updateList(acc.rateDropDownList, Rate);
                                    }  else if (SupplyType !== undefined) {
                                      acc.supplyTypeDropdownList = updateList(acc.supplyTypeDropdownList, SupplyType);
                                    } else if (PlaceOfSupply !== undefined) {
                                      acc.posDropDownList = updateList(acc.posDropDownList, PlaceOfSupply);
                                    } 
                                    else if (NoteType !== undefined) {
                                      acc.noteTypeDropDownList = updateList(acc.noteTypeDropDownList, NoteType);
                                    } 
  
                                    return acc;
                                  }, { rateDropDownList: [], supplyTypeDropdownList: [],  posDropDownList: [],noteTypeDropDownList:[]});
            
                                  setFilterDropDownList(updatedFilterDropDownList);
            
                                }
                              }}
                            />
                          {paginationComponent()}
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </TabPane>
            )}

            {/* Nill rated Exempt */}
            {activeTab == 5 && (
              <TabPane tabId="5" key="5">
                <TabPane tabId="5" key="5">
                  <Card>
                    <CardBody className="CardBody p-0">
                      {upperContent()}
                    </CardBody>
                  </Card>
                  <CardBody className="CardBody p-0">
                    <Row>
                      <Col sm="12">
                        <div>
                          {/* {purchaseData?.length > 0 ? ( */}

                            <HotTable
                              id="theaderDistrubution"
                              viewportColumnRenderingOffset={100}
                              autoWrapRow={true}
                              data={purchaseData.length > 0  ? purchaseData : [{ EligibilityOfITC: "No Data Found" }]}
                              autoColumnSize={true}
                              style={purchaseData.length >0 ?"" : {
                                  textAlign: "center",
                                  overflowX: "hidden",
                                }}
                              commentedCellClassName="custom-cell"
                              rowHeaders={false}
                              manualColumnResize={false}
                              colHeaders={colHeaders}
                              afterGetColHeader={theaderDistrubution}
                              stretchH="all"
                              preventOverflow="horizontal"
                              columns={distributionOfItcColumns}
                              rowHeights={RowSize}
                              columnHeaderHeight={columnHeaderSize}
                              contextMenu={false}
                              bindRowsWithHeaders={true}
                              licenseKey="non-commercial-and-evaluation"
                              height="auto"
                              ref={hotRef4}
                              // hiddenColumns={{
                              //   columns: [0],
                              // }}
                              afterOnCellMouseDown={localAfterOnCellMouseDown}
                              mergeCells={purchaseData.length > 0 ? false : [
                                { row: 0, col: 0, rowspan: 1, colspan: 9 },
                              ]}
                              cells={function (row, col) {
                                var cp = {};
                                if (col !== null && purchaseData.length > 0) {
                                  cp.renderer = emptyRenderDITC;
                                }
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
                                        this.getSelected()[0][1] == 6 ||  // Date
                                        this.getSelected()[0][1] == 8 ||  // Original In date 1
                                        this.getSelected()[0][1] ==10 ||   //  Original Inv Date2
                                        this.getSelected()[0][1] == 12 || 
                                        this.getSelected()[0][1] == 13 ||
                                        this.getSelected()[0][1] == 14 ||
                                        this.getSelected()[0][1] == 0 ||
                                        this.getSelected()[0][1] == 1 ||
                                        this.getSelected()[0][1] == 4 ||
                                        this.getSelected()[0][1] == 11 ||
                                        this.getSelected()[0][1] == 15 
                                      );
                                    },
                                  },

                                  about: { // For CheckBox custom option

                                    name: `<div  style="margin-left:6px">Select Options<label class="float-end text-danger "><a><u id="selectAll">Select All</u></a></label></div> <div  class="checkboxmenu custom-scrollbar"> <div >  <table id="searchTable" >
                                    ${dropDonwNameTab5 &&
                                      dropDonwNameTab5?.map((index) => (
                                        `<tr><td><input class="checkBoxClass" type="checkbox" value="${index?.label}" /> <span class="fw-normal">${index?.label?.length > 20 ? index?.label?.substring(0, 20) + "..." : index?.label}</span> </td></tr>`
                                      )).join('')
                                      }
            
                                      </table></div>
                                      </div>`, // Name can contain HTML 
                                    hidden() {
                                      const selectedCol = this.getSelectedRangeLast().to.col;
                                      const isHiddenCol = ![0,1,4,11].includes(selectedCol);
            
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
                                    },
                                  },
                                  option10: generateOption(12, fromAmountIGST, toAmountIGST),
                                  option11: generateOption(13, fromAmountCGST, toAmountCGST),
                                  option12: generateOption(14, fromAmountSGST, toAmountSGST),
                                  option13: generateOption(15, fromAmountCESS, toAmountCESS),

                                  clear: {
                                    name: `<button id='btnClear'  name='Clear' tabIndex="-1"   value='Clear'>Clear</button>`,
                                    
                                    callback: function (key, selection, clickEvent) {
            
                                      var src = clickEvent.target;
            
                                      if (src?.tagName?.toLowerCase() === "button") {
                                        if (clickEvent.target.id == "btnClear") {
                                          const hot = hotRef4?.current?.hotInstance;
                                          const selectedValue = hot?.getSelected()[0][1];
                                          const isValidTextColumn = [6,8,10,12,13,14,15,0,1,4,11].includes(selectedValue);
                                          const isValidCheckBoxColumn = [0,1,4,11].includes(selectedValue);

                                          if (!isValidTextColumn) {
                                            const x = searchVal1
                                            var value = "";
                                            var columnName = distributionOfItcColumns[currentCol1]?.data;
                                            let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
            
                                            // filterObject.push({ [columnName]: value });
                                            if (!searchVal1?.length) {
                                              x.push(value);
                                              let y = currentCol;
                                              y.push(
                                                distributionOfItcColumns[currentCol1]?.data
                                              );
                                              filterObject.push({ [columnName]: value });

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
                                                filterObject[Index] = { [columnName]: value }
                                              } else {
                                                x.push(value);
                                                let y = currentCol;
                                                y.push(
                                                  distributionOfItcColumns[currentCol1]?.data
                                                );
                                                filterObject.push({ [columnName]: value });

                                                setSearchVal1(x);
                                                setCurrentCol(y);
                                              }
                                            }
                                         
                                            setGridCustomFilter(filterObject)
                                            let newFilterData = FilterData(filterObject);
                                            setData([...newFilterData]);
            
                                          }

                                          else if (hot?.getSelected()[0][1] == 6) {
                                            const x = searchVal1
                                            var columnName = distributionOfItcColumns[currentCol1]?.data;
                                            var value = '';
                                            setSearchDate('');
                                            setToDate('');
                                            let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                            if (!searchVal1?.length) {
                                              x.push(value);
                                              let y = currentCol;
                                              y.push(
                                                distributionOfItcColumns[currentCol1]?.data
                                              );
                                              filterObject.push({ [columnName]: value });

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
                                                filterObject[Index] = { [columnName]: value }
                                              } else {
                                                x.push(value);
                                                let y = currentCol;
                                                y.push(
                                                  distributionOfItcColumns[currentCol1]?.data
                                                );
                                                filterObject.push({ [columnName]: value });

                                                setSearchVal1(x);
                                                setCurrentCol(y);
                                              }
                                            }
                                            setGridCustomFilter(filterObject)
                                            let newFilterData = FilterData(filterObject);
                                            setData([...newFilterData]);
            
                                          }
                                          else if (hot?.getSelected()[0][1] == 8) {
                                            const x = searchVal1
                                            var columnName = distributionOfItcColumns[currentCol1]?.data;
                                            var value = '';
                                            setSearchDate1('');
                                            setSearchDate1To('');
                                            let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                            if (!searchVal1?.length) {
                                              x.push(value);
                                              let y = currentCol;
                                              y.push(
                                                distributionOfItcColumns[currentCol1]?.data
                                              );
                                              filterObject.push({ [columnName]: value });

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
                                                filterObject[Index] = { [columnName]: value }
                                              } else {
                                                x.push(value);
                                                let y = currentCol;
                                                y.push(
                                                  distributionOfItcColumns[currentCol1]?.data
                                                );
                                                filterObject.push({ [columnName]: value });

                                                setSearchVal1(x);
                                                setCurrentCol(y);
                                              }
                                            }
                                            setGridCustomFilter(filterObject)
                                            let newFilterData = FilterData(filterObject);
                                            setData([...newFilterData]);
            
                                          }
                                          else if (hot?.getSelected()[0][1] == 10) {
                                            const x = searchVal1
                                            var columnName = distributionOfItcColumns[currentCol1]?.data;
                                            var value = '';
                                            setSearchDate2('');
                                            setSearchDate2To('');
                                            let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                            if (!searchVal1?.length) {
                                              x.push(value);
                                              let y = currentCol;
                                              y.push(
                                                distributionOfItcColumns[currentCol1]?.data
                                              );
                                              filterObject.push({ [columnName]: value });

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
                                                filterObject[Index] = { [columnName]: value }
                                              } else {
                                                x.push(value);
                                                let y = currentCol;
                                                y.push(
                                                  distributionOfItcColumns[currentCol1]?.data
                                                );
                                                filterObject.push({ [columnName]: value });

                                                setSearchVal1(x);
                                                setCurrentCol(y);
                                              }
                                            }
                                            setGridCustomFilter(filterObject)
                                            let newFilterData = FilterData(filterObject);
                                            setData([...newFilterData]);
            
                                          }
                                          else if (hot?.getSelected()[0][1] == 12) {
                                            const x = searchVal1
                                            var columnName = distributionOfItcColumns[currentCol1]?.data;
                                            var value = '';
                                            setFromAmountIGST('');
                                            setToAmountIGST('');
            
                                            let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                            if (!searchVal1?.length) {
                                              x.push(value);
                                              let y = currentCol;
                                              y.push(
                                                distributionOfItcColumns[currentCol1]?.data
                                              );
                                              filterObject.push({ [columnName]: value });

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
                                                filterObject[Index] = { [columnName]: value }
                                              } else {
                                                x.push(value);
                                                let y = currentCol;
                                                y.push(
                                                  distributionOfItcColumns[currentCol1]?.data
                                                );
                                                filterObject.push({ [columnName]: value });

                                                setSearchVal1(x);
                                                setCurrentCol(y);
                                              }
                                            }
                                            setGridCustomFilter(filterObject)
                                            let newFilterData = FilterData(filterObject);
                                            setData([...newFilterData]);
            
                                          }
                                          else if (hot?.getSelected()[0][1] == 13) {
                                            const x = searchVal1
                                            var columnName = distributionOfItcColumns[currentCol1]?.data;
                                            var value = '';
                                            setFromAmountCGST('');
                                            setToAmountCGST('');
            
                                            let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                            if (!searchVal1?.length) {
                                              x.push(value);
                                              let y = currentCol;
                                              y.push(
                                                distributionOfItcColumns[currentCol1]?.data
                                              );
                                              filterObject.push({ [columnName]: value });

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
                                                filterObject[Index] = { [columnName]: value }
                                              } else {
                                                x.push(value);
                                                let y = currentCol;
                                                y.push(
                                                  distributionOfItcColumns[currentCol1]?.data
                                                );
                                                filterObject.push({ [columnName]: value });

                                                setSearchVal1(x);
                                                setCurrentCol(y);
                                              }
                                            }
                                            setGridCustomFilter(filterObject)
                                            let newFilterData = FilterData(filterObject);
                                            setData([...newFilterData]);
            
                                          }
                                          else if (hot?.getSelected()[0][1] == 14) {
                                            const x = searchVal1
                                            var columnName = distributionOfItcColumns[currentCol1]?.data;
                                            var value = '';
                                            setFromAmountSGST('');
                                            setToAmountSGST('');
            
                                            let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
            
                                            if (!searchVal1?.length) {
                                              x.push(value);
                                              let y = currentCol;
                                              y.push(
                                                distributionOfItcColumns[currentCol1]?.data
                                              );
                                              filterObject.push({ [columnName]: value });

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
                                                filterObject[Index] = { [columnName]: value }
                                              } else {
                                                x.push(value);
                                                let y = currentCol;
                                                y.push(
                                                  distributionOfItcColumns[currentCol1]?.data
                                                );
                                                filterObject.push({ [columnName]: value });

                                                setSearchVal1(x);
                                                setCurrentCol(y);
                                              }
                                            }
                                            setGridCustomFilter(filterObject)
                                            let newFilterData = FilterData(filterObject);
                                            setData([...newFilterData]);
            
                                          }
                                          else if (hot?.getSelected()[0][1] == 15) {
                                            const x = searchVal1
                                            var columnName = distributionOfItcColumns[currentCol1]?.data;
                                            var value = '';
                                            setFromAmountCESS('');
                                            setToAmountCESS('');
            
                                            let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                            if (!searchVal1?.length) {
                                              x.push(value);
                                              let y = currentCol;
                                              y.push(
                                                distributionOfItcColumns[currentCol1]?.data
                                              );
                                              filterObject.push({ [columnName]: value });

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
                                                filterObject[Index] = { [columnName]: value }
                                              } else {
                                                x.push(value);
                                                let y = currentCol;
                                                y.push(
                                                  distributionOfItcColumns[currentCol1]?.data
                                                );
                                                filterObject.push({ [columnName]: value });

                                                setSearchVal1(x);
                                                setCurrentCol(y);
                                              }
                                            }
                                            setGridCustomFilter(filterObject)
                                            let newFilterData = FilterData(filterObject);
                                            setData([...newFilterData]);
            
                                          }
                                          else if (isValidCheckBoxColumn) {
                                            var checkboxes = document.getElementsByClassName('checkBoxClass');
                                            let x = searchVal1
                                            arrChk = []
                                            setFilterDropDownList([]);
                                            var columnName = distributionOfItcColumns[currentCol1]?.data;
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
                                            let value = ""
                                            if (!searchVal1?.length) {
                                              x.push(value);
                                              let y = currentCol;
                                              y.push(
                                                distributionOfItcColumns[currentCol1]?.data
                                              );
                                              // filterObject.push({ [columnName]: value });

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
                                                // filterObject[Index] = { [columnName]: value }
                                              } else {
                                                x.push(value);
                                                let y = currentCol;
                                                y.push(
                                                  distributionOfItcColumns[currentCol1]?.data
                                                );
                                                // filterObject.push({ [columnName]: value });

                                                setSearchVal1(x);
                                                setCurrentCol(y);
                                              }
                                            }
                                            setGridCustomFilter(filterObject)
                                            let newFilterData = FilterData(filterObject);
                                            setData([...newFilterData]);
            
                                            const updatedFilterDropDownList = filterObject.reduce((acc, item) => {
                                              const { EligibilityOfITC, UnitType, NoteType, SezSupplier, } = item;
            
                                              const updateList = (list, value) => {
                                                return list.includes(value) ? list : [...list, value];
                                              };
            
                                              if (EligibilityOfITC !== undefined) {
                                                acc.eligibilityofITCDropDownList = updateList(acc.eligibilityofITCDropDownList, EligibilityOfITC);
                                              } else if (UnitType !== undefined) {
                                                acc.unitTypeDropDownList = updateList(acc.unitTypeDropDownList, UnitType);
                                              } else if (NoteType !== undefined) {
                                                acc.noteTypeDropDownList = updateList(acc.noteTypeDropDownList, NoteType);
                                              } else if (SezSupplier !== undefined) {
                                                acc.sezDropDownList = updateList(acc.sezDropDownList, SezSupplier);
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
                                const hot = hotRef4?.current?.hotInstance;
                                const selectedValuecol = hot?.getSelected()[0][1];
                                // const shouldExcludeTextBox = [3, 5, 6, 4, 7, 8, 9, 10, 11, 12, 13, 14, 17].includes(selectedValuecol);
                                const shouldExcludeCheckBox = [0,1,4,11].includes(selectedValuecol);
                                if (hot?.getSelected()[0][1] != 6 && hot?.getSelected()[0][1] != 8 && hot?.getSelected()[0][1] != 10 && hot?.getSelected()[0][1] != 12 && hot?.getSelected()[0][1] != 13 && hot?.getSelected()[0][1] != 14 && hot?.getSelected()[0][1] != 15 && hot?.getSelected()[0][1] != 0 && hot?.getSelected()[0][1] != 1 && hot?.getSelected()[0][1] != 4 && hot?.getSelected()[0][1] != 11) {
                                  let x = searchVal1
                                  var searchInput = document.querySelector(".htUIMultipleSelectSearch.htUIInput");
                                  var value = searchInput?.children[0].value;
                                  //  x.push(value)
                                  var columnName = distributionOfItcColumns[currentCol1]?.data;
                                  let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
            
                                  if (!searchVal1?.length) {
                                    x.push(value);
                                    let y = currentCol;
                                    y.push(
                                      distributionOfItcColumns[currentCol1]?.data
                                    );
                                    filterObject.push({ [columnName]: value });

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
                                      filterObject[Index] = { [columnName]: value }
                                    } else {
                                      x.push(value);
                                      let y = currentCol;
                                      y.push(
                                        distributionOfItcColumns[currentCol1]?.data
                                      );
                                      filterObject.push({ [columnName]: value });

                                      setSearchVal1(x);
                                      setCurrentCol(y);
                                    }
                                  }
            
                                  setGridCustomFilter(filterObject)
                                  let newFilterData = FilterData(filterObject);
                                  setData([...newFilterData]);
            
                                }
                                else if (selectedValuecol == 6) {
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
                                  if (!searchVal1?.length) {
                                    x.push(value);
                                    let y = currentCol;
                                    y.push(
                                      distributionOfItcColumns[currentCol1]?.data
                                    );
                                    filterObject.push({ [columnName]: value });

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
                                      filterObject[Index] = { [columnName]: value }
                                    } else {
                                      x.push(value);
                                      let y = currentCol;
                                      y.push(
                                        distributionOfItcColumns[currentCol1]?.data
                                      );
                                      filterObject.push({ [columnName]: value });

                                      setSearchVal1(x);
                                      setCurrentCol(y);
                                    }
                                  }
                                  setGridCustomFilter(filterObject)
                                  let newFilterData = FilterData(filterObject);
                                  setData([...newFilterData]);
            
                                }

                                else if (selectedValuecol == 8) {
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
                                  if (!searchVal1?.length) {
                                    x.push(value);
                                    let y = currentCol;
                                    y.push(
                                      distributionOfItcColumns[currentCol1]?.data
                                    );
                                    filterObject.push({ [columnName]: value });

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
                                      filterObject[Index] = { [columnName]: value }
                                    } else {
                                      x.push(value);
                                      let y = currentCol;
                                      y.push(
                                        distributionOfItcColumns[currentCol1]?.data
                                      );
                                      filterObject.push({ [columnName]: value });

                                      setSearchVal1(x);
                                      setCurrentCol(y);
                                    }
                                  }
                                  setGridCustomFilter(filterObject)
                                  let newFilterData = FilterData(filterObject);
                                  setData([...newFilterData]);
            
                                }
            
                                else if (selectedValuecol == 10) {
                                  const x = searchVal1
                                  var searchInput1 = document.getElementById("custom1");
                                  var searchInput2 = document.getElementById("custom2");
                                  const invFromDate = searchInput1?.value
                                  const invToDate = searchInput2?.value
                                  var columnName = distributionOfItcColumns[currentCol1]?.data;
                                  var value = `${invFromDate}to${invToDate}`;
                                  // var value = (searchInput1?.value || searchInput2?.value) && `${invFromDate ? invFromDate : invToDate}to${invToDate ? invToDate : invFromDate}`;
                                  setSearchDate2(searchInput1?.value);
                                  setSearchDate2To(searchInput2?.value);
                                  let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                  if (!searchVal1?.length) {
                                    x.push(value);
                                    let y = currentCol;
                                    y.push(
                                      distributionOfItcColumns[currentCol1]?.data
                                    );
                                    filterObject.push({ [columnName]: value });

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
                                      filterObject[Index] = { [columnName]: value }
                                    } else {
                                      x.push(value);
                                      let y = currentCol;
                                      y.push(
                                        distributionOfItcColumns[currentCol1]?.data
                                      );
                                      filterObject.push({ [columnName]: value });

                                      setSearchVal1(x);
                                      setCurrentCol(y);
                                    }
                                  }
                                  setGridCustomFilter(filterObject)
                                  let newFilterData = FilterData(filterObject);
                                  setData([...newFilterData]);
            
                                }

                                else if (hot?.getSelected()[0][1] == 12) {
                                  const x = searchVal1
                                  var searchInput1 = document.getElementById("amount1");
                                  var searchInput2 = document.getElementById("amount2");
                                  const fromAmount = searchInput1?.value
                                  const toAmount = searchInput2?.value
                                  var columnName = distributionOfItcColumns[currentCol1]?.data;
                                  var value = `${fromAmount}to${toAmount}`;
                                  // var value = (searchInput1?.value || searchInput2?.value) && `${fromAmount ? fromAmount : toAmount}to${toAmount ? toAmount : fromAmount}`;
                                  setFromAmountIGST(searchInput1?.value);
                                  setToAmountIGST(searchInput2?.value);
                                  let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                  if (!searchVal1?.length) {
                                    x.push(value);
                                    let y = currentCol;
                                    y.push(
                                      distributionOfItcColumns[currentCol1]?.data
                                    );
                                    filterObject.push({ [columnName]: value });

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
                                      filterObject[Index] = { [columnName]: value }
                                    } else {
                                      x.push(value);
                                      let y = currentCol;
                                      y.push(
                                        distributionOfItcColumns[currentCol1]?.data
                                      );
                                      filterObject.push({ [columnName]: value });

                                      setSearchVal1(x);
                                      setCurrentCol(y);
                                    }
                                  }
                                  setGridCustomFilter(filterObject)
                                  let newFilterData = FilterData(filterObject);
                                  setData([...newFilterData]);
            
                                }
            
                                else if (hot?.getSelected()[0][1] == 13) {
                                  const x = searchVal1
                                  var searchInput1 = document.getElementById("amount1");
                                  var searchInput2 = document.getElementById("amount2");
                                  const fromAmount = searchInput1?.value
                                  const toAmount = searchInput2?.value
                                  var columnName = distributionOfItcColumns[currentCol1]?.data;
                                  var value = `${fromAmount}to${toAmount}`;
                                  // var value = (searchInput1?.value || searchInput2?.value) && `${fromAmount ? fromAmount : toAmount}to${toAmount ? toAmount : fromAmount}`;
                                  setFromAmountCGST(searchInput1?.value);
                                  setToAmountCGST(searchInput2?.value);
                                  let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                  if (!searchVal1?.length) {
                                    x.push(value);
                                    let y = currentCol;
                                    y.push(
                                      distributionOfItcColumns[currentCol1]?.data
                                    );
                                    filterObject.push({ [columnName]: value });

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
                                      filterObject[Index] = { [columnName]: value }
                                    } else {
                                      x.push(value);
                                      let y = currentCol;
                                      y.push(
                                        distributionOfItcColumns[currentCol1]?.data
                                      );
                                      filterObject.push({ [columnName]: value });

                                      setSearchVal1(x);
                                      setCurrentCol(y);
                                    }
                                  }
                                  setGridCustomFilter(filterObject)
                                  let newFilterData = FilterData(filterObject);
                                  setData([...newFilterData]);
            
                                }
            
                                else if (hot?.getSelected()[0][1] == 14) {
                                  const x =  searchVal1
                                  var searchInput1 = document.getElementById("amount1");
                                  var searchInput2 = document.getElementById("amount2");
                                  const fromAmount = searchInput1?.value
                                  const toAmount = searchInput2?.value
                                  var columnName = distributionOfItcColumns[currentCol1]?.data;
                                  var value = `${fromAmount}to${toAmount}`;
                                  // var value = (searchInput1?.value || searchInput2?.value) && `${fromAmount ? fromAmount : toAmount}to${toAmount ? toAmount : fromAmount}`;
                                  setFromAmountSGST(searchInput1?.value);
                                  setToAmountSGST(searchInput2?.value);
                                  let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                  if (!searchVal1?.length) {
                                    x.push(value);
                                    let y = currentCol;
                                    y.push(
                                      distributionOfItcColumns[currentCol1]?.data
                                    );
                                    filterObject.push({ [columnName]: value });

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
                                      filterObject[Index] = { [columnName]: value }
                                    } else {
                                      x.push(value);
                                      let y = currentCol;
                                      y.push(
                                        distributionOfItcColumns[currentCol1]?.data
                                      );
                                      filterObject.push({ [columnName]: value });

                                      setSearchVal1(x);
                                      setCurrentCol(y);
                                    }
                                  }
                                  setGridCustomFilter(filterObject)
                                  let newFilterData = FilterData(filterObject);
                                  setData([...newFilterData]);
            
                                }
            
                                else if (hot?.getSelected()[0][1] == 15) {
                                  const x = searchVal1
                                  var searchInput1 = document.getElementById("amount1");
                                  var searchInput2 = document.getElementById("amount2");
                                  const fromAmount = searchInput1?.value
                                  const toAmount = searchInput2?.value
                                  var columnName = distributionOfItcColumns[currentCol1]?.data;
                                  // var value = (searchInput1?.value || searchInput2?.value) && `${fromAmount ? fromAmount : toAmount}to${toAmount ? toAmount : fromAmount}`;
                                  var value = `${fromAmount}to${toAmount}`;
                                  setFromAmountCESS(searchInput1?.value);
                                  setToAmountCESS(searchInput2?.value);
                                  let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                  if (!searchVal1?.length) {
                                    x.push(value);
                                    let y = currentCol;
                                    y.push(
                                      distributionOfItcColumns[currentCol1]?.data
                                    );
                                    filterObject.push({ [columnName]: value });

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
                                      filterObject[Index] = { [columnName]: value }
                                    } else {
                                      x.push(value);
                                      let y = currentCol;
                                      y.push(
                                        distributionOfItcColumns[currentCol1]?.data
                                      );
                                      filterObject.push({ [columnName]: value });

                                      setSearchVal1(x);
                                      setCurrentCol(y);
                                    }
                                  }
                                  setGridCustomFilter(filterObject)
                                  let newFilterData = FilterData(filterObject);
                                  setData([...newFilterData]);
            
                                }
            
                                else if (shouldExcludeCheckBox) {
                                  let x = searchVal1
                                  var checkboxes = document.getElementsByClassName('checkBoxClass');
                                  arrChk = []
                                  setFilterDropDownList([]);
                                  var columnName = distributionOfItcColumns[currentCol1]?.data;
                                  let filterObject = !gridCustomFilter ? [] : gridCustomFilter
                                  let filterObject2 = []
                                  filterObject = filterObject == null || filterObject.length <= 0 ? [] : filterObject;
            
                                  for (let i = 0; i < checkboxes.length; i++) {
                                    if (checkboxes[i].checked) {
            
                                      arrChk.push({ [columnName]: checkboxes[i].value });
                                      filterObject2.push(checkboxes[i].value);
                                      filterObject.push({ [columnName]: checkboxes[i].value });
                                    } else {
            
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
                                      filterObject = uniqueArray
                                      const index = filterObject.findIndex(obj => obj[columnName] === checkboxes[i].value);
                                      if (index !== -1) {
            
                                        delete filterObject[index][columnName];
                                      }
                                    }
                                  }
                                  
                                  var value = filterObject2.join("@#@#")
                                  if (!searchVal1?.length) {
                                    x.push(value);
                                    let y = currentCol;
                                    y.push(
                                      distributionOfItcColumns[currentCol1]?.data
                                    );
                                    // filterObject.push({ [columnName]: value });

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
                                      // filterObject[Index] = { [columnName]: value }
                                    } else {
                                      x.push(value);
                                      let y = currentCol;
                                      y.push(
                                        distributionOfItcColumns[currentCol1]?.data
                                      );
                                      // filterObject.push({ [columnName]: value });

                                      setSearchVal1(x);
                                      setCurrentCol(y);
                                    }
                                  }
                                  setGridCustomFilter(filterObject)
                                  let newFilterData = FilterData(filterObject);
                                  setData([...newFilterData]);
            
                                  const updatedFilterDropDownList = filterObject.reduce((acc, item) => {
                                    const { EligibilityOfITC, UnitType, NoteType, SezSupplier, } = item;
  
                                    const updateList = (list, value) => {
                                      return list.includes(value) ? list : [...list, value];
                                    };
  
                                    if (EligibilityOfITC !== undefined) {
                                      acc.eligibilityofITCDropDownList = updateList(acc.eligibilityofITCDropDownList, EligibilityOfITC);
                                    } else if (UnitType !== undefined) {
                                      acc.unitTypeDropDownList = updateList(acc.unitTypeDropDownList, UnitType);
                                    } else if (NoteType !== undefined) {
                                      acc.noteTypeDropDownList = updateList(acc.noteTypeDropDownList, NoteType);
                                    } else if (SezSupplier !== undefined) {
                                      acc.sezDropDownList = updateList(acc.sezDropDownList, SezSupplier);
                                    } 
  
                                    return acc;
                                  }, { eligibilityofITCDropDownList: [], unitTypeDropDownList: [], noteTypeDropDownList:[], sezDropDownList:[] });
  
                                  setFilterDropDownList(updatedFilterDropDownList);
            
                                }
                              }}
                            />
                          {paginationComponent()}
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </TabPane>
              </TabPane>
            )}

            {/* Amends  */}
            {activeTab == 6 && (
              <TabPane tabId="6" key="6">
                <TabPane tabId="6" key="6">
                  <Card>
                    <CardBody className="CardBody p-0">
                      {upperContent()}
                    </CardBody>
                  </Card>
                  <CardBody className="CardBody p-0">
                    <Row>
                      <Col sm="12">
                        <div>
                          <div>
                            {/* {purchaseData?.length > 0 ? ( */}
                              <HotTable
                                id="theaderAmends"
                                style={purchaseData.length > 0 ? "" :  {
                                  textAlign: "center",
                                  overflowX: "hidden",
                                }}
                                autoWrapRow={true}
                                data={purchaseData.length > 0 ? purchaseData : [{ OriginalUnitType: "No Data Found" }]}
                                // autoColumnSize={true}
                                autoColumnSize={{
                                  samplingRatio: 23  // Adjust the samplingRatio as needed
                                }}
                                manualColumnResize={false}
                                colHeaders={colHeaders}
                                afterGetColHeader={theaderAmends}
                                stretchH="all"
                                preventOverflow="horizontal"
                                rowHeights={RowSize}
                                columnHeaderHeight={columnHeaderSize}
                                columns={ammendDistributionItcdetailsColumn}
                                contextMenu={false}
                                bindRowsWithHeaders={true}
                                licenseKey="non-commercial-and-evaluation"
                                height="auto"
                                ref={hotRef5}
                                afterOnCellMouseDown={localAfterOnCellMouseDown}
                                mergeCells={purchaseData.length > 0 ? false : [
                                  { row: 0, col: 0, rowspan: 1, colspan: 7 },
                                ]}
                                cells={function (row, col) {
                                  var cp = {};
                                  if (col !== null && purchaseData.length > 0) {
                                    cp.renderer = emptyRenderAITC;
                                  }
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
                                        console.log(
                                          "noon col",
                                          hot.getSelected()[0][1],
                                          hot
                                        );
                                        return (
                                          this.getSelected()[0][1] == 3 ||  // Date
                                          this.getSelected()[0][1] == 10 ||  // Original In date 1
                                          this.getSelected()[0][1] ==12 ||   //  Original Inv Date2
                                          this.getSelected()[0][1] ==14 ||   //  Original Inv Date3
                                          this.getSelected()[0][1] == 16 || 
                                          this.getSelected()[0][1] == 17 ||
                                          this.getSelected()[0][1] == 18 ||
                                          this.getSelected()[0][1] == 0 ||
                                          this.getSelected()[0][1] == 4 ||
                                          this.getSelected()[0][1] == 5 ||
                                          this.getSelected()[0][1] == 8 ||
                                          this.getSelected()[0][1] == 15 
                                        );
                                      },
                                    },

                                    about: { // For CheckBox custom option

                                      name: `<div  style="margin-left:6px">Select Options<label class="float-end text-danger "><a><u id="selectAll">Select All</u></a></label></div> <div  class="checkboxmenu custom-scrollbar"> <div >  <table id="searchTable" >
                                      ${dropDonwNameTab6 &&
                                        dropDonwNameTab6?.map((index) => (
                                          `<tr><td><input class="checkBoxClass" type="checkbox" value="${index?.label}" /> <span class="fw-normal">${index?.label?.length > 20 ? index?.label?.substring(0, 20) + "..." : index?.label}</span> </td></tr>`
                                        )).join('')
                                        }
              
                                        </table></div>
                                        </div>`, // Name can contain HTML 
                                      hidden() {
                                        const selectedCol = this.getSelectedRangeLast().to.col;
                                        const isHiddenCol = ![0,4,5,6,15].includes(selectedCol);
              
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
                                            const isValidTextColumn = [3,10,12,14,16,17,18,19,0,4,5,8,15].includes(selectedValue);
                                            const isValidCheckBoxColumn = [0,4,5,8,15].includes(selectedValue);
  
                                            if (!isValidTextColumn) {
                                              let x = searchVal1
                                              var value = "";
                                              var columnName = ammendDistributionItcdetailsColumn[currentCol1]?.data;
                                              let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
              
                                              // filterObject.push({ [columnName]: value });
                                              if (!searchVal1?.length) {
                                                x.push(value);
                                                let y = currentCol;
                                                y.push(
                                                  ammendDistributionItcdetailsColumn[currentCol1]?.data
                                                );
                                                filterObject.push({ [columnName]: value });
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
                                                  filterObject[Index] = { [columnName]: value }
                                                } else {
                                                  x.push(value);
                                                  let y = currentCol;
                                                  y.push(
                                                    ammendDistributionItcdetailsColumn[currentCol1]?.data
                                                  );
                                                  filterObject.push({ [columnName]: value });
                                                  setSearchVal1(x);
                                                  setCurrentCol(y);
                                                }
                                              }
                                       
              
                                              setGridCustomFilter(filterObject)
                                              let newFilterData = FilterData(filterObject);
                                              setData([...newFilterData]);
              
                                            }
  
                                            else if (hot?.getSelected()[0][1] == 3) {
                                              let x = searchVal1
                                              var columnName = ammendDistributionItcdetailsColumn[currentCol1]?.data;
                                              var value = '';
                                              setSearchDate('');
                                              setToDate('');
                                              let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                              if (!searchVal1?.length) {
                                                x.push(value);
                                                let y = currentCol;
                                                y.push(
                                                  ammendDistributionItcdetailsColumn[currentCol1]?.data
                                                );
                                                filterObject.push({ [columnName]: value });
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
                                                  filterObject[Index] = { [columnName]: value }
                                                } else {
                                                  x.push(value);
                                                  let y = currentCol;
                                                  y.push(
                                                    ammendDistributionItcdetailsColumn[currentCol1]?.data
                                                  );
                                                  filterObject.push({ [columnName]: value });
                                                  setSearchVal1(x);
                                                  setCurrentCol(y);
                                                }
                                              }
                                              setGridCustomFilter(filterObject)
                                              let newFilterData = FilterData(filterObject);
                                              setData([...newFilterData]);
              
                                            }
                                            else if (hot?.getSelected()[0][1] == 10) {
                                              let x = searchVal1
                                              var columnName = ammendDistributionItcdetailsColumn[currentCol1]?.data;
                                              var value = '';
                                              setSearchDate1('');
                                              setSearchDate1To('');
                                              let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                              if (!searchVal1?.length) {
                                                x.push(value);
                                                let y = currentCol;
                                                y.push(
                                                  ammendDistributionItcdetailsColumn[currentCol1]?.data
                                                );
                                                filterObject.push({ [columnName]: value });
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
                                                  filterObject[Index] = { [columnName]: value }
                                                } else {
                                                  x.push(value);
                                                  let y = currentCol;
                                                  y.push(
                                                    ammendDistributionItcdetailsColumn[currentCol1]?.data
                                                  );
                                                  filterObject.push({ [columnName]: value });
                                                  setSearchVal1(x);
                                                  setCurrentCol(y);
                                                }
                                              }
                                              setGridCustomFilter(filterObject)
                                              let newFilterData = FilterData(filterObject);
                                              setData([...newFilterData]);
              
                                            }
                                            else if (hot?.getSelected()[0][1] == 12) {
                                              let x = searchVal1
                                              var columnName = ammendDistributionItcdetailsColumn[currentCol1]?.data;
                                              var value = '';
                                              setSearchDate2('');
                                              setSearchDate2To('');
                                              let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                              if (!searchVal1?.length) {
                                                x.push(value);
                                                let y = currentCol;
                                                y.push(
                                                  ammendDistributionItcdetailsColumn[currentCol1]?.data
                                                );
                                                filterObject.push({ [columnName]: value });
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
                                                  filterObject[Index] = { [columnName]: value }
                                                } else {
                                                  x.push(value);
                                                  let y = currentCol;
                                                  y.push(
                                                    ammendDistributionItcdetailsColumn[currentCol1]?.data
                                                  );
                                                  filterObject.push({ [columnName]: value });
                                                  setSearchVal1(x);
                                                  setCurrentCol(y);
                                                }
                                              }
                                              setGridCustomFilter(filterObject)
                                              let newFilterData = FilterData(filterObject);
                                              setData([...newFilterData]);
              
                                            }
                                            else if (hot?.getSelected()[0][1] == 14) {
                                              let x = searchVal1
                                              var columnName = ammendDistributionItcdetailsColumn[currentCol1]?.data;
                                              var value = '';
                                              setSearchDate3('');
                                              setSearchDate3To('');
                                              let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
              
                                              if (!searchVal1?.length) {
                                                x.push(value);
                                                let y = currentCol;
                                                y.push(
                                                  ammendDistributionItcdetailsColumn[currentCol1]?.data
                                                );
                                                filterObject.push({ [columnName]: value });
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
                                                  filterObject[Index] = { [columnName]: value }
                                                } else {
                                                  x.push(value);
                                                  let y = currentCol;
                                                  y.push(
                                                    ammendDistributionItcdetailsColumn[currentCol1]?.data
                                                  );
                                                  filterObject.push({ [columnName]: value });
                                                  setSearchVal1(x);
                                                  setCurrentCol(y);
                                                }
                                              }
                                              setGridCustomFilter(filterObject)
                                              let newFilterData = FilterData(filterObject);
                                              setData([...newFilterData]);
              
                                            }
                                            else if (hot?.getSelected()[0][1] == 16) {
                                              const x = searchVal1
                                              var columnName = ammendDistributionItcdetailsColumn[currentCol1]?.data;
                                              var value = '';
                                              setFromAmountIGST('');
                                              setToAmountIGST('');
              
                                              let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
              
                                              if (!searchVal1?.length) {
                                                x.push(value);
                                                let y = currentCol;
                                                y.push(
                                                  ammendDistributionItcdetailsColumn[currentCol1]?.data
                                                );
                                                filterObject.push({ [columnName]: value });
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
                                                  filterObject[Index] = { [columnName]: value }
                                                } else {
                                                  x.push(value);
                                                  let y = currentCol;
                                                  y.push(
                                                    ammendDistributionItcdetailsColumn[currentCol1]?.data
                                                  );
                                                  filterObject.push({ [columnName]: value });
                                                  setSearchVal1(x);
                                                  setCurrentCol(y);
                                                }
                                              }
                                              setGridCustomFilter(filterObject)
                                              let newFilterData = FilterData(filterObject);
                                              setData([...newFilterData]);
              
                                            }
                                            else if (hot?.getSelected()[0][1] == 17) {
                                              const x = searchVal1
                                              var columnName = ammendDistributionItcdetailsColumn[currentCol1]?.data;
                                              var value = '';
                                              setFromAmountCGST('');
                                              setToAmountCGST('');
              
                                              let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                              if (!searchVal1?.length) {
                                                x.push(value);
                                                let y = currentCol;
                                                y.push(
                                                  ammendDistributionItcdetailsColumn[currentCol1]?.data
                                                );
                                                filterObject.push({ [columnName]: value });
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
                                                  filterObject[Index] = { [columnName]: value }
                                                } else {
                                                  x.push(value);
                                                  let y = currentCol;
                                                  y.push(
                                                    ammendDistributionItcdetailsColumn[currentCol1]?.data
                                                  );
                                                  filterObject.push({ [columnName]: value });
                                                  setSearchVal1(x);
                                                  setCurrentCol(y);
                                                }
                                              }
                                              setGridCustomFilter(filterObject)
                                              let newFilterData = FilterData(filterObject);
                                              setData([...newFilterData]);
              
                                            }
                                            else if (hot?.getSelected()[0][1] == 18) {
                                              const x = searchVal1
                                              var columnName = ammendDistributionItcdetailsColumn[currentCol1]?.data;
                                              var value = '';
                                              setFromAmountSGST('');
                                              setToAmountSGST('');
              
                                              let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
              
                                              if (!searchVal1?.length) {
                                                x.push(value);
                                                let y = currentCol;
                                                y.push(
                                                  ammendDistributionItcdetailsColumn[currentCol1]?.data
                                                );
                                                filterObject.push({ [columnName]: value });
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
                                                  filterObject[Index] = { [columnName]: value }
                                                } else {
                                                  x.push(value);
                                                  let y = currentCol;
                                                  y.push(
                                                    ammendDistributionItcdetailsColumn[currentCol1]?.data
                                                  );
                                                  filterObject.push({ [columnName]: value });
                                                  setSearchVal1(x);
                                                  setCurrentCol(y);
                                                }
                                              }
                                              setGridCustomFilter(filterObject)
                                              let newFilterData = FilterData(filterObject);
                                              setData([...newFilterData]);
              
                                            }
                                            else if (hot?.getSelected()[0][1] == 19) {
                                              const x = searchVal1
                                              var columnName = ammendDistributionItcdetailsColumn[currentCol1]?.data;
                                              var value = '';
                                              setFromAmountCESS('');
                                              setToAmountCESS('');
              
                                              let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                              if (!searchVal1?.length) {
                                                x.push(value);
                                                let y = currentCol;
                                                y.push(
                                                  ammendDistributionItcdetailsColumn[currentCol1]?.data
                                                );
                                                filterObject.push({ [columnName]: value });
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
                                                  filterObject[Index] = { [columnName]: value }
                                                } else {
                                                  x.push(value);
                                                  let y = currentCol;
                                                  y.push(
                                                    ammendDistributionItcdetailsColumn[currentCol1]?.data
                                                  );
                                                  filterObject.push({ [columnName]: value });
                                                  setSearchVal1(x);
                                                  setCurrentCol(y);
                                                }
                                              }
                                              setGridCustomFilter(filterObject)
                                              let newFilterData = FilterData(filterObject);
                                              setData([...newFilterData]);
              
                                            }
                                            else if (isValidCheckBoxColumn) {
                                              let x = searchVal1
                                              var checkboxes = document.getElementsByClassName('checkBoxClass');
              
                                              arrChk = []
                                              setFilterDropDownList([]);
                                              var columnName = ammendDistributionItcdetailsColumn[currentCol1]?.data;
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

                                              let value = ""
                                              if (!searchVal1?.length) {
                                                x.push(value);
                                                let y = currentCol;
                                                y.push(
                                                  ammendDistributionItcdetailsColumn[currentCol1]?.data
                                                );
                                                // filterObject.push({ [columnName]: value });
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
                                                  // filterObject[Index] = { [columnName]: value }
                                                } else {
                                                  x.push(value);
                                                  let y = currentCol;
                                                  y.push(
                                                    ammendDistributionItcdetailsColumn[currentCol1]?.data
                                                  );
                                                  // filterObject.push({ [columnName]: value });
                                                  setSearchVal1(x);
                                                  setCurrentCol(y);
                                                }
                                              }
                                              setGridCustomFilter(filterObject)
                                              let newFilterData = FilterData(filterObject);
                                              setData([...newFilterData]);
              
                                              const updatedFilterDropDownList = filterObject.reduce((acc, item) => {
                                                const { EligibilityOfITC, UnitType, NoteType, SezSupplier, } = item;
              
                                                const updateList = (list, value) => {
                                                  return list.includes(value) ? list : [...list, value];
                                                };
              
                                                if (EligibilityOfITC !== undefined) {
                                                  acc.eligibilityofITCDropDownList = updateList(acc.eligibilityofITCDropDownList, EligibilityOfITC);
                                                } else if (UnitType !== undefined) {
                                                  acc.unitTypeDropDownList = updateList(acc.unitTypeDropDownList, UnitType);
                                                } else if (NoteType !== undefined) {
                                                  acc.noteTypeDropDownList = updateList(acc.noteTypeDropDownList, NoteType);
                                                } else if (SezSupplier !== undefined) {
                                                  acc.sezDropDownList = updateList(acc.sezDropDownList, SezSupplier);
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
                                  const hot = hotRef5?.current?.hotInstance;
                                  const selectedValuecol = hot?.getSelected()[0][1];
                                  // const shouldExcludeTextBox = [3, 5, 6, 4, 7, 8, 9, 10, 11, 12, 13, 14, 17].includes(selectedValuecol);
                                  const shouldExcludeCheckBox = [0,4,5,8,15].includes(selectedValuecol);
                                  if (hot?.getSelected()[0][1] != 3 && hot?.getSelected()[0][1] != 10 && hot?.getSelected()[0][1] != 12 && hot?.getSelected()[0][1] != 14 && hot?.getSelected()[0][1] != 16 && hot?.getSelected()[0][1] != 17 && hot?.getSelected()[0][1] != 18 && hot?.getSelected()[0][1] != 19 && hot?.getSelected()[0][1] != 0 && hot?.getSelected()[0][1] != 4 && hot?.getSelected()[0][1] != 5 && hot?.getSelected()[0][1] != 8 && hot?.getSelected()[0][1] != 15 ) {
                                    let x = searchVal1
                      var searchInput = document.querySelector(".htUIMultipleSelectSearch.htUIInput");
                      var value = searchInput?.children[0].value;
                      //  x.push(value)
                      var columnName = ammendDistributionItcdetailsColumn[currentCol1]?.data;
                      let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                      if (!searchVal1?.length) {
                        x.push(value);
                        let y = currentCol;
                        y.push(
                          ammendDistributionItcdetailsColumn[currentCol1]?.data
                        );
                        filterObject.push({ [columnName]: value });
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
                          filterObject[Index] = { [columnName]: value }
                        } else {
                          x.push(value);
                          let y = currentCol;
                          y.push(
                            ammendDistributionItcdetailsColumn[currentCol1]?.data
                          );
                          filterObject.push({ [columnName]: value });
                          setSearchVal1(x);
                          setCurrentCol(y);
                        }
                      }

                      setGridCustomFilter(filterObject)
                      let newFilterData = FilterData(filterObject);
                      setData([...newFilterData]);
              
                                  }
                                  else if (selectedValuecol == 3) {
                                    const x = searchVal1
                                    var searchInput1 = document.getElementById("custom1");
                                    var searchInput2 = document.getElementById("custom2");
                                    const invFromDate = searchInput1?.value
                                    const invToDate = searchInput2?.value
                                    var columnName = ammendDistributionItcdetailsColumn[currentCol1]?.data;
                                    var value = `${invFromDate}to${invToDate}`;
                                    // var value = (searchInput1?.value || searchInput2?.value) && `${invFromDate ? invFromDate : invToDate}to${invToDate ? invToDate : invFromDate}`;
                                    setSearchDate(searchInput1?.value);
                                    setToDate(searchInput2?.value);
                                    let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                    if (!searchVal1?.length) {
                                      x.push(value);
                                      let y = currentCol;
                                      y.push(
                                        ammendDistributionItcdetailsColumn[currentCol1]?.data
                                      );
                                      filterObject.push({ [columnName]: value });
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
                                        filterObject[Index] = { [columnName]: value }
                                      } else {
                                        x.push(value);
                                        let y = currentCol;
                                        y.push(
                                          ammendDistributionItcdetailsColumn[currentCol1]?.data
                                        );
                                        filterObject.push({ [columnName]: value });
                                        setSearchVal1(x);
                                        setCurrentCol(y);
                                      }
                                    }
                                    setGridCustomFilter(filterObject)
                                    let newFilterData = FilterData(filterObject);
                                    setData([...newFilterData]);
              
                                  }
  
                                  else if (selectedValuecol == 10) {
                                    const x = searchVal1
                                    var searchInput1 = document.getElementById("custom1");
                                    var searchInput2 = document.getElementById("custom2");
                                    const invFromDate = searchInput1?.value
                                    const invToDate = searchInput2?.value
                                    var columnName = ammendDistributionItcdetailsColumn[currentCol1]?.data;
                                    var value = `${invFromDate}to${invToDate}`;
                                    // var value = (searchInput1?.value || searchInput2?.value) && `${invFromDate ? invFromDate : invToDate}to${invToDate ? invToDate : invFromDate}`;
                                    setSearchDate1(searchInput1?.value);
                                    setSearchDate1To(searchInput2?.value);
                                    let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                    if (!searchVal1?.length) {
                                      x.push(value);
                                      let y = currentCol;
                                      y.push(
                                        ammendDistributionItcdetailsColumn[currentCol1]?.data
                                      );
                                      filterObject.push({ [columnName]: value });
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
                                        filterObject[Index] = { [columnName]: value }
                                      } else {
                                        x.push(value);
                                        let y = currentCol;
                                        y.push(
                                          ammendDistributionItcdetailsColumn[currentCol1]?.data
                                        );
                                        filterObject.push({ [columnName]: value });
                                        setSearchVal1(x);
                                        setCurrentCol(y);
                                      }
                                    }
                                    setGridCustomFilter(filterObject)
                                    let newFilterData = FilterData(filterObject);
                                    setData([...newFilterData]);
              
                                  }
              
                                  else if (selectedValuecol == 12) {
                                    const x = searchVal1
                                    var searchInput1 = document.getElementById("custom1");
                                    var searchInput2 = document.getElementById("custom2");
                                    const invFromDate = searchInput1?.value
                                    const invToDate = searchInput2?.value
                                    var columnName = ammendDistributionItcdetailsColumn[currentCol1]?.data;
                                    var value = `${invFromDate}to${invToDate}`;
                                    // var value = (searchInput1?.value || searchInput2?.value) && `${invFromDate ? invFromDate : invToDate}to${invToDate ? invToDate : invFromDate}`;
                                    setSearchDate2(searchInput1?.value);
                                    setSearchDate2To(searchInput2?.value);
                                    let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                    if (!searchVal1?.length) {
                                      x.push(value);
                                      let y = currentCol;
                                      y.push(
                                        ammendDistributionItcdetailsColumn[currentCol1]?.data
                                      );
                                      filterObject.push({ [columnName]: value });
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
                                        filterObject[Index] = { [columnName]: value }
                                      } else {
                                        x.push(value);
                                        let y = currentCol;
                                        y.push(
                                          ammendDistributionItcdetailsColumn[currentCol1]?.data
                                        );
                                        filterObject.push({ [columnName]: value });
                                        setSearchVal1(x);
                                        setCurrentCol(y);
                                      }
                                    }
                                    setGridCustomFilter(filterObject)
                                    let newFilterData = FilterData(filterObject);
                                    setData([...newFilterData]);
              
                                  }

                                  else if (selectedValuecol == 14) {
                                    const x = searchVal1
                                    var searchInput1 = document.getElementById("custom1");
                                    var searchInput2 = document.getElementById("custom2");
                                    const invFromDate = searchInput1?.value
                                    const invToDate = searchInput2?.value
                                    var columnName = ammendDistributionItcdetailsColumn[currentCol1]?.data;
                                    // var value = (searchInput1?.value || searchInput2?.value) && `${invFromDate ? invFromDate : invToDate}to${invToDate ? invToDate : invFromDate}`;
                                    var value = `${invFromDate}to${invToDate}`;
                                    setSearchDate3(searchInput1?.value);
                                    setSearchDate3To(searchInput2?.value);
                                    let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                    if (!searchVal1?.length) {
                                      x.push(value);
                                      let y = currentCol;
                                      y.push(
                                        ammendDistributionItcdetailsColumn[currentCol1]?.data
                                      );
                                      filterObject.push({ [columnName]: value });
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
                                        filterObject[Index] = { [columnName]: value }
                                      } else {
                                        x.push(value);
                                        let y = currentCol;
                                        y.push(
                                          ammendDistributionItcdetailsColumn[currentCol1]?.data
                                        );
                                        filterObject.push({ [columnName]: value });
                                        setSearchVal1(x);
                                        setCurrentCol(y);
                                      }
                                    }
                                    setGridCustomFilter(filterObject)
                                    let newFilterData = FilterData(filterObject);
                                    setData([...newFilterData]);
              
                                  }
  
                                  else if (hot?.getSelected()[0][1] == 16) {
                                    const x = searchVal1
                                    var searchInput1 = document.getElementById("amount1");
                                    var searchInput2 = document.getElementById("amount2");
                                    const fromAmount = searchInput1?.value
                                    const toAmount = searchInput2?.value
                                    var columnName = ammendDistributionItcdetailsColumn[currentCol1]?.data;
                                    // var value = (searchInput1?.value || searchInput2?.value) && `${fromAmount ? fromAmount : toAmount}to${toAmount ? toAmount : fromAmount}`;
                                    var value = `${fromAmount}to${toAmount}`;
                                    setFromAmountIGST(searchInput1?.value);
                                    setToAmountIGST(searchInput2?.value);
                                    let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                    if (!searchVal1?.length) {
                                      x.push(value);
                                      let y = currentCol;
                                      y.push(
                                        ammendDistributionItcdetailsColumn[currentCol1]?.data
                                      );
                                      filterObject.push({ [columnName]: value });
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
                                        filterObject[Index] = { [columnName]: value }
                                      } else {
                                        x.push(value);
                                        let y = currentCol;
                                        y.push(
                                          ammendDistributionItcdetailsColumn[currentCol1]?.data
                                        );
                                        filterObject.push({ [columnName]: value });
                                        setSearchVal1(x);
                                        setCurrentCol(y);
                                      }
                                    }
                                    setGridCustomFilter(filterObject)
                                    let newFilterData = FilterData(filterObject);
                                    setData([...newFilterData]);
              
                                  }
              
                                  else if (hot?.getSelected()[0][1] == 17) {
                                    const x = searchVal1
                                    var searchInput1 = document.getElementById("amount1");
                                    var searchInput2 = document.getElementById("amount2");
                                    const fromAmount = searchInput1?.value
                                    const toAmount = searchInput2?.value
                                    var columnName = ammendDistributionItcdetailsColumn[currentCol1]?.data;
                                    var value = `${fromAmount}to${toAmount}`;
                                    // var value = (searchInput1?.value || searchInput2?.value) && `${fromAmount ? fromAmount : toAmount}to${toAmount ? toAmount : fromAmount}`;
                                    setFromAmountCGST(searchInput1?.value);
                                    setToAmountCGST(searchInput2?.value);
                                    let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                    if (!searchVal1?.length) {
                                      x.push(value);
                                      let y = currentCol;
                                      y.push(
                                        ammendDistributionItcdetailsColumn[currentCol1]?.data
                                      );
                                      filterObject.push({ [columnName]: value });
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
                                        filterObject[Index] = { [columnName]: value }
                                      } else {
                                        x.push(value);
                                        let y = currentCol;
                                        y.push(
                                          ammendDistributionItcdetailsColumn[currentCol1]?.data
                                        );
                                        filterObject.push({ [columnName]: value });
                                        setSearchVal1(x);
                                        setCurrentCol(y);
                                      }
                                    }
                                    setGridCustomFilter(filterObject)
                                    let newFilterData = FilterData(filterObject);
                                    setData([...newFilterData]);
              
                                  }
              
                                  else if (hot?.getSelected()[0][1] == 18) {
                                    const x =  searchVal1
                                    var searchInput1 = document.getElementById("amount1");
                                    var searchInput2 = document.getElementById("amount2");
                                    const fromAmount = searchInput1?.value
                                    const toAmount = searchInput2?.value
                                    var columnName = ammendDistributionItcdetailsColumn[currentCol1]?.data;
                                    var value = `${fromAmount}to${toAmount}`;
                                    // var value = (searchInput1?.value || searchInput2?.value) && `${fromAmount ? fromAmount : toAmount}to${toAmount ? toAmount : fromAmount}`;
                                    setFromAmountSGST(searchInput1?.value);
                                    setToAmountSGST(searchInput2?.value);
                                    let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                    if (!searchVal1?.length) {
                                      x.push(value);
                                      let y = currentCol;
                                      y.push(
                                        ammendDistributionItcdetailsColumn[currentCol1]?.data
                                      );
                                      filterObject.push({ [columnName]: value });
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
                                        filterObject[Index] = { [columnName]: value }
                                      } else {
                                        x.push(value);
                                        let y = currentCol;
                                        y.push(
                                          ammendDistributionItcdetailsColumn[currentCol1]?.data
                                        );
                                        filterObject.push({ [columnName]: value });
                                        setSearchVal1(x);
                                        setCurrentCol(y);
                                      }
                                    }
                                    setGridCustomFilter(filterObject)
                                    let newFilterData = FilterData(filterObject);
                                    setData([...newFilterData]);
              
                                  }
              
                                  else if (hot?.getSelected()[0][1] == 19) {
                                    const x = searchVal1
                                    var searchInput1 = document.getElementById("amount1");
                                    var searchInput2 = document.getElementById("amount2");
                                    const fromAmount = searchInput1?.value
                                    const toAmount = searchInput2?.value
                                    var columnName = ammendDistributionItcdetailsColumn[currentCol1]?.data;
                                    var value = `${fromAmount}to${toAmount}`;
                                    // var value = (searchInput1?.value || searchInput2?.value) && `${fromAmount ? fromAmount : toAmount}to${toAmount ? toAmount : fromAmount}`;
                                    setFromAmountCESS(searchInput1?.value);
                                    setToAmountCESS(searchInput2?.value);
                                    let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                    if (!searchVal1?.length) {
                                      x.push(value);
                                      let y = currentCol;
                                      y.push(
                                        ammendDistributionItcdetailsColumn[currentCol1]?.data
                                      );
                                      filterObject.push({ [columnName]: value });
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
                                        filterObject[Index] = { [columnName]: value }
                                      } else {
                                        x.push(value);
                                        let y = currentCol;
                                        y.push(
                                          ammendDistributionItcdetailsColumn[currentCol1]?.data
                                        );
                                        filterObject.push({ [columnName]: value });
                                        setSearchVal1(x);
                                        setCurrentCol(y);
                                      }
                                    }
                                    setGridCustomFilter(filterObject)
                                    let newFilterData = FilterData(filterObject);
                                    setData([...newFilterData]);
              
                                  }
              
                                  else if (shouldExcludeCheckBox) {
                                    let x = searchVal1
                                    var checkboxes = document.getElementsByClassName('checkBoxClass');
                                    arrChk = []
                                    setFilterDropDownList([]);
                                    var columnName = ammendDistributionItcdetailsColumn[currentCol1]?.data;
                                    let filterObject = !gridCustomFilter ? [] : gridCustomFilter
                                    let filterObject2 = []
                                    filterObject = filterObject == null || filterObject.length <= 0 ? [] : filterObject;
              
                                    for (let i = 0; i < checkboxes.length; i++) {
                                      if (checkboxes[i].checked) {
              
                                        arrChk.push({ [columnName]: checkboxes[i].value });
                                        filterObject2.push(checkboxes[i].value);
                                        filterObject.push({ [columnName]: checkboxes[i].value });
                                      } else {
              
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
                                        filterObject = uniqueArray
                                        const index = filterObject.findIndex(obj => obj[columnName] === checkboxes[i].value);
                                        if (index !== -1) {
              
                                          delete filterObject[index][columnName];
                                        }
                                      }
                                    } 
                                    var value = filterObject2.join("@#@#")
                                    if (!searchVal1?.length) {
                                      x.push(value);
                                      let y = currentCol;
                                      y.push(
                                        ammendDistributionItcdetailsColumn[currentCol1]?.data
                                      );
                                      // filterObject.push({ [columnName]: value });
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
                                        // filterObject[Index] = { [columnName]: value }
                                      } else {
                                        x.push(value);
                                        let y = currentCol;
                                        y.push(
                                          ammendDistributionItcdetailsColumn[currentCol1]?.data
                                        );
                                        // filterObject.push({ [columnName]: value });
                                        setSearchVal1(x);
                                        setCurrentCol(y);
                                      }
                                    }
                                    setGridCustomFilter(filterObject)
                                    let newFilterData = FilterData(filterObject);
                                    setData([...newFilterData]);
              
                                    const updatedFilterDropDownList = filterObject.reduce((acc, item) => {
                                      const { EligibilityOfITC, UnitType, NoteType, SezSupplier, } = item;
    
                                      const updateList = (list, value) => {
                                        return list.includes(value) ? list : [...list, value];
                                      };
    
                                      if (EligibilityOfITC !== undefined) {
                                        acc.eligibilityofITCDropDownList = updateList(acc.eligibilityofITCDropDownList, EligibilityOfITC);
                                      } else if (UnitType !== undefined) {
                                        acc.unitTypeDropDownList = updateList(acc.unitTypeDropDownList, UnitType);
                                      } else if (NoteType !== undefined) {
                                        acc.noteTypeDropDownList = updateList(acc.noteTypeDropDownList, NoteType);
                                      } else if (SezSupplier !== undefined) {
                                        acc.sezDropDownList = updateList(acc.sezDropDownList, SezSupplier);
                                      } 
    
                                      return acc;
                                    }, { eligibilityofITCDropDownList: [], unitTypeDropDownList: [], noteTypeDropDownList:[], sezDropDownList:[] });
    
                                    setFilterDropDownList(updatedFilterDropDownList);
              
                                  }
                                }}
                                viewportColumnRenderingOffset={1000}
                              />
                            {paginationComponent()}
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </TabPane>
              </TabPane>
            )}

            {/* Total ITC Available  */}
            {activeTab == 7 && (
              <TabPane tabId="7" key="7">
                <TabPane tabId="7" key="7">
                  <Card>
                    <CardBody className="CardBody p-0">
                      {upperContent()}
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
                                // autoColumnSize={true}
                                autoColumnSize={{
                                  samplingRatio: 23  // Adjust the samplingRatio as needed
                                }}
                                manualColumnResize={false}
                                colHeaders={colHeaders}
                                // afterGetColHeader={theaderAmends}
                                stretchH="all"
                                preventOverflow="horizontal"
                                columns={totalITC}
                                rowHeights={RowSize}
                                columnHeaderHeight={columnHeaderSize}
                                contextMenu={false}
                                bindRowsWithHeaders={true}
                                licenseKey="non-commercial-and-evaluation"
                                height="auto"
                                ref={hotRef7}
                                afterOnCellMouseDown={localAfterOnCellMouseDown}
                                mergeCells={false}
                                cells={function (row, col) {
                                  var cp = {};
                                  if (col !== null) {
                                    cp.renderer = emptyRenderTotalITCAvailable;
                                  }
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

                              />
                            ) : (
                              <HotTable
                                autoWrapRow={true}
                                // style={{
                                //   textAlign: "center",
                                //   overflowX: "hidden",
                                // }}
                                data={[{ Description: "No Data Found" }]}
                                // autoColumnSize={true}
                                autoColumnSize={{
                                  samplingRatio: 23  // Adjust the samplingRatio as needed
                                }}
                                manualColumnResize={false}
                                colHeaders={colHeaders}
                                // afterGetColHeader={theaderAmends}
                                stretchH="all"
                                preventOverflow="horizontal"
                                columns={totalITC}
                                rowHeights={RowSize}
                                columnHeaderHeight={columnHeaderSize}
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

                                  if (col == 0) {

                                    cp.className = "text-center";
                                  }
                                  return cp;

                                }}

                              />
                            )}

                            {paginationComponent()}
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </TabPane>
              </TabPane>
            )}

            {/* Late fee  */}
            {activeTab == 8 && (
              <TabPane tabId="8" key="8">
                <TabPane tabId="8" key="8">
                  <Card>
                    <CardBody className="CardBody p-0">
                      {upperContent()}
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
                                // autoColumnSize={true}
                                autoColumnSize={{
                                  samplingRatio: 23  // Adjust the samplingRatio as needed
                                }}
                                manualColumnResize={false}
                                colHeaders={colHeaders}
                                // afterGetColHeader={theaderAmends}
                                stretchH="all"
                                preventOverflow="horizontal"
                                columns={lateFeeColumns}
                                contextMenu={false}
                                rowHeights={RowSize}
                                columnHeaderHeight={columnHeaderSize}
                                readOnly={true}
                                bindRowsWithHeaders={true}
                                licenseKey="non-commercial-and-evaluation"
                                height="auto"
                                ref={hotRef8}
                                afterOnCellMouseDown={localAfterOnCellMouseDown}
                                mergeCells={false}
                                cells={function (row, col) {
                                  var cp = {};
                                  if (col !== null) {
                                    cp.renderer = emptyRenderLatefee;
                                  }
                                  const hot = hotRef?.current?.hotInstance;
                                  cp.className = "child";
                                  if (col == 1 || col == 2) {
                                    cp.className = "text-end";
                                  }

                                  return cp;
                                }}

                              />
                            ) : (
                              <HotTable
                                autoWrapRow={true}
                                // style={{
                                //   textAlign: "center",
                                //   overflowX: "hidden",
                                // }}
                                data={[{ Description: "No Data Found" }]}
                                // autoColumnSize={true}
                                autoColumnSize={{
                                  samplingRatio: 23  // Adjust the samplingRatio as needed
                                }}
                                manualColumnResize={false}
                                colHeaders={colHeaders}
                                // afterGetColHeader={theaderAmends}
                                stretchH="all"
                                preventOverflow="horizontal"
                                columns={lateFeeColumns}
                                rowHeights={RowSize}
                                columnHeaderHeight={columnHeaderSize}
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

                                  if (col == 0) {

                                    cp.className = "text-center";
                                  }
                                  return cp;

                                }}

                              />
                            )}
                            {paginationComponent()}
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
