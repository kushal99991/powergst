// ** Reactstrap Imports
import {
  DropdownToggle,
  UncontrolledButtonDropdown,
  Tooltip,
  Button,
  Col,
  Modal,
  ModalBody,
  Row,
  Label,
} from "reactstrap";
import Select from "react-select"; // eslint-disable-line
import { selectThemeColors } from "@utils";
import makeAnimated from "react-select/animated";
import { useDispatch } from "react-redux";
import React, { Fragment, useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

// ** Icons Imports
import { Download } from "react-feather";
import gstr6PurchaseInvoice from "../../../services/gstr6/gstr6PurchaseInvoice";
import toast from "react-hot-toast";
import errorCodeConfig from "../../../configs/apiErrorCodeConfig";
import {
  DROPDOWN_PLACEHOLDER,
  keysMap,
  SELECT_MAXSIZE,
  enableOnFormTags,
} from "../../../configs/config";
import { X } from "react-feather";
import { useHotkeys } from "react-hotkeys-hook";

import { globleVariable } from "../../../configs/globalVariable";
import LocalFunction from "../../../configs/getLocalFunction";
import SessionFunction from "../../../configs/getSessionFunction";
import { onSampleTemplateDownload } from "../DownloadSample/DownloadSampleModal";

const MySwal = withReactContent(Swal);
const animatedComponents = makeAnimated();

let resData = null;
const DropDownGstr6Import = ({
  handleFireStore,
  userId,
  clientId,
  finYear,
  finMonth,
  loadFunction,
  PurchaseSummaryService,
  block,
  setBlock,
  buttonDisable,
}) => {
  // ** useState
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [show, setShow] = useState(false);
  const [finFromYear, setFinFormYear] = useState(null);
  const [importfinFromYear, setImportFinFormYear] = useState(null);
  const [panDataFrom, setPanDataFrom] = useState([]);
  const [btnDisableImport, setBtnDisableImport] = useState(false);

  const inputFile = useRef(null);
  const dispatch = useDispatch();

  //** use Naviagate
  const navigate = useNavigate();
  useHotkeys(
    keysMap.IMPORT_DATA,
    () => {
      !block && onSelectFinyear();
    },
    { enableOnFormTags }
  );
  //** Finance year array
  const finYearOption = LocalFunction.getLocalValue(
    globleVariable.rangeFilters,
    true
  );
  const YearList = JSON.parse(finYearOption);

  useEffect(() => {
    setPanDataFrom(YearList);
    return () => setBlock(false);
  }, []);

  const user_Id =
    localStorage.getItem(globleVariable.userId) &&
    LocalFunction.getLocalValue(globleVariable.userId, true);
  const G_UCParId =
    sessionStorage.getItem(globleVariable.G_UCParId) &&
    SessionFunction.getSessionValue(globleVariable.G_UCParId, true);
  const G_GSTIN =
    sessionStorage.getItem(globleVariable.G_GSTIN) &&
    SessionFunction.getSessionValue(globleVariable.G_GSTIN, true);
  const gstr1Range =
    sessionStorage.getItem(globleVariable.gstr1FromDt) &&
    SessionFunction.getSessionValue(globleVariable.gstr1FromDt, true);

  const UploadExcel = (IsValidate, uploadData, IsSupplierDebitNote) => {
    const payFire = { id1: user_Id, id2: "Gstr6ImportExcelProgress" };
    const payFire1 = { id1: user_Id, id2: "Gstr6ImportExcelProgressMessage" };
    // dispatch(deleteNotification(payFire))
    // dispatch(deleteNotification(payFire1))

    setTimeout(() => {
      gstr6PurchaseInvoice
        .PurchaseImportExcel(
          uploadData,
          G_UCParId,
          user_Id,
          finFromYear
            ? finFromYear
            : panDataFrom?.filter((item) => item.value == gstr1Range)[0]?.value,
          IsValidate,
          10,
          IsSupplierDebitNote,
          G_GSTIN
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
            const payFire = { id1: user_Id, id2: "Gstr6mportExcelProgress" };
            const payFire1 = {
              id1: user_Id,
              id2: "Gstr6ImportExcelProgressMessage",
            };
            // dispatch(deleteNotification(payFire))
            // dispatch(deleteNotification(payFire1))
            var showdate = finFromYear
              ? finFromYear
              : panDataFrom?.filter((item) => item.value == gstr1Range)[0]
                ?.value;
            var showLabel = finFromYear
              ? finFromYear
              : panDataFrom?.filter((item) => item.value == gstr1Range)[0];

            navigate("/gstr6/import-data-summary", {
              state: {
                importData: res.data.data,
                importedDate: showdate,
                dateTitleShow: showLabel,
              },
            });
          } else if (res.status === 200 && res.data.status == "-13004") {
            resData = JSON.parse(JSON.stringify(res?.data?.data));

            if (resData !== undefined) {
              var csssClass = "";
              let htmltblData =
                "<div style='' class='import-error-height'><table class='table text-start' style=''><thead style='" +
                csssClass +
                "' ><tr style='" +
                csssClass +
                "'><th style='" +
                csssClass +
                "'>Row No</th><th style='" +
                csssClass +
                "'>Error</th>";
              for (let i = 0; i < resData.length; i++) {
                htmltblData += `<tr style="${csssClass}"><td style="${csssClass}">${resData[i].row}</td><td style="${csssClass}">${resData[i].invoiceNumber}</td><td style="${csssClass} ; text-align:left">${resData[i].description}</td></tr>`;
              }

              htmltblData += "</tbody></table></div>";

              const payFire = { id1: user_Id, id2: "Gstr6ImportExcelProgress" };
              const payFire1 = {
                id1: user_Id,
                id2: "Gstr6ImportExcelProgressMessage",
              };
              // dispatch(deleteNotification(payFire))
              // dispatch(deleteNotification(payFire1))
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
              });
            }
          } else if (res.status === 200 && res.data.status == "-13002") {
            resData = JSON.parse(JSON.stringify(res.data.data));
            console.log(resData);
            const payFire = { id1: user_Id, id2: "Gstr6ImportExcelProgress" };
            const payFire1 = {
              id1: user_Id,
              id2: "Gstr6ImportExcelProgressMessage",
            };
            // dispatch(deleteNotification(payFire))
            // dispatch(deleteNotification(payFire1))

            return MySwal.fire({
              title: "<strong>Import Error</strong>",

              text: res?.data?.errorMessage,
              customClass: {
                confirmButton: "btn btn-outline-danger",
              },
              buttonsStyling: false,
              allowOutsideClick: false,
            });
          } else {
            setShow(false);
            loadFunction(false);
            const payFire = { id1: user_Id, id2: "Gstr6ImportExcelProgress" };
            const payFire1 = {
              id1: user_Id,
              id2: "Gstr6ImportExcelProgressMessage",
            };
            // dispatch(deleteNotification(payFire))
            // dispatch(deleteNotification(payFire1))
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
    console.log("import file", e.target.files[0]);
    const chosenFiles = Array.prototype.slice.call(e.target.files);
    var fileName = e.target.files[0];
    if (e.target.files.length > 0) {
      if (
        fileName.name.lastIndexOf(".XLSX").toString().toLowerCase() === -1 &&
        fileName.name.lastIndexOf(".XLS").toString().toLowerCase() === -1
      ) {
        toast.error("Please note: only excel file formats are allowed.", {
          position: "top-right",
        });
      } else {
        const payFire = { id1: user_Id, id2: "Gstr6ImportExcelProgress" };
        const payFire1 = {
          id1: user_Id,
          id2: "Gstr6ImportExcelProgressMessage",
        };
        // dispatch(deleteNotification(payFire))
        // dispatch(deleteNotification(payFire1))
        handleFireStore(true);
        const uploadData = new FormData();
        chosenFiles.forEach((item) => {
          uploadData.append(`File`, item);
        });
        const labelYear = finFromYear
          ? finFromYear
          : panDataFrom?.filter((item) => item.value == gstr1Range)[0]?.value;
        let selectedYear = panDataFrom?.filter(
          (item) => item.value == labelYear
        )[0]?.label;
        // localStorage.setItem('p_file', fileName.name)
        LocalFunction.setLocalValue(globleVariable.p_file, fileName.name, true);
        loadFunction(true, fileName, selectedYear);
        UploadExcel("0", uploadData, true);
        e.target.value = null;
      }
    }
    setTooltipOpen(false);
    e.target.value = null;
  };

  //** import Company
  const onClickiImportCompanyFile = (btnId) => {
    inputFile.current.click();
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
    console.log(value, "valueeeee");
    setImportFinFormYear(value);
  };

  // ** close modal
  const closeModal = () => {
    setShow(false);
  };

  return (
    <Fragment>
      <UncontrolledButtonDropdown
        onClick={() => {
          !buttonDisable && onSelectFinyear();
        }}
      >
        <DropdownToggle
          disabled={buttonDisable}
          color="danger"
          className=" me-1 btn-icon btn-round dropdown-toggle"
          id="recoImport"
          outline
        >
          <Download size={14} />
          <span className="align-middle ms-50"> Import</span>
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

      {/* Modal */}
      <Modal
        backdrop="static"
        isOpen={show}
        toggle={() => setShow(!show)}
        className="modal-dialog-centered  modal-sm"
      >
        <div className="modal-header">
          <h2 className="modal-title w-100 text-center">Import Data GSTR 6</h2>
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
              onClick={() => onSampleTemplateDownload({ setBlock, modelFor: "GSTR6File" })}
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
                  panDataFrom?.filter((item) => item.value == gstr1Range)[0]
                }
              />
            </Col>
            <Col xs={12} className="text-center pt-50">
              <Button
                className="me-1"
                color="danger"
                onClick={onClickiImportCompanyFile}
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
                ref={inputFile}
                onChange={(e) => handleChange(e)}
                style={{ display: "none" }}
              />
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </Fragment>
  );
};

export default DropDownGstr6Import;
