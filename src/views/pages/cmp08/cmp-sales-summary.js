import { Fragment, useRef } from "react";
import { Col, Label, Row, Button } from "reactstrap";
import { HotTable } from "@handsontable/react";
import { selectThemeColors } from "@utils";
import Select from "react-select";
import { useState } from "react";
import {
  SELECT_MAXSIZE,
  RowSize,
  enableOnFormTags,
  columnHeaderSize,
  keysMap,
} from "../../../configs/config";
import toast from "react-hot-toast";
import makeAnimated from "react-select/animated";
import { useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import Swal from "sweetalert2";
import errorCodeConfig from "../../../configs/apiErrorCodeConfig";
import { registerAllModules } from "handsontable/registry";

// ** Icons Imports
import { globleVariable } from "../../../configs/globalVariable";
import LocalFunction from "../../../configs/getLocalFunction";
import SessionFunction from "../../../configs/getSessionFunction";

import CMP08Service from "../../../services/cmp08/cmp08Service";
import { Download, Trash2, FilePlus } from "react-feather";
import withReactContent from "sweetalert2-react-content";
import DeleteModelCMP08 from "../../components/models/DeleteModelCMP08";
import { useHotkeys } from "react-hotkeys-hook";
import VerificationModal from "../../../views/pages/verification-otp/index";

const MySwal = withReactContent(Swal);

const finYearOption = LocalFunction.getLocalValue(
  globleVariable.rangeFiltersCMP08,
  true
);

const YearList =
  finYearOption !== undefined &&
  finYearOption !== null &&
  finYearOption !== "" &&
  finYearOption !== "undefined"
    ? JSON.parse(finYearOption)
    : [];

console.log(YearList, "finYearOption");

registerAllModules();

const CmpSalesSummary = () => {
  const [composeOpen, setComposeOpen] = useState(false);
  const toggleCompose1 = () => setComposeOpen(!composeOpen);
  const [msgDisplay, setMsgDisplay] = useState(null);

  const G_UCParId =
  sessionStorage.getItem(globleVariable.G_UCParId) &&
  SessionFunction.getSessionValue(globleVariable.G_UCParId, true)
  const subId =
    localStorage.getItem(globleVariable.subscriptionId) &&
    LocalFunction.getLocalValue(globleVariable.subscriptionId, true);
  const G_GSTIN = SessionFunction.getSessionValue(globleVariable.G_GSTIN, true);
  const UserId = LocalFunction.getLocalValue(globleVariable.userId, true)
    ? LocalFunction.getLocalValue(globleVariable.userId, true)
    : " ";

  // ** Column
  const invoiceDetailsColumns = [
    {
      data: "description",
      readOnly: true,
      title: "Description",
      width: "400",
    },
    {
      data: "value",
      readOnly: true,
      title: "Value (₹)",
      type: "numeric",
      numericFormat: {
        pattern: "0,0.00",
        culture: "en-IN",
      },
    },
    {
      data: "igst",
      readOnly: true,
      title: "IGST (₹)",
      type: "numeric",
      numericFormat: {
        pattern: "0,0.00",
        culture: "en-IN",
      },
    },
    {
      data: "cgst",
      readOnly: true,
      title: "CGST (₹)",
      type: "numeric",
      numericFormat: {
        pattern: "0,0.00",
        culture: "en-IN",
      },
    },
    {
      data: "sgst",
      readOnly: true,
      title: "SGST (₹)",
      type: "numeric",
      numericFormat: {
        pattern: "0,0.00",
        culture: "en-IN",
      },
    },
    {
      data: "cess",
      readOnly: true,
      title: "CESS (₹)",
      type: "numeric",
      numericFormat: {
        pattern: "0,0.00",
        culture: "en-IN",
      },
    },
  ];
  const cashLedgerColumns = [
    {
      data: "igst",
      readOnly: true,
      title: "IGST",
      type: "numeric",
      numericFormat: {
        pattern: "0,0.00",
        culture: "en-IN",
      },
    },
    {
      data: "cgst",
      readOnly: true,
      title: "CGST",
      type: "numeric",
      numericFormat: {
        pattern: "0,0.00",
        culture: "en-IN",
      },
    },
    {
      data: "sgst",
      readOnly: true,
      title: "SGST",
      type: "numeric",
      numericFormat: {
        pattern: "0,0.00",
        culture: "en-IN",
      },
    },
    {
      data: "cess",
      readOnly: true,
      title: "CESS",
      type: "numeric",
      numericFormat: {
        pattern: "0,0.00",
        culture: "en-IN",
      },
    },
    {
      data: "total",
      readOnly: true,
      title: "Total",
      type: "numeric",
      numericFormat: {
        pattern: "0,0.00",
        culture: "en-IN",
      },
    },
  ];
  const paymentOfTaxColumns = [
    {
      data: "description",
      readOnly: true,
      title: "Description",
    },
    {
      data: "taxPayableReverseCharge",
      readOnly: true,
      title: "Reverse Charge",
      type: "numeric",
      width: 100,
      numericFormat: {
        pattern: "0,0.00",
        culture: "en-IN",
      },
    },
    {
      data: "taxPayableOther",
      readOnly: true,
      title: "Other than reverse charge",
      type: "numeric",
      width: 100,
      numericFormat: {
        pattern: "0,0.00",
        culture: "en-IN",
      },
    },
    {
      data: "adjustmentReverseCharge",
      readOnly: true,
      title: "Reverse Charge",
      width: 100,
      type: "numeric",
      numericFormat: {
        pattern: "0,0.00",
        culture: "en-IN",
      },
    },
    {
      data: "adjustmentOther",
      readOnly: true,
      title: "Other than reverse charge",
      type: "numeric",
      width: 100,
      numericFormat: {
        pattern: "0,0.00",
        culture: "en-IN",
      },
    },
    {
      data: "interestPayable",
      readOnly: true,
      title: "Interest payable",
      type: "numeric",
      numericFormat: {
        pattern: "0,0.00",
        culture: "en-IN",
      },
    },
    {
      data: "cess",
      readOnly: true,
      title: "Tax/cess",
      type: "numeric",
      numericFormat: {
        pattern: "0,0.00",
        culture: "en-IN",
      },
    },
    {
      data: "interest",
      readOnly: true,
      title: "Interest",
      type: "numeric",
      numericFormat: {
        pattern: "0,0.00",
        culture: "en-IN",
      },
    },
    {
      data: "utilizeCashBalance",
      readOnly: true,
      title: "Utilisable Cash Balance",
      type: "numeric",
      width:"200px",
      numericFormat: {
        pattern: "0,0.00",
        culture: "en-IN",
      },
    },
    {
      data: "additionalCashRequired",
      readOnly: true,
      title: "Additional Cash required",
      type: "numeric",
      numericFormat: {
        pattern: "0,0.00",
        culture: "en-IN",
      },
    },
  ];
  const nestedPaymentOfTaxColumns = [
    [
      "Description",
      { label: "Tax Payable", colspan: 2 },
      {
        label: "Adjustment of negative liability of previous tax period",
        colspan: 2,
      },
      "Interest payable",
      { label: "To be Paid in cash", colspan: 2 },
      "Utilisable Cash Balance",
      "Additional Cash required",
    ],
    [
      "",
      "Reverse charge",
      "Other than reverse charge",
      "Reverse charge",
      "Other than reverse charge",
      "",
      "Tax/cess",
      "Interest",
      "",
    ],
  ];

  // const navigate = useNavigate();
  const animatedComponents = makeAnimated();


  const {
    setGSRT1Data,
    datas,
    setDatas,
    block,
    setBlock,
    wizardBtn,
    panDataFrom,
    finFromYear,
    cmp08Data,
    defaultInvoiceData,
    defaultCashLedgerData,
    defaultPaymentOfTaxData,
    setPanDataFrom,
    panData,
    setPanData,
    displayType,
    setDisplayType,
    setFinFormYear,
    monthFrom,
    setMonthFrom,
    hotRef,
    cashLedgerHotRef,
    paymentOfTaxHotRef,
    data,
    setData,
    deleteModalshow,
    setDeleteModalshow,
    errorArr,
    setErrorArr,
    setCMP08Data,
    cashLedgerData,
    setCashLedgerData,
    taxData,
    setTaxData,
    loadFunctionExport,
    CMP08SummaryServiceCall,
    updateCMP08Data,
    HideShowDeleteModel,
    isNumber,
    getErrorColumns,
    saveCMP08Details,
    toggleCompose,
    setDeleteType,
    deleteType
  } = useOutletContext();
  const gstr3BToDt =
    sessionStorage.getItem(globleVariable.defaultYear) !== null &&
    sessionStorage.getItem(globleVariable.defaultYear) !== "" &&
    sessionStorage.getItem(globleVariable.defaultYear) !== undefined
      ? SessionFunction?.getSessionValue(globleVariable?.defaultYear, true)
      : "";

  const theader = (col, TH) => {
    if (col == 0) {
      TH.className = "htLeft";
    } else {
      TH.className = "htRight";
    }
  };

  const cashLedgerTheader = (col, TH) => {
    TH.className = "htRight";
  };

  const paymentOfTaxTheader = (col, TH) => {
    if (TH) {
      TH.style.height = "auto"; // Adjusts height based on content
      TH.style.verticalAlign = "middle";
      TH.style.whiteSpace = "normal";
      TH.style.width = "50px";
    }

    if (col == 0) {
      TH.className += " htLeft";
    }
    if (col > 1) {
      TH.className += " htCenter";
    }

    // TH.className += " text-center wrap"
  };



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
    // sessionStorage.setItem('gstr1FromDt', value?.value)
    // SessionFunction.setSessionValue(globleVariable.itc04DateRange, value?.value)
    setMonthFrom(setDt);
    setPanData(x);

    sessionStorage.setItem(globleVariable.cmp08DownloadDate, value?.value);
    //sessionStorage.setItem('gstr1SelectExportToDt', setDt?.value)
  };
  console.log(finFromYear,"finBalorrr")



  const cellChangeSubDetails = (change, source) => {
    // debugger
    if (source === "CopyPaste.paste") document.body.classList.add("is-copy");

    if (
      source === "CopyPaste.paste" ||
      source === "edit" ||
      source === "Autofill.fill"
    ) {
      const hot = hotRef.current?.hotInstance;
      let withoutErrArr = [];
      change?.forEach(([row, col, oldValue, newValue]) => {
        const sanitizedValue =
          typeof newValue === "string" ? newValue.replace(/,/g, "") : newValue;
        if (oldValue != newValue) {
          console.log(col, "collll");
          console.log(oldValue, newValue, "maxVAlueeee");
          if (
            col === "value" ||
            col === "igst" ||
            col === "cgst" ||
            col === "sgst" ||
            col === "cess"
          ) {
            hot?.setDataAtRowProp(row, hot?.colToProp(col), sanitizedValue);
          }
        }
        // The value to set Error
        const colIndex = invoiceDetailsColumns.findIndex(
          (obj) => obj.data === col
        );

        if (
          colIndex == 1 ||
          colIndex == 2 ||
          colIndex == 3 ||
          colIndex == 4 ||
          colIndex == 5
        ) {
          const cellObj = {
            row: row,
            col: colIndex,
            table: "Invoice Details",
          };
          // Check if the edited value is numeric
          if (isNaN(sanitizedValue) && colIndex < 6 && row < 4) {
            setErrorArr((pre) => [...pre, cellObj]);
          } else {
            if (
              errorArr.findIndex(
                (y) =>
                  y.row == cellObj.row &&
                  y.col == cellObj.col &&
                  y.table == cellObj.table
              ) != -1
            ) {
              withoutErrArr.push(cellObj);
            }
          }
        }
      });
      if (withoutErrArr.length > 0) {
        const withErrArr = errorArr;
        const filteredArr = withErrArr.filter(
          (itemX) =>
            !withoutErrArr.some(
              (itemY) =>
                itemY.row === itemX.row &&
                itemY.col === itemX.col &&
                itemY.table === itemX.table
            )
        );
        setErrorArr(filteredArr);
      }
    }

    if (source !== "loadData" && change && change.length > 0) {
      const sessColumnIndex = 4;
      const cessColumnIndex = "cgst";
      for (const [row, col, oldValue, newValue] of change) {
        if (col === cessColumnIndex && oldValue != undefined) {
          console.log(col, "coll");
          const sessValue = newValue;
          if (!isNaN(sessValue)) {
            hotRef?.current?.hotInstance?.setDataAtCell(
              row,
              sessColumnIndex,
              sessValue
            );
          }
        }
      }
    }

    //   for the calculation purpose of each row
    if (source !== "loadData" && change && change.length > 0) {
      // debugger
      for (const [row, col, oldValue, newValue] of change) {
        if (row === 0 && col == "value") {
          const initialValue = !Number.isNaN(
            parseFloat(hotRef?.current?.hotInstance?.getDataAtCell(row, 1))
          )
            ? hotRef?.current?.hotInstance?.getDataAtCell(row, 1)
            : hotRef?.current?.hotInstance?.setDataAtCell(row, 1, "0.00");
        if(change?.length > 0){
          hotRef?.current?.hotInstance?.setDataAtCell(row, 3, "0.00");
          hotRef?.current?.hotInstance?.setDataAtCell(row, 4, "0.00");

        }
          const row1 = parseFloat(
            hotRef?.current?.hotInstance?.getDataAtCell(1, 1)
          );
          const A = parseFloat(initialValue) + parseFloat(row1);

          if (!isNaN(A)) {
            hotRef?.current?.hotInstance?.setDataAtCell(2, 1, A.toFixed(2));
          }
        }
        if (row === 1 && col == "value") {
          const initialValue = !Number.isNaN(
            parseFloat(hotRef?.current?.hotInstance?.getDataAtCell(row, 1))
          )
            ? hotRef?.current?.hotInstance?.getDataAtCell(row, 1)
            : hotRef?.current?.hotInstance?.setDataAtCell(row, 1, "0.00");
            if(change?.length > 0){
              hotRef?.current?.hotInstance?.setDataAtCell(row, 2, "0.00");
              hotRef?.current?.hotInstance?.setDataAtCell(row, 3, "0.00");
              hotRef?.current?.hotInstance?.setDataAtCell(row, 4, "0.00");
              hotRef?.current?.hotInstance?.setDataAtCell(row, 5, "0.00");
            }
          const row0 = parseFloat(
            hotRef?.current?.hotInstance?.getDataAtCell(0, 1)
          );
          const A = parseFloat(initialValue) + parseFloat(row0);

          if (!isNaN(A)) {
            hotRef?.current?.hotInstance?.setDataAtCell(2, 1, A.toFixed(2));
          }
        }
        if (row === 0 && col == "igst") {
          const initialValue = !Number.isNaN(
            parseFloat(hotRef?.current?.hotInstance?.getDataAtCell(row, 2))
          )
            ? hotRef?.current?.hotInstance?.getDataAtCell(row, 2)
            : hotRef?.current?.hotInstance?.setDataAtCell(row, 2, "0.00");

          const row2 = parseFloat(
            hotRef?.current?.hotInstance?.getDataAtCell(1, 2)
          );
          const A = parseFloat(initialValue) + parseFloat(row2);

          if (!isNaN(A)) {
            hotRef?.current?.hotInstance?.setDataAtCell(2, 2, A?.toString());
          }
        }
        if (row === 1 && col == "igst") {
          const initialValue = !Number.isNaN(
            parseFloat(hotRef?.current?.hotInstance?.getDataAtCell(row, 2))
          )
            ? hotRef?.current?.hotInstance?.getDataAtCell(row, 2)
            : hotRef?.current?.hotInstance?.setDataAtCell(row, 2, "0.00");
            // Do not this delete initalValue 2 it is for purpose of paymentTax
            const initialValue2 = paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(0, 1, initialValue);
            const valueData = hotRef?.current?.hotInstance?.getDataAtCell(row, 1)
            const SumData = parseFloat(hotRef?.current?.hotInstance?.getDataAtCell(row, 2)) + parseFloat(hotRef?.current?.hotInstance?.getDataAtCell(row, 3)) + parseFloat(hotRef?.current?.hotInstance?.getDataAtCell(row, 3)) +parseFloat( hotRef?.current?.hotInstance?.getDataAtCell(row, 5))

            if(SumData > Number(valueData)){
             hotRef?.current?.hotInstance?.setDataAtCell(row, 2, "0.00");
            }
          const row0 = !Number.isNaN(
            parseFloat(hotRef?.current?.hotInstance?.getDataAtCell(0, 2))
          )
            ? hotRef?.current?.hotInstance?.getDataAtCell(0, 2)
            : hotRef?.current?.hotInstance?.setDataAtCell(0, 2, "0.00");
          const A = parseFloat(initialValue) + parseFloat(row0);

          if (!isNaN(A)) {
            hotRef?.current?.hotInstance?.setDataAtCell(2, 2, A.toFixed(2));
          }
        }
        if (row === 0 && col == "cgst") {
          // debugger
          const initialValue = !Number.isNaN(
            parseFloat(hotRef?.current?.hotInstance?.getDataAtCell(row, 3))
          )
            ? hotRef?.current?.hotInstance?.getDataAtCell(row, 3)
            : hotRef?.current?.hotInstance?.setDataAtCell(row, 3, "0.00");
             // Do not this delete initalValue 2 & 3 variable  it is for purpose of paymentTax
             const initialValue2 = paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(1, 2, initialValue);
             const initialValue3 = paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(2, 2, initialValue);
     const valueData = hotRef?.current?.hotInstance?.getDataAtCell(row, 1)
     const SumData = parseFloat(hotRef?.current?.hotInstance?.getDataAtCell(row, 2)) + parseFloat(hotRef?.current?.hotInstance?.getDataAtCell(row, 3)) + parseFloat(hotRef?.current?.hotInstance?.getDataAtCell(row, 3)) +parseFloat( hotRef?.current?.hotInstance?.getDataAtCell(row, 5))

     if(SumData > Number(valueData)){
      hotRef?.current?.hotInstance?.setDataAtCell(row, 3, "0.00");
     }
          const row3 = parseFloat(
            hotRef?.current?.hotInstance?.getDataAtCell(1, 3)
          );
          const A = parseFloat(initialValue) + parseFloat(row3);

          if (!isNaN(A)) {
            hotRef?.current?.hotInstance?.setDataAtCell(2, 3, A.toFixed(2));
          }
        }
        if (row === 1 && col == "cgst") {
          const initialValue = !Number.isNaN(
            parseFloat(hotRef?.current?.hotInstance?.getDataAtCell(row, 3))
          )
            ? hotRef?.current?.hotInstance?.getDataAtCell(row, 3)
            : hotRef?.current?.hotInstance?.setDataAtCell(row, 3, "0.00");
            // Do not this delete initalValue 2 it is for purpose of paymentTax
            const initialValue2 = paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(1, 1, initialValue);
            const initialValue3 = paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(2, 1, initialValue);

            const valueData = hotRef?.current?.hotInstance?.getDataAtCell(row, 1)
            const SumData = parseFloat(hotRef?.current?.hotInstance?.getDataAtCell(row, 2)) + parseFloat(hotRef?.current?.hotInstance?.getDataAtCell(row, 3)) + parseFloat(hotRef?.current?.hotInstance?.getDataAtCell(row, 3)) +parseFloat( hotRef?.current?.hotInstance?.getDataAtCell(row, 5))

            if(SumData > Number(valueData)){
             hotRef?.current?.hotInstance?.setDataAtCell(row, 3, "0.00");
            }

          const row0 = parseFloat(
            hotRef?.current?.hotInstance?.getDataAtCell(0, 3)
          );
          const A = parseFloat(initialValue) + parseFloat(row0);

          if (!isNaN(A)) {
            hotRef?.current?.hotInstance?.setDataAtCell(2, 3, A.toFixed());
          }
        }
        if (row === 0 && col == "cess") {
          const initialValue = !Number.isNaN(
            parseFloat(hotRef?.current?.hotInstance?.getDataAtCell(row, 5))
          )
            ? hotRef?.current?.hotInstance?.getDataAtCell(row, 5)
            : hotRef?.current?.hotInstance?.setDataAtCell(row, 5, "0.00");

          const row5 = parseFloat(
            hotRef?.current?.hotInstance?.getDataAtCell(1, 5)
          );
          const A = parseFloat(initialValue) + parseFloat(row5);

          if (!isNaN(A)) {
            hotRef?.current?.hotInstance?.setDataAtCell(2, 5, A.toFixed(2));
          }
        }
        if (row === 1 && col == "cess") {
          const initialValue = !Number.isNaN(
            parseFloat(hotRef?.current?.hotInstance?.getDataAtCell(row, 5))
          )
            ? hotRef?.current?.hotInstance?.getDataAtCell(row, 5)
            : hotRef?.current?.hotInstance?.setDataAtCell(row, 5, "0.00");
            // Do not this delete initalValue 2 it is for purpose of paymentTax
            const initialValue2 = paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(3, 1, initialValue);
            const valueData = hotRef?.current?.hotInstance?.getDataAtCell(row, 1)
            const SumData = parseFloat(hotRef?.current?.hotInstance?.getDataAtCell(row, 2)) + parseFloat(hotRef?.current?.hotInstance?.getDataAtCell(row, 3)) + parseFloat(hotRef?.current?.hotInstance?.getDataAtCell(row, 3)) +parseFloat( hotRef?.current?.hotInstance?.getDataAtCell(row, 5))

            if(SumData > Number(valueData)){
             hotRef?.current?.hotInstance?.setDataAtCell(row, 5, "0.00");
            }
          const row0 = !Number.isNaN(
            parseFloat(hotRef?.current?.hotInstance?.getDataAtCell(0, 5))
          )
            ? hotRef?.current?.hotInstance?.getDataAtCell(0, 5)
            : hotRef?.current?.hotInstance?.setDataAtCell(0, 5, "0.00");

          const A = parseFloat(initialValue) + parseFloat(row0);

          if (!isNaN(A)) {
            hotRef?.current?.hotInstance?.setDataAtCell(2, 5, A.toFixed(2));
          }
        }
        if (col == "cgst") {
          const cgstValue = hotRef?.current?.hotInstance?.getDataAtCell(
            row,
            col
          );
          if (!Number.isNaN(cgstValue)) {
            hotRef?.current?.hotInstance?.setDataAtCell(
              row,
              4,
              cgstValue?.toString()
            );
          }
        }

        if(row == 3 && col == "igst"){
          const initialValue = !Number.isNaN(
            parseFloat(hotRef?.current?.hotInstance?.getDataAtCell(row, 2))
          )
            ? hotRef?.current?.hotInstance?.getDataAtCell(row, 2)
            : hotRef?.current?.hotInstance?.setDataAtCell(row, 2, "0.00");
            // Do not this delete initalValue 2 it is for purpose of paymentTax
            const initialValue2 = paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(0, 5, initialValue);
            const initialValue3 = paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(0, 7, initialValue);
        }

        if(row == 3 && col == "cgst"){
          const initialValue = !Number.isNaN(
            parseFloat(hotRef?.current?.hotInstance?.getDataAtCell(row, 3))
          )
            ? hotRef?.current?.hotInstance?.getDataAtCell(row, 3)
            : hotRef?.current?.hotInstance?.setDataAtCell(row, 3, "0.00");
            // Do not this delete initalValue 2 it is for purpose of paymentTax
            const initialValue2 = paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(1, 5, initialValue);
            const initialValue3 = paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(1, 7, initialValue);

            const initialValue4 = paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(2, 5, initialValue);
            const initialValue5 = paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(2, 7, initialValue);

        }

        if(row == 3 && col == "cess"){
          const initialValue = !Number.isNaN(
            parseFloat(hotRef?.current?.hotInstance?.getDataAtCell(row, 5))
          )
            ? hotRef?.current?.hotInstance?.getDataAtCell(row, 5)
            : hotRef?.current?.hotInstance?.setDataAtCell(row, 5, "0.00");
            console.log(initialValue,"initialValueinitialValueTest")
            // Do not this delete initalValue 2 it is for purpose of paymentTax
            const initialValue2 = paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(3, 5, initialValue);
            const initialValue3 = paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(3, 7, initialValue);
        }


      }
    }
    if (source !== "loadData" && change && change.length > 0) {
      const colIndex = {
        value: 1,
        igst: 2,
        cgst: 3,
        sgst: 4,
        cess: 5,
      };
      for (const [row, col, oldValue, newValue] of change) {
        const hot = hotRef?.current?.hotInstance;
        if (colIndex[col]) {
          !Number.isNaN(parseFloat(hot?.getDataAtCell(row, colIndex[col])))
            ? hot?.getDataAtCell(row, colIndex[col])
            : hot?.setDataAtCell(row, colIndex[col], "0.00");
        }
      }
    }
  };

  const cellChangePaymentOfTax = (change, source) => {
    if (
      source === "CopyPaste.paste" ||
      source === "edit" ||
      source === "Autofill.fill"
    ) {
      const hot = paymentOfTaxHotRef.current?.hotInstance;
      let withoutErrArr = [];
      change?.forEach(([row, col, oldValue, newValue]) => {
        const sanitizedValue =
          typeof newValue === "string" ? newValue.replace(/,/g, "") : newValue;
        if (oldValue != newValue) {
          console.log(col, "collll");
          console.log(oldValue, newValue, "maxVAlueeee");
          if (
            col === "taxPayableReverseCharge" ||
            col === "taxPayableOther" ||
            col === "adjustmentReverseCharge" ||
            col === "adjustmentOther" ||
            col === "interestPayable" ||
            col === "cess" ||
            col === "interest" ||
            col === "additionalCashRequired"
          ) {
            hot?.setDataAtRowProp(row, hot?.colToProp(col), sanitizedValue);
          }
        }
        // The value to set Error
        const colIndex = paymentOfTaxColumns.findIndex(
          (obj) => obj.data === col
        );

        if (
          colIndex == 1 ||
          colIndex == 2 ||
          colIndex == 3 ||
          colIndex == 4 ||
          colIndex == 5 ||
          colIndex == 6 ||
          colIndex == 7 ||
          colIndex == 8
        ) {
          const cellObj = {
            row: row,
            col: colIndex,
            table: "Invoice Details",
          };
          // Check if the edited value is numeric
          if (isNaN(sanitizedValue) && colIndex < 6 && row < 2) {
            setErrorArr((pre) => [...pre, cellObj]);
          } else {
            if (
              errorArr.findIndex(
                (y) =>
                  y.row == cellObj.row &&
                  y.col == cellObj.col &&
                  y.table == cellObj.table
              ) != -1
            ) {
              withoutErrArr.push(cellObj);
            }
          }
        }
      });
      if (withoutErrArr.length > 0) {
        const withErrArr = errorArr;
        const filteredArr = withErrArr.filter(
          (itemX) =>
            !withoutErrArr.some(
              (itemY) =>
                itemY.row === itemX.row &&
                itemY.col === itemX.col &&
                itemY.table === itemX.table
            )
        );
        setErrorArr(filteredArr);
      }
    }

    //   for the calculation purpose of each row
    if (source !== "loadData" && change && change.length > 0) {
      const colIndex = {
        taxPayableReverseCharge: 1,
        taxPayableOther: 2,
        adjustmentReverseCharge: 3,
        adjustmentOther: 4,
        interestPayable: 5,
        cess: 6,
        interest: 7,
        additionalCashRequired: 8,
      };
      for (const [row, col, oldValue, newValue] of change) {
        const hot = paymentOfTaxHotRef?.current?.hotInstance;
        if (colIndex[col]) {
          !Number.isNaN(parseFloat(hot?.getDataAtCell(row, colIndex[col])))
            ? hot?.getDataAtCell(row, colIndex[col])
            : hot?.setDataAtCell(row, colIndex[col], "0.00");
        }
      }
    }

    if (source !== "loadData" && change && change.length > 0) {
      // debugger
      for (const [row, col, oldValue, newValue] of change) {
        console.log(col,"colll")

 // Intereset Payble Row Captcha ***********************************************************************************************************

        if (row === 0 && col == "interestPayable") {

          const totalTax = parseFloat(
            paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(0, 6)
          );
          console.log(totalTax,"totalTax")

          const initialValue = !Number.isNaN(
            parseFloat(paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(row, 5))
          )
            ? paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(row, 5)
            : paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(row, 5, "0.00");
            console.log(initialValue,"initialValueinitialValue")
            const initialValue2 = paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(0, 7, initialValue);

        // if(change?.length > 0){
        //   hotRef?.current?.hotInstance?.setDataAtCell(row, 3, "0.00");
        //   hotRef?.current?.hotInstance?.setDataAtCell(row, 4, "0.00");

        // }
        const utilizationCash = parseFloat(
          cashLedgerHotRef?.current?.hotInstance?.getDataAtCell(0, 0)
        );
        const addFirst = parseFloat(totalTax) + parseFloat(initialValue);
        if(addFirst <= utilizationCash){
          if (!isNaN(addFirst)) {
            paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(0, 8, addFirst.toFixed(2));
            paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(0, 9, "0.00");
          }
        }
        else if(addFirst > utilizationCash){
          const addCashReq = parseFloat(addFirst) - parseFloat(utilizationCash);
          if (!isNaN(addCashReq)) {
          paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(0, 9, addCashReq.toFixed(2));
          }
        }
      }

        if (row === 1 && col == "interestPayable") {
          const totalTax = parseFloat(
            paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(1, 6)
          );

          const initialValue = !Number.isNaN(
            parseFloat(paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(row, 5))
          )
            ? paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(row, 5)
            : paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(row, 5, "0.00");
            console.log(initialValue,"initialValueinitialValue")
            // Do not remove below code it is in use to setDataAtCell
            const initialValue2 = paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(1, 7, initialValue);
            const utilizationCash = parseFloat(
              cashLedgerHotRef?.current?.hotInstance?.getDataAtCell(0, 1)
            );

            console.log(utilizationCash,"utilizationCashutilizationCash")
            const addFirst = parseFloat(totalTax) + parseFloat(initialValue);
            if(addFirst <= utilizationCash){
              if (!isNaN(addFirst)) {
                paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(1, 8, addFirst.toFixed(2));
                paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(1, 9, "0.00");
              }
            }
            else if(addFirst > utilizationCash){
              const addCashReq = parseFloat(addFirst) - parseFloat(utilizationCash);
              if (!isNaN(addCashReq)) {
              paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(1, 9, addCashReq.toFixed(2));
              }
            }

          }

        if (row === 2 && col == "interestPayable") {

          const initialValue = !Number.isNaN(
            parseFloat(paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(row, 5))
          )
            ? paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(row, 5)
            : paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(row, 5, "0.00");
            console.log(initialValue,"initialValueinitialValue")
            // Do not remove below code it is in use to setDataAtCell
            const initialValue2 = paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(2, 7, initialValue);

            const totalTax = parseFloat(
              paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(2, 6)
            );

            const utilizationCash = parseFloat(
              cashLedgerHotRef?.current?.hotInstance?.getDataAtCell(0, 2)
            );

            console.log(utilizationCash,"utilizationCashutilizationCash")
            const addFirst = parseFloat(totalTax) + parseFloat(initialValue);
            if(addFirst <= utilizationCash){
              if (!isNaN(addFirst)) {
                paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(2, 8, addFirst.toFixed(2));
                paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(2, 9, "0.00");
              }
            }
            else if(addFirst > utilizationCash){
              const addCashReq = parseFloat(addFirst) - parseFloat(utilizationCash);
              if (!isNaN(addCashReq)) {
              paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(2, 9, addCashReq.toFixed(2));
              }
            }

          }

        if (row === 3 && col == "interestPayable") {

          const initialValue = !Number.isNaN(
            parseFloat(paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(row, 5))
          )
            ? paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(row, 5)
            : paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(row, 5, "0.00");
            console.log(initialValue,"initialValueinitialValue")
            // Do not remove below code it is in use to setDataAtCell
            const initialValue2 = paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(3, 7, initialValue);

            const totalTax = parseFloat(
              paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(3, 6)
            );

            const utilizationCash = parseFloat(
              cashLedgerHotRef?.current?.hotInstance?.getDataAtCell(0, 3)
            );

            console.log(utilizationCash,"utilizationCashutilizationCash")
            const addFirst = parseFloat(totalTax) + parseFloat(initialValue);
            if(addFirst <= utilizationCash){
              if (!isNaN(addFirst)) {
                paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(3, 8, addFirst.toFixed(2));
                paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(3, 9, "0.00");
              }
            }
            else if(addFirst > utilizationCash){
              const addCashReq = parseFloat(addFirst) - parseFloat(utilizationCash);
              if (!isNaN(addCashReq)) {
              paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(3, 9, addCashReq.toFixed(2));
              }
            }

          }

//Row-1 ****************************************************************************************************

        if (row === 0 && col == "taxPayableReverseCharge") {
          const initialValue = !Number.isNaN(
            parseFloat(paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(row, 1))
          )
            ? paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(row, 1)
            : paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(row, 1, "0.00");
        // if(change?.length > 0){
        //   hotRef?.current?.hotInstance?.setDataAtCell(row, 3, "0.00");
        //   hotRef?.current?.hotInstance?.setDataAtCell(row, 4, "0.00");

        // }
          const row1 = parseFloat(
            paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(0, 2)
          );
          const row2 = parseFloat(
            paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(0, 3)
          );const row3 = parseFloat(
            paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(0, 4)
          );

          const intersetPayRow = parseFloat(
            paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(0, 5)
          );

          const utilizationCash = parseFloat(
            cashLedgerHotRef?.current?.hotInstance?.getDataAtCell(0, 0)
          );

          console.log(utilizationCash,"utilizationCash")

          const A = parseFloat(initialValue) + parseFloat(row1) - parseFloat(row2) - parseFloat(row3);
          const B = A + intersetPayRow;

          if(B <=  utilizationCash){
            if (!isNaN(B)) {
              paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(0, 8, B.toFixed(2));
              paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(0, 9, "0.00");
            }
          }
          else if(B > utilizationCash){
            const addCashReq = parseFloat(B) - parseFloat(utilizationCash);
            if (!isNaN(addCashReq)) {
              paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(0, 8, utilizationCash.toFixed(2));
              paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(0, 9, addCashReq.toFixed(2));
            }
          }

          if (!isNaN(A)) {
            paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(0, 6, A.toFixed(2));
          }
        }

        if (row === 0 && col == "taxPayableOther") {

          const row0 = parseFloat(
            paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(0, 1)
          );

          const initialValue = !Number.isNaN(
            parseFloat(paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(row, 2))
          )
            ? paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(row, 2)
            : paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(row, 2, "0.00");
        // if(change?.length > 0){
        //   hotRef?.current?.hotInstance?.setDataAtCell(row, 3, "0.00");
        //   hotRef?.current?.hotInstance?.setDataAtCell(row, 4, "0.00");

        // }

          const row2 = parseFloat(
            paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(0, 3)
          );const row3 = parseFloat(
            paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(0, 4)
          );

          const intersetPayRow = parseFloat(
            paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(0, 5)
          );
          const utilizationCash = parseFloat(
            cashLedgerHotRef?.current?.hotInstance?.getDataAtCell(0, 0)
          );

          const A =  parseFloat(row0) +  parseFloat(initialValue)  - parseFloat(row2) - parseFloat(row3);
          const B = A + intersetPayRow;

          if(B <=  utilizationCash){
            if (!isNaN(B)) {
              paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(0, 8, B.toFixed(2));
              paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(0, 9, "0.00");
            }
          }
          else if(B > utilizationCash){
            const addCashReq = parseFloat(B) - parseFloat(utilizationCash);
            if (!isNaN(addCashReq)) {
              paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(0, 8, utilizationCash.toFixed(2));
              paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(0, 9, addCashReq.toFixed(2));
            }
          }

          if (!isNaN(A)) {
            paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(0, 6, A.toFixed(2));
            // paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(0, 9, B.toFixed(2));
          }
        }

        if (row === 0 && col == "adjustmentReverseCharge") {

          const row0 = parseFloat(
            paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(0, 1)
          );

          const row1 = parseFloat(
            paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(0, 2)
          );

          const initialValue = !Number.isNaN(
            parseFloat(paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(row, 3))
          )
            ? paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(row, 3)
            : paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(row, 3, "0.00");
            console.log(initialValue,"initialValueinitialValue")
        // if(change?.length > 0){
        //   hotRef?.current?.hotInstance?.setDataAtCell(row, 3, "0.00");
        //   hotRef?.current?.hotInstance?.setDataAtCell(row, 4, "0.00");

        // }

          const row3 = parseFloat(
            paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(0, 4)
          );
          const intersetPayRow = parseFloat(
            paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(0, 5)
          );
          const utilizationCash = parseFloat(
            cashLedgerHotRef?.current?.hotInstance?.getDataAtCell(0, 0)
          );
          const A =  parseFloat(row0) +  parseFloat(row1)  - parseFloat(initialValue) - parseFloat(row3);
          const B = A + intersetPayRow;

          if(B <=  utilizationCash){
            if (!isNaN(B)) {
              paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(0, 8, B.toFixed(2));
              paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(0, 9, "0.00");
            }
          }
          else if(B > utilizationCash){
            const addCashReq = parseFloat(B) - parseFloat(utilizationCash);
            if (!isNaN(addCashReq)) {
              paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(0, 8, utilizationCash.toFixed(2));
              paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(0, 9, addCashReq.toFixed(2));
            }
          }

          if (!isNaN(A)) {
            paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(0, 6, A.toFixed(2));
            // paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(0, 9, B.toFixed(2));
          }
        }

        if (row === 0 && col == "adjustmentOther") {

          const row0 = parseFloat(
            paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(0, 1)
          );

          const row1 = parseFloat(
            paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(0, 2)
          );

          const row2 = parseFloat(
            paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(0, 3)
          );

          const initialValue = !Number.isNaN(
            parseFloat(paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(row, 4))
          )
            ? paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(row, 4)
            : paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(row, 4, "0.00");
            console.log(initialValue,"initialValueinitialValue")
        // if(change?.length > 0){
        //   hotRef?.current?.hotInstance?.setDataAtCell(row, 3, "0.00");
        //   hotRef?.current?.hotInstance?.setDataAtCell(row, 4, "0.00");

        // }
        const intersetPayRow = parseFloat(
          paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(0, 5)
        );

        const utilizationCash = parseFloat(
          cashLedgerHotRef?.current?.hotInstance?.getDataAtCell(0, 0)
        );

          const A =  parseFloat(row0) +  parseFloat(row1)  - parseFloat(row2) - parseFloat(initialValue);
          const B = A + intersetPayRow;

          if(B <=  utilizationCash){
            if (!isNaN(B)) {
              paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(0, 8, B.toFixed(2));
              paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(0, 9, "0.00");
            }
          }
          else if(B > utilizationCash){
            const addCashReq = parseFloat(B) - parseFloat(utilizationCash);
            if (!isNaN(addCashReq)) {
              paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(0, 8, utilizationCash.toFixed(2));
              paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(0, 9, addCashReq.toFixed(2));
            }
          }

          if (!isNaN(A)) {
            paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(0, 6, A.toFixed(2));
            // paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(0, 9, B.toFixed(2));
          }
        }

//Row 2 *******************************************************************************************************************
        if (row === 1 && col == "taxPayableReverseCharge") {
          const initialValue = !Number.isNaN(
            parseFloat(paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(row, 1))
          )
            ? paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(row, 1)
            : paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(row, 1, "0.00");
            console.log(initialValue,"initialValueinitialValue")
        // if(change?.length > 0){
        //   hotRef?.current?.hotInstance?.setDataAtCell(row, 3, "0.00");
        //   hotRef?.current?.hotInstance?.setDataAtCell(row, 4, "0.00");

        // }
          const row1 = parseFloat(
            paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(1, 2)
          );
          const row2 = parseFloat(
            paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(1, 3)
          );const row3 = parseFloat(
            paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(1, 4)
          );
          const intersetPayRow = parseFloat(
            paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(1, 5)
          );
          const utilizationCash = parseFloat(
            cashLedgerHotRef?.current?.hotInstance?.getDataAtCell(0, 1)
          );

          console.log(utilizationCash,"utilizationCash")

          const A = parseFloat(initialValue) + parseFloat(row1) - parseFloat(row2) - parseFloat(row3);
          const B = A + intersetPayRow;

          if(B <=  utilizationCash){
            if (!isNaN(B)) {
              paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(1, 8, B.toFixed(2));
              paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(1, 9, "0.00");
            }
          }
          else if(B > utilizationCash){
            const addCashReq = parseFloat(B) - parseFloat(utilizationCash);
            if (!isNaN(addCashReq)) {
              paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(1, 8, utilizationCash.toFixed(2));
              paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(1, 9, addCashReq.toFixed(2));
            }
          }

          if (!isNaN(A)) {
            paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(1, 6, A.toFixed(2));
            // paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(1, 9, B.toFixed(2));
          }
        }

        if (row === 1 && col == "taxPayableOther") {

          const row0 = parseFloat(
            paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(1, 1)
          );

          const initialValue = !Number.isNaN(
            parseFloat(paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(row, 2))
          )
            ? paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(row, 2)
            : paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(row, 2, "0.00");
            console.log(initialValue,"initialValueinitialValue")
        // if(change?.length > 0){
        //   hotRef?.current?.hotInstance?.setDataAtCell(row, 3, "0.00");
        //   hotRef?.current?.hotInstance?.setDataAtCell(row, 4, "0.00");

        // }

          const row2 = parseFloat(
            paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(1, 3)
          );const row3 = parseFloat(
            paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(1, 4)
          );
          const intersetPayRow = parseFloat(
            paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(1, 5)
          );
          const utilizationCash = parseFloat(
            cashLedgerHotRef?.current?.hotInstance?.getDataAtCell(0, 1)
          );
          const A =  parseFloat(row0) +  parseFloat(initialValue)  - parseFloat(row2) - parseFloat(row3);
          const B = A + intersetPayRow;

          if(B <=  utilizationCash){
            if (!isNaN(B)) {
              paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(1, 8, B.toFixed(2));
              paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(1, 9, "0.00");
            }
          }
          else if(B > utilizationCash){
            const addCashReq = parseFloat(B) - parseFloat(utilizationCash);
            if (!isNaN(addCashReq)) {
              paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(1, 8, utilizationCash.toFixed(2));
              paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(1, 9, addCashReq.toFixed(2));
            }
          }

          if (!isNaN(A)) {
            paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(1, 6, A.toFixed(2));
            // paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(1, 9, B.toFixed(2));
          }
        }

        if (row === 1 && col == "adjustmentReverseCharge") {

          const row0 = parseFloat(
            paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(1, 1)
          );

          const row1 = parseFloat(
            paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(1, 2)
          );

          const initialValue = !Number.isNaN(
            parseFloat(paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(row, 3))
          )
            ? paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(row, 3)
            : paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(row, 3, "0.00");
            console.log(initialValue,"initialValueinitialValue")
        // if(change?.length > 0){
        //   hotRef?.current?.hotInstance?.setDataAtCell(row, 3, "0.00");
        //   hotRef?.current?.hotInstance?.setDataAtCell(row, 4, "0.00");

        // }


          const row3 = parseFloat(
            paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(1, 4)
          );
          const intersetPayRow = parseFloat(
            paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(1, 5)
          );
          const utilizationCash = parseFloat(
            cashLedgerHotRef?.current?.hotInstance?.getDataAtCell(0, 1)
          );
          const A =  parseFloat(row0) +  parseFloat(row1)  - parseFloat(initialValue) - parseFloat(row3);
          const B = A + intersetPayRow;

          if(B <=  utilizationCash){
            if (!isNaN(B)) {
              paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(1, 8, B.toFixed(2));
              paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(1, 9, "0.00");
            }
          }
          else if(B > utilizationCash){
            const addCashReq = parseFloat(B) - parseFloat(utilizationCash);
            if (!isNaN(addCashReq)) {
              paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(1, 8, utilizationCash.toFixed(2));
              paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(1, 9, addCashReq.toFixed(2));
            }
          }

          if (!isNaN(A)) {
            paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(1, 6, A.toFixed(2));
            // paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(1, 9, B.toFixed(2));
          }
        }

        if (row === 1 && col == "adjustmentOther") {

          const row0 = parseFloat(
            paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(1, 1)
          );

          const row1 = parseFloat(
            paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(1, 2)
          );

          const row2 = parseFloat(
            paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(1, 3)
          );

          const initialValue = !Number.isNaN(
            parseFloat(paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(row, 4))
          )
            ? paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(row, 4)
            : paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(row, 4, "0.00");
            console.log(initialValue,"initialValueinitialValue");
            const intersetPayRow = parseFloat(
              paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(1, 5)
            );
            const utilizationCash = parseFloat(
              cashLedgerHotRef?.current?.hotInstance?.getDataAtCell(0, 1)
            );
        // if(change?.length > 0){
        //   hotRef?.current?.hotInstance?.setDataAtCell(row, 3, "0.00");
        //   hotRef?.current?.hotInstance?.setDataAtCell(row, 4, "0.00");

        // }

          const A =  parseFloat(row0) +  parseFloat(row1)  - parseFloat(row2) - parseFloat(initialValue);
          const B = A + intersetPayRow;

          if(B <=  utilizationCash){
            if (!isNaN(B)) {
              paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(1, 8, B.toFixed(2));
              paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(1, 9, "0.00");
            }
          }
          else if(B > utilizationCash){
            const addCashReq = parseFloat(B) - parseFloat(utilizationCash);
            if (!isNaN(addCashReq)) {
              paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(1, 8, utilizationCash.toFixed(2));
              paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(1, 9, addCashReq.toFixed(2));
            }
          }

          if (!isNaN(A)) {
            paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(1, 6, A.toFixed(2));
            // paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(1, 9, B.toFixed(2));
          }
        }
// Row -3*******************************************************************************************************************


        if (row === 2 && col == "taxPayableReverseCharge") {
          const initialValue = !Number.isNaN(
            parseFloat(paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(row, 1))
          )
            ? paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(row, 1)
            : paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(row, 1, "0.00");
            console.log(initialValue,"initialValueinitialValue")
        // if(change?.length > 0){
        //   hotRef?.current?.hotInstance?.setDataAtCell(row, 3, "0.00");
        //   hotRef?.current?.hotInstance?.setDataAtCell(row, 4, "0.00");

        // }
          const row1 = parseFloat(
            paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(2, 2)
          );
          const row2 = parseFloat(
            paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(2, 3)
          );const row3 = parseFloat(
            paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(2, 4)
          );
          const intersetPayRow = parseFloat(
            paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(2, 5)
          );
          const utilizationCash = parseFloat(
            cashLedgerHotRef?.current?.hotInstance?.getDataAtCell(0, 2)
          );
          const A = parseFloat(initialValue) + parseFloat(row1) - parseFloat(row2) - parseFloat(row3);
          const B = A + intersetPayRow;

          if(B <=  utilizationCash){
            if (!isNaN(B)) {
              paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(2, 8, B.toFixed(2));
              paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(2, 9, "0.00");
            }
          }
          else if(B > utilizationCash){
            const addCashReq = parseFloat(B) - parseFloat(utilizationCash);
            if (!isNaN(addCashReq)) {
              paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(2, 8, utilizationCash.toFixed(2));
              paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(2, 9, addCashReq.toFixed(2));
            }
          }

          if (!isNaN(A)) {
            paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(2, 6, A.toFixed(2));
            // paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(2, 9, B.toFixed(2));
          }
        }

        if (row === 2 && col == "taxPayableOther") {

          const row0 = parseFloat(
            paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(2, 1)
          );

          const initialValue = !Number.isNaN(
            parseFloat(paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(row, 2))
          )
            ? paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(row, 2)
            : paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(row, 2, "0.00");
            console.log(initialValue,"initialValueinitialValue")
        // if(change?.length > 0){
        //   hotRef?.current?.hotInstance?.setDataAtCell(row, 3, "0.00");
        //   hotRef?.current?.hotInstance?.setDataAtCell(row, 4, "0.00");

        // }

          const row2 = parseFloat(
            paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(2, 3)
          );const row3 = parseFloat(
            paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(2, 4)
          );
          const intersetPayRow = parseFloat(
            paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(2, 5)
          );
          const utilizationCash = parseFloat(
            cashLedgerHotRef?.current?.hotInstance?.getDataAtCell(0, 2)
          );
          const A =  parseFloat(row0) +  parseFloat(initialValue)  - parseFloat(row2) - parseFloat(row3);
          const B = A + intersetPayRow;
          if(B <=  utilizationCash){
            if (!isNaN(B)) {
              paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(2, 8, B.toFixed(2));
              paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(2, 9, "0.00");
            }
          }
          else if(B > utilizationCash){
            const addCashReq = parseFloat(B) - parseFloat(utilizationCash);
            if (!isNaN(addCashReq)) {
              paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(2, 8, utilizationCash.toFixed(2));
              paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(2, 9, addCashReq.toFixed(2));
            }
          }

          if (!isNaN(A)) {
            paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(2, 6, A.toFixed(2));
            // paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(2, 9, B.toFixed(2));
          }
        }

        if (row === 2 && col == "adjustmentReverseCharge") {

          const row0 = parseFloat(
            paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(2, 1)
          );

          const row1 = parseFloat(
            paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(2, 2)
          );

          const initialValue = !Number.isNaN(
            parseFloat(paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(row, 3))
          )
            ? paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(row, 3)
            : paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(row, 3, "0.00");
            console.log(initialValue,"initialValueinitialValue")
        // if(change?.length > 0){
        //   hotRef?.current?.hotInstance?.setDataAtCell(row, 3, "0.00");
        //   hotRef?.current?.hotInstance?.setDataAtCell(row, 4, "0.00");

        // }


          const row3 = parseFloat(
            paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(2, 4)
          );
          const intersetPayRow = parseFloat(
            paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(2, 5)
          );
          const utilizationCash = parseFloat(
            cashLedgerHotRef?.current?.hotInstance?.getDataAtCell(0,2)
          );
          const A =  parseFloat(row0) +  parseFloat(row1)  - parseFloat(initialValue) - parseFloat(row3);
          const B = A + intersetPayRow;

          if(B <=  utilizationCash){
            if (!isNaN(B)) {
              paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(2, 8, B.toFixed(2));
              paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(2, 9, "0.00");
            }
          }
          else if(B > utilizationCash){
            const addCashReq = parseFloat(B) - parseFloat(utilizationCash);
            if (!isNaN(addCashReq)) {
              paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(2, 8, utilizationCash.toFixed(2));
              paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(2, 9, addCashReq.toFixed(2));
            }
          }

          if (!isNaN(A)) {
            paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(2, 6, A.toFixed(2));
            // paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(2, 9, B.toFixed(2));
          }
        }

        if (row === 2 && col == "adjustmentOther") {

          const row0 = parseFloat(
            paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(2, 1)
          );

          const row1 = parseFloat(
            paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(2, 2)
          );

          const row2 = parseFloat(
            paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(2, 3)
          );

          const initialValue = !Number.isNaN(
            parseFloat(paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(row, 4))
          )
            ? paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(row, 4)
            : paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(row, 4, "0.00");
          const intersetPayRow = parseFloat(
              paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(2, 5)
            );
            const utilizationCash = parseFloat(
              cashLedgerHotRef?.current?.hotInstance?.getDataAtCell(0, 2)
            );
        // if(change?.length > 0){
        //   hotRef?.current?.hotInstance?.setDataAtCell(row, 3, "0.00");
        //   hotRef?.current?.hotInstance?.setDataAtCell(row, 4, "0.00");

        // }

          const A =  parseFloat(row0) +  parseFloat(row1)  - parseFloat(row2) - parseFloat(initialValue);
          const B = A + intersetPayRow;

          if(B <=  utilizationCash){
            if (!isNaN(B)) {
              paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(2, 8, B.toFixed(2));
              paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(2, 9, "0.00");
            }
          }
          else if(B > utilizationCash){
            const addCashReq = parseFloat(B) - parseFloat(utilizationCash);
            if (!isNaN(addCashReq)) {
              paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(2, 8, utilizationCash.toFixed(2));
              paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(2, 9, addCashReq.toFixed(2));
            }
          }
          if (!isNaN(A)) {
            paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(2, 6, A.toFixed(2));
            // paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(2, 9, B.toFixed(2));
          }
        }
// Row 4 *******************************************************************************************************************


        if (row === 3 && col == "taxPayableReverseCharge") {
          const initialValue = !Number.isNaN(
            parseFloat(paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(row, 1))
          )
            ? paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(row, 1)
            : paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(row, 1, "0.00");
            console.log(initialValue,"initialValueinitialValue")
        // if(change?.length > 0){
        //   hotRef?.current?.hotInstance?.setDataAtCell(row, 3, "0.00");
        //   hotRef?.current?.hotInstance?.setDataAtCell(row, 4, "0.00");

        // }
          const row1 = parseFloat(
            paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(3, 2)
          );
          const row2 = parseFloat(
            paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(3, 3)
          );const row3 = parseFloat(
            paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(3, 4)
          );
          const intersetPayRow = parseFloat(
            paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(3, 5)
          );
          const utilizationCash = parseFloat(
            cashLedgerHotRef?.current?.hotInstance?.getDataAtCell(0, 3)
          );
          const A = parseFloat(initialValue) + parseFloat(row1) - parseFloat(row2) - parseFloat(row3);
          const B = A + intersetPayRow;

          if(B <=  utilizationCash){
            if (!isNaN(B)) {
              paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(3, 8, B.toFixed(2));
              paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(3, 9, "0.00");
            }
          }
          else if(B > utilizationCash){
            const addCashReq = parseFloat(B) - parseFloat(utilizationCash);
            if (!isNaN(addCashReq)) {
              paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(3, 8, utilizationCash.toFixed(2));
              paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(3, 9, addCashReq.toFixed(2));
            }
          }

          if (!isNaN(A)) {
            paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(3, 6, A.toFixed(2));
            // paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(3, 9, B.toFixed(2));

          }
        }

        if (row === 3 && col == "taxPayableOther") {

          const row0 = parseFloat(
            paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(3, 1)
          );

          const initialValue = !Number.isNaN(
            parseFloat(paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(row, 2))
          )
            ? paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(row, 2)
            : paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(row, 2, "0.00");
            console.log(initialValue,"initialValueinitialValue")
        // if(change?.length > 0){
        //   hotRef?.current?.hotInstance?.setDataAtCell(row, 3, "0.00");
        //   hotRef?.current?.hotInstance?.setDataAtCell(row, 4, "0.00");

        // }

          const row2 = parseFloat(
            paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(3, 3)
          );const row3 = parseFloat(
            paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(3, 4)
          );
          const intersetPayRow = parseFloat(
            paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(3, 5)
          );
          const utilizationCash = parseFloat(
            cashLedgerHotRef?.current?.hotInstance?.getDataAtCell(0, 3)
          );
          const A =  parseFloat(row0) +  parseFloat(initialValue)  - parseFloat(row2) - parseFloat(row3);
          const B = A + intersetPayRow;

          if(B <=  utilizationCash){
            if (!isNaN(B)) {
              paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(3, 8, B.toFixed(2));
              paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(3, 9, "0.00");
            }
          }
          else if(B > utilizationCash){
            const addCashReq = parseFloat(B) - parseFloat(utilizationCash);
            if (!isNaN(addCashReq)) {
              paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(3, 8, utilizationCash.toFixed(2));
              paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(3, 9, addCashReq.toFixed(2));
            }
          }
          if (!isNaN(A)) {
            paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(3, 6, A.toFixed(2));
            // paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(3, 9, B.toFixed(2));
          }
        }

        if (row === 3 && col == "adjustmentReverseCharge") {

          const row0 = parseFloat(
            paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(3, 1)
          );

          const row1 = parseFloat(
            paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(3, 2)
          );

          const initialValue = !Number.isNaN(
            parseFloat(paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(row, 3))
          )
            ? paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(row, 3)
            : paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(row, 3, "0.00");
            console.log(initialValue,"initialValueinitialValue")
        // if(change?.length > 0){
        //   hotRef?.current?.hotInstance?.setDataAtCell(row, 3, "0.00");
        //   hotRef?.current?.hotInstance?.setDataAtCell(row, 4, "0.00");

        // }


          const row3 = parseFloat(
            paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(3, 4)
          );
          const intersetPayRow = parseFloat(
            paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(3, 5)
          );
          const utilizationCash = parseFloat(
            cashLedgerHotRef?.current?.hotInstance?.getDataAtCell(0, 3)
          );
          const A =  parseFloat(row0) +  parseFloat(row1)  - parseFloat(initialValue) - parseFloat(row3);
          const B = A + intersetPayRow;

          if(B <=  utilizationCash){
            if (!isNaN(B)) {
              paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(3, 8, B.toFixed(2));
              paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(3, 9, "0.00");
            }
          }
          else if(B > utilizationCash){
            const addCashReq = parseFloat(B) - parseFloat(utilizationCash);
            if (!isNaN(addCashReq)) {
              paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(3, 8, utilizationCash.toFixed(2));
              paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(3, 9, addCashReq.toFixed(2));
            }
          }

          if (!isNaN(A)) {
            paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(3, 6, A.toFixed(2));
            // paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(3, 9, B.toFixed(2));
          }
        }

        if (row === 3 && col == "adjustmentOther") {

          const row0 = parseFloat(
            paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(3, 1)
          );

          const row1 = parseFloat(
            paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(3, 2)
          );

          const row2 = parseFloat(
            paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(3, 3)
          );

          const initialValue = !Number.isNaN(
            parseFloat(paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(row, 4))
          )
            ? paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(row, 4)
            : paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(row, 4, "0.00");
            console.log(initialValue,"initialValueinitialValue");

            const intersetPayRow = parseFloat(
              paymentOfTaxHotRef?.current?.hotInstance?.getDataAtCell(3, 5)
            );
            const utilizationCash = parseFloat(
              cashLedgerHotRef?.current?.hotInstance?.getDataAtCell(0, 3)
            );
        // if(change?.length > 0){
        //   hotRef?.current?.hotInstance?.setDataAtCell(row, 3, "0.00");
        //   hotRef?.current?.hotInstance?.setDataAtCell(row, 4, "0.00");

        // }

          const A =  parseFloat(row0) +  parseFloat(row1)  - parseFloat(row2) - parseFloat(initialValue);
          const B = A + intersetPayRow;

          if(B <=  utilizationCash){
            if (!isNaN(B)) {
              paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(3, 8, B.toFixed(2));
              paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(3, 9, "0.00");
            }
          }
          else if(B > utilizationCash){
            const addCashReq = parseFloat(B) - parseFloat(utilizationCash);
            if (!isNaN(addCashReq)) {
              paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(3, 8, utilizationCash.toFixed(2));
              paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(3, 9, addCashReq.toFixed(2));
            }
          }

          if (!isNaN(A)) {
            paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(3, 6, A.toFixed(2));
            // paymentOfTaxHotRef?.current?.hotInstance?.setDataAtCell(3, 9, B.toFixed(2));
          }
        }

      }
    }

  };

  const onClickGetCashLedgerData = () => {
    setBlock(true);
    CMP08Service.getCashLedgerData(
      String(G_UCParId),
      finFromYear?.value,
      UserId,
      G_GSTIN,
      subId
      )
      .then((res) => {

        if (res.data.status === errorCodeConfig.APIDefaultCode.GovtOTPExpire) {
          console.log("true")
          setMsgDisplay(res?.data?.errorMessage)
          setBlock(false);
          // loadFunction(false);
          setComposeOpen(true)
        }
        else {
          if (
            res.status === 200 &&
            res.data.status === errorCodeConfig.APIDefaultCode.Success
          ) {
            // setSaveThenSearch(false);
            setCashLedgerData(res?.data?.data?.cashLedgerDetails)
            setBlock(false);
            console.log(res?.data?.data?.cashLedgerDetails, "res?.data?.data")

          } else {
            setBlock(false);
            toast.error(res?.data?.errorMessage, {
              position: "top-right",
            });
          }
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
  }

  return (
    <Fragment>
      {block && <div className="loading1">Loading&#8230;</div>}
      <VerificationModal
        composeOpen={composeOpen}
        toggleCompose={toggleCompose1}
        userClientIds={G_UCParId}
        messageDisplay={msgDisplay}
      ></VerificationModal>
      <div className="content-header-left col-md-12 col-12">
        <div className="row breadcrumbs-top mb-1">
          <div className="col-md-6"></div>
          <div className="col-md-6">
            <div className="row">
              <div className="col-md-12">
                <div className="row">
                  <div className="col-md-2 "></div>
                  <Label className="form-label col-md-4 pt-half text-end">
                    Return Period
                  </Label>
                  <Select
                    id="from"
                    placeholder="From"
                    isClearable={false}
                    theme={selectThemeColors}
                    closeMenuOnSelect={true}
                    options={panDataFrom}
                    className="basic-multi-select col-md-6"
                    classNamePrefix="select"
                    components={animatedComponents}
                    onChange={selectFromYear}
                    value={finFromYear}
                    maxMenuHeight={SELECT_MAXSIZE}
                    isDisabled={true}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-12 ">
        <Row>
          <div>
            <style>{`.gstr3bHeading{font-size: 14px !important; font-weight:bold}`}</style>
            <h2 className="gstr3bHeading">Invoice Details</h2>
          </div>
          <Col md={12}>
            <HotTable
              autoWrapRow={true}
              data={cmp08Data}
              autoColumnSize={true}
              afterGetColHeader={theader}
              rowHeights={RowSize}
              maxRows={defaultInvoiceData?.length}
              columnHeaderHeight={columnHeaderSize}
              stretchH="all"
              preventOverflow="horizontal"
              mergeCells={false}
              columns={invoiceDetailsColumns}
              contextMenu={false}
              bindRowsWithHeaders={true}
              licenseKey="non-commercial-and-evaluation"
              height="auto"
              ref={hotRef}
              cells={function (row, col) {
                var cp = {};
                const hot = hotRef?.current?.hotInstance;
                cp.className = "child";

                if (defaultInvoiceData?.length > 0) {
                  if (col > 0) {
                    cp.className = "text-end";
                  } else {
                    cp.className = "no-pointer";
                  }
                  if (col === 4 || row === 2) {
                    cp.className += " purchseCellDisable";
                  }

                  if (row === 0 && (col === 2 || col === 5)) {
                    cp.className += " purchseCellDisable";
                  }

                  if (row === 3 && col === 1) {
                    cp.className += " purchseCellDisable";
                  }

                  if (
                    cp?.className?.includes("purchseCellDisable") ||
                    col === 0
                  ) {
                    cp.readOnly = true;
                  } else {
                    cp.readOnly = false;
                  }
                }

                return cp;
              }}
              afterChange={(x, y) => cellChangeSubDetails(x, y)}
            />
          </Col>
        </Row>
      </div>
      <div className="col-12 mt-3">

      <div className="d-flex justify-content-between align-items-center mt-3 mb-1">
      <style>{`.gstr3bHeading{font-size: 14px !important; font-weight:bold}`}</style>
            <h2 className="gstr3bHeading">Cash Ledger</h2>
            <Button
              className="btn-icon"
              outline
              color="danger"
              onClick={onClickGetCashLedgerData}
            >
              <Download size={14} />
              <span className="align-middle ms-50">
                {" "}
                Get Data
              </span>
            </Button>
          </div>

        <Row>
          {/* <div>
            <style>{`.gstr3bHeading{font-size: 14px !important; font-weight:bold}`}</style>
            <h2 className="gstr3bHeading">Cash Ledger</h2>
          </div> */}
          <Col md={12}>
            <HotTable
              autoWrapRow={true}
              data={cashLedgerData}
              autoColumnSize={true}
              afterGetColHeader={cashLedgerTheader}
              rowHeights={RowSize}
              maxRows={defaultCashLedgerData?.length}
              columnHeaderHeight={columnHeaderSize}
              stretchH="all"
              preventOverflow="horizontal"
              columns={cashLedgerColumns}
              contextMenu={false}
              bindRowsWithHeaders={true}
              licenseKey="non-commercial-and-evaluation"
              height="auto"
              ref={cashLedgerHotRef}
            />
          </Col>
        </Row>
      </div>
      <div className="col-12 mt-3">
        <Row>
          <div>
            <style>{`.gstr3bHeading{font-size: 14px !important; font-weight:bold}`}</style>
            <h2 className="gstr3bHeading">Payment of Tax</h2>
          </div>
          <Col md={12}>
            {console.log(taxData,"taxDatttaa")}
            <HotTable
              data={taxData}
              rowHeights={RowSize}
              maxRows={defaultPaymentOfTaxData?.length}
              columnHeaderHeight={columnHeaderSize}
              stretchH="all"
              preventOverflow="horizontal"
              autoColumnSize={true}
              colHeaders={true}
              height="auto"
              ref={paymentOfTaxHotRef}
              cells={function (row, col) {
                var cp = {};
                const hot = paymentOfTaxHotRef?.current?.hotInstance;
                cp.className = "child";

                if (col > 0) {
                  cp.className = "text-end";
                  cp.readOnly = false;
                } else {
                  cp.className = "no-pointer";
                  cp.readOnly = true;
                }

                if(col > 5){
                  cp.className = "purchseCellDisable"
                  cp.readOnly = true;
                }

                return cp;
              }}
              colWidths={[120]}
              afterChange={(x, y) => cellChangePaymentOfTax(x, y)}
              wordWrap={true}
              afterGetColHeader={paymentOfTaxTheader}
              nestedHeaders={nestedPaymentOfTaxColumns}
              autoWrapRow={true}
              autoWrapCol={true}
              licenseKey="non-commercial-and-evaluation"
              bindRowsWithHeaders={true}
              columns={paymentOfTaxColumns}
              // colWidths={[50, 120, 120, 120, 120, 120, 100, 120, 50]}
              contextMenu={false}
            />
          </Col>
        </Row>
      </div>
      {deleteModalshow && (
        <DeleteModelCMP08
          Heading="Delete CMP 08 Summary"
          SuccessButtonText="Delete"
          show={deleteModalshow}
          toggleCompose={toggleCompose}
          CMP08SummaryServiceCall={CMP08SummaryServiceCall}
          gstr3BToDt={gstr3BToDt}
          Company_GSTIN={G_GSTIN}
          deleteType={deleteType}
        ></DeleteModelCMP08>
      )}
    </Fragment>
  );
};

export default CmpSalesSummary;
