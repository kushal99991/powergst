import { lazy } from 'react'
import { Navigate } from 'react-router-dom'

const Error = lazy(() => import('../../views/pages/misc/Error'))
const ComingSoon = lazy(() => import('../../views/pages/misc/ComingSoon'))
const Maintenance = lazy(() => import('../../views/pages/misc/Maintenance'))
const NotAuthorized = lazy(() => import('../../views/pages/misc/NotAuthorized'))
const NewCompanyAdd = lazy(() => import('../../views/pages/company-add'))
const VerifyOTP = lazy(() => import('../../views/pages/verification-otp'))
const Profile = lazy(() => import('../../views/pages/profile'))
// const ProfileVerticalTabs = lazy(() => import('../../views/pages/profile/profile-tabs'))
const ProfileVerticalTabs = lazy(() => import('../../views/pages/profile/index'))

const PagesRoutes = [

  {
    path: '/dashboard/company/add',
    element: <NewCompanyAdd />
  },

  {
    path: '/dashboard/company/edit',
    element: <NewCompanyAdd />
  },

  {
    path: '/pages/verify-otp',
    element: <VerifyOTP />
  },
  {
    path: '/settings',
   element: <ProfileVerticalTabs />
  },
 
  {
    path: '/misc/coming-soon',
    element: <ComingSoon />,
    meta: {
      publicRoute: true,
      layout: 'blank'
    }
  },
  {
    path: '/misc/not-authorized',
    element: <NotAuthorized />,
    meta: {
      publicRoute: true,
      layout: 'blank'
    }
  },
  {
    path: '/misc/maintenance',
    element: <Maintenance />,
    meta: {
      publicRoute: true,
      layout: 'blank'
    }
  },
  {
    path: '/misc/error',
    element: <Error />,
    meta: {
      publicRoute: true,
      layout: 'blank'
    }
  }
]

export default PagesRoutes
