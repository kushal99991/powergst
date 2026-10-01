import React, {
  Fragment,
  useState,
  useEffect,
  useRef,
} from "react";
import { HotTable, HotColumn } from "@handsontable/react";
import { Row, Col } from "reactstrap";
import errorCodeConfig from "../../../../configs/apiErrorCodeConfig";
import { getFailed, getDuplicate } from "./store";
import { useDispatch, useSelector } from "react-redux";
// ** Styles
import Swal from "sweetalert2";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import ReactPaginate from "react-paginate";
import "handsontable/dist/handsontable.full.min.css";
import { registerAllModules } from "handsontable/registry";
import gstr6PurchaseInvoice from "../../../../services/gstr6/gstr6PurchaseInvoice";
import {
  PageSize,
  RowSize,
  columnHeaderSize,
} from "../../../../configs/config";
import Handsontable from "handsontable";
import LocalFunction from "@configs/getLocalFunction";
import { globleVariable } from "@configs/globalVariable";
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

const serverDateTime =
  localStorage.getItem(globleVariable.serverDateTime) &&
  LocalFunction.getLocalValue(globleVariable.serverDateTime, true);
const maxDate = JSON.parse(serverDateTime).toString().split("T")[0];
const maxShowDate = new Date(maxDate);

//** button - Action column
function myLables(instance, td, row, col, prop, value, cellProperties) {
  Handsontable.renderers.TextRenderer.apply(this, arguments);
  td.innerHTML = `<div class="truncated">${
    value !== null && value !== "" ? value : ""
  }</div>`;
}

const validColumns = [
  {
    data: "SrNo",
    title: "Sr No.",
    // width: 50,
  },
  {
    data: "PlaceOfSupply",
    title: "Place of Supply(POS)",
    // width: 200,
  },

  {
    data: "Rate",
    title: "Rate",
    // width: 100,
  },
  {
    data: "TaxableValue",
    title: "Gross advance received",
    // width: 200,
  },
  {
    data: "CessPaid",
    title: "Cess Amount",
    // width: 200,
  },
];

