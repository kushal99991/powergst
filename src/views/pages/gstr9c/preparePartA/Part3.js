import { HotTable } from "@handsontable/react";
import React from "react";
import { useState } from "react";
import { Fragment } from "react";
import { Trash2 } from "react-feather";
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  Button,
} from "reactstrap";
import { columnHeaderSize, RowSize } from "../../../../configs/config";
import Footer from "../footer";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import ErrorTable from "../../../components/ErrorTable/ErrorTable";
import { forwardRef } from "react";
import { useImperativeHandle } from "react";
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
import { useEffect } from "react";
import gstr9cService from "../../../../services/gstr9c/gstr9cService";
import errorCodeConfig from "../../../../configs/apiErrorCodeConfig";
import { toast } from "react-hot-toast";

const MySwal = withReactContent(Swal);

const keyOfTables = {
  table9: "Part III (Table: 9)",
  table10: "Part III (Table: 10)",
  table11: "Part III (Table: 11)",
};

const table9Column = [
  {
    title: "S.no",
    data: "serialNumber",
    width: 5,
  },
  {
    title: "Description",
    data: "description",
    width: 20,
  },
  {
    title: "",
    data: "operator",
    width: 5,
  },
  {
    title: "Taxable Value (₹)",
    data: "taxableValue",
    width: 10,
  },
  {
    title: "Tax Amount (₹)",
    data: "cgst",
    width: 15,
  },
  {
    title: "Tax Amount (₹)",
    data: "sgst",
    width: 15,
  },
  {
    title: "Tax Amount (₹)",
    data: "igst",
    width: 15,
  },
  {
    title: "Tax Amount (₹)",
    data: "cess",
    width: 15,
  },
];

const initialTable9Data = [
  {
    serialNumber: "A",
    description: "5%",
    operator: "(+)",
    taxableValue: 0,
    igst: 0,
    cgst: 40,
    sgst: 0,
    cess: 40,
  },
  {
    serialNumber: "B",
    description: "5%(RC)",
    operator: "(+)",
    taxableValue: 0,
    igst: 0,
    cgst: 60,
    sgst: 0,
    cess: 10,
  },
  {
    serialNumber: "C",
    description: "12%",
    operator: "(+)",
    taxableValue: 0,
    igst: 0,
    cgst: 0,
    sgst: 30,
    cess: 0,
  },
  {
    serialNumber: "D",
    description: "12(RC)%",
    operator: "(+)",
    taxableValue: 0,
    igst: 0,
    cgst: 0,
    sgst: 0,
    cess: 0,
  },
  {
    serialNumber: "E",
    description: "18%",
    operator: "(+)",
    taxableValue: 0,
    igst: 50,
    cgst: 0,
    sgst: 0,
    cess: 80,
  },
  {
    serialNumber: "F",
    description: "18%(RC)",
    operator: "(+)",
    taxableValue: 0,
    igst: 0,
    cgst: 0,
    sgst: 0,
    cess: 0,
  },
  {
    serialNumber: "G",
    description: "28%",
    operator: "(+)",
    taxableValue: 0,
    igst: 80,
    cgst: 0,
    sgst: 0,
    cess: 0,
  },
  {
    serialNumber: "H",
    description: "28%(RC)",
    operator: "(+)",
    taxableValue: 0,
    igst: 0,
    cgst: 0,
    sgst: 50,
    cess: 40,
  },
  {
    serialNumber: "I",
    description: "3%",
    operator: "(+)",
    taxableValue: 0,
    igst: 0,
    cgst: 40,
    sgst: 0,
    cess: 60,
  },
  {
    serialNumber: "J",
    description: "0.25%",
    operator: "(+)",
    taxableValue: 0,
    igst: 0,
    cgst: 50,
    sgst: 0,
    cess: 0,
  },
  {
    serialNumber: "K",
    description: "0.10%",
    operator: "(+)",
    taxableValue: 0,
    igst: 0,
    cgst: 0,
    sgst: 0,
    cess: 0,
  },
  {
    serialNumber: "L",
    description: "Interest",
    operator: "(+)",
    taxableValue: 0,
    igst: 0,
    cgst: 50,
    sgst: 60,
    cess: 50,
  },
  {
    serialNumber: "M",
    description: "Late Fee",
    operator: "(+)",
    taxableValue: 0,
    igst: 0,
    cgst: 70,
    sgst: 60,
    cess: 40,
  },
  {
    serialNumber: "N",
    description: "Penalty",
    operator: "(+)",
    taxableValue: 0,
    igst: 0,
    cgst: 70,
    sgst: 50,
    cess: 40,
  },
  {
    serialNumber: "O",
    description: "Others",
    operator: "(+)",
    taxableValue: 0,
    igst: 70,
    cgst: 20,
    sgst: 0,
    cess: 0,
  },
  {
    serialNumber: "P",
    description: "Total amount to be paid as per tables above (A to O)*",
    operator: "(-)",
    taxableValue: 0,
    igst: 0,
    cgst: 30,
    sgst: 0,
    cess: 40,
  },
  {
    serialNumber: "Q",
    description: "Total amount paid as declared in Annual Return (GSTR 9)*",
    operator: "(+)",
    taxableValue: 0,
    igst: 80,
    cgst: 0,
    sgst: 60,
    cess: 0,
  },
  {
    serialNumber: "R",
    description: "Un-reconciled payment (Q-P)*",
    operator: "",
    taxableValue: 0,
    igst: 0,
    cgst: 0,
    sgst: 70,
    cess: 0,
  },
];

