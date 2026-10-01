import { Fragment } from "react";
import Tabs from "./tabs";
// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  Input,
  Label,
  Button,
  CardTitle,
  CardBody,
  TabContent,
  TabPane,
  CardText,
  Table,
  Container,
} from "reactstrap";
import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Breadcrumbs from "@components/breadcrumbs";
import B2b from "./b2b";
import B2ba from "./b2ba";
import B2cl from "./b2cl";
import B2cla from "./b2cla";
import B2cs from "./b2cs";
import B2csa from "./b2csa";
import Cdnr from "./cdnr";
import Cdnra from "./cdnra";
import Cdnura from "./cdnura";
import Cdnur from "./cdnur";
import At from "./at";
import Ata from "./ata";
import Atadj from "./atadj";
import Atadja from "./atadja";
import Exemp from "./exemp";
import Exp from "./exp";
import Expa from "./expa";
import Docs from "./docs";
import HSN from "./hsnsum";
import { useDispatch, useSelector } from "react-redux";
import {
  getFailed,
  getDuplicate,
  getGSTR1ExcelValidateFiledData,
  handleGSTR1ExcelValidate,
} from "./store";

import gstr1PurchaseInvoiceService from "../../../../services/gstr1/gstr1Services/gstr1PurchaseInvoiceService";

import toast from "react-hot-toast";
import errorCodeConfig from "../../../../configs/apiErrorCodeConfig";
import { API_URL_RECO, API_URL_GSTR1, messageShowDuration } from "../../../../configs/config";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { globleVariable } from "../../../../configs/globalVariable";
import LocalFunction from "../../../../configs/getLocalFunction";
import SessionFunction from "../../../../configs/getSessionFunction";
import { downloadURL } from "../../../../helper/downloadUrl";

const MySwal = withReactContent(Swal);

LocalFunction.setLocalValue(globleVariable.d_data, JSON.stringify([]), true);
LocalFunction.setLocalValue(globleVariable.f_data, JSON.stringify([]), true);
LocalFunction.setLocalValue(globleVariable.p_data, JSON.stringify([]), true);

