import axios from 'axios'
import { API_URL_GSTR6 } from '../../configs/config';
import { globleVariable } from "../../configs/globalVariable";
import LocalFunction from '../../configs/getLocalFunction'


const token = LocalFunction.getLocalValue(globleVariable.tokenKey , true )


class gst4AServices {

    checkUserProcess(UserId) {
        return axios.get(API_URL_GSTR6 + '/api/gstr4a/check-user-process?UserId=' + UserId)
    }
    downloadMultiple(payload) {       
        return axios.post(API_URL_GSTR6 + '/api/gstr4a/download-multiple-data',payload)
    } 
    backgroundPagination(payload) {
        return axios.post(API_URL_GSTR6 + '/api/gstr2b/background-request-pagination', payload)
    }
    downloadGovtGSTR4A(UserClientId, UserId, range, SubscriptionId, gstNumber  ) { 
               return axios.get(API_URL_GSTR6 + '/api/gstr4a/download?UserClientId=' + UserClientId + '&UserId=' + UserId + '&range=' + range + '&SubscriptionId=' + SubscriptionId + '&gstNumber=' + gstNumber )
    } 
    downloadGovtGSTR4AWithOutOtp(UserClientId, UserId, range, SubscriptionId, gstNumber  ) {    
        return axios.get(API_URL_GSTR6 + '/api/gstr4a/download-without-otp?UserClientId=' + UserClientId + '&UserId=' + UserId + '&range=' + range + '&SubscriptionId=' + SubscriptionId + '&gstNumber=' + gstNumber )
    } 
    exportGSTR4AExportData(UserClientId, FinancialYearId, Month,SectionId , gstNumber, subscriptionId , userId ) {
        return axios.get(API_URL_GSTR6 + '/api/gstr4a/export?UserClientId=' + UserClientId + '&FromRange=' + FinancialYearId + '&ToRange=' + Month + "&GSTR4ASectionId=" + SectionId + "&subscriptionId=" + subscriptionId + "&gstNumber=" + gstNumber + "&userId=" + userId + "&t="+token, {
            headers: {
                'Content-Type': 'application/json'
            }
        })       
    } 
   
}

export default new gst4AServices();