const table10Column = [
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

const initialTable10Data = [
  {
    action: "View/Add reasons",
    noOfReason: 0,
  },
];

const table11Column = [
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
    title: "Taxable Value (₹)",
    data: "taxableValue",
    width: 20,
  },
  {
    title: "CGST",
    data: "cgst",
    width: 15,
  },
  {
    title: "SGST",
    data: "sgst",
    width: 15,
  },
  {
    title: "IGST",
    data: "igst",
    width: 15,
  },
  {
    title: "CESS",
    data: "cess",
    width: 15,
  },
];

const initialTable11Data = [
  {
    serialNumber: "A",
    description: "5%",
    taxableValue: 0,
    igst: 0,
    cgst: 40,
    sgst: 0,
    cess: 70,
  },
  {
    serialNumber: "B",
    description: "12%",
    taxableValue: 0,
    igst: 0,
    cgst: 60,
    sgst: 0,
    cess: 70,
  },
  {
    serialNumber: "C",
    description: "18%",
    taxableValue: 0,
    igst: 0,
    cgst: 0,
    sgst: 50,
    cess: 0,
  },
  {
    serialNumber: "D",
    description: "28%",
    taxableValue: 0,
    igst: 0,
    cgst: 0,
    sgst: 0,
    cess: 0,
  },
  {
    serialNumber: "E",
    description: "3%",
    taxableValue: 0,
    igst: 0,
    cgst: 80,
    sgst: 0,
    cess: 0,
  },
  {
    serialNumber: "F",
    description: "0.25%",
    taxableValue: 0,
    igst: 0,
    cgst: 0,
    sgst: 70,
    cess: 80,
  },
  {
    serialNumber: "G",
    description: "0.10%",
    taxableValue: 0,
    igst: 0,
    cgst: 60,
    sgst: 0,
    cess: 0,
  },
  {
    serialNumber: "H",
    description: "Interest",
    taxableValue: 0,
    igst: 0,
    cgst: 0,
    sgst: 0,
    cess: 0,
  },
  {
    serialNumber: "I",
    description: "Late Fee",
    taxableValue: 0,
    igst: 0,
    cgst: 0,
    sgst: 40,
    cess: 0,
  },
  {
    serialNumber: "J",
    description: "Penalty",
    taxableValue: 0,
    igst: 50,
    cgst: 0,
    sgst: 60,
    cess: 0,
  },
  {
    serialNumber: "K",
    description: "Others",
    taxableValue: 0,
    igst: 0,
    cgst: 60,
    sgst: 0,
    cess: 50,
  },
];

