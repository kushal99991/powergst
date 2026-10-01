import axios from "axios"
import { API_URL_Ledger_Services } from '../../configs/config'

class CashLedgerService {


    getCashLedger(UserClientId, subscriptionId, gstNumber){
        return axios.get(API_URL_Ledger_Services +'/api/ledger/get-cash-ledger?UserClientId=' + UserClientId + '&SubscriptionId=' + subscriptionId + '&GSTNumber=' + gstNumber)
    }

    downLoadCashLedger(UserClientId,UserId,FromRange,ToRange, subscriptionId, gstNumber) {       
        return axios.post(API_URL_Ledger_Services + '/api/ledger/download-cash-ledger?UserClientId=' + UserClientId + '&UserId='+  UserId + '&FromRange=' + FromRange + '&ToRange=' + ToRange + '&SubscriptionId=' + subscriptionId + '&GSTNumber=' + gstNumber)
    }
    
    downLoadCashLedgerWithoutOtp(UserClientId,UserId,FromRange,ToRange, subscriptionId, gstNumber) {       
        return axios.get(API_URL_Ledger_Services + '/api/LedgerWithOutOTP/download-cash-ledger-without-otp?UserClientId=' + UserClientId + '&UserId='+  UserId + '&FromRange=' + FromRange + '&ToRange=' + ToRange + '&subscriptionId=' + subscriptionId + '&gstNumber=' + gstNumber)
    }
    
    cashLedgerExportExcelData(UserClientId,UserId,FromRange,ToRange, subscriptionId, gstNumber,token){
        return axios.get(API_URL_Ledger_Services + '/api/ledger/export-cash-ledger?FKUserClientId=' + UserClientId + '&UserId=' + UserId + '&FromRange=' + FromRange + '&ToRange=' + ToRange + '&SubscriptionId=' + subscriptionId + '&GSTNumber=' + gstNumber + "&t="+token, {
            headers: {
                'Content-Type': 'application/json'
            } 
        })  
    }

    // cashLedgerExportExcelData(UserClientId,UserId,token){
    //     return axios.get(API_URL_Ledger_Services + '/api/ledger/export-cash-ledger?FKUserClientId=' + UserClientId + '&UserId=' + UserId + "&t="+token, {
    
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

export default new CashLedgerService();
