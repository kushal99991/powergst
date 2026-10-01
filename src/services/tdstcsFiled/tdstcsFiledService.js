import axios from "axios";
import { API_TDSTCS_FILED, API_URL_GSTR2B } from "../../configs/config";
import { convertIntoURL } from "../utils";

class TDSTCSFiledService {
  downloadGovtTdsTcsFiled(UserClientId, UserId, range, subscriptionId) {
    return axios.get(
      API_TDSTCS_FILED +
        "/api/tdstcsfiled/download?UserClientId=" +
        UserClientId +
        "&UserId=" +
        UserId +
        "&range=" +
        range +
        "&subscriptionId=" +
        subscriptionId
    );
  }

  downloadGovtTdsTcsFiledWithOutOtp(UserClientId, UserId, range, subscriptionId) {
    return
    return axios.get(
      API_TDSTCS_FILED +
        "/api/tdstcsfiled/download?UserClientId=" +
        UserClientId +
        "&UserId=" +
        UserId +
        "&range=" +
        range +
        "&subscriptionId=" +
        subscriptionId
    );
  }

  downloadMultiple(payload) {
    return axios.post(
      API_TDSTCS_FILED + "/api/tdstcsfiled/download-multiple-data",
      payload
    );
  }

  backgroundPagination(payload) {
    return axios.post(
      API_URL_GSTR2B + "/api/gstr2b/background-request-pagination",
      payload
    );
  }

  checkUserProcess(UserId) {
    return axios.get(
      `${API_TDSTCS_FILED}/api/tdstcsfiled/check-user-process?${convertIntoURL({
        UserId,
      })}`
    );
  }

  getPanSummery(clientId, value) {
    return axios.get(
      `${API_URL_GSTR2B}/api/gstr2b/panbased-gstr2b?${convertIntoURL({
        UserId: clientId,
        SearchByGSTIN: value,
      })}`
    );
  }

  getSavedExportFileData(
    UserClientId,
    UserId,
    FromRange,
    ToRange,
    subscriptionId,
    gstNumber,
    t,
    TDSTCSSectionId
  ) {
    return axios.get(
      `${API_TDSTCS_FILED}/api/tdstcsfiled/export?${convertIntoURL({
        UserClientId,
        UserId,
        FromRange,
        ToRange,
        subscriptionId,
        gstNumber,
        t,
        TDSTCSSectionId,
      })}`
    );
  }

  getTdsTcsSummary(FromRange, ToRange, UserClientId) {
    return axios.get(
      `${API_TDSTCS_FILED}/api/tdstcs/get-tdstcs-summary?${convertIntoURL({
        FromRange,
        ToRange,
        UserClientId,
      })}`
    );
  }

  tdstcsReturnExport(
    UserClientId,
    FromRange,
    ToRange,
    TDSTCSSectionId,
    gstNumber
  ) {
    return axios.get(
      `${API_TDSTCS_FILED}/api/tdstcs/export?${convertIntoURL({
        UserClientId,
        FromRange,
        ToRange,
        TDSTCSSectionId,
        gstNumber,
      })}`
    );
  }

  getTdsTcsSummaryTDS(payload) {
    return axios.post(
      API_TDSTCS_FILED + "/api/tdstcs/get-tdstcs-pagination",
      payload
    );
  }

  deleteAllSection(payload) {
    return axios.post(`${API_TDSTCS_FILED}/api/tdstcs/delete-tdstcs`, payload);
  }

  saveData(payload) {
    return axios.post(
      `${API_TDSTCS_FILED}/api/tdstcs/insert-update-tdstcs-data`,
      payload
    );
  }

  deleteInvoiceTDSTCS(payload) {
    return axios.post(`${API_TDSTCS_FILED}/api/tdstcs/delete`, payload);
  }
}
export default new TDSTCSFiledService();
