// ** Icons Import
import { Home,  Book } from 'react-feather'

export default [
  {
    id: 'dashboards',
    title: 'Dashboards',
    icon: <Home />,
    children: [
      {
        id: 'home',
        title: `Home`,
        icon: <Book />,
        navLink: '/dashboard'
      },
      {
        id: 'company',
        title: 'Company',
        icon: <Book />,
        navLink: '/dashboard/company'
      }
    ]
  }
]

