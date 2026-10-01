// ** React Imports
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useEffect, useState, useContext } from 'react'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Utils
import { isUserLoggedIn } from '@utils'

// ** Store & Actions
import { useDispatch, useSelector } from 'react-redux'
import { handleLogout } from '@store/authentication'

// ** Store & Actions
import { handleModelOTP, handleModelOTPSend } from '@store/layout'

// ** Third Party Components
import { User, Mail, CheckSquare, MessageSquare, Settings, CreditCard, HelpCircle, Power } from 'react-feather'

// ** Reactstrap Imports
import { UncontrolledDropdown, DropdownMenu, DropdownToggle, DropdownItem, UncontrolledTooltip } from 'reactstrap'

//** Google sign in
import { useGoogleLogout } from 'react-google-login';
// import { GOOGLE_CLIENT_ID, GOOGLE_SECRET_KEY } from '../../../../configs/config'
import { gapi } from 'gapi-script';
import {
  ModelStateContext,
  ModelDispatchContext,
  toggleOTPPopup
} from "../../../../utility/context/ModalContext";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import { globleVariable } from '../../../../configs/globalVariable'
import encryptData from "../../../../auth/crypto/crypto";

// ** Session get and set
import LocalFunction from '../../../../configs/getLocalFunction'
import SessionFunction from '../../../../configs/getSessionFunction'
import { googleLogout } from '@react-oauth/google';
import loginService from '../../../../services/loginService'

const MySwal = withReactContent(Swal)

const UserDropdown = () => {

  // ** Store Vars
  const dispatch = useDispatch()
  const store = useSelector(state => state)

  // ** State
  const [userData, setUserData] = useState(null)
  const navigate = useNavigate()
  const dispatchModal = useContext(ModelDispatchContext);

  //** Google login
  const onLogoutSuccess = (res) => {
    console.log('Logged out Success');
    console.log(res);
  };

  //** Google failure
  const onFailure = () => {
    console.log('Handle failure cases');
  };

  //** ComponentDidMount
  useEffect(() => {
    if (isUserLoggedIn() !== null) {
      const userDatadecrypt = LocalFunction.getLocalValue(globleVariable.userData, true);
      setUserData(JSON.parse(userDatadecrypt))
    }
  }, [])


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


  //** Logout
  const logOut = async () => {
    try {
      const result = await MySwal.fire({
        title: 'Are you sure you want to Logout?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        customClass: {
          confirmButton: 'btn btn-danger',
          cancelButton: 'btn btn-outline-dark ms-1'
        },
        buttonsStyling: false,
        allowOutsideClick: false
      });

      if (result.value) {
        await logOutFunc(); // Ensure logOutFunc is awaited
        // Clear session and local storage
        sessionStorage.removeItem('loginTime');

        // ** with userid & password
        const sourceType = LocalFunction.getLocalValue(globleVariable.sourceType, true);
        console.log(sourceType);

        if (sourceType == "0") {
          localStorage.removeItem(globleVariable.userId);
          sessionStorage.removeItem(globleVariable.isCompany);
          dispatch(handleLogout());
          window.location.href = "/login";
        } else {
          // ** With Gmail
          localStorage.removeItem(globleVariable.RefreshTokenKey);
          sessionStorage.removeItem(globleVariable.isCompany);
          localStorage.removeItem(globleVariable.userId);
          dispatch(handleLogout());
          googleLogout();
          window.location.href = "/login";
        }
      }
    } catch (error) {
      console.error("An error occurred during logout:", error);
    }
  };

  //** Google Client Id & Secret key
  useEffect(() => {
    const initClient = () => {
      gapi.client.init({
        apiKey: import.meta.env.VITE_GOOGLE_SECRET_KEY,
        clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        scope: ''
      });
    };
    gapi.load('client:auth2', initClient);
  })

  //** variable
  const userName = userData && userData?.data['firstName'] !== null && userData?.data['firstName'] !== '' && userData?.data['firstName'] !== undefined ? userData?.data['firstName'] : '';
  const lastName = userData && userData?.data['lastName'] !== null && userData?.data['lastName'] !== '' && userData?.data['lastName'] !== undefined ? userData?.data['lastName'] : '';

  //** Setting Component open
  const profileOpen = () => {
    navigate('/settings')
  }

  useEffect(() => {
    console.log(window.location.pathname, "window.location.pathname")
    if (window?.location?.pathname == "/dashboard/company" || window?.location?.pathname == "/settings") {
      document.getElementById("CompanyTitleDivision")?.classList?.add("d-none");
    }
    else {
      document.getElementById("CompanyTitleDivision")?.classList?.remove("d-none");
    }
  }, [window?.location?.pathname])

  return (
    <UncontrolledDropdown tag='li' className='dropdown-user nav-item'>
      <DropdownToggle href='/' tag='a' className='nav-link dropdown-user-link d-inline-flex' onClick={e => e.preventDefault()}>
        <div className='user-nav'>
          <span className='user-name fw-bold d-block text-end'>{(userName) + (" ") + (lastName)}</span>
        </div>
        <Avatar color='light-danger' className='user-icon-size ms-1' content={userName.toString().toUpperCase()} initials imgHeight='30' imgWidth='40' />

      </DropdownToggle>
      <DropdownMenu end>
        <DropdownItem tag="a" onClick={profileOpen}  >
          <Settings size={14} className='me-75' />
          <span className='align-middle'>Settings</span>
        </DropdownItem>
        {/* <DropdownItem tag='a' onClick={(e) => handleVerifyOTP(e)} >
          <HelpCircle size={14} className='me-75' />
          <span className='align-middle'>Government OTP Verification</span>
        </DropdownItem> */}
        <DropdownItem tag='a' onClick={logOut}>
          <Power size={14} className='me-75' />
          <span id='logout' className='align-middle'>Logout</span>
        </DropdownItem>
        <UncontrolledTooltip placement="top" target="logout">
          Logout [Alt + L]
        </UncontrolledTooltip>
      </DropdownMenu>
    </UncontrolledDropdown>
  )
}

export default UserDropdown
