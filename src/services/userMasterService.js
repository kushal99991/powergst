import axios from 'axios'
import { API_URL } from '../configs/config';
import { convertIntoURL } from './utils';

class userMasterService {

    //** user 
    getUser(userId) {
        return axios.get(API_URL + '/api/user?UserId=' + userId)
    }

    // ** Update User
    updateUser(users) {
        return axios.post(API_URL + '/api/user/update-user', users)
    }

    //** user list
    getUserList(subId, userId ) {
        return axios.get(API_URL + '/api/user/get-user-list?SubscriptionId='+subId + '&UserId=' + userId )
    }

     // ** Delete User
     deleteUser(userId) {
      
        return axios.post(API_URL + '/api/user/delete-user?UserId=' + userId?.userId )
    }

      // ** Purchase Import-excel
  UserImportExcel( 
    uploadData,
    UserId,
    PageSize,
  ) {
    return axios.post(
      `${API_URL}/api/user/import-excel?${convertIntoURL({      
        UserId, 
        PageSize,    
      })}`,
      uploadData,
    );
  }

}

export default new userMasterService();