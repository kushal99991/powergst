import useJwt from '@src/@core/auth/jwt/useJwt'

import decryptData from '../auth/crypto/crypto'

import { globleVariable } from '../configs/globalVariable' 
import LocalFunction from '../configs/getLocalFunction'

/**
 * Return if user is logged in
 * This is completely up to you and how you want to store the token in your frontend application
 * e.g. If you are using cookies to store the application please update this function
 */
// eslint-disable-next-line arrow-body-style


const userDataDetail =   LocalFunction.getLocalValue(globleVariable.userData, true);
// localStorage.getItem('ud') !== null && localStorage.getItem('ud') !== ""  ?   decryptData.decryptData(localStorage.getItem('ud')) : []

export const isUserLoggedIn = () => {

  return localStorage.getItem(globleVariable.userData) && localStorage.getItem(useJwt.jwtConfig.storageTokenKeyName)
}

export const getUserData = () => JSON.parse(userDataDetail)

/**
 * This function is used for demo purpose route navigation
 * In real app you won't need this function because your app will navigate to same route for each users regardless of ability
 * Please note role field is just for showing purpose it's not used by anything in frontend
 * We are checking role just for ease
 * NOTE: If you have different pages to navigate based on user ability then this function can be useful. However, you need to update it.
 * @param {String} userRole Role of user
 */
export const getHomeRouteForLoggedInUser = userRole => {
  return '/'
  // if (userRole === 'admin') return '/'
  // if (userRole === 'client') 
  // return { name: 'access-control' }
  // return { name: 'auth-login' }
}

export const refreshTokenSetup = (res) => {
  // Timing to renew access token
  let refreshTiming = (res.tokenObj.expires_in || 3600 - 5 * 60) * 1000;

  const refreshToken = async () => {
    const newAuthRes = await res.reloadAuthResponse();
    refreshTiming = (newAuthRes.expires_in || 3600 - 5 * 60) * 1000;
    console.log('newAuthRes:', newAuthRes);
    // saveUserToken(newAuthRes.access_token);  <-- save new token
    localStorage.setItem('authToken', newAuthRes.id_token);

    // Setup the other timer after the first one
    setTimeout(refreshToken, refreshTiming);
  };

  // Setup first refresh timer
  setTimeout(refreshToken, refreshTiming);
};
