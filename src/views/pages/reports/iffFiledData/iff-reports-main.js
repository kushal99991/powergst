import { Fragment, useRef, useState } from "react";
import Breadcrumbs from "@components/breadcrumbs";
import Wizard from "@components/wizard";
import { Outlet, useLocation, useSearchParams,useNavigate } from "react-router-dom";
import { Button, Modal,ModalBody,Row,Col,Label,UncontrolledButtonDropdown,DropdownToggle, DropdownMenu, DropdownItem, UncontrolledTooltip } from "reactstrap";
import { useEffect } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { keysMap, enableOnFormTags } from "../../../../configs/config";
import Swal from "sweetalert2";
import { globleVariable } from "../../../../configs/globalVariable";
import LocalFunction from "../../../../configs/getLocalFunction";
import SessionFunction from "../../../../configs/getSessionFunction";
import toast from "react-hot-toast";
import Select from 'react-select' // eslint-disable-line
import { selectThemeColors } from '@utils'
import errorCodeConfig from "../../../../configs/apiErrorCodeConfig";
import IffFiledDownload from "./iff-reports-download";
import iffFiledDownloadServices from "../../../../services/iffFiledServices/iffFiledDownloadServices";
import {  downloadURL } from '@helper/downloadUrl'
import {ChevronDown, DownloadCloud, X } from "react-feather"
import makeAnimated from 'react-select/animated'
import { DROPDOWN_PLACEHOLDER } from "../../../../configs/config";
import { useDispatch, useSelector } from 'react-redux'
import  VerificationModal  from '../../verification-otp/index'
import { urlEndpointConfig } from "@configs/urlEndpoint";
import commonService from "../../../../services/commonService";


const animatedComponents = makeAnimated()

const IffFiledMain = () => {

  const navigate = useNavigate();
  const wizardRef = useRef(null);
  const dispatch = useDispatch()
  const storeExport = useSelector(state => state?.layout?.exportData);

  // ** useState
  const [stepper, setStepper] = useState(null);
  const [summary, setSummary] = useState(true);
  const [activeTab, setactiveTab] = useState();
  const [block, setBlock] = useState(false);
  const [datas, setDatas] = useState([]);
  const [wizardBtn, setWizardBtn] = useState(0);
  const [exemptErrorArr, setExemptErrorArr] = useState([]);
  const [panDataFrom, setPanDataFrom] = useState([]);
  const [panData, setPanData] = useState([]);
  const [downloadStart, setDownloadStart] = useState(false)
  const [downloadModal, setDownloadModal] = useState(false)
  const [typeOfDownload,setTypeOfDonwload] = useState("");
  const [finFromYear, setFinFormYear] = useState(null);
  const [displayType, setDisplayType] = useState([]);
  const [downloadDate, setDownloadDate] = useState(false);

  const [exportStart, setExportStart] = useState(false)
  const [msgDisplay, setMsgDisplay] = useState(null);

  const [composeOpen, setComposeOpen] = useState(false)
  const toggleCompose = () => setComposeOpen(!composeOpen)

  // ** Variable
  const gstr1Range =   sessionStorage.getItem(globleVariable.gstr6FileFromDt)
  const gstr1FiledFromDt =sessionStorage.getItem(globleVariable.gstr1FiledFromDt) && SessionFunction.getSessionValue(globleVariable.gstr1FiledFromDt, true)
  const gstr1FiledToDt =sessionStorage.getItem(globleVariable.gstr1FiledToDt) && SessionFunction.getSessionValue(globleVariable.gstr1FiledToDt, true)
  const isdefaultYear =sessionStorage.getItem(globleVariable.defaultYear) && SessionFunction.getSessionValue(globleVariable.defaultYear, true)
  const G_UCParId = sessionStorage.getItem(globleVariable.G_UCParId) && SessionFunction.getSessionValue(globleVariable.G_UCParId, true);
  const userIds =  localStorage.getItem(globleVariable.userId) && LocalFunction.getLocalValue(globleVariable.userId, true);
  const token = LocalFunction.getLocalValue(globleVariable.tokenKey, true);
  const G_GSTIN = sessionStorage.getItem(globleVariable.G_GSTIN) && SessionFunction.getSessionValue(globleVariable.G_GSTIN, true)
  const SubscriptionId =  localStorage.getItem(globleVariable.subscriptionId) && LocalFunction.getLocalValue(globleVariable.subscriptionId, true)
  const G_UserId =  localStorage.getItem(globleVariable.userId) && LocalFunction.getLocalValue(globleVariable.userId, true)


  const setGSRT1Data = (summary, tabBtnData) => {
    setSummary(summary);
    setactiveTab(tabBtnData);
  };

  const finYearOption = localStorage.getItem(globleVariable.rangeFilters) &&    LocalFunction.getLocalValue(globleVariable.rangeFilters, true)
  const YearList = finYearOption !== undefined && finYearOption !== null && finYearOption !== "" && finYearOption !== 'undefined' ? JSON.parse(finYearOption) : []

  useEffect(() => {
    setPanData(YearList);
    setPanDataFrom(YearList);
    setDisplayType(true);

  }, [])

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const iffData = queryParams.get("iff");

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
    keysMap.EXPORT_DATA,
    () => {
      !block && !summary && activeTab.ExportSectionWiseData();
    },
    { enableOnFormTags }
  );

  useHotkeys(
    keysMap.EXPORT_SUMMARY_DATA,
    () => {
       console.log('ExportSectionWiseDataSummary' , wizardBtn )
      !block && summary &&  wizardBtn == 1 && ExportSectionWiseDataSummary();
    },
    { enableOnFormTags }
  );

  useHotkeys(
    keysMap.DOWNLOAD_GOVT_DATA,
    () => {
      !block && summary &&  wizardBtn == 1 && setDownloadModal(true);
    },
    { enableOnFormTags }
  );


  wizardRef?.current?.addEventListener("shown.bs-stepper", function (event) {
    setWizardBtn(event?.detail?.indexStep);
  });

  useEffect(() => {
    iffData   && stepper !== null && stepper.to(Number(iffData) + 1);
  }, [stepper]);


