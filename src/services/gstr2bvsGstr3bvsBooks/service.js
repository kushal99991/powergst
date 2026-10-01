import axios from "axios";
import { API_URL } from "@configs/config";
import { globleVariable } from "@configs/globalVariable";
import LocalFunction from '@configs/getLocalFunction'
import Swal from "sweetalert2";
const token = LocalFunction.getLocalValue(globleVariable.tokenKey, true);



class GSTR2BvsGST3BvsBooks {

  handleApiError(error) {
    Swal.fire({
        icon: "error",
        title: "",
        text: error?.message,
        customClass: {
            confirmButton: "btn btn-danger",
        },
        buttonsStyling: false,
    });
}

  getGstr3bvsBooksvsgstr3bApi(G_UCParId, subscriptionId, G_GSTIN, finYear) {
    return axios.get(
      API_URL +
        "/api/gstr2b/gstr2b-gstr3b-books-report?UserClientId=" +
        G_UCParId +
        "&Range=" +
        finYear +
        "&GstNumber=" +
        G_GSTIN +
        "&subscriptionId=" +
        subscriptionId
    );
  }

  getGstr3bvsBooksvsgstr3bApiExport(G_UCParId, subscriptionId, G_GSTIN, finYear) {
    return axios.get(
      API_URL +
        "/api/gstr2b/export-gstr3b-gstr2b-books-report?UserClientId=" +
        G_UCParId +
        "&Range=" +
        finYear +
        "&GstNumber=" +
        G_GSTIN +
        "&subscriptionId=" +
        subscriptionId +
        "&t="+ token
    );
  }

  checkpreviousrecordGstr3bvsBooksvsgstr3bApi(G_UCParId, UserId, gstNumber, Type) {
    return axios.get(
      API_URL+"/api/gstr1/check-report-exist?UserClientId=" +
        G_UCParId +
        "&UserId=" +
        UserId +
        "&gstNumber=" +
        gstNumber +
        "&Type=" +
        Type
    );
  }




}

export default new GSTR2BvsGST3BvsBooks();
