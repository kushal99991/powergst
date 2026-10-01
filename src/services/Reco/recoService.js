import axios from 'axios'
import { API_URL, API_URL_GSTR, SAMPLE_URL_RECO } from '../../configs/config';
import { globleVariable } from "../../configs/globalVariable";
import LocalFunction from '../../configs/getLocalFunction'

const token = LocalFunction.getLocalValue(globleVariable.tokenKey, true);

class recoService {

    //** get-gstr2b-summary
    getGstr2bDataById(clientId, flag, IsITCAvailable, finYear, finMonth) {
        return axios.get(API_URL_GSTR + '/api/gstr2b/get-gstr2b-data?UserClientId=' + clientId + '&Flag=' + flag + '&IsITCAvailable=' + IsITCAvailable + '&FinancialYearId=' + finYear + '&Month=' + finMonth)
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
    downloadMultiple(payload) {
        return axios.post(API_URL_GSTR + '/api/gstr2b/download-multiple-data', payload)
    }

    getRecoList(payload) {
        return axios.post(SAMPLE_URL_RECO + '/api/reco2vs2b/reco-purchase-2b', payload)
        // return axios.post('http://192.168.x.x:8086' + '/api/reco2vs2b/reco-purchase-2b', payload)

    }


    getSavedReco(id,gstNumber, subscriptionId) {
        return axios.get(SAMPLE_URL_RECO + '/api/reco2vs2b/get-reco-period?UserClientId=' + id + '&gstNumber=' + gstNumber + '&subscriptionId=' + subscriptionId )
    }

    getReco2BCount(fromRange, toRange, fromDate, toDate, userClientId, subscriptionId, gstNumber ) {
        return axios.get(SAMPLE_URL_RECO + '/api/reco2vs2b/gstr2b-count?FromRange=' + fromRange + '&ToRange=' + toRange + '&FromDate=' + fromDate + '&ToDate=' + toDate + '&UserClientId=' + userClientId +'&SubscriptionId=' + subscriptionId + '&gstNumber=' + gstNumber )
    }
    getRecoPurchaseCount(fromRange, toRange, fromDate, toDate, userClientId) {
        return axios.get(SAMPLE_URL_RECO + '/api/reco2vs2b/purchase-count?FromRange=' + fromRange + '&ToRange=' + toRange + '&FromDate=' + fromDate + '&ToDate=' + toDate + '&UserClientId=' + userClientId)
    }

    exportReco(payload) {
        return axios.get(SAMPLE_URL_RECO + '/api/reco2vs2b/export' + payload,
            {
                headers: {
                    'Content-Type': 'application/json'
                },
            })
    }


    getRecoReport(payload) {
        return axios.post(SAMPLE_URL_RECO + '/api/reco2vs2b/reconcilation-pagination', payload)
    }

    // getDeLinkInvoiceList(payload) {
    //     return axios.post('http://192.168.x.x:8084/api/reco2vs2b/get-delink-invoice', payload)
    // }
    getDeLinkInvoiceList(payload) {
        return axios.post(SAMPLE_URL_RECO+'/api/reco2vs2b/get-delink-invoice', payload)
    }

    saveLinkInvoice(payload) {
        return axios.post(SAMPLE_URL_RECO+'/api/reco2vs2b/link-invoice', payload)
    }

    saveDeLinkInvoice(payload) {
        return axios.post(SAMPLE_URL_RECO+'/api/reco2vs2b/delink-invoice', payload)
    }


    getDeLinkPanRecoInvoiceList(payload) {
        return axios.post(SAMPLE_URL_RECO+'/api/pan-reco2vs2b/get-delink-invoice', payload)
    }

    saveLinkPanRecoInvoice(payload) {
        return axios.post(SAMPLE_URL_RECO+'/api/pan-reco2vs2b/link-invoice', payload)
    }

    saveDeLinkInvoicePanReco(payload) {
        return axios.post(SAMPLE_URL_RECO+'/api/pan-reco2vs2b/delink-invoice', payload)
    }
    saveRecoReport(payload) {
        return axios.post(SAMPLE_URL_RECO + '/api/reco2vs2b/save-reco-action', payload)
    }

    checkDownload(id, userId) {
        return axios.get(API_URL_GSTR + '/api/gstr2b/check-gstr2b-download?UserClientId=' + id + '&UserId=' + userId + '&Type=' + "")
    }

    saveBulkReport(payload) {
        return axios.post(SAMPLE_URL_RECO + '/api/reco2vs2b/bulk-select-action', payload)
    }

    //** Generate email excel
    generateEmailExcel(payload) {
        return axios.post(SAMPLE_URL_RECO + '/api/reco2vs2b/generate-email-excel', payload)
    }

    //** send Mail
    sendEmailReco(payload) {
        return axios.post(SAMPLE_URL_RECO + '/api/reco2vs2b/send-email', payload)
    }

    //** Download
    getDownloadEmailFile(fileName, type) {
        return axios.get(SAMPLE_URL_RECO + '/api/reco2vs2b/download-email-file?FileName=' + fileName + "&t=" + token + '&type=' + type,
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                responseType: 'arraybuffer'
            })
    }


