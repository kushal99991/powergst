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
        id: 'recopan',
        title: 'PAN Based GSTR 2B vs Purchase',
        icon: <Book />,
        navLink: '/reconcilation/pan-2b-vs-purchase'
      },
     
      {
        id: 'gstr1VSeInvoice',
        title: 'GSTR 1 vs E-Invoice',
        icon: <Book />,
        navLink: '/reconcilation/gstr1-vs-e-invoice'
      },

      {
        id: 'reco2a',
        title: 'GSTR 2A vs Purchase',
        icon: <Book />,
        navLink: '/reconcilation/2a-vs-purchase'
      },
      {
        id: 'recopan2A',
        title: 'PAN Based GSTR 2A vs Purchase',
        icon: <Book />,
        navLink: '/reconcilation/pan-2a-vs-purchase'
      },

    ]
  }
]
