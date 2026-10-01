import axios from 'axios'
// import { API_URL, API_URL_GSTR, SAMPLE_URL_RECO } from '../../configs/config';
import { SAMPLE_URL_RECO } from '../../../configs/config';
// import { globleVariable } from "../../configs/globalVariable";
import { globleVariable } from '../../../configs/globalVariable';
import LocalFunction from '../../../configs/getLocalFunction'

const token = LocalFunction.getLocalValue(globleVariable.tokenKey, true);

class panRecoService2AvsPurchase {

   
    checkDownloadPan(id, userId) {
        return axios.get(SAMPLE_URL_RECO + '/api/gstr2a/check-gstr2a-download?UserClientId=' + id + '&UserId=' + userId + '&Type=' + "Pan")
    }

    getReco2ACountPan(fromRange, toRange, fromDate, toDate, userClientId, userId, subscriptionId, gstNumber) {
        return axios.get(SAMPLE_URL_RECO + '/api/pan-reco2vs2a/gstr2a-count?FromRange=' + fromRange + '&ToRange=' + toRange + '&FromDate=' + fromDate + '&ToDate=' + toDate + '&UserClientId=' + userClientId + '&UserId=' + userId + '&subscriptionId='  + subscriptionId + '&gstNumber=' + gstNumber )
    }
 
    getSavedPanReco(userClientId, userId,gstNumber) {
        return axios.get(SAMPLE_URL_RECO + '/api/pan-reco2vs2a/get-reco-period?UserClientId=' + userClientId + '&userId=' + userId, '&gstNumber=' + gstNumber )
    }

    //main pan based reco
    getRecoListPan(payload) {
        return axios.post(SAMPLE_URL_RECO + '/api/pan-reco2vs2a/pan-reco-purchase-2a', payload)
    }

    getRecoSummaryPan(payload) {
        return axios.post(SAMPLE_URL_RECO + '/api/pan-reco2vs2a/pan-reco-summary-pagination', payload)
    }

    getRecoReportPan(payload) {
        return axios.post(SAMPLE_URL_RECO + '/api/pan-reco2vs2a/reconcilation-pagination', payload)
    }

    saveBulkReportPan(payload) {
        return axios.post(SAMPLE_URL_RECO + '/api/pan-reco2vs2a/bulk-select-action', payload)
    }

    saveRecoReportPan(payload) {
        return axios.post(SAMPLE_URL_RECO + '/api/pan-reco2vs2a/save-reco-action', payload)
    }


    exportRecoPan(payload) {
        return axios.get(SAMPLE_URL_RECO + '/api/pan-reco2vs2a/export' + payload,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
    }


    //** Pan reco Generate email excel
    generateEmailExcelPanReco(payload) {
        return axios.post(SAMPLE_URL_RECO + '/api/pan-reco2vs2a/generate-email-excel', payload)
    }

    // //** Pan reco pan send Mail
    sendEmailRecoPanReco(payload) {
        return axios.post(SAMPLE_URL_RECO + '/api/pan-reco2vs2a/panbased-sent-email', payload)
    }

    getDeLinkInvoiceList(payload) {
        return axios.post(SAMPLE_URL_RECO+'/api/pan-reco2vs2a/get-delink-invoice', payload)
    }

    saveLinkInvoice(payload) {
        return axios.post(SAMPLE_URL_RECO +'/api/pan-reco2vs2a/link-invoice', payload)
    }

    saveDeLinkInvoice(payload) {
        return axios.post(SAMPLE_URL_RECO +'/api/pan-reco2vs2a/delink-invoice', payload)
    }

}

export default new panRecoService2AvsPurchase();
