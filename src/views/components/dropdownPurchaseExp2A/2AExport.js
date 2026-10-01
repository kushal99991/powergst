// ** Reactstrap Imports
import {
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledButtonDropdown,
  Tooltip,
  Button,
} from "reactstrap";
import Swal from "sweetalert2";
import React, { Fragment, useState } from "react";
import Gstr2bService from "../../../services/gstr/gstr2bService";
import toast from "react-hot-toast";
import errorCodeConfig from "../../../configs/apiErrorCodeConfig";

// ** Third Party Components
import purchaseInvoiceService2A from "../../../services/Reco/Purchase2A/purchaseInvoiceService2A";
import { useHotkeys } from "react-hotkeys-hook";
import { keysMap, enableOnFormTags } from "../../../configs/config";
import { tokenExpiresRedirect } from "../../../utility/Utils";
//** Decrypt Data
import { globleVariable } from "../../../configs/globalVariable";
import LocalFunction from "../../../configs/getLocalFunction";
import { downloadURL } from "../../../helper/downloadUrl";

const DropDown2AExp = ({
  clientId,
  finYear,
  finMonth,
  loadFunction,
  sectionId,
  subscriptionId,
  gstNumber,
  userId,
  setExportType,
}) => {
  const accessToken = LocalFunction.getLocalValue(
    globleVariable.tokenKey,
    true
  );

  const item = [
    { id: "1", name: "Export Summary" },
    { id: "2", name: "Export Data" },
  ];

  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [srcLoad, setSrcLoad] = useState(false);
  const [srcLoadSummary, setSrcLoadSummary] = useState(false);

  //** shortcut keys
  // useHotkeys(keysMap.EXPORT_SUMMARY_DATA, () => exportDataFunc('1'), { enableOnFormTags });
  // useHotkeys(keysMap.EXPORT_ALL_DATA, () => exportDataFunc('2'), { enableOnFormTags });
  useHotkeys(keysMap.EXPORT_DATA, () => exportDataFunc("2"), {
    enableOnFormTags,
  });

  // ** Export
  const exportDataFunc = async (btnId) => {
    console.log(btnId);
    if (btnId == "1") {
      // EXPORT SUMMARY
      loadFunction(true);
      purchaseInvoiceService2A
        .exportPurchaseSummary(clientId, finYear, finMonth)
        .then((res) => {
          if (res?.status == 200) {
            setExportType(true);
            loadFunction(false);

            downloadURL(res.data.data);
          } else if (res?.status == 401) {
            tokenExpiresRedirect();
            setExportType(true);
          } else {
            loadFunction(false);
            setExportType(true);

            toast.error(res.headers.errormessage, {
              position: "top-right",
            });
          }
        })
        .catch((error) => {
          loadFunction(false);

          setExportType(true);

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

      purchaseInvoiceService2A
        .exportPurchaseExportData(
          clientId,
          finYear,
          finMonth,
          sectionId,
          subscriptionId,
          gstNumber,
          userId
        )
        .then((res) => {
          if (
            res?.status == 200 &&
            res?.data?.status == errorCodeConfig.APIDefaultCode.Success
          ) {
            loadFunction(false);
            setExportType(true);

            downloadURL(res.data.data);
          } else if (res?.status == 401) {
            setExportType(true);
            tokenExpiresRedirect();
          } else {
            loadFunction(false);
            setExportType(true);

            toast.error(res?.data?.errorMessage, {
              position: "top-right",
            });
          }
        })
        .catch((error) => {
          loadFunction(false);
          setSrcLoad(false);
          setIUrl("");
          setExportType(true);
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
      <UncontrolledButtonDropdown onClick={() => exportDataFunc(2)}>
        <DropdownToggle
          color="danger"
          className="btn-icon btn-round dropdown-toggle"
          id="arrowdownexportbutton"
          outline
        >
          <i className="fa fa-file-excel-o"></i>
          <span className="align-middle ms-50">Export </span>
          <Tooltip
            placement="top"
            isOpen={tooltipOpen}
            target="arrowdownexportbutton"
            toggle={() => setTooltipOpen(!tooltipOpen)}
          >
            {" "}
            Export [{keysMap.EXPORT_DATA}]
          </Tooltip>
        </DropdownToggle>
      </UncontrolledButtonDropdown>
    </Fragment>
  );
};

export default DropDown2AExp;
