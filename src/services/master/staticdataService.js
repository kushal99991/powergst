import axios from 'axios'
import { API_URL } from '../../configs/config';


class StatciDataService {

    //** Get state Data
    getStateName() {
        return axios.get(API_URL + '/api/master/get-state')
    }
}

export default new StatciDataService();