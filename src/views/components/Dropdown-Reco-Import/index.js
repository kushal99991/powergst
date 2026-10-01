// ** Reactstrap Imports
import {
  DropdownToggle,
  UncontrolledButtonDropdown,
  Tooltip,
  Button,
  Col,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  Label,
} from "reactstrap";
import Select, { components } from "react-select"; // eslint-disable-line
import { selectThemeColors } from "@utils";
import makeAnimated from "react-select/animated";
import { useDispatch, useSelector } from "react-redux";
import React, { Fragment, useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { deleteNotification } from "../../apps/user/store";
import withReactContent from "sweetalert2-react-content";

// ** Icons Imports
import { Download, DownloadCloud, ArrowUp } from "react-feather";
import PurchaseService from "../../../services/Reco/Purchase/purchaseInvoiceService";
import toast from "react-hot-toast";
import errorCodeConfig from "../../../configs/apiErrorCodeConfig";
import GSTR2BConstants from "../../pages/gstr2B/Constants";
import encryptData from "../../../auth/crypto/crypto";
import { DROPDOWN_PLACEHOLDER, SELECT_MAXSIZE } from "../../../configs/config";
import { X } from "react-feather";

import { useHotkeys } from "react-hotkeys-hook";
import { keysMap, enableOnFormTags } from "../../../configs/config";
import { globleVariable } from "../../../configs/globalVariable";
import LocalFunction from '../../../configs/getLocalFunction'
import SessionFunction from '../../../configs/getSessionFunction'
import DownloadSampleModal from "../DownloadSample/DownloadSampleModal";

const MySwal = withReactContent(Swal);
const animatedComponents = makeAnimated();

let resData = null;
const DropDownRecoImport = ({
  handleFireStore,
  userId,
  clientId,
  finYear,
  finMonth,
  loadFunction,
  PurchaseSummaryService,
  isloading,
  GSTIN,
  buttonDisable
}) => {
  // ** useState
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [show, setShow] = useState(false);
  const [finFromYear, setFinFormYear] = useState(null);
  const [importfinFromYear, setImportFinFormYear] = useState(null);
  const [panDataFrom, setPanDataFrom] = useState([]);
  const [sampleDownloadModal, setSampleDownloadModal] = useState(false)
  const inputFile = useRef(null);

  const [block, setBlock] = useState(false);
  const dispatch = useDispatch();

  //** use Naviagate
  const navigate = useNavigate();

  //** Finance year array
  const finYearOption = LocalFunction.getLocalValue(globleVariable.rangeFilters, true);  //localStorage.getItem("rangeFilters");
  const YearList = JSON.parse(finYearOption);
  const gstr1Range = sessionStorage.getItem(globleVariable.gstr1FromDt) && SessionFunction.getSessionValue(globleVariable.gstr1FromDt, true)

  //** Shortcut keys
  useHotkeys(keysMap.IMPORT_DATA, () => { isloading == false && setShow(true) }, { enableOnFormTags });

  useEffect(() => {
    setPanDataFrom(YearList);
    return () => setBlock(false);
  }, []);

  // ** Upload excel
  const UploadExcel = (IsValidate, uploadData, IsSupplierDebitNote) => {

    const payFire = {
      id1: userId,
      id2: "PurchaseImportExcelProgress",
    };
    const payFire1 = {
      id1: userId,
      id2: "PurchaseImportExcelProgressMessage",
    };
    // dispatch(deleteNotification(payFire));
    // dispatch(deleteNotification(payFire1));

    setTimeout(() => {
      PurchaseService.PurchaseImportExcel(
        uploadData,
        clientId,
        userId,
        finFromYear
          ? finFromYear
          : panDataFrom?.filter(
            (item) =>
              item.value == sessionStorage.getItem(globleVariable.purSelectExportFromDt)
          )[0]?.value,
        IsValidate,
        10,
        IsSupplierDebitNote,
        GSTIN,
      )
        .then((res) => {
          // console.log(res);
          loadFunction(false);
          if (
            res.status === 200 &&
            res.data.status === errorCodeConfig.APIDefaultCode.Success
          ) {
            toast.success(res.data.successMessage, {
              position: "top-right",
            });

            setShow(false);
            sessionStorage.setItem("isValidate", IsValidate);
            sessionStorage.setItem("IsSupplierDebitNote", IsSupplierDebitNote);
            const payFire = {
              id1: userId,
              id2: "PurchaseImportExcelProgress",
            };
            const payFire1 = {
              id1: userId,
              id2: "PurchaseImportExcelProgressMessage",
            };


            // dispatch(deleteNotification(payFire));
            // dispatch(deleteNotification(payFire1));

            navigate("/purchase/import-data-summary", {
              state: { importData: res.data.data, returnDate: finFromYear, dateTitleShow: importfinFromYear },
            });
          } else if (res.status === 200 && res.data.status == "-13004") {
            resData = JSON.parse(JSON.stringify(res?.data?.data));
            console.log(resData);
            if (resData !== undefined) {
              var csssClass = "";
              let htmltblData = "<div  class='import-error-height'><table class='table text-start'><thead style='" + csssClass + "' ><tr><th>Row No</th><th>Invoice No.</th><th>Error</th>"
              for (let i = 0; i < resData.length; i++) {
                htmltblData += `<tr style="${csssClass}"><td style="${csssClass}">${resData[i].row}</td><td style="${csssClass}">${resData[i].invoiceNumber}</td><td style="text-align:left">${resData[i].description}</td></tr>`;
              }

              htmltblData += "</tbody></table></div>";

              const payFire = {
                id1: userId,
                id2: "PurchaseImportExcelProgress",
              };
              const payFire1 = {
                id1: userId,
                id2: "PurchaseImportExcelProgressMessage",
              };
              // dispatch(deleteNotification(payFire));
              // dispatch(deleteNotification(payFire1));
              return MySwal.fire({
                title: "<strong>Data missing below fields.</strong>",
                icon: "error",
                html: htmltblData,
                customClass: {
                  confirmButton: "btn btn-outline-danger",
                  cancelButton: "btn btn-outline-secondary ms-1 me-1",
                },
                showCancelButton: true,
                confirmButtonText: "OK",
                cancelButtonText: "Cancel",
                buttonsStyling: false,
                width: "80%",
                height: "350px",
                // heightAuto:true
              });
            }
          } else if (res.status === 200 && res.data.status == "-13002") {
            resData = JSON.parse(JSON.stringify(res.data.data));
            console.log(resData);
            const payFire = {
              id1: userId,
              id2: "PurchaseImportExcelProgress",
            };
            const payFire1 = {
              id1: userId,
              id2: "PurchaseImportExcelProgressMessage",
            };
            // dispatch(deleteNotification(payFire));
            // dispatch(deleteNotification(payFire1));

            if (res.data.data) {
              return MySwal.fire({
                title: "<strong>Import Error</strong>",
                // icon: "info",
                html:    <List></List> ,
                customClass: {
                  confirmButton: "btn btn-outline-danger",
                },
                buttonsStyling: false,
                allowOutsideClick: false,
              });
            } else {
              Swal.fire({
                icon: "error",
                title: "",
                text: res?.data?.errorMessage,
                customClass: {
                  confirmButton: "btn btn-outline-danger",
                },
                buttonsStyling: false,
                allowOutsideClick: false,
              });
            }

          } else {
            setShow(false);
            loadFunction(false);
            const payFire = {
              id1: userId,
              id2: "PurchaseImportExcelProgress",
            };
            const payFire1 = {
              id1: userId,
              id2: "PurchaseImportExcelProgressMessage",
            };
            // dispatch(deleteNotification(payFire));
            // dispatch(deleteNotification(payFire1));
            Swal.fire({
              icon: "error",
              title: "",
              text: res?.data?.errorMessage,
              customClass: {
                confirmButton: "btn btn-outline-danger",
              },
              buttonsStyling: false,
              allowOutsideClick: false,
            });
          }
        })
        .catch((error) => {
          setShow(false);
          loadFunction(false);
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
    }, 2000);
  };

  // ** File select function
  const handleChange = (e) => {
    // console.log('import file')
    const chosenFiles = Array.prototype.slice.call(e.target.files);
    var fileName = e.target.files[0];
    if (e.target.files.length > 0) {
      if (
        fileName.name.lastIndexOf(".xlsx").toString().toLowerCase() === -1 &&
        fileName.name.lastIndexOf(".xls").toString().toLowerCase() === -1
      ) {
        toast.error("Please note: only excel file formats are allowed.", {
          position: "top-right",
        });
      } else {
        const payFire = {
          id1: userId,
          id2: "PurchaseImportExcelProgress",
        };
        const payFire1 = {
          id1: userId,
          id2: "PurchaseImportExcelProgressMessage",
        };
        // dispatch(deleteNotification(payFire));
        // dispatch(deleteNotification(payFire1));
        handleFireStore(true);
        const uploadData = new FormData();
        chosenFiles.forEach((item) => {
          uploadData.append(`File`, item);
        });
        const labelYear = finFromYear
          ? finFromYear
          : panDataFrom?.filter(
            (item) =>
              item.value == sessionStorage.getItem(globleVariable.purSelectExportFromDt)
          )[0]?.value;
        let selectedYear = panDataFrom?.filter(
          (item) => item.value == labelYear
        )[0]?.label;

        localStorage.setItem(globleVariable.p_file, fileName.name);

        if (finFromYear !== null && finFromYear !== "") {
          sessionStorage.setItem(globleVariable.recoImportDate, finFromYear)
        } else {

          const selectDt = panDataFrom?.filter(
            (item) =>
              item.value ==
              sessionStorage.getItem(globleVariable.purSelectExportFromDt)
          )[0];

          sessionStorage.setItem(globleVariable.recoImportDate, selectDt?.value)
        }


        return MySwal.fire({
          title: "",
          text: "Are you sure validate your data ?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
          customClass: {
            confirmButton: "btn btn-outline-danger ms-1",
            cancelButton: "btn btn-outline-secondary ms-1",
          },
          buttonsStyling: false,
        }).then(function (result) {
          if (result.value) {
            return MySwal.fire({
              title: "",
              text: "Are you importing supplier credit note as your debit note ?",
              icon: "warning",
              showCancelButton: true,
              confirmButtonText: "Yes",
              cancelButtonText: "No",
              customClass: {
                confirmButton: "btn btn-outline-danger ms-1",
                cancelButton: "btn btn-outline-secondary ms-1",
              },
              buttonsStyling: false,
              reverseButtons: true,
            }).then(function (result) {
              if (result.value) {
                loadFunction(true, fileName, selectedYear);
                UploadExcel("1", uploadData, true);
                e.target.value = null;
              } else if (result.dismiss === MySwal.DismissReason.cancel) {
                loadFunction(true, fileName, selectedYear);
                UploadExcel("1", uploadData, false);
                e.target.value = null;
              }
            });
          } else if (result.dismiss === MySwal.DismissReason.cancel) {
            return MySwal.fire({
              title: "",
              text: "Are you importing supplier credit note as your debit note ?",
              icon: "warning",
              showCancelButton: true,
              confirmButtonText: "Yes",
              cancelButtonText: "No",
              customClass: {
                confirmButton: "btn btn-outline-danger ms-1",
                cancelButton: "btn btn-outline-secondary ms-1",
              },
              buttonsStyling: false,
              reverseButtons: true,
            }).then(function (result) {
              if (result.value) {
                loadFunction(true, fileName, selectedYear);
                UploadExcel("0", uploadData, true);
                e.target.value = null;
              } else if (result.dismiss === MySwal.DismissReason.cancel) {
                loadFunction(true, fileName, selectedYear);
                UploadExcel("0", uploadData, false);
                e.target.value = null;
              }
            });
          }
        });
      }
    }
    setTooltipOpen(false);
    e.target.value = null;
  };

  //** import Company
  const onClickiImportFile = (btnId) => {
    return MySwal.fire({
      title:
        "Click 'YES' If you wish to replace data then along with this your reconciliation action(If taken) will also be deleted.",
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      customClass: {
        confirmButton: "btn btn-outline-danger ms-1",
        cancelButton: "btn btn-outline-secondary ms-1",
      },
      buttonsStyling: false,
    }).then(function (result) {
      if (result.value) {
        inputFile.current.click();
      } else {
        setShow(false);
      }
    });
  };

  // ** onClick import dropdown
  const onSelectFinyear = () => {
    setFinFormYear(null);
    setShow(true);
    setTooltipOpen(false);
    document.getElementById("recoImport").blur();
  };

  // ** select option
  const selectFromYear = (value) => {
    setFinFormYear(value?.value);
    console.log(value, "valueeeee")
    setImportFinFormYear(value)
  };

  // ** close modal
  const closeModal = () => {
    setShow(false);
  };

  useEffect(() => {
    const importDt = panDataFrom?.filter(
      (item) =>
        item.value ==
        sessionStorage.getItem(globleVariable.purSelectExportFromDt)
      // sessionStorage.getItem("purSelectExportFromDt")
    )[0]

    setImportFinFormYear(importDt)

  }, [show])

  return (
    <Fragment>
      <UncontrolledButtonDropdown onClick={() => onSelectFinyear()}>
        <DropdownToggle
          disabled={buttonDisable}
          color="danger"
          className=" me-1 btn-icon btn-round dropdown-toggle"
          id="recoImport"
          outline
        >
          <Download size={14} />
          <span className="align-middle ms-50">Import</span>
          <Tooltip
            placement="top"
            isOpen={tooltipOpen}
            target="recoImport"
            toggle={() => setTooltipOpen(!tooltipOpen)}
          >
            {" "}
            Import [{keysMap.IMPORT_DATA}]
          </Tooltip>
        </DropdownToggle>
      </UncontrolledButtonDropdown>
      <input
        type="file"
        id="file"
        ref={inputFile}
        onChange={(e) => handleChange(e)}
        style={{ display: "none" }}
      />
      <Modal
        backdrop="static"
        isOpen={show}
        toggle={() => setShow(!show)}
        className="modal-dialog-centered  modal-sm"
      >
        <div className="modal-header">
          <h2 className="modal-title w-100 text-center">Import Data</h2>
          <div className="modal-actions">
            <a onClick={() => setShow(!show)} className="text-body">
              <X size={14} />
            </a>
          </div>
        </div>
        <ModalBody className="px-sm-2 mx-30 pb-2">
          <div className="d-flex justify-content-end pt-1">
            <span
              className="d-flex cursor-pointer"
              onClick={() => setSampleDownloadModal(true)}
            >
              <Download size={14} />
              <h6 className="text-danger" style={{ marginLeft: '5px' }}>Download Sample File</h6>
            </span>
          </div>
          <Row tag="form" className="gy-1 pt-75">
            <Col xs={3}></Col>
            <Col xs={6}>
              <Label className="form-label" for="status">
                <b>Return Period</b>
              </Label>
              <Select
                id="purchaseId_invtype"
                placeholder={DROPDOWN_PLACEHOLDER}
                maxMenuHeight={SELECT_MAXSIZE}
                isClearable={false}
                theme={selectThemeColors}
                closeMenuOnSelect={true}
                components={animatedComponents}
                options={panDataFrom}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={selectFromYear}
                defaultValue={
                  panDataFrom?.filter(
                    (item) =>
                      item.value ==
                      sessionStorage.getItem("purSelectExportFromDt")
                  )[0]
                }
              />
            </Col>
            <Col xs={12} className="text-center pt-50">
              <Button
                className="me-1"
                color="danger"
                onClick={onClickiImportFile}
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
              <input
                type="file"
                id="file"
                multiple
                ref={inputFile}
                onChange={(e) => handleChange(e)}
                style={{ display: "none" }}
              />
            </Col>
          </Row>
        </ModalBody>
      </Modal>
      <DownloadSampleModal
        onToggle={() => setSampleDownloadModal(!sampleDownloadModal)}
        open={sampleDownloadModal}
        modelFor="Purchase"
        setBlock={setBlock}
      />
    </Fragment>
  );
};

function List({ }) {
  var nameList = resData;
  const itemList =
    nameList && nameList.map((item, i) => <li key={i}>{item.item2}</li>);
  return (
    <div>
      <ol>{itemList}</ol>
    </div>
  );
}

export default DropDownRecoImport;
