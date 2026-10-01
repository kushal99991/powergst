// ** Icons Import
import { FileText, Circle, Square, UserCheck } from 'react-feather'

export default [
  {
    id: 'pages',
    title: 'Pages',
    icon: <FileText size={20} />,
    children: [
      {
        id: 'accountSettings',
        title: 'Account Settings',
        icon: <Circle size={12} />,
        permissions: ['admin', 'editor'],
        navLink: '/pages/account-settings'
      },
      {
        id: 'profile',
        title: 'Profile',
        icon: <Circle size={12} />,
        navLink: '/profile',
        collapsed: true
      }
    ]
  },
  {
    id: 'authentication',
    title: 'Authentication',
    icon: <UserCheck size={20} />,
    children: [
      {
        id: 'login',
        title: 'Login',
        icon: <Circle size={12} />,
        children: [
          {
            id: 'login-basic',
            title: 'Basic',
            permissions: ['admin', 'editor'],
            navLink: '/pages/login-basic',
            newTab: true
          },
          {
            id: 'login-cover',
            title: 'Cover',
            permissions: ['admin', 'editor'],
            navLink: '/pages/login-cover',
            newTab: true
          }
        ]
      },
      {
        id: 'register',
        title: 'Register',
        icon: <Circle size={12} />,
        children: [
          {
            id: 'register-basic',
            title: 'Basic',
            permissions: ['admin', 'editor'],
            navLink: '/pages/register-basic',
            newTab: true
          },
          {
            id: 'register-cover',
            title: 'Cover',
            permissions: ['admin', 'editor'],
            navLink: '/pages/register-cover',
            newTab: true
          },
          {
            id: 'multi-steps-register',
            title: 'Multi-Steps',
            permissions: ['admin', 'editor'],
            navLink: '/pages/register-multi-steps',
            newTab: true
          }
        ]
      },
      {
        id: 'forgot-password',
        title: 'Forgot Password',
        icon: <Circle size={12} />,
        children: [
          {
            id: 'forgotPassword-basic',
            title: 'Basic',
            permissions: ['admin', 'editor'],
            navLink: '/pages/forgot-password-basic',
            newTab: true
          },
          {
            id: 'forgotPassword-cover',
            title: 'Cover',
            permissions: ['admin', 'editor'],
            navLink: '/forgot-password-cover',
            newTab: true
          }
        ]
      },
      {
        id: 'resetPassword',
        title: 'Reset Password',
        icon: <Circle size={12} />,
        children: [
          {
            id: 'resetPassword-basic',
            title: 'Basic',
            permissions: ['admin', 'editor'],
            navLink: '/pages/reset-password-basic',
            newTab: true
          },
          {
            id: 'resetPassword-cover',
            title: 'Cover',
            permissions: ['admin', 'editor'],
            navLink: '/reset-password-cover',
            newTab: true
          }
        ]
      },
      {
        id: 'verify-email',
        title: 'Verify Email',
        icon: <Circle size={12} />,
        children: [
          {
            id: 'verify-email-basic',
            title: 'Basic',
            permissions: ['admin', 'editor'],
            navLink: '/pages/verify-email-basic',
            newTab: true
          },
          {
            id: 'verify-email-cover',
            title: 'Cover',
            permissions: ['admin', 'editor'],
            navLink: '/pages/verify-email-cover',
            newTab: true
          }
        ]
      },
    ]
  },
  {
    id: 'modal-examples',
    title: 'Modal Examples',
    icon: <Square size={12} />,
    permissions: ['admin', 'editor'],
    navLink: '/pages/modal-examples'
  }
]
