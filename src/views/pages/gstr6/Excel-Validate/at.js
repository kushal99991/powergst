import React, { Fragment, useState, useEffect, useRef } from "react";
import { HotTable, HotColumn } from "@handsontable/react";
import { Row, Col } from "reactstrap";
import Flatpickr from "react-flatpickr";
import toast from "react-hot-toast";
import errorCodeConfig from "../../../../configs/apiErrorCodeConfig";
import { getFailed, getDuplicate } from "./store";
import { useDispatch, useSelector } from "react-redux";
// ** Styles
import Swal from "sweetalert2";
import ReactDOM from "react-dom";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import ReactPaginate from "react-paginate";
import gstr1PurchaseInvoiceService from "../../../../services/gstr1/gstr1Services/gstr1PurchaseInvoiceService";
// import purchaseInvoiceService from "../../../../services/Reco/Purchase/purchaseInvoiceService";

import "handsontable/dist/handsontable.full.min.css";
import { registerAllModules } from "handsontable/registry";
import purchaseInvoiceService from "../../../../services/Reco/Purchase/purchaseInvoiceService";
import Handsontable from "handsontable";
import { PageSize, RowSize, columnHeaderSize } from "@configs/config";
import moment from "moment";
import { handleValidateExcel, validationErrorMessage } from "../../../../helper/validation";

const Rates = [
  "0.000",
  "0.100",
  "0.250",
  "1.000",
  "1.500",
  "3.000",
  "5.000",
  "6.000",
  "7.500",
  "12.000",
  "18.000",
  "28.000",
];
const ReverseCharge = ["Yes", "No"];
const EligibilityForITC = [
  "Input",
  "Capital goods",
  "Input services",
  "Ineligible",
];

export function RatedropDownEditor({ row, onRowChange }) {
  return (
    <select
      value={row.rate}
      onChange={(event) =>
        onRowChange({ ...row, rate: event.target.value }, true)
      }
      autoFocus
    >
      {Rates.map((title) => (
        <option key={title} value={title}>
          {title}
        </option>
      ))}
    </select>
  );
}
registerAllModules();
let isActive = false;

export function ReverseChargedropDownEditor({ row, onRowChange }) {
  return (
    <select
      value={row.invoiceType}
      onChange={(event) =>
        onRowChange({ ...row, invoiceType: event.target.value }, true)
      }
      autoFocus
    >
      {ReverseCharge.map((title) => (
        <option key={title} value={title}>
          {title}
        </option>
      ))}
    </select>
  );
}

export function EligibilityForITCdropDownEditor({ row, onRowChange }) {
  return (
    <select
      value={row.eligibilityForITC}
      onChange={(event) =>
        onRowChange({ ...row, eligibilityForITC: event.target.value }, true)
      }
      autoFocus
    >
      {EligibilityForITC.map((title) => (
        <option key={title} value={title}>
          {title}
        </option>
      ))}
    </select>
  );
}

var validClass = "";

const validColumns = [
  {
    data: "srNo",
    title: "Sr No.",
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
    data: "taxableValue",
    title: "Gross advance received",
  },
  {
    data: "cess",
    title: "Cess Amount",
  },
];

