// ** React Imports
import { lazy } from 'react'

// const Invoices = lazy(() => import('../../views/pages/purchase/invoices'))
// const RequestOTP = lazy(() => import('../../views/pages/gstpan/requestOTP'))
// const GstPan = lazy(() => import('../../views/pages/gstpan/gstpan2B'))
// const GstPan2A = lazy(() => import('../../views/pages/gstpan/gstpan2A'))
const Message = lazy(() => import('../../firebase/message'))
// const TwoBvsPurchase = lazy(() => import('../../views/pages/2bVsPurchaseReco/2bvsPurchase'))
// const TwoBvsPurchasePan = lazy(() => import('../../views/pages/panReco/2bvsPurchasePan'))
// const TwoAvsPurchasePan = lazy(() => import('../../views/pages/panReco2A/2avsPurchasePan'))
// const TwoAvsPurchase = lazy(() => import('../../views/pages/reco2A/2avsPurchase'))
// const SelectReco2A = lazy(() => import('../../views/pages/reco2A/selectReco2A'))
// const RecoMain = lazy(() => import('../../views/pages/2bVsPurchaseReco/recoMain'))
// const GstrReco2AvsPurchase = lazy(() => import('../../views/pages/reco2A/recoMain2A'));
// const RecoMainGstr1Einvoice = lazy(() => import('../../views/pages/gstr1vsEInvoice/recoMain'))
// const RecoMainPan = lazy(() => import('../../views/pages/panReco/recoMainPan'))
// const RecoMainPan2A = lazy(() => import('../../views/pages/panReco2A/recoMainPan'))
// const RecoMain2A = lazy(() => import('../../views/pages/reco2A/recoMain2A'))
const PurchaseSummary2A = lazy(() => import('../../views/pages/gstr2A/2A-summary'))
const AddUserForm = lazy(() => import('../../views/pages/user-rights/add-user-index'))
const GSTR6 = lazy(() => import('../../views/pages/gstr6/gstr6-sales'))
const Gstr6PurchaseInvoices = lazy(() => import('../../views/pages/gstr6/gstr6'))
const Gstr6SalesSummary = lazy(() => import('../../views/pages/gstr6/gstr6-sales-summary'))

// IIF Pages Description
const IFF = lazy(() => import('../../views/pages/iif/iff-sales'))
const IFFPurchaseInvoices = lazy(() => import('../../views/pages/iif/iff'))
const IFFSalesSummary = lazy(() => import('../../views/pages/iif/iff-sales-summary'))
// ITC 04
const ITC04 = lazy(() => import('../../views/pages/itc04/itc-sale'))
const ITCPurchaseInvoices = lazy(() => import('../../views/pages/itc04/itc'))
const ItcSalesSummary = lazy(() => import('../../views/pages/itc04/itc-sales-summary'));
// const OneVSEInvoice = lazy(() => import('../../views/pages/gstr1vsEInvoice/gstr1vsEinvoice'))

//** GSTR1 Filed Data Details and imports
const GSTR1FiledDataSummary = lazy(() => import('../../views/pages/reports/gstr1FiledData/gstr1-file-data-summary'))
const GSTR1FiledData = lazy(() => import('../../views/pages/reports/gstr1FiledData/gstr1-file-data'))
const GSTR1FiledDataInvoice = lazy(() => import('../../views/pages/reports/gstr1FiledData/gstr1-file-data-invoices'))
const GSTR3BSuppliesMade = lazy(() => import('../../views/pages/reports/gstr3bFiledData/gstr3bfiled-supplies-made'))
//**  GSTR3b Filed Data Details and imports
const GSTR3BFiled = lazy(() => import('../../views/pages/reports/gstr3bFiledData/index'))
//** GSTR6 Filed Data
const GSTR6Filed = lazy(() => import('../../views/pages/reports/gstr6FiledData/gstr6-main'))
const GSTR6FiledSummary = lazy(() => import('../../views/pages/reports/gstr6FiledData/gstr6-summary'))
const GSTR6FiledInvoice = lazy(() => import('../../views/pages/reports/gstr6FiledData/gstr6-invoice'))
//** GSTR6A Filed Data
const GSTR6AFiled = lazy(() => import('../../views/pages/reports/gstr6AFiledData/gstr6a-reports-main'))
const GSTR6AFiledSummary = lazy(() => import('../../views/pages/reports/gstr6AFiledData/gstr6a-reports-summary'))
const GSTR6AFiledInvoice = lazy(() => import('../../views/pages/reports/gstr6AFiledData/gstr6a-reports-invoice'))
//** ITC-04 Returns
const ITC04Filed = lazy(() => import('../../views/pages/reports/itc04FiledData/itc04Filed-main'))
const ITC04FiledSummary = lazy(() => import('../../views/pages/reports/itc04FiledData/itc04Filed-summary'))
const ITC04FiledInvoice = lazy(() => import('../../views/pages/reports/itc04FiledData/itc04Filed-invoice'))
// const AllReports = lazy(() => import('../../views/components/redirect-table-list/index'))
const AllReports = lazy(() => import('../../views/pages/new-dashboard/statistics/view-list/index'))

