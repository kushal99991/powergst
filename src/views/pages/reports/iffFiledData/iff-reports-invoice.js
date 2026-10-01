import { useState, useEffect, useRef } from "react";
import { HotTable } from "@handsontable/react";
import { textRenderer } from "handsontable/renderers";
import { registerAllModules } from "handsontable/registry";
import GSRT1SummaryInvoice from "../../../../services/gstr1/gstr1Services/gstr1PurchaseInvoiceService";
import errorCodeConfig from "../../../../configs/apiErrorCodeConfig";
import Select from "react-select"; // eslint-disable-line
import makeAnimated from "react-select/animated";
import { selectThemeColors } from "@utils";
import { useNavigate, useLocation, useOutletContext } from "react-router-dom";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { globleVariable } from "../../../../configs/globalVariable";
import LocalFunction from "../../../../configs/getLocalFunction";
import SessionFunction from "../../../../configs/getSessionFunction";
import { downloadURL } from "@helper/downloadUrl";
const animatedComponents = makeAnimated();
import { useSelector, useDispatch } from "react-redux";
import moment from "moment/moment";
import { getIFFData } from "./store";
import { PageSize } from '@configs/config'
import { urlEndpointConfig } from '@configs/urlEndpoint';
import iffFiledDownloadServices from "../../../../services/iffFiledServices/iffFiledDownloadServices";
import $ from 'jquery'

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
import { RowSize, checkBoxTitle, checkboxFilterCss, columnHeaderSize, paginationList, paginationTitle } from "../../../../configs/config";
import GSTR6AMockData from "./mockData";
import { showTotalRowPerPage } from "../../../../helper/tableRowsPerPage";

registerAllModules();
// ** Varirable
let isChecked = false;
const optionField = { label: "--Select--", value: "-1" };
var unitList = [];
var taxList = [];
var placeOfSupplyList = [];
let arrChk = [];
const finYearOption = LocalFunction.getLocalValue(
  globleVariable.rangeFilters,
  true
);
const YearList = JSON.parse(finYearOption);
const refershData = "refData";

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

