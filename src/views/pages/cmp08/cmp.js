import {  useState, useEffect, useRef } from "react";
import { HotTable } from "@handsontable/react";
import { registerAllModules } from "handsontable/registry";
import GSRT1SummaryInvoice from "../../../services/gstr1/gstr1Services/gstr1PurchaseInvoiceService";
import itc04PurchaseInvoice from "../../../services/itc04Services/itc04PurchaseInvoice";
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
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { globleVariable } from "../../../configs/globalVariable";
import LocalFunction from "../../../configs/getLocalFunction";
import SessionFunction from "../../../configs/getSessionFunction";
import { downloadURL } from '@helper/downloadUrl'
import itc04SummaryService from "../../../services/itc04Services/itc04SummaryService";
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
} from "reactstrap";
import ReactPaginate from "react-paginate";
// import Tabs from "./tabs";
import withReactContent from "sweetalert2-react-content";
import { filterCurrentDate } from "../../../helper/filterArray";
import { PageSize, RowSize, columnHeaderSize } from '@configs/config'

let isChecked = false;
const optionField = { label: "--Select--", value: "-1" };
var unitList = [];
var taxList = [];
var placeOfSupplyList = [];

const finYearOption = LocalFunction.getLocalValue(globleVariable.rangeFiltersITC04, true);
const YearList = JSON.parse(finYearOption)
const refershData = 'refData';

