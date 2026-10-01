import { columnHeaderSize, RowSize } from "@configs/config";
import { HotTable } from "@handsontable/react";
import { textRenderer } from "handsontable/renderers";
import React, { Fragment, useState } from "react";
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
} from "reactstrap";
import { formatINR } from "../../../../../helper/formatINRCurrency";
import {
  loadCellForReasonTable,
  loadHeaderForReasonTable,
} from "../../../gstr9c/helper";
import UnReconciledModal from "../../../gstr9c/preparePartA/UnReconciledModal";

const table12Column = [
  {
    title: "S.no",
    data: "SerialNumber",
    width: 5,
  },
  {
    title: "Particulars",
    data: "Particulars",
    width: 60,
  },
  {
    title: "",
    data: "Operator",
    width: 10,
  },
  {
    title: "Amount (₹)",
    data: "Amount",
    width: 20,
  },
];

const table13Column = [
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


const table14Column = [
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
    title: "",
    data: "Operator",
    width: 5,
  },
  {
    title: "Value",
    data: "value",
    width: 25,
  },
  {
    title: "Amount of total ITC",
    data: "totalITC",
    width: 25,
  },
  {
    title: "Amount of eligible ITC availed",
    data: "eligibleITCAvailed",
    width: 25,
  },
];

const table16Column = [
  {
    title: "S.no",
    data: "SerialNumber",
    width: 5,
  },
  {
    title: "Particulars",
    data: "Particulars",
    width: 60,
  },
  {
    title: "Amount",
    data: "Amount",
    width: 35,
  },
];


