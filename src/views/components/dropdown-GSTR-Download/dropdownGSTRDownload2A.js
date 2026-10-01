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
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import React, { Fragment, useEffect, useState } from "react";
// ** Icons Imports
import { ChevronDown, Download, DownloadCloud, X } from "react-feather";

import purchaseInvoiceService2A from "../../../services/Reco/Purchase2A/purchaseInvoiceService2A";
import toast from "react-hot-toast";
import makeAnimated from "react-select/animated";
import { globleVariable } from "../../../configs/globalVariable";
import errorCodeConfig from "../../../configs/apiErrorCodeConfig";

import LocalFunction from "../../../configs/getLocalFunction";
import Swal from "sweetalert2";
import Select from "react-select"; // eslint-disable-line
import { selectThemeColors } from "@utils";
import { DROPDOWN_PLACEHOLDER } from "../../../configs/config";

// ** Store & Actions
import { getGSTR2ASummary } from "../../../views/pages/gstr2A/store";
import { useDispatch, useSelector } from "react-redux";
import withReactContent from "sweetalert2-react-content";
import VerificationModal from "../../../views/pages/verification-otp/index";
import { handleModelOTP, handleModelOTPSend } from "@store/layout";
import { useHotkeys } from "react-hotkeys-hook";
import { keysMap, enableOnFormTags } from "../../../configs/config";
import { SELECT_MAXSIZE } from "../../../configs/config";
import WithoutOtpModel from "../WithoutOtpModel/WithoutOtpModel";

const animatedComponents = makeAnimated();
const MySwal = withReactContent(Swal);

