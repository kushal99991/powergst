import { Fragment, useRef, useState, useEffect } from "react";
import { Col, Label, Row, Button } from "reactstrap";
import { selectThemeColors } from "@utils";
import Select from "react-select";
import {
  columnHeaderSize,
  RowSize,
  SELECT_MAXSIZE,
} from "../../../configs/config";
import makeAnimated from "react-select/animated";
import { useNavigate, useOutletContext } from "react-router-dom";
import { registerAllModules } from "handsontable/registry";
import { globleVariable } from "../../../configs/globalVariable";
import LocalFunction from "../../../configs/getLocalFunction";
import SessionFunction from "../../../configs/getSessionFunction";
import { Search } from "react-feather";
import { textRenderer } from "handsontable/renderers";
import { HotTable } from "@handsontable/react";
import tdstcsFiledService from "../../../services/tdstcsFiled/tdstcsFiledService";
import { urlEndpointConfig } from "../../../configs/urlEndpoint";
import Footer from "./footer";
import Swal from "sweetalert2";

registerAllModules();
const animatedComponents = makeAnimated();

const TDSTCSSummary = () => {
  const hotRef = useRef(null);

  const navigate = useNavigate();

  const [finFromYear, setFinFormYear] = useState(null);
  const [finToYear, setFinToYear] = useState(null);

  const {
    block,
    setBlock,
    wizardBtn,
    setFromYear,
    setToYear,
    stepper,
    setTDSTCSData,
  } = useOutletContext();

  useEffect(() => {
    if (finFromYear) setFromYear(finFromYear);
    if (finToYear) setToYear(finToYear);
  }, [finFromYear, finToYear]);

  const [panDataFrom, setPanDataFrom] = useState([]);
  const [panData, setPanData] = useState([]);

  const [data, setData] = useState([]);

  const G_UCParId =
    sessionStorage.getItem(globleVariable.G_UCParId) &&
    SessionFunction.getSessionValue(globleVariable.G_UCParId, true);

  const finYearOption =
    localStorage.getItem(globleVariable.rangeFilters) &&
    LocalFunction.getLocalValue(globleVariable.rangeFilters, true);

  const isdefaultYear =
    sessionStorage.getItem(globleVariable.defaultYear) &&
    SessionFunction.getSessionValue(globleVariable.defaultYear, true);

  const YearList =
    finYearOption !== undefined &&
    finYearOption !== null &&
    finYearOption !== "" &&
    finYearOption !== "undefined"
      ? JSON.parse(finYearOption)
      : [];

  useEffect(() => {
    if (wizardBtn == 1) {
      onDateSelect();
    }
  }, [wizardBtn]);

  useEffect(() => {
    setPanDataFrom(YearList);
    setPanData(YearList);
    setTDSTCSData(true, { activeTab: 0, clearFilters: () => {}, getData });
  }, []);

  const tdstcsDataColumn = [
    {
      data: "typeofInvoice",
      readOnly: true,
      title: "Type Of Invoices",
      width: "300",
    },
    {
      data: "status",
      readOnly: true,
      title: "Status",
    },
    {
      data: "documentCount",
      readOnly: true,
      title: "Document Count",
      width: "120",
    },
    {
      data: "totalTaxableAmount",
      readOnly: true,
      title: "Taxable Amount (₹)",
      width: "130",
    },
    {
      data: "totalAmount",
      readOnly: true,
      title: "Total Amount (₹)",
      width: "130",
    },
    {
      data: "totalNetValue",
      readOnly: true,
      title: "Total Net Value (₹)",
      width: "130",
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
  ];

  const onDateSelect = () => {
    let defaultValueFrom = null;
    let defaultValueTo = null;

    defaultValueFrom = YearList?.filter(
      (item) => Number(item.value) == Number(isdefaultYear)
    )[0];

    defaultValueTo = YearList?.filter(
      (item) => Number(item.value) == Number(isdefaultYear)
    )[0];

    if (
      defaultValueFrom !== undefined &&
      defaultValueFrom !== null &&
      defaultValueFrom !== ""
    ) {
      setFinFormYear(defaultValueFrom);
    }
    if (
      defaultValueTo !== undefined &&
      defaultValueTo !== null &&
      defaultValueTo !== ""
    ) {
      setFinToYear(defaultValueTo);
    }

    getData(defaultValueFrom?.value, defaultValueTo?.value);
  };

  const getData = (
    fromRange = finFromYear?.value,
    toRange = finToYear?.value
  ) => {
    setBlock(true);

    tdstcsFiledService
      .getTdsTcsSummary(fromRange, toRange, G_UCParId)
      .then((res) => {
        if (res.status === 200) {
          setData(res?.data?.data);
          setBlock(false);
        }
      })
      .catch((error) => {
        setBlock(false);
        Swal.fire({
          icon: "error",
          title: "",
          text: error?.message,
        });
      });
  };

  const selectFromYear = (value) => {
    setFinFormYear(value);
    const setDt =
      Number(finToYear?.srNo) > Number(value?.srNo)
        ? finToYear
        : panDataFrom[0];
    const x = panDataFrom?.filter(
      (item) => Number(item.srNo) >= Number(value.srNo)
    );

    setFinToYear(setDt);
    setPanData(x);
  };

  const selectFromMonth = (value) => {
    setFinToYear(value);

    if (Number(finFromYear?.srNo) > Number(value?.srNo)) {
      const fromFilter = panDataFrom?.filter(
        (item) => Number(item.srNo) == Number(value.srNo)
      )[0];
      setFinFormYear(fromFilter);
    }
  };

  function localAfterOnCellMouseDown(event, coords, td) {
    if (coords.row !== -1 && coords.col < 1) {
      navigate(urlEndpointConfig.TDSTCS_INVOICES, {
        state: {
          titles: "",
          sectionId: data?.[coords.row]?.typeofInvoiceId,
          finFromYear,
          finToYear,
        },
      });
    }
  }

  const theader = (col, TH) => {
    if (col == 0) {
      TH.className = "htLeft";
    } else {
      TH.className = "htRight";
    }
  };

  const onClickSearch = () => {
    getData(finFromYear.value, finToYear.value);
  };

  function emptyRender(instance, td, row, col, prop, value, cellProperties) {
    textRenderer.apply(this, arguments);
    if (col == 2 || col == 3 || col == 4 || col == 5 || col == 6 || col == 7) {
      let currnecyVal =
        col == 1
          ? formatTotalWithoutDecimal(Number(value))
          : formatINR(Number(value));

      if (currnecyVal !== 0) {
        td.innerText = currnecyVal;
      }
    }
  }

  function formatINR(x) {
    return x.toLocaleString("en-IN", { minimumFractionDigits: 2 });
  }

  function formatTotalWithoutDecimal(x) {
    return x.toLocaleString("en-IN");
  }

  const hasData = data?.length > 0;

  return (
    <Fragment>
      {block && <div className="loading1">Loading&#8230;</div>}

      <div className="content-header-left col-md-12 col-12">
        <div className="row breadcrumbs-top mb-1">
          <div className="col-md-6"></div>
          <div className="col-md-6">
            <div className="row">
              <div className="col-md-2 "></div>
              <div className="col-md-4">
                <div className="row">
                  <Label className="form-label col-md-2 pt-half ps-0">
                    From
                  </Label>
                  <Select
                    id="from"
                    placeholder="From"
                    isClearable={false}
                    theme={selectThemeColors}
                    closeMenuOnSelect={true}
                    options={panDataFrom}
                    className="basic-multi-select col-md-10"
                    classNamePrefix="select"
                    components={animatedComponents}
                    onChange={selectFromYear}
                    value={finFromYear}
                    maxMenuHeight={SELECT_MAXSIZE}
                  />
                </div>
              </div>

              <div className="col-md-4">
                <div className="row">
                  <Label className="form-label col-md-2 pt-half">To</Label>
                  <Select
                    id="to"
                    placeholder="To"
                    isClearable={false}
                    theme={selectThemeColors}
                    closeMenuOnSelect={true}
                    options={panData}
                    components={animatedComponents}
                    className="basic-multi-select col-md-10"
                    classNamePrefix="select"
                    onChange={selectFromMonth}
                    value={finToYear}
                    maxMenuHeight={SELECT_MAXSIZE}
                  />
                </div>
              </div>
              <div className="col-md-2 text-md-end ps-0">
                <Button
                  onClick={onClickSearch}
                  className="btn-icon btn-round"
                  color="danger"
                  outline
                >
                  <Search size={12} />
                  &nbsp;Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-12">
        <div>
          <Row>
            <Col md={12}>
              <HotTable
                data={hasData ? data : [{ typeofInvoice: "No Data Found!" }]}
                stretchH="all"
                preventOverflow="horizontal"
                columns={tdstcsDataColumn}
                contextMenu={false}
                bindRowsWithHeaders={true}
                licenseKey="non-commercial-and-evaluation"
                height="auto"
                rowHeights={RowSize}
                autoColumnSize={{
                  samplingRatio: 23,
                }}
                manualColumnResize={true}
                columnHeaderHeight={columnHeaderSize}
                ref={hotRef}
                afterOnCellMouseDown={localAfterOnCellMouseDown}
                mergeCells={
                  hasData ? false : [{ row: 0, col: 0, rowspan: 1, colspan: 8 }]
                }
                hiddenColumns={{
                  columns: [],
                }}
                afterGetColHeader={theader}
                cells={function (row, col) {
                  var cp = {};
                  if (hasData) {
                    if (col !== null) {
                      cp.renderer = emptyRender;
                    }
                    cp.className = "child";
                    if (col > 0) {
                      cp.className = "text-end";
                    }

                    if (col == 0) {
                      cp.className = "text-danger cursor-pointer";
                    }
                  } else {
                    cp.className = "text-center";
                  }

                  return cp;
                }}
                width="100%"
                colWidths={100}
              />
            </Col>
          </Row>
        </div>
      </div>
      <Footer
        stepper={stepper}
        onNext={() => stepper.next()}
        onPrevious={() => stepper.previous()}
      />
    </Fragment>
  );
};

export default TDSTCSSummary;