const invalidColumns = [
  // 0
  { data: "isActive", type: "checkbox", readOnly: false, width: 25 },

  // 1
  {
    data: "SrNo",
    title: "Sr No.",
    // width: 50,
    frozen: true,
    cellClass: "SrNoGCol",
  },

  // 2
  {
    data: "ErrorMessage",
    title: "Error",
    readOnly: true,
    width: 300,
  },

  // 3
  {
    data: "OriginalUnitType",
    title: "Original Unit Type",
    columnSorting: {
      indicator: false,
      headerAction: false,
    },
  },

  // 4
  {
    data: "OriginalRecipientGSTIN",
    title: "Original Recipient GSTIN",
    columnSorting: {
      indicator: false,
      headerAction: false,
    },
  },

  // 5
  {
    data: "OriginalInvoiceNumber",
    title: "Original Document Number",
    columnSorting: {
      indicator: false,
      headerAction: false,
    },
  },

  // 6
  {
    data: "OriginalInvoiceDateLabel",
    title: "Original Document Date",
    type: "date",
    dateFormat: "DD-MM-YYYY",
    correctFormat: true,
    className: "htAutocomplete",
    allowInvalid: false,
    datePickerConfig: {
      firstDay: 0,
      showWeekNumber: false,
      numberOfMonths: 1,
      licenseKey: "non-commercial-and-evaluation",
      minDate: new Date("2017-07-01"),
      defaultDate: maxShowDate,
      maxDate: maxShowDate,
      bound: true,
      class: "htAutocompleteArrow",
    },
  },

  // 7
  {
    data: "EligibilityOfITC",
    title: "Eligibility of ITC",
    columnSorting: {
      indicator: false,
      headerAction: false,
    },
  },

  // 8
  {
    data: "UnitType",
    title: "Revised Unit Type",
    columnSorting: {
      indicator: false,
      headerAction: false,
    },
    // width:"150"
  },

  // 9
  {
    data: "RecipientGSTIN",
    title: "Recipient  GSTIN ",
    columnSorting: {
      indicator: false,
      headerAction: false,
    },
  },

  // 10
  {
    data: "NoteType",
    title: "ISD Document Type",
    columnSorting: {
      indicator: false,
      headerAction: false,
    },
  },

  // 11
  {
    data: "RevisedInvoiceNumber",
    title: "ISD Invoice Number",
    columnSorting: {
      indicator: false,
      headerAction: false,
    },
  },

  // 12
  {
    data: "RevisedInvoiceDateLabel",
    title: "ISD Invoice Date",
    type: "date",
    dateFormat: "DD-MM-YYYY",
    correctFormat: true,
    className: "htAutocomplete",
    allowInvalid: false,
    datePickerConfig: {
      firstDay: 0,
      showWeekNumber: false,
      numberOfMonths: 1,
      licenseKey: "non-commercial-and-evaluation",
      minDate: new Date("2017-07-01"),
      defaultDate: maxShowDate,
      maxDate: maxShowDate,
      bound: true,
      class: "htAutocompleteArrow",
    },
  },

  // 13
  {
    data: "RevisedNoteNumber",
    title: "ISD Credit Note Number",
    columnSorting: {
      indicator: false,
      headerAction: false,
    },
  },

  // 14
  {
    data: "RevisedNoteDateLabel",
    title: "ISD Credit Note Date",
    type: "date",
    dateFormat: "DD-MM-YYYY",
    correctFormat: true,
    className: "htAutocomplete",
    allowInvalid: false,
    datePickerConfig: {
      firstDay: 0,
      showWeekNumber: false,
      numberOfMonths: 1,
      licenseKey: "non-commercial-and-evaluation",
      minDate: new Date("2017-07-01"),
      defaultDate: maxShowDate,
      maxDate: maxShowDate,
      bound: true,
      class: "htAutocompleteArrow",
    },
  },

  // 15
  {
    data: "OriginalInvoiceofCreditNote",
    title: "Original Invoice Number",
    columnSorting: {
      indicator: false,
      headerAction: false,
    },
  },

  // 16
  {
    data: "OriginalInvoiceDateLabel",
    title: "Original Invoice Date",
    type: "date",
    dateFormat: "DD-MM-YYYY",
    correctFormat: true,
    className: "htAutocomplete",
    allowInvalid: false,
    datePickerConfig: {
      firstDay: 0,
      showWeekNumber: false,
      numberOfMonths: 1,
      licenseKey: "non-commercial-and-evaluation",
      minDate: new Date("2017-07-01"),
      defaultDate: maxShowDate,
      maxDate: maxShowDate,
      bound: true,
      class: "htAutocompleteArrow",
    },
  },

  // 17
  {
    data: "SEZSupplier",
    title: "Is Unit Located in SEZ",
    columnSorting: {
      indicator: false,
      headerAction: false,
    },
  },

  // {
  //   data: "TaxableValue",
  //   title: "Taxable Value",
  //   columnSorting: {
  //     indicator: false,
  //     headerAction: false,
  //   },
  // },

  // 18
  {
    data: "IGST",
    title: "Integrated Tax (₹)",
    columnSorting: {
      indicator: false,
      headerAction: false,
    },
  },

  // 19
  {
    data: "CGST",
    title: "Central Tax (₹)",
    columnSorting: {
      indicator: false,
      headerAction: false,
    },
  },

  // 20
  {
    data: "SGST",
    title: "State/UT Tax (₹)",
    columnSorting: {
      indicator: false,
      headerAction: false,
    },
  },

  // 21
  {
    data: "CESS",
    title: "CESS (₹)",
    columnSorting: {
      indicator: false,
      headerAction: false,
    },
  },

  // 22
  {
    data: "IntegratedTaxReversal",
    title: "Integrated Tax Reversal (₹)",
    columnSorting: {
      indicator: false,
      headerAction: false,
    },
    type: "numeric",
    numericFormat: {
      pattern: "0,0.00",
      culture: "en-IN",
    },
  },

  // 23
  {
    data: "CentralTaxReversal",
    title: "Central Tax Reversal (₹)",
    columnSorting: {
      indicator: false,
      headerAction: false,
    },
    type: "numeric",
    numericFormat: {
      pattern: "0,0.00",
      culture: "en-IN",
    },
  },

  // 24
  {
    data: "StateUTTaxReversal",
    title: "State/UT Tax Reversal(₹)",
    columnSorting: {
      indicator: false,
      headerAction: false,
    },
    type: "numeric",
    numericFormat: {
      pattern: "0,0.00",
      culture: "en-IN",
    },
  },

  // 25
  {
    data: "CessReversal",
    title: "CESS Reversal(₹)",
    columnSorting: {
      indicator: false,
      headerAction: false,
    },
    type: "numeric",
    numericFormat: {
      pattern: "0,0.00",
      culture: "en-IN",
    },
  },

  // 26
  {
    data: "Action",
    title: "Action",
    columnSorting: {
      indicator: false,
      headerAction: false,
    },
  },
];

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

let newValid = [];

validColumns.map((item) => {
  newValid.push(item.title);
});
const emptyHeaders = [...newValid.slice(1)];

