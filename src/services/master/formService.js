import axios from 'axios'
import { API_URL } from '../../configs/config';


class formService {

    //** Get form Data
    getForm() {
        return axios.get(API_URL + '/api/form')
    }

    // Save form data
    saveForm(form) {
        return axios.post(API_URL + '/api/form', form)
    }

    // Delete form data
    deleteForm(formid, formDeletedBy) {
        return axios.delete(API_URL + '/api/form?FormId=' + formid + '&DeletedBy=' + formDeletedBy)
    }

    //Get edit form data
    editForm(formId) {
        return axios.get(API_URL + '/api/form?FormId=' + formId)
    }

    //Update form data
    updateForm(form) {
        return axios.put(API_URL + '/api/form', form)
    }

}

export default new formService();
