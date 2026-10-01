import axios from 'axios'
import { API_URL_ITC04 } from '../../configs/config';
import { globleVariable } from '../../configs/globalVariable';
import LocalFunction from '../../configs/getLocalFunction';

const token = LocalFunction.getLocalValue(globleVariable.tokenKey , true )

class itc04SummaryServices {

    getITC04Summary(UserClientId, FinancialYearId, FinMonth) {
        return axios.get(API_URL_ITC04 + '/api/itc04/get-itc04-summary?UserClientId=' + UserClientId + '&FromRange=' + FinancialYearId + '&ToRange=' + FinMonth)
    }
    itc04delete(payload) {
        return axios.post(API_URL_ITC04 + '/api/itc04/delete-itc04',payload);
    }
    exportITC04ExportData(UserClientId, FinancialYearId,returnPeriodlabel ,SectionId, token, gstNumber ) {
        return axios.get(API_URL_ITC04 + '/api/itc04/export?UserClientId=' + UserClientId + '&Range=' + FinancialYearId  + "&returnPeriodlabel="+returnPeriodlabel  +"&ITC04SectionId=" +SectionId+ "&t="+token+"&gstNumber="+gstNumber , {
            headers: {
                'Content-Type': 'application/json',
            },
         
        })       
    }

    exportITC04ErrorFileData(GUID) {
        return axios.get(API_URL_ITC04 + '/api/itc04/export-error?GUID=' + GUID + "&t="+token, {
            headers: {
                'Content-Type': 'application/json',
            },
         
        })       
    }

      // **ITC04 Export Json
      ITC04ExportJson(payLoad) {
        return axios.post(API_URL_ITC04 + '/api/itc04/export-itc04-save-to-gov-json', payLoad)
    }

    multiDelete(payload){
        return axios.post(API_URL_ITC04 + "/api/itc04/multiple-delete-itc04" , payload)
    }
}

export default new itc04SummaryServices();
