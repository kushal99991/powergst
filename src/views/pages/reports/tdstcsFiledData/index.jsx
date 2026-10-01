import { Fragment, useRef, useState } from "react";
import Breadcrumbs from "@components/breadcrumbs";
import Wizard from "@components/wizard";
import { Outlet, useLocation,useNavigate } from "react-router-dom";
import {
  Button,
  Modal,
  ModalBody,
  UncontrolledTooltip,
  Row,
  Col,
  Label,
  UncontrolledButtonDropdown,DropdownToggle, DropdownMenu, DropdownItem,
} from "reactstrap";
import { useEffect } from "react";
import { X, DownloadCloud,ChevronDown } from "react-feather";
import { useHotkeys } from "react-hotkeys-hook";
import { keysMap, enableOnFormTags } from "../../../../configs/config";
import TDSTCSFiledDownload from "./tds-tcs-file-downloads";
import { globleVariable } from "../../../../configs/globalVariable";
import LocalFunction from "../../../../configs/getLocalFunction";
import SessionFunction from "../../../../configs/getSessionFunction";
import VerificationModal from "../../verification-otp/index";

import makeAnimated from "react-select/animated";
import Select from "react-select";
import { selectThemeColors } from "@utils";
import { DROPDOWN_PLACEHOLDER } from "../../../../configs/config";
import gstr1FileDataService from "../../../../services/gstr1/gstr1DataFileService/gstr1FileDataService";
import Swal from "sweetalert2";
import { toast } from "react-hot-toast";
import errorCodeConfig from "../../../../configs/apiErrorCodeConfig";
import { urlEndpointConfig } from "@configs/urlEndpoint";
import tdstcsFiledService from "../../../../services/tdstcsFiled/tdstcsFiledService";
import { downloadURL } from "../../../../helper/downloadUrl";
import { tokenExpiresRedirect } from "../../../../utility/Utils";
import commonService from "../../../../services/commonService";

const animatedComponents = makeAnimated();

