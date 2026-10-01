import { HotTable } from "@handsontable/react";
import Handsontable from "handsontable";
import React, { forwardRef, useImperativeHandle } from "react";
import {
  checkboxFilterCss,
  columnHeaderSize,
  RowSize,
} from "../../../../configs/config";
import $ from "jquery";
import { useState } from "react";
import { useEffect } from "react";
import { textRenderer } from "handsontable/renderers";
import { sortByMonthYear } from "../../../../utility/Utils";

const searchValueCols = [0, 1];

const DownloadHistoryLog = forwardRef(({ gridDataFilter, perPageCount, filteredData, setFilteredData, setPage, page, reloadDownloadPage }, ref) => {
  const initialAdvanceFilters = {
    gstinNumber: "",
    company: "",
    selectedMonth: [],
    selectedStatus: [],
  };

  const [searchText, setSearchText] = useState();
  const [advanceFilters, setAdvanceFilters] = useState(initialAdvanceFilters);
  const [monthDropdown, setMonthDropdown] = useState([]);
  const statusDropdown = [
    "Success",
    "Failed",
    "Pending",
    "In Progress",
    "Token",
    "Authentication Failed",
  ];

  /**
     * that functions will use in the parent component if needed
     */
  useImperativeHandle(ref, () => ({
    clearFilter() {
      applyFilters(initialAdvanceFilters)
    },
  }));

  useEffect(() => {
 
    if (gridDataFilter) {
      const months = gridDataFilter.reduce((pre, curr) => {
      if (curr?.month) {pre.push(curr?.month)}
       return pre
      }, []);
       setMonthDropdown(sortByMonthYear(months));
      setFilteredData(gridDataFilter);
      setAdvanceFilters(initialAdvanceFilters)  
      applyFilters(initialAdvanceFilters);
    }
  }, [reloadDownloadPage]);

  const backgroundColumns = [
    {
      data: "gstinNumber",
      title: "GSTIN",
      width: 132,
    },
    {
      data: "company",
      title: "Company Name",
      width: 130,
    },
    {
      data: "requestedDate",
      title: "Last Date",
    },
    {
      data: "month",
      title: "Month",
    },

    {
      data: "status",
      title: "Status",
    },

    {
      data: "year",
      title: "Year",
      width: 50,
    },

    {
      data: "userClientId",
      title: "Client Id",
    },
  ];

  function myLables(instance, td, row, col, prop, value, cellProperties) {
    Handsontable.renderers.TextRenderer.apply(this, arguments);
    td.innerHTML = `<div class="truncated">${
      value !== null && value !== "" ? value : ""
    }</div>`;
  }

  const theader = (col, TH) => {
    if (col === 2) {
      const button = TH.children[0].children[0];
      button.parentNode.removeChild(button);
    }

    TH.className = "htLeft";

    const columnName = backgroundColumns[col]?.data;

    let filterApplied = false;

    if(searchValueCols.includes(col)) {
      filterApplied = !!advanceFilters[columnName]
    }
    else if (col == 3) {
      filterApplied = advanceFilters?.selectedMonth?.length > 0
    } else if (col == 4) {
      filterApplied = advanceFilters?.selectedStatus?.length > 0
    }

    if (filterApplied) {
      TH.classList.add("htFiltersActive");
    } else {
      TH.classList.remove("htFiltersActive");
    }
  };


  const applyFilters = (advanceFilterValue) => {
    setPage(0);

    if (gridDataFilter?.length > 0) {

      let newFilteredData = [...gridDataFilter];


      const applySearchFilter = (dataToApply, Field) => {
        if (advanceFilterValue[Field]) {
          return dataToApply.filter((item) =>
            item[Field]?.toLowerCase()?.includes(advanceFilterValue[Field]?.toLowerCase())
          );
        } else return dataToApply;
      };

      if (advanceFilterValue.selectedMonth.length > 0) {
        newFilteredData = newFilteredData.filter((item) =>
          advanceFilterValue.selectedMonth.includes(item.month)
        );
      }

      if (advanceFilterValue.selectedStatus.length > 0) {
        newFilteredData = newFilteredData.filter((item) =>
          advanceFilterValue.selectedStatus.includes(item.status)
        );
      }

      newFilteredData = applySearchFilter(newFilteredData, "gstinNumber");
      newFilteredData = applySearchFilter(newFilteredData, "company");

      setFilteredData(newFilteredData);
    }
    setAdvanceFilters(advanceFilterValue);
  }

  const para1 = page * perPageCount;
  const para2 = (page * perPageCount) + perPageCount

  let dataWithout = filteredData && filteredData.slice(para1, para2)

  const hasData = filteredData?.length > 0;


  
  function emptyRender(instance, td, row, col, prop, value, cellProperties) {
    textRenderer.apply(this, arguments);
    if (value?.toLowerCase() == 'failed') {
      td.className = "text-danger-error-red";
    } else if (value?.toLowerCase() == 'success') {
      td.className = "text-success";
    } else if (value?.toLowerCase() == 'in progress') {
      td.className = "text-info";
    } else if (value?.toLowerCase() == 'pending') {
      td.className = "text-warning";
    } else if (value?.toLowerCase() == 'token') {
      td.className = "text-warning";
    } else if (value?.toLowerCase() == 'authentication failed') {
      td.className = "text-warning";
    }
  }


  function splitRender(instance, td, row, col, prop, value, cellProperties) {
    textRenderer.apply(this, arguments);
    if (value) {
      td.innerText = value.slice(0, 11);
    }
  }

  return (
    <HotTable
      id="hotSummary"
      height="auto"
      autoColumnSize={{
        samplingRatio: 23,
      }}
      manualColumnResize={true}
      stretchH="all"
      rowHeights={RowSize}
      columnHeaderHeight={columnHeaderSize}
      //custom menu
      dropdownMenu={{
        items: {
          free_text: {
            name: `<div style="margin-top:10px">Search Value <br><input type='text' autocomplete="off" class='custom-date col-md-11' placeholder='Search' id='inputCustomSearch' name='inputCustomSearch' value=${
              searchText || ""
            } > 
          </div>`,
            hidden() {
              return ![0, 1].includes(this.getSelectedRangeLast().to.col);
            },
            callback: function (key, selection, clickEvent) {
              var src = clickEvent.target;

              if (src.tagName === "INPUT") {
                clickEvent.stopImmediatePropagation();
              }

              clickEvent.stopImmediatePropagation();
            },
          },
          month: {
            name: `<div  style="${checkboxFilterCss}">Select Month<label class="float-end text-danger "><a><u id="selectAll">Select All</u></a></label></div> <div  class="checkboxmenu custom-scrollbar"> <div >  <table id="searchTable" >
              ${
                monthDropdown &&
                monthDropdown
                  ?.map(
                    (index) =>
                      `<tr><td><input class="checkBoxClass monthCheckBox" type="checkbox" value="${index}" /> <span class="fw-normal">${index}</span> </td></tr>`
                  )
                  .join("")
              }

                </table></div>
                </div>`, // Name can contain HTML
            hidden() {
              return this.getSelectedRangeLast().to.col != 3;
            },
            callback: function (key, selection, clickEvent) {
              var src = clickEvent.target;
              if (src.tagName == "U") {
                if (clickEvent.target.id == "selectAll") {
                  $(".checkBoxClass").prop("checked", true);
                }
              }
              if (src.tagName == "SPAN") {
                $('input[type="checkbox]')
                  .trigger("click")
                  .prop("checked", true);
              }
              clickEvent.stopImmediatePropagation();
            },
          },
          status: {
            name: `<div  style="${checkboxFilterCss}">Select Status<label class="float-end text-danger "><a><u id="selectAll">Select All</u></a></label></div> <div  class="checkboxmenu custom-scrollbar"> <div >  <table id="searchTable" >
              ${
                statusDropdown &&
                statusDropdown
                  ?.map(
                    (index) =>
                      `<tr><td><input class="checkBoxClass statusCheckbox" type="checkbox" value="${index}" /> <span class="fw-normal">${index}</span> </td></tr>`
                  )
                  .join("")
              }

                </table></div>
                </div>`, // Name can contain HTML
            hidden() {
              return this.getSelectedRangeLast().to.col != 4;
            },
            callback: function (key, selection, clickEvent) {
              var src = clickEvent.target;
              if (src.tagName == "U") {
                if (clickEvent.target.id == "selectAll") {
                  $(".checkBoxClass").prop("checked", true);
                }
              }
              if (src.tagName == "SPAN") {
                $('input[type="checkbox]')
                  .trigger("click")
                  .prop("checked", true);
              }
              clickEvent.stopImmediatePropagation();
            },
          },

          clear: {
            name: `<button id='btnClear' name='Clear'  tabIndex="-1"  value='Clear'>Clear</button>`,
            callback: function (key, selection, clickEvent) {
              var src = clickEvent.target;

              if (src.tagName.toLowerCase() === "button") {
                if (clickEvent.target.id == "btnClear") {
                  const selectedColumn = this.getSelected()[0][1];

                  const newAdvanceFilter = { ...advanceFilters };

                  const columnName = backgroundColumns[selectedColumn]?.data;

                  if ([0, 1].includes(selectedColumn)) {
                    newAdvanceFilter[columnName] = "";
                  } else if (selectedColumn == 3) {
                    newAdvanceFilter.selectedMonth = [];
                  } else if (selectedColumn == 4) {
                    newAdvanceFilter.selectedStatus = [];
                  }

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
      afterFilter={function (data) {
        const selectedColumn = this.getSelected()[0][1];

        const newAdvanceFilter = { ...advanceFilters };
        const columnName = backgroundColumns[selectedColumn]?.data;

        if ([0, 1].includes(selectedColumn)) {
          const searchInput =
            document.getElementById("inputCustomSearch")?.value;

          newAdvanceFilter[columnName] = searchInput ?? "";
        } else if (selectedColumn == 3) {
          const checkboxes = document.getElementsByClassName("monthCheckBox");

          const selectedMonths = [];
          for (let i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i].checked) {
              selectedMonths.push(checkboxes[i].value);
            }
          }

          newAdvanceFilter.selectedMonth = selectedMonths;
        } else if (selectedColumn == 4) {
          const checkboxes = document.getElementsByClassName("statusCheckbox");

          const selectedStatus = [];
          for (let i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i].checked) {
              selectedStatus.push(checkboxes[i].value);
            }
          }

          newAdvanceFilter.selectedStatus = selectedStatus;
        }

        applyFilters(newAdvanceFilter);
      }}
      afterDropdownMenuShow={function () {
        const monthCheckboxes =
          document.getElementsByClassName("monthCheckBox");

        for (let i = 0; i < monthCheckboxes.length; i++) {
          if (advanceFilters.selectedMonth.includes(monthCheckboxes[i].value)) {
            $(monthCheckboxes[i]).prop("checked", true);
          }
        }

        const statusCheckboxes =
          document.getElementsByClassName("statusCheckbox");

        for (let i = 0; i < statusCheckboxes.length; i++) {
          if (
            advanceFilters.selectedStatus.includes(statusCheckboxes[i].value)
          ) {
            $(statusCheckboxes[i]).prop("checked", true);
          }
        }

        const selectedColumn = this.getSelected()[0][1];

        if ([0, 1].includes(selectedColumn)) {
          const columnName = backgroundColumns[selectedColumn]?.data;

          setSearchText(advanceFilters[columnName]);

          // document.querySelector(".htUIMultipleSelectSearch.htUIInput input").value = searchValueText
        }
      }}
      afterOnCellMouseDown={() => {
        //TODO MAKE IF require
      }}
      data={hasData ? dataWithout : [{ gstinNumber: "No Data Found!" }]}
      preventOverflow="horizontal"
      rowHeaders={false}
      columns={backgroundColumns}
      comments={true}
      // commentedCellClassName="custom-cell"
      cells={function (row, col) {
        const cellProperties = {};
        const data = this.instance.getData();
        if (col === 4) {
          cellProperties.renderer = emptyRender;
        }
        if (col === 3) {
          cellProperties.renderer = splitRender;
        } else if (col == 1) {
          if (col == 1) {
            if (dataWithout[row]?.company?.length > 22) {
              cellProperties.comment = {
                value: dataWithout[row]?.company,
                style: { width: 200, height: 50 },
                readOnly: true,
              };
            }
          }
          cellProperties.renderer = myLables;
        }

        if (!hasData) cellProperties.className = "text-center";

        return cellProperties;
      }}
      filters={true}
      nestedRows={true}
      contextMenu={false}
      bindRowsWithHeaders={true}
      readOnly={true}
      licenseKey="non-commercial-and-evaluation"
      hiddenColumns={{
        columns: [5, 6],
      }}
      mergeCells={
        hasData ? false : [{ row: 0, col: 0, rowspan: 1, colspan: 7 }]
      }
      afterGetColHeader={theader}
    />
  );
});

export default DownloadHistoryLog;
