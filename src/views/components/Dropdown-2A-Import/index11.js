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
import Select from "react-select"; // eslint-disable-line
import { selectThemeColors } from "@utils";
import makeAnimated from "react-select/animated";
import { useDispatch, useSelector } from "react-redux";
import React, { Fragment, useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { deleteNotification } from "../../apps/user/store";
import withReactContent from "sweetalert2-react-content";
import purchaseInvoiceService2A from "../../../services/Reco/Purchase2A/purchaseInvoiceService2A";

// ** Icons Imports
import { Download, DownloadCloud, ArrowUp } from "react-feather";
import toast from "react-hot-toast";
import errorCodeConfig from "../../../configs/apiErrorCodeConfig";
import {
  DROPDOWN_PLACEHOLDER,
  keysMap,
  SELECT_MAXSIZE,
} from "../../../configs/config";
import { X } from "react-feather";
import { globleVariable } from "../../../configs/globalVariable";
import LocalFunction from "../../../configs/getLocalFunction";
import SessionFunction from "../../../configs/getSessionFunction";

const MySwal = withReactContent(Swal);
const animatedComponents = makeAnimated();

let resData = null;
const DropDownRecoImport2A = ({
  userId,
  clientId,
  finYear,
  finMonth,
  loadFunction,
  PurchaseSummaryService,
}) => {
  // ** useState
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [show, setShow] = useState(false);
  const [finFromYear, setFinFormYear] = useState(null);
  const [panDataFrom, setPanDataFrom] = useState([]);
  const inputFile = useRef(null);
  const [block, setBlock] = useState(false);
  const dispatch = useDispatch();


  const finYearOption = LocalFunction.getLocalValue(
    globleVariable.rangeFilters,
    true
  );
  const YearList = JSON.parse(finYearOption);
  const userIds = LocalFunction.getLocalValue(globleVariable.userId, true);
  const G_UCParId = SessionFunction.getSessionValue(
    globleVariable.G_UCParId,
    true
  );

  useEffect(() => {
    setPanDataFrom(YearList);
    return () => setBlock(false);
  }, []);

  const UploadExcel = (IsValidate, uploadData, IsSupplierDebitNote) => {
    const payFire = { id1: userIds, id2: "Gstr1ImportExcelProgress" };
    const payFire1 = { id1: userIds, id2: "Gstr1ImportExcelProgressMessage" };
    dispatch(deleteNotification(payFire));
    dispatch(deleteNotification(payFire1));

    setTimeout(() => {
      purchaseInvoiceService2A
        .PurchaseImportExcel(
          uploadData,
          G_UCParId,
          userIds,
          finFromYear
            ? finFromYear
            : panDataFrom?.filter(
                (item) =>
                  item.value ==
                  sessionStorage.getItem(globleVariable.gstr1FromDt)
              )[0]?.value
        )
        .then((res) => {
          // console.log(res);
          loadFunction(false);
          if (
            res.status === 200 &&
            res.data.status === errorCodeConfig.APIDefaultCode.Success
          ) {
            PurchaseSummaryService();
            localStorage.setItem("p_file", fileName.name);

            toast.success(res.data.successMessage, {
              position: "top-right",
            });
            e.target.value = null;

            setShow(false);
          } else if (res.status === 200 && res.data.status == "-13004") {
            resData = JSON.parse(JSON.stringify(res?.data?.data));
            console.log(resData);
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
              const payFire = { id1: userIds, id2: "Gstr1ImportExcelProgress" };
              const payFire1 = {
                id1: userIds,
                id2: "Gstr1ImportExcelProgressMessage",
              };
              dispatch(deleteNotification(payFire));
              dispatch(deleteNotification(payFire1));
              return MySwal.fire({
                title: "<strong>Data missing below fields.</strong>",

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

            return MySwal.fire({
              title: "<strong>Import Error</strong>",

              html: <List></List>,
              customClass: {
                confirmButton: "btn btn-outline-danger",
              },
              buttonsStyling: false,
              allowOutsideClick: false,
            });
          } else {
            setShow(false);
            loadFunction(false);

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
        fileName.name.lastIndexOf(".xlsx").toString().toLowerCase() === -1 &&
        fileName.name.lastIndexOf(".xls").toString().toLowerCase() === -1
      ) {
        toast.error("Please note: only excel file formats are allowed.", {
          position: "top-right",
        });
      } else {
        // handleFireStore(true)
        const uploadData = new FormData();
        chosenFiles.forEach((item) => {
          uploadData.append(`File`, item);
        });
        const labelYear = finFromYear
          ? finFromYear
          : panDataFrom?.filter(
              (item) =>
                item.value == sessionStorage.getItem(globleVariable.gstr1FromDt)
            )[0]?.value;
        let selectedYear = panDataFrom?.filter(
          (item) => item.value == labelYear
        )[0]?.label;
        localStorage.setItem("p_file", fileName.name);
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
  };

  // ** close modal
  const closeModal = () => {
    setShow(false);
  };

  return (
    <Fragment>
      <UncontrolledButtonDropdown onClick={() => onSelectFinyear()}>
        <DropdownToggle
          color="danger"
          className=" me-1 btn-icon btn-round dropdown-toggle"
          id="recoImport"
          outline
        >
          <Download size={14} />
          <span className="align-middle ms-50">
            {" "}
            Import [{keysMap.IMPORT_DATA}]
          </span>

          <Tooltip
            placement="top"
            isOpen={tooltipOpen}
            target="recoImport"
            toggle={() => setTooltipOpen(!tooltipOpen)}
          >
            {" "}
            Import
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
          <h2 className="modal-title w-100 text-center">Import Data</h2>
          <div className="modal-actions">
            <a onClick={() => setShow(!show)} className="text-body">
              <X size={14} />
            </a>
          </div>
        </div>

        <ModalBody className="px-sm-2 mx-30 pb-2">
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
                      sessionStorage.getItem(globleVariable.gstr1FromDt)
                  )[0]
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
                multiple
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

function List({}) {
  var nameList = resData;
  const itemList =
    nameList && nameList.map((item, i) => <li key={i}>{item.item2}</li>);
  return (
    <div>
      <ol>{itemList}</ol>
    </div>
  );
}

export default DropDownRecoImport2A;
