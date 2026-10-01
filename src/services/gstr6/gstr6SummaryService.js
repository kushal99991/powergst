import axios from 'axios'
import { API_URL_GSTR6 } from '../../configs/config';


class gstr6SummaryServices {

    getGSTR6Summary(UserClientId, FinancialYearId, FinMonth) {
        return axios.get(API_URL_GSTR6 + '/api/gstr6/get-gstr6-summary?UserClientId=' + UserClientId + '&FromRange=' + FinancialYearId + '&ToRange=' + FinMonth)
    }
    gstr6delete(payload) {
        return axios.post(API_URL_GSTR6 + '/api/gstr6/delete-gstr6',payload);
    }
    exportGSTR6ExportData(UserClientId, FinancialYearId, Month,SectionId, token, gstNumber ) {
        return axios.get(API_URL_GSTR6 + '/api/gstr6/export?UserClientId=' + UserClientId + '&FromRange=' + FinancialYearId + '&ToRange=' + FinancialYearId + "&GSTR1SectionId="  +SectionId+ "&t="+token+ "&gstNumber=" +gstNumber  , {
            headers: {
                'Content-Type': 'application/json',
            },
         
        })       
    }

       // **Gstr6 Export Json
       gstr6ExportJson(payLoad) {
        return axios.post(API_URL_GSTR6 + '/api/gstr6/export-gstr6-save-to-gov-json', payLoad)
    }

    multiDelete(payload){
        return axios.post(API_URL_GSTR6 + "/api/gstr6/multiple-delete-gstr6" , payload)
    }
    
}

export default new gstr6SummaryServices();
