import { columnHeaderSize, RowSize } from "@configs/config";
import { HotTable } from "@handsontable/react";
import React, { useState } from "react";
import { Accordion, AccordionBody, AccordionHeader, AccordionItem } from "reactstrap";

const table15Column = [
  {
    title: "",
    data: "SerialNumber",
    width: 35,
    readOnly: "true",
  },
  {
    title: "Details",
    data: "Details",
    readOnly: "true",
  },
  {
    title: "Integrated Tax (₹)",
    data: "IGST",
  },
  {
    title: "Central Tax (₹)",
    data: "CGST",
  },
  {
    title: "State/UT Tax (₹)",
    data: "SGST",
  },
  {
    title: "Cess (₹)",
    data: "Cess",
  },
  {
    title: "Interest (₹)",
    data: "Interest",
  },
  {
    title: "Penalty (₹)",
    data: "Penalty",
  },
  {
    title: "Late Fee/Others (₹)",
    data: "LateFeeOrOthers",
  },
  {
    title: "Notes",
    data: "Notes",
  },
];

const table16Column = [
  {
    title: "",
    data: "SerialNumber",
    width: 35,
    readOnly: "true",
  },
  {
    title: "Details",
    data: "Details",
    readOnly: "true",
  },
  {
    title: "Taxable Value (₹)",
    data: "TaxableValue",
  },
  {
    title: "Integrated Tax (₹)",
    data: "IGST",
  },
  {
    title: "Central Tax (₹)",
    data: "CGST",
  },
  {
    title: "State/UT Tax (₹)",
    data: "SGST",
  },
  {
    title: "Cess (₹)",
    data: "Cess",
  },
  {
    title: "Notes",
    data: "Notes",
  },
];

const table17Column = [
  {
    title: "Code",
    data: "Code",
  },
  {
    title: "UQC",
    data: "UQC",
  },
  {
    title: "Total Quantity",
    data: "TotalQuantity",
  },
  {
    title: "Taxable Value (₹)",
    data: "TaxableValue",
  },
  {
    title: "Rate of Tax",
    data: "Rate",
  },
  {
    title: "Integrated Tax (₹)",
    data: "IGST",
  },
  {
    title: "Central Tax (₹)",
    data: "CGST",
  },
  {
    title: "State/UT Tax (₹)",
    data: "SGST",
  },
  {
    title: "Cess (₹)",
    data: "Cess",
  },
  {
    title: "Notes",
    data: "Notes",
  },
  {
    title: "Actions",
    data: "actions",
  },
];

const table18Column = [
  {
    title: "Code",
    data: "Code",
  },
  {
    title: "UQC",
    data: "UQC",
  },
  {
    title: "Total Quantity",
    data: "TotalQuantity",
  },
  {
    title: "Taxable Value (₹)",
    data: "TaxableValue",
  },
  {
    title: "Rate of Tax",
    data: "rate",
  },
  {
    title: "Integrated Tax (₹)",
    data: "IGST",
  },
  {
    title: "Central Tax (₹)",
    data: "CGST",
  },
  {
    title: "State/UT Tax (₹)",
    data: "SGST",
  },
  {
    title: "Cess (₹)",
    data: "Cess",
  },
  {
    title: "Notes",
    data: "Notes",
  },
  {
    title: "Actions",
    data: "actions",
  },
];

const table19Column = [
  {
    title: "",
    data: "SerialNumber",
    readOnly: "true",
    width: 10
  },
  {
    title: "Description",
    data: "description",
    readOnly: "true",
  },
  {
    title: "Payable (₹)",
    data: "Payable",
  },
  {
    title: "Paid (₹)",
    data: "Paid",
  },
  {
    title: "Notes",
    data: "Notes",
  },
];

