import { lazy } from 'react'

// const PurchaseSummary = lazy(() => import('../../views/pages/purchase/purchase-summary'))
// const PurchaseImportView = lazy(() => import('../../views/pages/purchase/import-view-purchase'))
const PurchaseImportViewGSTR1 = lazy(() => import('../../views/pages/gstr1/import-view-gstr1'))
// const PurchaseImportGrid = lazy(() => import('../../views/pages/purchase/Excel-Validate'))
const GSTR1ImportGrid = lazy(() => import('../../views/pages/gstr1/Excel-Validate'))
const GSTR1ImportGridType3 = lazy(() => import('../../views/pages/gstr1/Excel-Validate -single-type3'))
// const Purchases = lazy(() => import('../../views/pages/purchase/purchases'))
// const PurchaseImportGridType3 = lazy(() => import('../../views/pages/purchase/Excel-Validate -single-type3'))
const IffExcelValidation = lazy(() => import('../../views/pages/iif/Excel-Validate'))
const PurchaseImportViewGSTR6 = lazy(() =>  import('../../views/pages/gstr6/import-view-gstr6'))
const IffImportView = lazy(() => import('../../views/pages/iif/import-view-iff'))
const PurchaseImportViewITC04 = lazy(() => import('../../views/pages/itc04/import-view-itc-04'))
const GSTR6ImportGrid = lazy(() => import('../../views/pages/gstr6/Excel-Validate'))
// const AllReports = lazy(() => import('../../views/components/redirect-table-list/index'))
const AllReports = lazy(() => import('../../views/pages/new-dashboard/statistics/view-list/index'))


const RecoRoutes = [
  // {
  //   path: '/reconcilation/purchase-summary',
  //   element: <PurchaseSummary />
  // },

  // {
  //   path: '/purchase/import-data-summary',
  //   element: <PurchaseImportView />
  // },

  {
    path: '/gstr1/import-data-summary',
    element: <PurchaseImportViewGSTR1 />
  },
  {
    path: '/gstr6/import-data-summary',
    element: <PurchaseImportViewGSTR6 />
  },
  {
    path: '/iff/import-data-summary',
    element: <IffImportView />
  },
  {
    path: '/itc-04/import-data-summary',
    element: <PurchaseImportViewITC04 />
  },


  // {
  //   path: '/excel-validation',
  //   element: <PurchaseImportGrid />
  // },
  // {
  //   path: '/excel-validation-purchase-type-3',
  //   element: <PurchaseImportGridType3 />
  // },
  {
    path: '/excel-validation-gstr1',
    element: <GSTR1ImportGrid />
  },
  {
    path: '/excel-validation-gstr1-type3',
    element: <GSTR1ImportGridType3 />
  },
  {
    path: '/excel-validation-iff',
    element: <IffExcelValidation />
  },
  {
    path: '/excel-validation-gstr6',
    element: <GSTR6ImportGrid />
  },
  // {
  //   path: '/reconcilation/purchase/new-purchase-invoice',
  //   element: <Purchases />
  // },

  // {
  //   path: '/reconcilation/purchase/purchase-invoice',
  //   element: <Purchases />
  // },


  {
    path: '/reconcilation',
    element: <AllReports  />,
},

]

export default RecoRoutes