import { Fragment, useRef, useState } from "react"
import Breadcrumbs from '@components/breadcrumbs'
import Wizard from '@components/wizard'
import { Outlet, useLocation, useNavigate , useSearchParams } from "react-router-dom"
import { Button, Modal, ModalBody, UncontrolledTooltip, Progress, Row, Col, Label, UncontrolledButtonDropdown,DropdownToggle,DropdownMenu,DropdownItem, } from "reactstrap"
import db from "../../../../firebase/firebase"

import { useEffect } from "react"
import { doc, onSnapshot } from "firebase/firestore"
import {X, DownloadCloud,ChevronDown } from 'react-feather'
import { useHotkeys } from 'react-hotkeys-hook';
import { keysMap, enableOnFormTags } from '../../../../configs/config'
import DropDownGSTR1FiledExp from "../../../components/dropDownGSTR1Exp/dropDownGSTR1FiledExp"
import DeleteModelGSTR1FileData from "../../../components/models/DeleteModelGSTR1FileData"
import GSTR1FiledDownload from "./gstr1-file-downloads"
import { globleVariable } from '../../../../configs/globalVariable'
import LocalFunction from '../../../../configs/getLocalFunction'
import SessionFunction from '../../../../configs/getSessionFunction'
import  VerificationModal  from '../../../../views/pages/verification-otp/index'

import makeAnimated from 'react-select/animated'
import Select, { components } from 'react-select' // eslint-disable-line
import { selectThemeColors } from '@utils'
import { DROPDOWN_PLACEHOLDER } from "../../../../configs/config"
import gstr1FileDataService from "../../../../services/gstr1/gstr1DataFileService/gstr1FileDataService"
import Swal from "sweetalert2"
import { toast } from "react-hot-toast"
import errorCodeConfig from "../../../../configs/apiErrorCodeConfig"
import { urlEndpointConfig } from "@configs/urlEndpoint";
import WithoutOtpModel from "../../../components/WithoutOtpModel/WithoutOtpModel"
import commonService from "../../../../services/commonService"

const animatedComponents = makeAnimated()

const Gstr1FileData = () => {
  const navigate = useNavigate()

  let pageUrl = window.location.href;

  const wizardRef = useRef(null)

  // ** State
  const [stepper, setStepper] = useState(null)
  console.log('stepper', stepper);
  const [summary, setSummary] = useState(true)
  const [activeTab, setactiveTab] = useState();
  const [count, setCount] = useState(0);
  const [block, setBlock] = useState(false)
  const [count1, setCount1] = useState(0);

  const [wizardBtn, setWizardBtn] = useState(0);
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search);
  const gstr1Data = queryParams.get('gstr1');

  // ** Delete
  const [deleteModalshow, setDeleteModalshow] = useState(false);
  const [downloadStart, setDownloadStart] = useState(false)
  const [downloadModal, setDownloadModal] = useState(false)
  const [finFromYear, setFinFormYear] = useState(null);
  const [displayType, setDisplayType] = useState([]);
  const [panDataFrom, setPanDataFrom] = useState([]);
  const [panData, setPanData] = useState([]);
  const [msgDisplay, setMsgDisplay] = useState(null);
  const [downloadDate, setDownloadDate] = useState(false);
  const [typeOfDownload,setTypeOfDonwload] = useState("");
  const [openWithoutOtpFailed, setopenWithoutOtpFailed] = useState(false);
