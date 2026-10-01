import axios from 'axios'
import { API_URL } from '../configs/config';


class registrationService {
    // ** Registration User
    UserRegistation(data) {
        return axios.post(API_URL + '/api/registration', data)
    }

    UserRegistationAddUser(data) {
        return axios.post(API_URL + '/api/user/add-user', data)
    }

    // ** Verification
    UserRegistationVerification(data) {
        return axios.post(API_URL + '/api/registration/verification', data)
    }

    // ** Send OTP
    UserRegistationReSendOTP(data) {
        return axios.post(API_URL + '/api/registration/resend-otp', data)
    }

    // ** Mobile OTP send
    UserRegistationMobleUpdateOTP(data) {
        // return axios.post(API_URL + '/api/registration/update-mobile-number?id='+ data.id + "&mobile=" + data.mobile + "&email=" + data.email)
        return axios.post(API_URL + '/api/registration/update-mobile-number',data)
    }


    UpdateCategoryIdAndMemberShipNo(data) {
        return axios.post(API_URL + '/api/registration/update-categoryid-membership-number?id='+ data.id + "&memberShipNumber=" + data.memberShipNumber + "&CategoryId=" + data.CategoryId )
    }

    GetCategoryMaster() {
        return axios.get(API_URL + '/api/registration/get-category-master')
    }


}

export default new registrationService();