// ** React Imports
import { lazy } from 'react'

const Login = lazy(() => import('../../views/pages/authentication/Login'))
const RegisterBasic = lazy(() => import('../../views/pages/authentication/RegisterBasic'))
const ForgotPasswordCover = lazy(() => import('../../views/pages/authentication/ForgotPasswordCover'))
const ResetPasswordCover = lazy(() => import('../../views/pages/authentication/ResetPasswordCover'))
const Registrationverification = lazy(() => import('../../views/pages/authentication/NewRegisrationVerificationOtp'))
const TermsandCondition = lazy(() => import('../../views/pages/terms-policy/termsandcondition'))
const PrivacyPolicy = lazy(() => import('../../views/pages/terms-policy/privacypolicy'))
const HomeDashboard = lazy(() => import('../../views/pages/authentication/HomeScreen'))

const AuthenticationRoutes = [
  {
    path: '/login',
    element: <Login />,
    meta: {
      layout: 'blank',
      publicRoute: true,
      restricted: true
    }
  },
  {
    path: '/register',
    element: <RegisterBasic />,
    meta: {
      layout: 'blank',
      publicRoute: true,
      restricted: true
    }
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordCover />,
    meta: {
      layout: 'blank',
      publicRoute: true,
      restricted: true
    }
  },
  {
    path: '/reset-password',
    element: <ResetPasswordCover />,
    meta: {
      layout: 'blank',
      publicRoute: true,
      restricted: true
    }
  },
  {
    path: '/registration-verification',
    element: <Registrationverification />,
    meta: {
      layout: 'blank',
      publicRoute: true,
      restricted: true
    }
  },
  {
    path: '/terms',
    element: <TermsandCondition />,
    meta: {
      layout: 'blank',
      publicRoute: true,
      // restricted: true
    }
  },
  {
    path: '/privacy',
    element: <PrivacyPolicy />,
    meta: {
      layout: 'blank',
      publicRoute: true,
      // restricted: true
    }
  },
  {
    path: '/index',
    element: <HomeDashboard />,
    meta: {
      layout: 'blank',
      publicRoute: true,
      restricted: true
    }
  },

]

export default AuthenticationRoutes