const toggleComposeWithoutOtp = () => setopenWithoutOtpFailed(!openWithoutOtpFailed);

  const gstr1FiledFromDt = sessionStorage.getItem(globleVariable.gstr1FiledFromDt) && SessionFunction.getSessionValue(globleVariable.gstr1FiledFromDt, true)
  const gstr1FiledToDt = sessionStorage.getItem(globleVariable.gstr1FiledToDt) && SessionFunction.getSessionValue(globleVariable.gstr1FiledToDt, true)
  const isdefaultYear = sessionStorage.getItem(globleVariable.defaultYear) && SessionFunction.getSessionValue(globleVariable.defaultYear, true)

  const [composeOpen, setComposeOpen] = useState(false)

  // ** toggle Compose
  const toggleCompose = () => setDeleteModalshow(!deleteModalshow)
  const toggleCompose1 = () => setComposeOpen(!composeOpen)

  const setGSRT1Data = (summary, tabBtnData) => {
    console.log('summary', summary);
    console.log('tabBtnData', tabBtnData);
    setSummary(summary);
    setactiveTab(tabBtnData);

  }
  const finYearOption = localStorage.getItem(globleVariable.rangeFilters) && LocalFunction.getLocalValue(globleVariable.rangeFilters, true)
  const YearList = finYearOption !== undefined && finYearOption !== null && finYearOption !== "" && finYearOption !== 'undefined' ? JSON.parse(finYearOption) : []

  useEffect(() => {
    if(finFromYear == null || finFromYear == undefined){
      setBlock(true)
    }else{
      setBlock(false)
    }
  },[finFromYear])

  useEffect(() => {
    setPanData(YearList);
    setPanDataFrom(YearList);
    setDisplayType(true);

  }, [])
  //** Shortcut keys
  useHotkeys(keysMap.CLEAR_DATA, () => { !block && activeTab && activeTab.ClearFilter() }, { enableOnFormTags });
  useHotkeys(keysMap.EXPORT_DATA, () => { !block && !summary && wizardBtn === 1 && !activeTab.btnDisable1 && activeTab.ExportSectionWiseData() }, { enableOnFormTags });
  // useHotkeys(keysMap.DELETE_DATA, () => { !block && summary ? HideShowDeleteModel() : !activeTab.btnDisable1 && activeTab.deleteSaleInvoice() }, { enableOnFormTags });
  useHotkeys(keysMap.DOWNLOAD_GOVT_DATA, () => { wizardBtn == 1 && setDownloadModal(true) }, { enableOnFormTags });

  const data1 = LocalFunction.getLocalValue(globleVariable.userId) ? LocalFunction.getLocalValue(globleVariable.userId) : " "

  //  Get SessionStoarge Value
  const isclientId = sessionStorage.getItem(globleVariable.G_UCParId) && SessionFunction.getSessionValue(globleVariable.G_UCParId, true)
  const isfinYear = sessionStorage.getItem(globleVariable.gstr1FiledFromDt) && SessionFunction.getSessionValue(globleVariable.gstr1FiledFromDt, true)
  const isfinMonth = sessionStorage.getItem(globleVariable.gstr1FiledToDt) && SessionFunction.getSessionValue(globleVariable.gstr1FiledToDt, true)
  const userIds = localStorage.getItem(globleVariable.userId) && LocalFunction.getLocalValue(globleVariable.userId, true);
  const gstnin = sessionStorage.getItem(globleVariable.G_GSTIN) && SessionFunction.getSessionValue(globleVariable.G_GSTIN, true)


  wizardRef?.current?.addEventListener('shown.bs-stepper', function (event) {
    setWizardBtn(event?.detail?.indexStep)
  })

  if (location.state !== null) {
    location.state?.wizard && console.log("location fetch .....", location.state);
  }

  useEffect(() => {

    console.log(gstr1Data,"gstr1Data+ 1" )

    gstr1Data && stepper !== null && stepper.to(Number(gstr1Data) + 1)
  }, [stepper])


  // ** Delete Modal Show/Hide
  const HideShowDeleteModel = () => {
    setDeleteModalshow(!deleteModalshow)
    document.getElementById('btnDeletePurchase').blur();
  };
  useEffect(() => {
    console.log('default value');
    if (displayType == true) {
      let defaultValueFrom = null;
      let defaultValueTo = null;
      if (gstr1FiledFromDt !== null && gstr1FiledFromDt !== "" && gstr1FiledFromDt !== undefined) {
        console.log('set from date')
        defaultValueFrom = panData?.filter((item) => item.value == gstr1FiledFromDt)[0];
      } else {
        defaultValueFrom = panData?.filter((item) => Number(item.value) == Number(isdefaultYear))[0];
      }

      if (gstr1FiledToDt !== null && gstr1FiledToDt !== "" && gstr1FiledToDt !== undefined) {
        defaultValueTo = panData?.filter((item) => item.value == gstr1FiledToDt)[0];
      } else {
        defaultValueTo = panData?.filter((item) => Number(item.value) == Number(isdefaultYear))[0];
      }

      if (defaultValueFrom !== undefined && defaultValueFrom !== null && defaultValueFrom !== "") {
        setFinFormYear(defaultValueFrom)
        // sessionStorage.setItem('gstr1FiledFromDt', defaultValueFrom?.value)
        SessionFunction.setSessionValue(globleVariable.gstr1FiledFromDt, defaultValueFrom?.value, true)
      }
      if (defaultValueTo !== undefined && defaultValueTo !== null && defaultValueTo !== "") {
        // setMonthFrom(defaultValueTo)
        SessionFunction.setSessionValue(globleVariable.gstr1FiledToDt, defaultValueTo?.value, true)

        // sessionStorage.setItem('gstr1FiledToDt', defaultValueTo?.value)
      }
    }

  }, [displayType])

  const SelectReturnPeriodYear = (value) => {
    console.log("value=", value.value)
    setFinFormYear(value);
  }

  const childFunc = useRef(null)


  const steps = [
    {
      id: 'gstr1-downloads',
      title: 'GSTR 1 Downloads',
      content: <GSTR1FiledDownload wizardBtn={wizardBtn} childFunc={childFunc}    />,
      active: gstr1Data == 1 ? false : true
    },
    {
      id: 'gstr1-summary',
      title: 'Summary and Invoices Details',
      content:
        <Outlet context={{
          setGSRT1Data, stepper, wizardBtn, block, setBlock, downloadStart,
          setDownloadStart,downloadDate,setDownloadDate
        }} />,
      active: gstr1Data == 1 ? true : false
    },

  ];

  const loadFunctionExport = (value, fileName, selectedYear) => {
    setBlock(value);
  }

  const downloadGovtGstr1Filed = () => {
    console.log('click download')
    setBlock(true);
    gstr1FileDataService.downloadGovtGSTR1Filed(isclientId, userIds, finFromYear.value,
    )
      .then((res) => {
        console.log(res);
        setBlock(false);
        if (res.data.status === errorCodeConfig.APIDefaultCode.GovtOTPExpire) {
          closeModal();
          setMsgDisplay(res?.data?.errorMessage)
          setBlock(false);

          setComposeOpen(true)
        }else{
          if (res?.status == 200 &&   res.data.status === errorCodeConfig.APIDefaultCode.Success) {
            setDownloadStart(true)
            setDownloadModal(false)
            setDownloadDate(true)
            SessionFunction.setSessionValue(globleVariable.gstr1FiledFromDt, finFromYear?.value, true)
          SessionFunction.setSessionValue(globleVariable.gstr1FiledToDt, finFromYear?.value, true)
            toast.success(res.data.successMessage, {
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
  const downloadGovtGstr1FiledWithoutOTP = () => {
    
    setBlock(true);
    gstr1FileDataService.downloadGovtGSTR1FiledwihtoutOTP(isclientId, userIds, finFromYear.value,
    )
      .then((res) => {
        console.log(res);
        setBlock(false);

      if (res?.status == 200 &&   res.data.status === errorCodeConfig.APIDefaultCode.Success) {
            setDownloadStart(true)
            setDownloadModal(false)
            setDownloadDate(true)
            SessionFunction.setSessionValue(globleVariable.gstr1FiledFromDt, finFromYear?.value, true)
          SessionFunction.setSessionValue(globleVariable.gstr1FiledToDt, finFromYear?.value, true)
            toast.success(res.data.successMessage, {
              position: "top-right",
            });
          }else  if (res.data.status === errorCodeConfig.APIDefaultCode.GovtOTPExpire) {
            setBlock(false)
            setopenWithoutOtpFailed(true)
          } else {
            toast.error(res?.data?.errorMessage, {
              position: "top-right",
            });
            setDownloadModal(false)
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

  const closeModal = () => {
    // clearErrors();
    setDownloadModal(false)
  };

  const onClickDeleteReportData = () => {
    const payload = {
      "userClientId": isclientId,
      "userId": userIds,
      "fromRange": isfinYear,
      "toRange": isfinMonth,
      "gstNumber": gstnin,
      "module": "GSTR1"
    }
    commonService.deleteReportData(payload)
      .then((res) => {
        console.log(res,"resss")
        if (res?.status == 200 && res?.data?.status == errorCodeConfig.APIDefaultCode.Success) {
          setBlock(false);
          // navigate("/gst-returns/gstr2b-summary",{state:{refreshAPI:true}})
          sessionStorage.setItem("setRefreshAPIReportDataDeletGSTR1Filed",true)
          navigate("/reports/gstr1-filed-data?gstr1=1")
        } 
        else {
          setBlock(false);
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
                    {title: "Reports", link: urlEndpointConfig.REPORT_ALL },
                    { title: "GSTR 1 Summary"},
                  ]}
                />
              ) : (
                <Breadcrumbs
                  title="Purchase Summary"
                  data={[
                    { title: "Reports", link: urlEndpointConfig.REPORT_ALL },
                    {
                      title: "GSTR 1 Summary",
                      link: urlEndpointConfig.GSTR1_FILED_REPORT
                    },
                    { title: "GSTR 1 Filed Data Invoices" },
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
            }>
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
                  <DropdownItem onClick={() => {setDownloadModal(true),setTypeOfDonwload("withOTP")}} tag='a' >With OTP    </DropdownItem>
                  <DropdownItem onClick={() => {setDownloadModal(true),setTypeOfDonwload("withOutOTP")}} tag='a'>Without OTP  </DropdownItem>

                </DropdownMenu>
              </UncontrolledButtonDropdown>
                <DropDownGSTR1FiledExp
                  block={block}
                  loadFunction={loadFunctionExport}
                  clientId={isclientId}
                  finYear={isfinYear}
                  finMonth={isfinMonth}
                />
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
                  id="exportdata"
                  color="danger"
                >
                  <i className="fa fa-file-excel-o"></i> {"    "}
                  Export Data
                </Button>
                <UncontrolledTooltip placement="top" target="exportdata">
                  Export Data [{keysMap.EXPORT_DATA}]
                </UncontrolledTooltip>
                {(activeTab.activeTab == 1 ||
                  activeTab.activeTab == 2 ||
                  activeTab.activeTab == 4 ||
                  activeTab.activeTab == 7 ||
                  activeTab.activeTab == 6 ||
                  activeTab.activeTab == 3) && (
                  <>
                    <Button
                      type="button"
                      className="me-1"
                      outline
                      color="danger"
                      id="clearbtn"
                      onClick={activeTab.ClearFilter}
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

      {deleteModalshow &&  (
        <DeleteModelGSTR1FileData
          Heading="Delete GSTR 1 Sales"
          SuccessButtonText="Delete"
          show={deleteModalshow}
          toggleCompose={toggleCompose}
        ></DeleteModelGSTR1FileData>
      )}
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
                // defaultValue={panDataFrom?.filter((item) => item.value == sessionStorage.getItem(globleVariable.gstr1FiledFromDt))[0]}
                onChange={SelectReturnPeriodYear}
              />
            </Col>

            <Col xs={12} className="text-center pt-50">
              <Button
                className="me-1"
                color="danger"
                onClick={typeOfDownload=="withOutOTP"? downloadGovtGstr1FiledWithoutOTP:  downloadGovtGstr1Filed}
                outline
              >
                {/* <Button className='me-1' color='danger'  outline> */}
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
      <VerificationModal composeOpen={composeOpen} toggleCompose={toggleCompose1} userClientIds={isclientId}
       messageDisplay={msgDisplay} otpGSTIN={gstnin}
     ></VerificationModal>
      {openWithoutOtpFailed == true && (
      <WithoutOtpModel
       openWithoutOtpFailed={openWithoutOtpFailed}
       setopenWithoutOtpFailed={setopenWithoutOtpFailed}
       toggleComposeWithoutOtp={toggleComposeWithoutOtp}
       G_UCParId={isclientId}>
      </WithoutOtpModel>) }
    </Fragment>
  );
}

export default Gstr1FileData