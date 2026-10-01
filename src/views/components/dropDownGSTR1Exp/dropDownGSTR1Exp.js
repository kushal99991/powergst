// ** Reactstrap Imports
import {
  Button,
  UncontrolledTooltip,
} from "reactstrap";
import Swal from "sweetalert2";
import React, { Fragment, useState } from "react";
import toast from "react-hot-toast";

// ** Third Party Components
import gstr1SummaryServices from "../../../services/gstr1/gstr1Services/gstr1SummaryServices";

import { useHotkeys } from "react-hotkeys-hook";
import { keysMap, enableOnFormTags } from "../../../configs/config";
import { tokenExpiresRedirect } from "../../../utility/Utils";

import { globleVariable } from "../../../configs/globalVariable";
import LocalFunction from "../../../configs/getLocalFunction";
import { downloadURL } from "../../../helper/downloadUrl";

const DropDownGSTR1Exp = ({
  clientId,
  finYear,
  finMonth,
  loadFunction,
  block,
  gstNumber,
  SubscriptionId
}) => {
  const item = [
    { id: "1", name: "Export Summary" },
    { id: "2", name: "Export Data" },
  ];

  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [srcLoad, setSrcLoad] = useState(false);
  const [srcLoadSummary, setSrcLoadSummary] = useState(false);

  const token = LocalFunction.getLocalValue(globleVariable.tokenKey, true);

  // ** shortcut keys
  // useHotkeys(keysMap.EXPORT_SUMMARY_DATA, () => {!block && exportDataFunc('1')}, { enableOnFormTags });
  useHotkeys(
    keysMap.EXPORT_ALL_DATA,
    () => {
      !block && exportDataFunc("2");
    },
    { enableOnFormTags }
  );

  // ** Export
  const exportDataFunc = async (btnId) => {
    console.log(btnId);
    if (btnId == "1") {
      // EXPORT SUMMARY
      loadFunction(true);
      gstr1SummaryServices
        .exportGSTR1Summary(clientId, finYear, finYear, token)
        .then((res) => {
          if (res?.status == 200) {
            loadFunction(false);

            downloadURL(res.data.data);
          } else if (res?.status == 401) {
            tokenExpiresRedirect();
          } else {
            loadFunction(false);

            toast.error(res.headers.errormessage, {
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
      loadFunction(true);

      gstr1SummaryServices
        .exportGSTR1ExportData(clientId, finYear, finYear, 0, token, gstNumber,SubscriptionId)
        .then((res) => {
          if (res?.status == 200) {
            loadFunction(false);
            downloadURL(res.data.data);
          } else if (res?.status == 401) {
            tokenExpiresRedirect();
          } else {
            loadFunction(false);
            toast.error(res.headers.errormessage, {
              position: "top-right",
            });
          }
        })
        .catch((error) => {
          loadFunction(false);
          setSrcLoad(false);
          setIUrl("");

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
    }
  };

  return (
    <Fragment>
      <Button
        type="button"
        outline
        onClick={() => exportDataFunc(2)}
        color="danger"
        id="btnexpSales"
        className="me-1"
        // disabled={btnDisable}
      >
        <i className="fa fa-file-excel-o"></i>
        <span className="align-middle ms-50">Export </span>
        <UncontrolledTooltip placement="top" target="btnexpSales">
          Export [{keysMap.EXPORT_ALL_DATA}]
        </UncontrolledTooltip>
      </Button>
    </Fragment>
  );
};

export default DropDownGSTR1Exp;
