import { columnHeaderSize, RowSize } from "@configs/config";
import { HotTable } from "@handsontable/react";
import React, { useState } from "react";
import { Accordion, AccordionBody, AccordionHeader, AccordionItem } from "reactstrap";

const table9Column = [
  {
    title: "Description",
    data: "Description",
    readOnly: 'true'
    // width: 35
  },
  {
    title: "Tax Payable (₹)",
    data: "TaxPayable",
    width: '270px',

  },
  {
    title: "Paid through Cash (₹)",
    data: "Cash",
  },
  {
    title: "Paid through ITC- IGST (₹)",
    data: "IGST",
  },
  {
    title: "Paid through ITC- CGST (₹)",
    data: "CGST",
  },
  {
    title: "Paid through ITC- SGST (₹)",
    data: "SGST",
  },
  {
    title: "Cess (₹)",
    data: "Cess",
  },
  {
    title: "Notes",
    data: "Notes",
  }
];

const Part4 = ({ data, toggle }) => {
  const [open, setOpen] = useState(["1"]);

  return (
    <React.Fragment>
      <Accordion
        className="accordion-border"
        open={open}
        toggle={(id) => toggle(id, setOpen, open)}
      >
        <AccordionItem>
          <AccordionHeader targetId="1">
            <h3 className="gstr1Filing fw-bolder col-md-9 text-dark">
              9. Details of tax paid as declared in returns filed during the financial year
            </h3>
            <div className="float-end col-md-3 text-end"></div>
          </AccordionHeader>
          <AccordionBody accordionId="1">
            <HotTable
              height="auto"
              className="myRow"
              columns={table9Column}
              readOnly={true}
              data={data?.table9}
              stretchH="all"
              preventOverflow="horizontal"
              rowHeights={RowSize}
              columnHeaderHeight={columnHeaderSize}
              cells={function (row, col) {
                var cp = {};

                if (col > 0) {
                  cp.className = "text-end";
                }

                if (col > 1 && col < 7) {
                  cp.className = "purchseCellDisable text-end boldRow ";
                }
                if (cp?.className?.includes("purchseCellDisable")) {
                  cp.readOnly = true;
                }
                return cp;
              }}
              beforeKeyDown={function (e, col) {
                // Delete and Backspace , copy and paste

                if (
                  e.keyCode == 8 ||
                  e.keyCode == 46 ||
                  e.keyCode == 67 ||
                  e.keyCode == 86 ||
                  e.keyCode == 38 ||
                  e.keyCode == 37 ||
                  e.keyCode == 39 ||
                  e.keyCode == 40
                ) {
                } else {
                  var reg = /^[0-9.]+|[\b]+$/;
                  let col = this?.getSelectedLast()?.[1];

                  if (col > 0 && col < 7) {
                    if (!reg.test(e.key)) {
                      e.preventDefault();
                    }
                  }
                }
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
    </React.Fragment>
  );
};

export default Part4;
