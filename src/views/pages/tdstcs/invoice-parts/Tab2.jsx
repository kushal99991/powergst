import { useRef, useState } from "react";
import { Card, CardBody, Col, Label, Row } from "reactstrap";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { selectThemeColors } from "@utils";
import { HotTable } from "@handsontable/react";
import { useEffect } from "react";
import ReactPaginate from "react-paginate";
import { useHotkeys } from "react-hotkeys-hook";
import {
  columnHeaderSize,
  paginationList,
  RowSize,
  keysMap,
  enableOnFormTags,
} from "../../../../configs/config";
import LocalFunction from "../../../../configs/getLocalFunction";
import { globleVariable } from "../../../../configs/globalVariable";
import tdstcsFiledService from "../../../../services/tdstcsFiled/tdstcsFiledService";
import getSessionFunction from "@configs/getSessionFunction";
import { showTotalRowPerPage } from "../../../../helper/tableRowsPerPage";
import Footer from "../footer";
import Handsontable from "handsontable";
import $ from "jquery";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import toast from "react-hot-toast";
import errorCodeConfig from "../../../../configs/apiErrorCodeConfig";
const MySwal = withReactContent(Swal);

const animatedComponents = makeAnimated();

const searchValueCols = [0, 3];
const fromToCols = [1, 2, 4, 5, 6, 7];

