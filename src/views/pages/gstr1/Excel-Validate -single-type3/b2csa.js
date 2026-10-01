import React, { Fragment, useState, useEffect, forwardRef, Component, FC, useRef } from "react"
import { registerRenderer, textRenderer } from 'handsontable/renderers';
import { HotTable, HotColumn } from "@handsontable/react";
import { Row, Col, Button } from "reactstrap";
import Flatpickr from 'react-flatpickr'
import toast from 'react-hot-toast';
import errorCodeConfig from "../../../../configs/apiErrorCodeConfig";
import { getFailed, getDuplicate } from "./store";
import { registerAllModules } from 'handsontable/registry';
import { useDispatch, useSelector } from 'react-redux'
// ** Styles
import Swal from 'sweetalert2'
import ReactDOM from "react-dom";
import '@styles/react/libs/flatpickr/flatpickr.scss';

import ReactPaginate from 'react-paginate';
// import 'handsontable/dist/handsontable.full.min.css';
import purchaseInvoiceService from "../../../../services/Reco/Purchase/purchaseInvoiceService";
import gstr1PurchaseInvoiceService from "../../../../services/gstr1/gstr1Services/gstr1PurchaseInvoiceService";
import { json } from "react-router-dom";
import Handsontable from "handsontable";
import { PageSize,  RowSize, columnHeaderSize } from "@configs/config";
import moment from "moment";
import { handleValidateExcel, validationErrorMessage } from "../../../../helper/validation";

registerAllModules();

let isActive = false;

