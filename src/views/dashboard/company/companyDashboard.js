// ** React Imports
import { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
// ** Third Party Components
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import toast from "react-hot-toast";
// ** Third Party Components
import ReactPaginate from "react-paginate";
import { Plus, X, Download } from "react-feather";
import Breadcrumbs from "@components/breadcrumbs";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import StaticDataServices from "../../../services/master/staticdataService";
import CompanyNewService from "../../../services/company/companyNewService";
import errorCodeConfig from "../../../configs/apiErrorCodeConfig";
import encryptData from "../../../auth/crypto/crypto";
import { setFlags } from "../../../redux/navbar";

// ** Reactstrap Imports
import classnames from "classnames";
// ** Styles
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/pages/page-form-validation.scss";

// ** Handsontable
import { HotTable, HotColumn } from "@handsontable/react";
import Handsontable from "handsontable";
import { registerRenderer, textRenderer } from "handsontable/renderers";
import { registerAllModules } from "handsontable/registry";
import $ from "jquery";
// ** Third Party Components
import { saveAs } from "file-saver";
import { useHotkeys } from "react-hotkeys-hook";
import {
  keysMap,
  enableOnFormTags,
  PageSize,
  RowSize,
  columnHeaderSize,
} from "../../../configs/config";
import { globleVariable } from "../../../configs/globalVariable";
import LocalFunction from "../../../configs/getLocalFunction";
import SessionFunction from "../../../configs/getSessionFunction";
import ClearSession from "../../../helper/clearSession";

registerAllModules();
const MySwal = withReactContent(Swal);

// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  Input,
  Label,
  Button,
  Modal,
  CardBody,
  CardText,
  ModalBody,
  FormFeedback,
  Form,
  ModalFooter,
  UncontrolledTooltip,
} from "reactstrap";
import { useEffect } from "react";
// ** Utils
import { selectThemeColors } from "@utils";
import { useRef } from "react";
import importCompany from "../../../services/company/importCompany";
import moment from "moment/moment";
// ** Store & Actions
import { useDispatch, useSelector } from "react-redux";
import {
  handleCompanyDashboard,
  handleGSTR1FiledSummary,
  handleGSTR2BSummary,
  handleGSTR3BSummary,
} from "../../../views/apps/user/store";
import { handleGSTR6AFiled } from "../../pages/reports/gstr6AFiledData/store";
import { handleGSTR2ASummary } from "../../pages/gstr2A/store";
import { handleItc04Filed } from "../../pages/reports/itc04FiledData/store";
import { filterCurrentMonthWise } from "@helper/filterArray";
import { handleCMP08Filed } from "../../pages/reports/cmp08FiledData/store";
import CompanyFinanceSelect from "./companyFinanceSelect";
import { deCH } from "handsontable/i18n";

// ** Months
const MonthOptions = [
  // { value: 0, label: "--Select Month--" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
];
let checkClick = false

let defaultMonth = null;
let defaultYear = null;
// let defaultnewMonth = null;




// ** Varirable - Session
const userId = LocalFunction.getLocalValue(globleVariable.userId, true);
const isCompany = sessionStorage.getItem(globleVariable.isCompany);
const userIds = LocalFunction.getLocalValue(globleVariable.userId, true);

const subIds = LocalFunction.getLocalValue(globleVariable.subscriptionId, true);

const deletedBy = userId;
const serverDateDecpryt = LocalFunction.getLocalValue(
  globleVariable.serverDateTime,
  true
);

localStorage.removeItem(globleVariable.vimportData);
const serverDate =
  serverDateDecpryt !== null &&
    serverDateDecpryt !== "" &&
    serverDateDecpryt !== undefined
    ? JSON.parse(serverDateDecpryt).split("T")[0]
    : null;

const currMonth = new Date(serverDate);
const preMonth = currMonth.setMonth(currMonth.getMonth() - 1);
const setMonth = moment(new Date(preMonth)).format("YYYY-MM-DD").split("-")[1];

let resData = null;
const userDatadecrypt = LocalFunction.getLocalValue(
  globleVariable.userData,
  true
);

const userData = userDatadecrypt && JSON.parse(userDatadecrypt);
const finYearOption = userData && userData.data.financialYearList;

const latestyear = finYearOption[0]?.value

console.log(finYearOption, 'finYearOption')
console.log(latestyear, 'latestyear')

// const maxYear = Math.max(...finYearOption[0].value);
// console.log(maxYear,'maxYear');

sessionStorage.setItem(globleVariable.isCompany, false);

//** footer hide/show
const containerFooter = document.getElementById("footerid");
if (containerFooter) {
  containerFooter.style.display = "none";
}

const defaultValues = {
  finyearstatus: null,
  finyearsmonth: null,

};

