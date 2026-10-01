import axios from "axios";
import { API_URL } from "@configs/config";
import { globleVariable } from "@configs/globalVariable";
import LocalFunction from '@configs/getLocalFunction'
import { urlEndpointConfig } from '@configs/urlEndpoint'
import Swal from "sweetalert2";
import extractZip from "@helper/extraZip";
import toast from "react-hot-toast";
import { convertIntoURL } from "../utils";

const token = LocalFunction.getLocalValue(globleVariable.tokenKey , true )

class PanGSTR3BvsGSTR1vsBooks {
  // getPanGstr3bvsgstr1vsBooksApi(G_UCParId, subscriptionId, G_GSTIN, finYear,UserId) {
  //   return axios.get(
  //     API_URL +
  //       "/api/gstr1filed/panbased-gstr3b-gstr1-books-report?UserClientId=" +
  //       G_UCParId +
  //       "&Range=" +
  //       finYear +
  //       "&GstNumber=" +
  //       G_GSTIN +
  //       "&subscriptionId=" +
  //       subscriptionId +
  //       "&UserId=" +
  //       UserId
  //   );
  // }


  async  getPanGstr3bvsgstr1vsBooksApi(G_UCParId, subscriptionId, G_GSTIN, finYear,UserId) {
    try {
        const response = await axios.get(
          API_URL+"/api/gstr1filed/panbased-gstr3b-gstr1-books-report?UserClientId=" +
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

        if (response.data !== null && response.data?.status !== 500 &&  response.data?.status !== -13000  ) {
            return await extractZip(response?.data?.data);
        } else if (response.data?.status === 500) {
            toast.error(response?.data?.errorMessage, {
                position: "top-right",
            });
            return response.data?.errorMessage;
        }
    } catch (error) {
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
}



  async  getPanGstr3bvsgstr1vsBooksCheckExistData(UserClientId, UserId, gstNumber, Type) {
    try {
        const response = await axios.get(
          `${API_URL}${urlEndpointConfig.REPORT_GENERATE_EXISTDATA_ENDPOINT}?${convertIntoURL({
                UserClientId,
                UserId,
                gstNumber,
                Type,
            })}`
        );

        if (response.data !== null && response.data?.status !== 500 &&  response.data?.status !== -13000 ) {
            return await extractZip(response?.data?.data);
        } else if (response.data?.status === 500) {
            toast.error(response?.data?.errorMessage, {
                position: "top-right",
            });
            return [];
        } else {
          toast.error(response?.data?.errorMessage, {
            position: "top-right",
        });
        return [];
        }
    } catch (error) {
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
}



  getPanGstr3bvsgstr1vsBooksApiExport(G_UCParId, subscriptionId, G_GSTIN, finYear,UserId) {
    return axios.get(
      API_URL +
        "/api/gstr1filed/panbased-export-gstr3b-gstr1-books-report?UserClientId=" +
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

export default new PanGSTR3BvsGSTR1vsBooks();
