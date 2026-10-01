import React, { Fragment, useState, useEffect, forwardRef, Component, FC, useRef } from "react"
import { HotTable, HotColumn } from "@handsontable/react";
import Flatpickr from 'react-flatpickr'
import toast from 'react-hot-toast';
import {
    Row,
    Col,
} from 'reactstrap'
import { registerRenderer, textRenderer } from 'handsontable/renderers';
import errorCodeConfig from "../../../../configs/apiErrorCodeConfig";
import { getFailed, getDuplicate } from "./store";
import { useDispatch, useSelector } from 'react-redux'
import '@styles/react/libs/flatpickr/flatpickr.scss';
import Swal from 'sweetalert2'
import ReactPaginate from 'react-paginate';
import purchaseInvoiceService from "../../../../services/Reco/Purchase/purchaseInvoiceService";
import gstr1PurchaseInvoiceService from "../../../../services/gstr1/gstr1Services/gstr1PurchaseInvoiceService";
// import "handsontable/dist/handsontable.full.min.css";
import { registerAllModules } from 'handsontable/registry'
import Handsontable from "handsontable";
import { PageSize ,  RowSize, columnHeaderSize } from "@configs/config";
import { handleValidateExcel, validationErrorMessage } from "../../../../helper/validation";

registerAllModules();
let isActive = false;

