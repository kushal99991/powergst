import { useRef, useState } from "react";
import { Card, CardBody, Col, Label, Row } from "reactstrap";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { selectThemeColors } from "@utils";
import { HotTable } from "@handsontable/react";
import {
  columnHeaderSize,
  keysMap,
  paginationList,
  enableOnFormTags,
  RowSize,
} from "../../../../../configs/config";
import { useEffect } from "react";
import { showTotalRowPerPage } from "../../../../../helper/tableRowsPerPage";
import ReactPaginate from "react-paginate";
import { useSelector } from "react-redux";
import LocalFunction from "../../../../../configs/getLocalFunction";
import { globleVariable } from "../../../../../configs/globalVariable";
import { useHotkeys } from "react-hotkeys-hook";


const animatedComponents = makeAnimated();

const Tab2Data = [
  {
    tdstcsId: "52ace319-3c59-4746-9241-ec9455feacd6",
    fkUserClientId: "83a623c9-9bd4-4c62-9d15-3f258a384e3a",
    sectionId: 2,
    fkFinancialYearId: 7,
    month: 3,
    originalGSTIN: "24AAACD5352M1ZN",
    deducteeGSTIN: "24AAACD5352M1ZN",
    partyName: "test",
    taxableValue: "2.00",
    igst: "2.00",
    cgst: "2.00",
    sgst: "2.00",
    originalAmount: "2.00",
    originalMonth: "02",
    deductedAmount: "2.00",
    collectorGSTIN: "24AAACD5352M1ZN",
    collectorName: "test",
    taxPeriod: " ",
    grossValue: "2.00",
    suppliesReturned: "",
    netValue: "2.00",
  },
  {
    tdstcsId: "52ace319-3c59-4746-9241-ec9sdffeacd6",
    fkUserClientId: "83a623c9-9bd4-4c62-9d15-3f258a384e3a",
    sectionId: 2,
    fkFinancialYearId: 8,
    month: 3,
    originalGSTIN: "24AAACDFD52M1ZN",
    deducteeGSTIN: "24AAACD5352M1ZN",
    partyName: "fsgdfkgdsg dfsgfd",
    taxableValue: "542.00",
    igst: "72.00",
    cgst: "452.00",
    sgst: "254.00",
    originalAmount: "245.00",
    originalMonth: "12",
    deductedAmount: "872.00",
    collectorGSTIN: "24AAACD5352M1ZN",
    collectorName: "test",
    taxPeriod: " ",
    grossValue: "289.00",
    suppliesReturned: "",
    netValue: "290.00",
  },
];

const searchValueCols = [0, 3];
const fromToCols = [1, 2, 4, 5, 6, 7];

