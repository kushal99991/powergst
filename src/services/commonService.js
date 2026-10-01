import axios from 'axios'
import { API_URL } from '../configs/config';

class commonService {

    // delete-data
    deleteReportData(payload) {
        return axios.post(API_URL + '/api/gstr2b/delete-report-data', payload)
    }
}

export default new commonService();
