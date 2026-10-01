import React, { useCallback, useState } from "react";
import { X } from "react-feather";
import { Col, Modal, ModalBody, Row } from "reactstrap";
import GovernmentLogo from "@src/assets/images/pages/india.jpg";
import TallyLogo from "@src/assets/images/pages/tally.jpg";
import ExcelLogo from "@src/assets/images/pages/excel.jpg";
import SampleDownloadService from "@src/services/sampleDownload/sampleDownload";
import { EnumTemplateFileType } from "./constants";
import Swal from "sweetalert2";
import { downloadURL } from "../../../helper/downloadUrl";
import errorCodeConfig from "../../../configs/apiErrorCodeConfig";
import { toast } from "react-hot-toast";

/**
 * use this function to download sample file
 * @param {*} param0
 */
export const onSampleTemplateDownload = ({
  modelFor,
  setBlock,
  filename = "",
}) => {
  setBlock(true);
  const TemplateFileType = filename
    ? EnumTemplateFileType[modelFor][filename]
    : EnumTemplateFileType[modelFor];
  SampleDownloadService.getTemplateFile(TemplateFileType)
    .then((res) => {
      setBlock(false);
      if (
        res?.status == 200 &&
        res?.data?.status == errorCodeConfig.APIDefaultCode.Success
      ) {
        downloadURL(res.data.data);
      } else {
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

/**
 * use thi component for sample modal popup
 * @param {*} open: true or false
 * @param {*} onToggle: function for open or close modal
 * @param {*} modalFor: "GSTR1", "Purchase" or "IFF"
 * @returns
 */
const DownloadSampleModal = ({ open, onToggle, modelFor, setBlock }) => {
  const onDownloadClick = useCallback((filename) => {
    onSampleTemplateDownload({ filename, modelFor, setBlock });
  }, []);

  return (
    <Modal
      backdrop="static"
      isOpen={open}
      toggle={onToggle}
      className="modal-dialog-centered  modal-lg"
    >
      <div className="modal-header">
        <h2 className="modal-title w-100 text-center">Download Sample File</h2>
        <div className="modal-actions">
          <a onClick={onToggle} className="text-body">
            <X size={14} />
          </a>
        </div>
      </div>
      <ModalBody className="pb-2 pt-2">
        <div className="d-flex justify-content-center">
          <Col xl="3" md="3" sm="6" className="m-2">
            <div
              className="card p-2 text-center cursor-pointer"
              onClick={() => onDownloadClick("Government")}
            >
              <div>
                <img className="img-fluid w-25 m-auto" src={GovernmentLogo} />
              </div>
              <p style={{ fontWeight: "bold" }}> Government Excel</p>
            </div>
          </Col>

          {/* <Col xl="3" md="3" sm="6" className="m-2">
            <div className="card p-2 text-center cursor-pointer"
             onClick={() => onDownloadClick("Tally")}
            >
              <div>
                <img
                  className="img-fluid w-25 m-auto"
                  src={TallyLogo}
                />
              </div>
              <p style={{ fontWeight: "bold" }}> Tally Excel</p>
            </div>
          </Col> */}

          <Col xl="3" md="3" sm="6" className="m-2">
            <div className="card p-2 text-center cursor-pointer"
             onClick={() => onDownloadClick("Single")}
            >
              <div>
                <img
                  className="img-fluid w-25 m-auto"
                  src={ExcelLogo}
                />
              </div>
              <p style={{ fontWeight: "bold" }}> Single File Excel</p>
            </div>
          </Col>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default DownloadSampleModal;
