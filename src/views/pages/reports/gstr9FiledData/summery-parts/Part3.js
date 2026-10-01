import { RowSize } from "@configs/config";
import { HotTable } from "@handsontable/react";
import React, { useState } from "react";
import { Accordion, AccordionBody, AccordionHeader, AccordionItem } from "reactstrap";

const part3Table6 = [
  {
    title: "",
    data: "SerialNumber",
    width: 35,
    readOnly: true,
  },
  {
    title: "Description",
    data: "Description",
    width: 200,
    readOnly: true,
  },
  {
    title: "Type",
    data: "Type",
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

const part3Table7 = [
  {
    title: "",
    data: "SerialNumber",
    width: 35,
    readOnly: true,
  },
  {
    title: "Description",
    data: "Description",
    readOnly: true,
    width: 200,
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

const part3Table8 = [
  {
    title: "",
    data: "SerialNumber",
    width: 35,
    readOnly: true,
  },
  {
    title: "Description",
    data: "Description",
    width: 200,
    readOnly: true,
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

const Part3 = ({ data, toggle }) => {
  const [open, setOpen] = useState(["1", "2", "3"]);

  return (
    <div>
      <Accordion
        className="accordion-border"
        open={open}
        toggle={(id) => toggle(id, setOpen, open)}
      >
        {/* Part-3  Table-6*/}
        <div className="mb-1">
          <AccordionItem>
            <AccordionHeader targetId="1">
              <h3 className="gstr1Filing fw-bolder col-md-9 text-dark">
                6. Details of ITC availed during the financial year{" "}
              </h3>
              <div className="float-end col-md-3 text-end"></div>
            </AccordionHeader>
            <AccordionBody accordionId="1">
              <div className="d-grid mb-1 mb-lg-0">
                <HotTable
                  // afterGetColHeader={theaderLogSummaryData}
                  height="auto"
                  className="myRow"
                  rowHeights={RowSize}
                  readOnly={true}
                  mergeCells={[
                    { row: 0, col: 1, rowspan: 1, colspan: 2 },
                    { row: 1, col: 1, rowspan: 1, colspan: 7 },
                    { row: 2, col: 1, rowspan: 3, colspan: 1 },
                    { row: 2, col: 0, rowspan: 3, colspan: 1 },
                    { row: 5, col: 1, rowspan: 1, colspan: 7 },
                    { row: 6, col: 1, rowspan: 3, colspan: 1 },
                    { row: 6, col: 0, rowspan: 3, colspan: 1 },
                    { row: 9, col: 1, rowspan: 3, colspan: 1 },
                    { row: 9, col: 0, rowspan: 3, colspan: 1 },
                    { row: 12, col: 1, rowspan: 1, colspan: 7 },
                    { row: 13, col: 1, rowspan: 2, colspan: 1 },
                    { row: 13, col: 0, rowspan: 2, colspan: 1 },
                    { row: 15, col: 1, rowspan: 1, colspan: 2 },
                    { row: 16, col: 1, rowspan: 1, colspan: 2 },
                    { row: 17, col: 1, rowspan: 1, colspan: 2 },
                    { row: 18, col: 1, rowspan: 1, colspan: 2 },
                    { row: 19, col: 1, rowspan: 1, colspan: 2 },
                    { row: 20, col: 1, rowspan: 1, colspan: 2 },
                    { row: 21, col: 1, rowspan: 1, colspan: 2 },
                    { row: 22, col: 1, rowspan: 1, colspan: 2 },
                    { row: 23, col: 1, rowspan: 1, colspan: 2 },
                    { row: 24, col: 1, rowspan: 1, colspan: 2 },
                  ]}
                  cells={function (row, col) {
                    var cp = {};

                    // cp.className = "child";
                    if (col > 1) {
                      cp.className = "text-end";
                    }

                    if (row == 1 || row == 5 || row == 12) {
                      if (col >= 0) {
                        cp.className = "purchseCellDisable boldRow ";
                      }
                    }
                    if (row == 0) {
                      if (col > 1 && col < 7) {
                        cp.className = "purchseCellDisable boldRow text-end";
                      }
                      if (col == 0 || col == 1) {
                        cp.className = "boldRow";
                      }
                    }
                    if (row == 13 || row == 14 || row == 15) {
                      if (col == 4 || col == 5) {
                        cp.className = "purchseCellDisable text-end";
                      }
                    }
                    if (row == 18 || row == 19) {
                      if (col > 1 && col < 7) {
                        cp.className = "purchseCellDisable text-end boldRow";
                      }
                      if (col == 0 || col == 1) {
                        cp.className = "boldRow";
                      }
                    }
                    if (row == 20 || row == 21) {
                      if (col == 3 || col == 5) {
                        cp.className = "purchseCellDisable text-end";
                      }
                    }
                    if (row == 23 || row == 24) {
                      if (col > 1 && col < 7) {
                        cp.className = "purchseCellDisable text-end boldRow";
                      }
                      if (col == 0 || col == 1) {
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
                  columns={part3Table6}
                  data={data?.table6 ? JSON.parse(JSON.stringify(data.table6)) : []}
                  contextMenu={false}
                  bindRowsWithHeaders={true}
                  licenseKey="non-commercial-and-evaluation"
                  autoWrapRow={true}
                />
              </div>
            </AccordionBody>
          </AccordionItem>
        </div>

        {/* Part-3  Table-7*/}
        <div className="mt-1 mb-1">
          <AccordionItem>
            <AccordionHeader targetId="2">
              <h3 className="gstr1Filing fw-bolder col-md-9 text-dark">
                7. Details of ITC Reversed and Ineligible ITC for the financial year{" "}
              </h3>
              <div className="float-end col-md-3 text-end"></div>
            </AccordionHeader>
            <AccordionBody accordionId="2">
              <div className="d-grid mb-1 mb-lg-0">
                <HotTable
                  height="auto"
                  className="myRow"
                  rowHeights={RowSize}
                  readOnly={true}
                  mergeCells={[{ row: 0, col: 1, rowspan: 1, colspan: 6 }, { row: 8, col: 1, rowspan: 6, colspan: 1 },  { row: 8, col: 0, rowspan: 6, colspan: 1 }]}
                  cells={function (row, col) {
                    var cp = {};

                    // cp.className = "child";
                    if (col > 1) {
                      cp.className = "text-end";
                    }

                    if (row == 0) {
                      cp.className = "purchseCellDisable boldRow";
                    }
                    if (row == 6 || row == 7) {
                      if (col == 2 || col == 5) {
                        cp.className = "purchseCellDisable text-end";
                      }
                    }

                    if (row == 14 || row == 15) {
                      if (col > 1 && col < 6) {
                        cp.className = "purchseCellDisable text-end boldRow";
                      }
                      if (col == 0 || col == 1) {
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
                  columns={part3Table7}
                  data={data?.table7 ? JSON.parse(JSON.stringify(data.table7)) : []}
                  contextMenu={false}
                  bindRowsWithHeaders={true}
                  licenseKey="non-commercial-and-evaluation"
                  autoWrapRow={true}
                />
              </div>
            </AccordionBody>
          </AccordionItem>
        </div>

        {/* Part-3  Table-8*/}
        <div className="mt-1">
          <AccordionItem>
            <AccordionHeader targetId="3">
              <h3 className="gstr1Filing fw-bolder col-md-9 text-dark">
                8. Other ITC related information
              </h3>
              <div className="float-end col-md-3 text-end"></div>
            </AccordionHeader>
            <AccordionBody accordionId="3">
              <div className="d-grid mb-1 mb-lg-0">
                <HotTable
                  // afterGetColHeader={theaderLogSummaryData}
                  height="auto"
                  className="myRow"
                  rowHeights={RowSize}
                  cells={function (row, col) {
                    var cp = {};

                    // cp.className = "child";
                    if (col > 1) {
                      cp.className = "text-end";
                    }

                    if (
                      row == 0 ||
                      row == 1 ||
                      row == 3 ||
                      row == 7 ||
                      row == 8 ||
                      row == 9 ||
                      row == 10
                    ) {
                      if (col > 1 && col < 6) {
                        cp.className = "purchseCellDisable boldRow text-end";
                      }
                      if (col == 0 || col == 1) {
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
                  columns={part3Table8}
                  data={data?.table8}
                  contextMenu={false}
                  readOnly={true}
                  bindRowsWithHeaders={true}
                  licenseKey="non-commercial-and-evaluation"
                  autoWrapRow={true}
                />
              </div>
            </AccordionBody>
          </AccordionItem>
        </div>
      </Accordion>
    </div>
  );
};

export default Part3;
