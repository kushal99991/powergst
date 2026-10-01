import React, { Fragment, useState, useEffect, forwardRef, Component, FC, useRef } from "react"
import { Row, Col } from "reactstrap";

import Flatpickr from 'react-flatpickr'
import toast from 'react-hot-toast';

import errorCodeConfig from "../../../../configs/apiErrorCodeConfig";
import { getFailed, getDuplicate } from "./store";
import { useDispatch, useSelector } from 'react-redux'
// ** Styles
import Swal from 'sweetalert2'
import ReactDOM from "react-dom";
import '@styles/react/libs/flatpickr/flatpickr.scss';
import ReactPaginate from 'react-paginate';
import purchaseInvoiceService from "../../../../services/Reco/Purchase/purchaseInvoiceService";
import gstr1PurchaseInvoiceService from "../../../../services/gstr1/gstr1Services/gstr1PurchaseInvoiceService";

import { HotTable, HotColumn } from "@handsontable/react";
import Handsontable from "handsontable";
import { registerRenderer, textRenderer } from "handsontable/renderers";
import { registerAllModules } from "handsontable/registry";

import { PageSize ,  RowSize, columnHeaderSize } from "@configs/config";
import { handleValidateExcel, validationErrorMessage } from "../../../../helper/validation";

const Rates = ['0.000', '0.100', '0.250', '1.000', '1.500', '3.000', '5.000', '6.000', '7.500', '12.000', '18.000', '28.000'];
const ReverseCharge = ['Yes', 'No']
const EligibilityForITC = ['Input', 'Capital goods', 'Input services', 'Ineligible']
registerAllModules();

