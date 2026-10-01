import axios from 'axios'
import { API_URL } from '../configs/config';

class loginService {

    //** Login
    loginUser(user) {
        return axios.post(API_URL + '/api/login', user)
    }

    //** Forget password
    forgetPassword(user) {
        return axios.post(API_URL + '/api/user/forgot-password', user)
    }

    //** Change Passwrod
    chagnePassword(user) {
        return axios.post(API_URL + '/api/user/change-password', user)
    }

    // ** email and mobile exist or not
    CheckAccountUser(user) {
        return axios.post(API_URL + '/api/login/check-user-email-mobile', user)
    }

    //**  check mail validate token
    resetPasswordValidateToken(data) {
        return axios.post(API_URL + '/api/user/validate-token', data)
    }

    logout(data) {
        return axios.get(API_URL + '/api/login/log-out?UserId='+ data.userId + '&TokenValue='+ data.token )
    }
}

export default new loginService();
