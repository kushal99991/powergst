import axios from 'axios'
import { API_GSTR1_FILED, API_URL_GSTR1 } from '../../../configs/config';


class gstr1FileDataSummaryServices {

    getGSTR1FiledSummary(UserClientId, FinancialYearId, FinMonth) {
        return axios.get(API_GSTR1_FILED + '/api/gstr1filed/get-gstr1-filed-summary?UserClientId=' + UserClientId + '&FromRange=' + FinancialYearId + '&ToRange=' + FinMonth)
    }

    exportGSTR1Summary(UserClientId, FinancialYearId, Month, token) {
        return axios.get(API_GSTR1_FILED + '/api/gstr1filed/export-filing-summary?UserClientId=' + UserClientId + '&FromRange=' + FinancialYearId + '&ToRange=' + Month + "&t="+token, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }



}

export default new gstr1FileDataSummaryServices();
