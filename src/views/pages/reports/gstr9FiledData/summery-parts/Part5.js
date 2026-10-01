import { RowSize } from "@configs/config";
import { HotTable } from "@handsontable/react";
import React, { useState } from "react";
import { Accordion, AccordionBody, AccordionHeader, AccordionItem } from "reactstrap";

const part5Table10 = [
  {
    title: "",
    data: "SerialNumber",
    width: 35,
    readOnly: "true",
  },
  {
    title: "Description",
    data: "Description",
    readOnly: "true",
  },
  {
    title: "Taxable Value",
    data: "TaxableValue",
    type: "numeric",
    numericFormat: {
      pattern: "0.00",
    },
  },
  {
    title: "Integrated Tax",
    data: "IGST",
    type: "numeric",
    numericFormat: {
      pattern: "0.00",
    },
  },
  {
    title: "Central Tax",
    data: "CGST",
    type: "numeric",
    numericFormat: {
      pattern: "0.00",
    },
  },
  {
    title: "State/UT Tax",
    data: "SGST",
    type: "numeric",
    numericFormat: {
      pattern: "0.00",
    },
  },
  {
    title: "Cess",
    data: "Cess",
    type: "numeric",
    numericFormat: {
      pattern: "0.00",
    },
  },
  {
    title: "Notes",
    data: "Notes",
  },
];

const part5Table14 = [
  {
    title: "Description",
    data: "Description",
    readOnly: "true",
  },
  {
    title: "Tax Payable",
    data: "TaxPayable",
    type: "numeric",
    numericFormat: {
      pattern: "0.00",
    },
  },
  {
    title: "Tax Paid",
    data: "TaxPaid",
    type: "numeric",
    numericFormat: {
      pattern: "0.00",
    },
  },
  {
    title: "Notes",
    data: "Notes",
  },
];

const Part5 = ({ data, toggle }) => {
  const [open, setOpen] = useState(["1", "2"]);

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
                10, 11, 12 & 13. Details of the previous Financial Year's transactions reported in
                next Financial Year
              </h3>
              <div className="float-end col-md-3 text-end"></div>
            </AccordionHeader>
            <AccordionBody accordionId="1">
              <div className="d-grid mb-1 mb-lg-0">
                <HotTable
                  height="auto"
                  className="myRow"
                  rowHeights={RowSize}
                  readOnly={true}
                  cells={function (row, col) {
                    var cp = {};

                    // cp.className = "child";
                    if (col > 1) {
                      cp.className = "text-end";
                    }
                    if (row == 0 || row == 1 || row == 2 || row == 3) {
                      if (col == 0) {
                        cp.className = "boldRow";
                      }
                    }
                    if (row == 2 || row == 3) {
                      if (col == 2) {
                        cp.className = "purchseCellDisable text-end";
                      }
                    }
                    if (row == 4) {
                      if (col > 1 && col < 7) {
                        cp.className = "purchseCellDisable text-end";
                      }
                      if (col == 1) {
                        cp.className = "boldRow";
                      }
                    }

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
                  stretchH="all"
                  preventOverflow="horizontal"
                  columns={part5Table10}
                  data={data?.table10}
                  contextMenu={false}
                  bindRowsWithHeaders={true}
                  licenseKey="non-commercial-and-evaluation"
                  autoWrapRow={true}
                />
              </div>
            </AccordionBody>
          </AccordionItem>
        </div>

        <div className="mt-1 mb-1">
          {" "}
          <AccordionItem>
            <AccordionHeader targetId="2">
              <h3 className="gstr1Filing fw-bolder col-md-9 text-dark">
                14. Differential tax paid on account of declaration in table no. 10 & 11{" "}
              </h3>
              <div className="float-end col-md-3 text-end"></div>
            </AccordionHeader>
            <AccordionBody accordionId="2">
              <div className="d-grid mb-1 mb-lg-0">
                <HotTable
                  // afterGetColHeader={theaderLogSummaryData}
                  height="auto"
                  className="myRow"
                  rowHeights={RowSize}
                  cells={function (row, col) {
                    var cp = {};

                    // cp.className = "child";
                    if (col > 0) {
                      cp.className = "text-end";
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
                  stretchH="all"
                  preventOverflow="horizontal"
                  columns={part5Table14}
                  data={data?.table14}
                  contextMenu={false}
                  bindRowsWithHeaders={true}
                  licenseKey="non-commercial-and-evaluation"
                  autoWrapRow={true}
                  readOnly={true}
                />
              </div>
            </AccordionBody>
          </AccordionItem>
        </div>
      </Accordion>
    </div>
  );
};

export default Part5;
