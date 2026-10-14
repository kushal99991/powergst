export const urlEndpointConfig = {
    // ** GST Return
    GSTR1: "/gst-returns/gstr1-sales",
    GSTR3B: "/gst-returns/gstr3b",
    GSTR2B: "/gst-returns/gstr2b-summary",
    GSTR2A: "/gst-returns/gstr2a",
    GSTR6: "/gst-returns/gstr6",
    ITC04: "/gst-returns/itc-returns",
    CMP08: "/gst-returns/cmp08",
    GSTR6A: "/gst-returns/gstr6a-filed-data",

    GSTR9: "/gst-returns/gstr9",
    GSTR9C: "/gst-returns/gstr9c",
    GSTR4: "",
    GSTR4A: "/gst-returns/gstr4a",
    IFF: "/gst-returns/IIF",
    TDSTCS: "/gst-returns/tdstcs",
    TDSTCS_INVOICES: "/gst-returns/tdstcs/tdstcs-summary-details",

    // ** Reco
    PURCHASE: "/reconcilation/purchase-summary",
    GSTR2B_VS_PURCHASE: "/reconcilation/2b-vs-purchase",
    GSTR2B_VS_PURCHASE_RECO: "/reconcilation/2b-purchase-reco",
    PANBASE2B_VS_PURCHASE: "/reconcilation/pan-2b-vs-purchase",
    GSTR1_VS_EINVOICE: "/reconcilation/gstr1-vs-e-invoice",
    RECO_EXCEL_VALIDATION: "/excel-validation",
    GSTR1_EXCEL_VALIDATION: "/excel-validation-gstr1",
    GSTR_IFF_EXCEL_VALIDATION: "/excel-validation-iff",
    GSTR2A_VS_PURCHASE: "/reconcilation/2a-vs-purchase",
    GSTR2A_VS_PURCHASE_RECO: "/reconcilation/pan-2a-vs-purchase",


    // ** Download
    REQUESTOTP: "/download-gstin/request-otp",
    GSTR1_DOWNLOAD: "/download-gstin/gstr1-filed-data",
    GSTR3B_DOWNLOAD: "/download-gstin/gstr3b-filed-data",
    GSTR9_DOWNLOAD: "/download-gstin/gstr9-filed-data",
    GSTR9C_DOWNLOAD: "/download-gstin/gstr9c-filed-data",
    GSTR2B_DOWNLOAD: "/download-gstin/panbased-gstr2b",
    GSTR2A_DOWNLOAD: "/download-gstin/panbased-gstr2a",
    GSTR6_DOWNLOAD: "/download-gstin/gstr6-filed-data",
    GSTR6A_DOWNLOAD: "/download-gstin/gstr6a-filed-data",
    ITC04_DOWNLOAD: "/download-gstin/itc04-filed-data",
    CMP08_DOWNLOAD: "/download-gstin/cmp08-filed-data",
    IFF_DOWNLOAD: "/download-gstin/iff-filed-data",
    GSTR4A_DOWNLOAD: "/download-gstin/panbased-gstr4a",
    TDS_TCS_DOWNLOAD: "/download-gstin/tds-tcs-filed-data",

    // ** Ledger
    CASH_LEDGER: "/ledgers/cash-ledger",
    CREDIT_LEDGER: "/ledgers/credit-ledger",

    // ** Report
    GSTR1_FILED_REPORT: "/reports/gstr1-filed-data?gstr1=1",
    GSTR3B_FILED_REPORT: "/reports/gstr3b-filed-data?gstr3b=1",
    GSTR9_FILED_REPORT: "/reports/gstr9-filed-data?gstr9=1",
    GSTR9C_FILED_REPORT: "/reports/gstr9c-filed-data?gstr9c=1",
    GSTR6_FILED_REPORT: "/reports/gstr6-filed-data?gstr6=1",
    GSTR6A_FILED_REPORT: "/reports/gstr6a-filed-data?gstr6a=1",
    ITC04_REPORT: "/reports/itc04-filed-data?itc04=1",
    CMP08_REPORT: "/reports/cmp08-filed-data?cmp08=1",
    TDS_TCS_REPORT: "/reports/tds-tcs-filed-data?tdstcs=1",
    TDS_TCS_FILE_DATA_DETAILS: '/reports/tds-tcs-filed-data/tds-tcs-file-data-details?tdstcs=1',
    IFF_REPORT: "/reports/iff-filed-data?iff=1",
    GSTR1_HSN_REPORT: "/reports/gstr1-hsnSummary-report",
    SALES_HSN_REPORT: "/reports/sales-hsnSummary-report",
    PURCHASE_RATE_REPORT: "/reports/purchase-ratewise-report",
    SALES_RATE_REPORT: "/reports/sales-ratewise-report",
    GSTR1_RATE_REPORT: "/reports/gstr1filed-ratewise-report",
    GSTR3B_VS_GSTR2B_REPORT: "/reports/gstr3b-gstr2b-books",
    GSTR3B_VS_GSTR2B_PURCHASE: "/reports/gstr3b-gstr2b-purchase",
    PAN_GSTR3B_VS_GSTR1_REPORT: "/reports/pan-gstr3b-gstr1-books",
    GSTR1_VS_GSTR3B_VS_SALES_REPORT: "/reports/gstr1-gstr3b-salesreport",
    GST_Filling_Status: "/reports/gst-filing-status",
    PANBASED_LEDGER: "/reports/panbased-ledger",

    // ** Dashboard and Company
    DASHBOARD: "/dashboard",
    DASHBOARD_COMPANY: "/dashboard/company",
    COMPANY_SETTING: "/settings",

    // **  ALL List - dashboard
    GSTR_All: "/gst-returns",
    RECO_All: "/reconcilation",
    REPORT_ALL: "/reports",


    GSTR4A: "/gst-returns/gstr4a",
    // GSTR4A_DOWNLOAD: "/download-gstin/pan-based-gstr4a",

    GSTR6A_FILED_SUB_REPORT: "/reports/gstr6a-filed-data/gstr6a-file-summary-data-details",
    GSTR6_FILED_SUB_REPORT: "/reports/gstr6-filed-data/gstr6-summary-invoices",

    GSTR6_EXCEL_VALIDATION: "/excel-validation-gstr6",
    GSTR6_EXCEL_IMPORT: '/gstr6/import-data-summary',
    PURCHASE_EXCEL_IMPORT: '/purchase/import-data-summary',
    DOWNLOAD_ALL: '/download-gstin',
    REPORT_GENERATE_EXISTDATA_ENDPOINT: "/api/gstr1/check-report-exist",
    // ** Tally import url
    TALLY_CONNECTOR: '/import/tallyConnector',

}
