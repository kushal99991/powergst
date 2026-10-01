import axios from 'axios'
import { API_URL } from '../../../configs/config';


class GSTR1DownloadService {
    
     //**  gstr1-save-to-government
     gstr1SaveGovt(payLoad) {
        return axios.post(API_URL + '/api/gstr1/gstr1-save-to-government', payLoad )
    }

// ** gstr1 Without OTP updoad data to goverment(gstr1-save-to-government)
    gstr1SaveGovtWithoutOtp(payLoad) {
      return axios.post(API_URL + '/api/gstr1/gstr1-save-to-goverment-without-otp', payLoad )
  }

    // ** proceed-to-file-gstr1-government
    proceedFileGstr1Govt(payLoad) {
        return axios.post(API_URL + '/api/gstr1/proceed-to-file-gstr1-government', payLoad )
    }

    // ** get-gstr1-summary-government
      getGstr1SummaryGovt(payLoad) {
        return axios.post(API_URL + '/api/gstr1/get-gstr1-summary-government', payLoad )
    }

      // ** generate-evc-otp-government
      generateEvcOtpGovt(payLoad) {
        return axios.post(API_URL + '/api/gstr1/generate-evc-otp-government', payLoad )
    }

     // ** file-gstr1-government
     fileGstr1Govt(payLoad) {
        return axios.post(API_URL + '/api/gstr1/file-gstr1-government', payLoad )
    }

    // ** Json error log
    gstr1GovtReturnLogStatus(payLoad) {
      return axios.post(API_URL + '/api/gstr1/gstr1-government-return-log-status', payLoad )
  }

 // ** return error log
  gstr1GovtReturnErrorLogStatus(payLoad) {
    return axios.get(API_URL + '/api/gstr1/gstr1-government-return-error-log-status?logId='+ payLoad )
}

  // **  check user returnFileStatus
checkFiledUserStatus(payload){
  return axios.post(API_URL + '/api/gstr1/get-return-file-status',payload)
}
 
gstr1SaveToGovtSummary(payLoad) {
  return axios.post(API_URL + '/api/gstr1/gstr1-save-to-goverment-summary', payLoad )
}

checkRecoAPI(clientIds,userIds,returnDate,GSTIN) {
  return axios.get(API_URL + '/api/recogstr1vseinvoice/check-reconciliation-data-exist?UserClientId='+clientIds +"&UserId=" + userIds+ "&gstNumber=" + GSTIN +"&FromRange=" +returnDate+"&ToRange="+returnDate)
}
checkIRNExistAPI(clientId,subId,GGSTIN,returnDate) {
  return axios.get(API_URL + '/api/gstr1filed/check-irn-exists?UserClientId='+clientId +"&SubscriptionId=" + subId+ "&gstNumber=" + GGSTIN +"&Range=" +returnDate)
  // return axios.get(API_URL + '/api/gstr1filed/check-irn-exists')
}


}

export default new GSTR1DownloadService();