import axios from "axios";
import { API_URL_CMP08 } from "../../configs/config";

class CMP08Service {
  getCMP08Data(FKUserClientId, Range, UserId, G_GSTIN, subId) {
    return axios.get(
      API_URL_CMP08 +
        "/api/cmp08/get-cmp08-data?FKUserClientId=" +
        FKUserClientId +
        "&Range=" +
        Range +
        "&GSTNumber=" +
        G_GSTIN +
        "&UserId=" +
        UserId +
        "&subscriptionId=" +
        subId
    );
  }

  getCashLedgerData(FKUserClientId, Range, UserId, G_GSTIN, subId) {
    return axios.get(
      API_URL_CMP08 +
        "/api/cmp08/get-cash-ledger-data?FKUserClientId=" +
        FKUserClientId +
        "&Range=" +
        Range +
        "&GSTNumber=" +
        G_GSTIN +
        "&UserId=" +
        UserId +
        "&subscriptionId=" +
        subId
    );
  }

  updateCMP08Data(payload) {
    return axios.post(
      API_URL_CMP08 + "/api/cmp08/insert-update-cmp08-data",
      payload
    );
  }

  deleteCMP08Data(payload) {
    return axios.post(API_URL_CMP08 + "/api/cmp08/delete-cmp08-id", payload);
  }
  cmp08SaveExportDataAPI(FKUserclientid, Range, Userid, gstnumber, token) {
    return axios.get(
      API_URL_CMP08 +
        "/api/cmp08/export?FKUserclientid=" +
        FKUserclientid +
        "&Range=" +
        Range +
        "&Userid=" +
        Userid +
        "&gstnumber=" +
        gstnumber +
        "&t=" +
        token,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
  // Upload Data to GovernMent
  cmp08SaveGovt(payLoad) {
    return axios.post(
      API_URL_CMP08 + "/api/cmp08/cmp08-save-to-government",
      payLoad
    );
  }

  // ** file-cmp08-government
  fileCmp08Govt(payLoad) {
    return axios.post(
      API_URL_CMP08 + "/api/cmp08/file-cmp08-government",
      payLoad
    );
  }

  // ** generate-evc-otp-government - cmp08
  generateEvcOtpGovt(payLoad) {
    return axios.post(
      API_URL_CMP08 + "/api/cmp08/generate-evc-otp-government",
      payLoad
    );
  }

  // ** proceed-to-file-cmp08-government
  proceedFileCmp08Govt(payLoad) {
    return axios.post(
      API_URL_CMP08 + "/api/cmp08/proceed-to-file-cmp08-government",
      payLoad
    );
  }

  //**  cmp08 returnLog Status
  cmp08GovtReturnLogStatus(payLoad) {
    return axios.post(
      API_URL_CMP08 + "/api/cmp08/cmp08-government-return-log-status",
      payLoad
    );
  }

  // **cmp08 Export Json
  cmp08ExportJson(payLoad) {
    return axios.post(
      API_URL_CMP08 + "/api/cmp08/export-cmp08-save-to-gov-json",
      payLoad
    );
  }

  multiDelete(payload) {
    return axios.post(
      API_URL_CMP08 + "/api/cmp08/multiple-delete-cmp08",
      payload
    );
  }
}

export default new CMP08Service();
