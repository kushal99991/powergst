import axios from 'axios'
import { API_URL, API_URL_GSTR, SAMPLE_URL_RECO,API_URL_RECO_2A } from '../../configs/config';


class reco2AService {

    //** get-gstr2A-summary

    getGstr2ADataById(clientId, flag, IsITCAvailable, finYear, finMonth) {
        return axios.get(API_URL_GSTR + '/api/gstr2b/get-gstr2b-data?UserClientId=' + clientId + '&Flag=' + flag + '&IsITCAvailable=' + IsITCAvailable + '&FinancialYearId=' + finYear + '&Month=' + finMonth)
    }

    //** gstr export summary
    exportGstr2ASummary(UserClientId, FinancialYearId, Month) {
        return axios.get(API_URL_GSTR + '/api/gstr2b/export-summary?UserClientId=' + UserClientId + '&FinancialYearId=' + FinancialYearId + '&Month=' + Month, {
            headers: {
                'Content-Type': 'application/json'
            },
            responseType: 'arraybuffer' // text, pdf, csv file etc
        })
    }

    exportReco(payload){
        return axios.post(API_URL_RECO_2A + '/api/reco2vs2a/export',payload)
    }

    // ** GSTR2B import - GOVT file
    downloadMultiple(payload) {
        return axios.post(API_URL_GSTR + '/api/gstr2b/download-multiple-data', payload)
    }

    // ** Reco List
    getRecoList2A(payload) {
        return axios.post(API_URL_RECO_2A + '/api/reco2vs2a/reco-purchase-2a', payload)
    }

    // ** Reco report
    getRecoReport(payload) {
        return axios.post(SAMPLE_URL_RECO + '/api/reco2vs2b/reconcilation-pagination', payload)
    }

    // ** Save Reco action
    saveRecoReport(payload) {
        return axios.post(SAMPLE_URL_RECO + '/api/reco2vs2b/save-reco-action', payload)
    }

    // ** Generate email excel
    generateEmailExcel(payload) {
        return axios.post(SAMPLE_URL_RECO + '/api/reco2vs2b/generate-email-excel', payload)
    }

    // ** send Mail
    sendEmailReco2A(payload) {
        return axios.post(SAMPLE_URL_RECO + '/api/reco2vs2b/send-email', payload)
    }

    // ** Download  
    getDownloadEmailFile(fileName) {
        return axios.get(SAMPLE_URL_RECO + '/api/reco2vs2b/download-email-file?FileName=' + fileName,
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                responseType: 'arraybuffer'
            })
    }

}

export default new reco2AService();
