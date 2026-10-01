// ** React Imports
import { Suspense, lazy, useContext, createContext } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

// ** Redux Imports
import { store } from './redux/store'
import { Provider } from 'react-redux'

// ** Intl, CASL & ThemeColors Context
import { ThemeContext } from './utility/context/ThemeColors'

// ** ThemeConfig
import themeConfig from './configs/themeConfig'

// ** Toast
import { Toaster } from 'react-hot-toast'

// ** i18n
import './configs/i18n'


// ** Ripple Button
import './@core/components/ripple-button'

// ** PrismJS
import 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import 'prismjs/components/prism-jsx.min'

// ** React Perfect Scrollbar
import 'react-perfect-scrollbar/dist/css/styles.css'

// ** React Hot Toast Styles
import '@styles/react/libs/react-hot-toasts/react-hot-toasts.scss'

// ** Core styles
import './@core/assets/fonts/feather/iconfont.css'
import './@core/scss/core.scss'
import './assets/scss/style.scss'
import './assets/scss/handsontable.full.min.css'
import './assets/icon/fontAwesome/font-awesome.min.css'
// ** Service Worker
import * as serviceWorker from './serviceWorker'
import { globleVariable } from './configs/globalVariable';
import { GoogleOAuthProvider } from '@react-oauth/google';
// import { GOOGLE_CLIENT_ID_NEW,GOOGLE_SECRET_KEY_NEW  } from './configs/config'
import ErrorBoundary from './views/errorBoundary/errorBoundary'

// ** Lazy load app
const LazyApp = lazy(() => import('./App'))
const container = document.getElementById('root')
const root = createRoot(container)



root.render(
  <BrowserRouter>
    <Provider store={store}>
      <ErrorBoundary>
        <Suspense fallback={<div className="loading1">Loading&#8230;</div>}>
          <ThemeContext>
            {/* <GoogleOAuthProvider clientId={CLIENT_ID_NEW}> */}
            <LazyApp />
            <Toaster position={themeConfig.layout.toastPosition} toastOptions={{ className: 'react-hot-toast' }} />
            {/* </GoogleOAuthProvider> */}
          </ThemeContext>
        </Suspense>
      </ErrorBoundary>
    </Provider>
  </BrowserRouter>
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
      </ErrorBoundary >
    </Provider >
  </BrowserRouter >
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