//** CMP-08 Returns */
const CMP08 = lazy(() => import("../../views/pages/cmp08/cmp-sale"));
const CMPPurchaseInvoices = lazy(() => import("../../views/pages/cmp08/cmp"));
const CMPSaleSummary = lazy(() =>
  import("../../views/pages/cmp08/cmp-sales-summary")
);
// IFF Page Details
const IFFFiled = lazy(() => import('../../views/pages/reports/iffFiledData/iff-reports-main'))
const IFFFiledSummary = lazy(() => import('../../views/pages/reports/iffFiledData/iff-reports-summary'))
const IFFFiledInvoice = lazy(() => import('../../views/pages/reports/iffFiledData/iff-reports-invoice'))

const PurchaseSummary4A = lazy(() => import('../../views/pages/gstr4A/4A-summary'))
// const GstPan4A = lazy(() => import('../../views/pages/gstpan/gstpan4A'))
const Cmp08Download = lazy(() => import('../../views/pages/reports/cmp08FiledData/index'))


//**  GSTR9 Filed Data Details and imports
const GSTR9Filed = lazy(() => import('../../views/pages/reports/gstr9FiledData/index'))
const GSTR9CFiled = lazy(() => import('../../views/pages/reports/gstr9CFiledData/index'))

const TDSTCSFiled = lazy(() => import("../../views/pages/reports/tdstcsFiledData"))
const TDSTCSFiledDataSummary = lazy(() => import('../../views/pages/reports/tdstcsFiledData/tds-tcs-file-data-summary'))
const TDSTCSFiledDataInvoice = lazy(() => import('../../views/pages/reports/tdstcsFiledData/tds-tcs-file-data-invoices'))

// const MultipleDownloadGSTIN =  lazy(() => import('../../views/pages/multiple-download'))

