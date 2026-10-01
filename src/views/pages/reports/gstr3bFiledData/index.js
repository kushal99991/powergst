import { Fragment, useEffect, useRef, useState } from "react"
import Breadcrumbs from '@components/breadcrumbs'
import Wizard from '@components/wizard'
import { Outlet, useFetcher, useLocation, useSearchParams } from "react-router-dom"
import GSRTR3BFiledData from "./gstr3b-filed-data"
import GSTR3BFiledDownload from "./gstr3b-downloads"
import GSTR3BExportButton from "../../../components/dropDownGSTR3bFileDataExport/index"
import { Button, Modal, ModalBody, Row, Col, Label, UncontrolledTooltip, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap"
import { globleVariable } from '../../../../configs/globalVariable'
import LocalFunction from "../../../../configs/getLocalFunction"
import SessionFunction from '../../../../configs/getSessionFunction'
import { useHotkeys } from 'react-hotkeys-hook';
import { keysMap, enableOnFormTags } from '../../../../configs/config';
import gstr3bFiledService from "../../../../services/gstr3bFiled/gstr3bFiledService"
import {
  ChevronDown, Share, Printer, File, Grid, Copy, Plus, FilePlus,
  MoreVertical, Edit, FileText, Archive, Trash, Users, Check, X,
  PlusSquare, Minus, Trash2, Edit2,
  Download, DownloadCloud
} from 'react-feather'
import makeAnimated from 'react-select/animated'
import Select, { components } from 'react-select' // eslint-disable-line
import { selectThemeColors } from '@utils'
import { DROPDOWN_PLACEHOLDER } from "../../../../configs/config"
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from 'react-redux'
import { handleExportData } from '@store/layout'
import { downloadURL } from "../../../../helper/downloadUrl"
import { tokenExpiresRedirect } from "../../../../utility/Utils"
import errorCodeConfig from "../../../../configs/apiErrorCodeConfig"
import VerificationModal from '../../../../views/pages/verification-otp/index'
import { urlEndpointConfig } from "@configs/urlEndpoint";
import WithoutOtpModel from "../../../components/WithoutOtpModel/WithoutOtpModel"

const animatedComponents = makeAnimated()

const GSTR3BFiled = () => {
  const wizardRef = useRef(null)
  const dispatch = useDispatch()

  // ** State
  const [stepper, setStepper] = useState(null)
  console.log('stepper', stepper);

  const [block, setBlock] = useState(false)

  const [wizardBtn, setWizardBtn] = useState(0);
  const [summary, setSummary] = useState(true)
  const [activeTab, setactiveTab] = useState();
  const [downloadStart, setDownloadStart] = useState(false)
  const [downloadDate, setDownloadDate] = useState(false);
  const [downloadModal, setDownloadModal] = useState(false)
  const [typeOfDownload,setTypeOfDonwload] = useState("");
  const [finFromYear, setFinFormYear] = useState(null);
  const [displayType, setDisplayType] = useState([]);
  const [panDataFrom, setPanDataFrom] = useState([]);
  const [panData, setPanData] = useState([]);
  const [exportType, setExportType] = useState(false)
  const [msgDisplay, setMsgDisplay] = useState(null);
  const [openWithoutOtpFailed, setopenWithoutOtpFailed] = useState(false);
const toggleComposeWithoutOtp = () => setopenWithoutOtpFailed(!openWithoutOtpFailed);

  const location = useLocation()
  const queryParams = new URLSearchParams(location.search);
  const wizardData = queryParams.get('gstr3b');
  console.log(wizardData, "wizardDatawizardData")
  //** Shortcut keys
  useHotkeys(keysMap.CLEAR_DATA, () => { !block }, { enableOnFormTags });
  // useHotkeys(keysMap.DOWNLOAD_GOVT_DATA, () => { block == false && !downloadStart  ? downloadGovtGstr3Filed() : '' }, { enableOnFormTags });
  useHotkeys(keysMap.DOWNLOAD_GOVT_DATA, () => { block == false && wizardBtn == 1 && !downloadStart ? setDownloadModal(true) : '' }, { enableOnFormTags });

  useHotkeys(
    keysMap.EXPORT_ALL_DATA,
    () => {
      !block && exportButtonGSTR3b();
    },
    { enableOnFormTags }
  );

  const [composeOpen, setComposeOpen] = useState(false)
  const toggleCompose = () => setComposeOpen(!composeOpen)

  const G_UCParId = sessionStorage.getItem(globleVariable.G_UCParId) && SessionFunction.getSessionValue(globleVariable.G_UCParId, true)
  const userIds = localStorage.getItem(globleVariable.userId) && LocalFunction.getLocalValue(globleVariable.userId, true);
  const gstr3BFiledFromDt = sessionStorage.getItem(globleVariable.gstr3BFiledFromDt) && SessionFunction.getSessionValue(globleVariable.gstr3BFiledFromDt, true)
  const gstr3BFiledToDt = sessionStorage.getItem(globleVariable.gstr3BFiledToDt) && SessionFunction.getSessionValue(globleVariable.gstr3BFiledToDt, true)
  const isdefaultYear = sessionStorage.getItem(globleVariable.defaultYear) && SessionFunction.getSessionValue(globleVariable.defaultYear, true)
  const token = LocalFunction.getLocalValue(globleVariable.tokenKey, true)

  useEffect(() => {
    setFinFormYear(gstr3BFiledFromDt);
  }, [])


  const finYearOption = localStorage.getItem(globleVariable.rangeFilters) && LocalFunction.getLocalValue(globleVariable.rangeFilters, true)
  const YearList = finYearOption !== undefined && finYearOption !== null && finYearOption !== "" && finYearOption !== 'undefined' ? JSON.parse(finYearOption) : []
  const subId = localStorage.getItem(globleVariable.subscriptionId) && LocalFunction.getLocalValue(globleVariable.subscriptionId, true);
  const GGSTIN = sessionStorage.getItem(globleVariable.G_GSTIN) && SessionFunction.getSessionValue(globleVariable.G_GSTIN, true);

  const storeExport = useSelector(state => state?.layout?.exportData);

  useEffect(() => {
    setPanData(YearList);
    setPanDataFrom(YearList);
    setDisplayType(true);

  }, [])

  const setGSRT3bFiledData = (summary, tabBtnData) => {
    console.log('summary', summary);
    console.log('tabBtnData', tabBtnData);
    setSummary(summary);
    setactiveTab(tabBtnData);

  }



  const onDateSelect = () => {
    let defaultValueFrom = null;
    let defaultValueTo = null;
    if (gstr3BFiledFromDt !== null && gstr3BFiledFromDt !== "" && gstr3BFiledFromDt !== undefined) {
      console.log('set from date')
      defaultValueFrom = panData?.filter((item) => item.value == gstr3BFiledFromDt)[0];
    } else {
      defaultValueFrom = panData?.filter((item) => Number(item.value) == Number(isdefaultYear))[0];
    }

    if (gstr3BFiledToDt !== null && gstr3BFiledToDt !== "" && gstr3BFiledToDt !== undefined) {
      defaultValueTo = panData?.filter((item) => item.value == gstr3BFiledToDt)[0];
    } else {
      defaultValueTo = panData?.filter((item) => Number(item.value) == Number(isdefaultYear))[0];
    }

    if (defaultValueFrom !== undefined && defaultValueFrom !== null && defaultValueFrom !== "") {
      setFinFormYear(defaultValueFrom)
      // sessionStorage.setItem('gstr1FiledFromDt', defaultValueFrom?.value)
      SessionFunction.setSessionValue(globleVariable.gstr3BFiledFromDt, defaultValueFrom?.value, true)
    }
    if (defaultValueTo !== undefined && defaultValueTo !== null && defaultValueTo !== "") {
      // setMonthFrom(defaultValueTo)
      SessionFunction.setSessionValue(globleVariable.gstr3BFiledToDt, defaultValueTo?.value, true)

      // sessionStorage.setItem('gstr1FiledToDt', defaultValueTo?.value)
    }
  }


  // }, [displayType])
  // const gstr3bData = queryParams.get('gstr3b');

  useEffect(() => {
    //wizardData && stepper !== null  && stepper.to(2)
    wizardData && stepper !== null && stepper.to(Number(wizardData) + 1)
  }, [stepper])


  const childFunc = useRef(null);
  // const [searchParams] = useSearchParams();
  // let defaultActiveTab = searchParams.get("gstr3bData")
  // const queryParams = new URLSearchParams(location.search);


  const steps = [
    {
      id: 'gstr3b-downloads',
      title: 'GSTR 3B Downloads',
      content: <GSTR3BFiledDownload childFunc={childFunc} />,
      // content: <Outlet context={{ setGSRT3bFiledData, stepper, wizardBtn, block, setBlock }} />,
      active: wizardData == 1 ? false : true
    },
    {
      id: 'gstr3b-summary',
      title: 'Summary and Invoices Details',
      content: <GSRTR3BFiledData wizardBtn={wizardBtn} downloadDate={downloadDate} setDownloadDate={setDownloadDate} setDownloadStart={setDownloadStart} exportStart={exportType} setExportType={setExportType} downloadStart={downloadStart} />,
      active: wizardData == 1 ? true : false
    }

  ];
  wizardRef?.current?.addEventListener('shown.bs-stepper', function (event) {
    setWizardBtn(event?.detail?.indexStep);
    console.log(event?.detail?.indexStep, "event?.detail?.indexStep")
  })
  const loadFunction = (value) => {
    setBlock(value);
  }

  const closeModal = () => {
    // clearErrors();
    setDownloadModal(false)
  }

  // ** Loading Export
  const loadFunctionExport = (value, fileName, selectedYear) => {
    setBlock(value);
  }
  console.log(wizardBtn, "wizardBtnwizardBtnwizardBtn");

  const SelectReturnPeriodYear = (value) => {
    console.log("value=", value.value)
    setFinFormYear(value);
  }
  const downloadGovtGstr3Filed = () => {
    console.log('click download')
    setBlock(true);
    gstr3bFiledService.downloadGovtGSTR3bFiled(G_UCParId, userIds, finFromYear.value, subId, GGSTIN
    )
      .then((res) => {
        console.log(res);
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
        if (res?.status == 200 && res?.data?.status === errorCodeConfig.APIDefaultCode.Success) {
          setDownloadStart(true)
          setDownloadDate(true)
          setDownloadModal(false)
          SessionFunction.setSessionValue(globleVariable.gstr3BFiledFromDt, finFromYear?.value, true)
          SessionFunction.setSessionValue(globleVariable.gstr3BFiledToDt, finFromYear?.value, true)
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

  const downloadGovtGstr3BFiledWithoutOTP = () => {

    setBlock(true);
    gstr3bFiledService.downloadGovtGSTR3BFiledwihtoutOTP(G_UCParId, userIds, finFromYear.value,subId
    )
      .then((res) => {
        setBlock(false);

      if (res?.status == 200 &&   res.data.status === errorCodeConfig.APIDefaultCode.Success) {
            setDownloadStart(true)
            setDownloadModal(false)
            setDownloadDate(true)
            SessionFunction.setSessionValue(globleVariable.gstr3BFiledFromDt, finFromYear?.value, true)
            SessionFunction.setSessionValue(globleVariable.gstr3BFiledToDt, finFromYear?.value, true)
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

  useEffect(() => {
    console.log('default value');
    if (displayType == true) {
      onDateSelect()
    }

  }, [displayType])


  // ** Export
  const exportButtonGSTR3b = () => {
    setBlock(true);
    console.log("Hello World")
    gstr3bFiledService.gstr3bSaveExportFileDataAPI(G_UCParId, gstr3BFiledFromDt, gstr3BFiledToDt, subId, GGSTIN, userIds, token)
      .then(res => {
        if (res.status == 200 && res?.data?.status == errorCodeConfig.APIDefaultCode.Success) {
          setBlock(false);
          setExportType(true)
          //  dispatch(handleExportData(true))
          // setWizardBtn(2)
          // stepper.to(2)
          downloadURL(res.data.data)
        }
        else if (res?.status == 401) {
          setExportType(true)
          tokenExpiresRedirect()
        }
        else {
          setExportType(true)
          console.log("res2");
          loadFunction(false);
          toast.error(res?.data?.errorMessage, {
            position: "top-right",
          });
        }
      }).catch(error => {
        console.log("res2");
        loadFunction(false);
        console.log(error.message)
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

  return (
    <Fragment>

      {block && <div className="loading1">Loading&#8230;</div>}

      <div className='content-header row py-1'>
        <div className='content-header-left col-md-6 col-12'>
          <div className='row breadcrumbs-top'>
            <div className='col-12'>
              <Breadcrumbs title='GSTR 3B Summary'
               data={[                 
                   {title: "Reports", link: urlEndpointConfig.REPORT_ALL },
                    { title: "GSTR 3B Summary"},]} />

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
        {
          wizardBtn === 1 &&
          <div className="content-header-right text-md-end col-md-6 col-12 d-md-block d-none">

            {/* <Button
              type="button"
              className="me-1"
              outline
              // style={{marginRight:"10px"}}
              onClick={() => setDownloadModal(true)}
              // disabled={activeTab.btnDisable1}
              id="downloaddata"
              color="danger"
            >

              <DownloadCloud size={14} />
              <span className="align-middle ms-50">Download2 </span>
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
            <Button
              type="button"
              className="me-1"
              outline
              id="exportdata"
              // style={{marginRight:"10px"}}
              onClick={exportButtonGSTR3b}
              color="danger"
            >

                <i className="fa fa-file-excel-o"></i>
              <span className="align-middle ms-50">Export </span>
            </Button>
            <UncontrolledTooltip placement="top" target="exportdata">
              Export  [{keysMap.EXPORT_ALL_DATA} ]
            </UncontrolledTooltip>
            {/* <GSTR3BExportButton setWizardBtn={setWizardBtn} stepper={stepper} handleExportData={handleExportData} subId={subId} userIds={userIds} loadFunction={loadFunctionExport} clientId={G_UCParId} GGSTIN={GGSTIN} finYear={gstr3BFiledFromDt} finMonth={gstr3BFiledToDt}  isloading={block} /> */}
          </div>
        }
        {/* {(activeTab.activeTab == 1 || activeTab.activeTab == 2 || activeTab.activeTab == 7 || activeTab.activeTab == 6) &&  */}


      </div>
      <div className='horizontal-wizard'>
        <Wizard instance={el => setStepper(el)} ref={wizardRef} steps={steps}
          options={{
            linear: false
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
        //  style={{ margin: "0px" }}
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
                // defaultValue={panDataFrom?.filter((item) => item.value == sessionStorage.getItem(globleVariable.gstr1FiledFromDt))[0]}
                onChange={SelectReturnPeriodYear}
              />
            </Col>

            <Col xs={12} className='text-center pt-50'>
              <Button className='me-1' color='danger' onClick={typeOfDownload=="withOutOTP" ? downloadGovtGstr3BFiledWithoutOTP:  downloadGovtGstr3Filed} outline>
             
                {/* <Button className='me-1' color='danger'  outline> */}
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
       messageDisplay={msgDisplay}   otpGSTIN={GGSTIN}
     ></VerificationModal>
      {openWithoutOtpFailed == true && (
      <WithoutOtpModel
       openWithoutOtpFailed={openWithoutOtpFailed}
       setopenWithoutOtpFailed={setopenWithoutOtpFailed}
       G_UCParId={G_UCParId}>
      </WithoutOtpModel>) }
    </Fragment>
  )
}

export default GSTR3BFiled