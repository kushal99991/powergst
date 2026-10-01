import React from 'react'
import { useRef, forwardRef, useImperativeHandle } from "react";
import {
  Button, Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
} from "reactstrap";
import { useState } from "react";
import toast from "react-hot-toast";
import { useEffect } from "react";
import GSTR9Service from '../../../../services/gstr9/gstr9Service'
import { RowSize, columnHeaderSize } from "@configs/config";
import errorCodeConfig from '@configs/apiErrorCodeConfig'
import { ArrowLeft, ArrowRight, FilePlus, Trash2 } from "react-feather";
import Swal from "sweetalert2";
import { table4Column, table5Column } from "../gst9-columnData";
import HotTable from "@handsontable/react";
import withReactContent from "sweetalert2-react-content";
import ErrorTable from '../../../components/ErrorTable/ErrorTable';
const MySwal = withReactContent(Swal);

const Part2 = forwardRef(({ stepper, activeTab, block, setBlock, G_UCParId, finYearId, USerId, G_GSTIN, subscriptionId }, ref) => {

  const [open, setOpen] = useState(["1", "2"]);
  const [errorArr, setErrorArr] = useState([]);
  const hotRefTable4 = useRef(null);
  const hotRefTable5 = useRef(null);
  const [table4FetchData, setTable4FetchData] = useState([]);
  const [table5FetchData, setTable5FetchData] = useState([]);
  const [edited4Data, setEdited4Data] = useState([]);
  const [edited5Data, setEdited5Data] = useState([]);
  let checkIsPresentData = false;

  const toggle = (id) => {
    let setThisOpen = [...open]
    if (setThisOpen.includes(id)) {
      setThisOpen = setThisOpen.filter((item) => item !== id)
    } else {
      setThisOpen.push(id)
    }
    setOpen(setThisOpen)
  };

  const tables = {
    table4: "Part II (Tables: 4)",
    table5: "Part II (Tables: 5) "
  }

  // For Header AlignMent
  const theader = (col, TH) => {
    if (col == 0 || col == 1 || col == 7) {
      TH.className = "htLeft";
    } else {
      TH.className = "htRight";
    }
  };

  //** Fetch Data  */
  const getTab2SummaryData = (tableNumber = null) => {
    setBlock(true);

    GSTR9Service.gstr9Tab2FetchAllData(String(G_UCParId), finYearId, G_GSTIN, USerId, subscriptionId)
      .then((res) => {
        setBlock(false);
        if (
          res.status === 200 &&
          res.data.status === errorCodeConfig.APIDefaultCode.Success
        ) {

          console.log(res?.data?.data?.table4Data, 'res4')
          setTable4FetchData(res?.data?.data?.table4Data)

          setEdited4Data(false)

          if (tableNumber === 4) {
            refreshTable5RowN("all",table5FetchData, res?.data?.data?.table4Data)
          } else {
            setTable5FetchData(res?.data?.data?.table5Data)
            setEdited5Data(false)
          }

        } else {
          setBlock(false);
          toast.error(res?.data?.errorMessage, {
            position: "top-right",
          });
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
  };

  useEffect(() => {
    if (activeTab == 2) {
      getTab2SummaryData();
    }
  }, [activeTab]);

  const onValidateCell = (row, colIndex, table, newValue) => {

    let sanitizedValue =
      typeof newValue === "string"
        ? newValue.replace(/,/g, "")
        : newValue;

    const cellObj = {
      row: row,
      col: colIndex,
      table,
    };

    if (isNaN(sanitizedValue)) {
      setErrorArr((pre) => [...pre, cellObj]);
    } else {
      setErrorArr(
        errorArr.filter(
          (p) => !(p.row === cellObj.row && p.col === cellObj.col && p.table === cellObj.table),
        ),
      );
    }
    //else
      // setErrorArr((pre) =>
      //   pre.filter(
      //     (p) =>
      //       p.row !== cellObj.row &&
      //       p.col !== cellObj.col &&
      //       p.table !== cellObj.table
      //   )
      // );
  }

  const cellChangeTable4 = (change, source) => {
    if (
      (source === "edit" || source === "CopyPaste.paste" || source === "Autofill.fill") &&
      change &&
      change.length > 0
    ) {
      const oldData = [...table4FetchData];
      for (const [row, col, oldValue, newValue] of change) {
        const colIndex = table4Column.findIndex((obj) => obj.data === col);

        if ((row >= 0 && row <= 7) || (row >= 9 && row <= 10) || (row > 11 && row <= 13)) {
          if (colIndex > 1 && colIndex < 6) {
            onValidateCell(row, colIndex, tables.table4, newValue);
          }
        }

        if (typeof newValue === "string" || typeof newValue === "number") {
          setEdited4Data(true);
        }

        let rowId = null;
        if (col == "taxableValue") {
          rowId = 2;
        } else if (col == "igst") {
          rowId = 3;
        } else if (col == "cgst") {
          rowId = 4;
        } else if (col == "sgst") {
          rowId = 5;
        } else if (col == "cess") {
          rowId = 6;
        }

        if ((rowId && typeof newValue === "string") || typeof newValue === "number") {
          let sanitizedValue =
            typeof newValue === "string" ? newValue.replace(/,/g, "") : newValue;
          sanitizedValue = sanitizedValue ? sanitizedValue : 0;

          oldData[row][col] = sanitizedValue;

          let subTotalAToG = 0;
          for (var x = 0; x <= 6; x++) {
            subTotalAToG += oldData[x][col];
          }

          const totalOfG = oldData[14][col];
          const lastRowTotalAToG = subTotalAToG + totalOfG;

          if (!isNaN(subTotalAToG)) {
            oldData[7][col] = subTotalAToG.toFixed(2).toString();
          }

          if (!isNaN(lastRowTotalAToG)) {
            oldData[15][col] = (+lastRowTotalAToG).toFixed(2).toString();
          }

          var arrayObject = [];

          for (var x = 9; x <= 13; x++) {
            if (x == 11) {
              continue;
            }

            arrayObject.push(parseFloat(oldData[x][col]));
          }

          let subTotalIToL = 0;
          for (var x = 0; x < arrayObject?.length; x++) {
            if (x == 0 || x == 3) {
              subTotalIToL = parseFloat(subTotalIToL) - arrayObject[x];
            } else {
              subTotalIToL = parseFloat(subTotalIToL) + arrayObject[x];
            }
          }
          const totalOfH = oldData[7][col];
          const lastRowSubTotalItoL = parseFloat(totalOfH) + subTotalIToL;

          if (!isNaN(subTotalIToL)) {
            oldData[14][col] = subTotalIToL.toFixed(2).toString();
          }

          if (!isNaN(lastRowSubTotalItoL)) {
            oldData[15][col] = lastRowSubTotalItoL.toFixed(2).toString();
          }

          setTable4FetchData(oldData);
          refreshTable5RowN(col, table5FetchData, oldData);
        }
      }
    }
  };

  const cellChangeTable5 = (change, source) => {
    if (
      (source === "edit" || source === "CopyPaste.paste" || source === "Autofill.fill") &&
      change &&
      change.length > 0
    ) {
      const oldData = [...table5FetchData];
      for (const [row, col, oldValue, newValue] of change) {
        const colIndex = table5Column.findIndex((obj) => obj.data === col);

        if (row !== 3 && row !== 8 && row !== 7 && row !== 14) {
          if (colIndex > 1 && colIndex < 6) {
            onValidateCell(row, colIndex, tables.table5, newValue);
          }
        }
        if (typeof newValue === "string" || typeof newValue === "number") setEdited5Data(true);

        if (col == "taxableValue") {
          let sanitizedValue =
            typeof newValue === "string" ? newValue.replace(/,/g, "") : newValue;
          sanitizedValue = sanitizedValue ? sanitizedValue : 0;

          oldData[row][col] = sanitizedValue;
        }

        if (
          col == "taxableValue" &&
          (typeof newValue === "string" || typeof newValue === "number")
        ) {
          // for  calculation  Sub-total (A to F)
          if (row >= 0 && row <= 6) {
            // var arrayObject = [];

            let subTotalOfAToF = 0;
            for (var x = 0; x <= 6; x++) {
              if (x == 3) {
                continue;
              }

              subTotalOfAToF += parseFloat(oldData[x][col]);
            }

            const totalOfG = oldData[13][col];
            const lastRowTotal = subTotalOfAToF + parseFloat(totalOfG);

            if (!isNaN(subTotalOfAToF)) {
              oldData[7][col] = subTotalOfAToF.toFixed(2).toString();
            }

            if (!isNaN(lastRowTotal)) {
              oldData[14][col] = lastRowTotal.toFixed(2).toString();
            }
          }

          // for  calcalation  Sub-Total (H to K )
          if (row >= 9 && row <= 12) {
            var arrayObject = [];

            for (var x = 9; x <= 12; x++) {
              arrayObject.push(parseFloat(oldData[x][col]));
            }

            let subTotal = 0;
            for (var x = 0; x < arrayObject?.length; x++) {
              if (x == 0 || x == 3) {
                subTotal = parseFloat(subTotal) - arrayObject[x];
              } else {
                subTotal = parseFloat(subTotal) + arrayObject[x];
              }
            }

            // const totalofH = hotRefTable5?.current?.hotInstance?.getDataAtCell(7, 2);
            const totalofH = oldData[7][col];

            const lastRowTotalSub = parseFloat(totalofH) + subTotal;

            if (!isNaN(subTotal)) {
              oldData[13][col] = subTotal.toFixed(2).toString();
            }

            if (!isNaN(lastRowTotalSub)) {
              oldData[14][col] = lastRowTotalSub.toFixed(2).toString();
            }
          }

          refreshTable5RowN(col, oldData, table4FetchData);
        }
      }
    }
  };

  const refreshTable5RowN =  (col, table5 = table5FetchData, table4 =table4FetchData) => {
    const oldTable5Data = [...table5];

    if (col === "all") {
      const cols = [
        table5Column[2].data,
        table5Column[3].data,
        table5Column[4].data,
        table5Column[5].data,
        table5Column[6].data,
      ];

      console.log("COMING", edited5Data)

      cols.forEach((colName) => {
        oldTable5Data[15][colName] =
          +table4[15][colName] + +table5[14][colName] - +table4[6][colName];
      });

     if (!edited5Data) onClickSaveTab2Data(null, oldTable5Data, table4)
    } else {
      oldTable5Data[15][col] =
        +table4[15][col] + +table5[14][col] - +table4[6][col];
    }

    setTable5FetchData(oldTable5Data);
  }

  // Save Data For Tab-2
  const onClickSaveTab2Data = (callbackEvent = null, forTable5Data = null, forTable4Data = null) => {
    let errorArray = [];

    errorArr.forEach((err) => {
      if ((err.table === tables.table4 && activeTab == 2)) {
        errorArray.push({
          tableName: err.table,
          rowNo: err.row,
        });
      }
      else if ((err.table === tables.table5 && activeTab == 2)) {
        errorArray.push({
          tableName: err.table,
          rowNo: err.row,
        });
      }
    });

    if (errorArray.length > 0) {
      return MySwal.fire({
        title: "<strong>Error</strong>",
        icon: "error",
        html: <ErrorTable errorDataList={errorArray} mentionTableName={true}></ErrorTable>,
        customClass: {
          confirmButton: "btn btn-danger",
        },
        buttonsStyling: false,
        width: 600,
      });
    } else {
      setBlock(true);

      const payLoad = {
        userClientId: G_UCParId,
        userId: USerId,
        financialYearId: finYearId,
        table4Data: forTable4Data ? forTable4Data : table4FetchData,
        table5Data: forTable5Data ? forTable5Data: table5FetchData
      };

      GSTR9Service.gstr9SaveTab2Data(payLoad)
        .then((res) => {

          if (
            res?.status === 200 &&
            res.data.status === errorCodeConfig.APIDefaultCode.Success
          ) {
            setBlock(false);
            toast.success(res.data.successMessage, {
              position: "top-right",
            });
            getTab2SummaryData();
            setEdited4Data(false)
            setEdited5Data(false)
            setErrorArr([]);
            if (callbackEvent) callbackEvent();
          } else {
            setBlock(false);
            Swal.fire({
              icon: "error",
              title: "",
              text: res?.data?.errorMessage,
              customClass: {
                confirmButton: "btn btn-danger",
              },
              buttonsStyling: false,
            });
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
  }


  // For Delete Data Table(4-5)
  const onDeleteTableData = (tableNumber) => {
    setBlock(true);
    const deleteFunction = tableNumber === 4 ? GSTR9Service.deleteTable4Data : GSTR9Service.deleteTable5Data;
    deleteFunction(String(G_UCParId), USerId, finYearId)
      .then((res) => {
        if (res.status === 200 && res.data.status === errorCodeConfig.APIDefaultCode.Success) {
          toast.success(res?.data?.successMessage, { position: "top-right" });
          getTab2SummaryData(tableNumber);
        } else {
          setBlock(false);
          toast.error(res?.data?.errorMessage, { position: "top-right" });
        }
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "",
          text: error?.message,
          customClass: {
            confirmButton: "btn btn-danger",
          },
          buttonsStyling: false,
        });
      })
      .finally(() => {
        setBlock(false);
      });
  };

  const deleteTableData = async (tableNumber) => {
    const result = await MySwal.fire({
      title: "Are You Sure Delete This Data?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      customClass: {
        confirmButton: "btn btn-danger",
        cancelButton: "btn btn-outline-dark ms-1",
      },
      buttonsStyling: false,
      allowOutsideClick: false,
    });
    if (result.value) {
      onDeleteTableData(tableNumber);
    }
  };

  useImperativeHandle(ref, () => ({

    checkDataIsPendingForSave(callbackEvent) {

      if (edited4Data == true || edited5Data == true) {

        MySwal.fire({
          title: "Do you want to save data?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes",
          customClass: {
            confirmButton: "btn btn-danger",
            cancelButton: "btn btn-outline-dark ms-1",
          },
          buttonsStyling: false,
          allowOutsideClick: false,
        }).then(function (result) {
          if (result.value) {
            onClickSaveTab2Data(callbackEvent);
          }
        });
      } else {
        callbackEvent();
      }
    },
  }));

  return (
    <div>
      <Accordion className="accordion-border" open={open} toggle={toggle}>
        {/* Part-2  Table-4*/}
        <div className="mb-1">
          <AccordionItem>
            <AccordionHeader targetId="1">
              <h3 className="gstr1Filing fw-bolder col-md-9 text-dark">4. Details of advances, inward and outward supplies made during the financial year on which tax is payable </h3>
              <div className="float-end col-md-3 text-end">
                <Button
                  className="btn-icon me-1"
                  outline
                  color="danger"
                  id="btnDeleteGSTR9C"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTableData(4);;
                  }}
                >
                  <Trash2 size={14} />
                  <span className="align-middle ms-50">
                    Delete
                  </span>
                </Button>
              </div>

            </AccordionHeader>
            <AccordionBody accordionId="1">
              <HotTable
                height="auto"
                className="myRow"
                columns={table4Column}
                data={table4FetchData}
                mergeCells={[
                  { row: 8, col: 1, rowspan: 1, colspan: 7 },
                  { row: 11, col: 1, rowspan: 1, colspan: 7 }

                ]}
                stretchH="all"
                preventOverflow="horizontal"
                rowHeights={RowSize}
                columnHeaderHeight={columnHeaderSize}
                ref={hotRefTable4}
                afterGetColHeader={theader}
                cells={function (row, col) {
                  var cp = {};

                  // cp.className = "child";
                  if (col > 1 && col < 7) {
                    cp.className = "text-end";
                  }
                  if (col < 2) {
                    cp.readOnly = true
                  }

                  if (row === 3 || row == 2) {
                    if (col > 3 && col < 6) {
                      cp.className = "purchseCellDisable text-end";
                    }
                  }
                  if (row == 7 || row == 14 || row == 15) {
                    if (col > 1 && col < 7) {
                      cp.className = "purchseCellDisable text-end";
                    }
                  }
                  if (row == 8 || row == 11) {

                    cp.className = "purchseCellDisable  boldRow ";

                  }
                  if (row == 7 || row == 14 || row == 15) {
                    if (col == 1) {
                      cp.className = "boldRow ";
                    }
                  }

                  if (cp?.className?.includes("purchseCellDisable")) {
                    cp.readOnly = true;
                  }

                  return cp;
                }}
                afterChange={(x, y) => cellChangeTable4(x, y)}
                afterRenderer={(TD, row, col, prop, value) => {
                  if (
                    errorArr.findIndex(
                      (y) => y.row == row && y.col == col && y.table == tables.table4,
                    ) != -1 &&
                    block === false &&
                    value
                  ) {
                    { console.log(value, 'value') }
                    TD.style.backgroundColor = "red";
                  }
                }}
                beforeKeyDown={function (e, col) {
                  if (
                    e.keyCode == 8 ||
                    e.keyCode == 46 ||
                    e.keyCode == 67 ||
                    e.keyCode == 86 ||
                    e.keyCode == 38 ||
                    e.keyCode == 37 ||
                    e.keyCode == 39 ||
                    e.keyCode == 40
                  ) {
                  } else {
                    var reg = /^[0-9.-]+|[\b]+$/;
                    let col = this?.getSelectedLast()?.[1];

                    if (col > 1 && col < 7) {
                      if (!reg.test(e.key)) {
                        e.preventDefault();
                      }
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
                contextMenu={false}
                bindRowsWithHeaders={true}
                licenseKey="non-commercial-and-evaluation"
                autoWrapRow={true}
              />
            </AccordionBody>
          </AccordionItem>
        </div>
        {/* Part-2  Table-5*/}
        <div className="mt-1 mb-1">
          <AccordionItem>
            <AccordionHeader targetId="2">
              <h3 className="gstr1Filing fw-bolder col-md-9 text-dark">5. Details of Outward supplies made during the financial year on which tax is not payable </h3>
              <div className="float-end col-md-3 text-end">
                <Button
                  className="btn-icon me-1"
                  outline
                  color="danger"
                  id="btnDeleteGSTR9C"
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteTableData(5);
                  }}
                >
                  <Trash2 size={14} />
                  <span className="align-middle ms-50">
                    Delete
                  </span>
                </Button>
              </div>
            </AccordionHeader>
            <AccordionBody accordionId="2">
              <HotTable
                height="auto"
                className="myRow"
                rowHeights={RowSize}
                columnHeaderHeight={columnHeaderSize}
                columns={table5Column}
                data={table5FetchData}
                stretchH="all"
                ref={hotRefTable5}
                preventOverflow="horizontal"
                mergeCells={[
                  { row: 3, col: 1, rowspan: 1, colspan: 5 },
                  { row: 8, col: 1, rowspan: 1, colspan: 5 }
                ]}
                afterGetColHeader={theader}
                cells={function (row, col) {
                  var cp = {};
                  if (col > 1 && col < 7) {
                    cp.className = "text-end";
                  }

                  if (col > 2 && col < 7) {
                    cp.className = "purchseCellDisable text-end";
                  }

                  if (row == 3 || row == 8) {

                    cp.className = "purchseCellDisable  boldRow ";

                  }
                  if (row == 7 || row > 12 && row < 16) {
                    if (col == 1) {
                      cp.className = "boldRow ";
                    }
                    if (col == 2) {
                      cp.className = 'purchseCellDisable'
                    }
                  }
                  if (cp?.className?.includes("purchseCellDisable")) {
                    cp.readOnly = true;
                  }

                  return cp;
                }}
                afterChange={(x, y) => cellChangeTable5(x, y)}
                beforeKeyDown={function (e, col) {
                  if (
                    e.keyCode == 8 ||
                    e.keyCode == 46 ||
                    e.keyCode == 67 ||
                    e.keyCode == 86 ||
                    e.keyCode == 38 ||
                    e.keyCode == 37 ||
                    e.keyCode == 39 ||
                    e.keyCode == 40
                  ) {
                  } else {
                    var reg = /^[0-9.-]+|[\b]+$/;
                    let col = this?.getSelectedLast()?.[1];

                    if (col == 2) {
                      if (!reg.test(e.key)) {
                        e.preventDefault();
                      }
                    }
                  }
                }}
                afterRenderer={(TD, row, col, prop, value) => {
                  if (
                    errorArr.findIndex(
                      (y) => y.row == row && y.col == col && y.table == tables.table5,
                    ) != -1 &&
                    block === false &&
                    value
                  ) {
                    TD.style.backgroundColor = "red";
                  }
                }}
                beforeCreateRow={function (index, amount) {
                  let countRow = this?.countRows();
                  if (this?.isEmptyRow(countRow - 0)) {
                    return false;
                  }
                  return true;
                }}
                contextMenu={false}
                bindRowsWithHeaders={true}
                licenseKey="non-commercial-and-evaluation"
                autoWrapRow={true}
              />
            </AccordionBody>
          </AccordionItem>
        </div>
      </Accordion>

      <div style={{ zIndex: "999", }} className='btnFixFooter'>
        <div className="container">
          <div style={{ margintop: "25px" }} className="d-flex justify-content-between row">
            <div className="col-md-4 text-start">
              <Button
                color="danger"
                className="btn-prev "
                // onClick={() => stepper.previous()}
                onClick={() => ref.current.checkDataIsPendingForSave(() => stepper.previous())}
              >
                <ArrowLeft
                  size={14}
                  className="align-middle me-sm-25 me-0"
                ></ArrowLeft>
                <span className="align-middle d-sm-inline-block d-none">
                  Previous
                </span>
              </Button>
            </div>

            <div className="col-md-8 text-end">
              <Button
                className="btn-icon me-2"
                outline
                color="danger"
                id="btnSaveGSTR9C"
                // onClick={() => onSaveClick()}
                onClick={() => onClickSaveTab2Data()}
              >
                <FilePlus size={14} />
                <span className="align-middle d-sm-inline-block d-none ms-50 ">
                  {" "}
                  Save
                </span>
              </Button>
              <Button
                color="danger"
                className="btn-next "
                // onClick={() => stepper.next()}
                onClick={() => ref.current.checkDataIsPendingForSave(() => stepper.next())}
              >
                <span className="align-middle d-sm-inline-block d-none">Next</span>
                <ArrowRight
                  size={14}
                  className="align-middle ms-sm-25 ms-0"
                ></ArrowRight>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

export default Part2


