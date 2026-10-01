import { Fragment, useRef, useState } from "react";
import Breadcrumbs from "@components/breadcrumbs";
import Wizard from "@components/wizard";
import { Outlet } from "react-router-dom";
import {
  Button,
  Modal,
  ModalBody,
  UncontrolledTooltip,
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
import {
  Trash2,
  CheckCircle,
  ArrowLeft,
  File,ChevronDown
} from "react-feather";
import { useHotkeys } from "react-hotkeys-hook";
import { keysMap, enableOnFormTags } from "../../../configs/config";
import DeleteModelITC04Sales from "../../components/models/Itc04ReturnsModelDelete";
import itc04SummaryService from "../../../services/itc04Services/itc04SummaryService";
import Swal from "sweetalert2";
import DropDownITC04Import from "../../components/Dropdown-ITC04-Import";
import { globleVariable } from "../../../configs/globalVariable";
import LocalFunction from "../../../configs/getLocalFunction";
import SessionFunction from "../../../configs/getSessionFunction";
import ITCDownload from "./itc-download"
import { useForm, Controller } from "react-hook-form";
import itc04DownloadService from "../../../services/itc04Services/itc04DownloadService"
import errorCodeConfig from "../../../configs/apiErrorCodeConfig";
import { downloadURL } from "../../../helper/downloadUrl";
import toast from 'react-hot-toast'
import VerificationModal from '../../../views/pages/verification-otp/index'
import PanVerifyModal from "../../components/panVerifyModal/index"
import GSTR1DownloadService from "../../../services/gstr1/gstr1Services/gstr1DownloadService";
import { urlEndpointConfig } from "@configs/urlEndpoint";
import useConfirmRefresh from "@hooks/useConfirmRefresh";

const defaultValues = {
  otp: "",
};

const SubmitForms = (props) => {
  const [block, setBlock] = useState(false);
  const [show, setShow] = useState(false);
  const [ackNum, setAckNum] = useState(null);
  const { clientIds, userIds, GSTIN, stepper , finYear, finMonth , wizardIndex } = props;
  const [msgDisplay, setMsgDisplay] = useState(null);
  const [composeOpen, setComposeOpen] = useState(false)
  const toggleCompose1 = () => setComposeOpen(!composeOpen)
  const [selectedItem, setSelectedItem] = useState(null);
  const [panNo, setPanNo] = useState('')
  const [composeOpenPan, setComposeOpenPan] = useState(false);
  const toggleComposePan = () => setComposeOpenPan(!composeOpenPan);
  const [selectedPan, setSelectedPan] = useState(null);

  const acKnowNoFileStatus = sessionStorage.getItem("gstR4AckNumber");
  const acKnowNoFileStatusDate = sessionStorage.getItem("gstR4AckNumberDate");

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ defaultValues });

  // ** Toggles close POPUP
  const togglePopUp = (e) => {
    reset();
    setShow(false);
  };

  const handleChangePanNo = (event) => {
    setPanNo(event.target.value.toUpperCase());
  };

  useEffect(() => {
    return () => setBlock(false);
  }, []);

  const FileGSTR1OnClick = (data) => {
    const payLoad = {
      userClientId: clientIds,
      userId: userIds,
      returnPeriod: sessionStorage.getItem(globleVariable.itc04DownloadFromDt),
      loggedGSTIN: GSTIN,
      otp: data.otp,
      panNumber: selectedPan
    };

    setBlock(true);
    // fileitc04bGovt
    itc04DownloadService.fileItc04Govt(payLoad)
      .then((res) => {
        if (
          res.status === 200 &&
          res.data.status === errorCodeConfig.APIDefaultCode.Success
        ) {
          const parsedData = JSON.parse(res.data.data);
          console.log("res.data.status", parsedData);
          setAckNum(parsedData?.ack_num);

          if (parsedData?.ack_num !== null && parsedData?.ack_num != "") {
            sessionStorage.setItem("btnDisable4", "5")
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
    setComposeOpenPan(true)


    // var panVal = panNo;
    // var regpan = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;

    // if (panNo == null || panNo == "" || panNo == undefined) {

    //   Swal.fire({
    //     icon: "warning",
    //     title: "",
    //     text: "Pan no is require.",
    //     customClass: {
    //       confirmButton: "btn btn-danger",
    //     },
    //     buttonsStyling: false,
    //   });

    //   return
    // }


    // if (regpan.test(panVal)) {
    //   // valid pan card number
    //   initateEvcOtpOnClick();
    // } else {
    //   // invalid pan card number
    //   Swal.fire({
    //     icon: "warning",
    //     title: "",
    //     text: "Invalid pan no.",
    //     customClass: {
    //       confirmButton: "btn btn-danger",
    //     },
    //     buttonsStyling: false,
    //   });
    // }
  };

  // ** initate EVC OTP
  const initateEvcOtpOnClick = () => {
    const payLoad = {
      userClientId: clientIds,
      userId: userIds,
      returnPeriod: sessionStorage.getItem(globleVariable.itc04DownloadFromDt),
      loggedGSTIN: GSTIN,
      panNumber: selectedPan
    };
    setBlock(true);
    itc04DownloadService.generateEvcOtpGovt(payLoad)
      .then((res) => {
        if (res.data.status === errorCodeConfig.APIDefaultCode.GovtOTPExpire) {
          // closeModal();
          setMsgDisplay(res?.data?.errorMessage)
          setBlock(false);
          // loadFunction(false);
          setComposeOpen(true)
          // toast.dismiss();
          // dispatch(handleModelOTP(!store.layout.modelVerifyOTP));
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

  useEffect(() => {
    if (wizardIndex ==  2) {
        returnFileStatus()
    }

  },[wizardIndex])

     // **  check user returnFileStatus

     const returnFileStatus=()=> {

      sessionStorage.removeItem("gstR04AckNumber")
      sessionStorage.removeItem("gstR04AckNumberDate")

      const payLoad = {
        clientId: clientIds,
        gstinNumber: GSTIN,
        financialYearIdID: parseInt(finYear),
        month: parseInt(finMonth) ,
      };

      setBlock(true);
      GSTR1DownloadService.checkFiledUserStatus(payLoad).then((res)=>{

        if (
          res.status === 200
        ){
          setBlock(false);

          if(res?.data?.data?.isITC04Filed){
            if(res?.data?.data?.itC04AcknowledgementNumber){
              sessionStorage.setItem("gstR04AckNumber", res?.data?.data?.itC04AcknowledgementNumber);
              sessionStorage.setItem("gstR04AckNumberDate", res?.data?.data?.itC04AcknowledgementDate);
            } else {
              sessionStorage.removeItem("gstR04AckNumber")
              sessionStorage.removeItem("gstR04AckNumberDate")
            }
          }
        }
       } ).catch((error) => {
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

let disableButton = sessionStorage.getItem("btnDisable4") == undefined ||
sessionStorage.getItem("btnDisable4") == 'undefined' || parseInt(sessionStorage.getItem("btnDisable4")) == 5 ? true :
sessionStorage.getItem("btnDisable4") == 3 ? false : true


  return (
    <>
      {/* {
        parseInt(sessionStorage.getItem("btnDisable4")) !== 5 ?
          <Row>
            <Col md={4}></Col>

            <Col md={4}>

              <div className="d-grid mb-1 mb-lg-1">
                <Label className="form-label requiredlable" for="pan-no">
                  PAN Number Of Authorized Signatory
                </Label>
                <Input
                  id="panNumber"
                  autoFocus
                  maxLength={10}
                  type='text'
                  value={panNo}
                  placeholder='PAN Number Of Authorized Signatory'
                  onChange={handleChangePanNo}
                />

              </div>
            </Col>
            <Col md={4}></Col>
          </Row> : ""
      } */}

      <Row>
        <Col md={4}></Col>
        <Col md={4}>
          {
            parseInt(sessionStorage.getItem("btnDisable4")) == 5 ?
              <div className="d-flex justify-content-center mb-1">
                <CheckCircle size={35} color="#28c76f" />
              </div> : ""
          }

        </Col>
        <Col md={4}></Col>
      </Row>
      <Row>
        <Col md={4}></Col>
        <Col md={4}>
          <div className="d-grid mb-1 mb-lg-1">
            <Button
              className={disableButton == true ? "btn-icon disabledBtn" : "btn-icon" }
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
                    sessionStorage.getItem("btnDisable4") == undefined ||
                    sessionStorage.getItem("btnDisable4") == 'undefined' ||
                    parseInt(sessionStorage.getItem("btnDisable4")) == 0 ||
                    parseInt(sessionStorage.getItem("btnDisable4")) == 1 ||
                    parseInt(sessionStorage.getItem("btnDisable4")) == 2 ||
                    parseInt(sessionStorage.getItem("btnDisable4")) == 3 ||
                    parseInt(sessionStorage.getItem("btnDisable4")) == 4 ? "File ITC 04" : "ITC 04 Is Already Filed"}


              </span>
            </Button>
          </div>
        </Col>
        <Col md={4}></Col>
      </Row>

      {ackNum  ? (
        <Row>
          <Col md={4}></Col>

          <Col md={4}>
            <div className="d-flex justify-content-center mb-2">
              <Label className="form-label">
                Acknowledgement  Number : {ackNum}
              </Label>
            </div>
          </Col>
          <Col md={4}></Col>
        </Row>
      ) : (
        ""
      )}

    {acKnowNoFileStatus !== null &&  acKnowNoFileStatus !== ""  ? (
        <Row>
          <Col md={4}></Col>
          <Col md={4}>
            <div className="d-flex justify-content-center mb-0">
              <Label className="form-label">
                Acknowledgement Number : { acKnowNoFileStatus}
              </Label>
            </div>
          </Col>
          <Col md={4}></Col>
        </Row>
      ) : (
        ""
      )}

    {acKnowNoFileStatusDate !== null &&  acKnowNoFileStatusDate !== "" ? (
        <Row>
          <Col md={4}></Col>
          <Col md={4}>
            <div className="d-flex justify-content-center mb-2">
              <Label className="form-label">
                Acknowledgement Number : { acKnowNoFileStatusDate}
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
          // toggle={() => setShow(!show)}
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
      <VerificationModal composeOpen={composeOpen} toggleCompose={toggleCompose1} userClientIds={clientIds}
        messageDisplay={msgDisplay} setSelectedItem={setSelectedItem}
        types="itc04" otpGSTIN={GSTIN}
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

const ITCPurchase = () => {
  const token = LocalFunction.getLocalValue(globleVariable.tokenKey, true)

  const wizardRef = useRef(null);

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
  const [wizardBtn, setWizardBtn] = useState(0);
  const [exemptErrorArr, setExemptErrorArr] = useState([]);
  const [count1, setCount1] = useState(0);
  const [itcExportDt, setItcExportDt] = useState([]);
  const [btnExport, setBtnExport] = useState(false)
  const [msgDisplay, setMsgDisplay] = useState(null);
  const [composeOpen, setComposeOpen] = useState(false)
  const toggleCompose1 = () => setComposeOpen(!composeOpen)
  const [deleteType , setDeleteType] = useState('single')
  // ** Delete
  const [deleteModalshow, setDeleteModalshow] = useState(false);
  // ** toggle Compose
  const toggleCompose = () => setDeleteModalshow(!deleteModalshow);

  const setGSRT1Data = (summary, tabBtnData) => {
    setSummary(summary);
    setactiveTab(tabBtnData);
  };

  const userDatadecrypt = LocalFunction.getLocalValue(
    globleVariable.userData,
    true
  );

  const userData = userDatadecrypt && JSON.parse(userDatadecrypt);
  const isMultipleCompanyDelete = userData && userData.data.isMultipleCompanyDelete;

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
    keysMap.EXPORT_SUMMARY_DATA,
    () => {
      !block && summary && ExportSectionWiseDataSummary();

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

  let gstr1FromDt =
    sessionStorage.getItem(globleVariable.itc04DateRange) &&
    SessionFunction.getSessionValue(globleVariable.itc04DateRange);

  let itc04ExpLabel = sessionStorage.getItem(globleVariable.itc04ExpLabel) && sessionStorage.getItem(globleVariable.itc04ExpLabel)

  const userIds =
    localStorage.getItem(globleVariable.userId) &&
      LocalFunction.getLocalValue(globleVariable.userId, true)
      ? LocalFunction.getLocalValue(globleVariable.userId, true)
      : " ";

  const finYearOption = LocalFunction.getLocalValue(globleVariable.rangeFiltersITC04, true)
  const YearList = finYearOption !== undefined && finYearOption !== null && finYearOption !== "" && finYearOption !== 'undefined' ? JSON.parse(finYearOption) : []

  // ** New Code For Show Progress-Bar And its Count
  useEffect(() => {
    let count11 = [];

    const progressBarStatus = onSnapshot(doc(db, "Itc04ImportExcelProgress", data1), (doc) => {
      console.log("new firestore changes1", doc?.data());
      if (doc?.data()) {
        console.log("progress data=", doc?.data()?.name);
        setCount(doc?.data()?.name);
        const newValue = doc?.data()?.name;
        count11 = newValue?.split("/");
        setCount1(count11);

        if (count11?.length > 0) {
          setBtnExport(true)
        } else {
          setBtnExport(false)
        }


      } else {
        if (doc?.data() == null) {
          setCount('All');
          const maxProgressBar=[count11[1],count11[1]]
          setCount1(maxProgressBar);
        } else {
          setCount(0);
          setBtnExport(false)
        }
      }
    })

    return () => progressBarStatus();
  }, []);

  //** Don't Remove This Code

  // useEffect(
  //   () =>
  //     onSnapshot(doc(db, "Itc04ImportExcelProgress", data1), (doc) => {
  //       console.log("new firestore changes1", doc?.data());
  //       if (doc?.data()) {
  //         console.log("progress data=", doc?.data()?.name);
  //         setCount(doc?.data()?.name);
  //         const newValue = doc?.data()?.name;
  //         const count11 = newValue?.split("/");
  //         setCount1(count11);

  //         if (count11?.length > 0) {
  //           setBtnExport(true)
  //         } else {
  //           setBtnExport(false)
  //         }


  //       } else {
  //         if (doc?.data() == null) {
  //           setCount('All');
  //         } else {

  //           setCount(0);
  //           setBtnExport(false)
  //         }
  //       }
  //     }),

  //   []
  // );

  useEffect(() => {
    setItcExportDt(YearList)
  }, []);

  // ** Firestore
  useEffect(
    () =>
      onSnapshot(doc(db, "Itc04ImportExcelProgressMessage", data1), (doc) => {
        console.log("new firestore changes1", doc?.data());
        if (doc?.data()) {
          console.log("progress data=", doc?.data()?.name);
          // setCount(doc?.data()?.PurchaseImportExcelProgress)
          setProgressMessage(doc?.data()?.name);
          // setNotification([doc.data()])
        } else {
          // setCount(0);
          // setNotification([])
          if (doc?.data() == null) {
            // setCount(12);
          } else {

            setCount(0);
          }
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

  // ** multiple delete option
  const multipleDeleteFunc = (type) => {
    if (type == 'single') {
        setDeleteType('single')
    } else if (type == 'multiple') {
      setDeleteType('multiple')
    }
    HideShowDeleteModel()
}


  const steps = [
    {
      id: "gstr1-summary",
      title: "Summary and Invoices Details",
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
            wizardBtn
          }}
        />
      ),
    },
    {
      id: "save-data",
      title: "Save data on Portal",
      content: (
        <ITCDownload
          userIds={data1}
          clientIds={G_UCParId}
          GSTIN={G_GSTIN}
          stepper={stepper}
          wizardIndex={wizardBtn}
        ></ITCDownload>
      ),
    },
    {
      id: "submit-return",
      title: "Submit Return",
      content: <SubmitForms
        userIds={userIds}
        clientIds={G_UCParId}
        GSTIN={G_GSTIN}
        stepper={stepper}
        finYear={G_FY}
        finMonth={G_FM}
        wizardIndex={wizardBtn}
      />
    },
  ];

  const handleFireStore = (value) => {
    // setSwitchOn(value)
    setCount1(0);
    setCount(0);
    setProgressMessage("");
    // debugger
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
    // alert(`${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`)
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

  // **  use This custom hook - Avoid to direct Refresh while excel file import
     useConfirmRefresh(progressModal)

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

  const Itc04SalesSummaryService = () => {
    setBlock(true)
    const itcSummaryDtRange = gstr1FromDt !== null && gstr1FromDt !== undefined && gstr1FromDt !== ' ' ? gstr1FromDt : itcExportDt[0].value
    itc04SummaryService.getITC04Summary(G_UCParId, itcSummaryDtRange, itcSummaryDtRange).then(res => {
      // gstr1SummaryServices.getGSTR1Summary(G_UCParId, gstr1Range, gstr1Range).then(res => {
      if (res.status === 200 && res.data.status === errorCodeConfig.APIDefaultCode.Success) {
        setBlock(false)
        setDatas(res.data.data)

      } else {
        setBlock(false)
        toast.error(res?.data?.errorMessage, {
          position: "top-right",
        });
      }
    }).catch(error => {
      setBlock(false)
      Swal.fire({
        icon: 'error',
        title: '',
        text: error?.message,
        customClass: {
          confirmButton: 'btn btn-danger'
        },
        buttonsStyling: false
      })
    })
  }

  const array = [];

  datas.map((ele, index) => {
    array.push({ label: ele.sectionname, value: ele.typeofInvoiceId })
  })

  const ExportSectionWiseDataSummary = () => {
    // console.log(finFromYear?.value);
    // console.log(monthFrom?.value);
    console.log('export data');

    setBlock(true);

    const itc04SectionID = activeTab == 1 ? 1 : activeTab == 2 ? 2 : activeTab == 3 ? 3 : activeTab == 4 ? 4 : 0;
    const itcExpDtRange = gstr1FromDt !== null && gstr1FromDt !== undefined && gstr1FromDt !== ' ' ? gstr1FromDt : itcExportDt[0].value
    const returnPeriodlabel = itc04ExpLabel !== null && itc04ExpLabel !== undefined && itc04ExpLabel !== '' ? itc04ExpLabel : itcExportDt[0].label

    itc04SummaryService.exportITC04ExportData(G_UCParId, itcExpDtRange, returnPeriodlabel, itc04SectionID, token, G_GSTIN).then(res => {

      if (res?.status == 200 && res?.data?.status === errorCodeConfig.APIDefaultCode.Success) {
        setBlock(false);
        downloadURL(res?.data?.data)
      }
      else if (res?.status == 401) {

        tokenExpiresRedirect()
      }
      else {
        setBlock(false);

        toast.error(res?.data?.errorMessage, {
          position: "top-right",
        });
      }

    }).catch(error => {
      setBlock(false);
      // setSrcLoad(false);
      Swal.fire({
        icon: 'error',
        title: '',
        text: error?.message,
        customClass: {
          confirmButton: 'btn btn-outline-danger'
        },
        buttonsStyling: false
      })
    })

  }

  const onClickExportJSONAPIITC04 = () => {
    const payLoad = {
     userClientId: G_UCParId,
     userId: LocalFunction.getLocalValue(globleVariable.userId, true),
     returnPeriod: sessionStorage.getItem("gstr6DownloadFromDt"),
     loggedGSTIN: G_GSTIN,

   };
   setBlock(true);
   console.log(payLoad, "payLoadpayLoadpayLoadpayLoad");
   itc04SummaryService.ITC04ExportJson(payLoad)
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
        <div className="content-header-left col-md-6 col-12">
          <div className="row breadcrumbs-top">
            <div className="col-12">
              {summary ? (
                <Breadcrumbs
                  title="Purchase Summary"
                  data={[
                    { title: "GST Returns" ,link: urlEndpointConfig.GSTR_All},
                    { title: "ITC-04 Summary" },
                  ]}
                />
              ) : (
                <Breadcrumbs
                  title="Purchase Summary"
                  data={[
                    { title: "GST Returns",link: urlEndpointConfig.GSTR_All},
                    { title: "ITC-04 Summary", link: "/gst-returns/itc-returns" },
                    { title: "ITC-04 Data" },
                  ]}
                />
              )}
            </div>
          </div>
        </div>
        {wizardBtn === 0 && (
          <div className="content-header-right text-md-end col-md-6 col-12 d-md-block d-none">
            {summary ? (
              <>

                  {
                    isMultipleCompanyDelete  == 0 &&
                    <><Button
                    className="btn-icon me-1"
                    outline
                    color="danger"
                    id="btnDeletePurchase"
                    onClick={HideShowDeleteModel}
                  >
                    <Trash2 size={14} />
                    <span className="align-middle ms-50">
                      Delete
                    </span>
                  </Button><UncontrolledTooltip placement="top" target="btnDeletePurchase">
                      Delete [{keysMap.DELETE_DATA}]
                    </UncontrolledTooltip></>
                  }


                  {
                    isMultipleCompanyDelete  == 1 &&

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


                <DropDownITC04Import
                  handleFireStore={handleFireStore}
                  loadFunction={loadFunction}
                  // PurchaseSummaryService={PurchaseSummaryService}
                  block={block}
                  setBlock={setBlock}
                  clientId={G_UCParId}
                  finYear={G_FY}
                  finMonth={G_FM}
                //  buttonDisable={btnExport}
                ></DropDownITC04Import>
                <Button
                  type="button"
                  className="me-1"
                  outline
                  onClick={ExportSectionWiseDataSummary}
                  color="danger"
                  id="btnexp1"
                >
                  <i className="fa fa-file-excel-o"></i>&nbsp; Export
                  <UncontrolledTooltip placement="top" target="btnexp1">
                    Export  [{keysMap.EXPORT_SUMMARY_DATA}]
                  </UncontrolledTooltip>
                </Button>
                <Button
                  type="button"
                  outline
                  onClick={onClickExportJSONAPIITC04}
                  color="danger"
                  id="exportjsonData"
                >
                  <i className="fa fa-file-code-o"></i>&nbsp; Export JSON
                  <UncontrolledTooltip placement="top" target="exportjsonData">
                  Export JSON
                  </UncontrolledTooltip>
                </Button>
              </>
            ) : (
              <>
                {(activeTab.activeTab == 1 ||
                  activeTab.activeTab == 2 ||
                  activeTab.activeTab == 3 ||
                  activeTab.activeTab == 4 ||
                  activeTab.activeTab == 5 ||
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
                      <span className="align-middle ms-50">
                        Delete
                      </span>
                      <UncontrolledTooltip placement="top" target="btnDelete">
                        Delete [{keysMap.DELETE_DATA}]
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
                  activeTab.activeTab == 3 ||
                  activeTab.activeTab == 4 ||
                  activeTab.activeTab == 5 ||
                  activeTab.activeTab == 6) && (
                    <Button
                      type="button"
                      className="me-1"
                      outline
                      color="danger"
                      onClick={activeTab.ClearFilter}
                      id='btnclr1'
                    >
                      <i className="fa fa-filter fa-lg"></i>
                      <span className="align-middle ms-50">
                        Clear
                      </span>
                      <UncontrolledTooltip placement="top" target="btnclr1">
                        Clear [{keysMap.CLEAR_DATA}]
                      </UncontrolledTooltip>
                    </Button>
                  )}
              </>
            )}
          </div>
        )}
           {wizardBtn === 1 && (
          <div className="content-header-right text-md-end col-md-6 col-12 d-md-block d-none">
             <Button
                  type="button"
                  outline
                  onClick={onClickExportJSONAPIITC04}
                  color="danger"
                  id="exportjsonData"
                >
                  <i className="fa fa-file-code-o"></i>&nbsp; Export JSON
                  <UncontrolledTooltip placement="top" target="exportjsonData">
                  Export JSON
                  </UncontrolledTooltip>
                </Button>
          </div>
        )}
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
        <DeleteModelITC04Sales
          Heading="Delete ITC 04"
          SuccessButtonText="Delete"
          show={deleteModalshow}
          toggleCompose={toggleCompose}
          array={array.length > 0 ? array : ""}
          Itc04SalesSummaryService={Itc04SalesSummaryService}
          Company_GSTIN={G_GSTIN}
          deleteType={deleteType}
        ></DeleteModelITC04Sales>
      )}

      <Modal
        backdrop="static"
        // isOpen={true}
        isOpen={progressModal}
        className={"modal-dialog-centered"}
      >
        <div className="modal-header">
          <h2 className="modal-title w-100 text-center">
            Import Excel Progress ITC-04
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
      <VerificationModal composeOpen={composeOpen} toggleCompose={toggleCompose1} userClientIds={G_UCParId}
        messageDisplay={msgDisplay} otpGSTIN={G_GSTIN}
      ></VerificationModal>
    </Fragment>
  );
};

export default ITCPurchase;
