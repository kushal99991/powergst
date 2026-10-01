import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import getSessionFunction from "../configs/getSessionFunction";
import { globleVariable } from "../configs/globalVariable";
const MySwal = withReactContent(Swal);

/**
 * Use this function to convert object into url query params
 * @param {*} obj as {key: "Value"}
 * @returns query params "key=value"
 */
export const convertIntoURL = (obj) => new URLSearchParams(obj).toString();

/**
 * use this function to find the date difference is more than a year or not
 * @param {*} fromDate
 * @param {*} toDate
 * @returns false if the difference is not more then one year else true
 */
export const checkDifferentIsGreaterThatOne = (fromDate, toDate) => {
  try {
    // Extracting from month and from year
    let fromMonth = parseInt(fromDate.substring(0, 2));
    let fromYear = parseInt(fromDate.substring(2));

    // Extracting to month and to year
    let toMonth = parseInt(toDate.substring(0, 2));
    let toYear = parseInt(toDate.substring(2));

    // Calculate the difference in years and months
    let yearDiff = toYear - fromYear;
    let monthDiff = toMonth - fromMonth;

    // Check if the gap between fromDate and toDate is more than one year or more than one month
    if (yearDiff > 1 || (yearDiff === 1 && monthDiff > 0)) {
      return true;
    }

    return false;
  } catch (error) {
    return false;
  }
};

export const deleteModalConfirm = async () => {
  try {
    const result = await MySwal.fire({
      title: "Are you sure delete this data?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      customClass: {
        confirmButton: "btn btn-danger",
        cancelButton: "btn btn-outline-dark ms-1",
      },
      buttonsStyling: false,
      allowOutsideClick: false,
    });

    if (result.value) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error in deleteModalConfirm:", error);
    return false;
  }
};

export const takeCompanyNameAsFirst = (list = [], setData) => {
  const G_GSTIN =
    sessionStorage.getItem(globleVariable.G_GSTIN) &&
    getSessionFunction.getSessionValue(globleVariable.G_GSTIN, true);

  if (list?.length > 0) {
    const newData = [...list];
    for (let index = 0; index < newData.length; index++) {
      if (newData[index]["gstinNumber"] == G_GSTIN) {
        const temp = newData[0];
        newData[0] = newData[index];
        newData[index] = temp;
      }
    }
    setData(newData);
  }
};
