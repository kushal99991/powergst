import { useForm, Controller } from "react-hook-form";
import { Link, useNavigate, useLocation } from "react-router-dom";
// ** Third Party Components
import toast from "react-hot-toast";
// ** Utils
import { selectThemeColors } from "@utils";

// ** Icons Imports
import {
  Plus,
} from "react-feather";
import Breadcrumbs from "@components/breadcrumbs";
import moment from "moment/moment";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);
import encryptData from "../../../auth/crypto/crypto";
import $ from "jquery";
import classnames from "classnames";
import { DROPDOWN_PLACEHOLDER, SELECT_MAXSIZE } from "../../../configs/config";
import companyNewService from "../../../services/company/companyNewService";
import { globleVariable } from '../../../configs/globalVariable'
import LocalFunction from '../../../configs/getLocalFunction'
import SessionFunction from '../../../configs/getSessionFunction'
import { filterCurrentDate } from '../../../helper/filterArray';
import iifPurchaseInvoice from "../../../services/iffServices/iifPurchaseInvoice";
import { handleKeyPressPass, handlePasteText } from "@helper/validation";
import { ErrorTable, handleValidateExcel, validationErrorMessage } from "@helper/validation";

// ** Reactstrap Imports
import {
  Row,
  Col,
  Form,
  Input,
  Label,
  Alert,
  Button,
  CardText,
  CardTitle,
  FormFeedback,
  CardSubtitle,
  Card,
  CardBody,
  Table,
  UncontrolledTooltip
} from "reactstrap";
import Flatpickr from "react-flatpickr";
import Select from "react-select";
// ** Styles
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/libs/react-select/_react-select.scss";
import { Fragment, useEffect, useRef, useState } from "react";
import purchaseInvoiceService from "../../../services/Reco/Purchase/purchaseInvoiceService";
//** Error Code file
import errorCodeConfig from "../../../configs/apiErrorCodeConfig";
//** Handsontable
import { HotTable, HotColumn } from "@handsontable/react";
import Handsontable from "handsontable";
import { registerRenderer, textRenderer } from "handsontable/renderers";
import { registerAllModules } from "handsontable/registry";
import classNames from "classnames";
import { useHotkeys } from "react-hotkeys-hook";
import { keysMap, enableOnFormTags } from "../../../configs/config";


registerAllModules();

//**  1. B2B, SEZ, DE Invoices (4A, 4B, 4C, 6B, 6C)
//**  3. B2C (Large) Invoices (5A, 5B)
//**  5. B2CS Invoices (7)
//**  7. Credit/Debit Notes (Registered) (9B)
//**  9. Credit Debit Note (Unregistered)(9B)
//**  11. Exports Invoices (6A)

// ** Amendment
//** 2. B2B Amendments(9A)
//** 4. B2C Large Amendments(9A)
//** 6. B2C Others Amendments(10)
//** 8. Credit/Debit Notes (Registered) Amendments(9C)
//** 10. Credit Debit Note (Unregistered) Amendments(9C)
//** 12. Export Invoices Amendments(9A)
//** 14. Advances Received (Tax Liability) Amendments(11(2))
//** 16. Adjustment of Advances Amendments(11(2))

//** Rupess Symbol
const rupessSymbol = "&#8377;";

let stateOptionsList = JSON.parse(JSON.parse(LocalFunction.getLocalValue(globleVariable.stateList, true)));

//** Rect-Hook
const defaultValues = {
  gstnumber: "",
  nameofparty: "",
  invoicenumber: "",
  invdate: null,
  postingdate: null,
  invvalue: "",
  placeofsupply: "",
  reversechange: "",
  invtype: "",
  eligibleitc: "",
  igst: "",
  cgst: "",
  sgst: "",
  cess: "",
  postingmonth: "",
  remark1: "",
  remark2: "",
  remark3: "",
  remark4: "",
  remark5: "",
  bankname: "",
  accountnumber: "",
  branchName: "",
  ifsccode: "",
  customernotes: "",
  termsAndConditions: "",
  portCode: "",
  supplyType: "",
  typeofimp: "",
  typeofNote: "",
  eCommerceGSTIN: "",
  revisedInvoiceNumber: "",
  revisedInvoiceDate: "",
  originalInvoiceNumber: "",
  originalInvoiceDate: "",
  finYearMonth: ""
};

//** Reverse Changes
const reverseChangeList = [
  { value: "1", label: "Yes" },
  { value: "0", label: "No" },
];

//** Credit Debit
const crdrList = [
  { value: "C", label: "Credit" },
  { value: "D", label: "Debit" },
];

// ** Rate
const RateList = [
  { value: "0", label: "0" },
  { value: "0.1", label: "0.1" },
  { value: "0.25", label: "0.25" },
  { value: "1", label: "1" },
  { value: "1.5", label: "1.5" },
  { value: "3", label: "3" },
  { value: "5", label: "5" },
  { value: "6", label: "6" },
  { value: "7.5", label: "7.5" },
  { value: "12", label: "12" },
  { value: "18", label: "18" },
  { value: "28", label: "28" },
];

//** Invoice Type
const invTypeList = [
  // { value: "R", label: "Regular" },
  { value: "RB2B", label: "Regular B2B" },
  { value: "SEZWP", label: "SEZ Exports with payment" },
  { value: "SEZWOP", label: "SEZ Exports without payment" },
  { value: "DE", label: "Deemed Exports" },
  { value: "ISSAI", label: "Intra-State supplier attracting IGST" },
];

//** CDN Invoice Type
const CDNInvTypeList = [
  { value: "B2CS", label: "B2CS" },
  { value: "B2CL", label: "B2CL" },
  { value: "EXPWP", label: "Export with payment" },
  { value: "EXPWOP", label: "Export without Payment" },
];

//** ITC Type
const itcTypeList = [
  { value: "", label: "" },
  { value: "I", label: "Input" },
  { value: "CG", label: "Captial Goods" },
  { value: "IS", label: "Input Service" },
  { value: "INELG", label: "Ineligible" },
  { value: "N", label: "None" },
];

//** Supply Type
const supplyTypeList = [
  { value: "1", label: "Inter State", name :  "InterState"  },
  { value: "2", label: "Intra State" , name :  "IntraState" },
];

const typeOfImpList = [
  // { value: "", label: "--Select--" },
  { value: "wpay", label: "Export with Payment" },
  { value: "wopay", label: "Export without Payment" },
];



const finYearOption = LocalFunction.getLocalValue(globleVariable.rangeFilters, true);
const YearList = JSON.parse(finYearOption)

console.log('show date' ,  YearList );

function sales() {
  //** Table  Object - Entry Table
  const tblrows = {
    itemdesc: "",
    itemtype: "",
    hsnCode: "",
    qty: "",
    uom: "",
    rate: "",
    discount: "",
    taxablevalue: "",
    taxblerate: "",
    igst: "",
    cgst: "",
    sgst: "",
    cessPer: "",
    cessRate: "",
    itcEligibiltiy: "",
    itcPercent: "",
    itcCgst: "",
    itcSgst: "",
    itcIgst: "",
    itcCess: "",
  };

  //** Table  Object - Total Amount Show
  const tblrowsTotCol = {
    total: "",
  };

  let decrptyUrl = null;
  const hotRef = useRef(null);
  const hotRefTot = useRef(null);

  const { search } = useLocation();
  let location = useLocation();
  const [searchParams] = new URLSearchParams(search);

  //** location state
  const sectionName =
    location?.state?.sectionName !== null &&
      location?.state?.sectionName !== "" &&
      location?.state?.sectionName !== undefined
      ? " - " + location?.state?.sectionName
      : "";


  const retrunDates = location?.state?.returnDate !== null && location?.state?.returnDate !== ""
    && location?.state?.returnDate !== undefined ? location?.state?.returnDate : null;

  console.log("section Name");
  console.log(location?.state);

  //** Max Date
  let Maxtoday = null;
  const setMonth = retrunDates?.substring(0, 2);
  const setYear = retrunDates?.substring(2, 6);

  const FinDateTime = LocalFunction.getLocalValue(globleVariable.serverDateTime, true);

  const serverDate = JSON.parse(FinDateTime).toString().split("T")[0];
  const date = new Date(serverDate);
  const showMonth = date.getMonth() + 1;
  const days = parseInt(setMonth) == showMonth ? date.getDate() : 0;
  const months =
    parseInt(setMonth) == showMonth
      ? parseInt(setMonth) - 1
      : parseInt(setMonth);

  if (setMonth == undefined && setYear == undefined) {
    Maxtoday = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  } else {
    Maxtoday = new Date(setYear, months, days);
  }

  console.log("max-date", Maxtoday)


  //** Hook
  const [count, setCount] = useState(1);
  const [purchaseData, setPurchaseData] = useState([]);
  const [purchaseDataTotCol, setPurchaseTotColData] = useState([]);
  const [discTest, setDiscTest] = useState(1);
  const [doctypeDropDown, setDocTypeDropDown] = useState(false);
  const [invDateSelection, setinvDateSelection] = useState(null);
  const [revDateSelection, setRevDateSelection] = useState(null);
  const [orginalInvoiceDateSelection, setOrginalInvoiceDate] = useState(null);
  const [postingDtSelection, setPostingDtSelection] = useState(null);
  const [searchBy, setSearchBy] = useState(false);
  const [gstinCalc, setGstinCalc] = useState(false);
  const [maxInvDate, setMaxInvDate] = useState("");

  const [isEdit, setEdit] = useState(false);
  const [roundOff, setRoundOff] = useState(false);

  const [titleShow, setTitleShow] = useState("Sales Invoice");
  const [btnName, setbtnName] = useState("Save");
  const [totTaxableValue, setTotTaxableValue] = useState(0.0);
  const [totCGSTValue, setTotCGSTValue] = useState(0.0);
  const [totSGSTValue, setTotSGSTValue] = useState(0.0);
  const [totIGSTValue, setTotIGSTValue] = useState(0.0);
  const [totCessValue, setCessGSTValue] = useState(0.0);
  const [totalInvoiceAmt, setTotalInvoiceAmt] = useState(0.0);
  const [totTax, setTotTax] = useState(0.0);
  const [totDisAmt, setTotDiscAmt] = useState(0.0);

  const [lblInvNoSet, setLblInvNoSet] = useState("Invoice Number");
  const [lblInvoiceDate, setLblInvoiceDate] = useState("Invoice Date");
  const [titleForm, setTitleForm] = useState("Add IFF");
  const [invoideTypeTitle, setInvoiceTypeTitle] = useState("UR Type");

  const [discSetValue, setDiscSetValue] = useState(true);

  const [discTypesDisplay, setDiscTypesDisplay] = useState(true);
  const [discTypesDisplayName, setDiscTypesDisplayName] = useState("%");
  const [displayGSTIN, setDisplayGSTIN] = useState(false);
  const [impgNimpsDisable, setimpgNimpsDisable] = useState(false);
  const [disableRCM, setDisableRCM] = useState(false);
  const [disableInvType, setDisableInvType] = useState(false);
  const [maxAmount, setMaxAmount] = useState(250000);
  const [checkValidation, setCheckValidation] = useState(false);
  const [gstRateReadable, setGstRateReadable] = useState(false);
  const [purchseCellDisableClass, setPurchseCellDisableClass] = useState("");
  const [yearMonthData, setYearMonthData] = useState([]);



  //** location state url/path
  let fromPath = location.state?.pathname || "/gst-returns/IIF";

  let purId = "";
  let finId = "";
  let finMonth = "";
  let purSecId = "";
  let isRecoUrl = false;
  let isRecoData = null;
  let fkpanRecoUserId = null;
  let isPanRecoUserId = false;

  //** Params
  if (searchParams !== undefined) {
    isRecoUrl = location?.state?.isRecoRedirect;
    isRecoData = location?.state?.data;
    fkpanRecoUserId = location?.state?.fkId;
    isPanRecoUserId = location?.state?.isPanReco;

    const setUrl = searchParams[0].replaceAll(" ", "+");
    decrptyUrl = encryptData.decrypt(setUrl);
    var params = decrptyUrl.split("&");
    purId = params[0].split("=")[1];
    finId = params[1].split("=")[1];
    finMonth = params[2].split("=")[1];
    purSecId = params[3].split("=")[1];
  } else {
    purSecId = location?.state?.sectionId;
    // sessionStorage.getItem("SectionId");
    decrptyUrl = null;
    purId = null;
  }

  const [editPurchaseId, setEditPurchaseId] = useState(purId);
  const [importType, setImportType] = useState([]);
  const [itcEligibility, setItcEligibility] = useState([]);
  const [itemType, setItemType] = useState([]);
  const [taxrate, setTaxrate] = useState([]);
  const [unitMeasurement, setUnitMeasurement] = useState([]);
  const [btnTermCondition, setBtnTermCondition] = useState(false);
  const [btnCutomerNote, setBtnCutomerNote] = useState(false);
  const [discType, setDiscType] = useState("discPer"); // DiscountType : 0 - Rs, 1 - %
  const [block, setBlock] = useState(false);
  const [errorArr, setErrorArr] = useState([]);
  const [crDr, setCrDr] = useState(1);
  const navigator = useNavigate();
  const formRef = useRef();

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    clearErrors,
    trigger,
    reset,
  } = useForm({ defaultValues  });

  //** Shortcut keys
  useHotkeys(keysMap.MANUAL_DELETE, () => deletePurchaseInvoice(), {
    enableOnFormTags,
  });
  useHotkeys(keysMap.SAVE_DATA, () => handleSubmit(onSubmit)(), {
    enableOnFormTags,
  });
  useHotkeys(keysMap.ADD_ENTRY, () => addNewRows(), { enableOnFormTags });


  const G_State = SessionFunction.getSessionValue(globleVariable.G_State, true)
  const G_UCParId = SessionFunction.getSessionValue(globleVariable.G_UCParId, true)
  const G_FY = SessionFunction.getSessionValue(globleVariable.G_FY, true)
  const G_FM = SessionFunction.getSessionValue(globleVariable.G_FM, true)
  const gstr1Range = SessionFunction.getSessionValue(globleVariable.gstr1FromDt, true)


  useEffect(() => {


    if (purSecId == 14 || purSecId == 16 ) {
      const maxMonthYear =  new Date(Maxtoday)
      const frDataFilter = filterCurrentDate(YearList, maxMonthYear);
        if (frDataFilter?.length > 0) {
          setYearMonthData(frDataFilter);
        }
    }


}, [])

