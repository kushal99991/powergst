import axios from 'axios'
import { API_URL_GSTR6 } from '../../configs/config';
import { globleVariable } from "../../configs/globalVariable";
import LocalFunction from '../../configs/getLocalFunction'


const token = LocalFunction.getLocalValue(globleVariable.tokenKey , true )


class iifInvoiceService {

    //** get-purchase-summary
    // getPurchaseSummary(UserClientId, FinancialYearId, FinMonth) {
    //     return axios.get(API_URL_RECO + '/api/purchase/get-purchase-summary?UserClientId=' + UserClientId + '&FromRange=' + FinancialYearId + '&ToRange=' + FinMonth)
    // }

    getIffPagination(payload) {
        return axios.post(API_URL_GSTR6 + '/api/iff/get-iff-pagination', payload)
    }
    getGSRT6TotalITCAvailable(payload) {
        return axios.get(API_URL_GSTR6 + '/api/gstr6/get-gstr6-total-itc-available?UserClientId=' + payload.UserClientId + '&FromRange=' + payload.FromRange + '&ToRange=' + payload.ToRange)
    }
    getGSRT6LateFee(payload) {
        return axios.get(API_URL_GSTR6 + '/api/gstr6/get-gstr6-latefee?UserClientId=' + payload.UserClientId + '&FromRange=' + payload.FromRange + '&ToRange=' + payload.ToRange)
    }
    iifPaginationDataDelete(payload) {
        return axios.post(API_URL_GSTR6 + '/api/iff/delete',payload);
    }

    gstrItcSaveInvoice(payload) {
        return axios.post(API_URL_GSTR6 + '/api/gstr6/insert-gstr6-totalitc',payload);
    }

    gstrLateFeeSaveInvoice(payload) {
        return axios.post(API_URL_GSTR6 + '/api/gstr6/insert-gstr6-latefee',payload);
    }

    gstrTotalITCDelete(payload) {
        return axios.post(API_URL_GSTR6 + '/api/gstr6/delete-gstr6-totalitcavailable',payload);
    }

    gstrLateFeeDelete(payload) {
        return axios.post(API_URL_GSTR6 + '/api/gstr6/delete-gstr6-latefee',payload);
    }

    IffImportExcel(uploadData, UserClientId, UserId, importedDate, IsValidate, PageSize, IsSupplierDebitNote, GSTNumber) {
        return axios.post(  API_URL_GSTR6 +'/api/iff/import-excel?UserClientId=' + UserClientId + '&UserId=' + UserId + '&importedDate=' + importedDate + '&PageSize=' + PageSize + '&GSTNumber=' + GSTNumber, uploadData)
    }
    IffPaginationData(payload) {
        return axios.post(API_URL_GSTR6 + '/api/iff/get-iff-error-pagination-data', payload)
    }

    // IffFailedValidation(payload) {
    //     return axios.post(API_URL_GSTR6 + '/api/iff/validate-failed-data', payload)
    // }

    IffFailedValidation(payload) {
        return axios.post(  API_URL_GSTR6 + '/api/iff/validate-failed-data', payload)
    }


    DownloadErrorFile(GUID) {
        return axios.get(API_URL_GSTR6 + '/api/iff/export-error?GUID=' + GUID+"&t="+ token, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }
    SalesInsertUpdate(purchaseData) {
        return axios.post(API_URL_GSTR6 + '/api/iff/insert-update-iff-data', purchaseData)
    }

    SalesDataById(purchaseObj) {
        return axios.post(API_URL_GSTR6 + '/api/iff/get-iff-data-by-id?IFFId='+ purchaseObj.PurchaseId +'&UserClientId=' + purchaseObj.UserClientId + '&FinancialYearId=' + purchaseObj.FinancialYearId + '&Month=' + purchaseObj.Month)
    }
}

export default new iifInvoiceService();
