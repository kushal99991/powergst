import axios from 'axios'
import { API_URL_ITC04 } from '../../configs/config';


class itc04SummaryServices {

    getITC04Summary(UserClientId, FinancialYearId, FinMonth) {
        return axios.get(API_URL_ITC04 + '/api/itc0Filed/get-itc04-filed-summary?UserClientId=' + UserClientId + '&FromRange=' + FinancialYearId + '&ToRange=' + FinMonth)
    }
    itc04delete(payload) {
        return axios.post(API_URL_ITC04 + '/api/itc04/delete-itc04', payload);
    }
    exportITC04ExportData(UserClientId, FinancialYearId, ITC04SectionId, token, subscriptionId, gstNumber, userId) {

        return axios.get(API_URL_ITC04 + '/api/itc0Filed/export-filed?UserClientId=' + UserClientId + '&range=' + FinancialYearId + "&ITC04SectionId=" + ITC04SectionId + "&subscriptionId=" + subscriptionId + "&gstNumber=" + gstNumber + "&userId=" + userId + "&t=" + token, {
            headers: {
                'Content-Type': 'application/json',
            },

        })
    }

    downloadGovtITC04Filed(UserClientId, UserId, range, SubscriptionId, G_GSTIN) {
        return axios.get(API_URL_ITC04 + '/api/itc0Filed/download?UserClientId=' + UserClientId + '&UserId=' + UserId + '&range=' + range + '&SubscriptionId=' + SubscriptionId + '&gstNumber=' + G_GSTIN)
    }

    downloadGovtITC04FiledWithOutOtp(UserClientId, UserId, range, SubscriptionId, G_GSTIN) {
        return axios.get(API_URL_ITC04 + '/api/itc0Filed/download-without-otp?UserClientId=' + UserClientId + '&UserId=' + UserId + '&range=' + range + '&SubscriptionId=' + SubscriptionId + '&gstNumber=' + G_GSTIN)
    }


    getItc04PanSummary(clientId, value) {
        return axios.get(API_URL_ITC04 + '/api/itc0Filed/get-isd-company-list?UserId=' + clientId + "&SearchByGSTIN=" + value)
    };


    getItc04PanAllCompany(clientId, value) {
        return axios.get(API_URL_ITC04 + '/api/itc0Filed/get-all-company-list?UserId=' + clientId + "&SearchByGSTIN=" + value)
    };


    backgroundPagination(payload) {
        return axios.post(API_URL_ITC04 + '/api/gstr2b/background-request-pagination', payload)
    }

    checkUserProcess(UserId) {
        return axios.get(API_URL_ITC04 + '/api/itc0Filed/check-user-process?UserId=' + UserId)
    }

    downloadMultiple(payload) {
        return axios.post(API_URL_ITC04 + '/api/itc0Filed/download-multiple-data', payload)
    }

    itc04FiledPagination(payload) {
        return axios.post(API_URL_ITC04 + '/api/itc0Filed/get-itc04-filed-pagination', payload)
    }
}

export default new itc04SummaryServices();
