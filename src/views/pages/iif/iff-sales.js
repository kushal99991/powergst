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
  Input,
  UncontrolledButtonDropdown,
  DropdownToggle,DropdownMenu,DropdownItem
} from "reactstrap";
import DropDownIFFImport from "../../components/Dropdown-IFF-Import";
import db from "../../../firebase/firebase";
import { useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import {
  Trash2,
  File,
  FilePlus,
  CheckCircle,
  ArrowLeft,
  PlusSquare,
  ChevronDown,
} from "react-feather";
import { useHotkeys } from "react-hotkeys-hook";
import { keysMap, enableOnFormTags } from "../../../configs/config";
import DeleteModelIIFSales from "../../components/models/DeleteModelIFFSales";
import Swal from "sweetalert2";
import { globleVariable } from "../../../configs/globalVariable";
import LocalFunction from "../../../configs/getLocalFunction";
import SessionFunction from "../../../configs/getSessionFunction";
import IIFDownload from "./iff-download";
import errorCodeConfig from "../../../configs/apiErrorCodeConfig";
import { downloadURL } from "../../../helper/downloadUrl";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";
import GSTR6DownloadService from "../../../services/gstr6/gstr6DownloadService";
import VerificationModal from '../verification-otp/index'
import PanVerifyModal from "../../components/panVerifyModal/index"
import iifSummaryService from "../../../services/iffServices/iifSummaryService";
import iFFDownloadService from "../../../services/iffServices/iFFDownloadService"
import { urlEndpointConfig } from "@configs/urlEndpoint";
import useConfirmRefresh from "@hooks/useConfirmRefresh";

const defaultValues = {
  otp: "",
};

const SubmitForms = (props) => {
  const [block, setBlock] = useState(false);
  const [show, setShow] = useState(false);
  const { clientIds, userIds, GSTIN, stepper } = props;
  const [msgDisplay, setMsgDisplay] = useState(null);
  const [composeOpen, setComposeOpen] = useState(false)
  const toggleCompose1 = () => setComposeOpen(!composeOpen)
  const [selectedItem, setSelectedItem] = useState(null);
  const [panNo, setPanNo] = useState('')
  const [ackNum, setAckNum] = useState(null);

  const [composeOpenPan, setComposeOpenPan] = useState(false);
  const toggleComposePan = () => setComposeOpenPan(!composeOpenPan);
  const [selectedPan, setSelectedPan] = useState(null);

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

  useEffect(() => {
    return () => setBlock(false);
  }, []);

  const FileGSTR6OnClick = (data) => {
    const payLoad = {
      userClientId: clientIds,
      userId: userIds,
      returnPeriod: sessionStorage.getItem("gstr6DownloadFromDt"),
      loggedGSTIN: GSTIN,
      otp: data.otp,
      panNumber: selectedPan
    };

    setBlock(true);
    GSTR6DownloadService.fileGstr6Govt(payLoad)
      .then((res) => {
        if (
          res.status === 200 &&
          res.data.status === errorCodeConfig.APIDefaultCode.Success
        ) {
          const parsedData = JSON.parse(res.data.data);
          console.log("res.data.status", parsedData);
          setAckNum(parsedData?.ack_num);

          if (parsedData?.ack_num !== null && parsedData?.ack_num != "") {
            sessionStorage.setItem("btnDisable6", "5")
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

    // var panVal = panNo;
    // var regpan = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;

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
      returnPeriod: sessionStorage.getItem("gstr1DownloadFromDt"),
      loggedGSTIN: GSTIN,
      panNumber: selectedPan
    };

    setBlock(true);
    iFFDownloadService.generateEvcOtpGovt(payLoad)
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
    FileGSTR6OnClick(data);
  };

  //** Validation string trim
  const ValidateString = (data) => {
    if (data == undefined || data == "" || data.trim().length == 0) {
      return false;
    } else {
      return true;
    }
  };

  const handleChangePanNo = (event) => {
    setPanNo(event.target.value.toUpperCase());
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


  return (
    <>
      {block && <div className="loading1">Loading&#8230;</div>}
      {/* {
        parseInt(sessionStorage.getItem("btnDisable6")) !== 5 ?
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
            parseInt(sessionStorage.getItem("btnDisable6")) == 5 ?
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
              className="btn-icon"
              outline
              color="danger"
              size="lg"
              onClick={openFileGSTR1}
              disabled={
                sessionStorage.getItem("btnDisable6") == undefined ||
                  sessionStorage.getItem("btnDisable6") == 'undefined' || parseInt(sessionStorage.getItem("btnDisable6")) == 5 ? true :
                  sessionStorage.getItem("btnDisable6") == 4 ? false : true
              }
            >
              <File size={25} />
              <span className="align-middle ms-50 gstr1FilingButton">

                {
                  sessionStorage.getItem("btnDisable6") == undefined ||
                    sessionStorage.getItem("btnDisable6") == 'undefined' ||
                    parseInt(sessionStorage.getItem("btnDisable6")) == 0 ||
                    parseInt(sessionStorage.getItem("btnDisable6")) == 1 ||
                    parseInt(sessionStorage.getItem("btnDisable6")) == 2 ||
                    parseInt(sessionStorage.getItem("btnDisable6")) == 3 ||
                    parseInt(sessionStorage.getItem("btnDisable6")) == 4 ? "File IFF" : "IFF  Filed"}


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
                Acknowledgement  Number : {ackNum}
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
                      // onChange={(e) =>
                      //   field.onChange(e.target.value.replace(/\s/g, ""))
                      // }
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
        messageDisplay={msgDisplay} setSelectedItem={setSelectedItem} types="gstr6" otpGSTIN={GSTIN}
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

const IFFPurchase = () => {
  const token = LocalFunction.getLocalValue(globleVariable.tokenKey, true);

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

  const [msgDisplay, setMsgDisplay] = useState(null);
  const [composeOpen, setComposeOpen] = useState(false)
  const toggleCompose1 = () => setComposeOpen(!composeOpen)


  const [count1, setCount1] = useState(0);
  const [btnExport, setBtnExport] = useState(false)

  // ** Delete
  const [deleteModalshow, setDeleteModalshow] = useState(false);
  // ** toggle Compose
  const toggleCompose = () => setDeleteModalshow(!deleteModalshow);
  const [deleteType , setDeleteType] = useState('single')

  const userDatadecrypt = LocalFunction.getLocalValue(
    globleVariable.userData,
    true
  );

  const userData = userDatadecrypt && JSON.parse(userDatadecrypt);
  const isMultipleCompanyDelete = userData && userData.data.isMultipleCompanyDelete;

  const setGSRT1Data = (summary, tabBtnData) => {
    setSummary(summary);
    setactiveTab(tabBtnData);
  };

  const invoiceList = activeTab?.InvoiceList?.filter(
    (p) => p.typeofInvoiceId <= 4
  );

  console.log(invoiceList, "invoiceList")
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
  // useHotkeys(
  //   keysMap.SAVE_DATA,
  //   () => {
  //     !block &&
  //       (activeTab.activeTab == 4 || activeTab.activeTab == 5) &&
  //       activeTab.ItcSavePurchaseInvoice();
  //   },
  //   { enableOnFormTags }
  // );
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
  useHotkeys(
    keysMap.SAVE_DATA,
    () => {
      activeTab.activeTab == 7 && activeTab.ItcSaveInvoice()
      activeTab.activeTab == 8 && activeTab.lateFeeSaveInvoice()
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
  const gstr1FromDt =
    sessionStorage.getItem(globleVariable.gstr1FromDt) &&
    SessionFunction.getSessionValue(globleVariable.gstr1FromDt, true);

  // ** New Code For Show Progress-Bar And its Count
  useEffect(() => {
    let count11 = [];

    const progressBarStatus = onSnapshot(doc(db, "IFFImportExcelProgress", data1), (doc) => {

      console.log("new firestore changes1--Gstr6ImportExcelProgress", doc?.data());
      if (doc?.data()) {
        console.log("progress data=???", doc?.data()?.name);
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
          const maxProgressBar = [count11[1], count11[1]]
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
  //     onSnapshot(doc(db, "Gstr6ImportExcelProgress", data1), (doc) => {

  //       console.log("new firestore changes1--Gstr6ImportExcelProgress", doc?.data());
  //       if (doc?.data()) {
  //         console.log("progress data=???", doc?.data()?.name);
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

  // ** Firestore
  useEffect(
    () =>
      onSnapshot(doc(db, "IFFImportExcelProgressMessage", data1), (doc) => {
        console.log("new firestore changes1", doc?.data());
        if (doc?.data()) {
          console.log("progress data==", doc?.data()?.name);
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
            stepper,
          }}
        />
      ),
    },
    {
      id: "save-data",
      title: "Save data on Portal",
      content: (
        <IIFDownload
          userIds={data1}
          clientIds={G_UCParId}
          GSTIN={G_GSTIN}
          stepper={stepper}
          wizardIndex={wizardBtn}
        ></IIFDownload>
      ),
    },
    {
      id: "submit-return",
      title: "Submit Return",
      content: (
        <SubmitForms
          userIds={data1}
          clientIds={G_UCParId}
          GSTIN={G_GSTIN}
          stepper={stepper}
        ></SubmitForms>
      ),
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

  const iifSalesSummaryService = () => {
    setBlock(true);
    iifSummaryService
      .getIIFSummary(G_UCParId, gstr1FromDt, gstr1FromDt)
      .then((res) => {
        // gstr1SummaryServices.getGSTR1Summary(G_UCParId, gstr1Range, gstr1Range).then(res => {
        if (
          res.status === 200 &&
          res.data.status === errorCodeConfig.APIDefaultCode.Success
        ) {
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

  const array = [];

  datas.map((ele, index) => {
    array.push({ label: ele.sectionname, value: ele.typeofInvoiceId });
  });

  const ExportSectionWiseDataSummary = () => {
    // console.log(finFromYear?.value);
    // console.log(monthFrom?.value);
    console.log("export data");

    setBlock(true);

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

    iifSummaryService
      .exportIffExportData(
        G_UCParId,
        gstr1FromDt,
        gstr1FromDt,
        gstr1SectionId,
        token,
        G_GSTIN
      )
      .then((res) => {
        if (res?.status == 200) {
          console.log(res?.data.data, "poweerrrr");
          // setTimeout(() => {
          setBlock(false);
          downloadURL(res?.data?.data);
          // }, 1000);
        } else if (res?.status == 401) {
          tokenExpiresRedirect();
        } else {
          console.log("res2");
          setBlock(false);

          toast.error(res.headers.errormessage, {
            position: "top-right",
          });
        }
      })
      .catch((error) => {
        setBlock(false);
        // setSrcLoad(false);
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



  const onClickExportJSONAPIIFF = () => {
    const payLoad = {
     userClientId: G_UCParId,
     userId: LocalFunction.getLocalValue(globleVariable.userId, true),
     returnPeriod: sessionStorage.getItem("gstr1DownloadFromDt"),
     loggedGSTIN: G_GSTIN,

   };
   setBlock(true);
   console.log(payLoad, "payLoadpayLoadpayLoadpayLoad");
   iifSummaryService.IFFExportJson(payLoad)
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
      {/* {block && <div className="loading1">Loading&#8230;</div>} */}
      <div className="content-header row py-1">
        <div className="content-header-left col-md-6 col-12">
          <div className="row breadcrumbs-top">
            <div className="col-12">
              {summary ? (
                <Breadcrumbs
                  title="Purchase Summary"
                  data={[{ title: "GST Returns", link: urlEndpointConfig.GSTR_All }, { title: "IFF Summary" }]}
                />
              ) : (
                <Breadcrumbs
                  title="Purchase Summary"
                  data={[
                    { title: "GST Returns", link: urlEndpointConfig.GSTR_All },
                    { title: "IFF Summary", link: urlEndpointConfig.IFF },
                    { title: "IFF Data" },
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
                    <span className="align-middle ms-50">
                      Delete
                    </span>
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




                <DropDownIFFImport
                  handleFireStore={handleFireStore}
                  loadFunction={loadFunction}
                  // PurchaseSummaryService={PurchaseSummaryService}
                  block={block}
                  setBlock={setBlock}
                  clientId={G_UCParId}
                  finYear={G_FY}
                  finMonth={G_FM}
                // buttonDisable={btnExport}
                ></DropDownIFFImport>
                <Button
                  type="button"
                  className="me-1"
                  outline
                  onClick={ExportSectionWiseDataSummary}
                  color="danger"
                  id="btnexp6"
                >
                  <i className="fa fa-file-excel-o"></i>&nbsp; Export
                  <UncontrolledTooltip placement="top" target="btnexp6">
                    Export [{keysMap.EXPORT_SUMMARY_DATA}]
                  </UncontrolledTooltip>
                </Button>
                <Button
                  type="button"
                  outline
                  onClick={onClickExportJSONAPIIFF}
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
                {(activeTab.activeTab == 7 || activeTab.activeTab == 8) && (
                  <Button
                    className="btn-icon me-1"
                    outline
                    color="danger"
                    id="btnSave"
                    onClick={activeTab.activeTab == 7 ? activeTab.ItcSaveInvoice : activeTab.lateFeeSaveInvoice}
                  >
                    <PlusSquare size={14} />
                    <span className="align-middle ms-50">
                      Save
                    </span>
                    <UncontrolledTooltip placement="top" target="btnSave">
                      Save [{keysMap.SAVE_DATA}]
                    </UncontrolledTooltip>
                  </Button>
                )}

                {(activeTab.activeTab == 1 ||
                  activeTab.activeTab == 2 ||
                  activeTab.activeTab == 3 ||
                  activeTab.activeTab == 4 ||
                  activeTab.activeTab == 5 ||
                  activeTab.activeTab == 6 ||
                  activeTab.activeTab == 7 ||
                  activeTab.activeTab == 8) && (
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
                  id="btnExport6"
                >
                  <i className="fa fa-file-excel-o"></i> {"    "}
                  Export
                  <UncontrolledTooltip placement="top" target="btnExport6">
                    Export  [{keysMap.EXPORT_DATA}]
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
                  onClick={onClickExportJSONAPIIFF}
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
        <DeleteModelIIFSales
          Heading="Delete IFF"
          SuccessButtonText="Delete"
          show={deleteModalshow}
          toggleCompose={toggleCompose}
          array={array.length > 0 ? array : ""}
          iifSalesSummaryService={iifSalesSummaryService}
          Company_GSTIN={G_GSTIN}
          deleteType={deleteType}
        ></DeleteModelIIFSales>
      )}

      <Modal
        backdrop="static"
        // isOpen={true}
        isOpen={progressModal}
        className={"modal-dialog-centered"}
      >
        <div className="modal-header">
          <h2 className="modal-title w-100 text-center">
            Import Excel Progress IFF
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
          frmType={"iffData"}
          redirectType="iff"
          returnDate={gstr1FromDt}
        ></PurchaseTypesModal>
      )}
      <VerificationModal composeOpen={composeOpen} toggleCompose={toggleCompose1} userClientIds={G_UCParId}
        messageDisplay={msgDisplay} otpGSTIN={G_GSTIN}
      ></VerificationModal>
    </Fragment>
  );
};

export default IFFPurchase;
