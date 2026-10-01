import React, { Fragment, useState, useEffect, forwardRef, Component, FC, useRef } from "react"
import { HotTable, HotColumn } from "@handsontable/react";
// import { registerRenderer, textRenderer } from 'handsontable/renderers';
import { Row, Col } from "reactstrap";
import { registerRenderer, textRenderer } from 'handsontable/renderers';
import { getFailed, getDuplicate } from "./store";
import { useDispatch, useSelector } from 'react-redux'
// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss';
import ReactPaginate from 'react-paginate';
import '@styles/react/libs/flatpickr/flatpickr.scss';

import "handsontable/dist/handsontable.full.min.css";
import { registerAllModules } from 'handsontable/registry';
import Handsontable from "handsontable";
import { PageSize, RowSize, columnHeaderSize } from "@configs/config";
import LocalFunction from '@configs/getLocalFunction';
import { globleVariable } from '@configs/globalVariable';
import moment from "moment";
import { handleValidateExcel, validationErrorMessage } from "../../../../helper/validation";


registerAllModules();
let isActive = false;

const serverDateTime = LocalFunction.getLocalValue(globleVariable.serverDateTime, true);
const maxDate = JSON.parse(serverDateTime).toString().split("T")[0];
const maxShowDate = new Date(maxDate);
console.log('show max data', maxShowDate)


const validColumns = [
    {
        data: 'srNo',
        title: "Sr No.",
        // width: 50,
        frozen: true,
        cellClass: "SrNoGCol"
    },
    {
        data: 'placeOfSupply',
        title: 'Place of Supply(POS)',
        // width: 200,
    },

    {
        data: 'rate',
        title: 'Rate',
        // width: 100,
    },
    {
        data: 'advancePaidAdjusted',
        title: 'Advance amount adjusted (₹)',
        // width: 200,
    },

    {
        data: 'cessPaid',
        title: 'Cess amount to be adjusted (₹)',
        // width: 200,
    },


]

