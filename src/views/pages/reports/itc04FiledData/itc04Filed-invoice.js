import { Fragment, useState, useEffect, useRef } from "react";
import { HotTable } from "@handsontable/react";
import { textRenderer } from "handsontable/renderers";
import { registerAllModules } from "handsontable/registry";
import GSRT1SummaryInvoice from "../../../../services/gstr1/gstr1Services/gstr1PurchaseInvoiceService";
import gstr6PurchaseInvoice from "../../../../services/gstr6Filed/gstr6filedService";
// import gstr6SummaryService from "../../../../services/gstr6/gstr6SummaryService";
import errorCodeConfig from "../../../../configs/apiErrorCodeConfig";
import Select from "react-select"; // eslint-disable-line
import makeAnimated from "react-select/animated";
import { selectThemeColors } from "@utils";
import moment from "moment/moment";
import {
  useNavigate,
  useParams,
  useLocation,
  useOutletContext,
} from "react-router-dom";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { globleVariable } from "../../../../configs/globalVariable";
import LocalFunction from "../../../../configs/getLocalFunction";
import SessionFunction from "../../../../configs/getSessionFunction";
import { downloadURL } from '@helper/downloadUrl'
import { useSelector, useDispatch } from "react-redux";
import itc04PurchaseInvoice from "../../../../services/itc04FiledServices/itc04PurchaseInvoice";
const MySwal = withReactContent(Swal);
const animatedComponents = makeAnimated();
import ITC04MockData from './mockData'
import { PageSize } from '@configs/config'
import $ from 'jquery'
import { showTotalRowPerPage } from "@helper/tableRowsPerPage";


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
  Button,
} from "reactstrap";
import ReactPaginate from "react-paginate";
import Tabs from "./tabs";
import withReactContent from "sweetalert2-react-content";
import { filterCurrentDate } from "../../../../helper/filterArray";
import { getItc04FiledData } from './store'
import { RowSize, checkBoxTitle, columnHeaderSize, paginationList, paginationTitle } from "../../../../configs/config";
import itc04SummaryService from "../../../../services/itc04FiledServices/itc04SummaryService";

let isChecked = false;
var unitList = [];
var taxList = [];
var placeOfSupplyList = [];

const finYearOption = LocalFunction.getLocalValue(
  globleVariable.rangeFiltersITC04,
  true
);
const YearList = JSON.parse(finYearOption);

const FinDateTime = LocalFunction.getLocalValue(
  globleVariable.serverDateTime,
  true
);


// ** Total Show - Table
const TotalShowContent = ({
  totalInvoice,
  totalInvoiceValue,
  totalTaxableValue,
  totalIGST,
  totalSGST,
  totalCGST,
  totalCess,
}) => {
  return (
    <table className="table table-bordered summary-table">
      <tbody>
        <tr>
          <td>
            <p className="mb-0">
              Invoices <br />
              <span>
                {" "}
                {totalInvoice ? formatTotalWithoutDecimal(totalInvoice) : 0}
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
                {totalInvoiceValue ? formatINR(totalInvoiceValue) : 0}
              </span>
            </p>
          </td>
          <td>
            <p className="mb-0">
              Taxable Values{"  "} (₹)
              <br />
              <span>
                {totalTaxableValue ? formatINR(totalTaxableValue) : 0}
              </span>
            </p>
          </td>

          <td>
            <p className="mb-0">
              IGST (₹)
              <br />
              <span> {totalIGST ? formatINR(totalIGST) : 0}</span>
            </p>
          </td>
          <td>
            <p className="mb-0">
              SGST (₹)
              <br />
              <span> {totalSGST ? formatINR(totalSGST) : 0}</span>
            </p>
          </td>
          <td>
            <p className="mb-0">
              CGST (₹)
              <br />
              <span> {totalCGST ? formatINR(totalCGST) : 0}</span>
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
  );
};

// ** For Currency Formating
function formatINR(x) {
  return x.toLocaleString("en-IN", { minimumFractionDigits: 2 });
}
function formatTotalWithoutDecimal(x) {
  return x.toLocaleString("en-IN");
}

