import React, { Fragment, useState, useEffect, forwardRef, Component, FC, useRef } from "react"
import { registerRenderer, textRenderer } from 'handsontable/renderers';
import { Row, Col } from "reactstrap";

import { HotTable, HotColumn } from "@handsontable/react";
import { getFailed, getDuplicate } from "./store";
import { useDispatch, useSelector } from 'react-redux'
import '@styles/react/libs/flatpickr/flatpickr.scss';
import ReactPaginate from 'react-paginate';
import { registerAllModules } from 'handsontable/registry';
import Handsontable from "handsontable";
import { PageSize, RowSize, columnHeaderSize } from "@configs/config";

import LocalFunction from '@configs/getLocalFunction';
import { globleVariable } from '@configs/globalVariable';
import moment from "moment";
import { handleValidateExcel, validationErrorMessage } from "../../../../helper/validation";

let isActive = false;

registerAllModules();

const serverDateTime = LocalFunction.getLocalValue(globleVariable.serverDateTime, true);
const maxDate = JSON.parse(serverDateTime).toString().split("T")[0];
const maxShowDate = new Date(maxDate);


const invalidColumns = [
    { data: "isActive", type: "checkbox", readOnly: false, width: 25 },
    {
        data: 'srNo',
        title: "Sr No.",
        // width: 50,
        frozen: true,
        cellClass: "SrNoGCol"
    },
    {
        data: 'ErrorList',
        title: "Error",
        readOnly: true,
        width: 250,
    },
    { title: 'GSTIN/UIN of Recipient', data: 'RecipientGSTIN' },
    { title: 'Receiver Name', data: 'ReceiverName' },
    {
        title: 'Note Number', data: 'InvoiceNumber',

    },
    {
        title: 'Note Date', data: 'InvoiceDate', type: 'date',
        dateFormat: 'DD-MM-YYYY',
        // allowInvalid: false,
        correctFormat: true,
        width: 110,
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
    { title: 'Note Type', data: 'NoteType' },
    { title: 'Place Of Supply', data: 'PlaceOfSupply' },
    { title: 'Reverse Charge', data: 'ReverseCharge' },

    { title: 'Note Supply Type', data: 'InvoiceType' },
    {
        title: 'Note Value', data: 'InvoiceValue',
        type: "numeric",
        numericFormat: {
            pattern: '0,0.00',
            culture: 'en-IN'
        },
    },
    {
        title: 'Applicable % of Tax Rate', data: 'ApplicableOfTaxRate',
        type: "numeric",
        numericFormat: {
            pattern: '0,0.00',
            culture: 'en-IN'
        },
    },

    // { title: 'E-Commerce GSTIN', data: 'eComGSTIN' },0..
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
        title:'Company GSTIN',
        data:'CompanyGSTIN',
        readOnly:'true',
        width: 150
      }


]
//** button - Action column
function myLables(instance, td, row, col, prop, value, cellProperties) {
    Handsontable.renderers.TextRenderer.apply(this, arguments);
    td.innerHTML = `<div class="truncated">${value !== null && value !== "" ? value : ""}</div>`
}

