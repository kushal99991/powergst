import { HotTable } from "@handsontable/react";
import React, {
  forwardRef,
  Fragment,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { Trash2 } from "react-feather";
import { toast } from "react-hot-toast";
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  Button,
} from "reactstrap";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import errorCodeConfig from "../../../../configs/apiErrorCodeConfig";
import { columnHeaderSize, RowSize } from "../../../../configs/config";
import gstr9cService from "../../../../services/gstr9c/gstr9cService";
import ErrorTable from "../../../components/ErrorTable/ErrorTable";
import Footer from "../footer";
import {
  deleteTableData,
  handleCatchResponse,
  loadCellForReasonTable,
  loadHeaderForReasonTable,
  onValidateCell,
  reloadReasonTables,
  returnArrayOfReason,
  sanitizeValue,
  validChangeType,
  validSourceStates,
} from "../helper";
import UnReconciledModal from "./UnReconciledModal";

const MySwal = withReactContent(Swal);

const keyOfTables = {
  table5: "Part II (Tables: 5)",
  table6: "Part II (Tables: 6)",
  table7: "Part II (Tables: 7)",
  table8: "Part II (Tables: 8)",
};

const table5Column = [
  {
    title: "S.no",
    data: "serialNumber",
    width: 5,
  },
  {
    title: "Particulars",
    data: "particulars",
    width: 60,
  },
  {
    title: "",
    data: "operator",
    width: 10,
  },
  {
    title: "Amount (₹)",
    data: "amount",
    width: 20,
  },
];

const initialTable5Data = [
  {
    serialNumber: "A",
    particulars:
      "Turnover (including exports) as per Audited Financial Statement for the State/UT (For multi-GSTIN units under same PAN, the turnover shall as be derived from the Audited Annual Financial Statements)*",
    operator: "(+)",
    amount: 0,
  },
  {
    serialNumber: "B",
    particulars: "Unbilled revenue at the beginning of the Financial Year",
    operator: "(+)",
    amount: 0,
  },
  {
    serialNumber: "C",
    particulars: "Unadjusted advances at the end of the Financial Year",
    operator: "(+)",
    amount: 0,
  },
  {
    serialNumber: "D",
    particulars: "Deemed Supply under Schedule l",
    operator: "(+)",
    amount: 0,
  },
  {
    serialNumber: "E",
    particulars:
      "Credit Notes issued after the end of the financial year but reflected in the annual return",
    operator: "(-)",
    amount: 0,
  },
  {
    serialNumber: "F",
    particulars:
      "Trade Discounts accounted for in the audited Annual Financial Statement but are not permissible under GST",
    operator: "(+)",
    amount: 0,
  },
  {
    serialNumber: "G",
    particulars: "Turnover from April 2017 to June 2017",
    operator: "(-)",
    amount: 0,
  },
  {
    serialNumber: "H",
    particulars: "Unbilled revenue as at the end of the Financial Year",
    operator: "(-)",
    amount: 0,
  },
  {
    serialNumber: "I",
    particulars:
      "Unadjusted Advances as at the beginning of the Financial Year",
    operator: "(-)",
    amount: 0,
  },
  {
    serialNumber: "J",
    particulars:
      "Credit notes accounted for in the audited Annual Financial Statement but are not permissible under GST",
    operator: "(+)",
    amount: 0,
  },
  {
    serialNumber: "K",
    particulars:
      "Adjustments on account of supply of goods by SEZ units to DTA\r\nUnits",
    operator: "(-)",
    amount: 0,
  },
  {
    serialNumber: "L",
    particulars: "Turnover for the period under composition scheme",
    operator: "(-)",
    amount: 0,
  },
  {
    serialNumber: "M",
    particulars:
      "Adjustments in turnover under section 15 and rules thereunder",
    operator: "(+)",
    amount: 0,
  },
  {
    serialNumber: "N",
    particulars: "Adjustments in Turnover due to foreign exchange fluctuation",
    operator: "(+)",
    amount: 0,
  },
  {
    serialNumber: "O",
    particulars: "Adjustment in Turnover due to reasons not listed above",
    operator: "(+)",
    amount: 0,
  },
  {
    serialNumber: "P",
    particulars:
      "Annual Turnover after adjustments as above(A+B+C+D-E+F-G-H- I+J-K-L+M+N+O)*",
    operator: "(-)",
    amount: 0,
  },
  {
    serialNumber: "Q",
    particulars: "Turnover as declared in Annual return (GSTR9)*",
    operator: "(+)",
    amount: 0,
  },
  {
    serialNumber: "R",
    particulars: "Un-Reconciled turnover (Q-P)",
    operator: "",
    amount: 0,
  },
];

