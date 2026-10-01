import { HotTable } from "@handsontable/react";
import React, { Fragment, useState } from "react";
import { Trash2 } from "react-feather";
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  Button,
} from "reactstrap";
import { columnHeaderSize, RowSize } from "@configs/config";
import {
  loadCellForReasonTable,
  loadHeaderForReasonTable,
} from "../../../gstr9c/helper";
import { textRenderer } from "handsontable/renderers";
import { formatINR } from "../../../../../helper/formatINRCurrency";

const keyOfTables = {
  table5: "Part II (Tables: 5)",
  table6: "Part II (Tables: 6)",
  table7: "Part II (Tables: 7)",
  table8: "Part II (Tables: 8)",
};

const table5Column = [
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

const table6Column = [
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

const table7Column = [
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

const initialTable5Data = [
  {
    SerialNumber: "A",
    Particulars:
      "Turnover (including exports) as per Audited Financial Statement for the State/UT (For multi-GSTIN units under same PAN, the turnover shall as be derived from the Audited Annual Financial Statements)*",
    Operator: "(+)",
    Amount: 879564878678,
  },
  {
    serialNumber: "B",
    particulars: "Unbilled revenue at the beginning of the Financial Year",
    operator: "(+)",
    amount: 0,
  },
  {
    serialNumber: "C",
    particulars: "Unadjusted advances at the end of the Financial Year",
    operator: "(+)",
    amount: 0,
  },
  {
    serialNumber: "D",
    particulars: "Deemed Supply under Schedule l",
    operator: "(+)",
    amount: 0,
  },
  {
    serialNumber: "E",
    particulars:
      "Credit Notes issued after the end of the financial year but reflected in the annual return",
    operator: "(-)",
    amount: 0,
  },
  {
    serialNumber: "F",
    particulars:
      "Trade Discounts accounted for in the audited Annual Financial Statement but are not permissible under GST",
    operator: "(+)",
    amount: 0,
  },
  {
    serialNumber: "G",
    particulars: "Turnover from April 2017 to June 2017",
    operator: "(-)",
    amount: 0,
  },
  {
    serialNumber: "H",
    particulars: "Unbilled revenue as at the end of the Financial Year",
    operator: "(-)",
    amount: 0,
  },
  {
    serialNumber: "I",
    particulars:
      "Unadjusted Advances as at the beginning of the Financial Year",
    operator: "(-)",
    amount: 0,
  },
  {
    serialNumber: "J",
    particulars:
      "Credit notes accounted for in the audited Annual Financial Statement but are not permissible under GST",
    operator: "(+)",
    amount: 0,
  },
  {
    serialNumber: "K",
    particulars:
      "Adjustments on account of supply of goods by SEZ units to DTA\r\nUnits",
    operator: "(-)",
    amount: 0,
  },
  {
    serialNumber: "L",
    particulars: "Turnover for the period under composition scheme",
    operator: "(-)",
    amount: 0,
  },
  {
    serialNumber: "M",
    particulars:
      "Adjustments in turnover under section 15 and rules thereunder",
    operator: "(+)",
    amount: 0,
  },
  {
    serialNumber: "N",
    particulars: "Adjustments in Turnover due to foreign exchange fluctuation",
    operator: "(+)",
    amount: 0,
  },
  {
    serialNumber: "O",
    particulars: "Adjustment in Turnover due to reasons not listed above",
    operator: "(+)",
    amount: 0,
  },
  {
    serialNumber: "P",
    particulars:
      "Annual Turnover after adjustments as above(A+B+C+D-E+F-G-H- I+J-K-L+M+N+O)*",
    operator: "(-)",
    amount: 0,
  },
  {
    serialNumber: "Q",
    particulars: "Turnover as declared in Annual return (GSTR9)*",
    operator: "(+)",
    amount: 0,
  },
  {
    serialNumber: "R",
    particulars: "Un-Reconciled turnover (Q-P)",
    operator: "",
    amount: 0,
  },
];

const initialTable6Data = [
  {
    action: "View/Add reasons",
    noOfReason: 0,
  },
];

const initialTable7Data = [
  {
    serialNumber: "A",
    particulars: "Annual Turnover after adjustments [from 5(P) above]*",
    operator: "(+)",
    amount: 0,
  },
  {
    serialNumber: "B",
    particulars:
      "Value of Exempted, Nil Rated, Non GST Turnover, No supply turnover",
    operator: "(-)",
    amount: 0,
  },
  {
    serialNumber: "C",
    particulars: "Zero rated supplies without payment of tax",
    operator: "(-)",
    amount: 0,
  },
  {
    serialNumber: "D",
    particulars:
      "Supplies on which tax is to be paid by the recipient on reverse charge basis",
    operator: "(-)",
    amount: 0,
  },
  {
    serialNumber: "E",
    particulars: "Taxable turnover as per adjustments above (A-B-C-D)*",
    operator: "(-)",
    amount: 0,
  },
  {
    serialNumber: "F",
    particulars:
      "Taxable turnover as per liability declared in Annual Return. (GSTR9)*",
    operator: "(+)",
    amount: 0,
  },
  {
    serialNumber: "G",
    particulars: "Unreconciled Taxable Turnover (F-E)*",
    operator: "",
    amount: 0,
  },
];

/**
 * Contains Table: 5-8
 * @returns
 */
const Part2 = ({ data, toggle }) => {
  const [open, setOpen] = useState(["1", "2", "3", "4"]);
  const [table6Modal, setTable6Modal] = useState(false);
  const [table8Modal, setTable8Modal] = useState(false);

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
                5. Reconciliation of Gross Turnover{" "}
              </h3>
            </AccordionHeader>
            <AccordionBody accordionId="1">
              {initialTable5Data?.length > 0 ? (
                <HotTable
                  height="auto"
                  className="myRow"
                  columns={table5Column}
                  data={JSON.parse(JSON.stringify(data?.table5 ?? []))}
                  stretchH="all"
                  preventOverflow="horizontal"
                  rowHeights={RowSize}
                  columnHeaderHeight={columnHeaderSize}
                  afterGetColHeader={theader}
                  readOnly={true}
                  cells={function (row, col) {
                    var cp = {};
                    if (col == 2) {
                      cp.className = "text-center";
                      cp.readOnly = true;
                    }

                    if (col == 3) {
                      cp.className = "text-end";
                    }

                    if (col < 2) {
                      cp.readOnly = true;
                    }

                    if (col == 3 && (row == 15 || row == 17)) {
                      cp.className = "purchseCellDisable text-end boldRow";
                    }

                    if (cp?.className?.includes("purchseCellDisable")) {
                      cp.readOnly = true;
                    }

                    if (col == 3) {
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
              ) : null}
            </AccordionBody>
          </AccordionItem>
        </div>
        <div className="mt-1 mb-1">
          <AccordionItem>
            <AccordionHeader targetId="2">
              <h3 className="gstr1Filing fw-bolder col-md-9 text-dark">
                6. Reasons for un-reconciled difference in annual gross turnover{" "}
              </h3>
            </AccordionHeader>
            <AccordionBody accordionId="2">
              {initialTable6Data?.length > 0 ? (
                <HotTable
                  height="auto"
                  className="myRow"
                  columns={table6Column}
                  data={[
                    {
                      action: "View/Add reasons",
                      noOfReason: data?.table6?.length ?? 0,
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
                      setTable6Modal(true);
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
              ) : null}
            </AccordionBody>
          </AccordionItem>
        </div>
        <div className="mt-1 mb-1">
          <AccordionItem>
            <AccordionHeader targetId="3">
              <h3 className="gstr1Filing fw-bolder col-md-9 text-dark">
                7. Reconciliation of Taxable Turnover{" "}
              </h3>
            </AccordionHeader>
            <AccordionBody accordionId="3">
              {initialTable7Data?.length > 0 ? (
                <HotTable
                  height="auto"
                  className="myRow"
                  columns={table7Column}
                  data={JSON.parse(JSON.stringify(data?.table7?? []))}
                  stretchH="all"
                  preventOverflow="horizontal"
                  rowHeights={RowSize}
                  columnHeaderHeight={columnHeaderSize}
                  afterGetColHeader={theader}
                  readOnly={true}
                  cells={function (row, col) {
                    var cp = {};
                    if (col == 2) {
                      cp.className = "text-center";
                      cp.readOnly = true;
                    }

                    if (col == 3) {
                      cp.className = "text-end";
                    }

                    if (col < 2) {
                      cp.readOnly = true;
                    }

                    if (col == 3 && (row == 0 || row == 4 || row == 6)) {
                      cp.className = "purchseCellDisable text-end boldRow";
                    }

                    if (cp?.className?.includes("purchseCellDisable")) {
                      cp.readOnly = true;
                    }

                    if (col == 3) {
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
              ) : null}
            </AccordionBody>
          </AccordionItem>
        </div>
        <div className="mt-1 mb-1">
          <AccordionItem>
            <AccordionHeader targetId="4">
              <h3 className="gstr1Filing fw-bolder col-md-9 text-dark">
                8. Reasons for un-reconciled difference in taxable turnover{" "}
              </h3>
            </AccordionHeader>
            <AccordionBody accordionId="4">
              {initialTable6Data?.length > 0 ? (
                <HotTable
                  height="auto"
                  className="myRow"
                  columns={table6Column}
                  data={[
                    {
                      action: "View/Add reasons",
                      noOfReason: data?.table8?.length ?? 0,
                    },
                  ]}
                  stretchH="all"
                  preventOverflow="horizontal"
                  rowHeights={RowSize}
                  columnHeaderHeight={columnHeaderSize}
                  afterGetColHeader={loadHeaderForReasonTable}
                  afterOnCellMouseDown={(event, coords, td) => {
                    if (coords?.col === 0) {
                      setTable8Modal(true);
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
              ) : null}
            </AccordionBody>
          </AccordionItem>
        </div>
      </Accordion>
      {table8Modal ? (
        <UnReconciledModal
          open={table8Modal}
          data={
            data?.table6 ? data.table6.map((item) => ({ reason: item })) : []
          }
          readOnly={true}
          onToggle={() => setTable6Modal(false)}
          title={"13. Reasons for un-reconciled difference in ITC"}
        />
      ) : null}
      {table8Modal ? (
        <UnReconciledModal
          open={table8Modal}
          data={
            data?.table8 ? data.table8.map((item) => ({ reason: item })) : []
          }
          readOnly={true}
          onToggle={() => setTable8Modal(false)}
          title={"15. Reasons for un-reconciled difference in ITC"}
        />
      ) : null}
    </Fragment>
  );
};

export default Part2;
