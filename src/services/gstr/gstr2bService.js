import axios from 'axios'
import { API_URL, API_URL_GSTR, API_URL_RECO } from '../../configs/config';

import { globleVariable } from "../../configs/globalVariable";
import LocalFunction from '../../configs/getLocalFunction'
import SessionFunction from '../../configs/getSessionFunction'

const token = LocalFunction.getLocalValue(globleVariable.tokenKey, true)

class gstr2bService {

    //** get-gstr2b-summary
    getGstr2bSummary(clientId, fromRange, toRange) {
        return axios.get(API_URL_GSTR + '/api/gstr2b/get-gstr2b-summary?UserClientId=' + clientId + '&FromRange=' + fromRange + '&ToRange=' + toRange)
    }

    //** gstr export
    // exportGstr2b(UserClientId, returnPeriod ) {
    //     return axios.get(API_URL_GSTR + '/api/gstr2b/export?UserClientId=' + UserClientId + '&returnPeriod=' + returnPeriod, {
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         responseType: 'arraybuffer' // text, pdf, csv file etc
    //         // responseType: 'arraybuffer' // zip file
    //     })
    // }

    getGstr2bDataById(clientId, flag, IsITCAvailable, finYear, finMonth) {
        return axios.get(API_URL_GSTR + '/api/gstr2b/get-gstr2b-data?UserClientId=' + clientId + '&Flag=' + flag + '&IsITCAvailable=' + IsITCAvailable + '&FinancialYearId=' + finYear + '&Month=' + finMonth)
    }

    //** gstr export summary

