import axios from 'axios'
import { API_URL, API_URL_GSTR,API_URL_2A } from '../../configs/config';


class gstpanService {

    //** get-gstr2b-summary
    getGstPanSummary(clientId,value) {
        return axios.get(API_URL_GSTR + '/api/gstr2b/panbased-gstr2b?UserId='+clientId+"&SearchByGSTIN="+value)};


    getGstPanSummaryISD(clientId,value) {
        return axios.get(API_URL_GSTR + '/api/itc0Filed/get-isd-company-list?UserId='+clientId+"&SearchByGSTIN="+value)};


    getGstPanSummaryCMP(clientId,value) {
        return axios.get(API_URL_GSTR + '/api/cmp08filed/get-composition-company-list?UserId='+clientId+"&SearchByGSTIN="+value)};


    getGstr2bDataById(clientId, flag, IsITCAvailable, finYear, finMonth) {
        return axios.get(API_URL_GSTR + '/api/gstr2b/get-gstr2b-data?UserClientId='+clientId + '&Flag=' + flag + '&IsITCAvailable=' + IsITCAvailable + '&FinancialYearId=' + finYear + '&Month=' + finMonth)
    }

    //** gstr export summary
    exportGstr2bSummary(UserClientId, FinancialYearId, Month) {
        return axios.get(API_URL_GSTR + '/api/gstr2b/export-summary?UserClientId=' + UserClientId + '&FinancialYearId=' + FinancialYearId + '&Month=' + Month, {
            headers: {
                'Content-Type': 'application/json'
            },
            responseType: 'arraybuffer' // text, pdf, csv file etc
        })
    }
    // ** GSTR2B import - GOVT file
    checkUserProcess(UserId) {
        return axios.get(API_URL_GSTR + '/api/gstr2b/check-user-process?UserId=' + UserId)
    }

    checkUserProcess2A(UserId) {
        return axios.get(API_URL_GSTR + '/api/gstr2a/check-user-process?UserId=' + UserId)
    }


    downloadMultiple(payload) {
        return axios.post(API_URL_GSTR + '/api/gstr2b/download-multiple-data',payload)
    }
    downloadMultiple2A(payload) {
        return axios.post(API_URL_2A + '/api/gstr2a/download-multiple-data',payload)
    }
    backgroundPagination(payload){
        return axios.post(API_URL_GSTR + '/api/gstr2b/background-request-pagination',payload)
    }


}

export default new gstpanService();
