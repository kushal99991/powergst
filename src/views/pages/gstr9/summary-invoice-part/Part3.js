import React, { forwardRef, useImperativeHandle, useEffect, useState } from "react";
import { useRef } from "react";
import { Button, Accordion, AccordionBody, AccordionHeader, AccordionItem } from "reactstrap";
import toast from "react-hot-toast";
import { RowSize, columnHeaderSize } from "@configs/config";
import errorCodeConfig from "@configs/apiErrorCodeConfig";
import Swal from "sweetalert2";
import { ArrowLeft, ArrowRight, FilePlus, Trash2 } from "react-feather";
import HotTable from "@handsontable/react";
import { part3Table6, part3Table7, part3Table8 } from "../gst9-columnData";
import gstr9Service from "../../../../services/gstr9/gstr9Service";
import withReactContent from "sweetalert2-react-content";
import ErrorTable from "../../../components/ErrorTable/ErrorTable";
const MySwal = withReactContent(Swal);

const Part3 = forwardRef(
  ({ stepper, activeTab, G_UCParId, finYearId, USerId, subscriptionId, G_GSTIN }, ref) => {

    const [open, setOpen] = useState(["1", "2", "3"]);
    const [errorArr, setErrorArr] = useState([]);
    const [block, setBlock] = useState(false);
    const hotReftable7 = useRef(null);
    const hotReftable8 = useRef(null);
    const [table6FetchData, setTable6FetchData] = useState([]);
    const [table7FetchData, setTable7FetchData] = useState([]);
    const [table8FetchData, setTable8FetchData] = useState([]);

    const [edited6Data, setEdited6Data] = useState([]);
    const [edited7Data, setEdited7Data] = useState([]);
    const [edited8Data, setEdited8Data] = useState([]);

    const tables = {
      table6: "Part III (Tables: 6)",
      table7: "Part III (Tables: 7)",
      table8: "Part III (Tables: 8)",
    };

    const toggle = (id) => {
      let setThisOpen = [...open]
      if (setThisOpen.includes(id)) {
        setThisOpen = setThisOpen.filter((item) => item !== id)
      } else {
        setThisOpen.push(id)
      }
      setOpen(setThisOpen)
    };

    let checkIsPresentData = false;

    // For Header AlignMent
    const theaderTable6 = (col, TH) => {
      if (col < 3 || col == 7) {
        TH.className = "htLeft";
      } else {
        TH.className = "htRight";
      }
    };

    const theaderTable7 = (col, TH) => {
      if (col == 1 || col == 6) {
        TH.className = "htLeft";
      } else {
        TH.className = "htRight";
      }
    };


    // ** Fetch Data Tab 3  */
    const getTab3SummaryData = () => {
      setBlock(true);
      console.log(USerId, "userid");
      gstr9Service
        .gstr9tab3FetchAllData(String(G_UCParId), finYearId, G_GSTIN, subscriptionId, USerId)
        .then((res) => {
          setBlock(false);
          if (res.status === 200 && res.data.status === errorCodeConfig.APIDefaultCode.Success) {
            setTable6FetchData(res?.data?.data?.table6Data);
            setTable7FetchData(res?.data?.data?.table7Data);
            setTable8FetchData(res?.data?.data?.table8Data);

            setEdited6Data(false);
            setEdited7Data(false);
            setEdited8Data(false);
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
      if (activeTab == 3) {
        getTab3SummaryData();
      }
    }, [activeTab]);

    const onValidateCell = (row, colIndex, table, newValue) => {
      const sanitizedValue = typeof newValue === "string" ? newValue.replace(/,/g, "") : newValue;

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
    };

    const cellChangeTable6 = async (change, source) => {
      if (
        (source === "edit" || source === "CopyPaste.paste" || source === "Autofill.fill") &&
        change &&
        change.length > 0
      ) {
        const oldData = [...table6FetchData];

        for (const [row, col, oldValue, newValue] of change) {
          let rowId = null;

          if (oldValue !== newValue) {
            const colIndex = part3Table6.findIndex((obj) => obj.data === col);

            const validateCells = [3, 4, 5, 6];
            if (validateCells.includes(colIndex)) {
              onValidateCell(row, colIndex, tables.table6, newValue);
            }

            if (typeof newValue === "string" || typeof newValue === "number")
              setEdited6Data(true);

            if (col == "igst") {
              rowId = 3;
            } else if (col == "cgst") {
              rowId = 4;
            } else if (col == "sgst") {
              rowId = 5;
            } else if (col == "cess") {
              rowId = 6;
            }

            // validate number if they contains rowId
            if (rowId) {
              let sanitizedValue =
                typeof newValue === "string" ? newValue.replace(/,/g, "") : newValue;
              sanitizedValue = sanitizedValue ? sanitizedValue : 0;

              oldData[row][col] = sanitizedValue;
            }

            // for Taxable calcalation
            if (rowId) {
              // calculation for subtotal1
              let subtotal1 = 0;
              for (var x = 2; x <= 17; x++) {
                if (x == 5 || x == 12) {
                  continue;
                }

                const cellValue = oldData[x][col];

                subtotal1 += parseFloat(cellValue) ?? 0;
              }

              if (!isNaN(subtotal1)) {
                oldData[18][col] = subtotal1.toFixed(2).toString();
              }

              const lastRowTotalJ = subtotal1 - parseFloat(oldData[0][col]);

              if (!isNaN(lastRowTotalJ)) {
                oldData[19][col] = subtotal1.toFixed(2).toString();
              }

              // calculation for subtotal2
              let subtotal2 = 0;
              for (var x = 20; x <= 22; x++) {
                subtotal2 += parseFloat(oldData[x][col]) ?? 0;
              }
              if (!isNaN(subtotal2)) {
                oldData[23][col] = subtotal2.toFixed(2).toString();
              }

              // calculation for totalITC
              let totalITC = 0;

              for (var x = 18; x <= 23; x++) {
                if (x == 19 || x == 20 || x == 21 || x == 22) {
                  continue;
                }

                totalITC += parseFloat(oldData[x][col]) ?? 0;
              }

              if (!isNaN(totalITC)) {
                oldData[24][col] = totalITC.toFixed(2).toString();
              }
            }
            setTable6FetchData(oldData);
          }
        }
      }
    };

    const cellChangeTable7 = async (change, source) => {
      if (
        (source === "edit" || source === "CopyPaste.paste" || source === "Autofill.fill") &&
        change &&
        change.length > 0
      ) {
        const oldData = [...table7FetchData];

        for (const [row, col, oldValue, newValue] of change) {
          let rowId = null;

          if (oldValue !== newValue) {
            if (col == "igst") {
              rowId = 2;
            } else if (col == "cgst") {
              rowId = 3;
            } else if (col == "sgst") {
              rowId = 4;
            } else if (col == "cess") {
              rowId = 5;
            }

            // validate number if they contains rowId
            if (rowId) {
              let sanitizedValue =
                typeof newValue === "string" ? newValue.replace(/,/g, "") : newValue;
              sanitizedValue = sanitizedValue ? sanitizedValue : 0;

              oldData[row][col] = sanitizedValue;
            }

            const colIndex = part3Table7.findIndex((obj) => obj.data === col);

            if (colIndex != 6) {
              onValidateCell(row, colIndex, tables.table7, newValue);
            }

            if (typeof newValue === "string" || typeof newValue === "number")
              setEdited7Data(true);

            // for Taxable calcalation
            if (row >= 1 && row <= 13) {
              if (rowId) {
                let total = 0;

                for (var x = 1; x <= 13; x++) {
                  total += parseFloat(oldData[x][col]) ?? 0;
                }

                if (!isNaN(total)) {
                  oldData[14][col] = total.toFixed(2).toString();
                }
              }
            }
            setTable7FetchData(oldData);
          }
        }
      }
    };

    const cellChangeTable8 = async (change, source) => {
      if (source !== "loadData" && change && change.length > 0) {
        const oldData = [...table8FetchData];
        for (const [row, col, oldValue, newValue] of change) {
          let rowId = null;

          if (oldValue !== newValue) {
            const colIndex = part3Table8.findIndex((obj) => obj.data === col);

            if (colIndex != 6) {
              onValidateCell(row, colIndex, tables.table8, newValue);
            }

            if (typeof newValue === "string" || typeof newValue === "number")
              setEdited8Data(true);

            if (col == "igst") {
              rowId = 2;
            } else if (col == "cgst") {
              rowId = 3;
            } else if (col == "sgst") {
              rowId = 4;
            } else if (col == "cess") {
              rowId = 5;
            }

            // validate number if they contains rowId
            if (rowId) {
              let sanitizedValue =
                typeof newValue === "string" ? newValue.replace(/,/g, "") : newValue;
              sanitizedValue = sanitizedValue ? sanitizedValue : 0;

              oldData[row][col] = sanitizedValue;

              // Step - 1 [A- (B + C)]
              let totalForCell_D = 0;

              for (var x = 1; x <= 2; x++) {
                // const cellValue = await hotReftable8?.current?.hotInstance?.getDataAtCell(x, rowId);

                totalForCell_D += parseFloat(oldData[x][col]) ?? 0;
              }

              const minusValue = oldData[0][col];

              // if (minusValue > totalForCell_D) {
              //   const finalTotalValue = minusValue - totalForCell_D;
              //   if (!isNaN(finalTotalValue)) {
              //     oldData[3][col] = finalTotalValue.toFixed(2).toString();
              //   }
              // } else {
              // const finalTotalValue = totalForCell_D - minusValue;
              const finalTotalValue = minusValue - totalForCell_D;

              if (!isNaN(finalTotalValue)) {
                oldData[3][col] = finalTotalValue.toFixed(2).toString();
              }
              // }

              // Step [G - H]
              var arrayObject = [];
              for (var x = 6; x <= 7; x++) {
                arrayObject.push(parseFloat(oldData[x][col]));
              }

              let totalForCell_I = 0;
              for (var x = 0; x < arrayObject.length; x++) {
                totalForCell_I = -arrayObject[x] - parseFloat(totalForCell_I);
              }
              if (!isNaN(totalForCell_I)) {
                oldData[8][col] = totalForCell_I.toFixed(2).toString();
                oldData[9][col] = totalForCell_I.toFixed(2).toString();
              }

              // Step [E + F + J]
              let totalForCell_K = 0;
              for (var x = 4; x <= 9; x++) {
                if (x != 6 && x != 7 && x != 8) {
                  totalForCell_K += parseFloat(oldData[x][col]) ?? 0;
                }
              }

              if (!isNaN(totalForCell_K)) {
                oldData[10][col] = totalForCell_K.toFixed(2).toString();
              }
            }

            setTable8FetchData(oldData);
          }
        }
      }
    };



    // Save Data For Tab-3
    const onClickSaveTab3Data = (callbackEvent = null) => {
      let errorArray = [];
      errorArr.forEach((err) => {
        if (err.table === tables.table6 && activeTab == 3) {
          errorArray.push({
            tableName: err.table,
            rowNo: err.row,
          });
        } else if (err.table === tables.table7 && activeTab == 3) {
          errorArray.push({
            tableName: err.table,
            rowNo: err.row,
          });
        } else if (err.table === tables.table8 && activeTab == 3) {
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
        const FKUserClientId = G_UCParId;
        setBlock(true);

        const payLoad = {
          userClientId: G_UCParId,
          userId: USerId,
          fkUserClientId: FKUserClientId,
          financialYearId: finYearId,
          gstNumber: G_GSTIN,
          table6Data: table6FetchData,
          table7Data: table7FetchData,
          table8Data: table8FetchData,
        };

        gstr9Service
          .gstr9SaveTab3Data(payLoad)
          .then((res) => {
            if (res?.status === 200 && res.data.status === errorCodeConfig.APIDefaultCode.Success) {
              setBlock(false);
              toast.success(res.data.successMessage, {
                position: "top-right",
              });
              getTab3SummaryData();
              // setisChangeData3(false)
              setEdited6Data(false);
              setEdited7Data(false);
              setEdited8Data(false);
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
    };

    // For Delete Data Table-6

    const onDeleteTable6 = () => {
      setBlock(true);
      gstr9Service
        .deleteTable6Data(String(G_UCParId), finYearId, USerId)
        .then((res) => {
          if (res.status === 200 && res.data.status === errorCodeConfig.APIDefaultCode.Success) {
            toast.success(res?.data?.successMessage, {
              position: "top-right",
            });
            getTab3SummaryData();
          } else {
            setBlock(false);
            toast.error(res?.data?.errorMessage, {
              position: "top-right",
            });
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

    const deleteTable6Data = () => {
      return MySwal.fire({
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
      }).then(function (result) {
        if (result.value) {
          onDeleteTable6();
        }
      });
    };

    // For Delete Data Table-7

    const onDeleteTable7 = () => {
      setBlock(true);
      gstr9Service
        .deleteTable7Data(String(G_UCParId), finYearId, USerId)
        .then((res) => {
          if (res.status === 200 && res.data.status === errorCodeConfig.APIDefaultCode.Success) {
            toast.success(res?.data?.successMessage, {
              position: "top-right",
            });
            getTab3SummaryData();
          } else {
            setBlock(false);
            toast.error(res?.data?.errorMessage, {
              position: "top-right",
            });
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

    const deleteTable7Data = () => {
      return MySwal.fire({
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
      }).then(function (result) {
        if (result.value) {
          onDeleteTable7();
        }
      });
    };

    // For Delete Data Table-8

    const onDeleteTable8 = () => {
      setBlock(true);
      gstr9Service
        .deleteTable8Data(String(G_UCParId), finYearId, USerId)
        .then((res) => {
          if (res.status === 200 && res.data.status === errorCodeConfig.APIDefaultCode.Success) {
            toast.success(res?.data?.successMessage, {
              position: "top-right",
            });
            getTab3SummaryData();
          } else {
            setBlock(false);
            toast.error(res?.data?.errorMessage, {
              position: "top-right",
            });
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

    const deleteTable8Data = () => {
      return MySwal.fire({
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
      }).then(function (result) {
        if (result.value) {
          onDeleteTable8();
        }
      });
    };

    /**
     * that functions will use in the parent component if needed
     */
    useImperativeHandle(ref, () => ({
      // that function will check there is any pending data for save
      // if "yes" then they will ask for conformation
      checkDataIsPendingForSave(callbackEvent) {
        if (edited6Data == true || edited7Data == true || edited8Data == true) {
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
              onClickSaveTab3Data(callbackEvent);
            }
            // else {
            //   setEdited6Data(false);
            //   setEdited7Data(false);
            //   setEdited8Data(false);
            //   callbackEvent();
            // }
          });
        } else {
          callbackEvent();
        }
      },
    }));

    return (
      <div>
        {block && <div className="loading1">Loading&#8230;</div>}
        <Accordion className="accordion-border" open={open} toggle={toggle}>
          {/* Part-3  Table-6*/}
          <div className="mb-1">
            <AccordionItem>
              <AccordionHeader targetId="1">
                <h3 className="gstr1Filing fw-bolder col-md-9 text-dark">
                  6. Details of ITC availed during the financial year{" "}
                </h3>
                <div className="float-end col-md-3 text-end">
                  <Button
                    className="btn-icon me-1"
                    outline
                    color="danger"
                    id="btnDeleteGSTR9C"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteTable6Data();
                    }}
                  >
                    <Trash2 size={14} />
                    <span className="align-middle ms-50">Delete</span>
                  </Button>
                </div>
              </AccordionHeader>
              <AccordionBody accordionId="1">
                <div className="d-grid mb-1 mb-lg-0">
                  <HotTable
                    // afterGetColHeader={theaderLogSummaryData}
                    height="auto"
                    className="myRow"
                    rowHeights={RowSize}
                    // ref={hotReftable6}
                    mergeCells={[
                      { row: 0, col: 1, rowspan: 1, colspan: 2 },
                      { row: 1, col: 1, rowspan: 1, colspan: 7 },
                      { row: 2, col: 1, rowspan: 3, colspan: 1 },
                      { row: 2, col: 0, rowspan: 3, colspan: 1 },
                      { row: 5, col: 1, rowspan: 1, colspan: 7 },
                      { row: 6, col: 1, rowspan: 3, colspan: 1 },
                      { row: 6, col: 0, rowspan: 3, colspan: 1 },
                      { row: 9, col: 1, rowspan: 3, colspan: 1 },
                      { row: 9, col: 0, rowspan: 3, colspan: 1 },
                      { row: 12, col: 1, rowspan: 1, colspan: 7 },
                      { row: 13, col: 1, rowspan: 2, colspan: 1 },
                      { row: 13, col: 0, rowspan: 2, colspan: 1 },
                      { row: 15, col: 1, rowspan: 1, colspan: 2 },
                      { row: 16, col: 1, rowspan: 1, colspan: 2 },
                      { row: 17, col: 1, rowspan: 1, colspan: 2 },
                      { row: 18, col: 1, rowspan: 1, colspan: 2 },
                      { row: 19, col: 1, rowspan: 1, colspan: 2 },
                      { row: 20, col: 1, rowspan: 1, colspan: 2 },
                      { row: 21, col: 1, rowspan: 1, colspan: 2 },
                      { row: 22, col: 1, rowspan: 1, colspan: 2 },
                      { row: 23, col: 1, rowspan: 1, colspan: 2 },
                      { row: 24, col: 1, rowspan: 1, colspan: 2 },
                    ]}
                    afterGetColHeader={theaderTable6}
                    cells={function (row, col) {
                      var cp = {};

                      // cp.className = "child";
                      if (col > 2 && col < 7) {
                        cp.className = "text-end";
                      }

                      if (row == 1 || row == 5 || row == 12) {
                        if (col >= 0) {
                          cp.className = "purchseCellDisable boldRow ";
                        }
                      }
                      if (row == 0) {
                        if (col > 1 && col < 7) {
                          cp.className = "purchseCellDisable boldRow text-end";
                        }
                        if (col == 0 || col == 1) {
                          cp.className = "boldRow";
                        }
                      }
                      if (row == 13 || row == 14 || row == 15) {
                        if (col == 4 || col == 5) {
                          cp.className = "purchseCellDisable text-end";
                        }
                      }
                      if (row == 18 || row == 19) {
                        if (col > 1 && col < 7) {
                          cp.className = "purchseCellDisable text-end boldRow";
                        }
                        if (col == 0 || col == 1) {
                          cp.className = "boldRow";
                        }
                      }
                      if (row == 20 || row == 21) {
                        if (col == 3 || col == 6) {
                          cp.className = "purchseCellDisable text-end";
                        }
                      }
                      if (row == 23 || row == 24) {
                        if (col > 1 && col < 7) {
                          cp.className = "purchseCellDisable text-end boldRow";
                        }
                        if (col == 0 || col == 1) {
                          cp.className = "boldRow";
                        }
                      }

                      if (cp?.className?.includes("purchseCellDisable")) {
                        cp.readOnly = true;
                      }
                      return cp;
                    }}
                    afterChange={(x, y) => cellChangeTable6(x, y)}
                    beforeKeyDown={function (e, col) {
                      // Delete and Backspace , copy and paste

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

                        if (col > 2 && col < 7) {
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
                    afterRenderer={(TD, row, col, prop, value) => {
                      if (
                        errorArr.findIndex(
                          (y) => y.row == row && y.col == col && y.table == tables.table6,
                        ) != -1 &&
                        block === false &&
                        value
                      ) {
                        TD.style.backgroundColor = "red";
                      }
                    }}
                    stretchH="all"
                    preventOverflow="horizontal"
                    columns={part3Table6}
                    data={table6FetchData}
                    contextMenu={false}
                    bindRowsWithHeaders={true}
                    licenseKey="non-commercial-and-evaluation"
                    autoWrapRow={true}
                  />
                </div>
              </AccordionBody>
            </AccordionItem>
          </div>

          {/* Part-3  Table-7*/}
          <div className="mt-1 mb-1">
            <AccordionItem>
              <AccordionHeader targetId="2">
                <h3 className="gstr1Filing fw-bolder col-md-9 text-dark">
                  7. Details of ITC Reversed and Ineligible ITC for the financial year{" "}
                </h3>
                <div className="float-end col-md-3 text-end">
                  <Button
                    className="btn-icon me-1"
                    outline
                    color="danger"
                    id="btnDeleteGSTR9C"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteTable7Data();
                    }}
                  >
                    <Trash2 size={14} />
                    <span className="align-middle ms-50">Delete</span>
                  </Button>
                </div>
              </AccordionHeader>
              <AccordionBody accordionId="2">
                <div className="d-grid mb-1 mb-lg-0">
                  <HotTable
                    // afterGetColHeader={theaderLogSummaryData}
                    height="auto"
                    className="myRow"
                    rowHeights={RowSize}
                    mergeCells={[{ row: 0, col: 1, rowspan: 1, colspan: 6 }]}
                    ref={hotReftable7}
                    afterChange={(x, y) => cellChangeTable7(x, y)}
                    afterGetColHeader={theaderTable7}
                    cells={function (row, col) {
                      var cp = {};

                      // cp.className = "child";
                      if (col > 1 && col < 6) {
                        cp.className = "text-end";
                      }

                      if (row == 0) {
                        cp.className = "purchseCellDisable boldRow";
                      }
                      if (row == 6 || row == 7) {
                        if (col == 2 || col == 5) {
                          cp.className = "purchseCellDisable text-end";
                        }
                      }

                      if (row == 14 || row == 15) {
                        if (col > 1 && col < 6) {
                          cp.className = "purchseCellDisable text-end boldRow";
                        }
                        if (col == 0 || col == 1) {
                          cp.className = "boldRow";
                        }
                      }

                      if (cp?.className?.includes("purchseCellDisable")) {
                        cp.readOnly = true;
                      }
                      return cp;
                    }}
                    beforeKeyDown={function (e, col) {
                      // Delete and Backspace , copy and paste

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

                        if (col > 1 && col < 6) {
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
                    afterRenderer={(TD, row, col, prop, value) => {
                      if (
                        errorArr.findIndex(
                          (y) => y.row == row && y.col == col && y.table == tables.table7,
                        ) != -1 &&
                        block === false &&
                        value
                      ) {
                        TD.style.backgroundColor = "red";
                      }
                    }}
                    stretchH="all"
                    preventOverflow="horizontal"
                    columns={part3Table7}
                    data={table7FetchData}
                    contextMenu={false}
                    bindRowsWithHeaders={true}
                    licenseKey="non-commercial-and-evaluation"
                    autoWrapRow={true}
                  />
                </div>
              </AccordionBody>
            </AccordionItem>
          </div>

          {/* Part-3  Table-8*/}
          <div className="mt-1">
            <AccordionItem>
              <AccordionHeader targetId="3">
                <h3 className="gstr1Filing fw-bolder col-md-9 text-dark">
                  8. Other ITC related information
                </h3>
                <div className="float-end col-md-3 text-end">
                  <Button
                    className="btn-icon me-1"
                    outline
                    color="danger"
                    id="btnDeleteGSTR9C"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteTable8Data();
                    }}
                  >
                    <Trash2 size={14} />
                    <span className="align-middle ms-50">Delete</span>
                  </Button>
                </div>
              </AccordionHeader>
              <AccordionBody accordionId="3">
                <div className="d-grid mb-1 mb-lg-0">
                  <HotTable
                    // afterGetColHeader={theaderLogSummaryData}
                    height="auto"
                    className="myRow"
                    rowHeights={RowSize}
                    ref={hotReftable8}
                    afterChange={(x, y) => cellChangeTable8(x, y)}
                    afterGetColHeader={theaderTable7}
                    cells={function (row, col) {
                      var cp = {};

                      // cp.className = "child";
                      if (col > 1 && col < 5) {
                        cp.className = "text-end";
                      }

                      if (
                        row == 0 ||
                        row == 1 ||
                        row == 3 ||
                        row == 7 ||
                        row == 8 ||
                        row == 9 ||
                        row == 10
                      ) {
                        if (col > 1 && col < 6) {
                          cp.className = "purchseCellDisable boldRow text-end";
                        }
                        if (col == 0 || col == 1) {
                          cp.className = "boldRow";
                        }
                      }

                      if (cp?.className?.includes("purchseCellDisable")) {
                        cp.readOnly = true;
                      }
                      return cp;
                    }}
                    beforeKeyDown={function (e, col) {
                      // Delete and Backspace , copy and paste

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

                        if (col > 1 && col < 6) {
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
                    afterRenderer={(TD, row, col, prop, value) => {
                      if (
                        errorArr.findIndex(
                          (y) => y.row == row && y.col == col && y.table == tables.table8,
                        ) != -1 &&
                        block === false &&
                        value
                      ) {
                        TD.style.backgroundColor = "red";
                      }
                    }}
                    stretchH="all"
                    preventOverflow="horizontal"
                    columns={part3Table8}
                    data={table8FetchData}
                    contextMenu={false}
                    bindRowsWithHeaders={true}
                    licenseKey="non-commercial-and-evaluation"
                    autoWrapRow={true}
                  />
                </div>
              </AccordionBody>
            </AccordionItem>
          </div>
        </Accordion>
        <div style={{ zIndex: "999" }} className="btnFixFooter">
          <div className="container">
            <div style={{ margintop: "25px" }} className="d-flex justify-content-between row">
              <div className="col-md-4 text-start">
                <Button
                  color="danger"
                  className="btn-prev "
                  // onClick={() => stepper.previous()}
                  onClick={() => ref.current.checkDataIsPendingForSave(() => stepper.previous())}
                >
                  <ArrowLeft size={14} className="align-middle me-sm-25 me-0"></ArrowLeft>
                  <span className="align-middle d-sm-inline-block d-none">Previous</span>
                </Button>
              </div>

              <div className="col-md-8 text-end">
                <Button
                  className="btn-icon me-2"
                  outline
                  color="danger"
                  id="btnSaveGSTR9C"
                  // onClick={onClickSaveTab3Data} // before
                  onClick={() => onClickSaveTab3Data()} // after
                >
                  <FilePlus size={14} />
                  <span className="align-middle d-sm-inline-block d-none ms-50 "> Save</span>
                </Button>
                <Button
                  color="danger"
                  className="btn-next "
                  onClick={() => ref.current.checkDataIsPendingForSave(() => stepper.next())}
                >
                  <span className="align-middle d-sm-inline-block d-none">Next</span>
                  <ArrowRight size={14} className="align-middle ms-sm-25 ms-0"></ArrowRight>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

export default Part3;
