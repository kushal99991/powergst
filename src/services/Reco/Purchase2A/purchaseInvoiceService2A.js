import axios from 'axios'
import { API_URL_RECO,SAMPLE_URL_RECO,API_URL_2A } from '../../../configs/config';
//** Decrypt Data
import {globleVariable} from '../../../configs/globalVariable';
import LocalFunction from '../../../configs/getLocalFunction';
const accessToken=LocalFunction.getLocalValue(globleVariable.tokenKey ,true)

class PurchaseInvoiceService2A {

   
    // getPurchaseSummary(UserClientId, FinancialYearId, FinMonth) {
    //     return axios.post(API_URL_2A + '/api/gstr2a/get-summary?UserClientId=' + UserClientId + '&FromRange=' + FinancialYearId + '&ToRange=' + FinMonth)
    // }

   


    // exportPurchaseSummary(UserClientId, FinancialYearId, Month,sectionId,SubscriptionId,GSTNumber) {
    //     return axios.get(API_URL_2A + '/api/gstr2a/export-summary?UserClientId='+ UserClientId + '&FromRange='+ FinancialYearId+'&ToRange='+ Month +'&GSTR2ASectionId='+ sectionId + '&GSTR2ASubscriptionId='+ SubscriptionId + '&gstNumber=' + GSTNumber + "&t=" + accessToken, {
    //         headers: {
    //             'Content-Type': 'application/json'
    //         }
    //     })
    // } 

   

    exportPurchaseExportData(UserClientId, FromRange, ToRange, GSTR2ASectionId,subscriptionId,gstNumber,userId) {
        console.log('export purchase summary')
        return axios.get(API_URL_2A + '/api/gstr2a/export?UserClientId=' + UserClientId + '&FromRange=' + FromRange + '&ToRange=' + ToRange +'&GSTR2ASectionId='+ GSTR2ASectionId + '&subscriptionId=' + subscriptionId + '&gstNumber=' + gstNumber + '&userId=' + userId + '&t='+accessToken, {
            // headers: {
            //     'Content-Type': 'application/json'
            // }
            // method: 'get',
            // headers: {
            //     'Content-Type': 'application/json'
            // },
            // responseType: 'arraybuffer' // text, pdf, csv file etc
        })
    }

    PurchaseImportExcel(uploadData, UserClientId, UserId, FinancialYearId, GSTNumber) {
        return axios.post(API_URL_2A + '/api/gstr2a/import-excel?UserClientId=' + UserClientId + '&UserId=' + UserId + '&importedDate=' + FinancialYearId + '&gstNumber=' + GSTNumber , uploadData)
    }

    downloadGSTR2AGovtFile(ClientId, UserId, returnPeriod,SubscriptionId) {
        return axios.post(API_URL_2A + '/api/gstr2a/download?UserClientId=' + ClientId + '&UserId=' + UserId + '&returnPeriod=' +returnPeriod + '&subscriptionId='+ SubscriptionId)
    }

    downloadGSTR2AGovtFileWithoutOtp(ClientId, UserId, returnPeriod,SubscriptionId) {
        return axios.get(API_URL_2A + '/api/gstr2a/download-without-otp?UserClientId=' + ClientId + '&UserId=' + UserId + '&returnPeriod=' +returnPeriod + '&subscriptionId='+ SubscriptionId)
    }

 //** get-purchase-summary

    getGSTR2APagination(payload){
        return axios.post(API_URL_2A +  '/api/gstr2a/get-gstr2a-pagination-data' , payload  )
    }

  
    getSamplePagination(){
        return axios.post(SAMPLE_URL_RECO +  '/api/reco2vs2b/sample-pagination'  )
    }

 

    // ** Download Error file
    DownloadErrorFile(GUID) {
        return axios.get(API_URL_RECO + '/api/purchase/export-error?GUID=' + GUID,
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                responseType: 'arraybuffer'
            })
    }

    // Purchase pagination data
    PurchasesePaginationData(SheetName, GUID, Status, PageNumber, PageSize, SheetId) {
        return axios.get(API_URL_RECO + '/api/purchase/get-error-pagination-data?SheetName=' + SheetName + '&GUID=' + GUID + '&Status=' + Status + '&PageNumber=' + PageNumber + '&PageSize=' + PageSize + '&SheetId=' + SheetId)
    }

    // Purchase New invoice
    PurchaseNewIncomeCreate(purchaseData) {
        return axios.post(API_URL_RECO + '/api/purchase/insert-update-purchase-data', purchaseData)
    }

    PurchaseFailedValidation(payload) {
        return axios.post(API_URL_RECO + '/api/purchase/validate-failed-data', payload)
    }



    //Purchase Get Id
    PurchaseDataById(purchaseObj) {
        return axios.post(API_URL_RECO + '/api/purchase/get-purchase-data-by-id?PurchaseId=' + purchaseObj.PurchaseId +'&UserClientId=' + purchaseObj.UserClientId + '&FinancialYearId=' + purchaseObj.FinancialYearId + '&Month=' + purchaseObj.Month)
    }


    // static data
    PurchasetblStaticDataMaster() {
        return axios.get(API_URL_RECO + '/api/purchase/get-purchase-master')
    }

    PurchaseInvoiceDelete(purchaseObj) {
        return axios.post(API_URL_RECO + '/api/purchase/delete' , purchaseObj)
    }

}

export default new PurchaseInvoiceService2A();