const invalidColumns = [
  { data: "isActive", type: "checkbox", readOnly: false, width: 15 },

  {
    data: "srNo",
    title: "Sr No.",
  },
  {
    data: "ErrorList",
    title: "Error",
    readOnly: true,
    width: 250,
  },
  {
    data: "PlaceOfSupply",
    title: "Place of Supply(POS)",
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
    data: "GrossAdvanceReceived",
    title: "Gross advance received (₹)",
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
    title: "Cess Amount (₹)",
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
const emptyHeaders = [...newValid.slice(1)];

const AtValidate = ({
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
  const [searchDate, setSearchDate] = useState("");

  const storeSales = useSelector(
    (state) => state.gstr1ExcelData?.GSTR1_EXCEL_VALIDATE
  );

  const hotRef = useRef(null);
  const hotRef2 = useRef(null);

  let atDup = [];
  let allDataDuplicate = [];

  const colHeaders = (col) => {
    let txt;
    switch (col) {
      case 0:
        txt = "<input type='checkbox' class='checker'  ";
        txt += isActive ? 'checked="checked"' : "";
        txt += ">";
        return txt;
    }
  };

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

  const theader = (col, TH) => {
    if (col === 0 || col === 1 || col === 2 || col === 11) {
      const button = TH.children[0].children[0];
      button?.parentNode?.removeChild(button);
    }

    if (col == 4 || col == 5 || col == 6 || col == 7) {
      TH.className = "htRight";
    } else {
      TH.className = "htLeft";
    }
  };

  if (store?.duplicateData?.length) {
    for (let item of store?.duplicateData) {
      if (item.sheetName?.toLowerCase() == "at") {
        // console.log("item3=", item);
        atDup.push(item.data);
      } else {
        allDataDuplicate.push(item);
      }
    }
  }
  const atDuplicateData = atDup.length ? atDup[0] : [];

  let atFail = [];
  let allDataFailed = [];
  if (store?.failedData?.length) {
    for (let item of store?.failedData) {
      if (item.sheetName?.toLowerCase() == "at") {
        // console.log("item3=", item);
        atFail.push(item.data);
      } else {
        allDataFailed.push(item);
      }
    }
  }
  const atFailedData = atFail.length ? atFail[0] : [];

  const handlePageClick = (event) => {
    setPage(event?.selected);
  };

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

        if (colIndex == 4 || colIndex == 5 || colIndex == 6 || colIndex == 7) {
          const oldVal = change[i][2];
          
          // Check if the edited value is numeric
          if (isNaN(value)) {
            cellObj.validationMsg = "Only Numeric Value Allowed";
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

    var newPayloadFail = atFailedData;

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

  const sheetData = (i = "at") => {
    const failedIndex = data?.failedData?.findIndex(
      (item) => item?.sheetName?.toLowerCase() == i
    );
    return data?.failedData?.[failedIndex];
  };

  const sheetName = sheetData()?.sheetName;
  const GUID = sheetData()?.guid;
  const sheetId = sheetData()?.sheetId;

  // ** Search
  const loadImpg = () => {
    const payloadSheet = {
      sheetName: sheetName,
      guid: GUID,

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
            const arrError1 = store?.GSTR1_EXCEL_VALIDATE[0].AT.map((item) => {
              return {
                ...item,
              };
            });

            // store?.GSTR1_EXCEL_VALIDATE[0]?.AT;
            const arrError2 = atFailedData;
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
              store?.GSTR1_EXCEL_VALIDATE[0]?.AT?.length,
              sheetName,
              sheetId,
              status
            );
            setvalidaDatarows(store?.GSTR1_EXCEL_VALIDATE[0]?.AT);
          } else {
            setvalidaDatarows([]);
            tabRecord(0, sheetName, sheetId, status);
          }
        } else {
          payloadSheet.status = 2;
          if (store?.GSTR1_EXCEL_VALIDATE?.length > 0) {
            const arrDuplicate1 = store?.GSTR1_EXCEL_VALIDATE[0]?.AT.map(
              (item) => {
                return {
                  ...item,
                };
              }
            );
            const arrDuplicate2 = atDuplicateData;

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
    if (activeTab == 6) {
      loadImpg();
    }
    // debugger
    isActive = false;
    dispatch(getDuplicate([]));
  }, [btnType, activeTab]);

  useEffect(() => {
    return () => setBlock1(false);
  }, []);

  useEffect(() => {
    loadImpg();
    if (store == undefined) {
      setBlock1(true);
    } else {
      setBlock1(false);
    }
  }, [storeSales]);

  useEffect(() => {
    setSearchVal1([]);
    setCurrentCol([]);
    loadImpg();
  }, [clearFilter]);

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
        ? store?.GSTR1_EXCEL_VALIDATE[0].AT
        : [];

    updatedData = gridDataFilter

      .filter((PlaceOfSupplyItem) =>
        finalObj.PlaceOfSupply?.length
          ? PlaceOfSupplyItem.PlaceOfSupply?.toLowerCase().includes(
              finalObj.PlaceOfSupply?.toLowerCase()
            )
          : PlaceOfSupplyItem
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
      .filter((GrossAdvanceReceivedItem) =>
        finalObj.GrossAdvanceReceived?.length
          ? GrossAdvanceReceivedItem.GrossAdvanceReceived?.toLowerCase().includes(
              finalObj.GrossAdvanceReceived?.toLowerCase()
            )
          : GrossAdvanceReceivedItem
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
        writable: true,
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
                style={{ overflowY: "scroll" }}
                height="auto"
                autoColumnSize={true}
                stretchH="all"
                ref={hotRef}
                data={gridData ? gridData : []}
                preventOverflow="horizontal"
                rowHeaders={false}
                columns={invalidColumns}
                colHeaders={(x) => colHeaders(x)}
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

                    if (col == 4 || col == 5 || col == 6 || col == 7) {
                      if (!reg.test(e.key)) {
                        e.preventDefault();
                      }
                    }
                  }
                }}
                beforeSetRangeStart={
                  btnType == "btnDuplicateData" && localBeforeSetRangeStart
                }
                filters={true}
                hiddenColumns={{
                  columns:
                    btnType == "btnValidData"
                      ? [0, 1, 2]
                      : btnType == "btnInvalidData"
                      ? [0, 1]
                      : [1, 2],
                }}
                nestedRows={true}
                contextMenu={false}
                bindRowsWithHeaders={true}
                afterOnCellMouseDown={localAfterOnCellMouseDown}
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

                        console.log("custom value", src.value);

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
                cells={function (row, col, prop) {
                  const hot = hotRef?.current?.hotInstance;
                  const cellPrp = {};

                  if (col == 2) {
                    if (gridData[row]?.ErrorList?.length > 36) {
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
                afterGetColHeader={theader}
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
              />
            ) : (
              <HotTable
                rowHeights={RowSize}
                columnHeaderHeight={columnHeaderSize}
                ref={hotRef2}
                autoColumnSize={true}
                afterGetColHeader={theader}
                stretchH="all"
                style={{ textAlign: "center" }}
                data={[{ PlaceOfSupply: "No Data Found!" }]}
                mergeCells={[{ row: 0, col: 3, rowspan: 1, colspan: 5 }]}
                columns={invalidColumns}
                hiddenColumns={{
                  columns: [0, 1, 2],
                }}
                colHeaders={emptyHeaders}
                comments={false}
                filters={true}
                afterChange={() => {
                  console.log("hi");
                }}
                nestedRows={true}
                contextMenu={false}
                bindRowsWithHeaders={true}
                licenseKey="non-commercial-and-evaluation"
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
                        console.log("date picker clicked");
                        var src = clickEvent.target;
                        console.log("name", src.tagName);
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
                height="auto"
                readOnly={true}
                afterOnCellMouseDown={localAfterOnCellMouseDownEmpty}
                beforeCreateRow={function (index, amount) {
                  let countRow = this?.countRows();
                  if (this?.isEmptyRow(countRow - 0)) {
                    return false;
                  }
                  return true;
                }}
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
          forcePage={page}
          pageCount={pageCountClientSide}
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

export default AtValidate;
