import errorCodeConfig from "@configs/apiErrorCodeConfig";
import { columnHeaderSize, RowSize } from "@configs/config";
import { HotTable } from "@handsontable/react";
import React, {
  useEffect,
  useCallback,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { ArrowLeft, ArrowRight, FilePlus, Trash2 } from "react-feather";
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
import GSTR9Service from "../../../../services/gstr9/gstr9Service";
import ErrorTable from "../../../components/ErrorTable/ErrorTable";
import { table9Column, table9Data } from "../gst9-columnData";

const MySwal = withReactContent(Swal);

const Part4 = forwardRef(
  ({ G_UCParId, finYearId, stepper, USerId }, ref) => {
    const [open, setOpen] = useState(["1"])
    const [block, setBlock] = useState(false);
    const [tableData, setTableData] = useState(table9Data);
    const [editedData, setEditedData] = useState([]);
    const [errorArr, setErrorArr] = useState([]);

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
    const theader = (col, TH) => {
      if (col == 0 || col == 7) {
        TH.className = "htLeft";
      } else {
        TH.className = "htRight";
      }
    };

    /**
     * use this function to delete the data fro selected year
     */
    const onDelete = useCallback(() => {
      setBlock(true);

      GSTR9Service.deleteTable9Data(String(G_UCParId), USerId, finYearId)
        .then((res) => {
          if (
            res.status === 200 &&
            res.data.status === errorCodeConfig.APIDefaultCode.Success
          ) {
            toast.success(res?.data?.successMessage, {
              position: "top-right",
            });

            getData();
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
    }, [G_UCParId, finYearId]);

    /**
     * use this function go grab the data from api
     */
    const getData = useCallback(() => {
      setBlock(true);

      GSTR9Service.fetchTab3Data(String(G_UCParId), finYearId)
        .then((res) => {
          if (
            res.status === 200 &&
            res.data.status === errorCodeConfig.APIDefaultCode.Success
          ) {
            if (res?.data?.data) setTableData(res.data.data);
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
    }, [G_UCParId, finYearId]);

    /**
     * use this function to save changed data
     * this will call the api with updated data payload
     * @param {*} callbackEvent: any callback event needs to perform in success
     * @returns
     */
    const saveData = (callbackEvent = null) => {
      if (editedData.length < 1) {
        if (callbackEvent) callbackEvent();
        return;
      }

      setBlock(true);
      const payload = {
        userClientId: String(G_UCParId),
        userId: USerId,
        financialYearId: finYearId,
        gstr9Table9Data: editedData,
      };

      GSTR9Service.saveTable9Data(payload)
        .then((res) => {
          if (
            res?.status === 200 &&
            res.data.status === errorCodeConfig.APIDefaultCode.Success
          ) {
            toast.success(res.data.successMessage, {
              position: "top-right",
            });

            setEditedData([]);
            getData();
            // callback event
            if (callbackEvent) callbackEvent();
          } else {
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
        .finally(() => setBlock(false));
    };

    /**
     * that functions will use in the parent component if needed
     */
    useImperativeHandle(ref, () => ({
      // that function will check there is any pending data for save
      // if "yes" then they will ask for conformation
      checkDataIsPendingForSave(callbackEvent) {
        if (editedData.length > 0) {
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
              onSaveClick(callbackEvent);
            }
          });
        } else {
          callbackEvent();
        }
      },
    }));

    /**
     * ask conformation before delete the data
     * @returns
     */
    const onDeleteClick = () => {
      return MySwal.fire({
        title: "Do you really want to delete the data?",
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
          onDelete();
        }
      });
    };

    /**
     * when user click on save
     * that function will check there is any error or not
     * if there is error then show in model
     * else call save function
     * @param {*} callbackEvent: callback event when save data success
     * @returns
     */
    const onSaveClick = (callbackEvent = null) => {
      const errorArray = [];

      errorArr.forEach((err) => {
        if ((err.table = "Part IV (Table: 9)")) {
          errorArray.push({
            tableName: "Part IV (Table: 9)",
            rowNo: err.row,
          });
        }
      });

      if (errorArray.length > 0) {
        return MySwal.fire({
          title: "<strong>Error</strong>",
          icon: "error",
          html: (
            <ErrorTable
              errorDataList={errorArray}
              mentionTableName={false}
            ></ErrorTable>
          ),
          customClass: {
            confirmButton: "btn btn-danger",
          },
          buttonsStyling: false,
          width: 600,
        });
      } else {
        saveData(callbackEvent);
      }
    };

    useEffect(() => {
      getData();
    }, []);

    const cellChange = (change, source) => {
      if (
        source === "edit" ||
        source === "CopyPaste.paste" ||
        source === "Autofill.fill"
      ) {
        change.forEach(([row, col, oldValue, newValue]) => {
          const colIndex = table9Column.findIndex((obj) => obj.data === col);

          const newData = [...tableData];

          if (colIndex === 1 || colIndex === 7) {
            if (colIndex === 1) {
              let sanitizedValue =
                typeof newValue === "string"
                  ? newValue.replace(/,/g, "")
                  : newValue;

              const cellObj = {
                row: row,
                col: colIndex,
                table: "Part IV (Table: 9)",
              };

              if (isNaN(sanitizedValue)) {
                setErrorArr((pre) => [...pre, cellObj]);
              } else
                setErrorArr((pre) =>
                  pre.filter(
                    (p) =>
                      !(p.row === cellObj.row && p.col === cellObj.col)
                  )
                );

              sanitizedValue = sanitizedValue ? sanitizedValue : 0;

              newData[row]["taxPayable"] = sanitizedValue;
            } else if (colIndex === 7) {
              newData[row]["notes"] = newValue;
            }

            setEditedData(newData);
            setTableData(newData);
          }
        });
      }
    };

    return (
      <React.Fragment>
        {block && <div className="loading1">Loading&#8230;</div>}

        <Accordion className="accordion-border" open={open} toggle={toggle}>
          <AccordionItem>
            <AccordionHeader targetId="1">
              <h3 className="gstr1Filing fw-bolder col-md-9 text-dark">
                9. Details of tax paid as declared in returns filed during the
                financial year
              </h3>
              <div className="float-end col-md-3 text-end">
                <Button
                  className="btn-icon me-1"
                  outline
                  color="danger"
                  id="btnDeleteGSTR9C"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteClick();
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
                data={tableData}
                stretchH="all"
                preventOverflow="horizontal"
                rowHeights={RowSize}
                // nestedHeaders={[
                //   [{ colspan: 3 }, { label: 'Paid through ITC(₹)', colspan: 4 }, { label: 'Notes', colspan: 1 }],
                //   ['Description','Tax Payable','Paid through Cash', 'Paid through ITC IGST', 'Central Tax', 'State Tax', 'Cess', ''],
                // ]}
                columnHeaderHeight={columnHeaderSize}
                afterGetColHeader={theader}
                cells={function (row, col) {
                  var cp = {};

                  if (col > 0 && col < 7) {
                    cp.className = "text-end";
                  }

                  if (col > 1 && col < 7) {
                    cp.className = "purchseCellDisable text-end boldRow ";
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

                    if (col > 0 && col < 7) {
                      if (!reg.test(e.key)) {
                        e.preventDefault();
                      }
                    }
                  }
                }}
                afterChange={(x, y) => cellChange(x, y)}
                beforeCreateRow={function (index, amount) {
                  let countRow = this?.countRows();
                  if (this?.isEmptyRow(countRow - 0)) {
                    return false;
                  }
                  return true;
                }}
                afterRenderer={(TD, row, col, prop, value) => {
                  if (
                    col == 1 &&
                    errorArr.findIndex(
                      (y) =>
                        y.row == row &&
                        y.col == col &&
                        y.table == "Part IV (Table: 9)"
                    ) != -1 &&
                    block === false &&
                    value
                  ) {
                    TD.style.backgroundColor = "red";
                  }
                }}
                contextMenu={false}
                bindRowsWithHeaders={true}
                licenseKey="non-commercial-and-evaluation"
                autoWrapRow={true}
              />
            </AccordionBody>
          </AccordionItem>
        </Accordion>

        <div style={{ zIndex: "999" }} className="btnFixFooter">
          <div className="container">
            <div
              style={{ margintop: "25px" }}
              className="d-flex justify-content-between row"
            >
              <div className="col-md-4 text-start">
                <Button
                  color="danger"
                  className="btn-prev "
                  // onClick={() => stepper.previous()}
                  onClick={() =>
                    ref.current.checkDataIsPendingForSave(() =>
                      stepper.previous()
                    )
                  }
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
                  onClick={() => onSaveClick()}
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
                  onClick={() =>
                    ref.current.checkDataIsPendingForSave(() => stepper.next())
                  }
                >
                  <span className="align-middle d-sm-inline-block d-none">
                    Next
                  </span>
                  <ArrowRight
                    size={14}
                    className="align-middle ms-sm-25 ms-0"
                  ></ArrowRight>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
);

export default Part4;
