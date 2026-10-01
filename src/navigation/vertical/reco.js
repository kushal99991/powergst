// ** Icons Import
import { Home, Activity, ShoppingCart, Book, FilePlus } from 'react-feather'

export default [
  {
    id: 'reco',
    title: 'Reconciliation',
    icon: <Activity />,
    children: [
    
      {
        id: 'purchase',
        title: 'Purchase',
        icon: <Book />,
        navLink: '/reconcilation/purchase-summary'
      },
    
      {
        id: 'reco',
        title: 'GSTR 2B vs Purchase',
        icon: <Book />,
        navLink: '/reconcilation/2b-vs-purchase'
      },
      {
        id: 'reco2a',
        title: 'GSTR 2A vs Purchase',
        icon: <Book />,
        navLink: '/selectreco2a'
      },
      {
        id: 'gstr1VSeInvoice',
        title: 'GSTR 1 vs E-Invoice',
        icon: <Book />,
        navLink: '/reconcilation/gstr1-vs-e-invoice'
      },
     
    ]
  }
]
