import axios from 'axios'
import { API_URL_GSTR6 } from '../../configs/config';
import { globleVariable } from "../../configs/globalVariable";
import LocalFunction from '../../configs/getLocalFunction'


const token = LocalFunction.getLocalValue(globleVariable.tokenKey, true)


class IffFiledDownloadServices {

    checkUserProcess(UserId) {
        return axios.get(API_URL_GSTR6 + '/api/ifffiled/check-user-process?UserId=' + UserId)
    }
    downloadMultiple(payload) {
        return axios.post(API_URL_GSTR6 + '/api/ifffiled/download-multiple-data', payload)
    }
    backgroundPagination(payload) {
        return axios.post(API_URL_GSTR6 + '/api/gstr2b/background-request-pagination', payload)
    }
    downloadGovtIFFFiled(UserClientId, UserId, range, SubscriptionId, gstNumber) {
        return axios.get(API_URL_GSTR6 + '/api/ifffiled/download?UserClientId=' + UserClientId + '&UserId=' + UserId + '&range=' + range + '&SubscriptionId=' + SubscriptionId + '&gstNumber=' + gstNumber)
    }
    downloadGovtIFFFiledWithOutOtp(UserClientId, UserId, range, SubscriptionId, gstNumber) {
        return
        return axios.get(API_URL_GSTR6 + '/api/ifffiled/download?UserClientId=' + UserClientId + '&UserId=' + UserId + '&range=' + range + '&SubscriptionId=' + SubscriptionId + '&gstNumber=' + gstNumber)
    }
    
    exportIFFExportData(UserClientId, FinancialYearId, Month, SectionId, token, subscriptionId, gstNumber, userId) {
        return axios.get(API_URL_GSTR6 + '/api/ifffiled/export?UserClientId=' + UserClientId + '&FromRange=' + FinancialYearId + '&ToRange=' + Month + "&IFFSectionId=" + SectionId + "&subscriptionId=" + subscriptionId + "&gstNumber=" + gstNumber + "&userId=" + userId + "&t=" + token, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }
    iffFiledPagination() {
        return axios.post(API_URL_GSTR6 + '/api/ifffiled/get-iff-filed-pagination')
    }

}

export default new IffFiledDownloadServices();
