import { HotTable } from "@handsontable/react";
import React, {
  forwardRef,
  Fragment,
  useImperativeHandle,
  useState,
} from "react";
import { useEffect } from "react";
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
import Footer from "../footer";
import {
  deleteTableData,
  handleCatchResponse,
  validSourceStates,
} from "../helper";

const MySwal = withReactContent(Swal);

const initialTableData = [
  {
    serialNumber: "1",
    particulars: "Financial Year",
    details: "2023-2024",
  },
  {
    serialNumber: "2",
    particulars: "GSTIN",
    details: "24AAACD5352M1ZN",
  },
  {
    serialNumber: "3A",
    particulars: "Legal Name",
    details: "BODAL CHEMICALS LIMITED",
  },
  {
    serialNumber: "3A",
    particulars: "Trade Name(if Any)",
    details: "BODAL CHEMICALS LIMITED",
  },
  {
    serialNumber: "4",
    particulars: "Name of the act if you are liable to audit under any act*",
    details: "",
  },
];

const tableColumn = [
  {
    title: "S.no",
    data: "serialNumber",
    width: 5,
  },
  {
    title: "Particulars",
    data: "particulars",
    width: 45,
  },
  {
    title: "Details",
    data: "details",
    width: 45,
  },
];

const keyOfTables = {
  table1: "Part I",
};

const Part1 = forwardRef((props, ref) => {
  const [open, setOpen] = useState(["1"]);

  const [errorArr, setErrorArr] = useState([]);

  const [table1Data, setTable1Data] = useState(initialTableData);

  const [edited, setEdited] = useState(false);

  const theader = (col, TH) => {
    TH.className = "htLeft";
  };

  const getData = () => {
    props.setBlock(true);
    gstr9cService
      .getPart1Data(
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
          setTable1Data(res.data.data);
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
  }, [props.changeFound]);

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

  const onChangeOfTable1 = (change, source) => {
    if (validSourceStates.includes(source) && change && change.length > 0) {
      const oldData = [...table1Data];

      for (const [row, col, oldValue, newValue] of change) {
        const colIndex = tableColumn.findIndex((obj) => obj.data === col);

        if (colIndex == 2) {
          if (typeof newValue === "string" || typeof newValue === "number") {
            setEdited(true);

            oldData[row][col] = newValue;
            setTable1Data(oldData);
          }
        }
      }
    }
  };

  const onClickToggle = (id) => {
    props.toggle(id, open, setOpen);
  };

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
        table1Data,
      };

      gstr9cService
        .saveTable1Data(payload)
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
              1. Basic details
            </h3>
            <div className="float-end col-md-3 text-end">
              <Button
                className="btn-icon me-1"
                outline
                color="danger"
                id="btnDeleteGSTR9C"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteTableData(1, props.setBlock, getData, {
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
              className="myRow"
              rowHeights={RowSize}
              width={"80%"}
              columnHeaderHeight={columnHeaderSize}
              data={table1Data}
              columns={tableColumn}
              afterChange={(x, y) => onChangeOfTable1(x, y)}
              beforeCreateRow={function (index, amount) {
                let countRow = this?.countRows();
                if (this?.isEmptyRow(countRow - 0)) {
                  return false;
                }
                return true;
              }}
              cells={function (row, col) {
                var cp = {};
                if (col == 2) {
                  cp.className = "text-start";
                }

                if (col < 2 || row < 4) {
                  cp.readOnly = true;
                }

                if (cp?.className?.includes("purchseCellDisable")) {
                  cp.readOnly = true;
                }

                return cp;
              }}
              afterGetColHeader={theader}
              stretchH="all"
              height="auto"
              selectionMode={"single"}
              licenseKey="non-commercial-and-evaluation"
              colWidths={[4, 15, null]}
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

export default Part1;
