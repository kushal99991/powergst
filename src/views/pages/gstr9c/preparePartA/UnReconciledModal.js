import { HotTable } from "@handsontable/react";
import React from "react";
import { X } from "react-feather";
import { Modal, ModalBody } from "reactstrap";
import { columnHeaderSize, RowSize } from "../../../../configs/config";
import { validSourceStates } from "../helper";

const UnReconciledModal = ({
  open,
  onToggle,
  data,
  title,
  setNewData,
  setEdited,
  setTableData,
  readOnly = false
}) => {
  const onChange = (change, source) => {
    if (validSourceStates.includes(source) && change && change.length > 0) {
      let oldData = [...data];
      for (const [row, col, oldValue, newValue] of change) {
        if (typeof newValue === "string" || typeof newValue === "number") {
          setEdited(true);

          oldData[row][col] = newValue;

          oldData = oldData.filter((item) => !!item?.reason);

          setTableData([
            {
              action: "View/Add reasons",
              noOfReason: oldData.length,
            },
          ]);

          oldData.push({ reason: "" });

          setNewData(oldData);
        }
      }
    }
  };
  return (
    <Modal
      backdrop="static"
      isOpen={open}
      toggle={onToggle}
      className="modal-dialog-centered  modal-lg"
    >
      <div className="modal-header">
        <h2 className="modal-title w-100 text-start">{title}</h2>
        <div className="modal-actions">
          <a onClick={onToggle} className="text-body">
            <X size={14} />
          </a>
        </div>
      </div>
      <ModalBody className="pb-2 pt-2">
        <h3 className="mb-2">{readOnly ? "Your reasons in the rows below" : "Please add your reasons in the rows below"}</h3>
        <HotTable
          height="auto"
          className="myRow"
          columns={[
            {
              title: "Reasons",
              data: "reason",
              width: 100,
            },
          ]}
          data={data}
          stretchH="all"
          preventOverflow="horizontal"
          rowHeights={RowSize}
          columnHeaderHeight={columnHeaderSize}
          afterGetColHeader={(col, TH) => {
            TH.className = "htCenter";
          }}
          cells={function (row, col) {
            var cp = {};
            cp.className = "text-start";

            if (cp?.className?.includes("purchseCellDisable")) {
              cp.readOnly = true;
            }

            return cp;
          }}
          readOnly={readOnly}
          afterChange={(x, y) => !readOnly && onChange(x, y)}
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
      </ModalBody>
    </Modal>
  );
};

export default UnReconciledModal;
