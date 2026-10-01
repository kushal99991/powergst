import { Fragment, useRef } from "react";
import { Button, Col, Label, Row } from "reactstrap";
import { HotTable } from "@handsontable/react";
import { selectThemeColors } from "@utils";
import Select from "react-select";
import { useState } from "react";
import { RowSize, SELECT_MAXSIZE, columnHeaderSize } from "../../../../configs/config";
import toast from "react-hot-toast";
import makeAnimated from "react-select/animated";
import { useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import gstr1FiledSummaryService from "../../../../services/gstr1/gstr1DataFileService/gstr1SummaryServices";
import Swal from "sweetalert2";
import errorCodeConfig from "../../../../configs/apiErrorCodeConfig";
import { registerAllModules } from "handsontable/registry";
import { globleVariable } from "../../../../configs/globalVariable";
import LocalFunction from "../../../../configs/getLocalFunction";
import SessionFunction from "../../../../configs/getSessionFunction";
import { getGSTR1FiledSummary } from "../../../apps/user/store";
import { useDispatch, useSelector } from "react-redux";
import { Search } from "react-feather";
import { textRenderer } from "handsontable/renderers";

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

registerAllModules();

const Gstr1FileDataSummary = () => {
  const gstrfiledDataState = useSelector(
    (state) => state?.users?.GSTR1FiledSummary?.[0]?.Summary
  );
  const loader = useSelector(
    (state) => state?.users
  );
  console.log(loader?.GSTR1FiledSummary,"looader")

  const gstrfiledDataDetailState = useSelector(
    (state) => state?.users?.GSTR1FiledSummary?.[0]?.Data
  );

  const gtsr1DataColumn = [
    {
      data: "TypeofInvoice",
      readOnly: true,
      title: "Type Of Invoice",
      width: "320",
    },
    {
      data: "DocumentCount",
      readOnly: true,
      title: "Document Count",
      width: "120"
    },
    {
      data: "TotalTaxableAmount",
      readOnly: true,
      title: "Taxable Amount (₹)",
      width: "130",
    },
    {
      data: "IGST",
      readOnly: true,
      title: "IGST (₹)",
      // width: '120'
    },
    {
      data: "CGST",
      readOnly: true,
      title: "CGST (₹)",
      // width: '120'
    },
    {
      data: "SGST",
      readOnly: true,
      title: "SGST (₹)",
      // width: '120'
    },
    {
      data: "Cess",
      readOnly: true,
      title: "CESS (₹)",
      // width: '120'
    },
    {
      data: "TotalTaxAmount",
      readOnly: true,
      title: "Total Tax (₹)",
      // width: '120'
    },
    {
      data: "TypeofInvoiceId",
      readOnly: true,
      title: "typeofInvoiceId",
    },
  ];

  const gstr1FiledFromDt =
    sessionStorage.getItem(globleVariable.gstr1FiledFromDt) &&
    SessionFunction.getSessionValue(globleVariable.gstr1FiledFromDt, true);
  const gstr1FiledToDt =
    sessionStorage.getItem(globleVariable.gstr1FiledToDt) &&
    SessionFunction.getSessionValue(globleVariable.gstr1FiledToDt, true);
  const isdefaultYear =
    sessionStorage.getItem(globleVariable.defaultYear) &&
    SessionFunction.getSessionValue(globleVariable.defaultYear, true);
  const isG_UCParId =
    sessionStorage.getItem(globleVariable.G_UCParId) &&
    SessionFunction.getSessionValue(globleVariable.G_UCParId, true);
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
  const {
    setGSRT1Data,
    wizardBtn,
    block,
    setBlock,
    downloadStart,
    setDownloadStart,
    downloadDate,
    setDownloadDate
  } = useOutletContext();
  const [data, setData] = useState([]);

  const dispatch = useDispatch();

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
    setDisplayType(true);
    setGSRT1Data(true);
  }, []);

  // useEffect(() => {
  //   // monthFrom !== null && wizardBtn === 1 && GSTR1SalesSummaryService();
  //   setBlock(true);
  //   if (wizardBtn === 1 && finFromYear !== null) {
  //     const userData = {
  //       clientid: clientId,
  //       finyear: finFromYear?.value,
  //       finmonth: monthFrom?.value,
  //       subscriptionId: subId,
  //       gstNumber: GGSTIN,
  //       upload: false
  //     };
  //     setBlock(true)
  //     console.log("theseiscalling")
  //     dispatch(getGSTR1FiledSummary(userData));
  //   }
  // }, [wizardBtn]);

  const checkAPIFire = sessionStorage.getItem("setRefreshAPIReportDataDeletGSTR1Filed");
  
  useEffect(() => {
    // if (((checkAPIFire== "true" || checkAPIFire==true) || wizardBtn == 1) && finFromYear?.value == undefined){
      if ( wizardBtn == 1 && finFromYear?.value != undefined){
        console.log(wizardBtn,"theseiscalling")
      const userData = {
        clientid: clientId,
        finyear: finFromYear?.value,
        finmonth: monthFrom?.value,
        subscriptionId: subId,
        gstNumber: GGSTIN,
        upload: false
      };

      setBlock(true);
      dispatch(getGSTR1FiledSummary(userData));
      sessionStorage.setItem("setRefreshAPIReportDataDeletGSTR1Filed",false)
    }
  }, [wizardBtn]);


  useEffect(() => {
    if (gstrfiledDataState) {
      setBlock(false);
      console.log(gstrfiledDataState, "state data");
      setData(gstrfiledDataState);
    }
  }, [gstrfiledDataState, wizardBtn]);

  useEffect(() => {
    return () => setBlock(false);
  }, []);

  const onClickSearch = () => {
    const userData = {
      clientid: clientId,
      finyear: finFromYear?.value,
      finmonth: monthFrom?.value,
      subscriptionId: subId,
      gstNumber: GGSTIN,
      upload: false
    };

    SessionFunction.setSessionValue(
      globleVariable.gstr1FiledFromDt,
      finFromYear?.value,
      true
    );
    SessionFunction.setSessionValue(
      globleVariable.gstr1FiledToDt,
      monthFrom?.value,
      true
    );

    setBlock(true);
    console.log("theseiscalling")
    dispatch(getGSTR1FiledSummary(userData));
  };

  // useEffect(() => {
  //   console.log("default value");
  //   if (displayType == true) {
  //     let defaultValueFrom = null;
  //     let defaultValueTo = null;
  //     if (
  //       gstr1FiledFromDt !== null &&
  //       gstr1FiledFromDt !== "" &&
  //       gstr1FiledFromDt !== undefined
  //     ) {
  //       console.log("set from date");
  //       defaultValueFrom = panData?.filter(
  //         (item) => item.value == gstr1FiledFromDt
  //       )[0];
  //     } else {
  //       defaultValueFrom = panData?.filter(
  //         (item) => Number(item.value) == Number(isdefaultYear)
  //       )[0];
  //     }

  //     if (
  //       gstr1FiledToDt !== null &&
  //       gstr1FiledToDt !== "" &&
  //       gstr1FiledToDt !== undefined
  //     ) {
  //       defaultValueTo = panData?.filter(
  //         (item) => item.value == gstr1FiledToDt
  //       )[0];
  //     } else {
  //       defaultValueTo = panData?.filter(
  //         (item) => Number(item.value) == Number(isdefaultYear)
  //       )[0];
  //     }

  //     if (
  //       defaultValueFrom !== undefined &&
  //       defaultValueFrom !== null &&
  //       defaultValueFrom !== ""
  //     ) {
  //       setFinFormYear(defaultValueFrom);
  //       // sessionStorage.setItem('gstr1FiledFromDt', defaultValueFrom?.value)
  //       SessionFunction.setSessionValue(
  //         globleVariable.gstr1FiledFromDt,
  //         defaultValueFrom?.value,
  //         true
  //       );
  //     }
  //     if (
  //       defaultValueTo !== undefined &&
  //       defaultValueTo !== null &&
  //       defaultValueTo !== ""
  //     ) {
  //       setMonthFrom(defaultValueTo);
  //       SessionFunction.setSessionValue(
  //         globleVariable.gstr1FiledToDt,
  //         defaultValueTo?.value,
  //         true
  //       );

  //       // sessionStorage.setItem('gstr1FiledToDt', defaultValueTo?.value)
  //     }
  //   }
  // }, [displayType, wizardBtn]);

  const onDateSelect = () => {
    let defaultValueFrom = null;
    let defaultValueTo = null;
    if (
      gstr1FiledFromDt !== null &&
      gstr1FiledFromDt !== "" &&
      gstr1FiledFromDt !== undefined
    ) {
      console.log("set from date");
      defaultValueFrom = panData?.filter(
        (item) => item.value == gstr1FiledFromDt
      )[0];
    } else {
      defaultValueFrom = panData?.filter(
        (item) => Number(item.value) == Number(isdefaultYear)
      )[0];
    }

    if (
      gstr1FiledToDt !== null &&
      gstr1FiledToDt !== "" &&
      gstr1FiledToDt !== undefined
    ) {
      defaultValueTo = panData?.filter(
        (item) => item.value == gstr1FiledToDt
      )[0];
    } else {
      defaultValueTo = panData?.filter(
        (item) => Number(item.value) == Number(isdefaultYear)
      )[0];
    }

    if (
      defaultValueFrom !== undefined &&
      defaultValueFrom !== null &&
      defaultValueFrom !== ""
    ) {
      setFinFormYear(defaultValueFrom);
      // sessionStorage.setItem('gstr1FiledFromDt', defaultValueFrom?.value)
      SessionFunction.setSessionValue(
        globleVariable.gstr1FiledFromDt,
        defaultValueFrom?.value,
        true
      );
    }
    if (
      defaultValueTo !== undefined &&
      defaultValueTo !== null &&
      defaultValueTo !== ""
    ) {
      setMonthFrom(defaultValueTo);
      SessionFunction.setSessionValue(
        globleVariable.gstr1FiledToDt,
        defaultValueTo?.value,
        true
      );

      // sessionStorage.setItem('gstr1FiledToDt', defaultValueTo?.value)
    }
  }
  // ** Set From and to Date by session
  useEffect(() => {
    if (displayType == true) {

      onDateSelect()
      // setSearch(true)

    }
  }, [displayType, wizardBtn])

  useEffect(() => {
    if (downloadDate) {
      onDateSelect();
      const userData = {
        clientid: clientId,
        finyear: gstr1FiledFromDt,
        finmonth: gstr1FiledFromDt,
        subscriptionId: subId,
        gstNumber: GGSTIN,
        upload: false
      };
      setDownloadDate(false)
      setBlock(true);
      console.log("theseiscalling")
      dispatch(getGSTR1FiledSummary(userData));
    }
  }, [downloadDate]);
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

    setMonthFrom(setDt);
    setPanData(x);

  };
  const selectFromMonth = (value) => {
    setMonthFrom(value);

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
      const typeofInvoiceId = hot.getDataAtRow(coords.row)[8];
      const data = hot.getDataAtRow(coords.row)[0];

      navigate("/reports/gstr1-filed-data/gstr1-file-data-details", {
        state: {
          titles: "",
          finyear: finFromYear.value,
          finmonth: monthFrom.value,
          sectionId: typeofInvoiceId,
          gstrfiledDataDetailState: gstrfiledDataDetailState,
        },
      });
    }
  }
  function localAfterOnCellMouseDownAmendment(event, coords, td) {
    const hot = hotRefAmendment?.current?.hotInstance;

    if (coords.row !== -1 && coords.col < 1) {
      const typeofInvoiceId = hot.getDataAtRow(coords.row)[8];
      const data = hot.getDataAtRow(coords.row)[0];

      navigate("/reports/gstr1-filed-data/gstr1-file-data-details", {
        state: {
          titles: "",
          finyear: finFromYear.value,
          finmonth: monthFrom.value,
          sectionId: typeofInvoiceId,
          gstrfiledDataDetailState: gstrfiledDataDetailState,
        },
      });
    }
  }

  const GSTR1SalesSummaryService = () => {
    setBlock(true);
    gstr1FiledSummaryService
      .getGSTR1FiledSummary(isG_UCParId, gstr1FiledFromDt, gstr1FiledToDt)
      .then((res) => {
        if (
          res.status === 200 &&
          res.data.status === errorCodeConfig.APIDefaultCode.Success
        ) {
          setBlock(false);
          setData(res.data.data);
          setDownloadStart(false);
        } else {
          setBlock(false);
          toast.error(res?.data?.errorMessage, {
            position: "top-right",
          });
          setDownloadStart(false);
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

  useEffect(() => {
    if (downloadStart) {
      // GSTR1SalesSummaryService();
      setBlock(true);
      const userData = {
        clientid: clientId,
        finyear: finFromYear?.value,
        finmonth: monthFrom?.value,
        subscriptionId: subId,
        gstNumber: GGSTIN,
      };
      console.log("theseiscalling")
      dispatch(getGSTR1FiledSummary(userData));
    }
  }, [downloadStart]);

  function emptyRender(
    instance,
    td,
    row,
    col,
    prop,
    value,
    cellProperties
  ) {
    textRenderer.apply(this, arguments);
    if (
      col == 1 ||
      col == 2 ||
      col == 3 ||
      col == 4 ||
      col == 5 ||
      col == 6 ||
      col == 7
    ) {
      let currnecyVal = col == 1 ? formatTotalWithoutDecimal(Number(value)) : formatINR(Number(value));

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
                  <Label className="form-label col-md-2 pt-half ps-0">From</Label>
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
                    value={monthFrom}
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
                  <Search size={12} />&nbsp;Search
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
              {data?.length > 0 ? (
                <HotTable
                  data={data.slice(0, 11)}
                  stretchH="all"
                  preventOverflow="horizontal"
                  columns={gtsr1DataColumn}
                  contextMenu={false}
                  bindRowsWithHeaders={true}
                  licenseKey="non-commercial-and-evaluation"
                  height="auto"
                  rowHeights={RowSize}
                  autoColumnSize={{
                    samplingRatio: 23  // Adjust the samplingRatio as needed
                  }}
                  manualColumnResize={true}
                  columnHeaderHeight={columnHeaderSize}
                  ref={hotRef}
                  afterOnCellMouseDown={localAfterOnCellMouseDown}
                  mergeCells={false}
                  hiddenColumns={{
                    columns: [8],
                  }}
                  afterGetColHeader={theader}
                  cells={function (row, col) {
                    var cp = {};
                    const hot = hotRef?.current?.hotInstance;
                    if (col !== null) {
                      cp.renderer = emptyRender;
                    }
                    cp.className = "child";
                    if (col > 0) {
                      cp.className = "text-end";
                    }

                    if (col == 0) {
                      cp.className = "text-danger cursor-pointer"
                    }

                    return cp;
                  }}
                  width="100%"
                  colWidths={100}
                />
              ) : (
                <HotTable
                  mergeCells={[{ row: 0, col: 0, rowspan: 1, colspan: 8 }]}
                  // autoColumnSize={true}
                  autoColumnSize={{
                    samplingRatio: 23  // Adjust the samplingRatio as needed
                  }}
                  manualColumnResize={true}
                  stretchH="all"
                  rowHeights={RowSize}
                  columnHeaderHeight={columnHeaderSize}
                  // style={{ overflowX: "hidden", textAlign: "center" }}
                  data={[{ typeofInvoice: "No Data Found!" }]}
                  cells={function (row, col) {
                    var cp = {};

                    if (col == 0) {

                      cp.className = "text-center";
                    }
                    return cp;

                  }}
                  preventOverflow="horizontal"
                  columns={gtsr1DataColumn}
                  contextMenu={false}
                  bindRowsWithHeaders={true}
                  hiddenColumns={{
                    columns: [8],
                  }}
                  afterGetColHeader={theader}
                  licenseKey="non-commercial-and-evaluation"
                  height="auto"
                />
              )}
            </Col>
            <div>
              <h2 className="mt-2 mb-1">Amendment Data</h2>
            </div>
            <Col md={12}>
              {data?.length > 0 ? (
                <HotTable
                  data={data.slice(11)}
                  stretchH="all"
                  preventOverflow="horizontal"
                  columns={gtsr1DataColumn}
                  rowHeights={RowSize}
                  columnHeaderHeight={columnHeaderSize}
                  contextMenu={false}
                  bindRowsWithHeaders={true}
                  licenseKey="non-commercial-and-evaluation"
                  height="auto"
                  ref={hotRefAmendment}
                  autoColumnSize={{
                    samplingRatio: 23  // Adjust the samplingRatio as needed
                  }}
                  manualColumnResize={true}
                  afterOnCellMouseDown={localAfterOnCellMouseDownAmendment}
                  mergeCells={false}
                  afterGetColHeader={theader}
                  hiddenColumns={{
                    columns: [8],
                  }}
                  cells={function (row, col) {
                    var cp = {};
                    const hot = hotRefAmendment?.current?.hotInstance;
                    if (col !== null) {
                      cp.renderer = emptyRender;
                    }
                    cp.className = "child";
                    if (col > 0) {
                      cp.className = "text-end";
                    }
                    if (col == 0) {
                      cp.className = "text-danger cursor-pointer"
                    }

                    return cp;
                  }}
                  width="100%"
                  colWidths={100}
                />
              ) : (
                <HotTable
                  mergeCells={[{ row: 0, col: 0, rowspan: 1, colspan: 8 }]}
                  // autoColumnSize={true}
                  autoColumnSize={{
                    samplingRatio: 23  // Adjust the samplingRatio as needed
                  }}
                  manualColumnResize={true}
                  stretchH="all"
                  rowHeights={RowSize}
                  columnHeaderHeight={columnHeaderSize}
                  // style={{ overflowX: "hidden", textAlign: "center" }}
                  data={[{ typeofInvoice: "No Data Found!" }]}
                  preventOverflow="horizontal"
                  columns={gtsr1DataColumn}
                  contextMenu={false}
                  hiddenColumns={{
                    columns: [8],
                  }}
                  cells={function (row, col) {
                    var cp = {};

                    if (col == 0) {

                      cp.className = "text-center";
                    }
                    return cp;

                  }}
                  afterGetColHeader={theader}
                  bindRowsWithHeaders={true}
                  licenseKey="non-commercial-and-evaluation"
                  height="auto"
                />
              )}
            </Col>
          </Row>
        </div>
      </div>
    </Fragment>
  );
};

export default Gstr1FileDataSummary;
