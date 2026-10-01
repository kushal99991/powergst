import axios from 'axios'
import { API_URL_GSTR9 } from '../../configs/config'
import { convertIntoURL } from '../utils'

class GSTR9Service {

    //  Delete All Tab Data Api
    gstr9AllTabDelete(UserClientId, FinancialYearId, UserId, payLoad) {
        return axios.post(`${API_URL_GSTR9}/api/gstr9/delete-gstr9-all-section?${convertIntoURL({ UserClientId, FinancialYearId, UserId })}`, payLoad)
    }
   
     // Export Data Of GSTR9
     gstr9ExportData(UserClientId,FinancialYearId,Userid,gstnumber){
        return axios.get(`${API_URL_GSTR9}/api/gstr9/export?${convertIntoURL({UserClientId,FinancialYearId,Userid,gstnumber})}`)
     }

    // For Tab-2 Api Services
    gstr9Tab2FetchAllData(FKUserClientId, financialYearId, gstNumber, userId, subscriptionId) {

        return axios.get(API_URL_GSTR9 + '/api/gstr9/get-tab1-data?UserClientId=' + FKUserClientId + '&financialYearId=' + financialYearId + '&gstNumber=' + gstNumber + '&userId=' + userId + '&subscriptionId=' + subscriptionId)
    }

    gstr9SaveTab2Data(payLoad) {
        return axios.post(API_URL_GSTR9 + '/api/gstr9/save-Table-4-5-data', payLoad)
    }

    deleteTable4Data(UserClientId, USerId, FinancialYearId) {
        return axios.post(API_URL_GSTR9 + '/api/gstr9/delete-table4?UserClientId=' + UserClientId + '&UserId=' + USerId + '&FinancialYearId=' + FinancialYearId)
    }

    deleteTable5Data(UserClientId, USerId, FinancialYearId) {
        return axios.post(API_URL_GSTR9 + '/api/gstr9/delete-table5?UserClientId=' + UserClientId + '&UserId=' + USerId + '&FinancialYearId=' + FinancialYearId)
    }

    // For Tab-3 Api Service
    gstr9tab3FetchAllData(FKUserClientId, financialYearId, gstNumber, userId, subscriptionId) {

        return axios.get(API_URL_GSTR9 + '/api/gstr9/get-tab2-data?FKUserClientId=' + FKUserClientId + '&financialYearId=' + financialYearId + '&gstNumber=' + gstNumber + '&UserId=' + userId + '&subscriptionId=' + subscriptionId)
    }

    gstr9SaveTab3Data(payLoad) {
        return axios.post(API_URL_GSTR9 + '/api/gstr9/save-tab2-data', payLoad)
    }


    deleteTable6Data(UserClientId, FinancialYearId, USerId) {
        return axios.post(API_URL_GSTR9 + '/api/gstr9/delete-table6?UserClientId=' + UserClientId + '&FinancialYearId=' + FinancialYearId + '&UserId=' + USerId)
    }

    deleteTable7Data(UserClientId, FinancialYearId, USerId) {
        return axios.post(API_URL_GSTR9 + '/api/gstr9/delete-table7?UserClientId=' + UserClientId + '&FinancialYearId=' + FinancialYearId + '&UserId=' + USerId)
    }

    deleteTable8Data(UserClientId, FinancialYearId, USerId) {
        return axios.post(API_URL_GSTR9 + '/api/gstr9/delete-table8?UserClientId=' + UserClientId + '&FinancialYearId=' + FinancialYearId + '&UserId=' + USerId)
    }


    // For Tab-5 Api Service
    gstr9tab5FetchAllData(userId, financialYearId) {

        return axios.get(API_URL_GSTR9 + '/api/gstr9/get-tab4-data?UserClientId=' + userId + '&financialYearId=' + financialYearId)
    }


    gstr9SaveTab5Data(payLoad) {
        return axios.post(API_URL_GSTR9 + '/api/gstr9/save-Table-10-14-data', payLoad)
    }

    deleteTable10Data(UserClientId, USerId, FinancialYearId) {
        return axios.post(API_URL_GSTR9 + '/api/gstr9/delete-table10?UserClientId=' + UserClientId + '&UserId=' + USerId + '&FinancialYearId=' + FinancialYearId)
    }

    deleteTable14Data(UserClientId, USerId, FinancialYearId) {
        return axios.post(API_URL_GSTR9 + '/api/gstr9/delete-table14?UserClientId=' + UserClientId + '&UserId=' + USerId + '&FinancialYearId=' + FinancialYearId)
    }

    // For Tab-6 Api Service
    gstr9tab6FetchAllData(FKUserClientId, financialYearId, gstNumber, userId, subscriptionId) {

        return axios.get(API_URL_GSTR9 + '/api/gstr9/get-tab5-data?FKUserClientId=' + FKUserClientId + '&financialYearId=' + financialYearId + '&gstNumber=' + gstNumber + '&UserId=' + userId + '&subscriptionId=' + subscriptionId)
    }
    //   // For Tab-6 Api Service
    //   gstr9tab6FetchAllData(FKUserClientId, financialYearId, gstNumber, userId, subscriptionId) {

