// ** React Imports
import { useState, Fragment, useEffect, useRef, useCallback } from 'react'
import { Link, useLocation, useSearchParams, useNavigate } from 'react-router-dom'

// ** Custom Hooks
import { useSkin } from '@hooks/useSkin'
import Swal from 'sweetalert2'

// ** Icons Imports
import { ChevronLeft, HelpCircle } from 'react-feather'

// ** Custom Components
import InputPassword from '@components/input-password-toggle'
// ** Actions
import { handleLogin } from "@store/authentication";
// ** Utils
import { getHomeRouteForLoggedInUser } from "@utils";

// ** Reactstrap Imports
import { Row, Col, CardTitle, CardText, Form, Label, Button, FormFeedback, Input, Alert, UncontrolledTooltip } from 'reactstrap'

// ** Illustrations Imports
import illustrationsLight from '@src/assets/images/pages/reset-password-v2.svg'
import illustrationsDark from '@src/assets/images/pages/reset-password-v2-dark.svg'

// ** Styles
import '@styles/react/pages/page-authentication.scss'

// ** Third Party Components
import { useForm, Controller } from 'react-hook-form'
import toast from 'react-hot-toast'

// ** API - Service
import registrationService from '../../../services/registrationService'
// ** API - Service
import loginService from "../../../services/loginService";

//** Error Code file
import errorCodeConfig from '../../../configs/apiErrorCodeConfig'

import GenericGSTLogo from '@src/assets/images/logo/powerlogo.png'
import resetLogo from '@src/assets/images/pages/reset-new.jpg'
import * as yup from 'yup'
import { useDispatch } from "react-redux";

const defaultValues = {
  emailOtp: '',
  mobileOtp: '',
}

const RESET_INTERVAL_S = 5;

