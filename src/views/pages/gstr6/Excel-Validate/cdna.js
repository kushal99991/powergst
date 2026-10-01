import React, { Fragment, useState, useEffect, forwardRef, Component, FC, useRef } from "react"
import { HotTable, HotColumn } from "@handsontable/react";
import { Row, Col, Button } from "reactstrap";
import { getFailed, getDuplicate } from "./store";
import { registerAllModules } from 'handsontable/registry';
import { useDispatch, useSelector } from 'react-redux'
// ** Styles
import Swal from 'sweetalert2'
import '@styles/react/libs/flatpickr/flatpickr.scss';
import LocalFunction from '@configs/getLocalFunction';
import { globleVariable } from "@configs/globalVariable";
import ReactPaginate from 'react-paginate';
import gstr6PurchaseInvoice from "../../../../services/gstr6/gstr6PurchaseInvoice";
import { PageSize, RowSize, columnHeaderSize } from "../../../../configs/config";
import Handsontable from "handsontable";
import moment from "moment";
import { handleValidateExcel, validationErrorMessage } from "../../../../helper/validation";

registerAllModules();

let isActive = false;

const serverDateTime = localStorage.getItem(globleVariable.serverDateTime) && LocalFunction.getLocalValue(globleVariable.serverDateTime, true);
const maxDate = JSON.parse(serverDateTime).toString().split("T")[0];
const maxShowDate = new Date(maxDate);


//** button - Action column
function myLables(instance, td, row, col, prop, value, cellProperties) {
    Handsontable.renderers.TextRenderer.apply(this, arguments);
    td.innerHTML = `<div class="truncated">${value !== null && value !== "" ? value : ""}</div>`
}

const invalidColumns = [

    // 0
    { data: "isActive", type: "checkbox", readOnly: false, width: 25 },

    // 1
    {
        data: 'SrNo',
        title: "Sr No.",
        // width: 80,
    },

    // 2
    {
        data: 'ErrorMessage',
        title: "Error",
        readOnly: true,
        width: 300,

    },

    // 3
    {
        data: "OriginalSupplierGSTIN", title: "Original Supplier GSTIN",
        columnSorting: {
            indicator: false,
            headerAction: false,
        },
        // width:"150"
    },



    // 4
    {
        data: "OriginalInvoiceNumber", title: "Original Document Number",
        columnSorting: {
            indicator: false,
            headerAction: false,
        },
        // width:"170"

    },



    // 5
    {
        data: "OriginalInvoiceDateLabel", title: "Original Document Date",
        type: 'date',
        dateFormat: 'DD-MM-YYYY',
        correctFormat: true,
        className: "htAutocomplete",
        allowInvalid: false,
        datePickerConfig: {
            firstDay: 0,
            showWeekNumber: false,
            numberOfMonths: 1,
            licenseKey: 'non-commercial-and-evaluation',
            minDate: new Date('2017-07-01'),
            bound: true,
            defaultDate: maxShowDate,
            maxDate: maxShowDate,
            class: "htAutocompleteArrow",
        }

    },


    // 6
    {
        data: "SupplierGSTIN", title: "Supplier GSTIN",
        columnSorting: {
            indicator: false,
            headerAction: false,
        },
        // width:"150"

    },



    // 7
    {
        data: "NoteType", title: "Note Type",
        columnSorting: {
            indicator: false,
            headerAction: false,
        },
        // width:"150"

    },


    // 8
    {
        data: "RevisedNoteNumber", title: "Revised Note Number",
        columnSorting: {
            indicator: false,
            headerAction: false,
        },
        // width:"150"

    },


    // 9
    {
        data: "RevisedNoteDateLabel", title: "Revised Note Date",
        type: 'date',
        dateFormat: 'DD-MM-YYYY',
        correctFormat: true,
        className: "htAutocomplete",
        allowInvalid: false,
        datePickerConfig: {
            firstDay: 0,
            showWeekNumber: false,
            numberOfMonths: 1,
            licenseKey: 'non-commercial-and-evaluation',
            minDate: new Date('2017-07-01'),
            bound: true,
            defaultDate: maxShowDate,
            maxDate: maxShowDate,
            class: "htAutocompleteArrow",
        }

    },



    // 10
    {
        data: "RevisedInvoiceValue", title: "Revised Invoice Value (₹)",
        columnSorting: {
            indicator: false,
            headerAction: false,
        },
        // width:"150",
        type: "numeric",
        numericFormat: {
            pattern: '0,0.00',
            culture: 'en-IN'
        },
    },



    // 11
    {
        data: "OriginalInvoiceofCreditNote", title: "Original Invoice No",
        columnSorting: {
            indicator: false,
            headerAction: false,
        },
        width: "150"

    },


    // 12
    {
        data: "OriginalInvoiceDateLabel", title: "Original Invoice Date",
        type: 'date',
        dateFormat: 'DD-MM-YYYY',
        correctFormat: true,
        className: "htAutocomplete",
        allowInvalid: false,
        datePickerConfig: {
            firstDay: 0,
            showWeekNumber: false,
            numberOfMonths: 1,
            licenseKey: 'non-commercial-and-evaluation',
            minDate: new Date('2017-07-01'),
            bound: true,
            defaultDate: maxShowDate,
            maxDate: maxShowDate,
            class: "htAutocompleteArrow",
        }
    },


    // 13
    {
        data: "PlaceOfSupply", title: "Place of Supply",
        columnSorting: {
            indicator: false,
            headerAction: false,
        },
        width: "150"

    },


    // 14
    {
        data: "SupplyType", title: "Supply Type",
        columnSorting: {
            indicator: false,
            headerAction: false,
        },
        width: "150"
    },


    // 15
    {
        data: "Rate", title: "Rate",
        columnSorting: {
            indicator: false,
            headerAction: false,
        },
        width: "150"


    },

    // 16
    {
        data: "TaxableValue", title: "Taxable Value (₹)",
        columnSorting: {
            indicator: false,
            headerAction: false,
        },
        width: "150",
        type: "numeric",
        numericFormat: {
            pattern: '0,0.00',
            culture: 'en-IN'
        },

    },


    // 17
    {
        data: "IGST", title: "Integrated Tax (₹)",
        columnSorting: {
            indicator: false,
            headerAction: false,
        },
        width: "150",
        type: "numeric",
        numericFormat: {
            pattern: '0,0.00',
            culture: 'en-IN'
        },
    },


    // 18
    {
        data: "CGST", title: "Central Tax (₹)",
        columnSorting: {
            indicator: false,
            headerAction: false,
        },
        width: "150",
        type: "numeric",
        numericFormat: {
            pattern: '0,0.00',
            culture: 'en-IN'
        },
    },

    // 19
    {
        data: "SGST", title: "State/UT Tax (₹)",
        columnSorting: {
            indicator: false,
            headerAction: false,
        },
        width: "150"

    },


    // 20
    {
        data: "CESS", title: "CESS (₹)",
        columnSorting: {
            indicator: false,
            headerAction: false,
        },
        width: "150",
        type: "numeric",
        numericFormat: {
            pattern: '0,0.00',
            culture: 'en-IN'
        },
    },

    // 21
    {
        data: "FilingSstatusofGSTR1of5", title: "Filing Status of GSTR1/5",
        columnSorting: {
            indicator: false,
            headerAction: false,
        },
        width: "160"

    },

    // 22
    {
        data: "InvoiceStatus", title: "Invoice Status",
        columnSorting: {
            indicator: false,
            headerAction: false,
        },
        width: "150"

    },

    // 23
    {
        data: "Action", title: "Action",
        columnSorting: {
            indicator: false,
            headerAction: false,
        },
        width: "150"

    },

]


