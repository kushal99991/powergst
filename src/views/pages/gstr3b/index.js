import { Fragment, useEffect, useRef, useState } from "react";
import Breadcrumbs from "@components/breadcrumbs";
import Wizard from "@components/wizard";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import GSTR3BDetails from "./gstr-3b-data";
import {
  Button,
  Modal,
  ModalBody,
  Form,
  FormFeedback,
  Row,
  Col,
  Label,
  Input,
  UncontrolledTooltip,
  UncontrolledButtonDropdown,DropdownToggle, DropdownMenu, DropdownItem
} from "reactstrap";
import { globleVariable } from "../../../configs/globalVariable";
import SessionFunction from "../../../configs/getSessionFunction";
import LocalFunction from "../../../configs/getLocalFunction";
import GSTR3BDownloadService from "../../../services/gstr3b/gstr3bDownloadService";
import GSTR1DownloadService from "../../../services/gstr1/gstr1Services/gstr1DownloadService";
import { useHotkeys } from "react-hotkeys-hook";
import { keysMap, enableOnFormTags } from "../../../configs/config";
import Gstr3Download from "./gstr3-download";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";
import { File, CheckCircle, ArrowLeft, ArrowRight , ChevronDown  } from "react-feather";
import Swal from "sweetalert2";
import errorCodeConfig from "../../../configs/apiErrorCodeConfig";
import VerificationModal from '../../../views/pages/verification-otp/index'
import PanVerifyModal from "../../components/panVerifyModal/index"
import { FilePlus, Trash2, X, Download } from "react-feather";
import DropDownGstr3bImport from "../../components/Dropdown-GSTR3b-Import";
import DropDownGSTR3bExport from "../../components/dropDownGSTR3bExp/index";
import DeleteModelGSTR3B from "../../components/models/DeleteModelGSTR3b";
import { urlEndpointConfig } from "@configs/urlEndpoint";
import { downloadURL } from "../../../helper/downloadUrl";
import gstr3bService from "../../../services/gstr3b/gstr3bService";

const defaultValues = {
  otp: "",
};

