import axios from 'axios'
import { API_URL_GSTR6 } from '../../configs/config';


class gstr6aSummaryServices {

    getGSTR6Summary(UserClientId, FinancialYearId, FinMonth, SubscriptionId, gstNumber ) {
        return axios.get(API_URL_GSTR6 + '/api/gstr6a/get-gstr6a-summary?UserClientId=' + UserClientId + '&FromRange=' + FinancialYearId + '&ToRange=' + FinMonth  + '&SubscriptionId=' + SubscriptionId + '&gstNumber=' + gstNumber )
    }

    getOptionsListForCheckbox(payload) {
        return axios.post(API_URL_GSTR6 + '/api/gstr6a/get-gstr6a-pagination')
        // return axios.post('http://192.168.x.x:8085/api/gstr6a/get-gstr6a-pagination')
    }
 
    
    downloadGovtGSTR6Filed(UserClientId, UserId, range, SubscriptionId, gstNumber  ) {       
        return axios.get(API_URL_GSTR6 + '/api/gstr6a/download?UserClientId=' + UserClientId + '&UserId=' + UserId + '&range=' + range + '&SubscriptionId=' + SubscriptionId + '&gstNumber=' + gstNumber )
    }  
    downloadGovtGSTR6FiledWithoutOtp(UserClientId, UserId, range, SubscriptionId, gstNumber  ) {     
        return axios.get(API_URL_GSTR6 + '/api/gstr6a/download-without-otp?UserClientId=' + UserClientId + '&UserId=' + UserId + '&range=' + range + '&SubscriptionId=' + SubscriptionId + '&gstNumber=' + gstNumber )
    }

    exportGSTR6ExportData(UserClientId, FinancialYearId, Month,SectionId, token , subscriptionId , gstNumber, userId ) {
        return axios.get(API_URL_GSTR6 + '/api/gstr6a/export?UserClientId=' + UserClientId + '&FromRange=' + FinancialYearId + '&ToRange=' + Month + "&GSTR6ASectionId=" + SectionId + "&subscriptionId=" + subscriptionId + "&gstNumber=" + gstNumber + "&userId=" + userId + "&t="+token, {
            headers: {
                'Content-Type': 'application/json'
            }
        })       
    }
}

export default new gstr6aSummaryServices();