const ExcelValidationDataGSTR1 = () => {
  const location = useLocation();

  const token = LocalFunction.getLocalValue(globleVariable.tokenKey, true);

  const [withError, setWithError] = useState(0);
  const [passed, setPassed] = useState(0);
  const [block, setBlock] = useState(false);
  const dispatch = useDispatch();
  const [passData, setPassData] = useState([]);
  const [errorData, setErrorData] = useState([]);
  const [duplicateData, setDuplicateData] = useState([]);
  const [totalDuplicate, setTotalDuplicate] = useState(0);
  const [activeTab, setActiveTab] = useState("0");
  const [btnType, setBtnType] = useState("btnValidData");
  const [showErrobtn, setShowErrorBtn] = useState(false);
  const [GUID, setGUID] = useState(null);
  const [clearFilter, setClearFilter] = useState(0);

  const [flag, setFlag] = useState(true);
  const [block1, setBlock1] = useState(false);
  const [srcLoad, setSrcLoad] = useState(false);
  const [errorArr, setErrorArr] = useState([]);

  const navigate = useNavigate(null);

  const G_UCParId = SessionFunction.getSessionValue(
    globleVariable.G_UCParId,
    true
  );
  const G_GSTIN = SessionFunction.getSessionValue(globleVariable.G_GSTIN, true);
  const G_FY = SessionFunction.getSessionValue(globleVariable.G_FY, true);
  const G_FM = SessionFunction.getSessionValue(globleVariable.G_FM, true);

  useEffect(() => {
    return () => setBlock1(false);
  }, []);
  const store = useSelector((state) => state?.gstr1ExcelData);
  const loader = useSelector((state) => state?.gstr1ExcelData?.isLoading);

  // ** Validate
  const gstr1ExcelValidation = (statusId) => {
    let payLoad = {
      sheetName: "b2b",
      guid: location.state.importData.fileGuid,
      status: statusId,
      pageNumber: 0,
      pageSize: 0,
      sheetId: 0,
      orderByColumnName: "",
      orderBy: "",
      searchColumnName: [],
      searchValue: [],
      UserId: localStorage.getItem(globleVariable.userId) && LocalFunction.getLocalValue(globleVariable.userId, true)
    };

    dispatch(getGSTR1ExcelValidateFiledData(payLoad));
  };


  useEffect(() => {
    if (
      store?.GSTR1_EXCEL_VALIDATE == undefined &&
      btnType != "btnDuplicateData"
    ) {
      gstr1ExcelValidation(0);
    }
  }, [btnType]);



  let ImportData = null;
  let ImportedDate = null;
  let NewDateShow = null;
  if (location.state !== null) {
    ImportData =
      location.state.importData !== null ? location.state.importData : null;
    ImportedDate =
      location.state.importedDate !== null ? location.state.importedDate : null;
    NewDateShow =
      location.state.dateTitleShow !== null
        ? location.state.dateTitleShow
        : null;
  }

  // ** Save and Validate
  const validate = () => {
    let errorArray = [];

    errorArr &&
      errorArr
        .sort((a, b) => (a.tab > b.tab ? 1 : -1))
        .map((err) => {
          const tabName =
            err.tab == "0"
              ? "HSN"
              : err.tab == "1"
                ? "B2cs"
                : err.tab == "2"
                  ? "Docs"
                  : err.tab == "3"
                    ? "B2B"
                    : err.tab == "4"
                      ? "Exp"
                      : err.tab == "5"
                        ? "Cdnr"
                        : err.tab == "6"
                          ? "B2Ba"
                          : err.tab == "7"
                            ? "Expa"
                            : err.tab == "8"
                              ? "At"
                              : err.tab == "9"
                                ? "Cdnur"
                                : err.tab == "10"
                                  ? "B2cl"
                                  : err.tab == "11"
                                    ? "Atadj"
                                    : err.tab == "12"
                                      ? "Exemp"
                                      : err.tab == "13"
                                        ? "B2cla"
                                        : err.tab == "14"
                                          ? "Cdnra"
                                          : err.tab == "15"
                                            ? "Cdnura"
                                            : err.tab == "16"
                                              ? "Ata"
                                              : err.tab == "17"
                                                ? "Atadja"
                                                : err.tab == "18"
                                                  ? "B2csa"
                                                  : "Tab";

          const tabId =
            err.tab == "0"
              ? 18
              : err.tab == "1"
                ? 5
                : err.tab == "2"
                  ? 19
                  : err.tab == "3"
                    ? 1
                    : err.tab == "4"
                      ? 11
                      : err.tab == "5"
                        ? 7
                        : err.tab == "6"
                          ? 2
                          : err.tab == "7"
                            ? 12
                            : err.tab == "8"
                              ? 13
                              : err.tab == "9"
                                ? 9
                                : err.tab == "10"
                                  ? 3
                                  : err.tab == "11"
                                    ? 15
                                    : err.tab == "12"
                                      ? 17
                                      : err.tab == "13"
                                        ? 4
                                        : err.tab == "14"
                                          ? 8
                                          : err.tab == "15"
                                            ? 10
                                            : err.tab == "16"
                                              ? 14
                                              : err.tab == "17"
                                                ? 16
                                                : err.tab == "18"
                                                  ? 6
                                                  : 20;

          errorArray.push({
            rowNo: err.row,
            tabName: tabName,
            tabId: tabId,
            colName:err.colName.title,
            validationMsg: err.validationMsg, 
          });
        });
    console.log(errorArray, "errorArr...");
    if (errorArray.length === 0) {
      return MySwal.fire({
        title: "<strong>Error</strong>",
        icon: "error",
        html: <ErrorTable errorDataList={errorArray}></ErrorTable>,
        customClass: {
          confirmButton: "btn btn-danger",
        },
        buttonsStyling: false,
        width: 600,
        heightAuto: false,
      });
    } else {
      setBlock1(true);
      console.log("save & validate clicked");
      var gstr1Data =
        btnType == "btnInvalidData" ? store?.failedData : store?.duplicateData;

      const modifiedGstr1Data = gstr1Data?.map((item) => {
        if (item.data && item.data.length > 0) {
          const modifiedData = item.data.map((originalObject) => {
            const modifiedObject = {};
            for (const key in originalObject) {
              if (
                key !== "id" &&
                key !== "gstr1DetailId" &&
                key !== "srNo" &&
                key !== "status" &&
                key !== "totalNumber" &&
                key !== "isEdit" &&
                key !== "fkUserClientId"
              ) {
                modifiedObject[key] =
                  originalObject[key] !== null
                    ? String(originalObject[key])
                    : originalObject[key];
              } else {
                modifiedObject[key] = originalObject[key];
              }
            }
            return modifiedObject;
          });
          return { ...item };
        }
        return item;
      });

      const payload = {
        financialYearId: G_FM,
        userId: LocalFunction.getLocalValue(globleVariable.userId, true),
        importedDate: ImportedDate,

        month: G_FY,
        status: btnType == "btnInvalidData" ? 0 : 2,
        userClientId: G_UCParId,
        gstr1Data: modifiedGstr1Data,

        recipientGSTIN: G_GSTIN,
        isCompanyGSTIN: ImportData?.isCompanyGSTIN ?? null,
        fileType: ImportData?.fileType,
      };


      if (
        payload?.gstr1Data?.length == 0 ||
        payload?.gstr1Data[0]?.data?.length == 0
      ) {
        setBlock1(false);
        Swal.fire({
          icon: "error",
          title: "",
          text:
            btnType == "btnInvalidData"
              ? "Please change data in order to save and validate"
              : "Please select data in order to update",
          // confirmButtonColor: "#d33"
          customClass: {
            confirmButton: "btn btn-danger",
          },
        });
      } else {
        gstr1PurchaseInvoiceService
          .PurchaseFailedValidation(payload)
          .then((res) => {

            if (
              res.status === 200 &&
              res.data.status === errorCodeConfig.APIDefaultCode.Success
            ) {
              toast.success(res?.data?.successMessage,
                {
                  position: "top-right",
                  duration: messageShowDuration,
                });
              setBlock1(false);
              console.log("postmsg=", res?.data?.successMessage);
              setWithError(res?.data?.data?.failedData);
              setPassed(res?.data?.data?.passedData);
              setTotalDuplicate(res?.data?.data?.duplicateData);

              SessionFunction.setSessionValue(
                globleVariable.f_g1,
                "false",
                true
              );
              SessionFunction.setSessionValue(
                globleVariable.pc_g1,
                res?.data?.data?.passedData,
                true
              );
              SessionFunction.setSessionValue(
                globleVariable.dc_g1,
                res?.data?.data?.duplicateData,
                true
              );
              SessionFunction.setSessionValue(
                globleVariable.fc_g1,
                res?.data?.data?.failedData,
                true
              );

              if (
                res?.data?.data?.failedData == 0 &&
                res?.data?.data?.duplicateData == 0
              ) {
                // navigate('/gst-returns/gstr1-sales');
                navigate("/gst-returns/gstr1-sales?gstr1SalesNav=true");
              }

              SessionFunction.setSessionValue(
                globleVariable.ps_g1,
                res?.data?.data?.passedCount,
                true
              );
              SessionFunction.setSessionValue(
                globleVariable.ds_g1,
                res?.data?.data?.duplicateCount,
                true
              );
              SessionFunction.setSessionValue(
                globleVariable.fs_g1,
                res?.data?.data?.failedCount,
                true
              );

              setActiveTab(activeTab);

              if (btnType == "btnDuplicateData") {
                setBtnType("btnInvalidData");

                gstr1ExcelValidation(2);

                setTimeout(() => {

                  setBtnType("btnDuplicateData");
                  btnOnClickSave("btnDuplicateData");


                  sessionStorage.setItem(globleVariable.cv_g1, "change");
                  dispatch(getFailed([]));
                  dispatch(getDuplicate([]));

                  setActiveTab(activeTab);
                }, 200);
                dispatch(getFailed([]));
                dispatch(getDuplicate([]));
                setActiveTab(activeTab);
              } else if (btnType == "btnInvalidData") {
                gstr1ExcelValidation(0);
                setBtnType("btnValidData");

                setTimeout(() => {

                  res?.data?.data?.failedData == 0
                    ? setBtnType("btnValidData")
                    : setBtnType("btnInvalidData");
                  res?.data?.data?.failedData == 0
                    ? btnOnClickSave("btnValidData")
                    : btnOnClickSave("btnInvalidData");
                  sessionStorage.setItem(globleVariable.cv_g1, "change");
                  // SessionFunction.setSessionValue(globleVariable.cv_g1, "change", true)
                  //  setActiveTab(activeTab);
                }, 200);

                setActiveTab(activeTab);
                dispatch(getFailed([]));
                dispatch(getDuplicate([]));
              }
            } else {
              setBlock1(false);

              sessionStorage.setItem(globleVariable.cv_g1, "change");

              setWithError(res?.data?.data?.failedData);
              setPassed(res?.data?.data?.passedData);
              setTotalDuplicate(res?.data?.data?.duplicateData);

              SessionFunction.setSessionValue(
                globleVariable.f_g1,
                "false",
                true
              );
              SessionFunction.setSessionValue(
                globleVariable.pc_g1,
                res?.data?.data?.passedData,
                true
              );
              SessionFunction.setSessionValue(
                globleVariable.dc_g1,
                res?.data?.data?.duplicateData,
                true
              );
              SessionFunction.setSessionValue(
                globleVariable.fc_g1,
                res?.data?.data?.failedData,
                true
              );
              SessionFunction.setSessionValue(
                globleVariable.ps_g1,
                res?.data?.data?.passedCount,
                true
              );
              SessionFunction.setSessionValue(
                globleVariable.ds_g1,
                res?.data?.data?.duplicateCount,
                true
              );
              SessionFunction.setSessionValue(
                globleVariable.fs_g1,
                res?.data?.data?.failedCount,
                true
              );

              Swal.fire({
                icon: "error",
                title: "",
                text: res?.data?.errorMessage, // "Data not Validated"
                customClass: {
                  confirmButton: "btn btn-danger",
                },
                // confirmButtonColor: "#d33"
              }).then((result) => {
                if (result.isConfirmed) {
                  // window.location.reload();
                }
              });
              if (btnType == "btnDuplicateData") {

                setBtnType("btnValidData");
                gstr1ExcelValidation(2);


                setTimeout(() => {
                  setBtnType("btnDuplicateData");
                  btnOnClickSave("btnDuplicateData");
                  sessionStorage.setItem(globleVariable.cv_g1, "change");
                }, 200);
                dispatch(getFailed([]));
                dispatch(getDuplicate([]));
              } else if (btnType == "btnInvalidData") {
                gstr1ExcelValidation(0);
                setBtnType("btnValidData");


                setTimeout(() => {

                  res?.data?.data?.failedData == 0
                    ? setBtnType("btnValidData")
                    : setBtnType("btnInvalidData");

                  res?.data?.data?.failedData == 0
                    ? btnOnClickSave("btnValidData")
                    : btnOnClickSave("btnInvalidData");
                  sessionStorage.setItem(globleVariable.cv_g1, "change");

                }, 200);

                setActiveTab(activeTab);

                dispatch(getFailed([]));
                dispatch(getDuplicate([]));
              }
            }
          })
          .catch((error) => {
            setBlock1(false);
            Swal.fire({
              icon: "error",
              title: "",
              text: error?.message,
              customClass: {
                confirmButton: "btn btn-danger",
              },
            });
          });
      }
    }
  };

  useEffect(() => {
    if (
      ImportData !== null &&
      SessionFunction.getSessionValue(globleVariable.f_g1, true) == "true"
    ) {
      setWithError(ImportData.totalFailed);
      setPassed(ImportData.totalPass);
      setTotalDuplicate(ImportData.totalDuplicate);

      btnOnClick("btnInvalidData");
    } else {
      setWithError(SessionFunction.getSessionValue(globleVariable.fc_g1, true));
      setPassed(SessionFunction.getSessionValue(globleVariable.pc_g1, true));
      setTotalDuplicate(
        SessionFunction.getSessionValue(globleVariable.dc_g1, true)
      );
    }
  }, []);

  useEffect(() => {
    setTimeout(() => setBlock(true), 10);

    if (withError == 0) {
      setBtnType("btnInvalidData");
      // setActiveTab()
      // btnOnClickSave("btnInvalidData");
    } else {
      setBtnType("btnInvalidData");
      btnOnClickSave("btnInvalidData");
    }
  }, [withError]);

  useEffect(() => {
    LocalFunction.setLocalValue(
      globleVariable.d_data,
      JSON.stringify({}),
      true
    );
    LocalFunction.setLocalValue(
      globleVariable.f_data,
      JSON.stringify({}),
      true
    );
    LocalFunction.setLocalValue(
      globleVariable.p_data,
      JSON.stringify({}),
      true
    );
  }, [btnType]);

  useEffect(() => {
    setBlock(false);
    setTimeout(() => setBlock(true), 10);
    setTimeout(() => setBlock(false), 2000);
  }, [btnType]);

  useEffect(
    () => () => {
      dispatch(getFailed([]));
      dispatch(getDuplicate([]));
    },
    []
  );

  useEffect(() => {
    dispatch(handleGSTR1ExcelValidate([]));
  }, []);

  const tabRecord = (count, sheetName, sheetId, status) => {
    if (status == 1) {
      const x = JSON.parse(
        LocalFunction.getLocalValue(globleVariable.f_data, true)
      );
      x[sheetName] = count;

      LocalFunction.setLocalValue(
        globleVariable.f_data,
        JSON.stringify(x),
        true
      );
    } else if (status == 0) {
      const x = JSON.parse(
        LocalFunction.getLocalValue(globleVariable.p_data, true)
      );
      x[sheetName] = count;

      LocalFunction.setLocalValue(
        globleVariable.p_data,
        JSON.stringify(x),
        true
      );
    } else {
      const x = JSON.parse(
        LocalFunction.getLocalValue(globleVariable.d_data, true)
      );
      x[sheetName] = count;

      LocalFunction.setLocalValue(
        globleVariable.d_data,
        JSON.stringify(x),
        true
      );
    }
  };

  const toggleTab = (tab) => {
    setActiveTab(tab);
  };

  const btnOnClickSave = (e) => {
    dispatch(handleGSTR1ExcelValidate([]));

    document.getElementById("btnInvalidData")?.classList?.remove("active");
    document.getElementById("btnValidData")?.classList?.remove("active");
    document.getElementById("btnDuplicateData")?.classList?.remove("active");
    document.getElementById(e)?.classList?.add("active");

    setBtnType(e);
    setGUID(ImportData.guid);
    if (e == "btnInvalidData") {
      setShowErrorBtn(true);
    } else {
      setShowErrorBtn(false);
    }
  };

  const btnOnClick = (e) => {
    sessionStorage.setItem(globleVariable.cv_g1, "noChange");

    document.getElementById("btnInvalidData").classList.remove("active");
    document.getElementById("btnValidData").classList.remove("active");
    document.getElementById("btnDuplicateData").classList.remove("active");
    document.getElementById(e).classList.add("active");

    setBtnType(e);
    setGUID(ImportData.guid);
    if (e == "btnInvalidData") {
      setShowErrorBtn(true);
    } else {
      setShowErrorBtn(false);
    }

    let statusId = 0;

    if (e == "btnInvalidData") {
      statusId = 1;
    } else if (e == "btnValidData") {
      statusId = 0;
    } else if (e == "btnDuplicateData") {
      statusId = 2;
    }

    gstr1ExcelValidation(statusId);
  };

  const downloadErrorFileOnClick = () => {
    setBlock1(true);

    gstr1PurchaseInvoiceService
      .DownloadErrorFile(ImportData?.guid)
      .then((res) => {
        if (res.status == 200 && res.data.status === errorCodeConfig.APIDefaultCode.Success) {
          setBlock1(false);

          downloadURL(res?.data?.data);
        } else if (res?.status == 401) {
          tokenExpiresRedirect();
        } else {
          setBlock1(false);
          toast.error(res?.data?.errorMessage, {
            position: "top-right",
          });
        }
      })
      .catch((error) => {
        setBlock1(false);
        setSrcLoad(false);

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
  // Continue Button Click Function
  const redirectPageOnClick = () => {
    if (withError > 0 || totalDuplicate > 0) {
// Enable - breadcrumb,navbar,company gstin
      var divHeader = document.getElementById('divHeader')
      divHeader.style.pointerEvents = 'auto'

      var divCompanyTitle = document.getElementById('CompanyTitleDivision')
      divCompanyTitle.style.pointerEvents = 'auto'

      const parentBreadcrumb = document.getElementsByClassName("container")
      parentBreadcrumb[0].style.cursor = "default"
      parentBreadcrumb[1].style.cursor = "default"

      const parentMenuBar = document.querySelector(".horizontal-menu-wrapper")
      parentMenuBar.style.cursor = "default"

      navigate("/gst-returns/gstr1-sales");
    } else {
      return MySwal.fire({
        title: "Do you want to continue without validating data ?",
        icon: "warning",
        showCancelButton: true,
        customClass: {
          confirmButton: "btn btn-danger",
          cancelButton: "btn btn-outline-dark ms-1",
        },
        buttonsStyling: false,
        allowOutsideClick: false,
      }).then(function (result) {
        if (result.value) {
          // Enable - breadcrumb,navbar,company gstin
          var divHeader = document.getElementById('divHeader')
          divHeader.style.pointerEvents = 'auto'

          var divCompanyTitle = document.getElementById('CompanyTitleDivision')
          divCompanyTitle.style.pointerEvents = 'auto'

          const parentBreadcrumb = document.getElementsByClassName("container")
          parentBreadcrumb[0].style.cursor = "default"
          parentBreadcrumb[1].style.cursor = "default"

          const parentMenuBar = document.querySelector(".horizontal-menu-wrapper")
          parentMenuBar.style.cursor = "default"

          navigate("/gst-returns/gstr1-sales?gstr1SalesNav=true");
        }
      });
    }
  };

  const clearFilterTable = (tab) => {
    setClearFilter(tab);
  };

  useEffect(() => {
// Disable - breadcrumb,navbar,company gstin
    var divHeader = document.getElementById('divHeader')
    divHeader.style.pointerEvents = 'none'

    var divCompanyTitle = document.getElementById('CompanyTitleDivision')
    divCompanyTitle.style.pointerEvents = 'none'

    var divBreadcrumb = document.getElementById('divbreadcrumb')
    divBreadcrumb.style.pointerEvents = 'none'

    const parentBreadcrumb = document.getElementsByClassName("container")
    parentBreadcrumb[0].style.cursor = "not-allowed"
    parentBreadcrumb[1].style.cursor = "not-allowed"

    const parentMenuBar = document.querySelector(".horizontal-menu-wrapper")
    parentMenuBar.style.cursor = "not-allowed"

    const parentBreadCrumb1 = document.getElementById("divbreadcrumb-container")
    parentBreadCrumb1.style.cursor = "not-allowed"

  }, [])
  const hasCalledExport = sessionStorage.getItem('hasCalledExport');

  useEffect(() => {

    if (Number(ImportData?.totalFailed) > 0 && hasCalledExport == 'false') {

      downloadErrorFileOnClick()
      sessionStorage.setItem('hasCalledExport', true);
    }
  }, []);

  useEffect(() => {
// Disable - breadcrumb,navbar,company gstin
    const divHeader = document.getElementById('divHeader')
    divHeader.style.pointerEvents = 'none'

    const divCompanyTitle = document.getElementById('CompanyTitleDivision')
    divCompanyTitle.style.pointerEvents = 'none'

    const divBreadcrumb = document.getElementById('divbreadcrumb')
    divBreadcrumb.style.pointerEvents = 'none'

    const parentBreadcrumb = document.getElementsByClassName("container")
    parentBreadcrumb[0].style.cursor = "not-allowed"
    parentBreadcrumb[1].style.cursor = "not-allowed"

    const parentMenuBar = document.querySelector(".horizontal-menu-wrapper")
    parentMenuBar.style.cursor = "not-allowed"

    const parentBreadCrumb1 = document.getElementById("divbreadcrumb-container")
    parentBreadCrumb1.style.cursor = "not-allowed"

    return () => {
// Enable - breadcrumb,navbar,company gstin
        const divHeader = document.getElementById('divHeader')
        if (divHeader?.style?.pointerEvents !== 'auto')
            divHeader.style.pointerEvents = 'auto'

        const divCompanyTitle = document.getElementById('CompanyTitleDivision')
        if (divCompanyTitle?.style?.pointerEvents !== 'auto')
            divCompanyTitle.style.pointerEvents = 'auto'

        const divBreadcrumb = document.getElementById('divbreadcrumb')
        if (divBreadcrumb?.style?.pointerEvents)
            divBreadcrumb.style.pointerEvents = 'auto'

        const parentBreadcrumb = document.getElementsByClassName("container")
        if (parentBreadcrumb.length > 0) {
            parentBreadcrumb[0].style.cursor = "default"
            parentBreadcrumb[1].style.cursor = "default"
        }

        const parentMenuBar = document.querySelector(".horizontal-menu-wrapper")
        if (parentMenuBar?.style?.cursor)
            parentMenuBar.style.cursor = "default"

        const parentBreadCrumb1 = document.getElementById("divbreadcrumb-container")
        if (parentBreadCrumb1?.style?.cursor)
            parentBreadCrumb1.style.cursor = "default"

    }

} ,[])



  return (
    <Fragment>
      {(block1 || loader || loader == undefined) && (
        <div className="loading1">Loading&#8230;</div>
      )}
      <div id="divbreadcrumb-container">
        <div id="divbreadcrumb" className="content-header row py-1">
          <div className="content-header-left col-md-8 col-12">
            <div className="row breadcrumbs-top mb-0">
              <div className="col-12">
                <Breadcrumbs
                  title={"Panbased GSTIN"}
                  data={[
                    { title: "GST Returns" },
                    {
                      title: "GSTR 1 Sales",
                      link: "/gst-returns/gstr1-sales?gstr1SalesNav=true",
                    },
                    { title: "Excel-Validation" },
                    { title: NewDateShow },
                  ]}
                />
              </div>
            </div>
          </div>
          <div className="content-header-right text-md-end col-md-4 col-12 d-md-block d-none"></div>
        </div>
      </div>

      <Card>
        <CardBody>
          <Row>
            <Col md={7}>
              <Button
                outline
                color="danger"
                className="btn-excel-validation-active"
                size="sm"
                id="btnInvalidData"
                onClick={(e) => btnOnClick(e.target.id)}
              >
                {" "}
                With Error ({withError})
              </Button>{" "}
              <Button
                outline
                color="danger"
                size="sm"
                className="btn-excel-validation-active"
                id="btnValidData"
                onClick={(e) => btnOnClick(e.target.id)}
              >
                {" "}
                Passed ({passed})
              </Button>{" "}
              <Button
                outline
                color="danger"
                className="btn-excel-validation-active"
                size="sm"
                id="btnDuplicateData"
                onClick={(e) => btnOnClick(e.target.id)}
              >
                {" "}
                Duplicate ({totalDuplicate})
              </Button>{" "}
              &nbsp;
              {ImportData && (
                <span>Total Documents in file: {ImportData.totalRecord} </span>
              )}
            </Col>

            <Col
              md={5}
              className="d-flex align-items-center justify-content-end "
            >
              {showErrobtn && (
                <Button
                  color="danger"
                  size="sm"
                  onClick={downloadErrorFileOnClick}
                  className="btn-icon btn-round me-1"
                  id="exportGstr2b"
                  outline
                >
                  <i
                    className="fa fa-file-excel-o"
                    style={{ fontSize: "10px !important" }}
                  ></i>{" "}
                  {"    "}
                  Download Error
                </Button>
              )}
              {btnType == "btnValidData"}{" "}
              {btnType == "btnInvalidData" && (
                <Button
                  color="danger"
                  size="sm"
                  disabled={withError == 0}
                  className="btn-icon btn-round me-1"
                  id="exportGstr2b"
                  onClick={validate}
                  outline
                >
                  <i className="fa fa-save"></i> {"    "}
                  {"Save & Validate"}
                </Button>
              )}
              {btnType == "btnDuplicateData" && (
                <Button
                  color="danger"
                  size="sm"
                  disabled={totalDuplicate == 0}
                  className="btn-icon btn-round me-1"
                  id="exportGstr2b"
                  onClick={validate}
                  outline
                >
                  <i className="fa fa-edit"></i> {"    "}
                  {"Update"} {"   "}
                </Button>
              )}
              <Button
                color="danger"
                size="sm"
                className="btn-icon btn-round me-1"
                id="excleValidContinue"
              
                onClick={redirectPageOnClick}
              >
                <i className="fa fa-sign-in btn-danger"></i> {"    "}
                {"Continue"}
              </Button>
              <Button
                color="danger"
                size="sm"
                className="btn-icon btn-round"
                id="excleValidContinue"
                outline
                onClick={clearFilterTable}
              >
                <i className="fa fa-filter fa-lg"></i> {"    "}
                {"Clear"}
              </Button>
            </Col>
          </Row>
          <br />
          <Row>
            <Col>
              {console.log("Active tab=", activeTab)}

              <Tabs
                className="mb-2"
                activeTab={activeTab}
                toggleTab={toggleTab}
                data={ImportData && ImportData.sheetWiseCount}
                btnType={btnType}
                clearFilterTable={clearFilterTable}
              />
              {block ? (
                <Fragment>
                  <CardText className="mb-0 mt-1 text-white">
                    Please Wait...
                  </CardText>
                </Fragment>
              ) : (
                <TabContent activeTab={activeTab}>
                  <TabPane tabId="0" key="0">
                    {activeTab == 0 && (
                      <B2b
                        btnType={btnType}
                        activeTab={activeTab}
                        data={ImportData}
                        tabRecord={tabRecord}
                        clearFilter={clearFilter}
                        errorArr={errorArr}
                        setErrorArr={setErrorArr}
                      ></B2b>
                    )}
                  </TabPane>
                  <TabPane tabId="1" key="1">
                    {activeTab == 1 && (
                      <B2ba
                        btnType={btnType}
                        activeTab={activeTab}
                        data={ImportData}
                        tabRecord={tabRecord}
                        clearFilter={clearFilter}
                        errorArr={errorArr}
                        setErrorArr={setErrorArr}
                      ></B2ba>
                    )}
                  </TabPane>
                  <TabPane tabId="2" key="2">
                    {activeTab == 2 && (
                      <B2cl
                        btnType={btnType}
                        activeTab={activeTab}
                        data={ImportData}
                        tabRecord={tabRecord}
                        clearFilter={clearFilter}
                        errorArr={errorArr}
                        setErrorArr={setErrorArr}
                      ></B2cl>
                    )}
                  </TabPane>
                  <TabPane tabId="3" key="3">
                    {activeTab == 3 && (
                      <B2cla
                        btnType={btnType}
                        activeTab={activeTab}
                        data={ImportData}
                        tabRecord={tabRecord}
                        clearFilter={clearFilter}
                        errorArr={errorArr}
                        setErrorArr={setErrorArr}
                      ></B2cla>
                    )}
                  </TabPane>

                  <TabPane tabId="4" key="4">
                    {activeTab == 4 && (
                      <Cdnr
                        btnType={btnType}
                        activeTab={activeTab}
                        data={ImportData}
                        tabRecord={tabRecord}
                        clearFilter={clearFilter}
                        errorArr={errorArr}
                        setErrorArr={setErrorArr}
                      ></Cdnr>
                    )}
                  </TabPane>

                  <TabPane tabId="5" key="5">
                    {activeTab == 5 && (
                      <Cdnur
                        btnType={btnType}
                        activeTab={activeTab}
                        data={ImportData}
                        tabRecord={tabRecord}
                        clearFilter={clearFilter}
                        errorArr={errorArr}
                        setErrorArr={setErrorArr}
                      ></Cdnur>
                    )}
                  </TabPane>

                  <TabPane tabId="6" key="6">
                    {activeTab == 6 && (
                      <At
                        btnType={btnType}
                        activeTab={activeTab}
                        data={ImportData}
                        tabRecord={tabRecord}
                        clearFilter={clearFilter}
                        errorArr={errorArr}
                        setErrorArr={setErrorArr}
                      ></At>
                    )}
                  </TabPane>

                  <TabPane tabId="7" key="7">
                    {activeTab == 7 && (
                      <Atadj
                        btnType={btnType}
                        activeTab={activeTab}
                        data={ImportData}
                        tabRecord={tabRecord}
                        clearFilter={clearFilter}
                        errorArr={errorArr}
                        setErrorArr={setErrorArr}
                      ></Atadj>
                    )}
                  </TabPane>

                  <TabPane tabId="8" key="8">
                    {activeTab == 8 && (
                      <Exemp
                        btnType={btnType}
                        activeTab={activeTab}
                        data={ImportData}
                        tabRecord={tabRecord}
                        clearFilter={clearFilter}
                        errorArr={errorArr}
                        setErrorArr={setErrorArr}
                      ></Exemp>
                    )}
                  </TabPane>

                  <TabPane tabId="9" key="9">
                    {activeTab == 9 && (
                      <B2cs
                        btnType={btnType}
                        activeTab={activeTab}
                        data={ImportData}
                        tabRecord={tabRecord}
                        clearFilter={clearFilter}
                        errorArr={errorArr}
                        setErrorArr={setErrorArr}
                      ></B2cs>
                    )}
                  </TabPane>

                  <TabPane tabId="18" key="18">
                    {activeTab == 18 && (
                      <B2csa
                        btnType={btnType}
                        activeTab={activeTab}
                        data={ImportData}
                        tabRecord={tabRecord}
                        clearFilter={clearFilter}
                        errorArr={errorArr}
                        setErrorArr={setErrorArr}
                      ></B2csa>
                    )}
                  </TabPane>

                  <TabPane tabId="11" key="11">
                    {activeTab == 11 && (
                      <Cdnra
                        btnType={btnType}
                        activeTab={activeTab}
                        data={ImportData}
                        tabRecord={tabRecord}
                        clearFilter={clearFilter}
                        errorArr={errorArr}
                        setErrorArr={setErrorArr}
                      ></Cdnra>
                    )}
                  </TabPane>

                  <TabPane tabId="12" key="12">
                    {activeTab == 12 && (
                      <Cdnura
                        btnType={btnType}
                        activeTab={activeTab}
                        data={ImportData}
                        tabRecord={tabRecord}
                        clearFilter={clearFilter}
                        errorArr={errorArr}
                        setErrorArr={setErrorArr}
                      ></Cdnura>
                    )}
                  </TabPane>

                  <TabPane tabId="13" key="13">
                    {activeTab == 13 && (
                      <Ata
                        btnType={btnType}
                        activeTab={activeTab}
                        data={ImportData}
                        tabRecord={tabRecord}
                        clearFilter={clearFilter}
                        errorArr={errorArr}
                        setErrorArr={setErrorArr}
                      ></Ata>
                    )}
                  </TabPane>

                  <TabPane tabId="14" key="14">
                    {activeTab == 14 && (
                      <Atadja
                        btnType={btnType}
                        activeTab={activeTab}
                        data={ImportData}
                        tabRecord={tabRecord}
                        clearFilter={clearFilter}
                        errorArr={errorArr}
                        setErrorArr={setErrorArr}
                      ></Atadja>
                    )}
                  </TabPane>

                  <TabPane tabId="15" key="15">
                    {activeTab == 15 && (
                      <Exp
                        btnType={btnType}
                        activeTab={activeTab}
                        data={ImportData}
                        tabRecord={tabRecord}
                        clearFilter={clearFilter}
                        errorArr={errorArr}
                        setErrorArr={setErrorArr}
                      ></Exp>
                    )}
                  </TabPane>

                  <TabPane tabId="16" key="16">
                    {activeTab == 16 && (
                      <Expa
                        btnType={btnType}
                        activeTab={activeTab}
                        data={ImportData}
                        tabRecord={tabRecord}
                        clearFilter={clearFilter}
                        errorArr={errorArr}
                        setErrorArr={setErrorArr}
                      ></Expa>
                    )}
                  </TabPane>

                  <TabPane tabId="10" key="10">
                    {activeTab == 10 && (
                      <HSN
                        btnType={btnType}
                        activeTab={activeTab}
                        data={ImportData}
                        tabRecord={tabRecord}
                        clearFilter={clearFilter}
                        errorArr={errorArr}
                        setErrorArr={setErrorArr}
                      ></HSN>
                    )}
                  </TabPane>

                  <TabPane tabId="17" key="17">
                    {activeTab == 17 && (
                      <Docs
                        btnType={btnType}
                        activeTab={activeTab}
                        data={ImportData}
                        tabRecord={tabRecord}
                        clearFilter={clearFilter}
                        errorArr={errorArr}
                        setErrorArr={setErrorArr}
                      ></Docs>
                    )}
                  </TabPane>
                </TabContent>
              )}
            </Col>
          </Row>
        </CardBody>
      </Card>
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
    uniqueArray
      .sort((a, b) => (a.tabId > b.tabId ? 1 : -1))
      .map((item, i) => (
        <tr>
          <td>{i + 1}</td>
          <td>{item.tabName}</td>
          <td>{item.rowNo + 1}</td>
          <td>{item.colName}</td>
          <td>{item.validationMsg}</td>
        </tr>
      ));

  return (
    <div className="errorTable_container scroll-container-popup">
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Sr No</th>
            <th>Tab Name</th>
            <th>Row Number</th>
            <th>Column Name</th>
            <th>Error</th>
          </tr>
        </thead>
        <tbody
          style={{
            overflow: "auto",
            height: "100px",
          }}
        >
          {itemList}
        </tbody>
      </Table>
    </div>
  );
}

export default ExcelValidationDataGSTR1;