const TDSTCSFiledData = () => {
  const wizardRef = useRef(null);
  const navigate = useNavigate()

  // ** State
  const [stepper, setStepper] = useState(null);
  const [summary, setSummary] = useState(true);
  const [activeTab, setActiveTab] = useState();
  const [block, setBlock] = useState(false);

  const [wizardBtn, setWizardBtn] = useState(0);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const tdstcsData = queryParams.get("tdstcs");
  const isInInvoicePage = location.pathname.incd;

  // ** Delete
  // const [downloadStart, setDownloadStart] = useState(false);
  const [downloadModal, setDownloadModal] = useState(false);
  const [finFromYear, setFinFormYear] = useState(null);
  const [displayType, setDisplayType] = useState([]);
  const [panDataFrom, setPanDataFrom] = useState([]);
  const [panData, setPanData] = useState([]);
  const [msgDisplay, setMsgDisplay] = useState(null);
  // const [downloadDate, setDownloadDate] = useState(false);
  const [typeOfDownload,setTypeOfDonwload] = useState("");
  const [composeOpen, setComposeOpen] = useState(false);
  const [tdsTcsSectionId, setTdsTcsSectionId] = useState("0");

  const toggleCompose1 = () => setComposeOpen(!composeOpen);

  const setTDSTCSData = (summary, tabBtnData) => {
    setSummary(summary);
    setActiveTab(tabBtnData);
  };

  const token = LocalFunction.getLocalValue(globleVariable.tokenKey, true);

  const finYearOption =
    localStorage.getItem(globleVariable.rangeFilters) &&
    LocalFunction.getLocalValue(globleVariable.rangeFilters, true);

  const isclientId =
    sessionStorage.getItem(globleVariable.G_UCParId) &&
    SessionFunction.getSessionValue(globleVariable.G_UCParId, true);

  const G_UCParId =
    sessionStorage.getItem(globleVariable.G_UCParId) &&
    SessionFunction.getSessionValue(globleVariable.G_UCParId, true);

  const userIds =
    localStorage.getItem(globleVariable.userId) &&
    LocalFunction.getLocalValue(globleVariable.userId, true);

  const gstnin =
    sessionStorage.getItem(globleVariable.G_GSTIN) &&
    SessionFunction.getSessionValue(globleVariable.G_GSTIN, true);

  const tdstcsFiledFromDt =
    sessionStorage.getItem(globleVariable.tdstcsFiledFromDt) &&
    SessionFunction.getSessionValue(globleVariable.tdstcsFiledFromDt, true);

  const tdstcsFiledToDt =
    sessionStorage.getItem(globleVariable.tdstcsFiledToDt) &&
    SessionFunction.getSessionValue(globleVariable.tdstcsFiledToDt, true);

  const isdefaultYear =
    sessionStorage.getItem(globleVariable.defaultYear) &&
    SessionFunction.getSessionValue(globleVariable.defaultYear, true);

  const subId =
    localStorage.getItem(globleVariable.subscriptionId) &&
    LocalFunction.getLocalValue(globleVariable.subscriptionId, true);

  const YearList =
    finYearOption !== undefined &&
    finYearOption !== null &&
    finYearOption !== "" &&
    finYearOption !== "undefined"
      ? JSON.parse(finYearOption)
      : [];

  useEffect(() => {
    tdstcsData && stepper !== null && stepper.to(Number(tdstcsData) + 1);
  }, [stepper]);

  useEffect(() => {
    setPanData(YearList);
    setPanDataFrom(YearList);
    setDisplayType(true);
  }, []);

  useEffect(() => {
    if (displayType == true) {
      let defaultValueFrom = null;
      let defaultValueTo = null;
      if (
        tdstcsFiledFromDt !== null &&
        tdstcsFiledFromDt !== "" &&
        tdstcsFiledFromDt !== undefined
      ) {
        defaultValueFrom = panData?.filter(
          (item) => item.value == tdstcsFiledFromDt
        )[0];
      } else {
        defaultValueFrom = panData?.filter(
          (item) => Number(item.value) == Number(isdefaultYear)
        )[0];
      }

      if (
        tdstcsFiledToDt !== null &&
        tdstcsFiledToDt !== "" &&
        tdstcsFiledToDt !== undefined
      ) {
        defaultValueTo = panData?.filter(
          (item) => item.value == tdstcsFiledToDt
        )[0];
      } else {
        defaultValueTo = panData?.filter(
          (item) => Number(item.value) == Number(isdefaultYear)
        )[0];
      }

      if (
        defaultValueFrom !== undefined &&
        defaultValueFrom !== null &&
        defaultValueFrom !== ""
      ) {
        setFinFormYear(defaultValueFrom);
        SessionFunction.setSessionValue(
          globleVariable.tdstcsFiledFromDt,
          defaultValueFrom?.value,
          true
        );
      }
      if (
        defaultValueTo !== undefined &&
        defaultValueTo !== null &&
        defaultValueTo !== ""
      ) {
        SessionFunction.setSessionValue(
          globleVariable.tdstcsFiledToDt,
          defaultValueTo?.value,
          true
        );
      }
    }
  }, [displayType]);

  useHotkeys(
    keysMap.EXPORT_SUMMARY_DATA,
    () => {
      !block && onExportData();
    },
    { enableOnFormTags }
  );

  useHotkeys(
    keysMap.EXPORT_DATA,
    () => {
      !block &&
        wizardBtn === 1 &&
        onExportData();
    },
    { enableOnFormTags }
  );
  useHotkeys(
    keysMap.DOWNLOAD_GOVT_DATA,
    () => {
      wizardBtn == 1 && setDownloadModal(true);
    },
    { enableOnFormTags }
  );

  wizardRef?.current?.addEventListener("shown.bs-stepper", function (event) {
    setWizardBtn(event?.detail?.indexStep);
  });

  const childFunc = useRef(null);

  const steps = [
    {
      id: "tds-tcs-downloads",
      title: "TDS/TCS Downloads",
      content: (
        <TDSTCSFiledDownload wizardBtn={wizardBtn} childFunc={childFunc} />
      ),
      active: tdstcsData != 1,
    },
    {
      id: "tds-tcs-summary",
      title: "Summary and Invoices Details",
      content:
        wizardBtn == 1 ? (
          <Outlet
            context={{
              setTDSTCSData,
              stepper,
              wizardBtn,
              block,
              setBlock,
              setTdsTcsSectionId
              // downloadStart,
              // downloadDate,
              // setDownloadDate,
            }}
          />
        ) : (
          <></>
        ),
      active: wizardBtn == 1,
    },
  ];

  const closeModal = () => {
    setDownloadModal(false);
  };

  const selectReturnPeriodYear = (value) => {
    setFinFormYear(value);
  };

  const downloadGovtTdsTcsFiled = () => {
    console.log('click download')
    setBlock(true);

    const downloadGovtTdsTcsFiled = typeOfDownload == 'withOTP' ?  tdstcsFiledService.downloadGovtTdsTcsFiled :  tdstcsFiledService.downloadGovtTdsTcsFiledWithOutOtp
    downloadGovtTdsTcsFiled(isclientId, userIds, finFromYear.value, subId)
      .then((res) => {
        setBlock(false);
        if (res.data.status === errorCodeConfig.APIDefaultCode.GovtOTPExpire) {
          closeModal();
          setMsgDisplay(res?.data?.errorMessage);
          setBlock(false);

          setComposeOpen(true);
        } else {
          if (
            res?.status == 200 &&
            res.data.status === errorCodeConfig.APIDefaultCode.Success
          ) {
            // setDownloadStart(true);
            setDownloadModal(false);
            // setDownloadDate(true);
            SessionFunction.setSessionValue(
              globleVariable.tdstcsFiledFromDt,
              finFromYear?.value,
              true
            );
            SessionFunction.setSessionValue(
              globleVariable.tdstcsFiledToDt,
              finFromYear?.value,
              true
            );
            toast.success(res.data.successMessage, {
              position: "top-right",
            });
          } else {
            toast.error(res?.data?.errorMessage, {
              position: "top-right",
            });
            setDownloadModal(false);
          }
        }
      })
      .catch((error) => {
        setBlock(false);
        setDownloadModal(false);
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

  const onExportData = () => {
    setBlock(true);
    tdstcsFiledService
      .getSavedExportFileData(
        G_UCParId,
        userIds,
        finFromYear.value,
        finFromYear.value,
        subId,
        gstnin,
        token,
        tdsTcsSectionId
      )
      .then((res) => {
        if (
          res.status == 200 &&
          res?.data?.status == errorCodeConfig.APIDefaultCode.Success
        ) {
          downloadURL(res.data.data);
        } else if (res?.status == 401) {
          tokenExpiresRedirect();
        } else {
          toast.error(res?.data?.errorMessage, {
            position: "top-right",
          });
        }
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "",
          text: error?.message,
          customClass: {
            confirmButton: "btn btn-danger",
          },
          buttonsStyling: false,
        });
      })
      .finally(() => {
        setBlock(false);
      });
  };

  const onClickDeleteReportData = () => {
    const payload = {
      "userClientId": G_UCParId,
      "userId": userIds,
      "fromRange": tdstcsFiledFromDt,
      "toRange": tdstcsFiledToDt,
      "gstNumber": gstnin,
      "module": "TDSTCS"
    }
    commonService.deleteReportData(payload)
      .then((res) => {
        console.log(res,"resss")
        if (res?.status == 200 && res?.data?.status == errorCodeConfig.APIDefaultCode.Success) {
          setBlock(false);
          // sessionStorage.setItem("setRefreshAPIReportDataDeletGSTR6AFiled",true)
          navigate("/reports/tds-tcs-filed-data?tdstcs=1")
        } 
        else {
          setBlock(false);
          toast.error(res.data.errorMessage, {
            position: "top-right",
          });
          // sessionStorage.setItem("setRefreshAPIReportDataDeletGSTR6Filed",true)
          // navigate("/reports/tds-tcs-filed-data?tdstcs=1")
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
                    { title: "Reports", link: urlEndpointConfig.REPORT_ALL },
                    { title: "TDS/TCS Summary" },
                  ]}
                />
              ) : (
                <Breadcrumbs
                  title="Purchase Summary"
                  data={[
                    { title: "Reports", link: urlEndpointConfig.REPORT_ALL },
                    {
                      title: "TDS/TCS Summary",
                      link: urlEndpointConfig.TDS_TCS_REPORT,
                    },
                    { title: "TDS/TCS Filed Data Invoices" },
                  ]}
                />
              )}
            </div>
          </div>
        </div>
        {wizardBtn === 0 ? (
          <div
            className={
              "content-header-right text-md-end col-md-6 col-12 d-md-block d-none"
            }
          >
            <>
              <Button
                type="button"
                className="me-1"
                outline
                color="danger"
                id="clearbtn"
                onClick={() => childFunc.current()}
              >
                <i className="fa fa-filter fa-lg"></i>
                <span className="align-middle ms-50">Clear</span>
              </Button>
              <UncontrolledTooltip placement="top" target="clearbtn">
                Clear [{keysMap.CLEAR_DATA}]
              </UncontrolledTooltip>
            </>
          </div>
        ) : wizardBtn === 1 ? (
          <div className="content-header-right text-md-end col-md-6 col-12 d-md-block d-none">
            {summary ? (
              <>
                {/* <Button
                  type="button"
                  className="me-1"
                  outline
                  onClick={() => setDownloadModal(true)}
                  id="downloaddata"
                  color="danger"
                >
                  <DownloadCloud size={14} />
                  <span className="align-middle ms-50">Download</span>
                </Button>
                <UncontrolledTooltip placement="top" target="downloaddata">
                  Download [{keysMap.DOWNLOAD_GOVT_DATA}]
                </UncontrolledTooltip> */}

              <UncontrolledButtonDropdown disabled={activeTab?.btnDisable1}>
                <DropdownToggle color='danger' outline caret className="me-1"  id="downloaddata">
                  <DownloadCloud size={14} />
                  <span className="align-middle ms-50">
                    Download
                  </span>  &nbsp;
                  <ChevronDown size={14} />
                </DropdownToggle>
                <DropdownMenu className="dropdown-reconcilation-purchase-sumary">
                  <DropdownItem onClick={() => {setDownloadModal(true),setTypeOfDonwload("withOTP")}} tag='a' >With OTP    </DropdownItem>
                  <DropdownItem onClick={() => {setDownloadModal(true),setTypeOfDonwload("withOutOTP")}} tag='a'>Without OTP  </DropdownItem>

                </DropdownMenu>
              </UncontrolledButtonDropdown>


                <Button
                  type="button"
                  className="me-1"
                  outline
                  onClick={onExportData}
                  id="exportData"
                  color="danger"
                >
                  <DownloadCloud size={14} />
                  <span className="align-middle ms-50">Export</span>
                </Button>
                <UncontrolledTooltip placement="top" target="exportData">
                  Export [{keysMap.EXPORT_SUMMARY_DATA}]
                </UncontrolledTooltip>
              </>
            ) : (
              <>
              {console.log(activeTab?.btnDisable1,"btnDisable1")}
                 <Button
                  type="button"
                  className="me-1"
                  outline
                  onClick={onClickDeleteReportData}
                  disabled={activeTab?.btnDisable1}
                  id="refreshAPI"
                  color="danger"
                >
                  Get Party Name
                </Button>
                <UncontrolledTooltip placement="top" target="refreshAPI">
                    Get Party Name
                </UncontrolledTooltip>
                <Button
                  type="button"
                  className="me-1"
                  outline
                  onClick={onExportData}
                  disabled={activeTab?.btnDisable1}
                  id="exportdata"
                  color="danger"
                >
                  <i className="fa fa-file-excel-o"></i> {"    "}
                  Export Data
                </Button>
                <UncontrolledTooltip placement="top" target="exportdata">
                  Export Data [{keysMap.EXPORT_DATA}]
                </UncontrolledTooltip>
                {(activeTab?.activeTab == 1 ||
                  activeTab?.activeTab == 2 ||
                  activeTab?.activeTab == 4 ||
                  activeTab?.activeTab == 3) && (
                  <>
                    <Button
                      type="button"
                      className="me-1"
                      outline
                      color="danger"
                      id="clearbtn"
                      onClick={activeTab.clearFilters}
                    >
                      <i className="fa fa-filter fa-lg"></i>
                      <span className="align-middle ms-50">Clear</span>
                    </Button>
                    <UncontrolledTooltip placement="top" target="clearbtn">
                      Clear [{keysMap.CLEAR_DATA}]
                    </UncontrolledTooltip>
                  </>
                )}
              </>
            )}
          </div>
        ) : (
          <div className="content-header-right text-md-end col-md-6 col-12 d-md-block d-none">
            {/* wizard 3 buttons */}
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
          className={stepper !== null ? "gstr1-wizard" : "gstr1-wizard hidden"}
        />
      </div>
      <Modal
        backdrop="static"
        isOpen={downloadModal}
        toggle={() => setDownloadModal(!downloadModal)}
        className="modal-dialog-centered  modal-sm"
      >
        <div className="modal-header">
          <h2 className="modal-title w-100 text-center">Download Data</h2>
          <div className="modal-actions">
            <a
              onClick={() => setDownloadModal(!downloadModal)}
              className="text-body"
            >
              <X size={14} />
            </a>
          </div>
        </div>

        <hr></hr>
        <ModalBody className="px-sm-2 mx-30 pb-2">
          <Row tag="form" className="gy-1 pt-75">
            <Col xs={3}></Col>
            <Col xs={6}>
              <Label className="form-label" for="status">
                <b> Return Period </b>
              </Label>
              <Select
                id="purchaseId_invtype"
                maxMenuHeight="120px"
                isClearable={false}
                theme={selectThemeColors}
                closeMenuOnSelect={true}
                components={animatedComponents}
                placeholder={DROPDOWN_PLACEHOLDER}
                options={panDataFrom}
                className="basic-multi-select"
                classNamePrefix="select"
                value={finFromYear}
                onChange={selectReturnPeriodYear}
              />
            </Col>

            <Col xs={12} className="text-center pt-50">
              <Button
                className="me-1"
                color="danger"
                onClick={downloadGovtTdsTcsFiled}
                outline
              >
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
      <VerificationModal
        composeOpen={composeOpen}
        toggleCompose={toggleCompose1}
        userClientIds={isclientId}
        messageDisplay={msgDisplay}
        otpGSTIN={gstnin}
      ></VerificationModal>
    </Fragment>
  );
};

export default TDSTCSFiledData;
