// ** React Imports
import { Fragment, useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";


import withReactContent from "sweetalert2-react-content";
// ** Styles
import "@styles/react/libs/tables/react-dataTable-component.scss";
import { compareDates } from "../../../helper/filterArray";
// ** Third Party Components
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { FilePlus, Trash2, X, Download } from "react-feather";
import { Search, ArrowRight, ArrowLeft, FileText } from "react-feather";
import GSTR3BDownloadService from "../../../services/gstr3b/gstr3bDownloadService";
import { urlEndpointConfig } from "@configs/urlEndpoint";
import errorCodeConfig from "@configs/apiErrorCodeConfig";

const MySwal = withReactContent(Swal);
// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  Input,
  Label,
  Button,
  CardText,
  Tooltip,
  UncontrolledTooltip,
  CardBody,
  Table,
  Modal,
  ModalBody,
} from "reactstrap";
import GSTR3Services from "../../../services/gstr3b/gstr3bService";
//** Error Code file
// import errorCodeConfig from "../../../configs/apiErrorCodeConfig";
// ** Custom Components
import Breadcrumbs from "@components/breadcrumbs";

//** Handsontable
import { HotTable, HotColumn } from "@handsontable/react";
import Handsontable from "handsontable";
import { registerRenderer, textRenderer } from "handsontable/renderers";
import { registerAllModules } from "handsontable/registry";
import {
  LINK_MESSAGE,
  keysMap,
  enableOnFormTags,
  RowSize, columnHeaderSize
} from "../../../configs/config";

// ** Utils
import Select, { components } from "react-select"; // eslint-disable-line
import { selectThemeColors } from "@utils";
import makeAnimated from "react-select/animated";
import { SELECT_MAXSIZE } from "../../../configs/config";

import { useHotkeys } from "react-hotkeys-hook";

import { globleVariable } from "../../../configs/globalVariable";
import LocalFunction from "../../../configs/getLocalFunction";
import SessionFunction from "../../../configs/getSessionFunction";
import VerificationOTP from "../verification-otp";
import { formatINR , formatINRWithoutDecimal } from '@helper/formatINRCurrency'
import {  useOutletContext } from "react-router-dom";
import { validSourceStates, validChangeType, sanitizeValue } from "../gstr9c/helper";
import { downloadURL } from "@helper/downloadUrl";

import gstr3bFiledService from "../../../services/gstr3bFiled/gstr3bFiledService";
import WithoutOtpModel from "../../components/WithoutOtpModel/WithoutOtpModel";


const animatedComponents = makeAnimated();

// ** Import Dropdown list
const ImportButtonList = [{ id: "1", name: "Import Excel" }];

const REGX_LEAD_ZERO = /^0+/;
const REGX_DECIMAL = /^\d+\.\d{3,}$/;

const pageCount = 0;

