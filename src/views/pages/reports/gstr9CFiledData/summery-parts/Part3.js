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
import Footer from "../../../gstr9c/footer";
import {
  loadCellForReasonTable,
  loadHeaderForReasonTable,
} from "../../../gstr9c/helper";
import UnReconciledModal from "../../../gstr9c/preparePartA/UnReconciledModal";

const table9Column = [
  {
    title: "S.no",
    data: "SerialNumber",
    width: 5,
  },
  {
    title: "Description",
    data: "Description",
    width: 20,
  },
  {
    title: "",
    data: "Operator",
    width: 5,
  },
  {
    title: "Taxable Value (₹)",
    data: "TaxableValue",
    width: 10,
  },
  {
    title: "Tax Amount (₹)",
    data: "CGST",
    width: 15,
  },
  {
    title: "Tax Amount (₹)",
    data: "SGST",
    width: 15,
  },
  {
    title: "Tax Amount (₹)",
    data: "IGST",
    width: 15,
  },
  {
    title: "Tax Amount (₹)",
    data: "CESS",
    width: 15,
  },
];

const table10Column = [
  {
    title: "Action",
    data: "action",
    width: 50,
  },
  {
    title: "No of Reason",
    data: "noOfReason",
    width: 50,
  },
];

const table11Column = [
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
    title: "Taxable Value (₹)",
    data: "TaxableValue",
    width: 20,
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

const Part3 = ({ data, toggle }) => {
  const [open, setOpen] = useState(["1", "2", "3"]);

  const [table10Modal, setTable10Modal] = useState(false);

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
        <div className="mb-1">
          <AccordionItem>
            <AccordionHeader targetId="1">
              <h3 className="gstr1Filing fw-bolder col-md-9 text-dark">
                9. Reconciliation of rate wise liability and amount payable
                thereon{" "}
              </h3>
            </AccordionHeader>
            <AccordionBody accordionId="1">
              <HotTable
                height="auto"
                className="myRow"
                columns={table9Column}
                data={JSON.parse(JSON.stringify(data?.table9?? []))}
                nestedHeaders={[
                  [
                    { label: "S.no" },
                    { label: "Description" },
                    { label: "" },
                    { label: "Taxable Value (₹)" },
                    { label: "Tax Amount (₹)", colspan: 4 },
                  ],
                  [
                    { label: "" },
                    { label: "" },
                    { label: "" },
                    { label: "" },
                    { label: "CGST" },
                    { label: "SGST" },
                    { label: "IGST" },
                    { label: "CESS" },
                  ],
                ]}
                stretchH="all"
                preventOverflow="horizontal"
                rowHeights={RowSize}
                columnHeaderHeight={columnHeaderSize}
                afterGetColHeader={(col, TH) => {
                  if (col == 0 || col == 1) {
                    TH.className = "htLeft";
                  } else {
                    TH.className = "htCenter";
                  }
                }}
                cells={function (row, col) {
                  var cp = {};
                  if (col == 2) {
                    cp.className = "text-center";
                    cp.readOnly = true;
                  }

                  if (col > 2) {
                    cp.className = "text-end";
                  }

                  if (col < 2) {
                    cp.readOnly = true;
                  }

                  if (
                    (col > 2 && (row == 15 || row == 17)) ||
                    (col == 3 && row == 16) ||
                    (col == 3 && row >= 11 && row <= 14)
                  ) {
                    cp.className = "purchseCellDisable text-end boldRow";
                  }

                  if (cp?.className?.includes("purchseCellDisable")) {
                    cp.readOnly = true;
                  }

                  if (col > 2) {
                    cp.renderer = formatRender;
                  }

                  return cp;
                }}
                readOnly={true}
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
        </div>
        <div className="mt-1 mb-1">
          <AccordionItem>
            <AccordionHeader targetId="2">
              <h3 className="gstr1Filing fw-bolder col-md-9 text-dark">
                10. Reasons for un-reconciled payment of amount{" "}
              </h3>
            </AccordionHeader>
            <AccordionBody accordionId="2">
              <HotTable
                height="auto"
                className="myRow"
                columns={table10Column}
                data={[
                  {
                    action: "View/Add reasons",
                    noOfReason: data?.table10?.length ?? 0,
                  },
                ]}
                stretchH="all"
                preventOverflow="horizontal"
                rowHeights={RowSize}
                columnHeaderHeight={columnHeaderSize}
                afterGetColHeader={loadHeaderForReasonTable}
                cells={loadCellForReasonTable}
                afterOnCellMouseDown={(event, coords, td) => {
                  if (coords?.col === 0) {
                    setTable10Modal(true);
                  }
                }}
                readOnly={true}
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
        </div>
        <div className="mt-1 mb-1">
          <AccordionItem>
            <AccordionHeader targetId="3">
              <h3 className="gstr1Filing fw-bolder col-md-9 text-dark">
                11. Additional amount payable but not paid (due to reasons
                specified under Tables 6,8 and 10 above){" "}
              </h3>
            </AccordionHeader>
            <AccordionBody accordionId="3">
              <HotTable
                height="auto"
                className="myRow"
                columns={table11Column}
                data={JSON.parse(JSON.stringify(data?.table11?? []))}
                stretchH="all"
                preventOverflow="horizontal"
                rowHeights={RowSize}
                columnHeaderHeight={columnHeaderSize}
                readOnly={true}
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
                  }

                  if (col < 2) {
                    cp.readOnly = true;
                  }

                  if (col == 2 && row >= 6) {
                    cp.className = "purchseCellDisable text-end boldRow";
                  }

                  if (cp?.className?.includes("purchseCellDisable")) {
                    cp.readOnly = true;
                  }

                  if (col >= 2) {
                    cp.renderer = formatRender;
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
        </div>
      </Accordion>
      {table10Modal ? (
        <UnReconciledModal
          open={table10Modal}
          data={
            data?.table10 ? data.table10.map((item) => ({ reason: item })) : []
          }
          onToggle={() => setTable10Modal(false)}
          readOnly={true}
          title={"10. Reasons for un-reconciled payment of amount"}
        />
      ) : null}
    </div>
  );
};

export default Part3;