    getReco2BCountPan(fromRange, toRange, fromDate, toDate, userClientId, userId, subscriptionId, gstNumber) {
        return axios.get(SAMPLE_URL_RECO + '/api/pan-reco2vs2b/gstr2b-count?FromRange=' + fromRange + '&ToRange=' + toRange + '&FromDate=' + fromDate + '&ToDate=' + toDate + '&UserClientId=' + userClientId + '&UserId=' + userId + '&subscriptionId='  + subscriptionId + '&gstNumber=' + gstNumber )
    }
    getRecoPurchaseCountPan(fromRange, toRange, fromDate, toDate, userClientId, userId  ) {
        return axios.get(SAMPLE_URL_RECO + '/api/pan-reco2vs2b/purchase-count?FromRange=' + fromRange + '&ToRange=' + toRange + '&FromDate=' + fromDate + '&ToDate=' + toDate + '&UserClientId=' + userClientId + '&UserId=' + userId)
    }

    getSavedPanReco(userClientId, userId,gstNumber) {
        return axios.get(SAMPLE_URL_RECO + '/api/pan-reco2vs2b/get-reco-period?UserClientId=' + userClientId + '&userId=' + userId, '&gstNumber=' + gstNumber )
    }

    checkDownloadPan(id, userID) {
        return axios.get(API_URL_GSTR + '/api/gstr2b/check-gstr2b-download?UserClientId=' + id + '&UserId=' + userID + '&Type=' + "Pan")
    }


    //main pan based reco
    getRecoListPan(payload) {
        return axios.post(SAMPLE_URL_RECO + '/api/pan-reco2vs2b/pan-reco-purchase-2b', payload)
        // return axios.post('http://192.168.x.x:8086' + '/api/pan-reco2vs2b/pan-reco-purchase-2b', payload)

    }

    getRecoSummaryPan(payload) {
        return axios.post(SAMPLE_URL_RECO + '/api/pan-reco2vs2b/pan-reco-summary-pagination', payload)
    }

    getRecoReportPan(payload) {
        return axios.post(SAMPLE_URL_RECO + '/api/pan-reco2vs2b/reconcilation-pagination', payload)
    }

    saveBulkReportPan(payload) {
        return axios.post(SAMPLE_URL_RECO + '/api/pan-reco2vs2b/bulk-select-action', payload)
    }

    saveRecoReportPan(payload) {
        return axios.post(SAMPLE_URL_RECO + '/api/pan-reco2vs2b/save-reco-action', payload)
    }

   
    exportRecoPan(payload) {
        return axios.get(SAMPLE_URL_RECO + '/api/pan-reco2vs2b/export' + payload,
        // return axios.get('http://192.168.x.x:8086' + '/api/pan-reco2vs2b/export' + payload,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
    }


    //** Pan reco Generate email excel
    generateEmailExcelPanReco(payload) {
        return axios.post(SAMPLE_URL_RECO + '/api/pan-reco2vs2b/generate-email-excel', payload)
    }

    //** Pan reco pan send Mail
    sendEmailRecoPanReco(payload) {
        return axios.post(SAMPLE_URL_RECO + '/api/pan-reco2vs2b/panbased-sent-email', payload)
    }
}

export default new recoService();
