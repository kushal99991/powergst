import axios from 'axios'
import { API_URL, API_URL_GSTR,API_URL_2A } from '@configs/config';
import { urlEndpointConfig } from '@configs/urlEndpoint'
import Swal from "sweetalert2";
import extractZip from "@helper/extraZip";
import toast from "react-hot-toast";
import { convertIntoURL } from "../utils";
import LocalFunction from '../../configs/getLocalFunction';
import { globleVariable } from '../../configs/globalVariable';

const token = LocalFunction.getLocalValue(globleVariable.tokenKey , true )

class gstFilingStatusService {


    async  getCheckExistData(UserClientId, UserId, gstNumber, Type) {
        try {
            const response = await axios.get(
              `${API_URL}${urlEndpointConfig.REPORT_GENERATE_EXISTDATA_ENDPOINT}?${convertIntoURL({
                    UserClientId,
                    UserId,
                    gstNumber,
                    Type,
                })}`
            );

            if (response.data !== null && response.data?.status !== 500  &&  response.data?.status != -13000 ) {

                return await extractZip(response?.data?.data);
            } else if (response.data?.status === 500) {
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



    // getGstFilingStatusService(payLoad) {

    //     return axios.post(API_URL_GSTR + '/api/gstr1/get-return-file-status-report?UserClientId='+payLoad.userClientId+"&UserId="+payLoad.userId +
    //     "&SubscriptionId="+payLoad.subscriptionId +"&FinancialYear="+payLoad.financialYear  +"&GstNumber="+payLoad.gstNumber )
    // };

    exportGstFilingStatus(UserClientId,UserId,financialYear,subscriptionId,gstNumber) {
        return  axios.get(API_URL + '/api/gstr1/export-return-file-status-report?UserClientId=' + UserClientId + '&UserId='+UserId +"&FinancialYear=" + financialYear +  '&SubscriptionId='+ subscriptionId + '&GstNumber=' + gstNumber  + "&t="+ token,{
             headers: {
                 'Content-Type': 'application/json',
             }, 
         })
             
         }

    async  getGstFilingStatusService(payLoad) {
        try {
            const response = await axios.post(
                 API_URL+"/api/gstr1/get-return-file-status-report?UserClientId="+payLoad.userClientId+"&UserId="+payLoad.userId + "&SubscriptionId="+payLoad.subscriptionId +"&FinancialYear="+payLoad.financialYear  +"&GstNumber="+payLoad.gstNumber
            );

            if (response.data !== null && response.data?.status !== 500 &&  response.data?.status != -13000 ) {
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
}

export default new gstFilingStatusService();