const cdnaValidate = ({ data, btnType, tabRecord, activeTab, clearFilter, errorArr, setErrorArr }) => {


    const [invalidaDatarows, setvalidaDatarows] = useState([]);
    const [block1, setBlock1] = useState(false);
    const [page, setPage] = useState(0);
    const [currentCol, setCurrentCol] = useState([]);
    const [currentCol1, setCurrentCol1] = useState();
    const [searchVal1, setSearchVal1] = useState([]);
    const [pageCount, setPageCount] = useState(1);
    const dispatch = useDispatch()
    const [pageSize, setPageSize] = useState(PageSize);
    const store = useSelector(state => state.gstr6ExcelData);
    const [searchDate, setSearchDate] = useState('');
    const [searchDate1, setSearchDate1] = useState('');
    const [searchDate2, setSearchDate2] = useState('');
    const storeGSTR6 = useSelector(state => state.excelData?.GSTR6_EXCEL_VALIDATE);

    let arrFilter = [];
    let cdnaDup = [];
    let allDataDuplicate = [];
    if (store?.duplicateData?.length) {
        for (let item of store?.duplicateData) {
            if (item.sheetName?.toLowerCase() == "cdna") {

                cdnaDup.push(item.data)
            } else {
                allDataDuplicate.push(item)
            }
        }
    }
    const cdnaDuplicateData = cdnaDup.length ? cdnaDup[0] : [];

    let cdnaFail = []
    let allDataFailed = [];

    useEffect(() => {
        return () => setBlock1(false)
    }, [])

    if (store?.failedData?.length) {
        for (let item of store?.failedData) {
            if (item.sheetName?.toLowerCase() == "cdna") {

                cdnaFail.push(item.data)
            } else {
                allDataFailed.push(item)
            }
        }
    }
    let cdnaFailedData = cdnaFail.length ? cdnaFail[0] : [];

    const handlePageClick = (event) => {
        setPage(event?.selected);

    };


    const hotRef = useRef(null);
    const hotRef2 = useRef(null);

    const sheetData = (i = "cdna") => {
        const failedIndex = data?.failedData?.findIndex((item) => item?.sheetName?.toLowerCase() == i);

        return data?.failedData?.[failedIndex]
    }

    const sheetName = sheetData()?.sheetName;
    const GUID = sheetData()?.guid;
    const sheetId = sheetData()?.sheetId;


    const loadb2 = () => {

        // setBlock1(true);
        const payloadSheet = {
            "sheetName": sheetName,
            "guid": GUID,
            // "status": status,
            "pageNumber": page + 1,
            "pageSize": pageSize,
            "sheetId": sheetId,
            "orderByColumnName": "",
            "orderBy": "",
            "searchColumnName": currentCol,
            "searchValue": searchVal1
        }
        if (data !== null) {


            if (btnType == 'btnInvalidData') {
                payloadSheet.status = 0;
                if (store?.GSTR6_EXCEL_VALIDATE?.length > 0 ) {
                    const arrError1 =store?.GSTR6_EXCEL_VALIDATE[0].CDNA.map((item) => {
                        return {
                            ...item,
                            writable: true,
                        }
                    })
                    const arrError2 = cdnaFailedData;
                    const arrError = arrError1.map(obj => arrError2.find(o => o.RowGUIDReact === obj.RowGUIDReact
                        && o.Gstr6DetailId === obj.Gstr6DetailId) || obj);
                    setvalidaDatarows(JSON.parse(JSON.stringify(arrError)))
                    tabRecord(arrError1?.length, sheetName, sheetId, status)
                }else{
                    setvalidaDatarows([]);
                    tabRecord(0, sheetName, sheetId, status);
                }

            } else if (btnType == 'btnValidData') {
                payloadSheet.status = 1;
                if (store?.GSTR6_EXCEL_VALIDATE?.length > 0 ) {
                    tabRecord(store?.GSTR6_EXCEL_VALIDATE[0].CDNA?.length, sheetName, sheetId, status)
                    setvalidaDatarows(store?.GSTR6_EXCEL_VALIDATE[0].CDNA)
                }else{
                    setvalidaDatarows([]);
                    tabRecord(0, sheetName, sheetId, status);
                }

            } else {
                payloadSheet.status = 2;
                if (store?.GSTR6_EXCEL_VALIDATE?.length > 0 ) {
                    const arrDuplicate1 = store?.GSTR6_EXCEL_VALIDATE[0].CDNA.map((item) => {
                        return {
                            ...item,
                            writable: true,
                        }
                    })
                    const arrDuplicate2 = cdnaDuplicateData;
                    const arrDuplicate = arrDuplicate1.map(obj => arrDuplicate2?.find(o => o.RowGUIDReact === obj.RowGUIDReact) || obj);
                    tabRecord(arrDuplicate2?.length, sheetName, sheetId, status);
                    setvalidaDatarows(arrDuplicate ? arrDuplicate : arrDuplicate1)
                }else{
                    setvalidaDatarows([]);
                    tabRecord(0, sheetName, sheetId, status);
                }

            }

        }
    }

    useEffect(() => {

        if (activeTab == 3) {
            loadb2();
        }

        isActive = false;
        dispatch(getDuplicate([]));;
    }, [btnType,  activeTab])

    useEffect(() => {

        setSearchVal1([]);
        setCurrentCol([])
        loadb2()
    }, [clearFilter])


    useEffect(() => {
        loadb2()
        if(store == undefined){
            setBlock1(true)
            loadb2()
        }
        else{
            setBlock1(false)
        }
    },[storeGSTR6])


    const theader = (col, TH) => {
        if (col == 0 || col == 2) {
            const button = TH.children[0].children[0];
            button.parentNode.removeChild(button);
        }

        if (col == 10 || col == 12 || col == 15 || col == 16 || col == 17 || col == 18 || col == 19 || col == 20) {

            TH.className = 'htRight'
        }
        else {
            TH.className = 'htLeft'
        }



    }

    const cellChange = (change, source) => {

        if (source === 'CopyPaste.paste' || source === 'edit' || source === 'Autofill.fill') {

            const hot = hotRef?.current?.hotInstance;

            let withoutErrArr = []
            for (let i = 0; i < change.length; i++) {
                const [row, col, , value] = change[i]; // Get the edited cell value
                const colIndex = invalidColumns.findIndex((obj) => obj.data === col)
                let cellObj = {
                    row: row,
                    col: colIndex,
                    tab: activeTab,
                    validationMsg: 'Error In Cell.',
                    colName:invalidColumns[colIndex],
                    page:page
                }
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
                if (colIndex == 4 || colIndex == 8 || colIndex == 10 || colIndex == 11 || colIndex == 12 || colIndex == 15 || colIndex == 16 || colIndex == 17 || colIndex == 18 || colIndex == 19 || colIndex == 20) {

                    const oldVal = change[i][2]
                    if (isNaN(value) && (colIndex !== 4 && colIndex !== 11 && colIndex !== 8) && value !== '') {
                        cellObj.validationMsg = "Only Numeric Value Allowed"
                        setErrorArr(pre => [...pre, cellObj])
                    }
                    else if (!(/^[a-zA-Z0-9\/\-]+$/.test(value)) && value !== '' && (colIndex === 4 || colIndex === 11)) {
                        cellObj.validationMsg = "Only AlphaNumeric value allowed"
                        setErrorArr(pre => [...pre, cellObj])
                    }
                    else {
                        if (errorArr.findIndex(y => y.row == cellObj.row && y.col == cellObj.col && y.tab == cellObj.tab) != -1) {
                            withoutErrArr.push(cellObj)
                        }
                    }

                }

            }
            if (withoutErrArr.length > 0) {
                const withErrArr = errorArr
                const filteredArr = withErrArr.filter(itemX => !withoutErrArr.some(itemY =>
                    itemY.row === itemX.row && itemY.col === itemX.col && itemY.tab === itemX.tab && 
                    itemY.page === itemX.page
                ));
                setErrorArr(filteredArr)
            }
        }

        console.log("change paste=", change);

        let y;

        var newPayloadFail = cdnaFailedData;

        for (let i = 0; btnType == "btnInvalidData" ? i <= change?.length : i < change?.length; i++) {
            console.log("time by value duplicate index=", change[i]?.[0])
            y = gridData[change[i]?.[0]]
            if (y) {
                console.log("y=", y, change)
                if (btnType == "btnInvalidData") {
                    console.log("change paste2=", y);

                    const failedIndex = newPayloadFail?.findIndex((item) => item?.RowGUIDReact == y?.RowGUIDReact);
                    console.log("duplicate index=", failedIndex, newPayloadFail, allDataFailed);
                    console.log("1duplicate index=", newPayloadFail?.RowGUIDReact, y?.RowGUIDReact)

                    if (failedIndex != -1) {
                        console.log("duplicate index=", failedIndex, newPayloadFail);
                        const k1 = JSON.parse(JSON.stringify(newPayloadFail));
                        let k2 = JSON.parse(JSON.stringify(y))
                        k1[failedIndex] = k2;
                        newPayloadFail = [...JSON.parse(JSON.stringify(k1))]
                    } else {
                        let xRef = JSON.parse(JSON.stringify(y))
                        console.log("new xref=", xRef)
                        newPayloadFail = [...newPayloadFail, xRef]
                        console.log("new payload= duplicate index=", newPayloadFail);
                    }
                    let matchingElements = invalidaDatarows.filter((item) => {
                        return newPayloadFail.find((item2) => item2.RowGUIDReact == item.RowGUIDReact)
                    })
                    // newPayloadFail = matchingElements
                    newPayloadFail = [...JSON.parse(JSON.stringify(matchingElements))]
                    console.log(matchingElements, 'matchingElements222')

                    const payload = [{
                        sheetId: sheetId,
                        sheetName: sheetName,
                        guid: GUID,
                        totalRecords: newPayloadFail.length?.toString(),
                        data: newPayloadFail
                    }, ...allDataFailed]
                    console.log("time payload= duplicate index=", payload);
                    dispatch(getFailed(payload));

                } else {

                    const k = invalidaDatarows;
                    let newK = []
                    k?.map((item, index) => {
                        if (item?.isActive) {
                            newK.push(item)
                        }
                    })
                    console.log("newk=", newK)

                    const payload = [{
                        sheetId: sheetId,
                        sheetName: sheetName,
                        guid: GUID,
                        data: JSON.parse(JSON.stringify(newK)),
                        totalRecords: JSON.parse(JSON.stringify(newK)).length?.toString(),
                    }, ...allDataDuplicate]
                    // dispatch(getFailed(payload.sheetId, payload.sheetName, payload.guid, payload.data));
                    dispatch(getDuplicate(payload))
                }
            }
            console.log("time by value1", y);
        }

        console.log("time by value2", y);

    }

    function localAfterOnCellMouseDown(event, coords, td) {
        setCurrentCol1(coords?.col);
        const Index = currentCol?.findIndex((item) => invalidColumns[coords?.col]?.data == item);

        if (Index != -1) {
            setTimeout(function () {
                var searchInput = document?.querySelector('.htUIMultipleSelectSearch.htUIInput');
                if (searchInput !== null) {
                    searchInput.children[0].value = searchVal1[Index]
                }

            }, 200)
        } else {
            setTimeout(function () {
                var searchInput = document?.querySelector('.htUIMultipleSelectSearch.htUIInput');        // searchInput.children[0].innerHTML ="hii1"
                if (searchInput !== null) {
                    searchInput.children[0].value = ""
                }

            }, 100)
        }
        if ((coords.col != 22 || coords.col != 23) && btnType != "btnInvalidData") {     // added if condition for chechking and return with else empty

            const hot = hotRef?.current?.hotInstance;
            const totalRows = hot.countRows();
            if (event.target.classList.contains('checker')) {
                event.stopPropagation()
                setBlock1(true);

                if (!isActive) {
                    event.stopPropagation();
                    isActive = true;

                    setTimeout(() => {
                        for (let index = 0; index < totalRows; index++) {
                            console.log("total counts cdna", totalRows, index);
                            hot.setDataAtCell(index, 0, true);
                            (index == totalRows - 1) ? setBlock1(false) : "";
                        }
                    }, 50);

                } else {
                    event.stopPropagation();
                    isActive = false;

                    setTimeout(() => {
                        for (let index = 0; index < totalRows; index++) {
                            console.log("total counts cdna", totalRows, index);
                            hot.setDataAtCell(index, 0, false);
                            (index == totalRows - 1) ? setBlock1(false) : "";
                        }
                    }, 50);

                }
            }

            console.log(coords)

        } else {
            return ' '
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
        const Index = currentCol?.findIndex((item) => invalidColumns[coords?.col]?.data == item);

        if (Index != -1) {
            setTimeout(function () {
                var searchInput = document?.querySelector('.htUIMultipleSelectSearch.htUIInput');
                if (searchInput !== null) {
                    searchInput.children[0].value = searchVal1[Index]
                }

            }, 200)
        } else {
            setTimeout(function () {
                var searchInput = document?.querySelector('.htUIMultipleSelectSearch.htUIInput');        // searchInput.children[0].innerHTML ="hii1"
                if (searchInput !== null) {
                    searchInput.children[0].value = ""
                }

            }, 100)
        }
        setCurrentCol1(coords?.col);

    }


    const columnName = invalidColumns

    const afterPasteData = (data, coords) => {

        const x123 = invalidaDatarows.slice(coords[0]?.startRow, coords[0]?.endRow + 1)
        console.log("after paste data", data, coords, x123);
    }

    const colHeaders = (col) => {
        console.log("header is called");
        let txt;
        switch (col) {
            case 0:
                txt = "<input type=\'checkbox\' class=\'checker\'  ";
                txt += isActive ? 'checked="checked"' : '';
                txt += ">";
                return txt;
        }
    }


        // For Filter Data
        function FilterData(arr) {
            let addArr = [];
            let updatedData = [];
            let finalObj = {};

            for (let i = 0; i < arr.length; i++) {
              Object.assign(finalObj, arr[i]);
            }

            let gridDataFilter = store?.GSTR6_EXCEL_VALIDATE[0].CDNA;
            updatedData = gridDataFilter
              .filter((item) =>
                finalObj.OriginalSupplierGSTIN?.length
                  ? item.OriginalSupplierGSTIN?.toLowerCase().includes(
                      finalObj.OriginalSupplierGSTIN.toLowerCase()
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
                finalObj.SupplierGSTIN?.length
                  ? item.SupplierGSTIN?.toLowerCase().includes(
                      finalObj.SupplierGSTIN?.toLowerCase()
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
                finalObj.RevisedNoteNumber?.length
                  ? item.RevisedNoteNumber?.toLowerCase().includes(
                      finalObj.RevisedNoteNumber?.toLowerCase()
                    )
                  : item
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
            finalObj.RevisedInvoiceValue?.length
              ? item.RevisedInvoiceValue?.toLowerCase().includes(
                  finalObj.RevisedInvoiceValue?.toLowerCase()
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
      finalObj.SupplyType?.length
        ? item.SupplyType?.toLowerCase().includes(
            finalObj.SupplyType?.toLowerCase()
          )
        : item
    )
    .filter((item) =>
    finalObj.PlaceOfSupply?.length
      ? item.PlaceOfSupply?.toLowerCase().includes(
          finalObj.PlaceOfSupply?.toLowerCase()
        )
      : item
  )
              .filter((RateItem) =>
                finalObj.Rate?.length
                  ? RateItem.Rate?.toLowerCase().includes(finalObj.Rate?.toLowerCase())
                  : RateItem
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
                  ? item.CESS?.toLowerCase().includes(
                      finalObj.CESS?.toLowerCase()
                    )
                  : item
              )
              .filter((item) =>
              finalObj.StatusofGSTR1of5?.length
                ? item.StatusofGSTR1of5?.toLowerCase().includes(
                    finalObj.StatusofGSTR1of5?.toLowerCase()
                  )
                : item
            )
            .filter((item) =>
            finalObj.InvoiceStatus?.length
              ? item.InvoiceStatus?.toLowerCase().includes(
                  finalObj.InvoiceStatus?.toLowerCase()
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
  var gridData = invalidaDatarows?.length > 0  && invalidaDatarows?.slice(para1, para2);


    return <>
        {block1 && <div className="loading1">Loading&#8230;</div>}


        <div className="" style={{ maxHeight: "450px", overflowY: "auto", overflowX: "hidden" }}>

            <Row>
                <Col md={12} >
                    {gridData?.length ?

                        <HotTable
                            rowHeights={RowSize}
                            columnHeaderHeight={columnHeaderSize}
                            autoColumnSize={{
                                samplingRatio: 23
                            }}
                            manualColumnResize={true}
                            stretchH='all'
                            height='auto'
                            ref={hotRef}
                            data={gridData ? gridData : []}
                            preventOverflow="horizontal"
                            rowHeaders={false}
                            columns={invalidColumns}
                            colHeaders={(x) => colHeaders(x)}
                            // afterChange={(x, y) => cellChange(x, y)}
                            afterChange={(x, y) => {

                                if(x != null){
                                    for(let i=0; i < x.length; i++){
                                        if(x[i][2] == null &&  x[i][3] == undefined){
                                            return
                                        }
                                        else{
                                            cellChange(x,y)
                                        }
                                    }
                                }
                            }}
                            comments={true}
                            afterGetColHeader={theader}
                            afterPaste={afterPasteData}
                            dropdownMenu={{
                                items: {

                                    filter_by_value: {
                                        name: "Search Value",
                                        // hide the 'Filter by value' list from all columns but the first one
                                        hidden() {
                                            const hot = hotRef?.current?.hotInstance;
                                            console.log("noon col", hot.getSelected()?.[0]?.[1], hot);
                                            return this.getSelected()[0][1] == 5 || this.getSelected()[0][1] == 9 || this.getSelected()[0][1] == 12;

                                        },
                                    },

                                    "option2": {
                                        name: `Select Date <br><input type='date' min='2017-07-01' max=${new Date().toISOString().slice(0, 10)} class='custom-date col-md-11' placeholder='DD-MM-YYYY' id='custom1' name='date' value=${searchDate}>`,
                                        hidden() {
                                            return this.getSelectedRangeLast().to.col != 5
                                        },

                                        //disabled: true,
                                        callback: function (key, selection, clickEvent) {
                                            console.log("date picker clicked");
                                            var src = clickEvent.target;

                                            if (src.tagName === 'INPUT') {
                                                console.log("custom menu2", key, selection, clickEvent, src);
                                                clickEvent.stopImmediatePropagation();
                                            }

                                            console.log("custom value", src.value);

                                            clickEvent.stopImmediatePropagation();

                                        },
                                    },
                                    "option3": {
                                        name: `Select Date <br><input type='date' min='2017-07-01' max=${new Date().toISOString().slice(0, 10)} class='custom-date col-md-11' placeholder='DD-MM-YYYY' id='custom2' name='date' value=${searchDate1}>`,
                                        hidden() {
                                            return this.getSelectedRangeLast().to.col != 9
                                        },

                                        //disabled: true,
                                        callback: function (key, selection, clickEvent) {
                                            console.log("date picker clicked");
                                            var src = clickEvent.target;

                                            if (src.tagName === 'INPUT') {
                                                console.log("custom menu2", key, selection, clickEvent, src);
                                                clickEvent.stopImmediatePropagation();
                                            }

                                            console.log("custom value", src.value);

                                            clickEvent.stopImmediatePropagation();

                                        },
                                    },
                                    "option4": {
                                        name: `Select Date <br><input type='date' min='2017-07-01' max=${new Date().toISOString().slice(0, 10)} class='custom-date col-md-11' placeholder='DD-MM-YYYY' id='custom3' name='date' value=${searchDate2}>`,
                                        hidden() {
                                            return this.getSelectedRangeLast().to.col != 12
                                        },

                                        //disabled: true,
                                        callback: function (key, selection, clickEvent) {
                                            console.log("date picker clicked");
                                            var src = clickEvent.target;

                                            if (src.tagName === 'INPUT') {
                                                console.log("custom menu2", key, selection, clickEvent, src);
                                                clickEvent.stopImmediatePropagation();
                                            }

                                            console.log("custom value", src.value);

                                            clickEvent.stopImmediatePropagation();

                                        },
                                    },

                                    clear: {
                                        name: `<button id='btnClear' name='Clear'   value='Clear'>Clear</button>`,
                                        //disabled: true,
                                        callback: function (key, selection, clickEvent) {
                                            console.log("date picker clicked");
                                            var src = clickEvent.target;
                                            console.log("name", src.tagName);
                                            if (src.tagName.toLowerCase() === 'button') {


                                                if (clickEvent.target.id == 'btnClear') {
                                                    // console.log("custom menu2", key, selection, clickEvent, src,data);


                                                    const hot = hotRef?.current?.hotInstance;
                                                    var value = "";
                                                    // if (hot.getSelected()?.[0]?.[1] != 5 || hot.getSelected()?.[0]?.[1] != 9 || hot.getSelected()?.[0]?.[1] != 12) {
                                                    //     var searchInput = document.querySelector(
                                                    //         ".htUIMultipleSelectSearch.htUIInput"
                                                    //     );
                                                    //     var value = "";
                                                    // } else {
                                                    //     var searchInput1 = document.getElementById('custom1');
                                                    //     var value = "";
                                                    //     setSearchDate(value)
                                                    // }
                                                    if (hot.getSelected()[0][1] == 5) {
                                                        setSearchDate(value);
                                                    } else if (
                                                        hot.getSelected()[0][1] == 9
                                                    ) {
                                                        setSearchDate1(value);
                                                    } else if (
                                                        hot.getSelected()[0][1] == 12
                                                    ) {
                                                        setSearchDate2(value);
                                                    }
                                                    // alert(data);

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
                                                        const Index = currentCol?.findIndex((item) => columnName[currentCol1]?.data == item)
                                                        // if (item == columnName[currentCol1]?.data)
                                                        if (Index != -1) {
                                                            const xyz = searchVal1
                                                            xyz[Index] = value
                                                            setSearchVal1(xyz)
                                                        } else {
                                                            x.push(value);
                                                            let y = currentCol;
                                                            y.push(columnName[currentCol1]?.data);
                                                            // console.log("jsx=",x,y)
                                                            setSearchVal1(x);
                                                            setCurrentCol(y);
                                                        }

                                                    }
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

                                    filter_action_bar: {

                                    },

                                }
                            }}
                            afterFilter={
                                function (data) {
                                    const hot = hotRef?.current?.hotInstance;

                                    // if (hot.getSelected()?.[0]?.[1] != (btnType == 'btnInvalidData' ? 4 : btnType == 'btnDuplicateData' ? 5 : 3)) {
                                    if (hot.getSelected()?.[0]?.[1] != 5 && hot.getSelected()?.[0]?.[1] != 9 && hot.getSelected()?.[0]?.[1] != 12) {
                                        var searchInput = document.querySelector(
                                            ".htUIMultipleSelectSearch.htUIInput"
                                        );
                                        var value = searchInput?.children[0]?.value;
                                        console.log("res1", value);
                                    } else {
                                        if (hot.getSelected()[0][1] == 5) {
                                            var searchInput1 = document.getElementById('custom1');
                                            var value = searchInput1.value;
                                            setSearchDate(value)
                                            console.log("res2", value);
                                        } else if (hot.getSelected()[0][1] == 9) {
                                            var searchInput2 =
                                                document.getElementById("custom2");
                                            var value = searchInput2?.value;
                                            setSearchDate1(value);
                                        } else {
                                            var searchInput3 =
                                                document.getElementById("custom3");
                                            var value = searchInput3?.value;
                                            setSearchDate2(value);
                                        }
                                    }
                                    // alert(data);

                                    console.log("res3", value);

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
                                        const Index = currentCol?.findIndex((item) => columnName[currentCol1]?.data == item)
                                        // if (item == columnName[currentCol1]?.data)
                                        if (Index != -1) {
                                            const xyz = searchVal1
                                            xyz[Index] = value
                                            setSearchVal1(xyz)
                                        } else {
                                            x.push(value);
                                            let y = currentCol;
                                            y.push(columnName[currentCol1]?.data);
                                            // console.log("jsx=",x,y)
                                            setSearchVal1(x);
                                            setCurrentCol(y);
                                        }

                                    }
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
                            }

                            afterRenderer={(TD, row, col, prop, value) => {
                                if (btnType == 'btnInvalidData' && (!col == 0) && errorArr.findIndex(y => y.row == row && y.col == col && y.tab == activeTab && y.page == page) != -1) {
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
                                        col == 9 ||
                                        col == 10 ||

                                        col == 12
                                    ) {
                                        if (!reg.test(e.key)) {
                                            e.preventDefault();
                                        }
                                    }
                                    if ((col == 11 || col == 4 || col == 8) && !(/^[a-zA-Z0-9\/\-]+$/.test(e.key))) {
                                        e.preventDefault()
                                    }
                                }
                            }}
                            beforeCreateRow={function (index, amount) {
                                let countRow = this?.countRows();
                                if (this?.isEmptyRow(countRow - 0)) {
                                    return false;
                                }
                                return true;
                            }}

                            filters={true}
                            nestedRows={true}
                            afterOnCellMouseDown={localAfterOnCellMouseDown}
                            beforeSetRangeStart={btnType == "btnDuplicateData" && localBeforeSetRangeStart}
                            contextMenu={false}
                            bindRowsWithHeaders={true}

                            hiddenColumns={{
                                columns: btnType == 'btnValidData' ? [0, 1, 2] : btnType == 'btnInvalidData' ? [0, 1] : [1, 2]
                            }}
                            mergeCells={false}
                            readOnly={btnType == "btnInvalidData" ? false : true}
                            licenseKey="non-commercial-and-evaluation"
                            cells={function (row, col) {
                                var cp = {}
                                const hot = hotRef?.current?.hotInstance;
                                cp.className = 'child'
                                if (col == 10 || col == 12 || col == 15 || col == 16 || col == 17 || col == 18 || col == 19 || col == 20) {
                                    cp.className = 'text-end'
                                }
                                if (col == 2) {
                                    if(gridData[row]?.ErrorMessage?.length > 33){
                                        cp.comment = {
                                            value: gridData[row]?.ErrorMessage, style: { width: 200, height: 70 },
                                            readOnly: true
                                        }
                                    }
                                    cp.renderer = myLables;
                                }

                                return cp
                            }}
                        /> :
                        <HotTable
                            rowHeights={RowSize}
                            columnHeaderHeight={columnHeaderSize}
                            autoColumnSize={{
                                samplingRatio: 23
                            }}
                            manualColumnResize={true}
                            ref={hotRef2}

                            afterGetColHeader={theader}
                            stretchH='all'
                            // style={{ textAlign: "center" }}
                            data={[{ "OriginalSupplierGSTIN": "No Data Found!" }]}
                            mergeCells={[{ row: 0, col: 3, rowspan: 1, colspan: 9 }]}
                            columns={invalidColumns}
                            // hiddenColumns={{
                            //     columns: [0, 1]
                            // }}
                            hiddenColumns={{
                                columns: btnType == 'btnValidData' ? [0, 1, 2] : btnType == 'btnInvalidData' ? [0, 1] : [1, 2]
                            }}
                            cells={function(row,col){
                                var cp={};
                                if(col == 3){
                                    cp.className='text-center'
                                }
                                return cp
                            }}

                            afterOnCellMouseDown={localAfterOnCellMouseDownEmpty}


                            dropdownMenu={{
                                items: {

                                    filter_by_value: {
                                        name: "Search Value",
                                        // hide the 'Filter by value' list from all columns but the first one
                                        hidden() {
                                            const hot = hotRef2?.current?.hotInstance;
                                            // console.log("noon col", hot.getSelected()?.[0]?.[1], hot);
                                            return this.getSelected()[0][1] == 5 || this.getSelected()[0][1] == 9 || this.getSelected()[0][1] == 12;

                                        },
                                    },

                                    "option2": {
                                        name: `Select Date <br><input type='date' min='2017-07-01' max=${new Date().toISOString().slice(0, 10)} class='custom-date col-md-11' placeholder='DD-MM-YYYY' id='custom1' name='date' value=${searchDate}>`,
                                        hidden() {
                                            return this.getSelectedRangeLast().to.col != 5
                                        },

                                        //disabled: true,
                                        callback: function (key, selection, clickEvent) {
                                            console.log("date picker clicked");
                                            var src = clickEvent.target;

                                            if (src.tagName === 'INPUT') {
                                                console.log("custom menu2", key, selection, clickEvent, src);
                                                clickEvent.stopImmediatePropagation();
                                            }

                                            console.log("custom value", src.value);

                                            clickEvent.stopImmediatePropagation();

                                        },
                                    },
                                    "option3": {
                                        name: `Select Date <br><input type='date' min='2017-07-01' max=${new Date().toISOString().slice(0, 10)} class='custom-date col-md-11' placeholder='DD-MM-YYYY' id='custom2' name='date' value=${searchDate1}>`,
                                        hidden() {
                                            return this.getSelectedRangeLast().to.col != 9
                                        },

                                        //disabled: true,
                                        callback: function (key, selection, clickEvent) {
                                            console.log("date picker clicked");
                                            var src = clickEvent.target;

                                            if (src.tagName === 'INPUT') {
                                                console.log("custom menu2", key, selection, clickEvent, src);
                                                clickEvent.stopImmediatePropagation();
                                            }

                                            console.log("custom value", src.value);

                                            clickEvent.stopImmediatePropagation();

                                        },
                                    },
                                    "option4": {
                                        name: `Select Date <br><input type='date' min='2017-07-01' max=${new Date().toISOString().slice(0, 10)} class='custom-date col-md-11' placeholder='DD-MM-YYYY' id='custom3' name='date' value=${searchDate2}>`,
                                        hidden() {
                                            return this.getSelectedRangeLast().to.col != 12
                                        },

                                        //disabled: true,
                                        callback: function (key, selection, clickEvent) {
                                            console.log("date picker clicked");
                                            var src = clickEvent.target;

                                            if (src.tagName === 'INPUT') {
                                                console.log("custom menu2", key, selection, clickEvent, src);
                                                clickEvent.stopImmediatePropagation();
                                            }

                                            console.log("custom value", src.value);

                                            clickEvent.stopImmediatePropagation();

                                        },
                                    },
                                    clear: {
                                        name: `<button id='btnClear' name='Clear'   value='Clear'>Clear</button>`,
                                        //disabled: true,
                                        callback: function (key, selection, clickEvent) {
                                            console.log("date picker clicked");
                                            var src = clickEvent.target;
                                            console.log("name", src.tagName);
                                            if (src.tagName.toLowerCase() === 'button') {


                                                if (clickEvent.target.id == 'btnClear') {
                                                    // console.log("custom menu2", key, selection, clickEvent, src,data);


                                                    const hot = hotRef2?.current?.hotInstance;
                                                    var value = "";
                                                    // if (hot.getSelected()?.[0]?.[1] != 5 || hot.getSelected()?.[0]?.[1] != 9 || hot.getSelected()?.[0]?.[1] != 12) {
                                                    //     var searchInput = document.querySelector(
                                                    //         ".htUIMultipleSelectSearch.htUIInput"
                                                    //     );
                                                    //     var value = "";
                                                    // } else {
                                                    //     var searchInput1 = document.getElementById('custom1');
                                                    //     var value = "";
                                                    //     setSearchDate(value)
                                                    // }

                                                    if (hot.getSelected()[0][1] == 5) {
                                                        setSearchDate(value);
                                                    } else if (
                                                        hot.getSelected()[0][1] == 9
                                                    ) {
                                                        setSearchDate1(value);
                                                    } else if (
                                                        hot.getSelected()[0][1] == 12
                                                    ) {
                                                        setSearchDate2(value);
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
                                                        const Index = currentCol?.findIndex((item) => columnName[currentCol1]?.data == item)
                                                        // if (item == columnName[currentCol1]?.data)
                                                        if (Index != -1) {
                                                            const xyz = searchVal1
                                                            xyz[Index] = value
                                                            setSearchVal1(xyz)
                                                        } else {
                                                            x.push(value);
                                                            let y = currentCol;
                                                            y.push(columnName[currentCol1]?.data);
                                                            // console.log("jsx=",x,y)
                                                            setSearchVal1(x);
                                                            setCurrentCol(y);
                                                        }

                                                    }
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

                                    filter_action_bar: {

                                    },

                                }
                            }}
                            afterFilter={
                                function (data) {
                                    const hot = hotRef2?.current?.hotInstance;

                                    // if (hot.getSelected()?.[0]?.[1] != (btnType == 'btnInvalidData' ? 4 : btnType == 'btnDuplicateData' ? 5 : 3)) {
                                    if (hot?.getSelected()?.[0]?.[1] != 5 && hot?.getSelected()?.[0]?.[1] != 9 && hot?.getSelected()?.[0]?.[1] != 12) {
                                        var searchInput = document.querySelector(
                                            ".htUIMultipleSelectSearch.htUIInput"
                                        );
                                        var value = searchInput?.children[0]?.value;
                                        console.log("res1", value);
                                    } else {
                                        if (hot.getSelected()[0][1] == 5) {
                                            var searchInput1 = document.getElementById('custom1');
                                            var value = searchInput1.value;
                                            setSearchDate(value)
                                            console.log("res2", value);
                                        }  else if (hot.getSelected()[0][1] == 9) {
                                            var searchInput2 =
                                                document.getElementById("custom2");
                                            var value = searchInput2?.value;
                                            setSearchDate1(value);
                                        } else {
                                            var searchInput3 =
                                                document.getElementById("custom3");
                                            var value = searchInput3?.value;
                                            setSearchDate2(value);
                                        }
                                    }
                                    // alert(data);

                                    console.log("res3", value);

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
                                        const Index = currentCol?.findIndex((item) => columnName[currentCol1]?.data == item)
                                        // if (item == columnName[currentCol1]?.data)
                                        if (Index != -1) {
                                            const xyz = searchVal1
                                            xyz[Index] = value
                                            setSearchVal1(xyz)
                                        } else {
                                            x.push(value);
                                            let y = currentCol;
                                            y.push(columnName[currentCol1]?.data);
                                            // console.log("jsx=",x,y)
                                            setSearchVal1(x);
                                            setCurrentCol(y);
                                        }

                                    }
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
                            }
                            filters={true}
                            afterChange={() => { console.log("hi") }}
                            nestedRows={true}
                            contextMenu={false}
                            bindRowsWithHeaders={true}
                            licenseKey="non-commercial-and-evaluation"
                            // rowHeights="30"
                            height="auto"
                            readOnly={btnType == "btnInvalidData" ? false : true}
                            beforeCreateRow={function (index, amount) {
                                let countRow = this?.countRows();
                                if (this?.isEmptyRow(countRow - 0)) {
                                    return false;
                                }
                                return true;
                            }}

                        />}

                </Col>
            </Row>
        </div>

        {invalidaDatarows?.length ? <ReactPaginate
            breakLabel="..."
            nextLabel=""
            onPageChange={handlePageClick}
            pageRangeDisplayed={2}
            pageCount={pageCountClientSide}
            forcePage={page}
            previousLabel=""
            renderOnZeroPageCount={null}
            marginPagesDisplayed={2}
            activeClassName='active'
            pageClassName='page-item'
            breakClassName='page-item'
            nextLinkClassName='page-link'
            pageLinkClassName='page-link'
            breakLinkClassName='page-link'
            previousLinkClassName='page-link'
            nextClassName='page-item next-item'
            previousClassName='page-item prev-item'
            containerClassName='pagination react-paginate separated-pagination pagination-sm justify-content-end pe-1 mt-1'
        /> : <></>}

    </>
}

export default cdnaValidate


