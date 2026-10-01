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
  table12: "Part IV (Table: 12)",
  table13: "Part IV (Table: 13)",
  table14: "Part IV (Table: 14)",
  table15: "Part IV (Table: 15)",
  table16: "Part IV (Table: 16)",
};

const table12Column = [
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

const initialTable12Data = [
  {
    serialNumber: "A",
    particulars:
      "ITC availed as per audited Annual Financial Statement for the State/ UT (For multi-GSTIN units under same PAN, this should be derived from books of accounts)*",
    operator: "(+)",
    amount: 10,
  },
  {
    serialNumber: "B",
    particulars:
      "ITC booked in earlier Financial Years claimed in current Financial Year",
    operator: "(+)",
    amount: 20,
  },
  {
    serialNumber: "C",
    particulars:
      "ITC booked in curent Financial Year to be claimed in subsequent Finaricial Years",
    operator: "(-)",
    amount: 10,
  },
  {
    serialNumber: "D",
    particulars:
      "ITC availed as per audited financial statements or books of accounts (A+B-C)*",
    operator: "(-)",
    amount: 50,
  },
  {
    serialNumber: "E",
    particulars: "ITC claimed in Annual Return (GSTR9)*",
    operator: "(+)",
    amount: 70,
  },
  {
    serialNumber: "F",
    particulars: "Un-reconciled ITC (E-D)*",
    operator: "",
    amount: 50,
  },
];

const table13Column = [
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

const initialTable13Data = [
  {
    action: "View/Add reasons",
    noOfReason: 0,
  },
];

const table14Column = [
  {
    title: "S.no",
    data: "serialNumber",
    width: 5,
  },
  {
    title: "Description",
    data: "description",
    width: 30,
  },
  {
    title: "",
    data: "operator",
    width: 5,
  },
  {
    title: "Value",
    data: "value",
    width: 25,
  },
  {
    title: "Amount of total ITC",
    data: "totalITC",
    width: 25,
  },
  {
    title: "Amount of eligible ITC availed",
    data: "eligibleITCAvailed",
    width: 25,
  },
];

const initialTable14Data = [
  {
    serialNumber: "A",
    description: "Purchases",
    operator: "(+)",
    value: 0,
    totalITC: 20,
    eligibleITCAvailed: 40,
  },
  {
    serialNumber: "B",
    description: "Freight/Carriage",
    operator: "(+)",
    value: 70,
    totalITC: 0,
    eligibleITCAvailed: 60,
  },
  {
    serialNumber: "C",
    description: "Power and Fuel Costs",
    operator: "(+)",
    value: 0,
    totalITC: 40,
    eligibleITCAvailed: 0,
  },
  {
    serialNumber: "D",
    description: "Imported goods (Including received from SEZ)",
    operator: "(+)",
    value: 60,
    totalITC: 0,
    eligibleITCAvailed: 10,
  },
  {
    serialNumber: "E",
    description: "Rent and Insurance Expense",
    operator: "(+)",
    value: 0,
    totalITC: 0,
    eligibleITCAvailed: 30,
  },
  {
    serialNumber: "F",
    description:
      "Goods lost, stolen, destroyed, written off or disposed of by way of gift or free samples",
    operator: "(+)",
    value: 0,
    totalITC: 0,
    eligibleITCAvailed: 0,
  },
  {
    serialNumber: "G",
    description: "Royalties",
    operator: "(+)",
    value: 0,
    totalITC: 0,
    eligibleITCAvailed: 40,
  },
  {
    serialNumber: "H",
    description: "Employee's Cost (Salaries, Wages, Bonus etc.)",
    operator: "(+)",
    value: 0,
    totalITC: 0,
    eligibleITCAvailed: 0,
  },
  {
    serialNumber: "I",
    description: "Conveyance charges",
    operator: "(+)",
    value: 0,
    totalITC: 50,
    eligibleITCAvailed: 0,
  },
  {
    serialNumber: "J",
    description: "Bank Charges",
    operator: "(+)",
    value: 0,
    totalITC: 0,
    eligibleITCAvailed: 0,
  },
  {
    serialNumber: "K",
    description: "Entertainment charges",
    operator: "(+)",
    value: 0,
    totalITC: 20,
    eligibleITCAvailed: 60,
  },
  {
    serialNumber: "L",
    description: "Stationery Expenses (including postage etc.)",
    operator: "(+)",
    value: 0,
    totalITC: 0,
    eligibleITCAvailed: 0,
  },
  {
    serialNumber: "M",
    description: "Repair and Maintenance",
    operator: "(+)",
    value: 0,
    totalITC: 0,
    eligibleITCAvailed: 0,
  },
  {
    serialNumber: "N",
    description: "Other Miscellaneous expenses",
    operator: "(+)",
    value: 0,
    totalITC: 0,
    eligibleITCAvailed: 60,
  },
  {
    serialNumber: "O",
    description: "Capital goods",
    operator: "(+)",
    value: 30,
    totalITC: 0,
    eligibleITCAvailed: 0,
  },
  {
    serialNumber: "P",
    description: "Any other expense 1",
    operator: "(+)",
    value: 0,
    totalITC: 40,
    eligibleITCAvailed: 40,
  },
  {
    serialNumber: "Q",
    description: "Any other expense 2",
    operator: "(+)",
    value: 0,
    totalITC: 0,
    eligibleITCAvailed: 0,
  },
  {
    serialNumber: "R",
    description: "Total amount of eligible ITC availed (A to Q)*",
    operator: "(-)",
    value: 0,
    totalITC: 70,
    eligibleITCAvailed: 70,
  },
  {
    serialNumber: "S",
    description: "ITC claimed in Annual Return (GSTR9)",
    operator: "(+)",
    value: 0,
    totalITC: 0,
    eligibleITCAvailed: 0,
  },
  {
    serialNumber: "T",
    description: "Un-reconciled ITC (S-R)*",
    operator: "(+)",
    value: 0,
    totalITC: 90,
    eligibleITCAvailed: 0,
  },
];

const table16Column = [
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
    title: "Amount",
    data: "amount",
    width: 35,
  },
];

const initialTable16Data = [
  {
    serialNumber: "A",
    particulars: "Central Tax",
    amount: 30,
  },
  {
    serialNumber: "B",
    particulars: "State tax/UI tax",
    amount: 30,
  },
  {
    serialNumber: "C",
    particulars: "Integrated Tax",
    amount: 0,
  },
  {
    serialNumber: "D",
    particulars: "Cess",
    amount: 0,
  },
  {
    serialNumber: "E",
    particulars: "Interest",
    amount: 60,
  },
  {
    serialNumber: "F",
    particulars: "Penalty",
    amount: 90,
  },
];

const Part4 = forwardRef((props, ref) => {
  const [open, setOpen] = useState(["1", "2", "3", "4"]);
  const [errorArr, setErrorArr] = useState([]);

  const [table12Data, setTable12Data] = useState(initialTable12Data);
  const [table13Data, setTable13Data] = useState(initialTable13Data);
  const [table14Data, setTable14Data] = useState(initialTable14Data);
  const [table15Data, setTable15Data] = useState(initialTable13Data);
  const [table16Data, setTable16Data] = useState(initialTable16Data);

  const [table13Modal, setTable13Modal] = useState(false);
  const [table13ModalData, setTable13ModalData] = useState([]);

  const [table15Modal, setTable15Modal] = useState(false);
  const [table15ModalData, setTable15ModalData] = useState([]);

  const [edited, setEdited] = useState({
    table12: false,
    table13: false,
    table14: false,
    table15: false,
    table16: false,
  });

  const onClickToggle = (id) => {
    props.toggle(id, open, setOpen);
  };

  const getData = (refreshOnly = null) => {
    props.setBlock(true);
    gstr9cService
      .getPart4Data(
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
            setTable12Data(res.data.data.table12Data);
            setTable14Data(res.data.data.table14Data);
            setTable16Data(res.data.data.table16Data);

            reloadReasonTables(
              res.data.data.table13Data,
              setTable13Data,
              setTable13ModalData
            );
            reloadReasonTables(
              res.data.data.table15Data,
              setTable15Data,
              setTable15ModalData
            );

            setErrorArr([]);
            setEdited({
              table12: false,
              table13: false,
              table14: false,
              table15: false,
              table16: false,
            });
          } else {
            // else part specify only for user will delete any one table
            // then we will update that table data only
            const newEdited = { ...edited };

            switch (true) {
              case refreshOnly === 12:
                newEdited.table12 = false;
                setTable12Data(res.data.data.table12Data);
                break;

              case refreshOnly === 13:
                newEdited.table13 = false;
                reloadReasonTables(
                  res.data.data.table13Data,
                  setTable13Data,
                  setTable13ModalData
                );
                break;

              case refreshOnly === 14:
                newEdited.table14 = false;
                setTable14Data(res.data.data.table14Data);
                break;

              case refreshOnly === 15:
                newEdited.table15 = false;
                reloadReasonTables(
                  res.data.data.table15Data,
                  setTable15Data,
                  setTable15ModalData
                );
                break;

              case refreshOnly === 16:
                newEdited.table16 = false;
                setTable16Data(res.data.data.table16Data);
                break;
            }

            const newErrorArr = [];

            errorArr.forEach((item) => {
              if (
                (keyOfTables.table12 === item.table && !newEdited.table12) ||
                (keyOfTables.table13 === item.table && !newEdited.table13) ||
                (keyOfTables.table14 === item.table && !newEdited.table14) ||
                (keyOfTables.table15 === item.table && !newEdited.table15) ||
                (keyOfTables.table16 === item.table && !newEdited.table16)
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

  const onClickOnSave = (callbackEvent = null) => {
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
        table12Data,
        table14Data,
        table16Data,
        table13Data: returnArrayOfReason(table13ModalData),
        table15Data: returnArrayOfReason(table15ModalData),
      };

      gstr9cService
        .savePart4Data(payload)
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

  const onChangeOfTable12 = (change, source) => {
    if (validSourceStates.includes(source) && change && change.length > 0) {
      const oldData = [...table12Data];

      for (const [row, col, oldValue, newValue] of change) {
        const colIndex = table12Column.findIndex((obj) => obj.data === col);
        if (colIndex === 3 && [1, 2, 4].includes(row)) {
          onValidateCell(
            row,
            colIndex,
            keyOfTables.table12,
            newValue,
            setErrorArr
          );

          if (validChangeType.includes(typeof newValue)) {
            setEdited((pre) => ({ ...pre, table12: true }));

            oldData[row][col] = sanitizeValue(newValue);

            // A+B-C
            let totalForD = 0;
            for (let i = 0; i < 3; i++) {
              const element = oldData[i];

              if (+element[col]) {
                if (i == 2) {
                  totalForD -= element[col];
                } else {
                  totalForD += element[col];
                }
              }
            }

            oldData[3][col] = sanitizeValue(totalForD);

            // E - D
            oldData[5][col] = sanitizeValue(oldData[4][col] - oldData[3][col]);

            setTable12Data(oldData);
          }
        }
      }
    }
  };

  const onChangeOfTable14 = (change, source) => {
    if (validSourceStates.includes(source) && change && change.length > 0) {
      const oldData = [...table14Data];

      for (const [row, col, oldValue, newValue] of change) {
        const colIndex = table14Column.findIndex((obj) => obj.data === col);
        if (colIndex > 2 && row < 17 || (colIndex === 5 && row === 18)) {
          onValidateCell(
            row,
            colIndex,
            keyOfTables.table14,
            newValue,
            setErrorArr
          );

          if (validChangeType.includes(typeof newValue)) {
            setEdited((pre) => ({ ...pre, table14: true }));

            oldData[row][col] = sanitizeValue(newValue);

            // A to Q
            let totalForR = 0;
            for (let i = 0; i < 17; i++) {
              const element = oldData[i];

              if (+element[col]) {
                totalForR += element[col];
              }
            }

            oldData[17][col] = sanitizeValue(totalForR);

            // S - R
            oldData[19][col] = sanitizeValue(oldData[18][col] - oldData[17][col]);

            setTable14Data(oldData);
          }
        }
      }
    }
  };

  const onChangeOfTable16 = (change, source) => {
    if (validSourceStates.includes(source) && change && change.length > 0) {
      const oldData = [...table16Data];

      for (const [row, col, oldValue, newValue] of change) {
        const colIndex = table16Column.findIndex((obj) => obj.data === col);

        if (colIndex === 2) {
          onValidateCell(
            row,
            colIndex,
            keyOfTables.table16,
            newValue,
            setErrorArr
          );

          if (validChangeType.includes(typeof newValue)) {
            setEdited((pre) => ({ ...pre, table16: true }));

            oldData[row][col] = sanitizeValue(newValue);
            setTable16Data(oldData);
          }
        }
      }
    }
  };

  const theader = (col, TH) => {
    if (col == 0 || col == 1 || col == 7) {
      TH.className = "htLeft";
    } else {
      TH.className = "htRight";
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
                12. Reconciliation of Net Input Tax Credit (ITC){" "}
              </h3>
              <div className="float-end col-md-3 text-end">
                <Button
                  className="btn-icon me-1"
                  outline
                  color="danger"
                  id="btnDeleteGSTR9C"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTableData(12, props.setBlock, getData, deletePayload);
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
                columns={table12Column}
                data={table12Data}
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

                  if (col == 3 && !([1,2,4].includes(row))) {
                    cp.className = "purchseCellDisable text-end boldRow";
                  }

                  if (cp?.className?.includes("purchseCellDisable")) {
                    cp.readOnly = true;
                  }

                  return cp;
                }}
                afterChange={(x, y) => onChangeOfTable12(x, y)}
                afterRenderer={(TD, row, col, prop, value) => {
                  if (
                    errorArr.findIndex(
                      (y) =>
                        y.row == row &&
                        y.col == col &&
                        y.table == keyOfTables.table12
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
                13. Reasons for un-reconciled difference in ITC{" "}
              </h3>
              <div className="float-end col-md-3 text-end">
                <Button
                  className="btn-icon me-1"
                  outline
                  color="danger"
                  id="btnDeleteGSTR9C"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTableData(13, props.setBlock, getData, deletePayload);
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
                columns={table13Column}
                data={table13Data}
                stretchH="all"
                preventOverflow="horizontal"
                rowHeights={RowSize}
                afterGetColHeader={loadHeaderForReasonTable}
                columnHeaderHeight={columnHeaderSize}
                cells={loadCellForReasonTable}
                afterOnCellMouseDown={(event, coords, td) => {
                  if (coords?.col === 0) {
                    setTable13Modal(true);
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
                14. Reconciliation of ITC declared in Annual Return (GSTR9) with
                ITC availed on expenses as per audited Annual Financial
                Statement or books of account{" "}
              </h3>
              <div className="float-end col-md-3 text-end">
                <Button
                  className="btn-icon me-1"
                  outline
                  color="danger"
                  id="btnDeleteGSTR9C"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTableData(14, props.setBlock, getData, deletePayload);
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
                columns={table14Column}
                data={table14Data}
                stretchH="all"
                preventOverflow="horizontal"
                rowHeights={RowSize}
                columnHeaderHeight={columnHeaderSize}
                afterGetColHeader={(col, TH) => {
                  if (col == 0 || col == 1) {
                    TH.className = "htLeft";
                  } else {
                    TH.className = "htRight";
                  }
                }}
                cells={function (row, col) {
                  var cp = {};
                  if (col == 2) {
                    cp.className = "text-center";
                    cp.readOnly = true;
                  }

                  if (col > 2) {
                    cp.className = "text-end";
                  }

                  if (col < 2) {
                    cp.readOnly = true;
                  }

                  if ((col >= 3 && row >= 17) && !(col === 5 && row === 18)) {
                    cp.className = "purchseCellDisable text-end boldRow";
                  }

                  if (cp?.className?.includes("purchseCellDisable")) {
                    cp.readOnly = true;
                  }

                  return cp;
                }}
                afterChange={(x, y) => onChangeOfTable14(x, y)}
                afterRenderer={(TD, row, col, prop, value) => {
                  if (
                    errorArr.findIndex(
                      (y) =>
                        y.row == row &&
                        y.col == col &&
                        y.table == keyOfTables.table14
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
                15. Reasons for un-reconciled difference in ITC{" "}
              </h3>
              <div className="float-end col-md-3 text-end">
                <Button
                  className="btn-icon me-1"
                  outline
                  color="danger"
                  id="btnDeleteGSTR9C"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTableData(15, props.setBlock, getData, deletePayload);
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
                columns={table13Column}
                data={table15Data}
                stretchH="all"
                preventOverflow="horizontal"
                rowHeights={RowSize}
                columnHeaderHeight={columnHeaderSize}
                afterGetColHeader={loadHeaderForReasonTable}
                afterOnCellMouseDown={(event, coords, td) => {
                  if (coords?.col === 0) {
                    setTable15Modal(true);
                  }
                }}
                cells={loadCellForReasonTable}
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
                16. Tax payable on un-reconciled difference in ITC (due to
                reasons specified in 13 and 15 above){" "}
              </h3>
              <div className="float-end col-md-3 text-end">
                <Button
                  className="btn-icon me-1"
                  outline
                  color="danger"
                  id="btnDeleteGSTR9C"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTableData(16, props.setBlock, getData, deletePayload);
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
                columns={table16Column}
                data={table16Data}
                stretchH="all"
                preventOverflow="horizontal"
                rowHeights={RowSize}
                columnHeaderHeight={columnHeaderSize}
                afterGetColHeader={(col, TH) => {
                  if (col == 0 || col == 1) {
                    TH.className = "htLeft";
                  } else {
                    TH.className = "htRight";
                  }
                }}
                cells={function (row, col) {
                  var cp = {};
                  if (col == 2) {
                    cp.className = "text-end";
                  }

                  if (col < 2) {
                    cp.readOnly = true;
                  }

                  if (col == 3 && !(row == 1 || row == 2)) {
                    cp.className = "purchseCellDisable text-end boldRow";
                  }

                  if (cp?.className?.includes("purchseCellDisable")) {
                    cp.readOnly = true;
                  }

                  return cp;
                }}
                afterChange={(x, y) => onChangeOfTable16(x, y)}
                afterRenderer={(TD, row, col, prop, value) => {
                  if (
                    errorArr.findIndex(
                      (y) =>
                        y.row == row &&
                        y.col == col &&
                        y.table == keyOfTables.table16
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
      {table13Modal ? (
        <UnReconciledModal
          open={table13Modal}
          data={table13ModalData}
          setEdited={() => setEdited((pre) => ({ ...pre, table13: true }))}
          setNewData={setTable13ModalData}
          setTableData={setTable13Data}
          onToggle={() => setTable13Modal(false)}
          title={"13. Reasons for un-reconciled difference in ITC"}
        />
      ) : null}
      {table15Modal ? (
        <UnReconciledModal
          open={table15Modal}
          data={table15ModalData}
          setEdited={() => setEdited((pre) => ({ ...pre, table15: true }))}
          setNewData={setTable15ModalData}
          setTableData={setTable15Data}
          onToggle={() => setTable15Modal(false)}
          title={"15. Reasons for un-reconciled difference in ITC"}
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

export default Part4;
