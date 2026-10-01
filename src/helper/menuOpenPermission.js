import { globleVariable  } from '@configs/globalVariable'
import { urlEndpointConfig } from "@configs/urlEndpoint"

export default function menuOpenPermission(urlLink) {

  let returnVal = false
  const regType = sessionStorage.getItem(globleVariable.registrationType);
  const isMultipleDownloadRight = localStorage.getItem(globleVariable.isMultipleDownload);

    // ** if isMultipleDownload false Pan base url not open
    if (isMultipleDownloadRight == 'false') {
        if (urlLink.includes('pan-')) {
          returnVal = true
        }
    }


  // ** Registration type wise permission menu
  if (urlLink !== urlEndpointConfig.DASHBOARD_COMPANY && urlLink !== urlEndpointConfig.DASHBOARD &&
    urlLink !== urlEndpointConfig.REQUESTOTP &&  urlLink !== urlEndpointConfig.PURCHASE &&  urlLink !== urlEndpointConfig.GSTR2B_VS_PURCHASE &&
    urlLink !== urlEndpointConfig.PANBASE2B_VS_PURCHASE &&  urlLink !== urlEndpointConfig.GSTR1_VS_EINVOICE &&
    urlLink !== urlEndpointConfig.CASH_LEDGER &&   urlLink !== urlEndpointConfig.CREDIT_LEDGER &&
    urlLink !== urlEndpointConfig.GSTR_All && urlLink !== urlEndpointConfig.RECO_All &&
    urlLink !==  urlEndpointConfig.REPORT_ALL && urlLink !== urlEndpointConfig.ITC04 &&
    urlLink !== urlEndpointConfig.ITC04_DOWNLOAD &&   urlLink !== urlEndpointConfig.ITC04_REPORT.split("?")[0] &&
    urlLink !== urlEndpointConfig.COMPANY_SETTING &&
    urlLink !== urlEndpointConfig.GSTR2B_VS_PURCHASE_RECO &&
    urlLink !== urlEndpointConfig.RECO_EXCEL_VALIDATION &&
    urlLink !== urlEndpointConfig.GSTR1_EXCEL_VALIDATION &&
    urlLink !== urlEndpointConfig.GSTR_IFF_EXCEL_VALIDATION &&
    urlLink !== urlEndpointConfig.GST_Filling_Status &&
    urlLink !== urlEndpointConfig.GSTR2A_VS_PURCHASE &&
    urlLink !== urlEndpointConfig.GSTR2A_VS_PURCHASE_RECO &&
    urlLink !== urlEndpointConfig.DOWNLOAD_ALL

    ) {
    if (regType == 3) {   // ** ISD
      if (urlLink !== urlEndpointConfig.GSTR6  && urlLink !==  urlEndpointConfig.GSTR6_FILED_REPORT.split("?")[0] &&
      urlLink !==  urlEndpointConfig.GSTR6A_FILED_REPORT.split("?")[0] &&
      urlLink !== urlEndpointConfig.GSTR6_DOWNLOAD && urlLink !== urlEndpointConfig.GSTR6A_DOWNLOAD &&
      urlLink !== urlEndpointConfig.GSTR6A_FILED_SUB_REPORT &&
      urlLink !== urlEndpointConfig.GSTR6_FILED_SUB_REPORT &&
      urlLink !== urlEndpointConfig.GSTR6A.split("?")[0] &&
      urlLink !== urlEndpointConfig.GSTR6_EXCEL_VALIDATION &&
      urlLink !== urlEndpointConfig.GSTR6_EXCEL_IMPORT
       ) {
        returnVal = true
      }
    } else if (regType == 2) {  // ** composition
      if (urlLink !== urlEndpointConfig.CMP08 && urlLink !== urlEndpointConfig.CMP08_REPORT.split("?")[0]
       &&  urlLink !== urlEndpointConfig.GSTR4A &&  urlLink !== urlEndpointConfig.GSTR4A_DOWNLOAD &&
       urlLink !== urlEndpointConfig.CMP08_DOWNLOAD  ) {
        returnVal = true
      }
    } else if (regType == 1 || regType == 4 || regType == null || regType == "" ) { // ** Regular /  Casual Taxable
      if (urlLink == urlEndpointConfig.GSTR6 || urlLink == urlEndpointConfig.GSTR6_DOWNLOAD ||  urlLink ==  urlEndpointConfig.GSTR6A_DOWNLOAD  ||
        urlLink ==  urlEndpointConfig.GSTR6_FILED_REPORT.split("?")[0] ||  urlLink == urlEndpointConfig.GSTR6A_FILED_REPORT.split("?")[0] ||
        urlLink ==  urlEndpointConfig.CMP08_REPORT.split("?")[0]  || urlLink == urlEndpointConfig.CMP08 ||
        urlLink == urlEndpointConfig.CMP08_DOWNLOAD ||
        urlLink == urlEndpointConfig.GSTR4A  ||  urlLink == urlEndpointConfig.GSTR4A_DOWNLOAD &&
        urlLink == urlEndpointConfig.GSTR6A.split("?")[0] &&
        urlLink == urlEndpointConfig.GSTR6A &&
        urlLink == urlEndpointConfig.SALES_HSN_REPORT &&
        urlLink == urlEndpointConfig.PURCHASE_RATE_REPORT &&
        urlLink == urlEndpointConfig.PURCHASE_RATE_REPORT &&
        urlLink == urlEndpointConfig.GSTR1_HSN_REPORT &&
        urlLink == urlEndpointConfig.GSTR1_RATE_REPORT &&
        urlLink == urlEndpointConfig.GSTR9_FILED_REPORT &&
        urlLink == urlEndpointConfig.GSTR9_DOWNLOAD &&
        urlLink == urlEndpointConfig.GSTR9C_DOWNLOAD &&
        urlLink == urlEndpointConfig.GSTR3B_VS_GSTR2B_REPORT &&
        urlLink == urlEndpointConfig.GSTR9

        ) {
          returnVal = true
      }
    }
  }
  return returnVal;

};

