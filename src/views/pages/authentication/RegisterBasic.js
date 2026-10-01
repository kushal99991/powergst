// ** React Imports
import { Link, useNavigate, useLocation } from 'react-router-dom'

// ** Icons Imports
import { RefreshCw } from 'react-feather'
import Swal from 'sweetalert2'

// ** Custom Components
import InputPasswordToggle from '@components/input-password-toggle'

import UILoader from './../../../@core/components/ui-loader'
import Spinner from './../../../@core/components/spinner/Loading-spinner'

// ** Reactstrap Imports
import { Card, CardBody, CardTitle, CardText, Form, Label, Input, Button, CardHeader, Row, Col, FormFeedback, CardSubtitle } from 'reactstrap'

// ** Styles
import '@styles/react/pages/page-authentication.scss'

// ** Utils
import { getHomeRouteForLoggedInUser } from '@utils'

import GenericGSTLogo from '@src/assets/images/logo/powerlogo.png'
import logo from '@src/assets/images/pages/4.png'
import Select, { components } from 'react-select'
//**  react captch
import { useEffect, Fragment, useState } from 'react'

// ** Third Party Components
import { useForm, Controller, set } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'

// ** Model
import Registration from '../../../model/registration'

// ** API - Service
import userRegistrationService from '../../../services/registrationService'
import loginService from '../../../services/loginService'

// ** Actions
import { handleLogin } from '@store/authentication'

//** Error Code file
import errorCodeConfig from '../../../configs/apiErrorCodeConfig'
import { useRef } from 'react'

// ** captcha
import { CaptchaEnginge, CanvasTemplate, validateCaptcha } from '../../components/captcha/captcha';

//** Google sign in
// import GoogleLogin from 'react-google-login'
import { SECRET_PARAMETER} from '../../../configs/config'
import { gapi } from 'gapi-script';
import moment from 'moment/moment'

// ** Encrypt & Decrypt file
import encryptData from '../../../auth/crypto/crypto'

// ** Session get and set
import { globleVariable } from '../../../configs/globalVariable';
import LocalFunction from '../../../configs/getLocalFunction'
import { messageShowDuration,navigateTimeOut } from '@configs/config'
import SessionFunction from '../../../configs/getSessionFunction'
import axios from 'axios'

// import { GoogleLogin } from '@react-oauth/google';
// import { GoogleOAuthProvider } from '@react-oauth/google';
// ** React Imports
import classnames from "classnames";
import { useGoogleLogin, hasGrantedAllScopesGoogle } from '@react-oauth/google';
import { selectThemeColors } from '@utils'
import makeAnimated from 'react-select/animated'
const animatedComponents = makeAnimated()
import { MsalAuthenticationTemplate, useMsal } from '@azure/msal-react';
import {   handleKeyPressPass, handleKeyPressText, handlePasteText } from '../../../helper/validation'

const defaultValues = {
  companyName: '',
  firstName: '',
  lastName: '',
  email: '',
  phoneNo: '',
  password: '',
  confirmPassword: '',
  referredBy: '',
  captch: '',
  FkCategoryId: '',
  MemberShipNumber: '',
}