const FinDateTime = LocalFunction.getLocalValue(globleVariable.serverDateTime, true);
const ITCInvoices = ({ returnDate }) => {

  const navigate = useNavigate();

  const { setGSRT1Data, stepper } = useOutletContext();
  const [block, setBlock] = useState(false);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(PageSize);
  const [currentCol, setCurrentCol] = useState([]);
  const [currentCol1, setCurrentCol1] = useState([]);
  const [searchVal1, setSearchVal1] = useState([]);
  const [searchDate, setSearchDate] = useState("");
  const [searchDate1, setSearchDate1] = useState("");
  const [searchDate2, setSearchDate2] = useState("");

  const [b2csData, setB2csData] = useState([]);
  const [currentColb2cs, setCurrentColb2cs] = useState([]);
  const [currentCol1b2cs, setCurrentCol1b2cs] = useState();
  const [searchValb2cs, setSearchValb2cs] = useState([]);
  const [currentColcrdr, setCurrentColcrdr] = useState([]);
  const [currentCol1crdr, setCurrentCol1crdr] = useState();
  const [searchValcrdr, setSearchValcrdr] = useState([]);

  const [count, setCount] = useState(0);
  const [row1, setRow1] = useState([]);
  const [activeTab, setActiveTab] = useState("1");
  const [showList, setShowList] = useState(false);
  const [hsnShow, setHsnShow] = useState(false);
  const [docShow, setDocShow] = useState(false);
  const [finFromYear, setFinFormYear] = useState(null);
  const [panData, setPanData] = useState([]);
  const [panDataFrom, setPanDataFrom] = useState([]);

  const [monthFrom, setMonthFrom] = useState(null);
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

  // set values
  const [invoceTypes, setInvoceTypes] = useState([]);
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

  const G_UCParId = SessionFunction.getSessionValue(globleVariable.G_UCParId, true)
  const G_FY = SessionFunction.getSessionValue(globleVariable.G_FY, true)
  const itc04DateRange = sessionStorage.getItem(globleVariable.itc04DateRange) && SessionFunction.getSessionValue(globleVariable.itc04DateRange)
  const token = LocalFunction.getLocalValue(globleVariable.tokenKey, true)

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
      ClearFilter: ClearFilter
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

  useEffect(() => {
    stepper != null && stepper.to(2);
  }, [stepper]);

  const location = useLocation();
  let { id } = useParams();

  let searchUrlValue = null;

  //** ITC-04 6 Columns
  const table4Columns = [
    {
      data: "isChecked",
      type: "checkbox",
      width: 25,
      readOnly: false,
    },
    {
      data: "gstinOfJW",
      title: "GSTIN of Job Worker (JW)",

    },
    {
      data: "state",
      title: "State (in case of unregistered JW) "
    },
    {
      data: "jobWorkerType",
      title: "Job Worker's Type",

    },

    {
      data: "challanNumber",
      title: "Challan Number",

    },
    {
      data: "challanDateLabel",
      title: "Challan Date",

    },
    {
      data: "typesOfGood",
      title: "Types of Goods",

    },
    {
      data: "descriptionOfGood",
      title: "Description of Goods",

    },
    {
      data: "uqc",
      title: "Unique Quantity Code (UQC)",

    },
    {
      data: "qty",
      title: "Quantity",

    },

    {
      data: "taxableValue",
      title: "Taxable Value(in Rupees)",

    },
    {
      data: "igst",
      title: "Integrated Tax Rate in (%)",

    },
    {
      data: "cgst",
      title: "Central Tax Rate in (%)",

    },
    {
      data: "sgst",
      title: "State/UT Tax Rate in (%)",

    },
    {
      data: "cess",
      title: "CESS",

    },
    {
      data: "action",
      title: "Action",
    },

  ];
  const table4ColumnsEmpty = [
    {
      data: "isChecked",
      title: '',
      width: 1,
      readOnly: true,
    },
    {
      data: "gstinOfJW",
      title: "GSTIN of Job Worker (JW)",

    },
    {
      data: "state",
      title: "State (in case of unregistered JW) "
    },
    {
      data: "jobWorkerType",
      title: "Job Worker's Type",

    },

    {
      data: "challanNumber",
      title: "Challan Number",

    },
    {
      data: "challanDateLabel",
      title: "Challan Date",

    },
    {
      data: "typesOfGood",
      title: "Types of Goods",

    },
    {
      data: "descriptionOfGood",
      title: "Description of Goods",

    },
    {
      data: "uqc",
      title: "Unique Quantity Code (UQC)",

    },
    {
      data: "qty",
      title: "Quantity",

    },

    {
      data: "taxableValue",
      title: "Taxable Value(in Rupees)",

    },
    {
      data: "igst",
      title: "Integrated Tax Rate in (%)",

    },
    {
      data: "cgst",
      title: "Central Tax Rate in (%)",

    },
    {
      data: "sgst",
      title: "State/UT Tax Rate in (%)",

    },
    {
      data: "cess",
      title: "CESS",

    },
    {
      data: "action",
      title: "Action",
    },

  ];
  const table5AColumns = [
    {
      data: "isChecked",
      type: "checkbox",
      width: 25,
      readOnly: false,
    },

    {
      data: "gstinOfJW",
      title: "GSTIN of Job Worker (JW)",
      readOnly: true,

    },
    {
      data: "state",
      title: "State (in case of unregistered JW)  ",
      readOnly: true,

    },
    {
      data: "challanNumber",
      title: "Original Challan Number issued by Principal",
      readOnly: true,

    },
    {
      data: "challanDateLabel",
      title: "Original Challan Date Issued by Principal",
      readOnly: true,

    },
    {
      data: "challanNumberByJW",
      title: "Challan Number issued by Job worker",
      readOnly: true,

    },
    {
      data: "challanDateByJWLabel",
      title: "Challan Date issued by worker",
      readOnly: true,

    },
    {
      data: "natureOfJobWork",
      title: "Nature of Job Work Done",
      readOnly: true,
      //   width:"500"

    },
    {
      data: "descriptionOfGood",
      title: "Description of Goods",
      readOnly: true,

    },

    {
      data: "uqc",
      title: "Unique Quantity Code (UQC)",
      readOnly: true,

    },
    {
      data: "qty",
      title: "Quantity",
      readOnly: true,
      //   width:"500"
    },
    {
      data: "lossUQC",
      title: "Losses and Wastes Unique Quantity Code (UQC)",
      readOnly: true,

    },
    {
      data: "lossQty",
      title: "Losses and Wastes Quantity",
      readOnly: true,

    },

    {
      data: "action",
      title: "Action",
      readOnly: true
    },

  ];
  const table5AColumnsEmpty = [
    {
      data: "isChecked",
      title: '',
      width: 1,
      readOnly: true,
    },

    {
      data: "gstinOfJW",
      title: "GSTIN of Job Worker (JW)",
      readOnly: true,

    },
    {
      data: "state",
      title: "State (in case of unregistered JW)  ",
      readOnly: true,

    },
    {
      data: "challanNumber",
      title: "Original Challan Number issued by Principal",
      readOnly: true,

    },
    {
      data: "challanDateLabel",
      title: "Original Challan Date Issued by Principal",
      readOnly: true,

    },
    {
      data: "challanNumberByJW",
      title: "Challan Number issued by Job worker",
      readOnly: true,

    },
    {
      data: "challanDateByJWLabel",
      title: "Challan Date issued by worker",
      readOnly: true,

    },
    {
      data: "natureOfJobWork",
      title: "Nature of Job Work Done",
      readOnly: true,
      //   width:"500"

    },
    {
      data: "descriptionOfGood",
      title: "Description of Goods",
      readOnly: true,

    },

    {
      data: "uqc",
      title: "Unique Quantity Code (UQC)",
      readOnly: true,

    },
    {
      data: "qty",
      title: "Quantity",
      readOnly: true,
      //   width:"500"
    },
    {
      data: "lossUQC",
      title: "Losses and Wastes Unique Quantity Code (UQC)",
      readOnly: true,

    },
    {
      data: "lossQty",
      title: "Losses and Wastes Quantity",
      readOnly: true,

    },

    {
      data: "action",
      title: "Action",
      readOnly: true
    },

  ];

  const table5BColumns = [
    {
      data: "isChecked",
      type: "checkbox",
      width: 25,
      readOnly: false,
    },

    {
      data: "gstinOfJW",
      title: "GSTIN of Job Worker (JW)",
      readOnly: true,

    },
    {
      data: "state",
      title: "State (in case of unregistered JW)",
      readOnly: true,

    },

    {
      data: "challanNumber",
      title: "Original Challan Number issued by Principal",
      readOnly: true,

    },
    {
      data: "challanDateLabel",
      title: "Original Challan Date Issued by Principal",
      readOnly: true,

    },
    {
      data: "challanNumberByJW",
      title: "Challan Number issued by Job worker",
      readOnly: true,

    },
    {
      data: "challanDateByJWLabel",
      title: "Challan Date issued by worker",
      readOnly: true,

    },

    {
      data: "natureOfJobWork",
      title: "Nature of Job Work Done",
      readOnly: true,

    },

    {
      data: "descriptionOfGood",
      title: "Description of Goods",
      readOnly: true,

    },

    {
      data: "uqc",
      title: "Unique Quantity Code (UQC)",
      readOnly: true,

    },
    {
      data: "qty",
      title: "Quantity",
      readOnly: true,

    },
    {
      data: "lossUQC",
      title: "Losses and Wastes Unique Quantity Code (UQC)",
      readOnly: true,

    },
    {
      data: "lossQty",
      title: "Losses and Wastes Quantity",
      readOnly: true,

    },

    {
      data: "action",
      title: "Action",
      readOnly: true,

    },

  ];

  const table5BColumnsEmpty = [
    {
      data: "isChecked",
      title: '',
      width: 1,
      readOnly: true,
    },

    {
      data: "gstinOfJW",
      title: "GSTIN of Job Worker (JW)",
      readOnly: true,

    },
    {
      data: "state",
      title: "State (in case of unregistered JW)",
      readOnly: true,

    },

    {
      data: "challanNumber",
      title: "Original Challan Number issued by Principal",
      readOnly: true,

    },
    {
      data: "challanDateLabel",
      title: "Original Challan Date Issued by Principal",
      readOnly: true,

    },
    {
      data: "challanNumberByJW",
      title: "Challan Number issued by Job worker",
      readOnly: true,

    },
    {
      data: "challanDateByJWLabel",
      title: "Challan Date issued by worker",
      readOnly: true,

    },

    {
      data: "natureOfJobWork",
      title: "Nature of Job Work Done",
      readOnly: true,

    },

    {
      data: "descriptionOfGood",
      title: "Description of Goods",
      readOnly: true,

    },

    {
      data: "uqc",
      title: "Unique Quantity Code (UQC)",
      readOnly: true,

    },
    {
      data: "qty",
      title: "Quantity",
      readOnly: true,

    },
    {
      data: "lossUQC",
      title: "Losses and Wastes Unique Quantity Code (UQC)",
      readOnly: true,

    },
    {
      data: "lossQty",
      title: "Losses and Wastes Quantity",
      readOnly: true,

    },

    {
      data: "action",
      title: "Action",
      readOnly: true,

    },

  ];
  const table5CColumns = [
    {
      data: "isChecked",
      type: "checkbox",
      width: 25,
      readOnly: false,
    },

    {
      data: "gstinOfJW",
      title: "GSTIN of Job Worker (JW)",
      readOnly: true,

    },
    {
      data: "state",
      title: "State (in case of unregistered JW)",
      readOnly: true,

    },

    {
      data: "challanNumber",
      title: "Original Challan Number issued by Principal",
      readOnly: true,

    },
    {
      data: "challanDateLabel",
      title: "Original Challan Date Issued by Principal",
      readOnly: true,

    },
    {
      data: "invoiceNumberByPrincipal",
      title: "Invoice Number issued by Principal",
      readOnly: true,

    },
    {
      data: "invoiceDateByPrincipalLabel",
      title: "Invoice Date issued by Principal",
      readOnly: true,

    },

    {
      data: "natureOfJobWork",
      title: "Nature of Job Work Done",
      readOnly: true,

    },

    {
      data: "descriptionOfGood",
      title: "Description of Goods",
      readOnly: true,

    },

    {
      data: "uqc",
      title: "Unique Quantity Code (UQC)",
      readOnly: true,

    },
    {
      data: "qty",
      title: "Quantity",
      readOnly: true,

    },
    {
      data: "lossUQC",
      title: "Losses and Wastes Unique Quantity Code (UQC)",
      readOnly: true,

    },
    {
      data: "lossQty",
      title: "Losses and Wastes Quantity",
      readOnly: true,

    },

    {
      data: "action",
      title: "Action",
      readOnly: true,

    },
  ];
  const table5CColumnsEmpty = [
    {
      data: "isChecked",
      title: '',
      width: 1,
      readOnly: true,
    },

    {
      data: "gstinOfJW",
      title: "GSTIN of Job Worker (JW)",
      readOnly: true,

    },
    {
      data: "state",
      title: "State (in case of unregistered JW)",
      readOnly: true,

    },

    {
      data: "challanNumber",
      title: "Original Challan Number issued by Principal",
      readOnly: true,

    },
    {
      data: "challanDateLabel",
      title: "Original Challan Date Issued by Principal",
      readOnly: true,

    },
    {
      data: "invoiceNumberByPrincipal",
      title: "Invoice Number issued by Principal",
      readOnly: true,

    },
    {
      data: "invoiceDateByPrincipalLabel",
      title: "Invoice Date issued by Principal",
      readOnly: true,

    },

    {
      data: "natureOfJobWork",
      title: "Nature of Job Work Done",
      readOnly: true,

    },

    {
      data: "descriptionOfGood",
      title: "Description of Goods",
      readOnly: true,

    },

    {
      data: "uqc",
      title: "Unique Quantity Code (UQC)",
      readOnly: true,

    },
    {
      data: "qty",
      title: "Quantity",
      readOnly: true,

    },
    {
      data: "lossUQC",
      title: "Losses and Wastes Unique Quantity Code (UQC)",
      readOnly: true,

    },
    {
      data: "lossQty",
      title: "Losses and Wastes Quantity",
      readOnly: true,

    },

    {
      data: "action",
      title: "Action",
      readOnly: true,

    },
  ];

  let finYear = null;
  let finMonth = null;
  let url = null;
  let typeOfInvoice = [];

  if (location.state !== null) {
    console.log(location, "locationnn")
    // finYear = location.state.finyear !== null && location.state.finyear !== "null" ? location.state.finyear : sessionStorage.getItem("purchaeFrdt")
    finYear = location.state.finyear !== null && location.state.finyear !== "null" && (itc04DateRange == null || itc04DateRange == undefined) ? location.state.finyear : itc04DateRange
    finMonth = location.state.finmonth !== null && location.state.finmonth !== "null" ? location.state.finmonth : itc04DateRange
    url = location.state.sectionId !== null && location.state.sectionId !== "null" ? location.state.sectionId : "",
      typeOfInvoice = location.state.sectionType !== null && location.state.sectionType !== "null" ? location.state.sectionType : []
  }

  let arrFilter = [];

  useEffect(() => {
    setPanData(YearList)
    setPanDataFrom(YearList)
  }, [])

  useEffect(() => {
    setbtnDisable1(false)
    console.log('display Search ' + displayType)
    if (displayType == true || displayType == "true") {

      const defaultValueFrom = panData?.filter((item) => item.value == finYear)[0];
      const defaultValueTo = panData?.filter((item) => item.value == finMonth)[0];
      console.log(defaultValueFrom, "defaultValueFromdefaultValueFrom")
      console.log(finYear, "finYearfinYear")
      if (defaultValueFrom !== undefined && defaultValueFrom !== null && defaultValueFrom !== "") {
        setFinFormYear(defaultValueFrom)
        // sessionStorage.setItem(globleVariable.cmp08DownloadDate, defaultValueFrom?.value)
      }
      if (defaultValueTo !== undefined && defaultValueTo !== null && defaultValueTo !== "") {
        setMonthFrom(defaultValueTo)
      }

      setSearchApi(true)
    }


  }, [displayType, activeTab])

  const selectFromYear = (value) => {
    setSelectedYear(value);
    setPage(0);
    setFinFormYear(value);
    const monthFr = monthFrom?.srNo > value?.srNo ? monthFrom : panDataFrom[0];
    setMonthFrom(monthFr);
    const x = panDataFrom?.filter(
      (item) => Number(item.srNo) >= Number(value.srNo)
    );
    sessionStorage.setItem(globleVariable.cmp08DownloadDate, value?.value)
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
      setServerSidePage(false)
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

    // setPage(0)
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
    itc04PurchaseInvoice
      .getITC04PurchasePagination(searchPayload)
      .then((res) => {
        console.log("this api is calling now var check", invType);
        if (res.status === 200) {
          setBlock(false)
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

  const hot = hotRef?.current?.hotInstance;
  // const filtersPlugin = hot?.getPlugin("filters");


  // ** B2b Tab
  const theader = (col, TH) => {
    if (col === 0 || col > 14) {
      const button = TH.children[0].children[0];
      button?.parentNode?.removeChild(button);
    }

    if (
      col == 9 ||
      col == 10 ||
      col == 11 ||
      col == 12 ||
      col == 13 ||
      col == 14
    ) {
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

        table4Columns.forEach((ele, index) => {
          const columnIndex = index;
          const buttonExists = document.querySelector(`.ht_clone_top thead th:nth-child(${columnIndex + 1}) button`);

          const columnMatchesCondition = Object.keys(finalObj).includes(ele.data);
          // uniq.some(col1 => ele?.data.includes(col1));

          // Check if column value is not null
          const columnValueValid = finalObj[ele.data] !== null && finalObj[ele.data] !== "";

          if (buttonExists && columnMatchesCondition && columnValueValid) {
            const TH = document.querySelector(`.tab-pane.active .ht_clone_top thead th:nth-child(${columnIndex + 1})`);
            console.log(TH, "THHHHH")
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
    if (col == 0 || col > 12) {
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

        table5AColumns.forEach((ele, index) => {
          const columnIndex = index;
          const buttonExists = document.querySelector(`.ht_clone_top thead th:nth-child(${columnIndex + 1}) button`);

          const columnMatchesCondition = Object.keys(finalObj).includes(ele.data);
          // uniq.some(col1 => ele?.data.includes(col1));

          // Check if column value is not null
          const columnValueValid = finalObj[ele.data] !== null && finalObj[ele.data] !== "";

          if (buttonExists && columnMatchesCondition && columnValueValid) {
            const TH = document.querySelector(`.tab-pane.active .ht_clone_top thead th:nth-child(${columnIndex + 1})`);
            console.log(TH, "THHHHH")
            if (TH) {
              TH.classList.add("htFiltersActive");
            } else {
              TH.classList.remove("htFiltersActive");
            }
          }
        });
      }
    }
    //  }
  };


  // ** CDN
  const theaderCdn = (col, TH) => {
    if (col == 0 || col > 12) {
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

        table5BColumns.forEach((ele, index) => {
          const columnIndex = index;
          const buttonExists = document.querySelector(`.ht_clone_top thead th:nth-child(${columnIndex + 1}) button`);

          const columnMatchesCondition = Object.keys(finalObj).includes(ele.data);
          // uniq.some(col1 => ele?.data.includes(col1));

          // Check if column value is not null
          const columnValueValid = finalObj[ele.data] !== null && finalObj[ele.data] !== "";

          if (buttonExists && columnMatchesCondition && columnValueValid) {
            const TH = document.querySelector(`.tab-pane.active .ht_clone_top thead th:nth-child(${columnIndex + 1})`);
            console.log(TH, "THHHHH")
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


  // ** CDNA
  const theaderCdna = (col, TH) => {
    if (col == 0 || col > 12) {
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

        table5CColumns.forEach((ele, index) => {
          const columnIndex = index;
          const buttonExists = document.querySelector(`.ht_clone_top thead th:nth-child(${columnIndex + 1}) button`);

          const columnMatchesCondition = Object.keys(finalObj).includes(ele.data);
          // uniq.some(col1 => ele?.data.includes(col1));

          // Check if column value is not null
          const columnValueValid = finalObj[ele.data] !== null && finalObj[ele.data] !== "";

          if (buttonExists && columnMatchesCondition && columnValueValid) {
            const TH = document.querySelector(`.tab-pane.active .ht_clone_top thead th:nth-child(${columnIndex + 1})`);
            console.log(TH, "THHHHH")
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

  // ** Distrubution
  const theaderDistrubution = (col, TH) => {
    if (col == 0 || col > 19) {
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
  };


  // ** Amend
  const theaderAmends = (col, TH) => {
    if (col == 0 || col > 23) {
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
          delArr.push(purchaseData[i].itC04Id);
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

          const deleteITC04Invoices = {
            userClientId: G_UCParId,
            financialYearId: G_FY,
            deletedBy: LocalFunction.getLocalValue(globleVariable.userId, true),
            itc04Id: delArr,
          };

          setBlock(true);
          itc04PurchaseInvoice
            .itc04PaginationDataDelete(deleteITC04Invoices)
            .then((res) => {
              if (
                res.status === 200 &&
                res.data.status === errorCodeConfig.APIDefaultCode.Success
              ) {
                setBlock(false);
                setCurrentCol1([]);
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
                toast.error(res.data.errorMessage, {
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
    // }
  };

  // purchase cell mouse down
  function localAfterOnCellMouseDown(event, coords, td) {
    let hot = null;

    if (activeTab == 1) {
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


    activeTab == 7 && setCurrentCol1b2cs(coords?.col);

    let handsontableColumns = null;

    if (activeTab == 1) {
      handsontableColumns = table4Columns;
    } else if (activeTab == 2) {
      handsontableColumns = table5AColumns;
    } else if (activeTab == 3) {
      handsontableColumns = table5BColumns;
    } else if (activeTab == 4) {
      handsontableColumns = table5CColumns;
    }

    //   setCurrentCol1(coords?.col);

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
        );
        if (searchInput !== null) {
          searchInput.children[0].value = "";
        }
      }, 100);
    }
    if (activeTab == 2) {
      const Index = currentCol?.findIndex(
        (item) => table5AColumns[coords?.col]?.data == item
      );
      if (Index != -1) {
        setTimeout(function () {
          var searchInput = document?.querySelector(
            ".htUIMultipleSelectSearch.htUIInput"
          );
          if (searchInput !== null) {
            searchInput.children[0].value = searchVal1[Index];
          }
        }, 100);
      } else {
        setTimeout(function () {
          var searchInput = document?.querySelector(
            ".htUIMultipleSelectSearch.htUIInput"
          );
          if (searchInput !== null) {
            searchInput.children[0].value = "";
          }
        }, 100);
      }
    }
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

  console.log(finFromYear?.value, "finFromYear")

  const ExportSectionWiseData = () => {
    console.log("export data");

    setBlock(true);

    const itc04SectionId =
      activeTab == 1
        ? 1
        : activeTab == 2
          ? 2
          : activeTab == 3
            ? 3
            : activeTab == 4
              ? 4
              : 0;

    console.log(finFromYear, "finFromYearsadfvgbvn")
    console.log(monthFrom, "monthFrom")

    itc04SummaryService
      .exportITC04ExportData(
        G_UCParId,
        finFromYear ? finFromYear?.value : "",
        finFromYear ? finFromYear?.label : "",
        itc04SectionId,
        token
      )
      .then((res) => {
        if (res?.status == 200 && res.data.status === errorCodeConfig.APIDefaultCode.Success) {
          console.log("res1", res?.data?.data);
          setBlock(false);
          downloadURL(res?.data?.data)

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
    isChecked = false
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
                            value={{ label: "Table 4", value: "table4" }}
                          />
                        </Col>
                        <Col sm={8}>
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
                            isDisabled={true}
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
                        <div>{console.log(purchaseData, "purchaseDAta")}</div>
                        {purchaseData.length > 0 ? (
                          <HotTable
                            id="table4"
                            viewportColumnRenderingOffset={100}
                            readOnly={true}
                            ref={hotRef}
                            rowHeights={RowSize}
                            columnHeaderHeight={columnHeaderSize}
                            autoWrapRow={true}
                            data={purchaseData}
                            autoColumnSize={true}
                            afterGetColHeader={theader}
                            colHeaders={colHeaders}
                            stretchH="all"
                            preventOverflow="horizontal"
                            columns={table4Columns}
                            contextMenu={false}
                            bindRowsWithHeaders={true}
                            licenseKey="non-commercial-and-evaluation"
                            height="auto"
                            afterOnCellMouseDown={localAfterOnCellMouseDown}
                            mergeCells={false}
                            hiddenColumns={false}
                            cells={function (row, col) {
                              var cp = {};
                              const hot = hotRef?.current?.hotInstance;
                              cp.className = "child";
                              if (
                                col == 9 ||
                                col == 10 ||
                                col == 11 ||
                                col == 12 ||
                                col == 13 ||
                                col == 14
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
                                    console.log(
                                      "noon col",
                                      hot.getSelected()[0][1],
                                      hot
                                    );
                                    return this.getSelected()[0][1] == 5;
                                  },
                                },

                                option5: {
                                  name: `Select Date <br><input type='date' min='2017-07-01' max=${new Date()
                                    .toISOString()
                                    .slice(
                                      0,
                                      10
                                    )}  class='custom-date col-md-11' placeholder='DD-MM-YYYY' id='custom1' name='date' value=${searchDate} >`,
                                  hidden() {
                                    return this.getSelectedRangeLast().to.col != 5;
                                  },

                                  //disabled: true,
                                  callback: function (key, selection, clickEvent) {
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
                                  name: `<button id='btnClear' name='Clear' tabIndex="-1"    value='Clear'>Clear</button>`,
                                  //disabled: true,
                                  callback: function (key, selection, clickEvent) {
                                    console.log("date picker clicked");
                                    var src = clickEvent.target;
                                    console.log("name", src.tagName);
                                    if (src.tagName.toLowerCase() === "button") {
                                      if (clickEvent.target.id == "btnClear") {
                                        const hot = hotRef?.current?.hotInstance;

                                        if (hot.getSelected()[0][1] != 5) {
                                          var searchInput = document.querySelector(
                                            ".htUIMultipleSelectSearch.htUIInput"
                                          );
                                          var value = "";
                                        } else {
                                          var searchInput1 =
                                            document.getElementById("custom1");
                                          var value = "";
                                          setSearchDate(value);
                                        }
                                        const x = searchVal1;
                                        if (!searchVal1?.length) {
                                          x.push(value);
                                          let y = currentCol;
                                          y.push(
                                            table4Columns[currentCol1]?.data
                                          );
                                          // console.log("jsx=",x,y)
                                          setSearchVal1(x);
                                          setCurrentCol(y);
                                        } else {
                                          const Index = currentCol?.findIndex(
                                            (item) =>
                                              table4Columns[currentCol1]?.data ==
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
                                              table4Columns[currentCol1]?.data
                                            );
                                            // console.log("jsx=",x,y)
                                            setSearchVal1(x);
                                            setCurrentCol(y);
                                          }
                                        }

                                        purchaseSummaryList(activeTab, '', "asc", invoceTypes?.value, finFromYear?.value, monthFrom?.value, '', 1)


                                      }
                                      clickEvent.stopImmediatePropagation();
                                    }
                                    clickEvent.stopImmediatePropagation();
                                  },
                                },
                                filter_action_bar: {},
                              },
                            }}
                            afterFilter={function (data) {
                              const hot = hotRef?.current?.hotInstance;
                              if (hot.getSelected()[0][1] != 5) {
                                var searchInput = document.querySelector(
                                  ".htUIMultipleSelectSearch.htUIInput"
                                );
                                var value = searchInput.children[0].value;
                              } else {
                                var searchInput1 = document.getElementById("custom1");
                                var value = searchInput1.value;
                                setSearchDate(value);
                              }
                              const x = searchVal1;
                              if (!searchVal1?.length) {
                                x.push(value);
                                let y = currentCol;
                                y.push(table4Columns[currentCol1]?.data);
                                // console.log("jsx=",x,y)
                                setSearchVal1(x);
                                setCurrentCol(y);
                              } else {
                                const Index = currentCol?.findIndex(
                                  (item) =>
                                    table4Columns[currentCol1]?.data == item
                                );
                                if (Index != -1) {
                                  const xyz = searchVal1;
                                  xyz[Index] = value;
                                  setSearchVal1(xyz);
                                } else {
                                  x.push(value);
                                  let y = currentCol;
                                  y.push(table4Columns[currentCol1]?.data);
                                  // console.log("jsx=",x,y)
                                  setSearchVal1(x);
                                  setCurrentCol(y);
                                }
                              }
                              setPage(0);
                              purchaseSummaryList(activeTab, '', "asc", invoceTypes?.value, finFromYear?.value, monthFrom?.value, '', 1)

                            }}
                          />
                        ) : (
                          <HotTable
                            id="table4"
                            readOnly={true}
                            viewportColumnRenderingOffset={100}
                            autoWrapRow={true}
                            rowHeights={RowSize}
                            columnHeaderHeight={columnHeaderSize}
                            // style={{ textAlign: "center", overflowX: "hidden" }}
                            data={[{ gstinOfJW: "No Data Found!" }]}
                            autoColumnSize={true}
                            afterGetColHeader={theader}
                            colHeaders={colHeaders}
                            stretchH="all"
                            preventOverflow="horizontal"
                            columns={table4ColumnsEmpty}
                            contextMenu={false}
                            bindRowsWithHeaders={true}
                            licenseKey="non-commercial-and-evaluation"
                            height="auto"
                            ref={hotRef}
                            filters={true}
                            afterOnCellMouseDown={localAfterOnCellMouseDown}
                            mergeCells={[
                              { row: 0, col: 1, rowspan: 1, colspan: 8 },
                            ]}
                            hiddenColumns={{
                              columns: [0],
                            }}
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
                              if (col == 1) {

                                cp.className = "text-center";
                              }
                              return cp;
                            }}
                            dropdownMenu={{
                              items: {
                                filter_by_value: {
                                  name: "Search Value",
                                  // hide the 'Filter by value' list from all columns but the first one
                                  hidden() {
                                    const hot = hotRef?.current?.hotInstance;
                                    console.log(
                                      "noon col",
                                      hot.getSelected()[0][1],
                                      hot
                                    );
                                    return this.getSelected()[0][1] == 5;
                                  },
                                },

                                option5: {
                                  name: `Select Date <br><input type='date' min='2017-07-01' max=${new Date()
                                    .toISOString()
                                    .slice(
                                      0,
                                      10
                                    )}  class='custom-date col-md-11' placeholder='DD-MM-YYYY' id='custom1' name='date' value=${searchDate} >`,
                                  hidden() {
                                    return this.getSelectedRangeLast().to.col != 5;
                                  },

                                  //disabled: true,
                                  callback: function (key, selection, clickEvent) {
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
                                  name: `<button id='btnClear' name='Clear' tabIndex="-1"    value='Clear'>Clear</button>`,
                                  //disabled: true,
                                  callback: function (key, selection, clickEvent) {
                                    console.log("date picker clicked");
                                    var src = clickEvent.target;
                                    console.log("name", src.tagName);
                                    if (src.tagName.toLowerCase() === "button") {
                                      if (clickEvent.target.id == "btnClear") {
                                        const hot = hotRef?.current?.hotInstance;

                                        if (hot.getSelected()[0][1] != 5) {
                                          var searchInput = document.querySelector(
                                            ".htUIMultipleSelectSearch.htUIInput"
                                          );
                                          var value = "";
                                        } else {
                                          var searchInput1 =
                                            document.getElementById("custom1");
                                          var value = "";
                                          setSearchDate(value);
                                        }
                                        const x = searchVal1;
                                        if (!searchVal1?.length) {
                                          x.push(value);
                                          let y = currentCol;
                                          y.push(
                                            table4Columns[currentCol1]?.data
                                          );
                                          // console.log("jsx=",x,y)
                                          setSearchVal1(x);
                                          setCurrentCol(y);
                                        } else {
                                          const Index = currentCol?.findIndex(
                                            (item) =>
                                              table4Columns[currentCol1]?.data ==
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
                                              table4Columns[currentCol1]?.data
                                            );
                                            // console.log("jsx=",x,y)
                                            setSearchVal1(x);
                                            setCurrentCol(y);
                                          }
                                        }

                                        purchaseSummaryList(activeTab, '', "asc", invoceTypes?.value, finFromYear?.value, monthFrom?.value, '', 1)


                                      }
                                      clickEvent.stopImmediatePropagation();
                                    }
                                    clickEvent.stopImmediatePropagation();
                                  },
                                },
                                filter_action_bar: {},
                              },
                            }}
                            afterFilter={function (data) {
                              const hot = hotRef?.current?.hotInstance;
                              if (hot.getSelected()[0][1] != 5) {
                                var searchInput = document.querySelector(
                                  ".htUIMultipleSelectSearch.htUIInput"
                                );
                                var value = searchInput.children[0].value;
                              } else {
                                var searchInput1 = document.getElementById("custom1");
                                var value = searchInput1.value;
                                setSearchDate(value);
                              }
                              const x = searchVal1;
                              if (!searchVal1?.length) {
                                x.push(value);
                                let y = currentCol;
                                y.push(table4Columns[currentCol1]?.data);
                                // console.log("jsx=",x,y)
                                setSearchVal1(x);
                                setCurrentCol(y);
                              } else {
                                const Index = currentCol?.findIndex(
                                  (item) =>
                                    table4Columns[currentCol1]?.data == item
                                );
                                if (Index != -1) {
                                  const xyz = searchVal1;
                                  xyz[Index] = value;
                                  setSearchVal1(xyz);
                                } else {
                                  x.push(value);
                                  let y = currentCol;
                                  y.push(table4Columns[currentCol1]?.data);
                                  // console.log("jsx=",x,y)
                                  setSearchVal1(x);
                                  setCurrentCol(y);
                                }
                              }
                              setPage(0)
                              purchaseSummaryList(activeTab, '', "asc", invoceTypes?.value, finFromYear?.value, monthFrom?.value, '', 1)

                            }}
                          />
                        )}

                        {
                          purchaseData &&
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
                        }
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
                          <Col sm={4}>
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
                              value={{ label: "Table 5A", value: "table5A" }}
                            />
                          </Col>
                          <Col sm={8}>
                            <Label className="form-label">
                              Select Return Period
                            </Label>
                            <Select
                              id="from1"
                              placeholder="From"
                              isClearable={false}
                              theme={selectThemeColors}
                              closeMenuOnSelect={true}
                              options={panDataFrom}
                              className="basic-multi-select"
                              classNamePrefix="select"
                              isDisabled={true}
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
                        {purchaseData.length > 0 ? (
                          <HotTable
                            id="table5A"
                            viewportColumnRenderingOffset={100}
                            autoWrapRow={true}
                            readOnly={true}
                            rowHeights={RowSize}
                            columnHeaderHeight={columnHeaderSize}
                            data={purchaseData}
                            // data={data.slice(0, 11)}
                            autoColumnSize={true}
                            afterGetColHeader={theaderITC}
                            afterOnCellMouseDown={localAfterOnCellMouseDown}
                            colHeaders={colHeaders}
                            stretchH="all"
                            preventOverflow="horizontal"
                            columns={table5AColumns}
                            contextMenu={false}
                            bindRowsWithHeaders={true}
                            licenseKey="non-commercial-and-evaluation"
                            height="auto"
                            ref={hotRef1}
                            hiddenColumns={false}
                            mergeCells={false}
                            cells={function (row, col) {
                              var cp = {};

                              cp.className = "child";
                              if (col == 7 || col == 10 || col == 11 || col == 12 || col == 13 || col == 14 || col == 15) {
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
                                    return this.getSelected()[0][1] == 4 || this.getSelected()[0][1] == 6;
                                  },
                                },

                                option5: {
                                  name: `Select Date <br><input type='date' min='2017-07-01' max=${new Date()
                                    .toISOString()
                                    .slice(
                                      0,
                                      10
                                    )}  class='custom-date col-md-11' placeholder='DD-MM-YYYY' id='custom1' name='date' value=${searchDate} >`,
                                  hidden() {
                                    return this.getSelectedRangeLast().to.col != 4;
                                  },

                                  //disabled: true,
                                  callback: function (key, selection, clickEvent) {
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


                                option6: {
                                  name: `Select Date <br><input type='date' min='2017-07-01' max=${new Date()
                                    .toISOString()
                                    .slice(
                                      0,
                                      10
                                    )}  class='custom-date col-md-11' placeholder='DD-MM-YYYY' id='custom1' name='date' value=${searchDate} >`,
                                  hidden() {
                                    return this.getSelectedRangeLast().to.col != 6;
                                  },

                                  //disabled: true,
                                  callback: function (key, selection, clickEvent) {
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


                                    clickEvent.stopImmediatePropagation();
                                  },
                                },

                                clear: {
                                  name: `<button id='btnClear' name='Clear' tabIndex="-1"    value='Clear'>Clear</button>`,
                                  //disabled: true,
                                  callback: function (key, selection, clickEvent) {
                                    console.log("date picker clicked");
                                    var src = clickEvent.target;
                                    console.log("name", src.tagName);
                                    if (src.tagName.toLowerCase() === "button") {
                                      if (clickEvent.target.id == "btnClear") {
                                        const hot = hotRef1?.current?.hotInstance;

                                        if (hot.getSelected()[0][1] !== 4 || hot.getSelected()[0][1] !== 6) {
                                          var searchInput = document.querySelector(
                                            ".htUIMultipleSelectSearch.htUIInput"
                                          );
                                          var value = "";
                                        } else {
                                          var searchInput1 =
                                            document.getElementById("custom1");
                                          var value = "";
                                          setSearchDate(value);
                                        }
                                        const x = searchVal1;
                                        if (!searchVal1?.length) {
                                          x.push(value);
                                          let y = currentCol;
                                          y.push(
                                            table5AColumns[currentCol1]?.data
                                          );
                                          // console.log("jsx=",x,y)
                                          setSearchVal1(x);
                                          setCurrentCol(y);
                                        } else {
                                          const Index = currentCol?.findIndex(
                                            (item) =>
                                              table5AColumns[currentCol1]?.data ==
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
                                              table5AColumns[currentCol1]?.data
                                            );
                                            // console.log("jsx=",x,y)
                                            setSearchVal1(x);
                                            setCurrentCol(y);
                                          }
                                        }

                                        purchaseSummaryList(activeTab, '', "asc", crdrInvoiceType?.value, finFromYear?.value, monthFrom?.value, '', 1)

                                      }
                                      clickEvent.stopImmediatePropagation();
                                    }
                                    clickEvent.stopImmediatePropagation();
                                  },
                                },
                                filter_action_bar: {},
                              },
                            }}
                            afterFilter={function (data) {
                              const hot = hotRef1?.current?.hotInstance;
                              if (hot.getSelected()[0][1] !== 4 && hot.getSelected()[0][1] !== 6) {
                                var searchInput = document.querySelector(
                                  ".htUIMultipleSelectSearch.htUIInput"
                                );
                                var value = searchInput.children[0].value;
                              } else {
                                var searchInput1 = document.getElementById("custom1");
                                var value = searchInput1.value;
                                setSearchDate(value);
                              }
                              const x = searchVal1;
                              if (!searchVal1?.length) {
                                x.push(value);
                                let y = currentCol;
                                y.push(table5AColumns[currentCol1]?.data);
                                // console.log("jsx=",x,y)
                                setSearchVal1(x);
                                setCurrentCol(y);
                              } else {
                                const Index = currentCol?.findIndex(
                                  (item) =>
                                    table5AColumns[currentCol1]?.data == item
                                );
                                if (Index != -1) {
                                  const xyz = searchVal1;
                                  xyz[Index] = value;
                                  setSearchVal1(xyz);
                                } else {
                                  x.push(value);
                                  let y = currentCol;
                                  y.push(table5AColumns[currentCol1]?.data);
                                  // console.log("jsx=",x,y)
                                  setSearchVal1(x);
                                  setCurrentCol(y);
                                }
                              }
                              setPage(0);
                              purchaseSummaryList(activeTab, '', "asc", crdrInvoiceType?.value, finFromYear?.value, monthFrom?.value, '', 1)
                            }}
                          />
                        ) : (
                          <HotTable
                            id="table5A"
                            viewportColumnRenderingOffset={100}
                            autoWrapRow={true}
                            readOnly={true}
                            rowHeights={RowSize}
                            columnHeaderHeight={columnHeaderSize}
                            // style={{ textAlign: "center", overflowX: "hidden" }}
                            data={[{ gstinOfJW: "No Data Found!" }]}
                            autoColumnSize={true}
                            afterGetColHeader={theaderITC}
                            colHeaders={colHeaders}
                            stretchH="all"
                            preventOverflow="horizontal"
                            columns={table5AColumnsEmpty}
                            contextMenu={false}
                            bindRowsWithHeaders={true}
                            licenseKey="non-commercial-and-evaluation"
                            height="auto"
                            ref={hotRef1}
                            afterOnCellMouseDown={localAfterOnCellMouseDown}
                            mergeCells={[
                              { row: 0, col: 1, rowspan: 1, colspan: 6 },
                            ]}
                            // hiddenColumns={{
                            //   columns: [0],
                            // }}
                            cells={function (row, col) {
                              var cp = {};
                              const hot = hotRef1?.current?.hotInstance;
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
                              if (col == 1) {

                                cp.className = "text-center";
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
                                    return this.getSelected()[0][1] == 4 || this.getSelected()[0][1] == 6;
                                  },
                                },

                                option5: {
                                  name: `Select Date <br><input type='date' min='2017-07-01' max=${new Date()
                                    .toISOString()
                                    .slice(
                                      0,
                                      10
                                    )}  class='custom-date col-md-11' placeholder='DD-MM-YYYY' id='custom1' name='date' value=${searchDate} >`,
                                  hidden() {
                                    return this.getSelectedRangeLast().to.col != 4;
                                  },

                                  //disabled: true,
                                  callback: function (key, selection, clickEvent) {
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


                                option6: {
                                  name: `Select Date <br><input type='date' min='2017-07-01' max=${new Date()
                                    .toISOString()
                                    .slice(
                                      0,
                                      10
                                    )}  class='custom-date col-md-11' placeholder='DD-MM-YYYY' id='custom1' name='date' value=${searchDate} >`,
                                  hidden() {
                                    return this.getSelectedRangeLast().to.col != 6;
                                  },

                                  //disabled: true,
                                  callback: function (key, selection, clickEvent) {
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
                                  name: `<button id='btnClear' name='Clear' tabIndex="-1"   value='Clear'>Clear</button>`,
                                  //disabled: true,
                                  callback: function (key, selection, clickEvent) {
                                    console.log("date picker clicked");
                                    var src = clickEvent.target;
                                    console.log("name", src.tagName);
                                    if (src.tagName.toLowerCase() === "button") {
                                      if (clickEvent.target.id == "btnClear") {
                                        const hot = hotRef1?.current?.hotInstance;

                                        if (hot.getSelected()[0][1] !== 4 || hot.getSelected()[0][1] !== 6) {
                                          var searchInput = document.querySelector(
                                            ".htUIMultipleSelectSearch.htUIInput"
                                          );
                                          var value = "";
                                        } else {
                                          var searchInput1 =
                                            document.getElementById("custom1");
                                          var value = "";
                                          setSearchDate(value);
                                        }
                                        const x = searchVal1;
                                        if (!searchVal1?.length) {
                                          x.push(value);
                                          let y = currentCol;
                                          y.push(
                                            table5AColumns[currentCol1]?.data
                                          );
                                          // console.log("jsx=",x,y)
                                          setSearchVal1(x);
                                          setCurrentCol(y);
                                        } else {
                                          const Index = currentCol?.findIndex(
                                            (item) =>
                                              table5AColumns[currentCol1]?.data ==
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
                                              table5AColumns[currentCol1]?.data
                                            );
                                            // console.log("jsx=",x,y)
                                            setSearchVal1(x);
                                            setCurrentCol(y);
                                          }
                                        }

                                        purchaseSummaryList(activeTab, '', "asc", crdrInvoiceType?.value, finFromYear?.value, monthFrom?.value, '', 1)

                                      }
                                      clickEvent.stopImmediatePropagation();
                                    }
                                    clickEvent.stopImmediatePropagation();
                                  },
                                },
                                filter_action_bar: {},
                              },
                            }}
                            afterFilter={function (data) {
                              const hot = hotRef1?.current?.hotInstance;
                              if (hot.getSelected()[0][1] !== 4 && hot.getSelected()[0][1] !== 6) {
                                var searchInput = document.querySelector(
                                  ".htUIMultipleSelectSearch.htUIInput"
                                );
                                var value = searchInput.children[0].value;
                              } else {
                                var searchInput1 = document.getElementById("custom1");
                                var value = searchInput1.value;
                                setSearchDate(value);
                              }
                              const x = searchVal1;
                              if (!searchVal1?.length) {
                                x.push(value);
                                let y = currentCol;
                                y.push(table5AColumns[currentCol1]?.data);
                                // console.log("jsx=",x,y)
                                setSearchVal1(x);
                                setCurrentCol(y);
                              } else {
                                const Index = currentCol?.findIndex(
                                  (item) =>
                                    table5AColumns[currentCol1]?.data == item
                                );
                                if (Index != -1) {
                                  const xyz = searchVal1;
                                  xyz[Index] = value;
                                  setSearchVal1(xyz);
                                } else {
                                  x.push(value);
                                  let y = currentCol;
                                  y.push(table5AColumns[currentCol1]?.data);
                                  // console.log("jsx=",x,y)
                                  setSearchVal1(x);
                                  setCurrentCol(y);
                                }
                              }
                              setPage(0);
                              purchaseSummaryList(activeTab, '', "asc", crdrInvoiceType?.value, finFromYear?.value, monthFrom?.value, '', 1)
                            }}
                          />
                        )}
                        {
                          purchaseData &&
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
                        }
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
                            isDisabled={true}
                            value={{ label: "Table 5B", value: "table5B" }}
                            // className="basic-multi-select"
                            classNamePrefix="select"
                            onChange={filterInvoiceTypeB2cs}
                          //onChange={setInvoceTypes}
                          />
                        </Col>
                        <Col sm={8}>
                          <Label className="form-label">
                            Select Return Period
                          </Label>
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
                            isDisabled={true}
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
                        {purchaseData.length > 0 ? (
                          <HotTable
                            id="table5B"
                            viewportColumnRenderingOffset={100}
                            readOnly={true}
                            autoWrapRow={true}
                            data={purchaseData}
                            rowHeights={RowSize}
                            columnHeaderHeight={columnHeaderSize}
                            autoColumnSize={true}
                            stretchH="all"
                            colHeaders={colHeaders}
                            afterGetColHeader={theaderCdn}
                            preventOverflow="horizontal"
                            columns={table5BColumns}
                            contextMenu={false}
                            bindRowsWithHeaders={true}
                            licenseKey="non-commercial-and-evaluation"
                            height="auto"
                            ref={hotRef2}
                            afterOnCellMouseDown={localAfterOnCellMouseDown}
                            mergeCells={false}
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
                                    console.log(
                                      "noon col",
                                      hot.getSelected()[0][1],
                                      hot
                                    );
                                    return this.getSelected()[0][1] == 4 || this.getSelected()[0][1] == 6;
                                  },
                                },

                                option5: {
                                  name: `Select Date <br><input type='date' min='2017-07-01' max=${new Date()
                                    .toISOString()
                                    .slice(
                                      0,
                                      10
                                    )}  class='custom-date col-md-11' placeholder='DD-MM-YYYY' id='custom1' name='date' value=${searchDate} >`,
                                  hidden() {
                                    return this.getSelectedRangeLast().to.col != 4;
                                  },

                                  //disabled: true,
                                  callback: function (key, selection, clickEvent) {
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


                                option6: {
                                  name: `Select Date <br><input type='date' min='2017-07-01' max=${new Date()
                                    .toISOString()
                                    .slice(
                                      0,
                                      10
                                    )}  class='custom-date col-md-11' placeholder='DD-MM-YYYY' id='custom1' name='date' value=${searchDate} >`,
                                  hidden() {
                                    return this.getSelectedRangeLast().to.col != 6;
                                  },

                                  //disabled: true,
                                  callback: function (key, selection, clickEvent) {
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


                                    clickEvent.stopImmediatePropagation();
                                  },
                                },

                                clear: {
                                  name: `<button id='btnClear' name='Clear' tabIndex="-1"   value='Clear'>Clear</button>`,
                                  //disabled: true,
                                  callback: function (key, selection, clickEvent) {
                                    console.log("date picker clicked");
                                    var src = clickEvent.target;
                                    console.log("name", src.tagName);
                                    if (src.tagName.toLowerCase() === "button") {
                                      if (clickEvent.target.id == "btnClear") {
                                        const hot = hotRef2?.current?.hotInstance;

                                        if (hot.getSelected()[0][1] !== 4 || hot.getSelected()[0][1] !== 6) {
                                          var searchInput = document.querySelector(
                                            ".htUIMultipleSelectSearch.htUIInput"
                                          );
                                          var value = "";
                                        } else {
                                          var searchInput1 =
                                            document.getElementById("custom1");
                                          var value = "";
                                          setSearchDate(value);
                                        }
                                        const x = searchVal1;
                                        if (!searchVal1?.length) {
                                          x.push(value);
                                          let y = currentCol;
                                          y.push(
                                            table5BColumns[currentCol1]?.data
                                          );
                                          // console.log("jsx=",x,y)
                                          setSearchVal1(x);
                                          setCurrentCol(y);
                                        } else {
                                          const Index = currentCol?.findIndex(
                                            (item) =>
                                              table5BColumns[currentCol1]?.data ==
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
                                              table5BColumns[currentCol1]?.data
                                            );
                                            // console.log("jsx=",x,y)
                                            setSearchVal1(x);
                                            setCurrentCol(y);
                                          }
                                        }

                                        purchaseSummaryList(activeTab, '', "asc", b2csInvoiceType?.value, finFromYear?.value, monthFrom?.value, '', 1)

                                      }
                                      clickEvent.stopImmediatePropagation();
                                    }
                                    clickEvent.stopImmediatePropagation();
                                  },
                                },
                                filter_action_bar: {},
                              },
                            }}
                            afterFilter={function (data) {
                              const hot = hotRef2?.current?.hotInstance;
                              if (hot.getSelected()[0][1] !== 4 && hot.getSelected()[0][1] !== 6) {
                                var searchInput = document.querySelector(
                                  ".htUIMultipleSelectSearch.htUIInput"
                                );
                                var value = searchInput.children[0].value;
                              } else {
                                var searchInput1 = document.getElementById("custom1");
                                var value = searchInput1.value;
                                setSearchDate(value);
                              }
                              const x = searchVal1;
                              if (!searchVal1?.length) {
                                x.push(value);
                                let y = currentCol;
                                y.push(table5BColumns[currentCol1]?.data);
                                // console.log("jsx=",x,y)
                                setSearchVal1(x);
                                setCurrentCol(y);
                              } else {
                                const Index = currentCol?.findIndex(
                                  (item) =>
                                    table5BColumns[currentCol1]?.data == item
                                );
                                if (Index != -1) {
                                  const xyz = searchVal1;
                                  xyz[Index] = value;
                                  setSearchVal1(xyz);
                                } else {
                                  x.push(value);
                                  let y = currentCol;
                                  y.push(table5BColumns[currentCol1]?.data);
                                  // console.log("jsx=",x,y)
                                  setSearchVal1(x);
                                  setCurrentCol(y);
                                }
                              }
                              setPage(0);
                              purchaseSummaryList(activeTab, '', "asc", b2csInvoiceType?.value, finFromYear?.value, monthFrom?.value, '', 1)
                            }}
                          />
                        ) : (
                          <HotTable
                            id="table5B"
                            viewportColumnRenderingOffset={100}
                            autoWrapRow={true}
                            readOnly={true}
                            rowHeights={RowSize}
                            columnHeaderHeight={columnHeaderSize}
                            // data={cdnData}
                            // style={{ textAlign: "center", overflowX: "hidden" }}
                            data={[{ gstinOfJW: "No Data Found!" }]}
                            // data={data.slice(0, 11)}
                            autoColumnSize={true}
                            stretchH="all"
                            afterGetColHeader={theaderCdn}
                            preventOverflow="horizontal"
                            columns={table5BColumnsEmpty}
                            contextMenu={false}
                            bindRowsWithHeaders={true}
                            licenseKey="non-commercial-and-evaluation"
                            height="auto"
                            ref={hotRef2}
                            afterOnCellMouseDown={localAfterOnCellMouseDown}
                            mergeCells={[
                              { row: 0, col: 1, rowspan: 1, colspan: 6 },
                            ]}
                            hiddenColumns={{
                              columns: [0],
                            }}
                            cells={function (row, col) {
                              var cp = {};
                              const hot = hotRef2?.current?.hotInstance;
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
                              if (col == 1) {

                                cp.className = "text-center";
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
                                    return this.getSelected()[0][1] == 4 || this.getSelected()[0][1] == 6;
                                  },
                                },

                                option5: {
                                  name: `Select Date <br><input type='date' min='2017-07-01' max=${new Date()
                                    .toISOString()
                                    .slice(
                                      0,
                                      10
                                    )}  class='custom-date col-md-11' placeholder='DD-MM-YYYY' id='custom1' name='date' value=${searchDate} >`,
                                  hidden() {
                                    return this.getSelectedRangeLast().to.col != 4;
                                  },

                                  //disabled: true,
                                  callback: function (key, selection, clickEvent) {
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


                                option6: {
                                  name: `Select Date <br><input type='date' min='2017-07-01' max=${new Date()
                                    .toISOString()
                                    .slice(
                                      0,
                                      10
                                    )}  class='custom-date col-md-11' placeholder='DD-MM-YYYY' id='custom1' name='date' value=${searchDate} >`,
                                  hidden() {
                                    return this.getSelectedRangeLast().to.col != 6;
                                  },

                                  //disabled: true,
                                  callback: function (key, selection, clickEvent) {
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


                                    clickEvent.stopImmediatePropagation();
                                  },
                                },

                                clear: {
                                  name: `<button id='btnClear' name='Clear' tabIndex="-1"    value='Clear'>Clear</button>`,
                                  //disabled: true,
                                  callback: function (key, selection, clickEvent) {
                                    console.log("date picker clicked");
                                    var src = clickEvent.target;
                                    console.log("name", src.tagName);
                                    if (src.tagName.toLowerCase() === "button") {
                                      if (clickEvent.target.id == "btnClear") {
                                        const hot = hotRef2?.current?.hotInstance;

                                        if (hot.getSelected()[0][1] !== 4 || hot.getSelected()[0][1] !== 6) {
                                          var searchInput = document.querySelector(
                                            ".htUIMultipleSelectSearch.htUIInput"
                                          );
                                          var value = "";
                                        } else {
                                          var searchInput1 =
                                            document.getElementById("custom1");
                                          var value = "";
                                          setSearchDate(value);
                                        }
                                        const x = searchVal1;
                                        if (!searchVal1?.length) {
                                          x.push(value);
                                          let y = currentCol;
                                          y.push(
                                            table5BColumns[currentCol1]?.data
                                          );
                                          // console.log("jsx=",x,y)
                                          setSearchVal1(x);
                                          setCurrentCol(y);
                                        } else {
                                          const Index = currentCol?.findIndex(
                                            (item) =>
                                              table5BColumns[currentCol1]?.data ==
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
                                              table5BColumns[currentCol1]?.data
                                            );
                                            // console.log("jsx=",x,y)
                                            setSearchVal1(x);
                                            setCurrentCol(y);
                                          }
                                        }

                                        purchaseSummaryList(activeTab, '', "asc", b2csInvoiceType?.value, finFromYear?.value, monthFrom?.value, '', 1)

                                      }
                                      clickEvent.stopImmediatePropagation();
                                    }
                                    clickEvent.stopImmediatePropagation();
                                  },
                                },
                                filter_action_bar: {},
                              },
                            }}
                            afterFilter={function (data) {
                              const hot = hotRef2?.current?.hotInstance;
                              if (hot.getSelected()[0][1] !== 4 && hot.getSelected()[0][1] !== 6) {
                                var searchInput = document.querySelector(
                                  ".htUIMultipleSelectSearch.htUIInput"
                                );
                                var value = searchInput.children[0].value;
                              } else {
                                var searchInput1 = document.getElementById("custom1");
                                var value = searchInput1.value;
                                setSearchDate(value);
                              }
                              const x = searchVal1;
                              if (!searchVal1?.length) {
                                x.push(value);
                                let y = currentCol;
                                y.push(table5BColumns[currentCol1]?.data);
                                // console.log("jsx=",x,y)
                                setSearchVal1(x);
                                setCurrentCol(y);
                              } else {
                                const Index = currentCol?.findIndex(
                                  (item) =>
                                    table5BColumns[currentCol1]?.data == item
                                );
                                if (Index != -1) {
                                  const xyz = searchVal1;
                                  xyz[Index] = value;
                                  setSearchVal1(xyz);
                                } else {
                                  x.push(value);
                                  let y = currentCol;
                                  y.push(table5BColumns[currentCol1]?.data);
                                  // console.log("jsx=",x,y)
                                  setSearchVal1(x);
                                  setCurrentCol(y);
                                }
                              }
                              setPage(0);
                              purchaseSummaryList(activeTab, '', "asc", b2csInvoiceType?.value, finFromYear?.value, monthFrom?.value, '', 1)
                            }}
                          />
                        )}
                        {
                          purchaseData &&
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
                        }
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
                        <Col sm={4}>
                          <Label className="form-label">Invoice Type</Label>
                          <Select
                            id="purchaseId_invtype"
                            placeholder="Invoice Type"
                            theme={selectThemeColors}
                            // closeMenuOnSelect={false}
                            components={animatedComponents}
                            //  isMulti
                            options={atInvoiceTypeList}
                            value={{ label: "Table 5C", value: "table5C" }}
                            // className="basic-multi-select"
                            classNamePrefix="select"
                            onChange={filterInvoiceTypeAt}
                            isDisabled={true}
                          //onChange={setInvoceTypes}
                          />
                        </Col>
                        <Col sm={8}>
                          <Label className="form-label">
                            Select Return Period
                          </Label>
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
                            isDisabled={true}
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
                        {purchaseData?.length > 0 ? (
                          <HotTable
                            id="table5C"
                            autoWrapRow={true}
                            viewportColumnRenderingOffset={100}
                            readOnly={true}
                            data={purchaseData}
                            rowHeights={RowSize}
                            columnHeaderHeight={columnHeaderSize}
                            autoColumnSize={true}
                            colHeaders={colHeaders}
                            afterGetColHeader={theaderCdna}
                            stretchH="all"
                            preventOverflow="horizontal"
                            columns={table5CColumns}
                            contextMenu={false}
                            bindRowsWithHeaders={true}
                            licenseKey="non-commercial-and-evaluation"
                            height="auto"
                            ref={hotRef3}
                            afterOnCellMouseDown={localAfterOnCellMouseDown}
                            mergeCells={false}
                            // hiddenColumns={{
                            //   columns: [8],
                            // }}
                            cells={function (row, col) {
                              var cp = {};
                              const hot = hotRef?.current?.hotInstance;
                              cp.className = "child";
                              if (col == 12 || col == 13 || col == 14 || col == 15 || col == 16 || col == 17 || col == 18) {
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
                                    return this.getSelected()[0][1] == 4 || this.getSelected()[0][1] == 6;
                                  },
                                },

                                option5: {
                                  name: `Select Date <br><input type='date' min='2017-07-01' max=${new Date()
                                    .toISOString()
                                    .slice(
                                      0,
                                      10
                                    )}  class='custom-date col-md-11' placeholder='DD-MM-YYYY' id='custom1' name='date' value=${searchDate} >`,
                                  hidden() {
                                    return this.getSelectedRangeLast().to.col != 4;
                                  },

                                  //disabled: true,
                                  callback: function (key, selection, clickEvent) {
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


                                option6: {
                                  name: `Select Date <br><input type='date' min='2017-07-01' max=${new Date()
                                    .toISOString()
                                    .slice(
                                      0,
                                      10
                                    )}  class='custom-date col-md-11' placeholder='DD-MM-YYYY' id='custom1' name='date' value=${searchDate} >`,
                                  hidden() {
                                    return this.getSelectedRangeLast().to.col != 6;
                                  },

                                  //disabled: true,
                                  callback: function (key, selection, clickEvent) {
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
                                  name: `<button id='btnClear' name='Clear' tabIndex="-1"    value='Clear'>Clear</button>`,
                                  //disabled: true,
                                  callback: function (key, selection, clickEvent) {
                                    console.log("date picker clicked");
                                    var src = clickEvent.target;
                                    console.log("name", src.tagName);
                                    if (src.tagName.toLowerCase() === "button") {
                                      if (clickEvent.target.id == "btnClear") {
                                        const hot = hotRef3?.current?.hotInstance;

                                        if (hot.getSelected()[0][1] !== 4 || hot.getSelected()[0][1] !== 6) {
                                          var searchInput = document.querySelector(
                                            ".htUIMultipleSelectSearch.htUIInput"
                                          );
                                          var value = "";
                                        } else {
                                          var searchInput1 =
                                            document.getElementById("custom1");
                                          var value = "";
                                          setSearchDate(value);
                                        }
                                        const x = searchVal1;
                                        if (!searchVal1?.length) {
                                          x.push(value);
                                          let y = currentCol;
                                          y.push(
                                            table5CColumns[currentCol1]?.data
                                          );
                                          // console.log("jsx=",x,y)
                                          setSearchVal1(x);
                                          setCurrentCol(y);
                                        } else {
                                          const Index = currentCol?.findIndex(
                                            (item) =>
                                              table5CColumns[currentCol1]?.data ==
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
                                              table5CColumns[currentCol1]?.data
                                            );
                                            // console.log("jsx=",x,y)
                                            setSearchVal1(x);
                                            setCurrentCol(y);
                                          }
                                        }

                                        purchaseSummaryList(activeTab, '', "asc", "", finFromYear?.value, monthFrom?.value, '', 1)

                                      }
                                      clickEvent.stopImmediatePropagation();
                                    }
                                    clickEvent.stopImmediatePropagation();
                                  },
                                },
                                filter_action_bar: {},
                              },
                            }}
                            afterFilter={function (data) {
                              const hot = hotRef3?.current?.hotInstance;
                              if (hot.getSelected()[0][1] !== 4 && hot.getSelected()[0][1] !== 6) {
                                var searchInput = document.querySelector(
                                  ".htUIMultipleSelectSearch.htUIInput"
                                );
                                var value = searchInput.children[0].value;
                              } else {
                                var searchInput1 = document.getElementById("custom1");
                                var value = searchInput1.value;
                                setSearchDate(value);
                              }
                              const x = searchVal1;
                              if (!searchVal1?.length) {
                                x.push(value);
                                let y = currentCol;
                                y.push(table5CColumns[currentCol1]?.data);
                                // console.log("jsx=",x,y)
                                setSearchVal1(x);
                                setCurrentCol(y);
                              } else {
                                const Index = currentCol?.findIndex(
                                  (item) =>
                                    table5CColumns[currentCol1]?.data == item
                                );
                                if (Index != -1) {
                                  const xyz = searchVal1;
                                  xyz[Index] = value;
                                  setSearchVal1(xyz);
                                } else {
                                  x.push(value);
                                  let y = currentCol;
                                  y.push(table5CColumns[currentCol1]?.data);
                                  // console.log("jsx=",x,y)
                                  setSearchVal1(x);
                                  setCurrentCol(y);
                                }
                              }
                              setPage(0);
                              purchaseSummaryList(activeTab, '', "asc", crdrInvoiceType?.value, finFromYear?.value, monthFrom?.value, '', 1)
                            }}
                          />
                        ) : (
                          <HotTable
                            id="table5C"
                            viewportColumnRenderingOffset={100}
                            autoWrapRow={true}
                            readOnly={true}
                            rowHeights={RowSize}
                            columnHeaderHeight={columnHeaderSize}
                            // style={{ textAlign: "center", overflowX: "hidden" }}
                            data={[{ gstinOfJW: "No Data Found!" }]}
                            autoColumnSize={true}
                            colHeaders={colHeaders}
                            afterGetColHeader={theaderCdna}
                            stretchH="all"
                            preventOverflow="horizontal"
                            columns={table5CColumnsEmpty}
                            contextMenu={false}
                            bindRowsWithHeaders={true}
                            // hiddenColumns
                            licenseKey="non-commercial-and-evaluation"
                            height="auto"
                            ref={hotRef3}
                            afterOnCellMouseDown={localAfterOnCellMouseDown}
                            mergeCells={[
                              { row: 0, col: 1, rowspan: 1, colspan: 6 },
                            ]}
                            // hiddenColumns={{
                            //   columns: [0],
                            // }}
                            cells={function (row, col) {
                              var cp = {};
                              const hot = hotRef?.current?.hotInstance;
                              cp.className = "child";
                              if (
                                col == 10 ||
                                col == 11 ||
                                col == 12
                              ) {
                                cp.className = "text-end";
                              }
                              if (col == 1) {

                                cp.className = "text-center";
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
                                    return this.getSelected()[0][1] == 4 || this.getSelected()[0][1] == 6;
                                    // return this.getSelected()[0][1] == 3 || this.getSelected()[0][1] == 5;
                                  },
                                },

                                option5: {
                                  name: `Select Date <br><input type='date' min='2017-07-01' max=${new Date()
                                    .toISOString()
                                    .slice(
                                      0,
                                      10
                                    )}  class='custom-date col-md-11' placeholder='DD-MM-YYYY' id='custom1' name='date' value=${searchDate} >`,
                                  hidden() {
                                    return this.getSelectedRangeLast().to.col != 4;
                                  },

                                  //disabled: true,
                                  callback: function (key, selection, clickEvent) {
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


                                option6: {
                                  name: `Select Date <br><input type='date' min='2017-07-01' max=${new Date()
                                    .toISOString()
                                    .slice(
                                      0,
                                      10
                                    )}  class='custom-date col-md-11' placeholder='DD-MM-YYYY' id='custom1' name='date' value=${searchDate} >`,
                                  hidden() {
                                    return this.getSelectedRangeLast().to.col != 6;
                                  },

                                  //disabled: true,
                                  callback: function (key, selection, clickEvent) {
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
                                  name: `<button id='btnClear' name='Clear' tabIndex="-1"   value='Clear'>Clear</button>`,
                                  //disabled: true,
                                  callback: function (key, selection, clickEvent) {
                                    console.log("date picker clicked");
                                    var src = clickEvent.target;
                                    console.log("name", src.tagName);
                                    if (src.tagName.toLowerCase() === "button") {
                                      if (clickEvent.target.id == "btnClear") {
                                        const hot = hotRef3?.current?.hotInstance;

                                        if (hot.getSelected()[0][1] !== 4 || hot.getSelected()[0][1] !== 6) {
                                          var searchInput = document.querySelector(
                                            ".htUIMultipleSelectSearch.htUIInput"
                                          );
                                          var value = "";
                                        } else {
                                          var searchInput1 =
                                            document.getElementById("custom1");
                                          var value = "";
                                          setSearchDate(value);
                                        }
                                        const x = searchVal1;
                                        if (!searchVal1?.length) {
                                          x.push(value);
                                          let y = currentCol;
                                          y.push(
                                            table5CColumns[currentCol1]?.data
                                          );
                                          // console.log("jsx=",x,y)
                                          setSearchVal1(x);
                                          setCurrentCol(y);
                                        } else {
                                          const Index = currentCol?.findIndex(
                                            (item) =>
                                              table5CColumns[currentCol1]?.data ==
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
                                              table5CColumns[currentCol1]?.data
                                            );
                                            // console.log("jsx=",x,y)
                                            setSearchVal1(x);
                                            setCurrentCol(y);
                                          }
                                        }

                                        purchaseSummaryList(activeTab, '', "asc", "", finFromYear?.value, monthFrom?.value, '', 1)

                                      }
                                      clickEvent.stopImmediatePropagation();
                                    }
                                    clickEvent.stopImmediatePropagation();
                                  },
                                },
                                filter_action_bar: {},
                              },
                            }}
                            afterFilter={function (data) {
                              const hot = hotRef3?.current?.hotInstance;
                              if (hot.getSelected()[0][1] !== 4 && hot.getSelected()[0][1] !== 6) {
                                var searchInput = document.querySelector(
                                  ".htUIMultipleSelectSearch.htUIInput"
                                );
                                var value = searchInput.children[0].value;
                              } else {
                                var searchInput1 = document.getElementById("custom1");
                                var value = searchInput1.value;
                                setSearchDate(value);
                              }
                              const x = searchVal1;
                              if (!searchVal1?.length) {
                                x.push(value);
                                let y = currentCol;
                                y.push(table5CColumns[currentCol1]?.data);
                                // console.log("jsx=",x,y)
                                setSearchVal1(x);
                                setCurrentCol(y);
                              } else {
                                const Index = currentCol?.findIndex(
                                  (item) =>
                                    table5CColumns[currentCol1]?.data == item
                                );
                                if (Index != -1) {
                                  const xyz = searchVal1;
                                  xyz[Index] = value;
                                  setSearchVal1(xyz);
                                } else {
                                  x.push(value);
                                  let y = currentCol;
                                  y.push(table5CColumns[currentCol1]?.data);
                                  // console.log("jsx=",x,y)
                                  setSearchVal1(x);
                                  setCurrentCol(y);
                                }
                              }
                              setPage(0);
                              purchaseSummaryList(activeTab, '', "asc", crdrInvoiceType?.value, finFromYear?.value, monthFrom?.value, '', 1)
                            }}
                          />
                        )}
                        {
                          purchaseData &&
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
                        }
                      </div>
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

export default ITCInvoices;
