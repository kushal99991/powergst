// ** Reactstrap Imports
import {
  Button,
  UncontrolledTooltip,
} from "reactstrap";
import Swal from "sweetalert2";
import React, { Fragment, useState } from "react";
import toast from "react-hot-toast";
import errorCodeConfig from "../../../configs/apiErrorCodeConfig";
import { useDispatch } from "react-redux";

// ** Third Party Components
import GSTR3bService from "../../../services/gstr3bFiled/gstr3bFiledService";

import { useHotkeys } from "react-hotkeys-hook";
import { keysMap, enableOnFormTags } from "../../../configs/config";
import { tokenExpiresRedirect } from "../../../utility/Utils";

import { globleVariable } from "../../../configs/globalVariable";
import LocalFunction from "../../../configs/getLocalFunction";
import { downloadURL } from "../../../helper/downloadUrl";
import SessionFunction from "../../../configs/getSessionFunction";

const ExportButtonGSTR3BFileData = ({
  clientId,
  finYear,
  finMonth,
  loadFunction,
  GGSTIN,
  userIds,
  subId,
  handleExportData,
  setWizardBtn,
  stepper,
}) => {
  const dispatch = useDispatch();

  // const gstr3BFiledFromDt =
  //   sessionStorage.getItem(globleVariable.gstr3BFiledFromDt) &&
  //   SessionFunction.getSessionValue(globleVariable.gstr3BFiledFromDt, true);
  // const gstr3BFiledToDt =
  //   sessionStorage.getItem(globleVariable.gstr3BFiledToDt) &&
  //   SessionFunction.getSessionValue(globleVariable.gstr3BFiledToDt, true);

  const [srcLoadSummary, setSrcLoadSummary] = useState(false);
  const token = LocalFunction.getLocalValue(globleVariable.tokenKey, true);

  //shortcut keys
  useHotkeys(keysMap.EXPORT_ALL_DATA, () => exportButtonGSTR3b(), {
    enableOnFormTags,
  });
  // ** Export
  const exportButtonGSTR3b = () => {
    loadFunction(true);

    GSTR3bService.gstr3bSaveExportFileDataAPI(
      clientId,
      finYear,
      finMonth,
      subId,
      GGSTIN,
      userIds,
      token
    )
      .then((res) => {
        if (res.status == 200) {
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
  };
  return (
    <Fragment>
      <UncontrolledTooltip placement="top" target="exportBtnGSTR3bFile">
        Export [{keysMap.EXPORT_ALL_DATA} ]
      </UncontrolledTooltip>
      <Button
        id="exportBtnGSTR3bFile"
        onClick={exportButtonGSTR3b}
        className="btn-icon btn-round dropdown-toggle"
        outline
        color="danger"
      >
        {" "}
        <i className="fa fa-file-excel-o"></i> Export [{keysMap.EXPORT_ALL_DATA}{" "}
        ]{" "}
      </Button>
    </Fragment>
  );
};

export default ExportButtonGSTR3BFileData;