const CdnrValidate = ({ data, btnType, tabRecord, activeTab, clearFilter, errorArr, setErrorArr }) => {

    const [invalidaDatarows, setvalidaDatarows] = useState([]);
    const [block1, setBlock1] = useState(false);
    const [page, setPage] = useState(0);
    const dispatch = useDispatch()
    const store = useSelector(state => state.gstr1ExcelData);
    const hotRef2 = useRef(null);
    const [searchDate, setSearchDate] = useState('');
    const [searchDate1, setSearchDate1] = useState("");
    const [currentCol, setCurrentCol] = useState([]);
    const [currentCol1, setCurrentCol1] = useState();
    const [searchVal1, setSearchVal1] = useState([]);
    const storeSales = useSelector(
        (state) => state.gstr1ExcelData?.GSTR1_EXCEL_VALIDATE
    );
    console.log(store, "storeeeee")

    const hotRef = useRef(null);

    let cdnrDup = [];
    let allDataDuplicate = [];

    useEffect(() => {
        return () => setBlock1(false)
    }, [])

    useEffect(() => {

        setSearchVal1([]);
        setCurrentCol([])
        loadImpg();
        setSearchDate("");
        setSearchDate1("");
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


    const colHeaders = (col) => {
        let txt;
        switch (col) {
            case 0:
                txt = "<input type=\'checkbox\' class=\'checker\'  ";
                txt += isActive ? 'checked="checked"' : '';
                txt += ">";
                return txt;
        }
    }


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
            event.stopPropagation()
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

    const theader = (col, TH) => {

        if (col == 0 || col == 2 || col == 22) {
            const button = TH.children[0].children[0];
            button?.parentNode?.removeChild(button);
        }

        if (col == 11 ||
            col == 12 ||
            col == 13 ||
            col == 14 ||
            col == 15) {

            TH.className = 'htRight'
        }
        else {
            TH.className = 'htLeft'
        }
    }

    if (store?.duplicateData?.length) {
        for (let item of store?.duplicateData) {
            if (item.sheetName?.toLowerCase() == "cdnr") {
                // console.log("item3=", item);
                cdnrDup.push(item.data)
            } else {
                allDataDuplicate.push(item)
            }
        }
    }
    const cdnrDuplicateData = cdnrDup.length ? cdnrDup[0] : [];

    let cdnrFail = []
    let allDataFailed = [];
    if (store?.failedData?.length) {
        for (let item of store?.failedData) {
            if (item.sheetName?.toLowerCase() == "cdnr") {
                // console.log("item3=", item);
                cdnrFail.push(item.data)
            } else {
                allDataFailed.push(item)
            }
        }
    }
    const cdnrFailedData = cdnrFail.length ? cdnrFail[0] : [];

    const handlePageClick = (event) => {
        setPage(event?.selected);

    };


    const sheetData = (i = "cdnr") => {
        const failedIndex = data?.failedData?.findIndex((item) => item?.sheetName?.toLowerCase() == i);

        return data?.failedData?.[failedIndex]
    }

    const sheetName = sheetData()?.sheetName;
    const GUID = sheetData()?.guid;
    const sheetId = sheetData()?.sheetId;


    const loadImpg = () => {
        // setBlock1(true);
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
        console.log("data in cdnr=", data);
        if (data !== null) {
            if (store?.GSTR1_EXCEL_VALIDATE?.length > 0) {

                if (btnType == 'btnInvalidData') {
                    payloadSheet.status = 0;

                    if (store?.GSTR1_EXCEL_VALIDATE?.length > 0) {
                        const arrError1 = store?.GSTR1_EXCEL_VALIDATE[0].CDNR.map((item) => {
                            return {
                                ...item
                            };
                        });

                        // store?.GSTR1_EXCEL_VALIDATE[0]?.CDNR;
                        const arrError2 = cdnrFailedData;
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


                } else if (btnType == 'btnValidData') {
                    payloadSheet.status = 1;

                    if (store?.GSTR1_EXCEL_VALIDATE?.length > 0) {

                        tabRecord(
                            store?.GSTR1_EXCEL_VALIDATE[0]?.CDNR?.length,
                            sheetName,
                            sheetId,
                            status
                        );
                        setvalidaDatarows(store?.GSTR1_EXCEL_VALIDATE[0]?.CDNR);
                    } else {
                        setvalidaDatarows([]);
                        tabRecord(0, sheetName, sheetId, status);
                    }

                } else {
                    payloadSheet.status = 2;

                    if (store?.GSTR1_EXCEL_VALIDATE?.length > 0) {
                        const arrDuplicate1 = store?.GSTR1_EXCEL_VALIDATE[0]?.CDNR.map(
                            (item) => {
                                return {
                                    ...item

                                };
                            }
                        );
                        const arrDuplicate2 = cdnrDuplicateData;

                        const arrDuplicate = arrDuplicate1.map(
                            (obj) =>
                                arrDuplicate2?.find((o) => o.RowGUIDReact === obj.RowGUIDReact) ||
                                obj
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
    }


    useEffect(() => {

        if (activeTab == 4) {

            loadImpg()
        }
        isActive = false;
        dispatch(getDuplicate([]));;
    }, [btnType,])

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
                if (colIndex == 5 || colIndex == 11 || colIndex == 12 || colIndex == 13 || colIndex == 14 || colIndex == 15) {
                
                    if (isNaN(value) && colIndex !== 5 && value !== '') {
                        cellObj.validationMsg = "Only Numeric Value Allowed"
                        setErrorArr(pre => [...pre, cellObj])
                    }
                    else if (!(/^[a-zA-Z0-9\/\-]+$/.test(value)) && value !== '' && colIndex === 5) {
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


        let y;

        var newPayloadFail = cdnrFailedData;

        for (let i = 0; btnType == "btnInvalidData" ? i <= change?.length : i < change?.length; i++) {

            y = gridData[change[i]?.[0]]
            if (y) {
                console.log("y=", y, change)
                if (btnType == "btnInvalidData") {

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
                    // console.log("time payload=", payload);
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

    function FilterData(arr) {
        let addArr = [];
        let updatedData = [];
        let finalObj = {};

        for (let i = 0; i < arr.length; i++) {
            Object.assign(finalObj, arr[i]);
        }

        let gridDataFilter = store?.GSTR1_EXCEL_VALIDATE != undefined || store?.GSTR1_EXCEL_VALIDATE != null ? store?.GSTR1_EXCEL_VALIDATE[0].CDNR : [];


        updatedData = gridDataFilter
            .filter((RecipientGSTINItem) =>
                finalObj.RecipientGSTIN?.length
                    ? RecipientGSTINItem.RecipientGSTIN?.toLowerCase().includes(
                        finalObj.RecipientGSTIN.toLowerCase()
                    )
                    : RecipientGSTINItem
            )
            .filter((ReceiverNameItem) =>
                finalObj.ReceiverName?.length
                    ? ReceiverNameItem.ReceiverName?.toLowerCase().includes(
                        finalObj.ReceiverName.toLowerCase()
                    )
                    : ReceiverNameItem
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
            .filter((InvoiceValueItem) =>
                finalObj.InvoiceValue?.length
                    ? InvoiceValueItem.InvoiceValue?.toLowerCase().includes(
                        finalObj.InvoiceValue?.toLowerCase()
                    )
                    : InvoiceValueItem
            )
            .filter((PlaceOfSupplyItem) =>
                finalObj.PlaceOfSupply?.length
                    ? PlaceOfSupplyItem.PlaceOfSupply?.toLowerCase().includes(
                        finalObj.PlaceOfSupply?.toLowerCase()
                    )
                    : PlaceOfSupplyItem
            )
            .filter((ReverseChargeItem) =>
                finalObj.ReverseCharge?.length
                    ? ReverseChargeItem.ReverseCharge?.toLowerCase().includes(
                        finalObj.ReverseCharge?.toLowerCase()
                    )
                    : ReverseChargeItem
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
            .filter((NoteTypeItem) =>
                finalObj.NoteType?.length
                    ? NoteTypeItem.NoteType?.toLowerCase().includes(
                        finalObj.NoteType?.toLowerCase()
                    )
                    : NoteTypeItem
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
            );


        const dataFilter = updatedData.map((item) => {
            return {
                ...item
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
                    {gridData?.length ? <HotTable
                        rowHeights={RowSize}
                        columnHeaderHeight={columnHeaderSize}
                        ref={hotRef}
                        autoColumnSize={{
                            samplingRatio: 23, // Adjust the samplingRatio as needed
                        }}
                        stretchH='all'
                        data={gridData ? gridData : []}
                        preventOverflow="horizontal"
                        columns={invalidColumns}
                        rowHeaders={false}
                        colHeaders={(x) => colHeaders(x)}
                        comments={true}
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
                                let col = this?.getSelectedLast()?.[1];

                                if (
                                    col == 11 ||
                                    col == 12 ||
                                    col == 13 ||
                                    col == 14 ||
                                    col == 15
                                ) {
                                    if (!reg.test(e.key)) {
                                        e.preventDefault();
                                    }
                                }
                                if ((col == 5) && !(/^[a-zA-Z0-9\/\-]+$/.test(e.key))) {
                                    e.preventDefault()
                                }
                            }
                        }}

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

                        hiddenColumns={{
                            columns: btnType == 'btnValidData' ? [0, 1, 2] : btnType == 'btnInvalidData' ? [0, 1] : [1, 2]
                        }}

                        filters={true}
                        nestedRows={true}
                        contextMenu={false}
                        bindRowsWithHeaders={true}
                        afterOnCellMouseDown={localAfterOnCellMouseDown}
                        beforeSetRangeStart={btnType == "btnDuplicateData" && localBeforeSetRangeStart}
                        afterGetColHeader={theader}

                        dropdownMenu={{
                            items: {

                                filter_by_value: {
                                    name: "Search Value",
                                    // hide the 'Filter by value' list from all columns but the first one
                                    hidden() {
                                        const hot = hotRef?.current?.hotInstance;
                                        // console.log("noon col", hot?.getSelected()?.[0]?.[1], hot);
                                        return this.getSelected()[0][1] == 6 || this.getSelected()[0][1] == 20;

                                    },
                                },

                                "option2": {
                                    name: `Select Date <br><input type='date' min='2017-07-01' max=${new Date().toISOString().slice(0, 10)} class='custom-date col-md-11' placeholder='DD-MM-YYYY' id='custom1' name='date' value=${searchDate}>`,
                                    hidden() {
                                        return this.getSelectedRangeLast().to.col != 6
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
                                        return this.getSelectedRangeLast().to.col != 20
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

                                                if (hot?.getSelected()?.[0]?.[1] != 6 && hot?.getSelected()?.[0]?.[1] != 20) {
                                                    var searchInput = document.querySelector(
                                                        ".htUIMultipleSelectSearch.htUIInput"
                                                    );
                                                    var value = "";
                                                } else {
                                                    var searchInput1 = document.getElementById('custom1');
                                                    var value = "";
                                                    hot?.getSelected()?.[0]?.[1] == 6 && setSearchDate(value);
                                                    hot?.getSelected()?.[0]?.[1] == 20 && setSearchDate1(value);
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


                                if (hot?.getSelected()?.[0]?.[1] != 6 && hot?.getSelected()?.[0]?.[1] != 20) {
                                    var searchInput = document.querySelector(
                                        ".htUIMultipleSelectSearch.htUIInput"
                                    );
                                    var value = searchInput?.children[0]?.value;

                                } else {
                                    var searchInput1 = document.getElementById('custom1');
                                    var value = searchInput1?.value;
                                    var searchInput2 = document.getElementById('custom2');
                                    var value2 = searchInput2?.value;
                                    hot?.getSelected()?.[0]?.[1] == 6 && setSearchDate(value)
                                    hot?.getSelected()?.[0]?.[1] == 20 && setSearchDate1(value2)


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
                        }
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
                        ref={hotRef2}
                        stretchH='all'
                        style={{ textAlign: "center" }}
                        data={[{ "RecipientGSTIN": "No Data Found!" }]}
                        mergeCells={[{ row: 0, col: 3, rowspan: 1, colspan: 13 }]}
                        columns={invalidColumns}

                        hiddenColumns={{
                            columns: [0, 1, 2]
                        }}
                        comments={false}
                        afterOnCellMouseDown={localAfterOnCellMouseDownEmpty}
                        dropdownMenu={{
                            items: {

                                filter_by_value: {
                                    name: "Search Value",
                                    // hide the 'Filter by value' list from all columns but the first one
                                    hidden() {
                                        const hot = hotRef?.current?.hotInstance;
                                        // console.log("noon col", hot?.getSelected()?.[0]?.[1], hot);
                                        return this.getSelected()[0][1] == 6 || this.getSelected()[0][1] == 20;

                                    },
                                },

                                "option2": {
                                    name: `Select Date <br><input type='date' min='2017-07-01' max=${new Date().toISOString().slice(0, 10)} class='custom-date col-md-11' placeholder='DD-MM-YYYY' id='custom1' name='date' value=${searchDate}>`,
                                    hidden() {
                                        return this.getSelectedRangeLast().to.col != 6
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
                                        return this.getSelectedRangeLast().to.col != 20
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

                                                if (hot?.getSelected()?.[0]?.[1] != 6 && hot?.getSelected()?.[0]?.[1] != 20) {
                                                    var searchInput = document.querySelector(
                                                        ".htUIMultipleSelectSearch.htUIInput"
                                                    );
                                                    var value = "";
                                                } else {
                                                    var searchInput1 = document.getElementById('custom1');
                                                    var value = "";
                                                    hot?.getSelected()?.[0]?.[1] == 6 && setSearchDate(value);
                                                    hot?.getSelected()?.[0]?.[1] == 20 && setSearchDate1(value);
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


                                if (hot?.getSelected()?.[0]?.[1] != 6 && hot?.getSelected()?.[0]?.[1] != 20) {
                                    var searchInput = document.querySelector(
                                        ".htUIMultipleSelectSearch.htUIInput"
                                    );
                                    var value = searchInput?.children[0]?.value;

                                } else {
                                    var searchInput1 = document.getElementById('custom1');
                                    var value = searchInput1?.value;
                                    var searchInput2 = document.getElementById('custom2');
                                    var value2 = searchInput2?.value;
                                    hot?.getSelected()?.[0]?.[1] == 6 && setSearchDate(value)
                                    hot?.getSelected()?.[0]?.[1] == 20 && setSearchDate1(value2)


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
                        }

                        filters={true}
                        afterChange={() => { console.log("hi") }}
                        nestedRows={true}
                        contextMenu={false}
                        bindRowsWithHeaders={true}
                        licenseKey="non-commercial-and-evaluation"
                        height="auto"
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
            {/* </InfiniteScroll> */}
        </div>
        {invalidaDatarows?.length ? <ReactPaginate
            breakLabel="..."
            nextLabel=""
            onPageChange={handlePageClick}
            pageRangeDisplayed={2}
            forcePage={page}
            pageCount={pageCountClientSide}
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

export default CdnrValidate