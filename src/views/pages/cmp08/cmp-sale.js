// commit test
import { Fragment, useRef, useState } from "react";
import Breadcrumbs from "@components/breadcrumbs";
import Wizard from "@components/wizard";
import { Outlet } from "react-router-dom";
import {
  Button,
  Modal,
  ModalBody,
  Progress,
  Row,
  Col,
  Form,
  Label,
  FormFeedback,
  Input,UncontrolledButtonDropdown, DropdownToggle,DropdownMenu ,DropdownItem
} from "reactstrap";
import db from "../../../firebase/firebase";
import { useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { CheckCircle, ArrowLeft, File, ChevronDown  } from "react-feather";
import { useHotkeys } from "react-hotkeys-hook";
import { keysMap, enableOnFormTags } from "../../../configs/config";
import Swal from "sweetalert2";
import { globleVariable } from "../../../configs/globalVariable";
import LocalFunction from "../../../configs/getLocalFunction";
import SessionFunction from "../../../configs/getSessionFunction";
import CMPDownload from "./cmp-download";
import { useForm, Controller } from "react-hook-form";
import errorCodeConfig from "../../../configs/apiErrorCodeConfig";
import toast from "react-hot-toast";
import VerificationModal from "../../../views/pages/verification-otp/index";
import PanVerifyModal from "../../components/panVerifyModal/index";
// ** Icons Imports
import CMP08Service from "../../../services/cmp08/cmp08Service";
import { Trash2, FilePlus } from "react-feather";
import { UncontrolledTooltip } from "reactstrap";
import DropDownCMP08 from "../../components/dropDownCMP08Exp";
import withReactContent from "sweetalert2-react-content";
import { urlEndpointConfig } from "@configs/urlEndpoint";
import cmp08Service from "../../../services/cmp08/cmp08Service";
import { downloadURL } from "../../../helper/downloadUrl";

const MySwal = withReactContent(Swal);

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

const data1 =
  localStorage.getItem(globleVariable.userId) &&
    LocalFunction.getLocalValue(globleVariable.userId, true)
    ? LocalFunction.getLocalValue(globleVariable.userId, true)
    : " ";

let gstr1FromDt =
  sessionStorage.getItem(globleVariable.itc04DateRange) &&
  SessionFunction.getSessionValue(globleVariable.itc04DateRange);

let itc04ExpLabel =
  sessionStorage.getItem(globleVariable.itc04ExpLabel) &&
  sessionStorage.getItem(globleVariable.itc04ExpLabel);

const userIds =
  localStorage.getItem(globleVariable.userId) &&
    LocalFunction.getLocalValue(globleVariable.userId, true)
    ? LocalFunction.getLocalValue(globleVariable.userId, true)
    : " ";
const subId =
  localStorage.getItem(globleVariable.subscriptionId) &&
  LocalFunction.getLocalValue(globleVariable.subscriptionId, true);

const defaultValues = {
  otp: "",
};

const SubmitForms = (props) => {
  const [block, setBlock] = useState(false);
  const [show, setShow] = useState(false);
  const [ackNum, setAckNum] = useState(null);
  const { clientIds, userIds, GSTIN, stepper } = props;
  const [msgDisplay, setMsgDisplay] = useState(null);
  const [composeOpen, setComposeOpen] = useState(false);
  const toggleCompose1 = () => setComposeOpen(!composeOpen);
  const [selectedItem, setSelectedItem] = useState(null);
  const [composeOpenPan, setComposeOpenPan] = useState(false);
  const toggleComposePan = () => setComposeOpenPan(!composeOpenPan);
  const [selectedPan, setSelectedPan] = useState(null);
  const acKnowNoFileStatus = sessionStorage.getItem("cmp08AckNumber");
  const acKnowNoFileStatusDate = sessionStorage.getItem("cmp08AckDate");


  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ defaultValues });

  // ** Toggles close POPUP
  const togglePopUp = (e) => {
    reset();
    setShow(false);
  };

  useEffect(() => {
    return () => setBlock(false);
  }, []);

  const FileGSTR1OnClick = (data) => {
    const payLoad = {
      userClientId: clientIds,
      userId: userIds,
      returnPeriod: sessionStorage.getItem(globleVariable.cmp08DownloadDate),
      loggedGSTIN: GSTIN,
      otp: data.otp,
      panNumber: selectedPan,
    };

    setBlock(true);

    CMP08Service
      .fileCmp08Govt(payLoad)
      .then((res) => {
        if (
          res.status === 200 &&
          res.data.status === errorCodeConfig.APIDefaultCode.Success
        ) {
          const parsedData = JSON.parse(res.data.data);
          console.log("res.data.status", parsedData);
          setAckNum(parsedData?.ack_num);

          if (parsedData?.ack_num !== null && parsedData?.ack_num != "") {
            sessionStorage.setItem("btnDisable4", "5");
          }

          setShow(false);
          setBlock(false);

          toast.success(res?.data?.successMessage, {
            position: "top-right",
          });
        } else {
          setShow(false);
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
        setShow(false);
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
    setComposeOpenPan(true);
  };

  // ** initate EVC OTP
  const initateEvcOtpOnClick = () => {
    const payLoad = {
      userClientId: clientIds,
      userId: userIds,
      returnPeriod: sessionStorage.getItem(globleVariable.cmp08DownloadDate),
      loggedGSTIN: GSTIN,
      panNumber: selectedPan,
    };
    setBlock(true);
    CMP08Service
      .generateEvcOtpGovt(payLoad)
      .then((res) => {
        if (res.data.status === errorCodeConfig.APIDefaultCode.GovtOTPExpire) {
          setMsgDisplay(res?.data?.errorMessage);
          setBlock(false);
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
  }, [selectedPan]);

  // ** Escape key - disable
  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      // Prevent closing the modal when the Escape key is pressed
      e.stopPropagation();
    }
  };

  return (
    <>
      <Row>
        <Col md={4}></Col>
        <Col md={4}>
          {parseInt(sessionStorage.getItem("btnDisable4")) == 5 ? (
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
              className="btn-icon"
              outline
              color="danger"
              size="lg"
              onClick={openFileGSTR1}
              disabled={
                sessionStorage.getItem("btnDisable4") == undefined ||
                  sessionStorage.getItem("btnDisable4") == "undefined" ||
                  parseInt(sessionStorage.getItem("btnDisable4")) == 5
                  ? true
                  : sessionStorage.getItem("btnDisable4") == 3
                    ? false
                    : true
              }
            >
              <File size={25} />
              <span className="align-middle ms-50 gstr1FilingButton">
                {sessionStorage.getItem("btnDisable4") == undefined ||
                  sessionStorage.getItem("btnDisable4") == "undefined" ||
                  parseInt(sessionStorage.getItem("btnDisable4")) == 0 ||
                  parseInt(sessionStorage.getItem("btnDisable4")) == 1 ||
                  parseInt(sessionStorage.getItem("btnDisable4")) == 2 ||
                  parseInt(sessionStorage.getItem("btnDisable4")) == 3 ||
                  parseInt(sessionStorage.getItem("btnDisable4")) == 4
                  ? "File CMP 08"
                  : "CMP08 Is Already Filed"}
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
            <div className="d-flex justify-content-center mb-2">
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
      {acKnowNoFileStatus !== '' && acKnowNoFileStatus !== null ? (
        <Row>
          <Col md={4}></Col>
          <Col md={4}>
            <div className="d-flex justify-content-center mb-0">
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

      {acKnowNoFileStatusDate !== '' && acKnowNoFileStatusDate !== null ? (
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
          className="modal-dialog-centered modal-sm"
        >
          <div className="modal-header">
            <h2 className="modal-title w-100 text-center">OTP</h2>
          </div>
          <ModalBody>
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
                          (e.target.value = e.target.value.toUpperCase())
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
        types="itc04"
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

const CMP08Purchase = () => {
  const token = LocalFunction.getLocalValue(globleVariable.tokenKey, true);

  // ** Column
  const defaultInvoiceData = [
    {
      description: "Outward supplies (including exempt supplies)",
      value: 0,
      igst: 0,
      cgst: 0,
      sgst: 0,
      cess: 0,
    },
    {
      description:
        "Inward supplies attracting reverse charge including import of services",
      value: 0,
      igst: 0,
      cgst: 0,
      sgst: 0,
      cess: 0,
    },
    {
      description: "Tax payable (1 + 2)",
      value: 0,
      igst: 0,
      cgst: 0,
      sgst: 0,
      cess: 0,
    },
    {
      description: "Interest payable, if any",
      value: 0,
      igst: 0,
      cgst: 0,
      sgst: 0,
      cess: 0,
    },
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
      description: "IGST",
      taxPayableReverseCharge: 0.0,
      taxPayableOther: 0.0,
      adjustmentReverseCharge: 0.0,
      adjustmentOther: 0.0,
      interestPayable: 0.0,
      cess: 0.0,
      interest: 0.0,
      additionalCashRequired: 0.0,
      utilizeCashBalance: 0.0
    },
    {
      description: "CGST",
      taxPayableReverseCharge: 0.0,
      taxPayableOther: 0.0,
      adjustmentReverseCharge: 0.0,
      adjustmentOther: 0.0,
      interestPayable: 0.0,
      cess: 0.0,
      interest: 0.0,
      additionalCashRequired: 0.0,
      utilizeCashBalance: 0.0
    },
    {
      description: "SGST",
      taxPayableReverseCharge: 0.0,
      taxPayableOther: 0.0,
      adjustmentReverseCharge: 0.0,
      adjustmentOther: 0.0,
      interestPayable: 0.0,
      cess: 0.0,
      interest: 0.0,
      additionalCashRequired: 0.0,
      utilizeCashBalance: 0.0
    },
    {
      description: "CESS",
      taxPayableReverseCharge: 0.0,
      taxPayableOther: 0.0,
      adjustmentReverseCharge: 0.0,
      adjustmentOther: 0.0,
      interestPayable: 0.0,
      cess: 0.0,
      interest: 0.0,
      additionalCashRequired: 0.0,
      utilizeCashBalance: 0.0
    },
  ];

  const [panDataFrom, setPanDataFrom] = useState([]);
  const [panData, setPanData] = useState([]);
  const [displayType, setDisplayType] = useState([]);
  const [finFromYear, setFinFormYear] = useState(null);
  const [monthFrom, setMonthFrom] = useState(null);
  const hotRef = useRef(null);
  const cashLedgerHotRef = useRef(null);
  const paymentOfTaxHotRef = useRef(null);
  const [data, setData] = useState([]);
  const [deleteModalshow, setDeleteModalshow] = useState(false);
  const [errorArr, setErrorArr] = useState([]);
  const [cmp08Data, setCMP08Data] = useState(defaultInvoiceData);
  const [cashLedgerData, setCashLedgerData] = useState(defaultCashLedgerData);
  const [taxData, setTaxData] = useState(defaultPaymentOfTaxData);

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
  const [datas, setDatas] = useState([]);
  const [wizardBtn, setWizardBtn] = useState(0);
  const [exemptErrorArr, setExemptErrorArr] = useState([]);
  console.log(datas, "datttttttttas");
  const [count1, setCount1] = useState(0);
  const [btnExport, setBtnExport] = useState(false);
  const [msgDisplay, setMsgDisplay] = useState(null);
  const [composeOpen, setComposeOpen] = useState(false);
  const [deleteType , setDeleteType] = useState('single')

  //** Shortcut keys
  useHotkeys(
    keysMap.DELETE_DATA,
    () => {
      block == false && HideShowDeleteModel();
    },
    { enableOnFormTags }
  );
  useHotkeys(
    keysMap.SAVE_DATA,
    () => {
      block == false && saveCMP08Details();
    },
    { enableOnFormTags }
  );

  const gstr3BToDt =
    sessionStorage.getItem(globleVariable.defaultYear) !== null &&
      sessionStorage.getItem(globleVariable.defaultYear) !== "" &&
      sessionStorage.getItem(globleVariable.defaultYear) !== undefined
      ? SessionFunction?.getSessionValue(globleVariable?.defaultYear, true)
      : "";
  const G_UCParId =
    sessionStorage.getItem(globleVariable.G_UCParId) &&
    SessionFunction.getSessionValue(globleVariable.G_UCParId, true);
  const cmp08DateRangeFilter =
    sessionStorage.getItem(globleVariable.rangeFiltersCMP08) &&
    SessionFunction.getSessionValue(globleVariable.rangeFiltersCMP08);
  const UserId = LocalFunction.getLocalValue(globleVariable.userId, true)
    ? LocalFunction.getLocalValue(globleVariable.userId, true)
    : " ";
  const G_GSTIN = SessionFunction.getSessionValue(globleVariable.G_GSTIN, true);

  const finYearLoggedIn = parseInt(gstr3BToDt?.slice(2)) - 1;
  const finMonthLoggedIn = parseInt(gstr3BToDt?.slice(0, 2));

  const userDatadecrypt = LocalFunction.getLocalValue(
    globleVariable.userData,
    true
  );

  const userData = userDatadecrypt && JSON.parse(userDatadecrypt);
  const isMultipleCompanyDelete = userData && userData.data.isMultipleCompanyDelete;

  useEffect(() => {
    console.log("default value");
    if (displayType == true) {

      let defaultValueFrom = null;

      if (
        defaultValueFrom !== undefined &&
        defaultValueFrom !== null &&
        defaultValueFrom !== ""
      ) {
        defaultValueFrom = panDataFrom?.filter(
          (item) => item.value == cmp08DateRangeFilter
        )[0];
        setFinFormYear(defaultValueFrom);
        sessionStorage.setItem(globleVariable.cmp08DownloadDate, defaultValueFrom?.value)

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
          setFinFormYear(defaultValueFrom[0]);
          sessionStorage.setItem(globleVariable.cmp08DownloadDate, defaultValueFrom[0]?.value)

        } else {
          if (finYearLoggedIn == 2018 && defaultValueFrom?.length == 0) {
            const defaultValueFrom = panDataFrom[panDataFrom?.length - 1];
            setFinFormYear(defaultValueFrom[0]);
            sessionStorage.setItem(globleVariable.cmp08DownloadDate, defaultValueFrom[0]?.value)
          } else {
            if (defaultValueFrom?.length == 0) {
              setFinFormYear(panDataFrom[0]);
              sessionStorage.setItem(globleVariable.cmp08DownloadDate, panDataFrom[0]?.value)
            } else {
              setFinFormYear(defaultValueFrom[0]);
              sessionStorage.setItem(globleVariable.cmp08DownloadDate, defaultValueFrom[0]?.value)
            }
          }
        }
      }
    }
  }, [displayType]);

  useEffect(() => {
    setPanDataFrom(YearList);
    setPanData(YearList);
    setDisplayType(true);
  }, []);

  useEffect(() => {
    return () => setBlock(false);
  }, []);

  // ** Set From and to Date by session
  useEffect(() => {
    console.log("default value");
    if (displayType == true) {
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
      console.log("call happent", gstr3BToDt, defaultValueTo);

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
    }
  }, [displayType]);

  // ** Loading Export
  const loadFunctionExport = (value, fileName, selectedYear) => {
    setBlock(value);
  };

  const CMP08SummaryServiceCall = async (dateRange) => {
    try {
      setBlock(true); // Set block to true initially

      const response = await CMP08Service.getCMP08Data(
        String(G_UCParId),
        dateRange,
        UserId,
        G_GSTIN,
        subId
      );

      if (response?.status === 200 && response?.data?.status === errorCodeConfig?.APIDefaultCode?.Success) {
        // Data retrieval successful
        if (response?.data?.data) {
          setData(response.data.data);
        }
      } else if (response?.data?.status === 500) {
        // Server error
        setCMP08Data(defaultInvoiceData);
        setTaxData(defaultPaymentOfTaxData);
        setCashLedgerData(defaultCashLedgerData);
      }
      else if (response.data.status === errorCodeConfig.APIDefaultCode.GovtOTPExpire) {
        console.log("true")
        setMsgDisplay(res?.data?.errorMessage)
        setBlock(false);
        setComposeOpen(true)
      }
      else {
        // Other errors
        toast.error(response?.data?.errorMessage, {
          position: "top-right",
        });
      }
    } catch (error) {
      // Handle exceptions
      console.error("An error occurred:", error.message);
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

  const updateCMP08Data = async (payLoad) => {
    try {
      await setBlock(true);
      const res = await CMP08Service.updateCMP08Data(payLoad);
      if (
        res.status === 200 &&
        res.data.status === errorCodeConfig.APIDefaultCode.Success
      ) {
        await setBlock(false);
        toast.success(res.data.successMessage, {
          position: "top-right",
        });
        setErrorArr([]);
        await CMP08SummaryServiceCall(finFromYear?.value);
      } else {
        await setBlock(false);
        toast.error(res?.data?.errorMessage, {
          position: "top-right",
        });
      }
    } catch (error) {
      await setBlock(false);
      await Swal.fire({
        icon: "error",
        title: "",
        text: error?.message,
        customClass: {
          confirmButton: "btn btn-danger",
        },
        buttonsStyling: false,
      });
    }
  };

  useEffect(() => {
    if (displayType == true || displayType == "true") {
      const dtcmp08 = sessionStorage.getItem(globleVariable.cmp08DownloadDate)
      finFromYear && CMP08SummaryServiceCall(dtcmp08);
    }
  }, [finFromYear, displayType]);

  // ** Delete Modal Show/Hide
  const HideShowDeleteModel = () => {
    setDeleteModalshow(!deleteModalshow);
    if (isMultipleCompanyDelete == 0) {
      document.getElementById("btnDeleteCMP08").blur();
    }

  };


 const multipleDeleteFunc = (type) => {

  if (type == 'single') {
      setDeleteType('single')
  } else if (type == 'multiple') {
    setDeleteType('multiple')
  }
  HideShowDeleteModel()
}


  function isNumber(n) {
    return /^-?[\d.]+(?:e-?\d+)?$/.test(n);
  }

  function getErrorColumns(errorRow) {
    const nonNumericCols = ["rowId", "description"];
    nonNumericCols?.forEach((prop) => {
      delete errorRow[prop];
    });
    return Object.keys(errorRow)?.filter((key) => errorRow[key] !== null);
  }

  const saveCMP08Details = () => {
    debugger
    let errorArray = [];
    let isValid = true;

    const tableData = hotRef?.current?.hotInstance?.getData();

    const paymentOfTaxTableData =
      paymentOfTaxHotRef?.current?.hotInstance?.getData();

    const cashLedgerTableData =
      cashLedgerHotRef?.current?.hotInstance?.getData();

    tableData?.forEach((row, index) => {
      let data = {
        value: null,
        igst: null,
        cgst: null,
        sgst: null,
        cess: null,
      };
      let validation = {
        isValueValid: true,
        isIgstValid: true,
        isCgstValid: true,
        isSgstValid: true,
        isCessValid: true,
      };
      if (row[1] !== "" && row[1] !== null) {
        if (isNumber(row[1]) == false) {
          isValid = false;
          data.value = row[1];
          validation.isValueValid = false;
        }
      }
      if (row[2] !== "" && row[2] !== null) {
        if (isNumber(row[2]) == false) {
          isValid = false;
          data.igst = row[2];
          validation.isIgstValid = false;
        }
      }
      if (row[3] !== "" && row[3] !== null) {
        if (isNumber(row[3]) == false) {
          isValid = false;
          data.cgst = row[3];
          validation.isCgstValid = false;
        }
      }
      if (row[4] !== "" && row[4] !== null) {
        if (isNumber(row[4]) == false) {
          isValid = false;
          data.sgst = row[4];
          validation.isSgstValid = false;
        }
      }
      if (row[5] !== "" && row[5] !== null) {
        if (isNumber(row[5]) == false) {
          isValid = false;
          data.cess = row[5];
          validation.isCessValid = false;
        }
      }
      if (
        validation.isValueValid == true &&
        validation.isSgstValid == true &&
        validation.isIgstValid == true &&
        validation.isCgstValid == true &&
        validation.isCessValid == true
      ) {
      } else {
        console.log({ row, data, validation });
        errorArray.push({
          description: row[0],
          rowId: index + 1,
          tableName: "Invoice Details",
          value: data.value,
          igst: data.igst,
          sgst: data.sgst,
          cgst: data.cgst,
          cess: data.cess,
        });
      }
    });

    paymentOfTaxTableData?.forEach((row, index) => {
      let data = {
        taxPayableReverseCharge: null,
        taxPayableOther: null,
        adjustmentReverseCharge: null,
        adjustmentOther: null,
        interestPayable: null,
        cess: null,
        interest: null,
        additionalCashRequired: null,
      };
      let validation = {
        taxPayableReverseChargeValid: true,
        taxPayableOtherValid: true,
        adjustmentReverseChargeValid: true,
        adjustmentOtherValid: true,
        interestPayableValid: true,
        cessValid: true,
        interestValid: true,
        additionalCashRequiredValid: true,
      };
      if (row[1] !== "" && row[1] !== null) {
        if (isNumber(row[1]) == false) {
          isValid = false;
          data.taxPayableReverseCharge = row[1];
          validation.taxPayableReverseChargeValid = false;
        }
      }
      if (row[2] !== "" && row[2] !== null) {
        if (isNumber(row[2]) == false) {
          isValid = false;
          data.taxPayableOther = row[2];
          validation.taxPayableOtherValid = false;
        }
      }
      if (row[3] !== "" && row[3] !== null) {
        if (isNumber(row[3]) == false) {
          isValid = false;
          data.adjustmentReverseCharge = row[3];
          validation.adjustmentReverseChargeValid = false;
        }
      }
      if (row[4] !== "" && row[4] !== null) {
        if (isNumber(row[4]) == false) {
          isValid = false;
          data.adjustmentOther = row[4];
          validation.adjustmentOtherValid = false;
        }
      }
      if (row[5] !== "" && row[5] !== null) {
        if (isNumber(row[5]) == false) {
          isValid = false;
          data.interestPayable = row[5];
          validation.interestPayableValid = false;
        }
      }
      if (row[6] !== "" && row[6] !== null) {
        if (isNumber(row[6]) == false) {
          isValid = false;
          data.cess = row[6];
          validation.cessValid = false;
        }
      }
      if (row[7] !== "" && row[7] !== null) {
        if (isNumber(row[7]) == false) {
          isValid = false;
          data.interest = row[7];
          validation.interestValid = false;
        }
      }
      if (row[8] !== "" && row[8] !== null) {
        if (isNumber(row[8]) == false) {
          isValid = false;
          data.additionalCashRequired = row[8];
          validation.additionalCashRequiredValid = false;
        }
      }
      if (
        validation.taxPayableReverseChargeValid == true &&
        validation.taxPayableOtherValid == true &&
        validation.adjustmentReverseChargeValid == true &&
        validation.adjustmentOtherValid == true &&
        validation.interestPayableValid == true &&
        validation.cessValid == true &&
        validation.interestValid == true &&
        validation.additionalCashRequiredValid == true
      ) {
      } else {
        console.log({ row, data, validation });
        errorArray.push({
          description: row[0],
          rowId: index + 1,
          tableName: "Payment of Tax",
          taxPayableReverseCharge: data.taxPayableReverseCharge,
          taxPayableOther: data.taxPayableOther,
          adjustmentReverseCharge: data.adjustmentReverseCharge,
          adjustmentOther: data.adjustmentOther,
          interestPayable: data.interestPayable,
          cess: data.cess,
          interest: data.interest,
          additionalCashRequired: data.additionalCashRequired,
        });
      }
    });

    if (isValid == false) {
      let csssClass = "";
      let thClass = "width: 6rem";
      let thClass2 = "width: 10rem";
      let htmltblData =
        "<div style='' class='import-error-height'><table class='table text-start' style=''><thead style='" +
        csssClass +
        "' ><tr style='" +
        csssClass +
        "'><th style='" +
        thClass2 +
        "'>Table Name</th><th style='" +
        thClass +
        "'>Row No</th><th style='" +
        csssClass +
        "'>Column's</th><th style='" +
        csssClass +
        "'>Error's</th>";
      for (let i = 0; i < errorArray.length; i++) {
        htmltblData += `<tr style="${csssClass}">
        <td style="${csssClass}">${errorArray[i].tableName}</td>
        <td style="${csssClass}">${errorArray[i].rowId
          }</td><td style="${csssClass}">${getErrorColumns({
            ...errorArray[i],
          })?.join(", ")}</td><td style="${csssClass};">${errorArray[i].description
          } - only numeric value allowed. </td></tr>`;
      }

      htmltblData += "</tbody></table></div>";

      return MySwal.fire({
        title: "<strong>Can't Save Error Data</strong>",
        icon: "error",
        html: htmltblData,
        customClass: {
          confirmButton: "btn btn-danger",
        },
        buttonsStyling: false,
        allowOutsideClick: false,
        width: "60%",
        height: "350px",
      });
    } else {
      const keys = ["description", "value", "igst", "cgst", "sgst", "cess"];
      const paymentOfTaxKeys = [
        "description",
        "taxPayableReverseCharge",
        "taxPayableOther",
        "adjustmentReverseCharge",
        "adjustmentOther",
        "interestPayable",
        "cess",
        "interest",
        "additionalCashRequired",
      ];

      //  console.log(finFromYear[0].value , "finFromYear")

      const cashLedgerKeys = ["igst", "cgst", "sgst", "cess", "total"];
      const payLoad = {
        userId: UserId,
        fkUserClientId: String(G_UCParId),
        range: finFromYear.value,
        gstNumber: G_GSTIN,
        cmp08Details: [],
        cashLedgerDetails: [],
        paymentOfTaxDetails: [],
      };
      const cmp08Details = tableData?.map((row, index) => {
        const obj = {
          cmp08id: `id00${index}`,
          fkUserClientId: String(G_UCParId),
          fkFinancialYearId: finFromYear.value,
          month: finFromYear.value,
        };

        row?.forEach((element, index) => {
          obj[keys[index]] = element;
        });
        return obj;
      });

      const cashLedgerDetails = cashLedgerTableData?.map((row, index) => {
        const obj = {};

        row?.forEach((element, index) => {
          obj[cashLedgerKeys[index]] = element;
        });
        return obj;
      });

      const paymentOfTaxDetails = paymentOfTaxTableData?.map((row, index) => {
        const obj = {
          cmp08PaymentOfTaxId: `id00${index}`,
          fkUserClientId: String(G_UCParId),
          fkFinancialYearId: finFromYear?.value,
          month: finFromYear?.value,
        };

        row?.forEach((element, index) => {
          if (index === 0) element = element?.split("(₹)")[0]?.trim();

          obj[paymentOfTaxKeys[index]] = element;
        });

        return obj;
      });

      updateCMP08Data({
        ...payLoad,
        cmp08Details,
        cashLedgerDetails,
        paymentOfTaxDetails,
      });
    }
  };

  useEffect(() => {
    const { cmp08Details, paymentOfTaxDetails, cashLedgerDetails } = data;
    let ucb = [];
    // if(cashLedgerDetails?.length > 0 || cashLedgerData == null || data == null){
    // cashLedgerDetails?.map((ele,index) =>{
    //   ucb.push({ucb: ele?.igst},{ucb:ele?.cgst},{ucb:ele?.sgst},{ucb:ele?.cess})
    // });
    // }
    // else{
    ucb.push({ ucb: "0.00" }, { ucb: "0.00" }, { ucb: "0.00" }, { ucb: "0.00" })
    // }

    const updatedPaymentOfTaxDetails = paymentOfTaxDetails?.map((row, index) => {
      const description = row?.description + " (₹)";
      const utilizeCashBalance = ucb?.[index]?.ucb;
      row.utilizeCashBalance = utilizeCashBalance
      row.description = description;
      return row;
    });

    const updatedCMP08Details = cmp08Details?.map((row, index) => {
      const description = defaultInvoiceData[index]?.description;
      row.description = description;
      return row;
    });
    cmp08Details && setCMP08Data(updatedCMP08Details);
    cashLedgerDetails && setCashLedgerData(cashLedgerDetails);
    paymentOfTaxDetails && setTaxData(updatedPaymentOfTaxDetails);
  }, [data]);

  const wizardRef = useRef(null);
  const toggleCompose1 = () => setComposeOpen(!composeOpen);

  // ** toggle Compose
  const toggleCompose = () => setDeleteModalshow(!deleteModalshow);

  const setGSRT1Data = (summary, tabBtnData) => {
    setSummary(summary);
    setactiveTab(tabBtnData);
  };

  const invoiceList = activeTab?.InvoiceList?.filter(
    (p) => p.typeofInvoiceId < 17
  );

  //** Shortcut keys
  useHotkeys(
    keysMap.CLEAR_DATA,
    () => {
      !block && !summary && activeTab.ClearFilter();
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

  useEffect(
    () =>
      onSnapshot(doc(db, "Itc04ImportExcelProgress", data1), (doc) => {
        console.log("new firestore changes1", doc?.data());
        if (doc?.data()) {
          console.log("progress data=", doc?.data()?.name);
          setCount(doc?.data()?.name);
          const newValue = doc?.data()?.name;
          const count11 = newValue?.split("/");
          setCount1(count11);

          if (count11?.length > 0) {
            setBtnExport(true);
          } else {
            setBtnExport(false);
          }
        } else {
          if (doc?.data() == null) {
            setCount("All");
          } else {
            setCount(0);
            setBtnExport(false);
          }
        }
      }),

    []
  );


  // ** Firestore
  useEffect(
    () =>
      onSnapshot(doc(db, "Itc04ImportExcelProgressMessage", data1), (doc) => {
        console.log("new firestore changes1", doc?.data());
        if (doc?.data()) {
          console.log("progress data=", doc?.data()?.name);
          setProgressMessage(doc?.data()?.name);
        } else {
          if (doc?.data() == null) {

          } else {
            setCount(0);
          }
        }
      }),

    []
  );

  const steps = [
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
            wizardBtn,
            panDataFrom,
            finFromYear,
            cmp08Data,
            defaultInvoiceData,
            defaultCashLedgerData,
            defaultPaymentOfTaxData,
            setPanDataFrom,
            panData,
            setPanData,
            displayType,
            setDisplayType,
            setFinFormYear,
            monthFrom,
            setMonthFrom,
            hotRef,
            cashLedgerHotRef,
            paymentOfTaxHotRef,
            data,
            setData,
            deleteModalshow,
            setDeleteModalshow,
            errorArr,
            setErrorArr,
            setCMP08Data,
            cashLedgerData,
            setCashLedgerData,
            taxData,
            setTaxData,
            loadFunctionExport,
            CMP08SummaryServiceCall,
            updateCMP08Data,
            HideShowDeleteModel,
            isNumber,
            getErrorColumns,
            saveCMP08Details,
            toggleCompose,
            setDeleteType,
            deleteType
          }}
        />
      ),
    },
    {
      id: "save-data",
      title: "Save data on Portal",
      content: (
        <CMPDownload
          userIds={data1}
          clientIds={G_UCParId}
          GSTIN={G_GSTIN}
          stepper={stepper}
          wizardIndex={wizardBtn}
        ></CMPDownload>
      ),
    },
    {
      id: "submit-return",
      title: "Submit Return",
      content: (
        <SubmitForms
          userIds={userIds}
          clientIds={G_UCParId}
          GSTIN={G_GSTIN}
          stepper={stepper}
        />
      ),
    },
  ];

  const handleFireStore = (value) => {
    setCount1(0);
    setCount(0);
    setProgressMessage("");
  };

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
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  }

  const loadFunction = (value, fileName, selectedYear) => {
    setProgressModal(value);
    handleFireStore(false);
    console.log("progress value=", value, fileName, selectedYear);
    fileName?.name ? setFileName(fileName?.name) : setFileName("");
    fileName?.size ? setFileSize(formatBytes(fileName?.size)) : setFileSize("");
    selectedYear ? setFileYear(selectedYear) : setFileYear("");
    fileName && formatBytes(fileName?.size);
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

  const array = [];

  datas.map((ele, index) => {
    array.push({ label: ele.sectionname, value: ele.typeofInvoiceId });
  });


  const onClickExportJSONAPICMP08 = () => {
    const payLoad = {
      userClientId: G_UCParId,
      userId: LocalFunction.getLocalValue(globleVariable.userId, true),
      returnPeriod: sessionStorage.getItem("gstr6DownloadFromDt"),
      loggedGSTIN: G_GSTIN,
    };
    setBlock(true);
    console.log(payLoad, "payLoadpayLoadpayLoadpayLoad");
    cmp08Service.cmp08ExportJson(payLoad)
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


  return (
    <Fragment>
      {/* {block && <div className="loading1">Loading&#8230;</div>} */}
      <div className="content-header row py-1">
        <div className="content-header-left col-md-12 col-12">
          <div className="row breadcrumbs-top">
            <div className="col-6">
              {summary ? (
                <Breadcrumbs
                  title="Purchase Summary"
                  data={[{ title: "GST Returns", link: urlEndpointConfig.GSTR_All }, { title: "CMP-08" }]}
                />
              ) : (
                <Breadcrumbs
                  title="Purchase Summary"
                  data={[
                    { title: "GST Returns", link: urlEndpointConfig.GSTR_All },
                    {
                      title: "CMP-08",
                      link: "/gst-returns/cmp08",
                    },
                    { title: "CMP-08 Data" },
                  ]}
                />
              )}
            </div>
            {
              wizardBtn == 0 &&
              <div className="content-header-right text-md-end col-md-6 col-6 d-md-block d-none">
                <Button
                  className="btn-icon me-1"
                  outline
                  color="danger"
                  id="btnSaveGSTR3B"
                  onClick={saveCMP08Details}
                >
                  <FilePlus size={14} />
                  <span className="align-middle ms-50"> Save</span>
                </Button>
                <UncontrolledTooltip placement="top" target="btnSaveGSTR3B">
                  Save [ {keysMap.SAVE_DATA} ]
                </UncontrolledTooltip>

                {
                    isMultipleCompanyDelete  == 0 &&
                    <><Button
                      className="btn-icon me-1"
                      outline
                      color="danger"
                      id="btnDeleteCMP08"
                      onClick={HideShowDeleteModel}
                    >
                      <Trash2 size={14} />
                      <span className="align-middle ms-50">Delete</span>
                    </Button><UncontrolledTooltip placement="top" target="btnDeleteCMP08">
                        Delete [ {keysMap.DELETE_DATA} ]
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




                <DropDownCMP08
                  data={data}
                  loadFunction={loadFunctionExport}
                  clientId={G_UCParId}
                  finYear={finFromYear}
                  finMonth={sessionStorage.getItem(globleVariable.cmp08DownloadDate)}
                  isloading={block}
                  userId={UserId}
                  G_GSTIN={G_GSTIN}
                />
              </div>
            }
            {
              wizardBtn == 1 &&
              <div className="content-header-right text-md-end col-md-6 col-6 d-md-block d-none">

                <Button
                  id="exportjsonData"
                  onClick={onClickExportJSONAPICMP08}
                  className="btn-icon btn-round dropdown-toggle"
                  outline
                  color="danger"
                >
                  <i className="fa fa-file-code-o"></i>&nbsp; Export JSON
                </Button>
                <UncontrolledTooltip placement="top" target="exportjsonData">
                  Export JSON
                </UncontrolledTooltip>
              </div>
            }
          </div>
        </div>
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
      <Modal
        backdrop="static"
        isOpen={progressModal}
        className={"modal-dialog-centered"}
      >
        <div className="modal-header">
          <h2 className="modal-title w-100 text-center">
            Import Excel Progress CMP-08
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
      ></VerificationModal>
    </Fragment>
  );
};

export default CMP08Purchase;
