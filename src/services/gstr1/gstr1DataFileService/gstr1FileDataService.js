import axios from 'axios'
import { API_GSTR1_FILED, API_URL_GSTR1 } from '../../../configs/config'

import LocalFunction from '../../../configs/getLocalFunction';
import SessionFunction from '../../../configs/getSessionFunction';
import { globleVariable } from '../../../configs/globalVariable'
import { convertIntoURL } from '../../utils';


const subId = localStorage.getItem(globleVariable.subscriptionId) && LocalFunction.getLocalValue(globleVariable.subscriptionId, true);
const userIds = LocalFunction.getLocalValue(globleVariable.userId, true);


class GSTR1FiledDataService {

    // GSTR1 Filed APIS/gstr1-filed/

    //** get exemp 
    getExemptFileData(UserClientId, FinancialYearId, FinMonth) {
        return axios.get(API_URL_GSTR1 + '/api/gstr1-filed/get-gstr1-exemp-filed-data?FkUserClientId=' + UserClientId + '&FromRange=' + FinancialYearId + '&ToRange=' + FinMonth)
    }

    //** get Adavance summary data */
    getGSTR1FiledAdvanceSummary(UserClientId, FinancialYearId, FinMonth, GSTIN, SectionId) {
        return axios.get(API_URL_GSTR1 + '/api/gstr1-filed/advance-summary?FkUserClientId=' + UserClientId + '&FromRange=' + FinancialYearId + '&ToRange=' + FinMonth + '&SectionId=' + SectionId + '&GSTIN=' + GSTIN)
    }

    getGSTR1FiledPagination(payload) {
        return axios.post(API_GSTR1_FILED + '/api/gstr1filed/get-gstr1-filed-pagination', payload)
    }

    getGSTR1FileDataHSNPagination(payload) {
        return axios.post(API_URL_GSTR1 + '/api/gstr1-filed/get-gstr1-filed-hsn-pagination', payload)
    }
    getGstr1SaleB2caSummary(payload) {        
        return axios.post(API_URL_GSTR1 + '/api/gstr1-filed/get-filed-b2ca-summary', payload)
    }

    //** get Adavance summary data */
    getAdvancePagination(payload) {
        return axios.post(API_URL_GSTR1 + '/api/gstr1-filed/get-gstr1-filed-advance-pagination', payload)
    }

    GSTR1FiledInvoiceDelete(purchaseObj) {
        return axios.post(API_URL_GSTR1 + '/api/gstr1-filed/delete-filed', purchaseObj)
    }

    hsnGSTR1FileDataInvoiceDelete(gstr1Obj) {
        return axios.post(API_URL_GSTR1 + '/api/gstr1-filed/delete-gstr1-filed-hsn-id', gstr1Obj)
    }

    getGSTR1FiledDoc(gstr1Obj) {
        return axios.post(API_URL_GSTR1 + '/api/gstr1-filed/get-gstr1-filed-docs-pagination', gstr1Obj)
    }

    gstr1DocsDeleted(docsDelete) {
        return axios.post(API_URL_GSTR1 + '/api/gstr1-filed/delete-gstr1-filed-docs-id', docsDelete)
    }

    //**gstr1 delete
    gstr1delete(payload) {
        return axios.post(API_URL_GSTR1 + '/api/gstr1-filed/delete-gstr1-filed', payload);
    }


    //**gstr1 filed export data 
    // exportGSTR1FiledExportData(UserClientId, FinancialYearId, Month, fromDate, toDate, token) {
         
    //     console.log({
    //         UserClientId, FinancialYearId, Month, fromDate, toDate
    //     })

    //     return fetch(API_URL_GSTR1 + '/api/gstr1-filed/export?UserClientId=' + UserClientId + '&FromRange=' + FinancialYearId + '&ToRange=' + Month + '&DocumnetFromDate=' + fromDate + '&DocumentToDate=' + toDate  + "&GSTR1SectionId=0"  + "&t="+token, {

    //         method: 'get',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Authorization': `Bearer ${token}`,
    //         },
    //         responseType: 'arraybuffer'

