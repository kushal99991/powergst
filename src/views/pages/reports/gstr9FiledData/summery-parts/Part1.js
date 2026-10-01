import { columnHeaderSize, RowSize } from "@configs/config";
import LocalFunction from "@configs/getLocalFunction";
import SessionFunction from "@configs/getSessionFunction";
import { globleVariable } from "@configs/globalVariable";
import HotTable from "@handsontable/react";
import Handsontable from "handsontable";
import { registerAllModules } from "handsontable/registry";
import React from "react";

registerAllModules();

const Part1 = ({ G_GSTIN, data }) => {
  let GTradeName =
    sessionStorage.getItem(globleVariable.G_TradeName) &&
    SessionFunction.getSessionValue(globleVariable.G_TradeName, true);
  const companyName =
    sessionStorage.getItem(globleVariable.G_Name) &&
    SessionFunction.getSessionValue(globleVariable.G_Name, true);
  let GFY =
    sessionStorage.getItem(globleVariable.G_FY) &&
    SessionFunction.getSessionValue(globleVariable.G_FY, true);
  const userDatadecrypt = LocalFunction.getLocalValue(globleVariable.userData, true);
  const userData = userDatadecrypt && JSON.parse(userDatadecrypt);
  const finYearOption = userData && userData.data.rangeFiltersGSTR9;
  const finYear = finYearOption?.filter((p) => p.value == GFY)[0]?.label;

  const part1TableData = [
    { id: "1", name: "Financial Year", address: finYear || finYearOption[0].label },
    { id: "2", name: "GSTIN", address: G_GSTIN },
    { id: "3A", name: "Legal Name", address: companyName },
    { id: "3B", name: "Trade Name (if Any)", address: GTradeName },
  ];

  const customRenderer = function (instance, td, row, col, prop, value, cellProperties) {
    Handsontable.renderers.TextRenderer.apply(this, arguments);

    // Highlight the first column's cells
    if (col === 0) {
      td.style.backgroundColor = "#e8e8e8";
      td.style.width = "5px"; // Example highlight color
    }
  };

  return (
    <HotTable
      width={"70%"}
      rowHeights={RowSize}
      columnHeaderHeight={columnHeaderSize}
      data={part1TableData}
      readOnly={true}
      stretchH="all"
      height="auto"
      selectionMode={"single"}
      licenseKey="non-commercial-and-evaluation"
      renderer={customRenderer}
      colWidths={[4, 15, null]}
    />
  );
};

export default Part1;
