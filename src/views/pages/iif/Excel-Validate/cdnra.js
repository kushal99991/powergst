import React, { Fragment, useState, useEffect, forwardRef, Component, FC, useRef } from "react"
import { registerRenderer, textRenderer } from 'handsontable/renderers';
import { Row, Col } from "reactstrap";
import Swal from 'sweetalert2'
import { HotTable, HotColumn } from "@handsontable/react";
import Flatpickr from 'react-flatpickr'
import toast from 'react-hot-toast';
import errorCodeConfig from "../../../../configs/apiErrorCodeConfig";
import { getFailed, getDuplicate } from "./store";
import { useDispatch, useSelector } from 'react-redux'
// import InfiniteScroll from "react-infinite-scroller";
// ** Styles
import ReactDOM from "react-dom";
import '@styles/react/libs/flatpickr/flatpickr.scss';
import ReactPaginate from 'react-paginate';

import purchaseInvoiceService from "../../../../services/Reco/Purchase/purchaseInvoiceService";
import gstr1PurchaseInvoiceService from "../../../../services/gstr1/gstr1Services/gstr1PurchaseInvoiceService";
// import "handsontable/dist/handsontable.full.min.css";
import { registerAllModules } from 'handsontable/registry';
import Handsontable from "handsontable";
import { PageSize ,  RowSize, columnHeaderSize } from "@configs/config";
import LocalFunction from '@configs/getLocalFunction';
import { globleVariable }  from '@configs/globalVariable';
import moment from "moment";
import { handleValidateExcel, validationErrorMessage } from "../../../../helper/validation";

let isActive = false;

const Rates = ['0.000', '0.100', '0.250', '1.000', '1.500', '3.000', '5.000', '6.000', '7.500', '12.000', '18.000', '28.000'];
const ReverseCharge = ['Yes', 'No']
const EligibilityForITC = ['Input', 'Capital goods', 'Input services', 'Ineligible']


registerAllModules();

var validClass = "";

