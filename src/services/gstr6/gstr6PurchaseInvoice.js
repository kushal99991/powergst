import axios from 'axios'
import { API_URL_GSTR6 } from '../../configs/config';
import { globleVariable } from "../../configs/globalVariable";
import LocalFunction from '../../configs/getLocalFunction'


const token = LocalFunction.getLocalValue(globleVariable.tokenKey , true )


class GSTR6PurchaseInvoiceService {

    //** get-purchase-summary
    // getPurchaseSummary(UserClientId, FinancialYearId, FinMonth) {
    //     return axios.get(API_URL_RECO + '/api/purchase/get-purchase-summary?UserClientId=' + UserClientId + '&FromRange=' + FinancialYearId + '&ToRange=' + FinMonth)
    // }

    getGSRT6PurchasePagination(payload) {
        return axios.post(API_URL_GSTR6 + '/api/gstr6/get-gstr6-pagination', payload)
    }
    getGSRT6TotalITCAvailable(payload) {
        return axios.get(API_URL_GSTR6 + '/api/gstr6/get-gstr6-total-itc-available?UserClientId=' + payload.UserClientId + '&FromRange=' + payload.FromRange + '&ToRange=' + payload.ToRange)
    }
    getGSRT6LateFee(payload) {
        return axios.get(API_URL_GSTR6 + '/api/gstr6/get-gstr6-latefee?UserClientId=' + payload.UserClientId + '&FromRange=' + payload.FromRange + '&ToRange=' + payload.ToRange)
    }
    gstrPaginationDataDelete(payload) {
        return axios.post(API_URL_GSTR6 + '/api/gstr6/delete',payload);
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

    PurchaseImportExcel(uploadData, UserClientId, UserId, importedDate, IsValidate, PageSize, IsSupplierDebitNote, GSTNumber) {
        return axios.post(API_URL_GSTR6 + '/api/gstr6/import-excel?UserClientId=' + UserClientId + '&UserId=' + UserId + '&importedDate=' + importedDate + '&PageSize=' + PageSize + '&GSTNumber=' + GSTNumber, uploadData)
    }
    PurchasesePaginationData(payload) {
        return axios.post(API_URL_GSTR6 + '/api/gstr6/get-gstr6-error-pagination', payload)
    }

    PurchaseFailedValidation(payload) {
        return axios.post(API_URL_GSTR6 + '/api/gstr6/validate-failed-data', payload)
    }

    DownloadErrorFile(GUID) {
        return axios.get(API_URL_GSTR6 + '/api/gstr6/export-error?GUID=' + GUID+"&t="+ token, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }

}

export default new GSTR6PurchaseInvoiceService();
