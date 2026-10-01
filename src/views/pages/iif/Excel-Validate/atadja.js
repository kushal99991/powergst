import React, { Fragment, useState, useEffect, useRef } from "react";
import { HotTable, HotColumn } from "@handsontable/react";
import { Row, Col } from "reactstrap";
import toast from "react-hot-toast";
import { registerRenderer, textRenderer } from "handsontable/renderers";
import errorCodeConfig from "../../../../configs/apiErrorCodeConfig";
import { getFailed, getDuplicate } from "./store";
import { useDispatch, useSelector } from "react-redux";
// ** Styles
import Swal from "sweetalert2";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import ReactPaginate from "react-paginate";
import gstr1PurchaseInvoiceService from "../../../../services/gstr1/gstr1Services/gstr1PurchaseInvoiceService";
import purchaseInvoiceService from "../../../../services/Reco/Purchase/purchaseInvoiceService";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "handsontable/dist/handsontable.full.min.css";
import { registerAllModules } from "handsontable/registry";
import Handsontable from "handsontable";
import { PageSize, RowSize, columnHeaderSize } from "@configs/config";
import { handleValidateExcel, validationErrorMessage } from "../../../../helper/validation";

registerAllModules();
let isActive = false;

var validClass = "";

const validColumns = [
  {
    data: "srNo",
    title: "Sr No.",

    frozen: true,
    cellClass: "SrNoGCol",
  },
  {
    data: "placeOfSupply",
    title: "Place of Supply(POS)",
  },

  {
    data: "rate",
    title: "Rate",
  },
  {
    data: "advancePaidAdjusted",
    title: "Advance amount adjusted (₹)",
  },

  {
    data: "cessPaid",
    title: "Cess amount to be adjusted (₹)",
  },
];

const invalidColumns = [
  { data: "isActive", type: "checkbox", readOnly: false, width: 18 },
  {
    data: "srNo",
    title: "Sr No.",

    frozen: true,
  },
  {
    data: "ErrorList",
    title: "Error",
    readOnly: true,
    width: 250,
  },
  {
    title: "Financial Year",
    data: "FinancialYear",
    type: "numeric",
  },
  {
    title: "Original Month",
    data: "OriginalMonth",
    type: "numeric",
  },
  {
    data: "OriginalPlaceOfSupply",
    title: "Original Place of Supply(POS)",
  },
  {
    data: "ApplicableOfTaxRate",
    title: "Applicable % of Tax Rate",
    type: "numeric",
    numericFormat: {
      pattern: "0,0.00",
      culture: "en-IN",
    },
  },

  {
    data: "Rate",
    title: "Rate",
    type: "numeric",
    numericFormat: {
      pattern: "0,0.00",
      culture: "en-IN",
    },
  },
  {
    data: "GrossAdvanceAdjusted",
    title: "Gross Advance amount adjusted (₹)",
    type: "numeric",
    numericFormat: {
      pattern: "0,0.00",
      culture: "en-IN",
    },
  },
  {
    title: "IGST Amount (₹)",
    data: "IGST",
    type: "numeric",
    numericFormat: {
      pattern: "0,0.00",
      culture: "en-IN",
    },
  },
  {
    title: "CGST Amount (₹)",
    data: "CGST",
    type: "numeric",
    numericFormat: {
      pattern: "0,0.00",
      culture: "en-IN",
    },
  },
  {
    title: "SGST Amount (₹)",
    data: "SGST",
    type: "numeric",
    numericFormat: {
      pattern: "0,0.00",
      culture: "en-IN",
    },
  },
  {
    data: "Cess",
    title: "Cess amount to be adjusted (₹)",
    type: "numeric",
    numericFormat: {
      pattern: "0,0.00",
      culture: "en-IN",
    },
  },
  {
    title : 'Company GSTIN',
    data:'CompanyGSTIN',
    readOnly: true,
    width: 150
}
];

//** button - Action column
function myLables(instance, td, row, col, prop, value, cellProperties) {
  Handsontable.renderers.TextRenderer.apply(this, arguments);
  td.innerHTML = `<div class="truncated">${
    value !== null && value !== "" ? value : ""
  }</div>`;
}

const arrInvalid = invalidColumns.map((item) => {
  return {
    data: item.key,
  };
});
let newR = [];

invalidColumns.map((item, index) => {
  newR.push(`${item.title}`);
});