    // exportGstr2bSummary(UserClientId, FinancialYearId, Month) {
    //     console.log('export file')
    //     return fetch(API_URL_GSTR + '/api/gstr2b/export-summary?UserClientId=' + UserClientId + '&FromRange=' + FinancialYearId + '&ToRange=' + Month+"&t="+token, {
    //         method: 'get',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Authorization': `Bearer ${token}`,
    //         },
    //         responseType: 'arraybuffer',
    //     })
    // }
    exportGstr2bSummary(UserClientId, FinancialYearId, Month) {
        console.log('export file')
        return axios.get(API_URL_GSTR + '/api/gstr2b/export-summary?UserClientId=' + UserClientId + '&FromRange=' + FinancialYearId + '&ToRange=' + Month + '&t=' + token, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }


    // ** gstr export Data

    // exportGstr2bExportData(UserClientId, FinancialYearId, Month) {
    //     console.log('export all data')
    //     return fetch(API_URL_GSTR + '/api/gstr2b/export?UserClientId=' + UserClientId + '&FromRange=' + FinancialYearId + '&ToRange=' + Month + "&GSTR2BSectionId=0"+"&t="+token, {

    //         method: 'get',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Authorization': `Bearer ${token}`,
    //         },
    //         responseType: 'arraybuffer',
    //         // body: JSON.stringify(data)

    //     })       
    // }
    // services code:
    exportGstr2bExportData(UserClientId, FinancialYearId, Month, subscriptionId, gstNumber, userId) {
        console.log('export all data')
        return axios.get(API_URL_GSTR + '/api/gstr2b/export?UserClientId=' + UserClientId + '&FromRange=' + FinancialYearId + '&ToRange=' + Month + "&GSTR2BSectionId=0" + "&subscriptionId=" + subscriptionId + "&gstNumber=" + gstNumber + "&userId=" + userId + '&t=' + token, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    //GSTR2B Export Section Wise Excel
    // exportGstr2bExportSectionWiseData(UserClientId, FinancialYearId, Month, SectionId) {
    //     console.log('export all data')
    //     return fetch(API_URL_GSTR + '/api/gstr2b/export?UserClientId=' + UserClientId + '&FromRange=' + FinancialYearId + '&ToRange=' + Month + "&GSTR2BSectionId=" + SectionId+"&t="+token, {

    //         method: 'get',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         responseType: 'arraybuffer' // text, pdf, csv file etc
    //     })
    // }
    exportGstr2bExportSectionWiseData(UserClientId, FinancialYearId, Month, SectionId, subscriptionId, gstNumber, userId) {
        console.log('export all data')
        return axios.get(API_URL_GSTR + '/api/gstr2b/export?UserClientId=' + UserClientId + '&FromRange=' + FinancialYearId + '&ToRange=' + Month + "&GSTR2BSectionId=" + SectionId + "&subscriptionId=" + subscriptionId + "&gstNumber=" + gstNumber + "&userId=" + userId + "&t=" + token, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    // Purchase summary
    // exportPurchaseSummary(UserClientId, FinancialYearId, Month) {
    //     // console.log('export purchase summary')
    //     return fetch(API_URL_RECO + '/api/purchase/export-summary?UserClientId=' + UserClientId + '&FromRange=' + FinancialYearId + '&ToRange=' + Month +"&t="+token, {

    //         method: 'get',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Authorization': `Bearer ${token}`,
    //         },
    //         responseType: 'arraybuffer',
    //         // body: JSON.stringify(data)

    //     }) 
    // }
    exportPurchaseSummary(UserClientId, FinancialYearId, Month,subId,G_GSTIN) {
        // console.log('export purchase summary')
        return axios.get(API_URL_RECO + '/api/purchase/export-summary?UserClientId=' + UserClientId + '&FromRange=' + FinancialYearId + '&ToRange=' + Month + '&SubscriptionId=' + subId + '&gstNumber=' + G_GSTIN +"&t="+token, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    // purchase export data
    exportPurchaseExportData(UserClientId, FinancialYearId, Month,subId,G_GSTIN) {
        return axios.get(API_URL_RECO + '/api/purchase/export-summary-data?UserClientId=' + UserClientId + '&FromRange=' + FinancialYearId + '&ToRange=' + Month + "&PurchaseSectionId=0"+ '&SubscriptionId=' + subId + '&gstNumber=' + G_GSTIN +"&t="+token, {

            headers: {
                'Content-Type': 'application/json'
            }
        })
    }


    //     })       
    // }

    exportPurchaseExportDataSectionWise(UserClientId, FinancialYearId, Month, subId,G_GSTIN,PurchaseSectionId) {
        return axios.get(API_URL_RECO + '/api/purchase/export-summary-data?UserClientId=' + UserClientId + '&FromRange=' + FinancialYearId + '&ToRange=' + Month + "&SubscriptionId="+  subId + "&gstNumber="+  G_GSTIN  + "&PurchaseSectionId="+  PurchaseSectionId + "&t="+token, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        })
    }

    // ** GSTR2B import - GOVT file
    importGSTR2BGovtFile(UploadData, UserClientId, UserId, Month, gstNumber) {
        console.log(UploadData)
        return axios.post(API_URL_GSTR + '/api/gstr2b/import-excel?UserClientId=' + UserClientId + '&UserId=' + UserId + '&importedDate=' + Month + '&gstNumber=' + gstNumber, UploadData)
    }

    //** GSTR2B - Download
    downloadGSTR2BGovtFile(ClientId, UserId, returnPeriod, subscriptionId, gstNumber) {

        return axios.get(API_URL_GSTR + '/api/gstr2b/download?UserClientId=' + ClientId + '&UserId=' + UserId + '&returnPeriod=' + returnPeriod + '&subscriptionId=' + subscriptionId + '&gstNumber=' + gstNumber)
    }

    downloadGSTR2BGovtFileWithoutOtp(ClientId, UserId, returnPeriod, subscriptionId, gstNumber) {

        return axios.get(API_URL_GSTR + '/api/gstr2b-without-otp/download-without-otp?UserClientId=' + ClientId + '&UserId=' + UserId + '&returnPeriod=' + returnPeriod + '&subscriptionId=' + subscriptionId + '&gstNumber=' + gstNumber)
    }

    // ** Paggination  service
    paginationGSTR2bData(data) {
        return axios.post(API_URL_GSTR + '/api/gstr2b/get-gstr2b-pagination-data', data)
    }
}

export default new gstr2bService();
