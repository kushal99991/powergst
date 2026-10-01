// ** React Imports
import { Navigate } from 'react-router-dom'
import { useContext, Suspense } from 'react'

// ** Context Imports
import { AbilityContext } from '@src/utility/context/Can'

// ** Spinner Import
import Spinner from '../spinner/Loading-spinner'

import encryptData from '../../../auth/crypto/crypto'
import { globleVariable } from '../../../configs/globalVariable'
import LocalFunction from '../../../configs/getLocalFunction'
import SessionFunction from '../../../configs/getSessionFunction'


const PrivateRoute = ({ children, route }) => {

  // ** Hooks & Vars
  const ability = useContext(AbilityContext)

  const decrptData = LocalFunction.getLocalValue(globleVariable.userData, true);

  // localStorage.getItem("ud")  !== "" && localStorage.getItem("ud")!== null && localStorage.getItem("ud") !== undefined ?   encryptData.decryptData(localStorage.getItem("ud")) : [];
  // console.log(decrptData)

  const user = decrptData !== null && decrptData !== "" ? JSON.parse(decrptData) : null;

  if (route) {
    let action = null
    let resource = null
    let restrictedRoute = false

    if (route.meta) {
      action = route.meta.action
      resource = route.meta.resource
      restrictedRoute = route.meta.restricted
    }
    if (!user) {
      return <Navigate to='/login' />
    }
    if (user && restrictedRoute) {
      return <Navigate to='/' />
    }
    // if (user && restrictedRoute && user.role === 'client') {
    //   return <Navigate to='/access-control' />
    // }
    // if (user && !ability.can(action || 'read', resource)) {
    //   return <Navigate to='/misc/not-authorized' replace />
    // }
  }

  // return <Suspense fallback={<Spinner className='content-loader' />}>{children}</Suspense>
  return <Suspense fallback={<div className="loading1">Loading&#8230;</div>} >{children}</Suspense>
}

export default PrivateRoute