const aitcValidate = React.memo(
  ({
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
    const dispatch = useDispatch();
    const [pageSize, setPageSize] = useState(PageSize);
    const store = useSelector((state) => state.gstr6ExcelData);
    const [currentCol, setCurrentCol] = useState([]);
    const [currentCol1, setCurrentCol1] = useState();
    const [searchVal1, setSearchVal1] = useState([]);

    const hotRef = useRef(null);
    const hotRef2 = useRef(null);
    const [searchDate, setSearchDate] = useState("");
    const [searchDate1, setSearchDate1] = useState("");
    const [searchDate2, setSearchDate2] = useState("");
    const [searchDate3, setSearchDate3] = useState("");

    const storeGSTR6 = useSelector(
      (state) => state.excelData?.GSTR6_EXCEL_VALIDATE
    );

    let amendofdistofitcDup = [];
    let allDataDuplicate = [];
    let arrFilter = [];
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
      setCurrentCol1(coords?.col);
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
          );
          if (searchInput !== null) {
            searchInput.children[0].value = "";
          }
        }, 100);
      }
      if (coords.col != 25 && coords.col != 26 && btnType != "btnInvalidData") {
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
      } else {
        return " ";
      }
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
      if (col == 0 || col == 2) {
        const button = TH.children[0].children[0];
        button.parentNode.removeChild(button);
      }
      if (
        col == 13 ||
        col == 17 ||
        col == 18 ||
        col == 19 ||
        col == 20 ||
        col == 21 ||
        col == 22 ||
        col == 23 ||
        col == 24 ||
        col == 25
      ) {
        TH.className = "htRight";
      } else {
        TH.className = "htLeft";
      }
    };

    if (store?.duplicateData?.length) {
      for (let item of store?.duplicateData) {
        if (item.sheetName?.toLowerCase() == "amendofdistofitc") {
          amendofdistofitcDup.push(item.data);
        } else {
          allDataDuplicate.push(item);
        }
      }
    }
    const amendofdistofitcDuplicateData = amendofdistofitcDup.length
      ? amendofdistofitcDup[0]
      : [];

    let amendofdistofitcFail = [];
    let allDataFailed = [];
    if (store?.failedData?.length) {
      for (let item of store?.failedData) {
        if (item.sheetName.toLowerCase() == "amendofdistofitc") {
          amendofdistofitcFail.push(item.data);
        } else {
          allDataFailed.push(item);
        }
      }
    }
    const amendofdistofitcFailedData = amendofdistofitcFail.length
      ? amendofdistofitcFail[0]
      : [];

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
          if (
            colIndex == 4 ||
            colIndex == 13 ||
            colIndex == 18 ||
            colIndex == 19 ||
            colIndex == 20 ||
            colIndex == 21 ||
            colIndex == 22 ||
            colIndex == 23 ||
            colIndex == 24 ||
            colIndex == 25
          ) {
            const oldVal = change[i][2];
           
            // Check if the edited value is numeric
            if (
              isNaN(value) &&
              colIndex !== 13 &&
              colIndex !== 4 &&
              value !== ""
            ) {
              cellObj.validationMsg = "Only Numeric Value Allowed";
              setErrorArr((pre) => [...pre, cellObj]);
            } else if (
              !/^[a-zA-Z0-9\/\-]+$/.test(value) &&
              value !== "" &&
              (colIndex == 13 || colIndex == 4)
            ) {
              cellObj.validationMsg = "Only AlphaNumeric value allowed";
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
        // debugger
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

      var newPayloadFail = amendofdistofitcFailedData;

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
                totalRecords: JSON.parse(
                  JSON.stringify(newK)
                ).length?.toString(),
              },
              ...allDataDuplicate,
            ];
            // dispatch(getFailed(payload.sheetId, payload.sheetName, payload.guid, payload.data));
            dispatch(getDuplicate(payload));
          }
        }
      }
    };
    const sheetData = (i = "amendofdistofitc") => {
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
        pageNumber: page + 1,
        pageSize: pageSize,
        sheetId: sheetId,
        orderByColumnName: "",
        orderBy: "",
        searchColumnName: currentCol,
        searchValue: searchVal1,
      };
      if (data !== null) {
        if (store?.GSTR6_EXCEL_VALIDATE?.length > 0) {
          if (btnType == "btnInvalidData") {
            payloadSheet.status = 0;
            if (store?.GSTR6_EXCEL_VALIDATE?.length > 0) {
              const arrError1 =
                store?.GSTR6_EXCEL_VALIDATE[0].AmendofDistofITC.map((item) => {
                  return {
                    ...item,
                  };
                });
              const arrError2 = amendofdistofitcFailedData;
              const arrError = arrError1.map(
                (obj) =>
                  arrError2.find(
                    (o) =>
                      o.RowGUIDReact === obj.RowGUIDReact &&
                      o.Gstr6DetailId === obj.Gstr6DetailId
                  ) || obj
              );
              setvalidaDatarows(JSON.parse(JSON.stringify(arrError)));
              tabRecord(arrError1?.length, sheetName, sheetId, status);
            } else {
              tabRecord(0, sheetName, sheetId, status);
              setvalidaDatarows([]);
            }
          } else if (btnType == "btnValidData") {
            payloadSheet.status = 1;

            if (store?.GSTR6_EXCEL_VALIDATE?.length > 0) {
              tabRecord(
                store?.GSTR6_EXCEL_VALIDATE[0].AmendofDistofITC?.length,
                sheetName,
                sheetId,
                status
              );
              setvalidaDatarows(
                store?.GSTR6_EXCEL_VALIDATE[0].AmendofDistofITC
              );
            } else {
              tabRecord(0, sheetName, sheetId, status);
              setvalidaDatarows([]);
            }
          } else {
            // console.log("conditonisrunning else")
            payloadSheet.status = 2;
            if (store?.GSTR6_EXCEL_VALIDATE?.length > 0) {
              const arrDuplicate1 =
                store?.GSTR6_EXCEL_VALIDATE[0].AmendofDistofITC.map((item) => {
                  return {
                    ...item,
                  };
                });
              const arrDuplicate2 = amendofdistofitcDuplicateData;
              const arrDuplicate = arrDuplicate1.map(
                (obj) =>
                  arrDuplicate2?.find(
                    (o) => o.RowGUIDReact === obj.RowGUIDReact
                  ) || obj
              );
              tabRecord(arrDuplicate2?.length, sheetName, sheetId, status);
              setvalidaDatarows(arrDuplicate ? arrDuplicate : arrDuplicate1);
            } else {
              setvalidaDatarows([]);
              setBlock1(false);
            }
          }
        }
      }
    };

    let isWorking = false;
    useEffect(() => {
      if (activeTab == 5) {
        loadImpg();
      }
      isActive = false;
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
        loadImpg();
      } else {
        setBlock1(false);
      }
    }, [storeGSTR6]);

    const columnName = invalidColumns;

    // For Filter Data
    function FilterData(arr) {
      let addArr = [];
      let updatedData = [];
      let finalObj = {};

      for (let i = 0; i < arr.length; i++) {
        Object.assign(finalObj, arr[i]);
      }

      let gridDataFilter = store?.GSTR6_EXCEL_VALIDATE[0].AmendofDistofITC;
      updatedData = gridDataFilter
        .filter((item) =>
          finalObj.OriginalUnitType?.length
            ? item.OriginalUnitType?.toLowerCase().includes(
                finalObj.OriginalUnitType.toLowerCase()
              )
            : item
        )
        .filter((item) =>
          finalObj.OriginalRecipientGSTIN?.length
            ? item.OriginalRecipientGSTIN?.toLowerCase().includes(
                finalObj.OriginalRecipientGSTIN?.toLowerCase()
              )
            : item
        )
        .filter((item) =>
          finalObj.OriginalInvoiceNumber?.length
            ? item.OriginalInvoiceNumber?.toLowerCase().includes(
                finalObj.OriginalInvoiceNumber?.toLowerCase()
              )
            : item
        )
        .filter((item) =>
          finalObj.OriginalInvoiceDateLabel?.length
            ? item.OriginalInvoiceDateLabel?.toLowerCase().includes(
                // finalObj.InvoiceDate?.toLowerCase()
                moment(finalObj?.OriginalInvoiceDateLabel).format("DD-MM-YYYY")
              )
            : item
        )
        .filter((item) =>
          finalObj.EligibilityOfITC?.length
            ? item.EligibilityOfITC?.toLowerCase().includes(
                finalObj.EligibilityOfITC?.toLowerCase()
              )
            : item
        )
        .filter((item) =>
          finalObj.RecipientGSTIN?.length
            ? item.RecipientGSTIN?.toLowerCase().includes(
                finalObj.RecipientGSTIN?.toLowerCase()
              )
            : item
        )
        .filter((item) =>
          finalObj.UnitType?.length
            ? item.UnitType?.toLowerCase().includes(
                finalObj.UnitType?.toLowerCase()
              )
            : item
        )
        .filter((item) =>
          finalObj.NoteType?.length
            ? item.NoteType?.toLowerCase().includes(
                finalObj.NoteType?.toLowerCase()
              )
            : item
        )
        .filter((item) =>
          finalObj.RevisedInvoiceNumber?.length
            ? item.RevisedInvoiceNumber?.toLowerCase().includes(
                finalObj.RevisedInvoiceNumber?.toLowerCase()
              )
            : item
        )
        .filter((item) =>
          finalObj.RevisedInvoiceDateLabel?.length
            ? item.RevisedInvoiceDateLabel?.toLowerCase().includes(
                // finalObj.InvoiceDate?.toLowerCase()
                moment(finalObj?.RevisedInvoiceDateLabel).format("DD-MM-YYYY")
              )
            : item
        )
        .filter((RateItem) =>
          finalObj.RevisedNoteNumber?.length
            ? RateItem.RevisedNoteNumber?.toLowerCase().includes(
                finalObj.RevisedNoteNumber?.toLowerCase()
              )
            : RateItem
        )
        .filter((item) =>
          finalObj.RevisedNoteDateLabel?.length
            ? item.RevisedNoteDateLabel?.toLowerCase().includes(
                // finalObj.InvoiceDate?.toLowerCase()
                moment(finalObj?.RevisedNoteDateLabel).format("DD-MM-YYYY")
              )
            : item
        )
        .filter((item) =>
          finalObj.OriginalInvoiceofCreditNote?.length
            ? item.OriginalInvoiceofCreditNote?.toLowerCase().includes(
                finalObj.OriginalInvoiceofCreditNote?.toLowerCase()
              )
            : item
        )
        .filter((item) =>
          finalObj.OriginalInvoiceDateLabel?.length
            ? item.OriginalInvoiceDateLabel?.toLowerCase().includes(
                // finalObj.InvoiceDate?.toLowerCase()
                moment(finalObj?.OriginalInvoiceDateLabel).format("DD-MM-YYYY")
              )
            : item
        )
        .filter((item) =>
          finalObj.SEZSupplier?.length
            ? item.SEZSupplier?.toLowerCase().includes(
                finalObj.SEZSupplier?.toLowerCase()
              )
            : item
        )
        .filter((TaxableValueItem) =>
          finalObj.TaxableValue?.length
            ? TaxableValueItem.TaxableValue?.toLowerCase().includes(
                finalObj.TaxableValue?.toLowerCase()
              )
            : TaxableValueItem
        )
        .filter((IgstItem) =>
          finalObj.IGST?.length
            ? IgstItem.IGST?.toLowerCase().includes(
                finalObj.IGST?.toLowerCase()
              )
            : IgstItem
        )
        .filter((CgstItem) =>
          finalObj.CGST?.length
            ? CgstItem.CGST?.toLowerCase().includes(
                finalObj.CGST?.toLowerCase()
              )
            : CgstItem
        )
        .filter((Sgstitem) =>
          finalObj.SGST?.length
            ? Sgstitem.SGST?.toLowerCase().includes(
                finalObj.SGST?.toLowerCase()
              )
            : Sgstitem
        )
        .filter((item) =>
          finalObj.CESS?.length
            ? item.CESS?.toLowerCase().includes(finalObj.CESS?.toLowerCase())
            : item
        )
        .filter((item) =>
          finalObj.IntegratedTaxReversal?.length
            ? item.IntegratedTaxReversal?.toLowerCase().includes(
                finalObj.IntegratedTaxReversal?.toLowerCase()
              )
            : item
        )
        .filter((item) =>
          finalObj.CentralTaxReversal?.length
            ? item.CentralTaxReversal?.toLowerCase().includes(
                finalObj.CentralTaxReversal?.toLowerCase()
              )
            : item
        )
        .filter((item) =>
          finalObj.StateUTTaxReversal?.length
            ? item.StateUTTaxReversal?.toLowerCase().includes(
                finalObj.StateUTTaxReversal?.toLowerCase()
              )
            : item
        )
        .filter((item) =>
          finalObj.CessReversal?.length
            ? item.CessReversal?.toLowerCase().includes(
                finalObj.CessReversal?.toLowerCase()
              )
            : item
        )
        .filter((item) =>
          finalObj.Action?.length
            ? item.Action?.toLowerCase().includes(
                finalObj.Action?.toLowerCase()
              )
            : item
        );
      const dataFilter = updatedData.map((item) => {
        return {
          ...item,
          writable: true,
        };
      });
      addArr.push(...dataFilter);
      // addArr.push(...updatedData);
      setPage(0);
      let uniq = [...new Set(addArr)];
      return uniq;
    }

    // ** Pagination
    const pageCountClientSide = Math.ceil(
      invalidaDatarows?.length && invalidaDatarows?.length / PageSize
    );
    const para1 = page * PageSize;
    const para2 = page * PageSize + PageSize;
    var gridData =
      invalidaDatarows?.length > 0 && invalidaDatarows?.slice(para1, para2);

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
                  style={{ overflowY: "scroll" }}
                  rowHeights={RowSize}
                  columnHeaderHeight={columnHeaderSize}
                  height="auto"
                  autoColumnSize={{
                    samplingRatio: 23,
                  }}
                  manualColumnResize={true}
                  stretchH="all"
                  // width='auto'
                  ref={hotRef}
                  data={gridData ? gridData : []}
                  preventOverflow="horizontal"
                  rowHeaders={false}
                  columns={invalidColumns}
                  colHeaders={(x) => colHeaders(x)}
                  comments={true}
                  // afterChange={(x, y) => cellChange(x, y)}
                  afterChange={(x, y) => {
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
                  cells={function (row, col, prop) {
                    const cp = {};

                    if (
                      col == 17 ||
                      col == 18 ||
                      col == 19 ||
                      col == 20 ||
                      col == 21 ||
                      col == 22
                    ) {
                      cp.className = "text-end";
                    }

                    if (col == 2) {
                      if (gridData[row]?.ErrorMessage?.length > 36) {
                        cp.comment = {
                          value: gridData[row]?.ErrorMessage,
                          style: { width: 200, height: 70 },
                          readOnly: true,
                        };
                      }
                      cp.renderer = myLables;
                    }

                    return cp;
                  }}
                  afterRenderer={(TD, row, col, prop, value) => {
                    if (
                      btnType == "btnInvalidData" &&
                      (!col == 0) &&
                      errorArr.findIndex(
                        (y) =>
                          y.row == row && y.col == col && y.tab == activeTab && y.page == page
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
                      let col = this?.getSelectedLast()[1];

                      if (
                        // col == 4 ||
                        col == 6
                        // ||
                        // col == 7
                      ) {
                        if (!reg.test(e.key)) {
                          e.preventDefault();
                        }
                      }
                      if (
                        (col == 5 || col == 4 || col == 13) &&
                        !/^[a-zA-Z0-9\/\-]+$/.test(e.key)
                      ) {
                        e.preventDefault();
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
                        hidden() {
                          const hot = hotRef?.current?.hotInstance;

                          return (
                            this.getSelected()[0][1] == 6 ||
                            this.getSelected()[0][1] == 12 ||
                            this.getSelected()[0][1] == 14 ||
                            this.getSelected()[0][1] == 16
                          );
                        },
                      },

                      option2: {
                        name: `Select Date <br><input type='date' min='2017-07-01' max=${new Date()
                          .toISOString()
                          .slice(
                            0,
                            10
                          )} class='custom-date col-md-11' placeholder='DD-MM-YYYY' id='custom1' name='date' value=${searchDate}>`,
                        hidden() {
                          return this.getSelectedRangeLast().to.col != 6;
                        },

                        //disabled: true,
                        callback: function (key, selection, clickEvent) {
                          var src = clickEvent.target;

                          if (src.tagName === "INPUT") {
                            clickEvent.stopImmediatePropagation();
                          }

                          clickEvent.stopImmediatePropagation();
                        },
                      },
                      option3: {
                        name: `Select Date <br><input type='date' min='2017-07-01' max=${new Date()
                          .toISOString()
                          .slice(
                            0,
                            10
                          )} class='custom-date col-md-11' placeholder='DD-MM-YYYY' id='custom2' name='date' value=${searchDate1}>`,
                        hidden() {
                          return this.getSelectedRangeLast().to.col != 12;
                        },

                        //disabled: true,
                        callback: function (key, selection, clickEvent) {
                          var src = clickEvent.target;

                          if (src.tagName === "INPUT") {
                            clickEvent.stopImmediatePropagation();
                          }

                          clickEvent.stopImmediatePropagation();
                        },
                      },
                      option4: {
                        name: `Select Date <br><input type='date' min='2017-07-01' max=${new Date()
                          .toISOString()
                          .slice(
                            0,
                            10
                          )} class='custom-date col-md-11' placeholder='DD-MM-YYYY' id='custom3' name='date' value=${searchDate2}>`,
                        hidden() {
                          return this.getSelectedRangeLast().to.col != 14;
                        },

                        //disabled: true,
                        callback: function (key, selection, clickEvent) {
                          var src = clickEvent.target;

                          if (src.tagName === "INPUT") {
                            clickEvent.stopImmediatePropagation();
                          }

                          clickEvent.stopImmediatePropagation();
                        },
                      },
                      option5: {
                        name: `Select Date <br><input type='date' min='2017-07-01' max=${new Date()
                          .toISOString()
                          .slice(
                            0,
                            10
                          )} class='custom-date col-md-11' placeholder='DD-MM-YYYY' id='custom4' name='date' value=${searchDate3}>`,
                        hidden() {
                          return this.getSelectedRangeLast().to.col != 16;
                        },

                        //disabled: true,
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
                        //disabled: true,
                        callback: function (key, selection, clickEvent) {
                          var src = clickEvent.target;

                          if (src.tagName.toLowerCase() === "button") {
                            if (clickEvent.target.id == "btnClear") {
                              const hot = hotRef?.current?.hotInstance;
                              var value = "";

                              if (hot.getSelected()[0][1] == 6) {
                                setSearchDate(value);
                              } else if (hot.getSelected()[0][1] == 12) {
                                setSearchDate1(value);
                              } else if (hot.getSelected()[0][1] == 14) {
                                setSearchDate2(value);
                              } else if (hot.getSelected()[0][1] == 16) {
                                setSearchDate3(value);
                              }
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
                                  (item) =>
                                    columnName[currentCol1]?.data == item
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
                    if (
                      hot.getSelected()?.[0]?.[1] != 6 &&
                      hot.getSelected()?.[0]?.[1] != 12 &&
                      hot.getSelected()?.[0]?.[1] != 14 &&
                      hot.getSelected()?.[0]?.[1] != 16
                    ) {
                      var searchInput = document.querySelector(
                        ".htUIMultipleSelectSearch.htUIInput"
                      );
                      var value = searchInput?.children[0]?.value;
                    } else {
                      if (hot.getSelected()[0][1] == 6) {
                        var searchInput1 = document.getElementById("custom1");
                        var value = searchInput1.value;
                        setSearchDate(value);
                      } else if (hot.getSelected()[0][1] == 12) {
                        var searchInput2 = document.getElementById("custom2");
                        var value = searchInput2?.value;
                        setSearchDate1(value);
                      } else if (hot.getSelected()[0][1] == 14) {
                        var searchInput3 = document.getElementById("custom3");
                        var value = searchInput3?.value;
                        setSearchDate2(value);
                      } else {
                        var searchInput4 = document.getElementById("custom4");
                        var value = searchInput4?.value;
                        setSearchDate3(value);
                      }
                    }

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
                  }}
                  beforeCreateRow={function (index, amount) {
                    let countRow = this?.countRows();
                    if (this?.isEmptyRow(countRow - 0)) {
                      return false;
                    }
                    return true;
                  }}
                  afterGetColHeader={theader}
                  mergeCells={false}
                  readOnly={btnType == "btnInvalidData" ? false : true}
                  licenseKey="non-commercial-and-evaluation"
                />
              ) : (
                <HotTable
                  rowHeights={RowSize}
                  ref={hotRef2}
                  columnHeaderHeight={columnHeaderSize}
                  afterGetColHeader={theader}
                  stretchH="all"
                  autoColumnSize={{
                    samplingRatio: 23,
                  }}
                  manualColumnResize={true}
                  data={[{ OriginalRecipientGSTIN: "No Data Found!" }]}
                  mergeCells={[{ row: 0, col: 4, rowspan: 1, colspan: 10 }]}
                  cells={function (row, col) {
                    var cp = {};
                    if (col == 4) {
                      cp.className = "text-center";
                    }
                    return cp;
                  }}
                  columns={invalidColumns}
                  beforeCreateRow={function (index, amount) {
                    let countRow = this?.countRows();
                    if (this?.isEmptyRow(countRow - 0)) {
                      return false;
                    }
                    return true;
                  }}
                  hiddenColumns={{
                    columns:
                      btnType == "btnValidData"
                        ? [0, 1, 2]
                        : btnType == "btnInvalidData"
                        ? [0, 1]
                        : [1, 2],
                  }}
                  // hiddenColumns={{
                  //   columns: [0, 1],
                  // }}
                  colHeaders={emptyHeaders}
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
                        hidden() {
                          const hot = hotRef2?.current?.hotInstance;
                          // console.log("noon col", hot.getSelected()?.[0]?.[1], hot);
                          return (
                            this.getSelected()[0][1] == 6 ||
                            this.getSelected()[0][1] == 12 ||
                            this.getSelected()[0][1] == 14 ||
                            this.getSelected()[0][1] == 16
                          );
                        },
                      },

                      option2: {
                        name: `Select Date <br><input type='date' min='2017-07-01' max=${new Date()
                          .toISOString()
                          .slice(
                            0,
                            10
                          )} class='custom-date col-md-11' placeholder='DD-MM-YYYY' id='custom1' name='date' value=${searchDate}>`,
                        hidden() {
                          return this.getSelectedRangeLast().to.col != 6;
                        },

                        //disabled: true,
                        callback: function (key, selection, clickEvent) {
                          var src = clickEvent.target;

                          if (src.tagName === "INPUT") {
                            clickEvent.stopImmediatePropagation();
                          }

                          clickEvent.stopImmediatePropagation();
                        },
                      },
                      option3: {
                        name: `Select Date <br><input type='date' min='2017-07-01' max=${new Date()
                          .toISOString()
                          .slice(
                            0,
                            10
                          )} class='custom-date col-md-11' placeholder='DD-MM-YYYY' id='custom2' name='date' value=${searchDate1}>`,
                        hidden() {
                          return this.getSelectedRangeLast().to.col != 12;
                        },

                        //disabled: true,
                        callback: function (key, selection, clickEvent) {
                          var src = clickEvent.target;

                          if (src.tagName === "INPUT") {
                            clickEvent.stopImmediatePropagation();
                          }

                          clickEvent.stopImmediatePropagation();
                        },
                      },
                      option4: {
                        name: `Select Date <br><input type='date' min='2017-07-01' max=${new Date()
                          .toISOString()
                          .slice(
                            0,
                            10
                          )} class='custom-date col-md-11' placeholder='DD-MM-YYYY' id='custom3' name='date' value=${searchDate2}>`,
                        hidden() {
                          return this.getSelectedRangeLast().to.col != 14;
                        },

                        //disabled: true,
                        callback: function (key, selection, clickEvent) {
                          var src = clickEvent.target;

                          if (src.tagName === "INPUT") {
                            clickEvent.stopImmediatePropagation();
                          }
                          clickEvent.stopImmediatePropagation();
                        },
                      },
                      option5: {
                        name: `Select Date <br><input type='date' min='2017-07-01' max=${new Date()
                          .toISOString()
                          .slice(
                            0,
                            10
                          )} class='custom-date col-md-11' placeholder='DD-MM-YYYY' id='custom4' name='date' value=${searchDate3}>`,
                        hidden() {
                          return this.getSelectedRangeLast().to.col != 16;
                        },

                        //disabled: true,
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
                        //disabled: true,
                        callback: function (key, selection, clickEvent) {
                          var src = clickEvent.target;

                          if (src.tagName.toLowerCase() === "button") {
                            if (clickEvent.target.id == "btnClear") {
                              // console.log("custom menu2", key, selection, clickEvent, src,data);

                              const hot = hotRef2?.current?.hotInstance;
                              var value = "";

                              if (hot.getSelected()[0][1] == 6) {
                                setSearchDate(value);
                              } else if (hot.getSelected()[0][1] == 12) {
                                setSearchDate1(value);
                              } else if (hot.getSelected()[0][1] == 14) {
                                setSearchDate2(value);
                              } else if (hot.getSelected()[0][1] == 16) {
                                setSearchDate3(value);
                              }
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
                                  (item) =>
                                    columnName[currentCol1]?.data == item
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
                    if (
                      hot?.getSelected()?.[0]?.[1] != 6 &&
                      hot?.getSelected()?.[0]?.[1] != 12 &&
                      hot?.getSelected()?.[0]?.[1] != 14 &&
                      hot?.getSelected()?.[0]?.[1] != 16
                    ) {
                      var searchInput = document.querySelector(
                        ".htUIMultipleSelectSearch.htUIInput"
                      );
                      var value = searchInput?.children[0]?.value;
                    } else {
                      {
                        if (hot.getSelected()[0][1] == 6) {
                          var searchInput1 = document.getElementById("custom1");
                          var value = searchInput1.value;
                          setSearchDate(value);
                        } else if (hot.getSelected()[0][1] == 12) {
                          var searchInput2 = document.getElementById("custom2");
                          var value = searchInput2?.value;
                          setSearchDate1(value);
                        } else if (hot.getSelected()[0][1] == 14) {
                          var searchInput3 = document.getElementById("custom3");
                          var value = searchInput3?.value;
                          setSearchDate2(value);
                        } else {
                          var searchInput4 = document.getElementById("custom4");
                          var value = searchInput4?.value;
                          setSearchDate3(value);
                        }
                      }
                    }

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
                  }}
                  height="auto"
                  readOnly={btnType == "btnInvalidData" ? false : true}
                  afterOnCellMouseDown={localAfterOnCellMouseDownEmpty}
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
  }
);

export default aitcValidate;