const ITC04Invoices = ({ returnDate }) => {

  let arrFilter = [];
  let fromPath = window.location.pathname;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showsData, setShowsData] = useState("mock1");
  const [itc04Data, setItc04Data] = useState([]);
  console.log(itc04Data, "count total")
  const { setGSRT1Data, stepper } = useOutletContext();
  const [block, setBlock] = useState(false);
  // const [data, setItc04Data] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(PageSize);
  const [currentCol, setCurrentCol] = useState([]);
  const [currentCol1, setCurrentCol1] = useState();
  const [searchVal1, setSearchVal1] = useState([]);
  const [searchDate, setSearchDate] = useState("");
  const [toDate, setToDate] = useState("");



  const [searchDate1, setSearchDate1] = useState("");
  const [toDate1, setToDate1] = useState("");

  const [count, setCount] = useState(0);

  const [activeTab, setActiveTab] = useState("1");
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

  // for quantity State Value
  const [fromQty, setFromQty] = useState("");
  const [toQty, setToQty] = useState("");


  // for lossQty State Value
  const [fromLossQty, setFromLossQty] = useState("");
  const [toLossQty, setToLossQty] = useState("");


  // for TaxableValue State Value
  const [fromTaxableValue, setFromTaxableValue] = useState("");
  const [toTaxableValue, setToTaxableValue] = useState("");

  // for Cess Value State Value
  const [fromAmountCESS, setFromAmountCESS] = useState("");
  const [toAmountCESS, setToAmountCESS] = useState("");

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

  const [crDrType, setCrDrType] = useState(null);

  const [totalCGST, setTotalCGST] = useState(0);
  const [totalSGST, setTotalSGST] = useState(0);
  const [totalCess, setTotalCess] = useState(0);
  const [totalIGST, setTotalIGST] = useState(0);
  const [totalInvoice, setTotalInvoice] = useState(0);
  const [totalInvoiceValue, setTotalInvoiceValue] = useState(0);

  const [totalTaxableValue, setTotalTaxableValue] = useState(0);

  //ITC
  const [btnDisable1, setbtnDisable1] = useState(false);
  const [financialYearList, setFinancialYearList] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);

  //For table 1 checkbox

  const [state, setState] = useState([]);
  const [jobWorkerType, setJobWorkerType] = useState([]);
  const [typesOfGood, setTypesOfGood] = useState([]);
  const [uqc, setUQC] = useState([]);
  const [lossuqc, setLossUQC] = useState([]);
  const [igst, setIgst] = useState([]);
  const [cgst, setCgst] = useState([]);
  const [sgst, setSgst] = useState([]);
  const [action, setAction] = useState([]);
  const [gridCustomFilter, setGridCustomFilter] = useState([]);

  const [pageNoTitle, setPageNoTitle] = useState("")
  const [pageNoSelect, setPageNoSelect] = useState(paginationList[0]);
  const [pageTotTitle, setpageTotTitle] = useState("");

  let arrChk = []

  const [filterDropDownList, setFilterDropDownList] = useState({
    stateDropDownList: [],
    jobWorkerTypeDropDownList: [],
    typesOfGoodDropDownList: [],
    uqcDropDownList: [],
    lossuqcDropDownList: [],
    igstDropDownList: [],
    cgstDropDownList: [],
    sgstDropDownList: [],
    actionDropDownList: [],

  })

  const G_UCParId = SessionFunction.getSessionValue(
    globleVariable.G_UCParId,
    true
  );
  const G_FY = SessionFunction.getSessionValue(globleVariable.G_FY, true);
  const itc04DateRange = SessionFunction.getSessionValue(globleVariable.itc04DateRange)
  const subscriptionId = localStorage.getItem(globleVariable.subscriptionId) && LocalFunction.getLocalValue(globleVariable.subscriptionId, true);
  const G_UserId = localStorage.getItem(globleVariable.userId) && LocalFunction.getLocalValue(globleVariable.userId, true)
  const token = LocalFunction.getLocalValue(globleVariable.tokenKey, true);

  // **  ITC04 Store Data
  const storeItc04Summary = useSelector(
    (state) => state?.itcO4Filed?.ITC04Summary?.[0]?.Data
  );





  useEffect(() => {

    console.log(storeItc04Summary, "redux data")

    if (storeItc04Summary == undefined) {
      if (itc04DateRange !== undefined) {
        const userData = {
          UserClientId: G_UCParId,
          range: itc04DateRange,
          SubscriptionId: subscriptionId,
          gstNumber: G_GSTIN
        };

        setBlock(true)
        dispatch(getItc04FiledData(userData));
      }
    }
  }, []);


  // ** Get data on mount
  useEffect(() => {
    if (searchApi == true) {
      itc04SummaryData(activeTab);
    }
  }, [searchApi, storeItc04Summary, activeTab]);


  //** Seprate Data of itc04
  const itc04SummaryData = (secId) => {

    setPage(0);
    let arrData = [];
    if (showsData == "mock") {
      setBlock(false)
      if (secId == 1) {
        arrData = ITC04MockData.Table4;
      } else if (secId == 2) {
        arrData = ITC04MockData.Table5A;
      } else if (secId == 3) {
        arrData = ITC04MockData.Table5B;
      } else {
        arrData = ITC04MockData.Table5C;
      }
    } else {

      if (storeItc04Summary !== undefined) {
        setSearchApi(false);
        setBlock(false)
        if (secId == 1) {
          //setSearchApi(false);
          // Table4

          arrData =
            storeItc04Summary?.table4 !== null &&
              storeItc04Summary?.table4 !== "" &&
              storeItc04Summary?.table4?.length !== 0 &&
              storeItc04Summary?.table4 !== undefined
              ? storeItc04Summary?.table4
              : [];
        } else if (secId == 2) {
          // Table5A
          arrData =
            storeItc04Summary?.table5A !== null &&
              storeItc04Summary?.table5A !== "" &&
              storeItc04Summary?.table5A?.length !== 0 &&
              storeItc04Summary?.table5A !== undefined
              ? storeItc04Summary?.table5A
              : [];
        } else if (secId == 3) {
          // Table5B
          arrData =
            storeItc04Summary?.table5B !== null &&
              storeItc04Summary?.table5B !== "" &&
              storeItc04Summary?.table5B?.length !== 0 &&
              storeItc04Summary?.table5B !== undefined
              ? storeItc04Summary?.table5B
              : [];
        } else if (secId == 4) {
          // Table5C
          arrData =
            storeItc04Summary?.table5C !== null &&
              storeItc04Summary?.table5C !== "" &&
              storeItc04Summary?.table5C?.length !== 0 &&
              storeItc04Summary?.table5C !== undefined
              ? storeItc04Summary?.table5C
              : [];
        }
      }
    }
    setItc04Data(arrData);
    calcutions(arrData);
    console.log(itc04Data, 'itc04Data')
  };


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
  }, [invoceTypes, itc04Data]);

  useEffect(() => {
    // Purchase Master
    itc04SummaryService.itc04FiledPagination()
      .then((res) => {

        if (
          res.status == 200 &&
          res.data.status === errorCodeConfig.APIDefaultCode.Success
        ) {

          // debugger
          console.log(res.data, 'apiREsponse1');

          var resData = res.data.data;
          // debugger
          //  console.log(res?.data,'apiREsponse')
          setState(res?.data?.data?.placeOfSupply)
          setJobWorkerType(res?.data?.data?.jobWorkerType)
          setTypesOfGood(res?.data?.data?.typesOfGoods)
          setUQC(res?.data?.data?.measurement)
          setLossUQC(res?.data?.data?.measurement)
          setAction(res?.data?.data?.action)
          setIgst(res?.data?.data?.igst)
          setCgst(res?.data?.data?.cgst)
          setSgst(res?.data?.data?.cgst)

          // unitList = resData?.measurement;
          // for (let i = 0; i < unitList?.length; i++) {
          //   unitList[i].label = unitList[i]["text"];
          //   delete unitList[i].text;
          // }


          // placeOfSupplyList = resData?.placeOfSupply;
          // console.log(placeOfSupplyList, "placeOfSupplyList");
          // for (let i = 0; i < placeOfSupplyList?.length; i++) {
          //   placeOfSupplyList[i].label = placeOfSupplyList[i]["text"];
          //   delete placeOfSupplyList[i].text;
          // }

          // console.log("unit list=", unitList);
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
  },
    []);

  useEffect(() => {
    stepper != null && stepper.to(2);
  }, [stepper]);

  const location = useLocation();

  //** Table4 Columns
  const table4Columns = [

    {
      data: "GstinOfJW",
      title: "GSTIN of Job Worker (JW)",

    },
    {
      data: "TradeName",
      title: "Trade Name",

    },
    {
      data: "State",
      title: "State (in case of unregistered JW) "
    },
    {
      data: "JobWorkerType",
      title: "Job Worker's Type",

    },

    {
      data: "ChallanNumber",
      title: "Challan Number",

    },
    {
      data: "ChallanDateLabel",
      title: "Challan Date",

    },
    {
      data: "TypesOfGood",
      title: "Types of Goods",

    },
    {
      data: "DescriptionOfGood",
      title: "Description of Goods",

    },
    {
      data: "UQC",
      title: "Unique Quantity Code (UQC)",


    },
    {
      data: "Qty",
      title: "Quantity",

    },

    {
      data: "TaxableValue",
      title: "Taxable Value(in Rupees)",

    },
    {
      data: "IGST",
      title: "Integrated Tax Rate in (%)",

    },
    {
      data: "CGST",
      title: "Central Tax Rate in (%)",

    },
    {
      data: "SGST",
      title: "State/UT Tax Rate in (%)",

    },
    {
      data: "Cess",
      title: "CESS",

    },
    {
      data: "Action",
      title: "Action",
    },
  ];

  //** Table5A Columns
  const table5AColumns = [


    {
      data: "GstinOfJW",
      title: "GSTIN of Job Worker (JW)",
      readOnly: true,

    },
    {
      data: "TradeName",
      title: "Trade Name",

    },
    {
      data: "State",
      title: "State (in case of unregistered JW)  ",
      readOnly: true,

    },
    {
      data: "ChallanNumber",
      title: "Original Challan Number issued by Principal",
      readOnly: true,

    },
    {
      data: "ChallanDateLabel",
      title: "Original Challan Date Issued by Principal",
      readOnly: true,

    },
    {
      data: "ChallanNumberByJW",
      title: "Challan Number issued by Job worker",
      readOnly: true,

    },
    {
      data: "ChallanDateByJWLabel",
      title: "Challan Date issued by worker",
      readOnly: true,

    },
    {
      data: "NatureOfJobWork",
      title: "Nature of Job Work Done",
      readOnly: true,
      //   width:"500"

    },
    {
      data: "DescriptionOfGood",
      title: "Description of Goods",
      readOnly: true,

    },

    {
      data: "UQC",
      title: "Unique Quantity Code (UQC)",
      readOnly: true,

    },
    {
      data: "Qty",
      title: "Quantity",
      readOnly: true,
      //   width:"500"
    },
    {
      data: "LossUQC",
      title: "Losses and Wastes Unique Quantity Code (UQC)",
      readOnly: true,

    },
    {
      data: "LossQty",
      title: "Losses and Wastes Quantity",
      readOnly: true,

    },

    {
      data: "Action",
      title: "Action",
      readOnly: true
    }
  ];

  //** Table5B Columns
  const table5BColumns = [
    {
      data: "GstinOfJW",
      title: "GSTIN of Job Worker (JW)",
      readOnly: true,

    },
    {
      data: "TradeName",
      title: "Trade Name",

    },
    {
      data: "State",
      title: "State (in case of unregistered JW)",
      readOnly: true,

    },

    {
      data: "ChallanNumber",
      title: "Original Challan Number issued by Principal",
      readOnly: true,

    },
    {
      data: "ChallanDateLabel",
      title: "Original Challan Date Issued by Principal",
      readOnly: true,

    },
    {
      data: "ChallanNumberByJW",
      title: "Challan Number issued by Job worker",
      readOnly: true,

    },
    {
      data: "ChallanDateByJWLabel",
      title: "Challan Date issued by worker",
      readOnly: true,

    },

    {
      data: "NatureOfJobWork",
      title: "Nature of Job Work Done",
      readOnly: true,

    },

    {
      data: "DescriptionOfGood",
      title: "Description of Goods",
      readOnly: true,

    },

    {
      data: "UQC",
      title: "Unique Quantity Code (UQC)",
      readOnly: true,

    },
    {
      data: "Qty",
      title: "Quantity",
      readOnly: true,

    },
    {
      data: "LossUQC",
      title: "Losses and Wastes Unique Quantity Code (UQC)",
      readOnly: true,

    },
    {
      data: "LossQty",
      title: "Losses and Wastes Quantity",
      readOnly: true,

    },

    {
      data: "Action",
      title: "Action",
      readOnly: true,

    },
  ];

  //** Table5C Columns
  const table5CColumns = [
    {
      data: "GstinOfJW",
      title: "GSTIN of Job Worker (JW)",
      readOnly: true,

    },
    {
      data: "TradeName",
      title: "Trade Name",

    },
    {
      data: "State",
      title: "State (in case of unregistered JW)",
      readOnly: true,

    },

    {
      data: "ChallanNumber",
      title: "Original Challan Number issued by Principal",
      readOnly: true,

    },
    {
      data: "ChallanDateLabel",
      title: "Original Challan Date Issued by Principal",
      readOnly: true,

    },
    {
      data: "InvoiceNumberByPrincipal",
      title: "Invoice Number issued by Principal",
      readOnly: true,

    },
    {
      data: "InvoiceDateByPrincipalLabel",
      title: "Invoice Date issued by Principal",
      readOnly: true,

    },

    {
      data: "NatureOfJobWork",
      title: "Nature of Job Work Done",
      readOnly: true,

    },

    {
      data: "DescriptionOfGood",
      title: "Description of Goods",
      readOnly: true,

    },

    {
      data: "UQC",
      title: "Unique Quantity Code (UQC)",
      readOnly: true,

    },
    {
      data: "Qty",
      title: "Quantity",
      readOnly: true,

    },
    {
      data: "LossUQC",
      title: "Losses and Wastes Unique Quantity Code (UQC)",
      readOnly: true,

    },
    {
      data: "LossQty",
      title: "Losses and Wastes Quantity",
      readOnly: true,

    },

    {
      data: "Action",
      title: "Action",
      readOnly: true,

    },

  ];


  let dropDonwNameAssign;
  console.log(table4Columns[currentCol1]?.data, 'testdata');
  if (table4Columns[currentCol1]?.data === "State") {
    dropDonwNameAssign = state;
  } else if (table4Columns[currentCol1]?.data === "JobWorkerType") {
    dropDonwNameAssign = jobWorkerType;
  } else if (table4Columns[currentCol1]?.data === "TypesOfGood") {
    dropDonwNameAssign = typesOfGood;
  } else if (table4Columns[currentCol1]?.data === "UQC") {

    dropDonwNameAssign = uqc;
  }
  else if (table4Columns[currentCol1]?.data === "IGST") {

    dropDonwNameAssign = igst;

  }
  else if (table4Columns[currentCol1]?.data === "CGST") {

    dropDonwNameAssign = cgst;

  }
  else if (table4Columns[currentCol1]?.data === "SGST") {

    dropDonwNameAssign = sgst;

  } else if (table4Columns[currentCol1]?.data === "Action") {
    dropDonwNameAssign = action;
  }

  let dropDonwName = dropDonwNameAssign !== undefined && dropDonwNameAssign !== null ? dropDonwNameAssign : state;



  let dropDonwNameAssign1;
  console.log(table5AColumns[currentCol1]?.data, 'testdata');
  if (table5AColumns[currentCol1]?.data === "State") {
    dropDonwNameAssign1 = state;
  } else if (table5AColumns[currentCol1]?.data === "UQC") {
    dropDonwNameAssign1 = uqc;
  } else if (table5AColumns[currentCol1]?.data === "LossUQC") {
    dropDonwNameAssign1 = lossuqc;

  } else if (table5AColumns[currentCol1]?.data === "Action") {
    dropDonwNameAssign1 = action;
  }

  let dropDonwName1 = dropDonwNameAssign1 !== undefined && dropDonwNameAssign1 !== null ? dropDonwNameAssign1 : state;

  let dropDonwNameAssign2;

  console.log(table5BColumns[currentCol1]?.data, 'testdata');
  if (table5BColumns[currentCol1]?.data === "State") {
    dropDonwNameAssign2 = state;
  } else if (table5BColumns[currentCol1]?.data === "UQC") {
    dropDonwNameAssign2 = uqc;
  } else if (table5BColumns[currentCol1]?.data === "LossUQC") {
    dropDonwNameAssign2 = lossuqc;

  } else if (table5BColumns[currentCol1]?.data === "Action") {
    dropDonwNameAssign2 = action;
  }

  let dropDonwName2 = dropDonwNameAssign2 !== undefined && dropDonwNameAssign2 !== null ? dropDonwNameAssign2 : state;


  let dropDonwNameAssign3;
  console.log(table5CColumns[currentCol1]?.data, 'testdata');
  if (table5CColumns[currentCol1]?.data === "State") {
    dropDonwNameAssign3 = state;
  } else if (table5CColumns[currentCol1]?.data === "UQC") {
    dropDonwNameAssign3 = uqc;
  } else if (table5CColumns[currentCol1]?.data === "LossUQC") {
    dropDonwNameAssign3 = lossuqc;

  } else if (table5CColumns[currentCol1]?.data === "Action") {
    dropDonwNameAssign3 = action;
  }

  let dropDonwName3 = dropDonwNameAssign3 !== undefined && dropDonwNameAssign3 !== null ? dropDonwNameAssign3 : state;


  let finYear = null;
  let finMonth = null;
  let url = null;
  let SubscriptionId = null;
  let G_GSTIN;

  if (location.state !== null) {
    console.log(location.state, 'lcs')
    finYear = location.state.finyear !== null && location.state.finyear !== "null" && (itc04DateRange == null || itc04DateRange == undefined) ? location.state.finyear : itc04DateRange
    url = location.state.sectionId !== null && location.state.sectionId !== "null" ? location.state.sectionId : ""
    SubscriptionId = location.state.subscriptionId !== null && location.state.subscriptionId !== "null" ? location.state.subscriptionId : "";
    G_GSTIN = location.state.G_GSTIN !== null && location.state.G_GSTIN !== "null" ? location.state.G_GSTIN : "";
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
    }
  }, [displayType, activeTab]);

  const selectFromMonth = (value) => {
    setPage(0)
    setErrorMsg('');
    setMonthFrom(value);

    if (Number(finFromYear?.srNo) > Number(value?.srNo)) {
      const fromFilter = panDataFrom?.filter((item) => Number(item.srNo) == Number(value.srNo))[0]
      setFinFormYear(fromFilter)
    }

  }

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
    } else {
      invType = count == 1 ? url : crdrInvoiceType?.value;
    }

    console.log(invType);

  };



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

  useEffect(() => {
    console.log("searchVal1", searchVal1?.length);
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
    }
  }, [page, searchVal1, serverSidePage]);

  useEffect(() => {
    setCurrentCol([]);
    setCurrentCol1();
    setSearchVal1([]);
  }, [activeTab]);

  const toggleTab = (tab) => {
    console.log("tab click", tab);
    setCurrentCol([]);
    setCurrentCol1();
    setSearchVal1([]);
    setActiveTab(tab);
    isChecked = false;
    setPage(0);
    setDisplayType(true);

    setFromQty("");
    setToQty("");
    setFromLossQty("");
    setToLossQty("");
    setFromTaxableValue("");
    setToTaxableValue("");
    setFromAmountCESS("");
    setToAmountCESS("");
    setSearchDate("");
    setToDate("");
    setSearchDate1("");
    setToDate1("");

    setFilterDropDownList({
      stateDropDownList: [],
      jobWorkerTypeDropDownList: [],
      typesOfGoodDropDownList: [],
      uqcDropDownList: [],
      lossuqcDropDownList: [],
      igstDropDownList: [],
      cgstDropDownList: [],
      sgstDropDownList: [],
      actionDropDownList: [],
    });
    setGridCustomFilter([])
  };


  //**  pagination
  const purchaseData = itc04Data;
  const pageCount = Math.ceil(itc04Data?.length && itc04Data.length / rowsPerPage);
  // debugger
  const para1 = page * rowsPerPage;
  const para2 = page * rowsPerPage + rowsPerPage;

  let itc04filedData = itc04Data && itc04Data.slice(para1, para2);

  console.log("itc data 1 ", itc04filedData, "itc data2  ", itc04Data, "itc data3  ", rowsPerPage)


  useEffect(() => {

    let rowPageCount = showTotalRowPerPage(page, rowsPerPage, itc04Data?.length)
    setPageNoTitle(rowPageCount)

  }, [itc04Data?.length, page, rowsPerPage])



  //**  page click event
  const handlePageClick = (event) => {
    setPage(event?.selected);
    // setCurrentPage(event?.selected);
    setServerSidePage(true);
  };


  // *** Currency formate with round figer value
  function emptyRender(instance, td, row, col, prop, value, cellProperties) {
    textRenderer.apply(this, arguments);

    if (activeTab == 1) {
      if (

        col == 9 ||
        col == 10 ||
        col == 11 ||
        col == 12 ||
        col == 13
      ) {
        let currnecyVal = formatINR(Number(value));

        if (currnecyVal !== 0) {
          td.innerText = currnecyVal;
        }
      }
    }

  }

  // itc04 refs
  const hotRef = useRef(null);
  const hotRef1 = useRef(null);
  const hotRef2 = useRef(null);
  const hotRef3 = useRef(null);

  // ** Table4 Tab
  const theader4 = (col, TH) => {


    if (
      col == 3 ||
      col == 4 ||
      col == 8 ||
      col == 9 ||
      col == 10 ||
      col == 11 ||
      col == 12 ||
      col == 13
    ) {
      TH.className = "htRight";
    } else {
      TH.className = "htLeft";
    }
    if (activeTab == 1) {
      if (gridCustomFilter?.length > 0) {

        let finalObj = {};
        for (let i = 0; i < gridCustomFilter?.length; i++) {
          Object.assign(finalObj, gridCustomFilter[i]);
        }


        table4Columns.forEach((ele, index) => {
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
              `.tab-pane.active .ht_clone_top thead th:nth-child(${columnIndex + 1})`
            );

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

  // ** Table5A Tab
  const theader5A = (col, TH) => {

    if (
      col == 2 || col == 3 || col == 4 || col == 5 || col == 9 || col == 11
    ) {
      TH.className = "htRight";
    } else {
      TH.className = "htLeft";
    }
    if (activeTab == 2) {
      if (gridCustomFilter?.length > 0) {

        let finalObj = {};
        for (let i = 0; i < gridCustomFilter?.length; i++) {
          Object.assign(finalObj, gridCustomFilter[i]);
        }


        table5AColumns.forEach((ele, index) => {
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
              `.tab-pane.active .ht_clone_top thead th:nth-child(${columnIndex + 1})`
            );

            if (TH) {
              TH.classList.add("htFiltersActive");
            } else {
              TH.classList.remove("htFiltersActive");
            }
          }
        });
      }
    }
    // if ( col > 15) {
    //   const button = TH.children[0].children[0];
    //   button?.parentNode?.removeChild(button);
    // }

  };

  // ** Table5B Tab
  const theader5B = (col, TH) => {
    if (
      col == 2 || col == 3 || col == 4 || col == 5 || col == 9 || col == 11
    ) {
      TH.className = "htRight";
    } else {
      TH.className = "htLeft";
    }
    if (activeTab == 3) {
      if (gridCustomFilter?.length > 0) {

        let finalObj = {};
        for (let i = 0; i < gridCustomFilter?.length; i++) {
          Object.assign(finalObj, gridCustomFilter[i]);
        }


        table5BColumns.forEach((ele, index) => {
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
              `.tab-pane.active .ht_clone_top thead th:nth-child(${columnIndex + 1})`
            );

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

  // ** Table 5C Tab
  const theader5C = (col, TH) => {
    if (col == 2 || col == 3 || col == 4 || col == 5 || col == 9 || col == 11) {
      TH.className = "htRight";
    } else {
      TH.className = "htLeft";
    }
    if (activeTab == 4) {
      if (gridCustomFilter?.length > 0) {

        let finalObj = {};
        for (let i = 0; i < gridCustomFilter?.length; i++) {
          Object.assign(finalObj, gridCustomFilter[i]);
        }


        table5CColumns.forEach((ele, index) => {
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
              `.tab-pane.active .ht_clone_top thead th:nth-child(${columnIndex + 1})`
            );

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
    if (purchaseData?.length > 0) {
      for (let i = 0; i < purchaseData?.length; i++) {
        if (
          purchaseData[i].select == "true" ||
          purchaseData[i].select == true
        ) {
          delArr.push(purchaseData[i].gstr6Id);
        }
      }
    }

    if (delArr?.length > 0) {
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

  //  cell mouse down
  function localAfterOnCellMouseDown(event, coords, td) {

    setCurrentCol1(coords?.col);

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
  }

  // useEffect(() => {
  //   return () => setBlock(false)
  // }, [])

  // ** Export Data Section Wise Function
  const ExportSectionWiseData = () => {

    setBlock(true);
    const ITC04SectionId =
      activeTab == 1
        ? 1
        : activeTab == 2
          ? 2
          : activeTab == 3
            ? 3
            : activeTab == 4
              ? 4
              : 0;

    itc04PurchaseInvoice
      .exportITC04ExportData(
        G_UCParId,
        finFromYear?.value,
        ITC04SectionId,
        token,
        subscriptionId,
        G_GSTIN,
        G_UserId
      )
      .then((res) => {
        if (res?.status == 200 && res?.data?.status == errorCodeConfig.APIDefaultCode.Success) {
          console.log("res1", res.data.data);
          setBlock(false);
          downloadURL(res.data.data)

        } else {
          console.log("res2");
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
            confirmButton: "btn btn-outline-danger",
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
    setPage(0);

  };

  //** Clear filter
  const ClearFilter = () => {
    console.log("clear filter");
    setCurrentCol([]);
    setCurrentCol1();
    setSearchVal1([]);
    setSearchDate("");
    setToDate("")
    setSearchApi(true);
    setPage(0);

    setFromQty("");
    setToQty("");
    setFromLossQty("");
    setToLossQty("");
    setFromTaxableValue("");
    setToTaxableValue("");
    setFromAmountCESS("");
    setToAmountCESS("");
    setSearchDate("");
    setToDate("");
    setSearchDate1("");
    setToDate1("");

    setFilterDropDownList({
      stateDropDownList: [],
      jobWorkerTypeDropDownList: [],
      typesOfGoodDropDownList: [],
      uqcDropDownList: [],
      lossuqcDropDownList: [],
      igstDropDownList: [],
      cgstDropDownList: [],
      sgstDropDownList: [],
      actionDropDownList: [],
    });
    setGridCustomFilter([])
  };

  // ** State data for filter
  const stateDataFilter = () => {
    let filterData = [];
    if (showsData == "mock") {
      if (activeTab == 1) {
        // Table4

        filterData =
          ITC04MockData.Table4 !== null &&
            ITC04MockData.Table4 !== "" &&
            ITC04MockData.Table4?.length !== 0
            ? ITC04MockData?.Table4
            : [];
      } else if (activeTab == 2) {
        // Table5A

        filterData =
          ITC04MockData?.Table5A !== null &&
            ITC04MockData?.Table5A !== "" &&
            ITC04MockData?.Table5A?.length !== 0
            ? ITC04MockData?.Table5A
            : [];
      } else if (activeTab == 3) {
        // Table5B

        filterData =
          ITC04MockData?.Table5B !== null &&
            ITC04MockData?.Table5B !== "" &&
            ITC04MockData?.Table5B?.length !== 0
            ? ITC04MockData?.Table5B
            : [];
      } else if (activeTab == 4) {
        // Table5C

        filterData =
          ITC04MockData?.Table5C !== null &&
            ITC04MockData?.Table5C !== "" &&
            ITC04MockData?.Table5C?.length !== 0
            ? ITC04MockData?.Table5C
            : [];
      } else {
        filterData = [];
      }
    } else {
      if (storeItc04Summary !== undefined) {
        setBlock(false);
        if (activeTab == 1) {
          // Table4

          filterData =
            storeItc04Summary?.table4 !== null &&
              storeItc04Summary?.table4 !== "" &&
              storeItc04Summary?.table4?.length !== 0 &&
              storeItc04Summary?.table4 !== undefined
              ? storeItc04Summary?.table4
              : [];
        } else if (activeTab == 2) {
          // Table5A

          filterData =
            storeItc04Summary?.table5A !== null &&
              storeItc04Summary?.table5A !== "" &&
              storeItc04Summary?.table5A?.length !== 0 &&
              storeItc04Summary?.table5A !== undefined
              ? storeItc04Summary?.table5A
              : [];
        } else if (activeTab == 3) {
          // Table5B

          filterData =
            storeItc04Summary?.table5B !== null &&
              storeItc04Summary?.table5B !== "" &&
              storeItc04Summary?.table5B?.length !== 0 &&
              storeItc04Summary?.table5B !== undefined
              ? storeItc04Summary?.table5B
              : [];
        } else if (activeTab == 4) {
          // Table5C

          filterData =
            storeItc04Summary?.table5C !== null &&
              storeItc04Summary?.table5C !== "" &&
              storeItc04Summary?.table5C?.length !== 0 &&
              storeItc04Summary?.table5C !== undefined
              ? storeItc04Summary?.table5C
              : [];
        } else {
          filterData = [];
        }
      } else {
        filterData = [];
      }
    }

    return filterData;
  };

  // **  Filter data
  function FilterData(arr) {
    console.log(arr, "arrayaa")
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
    // ** date format
    // ** date format
    if (arr?.length) {
      for (let i = 0; i < arr?.length; i++) {
        Object.assign(finalObj, arr[i]);
      }
    }

    const mapArrState = arr?.map(type => type?.State)

    const mapArrJobWorkerType = arr?.map(type => type?.JobWorkerType)
    const mapArrTypesOfGood = arr?.map(type => type?.TypesOfGood)
    console.log(mapArrTypesOfGood, stateDataFilter(), "mapArrStateTest");
    const mapArrUQC = arr?.map(type => type?.UQC)
    const mapArrLossUQC = arr?.map(type => type?.LossUQC)
    console.log(mapArrUQC, stateDataFilter(), "mapArrUQCtest");
    const mapArrIGST = arr?.map(type => Number(type?.IGST));

    const mapArrCGST = arr?.map(type => Number(type?.CGST))

    const mapArrSGST = arr?.map(type => Number(type?.SGST))
    const mapArrAction = arr?.map(type => type?.Action)


    // debugger
    updatedData = stateDataFilter("multiple")
      .filter((itemGstinOfJW) =>
        finalObj.GstinOfJW?.length
          ? itemGstinOfJW?.GstinOfJW?.toString().toLowerCase().includes(
            finalObj?.GstinOfJW?.toString().toLowerCase()
          )
          : itemGstinOfJW
      )
      .filter((itemTradeName) =>
        finalObj.TradeName?.length
          ? itemTradeName?.TradeName?.toString().toLowerCase().includes(
            finalObj?.TradeName?.toString().toLowerCase()
          )
          : itemTradeName
      )
      .filter((itemState) =>
        finalObj.State?.length ?
          mapArrState?.includes(itemState['State'])
          : itemState
      )
      .filter((itemJobWorkerType) =>
        finalObj.JobWorkerType?.length ?
          mapArrJobWorkerType?.includes(itemJobWorkerType['JobWorkerType'])
          : itemJobWorkerType
      )
      .filter((itemChallanNumber) =>
        finalObj.ChallanNumber?.length
          ? itemChallanNumber?.ChallanNumber?.toString().toLowerCase().includes(
            finalObj?.ChallanNumber?.toString().toLowerCase()
          )
          : itemChallanNumber
      )

      .filter((itemChallanDateLabel) => {
        if (finalObj?.ChallanDateLabel?.length) {
          const [a, b] = finalObj?.ChallanDateLabel?.split("to")
          const startDate = moment(a, 'YYYY-MM-DD');
          const toDate = moment(b, 'YYYY-MM-DD');
          const challanDateLabel = moment(itemChallanDateLabel?.ChallanDateLabel, 'DD-MM-YYYY');
          return challanDateLabel.isBetween(startDate, toDate, null, '[]');
        }
        else {
          return itemChallanDateLabel
        }
      })

      // .filter((itemChallanDateLabel) =>
      //   finalObj.ChallanDateLabel?.length
      //     ? itemChallanDateLabel?.ChallanDateLabel?.toLowerCase().includes(
      //       moment(finalObj?.ChallanDateLabel).format("DD-MM-YYYY")
      //     )
      //     : itemChallanDateLabel
      // )

      .filter((itemTypesOfGood) =>
        finalObj.TypesOfGood?.length ?
          mapArrTypesOfGood?.includes(itemTypesOfGood['TypesOfGood'])
          : itemTypesOfGood
      )

      .filter((itemDescriptionOfGood) =>
        finalObj.DescriptionOfGood?.length
          ? itemDescriptionOfGood?.DescriptionOfGood?.toString().toLowerCase().includes(
            finalObj?.DescriptionOfGood?.toString().toLowerCase()
          )
          : itemDescriptionOfGood
      )

      .filter((itemUQC) =>
        finalObj.UQC?.length ?
          mapArrUQC?.includes(itemUQC['UQC'])
          : itemUQC
      )
      // .filter((itemQty) =>
      //   finalObj.Qty?.length
      //     ? itemQty?.Qty?.toString().includes(
      //       Number(finalObj?.Qty?.toString())
      //     )
      //     : itemQty
      // )
      .filter((itemQty) => {
        if (finalObj?.Qty?.length) {
          const [a, b] = finalObj?.Qty?.split("to");
          const fromValue = parseFloat(a.trim());
          const toValue = parseFloat(b.trim());
          const invoiceValue = parseFloat(itemQty?.Qty);

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



      .filter((itemIGST) =>
        finalObj.IGST?.length ?
          mapArrIGST?.includes(Number(itemIGST['IGST']))
          : itemIGST
      )


      .filter((itemCGST) =>

        finalObj.CGST?.length ?
          mapArrCGST?.includes(Number(itemCGST['CGST'])) : itemCGST
      )

      .filter((itemSGST) =>
        finalObj.SGST?.length ?
          mapArrSGST?.includes(Number(itemSGST['SGST']))
          : itemSGST
      )
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


      .filter((itemAction) =>
        finalObj.Action?.length ?
          mapArrAction?.includes(itemAction['Action'])
          : itemAction
      )

      .filter((itemChallanNumberByJW) =>
        finalObj.ChallanNumberByJW?.length
          ? itemChallanNumberByJW?.ChallanNumberByJW?.toString().toLowerCase().includes(
            finalObj?.ChallanNumberByJW?.toString().toLowerCase()
          )
          : itemChallanNumberByJW
      )
      .filter((itemChallanDateByJWLabel) => {
        if (finalObj?.ChallanDateByJWLabel?.length) {
          const [a, b] = finalObj?.ChallanDateByJWLabel?.split("to")
          const startDate = moment(a, 'YYYY-MM-DD');
          const toDate = moment(b, 'YYYY-MM-DD');
          const challanDateByJWLabel = moment(itemChallanDateByJWLabel?.ChallanDateByJWLabel, 'DD-MM-YYYY');
          return challanDateByJWLabel.isBetween(startDate, toDate, null, '[]');
        }
        else {
          return itemChallanDateByJWLabel
        }
      })
      .filter((itemNatureOfJobWork) =>
        finalObj.NatureOfJobWork?.length
          ? itemNatureOfJobWork?.NatureOfJobWork?.toString().toLowerCase().includes(
            finalObj?.NatureOfJobWork?.toString().toLowerCase()
          )
          : itemNatureOfJobWork
      )


      .filter((itemLossUQC) =>
        finalObj.LossUQC?.length ?
          mapArrLossUQC?.includes(itemLossUQC['LossUQC'])
          : itemLossUQC
      )
      // .filter((itemLossQty) =>
      //   finalObj.LossQty?.length
      //     ? itemLossQty?.LossQty?.toString().includes(
      //       Number(finalObj?.LossQty?.toString())
      //     )
      //     : itemLossQty
      // )

      .filter((itemLossQty) => {
        if (finalObj?.LossQty?.length) {
          const [a, b] = finalObj?.LossQty?.split("to");
          const fromValue = parseFloat(a.trim());
          const toValue = parseFloat(b.trim());
          const invoiceValue = parseFloat(itemLossQty?.LossQty);

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
      .filter((itemInvoiceNumberByPrincipal) =>
        finalObj.InvoiceNumberByPrincipal?.length
          ? itemInvoiceNumberByPrincipal?.InvoiceNumberByPrincipal?.toString().toLowerCase().includes(
            finalObj?.InvoiceNumberByPrincipal?.toString().toLowerCase()
          )
          : itemInvoiceNumberByPrincipal
      )
      .filter((itemInvoiceDateByPrincipalLabel) => {
        if (finalObj?.InvoiceDateByPrincipalLabel?.length) {
          const [a, b] = finalObj?.InvoiceDateByPrincipalLabel?.split("to")
          const startDate = moment(a, 'YYYY-MM-DD');
          const toDate = moment(b, 'YYYY-MM-DD');
          const invoiceDateByPrincipalLabel = moment(itemInvoiceDateByPrincipalLabel?.InvoiceDateByPrincipalLabel, 'DD-MM-YYYY');
          return invoiceDateByPrincipalLabel.isBetween(startDate, toDate, null, '[]');
        }
        else {
          return itemInvoiceDateByPrincipalLabel
        }
      });


    flag = true;
    addArr.push(...updatedData);
    setPage(0);
    let uniq = [...new Set(addArr)];
    console.log(uniq, "uniqqqq");

    calcutions(uniq);

    return uniq;
  }

  //** For Calcutions of summary
  const calcutions = (values) => {
    let tValue = 0;
    let sgst = 0;
    let cgst = 0;
    let cess = 0;
    let igst = 0;
    let count = 0;

    values?.length
      ? values?.map((ele, index) => {
        count += parseFloat(ele?.InvoiceValue);
        tValue += parseFloat(ele?.TaxableValue);
        sgst += parseFloat(ele?.SGST);
        cess += parseFloat(ele?.Cess);
        cgst += parseFloat(ele?.CGST);
        igst += parseFloat(ele?.IGST);
      })
      : "";

    function getUniqueInvoiceLength(values) {
      const uniqueInvoices = new Set();

      values.forEach(item => {
        if (item.ChallanNumber && item.ChallanDateLabel) {
          const uniqueKey = item.ChallanNumber + '|' + item.ChallanDateLabel;
          uniqueInvoices.add(uniqueKey);
        }
      });

      return uniqueInvoices.size;
    }

    const uniqueLength = getUniqueInvoiceLength(values);

    setTotalInvoice(uniqueLength);
    setTotalIGST(igst);
    setTotalCess(cess);
    setTotalCGST(cgst);
    setTotalSGST(sgst);
    setTotalInvoiceValue(tValue + sgst + cess + cgst + igst); // Invoice Value Set
    setTotalTaxableValue(tValue);
  };

  useEffect(() => {
    if(itc04filedData.length > 0 ){
      setbtnDisable1(false)
    } 
    else{
      setbtnDisable1(true)
    }

  },[itc04filedData])

  return (
    <div>
      {block && <div className="loading1">Loading&#8230;</div>}
      <Row>
        <Col xs={12}>
          <Row>
            <Tabs
              className="mb-2"
              activeTab={activeTab}
              toggleTab={toggleTab}
              btnType={url}
            />

          </Row>

          <TabContent activeTab={activeTab}>
            {/* Table 4  */}
            <TabPane tabId="1" key="1">
              <Card>
                <CardBody className="CardBody p-0">
                  <Row className="p-1">
                    <Col md={8}>
                      <TotalShowContent
                        totalInvoice={totalInvoice}
                        totalInvoiceValue={totalInvoiceValue}
                        totalTaxableValue={totalTaxableValue}
                        totalIGST={totalIGST}
                        totalSGST={totalSGST}
                        totalCGST={totalCGST}
                        totalCess={totalCess}
                      ></TotalShowContent>
                    </Col>
                    <Col md={4}>
                      <Row>
                        <Col sm={5}>
                          <Label className="form-label">Invoice Type</Label>
                          <Select
                            id="purchaseId_invtype"
                            placeholder="Invoice Type"
                            theme={selectThemeColors}
                            components={animatedComponents}
                            options={invoiceTypeList}
                            classNamePrefix="select"
                            isDisabled={true}
                            value={{ label: "Table 4", value: "table4" }}
                          />
                        </Col>
                        <Col sm={7} >
                          <Label className='form-label' >
                            Return Period
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
                            classNamePrefix='select'
                            components={animatedComponents}
                            onChange={selectFromYear}
                            value={finFromYear}
                            isDisabled={true}
                          />
                        </Col>

                        {/* <Col sm={4}>
                            <Label className='form-label' >
                              To
                            </Label>
                         <Select
                            id="to"
                            placeholder="To"
                            isClearable={false}
                            theme={selectThemeColors}
                            closeMenuOnSelect={true}
                            options={panData}
                            components={animatedComponents}
                            className="basic-multi-select"
                            classNamePrefix='select'
                            onChange={selectFromMonth}
                            value={monthFrom}
                            isDisabled={true}
                            />
                          </Col> */}
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
                        {console.log(itc04filedData, "itc data-1")}
                        <HotTable
                          viewportColumnRenderingOffset={100}
                          id="table4"
                          ref={hotRef}
                          readOnly={true}
                          autoWrapRow={true}
                          rowHeights={RowSize}
                          columnHeaderHeight={columnHeaderSize}
                          style={itc04filedData.length > 0 ? "" : { textAlign: "center", overflowX: "hidden" }}
                          data={itc04filedData.length > 0 ? itc04filedData : [{ GstinOfJW: "No Data Found!" }]}
                          // autoColumnSize={true}
                          // data={itc04filedData}
                          autoColumnSize={{
                            samplingRatio: 23  // Adjust the samplingRatio as needed
                          }}
                          manualColumnResize={true}
                          afterGetColHeader={theader4}
                          fillHandle={false}
                          colHeaders={colHeaders}
                          stretchH="all"
                          preventOverflow="horizontal"
                          columns={table4Columns}
                          contextMenu={false}
                          bindRowsWithHeaders={true}
                          licenseKey="non-commercial-and-evaluation"
                          height="auto"

                          afterOnCellMouseDown={localAfterOnCellMouseDown}
                          mergeCells={itc04filedData.length > 0 ? false : [{ row: 0, col: 0, rowspan: 1, colspan: 8 }]}
                          hiddenColumns={false}
                          cells={function (row, col) {
                            var cp = {};
                            const hot = hotRef?.current?.hotInstance;
                            cp.className = "child";
                            if (col !== null && itc04filedData.length > 0) {
                              cp.renderer = emptyRender;
                            }
                            if (
                              col == 3 ||
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
                                  const selectedValue = this.getSelected()[0][1];
                                  const isValidColumn = [2, 3, 5, 6, 8, 9, 10, 11, 12, 13, 14, 15].includes(selectedValue);

                                  return isValidColumn;
                                },
                              },
                              table1checkbox: { // For CheckBox custom option

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
                                  const isHiddenCol = ![2, 3, 6, 8, 11, 12, 13, 15].includes(selectedCol);

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

                              option8: createOptionMinMax(fromQty, toQty, 9),
                              option6: createOptionMinMax(fromTaxableValue, toTaxableValue, 10),
                              option7: createOptionMinMax(fromAmountCESS, toAmountCESS, 14),


                              clear: {
                                name: `<button id='btnClear' name='Clear' tabIndex="-1"  value='Clear'>Clear</button>`,
                                //disabled: true,
                                callback: function (key, selection, clickEvent) {

                                  var src = clickEvent.target;
                                  console.log("name", src.tagName);
                                  if (src.tagName.toLowerCase() === "button") {
                                    if (clickEvent.target.id == "btnClear") {
                                      const hot = hotRef?.current?.hotInstance;

                                      const selectedValue = hot?.getSelected()[0][1];
                                      const isValidTextColumn = [2, 3, 5, 6, 8, 9, 10, 11, 12, 13, 14, 15].includes(selectedValue);
                                      const isValidCheckBoxColumn = [2, 3, 5, 6, 8, 9, 10, 11, 12, 13, 14, 15].includes(selectedValue);

                                      if (!isValidTextColumn) {
                                        let x = searchVal1
                                        var value = "";
                                        var columnName = table4Columns[currentCol1]?.data;
                                        let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                                        // filterObject.push({ [columnName]: value });
                                        if (!searchVal1?.length) {
                                          x.push(value);
                                          let y = currentCol;
                                          y.push(
                                            table4Columns[currentCol1]?.data
                                          );
                                          filterObject.push({ [columnName]: value });

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
                                            filterObject[Index] = { [columnName]: value }
                                          } else {
                                            x.push(value);
                                            let y = currentCol;
                                            y.push(
                                              table4Columns[currentCol1]?.data
                                            );
                                            filterObject.push({ [columnName]: value });
                                            setSearchVal1(x);
                                            setCurrentCol(y);
                                          }
                                        }
                                        // setSearchVal1(value);
                                        // let y = currentCol;
                                        // y.push(table4Columns[currentCol1]?.data);
                                        // setCurrentCol(y)

                                        setGridCustomFilter(filterObject)
                                        let newFilterData = FilterData(filterObject);
                                        setItc04Data([...newFilterData]);

                                      }
                                      else if (hot?.getSelected()[0][1] == 5) {

                                        var columnName = table4Columns[currentCol1]?.data;
                                        var value = '';
                                        setSearchDate('');
                                        setToDate('');
                                        let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                                        // filterObject.push({ [columnName]: value });
                                        if (!searchVal1?.length) {

                                          x.push(value);
                                          let y = currentCol;
                                          y.push(
                                            table4Columns[currentCol1]?.data
                                          );
                                          filterObject.push({ [columnName]: value });
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
                                            filterObject[Index] = { [columnName]: value }
                                          } else {
                                            x.push(value);
                                            let y = currentCol;
                                            y.push(
                                              table4Columns[currentCol1]?.data
                                            );
                                            setSearchVal1(x);
                                            setCurrentCol(y);
                                          }
                                        }
                                        setGridCustomFilter(filterObject)
                                        let newFilterData = FilterData(filterObject);
                                        setItc04Data([...newFilterData]);

                                      }
                                      else if (hot?.getSelected()[0][1] == 9) {
                                        const x = searchVal1
                                        var columnName = table4Columns[currentCol1]?.data;
                                        var value = '';
                                        setFromQty('');
                                        setToQty('');

                                        let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                                        // filterObject.push({ [columnName]: value });
                                        if (!searchVal1?.length) {

                                          x.push(value);
                                          let y = currentCol;
                                          y.push(
                                            table4Columns[currentCol1]?.data
                                          );
                                          filterObject.push({ [columnName]: value });
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
                                            filterObject[Index] = { [columnName]: value }
                                          } else {
                                            x.push(value);
                                            let y = currentCol;
                                            y.push(
                                              table4Columns[currentCol1]?.data
                                            );
                                            filterObject.push({ [columnName]: value });
                                            setSearchVal1(x);
                                            setCurrentCol(y);
                                          }
                                        }
                                        setGridCustomFilter(filterObject)
                                        let newFilterData = FilterData(filterObject);
                                        setItc04Data([...newFilterData]);

                                      }
                                      else if (hot?.getSelected()[0][1] == 10) {
                                        const x = searchVal1
                                        var columnName = table4Columns[currentCol1]?.data;
                                        var value = '';
                                        setFromTaxableValue('');
                                        setToTaxableValue('');

                                        let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                                        // filterObject.push({ [columnName]: value });
                                        if (!searchVal1?.length) {

                                          x.push(value);
                                          let y = currentCol;
                                          y.push(
                                            table4Columns[currentCol1]?.data
                                          );
                                          filterObject.push({ [columnName]: value });
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
                                            filterObject[Index] = { [columnName]: value }
                                          } else {
                                            x.push(value);
                                            let y = currentCol;
                                            y.push(
                                              table4Columns[currentCol1]?.data
                                            );
                                            filterObject.push({ [columnName]: value });
                                            setSearchVal1(x);
                                            setCurrentCol(y);
                                          }
                                        }
                                        setGridCustomFilter(filterObject)
                                        let newFilterData = FilterData(filterObject);
                                        setItc04Data([...newFilterData]);

                                      }
                                      else if (hot?.getSelected()[0][1] == 14) {
                                        const x = searchVal1
                                        var columnName = table4Columns[currentCol1]?.data;
                                        var value = '';
                                        setFromAmountCESS('');
                                        setToAmountCESS('');

                                        let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                                        // filterObject.push({ [columnName]: value });

                                        if (!searchVal1?.length) {

                                          x.push(value);
                                          let y = currentCol;
                                          y.push(
                                            table4Columns[currentCol1]?.data
                                          );
                                          filterObject.push({ [columnName]: value });
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
                                            filterObject[Index] = { [columnName]: value }
                                          } else {
                                            x.push(value);
                                            let y = currentCol;
                                            y.push(
                                              table4Columns[currentCol1]?.data
                                            );
                                            filterObject.push({ [columnName]: value });
                                            setSearchVal1(x);
                                            setCurrentCol(y);
                                          }
                                        }
                                        setGridCustomFilter(filterObject)
                                        let newFilterData = FilterData(filterObject);
                                        setItc04Data([...newFilterData]);

                                      }


                                      else if (isValidCheckBoxColumn) {
                                        let x = searchVal1
                                        var checkboxes = document.getElementsByClassName('checkBoxClass');

                                        arrChk = []
                                        setFilterDropDownList([]);
                                        var columnName = table4Columns[currentCol1]?.data;
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
                                            table4Columns[currentCol1]?.data
                                          );
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
                                            setSearchVal1(x);
                                            setCurrentCol(y);
                                          }

                                        }
                                        setGridCustomFilter(filterObject)
                                        let newFilterData = FilterData(filterObject);
                                        setItc04Data([...newFilterData]);

                                        const updatedFilterDropDownList = filterObject.reduce((acc, item) => {
                                          const { State, JobWorkerType, TypesOfGood, UQC, IGST, CGST, SGST, Action } = item;

                                          const updateList = (list, value) => {
                                            return list.includes(value) ? list : [...list, value];
                                          };

                                          if (State !== undefined) {
                                            acc.stateDropDownList = updateList(acc.stateDropDownList, State);
                                          } else if (JobWorkerType !== undefined) {
                                            acc.jobWorkerTypeDropDownList = updateList(acc.jobWorkerTypeDropDownList, JobWorkerType);
                                          } else if (TypesOfGood !== undefined) {
                                            acc.typesOfGoodDropDownList = updateList(acc.typesOfGoodDropDownList, TypesOfGood);
                                          } else if (UQC !== undefined) {
                                            acc.uqcDropDownList = updateList(acc.uqcDropDownList, UQC);
                                          }
                                          else if (IGST !== undefined) {
                                            acc.igstDropDownList = updateList(acc.igstDropDownList, IGST);
                                          }
                                          else if (CGST !== undefined) {
                                            acc.cgstDropDownList = updateList(acc.cgstDropDownList, CGST);
                                          }
                                          else if (SGST !== undefined) {
                                            acc.sgstDropDownList = updateList(acc.sgstDropDownList, SGST);
                                          }

                                          else if (Action !== undefined) {
                                            acc.actionDropDownList = updateList(acc.actionDropDownList, Action);
                                          }

                                          return acc;
                                        }, { stateDropDownList: [], jobWorkerTypeDropDownList: [], typesOfGoodDropDownList: [], uqcDropDownList: [], igstDropDownList: [], cgstDropDownList: [], sgstDropDownList: [], actionDropDownList: [] });

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
                              stateDropDownList,
                              jobWorkerTypeDropDownList,
                              typesOfGoodDropDownList,
                              uqcDropDownList,
                              igstDropDownList,
                              cgstDropDownList,
                              sgstDropDownList,
                              actionDropDownList,

                            } = filterDropDownList;

                            const listsToCheck = [
                              stateDropDownList,
                              jobWorkerTypeDropDownList,
                              typesOfGoodDropDownList,
                              uqcDropDownList,
                              igstDropDownList,
                              cgstDropDownList,
                              sgstDropDownList,
                              actionDropDownList,
                            ];

                            for (var j = 0; j < checkboxes.length; j++) {
                              for (var k = 0; k < listsToCheck.length; k++) {
                                if (listsToCheck[k]) {
                                  // For rcmDropDownList, check both conditions listsToCheck[k][i] == checkboxes[j].value and checkboxes?.length == 2
                                  // if (k === 1 && checkboxes.length === 2) {

                                  //   for (var i = 0; i < listsToCheck[k].length; i++) {
                                  //     if (listsToCheck[k][i] == checkboxes[j].value) {
                                  //       $(checkboxes[j]).prop("checked", true);
                                  //       break;
                                  //     }
                                  //   }
                                  // } else if (k === 5 && checkboxes.length === 3) {

                                  //   for (var i = 0; i < listsToCheck[k].length; i++) {
                                  //     if (listsToCheck[k][i] == checkboxes[j].value) {
                                  //       $(checkboxes[j]).prop("checked", true);
                                  //       break;
                                  //     }
                                  //   }
                                  // }
                                  // else {

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
                            const shouldExcludeCheckBox = [2, 3, 6, 8, 11, 12, 13, 15].includes(selectedValuecol);

                            if (hot?.getSelected()[0][1] != 2 && hot?.getSelected()[0][1] != 3 && hot?.getSelected()[0][1] != 5 && hot?.getSelected()[0][1] != 6 && hot?.getSelected()[0][1] != 8 && hot?.getSelected()[0][1] != 9 && hot?.getSelected()[0][1] != 10 && hot?.getSelected()[0][1] != 11 && hot?.getSelected()[0][1] != 12 && hot?.getSelected()[0][1] != 13 && hot?.getSelected()[0][1] != 14 && hot?.getSelected()[0][1] != 15) {
                              let x = searchVal1
                              var searchInput = document.querySelector(".htUIMultipleSelectSearch.htUIInput");
                              var value = searchInput?.children[0].value;

                              var columnName = table4Columns[currentCol1]?.data;
                              let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                              // filterObject.push({ [columnName]: value });

                              if (!searchVal1?.length) {

                                x.push(value);
                                let y = currentCol;
                                y.push(
                                  table4Columns[currentCol1]?.data
                                );
                                filterObject.push({ [columnName]: value });
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
                                  filterObject[Index] = { [columnName]: value }
                                } else {
                                  x.push(value);
                                  let y = currentCol;
                                  y.push(
                                    table4Columns[currentCol1]?.data
                                  );
                                  setSearchVal1(x);
                                  setCurrentCol(y);
                                }
                              }


                              setGridCustomFilter(filterObject)
                              let newFilterData = FilterData(filterObject);
                              setItc04Data([...newFilterData]);

                            }
                            else if (selectedValuecol == 5) {
                              const x = searchVal1
                              var searchInput1 = document.getElementById("custom1");
                              var searchInput2 = document.getElementById("custom2");
                              const invFromDate = searchInput1?.value
                              const invToDate = searchInput2?.value
                              var columnName = table4Columns[currentCol1]?.data;
                              var value = (searchInput1?.value || searchInput2?.value) && `${invFromDate ? invFromDate : invToDate}to${invToDate ? invToDate : invFromDate}`;
                              setSearchDate(searchInput1?.value);
                              setToDate(searchInput2?.value);
                              let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                              // filterObject.push({ [columnName]: value });
                              if (!searchVal1?.length) {
                                x.push(value);
                                let y = currentCol;
                                y.push(
                                  table4Columns[currentCol1]?.data
                                );
                                filterObject.push({ [columnName]: value })
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
                                  filterObject[Index] = { [columnName]: value }

                                } else {
                                  x.push(value);
                                  let y = currentCol;
                                  y.push(
                                    table4Columns[currentCol1]?.data
                                  );
                                  filterObject.push({ [columnName]: value })
                                  setSearchVal1(x);
                                  setCurrentCol(y);
                                }

                              }
                              setGridCustomFilter(filterObject)
                              let newFilterData = FilterData(filterObject);
                              setItc04Data([...newFilterData]);

                            }
                            else if (hot?.getSelected()[0][1] == 9) {
                              const x = searchVal1
                              var searchInput1 = document.getElementById("amount1");
                              var searchInput2 = document.getElementById("amount2");
                              const fromAmount = (searchInput1?.value)?.replaceAll(",", "")
                              const toAmount = (searchInput2?.value)?.replaceAll(",", "")
                              var columnName = table4Columns[currentCol1]?.data;
                              // var value = (searchInput1?.value || searchInput2?.value) && `${fromAmount ? fromAmount : toAmount}to${toAmount ? toAmount : fromAmount}`;
                              var value = `${fromAmount}to${toAmount}`;
                              setFromQty(searchInput1?.value);
                              setToQty(searchInput2?.value);
                              let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                              // filterObject.push({ [columnName]: value });

                              if (!searchVal1?.length) {
                                x.push(value);
                                let y = currentCol;
                                y.push(
                                  table4Columns[currentCol1]?.data
                                );
                                filterObject.push({ [columnName]: value });

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
                                  filterObject[Index] = { [columnName]: value }
                                } else {
                                  x.push(value);
                                  let y = currentCol;
                                  y.push(
                                    table4Columns[currentCol1]?.data
                                  );
                                  filterObject.push({ [columnName]: value });
                                  setSearchVal1(x);
                                  setCurrentCol(y);
                                }

                              }

                              setGridCustomFilter(filterObject)
                              let newFilterData = FilterData(filterObject);
                              setItc04Data([...newFilterData]);

                            }
                            else if (hot?.getSelected()[0][1] == 10) {
                              const x = searchVal1
                              var searchInput1 = document.getElementById("amount1");
                              var searchInput2 = document.getElementById("amount2");
                              const fromAmount = searchInput1?.value
                              const toAmount = searchInput2?.value
                              var columnName = table4Columns[currentCol1]?.data;
                              // var value = (searchInput1?.value || searchInput2?.value) && `${fromAmount ? fromAmount : toAmount}to${toAmount ? toAmount : fromAmount}`;
                              var value = `${fromAmount}to${toAmount}`;
                              setFromTaxableValue(searchInput1?.value);
                              setToTaxableValue(searchInput2?.value);
                              let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                              // filterObject.push({ [columnName]: value });
                              if (!searchVal1?.length) {
                                x.push(value);
                                let y = currentCol;
                                y.push(
                                  table4Columns[currentCol1]?.data
                                );
                                filterObject.push({ [columnName]: value });
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
                                  filterObject[Index] = { [columnName]: value }
                                } else {
                                  x.push(value);
                                  let y = currentCol;
                                  y.push(
                                    table4Columns[currentCol1]?.data
                                  );
                                  filterObject.push({ [columnName]: value });
                                  setSearchVal1(x);
                                  setCurrentCol(y);
                                }

                              }
                              setGridCustomFilter(filterObject)
                              let newFilterData = FilterData(filterObject);
                              setItc04Data([...newFilterData]);

                            }



                            else if (hot?.getSelected()[0][1] == 14) {
                              const x = searchVal1
                              var searchInput1 = document.getElementById("amount1");
                              var searchInput2 = document.getElementById("amount2");
                              const fromAmount = searchInput1?.value
                              const toAmount = searchInput2?.value
                              var columnName = table4Columns[currentCol1]?.data;
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
                                  table4Columns[currentCol1]?.data
                                );
                                filterObject.push({ [columnName]: value });
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
                                  filterObject[Index] = { [columnName]: value }
                                } else {
                                  x.push(value);
                                  let y = currentCol;
                                  y.push(
                                    table4Columns[currentCol1]?.data
                                  );
                                  filterObject.push({ [columnName]: value });
                                  setSearchVal1(x);
                                  setCurrentCol(y);
                                }

                              }
                              setGridCustomFilter(filterObject)
                              let newFilterData = FilterData(filterObject);
                              setItc04Data([...newFilterData]);

                            }

                            else if (shouldExcludeCheckBox) {
                              let x = searchVal1
                              var checkboxes = document.getElementsByClassName('checkBoxClass');
                              arrChk = []
                              setFilterDropDownList([]);
                              var columnName = table4Columns[currentCol1]?.data;
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
                                  table4Columns[currentCol1]?.data
                                );
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
                                  setSearchVal1(x);
                                  setCurrentCol(y);
                                }

                              }
                              setGridCustomFilter(filterObject)
                              let newFilterData = FilterData(filterObject);
                              setItc04Data([...newFilterData]);

                              const updatedFilterDropDownList = filterObject.reduce((acc, item) => {
                                const { State, JobWorkerType, TypesOfGood, UQC, IGST, CGST, SGST, Action } = item;

                                const updateList = (list, value) => {
                                  return list.includes(value) ? list : [...list, value];
                                };

                                if (State !== undefined) {
                                  acc.stateDropDownList = updateList(acc.stateDropDownList, State);
                                } else if (JobWorkerType !== undefined) {
                                  acc.jobWorkerTypeDropDownList = updateList(acc.jobWorkerTypeDropDownList, JobWorkerType);
                                } else if (TypesOfGood !== undefined) {
                                  acc.typesOfGoodDropDownList = updateList(acc.typesOfGoodDropDownList, TypesOfGood);
                                } else if (UQC !== undefined) {
                                  acc.uqcDropDownList = updateList(acc.uqcDropDownList, UQC);
                                } else if (IGST !== undefined) {
                                  acc.igstDropDownList = updateList(acc.igstDropDownList, IGST);
                                }
                                else if (CGST !== undefined) {
                                  acc.cgstDropDownList = updateList(acc.cgstDropDownList, CGST);
                                }
                                else if (SGST !== undefined) {
                                  acc.sgstDropDownList = updateList(acc.sgstDropDownList, SGST);
                                }
                                else if (Action !== undefined) {
                                  acc.actionDropDownList = updateList(acc.actionDropDownList, Action);
                                }

                                return acc;
                              }, { stateDropDownList: [], jobWorkerTypeDropDownList: [], typesOfGoodDropDownList: [], uqcDropDownList: [], igstDropDownList: [], cgstDropDownList: [], sgstDropDownList: [], actionDropDownList: [] });

                              setFilterDropDownList(updatedFilterDropDownList);

                            }

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
                      {/* new development for dropdown pagingation (don't delete this code) */}
                      {itc04Data?.length ? (<span>
                        <b>{`${paginationTitle}`}</b>  {" "}  &nbsp; &nbsp;
                      </span>) : <></>}
                      {itc04Data?.length ? (<Select
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
                      {itc04Data?.length ? (<span  >
                        <b>  {` ${pageNoTitle}`}</b>
                      </span>) : <></>}

                      &nbsp; &nbsp;
                      <ReactPaginate
                        breakLabel="..."
                        nextLabel=""
                        onPageChange={handlePageClick}
                        pageRangeDisplayed={2}
                        pageCount={pageCount}
                        forcePage={page}
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
            </TabPane>

            {/* Table 5A */}
            <TabPane tabId="2" key="2">
              <TabPane tabId="1" key="1">
                <Card>
                  <CardBody className="CardBody p-0">
                    <Row className="p-1">
                      <Col md={8}>
                        <TotalShowContent
                          totalInvoice={totalInvoice}
                          totalInvoiceValue={totalInvoiceValue}
                          totalTaxableValue={totalTaxableValue}
                          totalIGST={totalIGST}
                          totalSGST={totalSGST}
                          totalCGST={totalCGST}
                          totalCess={totalCess}
                        ></TotalShowContent>
                      </Col>
                      <Col md={4}>
                        <Row>
                          <Col sm={5}>
                            <Label className="form-label">Invoice Type</Label>
                            <Select
                              id="crdr_invtype"
                              placeholder="Invoice Type"
                              theme={selectThemeColors}
                              components={animatedComponents}
                              options={crdrInvoiceTypeList}
                              className="basic-multi-select"
                              classNamePrefix="select"
                              isDisabled={true}
                              value={{ label: "Table 5A", value: "table5a" }}
                            />
                          </Col>
                          {/* <Col sm={6}>
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
                              components={animatedComponents}
                              onChange={selectFromYear}
                              value={finFromYear}
                            />
                          </Col> */}
                          <Col sm={7} >
                            <Label className='form-label' >
                              Return Period
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
                              classNamePrefix='select'
                              components={animatedComponents}
                              onChange={selectFromYear}
                              value={finFromYear}
                              isDisabled={true}
                            />
                          </Col>

                          {/* <Col sm={4}>
                            <Label className='form-label' >
                              To
                            </Label>
                         <Select
                            id="to"
                            placeholder="To"
                            isClearable={false}
                            theme={selectThemeColors}
                            closeMenuOnSelect={true}
                            options={panData}
                            components={animatedComponents}
                            className="basic-multi-select"
                            classNamePrefix='select'
                            onChange={selectFromMonth}
                            value={monthFrom}
                            isDisabled={true}
                            />
                          </Col> */}
                        </Row>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
                <CardBody className="CardBody p-0">
                  <Row>
                    <Col sm="12">
                      <div>

                        <HotTable
                          viewportColumnRenderingOffset={100}
                          id="table5A"
                          autoWrapRow={true}
                          data={itc04filedData.length > 0 ? itc04filedData : [{ GstinOfJW: "No Data Found!" }]}
                          style={itc04filedData.length > 0 ? "" : { textAlign: "center", overflowX: "hidden" }}
                          autoColumnSize={{
                            samplingRatio: 23  // Adjust the samplingRatio as needed
                          }}
                          manualColumnResize={true}
                          rowHeights={RowSize}
                          columnHeaderHeight={columnHeaderSize}
                          afterGetColHeader={theader5A}
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
                          mergeCells={itc04filedData.length > 0 ? false : [{ row: 0, col: 0, rowspan: 1, colspan: 8 }]}
                          cells={function (row, col) {
                            var cp = {};

                            cp.className = "child";
                            if (col == 10 || col == 12) {
                              cp.className = "text-end";
                            }
                            if (col !== null && itc04filedData.length > 0) {
                              cp.renderer = emptyRender;
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
                                  const isValidColumn = [2, 4, 6, 9, 10, 11, 12, 13].includes(selectedValue);

                                  return isValidColumn;
                                },
                              },
                              table2checkbox: { // For CheckBox custom option

                                name: `<div  style="margin-left:6px">${checkBoxTitle}<label class="float-end text-danger "><a><u id="selectAll">Select All</u></a></label></div> <div  class="checkboxmenu custom-scrollbar"> <div >  <table id="searchTable" >
                                  ${dropDonwName1 &&
                                  dropDonwName1?.map((index) => (
                                    `<tr><td><input class="checkBoxClass" type="checkbox" value="${index?.label}" /> <span class="fw-normal">${index?.label?.length > 20 ? index?.label?.substring(0, 20) + "..." : index?.label}</span> </td></tr>`
                                  )).join('')
                                  }

                                    </table></div>
                                    </div>`, // Name can contain HTML
                                hidden() {
                                  const selectedCol = this.getSelectedRangeLast().to.col;
                                  const isHiddenCol = ![2, 9, 11, 13].includes(selectedCol);

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
                                  )}  class='custom-date col-md-11' placeholder='DD-MM-YYYY' id='custom1' name='date' value=${searchDate ? searchDate : toDate}  > <br/>

                                    To Date <br><input type='date' data-date="" data-date-format="DD MMMM YYYY" min='2017-07-01' max=${new Date()
                                    .toISOString()
                                    .slice(
                                      0,
                                      10
                                    )}  class='custom-date col-md-11' placeholder='DD-MM-YYYY' id='custom2' name='date' value=${toDate ? toDate : searchDate} >
                                   </div> `,
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
                                name: `<div style="margin-top:10px"> From Date <br><input type='date' data-date="" data-date-format="DD MMMM YYYY" min='2017-07-01' max=${new Date()
                                  .toISOString()
                                  .slice(
                                    0,
                                    10
                                  )}  class='custom-date col-md-11' placeholder='DD-MM-YYYY' id='custom1' name='date' value=${searchDate1 ? searchDate1 : toDate1} > <br/>

                                    To Date <br><input type='date' data-date="" data-date-format="DD MMMM YYYY" min='2017-07-01' max=${new Date()
                                    .toISOString()
                                    .slice(
                                      0,
                                      10
                                    )}  class='custom-date col-md-11' placeholder='DD-MM-YYYY' id='custom2' name='date' value=${toDate1 ? toDate1 : searchDate1} >
                                   </div> `,
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
                              option7: createOptionMinMax(fromQty, toQty, 10),
                              option8: createOptionMinMax(fromLossQty, toLossQty, 12),

                              clear: {
                                name: `<button id='btnClear' name='Clear' tabIndex="-1"  value='Clear'>Clear</button>`,

                                callback: function (key, selection, clickEvent) {

                                  var src = clickEvent.target;

                                  if (src.tagName.toLowerCase() === "button") {
                                    if (clickEvent.target.id == "btnClear") {
                                      const hot = hotRef1?.current?.hotInstance;

                                      const selectedValue = hot?.getSelected()[0][1];
                                      const isValidTextColumn = [2, 4, 6, 9, 10, 11, 12, 13].includes(selectedValue);
                                      const isValidCheckBoxColumn = [2, 4, 6, 9, 10, 11, 12, 13].includes(selectedValue);
                                      if (!isValidTextColumn) {
                                        let x = searchVal1
                                        var value = "";
                                        var columnName = table5AColumns[currentCol1]?.data;
                                        let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                                        // filterObject.push({ [columnName]: value });
                                        if (!searchVal1?.length) {
                                          x.push(value);
                                          let y = currentCol;
                                          y.push(
                                            table5AColumns[currentCol1]?.data
                                          );
                                          filterObject.push({ [columnName]: value });

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
                                            filterObject[Index] = { [columnName]: value }
                                          } else {
                                            x.push(value);
                                            let y = currentCol;
                                            y.push(
                                              table5AColumns[currentCol1]?.data
                                            );
                                            filterObject.push({ [columnName]: value });
                                            setSearchVal1(x);
                                            setCurrentCol(y);
                                          }
                                        }


                                        setGridCustomFilter(filterObject)
                                        let newFilterData = FilterData(filterObject);
                                        setItc04Data([...newFilterData]);

                                      }
                                      else if (hot?.getSelected()[0][1] == 4) {

                                        var columnName = table5AColumns[currentCol1]?.data;
                                        var value = '';
                                        setSearchDate('');
                                        setToDate('');
                                        let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                        if (!searchVal1?.length) {

                                          x.push(value);
                                          let y = currentCol;
                                          y.push(
                                            table5AColumns[currentCol1]?.data
                                          );
                                          filterObject.push({ [columnName]: value });
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
                                            filterObject[Index] = { [columnName]: value }
                                          } else {
                                            x.push(value);
                                            let y = currentCol;
                                            y.push(
                                              table5AColumns[currentCol1]?.data
                                            );

                                            setSearchVal1(x);
                                            setCurrentCol(y);
                                          }
                                        }

                                        setGridCustomFilter(filterObject)
                                        let newFilterData = FilterData(filterObject);
                                        setItc04Data([...newFilterData]);

                                      }
                                      else if (hot?.getSelected()[0][1] == 6) {

                                        var columnName = table5AColumns[currentCol1]?.data;
                                        var value = '';
                                        setSearchDate1('');
                                        setToDate1('');
                                        let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                        if (!searchVal1?.length) {

                                          x.push(value);
                                          let y = currentCol;
                                          y.push(
                                            table5AColumns[currentCol1]?.data
                                          );
                                          filterObject.push({ [columnName]: value });
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
                                            filterObject[Index] = { [columnName]: value }
                                          } else {
                                            x.push(value);
                                            let y = currentCol;
                                            y.push(
                                              table5AColumns[currentCol1]?.data
                                            );

                                            setSearchVal1(x);
                                            setCurrentCol(y);
                                          }
                                        }

                                        setGridCustomFilter(filterObject)
                                        let newFilterData = FilterData(filterObject);
                                        setItc04Data([...newFilterData]);

                                      }
                                      else if (hot?.getSelected()[0][1] == 10) {
                                        const x = searchVal1
                                        var columnName = table5AColumns[currentCol1]?.data;
                                        var value = '';
                                        setFromQty('');
                                        setToQty('');

                                        let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                        if (!searchVal1?.length) {

                                          x.push(value);
                                          let y = currentCol;
                                          y.push(
                                            table5AColumns[currentCol1]?.data
                                          );
                                          filterObject.push({ [columnName]: value });
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
                                            filterObject[Index] = { [columnName]: value }
                                          } else {
                                            x.push(value);
                                            let y = currentCol;
                                            y.push(
                                              table5AColumns[currentCol1]?.data
                                            );
                                            filterObject.push({ [columnName]: value });
                                            setSearchVal1(x);
                                            setCurrentCol(y);
                                          }
                                        }

                                        setGridCustomFilter(filterObject)
                                        let newFilterData = FilterData(filterObject);
                                        setItc04Data([...newFilterData]);

                                      }
                                      else if (hot?.getSelected()[0][1] == 12) {
                                        const x = searchVal1
                                        var columnName = table5AColumns[currentCol1]?.data;
                                        var value = '';
                                        setFromLossQty('');
                                        setToLossQty('');

                                        let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                                        if (!searchVal1?.length) {

                                          x.push(value);
                                          let y = currentCol;
                                          y.push(
                                            table5AColumns[currentCol1]?.data
                                          );
                                          filterObject.push({ [columnName]: value });
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
                                            filterObject[Index] = { [columnName]: value }
                                          } else {
                                            x.push(value);
                                            let y = currentCol;
                                            y.push(
                                              table5AColumns[currentCol1]?.data
                                            );
                                            filterObject.push({ [columnName]: value });
                                            setSearchVal1(x);
                                            setCurrentCol(y);
                                          }
                                        }

                                        setGridCustomFilter(filterObject)
                                        let newFilterData = FilterData(filterObject);
                                        setItc04Data([...newFilterData]);

                                      }


                                      else if (isValidCheckBoxColumn) {
                                        let x = searchVal1
                                        var checkboxes = document.getElementsByClassName('checkBoxClass');

                                        arrChk = []
                                        setFilterDropDownList([]);
                                        var columnName = table5AColumns[currentCol1]?.data;
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
                                            table5AColumns[currentCol1]?.data
                                          );
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
                                            setSearchVal1(x);
                                            setCurrentCol(y);
                                          }

                                        }
                                        setGridCustomFilter(filterObject)
                                        let newFilterData = FilterData(filterObject);
                                        setItc04Data([...newFilterData]);

                                        const updatedFilterDropDownList = filterObject.reduce((acc, item) => {
                                          const { State, UQC, LossUQC, Action } = item;

                                          const updateList = (list, value) => {
                                            return list.includes(value) ? list : [...list, value];
                                          };

                                          if (State !== undefined) {
                                            acc.stateDropDownList = updateList(acc.stateDropDownList, State);
                                          } else if (UQC !== undefined) {
                                            acc.uqcDropDownList = updateList(acc.uqcDropDownList, UQC);
                                          } else if (LossUQC !== undefined) {
                                            acc.lossuqcDropDownList = updateList(acc.lossuqcDropDownList, LossUQC);
                                          } else if (Action !== undefined) {
                                            acc.actionDropDownList = updateList(acc.actionDropDownList, Action);
                                          }
                                          return acc;
                                        }, { stateDropDownList: [], uqcDropDownList: [], lossuqcDropDownList: [], actionDropDownList: [] });

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
                              stateDropDownList,
                              uqcDropDownList,
                              lossuqcDropDownList,
                              actionDropDownList,
                            } = filterDropDownList;

                            const listsToCheck = [
                              stateDropDownList,
                              uqcDropDownList,
                              lossuqcDropDownList,
                              actionDropDownList,
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
                            const selectedValuecol = hot?.getSelected()?.[0]?.[1];
                            const shouldExcludeCheckBox = [2, 4, 6, 9, 11, 13].includes(selectedValuecol);

                            if (hot?.getSelected()[0][1] != 2 && hot?.getSelected()[0][1] != 4 && hot?.getSelected()[0][1] != 6 && hot?.getSelected()[0][1] != 9 && hot?.getSelected()[0][1] != 10 && hot?.getSelected()[0][1] != 11 && hot?.getSelected()[0][1] != 12 && hot?.getSelected()[0][1] != 13) {
                              const x = searchVal1
                              var searchInput = document.querySelector(".htUIMultipleSelectSearch.htUIInput");
                              var value = searchInput?.children[0].value;

                              var columnName = table5AColumns[currentCol1]?.data;
                              let filterObject = !gridCustomFilter ? [] : gridCustomFilter;


                              if (!searchVal1?.length) {

                                x.push(value);
                                let y = currentCol;
                                y.push(
                                  table5AColumns[currentCol1]?.data
                                );
                                filterObject.push({ [columnName]: value });
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
                                  filterObject[Index] = { [columnName]: value }
                                } else {
                                  x.push(value);
                                  let y = currentCol;
                                  y.push(
                                    table5AColumns[currentCol1]?.data
                                  );
                                  filterObject.push({ [columnName]: value });
                                  setSearchVal1(x);
                                  setCurrentCol(y);
                                }
                              }

                              setGridCustomFilter(filterObject)
                              let newFilterData = FilterData(filterObject);
                              setItc04Data([...newFilterData]);

                            }
                            else if (selectedValuecol == 4) {
                              const x = searchVal1
                              var searchInput1 = document.getElementById("custom1");
                              var searchInput2 = document.getElementById("custom2");
                              const invFromDate = searchInput1?.value
                              const invToDate = searchInput2?.value
                              var columnName = table5AColumns[currentCol1]?.data;
                              var value = (searchInput1?.value || searchInput2?.value) && `${invFromDate ? invFromDate : invToDate}to${invToDate ? invToDate : invFromDate}`;
                              setSearchDate(searchInput1?.value);
                              setToDate(searchInput2?.value);
                              let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                              if (!searchVal1?.length) {

                                x.push(value);
                                let y = currentCol;
                                y.push(
                                  table5AColumns[currentCol1]?.data
                                );
                                filterObject.push({ [columnName]: value });
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
                                  filterObject[Index] = { [columnName]: value }
                                } else {
                                  x.push(value);
                                  let y = currentCol;
                                  y.push(
                                    table5AColumns[currentCol1]?.data
                                  );
                                  filterObject.push({ [columnName]: value });
                                  setSearchVal1(x);
                                  setCurrentCol(y);
                                }
                              }
                              // setCurrentCol(y)
                              setGridCustomFilter(filterObject)
                              let newFilterData = FilterData(filterObject);
                              setItc04Data([...newFilterData]);

                            }
                            else if (selectedValuecol == 6) {
                              const x = searchVal1
                              var searchInput1 = document.getElementById("custom1");
                              var searchInput2 = document.getElementById("custom2");
                              const invFromDate = searchInput1?.value
                              const invToDate = searchInput2?.value
                              var columnName = table5AColumns[currentCol1]?.data;
                              var value = (searchInput1?.value || searchInput2?.value) && `${invFromDate ? invFromDate : invToDate}to${invToDate ? invToDate : invFromDate}`;
                              setSearchDate1(searchInput1?.value);
                              setToDate1(searchInput2?.value);
                              let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                              if (!searchVal1?.length) {

                                x.push(value);
                                let y = currentCol;
                                y.push(
                                  table5AColumns[currentCol1]?.data
                                );
                                filterObject.push({ [columnName]: value });
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
                                  filterObject[Index] = { [columnName]: value }
                                } else {
                                  x.push(value);
                                  let y = currentCol;
                                  y.push(
                                    table5AColumns[currentCol1]?.data
                                  );
                                  filterObject.push({ [columnName]: value });
                                  setSearchVal1(x);
                                  setCurrentCol(y);
                                }
                              }


                              setGridCustomFilter(filterObject)
                              let newFilterData = FilterData(filterObject);
                              setItc04Data([...newFilterData]);

                            }

                            else if (hot?.getSelected()[0][1] == 10) {
                              const x = searchVal1
                              var searchInput1 = document.getElementById("amount1");
                              var searchInput2 = document.getElementById("amount2");
                              const fromAmount = searchInput1?.value
                              const toAmount = searchInput2?.value
                              var columnName = table5AColumns[currentCol1]?.data;
                              // var value = (searchInput1?.value || searchInput2?.value) && `${fromAmount ? fromAmount : toAmount}to${toAmount ? toAmount : fromAmount}`;
                              var value = `${fromAmount}to${toAmount}`;
                              setFromQty(searchInput1?.value);
                              setToQty(searchInput2?.value);
                              let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                              if (!searchVal1?.length) {

                                x.push(value);
                                let y = currentCol;
                                y.push(
                                  table5AColumns[currentCol1]?.data
                                );
                                filterObject.push({ [columnName]: value });

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
                                  filterObject[Index] = { [columnName]: value }
                                } else {
                                  x.push(value);
                                  let y = currentCol;
                                  y.push(
                                    table5AColumns[currentCol1]?.data
                                  );
                                  filterObject.push({ [columnName]: value });
                                  setSearchVal1(x);
                                  setCurrentCol(y);
                                }
                              }


                              setGridCustomFilter(filterObject)
                              let newFilterData = FilterData(filterObject);
                              setItc04Data([...newFilterData]);

                            }
                            else if (hot?.getSelected()[0][1] == 12) {
                              const x = searchVal1
                              var searchInput1 = document.getElementById("amount1");
                              var searchInput2 = document.getElementById("amount2");
                              const fromAmount = searchInput1?.value
                              const toAmount = searchInput2?.value
                              var columnName = table5AColumns[currentCol1]?.data;

                              var value = `${fromAmount}to${toAmount}`;
                              setFromLossQty(searchInput1?.value);
                              setToLossQty(searchInput2?.value);
                              let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                              if (!searchVal1?.length) {

                                x.push(value);
                                let y = currentCol;
                                y.push(
                                  table5AColumns[currentCol1]?.data
                                );
                                filterObject.push({ [columnName]: value });
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
                                  filterObject[Index] = { [columnName]: value }
                                } else {
                                  x.push(value);
                                  let y = currentCol;
                                  y.push(
                                    table5AColumns[currentCol1]?.data
                                  );
                                  filterObject.push({ [columnName]: value });
                                  setSearchVal1(x);
                                  setCurrentCol(y);
                                }
                              }
                              // filterObject.push({ [columnName]: value });
                              setGridCustomFilter(filterObject)
                              let newFilterData = FilterData(filterObject);
                              setItc04Data([...newFilterData]);

                            }
                            else if (shouldExcludeCheckBox) {
                              let x = searchVal1
                              var checkboxes = document.getElementsByClassName('checkBoxClass');
                              arrChk = []
                              setFilterDropDownList([]);
                              var columnName = table5AColumns[currentCol1]?.data;
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
                                  table5AColumns[currentCol1]?.data
                                );
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
                                  setSearchVal1(x);
                                  setCurrentCol(y);
                                }

                              }
                              setGridCustomFilter(filterObject)
                              let newFilterData = FilterData(filterObject);
                              setItc04Data([...newFilterData]);

                              const updatedFilterDropDownList = filterObject.reduce((acc, item) => {
                                const { State, UQC, LossUQC, Action } = item;

                                const updateList = (list, value) => {
                                  return list.includes(value) ? list : [...list, value];
                                };

                                if (State !== undefined) {
                                  acc.stateDropDownList = updateList(acc.stateDropDownList, State);
                                } else if (UQC !== undefined) {
                                  acc.uqcDropDownList = updateList(acc.uqcDropDownList, UQC);
                                } else if (LossUQC !== undefined) {
                                  acc.lossuqcDropDownList = updateList(acc.lossuqcDropDownList, LossUQC);
                                } else if (Action !== undefined) {
                                  acc.actionDropDownList = updateList(acc.actionDropDownList, Action);
                                }

                                return acc;
                              }, { stateDropDownList: [], uqcDropDownList: [], lossuqcDropDownList: [], actionDropDownList: [] });

                              setFilterDropDownList(updatedFilterDropDownList);
                            }
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
                      {/* new development for dropdown pagingation (don't delete this code) */}
                      {itc04Data?.length ? (<span>
                        <b>{`${paginationTitle}`}</b>  {" "}  &nbsp; &nbsp;
                      </span>) : <></>}
                      {itc04Data?.length ? (<Select
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
                      {itc04Data?.length ? (<span  >
                        <b>  {` ${pageNoTitle}`}</b>
                      </span>) : <></>}

                      &nbsp; &nbsp;
                      <ReactPaginate
                        breakLabel="..."
                        nextLabel=""
                        onPageChange={handlePageClick}
                        pageRangeDisplayed={2}
                        pageCount={pageCount}
                        forcePage={page}
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
              </TabPane>
            </TabPane>

            {/* Table 5B */}
            <TabPane tabId="3" key="3">
              <Card>
                <CardBody className="CardBody p-0">
                  <Row className="p-1">
                    <Col md={8}>
                      <TotalShowContent
                        totalInvoice={totalInvoice}
                        totalInvoiceValue={totalInvoiceValue}
                        totalTaxableValue={totalTaxableValue}
                        totalIGST={totalIGST}
                        totalSGST={totalSGST}
                        totalCGST={totalCGST}
                        totalCess={totalCess}
                      ></TotalShowContent>
                    </Col>
                    <Col md={4}>
                      <Row>
                        <Col sm={5}>
                          <Label className="form-label">Invoice Type</Label>
                          <Select
                            id="purchaseId_invtype"
                            placeholder="Invoice Type"
                            theme={selectThemeColors}
                            // closeMenuOnSelect={false}
                            components={animatedComponents}
                            //  isMulti
                            //  options={b2csInvoiceTypeList}
                            isDisabled={true}
                            value={{ label: "Table 5B", value: "table5b" }}
                            // className="basic-multi-select"
                            classNamePrefix="select"
                          //onChange={setInvoceTypes}
                          />
                        </Col>

                        <Col sm={7} >
                          <Label className='form-label' >
                            Return Period
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
                            classNamePrefix='select'
                            components={animatedComponents}
                            onChange={selectFromYear}
                            value={finFromYear}
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

                        <HotTable
                          autoWrapRow={true}
                          viewportColumnRenderingOffset={100}
                          id="table5B"
                          data={itc04filedData.length > 0 ? itc04filedData : [{ GstinOfJW: "No Data Found!" }]}
                          // autoColumnSize={true}
                          autoColumnSize={{
                            samplingRatio: 23  // Adjust the samplingRatio as needed
                          }}
                          style={itc04filedData.length > 0 ? "" : { textAlign: "center", overflowX: "hidden" }}
                          manualColumnResize={true}
                          stretchH="all"
                          colHeaders={colHeaders}
                          rowHeights={RowSize}
                          columnHeaderHeight={columnHeaderSize}
                          afterGetColHeader={theader5B}
                          preventOverflow="horizontal"
                          columns={table5BColumns}
                          contextMenu={false}
                          bindRowsWithHeaders={true}
                          licenseKey="non-commercial-and-evaluation"
                          height="auto"
                          ref={hotRef2}
                          afterOnCellMouseDown={localAfterOnCellMouseDown}
                          mergeCells={itc04filedData.length > 0 ? false : [{ row: 0, col: 0, rowspan: 1, colspan: 8 }]}
                          hiddenColumns={false}
                          cells={function (row, col) {
                            var cp = {};
                            const hot = hotRef2?.current?.hotInstance;
                            cp.className = "child";
                            if (col !== null && itc04filedData.length > 0) {
                              cp.renderer = emptyRender;
                            }
                            if (col == 10 || col == 12) {
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
                                  const isValidColumn = [2, 4, 6, 9, 10, 11, 12, 13].includes(selectedValue);

                                  return isValidColumn;
                                },
                              },
                              table3checkbox: { // For CheckBox custom option

                                name: `<div  style="margin-left:6px">${checkBoxTitle}<label class="float-end text-danger "><a><u id="selectAll">Select All</u></a></label></div> <div  class="checkboxmenu custom-scrollbar"> <div >  <table id="searchTable" >
                                  ${dropDonwName2 &&
                                  dropDonwName2?.map((index) => (
                                    `<tr><td><input class="checkBoxClass" type="checkbox" value="${index?.label}" /> <span class="fw-normal">${index?.label?.length > 20 ? index?.label?.substring(0, 20) + "..." : index?.label}</span> </td></tr>`
                                  )).join('')
                                  }

                                    </table></div>
                                    </div>`, // Name can contain HTML
                                hidden() {
                                  const selectedCol = this.getSelectedRangeLast().to.col;
                                  const isHiddenCol = ![2, 9, 11, 13].includes(selectedCol);

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
                                name: `<div style="margin-top:10px"> From Date <br><input type='date' data-date="" data-date-format="DD MMMM YYYY" min='2017-07-01' max=${new Date()
                                  .toISOString()
                                  .slice(
                                    0,
                                    10
                                  )}  class='custom-date col-md-11' placeholder='DD-MM-YYYY' id='custom1' name='date' value=${searchDate1 ? searchDate1 : toDate1} > <br/>

                                    To Date <br><input type='date' data-date="" data-date-format="DD MMMM YYYY" min='2017-07-01' max=${new Date()
                                    .toISOString()
                                    .slice(
                                      0,
                                      10
                                    )}  class='custom-date col-md-11' placeholder='DD-MM-YYYY' id='custom2' name='date' value=${toDate1 ? toDate1 : searchDate1} >
                                   </div> `,
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
                              option7: createOptionMinMax(fromQty, toQty, 10),
                              option8: createOptionMinMax(fromLossQty, toLossQty, 12),

                              clear: {
                                name: `<button id='btnClear' name='Clear' tabIndex="-1"  value='Clear'>Clear</button>`,

                                callback: function (key, selection, clickEvent) {

                                  var src = clickEvent.target;

                                  if (src.tagName.toLowerCase() === "button") {
                                    if (clickEvent.target.id == "btnClear") {
                                      const hot = hotRef2?.current?.hotInstance;

                                      const selectedValue = hot?.getSelected()[0][1];
                                      const isValidTextColumn = [2, 4, 6, 9, 10, 11, 12, 13].includes(selectedValue);
                                      const isValidCheckBoxColumn = [2, 4, 6, 9, 10, 11, 12, 13].includes(selectedValue);
                                      if (!isValidTextColumn) {
                                        let x = searchVal1
                                        var value = "";
                                        var columnName = table5BColumns[currentCol1]?.data;
                                        let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                                        // filterObject.push({ [columnName]: value });

                                        if (!searchVal1?.length) {
                                          x.push(value);
                                          let y = currentCol;
                                          y.push(
                                            table5BColumns[currentCol1]?.data
                                          );
                                          filterObject.push({ [columnName]: value });

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
                                            filterObject[Index] = { [columnName]: value }
                                          } else {
                                            x.push(value);
                                            let y = currentCol;
                                            y.push(
                                              table5BColumns[currentCol1]?.data
                                            );
                                            filterObject.push({ [columnName]: value });
                                            setSearchVal1(x);
                                            setCurrentCol(y);
                                          }
                                        }


                                        setGridCustomFilter(filterObject)
                                        let newFilterData = FilterData(filterObject);
                                        setItc04Data([...newFilterData]);

                                      }
                                      else if (hot?.getSelected()[0][1] == 4) {

                                        var columnName = table5BColumns[currentCol1]?.data;
                                        var value = '';
                                        setSearchDate('');
                                        setToDate('');
                                        let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                                        if (!searchVal1?.length) {

                                          x.push(value);
                                          let y = currentCol;
                                          y.push(
                                            table5BColumns[currentCol1]?.data
                                          );
                                          filterObject.push({ [columnName]: value });
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
                                            filterObject[Index] = { [columnName]: value }
                                          } else {
                                            x.push(value);
                                            let y = currentCol;
                                            y.push(
                                              table5BColumns[currentCol1]?.data
                                            );

                                            setSearchVal1(x);
                                            setCurrentCol(y);
                                          }
                                        }


                                        setGridCustomFilter(filterObject)
                                        let newFilterData = FilterData(filterObject);
                                        setItc04Data([...newFilterData]);

                                      }
                                      else if (hot?.getSelected()[0][1] == 6) {

                                        var columnName = table5BColumns[currentCol1]?.data;
                                        var value = '';
                                        setSearchDate1('');
                                        setToDate1('');
                                        let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                                        if (!searchVal1?.length) {

                                          x.push(value);
                                          let y = currentCol;
                                          y.push(
                                            table5BColumns[currentCol1]?.data
                                          );
                                          filterObject.push({ [columnName]: value });
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
                                            filterObject[Index] = { [columnName]: value }
                                          } else {
                                            x.push(value);
                                            let y = currentCol;
                                            y.push(
                                              table5BColumns[currentCol1]?.data
                                            );

                                            setSearchVal1(x);
                                            setCurrentCol(y);
                                          }
                                        }

                                        setGridCustomFilter(filterObject)
                                        let newFilterData = FilterData(filterObject);
                                        setItc04Data([...newFilterData]);

                                      }
                                      else if (hot?.getSelected()[0][1] == 10) {
                                        const x = searchVal1
                                        var columnName = table5BColumns[currentCol1]?.data;
                                        var value = '';
                                        setFromQty('');
                                        setToQty('');

                                        let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                                        if (!searchVal1?.length) {

                                          x.push(value);
                                          let y = currentCol;
                                          y.push(
                                            table5BColumns[currentCol1]?.data
                                          );
                                          filterObject.push({ [columnName]: value });
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
                                            filterObject[Index] = { [columnName]: value }
                                          } else {
                                            x.push(value);
                                            let y = currentCol;
                                            y.push(
                                              table5BColumns[currentCol1]?.data
                                            );
                                            filterObject.push({ [columnName]: value });
                                            setSearchVal1(x);
                                            setCurrentCol(y);
                                          }
                                        }

                                        setGridCustomFilter(filterObject)
                                        let newFilterData = FilterData(filterObject);
                                        setItc04Data([...newFilterData]);

                                      }
                                      else if (hot?.getSelected()[0][1] == 12) {
                                        const x = searchVal1
                                        var columnName = table5BColumns[currentCol1]?.data;
                                        var value = '';
                                        setFromLossQty('');
                                        setToLossQty('');

                                        let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                                        if (!searchVal1?.length) {

                                          x.push(value);
                                          let y = currentCol;
                                          y.push(
                                            table5BColumns[currentCol1]?.data
                                          );
                                          filterObject.push({ [columnName]: value });
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
                                            filterObject[Index] = { [columnName]: value }
                                          } else {
                                            x.push(value);
                                            let y = currentCol;
                                            y.push(
                                              table5BColumns[currentCol1]?.data
                                            );
                                            filterObject.push({ [columnName]: value });
                                            setSearchVal1(x);
                                            setCurrentCol(y);
                                          }
                                        };
                                        setGridCustomFilter(filterObject)
                                        let newFilterData = FilterData(filterObject);
                                        setItc04Data([...newFilterData]);

                                      }
                                      else if (isValidCheckBoxColumn) {
                                        let x = searchVal1
                                        var checkboxes = document.getElementsByClassName('checkBoxClass');

                                        arrChk = []
                                        setFilterDropDownList([]);
                                        var columnName = table5BColumns[currentCol1]?.data;
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
                                            table5BColumns[currentCol1]?.data
                                          );
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
                                            setSearchVal1(x);
                                            setCurrentCol(y);
                                          }

                                        }
                                        setGridCustomFilter(filterObject)
                                        let newFilterData = FilterData(filterObject);
                                        setItc04Data([...newFilterData]);

                                        const updatedFilterDropDownList = filterObject.reduce((acc, item) => {
                                          const { State, UQC, LossUQC, Action } = item;

                                          const updateList = (list, value) => {
                                            return list.includes(value) ? list : [...list, value];
                                          };

                                          if (State !== undefined) {
                                            acc.stateDropDownList = updateList(acc.stateDropDownList, State);
                                          } else if (UQC !== undefined) {
                                            acc.uqcDropDownList = updateList(acc.uqcDropDownList, UQC);
                                          } else if (LossUQC !== undefined) {
                                            acc.lossuqcDropDownList = updateList(acc.lossuqcDropDownList, LossUQC);
                                          } else if (Action !== undefined) {
                                            acc.actionDropDownList = updateList(acc.actionDropDownList, Action);
                                          }
                                          return acc;
                                        }, { stateDropDownList: [], uqcDropDownList: [], lossuqcDropDownList: [], actionDropDownList: [] });

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
                              stateDropDownList,
                              uqcDropDownList,
                              lossuqcDropDownList,
                              actionDropDownList,
                            } = filterDropDownList;

                            const listsToCheck = [
                              stateDropDownList,
                              uqcDropDownList,
                              lossuqcDropDownList,
                              actionDropDownList,
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
                            const selectedValuecol = hot?.getSelected()?.[0]?.[1];
                            const shouldExcludeCheckBox = [2, 4, 6, 9, 11, 13].includes(selectedValuecol);

                            if (hot?.getSelected()[0][1] != 2 && hot?.getSelected()[0][1] != 4 && hot?.getSelected()[0][1] != 6 && hot?.getSelected()[0][1] != 9 && hot?.getSelected()[0][1] != 10 && hot?.getSelected()[0][1] != 11 && hot?.getSelected()[0][1] != 12 && hot?.getSelected()[0][1] != 13) {
                              const x = searchVal1
                              var searchInput = document.querySelector(".htUIMultipleSelectSearch.htUIInput");
                              var value = searchInput?.children[0].value;

                              var columnName = table5BColumns[currentCol1]?.data;
                              let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                              if (!searchVal1?.length) {

                                x.push(value);
                                let y = currentCol;
                                y.push(
                                  table5BColumns[currentCol1]?.data
                                );
                                filterObject.push({ [columnName]: value });
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
                                  filterObject[Index] = { [columnName]: value }
                                } else {
                                  x.push(value);
                                  let y = currentCol;
                                  y.push(
                                    table5BColumns[currentCol1]?.data
                                  );
                                  filterObject.push({ [columnName]: value });
                                  setSearchVal1(x);
                                  setCurrentCol(y);
                                }
                              }

                              setGridCustomFilter(filterObject)
                              let newFilterData = FilterData(filterObject);
                              setItc04Data([...newFilterData]);

                            }
                            else if (selectedValuecol == 4) {
                              const x = searchVal1
                              var searchInput1 = document.getElementById("custom1");
                              var searchInput2 = document.getElementById("custom2");
                              const invFromDate = searchInput1?.value
                              const invToDate = searchInput2?.value
                              var columnName = table5BColumns[currentCol1]?.data;
                              var value = (searchInput1?.value || searchInput2?.value) && `${invFromDate ? invFromDate : invToDate}to${invToDate ? invToDate : invFromDate}`;
                              setSearchDate(searchInput1?.value);
                              setToDate(searchInput2?.value);
                              let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                              // filterObject.push({ [columnName]: value });
                              if (!searchVal1?.length) {

                                x.push(value);
                                let y = currentCol;
                                y.push(
                                  table5BColumns[currentCol1]?.data
                                );
                                filterObject.push({ [columnName]: value });
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
                                  filterObject[Index] = { [columnName]: value }
                                } else {
                                  x.push(value);
                                  let y = currentCol;
                                  y.push(
                                    table5BColumns[currentCol1]?.data
                                  );
                                  filterObject.push({ [columnName]: value });
                                  setSearchVal1(x);
                                  setCurrentCol(y);
                                }
                              }
                              setGridCustomFilter(filterObject)
                              let newFilterData = FilterData(filterObject);
                              setItc04Data([...newFilterData]);

                            }
                            else if (selectedValuecol == 6) {

                              var searchInput1 = document.getElementById("custom1");
                              var searchInput2 = document.getElementById("custom2");
                              const invFromDate = searchInput1?.value
                              const invToDate = searchInput2?.value
                              var columnName = table5BColumns[currentCol1]?.data;
                              var value = (searchInput1?.value || searchInput2?.value) && `${invFromDate ? invFromDate : invToDate}to${invToDate ? invToDate : invFromDate}`;
                              setSearchDate1(searchInput1?.value);
                              setToDate1(searchInput2?.value);
                              let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                              // filterObject.push({ [columnName]: value });
                              if (!searchVal1?.length) {

                                x.push(value);
                                let y = currentCol;
                                y.push(
                                  table5BColumns[currentCol1]?.data
                                );
                                filterObject.push({ [columnName]: value });
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
                                  filterObject[Index] = { [columnName]: value }
                                } else {
                                  x.push(value);
                                  let y = currentCol;
                                  y.push(
                                    table5BColumns[currentCol1]?.data
                                  );
                                  filterObject.push({ [columnName]: value });
                                  setSearchVal1(x);
                                  setCurrentCol(y);
                                }
                              }
                              setGridCustomFilter(filterObject)
                              let newFilterData = FilterData(filterObject);
                              setItc04Data([...newFilterData]);

                            }
                            else if (hot?.getSelected()[0][1] == 10) {
                              const x = searchVal1
                              var searchInput1 = document.getElementById("amount1");
                              var searchInput2 = document.getElementById("amount2");
                              const fromAmount = searchInput1?.value
                              const toAmount = searchInput2?.value
                              var columnName = table5BColumns[currentCol1]?.data;
                              // var value = (searchInput1?.value || searchInput2?.value) && `${fromAmount ? fromAmount : toAmount}to${toAmount ? toAmount : fromAmount}`;
                              var value = `${fromAmount}to${toAmount}`;
                              setFromQty(searchInput1?.value);
                              setToQty(searchInput2?.value);
                              let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                              // filterObject.push({ [columnName]: value });
                              if (!searchVal1?.length) {

                                x.push(value);
                                let y = currentCol;
                                y.push(
                                  table5BColumns[currentCol1]?.data
                                );
                                filterObject.push({ [columnName]: value });

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
                                  filterObject[Index] = { [columnName]: value }
                                } else {
                                  x.push(value);
                                  let y = currentCol;
                                  y.push(
                                    table5BColumns[currentCol1]?.data
                                  );
                                  filterObject.push({ [columnName]: value });
                                  setSearchVal1(x);
                                  setCurrentCol(y);
                                }
                              }

                              setGridCustomFilter(filterObject)
                              let newFilterData = FilterData(filterObject);
                              setItc04Data([...newFilterData]);

                            }
                            else if (hot?.getSelected()[0][1] == 12) {
                              const x = searchVal1
                              var searchInput1 = document.getElementById("amount1");
                              var searchInput2 = document.getElementById("amount2");
                              const fromAmount = searchInput1?.value
                              const toAmount = searchInput2?.value
                              var columnName = table5BColumns[currentCol1]?.data;
                              // var value = (searchInput1?.value || searchInput2?.value) && `${fromAmount ? fromAmount : toAmount}to${toAmount ? toAmount : fromAmount}`;
                              var value = `${fromAmount}to${toAmount}`;
                              setFromLossQty(searchInput1?.value);
                              setToLossQty(searchInput2?.value);
                              let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                              // filterObject.push({ [columnName]: value });
                              if (!searchVal1?.length) {

                                x.push(value);
                                let y = currentCol;
                                y.push(
                                  table5BColumns[currentCol1]?.data
                                );
                                filterObject.push({ [columnName]: value });

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
                                  filterObject[Index] = { [columnName]: value }
                                } else {
                                  x.push(value);
                                  let y = currentCol;
                                  y.push(
                                    table5BColumns[currentCol1]?.data
                                  );
                                  filterObject.push({ [columnName]: value });
                                  setSearchVal1(x);
                                  setCurrentCol(y);
                                }
                              }
                              setGridCustomFilter(filterObject)
                              let newFilterData = FilterData(filterObject);
                              setItc04Data([...newFilterData]);

                            }

                            else if (shouldExcludeCheckBox) {
                              let x = searchVal1
                              var checkboxes = document.getElementsByClassName('checkBoxClass');
                              arrChk = []
                              setFilterDropDownList([]);
                              var columnName = table5BColumns[currentCol1]?.data;
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
                                  table5BColumns[currentCol1]?.data
                                );
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
                                  setSearchVal1(x);
                                  setCurrentCol(y);
                                }

                              }

                              setGridCustomFilter(filterObject)
                              let newFilterData = FilterData(filterObject);
                              setItc04Data([...newFilterData]);

                              const updatedFilterDropDownList = filterObject.reduce((acc, item) => {
                                const { State, UQC, LossUQC, Action } = item;

                                const updateList = (list, value) => {
                                  return list.includes(value) ? list : [...list, value];
                                };

                                if (State !== undefined) {
                                  acc.stateDropDownList = updateList(acc.stateDropDownList, State);
                                } else if (UQC !== undefined) {
                                  acc.uqcDropDownList = updateList(acc.uqcDropDownList, UQC);
                                } else if (LossUQC !== undefined) {
                                  acc.lossuqcDropDownList = updateList(acc.lossuqcDropDownList, LossUQC);
                                } else if (Action !== undefined) {
                                  acc.actionDropDownList = updateList(acc.actionDropDownList, Action);
                                }

                                return acc;
                              }, { stateDropDownList: [], uqcDropDownList: [], lossuqcDropDownList: [], actionDropDownList: [] });

                              setFilterDropDownList(updatedFilterDropDownList);
                            }
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
                      {/* new development for dropdown pagingation (don't delete this code) */}
                      {itc04Data?.length ? (<span>
                        <b>{`${paginationTitle}`}</b>  {" "}  &nbsp; &nbsp;
                      </span>) : <></>}
                      {itc04Data?.length ? (<Select
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
                      {itc04Data?.length ? (<span  >
                        <b>  {` ${pageNoTitle}`}</b>
                      </span>) : <></>}

                      &nbsp; &nbsp;
                      <ReactPaginate
                        breakLabel="..."
                        nextLabel=""
                        onPageChange={handlePageClick}
                        pageRangeDisplayed={2}
                        pageCount={pageCount}
                        forcePage={page}
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
            </TabPane>

            {/* Table 5C */}
            <TabPane tabId="4" key="4">
              <Card>
                <CardBody className="CardBody p-0">
                  <Row className="p-1">
                    <Col md={8}>
                      <TotalShowContent
                        totalInvoice={totalInvoice}
                        totalInvoiceValue={totalInvoiceValue}
                        totalTaxableValue={totalTaxableValue}
                        totalIGST={totalIGST}
                        totalSGST={totalSGST}
                        totalCGST={totalCGST}
                        totalCess={totalCess}
                      ></TotalShowContent>
                    </Col>
                    <Col md={4}>
                      <Row>
                        <Col sm={5}>
                          <Label className="form-label">Invoice Type</Label>
                          <Select
                            id="purchaseId_invtype"
                            placeholder="Invoice Type"
                            theme={selectThemeColors}
                            // closeMenuOnSelect={false}
                            components={animatedComponents}
                            //  isMulti
                            options={atInvoiceTypeList}
                            value={{ label: "Table 5C", value: "table5c" }}
                            // className="basic-multi-select"
                            classNamePrefix="select"
                            isDisabled={true}
                          //onChange={setInvoceTypes}
                          />
                        </Col>

                        <Col sm={7} >
                          <Label className='form-label' >
                            Return Period
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
                            classNamePrefix='select'
                            components={animatedComponents}
                            onChange={selectFromYear}
                            value={finFromYear}
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

                        <HotTable
                          id="table5C"
                          viewportColumnRenderingOffset={100}
                          autoWrapRow={true}
                          data={itc04filedData.length > 0 ? itc04filedData : [{ GstinOfJW: "No Data Found!" }]}
                          // autoColumnSize={true}
                          autoColumnSize={{
                            samplingRatio: 23  // Adjust the samplingRatio as needed
                          }}
                          style={itc04filedData.length > 0 ? "" : { textAlign: "center", overflowX: "hidden" }}
                          manualColumnResize={true}
                          colHeaders={colHeaders}
                          afterGetColHeader={theader5C}
                          stretchH="all"
                          preventOverflow="horizontal"
                          columns={table5CColumns}
                          rowHeights={RowSize}
                          columnHeaderHeight={columnHeaderSize}
                          contextMenu={false}
                          bindRowsWithHeaders={true}
                          licenseKey="non-commercial-and-evaluation"
                          height="auto"
                          ref={hotRef3}
                          afterOnCellMouseDown={localAfterOnCellMouseDown}
                          mergeCells={itc04filedData.length > 0 ? false : [{ row: 0, col: 0, rowspan: 1, colspan: 8 }]}
                          // hiddenColumns={{
                          //   columns: [8],
                          // }}
                          cells={function (row, col) {
                            var cp = {};
                            const hot = hotRef3?.current?.hotInstance;
                            cp.className = "child";
                            if (col !== null && itc04filedData.length > 0) {
                              cp.renderer = emptyRender;
                            }
                            if (col == 10 || col == 12) {
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
                                  const isValidColumn = [2, 4, 6, 9, 10, 11, 12, 13].includes(selectedValue);

                                  return isValidColumn;
                                },
                              },
                              table4checkbox: { // For CheckBox custom option

                                name: `<div  style="margin-left:6px">${checkBoxTitle}<label class="float-end text-danger "><a><u id="selectAll">Select All</u></a></label></div> <div  class="checkboxmenu custom-scrollbar"> <div >  <table id="searchTable" >
                                  ${dropDonwName3 &&
                                  dropDonwName3?.map((index) => (
                                    `<tr><td><input class="checkBoxClass" type="checkbox" value="${index?.label}" /> <span class="fw-normal">${index?.label?.length > 20 ? index?.label?.substring(0, 20) + "..." : index?.label}</span> </td></tr>`
                                  )).join('')
                                  }

                                    </table></div>
                                    </div>`, // Name can contain HTML
                                hidden() {
                                  const selectedCol = this.getSelectedRangeLast().to.col;
                                  const isHiddenCol = ![2, 9, 11, 13].includes(selectedCol);

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
                                name: `<div style="margin-top:10px"> From Date <br><input type='date' data-date="" data-date-format="DD MMMM YYYY" min='2017-07-01' max=${new Date()
                                  .toISOString()
                                  .slice(
                                    0,
                                    10
                                  )}  class='custom-date col-md-11' placeholder='DD-MM-YYYY' id='custom1' name='date' value=${searchDate1 ? searchDate1 : toDate1} > <br/>

                                    To Date <br><input type='date' data-date="" data-date-format="DD MMMM YYYY" min='2017-07-01' max=${new Date()
                                    .toISOString()
                                    .slice(
                                      0,
                                      10
                                    )}  class='custom-date col-md-11' placeholder='DD-MM-YYYY' id='custom2' name='date' value=${toDate1 ? toDate1 : searchDate1} >
                                   </div> `,
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
                              option7: createOptionMinMax(fromQty, toQty, 10),
                              option8: createOptionMinMax(fromLossQty, toLossQty, 12),

                              clear: {
                                name: `<button id='btnClear' name='Clear' tabIndex="-1"  value='Clear'>Clear</button>`,
                                //disabled: true,
                                callback: function (key, selection, clickEvent) {
                                  console.log("date picker clicked");
                                  var src = clickEvent.target;
                                  console.log("name", src.tagName);
                                  if (src.tagName.toLowerCase() === "button") {
                                    if (clickEvent.target.id == "btnClear") {
                                      const hot = hotRef3?.current?.hotInstance;

                                      const selectedValue = hot?.getSelected()[0][1];
                                      const isValidTextColumn = [2, 4, 6, 9, 10, 11, 12, 13].includes(selectedValue);
                                      const isValidCheckBoxColumn = [2, 4, 6, 9, 10, 11, 12, 13].includes(selectedValue);
                                      if (!isValidTextColumn) {
                                        let x = searchVal1
                                        var value = "";
                                        var columnName = table5CColumns[currentCol1]?.data;
                                        let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                                        // filterObject.push({ [columnName]: value });

                                        if (!searchVal1?.length) {
                                          x.push(value);
                                          let y = currentCol;
                                          y.push(
                                            table5CColumns[currentCol1]?.data
                                          );
                                          filterObject.push({ [columnName]: value });

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
                                            filterObject[Index] = { [columnName]: value }
                                          } else {
                                            x.push(value);
                                            let y = currentCol;
                                            y.push(
                                              table5CColumns[currentCol1]?.data
                                            );
                                            filterObject.push({ [columnName]: value });
                                            setSearchVal1(x);
                                            setCurrentCol(y);
                                          }
                                        }

                                        setGridCustomFilter(filterObject)
                                        let newFilterData = FilterData(filterObject);
                                        setItc04Data([...newFilterData]);

                                      }
                                      else if (hot?.getSelected()[0][1] == 4) {

                                        var columnName = table5CColumns[currentCol1]?.data;
                                        var value = '';
                                        setSearchDate('');
                                        setToDate('');
                                        let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                                        // filterObject.push({ [columnName]: value });

                                        if (!searchVal1?.length) {

                                          x.push(value);
                                          let y = currentCol;
                                          y.push(
                                            table5CColumns[currentCol1]?.data
                                          );
                                          filterObject.push({ [columnName]: value });
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
                                            filterObject[Index] = { [columnName]: value }
                                          } else {
                                            x.push(value);
                                            let y = currentCol;
                                            y.push(
                                              table5CColumns[currentCol1]?.data
                                            );

                                            setSearchVal1(x);
                                            setCurrentCol(y);
                                          }
                                        }


                                        setGridCustomFilter(filterObject)
                                        let newFilterData = FilterData(filterObject);
                                        setItc04Data([...newFilterData]);

                                      }
                                      else if (hot?.getSelected()[0][1] == 6) {

                                        var columnName = table5CColumns[currentCol1]?.data;
                                        var value = '';
                                        setSearchDate1('');
                                        setToDate1('');
                                        let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                                        // filterObject.push({ [columnName]: value });
                                        if (!searchVal1?.length) {

                                          x.push(value);
                                          let y = currentCol;
                                          y.push(
                                            table5CColumns[currentCol1]?.data
                                          );
                                          filterObject.push({ [columnName]: value });
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
                                            filterObject[Index] = { [columnName]: value }
                                          } else {
                                            x.push(value);
                                            let y = currentCol;
                                            y.push(
                                              table5CColumns[currentCol1]?.data
                                            );

                                            setSearchVal1(x);
                                            setCurrentCol(y);
                                          }
                                        }
                                        setGridCustomFilter(filterObject)
                                        let newFilterData = FilterData(filterObject);
                                        setItc04Data([...newFilterData]);

                                      }

                                      else if (hot?.getSelected()[0][1] == 10) {
                                        const x = searchVal1
                                        var columnName = table5CColumns[currentCol1]?.data;
                                        var value = '';
                                        setFromQty('');
                                        setToQty('');

                                        let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                                        // filterObject.push({ [columnName]: value });

                                        if (!searchVal1?.length) {

                                          x.push(value);
                                          let y = currentCol;
                                          y.push(
                                            table5CColumns[currentCol1]?.data
                                          );
                                          filterObject.push({ [columnName]: value });
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
                                            filterObject[Index] = { [columnName]: value }
                                          } else {
                                            x.push(value);
                                            let y = currentCol;
                                            y.push(
                                              table5CColumns[currentCol1]?.data
                                            );
                                            filterObject.push({ [columnName]: value });
                                            setSearchVal1(x);
                                            setCurrentCol(y);
                                          }
                                        }
                                        setGridCustomFilter(filterObject)
                                        let newFilterData = FilterData(filterObject);
                                        setItc04Data([...newFilterData]);

                                      }
                                      else if (hot?.getSelected()[0][1] == 12) {
                                        const x = searchVal1
                                        var columnName = table5CColumns[currentCol1]?.data;
                                        var value = '';
                                        setFromLossQty('');
                                        setToLossQty('');

                                        let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                                        // filterObject.push({ [columnName]: value });
                                        if (!searchVal1?.length) {

                                          x.push(value);
                                          let y = currentCol;
                                          y.push(
                                            table5CColumns[currentCol1]?.data
                                          );
                                          filterObject.push({ [columnName]: value });
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
                                            filterObject[Index] = { [columnName]: value }
                                          } else {
                                            x.push(value);
                                            let y = currentCol;
                                            y.push(
                                              table5CColumns[currentCol1]?.data
                                            );
                                            filterObject.push({ [columnName]: value });
                                            setSearchVal1(x);
                                            setCurrentCol(y);
                                          }
                                        };
                                        setGridCustomFilter(filterObject)
                                        let newFilterData = FilterData(filterObject);
                                        setItc04Data([...newFilterData]);

                                      }
                                      else if (isValidCheckBoxColumn) {
                                        let x = searchVal1
                                        var checkboxes = document.getElementsByClassName('checkBoxClass');

                                        arrChk = []
                                        setFilterDropDownList([]);
                                        var columnName = table5CColumns[currentCol1]?.data;
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
                                            table5CColumns[currentCol1]?.data
                                          );
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
                                            setSearchVal1(x);
                                            setCurrentCol(y);
                                          }

                                        }
                                        setGridCustomFilter(filterObject)
                                        let newFilterData = FilterData(filterObject);
                                        setItc04Data([...newFilterData]);

                                        const updatedFilterDropDownList = filterObject.reduce((acc, item) => {
                                          const { State, UQC, LossUQC, Action } = item;

                                          const updateList = (list, value) => {
                                            return list.includes(value) ? list : [...list, value];
                                          };

                                          if (State !== undefined) {
                                            acc.stateDropDownList = updateList(acc.stateDropDownList, State);
                                          } else if (UQC !== undefined) {
                                            acc.uqcDropDownList = updateList(acc.uqcDropDownList, UQC);
                                          } else if (LossUQC !== undefined) {
                                            acc.lossuqcDropDownList = updateList(acc.lossuqcDropDownList, LossUQC);
                                          } else if (Action !== undefined) {
                                            acc.actionDropDownList = updateList(acc.actionDropDownList, Action);
                                          }
                                          return acc;
                                        }, { stateDropDownList: [], uqcDropDownList: [], lossuqcDropDownList: [], actionDropDownList: [] });

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
                              stateDropDownList,
                              uqcDropDownList,
                              lossuqcDropDownList,
                              actionDropDownList,
                            } = filterDropDownList;

                            const listsToCheck = [
                              stateDropDownList,
                              uqcDropDownList,
                              lossuqcDropDownList,
                              actionDropDownList,
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
                            const selectedValuecol = hot?.getSelected()?.[0]?.[1];
                            const shouldExcludeCheckBox = [2, 4, 6, 9, 11, 13].includes(selectedValuecol);

                            if (hot?.getSelected()[0][1] != 2 && hot?.getSelected()[0][1] != 4 && hot?.getSelected()[0][1] != 6 && hot?.getSelected()[0][1] != 9 && hot?.getSelected()[0][1] != 10 && hot?.getSelected()[0][1] != 11 && hot?.getSelected()[0][1] != 12 && hot?.getSelected()[0][1] != 13) {
                              const x = searchVal1
                              var searchInput = document.querySelector(".htUIMultipleSelectSearch.htUIInput");
                              var value = searchInput?.children[0].value;

                              var columnName = table5CColumns[currentCol1]?.data;
                              let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                              // filterObject.push({ [columnName]: value });

                              if (!searchVal1?.length) {

                                x.push(value);
                                let y = currentCol;
                                y.push(
                                  table5CColumns[currentCol1]?.data
                                );
                                filterObject.push({ [columnName]: value });
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
                                  filterObject[Index] = { [columnName]: value }
                                } else {
                                  x.push(value);
                                  let y = currentCol;
                                  y.push(
                                    table5CColumns[currentCol1]?.data
                                  );
                                  filterObject.push({ [columnName]: value });
                                  setSearchVal1(x);
                                  setCurrentCol(y);
                                }
                              }

                              setGridCustomFilter(filterObject)
                              let newFilterData = FilterData(filterObject);
                              setItc04Data([...newFilterData]);

                            }
                            else if (selectedValuecol == 4) {
                              const x = searchVal1
                              var searchInput1 = document.getElementById("custom1");
                              var searchInput2 = document.getElementById("custom2");
                              const invFromDate = searchInput1?.value
                              const invToDate = searchInput2?.value
                              var columnName = table5CColumns[currentCol1]?.data;
                              var value = (searchInput1?.value || searchInput2?.value) && `${invFromDate ? invFromDate : invToDate}to${invToDate ? invToDate : invFromDate}`;
                              setSearchDate(searchInput1?.value);
                              setToDate(searchInput2?.value);
                              let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                              // filterObject.push({ [columnName]: value });
                              if (!searchVal1?.length) {

                                x.push(value);
                                let y = currentCol;
                                y.push(
                                  table5CColumns[currentCol1]?.data
                                );
                                filterObject.push({ [columnName]: value });
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
                                  filterObject[Index] = { [columnName]: value }
                                } else {
                                  x.push(value);
                                  let y = currentCol;
                                  y.push(
                                    table5CColumns[currentCol1]?.data
                                  );
                                  filterObject.push({ [columnName]: value });
                                  setSearchVal1(x);
                                  setCurrentCol(y);
                                }
                              }
                              setGridCustomFilter(filterObject)
                              let newFilterData = FilterData(filterObject);
                              setItc04Data([...newFilterData]);

                            }
                            else if (selectedValuecol == 6) {

                              var searchInput1 = document.getElementById("custom1");
                              var searchInput2 = document.getElementById("custom2");
                              const invFromDate = searchInput1?.value
                              const invToDate = searchInput2?.value
                              var columnName = table5CColumns[currentCol1]?.data;
                              var value = (searchInput1?.value || searchInput2?.value) && `${invFromDate ? invFromDate : invToDate}to${invToDate ? invToDate : invFromDate}`;
                              setSearchDate1(searchInput1?.value);
                              setToDate1(searchInput2?.value);
                              let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                              // filterObject.push({ [columnName]: value });
                              if (!searchVal1?.length) {

                                x.push(value);
                                let y = currentCol;
                                y.push(
                                  table5CColumns[currentCol1]?.data
                                );
                                filterObject.push({ [columnName]: value });
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
                                  filterObject[Index] = { [columnName]: value }
                                } else {
                                  x.push(value);
                                  let y = currentCol;
                                  y.push(
                                    table5CColumns[currentCol1]?.data
                                  );
                                  filterObject.push({ [columnName]: value });
                                  setSearchVal1(x);
                                  setCurrentCol(y);
                                }
                              }
                              setGridCustomFilter(filterObject)
                              let newFilterData = FilterData(filterObject);
                              setItc04Data([...newFilterData]);

                            }
                            else if (hot?.getSelected()[0][1] == 10) {

                              var searchInput1 = document.getElementById("amount1");
                              var searchInput2 = document.getElementById("amount2");
                              const fromAmount = searchInput1?.value
                              const toAmount = searchInput2?.value
                              var columnName = table5CColumns[currentCol1]?.data;
                              // var value = (searchInput1?.value || searchInput2?.value) && `${fromAmount ? fromAmount : toAmount}to${toAmount ? toAmount : fromAmount}`;
                              var value = `${fromAmount}to${toAmount}`;
                              setFromQty(searchInput1?.value);
                              setToQty(searchInput2?.value);
                              let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                              // filterObject.push({ [columnName]: value });
                              if (!searchVal1?.length) {

                                x.push(value);
                                let y = currentCol;
                                y.push(
                                  table5CColumns[currentCol1]?.data
                                );
                                filterObject.push({ [columnName]: value });

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
                                  filterObject[Index] = { [columnName]: value }
                                } else {
                                  x.push(value);
                                  let y = currentCol;
                                  y.push(
                                    table5CColumns[currentCol1]?.data
                                  );
                                  filterObject.push({ [columnName]: value });
                                  setSearchVal1(x);
                                  setCurrentCol(y);
                                }
                              }

                              setGridCustomFilter(filterObject)
                              let newFilterData = FilterData(filterObject);
                              setItc04Data([...newFilterData]);

                            }
                            else if (hot?.getSelected()[0][1] == 12) {

                              var searchInput1 = document.getElementById("amount1");
                              var searchInput2 = document.getElementById("amount2");
                              const fromAmount = searchInput1?.value
                              const toAmount = searchInput2?.value
                              var columnName = table5CColumns[currentCol1]?.data;
                              // var value = (searchInput1?.value || searchInput2?.value) && `${fromAmount ? fromAmount : toAmount}to${toAmount ? toAmount : fromAmount}`;
                              var value = `${fromAmount}to${toAmount}`;
                              setFromLossQty(searchInput1?.value);
                              setToLossQty(searchInput2?.value);
                              let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                              // filterObject.push({ [columnName]: value });
                              if (!searchVal1?.length) {

                                x.push(value);
                                let y = currentCol;
                                y.push(
                                  table5CColumns[currentCol1]?.data
                                );
                                filterObject.push({ [columnName]: value });

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
                                  filterObject[Index] = { [columnName]: value }
                                } else {
                                  x.push(value);
                                  let y = currentCol;
                                  y.push(
                                    table5CColumns[currentCol1]?.data
                                  );
                                  filterObject.push({ [columnName]: value });
                                  setSearchVal1(x);
                                  setCurrentCol(y);
                                }
                              }
                              setGridCustomFilter(filterObject)
                              let newFilterData = FilterData(filterObject);
                              setItc04Data([...newFilterData]);

                            }
                            else if (shouldExcludeCheckBox) {
                              let x = searchVal1
                              var checkboxes = document.getElementsByClassName('checkBoxClass');
                              arrChk = []
                              setFilterDropDownList([]);
                              var columnName = table5CColumns[currentCol1]?.data;
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
                                  table5CColumns[currentCol1]?.data
                                );
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
                                  setSearchVal1(x);
                                  setCurrentCol(y);
                                }

                              }

                              setGridCustomFilter(filterObject)
                              let newFilterData = FilterData(filterObject);
                              setItc04Data([...newFilterData]);

                              const updatedFilterDropDownList = filterObject.reduce((acc, item) => {
                                const { State, UQC, LossUQC, Action } = item;

                                const updateList = (list, value) => {
                                  return list.includes(value) ? list : [...list, value];
                                };

                                if (State !== undefined) {
                                  acc.stateDropDownList = updateList(acc.stateDropDownList, State);
                                } else if (UQC !== undefined) {
                                  acc.uqcDropDownList = updateList(acc.uqcDropDownList, UQC);
                                } else if (LossUQC !== undefined) {
                                  acc.lossuqcDropDownList = updateList(acc.lossuqcDropDownList, LossUQC);
                                } else if (Action !== undefined) {
                                  acc.actionDropDownList = updateList(acc.actionDropDownList, Action);
                                }

                                return acc;
                              }, { stateDropDownList: [], uqcDropDownList: [], lossuqcDropDownList: [], actionDropDownList: [] });

                              setFilterDropDownList(updatedFilterDropDownList);
                            }
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
                      {/* new development for dropdown pagingation (don't delete this code) */}
                      {itc04Data?.length ? (<span>
                        <b>{`${paginationTitle}`}</b>  {" "}  &nbsp; &nbsp;
                      </span>) : <></>}
                      {itc04Data?.length ? (<Select
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
                      {itc04Data?.length ? (<span  >
                        <b>  {` ${pageNoTitle}`}</b>
                      </span>) : <></>}

                      &nbsp; &nbsp;
                      <ReactPaginate
                        breakLabel="..."
                        nextLabel=""
                        onPageChange={handlePageClick}
                        pageRangeDisplayed={2}
                        pageCount={pageCount}
                        forcePage={page}
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
            </TabPane>
          </TabContent>



        </Col>
      </Row>
    </div>
  );
};

export default ITC04Invoices;
