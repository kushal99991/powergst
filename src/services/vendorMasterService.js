import axios from 'axios'
import { API_URL } from '../configs/config';


class vendorMasterService {
    
    // ** vendor list
    getVendorList(payLoad) {
        return axios.post(API_URL + '/api/vendors/vendor-list-by-userclientid-gstin', payLoad )
    }

    // Save Vendor 
     VendorListSave(payLoad) {
        return axios.post(API_URL + '/api/vendors/add-update-vendor', payLoad )
    }


}

export default new vendorMasterService();