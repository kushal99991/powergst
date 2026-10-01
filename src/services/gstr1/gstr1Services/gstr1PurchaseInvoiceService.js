import axios from 'axios'
import { API_URL_RECO, SAMPLE_URL_RECO } from '../../../configs/config';

import { API_URL_GSTR1 } from '../../../configs/config'
import { globleVariable } from "../../../configs/globalVariable";
import LocalFunction from '../../../configs/getLocalFunction'


const token = LocalFunction.getLocalValue(globleVariable.tokenKey, true)


class GSTR1PurchaseInvoiceService {

    //** get-purchase-summary
    getPurchaseSummary(UserClientId, FinancialYearId, FinMonth) {
        return axios.get(API_URL_RECO + '/api/purchase/get-purchase-summary?UserClientId=' + UserClientId + '&FromRange=' + FinancialYearId + '&ToRange=' + FinMonth)
    }

    getGSRT1PurchasePagination(payload) {
        return axios.post(API_URL_GSTR1 + '/api/gstr1/get-gstr1-pagination', payload)
    }

    PurchasesePaginationData(payload) {
        return axios.post(API_URL_GSTR1 + '/api/gstr1/get-error-pagination-data', payload)
    }

    getGSTR1SummaryHSNPagination(payload) {
        return axios.post(API_URL_GSTR1 + '/api/gstr1/get-gstr1-hsn-pagination', payload)
    }
    // getHSNPurchasePagination(payload) {
    //     return axios.post(API_URL_RECO + '/api/purchase/get-purchase-hsn-pagination', payload)
    // }
    // editHSNPurchasePagination(payload) {
    //     return axios.post(API_URL_RECO + '/api/purchase/insert-update-purchase-hsn', payload)
    // }
    editGSTR1SummaryPagination(payload) {
        return axios.post(API_URL_GSTR1 + '/api/gstr1/insert-update-gstr1-hsn', payload)
    }

    // getHSNbyId(hsnId, fkid) {
    //     return axios.get(API_URL_RECO + '/api/purchase/get-purchase-hsn-by-id?purchaseHSNId=' + hsnId + '&FKUserClientId=' + fkid)
    // }
    getHSNbyId(hsnId, fkid) {
        return axios.get(API_URL_GSTR1 + '/api/gstr1/get-gstr1-hsn-by-id?gstr1HSNId=' + hsnId + '&FKUserClientId=' + fkid)
    }
    getGstr1SaleB2caSummary(payload) {
        return axios.post(API_URL_GSTR1 + '/api/gstr1/get-b2ca-summary', payload)
    }

    //** get exemp
    getExemptData(UserClientId, FinancialYearId, FinMonth) {
        return axios.get(API_URL_GSTR1 + '/api/gstr1/get-gstr1-exemp-data?FkUserClientId=' + UserClientId + '&FromRange=' + FinancialYearId + '&ToRange=' + FinMonth)
    }

    //** get Adavance summary data */
    getAdvanceSummary(UserClientId, FinancialYearId, FinMonth, GSTIN, SectionId) {
        return axios.get(API_URL_GSTR1 + '/api/gstr1/advance-summary?FkUserClientId=' + UserClientId + '&FromRange=' + FinancialYearId + '&ToRange=' + FinMonth + '&SectionId=' + SectionId + '&GSTIN=' + GSTIN)
    }
    //** get Adavance summary data */
    getAdvancePagination(payload) {
        return axios.post(API_URL_GSTR1 + '/api/gstr1/get-gstr1-advance-pagination', payload)
    }

    //** exemp Insert and Update
    saleExempInsertUpdate(payLoad) {
        return axios.post(API_URL_GSTR1 + '/api/gstr1/insert-update-gstr1-exemp-data', payLoad)
    }

    saleAdvanceSummaryInsertUpdate(payLoad) {
        return axios.post(API_URL_GSTR1 + '/api/gstr1/insert-update-gstr1-advance-summary', payLoad)
    }
    // static data
    saletblStaticDataMaster() {
        return axios.get(API_URL_GSTR1 + '/api/gstr1/get-gstr1-master')
    }

    // ** Purchase Import-excel
    PurchaseImportExcel(uploadData, UserClientId, UserId, importedDate, IsValidate, PageSize, IsSupplierDebitNote, GSTNumber) {
        return axios.post(API_URL_GSTR1 + '/api/gstr1/import-excel?UserClientId=' + UserClientId + '&UserId=' + UserId + '&importedDate=' + importedDate + '&PageSize=' + PageSize + '&GSTNumber=' + GSTNumber, uploadData)
    }



