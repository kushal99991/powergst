import { HotTable } from "@handsontable/react";
import Handsontable from "handsontable";
import React, { forwardRef, useImperativeHandle } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { columnHeaderSize, RowSize } from "../../../configs/config";

const Columns = [
  {
    data: "isActive",
    type: "checkbox",
    readOnly: false,
    width: 20,
    columnSorting: {
      indicator: false,
      headerAction: false,
    },
  },

  {
    data: "label",
    title: "Section Name",
    width: 100,
  },
];

const emptyColumns = [
  { data: "isActive", readOnly: true, width: 20 },
  {
    data: "label",
    title: "Name",
  },
];

const SectionListForDeleteModel = forwardRef(
  ({ sections = [], setSelectedSections, selectedSections }, ref) => {
    const [activeHeaderBtn, setActiveHeaderBtn] = useState(false);
    const [filteredData, setFilteredData] = useState(sections);

    const [advanceFilters, setAdvanceFilters] = useState({
      label: "",
    });

    useEffect(() => {
      if (sections.length > 0) {
        const selectedCols = [];
        setActiveHeaderBtn(true);

        for (let index = 0; index < sections.length; index++) {
          sections[index]["isActive"] = true;
          selectedCols.push(sections[index]);
        }
        setFilteredData(sections);
        setSelectedSections(selectedCols);
      }
    }, [sections]);

    const colHeaders = (col) => {
      let txt;
      switch (col) {
        case 0:
          txt = "<input type='checkbox' class='checker1'  ";
          txt += activeHeaderBtn ? 'checked="checked"' : "";
          txt += ">";
          return txt;
      }
    };

    const cellChange = (changes, source) => {
      if (changes?.length > 0) {
        let newSelectedSections = [...selectedSections];
        changes.forEach((change) => {
          if (change[0] !== undefined && change[0] !== null) {
            const data = filteredData[change[0]];
            if (change[3]) {
              newSelectedSections.push(data);
            } else {
              setActiveHeaderBtn(false);
              newSelectedSections = newSelectedSections.filter(
                (section) => section.value !== data.value
              );
            }
          }
        });
        setSelectedSections(newSelectedSections);
      }
    };

    const theader = (col, TH) => {
      if (col === 0) {
        const button = TH.children[0].children[0];
        button.parentNode.removeChild(button);
      }

      TH.className = "htLeft";

      const columnName = Columns[col]?.data;

      let filterApplied = false;

      if ([1, 2].includes(col)) {
        filterApplied = !!advanceFilters[columnName];
      }

      if (filterApplied) {
        TH.classList.add("htFiltersActive");
      } else {
        TH.classList.remove("htFiltersActive");
      }
    };

    function myLables(instance, td, row, col, prop, value, cellProperties) {
      Handsontable.renderers.TextRenderer.apply(this, arguments);
      td.innerHTML = `<div class="truncated">${
        value !== null && value !== "" ? value : ""
      }</div>`;
    }

    /**
     * that functions will use in the parent component if needed
     */
    useImperativeHandle(ref, () => ({
      clearFilters() {
        applyFilters({ label: "" });
      },
    }));

    // ** MouseDown click - handsontable
    function localAfterOnCellMouseDown(event, coords, td) {
      if (coords.row == -1 && coords.col == 0) {
        if (
          !event.target.classList.contains("checker") ||
          event.target.classList.contains("checker")
        ) {
          event.stopPropagation();
          const newFilteredData = [...filteredData];
          if (!activeHeaderBtn) {
            event.stopPropagation();

            setActiveHeaderBtn(true);
            const selectedCols = [];
            for (let index = 0; index < filteredData.length; index++) {
              newFilteredData[index]["isActive"] = true;
              selectedCols.push(newFilteredData[index]);
            }

            setSelectedSections(selectedCols);
          } else {
            event.stopPropagation();
            setActiveHeaderBtn(false);
            for (let index = 0; index < filteredData.length; index++) {
              newFilteredData[index]["isActive"] = false;
            }
            setSelectedSections([]);
          }
          setFilteredData(newFilteredData);
        }
      }
    }

    const hasData = filteredData?.length > 0;

    const applyFilters = (advanceFilterValue) => {
      if (sections?.length > 0) {
        let newFilteredData = [...sections];

        const applySearchFilter = (dataToApply, Field) => {
          if (advanceFilterValue[Field]) {
            return dataToApply.filter((item) =>
              item[Field]?.toLowerCase()?.includes(
                advanceFilterValue[Field]?.toLowerCase()
              )
            );
          } else return dataToApply;
        };

        newFilteredData = applySearchFilter(newFilteredData, "label");

        setFilteredData(newFilteredData);
      }
      setAdvanceFilters(advanceFilterValue);
    };

    return (
      <>
        <h3 className="heading-font-18-weight mt-1">Section List</h3>
        <div
          style={{
            height: "380px",
            overflow: "auto",
          }}
        >
          <HotTable
            id="hotDownload"
            columnSorting={true}
            fixedRowsTop={0}
            autoWrapRow={true}
            stretchH="all"
            rowHeights={RowSize}
            columnHeaderHeight={columnHeaderSize}
            autoColumnSize={{
              samplingRatio: 23, // Adjust the samplingRatio as needed
            }}
            manualColumnResize={true}
            dropdownMenu={{
              items: {
                sectionName: {
                  name: `<div style="margin-top:10px">Search Value <br><input type='text' autocomplete="off" class='custom-date col-md-11' placeholder='Search' id='sectionName' name='sectionName' value=${
                    advanceFilters.label || ""
                  } >
          </div>`,
                  hidden() {
                    return ![1].includes(this.getSelectedRangeLast().to.col);
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
                  name: `<button id='btnClear' name='Clear'  tabIndex="-1"  value='Clear'>Clear</button>`,
                  callback: function (key, selection, clickEvent) {
                    var src = clickEvent.target;

                    if (src.tagName.toLowerCase() === "button") {
                      if (clickEvent.target.id == "btnClear") {
                        const selectedColumn = this.getSelected()[0][1];

                        const newAdvanceFilter = { ...advanceFilters };

                        const columnName = Columns[selectedColumn]?.data;

                        newAdvanceFilter[columnName] = "";

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
              const columnName = Columns[selectedColumn]?.data;

              if (selectedColumn == 1) {
                const searchInput =
                  document.getElementById("sectionName")?.value;
                newAdvanceFilter[columnName] = searchInput;
              }

              applyFilters(newAdvanceFilter);
            }}
            data={hasData ? filteredData : [{ label: "No Data Found!" }]}
            preventOverflow="horizontal"
            rowHeaders={false}
            columns={hasData ? Columns : emptyColumns}
            colHeaders={(x) => colHeaders(x)}
            comments={true}
            afterChange={(x, y) => cellChange(x, y)}
            afterGetColHeader={theader}
            filters={true}
            cells={function (row, col, prop) {
              const cellPrp = {};
              if (hasData) {
                if (col == 2) {
                  cellPrp.renderer = myLables;
                }
              } else {
                cellPrp.className = "text-center";
              }
              return cellPrp;
            }}
            afterOnCellMouseDown={localAfterOnCellMouseDown}
            contextMenu={false}
            bindRowsWithHeaders={true}
            readOnly={true}
            licenseKey="non-commercial-and-evaluation"
            mergeCells={
              hasData ? false : [{ row: 0, col: 1, rowspan: 1, colspan: 2 }]
            }
          />
        </div>
      </>
    );
  }
);

export default SectionListForDeleteModel;
