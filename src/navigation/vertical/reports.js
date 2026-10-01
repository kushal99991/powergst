// ** Icons Import
import { Home, Activity, ShoppingCart, Book, File } from 'react-feather'

export default [
    {
        id: 'reports',
        title: 'Reports',
        icon: <File />,
        children: [
            {
                id: 'gstr1-filed-data',
                title: 'GSTR 1 Filed',
                icon: <Book />,
                navLink: '/reports/gstr1-filed-data?gstr1=1'
            },
            {
                id: 'gstr3b-filed-data',
                title: 'GSTR 3B Filed',
                icon: <Book />,
                navLink: '/reports/gstr3b-filed-data?gstr3b=1'
            },

            {
                id: 'gstr6-filed',
                title: 'GSTR 6 Filed',
                icon: <Book />,
                navLink: '/reports/gstr6-filed-data?gstr6=1'
            },
            {
                id: 'gstr6A-filed-data',
                title: 'GSTR 6A',
                icon: <Book />,
                navLink: '/reports/gstr6a-filed-data?gstr6a=1'
            },
            {
                id: 'itc04-filed-data',
                title: 'ITC 04 Filed',
                icon: <Book />,
                navLink: '/reports/itc04-filed-data?itc04=1'
            },
            {
                id: 'cmp08-filed-data',
                title: 'CMP 08 Filed',
                icon: <Book />,
                navLink: '/reports/cmp08-filed-data?cmp08=1'
            },
            {
                id: 'iff-filed-data',
                title: 'IFF Filed',
                icon: <Book />,
                navLink: '/reports/iff-filed-data?iff=1'
            },
            {
                id: 'GSTR-1-HSN-Summary-Report',
                title: 'GSTR 1 HSN Summary Report',
                icon: <Book />,
                navLink: '/reports/gstr1-hsnSummary-report?.gstr1hsn=1'
            },
            {
                id: 'Sales-HSN-Summary-Report',
                title: 'Sales HSN Summary Report',
                icon: <Book />,
                navLink: '/reports/sales-hsnSummary-report?.saleshsn=1'
            },
            {
                id: 'Purchase-Ratewise-Summary-Report',
                title: 'Purchase Rate Wise Report',
                icon: <Book />,
                navLink: '/reports/purchase-ratewise-report?.purchaserate=1'
            },
            {
                id: 'Sales-Ratewise-Summary-Report',
                title: 'Sales Rate Wise Report',
                icon: <Book />,
                navLink: '/reports/sales-ratewise-report?.salesrate=1'
            },
            {
                id: 'gstr1filed-Ratewise-Report',
                title: 'GSTR 1 Rate Wise Report',
                icon: <Book />,
                navLink: '/reports/gstr1filed-ratewise-report?.gstr1rate=1'
            },
            {
                id: 'gstr3b-2b-books-Report',
                title: 'GSTR 3B VS GSTR 2B VS Books',
                icon: <Book />,
                navLink: '/reports/gstr3b-gstr2b-books?.gstr3b2bbooks=1'
            },
            {
                id: 'gstr3b-2b-books-Report',
                title: 'GSTR 3B VS GSTR 2B VS Books',
                icon: <Book />,
                navLink: '/reports/gstr1-gstr3b-salesreport'
            },
            {
                id: 'gstr9-filed-data',
                title: 'GSTR 9 Filed',
                icon: <Book />,
                navLink: '/reports/gstr9-filed-data?gstr=1'
            },
            {
                id: 'gstr9c-filed-data',
                title: 'GSTR 9C',
                icon: <Book />,
                navLink: '/reports/gstr9c-filed-data?gstr=1'            },
            {
                id: 'gstr3b-2b-purchase-Report',
                title: 'GSTR 3B VS GSTR 2B VS PURCHASE',
                icon: <Book />,
                navLink: '/reports/gstr3b-gstr2b-purchase'
            },
            {
                id: 'pan-gstr3b-gstr1-Report',
                title: 'PAN Based GSTR 3B vs GSTR 1 vs Books',
                icon: <Book />,
                navLink: '/reports/pan-gstr3b-gstr1-books'
            },
        ]
    }
]