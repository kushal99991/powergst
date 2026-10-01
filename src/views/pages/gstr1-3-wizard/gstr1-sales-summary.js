import { Fragment, useRef } from "react";
import { Col, Label, Row, Button } from "reactstrap";
import { HotTable } from "@handsontable/react";
import { selectThemeColors } from "@utils";
import Select from "react-select";
import { useState } from "react";
import { SELECT_MAXSIZE } from "../../../configs/config";
import toast from "react-hot-toast";
import makeAnimated from "react-select/animated";
import { useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import gstr1SummaryServices from "../../../services/gstr1/gstr1Services/gstr1SummaryServices";
import Swal from "sweetalert2";
import errorCodeConfig from "../../../configs/apiErrorCodeConfig";
import { registerRenderer, textRenderer } from "handsontable/renderers";
import { registerAllModules } from "handsontable/registry";

import { globleVariable } from "../../../configs/globalVariable";
import LocalFunction from "../../../configs/getLocalFunction";
import SessionFunction from "../../../configs/getSessionFunction";
import { RowSize, columnHeaderSize } from "@configs/config";

import { ArrowRight, ArrowLeft } from "react-feather";

const finYearOption = LocalFunction.getLocalValue(
  globleVariable.rangeFilters,
  true
);
const YearList =
  finYearOption !== undefined &&
    finYearOption !== null &&
    finYearOption !== "" &&
    finYearOption !== "undefined"
    ? JSON.parse(finYearOption)
    : [];

registerAllModules();

const typeofInvoices = [];

const Gstr1SalesSummary = () => {
  // const dispatch = useDispatch();

  const gtsr1DataColumn = [
    {
      data: "typeofInvoice",
      readOnly: true,
      title: "Type Of Invoice",
      // width: '400'
    },
    {
      data: "documentCount",
      readOnly: true,
      title: "Document Count",
    },
    {
      data: "totalTaxableAmount",
      readOnly: true,
      title: "Taxable Amount (₹)",
    },
    {
      data: "igst",
      readOnly: true,
      title: "IGST (₹)",
    },
    {
      data: "cgst",
      readOnly: true,
      title: "CGST (₹)",
    },
    {
      data: "sgst",
      readOnly: true,
      title: "SGST (₹)",
    },
    {
      data: "cess",
      readOnly: true,
      title: "CESS (₹)",
    },
    {
      data: "totalTaxAmount",
      readOnly: true,
      title: "Total Tax (₹)",
    },
    {
      data: "typeofInvoiceId",
      readOnly: true,
      title: "typeofInvoiceId",
    },
  ];

  const [searchData, setSearchData] = useState(false);
  // const [block, setBlock] = useState(false)
  const navigate = useNavigate();
  const animatedComponents = makeAnimated();
  const [panDataFrom, setPanDataFrom] = useState([]);
  const [panData, setPanData] = useState([]);
  const [displayType, setDisplayType] = useState([]);
  const [finFromYear, setFinFormYear] = useState(null);
  const [monthFrom, setMonthFrom] = useState(null);
  const hotRef = useRef(null);
  const hotRefAmendment = useRef(null);
  const { setGSRT1Data, datas, setDatas, block, setBlock, stepper } =
    useOutletContext();

  const [data, setData] = useState([]);

  const G_UCParId =
    sessionStorage.getItem(globleVariable.G_UCParId) &&
    SessionFunction.getSessionValue(globleVariable.G_UCParId, true);
  const G_GSTIN =
    sessionStorage.getItem(globleVariable.G_GSTIN) &&
    SessionFunction.getSessionValue(globleVariable.G_GSTIN, true);
  const gstr1Range =
    sessionStorage.getItem(globleVariable.defaultYear) &&
    SessionFunction.getSessionValue(globleVariable.defaultYear, true);

  useEffect(() => {
    let activeTabData = {
      // InvoiceList : data?.slice(0, 11)
      // InvoiceList : datas?.slice(0, 11)
      InvoiceList: datas,
    };
    setGSRT1Data(true, activeTabData);

    // }, [data])
  }, [datas]);

  useEffect(() => {
    setPanDataFrom(YearList);
    setPanData(YearList);
    setDisplayType(true);
    setGSRT1Data(true);
  }, []);

  const theader = (col, TH) => {
    if (col == 0) {
      TH.className = "htLeft";
    } else {
      TH.className = "htRight";
    }
  };

  useEffect(() => {
    finFromYear !== null && GSTR1SalesSummaryService();
  }, [monthFrom, finFromYear]);

  useEffect(() => {
    return () => setBlock(false);
  }, []);

  useEffect(() => {
    console.log("default value");

    if (displayType == true) {
      let defaultValueFrom = null;
      let defaultValueTo = null;
      if (
        gstr1Range !== null &&
        gstr1Range !== "" &&
        gstr1Range !== undefined
      ) {
        console.log("set from date");
        defaultValueFrom = panData?.filter(
          (item) => item.value == gstr1Range
        )[0];
      } else {
        defaultValueFrom = panData?.filter(
          (item) =>
            Number(item.value) ==
            Number(
              sessionStorage.getItem(globleVariable.defaultYear) &&
              SessionFunction.getSessionValue(
                globleVariable.defaultYear,
                true
              )
            )
        )[0];
      }

      // if (sessionStorage.getItem("gstr1SelectExportToDt") !== null && sessionStorage.getItem("gstr1SelectExportToDt") !== "" && sessionStorage.getItem("gstr1SelectExportToDt") !== undefined) {
      //     defaultValueTo = panData?.filter((item) => item.value == sessionStorage.getItem("gstr1SelectExportToDt"))[0];
      // } else {
      //     defaultValueTo = panData?.filter((item) => Number(item.value) == Number(sessionStorage.getItem("defaultYear")))[0];
      // }

      if (
        defaultValueFrom !== undefined &&
        defaultValueFrom !== null &&
        defaultValueFrom !== ""
      ) {
        setFinFormYear(defaultValueFrom);
        sessionStorage.setItem("gstr1DownloadFromDt", defaultValueFrom?.value);
        SessionFunction.setSessionValue(
          globleVariable.gstr1FromDt,
          defaultValueFrom?.value,
          true
        );
      }
      // if (defaultValueTo !== undefined && defaultValueTo !== null && defaultValueTo !== "") {
      //     setMonthFrom(defaultValueTo)
      //     sessionStorage.setItem('gstr1SelectExportToDt', defaultValueTo?.value)
      // }
    }
  }, [displayType]);

  const selectFromYear = (value) => {
    console.log("value=", value);
    setFinFormYear(value);
    const setDt =
      Number(monthFrom?.srNo) > Number(value?.srNo)
        ? monthFrom
        : panDataFrom[0];
    const x = panDataFrom?.filter(
      (item) => Number(item.srNo) >= Number(value.srNo)
    );
    sessionStorage.setItem("gstr1DownloadFromDt", value?.value);
    SessionFunction.setSessionValue(
      globleVariable.gstr1FromDt,
      value?.value,
      true
    );

    setMonthFrom(setDt);
    setPanData(x);

    //sessionStorage.setItem('gstr1SelectExportToDt', setDt?.value)
  };

  function localAfterOnCellMouseDown(event, coords, td) {
    const hot = hotRef?.current?.hotInstance;

    if (coords.row !== -1 && coords.col < 1) {
      const typeofInvoiceId = hot.getDataAtRow(coords.row)[8];
      const data = hot.getDataAtRow(coords.row)[0];

      navigate("/gst-returns/gstr1-sales/gstr1-summary-details", {
        state: {
          titles: "",
          finyear: finFromYear.value,
          finmonth: finFromYear.value,
          sectionId: typeofInvoiceId,
          // sectionType: arrTypes
        },
      });
    }
  }
  function localAfterOnCellMouseDownAmendment(event, coords, td) {
    const hot = hotRefAmendment?.current?.hotInstance;

    if (coords.row !== -1 && coords.col < 1) {
      const typeofInvoiceId = hot.getDataAtRow(coords.row)[8];
      const data = hot.getDataAtRow(coords.row)[0];

      navigate("/gst-returns/gstr1-sales/gstr1-summary-details", {
        state: {
          titles: "",
          finyear: finFromYear.value,
          finmonth: finFromYear.value,
          sectionId: typeofInvoiceId,
          // sectionType: arrTypes
        },
      });
    }
  }

  const GSTR1SalesSummaryService = () => {
    setBlock(true);
    gstr1SummaryServices
      .getGSTR1Summary(G_UCParId, gstr1Range, gstr1Range)
      .then((res) => {
        if (
          res.status === 200 &&
          res.data.status === errorCodeConfig.APIDefaultCode.Success
        ) {
          setBlock(false);
          setData(res.data.data);
          setDatas(res.data.data);
          setSearchData(true);
        } else {
          setBlock(false);
          toast.error(res?.data?.errorMessage, {
            position: "top-right",
          });
        }
      })
      .catch((error) => {
        setBlock(false);
        Swal.fire({
          icon: "error",
          title: "",
          text: error?.message,
          customClass: {
            confirmButton: "btn btn-danger",
          },
          buttonsStyling: false,
        });
      });
  };

  return (
    <Fragment>
      {block && <div className="loading1">Loading&#8230;</div>}

      <div className="content-header-left col-md-12 col-12">
        <div className="row breadcrumbs-top mb-1">
          <div className="col-md-6"></div>
          <div className="col-md-6">

            <div className="row">
              <div className="col-md-12">
                <div className="row">
                  <div className="col-md-5"></div>
                  <Label className="form-label col-md-4 pt-half text-end">
                    Select Return Period
                  </Label>
                  <Select
                    id="from"
                    placeholder="From"
                    isClearable={false}
                    theme={selectThemeColors}
                    closeMenuOnSelect={true}
                    options={panDataFrom}
                    className="basic-multi-select col-md-3 ps-0"
                    classNamePrefix="select"
                    components={animatedComponents}
                    onChange={selectFromYear}
                    value={finFromYear}
                    maxMenuHeight={SELECT_MAXSIZE}
                    isDisabled={true}
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
      <div className="col-12 ">
        <Row className="mb-2">
          <Col md={12}>
            {/* {data?.length > 0 ?  */}
            {datas?.length > 0 ? (
              <HotTable
                rowHeights={RowSize}
                columnHeaderHeight={columnHeaderSize}
                autoWrapRow={true}
                data={datas.slice(0, 11)}
                // data={data.slice(0, 11)}
                autoColumnSize={true}
                afterGetColHeader={theader}
                stretchH="all"
                preventOverflow="horizontal"
                columns={gtsr1DataColumn}
                contextMenu={false}
                bindRowsWithHeaders={true}
                licenseKey="non-commercial-and-evaluation"
                height="auto"
                ref={hotRef}
                afterOnCellMouseDown={localAfterOnCellMouseDown}
                mergeCells={false}
                hiddenColumns={{
                  columns: [8],
                }}
                cells={function (row, col) {
                  var cp = {};
                  const hot = hotRef?.current?.hotInstance;
                  cp.className = "child";
                  if (col == 0) {
                    cp.className = "text-danger myRow";
                  }
                  if (col > 0) {
                    cp.className = "text-end";
                  }

                  return cp;
                }}
              // width="100%"
              // manualColumnResize={true}
              // colWidths={100}
              />
            ) : (
              <HotTable
              rowHeights={RowSize}
              columnHeaderHeight={columnHeaderSize}
                autoWrapRow={true}
                afterGetColHeader={theader}
                mergeCells={[{ row: 0, col: 0, rowspan: 1, colspan: 8 }]}
                autoColumnSize={true}
                stretchH="all"
                style={{ overflowX: "hidden", textAlign: "center" }}
                data={[{ typeofInvoice: "No Data Found!" }]}
                preventOverflow="horizontal"
                columns={gtsr1DataColumn}
                contextMenu={false}
                bindRowsWithHeaders={true}
                hiddenColumns={{
                  columns: [8],
                }}
                licenseKey="non-commercial-and-evaluation"
                height="auto"
              />
            )}
          </Col>
          <div>
            <h2 className="mt-2 mb-1">Amendment Data</h2>
          </div>
          <Col md={12}>
            {datas?.length > 0 ? (
              <HotTable
              rowHeights={RowSize}
              columnHeaderHeight={columnHeaderSize}
                // {data?.length > 0 ? <HotTable
                // data={data.slice(11)}
                data={datas.slice(11)}
                // autoColumnSize={true}
                afterGetColHeader={theader}
                stretchH="all"
                preventOverflow="horizontal"
                columns={gtsr1DataColumn}
                contextMenu={false}
                bindRowsWithHeaders={true}
                licenseKey="non-commercial-and-evaluation"
                height="auto"
                ref={hotRefAmendment}
                autoWrapRow={true}
                afterOnCellMouseDown={localAfterOnCellMouseDownAmendment}
                mergeCells={false}
                hiddenColumns={{
                  columns: [8],
                }}
                cells={function (row, col) {
                  var cp = {};
                  const hot = hotRefAmendment?.current?.hotInstance;
                  cp.className = "child";
                  if (col == 0) {
                    cp.className = "text-danger myRow";
                  }
                  if (col > 0) {
                    cp.className = "text-end";
                  }

                  return cp;
                }}
              // width="100%"
              // manualColumnResize={true}
              // colWidths={100}
              />
            ) : (
              <HotTable
              rowHeights={RowSize}
              columnHeaderHeight={columnHeaderSize}
                mergeCells={[{ row: 0, col: 0, rowspan: 1, colspan: 8 }]}
                autoColumnSize={true}
                stretchH="all"
                afterGetColHeader={theader}
                autoWrapRow={true}
                style={{ overflowX: "hidden", textAlign: "center" }}
                data={[{ typeofInvoice: "No Data Found!" }]}
                preventOverflow="horizontal"
                columns={gtsr1DataColumn}
                contextMenu={false}
                hiddenColumns={{
                  columns: [8],
                }}
                bindRowsWithHeaders={true}
                licenseKey="non-commercial-and-evaluation"
                height="auto"
              />
            )}
          </Col>
        </Row>
      </div>

      <div className="d-flex justify-content-between">
        <Button color="secondary" className="btn-prev" outline disabled>
          <ArrowLeft
            size={14}
            className="align-middle me-sm-25 me-0"
          ></ArrowLeft>
          <span className="align-middle d-sm-inline-block d-none">
            Previous
          </span>
        </Button>
        <Button
          color="danger"
          className="btn-next"
          onClick={() => stepper.next()}
        >
          <span className="align-middle d-sm-inline-block d-none">Next</span>
          <ArrowRight
            size={14}
            className="align-middle ms-sm-25 ms-0"
          ></ArrowRight>
        </Button>
      </div>
    </Fragment>
  );
};

export default Gstr1SalesSummary;
