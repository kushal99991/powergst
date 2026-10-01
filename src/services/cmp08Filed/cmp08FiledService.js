import axios from "axios";
import { API_URL_CMP08 } from "../../configs/config";

class CMP08FiledService {
  downloadMultiple(payload) {
    return axios.post(
      API_URL_CMP08 + "/api/cmp08filed/download-multiple-data",
      payload
    );
  }

  checkUserProcess(UserId) {
    return axios.get(
      API_URL_CMP08 + "/api/cmp08filed/check-user-process?UserId=" + UserId
    );
  }

  downloadGovtCMP08Filed(
    UserClientId,
    UserId,
    returnPeriod,
    SubscriptionId,
    G_GSTIN
  ) {
    return axios.get(
      API_URL_CMP08 +
        "/api/cmp08filed/download?UserClientId=" +
        UserClientId +
        "&UserId=" +
        UserId +
        "&returnPeriod=" +
        returnPeriod +
        "&SubscriptionId=" +
        SubscriptionId +
        "&gstNumber=" +
        G_GSTIN
    );
  }

  downloadGovtCMP08FiledWithOutOtp(
    UserClientId,
    UserId,
    returnPeriod,
    SubscriptionId,
    G_GSTIN
  ) {
    return axios.get(
      API_URL_CMP08 +
        "/api/cmp08Filed/download-without-otp?UserClientId=" +
        UserClientId +
        "&UserId=" +
        UserId +
        "&returnPeriod=" +
        returnPeriod +
        "&SubscriptionId=" +
        SubscriptionId +
        "&gstNumber=" +
        G_GSTIN
    );
  }

  getCMP08Filed(UserClientId, FromRange, ToRange, G_GSTIN, SubscriptionId) {
    return axios.get(
      API_URL_CMP08 +
        "/api/cmp08filed/get-cmp08filed?UserClientId=" +
        UserClientId +
        "&FromRange=" +
        FromRange +
        "&ToRange=" +
        ToRange +
        "&gstNumber=" +
        G_GSTIN +
        "&SubscriptionId=" +
        SubscriptionId
    );
  }

  exportCMP08Filed(
    UserClientId,
    FromRange,
    ToRange,
    subscriptionId,
    gstNumber,
    userId,
    token
  ) {
    return axios.get(
      API_URL_CMP08 +
        "/api/cmp08filed/export-filed?UserClientId=" +
        UserClientId +
        "&FromRange=" +
        FromRange +
        "&ToRange=" +
        ToRange +
        "&subscriptionId=" +
        subscriptionId +
        "&gstNumber=" +
        gstNumber +
        "&userId=" +
        userId +
        "&t=" +
        token,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}

export default new CMP08FiledService();
