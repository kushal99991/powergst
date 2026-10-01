import { Fragment, useRef, useState } from "react";
import Breadcrumbs from "@components/breadcrumbs";
import Wizard from "@components/wizard";
import { Outlet, useLocation, useSearchParams,useNavigate } from "react-router-dom";
import { Button, Modal, ModalBody, Row, Col, Label, UncontrolledTooltip,UncontrolledButtonDropdown,DropdownToggle, DropdownMenu, DropdownItem, } from "reactstrap";
import db from "../../../../firebase/firebase";
import { useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { useHotkeys } from "react-hotkeys-hook";
import { keysMap, enableOnFormTags } from "../../../../configs/config";
import Swal from "sweetalert2";
import { globleVariable } from "../../../../configs/globalVariable";
import LocalFunction from "../../../../configs/getLocalFunction";
import SessionFunction from "../../../../configs/getSessionFunction";
import toast from "react-hot-toast";
import errorCodeConfig from "../../../../configs/apiErrorCodeConfig";
import ITC04download from "./itc04Filed-download";
import itc04SummaryService from "../../../../services/itc04FiledServices/itc04SummaryService";
import gstr6SummaryService from '../../../../services/gstr6Filed/gstr6filedService'
import { downloadURL } from '@helper/downloadUrl'
import {ChevronDown, DownloadCloud, X } from "react-feather"
import { DROPDOWN_PLACEHOLDER } from "../../../../configs/config";
import makeAnimated from 'react-select/animated'
import Select, { components } from 'react-select' // eslint-disable-line
import { selectThemeColors } from '@utils'
import VerificationModal from '../../../../views/pages/verification-otp/index'
import { urlEndpointConfig } from "@configs/urlEndpoint";
import commonService from "../../../../services/commonService";
import { messageShowDuration } from "../../../../configs/config";

const animatedComponents = makeAnimated()

const ITC04Main = () => {
  const navigate = useNavigate()

  let pageUrl = window.location.href;

  const wizardRef = useRef(null);

  // ** State
  const [stepper, setStepper] = useState(null);
  const [summary, setSummary] = useState(true);
  const [activeTab, setactiveTab] = useState();
  const [count, setCount] = useState(0);
  const [block, setBlock] = useState(false);
  const [datas, setDatas] = useState([]);
  const [wizardBtn, setWizardBtn] = useState(0);
  const [exemptErrorArr, setExemptErrorArr] = useState([]);
  const [count1, setCount1] = useState(0);
  const [downloadStart, setDownloadStart] = useState(false)
  const [downloadModal, setDownloadModal] = useState(false)
  const [finFromYear, setFinFormYear] = useState(null);
  const [displayType, setDisplayType] = useState([]);
  const [panDataFrom, setPanDataFrom] = useState([]);
  const [panData, setPanData] = useState([]);
  const [exportStart, setExportStart] = useState(false);
  const [msgDisplay, setMsgDisplay] = useState(null);
  const [composeOpen, setComposeOpen] = useState(false)
  const [downloadDate, setDownloadDate] = useState(false);
  const [typeOfDownload,setTypeOfDonwload] = useState("");


  const gstr1Range = sessionStorage.getItem(globleVariable.gstr6FileFromDt)
  const itc04DateRange = sessionStorage.getItem(globleVariable.itc04DateRange) && SessionFunction.getSessionValue(globleVariable.itc04DateRange)
  const isdefaultYear = sessionStorage.getItem(globleVariable.defaultYear) && SessionFunction.getSessionValue(globleVariable.defaultYear, true)
  const G_GSTIN = sessionStorage.getItem(globleVariable.G_GSTIN) && SessionFunction.getSessionValue(globleVariable.G_GSTIN, true)
  const SubscriptionId = localStorage.getItem(globleVariable.subscriptionId) && LocalFunction.getLocalValue(globleVariable.subscriptionId, true)
  // ** Delete
  const [deleteModalshow, setDeleteModalshow] = useState(false);
  // ** toggle Compose
  const toggleCompose = () => setDeleteModalshow(!deleteModalshow);
  const toggleCompose1 = () => setComposeOpen(!composeOpen)

  const setGSRT1Data = (summary, tabBtnData) => {
    setSummary(summary);
    setactiveTab(tabBtnData);
  };

  const finYearOption = localStorage.getItem(globleVariable.rangeFiltersITC04) && LocalFunction.getLocalValue(globleVariable.rangeFiltersITC04, true)
  const YearList = finYearOption !== undefined && finYearOption !== null && finYearOption !== "" && finYearOption !== 'undefined' ? JSON.parse(finYearOption) : []

  useEffect(() => {
    setPanData(YearList);
    setPanDataFrom(YearList);
    setDisplayType(true);

  }, [])


  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const itc04Data = queryParams.get("itc04");

  useEffect(() => {
    return () => setBlock(false)
  }, [])

  //** Shortcut keys
  useHotkeys(
    keysMap.CLEAR_DATA,
    () => {
      !block && wizardBtn === 1 && !summary && activeTab.ClearFilter();
    },
    { enableOnFormTags }
  );
  useHotkeys(
    keysMap.DOWNLOAD_GOVT_DATA,
    () => {
      !block && summary && wizardBtn == 1 && setDownloadModal(true);
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
      !block && summary && wizardBtn == 1 && ExportSectionWiseDataSummary();

    },
    { enableOnFormTags }
  );

  wizardRef?.current?.addEventListener("shown.bs-stepper", function (event) {
    setWizardBtn(event?.detail?.indexStep);
  });

  useEffect(() => {
    itc04Data && stepper !== null && stepper.to(Number(itc04Data) + 1);
  }, [stepper]);


  const G_UCParId = sessionStorage.getItem(globleVariable.G_UCParId) && SessionFunction.getSessionValue(globleVariable.G_UCParId, true);
  const userIds = localStorage.getItem(globleVariable.userId) && LocalFunction.getLocalValue(globleVariable.userId, true);
  const token = LocalFunction.getLocalValue(globleVariable.tokenKey, true);


  const SelectReturnPeriodYear = (value) => {
    console.log("value=", value.value)
    setFinFormYear(value);
  }

  useEffect(() => {
    if (displayType == true) {
      onDateSelect()
    }

  }, [displayType])

  const onDateSelect = () => {
    let defaultValueFrom = null;
    if (itc04DateRange !== null && itc04DateRange !== "" && itc04DateRange !== undefined) {
      console.log('set from date')
      defaultValueFrom = panDataFrom?.filter((item) => item.value == itc04DateRange)[0];
    } else {
      defaultValueFrom = panDataFrom[0];
    }

    if (defaultValueFrom !== undefined && defaultValueFrom !== null && defaultValueFrom !== "") {
      setFinFormYear(defaultValueFrom)
      sessionStorage.setItem(globleVariable.itc04DateRange, defaultValueFrom?.value)

    }
  }

  // ** Downoload
  const downloadGovtITC04Filed = () => {
    console.log('click download')
    setBlock(true);

  const downloadGovtITC04Filed = typeOfDownload == 'withOTP' ?  itc04SummaryService.downloadGovtITC04Filed :  itc04SummaryService.downloadGovtITC04FiledWithOutOtp
  downloadGovtITC04Filed(G_UCParId, userIds, finFromYear.value, SubscriptionId, G_GSTIN
    )
      .then((res) => {
        setBlock(false);
        if (res.data.status === errorCodeConfig.APIDefaultCode.GovtOTPExpire) {
          closeModal();
          setMsgDisplay(res?.data?.errorMessage)
          setBlock(false);
          // loadFunction(false);
          setComposeOpen(true)
          // toast.dismiss();
          // dispatch(handleModelOTP(!store.layout.modelVerifyOTP));
        }

        else {
          if (res?.status == 200 && res?.data?.status == errorCodeConfig.APIDefaultCode.Success) {
            setDownloadStart(true)
            setDownloadModal(false);
            setDownloadDate(true)
            SessionFunction.setSessionValue(globleVariable.itc04DateRange, finFromYear?.value)
            toast.success(res?.data?.successMessage, {
              position: "top-right",
            });

          } else {
            toast.error(res?.data?.errorMessage, {
              position: "top-right",
            });
            setDownloadModal(false)
          }
        }
      }).catch((error) => {
        setBlock(false);
        setDownloadModal(false)
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

  // ** Export
  const ExportSectionWiseDataSummary = () => {
    console.log("export data");
    setBlock(true);
    console.log(gstr1Range, "gstr1Rangegstr1Range")
    itc04SummaryService
      .exportITC04ExportData(
        G_UCParId,
        itc04DateRange,
        0,
        token,
        SubscriptionId, G_GSTIN,
        userIds
      )
      .then((res) => {
        if (res?.status == 200 && res?.data?.status == errorCodeConfig.APIDefaultCode.Success) {
          console.log("res1", res.data.data);
          setBlock(false);
          setExportStart(true)
          downloadURL(res.data.data)

        } else {
          console.log("res2");
          setBlock(false);
          setExportStart(true)
          toast.error(res.data.errorMessage, {
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
  };

  const closeModal = () => {
    // clearErrors();
    setDownloadModal(false)
  }

  const childFunc = useRef(null)

  const [searchParams] = useSearchParams();
  console.log(searchParams.get("itc04"), "searchParamssearchParams")

  let defaultActiveTab = searchParams.get("itc04")
  const steps = [
    {
      id: "itc04-Download",
      title: "ITC 04 Download",
      content: <ITC04download wizardBtn={wizardBtn} childFunc={childFunc} ></ITC04download>,
      active: defaultActiveTab == 1 ? false : true,
    },
    {
      id: "itc04-summary",
      title: "Summary and Invoices Details",
      active: defaultActiveTab == 1 ? true : false,
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
            stepper,
            downloadGovtITC04Filed,
            downloadStart,
            setDownloadStart,
            setExportStart,
            exportStart,
            downloadDate,
            setDownloadDate
          }}
        />
      ),
    },
  ];

  const array = [];

  datas.map((ele, index) => {
    array.push({ label: ele.sectionname, value: ele.typeofInvoiceId });
  });


  const onClickDeleteReportData = () => {
    const payload = {
      "userClientId": G_UCParId,
      "userId": userIds,
      "fromRange": finFromYear?.value,
      "toRange": finFromYear?.value,
      "gstNumber": G_GSTIN,
      "module": "ITC04"
    }
    commonService.deleteReportData(payload)
      .then((res) => {
        console.log(res,"resss")
        if (res?.status == 200 && res?.data?.status == errorCodeConfig.APIDefaultCode.Success) {
          setBlock(false);
          // sessionStorage.setItem("setRefreshAPIReportDataDeletGSTR6AFiled",true)
          navigate("/reports/itc04-filed-data?itc04=1")
        } 
        else {
          setBlock(false);
          toast.error(res.data.errorMessage, {
            position: "top-right",
            duration: messageShowDuration
          });
          // sessionStorage.setItem("setRefreshAPIReportDataDeletGSTR6Filed",true)
          // setTimeout(() => {
          //   navigate("/reports/itc04-filed-data?itc04=1")
          // }, 1000);
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
      {block && <div className="loading1">Loading&#8230;</div>}
      <div className="content-header row py-1">
        <div className="content-header-left col-md-6 col-12">
          <div className="row breadcrumbs-top">
            <div className="col-12">
              {summary ? (
                <Breadcrumbs
                  title="Purchase Summary"
                  data={[
                    { title: "Reports",link: urlEndpointConfig.REPORT_ALL },
                    { title: "ITC 04 Summary"},
                  ]}
                />
              ) : (
                <Breadcrumbs
                  title="Purchase Summary"
                  data={[
                    { title: "Reports",link: urlEndpointConfig.REPORT_ALL},
                    {
                      title: "ITC 04 Summary",
                      link: urlEndpointConfig.ITC04_REPORT
                     
                    },
                    { title: "ITC 04 Filed Data" },
                  ]}
                />
              )}
            </div>
          </div>
        </div>
        {
          wizardBtn === 0 && (
            <div className="content-header-right text-md-end col-md-6 col-12 d-md-block d-none">
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
            </div>
          )
        }
        {wizardBtn === 1 && (
          <div className="content-header-right text-md-end col-md-6 col-12 d-md-block d-none">
            {console.log("summary-", summary)}
            {summary ? (
              <>
                {/* <Button
                  type="button"
                  className="me-1"
                  outline
                  onClick={downloadGovtGstr6Filed}
                  // disabled={activeTab.btnDisable1}
                  color="danger"
                >

                  <DownloadCloud size={14} />
                    <span className="align-middle ms-50">Download  [{keysMap.DOWNLOAD_GOVT_DATA}] </span>

                </Button> */}

                {/* <Button
                  type="button"
                  className="me-1"
                  outline
                  onClick={() => setDownloadModal(true)}
                  // disabled={activeTab.btnDisable1}
                  id="downloaddata"
                  color="danger"
                >

                  <DownloadCloud size={14} />
                  <span className="align-middle ms-50">Download </span>

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
                  id="exportdata"
                  onClick={ExportSectionWiseDataSummary}
                  color="danger"
                >
                  <i className="fa fa-file-excel-o"></i> Export
                </Button>
                <UncontrolledTooltip placement="top" target="exportdata">
                  Export [{keysMap.EXPORT_SUMMARY_DATA}]
                </UncontrolledTooltip>
              </>
            ) : (
              <>
               <Button
                  type="button"
                  className="me-1"
                  outline
                  onClick={onClickDeleteReportData}
                  disabled={activeTab.btnDisable1}
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
                  onClick={activeTab.ExportSectionWiseData}
                  disabled={activeTab.btnDisable1}
                  id="exportalldata"
                  color="danger"
                >
                  <i className="fa fa-file-excel-o"></i> Export
                </Button>
                <UncontrolledTooltip placement="top" target="exportalldata">
                  Export [{keysMap.EXPORT_DATA}]
                </UncontrolledTooltip>

                {(activeTab.activeTab == 1 ||
                  activeTab.activeTab == 2 ||
                  activeTab.activeTab == 3 ||
                  activeTab.activeTab == 4) && (
                    <Button
                      type="button"
                      className="me-1"
                      outline
                      color="danger"
                      id="clearbtn"
                      onClick={activeTab.ClearFilter}
                    >
                      <i className="fa fa-filter fa-lg"></i>
                      <span className="align-middle ms-50">
                        Clear
                      </span>
                    </Button>
                  )}
                <UncontrolledTooltip placement="top" target="clearbtn">
                  Clear [{keysMap.CLEAR_DATA}]
                </UncontrolledTooltip>
              </>
            )}
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
      <Modal backdrop="static" isOpen={downloadModal} toggle={() => setDownloadModal(!downloadModal)} className='modal-dialog-centered  modal-sm'>
        <div className='modal-header'>
          <h2 className='modal-title w-100 text-center'>Download Data</h2>
          <div className='modal-actions'>
            <a onClick={() => setDownloadModal(!downloadModal)} className='text-body'>
              <X size={14} />
            </a>
          </div>
        </div>

        <hr
        // style={{ margin: "0px" }}
        ></hr>
        <ModalBody className='px-sm-2 mx-30 pb-2'>
          <Row tag='form' className='gy-1 pt-75' >
            <Col xs={2}>
            </Col>
            <Col xs={7}>
              <Label className='form-label' for='status'>
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
                classNamePrefix='select'
                value={finFromYear}
                // defaultValue={panDataFrom?.filter((item) => item.value == sessionStorage.getItem(globleVariable.itc04DateRange))[0]}
                onChange={SelectReturnPeriodYear}
              />
            </Col>

            <Col xs={12} className='text-center pt-50'>
              <Button className='me-1' color='danger' onClick={downloadGovtITC04Filed} outline>
                Continue
              </Button>
              <Button type='reset' color='secondary' outline onClick={closeModal}>
                Cancel
              </Button>

            </Col>
          </Row>
        </ModalBody>
      </Modal>
      <VerificationModal composeOpen={composeOpen} toggleCompose={toggleCompose1} userClientIds={G_UCParId}
        messageDisplay={msgDisplay} otpGSTIN={G_GSTIN}
      ></VerificationModal>
    </Fragment>
  );
};

export default ITC04Main;