const Tab2 = ({ fromYear, toYear, setTDSTCSData,btnDisable1,setbtnDisable1  }) => {
  const hotRef = useRef(null);

  const finYearOption = LocalFunction.getLocalValue(
    globleVariable.rangeFilters,
    true
  );
  const YearList = JSON.parse(finYearOption);

  const [finFromYear, setFinFormYear] = useState(null);
  const [panData, setPanData] = useState([]);
  const [panDataFrom, setPanDataFrom] = useState([]);
  const [monthFrom, setMonthFrom] = useState(null);
  const [invoiceTypeList, setInvoiceTypeList] = useState([]);
  const [invoceTypes, setInvoceTypes] = useState([]);
  const [data, setData] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(paginationList[0].value);
  const [pageNoSelect, setPageNoSelect] = useState(paginationList[0]);

  const [dataOverview, setDataOverview] = useState({
    invoices: 0,
    invoiceValues: 0,
    taxableValues: 0,
    totalIGST: 0,
    totalCGST: 0,
    totalSGST: 0,
  });

  const {
    invoices,
    invoiceValues,
    taxableValues,
    totalIGST,
    totalCGST,
    totalSGST,
  } = dataOverview;

  const tab2Data = useSelector(
    (state) => state?.users?.TDSTCSFiledSummary?.[0]?.Data?.TCSA
  );

  const defaultFromTo = { from: "", to: "" };

  const initialAdvanceFilters = {
    sgst: defaultFromTo,
    cgst: defaultFromTo,
    igst: defaultFromTo,
    deductedAmount: defaultFromTo,
    originalMonth: defaultFromTo,
    originalAmount: defaultFromTo,
    deducteeGSTIN: "",
    originalGSTIN: "",
  };

  const [advanceFilters, setAdvanceFilters] = useState({
    ...initialAdvanceFilters,
  });
  const [minMaxValue, setMinMaxValue] = useState({ from: "", to: "" });
  const [filteredData, setFilteredData] = useState([]);
  const [page, setPage] = useState(0);

  const para1 = page * rowsPerPage;
  const para2 = page * rowsPerPage + rowsPerPage;
  let tab2FilterdData = filteredData && filteredData.slice(para1, para2);
  const pageCount = Math.ceil(
    filteredData?.length && filteredData?.length / rowsPerPage
  );

  useEffect(() => {
    if (filteredData?.length > 0) {
      const newDataOverview = {
        invoices: 0,
        invoiceValues: 0,
        taxableValues: 0,
        totalIGST: 0,
        totalCGST: 0,
        totalSGST: 0,
      };

      newDataOverview.invoices = filteredData.length;

      filteredData.forEach((item) => {
        newDataOverview.taxableValues += parseFloat(item.taxableValue);
        newDataOverview.totalIGST += parseFloat(item.igst);
        newDataOverview.totalCGST += parseFloat(item.cgst);
        newDataOverview.totalSGST += parseFloat(item.sgst);
      });

      newDataOverview.invoiceValues =
        newDataOverview.taxableValues +
        newDataOverview.totalIGST +
        newDataOverview.totalCGST +
        newDataOverview.totalSGST;

      setDataOverview(newDataOverview);
    } else {
      setDataOverview({
        invoices: 0,
        invoiceValues: 0,
        taxableValues: 0,
        totalIGST: 0,
        totalCGST: 0,
        totalSGST: 0,
      });
    }
  }, [filteredData]);

  const filterInvoiceType = (event) => {};

  const tab2Columns = [
    {
      data: "originalGSTIN",
      title: "Original GSTIN of Deductee",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "originalAmount",
      title: "Original Amount Deducted",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "originalMonth",
      title: "Original Month",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "deducteeGSTIN",
      title: "GSTIN of Deductee",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "deductedAmount",
      title: "Amount Deducted",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "igst",
      title: "IGST (₹)",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "cgst",
      title: "CGST (₹)",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "sgst",
      title: "SGST (₹)",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "action",
      title: "Action",
      readOnly: true,
    },
  ];

  useEffect(() => {
    setFilteredData(tab2Data);
    setData(tab2Data);
  }, [tab2Data]);

  useEffect(() => {
    setPanData(YearList);
    setPanDataFrom(YearList);
  }, []);

  function formatINR(x) {
    return x.toLocaleString("en-IN", { minimumFractionDigits: 2 });
  }
  function formatTotalWithoutDecimal(x) {
    return x.toLocaleString("en-IN");
  }

  const applyFilters = (advanceFilterValue) => {
    setPage(0);
    const convertIntoInt = (num) => {
      if (num) {
        return parseFloat(num.replaceAll(",", ""));
      }
      return 0;
    };
    if (data?.length > 0) {
      let newFilteredData = [...data];

      const advance = advanceFilterValue;

      const applyThisFrom = (dataForApply, Filed) => {
        let newDataForApply = [...dataForApply];

        if (!isNaN(parseFloat(advance[Filed]?.from))) {
          newDataForApply = dataForApply.filter(
            (item) =>
              convertIntoInt(item[Filed]) >= parseFloat(advance[Filed].from)
          );
        }

        if (!isNaN(parseFloat(advance[Filed]?.to))) {
          newDataForApply = newDataForApply.filter(
            (item) =>
              convertIntoInt(item[Filed]) <= parseFloat(advance[Filed].to)
          );
        }

        return newDataForApply;
      };

      const applySearchFilter = (dataToApply, Field) => {
        if (advance[Field]) {
          return dataToApply.filter((item) =>
            item[Field]?.toLowerCase()?.includes(
              advance?.[Field]?.toLowerCase()
            )
          );
        } else return dataToApply;
      };

      newFilteredData = applyThisFrom(newFilteredData, "igst");
      newFilteredData = applyThisFrom(newFilteredData, "cgst");
      newFilteredData = applyThisFrom(newFilteredData, "sgst");
      newFilteredData = applyThisFrom(newFilteredData, "deductedAmount");
      newFilteredData = applyThisFrom(newFilteredData, "originalMonth");
      newFilteredData = applyThisFrom(newFilteredData, "originalAmount");

      newFilteredData = applySearchFilter(newFilteredData, "deducteeGSTIN");
      newFilteredData = applySearchFilter(newFilteredData, "originalGSTIN");

      setFilteredData(newFilteredData);
    }
  };

  function localAfterOnCellMouseDown(event, coords, td) {
    const columnName = tab2Columns[coords?.col]?.data;

    if (fromToCols.includes(coords?.col))
      setMinMaxValue(advanceFilters[columnName]);
  }

  const theader = (col, TH) => {
    if (col == 8) {
      const button = TH.children[0].children[0];
      button?.parentNode?.removeChild(button);
    }

    if (col == 0 || col == 1) {
      TH.className = "htLeft";
    } else {
      TH.className = "htRight";
    }

    const columnName = tab2Columns[col]?.data;

    let filterApplied = false;

    if (fromToCols.includes(col)) {
      filterApplied =
        advanceFilters[columnName].from !== "" ||
        advanceFilters[columnName].to !== "";
    } else if (searchValueCols.includes(col)) {
      filterApplied = !!advanceFilters[columnName];
    }

    if (filterApplied) {
      TH.classList.add("htFiltersActive");
    } else {
      TH.classList.remove("htFiltersActive");
    }
  };

  const hasData = tab2FilterdData?.length > 0;

  const clearFilters = () => {
    applyFilters(initialAdvanceFilters);
    setAdvanceFilters(initialAdvanceFilters)

  }

  useHotkeys(
    keysMap.CLEAR_DATA,
    () => {
      clearFilters()
    },
    { enableOnFormTags }
  );

  useEffect(() => {
    setTDSTCSData(false, { activeTab: 1, clearFilters })
  }, []);

  useEffect(() => {
    if(tab2FilterdData?.length > 0){
      setbtnDisable1(false)
    }else{
      setbtnDisable1(true)
    }

  },[tab2FilterdData])

  return (
    <div>
      <Card>
        <CardBody className="CardBody p-0">
          <Row className="p-1">
            <Col md={8}>
              <table className="table table-bordered summary-table">
                <tbody>
                  <tr>
                    <td>
                      <p className="mb-0">
                        Invoices <br />
                        <span>
                          {" "}
                          {invoices ? formatTotalWithoutDecimal(invoices) : 0}
                        </span>
                      </p>
                    </td>

                    <td>
                      <p className="mb-0">
                        {" "}
                        Invoice Values (₹)
                        <br />
                        <span>
                          {" "}
                          {invoiceValues ? formatINR(invoiceValues) : 0}
                        </span>
                      </p>
                    </td>
                    <td>
                      <p className="mb-0">
                        Taxable Values{"  "} (₹)
                        <br />
                        <span>
                          {taxableValues ? formatINR(taxableValues) : 0}
                        </span>
                      </p>
                    </td>

                    <td>
                      <p className="mb-0">
                        IGST (₹)
                        <br />
                        <span> {totalIGST ? formatINR(totalIGST) : 0}</span>
                      </p>
                    </td>
                    <td>
                      <p className="mb-0">
                        SGST (₹)
                        <br />
                        <span> {totalSGST ? formatINR(totalSGST) : 0}</span>
                      </p>
                    </td>
                    <td>
                      <p className="mb-0">
                        CGST (₹)
                        <br />
                        <span> {totalCGST ? formatINR(totalCGST) : 0}</span>
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Col>
            <Col md={4}>
              <Row>
                <Col sm={4}>
                  <Label className="form-label">Invoice Type</Label>
                  <Select
                    id="purchaseId_invtype"
                    placeholder="Invoice Type"
                    theme={selectThemeColors}
                    components={animatedComponents}
                    options={[{label: 'TDSA', value: 'TDSA', srNo: '2'}]}
                    classNamePrefix="select"
                    value={{label: 'TDSA', value: 'TDSA', srNo: '2'}}
                    isDisabled={true}
                  />
                </Col>
                <Col sm={4}>
                  <Label className="form-label">From</Label>
                  <Select
                    id="from"
                    placeholder="From"
                    isClearable={false}
                    theme={selectThemeColors}
                    closeMenuOnSelect={true}
                    options={YearList}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    components={animatedComponents}
                    // onChange={selectFromYear}
                    value={fromYear}
                    isDisabled={true}
                  />
                </Col>

                <Col sm={4}>
                  <Label className="form-label">To</Label>
                  <Select
                    id="to"
                    placeholder="To"
                    isClearable={false}
                    theme={selectThemeColors}
                    closeMenuOnSelect={true}
                    options={YearList}
                    components={animatedComponents}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    // onChange={selectFromMonth}
                    value={toYear}
                    isDisabled={true}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </CardBody>
      </Card>
      <Card>
        <CardBody className="CardBody p-0">
          <Row>
            <Col sm="12">
              <div>
                <HotTable
                  id="tab2table"
                  ref={hotRef}
                  columnSorting={true}
                  renderAllRows={false}
                  rowHeights={RowSize}
                  columns={tab2Columns}
                  columnHeaderHeight={columnHeaderSize}
                  manualColumnResize={false}
                  dropdownMenu={{
                    items: {
                      filter_by_value: {
                        name: "Search Value",
                        hidden() {
                          return !searchValueCols.includes(
                            this.getSelectedRangeLast().to.col
                          );
                        },
                      },

                      select_min_max: {
                        name: `<div style="margin-top:10px">Min Value <br><input type='number' autocomplete="off" class='custom-date col-md-11' placeholder='Min Amount' id='amount1' name='amount1' value=${
                          minMaxValue.from ?? ""
                        } > <br/>
                                   Max Value <br> <input type='number' class='custom-date col-md-11' autocomplete="off" placeholder='Max Amount' id='amount2' name='amount2' value=${
                                     minMaxValue.to ?? ""
                                   }>
                                   </div>`,
                        hidden() {
                          return !fromToCols.includes(
                            this.getSelectedRangeLast().to.col
                          );
                        },
                        callback: function (key, selection, clickEvent) {
                          var src = clickEvent.target;

                          if (src.tagName === "INPUT") {
                            clickEvent.stopImmediatePropagation();
                          }
                          clickEvent.stopImmediatePropagation();
                        },
                      },

                      clear: {
                        name: `<button id='btnClear' name='Clear'   value='Clear'>Clear</button>`,
                        callback: function (key, selection, clickEvent) {
                          var src = clickEvent.target;
                          if (src.tagName.toLowerCase() === "button") {
                            if (clickEvent.target.id == "btnClear") {
                              const selectedColumn = this.getSelected()[0][1];

                              const newAdvanceFilter = { ...advanceFilters };

                              const columnName =
                                tab2Columns[selectedColumn]?.data;

                              if (fromToCols.includes(selectedColumn)) {
                                newAdvanceFilter[columnName] = {
                                  from: "",
                                  to: "",
                                };
                              } else if (
                                searchValueCols.includes(selectedColumn)
                              ) {
                                newAdvanceFilter[columnName] = "";
                              }

                              setAdvanceFilters(newAdvanceFilter);
                              applyFilters(newAdvanceFilter);
                            }
                            clickEvent.stopImmediatePropagation();
                          }
                          clickEvent.stopImmediatePropagation();
                        },
                      },

                      filter_action_bar: {},
                    },
                  }}
                  afterDropdownMenuShow={function () {
                    const selectedColumn = this.getSelected()[0][1];

                    if (searchValueCols.includes(selectedColumn)) {
                      const columnName = tab2Columns[selectedColumn]?.data;

                      const searchValueText = advanceFilters[columnName];

                      document.querySelector(
                        ".htUIMultipleSelectSearch.htUIInput input"
                      ).value = searchValueText;
                    }

                    const element = document.querySelector(
                      ".htMenu.htDropdownMenu.handsontable"
                    );
                    element.style.top = "0px";
                  }}
                  afterFilter={function (data) {
                    const selectedColumn = this.getSelected()[0][1];

                    const newAdvanceFilter = { ...advanceFilters };
                    const columnName = tab2Columns[selectedColumn]?.data;

                    if (fromToCols.includes(selectedColumn)) {
                      const fromAmount =
                        document.getElementById("amount1")?.value;
                      const toAmount =
                        document.getElementById("amount2")?.value;

                      newAdvanceFilter[columnName] = {
                        from: fromAmount !== "" ? parseFloat(fromAmount) : "",
                        to: toAmount !== "" ? parseFloat(toAmount) : "",
                      };
                    } else if (searchValueCols.includes(selectedColumn)) {
                      const searchInput = document.querySelector(
                        ".htUIMultipleSelectSearch.htUIInput"
                      );
                      const value = searchInput.children[0].value;

                      newAdvanceFilter[columnName] = value ?? "";
                    }

                    setAdvanceFilters(newAdvanceFilter);
                    applyFilters(newAdvanceFilter);
                  }}
                  stretchH="all"
                  data={
                    hasData
                      ? tab2FilterdData
                      : [{ originalGSTIN: "No Data Found!" }]
                  }
                  mergeCells={[
                    hasData
                      ? false
                      : {
                          row: 0,
                          col: 0,
                          rowspan: 1,
                          colspan: 9,
                        },
                  ]}
                  afterGetColHeader={theader}
                  rowHeaders={false}
                  filters={true}
                  viewportColumnRenderingOffset={200}
                  bindRowsWithHeaders={false}
                  licenseKey="non-commercial-and-evaluation"
                  afterOnCellMouseDown={localAfterOnCellMouseDown}
                  selectionMode="range"
                  cells={function (row, col) {
                    var cp = {};
                    if (hasData) {
                      cp.className = "child";
                      if (col == 0 || col == 3) {
                        cp.className = "text-left";
                      } else {
                        cp.className = "text-end";
                      }
                    } else {
                      cp.className = "text-center";
                    }
                    return cp;
                  }}
                  height="auto"
                />

                {tab2FilterdData?.length > 0 && (
                  <>
                    <Row className="justify-content-end mx-0">
                      <Col
                        className="d-flex align-items-center justify-content-end"
                        md="12"
                        sm="12"
                      >
                        <Select
                          id="pageId"
                          isClearable={false}
                          theme={selectThemeColors}
                          closeMenuOnSelect={true}
                          options={paginationList}
                          className="basic-multi-select"
                          classNamePrefix="select"
                          components={animatedComponents}
                          onChange={(e) => {
                            setPageNoSelect(e);
                            setRowsPerPage(e.value);
                            setPage(0);
                          }}
                          value={pageNoSelect}
                          menuPlacement="auto"
                        />
                        &nbsp; &nbsp;
                        <span>
                          <strong> {``} </strong>{" "}
                        </span>{" "}
                        &nbsp; &nbsp;
                        {showTotalRowPerPage(
                          page,
                          rowsPerPage,
                          filteredData?.length ?? 0
                        )}
                        &nbsp; &nbsp; &nbsp;
                        <ReactPaginate
                          breakLabel="..."
                          nextLabel=""
                          onPageChange={(e) => setPage(e?.selected)}
                          pageRangeDisplayed={2}
                          pageCount={pageCount}
                          previousLabel=""
                          renderOnZeroPageCount={null}
                          marginPagesDisplayed={2}
                          forcePage={page}
                          activeClassName="active"
                          pageClassName="page-item"
                          breakClassName="page-item"
                          nextLinkClassName="page-link"
                          pageLinkClassName="page-link"
                          breakLinkClassName="page-link"
                          previousLinkClassName="page-link"
                          nextClassName="page-item next-item"
                          previousClassName="page-item prev-item"
                          containerClassName="pagination react-paginate separated-pagination pagination-sm justify-content-end pe-1 mt-1"
                        />
                      </Col>
                    </Row>
                  </>
                )}
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </div>
  );
};

export default Tab2;
