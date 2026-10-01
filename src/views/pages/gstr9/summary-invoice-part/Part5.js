import React, { forwardRef, useImperativeHandle, useEffect, useState } from 'react'
import {
  Button, Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
} from "reactstrap";
import toast from "react-hot-toast";
import { RowSize } from "@configs/config";
import errorCodeConfig from '@configs/apiErrorCodeConfig'
import Swal from "sweetalert2";
import { ArrowLeft, ArrowRight, FilePlus, Trash2 } from "react-feather";
import HotTable from "@handsontable/react";
import gstr9Service from '../../../../services/gstr9/gstr9Service';
import { part5Table10, part5Table14 } from '../gst9-columnData';
import withReactContent from "sweetalert2-react-content";
import ErrorTable from '../../../components/ErrorTable/ErrorTable';
const MySwal = withReactContent(Swal);


const Part5 = forwardRef(({ stepper, activeTab, G_UCParId, finYearId, USerId, subscriptionId, G_GSTIN }, ref) => {

  const [open, setOpen] = useState(["1", "2"]);
  const [errorArr, setErrorArr] = useState([]);
  const [block, setBlock] = useState(false);
  const [table10FetchData, setTable10FetchData] = useState([]);
  const [table14FetchData, setTable14FetchData] = useState([]);
  const [edited10Data, setEdited10Data] = useState([]);
  const [edited14Data, setEdited14Data] = useState([]);

  const tables = {
    table10: "Part V (Tables: 10)",
    table14: "Part V (Tables: 14) "
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
  const theader10To13 = (col, TH) => {
    if (col == 1 || col == 7) {
      TH.className = "htLeft";
    } else {
      TH.className = "htRight";
    }
  };

  const theader14 = (col, TH) => {
    if (col == 0 || col == 3) {
      TH.className = "htLeft";
    } else {
      TH.className = "htRight";
    }
  };

  // ** Fetch Data Tab 5  */
  const getTab5SummaryData = () => {
    setBlock(true);
    console.log(USerId, "userid");
    gstr9Service.gstr9tab5FetchAllData(String(G_UCParId), finYearId)
      .then((res) => {
        setBlock(false);
        if (
          res.status === 200 &&
          res.data.status === errorCodeConfig.APIDefaultCode.Success
        ) {

          setTable10FetchData(res?.data?.data?.table10to13Data)
          setTable14FetchData(res?.data?.data?.table14Data)

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
    if (activeTab == 5) {
      getTab5SummaryData();
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

  const cellChangeTable10 = (change, source) => {
    if ((source === "edit" ||
      source === "CopyPaste.paste" ||
      source === "Autofill.fill") && change && change.length > 0) {
      const oldData = [...table10FetchData]
      for (const [row, col, oldValue, newValue] of change) {

        const colIndex = part5Table10.findIndex((obj) => obj.data === col);

        if (colIndex != 7) {
          onValidateCell(row, colIndex, tables.table10, newValue)
        }
        let sanitizedValue =
          typeof newValue === "string" ? newValue.replace(/,/g, "") : newValue;
        sanitizedValue = sanitizedValue ? sanitizedValue : 0;

        oldData[row][col] = sanitizedValue

        if ((newValue || oldValue) && newValue != oldValue && change?.length) setEdited10Data(true)

        setTable10FetchData(oldData);
      }
    }
  }

  const cellChangeTable14 = (change, source) => {
    if ((source === "edit" ||
      source === "CopyPaste.paste" ||
      source === "Autofill.fill") && change && change.length > 0) {
      const oldData = [...table14FetchData]
      for (const [row, col, oldValue, newValue] of change) {

        const colIndex = part5Table14.findIndex((obj) => obj.data === col);

        if (colIndex != 3) {
          onValidateCell(row, colIndex, tables.table14, newValue)
        }
        let sanitizedValue =
          typeof newValue === "string" ? newValue.replace(/,/g, "") : newValue;
        sanitizedValue = sanitizedValue ? sanitizedValue : 0;

        oldData[row][col] = sanitizedValue

        if ((newValue || oldValue) && newValue != oldValue && change?.length) setEdited14Data(true)

        setTable14FetchData(oldData);
      }
    }
  }


  console.log("errorArr", errorArr)

  // Save Data For Tab-5
  const onClickSaveTab5Data = (callbackEvent = null) => {
    let errorArray = [];
    console.log("errorArr", errorArr)
    errorArr.forEach((err) => {
      if ((err.table === tables.table10 && activeTab == 5)) {
        errorArray.push({
          tableName: err.table,
          rowNo: err.row,
        });
      }
      else if ((err.table === tables.table14 && activeTab == 5)) {
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
        table10to13Data: table10FetchData,
        table14Data: table14FetchData

      };

      gstr9Service.gstr9SaveTab5Data(payLoad)
        .then((res) => {

          if (
            res?.status === 200 &&
            res.data.status === errorCodeConfig.APIDefaultCode.Success
          ) {
            setBlock(false);
            toast.success(res.data.successMessage, {
              position: "top-right",
            });
            getTab5SummaryData();
            // setisChangeData5(false)
            setEdited10Data(false)
            setEdited14Data(false)
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

  // For Delete Data Table-10

  const onDeleteTable10 = () => {
    setBlock(true);
    gstr9Service.deleteTable10Data(String(G_UCParId), USerId, finYearId)
      .then((res) => {
        if (
          res.status === 200 &&
          res.data.status === errorCodeConfig.APIDefaultCode.Success
        ) {
          toast.success(res?.data?.successMessage, {
            position: "top-right",
          });
          getTab5SummaryData()
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

  const deleteTable10Data = () => {
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
        onDeleteTable10();
      }
    });
  };

  // For Delete Data Table-14
  const onDeleteTable14 = () => {
    setBlock(true);
    gstr9Service.deleteTable14Data(String(G_UCParId), USerId, finYearId)
      .then((res) => {
        if (
          res.status === 200 &&
          res.data.status === errorCodeConfig.APIDefaultCode.Success
        ) {
          toast.success(res?.data?.successMessage, {
            position: "top-right",
          });
          getTab5SummaryData()
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

  const deleteTable14Data = () => {
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
        onDeleteTable14();
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
      if (edited10Data == true || edited14Data == true) {
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
            onClickSaveTab5Data(callbackEvent);
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
        <div className="mb-1">
          <AccordionItem>
            <AccordionHeader targetId="1">
              <h3 className="gstr1Filing fw-bolder col-md-9 text-dark">10, 11, 12 & 13. Details of the previous Financial Year's transactions reported in next Financial Year</h3>
              <div className="float-end col-md-3 text-end">
                <Button
                  className="btn-icon me-1"
                  outline
                  color="danger"
                  id="btnDeleteGSTR9C"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTable10Data();
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
                  rowHeights={RowSize}
                  mergeCells={[

                  ]}
                  afterGetColHeader={theader10To13}
                  cells={function (row, col) {
                    var cp = {};

                    // cp.className = "child";
                    if (col > 1 && col < 7) {
                      cp.className = "text-end";
                    }
                    if (row == 0 || row == 1 || row == 2 || row == 3) {
                      if (col == 0) {
                        cp.className = "boldRow";
                      }
                    }
                    if (row == 2 || row == 3) {
                      if (col == 2) {
                        cp.className = "purchseCellDisable text-end";
                      }
                    }
                    if (row == 4) {
                      if (col > 1 && col < 7) {
                        cp.className = "purchseCellDisable text-end";
                      }
                      if (col == 1) {
                        cp.className = "boldRow";
                      }
                    }

                    if (cp?.className?.includes("purchseCellDisable")) {
                      cp.readOnly = true;
                    }
                    return cp;
                  }}
                  afterChange={(x, y) => cellChangeTable10(x, y)}

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
                  afterRenderer={(TD, row, col, prop, value) => {
                    if (
                      errorArr.findIndex(
                        (y) => y.row == row && y.col == col && y.table == tables.table10,
                      ) != -1 &&
                      block === false &&
                      value
                    ) {
                      TD.style.backgroundColor = "red";
                    }
                  }}
                  stretchH="all"
                  preventOverflow="horizontal"
                  columns={part5Table10}
                  data={table10FetchData}
                  contextMenu={false}
                  bindRowsWithHeaders={true}
                  licenseKey="non-commercial-and-evaluation"
                  autoWrapRow={true}
                />

              </div>
            </AccordionBody>
          </AccordionItem>
        </div>

        <div className="mt-1 mb-1"> <AccordionItem>
          <AccordionHeader targetId="2">
            <h3 className="gstr1Filing fw-bolder col-md-9 text-dark">14. Differential tax paid on account of declaration in table no. 10 & 11 </h3>
            <div className="float-end col-md-3 text-end">
              <Button
                className="btn-icon me-1"
                outline
                color="danger"
                id="btnDeleteGSTR9C"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteTable14Data();
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
                rowHeights={RowSize}

                cells={function (row, col) {
                  var cp = {};

                  // cp.className = "child";
                  if (col > 0 && col < 3) {
                    cp.className = "text-end";
                  }

                  return cp;
                }}
                afterChange={(x, y) => cellChangeTable14(x, y)}
                afterGetColHeader={theader14}
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
                      col > 0 && col < 3
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
                afterRenderer={(TD, row, col, prop, value) => {
                  if (
                    errorArr.findIndex(
                      (y) => y.row == row && y.col == col && y.table == tables.table14,
                    ) != -1 &&
                    block === false &&
                    value
                  ) {
                    TD.style.backgroundColor = "red";
                  }
                }}
                stretchH="all"
                preventOverflow="horizontal"
                columns={part5Table14}
                data={table14FetchData}
                contextMenu={false}
                bindRowsWithHeaders={true}
                licenseKey="non-commercial-and-evaluation"
                autoWrapRow={true}
              />

            </div>
          </AccordionBody>
        </AccordionItem></div>

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
                onClick={() => onClickSaveTab5Data()}
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

export default Part5