const table6Column = [
  {
    title: "Action",
    data: "action",
    width: 50,
  },
  {
    title: "No of Reason",
    data: "noOfReason",
    width: 50,
  },
];

const initialTable6Data = [
  {
    action: "View/Add reasons",
    noOfReason: 0,
  },
];

const table7Column = [
  {
    title: "S.no",
    data: "serialNumber",
    width: 5,
  },
  {
    title: "Particulars",
    data: "particulars",
    width: 60,
  },
  {
    title: "",
    data: "operator",
    width: 10,
  },
  {
    title: "Amount (₹)",
    data: "amount",
    width: 20,
  },
];

const initialTable7Data = [
  {
    serialNumber: "A",
    particulars: "Annual Turnover after adjustments [from 5(P) above]*",
    operator: "(+)",
    amount: 0,
  },
  {
    serialNumber: "B",
    particulars:
      "Value of Exempted, Nil Rated, Non GST Turnover, No supply turnover",
    operator: "(-)",
    amount: 0,
  },
  {
    serialNumber: "C",
    particulars: "Zero rated supplies without payment of tax",
    operator: "(-)",
    amount: 0,
  },
  {
    serialNumber: "D",
    particulars:
      "Supplies on which tax is to be paid by the recipient on reverse charge basis",
    operator: "(-)",
    amount: 0,
  },
  {
    serialNumber: "E",
    particulars: "Taxable turnover as per adjustments above (A-B-C-D)*",
    operator: "(-)",
    amount: 0,
  },
  {
    serialNumber: "F",
    particulars:
      "Taxable turnover as per liability declared in Annual Return. (GSTR9)*",
    operator: "(+)",
    amount: 0,
  },
  {
    serialNumber: "G",
    particulars: "Unreconciled Taxable Turnover (F-E)*",
    operator: "",
    amount: 0,
  },
];

/**
 * Contains Table: 5-8
 * @returns
 */
