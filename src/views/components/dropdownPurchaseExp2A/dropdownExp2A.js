// ** Reactstrap Imports
import {
  Button,
  Col,
  Nav,
  NavItem,
  NavLink,
  DropdownMenu,
  DropdownItem,
  BreadcrumbItem,
  DropdownToggle,
  UncontrolledButtonDropdown,
  Tooltip,
} from "reactstrap";
import React, { Fragment, useState } from "react";

import Swal from "sweetalert2";

import purchaseInvoiceService2A from "../../../services/Reco/Purchase2A/purchaseInvoiceService2A";
import toast from "react-hot-toast";
import errorCodeConfig from "../../../configs/apiErrorCodeConfig";
import moment from "moment";
// ** Third Party Components
import { saveAs } from "file-saver";

const DropDownExp = ({ clientId, finYear, finMonth, loadFunction }) => {
  const item = [
    { id: "1", name: "Export Summary" },
    { id: "2", name: "Export Data" },
  ];

  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [selectId, setSelectId] = useState(null);

  const handleClick = () => {
    const myPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() < 0.5) {
          resolve("foo");
        } else {
          reject("fox");
        }
      }, 1000);
    });

    return toast.promise(myPromise, {
      loading: "Loading",
      success: "Got the data",
      error: "Error when fetching",
    });
  };

  const exportDataFunc = (btnId) => {
    console.log(btnId);
    if (btnId == "1") {
      // EXPORT SUMMARY

      loadFunction(true);

      purchaseInvoiceService2A
        .exportPurchaseSummary(clientId, finYear, finMonth)
        .then((res) => {
          if (
            res.headers.statuscode == errorCodeConfig.APIDefaultCode.Success
          ) {
            loadFunction(false);
            var blob = new Blob([res.data], {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            saveAs(blob, res.headers["filedownloadname"]);

            // var blob = new Blob([res.data], {
            //   type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            // });
            // saveAs(blob, res.headers["filedownloadname"]);
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
          });
        });
    } else if (btnId == "2") {
      // EXPORT All Data

      loadFunction(true);

      purchaseInvoiceService2A
        .exportPurchaseExportData(clientId, finYear, finMonth)
        .then((res) => {
          if (
            res.headers.statuscode == errorCodeConfig.APIDefaultCode.Success
          ) {
            loadFunction(false);

            var blob = new Blob([res.data], {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            saveAs(blob, res.headers["filedownloadname"]);
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
          });
        });
    }
  };

  return (
    <Fragment>
      <UncontrolledButtonDropdown>
        <DropdownToggle
          color="danger"
          className="btn-icon btn-round dropdown-toggle"
          id="arrow-down-export-button"
          outline
        >
          {/* <ArrowUp size={14} /> */}
          <i className="fa fa-file-excel-o" /> Export
          <Tooltip
            placement="top"
            isOpen={tooltipOpen}
            target="arrow-down-export-button"
            toggle={() => setTooltipOpen(!tooltipOpen)}
          >
            Export
          </Tooltip>
        </DropdownToggle>
        <DropdownMenu tag="ul" end>
          {item?.map((itemdata, index) => (
            <DropdownItem
              tag="a"
              className="w-100"
              key={itemdata.id}
              onClick={() => exportDataFunc(itemdata.id)}
            >
              <i className="fa fa-file-excel-o" />
              <span className="align-middle ms-50">{itemdata.name}</span>
            </DropdownItem>
          ))}
        </DropdownMenu>
      </UncontrolledButtonDropdown>
    </Fragment>
  );
};

export default DropDownExp;
