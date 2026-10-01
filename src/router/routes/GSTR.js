import { lazy } from 'react'
const GSTR1filedPdf  =  lazy(() => import('../../views/pages/gstr1/GSTR1filedpdf'))
// from '../../views/pages/gstr1/GSTR1filedpdf'

const GSTR2BFolder = lazy(() => import('../../views/pages/gstr2B/index'))
const GSTRBSummaryByClientId =   lazy(() => import('../../views/pages/gstr2B/gstr2b-summary-data'))
const PurchaseInvoice2A = lazy(()=>import('../../views/pages/gstr2A/invoice-gstr2A'))
const PurchaseInvoice4A = lazy(()=>import('../../views/pages/gstr4A/invoice-gstr4A'))

const Gstr1Purchase = lazy(() => import('../../views/pages/gstr1/gstr1-sales'))
const Gstr1PurchaseInvoices = lazy(() => import('../../views/pages/gstr1/gstr1'))
const Gstr1SalesSummary = lazy(() => import('../../views/pages/gstr1/gstr1-sales-summary'))

// GSTR9
const Gstr9Summary = lazy(() => import('../../views/pages/gstr9/gstr9-summary'))
const Gstr9Purchase = lazy(() => import('../../views/pages/gstr9/gstr9-sales'))

// GSTR 9C
const Gstr9C = lazy(() => import('../../views/pages/gstr9c/index'))

const Sales = lazy(() => import('../../views/pages/gstr1/sales'))
const IffSalesAddInv = lazy(() => import('../../views/pages/iif/sales'))

// GSTR 3B Data and Details
const GSTR3BDetails = lazy(() => import('../../views/pages/gstr3b/index'))
const SuppliesMade = lazy(() => import('../../views/pages/gstr3b/supplies-made'))

// Payment & Computation  Page Route Details
const PaymentPage =  lazy(() => import('../../views/pages/gstr3b/payment'))
const Computation =  lazy(() => import('../../views/pages/gstr3b/Computation-Of-Tax/computationtax'))

const GSTR3filedPdf  =  lazy(() => import('../../views/pages/gstr3b/GSTR3bfiledpdf'))


// TDS/TCS
const TDSTCS = lazy(() => import('../../views/pages/tdstcs/tdstcs-sales'))
const TDSTCSSummary = lazy(() => import('../../views/pages/tdstcs/tdstcs-summary'))
const TDSTCSDataInvoices = lazy(() => import('../../views/pages/tdstcs/tdstcs-data-invoices'))

const GSTRetrunRoutes = [
  {
    // path: '/gst-returns/gstr2b',
    path: '/gst-returns/gstr2b-summary',
    element: <GSTR2BFolder />
  },

  {
   // path: '/gst-returns/gstr2b-summary-client',
   path : '/gst-returns/gstr2b-summary/gstr2b-data',
    element: <GSTRBSummaryByClientId />
  },

  {
    path: '/gst-returns/gstr2a/invoiceGstr2A',
    element: <PurchaseInvoice2A />,
  },
  {
    path: '/gst-returns/gstr1-sales',
    element: <Gstr1Purchase />,
    children: [
      { path: "", element: <Gstr1SalesSummary/> },
      { path: "gstr1-summary-details", element: <Gstr1PurchaseInvoices /> },
    ],
  },
  {
    path: '/gst-returns/gstr9',
    element: <Gstr9Purchase />,
    children: [
      { path: "", element: <Gstr9Summary/> },
      // { path: "gstr1-summary-details", element: <Gstr1PurchaseInvoices /> },
    ],
  },
  {
    path: '/gst-returns/tdstcs',
    element: <TDSTCS />,
    children: [
      { path: "", element: <TDSTCSSummary/> },
      { path: "tdstcs-summary-details", element: <TDSTCSDataInvoices /> },
    ],
  },
  {
    path: '/gst-returns/gstr9c',
    element: <Gstr9C />,
    children: [
      { path: "", element: <Gstr9Summary/> },
      // { path: "gstr1-summary-details", element: <Gstr1PurchaseInvoices /> },
    ],
  },
  {
    path: '/gst-returns/sales/new-sales-invoice',
    element: <Sales />
  },
  {
    path: '/gst-returns/sales/sales-invoice',
    element: <Sales />
  },
  {
    path: '/gst-returns/iff-sales/new-iff-sales-invoice',
    element: <IffSalesAddInv />
  },
  {
    path: '/gst-returns/iff-sales/iff-sales-invoice',
    element: <IffSalesAddInv />
  },
 
  {
    path: '/gst-returns/gstr3b',
    element: <GSTR3BDetails />
  },
  {
    path: '/gst-returns/gstr3b/payment-page',
    element: <PaymentPage />
    
  },
  {
    path:'/gst-returns/gstr3b/computation-tax',
    element:<Computation />
 },
  {
    path: '/gst-returns/gstr3b/supplies-made',
    element: <SuppliesMade />
  },

  {
    path: '/gst-returns/gstr1/gstr1filed',
    element: <GSTR1filedPdf />,
    meta: {
      layout: 'blank',
      // publicRoute: true,
      // restricted: true
    }
  },

  {
    path: '/gst-returns/gstr3b/gstr3bfiled',
    element: <GSTR3filedPdf />,
    meta: {
      layout: 'blank',
      // publicRoute: true,
      // restricted: true
    }
  },
  {
    path: '/gst-returns/gstr4a/invoiceGstr4A',
    element: <PurchaseInvoice4A />,
  },
]

export default GSTRetrunRoutes