const invalidColumns = [
    { data: "isActive", type: "checkbox", readOnly: false, width: 25 },
    {
        data: 'srNo',
        title: "Sr No.",
        // width: 80,
    },
    {
        data: 'ErrorList',
        title: "Error",
        readOnly: true,
         width: 250
    },

    {
        title: 'Financial Year', data: 'FinancialYear',
        type: "numeric"
    },
    {
        title: 'Original Month', data: 'OriginalMonth',
        type: "numeric"
    },
    { title: 'Place Of Supply', data: 'PlaceOfSupply' },
    { title: 'Type', data: 'Type' },
    {
        title: 'Applicable % of Tax Rate', data: 'ApplicableOfTaxRate',
        type: "numeric",
        numericFormat: {
            pattern: '0,0.00',
            culture: 'en-IN'
        },
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
    { title: 'E-Commerce GSTIN', data: 'EComGSTIN' },
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
    td.innerHTML = `<div class="truncated">${value !== null && value !== "" ? value : "" }</div>`
  }

let newWidth = [];


const B2csaValidate = ({ data, btnType, tabRecord, activeTab, clearFilter, errorArr, setErrorArr }) => {

    // grid data - invalid

    const [invalidaDatarows, setvalidaDatarows] = useState([]);
    const [block1, setBlock1] = useState(false);
    const [rowHeight, setRowHeight] = useState(30);
    const [topLeft, settopLeft] = useState({});
    const [page, setPage] = useState(0);
    // const [currentCol, setCurrentCol] = useState(null);
    const [currentCol, setCurrentCol] = useState([]);
    const [currentCol1, setCurrentCol1] = useState();
    const [searchVal1, setSearchVal1] = useState([]);
    const [pageCount, setPageCount] = useState(1);
    const [payloadDuplicate, setPayloadDuplicate] = useState([])
    const dispatch = useDispatch()
    const store = useSelector(state => state.gstr1ExcelData);
    const [searchDate, setSearchDate] = useState('');
    const storeSales = useSelector(
        (state) => state.gstr1ExcelData?.GSTR1_EXCEL_VALIDATE
      );


    let b2csaDup = [];
    let allDataDuplicate = [];
    if (store?.duplicateData?.length) {
        for (let item of store?.duplicateData) {
            if (item.sheetName?.toLowerCase() == "b2csa") {
                // console.log("item3=", item);
                b2csaDup.push(item.data)
            } else {
                allDataDuplicate.push(item)
            }
        }
    }
    const b2csaDuplicateData = b2csaDup.length ? b2csaDup[0] : [];
    console.log("b2csaduplicate data=", b2csaDuplicateData);
    console.log("all data=", allDataDuplicate)


    let b2csaFail = []
    let allDataFailed = [];

    useEffect(() => {
        return () => setBlock1(false)
    }, [])

    if (store?.failedData?.length) {
        for (let item of store?.failedData) {
            if (item.sheetName?.toLowerCase() == "b2csa") {
                // console.log("item3=", item);
                b2csaFail.push(item.data)
            } else {
                allDataFailed.push(item)
            }
        }
    }
    let b2csaFailedData = b2csaFail.length ? b2csaFail[0] : [];
    console.log("all data=", allDataFailed);
    console.log("b2csa failed data=", b2csaFailedData);

    // debugger

    const handlePageClick = (event) => {
        setPage(event?.selected);

    };

    function emptyRender(instance, td, row, col, prop, value, cellProperties) {
        textRenderer.apply(this, arguments);
        // if row contains negative number
        if (!value || value === '') {
            // td.style.borderColor = 'red';
            // td.style.borderWidth = "0.5px";

            // td.style.background = 'blue';
        }

    }

    useEffect(() => {
        loadb2()
        if(store == undefined){
            setBlock1(true)
        }
        else{
            setBlock1(false)
        }
    },[storeSales])

    const hotRef = useRef(null);
    const hotRef2 = useRef(null);
    console.log("hotref=", hotRef)

    const hot = hotRef?.current?.hotInstance;
    const sheetData = (i = "b2csa") => {
        const failedIndex = data?.failedData?.findIndex((item) => item?.sheetName?.toLowerCase() == i);
        console.log("sheet index", failedIndex);
        return data?.failedData?.[failedIndex]
    }

    const sheetName = sheetData()?.sheetName;
    const GUID = sheetData()?.guid;
    const sheetId = sheetData()?.sheetId;

    console.log("searchvalue1 in b2csa=", searchVal1)

    const loadb2 = () => {
        console.log("data in b2csa=", data);
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
        if (data !== null) {
            if (btnType == 'btnInvalidData') {
                payloadSheet.status = 0;

                if (store?.GSTR1_EXCEL_VALIDATE?.length > 0 ) {
                    const arrError1 = store?.GSTR1_EXCEL_VALIDATE[0]?.B2CSA;
                    const arrError2 = b2csaFailedData;
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

                if (store?.GSTR1_EXCEL_VALIDATE?.length > 0 ) {

                    tabRecord(
                      store?.GSTR1_EXCEL_VALIDATE[0]?.B2CSA?.length,
                      sheetName,
                      sheetId,
                      status
                    );
                    setvalidaDatarows(store?.GSTR1_EXCEL_VALIDATE[0]?.B2CSA);
                  } else {
                    setvalidaDatarows([]);
                    tabRecord(0, sheetName, sheetId, status);
                  }


            } else {
                payloadSheet.status = 2;

                if (store?.GSTR1_EXCEL_VALIDATE?.length > 0) {
                    const arrDuplicate1 = store?.GSTR1_EXCEL_VALIDATE[0]?.B2CSA.map(
                      (item) => {
                        return {
                          ...item
                        };
                      }
                    );
                    const arrDuplicate2 = b2csaDuplicateData;

                    const arrDuplicate = arrDuplicate1.map(
                      (obj) =>
                        arrDuplicate2?.find((o) => o.RowGUIDReact === obj.RowGUIDReact) ||
                        obj
                    );
                    tabRecord(arrDuplicate2.length, sheetName, sheetId, status);

                    setvalidaDatarows(arrDuplicate ? arrDuplicate : arrDuplicate1);


                  } else {
                    setvalidaDatarows([]);
                  }
            }
        }
    }


    useEffect(() => {

        if (activeTab == 18) {
            loadb2();
        }

        isActive = false;
        dispatch(getDuplicate([]));;
    }, [btnType,  activeTab])

    useEffect(() => {

        setSearchVal1([]);
        setCurrentCol([])
        loadb2();

    }, [clearFilter])




    const theader = (col, TH) => {


        if ( col == 0 || col == 2 || col == 15) {
            const button = TH.children[0].children[0];
            button.parentNode.removeChild(button);
        }
        if (col == 3 ||
            col == 4 ||
            col == 7 ||
            col == 8 ||
            col == 9 ||
            col == 10) {

            TH.className = 'htRight'
        }
        else {
            TH.className = 'htLeft'
        }


    }

    const theader1 = (col, TH) => {

        if (col > 15 || col == 0 || col == 2) {
            const button = TH.children[0].children[0];
            button.parentNode.removeChild(button);
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
                    validationMsg: 'Only Numeric Value Allowed',
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
                if (colIndex == 3 || colIndex == 4 || colIndex == 7 || colIndex == 8 || colIndex == 9 || colIndex == 10) {
                    const oldVal = change[i][2]
                    
                    // Check if the edited value is numeric
                    if (isNaN(value)) {
                        cellObj.validationMsg = "Only Numeric Value Allowed"
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

        var newPayloadFail = b2csaFailedData;

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
                    let matchingElements= invalidaDatarows.filter((item)=>{
                        return  newPayloadFail.find((item2)=>item2.RowGUIDReact == item.RowGUIDReact)
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
                    dispatch(getDuplicate(payload))
                }
            }
            console.log("time by value1", y);
        }

        console.log("time by value2", y);

    }

    function localAfterOnCellMouseDown(event, coords, td) {
        const hot = hotRef?.current?.hotInstance;
        const totalRows = hot.countRows();
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
        if (event.target.classList.contains('checker')) {
            event.stopPropagation()
            setBlock1(true);

            if (!isActive) {
                event.stopPropagation();
                isActive = true;

                setTimeout(() => {
                    for (let index = 0; index < totalRows; index++) {
                        console.log("total counts b2csa", totalRows, index);
                        hot.setDataAtCell(index, 0, true);
                        (index == totalRows - 1) ? setBlock1(false) : "";
                    }
                }, 50);

            } else {
                event.stopPropagation();
                isActive = false;

                setTimeout(() => {
                    for (let index = 0; index < totalRows; index++) {
                        console.log("total counts b2csa", totalRows, index);
                        hot.setDataAtCell(index, 0, false);
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

    const columnName = invalidColumns
    console.log(currentCol, "=current column")

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

    function FilterData(arr) {
        let addArr = [];
        let updatedData = [];
        let finalObj = {};

        for (let i = 0; i < arr.length; i++) {
          Object.assign(finalObj, arr[i]);
        }

        let gridDataFilter =  store?.GSTR1_EXCEL_VALIDATE != undefined || store?.GSTR1_EXCEL_VALIDATE != null  ? store?.GSTR1_EXCEL_VALIDATE[0].B2CSA : [];
        console.log(gridDataFilter,"gridDataFilter")

        updatedData = gridDataFilter
          .filter((FinancialYearItem) =>
            finalObj.FinancialYear?.length
              ? FinancialYearItem.FinancialYear?.toLowerCase().includes(
                  finalObj.FinancialYear.toLowerCase()
                )
              : FinancialYearItem
          )
          .filter((OriginalMonthItem) =>
            finalObj.OriginalMonth?.length
              ? OriginalMonthItem.OriginalMonth?.toLowerCase().includes(
                  finalObj.OriginalMonth?.toLowerCase()
                )
              : OriginalMonthItem
          )

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
        .filter((EComGSTINItem) =>
        finalObj.EComGSTIN?.length
          ? EComGSTINItem.EComGSTIN?.toLowerCase().includes(
              finalObj.EComGSTIN?.toLowerCase()
            )
          : EComGSTINItem
      )
      .filter((TypeItem) =>
      finalObj.Type?.length
        ? TypeItem.Type?.toLowerCase().includes(
            finalObj.Type?.toLowerCase()
          )
        : TypeItem
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
                <Col md={12} >
                    {gridData?.length ?

                        <HotTable
                        rowHeights={RowSize}
                        columnHeaderHeight={columnHeaderSize}
                            // style={{ overflow:"scroll" }}
                            autoColumnSize={true}
                            stretchH='all'
                            height='auto'
                            // copyPaste={true}
                            // columnSorting={true}
                            ref={hotRef}
                            data={gridData ? gridData : []}
                            preventOverflow="horizontal"
                            rowHeaders={false}
                            columns={invalidColumns}
                            // columns={btnType == 'btnInvalidData' ? invalidColumns.slice(1) : btnType == 'btnDuplicateData' ? invalidColumns : validColumns}
                            colHeaders={(x) => colHeaders(x)}
                            // afterChange={(x, y) => cellChange(x, y)}
                            afterChange={(x, y) => {
                                console.log(x,"xxxxxxx")
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
                                        col == 3 ||
                                        col == 4 ||
                                        col == 7 ||
                                        col == 8 ||
                                        col == 9 ||
                                        col == 10
                                    ) {
                                        if (!reg.test(e.key)) {
                                            e.preventDefault();
                                        }
                                    }
                                }
                            }}
                            comments={true}
                            // maxRows={pageCount * 10}
                            afterGetColHeader={theader}
                            afterPaste={afterPasteData}

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
                                            if (src.tagName.toLowerCase() === 'button') {


                                                if (clickEvent.target.id == 'btnClear') {
                                                    // console.log("custom menu2", key, selection, clickEvent, src,data);


                                                    const hot = hotRef?.current?.hotInstance;

                                                    // if (hot.getSelected()?.[0]?.[1] != 5) {
                                                    //     var searchInput = document.querySelector(
                                                    //         ".htUIMultipleSelectSearch.htUIInput"
                                                    //     );
                                                    //     var value = "";
                                                    // } else {
                                                        var searchInput1 = document.getElementById('custom1');
                                                        var value = "";
                                                        setSearchDate(value)
                                                    // }
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
                                                    // page == 0 ? loadb2() : setPage(0);

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
                                        var searchInput = document.querySelector(
                                            ".htUIMultipleSelectSearch.htUIInput"
                                        );
                                        var value = searchInput?.children[0]?.value;
                                        console.log("res1", value);
                                    // } else {
                                    //     var searchInput1 = document.getElementById('custom1');
                                    //     var value = searchInput1.value;
                                    //     setSearchDate(value)
                                    //     console.log("res2", value);
                                    // }
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
                                    // page == 0 ? loadb2() : setPage(0);

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

                           // commentedCellClassName="custom-cell"
                           cells={function (row, col, prop) {

                            const cellPrp = {};

                             if (col== 2) {
                                if(gridData[row]?.ErrorList?.length > 33){
                                  cellPrp.comment = {
                                    value: gridData[row]?.ErrorList,style: { width: 200, height: 50 },
                                    readOnly: true
                                  }
                                }
                              cellPrp.renderer = myLables;
                            }
                          return cellPrp;
                          }}

                            filters={true}
                            // columnSorting={[3,4]}
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
                            beforeCreateRow={function (index, amount) {
                                let countRow = this?.countRows();
                                if (this?.isEmptyRow(countRow - 0)) {
                                  return false;
                                }
                                return true;
                              }}
                        /> :
                        <HotTable
                        rowHeights={RowSize}
                        columnHeaderHeight={columnHeaderSize}
                            autoColumnSize={true}
                            ref={hotRef2}
                            comments={false}
                            afterGetColHeader={theader}
                            stretchH='all'
                            style={{ textAlign: "center" }}
                            data={[{ "FinancialYear": "No Data Found!" }]}
                            mergeCells={[{ row: 0, col: 3, rowspan: 1, colspan: 9 }]}
                            columns={invalidColumns}
                            // hiddenColumns={false}
                            hiddenColumns={{
                                columns: [0, 1, 2]
                            }}
                            // colHeaders={(x) => colHeaders(x)}
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

                                                    // if (hot.getSelected()?.[0]?.[1] != 5) {
                                                    //     var searchInput = document.querySelector(
                                                    //         ".htUIMultipleSelectSearch.htUIInput"
                                                    //     );
                                                    //     var value = "";
                                                    // } else {
                                                        var searchInput1 = document.getElementById('custom1');
                                                        var value = "";
                                                        setSearchDate(value)
                                                    // }
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
                                                    page == 0 ? loadb2() : setPage(0);

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
                                        var searchInput = document.querySelector(
                                            ".htUIMultipleSelectSearch.htUIInput"
                                        );
                                        var value = searchInput?.children[0]?.value;
                                        console.log("res1", value);
                                    // } else {
                                    //     var searchInput1 = document.getElementById('custom1');
                                    //     var value = searchInput1.value;
                                    //     setSearchDate(value)
                                    //     console.log("res2", value);
                                    // }
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
                                    // page == 0 ? loadb2() : setPage(0);
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
                    {console.log("length=", invalidColumns?.length)}
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

export default B2csaValidate


