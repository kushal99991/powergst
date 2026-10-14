import React, {
  Suspense,
  createContext,
  useEffect,
  useMemo,
  useState
} from "react";


// ** Router Import
import Router from "./router/Router";
import Swal from "sweetalert2";
import { useHotkeys } from "react-hotkeys-hook";
import { keysMap } from "./configs/config";
// ** Store & Actions
import { useDispatch, useSelector } from "react-redux";
import { handleLogout } from "@store/authentication";
import { useNavigate, useLocation } from "react-router-dom";
import withReactContent from "sweetalert2-react-content";
import { globleVariable } from './configs/globalVariable';
import LocalFunction from './configs/getLocalFunction'
const MySwal = withReactContent(Swal);
import { googleLogout, GoogleOAuthProvider } from '@react-oauth/google';
import { MsalProvider } from '@azure/msal-react';
import { PublicClientApplication } from "@azure/msal-browser";
import  menuOpenPermission  from '@helper/menuOpenPermission'
import { urlEndpointConfig } from '@configs/urlEndpoint'
import  caching  from '@helper/versionCache'
import SessionTimeoutChecker from "./SessionChecker";
import  loginService  from './services/loginService'

const App = () => {
  // ** Store
  let location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [redirectPage , setRedirect] = useState(false)

  //** Shortcut keys
  useHotkeys(keysMap.LOGOUT, () => logoutShortCut());
  const CLIENT_ID_NEW =  import.meta.env.VITE_GOOGLE_CLIENT_ID_NEW || "demo-google-client-id"

  const pca = useMemo(() => {
    return new PublicClientApplication({
      auth: {
        clientId: import.meta.env.VITE_MICROSOFT_CLIENT_ID || "demo-msal-client-id",
        redirectUri: import.meta.env.VITE_MICROSOFT_REDIRECT_URL || window.location.origin
      },
      system: {
        allowRedirectInIframe: true
      }
    })
  }, []);

  const UserId = LocalFunction.getLocalValue(globleVariable.userId, true);
  const Token =  LocalFunction.getLocalValue(globleVariable.tokenKey , true )

  const logOutFunc = async () => {
    const payLoad = {
      userId: UserId,
      token: Token
    };

    try {
      const res = await loginService.logout(payLoad);
      if (res.status === 200) {
        // Handle successful logout if needed
      } else {
        console.warn(res.data.errorMessage);
      }
    } catch (error) {
      console.warn(error);
    }
  };

// ** redirect dasboard
  const dashboardRedirect = () => {
    if (window.location.pathname !== "/dashboard/company" )
    return MySwal.fire({
      title: "Are you sure you want to go to the dashboard?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      customClass: {
        confirmButton: "btn btn-danger",
        cancelButton: "btn btn-outline-dark ms-1",
      },
      buttonsStyling: false,
      allowOutsideClick: false,
    }).then(function (result) {
      if (result.value) {
        navigate("/dashboard/company")
      }
      })

  }

  // ** Microsoft logout
  function signOutClickHandler(instance) {
   const homeAccountId = sessionStorage.getItem("homeAccoutId")
    const logoutRequest = {
      account: instance.getAccountByHomeId(homeAccountId),
      postLogoutRedirectUri: MICROSOFT_REDIRECT_URL,
    };
    instance.logoutRedirect(logoutRequest);
  }


  //** Logout
  const logoutShortCut = async  () => {
    const sourceType = LocalFunction.getLocalValue(
      globleVariable.sourceType,
      true
    );
    const result = await MySwal.fire({
      title: "Are you sure do you want to Logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      customClass: {
        confirmButton: "btn btn-danger",
        cancelButton: "btn btn-outline-dark ms-1",
      },
      buttonsStyling: false,
      allowOutsideClick: false,
    })
      if (result.value) {
       await logOutFunc()
        sessionStorage.removeItem('loginTime');
        if (sourceType == "0") {
          localStorage.removeItem(globleVariable.userId);
          sessionStorage.removeItem(globleVariable.isCompany);
          dispatch(handleLogout());
          window.location.href = "/login"
        } else {
          localStorage.removeItem(globleVariable.RefreshTokenKey);
          sessionStorage.removeItem(globleVariable.isCompany);
          localStorage.removeItem(globleVariable.userId);

          try {
            signOutClickHandler(pca);
          } catch (e) {
            console.warn("MSAL signout warning", e);
          }
          try {
            googleLogout();
          } catch (e) {
            console.warn("Google logout warning", e);
          }
          dispatch(handleLogout());
          window.location.href = "/login"

          // ** Google login - old code - don't delete this code
          // var auth2 = gapi.auth2.getAuthInstance();
          // auth2.signOut().then(function () {
          //   localStorage.removeItem(globleVariable.userId);
          //   dispatch(handleLogout());
          //   auth2.disconnect();
          //   navigate("/login");
          // });
        }
      }
    // });
  };

  useEffect(()=>{
    console.log(location.pathname,"location");
    if(!location.pathname.includes("/gst-returns/gstr1")  || !location.pathname.includes("/gst-returns/gstr1-sales/gstr1-summary-details")){
      sessionStorage.removeItem("checkReconnectivity")
    }
  },[location])


// ** Registration type wise permission menu
 useEffect(() => {
  const redirectURl = window.location.pathname

  let returnUrl = menuOpenPermission(redirectURl)
  if (returnUrl == true) {
    navigate(urlEndpointConfig.DASHBOARD_COMPANY)
  }
 },[])

 useEffect(() => {
  caching();
 },[])


  return (
    <>
    <GoogleOAuthProvider clientId={CLIENT_ID_NEW}>
     <MsalProvider instance={pca}>
     <Suspense fallback={null}>
     <SessionTimeoutChecker />
        <Router />
      </Suspense>
     </MsalProvider>
     </GoogleOAuthProvider>
    </>
  );
};

export default App;
