import axios from 'axios'
import { API_URL } from '../../configs/config';

class GSTR6DownloadService {
    
     //**  gstr1-save-to-government
     gstr6SaveGovt(payLoad) {
        return axios.post(API_URL + '/api/gstr6/gstr6-save-to-government', payLoad)
    }

    // ** proceed-to-file-gstr1-government
    proceedFileGstr6Govt(payLoad) {
        return axios.post(API_URL + '/api/gstr6/proceed-to-file-gstr6-government', payLoad)
    }

    // ** get-gstr1-summary-government
      getGstr6SummaryGovt(payLoad) {
        return axios.post(API_URL + '/api/gstr6/get-gstr6-summary-government', payLoad)
    }

      // ** generate-evc-otp-government
      generateEvcOtpGovt(payLoad) {
        return axios.post(API_URL + '/api/gstr6/generate-evc-otp-government', payLoad)
    }

     // ** file-gstr1-government
     fileGstr6Govt(payLoad) {
        return axios.post(API_URL + '/api/gstr6/file-gstr6-government', payLoad )
    }

    // ** Json error log
    gstr6GovtReturnLogStatus(payLoad) {
      return axios.post(API_URL + '/api/gstr6/gstr6-government-return-log-status', payLoad )
  }

 // ** return error log
  gstr6GovtReturnErrorLogStatus(payLoad) {
    return axios.get(API_URL + '/api/gstr6/gstr6-government-return-error-log-status?logId='+ payLoad)
}

}

export default new GSTR6DownloadService();