// ** Return period - modal
  const SelectReturnPeriodYear = (value) => {
    console.log("value=", value.value)
    setFinFormYear(value);
  }


  // ** From and to date set
const onDateSelect = () => {
        let defaultValueFrom = null;
        let defaultValueTo = null;
        if (gstr1FiledFromDt !== null && gstr1FiledFromDt!== "" && gstr1FiledFromDt !== undefined) {
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


  useEffect(() => {
    if (displayType == true) {
      onDateSelect()
    }

}, [displayType])

//** Download
 const  downloadGovtIFFFiled = () => {
  console.log('click download')
  setBlock(true);

  const downloadGovtIFFFiled = typeOfDownload == 'withOTP' ?  iffFiledDownloadServices.downloadGovtIFFFiled :  iffFiledDownloadServices.downloadGovtIFFFiledWithOutOtp
   downloadGovtIFFFiled(G_UCParId, userIds, finFromYear.value, SubscriptionId, G_GSTIN   )
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
           else{
            if (res?.status == 200 && res?.data?.status == 1 ) {
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


 // ** Export
  const ExportSectionWiseDataSummary = () => {
    console.log("export data");
    setBlock(true);
   // dispatch(handleExportData(true))
      iffFiledDownloadServices
      .exportIFFExportData(
        G_UCParId,
        gstr1FiledFromDt,
        gstr1FiledToDt,
        0,
        token,
        SubscriptionId, G_GSTIN ,
        G_UserId
      )
      .then((res) => {
        if (res?.status == 200 && res?.data?.status == errorCodeConfig.APIDefaultCode.Success  ) {
          console.log("res1" , res.data.data );
          setExportStart(true)
          setBlock(false);
         // dispatch(handleExportData(true))
          downloadURL(res.data.data)
        } else {
          setExportStart(true)
          setBlock(false);
         // dispatch(handleExportData(true))
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

// ** Close modal
  const closeModal = () => {
    setDownloadModal(false)
  }


  // ** wizard
  const childFunc=useRef(null)

  const [searchParams] = useSearchParams();
  console.log(searchParams.get("gstr6aData") , "searchParamssearchParams")

  let defaultActiveTab = searchParams.get("gstr6aData")


  const steps = [
    {
      id: "IFF-Download",
      title: "IFF Download",
      content: <IffFiledDownload wizardBtn={wizardBtn} childFunc={childFunc}></IffFiledDownload>,
      active: defaultActiveTab == 1 ? false : true,
    },
    {
      id: "iff-summary",
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
            downloadGovtIFFFiled,
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

  datas?.map((ele, index) => {
    array?.push({ label: ele.Sectionname, value: ele.TypeofInvoiceId });
  });

  const onClickDeleteReportData = () => {
    const payload = {
      "userClientId": G_UCParId,
      "userId": userIds,
      "fromRange": gstr1FiledFromDt,
      "toRange": gstr1FiledToDt,
      "gstNumber": G_GSTIN,
      "module": "IFF"
    }
    commonService.deleteReportData(payload)
      .then((res) => {
        console.log(res,"resss")
        if (res?.status == 200 && res?.data?.status == errorCodeConfig.APIDefaultCode.Success) {
          setBlock(false);
          // sessionStorage.setItem("setRefreshAPIReportDataDeletGSTR6AFiled",true)
          navigate("/reports/iff-filed-data?iff=1")
        } 
        else {
          setBlock(false);
          toast.error(res.data.errorMessage, {
            position: "top-right",
          });
          // sessionStorage.setItem("setRefreshAPIReportDataDeletGSTR6Filed",true)
          // navigate("/reports/iff-filed-data?iff=1")
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
                    { title: "IFF Summary"},
                  ]}
                />
              ) : (
                <Breadcrumbs
                  title="Purchase Summary"
                  data={[
                    { title: "Reports",link: urlEndpointConfig.REPORT_ALL },
                    {
                      title: "IFF Summary",
                      link: urlEndpointConfig.IFF_REPORT
                      
                    },
                    { title: "IFF  Data"},
                  ]}
                />
              )}
            </div>
          </div>
        </div>
        {
          wizardBtn ===0 && (
          <div className="content-header-right text-md-end col-md-6 col-12 d-md-block d-none">
                <Button
                    type="button"
                    className="me-1"
                    outline
                    color="danger"
                    id="clearbtn"
             onClick={() => childFunc.current()}
            // onClick={()=>{}
                  >
                    <i className="fa fa-filter fa-lg"></i>
                    <span className="align-middle ms-50">
                      Clear
                    </span>
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
                  id="downloaddata"
                  onClick={() => setDownloadModal(true)}
                  // disabled={activeTab.btnDisable1}
                  color="danger" >
                  <DownloadCloud size={14} />
                    <span className="align-middle ms-50">Download2</span>
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
                  // disabled={activeTab.btnDisable1}
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
                  id="exportalldata"
                  onClick={activeTab.ExportSectionWiseData}
                  disabled={activeTab.btnDisable1}
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
                  activeTab.activeTab == 4 ||
                  activeTab.activeTab == 5 ||
                  activeTab.activeTab == 6) && (
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
              <a  onClick={() => setDownloadModal(!downloadModal)} className='text-body'>
                <X size={14} />
              </a>
            </div>
          </div>

          <hr
          // style={{ margin: "0px" }}
          ></hr>
          <ModalBody className='px-sm-2 mx-30 pb-2'>
            <Row tag='form' className='gy-1 pt-75' >
              <Col xs={3}>
              </Col>
              <Col xs={6}>
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
                  onChange={SelectReturnPeriodYear}
                />
              </Col>

               <Col xs={12} className='text-center pt-50'>
                <Button className='me-1' color='danger' onClick={downloadGovtIFFFiled} outline>
                  Continue
                </Button>
                <Button type='reset' color='secondary' outline onClick={closeModal}>
                  Cancel
                </Button>

              </Col>
            </Row>
          </ModalBody>
        </Modal>
        <VerificationModal composeOpen={composeOpen} toggleCompose={toggleCompose} userClientIds={G_UCParId}
       messageDisplay={msgDisplay}   otpGSTIN={G_GSTIN}
     ></VerificationModal>
    </Fragment>
  );
};

export default IffFiledMain;
