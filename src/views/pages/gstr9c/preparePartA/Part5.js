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
  onValidateCell,
  sanitizeValue,
  validChangeType,
  validSourceStates,
} from "../helper";

const MySwal = withReactContent(Swal);

const keyOfTables = {
  table17: "Part IV",
};

const table17Column = [
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
    title: "Taxable Value",
    data: "taxableValue",
    width: 15,
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

const initialTable17Data = [
  {
    serialNumber: "A",
    description: "5%",
    taxableValue: 0,
    igst: 0,
    cgst: 0,
    sgst: 0,
    cess: 0,
  },
  {
    serialNumber: "B",
    description: "12%",
    taxableValue: 0,
    igst: 0,
    cgst: 0,
    sgst: 0,
    cess: 0,
  },
  {
    serialNumber: "C",
    description: "18%",
    taxableValue: 0,
    igst: 0,
    cgst: 0,
    sgst: 0,
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
    cgst: 0,
    sgst: 0,
    cess: 0,
  },
  {
    serialNumber: "F",
    description: "0.25%",
    taxableValue: 0,
    igst: 0,
    cgst: 0,
    sgst: 0,
    cess: 0,
  },
  {
    serialNumber: "G",
    description: "0.10%",
    taxableValue: 0,
    igst: 0,
    cgst: 0,
    sgst: 0,
    cess: 0,
  },
  {
    serialNumber: "H",
    description: "Input tax credit",
    taxableValue: 0,
    igst: 0,
    cgst: 0,
    sgst: 0,
    cess: 0,
  },
  {
    serialNumber: "I",
    description: "Interest",
    taxableValue: 0,
    igst: 0,
    cgst: 0,
    sgst: 0,
    cess: 0,
  },
  {
    serialNumber: "J",
    description: "Late Fee",
    taxableValue: 0,
    igst: 0,
    cgst: 0,
    sgst: 0,
    cess: 0,
  },
  {
    serialNumber: "K",
    description: "Penalty",
    taxableValue: 0,
    igst: 0,
    cgst: 0,
    sgst: 0,
    cess: 0,
  },
  {
    serialNumber: "L",
    description:
      "Any other amount paid for supplies not included in annual return (GSTR9)",
    taxableValue: 0,
    igst: 0,
    cgst: 0,
    sgst: 0,
    cess: 0,
  },
  {
    serialNumber: "M",
    description: "Erroneous refund to be paid back",
    taxableValue: 0,
    igst: 0,
    cgst: 0,
    sgst: 0,
    cess: 0,
  },
  {
    serialNumber: "N",
    description: "Outstanding demands to be settled",
    taxableValue: 0,
    igst: 0,
    cgst: 0,
    sgst: 0,
    cess: 0,
  },
  {
    serialNumber: "O",
    description: "Others",
    taxableValue: 0,
    igst: 0,
    cgst: 0,
    sgst: 0,
    cess: 0,
  },
];

const Part5 = forwardRef((props, ref) => {
  const [open, setOpen] = useState(["1"]);
  const [errorArr, setErrorArr] = useState([]);

  const [table17Data, setTable17Data] = useState(initialTable17Data);

  const [edited, setEdited] = useState(false);

  const getData = () => {
    props.setBlock(true);
    console.log("COMING", props.G_GSTIN)
    gstr9cService
      .getPart5Data(
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
          setTable17Data(res.data.data);
          setErrorArr([]);
          setEdited(false);
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
        userClientId: String(props.UserClientId),
        userId: props.UserId,
        financialYearId: props.finYearId,
        table17Data,
      };

      gstr9cService
        .saveTable17Data(payload)
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
      if (edited) {
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

  const onChangeOfTable17 = (change, source) => {
    if (validSourceStates.includes(source) && change && change.length > 0) {
      const oldData = [...table17Data];

      for (const [row, col, oldValue, newValue] of change) {
        const colIndex = table17Column.findIndex((obj) => obj.data === col);

        if (colIndex >= 2) {
          onValidateCell(
            row,
            colIndex,
            keyOfTables.table17,
            newValue,
            setErrorArr
          );

          if (validChangeType.includes(typeof newValue)) {
            setEdited(true);

            oldData[row][col] = sanitizeValue(newValue);
            setTable17Data(oldData);
          }
        }
      }
    }
  };

  const onClickToggle = (id) => {
    props.toggle(id, open, setOpen);
  };

  return (
    <Fragment>
      <Accordion
        className="accordion-border"
        open={open}
        toggle={onClickToggle}
      >
        <AccordionItem>
          <AccordionHeader targetId="1">
            <h3 className="gstr1Filing fw-bolder col-md-9 text-dark">
              17. Auditor's recommendation on additional Liability due to
              non-reconciliation
            </h3>
            <div className="float-end col-md-3 text-end">
              <Button
                className="btn-icon me-1"
                outline
                color="danger"
                id="btnDeleteGSTR9C"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteTableData(17, props.setBlock, getData, {
                    userClientId: String(props.UserClientId),
                    userId: props.UserId,
                    financialYearId: props.finYearId,
                  });
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
              columns={table17Column}
              data={table17Data}
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

                // if (col == 3 && row >= 6) {
                //   cp.className = "purchseCellDisable text-end boldRow";
                // }

                if (cp?.className?.includes("purchseCellDisable")) {
                  cp.readOnly = true;
                }

                return cp;
              }}
              afterChange={(x, y) => onChangeOfTable17(x, y)}
              afterRenderer={(TD, row, col, prop, value) => {
                if (
                  errorArr.findIndex(
                    (y) =>
                      y.row == row &&
                      y.col == col &&
                      y.table == keyOfTables.table17
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
      </Accordion>
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

export default Part5;
