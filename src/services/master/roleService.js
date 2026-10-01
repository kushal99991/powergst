import axios from 'axios'
import { API_URL } from '../../configs/config';


class roleService {

    //** Get role Data
    getRole() {
        return axios.get(API_URL + '/api/role')
    }

    // Save role data
    saveRole(role) {
        return axios.post(API_URL + '/api/role', role)
    }

    // Delete role data
    deleteRole(roleid, roleDeletedBy) {
        return axios.delete(API_URL + '/api/role?RoleId=' + roleid + '&DeletedBy=' + roleDeletedBy)
    }

    //Get edit role data
    editRole(roleId) {
        return axios.get(API_URL + '/api/role?Id=' + roleId)
    }

    //Update role data
    updateRole(role) {
        return axios.put(API_URL + '/api/role', role)
    }

}

export default new roleService();
