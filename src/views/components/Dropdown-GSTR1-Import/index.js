// ** Reactstrap Imports
import {
  Col
} from "reactstrap";

import { useDispatch, useSelector } from "react-redux";
import React, { Fragment, useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { deleteNotification } from "../../apps/user/store";
import withReactContent from "sweetalert2-react-content";
// ** Icons Imports
import { Download } from "react-feather";
import gstr1PurchaseInvoiceService from "../../../services/gstr1/gstr1Services/gstr1PurchaseInvoiceService";
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
import govermentImg from "@src/assets/images/pages/india.jpg";
import tallyImg from "@src/assets/images/pages/tally.jpg";
import excellImg from "@src/assets/images/pages/excel.jpg";
const MySwal = withReactContent(Swal);


let resData = null;
const DropDownGstr1Import = ({
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
  gstr1Img
}) => {
  // ** useState
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [show, setShow] = useState(false);
  const [importfinFromYear, setImportFinFormYear] = useState(null);
  const [finFromYear, setFinFormYear] = useState(null);
  const [panDataFrom, setPanDataFrom] = useState([]);
  const inputFile = useRef(null);

  const dispatch = useDispatch();

  //** use Naviagate
  const navigate = useNavigate();
  useHotkeys(
    keysMap.IMPORT_DATA,
    () => {
      !block && !buttonDisable && onSelectFinyear();
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

  // ** Upload Excel
  const UploadExcel = (IsValidate, uploadData, IsSupplierDebitNote) => {
    const payFire = { id1: user_Id, id2: "Gstr1ImportExcelProgress" };
    const payFire1 = { id1: user_Id, id2: "Gstr1ImportExcelProgressMessage" };
    // dispatch(deleteNotification(payFire))
    // dispatch(deleteNotification(payFire1))
    setTimeout(() => {
      gstr1PurchaseInvoiceService
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
          loadFunction(false);
          if (
            res.status === 200 &&
            res.data.status === errorCodeConfig.APIDefaultCode.Success
          ) {
            toast.success(res.data.successMessage, {
              position: "top-right",
            });
            sessionStorage.setItem("isValidate", IsValidate);
            sessionStorage.setItem("IsSupplierDebitNote", IsSupplierDebitNote);
            sessionStorage.setItem('hasCalledExport', false);

            setShow(false);

            const payFire = { id1: user_Id, id2: "Gstr1ImportExcelProgress" };
            const payFire1 = {
              id1: user_Id,
              id2: "Gstr1ImportExcelProgressMessage",
            };
            // dispatch(deleteNotification(payFire))
            // dispatch(deleteNotification(payFire1))

            var showdate = finFromYear
              ? finFromYear
              : panDataFrom?.filter((item) => item.value == gstr1Range)[0]
                ?.value;
            var showLabel = finFromYear
              ? finFromYear
              : panDataFrom?.filter((item) => item.value == gstr1Range)[0]
            navigate("/gstr1/import-data-summary", {
              state: {
                importData: res.data.data,
                importedDate: showdate,
                dateTitleShow: showLabel,
              },
            });
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
                "'> Invoice Number</th><th style='" +
                csssClass +
                "'>Error</th>";
              for (let i = 0; i < resData.length; i++) {
                htmltblData += `<tr style="${csssClass}"><td style="${csssClass}">${resData[i].row}</td><td style="${csssClass}">${resData[i].invoiceNumber}</td><td style="${csssClass} ; text-align:left">${resData[i].description}</td></tr>`;
              }

              htmltblData += "</tbody></table></div>";
              const payFire = { id1: user_Id, id2: "Gstr1ImportExcelProgress" };
              const payFire1 = {
                id1: user_Id,
                id2: "Gstr1ImportExcelProgressMessage",
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
                // heightAuto:true
              });
            }
          } else if (res.status === 200 && res.data.status == "-13002") {
            resData = JSON.parse(JSON.stringify(res.data.data));
            const payFire = { id1: user_Id, id2: "Gstr1ImportExcelProgress" };
            const payFire1 = {
              id1: user_Id,
              id2: "Gstr1ImportExcelProgressMessage",
            };
            // dispatch(deleteNotification(payFire))
            // dispatch(deleteNotification(payFire1))

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
              "'> Invoice Number</th><th style='" +
              csssClass +
              "'>Error</th>";

            for (let i = 0; i < resData?.length; i++) {
              htmltblData += `<tr style="${csssClass}"><td style="${csssClass}">${i + 1
                }</td><td style="${csssClass} ; text-align:left">${resData[i].item2
                }</td></tr>`;
            }

            htmltblData += "</tbody></table></div>";

            return MySwal.fire({
              title: "<strong>Import Error-</strong>",
              html: htmltblData,
              customClass: {
                confirmButton: "btn btn-outline-danger",
              },
              buttonsStyling: false,
              allowOutsideClick: false,
              width: "60%",
              height: "350px",
            });
          } else {
            setShow(false);
            loadFunction(false);
            const payFire = { id1: user_Id, id2: "Gstr1ImportExcelProgress" };
            const payFire1 = {
              id1: user_Id,
              id2: "Gstr1ImportExcelProgressMessage",
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
        const payFire = { id1: user_Id, id2: "Gstr1ImportExcelProgress" };
        const payFire1 = {
          id1: user_Id,
          id2: "Gstr1ImportExcelProgressMessage",
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

  const handleMouseEnter = () => {
    setTooltipOpen(true);
  };

  const handleMouseLeave = () => {
    setTooltipOpen(false);
  };

  return (
    <Fragment>
      <Col xl='3' md='3' sm='6'>
        <div onClick={onClickiImportCompanyFile} style={{ cursor: "pointer" }} className="card p-2 text-center">
          <div >
            <img className="img-fluid w-25 m-auto" src={govermentImg} />
          </div>
          <p style={{ fontWeight: "bold" }}> Government Excel</p>
        </div>
      </Col>

      <Col xl='3' md='3' sm='6'>
        <div onClick={onClickiImportCompanyFile} style={{ cursor: "pointer" }} className="card p-2 text-center">
          <div >
            <img className="img-fluid w-25 m-auto" src={tallyImg} />
          </div>
          <p style={{ fontWeight: "bold" }}> Tally Excel</p>
        </div>
      </Col>

      <Col xl='3' md='3' sm='6'>
        <div onClick={onClickiImportCompanyFile} style={{ cursor: "pointer" }} className="card p-2 text-center">
          <div >
            <img className="img-fluid w-25 m-auto" src={excellImg} />
          </div>
          <p style={{ fontWeight: "bold" }}> Single File Excel</p>
        </div>
      </Col>
      <input
        type="file"
        id="file"
        ref={inputFile}
        onChange={(e) => handleChange(e)}
        style={{ display: "none" }}
      />
    </Fragment>
  );
};

export default DropDownGstr1Import;
