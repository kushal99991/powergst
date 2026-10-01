import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import errorCodeConfig from "../../../configs/apiErrorCodeConfig";
import gstr9cService from "../../../services/gstr9c/gstr9cService";

const MySwal = withReactContent(Swal);

export const validSourceStates = ["edit", "CopyPaste.paste", "Autofill.fill", "updateData"];

export const validChangeType  = ["object", "string", "number"]

export const sanitizeValue = (newValue) => {
  let sanitizedValue =
    typeof newValue === "string" ? newValue.replace(/,/g, "") : newValue;

  sanitizedValue = sanitizedValue ? sanitizedValue : 0;

  if (+sanitizedValue) sanitizedValue = +parseFloat(sanitizedValue).toFixed(2);

  return sanitizedValue;
};

export const onValidateCell = (row, colIndex, table, newValue, setErrorArr) => {
  let sanitizedValue =
    typeof newValue === "string" ? newValue.replace(/,/g, "") : newValue;

  const cellObj = {
    row: row,
    col: colIndex,
    table,
  };

  if (isNaN(sanitizedValue)) {
    setErrorArr((pre) => [...pre, cellObj]);
  } else
    setErrorArr((pre) =>
      pre.filter(
        (p) =>
          !(
            p.row === cellObj.row &&
            p.col === cellObj.col &&
            p.table === cellObj.table
          )
      )
    );
};

export const loadCellForReasonTable = (row, col) => {
  var cp = {};
  if (col == 0) {
    cp.className = "text-center text-danger myRow ";
  }

  if (col == 1) {
    cp.className = "text-end purchseCellDisable";
  }

  cp.readOnly = true;

  return cp;
};

export const loadHeaderForReasonTable = (col, TH) => {
  if (col == 0) {
    TH.className = "htCenter";
  } else {
    TH.className = "htRight";
  }
};

const onDeleteTableData = (tableNumber, setBlock, reloadData, payload) => {
  // TODO: add api call

  let axiosInstance = null;

  // take a delete service according to the table number
  if (gstr9cService[`deleteTable${tableNumber}Data`]) {
    axiosInstance = gstr9cService[`deleteTable${tableNumber}Data`];
  }

  if (axiosInstance) {
    setBlock(true);
    axiosInstance(payload.userClientId, payload.userId, payload.financialYearId)
      .then((res) => {
        if (
          res.status === 200 &&
          res.data.status === errorCodeConfig.APIDefaultCode.Success
        ) {
          toast.success(res?.data?.successMessage, {
            position: "top-right",
          });

          reloadData(tableNumber);
        } else {
          setBlock(false);
          toast.error(res?.data?.errorMessage, {
            position: "top-right",
          });
        }
      })
      .catch(handleCatchResponse)
      .finally(() => {
        setBlock(false);
      });
  }
};

export const deleteTableData = async (
  tableNumber,
  setBlock,
  reloadData,
  payload
) => {
  const result = await MySwal.fire({
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
  });

  if (result.value) {
    onDeleteTableData(tableNumber, setBlock, reloadData, payload);
  }
};

export const handleCatchResponse = (error) => {
  Swal.fire({
    icon: "error",
    title: "",
    text: error?.message,
    customClass: {
      confirmButton: "btn btn-danger",
    },
    buttonsStyling: false,
  });
};

export const reloadReasonTables = (data, setData, setModalData) => {
  setData([
    {
      action: "View/Add reasons",
      noOfReason: data.length,
    },
  ]);

  const newModalData = data.map((item) => ({
    reason: item,
  }));

  newModalData.push({ reason: "" });

  setModalData(newModalData);
};

export const returnArrayOfReason = (data) => {
  return data.reduce((pre, curr) => {
    if (curr.reason) pre.push(curr.reason);
    return pre;
  }, []);
};
