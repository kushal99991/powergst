import axios from 'axios'
import { API_URL, API_URL_GSTR, SAMPLE_URL_RECO } from '../../../configs/config';
import { globleVariable } from "../../../configs/globalVariable";
import LocalFunction from '../../../configs/getLocalFunction'

const token = LocalFunction.getLocalValue(globleVariable.tokenKey, true);


class recoServiceGstr1vsEinvoice {

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

    // exportReco(payload){
    //     return axios.post(API_URL_RECO_2A + '/api/reco2vs2a/export',payload)
    // }

    // ** GSTR2B import - GOVT file
    downloadMultiple(payload) {
        return axios.post(API_URL_GSTR + '/api/gstr2b/download-multiple-data', payload)
    }

    // ** Reco List


    // ** Reco report
    // getRecoReport(payload) {
    //     return axios.post(SAMPLE_URL_RECO + '/api/reco2vs2b/reconcilation-pagination', payload)
    // }

    // ** Save Reco action
    saveRecoReport(payload) {
        return axios.post(SAMPLE_URL_RECO + '/api/reco2vs2b/save-reco-action', payload)
    }


    // sendEmailReco2A(payload) {
    //     return axios.post(SAMPLE_URL_RECO + '/api/reco2vs2b/send-email', payload)
    // }

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



    getRecoReport(payload) {
        return axios.post(SAMPLE_URL_RECO + '/api/recogstr1vseinvoice/reconcilation-pagination', payload)
    }
    getRecoList(payload) {
        return axios.post(SAMPLE_URL_RECO + '/api/recogstr1vseinvoice/reco-gstr1-einvoice', payload)
        // return axios.post("http://192.168.x.x:8085" + '/api/recogstr1vseinvoice/reco-gstr1-einvoice', payload)
        // http://192.168.x.x:8085/
    }

    checkDownload(id, userId) {
        return axios.get(API_URL_GSTR + '/api/gstr2b/check-gstr2b-download?UserClientId=' + id + '&UserId=' + userId + '&Type=' + "")
    }
    getSavedReco(id,subscriptionId,G_GSTIN) {
        return axios.get(SAMPLE_URL_RECO + '/api/recogstr1vseinvoice/get-reco-period?UserClientId=' + id + "&subscriptionId=" + subscriptionId + "&gstNumber=" + G_GSTIN)
    }
    getReco2BCount(fromRange, toRange, fromDate, toDate, userClientId) {
        return axios.get(SAMPLE_URL_RECO + '/api/recogstr1vseinvoice/gstr1-count?FromRange=' + fromRange + '&ToRange=' + toRange + '&FromDate=' + fromDate + '&ToDate=' + toDate + '&UserClientId=' + userClientId)
    }
    getRecoPurchaseCount(fromRange, toRange, fromDate, toDate, userClientId,gstNumber,subscriptionId) {
        return axios.get(SAMPLE_URL_RECO + '/api/recogstr1vseinvoice/einvoice-count?FromRange=' + fromRange + '&ToRange=' + toRange + '&FromDate=' + fromDate + '&ToDate=' + toDate + '&UserClientId=' + userClientId + '&gstNumber=' + gstNumber + "&subscriptionId=" +subscriptionId )
    }
    exportReco(payload) {
        // return axios.get("http://192.168.x.x:8085" + '/api/recogstr1vseinvoice/export' + payload,
        return axios.get(SAMPLE_URL_RECO + '/api/recogstr1vseinvoice/export' + payload,
            {
                headers: {
                    'Content-Type': 'application/json'
                },
            })
    }

    // ** Generate email excel
    generateEmailExcel(payload) {
        return axios.post(SAMPLE_URL_RECO + '/api/recogstr1vseinvoice/generate-email-excel', payload)
    }

    // ** send Mail
    sendEmailRecoGST1vsEinvoice(payload) {
        return axios.post(SAMPLE_URL_RECO + '/api/recogstr1vseinvoice/send-email', payload)
    }

    saveRecoReport(payload) {
        return axios.post(SAMPLE_URL_RECO + '/api/recogstr1vseinvoice/save-reco-action', payload)
    }
    saveBulkReport(payload) {
        return axios.post(SAMPLE_URL_RECO + '/api/recogstr1vseinvoice/bulk-select-action', payload)
    }

    // Delink /link APi Configs
    getDeLinkInvoiceList(payload) {
        return axios.post(SAMPLE_URL_RECO+'/api/recogstr1vseinvoice/get-delink-invoice', payload)
    }

    saveDeLinkInvoice(payload) {
        return axios.post(SAMPLE_URL_RECO +'/api/recogstr1vseinvoice/delink-invoice', payload)
    }
    saveLinkInvoice(payload) {
        return axios.post(SAMPLE_URL_RECO +'/api/recogstr1vseinvoice/link-invoice', payload)
    }
}

export default new recoServiceGstr1vsEinvoice();