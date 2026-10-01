import { RowSize } from "@configs/config";
import { HotTable } from "@handsontable/react";
import { textRenderer } from "handsontable/renderers";
import React, { useState } from "react";
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
} from "reactstrap";
import { columnHeaderSize } from "../../../../../configs/config";
import { formatINR } from "../../../../../helper/formatINRCurrency";

const table17Column = [
  {
    title: "S.no",
    data: "SerialNumber",
    width: 5,
  },
  {
    title: "Description",
    data: "Description",
    width: 30,
  },
  {
    title: "Taxable Value",
    data: "TaxableValue",
    width: 15,
  },
  {
    title: "CGST",
    data: "CGST",
    width: 15,
  },
  {
    title: "SGST",
    data: "SGST",
    width: 15,
  },
  {
    title: "IGST",
    data: "IGST",
    width: 15,
  },
  {
    title: "CESS",
    data: "CESS",
    width: 15,
  },
];

const initialTable17Data = [
  {
    serialNumber: "A",
    description: "5%",
    taxableValue: 0,
    igst: 0,
    cgst: 0,
    sgst: 0,
    cess: 0,
  },
  {
    serialNumber: "B",
    description: "12%",
    taxableValue: 0,
    igst: 0,
    cgst: 0,
    sgst: 0,
    cess: 0,
  },
  {
    serialNumber: "C",
    description: "18%",
    taxableValue: 0,
    igst: 0,
    cgst: 0,
    sgst: 0,
    cess: 0,
  },
  {
    serialNumber: "D",
    description: "28%",
    taxableValue: 0,
    igst: 0,
    cgst: 0,
    sgst: 0,
    cess: 0,
  },
  {
    serialNumber: "E",
    description: "3%",
    taxableValue: 0,
    igst: 0,
    cgst: 0,
    sgst: 0,
    cess: 0,
  },
  {
    serialNumber: "F",
    description: "0.25%",
    taxableValue: 0,
    igst: 0,
    cgst: 0,
    sgst: 0,
    cess: 0,
  },
  {
    serialNumber: "G",
    description: "0.10%",
    taxableValue: 0,
    igst: 0,
    cgst: 0,
    sgst: 0,
    cess: 0,
  },
  {
    serialNumber: "H",
    description: "Input tax credit",
    taxableValue: 0,
    igst: 0,
    cgst: 0,
    sgst: 0,
    cess: 0,
  },
  {
    serialNumber: "I",
    description: "Interest",
    taxableValue: 0,
    igst: 0,
    cgst: 0,
    sgst: 0,
    cess: 0,
  },
  {
    serialNumber: "J",
    description: "Late Fee",
    taxableValue: 0,
    igst: 0,
    cgst: 0,
    sgst: 0,
    cess: 0,
  },
  {
    serialNumber: "K",
    description: "Penalty",
    taxableValue: 0,
    igst: 0,
    cgst: 0,
    sgst: 0,
    cess: 0,
  },
  {
    serialNumber: "L",
    description:
      "Any other amount paid for supplies not included in annual return (GSTR9)",
    taxableValue: 0,
    igst: 0,
    cgst: 0,
    sgst: 0,
    cess: 0,
  },
  {
    serialNumber: "M",
    description: "Erroneous refund to be paid back",
    taxableValue: 0,
    igst: 0,
    cgst: 0,
    sgst: 0,
    cess: 0,
  },
  {
    serialNumber: "N",
    description: "Outstanding demands to be settled",
    taxableValue: 0,
    igst: 0,
    cgst: 0,
    sgst: 0,
    cess: 0,
  },
  {
    serialNumber: "O",
    description: "Others",
    taxableValue: 0,
    igst: 0,
    cgst: 0,
    sgst: 0,
    cess: 0,
  },
];

const Part5 = ({ data, toggle }) => {
  const [open, setOpen] = useState(["1"]);

      // *** with round
      function formatRender(instance, td, row, col, prop, value, cellProperties) {
        textRenderer.apply(this, arguments);
          let currnecyVal = formatINR(Number(value));
  
          if (currnecyVal !== 0) {
            td.innerText = currnecyVal;
          }
  
      }

  return (
    <div>
      <Accordion
        className="accordion-border"
        open={open}
        toggle={(id) => toggle(id, setOpen, open)}
      >
        <AccordionItem>
          <AccordionHeader targetId="1">
            <h3 className="gstr1Filing fw-bolder col-md-9 text-dark">
              17. Auditor's recommendation on additional Liability due to
              non-reconciliation
            </h3>
          </AccordionHeader>
          <AccordionBody accordionId="1">
            <HotTable
              height="auto"
              className="myRow"
              columns={table17Column}
              data={JSON.parse(JSON.stringify(data?.table17 ?? []))}
              stretchH="all"
              preventOverflow="horizontal"
              rowHeights={RowSize}
              readOnly={true}
              columnHeaderHeight={columnHeaderSize}
              afterGetColHeader={(col, TH) => {
                if (col == 0 || col == 1) {
                  TH.className = "htLeft";
                } else {
                  TH.className = "htRight";
                }
              }}
              cells={function (row, col) {
                var cp = {};
                if (col >= 2) {
                  cp.className = "text-end";
                  cp.renderer = formatRender;

                }

                if (col < 2) {
                  cp.readOnly = true;
                }

                // if (col == 3 && row >= 6) {
                //   cp.className = "purchseCellDisable text-end boldRow";
                // }

                if (cp?.className?.includes("purchseCellDisable")) {
                  cp.readOnly = true;
                }

                return cp;
              }}
              beforeCreateRow={function (index, amount) {
                let countRow = this?.countRows();
                if (this?.isEmptyRow(countRow - 0)) {
                  return false;
                }
                return true;
              }}
              contextMenu={false}
              bindRowsWithHeaders={true}
              licenseKey="non-commercial-and-evaluation"
              autoWrapRow={true}
            />
          </AccordionBody>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Part5;