const Part2 = forwardRef((props, ref) => {
  const [open, setOpen] = useState(["1", "2", "3", "4"]);
  const [errorArr, setErrorArr] = useState([]);

  const [table5Data, setTable5Data] = useState(initialTable5Data);
  const [table6Data, setTable6Data] = useState(initialTable6Data);
  const [table7Data, setTable7Data] = useState(initialTable7Data);
  const [table8Data, setTable8Data] = useState(initialTable6Data);

  const [table6Modal, setTable6Modal] = useState(false);
  const [table6ModalData, setTable6ModalData] = useState([]);

  const [table8Modal, setTable8Modal] = useState(false);
  const [table8ModalData, setTable8ModalData] = useState([]);

  const [edited, setEdited] = useState({
    table5: false,
    table6: false,
    table7: false,
    table8: false,
  });

  const onClickToggle = (id) => {
    props.toggle(id, open, setOpen);
  };

  const theader = (col, TH) => {
    if (col == 0 || col == 1 || col == 7) {
      TH.className = "htLeft";
    } else {
      TH.className = "htRight";
    }
  };

  const getData = (refreshOnly = null) => {
    props.setBlock(true);
    gstr9cService
      .getPart2Data(
        String(props.UserClientId),
        props.UserId,
        props.finYearId,
        props.G_GSTIN,
        props.subscriptionId
      )
      .then((res) => {
        if (
          res.status === 200 &&
          res.data.status === errorCodeConfig.APIDefaultCode.Success &&
          res?.data?.data
        ) {
          // if we want to refresh all the data
          if (!refreshOnly) {
            setTable5Data(res.data.data.table5Data);
            setTable7Data(res.data.data.table7Data);

            reloadReasonTables(
              res.data.data.table6Data,
              setTable6Data,
              setTable6ModalData
            );
            reloadReasonTables(
              res.data.data.table8Data,
              setTable8Data,
              setTable8ModalData
            );

            setErrorArr([]);
            setEdited({
              table5: false,
              table6: false,
              table7: false,
              table8: false,
            });
          } else {
            // else part specify only for user will delete any one table
            // then we will update that table data only
            const newEdited = { ...edited };

            if (refreshOnly === 5) {
              newEdited.table5 = false;
              setTable5Data(res.data.data.table5Data);
              onChangeOfTable7([[0, "amount", 0, 0]], "edit");
              onClickOnSave(null, res.data.data.table5Data);
            }

            switch (true) {
              case refreshOnly === 6:
                newEdited.table6 = false;
                reloadReasonTables(
                  res.data.data.table6Data,
                  setTable6Data,
                  setTable6ModalData
                );
                break;

              case refreshOnly === 7:
                newEdited.table7 = false;
                setTable7Data(res.data.data.table7Data);
                break;

              case refreshOnly === 8:
                newEdited.table8 = false;
                reloadReasonTables(
                  res.data.data.table8Data,
                  setTable8Data,
                  setTable8ModalData
                );
                break;
            }

            const newErrorArr = [];

            errorArr.forEach((item) => {
              if (
                (keyOfTables.table5 === item.table && !newEdited.table5) ||
                (keyOfTables.table6 === item.table && !newEdited.table6) ||
                (keyOfTables.table7 === item.table && !newEdited.table7) ||
                (keyOfTables.table8 === item.table && !newEdited.table8)
              ) {
                newErrorArr.push(item);
              }
            });

            setErrorArr(newErrorArr);
            setEdited(newEdited);
          }
        }
      })
      .catch(handleCatchResponse)
      .finally(() => {
        props.setBlock(false);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  const onClickOnSave = (callbackEvent = null, forPart5Data = null) => {
    const errorArray = errorArr.map((err) => ({
      tableName: err.table,
      rowNo: err.row,
    }));

    if (errorArray.length > 0) {
      return MySwal.fire({
        title: "<strong>Error</strong>",
        icon: "error",
        html: (
          <ErrorTable
            errorDataList={errorArray}
            mentionTableName={true}
          ></ErrorTable>
        ),
        customClass: {
          confirmButton: "btn btn-danger",
        },
        buttonsStyling: false,
        width: 600,
      });
    } else {
      props.setBlock(true);

      const payload = {
        FKUserClientId: String(props.UserClientId),
        userId: props.UserId,
        financialYearId: props.finYearId,
        table5Data: forPart5Data ? forPart5Data : table5Data,
        table6Data: returnArrayOfReason(table6ModalData),
        table7Data,
        table8Data: returnArrayOfReason(table8ModalData),
      };

      gstr9cService
        .savePart2Data(payload)
        .then((res) => {
          if (
            res?.status === 200 &&
            res.data.status === errorCodeConfig.APIDefaultCode.Success
          ) {
            toast.success(res.data.successMessage, {
              position: "top-right",
            });

            getData();

            if (callbackEvent) callbackEvent();
          }
        })
        .catch(handleCatchResponse)
        .finally(() => {
          props.setBlock(false);
        });
    }
  };

  useImperativeHandle(ref, () => ({
    checkDataIsPendingForSave(callbackEvent) {
      // check any one table value is changed
      // if yes the ask for conformation
      if (Object.values(edited).some((isEdited) => isEdited)) {
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
            onClickOnSave(callbackEvent);
          }
        });
      } else {
        callbackEvent();
      }
    },
  }));

  const onChangeOfTable5 = (change, source) => {
    if (validSourceStates.includes(source) && change && change.length > 0) {
      const oldData = [...table5Data];

      for (const [row, col, oldValue, newValue] of change) {
        const colIndex = table5Column.findIndex((obj) => obj.data === col);

        if (colIndex === 3 && !(row == 15 || row == 17)) {
          onValidateCell(
            row,
            colIndex,
            keyOfTables.table5,
            newValue,
            setErrorArr
          );

          if (validChangeType.includes(typeof newValue)) {
            setEdited((pre) => ({ ...pre, table5: true }));

            oldData[row][col] = sanitizeValue(newValue);

            // A+B+C+D-E+F-G-H-I+J-K-L+M+N+O
            let totalForP = 0;
            for (let i = 0; i <= 14; i++) {
              const element = oldData[i];

              if (+element[col]) {
                if ([4, 6, 7, 8, 10, 11].includes(i)) {
                  totalForP -= element[col];
                } else {
                  totalForP += element[col];
                }
              }
            }

            oldData[15][col] = sanitizeValue(totalForP);

            // Q - P
            oldData[17][col] = sanitizeValue(
              oldData[16][col] - oldData[15][col]
            );

            setTable5Data(oldData);

            onChangeOfTable7([[0, "amount", 0, oldData[15][col]]], "edit");
          }
        }
      }
    }
  };

  const onChangeOfTable7 = (change, source) => {
    if (validSourceStates.includes(source) && change && change.length > 0) {
      const oldData = [...table7Data];

      for (const [row, col, oldValue, newValue] of change) {
        const colIndex = table7Column.findIndex((obj) => obj.data === col);
        if (colIndex === 3 && [0, 1, 2, 3, 5].includes(row)) {
          onValidateCell(
            row,
            colIndex,
            keyOfTables.table7,
            newValue,
            setErrorArr
          );

          if (validChangeType.includes(typeof newValue)) {
            setEdited((pre) => ({ ...pre, table7: true }));

            oldData[row][col] = sanitizeValue(newValue);

            // A-B-C-D
            let totalForE = 0;
            for (let i = 0; i <= 3; i++) {
              const element = oldData[i];

              if (+element[col]) {
                if ([1, 2, 3].includes(i)) {
                  totalForE -= element[col];
                } else {
                  totalForE += element[col];
                }
              }
            }

            oldData[4][col] = sanitizeValue(totalForE);

            // Q - P
            oldData[6][col] = sanitizeValue(oldData[5][col] - oldData[4][col]);

            setTable7Data(oldData);
          }
        }
      }
    }
  };

  const deletePayload = {
    userClientId: String(props.UserClientId),
    userId: props.UserId,
    financialYearId: props.finYearId,
  };

  return (
    <Fragment>
      <Accordion
        className="accordion-border"
        open={open}
        toggle={onClickToggle}
      >
        <div className="mb-1">
          <AccordionItem>
            <AccordionHeader targetId="1">
              <h3 className="gstr1Filing fw-bolder col-md-9 text-dark">
                5. Reconciliation of Gross Turnover{" "}
              </h3>
              <div className="float-end col-md-3 text-end">
                <Button
                  className="btn-icon me-1"
                  outline
                  color="danger"
                  id="btnDeleteGSTR9C"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTableData(5, props.setBlock, getData, deletePayload);
                  }}
                >
                  <Trash2 size={14} />
                  <span className="align-middle ms-50">Delete</span>
                </Button>
              </div>
            </AccordionHeader>
            <AccordionBody accordionId="1">
              <HotTable
                height="auto"
                className="myRow"
                columns={table5Column}
                data={table5Data}
                stretchH="all"
                preventOverflow="horizontal"
                rowHeights={RowSize}
                columnHeaderHeight={columnHeaderSize}
                afterGetColHeader={theader}
                cells={function (row, col) {
                  var cp = {};
                  if (col == 2) {
                    cp.className = "text-center";
                    cp.readOnly = true;
                  }

                  if (col == 3) {
                    cp.className = "text-end";
                  }

                  if (col < 2) {
                    cp.readOnly = true;
                  }

                  if (col == 3 && (row == 15 || row == 17)) {
                    cp.className = "purchseCellDisable text-end boldRow";
                  }

                  if (cp?.className?.includes("purchseCellDisable")) {
                    cp.readOnly = true;
                  }

                  return cp;
                }}
                afterChange={(x, y) => onChangeOfTable5(x, y)}
                afterRenderer={(TD, row, col, prop, value) => {
                  if (
                    errorArr.findIndex(
                      (y) =>
                        y.row == row &&
                        y.col == col &&
                        y.table == keyOfTables.table5
                    ) != -1 &&
                    props.block === false &&
                    value
                  ) {
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
        <div className="mt-1 mb-1">
          <AccordionItem>
            <AccordionHeader targetId="2">
              <h3 className="gstr1Filing fw-bolder col-md-9 text-dark">
                6. Reasons for un-reconciled difference in annual gross turnover{" "}
              </h3>
              <div className="float-end col-md-3 text-end">
                <Button
                  className="btn-icon me-1"
                  outline
                  color="danger"
                  id="btnDeleteGSTR9C"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTableData(6, props.setBlock, getData, deletePayload);
                  }}
                >
                  <Trash2 size={14} />
                  <span className="align-middle ms-50">Delete</span>
                </Button>
              </div>
            </AccordionHeader>
            <AccordionBody accordionId="2">
              <HotTable
                height="auto"
                className="myRow"
                columns={table6Column}
                data={table6Data}
                stretchH="all"
                preventOverflow="horizontal"
                rowHeights={RowSize}
                columnHeaderHeight={columnHeaderSize}
                afterGetColHeader={loadHeaderForReasonTable}
                cells={loadCellForReasonTable}
                afterOnCellMouseDown={(event, coords, td) => {
                  if (coords?.col === 0) {
                    setTable6Modal(true);
                  }
                }}
                afterRenderer={(TD, row, col, prop, value) => {
                  if (
                    errorArr.findIndex(
                      (y) =>
                        y.row == row &&
                        y.col == col &&
                        y.table == keyOfTables.table6
                    ) != -1 &&
                    props.block === false &&
                    value
                  ) {
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
        <div className="mt-1 mb-1">
          <AccordionItem>
            <AccordionHeader targetId="3">
              <h3 className="gstr1Filing fw-bolder col-md-9 text-dark">
                7. Reconciliation of Taxable Turnover{" "}
              </h3>
              <div className="float-end col-md-3 text-end">
                <Button
                  className="btn-icon me-1"
                  outline
                  color="danger"
                  id="btnDeleteGSTR9C"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTableData(7, props.setBlock, getData, deletePayload);
                  }}
                >
                  <Trash2 size={14} />
                  <span className="align-middle ms-50">Delete</span>
                </Button>
              </div>
            </AccordionHeader>
            <AccordionBody accordionId="3">
              <HotTable
                height="auto"
                className="myRow"
                columns={table7Column}
                data={table7Data}
                stretchH="all"
                preventOverflow="horizontal"
                rowHeights={RowSize}
                columnHeaderHeight={columnHeaderSize}
                afterGetColHeader={theader}
                cells={function (row, col) {
                  var cp = {};
                  if (col == 2) {
                    cp.className = "text-center";
                    cp.readOnly = true;
                  }

                  if (col == 3) {
                    cp.className = "text-end";
                  }

                  if (col < 2) {
                    cp.readOnly = true;
                  }

                  if (
                    col == 3 &&
                    (row == 0 || row == 4 || row == 6)
                  ) {
                    cp.className = "purchseCellDisable text-end boldRow";
                  }

                  if (cp?.className?.includes("purchseCellDisable")) {
                    cp.readOnly = true;
                  }

                  return cp;
                }}
                afterChange={(x, y) => onChangeOfTable7(x, y)}
                afterRenderer={(TD, row, col, prop, value) => {
                  if (
                    errorArr.findIndex(
                      (y) =>
                        y.row == row &&
                        y.col == col &&
                        y.table == keyOfTables.table7
                    ) != -1 &&
                    props.block === false &&
                    value
                  ) {
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
        <div className="mt-1 mb-1">
          <AccordionItem>
            <AccordionHeader targetId="4">
              <h3 className="gstr1Filing fw-bolder col-md-9 text-dark">
                8. Reasons for un-reconciled difference in taxable turnover{" "}
              </h3>
              <div className="float-end col-md-3 text-end">
                <Button
                  className="btn-icon me-1"
                  outline
                  color="danger"
                  id="btnDeleteGSTR9C"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTableData(8, props.setBlock, getData, deletePayload);
                  }}
                >
                  <Trash2 size={14} />
                  <span className="align-middle ms-50">Delete</span>
                </Button>
              </div>
            </AccordionHeader>
            <AccordionBody accordionId="4">
              <HotTable
                height="auto"
                className="myRow"
                columns={table6Column}
                data={table8Data}
                stretchH="all"
                preventOverflow="horizontal"
                rowHeights={RowSize}
                columnHeaderHeight={columnHeaderSize}
                afterGetColHeader={loadHeaderForReasonTable}
                afterOnCellMouseDown={(event, coords, td) => {
                  if (coords?.col === 0) {
                    setTable8Modal(true);
                  }
                }}
                cells={loadCellForReasonTable}
                afterRenderer={(TD, row, col, prop, value) => {
                  if (
                    errorArr.findIndex(
                      (y) =>
                        y.row == row &&
                        y.col == col &&
                        y.table == keyOfTables.table8
                    ) != -1 &&
                    props.block === false &&
                    value
                  ) {
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
      </Accordion>
      {table6Modal ? (
        <UnReconciledModal
          open={table6Modal}
          data={table6ModalData}
          setEdited={() => setEdited((pre) => ({ ...pre, table6: true }))}
          setNewData={setTable6ModalData}
          setTableData={setTable6Data}
          onToggle={() => setTable6Modal(false)}
          title={
            "6. Reasons for un-reconciled difference in annual gross turnover"
          }
        />
      ) : null}
      {table8Modal ? (
        <UnReconciledModal
          open={table8Modal}
          data={table8ModalData}
          setEdited={() => setEdited((pre) => ({ ...pre, table8: true }))}
          setNewData={setTable8ModalData}
          setTableData={setTable8Data}
          onToggle={() => setTable8Modal(false)}
          title={"8. Reasons for un-reconciled difference in taxable turnover"}
        />
      ) : null}
      <Footer
        stepper={props.stepper}
        onSave={onClickOnSave}
        onNext={() =>
          ref.current.checkDataIsPendingForSave(() => props.stepper.next())
        }
        onPrevious={() =>
          ref.current.checkDataIsPendingForSave(() => props.stepper.previous())
        }
      />
    </Fragment>
  );
});

export default Part2;
