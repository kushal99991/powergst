import React, { forwardRef, useImperativeHandle, useEffect, useState } from 'react'
import {
  Button, Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
} from "reactstrap";
import toast from "react-hot-toast";
import { RowSize, columnHeaderSize } from "@configs/config";
import errorCodeConfig from '@configs/apiErrorCodeConfig'
import Swal from "sweetalert2";
import { ArrowLeft, ArrowRight, FilePlus, Trash2 } from "react-feather";
import HotTable from "@handsontable/react";
import gstr9Service from '../../../../services/gstr9/gstr9Service';
import { table15Column, table16Column, table17Column, table18Column, table19Column } from '../gst9-columnData';
import withReactContent from "sweetalert2-react-content";
import ErrorTable from '../../../components/ErrorTable/ErrorTable';
const MySwal = withReactContent(Swal);


const Part6 = forwardRef(({ activeTab, G_UCParId, finYearId, USerId, subscriptionId, G_GSTIN, stepper }, ref) => {

  const [open, setOpen] = useState(["1", "2", "3", "4", "5"]);
  const [errorArr, setErrorArr] = useState([]);
  const [block, setBlock] = useState(false);

  const [table15FetchData, setTable15FetchData] = useState([]);
  const [table16FetchData, setTable16FetchData] = useState([]);
  const [table17FetchData, setTable17FetchData] = useState([]);
  const [table18FetchData, setTable18FetchData] = useState([]);
  const [table19FetchData, setTable19FetchData] = useState([]);

  const [edited15Data, setEdited15Data] = useState([]);
  const [edited16Data, setEdited16Data] = useState([]);
  const [edited17Data, setEdited17Data] = useState([]);
  const [edited18Data, setEdited18Data] = useState([]);
  const [edited19Data, setEdited19Data] = useState([]);

  const tables = {
    table15: "Part VI (Tables: 15)",
    table16: "Part VI(Tables: 16) ",
    table17: "Part VI(Tables: 17)",
    table18: "Part VI(Tables: 18) ",
    table19: "Part VI(Tables: 19)",
  }

  const toggle = (id) => {
    let setThisOpen = [...open]
    if (setThisOpen.includes(id)) {
      setThisOpen = setThisOpen.filter((item) => item !== id)
    } else {
      setThisOpen.push(id)
    }
    setOpen(setThisOpen)
  };

  // For Header AlignMent
  const theader15 = (col, TH) => {
    if (col == 1 || col == 9) {
      TH.className = "htLeft";
    } else {
      TH.className = "htRight";
    }
  };

  const theader16 = (col, TH) => {
    if (col == 1 || col == 7) {
      TH.className = "htLeft";
    } else {
      TH.className = "htRight";
    }
  };

  const theader17To18 = (col, TH) => {
    if (col < 2 || col > 8) {
      TH.className = "htLeft";
    } else {
      TH.className = "htRight";
    }
  };

  const theader19 = (col, TH) => {
    if (col == 1 || col == 4) {
      TH.className = "htLeft";
    } else {
      TH.className = "htRight";
    }
  };

  // ** Fetch Data Tab 6  */
  const getTab6SummaryData = () => {
    setBlock(true);
    console.log(USerId, "userid");
    gstr9Service.gstr9tab6FetchAllData(String(G_UCParId), finYearId, G_GSTIN, USerId, subscriptionId)
      .then((res) => {
        setBlock(false);
        if (
          res.status === 200 &&
          res.data.status === errorCodeConfig.APIDefaultCode.Success
        ) {

          setTable15FetchData(res?.data?.data?.table15Data)
          setTable16FetchData(res?.data?.data?.table16Data)
          setTable17FetchData(res?.data?.data?.table17Data)
          setTable18FetchData(res?.data?.data?.table18Data)
          setTable19FetchData(res?.data?.data?.table19Data)

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
    if (activeTab == 6) {
      getTab6SummaryData();
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
    } 
    else {
      setErrorArr(
        errorArr.filter(
          (p) => !(p.row === cellObj.row && p.col === cellObj.col && p.table === cellObj.table),
        ),
      );
    }
    // else
    //   setErrorArr((pre) =>
    //     pre.filter(
    //       (p) =>
    //         p.row !== cellObj.row &&
    //         p.col !== cellObj.col &&
    //         p.table !== cellObj.table
    //     )
    //   );
  }

  const cellChangeTable15 = (change, source) => {
    if ((source === "edit" ||
      source === "CopyPaste.paste" ||
      source === "Autofill.fill") && change && change.length > 0) {
      const oldData = [...table15FetchData]
      for (const [row, col, oldValue, newValue] of change) {

        const colIndex = table15Column.findIndex((obj) => obj.data === col);

        if (colIndex != 9) {
          onValidateCell(row, colIndex, tables.table15, newValue)
        }
        let sanitizedValue =
          typeof newValue === "string" ? newValue.replace(/,/g, "") : newValue;
        sanitizedValue = sanitizedValue ? sanitizedValue : 0;

        oldData[row][col] = sanitizedValue

        if ((newValue || oldValue) && newValue != oldValue && change?.length) setEdited15Data(true)

        setTable15FetchData(oldData);
      }
    }
  }

  const cellChangeTable16 = (change, source) => {
    if ((source === "edit" ||
      source === "CopyPaste.paste" ||
      source === "Autofill.fill") && change && change.length > 0) {
      const oldData = [...table16FetchData]
      for (const [row, col, oldValue, newValue] of change) {

        const colIndex = table16Column.findIndex((obj) => obj.data === col);

        if (colIndex != 7) {
          onValidateCell(row, colIndex, tables.table16, newValue)
        }
        let sanitizedValue =
          typeof newValue === "string" ? newValue.replace(/,/g, "") : newValue;
        sanitizedValue = sanitizedValue ? sanitizedValue : 0;

        oldData[row][col] = sanitizedValue

        if ((newValue || oldValue) && newValue != oldValue && change?.length) setEdited16Data(true)

        setTable16FetchData(oldData);
      }
    }
  }

  const cellChangeTable17 = (change, source) => {
    if (source === "edit" ||
      source === "CopyPaste.paste" ||
      source === "Autofill.fill" && change && change.length > 0) {
      const oldData = [...table17FetchData]
      for (const [row, col, oldValue, newValue] of change) {

        const colIndex = table17Column.findIndex((obj) => obj.data === col);

        // if (colIndex ) ignore notes col

        if (colIndex !== 9 && colIndex !== 1 && colIndex !== 10) {
          onValidateCell(row, colIndex, tables.table17, newValue)
          let sanitizedValue =
            typeof newValue === "string" ? newValue.replace(/,/g, "") : newValue;
          sanitizedValue = sanitizedValue ? sanitizedValue : 0;

          oldData[row][col] = sanitizedValue
        }

        if ((newValue || oldValue) && newValue != oldValue && change?.length) setEdited17Data(true)

        setTable17FetchData(oldData);
      }

    }
  }

  const cellChangeTable18 = (change, source) => {
    if (source === "edit" ||
      source === "CopyPaste.paste" ||
      source === "Autofill.fill" && change && change.length > 0) {
      const oldData = [...table18FetchData]
      for (const [row, col, oldValue, newValue] of change) {

        const colIndex = table18Column.findIndex((obj) => obj.data === col);

        // if (colIndex ) ignore notes col
        if (colIndex != 9 && colIndex !== 1 && colIndex !== 10) {
          onValidateCell(row, colIndex, tables.table18, newValue)
        }

        let sanitizedValue =
          typeof newValue === "string" ? newValue.replace(/,/g, "") : newValue;
        sanitizedValue = sanitizedValue ? sanitizedValue : 0;

        oldData[row][col] = sanitizedValue

        if ((newValue || oldValue) && newValue != oldValue && change?.length) setEdited18Data(true)

        setTable18FetchData(oldData);
      }

    }
  }

  const cellChangeTable19 = (change, source) => {
    if (source === "edit" ||
      source === "CopyPaste.paste" ||
      source === "Autofill.fill" && change && change.length > 0) {
      const oldData = [...table19FetchData]
      for (const [row, col, oldValue, newValue] of change) {

        const colIndex = table19Column.findIndex((obj) => obj.data === col);

        // if (colIndex ) ignore notes col
        if (colIndex != 4) {
          onValidateCell(row, colIndex, tables.table19, newValue)
        }

        let sanitizedValue =
          typeof newValue === "string" ? newValue.replace(/,/g, "") : newValue;
        sanitizedValue = sanitizedValue ? sanitizedValue : 0;

        oldData[row][col] = sanitizedValue

        if ((newValue || oldValue) && newValue != oldValue && change?.length) setEdited19Data(true)

        setTable19FetchData(oldData);
      }

    }
  }


  // Save Data For Tab-6
  const onClickSaveTab6Data = (callbackEvent = null) => {
    let errorArray = [];
    console.log("errorArr", errorArr)
    errorArr.forEach((err) => {
      if ((err.table === tables.table15 && activeTab == 6)) {
        errorArray.push({
          tableName: err.table,
          rowNo: err.row,
        });
      }
      else if ((err.table === tables.table16 && activeTab == 6)) {
        errorArray.push({
          tableName: err.table,
          rowNo: err.row,
        });
      }
      else if ((err.table === tables.table17 && activeTab == 6)) {
        errorArray.push({
          tableName: err.table,
          rowNo: err.row,
        });
      }
      else if ((err.table === tables.table18 && activeTab == 6)) {
        errorArray.push({
          tableName: err.table,
          rowNo: err.row,
        });
      }
      else if ((err.table === tables.table19 && activeTab == 6)) {
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
    }
    else {
      const FKUserClientId = G_UCParId;
      setBlock(true);

      const payLoad = {

        userClientId: G_UCParId,
        userId: USerId,
        fkUserClientId: FKUserClientId,
        financialYearId: finYearId,
        gstNumber: G_GSTIN,
        table15Data: table15FetchData,
        table16Data: table16FetchData,
        table17Data: table17FetchData,
        table18Data: table18FetchData,
        table19Data: table19FetchData,
      };

      gstr9Service.gstr9SaveTab6Data(payLoad)
        .then((res) => {

          if (
            res?.status === 200 &&
            res.data.status === errorCodeConfig.APIDefaultCode.Success
          ) {
            setBlock(false);
            toast.success(res.data.successMessage, {
              position: "top-right",
            });
            getTab6SummaryData();
            setEdited15Data(false)
            setEdited16Data(false)
            setEdited17Data(false)
            setEdited18Data(false)
            setEdited19Data(false)
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


  // For Delete Data Table-15

  const onDeleteTable15 = () => {
    setBlock(true);
    gstr9Service.deleteTable15Data(String(G_UCParId), finYearId, USerId)
      .then((res) => {
        if (
          res.status === 200 &&
          res.data.status === errorCodeConfig.APIDefaultCode.Success
        ) {
          toast.success(res?.data?.successMessage, {
            position: "top-right",
          });
          getTab6SummaryData()
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

  const deleteTable15Data = () => {
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
        onDeleteTable15();
      }
    });
  };

  // For Delete Data Table-16

  const onDeleteTable16 = () => {
    setBlock(true);
    gstr9Service.deleteTable16Data(String(G_UCParId), finYearId, USerId)
      .then((res) => {
        if (
          res.status === 200 &&
          res.data.status === errorCodeConfig.APIDefaultCode.Success
        ) {
          toast.success(res?.data?.successMessage, {
            position: "top-right",
          });
          getTab6SummaryData()
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

  const deleteTable16Data = () => {
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
        onDeleteTable16();
      }
    });
  };

  // For Delete Data Table-17

  const onDeleteTable17 = () => {
    setBlock(true);
    gstr9Service.deleteTable17Data(String(G_UCParId), finYearId, USerId)
      .then((res) => {
        if (
          res.status === 200 &&
          res.data.status === errorCodeConfig.APIDefaultCode.Success
        ) {
          toast.success(res?.data?.successMessage, {
            position: "top-right",
          });
          getTab6SummaryData()
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

  const deleteTable17Data = () => {
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
        onDeleteTable17();
      }
    });
  };

  // For Delete Data Table-18

  const onDeleteTable18 = () => {
    setBlock(true);
    gstr9Service.deleteTable18Data(String(G_UCParId), finYearId, USerId)
      .then((res) => {
        if (
          res.status === 200 &&
          res.data.status === errorCodeConfig.APIDefaultCode.Success
        ) {
          toast.success(res?.data?.successMessage, {
            position: "top-right",
          });
          getTab6SummaryData()
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

  const deleteTable18Data = () => {
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
        onDeleteTable18();
      }
    });
  };

  // For Delete Data Table-19

  const onDeleteTable19 = () => {
    setBlock(true);
    gstr9Service.deleteTable19Data(String(G_UCParId), finYearId, USerId)
      .then((res) => {
        if (
          res.status === 200 &&
          res.data.status === errorCodeConfig.APIDefaultCode.Success
        ) {
          toast.success(res?.data?.successMessage, {
            position: "top-right",
          });
          getTab6SummaryData()
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

  const deleteTable19Data = () => {
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
        onDeleteTable19();
      }
    });
  };


  /**
     * that functions will use in the parent component if needed
     */
  useImperativeHandle(ref, () => ({

    checkDataIsPendingForSave(callbackEvent) {
      if (edited15Data == true || edited16Data == true || edited17Data == true || edited18Data == true || edited19Data == true) {
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
            onClickSaveTab6Data(callbackEvent);
          }
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
        {/* Part-6  Table-15*/}
        <div className="mb-1">
          <AccordionItem>
            <AccordionHeader targetId="1">
              <h3 className="gstr1Filing fw-bolder col-md-9 text-dark">15. Particulars of Demands and Refunds </h3>
              <div className="float-end col-md-3 text-end">
                <Button
                  className="btn-icon me-1"
                  outline
                  color="danger"
                  id="btnDeleteGSTR9C"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTable15Data();
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
              <div className="d-grid mb-1 mb-lg-0">

                <HotTable
                  height="auto"
                  className="myRow"
                  columns={table15Column}
                  data={table15FetchData}
                  afterRenderer={(TD, row, col, prop, value) => {
                    if (
                      errorArr.findIndex(
                        (y) => y.row == row && y.col == col && y.table == tables.table15,
                      ) != -1 &&
                      block === false &&
                      value
                    ) {
                      TD.style.backgroundColor = "red";
                    }
                  }}
                  stretchH="all"
                  preventOverflow="horizontal"
                  rowHeights={RowSize}
                  columnHeaderHeight={columnHeaderSize}
                  afterGetColHeader={theader15}
                  cells={function (row, col) {
                    var cp = {};

                    if (col > 1 && col < 9) {
                      cp.className = "text-end";
                    }
                    if (row < 4) {
                      if (col > 5 && col < 9) {
                        cp.className = "purchseCellDisable text-end boldRow ";
                      }
                    }
                    if (cp?.className?.includes("purchseCellDisable")) {
                      cp.readOnly = true;
                    }
                    return cp;
                  }}
                  afterChange={(x, y) => cellChangeTable15(x, y)}

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

                      if (
                        col > 0 && col < 8
                      ) {
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
              </div>
            </AccordionBody>
          </AccordionItem>
        </div>
        {/* Part-6  Table-16*/}
        <div className="mt-1 mb-1">
          <AccordionItem>
            <AccordionHeader targetId="2">
              <h3 className="gstr1Filing fw-bolder col-md-9 text-dark">16. Supplies received from Composition taxpayers, deemed supply by job worker and goods sent on approval basis</h3>
              <div className="float-end col-md-3 text-end">
                <Button
                  className="btn-icon me-1"
                  outline
                  color="danger"
                  id="btnDeleteGSTR9C"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTable16Data();
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
              <div className="d-grid mb-1 mb-lg-0">

                <HotTable
                  height="auto"
                  className="myRow"
                  columns={table16Column}
                  data={table16FetchData}
                  afterRenderer={(TD, row, col, prop, value) => {
                    if (
                      errorArr.findIndex(
                        (y) => y.row == row && y.col == col && y.table == tables.table16,
                      ) != -1 &&
                      block === false &&
                      value
                    ) {
                      TD.style.backgroundColor = "red";
                    }
                  }}
                  stretchH="all"
                  preventOverflow="horizontal"
                  rowHeights={RowSize}
                  columnHeaderHeight={columnHeaderSize}
                  afterGetColHeader={theader16}
                  cells={function (row, col) {
                    var cp = {};

                    if (col > 1 && col < 7) {
                      cp.className = "text-end";
                    }
                    if (row == 0) {
                      if (col > 2 && col < 7) {
                        cp.className = "purchseCellDisable text-end boldRow ";
                      }
                    }
                    if (cp?.className?.includes("purchseCellDisable")) {
                      cp.readOnly = true;
                    }

                    return cp;
                  }}
                  afterChange={(x, y) => cellChangeTable16(x, y)}

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

                      if (
                        col > 1 && col < 7
                      ) {
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
              </div>
            </AccordionBody>
          </AccordionItem>
        </div>
        {/* Part-6  Table-17*/}
        <div className="mt-1 mb-1">
          <AccordionItem>
            <AccordionHeader targetId="3">
              <h3 className="gstr1Filing fw-bolder col-md-9 text-dark">17. HSN Wise Summary of Outward supplies</h3>
              <div className="float-end col-md-3 text-end">
                <Button
                  className="btn-icon me-1"
                  outline
                  color="danger"
                  id="btnDeleteGSTR9C"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTable17Data();
                  }}
                >
                  <Trash2 size={14} />
                  <span className="align-middle ms-50">
                    Delete
                  </span>
                </Button>
              </div>
            </AccordionHeader>
            <AccordionBody accordionId="3">
              <HotTable
                height="auto"
                className="myRow"
                columns={table17Column}
                data={table17FetchData}
                afterRenderer={(TD, row, col, prop, value) => {
                  if (
                    errorArr.findIndex(
                      (y) => y.row == row && y.col == col && y.table == tables.table17,
                    ) != -1 &&
                    block === false &&
                    value
                  ) {
                    TD.style.backgroundColor = "red";
                  }
                }}
                stretchH="all"
                preventOverflow="horizontal"
                rowHeights={RowSize}
                columnHeaderHeight={columnHeaderSize}
                afterGetColHeader={theader17To18}
                cells={function (row, col) {
                  var cp = {};

                  if (col > 1 && col < 9) {
                    cp.className = "text-end";
                  }
                  return cp;
                }}
                afterChange={(x, y) => cellChangeTable17(x, y)}
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

                    if (
                      col > 1 && col < 7
                    ) {
                      if (!reg.test(e.key)) {
                        e.preventDefault();
                      }
                    }
                  }
                }}
                contextMenu={false}
                bindRowsWithHeaders={true}
                licenseKey="non-commercial-and-evaluation"
                autoWrapRow={true}
              />

            </AccordionBody>
          </AccordionItem>
        </div>
        {/* Part-6  Table-18*/}
        <div className="mt-1 mb-1">
          <AccordionItem>
            <AccordionHeader targetId="4">
              <h3 className="gstr1Filing fw-bolder col-md-9 text-dark">18. HSN Wise Summary of Inward supplies</h3>
              <div className="float-end col-md-3 text-end">
                <Button
                  className="btn-icon me-1"
                  outline
                  color="danger"
                  id="btnDeleteGSTR9C"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTable18Data();
                  }}
                >
                  <Trash2 size={14} />
                  <span className="align-middle ms-50">
                    Delete
                  </span>
                </Button>
              </div>
            </AccordionHeader>
            <AccordionBody accordionId="4">
              <HotTable
                height="auto"
                className="myRow"
                columns={table18Column}
                data={table18FetchData}
                afterRenderer={(TD, row, col, prop, value) => {
                  if (
                    errorArr.findIndex(
                      (y) => y.row == row && y.col == col && y.table == tables.table18,
                    ) != -1 &&
                    block === false &&
                    value
                  ) {
                    TD.style.backgroundColor = "red";
                  }
                }}
                stretchH="all"
                preventOverflow="horizontal"
                rowHeights={RowSize}
                columnHeaderHeight={columnHeaderSize}
                afterGetColHeader={theader17To18}
                cells={function (row, col) {
                  var cp = {};

                  if (col > 1 && col < 9) {
                    cp.className = "text-end";
                  }
                  return cp;
                }}
                afterChange={(x, y) => cellChangeTable18(x, y)}
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

                    if (
                      col > 1 && col < 7
                    ) {
                      if (!reg.test(e.key)) {
                        e.preventDefault();
                      }
                    }
                  }
                }}
                contextMenu={false}
                bindRowsWithHeaders={true}
                licenseKey="non-commercial-and-evaluation"
                autoWrapRow={true}
              />

            </AccordionBody>
          </AccordionItem>
        </div>

        {/* Part-6  Table-19*/}
        <div className="mt-1 mb-1">
          <AccordionItem>
            <AccordionHeader targetId="5">
              <h3 className="gstr1Filing fw-bolder col-md-9 text-dark">19. Late fee payable and paid</h3>
              <div className="float-end col-md-3 text-end">
                <Button
                  className="btn-icon me-1"
                  outline
                  color="danger"
                  id="btnDeleteGSTR9C"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTable19Data();
                  }}
                >
                  <Trash2 size={14} />
                  <span className="align-middle ms-50">
                    Delete
                  </span>
                </Button>
              </div>
            </AccordionHeader>
            <AccordionBody accordionId="5">
              <HotTable
                height="auto"
                className="myRow"
                columns={table19Column}
                data={table19FetchData}
                afterRenderer={(TD, row, col, prop, value) => {
                  if (
                    errorArr.findIndex(
                      (y) => y.row == row && y.col == col && y.table == tables.table19,
                    ) != -1 &&
                    block === false &&
                    value
                  ) {
                    TD.style.backgroundColor = "red";
                  }
                }}

                stretchH="all"
                preventOverflow="horizontal"
                rowHeights={RowSize}
                columnHeaderHeight={columnHeaderSize}
                afterGetColHeader={theader19}
                cells={function (row, col) {
                  var cp = {};

                  if (col > 1 && col < 4) {
                    cp.className = "text-end";
                  }
                  return cp;
                }}
                afterChange={(x, y) => cellChangeTable19(x, y)}

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

                    if (
                      col > 1 && col < 4
                    ) {
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
      </Accordion>
      <div style={{ zIndex: "999", }} className='btnFixFooter'>
        <div className="container">
          <div style={{ margintop: "25px" }} className="d-flex justify-content-between row">
            <div className="col-md-4 text-start">
              <Button
                color="danger"
                className="btn-prev "
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
                onClick={() => onClickSaveTab6Data()}
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

export default Part6
