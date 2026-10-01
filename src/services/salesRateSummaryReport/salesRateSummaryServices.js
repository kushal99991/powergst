import axios from 'axios'
import { API_URL } from '../../configs/config';


class salesRateSummaryServices {

    //** Rate Summary Report
     salesRateSummaryReport(UserClientId,UserId,FromRange,ToRange,gstNumber,Type , subId ) {
   return  axios.get(API_URL + '/api/gstr1filed/hsn-summary-report?UserClientId=' + UserClientId + '&UserId='+UserId +'&FromRange=' + FromRange + '&ToRange=' +  ToRange + '&gstNumber=' + gstNumber + '&Type=' + Type + '&SubscriptionId=' + subId ,{
        headers: {
            'Content-Type': 'application/json',
        },
    })

    }

    //** Export SalesRateSummary Data
    exportsalesRateReportData(UserClientId,UserId,FromRange,ToRange,subscriptionId,gstNumber,token) {
        return  axios.get(API_URL + '/api/gstr1/export-sales-ratewise-summary-report?UserClientId=' + UserClientId + '&UserId='+UserId +'&FromRange=' + FromRange + '&ToRange=' +  ToRange + '&subscriptionId='+ subscriptionId + '&gstNumber=' + gstNumber + "&t="+ token,{
             headers: {
                 'Content-Type': 'application/json',
             },
         })

         }


}

export default new salesRateSummaryServices();
