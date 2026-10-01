import React from 'react'
import { registerAllModules } from "handsontable/registry";
import { globleVariable } from "@configs/globalVariable";
import LocalFunction from "@configs/getLocalFunction";
import SessionFunction from "@configs/getSessionFunction";
import { RowSize, columnHeaderSize } from "@configs/config";
import Handsontable from "handsontable";

import HotTable from "@handsontable/react";
import { ArrowLeft, ArrowRight, FilePlus } from 'react-feather';
import { Button } from 'reactstrap';

registerAllModules();


const Part1 = ({ G_GSTIN, stepper }) => {

  let GTradeName =
    sessionStorage.getItem(globleVariable.G_TradeName) &&
    SessionFunction.getSessionValue(globleVariable.G_TradeName, true);
  const companyName = sessionStorage.getItem(globleVariable.G_Name) && SessionFunction.getSessionValue(globleVariable.G_Name, true)
  let GFY =
    sessionStorage.getItem(globleVariable.G_FY) &&
    SessionFunction.getSessionValue(globleVariable.G_FY, true);
  const userDatadecrypt = LocalFunction.getLocalValue(
    globleVariable.userData,
    true
  );
  const userData = userDatadecrypt && JSON.parse(userDatadecrypt);
  const finYearOption = userData && userData.data.rangeFiltersGSTR9;
  const finYear = finYearOption?.filter((p) => p.value == GFY)[0]?.label;

  const part1TableData = [
    { id: '1', name: 'Financial Year', address: finYear || finYearOption[0].label },
    { id: '2', name: 'GSTIN', address: G_GSTIN },
    { id: '3A', name: 'Legal Name', address: companyName },
    { id: '3B', name: 'Trade Name (if Any)', address: GTradeName },
  ];

  const customRenderer = function (instance, td, row, col, prop, value, cellProperties) {
    Handsontable.renderers.TextRenderer.apply(this, arguments);

    // Highlight the first column's cells
    if (col === 0) {
      td.style.backgroundColor = '#e8e8e8';
      td.style.width = '5px' // 
    }
  };

  return (
    <div>
      <HotTable
        width={'70%'}
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
      <div style={{ zIndex: "999", }} className='btnFixFooter'>
        <div className="container">
          <div style={{ margintop: "25px" }} className="d-flex justify-content-between row">
            <div className="col-md-4 text-start">
              <Button
                color="danger"
                className="btn-prev "
                // onClick={() => stepper.previous()}
                onClick={() => stepper.previous()}
              >
                <ArrowLeft
                  size={14}
                  className="align-middle me-sm-25 me-0"
                ></ArrowLeft>
                <span className="align-middle d-sm-inline-block d-none">
                  Previous
                </span>
              </Button>
            </div>

            <div className="col-md-8 text-end">
              <Button
                color="danger"
                className="btn-next "
                onClick={() => stepper.next()}
              >
                <span className="align-middle d-sm-inline-block d-none">Next</span>
                <ArrowRight
                  size={14}
                  className="align-middle ms-sm-25 ms-0"
                ></ArrowRight>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Part1