    DownloadErrorFile(GUID) {
        return axios.get(API_URL_GSTR1 + '/api/gstr1/export-error?GUID=' + GUID + "&t=" + token, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    // Purchase pagination data
    // PurchasesePaginationData(payload) {
    //     return axios.post(API_URL_RECO + '/api/purchase/get-error-pagination-data', payload)
    // }
    getSamplePagination() {
        return axios.post(SAMPLE_URL_RECO + '/api/reco2vs2b/sample-pagination')
    }

    // Purchase New invoice
    PurchaseNewIncomeCreate(purchaseData) {
        return axios.post(API_URL_RECO + '/api/purchase/insert-update-purchase-data', purchaseData)
    }

    // PurchaseFailedValidation(payload) {
    //     return axios.post(API_URL_GSTR1 + '/api/gstr1/validate-failed-data', payload)
    // }

    PurchaseFailedValidation(payload) {
        return axios.post(API_URL_RECO + '/api/gstr1/validate-failed-data', payload)
    }

    
     //single file excel-validation
     GSTR1FailedValidationSingleFile(payload) {
        return axios.post(  API_URL_RECO + '/api/gstr1/validate-failed-data-single-file', payload)
    }


    //Purchase Get Id
    PurchaseDataById(purchaseObj) {
        return axios.post(API_URL_RECO + '/api/purchase/get-purchase-data-by-id?PurchaseId=' + purchaseObj.PurchaseId + '&UserClientId=' + purchaseObj.UserClientId + '&FinancialYearId=' + purchaseObj.FinancialYearId + '&Month=' + purchaseObj.Month)
    }

    GSTR1InvoiceDelete(purchaseObj) {
        return axios.post(API_URL_GSTR1 + '/api/gstr1/delete', purchaseObj)
    }

    // PurchaseInvoiceDelete(purchaseObj) {
    //     return axios.post(API_URL_RECO + '/api/purchase/delete', purchaseObj)
    // }

    // hsnPurchaseInvoiceDelete(purchaseObj) {
    //     return axios.post(API_URL_RECO + '/api/purchase/delete-purchase-hsn-id', purchaseObj)
    // }

    hsnGSTR1InvoiceDelete(gstr1Obj) {
        return axios.post(API_URL_GSTR1 + '/api/gstr1/delete-gstr1-hsn-id', gstr1Obj)
    }


    PurchaseDelete(range, userClientId, userId) {
        return axios.post(API_URL_RECO + '/api/purchase/delete-purchase?deleteRange=' + range + "&userClientId=" + userClientId, "&userId=" + userId);
    }

    //** ITC - GET
    // getPurchaseItc(FKUserClientId, fromRange, toRange) {
    //     return axios.get(API_URL_RECO + '/api/purchase/get-purchase-itc?FKUserClientId='+ FKUserClientId + "&fromRange=" + fromRange + "&toRange="+toRange  )
    // }
    getGSTR1Doc(gstr1Obj) {
        return axios.post(API_URL_GSTR1 + '/api/gstr1/get-gstr1-docs-pagination', gstr1Obj)
    }

    gstr1DocsDeleted(docsDelete) {
        return axios.post(API_URL_GSTR1 + '/api/gstr1/delete-gstr1-docs-id', docsDelete)
    }

    getDocById(gstr1DocsId, fkid) {
        return axios.get(API_URL_GSTR1 + '/api/gstr1/get-gstr1-docs-by-id?gstr1DocsId=' + gstr1DocsId + '&FKUserClientId=' + fkid)
    }
    editDocsById(payload) {
        return axios.post(API_URL_GSTR1 + '/api/gstr1/insert-update-gstr1-docs', payload)
    }

    //** ITC Insert and Update
    purchaseItcInsertUpdate(payLoad) {
        return axios.post(API_URL_RECO + '/api/purchase/insert-update-purchase-itc', payLoad)
    }

    //exemp

    getPurchaseExemp(FKUserClientId, fromRange, toRange) {
        return axios.get(API_URL_RECO + '/api/purchase/get-purchase-exemp?FKUserClientId=' + FKUserClientId + "&fromRange=" + fromRange + "&toRange=" + toRange)
    }



    //**get gstr checkbox data
    getgstr1checkdata() {
        return axios.get(API_URL_RECO + '/api/gstr1/get-gstr1-master')
    }

    //**gstr1 delete
    gstr1delete(payload) {
        return axios.post(API_URL_RECO + '/api/gstr1/delete-gstr1', payload);
    }

    //**  supeco Section (Get Data)
    getDataGstr1Supeco(gstr1Obj) {
        return axios.post(API_URL_GSTR1 + '/api/gstr1/get-gstr1-supeco-pagination', gstr1Obj)
    }

    //**  supeco Section (Save Data)
    saveDataGstr1Supeco(gstr1Obj) {
        return axios.post(API_URL_GSTR1 + '/api/gstr1/insert-update-gstr1-supeco', gstr1Obj)
    }

    //**  supeco Section (Delete Data)
    deleteDataGstr1Supeco(gstr1Obj) {
        return axios.post(API_URL_GSTR1 + '/api/gstr1/delete-gstr1-Supeco-id', gstr1Obj)
    }

    multiDelete(payload){
        return axios.post(API_URL_GSTR1 + "/api/gstr1/multiple-delete-gstr1" , payload)
    }


    gstr1PaginationSummary(payLoad) {
        return axios.post(API_URL_GSTR1 + '/api/gstr1/get-gstr1-pagination-summary', payLoad)
    }
}

export default new GSTR1PurchaseInvoiceService();
