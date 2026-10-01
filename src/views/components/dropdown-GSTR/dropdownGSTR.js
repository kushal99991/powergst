// ** Reactstrap Imports
import { Tooltip, Button, UncontrolledTooltip } from "reactstrap";
import React, { Fragment, useState, useEffect } from "react";
import Swal from "sweetalert2";

import Gstr2bService from "../../../services/gstr/gstr2bService";
import toast from "react-hot-toast";
import errorCodeConfig from "../../../configs/apiErrorCodeConfig";
// ** Third Party Components
import { tokenExpiresRedirect } from "../../../utility/Utils";
import { useHotkeys } from "react-hotkeys-hook";
import { keysMap, enableOnFormTags, API_URL } from "../../../configs/config";
import { globleVariable } from "../../../configs/globalVariable";
import { downloadURL } from "@helper/downloadUrl";
import { handleExportData } from "@store/layout";
import { useDispatch, useSelector } from "react-redux";

const DropDownGSTRSplit = ({
  item,
  clientId,
  finYear,
  finMonth,
  loadFunction,
  isLoading,
  token,
  subscriptionId,
  GstIn,
  userId,
}) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const dispatch = useDispatch();

  //** Shortcut keys
  // useHotkeys(keysMap.EXPORT_SUMMARY_DATA , () =>  { isLoading == false &&  exportDataFunc(1)}    , {enableOnFormTags}  );
  useHotkeys(
    keysMap.EXPORT_ALL_DATA,
    () => {
      isLoading == false && exportDataFunc(2);
    },
    { enableOnFormTags }
  );

  // ** Export
  const exportDataFunc = async (btnId) => {
    console.log(btnId);
    if (btnId == "1") {
      // EXPORT SUMMARY
      loadFunction(true);
      Gstr2bService.exportGstr2bSummary(
        clientId,
        sessionStorage.getItem(globleVariable.selectExportFromDt),
        sessionStorage.getItem(globleVariable.selectExportToDt)
      )
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
          console.log(error.message);
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
      Gstr2bService.exportGstr2bExportData(
        clientId,
        sessionStorage.getItem(globleVariable.selectExportFromDt),
        sessionStorage.getItem(globleVariable.selectExportToDt),
        subscriptionId,
        GstIn,
        userId
      )
        .then((res) => {
          if (
            res?.status == 200 &&
            res?.data?.status == errorCodeConfig.APIDefaultCode.Success
          ) {
            loadFunction(false);
            dispatch(handleExportData(true));
            downloadURL(res.data.data);
          } else if (res?.status == 401) {
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
    }
  };

  return (
    <Fragment>
      <Button
        type="button"
        outline
        onClick={() => exportDataFunc(2)}
        color="danger"
        id="btn2b"
        // disabled={btnDisable}
      >
        <i className="fa fa-file-excel-o"></i>
        <span className="align-middle ms-50">Export </span>
        <UncontrolledTooltip placement="top" target="btn2b">
          Export [{keysMap.EXPORT_ALL_DATA}]
        </UncontrolledTooltip>
      </Button>

      {/* Export List Old code   */}
      {/* <UncontrolledButtonDropdown >
        <DropdownToggle color='danger' className='btn-icon btn-round dropdown-toggle' id="arrow-down-export-button" outline   >
          <i className='fa fa-file-excel-o'  ></i>
          <span className='align-middle ms-50' >Export</span>
          <Tooltip
            placement='top'
            isOpen={tooltipOpen}
            target='arrow-down-export-button'
            toggle={() => setTooltipOpen(!tooltipOpen)}>
            Export
          </Tooltip>
        </DropdownToggle>
        <DropdownMenu tag='ul' end>
          {item?.map((itemdata, index) => (
            <DropdownItem tag='a' className='w-100'
              key={itemdata.id}
              onClick={() => exportDataFunc(itemdata.id)} >
              <i className='fa fa-file-excel-o'></i>
              <span className='align-middle ms-50'>{itemdata.name}</span>
            </DropdownItem> )
          )}
        </DropdownMenu>
      </UncontrolledButtonDropdown> */}
    </Fragment>
  );
};

export default DropDownGSTRSplit;