const AppRoutes = [
  // {
  //   path: '/reconcilation/purchase-data',
  //   element: <Invoices />
  // },
  // {
  //   path: '/download-gstin/request-otp',
  //   element: <RequestOTP />,
  //   meta: {
  //     appLayout: true,
  //     className: 'email-application'
  //   }
  // },
  // {
  //   path: '/download-gstin/panbased-gstr2b',
  //   element: <GstPan />,
  //   meta: {
  //     appLayout: true,
  //     className: 'email-application'
  //   }
  // },
  // {
  //   path: '/download-gstin/panbased-gstr2a',
  //   element: <GstPan2A />,
  //   meta: {
  //     appLayout: true,
  //     className: 'email-application'
  //   }
  // },
  // {
  //   path: '/reconcilation/2b-vs-purchase',
  //   element: <TwoBvsPurchase />
  // },
  // {
  //   path: '/reconcilation/2a-vs-purchase',
  //   element: <TwoAvsPurchase />
  // },
  // {
  //   path: '/reconcilation/pan-2b-vs-purchase',
  //   element: <TwoBvsPurchasePan />
  // },
  // {
  //   path: '/reconcilation/pan-2a-vs-purchase',
  //   element: <TwoAvsPurchasePan />
  // },
  // {
  //   path: '/selectreco2a',
  //   element: <SelectReco2A />,
  //   meta: {
  //     appLayout: true,
  //     className: 'email-application'
  //   }
  // },
  {
    path: '/gst-returns/gstr2a',
    element: <PurchaseSummary2A />,
    meta: {
      appLayout: true,
      className: 'email-application'
    }
  },
  // {
  //   path: '/reconcilation/2b-purchase-reco',
  //   element: <RecoMain />,
  //   meta: {
  //     appLayout: true,
  //     className: 'email-application'
  //   }
  // },
  // {
  //   path: '/reconcilation/2a-purchase-reco',
  //   element: <GstrReco2AvsPurchase />,
  //   meta: {
  //     appLayout: true,
  //     className: 'email-application'
  //   }
  // },
  // {
  //   path: '/reconcilation/gstr1-e-invoice-reco',
  //   element: <RecoMainGstr1Einvoice />,
  //   meta: {
  //     appLayout: true,
  //     className: 'email-application'
  //   }
  // },
  // {
  //   path: '/pan-2b-purchase-reco',
  //   element: <RecoMainPan />,
  //   meta: {
  //     appLayout: true,
  //     className: 'email-application'
  //   }
  // },
  // {
  //   path: '/pan-2a-purchase-reco',
  //   element: <RecoMainPan2A />,
  //   meta: {
  //     appLayout: true,
  //     className: 'email-application'
  //   }
  // },
  // {
  //   path: '/2a-purchase-reco',
  //   element: <RecoMain2A />,
  //   meta: {
  //     appLayout: true,
  //     className: 'email-application'
  //   }
  // },
  , {
    path: '/message',
    element: <Message />,
    meta: {
      appLayout: true,
      className: 'email-application'
    }
  }, {
    path: '/add-user',
    element: <AddUserForm />,
  }, {
    // path: '/gst-returns/gstr6',
    path: '/gst-returns/gstr6',
    element: <GSTR6 />,
    children: [
      { path: "", element: <Gstr6SalesSummary /> },
      { path: "/gst-returns/gstr6/gstr6-summary-details", element: <Gstr6PurchaseInvoices /> },
    ],
  },
  {
    // path: '/gst-returns/gstr6',
    path: '/gst-returns/iif',
    element: <IFF />,
    children: [
      { path: "", element: <IFFSalesSummary /> },
      { path: "/gst-returns/iif/iif-summary-details", element: <IFFPurchaseInvoices /> },
    ],
  },
  {
    path: '/gst-returns/itc-returns',
    element: <ITC04 />,
    children: [
      { path: "", element: <ItcSalesSummary /> },
      { path: "/gst-returns/itc-returns/itc-summary-details", element: <ITCPurchaseInvoices /> },
    ],
  },
  {
    path: "/gst-returns/cmp08",
    element: <CMP08 />,
    children: [
      { path: "", element: <CMPSaleSummary /> },
      {
        path: "/gst-returns/cmp08/cmp-summary-details",
        element: <CMPPurchaseInvoices />,
      },
    ],
  },
  // {
  //   path: '/reconcilation/gstr1-vs-e-invoice',
  //   element: <OneVSEInvoice />
  // },

  // ** multiple download route same to report
  {
    path: '/download-gstin/gstr1-filed-data',
    element: <GSTR1FiledData />,
    children: [
      { path: "", element: <GSTR1FiledDataSummary /> },
      { path: "gstr1-file-data-details", element: <GSTR1FiledDataInvoice /> },
    ],
  },
  {
    path: '/download-gstin/gstr3b-filed-data',
    element: <GSTR3BFiled />
  },
  {
    path: '/download-gstin/gstr9-filed-data',
    element: <GSTR9Filed />
  },
  {
    path: '/download-gstin/gstr9c-filed-data',
    element: <GSTR9CFiled />
  },
  {
    path: "/download-gstin/tds-tcs-filed-data",
    element: <TDSTCSFiled />,
    children: [
      { path: "", element: <TDSTCSFiledDataSummary /> },
      { path: "tds-tcs-file-data-details", element: <TDSTCSFiledDataInvoice /> },
    ],
  },
  {
    path: '/download-gstin/gstr3b-filed-data/supplies-made',
    element: <GSTR3BSuppliesMade />
  },
  {
    path: '/download-gstin/gstr6-filed-data',
    element: <GSTR6Filed />,
    children: [
      { path: "", element: <GSTR6FiledSummary /> },
      { path: "gstr6-summary-invoices", element: <GSTR6FiledInvoice /> },
    ],
  },
  {
    path: '/download-gstin/gstr6a-filed-data',
    element: <GSTR6AFiled />,
    children: [
      { path: "", element: <GSTR6AFiledSummary /> },
      { path: "gstr6a-file-summary-data-details", element: <GSTR6AFiledInvoice /> },
    ],
  },
  {
    path: '/download-gstin/itc04-filed-data',
    element: <ITC04Filed />,
    children: [
      { path: "", element: <ITC04FiledSummary /> },
      { path: "itc04-file-summary-data-details", element: <ITC04FiledInvoice /> }]
  },
  {
    path: '/download-gstin/iff-filed-data',
    element: <IFFFiled />,
    children: [
      { path: "", element: <IFFFiledSummary /> },
      { path: "gstr6a-file-summary-data-details", element: <IFFFiledInvoice /> },
    ],
  },
  {
    path: '/gst-returns',
    element: <AllReports />,
  },
  // {
  //   path: '/download-gstin/panbased-gstr4a',
  //   element: <GstPan4A />,
  //   meta: {
  //     appLayout: true,
  //     className: 'email-application'
  //   }
  // },
  {
    path: '/gst-returns/gstr4a',
    element: <PurchaseSummary4A />,
    meta: {
      appLayout: true,
      className: 'email-application'
    }
  },

  {
    path: '/download-gstin/cmp08-filed-data',
    element: <Cmp08Download />
  },

  {
    path: '/download-gstin',
    element: <AllReports />,
  },

  // {
  //   path: '/multiple-download-gstin',
  //   element: <MultipleDownloadGSTIN  />,
  //   },


]

export default AppRoutes