const RegistrationVerificationCover = () => {
  // ** Hooks
  const { skin } = useSkin()
  const location = useLocation();
  const navigate = useNavigate()
  const dispatch = useDispatch();

  const [btnDisable, setBtnDisable] = useState(false);
  const [block, setBlock] = useState(false)
  const [redirect, setRedirect] = useState(false);
  const [showTimer, setShowTimer] = useState(true)
  const [seconds, setSeconds] = useState(30);
  const [emailshow, setEmailshow] = useState('')

  const [time, setTime] = useState(0);

  const [timer, setTimer] = useState(15);
  const timeOutCallback = useCallback(() => setTimer(currTimer => currTimer - 1), []);


  let emailId = null;
  let mobileNo = null;
  let printMobile = null
  let printEmail = null;
  let userPwd = null;

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm({ defaultValues })


  //** location state
  if (location.state !== null) {
    emailId = location.state.emailId !== null ? location.state.emailId : null;
    mobileNo = location.state.mobileNo !== null ? location.state.mobileNo : null;
    userPwd = location.state.pd !== null ? location.state.pd : null;
    printMobile = mobileNo.slice(0, 2) + mobileNo.slice(2).replace(/.(?=...)/g, '*');
    // printEmail =  obscureEmail(emailId);
    // printEmail = emailId.slice(0, 3) + emailId.slice(2).replace(/.(?=...)/g, '*');
  }

  useEffect(() => {
    const retrunEmail = obscureEmail(emailId);
    printEmail = retrunEmail
    setEmailshow(retrunEmail)
  }, [])

  const source = skin === 'dark' ? illustrationsDark : illustrationsLight
  const timeRemain = RESET_INTERVAL_S - (time % RESET_INTERVAL_S);


  // ** Login
  const loginFunc = () => {
    const loginUser = {
      emailmobile: emailId,
      password: userPwd,
      sourceType: 0
    }

    loginService.loginUser(loginUser).then(resLogin => {
      if (resLogin.status === 200 && resLogin.data.status === errorCodeConfig.APIDefaultCode.Success) {

        const data = {
          ...resLogin.data, accessToken: resLogin?.data?.data?.token, refreshToken: resLogin?.data?.data?.refreshToken !== null &&
            resLogin?.data?.data?.refreshToken !== "" && resLogin?.data?.data?.refreshToken !== undefined ? resLogin?.data?.data?.refreshToken : "", sourceType: resLogin?.data?.data?.sourceType,
          userId: resLogin?.data?.data?.userId, serverDateTime: resLogin?.data?.data?.serverDateTime, rangeFilters: resLogin?.data?.data?.rangeFilters,
          subscriptionId: resLogin?.data?.data?.subscriptionId !== "" && resLogin?.data?.data?.subscriptionId !== null && resLogin?.data?.data?.subscriptionId !== undefined ? resLogin?.data?.data?.subscriptionId : ""
        }

        console.log(data);
        dispatch(handleLogin(data))
        navigate(getHomeRouteForLoggedInUser());
      }
    }).catch(error => {
      //  isErrMsg = true;
      //  message = error.message
      toast.error(error.message, {
        position: "top-right",
      });
    })
  }




  //** Submit
  const onSubmit = data => {
    const users = {
      email: emailId,
      emailCode: data.emailOtp,
      mobileNo: mobileNo,
      otp: data.mobileOtp
    }

    if (Object.values(data).every(field => field.length > 0)) {
      // ** Validate Password
      setBlock(true)
      // ** API - Service
      registrationService.UserRegistationVerification(users).then(res => {
        setBlock(false)
        console.log(res)
        if (res.status === 200 && res.data.status === errorCodeConfig.APIDefaultCode.Success) {
          toast.success(res.data.successMessage, {
            position: "top-right",
          });
          setBtnDisable(true);

          setTimeout(() => {
            loginFunc()
          }, 3000);
        } else {
          Swal.fire({
            icon: 'error',
            title: '',
            text: res.data.errorMessage,
            customClass: {
              confirmButton: 'btn btn-primary'
            },
            buttonsStyling: false
          })
        }
      }).catch(error => {
        setBlock(false)
        Swal.fire({
          icon: 'error',
          title: '',
          text: error?.message,
          customClass: {
            confirmButton: 'btn btn-primary'
          },
          buttonsStyling: false
        })
      })

    } else {
      for (const key in data) {
        if (data[key].length === 0) {
          setError(key, {
            type: 'manual'
          })
        }
      }
    }
  }


  const obscureEmail = email => {
    console.log(email)
    const [name, domain] = email.split("@");
    // console.log(name[0])
    return `${name[0]}${new Array(name.length).join("*")}@${domain}`;
  };


  //** Resend OTP
  const ResendOtpFunc = () => {
    const users = {
      email: emailId !== null && emailId !== '' ? emailId : null,
      mobile: mobileNo !== null && mobileNo !== '' ? mobileNo : null
    }

    registrationService.UserRegistationReSendOTP(users).then(res => {
      console.log(res)
      if (res.status === 200 && res.data.status === errorCodeConfig.APIDefaultCode.Success) {
        setShowTimer(true)
        toast.success(res.data.successMessage, {
          position: "top-right",
        });
        resetTimer();
      } else {
        toast.error(res.data.errorMessage, {
          position: "top-right",
        });
      }
    }).catch(error => {
      Swal.fire({
        icon: 'error',
        title: '',
        text: error?.message,
        customClass: {
          confirmButton: 'btn btn-primary'
        },
        buttonsStyling: false
      });
    })
  }

  //** Rest Timeer
  const resetTimer = function () {
    if (!timer) {
      setTimer(60);
    }
  };

  useEffect(() => {
    if (timer > 0) {
      setTimeout(timeOutCallback, 1000)
    } else {
      setShowTimer(false)
    }
  }, [timer, timeOutCallback, showTimer]);



  return (
    <div>
      {block && <div class="loading1">Loading&#8230;</div>}
      <div className='auth-wrapper auth-cover'>
        <Row className='auth-inner m-0'>
          <Col className='d-none d-lg-flex align-items-center p-5' lg='6' sm='12'>
            <Link className='brand-logo col-lg-6' to='/' onClick={e => e.preventDefault()}>
              <img className='img-fluid col-lg-3 m-auto' src={GenericGSTLogo} alt='power-gst-logo' />
            </Link>
            <div className='col-lg-11 m-auto d-lg-flex align-items-center justify-content-center px-5'>
              <img className='img-fluid' src={resetLogo} alt='Login Cover' />
            </div>
          </Col>
          <Col className='d-flex align-items-center auth-bg px-2 p-lg-5' lg='6' sm='12'>
            <Col className='px-xl-2 mx-auto' sm='8' md='6' lg='8'>


              <Form className='auth-reset-password-form ' onSubmit={!block && handleSubmit(onSubmit)} >
              <CardTitle
                tag="h2"
                className="fw-bolder text-dark mb-1 text-center"
              >
                {/* <img className='img-fluid col-lg-4 m-auto' src={GenericGSTLogo} alt='power-gst-logo' /> */}
                </CardTitle>
                <CardTitle tag='h2' className='fw-bold mb-1 text-center'>
                  Email / Mobile OTP Verification
                </CardTitle>
                <Alert color='success'>
                  <div className='alert-body font-small-2'>
                    <p>
                      <small className='me-50'>
                        <span className='fw-bold'>Email OTP has been sent to your : </span>  <b> {emailshow}</b>
                      </small>
                    </p>
                    <p>
                      <small className='me-50'>
                        <span className='fw-bold'>Mobile OTP has been sent to your :</span> <b>{printMobile}</b>
                      </small>
                    </p>
                  </div>

                </Alert>

                <div className='mb-1'>
                  <Label className='form-label' for='email-Otp'>
                    Email OTP
                  </Label>
                  <Controller
                    id='emailOtp'
                    name='emailOtp'
                    control={control}
                    rules={{
                      required: "Please enter valid email OTP.",
                    }}
                    render={({ field }) => (
                      <Input
                        maxLength={10}
                        autoFocus
                        type='text'
                        placeholder='Email OTP'
                        invalid={errors.emailOtp && true}
                        {...field}
                      // onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))}

                      />
                    )}
                  />
                  {errors.emailOtp && <FormFeedback>{errors.emailOtp.message}</FormFeedback>}
                </div>
                <div className='mb-1'>
                  <Label className='form-label' for='mobile-Otp'>
                    Mobile OTP
                  </Label>
                  <Controller
                    id='mobileOtp'
                    name='mobileOtp'
                    control={control}
                    rules={{
                      required: "Please enter valid mobile OTP.",
                    }}
                    render={({ field }) => (
                      <Input
                        maxLength={10}
                        type='text'
                        placeholder='Mobile OTP'
                        invalid={errors.mobileOtp && true}
                        // onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))}
                        {...field}
                      />
                    )}
                  />
                  {errors.mobileOtp && <FormFeedback>{errors.mobileOtp.message}</FormFeedback>}
                </div>

                <Button color='danger' block disabled={btnDisable} >
                  Validate
                </Button>

                <p className='text-center mt-2'>
                  <span className='me-25'>Didn't get the OTP ? </span>
                  <span>
                    {
                      showTimer ? <span className='text-danger' > {timer >= 10 ? '00:' + timer : '00:' + 0 + timer}   </span> :
                        <span onClick={!block &&  ResendOtpFunc} className='text-danger' style={{ cursor: 'pointer' }} >Resend</span>
                    }
                  </span>
                </p>
                <p className='text-center mt-2'>
                  <Link to='/login'>
                    <ChevronLeft className='rotate-rtl me-25 text-danger' size={14} />
                    <span className='align-middle text-danger'>Back to Login</span>
                  </Link>
                </p>
              </Form>

            </Col>
          </Col>
        </Row>
      </div>
    </div>
    // </UILoader>
  )
}

const formatTime = (time) =>
  `${String(Math.floor(time / 60)).padStart(2, "0")}:${String(
    time % 60
  ).padStart(2, "0")
  } `;

export default RegistrationVerificationCover;
