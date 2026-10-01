import { HotTable } from "@handsontable/react";
import Handsontable from "handsontable";
import React, { forwardRef, useImperativeHandle } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { columnHeaderSize, RowSize } from "../../../configs/config";
import getSessionFunction from "../../../configs/getSessionFunction";
import { globleVariable } from "../../../configs/globalVariable";
import { Popover, PopoverHeader, PopoverBody , Button, Input, Row,Col } from 'reactstrap'

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
    data: "gstinNumber",
    title: "GSTIN",
    width: 100,
  },
  {
    data: "companyName",
    title: "Company Name",
    readOnly: true,
    width: 150,
  },
];

const emptyColumns = [
  { data: "isActive", readOnly: true, width: 20 },
  {
    data: "gstinNumber",
    title: "GSTIN",
  },
  {
    data: "companyName",
    title: "Company Name",
  },
];

const CompanyList = forwardRef(
  ({ setSelectedCompanies, selectedCompanies, companyData }, ref) => {
    const [activeHeaderBtn, setActiveHeaderBtn] = useState(false);
    const [filteredData, setFilteredData] = useState([]);
    const [popoverOpenGSTIN, setPopoverOpenGSTIN] = useState(false);
    const [filterGSTIN, setFilterGSTIN] = useState([]);


    const [advanceFilters, setAdvanceFilters] = useState({
      gstinNumber: "",
      companyName: "",
    });

    const G_GSTIN =
      sessionStorage.getItem(globleVariable.G_GSTIN) &&
      getSessionFunction.getSessionValue(globleVariable.G_GSTIN, true);

    useEffect(() => {
      if (companyData?.length > 0) {

        const selectedCols = [];
        const newCompanyData = [...companyData];
        for (let index = 0; index < newCompanyData.length; index++) {
          if (newCompanyData[index]["gstinNumber"] == G_GSTIN) {
            newCompanyData[index]["isActive"] = true;
            // const temp = newCompanyData[0];
            // newCompanyData[0] = newCompanyData[index];
            // newCompanyData[index] = temp;
            selectedCols.push(newCompanyData[0]);
          }
        }

        setFilteredData(newCompanyData);
        setSelectedCompanies(selectedCols);
      }
    }, [companyData]);

    /**
     * that functions will use in the parent component if needed
     */
    useImperativeHandle(ref, () => ({
      clearFilters() {
        applyFilters({ gstinNumber: "", companyName: "" });
      },
    }));

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

      console.log(selectedCompanies, "newSelectedCompanies")

    const cellChange = (changes, source) => {
      if (changes?.length > 0 && filteredData?.length > 0) {

        // if (changes[0][1] == "isActive") {


        //   const companyListArr =  companyData ;

        //   // Initialize newK with existing selected data or an empty array
        //   let newK = selectedCompanies?.length ? [...selectedCompanies] : [];

        //   // Create a Set for faster lookup
        //   const newKSet = new Set(newK);

        //   companyListArr.forEach(item => {
        //     if (item?.isActive) {
        //       // Add active clientIds to newKSet
        //       newKSet.add(item);
        //     } else {
        //       // Remove inactive clientIds from newKSet
        //       newKSet.delete(item);
        //     }
        //   });
        //   // Convert the Set back to an array
        //   newK = Array.from(newKSet);
        //  // refSelect.current = newK.length;

        //   setSelectedCompanies(newK);
        //   }



        let newSelectedCompanies =  selectedCompanies?.length ? [...selectedCompanies] : [];
        changes.forEach((change) => {
          if (change[0] !== undefined && change[0] !== null) {
            const data = filteredData[change[0]];
            if (change[3]) {
              newSelectedCompanies.push(data);
            } else {
              setActiveHeaderBtn(false);
              newSelectedCompanies = newSelectedCompanies.filter(
                (section) => section.gstinNumber !== data.gstinNumber
              );
            }
          }
        });

        setSelectedCompanies(newSelectedCompanies);
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

    // ** MouseDown click - handsontable
    function localAfterOnCellMouseDown(event, coords, td) {
      if (coords.row == -1 && coords.col == 0 && filteredData?.length > 0) {
        if (
          !event.target.classList.contains("checker") ||
          event.target.classList.contains("checker")
        ) {
          event.stopPropagation();
          const newFilteredData = [...filteredData];
          if (!activeHeaderBtn) {
            event.stopPropagation();

            setActiveHeaderBtn(true);
            const selectedCols =  [];
            for (let index = 0; index < filteredData.length; index++) {
              newFilteredData[index]["isActive"] = true;
              selectedCols.push(newFilteredData[index]);
            }

            setSelectedCompanies(selectedCols);
          } else {
            event.stopPropagation();
            setActiveHeaderBtn(false);
            for (let index = 0; index < filteredData.length; index++) {
              newFilteredData[index]["isActive"] = false;
            }
            setSelectedCompanies([]);
          }
          setFilteredData(newFilteredData);
        }
      }
    }

    const hasData = filteredData?.length > 0;

    const applyFilters = (advanceFilterValue) => {
      if (companyData?.length > 0) {
        let newFilteredData = [...companyData];

        const applySearchFilter = (dataToApply, Field) => {
          if (advanceFilterValue[Field]) {
            return dataToApply.filter((item) =>
              item[Field]?.toLowerCase()?.includes(
                advanceFilterValue[Field]?.toLowerCase()
              )
            );
          } else return dataToApply;
        };

        newFilteredData = applySearchFilter(newFilteredData, "gstinNumber");
        newFilteredData = applySearchFilter(newFilteredData, "companyName");



        // let newK = selectedCompanies?.length ? [...selectedCompanies] : [];

        // const newKSet = new Set(newK);

        // newFilteredData?.map((item, index) => {
        //   if (item?.isActive) {
        //     newKSet.push(item);
        //   }
        // });

        let newK = selectedCompanies?.length ? [...selectedCompanies] : [];

        // Create a Set for faster lookup
        const newKSet = new Set(newK);

        newFilteredData.forEach(item => {
          if (item?.isActive) {
            // Add active
            newKSet.add(item);
          } else {
            // Remove inactive
            newKSet.delete(item);
          }
        });

        // Convert the Set back to an array
        newK = Array.from(newKSet);

        const uniqueGstinSet = new Set();
        const uniqueData = newK.filter(item => {
          if (uniqueGstinSet.has(item.gstinNumber)) {
              return false;
          } else {
              uniqueGstinSet.add(item.gstinNumber);
              return true;
          }
      });

       //  console.log(uniqueData, "uniqueData")

        setSelectedCompanies(uniqueData);

        let checkedData = newFilteredData?.map(ele => ({
          ...ele,
          isActive: selectedCompanies.some(company =>  company.gstinNumber === ele?.gstinNumber),
        }));

        setFilteredData(checkedData);
     //  setFilteredData(checkedData)


      }
     // console.table(companyData)
      setAdvanceFilters(advanceFilterValue);
    };


      // ** Bulk Search
  const BulkSearch = () => {
    setPopoverOpenGSTIN(false);
    const gstInValue = document.getElementById("gstin-bulk-gst").value;

    if (gstInValue) {
      const fitlerValue = textSplitArray(gstInValue);

      setFilterGSTIN(fitlerValue)

      if (fitlerValue && companyData?.length > 0) {

        let checkedData = companyData?.map(ele => ({
          ...ele,
          isActive: selectedCompanies.some(company =>  company.gstinNumber === ele?.gstinNumber )  ||  fitlerValue.some(filter => filter.toString().includes(ele.gstinNumber?.toString())),
        }));


       setFilteredData(checkedData)

        let newK = [];
        checkedData?.map((item, index) => {
          if (item?.isActive) {
            newK.push(item);
          }
        });

        setSelectedCompanies(newK);
      }
    }
  }


  const bulkClearFilter = (btnType) => {
    setPopoverOpenGSTIN(false);
    let gstInValue = document.getElementById("gstin-bulk-gst");
    document.getElementById("gstin-bulk-gst").value = "";
    setFilterGSTIN([]);
    let checkedData = companyData?.map(ele => ({
      ...ele,
      isActive: false,
    }));
    setFilteredData(checkedData);

    setSelectedCompanies([])
  }

  const toggleBulkFilter = (btnType) => {
    setPopoverOpenGSTIN(!popoverOpenGSTIN);
  }

  useEffect(() => {
    const gstinInput = document.getElementById("gstin-bulk-gst")
    if (popoverOpenGSTIN && gstinInput) {
      gstinInput.value = filterGSTIN?.join(",") ? filterGSTIN?.join(",") : filterGSTIN
    }

  }, [popoverOpenGSTIN]);

  const textSplitArray = (values) => {
    let filterValue;
    if (values.indexOf(",") != -1) {
      filterValue = values.split(",");
    } else {
      values = values + "\n";
      filterValue = values.split("\n");
    }
    return filterValue;
  };


    return (
            <>

                                    <Button
                                        size="sm"
                                        className={`me-1`}
                                        outline
                                        color="danger"
                                        id="popBottomC"
                                        onClick={(e) => {
                                          e.preventDefault(); // Prevent default form submission behavior
                                        }}
                                      >
                                        <i className="fa fa-filter fa-lg"></i>
                                        <span className="align-middle ms-25">Company GSTIN</span>
                                      </Button>

                                      <span style={{ fontWeight: "bold" }} className='p-0'>{selectedCompanies ? `${selectedCompanies?.length }  ${selectedCompanies?.length > 1 ? 'companies have' : 'company has'}  been selected` : ''}</span>

                                      <Popover
                                        placement="bottom"
                                        target="popBottomC"
                                        isOpen={popoverOpenGSTIN}
                                        toggle={() => toggleBulkFilter("gstin")}
                                        trigger="legacy"
                                      >
                                        <PopoverHeader color="danger">GSTIN Selection</PopoverHeader>
                                        <PopoverBody>
                                          <Input
                                            type="textarea"
                                            rows="2"
                                            id="gstin-bulk-gst"

                                          />
                                          <br></br>
                                          <Button
                                            size="sm"
                                            color="danger"
                                            className="me-1"
                                            outline
                                            onClick={(e) => BulkSearch("gstin")} >
                                            Bulk Selection
                                          </Button>
                                          <Button
                                            size="sm"
                                            color="secondary"
                                            className="me-1"
                                            outline
                                            onClick={(e) => bulkClearFilter("gstin")}
                                          >
                                            Clear
                                          </Button>
                                        </PopoverBody>
                                      </Popover>


          <h3 className="heading-font-18-weight mt-1">List Of Companies</h3>

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
              samplingRatio: 23,
            }}
            manualColumnResize={true}
            dropdownMenu={{
              items: {
                free_text_gst: {
                  name: `<div style="margin-top:10px">Search Value <br><input type='text' autocomplete="off" class='custom-date col-md-11' placeholder='Search' id='inputGSTSearch' name='inputGSTSearch' value=${
                    advanceFilters.gstinNumber || ""
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
                free_text_companyName: {
                  name: `<div style="margin-top:10px">Search Value <br><input type='text' autocomplete="off" class='custom-date col-md-11' placeholder='Search' id='inputCompanySearch' name='inputCompanySearch' value=${
                    advanceFilters.companyName || ""
                  } >
          </div>`,
                  hidden() {
                    return ![2].includes(this.getSelectedRangeLast().to.col);
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
                  document.getElementById("inputGSTSearch")?.value;
                newAdvanceFilter[columnName] = searchInput;
              }

              if (selectedColumn == 2) {
                const searchInput =
                  document.getElementById("inputCompanySearch")?.value;
                newAdvanceFilter[columnName] = searchInput;
              }

              applyFilters(newAdvanceFilter);
            }}
            data={hasData ? filteredData : [{ gstinNumber: "No Data Found!" }]}
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
                  if (col == 2) {
                    if (filteredData[row]?.companyName?.length > 44) {
                      cellPrp.comment = {
                        value: filteredData[row]?.companyName,
                        style: { width: 200, height: 50 },
                        readOnly: true,
                      };
                    }
                  }
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

export default CompanyList;