const SubmitForms = (props) => {
  const [block, setBlock] = useState(false);
  const [show, setShow] = useState(false);
  const { clientIds, userIds, GSTIN, stepper, finYear, finMonth, wizardIndex } = props;
  const [msgDisplay, setMsgDisplay] = useState(null);
  const [composeOpen, setComposeOpen] = useState(false)
  const toggleCompose1 = () => setComposeOpen(!composeOpen)
  const [panNo, setPanNo] = useState('')
  const [ackNum, setAckNum] = useState(null);
  const [composeOpenPan, setComposeOpenPan] = useState(false);
  const toggleComposePan = () => setComposeOpenPan(!composeOpenPan);
  const [selectedPan, setSelectedPan] = useState(null);



  const acKnowNoFileStatus = sessionStorage.getItem("gstR3AckNumber");
  const acKnowNoFileStatusDate = sessionStorage.getItem("gstR3AckNumberDate");

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ defaultValues });


  useEffect(() => {
    return () => setBlock(false);
  }, []);

  // ** Toggles close POPUP
  const togglePopUp = (e) => {
    reset();
    setShow(false);
  };

  const FileGSTR1OnClick = (data) => {
    const payLoad = {
      userClientId: clientIds,
      userId: userIds,
      returnPeriod: sessionStorage.getItem(globleVariable.gstr3bDownloadFromDt),
      loggedGSTIN: GSTIN,
      otp: data.otp,
      panNumber: selectedPan
    };

    setBlock(true);
    GSTR3BDownloadService.fileGstr3bGovt(payLoad)
      .then((res) => {
        if (
          res.status === 200 &&
          res.data.status === errorCodeConfig.APIDefaultCode.Success
        ) {

          const parsedData = JSON.parse(res.data.data);
          console.log("res.data.status", parsedData);
          setAckNum(parsedData?.ack_num);

          if (parsedData?.ack_num !== null && parsedData?.ack_num != "") {
            sessionStorage.setItem("btnDisable3b", "5")
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
  };

  // ** initate EVC OTP
  const initateEvcOtpOnClick = () => {
    const payLoad = {
      userClientId: clientIds,
      userId: userIds,
      returnPeriod: sessionStorage.getItem(globleVariable.gstr3bDownloadFromDt),
      loggedGSTIN: GSTIN,
      panNumber: selectedPan
    };

    setBlock(true);
    GSTR3BDownloadService.generateEvcOtpGovt(payLoad)
      .then((res) => {
        if (res.data.status === errorCodeConfig.APIDefaultCode.GovtOTPExpire) {
          setBlock(false);
          setMsgDisplay(res?.data?.errorMessage)
          setComposeOpen(true)
            ;
        } else {
          if (
            res.status === 200 &&
            res.data.status === errorCodeConfig.APIDefaultCode.Success
          ) {
            setShow(!show);
            setBlock(false);
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

      if (
        res.status === 200
      ) {
        setBlock(false);

        if (res?.data?.data?.isGSTR3BFiled) {

          if (res?.data?.data?.gstR3BAcknowledgementNumber) {

            sessionStorage.setItem("gstR3AckNumber", res?.data?.data?.gstR3BAcknowledgementNumber);
            sessionStorage.setItem("gstR3AckNumberDate", res?.data?.data?.gstR3BAcknowledgementDate);
          } else {
            sessionStorage.removeItem("gstR3AckNumber");
            sessionStorage.removeItem("gstR3AckNumberDate");
          }

          sessionStorage.setItem("btnDisable3b", '5');

        } else {
          // sessionStorage.setItem("btnDisable3b", '');
          if(sessionStorage.getItem("isClickNilReturn") && res?.data?.data?.isGSTR3BFiled == false){
            sessionStorage.setItem("btnDisable3b", '4');
          }else{
            sessionStorage.setItem("btnDisable3b", '');
          }

          sessionStorage.removeItem("gstR3AckNumber");
          sessionStorage.removeItem("gstR3AckNumberDate");
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

  useEffect(() => {

    if (wizardIndex == 2) {

      returnFileStatus()
    }

  }, [wizardIndex])

  let disableButton = sessionStorage.getItem("btnDisable3b") == undefined ||
    sessionStorage.getItem("btnDisable3b") == 'undefined' || parseInt(sessionStorage.getItem("btnDisable3b")) == 5 ? true :
    parseInt(sessionStorage.getItem("btnDisable3b")) == 4 ? false : true

  console.log(sessionStorage.getItem("btnDisable3b"),'btnDisable3bPrint')

  return (
    <>
      {block && <div className="loading1">Loading&#8230;</div>}
      <Row>
        <Col md={4}></Col>
        <Col md={4}>
          {
            parseInt(sessionStorage.getItem("btnDisable3b")) == 5 ?
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
              className={disableButton == true ? "btn-icon disabledBtn" : "btn-icon"}
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
                  !sessionStorage.getItem("btnDisable3b") ||
                    sessionStorage.getItem("btnDisable3b") == undefined ||
                    sessionStorage.getItem("btnDisable3b") == 'undefined' ||
                    parseInt(sessionStorage.getItem("btnDisable3b")) == 0 ||
                    parseInt(sessionStorage.getItem("btnDisable3b")) == 1 ||
                    parseInt(sessionStorage.getItem("btnDisable3b")) == 2 ||
                    parseInt(sessionStorage.getItem("btnDisable3b")) == 3 ||
                    parseInt(sessionStorage.getItem("btnDisable3b")) == 4 ?
                    "File GSTR 3B" : "GSTR 3B Is Already Filed"}


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
          toggle={() => setShow(!show)}
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
                      tabIndex="1"
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
        messageDisplay={msgDisplay} otpGSTIN={GSTIN}

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

const GSTR3BFiled = () => {
  const wizardRef = useRef(null);
  const navigate = useNavigate();
  // ** State
  const [stepper, setStepper] = useState(null);
  const [block, setBlock] = useState(false);
  const [wizardBtn, setWizardBtn] = useState(0);
  const [summary, setSummary] = useState(true);
  const [activeTab, setactiveTab] = useState();
  const [returnStatus3b, setReturnStatus3b] = useState(false);

  const [msgDisplay, setMsgDisplay] = useState(null);
  const [composeOpen, setComposeOpen] = useState(false)
  const toggleCompose1 = () => setComposeOpen(!composeOpen)
  const [searchDataApi, setSearchDataApi] = useState(false);
  // ** Delete
  const [deleteModalshow, setDeleteModalshow] = useState(false);
  const [autopopulatedData, setAutopopulatedData] = useState(false);
  const [deleteType , setDeleteType] = useState('single')

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const wizardData = queryParams.get("gstr3b");

  const gstr3BToDt =
    sessionStorage.getItem(globleVariable.defaultYear) !== null &&
      sessionStorage.getItem(globleVariable.defaultYear) !== "" &&
      sessionStorage.getItem(globleVariable.defaultYear) !== undefined
      ? SessionFunction?.getSessionValue(globleVariable?.defaultYear, true)
      : "";


  //** Shortcut keys
  useHotkeys(
    keysMap.CLEAR_DATA,
    () => {
      !block;
    },
    { enableOnFormTags }
  );

  const G_UCParId =
    sessionStorage.getItem(globleVariable.G_UCParId) &&
    SessionFunction.getSessionValue(globleVariable.G_UCParId, true);
  const G_GSTIN =
    sessionStorage.getItem(globleVariable.G_GSTIN) &&
    SessionFunction.getSessionValue(globleVariable.G_GSTIN, true);
  const userIds =
    localStorage.getItem(globleVariable.userId) &&
      LocalFunction.getLocalValue(globleVariable.userId, true)
      ? LocalFunction.getLocalValue(globleVariable.userId, true)
      : " ";
  let GFY =
    sessionStorage.getItem(globleVariable.G_FY) &&
    SessionFunction.getSessionValue(globleVariable.G_FY, true);
  let GFM =
    sessionStorage.getItem(globleVariable.G_FM) &&
    SessionFunction.getSessionValue(globleVariable.G_FM, true);

    const userDatadecrypt = LocalFunction.getLocalValue(
      globleVariable.userData,
      true
    );

    const userData = userDatadecrypt && JSON.parse(userDatadecrypt);
    const isMultipleCompanyDelete = userData && userData.data.isMultipleCompanyDelete;



  useEffect(() => {
    wizardData && stepper !== null && stepper.to(2);
  }, [stepper]);

  // **  check user returnFileStatus
  var isGSTR3BFiledStatus = false;
  console.log(isGSTR3BFiledStatus, '3bbb', returnStatus3b)

  const returnFileStatus = () => {
    // sessionStorage.removeItem("gstR3AckNumber")

    const payLoad = {
      clientId: G_UCParId,
      gstinNumber: G_GSTIN,
      financialYearIdID: parseInt(GFY),
      month: parseInt(GFM),
    };
    setBlock(true);
    GSTR1DownloadService.checkFiledUserStatus(payLoad).then((res) => {
      if (
        res.status === 200 &&
        res.data.status === errorCodeConfig.APIDefaultCode.Success
      ) {
        setBlock(false);
        if (res?.data?.data?.isGSTR3BFiled) {

          if (res?.data?.data?.gstR3BAcknowledgementNumber) {

            sessionStorage.setItem("gstR3AckNumber", res?.data?.data?.gstR3BAcknowledgementNumber);
          }

          sessionStorage.setItem("btnDisable3b", '5');
          // stepper.next();
          isGSTR3BFiledStatus = true;
          setReturnStatus3b(true)
        } else {
          
          if(sessionStorage.getItem("isClickNilReturn") && res?.data?.data?.isGSTR3BFiled == false){
            sessionStorage.setItem("btnDisable3b", '4');
          }else{
            sessionStorage.setItem("btnDisable3b", '');
          }
          
        }
      } else {
        setBlock(false);
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

  useEffect(() => {
    if (wizardBtn == 0) {
      returnFileStatus()
    }
  }, [wizardBtn]);

  const steps = [
    {
      id: "gstr3b-Details",
      title: "Summary and Invoice Details",
      content: (<GSTR3BDetails isGSTR3BFiledStatus={returnStatus3b} searchDataApi={searchDataApi} setSearchDataApi={setSearchDataApi}
        setAutopopulatedData={setAutopopulatedData} autopopulatedData={autopopulatedData} returnStatus3b={returnStatus3b} stepper={stepper} />),
      active: true,
    },
    {
      id: "gstr3b-",
      title: "Save data on Portal",
      content: (
        <Gstr3Download
          userIds={userIds}
          clientIds={G_UCParId}
          GSTIN={G_GSTIN}
          stepper={stepper}
          wizardIndex={wizardBtn}
          isGSTR3BFiledStatus={returnStatus3b}
        ></Gstr3Download>
      ),
      active: false,
    },
    {
      id: "gstr3b-summary",
      title: "Submit Return",
      content: (
        <SubmitForms
          userIds={userIds}
          clientIds={G_UCParId}
          GSTIN={G_GSTIN}
          stepper={stepper}
          finYear={GFY}
          finMonth={GFM}
          wizardIndex={wizardBtn}
        />
      ),
    },
  ];
  wizardRef?.current?.addEventListener("shown.bs-stepper", function (event) {
    setWizardBtn(event?.detail?.indexStep);
  });
  const loadFunction = (value) => {
    setBlock(value);
  };

  console.log(wizardBtn, "wizardBtnwizardBtnwizardBtn");

  const onClickcomputation = () => {
    navigate("/gst-returns/gstr3b/computation-tax");
  };

  // ** toggle Compose
  const toggleCompose = () => setDeleteModalshow(!deleteModalshow);

  // ** Delete Modal Show/Hide
  const HideShowDeleteModel = () => {
    setDeleteModalshow(!deleteModalshow);
    setSearchDataApi(false)

    if (isMultipleCompanyDelete == 0 ) {
      document.getElementById("btnDeleteGSTR3B").blur();
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

  const onClickAutopopulatedData = () => {
    setAutopopulatedData(true)
  }


   //** Export Json */
   const exportJsonButtonGSTR3b = () => {
    const payLoad = {
      userClientId: G_UCParId,
      userId: LocalFunction.getLocalValue(globleVariable.userId, true),
      returnPeriod: sessionStorage.getItem("gstr3bDownloadFromDt"),
      loggedGSTIN: G_GSTIN,
      isNilReturn: true
    };
    setBlock(true);
    console.log(payLoad, "payLoadpayLoadpayLoadpayLoad");
    gstr3bService.Gstr3bExportJson(payLoad)
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
  };


  return (
    <Fragment>
      {block && <div className="loading1">Loading&#8230;</div>}
      <div className="content-header row py-1">
        <div className="content-header-left col-md-6 col-12">
          <div className="row breadcrumbs-top">
            <div className="col-12">
              <Breadcrumbs
                title="Gstr3b filed data"
                data={[{ title: "GST Returns", link: urlEndpointConfig.GSTR_All }, { title: "GSTR-3B Summary" }]}
              />
            </div>
          </div>
        </div>

        {wizardBtn === 0 &&
          <div
            className={
              "content-header-right text-md-end col-md-6 col-12 d-md-block d-none"
            }
          >
            {/* <Button
              className="btn-icon me-1"
              outline
              color="danger"
              id="btnAutoPop"
               onClick={onClickAutopopulatedData}
               hidden={returnStatus3b}
            >
              <Download size={14} />
              <span className="align-middle ms-50">
                {" "}
                Get Auto Populated Data
              </span>
            </Button>
            <UncontrolledTooltip placement="top" target="btnAutoPop">
              Get Auto Populated Data
            </UncontrolledTooltip> */}

            {
                isMultipleCompanyDelete == 0  &&
                <><Button
                className="btn-icon me-1"
                outline
                color="danger"
                id="btnDeleteGSTR3B"
                onClick={HideShowDeleteModel}
              >
                <Trash2 size={14} />
                <span className="align-middle ms-50">
                  Delete
                </span>
              </Button><UncontrolledTooltip placement="top" target="btnDeleteGSTR3B">
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




            <DropDownGstr3bImport
              loadFunction={loadFunction}
              setSearchDataApi={setSearchDataApi}
              setBlock={setBlock}
            ></DropDownGstr3bImport>

            <DropDownGSTR3bExport
              // data={data}
              loadFunction={loadFunction}
              clientId={G_UCParId}
              finYear={gstr3BToDt}
              finMonth={gstr3BToDt}
              isloading={block}
            />
          </div>

        }
        {wizardBtn === 1 &&
          <div
            className={
              "content-header-right text-md-end col-md-6 col-12 d-md-block d-none"
            }
          >
            {/* Export JSON Button  */}
            <Button
              id="exportjsonBtnGSTR3b"
              onClick={exportJsonButtonGSTR3b}
              className="btn-icon btn-round dropdown-toggle"
              outline
              color="danger"
            >
              {" "}
              <i className="fa fa-file-code-o"></i>&nbsp; Export JSON{" "}
            </Button>
            <UncontrolledTooltip placement="top" target="exportjsonBtnGSTR3b">
              Export JSON
            </UncontrolledTooltip>
          </div>

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
      <VerificationModal composeOpen={composeOpen} toggleCompose={toggleCompose1} userClientIds={G_UCParId}
        messageDisplay={msgDisplay} otpGSTIN={G_GSTIN}
      ></VerificationModal>

      {deleteModalshow && (
        <DeleteModelGSTR3B
          Heading="Delete GSTR3B Summary"
          SuccessButtonText="Delete"
          show={deleteModalshow}
          toggleCompose={toggleCompose}
          setSearchDataApi={setSearchDataApi}
          Company_GSTIN={G_GSTIN}
          deleteType={deleteType}
        ></DeleteModelGSTR3B>
      )}
    </Fragment>
  );
};

export default GSTR3BFiled;
