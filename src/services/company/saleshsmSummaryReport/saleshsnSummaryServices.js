import axios from 'axios'
import { API_URL } from '../../configs/config';


class saleshsnSummaryServices {

    //** Hsn Summary Report
     saleshsnSummaryReport(UserClientId,UserId,FromRange,ToRange,gstNumber,Type) {
   return  axios.get(API_URL + '/api/gstr1/sales-hsn-summary-report?UserClientId=' + UserClientId + '&UserId='+UserId +'&FromRange=' + FromRange + '&ToRange=' +  ToRange + '&gstNumber=' + gstNumber + '&Type=' + Type,{
        headers: {
            'Content-Type': 'application/json',
        },
    })
        
    }

   
}

export default new saleshsnSummaryServices();
