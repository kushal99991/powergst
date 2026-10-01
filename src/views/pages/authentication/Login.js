// ** React Imports
import { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
// ** Custom Hooks
import { useSkin } from "@hooks/useSkin";
import Swal from "sweetalert2";
// ** Third Party Components
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { X, Power, AlertCircle } from "react-feather";
// ** Actions
import { handleLogin } from "@store/authentication";
// ** Custom Components
import Avatar from "@components/avatar";
import InputPasswordToggle from "@components/input-password-toggle";
// ** Utils
import { getHomeRouteForLoggedInUser } from "@utils";
import { useGoogleLogin, hasGrantedAllScopesGoogle } from "@react-oauth/google";
import axios from "axios";
//** Microsoft login
import { MsalAuthenticationTemplate, useMsal } from '@azure/msal-react';
import {GoogleOAuthProvider} from '@react-oauth/google';
// ** Reactstrap Imports
import {
  Row,
  Col,
  Form,
  Input,
  Label,
  Alert,
  Button,
  CardText,
  CardTitle,
  FormFeedback,
  CardSubtitle,
} from "reactstrap";

// ** Illustrations Imports
import illustrationsLight from "@src/assets/images/pages/login-screen.png";
import illustrationsDark from "@src/assets/images/pages/login-screen.png";
import GenericGSTLogo from "@src/assets/images/logo/powerlogo.png";

// ** Styles
import "@styles/react/pages/page-authentication.scss";
// ** API - Service
import loginService from "../../../services/loginService";
//** Error Code file
import errorCodeConfig from "../../../configs/apiErrorCodeConfig";
//** Encrypt & Decrypt file
import encryptData from "../../../auth/crypto/crypto";


//** Google sign in
import {
  SECRET_PARAMETER,
  messageShowDuration, navigateTimeOut
} from "@configs/config";
import moment from "moment/moment";
import {handlePasteText,handleKeyPressText} from '@helper/validation'
// ** Session get and set
import { globleVariable } from "@configs/globalVariable";
import LocalFunction from "@configs/getLocalFunction";
import SessionFunction from "@configs/getSessionFunction";

// ** Store & Actions
import { handleLogout } from "@store/authentication";
import { handleKeyPressPass } from "../../../helper/validation";

const defaultValues = {
  loginEmail: "",
  password: "",
};



const ToastContent = ({ t }) => {
  console.log(t,"ttt")
  return (
    <div className="d-flex">
      <div className="me-1">
        <Avatar size="sm" color="danger" icon={<AlertCircle size={12} />} />
      </div>
      <div className="d-flex flex-column">
        <div className="d-flex justify-content-between">
          <h4>Welcome</h4>
          <X
            size={12}
            className="cursor-pointer"
            onClick={() => toast.dismiss()}
          />
        </div>
        <span>Account does not exists, Please register!</span>
      </div>
    </div>
  );
};


const Login = () => {
  const { instance, accounts, loginRedirect } = useMsal();
  const location = useLocation();

  let newEmailId = null;
  if (location.state !== null) {
    newEmailId =
      location?.state?.emailId !== null ? location?.state?.emailId : null;
  }

  const loginDate = moment(new Date()).format("hh:mm:ss");
  // ** Hooks
  const { skin } = useSkin();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    clearErrors,
    trigger,
    setFocus,
  } = useForm({ defaultValues });

  const [block, setBlock] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [counter, setCounter] = useState(0);

  const SignValueRef = useRef(false);
  const sourceTypeRef = useRef(null);
  const homeAccountId = useRef(null);

  sourceTypeRef.value = 0;
  const source = skin === "dark" ? illustrationsDark : illustrationsLight;

  const emailExist =
    localStorage.getItem(globleVariable.emailExists) !== null &&
      localStorage.getItem(globleVariable.emailExists) !== "" &&
      localStorage.getItem(globleVariable.emailExists) !== undefined
      ? localStorage.getItem(globleVariable.emailExists)
      : "";


  const onSuccessFunc = (credentialResponse) => {
    console.log("success:", credentialResponse);
    SignValueRef.value = true;
    sourceTypeRef.value = 1;
    defaultValues.loginEmail = credentialResponse.email;
    onSubmit(defaultValues);
  };


  const onFailure = (err) => {
    console.log("failed:", err);
  };

  //** Log out
  useEffect(() => {
    const isExpired = LocalFunction.getLocalValue(
      globleVariable.expired,
      false
    );
    if (isExpired == "true" || isExpired == true) {
      dispatch(handleLogout());
    }
  }, []);

  //** Check email and mobile no in session - decrypt password
  useEffect(() => {
    if (emailExist === "yesSet") {
      setValue(
        "loginEmail",
        LocalFunction.getLocalValue(globleVariable.userEmail, true)
      );
      // setTitleMsg('Account exists, please login')
      toast.error("Account exists, please login", {
        position: "top-right",
      });
    }


    const userId = LocalFunction.getLocalValue(globleVariable.userNm, true);
    const password = LocalFunction.getLocalValue(globleVariable.userPw, true);
    const chkvalue = LocalFunction.getLocalValue(globleVariable.rChk, false);

    // ** userId & Password decrypt
    if (
      (userId !== "" || userId !== null) &&
      (password !== "" || password !== null)
    ) {

      setValue("loginEmail", userId !== null ? userId : "");
      setValue("password", password !== null ? password : "");
      setRememberMe(Boolean(chkvalue));
    }

    if (newEmailId !== null) {
      setValue("loginEmail", newEmailId);
      setFocus("password");
    } else {
      setFocus("loginEmail");
    }

    return () => setBlock(false);
  }, []);

  useEffect(() => {
    setFocus("password");
  }, [setFocus]);


  //** validation space and blank
  const ValidateString = (data) => {
    if (data == undefined || data == "" || data.trim().length == 0) {
      return false;
    } else {
      return true;
    }
  };

  //** onSubmit
  const onSubmit = (data) => {
    const keysPara = SECRET_PARAMETER

    setCounter(counter + 1);
    if (counter == 10) {
      toast(
        "User email/mobile & password forget,\n\n Please contact support team.",
        {
          position: "top-right",
        }
      );
      return false;
    }

    let isValid = true;
    if (SignValueRef.value == true) {
      isValid = false;
    }

    //validate string trim
    if (!ValidateString(data.loginEmail)) {
      setError('loginEmail', { type: 'manual', message: 'Please enter valid email id or mobile no.' })
      isValid = false;
    } else {

      let encryptPassword = encryptData.encrypt(
        data.password + keysPara + loginDate
      );

      const users = {
        emailmobile: data.loginEmail,
        password: sourceTypeRef.value == 1 ? "" : encryptPassword,
        sourceType: sourceTypeRef.value,
      };

      const usersShow = {
        emailmobile: data.loginEmail,
        password: data.password,
        sourceType: sourceTypeRef.value,
      };
      console.log(users);

      const  entrptPayload = {
       data : encryptData.encrypt(JSON.stringify(users))
      }

      //** API Service Call
      setBlock(true);
      loginService
        .loginUser(entrptPayload)
        // .loginUser(users)
        .then((res) => {
          setBlock(false);
          console.log("on submit");
          const loginDecptyData = encryptData.decrypt((res?.data?.data));
          const parsedLoginData = JSON.parse(loginDecptyData)
          console.log(parsedLoginData,"loginDecptyData")

          if (res.status == 200 && parsedLoginData?.status === errorCodeConfig.APIDefaultCode.Success) {

            if (parsedLoginData?.data?.fkCategoryId == 0 || parsedLoginData?.data?.fkCategoryId == null || parsedLoginData?.data?.fkCategoryId == "" ||
              parsedLoginData?.data?.fkCategoryId == undefined) {

              toast.error("Category verification pending.", {
                position: "top-right", duration: messageShowDuration
              });


              //  setTimeout(() => {
              navigate("/registration-verification", {
                state: {
                  emailId: parsedLoginData?.data?.email,
                  mobileNo: "",
                  pd: encryptPassword,
                  IsMailVerify: true,
                  IsMobileVerify: true,
                  sourceType: usersShow.sourceType, userIds: parsedLoginData?.data?.userId,
                  FkCategoryId: parsedLoginData?.data?.fkCategoryId
                },
              });
              //   }, navigateTimeOut);

            } else {
              // return ""
              const data = {
                ...parsedLoginData,
                accessToken: parsedLoginData?.data?.token,
                // refreshToken:
                //   res?.data?.data?.refreshToken !== null &&
                //     res?.data?.data?.refreshToken !== "" &&
                //     res?.data?.data?.refreshToken !== undefined
                //     ? res?.data?.data?.refreshToken
                //     : "",
                sourceType: parsedLoginData?.data?.sourceType,
                userId: parsedLoginData?.data?.userId,
                serverDateTime: parsedLoginData?.data?.serverDateTime,
                rangeFilters: parsedLoginData?.data?.rangeFilters,
                subscriptionId:
                parsedLoginData?.data?.subscriptionId !== "" &&
                parsedLoginData?.data?.subscriptionId !== null &&
                parsedLoginData?.data?.subscriptionId !== undefined
                    ? parsedLoginData?.data?.subscriptionId
                    : "",
                rangeFiltersITC04: parsedLoginData?.data?.rangeFiltersITC04,
              };

              localStorage.removeItem("expired");
              SessionFunction.setSessionValue(
                globleVariable.isCompany,
                false,
                false
              );

              sessionStorage.setItem("homeAccoutId", homeAccountId.value)
              rememberMeFunc(usersShow);
              dispatch(handleLogin(data));

              const loginTime = new Date().getTime();
              sessionStorage.setItem('loginTime', loginTime);
              sessionStorage.setItem("L_C", JSON.stringify(users))

              navigate(getHomeRouteForLoggedInUser());
            }

          } else {

            if (
              parsedLoginData?.status ===
              errorCodeConfig.APIUserModuleLoginErrorCode.IncorrectPassword
            ) {
              setError("password", {
                type: "manual",
                message: parsedLoginData?.errorMessage,
              });
            } else if (
              parsedLoginData?.status ===
              errorCodeConfig.APIUserModuleLoginErrorCode.IncorrectEmailMobile
            ) {

              if (usersShow.sourceType == 1) {

                toast.error("Account does not exists, Please register!", {
                  position: "top-right",
                });

                setTimeout(() => {
                  navigate("/register");
                }, 500);


              } else {
                setError("loginEmail", {
                  type: "manual",
                  message: parsedLoginData?.errorMessage,
                });
              }

            } else if (
              parsedLoginData?.status ===
              errorCodeConfig.APIUserModuleLoginErrorCode.EmailVerificationPending
            ) {

              // navigate('/registration-verification', { state: { emailId: userData.email, mobileNo: userData.mobile , pd : encryptPassword } });

              toast.error(parsedLoginData?.errorMessage, {
                position: "top-right", duration: messageShowDuration
              });


              setTimeout(() => {
                navigate("/registration-verification", {
                  state: {
                    emailId: parsedLoginData?.data?.email,
                    mobileNo: "",
                    pd: encryptPassword,
                    IsMailVerify: false,
                    IsMobileVerify: false,
                    sourceType: usersShow.sourceType, userIds: parsedLoginData?.data?.userId,
                    FkCategoryId: parsedLoginData?.data?.fkCategoryId
                  },
                });
              }, navigateTimeOut);

            } else if (parsedLoginData?.status ===
              errorCodeConfig.APIUserModuleLoginErrorCode.MobileVerificationPending) {

              toast.error(parsedLoginData?.errorMessage, {
                position: "top-right", duration: messageShowDuration
              });

              setTimeout(() => {
                navigate("/registration-verification", {
                  state: {
                    emailId: parsedLoginData?.data?.email,
                    mobileNo: parsedLoginData?.data?.mobileNo,
                    pd: encryptPassword,
                    IsMailVerify: true,
                    IsMobileVerify: false,
                    sourceType: usersShow.sourceType, userIds: parsedLoginData?.data?.userId,
                    FkCategoryId: parsedLoginData?.data?.fkCategoryId
                  },
                });
              }, navigateTimeOut);
            } else {
              Swal.fire({
                icon: "error",
                title: "",
                customClass: {
                  confirmButton: "btn btn-danger",
                },
                text: parsedLoginData?.errorMessage,
                buttonsStyling: false
              });
            }
          }
        })
        .catch((error) => {
          setBlock(false);
          Swal.fire({
            icon: "error",
            title: "",
            customClass: {
              confirmButton: "btn btn-danger",
            },
            text: error?.message,
            buttonsStyling: false
          });
        });
    };
  };



  //** remember-me  function
  const rememberMeFunc = (data) => {
    if (rememberMe === true) {
      LocalFunction.setLocalValue(
        globleVariable.userNm,
        data.emailmobile,
        true
      );
      LocalFunction.setLocalValue(globleVariable.userPw, data.password, true);
      LocalFunction.setLocalValue(globleVariable.rChk, rememberMe, false);
    } else {
      localStorage.removeItem(globleVariable.userNm);
      localStorage.removeItem(globleVariable.userPw);
      localStorage.removeItem(globleVariable.rChk);
      localStorage.removeItem(globleVariable.userEmail);
    }
  };


  //** User account check api service
  const userAccountCheck = (data) => {
    let isMailValid = false;
    let isMobileValid = false;

    const loginPassword = getValues("password");


    if (data !== null && data !== "") {
      const mailVaiid = new RegExp(
        "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$"
      );
      const loginEmail = getValues("loginEmail");
      var result = mailVaiid.test(loginEmail);
      if (result == false) {
        setError("loginEmail", {
          type: "manual",
          message: "Please enter valid email.",
          required: true,
        });
        return false;
      } else {
        isMailValid = true;
        clearErrors("loginEmail");
      }


      const users = {
        EmailMobile: data,
      };

      if (loginPassword == null || loginPassword == "") {
        setBlock(true);
        loginService
          .CheckAccountUser(users)
          .then((res) => {
            setBlock(false);

            if (
              res.status === 200 &&
              res.data.status === errorCodeConfig.APIDefaultCode.Success
            ) {
              // Account exits
            } else {

              if (res.data.status == errorCodeConfig.APIDefaultCode.InternalSeverError) {
                setBlock(false);
                Swal.fire({
                  icon: "error",
                  title: "",
                  text: res.data.errorMessage,
                  customClass: {
                    confirmButton: 'btn btn-danger'
                  },
                  buttonsStyling: false
                });
              } else {
                if (isMobileValid == true) {
                  // LocalFunction.setLocalValue(
                  //   globleVariable.userMobile,
                  //   data,
                  //   true
                  // );
                  // localStorage.setItem('umno',  encryptData.encryptData(data)) // userMobile
                } else {
                  LocalFunction.setLocalValue(
                    globleVariable.userEmail,
                    data,
                    true
                  );

                }

                LocalFunction.setLocalValue(
                  globleVariable.emailExists,
                  "notSet",
                  false
                );
                navigate("/register", { state: { checkAccount: "no" } });
                toast((t) => <ToastContent />);
              }
            }
          })
          .catch((error) => {
            setBlock(false);
            Swal.fire({
              icon: "error",
              title: "",
              text: error?.message,
              customClass: {
                confirmButton: 'btn btn-danger'
              },
              buttonsStyling: false
            });
          });
      }
    }
  };

  //** click event - Remember-me
  const handleChange = () => {
    setRememberMe(!rememberMe);
  };

  // ** google login
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const userInfo = await axios.get( import.meta.env.VITE_GOOGLE_URL, {
        headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
      });

      if (userInfo) {
        onSuccessFunc(userInfo.data);
      }
    },
    onError: (errorResponse) => console.log(errorResponse),
  });


  // ** microsoft login
  const microsoftLogin = () => {

    instance
      .handleRedirectPromise()
      .then(async (tokenResponse) => {
        if (tokenResponse === null) {

          // **  If the tokenResponse === null, you are not coming back from an auth redirect.
          const loginResponse = await instance.loginPopup();
          SignValueRef.value = true;
          sourceTypeRef.value = 1;

          if (loginResponse.account.name !== null && loginResponse.account.name !== "" &&
            loginResponse.account.name !== undefined) {
            const [before, after] = loginResponse.account.name?.split(' ')
            defaultValues.FirstName = before;
          } else {
            defaultValues.FirstName = loginResponse.account.username.split('@')[0]
          }
          defaultValues.loginEmail = loginResponse.account.username;
          homeAccountId.value = loginResponse.account.homeAccountId
          onSubmit(defaultValues)

        } else {
          //** */ If the tokenResponse !== null, then you are coming back from a successful authentication redirect.
        }
      })
      .catch((error) => {
        // ** handle error, either in the library or coming back from the server
      });
  };


  return (
    <div>
      {block && <div className="loading1">Loading&#8230;</div>}
      <div className="auth-wrapper auth-cover">
        <Row className="auth-inner m-0">
          <Link
            className="brand-logo col-lg-4 ml-0 brand-logo-left-0"
            to="/"
            onClick={(e) => e.preventDefault()}
          >
          </Link>

          <Col
            className="p-5"
            lg="4"
            sm="12"
          >
            <div className="w-100 d-lg-flex align-items-center justify-content-center col-md-12">
              <img className="img-fluid" src={source} alt="Login Cover" />

            </div>
            <div className="mt-4"><h3 className="fw-bolder">India’s First GST Billing Software</h3><p className="text-dark">  </p>
              <div className='mt-3'>

                {/* <p className='text-dark'>&#10003;   Automatic download Notices from Portal</p> */}
                <p className='text-dark'>&#10003;  Access Anywhere, Anytime </p>
                <p className='text-dark'>&#10003;  100% Accurate, Cloud based & Secure. </p>
                {/* <p className='text-dark'>&#10003;   NoticeAlert, GST, e-Invoicing & Many more </p> */}

              </div>
            </div>
            <div style={{ position: "fixed", bottom: "20px" }}><p>GenericGST is a product of <a className="text-danger" href="https://example.com/" target='_blank' rel='noopener noreferrer'>Generic Tech Corp</a></p>
              <div className='text-center' style={{ marginLeft: "-20px" }}>
                <span className='me-5'> <a className="text-danger" target='_blank' href="/terms">Terms & Condition</a></span>
                <span className='justify-content-right'> <a className="text-danger" target='_blank' href="/privacy">Privacy Policy</a></span>
              </div>
            </div>

          </Col>

          <Col
            className="d-flex align-items-center auth-bg px-2 p-lg-5"
            lg="8"
            sm="12"
          >
            <Col className="px-xl-2 mx-auto" sm="8" md="6" lg="6">

              <Form
                className="auth-login-form mt-2"
                onSubmit={!block && handleSubmit(onSubmit)}
              >
                <CardTitle
                  tag="h2"
                  className="fw-bolder text-dark mb-1 text-center"
                >
                  <img
                    className="img-fluid col-lg-4 m-auto"
                    src={GenericGSTLogo}
                    alt="power-gst-logo"
                  />
                </CardTitle>
                <div className="mb-1">
                  <Label className="form-label" for="login-email">
                    Email Id
                  </Label>
                  <Controller
                    id="loginEmail"
                    name="loginEmail"
                    control={control}
                    rules={{
                      required: "Please enter a valid email.",
                      pattern: {
                        // Regular expression to ensure email doesn't start with number or symbol
                        value: /^[A-Za-z][A-Z0-9._%+-]*@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Please enter a valid email."
                      }
                    }}
                    render={({ field }) => (
                      <Input
                        type="text"
                        placeholder="john@example.com"
                        invalid={errors?.loginEmail?.message && true}
                        {...field}
                        tabIndex="1"
                        maxLength={100}
                        onBlur={(e) => !block && userAccountCheck(e.target.value)}
                        onPaste={(e) => handlePasteText(e, setError,'loginEmail','email','email')}
                        onKeyPress={(e) => handleKeyPressText(e, setError,'loginEmail')}
                      />
                    )}
                  />
                  {errors.loginEmail && (
                    <FormFeedback>{errors?.loginEmail?.message}</FormFeedback>
                  )}
                </div>
                <div className="mb-1">
                  <div className="d-flex justify-content-between">
                    <Label className="form-label" for="login-password">
                      Password
                    </Label>
                    <Link to="/forgot-password">
                      <small className="text-danger">Forgot Password?</small>
                    </Link>
                  </div>
                  <Controller
                    id="password"
                    name="password"
                    control={control}
                    rules={{
                      required: "Please enter valid password",
                    }}
                    render={({ field }) => (
                      <InputPasswordToggle
                        className="input-group-merge"
                        invalid={errors?.password?.message && true}
                        // invalid={(errors.password?.type =="required" || ( errors.password?.type =="manual" && errors.password?.message != "")) && true} {...field} 
                        {...field}
                        tabIndex="2"
                        onPaste={(e) => handlePasteText(e, setError,'password','password','password')}
                        onKeyPress={(e) => handleKeyPressPass(e, setError,'password','password','password')}
                      />
                    )}
                  />
                  {errors.password && (
                    <FormFeedback>{errors?.password?.message}</FormFeedback>
                  )}
                </div>
                <div className="form-check mb-1">
                  <Input
                    type="checkbox"
                    id="rememberMe"
                    name="rememberMe"
                    checked={rememberMe}
                    onChange={!block && handleChange}
                  />
                  <Label
                    className="form-check-label"
                    for="remember-me"
                    onClick={!block && handleChange}
                  >
                    Remember Me
                  </Label>
                </div>
                <Button type="submit" color="danger" block tabIndex="3">
                  Sign in
                </Button>
                <p className="text-center mt-2">
                  <span className="me-25">New on our platform?</span>
                  <Link to="/register">
                    <span className="text-danger">Create an account</span>
                  </Link>
                </p>
              </Form>

              <div className="divider my-2">
                <div className="divider-text">or</div>
              </div>

              <div>
                <Row>
                  <Col className='col-lg-6 px-0'>
                    <div className='auth-footer-btn d-flex justify-content-center btn-login-google-btn '>
                      <button onClick={microsoftLogin}
                        className='microsoftbtn auth-footer-btn d-flex justify-content-center btn-login-google-btn'>
                        <img style={{ margin: "0 6px 0 0", width: "18px", height: "18px" }} src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMSIgaGVpZ2h0PSIyMSIgdmlld0JveD0iMCAwIDIxIDIxIj48dGl0bGU+TVMtU3ltYm9sTG9ja3VwPC90aXRsZT48cmVjdCB4PSIxIiB5PSIxIiB3aWR0aD0iOSIgaGVpZ2h0PSI5IiBmaWxsPSIjZjI1MDIyIi8+PHJlY3QgeD0iMSIgeT0iMTEiIHdpZHRoPSI5IiBoZWlnaHQ9IjkiIGZpbGw9IiMwMGE0ZWYiLz48cmVjdCB4PSIxMSIgeT0iMSIgd2lkdGg9IjkiIGhlaWdodD0iOSIgZmlsbD0iIzdmYmEwMCIvPjxyZWN0IHg9IjExIiB5PSIxMSIgd2lkdGg9IjkiIGhlaWdodD0iOSIgZmlsbD0iI2ZmYjkwMCIvPjwvc3ZnPg==" alt="google" /> <span> </span>
                        Sign In with Microsoft
                      </button>
                    </div>
                  </Col>
                  <Col className='col-lg-6 pe-0'>
                    <div className='auth-footer-btn d-flex justify-content-center btn-login-google-btn'>

                      <button
                        className="microsoftbtn auth-footer-btn d-flex justify-content-center btn-login-google-btn"
                        onClick={() => googleLogin()} >
                        <img style={{ margin: "0 6px 0 0" }} src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMTcuNiA5LjJsLS4xLTEuOEg5djMuNGg0LjhDMTMuNiAxMiAxMyAxMyAxMiAxMy42djIuMmgzYTguOCA4LjggMCAwIDAgMi42LTYuNnoiIGZpbGw9IiM0Mjg1RjQiIGZpbGwtcnVsZT0ibm9uemVybyIvPjxwYXRoIGQ9Ik05IDE4YzIuNCAwIDQuNS0uOCA2LTIuMmwtMy0yLjJhNS40IDUuNCAwIDAgMS04LTIuOUgxVjEzYTkgOSAwIDAgMCA4IDV6IiBmaWxsPSIjMzRBODUzIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNNCAxMC43YTUuNCA1LjQgMCAwIDEgMC0zLjRWNUgxYTkgOSAwIDAgMCAwIDhsMy0yLjN6IiBmaWxsPSIjRkJCQzA1IiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNOSAzLjZjMS4zIDAgMi41LjQgMy40IDEuM0wxNSAyLjNBOSA5IDAgMCAwIDEgNWwzIDIuNGE1LjQgNS40IDAgMCAxIDUtMy43eiIgZmlsbD0iI0VBNDMzNSIgZmlsbC1ydWxlPSJub256ZXJvIi8+PHBhdGggZD0iTTAgMGgxOHYxOEgweiIvPjwvZz48L3N2Zz4=" alt="google" /> <span> Sign In with Google </span>
                      </button>
                    </div>
                  </Col>

                </Row>
              </div>

            </Col>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Login;