const serverDateTime = LocalFunction.getLocalValue(globleVariable.serverDateTime,true);
const maxDate = JSON.parse(serverDateTime).toString().split("T")[0];
const maxShowDate = new Date(maxDate);
console.log('show max data' , maxShowDate )

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
        title: 'Original Note Number', data: 'OriginalInvoiceNumber',


    },
    {
        title: 'Original Note Date', data: 'OriginalInvoiceDate', type: 'date',
        dateFormat: 'DD-MM-YYYY',
        correctFormat: true,
        allowInvalid: false,
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
        title: 'Revised Note Number', data: 'RevisedInvoiceNumber',


    },
    {
        title: 'Revised Note Date', data: 'RevisedInvoiceDate', type: 'date',
        dateFormat: 'DD-MM-YYYY',
        correctFormat: true,
        allowInvalid: false,
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
    // { title: 'E-Commerce GSTIN', data: 'eComGSTIN' },
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


const CdnraValidate = ({ data, btnType, tabRecord, activeTab, clearFilter, errorArr, setErrorArr }) => {

    const [invalidaDatarows, setvalidaDatarows] = useState([]);
    const [block1, setBlock1] = useState(false);
    const [rowHeight, setRowHeight] = useState(30);
    const [topLeft, settopLeft] = useState({});
    const [page, setPage] = useState(0);
    const [pageCount, setPageCount] = useState(1);
    const [payloadDuplicate, setPayloadDuplicate] = useState([])
    const dispatch = useDispatch()
    const store = useSelector(state => state.gstr1ExcelData);
    const hotRef2 = useRef(null);
    const [searchDate, setSearchDate] = useState('');
    const [currentCol, setCurrentCol] = useState([]);
    const [currentCol1, setCurrentCol1] = useState();
    const [searchVal1, setSearchVal1] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [searchDate1, setSearchDate1] = useState('');
    const hotRef = useRef(null);

    const storeSales = useSelector(
        (state) => state.gstr1ExcelData?.GSTR1_EXCEL_VALIDATE
      );

    let cdnraDup = [];
    let allDataDuplicate = [];

    useEffect(() => {
        return () => setBlock1(false)
    }, [])

    useEffect(() => {


        setSearchVal1([]);
        setCurrentCol([])
        loadImpg()

    }, [clearFilter])


    const loadMore = () => {
        if (records === data.length) {
            setHasMore(false);
        } else {
            setTimeout(() => {
                setrecords(records + itemsPerPage);
            }, 2000);
        }
    };

    useEffect(() => {
        loadImpg()
        if(store == undefined){
            setBlock1(true)
        }
        else{
            setBlock1(false)
        }
    },[storeSales])

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
        const totalRows = hot.countRows();
        if (event.target.classList.contains('checker')) {
            event.stopPropagation()
            setBlock1(true);

            if (!isActive) {
                event.stopPropagation();
                isActive = true;
                setTimeout(() => {
                    for (let index = 0; index < totalRows; index++) {
                        console.log("total counts b2b", totalRows, index);
                        hot.setDataAtCell(index, 0, true);
                        (index == totalRows - 1) ? setBlock1(false) : "";
                    }
                }, 50);
            } else {
                event.stopPropagation();
                isActive = false;
                setTimeout(() => {
                    for (let index = 0; index < totalRows; index++) {
                        console.log("total counts b2b", totalRows, index);
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



    const theader = (col, TH) => {
             if (col == 0 || col == 1 || col == 2 || col == 21) {
                const button = TH.children[0].children[0];
                button?.parentNode?.removeChild(button);
            }

        if ( col == 13 ||
            col == 14 ||
            col == 15 ||
            col == 16 ||
            col == 17) {

            TH.className = 'htRight'
        }
        else {
            TH.className = 'htLeft'
        }

    }
    const theader1 = (col, TH) => {

        if (col > 15 || col == 3 || col == 4 || col == 5 || col == 7) {
            const button = TH.children[0].children[0];
            button.parentNode.removeChild(button);
        }
    }

    if (store?.duplicateData?.length) {
        for (let item of store?.duplicateData) {
            if (item.sheetName?.toLowerCase() == "cdnra") {
                // console.log("item3=", item);
                cdnraDup.push(item.data)
            } else {
                allDataDuplicate.push(item)
            }
        }
    }
    const cdnraDuplicateData = cdnraDup.length ? cdnraDup[0] : [];
    console.log("cdnraduplicate data=", cdnraDuplicateData);
    console.log("all data=", allDataDuplicate);

    let cdnraFail = []
    let allDataFailed = [];
    if (store?.failedData?.length) {
        for (let item of store?.failedData) {
            if (item.sheetName?.toLowerCase() == "cdnra") {
                // console.log("item3=", item);
                cdnraFail.push(item.data)
            } else {
                allDataFailed.push(item)
            }
        }
    }
    const cdnraFailedData = cdnraFail.length ? cdnraFail[0] : [];
    console.log("all data=", allDataFailed)

    const columnName = invalidColumns


    function emptyRender(instance, td, row, col, prop, value, cellProperties) {
        textRenderer.apply(this, arguments);
        // if row contains negative number
        if (!value || value === '') {
            // td.style.borderColor = 'red';
            // td.style.borderWidth = "0.5px";

            // td.style.background = 'blue';
        }
        // td.style.background = '';
    }

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
                // col == 5 || col == 7 || col == 9 || col == 12 || col == 15 || col == 16 || col == 17
                if (colIndex == 5 || colIndex == 7 || colIndex == 13 || colIndex == 14 || colIndex == 15 || colIndex == 16 || colIndex == 17) {
                    const oldVal = change[i][2]
                    
                    if (isNaN(value) && (colIndex !== 5 &&colIndex !== 7) && value !== '') {
                        cellObj.validationMsg = "Only Numeric Value Allowed"
                        setErrorArr(pre => [...pre, cellObj])
                    }
                    else if (!(/^[a-zA-Z0-9\/\-]+$/.test(value)) && value !== '' && (colIndex === 5 || colIndex === 7)) {
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

        var newPayloadFail = cdnraFailedData;

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

    const sheetData = (i = "cdnra") => {
        const failedIndex = data?.failedData?.findIndex((item) => item?.sheetName?.toLowerCase() == i);
        console.log("sheet index", failedIndex);
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
        console.log("data in cdnra=", data);
        if (data !== null) {
            if(store?.GSTR1_EXCEL_VALIDATE?.length > 0){
            if (btnType == 'btnInvalidData') {
                payloadSheet.status = 0;

                if (store?.GSTR1_EXCEL_VALIDATE?.length > 0 ) {
                    const arrError1 =  store?.GSTR1_EXCEL_VALIDATE[0]?.CDNRA.map(
                        (item) => {
                          return {
                            ...item
                          };
                        }
                      );

                    const arrError2 = cdnraFailedData;
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
                      store?.GSTR1_EXCEL_VALIDATE[0]?.CDNRA?.length,
                      sheetName,
                      sheetId,
                      status
                    );
                    setvalidaDatarows(store?.GSTR1_EXCEL_VALIDATE[0]?.CDNRA);
                  } else {
                    setvalidaDatarows([]);
                    tabRecord(0, sheetName, sheetId, status);
                  }


            } else {
                payloadSheet.status = 2;

                if (store?.GSTR1_EXCEL_VALIDATE?.length > 0) {
                    const arrDuplicate1 = store?.GSTR1_EXCEL_VALIDATE[0]?.CDNRA.map(
                      (item) => {
                        return {
                          ...item
                        };
                      }
                    );

                    const arrDuplicate2 =  cdnraDuplicateData;

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
    }


    useEffect(() => {

        if (activeTab == 11) {

            loadImpg()
        }
        isActive = false;
        dispatch(getDuplicate([]));;
    }, [btnType,  activeTab])

    function FilterData(arr) {
        let addArr = [];
        let updatedData = [];
        let finalObj = {};

        for (let i = 0; i < arr.length; i++) {
          Object.assign(finalObj, arr[i]);
        }

        let gridDataFilter =  store?.GSTR1_EXCEL_VALIDATE != undefined || store?.GSTR1_EXCEL_VALIDATE != null  ? store?.GSTR1_EXCEL_VALIDATE[0].CDNRA : [];
        console.log(gridDataFilter,"gridDataFilter")

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
          .filter((OriginalInvoiceNumberItem) =>
            finalObj.OriginalInvoiceNumber?.length
              ? OriginalInvoiceNumberItem.OriginalInvoiceNumber?.toLowerCase().includes(
                  finalObj.OriginalInvoiceNumber?.toLowerCase()
                )
              : OriginalInvoiceNumberItem
          )
          .filter((OriginalInvoiceDateItem) =>
            finalObj.OriginalInvoiceDate?.length
              ? OriginalInvoiceDateItem.OriginalInvoiceDate?.toLowerCase().includes(
                  // finalObj.InvoiceDate?.toLowerCase()
                  moment(finalObj?.OriginalInvoiceDate).format("DD-MM-YYYY")
                )
              : OriginalInvoiceDateItem
          )




          .filter((RevisedInvoiceNumberItem) =>
          finalObj.RevisedInvoiceNumber?.length
            ? RevisedInvoiceNumberItem.RevisedInvoiceNumber?.toLowerCase().includes(
                finalObj.RevisedInvoiceNumber?.toLowerCase()
              )
            : RevisedInvoiceNumberItem
        )
        .filter((RevisedInvoiceDateItem) =>
          finalObj.RevisedInvoiceDate?.length
            ? RevisedInvoiceDateItem.RevisedInvoiceDate?.toLowerCase().includes(
                // finalObj.InvoiceDate?.toLowerCase()
                moment(finalObj?.RevisedInvoiceDate).format("DD-MM-YYYY")
              )
            : RevisedInvoiceDateItem
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
          .filter((CessItem) =>
          finalObj.Cess?.length
            ? CessItem.Cess?.toLowerCase().includes(
                finalObj.Cess?.toLowerCase()
              )
            : CessItem
        )
        .filter((NoteTypeItem) =>
        finalObj.NoteType?.length
          ? NoteTypeItem.NoteType?.toLowerCase().includes(
              finalObj.NoteType?.toLowerCase()
            )
          : NoteTypeItem
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
                <Col md={12}>
                    {gridData?.length ? <HotTable
                        rowHeights={RowSize}
                        columnHeaderHeight={columnHeaderSize}

                        height='auto'

                        ref={hotRef}
                        autoColumnSize={true}
                        stretchH='all'

                        data={gridData ? gridData : []}
                        preventOverflow="horizontal"
                        columns={invalidColumns}
                        rowHeaders={false}
                        // columns={btnType == 'btnInvalidData' ? invalidColumns.slice(1) : btnType == 'btnDuplicateData' ? invalidColumns : validColumns}
                        colHeaders={(x) => colHeaders(x)}                    // colHeaders={btnType != 'btnDuplicateData' ? newR.slice(1) : newR}
                        // colWidths={newWidth}
                        comments={true}

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
                                let col = this?.getSelectedLast?.()?.[1];

                                if (

                                    col == 13 ||
                                    col == 14 ||
                                    col == 15 ||
                                    col == 16 ||
                                    col == 17
                                ) {
                                    if (!reg.test(e.key)) {
                                        e.preventDefault();
                                    }
                                }
                                if ((col == 5 || col == 7) && !(/^[a-zA-Z0-9\/\-]+$/.test(e.key))) {
                                    e.preventDefault()
                                }
                            }
                        }}
                        hiddenColumns={{
                            columns: btnType == 'btnValidData' ? [0, 1, 2] : btnType == 'btnInvalidData' ? [0, 1] : [1, 2]
                        }}
                        // hiddenColumns={{
                        //     columns: btnType == 'btnDuplicateData' ? [1, 2] : [0]
                        // }}
                        // autoColumnSize= {syncLimit: '40%'},
                        // colWidths={[100, 150, 150, 100, 100, 150]}
                       // commentedCellClassName="custom-cell"
                        // dropdownMenu={['filter_by_condition', 'filter_by_value', 'filter_action_bar']}
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
                                        console.log("noon col", hot.getSelected()?.[0]?.[1], hot);
                                        return this.getSelected()[0][1] == 6 || this.getSelected()[0][1] == 8 ;

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
                                        return this.getSelectedRangeLast().to.col != 8
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

                                                if (hot.getSelected()?.[0]?.[1] != 6 && hot.getSelected()?.[0]?.[1] != 8) {
                                                    var searchInput = document.querySelector(
                                                        ".htUIMultipleSelectSearch.htUIInput"
                                                    );
                                                    var value = "";
                                                } else {
                                                    if(hot.getSelected()?.[0]?.[1] == 6){
                                                        var searchInput1 = document.getElementById('custom1');
                                                        var value = "";
                                                        setSearchDate(value)
                                                        }
                                                        else if(hot.getSelected()?.[0]?.[1] == 8){
                                                            var searchInput1 = document.getElementById('custom2');
                                                            var value = "";
                                                            setSearchDate1(value)
                                                        }
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

                                // if (hot.getSelected()?.[0]?.[1] != (btnType == 'btnInvalidData' ? 4 : btnType == 'btnDuplicateData' ? 5 : 3)) {
                                    if (hot.getSelected()?.[0]?.[1] != 6 && hot.getSelected()?.[0]?.[1] != 8) {
                                    var searchInput = document.querySelector(
                                        ".htUIMultipleSelectSearch.htUIInput"
                                    );
                                    var value = searchInput?.children[0]?.value;
                                    console.log("res1", value);
                                } else {
                                    if(hot.getSelected()[0][1] == 6){
                                    var searchInput1 = document.getElementById('custom1');
                                    var value = searchInput1.value;
                                    setSearchDate(value)
                                    console.log("res2", value);
                                    }else{
                                        var searchInput2 =
                                        document.getElementById("custom2");
                                        var value = searchInput2?.value;
                                        setSearchDate1(value);
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
                        beforeCreateRow={function (index, amount) {
                            let countRow = this?.countRows();
                            if (this?.isEmptyRow(countRow - 0)) {
                              return false;
                            }
                            return true;
                          }}

                        mergeCells={false}
                        readOnly={btnType == "btnInvalidData" ? false : true}
                        licenseKey="non-commercial-and-evaluation"
                    /> : <HotTable
                        rowHeights={RowSize}
                        columnHeaderHeight={columnHeaderSize}
                        autoColumnSize={true}
                        afterGetColHeader={theader}
                        ref={hotRef2}
                        stretchH='all'
                        style={{ textAlign: "center" }}
                        data={[{ "RecipientGSTIN": "No Data Found!" }]}
                        mergeCells={[{ row: 0, col: 3, rowspan: 1, colspan: 15 }]}
                        columns={invalidColumns}
                        // hiddenColumns={false}
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
                                        const hot = hotRef2?.current?.hotInstance;
                                        // console.log("noon col", hot.getSelected()?.[0]?.[1], hot);
                                        return this?.getSelected()?.[0]?.[1] == 6 || this?.getSelected()?.[0]?.[1] == 8 ;

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
                                        return this.getSelectedRangeLast().to.col != 8
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

                                                if (hot.getSelected()?.[0]?.[1] != 6 && hot.getSelected()?.[0]?.[1] != 8) {
                                                    var searchInput = document.querySelector(
                                                        ".htUIMultipleSelectSearch.htUIInput"
                                                    );
                                                    var value = "";
                                                } else {
                                                    if(hot.getSelected()?.[0]?.[1] == 6){
                                                        var searchInput1 = document.getElementById('custom1');
                                                        var value = "";
                                                        setSearchDate(value)
                                                        }
                                                        else if(hot.getSelected()?.[0]?.[1] == 8){
                                                            var searchInput1 = document.getElementById('custom2');
                                                            var value = "";
                                                            setSearchDate1(value)
                                                        }
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

                                // if (hot.getSelected()?.[0]?.[1] != (btnType == 'btnInvalidData' ? 4 : btnType == 'btnDuplicateData' ? 5 : 3)) {
                                    if (hot.getSelected()?.[0]?.[1] != 6 && hot.getSelected()?.[0]?.[1] != 8) {
                                    var searchInput = document.querySelector(
                                        ".htUIMultipleSelectSearch.htUIInput"
                                    );
                                    var value = searchInput?.children[0]?.value;
                                    console.log("res1", value);
                                } else {
                                    if(hot.getSelected()[0][1] == 4){
                                    var searchInput1 = document.getElementById('custom1');
                                    var value = searchInput1.value;
                                    setSearchDate(value)
                                    console.log("res2", value);
                                    }else{
                                        var searchInput2 =
                                        document.getElementById("custom2");
                                        var value = searchInput2?.value;
                                        setSearchDate1(value);
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

export default CdnraValidate