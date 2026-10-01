import axios from 'axios'
import { API_URL_RECO, SAMPLE_URL_RECO } from '../../../configs/config';
import { globleVariable } from "../../../configs/globalVariable";
import LocalFunction from '../../../configs/getLocalFunction'


const token = LocalFunction.getLocalValue(globleVariable.tokenKey , true )

class PurchaseInvoiceService {



    //** get-purchase-summary
    getPurchaseSummary(UserClientId, FinancialYearId, FinMonth) {
        return axios.get(API_URL_RECO + '/api/purchase/get-purchase-summary?UserClientId=' + UserClientId + '&FromRange=' + FinancialYearId + '&ToRange=' + FinMonth)
    }

    getPurchasePagination(payload) {
        return axios.post(API_URL_RECO + '/api/purchase/get-purchase-pagination', payload)
    }

    getHSNPurchasePagination(payload) {
        return axios.post(API_URL_RECO + '/api/purchase/get-purchase-hsn-pagination', payload)
    }

    editHSNPurchasePagination(payload) {
        return axios.post(API_URL_RECO + '/api/purchase/insert-update-purchase-hsn', payload)
    }

    getHSNbyId(hsnId, fkid) {
        return axios.get(API_URL_RECO + '/api/purchase/get-purchase-hsn-by-id?purchaseHSNId=' + hsnId + '&FKUserClientId=' + fkid)
    }

    getSamplePagination() {
        return axios.post(SAMPLE_URL_RECO + '/api/reco2vs2b/sample-pagination')
    }

    // ** Purchase Import-excel
    PurchaseImportExcel(uploadData, UserClientId, UserId, importedDate, IsValidate, PageSize, IsSupplierDebitNote, gstNumber ) {
        return axios.post(  API_URL_RECO + '/api/purchase/import-excel?UserClientId=' + UserClientId + '&UserId=' + UserId + '&importedDate=' + importedDate + '&IsValidate=' + IsValidate + '&PageSize=' + PageSize + '&IsSupplierDebitNote=' + IsSupplierDebitNote + "&gstNumber="+gstNumber, uploadData)
    }

    // ** Download Error file
    // DownloadErrorFile(GUID) {
    //     return fetch(API_URL_RECO + '/api/purchase/export-error?GUID=' + GUID + "&t="+token, {

    //         method: 'get',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Authorization': `Bearer ${token}`,
    //         },
    //         responseType: 'arraybuffer',
    //         // body: JSON.stringify(data)

    //     })
    // }
    DownloadErrorFile(GUID) {
        return axios.get(API_URL_RECO + '/api/purchase/export-error?GUID=' + GUID + "&t="+token, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    // Purchase pagination data
    PurchasesePaginationData(payload) {
        return axios.post(API_URL_RECO + '/api/purchase/get-error-pagination-data', payload)
    }

    // Purchase New invoice
    PurchaseNewIncomeCreate(purchaseData) {
        return axios.post(API_URL_RECO + '/api/purchase/insert-update-purchase-data', purchaseData)
    }

    PurchaseFailedValidation(payload) {
        return axios.post(  API_URL_RECO + '/api/purchase/validate-failed-data', payload)
    }


    //single file excel-validation
    PurchaseFailedValidationSingleFile(payload) {
        return axios.post(  API_URL_RECO + '/api/purchase/validate-failed-data-single-file', payload)
    }

    //Purchase Get Id
    PurchaseDataById(purchaseObj) {
        return axios.post(API_URL_RECO + '/api/purchase/get-purchase-data-by-id?PurchaseId='+ purchaseObj.PurchaseId +'&UserClientId=' + purchaseObj.UserClientId + '&FinancialYearId=' + purchaseObj.FinancialYearId + '&Month=' + purchaseObj.Month)
    }


    // static data
    PurchasetblStaticDataMaster() {
        return axios.get(API_URL_RECO + '/api/purchase/get-purchase-master')
    }

    PurchaseInvoiceDelete(purchaseObj) {
        return axios.post(API_URL_RECO + '/api/purchase/delete', purchaseObj)
    }

    hsnPurchaseInvoiceDelete(purchaseObj) {
        return axios.post(API_URL_RECO + '/api/purchase/delete-purchase-hsn-id', purchaseObj)
    }

    // PurchaseDelete(range, userClientId, userId) {
    //     return axios.post(API_URL_RECO + '/api/purchase/delete-purchase?deleteRange=' + range + '&userClientId=' + userClientId + '&userId=' + userId);
    // }
    PurchaseDelete(payload) {
        return axios.post(API_URL_RECO + '/api/purchase/delete-purchase',payload);
    }

    //** ITC - GET
    getPurchaseItc(FKUserClientId, fromRange, toRange) {
        return axios.get(API_URL_RECO + '/api/purchase/get-purchase-itc?FKUserClientId=' + FKUserClientId + "&fromRange=" + fromRange + "&toRange=" + toRange)
    }

    //** ITC Insert and Update
    purchaseItcInsertUpdate(payLoad) {
        return axios.post(API_URL_RECO + '/api/purchase/insert-update-purchase-itc', payLoad)
    }

    //exemp

    getPurchaseExemp(FKUserClientId, fromRange, toRange) {
        return axios.get(API_URL_RECO + '/api/purchase/get-purchase-exemp?FKUserClientId=' + FKUserClientId + "&fromRange=" + fromRange + "&toRange=" + toRange)
    }

    //** exemp Insert and Update
    purchaseExempInsertUpdate(payLoad) {
        return axios.post(API_URL_RECO + '/api/purchase/insert-update-purchase-exemp', payLoad)

    }

    // ** Sales Entry - GSTR1
    SalestblStaticDataMaster() {
        return axios.get(API_URL_RECO + '/api/gstr1/get-gstr1-master')
    }

    SalesInvoiceDelete(purchaseObj) {
        return axios.post(API_URL_RECO + '/api/gstr1/delete', purchaseObj)
    }

    SalesInsertUpdate(purchaseData) {
        return axios.post(API_URL_RECO + '/api/gstr1/insert-update-gstr1-data', purchaseData)
    }

    SalesDataById(purchaseObj) {
        return axios.post(API_URL_RECO + '/api/gstr1/get-gstr1-data-by-id?Gstr1Id='+ purchaseObj.PurchaseId +'&UserClientId=' + purchaseObj.UserClientId + '&FinancialYearId=' + purchaseObj.FinancialYearId + '&Month=' + purchaseObj.Month)
    }

    multiDelete(payload){
        return axios.post(API_URL_RECO + "/api/purchase/multiple-delete-purchase" , payload)
    }


    getPurchasePaginationSummary(payload) {
        return axios.post(API_URL_RECO + '/api/purchase/get-purchase-pagination-summary', payload)
    }

}

export default new PurchaseInvoiceService();
