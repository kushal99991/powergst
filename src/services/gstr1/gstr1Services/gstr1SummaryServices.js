import axios from 'axios'
import { API_URL_GSTR1 } from '../../../configs/config';


class gstr1SummaryServices {

    getGSTR1Summary(UserClientId, FinancialYearId, FinMonth) {
        return axios.get(API_URL_GSTR1 + '/api/gstr1/get-gstr1-summary?UserClientId=' + UserClientId + '&FromRange=' + FinancialYearId + '&ToRange=' + FinMonth)
    }


    exportGSTR1Summary(UserClientId, FinancialYearId, Month, token) {
        return axios.get(API_URL_GSTR1 + '/api/gstr1/export-summary?UserClientId=' + UserClientId + '&FromRange=' + FinancialYearId + '&ToRange=' + Month + "&t=" + token, {
            headers: {
                'Content-Type': 'application/json'
            }

        })
    }


    exportGSTR1ExportData(UserClientId, FinancialYearId, Month, SectionId, token, gstNumber,subId) {
        return axios.get(API_URL_GSTR1 + '/api/gstr1/export?UserClientId=' + UserClientId + '&FromRange=' + FinancialYearId + '&ToRange=' + Month + "&GSTR1SectionId=" + SectionId + "&t=" + token + "&gstNumber=" + gstNumber + "&SubscriptionId=" + subId, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    // ** GsTR 1 Export Json
    Gstr1ExportJson(payLoad) {
        return axios.post(API_URL_GSTR1 + '/api/gstr1/export-gstr1-save-to-gov-json', payLoad)
    }

}

export default new gstr1SummaryServices();
