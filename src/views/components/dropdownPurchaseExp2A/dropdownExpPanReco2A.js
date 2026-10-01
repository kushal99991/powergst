// ** Reactstrap Imports
import { Button, UncontrolledButtonDropdown, Tooltip } from "reactstrap";
import React, { Fragment, useState } from "react";
import Swal from "sweetalert2";

import recoService from "../../../services/Reco/panRecoGSTR2AvsPurchase/index";
import toast from "react-hot-toast";
import errorCodeConfig from "../../../configs/apiErrorCodeConfig";
import { tokenExpiresRedirect } from "../../../utility/Utils";

// ** Third Party Components
import { saveAs } from "file-saver";

import { useHotkeys } from "react-hotkeys-hook";
import { keysMap, enableOnFormTags, API_URL } from "../../../configs/config";
import { downloadURL } from "../../../helper/downloadUrl";

const DropDownExpPanReco2A = ({
  clientId,
  finYear,
  finMonth,
  loadFunction,
  payload,
  IsDisableBtn,
}) => {
  const item = [{ id: "1", name: "Export Reco" }];

  const [tooltipOpen, setTooltipOpen] = useState(false);

  const [srcLoadSummary, setSrcLoadSummary] = useState(false);

  //** Shortcut keys
  useHotkeys(
    keysMap.EXPORT_DATA,
    () => IsDisableBtn == false && exportDataFunc(1),
    { enableOnFormTags }
  );

  const exportDataFunc = (btnId) => {
    if (btnId == "1") {
      // EXPORT SUMMARY
      loadFunction(true);

      recoService
        .exportRecoPan(payload)
        .then((res) => {
          if (
            res?.status == 200 &&
            res.data.status === errorCodeConfig.APIDefaultCode.Success
          ) {
            loadFunction(false);

            downloadURL(res.data.data);
          } else if (res.status == 401) {
            tokenExpiresRedirect();
          } else {
            loadFunction(false);

            toast.error(res.data.errorMessage, {
              position: "top-right",
            });
          }
        })
        .catch((error) => {
          loadFunction(false);

          Swal.fire({
            icon: "error",
            title: "",
            text: error?.message,
            customClass: {
              confirmButton: "btn btn-danger",
            },
            buttonsStyling: false,
          });
        });
    } else if (btnId == "2") {
      // EXPORT All Data
      // loadFunction(true);
      // purchaseInvoiceService2A.exportPurchaseExportData(clientId, finYear, finMonth).then(res => {
      //   console.log(res)
      //   if (res.headers.statuscode == errorCodeConfig.APIDefaultCode.Success) {
      //     loadFunction(false);
      //     var blob = new Blob([res.data], {
      //       type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      //     });
      //     saveAs(blob, res.headers["filedownloadname"]);
      //   } else {
      //     loadFunction(false);
      //     toast.error(res.headers.errormessage, {
      //       position: "top-right",
      //     });
      //   }
      // }).catch(error => {
      //   loadFunction(false);
      //   // toast.dismiss();
      //   console.log(error.message)
      //   Swal.fire({
      //     icon: 'error',
      //     title: '',
      //     text: error?.message,
      //   })
      // })
    }
  };

  return (
    <Fragment>
      <UncontrolledButtonDropdown>
        <Button
          color="danger"
          onClick={() => exportDataFunc(1)}
          className="btn-icon btn-round"
          id="arrow-down-export-button"
          outline
          disabled={IsDisableBtn}
        >
          <i className="fa fa-file-excel-o"></i> {"    "}
          Export
          <Tooltip
            placement="top"
            isOpen={tooltipOpen}
            target="arrow-down-export-button"
            toggle={() => setTooltipOpen(!tooltipOpen)}
          >
            Export [{keysMap.EXPORT_DATA}]
          </Tooltip>
        </Button>
      </UncontrolledButtonDropdown>
    </Fragment>
  );
};

export default DropDownExpPanReco2A;
