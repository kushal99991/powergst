// ** Icons Import
import {
  Key,
  User,
  File,
  Unlock,
  Circle,
  FileText,
  Settings,
  HelpCircle
} from 'react-feather'

export default [
  {
    id: 'pages',
    title: 'Pages',
    icon: <FileText />,
    children: [
      {
        id: 'authentication',
        title: 'Authentication',
        icon: <Unlock />,
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
                navLink: '/forgot-password',
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
                navLink: '/reset-password',
                newTab: true
              }
            ]
          },
          {
            id: 'verify-email',
            title: 'Reset Password',
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
          }
        ]
      },
      {
        id: 'accountSettings',
        title: 'Account Settings',
        icon: <Settings />,
        navLink: '/pages/account-settings'
      },
      {
        id: 'profile',
        title: 'Profile',
        icon: <User />,
        navLink: '/profile',
        collapsed: true
      },
      {
        id: 'faq',
        title: 'FAQ',
        icon: <HelpCircle />,
        navLink: '/pages/faq'
      },
      {
        id: 'license',
        title: 'License',
        icon: <FileText />,
        permissions: ['admin', 'editor'],
        navLink: '/pages/license'
      },
      {
        id: 'api-key',
        title: 'API Key',
        icon: <Key />,
        permissions: ['admin', 'editor'],
        navLink: '/pages/api-key'
      },

      {
        id: 'miscellaneous',
        title: 'Miscellaneous',
        icon: <File />,
        children: [
          {
            id: 'comingSoon',
            title: 'Coming Soon',
            icon: <Circle />,
            navLink: '/misc/coming-soon',
            newTab: true
          },

          {
            id: 'notAuthorized',
            title: 'Not Authorized',
            icon: <Circle />,
            navLink: '/misc/not-authorized',
            newTab: true
          },
          {
            id: 'maintenance',
            title: 'Maintenance',
            icon: <Circle />,
            navLink: '/misc/maintenance',
            newTab: true
          },
          {
            id: 'error',
            title: 'Error',
            icon: <Circle />,
            navLink: '/misc/error',
            newTab: true
          }
        ]
      }
    ]
  }
]
