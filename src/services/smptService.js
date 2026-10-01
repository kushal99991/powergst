import axios from 'axios'
import { API_URL } from '../configs/config';

class smptService {

    // ** Get SMTP Setting by UserClientId
    getSmtpSetting(UserClientId) {
        return axios.get(API_URL + '/api/smtp-setting?UserId=' + UserClientId)
    }


    //** Add new SMTP Setting data
    addSmtpSetting(UserData) {
        return axios.post(API_URL + '/api/smtp-setting/add-smtp-setting-data', UserData)
    }

    //** Get SMTP Setting by SmtpId
    getSmtpSettingBySmtpId(smtpId) {
        return axios.get(API_URL + '/api/smtp-setting/get-smtp-setting-by-smtpid?SmtpId=' + smtpId)
    }

     //** Update new SMTP Setting data
     updateSmtpSetting(UserData) {
        return axios.post(API_URL + '/api/smtp-setting/update', UserData)
    }

     //** Delete new SMTP Setting data
     deleteSmtpSetting(smtpId, userId) {
        return axios.post(API_URL + '/api/smtp-setting/delete?SMTPId='+ smtpId +'&DeletedBy='+ userId+'')
    }

    //vendor master apis

    getVendor(payload) {
        return axios.post(API_URL + '/api/vendors/vendor-list-by-userclientid-gstin',payload)
    }

    addEditVendor(payload) {
        return axios.post(API_URL + '/api/vendors/add-update-vendor',payload)
    }

    deleteVendor(payLoad) {
        return axios.post(API_URL + '/api/vendors/delete-vendor',payLoad)
    }

    // ** vandormaster import - GOVT file
    importVendorMasterListFile(UploadData, UserClientId, UserId) {
        // console.log(UploadData)
        return axios.post(API_URL + '/api/vendors/import-excel?UserClientId=' + UserClientId + '&UserId=' + UserId , UploadData)
    }


}

export default new smptService();