const companyDashboard = () => {
  let arrFilter = [];


  // ** Clear Session - function
  useEffect(() => {
    ClearSession();
  }, []);

  // sessionStorage.setItem("c", false);
  const hotRef = useRef(null);
  // ** Store Vars

  //** Shortcut keys
  useHotkeys(
    keysMap.CLEAR_DATA,
    () => {
      block == false && ClearFilter();
    },
    {
      enableOnFormTags,
    }
  );
  useHotkeys(
    keysMap.IMPORT_DATA,
    () => {
      block == false && onClickiImportCompanyFile();
    },
    {
      enableOnFormTags,
    }
  );
  useHotkeys(keysMap.TEMPLATE_DOWNLOAD, () => {
    block == false && templateDownload();
  });
  useHotkeys(
    keysMap.ADD_COMPANY,
    () => {
      block == false && handleNavigate();
    },
    {
      enableOnFormTags,
    }
  );

  const capitalized = (values) => {
    return values.charAt(0).toUpperCase() + values.slice(1);
  };

  const templateLable = capitalized(keysMap.EXPORT_DATA);

  // ** Store
  const dispatch = useDispatch();

  // ** Hooks
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors },
    clearErrors,
    setValue,
  } = useForm({ defaultValues });

  const [modal, setModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [pending, setPending] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
  const [data, setData] = useState([]);
  const [dispalyData, setDisplayData] = useState(false);
  const [show, setShow] = useState(false);
  const [gstin, setGstin] = useState(null);
  const [regType, setRegType] = useState(null);
  const [companyName, setCompanyName] = useState(null);
  const [tradeName, setTradeName] = useState(null);
  const [block, setBlock] = useState(false);
  const [clientId, setClientId] = useState(null);
  const [userClientId, setuserClientId] = useState(null);
  const [stateId, setStateId] = useState(null);
  const [redirectApi, setRedirectApi] = useState(false);
  const [yearSelectOption, SetYearSelectOption] = useState(null);
  const [monthSelectOption, SetMonthSelectOption] = useState(null);
  const [isShowCompanyTitle, setIsShowCompanyTitle] = useState(true);
  const inputFile = useRef(null);
  const bulkinputFile = useRef(null);

  const [currentCol, setCurrentCol] = useState([]);
  const [currentCol1, setCurrentCol1] = useState();
  const [searchVal1, setSearchVal1] = useState([]);
  const [stateName, setStateName] = useState("");
  const [monthArray, setMonthArray] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [isCMP08Applicable, setIsCMP08Applicable] = useState(null);
  const [regTypeId, setRegTypeId] = useState(null);
  console.log(selectedYear, "selectedYear--");
  // const [pageSize, setPageSize] = useState(PageSize);
  const [rowDataLogin, setRowDataLogin] = useState(null);


  //UseState to manage UserClient Parent Id
  const [userClientParentId, setUserClientParentId] = useState(null);
  let checkRender;
  const navigate = useNavigate();

  // ** Function to handle Modal toggle
  const handleModal = () => setModal(!modal);
  // **  Navigate
  const handleNavigate = () => {
    navigate("/dashboard/company/add");
  };

  // ** Templete download file
  const templateDownload = () => {
    setBlock(true);
    importCompany
      .templeteDownload()
      .then((res) => {
        setBlock(false);
        if (res.headers.statuscode == errorCodeConfig.APIDefaultCode.Success) {
          var blob = new Blob([res.data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
          saveAs(blob, res.headers["filedownloadname"]);
        } else {
          setBlock(false);
          toast.error(res.headers.errorMessage, {
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
        });
      });
  };

  useEffect(() => {
    return () => setBlock(false);
  }, []);

  // ** Clear redux data
  useEffect(() => {
    sessionStorage.setItem(globleVariable.isCompany, false);
    dispatch(handleCompanyDashboard([]));
    dispatch(handleGSTR2BSummary([]));
    dispatch(handleGSTR3BSummary([]));
    dispatch(handleGSTR1FiledSummary([]));
    dispatch(handleGSTR6AFiled([]));
    dispatch(handleGSTR2ASummary([]));
    dispatch(handleItc04Filed([]));
    dispatch(handleCMP08Filed([]))

    var isShowCompanyTitle = true;
    isShowCompanyTitle = sessionStorage.getItem(globleVariable.isCompany);

    if (isShowCompanyTitle == "false") {
      setIsShowCompanyTitle(false);
      // document.getElementById("CompanyTitleDivision")?.classList?.add("d-none");
      document
        .getElementById("DivisionAppContent")
        .classList.add("app-content-new");
      document
        .getElementById("DivisionAppContent")
        .classList.remove("app-content");
      //document.getElementById("DivisionAppContent").style.padding ="4.5rem 2rem 0 2rem !important;";
    }
  }, []);

  // ** Function to handle Pagination
  const handlePagination = (page) => {
    setCurrentPage(page.selected);
  };

  useEffect(() => {
    const userId = LocalFunction.getLocalValue(globleVariable.userId, true);
    sessionStorage.removeItem("isCMP08Applicable")

    checkRender = true;
    getStateData();
    getCompanyData(userId);
    clearErrors();
    defaultMonth = MonthOptions.filter(
      (p) => p.value == setMonth.replace(/^0+/, "")
    )[0];
    defaultYear = finYearOption[0];
    setValue("finyearstatus", defaultYear);
    sessionStorage.setItem("combinationYear", defaultYear.label)



    if (
      defaultMonth == undefined ||
      defaultMonth == null ||
      defaultMonth == ""
    ) {
      defaultMonth = MonthOptions[0];

    }

    // let filterMonth  =  MonthOptions.filter(
    //   (p) => p.value == defaultMonth.value
    // )[0];

    // defaultMonth = filterMonth

    setValue("finyearsmonth", defaultMonth);
    // setSelectedYear(defaultYear);
    setMonthArray(MonthOptions);
    handleYearChange(defaultYear)
  }, []);

  // ** Search Company
  const getCompanyData = (userId) => {
    const payload = {
      userId: userId,
      companyName: "",
      tradeName: "",
      gstinNumber: "",    
    };
    setBlock(true);
    CompanyNewService.getCompanyByUserId(payload)
      .then((res) => {
        setBlock(false);
        if (
          res.status === 200 &&
          res.data.status === errorCodeConfig.APIDefaultCode.Success
        ) {
          setPending(false);
          //  if (res.data.data.length > 0) {
          setData(res?.data?.data);
          // }
        } else {
          setData(res?.data?.data);
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
  };



  //** company Data
  const getCompanyData1 = (payload) => {
    setCurrentPage(0);
    setBlock(true);
    CompanyNewService.getCompanyByUserId(payload)
      .then((res) => {
        setBlock(false);
        console.log("comapany service");
        if (
          res.status === 200 &&
          res.data.status === errorCodeConfig.APIDefaultCode.Success
        ) {
          setPending(false);
          // if (res.data.data.length > 0) {
          setData(res?.data?.data);
          // }
        } else {
          setData(res?.data?.data);
          setBlock(false);
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
  };

  //** State List
  const getStateData = () => {
    StaticDataServices.getStateName()
      .then((res) => {
        if (
          res.status === 200 &&
          res.data.status === errorCodeConfig.APIDefaultCode.Success
        ) {
          const stateData = JSON.stringify(res.data.data);
          localStorage.setItem(
            "sList",
            encryptData.encryptData(JSON.stringify(stateData))
          );
        }
      })
      .catch((error) => { });
  };

  // **  Modal Open - row click
  // ** Don't Remove Commented Code
  // const onRowClickModal = (data) => {
  //   console.log("on row click", data);

  //   setCompanyName(data.companyName);
  //   setTradeName(data?.tradeName);
  //   setGstin(data?.gstinNumber);
  //   console.log("onRowClickModal called with data:", data);
  //   setRegType(data.regType);
  //   setClientId(data.clientId);
  //   setuserClientId(data.userClientId);
  //   setStateId(data.stateId);
  //   setStateName(data.stateName);
  //   setUserClientParentId(data.parentFK);
  //   setShow(true);
  //   setIsCMP08Applicable(data?.isCMP08Applicable);
  //   setRegTypeId(data.regTypeId)
  //   checkClick=true;

  // };

  const onRowClickModal = (data) => {
    console.log("on row click", data);
    setCompanyName(data.companyName);
    setTradeName(data?.tradeName);
    setGstin(data?.gstinNumber);
    setRegType(data?.regType);
    setClientId(data.clientId);
    setuserClientId(data.userClientId);
    setStateId(data.stateId);
    setStateName(data.stateName);
    setUserClientParentId(data.parentFK);
    setShow(true);
    setIsCMP08Applicable(data?.isCMP08Applicable);
    setRegTypeId(data.regTypeId)
    setRowDataLogin(data)
    checkClick = true;

    // Update session storage
    SessionFunction.setSessionValue(globleVariable.G_GSTIN, data.gstinNumber, true);

    if (data.regType) {
      SessionFunction.setSessionValue(globleVariable.G_RegType, data.regType, true);
    } else {
      SessionFunction.setSessionValue(globleVariable.G_RegType, data.regType, false);
    }

    SessionFunction.setSessionValue(globleVariable.G_TradeName, data.tradeName, true);

  };

  const monthDataFilter = filterCurrentMonthWise(MonthOptions, serverDate);



  //** Redirect route - Api services
  useEffect(() => {
    if (redirectApi == true) {
      const GFM = sessionStorage.getItem(globleVariable.G_FM) && SessionFunction?.getSessionValue(globleVariable.G_FM, true);
      const FinYear = sessionStorage.getItem(globleVariable.FinYear) && SessionFunction?.getSessionValue(
        globleVariable.FinYear,
        true
      );
      const FinMonth = sessionStorage.getItem(globleVariable.FinMonth) && SessionFunction?.getSessionValue(
        globleVariable.FinMonth,
        true
      );
      const GUCID = sessionStorage.getItem(globleVariable.G_UCID) && SessionFunction?.getSessionValue(
        globleVariable.G_UCID,
        true
      );
      const cmp08Flag = sessionStorage.getItem(globleVariable.isCMP08Applicable) && SessionFunction?.getSessionValue(
        globleVariable.isCMP08Applicable,
        false
      );


      setIsCMP08Applicable(cmp08Flag);

      CompanyNewService.getCompanyloggedData(GFM, FinYear).then((res) => {
        console.log(res);
        if (res.status == 200) {
          SessionFunction.setSessionValue(
            globleVariable.defaultYear,
            res.data.data,
            true
          );
          setRedirectApi(false);
          document
            .getElementById("DivisionAppContent")
            .classList.add("app-content");
          document
            .getElementById("DivisionAppContent")
            .classList.remove("app-content-new");

          navigate("/dashboard", {
            state: {
              clientId: GUCID, // sessionStorage.getItem("G_UCID"),
              finYear: FinYear, // sessionStorage.getItem("G_FY"),
              finMonth: FinMonth, // sessionStorage.getItem("G_FM"),
            },
          });
          // ** Dont' delete code
          // navigate("/gst-returns/gstr2b-summary", {
          //   state: {
          //     clientId: GUCID, // sessionStorage.getItem("G_UCID"),
          //     finYear: FinYear, // sessionStorage.getItem("G_FY"),
          //     finMonth: FinMonth, // sessionStorage.getItem("G_FM"),
          //   },
          // });
          // window.location.reload();
        }
      });
    }
  }, [redirectApi]);

  //** Delete Company
  const deleteOnClick = (row) => {
    // const clientId = row.clientId
    const clientId = row;

    return MySwal.fire({
      title: "Are you sure delete this record?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      customClass: {
        confirmButton: "btn btn-danger",
        cancelButton: "btn btn-outline-dark ms-1",
      },
      buttonsStyling: false,
      allowOutsideClick: false,
    })
      .then(function (result) {
        if (result.value) {
          CompanyNewService.deleteCompany(userIds, clientId, deletedBy)
            .then((res) => {
              console.log(res);
              if (
                res.status === 200 &&
                res.data.status === errorCodeConfig.APIDefaultCode.Success
              ) {
                toast.success(
                  res.data.successMessage,
                  {
                    position: "top-right",
                  },
                  2000
                );
                getCompanyData(userIds);
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
              });
            });
        }
      })
      .then(function () { });
  };

  //** onSubmit
  const onSubmit = (data) => {
    console.log(data, 'data');
    let redirectUrl = true;

    const finyear = selectedYear.value;
    const finmonth = data.finyearsmonth.value;
    const stateid = stateId;
    rowDataLogin?.username && encryptData.decrypt(rowDataLogin?.username)
    rowDataLogin?.password && encryptData.decrypt(rowDataLogin?.password)
    sessionStorage.setItem("U_N", rowDataLogin?.username ? encryptData.decrypt(rowDataLogin?.username) : '');
    sessionStorage.setItem("P_C", rowDataLogin?.password ? encryptData.decrypt(rowDataLogin?.password) : '');


    if (
      data.finyearstatus.value == "" ||
      data.finyearstatus.value == null ||
      (data.finyearstatus.value == "0" && data.finyearstatus.value == 0)
    ) {
      redirectUrl = false;
    } else if (
      finyear == "" ||
      (finmonth == null) | (finmonth == "0") ||
      finmonth.value == 0
    ) {
      redirectUrl = false;
    }

    if (redirectUrl == true || redirectUrl == "true") {
      sessionStorage.setItem(globleVariable.isCompany, true);
      // SessionFunction.setSessionValue(globleVariable.isCompany , 'true' , false);
      SessionFunction.setSessionValue(
        globleVariable.G_UCID,
        userClientId,
        true
      );
      SessionFunction.setSessionValue(globleVariable.G_FY, finyear, true);
      SessionFunction.setSessionValue(globleVariable.G_FM, finmonth, true);
      SessionFunction.setSessionValue(globleVariable.G_GSTIN, gstin, true);
      SessionFunction.setSessionValue(globleVariable.G_Name, companyName, true);
      SessionFunction.setSessionValue(globleVariable.G_TradeName, tradeName, true);
      SessionFunction.setSessionValue(globleVariable.G_State, stateid, true);
      SessionFunction.setSessionValue(globleVariable.G_SNm, stateName, true);
      SessionFunction.setSessionValue(
        globleVariable.G_UCParId,
        userClientParentId,
        true
      );
      SessionFunction.setSessionValue(globleVariable.G_RegType, regType, true);
      SessionFunction.setSessionValue(
        globleVariable.FinYear,
        selectedYear.label,
        true
      );
      SessionFunction.setSessionValue(
        globleVariable.FinMonth,
        data.finyearsmonth.label,
        true
      );
      // ** Set cMP04 valuei -  no decrupt
      SessionFunction.setSessionValue(
        globleVariable.isCMP08Applicable,
        isCMP08Applicable == "true" || isCMP08Applicable == true ? true : false,
        false
      );

      // ** Registration Type
      SessionFunction.setSessionValue(
        globleVariable.registrationType,
        regTypeId,
        false
      );


      dispatch(
        setFlags(
          isCMP08Applicable == "true" || isCMP08Applicable == true
            ? true
            : false
        )
      );
      setRedirectApi(true);
    }
  };

  // ** Modal close
  const closeModal = () => {
    clearErrors();
    setShow(false);
  };

  // **  import Company
  const onClickiImportCompanyFile = () => {
    inputFile.current.click();
  };



  // ** Import file
  const handleChange = (e) => {
    var fileName = e.target.files[0];

    if (e.target.files.length > 0) {
      if (
        fileName.name.lastIndexOf(".xlsx").toString().toLowerCase() === -1 &&
        fileName.name.lastIndexOf(".xls").toString().toLowerCase() === -1
      ) {
        toast.error(
          "Please note: only excel file formats are allowed. Please download the provided upload template, see the link below.",
          { position: "top-right" }
        );
      } else {
        const uploadData = new FormData();
        uploadData.append("File", fileName);
        setBlock(true);
        importCompany
          .uploadCompany(uploadData, userIds)
          .then((res) => {
            console.log(res);
            setBlock(false);
            if (
              res.status === 200 &&
              res.data.status === errorCodeConfig.APIDefaultCode.Success
            ) {
              toast.success(res.data.successMessage, {
                position: "top-right",
                duration: 3000,
              });
              getCompanyData(userIds);
              e.target.value = null;
            } else {
              if (res?.data?.data == undefined) {
                toast.error(res?.data?.errorMessage, {
                  position: "top-right",
                  duration: 3000,
                });
              } else {
                getCompanyData(userIds);

                resData = JSON.parse(JSON.stringify(res.data.data));

                // ** code  style
                let csssClass = "";
                let htmltblData =
                  "<div style='' class='import-error-height'><table class='table text-start' style=''><thead style='" +
                  csssClass +
                  "' ><tr style='" +
                  csssClass +
                  "'><th style='" +
                  csssClass +
                  "'>GSTIN/Row No</th><th style='" +
                  csssClass +
                  "'>Error</th>";
                for (let i = 0; i < resData.length; i++) {
                  htmltblData += `<tr style="${csssClass}"><td style="${csssClass}">${resData[i].item1}</td><td style="${csssClass};">${resData[i].item2}</td></tr>`;
                }

                htmltblData += "</tbody></table></div>";

                if (res.data.status == "-1714") {
                  return MySwal.fire({
                    title: "<strong>Import duplicate data:</strong>",

                    html: htmltblData,
                    customClass: {
                      confirmButton: "btn btn-danger",
                    },
                    buttonsStyling: false,
                    width: "60%",
                    height: "350px",
                  });
                } else {
                  return MySwal.fire({
                    title: "<strong>Import Error</strong>",
                    html: htmltblData,
                    customClass: {
                      confirmButton: "btn btn-danger",
                    },
                    buttonsStyling: false,
                    width: "60%",
                    height: "350px",
                  });
                }
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
    }
    e.target.value = null;
  };

  // ** bulk update
  const onClickiBulkUpdateCompanyFile = () => {
    bulkinputFile.current.click();
  };


  // ** Import file for bulkupdate
  const handleBulkUpdateChange = (e) => {
    var fileName = e.target.files[0];

    if (e.target.files.length > 0) {
      if (
        fileName.name.lastIndexOf(".xlsx").toString().toLowerCase() === -1 &&
        fileName.name.lastIndexOf(".xls").toString().toLowerCase() === -1
      ) {
        toast.error(
          "Please note: only excel file formats are allowed. Please download the provided upload template, see the link below.",
          { position: "top-right" }
        );
      } else {
        const uploadData = new FormData();
        uploadData.append("File", fileName);
        setBlock(true);
        importCompany
          .bulkupdateCompany(uploadData, userIds,subIds)
          .then((res) => {
            console.log(res);
            setBlock(false);
            if (
              res.status === 200 &&
              res.data.status === errorCodeConfig.APIDefaultCode.Success
            ) {
              toast.success(res.data.successMessage, {
                position: "top-right",
                duration: 3000,
              });
              getCompanyData(userIds);
              e.target.value = null;
            } else {
              if (res?.data?.data == undefined) {
                toast.error(res?.data?.errorMessage, {
                  position: "top-right",
                  duration: 3000,
                });
              } else {
                getCompanyData(userIds);

                resData = JSON.parse(JSON.stringify(res.data.data));

                // ** code  style
                let csssClass = "";
                let htmltblData =
                  "<div style='' class='import-error-height'><table class='table text-start' style=''><thead style='" +
                  csssClass +
                  "' ><tr style='" +
                  csssClass +
                  "'><th style='" +
                  csssClass +
                  "'>GSTIN/Row No</th><th style='" +
                  csssClass +
                  "'>Error</th>";
                for (let i = 0; i < resData.length; i++) {
                  htmltblData += `<tr style="${csssClass}"><td style="${csssClass}">${resData[i].item1}</td><td style="${csssClass};">${resData[i].item2}</td></tr>`;
                }

                htmltblData += "</tbody></table></div>";

                if (res.data.status == "-1714") {
                  return MySwal.fire({
                    title: "<strong>Import duplicate data:</strong>",

                    html: htmltblData,
                    customClass: {
                      confirmButton: "btn btn-danger",
                    },
                    buttonsStyling: false,
                    width: "60%",
                    height: "350px",
                  });
                } else {
                  return MySwal.fire({
                    title: "<strong>Import Error</strong>",
                    html: htmltblData,
                    customClass: {
                      confirmButton: "btn btn-danger",
                    },
                    buttonsStyling: false,
                    width: "60%",
                    height: "350px",
                  });
                }
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
    }
    e.target.value = null;
  };

  //** Handsontable Colunms
  const ColumneHandsonTbl = [
    {
      data: "srNo",
      title: "#",
      readOnly: true,
      className: "htCenter",
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "code",
      title: "Code No",
      readOnly: true,
      width: 100,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },

    },
    {
      data: "companyName",
      title: "Company Name",
      readOnly: true,
      width: 175,

    },

    {
      data: "tradeName",
      title: "Trade Name",
      readOnly: true,
      width: 175,
    },
    {
      data: "gstinNumber",
      title: "GSTIN",
      readOnly: true,
      width: 140,
    },
    {
      data: "groupName",
      title: "Group Name",
      readOnly: true,
      width: 120,
    },
    {
      data: "gstR1FilingType",
      title: "Filing Type",
      readOnly: true,
      width: 110,
    },

    {
      data: "registrationTypeLabel",
      title: "Reg. Type",
      readOnly: true,
      width: 110,
    },

    {
      data: "contactPersonMobileNo",
      title: "Mobile No",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
      width: 100,
    },
    {
      data: "contactPersonName",
      title: "Contact Person",
      readOnly: true,
      width: 130,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      title: "Action",
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
      width: 100,
    },

    // ** Move
    {
      title: "stateName",
      data: "state",
    },
    {
      data: "userClientId",
      title: "userClientId",
      readOnly: true,
    },
    {
      data: "parentUserClientId",
      title: "parentUserClientId",
      readOnly: true,
    },
    {
      data: "clientId",
      title: "clientId",
      readOnly: true,
    },
    {
      data: "stateId",
      title: "stateId",
      readOnly: true,
    },


    {
      data: "isCMP08Applicable",
      title: "isCMP08Applicable",
      readOnly: true,
    },
    {
      data: "username",
      title: "User Name",
      readOnly: true,
    },
    {
      data: "password",
      title: "Password",
      readOnly: true,
    },
  ];

  //** button - Action column
  function myLables(instance, td, row, col, prop, value, cellProperties) {
    Handsontable.renderers.TextRenderer.apply(this, arguments);
    td.innerHTML = `<div class="truncated">${value !== null && value !== "" ? value : ""
      }</div>`;
  }

  //** button - Action column
  function myBtns(instance, td, row, col, prop, value, cellProperties) {
    Handsontable.renderers.TextRenderer.apply(this, arguments);
    td.innerHTML =
      '<button class="btn add-edit"><i class="fa fa-edit" title="Edit"></i></button><button class="btn add-deactive" title="Delete"><i class="fa fa-trash"></i></button><button class="btn add-connect" title="Company Login"><i class="fa fa-sign-in"></i></button>';

    const hot = hotRef?.current?.hotInstance;
    if (row !== -1 && col == 10) {
      const clientId = instance.getDataAtCell(row, "clientId");
      // ** Deactive
      $(td)
        .find(".add-deactive")
        .on("click", (event) => {
          console.log("click delete");
          //  const { clientId } = hot?.getSourceDataAtRow(cellProperties.row) || {} ;
          deleteOnClick(clientId);
        });

      //** Edit
      $(td)
        .find(".add-edit")
        .on("click", (event) => {
          //  const { clientId } = hot?.getSourceDataAtRow(cellProperties.row);
          navigate(`/dashboard/company/edit?${encryptData.encrypt(clientId)}`, {
            state: { clientId: clientId },
          });
        });

      //** Connect
      $(td)
        .find(".add-connect")
        .on("click", (event) => {
          const obj = {
            companyName: instance?.getDataAtCell(row, "companyName"),
            gstinNumber: instance?.getDataAtCell(row, "gstinNumber"),
            regType: instance?.getDataAtCell(row, "registrationTypeLabel"),
            clientId: instance?.getDataAtCell(row, "clientId"),
            userClientId: instance?.getDataAtCell(row, "userClientId"),
            stateId: instance?.getDataAtCell(row, "stateId"),
            parentFK: instance?.getDataAtCell(row, "parentUserClientId"),
            stateName: stateName,
            tradeName: instance?.getDataAtCell(row, "tradeName"),
            username: instance?.getDataAtCell(row, "username"),
            password: instance?.getDataAtCell(row, "password"),
          };

          onRowClickModal(obj);
        });
    }
  }

  //** Page Click
  const handlePageClick = (event) => {
    setCurrentPage(event?.selected);
  };

  //** Hide filter / text align option
  const theader = (col, TH) => {
    if (
      col === 0 ||
      col === 10

    ) {
      const button = TH.children[0].children[0];
      button?.parentNode?.removeChild(button);
    }

    if (col == 0 || col == 10) {
      TH.className = "htCenter";
    } else {
      TH.className = "htLeft";
    }

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

      ColumneHandsonTbl.forEach((ele, index) => {
        const columnIndex = index;
        const buttonExists = document.querySelector(
          `.ht_clone_top thead th:nth-child(${columnIndex + 1}) button`
        );
        const columnMatchesCondition = Object.keys(finalObj).includes(ele.data);

        // Check if column value is not null
        const columnValueValid =
          finalObj[ele.data] !== null && finalObj[ele.data] !== "";
        // console.log(buttonExists,columnMatchesCondition,columnValueValid,"columnValueValidcolumnValueValid")

        if (buttonExists && columnMatchesCondition && columnValueValid) {
          const TH = document.querySelector(
            `.ht_clone_top thead th:nth-child(${columnIndex + 1})`
          );
          console.log(TH, "TH")

          if (TH) {
            TH.classList.add("htFiltersActive");
          } else {
            TH.classList.remove("htFiltersActive");
          }
        }
      });
    }
  };



  // ** Mouse click event handsontable
  function localAfterOnCellMouseDown(event, coords, td) {
    if (coords?.col != 10) {
      const hot = hotRef?.current?.hotInstance;
      setCurrentCol1(coords?.col);

      if (coords.row !== -1) {
        console.log(hot?.getSourceDataAtRow(coords.row));

        console.log(hot?.getDataAtRow(coords.row));



        if (hot?.getSourceDataAtRow(coords.row) !== undefined) {

          // Map the visual index to the data source index
          var dataSourceRowIndex = hot.toPhysicalRow(coords.row);

          // Retrieve data from the data source based on the data source index
          var rowData = hot.getSourceDataAtRow(dataSourceRowIndex);
          console.log(rowData, "rowDatarowData")


          const {
            companyName,
            gstinNumber,
            registrationTypeLabel,
            clientId,
            userClientId,
            stateId,
            parentUserClientId,
            state,
            tradeName,
            isCMP08Applicable,
            registrationType,
            username,
            password
          } = hot?.getSourceDataAtRow(coords.row) || {};


          if (coords.col == 2 || coords.col == 3) {
            console.log("in data");
            const obj = {
              companyName: companyName,
              gstinNumber: gstinNumber,
              regType: registrationTypeLabel,
              clientId: clientId,
              userClientId: userClientId,
              stateId: stateId,
              parentFK: parentUserClientId,
              stateName: state,
              tradeName: tradeName,
              isCMP08Applicable: isCMP08Applicable,
              regTypeId: registrationType,
              username:username,
              password:password
            };
            onRowClickModal(obj);
          }
        }
      }

      // ** Search Value set
      const Index = currentCol?.findIndex(
        (item) => ColumneHandsonTbl[coords?.col]?.data == item
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
  }

  const flag = isCompany == "false";
  //  sessionStorage.getItem("c") == "false";
  // if (flag) {
  //   const container = document.getElementById("gst-returnsabcd");
  //   if (container) {
  //     container.style.display = "none";
  //   }
  //   const container1 = document.getElementById("download-gstinabcd");
  //   if (container1) {
  //     container1.style.display = "none";
  //   }
  //   const container2 = document.getElementById("recoabcd");
  //   if (container2) {
  //     container2.style.display = "none";
  //   }
  //   const container3 = document.getElementById("reportsabcd");
  //   if (container3) {
  //     container3.style.display = "none";
  //   }
  //   const container4 = document.getElementById("ledgersabcd");
  //   if (container4) {
  //     container4.style.display = "none";
  //   }
  //   // console.log("container=", container, container1, container2)
  // }

  //** Clear filter
  const ClearFilter = () => {
    setCurrentCol([]);
    setCurrentCol1();
    setSearchVal1([]);
    setCurrentPage(0);
    getCompanyData(userIds);
  };

  function cellValueHover(row, col) {
    console.log("show dataes");
    console.log(row, col);
    const hot = hotRef?.current?.hotInstance;
    const hoverValue = hot.getDataAtCell(row, col);
    const arr = [{ row: row, col: col, comment: { value: hoverValue } }];
    return arr;
  }
  const eventFutureDate = useState(moment().add(3, 'm'))


  // ** Year select - onchagne
  // const handleYearChange = (e) => {
  //   sessionStorage.setItem("combinationYear",e.label)

  //   // const finYearOption = Math.max(min, Math.min(max, Number(event.target.value)));

  //   if (e.value == 1) {
  //     setSelectedYear(e);
  //     let filterMonth = MonthOptions.filter((p) => p.value < 4 || p.value > 6);
  //     if (filterMonth !== undefined) {
  //       setMonthArray(filterMonth);
  //       setValue("finyearsmonth", filterMonth[1]);
  //       // monthArray.push(filterMonth)
  //     }
  //   } else if (latestyear == e.value) {

  //     setMonthArray(monthDataFilter);

  //     // defaultMonth = monthDataFilter .filter(
  //     //   (p) => p.value == setMonth.replace(/^0+/, "")
  //     // )[0];

  //   if(checkRender){
  //     let filterMonth  =  MonthOptions.filter(
  //       (p) => p.value == defaultMonth.value
  //     )[0];
  //     defaultMonth = filterMonth
  //     if(defaultMonth?.value == 3 ){
  //       const yearListUser=finYearOption.filter((item)=> item?.value == e.value-1)[0]
  //       setValue("finyearstatus", yearListUser);
  //       setSelectedYear(yearListUser)
  //       setMonthArray(MonthOptions);
  //     } else {
  //       const yearListUser = finYearOption.filter((item)=> item?.value == e.value)[0]
  //       setValue("finyearstatus", yearListUser);
  //       setSelectedYear(yearListUser)
  //       setMonthArray(MonthOptions);
  //     }
  //   }else{
  //     setSelectedYear(e);
  //       defaultMonth = monthDataFilter .filter(
  //       (p) => p.value == setMonth.replace(/^0+/, "")
  //     )[0];
  //   }

  //     if (defaultMonth == undefined ||
  //         defaultMonth == null ||
  //         defaultMonth == ""
  //     ) {
  //         defaultMonth = monthDataFilter[0];
  //     }

  //     setValue("finyearsmonth", defaultMonth);
  //   }
  //   else {
  //     setSelectedYear(e);
  //     setMonthArray(MonthOptions);
  //     defaultMonth = MonthOptions.filter(
  //       (p) => p.value == setMonth.replace(/^0+/, "")
  //     )[0];

  //     if (
  //       defaultMonth == undefined ||
  //       defaultMonth == null ||
  //       defaultMonth == ""
  //     ) {
  //       defaultMonth = MonthOptions[0];
  //     }

  //     setValue("finyearsmonth", defaultMonth);
  //   }
  // };
  const handleYearChange = (e) => {
    setSelectedYear(e)
    console.log("year selection", e);
    if (e.value == 1) {
      let filterMonth = MonthOptions.filter(
        (p) => p.value < 4 || p.value > 6);
      if (filterMonth !== undefined) {
        setMonthArray(filterMonth)
        setValue("finyearsmonth", filterMonth[1]);
        // monthArray.push(filterMonth)
      }
      console.log("year selection", e, filterMonth);
    } else if (latestyear == e.value) {

      setMonthArray(monthDataFilter);
      defaultMonth = monthDataFilter.filter(
        (p) => p.value == setMonth.replace(/^0+/, "")
      )[0];

      if (defaultMonth == undefined ||
        defaultMonth == null ||
        defaultMonth == ""
      ) {
        defaultMonth = monthDataFilter[0];
      }

      setValue("finyearsmonth", defaultMonth);
    } else {
      setMonthArray(MonthOptions)
      defaultMonth = MonthOptions.filter(
        (p) => p.value == setMonth.replace(/^0+/, "")
      )[0];
      if (defaultMonth == undefined || defaultMonth == null || defaultMonth == '') {
        defaultMonth = MonthOptions[0]
      }
      setValue("finyearsmonth", defaultMonth);
      // monthArray.push(MonthOptions)
    }
  }

  const togglePopUp = (e) => {
    //  setIsRequestOpen(false);
    toggleCompose();
  };


  let GGSTIN =
    sessionStorage.getItem(globleVariable.G_GSTIN) &&
    SessionFunction.getSessionValue(globleVariable.G_GSTIN, true);

  if (GGSTIN == null) {
    SessionFunction.setSessionValue(globleVariable.G_GSTIN, gstin, true);
  }


  let GRegType =
    sessionStorage.getItem(globleVariable.G_RegType) &&
    SessionFunction.getSessionValue(globleVariable.G_RegType, regType, true);

  if (GRegType == null || GRegType == '') {
    SessionFunction.getSessionValue(globleVariable.G_RegType, regType, true);
  }

  let GTradeName =
    sessionStorage.getItem(globleVariable.G_TradeName) &&
    SessionFunction.getSessionValue(globleVariable.G_TradeName, tradeName, true);

  if (GTradeName == null) {
    SessionFunction.getSessionValue(globleVariable.G_TradeName, tradeName, true);
  }


  return (
    <Fragment>
      {block && <div className="loading1">Loading&#8230;</div>}
      <div className="content-header row py-1">
        <div className="content-header-left col-md-4 col-12">
          <div className="row breadcrumbs-top mb-0">
            <div className="col-12">
              {/* <Breadcrumbs title="Company Dashboard" data={[{ title: "" }]} /> */}
            </div>
          </div>
        </div>
        <div className="content-header-right text-md-end col-md-8 col-12 d-md-block d-none">
          <Button
            className="ms-1"
            color="outline-danger"
            onClick={templateDownload}
            id="templatedownload"
          >
            <i className="fa fa-file-excel-o"></i>
            <span className="align-middle ms-50">Template</span>
          </Button>
          <UncontrolledTooltip placement="top" target="templatedownload">
            Template [{keysMap.TEMPLATE_DOWNLOAD}]
          </UncontrolledTooltip>

          <Button
            className="ms-1"
            color="outline-danger"
            onClick={onClickiBulkUpdateCompanyFile}
            id="bulkupdate"
          >
            <Download size={14} />
            <span className="align-middle ms-50">Bulk Update</span>
          </Button>
          <UncontrolledTooltip placement="top" target="bulkupdate">
           Update Password In Bulk  
          </UncontrolledTooltip>


          <Button
            className="ms-1"
            color="outline-danger"
            id="addcompany"
            onClick={handleNavigate}
          >
            <Plus size={14} />
            <span className="align-middle ms-50">Add Company</span>
          </Button>
          <UncontrolledTooltip placement="top" target="addcompany">
            Add Company [{keysMap.ADD_COMPANY}]
          </UncontrolledTooltip>
          <Button
            className="ms-1"
            color="outline-danger"
            onClick={onClickiImportCompanyFile}
            id="importcompany"
          >
            <Download size={14} />
            <span className="align-middle ms-50">Bulk Import</span>
          </Button>
          <UncontrolledTooltip placement="top" target="importcompany">
            Import Company In Bulk [{keysMap.IMPORT_DATA}]
          </UncontrolledTooltip>
          <Button
            type="button"
            className="ms-1"
            outline
            color="danger"
            id="clearbtn"
            onClick={ClearFilter}
          >
            <i className="fa fa-filter fa-lg"></i>
            <span className="align-middle ms-50">Clear</span>
          </Button>
          <UncontrolledTooltip placement="top" target="clearbtn">
            Clear [{keysMap.CLEAR_DATA}]
          </UncontrolledTooltip>
        </div>
      </div>
      <Card>
        <div>
          <div>
            <Row>
              <Col className="tablecellfix">
              
                  <HotTable
                    columnSorting={true}
                    autoWrapRow={true}
                    afterGetColHeader={theader}
                    ref={hotRef}
                    // data={data}

                    data={data?.length > 0 ? data : [{ srNo: "No Data Found!" }]}
                    style={data?.length > 0 ? "" : {
                      textAlign: "center",
                      overflowX: "hidden",
                    }}
                    mergeCells={data?.length > 0 ? false : [
                      { row: 0, col: 0, rowspan: 1, colspan: 11 },
                    ]}
                    autoColumnSize={true}
                    rowHeaders={false}
                    stretchH="all"
                    height="450"
                    filters={true}
                    rowHeights={RowSize}
                    columnHeaderHeight={columnHeaderSize}
                    columns={ColumneHandsonTbl}
                    bindRowsWithHeaders={true}
                    readOnly={true}
                    licenseKey="non-commercial-and-evaluation"
                    // hiddenColumns={{
                    //   columns: data?.length > 0 ? [11, 12, 13, 14, 15, 16, 17, 18] : [10, 11, 12, 13, 14, 15, 16, 17, 18],
                    // }}
                    
                    
                    //  hiddenColumns={data?.length > 0  [{ columns: [11, 12, 13, 14, 15, 16, 17, 18]}] ? data : [{ columns: [10,11, 12, 13, 14, 15, 16, 17, 18] }]}
                    hiddenColumns={{
                      columns: [11, 12, 13, 14, 15, 16, 17, 18],
                    }}
                    afterOnCellMouseDown={localAfterOnCellMouseDown}
                    cells={function (row, col, prop) {
                      const hot = hotRef?.current?.hotInstance;
                      const cellPrp = {};
                      if (col == 2 || col == 3) {
                        cellPrp.className = "text-danger myRow";
                      }
                      if (col === 10) {
                        cellPrp.renderer = myBtns;
                        cellPrp.readOnly = true;
                      } else if (col == 1 || col == 2 || col == 3 || col == 5 || col == 9) {
                        if (col == 1) {
                          if (data?.[row]?.code?.length > 10) {
                            cellPrp.comment = {
                              value: data?.[row]?.code,
                              readOnly: true,
                              style: { width: 200, height: 50 },
                            };
                          }
                        }
                        if (col == 2) {
                          if (data?.[row]?.companyName?.length > 26) {
                            cellPrp.comment = {
                              value: data?.[row]?.companyName,
                              readOnly: true,
                              style: { width: 200, height: 50 },
                            };
                          }
                        }
                        if (col == 3) {
                          if (data?.[row]?.tradeName?.length > 26) {
                            cellPrp.comment = {
                              value: data?.[row]?.tradeName,
                              style: { width: 200, height: 50 },
                              readOnly: true,
                            };
                          }
                        }
                        if (col == 5) {
                          if (data?.[row]?.groupName?.length > 20) {
                            cellPrp.comment = {
                              value: data?.[row]?.groupName,
                              style: { width: 200, height: 50 },
                              readOnly: true,
                            };
                          }
                        }
                        if (col == 9) {
                          if (data?.[row]?.contactPersonName?.length > 16) {
                            cellPrp.comment = {
                              value: data?.[row]?.contactPersonName,
                              style: { width: 200, height: 50 },
                              readOnly: true,
                            };
                          }
                        }
                        //  }
                        cellPrp.renderer = myLables;
                      }

                      return cellPrp;
                    }}
                    className="myRow"
                    // id="Itc"
                    dropdownMenu={{
                      items: {
                        filter_by_value: {
                          name: "Search Value",
                          // hide the 'Filter by value' list from all columns but the first one
                        },

                        clear: {
                          name: `<button id='btnClear' name='Clear'  tabIndex="-1"  value='Clear'>Clear</button>`,
                          //disabled: true,
                          callback: function (key, selection, clickEvent) {
                            console.log("date picker clicked");
                            var src = clickEvent.target;
                            console.log("name", src.tagName);
                            if (src.tagName.toLowerCase() === "button") {
                              if (clickEvent.target.id == "btnClear") {
                                // console.log("custom menu2", key, selection, clickEvent, src,data);
                                var searchInput = document.querySelector(
                                  ".htUIMultipleSelectSearch.htUIInput"
                                );
                                var value = "";
                                const x = searchVal1;
                                let y = currentCol;
                                if (!searchVal1?.length) {
                                  x.push(value);
                                  y.push(ColumneHandsonTbl[currentCol1]?.data);
                                  setSearchVal1(x);
                                  setCurrentCol(y);
                                } else {
                                  const Index = currentCol?.findIndex(
                                    (item) =>
                                      ColumneHandsonTbl[currentCol1]?.data ==
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
                                      ColumneHandsonTbl[currentCol1]?.data
                                    );
                                    setSearchVal1(x);
                                    setCurrentCol(y);
                                  }
                                  // currentCol.map((item, index) => {
                                  //   if (
                                  //     item ==
                                  //     ColumneHandsonTbl[currentCol1]?.data
                                  //   ) {
                                  //     const xyz = searchVal1;
                                  //     xyz[index] = value;
                                  //     setSearchVal1(xyz);
                                  //   } else {
                                  //     x.push(value);
                                  //     let y = currentCol;
                                  //     y.push(
                                  //       ColumneHandsonTbl[currentCol1]?.data
                                  //     );
                                  //     // console.log("jsx=",x,y)
                                  //     setSearchVal1(x);
                                  //     setCurrentCol(y);
                                  //   }
                                  // });
                                }
                                var result = { userId: userIds };
                                y.forEach((key, i) => (result[key] = x[i]));
                                getCompanyData1(result);
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
                      var searchInput = document.querySelector(
                        ".htUIMultipleSelectSearch.htUIInput"
                      );
                      var value = searchInput?.children[0].value;
                      let y = currentCol;
                      const x = searchVal1;
                      if (!searchVal1?.length) {
                        x.push(value);
                        y.push(ColumneHandsonTbl[currentCol1]?.data);
                        setSearchVal1(x);
                        setCurrentCol(y);
                      } else {
                        const Index = currentCol?.findIndex(
                          (item) =>
                            ColumneHandsonTbl[currentCol1]?.data ==
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
                            ColumneHandsonTbl[currentCol1]?.data
                          );
                          setSearchVal1(x);
                          setCurrentCol(y);
                        }
                        // currentCol.map((item, index) => {
                        //   if (item == ColumneHandsonTbl[currentCol1]?.data) {
                        //     const xyz = searchVal1;
                        //     xyz[index] = value;
                        //     setSearchVal1(xyz);
                        //   } else {
                        //     x.push(value);
                        //     let y = currentCol;
                        //     y.push(ColumneHandsonTbl[currentCol1]?.data);
                        //     // console.log("jsx=",x,y)
                        //     setSearchVal1(x);
                        //     setCurrentCol(y);
                        //   }
                        // });
                      }
                      var result = { userId: userIds };
                      y.forEach((key, i) => (result[key] = x[i]));
                      getCompanyData1(result);
                    }}
                    // dropdownMenu={{
                    //   items: {
                    //     filter_by_value: {
                    //       name: "Search Value",
                    //       // hide the 'Filter by value' list from all columns but the first one
                    //     },

                    //     clear: {
                    //       name: `<button id='btnClear' name='Clear'  tabIndex="-1"  value='Clear'>Clear</button>`,
                    //       //disabled: true,
                    //       callback: function (key, selection, clickEvent) {
                    //         console.log("date picker clicked");
                    //         var src = clickEvent.target;
                    //         console.log("name", src.tagName);
                    //         if (src.tagName.toLowerCase() === "button") {
                    //           if (clickEvent.target.id == "btnClear") {
                    //             // console.log("custom menu2", key, selection, clickEvent, src,data);
                    //             var searchInput = document.querySelector(
                    //               ".htUIMultipleSelectSearch.htUIInput"
                    //             );
                    //             var value = "";
                    //             const x = searchVal1;
                    //             let y = currentCol;
                    //             if (!searchVal1?.length) {
                    //               x.push(value);
                    //               y.push(ColumneHandsonTbl[currentCol1]?.data);
                    //               setSearchVal1(x);
                    //               setCurrentCol(y);
                    //             } else {
                    //               currentCol.map((item, index) => {
                    //                 if (
                    //                   item ==
                    //                   ColumneHandsonTbl[currentCol1]?.data
                    //                 ) {
                    //                   const xyz = searchVal1;
                    //                   xyz[index] = value;
                    //                   setSearchVal1(xyz);
                    //                 } else {
                    //                   x.push(value);
                    //                   let y = currentCol;
                    //                   y.push(
                    //                     ColumneHandsonTbl[currentCol1]?.data
                    //                   );
                    //                   // console.log("jsx=",x,y)
                    //                   setSearchVal1(x);
                    //                   setCurrentCol(y);
                    //                 }
                    //               });
                    //             }
                    //             var result = { userId: userIds };
                    //             y.forEach((key, i) => (result[key] = x[i]));
                    //             getCompanyData1(result);
                    //           }
                    //           clickEvent.stopImmediatePropagation();
                    //         }

                    //         console.log("custom value", src.value);
                    //         clickEvent.stopImmediatePropagation();
                    //       },
                    //     },

                    //     filter_action_bar: {},
                    //   },
                    // }}
                    comments={true}
                  />
               
              </Col>
            </Row>
          </div>

          {/* Don't  delete  code */}
          {/* {
            data?.length > 0  && <ReactPaginate
              breakLabel="..."
              nextLabel=""
              onPageChange={handlePageClick}
              pageRangeDisplayed={2}
              pageCount={pageCountWithout}
              // pageCount={searchValue.length ? Math.ceil(filteredData.length / 7) : Math.ceil(data.length / 7) || 1}
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
          } */}
        </div>
      </Card>

      {/* Don't Remove This Commented Code */}
      {/*
      <Form className="mt-2 pt-50" onSubmit={handleSubmit(onSubmit)}>
        <Modal
          backdrop="static"
          isOpen={show}
          toggle={() => setShow(!show)}
          className="modal-dialog-centered"
        >
          <div className="modal-header">
            <h2 className="modal-title w-100 text-center">
              Select Return Year
            </h2>
            <div className="modal-actions">
              <a onClick={() => setShow(!show)} className="text-body">
                <X size={14} />
              </a>
            </div>
          </div>
          <hr></hr>
          <ModalBody className="px-sm-2 mx-30 pb-2">
            <Row tag="form" className="gy-1 pt-75">
              <Col xs={12}>
                <Label className="w20" for="cmpyName">
                  <b>Trade Name</b>
                </Label>
                <span className="w70">{tradeName}</span>
              </Col>
              <Col xs={6}>
                <Label className="form-label w30 " for="gstIn">
                  <b>GSTIN</b>
                </Label>
                <span className="w70">{gstin}</span>
              </Col>
              <Col xs={6}>
                <Label className="form-label w60" for="RegTYpe">
                  <b>Registration Type</b>
                </Label>
                <span className="w40">{regType}</span>
              </Col>

              <Col xs={6}>
                <Label className="form-label" for="status">
                  <b>Select Year</b>
                </Label>
                <Controller
                  id="finyearstatus"
                  name="finyearstatus"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select
                      isClearable={false}
                      // value={field.value}
                      value={selectedYear}
                      options={finYearOption}
                      defaultValue={defaultYear}
                      classNamePrefix="select"
                      theme={selectThemeColors}
                      //  onChange={field.onChange}
                      onChange={(e) => {
                        handleYearChange(e);
                      }}
                      className={classnames("react-select", {
                        "is-invalid": errors.finyearstatus && true,
                      })}
                    //  {...field}
                    />
                  )}
                />
                {errors.finyearstatus && (
                  <FormFeedback>Please select financial year</FormFeedback>
                )}
              </Col>

              <Col xs={6}>
                <Label className="form-label" for="months">
                  <b>Select Month</b>
                </Label>
                <Controller
                  id="finyearsmonth"
                  name="finyearsmonth"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select
                      isClearable={false}
                      value={field.value}
                      options={monthArray}
                      classNamePrefix="select"
                      theme={selectThemeColors}
                      onChange={field.onChange}
                      defaultValue={defaultMonth}
                      className={classnames("react-select", {
                        "is-invalid": errors.finyearsmonth && true,
                      })}
                      {...field}
                    />
                  )}
                />
                {errors.finyearsmonth && (
                  <FormFeedback>Please select month</FormFeedback>
                )}
              </Col>

              <Col xs={12} className="text-center pt-50">
                <Button type="submit" className="me-1" color="danger" outline>
                  Continue
                </Button>
                <Button
                  type="reset"
                  color="secondary"
                  outline
                  onClick={closeModal}
                >
                  Cancel
                </Button>
              </Col>
            </Row>
          </ModalBody>
        </Modal>
      </Form> */}

      <div className="mt-2 pt-50" onSubmit={handleSubmit(onSubmit)}>
        <CompanyFinanceSelect toggleCompose={() => setShow(!show)} composeOpen={show} />
      </div>


      <input
        type="file"
        id="file"
        ref={inputFile}
        onChange={(e) => handleChange(e)}
        style={{ display: "none" }}
      />

      <input
        type="file"
        id="file"
        ref={bulkinputFile}
        onChange={(e) => handleBulkUpdateChange(e)}
        style={{ display: "none" }}
      />
    </Fragment>
  );
};

export default companyDashboard;
