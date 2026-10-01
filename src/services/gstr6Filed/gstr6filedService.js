import axios from 'axios'
import { API_GSTR3B, API_URL_GSTR6 } from '../../configs/config'

class GSTR6FiledService {

    getGSTR6FiledSupplies(UserClientId, FromRange, ToRange, Supplytype) {
        return axios.get(API_GSTR3B + '/api/gstr3bfiled/get-gstr3bfiled-supplies?UserClientId=' + UserClientId + '&FromRange=' + FromRange + '&ToRange=' + ToRange + '&Type=' + Supplytype)
    }

    getAllGSTR6FileData(UserClientId, FromRange, ToRange) {
        return axios.get(API_GSTR3B + '/api/gstr3bfiled/get-gstr3bfiled?UserClientId=' + UserClientId + '&FromRange=' + FromRange + '&ToRange=' + ToRange + '&GSTNumber=' + null)
    }


    gstr6SaveExportFileDataAPI(UserClientId, FromRange, ToRange, token) {
        return axios.get(API_GSTR3B + '/api/gstr3bfiled/export-filed?UserClientId=' + UserClientId + '&FromRange=' + FromRange + '&ToRange=' + ToRange + "&t=" + token, {

            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            responseType: 'arraybuffer',
            // body: JSON.stringify(data)

        })
    }

    getGstr6PanSummary(clientId, value) {
        return axios.get(API_GSTR3B + '/api/itc0Filed/get-isd-company-list?UserId=' + clientId + "&SearchByGSTIN=" + value)
    };

    backgroundPagination(payload) {
        return axios.post(API_GSTR3B + '/api/gstr2b/background-request-pagination', payload)
    }

    checkUserProcess(UserId) {
        return axios.get(API_GSTR3B + '/api/gstr6filed/check-user-process?UserId=' + UserId)
    }

    downloadMultiple(payload) {
        return axios.post(API_GSTR3B + '/api/gstr6filed/download-multiple-data', payload)
    }

    getOptionsListForCheckbox(payload) {
        return axios.post(API_GSTR3B + '/api/gstr6filed/get-gstr6-filed-pagination')
    }


    // ** Summary and invoice


    getGSTR6Summary(UserClientId, FinancialYear, FinMonth, subId, G_GSTIN) {
        return axios.get(API_URL_GSTR6 + '/api/gstr6filed/get-gstr6-filed-summary?UserClientId=' + UserClientId + '&FromRange=' + FinancialYear + '&ToRange=' + FinMonth + '&SubscriptionId=' + subId + '&gstNumber=' + G_GSTIN)
    }
    gstr6delete(payload) {
        return axios.post(API_URL_GSTR6 + '/api/gstr6/delete-gstr6', payload);
    }

    exportGSTR6Summary(UserClientId, FinancialYearId, Month, token) {
        return fetch(API_URL_GSTR6 + '/api/gstr1/export-summary?UserClientId=' + UserClientId + '&FromRange=' + FinancialYearId + '&ToRange=' + Month +"&t=" + token, {

            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            responseType: 'arraybuffer',
        })
    }
    // exportGSTR6ExportData(UserClientId, FinancialYearId, Month,SectionId, token) {
    //     return fetch(API_URL_GSTR6 + '/api/gstr6/export?UserClientId=' + UserClientId + '&FromRange=' + FinancialYearId + '&ToRange=' + Month + "&GSTR1SectionId="  +SectionId+ "&t="+token, {
    //         method: 'get',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Authorization': `Bearer ${token}`,
    //         },
    //         responseType: 'arraybuffer',

    //     })
    // }

    exportGSTR6ExportData(UserClientId, FinancialYearId, Month, SectionId, token, subId, G_GSTIN, userId) {
        return axios.get(API_URL_GSTR6 + '/api/gstr6filed/export?UserClientId=' + UserClientId + '&FromRange=' + FinancialYearId + '&ToRange=' + Month + "&GSTR1SectionId=" + SectionId + '&subscriptionId=' + subId + '&gstNumber=' + G_GSTIN + '&userId=' + userId +  "&t=" + token, {
            headers: {
                'Content-Type': 'application/json',
            }
        })
    }

    getGSRT6PurchasePagination(payload) {
        return axios.post(API_URL_GSTR6 + '/api/gstr6filed/get-gstr6-filed-pagination', payload)
    }
    gstrPaginationDataDelete(payload) {
        return axios.post(API_URL_GSTR6 + '/api/gstr6filed/delete', payload);
    }

    PurchaseImportExcel(uploadData, UserClientId, UserId, importedDate, IsValidate, PageSize, IsSupplierDebitNote, GSTNumber) {
        return axios.post(API_URL_GSTR6 + '/api/gstr6/import-excel?UserClientId=' + UserClientId + '&UserId=' + UserId + '&importedDate=' + importedDate + '&PageSize=' + PageSize + '&GSTNumber=' + GSTNumber, uploadData)
    }
    PurchasesePaginationData(payload) {
        return axios.post(API_URL_GSTR6 + '/api/gstr6/get-gstr6-error-pagination', payload)
    }

    downloadGovtGSTR6Filed(UserClientId, UserId, range, subId,G_GSTIN) {
        return axios.get(API_URL_GSTR6 + '/api/gstr6filed/download?UserClientId=' + UserClientId + '&UserId=' + UserId + '&returnPeriod=' + range+'&subscriptionId=' + subId + '&gstNumber=' + G_GSTIN)
    }

    downloadGovtGSTR6FiledWithoutOtp(UserClientId, UserId, range, subId,G_GSTIN) {
        return axios.get(API_URL_GSTR6 + '/api/gstr6filed/download-without-otp?UserClientId=' + UserClientId + '&UserId=' + UserId + '&returnPeriod=' + range+'&subscriptionId=' + subId + '&gstNumber=' + G_GSTIN)
    }


}
export default new GSTR6FiledService();
