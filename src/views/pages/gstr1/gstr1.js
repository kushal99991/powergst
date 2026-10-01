import { Fragment, useState, useEffect, useRef } from "react";
import { API_URL_GSTR1, PageSize, checkBoxTitle, checkboxFilterCss, paginationList, paginationTitle } from "../../../configs/config";
import { HotTable } from "@handsontable/react";
import Handsontable from "handsontable";
import { textRenderer } from "handsontable/renderers";
import { registerAllModules } from "handsontable/registry";
import classnames from "classnames";
import PurchaseSummaryInvoice from "../../../services/Reco/Purchase/purchaseInvoiceService";
import GSRT1SummaryInvoice from "../../../services/gstr1/gstr1Services/gstr1PurchaseInvoiceService";
import gstr1SummaryServices from "../../../services/gstr1/gstr1Services/gstr1SummaryServices";
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
import { X } from "react-feather";
import Swal from "sweetalert2";

import { DROPDOWN_PLACEHOLDER, SELECT_MAXSIZE, RowSize, columnHeaderSize } from "@configs/config";

import { globleVariable } from "../../../configs/globalVariable";
import LocalFunction from "../../../configs/getLocalFunction";
import SessionFunction from "../../../configs/getSessionFunction";
import UILoader from '@components/ui-loader'
import Spinner from '@components/spinner/Loading-spinner'

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
  Button,
  Modal,
  ModalBody,
  Form,
  FormFeedback,
  CardText,
  Tooltip,
  UncontrolledTooltip,
  TabContent,
  TabPane,
  CardBody,
  Table,
} from "reactstrap";
import { useForm, Controller } from "react-hook-form";

import ReactPaginate from "react-paginate";
import Tabs from "./tabs";
import encryptData from "../../../auth/crypto/crypto";
import { tokenExpiresRedirect } from "../../../utility/Utils";
import withReactContent from "sweetalert2-react-content";
import { filterCurrentDate } from "../../../helper/filterArray";
import { downloadURL } from "../../../helper/downloadUrl";
import { messageShowDuration } from '@configs/config'
import { showTotalRowPerPage } from "../../../helper/tableRowsPerPage";
import Gstr1SuppliesMade from "../../components/gstr1SectionPage/gstr1SuppliesMade";
import { handleKeyPressPass, handlePasteText } from "../../../helper/validation";


let isChecked = false;
const optionField = { label: "--Select--", value: "-1" };
var unitList = [];

const RateList = [
  { value: "0.00", label: "0" },
  { value: "0.10", label: "0.1" },
  { value: "0.25", label: "0.25" },
  { value: "1.00", label: "1" },
  { value: "1.50", label: "1.5" },
  { value: "3.00", label: "3" },
  { value: "5.00", label: "5" },
  { value: "6.00", label: "6" },
  { value: "7.50", label: "7.5" },
  { value: "12.00", label: "12" },
  { value: "18.00", label: "18" },
  { value: "28.00", label: "28" },
];

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

