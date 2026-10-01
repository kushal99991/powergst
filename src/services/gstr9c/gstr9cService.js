import axios from "axios";
import { API_URL_GSTR9C } from "../../configs/config";
import { convertIntoURL } from "../utils";

class GSTR9cService {
  // part 1
  getPart1Data(
    UserClientId,
    UserId,
    FinancialYearId,
    gstNumber,
    subscriptionId
  ) {
    return axios.get(
      `${API_URL_GSTR9C}/api/gstr9c/get-pt1-data?${convertIntoURL({
        UserClientId,
        UserId,
        FinancialYearId,
        gstNumber,
        subscriptionId,
      })}`
    );
  }

  saveTable1Data(payload) {
    return axios.post(`${API_URL_GSTR9C}/api/gstr9c/save-pt1-data`, payload);
  }

  // ** Purchase Import-excel
  PurchaseImportExcel(
    uploadData,
    UserClientId,
    UserId,
    FinancialYearId,
    PageSize,
    GSTNumber
  ) {
    return axios.post(
      `${API_URL_GSTR9C}/api/gstr9c/import-excel?${convertIntoURL({
        UserClientId,
        UserId,
        FinancialYearId,
        PageSize,
        GSTNumber,
      })}`,
      uploadData
    );
  }

  deleteTable1Data(UserClientId, UserId, FinancialYearId) {
    return axios.post(
      `${API_URL_GSTR9C}/api/gstr9c/delete-table1?${convertIntoURL({
        UserClientId,
        UserId,
        FinancialYearId,
      })}`
    );
  }

  // part 2
  getPart2Data(
    FKUserClientId,
    UserId,
    FinancialYearId,
    gstNumber,
    subscriptionId
  ) {
    return axios.get(
      `${API_URL_GSTR9C}/api/gstr9c/get-pt2-data?${convertIntoURL({
        FKUserClientId,
        UserId,
        FinancialYearId,
        gstNumber,
        subscriptionId,
      })}`
    );
  }

  savePart2Data(payload) {
    return axios.post(`${API_URL_GSTR9C}/api/gstr9c/save-pt2-data`, payload);
  }

  deleteTable5Data(UserClientId, UserId, FinancialYearId) {
    return axios.post(
      `${API_URL_GSTR9C}/api/gstr9c/delete-table5?${convertIntoURL({
        UserClientId,
        UserId,
        FinancialYearId,
      })}`
    );
  }

  deleteTable6Data(UserClientId, UserId, FinancialYearId) {
    return axios.post(
      `${API_URL_GSTR9C}/api/gstr9c/delete-table6?${convertIntoURL({
        UserClientId,
        UserId,
        FinancialYearId,
      })}`
    );
  }

  deleteTable7Data(UserClientId, UserId, FinancialYearId) {
    return axios.post(
      `${API_URL_GSTR9C}/api/gstr9c/delete-table7?${convertIntoURL({
        UserClientId,
        UserId,
        FinancialYearId,
      })}`
    );
  }

  deleteTable8Data(UserClientId, UserId, FinancialYearId) {
    return axios.post(
      `${API_URL_GSTR9C}/api/gstr9c/delete-table8?${convertIntoURL({
        UserClientId,
        UserId,
        FinancialYearId,
      })}`
    );
  }

  // part 3
  getPart3Data(
    UserClientId,
    UserId,
    FinancialYearId,
    gstNumber,
    subscriptionId
  ) {
    return axios.get(
      `${API_URL_GSTR9C}/api/gstr9c/get-pt3-data?${convertIntoURL({
        UserClientId,
        UserId,
        FinancialYearId,
        gstNumber,
        subscriptionId,
      })}`
    );
  }

  savePart3Data(payload) {
    return axios.post(`${API_URL_GSTR9C}/api/gstr9c/save-pt3-data`, payload);
  }

  deleteTable9Data(UserClientId, UserId, FinancialYearId) {
    return axios.post(
      `${API_URL_GSTR9C}/api/gstr9c/delete-pt3-table9?${convertIntoURL({
        UserClientId,
        UserId,
        FinancialYearId,
      })}`
    );
  }

  deleteTable10Data(UserClientId, UserId, FinancialYearId) {
    return axios.post(
      `${API_URL_GSTR9C}/api/gstr9c/delete-pt3-table10?${convertIntoURL({
        UserClientId,
        UserId,
        FinancialYearId,
      })}`
    );
  }

  deleteTable11Data(UserClientId, UserId, FinancialYearId) {
    return axios.post(
      `${API_URL_GSTR9C}/api/gstr9c/delete-pt3-table11?${convertIntoURL({
        UserClientId,
        UserId,
        FinancialYearId,
      })}`
    );
  }

