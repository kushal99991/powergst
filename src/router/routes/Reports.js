import { lazy } from "react";

// GSTR1 Filed Data Details and imports
const GSTR1FiledDataSummary = lazy(() =>
  import("../../views/pages/reports/gstr1FiledData/gstr1-file-data-summary")
);
const GSTR1FiledData = lazy(() =>
  import("../../views/pages/reports/gstr1FiledData/gstr1-file-data")
);
const GSTR1FiledDataInvoice = lazy(() =>
  import("../../views/pages/reports/gstr1FiledData/gstr1-file-data-invoices")
);
const GSTR3BSuppliesMade = lazy(() =>
  import("../../views/pages/reports/gstr3bFiledData/gstr3bfiled-supplies-made")
);

// GSTR1 HsnSummary and Sales HsnSummary Data Details and imports
const GSTR1HSNSUMDATA = lazy(() =>
  import("../../views/pages/reports/gstr1HsnSummary/gstr1HsnData")
);
const SALESHSNSUMDATA = lazy(() =>
  import("../../views/pages/reports/salesHsnSummary/salesHsnData")
);

const PANBASEDLEDGERDATA = lazy(() =>
  import("../../views/pages/reports/panbasedLedger/panBasedLedgerData")
);

// Purchase Rate Summary and Sales Rate Summary Data Details and imports
// const SALESRATESUMDATA = lazy(() =>
//   import("../../views/pages/reports/salesRatewiseSummary/salesRatewiseData")
// );
// const PURCHASERATESUMDATA = lazy(() =>
//   import(
//     "../../views/pages/reports/purchaseRatewiseSummary/purchaseRateSummary"
//   )
// );
// const GSTR1FILEDRATEDATA = lazy(() =>
//   import("../../views/pages/reports/gstr1filedRateWise/gstr1filedRatewiseData")
// );

// Purchase Rate Summary and Sales Rate Summary Data Details and imports
const SALESRATESUMDATA = lazy(() => import('../../views/pages/reports/salesRatewiseSummary/salesRatewiseData'))
const PURCHASERATESUMDATA = lazy(() => import('../../views/pages/reports/purchaseRatewiseSummary/purchaseRateSummary'))
const GSTR1FILEDRATEDATA = lazy(() => import('../../views/pages/reports/gstr1filedRateWise/gstr1filedRatewiseData'))

// GSTR2B VS GSTR3B VS Purchase Report
const GSTR3B2BBOOKSDATA = lazy(() => import('../../views/pages/reports/gstr3b2bBooksSummary/gstr3b2bbooksData'))
const GSTR3B2BPurchaseData = lazy(() => import('../../views/pages/reports/gstr3b2bPurchaseReports/gstr3b2bPurchaseData'))
const PanGSTR3BvsGSTR1ReportsData = lazy(() => import('../../views/pages/reports/panGstr3bvsgstr1/panGstr3bvsgstr1reportData'))

// GSTR1 VS GSTR3B VS Sales Report
const GSTR13BSALESDATA = lazy(() => import('../../views/pages/reports/gstr1vs3bvsSalesReport/gstr1vs3bvsSalesReport'))

// GSTR3b Filed Data Details and imports
const GSTR3BFiled = lazy(() => import('../../views/pages/reports/gstr3bFiledData/index'))
//** GSTR6 Filed Data
const GSTR6Filed = lazy(() =>
  import("../../views/pages/reports/gstr6FiledData/gstr6-main")
);
const GSTR6FiledSummary = lazy(() =>
  import("../../views/pages/reports/gstr6FiledData/gstr6-summary")
);
const GSTR6FiledInvoice = lazy(() =>
  import("../../views/pages/reports/gstr6FiledData/gstr6-invoice")
);

const GSTR6AFiled = lazy(() =>
  import("../../views/pages/reports/gstr6AFiledData/gstr6a-reports-main")
);
const GSTR6AFiledSummary = lazy(() =>
  import("../../views/pages/reports/gstr6AFiledData/gstr6a-reports-summary")
);
const GSTR6AFiledInvoice = lazy(() =>
  import("../../views/pages/reports/gstr6AFiledData/gstr6a-reports-invoice")
);

// IFF Route Details
const IFFiled = lazy(() =>
  import("../../views/pages/reports/iffFiledData/iff-reports-main")
);
const IFFFiledSummary = lazy(() =>
  import("../../views/pages/reports/iffFiledData/iff-reports-summary")
);
const IFFFiledInvoice = lazy(() =>
  import("../../views/pages/reports/iffFiledData/iff-reports-invoice")
);
// ITC-04 Returns /

const ITC04Filed = lazy(() =>
  import("../../views/pages/reports/itc04FiledData/itc04Filed-main")
);
const ITC04FiledSummary = lazy(() =>
  import("../../views/pages/reports/itc04FiledData/itc04Filed-summary")
);
const ITC04FiledInvoice = lazy(() =>
  import("../../views/pages/reports/itc04FiledData/itc04Filed-invoice")
);
// const AllReports = lazy(() =>
//   import("../../views/components/redirect-table-list/index")
// );