const Part6 = ({ data, toggle }) => {
  const [open, setOpen] = useState(["1", "2", "3", "4", "5"]);

  return (
    <div>
      <Accordion
        className="accordion-border"
        open={open}
        toggle={(id) => toggle(id, setOpen, open)}
      >
        {/* Part-6  Table-15*/}
        <div className="mb-1">
          <AccordionItem>
            <AccordionHeader targetId="1">
              <h3 className="gstr1Filing fw-bolder col-md-9 text-dark">
                15. Particulars of Demands and Refunds{" "}
              </h3>
              <div className="float-end col-md-3 text-end"></div>
            </AccordionHeader>
            <AccordionBody accordionId="1">
              <div className="d-grid mb-1 mb-lg-0">
                <HotTable
                  height="auto"
                  className="myRow"
                  columns={table15Column}
                  data={data?.table15}
                  stretchH="all"
                  preventOverflow="horizontal"
                  rowHeights={RowSize}
                  columnHeaderHeight={columnHeaderSize}
                  cells={function (row, col) {
                    var cp = {};

                    if (col > 1) {
                      cp.className = "text-end";
                    }
                    if (row < 4) {
                      if (col > 5 && col < 9) {
                        cp.className = "purchseCellDisable text-end boldRow ";
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
                  readOnly={true}
                />
              </div>
            </AccordionBody>
          </AccordionItem>
        </div>
        {/* Part-6  Table-16*/}
        <div className="mt-1 mb-1">
          <AccordionItem>
            <AccordionHeader targetId="2">
              <h3 className="gstr1Filing fw-bolder col-md-9 text-dark">
                16. Supplies received from Composition taxpayers, deemed supply by job worker and
                goods sent on approval basis
              </h3>
              <div className="float-end col-md-3 text-end"></div>
            </AccordionHeader>
            <AccordionBody accordionId="2">
              <div className="d-grid mb-1 mb-lg-0">
                {/* <h3 style={{ fontSize: "20px", fontWeight: "bold"  }} className="">Part II - Details of Outward and Inward supplies declared during the financial year</h3> */}
                <HotTable
                  height="auto"
                  className="myRow"
                  columns={table16Column}
                  data={data?.table16}
                  stretchH="all"
                  preventOverflow="horizontal"
                  rowHeights={RowSize}
                  columnHeaderHeight={columnHeaderSize}
                  cells={function (row, col) {
                    var cp = {};

                    if (col > 1) {
                      cp.className = "text-end";
                    }
                    if (row == 0) {
                      if (col > 2 && col < 7) {
                        cp.className = "purchseCellDisable text-end boldRow ";
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
                  readOnly={true}
                />
              </div>
            </AccordionBody>
          </AccordionItem>
        </div>
        {/* Part-6  Table-17*/}
        <div className="mt-1 mb-1">
          <AccordionItem>
            <AccordionHeader targetId="3">
              <h3 className="gstr1Filing fw-bolder col-md-9 text-dark">
                17. HSN Wise Summary of Outward supplies
              </h3>
              <div className="float-end col-md-3 text-end"></div>
            </AccordionHeader>
            <AccordionBody accordionId="3">
              <HotTable
                height="auto"
                className="myRow"
                columns={table17Column}
                data={data?.table17}
                stretchH="all"
                preventOverflow="horizontal"
                rowHeights={RowSize}
                columnHeaderHeight={columnHeaderSize}
                cells={function (row, col) {
                  var cp = {};

                  if (col > 1 && col < 9) {
                    cp.className = "text-end";
                  }
                  return cp;
                }}
                contextMenu={false}
                bindRowsWithHeaders={true}
                licenseKey="non-commercial-and-evaluation"
                autoWrapRow={true}
                readOnly={true}
              />
            </AccordionBody>
          </AccordionItem>
        </div>
        {/* Part-6  Table-18*/}
        <div className="mt-1 mb-1">
          <AccordionItem>
            <AccordionHeader targetId="4">
              <h3 className="gstr1Filing fw-bolder col-md-9 text-dark">
                18. HSN Wise Summary of Inward supplies
              </h3>
              <div className="float-end col-md-3 text-end"></div>
            </AccordionHeader>
            <AccordionBody accordionId="4">
              <HotTable
                height="auto"
                className="myRow"
                columns={table18Column}
                data={data?.table18}
                stretchH="all"
                preventOverflow="horizontal"
                rowHeights={RowSize}
                columnHeaderHeight={columnHeaderSize}
                cells={function (row, col) {
                  var cp = {};

                  if (col > 1 && col < 9) {
                    cp.className = "text-end";
                  }
                  return cp;
                }}
                contextMenu={false}
                bindRowsWithHeaders={true}
                licenseKey="non-commercial-and-evaluation"
                autoWrapRow={true}
                readOnly={true}
              />
            </AccordionBody>
          </AccordionItem>
        </div>

        {/* Part-6  Table-19*/}
        <div className="mt-1 mb-1">
          <AccordionItem>
            <AccordionHeader targetId="5">
              <h3 className="gstr1Filing fw-bolder col-md-9 text-dark">
                19. Late fee payable and paid
              </h3>
              <div className="float-end col-md-3 text-end"></div>
            </AccordionHeader>
            <AccordionBody accordionId="5">
              <HotTable
                height="auto"
                className="myRow"
                columns={table19Column}
                data={data?.table19}
                stretchH="all"
                preventOverflow="horizontal"
                rowHeights={RowSize}
                columnHeaderHeight={columnHeaderSize}
                cells={function (row, col) {
                  var cp = {};

                  if (col > 1 && col < 4) {
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
                contextMenu={false}
                bindRowsWithHeaders={true}
                licenseKey="non-commercial-and-evaluation"
                autoWrapRow={true}
                readOnly={true}
              />
            </AccordionBody>
          </AccordionItem>
        </div>
      </Accordion>
    </div>
  );
};

export default Part6;
