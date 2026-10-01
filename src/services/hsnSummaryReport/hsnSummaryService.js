import axios from 'axios'
import { API_URL } from '../../configs/config';


class hsnSummaryServices {

    //** Export SalesHsnSummary Data
    exporHsnReportData(UserClientId,UserId,FromRange,ToRange,subscriptionId,gstNumber,Type,token) {
        return  axios.get(API_URL + '/api/gstr1/export-hsn-summary-report?UserClientId=' + UserClientId + '&UserId='+UserId +'&FromRange=' + FromRange + '&ToRange=' +  ToRange + '&subscriptionId='+ subscriptionId + '&gstNumber=' + gstNumber +'&type=' + Type + "&t="+ token,{
             headers: {
                 'Content-Type': 'application/json',
             }, 
         })
             
         }

     //** Export gstr1HsnSummary Data
    exportgstr1HsnReportData(UserClientId,UserId,FromRange,ToRange,subscriptionId,gstNumber,Type,token) {
        return  axios.get(API_URL + '/api/gstr1filed/export-hsn-summary-report-filed?UserClientId=' + UserClientId + '&UserId='+UserId +'&FromRange=' + FromRange + '&ToRange=' +  ToRange + '&subscriptionId='+ subscriptionId + '&gstNumber=' + gstNumber +'&type=' + Type + "&t="+ token,{
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

   //** Export Purchase RateSummary Data
    exportPurchaseRateReportData(UserClientId,UserId,FromRange,ToRange,subscriptionId,gstNumber,token) {
        return  axios.get(API_URL + '/api/purchase/export-purchase-ratewise-summary-report?UserClientId=' + UserClientId + '&UserId='+UserId +'&FromRange=' + FromRange + '&ToRange=' +  ToRange + '&subscriptionId='+ subscriptionId + '&gstNumber=' + gstNumber + "&t="+ token,{
             headers: {
                 'Content-Type': 'application/json',
             }, 
         })
             
         }


          //** Export GSTR1FiledRateSummary Data
    exportgstr1filedRateReportData(UserClientId,UserId,FromRange,ToRange,subscriptionId,gstNumber,token) {
        return  axios.get(API_URL + '/api/gstr1filed/export-gstr1-ratewise-report?UserClientId=' + UserClientId + '&UserId='+UserId +'&FromRange=' + FromRange + '&ToRange=' +  ToRange + '&subscriptionId='+ subscriptionId + '&gstNumber=' + gstNumber + "&t="+ token,{
             headers: {
                 'Content-Type': 'application/json',
             }, 
         })
             
         }
   
}

export default new hsnSummaryServices();