let newWidth = [];
invalidColumns.map((item) => {
  newWidth.push(item.width);
});

const arrValid = validColumns.map((item) => {
  return {
    data: item.key,
  };
});
let newValid = [];
const emptyColumns = [...validColumns.slice(1)];

validColumns.map((item) => {
  newValid.push(item.title);
});

const AtadjaValidate = ({
  data,
  btnType,
  tabRecord,
  activeTab,
  clearFilter,
  errorArr,
  setErrorArr,
}) => {
  const [invalidaDatarows, setvalidaDatarows] = useState([]);
  const [block1, setBlock1] = useState(false);

  const [page, setPage] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [payloadDuplicate, setPayloadDuplicate] = useState([]);
  const dispatch = useDispatch();
  const store = useSelector((state) => state.gstr1ExcelData);
  const [currentCol, setCurrentCol] = useState([]);
  const [currentCol1, setCurrentCol1] = useState();
  const [searchVal1, setSearchVal1] = useState([]);
  const [searchDate, setSearchDate] = useState([]);
  const storeSales = useSelector(
    (state) => state.gstr1ExcelData?.GSTR1_EXCEL_VALIDATE
  );

  const hotRef = useRef(null);
  const hotRef2 = useRef(null);

  let atadjaDup = [];
  let allDataDuplicate = [];

  function localAfterOnCellMouseDown(event, coords, td) {
    const Index = currentCol?.findIndex(
      (item) => invalidColumns[coords?.col]?.data == item
    );

    if (Index != -1) {
      setTimeout(function () {
        var searchInput = document?.querySelector(
          ".htUIMultipleSelectSearch.htUIInput"
        );
        if (searchInput !== null) {
          searchInput.children[0].value = searchVal1[Index];
        }
      }, 200);
    } else {
      setTimeout(function () {
        var searchInput = document?.querySelector(
          ".htUIMultipleSelectSearch.htUIInput"
        ); // searchInput.children[0].innerHTML ="hii1"
        if (searchInput !== null) {
          searchInput.children[0].value = "";
        }
      }, 100);
    }
    const hot = hotRef?.current?.hotInstance;
    const totalRows = hot.countRows();
    if (event.target.classList.contains("checker")) {
      event.stopPropagation();
      setBlock1(true);

      if (!isActive) {
        event.stopPropagation();
        isActive = true;
        setTimeout(() => {
          for (let index = 0; index < totalRows; index++) {
            hot.setDataAtCell(index, 0, true);
            index == totalRows - 1 ? setBlock1(false) : "";
          }
        }, 50);
      } else {
        event.stopPropagation();
        isActive = false;
        setTimeout(() => {
          for (let index = 0; index < totalRows; index++) {
            hot.setDataAtCell(index, 0, false);
            index == totalRows - 1 ? setBlock1(false) : "";
          }
        }, 50);
      }
    }

    setCurrentCol1(coords?.col);
  }

  const localBeforeSetRangeStart = (coords) => {
    const { row, col } = coords;

    // Check if the user is trying to select the checkbox cell (column index 0)
    if (col === 0) {
      const isChecked = hotRef.current.hotInstance.getDataAtCell(row, col);
      hotRef.current.hotInstance.setDataAtCell(row, col, !isChecked);

      // Prevent selecting the cell, since we manually toggled the checkbox
      return false;
    }
  };
  function localAfterOnCellMouseDownEmpty(event, coords, td) {
    const Index = currentCol?.findIndex(
      (item) => invalidColumns[coords?.col]?.data == item
    );

    if (Index != -1) {
      setTimeout(function () {
        var searchInput = document?.querySelector(
          ".htUIMultipleSelectSearch.htUIInput"
        );
        if (searchInput !== null) {
          searchInput.children[0].value = searchVal1[Index];
        }
      }, 200);
    } else {
      setTimeout(function () {
        var searchInput = document?.querySelector(
          ".htUIMultipleSelectSearch.htUIInput"
        ); // searchInput.children[0].innerHTML ="hii1"
        if (searchInput !== null) {
          searchInput.children[0].value = "";
        }
      }, 100);
    }
    setCurrentCol1(coords?.col);
  }

  const colHeaders = (col) => {
    console.log("header is called");
    let txt;
    switch (col) {
      case 0:
        txt = "<input type='checkbox' class='checker'  ";
        txt += isActive ? 'checked="checked"' : "";
        txt += ">";
        return txt;
    }
  };

  const theader = (col, TH) => {
    if (col === 0 || col === 1 || col === 2 || col === 13) {
      const button = TH.children[0].children[0];
      button?.parentNode?.removeChild(button);
    }

    if (col == 3 || col == 4 || col == 6 || col == 7 || col == 8 || col == 9) {
      TH.className = "htRight";
    } else {
      TH.className = "htLeft";
    }
  };
  if (store?.duplicateData?.length) {
    for (let item of store?.duplicateData) {
      if (item.sheetName?.toLowerCase() == "atadja") {
        // console.log("item3=", item);
        atadjaDup.push(item.data);
      } else {
        allDataDuplicate.push(item);
      }
    }
  }
  const atadjaDuplicateData = atadjaDup.length ? atadjaDup[0] : [];

  let atadjaFail = [];
  let allDataFailed = [];
  if (store?.failedData?.length) {
    for (let item of store?.failedData) {
      if (item.sheetName?.toLowerCase() == "atadja") {
        // console.log("item3=", item);
        atadjaFail.push(item.data);
      } else {
        allDataFailed.push(item);
      }
    }
  }
  const atadjaFailedData = atadjaFail.length ? atadjaFail[0] : [];

  const handlePageClick = (event) => {
    setPage(event?.selected);
  };

  function emptyRender(instance, td, row, col, prop, value, cellProperties) {
    textRenderer.apply(this, arguments);
    // if row contains negative number
    if (!value || value === "") {
    }
    // td.style.background = '';
  }

  const cellChange = (change, source) => {
    if (
      source === "CopyPaste.paste" ||
      source === "edit" ||
      source === "Autofill.fill"
    ) {
      const hot = hotRef?.current?.hotInstance;

      let withoutErrArr = [];
      for (let i = 0; i < change.length; i++) {
        const [row, col, , value] = change[i]; // Get the edited cell value
        const colIndex = invalidColumns.findIndex((obj) => obj.data === col);

        let cellObj = {
          row: row,
          col: colIndex,
          tab: activeTab,
          validationMsg: "Only Numeric Value Allowed",
          colName:invalidColumns[colIndex],
          page:page
        };
        if(handleValidateExcel.test(value)){
          cellObj.validationMsg = validationErrorMessage(value);
          setErrorArr((pre) => [...pre, cellObj]);
        }
        else {
          if (
            errorArr.findIndex(
              (y) =>
                y.row == cellObj.row &&
                y.col == cellObj.col &&
                y.tab == cellObj.tab
            ) != -1
          ) {
            withoutErrArr.push(cellObj);
          }
        }

        if (
          colIndex == 3 ||
          colIndex == 4 ||
          colIndex == 6 ||
          colIndex == 7 ||
          colIndex == 8 ||
          colIndex == 9
        ) {
          const oldVal = change[i][2];
          // Check if the edited value is numeric
          if (isNaN(value)) {
            setErrorArr((pre) => [...pre, cellObj]);
          } else {
            if (
              errorArr.findIndex(
                (y) =>
                  y.row == cellObj.row &&
                  y.col == cellObj.col &&
                  y.tab == cellObj.tab
              ) != -1
            ) {
              withoutErrArr.push(cellObj);
            }
          }
        }
      }

      if (withoutErrArr.length > 0) {
        const withErrArr = errorArr;
        const filteredArr = withErrArr.filter(
          (itemX) =>
            !withoutErrArr.some(
              (itemY) =>
                itemY.row === itemX.row &&
                itemY.col === itemX.col &&
                itemY.tab === itemX.tab &&
                itemY.page === itemX.page
            )
        );
        setErrorArr(filteredArr);
      }
    }

    let y;

    var newPayloadFail = atadjaFailedData;

    for (
      let i = 0;
      btnType == "btnInvalidData" ? i <= change?.length : i < change?.length;
      i++
    ) {
      y = gridData[change[i]?.[0]];
      if (y) {
        if (btnType == "btnInvalidData") {
          const failedIndex = newPayloadFail?.findIndex(
            (item) => item.RowGUIDReact == y?.RowGUIDReact
          );

          if (failedIndex != -1) {
            const k1 = JSON.parse(JSON.stringify(newPayloadFail));
            let k2 = JSON.parse(JSON.stringify(y));
            k1[failedIndex] = k2;
            newPayloadFail = [...JSON.parse(JSON.stringify(k1))];
          } else {
            let xRef = JSON.parse(JSON.stringify(y));

            newPayloadFail = [...newPayloadFail, xRef];
          }
          let matchingElements = invalidaDatarows.filter((item) => {
            return newPayloadFail.find(
              (item2) => item2.RowGUIDReact == item.RowGUIDReact
            );
          });
          // newPayloadFail = matchingElements
          newPayloadFail = [...JSON.parse(JSON.stringify(matchingElements))];
          const payload = [
            {
              sheetId: sheetId,
              sheetName: sheetName,
              guid: GUID,
              totalRecords: newPayloadFail.length?.toString(),
              data: newPayloadFail,
            },
            ...allDataFailed,
          ];

          dispatch(getFailed(payload));
        } else {
          const k = invalidaDatarows;
          let newK = [];
          k?.map((item, index) => {
            if (item?.isActive) {
              newK.push(item);
            }
          });

          const payload = [
            {
              sheetId: sheetId,
              sheetName: sheetName,
              guid: GUID,
              data: JSON.parse(JSON.stringify(newK)),
              totalRecords: JSON.parse(JSON.stringify(newK)).length?.toString(),
            },
            ...allDataDuplicate,
          ];
          dispatch(getDuplicate(payload));
        }
      }
    }
  };

  const sheetData = (i = "atadja") => {
    const failedIndex = data?.failedData?.findIndex(
      (item) => item?.sheetName?.toLowerCase() == i
    );

    return data?.failedData?.[failedIndex];
  };

  const sheetName = sheetData()?.sheetName;
  const GUID = sheetData()?.guid;
  const sheetId = sheetData()?.sheetId;

  const loadImpg = () => {
    const payloadSheet = {
      sheetName: sheetName,
      guid: GUID,
      // "status": status,
      pageNumber: page + 1,
      pageSize: PageSize,
      sheetId: sheetId,
      orderByColumnName: "",
      orderBy: "",
      searchColumnName: currentCol,
      searchValue: searchVal1,
    };
    if (data !== null) {
      if (store?.GSTR1_EXCEL_VALIDATE?.length > 0) {
        if (btnType == "btnInvalidData") {
          payloadSheet.status = 0;
          if (store?.GSTR1_EXCEL_VALIDATE?.length > 0) {
            const arrError1 = store?.GSTR1_EXCEL_VALIDATE[0]?.ATADJA;
            const arrError2 = atadjaFailedData;
            const arrError = arrError1.map(
              (obj) =>
                arrError2.find(
                  (o) =>
                    o.RowGUIDReact === obj.RowGUIDReact &&
                    o.Gstr1DetailId === obj.Gstr1DetailId
                ) || obj
            );
            setvalidaDatarows(JSON.parse(JSON.stringify(arrError)));
            tabRecord(arrError1.length, sheetName, sheetId, status);
          } else {
            setvalidaDatarows([]);
            tabRecord(0, sheetName, sheetId, status);
          }
        } else if (btnType == "btnValidData") {
          payloadSheet.status = 1;

          if (store?.GSTR1_EXCEL_VALIDATE?.length > 0) {
            tabRecord(
              store?.GSTR1_EXCEL_VALIDATE[0]?.ATADJA?.length,
              sheetName,
              sheetId,
              status
            );
            setvalidaDatarows(store?.GSTR1_EXCEL_VALIDATE[0]?.ATADJA);
          } else {
            setvalidaDatarows([]);
            tabRecord(0, sheetName, sheetId, status);
          }
        } else {
          payloadSheet.status = 2;
          if (store?.GSTR1_EXCEL_VALIDATE?.length > 0) {
            const arrDuplicate1 = store?.GSTR1_EXCEL_VALIDATE[0]?.ATADJA.map(
              (item) => {
                return {
                  ...item,
                };
              }
            );
            const arrDuplicate2 = atadjaDuplicateData;

            const arrDuplicate = arrDuplicate1.map(
              (obj) =>
                arrDuplicate2?.find(
                  (o) => o.RowGUIDReact === obj.RowGUIDReact
                ) || obj
            );
            tabRecord(arrDuplicate2.length, sheetName, sheetId, status);

            setvalidaDatarows(arrDuplicate ? arrDuplicate : arrDuplicate1);

            // setvalidaDatarows(store?.PURCHASE_EXCEL_VALIDATE[0].B2B);
          } else {
            setvalidaDatarows([]);
          }
        }
      }
    }
  };

  useEffect(() => {
    loadImpg();
    isActive = false;
    dispatch(getDuplicate([]));
  }, [btnType, searchVal1]);

  useEffect(() => {
    return () => setBlock1(false);
  }, []);

  useEffect(() => {
    setSearchVal1([]);
    setCurrentCol([]);
    loadImpg();
  }, [clearFilter]);

  useEffect(() => {
    loadImpg();
    if (store == undefined) {
      setBlock1(true);
    } else {
      setBlock1(false);
    }
  }, [storeSales]);

  // ** Filter
  function FilterData(arr) {
    let addArr = [];
    let updatedData = [];
    let finalObj = {};

    for (let i = 0; i < arr.length; i++) {
      Object.assign(finalObj, arr[i]);
    }

    let gridDataFilter =
      store?.GSTR1_EXCEL_VALIDATE != undefined ||
      store?.GSTR1_EXCEL_VALIDATE != null
        ? store?.GSTR1_EXCEL_VALIDATE[0].ATADJA
        : [];

    updatedData = gridDataFilter

      .filter((OriginalMonthItem) =>
        finalObj.OriginalMonth?.length
          ? OriginalMonthItem.OriginalMonth?.toLowerCase().includes(
              // finalObj.InvoiceDate?.toLowerCase()
              moment(finalObj?.OriginalMonth).format("DD-MM-YYYY")
            )
          : OriginalMonthItem
      )
      .filter((FinancialYearItem) =>
        finalObj.FinancialYear?.length
          ? FinancialYearItem.FinancialYear?.toLowerCase().includes(
              finalObj.FinancialYear?.toLowerCase()
            )
          : FinancialYearItem
      )
      .filter((OriginalPlaceOfSupplyItem) =>
        finalObj.OriginalPlaceOfSupply?.length
          ? OriginalPlaceOfSupplyItem.OriginalPlaceOfSupply?.toLowerCase().includes(
              finalObj.OriginalPlaceOfSupply?.toLowerCase()
            )
          : OriginalPlaceOfSupplyItem
      )

      .filter((ApplicableOfTaxRateItem) =>
        finalObj.ApplicableOfTaxRate?.length
          ? ApplicableOfTaxRateItem.ApplicableOfTaxRate?.toLowerCase().includes(
              finalObj.ApplicableOfTaxRate?.toLowerCase()
            )
          : ApplicableOfTaxRateItem
      )

      .filter((RateItem) =>
        finalObj.Rate?.length
          ? RateItem.Rate?.toLowerCase().includes(finalObj.Rate?.toLowerCase())
          : RateItem
      )
      .filter((CessItem) =>
        finalObj.Cess?.length
          ? CessItem.Cess?.toLowerCase().includes(finalObj.Cess?.toLowerCase())
          : CessItem
      )
      .filter((GrossAdvanceAdjustedItem) =>
        finalObj.GrossAdvanceAdjusted?.length
          ? GrossAdvanceAdjustedItem.GrossAdvanceAdjusted?.toLowerCase().includes(
              finalObj.GrossAdvanceAdjusted?.toLowerCase()
            )
          : GrossAdvanceAdjustedItem
      )
      .filter((IGSTItem) =>
        finalObj.IGST?.length
          ? IGSTItem.IGST?.toLowerCase().includes(finalObj.IGST?.toLowerCase())
          : IGSTItem
      )
      .filter((CGSTItem) =>
        finalObj.CGST?.length
          ? CGSTItem.CGST?.toLowerCase().includes(finalObj.CGST?.toLowerCase())
          : CGSTItem
      )
      .filter((SGSTItem) =>
        finalObj.SGST?.length
          ? SGSTItem.SGST?.toLowerCase().includes(finalObj.SGST?.toLowerCase())
          : SGSTItem
      );

    const dataFilter = updatedData.map((item) => {
      return {
        ...item,
      };
    });
    addArr.push(...dataFilter);

    setPage(0);
    let uniq = [...new Set(addArr)];
    return uniq;
  }

  let arrFilter = [];

  const columnName = invalidColumns;

  const pageCountClientSide = Math.ceil(
    invalidaDatarows?.length && invalidaDatarows?.length / PageSize
  );
  const para1 = page * PageSize;
  const para2 = page * PageSize + PageSize;
  var gridData = invalidaDatarows && invalidaDatarows.slice(para1, para2);

  return (
    <>
      {block1 && <div className="loading1">Loading&#8230;</div>}

      <div
        className=""
        style={{ maxHeight: "450px", overflowY: "auto", overflowX: "hidden" }}
      >
        <Row>
          <Col md={12}>
            {gridData?.length ? (
              <HotTable
                rowHeights={RowSize}
                columnHeaderHeight={columnHeaderSize}
                autoColumnSize={true}
                stretchH="all"
                height="auto"
                ref={hotRef}
                data={gridData ? gridData : []}
                preventOverflow="horizontal"
                rowHeaders={false}
                columns={invalidColumns}
                // columns={btnType == 'btnInvalidData' ? invalidColumns.slice(1) : btnType == 'btnDuplicateData' ? invalidColumns : validColumns}
                colHeaders={(x) => colHeaders(x)} // colHeaders={btnType != 'btnDuplicateData' ? newR.slice(1) : newR}
                afterRenderer={(TD, row, col, prop, value) => {
                  if (
                    btnType == "btnInvalidData" &&
                    (!col == 0) &&
                    errorArr.findIndex(
                      (y) => y.row == row && y.col == col && y.tab == activeTab && y.page == page
                    ) != -1
                  ) {
                    TD.style.backgroundColor = "red";
                  }
                }}
                beforeKeyDown={function (e, col) {
                  // Delete and Backspace , copy and paste

                  if (
                    e.keyCode == 8 ||
                    e.keyCode == 46 ||
                    e.keyCode == 67 ||
                    e.keyCode == 86
                  ) {
                  } else {
                    var reg = /^[0-9.]+|[\b]+$/;
                    let col = this?.getSelectedLast()?.[1];

                    if (
                      col == 3 ||
                      col == 4 ||
                      col == 6 ||
                      col == 7 ||
                      col == 8 ||
                      col == 9
                    ) {
                      if (!reg.test(e.key)) {
                        e.preventDefault();
                      }
                    }
                  }
                }}
                comments={true}
                afterChange={(x, y) => {
                  console.log(x, "xxxxxxx");
                  if (x != null) {
                    for (let i = 0; i < x.length; i++) {
                      if (x[i][2] == null && x[i][3] == undefined) {
                        return;
                      } else {
                        cellChange(x, y);
                      }
                    }
                  }
                }}
                filters={true}
                nestedRows={true}
                contextMenu={false}
                bindRowsWithHeaders={true}
                afterOnCellMouseDown={localAfterOnCellMouseDown}
                beforeSetRangeStart={
                  btnType == "btnDuplicateData" && localBeforeSetRangeStart
                }
                afterGetColHeader={theader}
                dropdownMenu={{
                  items: {
                    filter_by_value: {
                      name: "Search Value",
                      // hide the 'Filter by value' list from all columns but the first one
                    },

                    clear: {
                      name: `<button id='btnClear' name='Clear'   value='Clear'>Clear</button>`,
                      //disabled: true,
                      callback: function (key, selection, clickEvent) {
                        var src = clickEvent.target;

                        if (src.tagName.toLowerCase() === "button") {
                          if (clickEvent.target.id == "btnClear") {
                            const hot = hotRef?.current?.hotInstance;

                            var searchInput1 =
                              document.getElementById("custom1");
                            var value = "";
                            setSearchDate(value);

                            const x = searchVal1;
                            if (!searchVal1?.length) {
                              x.push(value);
                              let y = currentCol;
                              y.push(columnName[currentCol1]?.data);
                              // console.log("jsx=",x,y)
                              setSearchVal1(x);
                              setCurrentCol(y);

                              // forceUpdate();
                            } else {
                              const Index = currentCol?.findIndex(
                                (item) => columnName[currentCol1]?.data == item
                              );
                              // if (item == columnName[currentCol1]?.data)
                              if (Index != -1) {
                                const xyz = searchVal1;
                                xyz[Index] = value;
                                setSearchVal1(xyz);
                              } else {
                                x.push(value);
                                let y = currentCol;
                                y.push(columnName[currentCol1]?.data);
                                // console.log("jsx=",x,y)
                                setSearchVal1(x);
                                setCurrentCol(y);
                              }
                            }
                            // page == 0 ? loadImpg() : setPage(0);
                            let uniq = [...new Set(currentCol)];
                            for (let i = 0; i < uniq.length; i++) {
                              var obj = {};

                              for (let j = 0; j < searchVal1.length; j++) {
                                if (i == j) {
                                  obj[uniq[i]] = searchVal1[j];
                                  arrFilter.push(obj);
                                }
                              }
                            }
                            let newFilterData = FilterData(arrFilter);
                            setvalidaDatarows([...newFilterData]);
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
                  const hot = hotRef?.current?.hotInstance;

                  // if (hot.getSelected()?.[0]?.[1] != (btnType == 'btnInvalidData' ? 4 : btnType == 'btnDuplicateData' ? 5 : 3)) {
                  var searchInput = document.querySelector(
                    ".htUIMultipleSelectSearch.htUIInput"
                  );
                  var value = searchInput?.children[0]?.value;

                  const x = searchVal1;
                  if (!searchVal1?.length) {
                    x.push(value);
                    let y = currentCol;
                    y.push(columnName[currentCol1]?.data);
                    // console.log("jsx=",x,y)
                    setSearchVal1(x);
                    setCurrentCol(y);
                  } else {
                    const Index = currentCol?.findIndex(
                      (item) => columnName[currentCol1]?.data == item
                    );
                    // if (item == columnName[currentCol1]?.data)
                    if (Index != -1) {
                      const xyz = searchVal1;
                      xyz[Index] = value;
                      setSearchVal1(xyz);
                    } else {
                      x.push(value);
                      let y = currentCol;
                      y.push(columnName[currentCol1]?.data);
                      // console.log("jsx=",x,y)
                      setSearchVal1(x);
                      setCurrentCol(y);
                    }
                  }
                  // page == 0 ? loadImpg() : setPage(0);
                  let uniq = [...new Set(currentCol)];
                  for (let i = 0; i < uniq.length; i++) {
                    var obj = {};

                    for (let j = 0; j < searchVal1.length; j++) {
                      if (i == j) {
                        obj[uniq[i]] = searchVal1[j];
                        arrFilter.push(obj);
                      }
                    }
                  }
                  let newFilterData = FilterData(arrFilter);
                  setvalidaDatarows([...newFilterData]);
                }}
                hiddenColumns={{
                  columns:
                    btnType == "btnValidData"
                      ? [0, 1, 2]
                      : btnType == "btnInvalidData"
                      ? [0, 1]
                      : [1, 2],
                }}
                mergeCells={false}
                readOnly={btnType == "btnInvalidData" ? false : true}
                licenseKey="non-commercial-and-evaluation"
                beforeCreateRow={function (index, amount) {
                  let countRow = this?.countRows();
                  if (this?.isEmptyRow(countRow - 0)) {
                    return false;
                  }
                  return true;
                }}
                cells={function (row, col, prop) {
                  const cellPrp = {};

                  if (col == 2) {
                    if (gridData[row]?.ErrorList?.length > 33) {
                      cellPrp.comment = {
                        value: gridData[row]?.ErrorList,
                        style: { width: 200, height: 50 },
                        readOnly: true,
                      };
                    }
                    cellPrp.renderer = myLables;
                  }
                  return cellPrp;
                }}
              />
            ) : (
              <HotTable
                rowHeights={RowSize}
                columnHeaderHeight={columnHeaderSize}
                autoColumnSize={true}
                afterGetColHeader={theader}
                stretchH="all"
                style={{ textAlign: "center" }}
                data={[{ FinancialYear: "No Data Found!" }]}
                mergeCells={[{ row: 0, col: 3, rowspan: 1, colspan: 7 }]}
                columns={invalidColumns}
                hiddenColumns={{
                  columns: [0, 1, 2],
                }}
                comments={false}
                beforeCreateRow={function (index, amount) {
                  let countRow = this?.countRows();
                  if (this?.isEmptyRow(countRow - 0)) {
                    return false;
                  }
                  return true;
                }}
                afterOnCellMouseDown={localAfterOnCellMouseDownEmpty}
                dropdownMenu={{
                  items: {
                    filter_by_value: {
                      name: "Search Value",
                      // hide the 'Filter by value' list from all columns but the first one
                    },

                    clear: {
                      name: `<button id='btnClear' name='Clear'   value='Clear'>Clear</button>`,
                      //disabled: true,
                      callback: function (key, selection, clickEvent) {
                        var src = clickEvent.target;

                        if (src.tagName.toLowerCase() === "button") {
                          if (clickEvent.target.id == "btnClear") {
                            const hot = hotRef2?.current?.hotInstance;

                            var searchInput1 =
                              document.getElementById("custom1");
                            var value = "";
                            setSearchDate(value);

                            const x = searchVal1;
                            if (!searchVal1?.length) {
                              x.push(value);
                              let y = currentCol;
                              y.push(columnName[currentCol1]?.data);
                              // console.log("jsx=",x,y)
                              setSearchVal1(x);
                              setCurrentCol(y);

                              // forceUpdate();
                            } else {
                              const Index = currentCol?.findIndex(
                                (item) => columnName[currentCol1]?.data == item
                              );
                              // if (item == columnName[currentCol1]?.data)
                              if (Index != -1) {
                                const xyz = searchVal1;
                                xyz[Index] = value;
                                setSearchVal1(xyz);
                              } else {
                                x.push(value);
                                let y = currentCol;
                                y.push(columnName[currentCol1]?.data);
                                // console.log("jsx=",x,y)
                                setSearchVal1(x);
                                setCurrentCol(y);
                              }
                            }
                            // page == 0 ? loadImpg() : setPage(0);
                            let uniq = [...new Set(currentCol)];
                            for (let i = 0; i < uniq.length; i++) {
                              var obj = {};

                              for (let j = 0; j < searchVal1.length; j++) {
                                if (i == j) {
                                  obj[uniq[i]] = searchVal1[j];
                                  arrFilter.push(obj);
                                }
                              }
                            }
                            let newFilterData = FilterData(arrFilter);
                            setvalidaDatarows([...newFilterData]);
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
                  const hot = hotRef2?.current?.hotInstance;

                  // if (hot.getSelected()?.[0]?.[1] != (btnType == 'btnInvalidData' ? 4 : btnType == 'btnDuplicateData' ? 5 : 3)) {
                  var searchInput = document.querySelector(
                    ".htUIMultipleSelectSearch.htUIInput"
                  );
                  var value = searchInput?.children[0]?.value;

                  const x = searchVal1;
                  if (!searchVal1?.length) {
                    x.push(value);
                    let y = currentCol;
                    y.push(columnName[currentCol1]?.data);
                    // console.log("jsx=",x,y)
                    setSearchVal1(x);
                    setCurrentCol(y);
                  } else {
                    const Index = currentCol?.findIndex(
                      (item) => columnName[currentCol1]?.data == item
                    );
                    // if (item == columnName[currentCol1]?.data)
                    if (Index != -1) {
                      const xyz = searchVal1;
                      xyz[Index] = value;
                      setSearchVal1(xyz);
                    } else {
                      x.push(value);
                      let y = currentCol;
                      y.push(columnName[currentCol1]?.data);
                      // console.log("jsx=",x,y)
                      setSearchVal1(x);
                      setCurrentCol(y);
                    }
                  }
                  // page == 0 ? loadImpg() : setPage(0);
                  let uniq = [...new Set(currentCol)];
                  for (let i = 0; i < uniq.length; i++) {
                    var obj = {};

                    for (let j = 0; j < searchVal1.length; j++) {
                      if (i == j) {
                        obj[uniq[i]] = searchVal1[j];
                        arrFilter.push(obj);
                      }
                    }
                  }
                  let newFilterData = FilterData(arrFilter);
                  setvalidaDatarows([...newFilterData]);
                }}
                filters={true}
                afterChange={() => {
                  console.log("hi");
                }}
                nestedRows={true}
                contextMenu={false}
                bindRowsWithHeaders={true}
                licenseKey="non-commercial-and-evaluation"
                height="auto"
                readOnly={true}
              />
            )}
          </Col>
        </Row>
      </div>
      {invalidaDatarows?.length ? (
        <ReactPaginate
          breakLabel="..."
          nextLabel=""
          onPageChange={handlePageClick}
          pageRangeDisplayed={2}
          pageCount={pageCountClientSide}
          forcePage={page}
          previousLabel=""
          renderOnZeroPageCount={null}
          marginPagesDisplayed={2}
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
      ) : (
        <></>
      )}
    </>
  );
};

export default AtadjaValidate;
