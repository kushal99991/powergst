// ** Reactstrap Imports
import {
  UncontrolledButtonDropdown,
  Tooltip,
  Button,
  UncontrolledTooltip,
} from "reactstrap";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import React, { Fragment, useState } from "react";

// ** Third Party Components
import { useHotkeys } from "react-hotkeys-hook";
import {
  keysMap,
  enableOnFormTags,
} from "../../../configs/config";
import GSTR1FiledExpDataModel from "../models/GSTR1FiledExpDataModel";
import gstr1FileDataSummaryServices from "../../../services/gstr1/gstr1DataFileService/gstr1SummaryServices";

import { globleVariable } from "../../../configs/globalVariable";
import LocalFunction from "../../../configs/getLocalFunction";
import { downloadURL } from "../../../helper/downloadUrl";

const DropDownGSTR1FiledExp = ({
  clientId,
  finYear,
  finMonth,
  loadFunction,
  block,
}) => {
  const item = [
    { id: "1", name: "Export Summary" },
    { id: "2", name: "Export Data" },
  ];

  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [srcLoad, setSrcLoad] = useState(false);
  const [srcLoadSummary, setSrcLoadSummary] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [finFromYear, setFinFormYear] = useState(null);
  const [monthFrom, setMonthFrom] = useState(null);

  const token = LocalFunction.getLocalValue(globleVariable.tokenKey, true);

  // ** filedDatamodel
  const [filedDataModalshow, setFiledDataModalshow] = useState(false);

  // ** toggle Compose
  const toggleCompose = () => setFiledDataModalshow(!filedDataModalshow);

  //shortcut keys
  useHotkeys(
    keysMap.EXPORT_SUMMARY_DATA,
    () => {
      !block && setFiledDataModalshow(true);
    },
    { enableOnFormTags }
  );
  useHotkeys(keysMap.EXPORT_ALL_DATA, () => {}, { enableOnFormTags });

  // ** Export
  const exportDataFunc = async (btnId) => {
    if (btnId == "1") {
      // EXPORT SUMMARY
      loadFunction(true);
      gstr1FileDataSummaryServices
        .exportGSTR1Summary(clientId, finYear, finMonth, token)
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
      // EXPORT SUMMARY
      setFiledDataModalshow(!filedDataModalshow);
    }
  };
  return (
    <Fragment>
      <UncontrolledButtonDropdown>
        <Button
          type="button"
          className="me-1"
          outline
          onClick={() => exportDataFunc(2)}
          color="danger"
          id="exportdata"
        >
          <i className="fa fa-file-excel-o"></i> Export
        </Button>
        <UncontrolledTooltip placement="top" target="exportdata">
          Export [{keysMap.EXPORT_SUMMARY_DATA}]
        </UncontrolledTooltip>
      </UncontrolledButtonDropdown>

      {filedDataModalshow && (
        <GSTR1FiledExpDataModel
          Heading="Export GSTR1 Filed"
          SuccessButtonText="Open"
          show={filedDataModalshow}
          toggleCompose={toggleCompose}
          srcLoad={srcLoad}
          setSrcLoad={setSrcLoad}
          fromDate={fromDate}
          setFromDate={setFromDate}
          toDate={toDate}
          setToDate={setToDate}
          finFromYear={finFromYear}
          setFinFormYear={setFinFormYear}
          monthFrom={monthFrom}
          setMonthFrom={setMonthFrom}
        ></GSTR1FiledExpDataModel>
      )}
    </Fragment>
  );
};

export default DropDownGSTR1FiledExp;
