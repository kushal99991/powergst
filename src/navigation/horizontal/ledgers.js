// ** Icons Import
import { Home, Activity, ShoppingCart, File, Book } from 'react-feather'

export default [
    {
        id: 'ledgers',
        title: 'Ledgers',
        icon: <File />,
        children: [
            {
                id: 'cash-ledger',
                title: 'Cash Ledger',
                icon: <Book />,
                navLink: '/ledgers/cash-ledger'
            },
            // {
            //     id: 'liability-ledger',
            //     title: 'Liability Ledger',
            //     icon: <Book />,
            //     navLink: '/ledgers/liability-ledger'
            // },
            {
                id: 'credit-ledger',
                title: 'Credit Ledger',
                icon: <Book />,
                navLink: '/ledgers/credit-ledger'
            },
            {
                id: 'itc-reclaim-ledger',
                title: 'ITC Reclaim Ledger',
                icon: <Book />,
                navLink: '/ledgers/itc-reclaim-ledger'
            }
        ]
    }
]