const validColumns = [
    {
        data: 'srNo',
        title: "Sr No.",
        width: 50,
    },
    {
        data: 'description',
        title: 'Description',
        width: 200,
    },

    {
        data: 'nilRatedSupplies',
        title: 'Nil rated supplies',
        width: 200,
    },
    {
        data: 'exempted',
        title: 'Exempted(Other than Nil rated/non-GST supply)',
        width: 200,
    },
    {
        data: 'nonGstSupplies',
        title: 'Non GST Supplies',
        width: 200,
    }
]

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
    {
        data: 'Description',
        title: 'Description',
        // width: 200,

    },
    {
        data: 'NilRatedSupplies',
        title: 'Nil rated supplies',
        type: "numeric",
        numericFormat: {
            pattern: '0,0.00',
            culture: 'en-IN'
        },
        // width: 200,

    },
    {
        data: 'Exempted',
        title: 'Exempted(Other than Nil rated/non-GST supply)',
        type: "numeric",
        numericFormat: {
            pattern: '0,0.00',
            culture: 'en-IN'
        },
        // width: 200,

    },
    {
        data: 'NonGstSupplies',
        title: 'Non GST Supplies',
        type: "numeric",
        numericFormat: {
            pattern: '0,0.00',
            culture: 'en-IN'
        },
        // width: 200,
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

console.log("arrInvalid=", arrInvalid, newR)

const arrValid = validColumns.map((item) => {
    return {
        data: item.data
    }
})
let newValid = [];
const emptyColumns = [...validColumns.slice(1)]

validColumns.map((item) => {
    newValid.push(item.title)
})
const emptyHeaders = [...newValid.slice(1)]

console.log("arrInvalid=", arrInvalid, newR);

const ExempValidate = ({ data, btnType, tabRecord, activeTab, clearFilter, errorArr, setErrorArr }) => {

    const [invalidaDatarows, setvalidaDatarows] = useState([]);
    const [block1, setBlock1] = useState(false);
    const [page, setPage] = useState(0);
    const [pageCount, setPageCount] = useState(1);
    const dispatch = useDispatch()
    const store = useSelector(state => state.gstr1ExcelData)
    const [currentCol, setCurrentCol] = useState([]);
    const [currentCol1, setCurrentCol1] = useState();
    const [searchVal1, setSearchVal1] = useState([]);
    const [searchDate, setSearchDate] = useState("");

    const storeSales = useSelector(
        (state) => state.gstr1ExcelData?.GSTR1_EXCEL_VALIDATE
      );

    const hotRef = useRef(null);
    const hotRef2 = useRef(null);

    let exempDup = [];
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

    const theader = (col, TH) => {
        if (col == 0 || col ==1 || col ==2 || col === 7) {
            const button = TH.children[0].children[0];
            button?.parentNode?.removeChild(button);
        }

        if (col == 4 ||
            col == 5 ||
            col == 6 ) {

            TH.className = 'htRight'
        }
        else {
            TH.className = 'htLeft'
        }

    }
    if (store?.duplicateData?.length) {
        for (let item of store?.duplicateData) {
            if (item.sheetName?.toLowerCase() == "exemp") {
                // console.log("item3=", item);
                exempDup.push(item.data)
            } else {
                allDataDuplicate.push(item)
            }
        }
    }
    const exempDuplicateData = exempDup.length ? exempDup[0] : [];
    console.log("exempduplicate data=", exempDuplicateData);
    console.log("all data=", allDataDuplicate);

    let exempFail = []
    let allDataFailed = [];
    if (store?.failedData?.length) {
        for (let item of store?.failedData) {
            if (item.sheetName?.toLowerCase() == "exemp") {
                // console.log("item3=", item);
                exempFail.push(item.data)
            } else {
                allDataFailed.push(item)
            }
        }
    }
    const exempFailedData = exempFail.length ? exempFail[0] : [];
    console.log("all data=", allDataFailed)


    const handlePageClick = (event) => {
        setPage(event?.selected);

    };

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

                if (colIndex == 4 || colIndex == 5 || colIndex == 6 ) {
                    const oldVal = change[i][2]
                    // Check if the edited value is numeric
                    if (isNaN(value)) {
                        cellObj.validationMsg = "Only Numeric Value Allowed";
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

        var newPayloadFail = exempFailedData;

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

    const sheetData = (i = "exemp") => {
        const failedIndex = data?.failedData?.findIndex((item) => item?.sheetName?.toLowerCase() == i);
        console.log("sheet index", failedIndex);
        return data?.failedData?.[failedIndex]
    }

    const sheetName = sheetData()?.sheetName;
    const GUID = sheetData()?.guid;
    const sheetId = sheetData()?.sheetId;

    const loadImpg = () => {
        console.log("data in exemp=", data);
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
                payloadSheet.status = 0;

                if (store?.GSTR1_EXCEL_VALIDATE?.length > 0 ) {
                    const arrError1 = store?.GSTR1_EXCEL_VALIDATE[0]?.EXEMP;
                    const arrError2 = exempFailedData;
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
                //         const arrError2 = exempFailedData;
                //         const arrError = arrError1.map(obj => arrError2.find(o => o.id === obj.id) || obj);
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
                //     // setBlock(false)
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

                if (store?.GSTR1_EXCEL_VALIDATE?.length > 0 ) {

                    tabRecord(
                      store?.GSTR1_EXCEL_VALIDATE[0]?.EXEMP?.length,
                      sheetName,
                      sheetId,
                      status
                    );
                    setvalidaDatarows(store?.GSTR1_EXCEL_VALIDATE[0]?.EXEMP);
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
                //     // setBlock(false)
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
                    const arrDuplicate1 = store?.GSTR1_EXCEL_VALIDATE[0]?.EXEMP.map(
                      (item) => {
                        return {
                          ...item,
                          writable: true,
                        };
                      }
                    );
                    const arrDuplicate2 =  exempDuplicateData;
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
                //         const arrDuplicate2 = exempDuplicateData;
                //         console.log("compare array", arrDuplicate1, arrDuplicate2);
                //         const arrDuplicate = arrDuplicate1.map(obj => arrDuplicate2?.find(o => o.id === obj.id) || obj);
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
        } //  I am Coming
    }

    useEffect(() => {
        // debugger
        loadImpg();
        isActive = false;
        dispatch(getDuplicate([]));;
    }, [btnType, searchVal1])

    useEffect(() => {
        return () => setBlock1(false)
    }, [])

    useEffect(() => {

        setSearchVal1([]);
        setCurrentCol([])

    }, [clearFilter])

    useEffect(() => {
        loadImpg()
        if(store == undefined){
            setBlock1(true)
        }
        else{
            setBlock1(false)
        }
    },[storeSales])



    // ** Filter
    function FilterData(arr) {
        let addArr = [];
        let updatedData = [];
        let finalObj = {};

        for (let i = 0; i < arr.length; i++) {
          Object.assign(finalObj, arr[i]);
        }

        let gridDataFilter =  store?.GSTR1_EXCEL_VALIDATE != undefined || store?.GSTR1_EXCEL_VALIDATE != null  ? store?.GSTR1_EXCEL_VALIDATE[0].EXEMP : [];
        console.log(gridDataFilter,"gridDataFilter")

        updatedData = gridDataFilter
          .filter((DescriptionItem) =>
            finalObj.Description?.length
              ? DescriptionItem.Description?.toLowerCase().includes(
                  finalObj.Description.toLowerCase()
                )
              : DescriptionItem
          )
          .filter((NilRatedSuppliesItem) =>
            finalObj.NilRatedSupplies?.length
              ? NilRatedSuppliesItem.NilRatedSupplies?.toLowerCase().includes(
                  finalObj.NilRatedSupplies?.toLowerCase()
                )
              : NilRatedSuppliesItem
          )

          .filter((ExemptedItem) =>
            finalObj.Exempted?.length
              ? ExemptedItem.Exempted?.toLowerCase().includes(
                  finalObj.Exempted?.toLowerCase()
                )
              : ExemptedItem
          )
          .filter((NonGstSuppliesItem) =>
            finalObj.NonGstSupplies?.length
              ? NonGstSuppliesItem.NonGstSupplies?.toLowerCase().includes(
                  finalObj.NonGstSupplies?.toLowerCase()
                )
              : NonGstSuppliesItem
          )


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
                    {gridData?.length ? <HotTable
                     rowHeights={RowSize}
                     columnHeaderHeight={columnHeaderSize}
                        // style={{ overflow:"scroll" }}
                        height='auto'
                        autoColumnSize={true}
                        stretchH='all'
                        // width='auto'
                        ref={hotRef}
                        // width={1550}
                        data={gridData ? gridData : []}
                        preventOverflow="horizontal"
                        rowHeaders={false}
                        // columns={btnType == 'btnInvalidData' ? invalidColumns.slice(1) : btnType == 'btnDuplicateData' ? invalidColumns : validColumns}
                        columns={invalidColumns}
                        hiddenColumns={{
                            columns: btnType == 'btnValidData' ? [0, 1, 2] : btnType == 'btnInvalidData' ? [0, 1] : [1, 2]
                        }}
                        colHeaders={(x) => colHeaders(x)}
                        comments={true}
                        // maxRows={pageCount * 10}
                        // colWidths={205}
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
                      //  commentedCellClassName="custom-cell"

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
                                    col == 4 ||
                                    col == 5 ||
                                    col == 6
                                ) {
                                    if (!reg.test(e.key)) {
                                        e.preventDefault();
                                    }
                                }
                            }
                        }}
                        // dropdownMenu={['filter_by_condition', 'filter_by_value', 'filter_action_bar']}
                        filters={true}
                        nestedRows={true}
                        contextMenu={false}
                        bindRowsWithHeaders={true}
                        afterOnCellMouseDown={localAfterOnCellMouseDown}
                        beforeSetRangeStart={btnType == "btnDuplicateData" && localBeforeSetRangeStart}
                        afterGetColHeader={theader}
                        // dropdownMenu={['filter_by_value', 'filter_action_bar']}
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
                        afterOnCellMouseDown={localAfterOnCellMouseDown}
                        ref={hotRef2}
                        stretchH='all'
                        style={{ textAlign: "center" }}
                        data={[{ "Description": "No Data Found!" }]}
                        mergeCells={[{ row: 0, col: 3, rowspan: 1, colspan: 4 }]}
                        columns={invalidColumns}
                        hiddenColumns={{
                            columns: [0, 1, 2]
                        }}
                        comments={false}
                        colHeaders={emptyHeaders}
                        // hiddenColumns={{
                        //     columns: btnType == 'btnDuplicateData' ? [1] : [0]
                        // }}
                        // dropdownMenu={['filter_by_value', 'filter_action_bar']}
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

export default ExempValidate