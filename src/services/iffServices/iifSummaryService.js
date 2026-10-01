import axios from 'axios'
import { API_URL_GSTR6 } from '../../configs/config';


class iifSummaryServices {

    getIIFSummary(UserClientId, FinancialYearId, FinMonth) {
        return axios.get(API_URL_GSTR6 + '/api/iff/get-iff-summary?UserClientId=' + UserClientId + '&FromRange=' + FinancialYearId + '&ToRange=' + FinMonth)
    }
    iifdelete(payload) {
        return axios.post(API_URL_GSTR6 + '/api/iff/delete-iff',payload);
    }
    exportIffExportData(UserClientId, FinancialYearId, Month,SectionId, token, gstNumber ) {
        return axios.get(API_URL_GSTR6 + '/api/iff/export?UserClientId=' + UserClientId + '&FromRange=' + FinancialYearId + '&ToRange=' + FinancialYearId + "&GSTR1SectionId="  +SectionId+ "&t="+token+ "&gstNumber=" +gstNumber  , {
            headers: {
                'Content-Type': 'application/json',
            },
         
        })       
    }


      // **IFF Export Json
      IFFExportJson(payLoad) {
        return axios.post(API_URL_GSTR6 + '/api/iff/export-iff-save-to-gov-json', payLoad)
    }

    multiDelete(payload){
        return axios.post(API_URL_GSTR6 + "/api/iff/multiple-delete-iff" , payload)
    }
    
}

export default new iifSummaryServices();