    //     })       
    // }
    exportGSTR1FiledExportData(UserClientId, FinancialYearId, Month, fromDate, toDate, subscriptionId, userId, token) {
        console.log({
            UserClientId, FinancialYearId, Month, fromDate, toDate
        })
        return axios.get(API_GSTR1_FILED + '/api/gstr1filed/export?UserClientId='+ UserClientId +'&FromRange='+ FinancialYearId +'&ToRange='+ Month +'&DocumnetFromDate='+ fromDate +'&DocumentToDate='+ toDate  +'&GSTR1SectionId=0&subscriptionId='+ subscriptionId +'&userId=' + userId +'&t='+token, {        
                               headers: {
                                 'Content-Type': 'application/json'
                             }
                               })       
    }

    // exportGSTR1FiledExportDataSection(UserClientId, FinancialYearId, Month, sectionId,token) {
         
    //     return fetch(API_URL_GSTR1 + '/api/gstr1-filed/export?UserClientId=' + UserClientId + '&FromRange=' + FinancialYearId + '&ToRange=' + Month +  "&GSTR1SectionId="  +sectionId+ "&t="+token, {

    //         method: 'get',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Authorization': `Bearer ${token}`,
    //         },
    //         responseType: 'arraybuffer'

    //     })       
    // }
    exportGSTR1FiledExportDataSection(UserClientId, FinancialYearId, Month, sectionId, subscriptionId, userId,token) {
         
        return axios.get(API_GSTR1_FILED + '/api/gstr1filed/export?UserClientId='+ UserClientId +'&FromRange='+ FinancialYearId +'&ToRange=' + Month +'&DocumnetFromDate=&DocumentToDate=&GSTR1SectionId='+sectionId+'&subscriptionId='+ subscriptionId +'&userId='+ userId +'&t='+token, {
            headers: {
                'Content-Type': 'application/json'
            }
        })       
    }

        // gstr1bFiled panbased api's

        getGstr1bPanSummary(clientId,value) {
            return axios.get(API_URL_GSTR1 + '/api/gstr2b/panbased-gstr2b?UserId=' + clientId+"&SearchByGSTIN="+value)    
        };
    
        backgroundPagination(payload){
            return axios.post(API_URL_GSTR1 + '/api/gstr2b/background-request-pagination',payload)
        }
    
        checkUserProcess(UserId) {       
            return axios.get(API_GSTR1_FILED + '/api/gstr1filed/check-user-process?UserId=' + UserId)
        } 
    
        downloadMultiple(payload) {       
            return axios.post(API_GSTR1_FILED + '/api/gstr1filed/download-multiple-data',payload)
        } 
        // downloadGovtGSTR1Filed(UserClientId, UserId, range) {       
        //     return axios.get(API_URL_GSTR1 + '/api/gstr1-filed/download?UserClientId=' + UserClientId + '&UserId=' + UserId + '&range=' + range )
        // }  
        downloadGovtGSTR1Filed(UserClientId, UserId, range) {       
            return axios.get(API_GSTR1_FILED + '/api/gstr1filed/download?UserClientId=' + UserClientId + '&UserId=' + UserId + '&range=' + range + '&subscriptionId='+ subId )
        }
        downloadGovtGSTR1FiledwihtoutOTP(UserClientId, UserId, range) {       
            return axios.get(API_GSTR1_FILED + '/api/gstr1filed/download-without-otp?UserClientId=' + UserClientId + '&UserId=' + UserId + '&range=' + range + '&subscriptionId='+ subId )
        }

        // ** get Data For Without OTP
        getClientDataOnWithoutOtp(FKUserClientId){
            return axios.get(API_GSTR1_FILED + '/api/client/get-client-details-by-userclient-id?FKUserClientId=' + FKUserClientId)
        }

        // ** update Data For Without OTP
        updateClientDataOnWithoutOtp(FKUserClientId,UserName,Password){
            return axios.post(`${API_GSTR1_FILED}/api/client/update-username-password?${convertIntoURL({FKUserClientId,UserName,Password})}`)
        }  
    }

export default new GSTR1FiledDataService();
    