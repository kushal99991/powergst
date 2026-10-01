import axios from 'axios'
import { API_URL } from '../../configs/config';


class actionService {

    //** Get Action Data
    getAction() {
        return axios.get(API_URL + '/api/permission-event')
    }

    // Save Action data
    saveAction(action) {
        return axios.post(API_URL + '/api/permission-event', action)
    }

    // Delete Action data
    deleteAction(actionid, actionDeletedBy) {
        return axios.delete(API_URL + '/api/permission-event?Id=' + actionid + '&DeletedBy=' + actionDeletedBy)
    }

    //Get edit action data
    editAction(actionId) {
        return axios.get(API_URL + '/api/permission-event?Id=' + actionId)
    }

    //Update action data
    updateAction(action) {
        return axios.put(API_URL + '/api/permission-event', action)
    }

}

export default new actionService();
