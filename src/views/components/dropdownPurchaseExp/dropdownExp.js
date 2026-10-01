// ** Reactstrap Imports
import {
  Button,
  UncontrolledTooltip,
} from "reactstrap";
import Swal from "sweetalert2";
import React, { Fragment, useState } from "react";

import Gstr2bService from "../../../services/gstr/gstr2bService";
import toast from "react-hot-toast";
import errorCodeConfig from "../../../configs/apiErrorCodeConfig";

import { useHotkeys } from "react-hotkeys-hook";
import { keysMap, enableOnFormTags } from "../../../configs/config";
import { tokenExpiresRedirect } from "../../../utility/Utils";
import { downloadURL } from "@helper/downloadUrl";
import { globleVariable } from "../../../configs/globalVariable";
import LocalFunction from "../../../configs/getLocalFunction";
import SessionFunction from "../../../configs/getSessionFunction";

const DropDownExp = ({
  clientId,
  finYear,
  finMonth,
  gstNumber,
  SubscriptionId,
  loadFunction,
  isloading,
  
  token,
}) => {
  const item = [
    { id: "1", name: `Export Summary [${keysMap.EXPORT_SUMMARY_DATA}]` },
    { id: "2", name: `Export Data [${keysMap.EXPORT_ALL_DATA}]` },
  ];

  const subId =
  localStorage.getItem(globleVariable.subscriptionId) &&
  LocalFunction.getLocalValue(globleVariable.subscriptionId, true);
  const G_GSTIN = SessionFunction.getSessionValue(globleVariable.G_GSTIN, true);

  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [selectId, setSelectId] = useState(null);

  const [srcLoad, setSrcLoad] = useState(false);
  const [srcLoadSummary, setSrcLoadSummary] = useState(false);

  //** Shortcut keys
  // useHotkeys(keysMap.EXPORT_SUMMARY_DATA , () =>  { isloading == false &&  exportDataFunc(1) }   , {enableOnFormTags});
  useHotkeys(
    keysMap.EXPORT_ALL_DATA,
    () => {
      isloading == false && exportDataFunc(2);
    },
    { enableOnFormTags }
  );

  const exportDataFunc = (btnId) => {
    console.log(btnId);
    if (btnId == "1") {
      // EXPORT SUMMARY
      loadFunction(true);
      Gstr2bService.exportPurchaseSummary(clientId, finYear, finMonth,subId,G_GSTIN)
        .then((res) => {
          if (res.status == 200) {
            loadFunction(false);
            downloadURL(res.data.data);
          } else if (res.status == 401) {
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
          // setSrcLoadSummary(false);
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
    } else if (btnId == "2") {
      // EXPORT All Data

      loadFunction(true);

      Gstr2bService.exportPurchaseExportData(clientId, finYear, finMonth,gstNumber,SubscriptionId)
        .then((res) => {
          console.log(res);

          if (res.status == 200) {
            loadFunction(false);
            downloadURL(res.data.data);
          } else if (res.status == 401) {
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

export default DropDownExp;