const invalidColumns = [
    { data: "isActive", type: "checkbox", readOnly: false, width: 20 },
    {
        data: 'srNo',
        title: "Sr No.",
        // width: 80,
        frozen: true,
    },
    {
        data: 'ErrorList',
        title: "Error",
        readOnly: true,
        width: 250,

    },
    { title: 'Export Type', data: 'ExportType' },
    {
        title: 'Invoice Number', data: 'InvoiceNumber',


    },
    {
        title: 'Invoice date', data: 'InvoiceDate', type: 'date',
        dateFormat: 'DD-MM-YYYY',
        correctFormat: true,
        className: "htAutocomplete",
        datePickerConfig: {
            firstDay: 0,
            showWeekNumber: false,
            numberOfMonths: 1,
            licenseKey: 'non-commercial-and-evaluation',
            minDate: new Date('2017-07-01'),
            bound: true,
            class: "htAutocompleteArrow",
            defaultDate: maxShowDate,
            maxDate: maxShowDate
        }
    },
    {
        title: 'Invoice Value (₹)', data: 'InvoiceValue',
        type: "numeric",
        numericFormat: {
            pattern: '0,0.00',
            culture: 'en-IN'
        },
    },
    { title: 'Port Code', data: 'PortCode' },
    {
        title: 'Shipping Bill Number', data: 'BillOfEntryNumber',
        type: "numeric",
    },
    {
        title: 'Shipping Bill Date', data: 'BillOfEntryDate', type: 'date',
        dateFormat: 'DD-MM-YYYY',
        correctFormat: true,
        className: "htAutocomplete",
        datePickerConfig: {
            firstDay: 0,
            showWeekNumber: false,
            numberOfMonths: 1,
            licenseKey: 'non-commercial-and-evaluation',
            minDate: new Date('2017-07-01'),
            bound: true,
            class: "htAutocompleteArrow",
            defaultDate: maxShowDate,
            maxDate: maxShowDate
        }
    },
    {
        title: 'Rate', data: 'Rate',
        type: "numeric",
        numericFormat: {
            pattern: '0,0.00',
            culture: 'en-IN'
        },
    },
    {
        title: 'Taxable Value (₹)', data: 'TaxableValue',
        type: "numeric",
        numericFormat: {
            pattern: '0,0.00',
            culture: 'en-IN'
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
        title: 'Cess Amount (₹)', data: 'Cess',
        type: "numeric",
        numericFormat: {
            pattern: '0,0.00',
            culture: 'en-IN'
        },
    },
    {
        title: 'IRN Number', // 19
        data: 'IRNNo'
    },
    {
        title: 'IRN Date',
        data: 'IRNDate',
        type: "date",
        dateFormat: "DD-MM-YYYY",
        // allowInvalid: false,
        correctFormat: true,
        className: "htAutocomplete",
        datePickerConfig: {
            firstDay: 0,
            showWeekNumber: false,
            numberOfMonths: 1,
            licenseKey: "non-commercial-and-evaluation",
            minDate: new Date("2017-07-01"),
            bound: true,
            class: "htAutocompleteArrow",
            defaultDate: maxShowDate,
            maxDate: maxShowDate,
        },
        width: 150,
    },
    {   
        title: 'Source',
        data: 'Source'
    },
    {
        title : 'Company GSTIN',
        data:'CompanyGSTIN',
        readOnly: true,
        width: 150
    }
]

//** button - Action column
function myLables(instance, td, row, col, prop, value, cellProperties) {
    Handsontable.renderers.TextRenderer.apply(this, arguments);
    td.innerHTML = `<div class="truncated">${value !== null && value !== "" ? value : ""}</div>`
}

let newR = []

invalidColumns.map((item, index) => {
    newR.push(`${item.title}`)
})

let newWidth = []
invalidColumns.map((item) => {
    newWidth.push(item.width)
})

let newValid = [];
const emptyColumns = [...validColumns.slice(1)]

validColumns.map((item) => {
    newValid.push(item.title)
})


const ExpValidate = ({ data, btnType, tabRecord, activeTab, clearFilter, errorArr, setErrorArr }) => {

    const [invalidaDatarows, setvalidaDatarows] = useState([]);
    const [block1, setBlock1] = useState(false);
    const [page, setPage] = useState(0);
    const dispatch = useDispatch()
    const store = useSelector(state => state.gstr1ExcelData)
    const [currentCol, setCurrentCol] = useState([]);
    const [currentCol1, setCurrentCol1] = useState();
    const [searchVal1, setSearchVal1] = useState([]);
    const [searchDate, setSearchDate] = useState('');
    const [searchDate1, setSearchDate1] = useState('');
    const [searchDate2, setSearchDate2] = useState('');

    const hotRef = useRef(null);
    const hotRef2 = useRef(null);

    const storeSales = useSelector(
        (state) => state.gstr1ExcelData?.GSTR1_EXCEL_VALIDATE
    );

    let expDup = [];
    let allDataDuplicate = [];



    function localAfterOnCellMouseDown(event, coords, td) {
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
        const hot = hotRef?.current?.hotInstance;
        const totalRows = hot?.countRows();
        if (event.target.classList.contains('checker')) {
            event.stopPropagation();
            setBlock1(true);

            if (!isActive) {
                event.stopPropagation();
                isActive = true;
                setTimeout(() => {
                    for (let index = 0; index < totalRows; index++) {
                        console.log("total counts b2b", totalRows, index);
                        hot?.setDataAtCell(index, 0, true);
                        (index == totalRows - 1) ? setBlock1(false) : "";
                    }
                }, 50);
            } else {
                event.stopPropagation();
                isActive = false;
                setTimeout(() => {
                    for (let index = 0; index < totalRows; index++) {
                        console.log("total counts b2b", totalRows, index);
                        hot?.setDataAtCell(index, 0, false);
                        (index == totalRows - 1) ? setBlock1(false) : "";
                    }
                }, 50);
            }
        }

        console.log(coords)
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

    const theader = (col, TH) => {
        if (col === 0 || col === 2 || col === 19) {
            const button = TH.children[0].children[0];
            button?.parentNode?.removeChild(button);
        }

        if (col == 6 || col == 8 || col == 12 || col == 10 || col == 11) {
            TH.className = 'htRight'
        }
        else {
            TH.className = 'htLeft'
        }
    }
    if (store?.duplicateData?.length) {
        for (let item of store?.duplicateData) {
            if (item.sheetName?.toLowerCase() == "exp") {

                expDup.push(item.data)
            } else {
                allDataDuplicate.push(item)
            }
        }
    }
    const expDuplicateData = expDup.length ? expDup[0] : [];
    console.log("expduplicate data=", expDuplicateData);
    console.log("all data=", allDataDuplicate);

    let expFail = []
    let allDataFailed = [];
    if (store?.failedData?.length) {
        for (let item of store?.failedData) {
            if (item.sheetName?.toLowerCase() == "exp") {

                expFail.push(item.data)
            } else {
                allDataFailed.push(item)
            }
        }
    }
    const expFailedData = expFail.length ? expFail[0] : [];
    console.log("all data=", allDataFailed)


    const handlePageClick = (event) => {
        setPage(event?.selected);

    };


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

                if (colIndex == 4 || colIndex == 6 || colIndex == 8 || colIndex == 12 || colIndex == 10 || colIndex == 11) {
                    const oldVal = change[i][2]
                    
                    if (isNaN(value) && (colIndex !== 4) && value !== '') {
                        cellObj.validationMsg = "Only Numeric Value Allowed";
                        setErrorArr(pre => [...pre, cellObj])
                    }
                    else if (!(/^[a-zA-Z0-9\/\-]+$/.test(value)) && value !== '' && colIndex === 4) {
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

        var newPayloadFail = expFailedData;

        for (let i = 0; btnType == "btnInvalidData" ? i <= change?.length : i < change?.length; i++) {
            console.log("time by value", change[i]?.[0])
            y = gridData[change[i]?.[0]]
            if (y) {
                console.log("y=", y, change)
                if (btnType == "btnInvalidData") {
                    console.log("change paste2=", y);

                    const failedIndex = newPayloadFail?.findIndex((item) => item.RowGUIDReact == y?.RowGUIDReact);
                    console.log("duplicate index=", failedIndex, newPayloadFail);

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
                        console.log("new payload=", newPayloadFail);
                    }
                    let matchingElements = invalidaDatarows.filter((item) => {
                        return newPayloadFail.find((item2) => item2.RowGUIDReact == item.RowGUIDReact)
                    })
                    // newPayloadFail = matchingElements
                    newPayloadFail = [...JSON.parse(JSON.stringify(matchingElements))]

                    const payload = [{
                        sheetId: sheetId,
                        sheetName: sheetName,
                        guid: GUID,
                        totalRecords: newPayloadFail.length?.toString(),
                        data: newPayloadFail
                    }, ...allDataFailed]
                    console.log("time payload=", payload);
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
                    dispatch(getDuplicate(payload))
                }
            }
            console.log("time by value1", y);
        }

        console.log("time by value2", y);

    }

    const sheetData = (i = "exp") => {
        const failedIndex = data?.failedData?.findIndex((item) => item?.sheetName?.toLowerCase() == i);

        return data?.failedData?.[failedIndex]
    }

    const sheetName = sheetData()?.sheetName;
    const GUID = sheetData()?.guid;
    const sheetId = sheetData()?.sheetId;

    const loadImpg = () => {

        const payloadSheet = {
            "sheetName": sheetName,
            "guid": GUID,
            // "status": status,
            "pageNumber": page + 1,
            "pageSize": PageSize,
            "sheetId": sheetId,
            "orderByColumnName": "",
            "orderBy": "",
            "searchColumnName": currentCol,
            "searchValue": searchVal1
        }
        if (data !== null) {
            if (store?.GSTR1_EXCEL_VALIDATE?.length > 0) {
                if (btnType == 'btnInvalidData') {
                    payloadSheet.status = 0;

                    if (store?.GSTR1_EXCEL_VALIDATE?.length > 0) {
                        const arrError1 = store?.GSTR1_EXCEL_VALIDATE[0].EXP.map((item) => {
                            return {
                                ...item
                            };
                        });

                        // store?.GSTR1_EXCEL_VALIDATE[0]?.EXP;
                        const arrError2 = expFailedData;
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

                    // gstr1PurchaseInvoiceService.PurchasesePaginationData(payloadSheet).then(res => {
                    //     if (res.status === 200 && res.data.status === errorCodeConfig.APIDefaultCode.Success) {
                    //         setBlock1(false);
                    //         console.log("res=", res?.data?.data);
                    //         const arrError1 = res?.data?.data;
                    //         const arrError2 = expFailedData;
                    //         const arrError = arrError1.map(obj => arrError2.find(o => o.RowGUIDReact === obj.RowGUIDReact
                    //           &&  o.gstr1DetailId === obj.gstr1DetailId ) || obj);
                    //         setvalidaDatarows(JSON.parse(JSON.stringify(arrError)))
                    //         let count =
                    //           res?.data?.data[0]?.totalRowCount > PageSize
                    //             ? Math.ceil(res?.data?.data[0]?.totalRowCount / PageSize)
                    //             : 1;
                    //         setPageCount(count);

                    //         tabRecord(res?.data?.data[0]?.totalRowCount, sheetName, sheetId, status)

                    //     } else {
                    //         setBlock1(false);
                    //         tabRecord(0, sheetName, sheetId, status);
                    //         setvalidaDatarows([]);
                    //     }
                    // }).catch(error => {
                    //     setBlock1(false);
                    //     Swal.fire({
                    //         icon: 'error',
                    //         title: '',
                    //         text: error?.message,
                    //     });
                    // })
                    // setvalidaDatarows(data.failedData[0].data)
                } else if (btnType == 'btnValidData') {
                    payloadSheet.status = 1;

                    if (store?.GSTR1_EXCEL_VALIDATE?.length > 0) {

                        tabRecord(
                            store?.GSTR1_EXCEL_VALIDATE[0]?.EXP?.length,
                            sheetName,
                            sheetId,
                            status
                        );
                        setvalidaDatarows(store?.GSTR1_EXCEL_VALIDATE[0]?.EXP);
                    } else {
                        setvalidaDatarows([]);
                        tabRecord(0, sheetName, sheetId, status);
                    }

                    // gstr1PurchaseInvoiceService.PurchasesePaginationData(payloadSheet).then(res => {
                    //     if (res.status === 200 && res.data.status === errorCodeConfig.APIDefaultCode.Success) {
                    //         console.log("res=", res?.data?.data);
                    //         setBlock1(false);
                    //         let count =
                    //           res?.data?.data[0]?.totalRowCount > PageSize
                    //             ? Math.ceil(res?.data?.data[0]?.totalRowCount / PageSize)
                    //             : 1;
                    //         setPageCount(count);

                    //         tabRecord(res?.data?.data[0]?.totalRowCount, sheetName, sheetId, status)
                    //         setvalidaDatarows(res?.data?.data)
                    //     } else {
                    //         setBlock1(false);
                    //         tabRecord(0, sheetName, sheetId, status);
                    //         setvalidaDatarows([]);

                    //     }
                    // }).catch(error => {
                    //     setBlock1(false);
                    //     Swal.fire({
                    //         icon: 'error',
                    //         title: '',
                    //         text: error?.message,
                    //     });
                    // })
                    // setvalidaDatarows(data.passedData[0].data)
                } else {
                    payloadSheet.status = 2;

                    if (store?.GSTR1_EXCEL_VALIDATE?.length > 0) {
                        const arrDuplicate1 = store?.GSTR1_EXCEL_VALIDATE[0]?.EXP.map(
                            (item) => {
                                return {
                                    ...item,
                                    writable: true,
                                };
                            }
                        );
                        const arrDuplicate2 = expDuplicateData;
                        console.log("compare array", arrDuplicate1, arrDuplicate2);
                        const arrDuplicate = arrDuplicate1.map(
                            (obj) =>
                                arrDuplicate2?.find((o) => o.RowGUIDReact === obj.RowGUIDReact) ||
                                obj
                        );
                        tabRecord(arrDuplicate2.length, sheetName, sheetId, status);
                        console.log("arrDuplicate=", arrDuplicate);
                        setvalidaDatarows(arrDuplicate ? arrDuplicate : arrDuplicate1);

                        // setvalidaDatarows(store?.PURCHASE_EXCEL_VALIDATE[0].B2B);
                    } else {
                        setvalidaDatarows([]);
                    }
                    // gstr1PurchaseInvoiceService.PurchasesePaginationData(payloadSheet).then(res => {
                    //     if (res.status === 200 && res.data.status === errorCodeConfig.APIDefaultCode.Success) {
                    //         console.log("res=", res?.data?.data);
                    //         setBlock1(false);
                    //         let count =
                    //           res?.data?.data[0]?.totalRowCount > PageSize
                    //             ? Math.ceil(res?.data?.data[0]?.totalRowCount / PageSize)
                    //             : 1;
                    //         setPageCount(count);

                    //         const arrDuplicate1 = res?.data?.data;
                    //         const arrDuplicate2 = expDuplicateData;
                    //         console.log("compare array", arrDuplicate1, arrDuplicate2);
                    //         const arrDuplicate = arrDuplicate1.map(obj => arrDuplicate2?.find(o => o.RowGUIDReact === obj.RowGUIDReact) || obj);
                    //         console.log("arrDuplicate=", arrDuplicate)
                    //         tabRecord(res?.data?.data[0]?.totalRowCount, sheetName, sheetId, status)
                    //         setvalidaDatarows(arrDuplicate ? arrDuplicate : arrDuplicate1)
                    //         // setvalidaDatarows(res?.data?.data);
                    //     } else {
                    //         tabRecord(0, sheetName, sheetId, status);
                    //         setvalidaDatarows([]);
                    //         setBlock1(false);
                    //     }
                    // }).catch(error => {
                    //     // setBlock(false)
                    //     setBlock1(false);
                    //     Swal.fire({
                    //         icon: 'error',
                    //         title: '',
                    //         text: error?.message,
                    //     });
                    // })
                    // setvalidaDatarows(data.duplicateData[0].data)
                }
            }
        } // Iam Coming
    }


    useEffect(() => {

        loadImpg()
        isActive = false;
        dispatch(getDuplicate([]));;
    }, [btnType, searchVal1])

    useEffect(() => {
        return () => setBlock1(false)
    }, [])

    useEffect(() => {


        setSearchVal1([]);
        setCurrentCol([])
        loadImpg()

    }, [clearFilter])
    useEffect(() => {
        loadImpg()
        if (store == undefined) {
            setBlock1(true)
            loadImpg()
        }
        else {
            setBlock1(false)
        }
    }, [storeSales])



    // const columnName = btnType == 'btnInvalidData' ? invalidColumns.slice(1) : btnType == 'btnDuplicateData' ? invalidColumns : validColumns
    const columnName = invalidColumns;

    function FilterData(arr) {
        let addArr = [];
        let updatedData = [];
        let finalObj = {};

        for (let i = 0; i < arr.length; i++) {
            Object.assign(finalObj, arr[i]);
        }

        let gridDataFilter = store?.GSTR1_EXCEL_VALIDATE != undefined || store?.GSTR1_EXCEL_VALIDATE != null ? store?.GSTR1_EXCEL_VALIDATE[0].EXP : [];
        console.log(gridDataFilter, "gridDataFilter")

        updatedData = gridDataFilter
            .filter((ExportTypeItem) =>
                finalObj.ExportType?.length
                    ? ExportTypeItem.ExportType?.toLowerCase().includes(
                        finalObj.ExportType.toLowerCase()
                    )
                    : ExportTypeItem
            )
            .filter((InvoiceNumberItem) =>
                finalObj.InvoiceNumber?.length
                    ? InvoiceNumberItem.InvoiceNumber?.toLowerCase().includes(
                        finalObj.InvoiceNumber?.toLowerCase()
                    )
                    : InvoiceNumberItem
            )
            .filter((InvoiceDateItem) =>
                finalObj.InvoiceDate?.length
                    ? InvoiceDateItem.InvoiceDate?.toLowerCase().includes(
                        // finalObj.InvoiceDate?.toLowerCase()
                        moment(finalObj?.InvoiceDate).format("DD-MM-YYYY")
                    )
                    : InvoiceDateItem
            )
            .filter((BillOfEntryDateItem) =>
                finalObj.BillOfEntryDate?.length
                    ? BillOfEntryDateItem.BillOfEntryDate?.toLowerCase().includes(
                        // finalObj.InvoiceDate?.toLowerCase()
                        moment(finalObj?.BillOfEntryDate).format("DD-MM-YYYY")
                    )
                    : BillOfEntryDateItem
            )
            .filter((InvoiceValueItem) =>
                finalObj.InvoiceValue?.length
                    ? InvoiceValueItem.InvoiceValue?.toLowerCase().includes(
                        finalObj.InvoiceValue?.toLowerCase()
                    )
                    : InvoiceValueItem
            )
            .filter((PortCodeItem) =>
                finalObj.PortCode?.length
                    ? PortCodeItem.PortCode?.toLowerCase().includes(
                        finalObj.PortCode?.toLowerCase()
                    )
                    : PortCodeItem
            )
            .filter((BillOfEntryNumberItem) =>
                finalObj.BillOfEntryNumber?.length
                    ? BillOfEntryNumberItem.BillOfEntryNumber?.toLowerCase().includes(
                        finalObj.BillOfEntryNumber?.toLowerCase()
                    )
                    : BillOfEntryNumberItem
            )
            .filter((ApplicableOfTaxRateItem) =>
                finalObj.ApplicableOfTaxRate?.length
                    ? ApplicableOfTaxRateItem.ApplicableOfTaxRate?.toLowerCase().includes(
                        finalObj.ApplicableOfTaxRate?.toLowerCase()
                    )
                    : ApplicableOfTaxRateItem
            )
            .filter((InvoiceTypeItem) =>
                finalObj.InvoiceType?.length
                    ? InvoiceTypeItem.InvoiceType?.toLowerCase().includes(
                        finalObj.InvoiceType?.toLowerCase()
                    )
                    : InvoiceTypeItem
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
            .filter((CessItem) =>
                finalObj.Cess?.length
                    ? CessItem.Cess?.toLowerCase().includes(
                        finalObj.Cess?.toLowerCase()
                    )
                    : CessItem
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
            )
            .filter((item) =>
                finalObj.IRNNumber?.length
                    ? item.IRNNumber?.toLowerCase().includes(finalObj.IRNNumber?.toLowerCase())
                    : item
            )
            .filter((item) =>
                finalObj.Source?.length
                    ? item.Source?.toLowerCase().includes(finalObj.Source?.toLowerCase())
                    : item
            )
            .filter((item) =>
                finalObj.IRNDate?.length
                    ? item.IRNDate?.toLowerCase().includes(
                        moment(finalObj?.IRNDate).format("DD-MM-YYYY")
                    )
                    : item
            )


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

    const pageCountClientSide = Math.ceil(
        invalidaDatarows?.length && invalidaDatarows?.length / PageSize
    );
    const para1 = page * PageSize;
    const para2 = page * PageSize + PageSize;
    var gridData = invalidaDatarows && invalidaDatarows.slice(para1, para2);



    return <>
        {block1 && <div className="loading1">Loading&#8230;</div>}

        <div className="" style={{ maxHeight: "450px", overflowY: "auto", overflowX: "hidden" }}>

            <Row>
                <Col md={12}>
                    {console.log(gridData, "gridData")}
                    {gridData?.length ? <HotTable
                        rowHeights={RowSize}
                        columnHeaderHeight={columnHeaderSize}
                        // style={{ overflow:"scroll" }}
                        autoColumnSize={true}
                        stretchH='all'
                        height='auto'
                        // width='auto'
                        ref={hotRef}
                        // width={1550}
                        data={gridData ? gridData : []}
                        preventOverflow="horizontal"
                        rowHeaders={false}
                        columns={invalidColumns}
                        // columns={btnType == 'btnInvalidData' ? invalidColumns.slice(1) : btnType == 'btnDuplicateData' ? invalidColumns : validColumns}
                        colHeaders={(x) => colHeaders(x)}                    // colHeaders={btnType != 'btnDuplicateData' ? newR.slice(1) : newR}
                        // colWidths={newWidth}

                        afterRenderer={(TD, row, col, prop, value) => {
                            if (btnType == 'btnInvalidData' && (!col == 0) && (errorArr.findIndex(y => y.row == row && y.col == col && y.tab == activeTab && y.page == page) != -1)) {
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
                                let col = this?.getSelectedLast?.()?.[1];

                                if (
                                    col == 6 || col == 8 || col == 10 || col == 11 || col == 12
                                ) {
                                    if (!reg.test(e.key)) {
                                        e.preventDefault();
                                    }
                                } if ((col == 4) && !(/^[a-zA-Z0-9\/\-]+$/.test(e.key))) {
                                    e.preventDefault()
                                }
                            }
                        }}
                        comments={true}

                        afterChange={(x, y) => {
                            console.log(x, "xxxxxxx")
                            if (x != null) {
                                for (let i = 0; i < x.length; i++) {
                                    if (x[i][2] == null && x[i][3] == undefined) {
                                        return
                                    }
                                    else {
                                        cellChange(x, y)
                                    }
                                }
                            }
                        }}

                        filters={true}
                        nestedRows={true}
                        contextMenu={false}
                        bindRowsWithHeaders={true}
                        afterOnCellMouseDown={localAfterOnCellMouseDown}
                        beforeSetRangeStart={btnType == "btnDuplicateData" && localBeforeSetRangeStart}
                        afterGetColHeader={theader}
                        cells={function (row, col, prop) {

                            const cellPrp = {};

                            if (col == 2) {
                                if (gridData[row]?.ErrorList?.length > 33) {
                                    cellPrp.comment = {
                                        value: gridData[row]?.ErrorList, style: { width: 200, height: 50 },
                                        readOnly: true
                                    }
                                }
                                cellPrp.renderer = myLables;
                            }
                            return cellPrp;
                        }}

                        dropdownMenu={{
                            items: {

                                filter_by_value: {
                                    name: "Search Value",
                                    // hide the 'Filter by value' list from all columns but the first one
                                    hidden() {
                                        const hot = hotRef?.current?.hotInstance;
                                        // console.log("noon col", hot?.getSelected()?.[0]?.[1], hot);
                                        console.log("date picker clicked", this.getSelectedRangeLast().to.col);

                                        return this.getSelected()[0][1] == 5 || this.getSelected()[0][1] == 9 || this.getSelected()[0][1] == 17;

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

                                        return this.getSelectedRangeLast().to.col != 17
                                    },

                                    //disabled: true,
                                    callback: function (key, selection, clickEvent) {
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
                                                if (hot?.getSelected()[0][1] == 5) {
                                                    setSearchDate(value);
                                                } else if (
                                                    hot?.getSelected()[0][1] == 9
                                                ) {
                                                    setSearchDate1(value);
                                                } else if (
                                                    hot?.getSelected()[0][1] == 17
                                                ) {
                                                    setSearchDate2(value);
                                                }
                                                // alert(data);

                                                const x = searchVal1;
                                                if (!searchVal1?.length) {
                                                    x.push(value);
                                                    let y = currentCol;
                                                    y.push(invalidColumns[currentCol1]?.data);
                                                    // console.log("jsx=",x,y)
                                                    setSearchVal1(x);
                                                    setCurrentCol(y);

                                                    // forceUpdate();
                                                } else {
                                                    const Index = currentCol?.findIndex((item) => invalidColumns[currentCol1]?.data == item)
                                                    // if (item == columnName[currentCol1]?.data)
                                                    if (Index != -1) {
                                                        const xyz = searchVal1
                                                        xyz[Index] = value
                                                        setSearchVal1(xyz)
                                                    } else {
                                                        x.push(value);
                                                        let y = currentCol;
                                                        y.push(invalidColumns[currentCol1]?.data);
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

                                filter_action_bar: {

                                },

                            }
                        }}
                        afterFilter={
                            function (data) {
                                const hot = hotRef?.current?.hotInstance;

                                // if (hot?.getSelected()?.[0]?.[1] != (btnType == 'btnInvalidData' ? 4 : btnType == 'btnDuplicateData' ? 5 : 3)) {
                                if (hot?.getSelected()?.[0]?.[1] != 5 && hot?.getSelected()?.[0]?.[1] != 9 && hot?.getSelected()?.[0]?.[1] != 17) {
                                    var searchInput = document.querySelector(
                                        ".htUIMultipleSelectSearch.htUIInput"
                                    );
                                    var value = searchInput?.children[0]?.value;
                                    console.log("res1", value);
                                } else {
                                    if (hot?.getSelected()[0][1] == 5) {
                                        var searchInput1 = document.getElementById('custom1');
                                        var value = searchInput1.value;
                                        setSearchDate(value)
                                        console.log("res2", value);
                                    } else if (hot?.getSelected()[0][1] == 9) {
                                        var searchInput2 =
                                            document.getElementById("custom2");
                                        var value = searchInput2?.value;
                                        setSearchDate1(value);
                                    } else if (hot?.getSelected()[0][1] == 17) {
                                        var searchInput2 =
                                            document.getElementById("custom3");
                                        var value = searchInput2?.value;
                                        setSearchDate2(value);
                                    }
                                }

                                const x = searchVal1;
                                if (!searchVal1?.length) {
                                    x.push(value);
                                    let y = currentCol;
                                    y.push(invalidColumns[currentCol1]?.data);

                                    setSearchVal1(x);
                                    setCurrentCol(y);
                                } else {
                                    const Index = currentCol?.findIndex((item) => invalidColumns[currentCol1]?.data == item)
                                    // if (item == columnName[currentCol1]?.data)
                                    if (Index != -1) {
                                        const xyz = searchVal1
                                        xyz[Index] = value
                                        setSearchVal1(xyz)
                                    } else {
                                        x.push(value);
                                        let y = currentCol;
                                        y.push(invalidColumns[currentCol1]?.data);
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
                        }
                        hiddenColumns={{
                            columns: btnType == 'btnValidData' ? [0, 1, 2] : btnType == 'btnInvalidData' ? [0, 1] : [1, 2]
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
                    /> : <HotTable
                        rowHeights={RowSize}

                        columnHeaderHeight={columnHeaderSize}
                        autoColumnSize={true}
                        afterGetColHeader={theader}
                        stretchH='all'
                        style={{ textAlign: "center" }}
                        data={[{ "ExportType": "No Data Found!" }]}
                        mergeCells={[{ row: 0, col: 3, rowspan: 1, colspan: 10 }]}
                        columns={invalidColumns}
                        hiddenColumns={{
                            columns: [0, 1, 2]
                        }}
                        comments={false}
                        ref={hotRef2}
                        // colHeaders={emptyHeaders}
                        // hiddenColumns={{
                        //     columns: btnType == 'btnDuplicateData' ? [1] : [0]
                        // }}
                        afterOnCellMouseDown={localAfterOnCellMouseDownEmpty}

                        dropdownMenu={{
                            items: {

                                filter_by_value: {
                                    name: "Search Value",
                                    // hide the 'Filter by value' list from all columns but the first one
                                    hidden() {
                                        const hot = hotRef?.current?.hotInstance;
                                        // console.log("noon col", hot?.getSelected()?.[0]?.[1], hot);
                                        console.log("date picker clicked", this.getSelectedRangeLast().to.col);

                                        return this.getSelected()[0][1] == 5 || this.getSelected()[0][1] == 9 || this.getSelected()[0][1] == 17;

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

                                        return this.getSelectedRangeLast().to.col != 17
                                    },

                                    //disabled: true,
                                    callback: function (key, selection, clickEvent) {
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
                                                if (hot?.getSelected()[0][1] == 5) {
                                                    setSearchDate(value);
                                                } else if (
                                                    hot?.getSelected()[0][1] == 9
                                                ) {
                                                    setSearchDate1(value);
                                                } else if (
                                                    hot?.getSelected()[0][1] == 17
                                                ) {
                                                    setSearchDate2(value);
                                                }
                                                // alert(data);

                                                const x = searchVal1;
                                                if (!searchVal1?.length) {
                                                    x.push(value);
                                                    let y = currentCol;
                                                    y.push(invalidColumns[currentCol1]?.data);
                                                    // console.log("jsx=",x,y)
                                                    setSearchVal1(x);
                                                    setCurrentCol(y);

                                                    // forceUpdate();
                                                } else {
                                                    const Index = currentCol?.findIndex((item) => invalidColumns[currentCol1]?.data == item)
                                                    // if (item == columnName[currentCol1]?.data)
                                                    if (Index != -1) {
                                                        const xyz = searchVal1
                                                        xyz[Index] = value
                                                        setSearchVal1(xyz)
                                                    } else {
                                                        x.push(value);
                                                        let y = currentCol;
                                                        y.push(invalidColumns[currentCol1]?.data);
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

                                filter_action_bar: {

                                },

                            }
                        }}
                        afterFilter={
                            function (data) {
                                const hot = hotRef2?.current?.hotInstance;

                                // if (hot?.getSelected()?.[0]?.[1] != (btnType == 'btnInvalidData' ? 4 : btnType == 'btnDuplicateData' ? 5 : 3)) {
                                if (hot?.getSelected()?.[0]?.[1] != 5 && hot?.getSelected()?.[0]?.[1] != 9 && hot?.getSelected()?.[0]?.[1] != 17) {
                                    var searchInput = document.querySelector(
                                        ".htUIMultipleSelectSearch.htUIInput"
                                    );
                                    var value = searchInput?.children[0]?.value;
                                    console.log("res1", value);
                                } else {
                                    if (hot?.getSelected()[0][1] == 5) {
                                        var searchInput1 = document.getElementById('custom1');
                                        var value = searchInput1.value;
                                        setSearchDate(value)
                                        console.log("res2", value);
                                    } else if (hot?.getSelected()[0][1] == 9) {
                                        var searchInput2 =
                                            document.getElementById("custom2");
                                        var value = searchInput2?.value;
                                        setSearchDate1(value);
                                    } else if (hot?.getSelected()[0][1] == 17) {
                                        var searchInput2 =
                                            document.getElementById("custom3");
                                        var value = searchInput2?.value;
                                        setSearchDate2(value);
                                    }
                                }

                                const x = searchVal1;
                                if (!searchVal1?.length) {
                                    x.push(value);
                                    let y = currentCol;
                                    y.push(invalidColumns[currentCol1]?.data);

                                    setSearchVal1(x);
                                    setCurrentCol(y);
                                } else {
                                    const Index = currentCol?.findIndex((item) => invalidColumns[currentCol1]?.data == item)
                                    // if (item == columnName[currentCol1]?.data)
                                    if (Index != -1) {
                                        const xyz = searchVal1
                                        xyz[Index] = value
                                        setSearchVal1(xyz)
                                    } else {
                                        x.push(value);
                                        let y = currentCol;
                                        y.push(invalidColumns[currentCol1]?.data);
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
                        }
                        filters={true}
                        afterChange={() => { console.log("hi") }}
                        nestedRows={true}
                        contextMenu={false}
                        bindRowsWithHeaders={true}
                        licenseKey="non-commercial-and-evaluation"
                        // rowHeights="30"
                        height="auto"
                        // readOnly={btnType == "btnInvalidData" ? false : true}
                        readOnly={true}
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

export default ExpValidate