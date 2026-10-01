import { HotTable } from "@handsontable/react";
import React from "react";
import { columnHeaderSize, RowSize } from "../../../configs/config";

const defaultChangeFunction = () => {};

const CustomHotTable = ({
  column,
  keyOfTable,
  errorArr = [],
  data = [{ srNo: "No data found" }],
  columnsInLeft = [],
  columnsInCenter = [],
  readOnlyCols = [],
  readOnlyRowCols = [],
  readOnly = false,
  onChangeOfTable = defaultChangeFunction,
}) => {
  const loadTableHeader = (col, TH) => {
    switch (true) {
      case columnsInLeft.includes(col):
        TH.className = "text-left";
        break;

      case columnsInCenter.includes(col):
        TH.className = "text-center";
        break;

      default:
        TH.className = "text-end";
        break;
    }
  };

  const loadTableCells = (row, col) => {
    const cp = {};
    switch (true) {
      case columnsInLeft.includes(col):
        cp.className = "text-left";
        break;

      case columnsInCenter.includes(col):
        cp.className = "text-center";
        break;

      default:
        cp.className = "text-end";
        break;
    }

    if (readOnlyCols.includes(col)) cp.readOnly = true;

    if (readOnlyRowCols.includes([row, col])) {
      cp.className = `${cp?.className} purchseCellDisable boldRow`;
    }

    return cp;
  };

  return (
    <HotTable
      height="auto"
      className="myRow"
      columns={column}
      data={data}
      stretchH="all"
      preventOverflow="horizontal"
      rowHeights={RowSize}
      columnHeaderHeight={columnHeaderSize}
      afterGetColHeader={loadTableHeader}
      cells={loadTableCells}
      afterChange={(x, y) => onChangeOfTable(x, y)}
      afterRenderer={(TD, row, col, prop, value) => {
        if (
          errorArr.findIndex(
            (y) => y.row == row && y.col == col && y.table == keyOfTable
          ) != -1 &&
          value
        ) {
          TD.style.backgroundColor = "red";
        }
      }}
      readOnly={readOnly}
      beforeKeyDown={function (e, col) {
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
          var reg = /^[0-9.-]+|[\b]+$/;
          let col = this?.getSelectedLast()?.[1];

          if (col > 1 && col < 7) {
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
  );
};

export default CustomHotTable;
