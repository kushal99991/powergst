import axios from "axios";
import { API_URL } from "@configs/config";
import { globleVariable } from "@configs/globalVariable";
import LocalFunction from '@configs/getLocalFunction'

const token = LocalFunction.getLocalValue(globleVariable.tokenKey , true )

class GSTR2BvsGST3BvsBooks {
  getGstr3bvs2bvsPurchaseApi(G_UCParId, subscriptionId, G_GSTIN, finYear,UserId) {
    return axios.get(
      API_URL +
        "/api/gstr2b/panbased-gstr2b-gstr3b-books-report?UserClientId=" +
        G_UCParId +
        "&Range=" +
        finYear +
        "&GstNumber=" +
        G_GSTIN +
        "&subscriptionId=" +
        subscriptionId +
        "&UserId=" +
        UserId
    );
  }

  getGstr3bvs2bvspurchaseApiExport(G_UCParId, subscriptionId, G_GSTIN, finYear,UserId) {
    return axios.get(
      API_URL +
        "/api/gstr2b/panbased-export-gstr3b-gstr2b-books-report?UserClientId=" +
        G_UCParId +
        "&Range=" +
        finYear +
        "&GstNumber=" +
        G_GSTIN +
        "&subscriptionId=" +
        subscriptionId +
        "&UserId=" +
        UserId+
        "&t="+ token
    );
  }




}

export default new GSTR2BvsGST3BvsBooks();
