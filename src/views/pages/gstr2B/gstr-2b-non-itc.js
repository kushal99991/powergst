import { useState, useEffect, useRef } from "react";
import { Button, Card, CardBody, CardText, Row, Col, Label } from "reactstrap";
import {
  Link,
  useLocation,
  useSearchParams,
  useNavigate,
} from "react-router-dom";
import encryptData from "../../../auth/crypto/crypto";
import { useDispatch, useSelector } from "react-redux";
//** Handsontable
import { HotTable, HotColumn } from "@handsontable/react";
import Handsontable from "handsontable";
import { registerRenderer, textRenderer } from "handsontable/renderers";
import { registerAllModules } from "handsontable/registry";
import { globleVariable } from "../../../configs/globalVariable";
import SessionFunction from "../../../configs/getSessionFunction";
import { RowSize, columnHeaderSize } from "@configs/config";

//** register Handsontable's modules
registerAllModules();

const GSTR2BITCNonITc = (props) => {

  const { subscriptionId, GstIn } = props

  const GUCParId =
    sessionStorage.getItem(globleVariable.G_UCParId) &&
    SessionFunction.getSessionValue(globleVariable.G_UCParId, true);

  const { finYear, finMonth } = props;
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const store = useSelector((state) => state?.users?.GSTR2BSummary?.[0]?.Summary?.NotITC);
  console.log(store, "NonITC")
  const hotRef = useRef(null);

  let clientId = null;

  //** location state
  if (location.state !== null) {
    clientId =
      location.state.clientId !== null ? location.state.clientId : null;
  }

  //** Hook
  const [data, setData] = useState([]);
  const [block, setBlock] = useState(false);

  useEffect(() => {
    return () => setBlock(false);
  }, []);

  //** Store data
  useEffect(() => {
    if (store !== undefined) {
      setData(store?.data?.notITC);
    }
  }, [store]);

  //** Cell click event
  const onRowClick = (data) => {
    console.log(data);
    if (data.isClickable == false) {
      const decryptUrl = encryptData.encryptData(
        "clientId=" +
        GUCParId +
        "&rows=" +
        data.rowCount +
        "&isItc=0&section=" +
        data.section
      );
      console.log(decryptUrl, "decryptUrldecryptUrl")
      navigate(`/gst-returns/gstr2b-summary/gstr2b-data?${decryptUrl}`, {
        state: {
          titles: data.heading,
          finyear: sessionStorage.getItem(globleVariable.selectExportFromDt),
          finmonth: sessionStorage.getItem(globleVariable.selectExportToDt),
          sectionId: data.section,
          clientId: GUCParId,
          rows: data.rowCount,
          isItc: 0,
          subscriptionId: subscriptionId,
          gstNumber: GstIn,
        },
      });
    }
  };

  //** Column
  var handsontableColumns = [
    {
      data: "SrNo",
      readOnly: true,
      title: "Sr.No",
      width: 30,
      maxWidth: "50px",
    },
    {
      data: "Heading",
      readOnly: true,
      title: "Heading",
      width: 280,
      maxWidth: "300px",
    },
    {
      data: "SectionName",
      readOnly: true,
      title: "GSTR-3B",
      width: 70,
      maxWidth: "100px",
    },
    {
      data: "IGST",
      readOnly: true,

      title: "IGST (₹)",
      width: 70,
      maxWidth: "100px",
    },
    {
      data: "CGST",
      readOnly: true,

      title: "CGST (₹)",
      width: 70,
      maxWidth: "100px",
    },
    {
      data: "SGST",
      readOnly: true,

      title: "SGST (₹)",
      width: 70,
      maxWidth: "100px",
    },
    {
      data: "Cess",
      readOnly: true,

      title: "CESS (₹)",
      width: 70,
      maxWidth: "100px",
    },

    {
      data: "IsClickable",
      readOnly: true,
      title: "isClickable",
    },
    {
      data: "GstR2BSummaryId",
      readOnly: true,
      title: "gstR2BSummaryId",
    },
    {
      data: "RowCount",
      readOnly: true,
      title: "rowCount",
    },
    {
      data: "SectionId",
      readOnly: true,
      title: "sectionId",
    },
  ];

  //** Cell mouse handsontable event
  function localAfterOnCellMouseDown(event, coords, td) {
    const hot = hotRef?.current?.hotInstance;
    if (coords.row !== -1 && coords.row !== 0) {
      if (coords.col == 1) {
        if (
          hot.getDataAtRow(coords.row)[0] == null ||
          hot.getDataAtRow(coords.row)[0] == ""
        ) {
          const obj = {
            isClickable: hot.getDataAtRow(coords.row)[7], // clicked
            rowCount: hot.getDataAtRow(coords.row)[9], // count
            heading: hot.getDataAtRow(coords.row)[1],
            section: hot.getDataAtRow(coords.row)[10],
          };
          console.log(obj, "obj")
          onRowClick(obj);
        }
      }
    }
  }

  //** Hide filter / text align option
  const theader = (col, TH) => {
    if (col < 3) {
      TH.className = "htLeft";
    } else {
      TH.className = "htRight";
    }
  };

  return (
    <div>
      {block && <div className="loading1">Loading&#8230;</div>}
      <Card>
        <CardBody className="CardBody p-0">
          <div className="react-dataTable">

            <HotTable
              columnHeaderHeight={columnHeaderSize}
              rowHeights={RowSize}
              ref={hotRef}
              id="notItc"
              // data={store}
              style={store !== undefined && store !== null && store !== "" ? null : { textAlign: "center" }}
              data={store !== undefined && store !== null && store !== "" ? store : [{ SrNo: "No Data Found!" }]}
              mergeCells={store !== undefined && store !== null && store !== "" ? [{ row: 14, col: 1, rowspan: 1, colspan: 6 }] : [{ row: 0, col: 0, rowspan: 1, colspan: 7 }]}
              preventOverflow="horizontal"
              autoColumnSize={true}
              stretchH="all"
              columns={handsontableColumns}
              nestedRows={true}
              contextMenu={false}
              bindRowsWithHeaders={true}
              licenseKey="non-commercial-and-evaluation"
              height="auto"
              readOnly={true}
              hiddenColumns={{
                columns: [7, 8, 9, 10],
              }}
              afterOnCellMouseDown={localAfterOnCellMouseDown}
              rowHeaders={function (index) {
                return "";
              }}
              // mergeCells={false}
              cells={function (row, col) {
                if (store !== undefined && store !== null && store !== "") {
                  var cp = {};
                  const hot = hotRef?.current?.hotInstance;
                  const srNumber = hot?.getSourceDataAtRow(row)["SrNo"];

                  if (srNumber !== null && srNumber !== "null") {
                    cp.className = "parentNew";
                  } else {
                    cp.className = "child";
                  }

                  if (row > 0) {
                    if (col == 1) {
                      const igst = hot?.getSourceDataAtRow(row)["igst"];
                      if (igst !== null && igst !== "null") {
                        if (
                          row == 1 ||
                          row == 6 ||
                          row == 9 ||
                          row == 14 ||
                          row == 15
                        ) {
                          cp.className = "text-danger myRow";
                        } else {
                          cp.className = "child";
                        }
                      }
                    }
                    if (col == 3) {
                      const igst = hot?.getSourceDataAtRow(row)["igst"];
                      if (igst !== null && igst !== "null") {
                        if (
                          row == 1 ||
                          row == 6 ||
                          row == 9 ||
                          row == 14 ||
                          row == 15
                        ) {
                          cp.className = "text-end parentNew";
                        } else {
                          cp.className = "text-end";
                        }
                      }
                    }
                    if (col == 4) {
                      const cgst = hot?.getSourceDataAtRow(row)["cgst"];
                      if (cgst !== null && cgst !== "null") {
                        if (
                          row == 1 ||
                          row == 6 ||
                          row == 9 ||
                          row == 14
                          ||
                          row == 15
                        ) {
                          cp.className = "text-end parentNew";
                        } else {
                          cp.className = "text-end";
                        }
                      }
                    }
                    if (col == 5) {
                      const sgst = hot?.getSourceDataAtRow(row)["sgst"];
                      if (sgst !== null && sgst !== "null") {
                        if (
                          row == 1 ||
                          row == 6 ||
                          row == 9 ||
                          row == 14
                          ||
                          row == 15
                        ) {
                          cp.className = "text-end parentNew";
                        } else {
                          cp.className = "text-end";
                        }
                      }
                    }
                    if (col == 6) {
                      const cess = hot?.getSourceDataAtRow(row)["cess"];
                      if (cess !== null && cess !== "null") {
                        if (
                          row == 1 ||
                          row == 6 ||
                          row == 9 ||
                          row == 14
                          ||
                          row == 15
                        ) {
                          cp.className = "text-end parentNew";
                        } else {
                          cp.className = "text-end";
                        }
                      }
                    }
                  }
                  return cp;
                }
              }}
              autoWrapRow={true}
              afterGetColHeader={theader}
            />
          </div>
        </CardBody>
      </Card>
      <br></br>
    </div>
  );
};

export default GSTR2BITCNonITc;
