// ** Reactstrap Imports
import {
  DropdownToggle,
  UncontrolledButtonDropdown,
  Tooltip,
  Modal,
  ModalBody,
  Row,
  Label,
  Col,
  Button,
  DropdownItem,
  DropdownMenu
} from "reactstrap";
import React, { Fragment, useState, useEffect } from "react";
// ** Icons Imports
import { ChevronDown, Download, DownloadCloud , X } from "react-feather";
import Gstr2bService from "../../../services/gstr/gstr2bService";
import toast from "react-hot-toast";
import errorCodeConfig from "../../../configs/apiErrorCodeConfig";
import GSTR2BConstants from "../../pages/gstr2B/Constants";
// ** Store & Actions
import { getGSTR2BSummary } from "../../../views/apps/user/store";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { handleModelOTP, handleModelOTPSend } from "@store/layout";
import  VerificationModal  from '../../../views/pages/verification-otp/index'
import { useHotkeys } from 'react-hotkeys-hook';
import { keysMap , enableOnFormTags } from "../../../configs/config";
import { globleVariable } from "../../../configs/globalVariable";
import Select, { components } from 'react-select' // eslint-disable-line
import { selectThemeColors } from '@utils'
import makeAnimated from 'react-select/animated'
import { DROPDOWN_PLACEHOLDER } from '../../../configs/config';
import LocalFunction from '../../../configs/getLocalFunction'
import WithoutOtpModel from "../WithoutOtpModel/WithoutOtpModel";

const animatedComponents = makeAnimated()
const MySwal = withReactContent(Swal);

