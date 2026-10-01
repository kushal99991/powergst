import axios from "axios";
import { API_URL } from "@configs/config";
import { globleVariable } from "@configs/globalVariable";
import LocalFunction from "@configs/getLocalFunction";
import { convertIntoURL } from "../utils";
import { urlEndpointConfig } from '@configs/urlEndpoint'
import Swal from "sweetalert2";
const token = LocalFunction.getLocalValue(globleVariable.tokenKey, true);
import extractZip from "@helper/extraZip";
import toast from "react-hot-toast";

class Gstr1vs3BvsSales {


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


  async  getGstr1VS3bVSSalesReport(UserClientId, SubscriptionId, GSTNumber, Range) {
    try {
        const response = await axios.get(
            `${API_URL}/api/gstr1filed/gstr3b-gstr1-books-report?${convertIntoURL({
                UserClientId,
                Range,
                GSTNumber,
                SubscriptionId,
            })}`
        );

        if (response.data !== null && response.data?.status !== 500 && response.data?.status != -13000 ) {
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




  // getGstr1VS3bVSSalesReport(UserClientId, SubscriptionId, GSTNumber, Range) {
  //   return axios.get(
  //     // `${API_URL}/api/gstr1filed/gstr3b-gstr1-books-report?${convertIntoURL({
  //       `http://192.168.x.x:8083/api/gstr1filed/gstr3b-gstr1-books-report?${convertIntoURL({
  //       UserClientId,
  //       Range,
  //       GSTNumber,
  //       SubscriptionId,
  //     })}`
  //   );
  // }


  // getGstr1VS3bVSSalesReportCheckExistData(UserClientId, UserId, gstNumber, Type ) {
  //   return axios.get(
  //     //  `${API_URL} ${urlEndpointConfig.REPORT_GENERATE_EXISTDATA_ENDPOINT}?${convertIntoURL({
  //       `http://192.168.x.x:8083${urlEndpointConfig.REPORT_GENERATE_EXISTDATA_ENDPOINT}?${convertIntoURL({
  //       UserClientId,
  //       UserId,
  //       gstNumber,
  //       Type,
  //     })}`
  //   );
  // }


  async  getGstr1VS3bVSSalesReportCheckExistData(UserClientId, UserId, gstNumber, Type) {
    try {
        const response = await axios.get(
          `${API_URL}${urlEndpointConfig.REPORT_GENERATE_EXISTDATA_ENDPOINT}?${convertIntoURL({
                UserClientId,
                UserId,
                gstNumber,
                Type,
            })}`
        );

        if (response.data !== null && response.data?.status !== 500 && response.data?.status !== -13000 ) {
            return await extractZip(response?.data?.data);
        } else if (response.data?.status === 500) {
            toast.error(response?.data?.errorMessage, {
                position: "top-right",
            });
            return response.data?.errorMessage;
        } else {
          toast.error(response?.data?.errorMessage, {
            position: "top-right",
        });
        return []
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


  getGstr1VS3bVSSalesReportExport(
    UserClientId,
    SubscriptionId,
    GSTNumber,
    Range
  ) {
    return axios.get(
      `${API_URL}/api/gstr1filed/export-gstr3b-gstr1-books-report?${convertIntoURL(
        {
          UserClientId,
          Range,
          GSTNumber,
          SubscriptionId,
          t: token,
        }
      )}`
    );
  }
}

export default new Gstr1vs3BvsSales();
