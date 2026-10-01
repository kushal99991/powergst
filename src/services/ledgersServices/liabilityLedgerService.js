import axios from "axios"
import { API_URL_Ledger_Services } from '../../configs/config'

class LiabilityLedgerService {

    getLiabilityLedger(UserClientId, UserId,gstNumber) {
        return axios.get(API_URL_Ledger_Services + '/api/ledger/get-liability-ledger?UserClientId=' + UserClientId + '&UserId=' + UserId + '&GSTNumber=' + gstNumber)
    }

    downLoadLiabilityLedger(UserClientId, UserId, FromRange, ToRange) {
        return axios.get(API_URL_Ledger_Services + '/api/ledger/download-liability-ledger?UserClientId=' + UserClientId + '&UserId=' + UserId + '&FromRange=' + FromRange + '&ToRange=' + ToRange)
    }

    liabilityLedgerExportExcelData(UserClientId, UserId, token) {
        return axios.get(API_URL_Ledger_Services + '/api/ledger/export-liability-ledger?FKUserClientId=' + UserClientId + '&UserId=' + UserId + "&t=" + token, {

            headers: {
                'Content-Type': 'application/json'
            }
        })
    }
}

export default new LiabilityLedgerService();