const DropDownGSTRDwownload = ({
  userId,
  clientId,
  finYear,
  finMonth,
  loadFunction, isLoading,
  subscriptionId,
  GstIn,
  setDownloadDate
}) => {

  const [tooltipOpen, setTooltipOpen] = useState(false);
  const dispatch = useDispatch();
  const store = useSelector((state) => state);
  const [block, setBlock] = useState(false);
  const [sendClientId, setSendClientId] = useState(null)
  const [composeOpen, setComposeOpen] = useState(false)
  const [show, setShow] = useState(false);
  const [panDataFrom, setPanDataFrom] = useState([]);
  const [panData, setPanData] = useState([]);
  const [finFromYear, setFinFormYear] = useState(null);
  const [msgDisplay, setMsgDisplay] = useState(null);
  const [typeOfDownload,setTypeOfDonwload] = useState("");
  const [openWithoutOtpFailed, setopenWithoutOtpFailed] = useState(false);

  //** toggle show/hide
  const toggleCompose = () => setComposeOpen(!composeOpen)

    //** Shortcut keys
   useHotkeys(keysMap.DOWNLOAD_GOVT_DATA , () => { isLoading == false && OpenSelection()} , {enableOnFormTags}  );

//** Range wise year
const finYearOption = LocalFunction.getLocalValue(globleVariable.rangeFiltersGSTR2B , true);
const YearList = finYearOption !== undefined &&  finYearOption !== null &&  finYearOption !== "" && finYearOption !== 'undefined' ? JSON.parse(finYearOption) : [];

//** From and To Date
useEffect(() => {
  setPanData(YearList);
  setPanDataFrom(YearList);

}, [])

  // ** From month - selection
  const selectFromYear = (value) => {
    console.log("value=", value)
    setFinFormYear(value?.value);
  }


  useEffect(() => {
    return () => setBlock(false);
  }, []);

  const giveLoader = (key)=>{
    alert(key)
    setBlock(key)
  }

  // ** Search
  const gstrSummary = () => {
    const filterDate = panDataFrom?.filter((item) => item.value == sessionStorage.getItem(globleVariable.selectExportFromDt))[0]?.value
    const userData = {
      clientid: clientId,
      // sessionStorage.getItem("G_UCParId"),
      finyear:  finFromYear !== null &&   finFromYear !== "" ? finFromYear : filterDate,
      finmonth:  finFromYear !== null &&   finFromYear !== "" ? finFromYear : filterDate,
      subscriptionId: subscriptionId,
      gstNumber: GstIn,
      setLoader: loadFunction,
    };

    dispatch(getGSTR2BSummary(userData));
  };


  // ** Close modal
  const closeModal = () => {
    // clearErrors();
    setShow(false)
  }


  // ** Download
  const downloadDataFunc = () => {
    document.getElementById("downloadGstr2b").blur();
    const filterDate = panDataFrom?.filter((item) => item.value == sessionStorage.getItem(globleVariable.selectExportFromDt))[0]?.value
    console.log(finFromYear)

    // return MySwal.fire({
    //   title:
    //     "Click 'YES' If you wish to replace data then along with this your reconciliation action(If taken) will also be deleted.",
    //   text: "",
    //   icon: "warning",
    //   showCancelButton: true,
    //   confirmButtonText: "Yes",
    //   customClass: {
    //     confirmButton: "btn btn-outline-danger ms-1",
    //     cancelButton: "btn btn-outline-secondary ms-1",
    //   },
    //   buttonsStyling: false,
    // }).then(function (result) {
    //   if (result.value) {

        setShow(false);
        setBlock(true);
        loadFunction(true);
        Gstr2bService.downloadGSTR2BGovtFile(
          clientId,
          userId,
          finFromYear !== null &&   finFromYear !== "" ? finFromYear : filterDate,
          subscriptionId,
          GstIn
        )
          .then((res) => {
            console.log(res);
            if (res.data.status === errorCodeConfig.APIDefaultCode.GovtOTPExpire) {
              closeModal();
              setMsgDisplay(res?.data?.errorMessage)
              setBlock(false);
              loadFunction(false);
              setComposeOpen(true)
             // dispatch(handleModelOTP(!store.layout.modelVerifyOTP));
            } else {
              if (
                res.status === 200 &&
                res.data.status === errorCodeConfig.APIDefaultCode.Success
              ) {
                setDownloadDate(true)
                setBlock(false);
                loadFunction(false);
                toast.success(res.data.successMessage, {
                  position: "top-right",
                });
                gstrSummary();
                sessionStorage.setItem(globleVariable.GSTR_2BFrdt, finFromYear)
                sessionStorage.setItem(globleVariable.GSTR_2BTodt, finFromYear)            
              } else {
                setBlock(false);
                loadFunction(false);
                // toast.dismiss();
                Swal.fire({
                  icon: "error",
                  title: "",
                  text: res?.data?.errorMessage,
                  customClass: {
                    confirmButton: "btn btn-outline-danger",
                  },
                  buttonsStyling: false,
                });
              }
            }
          })
          .catch((error) => {
            setBlock(false);
            loadFunction(false);
            console.log(error.message);
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
    //  }
   // });

  };

  const downloadDataFuncWithoutOtp = () => {
    
    document.getElementById("downloadGstr2b").blur();
    const filterDate = panDataFrom?.filter((item) => item.value == sessionStorage.getItem(globleVariable.selectExportFromDt))[0]?.value
        setShow(false);
        setBlock(true);
        loadFunction(true);
        Gstr2bService.downloadGSTR2BGovtFileWithoutOtp(
          clientId,
          userId,
          finFromYear !== null &&   finFromYear !== "" ? finFromYear : filterDate,
          subscriptionId,
          GstIn
        )
          .then((res) => {
            console.log(res);
            if (res.data.status === errorCodeConfig.APIDefaultCode.GovtOTPExpire) {
              closeModal();
              setBlock(false);
              loadFunction(false);
              setopenWithoutOtpFailed(true)
            } else {
              if (
                res.status === 200 &&
                res.data.status === errorCodeConfig.APIDefaultCode.Success
              ) {
                setDownloadDate(true)
                setBlock(false);
                loadFunction(false);
                toast.success(res.data.successMessage, {
                  position: "top-right",
                });
                gstrSummary();
                sessionStorage.setItem(globleVariable.GSTR_2BFrdt, finFromYear)
                sessionStorage.setItem(globleVariable.GSTR_2BTodt, finFromYear)            
              } else {
                setBlock(false);
                loadFunction(false);
                // toast.dismiss();
                Swal.fire({
                  icon: "error",
                  title: "",
                  text: res?.data?.errorMessage,
                  customClass: {
                    confirmButton: "btn btn-outline-danger",
                  },
                  buttonsStyling: false,
                });
              }
            }
          })
          .catch((error) => {
            setBlock(false);
            loadFunction(false);
            console.log(error.message);
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

    // **  dropdown select
    const OpenSelection = () => {
      setFinFormYear(null)
      setShow(true)
      setTooltipOpen(false);
      document.getElementById('downloadGstr2b').blur();
    }


  return (
    <Fragment>
     <VerificationModal composeOpen={composeOpen} toggleCompose={toggleCompose} userClientIds={clientId}
       messageDisplay={msgDisplay}  otpGSTIN={GstIn}
     ></VerificationModal>
      {openWithoutOtpFailed == true && (
      <WithoutOtpModel
       openWithoutOtpFailed={openWithoutOtpFailed}
       setopenWithoutOtpFailed={setopenWithoutOtpFailed}
       G_UCParId={clientId}>
      </WithoutOtpModel>) }
      {/* <UncontrolledButtonDropdown>
        <DropdownToggle
          color="danger"
          onClick={() => OpenSelection()}
          className=" me-1 btn-icon btn-round dropdown-toggle"
          id="downloadGstr2b"
          outline
        >
          <DownloadCloud size={14} />
          <span className="align-middle ms-50">Download</span>

          <Tooltip
            placement="top"
            isOpen={tooltipOpen}
            target="downloadGstr2b"
            toggle={() => setTooltipOpen(!tooltipOpen)}
          >
            Download[{keysMap.DOWNLOAD_GOVT_DATA}]
          </Tooltip>
        </DropdownToggle>
        
      </UncontrolledButtonDropdown> */}
                {/* <span className="align-middle ms-50">Download</span> */}
                <UncontrolledButtonDropdown>
                <DropdownToggle color='danger' outline caret className="me-1"  id="downloadGstr2b">
                  <DownloadCloud size={14} />
                  <span className="align-middle ms-50">
                    Download
                  </span>  &nbsp;
                  <ChevronDown size={14} />
                </DropdownToggle>
                <DropdownMenu className="dropdown-reconcilation-purchase-sumary">
                  <DropdownItem onClick={() => {setShow(true),setTypeOfDonwload("withOTP")}} tag='a' >With OTP    </DropdownItem>
                  <DropdownItem onClick={() => {setShow(true),setTypeOfDonwload("withOutOTP")}} tag='a'>Without OTP  </DropdownItem>

                </DropdownMenu>
              </UncontrolledButtonDropdown>
      <Modal backdrop="static" isOpen={show} toggle={() => setShow(!show)} className='modal-dialog-centered  modal-sm'>
        <div className='modal-header'>
          <h2 className='modal-title w-100 text-center'>Download Data</h2>
          <div className='modal-actions'>
            <a  onClick={() => setShow(!show)} className='text-body'>
              <X size={14} />
            </a>
          </div>
        </div>

        <hr style={{ margin: "0px" }}></hr>
        <ModalBody className='px-sm-2 mx-30 pb-2'>
          <Row tag='form' className='gy-1 pt-75' >
            <Col xs={3}>
            </Col>
            <Col xs={6}>
              <Label className='form-label' for='status'>
                <b>Return Period</b>
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
                defaultValue={panDataFrom?.filter((item) => item.value == sessionStorage.getItem(globleVariable.selectExportFromDt))[0]}
                onChange={selectFromYear}
              />
            </Col>

            <Col xs={12} className='text-center pt-50'>
              {/* <Button className='me-1' color='danger' onClick={downloadDataFunc} outline> */}
              <Button className='me-1' color='danger' onClick={typeOfDownload=="withOutOTP" ? downloadDataFuncWithoutOtp:  downloadDataFunc} outline>
                Continue
              </Button>
              <Button type='reset' color='secondary' outline onClick={closeModal}>
                Cancel
              </Button>

            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </Fragment>
  );
};

export default DropDownGSTRDwownload;