  // part 4
  getPart4Data(
    UserClientId,
    UserId,
    FinancialYearId,
    gstNumber,
    subscriptionId
  ) {
    return axios.get(
      `${API_URL_GSTR9C}/api/gstr9c/get-pt4-data?${convertIntoURL({
        UserClientId,
        UserId,
        FinancialYearId,
        gstNumber,
        subscriptionId,
      })}`
    );
  }

  savePart4Data(payload) {
    return axios.post(`${API_URL_GSTR9C}/api/gstr9c/save-pt4-data`, payload);
  }

  deleteTable12Data(UserClientId, UserId, FinancialYearId) {
    return axios.post(
      `${API_URL_GSTR9C}/api/gstr9c/delete-pt4-table12?${convertIntoURL({
        UserClientId,
        UserId,
        FinancialYearId,
      })}`
    );
  }

  deleteTable13Data(UserClientId, UserId, FinancialYearId) {
    return axios.post(
      `${API_URL_GSTR9C}/api/gstr9c/delete-pt4-table13?${convertIntoURL({
        UserClientId,
        UserId,
        FinancialYearId,
      })}`
    );
  }

  deleteTable14Data(UserClientId, UserId, FinancialYearId) {
    return axios.post(
      `${API_URL_GSTR9C}/api/gstr9c/delete-pt4-table14?${convertIntoURL({
        UserClientId,
        UserId,
        FinancialYearId,
      })}`
    );
  }

  deleteTable15Data(UserClientId, UserId, FinancialYearId) {
    return axios.post(
      `${API_URL_GSTR9C}/api/gstr9c/delete-pt4-table15?${convertIntoURL({
        UserClientId,
        UserId,
        FinancialYearId,
      })}`
    );
  }

  deleteTable16Data(UserClientId, UserId, FinancialYearId) {
    return axios.post(
      `${API_URL_GSTR9C}/api/gstr9c/delete-pt4-table16?${convertIntoURL({
        UserClientId,
        UserId,
        FinancialYearId,
      })}`
    );
  }

  // part 5
  getPart5Data(
    FKUserClientId,
    UserId,
    FinancialYearId,
    gstNumber,
    subscriptionId
  ) {
    return axios.get(
      `${API_URL_GSTR9C}/api/gstr9c/get-pt5-data?${convertIntoURL({
        FKUserClientId,
        UserId,
        FinancialYearId,
        gstNumber,
        subscriptionId,
      })}`
    );
  }

  saveTable17Data(payload) {
    return axios.post(`${API_URL_GSTR9C}/api/gstr9c/save-pt5-data`, payload);
  }

  deleteTable17Data(UserClientId, UserId, FinancialYearId) {
    return axios.post(
      `${API_URL_GSTR9C}/api/gstr9c/delete-table17?${convertIntoURL({
        UserClientId,
        UserId,
        FinancialYearId,
      })}`
    );
  }

  // export api
  exportData(UserClientId, FinancialYearId, Userid, gstnumber) {
    return axios.get(
      `${API_URL_GSTR9C}/api/gstr9c/export?${convertIntoURL({
        UserClientId,
        FinancialYearId,
        Userid,
        gstnumber,
      })}`
    );
  }

  // delete for all section
  deleteAllSection(UserClientId, FinancialYearId, UserId, payload) {
    return axios.post(
      `${API_URL_GSTR9C}/api/gstr9c/delete-gstr9c-all-section?${convertIntoURL({
        UserClientId,
        FinancialYearId,
        UserId,
      })}`,
      payload
    );
  }


  gstr9CSaveGovt(payLoad) {
    return axios.post(API_URL_GSTR9C + '/api/gstr9c/gstr9c-save-to-government', payLoad);
  }

  getGstr9CSummaryGovt(payLoad) {
    return axios.post(API_URL_GSTR9C + '/api/gstr9c/get-gstr9c-summary-government', payLoad);
}

  gstr9CGovtReturnErrorLogStatus(payLoad) {
    return axios.get(API_URL_GSTR9C + '/api/gstr9c/gstr9c-government-return-error-log-status?logId=' + payLoad);
  }

  gstr9CGovtReturnLogStatus(payLoad) {
    return axios.post(API_URL_GSTR9C + '/api/gstr9c/gstr9c-government-return-log-status', payLoad);
  }

  fileGstr9CGovt(payLoad) {
    return axios.post(API_URL_GSTR9C + '/api/gstr9c/file-gstr9C-government', payLoad);
}

  generateEvcOtpGovt(payLoad) {
    return axios.post(API_URL_GSTR9C + '/api/gstr9c/generate-evc-otp-government', payLoad);
}
   // **Gstr9c Export Json
   gstr9cExportJson(payLoad) {
    return axios.post(API_URL_GSTR9C + '/api/gstr9c/export-gstr9c-save-to-gov-json', payLoad)
}

multiDelete(payload){
  return axios.post(API_URL_GSTR9C + "/api/gstr9c/multiple-delete-gstr9c-all-section" , payload)
}

}

export default new GSTR9cService();
