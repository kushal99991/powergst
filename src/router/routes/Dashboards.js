import { lazy } from 'react'

const DashboardCompany = lazy(() => import('../../views/dashboard/company'))
const ActionMaster = lazy(() => import('../../views/pages/master/actionmaster'))
const FormMaster = lazy(() => import('../../views/pages/master/formmaster'))
const RoleMaster = lazy(() => import('../../views/pages/master/roleMaster'))

const CardsStatistics = lazy(() => import('../../views/pages/new-dashboard/statistics'))

const DashboardRoutes = [
  {
    path: '/dashboard/company',
    element: <DashboardCompany />,
    meta:{
      menuHidden:true,
      menuType:123
    }
  },
  {
    path: '/master/action',
    element: <ActionMaster />
  },
  {
    path: '/master/form',
    element: <FormMaster />
  },
  {
    path: '/master/role',
    element: <RoleMaster />
  },
  {
    path: '/dashboard',
    element: <CardsStatistics />
  },
]

export default DashboardRoutes
