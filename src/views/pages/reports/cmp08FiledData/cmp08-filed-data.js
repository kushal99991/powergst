// ** React Imports
import { Fragment, useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

// ** Spinner (Splash Screen)
import Spinner from "../../../../@core/components/spinner/Loading-spinner";
import encryptData from "../../../../auth/crypto/crypto";
// ** Styles
import "@styles/react/libs/tables/react-dataTable-component.scss";
// ** Third Party Components
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { FilePlus, Trash2, X } from "react-feather";
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
  CardTitle,
  CardHeader,
  CardText,
  Tooltip,
  UncontrolledTooltip,
  CardBody,
  Progress,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
import { Search } from "react-feather";
import GSTR3Services from "../../../../services/gstr3b/gstr3bService";
import GSTR3FIFileDataService from "../../../../services/gstr3bFiled/gstr3bFiledService";
//** Error Code file
import errorCodeConfig from "../../../../configs/apiErrorCodeConfig";
// ** Custom Components
import Breadcrumbs from "@components/breadcrumbs";
// import PruchaseTypesModal from './purchase-list-modal'

//** Handsontable
import { HotTable, HotColumn } from "@handsontable/react";
import Handsontable from "handsontable";
import { registerRenderer, textRenderer } from "handsontable/renderers";
import { registerAllModules } from "handsontable/registry";
import {
  LINK_MESSAGE,
  keysMap,
  enableOnFormTags,
  RowSize,
  columnHeaderSize,
} from "../../../../configs/config";

// ** Utils
import Select, { components } from "react-select"; // eslint-disable-line
import { selectThemeColors } from "@utils";
import makeAnimated from "react-select/animated";
import { SELECT_MAXSIZE } from "../../../../configs/config";
import DeleteModelCMP3A from "../../../components/models/DeleteModelGSTR3b";

import { useHotkeys } from "react-hotkeys-hook";
import { getGSTR3BSummary } from "../../../apps/user/store";
import { globleVariable } from "../../../../configs/globalVariable";
import LocalFunction from "../../../../configs/getLocalFunction";
import SessionFunction from "../../../../configs/getSessionFunction";
import { getCMP08FiledData } from "./store";

const animatedComponents = makeAnimated();

// ** Range wise year
const finYearOption = LocalFunction.getLocalValue(
  globleVariable.rangeFiltersCMP08,
  true
);
const YearList =
  finYearOption !== undefined &&
  finYearOption !== null &&
  finYearOption !== "" &&
  finYearOption !== "undefined"
    ? JSON.parse(finYearOption)
    : [];

registerAllModules();

const CMP3AFileDataDetails = ({
  wizardBtn,
  setDownloadStart,
  downloadStart,
  exportStart,
  setExportType,
  downloadDate,
  setDownloadDate,
  setFinFormYearDownload,
  finFromYearDownload
}) => {
  const defaultData = [
    {
      Description: "Outward Supplies (Including Exempt Supplies)",
      Value: "0",
      IGST: "0",
      CGST: "0",
      SGST: "0",
      Cess: "0",
    },
    {
      Description:
        "inward supplies attracting reverse charge including import of services",
      Value: "0",
      IGST: "0",
      CGST: "0",
      SGST: "0",
      Cess: "0",
    },
    {
      Description: "tax payable (1 + 2)",
      Value: "0",
      IGST: "0",
      CGST: "0",
      SGST: "0",
      Cess: "0",
    },
    {
      Description: "Interest payable, if any",
      Value: "0",
      IGST: "0",
      CGST: "0",
      SGST: "0",
      Cess: "0",
    },
  ];
  // ** Column

  const handsontableColumns = [
    {
      data: "Description",
      readOnly: true,
      title: "Description",
      width: "400",
    },
    {
      data: "Value",
      readOnly: true,
      title: "Value ( &#8377; )",
      type: "numeric",
      numericFormat: {
        pattern: "0,0.00",
        culture: "en-IN",
      },
    },
    {
      data: "IGST",
      readOnly: true,
      title: "IGST ( &#8377; )",
      type: "numeric",
      numericFormat: {
        pattern: "0,0.00",
        culture: "en-IN",
      },
    },
    {
      data: "CGST",
      readOnly: true,
      title: "CGST ( &#8377; )",
      type: "numeric",
      numericFormat: {
        pattern: "0,0.00",
        culture: "en-IN",
      },
    },
    {
      data: "SGST",
      readOnly: true,
      title: "SGST ( &#8377; )",
      type: "numeric",
      numericFormat: {
        pattern: "0,0.00",
        culture: "en-IN",
      },
    },
    {
      data: "Cess",
      readOnly: true,
      title: "CESS ( &#8377; )",
      type: "numeric",
      numericFormat: {
        pattern: "0,0.00",
        culture: "en-IN",
      },
    },
  ];
  const cashLedgerColumns = [
    {
      data: "igst",
      readOnly: true,
      title: "IGST",
      type: "numeric",
      numericFormat: {
        pattern: "0,0.00",
        culture: "en-IN",
      },
    },
    {
      data: "cgst",
      readOnly: true,
      title: "CGST",
      type: "numeric",
      numericFormat: {
        pattern: "0,0.00",
        culture: "en-IN",
      },
    },
    {
      data: "sgst",
      readOnly: true,
      title: "SGST",
      type: "numeric",
      numericFormat: {
        pattern: "0,0.00",
        culture: "en-IN",
      },
    },
    {
      data: "cess",
      readOnly: true,
      title: "CESS",
      type: "numeric",
      numericFormat: {
        pattern: "0,0.00",
        culture: "en-IN",
      },
    },
    {
      data: "total",
      readOnly: true,
      title: "Total",
      type: "numeric",
      numericFormat: {
        pattern: "0,0.00",
        culture: "en-IN",
      },
    },
  ];
  const paymentOfTaxColumns = [
    {
      data: "Description",
      readOnly: true,
      title: "Description",
    },
    {
      data: "TaxPayableReverseCharge",
      readOnly: true,
      title: "Reverse Charge",
      type: "numeric",
      width: 100,
      numericFormat: {
        pattern: "0,0.00",
        culture: "en-IN",
      },
    },
    {
      data: "TaxPayableOther",
      readOnly: true,
      title: "Other than reverse charge",
      type: "numeric",
      width: 100,
      numericFormat: {
        pattern: "0,0.00",
        culture: "en-IN",
      },
    },
    {
      data: "AdjustmentReverseCharge",
      readOnly: true,
      title: "Reverse Charge",
      width: 100,
      type: "numeric",
      numericFormat: {
        pattern: "0,0.00",
        culture: "en-IN",
      },
    },
    {
      data: "AdjustmentOther",
      readOnly: true,
      title: "Other than reverse charge",
      type: "numeric",
      width: 100,
      numericFormat: {
        pattern: "0,0.00",
        culture: "en-IN",
      },
    },
    {
      data: "InterestPayable",
      readOnly: true,
      title: "Interest payable",
      type: "numeric",
      numericFormat: {
        pattern: "0,0.00",
        culture: "en-IN",
      },
    },
    {
      data: "Cess",
      readOnly: true,
      title: "Tax/cess",
      type: "numeric",
      numericFormat: {
        pattern: "0,0.00",
        culture: "en-IN",
      },
    },
    {
      data: "Interest",
      readOnly: true,
      title: "Interest",
      type: "numeric",
      numericFormat: {
        pattern: "0,0.00",
        culture: "en-IN",
      },
    },
  ];
  const nestedPaymentOfTaxColumns = [
    [
      "Description",
      { label: "Tax Payable", colspan: 2 },
      {
        label: "Adjustment of negative liability of previous tax period",
        colspan: 2,
      },
      "Interest payable",
      { label: "Paid in cash", colspan: 2 },
      "Additional Cash required",
    ],
    [
      "",
      "Reverse charge",
      "Other than reverse charge",
      "Reverse charge",
      "Other than reverse charge",
      "",
      "Tax/cess",
      "Interest",
      "",
    ],
  ];

  const defaultCashLedgerData = [
    {
      igst: 0,
      cgst: 0,
      sgst: 0,
      cess: 0,
      total: 0,
    },
  ];

  const defaultPaymentOfTaxData = [
    {
      Description: "Integrated tax",
      TaxPayableReverseCharge: "0",
      TaxPayableOther: "0",
      AdjustmentReverseCharge: "0",
      AdjustmentOther: "0",
      InterestPayable: "0",
      Cess: "0",
      Interest: "0",
    },
    {
      Description: "Central tax",
      TaxPayableReverseCharge: "0",
      TaxPayableOther: "0",
      AdjustmentReverseCharge: "0",
      AdjustmentOther: "0",
      InterestPayable: "0",
      Cess: "0",
      Interest: "0",
    },
    {
      Description: "State / UT tax",
      TaxPayableReverseCharge: "0",
      TaxPayableOther: "0",
      AdjustmentReverseCharge: "0",
      AdjustmentOther: "0",
      InterestPayable: "0",
      Cess: "0",
      Interest: "0",
    },
    {
      Description: "Cess",
      TaxPayableReverseCharge: "0",
      TaxPayableOther: "0",
      AdjustmentReverseCharge: "0",
      AdjustmentOther: "0",
      InterestPayable: "0",
      Cess: "0",
      Interest: "0",
    },
  ];
  const store = useSelector((state) => state?.users?.GSTR3BSummary);
  const filedSuppliesRowDetails = useSelector(
    (state) => state?.users?.GSTR3BSummary[0]?.FiledSuppliesRowDetails
  );
  const cmp08FiledData = useSelector(
    (state) => state?.cmp08Filed?.CMP08Summary
  );
  const clientIds =
    sessionStorage.getItem(globleVariable.G_UCParId) &&
    SessionFunction.getSessionValue(globleVariable.G_UCParId, true);
  const subId =
    localStorage.getItem(globleVariable.subscriptionId) &&
    LocalFunction.getLocalValue(globleVariable.subscriptionId, true);
  const GGSTIN =
    sessionStorage.getItem(globleVariable.G_GSTIN) &&
    SessionFunction.getSessionValue(globleVariable.G_GSTIN, true);

  const dispatch = useDispatch();

  // ** Hooks
  const [block, setBlock] = useState(false);
  const [modalshow, setModalshow] = useState(false);

  // ** Delete
  const [deleteModalshow, setDeleteModalshow] = useState(false);
  const [data, setData] = useState([]);

  const [finFromYear, setFinFormYear] = useState(null);
  const [panData, setPanData] = useState([]);
  const [monthFrom, setMonthFrom] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [displayType, setDisplayType] = useState(false);
  const [search, setSearch] = useState(false);
  const [panDataFrom, setPanDataFrom] = useState([]);

  // ** Grids Table Data
  const [supplies, setSupplies] = useState([]);
  const [supplyDetails, setSupplyDetails] = useState([]);
  const [outwardSupplies, setOutwardSupplies] = useState([]);
  const [nilRated, setNilRated] = useState([]);
  const [lateFee, setLateFee] = useState([]);
  const [eligibleITCs, setEligibleITCs] = useState([]);
  const [filedPaymentPage, setFiledPaymentPage] = useState([]);
  const [savethenSearch, setSaveThenSearch] = useState(false);
  const [computationData, setComputationData] = useState();
  const [invoiceData, setInvoiceData] = useState(defaultData);
  const [taxData, setTaxData] = useState(defaultPaymentOfTaxData);
  const G_UCParId =
    sessionStorage.getItem(globleVariable.G_UCParId) &&
    SessionFunction.getSessionValue(globleVariable.G_UCParId, true);
  const gstr3BFiledFromDt =
    sessionStorage.getItem(globleVariable.gstr3BFiledFromDt) &&
    SessionFunction.getSessionValue(globleVariable.gstr3BFiledFromDt, true);
  const gstr3BFiledToDt =
    sessionStorage.getItem(globleVariable.gstr3BFiledToDt) &&
    SessionFunction.getSessionValue(globleVariable.gstr3BFiledToDt, true);
  const defaultYear =
    sessionStorage.getItem(globleVariable.defaultYear) &&
    SessionFunction.getSessionValue(globleVariable.defaultYear, true);
  // ** Navigate
  const navigate = useNavigate();
  const hotRef = useRef(null);
  const cashLedgerHotRef = useRef(null);
  const paymentOfTaxHotRef = useRef(null);



  useEffect(() => {

    if (exportStart == true && wizardBtn == 1) {

      onDateSelect();
      setExportType(false);
    }
  }, [exportStart]);

  // ** From and To Year list
  useEffect(() => {
    setPanData(YearList);
    setPanDataFrom(YearList);
    setDisplayType(true);
  }, []);



  // ** From Month selection
  const selectFromYear = (value) => {
    console.log("value=", value);
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
  };

  // ** To Month selection
  const selectFromMonth = (value) => {
    setErrorMsg("");
    setMonthFrom(value);

    if (Number(finFromYear?.srNo) > Number(value?.srNo)) {
      const fromFilter = panDataFrom?.filter(
        (item) => Number(item.srNo) == Number(value.srNo)
      )[0];
      setFinFormYear(fromFilter);
    } else {
    }
  };

  // ** Display for loading
  useEffect(() => {
    return () => setBlock(false);
  }, []);

  const onDateSelect = () => {
    let defaultValueFrom = null;
    let defaultValueTo = null;
    if (
      gstr3BFiledFromDt !== null &&
      gstr3BFiledFromDt !== "" &&
      gstr3BFiledFromDt !== undefined
    ) {
      console.log("set from date");
      defaultValueFrom = panDataFrom?.filter(
        (item) => item.value == gstr3BFiledFromDt
      )[0];
    } else {
      defaultValueFrom = panDataFrom?.filter(
        (item) => Number(item.value) == Number(defaultYear)
      )[0];
    }

    if (
      gstr3BFiledToDt !== null &&
      gstr3BFiledToDt !== "" &&
      gstr3BFiledToDt !== undefined
    ) {
      defaultValueTo = panData?.filter(
        (item) => item.value == gstr3BFiledToDt
      )[0];
    } else {
      defaultValueTo = panData?.filter(
        (item) => Number(item.value) == Number(defaultYear)
      )[0];
    }

    if (
      defaultValueFrom !== undefined &&
      defaultValueFrom !== null &&
      defaultValueFrom !== ""
    ) {
      setFinFormYear(defaultValueFrom);
      SessionFunction.setSessionValue(
        globleVariable.gstr3BFiledFromDt,
        defaultValueFrom?.value,
        true
      );
    }
    if (
      defaultValueTo !== undefined &&
      defaultValueTo !== null &&
      defaultValueTo !== ""
    ) {
      setMonthFrom(defaultValueTo);
      SessionFunction.setSessionValue(
        globleVariable.gstr3BFiledToDt,
        defaultValueTo?.value,
        true
      );
    }
  };


  const gstr3BToDt =
  sessionStorage.getItem(globleVariable.defaultYear) !== null &&
  sessionStorage.getItem(globleVariable.defaultYear) !== "" &&
  sessionStorage.getItem(globleVariable.defaultYear) !== undefined
    ? SessionFunction?.getSessionValue(globleVariable?.defaultYear, true)
    : "";

  const finYearLoggedIn = parseInt(gstr3BToDt?.slice(2)) - 1;
  const finMonthLoggedIn = parseInt(gstr3BToDt?.slice(0, 2));
  // ** Set From and to Date by session
  useEffect(() => {
    console.log("default value");
    if (displayType == true) {
      debugger

      setSearch(true);
      let defaultValueFrom = null;
      let defaultValueTo = null;

      if (
        defaultValueFrom !== undefined &&
        defaultValueFrom !== null &&
        defaultValueFrom !== ""
      ) {
        defaultValueFrom = panDataFrom?.filter(
          (item) => item.value == itc04DateRange
        )[0];
        setFinFormYear(defaultValueFrom);
        setMonthFrom(defaultValueFrom);
      } else {
        const matchingYearFrom = panDataFrom?.filter(
          (item) => item?.value?.slice(2) == finYearLoggedIn
        );
        const defaultValueFrom = matchingYearFrom?.filter(
          (item) =>
            item?.value?.slice(0, 2) == finMonthLoggedIn ||
            item?.value?.slice(0, 2) == finMonthLoggedIn + 1 ||
            item?.value?.slice(0, 2) == finMonthLoggedIn + 2
        );

        if (finYearLoggedIn < 2018) {
          const defaultValueFrom = panDataFrom[panDataFrom?.length - 1];
          setFinFormYear(defaultValueFrom);
          setMonthFrom(defaultValueFrom);
        } else {

          if(finYearLoggedIn == 2018 && defaultValueFrom?.length == 0) {
            const defaultValueFrom = panDataFrom[panDataFrom?.length - 1];
            setFinFormYear(defaultValueFrom);
            setMonthFrom(defaultValueFrom);
          }else {
            if(defaultValueFrom?.length == 0) {
              setFinFormYear(panDataFrom[0]);
              setMonthFrom(panDataFrom[0]);

            }else {
              setFinFormYear(defaultValueFrom);
              setMonthFrom(defaultValueFrom);
            }
          }
        }
      }
      onDateSelect();
    }
  }, [displayType]);

  useEffect(() => {
    finFromYear && monthFrom && onClickSearch()
  }, [])

  // ** Check select company
  useEffect(() => {
    console.log("is company login", sessionStorage.getItem("isCompany"));
    if (
      sessionStorage.getItem("isCompany") == false ||
      sessionStorage.getItem("isCompany") == "false"
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
    if (store) {
      console.log(store, "store[0]?.FiledOutwardSupplies");
      setBlock(false);
      setEligibleITCs(store[0]?.FiledEligibleITCs);
      setLateFee(store[0]?.FiledLateFee);
      setNilRated(store[0]?.FiledNilRated);
      setSupplyDetails(store[0]?.FiledSupplyDetails);
      setOutwardSupplies(store[0]?.FiledOutwardSupplies);
      setSupplies(store[0]?.FiledSupplies);
      setFiledPaymentPage(store[0]?.Filedpaymentofpage);
      var paymentOfPageAllData = store[0]?.Filedpaymentofpage;
      var computationOfData = [];
      console.log(paymentOfPageAllData, "ComputationData");

      if (paymentOfPageAllData != null && paymentOfPageAllData.length > 0) {
        computationOfData.push([
          "Integrated Tax",
          paymentOfPageAllData[0].IGST,
          paymentOfPageAllData[2].IGST,
          paymentOfPageAllData[3].IGST,
          paymentOfPageAllData[4].IGST,
          paymentOfPageAllData[5].IGST,
          paymentOfPageAllData[6].IGST,
          paymentOfPageAllData[7].IGST,
          paymentOfPageAllData[8].IGST,
          paymentOfPageAllData[9].IGST,
          paymentOfPageAllData[10].IGST,
          paymentOfPageAllData[11].IGST,
          paymentOfPageAllData[12].IGST,
          paymentOfPageAllData[13].IGST,
          paymentOfPageAllData[14].IGST,
        ]);

        computationOfData.push([
          "Central Tax",
          paymentOfPageAllData[0].CGST,
          paymentOfPageAllData[2].CGST,
          paymentOfPageAllData[3].CGST,
          paymentOfPageAllData[4].CGST,
          paymentOfPageAllData[5].CGST,
          paymentOfPageAllData[6].CGST,
          paymentOfPageAllData[7].CGST,
          paymentOfPageAllData[8].CGST,
          paymentOfPageAllData[9].CGST,
          paymentOfPageAllData[10].CGST,
          paymentOfPageAllData[11].CGST,
          paymentOfPageAllData[12].CGST,
          paymentOfPageAllData[13].CGST,
          paymentOfPageAllData[14].CGST,
        ]);

        computationOfData.push([
          "State/UT Tax",
          paymentOfPageAllData[0].SGST,
          paymentOfPageAllData[2].SGST,
          paymentOfPageAllData[3].SGST,
          paymentOfPageAllData[4].SGST,
          paymentOfPageAllData[5].SGST,
          paymentOfPageAllData[6].SGST,
          paymentOfPageAllData[7].SGST,
          paymentOfPageAllData[8].SGST,
          paymentOfPageAllData[9].SGST,
          paymentOfPageAllData[10].SGST,
          paymentOfPageAllData[11].SGST,
          paymentOfPageAllData[12].SGST,
          paymentOfPageAllData[13].SGST,
          paymentOfPageAllData[14].SGST,
        ]);

        computationOfData.push([
          "Cess",
          paymentOfPageAllData[0].Cess,
          paymentOfPageAllData[2].Cess,
          paymentOfPageAllData[3].Cess,
          paymentOfPageAllData[4].Cess,
          paymentOfPageAllData[5].Cess,
          paymentOfPageAllData[6].Cess,
          paymentOfPageAllData[7].Cess,
          paymentOfPageAllData[8].Cess,
          paymentOfPageAllData[9].Cess,
          paymentOfPageAllData[10].Cess,
          paymentOfPageAllData[11].Cess,
          paymentOfPageAllData[12].Cess,
          paymentOfPageAllData[13].Cess,
          paymentOfPageAllData[14].Cess,
        ]);

        setComputationData(computationOfData);
      }
      console.log(computationData, "ComputationData");
    }
  }, [store]);

  // ** toggle Compose
  const toggleCompose = () => setDeleteModalshow(!deleteModalshow);


  // ** Modal show/Hide
  const invModalOpen = () => {
    document.getElementById("btnNewPurchase").blur();
    setModalshow(!modalshow);
  };

  useEffect(() => {
    if (downloadStart) {
      console.log(finFromYearDownload)


      const userData = {
        clientid: clientIds,
        finyear: finFromYearDownload?.value,
        finmonth: finFromYearDownload?.value,
        subscriptionId: subId,
        gstNumber: GGSTIN,
      };

      SessionFunction.setSessionValue(
        globleVariable.gstr3BFiledFromDt,
        finFromYearDownload?.value,
        true
      );
      SessionFunction.setSessionValue(
        globleVariable.gstr3BFiledToDt,
        finFromYearDownload?.value,
        true
      );

      setBlock(true);
      dispatch(getGSTR3BSummary(userData));
      if (store) {
        setBlock(false);
      }
      setDownloadStart(false);
    }
  }, [downloadStart]);

  // ** Toggle show/hide
  const toggleModal = () => setModalshow(!modalshow);

  // ** Delete Modal Show/Hide
  const HideShowDeleteModel = () => {
    setDeleteModalshow(!deleteModalshow);
    // document.getElementById('btnDeleteGSTR3B').blur();
  };

  // **  localAfterOnCellMouseDown
  function localAfterOnCellMouseDown(event, coords, td) {
    const hot = hotRef?.current?.hotInstance;

    if (coords.row !== -1 && coords.col < 1) {
      const typeofInvoiceId = hot.getDataAtRow(coords.row)[6];
      const encrypData = encryptData.encrypt(typeofInvoiceId);

      let arrTypes = [];
      // console.log(data)
      data
        .filter((obj) => obj.typeofInvoiceId == 7 || obj.typeofInvoiceId == 8)
        .map((item) =>
          arrTypes.push({
            value: item.typeofInvoiceId,
            label: item.typeofInvoice,
          })
        );
    }
  }

  const theader = (col, TH) => {
    if (col > 0) {
      TH.className = "htRight";
    } else {
      TH.className = "htLeft";
    }
  };
  const cashLedgerTheader = (col, TH) => {
    TH.className = "htRight";
  };

  const paymentOfTaxTheader = (col, TH) => {
    if (TH) {
      TH.style.height = "auto"; // Adjusts height based on content
      TH.style.verticalAlign = "middle";
      TH.style.whiteSpace = "normal";
      TH.style.width = "50px";
    }

    if (col == 0) {
      TH.className += " htLeft";
    }
    if (col > 1) {
      TH.className += " htCenter";
    }

    // TH.className += " text-center wrap"
  };

  // ** Loading
  const loadFunction = (value) => {
    console.log(value, "valueeeeeeeeeeeeee");
    setBlock(value);
  };

  // ** Loading Export
  const loadFunctionExport = (value, fileName, selectedYear) => {
    setBlock(value);

  };

  useEffect(() => {
    if (savethenSearch == true) {
      let hotTable = hotRef?.current?.hotInstance;
      hotTable.deselectCell();
    }
  }, [savethenSearch]);

  const onClickSearch = () => {


    console.log(YearList , "YearList")

    const userData = {
      UserClientId: clientIds,
      FromRange: finFromYear?.value,
      ToRange: monthFrom?.value,
      G_GSTIN: GGSTIN,
      SubscriptionId: subId,
    };

    SessionFunction.setSessionValue(
      globleVariable.gstr3BFiledFromDt,
      finFromYear?.value,
      true
    );
    SessionFunction.setSessionValue(
      globleVariable.gstr3BFiledToDt,
      finFromYear?.value,
      true
    );

    setBlock(true);
    dispatch(getCMP08FiledData(userData))
      .then(() => {
        setBlock(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setBlock(false);
      });
  };
    useEffect(() => {
        if(downloadDate){
            onDateSelect();

            const userData = {
              UserClientId: clientIds,
              FromRange:finFromYearDownload?.value,
              ToRange: finFromYearDownload?.value,
              G_GSTIN: GGSTIN,
              SubscriptionId: subId,
            };

            setBlock(true);
            dispatch(getCMP08FiledData(userData))
              .then(() => {
                setBlock(false);
              })
              .catch((error) => {
                console.error("Error fetching data:", error);
                setBlock(false);
              });
        setDownloadDate(false)
        }
    }, [downloadDate]);

  useEffect(() => {
    if (cmp08FiledData?.length > 0) {
      const { FiledCmp08Details, FiledCMP08PaymentOfTax } = cmp08FiledData[0];
      setInvoiceData(FiledCmp08Details);
      setTaxData(FiledCMP08PaymentOfTax);
    }
  }, [cmp08FiledData]);
  return (
    <Fragment>
      {block && <div className="loading1">Loading&#8230;</div>}

      <div className="content-header-left col-md-12 col-12">
        <div className="row breadcrumbs-top mb-1">
          <div className="col-md-6"></div>
          <div className="col-md-6">
            <div className="row">
              <div className="col-md-2"></div>
              <div className="col-md-4">
                <div className="row">
                  <Label className="form-label col-md-2 pt-half ps-0">
                    From
                  </Label>
                  <Select
                    id="from"
                    placeholder="From"
                    isClearable={false}
                    theme={selectThemeColors}
                    closeMenuOnSelect={true}
                    options={panDataFrom}
                    className="basic-multi-select col-md-10"
                    classNamePrefix="select"
                    components={animatedComponents}
                    onChange={selectFromYear}
                    value={finFromYear}
                    maxMenuHeight={SELECT_MAXSIZE}
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="row">
                  <Label className="form-label col-md-2 pt-half">To</Label>
                  <Select
                    id="to"
                    placeholder="To"
                    isClearable={false}
                    theme={selectThemeColors}
                    closeMenuOnSelect={true}
                    options={panData}
                    components={animatedComponents}
                    className="basic-multi-select col-md-10"
                    classNamePrefix="select"
                    onChange={selectFromMonth}
                    value={monthFrom}
                    maxMenuHeight={SELECT_MAXSIZE}
                  />
                </div>
              </div>
              <div className="col-md-2 text-md-end  ps-0">
                <Button
                  onClick={onClickSearch}
                  className="btn-icon btn-round"
                  color="danger"
                  outline
                >
                  <Search size={12} />
                  &nbsp;Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="heading-font-18-weight mt-3">Invoice Details</h3>
        <div>
          <Row>
            <Col md={12}>
              <div className="filing-table-border">
                {invoiceData && invoiceData?.length > 0 ? (
                  <HotTable
                    data={invoiceData}
                    manualColumnResize={true}
                    stretchH="all"
                    preventOverflow="horizontal"
                    columns={handsontableColumns}
                    contextMenu={false}
                    rowHeights={RowSize}
                    columnHeaderHeight={columnHeaderSize}
                    bindRowsWithHeaders={true}
                    licenseKey="non-commercial-and-evaluation"
                    height="auto"
                    // className='tblborder'
                    ref={hotRef}
                    afterGetColHeader={theader}
                    afterOnCellMouseDown={localAfterOnCellMouseDown}
                    mergeCells={false}
                    cells={function (row, col) {
                      var cp = {};
                      const hot = hotRef?.current?.hotInstance;
                      cp.className = "child";

                      if (invoiceData?.length > 0) {
                        if (col > 0) {
                          cp.className = "text-end";
                        } else {
                          cp.className = "no-pointer";
                        }
                        if (col === 4 || row === 2) {
                          cp.className += " purchseCellDisable";
                        }

                        if (row === 0 && (col === 2 || col === 5)) {
                          cp.className += " purchseCellDisable";
                        }

                        if (row === 3 && col === 1) {
                          cp.className += " purchseCellDisable";
                        }
                      }

                      return cp;
                    }}
                    width="100%"
                    colWidths={100}
                  />
                ) : (
                  <HotTable
                    mergeCells={[{ row: 0, col: 0, rowspan: 1, colspan: 6 }]}
                    // autoColumnSize={true}
                    autoColumnSize={{
                      samplingRatio: 23, // Adjust the samplingRatio as needed
                    }}
                    manualColumnResize={true}
                    ref={hotRef}
                    stretchH="all"
                    rowHeights={RowSize}
                    columnHeaderHeight={columnHeaderSize}
                    // style={{ overflowX: "hidden", textAlign: "center" }}
                    data={[{ natureOfSupplies: "No Data Found!" }]}
                    cells={function (row, col) {
                      var cp = {};

                      if (col == 0) {
                        cp.className = "text-center";
                      }
                      return cp;
                    }}
                    preventOverflow="horizontal"
                    columns={handsontableColumns}
                    contextMenu={false}
                    bindRowsWithHeaders={true}
                    licenseKey="non-commercial-and-evaluation"
                    height="auto"
                    width="100%"
                    colWidths={100}
                    afterGetColHeader={theader}
                  />
                )}
              </div>
            </Col>
          </Row>
        </div>
      </div>
      <div>
        <h3 className="heading-font-18-weight mt-3">Cash Ledger</h3>
        <div>
          <Row>
            <Col md={12}>
              <div className="filing-table-border">
                {defaultCashLedgerData && defaultCashLedgerData?.length > 0 ? (
                  <HotTable
                    autoWrapRow={true}
                    data={defaultCashLedgerData}
                    autoColumnSize={true}
                    afterGetColHeader={cashLedgerTheader}
                    rowHeights={RowSize}
                    maxRows={defaultCashLedgerData?.length}
                    columnHeaderHeight={columnHeaderSize}
                    stretchH="all"
                    preventOverflow="horizontal"
                    columns={cashLedgerColumns}
                    contextMenu={false}
                    bindRowsWithHeaders={true}
                    licenseKey="non-commercial-and-evaluation"
                    height="auto"
                    ref={cashLedgerHotRef}
                  />
                ) : (
                  <HotTable
                    mergeCells={[{ row: 0, col: 0, rowspan: 1, colspan: 6 }]}
                    // autoColumnSize={true}
                    autoColumnSize={{
                      samplingRatio: 23, // Adjust the samplingRatio as needed
                    }}
                    manualColumnResize={true}
                    ref={hotRef}
                    stretchH="all"
                    rowHeights={RowSize}
                    columnHeaderHeight={columnHeaderSize}
                    // style={{ overflowX: "hidden", textAlign: "center" }}
                    data={[{ natureOfSupplies: "No Data Found!" }]}
                    cells={function (row, col) {
                      var cp = {};

                      if (col == 0) {
                        cp.className = "text-center";
                      }
                      return cp;
                    }}
                    preventOverflow="horizontal"
                    columns={handsontableColumns}
                    contextMenu={false}
                    bindRowsWithHeaders={true}
                    licenseKey="non-commercial-and-evaluation"
                    height="auto"
                    width="100%"
                    colWidths={100}
                    afterGetColHeader={theader}
                  />
                )}
              </div>
            </Col>
          </Row>
        </div>
      </div>
      <div>
        <h3 className="heading-font-18-weight mt-3">Payment of Tax</h3>
        <div>
          <Row>
            <Col md={12}>
              <div className="filing-table-border">
                {taxData && taxData?.length > 0 ? (
                  <HotTable
                    data={taxData}
                    rowHeights={RowSize}
                    maxRows={taxData?.length}
                    columnHeaderHeight={columnHeaderSize}
                    stretchH="all"
                    preventOverflow="horizontal"
                    autoColumnSize={true}
                    colHeaders={true}
                    height="auto"
                    ref={paymentOfTaxHotRef}
                    cells={function (row, col) {
                      var cp = {};
                      const hot = paymentOfTaxHotRef?.current?.hotInstance;
                      cp.className = "child";

                      if (col > 0) {
                        cp.className = "text-end";
                        //  cp.readOnly = false;
                      } else {
                        cp.className = "no-pointer";
                        //  cp.readOnly = true;
                      }

                      return cp;
                    }}
                    colWidths={[120]}
                    //  afterChange={(x, y) => cellChangePaymentOfTax(x, y)}
                    wordWrap={true}
                    afterGetColHeader={paymentOfTaxTheader}
                    nestedHeaders={nestedPaymentOfTaxColumns}
                    autoWrapRow={true}
                    autoWrapCol={true}
                    licenseKey="non-commercial-and-evaluation"
                    bindRowsWithHeaders={true}
                    columns={paymentOfTaxColumns}
                    // colWidths={[50, 120, 120, 120, 120, 120, 100, 120, 50]}
                    contextMenu={false}
                  />
                ) : (
                  <HotTable
                    mergeCells={[{ row: 0, col: 0, rowspan: 1, colspan: 6 }]}
                    // autoColumnSize={true}
                    autoColumnSize={{
                      samplingRatio: 23, // Adjust the samplingRatio as needed
                    }}
                    manualColumnResize={true}
                    ref={hotRef}
                    stretchH="all"
                    rowHeights={RowSize}
                    columnHeaderHeight={columnHeaderSize}
                    // style={{ overflowX: "hidden", textAlign: "center" }}
                    data={[{ natureOfSupplies: "No Data Found!" }]}
                    cells={function (row, col) {
                      var cp = {};

                      if (col == 0) {
                        cp.className = "text-center";
                      }
                      return cp;
                    }}
                    preventOverflow="horizontal"
                    columns={handsontableColumns}
                    contextMenu={false}
                    bindRowsWithHeaders={true}
                    licenseKey="non-commercial-and-evaluation"
                    height="auto"
                    width="100%"
                    colWidths={100}
                    afterGetColHeader={theader}
                  />
                )}
              </div>
            </Col>
          </Row>
        </div>
      </div>
      {modalshow && (
        <PruchaseTypesModal
          typeOfInv={data}
          show={modalshow}
          toggleModal={toggleModal}
          frmType={"purSummary"}
          redirectType="purchase"
        ></PruchaseTypesModal>
      )}

      {deleteModalshow && (
        <DeleteModelCMP3A
          Heading="Delete CMP3A Summary"
          SuccessButtonText="Delete"
          show={deleteModalshow}
          toggleCompose={toggleCompose}
        ></DeleteModelCMP3A>
      )}
    </Fragment>
  );
};

export default CMP3AFileDataDetails;
