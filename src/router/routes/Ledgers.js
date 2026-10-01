import { lazy } from 'react'

// Ledgers Data Details and imports 
const CashLedger = lazy(() => import('../../views/pages/ledger/cashledger'))
const LiabilityLedger = lazy(() => import('../../views/pages/ledger/liabilityledger'))
const CreditLedger = lazy(() => import('../../views/pages/ledger/creditledger'))
const ITCReclaimLedger = lazy(() => import("../../views/pages/ledger/ITCReclaimLedger"));

const LedgersRoutes = [
   
    {
        path: '/ledgers/cash-ledger',
        element: <CashLedger />
    },
    {
        path: '/ledgers/liability-ledger',
        element: <LiabilityLedger />
    },
    {
        path: '/ledgers/credit-ledger',
        element: <CreditLedger />
    },
    {
        path: '/ledgers/itc-reclaim-ledger',
        element: <ITCReclaimLedger />
    },

]

export default LedgersRoutes