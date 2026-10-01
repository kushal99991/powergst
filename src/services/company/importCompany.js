import axios from 'axios'
import { API_URL } from '../../configs/config';


class importCompany {

    // ** import-client-details
    ImportCompany(data) {
        return axios.post(API_URL + '/api/client/import-client-details', data)
    }

    // **  upload client master
    uploadCompany(UploadData, userId) {
        return axios.post(API_URL + '/api/client/upload-company-excel?UserId=' + userId, UploadData)
    }

    // ** Bulk Update 
    bulkupdateCompany(UploadData,userId,subscriptionId) {
        // debugger
        // return
        return axios.post(API_URL + '/api/client/bulk-update-password?userid='+ userId +'&subscriptionid=' + subscriptionId,UploadData)
    }

    // ** templete excel download 
    templeteDownload() {
        return axios.get(API_URL + '/api/client/download-company-sample-excel',
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                responseType: 'arraybuffer' // text, pdf, csv file etc
            })
    }

}

export default new importCompany();