import axios from 'axios'
import { API_URL } from '../../configs/config';


class GSTR3BDownloadService {
    
     //**  gstr1-save-to-government
     gstr3bSaveGovt(payLoad) {
        return axios.post(API_URL + '/api/gstr3b/gstr3b-save-to-government', payLoad )
    }

     //**  gstr1-save-to-government (without OTP)
     gstr3bSaveGovtWithoutOtp(payLoad) {
      return axios.post(API_URL + '/api/gstr3b/gstr3b-save-to-goverment-without-otp', payLoad )
  }

    // ** proceed-to-file-gstr1-government
    // proceedFileGstr3bGovt(payLoad) {
    //     return axios.post(API_URL + '/api/gstr3b/proceed-to-file-gstr3b-government', payLoad )
    // }

    // ** get-gstr1-summary-government
      getGstr3bSummaryGovt(payLoad) {
        return axios.post(API_URL + '/api/gstr3b/get-gstr3b-summary-government', payLoad )
    }

      // ** generate-evc-otp-government
      generateEvcOtpGovt(payLoad) {
        return axios.post(API_URL + '/api/gstr3b/generate-evc-otp-government', payLoad )
    }

     // ** file-gstr1-government
     fileGstr3bGovt(payLoad) {
        return axios.post(API_URL + '/api/gstr3b/file-gstr3b-government', payLoad )
    }

    // ** Json error log
    gstr3bGovtReturnLogStatus(payLoad) {
      return axios.post(API_URL + '/api/gstr3b/gstr3b-government-return-log-status', payLoad )
  }

 // ** return error log
  gstr3bGovtReturnErrorLogStatus(payLoad) {
    return axios.get(API_URL + '/api/gstr3b/gstr3b-government-return-error-log-status?logId='+ payLoad )
}


}

export default new GSTR3BDownloadService();