const RegisterBasic = () => {

  const { instance, accounts, loginRedirect } = useMsal();

  const [categoryOptions, setCategoryOptions] = useState([])

  const location = useLocation();
  const loginDate = moment(new Date()).format("hh:mm:ss");
  const [block, setBlock] = useState(false)
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const refCaptch = useRef(null);
  const [submitBtn, setSubmitbtn] = useState(false);
  const [profile, setProfile] = useState([]);
  const [signWithReg, setSignWithReg] = useState(false);
  const [titleMsg, setTitleMsg] = useState('Create your account');
  const [CategoryType , setCategoryType]  = useState(false);

  let SignValueRef = false;
  let sourceTypeRef = 0; // false
  let checkAccount = null;

  const emailExist =  LocalFunction.getLocalValue(globleVariable.emailExists, false)



  //** Location state
  if (location.state !== null) {
    checkAccount = location?.state?.checkAccount !== null ? location?.state?.checkAccount : null;
  }

  //** React-hook-form
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors },
    setValue,
    setFocus,
    getValues,
    clearErrors,
    trigger,
  } = useForm({ defaultValues })


  useEffect(() => {
    CaptchaEnginge(6)
    if (emailExist === "notSet") {

     const uEmail = LocalFunction.getLocalValue(globleVariable.userEmail, true);
     const uMobile = LocalFunction.getLocalValue(globleVariable.userMobile, true);

      setValue('email',  uEmail)  // user email
      setTitleMsg('Account does not exist, please sign up')
    }

    return () => setBlock(false)
  }, [])


  //** Google Login
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


  //** Validation string trim
  const ValidateString = (data) => {
    if (data == undefined || data == "" || data.trim().length == 0) {
      return false;
    }
    else {
      return true;
    }
  }


  //** Submit
  const onSubmit = data => {

    let isValid = true;
    let message = "";
    let isErrMsg = false;

    // ** Restricted Password Validate
    if (SignValueRef == false) {
      const restrictPassword = PasswordRestrictionValidate("password")
      if (restrictPassword == false) {
        setError("password", {
          type: 'manual',
          message: "Password must have at least 8 characters include at least 1 lowercase character, 1 uppercase character, 1 number and 1 special character.",
          required: true
        })
        setValue('captch', '');
        CaptchaOnChange();
        return false;
      }


       //** Valid Captch
       const ValidCaptch = validateCaptcha(data.captch);
       //** Match password

       if (ValidCaptch === false) {
         isValid = false;
        //  message = "Captcha do not match."
        message = "Invalid Captcha"
        setError("captch", {
          type: 'manual',
          message: message,
          required: true
        })
        setFocus("captch");

      }

      const password = getValues("password");
      const confirmPasword = getValues("confirmPassword")
      if (password !== confirmPasword) {
        setError("confirmPassword", { message: "Passwords do not match.", required: true })
        isValid = false;
      } else {
        clearErrors("confirmPassword")
      }

    }


    if (sourceTypeRef == 0) {
      if (!ValidateString(data.companyName)) {
        setError('companyName', { type: 'manual', message: 'Please enter company/firm name.' })
        isValid = false;
      }

    const category1 = getValues("FkCategoryId");

    if ((category1?.value == 2 || category1.value == 3 || category1.value == 4) && !ValidateString(data.MemberShipNumber) && sourceTypeRef == 0) {

      setError("MemberShipNumber", {
        type: "manual",
        message: "Please Enter Membership Number",
        required: true,
      });
      isValid = false;
    }

    }

    if (isValid === true) {
      let encryptPassword = encryptData.encrypt(data.password + SECRET_PARAMETER + loginDate);
      const userData = new Registration(
        "0",
        data.firstName,
        data.lastName,
        data.email,
        data.phoneNo,
        encryptPassword,
        8,
        data.referredBy,
        sourceTypeRef,
        "0",
        data.companyName !== "" && data.companyName !== null && data.companyName !== undefined ? data.companyName : "",
        null,
        data.FkCategoryId?.value,
        data.MemberShipNumber
      );

      const userEmailId = userData.email;
      console.log(userData)
      const  entrptNewRegistrationPayload = {
        data : encryptData.encrypt(JSON.stringify(userData))
       }


      setBlock(true)
      // userRegistrationService.UserRegistation(userData).then(res => {
      userRegistrationService.UserRegistation(entrptNewRegistrationPayload).then(res => {
        setBlock(false)
        const newRegistrationDecptyData = encryptData.decrypt((res?.data?.data));
        const parsedNewRegistrationData = JSON.parse(newRegistrationDecptyData)
        console.log(parsedNewRegistrationData,"loginDecptyData")
        if (res.status === 200 && parsedNewRegistrationData.status === errorCodeConfig.APIDefaultCode.Success) {
          console.log("SignValueRefSignValueRef", SignValueRef, res)
          if (SignValueRef == true) {
            //   navigate(getHomeRouteForLoggedInUser());
            console.log("SignValueRefSignValueRef-1")
            loginFunc(userEmailId)

          } else {
            console.log("SignValueRefSignValueRef-2")
            // ** User Password
            message = parsedNewRegistrationData?.successMessage
            toast.success(message, {
              position: "top-right", duration: messageShowDuration
            });


            setTimeout(() => {
              navigate('/registration-verification', { state: { emailId: userData.email, mobileNo: userData.mobile, pd: encryptPassword, sourceType: sourceTypeRef, userIds: parsedNewRegistrationData?.data, IsMailVerify: false, FkCategoryId: userData.categoryId } });
            }, navigateTimeOut);



          }
        } 
        else if (res.status === 200 && parsedNewRegistrationData?.status === errorCodeConfig.APIDefaultCode.EmailVerificationPending) {


          message = parsedNewRegistrationData?.errorMessage
          toast.error(message, {
            position: "top-right", duration: messageShowDuration
          });

          setTimeout(() => {
            navigate('/registration-verification', { state: { emailId: userData.email, mobileNo: userData.mobile, pd: encryptPassword, sourceType: sourceTypeRef, userIds: parsedNewRegistrationData?.data, IsMailVerify: false, FkCategoryId: userData.categoryId } });

          }, navigateTimeOut);



        }
         else if (res.status === 200 && parsedNewRegistrationData.status === errorCodeConfig.APIDefaultCode.MobileVerificationPending) {

          navigate('/registration-verification', { state: { emailId: userData.email, mobileNo: userData.mobile , pd : encryptPassword, sourceType: sourceTypeRef, userIds: parsedNewRegistrationData?.data, IsMailVerify: true , FkCategoryId: userData.categoryId   } });
        }
         else {
          if (SignValueRef == true) {
            console.log("SignValueRefSignValueRef-3")
            if (res.status === 200 && parsedNewRegistrationData.status === errorCodeConfig.APIUserModuleRegistrationErrorCode.EmailAlreadyExists) {
              console.log("SignValueRefSignValueRef-4")
              loginFunc(userEmailId)
            } else {
              isErrMsg = true;
              if (res.status === 500) {
                message = parsedNewRegistrationData?.ErrorMessage
                toast.error(message, {
                  position: "top-right", duration: messageShowDuration
                });
              } else {
                message = parsedNewRegistrationData.errorMessage.toLowerCase();
                toast.error(message, {
                  position: "top-right", duration: messageShowDuration
                });
              }
            }
          } else {
            isErrMsg = true;
            message = parsedNewRegistrationData.errorMessage
            toast.error(message, {
              position: "top-right", duration: messageShowDuration
            });
          }
        }
      }).catch(error => {
        setBlock(false)
        isErrMsg = true;
        message = error.message
      })
    } else {

      isErrMsg = true;
      message = message
    }

    if (isErrMsg == true) {
      // toast.error(message, {
      //   position: "top-right",
      // });
    }

    setValue('captch', '');
    CaptchaOnChange();
  }


  const loginFunc  = (userEmailId) => {

    const loginUser = {
      emailmobile: userEmailId,
      password: "",
      sourceType: sourceTypeRef
    }

    const  entrptPayload = {
      data : encryptData.encrypt(JSON.stringify(loginUser))
     }

    loginService.loginUser(entrptPayload).then(resLogin => {
      const loginDecptyData = encryptData.decrypt((resLogin?.data?.data));
      const parsedLoginData = JSON.parse(loginDecptyData)
      console.log(parsedLoginData,"loginDecptyData")

      if (resLogin.status === 200 && parsedLoginData.status === errorCodeConfig.APIDefaultCode.Success) {
        console.log('inn log')
        console.log(resLogin.data.data.sourceType)
      //  const data = { ...resLogin.data, accessToken: null, refreshToken: null, sourceType: resLogin.data.data.sourceType, userId: resLogin.data.data.userId }
      const data = {
        ...parsedLoginData, accessToken:  parsedLoginData?.data?.token , refreshToken: resLogin?.data?.data?.refreshToken !== null &&
        resLogin?.data?.data?.refreshToken !== "" && resLogin?.data?.data?.refreshToken !== undefined ? resLogin?.data?.data?.refreshToken : "" , sourceType: parsedLoginData?.data?.sourceType,
        userId: parsedLoginData?.data?.userId, serverDateTime: parsedLoginData?.data?.serverDateTime, rangeFilters: parsedLoginData?.data?.rangeFiltersITC04,
        subscriptionId: parsedLoginData?.data?.subscriptionId !== "" &&
        parsedLoginData?.data?.subscriptionId !== null &&
        parsedLoginData?.data?.subscriptionId !== undefined
            ? parsedLoginData?.data?.subscriptionId
            : "",
      }

        console.log(data);
        dispatch(handleLogin(data))
        navigate(getHomeRouteForLoggedInUser());
      } else if (parsedLoginData?.status ===
        errorCodeConfig.APIUserModuleLoginErrorCode.EmailVerificationPending) {
        message = parsedLoginData?.errorMessage
        toast.error(message, {
          position: "top-right", duration: messageShowDuration
        });
        setTimeout(() => {
          navigate("/registration-verification", {
            state: {
              emailId: loginUser.emailmobile,
              mobileNo: "",
              pd: "",
              IsMailVerify: false,
              sourceType: loginUser.sourceType, userIds: parsedLoginData?.data?.userId
            },
          });
        }, navigateTimeOut);

      } else if (parsedLoginData?.status ===
        errorCodeConfig.APIUserModuleLoginErrorCode.MobileVerificationPending) {
        message = parsedLoginData?.errorMessage
        toast.error(message, {
          position: "top-right", duration: messageShowDuration
        });
        setTimeout(() => {
          navigate("/registration-verification", {
            state: {
              emailId: loginUser.emailmobile,
              mobileNo: "",
              pd: "",
              IsMailVerify: true,
              sourceType: loginUser.sourceType, userIds: parsedLoginData?.data?.userId
            },
          });
        }, navigateTimeOut);
      }
    }).catch(error => {
      //  isErrMsg = true;
      //  message = error.message
      toast.error(error.message, {
        position: "top-right", duration: messageShowDuration
      });
    })
  }



  // ** Validate Password
  const ValidatePassword = () => {
    const password = getValues("password");
    const confirmPasword = getValues("confirmPassword")
    if (password !== confirmPasword) {
      setError("confirmPassword", { message: "Passwords do not match.", required: true })
      return
    } else {
      clearErrors("confirmPassword")
    }
  }

  // ** OnBlur Event mail
  const userAccountCheck = (data) => {
    console.log(data);
    if (data !== null && data !== "") {
      // ^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$"
      const mailVaiid = new RegExp("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$");
      const loginEmail = getValues("email");
      var result = mailVaiid.test(loginEmail);
      if (result == false) {
        setError('email', { type: 'manual', message: "Please enter valid email.", required: true })
        return false;
      } else {
        clearErrors("email")
      }

      //   if (checkAccount !== null) {
      const users = {
        EmailMobile: data
      }
      setBlock(true)
      loginService.CheckAccountUser(users).then(res => {
        console.log(res);

        setBlock(false)
        if (res.status === 200 && res.data.status === errorCodeConfig.APIDefaultCode.Success) {
          // Account exits

          LocalFunction.setLocalValue(globleVariable.userEmail, data, true);
          LocalFunction.setLocalValue(globleVariable.emailExists, 'yesSet', false);

          // localStorage.setItem('ueid', data)
          // localStorage.setItem('emailExists', "yesSet")
          navigate('/login');
        }
        setBlock(true)
        loginService.CheckAccountUser(users).then(res => {
          console.log(res);

          setBlock(false)
          if (res.status === 200 && res.data.status === errorCodeConfig.APIDefaultCode.Success) {
            // Account exits

            LocalFunction.setLocalValue(globleVariable.userEmail, data, true);
            LocalFunction.setLocalValue(globleVariable.emailExists, 'yesSet', false);

            // localStorage.setItem('ueid', data)
            // localStorage.setItem('emailExists', "yesSet")
            navigate('/login');
          }
        }).catch(error => {
          setBlock(false)
          toast.error(error.message, {
            position: "top-right",duration: messageShowDuration
          });
        })
      })
    }
  }


  const Loader = () => {
    return (
      <Fragment>
        <Spinner />
        <CardText className='mb-0 mt-1 text-white'>Please Wait...</CardText>
      </Fragment>
    )
  }

  //** Captcha OnChange
  const CaptchaOnChange = () => {
    CaptchaEnginge(6)
  }

  //** Password Restriction Validate
  const PasswordRestrictionValidate = (colValue) => {
    console.log('validation')
    const regix = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$');
    const setPassword = getValues(colValue);
    var result = regix.test(setPassword);

    if (result === false) {
      return false
    } else {
      return true
    }
  }

  //** Google login then api call
  // const onSuccess = (res) => {
  //   console.log('google sign')
  //   console.log(res);
  //   setSignWithReg(() => setSignWithReg(true));
  //   setProfile(res.profileObj);
  //   refreshTokenSetup(res);
  //   SignValueRef = true;
  //   sourceTypeRef = 1; // true
  //   defaultValues.email = res.profileObj.email;
  //   defaultValues.companyName = res.profileObj.firmName;
  //   defaultValues.firstName = res.profileObj.givenName;
  //   defaultValues.lastName = res.profileObj.familyName;

  //   onSubmit(defaultValues);
  // };


  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log(tokenResponse);
      const userInfo = await axios.get(
        import.meta.env.VITE_GOOGLE_URL,
        { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } },
      );

      console.log(userInfo);
        if (userInfo)  {

          onSuccessFunc(userInfo.data)
        }
    },
    onError: errorResponse => console.log(errorResponse),
  });


  const onSuccessFunc = (credentialResponse) => {
    console.log('google sign')
      SignValueRef = true;
      sourceTypeRef = 1; // true
      defaultValues.email = credentialResponse.email;
      defaultValues.companyName= '';
      defaultValues.firstName = credentialResponse.given_name;
      defaultValues.lastName = credentialResponse.family_name;
      onSubmit(defaultValues);

   };


  //** Google failure
  const onFailure = (err) => {
    console.log('error')
    console.log(err);
  };

  //** Check integer function
  function isInteger(value) {
    const num = value.trim();
    return !(value.match(/\s/g) || num == "" || isNaN(num) || (typeof (value) == 'number'))
  }

  //** Mobile no validation
  const mobileValidation = (data) => {
    if (data !== null) {
      if (isInteger(data) == true) {
        if (data.length !== 10) {
          setValue("phoneNo", "");
          setError('phoneNo', { type: 'manual', message: "Please enter valid mobile number.", required: true })
          return false;
        } else {
          clearErrors("phoneNo")
        }
      }
    } else {
      setError('phoneNo', { type: 'manual', message: "Please enter valid mobile number.", required: true })
    }
  }

  //** get CategoryMaster

  useEffect(() => {
    GetCategoryMasterList();
  },[])

  const GetCategoryMasterList = () => {
    userRegistrationService.GetCategoryMaster().then(res => {

      if (res.status == 200 ) {
        const fromOptions = res.data?.data?.map((v, index) => {
          return {
            label: v.text,
            value: v.value,
            key: index,
          };
        });
        setCategoryOptions(fromOptions)
      }
    })
  }


  // ** microsoft login

  const microsoftLogin = () => {
    instance
      .handleRedirectPromise()
      .then(async (tokenResponse) => {
        try {

          if (tokenResponse === null) {
            // If the tokenResponse === null, you are not coming back from an auth redirect.

            const loginResponse = await instance.loginPopup();

            if (loginResponse.account.name !== null && loginResponse.account.name !== "" &&
            loginResponse.account.name !== undefined) {
              const [before, after] = loginResponse.account.name?.split(' ')
              defaultValues.firstName = before;
            } else {
              defaultValues.firstName = loginResponse.account.username.split('@')[0]
            }

            setSignWithReg(() => setSignWithReg(true));
            SignValueRef = true;

            sourceTypeRef = 1; // true
            defaultValues.email = loginResponse.account.username;

            if (loginResponse.account.name !== null && loginResponse.account.name !== "" &&
            loginResponse.account.name !== undefined) {
              defaultValues.firstName = before;
              defaultValues.lastName = before;
              defaultValues.companyName = after;
            } else {
              defaultValues.firstName = loginResponse.account.username.split('@')[0];
              defaultValues.lastName = loginResponse.account.username.split('@')[0];
              defaultValues.companyName = null
            }

            onSubmit(defaultValues);

          } else {
            // If the tokenResponse !== null, then you are coming back from a successful authentication redirect.
          }
        } catch (error) {
          console.log("error microsoft", error);
        }

      })
      .catch((error) => {
        // handle error, either in the library or coming back from the server
      });
  };

  return (
    <div>
      {block && <div className="loading1">Loading&#8230;</div>}

      <div className='auth-wrapper auth-basic px-2 row'>
        <div className=' col-lg-7'>
          <Card className='mb-12'>
            <div className='col-lg-2 m-auto'>
              <img className='img-fluid' src={GenericGSTLogo} alt='power-gst-logo' />
            </div>
            <div className='px-2'>
              <div className='text-center'>
                <div className='demo-inline-spacing'>
                </div>
                <CardTitle tag='h2' className='fw-bolder text-dark mb-0 text-center'>
                  Registration
                </CardTitle>
                {/* <CardSubtitle
                  className="mb-2 text-muted"
                  tag="h4">
                  {titleMsg}
                </CardSubtitle> */}
              </div>
              <Form className='auth-register-form' autoComplete='off' onSubmit={!block && handleSubmit(onSubmit)}>
                <div className='row'>
                  <div className='demo-inline-spacing mb-2'>
                  </div>
                  <div className='col-lg-6 label-line-height mb-1'>
                    <Label className='form-label requiredlable' for='first-Name'>
                      First Name
                    </Label>
                    <Controller
                      id='firstName'
                      name='firstName'
                      control={control}
                      rules={{
                        required: "Please enter first name.",
                        maxLength: 100,
                      }}
                      render={({ field }) => (
                        <Input
                        autoFocus
                          maxLength={100}
                          type='text'
                          placeholder='First Name'
                          invalid={errors?.firstName?.message && true}
                          {...field}
                          onKeyPress={(e) => handleKeyPressPass(e, setError,'firstName','firstName','space')}
                          onPaste={(e) => handlePasteText(e, setError,'firstName','firstName','space')}

                        />
                      )}
                    />
                    {errors.firstName && <FormFeedback>{errors.firstName.message}</FormFeedback>}
                  </div>
                  <div className=' col-lg-6 label-line-height mb-1'>
                    <Label className='form-label requiredlable' for='last-Name'>
                      Last Name
                    </Label>
                    <Controller
                      id='lastName'
                      name='lastName'
                      control={control}
                      rules={{
                        required: "Please enter last name.",
                        maxLength: 100
                      }}
                      render={({ field }) => (
                        <Input
                          maxLength={100}
                          type='text'
                          placeholder='Last Name'
                          invalid={errors?.lastName?.message && true}
                          {...field}
                          onKeyPress={(e) => handleKeyPressPass(e, setError,'lastName','lastName','space')}
                          onPaste={(e) => handlePasteText(e, setError,'lastName','lastName','space')}
                          
                          onChange={(e) => field.onChange(e.target.value.replace(/\s/g, ""))}
                        />
                      )}
                    />
                    {errors.lastName && <FormFeedback>{errors.lastName.message}</FormFeedback>}
                  </div>


                  <div className=' col-lg-6 label-line-height mb-1'>
                    <Label className='form-label requiredlable' for='email-id'>
                      Email Id
                    </Label>
                    <Controller
                      id='email'
                      name='email'
                      control={control}
                      rules={{
                        required: "Please enter valid email.",
                        pattern: {
                          value: /^(?!.*yopmail)[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Please enter valid email."
                        }
                      }}
                      render={({ field }) => (
                        <Input
                          maxLength={100}
                          placeholder='Email'
                          invalid={errors?.email?.message && true}
                          {...field}
                          onBlur={(e) => userAccountCheck(e.target.value)}
                          onPaste={(e) => handlePasteText(e, setError,'email','email','email')}
                          onKeyPress={(e) => handleKeyPressText(e, setError,'email')}
                        />
                      )}
                    />
                    {errors.email && <FormFeedback>{errors.email.message}</FormFeedback>}
                  </div>

                  <div className='col-lg-6 label-line-height mb-1'>
                    <Label className='form-label requiredlable' for='company-Name'>
                      Company / Firm Name
                    </Label>
                    <Controller
                      id='companyName'
                      name='companyName'

                      control={control}
                      rules={{
                        required: SignValueRef == false && "Please enter company / firm name.",
                        maxLength: 100,
                      }}
                      render={({ field }) => (
                        <Input
                          maxLength={100}
                          type='text'
                          placeholder='Company / Firm Name'
                          invalid={errors?.companyName?.message && true}
                          {...field}
                        // onChange={(e) => field.onChange(e.target.value.replace(/\s/g, ""))}
                          onKeyPress={(e) => handleKeyPressPass(e, setError,'companyName','companyName','allowSpace')}
                          onPaste={(e) => handlePasteText(e, setError,'companyName','companyName','allowSpace')}
                        />
                      )}
                    />
                    {errors.companyName && <FormFeedback>{errors.companyName.message}</FormFeedback>}
                  </div>

                  {/* <div className=' col-lg-6 label-line-height mb-1'>
                    <Label className='form-label requiredlable' for='phone-No'>
                      Mobile No
                    </Label>
                    <Controller
                      id='phoneNo'
                      name='phoneNo'
                      control={control}
                      rules={{
                        required: "Please enter valid mobile no.",
                        maxLength: 10
                      }}
                      render={({ field }) => (
                        <Input
                          type="text"
                          placeholder='Mobile No'
                          invalid={errors.phoneNo && true}
                          {...field}
                          onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))}
                          maxLength={10}
                          onBlur={(e) => mobileValidation(e.target.value)}
                        />
                      )}
                    />
                    {errors.phoneNo && <FormFeedback>{errors.phoneNo.message}</FormFeedback>}

                  </div> */}



                  <div className=' col-lg-6 label-line-height mb-1'>
                    <Label className='form-label requiredlable' for='lable-password'>
                      Password
                    </Label>
                    <Controller
                      id='password'
                      name='password'
                      control={control}
                      rules={{
                        required: "Please enter password.",
                        pattern: {
                          value: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/,
                          message: 'Password must have at least 8 characters include at least 1 lowercase character, 1 uppercase character, 1 number and 1 special character.'
                        }
                      }}
                      render={({ field }) => (
                        <InputPasswordToggle className='input-group-merge'
                          placeholder='Password'
                          autoComplete="new-password"
                          invalid={errors?.password?.message && true} 
                          {...field}
                          onKeyPress={(e) => handleKeyPressPass(e, setError,'password','password','password')}
                          onPaste={(e) => handlePasteText(e, setError,'password','password','password')}
                        />
                      )}
                    />
                    {errors.password && <FormFeedback>{errors.password.message}</FormFeedback>}

                  </div>
                  <div className=' col-lg-6 label-line-height mb-1'>
                    <Label className='form-label requiredlable' for='confirm-Password'>
                      Confirm Password
                    </Label>
                    <Controller
                      id='confirmPassword'
                      name='confirmPassword'
                      control={control}
                      rules={{
                        required: "Please enter confirm password.",
                        pattern: {
                          value: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/,
                          message: 'Password must have at least 8 characters include at least 1 lowercase character, 1 uppercase character, 1 number and 1 special character.'
                        }
                      }}
                      render={({ field }) => (
                        <InputPasswordToggle className='input-group-merge'
                          placeholder='Confirm Password'
                          invalid={errors?.confirmPassword?.message && true} 
                          {...field}
                          onBlur={() => ValidatePassword()}
                          onKeyPress={(e) => handleKeyPressPass(e, setError,'confirmPassword','confirmPassword','password')}
                          onPaste={(e) => handlePasteText(e, setError,'confirmPassword','confirmPassword','password')}
                          // onPaste={(e) => handlePasteText(e, setError,'password')}
                        />
                      )}
                    />
                    {errors.confirmPassword && <FormFeedback>{errors.confirmPassword.message}</FormFeedback>}
                  </div>

                  <div className=' col-lg-6  mb-1'>
                    <Label className='form-label requiredlable' style={{ paddingTop: "7px" }} for='FkCategoryId'>
                      Category
                    </Label>
                    <Controller
                      id="FkCategoryId"
                      name="FkCategoryId"
                      style={{ paddingTop: "7px" }}
                      control={control}
                      rules={{ required: "Please Select Category!" }}
                      render={({ field }) => (
                        <Select
                          isClearable={false}
                          classNamePrefix="select"
                          options={categoryOptions}
                          {...field}
                          invalid={errors.FkCategoryId && true}
                          theme={selectThemeColors}
                          className={classnames("react-select", {
                            "is-invalid": errors.FkCategoryId && true,
                          })}

                        />
                      )}
                    />
                    {errors.FkCategoryId && (
                      <FormFeedback>{errors.FkCategoryId.message}</FormFeedback>
                    )}

                  </div>

                  <div className=' col-lg-6 label-line-height mb-1'>
                    <Label className='form-label' for='MemberShipNumber'>
                      Membership Number
                    </Label>
                    <Controller
                      id='MemberShipNumber'
                      name='MemberShipNumber'
                      control={control}

                      render={({ field }) => (
                        <Input
                          maxLength={100}
                          type='text'
                          placeholder='Membership Number'
                          invalid={errors?.MemberShipNumber?.message && true} 
                          {...field}
                          onKeyPress={(e) => handleKeyPressPass(e, setError,'MemberShipNumber','MemberShipNumber','space')}
                          onPaste={(e) => handlePasteText(e, setError,'MemberShipNumber','MemberShipNumber','space')}
                        />
                      )}
                    />
                    {errors.MemberShipNumber && <FormFeedback>{errors.MemberShipNumber.message}</FormFeedback>}
                  </div>



                  <div className=' col-lg-6 label-line-height mb-1'>
                    <Label className='form-label' for='referred-By'>
                      Referred By
                    </Label>
                    <Controller
                      id='referredBy'
                      name='referredBy'
                      control={control}
                      // rules={{ required: false }}
                      render={({ field }) => (
                        <Input
                          maxLength={100}
                          type='text'
                          placeholder='Referred By'
                          invalid={errors?.referredBy?.message && true} 
                          onKeyPress={(e) => handleKeyPressPass(e, setError,'referredBy','referredBy','allowSpace')}
                          onPaste={(e) => handlePasteText(e, setError,'referredBy','referredBy','allowSpace')}
                          {...field}
                          onChange={(e) => field.onChange(e.target.value.replace(/[!?@#+=|$%^*{}""<>]/g, ""))}
                        />
                      )}
                    />
                    {errors.referredBy && <FormFeedback>{errors.referredBy.message}</FormFeedback>}
                  </div>
                  <div className=' col-lg-3 label-line-height mb-1'>
                    <Label className='form-label requiredlable' for='lable-captch'>
                      Captcha
                    </Label>
                    <Controller
                      id='captch'
                      name='captch'
                      control={control}
                      rules={{
                        required: "Please enter captcha.",
                      }}
                      render={({ field }) => (
                        <Input
                          maxLength={10}
                          type='text'
                          placeholder='Captcha'
                          invalid={errors?.captch?.message && true} 
                          {...field}
                          onKeyPress={(e) => handleKeyPressPass(e, setError,'captch','captcha','captcha')}
                          onPaste={(e) => handlePasteText(e, setError,'captch','captcha','captcha')}
                        />
                      )}
                    />
                    {errors.captch && <FormFeedback>{errors.captch.message}</FormFeedback>}
                  </div>
                  <div className='mb-1 col-lg-3 px-0 captcha-content'>
                    <CanvasTemplate></CanvasTemplate>
                    <Button className='btn-icon  btn btn-outline-secondary  rounded-circle' outline onClick={CaptchaOnChange} color='flat-danger' >
                      <RefreshCw size={18} ></RefreshCw>
                    </Button>

                  </div>
                </div>
                <div className='text-center mt-2'>
                  <Button type='submit' color='danger' className='col-lg-4 justify-content-center'>
                    Sign up
                  </Button>
                </div>
              </Form>
              <p className='text-center mt-1'>
                <span className='me-25'>Already have an account?</span>
                <Link to='/login'>
                  <span className='text-danger'>Sign in instead</span>
                </Link>
              </p>

              {/* <div className='auth-footer-btn d-flex justify-content-center btn-register-google-btn'>
                    <button style={{marginBottom:"30px"}} type='button' className='login-with-google-btn' onClick={() => googleLogin()}>
                    <img style={{margin: "0 6px 0 0"}} src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMTcuNiA5LjJsLS4xLTEuOEg5djMuNGg0LjhDMTMuNiAxMiAxMyAxMyAxMiAxMy42djIuMmgzYTguOCA4LjggMCAwIDAgMi42LTYuNnoiIGZpbGw9IiM0Mjg1RjQiIGZpbGwtcnVsZT0ibm9uemVybyIvPjxwYXRoIGQ9Ik05IDE4YzIuNCAwIDQuNS0uOCA2LTIuMmwtMy0yLjJhNS40IDUuNCAwIDAgMS04LTIuOUgxVjEzYTkgOSAwIDAgMCA4IDV6IiBmaWxsPSIjMzRBODUzIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNNCAxMC43YTUuNCA1LjQgMCAwIDEgMC0zLjRWNUgxYTkgOSAwIDAgMCAwIDhsMy0yLjN6IiBmaWxsPSIjRkJCQzA1IiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNOSAzLjZjMS4zIDAgMi41LjQgMy40IDEuM0wxNSAyLjNBOSA5IDAgMCAwIDEgNWwzIDIuNGE1LjQgNS40IDAgMCAxIDUtMy43eiIgZmlsbD0iI0VBNDMzNSIgZmlsbC1ydWxlPSJub256ZXJvIi8+PHBhdGggZD0iTTAgMGgxOHYxOEgweiIvPjwvZz48L3N2Zz4=" alt="google"/>  Sign up with Google
                    </button>
              </div> */}

            <div>
              <Row>
              <Col className='col-lg-3 ps-2'>
                </Col>
                <Col className='col-lg-3 px-0 me-1 '>
                  <div className='auth-footer-btn d-flex justify-content-center btn-login-google-btn'>
                    <button onClick={microsoftLogin}
                      className='microsoftbtn auth-footer-btn d-flex justify-content-center btn-login-google-btn'>
                      <img style={{ margin: "0 6px 0 0" , width:"18px", height : "18px" }}  src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMSIgaGVpZ2h0PSIyMSIgdmlld0JveD0iMCAwIDIxIDIxIj48dGl0bGU+TVMtU3ltYm9sTG9ja3VwPC90aXRsZT48cmVjdCB4PSIxIiB5PSIxIiB3aWR0aD0iOSIgaGVpZ2h0PSI5IiBmaWxsPSIjZjI1MDIyIi8+PHJlY3QgeD0iMSIgeT0iMTEiIHdpZHRoPSI5IiBoZWlnaHQ9IjkiIGZpbGw9IiMwMGE0ZWYiLz48cmVjdCB4PSIxMSIgeT0iMSIgd2lkdGg9IjkiIGhlaWdodD0iOSIgZmlsbD0iIzdmYmEwMCIvPjxyZWN0IHg9IjExIiB5PSIxMSIgd2lkdGg9IjkiIGhlaWdodD0iOSIgZmlsbD0iI2ZmYjkwMCIvPjwvc3ZnPg==" alt="google" /> <span> </span>
                      Sign In with Microsoft
                    </button>
                  </div>
                </Col>
                <Col className='col-lg-3 px-0'>
                  <div className='auth-footer-btn d-flex justify-content-center btn-login-google-btn'>
                    <button
                      className="microsoftbtn auth-footer-btn d-flex justify-content-center btn-login-google-btn"
                      onClick={() => googleLogin()} >
                      <img style={{ margin: "0 6px 0 0" }} src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMTcuNiA5LjJsLS4xLTEuOEg5djMuNGg0LjhDMTMuNiAxMiAxMyAxMyAxMiAxMy42djIuMmgzYTguOCA4LjggMCAwIDAgMi42LTYuNnoiIGZpbGw9IiM0Mjg1RjQiIGZpbGwtcnVsZT0ibm9uemVybyIvPjxwYXRoIGQ9Ik05IDE4YzIuNCAwIDQuNS0uOCA2LTIuMmwtMy0yLjJhNS40IDUuNCAwIDAgMS04LTIuOUgxVjEzYTkgOSAwIDAgMCA4IDV6IiBmaWxsPSIjMzRBODUzIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNNCAxMC43YTUuNCA1LjQgMCAwIDEgMC0zLjRWNUgxYTkgOSAwIDAgMCAwIDhsMy0yLjN6IiBmaWxsPSIjRkJCQzA1IiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNOSAzLjZjMS4zIDAgMi41LjQgMy40IDEuM0wxNSAyLjNBOSA5IDAgMCAwIDEgNWwzIDIuNGE1LjQgNS40IDAgMCAxIDUtMy43eiIgZmlsbD0iI0VBNDMzNSIgZmlsbC1ydWxlPSJub256ZXJvIi8+PHBhdGggZD0iTTAgMGgxOHYxOEgweiIvPjwvZz48L3N2Zz4=" alt="google" /> <span> Sign In with Google </span>
                    </button>
                  </div>
                </Col>
                <Col className='col-lg-3 ps-2'>
                </Col>

              </Row>
            </div>

              <div className='demo-inline-spacing mb-1'>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
    // </UILoader>
  )
}

export default RegisterBasic
