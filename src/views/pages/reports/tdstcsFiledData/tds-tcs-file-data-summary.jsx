import { Fragment, useEffect, useRef } from "react";
import { Button, Col, Label, Row } from "reactstrap";
import { HotTable } from "@handsontable/react";
import { selectThemeColors } from "@utils";
import Select from "react-select";
import { useState } from "react";
import {
  RowSize,
  SELECT_MAXSIZE,
  columnHeaderSize,
} from "../../../../configs/config";
import makeAnimated from "react-select/animated";
import { useNavigate, useOutletContext } from "react-router-dom";
import { registerAllModules } from "handsontable/registry";
import { globleVariable } from "../../../../configs/globalVariable";
import { useDispatch, useSelector } from "react-redux";
import { Search } from "react-feather";
import { textRenderer } from "handsontable/renderers";
import LocalFunction from "../../../../configs/getLocalFunction";
import SessionFunction from "../../../../configs/getSessionFunction";
import { getTDSTCSFiledSummary } from "../../../apps/user/store";
import { urlEndpointConfig } from "../../../../configs/urlEndpoint";

registerAllModules();

const TDSTCSFileDataSummary = () => {
  const finYearOption =
    localStorage.getItem(globleVariable.rangeFilters) &&
    LocalFunction.getLocalValue(globleVariable.rangeFilters, true);

  const YearList =
    finYearOption !== undefined &&
    finYearOption !== null &&
    finYearOption !== "" &&
    finYearOption !== "undefined"
      ? JSON.parse(finYearOption)
      : [];

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

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const animatedComponents = makeAnimated();
  const [panDataFrom, setPanDataFrom] = useState([]);
  const [panData, setPanData] = useState([]);
  const [finFromYear, setFinFormYear] = useState(null);
  const [finToYear, setFinToYear] = useState(null);
  const [data, setData] = useState([]);

  const hotRef = useRef(null);

  const tdstcsfiledDataState = useSelector(
    (state) => state?.users?.TDSTCSFiledSummary?.[0]?.Summary
  );

  const tdstcsFiledFromDt =
    sessionStorage.getItem(globleVariable.tdstcsFiledFromDt) &&
    SessionFunction.getSessionValue(globleVariable.tdstcsFiledFromDt, true);

  const tdstcsFiledToDt =
    sessionStorage.getItem(globleVariable.tdstcsFiledToDt) &&
    SessionFunction.getSessionValue(globleVariable.tdstcsFiledToDt, true);

  const isdefaultYear =
    sessionStorage.getItem(globleVariable.defaultYear) &&
    SessionFunction.getSessionValue(globleVariable.defaultYear, true);

  const {
    setTDSTCSData,
    wizardBtn,
    block,
    setBlock,
    setTdsTcsSectionId
    // downloadStart,
    // downloadDate,
    // setDownloadDate,
  } = useOutletContext();

  const clientId =
    sessionStorage.getItem(globleVariable.G_UCParId) &&
    SessionFunction.getSessionValue(globleVariable.G_UCParId, true);
  const subId =
    localStorage.getItem(globleVariable.subscriptionId) &&
    LocalFunction.getLocalValue(globleVariable.subscriptionId, true);
  const GGSTIN =
    sessionStorage.getItem(globleVariable.G_GSTIN) &&
    SessionFunction.getSessionValue(globleVariable.G_GSTIN, true);

  useEffect(() => {
    setPanDataFrom(YearList);
    setPanData(YearList);
    setTDSTCSData(true);
    setTdsTcsSectionId("0");
  }, []);

  // useEffect(() => {
  //   if (wizardBtn === 1 && finFromYear !== null) {
  //     const userData = {
  //       clientid: clientId,
  //       finyear: finFromYear?.value,
  //       finmonth: finToYear?.value,
  //       subscriptionId: subId,
  //       gstNumber: GGSTIN,
  //       upload: false,
  //       setLoader: setBlock
  //     };

  //     dispatch(getTDSTCSFiledSummary(userData));
  //   }
  // }, [wizardBtn]);

  useEffect(() => {
    if (tdstcsfiledDataState) {
      setData(tdstcsfiledDataState);
    }
  }, [tdstcsfiledDataState, wizardBtn]);

  useEffect(() => {
    return () => setBlock(false);
  }, []);

  useEffect(() => {
    if (wizardBtn == 1) {
      onDateSelect();
    }
  }, [wizardBtn]);

  // useEffect(() => {
  //   if (downloadDate) {
  //     onDateSelect();
  //     const userData = {
  //       clientid: clientId,
  //       finyear: tdstcsFiledFromDt,
  //       finmonth: tdstcsFiledFromDt,
  //       subscriptionId: subId,
  //       gstNumber: GGSTIN,
  //       upload: false,
  //       setLoader: setBlock
  //     };
  //     setDownloadDate(false);
  //     dispatch(getTDSTCSFiledSummary(userData));
  //   }
  // }, [downloadDate]);

  // useEffect(() => {
  //   if (downloadStart) {
  //     const userData = {
  //       clientid: clientId,
  //       finyear: finFromYear?.value,
  //       finmonth: monthFrom?.value,
  //       subscriptionId: subId,
  //       gstNumber: GGSTIN,
  //       setLoader: setBlock
  //     };

  //     // setBlock(true);
  //     dispatch(getTDSTCSFiledSummary(userData));
  //   }
  // }, [downloadStart]);

  const onClickSearch = () => {
    getData(finFromYear.value, finToYear.value);
  };

  const onDateSelect = () => {
    let defaultValueFrom = null;
    let defaultValueTo = null;
    if (
      tdstcsFiledFromDt !== null &&
      tdstcsFiledFromDt !== "" &&
      tdstcsFiledFromDt !== undefined
    ) {
      defaultValueFrom = YearList?.filter(
        (item) => item.value == tdstcsFiledFromDt
      )[0];
    } else {
      defaultValueFrom = YearList?.filter(
        (item) => Number(item.value) == Number(isdefaultYear)
      )[0];
    }

    if (
      tdstcsFiledToDt !== null &&
      tdstcsFiledToDt !== "" &&
      tdstcsFiledToDt !== undefined
    ) {
      defaultValueTo = YearList?.filter(
        (item) => item.value == tdstcsFiledToDt
      )[0];
    } else {
      defaultValueTo = YearList?.filter(
        (item) => Number(item.value) == Number(isdefaultYear)
      )[0];
    }

    if (
      defaultValueFrom !== undefined &&
      defaultValueFrom !== null &&
      defaultValueFrom !== ""
    ) {
      setFinFormYear(defaultValueFrom);
      // SessionFunction.setSessionValue(
      //   globleVariable.tdstcsFiledFromDt,
      //   defaultValueFrom?.value,
      //   true
      // );
    }
    if (
      defaultValueTo !== undefined &&
      defaultValueTo !== null &&
      defaultValueTo !== ""
    ) {
      setFinToYear(defaultValueTo);
      // SessionFunction.setSessionValue(
      //   globleVariable.tdstcsFiledToDt,
      //   defaultValueTo?.value,
      //   true
      // );
    }

    getData(defaultValueFrom?.value, defaultValueTo?.value);
  };

  const getData = (fromRange, toRange) => {
    const userData = {
      clientid: clientId,
      fromRange,
      toRange,
      subscriptionId: subId,
      gstNumber: GGSTIN,
      upload: false,
      setLoader: setBlock,
    };

    dispatch(getTDSTCSFiledSummary(userData));
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

  const theader = (col, TH) => {
    if (col == 0) {
      TH.className = "htLeft";
    } else {
      TH.className = "htRight";
    }
  };

  function localAfterOnCellMouseDown(event, coords, td) {
    const hot = hotRef?.current?.hotInstance;

    if (coords.row !== -1 && coords.col < 1) {
      // const typeofInvoiceId = hot.getDataAtRow(coords.row)[8];
      // // const data = hot.getDataAtRow(coords.row)[0];

      navigate(urlEndpointConfig.TDS_TCS_FILE_DATA_DETAILS, {
        state: {
          titles: "",
          finyear: finFromYear.value,
          finmonth: finToYear.value,
          sectionId: data?.[coords?.row]?.typeofInvoiceId,
          finFromYear,
          finToYear
        },
      });
    }
  }

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
    </Fragment>
  );
};

export default TDSTCSFileDataSummary;
