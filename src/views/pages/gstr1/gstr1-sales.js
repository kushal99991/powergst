import { Fragment, useRef, useState } from "react";
import Breadcrumbs from "@components/breadcrumbs";
import Wizard from "@components/wizard";
import { Outlet, useNavigate } from "react-router-dom";
import {
  Button,
  Modal,
  ModalBody,
  UncontrolledTooltip,
  Progress,
  Form,
  FormFeedback,
  Row,
  Col,
  Label,
  Input,
  Card,
  CardBody,
  UncontrolledButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import DropDownGstr1Import from "../../components/Dropdown-GSTR1-Import";
import db from "../../../firebase/firebase";
import DropDownGSTR1Exp from "../../components/dropDownGSTR1Exp/dropDownGSTR1Exp";
import { useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import {
  FilePlus,
  FileText,
  PlusSquare,
  Trash2,
  Send,
  File,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  DownloadCloud,
  Download, ChevronDown
} from "react-feather";
import { useHotkeys } from "react-hotkeys-hook";
import { keysMap, enableOnFormTags } from "../../../configs/config";
import DeleteModelGSTR1Sales from "../../components/models/DeleteModelGSTR1Sales";
import { useDispatch, useSelector } from "react-redux";
import gstr1SummaryServices from "../../../services/gstr1/gstr1Services/gstr1SummaryServices";
import Swal from "sweetalert2";
import errorCodeConfig from "../../../configs/apiErrorCodeConfig";
import { globleVariable } from "../../../configs/globalVariable";
import LocalFunction from "../../../configs/getLocalFunction";
import SessionFunction from "../../../configs/getSessionFunction";
import Gstr1Download from "./gstr1-download";
import GSTR1DownloadService from "../../../services/gstr1/gstr1Services/gstr1DownloadService";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";
import VerificationModal from "../../../views/pages/verification-otp/index";
import PanVerifyModal from "../../components/panVerifyModal/index"
import Gstr1FileDataSummary from "./gstr1-file-data-summary";
import SelectReco from "./selectReco";
import gstr1FileDataService from "../../../services/gstr1/gstr1DataFileService/gstr1FileDataService";
import { tokenExpiresRedirect } from "../../../utility/Utils";
import { downloadURL } from "../../../helper/downloadUrl";
import DownloadSampleModal from "../../components/DownloadSample/DownloadSampleModal";
import useConfirmRefresh from "../../../utility/hooks/useConfirmRefresh";
import { urlEndpointConfig } from "@configs/urlEndpoint";
import Select, { components } from "react-select"; // eslint-disable-line
import { selectThemeColors } from "@utils";
import makeAnimated from "react-select/animated";
import { SELECT_MAXSIZE } from "../../../configs/config";
import WithoutOtpModel from "../../components/WithoutOtpModel/WithoutOtpModel";



const animatedComponents = makeAnimated();
const defaultValues = {
  otp: "",
};

const SubmitForms = (props) => {

  const acKnowNoFileStatus = sessionStorage.getItem("gstR1AckNumber");
  const acKnowNoFileStatusDate = sessionStorage.getItem("gstR1AckNumberDate");

  const [block, setBlock] = useState(false);
  const [show, setShow] = useState(false);

  const [msgDisplay, setMsgDisplay] = useState(null);
  const [composeOpen, setComposeOpen] = useState(false);
  const toggleCompose1 = () => setComposeOpen(!composeOpen);

  const [selectedItem, setSelectedItem] = useState(null);
  const [panNo, setPanNo] = useState("");
  const [ackNum, setAckNum] = useState(null);

  const { clientIds, userIds, GSTIN, stepper, finYear, finMonth, wizardIndex } = props;

  const [composeOpenPan, setComposeOpenPan] = useState(false);
  const toggleComposePan = () => setComposeOpenPan(!composeOpenPan);
  const [selectedPan, setSelectedPan] = useState(null);


  const {
    control,
    setError,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm({ defaultValues });

  useEffect(() => {
    return () => setBlock(false);
  }, []);

  useEffect(() => {

    if (wizardIndex == 5) {

      returnFileStatus()
    }

  }, [wizardIndex])


  // ** Toggles close POPUP
  const togglePopUp = (e) => {
    reset();
    setShow(false);
  };

  const handleChangePanNo = (event) => {
    setPanNo(event.target.value.toUpperCase());
  };

  const FileGSTR1OnClick = (data) => {

    const payLoad = {
      userClientId: clientIds,
      userId: userIds,
      returnPeriod: sessionStorage.getItem("gstr1DownloadFromDt"),
      loggedGSTIN: GSTIN,
      otp: data.otp,
      panNumber: selectedPan,
    };

    setBlock(true);
    GSTR1DownloadService.fileGstr1Govt(payLoad)
      .then((res) => {
        if (
          res.status === 200 &&
          res.data.status === errorCodeConfig.APIDefaultCode.Success
        ) {
          const parsedData = JSON.parse(res.data.data);
          console.log("res.data.status", parsedData);
          setBlock(false);
          setAckNum(parsedData?.ack_num);

          if (parsedData?.ack_num !== null && parsedData?.ack_num != "") {
            sessionStorage.setItem("btnDisable", "5")
          }


          setShow(false);

          setValue("otp", null)

          toast.success(res?.data?.successMessage, {
            position: "top-right",
          });
        } else {
          setBlock(false);
          setShow(false);

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
  };

  // ** Open Model File GSTR1
  const openFileGSTR1 = () => {

    setComposeOpenPan(true)

  };



  // ** initate EVC OTP
  const initateEvcOtpOnClick = () => {

    const payLoad = {
      userClientId: clientIds,
      userId: userIds,
      returnPeriod: sessionStorage.getItem("gstr1DownloadFromDt"),
      loggedGSTIN: GSTIN,
      panNumber: selectedPan,
    };

    setBlock(true);
    GSTR1DownloadService.generateEvcOtpGovt(payLoad)
      .then((res) => {
        if (res.data.status === errorCodeConfig.APIDefaultCode.GovtOTPExpire) {
          setBlock(false);
          setMsgDisplay(res?.data?.errorMessage);

          setComposeOpen(true);

        } else {
          if (
            res.status === 200 &&
            res.data.status === errorCodeConfig.APIDefaultCode.Success
          ) {
            setBlock(false);
            setShow(!show);

            toast.success(res?.data?.successMessage, {
              position: "top-right",
            });
          } else {
            setBlock(false);
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

  // ** OnSubmit - File
  const onSubmit = (data) => {
    FileGSTR1OnClick(data);
  };


  useEffect(() => {
    if (selectedPan !== null && selectedPan !== "") {
      initateEvcOtpOnClick();
    }
  }, [selectedPan])


  // ** Escape key - disable
  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      // Prevent closing the modal when the Escape key is pressed
      e.stopPropagation();
    }
  };

  const govtErrorLog = (pageNo, IsNextStep) => {
    const payLoad = {
      userClientId: clientIds,
      userId: userIds,
      loggedGSTIN: GSTIN,
      pageStart: 0 + 1,
      pageSize: 10,
      ReturnPeriod:sessionStorage.getItem("gstr1DownloadFromDt")
    };

    setBlock(true);
    GSTR1DownloadService.gstr1GovtReturnLogStatus(payLoad)
      .then((res) => {
        if (
          res.status === 200 &&
          res.data.status === errorCodeConfig.APIDefaultCode.Success
        ) {
          setBlock(false);
          sessionStorage.setItem("btnDisable", res?.data?.data?.lastStatus);

          if (IsNextStep) {
            setBlock(false);
            //  stepper.next();
          }
        } else {
          setBlock(false);

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
  };


  // **  check user returnFileStatus
  const returnFileStatus = () => {

    const payLoad = {
      clientId: clientIds,
      gstinNumber: GSTIN,
      financialYearIdID: parseInt(finYear),
      month: parseInt(finMonth),
    };

    setBlock(true);
    GSTR1DownloadService.checkFiledUserStatus(payLoad).then((res) => {

      if (res.status === 200) {

        setBlock(false);
        if (res?.data?.data?.isGSTR1Filed) {

          if (res?.data?.data?.gstR1AcknowledgementNumber) {
            sessionStorage.setItem("gstR1AckNumber", res?.data?.data?.gstR1AcknowledgementNumber);
            sessionStorage.setItem("gstR1AckNumberDate", res?.data?.data?.gstR1AcknowledgementDate);
          } else {
            sessionStorage.removeItem("gstR1AckNumber");
            sessionStorage.removeItem("gstR1AckNumberDate");
          }
          sessionStorage.setItem("btnDisable", '5');

        } else {
          // sessionStorage.setItem("btnDisable", '');
          govtErrorLog(0)
        }

      }
    }).catch((error) => {
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

  let disableButton = sessionStorage.getItem("btnDisable") == undefined ||
    sessionStorage.getItem("btnDisable") == 'undefined' || parseInt(sessionStorage.getItem("btnDisable")) == 5 ? true :
    parseInt(sessionStorage.getItem("btnDisable")) == 4 ? false : true

  console.log("disableButton ->", disableButton, sessionStorage.getItem("btnDisable"))

  return (
    <>

      {block && <div className="loading1">Loading&#8230;</div>}

      <Row>
        <Col md={4}></Col>
        <Col md={4}>
          {parseInt(sessionStorage.getItem("btnDisable")) == 5 ? (
            <div className="d-flex justify-content-center mb-1">
              <CheckCircle size={35} color="#28c76f" />
            </div>
          ) : (
            ""
          )}
        </Col>
        <Col md={4}></Col>
      </Row>

      <Row>
        <Col md={4}></Col>
        <Col md={4}>
          <div className="d-grid mb-1 mb-lg-1">
            <Button
              className={disableButton == true ? "btn-icon disabledBtn" : "btn-icon "}
              outline
              color="danger"
              size="lg"
              onClick={openFileGSTR1}
              disabled={
                disableButton
              }
            >
              <File size={25} />
              <span className="align-middle ms-50 gstr1FilingButton">
                {
                  !sessionStorage.getItem("btnDisable") ||
                    sessionStorage.getItem("btnDisable") == undefined ||
                    sessionStorage.getItem("btnDisable") == "undefined" ||
                    parseInt(sessionStorage.getItem("btnDisable")) == 0 ||
                    parseInt(sessionStorage.getItem("btnDisable")) == 1 ||
                    parseInt(sessionStorage.getItem("btnDisable")) == 2 ||
                    parseInt(sessionStorage.getItem("btnDisable")) == 3 ||
                    parseInt(sessionStorage.getItem("btnDisable")) == 4
                    ? "File GSTR 1"
                    : "GSTR 1 Is Already Filed"}
              </span>
            </Button>
          </div>
        </Col>
        <Col md={4}></Col>
      </Row>

      {ackNum ? (
        <Row>
          <Col md={4}></Col>
          <Col md={4}>
            <div className="d-flex justify-content-center mb-0">
              <Label className="form-label">
                Acknowledgement Number : {ackNum}
              </Label>
            </div>
          </Col>
          <Col md={4}></Col>
        </Row>
      ) : (
        ""
      )}


      {acKnowNoFileStatus ? (
        <Row>
          <Col md={4}></Col>
          <Col md={4}>
            <div className="d-flex justify-content-center mb-2">
              <Label className="form-label">
                Acknowledgement Number : {acKnowNoFileStatus}
              </Label>
            </div>
          </Col>
          <Col md={4}></Col>
        </Row>
      ) : (
        ""
      )}

      {acKnowNoFileStatusDate ? (
        <Row>
          <Col md={4}></Col>
          <Col md={4}>
            <div className="d-flex justify-content-center mb-2">
              <Label className="form-label">
                Acknowledgement Date : {acKnowNoFileStatusDate}
              </Label>
            </div>
          </Col>
          <Col md={4}></Col>
        </Row>
      ) : (
        ""
      )}


      <div className="d-flex justify-content-between">
        <Button
          color="danger"
          className="btn-prev"
          onClick={() => stepper.previous()}
        >
          <ArrowLeft
            size={14}
            className="align-middle me-sm-25 me-0"
          ></ArrowLeft>
          <span className="align-middle d-sm-inline-block d-none">
            Previous
          </span>
        </Button>
      </div>

      <Form onSubmit={handleSubmit(onSubmit)}>
        <Modal
          backdrop="static"
          isOpen={show}
          onKeyDown={handleKeyDown}
          toggle={() => setShow(!show)}
          className="modal-dialog-centered modal-sm"
        >
          <div className="modal-header">
            <h2 className="modal-title w-100 text-center">OTP</h2>
          </div>
          <ModalBody >
            <Row tag="form" className="gy-1 pt-75">
              <Col xs={12}>
                <Label className="form-label">OTP</Label>
                <Controller
                  id="otp"
                  name="otp"
                  control={control}
                  rules={{
                    required: "Please enter valid OTP.",
                  }}
                  render={({ field }) => (
                    <Input
                      autoFocus
                      type="text"
                      placeholder="OTP"
                      invalid={errors.otp && true}
                      {...field}

                      onChange={(e) =>
                        field.onChange(
                          (e.target.value = e?.target?.value
                            ?.toString()
                            ?.toUpperCase())
                        )
                      }
                      onKeyPress={(e) => {
                        if (new RegExp(/[-a-zA-Z0-9]/).test(e.key)) {
                        } else e.preventDefault();
                      }}
                    />
                  )}
                />
                {errors.otp && (
                  <FormFeedback>{errors.otp.message}</FormFeedback>
                )}
              </Col>
              <Col xs={12} className="text-center mt-2 pt-50">
                <Button outline color="danger" className="me-1">
                  Submit{" "}
                </Button>
                <Button color="secondary" outline onClick={togglePopUp}>
                  Close
                </Button>
              </Col>
            </Row>
          </ModalBody>
        </Modal>
      </Form>
      <VerificationModal
        composeOpen={composeOpen}
        toggleCompose={toggleCompose1}
        userClientIds={clientIds}
        messageDisplay={msgDisplay}
        setSelectedItem={setSelectedItem}
        types="gstr1"
        otpGSTIN={GSTIN}
      ></VerificationModal>

      <PanVerifyModal
        composeOpen={composeOpenPan}
        toggleCompose={toggleComposePan}
        messageDisplay={msgDisplay}
        setSelectedPan={setSelectedPan}
      ></PanVerifyModal>

    </>
  );
};

const Gstr1Purchase = () => {
  const wizardRef = useRef(null);
  const navigate = useNavigate();

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

  const gstr1Range =
    sessionStorage.getItem(globleVariable.defaultYear) &&
    SessionFunction.getSessionValue(globleVariable.defaultYear, true);

  const queryParams = new URLSearchParams(location.search);
  const processFiled = queryParams.get("processGstr1Filling");
  const gstr1SalesNav = queryParams.get('gstr1SalesNav');

  let tabIndexFoucs = 0;
  if (processFiled == true || processFiled == "true") {
    tabIndexFoucs = 4;
  }
  else if (processFiled == false || processFiled == "false") {
    tabIndexFoucs = 4;
  }
  else if (location?.pathname == "/gst-returns/gstr1-sales/gstr1-summary-details") {
    tabIndexFoucs = 2
  }
  else if (gstr1SalesNav == "true" || gstr1SalesNav == true) {
    tabIndexFoucs = 2
  }

  const userDatadecrypt = LocalFunction.getLocalValue(
    globleVariable.userData,
    true
  );

  const userData = userDatadecrypt && JSON.parse(userDatadecrypt);
  const isMultipleCompanyDelete = userData && userData.data.isMultipleCompanyDelete;

  console.log("processFiled--->", processFiled, tabIndexFoucs);

  // ** State
  const [stepper, setStepper] = useState(null);
  const [summary, setSummary] = useState(true);
  const [activeTab, setactiveTab] = useState();
  const [progressModal, setProgressModal] = useState(false);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [fileYear, setFileYear] = useState("");
  const [progressMessage, setProgressMessage] = useState("");
  const [count, setCount] = useState(0);
  const [block, setBlock] = useState(false);
  const [modalshow, setModalshow] = useState(false);
  const [typeOfInvoice, settypeOfInvoice] = useState(activeTab);
  const [datas, setDatas] = useState([]);
  const [wizardBtn, setWizardBtn] = useState(tabIndexFoucs);
  const [exemptErrorArr, setExemptErrorArr] = useState([]);
  const [count1, setCount1] = useState(0);
  const [downloadStart, setDownloadStart] = useState(false)
  const [msgDisplay, setMsgDisplay] = useState(null);
  const [composeOpen, setComposeOpen] = useState(false);
  const toggleCompose1 = () => setComposeOpen(!composeOpen);
  const [panData, setPanData] = useState([]);
  const [displayType, setDisplayType] = useState([]);
  const [finFromYear, setFinFormYear] = useState(null);
  const [ackNo, setAckNo] = useState(null)
  const [sampleDownloadModal, setSampleDownloadModal] = useState(false)
  const [openWithoutOtpFailed, setopenWithoutOtpFailed] = useState(false);
const toggleComposeWithoutOtp = () => setopenWithoutOtpFailed(!openWithoutOtpFailed);

  const [btnExport, setBtnExport] = useState(false);
  const [isFromReconciliation , setIsFromReconciliation] = useState(null)
  const [deleteType , setDeleteType] = useState('single')
  // ** Delete
  const [deleteModalshow, setDeleteModalshow] = useState(false);
  // ** toggle Compose
  const toggleCompose = () => setDeleteModalshow(!deleteModalshow);

  const setGSRT1Data = (summary, tabBtnData) => {
    setSummary(summary);
    setactiveTab(tabBtnData);
  };



  useEffect(() => {

    setPanData(YearList);
    setDisplayType(true);

  }, []);

  useEffect(() => {
    console.log("default value");

    if (displayType == true) {
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
        sessionStorage.setItem("gstr1DownloadFromDt", defaultValueFrom?.value);
        SessionFunction.setSessionValue(
          globleVariable.gstr1FromDt,
          defaultValueFrom?.value,
          true
        );
      }
    }
  }, [displayType]);

  const invoiceList = activeTab?.InvoiceList?.filter(
    (p) => p.typeofInvoiceId < 17
  );

  //** Shortcut keys
  useHotkeys(
    keysMap.CLEAR_DATA,
    () => {
      !block && activeTab?.ClearFilter && activeTab.ClearFilter();
    },
    { enableOnFormTags }
  );
  useHotkeys(
    keysMap.EXPORT_DATA,
    () => {
      !block && !summary && activeTab.ExportSectionWiseData();
    },
    { enableOnFormTags }
  );
  useHotkeys(
    keysMap.DELETE_DATA,
    () => {
      !block && summary
        ? HideShowDeleteModel()
        : !activeTab.btnDisable1 && activeTab.deleteSaleInvoice();
    },
    { enableOnFormTags }
  );
  useHotkeys(
    keysMap.SAVE_DATA,
    () => {
      !block &&
        (activeTab.activeTab == 4 || activeTab.activeTab == 5) &&
        activeTab.ItcSavePurchaseInvoice();
    },
    { enableOnFormTags }
  );
  useHotkeys(
    keysMap.ADD_INVOICE,
    () => {
      !block && summary && invModalOpen();
    },
    { enableOnFormTags }
  );
  useHotkeys(
    keysMap.ADD_ENTRY,
    () => {
      !block && !summary && activeTab.activeTab == 3
        ? openAdddHSN()
        : activeTab.activeTab == 6
          ? openAdddAdvanceSummary()
          : activeTab.activeTab == 4
            ? openAdddDocs()
            : console.log("no open");
    },
    { enableOnFormTags }
  );

  wizardRef?.current?.addEventListener("shown.bs-stepper", function (event) {
    setWizardBtn(event?.detail?.indexStep);
  });

  const data1 =
    localStorage.getItem(globleVariable.userId) &&
      LocalFunction.getLocalValue(globleVariable.userId, true)
      ? LocalFunction.getLocalValue(globleVariable.userId, true)
      : " ";
  const G_UCParId =
    sessionStorage.getItem(globleVariable.G_UCParId) &&
    SessionFunction.getSessionValue(globleVariable.G_UCParId, true);
  const G_FY =
    sessionStorage.getItem(globleVariable.G_FY) &&
    SessionFunction.getSessionValue(globleVariable.G_FY, true);
  const G_FM =
    sessionStorage.getItem(globleVariable.G_FM) &&
    SessionFunction.getSessionValue(globleVariable.G_FM, true);
  const G_GSTIN =
    sessionStorage.getItem(globleVariable.G_GSTIN) &&
    SessionFunction.getSessionValue(globleVariable.G_GSTIN, true);
  const isfinYear = sessionStorage.getItem(globleVariable.gstr1FiledFromDt) && SessionFunction.getSessionValue(globleVariable.gstr1FiledFromDt, true)
  const isfinMonth = sessionStorage.getItem(globleVariable.gstr1FiledFromDt) && SessionFunction.getSessionValue(globleVariable.gstr1FiledFromDt, true)
  const gstr1FromDt =
    sessionStorage.getItem(globleVariable.gstr1FromDt) &&
    SessionFunction.getSessionValue(globleVariable.gstr1FromDt, true);
  const token = LocalFunction.getLocalValue(globleVariable.tokenKey, true);
  const userId = localStorage.getItem(globleVariable.userId) && LocalFunction.getLocalValue(globleVariable.userId, true);
  const subscriptionId = localStorage.getItem(globleVariable.subscriptionId) && LocalFunction.getLocalValue(globleVariable.subscriptionId, true);
  console.log(gstr1FromDt, "gstr1FromDt");
  console.log(G_UCParId, "userId");

  //**  Don't Remove This Code

  // useEffect(
  //   () =>
  //     onSnapshot(doc(db, "Gstr1ImportExcelProgress", data1), (doc) => {
  //       console.log(
  //         "new firestore changes1-Gstr1ImportExcelProgress",
  //         doc?.data()
  //       );
  //       if (doc?.data()) {
  //         console.log("progress data=", doc?.data()?.name);
  //         setCount(doc?.data()?.name);
  //         const newValue = doc?.data()?.name;
  //         const count11 = newValue?.split("/");
  //         setCount1(count11);

  //         console.log("count -Gstr1ImportExcelProgress", count11);

  //         if (count11?.length > 0) {
  //           setBtnExport(true);
  //         } else {
  //           setBtnExport(false);
  //         }
  //       } else {
  //         if (doc?.data() == null) {
  //           setCount("All");
  //         } else {
  //           setCount(0);
  //           setBtnExport(false);
  //         }
  //       }
  //     }),

  //   []
  // );

  // ** New Code For Show Progress-Bar And its Count
  useEffect(() => {
    let count11 = [];

    const progressBarStatus = onSnapshot(doc(db, "Gstr1ImportExcelProgress", data1), (doc) => {
      console.log("new firestore changes1-Gstr1ImportExcelProgress", doc?.data());
      if (doc?.data()) {
        console.log("progress data=", doc?.data()?.name);
        setCount(doc?.data()?.name);
        const newValue = doc?.data()?.name;
        count11 = newValue?.split("/");
        setCount1(count11);

        console.log("count -Gstr1ImportExcelProgress", count11);

        if (count11?.length > 0) {
          setBtnExport(true);
        } else {
          setBtnExport(false);
        }
      } else {
        if (doc?.data() == null) {
          setCount("All");
          const maxProgressBar = [count11[1], count11[1]]
          setCount1(maxProgressBar);
          console.log(count11, 'MaxCount')
        } else {
          setCount(0);
          setBtnExport(false);
        }
      }
    });

    return () => progressBarStatus();
  }, []);

  // ** Firestore
  useEffect(
    () =>
      onSnapshot(doc(db, "Gstr1ImportExcelProgressMessage", data1), (doc) => {
        console.log(
          "new firestore changes1-Gstr1ImportExcelProgressMessage",
          doc?.data()
        );
        if (doc?.data()) {
          console.log(
            "progress data=Gstr1ImportExcelProgressMessage",
            doc?.data()?.name
          );
          setProgressMessage(doc?.data()?.name);
        } else {
          if (doc?.data() == null) {
            // setCount('All')
          } else {
            setCount(0);
          }
          // setNotification([])
        }
      }),

    []
  );

  // ** Delete Modal Show/Hide
  const HideShowDeleteModel = () => {
    setDeleteModalshow(!deleteModalshow);
    if (isMultipleCompanyDelete == 0 ) {
      document.getElementById("btnDeletePurchase").blur();
    }

  };
  const handleFireStore = (value) => {
    // setSwitchOn(value)
    setCount1(0);
    setCount(0);
    setProgressMessage("");
    // debugger
  };

  const loadFunction = (value, fileName, selectedYear) => {
    setProgressModal(value);
    handleFireStore(false);
    console.log("progress value=", value, fileName, selectedYear);
    fileName?.name ? setFileName(fileName?.name) : setFileName("");
    fileName?.size ? setFileSize(formatBytes(fileName?.size)) : setFileSize("");
    selectedYear ? setFileYear(selectedYear) : setFileYear("");
    fileName && formatBytes(fileName?.size);
  };

  // use This custom hook - Avoid to direct Refresh while excel file import
  useConfirmRefresh(progressModal)

  useEffect(() => {
    tabIndexFoucs && stepper !== null && stepper.to(Number(tabIndexFoucs) + 1);
  }, [stepper]);

  const classNames = "dashboard-card-height"

  // ** Wizard Steps
  const steps = [
    {
      id: 'gstr1Filed-summary',
      title: 'Download E-Inv',
      content: <Gstr1FileDataSummary setGSRT1Data={setGSRT1Data} stepper={stepper} wizardBtn={wizardBtn} block={block} setBlock={setBlock} downloadStart={downloadStart} setDownloadStart={setDownloadStart} setWizardBtn={setWizardBtn} />
    },
    {
      id: 'importData',
      title: 'Import Data',
      content: <>
        <div className="d-flex justify-content-between">
          <h6> You are Importing the Excel File :- {finFromYear?.label}</h6>
          <span
            className="d-flex cursor-pointer"
            onClick={() => setSampleDownloadModal(true)}
          >
            <Download size={14} />
            <h6 className="text-danger" style={{ marginLeft: '5px' }}>Download Sample File</h6>
          </span>
        </div>
        <DownloadSampleModal onToggle={() => setSampleDownloadModal(!sampleDownloadModal)} open={sampleDownloadModal} modelFor="GSTR1" setBlock={setBlock} />
        <Row>
          <DropDownGstr1Import
            handleFireStore={handleFireStore}
            loadFunction={loadFunction}
            block={block}
            setBlock={setBlock}
            clientId={G_UCParId}
            finYear={G_FY}
            finMonth={G_FM}
            dateTitleShow={finFromYear?.label}
          // buttonDisable={btnExport}
          ></DropDownGstr1Import>


        </Row>

        <div style={{ zIndex: "999", }} className='btnFixFooter'>
          <div className="container">
            <div style={{ marginTop: "25px" }} className="d-flex justify-content-between">
              <Button
                color="danger"
                className="btn-prev"
                onClick={() => stepper.previous()}
              >
                <ArrowLeft
                  size={18}
                  className="align-middle me-sm-25 me-0"
                ></ArrowLeft>
                <span className="align-middle d-sm-inline-block d-none">
                  Previous
                </span>
              </Button>
              <Button
                color="danger"
                className="btn-next"
                onClick={() => stepper.next()}
              >
                <span className="align-middle d-sm-inline-block d-none">Next</span>
                <ArrowRight
                  size={14}
                  className="align-middle ms-sm-25 ms-0"
                ></ArrowRight>
              </Button>
            </div>
          </div>
        </div>
      </>
    },
    {
      id: "gstr1-summary",
      title: "Invoices Details",
      content: (
        <Outlet
          context={{
            setGSRT1Data,
            datas,
            setDatas,
            exemptErrorArr,
            setExemptErrorArr,
            block,
            setBlock,
            stepper,
            wizardBtn
          }}
        />
      ),
    },
    {
      id: 'genrateReco',
      title: 'Sales vs E-Inv Reco',
      content: <> <SelectReco wizardBtn={wizardBtn} stepper={stepper} /> </>
    },
    {
      id: "save-data",
      title: "Upload Data",
      className: "text-danger myRow",
      content: (
        <Gstr1Download
          userIds={data1}
          clientIds={G_UCParId}
          GSTIN={G_GSTIN}
          stepper={stepper}
          wizardIndex={wizardBtn}
          processGSTR1Filled={processFiled}
          setIsFromReconciliation={setIsFromReconciliation}
        ></Gstr1Download>
      ),
    },
    {
      id: "submit-return",
      title: "Submit",
      content: (
        <SubmitForms
          userIds={data1}
          clientIds={G_UCParId}
          GSTIN={G_GSTIN}
          stepper={stepper}
          finYear={G_FY}
          finMonth={G_FM}
          wizardIndex={wizardBtn}
        />
      ),
    },
  ];



  function formatBytes(bytes, decimals = 2) {
    if (!+bytes) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = [
      "Bytes",
      "KB",
      "MB",
      "GiB",
      "TiB",
      "PiB",
      "EiB",
      "ZiB",
      "YiB",
    ];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    // alert(`${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`)
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  }



  const loadFunctionExport = (value, fileName, selectedYear) => {
    setBlock(value);
  };

  const toggleModal = () => setModalshow(!modalshow);

  const invModalOpen = () => {
    setModalshow(!modalshow);
  };
  const openAdddAdvanceSummary = () => {
    activeTab.setAdvShow(true);
    activeTab.reset();
  };
  const openAdddHSN = () => {
    activeTab.setHsnShow(true);
    activeTab.reset();
  };
  const openAdddDocs = () => {
    activeTab.setDocShow(true);
    activeTab.reset();
  };

  const handleButtonClick = () => {
    window.open("/reconcilation/gstr1-vs-e-invoice", "_blank");
  };

  const GSTR1SalesSummaryService = () => {
      setBlock(true);
    gstr1SummaryServices
      .getGSTR1Summary(G_UCParId, gstr1FromDt, gstr1FromDt)
      .then((res) => {
        if (res.status === 200) {
          setBlock(false);
          setDatas(res.data.data);
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

  const deleteBtnLabel = keysMap.DELETE_DATA.split("+");
  const showDeleteLable =
    deleteBtnLabel[0] + "+" + deleteBtnLabel[1].substring(0, 3);

  console.log(showDeleteLable, "show label");

  const downloadGovtGstr1Filed = () => {
    setBlock(true)
    gstr1FileDataService.downloadGovtGSTR1Filed(G_UCParId, userId, gstr1FromDt)
      .then((res) => {
        console.log(res);
        setBlock(false);
        if (res.data.status === errorCodeConfig.APIDefaultCode.GovtOTPExpire) {
          // closeModal();
          setMsgDisplay(res?.data?.errorMessage)
          setBlock(false);

          setComposeOpen(true)
        } else {
          if (res?.status == 200 && res.data.status === errorCodeConfig.APIDefaultCode.Success) {
            setDownloadStart(true)
            // setDownloadModal(false)
            toast.success(res.data.successMessage, {
              position: "top-right",
            });
            setBlock(false)
          } else {
            toast.error(res?.data?.errorMessage, {
              position: "top-right",
            });
            // setDownloadModal(false)
          }
        }

      }).catch((error) => {
        setBlock(false);
        // setDownloadModal(false)
        Swal.fire({
          icon: "error",
          title: "",
          text: error?.message,
          customClass: {
            confirmButton: "btn btn-outline-danger",
          },
          buttonsStyling: false,
        });
      })
  }
  const downloadGovtGstr1FiledWithoutOTP = () => {
  
    setBlock(true)
    gstr1FileDataService.downloadGovtGSTR1FiledwihtoutOTP(G_UCParId, userId, gstr1FromDt)
      .then((res) => {
        console.log(res);
        setBlock(false);
        if (res?.status == 200 && res.data.status === errorCodeConfig.APIDefaultCode.Success) {
          setDownloadStart(true)
          toast.success(res.data.successMessage, {
            position: "top-right",
          });
          setBlock(false)
        }else  if (res.data.status === errorCodeConfig.APIDefaultCode.GovtOTPExpire) {
          setBlock(false)
          setopenWithoutOtpFailed(true)
        } else {
          toast.error(res?.data?.errorMessage, {
            position: "top-right",
          });
        }
      }).catch((error) => {
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
      })
  }

  const onClickExportAPIGSTR1Filed = () => {
    setBlock(true)
    gstr1FileDataService.exportGSTR1FiledExportDataSection(
      G_UCParId,
      isfinYear,
      isfinMonth,
      0,
      subscriptionId,
      userId,
      token
    )
      .then((res) => {
        if (res?.status == 200) {

          setBlock(false);

          if (res.data.data !== null) {
            downloadURL(res.data.data);
          } else {
            toast.error(res.data.errorMessage, {
              position: "top-right",
            });
          }
        } else if (res?.status == 401) {
          tokenExpiresRedirect();
        } else {

          setBlock(false);
          toast.error(res.headers.errormessage, {
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

  }


  const onClickExportJSONAPIGSTR1 = () => {
    const payLoad = {
      userClientId: G_UCParId,
      userId: LocalFunction.getLocalValue(globleVariable.userId, true),
      returnPeriod: sessionStorage.getItem("gstr1DownloadFromDt"),
      loggedGSTIN: G_GSTIN,
      IsFromReconciliation  : isFromReconciliation
    };
    setBlock(true);
    console.log(payLoad, "payLoadpayLoadpayLoadpayLoad");
    gstr1SummaryServices.Gstr1ExportJson(payLoad)
      .then((res) => {
        setBlock(false);

        if (
          res?.status === 200 &&
          res.data.status === errorCodeConfig.APIDefaultCode.Success
        ) {

          downloadURL(res?.data?.data);

          console.log(res?.data.data, "url");
          // toast.success(res.data.successMessage, {
          //   position: "top-right",
          // });
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

  const multipleDeleteFunc = (type) => {

      if (type == 'single') {
          setDeleteType('single')
      } else if (type == 'multiple') {
        setDeleteType('multiple')
      }
      HideShowDeleteModel()
  }



  return (
    <Fragment>
      {block && <div className="loading1">Loading&#8230;</div>}
      <div className="content-header row py-1">
        <div className="content-header-left col-md-4 col-12">
          <div className="row breadcrumbs-top">
            <div className="col-12">
              {summary ? (
                <Breadcrumbs
                  title="Purchase Summary"
                  data={[{ title: "GST Returns", link: urlEndpointConfig.GSTR_All }, { title: "GSTR 1 Summary" }]}
                />
              ) : (
                <Breadcrumbs
                  title="Purchase Summary"
                  data={[
                    { title: "GST Returns" },
                    {
                      title: "GSTR 1 Summary",
                      link: "/gst-returns/gstr1-sales?gstr1SalesNav=true",
                    },
                    { title: "GSTR 1 Data" },
                  ]}
                />
              )}
            </div>
          </div>
        </div>
        {wizardBtn === 2 && (
          <div className="content-header-right text-md-end col-md-8 col-12 d-md-block d-none">
            {summary ? (
              <>
                <Button
                  className="btn-icon me-1"
                  outline
                  color="danger"
                  id="btnNewPurchase"
                  // onClick={invModalOpen}
                  // onClick= {() => navigate("/reconcilation/gstr1-vs-e-invoice")}
                  onClick={handleButtonClick}
                >
                  <FileText size={14} />
                  <span className="align-middle ms-50">
                    Match Sales vs E-Inv
                  </span>
                </Button>
                <UncontrolledTooltip placement="top" target="btnNewPurchase">
                  Match Sales Data with E-Invoice
                </UncontrolledTooltip>
                <Button
                  className="btn-icon me-1"
                  outline
                  color="danger"
                  id="btnaddinvoice"
                  onClick={invModalOpen}
                >
                  <FilePlus size={14} />
                  <span className="align-middle ms-50">Add Inv</span>
                </Button>
                <UncontrolledTooltip placement="top" target="btnaddinvoice">
                  Add Invoice [{keysMap.ADD_INVOICE}]
                </UncontrolledTooltip>

                  {
                    isMultipleCompanyDelete == 0 &&
                    <><Button
                    className="btn-icon me-1"
                    outline
                    color="danger"
                    id="btnDeletePurchase"
                    onClick={HideShowDeleteModel}
                  >
                    <Trash2 size={14} />
                    <span className="align-middle ms-50">Delete</span>
                  </Button><UncontrolledTooltip placement="top" target="btnDeletePurchase">
                      Delete [{keysMap.DELETE_DATA}]
                    </UncontrolledTooltip></>
                  }

                   {
                     isMultipleCompanyDelete == 1 &&

                     <UncontrolledButtonDropdown>
                     <DropdownToggle color='danger' outline caret className="me-1">
                       <Trash2 size={14} />
                       <span className="align-middle ms-50">
                         Delete
                       </span>  &nbsp;
                       <ChevronDown size={14} />
                     </DropdownToggle>
                     <DropdownMenu className="dropdown-delete">
                       <DropdownItem  tag='a' onClick={() => multipleDeleteFunc('single') }  >Single Company Delete</DropdownItem>
                       <DropdownItem  tag='a' onClick={() => multipleDeleteFunc('multiple') }>Multiple Company Delete</DropdownItem>

                     </DropdownMenu>
                   </UncontrolledButtonDropdown>

                   }


                <DropDownGSTR1Exp

                  loadFunction={loadFunctionExport}
                  block={block}
                  clientId={G_UCParId}
                  finYear={gstr1FromDt}
                  finMonth={gstr1FromDt}
                  gstNumber={G_GSTIN}
                  SubscriptionId={subscriptionId}
                />

              </>
            ) : (
              <>
                {activeTab.activeTab == 5 && (
                  <Button
                    className="btn-icon me-1"
                    outline
                    color="danger"
                    id="btnSave"
                    onClick={activeTab.ItcSavePurchaseInvoice}
                  >
                    <PlusSquare size={14} />
                    <span className="align-middle ms-50">Save</span>
                    <UncontrolledTooltip placement="top" target="btnSave">
                      Save [{keysMap.SAVE_DATA}]
                    </UncontrolledTooltip>
                  </Button>
                )}
                {activeTab.activeTab == 3 && (
                  <Button
                    className="btn-icon me-1"
                    outline
                    color="danger"
                    id="btnAdd"
                    onClick={openAdddHSN}
                  >
                    <PlusSquare size={14} />
                    <span className="align-middle ms-50">Add HSN</span>
                    <UncontrolledTooltip placement="top" target="btnAdd">
                      Add HSN [{keysMap.ADD_ENTRY}]
                    </UncontrolledTooltip>
                  </Button>
                )}

                {activeTab.activeTab == 6 && (
                  <Button
                    className="btn-icon me-1"
                    outline
                    color="danger"
                    id="btnAdd"
                    onClick={openAdddAdvanceSummary}
                  >
                    <PlusSquare size={14} />
                    <span className="align-middle ms-50">Add Adv.Summary</span>
                    <UncontrolledTooltip placement="top" target="btnAdd">
                      Add Adv.Summary [{keysMap.ADD_ENTRY}]
                    </UncontrolledTooltip>
                  </Button>
                )}
                {activeTab.activeTab == 4 && (
                  <Button
                    className="btn-icon me-1"
                    outline
                    color="danger"
                    id="btnAdd"
                    onClick={openAdddDocs}
                  >
                    <PlusSquare size={14} />
                    <span className="align-middle ms-50">Add Docs</span>
                    <UncontrolledTooltip placement="top" target="btnAdd">
                      Add Docs [{keysMap.ADD_ENTRY}]
                    </UncontrolledTooltip>
                  </Button>
                )}

                {(activeTab.activeTab == 1 ||
                  activeTab.activeTab == 3 ||
                  activeTab.activeTab == 2 ||
                  activeTab.activeTab == 7 ||
                  activeTab.activeTab == 6) && (
                    <Button
                      className="btn-icon me-1"
                      outline
                      color="danger"
                      id="btnDelete"
                      disabled={activeTab.btnDisable1}
                      onClick={activeTab.deleteSaleInvoice}
                    >
                      <Trash2 size={14} />
                      <span className="align-middle ms-50">Delete</span>
                      <UncontrolledTooltip placement="top" target="btnDelete">
                        Delete [{showDeleteLable}]
                      </UncontrolledTooltip>
                    </Button>
                  )}

                <Button
                  type="button"
                  className="me-1"
                  outline
                  onClick={activeTab.ExportSectionWiseData}
                  disabled={activeTab.btnDisable1}
                  color="danger"
                  id="btnexp1"
                >
                  <i className="fa fa-file-excel-o"></i> {"    "}
                  Export
                  <UncontrolledTooltip placement="top" target="btnexp1">
                    Export [{keysMap.EXPORT_DATA}]
                  </UncontrolledTooltip>
                </Button>

                {(activeTab.activeTab == 1 ||
                  activeTab.activeTab == 2 ||
                  activeTab.activeTab == 7 ||
                  activeTab.activeTab == 6 ||
                  activeTab.activeTab == 3) && (
                    <Button
                      type="button"
                      className="me-1"
                      outline
                      color="danger"
                      onClick={activeTab.ClearFilter}
                      id="btnclr1"
                    >
                      <i className="fa fa-filter fa-lg"></i>
                      <span className="align-middle ms-50">Clear</span>
                      <UncontrolledTooltip placement="top" target="btnclr1">
                        Clear [{keysMap.CLEAR_DATA}]
                      </UncontrolledTooltip>
                    </Button>
                  )}
              </>
            )}
          </div>
        )}
        {
          wizardBtn == 0 && (
            <div className="content-header-right text-md-end col-md-8 col-12 d-md-block d-none">
              {/* <Button
                  type="button"
                  className="me-1"
                  outline
                  // onClick={() => setDownloadModal(true)}
                  onClick={downloadGovtGstr1Filed}
                  id="downloaddata"
                  // disabled={activeTab.btnDisable1}
                  color="danger"
                >
                  <DownloadCloud size={14} />
                  <span className="align-middle ms-50">Download</span>
                </Button>
              <UncontrolledTooltip placement="top" target="downloaddata">
                  Download [{keysMap.DOWNLOAD_GOVT_DATA}]
                </UncontrolledTooltip> */}
              <UncontrolledButtonDropdown>
                <DropdownToggle color='danger' outline caret className="me-1">
                  <DownloadCloud size={14} />
                  <span className="align-middle ms-50">
                    Download
                  </span>  &nbsp;
                  <ChevronDown size={14} />
                </DropdownToggle>
                <DropdownMenu className="dropdown-reconcilation-purchase-sumary">
                  <DropdownItem onClick={downloadGovtGstr1Filed} tag='a' >With OTP    </DropdownItem>
                  <DropdownItem onClick={downloadGovtGstr1FiledWithoutOTP} tag='a'>Without OTP  </DropdownItem>

                </DropdownMenu>
              </UncontrolledButtonDropdown>

              {/* Export Button  */}
              <Button
                type="button"
                className="me-1"
                outline
                onClick={onClickExportAPIGSTR1Filed}
                id="exportData"
                // disabled={activeTab.btnDisable1}
                color="danger"
              >
                <i className="fa fa-file-excel-o"></i>&nbsp; Export
              </Button>
              <UncontrolledTooltip placement="top" target="exportData">
                Export [{keysMap.EXPORT_SUMMARY_DATA}]
              </UncontrolledTooltip>
            </div>
          )
        }
        {
          wizardBtn == 4 && (
            <div className="content-header-right text-md-end col-md-8 col-12 d-md-block d-none">

              {/* Export JSON Button  */}
              <Button
                type="button"
                outline
                onClick={onClickExportJSONAPIGSTR1}
                id="exportjsonData"
                color="danger"
              >
                <i className="fa fa-file-code-o"></i>&nbsp; Export JSON
              </Button>
              <UncontrolledTooltip placement="top" target="exportjsonData">
                Export JSON
              </UncontrolledTooltip>
            </div>
          )
        }
      </div>
      <div className="horizontal-wizard">
        <Wizard
          instance={(el) => setStepper(el)}
          ref={wizardRef}
          steps={steps}
          options={{
            linear: false,
          }}
          className="gstr1-wizard"
        />
      </div>

      {deleteModalshow && (
        <DeleteModelGSTR1Sales
          Heading="Delete GSTR 1 Sales"
          SuccessButtonText="Delete"
          show={deleteModalshow}
          toggleCompose={toggleCompose}
          GSTR1SalesSummaryService={GSTR1SalesSummaryService}
          loadFunction={loadFunctionExport}
          Company_GSTIN={G_GSTIN}
          deleteType={deleteType}
        ></DeleteModelGSTR1Sales>
      )}

      <Modal
        backdrop="static"
        // isOpen={true}
        isOpen={progressModal}
        className={"modal-dialog-centered"}
      >
        <div className="modal-header">
          <h2 className="modal-title w-100 text-center">
            Import Excel Progress
          </h2>
        </div>
        <ModalBody>
          {true && (
            <div className="center-progress">
              <br />
              <span className="mt-3">
                <b>File Name : </b>
                {fileName}
              </span>
              <br />
              <span className="mt-3">
                <b>File Size : </b>
                {fileSize} | <b>Fin Mon - Year : </b>
                {fileYear}{" "}
              </span>
              <br />
              <br />
              <span className="mt-3">
                <b>
                  {progressMessage !== null && progressMessage !== ""
                    ? progressMessage
                    : "Please wait..."}
                </b>
              </span>
              <br />
              <br />
              <Progress
                color="#fce4e4"
                value={(Number(count1[0]) * 100) / Number(count1[1])}
              />
              <br />
              <span>{count} sheets completed</span>
            </div>
          )}
        </ModalBody>
      </Modal>

      {modalshow && (
        <PurchaseTypesModal
          typeOfInv={invoiceList}
          show={modalshow}
          toggleModal={toggleModal}
          frmType={"salesData"}
          redirectType="sales"
          returnDate={gstr1FromDt}
        ></PurchaseTypesModal>
      )}
      <VerificationModal
        composeOpen={composeOpen}
        toggleCompose={toggleCompose1}
        userClientIds={G_UCParId}
        messageDisplay={msgDisplay}
        otpGSTIN={G_GSTIN}
      ></VerificationModal>
       {openWithoutOtpFailed == true && (
      <WithoutOtpModel
       openWithoutOtpFailed={openWithoutOtpFailed}
       setopenWithoutOtpFailed={setopenWithoutOtpFailed}
       toggleComposeWithoutOtp={toggleComposeWithoutOtp}
       G_UCParId={G_UCParId}>
      </WithoutOtpModel>) }
    </Fragment>
  );
};

export default Gstr1Purchase;
