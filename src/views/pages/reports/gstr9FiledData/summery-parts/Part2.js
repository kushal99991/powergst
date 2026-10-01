import { columnHeaderSize, RowSize } from "@configs/config";
import { HotTable } from "@handsontable/react";
import React, { useState } from "react";
import { Accordion, AccordionBody, AccordionHeader, AccordionItem } from "reactstrap";

const table4Column = [
  {
    title: "",
    data: "SerialNumber",
    width: 35,
  },
  {
    title: "Nature of Supplies",
    data: "NatureOfSupplies",
    readOnly: true,
  },
  {
    title: "Taxable Value",
    data: "TaxableValue",
    type: "numeric",
    numericFormat: {
      pattern: "0,0.00",
      culture: "en-IN",
    },
  },
  {
    title: "Integrated Tax",
    data: "IGST",
    type: "numeric",
    numericFormat: {
      pattern: "0,0.00",
      culture: "en-IN",
    },
  },
  {
    title: "Central Tax",
    data: "CGST",
    type: "numeric",
    numericFormat: {
      pattern: "0,0.00",
      culture: "en-IN",
    },
  },
  {
    title: "State/UT Tax",
    data: "SGST",
    type: "numeric",
    numericFormat: {
      pattern: "0,0.00",
      culture: "en-IN",
    },
  },
  {
    title: "Cess",
    data: "Cess",
    type: "numeric",
    numericFormat: {
      pattern: "0,0.00",
      culture: "en-IN",
    },
  },
  {
    title: "Notes",
    data: "Notes",
  },
];

const table5Column = [
  {
    title: "",
    data: "SerialNumber",
    // readOnly: true,
    // width: 35
  },
  {
    title: "Nature of Supplies",
    data: "NatureOfSupplies",
    width: "270px",
    // readOnly: "true",
  },
  {
    title: "Taxable Value (₹)",
    data: "TaxableValue",
    type: "numeric",
    numericFormat: {
      pattern: "0,0.00",
      culture: "en-IN",
    },
  },
  {
    title: "Integrated Tax (₹)",
    data: "IGST",
    type: "numeric",
    numericFormat: {
      pattern: "0,0.00",
      culture: "en-IN",
    },
  },
  {
    title: "Central Tax (₹)",
    data: "CGST",
    type: "numeric",
    numericFormat: {
      pattern: "0,0.00",
      culture: "en-IN",
    },
  },
  {
    title: "State/UT Tax (₹)",
    data: "SGST",
    type: "numeric",
    numericFormat: {
      pattern: "0,0.00",
      culture: "en-IN",
    },
  },
  {
    title: "Cess (₹)",
    data: "Cess",
    type: "numeric",
    numericFormat: {
      pattern: "0,0.00",
      culture: "en-IN",
    },
  },
  {
    title: "Notes",
    data: "Notes",
  },
];

const Part2 = ({ data, toggle }) => {
  const [open, setOpen] = useState(["1", "2"]);

  return (
    <div>
      <Accordion
        className="accordion-border"
        open={open}
        toggle={(id) => toggle(id, setOpen, open)}
      >
        {/* Part-2  Table-4*/}
        <div className="mb-1">
          <AccordionItem>
            <AccordionHeader targetId="1">
              <h3 className="gstr1Filing fw-bolder col-md-9 text-dark">
                4. Details of advances, inward and outward supplies made during the financial year
                on which tax is payable{" "}
              </h3>
              <div className="float-end col-md-3 text-end"></div>
            </AccordionHeader>
            <AccordionBody accordionId="1">
              {data?.table4?.length > 0 ? (
                <HotTable
                  height="auto"
                  className="myRow"
                  columns={table4Column}
                  data={JSON.parse(JSON.stringify(data.table4))}
                  readOnly={true}
                  mergeCells={[
                    { row: 8, col: 1, rowspan: 1, colspan: 7 },
                    { row: 11, col: 1, rowspan: 1, colspan: 7 },
                  ]}
                  stretchH="all"
                  preventOverflow="horizontal"
                  rowHeights={RowSize}
                  columnHeaderHeight={columnHeaderSize}
                  cells={function (row, col) {
                    var cp = {};

                    if (col > 1) {
                      cp.className = "text-end";
                    }
                    if (col < 2) {
                      // cp.readOnly = true;
                    }

                    if (row === 3 || row == 2) {
                      if (col > 3 && col < 6) {
                        cp.className = "purchseCellDisable text-end";
                      }
                    }
                    if (row == 7 || row == 14 || row == 15) {
                      if (col > 1 && col < 7) {
                        cp.className = "purchseCellDisable text-end";
                      }
                    }
                    if (row == 8 || row == 11) {
                      cp.className = "purchseCellDisable  boldRow ";
                    }
                    if (row == 7 || row == 14 || row == 15) {
                      if (col == 1) {
                        cp.className = "boldRow ";
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
                  contextMenu={false}
                  bindRowsWithHeaders={true}
                  licenseKey="non-commercial-and-evaluation"
                  autoWrapRow={true}
                />
              ) : null}
            </AccordionBody>
          </AccordionItem>
        </div>
        {/* Part-2  Table-5*/}
        <div className="mt-1 mb-1">
          <AccordionItem>
            <AccordionHeader targetId="2">
              <h3 className="gstr1Filing fw-bolder col-md-9 text-dark">
                5. Details of Outward supplies made during the financial year on which tax is not
                payable{" "}
              </h3>
              <div className="float-end col-md-3 text-end"></div>
            </AccordionHeader>
            <AccordionBody accordionId="2">
              {data?.table5?.length > 0 ? (
                <HotTable
                  height="auto"
                  className="myRow"
                  rowHeights={RowSize}
                  readOnly={true}
                  columnHeaderHeight={columnHeaderSize}
                  columns={table5Column}
                  data={JSON.parse(JSON.stringify(data.table5))}
                  stretchH="all"
                  preventOverflow="horizontal"
                  mergeCells={[
                    { row: 3, col: 1, rowspan: 1, colspan: 5 },
                    { row: 8, col: 1, rowspan: 1, colspan: 5 },
                  ]}
                  cells={function (row, col) {
                    var cp = {};
                    if (col > 1) {
                      cp.className = "text-end";
                    }

                    if (col > 2 && col < 7) {
                      cp.className = "purchseCellDisable text-end";
                    }

                    if (row == 3 || row == 8) {
                      cp.className = "purchseCellDisable  boldRow ";
                    }
                    if (row == 7 || (row > 12 && row < 16)) {
                      if (col == 1) {
                        cp.className = "boldRow ";
                      }
                      if (col == 2) {
                        cp.className = "purchseCellDisable";
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
                  contextMenu={false}
                  bindRowsWithHeaders={true}
                  licenseKey="non-commercial-and-evaluation"
                  autoWrapRow={true}
                />
              ) : null}
            </AccordionBody>
          </AccordionItem>
        </div>
      </Accordion>
    </div>
  );
};

export default Part2;
