import axios from 'axios'
import { API_URL } from '../../configs/config';

class itc04DownloadService {
    
     //**  itc04-save-to-government
     itc04SaveGovt(payLoad) {
        return axios.post(API_URL + '/api/itc04/itc04-save-to-government', payLoad)
    }

    // ** get-itc04-summary-government
      getitc04SummaryGovt(payLoad) {
        return axios.post(API_URL + '/api/itc04/get-itc04-summary-government', payLoad)
    }

      // ** generate-evc-otp-government - itc04
      generateEvcOtpGovt(payLoad) {
        return axios.post(API_URL + '/api/itc04/generate-evc-otp-government', payLoad)
    }

     // ** file-gstr1-government
     fileItc04Govt(payLoad) {
        return axios.post(API_URL + '/api/itc04/file-itc04-government', payLoad )
    }

    // ** Json error log
    itc04GovtReturnLogStatus(payLoad) {
      return axios.post(API_URL + '/api/itc04/itc04-government-return-log-status', payLoad )
  }

}

export default new itc04DownloadService();