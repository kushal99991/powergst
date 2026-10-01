import axios from "axios";
import { API_ITC_RECLAIM_LEDGER } from "../../configs/config";
import { convertIntoURL } from "../utils";

class ITCReclaimLedgerService {
  getITCReclaimLedgerDetails(UserClientId, subscriptionId, gstNumber) {
    return axios.get(
      `${API_ITC_RECLAIM_LEDGER}/api/ledger/get-credit-reversal-reclaim-details?${convertIntoURL(
        {
          UserClientId,
          subscriptionId,
          gstNumber,
        }
      )}`
    );
  }

  exportDetails(
    FKUserClientId,
    UserId,
    FromRange,
    ToRange,
    subscriptionId,
    gstNumber,
    t
  ) {
    return axios.get(
      `${API_ITC_RECLAIM_LEDGER}/api/ledger/export-credit-reversal-reclaim-details?${convertIntoURL(
        {
          FKUserClientId,
          UserId,
          FromRange,
          ToRange,
          subscriptionId,
          gstNumber,
          t,
        }
      )}`
    );
  }

  downLoadITCReclaimLedger(
    UserClientId,
    UserId,
    FromRange,
    ToRange,
    subscriptionId,
    gstNumber
  ) {
    return axios.post(
      `${API_ITC_RECLAIM_LEDGER}/api/ledger/download-credit-reversal-reclaim-details?${convertIntoURL(
        {
          UserClientId,
          UserId,
          FromRange,
          ToRange,
          subscriptionId,
          gstNumber,
        }
      )}`
    );
  }
}
export default new ITCReclaimLedgerService();