const AllReports = lazy(() =>
  import("../../views/pages/new-dashboard/statistics/view-list/index")
);


// CMP08 Filed Data Details and imports
const CMP08Filed = lazy(() => import("../../views/pages/reports/cmp08FiledData/index"))

const GstFillingStatus =  lazy(() => import("../../views/pages/reports/gstFilingStatus/index"))

// GSTR9 Filed Data Details and imports
const GSTR9Filed = lazy(() => import('../../views/pages/reports/gstr9FiledData/index'))


// GSTR9C Filed Data Details and imports
const GSTR9CFiled = lazy(() => import('../../views/pages/reports/gstr9CFiledData/index'))

const TDSTCSFiled = lazy(() => import("../../views/pages/reports/tdstcsFiledData"))
const TDSTCSFiledDataSummary = lazy(() => import('../../views/pages/reports/tdstcsFiledData/tds-tcs-file-data-summary'))
const TDSTCSFiledDataInvoice = lazy(() => import('../../views/pages/reports/tdstcsFiledData/tds-tcs-file-data-invoices'))


const ReportsRoutes = [
  {
    path: '/reports/gstr1-filed-data',
    element: <GSTR1FiledData />,
    children: [
        { path: "", element: <GSTR1FiledDataSummary /> },
        { path: "gstr1-file-data-details", element: <GSTR1FiledDataInvoice /> },
    ],
},
{
  path : "/reports/tds-tcs-filed-data",
  element : <TDSTCSFiled />,
  children: [
    { path: "", element: <TDSTCSFiledDataSummary /> },
    { path: "tds-tcs-file-data-details", element: <TDSTCSFiledDataInvoice /> },
],
},
{
    path: '/reports/gstr3b-filed-data',
    element: <GSTR3BFiled />
},
{
    path: '/reports/gstr3b-filed-data/supplies-made',
    element: <GSTR3BSuppliesMade />
  },
  {
    path: '/reports/gstr6-filed-data',
    element: <GSTR6Filed />,
    children: [
      { path: "", element: <GSTR6FiledSummary /> },
      { path: "gstr6-summary-invoices", element: <GSTR6FiledInvoice /> },
    ],
  },
  {
    path: '/reports/gstr6a-filed-data',
    element: <GSTR6AFiled />,
    children: [
        { path: "", element: <GSTR6AFiledSummary /> },
        { path: "gstr6a-file-summary-data-details", element: <GSTR6AFiledInvoice /> },
    ],
},
{
  path: '/reports/itc04-filed-data',
  element: <ITC04Filed />,
  children: [
      { path: "", element: <ITC04FiledSummary /> },
      { path: "itc04-file-summary-data-details", element: <ITC04FiledInvoice /> },
  ],
},
{
  path: '/reports/iff-filed-data',
  element: <IFFiled />,
  children: [
      { path: "", element: <IFFFiledSummary /> },
      { path: "iff-file-summary-data-details", element: <IFFFiledInvoice /> },
  ],
},
{
path: '/reports/gstr1-hsnSummary-report',
element:<GSTR1HSNSUMDATA />
},
{
path: '/reports/sales-hsnSummary-report',
element:<SALESHSNSUMDATA />
},
{
path: '/reports/purchase-ratewise-report',
element:<PURCHASERATESUMDATA />
},
{
path: '/reports/sales-ratewise-report',
element:<SALESRATESUMDATA />
},
{
path: '/reports/gstr1filed-ratewise-report',
element: <GSTR1FILEDRATEDATA  />,
},
{
path: '/reports',
element: <AllReports  />,
},

{
  path: "/reports/cmp08-filed-data",
  element: <CMP08Filed />,
},

{
  path: '/reports/gstr3b-gstr2b-books',
  element: <GSTR3B2BBOOKSDATA  />,
},
{
  path: '/reports/gstr3b-gstr2b-purchase',
  element: <GSTR3B2BPurchaseData  />,
},
{
  path: '/reports/pan-gstr3b-gstr1-books',
  element: <PanGSTR3BvsGSTR1ReportsData  />,
},

{
  path: '/reports/gstr1-gstr3b-salesreport',
  element: <GSTR13BSALESDATA  />,
},

{
  path: '/reports/gst-filing-status',
  element: <GstFillingStatus  />,
},
{
  path: '/reports/gstr9-filed-data',
  element: <GSTR9Filed />
},
{
  path : '/reports/gstr9c-filed-data',
  element : <GSTR9CFiled />
},
{
  path: '/reports/panbased-ledger',
  element:<PANBASEDLEDGERDATA />
  },
]
export default ReportsRoutes;
