import { useState, useRef, useEffect } from "react";
import { HotTable } from "@handsontable/react";
import { textRenderer } from "handsontable/renderers";
import { registerAllModules } from "handsontable/registry";
import errorCodeConfig from "../../../configs/apiErrorCodeConfig";
import Select from "react-select"; // eslint-disable-line
import makeAnimated from "react-select/animated";
import { selectThemeColors } from "@utils";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import Breadcrumbs from "@components/breadcrumbs";
import Swal from "sweetalert2";
import { useHotkeys } from "react-hotkeys-hook";
import { keysMap, enableOnFormTags, PageSize } from "../../../configs/config";

// ** Spinner (Splash Screen)
import {
  LINK_MESSAGE,
  RowSize,
  columnHeaderSize,
  checkBoxTitle
} from "../../../configs/config";
import { tokenExpiresRedirect } from "../../../utility/Utils";
import { GSTR2AMockData, mockSectionList } from "./mockData";
import moment from "moment";

import { urlEndpointConfig } from '@configs/urlEndpoint';
import $ from 'jquery'


registerAllModules();

// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  Label,
  Button,
  UncontrolledTooltip,
  CardBody,
} from "reactstrap";

import ReactPaginate from "react-paginate";
// ** Session get and set
import { globleVariable } from "../../../configs/globalVariable";
import LocalFunction from "../../../configs/getLocalFunction";
import SessionFunction from "../../../configs/getSessionFunction";
import { downloadURL } from "../../../helper/downloadUrl";
import { useDispatch, useSelector } from "react-redux";
import { getGSTR4ASummary } from "../gstr4A/store";
import purchaseInvoiceService2A from "../../../services/Reco/Purchase2A/purchaseInvoiceService2A";
import gstr4AServices from "../../../services/gstr4AServices/gstr4AServices";
import { ChevronLeft } from "react-feather";

const animatedComponents = makeAnimated();

const finYearOption = LocalFunction.getLocalValue(
  globleVariable.rangeFilters,
  true
);
const YearList = JSON.parse(finYearOption);

