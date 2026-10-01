import axios from 'axios'
import { API_URL } from '../../configs/config';

class IFFDownloadService {
    
     //**  gstr1-save-to-government
     iFFSaveGovt(payLoad) {
        return axios.post(API_URL + '/api/iff/iff-save-to-government', payLoad)
    }

    // ** proceed-to-file-gstr1-government
    proceedFileIFFGovt(payLoad) {
        return axios.post(API_URL + '/api/iff/proceed-to-file-iff-government', payLoad)
    }

    // ** get-gstr1-summary-government
      getIFFSummaryGovt(payLoad) {
        return axios.post(API_URL + '/api/iff/get-iff-summary-government', payLoad)
    }

      // ** generate-evc-otp-government
      generateEvcOtpGovt(payLoad) {
        return axios.post(API_URL + '/api/iff/generate-evc-otp-government', payLoad)
    }

     // ** file-gstr1-government
     fileIFFGovt(payLoad) {
        return axios.post(API_URL + '/api/iff/file-iff-government', payLoad )
    }

    // ** Json error log
    iFFGovtReturnLogStatus(payLoad) {
      return axios.post(API_URL + '/api/iff/iff-government-return-log-status', payLoad )
  }

 // ** return error log
  iFFGovtReturnErrorLogStatus(payLoad) {
    return axios.get(API_URL + '/api/iff/iff-government-return-error-log-status?logId='+ payLoad)
}
iffSaveToGovtSummary(payLoad) {
  return axios.post(API_URL + '/api/iff/iff-save-to-goverment-summary', payLoad )
}
   // **  check user returnFileStatus
  // checkFiledUserStatus(payload){
  //   return axios.post(API_URL + '/api/iff/get-return-file-status',payload)
  // }

}

export default new IFFDownloadService();