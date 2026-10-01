import axios from "axios";
import { API_URL_GSTR2B, API_URL_GSTR9 } from "../../configs/config";
import { globleVariable } from "../../configs/globalVariable";
import SessionFunction from "../../configs/getSessionFunction";
import { convertIntoURL } from "../utils";
// import SessionFunction from '../../../../configs/getSessionFunction'

class GSTR9FiledService {
  singleYearDownload(UserClientId, UserId, FinancialYearId, subscriptionId, gstNumber) {
    return axios.get(
      `${API_URL_GSTR9}/api/gstr9filed/download?${convertIntoURL({
        UserClientId,
        UserId,
        FinancialYearId,
        subscriptionId,
        gstNumber,
      })}`,
    );
  }

  singleYearDownloadWithOutOtp(UserClientId, UserId, FinancialYearId, subscriptionId, gstNumber) {
    return axios.get(
      `${API_URL_GSTR9}/api/gstr9filed/download-without-otp?${convertIntoURL({
        UserClientId,
        UserId,
        FinancialYearId,
        subscriptionId,
        gstNumber,
      })}`,
    );
  }

  getSavedExportFileData(
    UserClientId,
    UserId,
    FromFinancialYearId,
    ToFinancialYearId,
    subscriptionId,
    gstNumber,
    t
  ) {
    return axios.get(
      `${API_URL_GSTR9}/api/gstr9filed/export-filed?${convertIntoURL({
        UserClientId,
        UserId,
        FromFinancialYearId,
        ToFinancialYearId,
        subscriptionId,
        gstNumber,
        t
      })}`,
    );
  }

  getPanSummery(clientId, value) {
    return axios.get(
      `${API_URL_GSTR2B}/api/gstr2b/panbased-gstr2b?${convertIntoURL({
        UserId: clientId,
        SearchByGSTIN: value,
      })}`,
    );
  }

  backgroundPagination(payload) {
    return axios.post(API_URL_GSTR2B + "/api/gstr2b/background-request-pagination", payload);
  }

  checkUserProcess(UserId) {
    return axios.get(
      `${API_URL_GSTR9}/api/gstr9filed/check-user-process?${convertIntoURL({ UserId })}`,
    );
  }

  downloadMultiple(payload) {
    return axios.post(`${API_URL_GSTR9}/api/gstr9filed/download-multiple-data`, payload);
  }

  getAllGSTR9FileData(UserClientId, FromRange, ToRange) {
    return axios.get(
      `${API_URL_GSTR9}/api/gstr9filed/get-gstr9filed?${convertIntoURL({
        UserClientId,
        FromRange,
        ToRange,
        GSTNumber: null,
      })}`,
    );
  }
}
export default new GSTR9FiledService();