const Part4 = ({ data, toggle }) => {
  const [open, setOpen] = useState(["1", "2", "3", "4", "5"]);

  const [table13Modal, setTable13Modal] = useState(false);
  const [table13ModalData, setTable13ModalData] = useState([]);

  const [table15Modal, setTable15Modal] = useState(false);
  const [table15ModalData, setTable15ModalData] = useState([]);

  const theader = (col, TH) => {
    if (col == 0 || col == 1 || col == 7) {
      TH.className = "htLeft";
    } else {
      TH.className = "htRight";
    }
  };

      // *** with round
      function formatRender(instance, td, row, col, prop, value, cellProperties) {
        textRenderer.apply(this, arguments);
          let currnecyVal = formatINR(Number(value));
  
          if (currnecyVal !== 0) {
            td.innerText = currnecyVal;
          }
  
      }

  return (
    <Fragment>
      <Accordion
        className="accordion-border"
        open={open}
        toggle={(id) => toggle(id, setOpen, open)}
      >
        <div className="mb-1">
          <AccordionItem>
            <AccordionHeader targetId="1">
              <h3 className="gstr1Filing fw-bolder col-md-9 text-dark">
                12. Reconciliation of Net Input Tax Credit (ITC){" "}
              </h3>
            </AccordionHeader>
            <AccordionBody accordionId="1">
              <HotTable
                height="auto"
                className="myRow"
                columns={table12Column}
                data={JSON.parse(JSON.stringify(data?.table12 ?? []))}
                stretchH="all"
                preventOverflow="horizontal"
                rowHeights={RowSize}
                readOnly={true}
                columnHeaderHeight={columnHeaderSize}
                afterGetColHeader={theader}
                cells={function (row, col) {
                  var cp = {};
                  if (col == 2) {
                    cp.className = "text-center";
                    cp.readOnly = true;
                  }

                  if (col == 3) {
                    cp.className = "text-end";
                    cp.renderer = formatRender;

                  }

                  if (col < 2) {
                    cp.readOnly = true;
                  }

                  if (col == 3 && ![1, 2, 4].includes(row)) {
                    cp.className = "purchseCellDisable text-end boldRow";
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
            </AccordionBody>
          </AccordionItem>
        </div>
        <div className="mt-1 mb-1">
          <AccordionItem>
            <AccordionHeader targetId="2">
              <h3 className="gstr1Filing fw-bolder col-md-9 text-dark">
                13. Reasons for un-reconciled difference in ITC{" "}
              </h3>
            </AccordionHeader>
            <AccordionBody accordionId="2">
              <HotTable
                height="auto"
                className="myRow"
                columns={table13Column}
                data={[
                  {
                    action: "View/Add reasons",
                    noOfReason: data?.table13?.length ?? 0,
                  },
                ]}
                stretchH="all"
                readOnly={true}
                preventOverflow="horizontal"
                rowHeights={RowSize}
                afterGetColHeader={loadHeaderForReasonTable}
                columnHeaderHeight={columnHeaderSize}
                cells={loadCellForReasonTable}
                afterOnCellMouseDown={(event, coords, td) => {
                  if (coords?.col === 0) {
                    setTable13Modal(true);
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
        </div>
        <div className="mt-1 mb-1">
          <AccordionItem>
            <AccordionHeader targetId="3">
              <h3 className="gstr1Filing fw-bolder col-md-9 text-dark">
                14. Reconciliation of ITC declared in Annual Return (GSTR9) with
                ITC availed on expenses as per audited Annual Financial
                Statement or books of account{" "}
              </h3>
            </AccordionHeader>
            <AccordionBody accordionId="3">
              <HotTable
                height="auto"
                className="myRow"
                columns={table14Column}
                data={JSON.parse(JSON.stringify(data?.table14 ?? []))}
                stretchH="all"
                preventOverflow="horizontal"
                rowHeights={RowSize}
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
                  if (col == 2) {
                    cp.className = "text-center";
                    cp.readOnly = true;
                  }

                  if (col > 2) {
                    cp.className = "text-end";
                    cp.renderer = formatRender;

                  }

                  if (col < 2) {
                    cp.readOnly = true;
                  }

                  if (col >= 3 && row >= 17 && !(col === 5 && row === 18)) {
                    cp.className = "purchseCellDisable text-end boldRow";
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
            </AccordionBody>
          </AccordionItem>
        </div>
        <div className="mt-1 mb-1">
          <AccordionItem>
            <AccordionHeader targetId="3">
              <h3 className="gstr1Filing fw-bolder col-md-9 text-dark">
                15. Reasons for un-reconciled difference in ITC{" "}
              </h3>
            </AccordionHeader>
            <AccordionBody accordionId="3">
              <HotTable
                height="auto"
                className="myRow"
                columns={table13Column}
                data={[
                  {
                    action: "View/Add reasons",
                    noOfReason: data?.table15?.length ?? 0,
                  },
                ]}
                stretchH="all"
                preventOverflow="horizontal"
                rowHeights={RowSize}
                columnHeaderHeight={columnHeaderSize}
                afterGetColHeader={loadHeaderForReasonTable}
                afterOnCellMouseDown={(event, coords, td) => {
                  if (coords?.col === 0) {
                    setTable15Modal(true);
                  }
                }}
                cells={loadCellForReasonTable}
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
            <AccordionHeader targetId="4">
              <h3 className="gstr1Filing fw-bolder col-md-9 text-dark">
                16. Tax payable on un-reconciled difference in ITC (due to
                reasons specified in 13 and 15 above){" "}
              </h3>
            </AccordionHeader>
            <AccordionBody accordionId="4">
              <HotTable
                height="auto"
                className="myRow"
                columns={table16Column}
                data={JSON.parse(JSON.stringify(data?.table16 ?? []))}
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
                  if (col == 2) {
                    cp.className = "text-end";
                    cp.renderer = formatRender;
                  }

                  if (col < 2) {
                    cp.readOnly = true;
                  }

                  if (col == 3 && !(row == 1 || row == 2)) {
                    cp.className = "purchseCellDisable text-end boldRow";
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
            </AccordionBody>
          </AccordionItem>
        </div>
      </Accordion>
      {table13Modal ? (
        <UnReconciledModal
          open={table13Modal}
          data={
            data?.table13 ? data.table13.map((item) => ({ reason: item })) : []
          }
          readOnly={true}
          onToggle={() => setTable13Modal(false)}
          title={"13. Reasons for un-reconciled difference in ITC"}
        />
      ) : null}
      {table15Modal ? (
        <UnReconciledModal
          open={table15Modal}
          data={
            data?.table15 ? data.table15.map((item) => ({ reason: item })) : []
          }
          readOnly={true}
          onToggle={() => setTable15Modal(false)}
          title={"15. Reasons for un-reconciled difference in ITC"}
        />
      ) : null}
    </Fragment>
  );
};

export default Part4;
