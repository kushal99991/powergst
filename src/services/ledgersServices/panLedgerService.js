import axios from "axios"
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import { API_URL, API_URL_Ledger_Services } from '../../configs/config'
import extractZip from "../../helper/extraZip";
import { convertIntoURL } from "../utils";
import { urlEndpointConfig } from '@configs/urlEndpoint'
import errorCodeConfig from "@configs/apiErrorCodeConfig";


class PanLedgerService {



    async getPanLedger(UserClientId,UserId,subscriptionId, gstNumber){
        try {
            const response = await axios.get(API_URL_Ledger_Services +'/api/ledger/get-panbased-ledger-report?FKUserClientId=' + UserClientId + '&UserId=' + UserId + '&SubscriptionId=' + subscriptionId + '&GSTIN=' + gstNumber)

            if (response?.data?.data !== null && response?.data?.status !== 500 && response.data?.status != -13000) {
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
                if (response?.data?.status == errorCodeConfig.APIDefaultCode.GovtOTPExpire ) {
                    return  response?.data?.status
                } else {
                    return [];
                }

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

    panLedgerExportData(UserClientId,UserId,subscriptionId, gstNumber,token){
        return axios.get(API_URL_Ledger_Services +'/api/ledger/export-panbased-ledger-report?FKUserClientId=' + UserClientId + '&UserId=' + UserId + '&SubscriptionId=' + subscriptionId + '&GSTIN=' + gstNumber +  "&t="+token)
    }

    // cashLedgerExportExcelData(UserClientId,UserId,FromRange,ToRange, subscriptionId, gstNumber,token){
    //     return axios.get(API_URL_Ledger_Services + '/api/ledger/export-cash-ledger?FKUserClientId=' + UserClientId + '&UserId=' + UserId + '&FromRange=' + FromRange + '&ToRange=' + ToRange + '&SubscriptionId=' + subscriptionId + '&GSTNumber=' + gstNumber + "&t="+token, {
    //         headers: {
    //             'Content-Type': 'application/json'
    //         }
    //     })
    // }

     async getPanBasedLadderCheckExistData(UserClientId, UserId, gstNumber, Type) {
        try {
            const response = await axios.get(
                `${API_URL}${urlEndpointConfig.REPORT_GENERATE_EXISTDATA_ENDPOINT}?${convertIntoURL({
                    UserClientId,
                    UserId,
                    gstNumber,
                    Type,
                })}`
            );
            if (response?.data?.data !== null && response?.data?.status !== 500 && response.data?.status != -13000 )  {

                return await extractZip(response?.data?.data);
            } else if (response?.data?.status === 500) {
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


    async getPanBasedLadderCheckExistData(UserClientId, UserId, gstNumber, Type) {
        try {
            const response = await axios.get(
                `${API_URL}${urlEndpointConfig.REPORT_GENERATE_EXISTDATA_ENDPOINT}?${convertIntoURL({
                    UserClientId,
                    UserId,
                    gstNumber,
                    Type,
                })}`
            );
            if (response?.data?.data !== null && response?.data?.status !== 500 && response.data?.status != -13000 )  {

                return await extractZip(response?.data?.data);
            } else if (response?.data?.status === 500) {
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

}

export default new PanLedgerService();
