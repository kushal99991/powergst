import axios from 'axios'
import { API_URL_ITC04 } from '../../configs/config';
import { globleVariable } from "../../configs/globalVariable";
import LocalFunction from '../../configs/getLocalFunction'


const token = LocalFunction.getLocalValue(globleVariable.tokenKey , true )


class GSTR6PurchaseInvoiceService {

    //** get-purchase-summary
    // getPurchaseSummary(UserClientId, FinancialYearId, FinMonth) {
    //     return axios.get(API_URL_RECO + '/api/purchase/get-purchase-summary?UserClientId=' + UserClientId + '&FromRange=' + FinancialYearId + '&ToRange=' + FinMonth)
    // }

    getITC04PurchasePagination(payload) {
        return axios.post(API_URL_ITC04 + '/api/itc04/get-itc04-pagination', payload)
    }
    itc04PaginationDataDelete(payload) {
        return axios.post(API_URL_ITC04 + '/api/itc04/delete',payload);
    }

    PurchaseImportExcel(uploadData, UserClientId, UserId, importedDate, IsValidate, PageSize, IsSupplierDebitNote, GSTNumber) {
        return axios.post(API_URL_ITC04 + '/api/itc04/import-excel?UserClientId=' + UserClientId + '&UserId=' + UserId + '&importedDate=' + importedDate + '&PageSize=' + PageSize + '&GSTNumber=' + GSTNumber, uploadData)
    }
    PurchasesePaginationData(payload) {
        return axios.post(API_URL_ITC04 + '/api/gstr6/get-gstr6-error-pagination', payload)
    }

    PurchaseFailedValidation(payload) {
        return axios.post(API_URL_ITC04 + '/api/gstr6/validate-failed-data', payload)
    }

    DownloadErrorFile(GUID) {
        return axios.get(API_URL_ITC04 + '/api/gstr6/export-error?GUID=' + GUID+"&t="+ token, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }
   
}

export default new GSTR6PurchaseInvoiceService();
