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
  DropdownMenu, DropdownItem, 
} from "reactstrap";
import React, { Fragment, useEffect, useState } from "react";
// ** Icons Imports
import { Download, DownloadCloud,ChevronDown,X } from "react-feather";

import gstr4AServices from "../../../services/gstr4AServices/gstr4AServices";
import toast from "react-hot-toast";
import makeAnimated from "react-select/animated";
import { globleVariable } from "../../../configs/globalVariable";
import errorCodeConfig from "../../../configs/apiErrorCodeConfig";

import LocalFunction from "../../../configs/getLocalFunction";
import Swal from "sweetalert2";
import Select, { components } from "react-select"; // eslint-disable-line
import { selectThemeColors } from "@utils";
import { DROPDOWN_PLACEHOLDER } from "../../../configs/config";

// ** Store & Actions
import { getGSTR4ASummary } from "../../pages/gstr4A/store";
import { useDispatch, useSelector } from "react-redux";
import withReactContent from "sweetalert2-react-content";
import VerificationModal from "../../pages/verification-otp/index";
import { useHotkeys } from "react-hotkeys-hook";
import { keysMap, enableOnFormTags } from "../../../configs/config";
import { SELECT_MAXSIZE } from "../../../configs/config";
const animatedComponents = makeAnimated();
const MySwal = withReactContent(Swal);

const DropDownGSTRDwownload4A = ({
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
  const [activeTab, setactiveTab] = useState();

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

    const filterDate = panDataFrom?.filter((item) => item.value == sessionStorage.getItem(globleVariable.selectExportFromDt))[0]?.value

    const userData = {
      clientid: clientId,
      finyear: finFromYear !== null &&   finFromYear !== "" ? finFromYear : filterDate,
      finmonth:  finFromYear !== null &&   finFromYear !== "" ? finFromYear : filterDate,
      subscriptionId,
      gstNumber,
    };
    dispatch(getGSTR4ASummary(userData));
  };

  // ** Close modal
  const closeModal = () => {
    // clearErrors();
    setShow(false);
  };

  const downloadDataFunc = () => {
    document.getElementById("downloadGstr4A").blur();
    const filterDate = panDataFrom?.filter(
      (item) =>
        item.value == sessionStorage.getItem(globleVariable.selectExportFromDt)
    )[0]?.value;



    setShow(false);
    setBlock(true);
    loadFunction(true);
    const downloadGovtGSTR4A = typeOfDownload == 'withOTP' ?  gstr4AServices.downloadGovtGSTR4A :  gstr4AServices.downloadGovtGSTR4AWithOutOtp
    downloadGovtGSTR4A(
        clientId,
        userId,
        finFromYear !== null && finFromYear !== "" ? finFromYear : filterDate,
        subscriptionId,
        gstNumber
      )
      .then((res) => {
        console.log(res);
        if (res.data.status === errorCodeConfig.APIDefaultCode.GovtOTPExpire) {
          closeModal();
          setMsgDisplay(res?.data?.errorMessage);
          setBlock(false);
          loadFunction(false);
          setComposeOpen(true);
        } else {
          if (
            res.status === 200 &&
            res.data.status === errorCodeConfig.APIDefaultCode.Success
          ) {
            setBlock(false);
            loadFunction(false);
            toast.success(res.data.successMessage, {
              position: "top-right",
            });
            setDownloadDate(true)
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
    document.getElementById("downloadGstr4A").blur();
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
      {/* <UncontrolledButtonDropdown>
        <DropdownToggle
          color="danger"
          onClick={() => OpenSelection()}
          className=" me-1 btn-icon btn-round dropdown-toggle"
          id="downloadGstr4A"
          outline
        >
          <DownloadCloud size={14} />
          <span className="align-middle ms-50">Download </span>

          <Tooltip
            placement="top"
            isOpen={tooltipOpen}
            target="downloadGstr4A"
            toggle={() => setTooltipOpen(!tooltipOpen)}
          >
            Download [{keysMap.DOWNLOAD_GOVT_DATA}]
          </Tooltip>
        </DropdownToggle>
      </UncontrolledButtonDropdown> */}

      <UncontrolledButtonDropdown disabled={activeTab?.btnDisable1}>
        <DropdownToggle color='danger' outline caret className="me-1"  id="downloadGstr4A">
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
              <Button
                className="me-1"
                color="danger"
                onClick={downloadDataFunc}
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
    </Fragment>
  );
};

export default DropDownGSTRDwownload4A;