const Tab2 = ({ fromYear, toYear, setTDSTCSData, stepper }) => {
  const hotRef = useRef(null);

  const finYearOption = LocalFunction.getLocalValue(
    globleVariable.rangeFilters,
    true
  );
  const YearList = JSON.parse(finYearOption);

  const G_UCParId =
    sessionStorage.getItem(globleVariable.G_UCParId) &&
    getSessionFunction.getSessionValue(globleVariable.G_UCParId, true);

  const UserId =
    localStorage.getItem(globleVariable.userId) &&
    LocalFunction.getLocalValue(globleVariable.userId, true);

  const G_FY = getSessionFunction.getSessionValue(globleVariable.G_FY, true);

  const [rowsPerPage, setRowsPerPage] = useState(paginationList[0].value);
  const [pageNoSelect, setPageNoSelect] = useState(paginationList[0]);
  const [block, setBlock] = useState(false);

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
  const [tableData, setTableData] = useState([]);
  const [page, setPage] = useState(0);
  const [summary, setSummary] = useState();

  const para1 = page * rowsPerPage;
  const para2 = page * rowsPerPage + rowsPerPage;
  let tab2FilterdData = tableData && tableData.slice(para1, para2);
  const pageCount = Math.ceil(
    tableData?.length && tableData?.length / rowsPerPage
  );

  const invoices = summary?.documentCount;
  const invoiceValues =
    Number(summary?.totalTaxableAmount) +
    Number(summary?.igst) +
    Number(summary?.cgst) +
    Number(summary?.sgst);
  const taxableValues = parseFloat(summary?.totalTaxableAmount);
  const totalIGST = parseFloat(summary?.igst);
  const totalCGST = parseFloat(summary?.cgst);
  const totalSGST = parseFloat(summary?.sgst);

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
    getData();
  }, []);

  const getData = (
    newPage = page,
    advance = advanceFilters,
    pageSize = rowsPerPage
  ) => {
    setBlock(true);

    const searchColumnName = [];
    const searchValue = [];

    Object.keys(advance).map((item) => {
      if (item in advance) {
        const currentValue = advance[item];

        if (["deducteeGSTIN", "originalGSTIN"].includes(item)) {
          if (currentValue) {
            searchColumnName.push(item);
            searchValue.push(currentValue);
          }
        } else if (
          [
            "igst",
            "cgst",
            "sgst",
            "originalGSTIN",
            "originalAmount",
            "originalMonth",
          ].includes(item)
        ) {
          if (currentValue.from || currentValue.to) {
            searchColumnName.push(item);
            searchValue.push(`${currentValue?.from}to${currentValue?.to}`);
          }
        }
      }
    });

    const payload = {
      userClientId: G_UCParId,
      pageStart: newPage + 1,
      pageSize,
      orderByColumnName: "",
      orderBy: "",
      searchColumnName,
      searchValue,
      fromRange: fromYear?.value,
      toRange: toYear?.value,
      sectionId: [2],
    };

    tdstcsFiledService
      .getTdsTcsSummaryTDS(payload)
      .then((res) => {
        if (res.status === 200) {
          setTableData(res?.data?.data?.paginationData);
          setSummary(res?.data?.data?.summary);
        }
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "",
          text: error?.message,
        });
      })
      .finally(() => {
        setBlock(false);
      });
  };

  function formatINR(x) {
    return x.toLocaleString("en-IN", { minimumFractionDigits: 2 });
  }
  function formatTotalWithoutDecimal(x) {
    return x.toLocaleString("en-IN");
  }

  const applyFilters = (newAdvanceFilterValue) => {
    setPage(0);
    getData(0, newAdvanceFilterValue);
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
    setAdvanceFilters(initialAdvanceFilters);
  };

  useHotkeys(
    keysMap.CLEAR_DATA,
    () => {
      clearFilters();
    },
    { enableOnFormTags }
  );

  useEffect(() => {
    setTDSTCSData(false, { activeTab: 2, clearFilters, getData });
  }, []);

  const deleteOnClick = async (tdstcsId) => {
    return MySwal.fire({
      title: "Are you sure delete this record?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      customClass: {
        confirmButton: "btn btn-danger",
        cancelButton: "btn btn-outline-dark ms-1",
      },
      buttonsStyling: false,
      allowOutsideClick: false,
    }).then(function (result) {
      if (result.value) {
        const payload = {
          userClientId: G_UCParId,
          financialYearId: G_FY,
          deletedBy: UserId,
          tdsTcsId: [tdstcsId],
        };
        tdstcsFiledService
          .deleteInvoiceTDSTCS(payload)
          .then((res) => {
            if (
              res.status === 200 &&
              res.data.status === errorCodeConfig.APIDefaultCode.Success
            ) {
              toast.success(
                res.data.successMessage,
                {
                  position: "top-right",
                },
                2000
              );
              getData();
            } else {
              Swal.fire({
                icon: "error",
                title: "",
                text: res?.data?.errorMessage,
                customClass: {
                  confirmButton: "btn btn-danger",
                },
                buttonsStyling: false,
              });
            }
          })
          .catch((error) => {
            Swal.fire({
              icon: "error",
              title: "",
              text: error?.message,
            });
          });
      }
    });
  };

  function myBtns(instance, td, row, col, prop, value, cellProperties) {
    Handsontable.renderers.TextRenderer.apply(this, arguments);
    td.innerHTML =
      '</button><button class="btn add-deactive" title="Delete"><i class="fa fa-trash"></i></button>';

    if (row !== -1 && col == 8) {
      $(td)
        .find(".add-deactive")
        .on("click", () => {
          const tdstcsId = tab2FilterdData?.[row]?.tdstcsId;
          deleteOnClick(tdstcsId);
        });
    }
  }

  return (
    <div>
      {block && <div className="loading1">Loading&#8230;</div>}
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
                    options={[{ label: "TDSA", value: "TDSA", srNo: "2" }]}
                    classNamePrefix="select"
                    value={{ label: "TDSA", value: "TDSA", srNo: "2" }}
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
                      if (col == 8) {
                        cp.renderer = myBtns;
                        cp.readOnly = true;
                        cp.className = "text-center";
                      }
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
                            getData(0, advanceFilters, e.value);
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
                          tableData?.length ?? 0
                        )}
                        &nbsp; &nbsp; &nbsp;
                        <ReactPaginate
                          breakLabel="..."
                          nextLabel=""
                          onPageChange={(e) => {
                            setPage(e?.selected);
                            getData(e?.selected);
                          }}
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
      <Footer
        stepper={stepper}
        onNext={() => stepper.next()}
        onPrevious={() => stepper.previous()}
      />
    </div>
  );
};

export default Tab2;
