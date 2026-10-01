import axios from 'axios'
import { API_GSTR3B } from '../../configs/config'
import { globleVariable } from "../../configs/globalVariable";
import LocalFunction from '../../configs/getLocalFunction'
import SessionFunction from '../../configs/getSessionFunction';
// import SessionFunction from '../../../../configs/getSessionFunction'


    

class GSTR3bFiledService {

    getGSTR3BFiledSupplies(UserClientId, FromRange,ToRange, Supplytype) {
        return axios.get(API_GSTR3B + '/api/gstr3bfiled/get-gstr3bfiled-supplies?UserClientId=' + UserClientId + '&FromRange=' + FromRange + '&ToRange=' + ToRange + '&Type=' + Supplytype)
    }

    getAllGSTR3FileData(UserClientId,FromRange,ToRange){
        return axios.get(API_GSTR3B + '/api/gstr3bfiled/get-gstr3bfiled?UserClientId=' + UserClientId + '&FromRange=' + FromRange + '&ToRange=' + ToRange + '&GSTNumber=' + null )
    }

    // gstr3bSaveExportFileDataAPI(UserClientId,FromRange,ToRange){
    // // return axios.get(API_GSTR3B + '/api/gstr3bfiled/export?UserClientId=' + UserClientId + '&FromRange=' + FromRange + '&ToRange=' + ToRange + "&t="+localStorage.getItem('accessToken'))
    // return axios.get(API_GSTR3B + '/api/gstr3bfiled/export?UserClientId=' + UserClientId + '&FromRange=' + FromRange + '&ToRange=' + ToRange)
    // }
    // downloadGovtGSTR3bFiled(UserClientId, UserId, range,subId,GGSTIN) {       
    //     return axios.get(API_GSTR3B + '/api/gstr3bfiled/download?UserClientId=' + UserClientId + '&UserId=' + UserId + '&range=' + range + '&=')
    // } 
    downloadGovtGSTR3bFiled(UserClientId, UserId, range,subId,GGSTIN) {       
        return axios.get(API_GSTR3B + '/api/gstr3bfiled/download?UserClientId=' + UserClientId + '&returnPeriod=' + range + '&UserId=' + UserId + '&subscriptionId=' + subId + '&gstNumber=' + GGSTIN  )
    } 
    gstr3bSaveExportFileDataAPI(UserClientId,finYear, finMonth,subId,GGSTIN,userIds,token){
        console.log(sessionStorage.getItem(globleVariable.gstr3BFiledToDt) && SessionFunction.getSessionValue(globleVariable.gstr3BFiledToDt, true),"gstr3BFiledToDt")
        console.log(sessionStorage.getItem(globleVariable.gstr3BFiledFromDt) && SessionFunction.getSessionValue(globleVariable.gstr3BFiledFromDt, true),"gstr3BFiledToDt")
        return axios.get(API_GSTR3B + '/api/gstr3bfiled/export-filed?UserClientId=' + UserClientId + '&FromRange=' + (sessionStorage.getItem(globleVariable.gstr3BFiledFromDt) && SessionFunction.getSessionValue(globleVariable.gstr3BFiledFromDt, true)) + '&ToRange=' + (sessionStorage.getItem(globleVariable.gstr3BFiledToDt) && SessionFunction.getSessionValue(globleVariable.gstr3BFiledToDt, true)) + '&subscriptionId='+ subId + '&gstNumber='+ GGSTIN + '&userId=' +userIds+ "&t="+token, {
    
            headers: {
                'Content-Type': 'application/json'
            }
    
        })  
    }

    // gstr3b panbased api's

    getGst3bPanSummary(clientId,value) {
        return axios.get(API_GSTR3B + '/api/gstr2b/panbased-gstr2b?UserId=' + clientId+"&SearchByGSTIN="+value)    
    };

    backgroundPagination(payload){
        return axios.post(API_GSTR3B + '/api/gstr2b/background-request-pagination',payload)
    }

    checkUserProcess(UserId) {       
        return axios.get(API_GSTR3B + '/api/gstr3bfiled/check-user-process?UserId=' + UserId)
    } 
    // http://192.168.x.x:8087/api/gstr3bfiled/check-user-process?userid=

    downloadMultiple(payload) {       
        return axios.post(API_GSTR3B + '/api/gstr3bfiled/download-multiple-data',payload)
    } 
    
    downloadGovtGSTR3BFiledwihtoutOTP(UserClientId, UserId, range , subId) {       
        return axios.get(API_GSTR3B + '/api/gstr3bfiled/download-without-otp?UserClientId=' + UserClientId + '&UserId=' + UserId + '&range=' + range + '&subscriptionId='+ subId )
    }

}
export default new GSTR3bFiledService();
