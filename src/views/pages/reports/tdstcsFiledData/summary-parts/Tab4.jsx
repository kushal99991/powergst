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
  RowSize,
  enableOnFormTags
} from "../../../../../configs/config";
import { useEffect } from "react";
import { showTotalRowPerPage } from "../../../../../helper/tableRowsPerPage";
import ReactPaginate from "react-paginate";
import { useSelector } from "react-redux";
import LocalFunction from "../../../../../configs/getLocalFunction";
import { globleVariable } from "../../../../../configs/globalVariable";
import { useHotkeys } from "react-hotkeys-hook";

const animatedComponents = makeAnimated();

const Tab4Data = [
  {
    tdstcsId: "614ec7c1-3155-4634-b89f-dc336a834e6a",
    fkUserClientId: "83a623c9-9bd4-4c62-9d15-3f258a384e3a",
    sectionId: 3,
    fkFinancialYearId: 7,
    month: 3,
    originalGSTIN: "24AAACD5352M1ZN",
    deducteeGSTIN: "24AAACD5352M1ZN",
    partyName: "test",
    taxableValue: "3.00",
    igst: "3.00",
    cgst: "3.00",
    sgst: "3.00",
    originalAmount: "3.00",
    originalMonth: "02",
    deductedAmount: "3.00",
    collectorGSTIN: "24AAACD5352M1ZN",
    collectorName: "test",
    taxPeriod: "-",
    grossValue: "3.00",
    suppliesReturned: "-",
    netValue: "3.00",
  },
  {
    tdstcsId: "614ec7c1-3155-4634-b89f-dc336a834e6a",
    fkUserClientId: "83a623cd-9bd4-4c62-9d15-3f258a384e3a",
    sectionId: 3,
    fkFinancialYearId: 6,
    month: 3,
    originalGSTIN: "24AAACD5352M1ZN",
    deducteeGSTIN: "24AAACD5352M1ZN",
    partyName: "fghjdh fgdh",
    taxableValue: "3.00",
    igst: "354.00",
    cgst: "34.00",
    sgst: "32.00",
    originalAmount: "39.00",
    originalMonth: "3",
    deductedAmount: "3.00",
    collectorGSTIN: "24AAACD5352M1ZN",
    collectorName: "kkkkk",
    taxPeriod: "-",
    grossValue: "83.00",
    suppliesReturned: "-",
    netValue: "43.00",
  },
];

const searchValueCols = [0, 1];
const fromToCols = [3, 5, 6, 7, 8];

const Tab4 = ({ fromYear, toYear, setTDSTCSData,btnDisable1,setbtnDisable1  }) => {
  const hotRef = useRef(null);

  const finYearOption = LocalFunction.getLocalValue(
    globleVariable.rangeFilters,
    true
  );
  const YearList = JSON.parse(finYearOption);

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

  const tab4Data = useSelector(
    (state) => state?.users?.TDSTCSFiledSummary?.[0]?.Data?.TDSA
  );

  const defaultFromTo = { from: "", to: "" };

  const initialAdvanceFilters = {
    sgst: defaultFromTo,
    cgst: defaultFromTo,
    igst: defaultFromTo,
    grossValue: defaultFromTo,
    netValue: defaultFromTo,
    collectorName: "",
    collectorGSTIN: "",
  };

  const [advanceFilters, setAdvanceFilters] = useState({
    ...initialAdvanceFilters,
  });
  const [minMaxValue, setMinMaxValue] = useState({ from: "", to: "" });
  const [filteredData, setFilteredData] = useState([]);
  const [page, setPage] = useState(0);

  const para1 = page * rowsPerPage;
  const para2 = page * rowsPerPage + rowsPerPage;
  let tab4FilterdData = filteredData && filteredData.slice(para1, para2);
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

  const tab4Columns = [
    {
      data: "collectorGSTIN",
      title: "GSTIN of Collector",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "collectorName",
      title: "Name of Collector",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "taxPeriod",
      title: "Tax period of GSTR-8",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "grossValue",
      title: "Gross value",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "suppliesReturned",
      title: "Supplies returned",
      readOnly: true,
      columnSorting: {
        indicator: false,
        headerAction: false,
      },
    },
    {
      data: "netValue",
      title: "Net value",
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
    setFilteredData(tab4Data);
    setData(tab4Data);
  }, [tab4Data]);

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
      newFilteredData = applyThisFrom(newFilteredData, "netValue");
      newFilteredData = applyThisFrom(newFilteredData, "grossValue");

      newFilteredData = applySearchFilter(newFilteredData, "collectorGSTIN");
      newFilteredData = applySearchFilter(newFilteredData, "collectorName");

      setFilteredData(newFilteredData);
    }
  };

  function localAfterOnCellMouseDown(event, coords, td) {
    const columnName = tab4Columns[coords?.col]?.data;

    if (fromToCols.includes(coords?.col))
      setMinMaxValue(advanceFilters[columnName]);
  }

  const theader = (col, TH) => {
    if (col == 9) {
      const button = TH.children[0].children[0];
      button?.parentNode?.removeChild(button);
    }

    if (col == 0 || col == 1) {
      TH.className = "htLeft";
    } else {
      TH.className = "htRight";
    }

    const columnName = tab4Columns[col]?.data;

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

  const hasData = tab4FilterdData?.length > 0;

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
    setTDSTCSData(false, {activeTab: 1, clearFilters})
  }, []);

  useEffect(() => {
    if(tab4FilterdData?.length > 0){
      setbtnDisable1(false)
    }else{
      setbtnDisable1(true)
    }

  },[tab4FilterdData])

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
                    options={[{label: 'TCSA', value: 'TCSA', srNo: '4'}]}
                    classNamePrefix="select"
                    // onChange={filterInvoiceType}
                    value={{label: 'TCSA', value: 'TCSA', srNo: '4'}}
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
                  id="tab4table"
                  ref={hotRef}
                  columnSorting={true}
                  renderAllRows={false}
                  rowHeights={RowSize}
                  columns={tab4Columns}
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
                                tab4Columns[selectedColumn]?.data;

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
                      const columnName = tab4Columns[selectedColumn]?.data;

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
                    const columnName = tab4Columns[selectedColumn]?.data;

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
                      ? tab4FilterdData
                      : [{ collectorGSTIN: "No Data Found!" }]
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
                      if (col == 0 || col == 1) {
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

                {tab4FilterdData?.length > 0 && (
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

export default Tab4;
