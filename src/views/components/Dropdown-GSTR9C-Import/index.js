// ** Reactstrap Imports
import { Button, Col, Row } from "reactstrap";

import React, { Fragment, useRef } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
// ** Icons Imports
import govermentImg from "@src/assets/images/pages/india.jpg";
import { ArrowLeft, ArrowRight, Download } from "react-feather";
import toast from "react-hot-toast";
import { useHotkeys } from "react-hotkeys-hook";
import errorCodeConfig from "../../../configs/apiErrorCodeConfig";
import { enableOnFormTags, keysMap } from "../../../configs/config";
import LocalFunction from "../../../configs/getLocalFunction";
import SessionFunction from "../../../configs/getSessionFunction";
import { globleVariable } from "../../../configs/globalVariable";
import { onSampleTemplateDownload } from "../DownloadSample/DownloadSampleModal";
import gstr9cService from "../../../services/gstr9c/gstr9cService";

const MySwal = withReactContent(Swal);

let resData = null;
const DropDownGstr9Import = ({
  block,
  setBlock,
  buttonDisable,
  filterYear,
  stepper,
}) => {
  // ** useState
  const inputFile = useRef(null);

  useHotkeys(
    keysMap.IMPORT_DATA,
    () => {
      !block && !buttonDisable && onSelectFinyear();
    },
    { enableOnFormTags }
  );

  const user_Id =
    localStorage.getItem(globleVariable.userId) &&
    LocalFunction.getLocalValue(globleVariable.userId, true);
  const G_UCParId =
    sessionStorage.getItem(globleVariable.G_UCParId) &&
    SessionFunction.getSessionValue(globleVariable.G_UCParId, true);
  const G_GSTIN =
    sessionStorage.getItem(globleVariable.G_GSTIN) &&
    SessionFunction.getSessionValue(globleVariable.G_GSTIN, true);

  // ** Upload Excel
  const UploadExcel = (uploadData) => {
    setBlock(true);
    gstr9cService
      .PurchaseImportExcel(
        uploadData,
        G_UCParId,
        user_Id,
        filterYear?.value,
        10,
        G_GSTIN
      )
      .then((res) => {
        if (
          res.status === 200 &&
          res.data.status === errorCodeConfig.APIDefaultCode.Success
        ) {
          toast.success(res.data.successMessage, {
            position: "top-right",
          });
          stepper.next();
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
      .finally(() => {
        setBlock(false);
      });
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
        const uploadData = new FormData();
        chosenFiles.forEach((item) => {
          uploadData.append(`File`, item);
        });
        UploadExcel(uploadData);
        e.target.value = null;
      }
    }
    e.target.value = null;
  };

  //** import Company
  const onClickiImportCompanyFile = (btnId) => {
    inputFile.current.click();
  };

  return (
    <Fragment>
      <div className="d-flex justify-content-between">
        <h6>You are Importing the Excel File :- {filterYear?.label}</h6>
        <span
          className="d-flex cursor-pointer"
          onClick={() =>
            onSampleTemplateDownload({ setBlock, modelFor: "GSTR9CFile" })
          }
        >
          <Download size={14} />
          <h6 className="text-danger" style={{ marginLeft: "5px" }}>
            Download Sample File
          </h6>
        </span>
      </div>
      <Row>
        <Col xl="3" md="3" sm="6">
          <div
            onClick={onClickiImportCompanyFile}
            style={{ cursor: "pointer" }}
            className="card p-2 text-center"
          >
            <div>
              <img className="img-fluid w-25 m-auto" src={govermentImg} />
            </div>
            <p style={{ fontWeight: "bold" }}> Government Excel</p>
          </div>
        </Col>
        <input
          type="file"
          id="file"
          ref={inputFile}
          onChange={(e) => handleChange(e)}
          style={{ display: "none" }}
        />
      </Row>
      <div style={{ zIndex: "999" }} className="btnFixFooter">
        <div className="container">
          <div
            style={{ marginTop: "25px" }}
            className="d-flex justify-content-between"
          >
            <Button
              color="danger"
              className="btn-prev"
              outline disabled
            >
              <ArrowLeft
                size={14}
                className="align-middle me-sm-25 me-0"
              ></ArrowLeft>
              <span className="align-middle d-sm-inline-block d-none">
                Previous
              </span>
            </Button>
            <Button
              color="danger"
              className="btn-next"
              onClick={() => stepper.next()}
            >
              <span className="align-middle d-sm-inline-block d-none">
                Next
              </span>
              <ArrowRight
                size={14}
                className="align-middle ms-sm-25 ms-0"
              ></ArrowRight>
            </Button>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default DropDownGstr9Import;
