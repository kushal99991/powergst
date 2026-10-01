import { columnHeaderSize, RowSize } from "@configs/config";
import LocalFunction from "@configs/getLocalFunction";
import SessionFunction from "@configs/getSessionFunction";
import { globleVariable } from "@configs/globalVariable";
import HotTable from "@handsontable/react";
import Handsontable from "handsontable";
import { registerAllModules } from "handsontable/registry";
import React, { Fragment, useState } from "react";
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
} from "reactstrap";

registerAllModules();

const tableColumn = [
  {
    title: "S.no",
    data: "SerialNumber",
    width: 5,
  },
  {
    title: "Particulars",
    data: "Particulars",
    width: 45,
  },
  {
    title: "Details",
    data: "Details",
    width: 45,
  },
];

const Part1 = ({ data, toggle }) => {
  const [open, setOpen] = useState(["1"]);

  console.log("COMING", data)

  let GTradeName =
    sessionStorage.getItem(globleVariable.G_TradeName) &&
    SessionFunction.getSessionValue(globleVariable.G_TradeName, true);
  const companyName =
    sessionStorage.getItem(globleVariable.G_Name) &&
    SessionFunction.getSessionValue(globleVariable.G_Name, true);
  let GFY =
    sessionStorage.getItem(globleVariable.G_FY) &&
    SessionFunction.getSessionValue(globleVariable.G_FY, true);
  const G_GSTIN =
    sessionStorage.getItem(globleVariable.G_GSTIN) &&
    SessionFunction.getSessionValue(globleVariable.G_GSTIN, true);
  const userDatadecrypt = LocalFunction.getLocalValue(
    globleVariable.userData,
    true
  );
  const userData = userDatadecrypt && JSON.parse(userDatadecrypt);
  const finYearOption = userData && userData.data.rangeFiltersGSTR9C;
  const finYear = finYearOption?.filter((p) => p.value == GFY)[0]?.label;

  const initialTableData = [
    {
      SerialNumber: "1",
      Particulars: "Financial Year",
      Details: finYear|| finYearOption[0].label,
    },
    {
      SerialNumber: "2",
      Particulars: "GSTIN",
      Details: G_GSTIN,
    },
    {
      SerialNumber: "3A",
      Particulars: "Legal Name",
      Details: companyName,
    },
    {
      SerialNumber: "3A",
      Particulars: "Trade Name(if Any)",
      Details: GTradeName,
    },
    {
      SerialNumber: "4",
      Particulars: "Name of the act if you are liable to audit under any act*",
      Details: "",
    },
  ];

  const theader = (col, TH) => {
    TH.className = "htLeft";
  };

  return (
    <Fragment>
      <Accordion
        className="accordion-border"
        open={open}
        toggle={(id) => toggle(id, setOpen, open)}
      >
        <AccordionItem>
          <AccordionHeader targetId="1">
            <h3 className="gstr1Filing fw-bolder col-md-9 text-dark">
              1. Basic details
            </h3>
          </AccordionHeader>
          <AccordionBody accordionId="1">
            <HotTable
              className="myRow"
              rowHeights={RowSize}
              width={"80%"}
              columnHeaderHeight={columnHeaderSize}
              data={data?.table1 ?? initialTableData}
              columns={tableColumn}
              beforeCreateRow={function (index, amount) {
                let countRow = this?.countRows();
                if (this?.isEmptyRow(countRow - 0)) {
                  return false;
                }
                return true;
              }}
              cells={function (row, col) {
                var cp = {};
                if (col == 2) {
                  cp.className = "text-start";
                }

                if (col < 2 || row < 4) {
                  cp.readOnly = true;
                }

                if (cp?.className?.includes("purchseCellDisable")) {
                  cp.readOnly = true;
                }

                return cp;
              }}
              readOnly={true}
              afterGetColHeader={theader}
              stretchH="all"
              height="auto"
              selectionMode={"single"}
              licenseKey="non-commercial-and-evaluation"
              colWidths={[4, 15, null]}
            />
          </AccordionBody>
        </AccordionItem>
      </Accordion>
    </Fragment>
  );
};

export default Part1;
