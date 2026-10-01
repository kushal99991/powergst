import axios from "axios"
import { API_URL_Ledger_Services } from '../../configs/config'

class CreditLedgerService {
    
    getCreditLedger(UserClientId, subscriptionId, gstNumber){
        return axios.get(API_URL_Ledger_Services +'/api/ledger/get-credit-ledger?UserClientId=' + UserClientId + '&SubscriptionId=' + subscriptionId + '&GSTNumber=' + gstNumber)
    }

    downLoadCreditLedger(UserClientId,UserId,FromRange,ToRange, subscriptionId, gstNumber) {       
        return axios.get(API_URL_Ledger_Services + '/api/ledger/download-credit-ledger?UserClientId=' + UserClientId + '&UserId='+  UserId + '&FromRange=' + FromRange + '&ToRange=' + ToRange + '&SubscriptionId=' + subscriptionId + '&GSTNumber=' + gstNumber)
    } 
    downLoadCreditLedgerWithoutOtp(UserClientId,UserId,FromRange,ToRange, subscriptionId, gstNumber) {       
        return axios.get(API_URL_Ledger_Services + '/api/LedgerWithOutOTP/download-credit-ledger-without-otp?UserClientId=' + UserClientId + '&UserId='+  UserId + '&FromRange=' + FromRange + '&ToRange=' + ToRange + '&subscriptionId=' + subscriptionId + '&gstNumber=' + gstNumber)
    } 

    creditLedgerExportExcelData(UserClientId,UserId,FromRange,ToRange, subscriptionId, gstNumber,token){
        return axios.get(API_URL_Ledger_Services + '/api/ledger/export-credit-ledger?FKUserClientId=' + UserClientId + '&UserId=' + UserId + '&FromRange=' + FromRange + '&ToRange=' + ToRange + '&SubscriptionId=' + subscriptionId + '&GSTNumber=' + gstNumber + "&t="+token, {
    
            headers: {
                'Content-Type': 'application/json'
            } 
        })  
    }
    // creditLedgerExportExcelData(UserClientId,UserId,token){
    //     return axios.get(API_URL_Ledger_Services + '/api/ledger/export-credit-ledger?FKUserClientId=' + UserClientId + '&UserId=' + UserId + "&t="+token, {
    
    //         method: 'get',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Authorization': `Bearer ${token}`,
    //         },
    //         responseType: 'arraybuffer',
    //         // body: JSON.stringify(data)
    
    //     })  
    // }

    
}

export default new CreditLedgerService();