const Part3 = forwardRef((props, ref) => {
  const [open, setOpen] = useState(["1", "2", "3"]);
  const [errorArr, setErrorArr] = useState([]);

  const [table9Data, setTable9Data] = useState(initialTable9Data);
  const [table10Data, setTable10Data] = useState(initialTable10Data);
  const [table11Data, setTable11Data] = useState(initialTable11Data);

  const [table10Modal, setTable10Modal] = useState(false);
  const [table10ModalData, setTable10ModalData] = useState([]);

  const [edited, setEdited] = useState({
    table9: false,
    table10: false,
    table11: false,
  });

  const onClickToggle = (id) => {
    props.toggle(id, open, setOpen);
  };

  const getData = (refreshOnly = null) => {
    props.setBlock(true);
    gstr9cService
      .getPart3Data(
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
            setTable9Data(res.data.data.table9Data);
            reloadReasonTables(
              res.data.data.table10Data,
              setTable10Data,
              setTable10ModalData
            );
            setTable11Data(res.data.data.table11Data);

            setErrorArr([]);
            setEdited({ table10: false, table11: false, table9: false });
          } else {
            // else part specify only for user will delete any one table
            // then we will update that table data only
            const newEdited = { ...edited };

            switch (true) {
              case refreshOnly === 9:
                newEdited.table9 = false;
                setTable9Data(res.data.data.table9Data);
                break;

              case refreshOnly === 10:
                newEdited.table10 = false;
                reloadReasonTables(
                  res.data.data.table10Data,
                  setTable10Data,
                  setTable10ModalData
                );
                break;

              case refreshOnly === 11:
                newEdited.table11 = false;
                setTable11Data(res.data.data.table11Data);
                break;
            }

            const newErrorArr = [];

            errorArr.forEach((item) => {
              if (
                (keyOfTables.table9 === item.table && !newEdited.table9) ||
                (keyOfTables.table10 === item.table && !newEdited.table10) ||
                (keyOfTables.table11 === item.table && !newEdited.table11)
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
        table9Data,
        table10Data: returnArrayOfReason(table10ModalData),
        table11Data,
      };

      gstr9cService
        .savePart3Data(payload)
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

  const onChangeOfTable9 = (change, source) => {
    if (validSourceStates.includes(source) && change && change.length > 0) {
      const oldData = [...table9Data];

      for (const [row, col, oldValue, newValue] of change) {
        const colIndex = table9Column.findIndex((obj) => obj.data === col);

        if (
          (colIndex > 3 && ![15, 17].includes(row)) ||
          (colIndex == 3 && row < 11)
        ) {
          onValidateCell(
            row,
            colIndex,
            keyOfTables.table9,
            newValue,
            setErrorArr
          );

          if (validChangeType.includes(typeof newValue)) {
            setEdited((pre) => ({ ...pre, table9: true }));

            oldData[row][col] = sanitizeValue(newValue);

            // const cols = ["taxableValue", "cgst", "sgst", "igst", "cess"];
            let totalForP = 0;
            for (let i = 0; i <= 14; i++) {
              const element = oldData[i];

              if (+element[col]) {
                totalForP += element[col];
              }
            }

            oldData[15][col] = sanitizeValue(totalForP);

            // Q - P
            oldData[17][col] = sanitizeValue(
              oldData[16][col] - oldData[15][col]
            );

            setTable9Data(oldData);
          }
        }
      }
    }
  };

  const onChangeOfTable11 = (change, source) => {
    if (validSourceStates.includes(source) && change && change.length > 0) {
      const oldData = [...table11Data];

      for (const [row, col, oldValue, newValue] of change) {
        const colIndex = table11Column.findIndex((obj) => obj.data === col);

        if (colIndex > 2 || (colIndex == 2 && row < 6)) {
          onValidateCell(
            row,
            colIndex,
            keyOfTables.table11,
            newValue,
            setErrorArr
          );

          if (validChangeType.includes(typeof newValue)) {
            setEdited((pre) => ({ ...pre, table11: true }));

            oldData[row][col] = sanitizeValue(newValue);

            setTable11Data(oldData);
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
                9. Reconciliation of rate wise liability and amount payable
                thereon{" "}
              </h3>
              <div className="float-end col-md-3 text-end">
                <Button
                  className="btn-icon me-1"
                  outline
                  color="danger"
                  id="btnDeleteGSTR9C"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTableData(9, props.setBlock, getData, deletePayload);
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
                columns={table9Column}
                data={table9Data}
                nestedHeaders={[
                  [
                    { label: "S.no" },
                    { label: "Description" },
                    { label: "" },
                    { label: "Taxable Value (₹)" },
                    { label: "Tax Amount (₹)", colspan: 4 },
                  ],
                  [
                    { label: "" },
                    { label: "" },
                    { label: "" },
                    { label: "" },
                    { label: "CGST" },
                    { label: "SGST" },
                    { label: "IGST" },
                    { label: "CESS" },
                  ],
                ]}
                stretchH="all"
                preventOverflow="horizontal"
                rowHeights={RowSize}
                columnHeaderHeight={columnHeaderSize}
                afterGetColHeader={(col, TH) => {
                  if (col == 0 || col == 1) {
                    TH.className = "htLeft";
                  } else {
                    TH.className = "htCenter";
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

                  if (
                    (col > 2 && (row == 15 || row == 17)) ||
                    (col == 3 && row == 16) ||
                    (col == 3 && row >= 11 && row <= 14)
                  ) {
                    cp.className = "purchseCellDisable text-end boldRow";
                  }

                  if (cp?.className?.includes("purchseCellDisable")) {
                    cp.readOnly = true;
                  }

                  return cp;
                }}
                afterChange={(x, y) => onChangeOfTable9(x, y)}
                afterRenderer={(TD, row, col, prop, value) => {
                  if (
                    errorArr.findIndex(
                      (y) =>
                        y.row == row &&
                        y.col == col &&
                        y.table == keyOfTables.table9
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
                10. Reasons for un-reconciled payment of amount{" "}
              </h3>
              <div className="float-end col-md-3 text-end">
                <Button
                  className="btn-icon me-1"
                  outline
                  color="danger"
                  id="btnDeleteGSTR9C"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTableData(10, props.setBlock, getData, deletePayload);
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
                columns={table10Column}
                data={table10Data}
                stretchH="all"
                preventOverflow="horizontal"
                rowHeights={RowSize}
                columnHeaderHeight={columnHeaderSize}
                afterGetColHeader={loadHeaderForReasonTable}
                cells={loadCellForReasonTable}
                afterOnCellMouseDown={(event, coords, td) => {
                  if (coords?.col === 0) {
                    setTable10Modal(true);
                  }
                }}
                afterRenderer={(TD, row, col, prop, value) => {
                  if (
                    errorArr.findIndex(
                      (y) =>
                        y.row == row && y.col == col && y.table == tables.table4
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
                11. Additional amount payable but not paid (due to reasons
                specified under Tables 6,8 and 10 above){" "}
              </h3>
              <div className="float-end col-md-3 text-end">
                <Button
                  className="btn-icon me-1"
                  outline
                  color="danger"
                  id="btnDeleteGSTR9C"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTableData(11, props.setBlock, getData, deletePayload);
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
                columns={table11Column}
                data={table11Data}
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

                  if (col >= 2) {
                    cp.className = "text-end";
                  }

                  if (col < 2) {
                    cp.readOnly = true;
                  }

                  if (col == 2 && row >= 6) {
                    cp.className = "purchseCellDisable text-end boldRow";
                  }

                  if (cp?.className?.includes("purchseCellDisable")) {
                    cp.readOnly = true;
                  }

                  return cp;
                }}
                afterChange={(x, y) => onChangeOfTable11(x, y)}
                afterRenderer={(TD, row, col, prop, value) => {
                  if (
                    errorArr.findIndex(
                      (y) =>
                        y.row == row &&
                        y.col == col &&
                        y.table == keyOfTables.table11
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
      {table10Modal ? (
        <UnReconciledModal
          open={table10Modal}
          data={table10ModalData}
          setEdited={() => setEdited((pre) => ({ ...pre, table10: true }))}
          setNewData={setTable10ModalData}
          setTableData={setTable10Data}
          onToggle={() => setTable10Modal(false)}
          title={"10. Reasons for un-reconciled payment of amount"}
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

export default Part3;