const DropDownGSTRDwownload2A = ({
  userId,
  clientId,
  finYear,
  finMonth,
  subscriptionId,
  gstNumber,
  loadFunction,
  setDownloadDate
}) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [block, setBlock] = useState(false);
  const [composeOpen, setComposeOpen] = useState(false);
  const [show, setShow] = useState(false);
  const [panDataFrom, setPanDataFrom] = useState([]);
  const [panData, setPanData] = useState([]);
  const [finFromYear, setFinFormYear] = useState(null);
  const [msgDisplay, setMsgDisplay] = useState(null);
  const [typeOfDownload,setTypeOfDonwload] = useState("");
  const [openWithoutOtpFailed, setopenWithoutOtpFailed] = useState(false);
  const dispatch = useDispatch();
  // ** Store Vars
  const store = useSelector((state) => state);

  //** toggle show/hide
  const toggleCompose = () => setComposeOpen(!composeOpen);

  //** Shortcut keys
  useHotkeys(
    keysMap.DOWNLOAD_GOVT_DATA,
    () => {
      block == false && OpenSelection();
    },
    { enableOnFormTags }
  );

  //** Range wise year
  const finYearOption = LocalFunction.getLocalValue(
    globleVariable.rangeFilters,
    true
  );
  const YearList =
    finYearOption !== undefined &&
    finYearOption !== null &&
    finYearOption !== "" &&
    finYearOption !== "undefined"
      ? JSON.parse(finYearOption)
      : [];

  //** From and To Date
  useEffect(() => {
    setPanData(YearList);
    setPanDataFrom(YearList);
  }, []);

  // ** From month - selection
  const selectFromYear = (value) => {
    console.log("value=downloadDataFunc", value);
    setFinFormYear(value?.value);
  };

  useEffect(() => {
    return () => setBlock(false);
  }, []);

  const gstrSummary = () => {
    const filterDate = panDataFrom?.filter((item) =>item.value == sessionStorage.getItem(globleVariable.selectExportFromDt))[0]?.value;

    const userData = {
      clientid: clientId,
      finyear:finFromYear !== null && finFromYear !== "" ? finFromYear : filterDate,
      finmonth: finFromYear !== null && finFromYear !== "" ? finFromYear : filterDate,
      subscriptionId,
      gstNumber,
    };

    dispatch(getGSTR2ASummary(userData));
  };

  // ** Close modal
  const closeModal = () => {
    setShow(false);
  };

  const downloadDataFunc = () => {
    document.getElementById("downloadGstr2A")?.blur();
    const filterDate = panDataFrom?.filter(
      (item) =>
        item.value == sessionStorage.getItem(globleVariable.selectExportFromDt)
    )[0]?.value;

    // return MySwal.fire({
    //     title:
    //         "Click 'YES' If you wish to replace data then along with this your reconciliation action(If taken) will also be deleted.",
    //     text: "",
    //     icon: "warning",
    //     showCancelButton: true,
    //     confirmButtonText: "Yes",
    //     customClass: {
    //         confirmButton: "btn btn-outline-danger ms-1",
    //         cancelButton: "btn btn-outline-secondary ms-1",
    //     },
    //     buttonsStyling: false,
    // }).then(function (result) {
    //     if (result.value) {
     
    setShow(false);
    setBlock(true);
    loadFunction(true);
   const downloadGovtFile = typeOfDownload == 'withOTP'  ?  purchaseInvoiceService2A.downloadGSTR2AGovtFile :  purchaseInvoiceService2A.downloadGSTR2AGovtFileWithoutOtp
   downloadGovtFile(
        clientId,
        userId,
        finFromYear !== null && finFromYear !== "" ? finFromYear : filterDate,
        subscriptionId
      )
      .then((res) => {
        console.log(res);
        if (res.data.status === errorCodeConfig.APIDefaultCode.GovtOTPExpire) {
          closeModal();
          setMsgDisplay(res?.data?.errorMessage);
          setBlock(false);
          loadFunction(false);
          typeOfDownload == 'withOTP'  ? setComposeOpen(true) : setopenWithoutOtpFailed(true)
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
            if(finFromYear == null || finFromYear == undefined){
              const rangedt=panDataFrom?.filter(
                (item) =>
                item.value ==
                sessionStorage.getItem(globleVariable.selectExportFromDt)
                )[0]
                sessionStorage.setItem(globleVariable.selectExportFromDt, rangedt?.value)
                sessionStorage.setItem(globleVariable.selectExportToDt, rangedt?.value)
               }else{
                sessionStorage.setItem(globleVariable.selectExportFromDt, finFromYear)
                sessionStorage.setItem(globleVariable.selectExportToDt, finFromYear)  
               }
          } else {
            setBlock(false);
            loadFunction(false);

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
    setFinFormYear(null);
    setShow(true);
    setTooltipOpen(false);
    document.getElementById("downloadGstr2A").blur();
  };

  return (
    <Fragment>
      <VerificationModal
        composeOpen={composeOpen}
        toggleCompose={toggleCompose}
        userClientIds={clientId}
        messageDisplay={msgDisplay}
        otpGSTIN={gstNumber}
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
          id="downloadGstr2A"
          outline
        >
          <DownloadCloud size={14} />
          <span className="align-middle ms-50">Download </span>

          <Tooltip
            placement="top"
            isOpen={tooltipOpen}
            target="downloadGstr2A"
            toggle={() => setTooltipOpen(!tooltipOpen)}
          >
            Download [{keysMap.DOWNLOAD_GOVT_DATA}]
          </Tooltip>
        </DropdownToggle>
      </UncontrolledButtonDropdown> */}
  <UncontrolledButtonDropdown>
                <DropdownToggle color='danger' outline caret className="me-1"  id="downloadGstr2A">
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
      <Modal
        backdrop="static"
        isOpen={show}
        toggle={() => setShow(!show)}
        className="modal-dialog-centered  modal-sm"
      >
        <div className="modal-header">
          <h2 className="modal-title w-100 text-center">Download Data</h2>
          <div className="modal-actions">
            <a onClick={() => setShow(!show)} className="text-body">
              <X size={14} />
            </a>
          </div>
        </div>

        <hr style={{ margin: "0px" }}></hr>
        <ModalBody className="px-sm-2 mx-30 pb-2">
          <Row tag="form" className="gy-1 pt-75">
            <Col xs={3}></Col>
            <Col xs={6}>
              <Label className="form-label" for="status">
                <b>Return Period</b>
              </Label>
              <Select
                id="from"
                maxMenuHeight={SELECT_MAXSIZE}
                isClearable={false}
                theme={selectThemeColors}
                closeMenuOnSelect={true}
                components={animatedComponents}
                placeholder={DROPDOWN_PLACEHOLDER}
                options={panDataFrom}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={selectFromYear}
                defaultValue={
                  panDataFrom?.filter(
                    (item) =>
                      item.value ==
                      sessionStorage.getItem(globleVariable.selectExportFromDt)
                  )[0]
                }
              />
            </Col>

            <Col xs={12} className="text-center pt-50">
                  <Button className='me-1' color='danger' onClick={downloadDataFunc} outline>Continue</Button>
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
    </Fragment>
  );
};

export default DropDownGSTRDwownload2A;