const invalidColumn=[
  {
    data: "itemdesc",
    title: "Item Description",
    width: 250,
    type: "text"
  },
  {
    data: "itemtype",
    type: "dropdown",
    source: ["Good", "Service"],
    title: "Item Type",
    allowInvalid: false,
    width: 120,
  },
  { data: "hsnCode", title: "HSN Code",
  //  type: "numeric"
  //   validator :  isEvenNumber
  //   isEvenNumber(value)
  // }
},
  {
    data: "qty", type: "numeric", title: "Qty",
    allowInvalid: false,
  },
  {
    data: "uom",
    type: "dropdown",
    source: unitMeasurement,
    title: `<div><br/>Unit Of <br/> Measurement</div>`,
    allowInvalid: false,
    width: 120,
   // strict : true
    // editor: 'select',
    // selectOptions: unitMeasurement
  },
  {
    data: "rate",
    title: "Unit Price",
    //   width: 120,
    type: "numeric",
    allowInvalid: false,
  },
  {
    data: "discount", width: 120, type: "numeric",
    allowInvalid: false,
    // validator: function (value, callback) {
    //   if (value > 99.99) {
    //       alert('Must be 255 character or less. Extra characters will be removed');
    //       this.instance.setDataAtCell(this.row, this.col, value.substring(0, 255), null);
    //   }
    //   callback(true);
    // }

  },
  {
    data: "taxablevalue",
    title: "Taxable Value",
    type: "numeric",
    allowInvalid: false,
  },
  {
    data: "taxblerate",
    type: "dropdown",
    source: taxrate,
    title: "GST Rate",
    allowInvalid: false,
    // className: purchseCellDisableClass,
    // readOnly  : gstRateReadable
  },
  {
    data: "cgst",
    readOnly: true,
    className: "purchseCellDisable",
    title: `CGST ${rupessSymbol}`,
    // width: 90,
    type: "numeric",
  },
  {
    data: "sgst",
    readOnly: true,
    className: "purchseCellDisable",
    title: `SGST ${rupessSymbol}`,
    // width: 90,
    type: "numeric",
  },
  {
    data: "igst",
    readOnly: true,
    className: "purchseCellDisable",
    title: `IGST ${rupessSymbol}`,
    //  width: 90,
    type: "numeric",
  },
  { data: "cessPer", title: "CESS %" },
  {
    data: "cessRate",
    title: `CESS Amt (${rupessSymbol})`,
    //  width: 90,
    type: "numeric",
    allowInvalid: false,
  },
  {
    data: "itcEligibiltiy",
    type: "dropdown",
    source: itcEligibility,
    title: "ITC Eligibility",
    allowInvalid: false,
    width: 120,
  },
  {
    data: "itcPercent",
    title: "ITC %",
    width: 90,
    type: "numeric",
    allowInvalid: false,
  },
  {
    data: "itcCgst",
    title: `ITC CGST Amt (${rupessSymbol})`,
    // width: 110,
    type: "numeric",
    allowInvalid: false,
  },
  {
    data: "itcSgst",
    title: `ITC SGST Amt (${rupessSymbol})`,
    //  width: 110,
    type: "numeric",
    allowInvalid: false,
  },
  {
    data: "itcIgst",
    title: `ITC IGST Amt (${rupessSymbol})`,
    // width: 110,
    type: "numeric",
    allowInvalid: false,
  },
  {
    data: "itcCess",
    title: `ITC Cess Amt (${rupessSymbol})`,
    //  width: 110,
    type: "numeric",
    allowInvalid: false,
  },
]
  //** GST Validation api service - buyer GST
  const GSTINCheck = (gstin) => {

    if (
      gstin == "" ||
      gstin == null ||
      gstin == undefined ||
      gstin.trim().length == 0
    ) {
      setError("gstnumber", {
        type: "manual",
        message: "Please enter valid GST Number.",
      });
    } else {
      setBlock(true);
      companyNewService
        .getGSTINValidate(gstin)
        .then((res) => {
          setBlock(false);
          console.log(res);
          if (
            res.status === 200 &&
            res.data.status === errorCodeConfig.APIDefaultCode.Success
          ) {
            clearErrors();

            const GSTIID = gstin.substring(0, 2);

            const filterstate = stateOptionsList.filter(
              (p) => p.value == GSTIID
            )[0];

            if (filterstate !== undefined) {
              setValue("placeofsupply", filterstate);
            }




            let gstCal = false;
            if ( purSecId == 100) { // Just casual Number.
            } else {
              // Set Supply type
              const gstinCode = getValues("gstnumber")?.toString().slice(0, 2);
              // const filterStateCode = stateOptionsList.filter(
              //   (p) => p.value == getValues("placeofsupply").value
              // )[0];


              if (gstinCode !== null && gstinCode !== "") {
                //** Supply Type
                if (G_State == getValues("placeofsupply").value) {
                  setValue("supplyType", supplyTypeList[1]);
                  setGstinCalc(true); // GST - CGST/ SGST
                  gstCal = true;
                } else {
                  // IGST Calc
                  setValue("supplyType", supplyTypeList[0]);
                  setGstinCalc(false);
                  gstCal = false;
                }


                let typeOfImport = getValues("typeofimp").value;
                let typeOfInvType = getValues("invtype").value;
                let types = null;

                if (purSecId == 11 || purSecId == 12 ) {
                  types = typeOfImport
                } else {
                  types = typeOfInvType
                }

                UpdateCalcution(gstCal ,  types);
              }
            }
          } else {
            setValue("gstnumber", "");
            setError("gstnumber", {
              type: "manual",
              message: res.data.errorMessage,
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
  };

    //** GST Validation api service - E-commerce GST
    const GSTINCheckEcommerceGST = (gstin) => {
      if (
        gstin == "" ||
        gstin == null ||
        gstin == undefined ||
        gstin.trim().length == 0
      ) {
        setError("eCommerceGSTIN", {
          type: "manual",
          message: "Please enter valid GST Number.",
        });
      } else {
        setBlock(true);
        companyNewService
          .getGSTINValidate(gstin)
          .then((res) => {
            setBlock(false);
            console.log(res);
            if (
              res.status === 200 &&
              res.data.status === errorCodeConfig.APIDefaultCode.Success
            ) {
            } else {
              setValue("eCommerceGSTIN", "");
              setError("eCommerceGSTIN", {
                type: "manual",
                message: res.data.errorMessage,
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
    };


  //** GSTIN Validation
  const gstInOnChagne = (types) => {

    let gstInVal = null;

    if (types == "gstnumber") {
      gstInVal = getValues("gstnumber");

      if (gstInVal !== null && gstInVal !== "") {
        GSTINCheck(gstInVal);
      }

    } else if (types == "eCommerceGSTIN") {
      gstInVal = getValues("eCommerceGSTIN");
      if (gstInVal !== null && gstInVal !== "") {

        GSTINCheckEcommerceGST(gstInVal);
      }
    }

  };

  //** Loader
  useEffect(() => {
    return () => setBlock(false);
  }, []);

  useEffect(() => {
    let hotTable = hotRefTot?.current?.hotInstance;
    if (!hotTable) {
      return;
    }

    if (hotTable !== undefined) {
      hotTable?.deselectCell()
    }

  },[])


  //**  max date
  const maxDateFunc = () => {
    let setMonth = retrunDates.substring(0, 2);
    let date = new Date();
    let showMonth = date.getMonth() + 1;
    let days = parseInt(setMonth) == showMonth ? date.getDate() : 0;
    let months =
      parseInt(setMonth) == showMonth
        ? parseInt(setMonth) - 1
        : parseInt(setMonth);
    const Maxtoday = new Date(date.getFullYear(), months, days);
    setMaxInvDate(Maxtoday);

  }


  useEffect(() => {
    // **  B2CS Invoices (7) - not show comopany login and pos same state

    // if (purSecId == 3) {
    //   const StateList = JSON.parse(localStorage.getItem("StateList"));
    //   const filterState = StateList.filter(
    //     (p) => p.value.toString() !== sessionStorage.getItem("G_State")
    //   );

    //   if (filterState.length > 0) {
    //     stateOptionsList = filterState;
    //   }
    // } else {
    //  stateOptionsList = JSON.parse(localStorage.getItem("StateList"));
    // }


    //** Other invoice  show  state
    if (purSecId !== 5) {

      const filterstate = stateOptionsList.filter(
        (p) => p.value == G_State
      )[0];

      if (filterstate !== null && filterstate !== undefined) {
        // ** B2C (Large) Invoices (5A, 5B)
        setValue("placeofsupply", filterstate);

        setValue("supplyType", supplyTypeList[1]);

      } else {
        setValue("supplyType", supplyTypeList[0]);
      }
    }

    setValue("typeofNote", crdrList[0]);

    //**  max date
    // maxDateFunc();


    // ** Credit Debit Note (Unregistered)(9B)
    if (purSecId == 9 || purSecId == 10 || purSecId == 12) {
      setDisplayGSTIN(true);
      setDisableRCM(true);
    }

    if ( purSecId == 5 || purSecId == 11 || purSecId == 12 || purSecId == 6 ) {
      setDisplayGSTIN(true);
      setDisableInvType(true);
      setDisableRCM(true);
    } else if (purSecId == 3 || purSecId == 4) {
      // setimpgNimpsDisable(true);
    }

    if (purSecId == 5) {
    }
  }, []);

  useEffect(() => {
    // arrAdd.push
    const nums = [];
    const nums1 = [];
    for (let i = 0; i < 3; i++) {
      nums.push({ tblrows });
      nums1.push({ tblrowsTotCol });
    }

    setPurchaseData(nums);
    setPurchaseTotColData(nums1);

    // ** import B2B or B2CL
    // if (purSecId == 3 || purSecId == 4) {
    if (purSecId == 1) {
      setLblInvNoSet("Invoice No");
      setLblInvoiceDate("Invoice Date");
    } else if (purSecId == 13) {
      setLblInvNoSet("Advance Receipt No");
      setLblInvoiceDate("Advance Receipt Date");
    } else if (purSecId == 2 || purSecId == 12) {
      setLblInvNoSet("Revised Invoice Number");
      setLblInvoiceDate("Revised Invoice Date");
    } else if (purSecId == 3 ) {
      setLblInvNoSet("Note Number");
      setLblInvoiceDate("Note Date");
    } else if (purSecId == 4 || purSecId == 10) {
      setLblInvNoSet("Revised Note Number");
      setLblInvoiceDate("Revised Note Date");

    }

    if (purSecId == 11 || purSecId == 12) {
      setDocTypeDropDown(true);
    }
  }, []);

  useEffect(() => {
    console.log(editPurchaseId);
    // * Search
    if (editPurchaseId !== null) {
      setTitleForm("Edit IFF " + sectionName);
      setbtnName("Update");
      const purchaseObj = {
        PurchaseId: editPurchaseId,
        UserClientId: G_UCParId,
        FinancialYearId:
          finId !== null && finId !== ""
            ? finId
            : G_FY,
        Month: finMonth,
      };

      console.log("search purchase data");
      console.log(purchaseObj,"purchaseObjpurchaseObj");

      setBlock(true);
      iifPurchaseInvoice
        .SalesDataById(purchaseObj)
        .then((res) => {
          console.log("search data");
          console.log(res);
          setBlock(false);
          if (
            res.status === 200 &&
            res.data.status === errorCodeConfig.APIDefaultCode.Success
          ) {
            setValueCompany(res.data.data);
            setSearchBy(true);
          } else {
            setBlock(false);
            Swal.fire({
              icon: "error",
              title: "",
              text: res?.data?.errorMessage,
              customClass: {
                confirmButton: "btn btn-danger",
              },
              buttonsStyling: false,
            });

            setTimeout(() => {
              if (isRecoUrl == true || isRecoUrl == "true") {
                navigator(fromPath, {
                  state: {
                    dataSummary: location?.state?.dataSummary,
                    dataReport: location?.state?.dataReport,
                  },
                });
              } else {
                navigator(fromPath, {
                  state: {
                    titles: "",
                    finyear: gstr1Range,
                    finmonth: gstr1Range,
                    sectionId: purSecId,
                  },
                });
              }
            }, 1000);
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
    } else {
      setTitleForm("Add IFF " + sectionName);
      if (purSecId == 3 || purSecId == 4 || purSecId == 5) {
      } else {
        //  const filterInvType = invTypeList[0];
        // setValue("invtype", filterInvType);
      }
    }
  }, [editPurchaseId]);

  //** Set value in textbox and table
  const setValueCompany = (data) => {
    if (data !== undefined) {
      //

      setValue("gstnumber", data["recipientGSTIN"]);
      setValue("nameofparty", data["receiverName"]);
      setValue("invoicenumber", data["invoiceNumber"]);
      setValue("revisedInvoiceNumber", data["revisedInvoiceNumber"]);

      const dateShow =
        data["invoiceDate"] !== null &&
          data["invoiceDate"] !== "" &&
          data["invoiceDate"] !== undefined
          ? data["invoiceDate"].split("T")[0]
          : "";
      //  console.log("show date", dateShow);
      //  console.log(moment(new Date(dateShow)).format("DD-MM-YYYY"));

      dateShow !== "" && setValue("invdate", moment(new Date(dateShow)).format("DD-MM-YYYY"));

      setinvDateSelection(
        data["invoiceDate"] !== null &&
          data["invoiceDate"] !== "" &&
          data["invoiceDate"] !== undefined
          ? moment(new Date(dateShow)).format("YYYY-DD-MM")
          : ""
      );

      const dateShow2 =
        data["revisedInvoiceDate"] !== null &&
          data["revisedInvoiceDate"] !== "" &&
          data["revisedInvoiceDate"] !== undefined
          ? data["revisedInvoiceDate"].split("T")[0]
          : "";

      setValue("revisedInvoiceDate", moment(new Date(dateShow2)).format("DD-MM-YYYY"));


      setRevDateSelection(
        data["revisedInvoiceDate"] !== null &&
          data["revisedInvoiceDate"] !== "" &&
          data["revisedInvoiceDate"] !== undefined
          ? moment(new Date(dateShow2)).format("YYYY-DD-MM")
          : ""
      );

      setValue("originalInvoiceNumber", data["originalInvoiceNumber"]);

      const dateShow3 =
        data["originalInvoiceDate"] !== null &&
          data["originalInvoiceDate"] !== "" &&
          data["originalInvoiceDate"] !== undefined
          ? data["originalInvoiceDate"].split("T")[0]
          : "";

      setValue("originalInvoiceDate", moment(new Date(dateShow3)).format("DD-MM-YYYY"));


      setOrginalInvoiceDate(
        data["originalInvoiceDate"] !== null &&
          data["originalInvoiceDate"] !== "" &&
          data["originalInvoiceDate"] !== undefined
          ? moment(new Date(dateShow3)).format("YYYY-DD-MM")
          : ""
      )
      setValue("invvalue", data["invoiceValue"]);

      const PostingdateShow =
        data["postingDate"] !== null &&
          data["postingDate"] !== "" &&
          data["postingDate"] !== undefined
          ? data["postingDate"].split("T")[0]
          : "";

      setValue(
        "postingdate",
        PostingdateShow !== null && PostingdateShow !== ""
          ? moment(new Date(PostingdateShow)).format("DD-MM-YYYY")
          : ""
      );

      setPostingDtSelection(
        data["postingDate"] !== null &&
          data["postingDate"] !== "" &&
          data["postingDate"] !== undefined
          ? moment(new Date(PostingdateShow)).format("YYYY-DD-MM")
          : ""
      );

      setValue("postingmonth", data["postingMonth"]);
      setValue("bankname", data["bankName"]);
      setValue("accountnumber", data["accountNumber"]);
      setValue("branchName", data["branchName"]);
      setValue("ifsccode", data["ifscCode"]);
      setValue("customernotes", data["customerNotes"]);
      setValue("termsAndConditions", data["termsAndConditions"]);

      if (data["noteType"] !== null) {

        if (data["noteType"] == "D") {
          setValue("typeofNote", crdrList[1]);
          setCrDr("0");
        } else {
          setValue("typeofNote", crdrList[0]);
          setCrDr("1");
        }
      }


      // if (purSecId == 4) {
      //   if (data["documentType"] == "I") {
      //     setValue("typeofimp", typeOfImpList[0]);
      //   } else {
      //     setValue("typeofimp", typeOfImpList[1]);
      //   }
      // }

      if (data["placeOfSupply"] !== null) {
        if (data["placeOfSupply"] !== null) {
          const filterstate = stateOptionsList.filter(
            (p) => p.label.toLowerCase() == data["placeOfSupply"].toLowerCase()
          )[0];
          setValue("placeofsupply", filterstate);
        }
      }

      if (data["reversechange"] !== null) {
        const filterCharges = reverseChangeList.filter(
          (p) => p.value == data["reverseCharge"]
        )[0];
        setValue("reversechange", filterCharges);
      }

      //  ;

      if (data["invoiceType"] !== null) {
        const filterInvType = invTypeList.filter(
          (p) => p.value == data["invoiceType"]
        )[0];

        if (filterInvType !== undefined) {
          handleURTypeInputChange(filterInvType);
        }
      }

      if (data["urType"] !== null) {
        const filterurType = CDNInvTypeList.filter(
          (p) => p.value == data["urType"]
        )[0];

        if (filterurType !== undefined) {
          setValue("invtype", filterurType);
         // handleURTypeInputChange(filterurType);
        }
      }

      setValue("portCode", data["portCode"]);
      setValue("eCommerceGSTIN", data["eComGSTIN"]);
      setValue("remark1", data["remarks1"]);

      // GSTIN and POS match - Inter else intra

      //
      const supplyTypes = supplyTypeList?.filter(
        (p) => p.name == data["supplyType"]
      )[0];
      setValue("supplyType", supplyTypes);

      console.log("data export", data["exportType"])

      if (data["exportType"] !== null && data["exportType"] !== "" && data["exportType"] !== undefined) {
        const exportTypes = typeOfImpList?.filter(
          (p) => p.value.toString().toLowerCase() == data["exportType"].toString().toLowerCase()
        )[0];
        setValue("typeofimp", exportTypes);
      }

      if (data["finMonthYear"] !== null && data["finMonthYear"] !== "" && data["finMonthYear"] !== undefined) {
        const monthTypes =  YearList?.filter(
          (p) => p.value == data["finMonthYear"]
        )[0];
        setValue("finYearMonth", monthTypes);
      }


      console.log(data,"asdfgffdsdfgh");
      console.log(data["iffDetails"].length,"asdfgffdsdfgh");
      if (data["iffDetails"].length > 0) {
        var arrData = [];
        var arrData1 = [];

        for (let i = 0; i < data["iffDetails"].length; i++) {
          if (i == 0) {
            if (data["iffDetails"][i]["discountType"] !== null) {
              if (data["iffDetails"][i]["discountType"] == "0") {
                setDiscSetValue(false);
              } else {
                setDiscSetValue(true);
              }
            }
          }

          var itemTypes = "";
          var itcValues = "";
          // var cessType= "";
          var cessAmt = "";
          var totAmt = "";
          var cessTaxPer= ""


          // Item type
          if (data["iffDetails"][i]["itemType"] == "1") {
            itemTypes = "Good";
          } else if (data["iffDetails"][i]["itemType"] == "2") {
            itemTypes = "Service";
          }

          // ITC
          if (data["iffDetails"][i]["eligibilityITC"] == "I") {
            itcValues = "Inputs";
          } else if (data["iffDetails"][i]["eligibilityITC"] == "CG") {
            itcValues = "Captial Goods";
          } else if (data["iffDetails"][i]["eligibilityITC"] == "IS") {
            itcValues = "Input Service";
          } else if (data["iffDetails"][i]["eligibilityITC"] == "INELG") {
            itcValues = "Ineligible";
          } else if (data["iffDetails"][i]["eligibilityITC"] == "N") {
            itcValues = "None";
          }

          //cess
          if (
            data["iffDetails"][i]["cessType"] == "1" ||
            data["iffDetails"][i]["cessType"] == 1
          ) {
            let showTaxValue =  data["iffDetails"][i]["taxableValue"] !== null &&   data["iffDetails"][i]["taxableValue"] !== '' ?
            data["iffDetails"][i]["taxableValue"] : 0

            let cessAmount = data["iffDetails"][i]["cess"] !== null &&   data["iffDetails"][i]["cess"] !== '' ?
            data["iffDetails"][i]["cess"] : 0


            cessTaxPer = (cessAmount * 100) / showTaxValue

            cessAmt = data["iffDetails"][i]["cess"]
              // (data["iffDetails"][i]["cess"] *
              //   data["iffDetails"][i]["taxableValue"]) /
              // 100;
          } else {
            cessAmt = data["iffDetails"][i]["cess"];
          }


          totAmt =
            data["iffDetails"][i]["taxableValue"] +
            data["iffDetails"][i]["igst"] +
            data["iffDetails"][i]["cgst"] +
            data["iffDetails"][i]["sgst"] +
            cessAmt;

          //  console.log('show cgst', data["purchaseDetails"][i]["availedITCCGST"])

          arrData.push({
            itemdesc: data["iffDetails"][i]["itemDescription"],
            hsnCode: data["iffDetails"][i]["hsn"],
            qty: data["iffDetails"][i]["qty"],
            rate: data["iffDetails"][i]["unitPrice"],
            taxablevalue:
              data["iffDetails"][i]["taxableValue"] !== null &&
                data["iffDetails"][i]["taxableValue"] !== null
                ? Math.abs(data["iffDetails"][i]["taxableValue"])
                : null,
            taxblerate: data["iffDetails"][i]["rate"],
            igst: Math.abs(data["iffDetails"][i]["igst"]),
            cgst: Math.abs(data["iffDetails"][i]["cgst"]),
            sgst: Math.abs(data["iffDetails"][i]["sgst"]),
            itemtype: itemTypes,
            uom: data["iffDetails"][i]["uqc"],
            itcEligibiltiy: itcValues,
            discount: data["iffDetails"][i]["discount"],
            cessPer:
              data["iffDetails"][i]["cessType"] == "1" ||
                data["iffDetails"][i]["cessType"] == 1
                ? cessTaxPer
                : "",
            cessRate: Math.abs(cessAmt),
            total: Math.abs(parseFloat(totAmt).toFixed(2)),
            itcCgst: Math.abs(data["iffDetails"][i]["availedITCCGST"]),
            itcSgst: Math.abs(data["iffDetails"][i]["availedITCSGST"]),
            itcIgst: Math.abs(data["iffDetails"][i]["availedITCIGST"]),
            itcCess: Math.abs(data["iffDetails"][i]["availedITCCess"]),
          });

          arrData1.push({
            total: Math.abs(parseFloat(totAmt).toFixed(2)),
          });
        }

        console.log("show arr", arrData);
        setPurchaseData(arrData);
        setPurchaseTotColData(arrData1);
      }
    }
  };

  //** Add new rows
  function addNewRows(e) {
    setPurchaseData([...purchaseData, tblrows]);
    setPurchaseTotColData([...purchaseDataTotCol, tblrowsTotCol]);
  }

  useEffect(() => {
    console.log("rendering disc type", discSetValue);
    if (discSetValue == false) {
      //  document.getElementById("discRate0").checked = true;
    }
  }, []);

  //** Delete  - table row
  const deleteTableRows = (index) => {
    console.log(index);
    const row = [...purchaseData];
    const row1 = [...purchaseDataTotCol];
    row.splice(index, 1);
    row1.splice(index, 1);
    setPurchaseData(row);
    setPurchaseTotColData(row1);
    setSearchBy(false);
  };

  let unitList = [];
  let taxList = [];
  let itcEligibilityList = [];

  useEffect(() => {
    // setDiscType('discRate');
    //** Purchase static data set in dropdown
    purchaseInvoiceService
      .SalestblStaticDataMaster()
      .then((res) => {
        console.log(res);
        if (res.status == 200) {
          var resData = res.data.data;
          setImportType(resData.importType);
          // setItcEligibility(resData.itcEligibility)
          setItemType(resData.itemType);
          // setTaxrate(resData.taxrate)
          // setUnitMeasurement(resData.unitMeasurement)

          unitList = resData?.unitMeasurement?.map((X) => X.text);
          taxList = resData?.taxrate?.map((X) => X.text);
          itcEligibilityList = resData?.itcEligibility?.map((X) => X.text);

          setUnitMeasurement(unitList);
          setTaxrate(taxList);
          setItcEligibility(itcEligibilityList);
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

  //** Reset form
  const resetForm = () => {
    setPurchaseData([]);
    setPurchaseTotColData([]);
    reset();

    const nums = [];
    const nums1 = [];
    for (let i = 0; i < 3; i++) {
      nums.push({ tblrows });
      nums1.push({ tblrowsTotCol });
    }
    // maxDateFunc();

    console.log('reset form', maxInvDate)

    setPurchaseData(nums);
    setPurchaseTotColData(nums1);
  };

  //** validation space and blank
  const ValidateString = (data) => {
    if (data == undefined || data == "" || data.trim().length == 0) {
      return false;
    } else {
      return true;
    }
  };

  //** Submit
  const onSubmit = (data) => {
    console.log("save Data");
    console.log(data);

    //** Table Array
    const tblArr = [];
    const tblArrError = [];
    let saveStatus = true;
    let isValid = true;


    if (data.gstnumber !== null && data.gstnumber !== "") {
      if (!ValidateString(data.gstnumber)) {
        setError('gstnumber', { type: 'manual', message: 'Please enter valid GST Number.' })
        isValid = false;
      }
    }

    let finYearSelect = null;
    let finMonthSelect = null
    if (purSecId == 14 ||  purSecId == 16) {
        finYearSelect = data.finYearMonth?.value.slice(0,2)
        finMonthSelect = data.finYearMonth?.value.slice(2,6)
    }


    if (
      (purSecId == 4 || purSecId == "4") &&
      data?.typeofimp?.value == "RFSEZ"
    ) {
      const gstin = getValues("gstnumber");

      if (gstin == null || gstin == "" || gstin == undefined) {
        setError("gstnumber", {
          type: "manual",
          message: "Please enter valid GST Number.",
          required: true,
        });
        isValid = false;
      }
    }

    //
    const invValue = parseInt(data.invvalue);
    //** B2CL - Login state and POS same entry not allow
    //  purSecId == 6
    
  //02-05-2024 As Per Genrated Issue We Don't Required This Popup Message

//     if (purSecId == 3 || purSecId == 4 ) { // B2C (Large) Invoices (5A, 5B)
//       if (G_State == getValues("placeofsupply").value) {
//         console.log(G_State,"G_State")
//         console.log(getValues("placeofsupply")?.value,"getValues")
//         isValid = false;
//         Swal.fire({
//           icon: "Warning",
//           title: "Login state and POS same are not allow.",
//           text: "",
//           customClass: {
//             confirmButton: "btn btn-danger",
//           },
//           buttonsStyling: false,
//         });
//       } else {

// // if(invValue){
// //         if (invValue < maxAmount) {
// //           isValid = false;
// //           Swal.fire({
// //             icon: "Warning",
// //             title: "Invoice value should not less than 2,50,000.",
// //             text: "",
// //             customClass: {
// //               confirmButton: "btn btn-danger",
// //             },
// //             buttonsStyling: false,
// //           });
// //         }
// //       }
//       }
//     }

      // ** B2CS Invoices (7)
    if (purSecId == 5 || purSecId == 6  ) {
      if (invValue > maxAmount && data?.supplyType?.value == "1") {
        isValid = false;
        Swal.fire({
          icon: "Warning",
          title: "Invoice value should not more than 2,50,000.",
          text: "",
          customClass: {
            confirmButton: "btn btn-danger",
          },
          buttonsStyling: false,
        });
      }
    }

    if (isValid == false) {
    } else {
      console.log(purchaseData);

      if (purchaseData.length > 0) {
        for (let i = 0; i < purchaseData.length; i++) {

          if (
            purchaseData[i].taxablevalue !== "" &&
            purchaseData[i].taxablevalue !== null &&
            purchaseData[i].taxablevalue !== undefined
          ) {
            var cessAmt = 0;
            var cessTypes = 0; // CessType : 0 - Rs, 1 - %
            var itemType = null;
            var itcValues = null;

            if (purchaseData[i].taxablevalue > 0) {
              if (
                purchaseData[i].cessPer !== "0" &&
                purchaseData[i].cessPer !== 0 &&
                purchaseData[i].cessPer !== "" &&
                purchaseData[i].cessPer !== null
              ) {
                cessTypes = 1; // %

                let cessAmtValues =
                  purchaseData[i].cessPer !== null &&
                    purchaseData[i].cessPer !== "" &&
                    purchaseData[i].cessPer !== "0" &&
                    purchaseData[i].cessPer !==  undefined
                    ? purchaseData[i].cessPer
                    : 0;

                  let taxValueAmt = purchaseData[i].taxablevalue !== "" &&
                     purchaseData[i].taxablevalue !== null &&
                     purchaseData[i].taxablevalue !== undefined ?  purchaseData[i].taxablevalue : 0;

                  let totCessTax = (taxValueAmt *  cessAmtValues ) / 100;
                  cessAmt = totCessTax;

              } else {
                cessTypes = 0; // Rs

                cessAmt =
                  purchaseData[i].cessRate !== null &&
                    purchaseData[i].cessRate !== "" &&
                    purchaseData[i].cessRate !== "0"
                    ? purchaseData[i].cessRate
                    : 0;
              }

              // Itme types
              if (purchaseData[i].itemtype == "Service") {
                itemType = 2;
              } else if (purchaseData[i].itemtype == "Good") {
                itemType = 1;
              } else {
                itemType = null;
              }

              // itc
              if (purchaseData[i].itcEligibiltiy == "Inputs") {
                itcValues = "I";
              } else if (purchaseData[i].itcEligibiltiy == "Capital goods") {
                itcValues = "CG";
              } else if (purchaseData[i].itcEligibiltiy == "Input services") {
                itcValues = "IS";
              } else if (purchaseData[i].itcEligibiltiy == "Ineligible") {
                itcValues = "INELG";
              }

              // ** HSN Validation

              if ( purchaseData[i].hsnCode !== null &&  purchaseData[i].hsnCode !== '' &&  purchaseData[i].hsnCode !== undefined ) {
                 let  HSNresult =   purchaseData[i].hsnCode.toString().length % 2;
                 let resultLength =  purchaseData[i].hsnCode.toString().length;
                 if (HSNresult == 0 && (resultLength == 2 || resultLength == 4 || resultLength == 6 || resultLength == 8 ||  resultLength == 10)) {
                 } else {
                  tblArrError.push(
                    purchaseData[i].hsnCode
                  )
                 }
              }

              tblArr.push({
                itemDescription: purchaseData[i].itemdesc,
                itemType:
                  itemType !== null && itemType !== "" && itemType !== undefined
                    ? itemType.toString()
                    : null,
                hsn: purchaseData[i].hsnCode !== "" && purchaseData[i].hsnCode !== null && purchaseData[i].hsnCode !== undefined ? purchaseData[i].hsnCode.toString() : null,
                qty:
                  purchaseData[i].qty !== "" &&
                    purchaseData[i].qty !== null &&
                    purchaseData[i].qty !== undefined
                    ? purchaseData[i].qty.toString()
                    : "",
                unitOfMeasurement: purchaseData[i].uom,
                unitPrice:
                  purchaseData[i].rate !== "" &&
                    purchaseData[i].rate !== null &&
                    purchaseData[i].rate !== undefined
                    ? purchaseData[i].rate.toString()
                    : "",
                discountType: discSetValue == true ? "1" : "0",
                // discType.toString() == 'discRate' ? '0' : '1',
                discount:
                  purchaseData[i].discount !== "" &&
                    purchaseData[i].discount !== null &&
                    purchaseData[i].discount !== undefined
                    ? purchaseData[i].discount.toString()
                    : "",
                taxableValue:
                  purchaseData[i].taxablevalue !== "" &&
                    purchaseData[i].taxablevalue !== null &&
                    purchaseData[i].taxablevalue !== undefined
                    ? purchaseData[i].taxablevalue.toString()
                    : "",
                rate:
                  purchaseData[i].taxblerate !== null &&
                    purchaseData[i].taxblerate !== undefined &&
                    purchaseData[i].taxblerate !== ""
                    ? purchaseData[i].taxblerate
                    : 0,
                igst:
                  purchaseData[i].igst !== null &&
                    purchaseData[i].igst !== undefined &&
                    purchaseData[i].igst !== ""
                    ? purchaseData[i].igst
                    : 0,
                cgst:
                  purchaseData[i].cgst !== null &&
                    purchaseData[i].cgst !== undefined &&
                    purchaseData[i].cgst !== ""
                    ? purchaseData[i].cgst
                    : 0,
                sgst:
                  purchaseData[i].sgst !== null &&
                    purchaseData[i].sgst !== undefined &&
                    purchaseData[i].sgst !== ""
                    ? purchaseData[i].sgst
                    : 0,
                cessType: cessTypes,
                cess:
                  cessAmt !== null && cessAmt !== undefined && cessAmt !== ""
                    ? cessAmt
                    : 0,
                eligibilityITC:
                  itcValues !== null &&
                    itcValues !== "" &&
                    itcValues !== undefined
                    ? itcValues.toString()
                    : null,
                availedITCIGST:
                  purchaseData[i].itcIgst !== null &&
                    purchaseData[i].itcIgst !== undefined &&
                    purchaseData[i].itcIgst !== ""
                    ? purchaseData[i].itcIgst
                    : 0,
                availedITCCGST:
                  purchaseData[i].itcCgst !== null &&
                    purchaseData[i].itcCgst !== undefined &&
                    purchaseData[i].itcCgst !== ""
                    ? purchaseData[i].itcCgst
                    : 0,
                availedITCSGST:
                  purchaseData[i].itcSgst !== null &&
                    purchaseData[i].itcSgst !== undefined &&
                    purchaseData[i].itcSgst !== ""
                    ? purchaseData[i].itcSgst
                    : 0,
                availedITCCess:
                  purchaseData[i].itcCess !== null &&
                    purchaseData[i].itcCess !== undefined &&
                    purchaseData[i].itcCess !== ""
                    ? purchaseData[i].itcCess
                    : 0,

                uqc: purchaseData[i].uom,
              });
            }
          }
        }
        var purId = "0";
        if (btnName == "Save") {
          purId = "0";
        } else {
          purId = editPurchaseId.toString();
        }

        // New Create

        var doctypes = "";

        if (purSecId == 1 || purSecId == 2) {
          doctypes = "R";
        } else if (purSecId == 3) {
          doctypes = "I";
        } else if (purSecId == 4) {
          doctypes = data?.typeofimp?.value;
        }

        if (purSecId >= 5) {
          doctypes = data.typeofNote?.value;
        }

        let isNote = true;

        if (data.typeofNote?.value !== undefined) {
          if (data.typeofNote?.value == "D") {
            isNote = false;
          } else {
            isNote = true;
          }
        } else {
          isNote = true;
        }

        let isUserId = null;
        if (isPanRecoUserId == "true" || isPanRecoUserId == true) {
          isUserId = fkpanRecoUserId.toString();
        } else {
          isUserId = G_UCParId.toString();
        }



        if (tblArrError.length > 0) {
            isValid = false
        }


        if (isValid) {

        const purchaseObj = {
          IFFId: purId,
          userClientId: isUserId,
          userId: LocalFunction.getLocalValue(globleVariable.userId, true),
          financialYearId:
            finId !== null && finId !== ""
              ? parseInt(finId)
              : parseInt(G_FY),
          month:
            finMonth !== null && finMonth !== ""
              ? parseInt(finMonth)
              : parseInt(G_FM),
          recipientGSTIN:
            data.gstnumber !== null &&
              data.gstnumber !== "" &&
              data.gstnumber !== undefined
              ? data.gstnumber.trim().toString()
              : "",
          receiverName:
            data.nameofparty !== null &&
              data.nameofparty !== "" &&
              data.nameofparty !== undefined
              ? data.nameofparty.trim().toString()
              : "",
          invoiceNumber: data.invoicenumber,
          invoiceDate: invDateSelection,
          // invoiceDate: orginalInvoiceDateSelection,
          revisedInvoiceNumber: data?.revisedInvoiceNumber,
          revisedInvoiceDate: revDateSelection,
          originalInvoiceNumber: data?.originalInvoiceNumber,
          originalInvoiceDate: orginalInvoiceDateSelection,
          postingDate:
            getValues("postingdate") !== "" &&
              getValues("postingdate") !== null &&
              getValues("postingdate") !== undefined &&
              getValues("postingdate")?.length > 0
              ? postingDtSelection
              : null,
          postingMonth: data.postingmonth,
          invoiceValue:  data.invvalue !== null && data.invvalue !== "" && data.invvalue !== undefined ?  data.invvalue : 0,
          reverseCharge:
            data.reversechange !== null &&
              data.reversechange !== "" &&
              data.reversechange !== undefined
              ? data?.reversechange?.value
              : "",
          totalTaxAmount: parseFloat(totTax.replace(/,/g, '')),
          totalTaxableAmount: 0,
          placeOfSupply: data.placeofsupply.value.toString(),
          bankName:
            data.bankname !== null &&
              data.bankname !== "" &&
              data.bankname !== undefined
              ? data.bankname.trim().toString()
              : "",
          accountNumber:
            data.accountnumber !== null &&
              data.accountnumber !== "" &&
              data.accountnumber !== undefined
              ? data.accountnumber.trim().toString()
              : "",
          branchName:
            data.branchName !== null &&
              data.branchName !== "" &&
              data.branchName !== undefined
              ? data.branchName.trim().toString()
              : "",
          ifscCode:
            data.ifsccode !== null &&
              data.ifsccode !== "" &&
              data.ifsccode !== undefined
              ? data.ifsccode.trim().toString()
              : "",
          customerNotes:
            data.customernotes !== null &&
              data.customernotes !== "" &&
              data.customernotes !== undefined
              ? data.customernotes.trim().toString()
              : "",
          termsAndConditions:
            data.termsAndConditions !== null &&
              data.termsAndConditions !== "" &&
              data.termsAndConditions !== undefined
              ? data.termsAndConditions.trim().toString()
              : "",
          documentType: doctypes,
          remarks1:
            data.remark1 !== null &&
              data.remark1 !== "" &&
              data.remark1 !== undefined
              ? data.remark1.trim().toString()
              : "",
          remarks2: data.remark2,
          remarks3: data.remark3,
          remarks4: data.remark4,
          remarks5: data.remark5,
          sectionId: parseInt(purSecId),
          InvoiceType:
            purSecId == 9 ||  purSecId == 10
              ? ""
              : data.invtype.value !== null &&
                data.invtype.value !== "" &&
                data.invtype.value !== undefined
                ? data.invtype.value
                : "",
          IFFDetails: tblArr,
          isCreditNote: isNote,
          supplyType:
            data?.supplyType?.value !== "" &&
              data?.supplyType?.value !== null &&
              data?.supplyType?.value
              ? data?.supplyType?.name
              : "",
          portCode: data.portCode,
          eComGSTIN: data.eCommerceGSTIN,
          exportType:
            data.typeofimp !== null &&
              data.typeofimp !== "" &&
              data.typeofimp !== undefined
              ? data.typeofimp.value
              : "",
          urType:
            purSecId == 9 ||  purSecId == 10
              ? data.invtype.value !== null &&
                data.invtype.value !== "" &&
                data.invtype.value !== undefined
                ? data.invtype.value
                : ""
              : "",
          returnPeriod: retrunDates,
          financialYear : finMonthSelect  ,
          originalMonth : finYearSelect

        };


        if (tblArr.length > 0) {

            purchaseSaveUpdate(purchaseObj);

        } else {
          toast.error("Please atleast one record add.", {
            position: "top-right",
          });
        }
        } else {

          let csssClass = "border:1px solid;"
          let htmltblData = "<div style='height:150px;scrollY:auto'><table style='border:1px solid;border-collapse:collapse;width:100%;'><thead style='" + csssClass + "' ><tr style='" + csssClass + "'><th style='" + csssClass + "'>Invalid HSN </th>"
          for (let i = 0; i < tblArrError.length; i++) {
              htmltblData += `<tr style="${csssClass}"><td style="${csssClass} text-align: left;">${(i+1) + '. '+ tblArrError[i]} </td></tr>`;
          }

          htmltblData += "</tbody></table></div>";
          return MySwal.fire({
           title: "<strong>HSN Invalid</strong>",
           html: htmltblData,
          customClass: {
              confirmButton: "btn btn-danger",
            },
          buttonsStyling: false,

          });

        }


      } else {
        toast.error("Please atleast one record add.", {
          position: "top-right",
        });
      }
    }
  };

  const purchaseSaveUpdate = (purchaseObj) => {
    
    if(errorArr.length){
      return MySwal.fire({
        title: "<strong>Error</strong>",
        icon: "error",
        html: <ErrorTable errorDataList={errorArr}></ErrorTable>,
        customClass: {
          confirmButton: "btn btn-danger",
        },
        buttonsStyling: false,
        width: 600,
        heightAuto: false,
      });
    }else{    setBlock(true);
    iifPurchaseInvoice
      .SalesInsertUpdate(purchaseObj)
      .then((res) => {
        console.log(res);
        if (
          res.status === 200 &&
          res.data.status === errorCodeConfig.APIDefaultCode.Success
        ) {
          setBlock(false);
          reset();
          setPurchaseData([]);
          setPurchaseTotColData([]);
          toast.success(res.data.successMessage, {
            position: "top-right",
          });

          setTimeout(() => {
            resetForm();
          }, 2000);

          if (btnName == "Update") {
            console.log(isRecoUrl);
            if (isRecoUrl == true || isRecoUrl == "true") {
              setTimeout(() => {

                sessionStorage.removeItem("summary");
                navigator(fromPath, {
                  state: {
                    isRecoRedirect: true,
                    dataSummary: location?.state?.dataSummary,
                    dataReport: location?.state?.dataReport,
                  },
                });
              }, 2000);
            } else {
              setTimeout(() => {
                navigator(fromPath, {
                  state: {
                    titles: "",
                    finyear: gstr1Range,
                    finmonth: gstr1Range,
                    sectionId: purSecId,
                  },
                });
              }, 2000);
            }
          } else {
            setPurchaseData([...purchaseData, tblrows]);
            setPurchaseTotColData([...purchaseDataTotCol, tblrowsTotCol]);
          }
        } else {
          setBlock(false);
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
      });}
  };

  //** Delete invoice
  const deletePurchaseInvoice = () => {
    console.log("delete");
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
        const purchaseObj = {
          userClientId: G_UCParId,
          financialYearId:
            finId !== null && finId !== ""
              ? finId
              : G_FY,
          gstr1Id: [editPurchaseId],
          deletedBy: LocalFunction.getLocalValue(globleVariable.userId, true),
        };

        setBlock(true);
        purchaseInvoiceService
          .SalesInvoiceDelete(purchaseObj)
          .then((res) => {
            if (
              res.status === 200 &&
              res.data.status === errorCodeConfig.APIDefaultCode.Success
            ) {
              setBlock(false);
              toast.success(res.data.successMessage, {
                position: "top-right",
              });

              if (isRecoUrl == true || isRecoUrl == "true") {
                navigator(fromPath, {
                  state: {
                    isRecoRedirect: true,
                    dataSummary: location?.state?.dataSummary,
                    dataReport: location?.state?.dataReport,
                  },
                });
              } else {
                navigator(fromPath, {
                  state: {
                    titles: "",
                    finyear: gstr1Range,
                    finmonth: gstr1Range,
                    sectionId: purSecId,
                  },
                });
              }

              // setTimeout(() => {
              //   navigator(fromPath ,
              //     );
              // }, 2000);
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

  // ** Redirect Function
  const RedirectBack = () => {
    // navigator(fromPath);
    // dataSummary: location?.state?.dataSummary, dataReport: location?.state?.dataReport
    console.log({
      isRecoRedirect: true,
      dataSummary: location?.state?.dataSummary,
      dataReport: location?.state?.dataReport,
    },"tetgyuhvbchdusbhicdnskc")

    if (isRecoUrl == true || isRecoUrl == "true") {
      console.log("ifisRunning")
      navigator(fromPath, {
        state: {
          isRecoRedirect: true,
          dataSummary: location?.state?.dataSummary,
          dataReport: location?.state?.dataReport,
        },
      });
    } else {
      console.log("elseisrunning")
      navigator(fromPath, {
        state: {
          titles: "",
          finyear: gstr1Range,
          finmonth: gstr1Range
          ,
          sectionId: purSecId,
        },
      });
    }
  };

  const onChangeRoundOff = () => {
    setRoundOff(!roundOff);
    console.log(roundOff);
  };

  const hot = hotRef?.current?.hotInstance;
  const hotTotCol = hotRefTot?.current?.hotInstance;

  // ** Update calction then change discout type
  const UpdateCalcution = (gstinCalcualtion, types) => {
    if (purchaseData.length > 0) {
      for (var j = 0; j < purchaseData.length; j++) {
        let RateVal =
          purchaseData[j]["rate"] !== "" &&
            purchaseData[j]["rate"] !== null &&
            purchaseData[j]["rate"] !== undefined &&
            purchaseData[j]["rate"] !== "NaN"
            ? Number(parseFloat(purchaseData[j]["rate"]).toFixed(2))
            : 0.0;

        let QtyVal =
          purchaseData[j]["qty"] !== "" &&
            purchaseData[j]["qty"] !== null &&
            purchaseData[j]["qty"] !== undefined &&
            purchaseData[j]["qty"] !== "NaN"
            ? Number(parseFloat(purchaseData[j]["qty"]).toFixed(2))
            : 0.0;

        // Discount
        let DiscountVal =
          purchaseData[j]["discount"] !== "" &&
            purchaseData[j]["discount"] !== null &&
            purchaseData[j]["discount"] !== undefined &&
            purchaseData[j]["discount"] !== "NaN"
            ? Number(parseFloat(purchaseData[j]["discount"]).toFixed(2))
            : 0.0;

        if (discSetValue == true) {
          // discount per
          if (DiscountVal > 0) {
            let discValue = RateVal * QtyVal * (DiscountVal / 100);
            let discAmts = RateVal * QtyVal - discValue;
            hot?.setDataAtRowProp(j, "taxablevalue", discAmts, "");
            console.log("update discount %", discAmts);
          }
        } else {
          // Discount Amt
          if (DiscountVal > 0) {
            let discValue = RateVal * QtyVal - DiscountVal;
            console.log("update discount amt", discValue);
            hot?.setDataAtRowProp(j, "taxablevalue", discValue, "");
          }
        }
        CalcFunction(j, gstinCalcualtion, types);
      }
    }
  };

  //** GST Calculation function
  const CalcFunction = (row, gstinCalcualtion, types, colName ) => {

    console.log(types,"Saiiiiitypes")

    var taxableValue = hot?.getDataAtRowProp(row, "taxablevalue");
    var gstTaxRate = hot?.getDataAtRowProp(row, "taxblerate");


    var gstValue = (taxableValue * gstTaxRate) / 100;
    var divValue = gstValue / 2;

    let GstCalcAllow = true;
    let onlyIGSTAllow = false;
    let cessCalcAllow = true;

    console.log('gstinCalcualtion--newtesting-1', gstinCalcualtion, purSecId, types)
    // console.log('typeOfInvType', typeOfInvType )
    // &&  purSecId == 9


    if (types == "SEZWP" || types == "ISSAI" || types == "EXPWP" ) {
      GstCalcAllow = false;

      hot?.setSourceDataAtCell(row, "cgst", 0, 0);
      hot?.setSourceDataAtCell(row, "sgst", 0, 0);
      hot?.setSourceDataAtCell(
        row,
        "igst",
        parseFloat(gstValue).toFixed(2),
        ""
      );

    } else if (types == "SEZWOP") {

      hot?.setSourceDataAtCell(row, "cgst", 0, 0);
      hot?.setSourceDataAtCell(row, "sgst", 0, 0);
      hot?.setSourceDataAtCell(row, "igst", 0, 0);

      hotTotCol?.setDataAtRowProp(
        row,
        "total",
        taxableValue !== null && taxableValue !== "" && taxableValue !== null && taxableValue !== undefined && taxableValue !== "NaN" ?
          parseFloat(taxableValue).toFixed(2) : '',
        ""
      );

      GstCalcAllow = false;
    }



    if ((purSecId == 11 ||  purSecId == 12 ) && types == "wopay") {

      hot?.setSourceDataAtCell(row, "cgst", 0, 0);
      hot?.setSourceDataAtCell(row, "sgst", 0, 0);
      hot?.setSourceDataAtCell(row, "igst", 0, 0);


      hotTotCol?.setDataAtRowProp(
        row,
        "total",
        taxableValue !== null && taxableValue !== "" && taxableValue !== null && taxableValue !== undefined && taxableValue !== "NaN" ?
          parseFloat(taxableValue).toFixed(2) : '',
        ""
      );
      GstCalcAllow = false;


    } else if ( types == "EXPWOP") {
       // (purSecId == 9) &&
      hot?.setSourceDataAtCell(row, "cgst", 0, 0);
      hot?.setSourceDataAtCell(row, "sgst", 0, 0);
      hot?.setSourceDataAtCell(row, "igst", 0, 0);

      hotTotCol?.setDataAtRowProp(
        row,
        "total",
        taxableValue !== null && taxableValue !== "" && taxableValue !== null && taxableValue !== undefined && taxableValue !== "NaN" ?
          parseFloat(taxableValue).toFixed(2) : '',
        ""
      );
      GstCalcAllow = false;
    }

    if (GstCalcAllow == true) {
      if (
        taxableValue !== null &&
        taxableValue !== null &&
        taxableValue !== undefined
      ) {
        if ( purSecId == 11 || purSecId == 12 ) {
          hot?.setSourceDataAtCell(row, "cgst", 0, 0);
          hot?.setSourceDataAtCell(row, "sgst", 0, 0);
          hot?.setSourceDataAtCell(
            row,
            "igst",
            parseFloat(gstValue).toFixed(2),
            ""
          );
        } else {

          if (
            G_State ==
            getValues("placeofsupply").value
          ) {
            console.log("show taxablevalue-1");
            hot?.setSourceDataAtCell(
              row,
              "cgst",
              parseFloat(divValue).toFixed(2),
              ""
            );
            hot?.setSourceDataAtCell(
              row,
              "sgst",
              parseFloat(divValue).toFixed(2),
              ""
            );
            hot?.setSourceDataAtCell(row, "igst", 0, 0);
          } else {
            console.log("show GSTIN");
            hot?.setSourceDataAtCell(row, "cgst", 0, 0);
            hot?.setSourceDataAtCell(row, "sgst", 0, 0);
            hot?.setSourceDataAtCell(
              row,
              "igst",
              parseFloat(gstValue).toFixed(2),
              ""
            );
          }
        }
      }
    }

    if (cessCalcAllow == true) {
      // cess

      let cessValue = hot?.getDataAtRowProp(row, "cessPer") !== '' &&  hot?.getDataAtRowProp(row, "cessPer") !== null &&
      hot?.getDataAtRowProp(row, "cessPer") !== 'null' && hot?.getDataAtRowProp(row, "cessPer") !== undefined ? hot?.getDataAtRowProp(row, "cessPer") : 0  ;
      let cessAmount = hot?.getDataAtRowProp(row, "cessRate") !== '' &&  hot?.getDataAtRowProp(row, "cessRate") !== null &&
      hot?.getDataAtRowProp(row, "cessRate") !== 'null' && hot?.getDataAtRowProp(row, "cessRate") !== undefined ? hot?.getDataAtRowProp(row, "cessRate") : 0  ;


      if (
        cessValue !== null &&
        cessValue !== "" &&
        cessValue !== undefined &&
        cessValue !== 0
      ) {

        let cessPer = (cessValue * taxableValue) / 100;
        hot?.setSourceDataAtCell(
          row,
          "cessRate",
          parseFloat(cessPer).toFixed(2),
          ""
        );

      }


      var taxablevVal =
        hot?.getDataAtRowProp(row, "taxablevalue") !== "NaN" &&
          hot?.getDataAtRowProp(row, "taxablevalue") !== "" &&
          hot?.getDataAtRowProp(row, "taxablevalue") !== null &&
          hot?.getDataAtRowProp(row, "taxablevalue") !== undefined
          ? Number(
            parseFloat(hot?.getDataAtRowProp(row, "taxablevalue")).toFixed(2)
          )
          : 0;

      var cgst =
        hot?.getDataAtRowProp(row, "cgst") !== "NaN" &&
          hot?.getDataAtRowProp(row, "cgst") !== "" &&
          hot?.getDataAtRowProp(row, "cgst") !== null &&
          hot?.getDataAtRowProp(row, "cgst") !== undefined
          ? Number(parseFloat(hot?.getDataAtRowProp(row, "cgst")).toFixed(2))
          : 0;

      var sgst =
        hot?.getDataAtRowProp(row, "sgst") !== "NaN" &&
          hot?.getDataAtRowProp(row, "sgst") !== "" &&
          hot?.getDataAtRowProp(row, "sgst") !== null &&
          hot?.getDataAtRowProp(row, "sgst") !== undefined
          ? Number(parseFloat(hot?.getDataAtRowProp(row, "sgst")).toFixed(2))
          : 0;

      var igst =
        hot?.getDataAtRowProp(row, "igst") !== "NaN" &&
          hot?.getDataAtRowProp(row, "igst") !== "" &&
          hot?.getDataAtRowProp(row, "igst") !== null &&
          hot?.getDataAtRowProp(row, "igst") !== undefined
          ? Number(parseFloat(hot?.getDataAtRowProp(row, "igst")).toFixed(2))
          : 0;

      var CessValue =
        hot?.getDataAtRowProp(row, "cessRate") !== "NaN" &&
          hot?.getDataAtRowProp(row, "cessRate") !== "" &&
          hot?.getDataAtRowProp(row, "cessRate") !== null &&
          hot?.getDataAtRowProp(row, "cessRate") !== undefined
          ? Number(
            parseFloat(hot?.getDataAtRowProp(row, "cessRate")).toFixed(2)
          )
          : 0;

      console.log("show calcution");
      console.log(taxablevVal, cgst, sgst, igst);

      let displayTotValue = parseFloat(taxablevVal + cgst + sgst + igst + CessValue).toFixed(2);

      hotTotCol?.setDataAtRowProp(
        row,
        "total",
        displayTotValue !== "" && displayTotValue !== null && displayTotValue !== undefined && displayTotValue !== "NaN" ? displayTotValue : '',
        ""
      );
    }

  };

  // ** calculation cell on change handsontable function
  function CellValueOnBeforeChange(changes, source) {
    if (
      source === "CopyPaste.paste" ||
      source === "edit" ||
      source === "Autofill.fill"
    ) {
      const hot = hotRef?.current?.hotInstance;

      let withoutErrArr = [];

      for (let i = 0; i < changes.length; i++) {
        const [row, col, , value] = changes[i]; // Get the edited cell value
        const colIndex = invalidColumn
          // .slice(1)
          .findIndex((obj) => obj.data === col);
          let cellObj = {
            row: row,
            col: colIndex,
            validationMsg: "Only Numeric Value Allowed",
            colName: invalidColumn?.[colIndex]?.title
         
          };
          const findErrorIndex = (arr, cell) => {
            return arr.findIndex(
              (error) =>
                error.row === cell.row &&
                error.col === cell.col 
            );
          };

        if (handleValidateExcel.test(value)) {
          cellObj.validationMsg = validationErrorMessage(value);
          // setErrorArr((pre) => [...pre, cellObj]);
          setErrorArr((prev) => {
            const errorIndex = findErrorIndex(prev, cellObj);
            if (errorIndex !== -1) {
              prev[errorIndex] = cellObj;
              return [...prev];
            } else {
              return [...prev, cellObj];
            }
          });
        } else {
          setErrorArr((prev) => {
            const errorIndex = findErrorIndex(prev, cellObj);
            if (errorIndex !== -1) {
              return prev.filter((_, index) => index !== errorIndex);
            }
            return prev;
          });

          if (colIndex == 2) {
            const oldVal = changes[i][2];
            // Check if the edited value is numeric
            if (isNaN(value)) {
              // setErrorArr((pre) => [...pre, cellObj]);
              setErrorArr((prev) => {
                const errorIndex = findErrorIndex(prev, cellObj);
                if (errorIndex !== -1) {
                  prev[errorIndex] = cellObj;
                  return [...prev];
                } else {
                  return [...prev, cellObj];
                }
              });
            } else {
              if (
                errorArr.findIndex(
                  (y) =>
                    y.row == cellObj.row &&
                    y.col == cellObj.col &&
                    y.tab == cellObj.tab
                ) != -1
              ) {
                withoutErrArr.push(cellObj);
              }
            }
          }
        }
      }

      if (withoutErrArr.length > 0) {
        const withErrArr = errorArr;
        const filteredArr = withErrArr.filter(
          (itemX) =>
            !withoutErrArr.some(
              (itemY) =>
                itemY.row === itemX.row &&
                itemY.col === itemX.col 
            )
        );
        setErrorArr(filteredArr);
      }
    }
    if (changes) {
      // hot?.addHook('beforeChange', function (changes, source) {

      if (changes.length > 1) {
        return;
      }
      var row = changes[0][0];
      var prop = changes[0][1];
      var value = changes[0][3];

      // console.log(row, prop, value);
      setSearchBy(false);

      let typeOfImport = getValues("typeofimp").value;
      let typeOfInvType = getValues("invtype").value;
      let types = null;

      if (purSecId == 11 || purSecId == 12 ) {
         types = typeOfImport
      } else {
        types = typeOfInvType
      }


      let gstCalc = false;
      if (purSecId == 3 || purSecId == 4 || purSecId == 7) {
      } else {
        // const gstinCode = getValues("gstnumber").toString().slice(0, 2);
        // const filterStateCode = stateOptionsList.filter(
        //   (p) => p.value == getValues("placeofsupply").value
        // )[0];
        // if (gstinCode !== null && gstinCode !== "") {
        //   if (gstinCode == filterStateCode?.value) {
        //      // GST - CGST/ SGST
        //     gstCalc = true;
        //   } else {
        //     // IGST Calc
        //     gstCalc = false
        //   }
        // }
      }


      // Discount
      var unitPriceValue = hot?.getDataAtRowProp(row, "rate");

      var qtyValue = hot?.getDataAtRowProp(row, "qty");
      let discNewValue = hot?.getDataAtRowProp(row, "discount");
      let setNewDisc = discNewValue !== null && discNewValue !== "" && discNewValue !== undefined && discNewValue !== "null" ? discNewValue : 0
      let showDiscValue = 0;

      if (discSetValue == true) {
        if (setNewDisc > 0) {
          let discValue = unitPriceValue * qtyValue * (setNewDisc / 100);
          let discAmts = unitPriceValue * qtyValue - discValue;
          showDiscValue = discAmts

        }
      } else {
        // Discount Amt
        if (setNewDisc > 0) {
          let discValue = unitPriceValue * qtyValue - setNewDisc;
          showDiscValue = discValue
        }
      }

      if (prop === "qty") {
        // Qty
        let totTaxValue = showDiscValue == 0 ? (unitPriceValue * value) : showDiscValue;
        hot?.setDataAtRowProp(row, "taxablevalue", Number(parseFloat(totTaxValue).toFixed(2)), "");

        CalcFunction(row, gstCalc, types);
      } else if (prop === "rate") {
        //**  Unit Price
        console.log("call rate");
        let qtyValue = hot?.getDataAtRowProp(row, "qty");
        let totTaxValue = showDiscValue == 0 ? (value * qtyValue) : showDiscValue;

        hot?.setDataAtRowProp(row, "taxablevalue", Number(parseFloat(totTaxValue).toFixed(2)), "");

      }

      //**  Taxable Value
      if (prop === "taxablevalue") {
        CalcFunction(row, gstCalc, types);
      }

      console.log(`section id`, purSecId);
      if (purSecId == 3 || purSecId == 4) {
        if (prop === "taxblerate") {
          CalcFunction(row, gstCalc, types);
        }
      } else {
        // const gstinCode = getValues("gstnumber");
        // const gstinStateCode = gstinCode !== null &&  gstinCode !== "" ?  getValues("gstnumber").toString().slice(0, 2)  : ''

        if (
          G_State == getValues("placeofsupply").value
        ) {
          console.log("taxbleratetaxblerate");
          if (prop === "taxblerate") {
            CalcFunction(row, gstCalc, types);
          }
        } else {
          if (prop === "taxblerate") {
            console.log("taxblerate Values");

            CalcFunction(row, gstCalc, types);
          }
        }
      }

      if (prop === "cessPer") {

        // if (value > 99.99 ) {
        //   hot?.setDataAtRowProp(row, "cessPer", 0, "");
        //   hot?.setDataAtRowProp(row, "cessRate", "", "");
        // } else {
          CalcFunction(row, gstCalc, types ,  'cessPer' );

          if (hot?.getDataAtRowProp(row, "cessPer") == null ) {
            hot?.setDataAtRowProp(row, "cessRate", "", "");
          }
       // }

      }

      //** Cess Amount
      if (prop === "cessRate") {

        console.log(hot?.getDataAtRowProp(row, "cessPer"));
        console.log(hot?.getDataAtRowProp(row, "cessRate"))

        if (hot?.getDataAtRowProp(row, "cessRate") !== 0) {
          hot?.setDataAtRowProp(row, "cessPer", "", "");
          CalcFunction(row, gstCalc, types , 'cessRate' );

       } else {
        //  hot?.setDataAtRowProp(row, "cessPer", "", "");
       }
      }

      // Discount
      console.log("discTypesDisplay - discTypesDisplay");
      console.log(discSetValue);
      if (discSetValue == true) {
        if (prop === "discount") {
          // Per %

            if (value > 99.99 ) {

              hot?.setDataAtRowProp(row, "discount", 0, "");
            } else {
              var unitPriceValue = hot?.getDataAtRowProp(row, "rate");
              var Qty = hot?.getDataAtRowProp(row, "qty");

              var discValue = unitPriceValue * Qty * (value / 100);
              var taxValue = unitPriceValue * Qty - discValue;

              hot?.setDataAtRowProp(row, "taxablevalue", Number(parseFloat(taxValue).toFixed(2)), "");

              CalcFunction(row, gstCalc, types);
            }

        }
      } else {
        //**  Discount Amt
        if (prop === "discount") {
          var unitPriceValue = hot?.getDataAtRowProp(row, "rate");
          var Qty = hot?.getDataAtRowProp(row, "qty");

          var discValue = unitPriceValue * Qty - value;

          if (discValue < 0 ) {
            hot?.setDataAtRowProp(row, "discount", 0, "");
          } else {
            hot?.setDataAtRowProp(row, "taxablevalue", Number(parseFloat(discValue).toFixed(2)), "");
            CalcFunction(row, gstCalc, types);
          }


        }
      }
      totInvValue();
    }

    // hot?.init();
  }

  //** Total invoice function
  const totInvValue = () => {
    console.log("so length", searchBy);
    console.log(purchaseData);
    if (purchaseData.length > 0) {
      let totAmt = 0.0;
      let totTaxableVal = 0.0;
      let totQty = 0.0;
      let totCGST = 0.0;
      let totSGST = 0.0;
      let totIGST = 0.0;
      let totCess = 0.0;
      let totDiscAmt = 0.0;

      // Total Amount - Column 2nd Hansontable
      for (var i = 0; i < purchaseDataTotCol.length; i++) {
        console.log(purchaseDataTotCol[i]["total"]);
        let amt =
          purchaseDataTotCol[i]["total"] !== "" &&
            purchaseDataTotCol[i]["total"] !== null &&
            purchaseDataTotCol[i]["total"] !== undefined &&
            purchaseDataTotCol[i]["total"] !== "NaN"
            ? Number(parseFloat(purchaseDataTotCol[i]["total"]).toFixed(2))
            : 0.0;
        totAmt = totAmt + amt;
      }

      // 1st Hansontable
      for (var j = 0; j < purchaseData.length; j++) {
        let RateVal =
          purchaseData[j]["rate"] !== "" &&
            purchaseData[j]["rate"] !== null &&
            purchaseData[j]["rate"] !== undefined &&
            purchaseData[j]["rate"] !== "NaN"
            ? Number(parseFloat(purchaseData[j]["rate"]).toFixed(2))
            : 0.0;

        let QtyVal =
          purchaseData[j]["qty"] !== "" &&
            purchaseData[j]["qty"] !== null &&
            purchaseData[j]["qty"] !== undefined &&
            purchaseData[j]["qty"] !== "NaN"
            ? Number(parseFloat(purchaseData[j]["qty"]).toFixed(2))
            : 0.0;
        //  totTaxableVal = totTaxableVal + (RateVal * QtyVal)

        // taxble value
        let taxableVal =
          purchaseData[j]["taxablevalue"] !== "" &&
            purchaseData[j]["taxablevalue"] !== null &&
            purchaseData[j]["taxablevalue"] !== undefined &&
            purchaseData[j]["taxablevalue"] !== "NaN"
            ? Number(parseFloat(purchaseData[j]["taxablevalue"]).toFixed(2))
            : 0.0;
        totTaxableVal = totTaxableVal + taxableVal;

        // CGST
        let totCGSTVal =
          purchaseData[j]["cgst"] !== "" &&
            purchaseData[j]["cgst"] !== null &&
            purchaseData[j]["cgst"] !== undefined &&
            purchaseData[j]["cgst"] !== "NaN"
            ? Number(parseFloat(purchaseData[j]["cgst"]).toFixed(2))
            : 0.0;
        totCGST = totCGST + totCGSTVal;

        // SGST
        let totSGSTVal =
          purchaseData[j]["sgst"] !== "" &&
            purchaseData[j]["sgst"] !== null &&
            purchaseData[j]["sgst"] !== undefined &&
            purchaseData[j]["sgst"] !== "NaN"
            ? Number(parseFloat(purchaseData[j]["sgst"]).toFixed(2))
            : 0.0;
        totSGST = totSGST + totSGSTVal;

        // IGST
        let totIGSTVal =
          purchaseData[j]["igst"] !== "" &&
            purchaseData[j]["igst"] !== null &&
            purchaseData[j]["igst"] !== undefined &&
            purchaseData[j]["igst"] !== "NaN"
            ? Number(parseFloat(purchaseData[j]["igst"]).toFixed(2))
            : 0.0;
        totIGST = totIGST + totIGSTVal;

        let totCessVal =
          purchaseData[j]["cessRate"] !== "" &&
            purchaseData[j]["cessRate"] !== null &&
            purchaseData[j]["cessRate"] !== undefined &&
            purchaseData[j]["cessRate"] !== "NaN"
            ? Number(parseFloat(purchaseData[j]["cessRate"]).toFixed(2))
            : 0.0;
        totCess = totCess + totCessVal;

        // Discount

        let DiscountVal =
          purchaseData[j]["discount"] !== "" &&
            purchaseData[j]["discount"] !== null &&
            purchaseData[j]["discount"] !== undefined &&
            purchaseData[j]["discount"] !== "NaN"
            ? Number(parseFloat(purchaseData[j]["discount"]).toFixed(2))
            : 0.0;

        if (discSetValue == true) {
          // discount per
          if (DiscountVal > 0) {
            let discValue = RateVal * QtyVal * (DiscountVal / 100);

            totDiscAmt = totDiscAmt + discValue;
          }
        } else {
          // Discount Amt
          if (DiscountVal > 0) {
            // (RateVal * QtyVal) -
            let discValue = DiscountVal;

            console.log("discount amt", discValue);
            console.log(RateVal * QtyVal);
            console.log(DiscountVal);

            totDiscAmt = totDiscAmt + discValue;
          }
        }
      }

      //  console.log('searchBy', searchBy);
      let totalTax = totCGST + totSGST + totIGST + totCess;
      if (searchBy == false) {

        //  let invAmt_lbl = totAmt.toLocaleString("en-In", { maximumFractionDigits: 2, minimumFractionDigits: 2 } );

        setValue("invvalue", parseFloat(totAmt).toFixed(2));
        console.log("show inv values");
      }

      console.log("totTaxableVal");

      let taxableAmt_lbl = totTaxableVal.toLocaleString("en-In", { maximumFractionDigits: 2, minimumFractionDigits: 2 });
      let tottax_lbl = totalTax.toLocaleString("en-In", { maximumFractionDigits: 2, minimumFractionDigits: 2 });
      let totdisamt_lbl = totDiscAmt.toLocaleString("en-In", { maximumFractionDigits: 2, minimumFractionDigits: 2 });

      setTotTaxableValue(taxableAmt_lbl);
      setTotTax(tottax_lbl);
      setTotDiscAmt(totdisamt_lbl);

      // ** B2CL / B2CS
      // if (purSecId == 3 || purSecId == 5) {
      //   console.log(parseInt(getValues("invvalue")));
      //   console.log(maxAmount);
      //   console.log(parseInt(totAmt) > maxAmount);

      //   if (parseInt(getValues("invvalue")) > 0) {
      //     if (parseInt(totAmt) > maxAmount) {
      //       console.log("show tot amount");

      //     }
      //   }
      // }
    }
  };

  //** table Button and event
  function myBtns(instance, td, row, col, prop, value, cellProperties) {
    Handsontable.renderers.TextRenderer.apply(this, arguments);

    td.innerHTML =
      '<button id="delete-button" class="btn p-0 add-delete" title="Delete"><i class="fa fa-trash"></i></button>';

    const hot = hotRefTot?.current?.hotInstance;
    if (!hot) {
      return;
    }

    const totalRows = hot?.countRows();
    console.log("show button", totalRows);

    if (totalRows == 1) {
      const button = document.getElementById("delete-button");
      cellProperties.className = "purchseCellDisable";
      button.disabled = "disabled";
    } else {
      $(td)
        .find(".add-delete")
        .on("click", (event) => {
            console.log(event)


          console.log("delete row", totalRows);
          // const cId = hot?.getDataAtRow(cellProperties.row)[8];
          // deleteOnClick(cId)
          if (totalRows > 1) {
            deleteTableRows(row);
          }
        });
    }
    totInvValue();
  }


  //** Table checkbox
  function colHeaders(col) {
    let txt;
    switch (col) {
      case 6:
        txt = `<div className="pt-1">Discount</div><div>
                <label>
                    <input type="radio" class="discPerClass" name="radioDisc" id="discPer1" value="discPer"  ${discSetValue == true ? `checked="checked"` : ""
          }  /> %
                </label>
                <label>
                    <input type="radio" class="discRateClass" name="radioDisc" id="discRate0" value="discRate"  ${discSetValue == false ? `checked="checked"` : ""
          }  /> ${rupessSymbol}
                </label>
            </div>`;
        return txt;
    }
  }

  const container = document.querySelector("#tblPurchase");

  //** table Cell Mouse Down event
  function localAfterOnCellMouseDown(event, coords, td) {
    const hot = hotRef?.current?.hotInstance;

    if (!hot) {
      return;
    }

    const totalRows = hot?.countRows();

    if (event.target.classList.contains("discPerClass")) {
      event.stopPropagation();
      setDiscSetValue(true);
    }

    if (event.target.classList.contains("discRateClass")) {
      event.stopPropagation();
      setDiscSetValue(false);
    }
  }

  useEffect(() => {
    UpdateCalcution();
  }, [discSetValue]);

  // const handleChange = (value) => console.log("onchange data ", value);

  // ** State - Onchange
  const handleStateChange = (newValue) => {

    if (G_State == newValue?.value) {
      setValue("supplyType", supplyTypeList[1]);
    } else {
      setValue("supplyType", supplyTypeList[0]);
    }

    return setValue("placeofsupply", newValue);
  }


  // ** Onchange Type of Export
  const handleTypeOfExportInputChange = (newValue) => {
    console.log(newValue.value);
    if (newValue.value == "wopay" ) {
      setGstRateReadable(true);
      setPurchseCellDisableClass("purchseCellDisable");
      UpdateCalcution(false, newValue.value);
    } else {
      setGstRateReadable(false);
      setPurchseCellDisableClass("");
      UpdateCalcution(true, newValue.value);
    }

    return setValue("typeofimp", newValue);
  };

  // ** Onchange Type of UR / Invoice
  const handleURTypeInputChange = (newValue) => {
    console.log("handurl", newValue.value);

    if (purSecId == 9) {
      if (newValue.value == "EXPWOP") {
        setGstRateReadable(true);
        setPurchseCellDisableClass("purchseCellDisable");
        UpdateCalcution(false, newValue.value);
      } else {
        setGstRateReadable(false);
        setPurchseCellDisableClass("");
        UpdateCalcution(true, newValue.value);
      }
    } else {

      if (newValue.value == "SEZWOP") {
        setGstRateReadable(true);
        setPurchseCellDisableClass("purchseCellDisable");
        UpdateCalcution(false, newValue.value);
      } else {
        setGstRateReadable(false);
        setPurchseCellDisableClass("");
        UpdateCalcution(true, newValue.value);
      }
    }

    return setValue("invtype", newValue);
  };

  function isEvenNumber(num) {

    if(Number.isInteger(num / 2)) {
         return  true
      } else {
         return false;
      }
    }



      const selectKeyDown = e => {
        // catch the code of the key pressed
        if (e.keyCode === 9) {
              console.log('table row focus')
             let hot = hotRef?.current?.hotInstance
             if (!hot) {
              return;
            }
             if (hot !== undefined ) {
              hot?.selectColumns(0);
             }

          //   console.log(hot?.getdata())
          //  hot?.setDataAtRowProp(0, 'itemdesc', '' , null) ;
          //  hot?.resumeRender();
        }
      };


      const checkKeyDown = (e) => {
        console.log('keydown', e.target.tagName)
        if (e.key === 'Enter' &&  e.target.tagName !== 'BUTTON') e.preventDefault();
      };

      const onPasteValue = (e) => {

          console.log("on paste data-",  e, e.key);
          const pastedContent = e.clipboardData.getData('text');

         if (new RegExp(/[-a-zA-Z0-9/\"]/).test(pastedContent)) {
          clearErrors("invoicenumber")
         } else {

          setError("invoicenumber", {
            type: "manual",
            message: "Invalid invoice number.",
          });
         }
      }


  return (
    <div>
      {block && <div className="loading1">Loading&#8230;</div>}
      {/* <CompanyTitle></CompanyTitle> */}
      <div className="content-header row py-1">
        <div className="content-header-left col-md-8 col-12">
          <div className="row breadcrumbs-top mb-0">
            <div className="col-12">
              <Breadcrumbs
                title={titleShow}
                data={[
                  { title: "IFF Summary", link: "/gst-returns/IIF" },
                  { title: titleForm },
                ]}
              />
            </div>
          </div>
          <div className="content-header-right text-md-end col-md-4 col-12 d-md-block d-none"></div>
        </div>
      </div>

{/* onKeyDown={(e) => checkKeyDown(e)} */}
      <Form ref={formRef} onSubmit={handleSubmit(onSubmit)} onKeyDown={(e) => checkKeyDown(e)} >
        <Row>
          <Col md={7}>
            <Card>
              <CardBody>
                <Row>
                  {
                    purSecId !== "2" && purSecId !== "4" && purSecId !== "8" && purSecId !== "10" && purSecId !== "12" ?
                      <Col md="4" className="mb-1">
                        <Label className="form-label requiredlable">
                          {lblInvNoSet}
                        </Label>
                        <Controller
                          tabIndex="1"
                          id="invoicenumber"
                          name="invoicenumber"
                          control={control}
                          rules={{
                            required: `Please enter ${lblInvNoSet?.toLowerCase()}.`,
                            pattern: {
                              value: /^[-a-zA-Z0-9/\"]+$/i,
                              message: "Please enter valid invoice no."
                            }
                          }}
                          render={({ field }) => (
                            <Input
                              placeholder=""
                              maxLength={16}
                              invalid={errors.invoicenumber && true}
                              {...field}
                              onChange={(e) =>
                                field.onChange(e.target.value.replace(/\s/g, ""))
                              }
                              onKeyPress={(e) => {
                                if (new RegExp(/[-a-zA-Z0-9/\"]/).test(e.key)) {

                                } else e.preventDefault();
                              }}
                              onPaste={(e) => handlePasteText(e, setError,'invoicenumber','invoicenumber','Space')}

                              // onPaste={(e) => {
                              //   const str = e.clipboardData.getData('Text');
                              //   const newStr = str.replace(/[-a-zA-Z0-9/\"]/g, '');
                              //   if (str !== newStr) {
                              //     e.preventDefault()
                              //   }
                              // }}
                              //   onPaste={() => {
                              //     onPasteValue
                              // }}

                            />
                          )}
                        />
                        {errors.invoicenumber && (
                          <FormFeedback>
                            {errors.invoicenumber.message}
                          </FormFeedback>
                        )}
                      </Col>
                      :
                      <Col md="4" className="mb-1">
                        <Label className="form-label requiredlable">
                          {lblInvNoSet}
                        </Label>
                        <Controller
                          tabIndex="1"
                          id="revisedInvoiceNumber"
                          name="revisedInvoiceNumber"
                          control={control}
                          rules={{
                            required: `Please enter ${lblInvNoSet?.toLowerCase()}.`,
                          }}
                          render={({ field }) => (
                            <Input
                              placeholder=""
                              maxLength={16}
                              invalid={errors.revisedInvoiceNumber && true}
                              {...field}
                              onChange={(e) =>
                                field.onChange(e.target.value.replace(/\s/g, ""))
                              }
                              onKeyPress={(e) => {
                                if (new RegExp(/[-a-zA-Z0-9/\/]/).test(e.key)) {
                                } else e.preventDefault();
                              }}
                            />
                          )}
                        />
                        {errors.revisedInvoiceNumber && (
                          <FormFeedback>
                            {errors.revisedInvoiceNumber.message}
                          </FormFeedback>
                        )}
                      </Col>
                  }

                  {
                    purSecId !== "2" && purSecId !== "4" && purSecId !== "8" && purSecId !== "10" && purSecId !== "12" ?
                      <Col md="4" className="mb-1">
                        <Label className="form-label requiredlable">
                          {lblInvoiceDate}
                        </Label>

                        <Controller
                          control={control}
                          id="invdate"
                          name="invdate"
                          tabIndex="2"
                          rules={{ required: true }}
                          render={({ field: { ref, ...field } }) => (
                            <Flatpickr
                              value={field.value}
                              //  onChange={field.onChange}
                              {...field}
                              options={{
                                // allowInput: true,
                                minDate: "2017-07-01",
                                maxDate: Maxtoday,
                                dateFormat: "d-m-Y",
                              }}
                              onChange={function (
                                selectedDates,
                                dateStr,
                                instance
                              ) {
                                console.log("onchange date select");
                                const newDate = moment(
                                  new Date(selectedDates)
                                ).format("YYYY-DD-MM");
                                setinvDateSelection(newDate);
                                field.onChange(selectedDates);
                              }}
                              className={classnames("form-control", {
                                "is-invalid": errors?.invdate && true,
                              })}
                              invalid={errors?.invdate && true}
                            />
                          )}
                        />
                        {errors?.invdate && (
                          <FormFeedback>
                            Please select {lblInvoiceDate?.toLowerCase()}
                          </FormFeedback>
                        )}
                      </Col>
                      :
                      <Col md="4" className="mb-1">
                        <Label className="form-label requiredlable">
                          {lblInvoiceDate}
                        </Label>

                        <Controller
                          tabIndex="2"
                          control={control}
                          id="revisedInvoiceDate"
                          name="revisedInvoiceDate"
                          rules={{ required: true }}
                          // rules={{
                          //     required: `Please select ${lblInvoiceDate?.toLowerCase()}.`,
                          // }}
                          render={({ field: { ref, ...field } }) => (
                            <Flatpickr
                              value={field.value}
                              //  onChange={field.onChange}
                              {...field}
                              options={{
                                // allowInput: true,
                                minDate: "2017-07-01",
                                maxDate: Maxtoday,
                                dateFormat: "d-m-Y",
                              }}
                              onChange={function (
                                selectedDates,
                                dateStr,
                                instance
                              ) {
                                console.log("onchange date select");
                                const newDate = moment(
                                  new Date(selectedDates)
                                ).format("YYYY-DD-MM");
                                // setinvDateSelection(newDate);
                                setRevDateSelection(newDate)

                                field.onChange(selectedDates);
                              }}
                              className={classnames("form-control", {
                                "is-invalid": errors?.revisedInvoiceDate && true,
                              })}
                              invalid={errors?.revisedInvoiceDate && true}
                            />
                          )}
                        />
                        {errors?.revisedInvoiceDate && (
                          <FormFeedback>
                            Please select {lblInvoiceDate?.toLowerCase()}
                          </FormFeedback>
                        )}
                      </Col>

                  }
                  {doctypeDropDown == true ? (
                    <Col md="4" className="mb-1">
                      <Label className="form-label requiredlable">
                        Type of Export
                      </Label>
                      <Controller
                        id="typeofimp"
                        name="typeofimp"
                        control={control}
                        rules={{
                          required: `Please select type of export.`,
                        }}
                        render={({ field }) => (
                          <Select
                            placeholder={DROPDOWN_PLACEHOLDER}
                            isClearable={false}
                            value={field.value}
                            options={typeOfImpList}
                            classNamePrefix="select"
                            theme={selectThemeColors}
                            onChange={handleTypeOfExportInputChange}
                            className={classnames("react-select", {
                              "is-invalid": errors.typeofimp && true,
                            })}
                          // {...field}
                          />
                        )}
                      />
                      {errors.typeofimp && (
                        <FormFeedback>{errors.typeofimp.message}</FormFeedback>
                      )}
                    </Col>
                  ) : (
                    ""
                  )}
                  {purSecId == "3" || purSecId == "4" || purSecId == 8 ||
                    purSecId == 10 ? (
                    <Col md="4" className="mb-1">
                      <Label className="form-label requiredlable">
                        Note Type
                      </Label>
                      <Controller
                        id="typeofNote"
                        name="typeofNote"
                        control={control}
                        rules={{
                          required: `Please select note type.`,
                        }}
                        render={({ field }) => (
                          <Select
                            placeholder={DROPDOWN_PLACEHOLDER}
                            isClearable={false}
                            value={field.value}
                            options={crdrList}
                            classNamePrefix="select"
                            theme={selectThemeColors}
                            onChange={field.onChange}
                            className={classnames("react-select", {
                              "is-invalid": errors.typeofNote && true,
                            })}
                            {...field}
                          />
                        )}
                      />
                      {errors.typeofNote && (
                        <FormFeedback>{errors.typeofNote.message}</FormFeedback>
                      )}
                    </Col>
                  ) : null}
                </Row>
                <Row>
                  <Col md="4" className="mb-1">
                    <Label
                      className={classNames({
                        "form-label requiredlable": purSecId == 1 || purSecId == 7 || purSecId == 8 || purSecId ==2 || purSecId ==3 || purSecId ==4,
                        "form-label": purSecId >= 9,
                      })}
                    >
                      Buyer GSTIN
                    </Label>
                    <Controller
                      id="gstnumber"
                      name="gstnumber"
                      control={control}
                      rules={{
                        required:
                          purSecId == 1 || purSecId == 7 || purSecId == 8 || purSecId == 2 || purSecId ==3 ||purSecId ==4
                            ? "Please enter valid GST Number."
                            : false,
                      }}
                      // field.onChange(e.target.value.replace(/\s/g, ""))
                      render={({ field }) => (
                        <Input
                          placeholder=""
                          maxLength={15}
                          invalid={errors?.gstnumber?.message && true}
                          {...field}
                          // onChange={(e) =>
                          //   field.onChange(e.target.value.replace(/\s/g, ""))
                          // }
                          onChange={(e) => field.onChange(e.target.value = e.target.value.toUpperCase())}
                          onBlur={(e) => gstInOnChagne("gstnumber")}
                          onKeyPress={(e) => {
                            if (new RegExp(/[a-zA-Z0-9"]/).test(e.key)) {
                            } else e.preventDefault();
                          }}
                          onPaste={(e) => handlePasteText(e, setError,'gstnumber','Buyer GSTIN','space')}
                          disabled={displayGSTIN}
                        />
                      )}
                    />
                    {errors.gstnumber && (
                      <FormFeedback>{errors.gstnumber.message}</FormFeedback>
                    )}
                  </Col>
                  <Col md="8" className="mb-1">
                    <Label className="form-label">Buyer Name</Label>
                    <Controller
                      id="nameofparty"
                      name="nameofparty"
                      control={control}
                      render={({ field }) => (
                        <Input
                          placeholder=""
                          invalid={errors?.nameofparty?.message && true}
                          {...field}
                          onKeyPress={(e) => handleKeyPressPass(e, setError,'nameofparty','Buyer Name','allowSpace')}
                          onPaste={(e) => handlePasteText(e, setError,'nameofparty','Buyer Name','allowSpace')}
                        />
                      )}
                    />
                    {errors.nameofparty && (
                      <FormFeedback>{errors.nameofparty.message}</FormFeedback>
                    )}
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
          <Col md={5}>
            <Card>
              <CardBody>
                <Row>
                  <Col md="6">
                    <Label
                      className={classNames({
                        "form-label requiredlable":
                          purSecId == 1 ||
                          purSecId == 2 ||
                         // purSecId == 5 ||
                          // purSecId == 6 ||
                          purSecId == 7 ||
                          purSecId == 9 ||
                          purSecId == 13 ||
                          purSecId == 8 ||
                          purSecId == 10 ||
                          purSecId == 14 ||
                          purSecId == 16 ||
                          purSecId == 15 ||
                          purSecId == 4,
                        "form-label":
                          purSecId == 3 || purSecId == 11,
                      })}
                    >
                      {purSecId == 9 || purSecId == 10  ? "UR Type" : " Invoice Type"}
                    </Label>
                    <Controller
                      id="invtype"
                      name="invtype"
                      control={control}
                      rules={{
                        required:
                            purSecId == 5 || purSecId == 11 || purSecId == 6 || purSecId == 12
                            ? false
                            : purSecId == 9 || purSecId == 10 || purSecId == 4 
                              ? "Please select ur type."
                              : " Please select invoice type.",
                      }}
                      render={({ field }) => (
                        <Select
                          isDisabled={disableInvType}
                          placeholder={DROPDOWN_PLACEHOLDER}
                          isClearable={false}
                          value={field.value}
                          options={purSecId == 9 || purSecId == 10 ? CDNInvTypeList : invTypeList}
                          classNamePrefix="select"
                          theme={selectThemeColors}
                          onChange={handleURTypeInputChange}
                          // onChange={field.onChange}
                          className={classnames("react-select", {
                            "is-invalid": errors.invtype && true,
                          })}
                        // {...field}
                        />
                      )}
                    />
                    {errors.invtype && (
                      <FormFeedback>{errors.invtype.message}</FormFeedback>
                    )}
                  </Col>

                  <Col md="6" className="mb-1">
                    <Label
                      className={classNames({
                        "form-label requiredlable ":
                          purSecId == 1 || purSecId == 2 || purSecId == 3 || purSecId == 4|| purSecId >= 5,
                        "form-label": purSecId == 13 || purSecId == 14,
                      })}
                    >
                      Supply Type
                    </Label>
                    <Controller
                      id="supplyType"
                      name="supplyType"
                      control={control}
                      rules={{
                        required:
                          purSecId == 11 || purSecId == 12 //impg or imps
                            ? false
                            : "Please select supply type .",
                      }}
                      render={({ field }) => (
                        <Select
                          placeholder={DROPDOWN_PLACEHOLDER}
                          isClearable={false}
                          value={field.value}
                          options={supplyTypeList}
                          classNamePrefix="select"
                          theme={selectThemeColors}
                          // onChange={field.onChange}
                          onChange={(x) => {
                            console.log("Selection =", x);
                            field.onChange(x);
                          }}
                          isDisabled={impgNimpsDisable}
                          className={classnames("react-select", {
                            "is-invalid": errors.supplyType && true,
                          })}
                          {...field}
                        />
                      )}
                    />
                    {errors.supplyType && (
                      <FormFeedback>{errors.supplyType.message}</FormFeedback>
                    )}
                  </Col>
                </Row>

                <Row>
                  <Col md="6" className="mb-1">
                    <Label
                      className={classNames({
                        "form-label requiredlable ":
                          purSecId == 1 ||
                          purSecId == 2 ||
                          purSecId == 7 ||
                          purSecId == 13 ||
                          purSecId == 8 ||
                          purSecId == 16 ||
                          purSecId == 14 ||
                          purSecId == 3 ||
                          purSecId == 4 ||
                          purSecId == 15 ,
                        "form-label":
                           purSecId == 5 || purSecId == 11,
                      })}
                    >
                      RCM
                    </Label>
                    <Controller
                      id="reversechange"
                      name="reversechange"
                      control={control}
                      rules={{
                        required:
                          
                            purSecId == 5 ||
                            purSecId == 11 ||
                            
                            purSecId == 6 ||
                            purSecId == 10 ||
                            purSecId == 9  ||  purSecId == 12 // B2CL, B2CS, Export invoice
                            ? false
                            : "Please select reverse charge.",
                      }}
                      render={({ field }) => (
                        <Select
                          isDisabled={disableRCM}
                          placeholder={DROPDOWN_PLACEHOLDER}
                          isClearable={false}
                          value={field.value}
                          options={reverseChangeList}
                          classNamePrefix="select"
                          theme={selectThemeColors}
                          onChange={field.onChange}
                          className={classnames("react-select", {
                            "is-invalid": errors.reversechange && true,
                          })}
                          {...field}
                        />
                      )}
                    />
                    {errors.reversechange && (
                      <FormFeedback>
                        {errors.reversechange.message}
                      </FormFeedback>
                    )}
                  </Col>
                  <Col md="6" className="mb-1">
                    <Label className="form-label requiredlable">
                      Place of Supply
                    </Label>
                    <Controller
                      id="placeofsupply"
                      name="placeofsupply"
                      control={control}
                      rules={{
                        required: "Please select place of supply.",
                      }}
                      render={({ field }) => (
                        <Select
                          placeholder={DROPDOWN_PLACEHOLDER}
                          isClearable={false}
                          value={field.value}
                          options={stateOptionsList}
                          classNamePrefix="select"
                          theme={selectThemeColors}
                          onChange={handleStateChange}
                          //  onChange={field.onChange}
                          className={classnames("react-select", {
                            "is-invalid": errors.placeofsupply && true,
                          })}
                          onKeyDown={selectKeyDown}

                        // {...field}
                        />
                      )}
                    />
                    {errors.placeofsupply && (
                      <FormFeedback>
                        {errors.placeofsupply.message}
                      </FormFeedback>
                    )}
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Card>
          <CardBody className="CardBody p-0">
            <Row>
              <div className="col-lg-10 pe-0">
                <HotTable
                  autoWrapRow={true}
                  id="tblPurchase"
                  ref={hotRef}

                  preventOverflow="horizontal"
                  contextMenu={false}
                  // rowHeights="35"
                  height="auto"
                  autoRowSize={true}
                  // manualColumnResize={true}
                  rowHeaders={false}
                  stretchH="all"

                  data={purchaseData}
                  columns={invalidColumn}

                  colHeaders={colHeaders}
                  afterOnCellMouseDown={localAfterOnCellMouseDown}
                  selectionMode="single"

                  // nestedHeaders={[
                  //     ['ITEM DESCRIPTION', 'ITEM TYPE', 'HSN CODE', 'QTY', ' UNIT&nbsp;OF&nbsp;(MEASUREMENT)</b>', 'UNIT PRICE', { label: 'DISCOUNT ' + discTypesDisplayName }, 'TAXABLE VALUE', 'GST RATE', { label: 'TAXABLE VALUES (RS.)', colspan: 3 }, { label: 'CESS', colspan: 2 }, 'ITC ELIGIBILITY', { label: 'ITC CLAIM', colspan: 5 }],
                  //     ['', '', '', '', '', '', '', '', '', 'CGST', 'SGST', 'IGST', '%', 'AMT', '', '%', 'CGST AMT (RS.)', 'SGST AMT (RS.)', 'IGST AMT (RS.)', 'Cess Amt (Rs.)']
                  // ]}

                  licenseKey="non-commercial-and-evaluation"
                  afterChange={CellValueOnBeforeChange}
                  afterRenderer={(TD, row, col, prop, value) => {
                    if ((col >= 0) &&errorArr.findIndex((y) => y.row == row && y.col == col) != -1) {
                      TD.style.backgroundColor = "red";
                    }
                }}
                  beforeKeyDown={function (e, col) {
                    //  console.log(this.getSelectedLast())
                    if (e.keyCode == 8 ||
                      e.keyCode == 46 ||
                      e.keyCode == 67 ||
                      e.keyCode == 86) {
                    } else {
                      var reg = /^[0-9.]+|[\b]+$/;
                      console.log(this.getSelectedLast()?.[1]);
                      let col = this.getSelectedLast()?.[1];

                      if (
                        col === 2 ||
                        col === 3 ||
                        col == 5 ||
                        col == 6 ||
                        col == 7 ||
                        col == 8 ||
                        col == 12 ||
                        col == 13 ||
                        col == 15 ||
                        col == 16 ||
                        col == 17 ||
                        col == 18 ||
                        col == 19
                      ) {
                        if (!reg.test(e.key)) {
                          e.preventDefault();
                        }
                      }
                    }
                  }}

                  afterValidate= {function(isValid, value, row, prop, source){
                    let col = this.propToCol(prop);
                    let result;
                    if(value !== null && value !== "" && value !== undefined) {
                      let resultLength = value.toString().length;
                      if (col == 2) {
                       result =  value?.toString().length % 2;
                       if (result == 0 && (resultLength == 2 || resultLength == 4 ||  resultLength == 6 ||  resultLength == 8 ||  resultLength == 10)) {
                         return true;
                       } else {
                         return false;
                       }
                      }
                    }

                  }}

                />
              </div>
              <div className="col-lg-2 p-0 pe-1">
                <HotTable
                id="tblPurchaseTot"
                  ref={hotRefTot}
                  autoWrapRow={true}
                  autoColumnSize={true}
                  stretchH="all"
                  height="auto"
                  data={purchaseDataTotCol}
                //  manualColumnResize={true}
                  columns={[
                    {
                      data: "total",
                      readOnly: true,
                      className: "purchseCellDisable",
                      title: `<div style="padding:16px 0px;">Total ${rupessSymbol} </div>`,
                      type: "numeric",
                    },
                    { title: "", width: 30, renderer: "html" },
                  ]}
                  licenseKey="non-commercial-and-evaluation"
                  cells={function (row, col, prop) {
                    const cellPrp = {};
                    if (col === 1) {
                      cellPrp.renderer = myBtns;
                      cellPrp.readOnly = true;
                    }

                    return cellPrp;
                  }}
                />
              </div>

              <div className="col-lg-12 py-1 px-0">
                <Row className="justify-content-end mx-0">
                  <Col md={2}>
                    <Button
                      className="btn-icon ms-1"
                      color="danger"
                      outline
                      id="btnAddRow"
                      onClick={(e) => addNewRows(e)}
                      size="sm"
                    >
                      <Plus size={14} />
                      <span className="align-middle ms-50">
                        Add Item [{keysMap.ADD_ENTRY}]{" "}
                      </span>
                    </Button>
                  </Col>

                  <Col md={10} className="d-flex justify-content-end">
                    <table className="me-1">
                      <tbody>
                        <tr>
                          <td className="pe-1">Total taxable value:</td>
                          <td className="text-end">
                            <strong>{totTaxableValue}</strong>
                          </td>
                        </tr>
                        <tr>
                          <td className="pe-1">Total tax:</td>
                          <td className="text-end">
                            {" "}
                            <strong>{totTax}</strong>
                          </td>
                        </tr>
                        <tr>
                          <td className="pe-1">Total discount:</td>
                          <td className="text-end">
                            {" "}
                            <strong>{totDisAmt}</strong>
                          </td>
                        </tr>
                        <tr>
                          <td className="pe-1">Total invoice value:</td>
                          <td>
                            <Controller
                              id="invvalue"
                              name="invvalue"
                              control={control}
                              // rules={{
                              //     required: "Please enter invoice value.",
                              // }}
                              render={({ field }) => (
                                <Input
                                  style={{ textAlign: "right", fontWeight: "bold" }}
                                  placeholder=""
                                  invalid={errors.invvalue && true}
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(
                                      e.target.value.replace(/\s/g, "")
                                    )
                                  }
                                />
                              )}
                            />
                            {errors.invvalue && (
                              <FormFeedback>
                                {errors.invvalue.message}
                              </FormFeedback>
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </Col>
                </Row>
              </div>
            </Row>
          </CardBody>
        </Card>
        <hr />

        <Row className="p-1">

          {

            purSecId !== "2" && purSecId !== "4" && purSecId !== "8" && purSecId !== "10"  && purSecId  !== "6" ?
              <Col md={8}>
                 { console.log('section type :' ,  purSecId ) }
                <Row>
                  <Col md="2" className="mb-1">
                    <Label className="form-label">Posting Date</Label>
                    <Controller
                      control={control}
                      id="postingdate"
                      name="postingdate"
                      render={({ field: { ...field } }) => (
                        <Flatpickr
                          value={field.value}
                          options={{
                            allowInput: true,
                            minDate: "2017-07-01",
                            dateFormat: "d-m-Y",
                            maxDate: Maxtoday,
                          }}

                          {...field}
                          onChange={function (selectedDates, dateStr, instance) {
                            console.log(
                              "onchange date setPostingDtSelection  select"
                            );
                            const newDate = moment(new Date(selectedDates)).format(
                              "YYYY-DD-MM"
                            );
                            console.log(newDate);
                            setPostingDtSelection(newDate);
                            field.onChange(selectedDates);
                          }}
                          className={classnames("form-control", {
                            "is-invalid": errors?.postingdate && true,
                          })}
                          invalid={errors?.postingdate && true}
                        />
                      )}
                    />
                    {errors.postingdate && (
                      <FormFeedback>{errors.postingdate.message}</FormFeedback>
                    )}
                  </Col>

                  <Col md="2" className="mb-1">
                    <Label className="form-label">Posting Month</Label>
                    <Controller
                      id="postingmonth"
                      name="postingmonth"
                      control={control}
                      render={({ field }) => (
                        <Input
                          placeholder=""
                          invalid={errors?.postingmonth?.message && true}
                          onPaste={(e) => handlePasteText(e, setError,'postingmonth','postingmonth','allowSpace')}
                          onKeyPress={(e) => handleKeyPressPass(e, setError,'postingmonth','postingmonth','allowSpace')}
                          {...field}
                          
                        />
                      )}
                    />
                      {errors.postingmonth && (
                      <FormFeedback>{errors?.postingmonth?.message}</FormFeedback>
                    )}
                  </Col>

                  <Col md="2" className="mb-1">
                    <Label
                      className={classNames({
                        "form-label requiredlable": purSecId == 4,
                        "form-label": purSecId <= 3 && purSecId >= 4,
                      })}
                    >
                      Port Code
                    </Label>
                    <Controller
                      id="portCode"
                      name="portCode"
                      control={control}
                      rules={{
                        required: purSecId == 4   ? "Please enter port code." : false,
                        pattern: {
                          value: /^[^\s]+$/,
                          message: 'Invalid port code.',
                        },
                      }}
                      render={({ field }) => (
                        <Input
                          maxLength={6}
                          placeholder=""
                          invalid={errors.portCode?.message && true}
                          onPaste={(e) => handlePasteText(e, setError,'portCode','portCode','allowSpace')}
                          onKeyPress={(e) => handleKeyPressPass(e, setError,'portCode','portCode','allowSpace')}
                          {...field}
                        />
                      )}
                    />
                    {errors.portCode && (
                      <FormFeedback>{errors.portCode.message}</FormFeedback>
                    )}
                  </Col>
                  <Col md="4" className="mb-1">
                    <Label className="form-label">Remark</Label>
                    <Controller
                      id="remark1"
                      name="remark1"
                      control={control}
                      render={({ field }) => (
                        <Input
                          placeholder=""
                          invalid={errors.remark1?.message && true}
                          onPaste={(e) => handlePasteText(e, setError,'remark1','remark1','allowSpace')}
                          onKeyPress={(e) => handleKeyPressPass(e, setError,'remark1','remark1','allowSpace')}
                          {...field}
                        />
                      )}
                    />
                    {errors.remark1 && (
                      <FormFeedback>{errors.remark1.message}</FormFeedback>
                    )}
                  </Col>

                      {
                        purSecId == 14 ||  purSecId == 16 ?
                        <Col md="2" className="mb-1">
                        <Label className="form-label requiredlable">Financial month</Label>
                        <Controller
                            id="finYearMonth"
                            name="finYearMonth"
                            control={control}
                            rules={{
                              required: `Please select Fin. month.`,
                            }}
                            render={({ field }) => (
                              <Select
                                placeholder={DROPDOWN_PLACEHOLDER}
                                isClearable={false}
                                value={field.value}
                                options={yearMonthData}
                                classNamePrefix="select"
                                theme={selectThemeColors}
                                onChange={field.onChange}
                                menuPlacement="auto"
                                maxMenuHeight="150"
                                menuPosition="fix"
                                className={classnames("react-select", {
                                  "is-invalid": errors.finYearMonth && true,
                                })}
                                {...field}
                              />
                            )}
                          />
                          {errors.finYearMonth && (
                            <FormFeedback>{errors.finYearMonth.message}</FormFeedback>
                          )}
                      </Col> : ""
                      }

                </Row>
              </Col>

              :
              <Col md={12}>
                <Row>
                  <Col md="2" className="mb-1">
                    <Label className="form-label">Posting Date</Label>
                    <Controller
                      control={control}
                      id="postingdate"
                      name="postingdate"
                      render={({ field: { ...field } }) => (
                        <Flatpickr
                          value={field.value}
                          options={{
                            allowInput: true,
                            minDate: "2017-07-01",
                            dateFormat: "d-m-Y",
                            maxDate: Maxtoday,
                          }}

                          {...field}
                          onChange={function (selectedDates, dateStr, instance) {
                            console.log(
                              "onchange date setPostingDtSelection  select"
                            );
                            const newDate = moment(new Date(selectedDates)).format(
                              "YYYY-DD-MM"
                            );
                            console.log(newDate);
                            setPostingDtSelection(newDate);
                            field.onChange(selectedDates);
                          }}
                          className={classnames("form-control", {
                            "is-invalid": errors?.postingdate && true,
                          })}
                          invalid={errors?.postingdate && true}
                        />
                      )}
                    />
                    {errors.postingdate && (
                      <FormFeedback>{errors.postingdate.message}</FormFeedback>
                    )}
                  </Col>

                  <Col md="2" className="mb-1">
                    <Label className="form-label">Posting Month</Label>
                    <Controller
                      id="postingmonth"
                      name="postingmonth"
                      control={control}
                      render={({ field }) => (
                        <Input
                          placeholder=""
                          invalid={errors.postingmonth?.message && true}
                          onPaste={(e) => handlePasteText(e, setError,'postingmonth','postingmonth','allowSpace')}
                          onKeyPress={(e) => handleKeyPressPass(e, setError,'postingmonth','postingmonth','allowSpace')}
                          {...field}
                        />
                      )}
                    />
                       {errors.postingmonth && (
                      <FormFeedback>{errors.postingmonth.message}</FormFeedback>
                    )}
                  </Col>

                  <Col md="1" className="mb-1">
                    <Label
                      className={classNames({
                        "form-label requiredlable": "",
                        "form-label": purSecId <= 3 && purSecId >= 4,
                      })}
                    >
                      Port Code
                    </Label>
                    <Controller
                      id="portCode"
                      name="portCode"
                      control={control}
                      // rules={{
                      //   required: purSecId == 4 ? "Please enter port code." : false,
                      // }}
                      render={({ field }) => (
                        <Input
                          maxLength={6}
                          placeholder=""
                          invalid={errors?.portCode?.message && true}
                          onPaste={(e) => handlePasteText(e, setError,'portCode','portCode','allowSpace')}
                          onKeyPress={(e) => handleKeyPressPass(e, setError,'portCode','portCode','allowSpace')}
                          {...field}
                        />
                      )}
                    />
                    {errors.portCode && (
                      <FormFeedback>{errors?.portCode?.message}</FormFeedback>
                    )}
                  </Col>

                  <Col md="2" className="mb-1">
                    <Label className="form-label">Original Invoice No.</Label>
                    <Controller
                      id="originalInvoiceNumber"
                      name="originalInvoiceNumber"
                      control={control}
                      render={({ field }) => (
                        <Input
                          placeholder=""
                          invalid={errors?.originalInvoiceNumber?.message && true}
                          {...field}
                          maxLength={16}
                          onChange={(e) =>
                            field.onChange(e.target.value.replace(/\s/g, ""))
                          }
                          onKeyPress={(e) => {
                            if (new RegExp(/[-a-zA-Z0-9/\/]/).test(e.key)) {
                            } else e.preventDefault();
                          }}
                        />
                      )}
                    />
                    {errors.originalInvoiceNumber && (
                      <FormFeedback>{errors.originalInvoiceNumber.message}</FormFeedback>
                    )}
                  </Col>
                  <Col md="2" className="mb-1">
                    <Label className="form-label">Original Invoice Date</Label>

                    <Controller
                      control={control}
                      id="originalInvoiceDate"
                      name="originalInvoiceDate"

                      render={({ field: { ref, ...field } }) => (
                        <Flatpickr
                          value={field.value}
                          //  onChange={field.onChange}
                          {...field}
                          options={{
                            // allowInput: true,
                            minDate: "2017-07-01",
                            maxDate: Maxtoday,
                            dateFormat: "d-m-Y",
                          }}
                          onChange={function (
                            selectedDates,
                            dateStr,
                            instance
                          ) {
                            console.log("onchange date select");
                            const newDate = moment(
                              new Date(selectedDates)
                            ).format("YYYY-DD-MM");
                            // setinvDateSelection(newDate);
                            setOrginalInvoiceDate(newDate)

                            field.onChange(selectedDates);
                          }}
                          className={classnames("form-control", {
                            "is-invalid": errors?.originalInvoiceDate && true,
                          })}
                          invalid={errors?.originalInvoiceDate && true}
                        />
                      )}
                    />

                    {errors.originalInvoiceDate && (
                      <FormFeedback>{errors.originalInvoiceDate.message}</FormFeedback>
                    )}
                  </Col>

                  <Col md="3" className="mb-1">
                    <Label className="form-label">Remark</Label>
                    <Controller
                      id="remark1"
                      name="remark1"
                      control={control}
                      render={({ field }) => (
                        <Input
                          placeholder=""
                          invalid={errors.remark1?.message && true}
                          onPaste={(e) => handlePasteText(e, setError,'remark1','remark1','allowSpace')}
                          onKeyPress={(e) => handleKeyPressPass(e, setError,'remark1','remark1','allowSpace')}
                          {...field}
                        />
                      )}
                    />
                    {errors.remark1 && (
                      <FormFeedback>{errors.remark1.message}</FormFeedback>
                    )}
                  </Col>

                </Row>
              </Col>
          }

          {purSecId == 1 || purSecId == 3 || purSecId == 5 ? (
            <Col md={4}>
              <Row>
                <Col md="6" className="mb-1">
                  <Label
                    className={classNames({
                      "form-label requiredlable": purSecId == 4,
                      "form-label": purSecId <= 3 && purSecId >= 4,
                    })}
                  >
                    E-Commerce GSTIN
                  </Label>
                  <Controller
                    id="eCommerceGSTIN"
                    name="eCommerceGSTIN"
                    control={control}
                    rules={{
                      required:
                        purSecId == 4
                          ? "Please enter E-Commerce GSTIN."
                          : false,
                    }}
                    render={({ field }) => (
                      <Input
                        maxLength={15}
                        placeholder=""
                        invalid={errors.eCommerceGSTIN && true}
                        {...field}
                        onChange={(e) => field.onChange(e.target.value = e.target.value.toUpperCase())}
                        onBlur={(e) => gstInOnChagne("eCommerceGSTIN")}
                        onKeyPress={(e) => {
                          if (new RegExp(/[a-zA-Z0-9"]/).test(e.key)) {
                          } else e.preventDefault();
                        }}
                      />
                    )}
                  />
                  {errors.eCommerceGSTIN && (
                    <FormFeedback>{errors.eCommerceGSTIN.message}</FormFeedback>
                  )}
                </Col>
              </Row>
            </Col>
          ) : (
            <Col md={4}> </Col>
          )}





        </Row>
        <br />
        <br />

        <div className="btnFixFooter">
          <Row className="justify-content-end mx-0">
            <Col
              className="d-flex align-items-center justify-content-end"
              md="12"
              sm="12"
            >
              <Button type="submit" className="me-1" id="btnsalessave1" color="danger" outline>
                {btnName}
                <UncontrolledTooltip placement="top" target="btnsalessave1">
                {btnName} [{keysMap.SAVE_DATA}]
                </UncontrolledTooltip>
              </Button>
              {btnName == "Update" && (
                <Button
                  className="me-1"
                  color="danger"
                  onClick={deletePurchaseInvoice}
                  outline
                  id="btnsalesdel1"
                >
                  Delete
                  <UncontrolledTooltip placement="top" target="btnsalesdel1">
                  Delete [{keysMap.MANUAL_DELETE}]
                </UncontrolledTooltip>
                </Button>
              )}
              <Button
                color="secondary"
                className="me-1"
                outline
                onClick={resetForm}
              >
                Discard
              </Button>

              <Button
                color="secondary"
                className="me-1"
                outline
                onClick={RedirectBack}
              >
                Back
              </Button>
            </Col>
          </Row>
        </div>
      </Form>
    </div>
  );
}
export default sales;