const InvoicesGSTR4A = () => {
  const dispatch = useDispatch();

  const store = useSelector(
    (state) => state?.gstr4ASummary?.GSTR4ASummary[0]?.Data
  );
  console.log(store, "2asectiondata");
  let arrFilter = [];
  const clientIds =
    sessionStorage.getItem(globleVariable.G_UCParId) &&
    SessionFunction.getSessionValue(globleVariable.G_UCParId, true);
  const GGSTIN =
    sessionStorage.getItem(globleVariable.G_GSTIN) &&
    SessionFunction.getSessionValue(globleVariable.G_GSTIN, true);
  const subId =
    localStorage.getItem(globleVariable.subscriptionId) &&
    LocalFunction.getLocalValue(globleVariable.subscriptionId, true);
  const userId =
    localStorage.getItem(globleVariable.userId) &&
    LocalFunction.getLocalValue(globleVariable.userId, true);
  // const G_UCParId=SessionFunction.getSessionValue(globleVariable.G_UCParId, true)
  const G_FY = SessionFunction.getSessionValue(globleVariable.G_FY, true);
  const G_FM = SessionFunction.getSessionValue(globleVariable.G_FM, true);

  const navigate = useNavigate();

  const [block, setBlock] = useState(false);
  const [data, setData] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(PageSize);
  const [currentCol, setCurrentCol] = useState([]);
  const [currentCol1, setCurrentCol1] = useState();
  const [searchVal1, setSearchVal1] = useState([]);

  const [finFromYear, setFinFormYear] = useState(null);
  const [panData, setPanData] = useState([]);
  const [monthFrom, setMonthFrom] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [displayType, setDisplayType] = useState(false);
  const [searchApi, setSearchApi] = useState(false);
  const [serverSidePage, setServerSidePage] = useState(false);

  const [itcEligibility, setItcEligibility] = useState([]);
  const [reverseCharge, setReverseCharge] = useState([]);
  const [sectionList, setSectionList] = useState([]);
  const [itcType, setItcType] = useState(null);
  const [reverseType, setReverseType] = useState(null);
  const [sectionType, setSectionType] = useState(null);
  const [panDataFrom, setPanDataFrom] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  const [totalCGST, setTotalCGST] = useState(0);
  const [hsn, setHsn] = useState(0);
  const [hsnValue, setHsnValue] = useState(0);
  const [totalCess, setTotalCess] = useState(0);
  const [totalIGST, setTotalIGST] = useState(0);
  const [totalInvoice, setTotalInvoice] = useState(0);
  const [totalInvoiceValue, setTotalInvoiceValue] = useState(0);
  const [totalSGST, setTotalSGST] = useState(0);
  const [totalTaxableValue, setTotalTaxableValue] = useState(0);

  const [searchDate, setSearchDate] = useState("");
  const [mockLiveData, setMockLiveData] = useState("mock");
  const [toDate, setToDate] = useState("");

  const [rateList, setRateList] = useState([]);
  const [noteTypeList, setNoteTypeList] = useState([]);
  const [pos, setPos] = useState([]);
  const [invoiceType, setInvoiceType] = useState([]);


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

  const [IGST, setIGST] = useState();
  const [Cess, setCess] = useState();
  const [CGST, setCGST] = useState();
  const [SGST, setSGST] = useState();

  let decrptyUrl = null;
  let clientId = null;
  let rowIndex = null;
  let sectionIds = null;
  let subScriptionDetails = null;
  let gstNumber = null;

  const GSTR2BFrdt = sessionStorage.getItem(globleVariable.selectExportFromDt) && SessionFunction.getSessionValue(globleVariable.selectExportFromDt);
  let arrChk = []

  const [gridCustomFilter, setGridCustomFilter] = useState([]);

  const [filterDropDownList, setFilterDropDownList] = useState({
    rateDropDownList: [],
    rcmDropDownList: [],
    noteTypeDropDownList: [],
    invoiceTypeDropDownList: [],
    posDropDownList: [],
    itcDropDownList: []
  })



  let itcFlag = 0;
  let finYear = null;
  let finMonth = null;
  let section = null;

  let G_UCParId = null;

  const { search } = useLocation();
  const [searchParams] = new URLSearchParams(search);
  const location = useLocation();

  console.log("locations-", location);

  if (location.state !== null) {
    finYear = location.state.finyear !== null ? location.state.finyear : "";
    finMonth = location.state.finmonth !== null ? location.state.finmonth : "";
    section = location.state.sectionId !== null ? location.state.sectionId : "";
    G_UCParId =
      location.state.isclientId !== null ? location.state.isclientId : "";
  }

  console.log(location?.state, "location?.state");
  useEffect(() => {
    if (store == undefined) {
      const userData = {
        clientid: clientIds,
        finyear: finYear,
        finmonth: finMonth,
        subscriptionId: subId,
        gstNumber: GGSTIN,
      };

      setBlock(true);
      dispatch(getGSTR4ASummary(userData));
    }
  }, []);

  let { id } = useParams();

  //** Shortcut keys
  useHotkeys(
    keysMap.CLEAR_DATA,
    () => {
      block == false && ClearFilter();
    },
    { enableOnFormTags }
  );
  useHotkeys(
    keysMap.EXPORT_DATA,
    () => {
      block == false && ExportSectionWiseData();
    },
    { enableOnFormTags }
  );

  useEffect(() => {
    setPanData(YearList);
  }, []);

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

  useEffect(() => {
    setCurrentCol([]);
    setCurrentCol1();
    setSearchVal1([]);
  }, []);

  const purchaseData = data;

  //** Pagination Onclick
  const handlePageClick = (event) => {
    // serverSidePage = true
    setCurrentPage(event?.selected);
    setServerSidePage(true);
  };

  const hotRef = useRef(null);
  const hotRef2 = useRef(null);

  const hot = hotRef?.current?.hotInstance;
  const filtersPlugin = hot?.getPlugin("filters");

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

  useEffect(() => {
    setPanData(YearList);
    setPanDataFrom(YearList);
    setDisplayType(true);
  }, []);

  useEffect(() => {
    setCurrentCol([]);
    setCurrentCol1();
    setSearchVal1([]);
  }, []);

  useEffect(() => {
    if (displayType == true) {
      console.log("selectExportToDt,", location.state, panData);
      console.log(panData?.filter((item) => item.value == finYear)[0]);

      console.log(panData?.filter((item) => item.value == finMonth)[0]);

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
  }, [displayType]);

  // ** Get data on mount
  useEffect(() => {
    console.log("re-render", section, location.state);
    if (searchApi == true) {
      // debugger
      gstr2AServices(
        finFromYear?.value,
        monthFrom?.value,
        section,
        "",
        "",
        "",
        "asc",
        ""
      );

      gstr4aSummaryData(null, section);
    } else {
      console.log("location data", location.state);
    }
  }, [searchApi, store]);

  ``;
  // calcution function
  const calcutions = (values) => {
    let tValue = 0;
    let sgst = 0;
    let cgst = 0;
    let cess = 0;
    let igst = 0;
    let count = 0;
    // setSearchApi(false)

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

    setTotalInvoice(values.length);
    setTotalIGST(igst);
    setTotalCess(cess);
    setTotalCGST(cgst);
    setTotalSGST(sgst);

    setTotalInvoiceValue(count); // Invoice Value Set
    setTotalTaxableValue(tValue);
  };

  const stateDataFilter = (sectionIndex) => {
    let filterData = [];

    if (store !== undefined) {
      if (sectionIndex == 1) {
        filterData =
          store?.B2B !== null &&
            store?.B2B !== "" &&
            store?.B2B?.length !== 0 &&
            store?.B2B !== undefined
            ? store?.B2B
            : [];
      } else if (sectionIndex == 2) {
        filterData =
          store?.B2BA !== null &&
            store?.B2BA !== "" &&
            store?.B2BA !== undefined &&
            store?.B2BA.length !== 0
            ? store?.B2BA
            : [];
      } else if (sectionIndex == 3) {
        filterData =
          store?.CDNR !== null &&
            store?.CDNR !== "" &&
            store?.CDNR !== undefined &&
            store?.CDNR.length !== 0
            ? store?.CDNR
            : [];
      } else if (sectionIndex == 4) {
        filterData =
          store?.CDNRA !== null &&
            store?.CDNRA !== "" &&
            store?.CDNRA !== undefined &&
            store?.CDNRA.length !== 0
            ? store?.CDNRA
            : [];
      }
      else {
        filterData = [];
      }
    } else {
    }

    return filterData;
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

  // **  Filter data
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

    console.log(mapArrRate, 'partFilter1', stateDataFilter("multiple"))

    updatedData = stateDataFilter(sectionType?.value)
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

          if (!isNaN(fromValue) && !isNaN(toValue) && !isNaN(invoiceValue)) {
            return invoiceValue >= fromValue && invoiceValue <= toValue;
          }
        }
        return true;
      })

      // .filter((itemInvoiceValue) =>
      //   finalObj.InvoiceValue?.length
      //     ? itemInvoiceValue?.InvoiceValue?.toString().includes(
      //       Number(finalObj?.InvoiceValue.toString())
      //     )
      //     : itemInvoiceValue
      // )
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

          if (!isNaN(fromValue) && !isNaN(toValue) && !isNaN(invoiceValue)) {
            return invoiceValue >= fromValue && invoiceValue <= toValue;
          }
        }
        return true;
      })

      // .filter((itemTaxableValue) =>
      //   finalObj.TaxableValue?.length
      //     ? itemTaxableValue?.TaxableValue?.toString().includes(
      //       Number(finalObj?.TaxableValue?.toString())
      //     )
      //     : itemTaxableValue
      // )

      .filter((itemIGST) => {
        if (finalObj?.IGST?.length) {
          const [a, b] = finalObj?.IGST?.split("to");
          const fromValue = parseFloat(a.trim());
          const toValue = parseFloat(b.trim());
          const invoiceValue = parseFloat(itemIGST?.IGST);

          if (!isNaN(fromValue) && !isNaN(toValue) && !isNaN(invoiceValue)) {
            return invoiceValue >= fromValue && invoiceValue <= toValue;
          }
        }
        return true;
      })

      // .filter((itemIGST) =>
      //   finalObj.IGST?.length
      //     ? itemIGST?.IGST?.toString().includes(
      //       Number(finalObj?.IGST?.toString())
      //     )
      //     : itemIGST
      // )

      .filter((itemCGST) => {
        if (finalObj?.CGST?.length) {
          const [a, b] = finalObj?.CGST?.split("to");
          const fromValue = parseFloat(a.trim());
          const toValue = parseFloat(b.trim());
          const invoiceValue = parseFloat(itemCGST?.CGST);

          if (!isNaN(fromValue) && !isNaN(toValue) && !isNaN(invoiceValue)) {
            return invoiceValue >= fromValue && invoiceValue <= toValue;
          }
        }
        return true;
      })


      // .filter((itemCGST) =>
      //   finalObj.CGST?.length
      //     ? itemCGST?.CGST?.toString().includes(
      //       Number(finalObj?.CGST?.toString())
      //     )
      //     : itemCGST
      // )

      .filter((itemSGST) => {
        if (finalObj?.SGST?.length) {
          const [a, b] = finalObj?.SGST?.split("to");
          const fromValue = parseFloat(a.trim());
          const toValue = parseFloat(b.trim());
          const invoiceValue = parseFloat(itemSGST?.SGST);

          if (!isNaN(fromValue) && !isNaN(toValue) && !isNaN(invoiceValue)) {
            return invoiceValue >= fromValue && invoiceValue <= toValue;
          }
        }
        return true;
      })

      // .filter((itemSGST) =>
      //   finalObj.SGST?.length
      //     ? itemSGST?.SGST?.toString().includes(
      //       Number(finalObj?.SGST?.toString())
      //     )
      //     : itemSGST
      // )

      .filter((itemCess) => {
        if (finalObj?.Cess?.length) {
          const [a, b] = finalObj?.Cess?.split("to");
          const fromValue = parseFloat(a.trim());
          const toValue = parseFloat(b.trim());
          const invoiceValue = parseFloat(itemCess?.Cess);

          if (!isNaN(fromValue) && !isNaN(toValue) && !isNaN(invoiceValue)) {
            return invoiceValue >= fromValue && invoiceValue <= toValue;
          }
        }
        return true;
      })

      // .filter((itemCess) =>
      //   finalObj.Cess?.length
      //     ? itemCess?.Cess?.toString().includes(
      //       Number(finalObj?.Cess?.toString())
      //     )
      //     : itemCess
      // )
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

  // ** Search Summary Data
  const gstr4aSummaryData = (types, sectionIndex) => {
    console.log(GSTR2AMockData);
    console.log(store, "redux data");

    let arrData = [];

    // debugger

    if (mockLiveData == "mockT") {

    } else {
      // ** store- redux

      if (store !== undefined) {
        if (sectionIndex == 1) {
          arrData =
            store?.B2B !== null &&
              store?.B2B !== "" &&
              store?.B2B?.length !== 0 &&
              store?.B2B !== undefined
              ? store?.B2B
              : [];
        } else if (sectionIndex == 2) {
          arrData =
            store?.B2BA !== null &&
              store?.B2BA !== "" &&
              store?.B2BA?.length !== 0 &&
              store?.B2BA !== undefined
              ? store?.B2BA
              : [];
        } else if (sectionIndex == 3) {
          arrData =
            store?.CDNR !== null &&
              store?.CDNR !== "" &&
              store?.CDNR?.length !== 0 &&
              store?.CDNR !== undefined
              ? store?.CDNR
              : [];
        } else if (sectionIndex == 4) {
          arrData =
            store?.CDNRA !== null &&
              store?.CDNRA !== "" &&
              store?.CDNRA?.length !== 0 &&
              store?.CDNRA !== undefined
              ? store?.CDNRA
              : [];
        }
      }
    }
    calcutions(arrData);
    setData(arrData);
  };

  // ** Pagination
  useEffect(() => {
    if (serverSidePage == true) {
      // gstr2AServices(
      //   finFromYear?.value,
      //   monthFrom?.value,
      //   sectionType?.value,
      //   "",
      //   "",
      //   "",
      //   "asc",
      //   ""
      // );
    }
  }, [serverSidePage]);

  // ** From Date
  const SelectFromYearOnChange = (value) => {
    setFinFormYear(value);
    // setFinFormYear1(value);
    setErrorMsg("");
    setMonthFrom(monthFrom?.srNo > value?.srNo ? monthFrom : panDataFrom[0]);
    // setMonthFrom1(monthFrom?.srNo > value?.srNo ? monthFrom : panDataFrom[0]);
    const x = panDataFrom?.filter(
      (item) => Number(item.srNo) >= Number(value.srNo)
    );
    setPanData(x);
  };

  // ** To Date
  const selectFromMonthOnChange = (value) => {
    if (Number(finFromYear?.srNo) > Number(value?.srNo)) {
      const fromFilter = panDataFrom?.filter(
        (item) => Number(item.srNo) == Number(value.srNo)
      )[0];
      setFinFormYear(fromFilter);
    } else {
      // sessionStorage.setItem(globleVariable.selectExportToDt, value?.value);
    }
    setErrorMsg("");
    setMonthFrom(value);
    // setMonthFrom1(value);
  };

  // **  selection Type
  const SelectionTypeOnchange = (value) => {
    setSectionType(value);
    setCurrentPage(0);
    setCurrentCol([]);
    setCurrentCol1();
    setSearchVal1([]);
    gstr4aSummaryData(null, value?.value);
  };

  //** Search - API services
  const gstr2AServices = (
    frDate,
    toDate,
    sectionTypes,
    pageNo,
    pageStartWith,
    colNameOrderby,
    orderBy,
    clearByFilter
  ) => {
    const itcValue = itcFlag;
    const sectionValue = sectionTypes;

    const payload = {
      userClientId: G_UCParId,
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
      sectionId: sectionValue,
      orderByColumnName: colNameOrderby,
      orderBy: orderBy,
      fromRange: frDate,
      toRange: toDate,
      isITCAvailable: itcValue,
      searchColumnName: clearByFilter !== "" ? currentCol : [],
      searchValue: clearByFilter != "" ? searchVal1 : [],
    };

    console.log(finFromYear?.value);

    setBlock(true);
    purchaseInvoiceService2A
      .getGSTR2APagination(payload)
      .then((res) => {
        setBlock(false);
        console.log("api calling");
        //** first response data set
        if (
          res.status === 200 &&
          res.data.status === errorCodeConfig.APIDefaultCode.Success
        ) {
          // setBlock(false);
          setItcEligibility(res.data.data.itcEligibility);
          setReverseCharge(res.data.data.reverseCharge);
          setSectionList(res.data.data.sectionList);
          setRateList(res?.data?.data?.rate);
          setNoteTypeList(res?.data?.data?.noteType);
          setPos(res?.data?.data?.placeOfSupply);
          setInvoiceType(res?.data?.data?.invoiceType)

          const sectionArr = res.data.data.sectionList;

          const defaultSection = sectionArr.filter(
            (item) => item.value == section
          );
          console.log("section type", +section);
          console.log(defaultSection);
          if (
            defaultSection !== undefined &&
            defaultSection !== null &&
            defaultSection !== ""
          ) {
            setSectionType(defaultSection[0]);
          }
        }

        setDisplayType(false);
        setServerSidePage(false);
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

  const summaryMainData = data;

  const pageCount = Math.ceil(data?.length && data.length / rowsPerPage);

  // ** Client side pagination
  const para1 = currentPage * rowsPerPage;
  const para2 = currentPage * rowsPerPage + rowsPerPage;
  let dataGSTR2A = data && data?.slice(para1, para2);

  const handsontableColumns = [
    {
      data: "SupplierGSTIN",
      readOnly: true,
      title: "GSTIN Number",
      width: 150,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "SupplierTradeName",
      readOnly: true,
      title: "Trade/Legal name of the supplier",
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "InvoiceNo",
      readOnly: true,
      title: "Invoice No",
      width: 180,
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
      title: "Supply Attract Reverse",
    },
    {
      data: "Rate",
      readOnly: true,
      title: "Rate",
    },

    {
      data: "TaxableValue",
      readOnly: true,
      title: "Taxable Value (₹)",
    },
    {
      data: "IGST",
      readOnly: true,
      title: "Integrated Tax (₹)",
    },
    {
      data: "CGST",
      readOnly: true,
      title: "Central Tax (₹)",
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
    },
    {
      data: "GstR1Period",
      readOnly: true,
      title: "GSTR-1/5 Period",
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "GstR1FilingDate",
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
      width: 500,
    },
    {
      data: "IRNDate",
      readOnly: true,
      title: "IRN Date",
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
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
          searchInput.children[0].value = searchVal1;
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
    gstr4aSummaryData("multiple", sectionType?.value);
    setFilterDropDownList({
      rateDropDownList: [],
      rcmDropDownList: [],
      noteTypeDropDownList: [],
      invoiceTypeDropDownList: [],
      posDropDownList: [],
      itcDropDownList: []
    });
    setGridCustomFilter([])
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

  document.addEventListener('input', function (event) {
    if (event.target.id === 'amount1' || event.target.id === 'amount2') {
      event.target.value = event.target.value.replace(/[^0-9,\.,\-]/g, '');
    }
  });

  //** Export
  const ExportSectionWiseData = () => {
    setBlock(true);
    // setSrcLoadSummary(true);

    gstr4AServices.exportGSTR4AExportData(
      G_UCParId,
      finFromYear?.value,
      monthFrom?.value,
      sectionType?.value,
      subId,
      GGSTIN,
      userId
    )

      .then((res) => {
        if (
          res?.status == 200 &&
          res?.data?.status == errorCodeConfig.APIDefaultCode.Success
        ) {
          // setTimeout(() => {
          setBlock(false);
          //   setSrcLoadSummary(false);
          // }, 1000);
          downloadURL(res.data.data);
        } else if (res.status == 401) {
          tokenExpiresRedirect();
        } else {
          setBlock(false);
          // setSrcLoadSummary(false);

          toast.error(res?.data?.errorMessage, {
            position: "top-right",
          });
        }
      })
      .catch((error) => {
        setBlock(false);
        // setSrcLoadSummary(false);
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

  return (
    <div>
      {block && <div className="loading1">Loading&#8230;</div>}

      <div>
        <div className="content-header row  py-1">
          <div className="content-header-left col-md-6 col-12">
            <div className="row breadcrumbs-top mb-0">
              <div className="col-12">
                <Breadcrumbs
                  title="GSTR-4A Invoice"
                  data={[
                    { title: "GST Returns", link: urlEndpointConfig.GSTR_All },

                    { title: "GSTR 4A Summary", link: "/gst-returns/gstr4a" },
                    { title: "GSTR-4A Invoice" },
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
              onClick={() => navigate("/gst-returns/gstr4a")}
              color="danger"
            >
              <ChevronLeft size={18} /> Back To Summary

            </Button>
            <Button
              type="button"
              className="me-1"
              outline
              onClick={ExportSectionWiseData}
              color="danger"
              id="btn2aexp"
            >
              <i className="fa fa-file-excel-o"></i>
              <span className="align-middle ms-50">Export</span>
              <UncontrolledTooltip placement="top" target="btn2aexp">
                Export [{keysMap.EXPORT_DATA}]
              </UncontrolledTooltip>
            </Button>

            <Button
              type="button"
              className="me-1"
              outline
              color="danger"
              onClick={ClearFilter}
              id="btn2aclr"
            >
              <i className="fa fa-filter fa-lg"></i>
              <span className="align-middle ms-50">Clear</span>
              <UncontrolledTooltip placement="top" target="btn2aclr">
                Clear [{keysMap.CLEAR_DATA}]
              </UncontrolledTooltip>
            </Button>
          </div>
        </div>

        <Row>
          <Col xs={12}>
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
                                  ? formatINR(Number(totalInvoiceValue))
                                  : 0}
                              </span>
                            </p>
                          </td>
                          <td>
                            <p className="mb-0">
                              Taxable Values (₹) <br />
                              <span>
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
                                {totalIGST ? formatINR(Number(totalIGST)) : 0}
                              </span>
                            </p>
                          </td>
                          <td>
                            <p className="mb-0">
                              SGST (₹) <br />
                              <span>
                                {" "}
                                {totalSGST ? formatINR(Number(totalSGST)) : 0}
                              </span>
                            </p>
                          </td>
                          <td>
                            <p className="mb-0">
                              CGST (₹) <br />
                              <span>
                                {" "}
                                {totalCGST ? formatINR(Number(totalCGST)) : 0}
                              </span>
                            </p>
                          </td>
                          <td>
                            <p className="mb-0">
                              Cess (₹)<br></br>
                              <span>
                                {totalCess ? formatINR(Number(totalCess)) : 0}
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
                        <Label className="form-label">Section List</Label>
                        <Select
                          id="sectionList"
                          placeholder="Section List"
                          isClearable={false}
                          theme={selectThemeColors}
                          closeMenuOnSelect={true}
                          options={mockSectionList}
                          components={animatedComponents}
                          className="basic-multi-select"
                          classNamePrefix="select"
                          value={sectionType}
                          onChange={SelectionTypeOnchange}
                        />
                      </Col>
                      <Col sm={4}>
                        <Label className="form-label">From </Label>
                        <Select
                          id="from"
                          placeholder="From"
                          isDisabled={true}
                          isClearable={false}
                          theme={selectThemeColors}
                          closeMenuOnSelect={true}
                          options={panDataFrom}
                          className="basic-multi-select "
                          classNamePrefix="select"
                          components={animatedComponents}
                          onChange={SelectFromYearOnChange}
                          value={finFromYear}
                          maxMenuHeight="150px"
                        />
                      </Col>

                      <Col sm={4}>
                        <Label className="form-label">To</Label>
                        <Select
                          id="to"
                          placeholder="To"
                          isDisabled={true}
                          isClearable={false}
                          theme={selectThemeColors}
                          closeMenuOnSelect={true}
                          options={panData}
                          components={animatedComponents}
                          className="basic-multi-select"
                          classNamePrefix="select"
                          onChange={selectFromMonthOnChange}
                          value={monthFrom}
                          maxMenuHeight="150px"
                        />
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </CardBody>
            </Card>
            <Card>
              <div>
                <CardBody>
                  <Row>
                    <Col sm="12">
                      <div>

                        <HotTable
                          autoColumnSize={true}
                          stretchH="all"
                          rowHeights={RowSize}
                          viewportColumnRenderingOffset={100}
                          columnHeaderHeight={columnHeaderSize}
                          data={dataGSTR2A?.length > 0 ? dataGSTR2A : [{ SupplierGSTIN: "No Data Found!" }]}
                          preventOverflow="horizontal"
                          columnSorting={true}
                          columns={handsontableColumns}
                          contextMenu={false}
                          //  nestedRows={true}
                          bindRowsWithHeaders={true}
                          licenseKey="non-commercial-and-evaluation"
                          height="auto"
                          ref={hotRef}
                          // afterColumnSort={ServerSideSorting}  /// Bug was raised not to show column indicators
                          mergeCells={dataGSTR2A?.length > 0 ? false : [
                            { row: 0, col: 0, rowspan: 1, colspan: 11 },
                          ]}
                          filters={true}
                          afterGetColHeader={theader}
                          //  fixedColumnsStart={1}
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

                              option6: createOptionMinMax(fromAmount, toAmount, 6),

                              option7: createOptionMinMax(fromAmountTaxable, toAmountTaxable, 10),

                              option8: createOptionMinMax(fromAmountIGST, toAmountIGST, 11),

                              option9: createOptionMinMax(fromAmountCGST, toAmountCGST, 12),

                              option10: createOptionMinMax(fromAmountSGST, toAmountSGST, 13),

                              option11: createOptionMinMax(fromAmountCESS, toAmountCESS, 14),

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

                                        filterObject.push({ [columnName]: value });

                                        setSearchVal1(value);
                                        let y = currentCol;
                                        y.push(handsontableColumns[currentCol1]?.data);
                                        setCurrentCol(y)

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
                              var searchInput = document.querySelector(".htUIMultipleSelectSearch.htUIInput");
                              var value = searchInput?.children[0].value;

                              var columnName = handsontableColumns[currentCol1]?.data;
                              let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                              filterObject.push({ [columnName]: value });

                              setSearchVal1(value);
                              let y = currentCol;
                              y.push(handsontableColumns[currentCol1]?.data);

                              setCurrentCol(y)

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
                              setSearchDate(searchInput1?.value);
                              setToDate(searchInput2?.value);
                              let filterObject = !gridCustomFilter ? [] : gridCustomFilter;

                              filterObject.push({ [columnName]: value });
                              setGridCustomFilter(filterObject)
                              let newFilterData = FilterData(filterObject);
                              setData([...newFilterData]);

                            }

                            else if (hot?.getSelected()[0][1] == 6) {
                              // debugger
                              console.log("hii 61");
                              var searchInput1 = document.getElementById("amount1");
                              var searchInput2 = document.getElementById("amount2");
                              console.log("hii 62");
                              const invFromDate = (searchInput1?.value)?.replaceAll(",", "")
                              const invToDate = (searchInput2?.value)?.replaceAll(",", "")
                              var columnName = handsontableColumns[currentCol1]?.data;
                              console.log("hii 63");

                              var value = (searchInput1?.value || searchInput2?.value) && `${invFromDate ? invFromDate : invToDate}to${invToDate ? invToDate : invFromDate}`;
                              console.log("hii 64", value);
                              setFromAmount(searchInput1?.value);
                              setToAmount(searchInput2?.value);
                              console.log("hii 65", searchInput1?.value);

                              let filterObject = !gridCustomFilter ? [] : gridCustomFilter;
                              console.log("hii 66", filterObject);


                              filterObject.push({ [columnName]: value });

                              console.log("hii 67", filterObject);

                              setGridCustomFilter(filterObject)


                              let newFilterData = FilterData(filterObject);
                              console.log("hii 68", newFilterData);
                              setData([...newFilterData]);

                            }

                            else if (hot?.getSelected()[0][1] == 10) {

                              var searchInput1 = document.getElementById("amount1");
                              var searchInput2 = document.getElementById("amount2");
                              const invFromDate = (searchInput1?.value)?.replaceAll(",", "")
                              const invToDate = (searchInput2?.value)?.replaceAll(",", "")
                              var columnName = handsontableColumns[currentCol1]?.data;
                              var value = (searchInput1?.value || searchInput2?.value) && `${invFromDate ? invFromDate : invToDate}to${invToDate ? invToDate : invFromDate}`;
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
                              var value = (searchInput1?.value || searchInput2?.value) && `${fromAmount ? fromAmount : toAmount}to${toAmount ? toAmount : fromAmount}`;
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
                              var value = (searchInput1?.value || searchInput2?.value) && `${fromAmount ? fromAmount : toAmount}to${toAmount ? toAmount : fromAmount}`;
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
                              var value = (searchInput1?.value || searchInput2?.value) && `${fromAmount ? fromAmount : toAmount}to${toAmount ? toAmount : fromAmount}`;
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
                              var value = (searchInput1?.value || searchInput2?.value) && `${fromAmount ? fromAmount : toAmount}to${toAmount ? toAmount : fromAmount}`;
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
                          cells={function (row, col) {
                            var cp = {};
                            const hot = hotRef?.current?.hotInstance;

                            if (col !== null) {
                              cp.renderer = emptyRender;
                            }

                            // if (col == 6) {
                            //   // const invoiceValue =
                            //   //   hot?.getSourceDataAtRow(row)?.InvoiceValue;
                            //   // if (
                            //   //   invoiceValue !== null &&
                            //   //   invoiceValue !== "null" &&
                            //   //   invoiceValue !== undefined
                            //   // ) {
                            //   //   cp.className = "text-end";
                            //   // }
                            // }
                            // if (col == 9) {
                            //   const rate = hot?.getSourceDataAtRow(row)?.Rate;
                            //   if (
                            //     rate !== null &&
                            //     rate !== "null" &&
                            //     rate !== undefined
                            //   ) {
                            //     cp.className = "text-end";
                            //   }
                            // }
                            // if (col == 10) {
                            //   const taxableValue =
                            //     hot?.getSourceDataAtRow(row)?.TaxableValue;
                            //   if (
                            //     taxableValue !== null &&
                            //     taxableValue !== "null" &&
                            //     taxableValue !== undefined
                            //   ) {
                            //     cp.className = "text-end";
                            //   }
                            // }
                            // if (col == 11) {
                            //   const igst = hot?.getSourceDataAtRow(row)?.IGST;
                            //   if (
                            //     igst !== null &&
                            //     igst !== "null" &&
                            //     igst !== undefined
                            //   ) {
                            //     cp.className = "text-end";
                            //   }
                            // }
                            // if (col == 12) {
                            //   const sgst = hot?.getSourceDataAtRow(row)?.SGST;
                            //   if (
                            //     sgst !== null &&
                            //     sgst !== "null" &&
                            //     sgst !== undefined
                            //   ) {
                            //     cp.className = "text-end";
                            //   }
                            // }
                            // if (col == 13) {
                            //   const cgst = hot?.getSourceDataAtRow(row)?.CGST;
                            //   if (
                            //     cgst !== null &&
                            //     cgst !== "null" &&
                            //     cgst !== undefined
                            //   ) {
                            //     cp.className = "text-end";
                            //   }
                            // }
                            // if (col == 14) {
                            //   const cess = hot?.getSourceDataAtRow(row)?.Cess;
                            //   if (
                            //     cess !== null &&
                            //     cess !== "null" &&
                            //     cess !== undefined
                            //   ) {
                            //     cp.className = "text-end";
                            //   }
                            // }
                            // if (col == 19) {
                            //   // const taxRate =
                            //   //   hot?.getSourceDataAtRow(row)?.TaxRate;
                            //   // if (
                            //   //   taxRate !== null &&
                            //   //   taxRate !== "null" &&
                            //   //   taxRate !== undefined
                            //   // ) {
                            //   //   cp.className = "text-end";
                            //   // }
                            //   cp.className = "text-end";
                            // }

                            if (col == 6 || col > 8 && col < 15 || col == 19) {
                              cp.className = "text-end";
                            }

                            if (sectionType?.value == 7) {
                              if (col > 0) {
                                cp.className = "text-end";
                              }
                            }
                            return cp;
                          }}
                          // cells={function (row, col) {
                          //   var cp = {};
                          //   const hot = hotRef?.current?.hotInstance;

                          //   if (col !== null) {
                          //     cp.renderer = emptyRender;
                          //   }

                          //   if (col == 6) {
                          //     const invoiceValue =
                          //       hot?.getSourceDataAtRow(row)?.InvoiceValue;
                          //     if (
                          //       invoiceValue !== null &&
                          //       invoiceValue !== "null" &&
                          //       invoiceValue !== undefined
                          //     ) {
                          //       cp.className = "text-end";
                          //     }
                          //   }
                          //   if (col == 9) {
                          //     const rate = hot?.getSourceDataAtRow(row)?.Rate;
                          //     if (
                          //       rate !== null &&
                          //       rate !== "null" &&
                          //       rate !== undefined
                          //     ) {
                          //       cp.className = "text-end";
                          //     }
                          //   }
                          //   if (col == 10) {
                          //     const taxableValue =
                          //       hot?.getSourceDataAtRow(row)?.TaxableValue;
                          //     if (
                          //       taxableValue !== null &&
                          //       taxableValue !== "null" &&
                          //       taxableValue !== undefined
                          //     ) {
                          //       cp.className = "text-end";
                          //     }
                          //   }
                          //   if (col == 11) {
                          //     const igst = hot?.getSourceDataAtRow(row)?.IGST;
                          //     if (
                          //       igst !== null &&
                          //       igst !== "null" &&
                          //       igst !== undefined
                          //     ) {
                          //       cp.className = "text-end";
                          //     }
                          //   }
                          //   if (col == 12) {
                          //     const sgst = hot?.getSourceDataAtRow(row)?.SGST;
                          //     if (
                          //       sgst !== null &&
                          //       sgst !== "null" &&
                          //       sgst !== undefined
                          //     ) {
                          //       cp.className = "text-end";
                          //     }
                          //   }
                          //   if (col == 13) {
                          //     const cgst = hot?.getSourceDataAtRow(row)?.CGST;
                          //     if (
                          //       cgst !== null &&
                          //       cgst !== "null" &&
                          //       cgst !== undefined
                          //     ) {
                          //       cp.className = "text-end";
                          //     }
                          //   }
                          //   if (col == 14) {
                          //     const cess = hot?.getSourceDataAtRow(row)?.Cess;
                          //     if (
                          //       cess !== null &&
                          //       cess !== "null" &&
                          //       cess !== undefined
                          //     ) {
                          //       cp.className = "text-end";
                          //     }
                          //   }
                          //   if (col == 19) {
                          //     const taxRate =
                          //       hot?.getSourceDataAtRow(row)?.TaxRate;
                          //     if (
                          //       taxRate !== null &&
                          //       taxRate !== "null" &&
                          //       taxRate !== undefined
                          //     ) {
                          //       cp.className = "text-end";
                          //     }
                          //   }
                          //   return cp;
                          // }}
                          afterOnCellMouseDown={localAfterOnCellMouseDown}
                          fillHandle={false}
                          autoWrapRow={true}
                        />

                        {/* : (
                          <>
                            <HotTable
                              fillHandle={false}
                              ref={hotRef2}
                              rowHeights={RowSize}
                              columnHeaderHeight={columnHeaderSize}
              
                              viewportColumnRenderingOffset={100}
                              style={{ textAlign: "center" }}
                              data={[{ SupplierGSTIN: "No Data Found!" }]}
                              mergeCells={[
                                { row: 0, col: 0, rowspan: 1, colspan: 11 },
                              ]}
                              autoColumnSize={true}
                              stretchH="all"
                              preventOverflow="horizontal"
                              columnSorting={true}
                              columns={handsontableColumns}
                              //  nestedRows={true}
                              contextMenu={false}
                              dropdownMenu={{
                                items: {
                                  filter_by_value: {
                                    name: "Search Value",
                                    // hide the 'Filter by value' list from all columns but the first one
                                    hidden() {
                                      const hot = hotRef2?.current?.hotInstance;
                                      console.log(
                                        "noon col",
                                        hot?.getSelected()[0][1],
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
                                      )} class='custom-date col-md-11' placeholder='DD-MM-YYYY' id='custom2' name='date' value=${searchDate}  >`,
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

                                      console.log(
                                        "custom value12345",
                                        src.value
                                      );

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
                                          const hot =
                                            hotRef2?.current?.hotInstance;

                                          if (hot.getSelected()[0][1] != 5) {
                                            var searchInput =
                                              document.querySelector(
                                                ".htUIMultipleSelectSearch.htUIInput"
                                              );
                                            var value = "";
                                          } else {
                                            var searchInput1 =
                                              document.getElementById(
                                                "custom2"
                                              );
                                            var value = "";
                                            setSearchDate(value);
                                          }

                                          const x = searchVal1;
                                          if (!searchVal1?.length) {
                                            x.push(value);
                                            let y = currentCol;
                                            y.push(
                                              handsontableColumns[currentCol1]
                                                ?.data
                                            );
                                            // console.log("jsx=",x,y)
                                            setSearchVal1(x);
                                            setCurrentCol(y);
                                          } else {
                                            const Index = currentCol?.findIndex(
                                              (item) =>
                                                handsontableColumns[currentCol1]
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
                                                handsontableColumns[currentCol1]
                                                  ?.data
                                              );
                                              // console.log("jsx=",x,y)
                                              setSearchVal1(x);
                                              setCurrentCol(y);
                                            }
                                          }
                                          let uniq = [...new Set(currentCol)];

                                          for (
                                            let i = 0;
                                            i < uniq.length;
                                            i++
                                          ) {
                                            var obj = {};

                                            for (
                                              let j = 0;
                                              j < searchVal1.length;
                                              j++
                                            ) {
                                              console.log(searchVal1[j]);
                                              if (i == j) {
                                                obj[uniq[i]] = searchVal1[j];
                                                arrFilter.push(obj);
                                              }
                                            }
                                          }
                                          let newFilterData =
                                            FilterData(arrFilter);
                                          setData([...newFilterData]);
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
                              afterFilter={function (data) {
                                const hot = hotRef2?.current?.hotInstance;

                                if (hot.getSelected()[0][1] != 5) {
                                  var searchInput = document.querySelector(
                                    ".htUIMultipleSelectSearch.htUIInput"
                                  );
                                  var value = searchInput.children[0].value;
                                } else {
                                  var searchInput1 =
                                    document.getElementById("custom2");
                                  var value = searchInput1.value;
                                  setSearchDate(value);
                                }

                                const x = searchVal1;
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
                                    // console.log("jsx=",x,y)
                                    setSearchVal1(x);
                                    setCurrentCol(y);
                                  }
                                }
                                let uniq = [...new Set(currentCol)];

                                for (let i = 0; i < uniq.length; i++) {
                                  var obj = {};

                                  for (let j = 0; j < searchVal1.length; j++) {
                                    console.log(searchVal1[j]);
                                    if (i == j) {
                                      obj[uniq[i]] = searchVal1[j];
                                      arrFilter.push(obj);
                                    }
                                  }
                                }
                                let newFilterData = FilterData(arrFilter);
                                setData([...newFilterData]);
                              }}
                              bindRowsWithHeaders={true}
                              licenseKey="non-commercial-and-evaluation"
                              height="auto"
                              afterGetColHeader={theader}
                              filters={true}
                              afterOnCellMouseDown={localAfterOnCellMouseDown}
                            />
                          </>
                        )} */}

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
                          containerClassName="pagination react-paginate separated-pagination pagination-sm justify-content-end pe-1 mt-1"
                        />
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default InvoicesGSTR4A;