// ** GSTR6A Invoice
const IffFiledInvoices = ({ returnDate }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const storeIFF = useSelector(
    (state) => state?.iFFFiledReport?.IFFREPORTS[0]?.Data
  );
  console.log(storeIFF, "StoreIFF")

  let arrFilter = [];
  const { setGSRT1Data, stepper } = useOutletContext();
  const [block, setBlock] = useState(false);
  const [gstr6aData, setgstr6aData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(PageSize);
  const [paginationUi, setPaginationUi] = useState();
  const [currentCol, setCurrentCol] = useState([]);
  const [currentCol1, setCurrentCol1] = useState();
  const [searchVal1, setSearchVal1] = useState([]);
  const [searchDate, setSearchDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [invoiceSecID, setInvoiceSecID] = useState();

  const [searchDate1, setSearchDate1] = useState("");
  const [toDate1, setToDate1] = useState("");

  const [searchDate2, setSearchDate2] = useState("");
  const [showsData, setShowsData] = useState("online");

  const [currentColb2cs, setCurrentColb2cs] = useState([]);
  const [currentCol1b2cs, setCurrentCol1b2cs] = useState();
  const [searchValb2cs, setSearchValb2cs] = useState([]);

  const [currentColcrdr, setCurrentColcrdr] = useState([]);
  const [currentCol1crdr, setCurrentCol1crdr] = useState();
  const [searchValcrdr, setSearchValcrdr] = useState([]);

  const [count, setCount] = useState(0);
  const [activeTab, setActiveTab] = useState("1");
  const [showList, setShowList] = useState(false);
  const [finFromYear, setFinFormYear] = useState(null);
  const [panData, setPanData] = useState([]);
  const [panDataFrom, setPanDataFrom] = useState([]);

  const [monthFrom, setMonthFrom] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [displayType, setDisplayType] = useState(false);
  const [searchApi, setSearchApi] = useState(false);

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
  const [gridCustomFilter, setGridCustomFilter] = useState([]);
  const [pageNoSelect, setPageNoSelect] = useState(paginationList[0]);
  const [pageTotTitle, setpageTotTitle] = useState(paginationTitle);
  const [filterDropDownList, setFilterDropDownList] = useState({
    rateDropDownList: [],
    noteTypeDropDownList: [],
    posDropDownList: [],
  })
  const [listOfCheckBox, setListOfCheckBox] = useState({
    rate: [],
    pos: [],
    NoteType: []
  });

  //for FromRange ToRange State
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


  function clearState() {
    setCurrentCol([]);
    setCurrentCol1();
    setSearchVal1([]);
    setSearchDate("");
    setSearchDate1("");
    setSearchApi(true);

    setGridCustomFilter([])
    setFilterDropDownList({
      rateDropDownList: [],
      noteTypeDropDownList: [],
      posDropDownList: [],

    });
    setRowsPerPage(PageSize);
    setPageNoSelect(paginationList[0]);
    setToDate('');
    setFromValue('');
    setToValue('');
    setFromTax('')
    setToTax('');
    setFromIgst('');
    setToIgst('');
    setFromCgst('');
    setToCgst('');
    setFromSgst('');
    setToSgst('');
    setFromCess('');
    setToCess('')

  }

  //ITC
  const [btnDisable1, setbtnDisable1] = useState(false);
  const [selectedYear, setSelectedYear] = useState(null);

  const G_UCParId = SessionFunction.getSessionValue(
    globleVariable.G_UCParId,
    true
  );

  const gstr1FiledFromDt = SessionFunction.getSessionValue(
    globleVariable.gstr1FiledFromDt,
    true
  );
  const gstr1FiledToDt = SessionFunction.getSessionValue(
    globleVariable.gstr1FiledToDt,
    true
  );

  const gstr1Range = sessionStorage.getItem(globleVariable.gstr6FileFromDt);
  const token = LocalFunction.getLocalValue(globleVariable.tokenKey, true);

  const location = useLocation();


  // ** dispatch GSTR6A
  useEffect(() => {
    if (storeIFF?.length < 1) {
      const userData = {
        UserClientId: G_UCParId,
        FromRange: gstr1FiledFromDt,
        ToRange: gstr1FiledToDt,
        SubscriptionId: SubscriptionId,
        gstNumber: G_GSTIN,
      };

      // setBlock(true)
      dispatch(getIFFData(userData));
    }
  }, []);

  // ** Active tab
  useEffect(() => {
    let activeTabData = {
      activeTab: activeTab,
      btnDisable1: btnDisable1,
      ExportSectionWiseData: ExportSectionWiseData,
      ClearFilter: ClearFilter,
    };
    setGSRT1Data(false, activeTabData);
  }, [activeTab, gstr6aData,btnDisable1]);

  useEffect(() => {
    //**  Purchase Master
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
    setBlock(true);
    iffFiledDownloadServices
      .iffFiledPagination()
      .then((res) => {
        if (
          res?.status == 200 &&
          res?.data?.status == errorCodeConfig.APIDefaultCode?.Success
        ) {
          setBlock(false);

          setListOfCheckBox({
            rate: res.data.data?.rate, pos: res?.data?.data?.state, NoteType: res?.data?.data?.noteType
          })
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
  }, []);

  useEffect(() => {
    stepper != null && stepper.to(2);
  }, [stepper]);

  //** Columns
  // #region  Columns
  const b2bColumns = [
    // {
    //   data: "select",
    //   type: "checkbox",
    //   width: 25,
    //   readOnly: false,
    // },
    {
      data: "RecipientGSTIN",
      title: "Supplier GSTIN",
    },
    {
      data: "TradeNameofSupplier",
      title: "Trade Name of Supplier",
    },
    {
      data: "InvoiceNumber",
      title: "Invoice Number",
    },

    {
      data: "InvoiceDateLabel",
      title: "Invoice Date",
    },
    {
      data: "InvoiceValue",
      title: "Invoice Value (₹)",
    },
    {
      data: "PlaceOfSupply",
      title: "POS",
    },
    {
      data: "Rate",
      title: "Rate",
    },
    {
      data: "TaxableValue",
      title: "Taxable Value (₹)",
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
      title: "CESS (₹)",
    },
    {
      data: "FilingStatus",
      title: "GSTR-1/IFF/GSTR-5 filing status",
    },
    {
      data: "FilingPeriod",
      title: "GSTR-1/IFF/GSTR-5 Filing Period",
    },
    {
      data: "Action",
      title: "Action",
    },
    {
      data: "Source",
      title: "Source",
    },
    {
      data: "IRNNo",
      title: "IRN No",
      width: "490",
    },
    {
      data: "IRNDateLabel",
      title: "IRN Date",
    },
  ];

  const b2bAColumns = [
    // {
    //   data: "select",
    //   type: "checkbox",
    //   width: 25,
    //   readOnly: false,
    // },
    {
      data: "OriginalInvoiceNumber",
      title: "Original Invoice Number",
      readOnly: true,
    },
    {
      data: "OriginalInvoiceDateLabel",
      title: "Original Invoice Date",
      readOnly: true,
    },
    {
      data: "RecipientGSTIN",
      title: "Suppliers GSTIN",
      readOnly: true,
    },
    {
      data: "TradeNameofSupplier",
      title: "Trade/Legal name of the supplier",
      readOnly: true,
    },
    {
      data: "RevisedInvoiceNumber",
      title: "Invoice Number",
      readOnly: true,
    },

    {
      data: "RevisedInvoiceDateLabel",
      title: "Invoice Date",
      readOnly: true,
    },
    {
      data: "InvoiceValue",
      title: "Invoice Value (₹)",
      readOnly: true,
    },
    {
      data: "PlaceOfSupply",
      title: "POS",
      readOnly: true,
    },

    {
      data: "Rate",
      title: "Rate",
      readOnly: true,
    },
    {
      data: "TaxableValue",
      title: "Taxable Value (₹)",
      readOnly: true,
    },
    {
      data: "IGST",
      title: "Integrated Tax (₹)",
      readOnly: true,
    },

    {
      data: "CGST",
      title: "Central Tax (₹)",
      readOnly: true,
    },
    {
      data: "SGST",
      title: "State/UT Tax (₹)",
      readOnly: true,
    },
    {
      data: "Cess",
      title: "CESS (₹)",
      readOnly: true,
    },
    {
      data: "FilingStatus",
      title: "GSTR-1/IFF/GSTR-5 filing status",
      readOnly: true,
    },
    {
      data: "FilingPeriod",
      title: "GSTR-1/IFF/GSTR-5 Filing Period",
      readOnly: true,
    },
  ];

  const cdnColumns = [
    // {
    //   data: "select",
    //   type: "checkbox",
    //   width: 25,
    //   readOnly: false,
    // },
    {
      data: "RecipientGSTIN",
      title: "Supplier GSTIN",
      readOnly: true,
    },
    {
      data: "TradeNameofSupplier",
      title: "Trade/Legal name of the supplierNote Type",
      readOnly: true,
    },
    {
      data: "NoteType",
      title: "Note Type",
      readOnly: true,
    },

    {
      data: "NoteNumber",
      title: "Note Number",
      readOnly: true,
    },
    {
      data: "NoteDateLabel",
      title: "Note Date",
      readOnly: true,
    },
    {
      data: "OriginalInvoiceOfCreditNote",
      title: "Original Invoice No",
      readOnly: true,
    },

    {
      data: "DateofOriginalInvoiceofCreditNoteLabel",
      title: "Original Invoice Date",
      readOnly: true,
    },

    {
      data: "PlaceOfSupply",
      title: "Place of Supply",
      readOnly: true,
    },

    {
      data: "Rate",
      title: "Rate",
      readOnly: true,
    },
    {
      data: "TaxableValue",
      title: "Taxable Value (₹)",
      readOnly: true,
    },
    {
      data: "IGST",
      title: "Integrated Tax (₹)",
      readOnly: true,
    },

    {
      data: "CGST",
      title: "Central Tax (₹)",
      readOnly: true,
    },
    {
      data: "SGST",
      title: "State/UT Tax (₹)",
      readOnly: true,
    },
    {
      data: "Cess",
      title: "CESS (₹)",
      readOnly: true,
    },
    {
      data: "FilingStatus",
      title: "GSTR-1/IFF/GSTR-5 filing status",
      readOnly: true,
    },
    {
      data: "FilingPeriod",
      title: "GSTR-1/IFF/GSTR-5 Filing Period",
      readOnly: true,
    },
    {
      data: "Source",
      title: "Source",
      readOnly: true,
    },
    {
      data: "IRNNo",
      title: "IRN",
      readOnly: true,
    },
    {
      data: "IRNDateLabel",
      title: "IRN Date",
      readOnly: true,
    },
  ];

  const cdnaColumns = [
    {
      data: "OriginalNoteNumber",
      title: "Document Number",
      readOnly: true,
    },
    {
      data: "OriginalNoteDateLabel",
      title: "Document Date",
      readOnly: true,
    },

    {
      data: "RecipientGSTIN",
      title: "Supplier GSTIN",
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
      // width: "150",
    },
    {
      data: "TradeNameofSupplier",
      title: "Trade/Legal name of the supplier",
      readOnly: true,
    },

    {
      data: "NoteType",
      title: "Note Type",
      readOnly: true,
    },

    {
      data: "RevisedNoteNumber",
      title: "Note Number",
      readOnly: true,
    },
    {
      data: "RevisedNoteDateLabel",
      title: "Note Date",
      readOnly: true,
    },
    {
      data: "OriginalInvoiceofCreditNote",
      title: "Original Invoice No",
      readOnly: true,
    },

    // {
    //   data: "OriginalInvoiceDateLabel",
    //   title: "Original Invoice Date",
    //   readOnly: true,
    // },

    {
      data: "PlaceOfSupply",
      title: "Place of Supply",
      readOnly: true,
    },
    {
      data: "Rate",
      title: "Rate",
      readOnly: true,
    },
    {
      data: "TaxableValue",
      title: "Taxable Value (₹)",
      readOnly: true,
    },
    {
      data: "IGST",
      title: "Integrated Tax (₹)",
      readOnly: true,
    },

    {
      data: "CGST",
      title: "Central Tax (₹)",
      readOnly: true,
    },
    {
      data: "SGST",
      title: "State/UT Tax (₹)",
      readOnly: true,
    },
    {
      data: "Cess",
      title: "CESS (₹)",
      readOnly: true,
    },
    {
      data: "FilingStatus",
      title: "GSTR-1/IFF/GSTR-5 filing status",
      readOnly: true,
    },
    {
      data: "FilingPeriod",
      title: "GSTR-1/IFF/GSTR-5 Filing Period",
      readOnly: true,
    },
  ];
  // #end region
  let dropDonwNameAssign;

  if (activeTab == 1) {
    if (b2bColumns[currentCol1]?.data === "PlaceOfSupply") { //7
      dropDonwNameAssign = listOfCheckBox.pos;
    } else if (b2bColumns[currentCol1]?.data === "Rate") { //6
      dropDonwNameAssign = listOfCheckBox.rate;
    }
  } else if (activeTab == 2) {
    if (b2bAColumns[currentCol1]?.data === "PlaceOfSupply") { //7
      dropDonwNameAssign = listOfCheckBox.pos;
    } else if (b2bAColumns[currentCol1]?.data === "Rate") { //6
      dropDonwNameAssign = listOfCheckBox.rate;
    }
  } else if (activeTab == 3) {
    if (cdnColumns[currentCol1]?.data === "PlaceOfSupply") { //7
      dropDonwNameAssign = listOfCheckBox.pos;
    } else if (cdnColumns[currentCol1]?.data === "Rate") { //6
      dropDonwNameAssign = listOfCheckBox.rate;
    } else if (cdnColumns[currentCol1]?.data === "NoteType") { //6
      dropDonwNameAssign = listOfCheckBox.NoteType;
    }
  } else if (activeTab == 4) {
    if (cdnaColumns[currentCol1]?.data === "PlaceOfSupply") { //7
      dropDonwNameAssign = listOfCheckBox.pos;
    } else if (cdnaColumns[currentCol1]?.data === "Rate") { //6
      dropDonwNameAssign = listOfCheckBox.rate;
    } else if (cdnaColumns[currentCol1]?.data === "NoteType") { //6
      dropDonwNameAssign = listOfCheckBox.NoteType;
    }
  }


  let dropDonwName = dropDonwNameAssign !== undefined && dropDonwNameAssign !== null ? dropDonwNameAssign : '';


  let finYear = null;
  let finMonth = null;
  let url = null;
  let G_GSTIN = null;
  let SubscriptionId = null;
  let G_UserId = null;

  if (location.state !== null) {
    finYear =
      location.state.fromDate !== null &&
        location.state.fromDate !== "null" &&
        (gstr1FiledFromDt == null || gstr1FiledFromDt == undefined)
        ? location.state.fromDate
        : gstr1FiledFromDt;
    finMonth =
      location.state.toDate !== null &&
        location.state.toDate !== "null" &&
        (gstr1FiledToDt == null || gstr1FiledToDt == undefined)
        ? location.state.toDate
        : gstr1FiledToDt;
    url =
      location.state.sectionId !== null && location.state.sectionId !== "null"
        ? location.state.sectionId
        : "";

    G_GSTIN =
      location.state.G_GSTIN !== null && location.state.G_GSTIN !== "null"
        ? location.state.G_GSTIN
        : "";

    SubscriptionId =
      location.state.subscriptionId !== null &&
        location.state.subscriptionId !== "null"
        ? location.state.subscriptionId
        : "";

    G_UserId =
      location.state.G_UserId !== null && location.state.G_UserId !== "null"
        ? location.state.G_UserId
        : "";
  }

  // ** From and To Date list
  useEffect(() => {
    setPanData(YearList);
    setPanDataFrom(YearList);
  }, []);

  //**  From and To Date  set
  useEffect(() => {
    setbtnDisable1(false);
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
        navigate(urlEndpointConfig.GSTR6A_FILED_REPORT)
      }
    }
  }, [displayType, activeTab]);

  // ** From Date
  const selectFromMonth = (value) => {
    setPage(0);
    setErrorMsg("");
    setMonthFrom(value);

    if (Number(finFromYear?.srNo) > Number(value?.srNo)) {
      const fromFilter = panDataFrom?.filter(
        (item) => Number(item.srNo) == Number(value.srNo)
      )[0];
      setFinFormYear(fromFilter);
    }

    //** ITC Tab

    if (activeTab == 11) {
      CompareMonth(finFromYear?.value, value?.value); // From and To
      // ItcSearch(finFromYear?.value, value?.value)
    } else if (activeTab == 5) {
      CompareMonth(finFromYear?.value, value?.value); // From and To
      getExempList(finFromYear?.value, value?.value);
    } else {
    }
  };

  //** From date
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
      gstr6SummaryData(activeTab);
      // setSearchApi(false);
    }
  }, [searchApi, activeTab, storeIFF]);

  // ** fetch GSTR6 with calculation
  const gstr6SummaryData = (secId) => {
    let arrData = [];
    if (showsData == "mock") {
      setBlock(false)
      if (secId == 1) {
        arrData = GSTR6AMockData?.B2B;
      } else if (secId == 2) {
        arrData = GSTR6AMockData?.B2BA;
      } else if (secId == 3) {
        arrData = GSTR6AMockData?.CDN;
      } else {
        arrData = GSTR6AMockData?.CDNA;
      }
    } else {

      if (storeIFF !== undefined) {
        setSearchApi(false);
        setBlock(false)
        if (secId == 1) {
          // B2B
          arrData =
            storeIFF?.B2B !== null &&
              storeIFF?.B2B !== "" &&
              storeIFF?.B2B.length !== 0 &&
              storeIFF?.B2B !== undefined
              ? storeIFF?.B2B
              : [];
        } else if (secId == 2) {
          // B2BA
          arrData =
            storeIFF?.B2BA !== null &&
              storeIFF?.B2BA !== "" &&
              storeIFF?.B2BA !== undefined &&
              storeIFF?.B2BA.length !== 0
              ? storeIFF?.B2BA
              : [];
        } else if (secId == 3) {
          // CDN
          arrData =
            storeIFF?.CDNR !== null &&
              storeIFF?.CDNR !== "" &&
              storeIFF?.CDNR !== undefined &&
              storeIFF?.CDNR.length !== 0
              ? storeIFF?.CDNR
              : [];
        } else if (secId == 4) {
          // CDNA
          arrData =
            storeIFF?.CDNRA !== null &&
              storeIFF?.CDNRA !== "" &&
              storeIFF?.CDNRA !== undefined &&
              storeIFF?.CDNRA.length !== 0
              ? storeIFF?.CDNRA
              : [];
        }
      }
    }

    setgstr6aData(arrData);
    calcutions(arrData,secId);
    setInvoiceSecID(secId);

  };

  // ** Clear
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
    setSearchDate(null);
    setSearchDate1(null);
    setSearchDate2(null);
    setToDate1(null);
    setToDate(null);
    clearState();
  }, [activeTab]);

  // ** Toggle tab
  const toggleTab = (tab) => {
    console.log("tab click", tab);
    setCurrentCol([]);
    setCurrentCol1();
    setSearchVal1([]);
    setSearchDate(null);
    setSearchDate1(null);
    setSearchDate2(null);
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
    setToDate1(null);
    setToDate(null);
    clearState();

  };

  // ** Grid Data client side pagnation
  const purchaseData = gstr6aData;
  const pageCount = Math.ceil(
    purchaseData?.length && purchaseData.length / rowsPerPage
  );

  const para1 = page * rowsPerPage;
  const para2 = page * rowsPerPage + rowsPerPage;
  // let GSTR6AData = gstr6aData && gstr6aData.slice(para1, para2);
  //** Mock data */
  let GSTR6AData = gstr6aData && gstr6aData.slice(para1, para2);

  // ** onclick pagination
  const handlePageClick = (event) => {
    setPage(event);
  };

  // *** with round figer value
  function emptyRender(instance, td, row, col, prop, value, cellProperties) {
    textRenderer.apply(this, arguments);

    if (activeTab == 1) {
      if (
        col == 5 ||
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
    } else if (activeTab == 2) {
      if (
        // col == 5 ||
        col == 7 ||
        col == 9 ||
        col == 10 ||
        col == 11 ||
        col == 12 ||
        col == 13 ||
        col == 14
      ) {
        let currnecyVal = formatINR(Number(value));

        if (currnecyVal !== 0) {
          td.innerText = currnecyVal;
        }
      }
    } else if (activeTab == 3) {
      if (
        col == 9 ||
        col == 10 ||
        col == 11 ||
        col == 12 ||
        col == 13 ||
        col == 14
      ) {
        let currnecyVal = formatINR(Number(value));

        if (currnecyVal !== 0) {
          td.innerText = currnecyVal;
        }
      }
    } else if (activeTab == 4) {
      if (
        col == 10 ||
        col == 11 ||
        col == 12 ||
        col == 13 ||
        col == 14 ||
        col == 15
      ) {
        let currnecyVal = formatINR(Number(value));

        if (currnecyVal !== 0) {
          td.innerText = currnecyVal;
        }
      }
    }
  }

  // gstr6 refs
  const hotRef = useRef(null);
  const hotRef1 = useRef(null);
  const hotRef2 = useRef(null);
  const hotRef3 = useRef(null);

  // ** B2b Tab
  const theader = (col, TH) => {

    if (activeTab == 1) {
      if (gridCustomFilter?.length > 0) {

        let finalObj = {};
        for (let i = 0; i < gridCustomFilter?.length; i++) {
          Object.assign(finalObj, gridCustomFilter[i]);
        }

        b2bColumns.forEach((ele, index) => {
          const columnIndex = index;
          const buttonExists = document?.querySelector(`#gstr6aFiledB2B .ht_clone_top thead th:nth-child(${columnIndex + 1}) button`);

          const columnMatchesCondition = Object.keys(finalObj).includes(ele.data);

          const columnValueValid = finalObj[ele.data] !== null && finalObj[ele.data] !== "";


          if (buttonExists && columnMatchesCondition && columnValueValid) {
            const TH = document.querySelector(`#gstr6aFiledB2B .ht_clone_top thead th:nth-child(${columnIndex + 1})`);

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
      col == 5 ||
      col == 6 ||
      col == 13 ||
      col == 14 ||
      col == 15
    ) {
      TH.className = "htLeft";
    } else {
      TH.className = "htRight";
    }
  };

  // ** ITC Tab
  const theaderITC = (col, TH) => {

    if (activeTab == 2) {
      if (gridCustomFilter.length > 0) {

        let finalObj = {};
        for (let i = 0; i < gridCustomFilter.length; i++) {
          Object.assign(finalObj, gridCustomFilter[i]);
        }

        b2bAColumns.forEach((ele, index) => {
          const columnIndex = index;
          const buttonExists = document?.querySelector(`#gstr6aFiledB2BA .ht_clone_top thead th:nth-child(${columnIndex + 1}) button`);

          const columnMatchesCondition = Object.keys(finalObj).includes(ele.data);
          // uniq.some(col1 => ele?.data.includes(col1));

          // Check if column value is not null 
          const columnValueValid = finalObj[ele.data] !== null && finalObj[ele.data] !== "";

          if (buttonExists && columnMatchesCondition && columnValueValid) {
            const TH = document.querySelector(`#gstr6aFiledB2BA .ht_clone_top thead th:nth-child(${columnIndex + 1})`);

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
    if (activeTab == 3) {
      if (gridCustomFilter?.length > 0) {

        let finalObj = {};
        for (let i = 0; i < gridCustomFilter?.length; i++) {
          Object.assign(finalObj, gridCustomFilter[i]);
        }

        cdnColumns.forEach((ele, index) => {
          const columnIndex = index;
          const buttonExists = document?.querySelector(`#gstr6aFiledCDNR .ht_clone_top thead th:nth-child(${columnIndex + 1}) button`);

          const columnMatchesCondition = Object.keys(finalObj).includes(ele.data);
          const columnValueValid = finalObj[ele.data] !== null && finalObj[ele.data] !== "";

          if (buttonExists && columnMatchesCondition && columnValueValid) {
            const TH = document.querySelector(`#gstr6aFiledCDNR .ht_clone_top thead th:nth-child(${columnIndex + 1})`);

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
    if (activeTab == 4) {
      if (gridCustomFilter?.length > 0) {

        let finalObj = {};
        for (let i = 0; i < gridCustomFilter?.length; i++) {
          Object.assign(finalObj, gridCustomFilter[i]);
        }

        cdnaColumns.forEach((ele, index) => {
          const columnIndex = index;
          const buttonExists = document?.querySelector(`#gstr6aFiledCDNRA .ht_clone_top thead th:nth-child(${columnIndex + 1}) button`);

          const columnMatchesCondition = Object.keys(finalObj).includes(ele.data);

          const columnValueValid = finalObj[ele.data] !== null && finalObj[ele.data] !== "";

          if (buttonExists && columnMatchesCondition && columnValueValid) {
            const TH = document.querySelector(`#gstr6aFiledCDNRA .ht_clone_top thead th:nth-child(${columnIndex + 1})`);
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

  //** cell mouse down
  function localAfterOnCellMouseDown(event, coords, td) {
    let handsontableColumns = null;

    if (activeTab == 1) {
      handsontableColumns = b2bColumns;
    } else if (activeTab == 2) {
      handsontableColumns = b2bAColumns;
    } else if (activeTab == 3) {
      handsontableColumns = cdnColumns;
    } else if (activeTab == 4) {
      handsontableColumns = cdnaColumns;
    }

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

  // ** Export
  const ExportSectionWiseData = () => {
    console.log("export data");

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

    setBlock(true);
    iffFiledDownloadServices
      .exportIFFExportData(
        G_UCParId,
        finFromYear?.value,
        monthFrom?.value,
        gstr1SectionId,
        token,
        SubscriptionId,
        G_GSTIN,
        G_UserId
      )
      .then((res) => {
        if (
          res?.status == 200 &&
          res?.data?.status == errorCodeConfig.APIDefaultCode
        ) {
          setBlock(false);
          downloadURL(res?.data?.data);
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
  };

  function isNumber(n) {
    return /^-?[\d.]+(?:e-?\d+)?$/.test(n);
  }

  //** Clear filter
  const ClearFilter = () => {

    clearState();
    // setDisplayType(true);

    setCurrentCol([]);
    setCurrentCol1();
    setSearchVal1([]);
    setSearchDate("");
    setSearchDate1("");
    setSearchDate2("");
    setSearchApi(true);
    setToDate1(null);
    setToDate(null);
    gstr6SummaryData(activeTab);


  };

  // ** State data for filter
  const stateDataFilter = () => {
    let filterData = [];

    if (showsData == "mock") {
      // if (activeTab == 1) {
      //   // B2B

      //   filterData =
      //     GSTR6AMockData?.B2B !== null &&
      //       GSTR6AMockData?.B2B !== "" &&
      //       GSTR6AMockData?.B2B?.length !== 0
      //       ? GSTR6AMockData?.B2B
      //       : [];
      // } else if (activeTab == 2) {
      //   // B2BA

      //   filterData =
      //     GSTR6AMockData?.B2BA !== null &&
      //       GSTR6AMockData?.B2BA !== "" &&
      //       GSTR6AMockData?.B2BA.length !== 0
      //       ? GSTR6AMockData?.B2BA
      //       : [];
      // } else if (activeTab == 3) {
      //   // CDN

      //   filterData =
      //     GSTR6AMockData?.CDN !== null &&
      //       GSTR6AMockData?.CDN !== "" &&
      //       GSTR6AMockData?.CDN.length !== 0
      //       ? GSTR6AMockData?.CDN
      //       : [];
      // } else if (activeTab == 4) {
      //   // CDNA

      //   filterData =
      //     GSTR6AMockData?.CDNA !== null &&
      //       GSTR6AMockData?.CDNA !== "" &&
      //       GSTR6AMockData?.CDNA.length !== 0
      //       ? GSTR6AMockData?.CDNA
      //       : [];
      // } else {
      //   filterData = [];
      // }
    } else {
      if (storeIFF !== undefined) {
        if (activeTab == 1) {
          // B2B

          filterData =
            storeIFF?.B2B !== null &&
              storeIFF?.B2B !== "" &&
              storeIFF?.B2B.length !== 0
              ? storeIFF?.B2B
              : [];
        } else if (activeTab == 2) {
          // B2BA

          filterData =
            storeIFF?.B2BA !== null &&
              storeIFF?.B2BA !== "" &&
              storeIFF?.B2BA.length !== 0
              ? storeIFF?.B2BA
              : [];
        } else if (activeTab == 3) {
          // CDN

          filterData =
            storeIFF?.CDNR !== null &&
              storeIFF?.CDNR !== "" &&
              storeIFF?.CDNR.length !== 0
              ? storeIFF?.CDNR
              : [];
        } else if (activeTab == 4) {
          // CDNA

          filterData =
            storeIFF?.CDNRA !== null &&
              storeIFF?.CDNRA !== "" &&
              storeIFF?.CDNRA.length !== 0
              ? storeIFF?.CDNRA
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
    let addArr = [];
    let updatedData = [];
    let finalObj = {};

    // ** date format
    console.log(arr, 'partFilter', stateDataFilter())
    for (let i = 0; i < arr.length; i++) {
      Object.assign(finalObj, arr[i]);
    }

    const mapArrRate = arr?.map(type => Number(type?.Rate))
    const mapArrNote = arr?.map(type => type?.NoteType)
    const mapArrpos = arr?.map(type => type?.PlaceOfSupply)


    updatedData = stateDataFilter()
      .filter((itemGSTIN) =>
        finalObj.RecipientGSTIN?.toString().length
          ? itemGSTIN?.RecipientGSTIN?.toString()
            .toLowerCase()
            .includes(finalObj?.RecipientGSTIN?.toString().toLowerCase())
          : itemGSTIN
      )
      .filter((itemTradeName) =>
        finalObj.TradeNameofSupplier?.length
          ? itemTradeName?.TradeNameofSupplier?.toString()
            .toLowerCase()
            .includes(finalObj?.TradeNameofSupplier?.toString().toLowerCase())
          : itemTradeName
      )
      .filter((item) => {
        if (finalObj?.InvoiceNo?.length) {
          const [a, b] = finalObj?.InvoiceNo?.split("to");
          const fromValue = parseFloat(a.trim());
          const toValue = parseFloat(b.trim());
          const finalValue = parseFloat(item?.InvoiceNo);

          if (!isNaN(finalValue)) {
            if (!isNaN(fromValue) && !isNaN(toValue)) {
              return finalValue >= fromValue && finalValue <= toValue;
            }
            else if (!isNaN(fromValue)) {
              return finalValue >= fromValue;
            }
            else {
              return finalValue <= toValue;
            }
          }
        }
        return true;
      })
      .filter((item) => {
        if (finalObj?.InvoiceDateLabel?.length) {
          const [a, b] = finalObj?.InvoiceDateLabel?.split("to")
          const startDate = moment(a, 'YYYY-MM-DD');
          const toDate = moment(b, 'YYYY-MM-DD');
          const invoiceDate = moment(item?.InvoiceDateLabel, 'DD-MM-YYYY');
          return invoiceDate.isBetween(startDate, toDate, null, '[]');
        }
        else {
          return item
        }
      })
      .filter((item) => {
        if (finalObj?.InvoiceValue?.length) {
          const [a, b] = finalObj?.InvoiceValue?.split("to");
          const fromValue = parseFloat(a.trim());
          const toValue = parseFloat(b.trim());
          const finalValue = parseFloat(item?.InvoiceValue);

          if (!isNaN(finalValue)) {
            if (!isNaN(fromValue) && !isNaN(toValue)) {
              return finalValue >= fromValue && finalValue <= toValue;
            }
            else if (!isNaN(fromValue)) {
              return finalValue >= fromValue;
            }
            else {
              return finalValue <= toValue;
            }
          }
        }
        return true;
      })
      .filter((item) =>
        finalObj.PlaceOfSupply?.length ?
          mapArrpos?.includes(item['PlaceOfSupply']) : item
      )
    
      .filter((item) =>
        finalObj.Rate?.length ?
          mapArrRate?.includes(Number(item['Rate'])) : item
      )
      .filter((item) => {
        if (finalObj?.TaxableValue?.length) {
          const [a, b] = finalObj?.TaxableValue?.split("to");
          const fromValue = parseFloat(a.trim());
          const toValue = parseFloat(b.trim());
          const finalValue = parseFloat(item?.TaxableValue);

          if (!isNaN(finalValue)) {
            if (!isNaN(fromValue) && !isNaN(toValue)) {
              return finalValue >= fromValue && finalValue <= toValue;
            }
            else if (!isNaN(fromValue)) {
              return finalValue >= fromValue;
            }
            else {
              return finalValue <= toValue;
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
          const finalValue = parseFloat(item?.IGST);

          if (!isNaN(finalValue)) {
            if (!isNaN(fromValue) && !isNaN(toValue)) {
              return finalValue >= fromValue && finalValue <= toValue;
            }
            else if (!isNaN(fromValue)) {
              return finalValue >= fromValue;
            }
            else {
              return finalValue <= toValue;
            }
          }
        }
        return true;
      })
      .filter((item) => {
        if (finalObj?.CGST?.length) {
          const [a, b] = finalObj?.CGST?.split("to");
          const fromValue = parseFloat(a.trim());
          const toValue = parseFloat(b.trim());
          const finalValue = parseFloat(item?.CGST);

          if (!isNaN(finalValue)) {
            if (!isNaN(fromValue) && !isNaN(toValue)) {
              return finalValue >= fromValue && finalValue <= toValue;
            }
            else if (!isNaN(fromValue)) {
              return finalValue >= fromValue;
            }
            else {
              return finalValue <= toValue;
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
          const finalValue = parseFloat(item?.SGST);

          if (!isNaN(finalValue)) {
            if (!isNaN(fromValue) && !isNaN(toValue)) {
              return finalValue >= fromValue && finalValue <= toValue;
            }
            else if (!isNaN(fromValue)) {
              return finalValue >= fromValue;
            }
            else {
              return finalValue <= toValue;
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
          const finalValue = parseFloat(item?.Cess);

          if (!isNaN(finalValue)) {
            if (!isNaN(fromValue) && !isNaN(toValue)) {
              return finalValue >= fromValue && finalValue <= toValue;
            }
            else if (!isNaN(fromValue)) {
              return finalValue >= fromValue;
            }
            else {
              return finalValue <= toValue;
            }
          }
        }
        return true;
      })
      .filter((itemInvoiceNumber) =>
        finalObj.InvoiceNumber?.length
          ? itemInvoiceNumber?.InvoiceNumber?.toString()
            .toLowerCase()
            .includes(finalObj?.InvoiceNumber?.toString().toLowerCase())
          : itemInvoiceNumber
      )

      .filter((itemOriginalInvoiceNumber) =>
        finalObj.OriginalInvoiceNumber?.length
          ? itemOriginalInvoiceNumber?.OriginalInvoiceNumber?.toString()
            .toLowerCase()
            .includes(
              finalObj?.OriginalInvoiceNumber?.toString().toLowerCase()
            )
          : itemOriginalInvoiceNumber
      )
      .filter((item) => {
        if (finalObj?.OriginalInvoiceDateLabel?.length) {
          const [a, b] = finalObj?.OriginalInvoiceDateLabel?.split("to")
          const startDate = moment(a, 'YYYY-MM-DD');
          const toDate = moment(b, 'YYYY-MM-DD');
          const invoiceDate = moment(item?.OriginalInvoiceDateLabel, 'DD-MM-YYYY');
          return invoiceDate.isBetween(startDate, toDate, null, '[]');
        }
        else {
          return item
        }
      })
      .filter((itemRevisedInvoiceNumber) =>
        finalObj.RevisedInvoiceNumber?.length
          ? itemRevisedInvoiceNumber?.RevisedInvoiceNumber?.toString()
            .toLowerCase()
            .includes(
              finalObj?.RevisedInvoiceNumber?.toString().toLowerCase()
            )
          : itemRevisedInvoiceNumber
      )
      .filter((item) => {
        if (finalObj?.RevisedInvoiceDateLabel?.length) {
          const [a, b] = finalObj?.RevisedInvoiceDateLabel?.split("to")
          const startDate = moment(a, 'YYYY-MM-DD');
          const toDate = moment(b, 'YYYY-MM-DD');
          const invoiceDate = moment(item?.RevisedInvoiceDateLabel, 'DD-MM-YYYY');
          return invoiceDate.isBetween(startDate, toDate, null, '[]');
        }
        else {
          return item
        }
      })
      .filter((item) =>
        finalObj.NoteType?.length ?
          mapArrNote?.includes(item['NoteType']) : item
      )
      .filter((itemNoteNumber) =>
        finalObj.NoteNumber?.length
          ? itemNoteNumber?.NoteNumber?.toString()
            .toLowerCase()
            .includes(finalObj?.NoteNumber?.toString().toLowerCase())
          : itemNoteNumber
      )
      .filter((item) => {
        if (finalObj?.NoteDateLabel?.length) {
          const [a, b] = finalObj?.NoteDateLabel?.split("to")
          const startDate = moment(a, 'YYYY-MM-DD');
          const toDate = moment(b, 'YYYY-MM-DD');
          const invoiceDate = moment(item?.NoteDateLabel, 'DD-MM-YYYY');
          return invoiceDate.isBetween(startDate, toDate, null, '[]');
        }
        else {
          return item
        }
      })
      .filter((itemOriginalInvoiceOfCreditNote) =>
        finalObj.OriginalInvoiceOfCreditNote?.length
          ? itemOriginalInvoiceOfCreditNote?.OriginalInvoiceOfCreditNote?.toString()
            .toLowerCase()
            .includes(
              finalObj?.OriginalInvoiceOfCreditNote?.toString().toLowerCase()
            )
          : itemOriginalInvoiceOfCreditNote
      )

      .filter((itemDateofOriginalInvoiceofCreditNoteLabel) =>
        finalObj.DateofOriginalInvoiceofCreditNoteLabel?.length
          ? itemDateofOriginalInvoiceofCreditNoteLabel?.DateofOriginalInvoiceofCreditNoteLabel?.toLowerCase().includes(
            moment(finalObj?.DateofOriginalInvoiceofCreditNoteLabel).format(
              "DD-MM-YYYY"
            )
          )
          : itemDateofOriginalInvoiceofCreditNoteLabel
      )
      .filter((itemFilingStatus) =>
        finalObj.FilingStatus?.length
          ? itemFilingStatus?.FilingStatus?.toString()
            .toLowerCase()
            .includes(finalObj?.FilingStatus?.toString().toLowerCase())
          : itemFilingStatus
      )
      .filter((itemFilingPeriod) =>
        finalObj.FilingPeriod?.length
          ? itemFilingPeriod?.FilingPeriod?.toString()
            .toLowerCase()
            .includes(finalObj?.FilingPeriod?.toLowerCase())
          : itemFilingPeriod
      )

      .filter((itemOriginalNoteNumber) =>
        finalObj.OriginalNoteNumber?.length
          ? itemOriginalNoteNumber?.OriginalNoteNumber?.toString()
            .toLowerCase()
            .includes(finalObj?.OriginalNoteNumber?.toLowerCase())
          : itemOriginalNoteNumber
      )
      .filter((item) => {
        if (finalObj?.OriginalNoteDateLabel?.length) {
          const [a, b] = finalObj?.OriginalNoteDateLabel?.split("to")
          const startDate = moment(a, 'YYYY-MM-DD');
          const toDate = moment(b, 'YYYY-MM-DD');
          const invoiceDate = moment(item?.OriginalNoteDateLabel, 'DD-MM-YYYY');
          return invoiceDate.isBetween(startDate, toDate, null, '[]');
        }
        else {
          return item
        }
      })
      .filter((itemRevisedNoteNumber) =>
        finalObj.RevisedNoteNumber?.length
          ? itemRevisedNoteNumber?.RevisedNoteNumber?.toString()
            .toLowerCase()
            .includes(finalObj?.RevisedNoteNumber?.toLowerCase())
          : itemRevisedNoteNumber
      )
      .filter((item) => {
        if (finalObj?.RevisedNoteDateLabel?.length) {
          const [a, b] = finalObj?.RevisedNoteDateLabel?.split("to")
          const startDate = moment(a, 'YYYY-MM-DD');
          const toDate = moment(b, 'YYYY-MM-DD');
          const invoiceDate = moment(item?.RevisedNoteDateLabel, 'DD-MM-YYYY');
          return invoiceDate.isBetween(startDate, toDate, null, '[]');
        }
        else {
          return item
        }
      });

    addArr.push(...updatedData);
    setPage(0);
    let uniq = [...new Set(addArr)];
    calcutions(uniq,invoiceSecID);
    return uniq;
  }

  // ** Calculation function
  const calcutions = (values,invType) => {
    let tValue = 0;
    let sgst = 0;
    let cgst = 0;
    let cess = 0;
    let igst = 0;
    let count = 0;
    values.length
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
          
          if (invType == 1) {
            if (item.InvoiceNumber && item.InvoiceDateLabel && item.RecipientGSTIN) {
              const uniqueKey = item.InvoiceNumber + '|' + item.InvoiceDateLabel + '|' + item.RecipientGSTIN;
              uniqueInvoices.add(uniqueKey);
            }
          } else if (invType == 2) {
            if (item.RevisedInvoiceNumber && item.RevisedInvoiceDateLabel && item.RecipientGSTIN) {
              const uniqueKey = item.RevisedInvoiceNumber + '|' + item.RevisedInvoiceDateLabel + '|' + item.RecipientGSTIN;
              uniqueInvoices.add(uniqueKey);
            }
          } else if (invType == 3) {
            if (item.NoteNumber && item.NoteDateLabel ) {
              const uniqueKey = item.NoteNumber + '|' + item.NoteDateLabel ;
              uniqueInvoices.add(uniqueKey);
            }
          }else if (invType == 4) {
            if (item.RecipientGSTIN && item.RevisedNoteNumber && item.RevisedNoteDateLabel ) {
              const uniqueKey = item.RecipientGSTIN + '|' + item.RevisedNoteNumber + '|' + item.RevisedNoteDateLabel ;
              uniqueInvoices.add(uniqueKey);
            }
          }
  
        });
  
        return uniqueInvoices.size;
      }

      const uniqueLength = getUniqueInvoiceLength(values);
      setTotalInvoice(uniqueLength);
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
          &nbsp; &nbsp;
          {purchaseData?.length ? (<span  >
            <b>  {` ${paginationUi}`}</b>
          </span>) : <></>}  &nbsp; &nbsp;
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
    if(gstr6aData.length > 0 ){
      setbtnDisable1(false)
    } 
    else{
      setbtnDisable1(true)
    }

  },[gstr6aData])

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
            {/* B2B  */}
            {activeTab == 1 && (
              <TabPane tabId="1" key="1">
                {console.log("b2b tab")}
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
                          <Col sm={4}>
                            <Label className="form-label">Invoice Type</Label>
                            <Select
                              id="purchaseId_invtype"
                              placeholder="Invoice Type"
                              theme={selectThemeColors}
                              components={animatedComponents}
                              classNamePrefix="select"
                              isDisabled={true}
                              value={{ label: "B2B", value: "b2b" }}
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
                <Card>
                  <CardBody className="CardBody p-0">
                    <Row>
                      <Col sm="12">
                        <div>
                          <HotTable
                            id="gstr6aFiledB2B"
                            ref={hotRef}
                            readOnly={true}
                            autoWrapRow={true}
                            rowHeights={RowSize}
                            columnHeaderHeight={columnHeaderSize}
                            viewportColumnRenderingOffset={100}
                            data={
                              gstr6aData?.length > 0
                                ? GSTR6AData
                                : [{ RecipientGSTIN: "No Data Found!" }]
                            }
                            mergeCells={
                              gstr6aData?.length > 0
                                ? false
                                : [{ row: 0, col: 0, rowspan: 1, colspan: 11 }]
                            }
                            // autoColumnSize={true}
                            autoColumnSize={{
                              samplingRatio: 23  // Adjust the samplingRatio as needed
                            }}
                            manualColumnResize={true}
                            afterGetColHeader={theader}
                            colHeaders={colHeaders}
                            stretchH="all"
                            preventOverflow="horizontal"
                            columns={b2bColumns}
                            contextMenu={false}
                            bindRowsWithHeaders={true}
                            licenseKey="non-commercial-and-evaluation"
                            height="auto"
                            afterOnCellMouseDown={localAfterOnCellMouseDown}
                            // hiddenColumns={{
                            //   columns: [0],
                            // }}
                            cells={function (row, col) {
                              var cp = {};

                              if (col !== null) {
                                cp.renderer = emptyRender;
                              }

                              if (col == 0 && !gstr6aData?.length > 0) {
                                cp.className = "text-center"
                              }

                              cp.className = "child";

                              if (gstr6aData?.length > 0) {
                                if (
                                  col == 3 ||
                                  col == 5 ||
                                  col == 7 ||
                                  col == 8 ||
                                  col == 9 ||
                                  col == 10 ||
                                  col == 11 ||
                                  col == 12
                                ) {
                                  cp.className = "text-end";
                                }
                              }
                              else {
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
                                    const selectedValue = this.getSelected()[0][1];
                                    const isValidColumn = [3, 4, 5, 6, 7, 8, 9, 10, 11].includes(selectedValue);

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
                                    const isHiddenCol = ![5, , 6].includes(selectedCol);

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

                                option4: createOptionMinMax(fromValue, toValue, 4),
                                option7: createOptionMinMax(fromTax, toTax, 7),
                                option8: createOptionMinMax(fromIgst, toIgst, 8),
                                option9: createOptionMinMax(fromCgst, toCgst, 9),
                                option10: createOptionMinMax(fromSgst, toSgst, 10),
                                option11: createOptionMinMax(fromCess, toCess, 11),

                                clear: {
                                  name: `<button id='btnClear' name='Clear'  tabIndex="-1"  value='Clear'>Clear</button>`,
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
                                        const hot = hotRef?.current?.hotInstance;
                                        const selectedValuecol = hot?.getSelected()[0][1];
                                        const minMaxColumn = [4, 7, 8, 9, 10, 11].includes(selectedValuecol);
                                        if (hot?.getSelected()[0][1] == 5 || hot?.getSelected()[0][1] == 6) {

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
                                          setGridCustomFilter(filterObject)
                                          let newFilterData = FilterData(filterObject);
                                          setgstr6aData([...newFilterData]);

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
                                        } else if (hot?.getSelected()[0][1] == 3) {

                                          var columnName = b2bColumns[currentCol1]?.data;
                                          var value = '';
                                          setSearchDate('');
                                          setToDate('');
                                          let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                                          filterObject.push({ [columnName]: value });
                                          setGridCustomFilter(filterObject)
                                          let newFilterData = FilterData(filterObject);
                                          setgstr6aData([...newFilterData]);
                                        } else if (minMaxColumn) {

                                          var columnName = b2bColumns[currentCol1]?.data;
                                          var value = '';

                                          hot?.getSelected()[0][1] == 4 && setFromValue('');
                                          hot?.getSelected()[0][1] == 4 && setToValue('');
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
                                          let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                                          filterObject.push({ [columnName]: value });
                                          setGridCustomFilter(filterObject)
                                          let newFilterData = FilterData(filterObject);
                                          setgstr6aData([...newFilterData]);

                                        } else {

                                          var value = '';
                                          var x = searchVal1;
                                          var columnName = b2bColumns[currentCol1]?.data;
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

                                          setGridCustomFilter(filterObject)
                                          let newFilterData = FilterData(filterObject);
                                          setgstr6aData([...newFilterData]);
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
                                rateDropDownList, posDropDownList
                              } = filterDropDownList;

                              const listsToCheck = [
                                rateDropDownList, posDropDownList
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
                            afterFilter={function (data) {
                              const hot = hotRef?.current?.hotInstance;
                              const selectedValuecol = hot?.getSelected()[0][1];
                              const minMaxColumn = [4, 7, 8, 9, 10, 11].includes(selectedValuecol);
                              if (hot?.getSelected()[0][1] == 5 || hot?.getSelected()[0][1] == 6) {

                                var checkboxes = document.getElementsByClassName('checkBoxClass');
                                arrChk = []
                                setFilterDropDownList([]);
                                var columnName = b2bColumns[currentCol1]?.data;
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
                                setgstr6aData([...newFilterData]);

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
                              } else if (hot?.getSelected()[0][1] == 3) {

                                var searchInput1 = document.getElementById("custom1");
                                var searchInput2 = document.getElementById("custom2");
                                const invFromDate = searchInput1?.value
                                const invToDate = searchInput2?.value
                                var columnName = b2bColumns[currentCol1]?.data;
                                var value = (searchInput1?.value || searchInput2?.value) && `${invFromDate ? invFromDate : invToDate}to${invToDate ? invToDate : invFromDate}`;
                                setSearchDate(searchInput1?.value);
                                setToDate(searchInput2?.value);
                                let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                                filterObject.push({ [columnName]: value });
                                setGridCustomFilter(filterObject)
                                let newFilterData = FilterData(filterObject);
                                setgstr6aData([...newFilterData]);
                              } else if (minMaxColumn) {

                                var searchInput1 = document.getElementById("amount1");
                                var searchInput2 = document.getElementById("amount2");
                                const invFromDate = searchInput1?.value
                                const invToDate = searchInput2?.value
                                var columnName = b2bColumns[currentCol1]?.data;
                                var value = `${invFromDate}to${invToDate}`;


                                hot?.getSelected()[0][1] == 4 && setFromValue(searchInput1?.value);
                                hot?.getSelected()[0][1] == 4 && setToValue(searchInput2?.value);
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
                                let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                                filterObject.push({ [columnName]: value });
                                setGridCustomFilter(filterObject)
                                let newFilterData = FilterData(filterObject);
                                setgstr6aData([...newFilterData]);

                              } else {

                                var searchInput = document.querySelector(
                                  ".htUIMultipleSelectSearch.htUIInput"
                                );
                                var value = searchInput?.children[0]?.value;
                                var x = searchVal1;
                                var columnName = b2bColumns[currentCol1]?.data;
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

                                setGridCustomFilter(filterObject)
                                let newFilterData = FilterData(filterObject);
                                setgstr6aData([...newFilterData]);
                              }


                              // const x = searchVal1;
                              // if (!searchVal1?.length) {
                              //   x.push(value);
                              //   let y = currentCol;
                              //   y.push(b2bColumns[currentCol1]?.data);
                              //   // console.log("jsx=",x,y)
                              //   setSearchVal1(x);
                              //   setCurrentCol(y);
                              // } else {
                              //   const Index = currentCol?.findIndex(
                              //     (item) =>
                              //       b2bColumns[currentCol1]?.data == item
                              //   );
                              //   if (Index != -1) {
                              //     const xyz = searchVal1;
                              //     xyz[Index] = value;
                              //     setSearchVal1(xyz);
                              //   } else {
                              //     x.push(value);
                              //     let y = currentCol;
                              //     y.push(b2bColumns[currentCol1]?.data);
                              //     // console.log("jsx=",x,y)
                              //     setSearchVal1(x);
                              //     setCurrentCol(y);
                              //   }
                              // }


                              // let newFilterData = FilterData(arrFilter);
                              // setgstr6aData([...newFilterData]);
                            }}
                          />
                          {customPagination()}
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
            )}

            {/* B2BA */}
            {activeTab == 2 && (
              <TabPane tabId="2" key="2">
                {console.log("B2BA tab")}
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
                            <Col sm={4}>
                              <Label className="form-label">Invoice Type</Label>
                              <Select
                                id="crdr_invtype"
                                placeholder="Invoice Type"
                                theme={selectThemeColors}
                                components={animatedComponents}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                isDisabled={true}
                                value={{ label: "B2BA", value: "b2ba" }}
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
                          <HotTable
                            autoWrapRow={true}
                            id="gstr6aFiledB2BA"
                            viewportColumnRenderingOffset={100}
                            data={
                              gstr6aData?.length > 0
                                ? GSTR6AData
                                : [{ OriginalInvoiceNumber: "No Data Found!" }]
                            }
                            mergeCells={
                              gstr6aData?.length > 0
                                ? false
                                : [{ row: 0, col: 0, rowspan: 1, colspan: 10 }]
                            }
                            autoColumnSize={{
                              samplingRatio: 23  // Adjust the samplingRatio as needed
                            }}
                            manualColumnResize={true}
                            rowHeights={RowSize}
                            columnHeaderHeight={columnHeaderSize}
                            afterGetColHeader={theaderITC}
                            afterOnCellMouseDown={localAfterOnCellMouseDown}
                            colHeaders={colHeaders}
                            stretchH="all"
                            preventOverflow="horizontal"
                            columns={b2bAColumns}
                            contextMenu={false}
                            bindRowsWithHeaders={true}
                            licenseKey="non-commercial-and-evaluation"
                            height="auto"
                            ref={hotRef1}
                            // hiddenColumns={{
                            //   columns: [0],
                            // }}
                            // mergeCells={false}
                            cells={function (row, col) {
                              var cp = {};

                              if (col !== null && gstr6aData?.length > 0) {
                                cp.renderer = emptyRender;
                              }
                              if (col == 0 && !gstr6aData?.length > 0) {
                                cp.className = "text-center"
                              }
                              cp.className = "child";
                              if (gstr6aData?.length > 0) {
                                if (
                                  col == 1 ||
                                  col == 5 ||
                                  col == 7 ||
                                  col == 9 ||
                                  col == 10 ||
                                  col == 11 ||
                                  col == 12 ||
                                  col == 13 ||
                                  col == 14 ||
                                  col == 15
                                ) {
                                  cp.className = "text-end";
                                }
                              }
                              else {
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
                                    const selectedValue = this.getSelected()[0][1];
                                    const isValidColumn = [1, 5, 6, 7, 8, 9, 10, 11, 12, 13].includes(selectedValue);

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
                                    const isHiddenCol = ![7, 8].includes(selectedCol);

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

                                option1: {

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
                                      this.getSelectedRangeLast().to.col != 1
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
                                option5: {

                                  name: `<div style=${checkboxFilterCss}> From Date <br><input type='date' data-date="" data-date-format="DD MMMM YYYY" min='2017-07-01' max=${new Date()
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
                                option9: createOptionMinMax(fromTax, toTax, 9),
                                option10: createOptionMinMax(fromIgst, toIgst, 10),
                                option11: createOptionMinMax(fromCgst, toCgst, 11),
                                option12: createOptionMinMax(fromSgst, toSgst, 12),
                                option13: createOptionMinMax(fromCess, toCess, 13),

                                clear: {
                                  name: `<button id='btnClear' name='Clear'  tabIndex="-1"   value='Clear'>Clear</button>`,
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
                                        const hot = hotRef1?.current?.hotInstance;
                                        const selectedValuecol = hot?.getSelected()[0][1];
                                        const minMaxColumn = [6, 9, 10, 11, 12, 13].includes(selectedValuecol);
                                        if (hot?.getSelected()[0][1] == 7 || hot?.getSelected()[0][1] == 8) {

                                          var checkboxes = document.getElementsByClassName('checkBoxClass');
                                          arrChk = []
                                          setFilterDropDownList([]);
                                          var columnName = b2bAColumns[currentCol1]?.data;
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
                                          setgstr6aData([...newFilterData]);

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
                                        } else if (hot?.getSelected()[0][1] == 1 || hot?.getSelected()[0][1] == 5) {

                                          var columnName = b2bAColumns[currentCol1]?.data;
                                          var value = '';
                                          hot?.getSelected()[0][1] == 1 && setSearchDate('');
                                          hot?.getSelected()[0][1] == 1 && setToDate('');
                                          hot?.getSelected()[0][1] == 5 && setSearchDate1('');
                                          hot?.getSelected()[0][1] == 5 && setToDate1('');
                                          let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                                          filterObject.push({ [columnName]: value });
                                          setGridCustomFilter(filterObject)
                                          let newFilterData = FilterData(filterObject);
                                          setgstr6aData([...newFilterData]);
                                        } else if (minMaxColumn) {

                                          var columnName = b2bAColumns[currentCol1]?.data;
                                          var value = '';

                                          hot?.getSelected()[0][1] == 6 && setFromValue('');
                                          hot?.getSelected()[0][1] == 6 && setToValue('');
                                          hot?.getSelected()[0][1] == 9 && setFromTax('');
                                          hot?.getSelected()[0][1] == 9 && setToTax('');
                                          hot?.getSelected()[0][1] == 10 && setFromIgst('');
                                          hot?.getSelected()[0][1] == 10 && setToIgst('');
                                          hot?.getSelected()[0][1] == 11 && setFromCgst('');
                                          hot?.getSelected()[0][1] == 11 && setToCgst('');
                                          hot?.getSelected()[0][1] == 12 && setFromSgst('');
                                          hot?.getSelected()[0][1] == 12 && setToSgst('');
                                          hot?.getSelected()[0][1] == 13 && setFromCess('');
                                          hot?.getSelected()[0][1] == 13 && setToCess('');
                                          let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                                          filterObject.push({ [columnName]: value });
                                          setGridCustomFilter(filterObject)
                                          let newFilterData = FilterData(filterObject);
                                          setgstr6aData([...newFilterData]);

                                        } else {

                                          var value = '';
                                          var x = searchVal1;
                                          var columnName = b2bAColumns[currentCol1]?.data;
                                          let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                                          filterObject.push({ [columnName]: value });

                                          if (!searchVal1?.length) {

                                            x.push(value);
                                            let y = currentCol;
                                            y.push(
                                              b2bAColumns[currentCol1]?.data
                                            );
                                            setSearchVal1(x);
                                            setCurrentCol(y);
                                          } else {

                                            const Index = currentCol?.findIndex(
                                              (item) =>
                                                b2bAColumns[currentCol1]?.data ==
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
                                                b2bAColumns[currentCol1]?.data
                                              );
                                              setSearchVal1(x);
                                              setCurrentCol(y);
                                            }
                                          }

                                          setGridCustomFilter(filterObject)
                                          let newFilterData = FilterData(filterObject);
                                          setgstr6aData([...newFilterData]);
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
                                rateDropDownList, posDropDownList
                              } = filterDropDownList;

                              const listsToCheck = [
                                rateDropDownList, posDropDownList
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
                            afterFilter={function (data) {
                              const hot = hotRef1?.current?.hotInstance;
                              const selectedValuecol = hot?.getSelected()[0][1];
                              const minMaxColumn = [6, 9, 10, 11, 12, 13].includes(selectedValuecol);
                              if (hot?.getSelected()[0][1] == 7 || hot?.getSelected()[0][1] == 8) {

                                var checkboxes = document.getElementsByClassName('checkBoxClass');
                                arrChk = []
                                setFilterDropDownList([]);
                                var columnName = b2bAColumns[currentCol1]?.data;
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
                                setgstr6aData([...newFilterData]);

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
                              } else if (hot?.getSelected()[0][1] == 1 || hot?.getSelected()[0][1] == 5) {

                                var searchInput1 = document.getElementById("custom1");
                                var searchInput2 = document.getElementById("custom2");
                                const invFromDate = searchInput1?.value
                                const invToDate = searchInput2?.value
                                var columnName = b2bAColumns[currentCol1]?.data;
                                var value = (searchInput1?.value || searchInput2?.value) && `${invFromDate ? invFromDate : invToDate}to${invToDate ? invToDate : invFromDate}`;
                                hot?.getSelected()[0][1] == 1 && setSearchDate(searchInput1?.value);
                                hot?.getSelected()[0][1] == 1 && setToDate(searchInput2?.value);
                                hot?.getSelected()[0][1] == 5 && setSearchDate1(searchInput1?.value);
                                hot?.getSelected()[0][1] == 5 && setToDate1(searchInput2?.value);
                                let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                                filterObject.push({ [columnName]: value });
                                setGridCustomFilter(filterObject)
                                let newFilterData = FilterData(filterObject);
                                setgstr6aData([...newFilterData]);
                              } else if (minMaxColumn) {

                                var searchInput1 = document.getElementById("amount1");
                                var searchInput2 = document.getElementById("amount2");
                                const invFromDate = searchInput1?.value
                                const invToDate = searchInput2?.value
                                var columnName = b2bAColumns[currentCol1]?.data;
                                var value = `${invFromDate}to${invToDate}`;

                                hot?.getSelected()[0][1] == 6 && setFromValue(searchInput1?.value);
                                hot?.getSelected()[0][1] == 6 && setToValue(searchInput2?.value);
                                hot?.getSelected()[0][1] == 9 && setFromTax(searchInput1?.value);
                                hot?.getSelected()[0][1] == 9 && setToTax(searchInput2?.value);
                                hot?.getSelected()[0][1] == 10 && setFromIgst(searchInput1?.value);
                                hot?.getSelected()[0][1] == 10 && setToIgst(searchInput2?.value);
                                hot?.getSelected()[0][1] == 11 && setFromCgst(searchInput1?.value);
                                hot?.getSelected()[0][1] == 11 && setToCgst(searchInput2?.value);
                                hot?.getSelected()[0][1] == 12 && setFromSgst(searchInput1?.value);
                                hot?.getSelected()[0][1] == 12 && setToSgst(searchInput2?.value);
                                hot?.getSelected()[0][1] == 13 && setFromCess(searchInput1?.value);
                                hot?.getSelected()[0][1] == 13 && setToCess(searchInput2?.value);
                                let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                                filterObject.push({ [columnName]: value });
                                setGridCustomFilter(filterObject)
                                let newFilterData = FilterData(filterObject);
                                setgstr6aData([...newFilterData]);

                              } else {

                                var searchInput = document.querySelector(
                                  ".htUIMultipleSelectSearch.htUIInput"
                                );
                                var value = searchInput?.children[0]?.value;
                                var x = searchVal1;
                                var columnName = b2bAColumns[currentCol1]?.data;
                                let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                                filterObject.push({ [columnName]: value });

                                if (!searchVal1?.length) {

                                  x.push(value);
                                  let y = currentCol;
                                  y.push(
                                    b2bAColumns[currentCol1]?.data
                                  );
                                  setSearchVal1(x);
                                  setCurrentCol(y);
                                } else {

                                  const Index = currentCol?.findIndex(
                                    (item) =>
                                      b2bAColumns[currentCol1]?.data ==
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
                                      b2bAColumns[currentCol1]?.data
                                    );
                                    setSearchVal1(x);
                                    setCurrentCol(y);
                                  }
                                }

                                setGridCustomFilter(filterObject)
                                let newFilterData = FilterData(filterObject);
                                setgstr6aData([...newFilterData]);
                              }

                            }}
                          />
                          {customPagination()}
                          {/* {purchaseData && (
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
                          )} */}
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </TabPane>
              </TabPane>
            )}

            {/* CDNR */}
            {activeTab == 3 && (
              <TabPane tabId="3" key="3">
                {console.log("CDNR tab")}
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
                          <Col sm={4}>
                            <Label className="form-label">Invoice Type</Label>
                            <Select
                              id="purchaseId_invtype"
                              placeholder="Invoice Type"
                              theme={selectThemeColors}
                              components={animatedComponents}
                              isDisabled={true}
                              value={{ label: "CDN", value: "cdn" }}
                              classNamePrefix="select"
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
                          <HotTable
                            autoWrapRow={true}
                            viewportColumnRenderingOffset={100}
                            id="gstr6aFiledCDNR"

                            data={
                              gstr6aData?.length > 0
                                ? GSTR6AData
                                : [{ RecipientGSTIN: "No Data Found!" }]
                            }
                            mergeCells={
                              gstr6aData?.length > 0
                                ? false
                                : [{ row: 0, col: 0, rowspan: 1, colspan: 9 }]
                            }

                            autoColumnSize={{
                              samplingRatio: 23  // Adjust the samplingRatio as needed
                            }}
                            manualColumnResize={true}
                            rowHeights={RowSize}
                            columnHeaderHeight={columnHeaderSize}
                            stretchH="all"
                            colHeaders={colHeaders}
                            afterGetColHeader={theaderCdn}
                            preventOverflow="horizontal"
                            columns={cdnColumns}
                            contextMenu={false}
                            bindRowsWithHeaders={true}
                            licenseKey="non-commercial-and-evaluation"
                            height="auto"
                            ref={hotRef2}
                            afterOnCellMouseDown={localAfterOnCellMouseDown}
                            cells={function (row, col) {
                              var cp = {};
                              if (col !== null && gstr6aData?.length > 0) {
                                cp.renderer = emptyRender;
                              }
                              if (col == 0 && !gstr6aData?.length > 0) {
                                cp.className = "text-center"
                              }
                              cp.className = "child";

                              if (gstr6aData?.length > 0) {
                                if (
                                  col == 4 ||
                                  col == 6 ||
                                  col == 9 ||
                                  col == 10 ||
                                  col == 11 ||
                                  col == 12 ||
                                  col == 13 ||
                                  col == 14 ||
                                  col == 18
                                ) {
                                  cp.className = "text-end";
                                }
                              }
                              else {
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
                                    const selectedValue = this.getSelected()[0][1];
                                    const isValidColumn = [2, 4, 6, 7, 8, 9, 10, 11, 12, 13].includes(selectedValue);

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
                                    const isHiddenCol = ![2, 7, 8].includes(selectedCol);

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
                                option6: {

                                  name: `<div style=${checkboxFilterCss}> From Date <br><input type='date' data-date="" data-date-format="DD MMMM YYYY" min='2017-07-01' max=${new Date()
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
                                    return (
                                      this.getSelectedRangeLast().to.col != 6
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

                                option9: createOptionMinMax(fromTax, toTax, 9),
                                option10: createOptionMinMax(fromIgst, toIgst, 10),
                                option11: createOptionMinMax(fromCgst, toCgst, 11),
                                option12: createOptionMinMax(fromSgst, toSgst, 12),
                                option13: createOptionMinMax(fromCess, toCess, 13),

                                clear: {
                                  name: `<button id='btnClear' name='Clear'  tabIndex="-1"   value='Clear'>Clear</button>`,
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
                                        const hot = hotRef2?.current?.hotInstance;
                                        const selectedValuecol = hot?.getSelected()[0][1];
                                        const minMaxColumn = [9, 10, 11, 12, 13].includes(selectedValuecol);
                                        if (hot?.getSelected()[0][1] == 2 || hot?.getSelected()[0][1] == 7 || hot?.getSelected()[0][1] == 8) {

                                          var checkboxes = document.getElementsByClassName('checkBoxClass');
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
                                          setGridCustomFilter(filterObject)
                                          let newFilterData = FilterData(filterObject);
                                          setgstr6aData([...newFilterData]);

                                          const updatedFilterDropDownList = filterObject.reduce((acc, item) => {
                                            const { Rate, PlaceOfSupply, NoteType } = item;

                                            const updateList = (list, value) => {
                                              return list.includes(value) ? list : [...list, value];
                                            };

                                            if (Rate !== undefined) {
                                              acc.rateDropDownList = updateList(acc.rateDropDownList, Rate);
                                            } else if (PlaceOfSupply !== undefined) {
                                              acc.posDropDownList = updateList(acc.posDropDownList, PlaceOfSupply);
                                            } else if (NoteType !== undefined) {
                                              acc.noteTypeDropDownList = updateList(acc.noteTypeDropDownList, NoteType);
                                            }

                                            return acc;
                                          }, { rateDropDownList: [], posDropDownList: [], noteTypeDropDownList: [] });

                                          setFilterDropDownList(updatedFilterDropDownList);
                                        } else if (hot?.getSelected()[0][1] == 4 || hot?.getSelected()[0][1] == 6) {

                                          var columnName = cdnColumns[currentCol1]?.data;
                                          var value = '';
                                          hot?.getSelected()[0][1] == 4 && setSearchDate('');
                                          hot?.getSelected()[0][1] == 4 && setToDate('');
                                          hot?.getSelected()[0][1] == 6 && setSearchDate1('');
                                          hot?.getSelected()[0][1] == 6 && setToDate1('');
                                          let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                                          filterObject.push({ [columnName]: value });
                                          setGridCustomFilter(filterObject)
                                          let newFilterData = FilterData(filterObject);
                                          setgstr6aData([...newFilterData]);
                                        } else if (minMaxColumn) {

                                          var columnName = cdnColumns[currentCol1]?.data;
                                          var value = '';


                                          hot?.getSelected()[0][1] == 9 && setFromTax('');
                                          hot?.getSelected()[0][1] == 9 && setToTax('');
                                          hot?.getSelected()[0][1] == 10 && setFromIgst('');
                                          hot?.getSelected()[0][1] == 10 && setToIgst('');
                                          hot?.getSelected()[0][1] == 11 && setFromCgst('');
                                          hot?.getSelected()[0][1] == 11 && setToCgst('');
                                          hot?.getSelected()[0][1] == 12 && setFromSgst('');
                                          hot?.getSelected()[0][1] == 12 && setToSgst('');
                                          hot?.getSelected()[0][1] == 13 && setFromCess('');
                                          hot?.getSelected()[0][1] == 13 && setToCess('');
                                          let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                                          filterObject.push({ [columnName]: value });
                                          setGridCustomFilter(filterObject)
                                          let newFilterData = FilterData(filterObject);
                                          setgstr6aData([...newFilterData]);

                                        } else {

                                          var value = '';
                                          var x = searchVal1;
                                          var columnName = cdnColumns[currentCol1]?.data;
                                          let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                                          filterObject.push({ [columnName]: value });

                                          if (!searchVal1?.length) {

                                            x.push(value);
                                            let y = currentCol;
                                            y.push(
                                              cdnColumns[currentCol1]?.data
                                            );
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

                                          setGridCustomFilter(filterObject)
                                          let newFilterData = FilterData(filterObject);
                                          setgstr6aData([...newFilterData]);
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
                                rateDropDownList, posDropDownList, noteTypeDropDownList
                              } = filterDropDownList;

                              const listsToCheck = [
                                rateDropDownList, posDropDownList, noteTypeDropDownList
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
                            }}
                            afterFilter={function (data) {
                              const hot = hotRef2?.current?.hotInstance;
                              const selectedValuecol = hot?.getSelected()[0][1];
                              const minMaxColumn = [9, 10, 11, 12, 13].includes(selectedValuecol);
                              if (hot?.getSelected()[0][1] == 2 || hot?.getSelected()[0][1] == 7 || hot?.getSelected()[0][1] == 8) {

                                var checkboxes = document.getElementsByClassName('checkBoxClass');
                                arrChk = []
                                setFilterDropDownList([]);
                                var columnName = cdnColumns[currentCol1]?.data;
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
                                setgstr6aData([...newFilterData]);

                                const updatedFilterDropDownList = filterObject.reduce((acc, item) => {
                                  const { Rate, PlaceOfSupply, NoteType } = item;

                                  const updateList = (list, value) => {
                                    return list.includes(value) ? list : [...list, value];
                                  };

                                  if (Rate !== undefined) {
                                    acc.rateDropDownList = updateList(acc.rateDropDownList, Rate);
                                  } else if (PlaceOfSupply !== undefined) {
                                    acc.posDropDownList = updateList(acc.posDropDownList, PlaceOfSupply);
                                  } else if (NoteType !== undefined) {
                                    acc.noteTypeDropDownList = updateList(acc.noteTypeDropDownList, NoteType);
                                  }

                                  return acc;
                                }, { rateDropDownList: [], posDropDownList: [], noteTypeDropDownList: [] });

                                setFilterDropDownList(updatedFilterDropDownList);
                              } else if (hot?.getSelected()[0][1] == 4 || hot?.getSelected()[0][1] == 6) {

                                var searchInput1 = document.getElementById("custom1");
                                var searchInput2 = document.getElementById("custom2");
                                const invFromDate = searchInput1?.value
                                const invToDate = searchInput2?.value
                                var columnName = cdnColumns[currentCol1]?.data;
                                var value = (searchInput1?.value || searchInput2?.value) && `${invFromDate ? invFromDate : invToDate}to${invToDate ? invToDate : invFromDate}`;
                                hot?.getSelected()[0][1] == 4 && setSearchDate(searchInput1?.value);
                                hot?.getSelected()[0][1] == 4 && setToDate(searchInput2?.value);
                                hot?.getSelected()[0][1] == 6 && setSearchDate1(searchInput1?.value);
                                hot?.getSelected()[0][1] == 6 && setToDate1(searchInput2?.value);
                                let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                                filterObject.push({ [columnName]: value });
                                setGridCustomFilter(filterObject)
                                let newFilterData = FilterData(filterObject);
                                setgstr6aData([...newFilterData]);
                              } else if (minMaxColumn) {

                                var searchInput1 = document.getElementById("amount1");
                                var searchInput2 = document.getElementById("amount2");
                                const invFromDate = searchInput1?.value
                                const invToDate = searchInput2?.value
                                var columnName = cdnColumns[currentCol1]?.data;
                                var value = `${invFromDate}to${invToDate}`;

                                hot?.getSelected()[0][1] == 9 && setFromTax(searchInput1?.value);
                                hot?.getSelected()[0][1] == 9 && setToTax(searchInput2?.value);
                                hot?.getSelected()[0][1] == 10 && setFromIgst(searchInput1?.value);
                                hot?.getSelected()[0][1] == 10 && setToIgst(searchInput2?.value);
                                hot?.getSelected()[0][1] == 11 && setFromCgst(searchInput1?.value);
                                hot?.getSelected()[0][1] == 11 && setToCgst(searchInput2?.value);
                                hot?.getSelected()[0][1] == 12 && setFromSgst(searchInput1?.value);
                                hot?.getSelected()[0][1] == 12 && setToSgst(searchInput2?.value);
                                hot?.getSelected()[0][1] == 13 && setFromCess(searchInput1?.value);
                                hot?.getSelected()[0][1] == 13 && setToCess(searchInput2?.value);
                                let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                                filterObject.push({ [columnName]: value });
                                setGridCustomFilter(filterObject)
                                let newFilterData = FilterData(filterObject);
                                setgstr6aData([...newFilterData]);

                              } else {

                                var searchInput = document.querySelector(
                                  ".htUIMultipleSelectSearch.htUIInput"
                                );
                                var value = searchInput?.children[0]?.value;
                                var x = searchVal1;
                                var columnName = cdnColumns[currentCol1]?.data;
                                let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                                filterObject.push({ [columnName]: value });

                                if (!searchVal1?.length) {

                                  x.push(value);
                                  let y = currentCol;
                                  y.push(
                                    cdnColumns[currentCol1]?.data
                                  );
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

                                setGridCustomFilter(filterObject)
                                let newFilterData = FilterData(filterObject);
                                setgstr6aData([...newFilterData]);
                              }

                            }}
                          />
                          {customPagination()}
                          {/* {purchaseData && (
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
                          )} */}
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </TabPane>
            )}

            {/* CDNAR */}
            {activeTab == 4 && (
              <TabPane tabId="4" key="4">
                {console.log("CDNAR tab")}
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
                          <Col sm={4}>
                            <Label className="form-label">Invoice Type</Label>
                            <Select
                              id="purchaseId_invtype"
                              placeholder="Invoice Type"
                              theme={selectThemeColors}
                              components={animatedComponents}
                              value={{ label: "CDNA", value: "cdna" }}
                              classNamePrefix="select"
                              isDisabled={true}
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
                          <HotTable
                            autoWrapRow={true}
                            id="gstr6aFiledCDNRA"
                            viewportColumnRenderingOffset={100}
                            // style={
                            //   gstr6aData?.length == 0
                            //     ? { textAlign: "center", overflowX: "hidden" }
                            //     : null
                            // }
                            data={
                              gstr6aData?.length > 0
                                ? GSTR6AData
                                : [{ OriginalNoteNumber: "No Data Found!" }]
                            }
                            mergeCells={
                              gstr6aData?.length > 0
                                ? false
                                : [{ row: 0, col: 0, rowspan: 1, colspan: 10 }]
                            }
                            // autoColumnSize={true}
                            autoColumnSize={{
                              samplingRatio: 23  // Adjust the samplingRatio as needed
                            }}
                            manualColumnResize={true}
                            colHeaders={colHeaders}
                            afterGetColHeader={theaderCdna}
                            rowHeights={RowSize}
                            columnHeaderHeight={columnHeaderSize}
                            stretchH="all"
                            preventOverflow="horizontal"
                            columns={cdnaColumns}
                            contextMenu={false}
                            bindRowsWithHeaders={true}
                            licenseKey="non-commercial-and-evaluation"
                            height="auto"
                            ref={hotRef3}
                            afterOnCellMouseDown={localAfterOnCellMouseDown}
                            // mergeCells={false}
                            // hiddenColumns={{
                            //   columns: [8],
                            // }}
                            cells={function (row, col) {
                              var cp = {};
                              cp.className = "child";

                              if (col !== null && gstr6aData?.length > 0) {
                                cp.renderer = emptyRender;
                              }

                              if (gstr6aData?.length > 0) {
                                if (
                                  col == 0 ||
                                  col == 5 ||
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
                              }
                              else {
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
                                    const selectedValue = this.getSelected()[0][1];
                                    const isValidColumn = [1, 4, 6, 8, 9, 10, 11, 12, 13, 14].includes(selectedValue);

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
                                    const isHiddenCol = ![4, 8, 9].includes(selectedCol);

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

                                option1: {

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
                                      this.getSelectedRangeLast().to.col != 1
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
                                option6: {

                                  name: `<div style=${checkboxFilterCss}> From Date <br><input type='date' data-date="" data-date-format="DD MMMM YYYY" min='2017-07-01' max=${new Date()
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
                                    return (
                                      this.getSelectedRangeLast().to.col != 6
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

                                option10: createOptionMinMax(fromTax, toTax, 10),
                                option11: createOptionMinMax(fromIgst, toIgst, 11),
                                option12: createOptionMinMax(fromCgst, toCgst, 12),
                                option13: createOptionMinMax(fromSgst, toSgst, 13),
                                option14: createOptionMinMax(fromCess, toCess, 14),

                                clear: {
                                  name: `<button id='btnClear' name='Clear'  tabIndex="-1"   value='Clear'>Clear</button>`,
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
                                        const hot = hotRef3?.current?.hotInstance;
                                        const selectedValuecol = hot?.getSelected()[0][1];
                                        const minMaxColumn = [10, 11, 12, 13].includes(selectedValuecol);
                                        if (hot?.getSelected()[0][1] == 4 || hot?.getSelected()[0][1] == 8 || hot?.getSelected()[0][1] == 9) {

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
                                          setGridCustomFilter(filterObject)
                                          let newFilterData = FilterData(filterObject);
                                          setgstr6aData([...newFilterData]);

                                          const updatedFilterDropDownList = filterObject.reduce((acc, item) => {
                                            const { Rate, PlaceOfSupply, NoteType } = item;

                                            const updateList = (list, value) => {
                                              return list.includes(value) ? list : [...list, value];
                                            };

                                            if (Rate !== undefined) {
                                              acc.rateDropDownList = updateList(acc.rateDropDownList, Rate);
                                            } else if (PlaceOfSupply !== undefined) {
                                              acc.posDropDownList = updateList(acc.posDropDownList, PlaceOfSupply);
                                            } else if (NoteType !== undefined) {
                                              acc.noteTypeDropDownList = updateList(acc.noteTypeDropDownList, NoteType);
                                            }

                                            return acc;
                                          }, { rateDropDownList: [], posDropDownList: [], noteTypeDropDownList: [] });

                                          setFilterDropDownList(updatedFilterDropDownList);
                                        } else if (hot?.getSelected()[0][1] == 1 || hot?.getSelected()[0][1] == 6) {

                                          var columnName = cdnaColumns[currentCol1]?.data;
                                          var value = '';
                                          hot?.getSelected()[0][1] == 1 && setSearchDate('');
                                          hot?.getSelected()[0][1] == 1 && setToDate('');
                                          hot?.getSelected()[0][1] == 6 && setSearchDate1('');
                                          hot?.getSelected()[0][1] == 6 && setToDate1('');
                                          let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                                          filterObject.push({ [columnName]: value });
                                          setGridCustomFilter(filterObject)
                                          let newFilterData = FilterData(filterObject);
                                          setgstr6aData([...newFilterData]);
                                        } else if (minMaxColumn) {


                                          var columnName = cdnaColumns[currentCol1]?.data;
                                          var value = '';

                                          hot?.getSelected()[0][1] == 10 && setFromTax('');
                                          hot?.getSelected()[0][1] == 10 && setToTax('');
                                          hot?.getSelected()[0][1] == 11 && setFromIgst('');
                                          hot?.getSelected()[0][1] == 11 && setToIgst('');
                                          hot?.getSelected()[0][1] == 12 && setFromCgst('');
                                          hot?.getSelected()[0][1] == 12 && setToCgst('');
                                          hot?.getSelected()[0][1] == 13 && setFromSgst('');
                                          hot?.getSelected()[0][1] == 13 && setToSgst('');
                                          hot?.getSelected()[0][1] == 13 && setToCess('');
                                          hot?.getSelected()[0][1] == 14 && setFromCess('');
                                          let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                                          filterObject.push({ [columnName]: value });
                                          setGridCustomFilter(filterObject)
                                          let newFilterData = FilterData(filterObject);
                                          setgstr6aData([...newFilterData]);

                                        } else {

                                          var value = '';
                                          var x = searchVal1;
                                          var columnName = cdnaColumns[currentCol1]?.data;
                                          let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                                          filterObject.push({ [columnName]: value });

                                          if (!searchVal1?.length) {

                                            x.push(value);
                                            let y = currentCol;
                                            y.push(
                                              cdnaColumns[currentCol1]?.data
                                            );
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

                                          setGridCustomFilter(filterObject)
                                          let newFilterData = FilterData(filterObject);
                                          setgstr6aData([...newFilterData]);
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
                                rateDropDownList, posDropDownList, noteTypeDropDownList
                              } = filterDropDownList;

                              const listsToCheck = [
                                rateDropDownList, posDropDownList, noteTypeDropDownList
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
                            }}
                            afterFilter={function (data) {
                              const hot = hotRef3?.current?.hotInstance;
                              const selectedValuecol = hot?.getSelected()[0][1];
                              const minMaxColumn = [10, 11, 12, 13].includes(selectedValuecol);
                              if (hot?.getSelected()[0][1] == 4 || hot?.getSelected()[0][1] == 8 || hot?.getSelected()[0][1] == 9) {

                                var checkboxes = document.getElementsByClassName('checkBoxClass');
                                arrChk = []
                                setFilterDropDownList([]);
                                var columnName = cdnaColumns[currentCol1]?.data;
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
                                setgstr6aData([...newFilterData]);

                                const updatedFilterDropDownList = filterObject.reduce((acc, item) => {
                                  const { Rate, PlaceOfSupply, NoteType } = item;

                                  const updateList = (list, value) => {
                                    return list.includes(value) ? list : [...list, value];
                                  };

                                  if (Rate !== undefined) {
                                    acc.rateDropDownList = updateList(acc.rateDropDownList, Rate);
                                  } else if (PlaceOfSupply !== undefined) {
                                    acc.posDropDownList = updateList(acc.posDropDownList, PlaceOfSupply);
                                  } else if (NoteType !== undefined) {
                                    acc.noteTypeDropDownList = updateList(acc.noteTypeDropDownList, NoteType);
                                  }

                                  return acc;
                                }, { rateDropDownList: [], posDropDownList: [], noteTypeDropDownList: [] });

                                setFilterDropDownList(updatedFilterDropDownList);
                              } else if (hot?.getSelected()[0][1] == 1 || hot?.getSelected()[0][1] == 6) {

                                var searchInput1 = document.getElementById("custom1");
                                var searchInput2 = document.getElementById("custom2");
                                const invFromDate = searchInput1?.value
                                const invToDate = searchInput2?.value
                                var columnName = cdnaColumns[currentCol1]?.data;
                                var value = (searchInput1?.value || searchInput2?.value) && `${invFromDate ? invFromDate : invToDate}to${invToDate ? invToDate : invFromDate}`;
                                hot?.getSelected()[0][1] == 1 && setSearchDate(searchInput1?.value);
                                hot?.getSelected()[0][1] == 1 && setToDate(searchInput2?.value);
                                hot?.getSelected()[0][1] == 6 && setSearchDate1(searchInput1?.value);
                                hot?.getSelected()[0][1] == 6 && setToDate1(searchInput2?.value);
                                let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                                filterObject.push({ [columnName]: value });
                                setGridCustomFilter(filterObject)
                                let newFilterData = FilterData(filterObject);
                                setgstr6aData([...newFilterData]);
                              } else if (minMaxColumn) {

                                var searchInput1 = document.getElementById("amount1");
                                var searchInput2 = document.getElementById("amount2");
                                const invFromDate = searchInput1?.value
                                const invToDate = searchInput2?.value
                                var columnName = cdnaColumns[currentCol1]?.data;
                                var value = `${invFromDate}to${invToDate}`;

                                hot?.getSelected()[0][1] == 10 && setFromTax(searchInput1?.value);
                                hot?.getSelected()[0][1] == 10 && setToTax(searchInput2?.value);
                                hot?.getSelected()[0][1] == 11 && setFromIgst(searchInput1?.value);
                                hot?.getSelected()[0][1] == 11 && setToIgst(searchInput2?.value);
                                hot?.getSelected()[0][1] == 12 && setFromCgst(searchInput1?.value);
                                hot?.getSelected()[0][1] == 12 && setToCgst(searchInput2?.value);
                                hot?.getSelected()[0][1] == 13 && setFromSgst(searchInput1?.value);
                                hot?.getSelected()[0][1] == 13 && setToSgst(searchInput2?.value);
                                hot?.getSelected()[0][1] == 13 && setToCess(searchInput2?.value);
                                hot?.getSelected()[0][1] == 14 && setFromCess(searchInput1?.value);
                                let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                                filterObject.push({ [columnName]: value });
                                setGridCustomFilter(filterObject)
                                let newFilterData = FilterData(filterObject);
                                setgstr6aData([...newFilterData]);

                              } else {

                                var searchInput = document.querySelector(
                                  ".htUIMultipleSelectSearch.htUIInput"
                                );
                                var value = searchInput?.children[0]?.value;
                                var x = searchVal1;
                                var columnName = cdnaColumns[currentCol1]?.data;
                                let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                                filterObject.push({ [columnName]: value });

                                if (!searchVal1?.length) {

                                  x.push(value);
                                  let y = currentCol;
                                  y.push(
                                    cdnaColumns[currentCol1]?.data
                                  );
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

                                setGridCustomFilter(filterObject)
                                let newFilterData = FilterData(filterObject);
                                setgstr6aData([...newFilterData]);
                              }

                            }}
                          />

                          {customPagination()}
                          {/* {purchaseData && (
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
                          )} */}
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </TabPane>
            )}
          </TabContent>
        </Col>
      </Row>
    </div>
  );
};

function formatINR(x) {
  return x.toLocaleString("en-IN", { minimumFractionDigits: 2 });
}
function formatTotalWithoutDecimal(x) {
  return x.toLocaleString("en-IN");
}

export default IffFiledInvoices;