// ** Range wise year
const finYearOption = LocalFunction.getLocalValue(
  globleVariable.rangeFilters,
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

const GSTR3BDetails = (props) => {
  // ** Hooks
 

  const [block, setBlock] = useState(false);
  const [modalshow, setModalshow] = useState(false);

  // ** Delete
  const [deleteModalshow, setDeleteModalshow] = useState(false);
  const [data, setData] = useState();

  const [finFromYear, setFinFormYear] = useState(null);
  const [panData, setPanData] = useState([]);
  const [monthFrom, setMonthFrom] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [displayType, setDisplayType] = useState(false);
  const [search, setSearch] = useState(false);
  const [panDataFrom, setPanDataFrom] = useState([]);
  const [composeOpen, setComposeOpen] = useState(false);
  const [msgDisplay, setMsgDisplay] = useState(null);
const [isShowModel, setIsShowModel] = useState(false);
const [typeOfDownload,setTypeOfDonwload] = useState("");
const [openWithoutOtpFailed, setopenWithoutOtpFailed] = useState(false);
  let checkIsPresentData = false;
  let checkIsSaveData = false;

  const getDataList = [
    { id: '1', label: 'GSTN Auto-Populated Data' },
    { id: '2', label: 'System Calculated Data' }
  ]

  const gstr2bData = [
    {
      label: "GSTR 2B",
      value: 1,
    },
    {
      label: "Purchase",
      value: 2,
    },
    {
      label: "Reconciliation Data",
      value: 3,
    },
  ];
  const [gstOption, setGstOption] = useState(null);
  // ** Grids Table Data
  const [supplies, setSupplies] = useState([]);
  const [supplyDetails, setSupplyDetails] = useState([]);
  const [outwardSupplies, setOutwardSupplies] = useState([]);
  const [nilRated, setNilRated] = useState([]);
  const [lateFee, setLateFee] = useState([]);
  const [eligibleITCs, setEligibleITCs] = useState([]);
  const [savethenSearch, setSaveThenSearch] = useState(false);
  const [outwardSuppliesDe, setOutwardSuppliesDe] = useState([]);
  const [suppliesDe, setSuppliesDe] = useState([]);
  const [supplyDetailsDe, setSupplyDetailsDe] = useState([]);
  const [eligibleITCsDe, setEligibleITCsDe] = useState([]);
  const [nilRatedDe, setNilRatedDe] = useState([]);
  const [lateFeeDe, setLateFeeDe] = useState([]);
  const [errorArr, setErrorArr] = useState([]);
const [isGetRecoData, setIsGetRecoData] = useState(false);

  const { isGSTR3BFiledStatus, searchDataApi, setSearchDataApi, setAutopopulatedData, autopopulatedData, returnStatus3b,stepper } = props;


  //** Shortcut keys
  useHotkeys(
    keysMap.DELETE_DATA,
    () => {
      block == false && HideShowDeleteModel();
    },
    { enableOnFormTags }
  );
  useHotkeys(
    keysMap.ADD_ENTRY,
    () => {
      block == false && invModalOpen();
    },
    { enableOnFormTags }
  );
  useHotkeys(
    keysMap.SAVE_DATA,
    () => {
      block == false && onClickSaveButtonGSTR3bDetails();
    },
    { enableOnFormTags }
  );

  // ** Navigate
  const navigate = useNavigate();
  const hotRef = useRef(null);
  const hotRef2 = useRef(null);
  const hotRef3 = useRef(null);
  const hotRefEligibeleITC = useRef(null);
  const hotRefExempt = useRef(null);
  const hotRefIntersetLateFee = useRef(null);

  const G_UCParId =
    sessionStorage.getItem(globleVariable.G_UCParId) &&
    SessionFunction.getSessionValue(globleVariable.G_UCParId, true);

  const gstr3BToDt =
    sessionStorage.getItem(globleVariable.defaultYear) !== null &&
      sessionStorage.getItem(globleVariable.defaultYear) !== "" &&
      sessionStorage.getItem(globleVariable.defaultYear) !== undefined
      ? SessionFunction?.getSessionValue(globleVariable?.defaultYear, true)
      : "";
  const UserId = LocalFunction.getLocalValue(globleVariable.userId, true)
    ? LocalFunction.getLocalValue(globleVariable.userId, true)
    : " ";
  const defaultDates =
    sessionStorage.getItem(globleVariable.defaultYear) &&
    SessionFunction.getSessionValue(globleVariable.defaultYear, true);

  const G_GSTIN = SessionFunction.getSessionValue(globleVariable.G_GSTIN, true);
  const subscriptionId = localStorage.getItem(globleVariable.subscriptionId) && LocalFunction.getLocalValue(globleVariable.subscriptionId, true);
  const token =localStorage.getItem(globleVariable.tokenKey) && LocalFunction.getLocalValue(globleVariable.tokenKey, true);

  // ** From and To Year list
  useEffect(() => {
    setPanData(YearList);
    setPanDataFrom(YearList);
    setDisplayType(true);
  }, []);


  // ** To Month selection
  const selectFromMonth = (value) => {
    setErrorMsg("");
    setMonthFrom(value);
    sessionStorage.setItem(globleVariable.gstr3bDownloadFromDt, value?.value);
    SessionFunction.setSessionValue(
      globleVariable.gstr3BToDt,
      value?.value,
      true
    );
  };

  // ** Display for loading
  useEffect(() => {
    return () => setBlock(false);
  }, []);

  // ** Set From and to Date by session
  useEffect(() => {
    console.log("default value");
    if (displayType == true) {
      let defaultValueFrom = null;
      let defaultValueTo = null;

      if (
        gstr3BToDt !== null &&
        gstr3BToDt !== "" &&
        gstr3BToDt !== undefined
      ) {
        defaultValueTo = panData?.filter((item) => item.value == gstr3BToDt)[0];
      } else {
        defaultValueTo = panData?.filter(
          (item) => Number(item.value) == Number(defaultDates)
        )[0];
      }

      if (
        defaultValueTo !== undefined &&
        defaultValueTo !== null &&
        defaultValueTo !== ""
      ) {
        setMonthFrom(defaultValueTo);
        sessionStorage.setItem(
          globleVariable.gstr3bDownloadFromDt,
          defaultValueTo?.value
        );

        SessionFunction.setSessionValue(
          globleVariable.gstr3BToDt,
          defaultValueTo?.value,
          true
        );
      }

      setSearch(true);
    }
  }, [displayType]);

  // ** Check select company
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

  // ** Search
  useEffect(() => {
    if (!deleteModalshow && search) {
      PurchaseSummaryService();
      // document.getElementById("btnDeleteGSTR3B").blur();
    }
  }, [search, deleteModalshow, monthFrom]);

  // ** toggle Compose
  const toggleCompose = () => setDeleteModalshow(!deleteModalshow);
  const toggleCompose1 = () => setComposeOpen(!composeOpen);


  // ** Search
  const PurchaseSummaryService = () => {
    setBlock(true);

    GSTR3Services.gstrFetchAllData(String(G_UCParId), gstr3BToDt, gstr3BToDt, G_GSTIN)
      .then((res) => {
        setBlock(false);
        if (
          res.status === 200 &&
          res.data.status === errorCodeConfig.APIDefaultCode.Success
        ) {
          setSaveThenSearch(false);
          setData(res?.data?.data);

          setOutwardSuppliesDe(
            res?.data?.data?.outwardSupplies.map((ele) => ({
              cess: ele?.cess,
              cgst: ele?.cgst,
              description: ele?.description,
              details: ele?.details,
              igst: ele.igst,
              interStateSupplies: ele.interStateSupplies,
              intraStateSupplies: ele.intraStateSupplies,
              natureOfSupplies: ele.natureOfSupplies,
              placeOfSupply: ele.placeOfSupply,
              // sgst:ele.cgst,
              sgst: ele?.sgst,
              taxableValue: ele.taxableValue,
              type: ele.type,
              typeText: ele.typeText,
            }))
          );
          setSuppliesDe(
            res?.data?.data?.supplies.map((ele) => ({
              cess: ele?.cess,
              cgst: ele?.cgst,
              description: ele?.description,
              details: ele?.details,
              igst: ele.igst,
              interStateSupplies: ele.interStateSupplies,
              intraStateSupplies: ele.intraStateSupplies,
              natureOfSupplies: ele.natureOfSupplies,
              placeOfSupply: ele.placeOfSupply,
              // sgst:ele.cgst,
              sgst: ele.sgst,
              taxableValue: ele.taxableValue,
              type: ele.type,
              typeText: ele.typeText,
            }))
          );
          console.log(res?.data?.data, "res?.data?.data?.supplyDetails")

          setSupplyDetailsDe(
            res?.data?.data?.supplyDetails.map((ele) => ({
              cess: ele?.cess,
              cgst: ele?.cgst,
              description: ele?.description,
              details: ele?.details,
              igst: ele.igst,
              interStateSupplies: ele.interStateSupplies,
              intraStateSupplies: ele.intraStateSupplies,
              natureOfSupplies: ele.natureOfSupplies,
              placeOfSupply: ele.placeOfSupply,
              // sgst:ele.cgst,
              sgst: ele.sgst,
              taxableValue: ele.taxableValue,
              type: ele.type,
              typeText: ele.typeText,
            }))
          );
          setEligibleITCsDe(
            res?.data?.data?.eligibleITCs.map((ele) => ({
              cess: ele?.cess,
              cgst: ele?.cgst,
              description: ele?.description,
              details: ele?.details,
              igst: ele.igst,
              interStateSupplies: ele.interStateSupplies,
              intraStateSupplies: ele.intraStateSupplies,
              natureOfSupplies: ele.natureOfSupplies,
              placeOfSupply: ele.placeOfSupply,
              // sgst:ele.cgst,
              sgst: ele.sgst,
              taxableValue: ele.taxableValue,
              type: ele.type,
              typeText: ele.typeText,
            }))
          );
          setNilRatedDe(
            res?.data?.data?.nilRated.map((ele) => ({
              cess: ele?.cess,
              cgst: ele?.cgst,
              description: ele?.description,
              details: ele?.details,
              igst: ele.igst,
              interStateSupplies: ele.interStateSupplies,
              intraStateSupplies: ele.intraStateSupplies,
              natureOfSupplies: ele.natureOfSupplies,
              placeOfSupply: ele.placeOfSupply,
              // sgst:ele.cgst,
              sgst: ele.sgst,
              taxableValue: ele.taxableValue,
              type: ele.type,
              typeText: ele.typeText,
            }))
          );
          setLateFeeDe(
            res?.data?.data?.lateFee.map((ele) => ({
              cess: ele?.cess,
              cgst: ele?.cgst,
              description: ele?.description,
              details: ele?.details,
              igst: ele.igst,
              interStateSupplies: ele.interStateSupplies,
              intraStateSupplies: ele.intraStateSupplies,
              natureOfSupplies: ele.natureOfSupplies,
              placeOfSupply: ele.placeOfSupply,
              // sgst:ele.cgst,
              sgst: ele.sgst,
              taxableValue: ele.taxableValue,
              type: ele.type,
              typeText: ele.typeText,
            }))
          );
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
            confirmButton: "btn btn-danger",
          },
          buttonsStyling: false,
        });
      });
  };

  const NilReturnFilling = () => {
    return MySwal.fire({
      title:
        "Are you sure you want to file nil return for " + monthFrom?.label,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      customClass: {
        confirmButton: "btn btn-danger",
        cancelButton: "btn btn-outline-dark ms-1",
      },
      buttonsStyling: false,
    }).then(function (result) {
      if (result.value) {
        const payLoad = {
          userClientId: G_UCParId,
          userId: UserId,
          returnPeriod: sessionStorage.getItem("gstr3bDownloadFromDt"),
          loggedGSTIN: G_GSTIN,
          isNilFiling: true,
        };
        generateSummaryFunc(payLoad);
      }
    });
  };

  const errorMsgs = (err) => {
    Swal.fire({
      icon: "warning",
      title: "",
      text: err,
      customClass: {
        confirmButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });

  }



  const generateSummaryFunc = (payLoad) => {
    GSTR3BDownloadService.getGstr3bSummaryGovt(payLoad)

      .then((res) => {
        if (res.data.status === errorCodeConfig.APIDefaultCode.GovtOTPExpire) {
          setBlock(false)
          toast.error(res?.data?.errorMessage, {
            position: "top-right",
          });
          setTimeout(() => {
            navigate(urlEndpointConfig.REQUESTOTP)
          }, 200);
        } else {
          if (
            res.status === 200 &&
            res.data.status === errorCodeConfig.APIDefaultCode.Success
          ) {
            setBlock(false)
            toast.success(res?.data?.successMessage, {
              position: "top-right",
            });
           sessionStorage.setItem("isClickNilReturn", true);

            stepper.to(3)
          } else {
            setBlock(false)
            errorMsgs(res?.data?.errorMessage);
            stepper.to(2)
          }
        }

      })
      .catch((error) => {
        stepper.to(2)
        setBlock(false)
        errorMsgs(error?.message);
      });

  };


  // ** Modal show/Hide
  const invModalOpen = () => {
    // document.getElementById("btnNewPurchase")?.blur();
    setModalshow(!modalshow);
  };

  // ** Toggle show/hide
  const toggleModal = () => setModalshow(!modalshow);

  // ** Delete Modal Show/Hide
  const HideShowDeleteModel = () => {
    setDeleteModalshow(!deleteModalshow);
    // document.getElementById("btnDeleteGSTR3B").blur();
  };

  // ** Column
  const handsontableColumns = [
    {
      data: "natureOfSupplies",
      readOnly: true,
      title: "Nature of supplies",
      width: 499,
    },
    {
      data: "taxableValue",
      readOnly: true,
      title: "Total Taxable Value (₹)",
      type: "numeric",
      width: '145px',
      numericFormat: {
        pattern: '0,0.00',
        culture: 'en-IN'
      },
    },
    {
      data: "igst",
      readOnly: true,
      title: "IGST (₹)",
      type: "numeric",
      numericFormat: {
        pattern: '0,0.00',
        culture: 'en-IN'
      },
    },
    {
      data: "cgst",
      readOnly: true,
      title: "CGST (₹)",
      type: "numeric",
      numericFormat: {
        pattern: '0,0.00',
        culture: 'en-IN'
      },
    },
    {
      data: "sgst",
      readOnly: true,
      title: "SGST (₹)",
      type: "numeric",
      numericFormat: {
        pattern: '0,0.00',
        culture: 'en-IN'
      },
    },
    {
      data: "cess",
      readOnly: true,
      title: "CESS (₹)",
      type: "numeric",
      numericFormat: {
        pattern: '0,0.00',
        culture: 'en-IN'
      },
    },
  ];
  const handsontableColumns2 = [
    {
      data: "natureOfSupplies",
      readOnly: true,
      title: "Nature of supplies",
      width: 499,
    },
    {
      data: "taxableValue",
      readOnly: true,
      width: '135px',
      title: "Total Taxable Value (₹)",
      type: "numeric",
      // numericFormat: {
      //   pattern: '0,0.00',
      //   culture: 'en-IN'
      // },
    },
    {
      data: "igst",
      readOnly: true,
      title: "IGST (₹)",
      type: "numeric",
      // numericFormat: {
      //   pattern: '0,0.00',
      //   culture: 'en-IN'
      // },
    },
    {
      data: "cgst",
      readOnly: true,
      title: "CGST (₹)",
      type: "numeric",
      // numericFormat: {
      //   pattern: '0,0.00',
      //   culture: 'en-IN'
      // },
    },
    {
      data: "sgst",
      readOnly: true,
      title: "SGST (₹)",
      type: "numeric",
      // numericFormat: {
      //   pattern: '0,0.00',
      //   culture: 'en-IN'
      // },
    },
    {
      data: "cess",
      readOnly: true,
      title: "CESS (₹)",
      type: "numeric",
      // numericFormat: {
      //   pattern: '0,0.00',
      //   culture: 'en-IN'
      // },
    },
  ];
  const handsontableColumns3 = [
    {
      data: "natureOfSupplies",
      readOnly: true,
      title: "Nature of supplies",
      width: 200,
    },
    {
      data: "taxableValue",
      readOnly: true,
      title: "Total Taxable Value (₹)",
      type: "numeric",
      // numericFormat: {
      //   pattern: '0,0.00',
      //   culture: 'en-IN'
      // },

    },
    {
      data: "igst",
      readOnly: true,
      title: "IGST (₹)",
      type: "numeric",
      // numericFormat: {
      //   pattern: '0,0.00',
      //   culture: 'en-IN'
      // },
    },
    {
      data: "type",
      readOnly: true,
      title: "Type",
    },
  ];

  const exemptColumns = [
    {
      data: "natureOfSupplies",
      readOnly: true,
      title: "Nature of supplies",
      width: 200,
    },
    {
      data: "interStateSupplies",
      readOnly: true,
      title: "Inter-State-Supplies (₹)",
      type: "numeric",
      // numericFormat: {
      //   pattern: '0,0.00',
      //   culture: 'en-IN'
      // },
    },
    {
      data: "intraStateSupplies",
      readOnly: true,
      title: "Intra-State-Supplies (₹)",
      type: "numeric",
      // numericFormat: {
      //   pattern: '0,0.00',
      //   culture: 'en-IN'
      // },
    },
  ];

  const eligbileColumns = [
    {
      data: "details",
      readOnly: true,
      title: "Details",
      width: 400,
    },
    {
      data: "igst",
      readOnly: true,
      title: "IGST (₹)",
      type: "numeric",
      numericFormat: {
        pattern: '0,0.00',
        culture: 'en-IN'
      },
    },
    {
      data: "cgst",
      readOnly: true,
      title: "CGST (₹)",
      type: "numeric",
      numericFormat: {
        pattern: '0,0.00',
        culture: 'en-IN'
      },
    },
    {
      data: "sgst",
      readOnly: true,
      title: "SGST (₹)",
      type: "numeric",
      numericFormat: {
        pattern: '0,0.00',
        culture: 'en-IN'
      },
    },
    {
      data: "cess",
      readOnly: true,
      title: "CESS (₹)",
      type: "numeric",
      numericFormat: {
        pattern: '0,0.00',
        culture: 'en-IN'
      },
    },
  ];


  const intersetAndLateFeesColumn = [
    {
      data: "description",
      readOnly: true,
      title: "Description",
      width: 400,
    },
    {
      data: "igst",
      readOnly: true,
      title: "IGST (₹)",
      type: "numeric",
      // numericFormat: {
      //   pattern: '0,0.00',
      //   culture: 'en-IN'
      // },
    },
    {
      data: "cgst",
      readOnly: true,
      title: "CGST (₹)",
      type: "numeric",
      // numericFormat: {
      //   pattern: '0,0.00',
      //   culture: 'en-IN'
      // },
    },
    {
      data: "sgst",
      readOnly: true,
      title: "SGST (₹)",
      type: "numeric",
      // numericFormat: {
      //   pattern: '0,0.00',
      //   culture: 'en-IN'
      // },
    },
    {
      data: "cess",
      readOnly: true,
      title: "CESS (₹)",
      type: "numeric",
      // numericFormat: {
      //   pattern: '0,0.00',
      //   culture: 'en-IN'
      // },
    },
  ];

  const theader = (col, TH) => {
    if (col > 0) {
      TH.className = "htRight";
    } else {
      TH.className = "htLeft";
    }
  };


  const theader1 = (col, TH) => {
    if (col > 0) {
      TH.className = "htRight";
    } else {
      TH.className = "htLeft";
    }
  };
  const theader2 = (col, TH) => {
    if (col > 0) {
      TH.className = "htRight";
    } else {
      TH.className = "htLeft";
    }
  };
  const theader3 = (col, TH) => {
    if (col > 0) {
      TH.className = "htRight";
    } else {
      TH.className = "htLeft";
    }
  };
  const theader4 = (col, TH) => {
    if (col > 0) {
      TH.className = "htRight";
    } else {
      TH.className = "htLeft";
    }
  };
  const theader5 = (col, TH) => {
    if (col > 0) {
      TH.className = "htRight";
    } else {
      TH.className = "htLeft";
    }
  };

  // **  localAfterOnCellMouseDown
  function localAfterOnCellMouseDown(event, coords, td) {
    const hot = hotRef?.current?.hotInstance;
  }

  function localAfterOnCellMouseDownSupplies(event, coords, td) {
    const hot = hotRef3?.current?.hotInstance;

    if (coords.row !== -1 && coords.col < 1) {
      const suppliesId = hot.getDataAtRow(coords.row)[3];
      const supplyTitle = hot.getDataAtRow(coords.row)[0];
      if (
        suppliesId != null &&
        suppliesId != undefined &&
        suppliesId != "null"
      ) {
        navigate(`/gst-returns/gstr3b/supplies-made`, {
          state: { suppliesId: suppliesId, title: supplyTitle },
        });
      }
    }
  }

  // ** Loading
  const loadFunction = (value) => {
    setBlock(value);
  };

  // ** Loading Export
  const loadFunctionExport = (value, fileName, selectedYear) => {
    setBlock(value);

  };

  let timers = '';

  // {cell change Functionaltiy for Validation }
  // const cellChange = (change, source) => {
  //   checkIsPresentData = change?.length ? true : false

  //   if (source === "CopyPaste.paste") document.body.classList.add("is-copy");

  //   if (
  //     source === "CopyPaste.paste" ||
  //     source === "edit" ||
  //     source === "Autofill.fill"
  //   ) {
  //     const hot = hotRef?.current?.hotInstance;
  //     let withoutErrArr = [];
  //     change.forEach(([row, col, oldValue, newValue]) => {
  //       if (row <= 5) {
  //         const sanitizedValue = typeof newValue === 'string' ? newValue.replace(/,/g, '') : newValue;
  //         if (oldValue != newValue) {

  //           if (col === "taxableValue" || col === "igst" || col === "cgst" || col === "sgst" || col === "cess") {
  //             hot?.setDataAtRowProp(row, hot?.colToProp(col), sanitizedValue);
  //           }
  //         }
  //         // The value to set Error
  //         const colIndex = handsontableColumns.findIndex(
  //           (obj) => obj.data === col
  //         );

  //         if (
  //           colIndex == 1 ||
  //           colIndex == 2 ||
  //           colIndex == 3 ||
  //           colIndex == 4 ||
  //           colIndex == 5
  //         ) {
  //           // const oldVal = change[i][2];
  //           const cellObj = {
  //             row: row,
  //             col: colIndex,
  //             table: "1 OutwardSupplies",
  //           };

  //           // Check if the edited value is numeric
  //           if (isNaN(sanitizedValue) && colIndex < 6 && row < 6) {
  //             setErrorArr((pre) => [...pre, cellObj]);
  //           } else {
  //             if (
  //               errorArr.findIndex(
  //                 (y) =>
  //                   y.row == cellObj.row &&
  //                   y.col == cellObj.col &&
  //                   y.table == cellObj.table
  //               ) != -1
  //             ) {
  //               withoutErrArr.push(cellObj);
  //             }
  //           }
  //         }
  //       }
  //     });


  //     if (withoutErrArr.length > 0) {
  //       const withErrArr = errorArr;
  //       const filteredArr = withErrArr.filter(
  //         (itemX) =>
  //           !withoutErrArr.some(
  //             (itemY) =>
  //               itemY.row === itemX.row &&
  //               itemY.col === itemX.col &&
  //               itemY.table === itemX.table
  //           )
  //       );
  //       setErrorArr(filteredArr);
  //     }
  //   }


  //   if (source !== "loadData" && change && change.length > 0) {
  //     const sessColumnIndex = 4;
  //     const cessColumnIndex = "cgst";
  //     for (const [row, col, oldValue, newValue] of change) {
  //       if (col === cessColumnIndex && oldValue != undefined) {

  //         const sessValue = newValue;
  //         if (!isNaN(sessValue)) {
  //           hotRef?.current?.hotInstance?.setDataAtCell(
  //             row,
  //             sessColumnIndex,
  //             sessValue
  //           );
  //         }
  //       }
  //     }
  //   }

  //   if (source !== "loadData" && change && change.length > 0) {
  //     for (const [row, col, oldValue, newValue] of change) {

  //       // for Taxable calcalation
  //       if (row === 0 && col == "taxableValue") {
  //         const initialValue = !Number.isNaN(parseFloat(
  //           hotRef?.current?.hotInstance?.getDataAtCell(row, 1)
  //         )) ? hotRef?.current?.hotInstance?.getDataAtCell(row, 1) : hotRef?.current?.hotInstance?.setDataAtCell(
  //           row,
  //           1,
  //           "0.00"
  //         );

  //         const row1 = parseFloat(
  //           hotRef?.current?.hotInstance?.getDataAtCell(1, 1)
  //         );

  //         const row2 = parseFloat(
  //           hotRef?.current?.hotInstance?.getDataAtCell(2, 1)
  //         );

  //         const row3 = parseFloat(
  //           hotRef?.current?.hotInstance?.getDataAtCell(3, 1)
  //         );

  //         const row4 = parseFloat(
  //           hotRef?.current?.hotInstance?.getDataAtCell(4, 1)
  //         );

  //         const A = initialValue + row1 + row2 + row3 + row4;

  //         if (!isNaN(A)) {
  //           hotRef?.current?.hotInstance?.setDataAtCell(
  //             5,
  //             1,
  //             A.toString()
  //           );
  //         }

  //       }

  //       if (row === 1 && col == "taxableValue") {
  //         const row0 = parseFloat(
  //           hotRef?.current?.hotInstance?.getDataAtCell(0, 1)
  //         );
  //         const initialValue = !Number.isNaN(parseFloat(
  //           hotRef?.current?.hotInstance?.getDataAtCell(row, 1)
  //         )) ? hotRef?.current?.hotInstance?.getDataAtCell(row, 1) : hotRef?.current?.hotInstance?.setDataAtCell(
  //           row,
  //           1,
  //           "0.00"
  //         );

  //         const row2 = parseFloat(
  //           hotRef?.current?.hotInstance?.getDataAtCell(2, 1)
  //         );

  //         const row3 = parseFloat(
  //           hotRef?.current?.hotInstance?.getDataAtCell(3, 1)
  //         );

  //         const row4 = parseFloat(
  //           hotRef?.current?.hotInstance?.getDataAtCell(4, 1)
  //         );

  //         const A = initialValue + row0 + row2 + row3 + row4;

  //         if (!isNaN(A)) {
  //           hotRef?.current?.hotInstance?.setDataAtCell(
  //             5,
  //             1,
  //             A.toString()
  //           );
  //         }

  //       }

  //       if (row === 2 && col == "taxableValue") {

  //         const row0 = parseFloat(
  //           hotRef?.current?.hotInstance?.getDataAtCell(0, 1)
  //         );

  //         const row1 = parseFloat(
  //           hotRef?.current?.hotInstance?.getDataAtCell(1, 1)
  //         );

  //         const initialValue = !Number.isNaN(parseFloat(
  //           hotRef?.current?.hotInstance?.getDataAtCell(row, 1)
  //         )) ? hotRef?.current?.hotInstance?.getDataAtCell(row, 1) : hotRef?.current?.hotInstance?.setDataAtCell(
  //           row,
  //           1,
  //           "0.00"
  //         );

  //         const row3 = parseFloat(
  //           hotRef?.current?.hotInstance?.getDataAtCell(3, 1)
  //         );

  //         const row4 = parseFloat(
  //           hotRef?.current?.hotInstance?.getDataAtCell(4, 1)
  //         );

  //         const A = initialValue + row0 + row1 + row3 + row4;

  //         if (!isNaN(A)) {
  //           hotRef?.current?.hotInstance?.setDataAtCell(
  //             5,
  //             1,
  //             A.toString()
  //           );
  //         }

  //       }

  //       if (row === 3 && col == "taxableValue") {

  //         const row0 = parseFloat(
  //           hotRef?.current?.hotInstance?.getDataAtCell(0, 1)
  //         );

  //         const row1 = parseFloat(
  //           hotRef?.current?.hotInstance?.getDataAtCell(1, 1)
  //         );


  //         const row2 = parseFloat(
  //           hotRef?.current?.hotInstance?.getDataAtCell(2, 1)
  //         );
  //         const initialValue = !Number.isNaN(parseFloat(
  //           hotRef?.current?.hotInstance?.getDataAtCell(row, 1)
  //         )) ? hotRef?.current?.hotInstance?.getDataAtCell(row, 1) : hotRef?.current?.hotInstance?.setDataAtCell(
  //           row,
  //           1,
  //           "0.00"
  //         );

  //         const row4 = parseFloat(
  //           hotRef?.current?.hotInstance?.getDataAtCell(4, 1)
  //         );

  //         const A = initialValue + row0 + row1 + row2 + row4;


  //         if (!isNaN(A)) {
  //           hotRef?.current?.hotInstance?.setDataAtCell(
  //             5,
  //             1,
  //             A.toString()
  //           );
  //         }

  //       }

  //       if (row === 4 && col == "taxableValue") {

  //         const row0 = parseFloat(
  //           hotRef?.current?.hotInstance?.getDataAtCell(0, 1)
  //         );

  //         const row1 = parseFloat(
  //           hotRef?.current?.hotInstance?.getDataAtCell(1, 1)
  //         );


  //         const row2 = parseFloat(
  //           hotRef?.current?.hotInstance?.getDataAtCell(2, 1)
  //         );


  //         const row3 = parseFloat(
  //           hotRef?.current?.hotInstance?.getDataAtCell(3, 1)
  //         );

  //         const initialValue = !Number.isNaN(parseFloat(
  //           hotRef?.current?.hotInstance?.getDataAtCell(row, 1)
  //         )) ? hotRef?.current?.hotInstance?.getDataAtCell(row, 1) : hotRef?.current?.hotInstance?.setDataAtCell(
  //           row,
  //           1,
  //           "0.00"
  //         );

  //         const A = initialValue + row0 + row2 + row3 + row1;


  //         if (!isNaN(A)) {
  //           hotRef?.current?.hotInstance?.setDataAtCell(
  //             5,
  //             1,
  //             A.toString()
  //           );
  //         }

  //       }

  //       // for IGST calculation

  //       if (row === 0 && col == "igst") {

  //         const initialValue = !Number.isNaN(parseFloat(
  //           hotRef?.current?.hotInstance?.getDataAtCell(row, 2)
  //         )) ? hotRef?.current?.hotInstance?.getDataAtCell(row, 2) : hotRef?.current?.hotInstance?.setDataAtCell(
  //           row,
  //           2,
  //           "0.00"
  //         );

  //         const row1 = parseFloat(
  //           hotRef?.current?.hotInstance?.getDataAtCell(1, 2)
  //         );

  //         const row2 = parseFloat(
  //           hotRef?.current?.hotInstance?.getDataAtCell(2, 2)
  //         );

  //         const row3 = parseFloat(
  //           hotRef?.current?.hotInstance?.getDataAtCell(3, 2)
  //         );

  //         const row4 = parseFloat(
  //           hotRef?.current?.hotInstance?.getDataAtCell(4, 2)
  //         );

  //         const A = initialValue + row1 + row2 + row3 + row4;

  //         if (!isNaN(A)) {
  //           hotRef?.current?.hotInstance?.setDataAtCell(
  //             5,
  //             2,
  //             A.toString()
  //           );
  //         }

  //       }

  //       if (row === 1 && col == "igst") {
  //         const row0 = parseFloat(
  //           hotRef?.current?.hotInstance?.getDataAtCell(0, 2)
  //         );
  //         const initialValue = !Number.isNaN(parseFloat(
  //           hotRef?.current?.hotInstance?.getDataAtCell(row, 2)
  //         )) ? hotRef?.current?.hotInstance?.getDataAtCell(row, 2) : hotRef?.current?.hotInstance?.setDataAtCell(
  //           row,
  //           2,
  //           "0.00"
  //         );

  //         const row2 = parseFloat(
  //           hotRef?.current?.hotInstance?.getDataAtCell(2, 2)
  //         );

  //         const row3 = parseFloat(
  //           hotRef?.current?.hotInstance?.getDataAtCell(3, 2)
  //         );

  //         const row4 = parseFloat(
  //           hotRef?.current?.hotInstance?.getDataAtCell(4, 2)
  //         );

  //         const A = initialValue + row0 + row2 + row3 + row4;


  //         if (!isNaN(A)) {
  //           hotRef?.current?.hotInstance?.setDataAtCell(
  //             5,
  //             2,
  //             A.toString()
  //           );
  //         }

  //       }

  //       if (row === 3 && col == "igst") {

  //         const row0 = parseFloat(
  //           hotRef?.current?.hotInstance?.getDataAtCell(0, 2)
  //         );

  //         const row1 = parseFloat(
  //           hotRef?.current?.hotInstance?.getDataAtCell(1, 2)
  //         );


  //         const row2 = parseFloat(
  //           hotRef?.current?.hotInstance?.getDataAtCell(2, 2)
  //         );
  //         const initialValue = !Number.isNaN(parseFloat(
  //           hotRef?.current?.hotInstance?.getDataAtCell(row, 2)
  //         )) ? hotRef?.current?.hotInstance?.getDataAtCell(row, 2) : hotRef?.current?.hotInstance?.setDataAtCell(
  //           row,
  //           2,
  //           "0.00"
  //         );

  //         const row4 = parseFloat(
  //           hotRef?.current?.hotInstance?.getDataAtCell(4, 2)
  //         );

  //         const A = initialValue + row0 + row1 + row2 + row4;


  //         if (!isNaN(A)) {
  //           hotRef?.current?.hotInstance?.setDataAtCell(
  //             5,
  //             2,
  //             A.toString()
  //           );
  //         }

  //       }

  //       // for CGST Calculation

  //       if (row === 0 && col == "cgst") {

  //         const initialValue = !Number.isNaN(parseFloat(
  //           hotRef?.current?.hotInstance?.getDataAtCell(row, 3)
  //         )) ? hotRef?.current?.hotInstance?.getDataAtCell(row, 3) : hotRef?.current?.hotInstance?.setDataAtCell(
  //           row,
  //           3,
  //           "0.00"
  //         );

  //         const row1 = parseFloat(
  //           hotRef?.current?.hotInstance?.getDataAtCell(1, 3)
  //         );

  //         const row2 = parseFloat(
  //           hotRef?.current?.hotInstance?.getDataAtCell(2, 3)
  //         );

  //         const row3 = parseFloat(
  //           hotRef?.current?.hotInstance?.getDataAtCell(3, 3)
  //         );

  //         const row4 = parseFloat(
  //           hotRef?.current?.hotInstance?.getDataAtCell(4, 3)
  //         );

  //         const A = initialValue + row1 + row2 + row3 + row4;

  //         if (!isNaN(A)) {
  //           hotRef?.current?.hotInstance?.setDataAtCell(
  //             5,
  //             3,
  //             A.toString()
  //           );
  //         }

  //       }

  //       if (row === 3 && col == "cgst") {

  //         const row0 = parseFloat(
  //           hotRef?.current?.hotInstance?.getDataAtCell(0, 3)
  //         );

  //         const row1 = parseFloat(
  //           hotRef?.current?.hotInstance?.getDataAtCell(1, 3)
  //         );


  //         const row2 = parseFloat(
  //           hotRef?.current?.hotInstance?.getDataAtCell(2, 3)
  //         );
  //         const initialValue = !Number.isNaN(parseFloat(
  //           hotRef?.current?.hotInstance?.getDataAtCell(row, 3)
  //         )) ? hotRef?.current?.hotInstance?.getDataAtCell(row, 3) : hotRef?.current?.hotInstance?.setDataAtCell(
  //           row,
  //           3,
  //           "0.00"
  //         );

  //         const row4 = parseFloat(
  //           hotRef?.current?.hotInstance?.getDataAtCell(4, 3)
  //         );

  //         const A = initialValue + row0 + row1 + row2 + row4;


  //         if (!isNaN(A)) {
  //           hotRef?.current?.hotInstance?.setDataAtCell(
  //             5,
  //             3,
  //             A.toString()
  //           );
  //         }

  //       }


  //       // for CESS Calcalation

  //       if (row === 0 && col == "cess") {

  //         const initialValue = !Number.isNaN(parseFloat(
  //           hotRef?.current?.hotInstance?.getDataAtCell(row, 5)
  //         )) ? hotRef?.current?.hotInstance?.getDataAtCell(row, 5) : hotRef?.current?.hotInstance?.setDataAtCell(
  //           row,
  //           5,
  //           "0.00"
  //         );

  //         const row1 = parseFloat(
  //           hotRef?.current?.hotInstance?.getDataAtCell(1, 5)
  //         );

  //         const row2 = parseFloat(
  //           hotRef?.current?.hotInstance?.getDataAtCell(2, 5)
  //         );

  //         const row3 = parseFloat(
  //           hotRef?.current?.hotInstance?.getDataAtCell(3, 5)
  //         );

  //         const row4 = parseFloat(
  //           hotRef?.current?.hotInstance?.getDataAtCell(4, 5)
  //         );

  //         const A = initialValue + row1 + row2 + row3 + row4;

  //         if (!isNaN(A)) {
  //           hotRef?.current?.hotInstance?.setDataAtCell(
  //             5,
  //             5,
  //             A.toString()
  //           );
  //         }

  //       }

  //       if (row === 1 && col == "cess") {
  //         const row0 = parseFloat(
  //           hotRef?.current?.hotInstance?.getDataAtCell(0, 5)
  //         );
  //         const initialValue = !Number.isNaN(parseFloat(
  //           hotRef?.current?.hotInstance?.getDataAtCell(row, 5)
  //         )) ? hotRef?.current?.hotInstance?.getDataAtCell(row, 5) : hotRef?.current?.hotInstance?.setDataAtCell(
  //           row,
  //           5,
  //           "0.00"
  //         );

  //         const row2 = parseFloat(
  //           hotRef?.current?.hotInstance?.getDataAtCell(2, 5)
  //         );

  //         const row3 = parseFloat(
  //           hotRef?.current?.hotInstance?.getDataAtCell(3, 5)
  //         );

  //         const row4 = parseFloat(
  //           hotRef?.current?.hotInstance?.getDataAtCell(4, 5)
  //         );

  //         const A = initialValue + row0 + row2 + row3 + row4;


  //         if (!isNaN(A)) {
  //           hotRef?.current?.hotInstance?.setDataAtCell(
  //             5,
  //             5,
  //             A.toString()
  //           );
  //         }

  //       }

  //       if (row === 3 && col == "cess") {

  //         const row0 = parseFloat(
  //           hotRef?.current?.hotInstance?.getDataAtCell(0, 5)
  //         );

  //         const row1 = parseFloat(
  //           hotRef?.current?.hotInstance?.getDataAtCell(1, 5)
  //         );


  //         const row2 = parseFloat(
  //           hotRef?.current?.hotInstance?.getDataAtCell(2, 5)
  //         );
  //         const initialValue = !Number.isNaN(parseFloat(
  //           hotRef?.current?.hotInstance?.getDataAtCell(row, 5)
  //         )) ? hotRef?.current?.hotInstance?.getDataAtCell(row, 5) : hotRef?.current?.hotInstance?.setDataAtCell(
  //           row,
  //           5,
  //           "0.00"
  //         );

  //         const row4 = parseFloat(
  //           hotRef?.current?.hotInstance?.getDataAtCell(4, 5)
  //         );

  //         const A = initialValue + row0 + row1 + row2 + row4;


  //         if (!isNaN(A)) {
  //           hotRef?.current?.hotInstance?.setDataAtCell(
  //             5,
  //             5,
  //             A.toString()
  //           );
  //         }

  //       }


  //     }
  //   }
  //   clearTimeout(timers);
  //   timers = setTimeout(() => {
  //     document.body.classList.remove("is-copy");
  //   }, 1);
  // };

  const cellChange = (change, source) => {
    if (
      (source === "edit" || source === "CopyPaste.paste" || source === "Autofill.fill") &&
      change &&
      change.length > 0
    ) {
      const oldData = [...outwardSuppliesDe];
      let withoutErrArr = []
      for (const [row, col, oldValue, newValue] of change) {
        let rowId = null;
        if (oldValue !== newValue) {
          if (col == "taxableValue") {
            rowId = 0
          } else if (col == "igst") {
            rowId = 1;
          } else if (col == "cgst") {
            rowId = 2;
          } else if (col == "sgst") {
            rowId = 3;
          } else if (col == "cess") {
            rowId = 4;
          }

          if (rowId >= 0) {
            let sanitizedValue =
              typeof newValue === "string" ? newValue.replace(/,/g, "") : newValue;
            sanitizedValue = sanitizedValue ? sanitizedValue.toString() : "0.00";
            oldData[row][col] = sanitizedValue;
            // The value to set Error
            const colIndex = handsontableColumns.findIndex((obj) => obj.data === col);
            if (colIndex == 1 || colIndex == 2 || colIndex == 3 || colIndex == 4 || colIndex == 5) {
              const cellObj = {
                row: row,
                col: colIndex,
                table: "1 OutwardSupplies",
              };
              // Check if the edited value is numeric
              if (isNaN(sanitizedValue) && colIndex < 6 && row < 6) {
                setErrorArr((pre) => [...pre, cellObj]);
              } else {
                if (errorArr.findIndex((y) =>
                      y.row == cellObj.row &&
                      y.col == cellObj.col &&
                      y.table == cellObj.table
                  ) != -1
                ) {
                  withoutErrArr.push(cellObj);
                }
              }
            }
          }

          if (source !== "loadData" && change && change.length > 0) {
            const sessColumnIndex = 4;
            const cessColumnIndex = "cgst";
            for (const [row, col, oldValue, newValue] of change) {
              if (col === cessColumnIndex && oldValue != undefined) {
                const sessValue = newValue;
                if (!isNaN(sessValue)) {
                  hotRef?.current?.hotInstance?.setDataAtCell(row,sessColumnIndex,sessValue);
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
                    itemY.col === itemX.col &&
                    itemY.table === itemX.table
                )
            );
            setErrorArr(filteredArr);
          }
          // for Taxable calcalation
          // if (row >= 0 && row <= 4) {
          if (rowId >= 0) {
            let total = 0;
            for (var x = 0; x <= 4; x++) {
              total += parseFloat(oldData[x][col]) ?? "0.00";
            }
            if (!isNaN(total)) {
              oldData[5][col] = total.toFixed(2).toString();
            }
          }
          // }
          setOutwardSuppliesDe(oldData);
        }
      }
    }
  }

  const cellChangeSubDetails = (change, source) => {
    checkIsPresentData = change?.length ? true : false

    if (source === "CopyPaste.paste") document.body.classList.add("is-copy");

    if (
      source === "CopyPaste.paste" ||
      source === "edit" ||
      source === "Autofill.fill"
    ) {
      const hot = hotRef2?.current?.hotInstance;
      let withoutErrArr = [];
      change.forEach(([row, col, oldValue, newValue]) => {
        if (row <= 2) {

          const sanitizedValue = typeof newValue === 'string' ? newValue.replace(/,/g, '') : newValue;
          if (oldValue != newValue) {

            if (col === "taxableValue" || col === "igst" || col === "cgst" || col === "sgst" || col === "cess") {
              hot?.setDataAtRowProp(row, hot?.colToProp(col), sanitizedValue);
            }
          }
          // The value to set Error
          const colIndex = handsontableColumns2.findIndex(
            (obj) => obj.data === col
          );

          if (
            colIndex == 1 ||
            colIndex == 2 ||
            colIndex == 3 ||
            colIndex == 4 ||
            colIndex == 5
          ) {
            const cellObj = {
              row: row,
              col: colIndex,
              table: "2 SubDetails",
            };
            // Check if the edited value is numeric
            if (isNaN(sanitizedValue) && colIndex < 6 && row < 2) {
              setErrorArr((pre) => [...pre, cellObj]);
            } else {
              if (
                errorArr.findIndex(
                  (y) =>
                    y.row == cellObj.row &&
                    y.col == cellObj.col &&
                    y.table == cellObj.table
                ) != -1
              ) {
                withoutErrArr.push(cellObj);
              }
            }
          }
        }
      });


      if (withoutErrArr.length > 0) {
        const withErrArr = errorArr;
        const filteredArr = withErrArr.filter(
          (itemX) =>
            !withoutErrArr.some(
              (itemY) =>
                itemY.row === itemX.row &&
                itemY.col === itemX.col &&
                itemY.table === itemX.table
            )
        );
        setErrorArr(filteredArr);
      }
    }




    if (source !== "loadData" && change && change.length > 0) {
      const sessColumnIndex = 4;
      const cessColumnIndex = "cgst";
      for (const [row, col, oldValue, newValue] of change) {
        if (col === cessColumnIndex && oldValue != undefined) {
          console.log(col, "coll");
          const sessValue = newValue;
          if (!isNaN(sessValue)) {
            hotRef2?.current?.hotInstance?.setDataAtCell(
              row,
              sessColumnIndex,
              sessValue
            );
          }
        }
      }
    }

    //   for the calculation purpose of each row
    if (source !== "loadData" && change && change.length > 0) {
      for (const [row, col, oldValue, newValue] of change) {
        // for the purpose of IGST
        if (row === 0 && col == "taxableValue") {
          // const initialValue = parseFloat(
          //   hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(row, 1)
          // );

          const initialValue = !Number.isNaN(parseFloat(
            hotRef2?.current?.hotInstance?.getDataAtCell(row, 1)
          )) ? hotRef2?.current?.hotInstance?.getDataAtCell(row, 1) : hotRef2?.current?.hotInstance?.setDataAtCell(
            row,
            1,
            "0.00"
          );

          const row1 = parseFloat(
            hotRef2?.current?.hotInstance?.getDataAtCell(1, 1)
          );
          const A = initialValue + row1;


          if (!isNaN(A)) {
            hotRef2?.current?.hotInstance?.setDataAtCell(
              2,
              1,
              A.toString()
            );

          }
        }
        if (row === 1 && col == "taxableValue") {

          const initialValue = !Number.isNaN(parseFloat(
            hotRef2?.current?.hotInstance?.getDataAtCell(row, 1)
          )) ? hotRef2?.current?.hotInstance?.getDataAtCell(row, 1) : hotRef2?.current?.hotInstance?.setDataAtCell(
            row,
            1,
            "0.00"
          );

          const row0 = parseFloat(
            hotRef2?.current?.hotInstance?.getDataAtCell(0, 1)
          );
          const A = initialValue + row0;


          if (!isNaN(A)) {
            hotRef2?.current?.hotInstance?.setDataAtCell(
              2,
              1,
              A.toString()
            );

          }
        }
        if (row === 0 && col == "igst") {

          const initialValue = !Number.isNaN(parseFloat(
            hotRef2?.current?.hotInstance?.getDataAtCell(row, 2)
          )) ? hotRef2?.current?.hotInstance?.getDataAtCell(row, 2) : hotRef2?.current?.hotInstance?.setDataAtCell(
            row,
            2,
            "0.00"
          );

          const row2 = parseFloat(
            hotRef2?.current?.hotInstance?.getDataAtCell(1, 2)
          );
          const A = initialValue + row2;


          if (!isNaN(A)) {
            hotRef2?.current?.hotInstance?.setDataAtCell(
              2,
              2,
              A.toString()
            );

          }
        }
        if (row === 1 && col == "igst") {


          const initialValue = !Number.isNaN(parseFloat(
            hotRef2?.current?.hotInstance?.getDataAtCell(row, 2)
          )) ? hotRef2?.current?.hotInstance?.getDataAtCell(row, 2) : hotRef2?.current?.hotInstance?.setDataAtCell(
            row,
            2,
            "0.00"
          );

          const row2 = parseFloat(
            hotRef2?.current?.hotInstance?.getDataAtCell(0, 2)
          );
          const A = initialValue + row2;


          if (!isNaN(A)) {
            hotRef2?.current?.hotInstance?.setDataAtCell(
              2,
              2,
              A.toString()
            );

          }
        }
        if (row === 0 && col == "cgst") {

          const initialValue = !Number.isNaN(parseFloat(
            hotRef2?.current?.hotInstance?.getDataAtCell(row, 3)
          )) ? hotRef2?.current?.hotInstance?.getDataAtCell(row, 3) : hotRef2?.current?.hotInstance?.setDataAtCell(
            row,
            3,
            "0.00"
          );

          const row3 = parseFloat(
            hotRef2?.current?.hotInstance?.getDataAtCell(1, 3)
          );
          const A = initialValue + row3;


          if (!isNaN(A)) {
            hotRef2?.current?.hotInstance?.setDataAtCell(
              2,
              3,
              A.toString()
            );

          }
        }
        if (row === 1 && col == "cgst") {

          const initialValue = !Number.isNaN(parseFloat(
            hotRef2?.current?.hotInstance?.getDataAtCell(row, 3)
          )) ? hotRef2?.current?.hotInstance?.getDataAtCell(row, 3) : hotRef2?.current?.hotInstance?.setDataAtCell(
            row,
            3,
            "0.00"
          );

          const row3 = parseFloat(
            hotRef2?.current?.hotInstance?.getDataAtCell(0, 3)
          );
          const A = initialValue + row3;


          if (!isNaN(A)) {
            hotRef2?.current?.hotInstance?.setDataAtCell(
              2,
              3,
              A.toString()
            );

          }
        }

        if (row === 0 && col == "cess") {

          const initialValue = !Number.isNaN(parseFloat(
            hotRef2?.current?.hotInstance?.getDataAtCell(row, 5)
          )) ? hotRef2?.current?.hotInstance?.getDataAtCell(row, 5) : hotRef2?.current?.hotInstance?.setDataAtCell(
            row,
            5,
            "0.00"
          );

          const row5 = parseFloat(
            hotRef2?.current?.hotInstance?.getDataAtCell(1, 5)
          );
          const A = initialValue + row5;
          

          if (!isNaN(A)) {
            hotRef2?.current?.hotInstance?.setDataAtCell(
              2,
              5,
              A.toString()
            );

          }
        }
        if (row === 1 && col == "cess") {


          const initialValue = !Number.isNaN(parseFloat(
            hotRef2?.current?.hotInstance?.getDataAtCell(row, 5)
          )) ? hotRef2?.current?.hotInstance?.getDataAtCell(row, 5) : hotRef2?.current?.hotInstance?.setDataAtCell(
            row,
            5,
            "0.00"
          );

          const row5 = parseFloat(
            hotRef2?.current?.hotInstance?.getDataAtCell(0, 5)
          );
          const A = initialValue + row5;
   

          if (!isNaN(A)) {
            hotRef2?.current?.hotInstance?.setDataAtCell(
              2,
              5,
              A.toString()
            );

          }
        }
      }
    }

    clearTimeout(timers);
    timers = setTimeout(() => {
      document.body.classList.remove("is-copy");
    }, 1);

  };

  // const cellChangeEligible = (change, source) => {
  //   if (change?.[0]?.[0] != 0 && change?.[0]?.[0] != 6 && change?.[0]?.[0] != 9 && change?.[0]?.[0] != 11) {
  //     checkIsPresentData = change?.length ? true : false
  //   }

  //   if (source === "CopyPaste.paste") document.body.classList.add("is-copy");

  //   if (
  //     source === "CopyPaste.paste" ||
  //     source === "edit" ||
  //     source === "Autofill.fill"
  //   ) {
  //     // debugger

  //     const hot = hotRefEligibeleITC?.current?.hotInstance;
  //     let withoutErrArr = [];
  //     let validateFlag = false;
  //     change.forEach(([row, col, oldValue, newValue]) => {
  //       if (row <= 14) {
  //         const sanitizedValue = typeof newValue === 'string' ? newValue.replace(/,/g, '') : newValue;
  //         if (oldValue != newValue) {
  //           console.log(col, "collll")
  //           console.log(oldValue, newValue, "newValue")
  //           if (col === "igst" || col === "cgst" || col === "sgst" || col === "cess") {
  //             hot?.setDataAtRowProp(row, hot?.colToProp(col), sanitizedValue);
  //           }
  //         }
  //         // The value to set Error
  //         const colIndex = eligbileColumns.findIndex(
  //           (obj) => obj.data === col
  //         );

  //         if (colIndex == 1 || colIndex == 2 || colIndex == 3 || colIndex == 4) {
  //           // const oldVal = change[i][2];
  //           const cellObj = {
  //             row: row,
  //             col: colIndex,
  //             table: "5 ChangeEligible",
  //           };
  //           // Check if the edited value is numeric
  //           if (isNaN(sanitizedValue) && colIndex < 6 && row < 15) {
  //             validateFlag = true;
  //             setErrorArr((pre) => [...pre, cellObj]);
  //           } else {
  //             if (
  //               errorArr.findIndex(
  //                 (y) =>
  //                   y.row == cellObj.row &&
  //                   y.col == cellObj.col &&
  //                   y.table == cellObj.table
  //               ) != -1
  //             ) {
  //               withoutErrArr.push(cellObj);
  //             }
  //           }
  //         }
  //       }
  //     });

  //     if (withoutErrArr.length > 0) {
  //       debugger
  //       const withErrArr = errorArr;
  //       const filteredArr = withErrArr.filter(
  //         (itemX) =>
  //           !withoutErrArr.some(
  //             (itemY) =>
  //               itemY.row === itemX.row &&
  //               itemY.col === itemX.col &&
  //               itemY.table === itemX.table
  //           )
  //       );
  //       setErrorArr(filteredArr);
  //     }
  //   }

  //   if (source !== "loadData" && change && change.length > 0) {
  //     const sessColumnIndex = 3;
  //     const cessColumnIndex = "cgst";
  //     for (const [row, col, oldValue, newValue] of change) {
  //       console.log(row, "rowrowrowrowrow");
  //       if (col === cessColumnIndex && row != 8 && row != 10 && row != 14) {
  //         console.log(col, "coll");
  //         const sessValue = newValue;
  //         if (!isNaN(sessValue)) {
  //           hotRefEligibeleITC?.current?.hotInstance?.setDataAtCell(
  //             row,
  //             sessColumnIndex,
  //             sessValue
  //           );
  //         }
  //       }
  //     }
  //   }

  //   //   for the calculation purpose of each row
  //   if (source !== "loadData" && change && change.length > 0) {
  //     for (const [row, col, oldValue, newValue] of change) {
  //       // for the purpose of IGST

  //       if (row === 1 && col == "igst") {
  //         // const initialValue = parseFloat(
  //         //   hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(row, 1)
  //         // );

  //         const initialValue = !Number.isNaN(parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(row, 1)
  //         )) ? hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(row, 1) : hotRefEligibeleITC?.current?.hotInstance?.setDataAtCell(
  //           row,
  //           1,
  //           "0.00"
  //         );

  //         const row2 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(2, 1)
  //         );
  //         const row3 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(3, 1)
  //         );
  //         const row4 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(4, 1)
  //         );
  //         const row5 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(5, 1)
  //         );
  //         const row7 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(7, 1)
  //         );
  //         const row8 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(8, 1)
  //         );
  //         const A = initialValue + row2 + row3 + row4 + row5;
  //         const B = row7 + row8;
  //         const actualData = A - B;
  //         if (!isNaN(actualData)) {
  //           hotRefEligibeleITC?.current?.hotInstance?.setDataAtCell(
  //             10,
  //             1,
  //             actualData.toString()
  //           );
  //           hotRefEligibeleITC?.current?.hotInstance?.setDataAtCell(
  //             14,
  //             1,
  //             actualData.toString()
  //           );
  //         }
  //       }

  //       if (row === 2 && col == "igst") {
  //         const row1 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(1, 1)
  //         );
  //         // const initialValue = parseFloat(
  //         //   hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(row, 1)
  //         // );

  //         const initialValue = !Number.isNaN(parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(row, 1)
  //         )) ? hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(row, 1) : hotRefEligibeleITC?.current?.hotInstance?.setDataAtCell(
  //           row,
  //           1,
  //           "0.00"
  //         );

  //         const row3 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(3, 1)
  //         );
  //         const row4 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(4, 1)
  //         );
  //         const row5 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(5, 1)
  //         );
  //         const row7 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(7, 1)
  //         );
  //         const row8 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(8, 1)
  //         );
  //         const A = row1 + initialValue + row3 + row4 + row5;
  //         const B = row7 + row8;
  //         const actualData = A - B;
  //         if (!isNaN(actualData)) {
  //           hotRefEligibeleITC?.current?.hotInstance?.setDataAtCell(
  //             10,
  //             1,
  //             actualData.toString()
  //           );
  //           hotRefEligibeleITC?.current?.hotInstance?.setDataAtCell(
  //             14,
  //             1,
  //             actualData.toString()
  //           );
  //         }
  //       }

  //       if (row === 3 && col == "igst") {
  //         const row1 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(1, 1)
  //         );
  //         const row2 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(2, 1)
  //         );
  //         // const initialValue = parseFloat(
  //         //   hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(row, 1)
  //         // );

  //         const initialValue = !Number.isNaN(parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(row, 1)
  //         )) ? hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(row, 1) : hotRefEligibeleITC?.current?.hotInstance?.setDataAtCell(
  //           row,
  //           1,
  //           "0.00"
  //         );

  //         const row4 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(4, 1)
  //         );
  //         const row5 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(5, 1)
  //         );
  //         const row7 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(7, 1)
  //         );
  //         const row8 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(8, 1)
  //         );
  //         const A = row1 + row2 + initialValue + row4 + row5;
  //         const B = row7 + row8;
  //         const actualData = A - B;
  //         if (!isNaN(actualData)) {
  //           hotRefEligibeleITC?.current?.hotInstance?.setDataAtCell(
  //             10,
  //             1,
  //             actualData.toString()
  //           );
  //           hotRefEligibeleITC?.current?.hotInstance?.setDataAtCell(
  //             14,
  //             1,
  //             actualData.toString()
  //           );
  //         }
  //       }

  //       if (row === 4 && col == "igst") {
  //         const row1 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(1, 1)
  //         );
  //         const row2 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(2, 1)
  //         );
  //         const row3 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(3, 1)
  //         );
  //         // const initialValue = parseFloat(
  //         //   hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(row, 1)
  //         // );

  //         const initialValue = !Number.isNaN(parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(row, 1)
  //         )) ? hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(row, 1) : hotRefEligibeleITC?.current?.hotInstance?.setDataAtCell(
  //           row,
  //           1,
  //           "0.00"
  //         );

  //         const row5 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(5, 1)
  //         );
  //         const row7 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(7, 1)
  //         );
  //         const row8 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(8, 1)
  //         );
  //         const A = row1 + row2 + row3 + initialValue + row5;
  //         const B = row7 + row8;
  //         const actualData = A - B;
  //         if (!isNaN(actualData)) {
  //           hotRefEligibeleITC?.current?.hotInstance?.setDataAtCell(
  //             10,
  //             1,
  //             actualData.toString()
  //           );
  //           hotRefEligibeleITC?.current?.hotInstance?.setDataAtCell(
  //             14,
  //             1,
  //             actualData.toString()
  //           );
  //         }
  //       }

  //       if (row === 5 && col == "igst") {
  //         const row1 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(1, 1)
  //         );
  //         const row2 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(2, 1)
  //         );
  //         const row3 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(3, 1)
  //         );
  //         const row4 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(4, 1)
  //         );
  //         // const initialValue = parseFloat(
  //         //   hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(row, 1)
  //         // );

  //         const initialValue = !Number.isNaN(parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(row, 1)
  //         )) ? hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(row, 1) : hotRefEligibeleITC?.current?.hotInstance?.setDataAtCell(
  //           row,
  //           1,
  //           "0.00"
  //         );

  //         const row7 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(7, 1)
  //         );
  //         const row8 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(8, 1)
  //         );
  //         const A = row1 + row2 + row3 + row4 + initialValue;
  //         const B = row7 + row8;
  //         const actualData = A - B;
  //         if (!isNaN(actualData)) {
  //           hotRefEligibeleITC?.current?.hotInstance?.setDataAtCell(
  //             10,
  //             1,
  //             actualData.toString()
  //           );
  //           hotRefEligibeleITC?.current?.hotInstance?.setDataAtCell(
  //             14,
  //             1,
  //             actualData.toString()
  //           );
  //         }
  //       }

  //       if (row === 7 && col == "igst") {
  //         const row1 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(1, 1)
  //         );
  //         const row2 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(2, 1)
  //         );
  //         const row3 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(3, 1)
  //         );
  //         const row4 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(4, 1)
  //         );
  //         const row5 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(5, 1)
  //         );
  //         // const initialValue = parseFloat(
  //         //   hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(row, 1)
  //         // );
  //         const initialValue = !Number.isNaN(parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(row, 1)
  //         )) ? hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(row, 1) : hotRefEligibeleITC?.current?.hotInstance?.setDataAtCell(
  //           row,
  //           1,
  //           "0.00"
  //         );
  //         const row8 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(8, 1)
  //         );
  //         const A = row1 + row2 + row3 + row4 + row5;
  //         const B = initialValue + row8;
  //         const actualData = A - B;
  //         if (!isNaN(actualData)) {
  //           hotRefEligibeleITC?.current?.hotInstance?.setDataAtCell(
  //             10,
  //             1,
  //             actualData.toString()
  //           );
  //           hotRefEligibeleITC?.current?.hotInstance?.setDataAtCell(
  //             14,
  //             1,
  //             actualData.toString()
  //           );
  //         }
  //       }

  //       if (row === 8 && col == "igst") {
  //         const row1 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(1, 1)
  //         );
  //         const row2 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(2, 1)
  //         );
  //         const row3 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(3, 1)
  //         );
  //         const row4 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(4, 1)
  //         );
  //         const row5 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(5, 1)
  //         );
  //         const row7 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(7, 1)
  //         );
  //         const initialValue = !Number.isNaN(parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(row, 1)
  //         )) ? hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(row, 1) : hotRefEligibeleITC?.current?.hotInstance?.setDataAtCell(
  //           row,
  //           1,
  //           "0.00"
  //         );
  //         const A = row1 + row2 + row3 + row4 + row5;
  //         const B = row7 + initialValue;
  //         const actualData = A - B;
  //         if (!isNaN(actualData)) {
  //           hotRefEligibeleITC?.current?.hotInstance?.setDataAtCell(
  //             10,
  //             1,
  //             actualData.toString()
  //           );
  //           hotRefEligibeleITC?.current?.hotInstance?.setDataAtCell(
  //             14,
  //             1,
  //             actualData.toString()
  //           );
  //         }
  //       }

  //       // for the purpose of CGST

  //       if (row === 1 && col == "cgst") {
  //         // const initialValue = parseFloat(
  //         //   hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(row, 2)
  //         // );
  //         const initialValue = !Number.isNaN(parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(row, 2)
  //         )) ? hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(row, 2) : hotRefEligibeleITC?.current?.hotInstance?.setDataAtCell(
  //           row,
  //           2,
  //           "0.00"
  //         );
  //         const row2 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(2, 2)
  //         );
  //         const row3 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(3, 2)
  //         );
  //         const row4 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(4, 2)
  //         );
  //         const row5 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(5, 2)
  //         );
  //         const row7 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(7, 2)
  //         );
  //         const row8 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(8, 2)
  //         );
  //         const A = initialValue + row2 + row3 + row4 + row5;
  //         const B = row7 + row8;
  //         const actualData = A - B;
  //         if (!isNaN(actualData)) {
  //           hotRefEligibeleITC?.current?.hotInstance?.setDataAtCell(
  //             10,
  //             2,
  //             actualData.toString()
  //           );
  //           hotRefEligibeleITC?.current?.hotInstance?.setDataAtCell(
  //             14,
  //             2,
  //             actualData.toString()
  //           );
  //         }
  //       }

  //       if (row === 2 && col == "cgst") {
  //         const row1 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(1, 2)
  //         );
  //         // const initialValue = parseFloat(
  //         //   hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(row, 2)
  //         // );
  //         const initialValue = !Number.isNaN(parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(row, 2)
  //         )) ? hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(row, 2) : hotRefEligibeleITC?.current?.hotInstance?.setDataAtCell(
  //           row,
  //           2,
  //           "0.00"
  //         );
  //         const row3 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(3, 2)
  //         );
  //         const row4 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(4, 2)
  //         );
  //         const row5 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(5, 2)
  //         );
  //         const row7 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(7, 2)
  //         );
  //         const row8 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(8, 2)
  //         );
  //         const A = row1 + initialValue + row3 + row4 + row5;
  //         const B = row7 + row8;
  //         const actualData = A - B;
  //         if (!isNaN(actualData)) {
  //           hotRefEligibeleITC?.current?.hotInstance?.setDataAtCell(
  //             10,
  //             2,
  //             actualData.toString()
  //           );
  //           hotRefEligibeleITC?.current?.hotInstance?.setDataAtCell(
  //             14,
  //             2,
  //             actualData.toString()
  //           );
  //         }
  //       }

  //       if (row === 3 && col == "cgst") {
  //         const row1 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(1, 2)
  //         );
  //         const row2 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(2, 2)
  //         );
  //         // const initialValue = parseFloat(
  //         //   hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(row, 2)
  //         // );
  //         const initialValue = !Number.isNaN(parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(row, 2)
  //         )) ? hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(row, 2) : hotRefEligibeleITC?.current?.hotInstance?.setDataAtCell(
  //           row,
  //           2,
  //           "0.00"
  //         );
  //         const row4 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(4, 2)
  //         );
  //         const row5 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(5, 2)
  //         );
  //         const row7 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(7, 2)
  //         );
  //         const row8 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(8, 2)
  //         );
  //         const A = row1 + row2 + initialValue + row4 + row5;
  //         const B = row7 + row8;
  //         const actualData = A - B;
  //         if (!isNaN(actualData)) {
  //           hotRefEligibeleITC?.current?.hotInstance?.setDataAtCell(
  //             10,
  //             2,
  //             actualData.toString()
  //           );
  //           hotRefEligibeleITC?.current?.hotInstance?.setDataAtCell(
  //             14,
  //             2,
  //             actualData.toString()
  //           );
  //         }
  //       }

  //       if (row === 4 && col == "cgst") {
  //         const row1 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(1, 2)
  //         );
  //         const row2 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(2, 2)
  //         );
  //         const row3 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(3, 2)
  //         );
  //         // const initialValue = parseFloat(
  //         //   hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(row, 2)
  //         // );
  //         const initialValue = !Number.isNaN(parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(row, 2)
  //         )) ? hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(row, 2) : hotRefEligibeleITC?.current?.hotInstance?.setDataAtCell(
  //           row,
  //           2,
  //           "0.00"
  //         );
  //         const row5 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(5, 2)
  //         );
  //         const row7 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(7, 2)
  //         );
  //         const row8 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(8, 2)
  //         );
  //         const A = row1 + row2 + row3 + initialValue + row5;
  //         const B = row7 + row8;
  //         const actualData = A - B;
  //         if (!isNaN(actualData)) {
  //           hotRefEligibeleITC?.current?.hotInstance?.setDataAtCell(
  //             10,
  //             2,
  //             actualData.toString()
  //           );
  //           hotRefEligibeleITC?.current?.hotInstance?.setDataAtCell(
  //             14,
  //             2,
  //             actualData.toString()
  //           );
  //         }
  //       }

  //       if (row === 5 && col == "cgst") {
  //         const row1 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(1, 2)
  //         );
  //         const row2 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(2, 2)
  //         );
  //         const row3 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(3, 2)
  //         );
  //         const row4 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(4, 2)
  //         );
  //         // const initialValue = parseFloat(
  //         //   hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(row, 2)
  //         // );
  //         const initialValue = !Number.isNaN(parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(row, 2)
  //         )) ? hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(row, 2) : hotRefEligibeleITC?.current?.hotInstance?.setDataAtCell(
  //           row,
  //           2,
  //           "0.00"
  //         );
  //         const row7 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(7, 2)
  //         );
  //         const row8 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(8, 2)
  //         );
  //         const A = row1 + row2 + row3 + row4 + initialValue;
  //         const B = row7 + row8;
  //         const actualData = A - B;
  //         if (!isNaN(actualData)) {
  //           hotRefEligibeleITC?.current?.hotInstance?.setDataAtCell(
  //             10,
  //             2,
  //             actualData.toString()
  //           );
  //           hotRefEligibeleITC?.current?.hotInstance?.setDataAtCell(
  //             14,
  //             2,
  //             actualData.toString()
  //           );
  //         }
  //       }

  //       if (row === 7 && col == "cgst") {
  //         const row1 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(1, 2)
  //         );
  //         const row2 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(2, 2)
  //         );
  //         const row3 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(3, 2)
  //         );
  //         const row4 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(4, 2)
  //         );
  //         const row5 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(5, 2)
  //         );
  //         // const initialValue = parseFloat(
  //         //   hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(row, 2)
  //         // );
  //         const initialValue = !Number.isNaN(parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(row, 2)
  //         )) ? hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(row, 2) : hotRefEligibeleITC?.current?.hotInstance?.setDataAtCell(
  //           row,
  //           2,
  //           "0.00"
  //         );
  //         const row8 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(8, 2)
  //         );
  //         const A = row1 + row2 + row3 + row4 + row5;
  //         const B = initialValue + row8;
  //         const actualData = A - B;
  //         if (!isNaN(actualData)) {
  //           hotRefEligibeleITC?.current?.hotInstance?.setDataAtCell(
  //             10,
  //             2,
  //             actualData.toString()
  //           );
  //           hotRefEligibeleITC?.current?.hotInstance?.setDataAtCell(
  //             14,
  //             2,
  //             actualData.toString()
  //           );
  //         }
  //       }

  //       if (row === 8 && col == "cgst") {
  //         const row1 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(1, 2)
  //         );
  //         const row2 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(2, 2)
  //         );
  //         const row3 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(3, 2)
  //         );
  //         const row4 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(4, 2)
  //         );
  //         const row5 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(5, 2)
  //         );
  //         const row7 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(7, 2)
  //         );
  //         // const initialValue = parseFloat(
  //         //   hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(row, 2)
  //         // );
  //         const initialValue = !Number.isNaN(parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(row, 2)
  //         )) ? hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(row, 2) : hotRefEligibeleITC?.current?.hotInstance?.setDataAtCell(
  //           row,
  //           2,
  //           "0.00"
  //         );
  //         const A = row1 + row2 + row3 + row4 + row5;
  //         const B = row7 + initialValue;
  //         const actualData = A - B;
  //         if (!isNaN(actualData)) {
  //           hotRefEligibeleITC?.current?.hotInstance?.setDataAtCell(
  //             10,
  //             2,
  //             actualData.toString()
  //           );
  //           hotRefEligibeleITC?.current?.hotInstance?.setDataAtCell(
  //             14,
  //             2,
  //             actualData.toString()
  //           );
  //         }
  //       }

  //       // for the purpose of CGST

  //       if (row === 1 && col == "sgst") {
  //         // const initialValue = parseFloat(
  //         //   hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(row, 3)
  //         // );
  //         const initialValue = !Number.isNaN(parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(row, 3)
  //         )) ? hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(row, 3) : hotRefEligibeleITC?.current?.hotInstance?.setDataAtCell(
  //           row,
  //           3,
  //           "0.00"
  //         );
  //         const row2 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(2, 3)
  //         );
  //         const row3 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(3, 3)
  //         );
  //         const row4 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(4, 3)
  //         );
  //         const row5 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(5, 3)
  //         );
  //         const row7 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(7, 3)
  //         );
  //         const row8 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(8, 3)
  //         );
  //         const A = initialValue + row2 + row3 + row4 + row5;
  //         const B = row7 + row8;
  //         const actualData = A - B;
  //         if (!isNaN(actualData)) {
  //           hotRefEligibeleITC?.current?.hotInstance?.setDataAtCell(
  //             10,
  //             3,
  //             actualData.toString()
  //           );
  //           hotRefEligibeleITC?.current?.hotInstance?.setDataAtCell(
  //             14,
  //             3,
  //             actualData.toString()
  //           );
  //         }
  //       }

  //       if (row === 2 && col == "sgst") {
  //         const row1 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(1, 3)
  //         );
  //         // const initialValue = parseFloat(
  //         //   hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(row, 3)
  //         // );
  //         const initialValue = !Number.isNaN(parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(row, 3)
  //         )) ? hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(row, 3) : hotRefEligibeleITC?.current?.hotInstance?.setDataAtCell(
  //           row,
  //           3,
  //           "0.00"
  //         );
  //         const row3 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(3, 3)
  //         );
  //         const row4 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(4, 3)
  //         );
  //         const row5 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(5, 3)
  //         );
  //         const row7 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(7, 3)
  //         );
  //         const row8 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(8, 3)
  //         );
  //         const A = row1 + initialValue + row3 + row4 + row5;
  //         const B = row7 + row8;
  //         const actualData = A - B;
  //         if (!isNaN(actualData)) {
  //           hotRefEligibeleITC?.current?.hotInstance?.setDataAtCell(
  //             10,
  //             3,
  //             actualData.toString()
  //           );
  //           hotRefEligibeleITC?.current?.hotInstance?.setDataAtCell(
  //             14,
  //             3,
  //             actualData.toString()
  //           );
  //         }
  //       }

  //       if (row === 3 && col == "sgst") {
  //         const row1 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(1, 3)
  //         );
  //         const row2 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(2, 3)
  //         );
  //         // const initialValue = parseFloat(
  //         //   hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(row, 3)
  //         // );
  //         const initialValue = !Number.isNaN(parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(row, 3)
  //         )) ? hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(row, 3) : hotRefEligibeleITC?.current?.hotInstance?.setDataAtCell(
  //           row,
  //           3,
  //           "0.00"
  //         );
  //         const row4 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(4, 3)
  //         );
  //         const row5 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(5, 3)
  //         );
  //         const row7 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(7, 3)
  //         );
  //         const row8 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(8, 3)
  //         );
  //         const A = row1 + row2 + initialValue + row4 + row5;
  //         const B = row7 + row8;
  //         const actualData = A - B;
  //         if (!isNaN(actualData)) {
  //           hotRefEligibeleITC?.current?.hotInstance?.setDataAtCell(
  //             10,
  //             3,
  //             actualData.toString()
  //           );
  //           hotRefEligibeleITC?.current?.hotInstance?.setDataAtCell(
  //             14,
  //             3,
  //             actualData.toString()
  //           );
  //         }
  //       }

  //       if (row === 4 && col == "sgst") {
  //         const row1 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(1, 3)
  //         );
  //         const row2 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(2, 3)
  //         );
  //         const row3 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(3, 3)
  //         );
  //         // const initialValue = parseFloat(
  //         //   hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(row, 3)
  //         // );
  //         const initialValue = !Number.isNaN(parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(row, 3)
  //         )) ? hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(row, 3) : hotRefEligibeleITC?.current?.hotInstance?.setDataAtCell(
  //           row,
  //           3,
  //           "0.00"
  //         );
  //         const row5 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(5, 3)
  //         );
  //         const row7 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(7, 3)
  //         );
  //         const row8 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(8, 3)
  //         );
  //         const A = row1 + row2 + row3 + initialValue + row5;
  //         const B = row7 + row8;
  //         const actualData = A - B;
  //         if (!isNaN(actualData)) {
  //           hotRefEligibeleITC?.current?.hotInstance?.setDataAtCell(
  //             10,
  //             3,
  //             actualData.toString()
  //           );
  //           hotRefEligibeleITC?.current?.hotInstance?.setDataAtCell(
  //             14,
  //             3,
  //             actualData.toString()
  //           );
  //         }
  //       }

  //       if (row === 5 && col == "sgst") {
  //         const row1 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(1, 3)
  //         );
  //         const row2 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(2, 3)
  //         );
  //         const row3 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(3, 3)
  //         );
  //         const row4 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(4, 3)
  //         );
  //         // const initialValue = parseFloat(
  //         //   hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(row, 3)
  //         // );
  //         const initialValue = !Number.isNaN(parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(row, 3)
  //         )) ? hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(row, 3) : hotRefEligibeleITC?.current?.hotInstance?.setDataAtCell(
  //           row,
  //           3,
  //           "0.00"
  //         );
  //         const row7 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(7, 3)
  //         );
  //         const row8 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(8, 3)
  //         );
  //         const A = row1 + row2 + row3 + row4 + initialValue;
  //         const B = row7 + row8;
  //         const actualData = A - B;
  //         if (!isNaN(actualData)) {
  //           hotRefEligibeleITC?.current?.hotInstance?.setDataAtCell(
  //             10,
  //             3,
  //             actualData.toString()
  //           );
  //           hotRefEligibeleITC?.current?.hotInstance?.setDataAtCell(
  //             14,
  //             3,
  //             actualData.toString()
  //           );
  //         }
  //       }

  //       if (row === 7 && col == "sgst") {
  //         const row1 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(1, 3)
  //         );
  //         const row2 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(2, 3)
  //         );
  //         const row3 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(3, 3)
  //         );
  //         const row4 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(4, 3)
  //         );
  //         const row5 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(5, 3)
  //         );
  //         // const initialValue = parseFloat(
  //         //   hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(row, 3)
  //         // );
  //         const initialValue = !Number.isNaN(parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(row, 3)
  //         )) ? hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(row, 3) : hotRefEligibeleITC?.current?.hotInstance?.setDataAtCell(
  //           row,
  //           3,
  //           "0.00"
  //         );
  //         const row8 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(8, 3)
  //         );
  //         const A = row1 + row2 + row3 + row4 + row5;
  //         const B = initialValue + row8;
  //         const actualData = A - B;
  //         if (!isNaN(actualData)) {
  //           hotRefEligibeleITC?.current?.hotInstance?.setDataAtCell(
  //             10,
  //             3,
  //             actualData.toString()
  //           );
  //           hotRefEligibeleITC?.current?.hotInstance?.setDataAtCell(
  //             14,
  //             3,
  //             actualData.toString()
  //           );
  //         }
  //       }

  //       if (row === 8 && col == "sgst") {
  //         const row1 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(1, 3)
  //         );
  //         const row2 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(2, 3)
  //         );
  //         const row3 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(3, 3)
  //         );
  //         const row4 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(4, 3)
  //         );
  //         const row5 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(5, 3)
  //         );
  //         const row7 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(7, 3)
  //         );
  //         // const initialValue = parseFloat(
  //         //   hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(row, 3)
  //         // );
  //         const initialValue = !Number.isNaN(parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(row, 3)
  //         )) ? hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(row, 3) : hotRefEligibeleITC?.current?.hotInstance?.setDataAtCell(
  //           row,
  //           3,
  //           "0.00"
  //         );
  //         const A = row1 + row2 + row3 + row4 + row5;
  //         const B = row7 + initialValue;
  //         const actualData = A - B;
  //         if (!isNaN(actualData)) {
  //           hotRefEligibeleITC?.current?.hotInstance?.setDataAtCell(
  //             10,
  //             3,
  //             actualData.toString()
  //           );
  //           hotRefEligibeleITC?.current?.hotInstance?.setDataAtCell(
  //             14,
  //             3,
  //             actualData.toString()
  //           );
  //         }
  //       }

  //       //   fo the purpose of CESS

  //       if (row === 1 && col == "cess") {
  //         // const initialValue = parseFloat(
  //         //   hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(row, 4)
  //         // );
  //         const initialValue = !Number.isNaN(parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(row, 4)
  //         )) ? hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(row, 4) : hotRefEligibeleITC?.current?.hotInstance?.setDataAtCell(
  //           row,
  //           4,
  //           "0.00"
  //         );
  //         const row2 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(2, 4)
  //         );
  //         const row3 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(3, 4)
  //         );
  //         const row4 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(4, 4)
  //         );
  //         const row5 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(5, 4)
  //         );
  //         const row7 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(7, 4)
  //         );
  //         const row8 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(8, 4)
  //         );
  //         const A = initialValue + row2 + row3 + row4 + row5;
  //         const B = row7 + row8;
  //         const actualData = A - B;
  //         if (!isNaN(actualData)) {
  //           hotRefEligibeleITC?.current?.hotInstance?.setDataAtCell(
  //             10,
  //             4,
  //             actualData.toString()
  //           );
  //           hotRefEligibeleITC?.current?.hotInstance?.setDataAtCell(
  //             14,
  //             4,
  //             actualData.toString()
  //           );
  //         }
  //       }

  //       if (row === 2 && col == "cess") {
  //         const row1 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(1, 4)
  //         );
  //         // const initialValue = parseFloat(
  //         //   hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(row, 4)
  //         // );
  //         const initialValue = !Number.isNaN(parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(row, 4)
  //         )) ? hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(row, 4) : hotRefEligibeleITC?.current?.hotInstance?.setDataAtCell(
  //           row,
  //           4,
  //           "0.00"
  //         );
  //         const row3 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(3, 4)
  //         );
  //         const row4 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(4, 4)
  //         );
  //         const row5 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(5, 4)
  //         );
  //         const row7 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(7, 4)
  //         );
  //         const row8 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(8, 4)
  //         );
  //         const A = row1 + initialValue + row3 + row4 + row5;
  //         const B = row7 + row8;
  //         const actualData = A - B;
  //         if (!isNaN(actualData)) {
  //           hotRefEligibeleITC?.current?.hotInstance?.setDataAtCell(
  //             10,
  //             4,
  //             actualData.toString()
  //           );
  //           hotRefEligibeleITC?.current?.hotInstance?.setDataAtCell(
  //             14,
  //             4,
  //             actualData.toString()
  //           );
  //         }
  //       }

  //       if (row === 3 && col == "cess") {
  //         const row1 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(1, 4)
  //         );
  //         const row2 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(2, 4)
  //         );
  //         // const initialValue = parseFloat(
  //         //   hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(row, 4)
  //         // );
  //         const initialValue = !Number.isNaN(parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(row, 4)
  //         )) ? hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(row, 4) : hotRefEligibeleITC?.current?.hotInstance?.setDataAtCell(
  //           row,
  //           4,
  //           "0.00"
  //         );
  //         const row4 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(4, 4)
  //         );
  //         const row5 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(5, 4)
  //         );
  //         const row7 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(7, 4)
  //         );
  //         const row8 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(8, 4)
  //         );
  //         const A = row1 + row2 + initialValue + row4 + row5;
  //         const B = row7 + row8;
  //         const actualData = A - B;
  //         if (!isNaN(actualData)) {
  //           hotRefEligibeleITC?.current?.hotInstance?.setDataAtCell(
  //             10,
  //             4,
  //             actualData.toString()
  //           );
  //           hotRefEligibeleITC?.current?.hotInstance?.setDataAtCell(
  //             14,
  //             4,
  //             actualData.toString()
  //           );
  //         }
  //       }

  //       if (row === 4 && col == "cess") {
  //         const row1 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(1, 4)
  //         );
  //         const row2 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(2, 4)
  //         );
  //         const row3 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(3, 4)
  //         );
  //         // const initialValue = parseFloat(
  //         //   hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(row, 4)
  //         // );
  //         const initialValue = !Number.isNaN(parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(row, 4)
  //         )) ? hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(row, 4) : hotRefEligibeleITC?.current?.hotInstance?.setDataAtCell(
  //           row,
  //           4,
  //           "0.00"
  //         );
  //         const row5 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(5, 4)
  //         );
  //         const row7 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(7, 4)
  //         );
  //         const row8 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(8, 4)
  //         );
  //         const A = row1 + row2 + row3 + initialValue + row5;
  //         const B = row7 + row8;
  //         const actualData = A - B;
  //         if (!isNaN(actualData)) {
  //           hotRefEligibeleITC?.current?.hotInstance?.setDataAtCell(
  //             10,
  //             4,
  //             actualData.toString()
  //           );
  //           hotRefEligibeleITC?.current?.hotInstance?.setDataAtCell(
  //             14,
  //             4,
  //             actualData.toString()
  //           );
  //         }
  //       }

  //       if (row === 5 && col == "cess") {
  //         const row1 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(1, 4)
  //         );
  //         const row2 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(2, 4)
  //         );
  //         const row3 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(3, 4)
  //         );
  //         const row4 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(4, 4)
  //         );
  //         // const initialValue = parseFloat(
  //         //   hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(row, 4)
  //         // );
  //         const initialValue = !Number.isNaN(parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(row, 4)
  //         )) ? hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(row, 4) : hotRefEligibeleITC?.current?.hotInstance?.setDataAtCell(
  //           row,
  //           4,
  //           "0.00"
  //         );
  //         const row7 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(7, 4)
  //         );
  //         const row8 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(8, 4)
  //         );
  //         const A = row1 + row2 + row3 + row4 + initialValue;
  //         const B = row7 + row8;
  //         const actualData = A - B;
  //         if (!isNaN(actualData)) {
  //           hotRefEligibeleITC?.current?.hotInstance?.setDataAtCell(
  //             10,
  //             4,
  //             actualData.toString()
  //           );
  //           hotRefEligibeleITC?.current?.hotInstance?.setDataAtCell(
  //             14,
  //             4,
  //             actualData.toString()
  //           );
  //         }
  //       }

  //       if (row === 7 && col == "cess") {
  //         const row1 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(1, 4)
  //         );
  //         const row2 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(2, 4)
  //         );
  //         const row3 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(3, 4)
  //         );
  //         const row4 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(4, 4)
  //         );
  //         const row5 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(5, 4)
  //         );
  //         // const initialValue = parseFloat(
  //         //   hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(row, 4)
  //         // );
  //         const initialValue = !Number.isNaN(parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(row, 4)
  //         )) ? hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(row, 4) : hotRefEligibeleITC?.current?.hotInstance?.setDataAtCell(
  //           row,
  //           4,
  //           "0.00"
  //         );
  //         const row8 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(8, 4)
  //         );
  //         const A = row1 + row2 + row3 + row4 + row5;
  //         const B = initialValue + row8;
  //         const actualData = A - B;
  //         if (!isNaN(actualData)) {
  //           hotRefEligibeleITC?.current?.hotInstance?.setDataAtCell(
  //             10,
  //             4,
  //             actualData.toString()
  //           );
  //           hotRefEligibeleITC?.current?.hotInstance?.setDataAtCell(
  //             14,
  //             4,
  //             actualData.toString()
  //           );
  //         }
  //       }

  //       if (row === 8 && col == "cess") {
  //         const row1 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(1, 4)
  //         );
  //         const row2 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(2, 4)
  //         );
  //         const row3 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(3, 4)
  //         );
  //         const row4 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(4, 4)
  //         );
  //         const row5 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(5, 4)
  //         );
  //         const row7 = parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(7, 4)
  //         );
  //         // const initialValue = parseFloat(
  //         //   hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(row, 4)
  //         // );
  //         const initialValue = !Number.isNaN(parseFloat(
  //           hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(row, 4)
  //         )) ? hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(row, 4) : hotRefEligibeleITC?.current?.hotInstance?.setDataAtCell(
  //           row,
  //           4,
  //           "0.00"
  //         );
  //         const A = row1 + row2 + row3 + row4 + row5;
  //         const B = row7 + initialValue;
  //         const actualData = A - B;
  //         if (!isNaN(actualData)) {
  //           hotRefEligibeleITC?.current?.hotInstance?.setDataAtCell(
  //             10,
  //             4,
  //             actualData.toString()
  //           );
  //           hotRefEligibeleITC?.current?.hotInstance?.setDataAtCell(
  //             14,
  //             4,
  //             actualData.toString()
  //           );
  //         }
  //       }
  //     }
  //   }

  //   clearTimeout(timers);
  //   timers = setTimeout(() => {
  //     document.body.classList.remove("is-copy");
  //   }, 1);
  // };


  const cellChangeEligible = (change, source) => {
    if (validSourceStates.includes(source) && change && change.length > 0) {

      const oldData = [...eligibleITCsDe];

      for (const [row, col, oldValue, newValue] of change) {
        let withoutErrArr = []
        
        const colIndex = eligbileColumns.findIndex((obj) => obj.data === col);
        if (colIndex == 1 || colIndex == 2 || colIndex == 3 || colIndex == 4) {
          const cellObj = {
            row: row,
            col: colIndex,
            table: "5 ChangeEligible",
          };
          // Check if the edited value is numeric
          if (isNaN(newValue) && colIndex < 6 && row < 15) {
            // validateFlag = true;
            setErrorArr((pre) => [...pre, cellObj]);
          } else  setErrorArr((pre) =>pre.filter((p) => !(p.row === cellObj.row && p.col === cellObj.col && p.table === cellObj.table))
          );
        }

        if (withoutErrArr.length > 0) {
          const withErrArr = errorArr;
          const filteredArr = withErrArr.filter(
            (itemX) =>
              !withoutErrArr.some(
                (itemY) =>
                  itemY.row === itemX.row &&
                  itemY.col === itemX.col &&
                  itemY.table === itemX.table
              )
          );
          setErrorArr(filteredArr);
        }
        if (colIndex > 0 && !(row == 0 || row == 6 || row == 9 || row == 11)) {

          if (validChangeType.includes(typeof newValue)) {
            oldData[row][col] = sanitizeValue(newValue);

            let totalForP = 0;
            for (let i = 0; i <= 8; i++) {
              const element = oldData[i];

              if (+element[col]) {
                if (i != 0 && i != 6 && i != 9 && i != 11) {
                  if ([7, 8].includes(i)) {
                    totalForP -= parseFloat(element[col]);
                  } else {
                    totalForP += parseFloat(element[col]);
                  }
                }
              }
            }
            oldData[10][col] = sanitizeValue(totalForP);
            oldData[14][col] = sanitizeValue(totalForP);
            setEligibleITCsDe(oldData);
          }
        }
      }
    }
    if (source !== "loadData" && change && change.length > 0) {
      const sessColumnIndex = 3;
      const cessColumnIndex = "cgst";
      for (const [row, col, oldValue, newValue] of change) {
        if (col === cessColumnIndex && row != 8 && row != 10 && row != 14) {
          const sessValue = newValue;
          if (!isNaN(sessValue)) {
            hotRefEligibeleITC?.current?.hotInstance?.setDataAtCell(
              row,
              sessColumnIndex,
              sessValue
            );
          }
        }
      }
    }
  };



  const cellChangeOfExempt = (change, source) => {
    checkIsPresentData = change?.length ? true : false

    if (source === "CopyPaste.paste") document.body.classList.add("is-copy");
    if (
      source === "CopyPaste.paste" ||
      source === "edit" ||
      source === "Autofill.fill"
    ) {
      const hot = hotRefExempt?.current?.hotInstance;
      let validateFlag = false;
      let withoutErrArr = [];



      change.forEach(([row, col, oldValue, newValue]) => {
        if (row <= 2) {
          const sanitizedValue = typeof newValue === 'string' ? newValue.replace(/,/g, '') : newValue;
          if (oldValue != newValue) {
            console.log(col, "collll")
            console.log(oldValue, newValue, "newValue")
            if (col === "interStateSupplies" || col === "intraStateSupplies") {
              hot?.setDataAtRowProp(row, hot?.colToProp(col), sanitizedValue);
            }
          }
          // The value to set Error
          const colIndex = exemptColumns.findIndex(
            (obj) => obj.data === col
          );

          if (
            colIndex == 1 ||
            colIndex == 2 ||
            colIndex == 3 ||
            colIndex == 4 ||
            colIndex == 5
          ) {
            // const oldVal = change[i][2];
            const cellObj = {
              row: row,
              col: colIndex,
              table: "6 ChangeOfExempt",
            };
            console.log(cellObj, "vallluuuuueeeee")
            // Check if the edited value is numeric
            if (isNaN(sanitizedValue) && colIndex < 3 && row < 3) {
              setErrorArr((pre) => [...pre, cellObj]);
            } else {
              if (
                errorArr.findIndex(
                  (y) =>
                    y.row == cellObj.row &&
                    y.col == cellObj.col &&
                    y.table == cellObj.table
                ) != -1
              ) {
                withoutErrArr.push(cellObj);
              }
            }
          }
        }
      });


      if (withoutErrArr.length > 0) {
        const withErrArr = errorArr;
        const filteredArr = withErrArr.filter(
          (itemX) =>
            !withoutErrArr.some(
              (itemY) =>
                itemY.row === itemX.row &&
                itemY.col === itemX.col &&
                itemY.table === itemX.table
            )
        );
        setErrorArr(filteredArr);
      }
    }

    if (source !== "loadData" && change && change.length > 0) {
      const sessColumnIndex = 4;
      const cessColumnIndex = "cgst";
      for (const [row, col, oldValue, newValue] of change) {
        if (col === cessColumnIndex && oldValue != undefined) {
          console.log(col, "coll");
          const sessValue = newValue;
          if (!isNaN(sessValue)) {
            hotRefExempt?.current?.hotInstance?.setDataAtCell(
              row,
              sessColumnIndex,
              sessValue
            );
          }
        }
      }
    }
    //   for the calculation purpose of each row
    if (source !== "loadData" && change && change.length > 0) {
      for (const [row, col, oldValue, newValue] of change) {
        if (row === 0 && col == "interStateSupplies") {
          // const initialValue = parseFloat(
          //   hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(row, 1)
          // );

          const initialValue = !Number.isNaN(parseFloat(
            hotRefExempt?.current?.hotInstance?.getDataAtCell(row, 1)
          )) ? hotRefExempt?.current?.hotInstance?.getDataAtCell(row, 1) : hotRefExempt?.current?.hotInstance?.setDataAtCell(
            row,
            1,
            "0.00"
          );

          const row1 = parseFloat(
            hotRefExempt?.current?.hotInstance?.getDataAtCell(1, 1)
          );
          const A = initialValue + row1;


          if (!isNaN(A)) {
            hotRefExempt?.current?.hotInstance?.setDataAtCell(
              2,
              1,
              A.toString()
            );

          }
        }
        if (row === 1 && col == "interStateSupplies") {
          // const initialValue = parseFloat(
          //   hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(row, 1)
          // );

          const initialValue = !Number.isNaN(parseFloat(
            hotRefExempt?.current?.hotInstance?.getDataAtCell(row, 1)
          )) ? hotRefExempt?.current?.hotInstance?.getDataAtCell(row, 1) : hotRefExempt?.current?.hotInstance?.setDataAtCell(
            row,
            1,
            "0.00"
          );

          const row0 = parseFloat(
            hotRefExempt?.current?.hotInstance?.getDataAtCell(0, 1)
          );
          const A = initialValue + row0;


          if (!isNaN(A)) {
            hotRefExempt?.current?.hotInstance?.setDataAtCell(
              2,
              1,
              A.toString()
            );

          }
        }
        if (row === 0 && col == "intraStateSupplies") {
          // const initialValue = parseFloat(
          //   hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(row, 1)
          // );

          const initialValue = !Number.isNaN(parseFloat(
            hotRefExempt?.current?.hotInstance?.getDataAtCell(row, 2)
          )) ? hotRefExempt?.current?.hotInstance?.getDataAtCell(row, 2) : hotRefExempt?.current?.hotInstance?.setDataAtCell(
            row,
            2,
            "0.00"
          );

          const row2 = parseFloat(
            hotRefExempt?.current?.hotInstance?.getDataAtCell(1, 2)
          );
          const A = initialValue + row2;


          if (!isNaN(A)) {
            hotRefExempt?.current?.hotInstance?.setDataAtCell(
              2,
              2,
              A.toString()
            );

          }
        }
        if (row === 1 && col == "intraStateSupplies") {
          // const initialValue = parseFloat(
          //   hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(row, 1)
          // );

          const initialValue = !Number.isNaN(parseFloat(
            hotRefExempt?.current?.hotInstance?.getDataAtCell(row, 2)
          )) ? hotRefExempt?.current?.hotInstance?.getDataAtCell(row, 2) : hotRefExempt?.current?.hotInstance?.setDataAtCell(
            row,
            2,
            "0.00"
          );

          const row2 = parseFloat(
            hotRefExempt?.current?.hotInstance?.getDataAtCell(0, 2)
          );
          const A = initialValue + row2;


          if (!isNaN(A)) {
            hotRefExempt?.current?.hotInstance?.setDataAtCell(
              2,
              2,
              A.toString()
            );

          }
        }
      }
    }
    clearTimeout(timers);
    timers = setTimeout(() => {
      document.body.classList.remove("is-copy");
    }, 1);

  };

  const cellChangeLateFee = (change, source) => {
    checkIsPresentData = change?.length ? true : false

    if (source === "CopyPaste.paste") document.body.classList.add("is-copy");
    if (
      source === "CopyPaste.paste" ||
      source === "edit" ||
      source === "Autofill.fill"
    ) {
      const hot = hotRefIntersetLateFee?.current?.hotInstance;
      let validateFlag = false;
      let withoutErrArr = [];

      change.forEach(([row, col, oldValue, newValue]) => {
        if (row <= 2) {
          const sanitizedValue = typeof newValue === 'string' ? newValue.replace(/,/g, '') : newValue;
          if (oldValue != newValue) {
            console.log(col, "collll")
            console.log(oldValue, newValue, "newValue")
            if (col === "igst" || col === "cgst" || col === "sgst" || col === "cess") {
              hot?.setDataAtRowProp(row, hot?.colToProp(col), sanitizedValue);
            }
          }
          // The value to set Error
          const colIndex = eligbileColumns.findIndex(
            (obj) => obj.data === col
          );

          if (
            colIndex == 1 ||
            colIndex == 2 ||
            colIndex == 3 ||
            colIndex == 4 ||
            colIndex == 5
          ) {
            // const oldVal = change[i][2];
            const cellObj = {
              row: row,
              col: colIndex,
              table: "7 ChangeLateFee",
            };
            console.log(cellObj, "vallluuuuueeeee")
            // Check if the edited value is numeric
            if (isNaN(sanitizedValue) && colIndex < 5 && row < 3) {
              setErrorArr((pre) => [...pre, cellObj]);
            } else {
              if (
                errorArr.findIndex(
                  (y) =>
                    y.row == cellObj.row &&
                    y.col == cellObj.col &&
                    y.table == cellObj.table
                ) != -1
              ) {
                withoutErrArr.push(cellObj);
              }
            }
          }
        }
      });


      if (withoutErrArr.length > 0) {
        const withErrArr = errorArr;
        const filteredArr = withErrArr.filter(
          (itemX) =>
            !withoutErrArr.some(
              (itemY) =>
                itemY.row === itemX.row &&
                itemY.col === itemX.col &&
                itemY.table === itemX.table
            )
        );
        setErrorArr(filteredArr);
      }
    }
    if (source !== "loadData" && change && change.length > 0) {
      const sessColumnIndex = 3;
      const cessColumnIndex = "cgst";
      for (const [row, col, oldValue, newValue] of change) {

        if (col === cessColumnIndex && oldValue != undefined) {
          const sessValue = newValue;
          if (!isNaN(sessValue)) {
            hotRefIntersetLateFee?.current?.hotInstance?.setDataAtCell(
              row,
              sessColumnIndex,
              sessValue
            );
          }
        }
      }
    }
    //   for the calculation purpose of each row
    if (source !== "loadData" && change && change.length > 0) {
      for (const [row, col, oldValue, newValue] of change) {
        if (row === 0 && col == "igst") {


          const initialValue = !Number.isNaN(parseFloat(
            hotRefIntersetLateFee?.current?.hotInstance?.getDataAtCell(row, 1)
          )) ? hotRefIntersetLateFee?.current?.hotInstance?.getDataAtCell(row, 1) : hotRefIntersetLateFee?.current?.hotInstance?.setDataAtCell(
            row,
            1,
            "0.00"
          );

          const row1 = parseFloat(
            hotRefIntersetLateFee?.current?.hotInstance?.getDataAtCell(1, 1)
          );
          const A = initialValue + row1;


          if (!isNaN(A)) {
            hotRefIntersetLateFee?.current?.hotInstance?.setDataAtCell(
              2,
              1,
              A.toString()
            );

          }
        }
        if (row === 1 && col == "igst") {


          const initialValue = !Number.isNaN(parseFloat(
            hotRefIntersetLateFee?.current?.hotInstance?.getDataAtCell(row, 1)
          )) ? hotRefIntersetLateFee?.current?.hotInstance?.getDataAtCell(row, 1) : hotRefIntersetLateFee?.current?.hotInstance?.setDataAtCell(
            row,
            1,
            "0.00"
          );

          const row0 = parseFloat(
            hotRefIntersetLateFee?.current?.hotInstance?.getDataAtCell(0, 1)
          );
          const A = initialValue + row0;


          if (!isNaN(A)) {
            hotRefIntersetLateFee?.current?.hotInstance?.setDataAtCell(
              2,
              1,
              A.toString()
            );

          }
        }

        if (row === 0 && col == "cgst") {


          const initialValue = !Number.isNaN(parseFloat(
            hotRefIntersetLateFee?.current?.hotInstance?.getDataAtCell(row, 2)
          )) ? hotRefIntersetLateFee?.current?.hotInstance?.getDataAtCell(row, 2) : hotRefIntersetLateFee?.current?.hotInstance?.setDataAtCell(
            row,
            2,
            "0.00"
          );

          const row2 = parseFloat(
            hotRefIntersetLateFee?.current?.hotInstance?.getDataAtCell(1, 2)
          );
          const A = initialValue + row2;


          if (!isNaN(A)) {
            hotRefIntersetLateFee?.current?.hotInstance?.setDataAtCell(
              2,
              2,
              A.toString()
            );

          }
        }
        if (row === 1 && col == "cgst") {


          const initialValue = !Number.isNaN(parseFloat(
            hotRefIntersetLateFee?.current?.hotInstance?.getDataAtCell(row, 2)
          )) ? hotRefIntersetLateFee?.current?.hotInstance?.getDataAtCell(row, 2) : hotRefIntersetLateFee?.current?.hotInstance?.setDataAtCell(
            row,
            2,
            "0.00"
          );

          const row2 = parseFloat(
            hotRefIntersetLateFee?.current?.hotInstance?.getDataAtCell(0, 2)
          );
          const A = initialValue + row2;


          if (!isNaN(A)) {
            hotRefIntersetLateFee?.current?.hotInstance?.setDataAtCell(
              2,
              2,
              A.toString()
            );

          }
        }

        if (row === 0 && col == "sgst") {

          const initialValue = !Number.isNaN(parseFloat(
            hotRefIntersetLateFee?.current?.hotInstance?.getDataAtCell(row, 3)
          )) ? hotRefIntersetLateFee?.current?.hotInstance?.getDataAtCell(row, 3) : hotRefIntersetLateFee?.current?.hotInstance?.setDataAtCell(
            row,
            3,
            "0.00"
          );

          const row3 = parseFloat(
            hotRefIntersetLateFee?.current?.hotInstance?.getDataAtCell(1, 3)
          );
          const A = initialValue + row3;
          console.log(A, "BBBBB")

          if (!isNaN(A)) {
            hotRefIntersetLateFee?.current?.hotInstance?.setDataAtCell(
              2,
              3,
              A.toString()
            );

          }
        }
        if (row === 1 && col == "sgst") {
          // const initialValue = parseFloat(
          //   hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(row, 1)
          // );

          const initialValue = !Number.isNaN(parseFloat(
            hotRefIntersetLateFee?.current?.hotInstance?.getDataAtCell(row, 3)
          )) ? hotRefIntersetLateFee?.current?.hotInstance?.getDataAtCell(row, 3) : hotRefIntersetLateFee?.current?.hotInstance?.setDataAtCell(
            row,
            3,
            "0.00"
          );

          const row3 = parseFloat(
            hotRefIntersetLateFee?.current?.hotInstance?.getDataAtCell(0, 3)
          );
          const A = initialValue + row3;


          if (!isNaN(A)) {
            hotRefIntersetLateFee?.current?.hotInstance?.setDataAtCell(
              2,
              3,
              A.toString()
            );

          }
        }

        if (row === 0 && col == "cess") {
          // const initialValue = parseFloat(
          //   hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(row, 1)
          // );

          const initialValue = !Number.isNaN(parseFloat(
            hotRefIntersetLateFee?.current?.hotInstance?.getDataAtCell(row, 4)
          )) ? hotRefIntersetLateFee?.current?.hotInstance?.getDataAtCell(row, 4) : hotRefIntersetLateFee?.current?.hotInstance?.setDataAtCell(
            row,
            4,
            "0.00"
          );

          const row2 = parseFloat(
            hotRefIntersetLateFee?.current?.hotInstance?.getDataAtCell(1, 4)
          );
          const A = initialValue + row2;


          if (!isNaN(A)) {
            hotRefIntersetLateFee?.current?.hotInstance?.setDataAtCell(
              2,
              4,
              A.toString()
            );

          }
        }
        if (row === 1 && col == "cess") {
          // const initialValue = parseFloat(
          //   hotRefEligibeleITC?.current?.hotInstance?.getDataAtCell(row, 1)
          // );

          const initialValue = !Number.isNaN(parseFloat(
            hotRefIntersetLateFee?.current?.hotInstance?.getDataAtCell(row, 4)
          )) ? hotRefIntersetLateFee?.current?.hotInstance?.getDataAtCell(row, 4) : hotRefIntersetLateFee?.current?.hotInstance?.setDataAtCell(
            row,
            4,
            "0.00"
          );

          const row2 = parseFloat(
            hotRefIntersetLateFee?.current?.hotInstance?.getDataAtCell(0, 4)
          );
          const A = initialValue + row2;


          if (!isNaN(A)) {
            hotRefIntersetLateFee?.current?.hotInstance?.setDataAtCell(
              2,
              4,
              A.toString()
            );

          }
        }

      }
    }
    clearTimeout(timers);
    timers = setTimeout(() => {
      document.body.classList.remove("is-copy");
    }, 1);

  };


  // {Redirection to the Payment page}
  const onClickPaymentPage = () => {
    navigate("/gst-returns/gstr3b/payment-page");
  };
  // {Redirection to the computation page}

  const onClickcomputation = () => {
    checkIsSaveData = true;

    if (checkIsPresentData) {
      return MySwal.fire({
        title: "Do you want to save data?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes",
        customClass: {
          confirmButton: "btn btn-danger",
          cancelButton: "btn btn-outline-dark ms-1",
        },
        buttonsStyling: false,
        allowOutsideClick: false,
      }).then(function (result) {
        if (result.value) {
          onClickSaveButtonGSTR3bDetails();
        }
      });
    }
    navigate("/gst-returns/gstr3b/computation-tax");
  };


  const onClickSaveButtonGSTR3bDetails = () => {
    // checkIsSaveData=false;
    function getCurrentServerDate() {
      const currentDate = new Date();
      const month = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // Month ranges from 0 to 11
      const year = currentDate.getFullYear().toString();

      return month + year;
    }

    let errorArray = [];
    const givenDate = gstr3BToDt; // Example: April 2025
    const serverDate = getCurrentServerDate(); // Example: March 2023
    const isGreater = compareDates(givenDate, serverDate);
    console.log(isGreater, "isGreater");

    errorArr &&
      errorArr
        .sort((a, b) => (a.table > b.table ? 1 : -1))
        .map((err) => {
          if (
            err.table == "1 OutwardSupplies" &&
            outwardSuppliesDe[err.row] != undefined
          ) {
            var val =
              outwardSuppliesDe[err.row][handsontableColumns[err.col].data];
            if (isNaN(val)) {
              errorArray.push({
                tableName: "Outward Supplies Table",
                rowNo: err.row,
              });
            }
          } else if (
            err.table == "2 SubDetails" &&
            supplyDetailsDe[err.row] != undefined
          ) {
            var val =
              supplyDetailsDe[err.row][handsontableColumns2[err.col].data];
            if (isNaN(val)) {
              errorArray.push({
                tableName: "Sub Details Table",
                rowNo: err.row,
              });
            }
          } else if (
            err.table == "4 ChangeOfSupplies" &&
            suppliesDe[err.row] != undefined
          ) {
            var val = suppliesDe[err.row][handsontableColumns3[err.col].data];
            if (isNaN(val)) {
              errorArray.push({
                tableName: "Change Of Supplies Table",
                rowNo: err.row,
              });
            }
          } else if (
            err.table == "5 ChangeEligible" &&
            eligibleITCsDe[err.row] != undefined
          ) {
            var val = eligibleITCsDe[err.row][eligbileColumns[err.col].data];

            if (isNaN(val)) {
              errorArray.push({
                tableName: "Change Eligible Table",
                rowNo: err.row,
              });
            }
          } else if (
            err.table == "6 ChangeOfExempt" &&
            nilRatedDe[err.row] != undefined
          ) {
            var val = nilRatedDe[err.row][exemptColumns[err.col].data];
            if (isNaN(val)) {
              errorArray.push({
                tableName: "Change Of Exempt Table",
                rowNo: err.row,
              });
            }
          } else if (
            err.table == "7 ChangeLateFee" &&
            lateFeeDe[err.row] != undefined
          ) {
            var val =
              lateFeeDe[err.row][intersetAndLateFeesColumn[err.col].data];
            if (isNaN(val)) {
              errorArray.push({
                tableName: "Change Late Fee Table",
                rowNo: err.row,
              });
            }
          }
        });

    if (isGreater) {
      // alert("Do not Predict Future from now")
      toast.error(
        "Please change the Date and Month, Do Not Judge for the Future",
        {
          position: "top-right",
        }
      );
    } else {
      if (errorArray.length > 0) {
        return MySwal.fire({
          title: "<strong>Error</strong>",
          icon: "error",
          html: <ErrorTable errorDataList={errorArray}></ErrorTable>,
          customClass: {
            confirmButton: "btn btn-danger",
          },
          buttonsStyling: false,
          width: 600,
        });
      } else {
        setBlock(true);

        const payLoad = {
          userClientId: G_UCParId,
          userId: LocalFunction.getLocalValue(globleVariable.userId, true),
          range: gstr3BToDt,
          // outwardSupplies: outwardSupplies,
          outwardSupplies: outwardSuppliesDe,
          // suppliesDetails: supplyDetails,
          suppliesDetails: supplyDetailsDe,
          eligibleITC: eligibleITCsDe,
          nilRated: nilRatedDe,
          lateFee: lateFeeDe,
        };
        console.log(payLoad, "payLoadpayLoadpayLoadpayLoad");
        GSTR3Services.gstr3bSaveDataAPI(payLoad)
          .then((res) => {
            console.log(res?.data, "resCheck");
            console.log(res?.status, "resCheck");
            if (
              res?.status === 200 &&
              res.data.status === errorCodeConfig.APIDefaultCode.Success
            ) {
              setBlock(false);
              setSaveThenSearch(true);
              toast.success(res.data.successMessage, {
                position: "top-right",
              });
              PurchaseSummaryService();
              setErrorArr([]);

              if (checkIsPresentData && checkIsSaveData) {
                navigate("/gst-returns/gstr3b/computation-tax");
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
          });
      }
    }
  };

  useEffect(() => {
    if (savethenSearch == true) {
      let hotTable = hotRef?.current?.hotInstance;
      hotTable.deselectCell();
    }
  }, [savethenSearch]);

  const testRef = useRef(null);

  const onClickGSTR2bButton = () => {
    setBlock(true);
    setIsGetRecoData(false);
    GSTR3Services.getGSTR2bDetailsForGSTR3bPage(G_UCParId, gstr3BToDt, G_GSTIN, subscriptionId)
      .then((res) => {
        if (
          res.status === 200 &&
          res.data.status === errorCodeConfig.APIDefaultCode.Success
        ) {
          setSaveThenSearch(false);
          setBlock(false);
          setEligibleITCsDe(
            res?.data?.data?.data.length > 0 && res?.data?.data?.data.map((ele) => ({
              cess: ele?.cess,
              cgst: ele?.cgst,
              description: ele?.description,
              details: ele?.details,
              igst: ele.igst,
              interStateSupplies: ele.interStateSupplies,
              intraStateSupplies: ele.intraStateSupplies,
              natureOfSupplies: ele.natureOfSupplies,
              placeOfSupply: ele.placeOfSupply,
              // sgst:ele.cgst,
              sgst: ele.sgst,
              taxableValue: ele.taxableValue,
              type: ele.type,
              typeText: ele.typeText,
            }))
          );
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
            confirmButton: "btn btn-danger",
          },
          buttonsStyling: false,
        });
      });
  };

  const getGSTR2bPurchaseDAta = () => {
    setBlock(true);
    setIsGetRecoData(false);
    GSTR3Services.getGSTR2bPurchaseData(G_UCParId, gstr3BToDt, G_GSTIN)
      .then((res) => {
        if (
          res.status === 200 &&
          res.data.status === errorCodeConfig.APIDefaultCode.Success
        ) {
          console.log(res?.data?.data, "Ressssss");
          setSaveThenSearch(false);
          setBlock(false);
          setEligibleITCsDe(
            res?.data?.data.map((ele) => ({
              cess: ele?.cess,
              cgst: ele?.cgst,
              description: ele?.description,
              details: ele?.details,
              igst: ele.igst,
              interStateSupplies: ele.interStateSupplies,
              intraStateSupplies: ele.intraStateSupplies,
              natureOfSupplies: ele.natureOfSupplies,
              placeOfSupply: ele.placeOfSupply,
              // sgst:ele.cgst,
              sgst: ele.sgst,
              taxableValue: ele.taxableValue,
              type: ele.type,
              typeText: ele.typeText,
            }))
          );
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
            confirmButton: "btn btn-danger",
          },
          buttonsStyling: false,
        });
      });
  };

  const getReconcillationData = () => {
    setBlock(true);
    GSTR3Services.getReconcillationDataforGSTR3b(G_UCParId, gstr3BToDt, subscriptionId, G_GSTIN)
      .then((res) => {
        if (
          res.status === 200 &&
          res.data.status === errorCodeConfig.APIDefaultCode.Success
        ) {
          console.log(res?.data?.data, "Ressssss");
          setSaveThenSearch(false);
          setBlock(false);
          setIsGetRecoData(true);
          setEligibleITCsDe(
            res?.data?.data.map((ele) => ({
              cess: ele?.cess,
              cgst: ele?.cgst,
              description: ele?.description,
              details: ele?.details,
              igst: ele.igst,
              interStateSupplies: ele.interStateSupplies,
              intraStateSupplies: ele.intraStateSupplies,
              natureOfSupplies: ele.natureOfSupplies,
              placeOfSupply: ele.placeOfSupply,
              // sgst:ele.cgst,
              sgst: ele.sgst,
              taxableValue: ele.taxableValue,
              type: ele.type,
              typeText: ele.typeText,
            }))
          );
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
            confirmButton: "btn btn-danger",
          },
          buttonsStyling: false,
        });
      });
  };

  const selectGSTR2bData = (value) => {
    setGstOption(value);
  };

  useEffect(() => {
    if (gstOption !== null && gstOption?.value == 1) {
      onClickGSTR2bButton();
    } else if (gstOption !== null && gstOption?.value == 2) {
      // console.log("nothingnothingnothing")
      getGSTR2bPurchaseDAta();
    } else if (gstOption !== null && gstOption?.value == 3) {
      console.log("nothingnothingnothing");
      getReconcillationData();
    } else {
      // Do Nothing
    }
  }, [gstOption, monthFrom]);

  const onClickgetLateFeeData = () => {
    setBlock(true);
    GSTR3Services.getLateFeeData(G_UCParId, gstr3BToDt, gstr3BToDt, subscriptionId, UserId)
      .then((res) => {

        if (res.data.status === errorCodeConfig.APIDefaultCode.GovtOTPExpire) {
          console.log("true")
          setMsgDisplay(res?.data?.errorMessage)
          setBlock(false);
          // loadFunction(false);
          setComposeOpen(true)
        }
        else {
          if (
            res.status === 200 &&
            res.data.status === errorCodeConfig.APIDefaultCode.Success
          ) {
            // setSaveThenSearch(false);
            setBlock(false);
            console.log(res?.data?.data, "res?.data?.data")
            setLateFeeDe(
              res?.data?.data?.lateFee.map((ele) => ({
                cess: ele?.cess,
                cgst: ele?.cgst,
                description: ele?.description,
                details: ele?.details,
                igst: ele.igst,
                interStateSupplies: ele.interStateSupplies,
                intraStateSupplies: ele.intraStateSupplies,
                natureOfSupplies: ele.natureOfSupplies,
                placeOfSupply: ele.placeOfSupply,
                // sgst:ele.cgst,
                sgst: ele.sgst,
                taxableValue: ele.taxableValue,
                type: ele.type,
                typeText: ele.typeText,
              }))
            );
          } else {
            setBlock(false);
            toast.error(res?.data?.errorMessage, {
              position: "top-right",
            });
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
  }

  const takeConfirmationDownload=()=>{
    setIsShowModel(true)
  }

  const onClickAutopopulatedData = () => {
    setBlock(true);
    GSTR3Services.getPopulatedData(G_UCParId, gstr3BToDt, gstr3BToDt, subscriptionId, UserId)
      .then((res) => {
        if (res.data.status === errorCodeConfig.APIDefaultCode.GovtOTPExpire) {
          console.log("true")
          setMsgDisplay(res?.data?.errorMessage)
          setBlock(false);
          // loadFunction(false);
          setComposeOpen(true)
        }
        else {
          if (
            res.status === 200 &&
            res.data.status === errorCodeConfig.APIDefaultCode.Success
          ) {
            // setSaveThenSearch(false);
            setBlock(false);
            console.log(res?.data?.data, "res?.data?.data")
            PurchaseSummaryService()
          } else {
            setBlock(false);
            toast.error(res?.data?.errorMessage, {
              position: "top-right",
            });
            PurchaseSummaryService()
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
  }

  const onClickAutopopulatedDataWithoutOtp = () => {
    setBlock(true);
    setIsShowModel(false)
    gstr3bFiledService.downloadGovtGSTR3BFiledwihtoutOTP(G_UCParId,UserId,gstr3BToDt, subscriptionId)
      .then((res) => {
        if (res.data.status === errorCodeConfig.APIDefaultCode.GovtOTPExpire) {
          setBlock(false)
          setopenWithoutOtpFailed(true)
          toast.success(res?.data?.successMessage),{
            position:'top-right'
          }
        }
        else {
          if (
            res.status === 200 &&
            res.data.status === errorCodeConfig.APIDefaultCode.Success
          ) {
            setBlock(false);
            PurchaseSummaryService()
          } else {
            setBlock(false);
            toast.error(res?.data?.errorMessage, {
              position: "top-right",
            });
            PurchaseSummaryService()
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
  }

  const get3TablesData = () => {
    setBlock(true);

    GSTR3Services.getgstr1FiledDataForGstr3b(G_UCParId, gstr3BToDt, UserId, subscriptionId, G_GSTIN)
      .then((res) => {
        setBlock(false);
        if (
          res.status === 200 &&
          res.data.status === errorCodeConfig.APIDefaultCode.Success
        ) {
          setSaveThenSearch(false);
          setData(res?.data?.data);

          setSuppliesDe(
            res?.data?.data?.supplies.map((ele) => ({
              cess: ele?.cess,
              cgst: ele?.cgst,
              description: ele?.description,
              details: ele?.details,
              igst: ele.igst,
              interStateSupplies: ele.interStateSupplies,
              intraStateSupplies: ele.intraStateSupplies,
              natureOfSupplies: ele.natureOfSupplies,
              placeOfSupply: ele.placeOfSupply,
              // sgst:ele.cgst,
              sgst: ele.sgst,
              taxableValue: ele.taxableValue,
              type: ele.type,
              typeText: ele.typeText,
            }))
          );
          setNilRatedDe(
            res?.data?.data?.nilRated.map((ele) => ({
              cess: ele?.cess,
              cgst: ele?.cgst,
              description: ele?.description,
              details: ele?.details,
              igst: ele.igst,
              interStateSupplies: ele.interStateSupplies,
              intraStateSupplies: ele.intraStateSupplies,
              natureOfSupplies: ele.natureOfSupplies,
              placeOfSupply: ele.placeOfSupply,
              // sgst:ele.cgst,
              sgst: ele.sgst,
              taxableValue: ele.taxableValue,
              type: ele.type,
              typeText: ele.typeText,
            }))
          );
          setOutwardSuppliesDe(
            res?.data?.data?.outwardSupplies.map((ele) => ({
              cess: ele?.cess,
              cgst: ele?.cgst,
              description: ele?.description,
              details: ele?.details,
              igst: ele.igst,
              interStateSupplies: ele.interStateSupplies,
              intraStateSupplies: ele.intraStateSupplies,
              natureOfSupplies: ele.natureOfSupplies,
              placeOfSupply: ele.placeOfSupply,
              // sgst:ele.cgst,
              sgst: ele?.sgst,
              taxableValue: ele.taxableValue,
              type: ele.type,
              typeText: ele.typeText,
            }))
          );

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
            confirmButton: "btn btn-danger",
          },
          buttonsStyling: false,
        });
      });

  }


  useEffect(() => {
    if (searchDataApi == true) {
      PurchaseSummaryService()
      setSearchDataApi(false)
    }

  }, [searchDataApi])

  useEffect(() => {
    if (autopopulatedData == true)
      takeConfirmationDownload();
    setAutopopulatedData(false)
  }, [autopopulatedData])

  const getDataDownload = async (btnId) => {
    if (btnId.id == '1') {
      takeConfirmationDownload()
    } else if (btnId.id == '2') {
      get3TablesData()
    }

  }


    // *** with round
    function formatRender(instance, td, row, col, prop, value, cellProperties) {
      console.log(row,value,col,"testtter")
      textRenderer.apply(this, arguments);
      // if(value != )
        let currnecyVal = formatINR(Number(value));

        if (currnecyVal !== 0) {
          td.innerText = currnecyVal;
        }

    }

    // ** export Reco Data
    const exportRecoData = async () => {
      try {
        setBlock(true);
    
        const res = await GSTR3Services.gstr3bExportRecoData(G_UCParId, gstr3BToDt, G_GSTIN, subscriptionId, token);
    
        if (res?.status === 200 && res?.data?.status === errorCodeConfig.APIDefaultCode.Success) {
          downloadURL(res?.data?.data);
        } else {
          Swal.fire({
            icon: "error",
            title: "",
            text: res?.data?.errorMessage ,
            customClass: {
              confirmButton: "btn btn-danger",
            },
            buttonsStyling: false,
          });
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "",
          text: error?.message,
          customClass: {
            confirmButton: "btn btn-danger",
          },
          buttonsStyling: false,
        });
      } finally {
        setBlock(false);
      }
    };
    

  return (
    <Fragment>
      <>
        {block && <div className="loading1">Loading&#8230;</div>}

        <VerificationOTP composeOpen={composeOpen} setComposeOpen={setComposeOpen} toggleCompose={toggleCompose1} userClientIds={G_UCParId}
          messageDisplay={msgDisplay}
        ></VerificationOTP>

           <Modal
            backdrop="static"
            isOpen={isShowModel}
            className="modal-dialog-centered modal-sm"
          >
            <div className="modal-header">
              <h2 className="modal-title w-100 text-center">
              GSTN Auto-Populated Data
              </h2>
              <div className="modal-actions">
                <a onClick={()=>setIsShowModel(!isShowModel)} className="text-body">
                  <X size={14} />
                </a>
              </div>
            </div>
            {/* style={{ margin: "0px" }} */}
            <hr></hr>
            <ModalBody className="px-sm-2 mx-30 pb-2">
              <h2 className="text-center"><b>How you want to Download Data?</b></h2>
              <Row tag="form" className="gy-1 pt-75">
                <Col xs={12} className="text-center pt-50">
                  <Button type="submit" className="me-1" color="danger"  onClick={onClickAutopopulatedData} outline>
                    With OTP
                  </Button>
                  <Button
                    type="reset"
                    color="secondary"
                    outline
                    onClick={onClickAutopopulatedDataWithoutOtp}
                  >
                    Without OTP
                  </Button>
                </Col>
              </Row>
            </ModalBody>
          </Modal>
      {openWithoutOtpFailed == true && (
      <WithoutOtpModel
       openWithoutOtpFailed={openWithoutOtpFailed}
       setopenWithoutOtpFailed={setopenWithoutOtpFailed}
       G_UCParId={G_UCParId}>
      </WithoutOtpModel>) }

        <div className="content-header-left col-md-12 col-12">
          <div className="row breadcrumbs-top mb-1">
            <div className="col-md-6"></div>
            <div className="col-md-6">
              <div className="row">
                <div className="col-md-12">
                  <div className="row">
                    <div className="col-md-5"></div>
                    <Label className="form-label col-md-4 pt-half text-end">
                      Return Period
                    </Label>
                    <Select
                      id="to"
                      placeholder="To"
                      isClearable={false}
                      theme={selectThemeColors}
                      closeMenuOnSelect={true}
                      options={panData}
                      components={animatedComponents}
                      className="basic-multi-select col-md-3 ps-0"
                      classNamePrefix="select"
                      onChange={selectFromMonth}
                      value={monthFrom}
                      maxMenuHeight={SELECT_MAXSIZE}
                      isDisabled={true}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* First Table Details */}
        <div>
          {/* <style>{`.gstr3bHeading{font-size: 14px !important; font-weight:bold}`}</style> */}
          <div className="d-flex justify-content-between align-items-center mt-3 mb-1">
            <h3 className="heading-font-18-weight">
              3.1 Details of outward supplies and inward supplies liable to reverse
              charge (other than those covered in 3.1.1)
            </h3>
            <div className="col-md-4 ps-0">
              <div style={{ justifyContent: "end" }} className="row">
                <Label className="form-label col-md-2 pt-half px-0">
                  Get Data
                </Label>
                <Select
                  id="getDataDownload"
                  isClearable={false}
                  theme={selectThemeColors}
                  closeMenuOnSelect={true}
                  options={returnStatus3b ? getDataList.filter((item) => item.id == 2) : getDataList}
                  components={animatedComponents}
                  className="basic-multi-select col-md-6 ps-0"
                  classNamePrefix="select"
                  onChange={getDataDownload}
                  maxMenuHeight={SELECT_MAXSIZE}
                  placeholder={"--Select--"}
                />
              </div>
            </div>
            {/* </div> */}

          </div>
          {/* <Card>
          <CardBody className="CardBody p-0"> */}
          <div>
            <Row>
              <Col md={12} >
                <div className="filing-table-border">
                  {outwardSuppliesDe && outwardSuppliesDe?.length > 0 ? (
                    <HotTable
                      data={outwardSuppliesDe}
                      // data={arr1}
                      autoWrapRow={true}
                      rowHeights={RowSize}
                      columnHeaderHeight={columnHeaderSize}
                      autoColumnSize={true}
                      stretchH="all"
                      preventOverflow="horizontal"
                      columns={handsontableColumns}
                      contextMenu={false}
                      bindRowsWithHeaders={true}
                      licenseKey="non-commercial-and-evaluation"
                      height="auto"
                      ref={hotRef}
                      hiddenColumns={{
                        columns: [6, 7],
                      }}
                      afterGetColHeader={theader}
                      afterOnCellMouseDown={localAfterOnCellMouseDown}
                      mergeCells={false}
                      cells={function (row, col) {
                        var cp = {};

                        const hot = hotRef?.current?.hotInstance;
                        cp.className = "child";
                        if (col > 0) {
                          cp.className = "text-end";
                        }
                        if (col == 0 && col == 1) {

                          cp.className = "green";
                        }

                        if (row === outwardSuppliesDe.length - 1) {
                          if (col > 0) {


                            // cp.className = "disabledFill text-end"
                            cp.className = "purchseCellDisable text-end";
                          }
                        }
                        if (col === 4) {
                          cp.className = "purchseCellDisable text-end";
                        }

                        if (row === 4) {
                          if (col > 1) {
                            cp.className = "purchseCellDisable text-end";
                          }
                        }
                        if (row === 3) {
                          if (col > 3 && col != 5) {
                            cp.className = "purchseCellDisable text-end";
                          }
                        }
                        if (row === 2) {
                          if (col > 1) {
                            cp.className = "purchseCellDisable text-end";
                          }
                        }
                        if (row === 1) {
                          if (col > 2 && col != 5) {
                            cp.className = "purchseCellDisable text-end";
                          }
                        }

                        if (
                          col === 1 ||
                          col == 2 ||
                          col == 3 ||
                          col == 4 ||
                          col == 5
                        ) {
                          // console.log(cp?.className,"tesitnngClassName")
                          if (cp?.className?.includes("purchseCellDisable")) {
                            cp.readOnly = true;
                          } else {
                            cp.readOnly = false;
                          }
                        }

                        // if (col == 1 ||  col == 2 ||  col ==  3 ||  col == 4 || col == 5 ) {
                        //   cp.renderer = formatRender;
                        // }

                        return cp;
                      }}
                      afterChange={(x, y) => cellChange(x, y)}
                      afterRenderer={(TD, row, col, prop, value) => {
                        if (
                          (col == 1 ||
                            col == 2 ||
                            col == 3 ||
                            col == 4 ||
                            col == 5) &&
                          errorArr.findIndex(
                            (y) =>
                              y.row == row &&
                              y.col == col &&
                              y.table == "1 OutwardSupplies"
                          ) != -1 &&
                          block === false && value
                        ) {
                          TD.style.backgroundColor = "red";
                        }
                      }}
                      width="100%"
                      colWidths={100}
                      beforeKeyDown={function (e, col) {
                        // Delete and Backspace , copy and paste

                        if (
                          e.keyCode == 8 ||
                          e.keyCode == 46 ||
                          e.keyCode == 67 ||
                          e.keyCode == 86 ||
                          e.keyCode == 38 ||
                          e.keyCode == 37 ||
                          e.keyCode == 39 ||
                          e.keyCode == 40
                        ) {
                        } else {
                          var reg = /^[0-9.-]+|[\b]+$/;
                          let col = this?.getSelectedLast()?.[1];

                          if (
                            col == 1 ||
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
                      beforeCreateRow={function (index, amount) {
                        let countRow = this?.countRows();
                        if (this?.isEmptyRow(countRow - 0)) {
                          return false;
                        }
                        return true;
                      }}
                    />
                  ) : (
                    <HotTable
                      mergeCells={[{ row: 0, col: 0, rowspan: 1, colspan: 6 }]}
                      autoColumnSize={true}
                      autoWrapRow={true}
                      rowHeights={RowSize}
                      columnHeaderHeight={columnHeaderSize}
                      ref={hotRef}
                      stretchH="all"
                      style={{ overflowX: "hidden", textAlign: "center" }}
                      data={[{ natureOfSupplies: "No Data Found!" }]}
                      preventOverflow="horizontal"
                      columns={handsontableColumns}
                      contextMenu={false}
                      bindRowsWithHeaders={true}
                      licenseKey="non-commercial-and-evaluation"
                      height="auto"
                      width="100%"
                      afterGetColHeader={theader}
                      colWidths={100}

                    />
                  )}
                </div>
              </Col>
            </Row>
          </div>

        </div>

        {/* Second Table Details */}
        <div>
          <h3 className="heading-font-18-weight mt-3">
            3.1.1 Details of supplies notified under sub-section (5) of section 9
            of the Central Goods and Services Tax Act, 2017 and corresponding
            provisions in Integrated Goods and Services Tax/Union Territory Goods
            and Services Tax/State Goods and Services Tax Acts{" "}
          </h3>

          <div>
            <Row>
              <Col md={12}>
                <div className="filing-table-border">
                  {supplyDetailsDe.length > 0 ? (
                    <HotTable
                      // data={supplies}
                      data={supplyDetailsDe}
                      autoWrapRow={true}
                      rowHeights={RowSize}
                      columnHeaderHeight={columnHeaderSize}
                      autoColumnSize={true}
                      stretchH="all"
                      preventOverflow="horizontal"
                      columns={handsontableColumns2}
                      contextMenu={false}
                      bindRowsWithHeaders={true}
                      licenseKey="non-commercial-and-evaluation"
                      height="auto"
                      ref={hotRef2}
                      hiddenColumns={{
                        columns: [6, 7],
                      }}
                      afterOnCellMouseDown={localAfterOnCellMouseDown}
                      mergeCells={false}
                      afterGetColHeader={theader1}
                      cells={function (row, col) {
                        var cp = {};
                        const hot = hotRef2?.current?.hotInstance;
                        cp.className = "child";
                        if (col > 0) {
                          cp.className = "text-end";
                        }

                        if (col === 4) {
                          cp.className = "purchseCellDisable text-end";
                        }
                        if (row === supplyDetailsDe.length - 1) {
                          if (col > 0) {
                            cp.className = "purchseCellDisable text-end";
                          }
                        }
                        if (
                          col === 1 ||
                          col == 2 ||
                          col == 3 ||
                          col == 4 ||
                          col == 5
                        ) {
                          // console.log(cp?.className,"tesitnngClassName")
                          if (cp?.className?.includes("purchseCellDisable")) {
                            cp.readOnly = true;
                          } else {
                            cp.readOnly = false;
                          }
                        }

                        if (col == 1 ||  col == 2 ||  col ==  3 ||  col == 4  || col == 5 ) {
                          cp.renderer = formatRender;
                        }

                        return cp;
                      }}
                      afterChange={(x, y) => cellChangeSubDetails(x, y)}
                      afterRenderer={(TD, row, col, prop, value) => {
                        // console.log(value,"valueeeee")
                        if (
                          (col == 1 ||
                            col == 2 ||
                            col == 3 ||
                            col == 4 ||
                            col == 5) &&
                          errorArr.findIndex(
                            (y) =>
                              y.row == row &&
                              y.col == col &&
                              y.table == "2 SubDetails"
                          ) != -1
                          &&
                          block === false && value
                        ) {
                          TD.style.backgroundColor = "red";
                        }
                      }}
                      width="100%"
                      colWidths={100}
                      beforeKeyDown={function (e, col) {
                        // Delete and Backspace , copy and paste

                        if (
                          e.keyCode == 8 ||
                          e.keyCode == 46 ||
                          e.keyCode == 67 ||
                          e.keyCode == 86 ||
                          e.keyCode == 38 ||
                          e.keyCode == 37 ||
                          e.keyCode == 39 ||
                          e.keyCode == 40
                        ) {
                        } else {
                          var reg = /^[0-9.-]+|[\b]+$/;
                          let col = this?.getSelectedLast()?.[1];

                          if (
                            col == 1 ||
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
                      beforeCreateRow={function (index, amount) {
                        let countRow = this?.countRows();
                        if (this?.isEmptyRow(countRow - 0)) {
                          return false;
                        }
                        return true;
                      }}
                    />
                  ) : (
                    <HotTable
                      mergeCells={[{ row: 0, col: 0, rowspan: 1, colspan: 6 }]}
                      autoColumnSize={true}
                      autoWrapRow={true}
                      rowHeights={RowSize}
                      columnHeaderHeight={columnHeaderSize}
                      ref={hotRef2}
                      stretchH="all"
                      style={{ overflowX: "hidden", textAlign: "center" }}
                      data={[{ natureOfSupplies: "No Data Found!" }]}
                      preventOverflow="horizontal"
                      columns={handsontableColumns2}
                      afterGetColHeader={theader1}
                      contextMenu={false}
                      bindRowsWithHeaders={true}
                      licenseKey="non-commercial-and-evaluation"
                      height="auto"
                      width="100%"
                      colWidths={100}

                    />
                  )}
                </div>
              </Col>
            </Row>
          </div>

        </div>

        {/* third table will enter in between */}
        <div>
          <h3 className="heading-font-18-weight mt-3">
            3.2 Of the supplies shown in 3.1(a) and 3.1.1(i) above,details of
            inter-State supplies made to unregistered persons, composition taxable
            persons and UIN holders
          </h3>

          <div>
            <Row>
              <Col md={12}>
                <div className="filing-table-border">
                  {suppliesDe?.length > 0 ? (
                    <HotTable

                      data={suppliesDe}
                      autoWrapRow={true}
                      rowHeights={RowSize}
                      columnHeaderHeight={columnHeaderSize}

                      autoColumnSize={true}
                      stretchH="all"
                      preventOverflow="horizontal"
                      columns={handsontableColumns3}
                      contextMenu={false}
                      bindRowsWithHeaders={true}
                      licenseKey="non-commercial-and-evaluation"
                      height="auto"
                      ref={hotRef3}
                      hiddenColumns={{
                        columns: [3],
                      }}
                      afterGetColHeader={theader2}
                      afterOnCellMouseDown={localAfterOnCellMouseDownSupplies}
                      mergeCells={false}
                      cells={function (row, col) {
                        var cp = {};
                        const hot = hotRef3?.current?.hotInstance;
                        if (col == 0) {
                          cp.className = "text-danger myRow";
                        }
                        // cp.className = "text-primary child";
                        if (col > 0) {
                          cp.className = "text-end";
                        }
                        if (row === suppliesDe?.length - 1) {
                          cp.className = "test";
                          if (col > 0) {
                            cp.className = "text-end";
                          }
                        }

                        cp.readOnly = true;

                        if (col > 0) {
                          cp.className = "purchseCellDisable text-end";
                        }

                        if (col == 1 ||  col == 2 ) {
                          cp.renderer = formatRender;
                        }

                        return cp;
                      }}

                      afterRenderer={(TD, row, col, prop, value) => {
                        if (
                          (col == 1 || col == 2) &&
                          errorArr.findIndex(
                            (y) =>
                              y.row == row &&
                              y.col == col &&
                              y.table == "4 ChangeOfSupplies"
                          ) != -1
                        ) {
                          TD.style.backgroundColor = "red";
                        }
                      }}
                      width="100%"
                      colWidths={100}
                    />
                  ) : (
                    <HotTable
                      autoWrapRow={true}
                      mergeCells={[{ row: 0, col: 0, rowspan: 1, colspan: 3 }]}
                      rowHeights={RowSize}
                      columnHeaderHeight={columnHeaderSize}
                      autoColumnSize={true}
                      stretchH="all"
                      ref={hotRef3}
                      style={{ overflowX: "hidden", textAlign: "center" }}
                      data={[{ natureOfSupplies: "No Data Found!" }]}
                      preventOverflow="horizontal"
                      columns={handsontableColumns3}
                      contextMenu={false}
                      bindRowsWithHeaders={true}
                      licenseKey="non-commercial-and-evaluation"
                      height="auto"
                      width="100%"
                      colWidths={100}
                      cells={function (row, col) {
                        var cp = {};
                        const hot = hotRef3?.current?.hotInstance;
                        if (col == 0) {
                          cp.className = "";
                        }

                        return cp;
                      }}
                      afterGetColHeader={theader2}
                      hiddenColumns={{
                        columns: [3],
                      }}
                    />
                  )}
                </div>
              </Col>
            </Row>
          </div>

        </div>

        <div className="row breadcrumbs-top mt-2">
          <div className="col-md-6"></div>
          <div className="col-md-2"></div>

          <div className="col-md-4 ps-0">
            <div style={{ justifyContent: "end" }} className="row">
              <Label className="form-label col-md-3 pt-half px-0">
                Get Data From
              </Label>
              <Select
                id="to"
                // placeholder="To"
                isClearable={false}
                theme={selectThemeColors}
                closeMenuOnSelect={true}
                options={gstr2bData}
                components={animatedComponents}
                className="basic-multi-select col-md-7 ps-0"
                classNamePrefix="select"
                onChange={selectGSTR2bData}
                value={gstOption}
                maxMenuHeight={SELECT_MAXSIZE}
                placeholder={"--Select--"}
              />
            </div>
          </div>
        </div>

        {/* Export Reco Data  */}
        <div>
          <Row>
            <Col md={10}>
              <h3 className="heading-font-18-weight">4. Eligible ITC</h3>
            </Col>
            <Col md={2} className="text-end">
               { isGetRecoData == true &&   <Button
                      color='danger'
                      onClick={exportRecoData}
                      className="btn-icon btn-round mb-1"
                      id="exportRecoData"
                      outline
                    >
                      <i className='fa fa-file-excel-o'></i> {"    "}
                      Export Reco Data
                    </Button>}
            </Col>
          </Row>

          <div>
            <Row>
              <Col md={12}>
                <div className="filing-table-border">
                  {eligibleITCsDe?.length && eligibleITCsDe?.length > 0 ? (
                    <HotTable
                      autoWrapRow={true}
                      data={eligibleITCsDe}
                      rowHeights={RowSize}
                      columnHeaderHeight={columnHeaderSize}

                      autoColumnSize={true}
                      stretchH="all"
                      preventOverflow="horizontal"
                      columns={eligbileColumns}
                      contextMenu={false}
                      bindRowsWithHeaders={true}
                      licenseKey="non-commercial-and-evaluation"
                      height="auto"
                      ref={hotRefEligibeleITC}

                      afterOnCellMouseDown={localAfterOnCellMouseDown}
                      afterGetColHeader={theader3}
                      mergeCells={[
                        { row: 0, col: 0, rowspan: 1, colspan: 5 },
                        { row: 6, col: 0, rowspan: 1, colspan: 5 },
                        { row: 9, col: 0, rowspan: 1, colspan: 5 },
                        { row: 11, col: 0, rowspan: 1, colspan: 5 },
                      ]}
                      // mergeCells={[{ row: 0, col: 0, rowspan: 1, colspan: 5 }, { row: 5, col: 0, rowspan: 1, colspan: 5 }, { row: 8, col: 0, rowspan: 1, colspan: 5 }, { row: 10, col: 0, rowspan: 1, colspan: 5 }]}
                      cells={function (row, col) {
                        var cp = {};
                        const hot = hotRefEligibeleITC?.current?.hotInstance;
                        cp.className = "child";
                        if (col > 0) {
                          cp.className = "text-end";
                        }
                        if (row == 0 || row == 6 || row == 9 || row == 11) {

                          cp.className = "boldRow";
                        }


                        if (row == 0 || row == 6 || row == 9 || row == 11) {
                          cp.readOnly = true;

                        }

                        if (col === 3 && row != 8) {
                          cp.className = "purchseCellDisable text-end";
                        }
                        if (row == 1 || row == 2) {
                          if (col > 1 && col != 4) {
                            cp.className = "purchseCellDisable text-end";
                          }
                        }
                        if (row == 10) {
                          if (col > 0) {
                            cp.className = "purchseCellDisable text-end";
                          }
                        }
                        if (row === eligibleITCsDe.length - 1) {
                          if (col > 0) {
                            cp.className = "purchseCellDisable text-end";
                          }
                        }

                        if (col === 1 || col == 2 || col == 3 || col == 4) {

                          if (cp?.className?.includes("purchseCellDisable")) {
                            cp.readOnly = true;
                          } else {
                            cp.readOnly = false;
                          }
                        }

                        // if (col == 1 ||  col == 2 ||  col ==  3 ||  col == 4) {
                        //   cp.renderer = formatRender;
                        // }

                        return cp;
                      }}
                      afterChange={(x, y) => {
                        if (x != null) {
                          for (let i = 0; i < x.length; i++) {
                            if (x[i][2] == null) {
                              return;
                            } else {
                              cellChangeEligible(x, y);
                            }
                          }
                        }
                        
                      }}
                      afterRenderer={(TD, row, col, prop, value) => {
                        if (
                          (col == 1 || col == 2 || col == 3 || col == 4) &&
                          errorArr.findIndex(
                            (y) =>
                              y.row == row &&
                              y.col == col &&
                              y.table == "5 ChangeEligible"
                          ) != -1
                          &&
                          block === false && value
                        ) {
                          TD.style.backgroundColor = "red";
                        }
                      }}
                      width="100%"
                      colWidths={100}
                      beforeKeyDown={function (e, col) {
                        // Delete and Backspace , copy and paste

                        if (
                          e.keyCode == 8 ||
                          e.keyCode == 46 ||
                          e.keyCode == 67 ||
                          e.keyCode == 86 ||
                          e.keyCode == 38 ||
                          e.keyCode == 37 ||
                          e.keyCode == 39 ||
                          e.keyCode == 40
                        ) {
                        } else {
                          var reg = /^[0-9.-]+|[\b]+$/;
                          let col = this?.getSelectedLast()?.[1];

                          if (col == 1 || col == 2 || col == 3 || col == 4) {
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
                    />
                  ) : (
                    <HotTable
                      autoWrapRow={true}
                      mergeCells={[{ row: 0, col: 0, rowspan: 1, colspan: 5 }]}
                      autoColumnSize={true}
                      rowHeights={RowSize}
                      columnHeaderHeight={columnHeaderSize}
                      stretchH="all"
                      style={{ overflowX: "hidden", textAlign: "center" }}
                      data={[{ details: "No Data Found!" }]}
                      preventOverflow="horizontal"
                      columns={eligbileColumns}
                      afterGetColHeader={theader3}
                      contextMenu={false}
                      bindRowsWithHeaders={true}
                      licenseKey="non-commercial-and-evaluation"
                      height="auto"
                      width="100%"
                      colWidths={100}
                      ref={hotRefEligibeleITC}

                    />
                  )}
                </div>
              </Col>
            </Row>
          </div>

        </div>

        {/* fifth Table is down  */}
        <div>
          <h3 className="heading-font-18-weight mt-3">
            5.Exempt, nil-rated and non-GST inward supplies
          </h3>

          <div>
            <Row>
              <Col md={12}>
                <div className="filing-table-border">
                  {nilRatedDe?.length > 0 ? (
                    <HotTable
                      data={nilRatedDe}
                      autoWrapRow={true}
                      rowHeights={RowSize}
                      columnHeaderHeight={columnHeaderSize}

                      autoColumnSize={true}
                      stretchH="all"
                      preventOverflow="horizontal"
                      columns={exemptColumns}
                      contextMenu={false}
                      bindRowsWithHeaders={true}
                      licenseKey="non-commercial-and-evaluation"
                      height="auto"
                      afterGetColHeader={theader4}
                      ref={hotRefExempt}

                      afterOnCellMouseDown={localAfterOnCellMouseDown}
                      mergeCells={false}
                      cells={function (row, col) {
                        var cp = {};
                        const hot = hotRefExempt?.current?.hotInstance;
                        cp.className = "child";
                        if (col > 0) {
                          cp.className = "text-end";
                        }
                        if (row == nilRatedDe.length - 1) {
                          if (col > 0) {
                            cp.className = "purchseCellDisable text-end";
                          }
                        }

                        if (col === 1 || col == 2) {

                          if (cp?.className?.includes("purchseCellDisable")) {
                            cp.readOnly = true;
                          } else {
                            cp.readOnly = false;
                          }
                        }

                        if (col == 1 ||  col == 2  ) {
                          cp.renderer = formatRender;
                        }

                        return cp;
                      }}
                      afterChange={(x, y) => cellChangeOfExempt(x, y)}
                      afterRenderer={(TD, row, col, prop, value) => {

                        if (
                          (col == 1 || col == 2) &&
                          errorArr.findIndex(
                            (y) =>
                              y.row == row &&
                              y.col == col &&
                              y.table == "6 ChangeOfExempt"
                          ) != -1
                          &&
                          block === false && value
                        ) {
                          TD.style.backgroundColor = "red";
                        }
                      }}
                      width="100%"
                      colWidths={100}
                      beforeKeyDown={function (e, col) {
                        // Delete and Backspace , copy and paste

                        if (
                          e.keyCode == 8 ||
                          e.keyCode == 46 ||
                          e.keyCode == 67 ||
                          e.keyCode == 86 ||
                          e.keyCode == 38 ||
                          e.keyCode == 37 ||
                          e.keyCode == 39 ||
                          e.keyCode == 40
                        ) {
                        } else {
                          var reg = /^[0-9.-]+|[\b]+$/;
                          let col = this?.getSelectedLast()?.[1];

                          if (col == 1 || col == 2) {
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
                    />
                  ) : (
                    <HotTable
                      mergeCells={[{ row: 0, col: 0, rowspan: 1, colspan: 3 }]}
                      autoColumnSize={true}
                      autoWrapRow={true}
                      rowHeights={RowSize}
                      columnHeaderHeight={columnHeaderSize}
                      stretchH="all"
                      style={{ overflowX: "hidden", textAlign: "center" }}
                      data={[{ natureOfSupplies: "No Data Found!" }]}
                      preventOverflow="horizontal"
                      columns={exemptColumns}
                      contextMenu={false}
                      bindRowsWithHeaders={true}
                      licenseKey="non-commercial-and-evaluation"
                      height="auto"
                      width="100%"
                      afterGetColHeader={theader4}
                      colWidths={100}
                      ref={hotRefExempt}

                    />
                  )}
                </div>
              </Col>
            </Row>
          </div>

        </div>


        {/* Sixth Table  */}
        <div style={{ marginBottom: "20px" }}>
          <div className="d-flex justify-content-between align-items-center mt-3 mb-1">
            <h3 className="heading-font-18-weight">5.1 Interest and Late Fees</h3>
            <Button
              className="btn-icon"
              outline
              color="danger"
              onClick={onClickgetLateFeeData}
            >
              <Download size={14} />
              <span className="align-middle ms-50">
                {" "}
                Get Data
              </span>
            </Button>
          </div>

          <div>
            <Row>
              <Col md={12}>
                <div className="filing-table-border">
                  {lateFeeDe?.length > 0 ? (
                    <HotTable
                      data={lateFeeDe}
                      autoWrapRow={true}
                      // data={arr6}
                      rowHeights={RowSize}
                      columnHeaderHeight={columnHeaderSize}
                      autoColumnSize={true}
                      stretchH="all"
                      preventOverflow="horizontal"
                      columns={intersetAndLateFeesColumn}
                      contextMenu={false}
                      bindRowsWithHeaders={true}
                      licenseKey="non-commercial-and-evaluation"
                      height="auto"
                      ref={hotRefIntersetLateFee}

                      afterGetColHeader={theader5}
                      afterOnCellMouseDown={localAfterOnCellMouseDown}
                      mergeCells={false}
                      cells={function (row, col) {
                        var cp = {};
                        const hot = hotRefIntersetLateFee?.current?.hotInstance;
                        cp.className = "child";
                        if (col > 0) {
                          cp.className = "text-end";
                        }
                        if (row == 2) {
                          if (col > 0) {
                            cp.className = "purchseCellDisable text-end";
                          }
                        }
                        if (col == 3) {
                          cp.className = "purchseCellDisable text-end";
                        }
                        if (row == 1) {
                          if (col == 1 || col == 4) {
                            cp.className = "purchseCellDisable text-end";
                          }
                        }

                        if (col === 1 || col == 2 || col == 3 || col == 4) {
                          cp.renderer = formatRender;

                          if (cp?.className?.includes("purchseCellDisable")) {
                            cp.readOnly = true;
                          } else {
                            cp.readOnly = false;
                          }
                        }

                        return cp;
                      }}
                      afterChange={(x, y) => cellChangeLateFee(x, y)}
                      afterRenderer={(TD, row, col, prop, value) => {
                        // console.log(value,"valueeeee")
                        if (
                          (col == 1 || col == 2 || col == 3 || col == 4) &&
                          errorArr.findIndex(
                            (y) =>
                              y.row == row &&
                              y.col == col &&
                              y.table == "7 ChangeLateFee"
                          ) != -1
                          &&
                          block === false && value
                        ) {
                          TD.style.backgroundColor = "red";
                        }
                      }}
                      width="100%"
                      colWidths={100}
                      beforeKeyDown={function (e, col) {
                        // Delete and Backspace , copy and paste

                        if (
                          e.keyCode == 8 ||
                          e.keyCode == 46 ||
                          e.keyCode == 67 ||
                          e.keyCode == 86 ||
                          e.keyCode == 38 ||
                          e.keyCode == 37 ||
                          e.keyCode == 39 ||
                          e.keyCode == 40
                        ) {
                        } else {
                          var reg = /^[0-9.-]+|[\b]+$/;
                          let col = this?.getSelectedLast()?.[1];

                          if (col == 1 || col == 2 || col == 3 || col == 4) {
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
                    />
                  ) : (
                    <HotTable
                      autoWrapRow={true}
                      mergeCells={[{ row: 0, col: 0, rowspan: 1, colspan: 5 }]}
                      rowHeights={RowSize}
                      columnHeaderHeight={columnHeaderSize}
                      autoColumnSize={true}
                      stretchH="all"
                      style={{ overflowX: "hidden", textAlign: "center" }}
                      data={[{ description: "No Data Found!" }]}
                      preventOverflow="horizontal"
                      columns={intersetAndLateFeesColumn}
                      contextMenu={false}
                      bindRowsWithHeaders={true}
                      licenseKey="non-commercial-and-evaluation"
                      height="auto"
                      width="100%"
                      afterGetColHeader={theader5}
                      colWidths={100}
                      ref={hotRefIntersetLateFee}
                    />
                  )}
                </div>
              </Col>
            </Row>
          </div>

        </div>
        {/* payment page Button  */}

      </>

      {block == false && (outwardSuppliesDe.length > 0) &&
        <div style={{ zIndex: "999", }} className='btnFixFooter'>
          <div className="container">
            <Row className='justify-content-end mx-0'>
              <Col className='d-flex align-items-center justify-content-end' md='6' sm='12'>
              <Button
                color="danger"
                className="btn-next me-1"
                onClick={() => NilReturnFilling()}
              >
                 <FileText
                  size={14}
                  className="align-middle ms-sm-25 ms-1"
                  style={{marginRight:"5px"}}
                ></FileText>
                <span className="align-middle d-sm-inline-block d-none">
                  File Nil Return
                </span>
               
              </Button>
                <Button
                  className="btn-icon me-1"
                  outline
                  color="danger"
                  id="btnSaveGSTR3B"
                  onClick={onClickSaveButtonGSTR3bDetails}
                >
                  <FilePlus size={14} />
                  <span className="align-middle ms-50">
                    {" "}
                    Save
                  </span>
                </Button>
                <UncontrolledTooltip placement="top" target="btnSaveGSTR3B">
                  Save [{keysMap.SAVE_DATA}]
                </UncontrolledTooltip>
                <Button onClick={onClickcomputation} id="updatebtn" type='submit' color='danger' outline >
                  Computation of Tax
                </Button>
                <UncontrolledTooltip placement="top" target="updatebtn">
                  Computation of Tax
                </UncontrolledTooltip>
              </Col>
            </Row>
          </div>
        </div>
      }
    </Fragment>
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
        <td>{item.tableName}</td>
        <td>{item.rowNo + 1}</td>
        <td>Only Numeric Value Allowed</td>
      </tr>
    ));

  return (
    <div className="errorTable_container">
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Sr No</th>
            <th>Table</th>
            <th>Row Number</th>
            <th>Error</th>
          </tr>
        </thead>
        <tbody>{itemList}</tbody>
      </Table>
    </div>
  );
}

export default GSTR3BDetails;
