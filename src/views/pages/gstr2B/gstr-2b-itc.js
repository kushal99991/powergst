import { useState, useRef } from "react";
import { useEffect } from "react";
import {
  Link,
  useLocation,
  useSearchParams,
  useNavigate,
} from "react-router-dom";
import { Button, Card, CardBody, CardText, Row, Col, Label } from "reactstrap";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import encryptData from "../../../auth/crypto/crypto";
//** Handsontable
import { HotTable, HotColumn } from "@handsontable/react";
import Handsontable from "handsontable";
import { registerRenderer, textRenderer } from "handsontable/renderers";
//
import { registerAllModules } from "handsontable/registry";
import $ from "jquery";
import { LINK_MESSAGE, RowSize, columnHeaderSize } from "@configs/config";
import { globleVariable } from "../../../configs/globalVariable";
import SessionFunction from "../../../configs/getSessionFunction";

//** register Handsontable's modules
registerAllModules();


const GSTR2BITC = (props) => {

  const { subscriptionId, GstIn } = props


  const isCmpySelection =
    sessionStorage.getItem(globleVariable.isCompany) !== null &&
      sessionStorage.getItem(globleVariable.isCompany) !== "" &&
      sessionStorage.getItem(globleVariable.isCompany) !== undefined &&
      sessionStorage.getItem(globleVariable.isCompany) !== false &&
      sessionStorage.getItem(globleVariable.isCompany) !== "false"
      ? true
      : false;

  const GUCParId =
    sessionStorage.getItem(globleVariable.G_UCParId) &&
    SessionFunction.getSessionValue(globleVariable.G_UCParId, true);

  const store = useSelector((state) => state?.users?.GSTR2BSummary?.[0]?.Summary?.ITC);
  const location = useLocation();

  let clientId = null;
  if (location.state !== null) {
    clientId =
      location.state.clientId !== null ? location.state.clientId : null;
  }

  const navigate = useNavigate();
  const hotRef = useRef(null);
  const [data, setData] = useState([]);
  const [block, setBlock] = useState(false);

  useEffect(() => {
    return () => setBlock(false);
  }, []);

  // ** store data
  useEffect(() => {
    if (isCmpySelection == true) {
      if (store !== undefined) {
        setData(store);
      }
    }
  }, [store]);

  //** check company selection
  useEffect(() => {
    console.log("isCmpySelection - itc", isCmpySelection);
    if (isCmpySelection == false) {
      toast.error(LINK_MESSAGE, {
        position: "top-right",
      });

      setTimeout(() => {
        navigate("/dashboard/company");
      }, 1000);
    }
  }, []);

  const hot = hotRef?.current?.hotInstance;

  //** Cell Click event function
  const onRowClick = (data) => {
    console.log(data, "dattttttta")
    if (data.isClickable == false) {
      const decryptUrl = encryptData.encryptData(
        "clientId=" +
        GUCParId +
        "&rows=" +
        data.section +
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
          rows: data.section,
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
      data: "GSTR2BSummaryId",
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

  //** Cell mouse event
  function localAfterOnCellMouseDown(event, coords, td) {
    const hot = hotRef?.current?.hotInstance;
    if (coords.row !== -1 && coords.row !== 0) {
      if (coords.col == 1) {
        if (
          hot.getDataAtRow(coords.row)[0] == null ||
          hot.getDataAtRow(coords.row)[0] == ""
        ) {
          console.log("in click");
          const obj = {
            isClickable: hot.getDataAtRow(coords.row)[7], // clicked
            rowCount: hot.getDataAtRow(coords.row)[9], // count
            heading: hot.getDataAtRow(coords.row)[1],
            section: hot.getDataAtRow(coords.row)[10]
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

  function firstRowRenderer(instance, td, row, col, prop, value, cellProperties) {
    Handsontable.renderers.TextRenderer.apply(this, arguments);



    // if(col == -1) {
    //   td.style.background = '#CEC';
    // } 

  }

  return (
    <div>
      {block && <div className="loading1">Loading&#8230;</div>}
      <Card>
        <CardBody className="CardBody p-0">
          <Row>
            <Col md="12">
              <div>

                <HotTable
                  columnHeaderHeight={columnHeaderSize}
                  rowHeights={RowSize}
                  autoColumnSize={true}
                  stretchH="all"
                  ref={hotRef}
                  id="Itc"
                  style={store !== undefined && store !== null && store !== "" ? null : { textAlign: "center" }}
                  data={store !== undefined && store !== null && store !== "" ? store : [{ SrNo: "No Data Found!" }]}
                  mergeCells={store !== undefined && store !== null && store !== "" ? [
                    { row: 0, col: 1, rowspan: 1, colspan: 6 },
                    { row: 19, col: 1, rowspan: 1, colspan: 6 },
                  ] : [{ row: 0, col: 0, rowspan: 1, colspan: 7 }]}
                  preventOverflow="horizontal"
                  rowHeaders={function (index) {
                    return "";
                  }}
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
                  cells={function (row, col) {

                    if (store !== undefined && store !== null && store !== "") {

                      var cp = {};
                      const hot = hotRef?.current?.hotInstance;
                      const srNumber = hot?.getSourceDataAtRow(row)["SrNo"];


                      if (srNumber !== null && srNumber !== "null") {
                        cp.className = "parent";
                      } else {
                        cp.className = "child";
                      }
                      // if (col == 1) {
                      //   cp.className = "text-danger myRow";
                      // }
                      if (row > 0) {


                        if (col == 1) {
                          const igst = hot?.getSourceDataAtRow(row)["igst"];
                          if (igst !== null && igst !== "null") {
                            if (
                              row == 1 ||
                              row == 6 ||
                              row == 9 ||
                              row == 14 ||
                              row == 19 ||
                              row == 20
                            ) {
                              // cp.className = "text-end parent";
                            } else {
                              cp.className = "text-danger myRow";
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
                              row == 19 ||
                              row == 20
                            ) {
                              cp.className = "text-end parent";
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
                              row == 14 ||
                              row == 19 ||
                              row == 20
                            ) {
                              cp.className = "text-end parent";
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
                              row == 14 ||
                              row == 19 ||
                              row == 20
                            ) {
                              cp.className = "text-end parent";
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
                              row == 14 ||
                              row == 19 ||
                              row == 20
                            ) {
                              cp.className = "text-end parent";
                            } else {
                              cp.className = "text-end";
                            }
                          }
                        }

                        cp.renderer = firstRowRenderer;

                      }


                      return cp;
                    }
                  }}
                  // mergeCells={false}
                  autoWrapRow={true}
                  afterGetColHeader={theader}
                />
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>
      <br></br>
    </div>
  );
};

export default GSTR2BITC;