    //     return axios.get(API_URL_GSTR9 + '/api/gstr9/get-tab5-data?FKUserClientId=' + FKUserClientId + '&financialYearId=' + financialYearId + '&gstNumber=' + gstNumber + '&userId=' + userId + '&subscriptionId=' + subscriptionId)
    //   }

    gstr9SaveTab6Data(payLoad) {
        return axios.post(API_URL_GSTR9 + '/api/gstr9/save-tab5-data', payLoad)
    }

    // For Tab-4(Table-9)
    fetchTab3Data(UserClientId, FinancialYearId) {
        return axios.get(
            `${API_URL_GSTR9}/api/gstr9/get-tab3-data?${convertIntoURL({
                UserClientId,
                FinancialYearId,
            })}`
        );
    }

    deleteTable9Data(UserClientId, USerId, FinancialYearId) {
        return axios.post(
            `${API_URL_GSTR9}/api/gstr9/delete-table9?${convertIntoURL({
                UserClientId,
                USerId,
                FinancialYearId,
            })}`
        );
    }

    saveTable9Data(payload) {
        return axios.post(`${API_URL_GSTR9}/api/gstr9/save-tab3-data`, payload);
    }

    deleteTable15Data(UserClientId, FinancialYearId, USerId) {
        return axios.post(API_URL_GSTR9 + '/api/gstr9/delete-table15?UserClientId=' + UserClientId + '&FinancialYearId=' + FinancialYearId + '&UserId=' + USerId)
    }

    deleteTable16Data(UserClientId, FinancialYearId, USerId) {
        return axios.post(API_URL_GSTR9 + '/api/gstr9/delete-table16?UserClientId=' + UserClientId + '&FinancialYearId=' + FinancialYearId + '&UserId=' + USerId)
    }

    deleteTable17Data(UserClientId, FinancialYearId, USerId) {
        return axios.post(API_URL_GSTR9 + '/api/gstr9/delete-table17?UserClientId=' + UserClientId + '&FinancialYearId=' + FinancialYearId + '&UserId=' + USerId)
    }

    deleteTable18Data(UserClientId, FinancialYearId, USerId) {
        return axios.post(API_URL_GSTR9 + '/api/gstr9/delete-table18?UserClientId=' + UserClientId + '&FinancialYearId=' + FinancialYearId + '&UserId=' + USerId)
    }

    deleteTable19Data(UserClientId, FinancialYearId, USerId) {
        return axios.post(API_URL_GSTR9 + '/api/gstr9/delete-table19?UserClientId=' + UserClientId + '&FinancialYearId=' + FinancialYearId + '&UserId=' + USerId)
    }

    gstr9SaveGovt(payLoad) {
        return axios.post(API_URL_GSTR9 + '/api/gstr9/gstr9-save-to-government', payLoad);
    }

    getGstr9SummaryGovt(payLoad) {
        return axios.post(API_URL_GSTR9 + '/api/gstr9/get-gstr9-summary-government', payLoad);
    }

    gstr9GovtReturnErrorLogStatus(payLoad) {
        return axios.get(API_URL_GSTR9 + '/api/gstr9/gstr9-government-return-error-log-status?logId='+ payLoad);
    }

    gstr9GovtReturnLogStatus(payLoad) {
        return axios.post(API_URL_GSTR9 + '/api/gstr9/gstr9-government-return-log-status', payLoad);
    }

    fileGstr9Govt(payLoad) {
        return axios.post(API_URL_GSTR9 + '/api/gstr9/file-gstr9-government', payLoad);
    }

    generateEvcOtpGovt(payLoad) {
        return axios.post(API_URL_GSTR9 + '/api/gstr9/generate-evc-otp-government', payLoad);
    }

  // ** Purchase Import-excel
  PurchaseImportExcel(
    uploadData,
    UserClientId,
    UserId,
    FinancialYearId,
    PageSize,
    GSTNumber
  ) {
    return axios.post(
      `${API_URL_GSTR9}/api/gstr9/import-excel?${convertIntoURL({
        UserClientId,
        UserId,
        FinancialYearId,
        PageSize,
        GSTNumber,
      })}`,
      uploadData
    );
  }
   // **Gstr9 Export Json
   gstr9ExportJson(payLoad) {
    return axios.post(API_URL_GSTR9 + '/api/gstr9/export-gstr9-save-to-gov-json', payLoad)
}

multiDelete(payload){
    return axios.post(API_URL_GSTR9 + "/api/gstr9/multiple-delete-gstr9-all-section" , payload)
}

}

export default new GSTR9Service();