const Gstr1PurchaseInvoices = ({ returnDate }) => {
  const navigate = useNavigate();
  let fromPath = window.location.pathname;
  let arrFilter = [];
  let arrChk = []

  const [blockTable, setBlockTable] = useState(false)
  const [block, setBlock] = useState(false);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [currentCol, setCurrentCol] = useState([]);
  const [currentCol1, setCurrentCol1] = useState();
  const [searchVal1, setSearchVal1] = useState([]);
  const [searchDate, setSearchDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [searchDate1, setSearchDate1] = useState("");
  const [searchDate2, setSearchDate2] = useState("");
  const [typeofDocument, setTypeOfDocumnent] = useState([]);
  const [dummy, setDummy] = useState("0");
  const [dummy2, setDummy2] = useState("0");

  const [b2csData, setB2csData] = useState([]);
  const [b2csPage, setB2csPage] = useState(0);
  const [currentColb2cs, setCurrentColb2cs] = useState([]);
  const [currentCol1b2cs, setCurrentCol1b2cs] = useState();
  const [searchValb2cs, setSearchValb2cs] = useState([]);
  const [pageNoSelect, setPageNoSelect] = useState(paginationList[0]);
  const [rowsPerPage, setRowsPerPage] = useState(PageSize);
  const [pageTotTitle, setpageTotTitle] = useState(paginationTitle);
  const [atSummaryData, setAtSummaryData] = useState([]);
  const [paginationUi, setPaginationUi] = useState();

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
  const [rateValue, setRateValue] = useState(null);

  // filter value set
  const [invoiceTypeList, setInvoiceTypeList] = useState([]);

  // let suppliesMadePayload= {}
  const [suppliesMadePayload, setsuppliesMadePayload] = useState({});

  const [subTypeList, setSubTypeList] = useState([optionField]);
  const [vendorList, setVendorList] = useState([]);
  const [reverchargeList, setReverchargeList] = useState([]);
  const [crDrList, setCrDrList] = useState([]);
  const [payloadGstr1, setPayloadGstr1] = useState();

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
  const [hsnDesc, setHsnDesc] = useState(true);
  const [hsnCheck, setHsnCheck] = useState(true);
  const [docsCheck, setDocsCheck] = useState(true);
  const [hsnEvenCheck, setHsnEvenCheck] = useState(true);


  // for Advance Filter State
  const [gridCustomFilter, setGridCustomFilter] = useState([]);
  const [chkFilter, setchkFilter] = useState([]);
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
  const [checkList, setCheckList] = useState({
    rcmList: [],
    noteType: [],
    pos: [],
    uqc: [],
    rate: []
  });
  const [filterDropDownList, setFilterDropDownList] = useState({
    rateDropDownList: [],
    rcmDropDownList: [],
    noteTypeDropDownList: [],
    posDropDownList: [],
    uqcDropDownList: [],
  })

  const clearState = () => {
    setGridCustomFilter([]);
    setFilterDropDownList({
      rateDropDownList: [],
      rcmDropDownList: [],
      noteTypeDropDownList: [],
      posDropDownList: [],
      uqcDropDownList: [],
    });
    setFromAmount('')
    setToAmount('');
    setFromValue('');
    setToValue('');
    setFromTax('');
    setToTax('');
    setFromIgst('');
    setToIgst('');
    setFromCgst('');
    setToCgst('');
    setFromSgst('');
    setToSgst('');
    setFromCess('');
    setToCess('');
    setToDate('');
    setSearchDate('');
    arrChk = []
  }


  const [disableSaveExempt, setDisableSaveExempt] = useState(false);

  //ITC
  const [btnDisable1, setbtnDisable1] = useState(false);

  const [sectionAdvPaymentList, setSectionAdvPaymentList] = useState([]);
  const [srcLoad, setSrcLoad] = useState(false);

  const [exemptErrorArr, setExemptErrorArr] = useState([]);

  const [returnPeriodDisable, setReturnPeriodIdDisable] = useState(true);

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
  const gstr1Range =
    sessionStorage.getItem(globleVariable.defaultYear) &&
    SessionFunction.getSessionValue(globleVariable.defaultYear, true);
    const subId =
    localStorage.getItem(globleVariable.subscriptionId) &&
    LocalFunction.getLocalValue(globleVariable.subscriptionId, true);


  const token = LocalFunction.getLocalValue(globleVariable.tokenKey, true);




  const selectFromYearaddmodel = (value) => {
    setSelectedYear(value);
  };

  useEffect(() => {
    const currDateTime = JSON.parse(FinDateTime).toString().split("T")[0];
    const frDataFilter = filterCurrentDate(YearList, currDateTime);

    if (frDataFilter?.length > 0) {
      setFinancialYearList(frDataFilter);
    }

    const frData = frDataFilter?.filter(
      (item) => item.value == finFromYear?.value
    )[0];

    if (frData !== undefined) {
      setSelectedYear(frData);
    } else {
      setSelectedYear(frDataFilter?.length > 0 ? frDataFilter[0] : null);
    }
  }, [hsnShow, docShow]);

  const { setGSRT1Data, wizardBtn } = useOutletContext();


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
    invoiceType: "",
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
    watch,
  } = useForm({ defaultValues, defaultValuesDoc, defaultValueAdvanceSummary });

  const selectedAtInvoicetype = watch("invoiceType");
  const patternAllowSpace = /<[^>]+>|(http|https|www\.)|(\bselect\b\s*\*?\s*\bfrom\b|\binsert\s+into\b|\bupdate\b|\bdelete\s+from\b)|@[\w]+/i;

  let GSTNumber = G_GSTIN.substring(0, 2);
  useEffect(() => {
    if (advShow) {
      console.log(true, "turrrrrrr");

      if (
        watch("placeOfSupply")?.value == GSTNumber &&
        watch("grossAdvance") &&
        watch("rate")?.value
      ) {
        const sum =
          watch("grossAdvance") && watch("rate")
            ? (parseInt(watch("grossAdvance")) *
              parseInt(watch("rate").value)) /
            100 /
            2
            : 0;
        const stringConversion = sum.toString();
        setDummy(stringConversion);
        setDummy2("0");
      } else {
        const sum =
          watch("grossAdvance") && watch("rate")
            ? (parseInt(watch("grossAdvance")) *
              parseInt(watch("rate").value)) /
            100
            : 0;
        const stringConversion = sum.toString();
        setDummy2(stringConversion);
        setDummy("0");
      }

      const currDateTime = JSON.parse(FinDateTime).toString().split("T")[0];
      const frDataFilter = filterCurrentDate(YearList, currDateTime);

      if (frDataFilter?.length > 0) {
        setFinancialYearList(frDataFilter);
      }

      const frData = frDataFilter?.filter(
        (item) => item.value == finFromYear?.value
      )[0];

      if (frData !== undefined) {
        setSelectedYear(frData);
      } else {
        setSelectedYear(frDataFilter?.length > 0 ? frDataFilter[0] : null);
      }
    }
  }, [
    watch("grossAdvance"),
    watch("rate")?.value,
    dummy2,
    dummy,
    placeOfSupplyList,
    watch("placeOfSupply"),
    advShow,
  ]);

  const openHsn = () => {
    setHsn(true);
  };

  const invModalOpen = () => {
    setModalshow(!modalshow);
  };

  const toggleModal = () => setModalshow(!modalshow);

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
      invModalOpen: invModalOpen,
      ItcSavePurchaseInvoice: ItcSavePurchaseInvoice,
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

  const onSubmit = (data) => {
    console.log("hsn add data=", data);
    let isValid = true;
    let userIds = LocalFunction.getLocalValue(globleVariable.userId, true)

    const editPayload = {
      hsn: data.hsn,
      description: data.description,
      totalQty: data.totalQty,
      taxableAmount: data.taxableAmount,
      rate: data?.rate?.value,
      totalValue: data.totalValue,
      igst: data.igst,
      cgst: data.cgst,
      sgst: data.sgst,
      cess: data.cess,
      uqc: data?.uqc?.value,
      gstr1HSNId: data?.gstr1HSNId ? data?.gstr1HSNId.toString() : "0",
      fkUserClientId: G_UCParId,
      insertedBy: userIds,
      fkFinancialYearId: G_FY,
      month: G_FM,
      returnPeriod: returnPeriodDisable == true ? selectedYear?.value : null,
      userId: userIds
    };

    const gstIn = getValues("hsn");

    if (gstIn?.length % 2 != 0) {
      setError("hsn", {
        type: "manual",
        message: "Enter valid HSN",
        required: true,
      });
      isValid = false;
    }

    if (isValid == true) {
      GSRT1SummaryInvoice.editGSTR1SummaryPagination(editPayload)
        .then((res) => {
          // set filters

          if (
            res.status === 200 &&
            res.data.status === errorCodeConfig.APIDefaultCode.Success
          ) {
            setBlock(false);
            setHsnShow(false);
            toast.success(res.data.successMessage, {
              duration: messageShowDuration
            });

            purchaseSummaryList(
              activeTab,
              "",
              "",
              activeTab == 3 ? "0" : invType,
              finFromYear?.value,
              monthFrom?.value,
              ""
            );
            reset();
          } else {
            setBlock(false);
            Swal.fire({
              icon: "error",
              title: "",
              text: res.data.errorMessage,
              customClass: {
                confirmButton: "btn btn-danger",
              },
              buttonsStyling: false,
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
            customClass: {
              confirmButton: "btn btn-danger",
            },
            buttonsStyling: false,
          });
        });
    }
  };

  const onSubmitDocs = (data) => {
    console.log("docs data", data);
    const editPayload = {
      ...data,
      natureOfDocument: data?.natureOfDocument?.value,
      gstr1DocsId: data?.gstr1DocsId?.toString() ? data?.gstr1DocsId?.toString() : '0',
      fkUserClientId: G_UCParId,
      userId: LocalFunction.getLocalValue(globleVariable.userId, true),
      fkFinancialYearId: G_FY,
      month: G_FM,
      returnPeriod: selectedYear?.value,
    };
    //
    GSRT1SummaryInvoice.editDocsById(editPayload)
      .then((res) => {
        if (
          res.status === 200 &&
          res.data.status === errorCodeConfig.APIDefaultCode.Success
        ) {
          setBlock(false);
          setDocShow(false);
          toast.success(
            data?.gstr1DocsId
              ? "Doc update successfully"
              : "Doc added successfully"
          );
          purchaseSummaryList(
            activeTab,
            "",
            "",
            activeTab == 4 ? "0" : invType,
            finFromYear?.value,
            monthFrom?.value,
            ""
          );
          setReturnPeriodIdDisable(true);
          reset();
        } else {
          setBlock(false);
          Swal.fire({
            icon: "error",
            title: "",
            text: res.error?.message,
            customClass: {
              confirmButton: "btn btn-danger",
            },
            buttonsStyling: false,
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
          customClass: {
            confirmButton: "btn btn-danger",
          },
          buttonsStyling: false,
        });
      });
  };

  const onSubmitAdvSummary = (data) => {

    const {
      originalMonthyear,
      placeOfSupply,
      originalPlaceOfSupply,
      rate,
      igst,
      cgst,
      sgst,
      cess,
      grossAdvance,
      invoiceType,
    } = data;
    const summary = {
      originalMonthyear:
        originalMonthyear !== undefined && originalMonthyear !== null
          ? originalMonthyear.split("-")[1] + originalMonthyear.split("-")[0]
          : "",
      placeOfSupply: placeOfSupply?.value,
      originalPlaceOfSupply: originalPlaceOfSupply?.value,
      rate: rate?.value,
      igst: igst,
      cgst: cgst,
      sgst: sgst,
      cess: cess,
      grossAdvance: grossAdvance,
    };
    const payLoad = {
      gstinNumber: G_GSTIN,
      userId: G_UCID,
      fkUserClientId: G_UCParId,
      fkFinancialYearId: G_FY,
      month: G_FM,
      fkgstrSectionId: invoiceType?.value,
      summary: [summary],
      returnPeriod: selectedYear?.value,
    };
    console.log(payLoad);
    GSRT1SummaryInvoice.saleAdvanceSummaryInsertUpdate(payLoad)
      .then((res) => {
        if (
          res.status === 200 &&
          res.data.status === errorCodeConfig.APIDefaultCode.Success
        ) {
          setBlock(false);
          setAdvShow(false);

          toast.success(res?.data?.successMessage);

          purchaseSummaryList(
            activeTab,
            "",
            "",
            activeTab == 4 ? "0" : atInvoiceType?.value,
            finFromYear?.value,
            monthFrom?.value,
            ""
          );
          reset();
          setDummy("0");
        } else {
          setBlock(false);
          setDummy("0");
          Swal.fire({
            icon: "error",
            title: "",
            text: res.error?.message,
            customClass: {
              confirmButton: "btn btn-danger",
            },
            buttonsStyling: false,
          });
          // setData([])
        }
      })
      .catch((error) => {
        setBlock(false);
        setDummy("0");
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

  const location = useLocation();

  let { id } = useParams();

  let searchUrlValue = null;

  const invalidColumns = [
    {
      data: "select",
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
    }
  ];

  const invalidColumnsEmpty = [
    {
      data: "select",
      title: "",
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

  ];


  const ammentmentInvalidColumns = [
    {
      data: "select",
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
      title: ' ',
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

  const B2CsInvalidColumns = [
    {
      data: "select",
      type: "checkbox",
      width: 20,
      readOnly: false,
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
    // {
    //   // data: "totalTaxableAmount", title: "Total Taxable Amt (₹)", readOnly: true,
    //   data: "totalTaxableAmount1",
    //   title: "Taxable Value (₹)1",
    //   readOnly: true,
    //   columnSorting: {
    //     indicator: false,
    //     headerAction: false,
    //   },
    // },
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
    }
  ];

  const B2CsInvalidColumnsEmpty = [
    {
      data: "select",
      title: '',
      width: 1,
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

  // B2cs Columns
  const b2csColumns = [
    {
      data: "supplyType",
      title: "Supply Type",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "placeOfSupply",
      title: "Place Of Supply",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "rate",
      title: "Rate of Tax (₹)",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "totalTaxableValue",
      title: "Total Taxable Value (₹)",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "igstAmount",
      title: "IGST (₹)",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "cgstAmount",
      title: "CGST (₹)",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "sgstAmount",
      title: "SGST (₹)",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },

    {
      data: "cess",
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
      data: "sectionName",
      title: "Section Name",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "supplyType",
      title: "Supply Type",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },

    {
      data: "placeOfSupply",
      title: "Place Of Supply",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "rate",
      title: "Rate",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "grossAdvanceAmount",
      title: "Gross advance amount",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "igst",
      title: "IGST",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "cgst",
      title: "CGST",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "sgst",
      title: "SGST",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "cess",
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
      data: "sectionName",
      title: "Section Name",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "originalReturnPeriod",
      title: "Originally Return Period",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "supplyType",
      title: "Supply Type",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "placeOfSupply",
      title: "Place Of Supply",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "rate",
      title: "Rate (₹)",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "grossAdvanceAmount",
      title: "Gross advance amount (₹)",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "igst",
      title: "IGST (₹)",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "cgst",
      title: "CGST (₹)",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "sgst",
      title: "SGST (₹)",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "cess",
      title: "Cess (₹)",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
  ];


  let headerGrossAdvance =
    atInvoiceType?.value == 15 || atInvoiceType?.value == 16
      ? "Gross Advance Adjusted (₹)"
      : "Gross Advance Received  (₹)";

  let headerPlaceOfSupply =
    atInvoiceType?.value == 14 || atInvoiceType?.value == 16
      ? "originalPlaceOfSupply"
      : "placeOfSupply";

  const atColumns = [
    {
      data: "select",
      type: "checkbox",
      width: 20,
      readOnly: false,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "sheetName",
      title: "Section",
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
      title: "Party Name",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "invoiceNumber",
      title: "Advance Receipt Number",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "invoiceDate",
      title: "Advance Receipt Date",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "totalTaxableAmount",
      title: headerGrossAdvance,
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
      data: headerPlaceOfSupply,
      title: "Place Of Supply",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
  ];


  const atColumnsEmpty = [
    {
      data: "select",
      title: '',
      width: 1,
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "sheetName",
      title: "Section",
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
      title: "Party Name",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "invoiceNumber",
      title: "Advance Receipt Number",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "invoiceDate",
      title: "Advance Receipt Date",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "totalTaxableAmount",
      title: headerGrossAdvance,
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
      data: "originalPlaceOfSupply",
      title: "Place Of Supply",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
  ];

  const crDrInvalidColumns = [
    {
      data: "select",
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
    { data: "purchaseId", title: "purchaseId" },
  ];


  const crDrInvalidColumnsEmpty = [
    {
      data: "select",
      title: '',
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
    { data: "purchaseId", title: "purchaseId" },
  ];

  const ammendentcrDrInvalidColumns = [
    {
      data: "select",
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
    { data: "purchaseId", title: "purchaseId" },
  ];

  const ammendentcrDrInvalidColumnsEmpty = [
    {
      data: "select",
      title: '',
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
    { data: "purchaseId", title: "purchaseId" },
  ];

  const hsnInvalidColumns = [
    {
      data: "select",
      type: "checkbox",
      width: 20,
      readOnly: false,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "hsn",
      title: "HSN",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "description",
      title: "Description",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
      width: 100,
    },
    {
      data: "uqc",
      title: "Unit of Measurement",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "totalQty",
      title: "Total Quantity",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
      // readOnly: hsnQty
    },
    {
      data: "taxableAmount",
      title: "Taxable Value (₹)",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "rate",
      title: "Rate (₹)",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "totalValue",
      title: "Total Value (₹)",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "igst",
      title: "IGST (₹)",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "cgst",
      title: "CGST (₹)",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "sgst",
      title: "SGST (₹)",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "cess",
      title: "Cess (₹)",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },

    {
      title: "Action",
      width: 90,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
  ];

  const hsnInvalidColumnEmpty = [
    {
      data: "select",
      title: '',
      width: 1,
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "hsn",
      title: "HSN",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "description",
      title: "Description",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
      width: 100,
    },
    {
      data: "uqc",
      title: "Unit of Measurement",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "totalQty",
      title: "Total Quantity",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
      // readOnly: hsnQty
    },
    {
      data: "taxableAmount",
      title: "Taxable Value (₹)",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "rate",
      title: "Rate (₹)",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "totalValue",
      title: "Total Value (₹)",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "igst",
      title: "IGST (₹)",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "cgst",
      title: "CGST (₹)",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "sgst",
      title: "SGST (₹)",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "cess",
      title: "Cess (₹)",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },

    {
      title: "Action",

      width: 90,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
  ];


  const DocColumns = [
    {
      data: "natureOfDocument",
      title: "Nature of Document",
      readOnly: true,
    },
    {
      data: "srNoFrom",
      title: "Sr.No.From",
      readOnly: true,
    },
    {
      data: "srNoTo",
      title: "Sr.No.To",
      readOnly: true,
    },
    {
      data: "totalNumber",
      title: "Total Number",
      readOnly: true,
    },
    {
      data: "cancelled",
      title: "Cancelled",
      readOnly: true,
    },
    {
      data: "netIssued",
      title: "Net Issued",
      readOnly: true,
    },
    {
      width: 90,
      title: "Action",
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
  ];

  const ExempColumn = [
    {
      data: "description",
      title: "Description",
      readOnly: true,
    },

    {
      data: "nilRatedSupplies",
      title: "Nil Rated Supplies",
      type: "numeric",
      numericFormat: {
        pattern: "0.00",
      },
    },
    {
      data: "exempted",
      title: "Exempted(other than nil-rated/non GST supply)",
      type: "numeric",
      numericFormat: {
        pattern: "0.00",
      },
    },
    {
      data: "nonGSTSupplies",
      title: "Non-GST supplies",
      type: "numeric",
      numericFormat: {
        pattern: "0.00",
      },
    },
  ];

  let dropDonwNameAssign;
  if (activeTab == 1) {
    if (invalidColumns[currentCol1]?.data === "reverseCharge") { //7
      dropDonwNameAssign = checkList.rcmList;
    }

  } else if (activeTab == 2) {
    if (crDrInvalidColumns[currentCol1crdr]?.data === "reverseCharge") { //7
      dropDonwNameAssign = checkList.rcmList;
    } else if (crDrInvalidColumns[currentCol1crdr]?.data === "noteType") { //6
      dropDonwNameAssign = checkList.noteType;
    }
  } else if (activeTab == 7) {

    if (B2CsInvalidColumns[currentCol1]?.data === "reverseCharge") { //7
      dropDonwNameAssign = checkList.rcmList;
    }
  }
  else if (activeTab == 6) {

    if (atColumns[currentCol1]?.data === headerPlaceOfSupply) { //7
      dropDonwNameAssign = checkList.pos;
    }
  } else if (activeTab == 3) {

    if (hsnInvalidColumns[currentCol1crdr]?.data === "rate") { //7
      dropDonwNameAssign = checkList.rate;
    } else if (hsnInvalidColumns[currentCol1crdr]?.data === "uqc") { //6
      dropDonwNameAssign = checkList.uqc;
    }
  }
  let dropDonwName = dropDonwNameAssign !== undefined && dropDonwNameAssign !== null ? dropDonwNameAssign : '';

  //** button - Action column
  function myLables(instance, td, row, col, prop, value, cellProperties) {
    Handsontable.renderers.TextRenderer.apply(this, arguments);
    td.innerHTML = `<div class="truncated">${value !== null && value !== "" ? value : ""}</div>`
  }

  function myBtns(instance, td, row, col, prop, value, cellProperties) {
    Handsontable.renderers.TextRenderer.apply(this, arguments);

    td.innerHTML =
      '<button class="btn add-edit"><i class="fa fa-edit" title="Edit"></i></button><button class="btn add-deactive" title="Delete"><i class="fa fa-trash"></i></button>';

    const hot = hotRefHsn?.current?.hotInstance;
    $(td)
      .find(".add-deactive")
      .on("click", (event) => {

        let { gstr1HSNId } = hot?.getSourceDataAtRow(cellProperties.row);
        deleteGSTR1HSNInvoice(gstr1HSNId);

      });

    $(td)
      .find(".add-edit")
      .on("click", (event) => {
        // const { clientId } = hot?.getSourceDataAtRow(cellProperties.row);

        console.log("edit data=", hot?.getSourceDataAtRow(cellProperties.row));
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


        setBlock(true);

        GSRT1SummaryInvoice.getHSNbyId(gstr1HSNId, G_UCParId)
          .then((res) => {
            // set filters

            if (
              res.status === 200 &&
              res.data.status === errorCodeConfig.APIDefaultCode.Success
            ) {
              console.log("hsn resp=", res?.data?.data);
              setBlock(false);
              setReturnPeriodIdDisable(false);
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

              const newX = unitList?.filter((item) => item.value == uqc)[0];
              const editRate = RateList?.filter(
                (item) => item.value == rate
              )[0];

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
              // setValue("rate", rate !== null && rate !== "" ? rate : "");
              setValue("rate", editRate);
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
                customClass: {
                  confirmButton: "btn btn-danger",
                },
                buttonsStyling: false,
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
              customClass: {
                confirmButton: "btn btn-danger",
              },
              buttonsStyling: false,
            });
          });
      });
  }

  function myBtnsofDocs(instance, td, row, col, prop, value, cellProperties) {
    Handsontable.renderers.TextRenderer.apply(this, arguments);

    td.innerHTML =
      '<button class="btn add-edit"><i class="fa fa-edit" title="Edit"></i></button><button class="btn add-deactive" title="Delete"><i class="fa fa-trash"></i></button>';

    const hot = hotRefInputCredit?.current?.hotInstance;
    $(td)
      .find(".add-deactive")
      .on("click", (event) => {
        console.log("click delete of Docs");
        //  console.log(hot?.getSourceDataAtRow(cellProperties.row))
        let { gstr1DocsId } = hot?.getSourceDataAtRow(cellProperties.row);
        console.log(
          hot?.getSourceDataAtRow(cellProperties.row),
          "hot?.getSourceDataAtRow(cellProperties.row)"
        );
        console.log(gstr1DocsId, "hot?.getSourceDataAtRow(cellProperties.row)");

        deleteGSRT1DocsDetails(gstr1DocsId);

      });

    $(td)
      .find(".add-edit")
      .on("click", (event) => {
        // const { clientId } = hot?.getSourceDataAtRow(cellProperties.row);


        let {
          gstr1DocsId,
          natureOfDocument,
          srNoFrom,
          srNoTo,
          totalNumber,
          cancelled,
          netIssued,
        } = hot?.getSourceDataAtRow(cellProperties.row);


        setBlock(true);

        GSRT1SummaryInvoice.getDocById(gstr1DocsId, G_UCParId)
          .then((res) => {
            // set filters

            if (
              res.status === 200 &&
              res.data.status === errorCodeConfig.APIDefaultCode.Success
            ) {
              console.log("doc-id=", res?.data?.data);
              setBlock(false);
              setReturnPeriodIdDisable(false);
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
                customClass: {
                  confirmButton: "btn btn-danger",
                },
                buttonsStyling: false,
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
              customClass: {
                confirmButton: "btn btn-danger",
              },
              buttonsStyling: false,
            });
          });
      });
  }

  function myBtnsAdvance(instance, td, row, col, prop, value, cellProperties) {
    Handsontable.renderers.TextRenderer.apply(this, arguments);

    td.innerHTML =
      '<button class="btn add-edit"><i class="fa fa-edit" title="Edit"></i></button><button class="btn add-deactive" title="Delete"><i class="fa fa-trash"></i></button>';

    const hot = hotRefAtSummary?.current?.hotInstance;
    $(td)
      .find(".add-deactive")
      .on("click", (event) => {
        console.log("click delete");
        //  console.log(hot?.getSourceDataAtRow(cellProperties.row))
        let { gstr1HSNId } = hot?.getSourceDataAtRow(cellProperties.row);
        console.log(
          hot?.getSourceDataAtRow(cellProperties.row),
          "hot?.getSourceDataAtRow(cellProperties.row)"
        );

        deleteGSTR1HSNInvoice(gstr1HSNId);

      });

    $(td)
      .find(".add-edit")
      .on("click", (event) => {
        // const hot = hotRefAtSummary?.current?.hotInstance;
        const { clientId } = hot?.getSourceDataAtRow(cellProperties.row);

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
        setAdvShow(true);
      });
  }

  let finYear = null;
  let finMonth = null;
  let url = null;
  let typeOfInvoice = [];
  let isFromReconciliation = null;
  let isFromFiling = null

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
  } else {
    let paramsEncoded = window.location.href.split('?');

    if (paramsEncoded[1]) {

      const decrptyUrlData = encryptData.decrypt(paramsEncoded[1]);
      const queryStr = decrptyUrlData?.split("&");
      url = queryStr[0]?.split("=")[1];
      isFromReconciliation = queryStr[1]?.split("=")[1];
      isFromFiling = queryStr[2]?.split("=")[1];
      finYear = queryStr[3]?.split("=")[1];
      finMonth = queryStr[4]?.split("=")[1];
    }
  }


  console.log(url, "url");

  useEffect(() => {
    setPanData(YearList);
    setPanDataFrom(YearList);
  }, []);

  useEffect(() => {
    setbtnDisable1(false);
    // console.log("display Search " + displayType);

    if (displayType == true || displayType == "true") {
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

    const setDt =
      Number(monthFrom?.srNo) > Number(value?.srNo)
        ? monthFrom
        : panDataFrom[0];
    const x = panDataFrom?.filter(
      (item) => Number(item.srNo) >= Number(value.srNo)
    );
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
    // if (activeTab == 4) {
    if (activeTab == 5) {
      getExempList(value?.value, monthFr?.value);
    } else {
      purchaseSummaryList(
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

      searchUrlValue = url;
      // decryptData?.decrypt(id)
      let invType = null;
      //
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
      if (activeTab == 5) {
        getExempList(finFromYear?.value, monthFrom?.value);
      } else {
        //  activeTab == 3 ? 11 : activeTab == 5 ? 9 : activeTab == 4 ? 10 : invoceTypes.value
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
    clearState()
  }, [activeTab]);

  let addArray1 = [];
  useEffect(() => {
    // set Value
    if (showList == true) {
      const filterInv = invoiceTypeList?.filter((p) => p.value == url);
      const filterInvb2CS = b2csInvoiceTypeList?.filter((p) => p.value == url);
      const filterInvAt = atInvoiceTypeList?.filter((p) => p.value == url);
      const filterInvCrdr = crdrInvoiceTypeList?.filter((p) => p.value == url);
      //const filterInvAdvPayment = sectionAdvPaymentList?.filter(p => p.value == url);
      console.log(filterInv, "filterInv");
      if (filterInv?.length > 0) {
        setInvoceTypes(filterInv[0]);
      } else {
        if (invoiceTypeList?.length > 0) {
          setInvoceTypes(invoiceTypeList[0]);
        }
      }

      if (filterInvb2CS?.length > 0) {
        setB2csInvoiceType(filterInvb2CS[0]);
      } else {
        if (b2csInvoiceTypeList?.length > 0) {
          setB2csInvoiceType(b2csInvoiceTypeList[0]);
        }
      }
      if (filterInvAt?.length > 0) {
        setAtInvoiceType(filterInvAt[0]);
        setValue("invoiceType", filterInvAt[0]);
      } else {
        if (atInvoiceTypeList?.length > 0) {
          setAtInvoiceType(atInvoiceTypeList[0]);
          setValue("invoiceType", filterInvAt[0]);
        }
      }
      if (filterInvCrdr?.length > 0) {
        setCrDrInvoiceType(filterInvCrdr[0]);
      } else {
        if (crdrInvoiceTypeList?.length > 0) {
          setCrDrInvoiceType(crdrInvoiceTypeList[0]);
        }
      }

    }
  }, [showList]);

  const handleSelect = (framework) => {
    const isSelected = selectedFrameworks.includes(framework);
    const newSelection = isSelected
      ? selectedFrameworks.filter((currentTech) => currentTech !== framework)
      : [...selectedFrameworks, framework];
    setSelectedFrameworks(newSelection);
  };

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
    clearState();
    var addArray = [];
    var craddArray = [];
    isChecked = false;

    const filterInv = invoiceTypeList?.filter((p) => p?.value == url);
    const filterInvCrdr = crdrInvoiceTypeList?.filter((p) => p?.value == url);
    //const filterInvAdvPayment = sectionAdvPaymentList?.filter(p => p.value == url);
    const filterInvB2cs = b2csInvoiceTypeList?.filter((p) => p?.value == url);
    const filterInvAt = atInvoiceTypeList?.filter((p) => p?.value == url);

    if (tab == 1) {
      if (filterInv?.length > 0) {
        setInvoceTypes(filterInv?.[0]);
      } else {
        setInvoceTypes(invoiceTypeList?.[0]);
      }
    } else if (tab == 7) {
      if (filterInvB2cs?.length > 0) {
        setB2csInvoiceType(filterInvB2cs?.[0]);
      } else {
        setB2csInvoiceType(b2csInvoiceTypeList?.[0]);
      }
    } else if (tab == 6) {
      if (filterInvAt?.length > 0) {
        setAtInvoiceType(filterInvAt?.[0]);
      } else {
        setAtInvoiceType(atInvoiceTypeList?.[0]);
      }
    } else {
      if (filterInvCrdr?.length > 0) {
        setCrDrInvoiceType(filterInvCrdr?.[0]);
      } else {
        setCrDrInvoiceType(crdrInvoiceTypeList?.[0]);
      }
    }

    setPage(0);
    setDisplayType(true);
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
    filterpagination
  ) => {
    console.log("frDate", frDate);
    console.log("toDate", toDate);
    var newValuesArr = [];


    //
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
    }else if (activeTabs == 4) {
      newValuesArr = ['7'];
    } else {
      newValuesArr =
        invType !== undefined ? [invType] : [crdrInvoiceType?.value];
    }

    var searchPayload = {};
    // var suppliesMadePayload ={};
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

    searchValue = searchValue?.map((obj) =>
      isNumber(obj?.replaceAll(",", "")) ? obj?.replaceAll(",", "") : obj
    );

    searchPayload = {
      userClientId: G_UCParId,
      pageStart: filterpagination != null && filterpagination != '' && filterpagination != undefined ? filterpagination : page + 1,
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
      toRange: frDate,
      gstin: [],
      vendorName: "",
      isFromFiling: isFromFiling == 1 ? 1 : 0,
      isFromReconciliation: isFromReconciliation == 1 ? 1 : 0,
    };

    setsuppliesMadePayload({
      userClientId: G_UCParId,
      pageStart: 1,
      pageSize: 15,
      orderByColumnName: "",
      orderBy: "",
      searchColumnName: [
        ""
      ],
      searchValue: [
        ""
      ],
      sectionId: [20], // For regular  Section-20 And Amendment-21
      tabId: 5,
      fromRange: frDate,
      toRange: frDate,
      isFromFiling: isFromFiling == 1 ? 1 : 0,
      isFromReconciliation: isFromReconciliation == 1 ? 1 : 0
    })

    setBlock(true);

    SessionFunction.setSessionValue(globleVariable.gstr1FromDt, frDate, true);

    //  hsn api is here



    if (activeTab == 3) {

      GSRT1SummaryInvoice.getGSTR1SummaryHSNPagination(searchPayload)
        .then((res) => {
          setBlock(false);
          // set filters
          if (
            res.status === 200 &&
            res.data.status === errorCodeConfig.APIDefaultCode.Success
          ) {

            if (res?.data?.data?.summary !== null) {
              const {
                totalCGST,
                totalCess,
                totalIGST,
                totalInvoice,
                totalInvoiceValue,
                totalSGST,
                totalTaxableValue,
                totalHSN,
                totalHSNValue,
              } = res?.data?.data?.summary;
              setTotalCGST(
                totalCGST && totalCGST != undefined && totalCGST !== null && totalCGST !== "" ? totalCGST : 0
              );
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
              setHsn(totalHSN !== null && totalHSN !== "" ? totalHSN : 0);
              setHsnValue(
                totalHSNValue !== null && totalHSNValue !== ""
                  ? totalHSNValue
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
              setHsn(0);
              setHsnValue(0)

            }
          } else {
            setTotalCGST(0);
            setTotalCess(0);
            setTotalIGST(0);
            setTotalInvoice(0);
            setTotalInvoiceValue(0);
            setTotalSGST(0);
            setTotalTaxableValue(0);
            setHsn(0);
            setHsnValue(0)
          }

          if (
            res.status === 200 &&
            res.data.status === errorCodeConfig.APIDefaultCode.Success
          ) {
            setBlock(false);
            console.log("hsn data=", res?.data?.data);
            setData(res?.data?.data?.data);
            // setCheckList({ uqc: res?.data?.data?.uqc, rate: res?.data?.data?.rate })
            setCheckList(prevState => ({
              ...prevState,
              uqc: res?.data?.data?.uqc,
              rate: res?.data?.data?.rate
            }));


            if (res?.data?.data?.data?.length < 1) {
              setbtnDisable1(true);
            } else {
              setbtnDisable1(false);
            }
          } else {
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
    } else if (activeTab == 4) {
      console.log("eles if working");
      GSRT1SummaryInvoice.getGSTR1Doc(searchPayload).then((res) => {
        console.log(res?.data?.data?.details, "checkingResultForDocs");
        setBlock(false);
        if (
          res.status === 200 &&
          res.data.status === errorCodeConfig.APIDefaultCode.Success
        ) {
          setTypeOfDocumnent(res?.data?.data?.natureOfDocumentList);
          setData(res?.data?.data?.details);
        }
      });
    } else if (activeTab == 6) {
      // getAdvanceSummaryList(frDate, toDate, searchType !== null && searchType !== '' && searchType !== undefined ? searchType : defaultType)
      getAdvanceSummaryList(
        frDate,
        frDate,
        searchType !== null && searchType !== "" && searchType !== undefined
          ? searchType
          : defaultType,
        searchPayload
      );
      // Advance Pagination
    } else {
      if (activeTab == 7) {
        var b2csCurrentColval = null;
        var b2csSearchValue = null;
        if (activeTab == 7) {
          b2csCurrentColval = clearBy == refershData ? [] : currentColb2cs;
          b2csSearchValue = clearBy == refershData ? [] : searchValb2cs;
        }

        // console.log(
        //   "show b2cs",
        //   b2csInvoiceType?.value,
        //   invType,
        //   searchType,
        //   defaultType
        // );

        searchPayloadB2cs = {
          userClientId: G_UCParId,
          pageStart: b2csPage + 1,
          pageSize: PageSize,
          searchColumnName: b2csCurrentColval,
          searchValue: b2csSearchValue,
          fromRange: frDate,
          toRange: frDate,
          gstin: G_GSTIN,
          Type: invType,

        };
        GSRT1SummaryInvoice.getGstr1SaleB2caSummary(searchPayloadB2cs)
          .then((res) => {
            setBlock(false);

            if (
              res.status === 200 &&
              res.data.status === errorCodeConfig.APIDefaultCode.Success
            ) {
              setBlock(false);
              setB2csData(res?.data?.data?.getGstr1B2CSSummaryAPIModels);
            } else {
              setBlock(false);
              setB2csData([]);
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
        GSRT1Pagination(searchPayload)
        getSummaryDataSearch(searchPayload)

      } else {
        GSRT1Pagination(searchPayload)
        getSummaryDataSearch(searchPayload)
      }


      //** invoice api calling

    }
  };

  const GSRT1Pagination = (searchPayload) => {
    GSRT1SummaryInvoice.getGSRT1PurchasePagination(searchPayload)
      .then((res) => {
        // set filters

        if (res.status === 200 && res.data.status === errorCodeConfig.APIDefaultCode.Success) {
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
            setCheckList({ rcmList: res?.data?.data?.reverseCharge, noteType: res?.data?.data?.creditDebit, pos: res?.data?.data?.placeOfSupply })
          }
          setGstinList(res?.data?.data?.gstinList);
          setShowList(true);


          if (res?.data?.data?.summary !== null) {
            const {
              totalCGST,
              totalCess,
              totalIGST,
              totalInvoice,
              totalInvoiceValue,
              totalSGST,
              totalTaxableValue,
            } = res?.data?.data?.summary;
            setTotalCGST(
              totalCGST !== null && totalCGST !== "" ? totalCGST : 0
            );
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


  const advancePagination = (searchPayload) => {
    GSRT1SummaryInvoice.getAdvancePagination(searchPayload)
      .then((res) => {
        setBlock(false);
        // set filters
        if (res.status === 200) {
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
            setCheckList({ pos: res?.data?.data?.placeOfSupply })

          }
          setGstinList(res?.data?.data?.gstinList);
          setShowList(true);


          if (res?.data?.data?.summary !== null) {
            const {
              totalCGST,
              totalCess,
              totalIGST,
              totalInvoice,
              totalInvoiceValue,
              totalSGST,
              totalTaxableValue,
            } = res?.data?.data?.summary;
            setTotalCGST(
              totalCGST !== null && totalCGST !== "" ? totalCGST : 0
            );
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
          // setAtData(res?.data?.data?.paginationData);

          setbtnDisable1(false);
          setData(res?.data?.data?.paginationData);
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

  const purchaseData = data;
  // const purchaseData = [];
  const pageCount = Math.ceil(
    purchaseData?.length && purchaseData[0].totalRowCount / rowsPerPage
  );
  const b2csTableData = b2csData;
  const pageCountB2cs = Math.ceil(
    b2csTableData?.length && b2csTableData[0].totalRowCount / PageSize
  );
  // withot pagination property
  const handlePageClick = (event) => {
    setPage(event);
    setServerSidePage(true);
  };

  const hotRef = useRef(null);
  const hotRefB2cs = useRef(null);
  const hotRefB2csInv = useRef(null);
  const hotRefB2csInv1 = useRef(null);
  const hotRef1 = useRef(null);
  const hotRefCrdrVendor = useRef(null);
  const hotRefCrdrVendor1 = useRef(null);
  const hotRefCrdr = useRef(null);
  const hotRefInputCredit = useRef(null);
  const hotRefExemp = useRef(null);
  const hotRefAdvPayment = useRef(null);
  const hotRefAdvPayment1 = useRef(null);
  const hotRefHsn = useRef(null);
  const hotRefAt = useRef(null);
  const hotRefAt1 = useRef(null);
  const hotRefAtSummary = useRef(null);

  const hot = hotRef?.current?.hotInstance;
  const filtersPlugin = hot?.getPlugin("filters");

  // arrFilter = [];
  const theader = (col, TH) => {

    if (activeTab == 6) {
      if (col === 0 || col === 1) {
        const button = TH.children[0].children[0];
        button.className == "changeType" && button?.parentNode.removeChild(button);
      }
    } else if (activeTab == 3) {
      if (col === 0) {
        const button = TH.children[0].children[0];
        button?.parentNode.removeChild(button);
      } if (col === 12) {
        const button = TH.children[0].children[0];
        button.className == "changeType" && button?.parentNode.removeChild(button);
      }
    } else {
      if (col === 0) {
        const button = TH.children[0].children[0];
        button.parentNode.removeChild(button);
      }
    }

    if (activeTab == 1) {
      if (col == 5 || col == 6 || col == 7) {
        TH.className = "htRight";
      } else {
        TH.className = "htLeft";
      }
    } else if (activeTab == 2) {
      if (col == 5 || col == 6 || col == 7) {
        TH.className = "htRight";
      } else {
        TH.className = "htLeft";
      }
    } else if (activeTab == 7) {
      if (col == 5 || col == 6 || col == 4) {
        TH.className = "htRight";
      } else {
        TH.className = "htLeft";
      }
    } else if (activeTab == 6) {
      if (col == 7 || col == 6) {
        TH.className = "htRight";
      } else {
        TH.className = "htLeft";
      }
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
        const invoiceFilterCol = invoceTypes?.value == "2" ||
          invoceTypes?.value == "4" ||
          invoceTypes?.value == "12"
          ? ammentmentInvalidColumns
          : invalidColumns

        invoiceFilterCol.forEach((ele, index) => {
          const columnIndex = index;
          const buttonExists = document.querySelector(`.ht_clone_top thead th:nth-child(${columnIndex + 1}) button`);

          const columnMatchesCondition = Object.keys(finalObj).includes(ele.data);
          // uniq.some(col1 => ele?.data.includes(col1));

          // Check if column value is not null
          const columnValueValid = finalObj[ele.data] !== null && finalObj[ele.data] !== "";

          if (buttonExists && columnMatchesCondition && columnValueValid) {
            // const TH = document.querySelector(`.ht_clone_top thead th:nth-child(${columnIndex+1})`);
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

    if (activeTab == 2) {
      if (currentColcrdr.length > 0) {

        let uniq = [...new Set(currentColcrdr)];


        for (let i = 0; i < uniq.length; i++) {
          var obj = {};

          for (let j = 0; j < searchValcrdr.length; j++) {
            if (i == j) {
              obj[uniq[i]] = searchValcrdr[j]?.trim();
              arrFilter.push(obj);
            }
          }
        }


        let finalObj = {};
        for (let i = 0; i < arrFilter.length; i++) {
          Object.assign(finalObj, arrFilter[i]);
        }

        let invoiceFilterCrdrCol = null
        if (crdrInvoiceType?.value == "8" ||
          crdrInvoiceType?.value == "10") {
          invoiceFilterCrdrCol = ammendentcrDrInvalidColumns
        } else {
          invoiceFilterCrdrCol = crDrInvalidColumns
        }

        invoiceFilterCrdrCol.forEach((ele, index) => {
          const columnIndex = index;
          const buttonExists = document.querySelector(`.ht_clone_top thead th:nth-child(${columnIndex + 1}) button`);

          const columnMatchesCondition = Object.keys(finalObj).includes(ele.data);
          // uniq.some(col1 => ele?.data.includes(col1));

          // Check if column value is not null
          const columnValueValid = finalObj[ele.data] !== null && finalObj[ele.data] !== "";

          if (buttonExists && columnMatchesCondition && columnValueValid) {
            // const TH = document.querySelector(`.ht_clone_top thead th:nth-child(${columnIndex+1})`);
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

    if (activeTab == 7) {

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



        B2CsInvalidColumns.forEach((ele, index) => {
          const columnIndex = index;
          const buttonExists = document.querySelector(`#hotRefB2csInvoice1 .ht_clone_top thead th:nth-child(${columnIndex + 1}) button`);

          const columnMatchesCondition = Object.keys(finalObj).includes(ele.data);
          // uniq.some(col1 => ele?.data.includes(col1));

          // Check if column value is not null
          const columnValueValid = finalObj[ele.data] !== null && finalObj[ele.data] !== "";

          if (buttonExists && columnMatchesCondition && columnValueValid) {
            console.log(finalObj, "finalObj-finalObj")
            // const TH = document.querySelector(`.ht_clone_top thead th:nth-child(${columnIndex+1})`);
            // const TH = document.querySelector(`#hotRefB2csInvoice1 .tab-pane.active .ht_clone_top thead th:nth-child(${columnIndex + 1})`);
            const TH = document.querySelector(`#hotRefB2csInvoice1 .ht_clone_top thead th:nth-child(${columnIndex + 1})`);
            if (TH) {
              TH.classList.add("htFiltersActive");
            } else {
              TH.classList.remove("htFiltersActive");
            }
          }
        });
      }
    }

    if (activeTab == 3) {
      if (currentColcrdr.length > 0) {

        let uniq = [...new Set(currentColcrdr)];


        for (let i = 0; i < uniq.length; i++) {
          var obj = {};

          for (let j = 0; j < searchValcrdr.length; j++) {
            if (i == j) {
              obj[uniq[i]] = searchValcrdr[j]?.trim();
              arrFilter.push(obj);
            }
          }
        }


        let finalObj = {};
        for (let i = 0; i < arrFilter.length; i++) {
          Object.assign(finalObj, arrFilter[i]);
        }

        hsnInvalidColumns?.forEach((ele, index) => {
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

    if (activeTab == 6) {
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


        atColumns.forEach((ele, index) => {
          const columnIndex = index;
          // const buttonExists = document.querySelector(`#hotRefAtId .ht_clone_top thead th:nth-child(${columnIndex+1}) button`);
          const buttonExists = document.querySelector(`#hotRefAtId .ht_clone_top thead th:nth-child(${columnIndex + 1}) button`);

          const columnMatchesCondition = Object.keys(finalObj).includes(ele.data);


          // Check if column value is not null
          const columnValueValid = finalObj[ele.data] !== null && finalObj[ele.data] !== "";


          if (buttonExists && columnMatchesCondition && columnValueValid) {
            const TH = document.querySelector(`#hotRefAtId .ht_clone_top thead th:nth-child(${columnIndex + 1})`);
            // const TH = document.querySelector(`#hotRefAtId .tab-pane.active .ht_clone_top thead th:nth-child(${columnIndex + 1})`);

            if (TH) {
              console.log("COMING", columnValueValid, buttonExists, columnMatchesCondition, columnIndex)
              TH.classList.add("htFiltersActive");
            } else {
              TH.classList.remove("htFiltersActive");
            }
          }
        });
      }
    }

  };

  const theader1 = (col, TH) => {


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
      if (col > 0 && col < 6) {
        TH.className = "htRight";
      } else if (col == 6) {
        TH.className = "htCenter";
      } else {
        TH.className = "htLeft";
      }
    } else if (activeTab == 3) {
      if (col > 3 && col < 12) {
        TH.className = "htRight";
      } else if (col == 12) {
        TH.className = "htCenter";
      } else {
        TH.className = "htLeft";
      }
    }
  };

  function emptyRender(instance, td, row, col, prop, value, cellProperties) {
    textRenderer.apply(this, arguments);
    // if row contains negative number
    if (!value || value === "") {
      td.style.borderColor = "red";
      td.style.borderWidth = "1px";
      const x = row1;
      x.push({ row: row, col: col, comment: { value: "Some comment" } });
      setRow1(x);
      // td.style.background = 'blue';
    }
    // td.style.background = '';
  }

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
    // purchaseHSNId
    if (activeTab == 3) {
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

          const HSNpurchaseObj = {
            // userClientId: G_UCParId,
            // financialYearId: G_FY,
            gstr1HSNId: [id],
          };

          setBlock(true);
          GSRT1SummaryInvoice.hsnGSTR1InvoiceDelete(HSNpurchaseObj)
            .then((res) => {
              // PurchaseSummaryInvoice.hsnPurchaseInvoiceDelete(purchaseObj).then(res => {
              if (
                res.status === 200 &&
                res.data.status === errorCodeConfig.APIDefaultCode.Success
              ) {
                setBlock(false);
                isChecked = false;
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
                isChecked = false;
                toast.success(res.data.errorMessage, {
                  position: "top-right",
                });
              }
            })
            .catch((error) => {
              setBlock(false);
              isChecked = false;
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
      title: "Are you sure delete this DOC Details?",
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
          // userClientId: G_UCParId,
          // financialYearId: G_FY,
          gstr1DocsId: [id],
        };

        setBlock(true);
        GSRT1SummaryInvoice.gstr1DocsDeleted(DocsIdContainer)
          .then((res) => {
            // PurchaseSummaryInvoice.hsnPurchaseInvoiceDelete(purchaseObj).then(res => {
            if (
              res.status === 200 &&
              res.data.status === errorCodeConfig.APIDefaultCode.Success
            ) {
              setBlock(false);
              isChecked = false;
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
                activeTab == 4 ? "0" : invType,
                finFromYear?.value,
                monthFrom?.value,
                ""
              );
            } else {
              setBlock(false);
              isChecked = false;
              toast.success(res.data.errorMessage, {
                position: "top-right",
              });
            }
          })
          .catch((error) => {
            setBlock(false);
            isChecked = false;
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
    // GSTR1HSNId
    if (activeTab == 3) {
      var delArr = [];
      if (purchaseData.length > 0) {
        for (let i = 0; i < purchaseData.length; i++) {
          //
          if (
            purchaseData[i].select == "true" ||
            purchaseData[i].select == true
          ) {
            delArr.push(purchaseData[i].gstr1HSNId);
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
              // userClientId: G_UCParId,
              // financialYearId: G_FY,
              Gstr1HSNId: delArr,
            };

            setBlock(true);
            GSRT1SummaryInvoice.hsnGSTR1InvoiceDelete(purchaseObj)
              .then((res) => {
                if (
                  res.status === 200 &&
                  res.data.status === errorCodeConfig.APIDefaultCode.Success
                ) {
                  setBlock(false);
                  isChecked = false;
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
                  } else {
                    invType =
                      crdrInvoiceType?.value !== null &&
                        crdrInvoiceType?.value !== "" &&
                        crdrInvoiceType?.value !== undefined
                        ? crdrInvoiceType?.value
                        : url;
                  }

                  setPage(0);
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
                  isChecked = false;
                  toast.error(res.data.errorMessage, {
                    position: "top-right",
                  });
                }
              })
              .catch((error) => {
                setBlock(false);
                isChecked = false;
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
            delArr.push(purchaseData[i].gstr1Id);
          }
        }
      }

      if (delArr.length > 0) {
        return MySwal.fire({
          title: "Are you sure delete this invoice?",
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
              deletedBy: LocalFunction.getLocalValue(
                globleVariable.userId,
                true
              ),
              gstr1Id: delArr,
            };

            setBlock(true);
            // PurchaseSummaryInvoice.PurchaseInvoiceDelete(purchaseObj).then(res => {
            GSRT1SummaryInvoice.GSTR1InvoiceDelete(deleteGSRT1Invoices)
              .then((res) => {
                if (
                  res.status === 200 &&
                  res.data.status === errorCodeConfig.APIDefaultCode.Success
                ) {
                  setBlock(false);
                  isChecked = false;
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
                  isChecked = false;
                  toast.success(res.data.errorMessage, {
                    position: "top-right",
                  });
                }
              })
              .catch((error) => {
                setBlock(false);
                isChecked = false;
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
    if (coords.row == -1 && coords.col == 0) {
      if (
        !event.target.classList.contains("checker") ||
        event.target.classList.contains("checker")
      ) {
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
    }

    activeTab == 7 && setCurrentCol1b2cs(coords?.col);
    // if (event.target.classList.contains('checker')) {
    //     if (!isChecked) {
    //         isChecked = true;
    //         for (let index = 0; index < totalRows; index++) {
    //             hot?.setDataAtCell(index, 0, true);
    //         }
    //     } else {
    //         isChecked = false;
    //         for (let index = 0; index < totalRows; index++) {
    //             hot?.setDataAtCell(index, 0, false);
    //         }
    //     }
    // }

    if (coords.row !== -1 && activeTab !== 3 && activeTab != 7) {
      if (
        coords.col == 1 ||
        coords.col == 2 ||
        coords.col == 3 ||
        coords.col == 4
      ) {

        if (hot?.getSourceDataAtRow(coords?.row)) {
          const { gstr1Id, sectionId, sheetName } = hot?.getSourceDataAtRow(
            coords?.row
          );
          console.log(fromPath);
          if (gstr1Id !== null && gstr1Id !== "" && gstr1Id !== undefined) {
            console.log(hot?.getSourceDataAtRow(coords.row));
            const queryStr =
              "gstr1Id=" +
              gstr1Id +
              "&finId=" +
              G_FY +
              "&finMonth=" +
              G_FM +
              "&sectionId=" +
              sectionId;
            const encrypData = encryptData.encrypt(queryStr);
            console.log("purchaseId=" + gstr1Id);
            navigate("/gst-returns/sales/sales-invoice?" + encrypData, {
              state: { pathname: fromPath, sectionName: sheetName },
            });
          }
        }
      }
    }
    if (coords.row !== -1 && activeTab == 7) {
      if (
        coords.col == 1 ||
        coords.col == 2 ||
        coords.col == 3
      ) {

        if (hot?.getSourceDataAtRow(coords?.row)) {
          const { gstr1Id, sectionId, sheetName } = hot?.getSourceDataAtRow(
            coords?.row
          );
          console.log(fromPath);
          if (gstr1Id !== null && gstr1Id !== "" && gstr1Id !== undefined) {
            console.log(hot?.getSourceDataAtRow(coords.row));
            const queryStr =
              "gstr1Id=" +
              gstr1Id +
              "&finId=" +
              G_FY +
              "&finMonth=" +
              G_FM +
              "&sectionId=" +
              sectionId;
            const encrypData = encryptData.encrypt(queryStr);
            console.log("purchaseId=" + gstr1Id);
            navigate("/gst-returns/sales/sales-invoice?" + encrypData, {
              state: { pathname: fromPath, sectionName: sheetName },
            });
          }
        }
      }
    }

    //  For Invoice Tab sectionwise seorate columnName
    var colName;
    if (
      invoceTypes?.value == "2" ||
      invoceTypes?.value == "4" ||
      invoceTypes?.value == "12"
    ) {
      colName = ammentmentInvalidColumns
    } else {
      colName = invalidColumns
    }
    /**search value restore */
    let handsontableColumns =
      activeTab == 1
        ? colName
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

  const cellChange = (change, source) => {
    if (
      source === "CopyPaste.paste" ||
      source === "edit" ||
      source === "Autofill.fill"
    ) {
      const hot = hotRefExemp?.current?.hotInstance;

      for (let i = 0; i < change.length; i++) {
        const [row, col, , value] = change[i]; // Get the edited cell value
        const colIndex = ExempColumn.findIndex((obj) => obj.data === col);

        if (colIndex > 0) {
          const oldVal = change[i][2];
          const cellObj = {
            row: row,
            col: colIndex,
            tab: activeTab,
          };
          // Check if the edited value is numeric
          if (isNaN(value)) {
            setExemptErrorArr((pre) => [...pre, cellObj]);
          } else {
            if (
              exemptErrorArr.findIndex(
                (y) =>
                  y.row == cellObj.row &&
                  y.col == cellObj.col &&
                  y.tab == cellObj.tab
              ) != -1
            ) {
              setExemptErrorArr(
                exemptErrorArr.filter(
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

  //
  const localBeforeSetRangeStart = (coords) => {
    const { row, col } = coords;
    let hot;
    if (activeTab == 1) {
      hot = hotRef?.current?.hotInstance;
    } else if (activeTab == 2) {
      hot = hotRefCrdrVendor?.current?.hotInstance;
    } else if (activeTab == 7) {
      hot = hotRefB2csInv?.current?.hotInstance;
    } else if (activeTab == 6) {
      hot = hotRefAt?.current?.hotInstance;
    }

    else if (activeTab == 3) {
      hot = hotRefHsn?.current?.hotInstance;
    }
    // Check if the user is trying to select the checkbox cell (column index 0)
    if (col === 0) {
      const isChecked = hot?.getDataAtCell(row, col);
      hot?.setDataAtCell(row, col, !isChecked);

      // Prevent selecting the cell, since we manually toggled the checkbox
      return false;
    }
  };

  // Vendor onCellMouseDown
  function CrDrlocalAfterOnCellMouseDown(event, coords, td) {
    const hot = hotRefCrdrVendor?.current?.hotInstance;
    setCurrentCol1crdr(coords?.col);
    const totalRows = hot?.countRows();
    console.log("click");
    if (coords.row == -1 && coords.col == 0) {
      if (
        !event.target.classList.contains("checker") ||
        event.target.classList.contains("checker")
      ) {
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
    }


    const crDrInvalidCol = crdrInvoiceType?.value == "8" ||
      crdrInvoiceType?.value == "10"
      ? ammendentcrDrInvalidColumns
      : crDrInvalidColumns
    const Index = currentColcrdr?.findIndex(
      (item) => crDrInvalidCol[coords?.col]?.data == item
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

    if (coords.row !== -1) {
      if (coords.col == 1 || coords.col == 2) {

        if (hot?.getSourceDataAtRow(
          coords?.row)) {
          const { gstr1Id, sectionId, sheetName } = hot?.getSourceDataAtRow(
            coords?.row
          );

          if (gstr1Id !== null && gstr1Id !== "" && gstr1Id !== undefined) {
            console.log(hot?.getSourceDataAtRow(coords.row));
            const queryStr =
              "gstr1Id=" +
              gstr1Id +
              "&finId=" +
              G_FY +
              "&finMonth=" +
              G_FM +
              "&sectionId=" +
              sectionId;
            const encrypData = encryptData.encrypt(queryStr);
            console.log("purchaseId=" + gstr1Id);
            navigate("/gst-returns/sales/sales-invoice?" + encrypData, {
              state: { pathname: fromPath, sectionName: sheetName },
            });
          }
        }


      }
    }
  }

  function hsnlocalAfterOnCellMouseDown(event, coords, td) {
    const hot = hotRefHsn?.current?.hotInstance;
    if (coords?.col != 12)
      setCurrentCol1crdr(coords?.col);
    const totalRows = hot?.countRows();

    if (coords.row == -1 && coords.col == 0) {
      if (
        !event.target.classList.contains("checker") ||
        event.target.classList.contains("checker")
      ) {
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
    }

    const Index = currentColcrdr?.findIndex(
      (item) => hsnInvalidColumns[coords?.col]?.data == item
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


  function hsnlocalAfterOnCellMouseDownEmpty(event, coords, td) {
    const hot = hotRefHsn?.current?.hotInstance;
    setCurrentCol1crdr(coords?.col);


    const Index = currentColcrdr?.findIndex(
      (item) => hsnInvalidColumnEmpty[coords?.col]?.data == item
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


  function ServerSideSorting(col, order, coords, currentColumn) {
    //   const hot = hotRef?.current?.hotInstance;
    console.log("col=", col);
    console.log("order=", order);
    console.log(coords);
    //  console.log(currentColumn)
    const colId = order[0]["column"] !== undefined ? order[0]["column"] : "";
    const orderBy =
      order[0]["sortOrder"] !== undefined ? order[0]["sortOrder"] : "";
    console.log(colId);
    let colName = "";
    if (colId == 2) {
      colName = "invoiceNumber";
    } else if (colId == 3) {
      colName = "sheetName";
    } else if (colId == 5) {
      colName = "totalTaxableAmount";
    }
    purchaseSummaryList(activeTab, colName, orderBy);
  }


  const filterInvoiceType = (event) => {
    console.log("filter type", url);
    setCurrentCol([]);
    setCurrentCol1(null);
    setSearchVal1([]);

    setPage(0);
    setInvoceTypes(event);
    clearState();
    purchaseSummaryList(
      activeTab,
      "",
      "",
      event?.value,
      finFromYear?.value,
      monthFrom?.value,
      refershData
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
      refershData
    );
  };

  const filterInvoiceTypeB2cs = (event) => {
    console.log("filter type", url);
    setCurrentCol([]);
    setCurrentCol1(null);
    setSearchVal1([]);
    setPage(0);
    setB2csInvoiceType(event);
    clearState();
    purchaseSummaryList(
      activeTab,
      "",
      "",
      event?.value,
      finFromYear?.value,
      monthFrom?.value,
      refershData
    );
  };

  const filterInvoiceTypeAt = (event) => {
    console.log("filter type", url);
    setCurrentCol([]);
    setCurrentCol1(null);
    setSearchVal1([]);
    setPage(0);
    clearState();
    setAtInvoiceType(event);
    purchaseSummaryList(
      activeTab,
      "",
      "",
      event?.value,
      finFromYear?.value,
      monthFrom?.value,
      refershData
    );
  };

  const crdrFilterInvoiceType = (event) => {
    setCurrentColcrdr([]);
    setCurrentCol1crdr(null);
    setSearchValcrdr([]);
    setPage(0);
    clearState();
    setCrDrInvoiceType(event);
    purchaseSummaryList(
      activeTab,
      "",
      "",
      event?.value,
      finFromYear?.value,
      monthFrom?.value,
      refershData
    );
  };

  const ExportSectionWiseData = () => {
    // console.log(finFromYear?.value);
    // console.log(monthFrom?.value);
    console.log("export data");

    setBlock(true);
    // setTimeout(() => {
    //     setSrcLoad(true)
    // }, 5);
    const gstr1SectionId =
      activeTab == 3
        ? 18
        : activeTab == 5
          ? 17
          : activeTab == 4
            ? 19
            : activeTab == 2
              ? crdrInvoiceType?.value
              : activeTab == 6
                ? atInvoiceType?.value
                : activeTab == 7
                  ? b2csInvoiceType?.value
                  : invoceTypes?.value;

    gstr1SummaryServices
      .exportGSTR1ExportData(
        G_UCParId,
        finFromYear?.value,
        finFromYear?.value,
        gstr1SectionId,
        token,
        G_GSTIN,
        subId
      )
      .then((res) => {
        if (res?.status == 200 && res?.data?.status == errorCodeConfig.APIDefaultCode.Success) {
          console.log("res1");
          setBlock(false);
          // setTimeout(() => {
          //     setSrcLoad(false);
          // }, 1000);
          downloadURL(res.data.data);
        } else if (res?.status == 401) {
          tokenExpiresRedirect();
        } else {
          console.log("res2");
          setBlock(false);

          toast.error(res?.data?.errorMessage, {
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

  const onChangeValue = (e) => {
    console.log("fieldTest", e);
    const check = e.target.value.substring(0, 2);
    if (check?.includes("99")) {
      setHsnCheck(false);
      setDocsCheck(false);
    } else {
      setHsnCheck(true);
      setDocsCheck(true);
    }

    if (e.target.value?.length % 2 == 0) {
      // console.log("value is even");
      setHsnEvenCheck(true);
    } else {
      setHsnEvenCheck(false);
    }
  };

  const getExempList = (fromRange, toRange) => {
    const FKUserClientId = G_UCParId;

    setBlock(true);

    SessionFunction.setSessionValue(
      globleVariable.gstr1FromDt,
      fromRange,
      true
    );

    GSRT1SummaryInvoice.getExemptData(FKUserClientId, fromRange, fromRange)
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

  const getAdvanceSummaryList = (fromRange, toRange, invType, searchPayload) => {
    console.log(toRange, "tottttoto");

    const FKUserClientId = G_UCParId;
    const gstIn = G_GSTIN;
    setBlock(true);
    // sessionStorage.setItem("gstr1SelectExportFromDt", fromRange)
    // sessionStorage.setItem("gstr1SelectExportToDt", fromRange)
    SessionFunction.setSessionValue(
      globleVariable.gstr1FromDt,
      fromRange,
      true
    );

    GSRT1SummaryInvoice.getAdvanceSummary(
      FKUserClientId,
      fromRange,
      toRange,
      gstIn,
      invType
    )
      .then((res) => {

        if (
          res.status === 200 &&
          res.data.status === errorCodeConfig.APIDefaultCode.Success
        ) {
          if (invType == "13" || invType == "15") {
            setAtSummaryData(res?.data?.data?.getATSummaryAPIModels);
          } else {
            setAtSummaryData(res?.data?.data?.getExtraATSummaryAPIModels);
          }


          advancePagination(searchPayload)
          getSummaryDataSearch(searchPayload)


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

  //** Save
  const ItcSavePurchaseInvoice = () => {
    let errorArray = [];
    let isValid = true;
    if (activeTab == 5) {

      console.log(purchaseData);
      let arrData = []
      for (let i = 0; i < purchaseData.length; i++) {
        // let taxablePersonValue = null;
        let exemptedValue = null;
        let nilRatedSuppliesValue = null;
        let nonGstSuppliesValue = null;

        //let taxablePersonValueValid = true;
        let exemptedValueValid = true;
        let nilRatedSuppliesValueValid = true;
        let nonGstSuppliesValueValid = true;

        arrData.push({
          "description": purchaseData[i]["description"] !== null && purchaseData[i]["description"] !== "" && purchaseData[i]["description"] !== undefined ? purchaseData[i]["description"] : "",
          "exempted": purchaseData[i]["exempted"] !== null && purchaseData[i]["exempted"] !== "" && purchaseData[i]["exempted"] !== undefined ? purchaseData[i]["exempted"] : null,
          "nilRatedSupplies": purchaseData[i]["nilRatedSupplies"] !== null && purchaseData[i]["nilRatedSupplies"] !== "" && purchaseData[i]["nilRatedSupplies"] !== undefined ? purchaseData[i]["nilRatedSupplies"] : null,
          "nonGSTSupplies": purchaseData[i]["nonGSTSupplies"] !== null && purchaseData[i]["nonGSTSupplies"] !== "" && purchaseData[i]["nonGSTSupplies"] !== undefined ? purchaseData[i]["nonGSTSupplies"] : null
        })

        console.log(purchaseData[i]);
        if (
          purchaseData[i]["exempted"] !== "" &&
          purchaseData[i]["exempted"] !== null
        ) {
          if (isNumber(purchaseData[i]["exempted"]) == false) {
            isValid = false;
            exemptedValue = purchaseData[i]["exempted"];
            exemptedValueValid = false;
          }
        }

        if (
          purchaseData[i]["nilRatedSupplies"] !== "" &&
          purchaseData[i]["nilRatedSupplies"] !== null
        ) {
          if (isNumber(purchaseData[i]["nilRatedSupplies"]) == false) {
            isValid = false;
            nilRatedSuppliesValue = purchaseData[i]["nilRatedSupplies"];
            nilRatedSuppliesValueValid = false;
          }
        }

        if (
          purchaseData[i]["nonGSTSupplies"] !== "" &&
          purchaseData[i]["nonGSTSupplies"] !== null
        ) {
          if (isNumber(purchaseData[i]["nonGSTSupplies"]) == false) {
            isValid = false;
            nonGstSuppliesValue = purchaseData[i]["nonGSTSupplies"];
            nonGstSuppliesValueValid = false;
          }
        }

        if (
          // taxablePersonValueValid == true &&
          exemptedValueValid == true &&
          nilRatedSuppliesValueValid == true &&
          nonGstSuppliesValueValid == true
        ) {
        } else {
          errorArray.push({
            rowNo: i,
            //taxablePerson: taxablePersonValue,
            //   exempted: exemptedValue,
            //   nilRatedSupplies: nilRatedSuppliesValue,
            //   nonGstSupplies: nonGstSuppliesValue,
          });
        }
      }

      if (isValid == false) {
        let csssClass = "";
        let htmltblData = "<div style='' class='import-error-height'><table class='table text-start' style=''><thead style='" + csssClass + "' ><tr style='" + csssClass + "'><th style='" + csssClass + "'>Row No</th><th style='" + csssClass + "'>Error</th>"
        for (let i = 0; i < errorArray.length; i++) {
          htmltblData += `<tr style="${csssClass}"><td style="${csssClass}">${i + 1
            }</td><td style="${csssClass}; text-align: left;">${errorArray[i].rowid
            } - only numeric value allow. </td></tr>`;
        }

        htmltblData += "</tbody></table></div>";

        return MySwal.fire({
          title: "<strong>Error</strong>",
          icon: "error",
          html: <ErrorTable errorDataList={errorArray}></ErrorTable>,
          // <List errorDataList={errorArray}></List>,
          customClass: {
            confirmButton: "btn btn-danger",
          },
          buttonsStyling: false,
          width: "60%",
          height: "350px",
        });
      } else {
        const payLoad = {
          fkUserClientId: G_UCParId,
          insertedBy: LocalFunction.getLocalValue(globleVariable.userId, true),
          range: finFromYear?.value,
          data: arrData,
        };

        setBlock(true);
        if (activeTab == 5) {
          GSRT1SummaryInvoice.saleExempInsertUpdate(payLoad)
            .then((res) => {
              setBlock(false);
              if (
                res.status === 200 &&
                res.data.status === errorCodeConfig.APIDefaultCode.Success
              ) {
                getExempList(finFromYear?.value, monthFrom?.value);
                toast.success(res.data.successMessage, {
                  position: "top-right",
                });
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
        } else {
          PurchaseSummaryInvoice.purchaseItcInsertUpdate(payLoad)
            .then((res) => {
              setBlock(false);
              if (
                res.status === 200 &&
                res.data.status === errorCodeConfig.APIDefaultCode.Success
              ) {
                toast.success(res.data.successMessage, {
                  position: "top-right",
                });
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
        }
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
    setCurrentCol1crdr([])
    // setSearchValcrdr([])
    setSearchValcrdr([])
    setCurrentColcrdr([])
    setSearchVal1([]);
    setSearchDate("");
    setSearchDate1("");
    setSearchDate2("");
    isChecked = false;
    clearState();
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
      refershData
    );

  };

  // For Min-Max designPart
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

  //** Dropdown with pagination func - new functionality
  const onPageChangeFunc = (e) => {

    setPageNoSelect(e);
    setRowsPerPage(e.value);
    setPage(0);
    setServerSidePage(true)
  };

  // ** For VAPT Validation
  const handleChange = (field, e) => {
    const value = e.target.value;
    if (patternAllowSpace.test(value)) {
      setError('description', {
        type: 'manual',
        message: 'Invalid input detected.',
      });
    } else {
      clearErrors('description');
    }
    field.onChange(value.replace(patternAllowSpace, ""));
  };

  // ** Rows per Page Show
  useEffect(() => {
    const pageUi = showTotalRowPerPage(page, rowsPerPage, purchaseData[0]?.totalRowCount)
    setPaginationUi(pageUi)

  }, [purchaseData[0]?.totalRowCount, page, rowsPerPage])

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
          &nbsp; &nbsp;   {purchaseData?.length ? (<span  >
            <b>  {` ${paginationUi}`}</b>
          </span>) : <></>}  &nbsp; &nbsp;

          {/* <ReactPaginate
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
            /> */}
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

    );
  };


  useEffect(() => {
    return () => setBlockTable(false)
}, [])


  // ** Summary detail - API
  const getSummaryDataSearch = (searchPayload) => {
    setBlockTable(true)
    GSRT1SummaryInvoice.gstr1PaginationSummary(searchPayload)
      .then((res) => {

        if (res.status === 200 && res.data.status === errorCodeConfig.APIDefaultCode.Success) {
          setBlockTable(false)

          if (res?.data?.data !== null) {
            const {
              totalCGST,
              totalCess,
              totalIGST,
              totalInvoice,
              totalInvoiceValue,
              totalSGST,
              totalTaxableValue,
            } = res?.data?.data;
            setTotalCGST(
              totalCGST !== null && totalCGST !== "" ? totalCGST : 0
            );
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

      })
      .catch((error) => {
        setBlockTable(false);
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


            <TabPane tabId="1" key="1">
              <Card>
                <CardBody className="CardBody p-0">
                  <Row className="p-1">
                    <Col md={8}>
                    <UILoader blocking={blockTable} color="secondary"  overlayColor='rgba(255,255,255, .5)'>
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
                      </UILoader>
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

                            value={invoceTypes}
                          />
                        </Col>
                        <Col sm={6}>
                          <Label className="form-label">
                            Return Period
                          </Label>
                          <Select
                            id="from"
                            placeholder="Range"
                            isClearable={false}
                            isDisabled={true}
                            theme={selectThemeColors}
                            closeMenuOnSelect={true}
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
              <Card>
                <CardBody className="CardBody p-0">
                  <Row>
                    <Col sm="12">
                      <div>
                        {/* {purchaseData?.length ? ( */}
                        {activeTab == 1 && <HotTable
                          rowHeights={RowSize}
                          columnHeaderHeight={columnHeaderSize}
                          autoWrapRow={true}
                          ref={hotRef}
                          columnSorting={true}

                          dropdownMenu={{
                            items: {
                              filter_by_value: {
                                name: "Search Value",
                                // hide the 'Filter by value' list from all columns but the first one
                                hidden() {
                                  const selectedValue = this.getSelected()[0][1];
                                  const isValidColumn = [4, 5, 6, 7, 8].includes(selectedValue);

                                  return isValidColumn;
                                },
                              },

                              option4: {

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
                              about: { // For CheckBox custom option

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
                              option5: createOptionMinMax(fromAmount, toAmount, 5),
                              option6: createOptionMinMax(fromValue, toValue, 6),
                              option7: createOptionMinMax(fromTax, toTax, 7),
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
                                    if (clickEvent.target.id == "btnClear") {
                                      //** start
                                      const hot = hotRef?.current?.hotInstance;
                                      var colName;
                                      if (
                                        invoceTypes?.value == "2" ||
                                        invoceTypes?.value == "4" ||
                                        invoceTypes?.value == "12"
                                      ) {
                                        colName = ammentmentInvalidColumns
                                      } else {
                                        colName = invalidColumns
                                      }
                                      if (hot?.getSelected()[0][1] == 4) {

                                        var columnName = colName[currentCol1]?.data;
                                        var valueDate = '';
                                        setSearchDate('');
                                        setToDate('');

                                        var value = valueDate;
                                      } else if (hot?.getSelected()?.[0]?.[1] == 8) {

                                        var checkboxes = document.getElementsByClassName('checkBoxClass');
                                        arrChk = []
                                        setFilterDropDownList([]);
                                        var columnName = colName[currentCol1]?.data;
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
                                        var value = filterObject?.join('@#@#');

                                        const updatedFilterDropDownList = arrChk.reduce((acc, item) => {
                                          const { reverseCharge } = item;


                                          const updateList = (list, value) => {
                                            return list.includes(value) ? list : [...list, value];
                                          };

                                          if (reverseCharge !== undefined) {
                                            acc.rcmDropDownList = updateList(acc.rcmDropDownList, reverseCharge);
                                          }

                                          return acc;
                                        }, { rcmDropDownList: [] });

                                        setFilterDropDownList(updatedFilterDropDownList);

                                      } else if (hot?.getSelected()[0][1] == 5 || hot?.getSelected()[0][1] == 6 || hot?.getSelected()[0][1] == 7) {

                                        var columnName = colName[currentCol1]?.data;
                                        var valueRange = '';

                                        hot?.getSelected()[0][1] == 5 && setFromAmount('');
                                        hot?.getSelected()[0][1] == 5 && setToAmount('');
                                        hot?.getSelected()[0][1] == 6 && setFromValue('');
                                        hot?.getSelected()[0][1] == 6 && setToValue('');
                                        hot?.getSelected()[0][1] == 7 && setFromTax('');
                                        hot?.getSelected()[0][1] == 7 && setToTax('');
                                        // let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                                        // filterObject.push(valueRange);

                                        var value = '';

                                      } else {

                                        var value = '';
                                      }

                                      const x = searchVal1;
                                      if (!searchVal1?.length) {
                                        x.push(value);
                                        let y = currentCol;
                                        if (
                                          invoceTypes?.value == "2" ||
                                          invoceTypes?.value == "4" ||
                                          invoceTypes?.value == "12"
                                        ) {
                                          y.push(
                                            ammentmentInvalidColumns[
                                              currentCol1
                                            ]?.data
                                          );
                                        } else {
                                          y.push(
                                            invalidColumns[currentCol1]?.data
                                          );
                                        }

                                        setSearchVal1(x);
                                        setCurrentCol(y);
                                      } else {
                                        if (
                                          invoceTypes?.value == "2" ||
                                          invoceTypes?.value == "4" ||
                                          invoceTypes?.value == "12"
                                        ) {
                                          const Index = currentCol?.findIndex(
                                            (item) =>
                                              ammentmentInvalidColumns[
                                                currentCol1
                                              ]?.data == item
                                          );
                                          if (Index != -1) {
                                            const xyz = searchVal1;
                                            xyz[Index] = value;
                                            setSearchVal1(xyz);
                                          } else {
                                            x.push(value);
                                            let y = currentCol;
                                            // if((invoceTypes?.value =="2" || invoceTypes?.value =="4" || invoceTypes?.value =="12")){
                                            y.push(
                                              ammentmentInvalidColumns[
                                                currentCol1
                                              ]?.data
                                            );

                                            setSearchVal1(x);
                                            setCurrentCol(y);
                                          }
                                        } else {
                                          const Index = currentCol?.findIndex(
                                            (item) =>
                                              invalidColumns[currentCol1]
                                                ?.data == item
                                          );
                                          if (Index != -1) {
                                            const xyz = searchVal1;
                                            xyz[Index] = value;
                                            setSearchVal1(xyz);
                                          } else {
                                            x.push(value);
                                            let y = currentCol;

                                            y.push(
                                              invalidColumns[currentCol1]
                                                ?.data
                                            );

                                            setSearchVal1(x);
                                            setCurrentCol(y);
                                          }
                                        }

                                      }

                                      const invType =
                                        count == 1 ? url : invoceTypes?.value;
                                      setPage(0);
                                      purchaseSummaryList(
                                        activeTab,
                                        "",
                                        "",
                                        invType,
                                        finFromYear?.value,
                                        monthFrom?.value,
                                        ""
                                      );

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
                            const element = document.querySelector(".htMenu.htDropdownMenu.handsontable");
                            element.style.top = "0px";
                          }}
                          afterFilter={function (data, coords) {
                            const hot = hotRef?.current?.hotInstance;
                            var colName;
                            if (
                              invoceTypes?.value == "2" ||
                              invoceTypes?.value == "4" ||
                              invoceTypes?.value == "12"
                            ) {
                              colName = ammentmentInvalidColumns
                            } else {
                              colName = invalidColumns
                            }
                            if (hot?.getSelected()[0][1] == 4) {

                              var searchInput1 = document.getElementById("custom1");
                              var searchInput2 = document.getElementById("custom2");
                              const invFromDate = searchInput1?.value
                              const invToDate = searchInput2?.value
                              var columnName = colName[currentCol1]?.data;
                              var valueDate = (searchInput1?.value || searchInput2?.value) && `${invFromDate ? invFromDate : invToDate}to${invToDate ? invToDate : invFromDate}`;
                              setSearchDate(searchInput1?.value);
                              setToDate(searchInput2?.value);

                              var value = valueDate;
                            } else if (hot?.getSelected()?.[0]?.[1] == 8) {

                              var checkboxes = document.getElementsByClassName('checkBoxClass');
                              arrChk = []
                              setFilterDropDownList([]);
                              var columnName = colName[currentCol1]?.data;
                              let filterObject = !gridCustomFilter ? [] : gridCustomFilter

                              filterObject = filterObject == null || filterObject.length <= 0 ? [] : filterObject;

                              for (let i = 0; i < checkboxes.length; i++) {
                                if (checkboxes[i].checked) {

                                  arrChk.push({ [columnName]: checkboxes[i].value });

                                  filterObject?.push(checkboxes[i].value);
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


                              var value = filterObject?.join('@#@#');

                              const updatedFilterDropDownList = arrChk.reduce((acc, item) => {
                                const { reverseCharge } = item;

                                const updateList = (list, value) => {
                                  return list.includes(value) ? list : [...list, value];
                                };

                                if (reverseCharge !== undefined) {
                                  acc.rcmDropDownList = updateList(acc.rcmDropDownList, reverseCharge);
                                }

                                return acc;
                              }, { rcmDropDownList: [] });

                              setFilterDropDownList(updatedFilterDropDownList);

                            } else if (hot?.getSelected()[0][1] == 5 || hot?.getSelected()[0][1] == 6 || hot?.getSelected()[0][1] == 7) {

                              var searchInput1 = document.getElementById("amount1");
                              var searchInput2 = document.getElementById("amount2");
                              const invFromDate = (searchInput1?.value)?.replaceAll(",", "")
                              const invToDate = (searchInput2?.value)?.replaceAll(",", "")
                              var columnName = colName[currentCol1]?.data;
                              var valueRange = `${invFromDate}to${invToDate}`;

                              hot?.getSelected()[0][1] == 5 && setFromAmount(searchInput1?.value);
                              hot?.getSelected()[0][1] == 5 && setToAmount(searchInput2?.value);
                              hot?.getSelected()[0][1] == 6 && setFromValue(searchInput1?.value);
                              hot?.getSelected()[0][1] == 6 && setToValue(searchInput2?.value);
                              hot?.getSelected()[0][1] == 7 && setFromTax(searchInput1?.value);
                              hot?.getSelected()[0][1] == 7 && setToTax(searchInput2?.value);

                              var value = valueRange;

                            } else {

                              var searchInput = document.querySelector(
                                ".htUIMultipleSelectSearch.htUIInput"
                              );
                              var value = searchInput?.children[0]?.value;
                            }

                            const x = searchVal1;
                            if (!searchVal1?.length) {
                              x.push(value);
                              let y = currentCol;
                              // y.push(invalidColumns[currentCol1]?.data);
                              if (
                                invoceTypes?.value == "2" ||
                                invoceTypes?.value == "4" ||
                                invoceTypes?.value == "12"
                              ) {
                                y.push(
                                  ammentmentInvalidColumns[currentCol1]?.data
                                );
                              } else {
                                y.push(invalidColumns[currentCol1]?.data);
                              }

                              setSearchVal1(x);
                              setCurrentCol(y);
                            } else {
                              // const Index = currentCol?.findIndex((item) => invalidColumns[currentCol1]?.data == item);
                              if (
                                invoceTypes?.value == "2" ||
                                invoceTypes?.value == "4" ||
                                invoceTypes?.value == "12"
                              ) {
                                const Index = currentCol?.findIndex(
                                  (item) =>
                                    ammentmentInvalidColumns[currentCol1]
                                      ?.data == item
                                );
                                if (Index != -1) {
                                  const xyz = searchVal1;
                                  xyz[Index] = value;
                                  setSearchVal1(xyz);
                                } else {
                                  x.push(value);
                                  let y = currentCol;
                                  // if((invoceTypes?.value =="2" || invoceTypes?.value =="4" || invoceTypes?.value =="12")){
                                  y.push(
                                    ammentmentInvalidColumns[currentCol1]
                                      ?.data
                                  );


                                  setSearchVal1(x);
                                  setCurrentCol(y);
                                }
                              } else {
                                const Index = currentCol?.findIndex(
                                  (item) =>
                                    invalidColumns[currentCol1]?.data == item
                                );
                                if (Index != -1) {
                                  const xyz = searchVal1;
                                  xyz[Index] = value;
                                  setSearchVal1(xyz);
                                } else {
                                  x.push(value);
                                  let y = currentCol;

                                  y.push(invalidColumns[currentCol1]?.data);

                                  setSearchVal1(x);
                                  setCurrentCol(y);
                                }
                              }
                            }

                            const invType =
                              count == 1 ? url : invoceTypes?.value;
                            console.log(invType, "invTypeserach");
                            setPage(0);
                            purchaseSummaryList(
                              activeTab,
                              "",
                              "",
                              invType,
                              finFromYear?.value,
                              monthFrom?.value,
                              "",
                              1
                            );
                          }}
                          autoColumnSize={true}
                          stretchH="all"
                          data={purchaseData.length > 0 ? purchaseData : [{ recipientGSTIN: "No Data Found!" }]}
                          mergeCells={[purchaseData.length > 0 ? false :
                            { row: 0, col: 1, rowspan: 1, colspan: 8 },
                          ]}
                          columns={
                            purchaseData.length > 0 ? (invoceTypes?.value == "2" ||
                              invoceTypes?.value == "4" ||
                              invoceTypes?.value == "12"
                              ? ammentmentInvalidColumns
                              : invalidColumns) : (invoceTypes?.value == "2" ||
                                invoceTypes?.value == "4" ||
                                invoceTypes?.value == "12"
                                ? ammentmentInvalidColumnsEmpty
                                : invalidColumnsEmpty)
                          }
                          afterGetColHeader={theader}
                          colHeaders={colHeaders}
                          rowHeaders={false}
                          filters={true}
                          hiddenColumns={{
                            columns: [10],
                          }}
                          bindRowsWithHeaders={false}
                          licenseKey="non-commercial-and-evaluation"
                          afterOnCellMouseDown={localAfterOnCellMouseDown}
                          selectionMode="range"
                          height="auto"
                          // mergeCells={false}
                          cells={function (row, col) {
                            var cp = {};
                            const hot = hotRef?.current?.hotInstance;
                            if (purchaseData?.length > 0 && col == 1 || col == 2 || col == 3 || col == 4) {
                              cp.className = "text-danger myRow";
                            }
                            if (!purchaseData?.length > 0 && col == 1) {
                              cp.className = "text-center";

                            }
                            if (col == 5 || col == 6 || col == 7) {
                              cp.className = "text-end";
                            }
                            return cp;
                          }}
                        />}
                        {customPagination()}
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </TabPane>

            {/* Credit Debit Note Table */}
            <TabPane tabId="2" key="2">
              <TabPane tabId="1" key="1">
                <Card>
                  <CardBody className="CardBody p-0">
                    <Row className="p-1">
                      <Col md={8}>
                      <UILoader blocking={blockTable} color="secondary"  overlayColor='rgba(255,255,255, .5)'>
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
                        </ UILoader>
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
                              //  isMulti
                              options={crdrInvoiceTypeList}
                              className="basic-multi-select"
                              classNamePrefix="select"
                              onChange={crdrFilterInvoiceType}
                              value={crdrInvoiceType}
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
                              isDisabled={true}
                              closeMenuOnSelect={true}
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
                <CardBody className="CardBody p-0">
                  <Row>
                    <Col sm="12">
                      <div>
                        {/* {purchaseData?.length ? ( */}
                        {activeTab == 2 && <HotTable
                          rowHeights={RowSize}
                          columnHeaderHeight={columnHeaderSize}
                          autoWrapRow={true}
                          ref={hotRefCrdrVendor}
                          columnSorting={true}
                          // afterColumnSort={ServerSideSorting}
                          beforeSetRangeStart={localBeforeSetRangeStart}
                          dropdownMenu={{
                            items: {
                              filter_by_value: {
                                name: "Search Value",

                                hidden() {
                                  const selectedValue = this.getSelected()[0][1];
                                  const isValidColumn = [4, 5, 6, 7, 8, 9].includes(selectedValue);

                                  return isValidColumn;
                                },
                              },

                              about: { // Own custom option

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
                              option5: createOptionMinMax(fromAmount, toAmount, 5),
                              option6: createOptionMinMax(fromValue, toValue, 6),
                              option7: createOptionMinMax(fromTax, toTax, 7),
                              option4: {

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

                                      const x = searchValcrdr;
                                      let cdrnNewCol = null

                                      if (crdrInvoiceType?.value == "8" ||
                                        crdrInvoiceType?.value == "10") {
                                        cdrnNewCol = ammendentcrDrInvalidColumns
                                      } else {
                                        cdrnNewCol = crDrInvalidColumns
                                      }

                                      if (hot?.getSelected()[0][1] == 4) {

                                        var columnName = cdrnNewCol[currentCol1crdr]?.data;
                                        var valueDate = '';
                                        setSearchDate('');
                                        setToDate('');

                                        var value = valueDate;
                                      } else if (hot?.getSelected()?.[0]?.[1] == 8 || hot?.getSelected()?.[0]?.[1] == 9) {

                                        var checkboxes = document.getElementsByClassName('checkBoxClass');

                                        setFilterDropDownList([]);
                                        var columnName = cdrnNewCol[currentCol1crdr]?.data;
                                        let filterObject = []
                                        let chkFilterObject = !gridCustomFilter ? [] : gridCustomFilter

                                        chkFilterObject = chkFilterObject == null || chkFilterObject.length <= 0 ? [] : chkFilterObject;


                                        for (let i = 0; i < checkboxes.length; i++) {
                                          if (checkboxes[i].checked) {


                                            let uniqueArraychk = chkFilterObject.filter((obj, index, self) =>
                                              index === self.findIndex((t) => (
                                                JSON.stringify(t) === JSON.stringify(obj)
                                              ))
                                            );
                                            chkFilterObject = uniqueArraychk
                                            const indexchk = chkFilterObject.findIndex(obj => obj[columnName] === checkboxes[i].value);
                                            const index = filterObject.findIndex(obj => obj[columnName] === checkboxes[i].value);
                                            if (index !== -1 || indexchk !== -1) {

                                              delete chkFilterObject[indexchk][columnName];
                                            }
                                          }
                                        }

                                        setGridCustomFilter(chkFilterObject)
                                        var value = filterObject?.join('@#@#');

                                        const updatedFilterDropDownList = chkFilterObject.reduce((acc, item) => {

                                          const { reverseCharge, noteType } = item;

                                          const updateList = (list, value) => {
                                            return list.includes(value) ? list : [...list, value];
                                          };

                                          if (reverseCharge !== undefined) {
                                            acc.rcmDropDownList = updateList(acc.rcmDropDownList, reverseCharge);
                                          } else if (noteType !== undefined) {
                                            acc.noteTypeDropDownList = updateList(acc.noteTypeDropDownList, noteType);
                                          }

                                          return acc;
                                        }, { rcmDropDownList: [], noteTypeDropDownList: [] });

                                        setFilterDropDownList(updatedFilterDropDownList);

                                      } else if (hot?.getSelected()[0][1] == 5 || hot?.getSelected()[0][1] == 6 || hot?.getSelected()[0][1] == 7) {

                                        var columnName = cdrnNewCol[currentCol1crdr]?.data;
                                        var valueRange = '';

                                        hot?.getSelected()[0][1] == 5 && setFromAmount('');
                                        hot?.getSelected()[0][1] == 5 && setToAmount('');
                                        hot?.getSelected()[0][1] == 6 && setFromValue('');
                                        hot?.getSelected()[0][1] == 6 && setToValue('');
                                        hot?.getSelected()[0][1] == 7 && setFromTax('');
                                        hot?.getSelected()[0][1] == 7 && setToTax('');

                                        var value = valueRange;

                                      } else {

                                        var value = '';
                                      }

                                      if (!searchValcrdr?.length) {
                                        x.push(value);
                                        let y = currentColcrdr;

                                        y.push(
                                          cdrnNewCol[currentCol1crdr]
                                            ?.data
                                        );
                                        setSearchValcrdr(x);
                                        setCurrentColcrdr(y);
                                      } else {
                                        const Index =
                                          currentColcrdr?.findIndex(
                                            (item) =>
                                              cdrnNewCol[
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
                                            cdrnNewCol[
                                              currentCol1crdr
                                            ]?.data
                                          );

                                          setSearchValcrdr(x);
                                          setCurrentColcrdr(y);
                                        }
                                      }

                                      const invType =
                                        count == 1
                                          ? url
                                          : crdrInvoiceType?.value;
                                      setPage(0);
                                      purchaseSummaryList(
                                        activeTab,
                                        "",
                                        "",
                                        invType,
                                        finFromYear?.value,
                                        monthFrom?.value,
                                        ""
                                      );

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
                              rcmDropDownList, noteTypeDropDownList
                            } = filterDropDownList;

                            const listsToCheck = [
                              rcmDropDownList, noteTypeDropDownList
                            ];

                            for (var j = 0; j < checkboxes.length; j++) {

                              for (var k = 0; k < listsToCheck.length; k++) {
                                if (listsToCheck[k]) {

                                  // For rcmDropDownList, check both conditions listsToCheck[k][i] == checkboxes[j].value and checkboxes?.length == 2

                                  for (var i = 0; i < listsToCheck[k].length; i++) {
                                    if (listsToCheck[k][i] == checkboxes[j].value) {
                                      $(checkboxes[j]).prop("checked", true);
                                      break;
                                    }
                                  }

                                }
                              }
                            }

                            const element = document.querySelector(".htMenu.htDropdownMenu.handsontable");
                            element.style.top = "0px";

                          }}
                          afterFilter={function (data, coords) {
                            const hot =
                              hotRefCrdrVendor?.current?.hotInstance;
                            let cdrnNewCol = null

                            if (crdrInvoiceType?.value == "8" ||
                              crdrInvoiceType?.value == "10") {
                              cdrnNewCol = ammendentcrDrInvalidColumns
                            } else {
                              cdrnNewCol = crDrInvalidColumns
                            }
                            if (hot?.getSelected()[0][1] == 4) {

                              var searchInput1 = document.getElementById("custom1");
                              var searchInput2 = document.getElementById("custom2");
                              const invFromDate = searchInput1?.value
                              const invToDate = searchInput2?.value
                              var columnName = cdrnNewCol[currentCol1crdr]?.data;
                              var valueDate = (searchInput1?.value || searchInput2?.value) && `${invFromDate ? invFromDate : invToDate}to${invToDate ? invToDate : invFromDate}`;
                              setSearchDate(searchInput1?.value);
                              setToDate(searchInput2?.value);

                              var value = valueDate;
                            } else if (hot?.getSelected()?.[0]?.[1] == 8 || hot?.getSelected()?.[0]?.[1] == 9) {

                              var checkboxes = document.getElementsByClassName('checkBoxClass');

                              setFilterDropDownList([]);
                              var columnName = cdrnNewCol[currentCol1crdr]?.data;
                              let filterObject = []
                              let chkFilterObject = !gridCustomFilter ? [] : gridCustomFilter

                              chkFilterObject = chkFilterObject == null || chkFilterObject.length <= 0 ? [] : chkFilterObject;


                              // for (let i = 0; i < checkboxes.length; i++) {
                              //   if (checkboxes[i].checked) {

                              //     filterObject?.push(checkboxes[i].value);
                              //     chkFilterObject?.push({ [columnName]: checkboxes[i].value });

                              //   } else {

                              //     let uniqueArray = filterObject.filter((obj, index, self) =>
                              //       index === self.findIndex((t) => (
                              //         JSON.stringify(t) === JSON.stringify(obj)
                              //       ))
                              //     );
                              //     filterObject = uniqueArray
                              //     const index = filterObject.findIndex(obj => obj[columnName] === checkboxes[i].value);
                              //     if (index !== -1) {

                              //       delete filterObject[index][columnName];
                              //     }
                              //   }
                              // }
                              for (let i = 0; i < checkboxes.length; i++) {
                                if (checkboxes[i].checked) {

                                  filterObject?.push(checkboxes[i].value);
                                  chkFilterObject?.push({ [columnName]: checkboxes[i].value });

                                } else {

                                  let uniqueArray = filterObject.filter((obj, index, self) =>
                                    index === self.findIndex((t) => (
                                      JSON.stringify(t) === JSON.stringify(obj)
                                    ))
                                  );
                                  let uniqueArraychk = chkFilterObject.filter((obj, index, self) =>
                                    index === self.findIndex((t) => (
                                      JSON.stringify(t) === JSON.stringify(obj)
                                    ))
                                  );
                                  chkFilterObject = uniqueArraychk
                                  const indexchk = chkFilterObject.findIndex(obj => obj[columnName] === checkboxes[i].value);
                                  const index = filterObject.findIndex(obj => obj[columnName] === checkboxes[i].value);
                                  if (index !== -1 || indexchk !== -1) {

                                    delete chkFilterObject[indexchk][columnName];
                                  }
                                }
                              }

                              setGridCustomFilter(chkFilterObject)
                              var value = filterObject?.join('@#@#');

                              const updatedFilterDropDownList = chkFilterObject.reduce((acc, item) => {

                                const { reverseCharge, noteType } = item;

                                const updateList = (list, value) => {
                                  return list.includes(value) ? list : [...list, value];
                                };

                                if (reverseCharge !== undefined) {
                                  acc.rcmDropDownList = updateList(acc.rcmDropDownList, reverseCharge);
                                } else if (noteType !== undefined) {
                                  acc.noteTypeDropDownList = updateList(acc.noteTypeDropDownList, noteType);
                                }

                                return acc;
                              }, { rcmDropDownList: [], noteTypeDropDownList: [] });

                              setFilterDropDownList(updatedFilterDropDownList);

                            } else if (hot?.getSelected()[0][1] == 5 || hot?.getSelected()[0][1] == 6 || hot?.getSelected()[0][1] == 7) {

                              var searchInput1 = document.getElementById("amount1");
                              var searchInput2 = document.getElementById("amount2");
                              const invFromDate = (searchInput1?.value)?.replaceAll(",", "")
                              const invToDate = (searchInput2?.value)?.replaceAll(",", "")
                              var columnName = cdrnNewCol[currentCol1crdr]?.data;
                              var valueRange = `${invFromDate}to${invToDate}`;

                              hot?.getSelected()[0][1] == 5 && setFromAmount(searchInput1?.value);
                              hot?.getSelected()[0][1] == 5 && setToAmount(searchInput2?.value);
                              hot?.getSelected()[0][1] == 6 && setFromValue(searchInput1?.value);
                              hot?.getSelected()[0][1] == 6 && setToValue(searchInput2?.value);
                              hot?.getSelected()[0][1] == 7 && setFromTax(searchInput1?.value);
                              hot?.getSelected()[0][1] == 7 && setToTax(searchInput2?.value);

                              var value = valueRange;

                            } else {

                              var searchInput = document.querySelector(
                                ".htUIMultipleSelectSearch.htUIInput"
                              );
                              var value = searchInput?.children[0]?.value;
                            }

                            const x = searchValcrdr;


                            if (!searchValcrdr?.length) {
                              x.push(value);
                              let y = currentColcrdr;

                              y.push(cdrnNewCol[currentCol1crdr]?.data);

                              setSearchValcrdr(x);
                              setCurrentColcrdr(y);
                            } else {
                              const Index = currentColcrdr?.findIndex(
                                (item) =>
                                  cdrnNewCol[currentCol1crdr]?.data ==
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
                                  cdrnNewCol[currentCol1crdr]?.data
                                );

                                setSearchValcrdr(x);
                                setCurrentColcrdr(y);
                              }
                            }

                            const invType =
                              count == 1 ? url : crdrInvoiceType?.value;
                            setPage(0);
                            purchaseSummaryList(
                              activeTab,
                              "",
                              "",
                              invType,
                              finFromYear?.value,
                              monthFrom?.value,
                              "",
                              1
                            );
                          }}
                          autoColumnSize={true}
                          stretchH="all"
                          data={purchaseData.length > 0 ? purchaseData : [{ recipientGSTIN: "No Data Found!" }]}
                          // columns={crDrInvalidColumns}
                          columns={
                            purchaseData.length > 0 ? (crdrInvoiceType?.value == "8" ||
                              crdrInvoiceType?.value == "10"
                              ? ammendentcrDrInvalidColumns
                              : crDrInvalidColumns) : (crdrInvoiceType?.value == "8" ||
                                crdrInvoiceType?.value == "10"
                                ? ammendentcrDrInvalidColumnsEmpty
                                : crDrInvalidColumnsEmpty)
                          }
                          afterGetColHeader={theader}
                          colHeaders={colHeaders}
                          rowHeaders={false}
                          filters={true}
                          hiddenColumns={{
                            columns: [10],
                          }}
                          bindRowsWithHeaders={false}
                          licenseKey="non-commercial-and-evaluation"
                          afterOnCellMouseDown={CrDrlocalAfterOnCellMouseDown}
                          selectionMode="range"
                          mergeCells={[purchaseData.length > 0 ? false :
                            { row: 0, col: 1, rowspan: 1, colspan: 9 },
                          ]}
                          height="auto"
                          cells={function (row, col) {
                            var cp = {};
                            const hot =
                              hotRefCrdrVendor?.current?.hotInstance;
                            if (purchaseData?.length > 0 && col == 1 || col == 2) {
                              cp.className = "text-danger myRow";
                            }
                            if (!purchaseData?.length > 0 && col == 1) {
                              cp.className = "text-center";

                            }
                            if (col == 5 || col == 6 || col == 7) {
                              cp.className = "text-end";
                            }
                            return cp;
                          }}
                        />}

                        {customPagination()}

                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </TabPane>
            </TabPane>

            {/* B2CS/B2CSA */}
            <TabPane tabId="7" key="7">
              <Card>
                <CardBody className="CardBody p-0">
                  <Row className="p-1">
                    <Col md={8}>
                    <UILoader blocking={blockTable} color="secondary"  overlayColor='rgba(255,255,255, .5)'>
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
                      </UILoader>
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
                            value={b2csInvoiceType}
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
              <div>
                <h2 className="mt-2 mb-1">Summary</h2>
              </div>
              <Card>
                <CardBody className="CardBody p-0">
                  <div
                    className=""
                    style={{
                      maxHeight: "250px",
                      overflowY: "auto",
                      overflowX: "hidden",
                    }}
                  >
                    <Row>
                      <Col sm="12">
                        <div>
                          {b2csData?.length ? (
                            <HotTable
                              rowHeights={RowSize}
                              columnHeaderHeight={columnHeaderSize}
                              id="hotRefB2cs_Id"
                              ref={hotRefB2cs}
                              // height="250"
                              fixedRowsTop={0}
                              autoWrapRow={true}
                              columnSorting={true}
                              autoColumnSize={true}
                              stretchH="all"
                              data={b2csData ? b2csData : []}
                              columns={b2csColumns}
                              //afterGetColHeader={theader}
                              colHeaders={colHeaders}
                              rowHeaders={false}
                              filters={false}
                              overflow={"auto"}
                              bindRowsWithHeaders={false}
                              licenseKey="non-commercial-and-evaluation"
                              // afterOnCellMouseDown={localAfterOnCellMouseDown}
                              selectionMode="range"
                              mergeCells={false}
                              afterGetColHeader={theader1}
                              cells={function (row, col) {
                                var cp = {};
                                const hot = hotRefB2cs?.current?.hotInstance;
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
                            />
                          ) : (
                            <HotTable
                              rowHeights={RowSize}
                              columnHeaderHeight={columnHeaderSize}
                              id="hotRefB2cs_Id"
                              ref={hotRefB2cs}
                              autoColumnSize={true}
                              stretchH="all"
                              rowHeaders={false}
                              autoWrapRow={true}
                              // ref={hotRef}
                              height="auto"
                              style={{
                                textAlign: "center",
                                overflowX: "hidden",
                              }}
                              data={[{ supplyType: "No Data Found!" }]}
                              afterGetColHeader={theader1}
                              mergeCells={[
                                { row: 0, col: 0, rowspan: 1, colspan: 8 },
                              ]}
                              preventOverflow="horizontal"
                              colHeaders={colHeaders}
                              columns={b2csColumns}
                              filters={false}
                              licenseKey="non-commercial-and-evaluation"
                              // afterOnCellMouseDown={localAfterOnCellMouseDown}
                              selectionMode="range"
                            />
                          )}
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
                        {/* {purchaseData?.length ? ( */}
                        {activeTab == 7 && <HotTable
                          rowHeights={RowSize}
                          columnHeaderHeight={columnHeaderSize}
                          id="hotRefB2csInvoice1"
                          autoWrapRow={true}
                          ref={hotRefB2csInv}

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
                              about: { // Own custom option

                                name: `<div  style=${checkboxFilterCss}>${checkBoxTitle}<label class="float-end text-danger "><a><u id="selectAll">Select All</u></a></label></div> <div  class="checkboxmenu custom-scrollbar"> <div >  <table id="searchTable" >
                                  ${dropDonwName &&
                                  dropDonwName?.map((index) => (
                                    `<tr><td><input class="checkBoxClass" type="checkbox" value="${index?.value}" /> <span class="fw-normal">${index?.label?.length > 20 ? index?.label?.substring(0, 20) + "..." : index?.label}</span> </td></tr>`
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
                              option4: createOptionMinMax(fromAmount, toAmount, 4),
                              option5: createOptionMinMax(fromValue, toValue, 5),
                              option6: createOptionMinMax(fromTax, toTax, 6),
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
                                    if (clickEvent.target.id == "btnClear") {
                                      //** start
                                      const hot =
                                        hotRefB2csInv?.current?.hotInstance;

                                      if (hot?.getSelected()[0][1] == 3) {


                                        var columnName = B2CsInvalidColumns[currentCol1]?.data;
                                        var valueDate = '';
                                        setSearchDate('');
                                        setToDate('');

                                        var value = valueDate;
                                      } else if (hot?.getSelected()?.[0]?.[1] == 7) {

                                        var checkboxes = document.getElementsByClassName('checkBoxClass');

                                        setFilterDropDownList([]);
                                        var columnName = B2CsInvalidColumns[currentCol1]?.data;
                                        let filterObject = !gridCustomFilter ? [] : gridCustomFilter
                                        arrChk = []
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

                                        var value = filterObject?.join('@#@#');

                                        const updatedFilterDropDownList = arrChk.reduce((acc, item) => {

                                          const { reverseCharge } = item;

                                          const updateList = (list, value) => {
                                            return list.includes(value) ? list : [...list, value];
                                          };

                                          if (reverseCharge !== undefined) {
                                            acc.rcmDropDownList = updateList(acc.rcmDropDownList, reverseCharge);
                                          }

                                          return acc;
                                        }, { rcmDropDownList: [] });

                                        setFilterDropDownList(updatedFilterDropDownList);

                                      } else if (hot?.getSelected()[0][1] == 4 || hot?.getSelected()[0][1] == 5 || hot?.getSelected()[0][1] == 6) {


                                        var columnName = B2CsInvalidColumns[currentCol1]?.data;
                                        var valueRange = '';

                                        hot?.getSelected()[0][1] == 4 && setFromAmount('');
                                        hot?.getSelected()[0][1] == 4 && setToAmount('');
                                        hot?.getSelected()[0][1] == 5 && setFromValue('');
                                        hot?.getSelected()[0][1] == 5 && setToValue('');
                                        hot?.getSelected()[0][1] == 6 && setFromTax('');
                                        hot?.getSelected()[0][1] == 6 && setToTax('');

                                        var value = valueRange;

                                      } else {

                                        var value = '';
                                      }

                                      const x = searchVal1;
                                      if (!searchVal1?.length) {
                                        x.push(value);
                                        let y = currentCol;
                                        y.push(
                                          B2CsInvalidColumns[currentCol1]
                                            ?.data
                                        );

                                        setSearchVal1(x);
                                        setCurrentCol(y);
                                      } else {
                                        const Index = currentCol?.findIndex(
                                          (item) =>
                                            B2CsInvalidColumns[currentCol1]
                                              ?.data == item
                                        );

                                        if (Index != -1) {
                                          const xyz = searchVal1;
                                          xyz[Index] = value;
                                          setSearchVal1(xyz);
                                        } else {
                                          x.push(value);
                                          let y = currentCol;
                                          y.push(
                                            B2CsInvalidColumns[currentCol1]
                                              ?.data
                                          );

                                          setSearchVal1(x);
                                          setCurrentCol(y);
                                        }
                                      }

                                      const invType =
                                        count == 1
                                          ? url
                                          : b2csInvoiceType?.value;
                                      setPage(0);
                                      purchaseSummaryList(
                                        activeTab,
                                        "",
                                        "",
                                        invType,
                                        finFromYear?.value,
                                        monthFrom?.value,
                                        ""
                                      );

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
                              rcmDropDownList
                            } = filterDropDownList;

                            const listsToCheck = [
                              rcmDropDownList
                            ];

                            console.log(filterDropDownList, 'filterDropDownList')
                            for (var j = 0; j < checkboxes.length; j++) {

                              for (var k = 0; k < listsToCheck.length; k++) {
                                if (listsToCheck[k]) {

                                  // For rcmDropDownList, check both conditions listsToCheck[k][i] == checkboxes[j].value and checkboxes?.length == 2

                                  for (var i = 0; i < listsToCheck[k].length; i++) {
                                    if (listsToCheck[k][i] == checkboxes[j].value) {
                                      $(checkboxes[j]).prop("checked", true);
                                      break;
                                    }
                                  }

                                }
                              }
                            }
                            console.log("COMING on open")
                            // const elementTable = document.getElementById("hotRefB2csInvoice1");
                            // elementTable.style.height = "200px";
                            // const element = document.querySelector("#hotRefB2csInvoice1.handsontable.htColumnHeaders");
                            // element.style.height = "200px";

                            const element = document.querySelector(".htMenu.htDropdownMenu.handsontable");
                            element.style.top = "0px";
                          }}
                          afterDropdownMenuHide={function () {
                            // const elementTable = document.getElementById("hotRefB2csInvoice1");
                            // const tableHeight = document.querySelector("#hotRefB2csInvoice1 table")
                            // const contentHeight = tableHeight.scrollHeight;
                            // elementTable.style.height = contentHeight + "px";
                            // console.log("COMING on close", elementTable);




                            // const element = document.querySelector("#hotRefB2csInvoice1.handsontable.htColumnHeaders");
                            // element.style.height = "auto"
                          }}
                          afterFilter={function (data, coords) {
                            const hot = hotRefB2csInv?.current?.hotInstance;
                            // if (hot?.getSelected()[0][1] != 3) {
                            //   var searchInput = document.querySelector(
                            //     ".htUIMultipleSelectSearch.htUIInput"
                            //   );
                            //   var value = searchInput?.children[0]?.value;
                            // } else {
                            //   var searchInput1 =
                            //     document.getElementById("custom3");
                            //   var value = searchInput1.value;
                            //   setSearchDate(value);
                            // }
                            if (hot?.getSelected()[0][1] == 3) {

                              var searchInput1 = document.getElementById("custom1");
                              var searchInput2 = document.getElementById("custom2");
                              const invFromDate = searchInput1?.value
                              const invToDate = searchInput2?.value
                              var columnName = B2CsInvalidColumns[currentCol1]?.data;
                              var valueDate = (searchInput1?.value || searchInput2?.value) && `${invFromDate ? invFromDate : invToDate}to${invToDate ? invToDate : invFromDate}`;
                              setSearchDate(searchInput1?.value);
                              setToDate(searchInput2?.value);

                              var value = valueDate;
                            } else if (hot?.getSelected()?.[0]?.[1] == 7) {

                              var checkboxes = document.getElementsByClassName('checkBoxClass');

                              setFilterDropDownList([]);
                              var columnName = B2CsInvalidColumns[currentCol1]?.data;
                              arrChk = []
                              let filterObject = !gridCustomFilter ? [] : gridCustomFilter

                              filterObject = filterObject == null || filterObject.length <= 0 ? [] : filterObject;

                              for (let i = 0; i < checkboxes.length; i++) {
                                if (checkboxes[i].checked) {

                                  arrChk.push({ [columnName]: checkboxes[i].value });

                                  filterObject?.push(checkboxes[i].value);
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

                              var value = filterObject?.join('@#@#');

                              const updatedFilterDropDownList = arrChk.reduce((acc, item) => {

                                const { reverseCharge } = item;

                                const updateList = (list, value) => {
                                  return list.includes(value) ? list : [...list, value];
                                };

                                if (reverseCharge !== undefined) {
                                  acc.rcmDropDownList = updateList(acc.rcmDropDownList, reverseCharge);
                                }

                                return acc;
                              }, { rcmDropDownList: [] });

                              setFilterDropDownList(updatedFilterDropDownList);

                            } else if (hot?.getSelected()[0][1] == 4 || hot?.getSelected()[0][1] == 5 || hot?.getSelected()[0][1] == 6) {

                              var searchInput1 = document.getElementById("amount1");
                              var searchInput2 = document.getElementById("amount2");
                              const invFromDate = (searchInput1?.value)?.replaceAll(",", "")
                              const invToDate = (searchInput2?.value)?.replaceAll(",", "")
                              var columnName = B2CsInvalidColumns[currentCol1]?.data;
                              var valueRange = `${invFromDate}to${invToDate}`;

                              hot?.getSelected()[0][1] == 4 && setFromAmount(searchInput1?.value);
                              hot?.getSelected()[0][1] == 4 && setToAmount(searchInput2?.value);
                              hot?.getSelected()[0][1] == 5 && setFromValue(searchInput1?.value);
                              hot?.getSelected()[0][1] == 5 && setToValue(searchInput2?.value);
                              hot?.getSelected()[0][1] == 6 && setFromTax(searchInput1?.value);
                              hot?.getSelected()[0][1] == 6 && setToTax(searchInput2?.value);

                              var value = valueRange;

                            } else {

                              var searchInput = document.querySelector(
                                ".htUIMultipleSelectSearch.htUIInput"
                              );
                              var value = searchInput?.children[0]?.value;
                            }

                            const x = searchVal1;
                            if (!searchVal1?.length) {
                              x.push(value);
                              let y = currentCol;
                              y.push(B2CsInvalidColumns[currentCol1]?.data);

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
                                y.push(B2CsInvalidColumns[currentCol1]?.data);

                                setSearchVal1(x);
                                setCurrentCol(y);
                              }
                            }

                            const invType =
                              count == 1 ? url : b2csInvoiceType?.value;
                            console.log(invType, "invTypeserach");
                            setPage(0);
                            purchaseSummaryList(
                              activeTab,
                              "",
                              "",
                              invType,
                              finFromYear?.value,
                              monthFrom?.value,
                              "",
                              1
                            );
                          }}
                          autoColumnSize={true}
                          stretchH="all"
                          height={"auto"}
                          // data={purchaseData ? purchaseData : []}
                          data={purchaseData.length > 0 ? purchaseData : [{ receiverName: "No Data Found!" }]}
                          mergeCells={purchaseData.length > 0 ? false :
                            [{ row: 0, col: 1, rowspan: 1, colspan: 7 }]
                          }
                          columns={purchaseData.length > 0 ? B2CsInvalidColumns : B2CsInvalidColumnsEmpty}
                          afterGetColHeader={theader}
                          colHeaders={colHeaders}
                          contextMenu={true}
                          rowHeaders={false}
                          filters={true}
                          // hiddenColumns={false}
                          bindRowsWithHeaders={false}
                          licenseKey="non-commercial-and-evaluation"
                          afterOnCellMouseDown={localAfterOnCellMouseDown}
                          selectionMode="range"

                          // hiddenColumns={{
                          //   columns: [4],
                          // }}
                          cells={function (row, col) {
                            var cp = {};
                            const hot = hotRefB2csInv?.current?.hotInstance;
                            if (purchaseData?.length > 0 && col == 1 || col == 2 || col == 3) {
                              cp.className = "text-danger myRow";
                            }
                            if (!purchaseData?.length > 0 && col == 1) {
                              cp.className = "text-center";

                            }
                            if (
                              col == 4 ||
                              col == 5 ||
                              col == 6 ||
                              col == 7
                            ) {
                              cp.className = "text-end";
                            }
                            return cp;
                          }}
                        />}

                        {customPagination()}

                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </TabPane>

            {/* AT/ATA/ATADJ/ATADJA - Advance Payment */}
            <TabPane tabId="6" key="6">
              <Card>
                <CardBody className="CardBody p-0">
                  <Row className="p-1">
                    <Col md={8}>
                    <UILoader blocking={blockTable} color="secondary"  overlayColor='rgba(255,255,255, .5)'>
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
                      </UILoader>
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
                            value={atInvoiceType}
                            // className="basic-multi-select"
                            classNamePrefix="select"
                            onChange={filterInvoiceTypeAt}
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

              <div>
                <h2 className="mt-2 mb-1">Summary</h2>
              </div>
              <Card>
                <CardBody className="CardBody p-0">
                  <div
                    className=""
                    style={{
                      maxHeight: "250px",
                      overflowY: "auto",
                      overflowX: "hidden",
                    }}
                  >
                    <Row>
                      <Col sm="12">
                        <div>
                          {atSummaryData?.length ? (
                            <HotTable
                              // height="250"
                              rowHeights={RowSize}
                              columnHeaderHeight={columnHeaderSize}
                              fixedRowsTop={0}
                              autoWrapRow={true}
                              ref={hotRefAtSummary}
                              columnSorting={true}
                              overflow={"auto"}
                              autoColumnSize={true}
                              stretchH="all"
                              height={200}
                              data={atSummaryData ? atSummaryData : []}
                              columns={
                                atInvoiceType?.value == "13" ||
                                  atInvoiceType?.value == "15"
                                  ? atSummaryColumns
                                  : atAmedmentSummaryColumns
                              }
                              // afterGetColHeader={theader}
                              colHeaders={colHeaders}
                              rowHeaders={false}
                              filters={true}
                              afterGetColHeader={theader1}
                              hiddenColumns={false}
                              bindRowsWithHeaders={false}
                              licenseKey="non-commercial-and-evaluation"
                              //  afterOnCellMouseDown={localAfterOnCellMouseDown}
                              selectionMode="range"
                              mergeCells={false}
                              cells={function (row, col) {
                                var cp = {};
                                const hot =
                                  hotRefAtSummary?.current?.hotInstance;
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
                              rowHeights={RowSize}
                              columnHeaderHeight={columnHeaderSize}
                              autoWrapRow={true}
                              ref={hotRefAtSummary}
                              autoColumnSize={true}
                              stretchH="all"
                              rowHeaders={false}
                              afterGetColHeader={theader1}
                              height="auto"
                              style={{
                                textAlign: "center",
                                overflowX: "hidden",
                              }}
                              data={[{ sectionName: "No Data Found!" }]}
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
                              // afterOnCellMouseDown={localAfterOnCellMouseDown}
                              selectionMode="range"
                            />
                          )}
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
                        {/* {purchaseData?.length ? ( */}
                        {activeTab == 6 && <HotTable
                          rowHeights={RowSize}
                          columnHeaderHeight={columnHeaderSize}
                          id='hotRefAtId'
                          autoWrapRow={true}
                          ref={hotRefAt}
                          columnSorting={true}
                          //afterColumnSort={ServerSideSorting}
                          beforeSetRangeStart={localBeforeSetRangeStart}
                          dropdownMenu={{
                            items: {
                              filter_by_value: {
                                name: "Search Value",
                                // hide the 'Filter by value' list from all columns but the first one
                                hidden() {
                                  const selectedValue = this.getSelected()[0][1];
                                  const isValidColumn = [5, 6, 7, 8].includes(selectedValue);

                                  return isValidColumn;
                                },
                              },

                              option5: {

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
                                    this.getSelectedRangeLast().to.col != 5
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

                              option6: createOptionMinMax(fromValue, toValue, 6),
                              option7: createOptionMinMax(fromTax, toTax, 7),
                              about: { // Own custom option

                                name: `<div  style=${checkboxFilterCss}>${checkBoxTitle}<label class="float-end text-danger "><a><u id="selectAll">Select All</u></a></label></div> <div  class="checkboxmenu custom-scrollbar"> <div >  <table id="searchTable" >
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
                                        hotRefAt?.current?.hotInstance;

                                      if (hot?.getSelected()[0][1] == 5) {


                                        var columnName = atColumns[currentCol1]?.data;
                                        var valueDate = '';
                                        setSearchDate('');
                                        setToDate('');

                                        var value = valueDate;
                                      } else if (hot?.getSelected()?.[0]?.[1] == 8) {

                                        var checkboxes = document.getElementsByClassName('checkBoxClass');

                                        setFilterDropDownList([]);
                                        var columnName = atColumns[currentCol1]?.data;
                                        arrChk = []
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

                                        var value = filterObject?.join('@#@#');

                                        const updatedFilterDropDownList = arrChk.reduce((acc, item) => {
                                          // let headerPlaceOfSupply =
                                          // atInvoiceType?.value == 14 || atInvoiceType?.value == 16
                                          //   ? originalPlaceOfSupply
                                          //   : placeOfSupply;

                                          const { placeOfSupply } = item;

                                          const updateList = (list, value) => {
                                            return list.includes(value) ? list : [...list, value];
                                          };

                                          if (placeOfSupply !== undefined) {
                                            acc.posDropDownList = updateList(acc.posDropDownList, placeOfSupply);
                                          }

                                          return acc;
                                        }, { posDropDownList: [] });

                                        setFilterDropDownList(updatedFilterDropDownList);

                                      } else if (hot?.getSelected()[0][1] == 7 || hot?.getSelected()[0][1] == 6) {


                                        var columnName = atColumns[currentCol1]?.data;
                                        var valueRange = '';


                                        hot?.getSelected()[0][1] == 6 && setFromValue('');
                                        hot?.getSelected()[0][1] == 6 && setToValue('');
                                        hot?.getSelected()[0][1] == 7 && setFromTax('');
                                        hot?.getSelected()[0][1] == 7 && setToTax('');

                                        var value = valueRange;

                                      } else {


                                        var value = '';
                                      }

                                      const x = searchVal1;
                                      if (!searchVal1?.length) {
                                        x.push(value);
                                        let y = currentCol;
                                        y.push(atColumns[currentCol1]?.data);

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

                                      const invType =
                                        count == 1
                                          ? url
                                          : atInvoiceType?.value;
                                      setPage(0);
                                      purchaseSummaryList(
                                        activeTab,
                                        "",
                                        "",
                                        invType,
                                        finFromYear?.value,
                                        monthFrom?.value,
                                        ""
                                      );

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
                              posDropDownList
                            } = filterDropDownList;

                            const listsToCheck = [
                              posDropDownList
                            ];

                            for (var j = 0; j < checkboxes.length; j++) {

                              for (var k = 0; k < listsToCheck.length; k++) {
                                if (listsToCheck[k]) {
                                  // For rcmDropDownList, check both conditions listsToCheck[k][i] == checkboxes[j].value and checkboxes?.length == 2

                                  for (var i = 0; i < listsToCheck[k].length; i++) {
                                    if (listsToCheck[k][i] == checkboxes[j].value) {
                                      $(checkboxes[j]).prop("checked", true);
                                      break;
                                    }
                                  }

                                }
                              }
                            }

                            const element = document.querySelector(".htMenu.htDropdownMenu.handsontable");
                            element.style.top = "0px";
                          }}
                          afterFilter={function (data, coords) {
                            const hot = hotRefAt?.current?.hotInstance;

                            if (hot?.getSelected()[0][1] == 5) {

                              var searchInput1 = document.getElementById("custom1");
                              var searchInput2 = document.getElementById("custom2");
                              const invFromDate = searchInput1?.value
                              const invToDate = searchInput2?.value
                              var columnName = atColumns[currentCol1]?.data;
                              var valueDate = (searchInput1?.value || searchInput2?.value) && `${invFromDate ? invFromDate : invToDate}to${invToDate ? invToDate : invFromDate}`;
                              setSearchDate(searchInput1?.value);
                              setToDate(searchInput2?.value);

                              var value = valueDate;
                            } else if (hot?.getSelected()?.[0]?.[1] == 8) {

                              var checkboxes = document.getElementsByClassName('checkBoxClass');

                              setFilterDropDownList([]);
                              var columnName = atColumns[currentCol1]?.data;
                              arrChk = []
                              let filterObject = !gridCustomFilter ? [] : gridCustomFilter

                              filterObject = filterObject == null || filterObject.length <= 0 ? [] : filterObject;

                              for (let i = 0; i < checkboxes.length; i++) {
                                if (checkboxes[i].checked) {

                                  arrChk.push({ [columnName]: checkboxes[i].value });

                                  filterObject?.push(checkboxes[i].value);
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

                              var value = filterObject?.join('@#@#');

                              const updatedFilterDropDownList = arrChk.reduce((acc, item) => {

                                const { placeOfSupply } = item;

                                const updateList = (list, value) => {
                                  return list.includes(value) ? list : [...list, value];
                                };

                                if (placeOfSupply !== undefined) {
                                  acc.posDropDownList = updateList(acc.posDropDownList, placeOfSupply);
                                }

                                return acc;
                              }, { posDropDownList: [] });

                              setFilterDropDownList(updatedFilterDropDownList);

                            } else if (hot?.getSelected()[0][1] == 6 || hot?.getSelected()[0][1] == 7) {

                              var searchInput1 = document.getElementById("amount1");
                              var searchInput2 = document.getElementById("amount2");
                              const invFromDate = (searchInput1?.value)?.replaceAll(",", "")
                              const invToDate = (searchInput2?.value)?.replaceAll(",", "")
                              var columnName = atColumns[currentCol1]?.data;
                              var valueRange = `${invFromDate}to${invToDate}`;


                              hot?.getSelected()[0][1] == 6 && setFromValue(searchInput1?.value);
                              hot?.getSelected()[0][1] == 6 && setToValue(searchInput2?.value);
                              hot?.getSelected()[0][1] == 7 && setFromTax(searchInput1?.value);
                              hot?.getSelected()[0][1] == 7 && setToTax(searchInput2?.value);

                              var value = valueRange;

                            } else {

                              var searchInput = document.querySelector(
                                ".htUIMultipleSelectSearch.htUIInput"
                              );
                              var value = searchInput?.children[0]?.value;
                            }

                            const x = searchVal1;
                            if (!searchVal1?.length) {
                              x.push(value);
                              let y = currentCol;
                              y.push(atColumns[currentCol1]?.data);

                              setSearchVal1(x);
                              setCurrentCol(y);
                            } else {
                              const Index = currentCol?.findIndex(
                                (item) => atColumns[currentCol1]?.data == item
                              );

                              if (Index != -1) {
                                const xyz = searchVal1;
                                xyz[Index] = value;
                                setSearchVal1(xyz);
                              } else {
                                x.push(value);
                                let y = currentCol;
                                y.push(atColumns[currentCol1]?.data);

                                setSearchVal1(x);
                                setCurrentCol(y);
                              }
                            }

                            const invType =
                              count == 1 ? url : atInvoiceType?.value;
                            console.log(invType, "invTypeserach");
                            setPage(0);
                            purchaseSummaryList(
                              activeTab,
                              "",
                              "",
                              invType,
                              finFromYear?.value,
                              monthFrom?.value,
                              "",
                              1
                            );
                          }}
                          autoColumnSize={true}
                          stretchH="all"
                          // data={purchaseData ? purchaseData : []}
                          data={purchaseData.length > 0 ? purchaseData : [{ sheetName: "No Data Found!" }]}

                          columns={purchaseData.length > 0 ? atColumns : atColumnsEmpty}
                          afterGetColHeader={theader}
                          colHeaders={colHeaders}
                          rowHeaders={false}
                          filters={true}
                          hiddenColumns={false}
                          bindRowsWithHeaders={false}
                          licenseKey="non-commercial-and-evaluation"
                          afterOnCellMouseDown={localAfterOnCellMouseDown}
                          selectionMode="range"
                          // mergeCells={false}
                          mergeCells={[purchaseData.length > 0 ? false :
                            { row: 0, col: 1, rowspan: 1, colspan: 8 },
                          ]}
                          height="auto"
                          cells={function (row, col) {
                            var cp = {};
                            const hot = hotRefAt?.current?.hotInstance;
                            if (purchaseData?.length > 0 && col == 1 || col == 2 || col == 3 || col == 4) {
                              cp.className = "text-danger myRow";
                            }
                            else if (
                              col == 4 ||
                              col == 5 ||
                              col == 6 ||
                              col == 7
                            ) {
                              cp.className = "text-end";
                            }
                            if (!purchaseData?.length > 0 && col == 1) {

                              cp.className = "text-center";

                            }
                            return cp;
                          }}
                        />}

                        {customPagination()}

                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </TabPane>

            {/* Nill rated Exempt */}
            <TabPane tabId="5" key="5">
              <TabPane tabId="5" key="5">
                <Card>
                  <CardBody className="CardBody p-0">
                    <Row className="p-1">
                      <Col md={8}>
                      <UILoader blocking={blockTable} color="secondary"  overlayColor='rgba(255,255,255, .5)'>
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
                        </UILoader>
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
                              value={{ label: "Exemp", value: "exemp" }}
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
                        {purchaseData?.length ? (
                          <HotTable
                            rowHeights={RowSize}
                            columnHeaderHeight={columnHeaderSize}
                            autoWrapRow={true}
                            ref={hotRefExemp}
                            columnSorting={false}
                            autoColumnSize={true}
                            stretchH="all"
                            data={purchaseData ? purchaseData : []}
                            columns={ExempColumn}
                            colHeaders={colHeaders}
                            rowHeaders={false}
                            bindRowsWithHeaders={false}
                            licenseKey="non-commercial-and-evaluation"
                            selectionMode="range"
                            mergeCells={false}
                            afterChange={cellChange}
                            afterRenderer={(TD, row, col, prop, value) => {
                              if (
                                col > 0 &&
                                exemptErrorArr.findIndex(
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
                              const cellPrp = {};

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
                            beforeKeyDown={function (e, col) {
                              // Delete and Backspace , copy and paste

                              if (
                                e.keyCode == 8 ||
                                e.keyCode == 46 ||
                                e.keyCode == 67 ||
                                e.keyCode == 86
                              ) {
                              } else {
                                var reg = /^[0-9.]+|[\b]+$/;
                                let col = this?.getSelectedLast()?.[1];

                                if (col > 0) {
                                  if (!reg.test(e.key)) {
                                    e.preventDefault();
                                  }
                                }
                              }
                            }}
                            beforeCreateRow={function (index, amount) {
                              let countRow = this?.countRows();
                              if (this?.isEmptyRow(countRow - 0)) {
                                return false;
                              }
                              return true;
                            }}
                            afterGetColHeader={theader1}
                          />
                        ) : (
                          <HotTable
                            rowHeights={RowSize}
                            columnHeaderHeight={columnHeaderSize}
                            autoWrapRow={true}
                            autoColumnSize={true}
                            stretchH="all"
                            rowHeaders={false}
                            height="auto"
                            style={{ textAlign: "center", overflowX: "hidden" }}
                            data={[{ description: "No Data Found!" }]}
                            mergeCells={[
                              { row: 0, col: 0, rowspan: 1, colspan: 4 },
                            ]}
                            preventOverflow="horizontal"
                            colHeaders={colHeaders}
                            columns={ExempColumn}
                            licenseKey="non-commercial-and-evaluation"
                            selectionMode="range"
                            afterGetColHeader={theader1}
                          />
                        )}
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </TabPane>
            </TabPane>

            {/* Input tax Credit Reversal */}
            <TabPane tabId="4" key="4">
              <TabPane tabId="4" key="4">
                <Card>
                  <CardBody className="CardBody p-0">
                    <Row className="p-1">
                      <Col md={8}>

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
                              value={{ label: "Docs", value: "docs" }}
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
                  {/* <Row style={btnDisable ? { pointerEvents: "none", opacity: "0.4" } : {}} > */}
                  <Row>
                    <Col sm="12">
                      <div>
                        {purchaseData?.length ? (
                          <HotTable
                            rowHeights={RowSize}
                            columnHeaderHeight={columnHeaderSize}
                            autoWrapRow={true}
                            ref={hotRefInputCredit}
                            columnSorting={false}
                            autoColumnSize={true}
                            stretchH="all"
                            data={purchaseData ? purchaseData : []}
                            columns={DocColumns}
                            rowHeaders={false}
                            bindRowsWithHeaders={false}
                            licenseKey="non-commercial-and-evaluation"
                            selectionMode="range"
                            mergeCells={false}
                            cells={function (row, col) {
                              const cellPrp = {};

                              // if (finFromYear?.value == monthFrom?.value) {
                              //     if (col === 2 || col === 3 || col === 4 || col === 5) {
                              //         cellPrp.readOnly = false;
                              //     }
                              // } else {
                              //     cellPrp.readOnly = true;
                              // }

                              if (
                                col === 2 ||
                                col === 3 ||
                                col === 4 ||
                                col === 5 ||
                                col === 1
                              ) {
                                cellPrp.className = "text-end";
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
                                console.log(this.getSelectedLast()?.[1]);
                                let col = this.getSelectedLast()?.[1];

                                if (
                                  col == 2 ||
                                  col == 3 ||
                                  col == 4 ||
                                  col == 5
                                ) {
                                  if (!reg.test(e.key)) {
                                    e.preventDefault();
                                  }
                                }
                              }
                            }}
                            afterGetColHeader={theader1}
                          />
                        ) : (
                          <HotTable
                            rowHeights={RowSize}
                            columnHeaderHeight={columnHeaderSize}
                            autoWrapRow={true}
                            autoColumnSize={true}
                            stretchH="all"
                            rowHeaders={false}
                            height="auto"
                            style={{ textAlign: "center", overflowX: "hidden" }}
                            data={[{ natureOfDocument: "No Data Found!" }]}
                            mergeCells={[
                              { row: 0, col: 0, rowspan: 1, colspan: 7 },
                            ]}
                            preventOverflow="horizontal"
                            colHeaders={colHeaders}
                            columns={DocColumns}
                            licenseKey="non-commercial-and-evaluation"
                            selectionMode="range"
                            afterGetColHeader={theader1}
                          />
                        )}
                        {customPagination()}
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </TabPane>
            </TabPane>

            {/* hsn starts here */}
            <TabPane tabId="3" key="3">
              <TabPane tabId="1" key="1">
                <Card>
                  <CardBody className="CardBody p-0">
                    <Row className="p-1">
                      <Col md={8}>
                      <UILoader blocking={blockTable} color="secondary"  overlayColor='rgba(255,255,255, .5)'>
                        <table className="table table-bordered summary-table">
                          <tbody>
                            <tr>
                              <td>
                                <p className="mb-0">
                                  HSN <br />
                                  <span> {hsn ? hsn : 0}</span>
                                </p>
                              </td>

                              <td>
                                <p className="mb-0">
                                  HSN Values (₹)
                                  <br />
                                  <span> {hsnValue ? hsnValue : 0}</span>
                                </p>
                              </td>
                              <td>
                                <p className="mb-0">
                                  Taxable Values{"  "} (₹) <br />
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
                                  Cess (₹) <br />
                                  <span>{totalCess ? totalCess : 0}</span>
                                </p>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        </UILoader>
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
                              isDisabled={true}
                              //  isMulti
                              // options={crdrInvoiceTypeList}
                              className="basic-multi-select"
                              classNamePrefix="select"
                              //  onChange={crdrFilterInvoiceType}
                              value={{ label: "HSN", value: "hsn" }}
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
                <CardBody className="CardBody p-0">
                  <Row>
                    <Col sm="12">
                      <div>
                        {/* {purchaseData?.length ? ( */}
                        {activeTab == 3 && <HotTable
                          rowHeights={RowSize}
                          columnHeaderHeight={columnHeaderSize}
                          autoWrapRow={true}
                          ref={hotRefHsn}
                          columnSorting={true}
                          columns={purchaseData?.length > 0 ? hsnInvalidColumns : hsnInvalidColumnEmpty}
                          data={purchaseData.length > 0 ? purchaseData : [{ hsn: "No Data Found!" }]}
                          mergeCells={[purchaseData.length > 0 ? false :
                            { row: 0, col: 1, rowspan: 1, colspan: 11 },
                          ]}
                          dropdownMenu={{
                            items: {
                              filter_by_value: {
                                name: "Search Value",
                                hidden() {
                                  const selectedValue = this.getSelected()[0][1];
                                  const isValidColumn = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12].includes(selectedValue);

                                  return isValidColumn;
                                },
                              },
                              about: { // For CheckBox custom option

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
                                  const isHiddenCol = ![3, 6].includes(selectedCol);

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
                              option4: createOptionMinMax(fromAmount, toAmount, 4),
                              option5: createOptionMinMax(fromValue, toValue, 5),
                              option7: createOptionMinMax(fromTax, toTax, 7),
                              option8: createOptionMinMax(fromIgst, toIgst, 8),
                              option9: createOptionMinMax(fromCgst, toCgst, 9),
                              option10: createOptionMinMax(fromSgst, toSgst, 10),
                              option11: createOptionMinMax(fromCess, toCess, 11),
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

                                      const selectedValuecol = hot?.getSelected()?.[0]?.[1];
                                      const minMaxColumn = [4, 5, 7, 8, 9, 10, 11].includes(selectedValuecol);
                                      if (hot?.getSelected()?.[0]?.[1] == 3 || hot?.getSelected()?.[0]?.[1] == 6) {

                                        var checkboxes = document.getElementsByClassName('checkBoxClass');

                                        setFilterDropDownList([]);
                                        var columnName = hsnInvalidColumns[currentCol1crdr]?.data;
                                        let filterObject = []
                                        let chkFilterObject = !gridCustomFilter ? [] : gridCustomFilter

                                        chkFilterObject = chkFilterObject == null || chkFilterObject.length <= 0 ? [] : chkFilterObject;

                                        for (let i = 0; i < checkboxes.length; i++) {
                                          if (checkboxes[i].checked) {

                                            let uniqueArraychk = chkFilterObject.filter((obj, index, self) =>
                                              index === self.findIndex((t) => (
                                                JSON.stringify(t) === JSON.stringify(obj)
                                              ))
                                            );
                                            chkFilterObject = uniqueArraychk
                                            const indexchk = chkFilterObject.findIndex(obj => obj[columnName] === checkboxes[i].value);
                                            const index = filterObject.findIndex(obj => obj[columnName] === checkboxes[i].value);
                                            if (index !== -1 || indexchk !== -1) {

                                              delete chkFilterObject[indexchk][columnName];
                                            }
                                          }
                                        }

                                        setGridCustomFilter(chkFilterObject)
                                        var value = filterObject?.join('@#@#');

                                        const updatedFilterDropDownList = chkFilterObject.reduce((acc, item) => {

                                          const { rate, uqc } = item;

                                          const updateList = (list, value) => {
                                            return list.includes(value) ? list : [...list, value];
                                          };

                                          if (rate !== undefined) {
                                            acc.rateDropDownList = updateList(acc.rateDropDownList, rate);
                                          } else if (uqc !== undefined) {
                                            acc.uqcDropDownList = updateList(acc.uqcDropDownList, uqc);
                                          }

                                          return acc;
                                        }, { rateDropDownList: [], uqcDropDownList: [] });

                                        setFilterDropDownList(updatedFilterDropDownList);

                                      } else if (minMaxColumn) {


                                        var columnName = hsnInvalidColumns[currentCol1crdr]?.data;
                                        var valueRange = '';

                                        hot?.getSelected()[0][1] == 4 && setFromAmount('');
                                        hot?.getSelected()[0][1] == 4 && setToAmount('');
                                        hot?.getSelected()[0][1] == 5 && setFromValue('');
                                        hot?.getSelected()[0][1] == 5 && setToValue('');
                                        hot?.getSelected()[0][1] == 7 && setFromTax('');
                                        hot?.getSelected()[0][1] == 7 && setToTax('');
                                        hot?.getSelected()[0][1] == 8 && setFromIgst('');
                                        hot?.getSelected()[0][1] == 8 && setToIgst('');
                                        hot?.getSelected()[0][1] == 9 && setFromCgst('');
                                        hot?.getSelected()[0][1] == 9 && setToCgst('');
                                        hot?.getSelected()[0][1] == 10 && setFromSgst('');
                                        hot?.getSelected()[0][1] == 10 && setToSgst('');
                                        hot?.getSelected()[0][1] == 11 && setFromCess('');
                                        hot?.getSelected()[0][1] == 11 && setToCess('');
                                        var value = valueRange;

                                      } else {

                                        var value = '';
                                      }

                                      const x = searchValcrdr;
                                      if (!searchValcrdr?.length) {
                                        x.push(value);
                                        let y = currentColcrdr;
                                        y.push(
                                          hsnInvalidColumns[currentCol1crdr]
                                            ?.data
                                        );
                                        setSearchValcrdr(x);
                                        setCurrentColcrdr(y);
                                      } else {
                                        const Index =
                                          currentColcrdr?.findIndex(
                                            (item) =>
                                              hsnInvalidColumns[
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
                                            hsnInvalidColumns[currentCol1crdr]
                                              ?.data
                                          );

                                          setSearchValcrdr(x);
                                          setCurrentColcrdr(y);
                                        }
                                      }

                                      const invType = 0;
                                      setPage(0);
                                      purchaseSummaryList(
                                        activeTab,
                                        "",
                                        "",
                                        invType,
                                        finFromYear?.value,
                                        monthFrom?.value,
                                        ""
                                      );

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
                          // afterColumnSort={ServerSideSorting}
                          beforeSetRangeStart={localBeforeSetRangeStart}
                          afterDropdownMenuShow={function (instance) {
                            var checkboxes = document.getElementsByClassName('checkBoxClass');

                            const {
                              rateDropDownList, uqcDropDownList
                            } = filterDropDownList;

                            const listsToCheck = [
                              rateDropDownList, uqcDropDownList
                            ];

                            for (var j = 0; j < checkboxes.length; j++) {
                              for (var k = 0; k < listsToCheck.length; k++) {
                                if (listsToCheck[k]) {

                                  if (k == 1 && checkboxes.length === 49) {
                                    for (var i = 0; i < listsToCheck[k].length; i++) {
                                      if (listsToCheck[k][i] == checkboxes[j].value) {
                                        $(checkboxes[j]).prop("checked", true);
                                        break;
                                      }
                                    }
                                  }
                                  if (k == 0 && checkboxes.length === 12) {
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
                            const element = document.querySelector(".htMenu.htDropdownMenu.handsontable");
                            element.style.top = "0px";
                          }}
                          afterFilter={function (data, coords) {
                            const hot = hotRefHsn?.current?.hotInstance;

                            const selectedValuecol = hot?.getSelected()?.[0]?.[1];
                            const minMaxColumn = [4, 5, 7, 8, 9, 10, 11].includes(selectedValuecol);
                            if (hot?.getSelected()?.[0]?.[1] == 3 || hot?.getSelected()?.[0]?.[1] == 6) {

                              var checkboxes = document.getElementsByClassName('checkBoxClass');

                              setFilterDropDownList([]);
                              var columnName = hsnInvalidColumns[currentCol1crdr]?.data;
                              let filterObject = []
                              let chkFilterObject = !gridCustomFilter ? [] : gridCustomFilter

                              chkFilterObject = chkFilterObject == null || chkFilterObject.length <= 0 ? [] : chkFilterObject;

                              for (let i = 0; i < checkboxes.length; i++) {
                                if (checkboxes[i].checked) {

                                  filterObject?.push(checkboxes[i].value);
                                  chkFilterObject?.push({ [columnName]: checkboxes[i].value });

                                } else {

                                  let uniqueArraychk = chkFilterObject.filter((obj, index, self) =>
                                    index === self.findIndex((t) => (
                                      JSON.stringify(t) === JSON.stringify(obj)
                                    ))
                                  );
                                  chkFilterObject = uniqueArraychk
                                  const indexchk = chkFilterObject.findIndex(obj => obj[columnName] === checkboxes[i].value);
                                  const index = filterObject.findIndex(obj => obj[columnName] === checkboxes[i].value);
                                  if (index !== -1 || indexchk !== -1) {

                                    delete chkFilterObject[indexchk][columnName];
                                  }
                                }
                              }

                              setGridCustomFilter(chkFilterObject)
                              var value = filterObject?.join('@#@#');

                              const updatedFilterDropDownList = chkFilterObject.reduce((acc, item) => {

                                const { rate, uqc } = item;

                                const updateList = (list, value) => {
                                  return list.includes(value) ? list : [...list, value];
                                };

                                if (rate !== undefined) {
                                  acc.rateDropDownList = updateList(acc.rateDropDownList, rate);
                                } else if (uqc !== undefined) {
                                  acc.uqcDropDownList = updateList(acc.uqcDropDownList, uqc);
                                }

                                return acc;
                              }, { rateDropDownList: [], uqcDropDownList: [] });

                              setFilterDropDownList(updatedFilterDropDownList);

                            } else if (minMaxColumn) {

                              var searchInput1 = document.getElementById("amount1");
                              var searchInput2 = document.getElementById("amount2");
                              const invFromDate = (searchInput1?.value)?.replaceAll(",", "")
                              const invToDate = (searchInput2?.value)?.replaceAll(",", "")
                              var columnName = hsnInvalidColumns[currentCol1crdr]?.data;
                              var valueRange = `${invFromDate}to${invToDate}`;

                              hot?.getSelected()[0][1] == 4 && setFromAmount(searchInput1?.value);
                              hot?.getSelected()[0][1] == 4 && setToAmount(searchInput2?.value);
                              hot?.getSelected()[0][1] == 5 && setFromValue(searchInput1?.value);
                              hot?.getSelected()[0][1] == 5 && setToValue(searchInput2?.value);
                              hot?.getSelected()[0][1] == 7 && setFromTax(searchInput1?.value);
                              hot?.getSelected()[0][1] == 7 && setToTax(searchInput2?.value);
                              hot?.getSelected()[0][1] == 8 && setFromIgst(searchInput1?.value);
                              hot?.getSelected()[0][1] == 8 && setToIgst(searchInput2?.value);
                              hot?.getSelected()[0][1] == 9 && setFromCgst(searchInput1?.value);
                              hot?.getSelected()[0][1] == 9 && setToCgst(searchInput2?.value);
                              hot?.getSelected()[0][1] == 10 && setFromSgst(searchInput1?.value);
                              hot?.getSelected()[0][1] == 10 && setToSgst(searchInput2?.value);
                              hot?.getSelected()[0][1] == 11 && setFromCess(searchInput1?.value);
                              hot?.getSelected()[0][1] == 11 && setToCess(searchInput2?.value);
                              var value = valueRange;

                            } else {

                              var searchInput = document.querySelector(
                                ".htUIMultipleSelectSearch.htUIInput"
                              );
                              var value = searchInput?.children[0]?.value;
                            }

                            const x = searchValcrdr;
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

                            const invType = 0;
                            setPage(0);
                            purchaseSummaryList(
                              activeTab,
                              "",
                              "",
                              invType,
                              finFromYear?.value,
                              monthFrom?.value,
                              "",
                              1
                            );
                          }}
                          autoColumnSize={true}
                          stretchH="all"
                          afterGetColHeader={theader}
                          colHeaders={colHeaders}
                          rowHeaders={false}
                          filters={true}
                          comments={true}
                          hiddenColumns={{
                            columns: !purchaseData.length > 0 ? [12] : []
                          }}

                          bindRowsWithHeaders={false}
                          licenseKey="non-commercial-and-evaluation"
                          afterOnCellMouseDown={hsnlocalAfterOnCellMouseDown}
                          selectionMode="range"
                          height="auto"
                          cells={function (row, col) {
                            var cp = {};
                            const hot = hotRefCrdr?.current?.hotInstance;
                            if (
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
                            if (!purchaseData?.length > 0 && col == 1) {
                              cp.className = "text-center";

                            }
                            if (col === 12) {
                              cp.renderer = myBtns;
                              cp.readOnly = true;
                              cp.className = "text-center";
                            }
                            if (row == 3) {
                              cp.editor == false;
                            }
                            else if (col == 2) {
                              if (col == 2) {
                                if (purchaseData[row]?.description?.length > 12) {
                                  cp.comment = {
                                    value: purchaseData[row]?.description, style: { width: 200, height: 50 },
                                    readOnly: true
                                  }
                                }
                              }
                              cp.renderer = myLables;
                            }
                            return cp;
                          }}

                        />}
                        {customPagination()}

                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </TabPane>
            </TabPane>

            {/* E-Com starts here */}
            <TabPane tabId="8" key="8">
            {/* Gstr1SuppliesMade (E-Com) */}
             {activeTab == 8 ?
              <Gstr1SuppliesMade payload={suppliesMadePayload}/>
              : null}
            </TabPane>

          </TabContent>
        </Col>
      </Row>

      <Modal
        backdrop="static"
        isOpen={hsnShow}
        toggle={() => setHsnShow(!hsnShow)}
        className={"modal-dialog-centered"}
      >
        <div className="modal-header">
          <h2 className="modal-title w-100 text-center">Add/Update HSN</h2>
          <div className="modal-actions">
            <a className="text-body" onClick={() => setHsnShow(!hsnShow)}>
              <X size={14} />
            </a>
          </div>
        </div>


        <ModalBody>
          <Form
            onSubmit={handleSubmit(onSubmit)}
          >
            <Row className="mt-1">
              <Col>
                <Label className="form-label requiredlable">HSN</Label>
                <Controller
                  id="hsn"
                  name="hsn"
                  control={control}
                  rules={{
                    required: hsnEvenCheck ? "Enter a valid HSN" : false,
                    // required: hsnEvenCheck ? "Value has to be even" : false,
                  }}
                  render={({ field }) => (
                    <Input
                      // placeholder="HSN"
                      invalid={(errors.hsn?.type =="required" || ( errors.hsn?.type =="manual" && errors.hsn?.message != "")) && true}
                      {...field}
                      onBlur={onChangeValue}
                    // disabled={disableText}
                      onKeyPress={(e) => handleKeyPressPass(e, setError,'hsn','Hsn','allowSpace')}
                      onPaste={(e) => handlePasteText(e, setError,'hsn','hsn','allowSpace')}
                    />
                  )}
                />
                {errors.hsn && (
                  <FormFeedback>{errors.hsn.message}</FormFeedback>
                )}
              </Col>

              <Col>
                <Label className="form-label requiredlable">
                  Measurement(unit)
                </Label>
                <Controller
                  id="uqc"
                  name="uqc"
                  control={control}
                  rules={{ required: hsnCheck ? "Required field!" : false }}
                  render={({ field }) => (
                    <Select

                      isClearable={false}

                      classNamePrefix="select"

                      options={unitList}
                      {...field}
                      invalid={errors.uqc && true}

                      theme={selectThemeColors}

                      className={classnames("react-select", {
                        "is-invalid": errors.uqc && true,
                      })}

                    />
                  )}
                />
                {errors.uqc && (
                  <FormFeedback>{errors.uqc.message}</FormFeedback>
                )}
              </Col>

              <Col>
                <Label className="form-label requiredlable">
                  Total Quantity
                </Label>
                <Controller
                  id="totalQty"
                  name="totalQty"
                  control={control}
                  rules={{ required: hsnCheck ? "Required field!" : false }}
                  render={({ field }) => (
                    <Input

                      invalid={errors.totalQty && true}
                      {...field}
                      onChange={(e) =>
                        field.onChange(e.target.value.replace(/[^\d.]/g, ""))
                      } 
                    // disabled={disableText}
                    />
                  )}
                />
                {errors.totalQty && (
                  <FormFeedback>{errors.totalQty.message}</FormFeedback>
                )}

              </Col>
            </Row>

            <Row className="mt-1">
              <Col>
                <Label className="form-label">Description</Label>

                <Controller
                  id="description"
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <Input
                    invalid={errors?.description && true}
                    {...field}
                    onChange={(e) => handleChange(field, e)}
                  />
                  )}
                />
                {errors?.description && (
                  <FormFeedback>{errors?.description?.message}</FormFeedback>
                )}
              </Col>
            </Row>

            <br></br>

            <Row className="mt-1">
              <Col>
                <Label className="form-label requiredlable">
                  Taxable Value
                </Label>
                <Controller
                  id="taxableAmount"
                  name="taxableAmount"
                  control={control}
                  rules={{ required: "Required field!" }}
                  render={({ field }) => (
                    <Input
                      // placeholder="Cess"
                      invalid={errors.taxableAmount && true}
                      // type="number"
                      {...field}
                      onChange={(e) =>
                        field.onChange(e.target.value.replace(/[^\d.]/g, ""))
                      }
                    // disabled={disableText}
                    />
                  )}
                />
                {errors.taxableAmount && (
                  <FormFeedback>{errors.taxableAmount.message}</FormFeedback>
                )}

              </Col>
              <Col>
                <Label className="form-label requiredlable">Rate</Label>
                <Controller
                  id="rate"
                  name="rate"
                  rules={{ required: hsnCheck ? "Required field!" : false }}
                  control={control}
                  render={({ field }) => (
                    <Select
                      invalid={errors.rate && true}
                      {...field}
                      theme={selectThemeColors}
                      className={classnames("react-select", {
                        "is-invalid": errors.rate && true,
                      })}
                      classNamePrefix="select"
                      onChange={field.onChange}
                      value={field.value}
                      options={RateList}
                      isClearable={false}
                    />
                  )}
                />
                {errors.rate && (
                  <FormFeedback>{errors.rate.message}</FormFeedback>
                )}


              </Col>
              <Col>
                <Label className="form-label requiredlable">Total Value</Label>
                <Controller
                  id="totalValue"
                  name="totalValue"
                  rules={{ required: "Required field!" }}
                  control={control}
                  render={({ field }) => (
                    <Input

                      invalid={errors.totalValue && true}

                      {...field}
                      onChange={(e) =>
                        field.onChange(e.target.value.replace(/[^\d.]/g, ""))
                      }
                    // disabled={disableText}
                    />
                  )}
                />
                {errors.totalValue && (
                  <FormFeedback>{errors.totalValue.message}</FormFeedback>
                )}


              </Col>
            </Row>
            <br></br>
            <Row className="mt-1">
              <Col>
                <Label className="form-label">IGST</Label>

                <Controller
                  id="igst"
                  name="igst"
                  control={control}
                  render={({ field }) => (
                    <Input

                      invalid={errors.igst && true}

                      {...field}
                      onChange={(e) =>
                        field.onChange(e.target.value.replace(/[^\d.]/g, ""))
                      }
                    // disabled={disableText}
                    />
                  )}
                />
                {errors.igst && (
                  <FormFeedback>{errors.igst.message}</FormFeedback>
                )}
              </Col>
              <Col>
                <Label className="form-label">CGST</Label>
                <Controller
                  id="cgst"
                  name="cgst"
                  control={control}
                  render={({ field }) => (
                    <Input

                      invalid={errors.cgst && true}
                      {...field}

                      onChange={(e) =>
                        field.onChange(e.target.value.replace(/[^\d.]/g, ""))
                      }
                    // disabled={disableText}
                    />
                  )}
                />
                {errors.cgst && (
                  <FormFeedback>{errors.cgst.message}</FormFeedback>
                )}


              </Col>

              <Col>
                <Label className="form-label">SGST</Label>
                <Controller
                  id="sgst"
                  name="sgst"
                  control={control}
                  render={({ field }) => (
                    <Input

                      invalid={errors.sgst && true}
                      {...field}

                      // disabled={disableText}
                      onChange={(e) =>
                        field.onChange(e.target.value.replace(/[^\d.]/g, ""))
                      }
                    />
                  )}
                />
                {errors.sgst && (
                  <FormFeedback>{errors.sgst.message}</FormFeedback>
                )}

              </Col>

              <Col>
                <Label className="form-label">Cess</Label>
                <Controller
                  id="cess"
                  name="cess"
                  control={control}
                  render={({ field }) => (
                    <Input

                      invalid={errors.cess && true}
                      {...field}

                      onChange={(e) =>
                        field.onChange(e.target.value.replace(/[^\d.]/g, ""))
                      }
                    />
                  )}
                />
                {errors.cess && (
                  <FormFeedback>{errors.cess.message}</FormFeedback>
                )}

              </Col>
            </Row>

            {returnPeriodDisable && (
              <Row>
                <Col xs={3}></Col>
                <Col xs={6}>
                  <Label className="form-label mt-2" for="status">
                    <b>Return Period</b>
                  </Label>
                  <Select
                    id="purchaseId_invtype"
                    placeholder={DROPDOWN_PLACEHOLDER}
                    maxMenuHeight={SELECT_MAXSIZE}
                    isClearable={false}
                    theme={selectThemeColors}
                    closeMenuOnSelect={true}
                    components={animatedComponents}
                    options={financialYearList}
                    className="basic-multi-select"
                    classNamePrefix="select"

                    value={selectedYear}
                    onChange={selectFromYearaddmodel}
                  />
                </Col>
              </Row>
            )}

            <Row>
              <Col xs={12} className="text-center mt-2 pt-50">
                <Button type="submit" className="me-1" color="danger" outline>
                  Save
                </Button>
                <Button
                  type="reset"
                  color="secondary"
                  outline
                  onClick={() => {
                    setHsnShow(false);
                    setReturnPeriodIdDisable(true);
                  }}
                >
                  Close
                </Button>
              </Col>
            </Row>
          </Form>
        </ModalBody>
      </Modal>

      {/* this modal is for Docs add and update */}

      <Modal
        backdrop="static"
        isOpen={docShow}
        toggle={() => setDocShow(!docShow)}
        className={"modal-dialog-centered"}
      >
        <div className="modal-header">
          <h2 className="modal-title w-100 text-center">Add/Update Docs</h2>
          <div className="modal-actions">
            <a
              className="text-body"
              onClick={() => {
                setDocShow(!docShow), reset();
              }}
            >
              <X size={14} />
            </a>
          </div>
        </div>
        {/* <ModalHeader className='bg-transparent' onClick={() => closeModal}></ModalHeader> */}

        <ModalBody>
          <Form
            onSubmit={handleSubmit(onSubmitDocs)}
          //  ref={ref}
          >
            <Row className="mt-1">
              <Col lg={3}>
                <Label className="form-label requiredlable">Sr.No.From</Label>
                <Controller
                  id="srNoFrom"
                  name="srNoFrom"
                  control={control}
                  rules={{ required: "Required field!" }}
                  render={({ field }) => (
                    <Input
                      // placeholder="HSN"
                      invalid={errors.srNoFrom && true}
                      {...field}
                      onBlur={onChangeValue}
                      onChange={(e) =>
                        field.onChange(e.target.value.replace(/\s/g, ""))
                      }
                      //Don't remove this commented Code
                      // onKeyPress={(e) => {
                      //   if (new RegExp(/[-a-zA-Z0-9/\/]/).test(e.key)) {
                      //   } else e.preventDefault();
                      // }}
                      onKeyPress={(e) => handleKeyPressPass(e, setError,'srNoFrom','srNoFrom','allowSpace')}
                      onPaste={(e) => handlePasteText(e, setError,'srNoFrom','srNoFrom','allowSpace')}
                    //  onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))}
                    // disabled={disableText}
                    />
                  )}
                />
                {errors.srNoFrom && (
                  <FormFeedback>{errors.srNoFrom.message}</FormFeedback>
                )}
              </Col>

              <Col lg={6}>
                <Label className="form-label requiredlable">
                  Nature of Document
                </Label>
                <Controller
                  id="natureOfDocument"
                  name="natureOfDocument"
                  control={control}
                  rules={{ required: "Required field!" }}
                  render={({ field }) => (
                    <>
                      <Select
                        key={field.name}
                        // placeholder={DROPDOWN_PLACEHOLDER}
                        isClearable={false}
                        // className="react-select"
                        classNamePrefix="select"
                        // value={field.value}
                        options={typeofDocument}
                        {...field}
                        invalid={errors.natureOfDocument && true}
                        // classNamePrefix="select"
                        theme={selectThemeColors}
                        // onChange={field.onChange}
                        className={classnames("react-select", {
                          "is-invalid": errors.natureOfDocument && true,
                        })}
                      />
                    </>
                  )}
                />
                {errors.natureOfDocument && (
                  <FormFeedback>{errors.natureOfDocument.message}</FormFeedback>
                )}
              </Col>

              <Col lg={3}>
                <Label className="form-label requiredlable">Sr.No.To</Label>
                <Controller
                  id="srNoTo"
                  name="srNoTo"
                  control={control}
                  rules={{ required: "Required field!" }}
                  render={({ field }) => (
                    <Input
                      // placeholder="SGST"
                      invalid={errors.srNoTo && true}
                      {...field}
                      // type="number"
                      onChange={(e) =>
                        field.onChange(e.target.value.replace(/\s/g, ""))
                      }
                      // Don't remove this commented code
                      // onKeyPress={(e) => {
                      //   if (new RegExp(/[-a-zA-Z0-9/\/]/).test(e.key)) {
                      //   } else e.preventDefault();
                      // }}

                      onKeyPress={(e) => handleKeyPressPass(e, setError,'srNoTo','srNoTo','allowSpace')}
                      onPaste={(e) => handlePasteText(e, setError,'srNoTo','srNoTo','allowSpace')}
                    // disabled={disableText}
                    />
                  )}
                />
                {errors.srNoTo && (
                  <FormFeedback>{errors.srNoTo.message}</FormFeedback>
                )}
                {/* <Input placeholder='SGST Value' /> */}
              </Col>
            </Row>

            <br></br>

            <Row className="mt-1">
              <Col>
                <Label className="form-label requiredlable">
                  Total Number{" "}
                </Label>
                <Controller
                  id="totalNumber"
                  name="totalNumber"
                  control={control}
                  rules={{ required: "Required field!" }}
                  render={({ field }) => (
                    <Input
                      // placeholder="Cess"
                      invalid={errors.totalNumber && true}
                      {...field}
                      // type="number"
                      onChange={(e) => {
                        field.onChange(e.target.value.replace(/\D/g, ""));
                        const totalNum = parseFloat(e.target.value);
                        const cancelledValue = parseFloat(
                          getValues("cancelled") || 0
                        );
                        const netIssuedValue = totalNum - cancelledValue;
                        setValue("netIssued", netIssuedValue.toString());
                        // field.onChange(e);
                      }}
                    />
                  )}
                />
                {errors.totalNumber && (
                  <FormFeedback>{errors.totalNumber.message}</FormFeedback>
                )}
                {/* <Input placeholder='Cess Value' /> */}
              </Col>
              <Col>
                <Label className="form-label requiredlable">Cancelled</Label>
                <Controller
                  id="cancelled"
                  name="cancelled"
                  rules={{ required: "Required field!" }}
                  control={control}
                  render={({ field }) => (
                    <Input
                      // placeholder="Taxable"
                      invalid={errors.cancelled && true}
                      {...field}
                      // type="number"
                      onChange={(e) => {
                        field.onChange(e.target.value.replace(/\D/g, ""));
                        const cancelledValue = parseFloat(e.target.value);
                        const totalNum = parseFloat(
                          getValues("totalNumber") || 0
                        );
                        const netIssuedValue = totalNum - cancelledValue;
                        setValue("netIssued", netIssuedValue.toString());
                        // field.onChange(e);
                      }}
                    />
                  )}
                />
                {errors.cancelled && (
                  <FormFeedback>{errors.cancelled.message}</FormFeedback>
                )}

                {/* <Input placeholder='Taxable Value' /> */}
              </Col>
              <Col>
                <Label className="form-label">Net Issued</Label>
                <Controller
                  id="netIssued"
                  name="netIssued"
                  // rules={{ required: "Required field!" }}
                  control={control}
                  render={({ field }) => (
                    <div>
                      {console.log(field, "field")}
                      <Input

                        {...field}
                        type="number"
                        disabled

                      />
                    </div>
                  )}
                />
              </Col>
            </Row>

            {returnPeriodDisable && (
              <Row>
                <Col xs={3}></Col>
                <Col xs={6}>
                  <Label className="form-label mt-2 requiredlable" for="status">
                    <b>Return Period</b>
                  </Label>
                  <Select
                    id="purchaseId_invtype"
                    placeholder={DROPDOWN_PLACEHOLDER}
                    maxMenuHeight={SELECT_MAXSIZE}
                    isClearable={false}
                    theme={selectThemeColors}
                    closeMenuOnSelect={true}
                    components={animatedComponents}
                    options={financialYearList}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    // defaultValue={}
                    value={selectedYear}
                    onChange={selectFromYearaddmodel}
                  />
                </Col>
              </Row>
            )}

            <Row>
              <Col xs={12} className="text-center mt-2 pt-50">
                <Button type="submit" className="me-1" color="danger" outline>
                  Save
                </Button>
                <Button
                  type="reset"
                  color="secondary"
                  outline
                  onClick={() => {
                    setDocShow(false), reset();
                  }}
                >
                  Close
                </Button>
              </Col>
            </Row>
          </Form>
        </ModalBody>
      </Modal>

      {/* This modal is For advance summary  */}
      <Modal
        backdrop="static"
        isOpen={advShow}
        toggle={() => setAdvShow(!advShow)}
        className={"modal-dialog-centered"}
      >
        <div className="modal-header">
          <h2 className="modal-title w-100 text-center">
            Add/Update Advance Summary
          </h2>
          <div className="modal-actions">
            <a className="text-body" onClick={() => setAdvShow(!advShow)}>
              <X size={14} />
            </a>
          </div>
        </div>
        {/* <ModalHeader className='bg-transparent' onClick={() => closeModal}></ModalHeader> */}

        <ModalBody>
          <Form
            onSubmit={handleSubmit(onSubmitAdvSummary)}
          //  ref={ref}
          >
            <Row className="mt-1">
              <Col>
                <Label className="form-label requiredlable">
                  Place Of Supply
                </Label>
                <Controller
                  id="placeOfSupply"
                  name="placeOfSupply"
                  control={control}
                  rules={{ required: "Required field!" }}
                  render={({ field }) => {
                    console.log(placeOfSupplyList, "placeOfSupplyListSelect");
                    return (
                      <Select

                        isClearable={false}

                        classNamePrefix="select"

                        options={placeOfSupplyList}
                        {...field}
                        invalid={errors.placeOfSupply && true}

                        theme={selectThemeColors}

                        className={classnames("react-select", {
                          "is-invalid": errors.placeOfSupply && true,
                        })}

                      />
                    );
                  }}
                />
                {errors.placeOfSupply && (
                  <FormFeedback>{errors.placeOfSupply.message}</FormFeedback>
                )}
              </Col>
              <Col>
                <Label className="form-label requiredlable">Invoice Type</Label>
                <Controller
                  id="invoiceType"
                  name="invoiceType"
                  control={control}
                  rules={{ required: "Required field!" }}
                  render={({ field }) => (
                    <>
                      <Select

                        {...field}
                        isClearable={false}

                        classNamePrefix="select"
                        options={atInvoiceTypeList}

                        invalid={errors.invoiceType && true}

                        theme={selectThemeColors}
                        onChange={field.onChange}
                        value={field.value}
                        className={classnames("react-select", {
                          "is-invalid": errors.invoiceType && true,
                        })}

                      />
                    </>
                  )}
                />
                {errors.invoiceType && (
                  <FormFeedback>{errors.invoiceType.message}</FormFeedback>
                )}
              </Col>

              <Col>
                <Label className="form-label requiredlable" for="status">
                  <b>Return Period</b>
                </Label>
                <Select
                  id="purchaseId_invtype"
                  placeholder={DROPDOWN_PLACEHOLDER}
                  maxMenuHeight={SELECT_MAXSIZE}
                  isClearable={false}
                  theme={selectThemeColors}
                  closeMenuOnSelect={true}
                  components={animatedComponents}
                  options={financialYearList}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  // defaultValue={}
                  value={selectedYear}
                  onChange={selectFromYearaddmodel}
                />
              </Col>
            </Row>
            <Row className="mt-1">
              <Col>
                <Label className="form-label requiredlable">
                  Gross Advance
                </Label>

                <Controller
                  id="grossAdvance"
                  name="grossAdvance"
                  control={control}
                  rules={{ required: "Required field!" }}
                  render={({ field }) => (
                    <Input

                      invalid={errors.grossAdvance && true}
                      {...field}
                      type="number"

                    />
                  )}
                />

                {errors.grossAdvance && (
                  <FormFeedback>{errors.grossAdvance.message}</FormFeedback>
                )}
              </Col>

              <Col>
                <Label className="form-label requiredlable">Rate</Label>
                <Controller
                  id="rate"
                  name="rate"
                  control={control}
                  rules={{ required: "Required field!" }}
                  render={({ field }) => (
                    <Select

                      isClearable={false}

                      classNamePrefix="select"

                      options={taxList}
                      {...field}
                      invalid={errors.rate && true}
                      theme={selectThemeColors}

                      className={classnames("react-select", {
                        "is-invalid": errors.rate && true,
                      })}

                    />
                  )}
                />
                {errors.rate && (
                  <FormFeedback>{errors.rate.message}</FormFeedback>
                )}
              </Col>
            </Row>

            <Row className="mt-1">
              <Col>
                <Label className="form-label requiredlable">IGST</Label>

                {advShow ? (
                  <Input
                    disabled
                    value={dummy2}
                    defaultValue={setValue("igst", dummy2)}
                    id="igst"
                    name="igst"
                  />
                ) : (
                  ""
                )}
              </Col>
              <Col>
                <Label className="form-label requiredlable">CGST</Label>

                {advShow ? (
                  <Input
                    disabled
                    value={dummy}
                    defaultValue={setValue("cgst", dummy)}
                    id="cgst"
                    name="cgst"
                  />
                ) : (
                  ""
                )}

                {errors.cgst && (
                  <FormFeedback>{errors.cgst.message}</FormFeedback>
                )}


              </Col>

              <Col>
                <Label className="form-label requiredlable">SGST</Label>

                {advShow ? (
                  <Input
                    disabled
                    value={dummy}
                    defaultValue={setValue("sgst", dummy)}
                    id="sgst"
                    name="sgst"
                  />
                ) : (
                  ""
                )}

                {errors.sgst && (
                  <FormFeedback>{errors.sgst.message}</FormFeedback>
                )}

              </Col>

              <Col>
                <Label className="form-label">Cess</Label>
                <Controller
                  id="cess"
                  name="cess"
                  // rules={{ required: "Required field!" }}
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      onChange={(e) =>
                        field.onChange(e.target.value.replace(/\D/g, ""))
                      }
                    />
                  )}
                />
              </Col>
            </Row>
            <Row>
              <Col xs={12} className="text-center mt-2 pt-50">
                <Button type="submit" className="me-1" color="danger" outline>
                  Save
                </Button>
                <Button
                  type="reset"
                  color="secondary"
                  outline
                  onClick={() => {
                    setAdvShow(false), setDummy("0");
                  }}
                >
                  Close
                </Button>
              </Col>
            </Row>
          </Form>
        </ModalBody>
      </Modal>
    </div>
  );
};

function ErrorTable({ errorDataList }) {
  //   console.log(errorDataList , 'errorDataList')
  const uniqueArray = [];
  const keys = new Set();

  for (const obj of errorDataList) {
    const key = JSON.stringify(obj);
    if (!keys.has(key)) {
      keys.add(key);
      uniqueArray.push(obj);
    }
  }

  const itemList =
    uniqueArray &&
    uniqueArray.map((item, i) => (
      <tr>
        <td>{i + 1}</td>
        <td>{Number(item.rowNo) + 1}</td>
        <td>Only Numeric Value Allowed</td>
      </tr>
    ));

  return (
    <div className="errorTable_container">
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Sr No</th>
            <th>Row Number</th>
            <th>Error</th>
          </tr>
        </thead>
        <tbody>{itemList}</tbody>
      </Table>
    </div>
  );
}

export default Gstr1PurchaseInvoices;
