import axios from 'axios'
import { API_GSTR3B } from '../../configs/config'
import { convertIntoURL } from '../utils'


class GSTR3bService {

// ** GsTR 3b Import-excel
Gstr3bImportExcel(uploadData, UserClientId, UserId, importedDate, PageSize, GSTNumber) {
    return axios.post(API_GSTR3B + '/api/gstr3b/import-excel?UserClientId=' + UserClientId + '&UserId=' + UserId + '&importedDate=' + importedDate + '&PageSize=' + PageSize + '&GSTNumber=' + GSTNumber, uploadData)
}
   
gstrFetchAllData(UserClientId,FromRange,ToRange,G_GSTIN){
    console.log(typeof(UserClientId),"userClinetID")
   return axios.get(API_GSTR3B + '/api/gstr3b/get-gstr3b?UserClientId=' + UserClientId + '&FromRange=' + FromRange + '&ToRange=' + ToRange + '&GSTNumber=' + G_GSTIN);
}

GSTR3BDelete( UserClientId, selectedYear,selectedYearTo ) {
    return axios.post(API_GSTR3B + '/api/gstr3b/delete-gstr3b?UserClientId=' + UserClientId + '&fromRange=' + selectedYear + '&toRange=' + selectedYearTo );
}
    getGSTR3BSupplies(UserClientId,Range,Supplytype){
    return axios.get(API_GSTR3B+'/api/gstr3b/get-gstr3b-supplies?UserClientId='+UserClientId+'&FromRange='+Range+'&ToRange='+Range+'&Type='+Supplytype)
}

Gstr3bSaveSuppliesData(payload) {
    return axios.post(API_GSTR3B + '/api/gstr3b/insert-gstr3b-supplies', payload)
}

gstr3bSaveDataAPI(payLoad){
    return axios.post(API_GSTR3B + '/api/gstr3b/save-gstr3b-data', payLoad)
}

getAllDataPaymentPage(UserClientId,FromRange,ToRange,GSTNumber){
    return axios.get(API_GSTR3B + '/api/gstr3b/get-gstr3b-payment-of-page?UserClientId=' + UserClientId + '&FromRange=' + FromRange + '&ToRange=' + ToRange + '&GSTNumber=' + GSTNumber);

}


// ** Computation of Tax
// getGSTR3BComputationOfTax(UserClientId,Ranges,UserId){
//     return axios.get(API_GSTR3B + '/api/gstr3b/get-gstr3b-computation-of-tax?UserClientId=' + UserClientId + '&range=' + Ranges + '&UserId=' + UserId);
// }
getGSTR3BComputationOfTax(UserClientId,Ranges,UserId,G_GSTIN,subscriptionId){
    return axios.get(API_GSTR3B + '/api/gstr3b/get-computation-of-tax-data?UserClientId=' + UserClientId + '&FromRange=' + Ranges + '&UserId=' + UserId + '&subscriptionId=' +subscriptionId) ;
}

gstr3bSavePaymentPage(payLoad){
    return axios.post(API_GSTR3B +'/api/gstr3b/insert-gstr3b-payment-of-page',payLoad)
}

//**  insert-gstr3b-computationOfTax
gstr3bSaveComputationTax(payLoad){
    return axios.post(API_GSTR3B +'/api/gstr3b/insert-gstr3b-computationOfTax',payLoad)
}

getGstr3bItcledger(UserClientId, FromRange, ToRange, GSTNumber) {
    return axios.get(API_GSTR3B + '/api/gstr3b/get-gstr3b-itcledger?UserClientId=' + UserClientId + '&FromRange=' + FromRange + '&ToRange=' + ToRange + '&GSTNumber=' + GSTNumber);

}


getGstr3bCashledger(UserClientId, FromRange, ToRange, GSTNumber) {
    return axios.get(API_GSTR3B + '/api/gstr3b/get-gstr3b-cashledger?UserClientId=' + UserClientId + '&FromRange=' + FromRange + '&ToRange=' + ToRange + '&GSTNumber=' + GSTNumber);

}


getGSTR2bDetailsForGSTR3bPage(UserClientId,Range,GSTNumber,subsId){
    return axios.get(API_GSTR3B + '/api/gstr2b/get-gstr2bsummary-for-gstr3b?UserClientId=' + UserClientId + '&Range=' + Range  + '&GSTNumber=' + GSTNumber + '&SubscriptionId=' + subsId);
}


getGSTR2bPurchaseData(UserClientId,Range,GSTNumber){
    return axios.get(API_GSTR3B + '/api/purchase/get-purhase-data-for-gstr3b?UserClientId=' + UserClientId + '&ReturnPeriod=' + Range  + '&GSTNNumber=' + GSTNumber);
}

getReconcillationDataforGSTR3b(UserClientId,Range,subsId,G_GSTIN){
    return axios.get(API_GSTR3B + '/api/reco2vs2b/get-reco-data-for-gstr3b?UserClientId=' + UserClientId + '&SubscriptionId=' + subsId +  '&ReturnPeriod=' + Range  + '&GSTNNumber=' + G_GSTIN);
}


gstr3bSaveExportDataAPI(UserClientId,FromRange,ToRange,token) {
    return axios.get(API_GSTR3B + '/api/gstr3b/export?UserClientId=' + UserClientId + '&FromRange=' + FromRange + '&ToRange=' + ToRange + "&t="+token, {

        headers: {
            'Content-Type': 'application/json'
        }
    })  
}

getLateFeeData(UserClientId,FromRange,ToRange,subscriptionId,UserId){
    return axios.get(API_GSTR3B + '/api/gstr3b/get-interest-data-from-portal?UserClientId=' + UserClientId + '&FromRange=' + FromRange  + '&ToRange=' +ToRange + '&subscriptionId=' +subscriptionId + '&UserId='+UserId);
}

getPopulatedData(UserClientId,FromRange,ToRange,subscriptionId,UserId){
    return axios.get(API_GSTR3B + '/api/gstr3b/get-auto-populated-data?UserClientId=' + UserClientId + '&FromRange=' + FromRange  + '&ToRange=' +ToRange + '&subscriptionId=' +subscriptionId + '&UserId='+UserId);
}

getgstr1FiledDataForGstr3b(G_UCParId, gstr3BToDt, UserId, subscriptionId, G_GSTIN){
    return axios.get(API_GSTR3B + '/api/gstr1filed/Get-data-for-gstr3b?UserClientId=' + G_UCParId + '&Range=' + gstr3BToDt  + '&GstNumber=' +G_GSTIN + '&subscriptionId=' +subscriptionId + '&UserId='+UserId);
}

multiDelete(payload){
    return axios.post(API_GSTR3B + "/api/gstr3b/multiple-delete-gstr3b" , payload)
}


// ** GsTR 3b Export Json
Gstr3bExportJson(payLoad) {
    return axios.post(API_GSTR3B + '/api/gstr3b/export-save-to-gov-json', payLoad)
}
// Reco Export Data
gstr3bExportRecoData(UserClientId,ReturnPeriod,GSTNNumber,SubscriptionId,t){
    return axios.get(`${API_GSTR3B}/api/gstr3b/export-3b-data-from-reco?${convertIntoURL({UserClientId,ReturnPeriod,GSTNNumber,SubscriptionId,t})}`)
}

}


export default new GSTR3bService();