export function RatedropDownEditor({ row, onRowChange }) {
    return (
        <select
            value={row.rate}
            onChange={(event) => onRowChange({ ...row, rate: event.target.value }, true)}
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
// registerAllModules();
let isActive = false;

export function ReverseChargedropDownEditor({ row, onRowChange }) {
    return (
        <select
            value={row.invoiceType}
            onChange={(event) => onRowChange({ ...row, invoiceType: event.target.value }, true)}
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
            onChange={(event) => onRowChange({ ...row, eligibilityForITC: event.target.value }, true)}
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
        data: 'srNo',
        title: "Sr No.",
        // width: 80,
    },
    {
        data: 'hsn',
        title: 'HSN',
        // width: 200,
        frozen: true,

    },
    {
        data: 'description',
        title: 'Description',
        // width: 200,

    },
    {
        data: 'uqc',
        title: 'UQC',
        // width: 200
    },
    {
        data: 'totalQuantity',
        title: 'Total Quantity',
        type: "numeric",
        numericFormat: {
            pattern: '0,0.00',
            culture: 'en-IN'
        },

        // width: 200
    },
    {
        data: 'totalValue',
        title: 'Total Value (₹)',
        // width: 200
    },
    {
        data: 'taxableValue',
        title: 'Taxable Value (₹)',
        // width: 200
    },
    {
        data: 'integratedTaxPaid',
        title: 'Integrated Tax Amount (₹)',
        // width: 200
    },
    {
        data: 'centralTaxPaid',
        title: 'Central Tax Amount (₹)',
        // width: 200
    },
    {
        data: 'stateUTTaxPaid',
        title: 'State/UT Tax Amount (₹)',
        // width: 200
    },
    {
        data: 'cessPaid',
        title: 'Cess Amount (₹)',
        // width: 200
    },
]


const invalidColumns = [
    { data: "isActive", type: "checkbox", readOnly: false, width: 25 },
    {
        data: 'srNo',
        title: "Sr No.",
        // width: 80,
        frozen: true,
        cellClass: "SrNoGCol"
    },
    {
        data: 'ErrorList',
        title: "Error",
        readOnly: true,
        width: 250,
        // cellClass: "CellWithComment Errorcellvalue",

    },

    {
        data: 'HSN',
        title: 'HSN',
        width: 100,
    },
    {
        data: 'Description',
        title: 'Description',
             width: 200,


    },
    {
        data: 'UQC',
        title: 'UQC',
        // width: 150,


    },
    {
        data: 'TotalQty',
        title: 'Total Quantity',
        type: "numeric",
        numericFormat: {
            pattern: '0,0.00',
            culture: 'en-IN'
        },
        // width: 150,
    },
    {
        data: 'TotalValue',
        title: 'Total Value (₹)',
        type: "numeric",
        numericFormat: {
            pattern: '0,0.00',
            culture: 'en-IN'
        },

    },
    {
        data: 'Rate',
        title: 'Rate',
        type: "numeric",
        numericFormat: {
            pattern: '0,0.00',
            culture: 'en-IN'
        },

    },
    {
        data: 'TaxableValue',
        title: 'Taxable Value (₹)',
        type: "numeric",
        numericFormat: {
            pattern: '0,0.00',
            culture: 'en-IN'
        },


    },
    {
        data: 'IGST',
        title: 'Integrated Tax Amount (₹)',
        type: "numeric",
        numericFormat: {
            pattern: '0,0.00',
            culture: 'en-IN'
        },
        // width: 150,

    },
    {
        data: 'CGST',
        title: 'Central Tax Amount (₹)',
        type: "numeric",
        numericFormat: {
            pattern: '0,0.00',
            culture: 'en-IN'
        },
        // width: 150,

    },
    {
        data: 'SGST',
        title: 'State/UT Tax Amount (₹)',
        type: "numeric",
        numericFormat: {
            pattern: '0,0.00',
            culture: 'en-IN'
        },
        // width: 150,

    },
    {
        data: 'Cess',
        title: 'Cess Amount (₹)',
        type: "numeric",
        numericFormat: {
            pattern: '0,0.00',
            culture: 'en-IN'
        },
        // width: 150,

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
    td.innerHTML = `<div class="truncated">${value !== null && value !== "" ? value : "" }</div>`
  }

const arrInvalid = invalidColumns.map((item) => {
    return {
        data: item.data
    }
})
let newR = []


invalidColumns.map((item, index) => {
    newR.push(`${item.title}`)
})

let newWidth = []
invalidColumns.map((item) => {
    newWidth.push(item.width)
})

console.log("arrInvalid=", arrInvalid, newR)

const arrValid = validColumns.map((item) => {
    return {
        data: item.key
    }
})
let newValid = [];
const emptyColumns = invalidColumns

validColumns.map((item) => {
    newValid.push(item.title)
})
const emptyHeaders = [...newValid.slice(1)]

console.log("arrInvalid=", arrInvalid, newR)

function emptyRender(instance, td, row, col, prop, value, cellProperties) {
    textRenderer.apply(this, arguments);
    // if row contains negative number
    if (!value || value === '') {
        console.log("hii", row, col);
        // td.style.borderColor = 'red';
        // td.style.borderWidth = "0.5px";

        // td.style.background = 'blue';
    }
    // td.style.background = '';
}

const HsnValidate = ({ data, btnType, tabRecord, activeTab, clearFilter, errorArr, setErrorArr }) => {

    const [invalidaDatarows, setvalidaDatarows] = useState([]);
    const [block1, setBlock1] = useState(false);
    const [rowHeight, setRowHeight] = useState(30);
    const [topLeft, settopLeft] = useState({});
    const [page, setPage] = useState(0);
    const [pageCount, setPageCount] = useState(1);
    const [payloadDuplicate, setPayloadDuplicate] = useState([])
    const dispatch = useDispatch()
    const store = useSelector(state => state.gstr1ExcelData)
    const [currentCol, setCurrentCol] = useState([]);
    const [currentCol1, setCurrentCol1] = useState();
    const [searchVal1, setSearchVal1] = useState([]);
    const [searchDate, setSearchDate] = useState("[]");

    const storeSales = useSelector(
        (state) => state.gstr1ExcelData?.GSTR1_EXCEL_VALIDATE
      );

    const hotRef = useRef(null);
    const hotRef2 = useRef(null);

    let hsnsumDup = [];
    let allDataDuplicate = [];

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
        // const totalRows = hot.countRows();
        // if (event.target.classList.contains('checker')) {
        //     event.stopPropagation();
        //     setBlock1(true);

        //     if (!isActive) {
        //         event.stopPropagation();
        //         isActive = true;
        //         setTimeout(() => {
        //             for (let index = 0; index < totalRows; index++) {
        //                 console.log("total counts b2b", totalRows, index);
        //                 hot.setDataAtCell(index, 0, true);
        //                 (index == totalRows - 1) ? setBlock1(false) : "";
        //             }
        //         }, 50);
        //     } else {
        //         event.stopPropagation();
        //         isActive = false;
        //         setTimeout(() => {
        //             for (let index = 0; index < totalRows; index++) {
        //                 console.log("total counts b2b", totalRows, index);
        //                 hot.setDataAtCell(index, 0, false);
        //                 (index == totalRows - 1) ? setBlock1(false) : "";
        //             }
        //         }, 50);
        //     }
        // }
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
    // function localAfterOnCellMouseDownEmpty(event, coords, td) {
    //     const Index = currentCol?.findIndex((item) => invalidColumns[coords?.col]?.data == item);

    //     if (Index != -1) {
    //       setTimeout(function () {
    //         var searchInput = document?.querySelector('.htUIMultipleSelectSearch.htUIInput');
    //         if (searchInput !== null) {
    //           searchInput.children[0].value = searchVal1[Index]
    //         }

    //       }, 200)
    //     } else {
    //       setTimeout(function () {
    //         var searchInput = document?.querySelector('.htUIMultipleSelectSearch.htUIInput');        // searchInput.children[0].innerHTML ="hii1"
    //         if (searchInput !== null) {
    //           searchInput.children[0].value = ""
    //         }

    //       }, 100)
    //     }
    //     setCurrentCol1(coords?.col);

    // }
// let arrFilter = [];

    const theader = (col, TH) => {
        if (col === 0 || col ==1|| col ===2 || col === 14 ) {
            //debugger
            const button = TH?.children[0]?.children[0];
            button?.parentNode?.removeChild(button);
        }
        // if (currentCol.length > 0) {

        //     let uniq = [...new Set(currentCol)];


        //     for (let i = 0; i < uniq.length; i++) {
        //         var obj = {};

        //         for (let j = 0; j < searchVal1.length; j++) {
        //           if (i == j) {
        //             obj[uniq[i]] = searchVal1[j]?.trim();
        //             arrFilter.push(obj);
        //           }
        //         }
        //       }

        //       let finalObj = {};
        //       for (let i = 0; i < arrFilter.length; i++) {
        //         Object.assign(finalObj, arrFilter[i]);
        //       }

        //       columnName.forEach((ele, index) => {
        //         const columnIndex = index;
        //         const buttonExists = document.querySelector(`.ht_clone_top thead th:nth-child(${columnIndex + 1}) button`);

        //         const columnMatchesCondition = Object.keys(finalObj).includes(ele.data);
        //         // uniq.some(col1 => ele?.data.includes(col1));

        //         // Check if column value is not null
        //      const columnValueValid = finalObj[ele.data] !== null && finalObj[ele.data] !== "";

        //         if (buttonExists && columnMatchesCondition && columnValueValid) {
        //             // const TH = document.querySelector(`.tab-pane.active .ht_clone_top thead th:nth-child(${columnIndex + 1})`);
        //             const TH = document.querySelector(`.ht_clone_top thead th:nth-child(${columnIndex + 1})`);

        //             if (TH && currentCol.length) {
        //                 TH.classList.add("htFiltersActive");
        //             } else {
        //                 TH.classList.remove("htFiltersActive");
        //             }
        //         }
        //     });
        // }

        // if (btnType == "btnInvalidData") {
        //     if (col === 0 || col === 1 || col === 3 || col === 4 || col === 5) {
        //         const button = TH.children[0].children[0];
        //         button?.parentNode?.removeChild(button);
        //     }
        // }
        // if (btnType == "btnValidData") {
        //     if (col === 0 || col === 2 || col === 3 || col === 4) {
        //         const button = TH.children[0].children[0];
        //         button?.parentNode?.removeChild(button);
        //     }
        // }
        // if (btnType == "btnDuplicateData") {
        //     if (col === 1 || col === 3 || col === 4 || col == 0 || col == 2) {
        //         const button = TH.children[0].children[0];
        //         button.parentNode.removeChild(button);
        //     }
        // }
        if (col >= 6 && col < 14) {
            TH.className = 'htRight'
        }
        else {
            TH.className = 'htLeft'
        }
    }

    // const theader1 = (col, TH) => {

    //     if (col > 9 || col == 1 || col == 2 || col == 3) {
    //         const button = TH.children[0].children[0];
    //         button.parentNode.removeChild(button);
    //     }
    // }


    if (store?.duplicateData?.length) {
        for (let item of store?.duplicateData) {
            if (item.sheetName?.toLowerCase() == "hsn") {
                // console.log("item3=", item);
                hsnsumDup.push(item.data)
            } else {
                allDataDuplicate.push(item)
            }
        }
    }
    const hsnsumDuplicateData = hsnsumDup.length ? hsnsumDup[0] : [];
    console.log("hsnsumduplicate data=", hsnsumDuplicateData);
    console.log("all data=", allDataDuplicate);

    let hsnsumFail = []
    let allDataFailed = [];
    if (store?.failedData?.length) {
        for (let item of store?.failedData) {
            if (item.sheetName?.toLowerCase() == "hsn") {
                // console.log("item3=", item);
                hsnsumFail.push(item.data)
            } else {
                allDataFailed.push(item)
            }
        }
    }
    const hsnsumFailedData = hsnsumFail.length ? hsnsumFail[0] : [];
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

                if (colIndex == 3 || colIndex < 14) {
                    const oldVal = change[i][2]
                    // Check if the edited value is numeric
                    if (isNaN(value) && colIndex !== 5 && colIndex !==4) {
                        cellObj.validationMsg = "Only Numeric Value Allowed";
                        setErrorArr(pre => [...pre, cellObj])
                    }
                    else if (!(/^[a-zA-Z0-9\/\-]+$/.test(value))  && colIndex === 5) {
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

        var newPayloadFail = hsnsumFailedData;
        console.log("time payload=1", newPayloadFail, allDataFailed);


        console.log("change paste=", change);
        for (let i = 0; btnType == "btnInvalidData" ? i <= change?.length : i < change?.length; i++) {

            // console.log("time by value", change[i][0])
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
                    // let matchingElements= invalidaDatarows.filter((item)=>{
                    //     return  newPayloadFail.find((item2)=>item2.RowGUIDReact == item.RowGUIDReact)
                    //     })
                    //     // newPayloadFail = matchingElements
                    //     newPayloadFail = [...JSON.parse(JSON.stringify(matchingElements))]

                    const payload = [{
                        sheetId: sheetId,
                        sheetName: sheetName,
                        guid: GUID,
                        totalRecords: newPayloadFail.length?.toString(),
                        data: newPayloadFail
                        // totalRecords: JSON.parse(JSON.stringify(invalidaDatarows?.length?.toString())),
                        // data: JSON.parse(JSON.stringify(invalidaDatarows))
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
                    // dispatch(getFailed(payload.sheetId, payload.sheetName, payload.guid, payload.data));
                    dispatch(getDuplicate(payload))
                }
            }
            console.log("time by value1", y);
        }




        console.log("time by value2", y);

    }

    const sheetData = (i = "hsn") => {
        const failedIndex = data?.failedData?.findIndex((item) => item?.sheetName?.toLowerCase() == i);
        console.log("sheet index", failedIndex);
        return data?.failedData?.[failedIndex]
    }

    const sheetName = sheetData()?.sheetName;
    const GUID = sheetData()?.guid;
    const sheetId = sheetData()?.sheetId;

    const loadImpg = () => {
        console.log("data in hsnsum=", data);
        // setBlock1(true)
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
            if(store?.GSTR1_EXCEL_VALIDATE?.length > 0){
            if (btnType == 'btnInvalidData') {
                console.log("res hsn1=");
                // debugger
                payloadSheet.status = 0;

                if (store?.GSTR1_EXCEL_VALIDATE?.length > 0 ) {
                    const arrError1 = store?.GSTR1_EXCEL_VALIDATE[0].HSN.map((item) => {
                        return {
                          ...item
                        };
                      });

                    const arrError2 =  hsnsumFailedData;
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
                      store?.GSTR1_EXCEL_VALIDATE[0]?.HSN?.length,
                      sheetName,
                      sheetId,
                      status
                    );
                    setvalidaDatarows(store?.GSTR1_EXCEL_VALIDATE[0]?.HSN);
                  } else {
                    setvalidaDatarows([]);
                    tabRecord(0, sheetName, sheetId, status);
                  }


            } else {
                payloadSheet.status = 2;

                if (store?.GSTR1_EXCEL_VALIDATE?.length > 0) {
                    const arrDuplicate1 = store?.GSTR1_EXCEL_VALIDATE[0]?.HSN.map(
                      (item) => {
                        return {
                          ...item,
                          writable: true,
                        };
                      }
                    );
                    const arrDuplicate2 = hsnsumDuplicateData;
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

            }
         }
        }
    }


    useEffect(() => {
        if (activeTab == 10) {

            loadImpg();
        }
        isActive = false;
        dispatch(getDuplicate([]));;
    }, [btnType,  activeTab])

    useEffect(() => {
        return () => setBlock1(false)
    }, [])

    useEffect(() => {
        loadImpg()
        if(store == undefined){
            setBlock1(true)
        }
        else{
            setBlock1(false)
        }
    },[storeSales])


    useEffect(() => {

        setSearchVal1([]);
        setCurrentCol([])
        loadImpg();

    }, [clearFilter])


    // ** Search
    function FilterData(arr) {
        let addArr = [];
        let updatedData = [];
        let finalObj = {};

        for (let i = 0; i < arr.length; i++) {
          Object.assign(finalObj, arr[i]);
        }

        let gridDataFilter =  store?.GSTR1_EXCEL_VALIDATE != undefined || store?.GSTR1_EXCEL_VALIDATE != null  ? store?.GSTR1_EXCEL_VALIDATE[0].HSN : [];
        console.log(gridDataFilter,"gridDataFilter")

        updatedData = gridDataFilter

          .filter((HSNItem) =>
            finalObj.HSN?.length
              ? HSNItem.HSN?.toLowerCase().includes(
                  finalObj.HSN?.toLowerCase()
                //   moment(finalObj?.HSN).format("DD-MM-YYYY")
                )
              : HSNItem
          )
          .filter((DescriptionItem) =>
            finalObj.Description?.length
              ? DescriptionItem.Description?.toLowerCase().includes(
                  finalObj.Description?.toLowerCase()
                )
              : DescriptionItem
          )
          .filter((UQCItem) =>
            finalObj.UQC?.length
              ? UQCItem.UQC?.toLowerCase().includes(
                  finalObj.UQC?.toLowerCase()
                )
              : UQCItem
          )
          .filter((TotalQtyItem) =>
            finalObj.TotalQty?.length
              ? TotalQtyItem.TotalQty?.toLowerCase().includes(
                  finalObj.TotalQty?.toLowerCase()
                )
              : TotalQtyItem
          )
          .filter((TotalValueItem) =>
            finalObj.TotalValue?.length
              ? TotalValueItem.TotalValue?.toLowerCase().includes(
                  finalObj.TotalValue?.toLowerCase()
                )
              : TotalValueItem
          )

          .filter((RateItem) =>
            finalObj.Rate?.length
              ? RateItem.Rate?.toLowerCase().includes(finalObj.Rate?.toLowerCase())
              : RateItem
          )
          .filter((CessItem) =>
          finalObj.Cess?.length
            ? CessItem.Cess?.toLowerCase().includes(
                finalObj.Cess?.toLowerCase()
              )
            : CessItem
        )
          .filter((TaxableValueItem) =>
            finalObj.TaxableValue?.length
              ? TaxableValueItem.TaxableValue?.toLowerCase().includes(
                  finalObj.TaxableValue?.toLowerCase()
                )
              : TaxableValueItem
          )
          .filter((IGSTItem) =>
            finalObj.IGST?.length
              ? IGSTItem.IGST?.toLowerCase().includes(
                  finalObj.IGST?.toLowerCase()
                )
              : IGSTItem
          )
          .filter((CGSTItem) =>
            finalObj.CGST?.length
              ? CGSTItem.CGST?.toLowerCase().includes(
                  finalObj.CGST?.toLowerCase()
                )
              : CGSTItem
          )
          .filter((CGSTItem) =>
            finalObj.CGST?.length
              ? CGSTItem.CGST?.toLowerCase().includes(
                  finalObj.CGST?.toLowerCase()
                )
              : CGSTItem
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

    // const columnName = btnType == 'btnInvalidData' ? invalidColumns.slice(1) : btnType == 'btnDuplicateData' ? invalidColumns : validColumns
    const columnName = invalidColumns

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
                    {console.log(pageCount, "hsn pagecount", invalidaDatarows)}
                    {gridData?.length > 0 ?
                    <HotTable
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
                        comments={true}
                        // maxRows={pageCount * 25}

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
                                let col = this?.getSelectedLast()?.[1];

                                if (
                                    col == 3 || col >= 6
                                ) {
                                    if (!reg.test(e.key)) {
                                        e.preventDefault();
                                    }
                                }
                            }
                        }}

                        // autoColumnSize= {syncLimit: '40%'},
                        // colWidths={[100, 150, 150, 100, 100, 150]}
                       // commentedCellClassName="custom-cell"
                        // dropdownMenu={['filter_by_condition', 'filter_by_value', 'filter_action_bar']}
                        filters={true}
                        nestedRows={true}
                        contextMenu={false}
                        bindRowsWithHeaders={true}
                        afterOnCellMouseDown={localAfterOnCellMouseDown}
                        beforeSetRangeStart={btnType == "btnDuplicateData" && localBeforeSetRangeStart}

                         cells={function (row, col, prop) {

                          const cellPrp = {};

                              if (col == 2) {
                                if(gridData[row]?.ErrorList?.length > 33){
                                cellPrp.comment = {
                                  value: gridData[row]?.ErrorList,style: { width: 200, height: 50 },
                                  readOnly: true
                                }
                            }
                              cellPrp.renderer = myLables;
                              }

                              if (col == 4) {
                                if(invalidaDatarows[row]?.description?.length > 25){
                                cellPrp.comment = {
                                  value: invalidaDatarows[row]?.description,style: { width: 200, height: 70 },
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

                        mergeCells={false}
                        readOnly={btnType == "btnInvalidData" ? false : true}
                        licenseKey="non-commercial-and-evaluation"
                        // hiddenColumns={{
                        //     columns: btnType == 'btnDuplicateData' ? [1, 2] : [0]
                        // }}
                        hiddenColumns={{
                            columns: btnType == 'btnValidData' ? [0, 1, 2] : btnType == 'btnInvalidData' ? [0, 1] : [1, 2]
                        }}
                        afterGetColHeader={theader}
                        beforeCreateRow={function (index, amount) {
                            let countRow = this?.countRows();
                            if (this?.isEmptyRow(countRow - 0)) {
                              return false;
                            }
                            return true;
                          }}

                    /> : <HotTable
                    rowHeights={RowSize}
                    ref={hotRef2}
                    columnHeaderHeight={columnHeaderSize}
                        autoColumnSize={true}
                        afterGetColHeader={theader}
                        stretchH='all'
                        style={{ textAlign: "center" }}
                        data={[{ "HSN": "No Data Found!" }]}
                        mergeCells={[{ row: 0, col: 3, rowspan: 1, colspan: 11 }]}
                        columns={invalidColumns}
                        colHeaders={emptyHeaders}
                        afterOnCellMouseDown={localAfterOnCellMouseDown}
                        // hiddenColumns={false}
                        hiddenColumns={{
                            columns: [0, 1, 2]
                        }}
                        comments={false}
                        // colHeaders={emptyHeaders}
                        // hiddenColumns={{
                        //     columns: btnType == 'btnDuplicateData' ? [1] : [0]
                        // }}
                        // dropdownMenu={{
                        //     items: {

                        //         filter_by_value: {
                        //             name: "Search Value",
                        //             // hide the 'Filter by value' list from all columns but the first one
                        //         },


                        //         clear: {
                        //             name: `<button id='btnClear' name='Clear'   value='Clear'>Clear</button>`,
                        //             //disabled: true,
                        //             callback: function (key, selection, clickEvent) {
                        //                 console.log("date picker clicked");
                        //                 var src = clickEvent.target;
                        //                 console.log("name", src.tagName);
                        //                 if (src.tagName.toLowerCase() === 'button') {


                        //                     if (clickEvent.target.id == 'btnClear') {
                        //                         // console.log("custom menu2", key, selection, clickEvent, src,data);


                        //                         var searchInput = document.querySelector('.htUIMultipleSelectSearch.htUIInput');
                        //                         var value = "";
                        //                         // alert(data);

                        //                         const x = searchVal1;
                        //                         if (!searchVal1?.length) {
                        //                             x.push(value);
                        //                             let y = currentCol;
                        //                             y.push(emptyColumns[currentCol1]?.data);
                        //                             // console.log("jsx=",x,y)
                        //                             setSearchVal1(x);
                        //                             setCurrentCol(y);

                        //                             // forceUpdate();
                        //                         } else {
                        //                             const Index = currentCol?.findIndex((item) => emptyColumns[currentCol1]?.data == item)
                        //                             // if (item == emptyColumns[currentCol1]?.data)
                        //                             if (Index != -1) {
                        //                                 const xyz = searchVal1
                        //                                 xyz[Index] = value
                        //                                 setSearchVal1(xyz)
                        //                             } else {
                        //                                 x.push(value);
                        //                                 let y = currentCol;
                        //                                 y.push(emptyColumns[currentCol1]?.data);
                        //                                 // console.log("jsx=",x,y)
                        //                                 setSearchVal1(x);
                        //                                 setCurrentCol(y);
                        //                             }

                        //                         }
                        //                         page == 0 ? loadImpg() : setPage(0);
                        //                     }


                        //                     clickEvent.stopImmediatePropagation();
                        //                 }

                        //                 console.log("custom value", src.value);

                        //                 clickEvent.stopImmediatePropagation();

                        //             },
                        //         },


                        //         filter_action_bar: {

                        //         },

                        //     }
                        // }}

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
            forcePage={page}
            nextLabel=""
            onPageChange={handlePageClick}
            pageRangeDisplayed={2}
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

export default HsnValidate