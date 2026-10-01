import axios from 'axios'
import { API_URL, API_URL_GSTR } from '../../configs/config';

class AuthenticationService {
    // ** GSTR Send OTP
    gstrSendOTP(UserClientId) {
        return axios.post(API_URL_GSTR + '/api/Authentication/send-otp?UserClientId=' + UserClientId)
    }

    // ** GSTR Verify OTP
    gstrVerifyOTP(otp, UserClientId) {
        return axios.post(API_URL_GSTR + '/api/Authentication/validate-otp?otp=' + otp + '&UserClientId=' + UserClientId)
    }
     //** Get gstr Request otp clientlist
     getClientDetailsByUserId(payLoad) {
        return axios.get(API_URL + '/api/client/get-client-details-by-user-id?UserId=' + payLoad?.UserId  + '&GSTINNumber=' + payLoad?.GSTINNumber) 
    }
}

export default new AuthenticationService();