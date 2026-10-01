// ** Reactstrap Imports
import { Button, UncontrolledTooltip } from "reactstrap";
import Swal from "sweetalert2";
import React, { Fragment, useState } from "react";
import toast from "react-hot-toast";

// ** Third Party Components
import GSTR3bService from "../../../services/gstr3b/gstr3bService";

import { useHotkeys } from "react-hotkeys-hook";
import { keysMap, enableOnFormTags, messageShowDuration } from "../../../configs/config";
import { tokenExpiresRedirect } from "../../../utility/Utils";

import { globleVariable } from "../../../configs/globalVariable";
import LocalFunction from "../../../configs/getLocalFunction";
import SessionFunction from "../../../configs/getSessionFunction";
import { downloadURL } from "../../../helper/downloadUrl";
import errorCodeConfig from "../../../configs/apiErrorCodeConfig";

const ExportButtonGSTR3BComponent = ({
  clientId,
  finYear,
  finMonth,
  loadFunction,
  data,
}) => {

  const [block, setBlock] = useState(false);
  const token = LocalFunction.getLocalValue(globleVariable.tokenKey, true);


  const G_UCParId =
    sessionStorage.getItem(globleVariable.G_UCParId) &&
    SessionFunction.getSessionValue(globleVariable.G_UCParId, true);

  const G_GSTIN = SessionFunction.getSessionValue(globleVariable.G_GSTIN, true);


  //shortcut keys
  useHotkeys(keysMap.EXPORT_ALL_DATA, () => exportButtonGSTR3b(), {
    enableOnFormTags,
  });


  // ** Export
  const exportButtonGSTR3b = () => {
    loadFunction(true);
    GSTR3bService.gstr3bSaveExportDataAPI(clientId, finMonth, finMonth, token)
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


  //** Export Json */
  const exportJsonButtonGSTR3b = () => {
    const payLoad = {
      userClientId: G_UCParId,
      userId: LocalFunction.getLocalValue(globleVariable.userId, true),
      returnPeriod: sessionStorage.getItem("gstr3bDownloadFromDt"),
      loggedGSTIN: G_GSTIN,
      isNilReturn: true
    };
    setBlock(true);
    console.log(payLoad, "payLoadpayLoadpayLoadpayLoad");
    GSTR3bService.Gstr3bExportJson(payLoad)
      .then((res) => {
        setBlock(false);

        if (
          res?.status === 200 &&
          res.data.status === errorCodeConfig.APIDefaultCode.Success
        ) {

          downloadURL(res?.data?.data);

          console.log(res?.data.data, "url");
          // toast.success(res.data.successMessage, {
          //   position: "top-right",
          // });
        } else {
          setBlock(false);
          Swal.fire({
            icon: "error",
            title: "",
            text: res?.data?.errorMessage,
            customClass: {
              confirmButton: "btn btn-danger",
            },
            buttonsStyling: false,
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
            confirmButton: "btn btn-danger",
          },
          buttonsStyling: false,
        });
      });
  };

  return (
    <Fragment>
      {block && <div className="loading1">Loading&#8230;</div>}
      {/* Export Button  */}
      <Button
        id="exportBtnGSTR3b"
        onClick={exportButtonGSTR3b}
        className="btn-icon btn-round dropdown-toggle me-1"
        outline
        color="danger"
      >
        {" "}
        <i className="fa fa-file-excel-o"></i>&nbsp; Export{" "}
      </Button>
      <UncontrolledTooltip placement="top" target="exportBtnGSTR3b">
        Export [{keysMap.EXPORT_ALL_DATA}]
      </UncontrolledTooltip>


      {/* Export JSON Button  */}
      <Button
        id="exportjsonBtnGSTR3b"
        onClick={exportJsonButtonGSTR3b}
        className="btn-icon btn-round dropdown-toggle"
        outline
        color="danger"
      >
        {" "}
        <i className="fa fa-file-code-o"></i>&nbsp; Export JSON{" "}
      </Button>
      <UncontrolledTooltip placement="top" target="exportjsonBtnGSTR3b">
        Export JSON
      </UncontrolledTooltip>
    </Fragment>
  );
};

export default ExportButtonGSTR3BComponent;
