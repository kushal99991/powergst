// ** React Imports
import { useState, Fragment, useEffect, useRef, useCallback } from "react";
import {
  Link,
  useLocation,
  useSearchParams,
  useNavigate,
} from "react-router-dom";
import { handleLogin } from '@store/authentication'
// ** Custom Hooks
import { useSkin } from "@hooks/useSkin";
import Swal from "sweetalert2";

// ** Icons Imports
import { ChevronLeft } from "react-feather";
import { messageShowDuration,navigateTimeOut } from '@configs/config'

// ** Custom Components
import InputPassword from "@components/input-password-toggle";
import { getHomeRouteForLoggedInUser } from '@utils'
// ** Reactstrap Imports
import {
  Row,
  Col,
  CardTitle,
  CardText,
  Form,
  Label,
  Button,
  FormFeedback,
  Input,
  Alert,
  UncontrolledTooltip,
} from "reactstrap";

// ** Illustrations Imports
import illustrationsLight from "@src/assets/images/pages/reset-password-v2.svg";
import illustrationsDark from "@src/assets/images/pages/reset-password-v2-dark.svg";

// ** Styles
import "@styles/react/pages/page-authentication.scss";

// ** Third Party Components
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";

// ** Spinner (Splash Screen)
import Spinner from "../../../@core/components/spinner/Loading-spinner";
// ** API - Service
import registrationService from "../../../services/registrationService";
import loginService from "../../../services/loginService";

//** Error Code file
import errorCodeConfig from "../../../configs/apiErrorCodeConfig";
import {globleVariable} from '../../../configs/globalVariable';
import SessionFunction from '../../../configs/getSessionFunction'

import GenericGSTLogo from "@src/assets/images/logo/powerlogo.png";
import resetLogo from "@src/assets/images/pages/reset-new.jpg";
import mobileScreenLogo from "@src/assets/images/pages/mobile-number.jpg";
import * as yup from "yup";
import encryptData from "../../../auth/crypto/crypto";
import { useDispatch } from "react-redux";

import classnames from "classnames";
import Select from 'react-select'
import { selectThemeColors } from '@utils'
import makeAnimated from 'react-select/animated'
const animatedComponents = makeAnimated()

import userRegistrationService from '../../../services/registrationService'

const defaultValues = {
  emailOtp: "",
  mobileOtp: "",
  mobileNo: "",
  mobileNo1: "",
  mobileOtp1: "",
};

const RESET_INTERVAL_S = 5;

const RegistrationVerificationCover = () => {

  localStorage.removeItem(globleVariable.emailExists)

  // ** Hooks
  const { skin } = useSkin();
  const location = useLocation();
  const navigate = useNavigate();

  const [btnDisable, setBtnDisable] = useState(false);
  const [block, setBlock] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [showTimer, setShowTimer] = useState(true);
  const [seconds, setSeconds] = useState(60);
  const [emailshow, setEmailshow] = useState("");
  const [showOnlyMobile, setShowOnlyMobile] = useState(true);
  const [showOnlyEmail, setShowOnlyEmail] = useState(false);
  const [showHideBtn, setShowHideBtn] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [time, setTime] = useState(0);

  const [timer, setTimer] = useState(15);
  const [minutes, setMinutes] = useState(0);

  const [goLoginFlag, setGoLoginFlag] = useState((location?.state?.FkCategoryId == 0 && !location?.state?.IsMobileVerify) ? false : location?.state?.FkCategoryId == 0 ? true : location?.state?.IsMobileVerify ? true : false);
  const [categoryOptions, setCategoryOptions] = useState([])


  const clearErrorMessage = () => {
    setErrorMessage('');
  };
  const timeOutCallback = useCallback(
    () => setTimer((currTimer) => currTimer - 1),
    []
  );

  const dispatch = useDispatch()

  let emailId = null;
  let mobileNo = null;
  let printMobile = null;
  let printEmail = null;
  let sourceTypeRefs = null;
  let userId = null;
  let logPd = null;

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    clearErrors
  } = useForm({ defaultValues });

  //** location state
  // console.log(location.state)

  if (location.state !== null) {
    logPd = location.state.pd !== null ? location.state.pd : null;
    userId = location.state.userIds !== null ? location.state.userIds : null;
    emailId = location.state.emailId !== null ? location.state.emailId : null;
    mobileNo =
      mobileNumber === '' ? location.state.mobileNo !== null ? location.state.mobileNo?.toString() : null : mobileNumber;

    sourceTypeRefs =
      location.state.sourceType !== null ? location.state.sourceType : null;
    printMobile = mobileNo?.toString()?.replace(/^(.{2})(.*)(.{2})$/, (match, firstTwoChars, middleChars, lastTwoChars) => firstTwoChars + '*'.repeat(middleChars.length) + lastTwoChars);

  }
  useEffect(() => {
    const retrunEmail = emailId && obscureEmail(emailId);
    printEmail = retrunEmail;
    setEmailshow(retrunEmail);
  }, []);

  useEffect(() => {
    if (!mobileNo) {

      setShowOnlyEmail(true);
    }

    if (sourceTypeRefs == 1 && !mobileNo) {
      setShowOnlyMobile(false)
      setShowHideBtn(true);
      setShowOnlyEmail(false);
    }
    if (location.state.mobileNo === null && location.state.IsMailVerify === true) {
      setShowOnlyEmail(false)
      setShowOnlyMobile(false)
      setShowHideBtn(true);
    }
    if (location.state.mobileNo !== null && location.state.IsMailVerify) {
      setShowOnlyEmail(false)
      setShowOnlyMobile(false)
      setShowHideBtn(true);
      setValue('mobileNo1', mobileNo);
    }
  }, []);



  const source = skin === "dark" ? illustrationsDark : illustrationsLight;
  const timeRemain = RESET_INTERVAL_S - (time % RESET_INTERVAL_S);

  const backToMobileno = () => {
    clearErrors()
    clearErrorMessage();
    setShowOnlyEmail(false)
    setShowOnlyMobile(false)
    setShowHideBtn(true);
  }


  //** Mobile validation */
  const mobileValidate = (mobileOtp) => {
    if (
      (showOnlyMobile && !showOnlyEmail && mobileOtp.trim() === '') ||
      (showOnlyEmail && data.emailOtp.trim() === '')
    ) {
      setErrorMessage('Please enter a valid OTP.');
      return;
    }
    clearErrorMessage();
    const users = {

      email : emailId,
      emailCode : "",
      mobileNo : mobileNo ,
      otp : mobileOtp,
      contactType : 2

    };
    console.log(users, "user");
   const newData = { data: encryptData.encrypt(JSON.stringify(users)) };

    setBlock(true);
    // const newData = users;
    registrationService
      .UserRegistationVerification(newData)
      .then((response) => {
        setBlock(false);
        const registrationVerficationDecptyData = encryptData.decrypt((response?.data?.data));
        const res = JSON.parse(registrationVerficationDecptyData)
        console.log(res,"loginDecptyData")
        if (
          res?.status === 1

        ) {
          toast.success(res?.successMessage, {
            position: "top-right",duration: messageShowDuration
          });
          setShowOnlyEmail(false);
          setShowOnlyMobile(false);
          setShowHideBtn(false);
          setBtnDisable(true);
          setTimeout(() => {

            let userPayload = {
              emailmobile: emailId,
              password: sourceTypeRefs == 1 ? "" : logPd,
              sourceType: sourceTypeRefs,
            }

            // ** login
            let redirectNext = sourceTypeRefs == 0 ? true : false;

            loginFunc(userPayload, redirectNext )

          }, 1000);
        } else {
          Swal.fire({
            icon: "error",
            title: "",
            text: res?.errorMessage,
            customClass: {
              confirmButton: "btn btn-danger",
            },
            buttonsStyling: false
          });
        }
      })
      .catch((error) => {
        setBlock(false);
        Swal.fire({
          icon: "error",
          title: "",
          text: error?.message,
          customClass: {
            confirmButton: "btn btn-danger",
          },
          buttonsStyling: false
        });
      });
  }

  const loginFunc = (userPayload, redirectLogin) => {
    loginService
            .loginUser({data : encryptData.encrypt(JSON.stringify(userPayload))})
            .then((resLogin) => {
              setBlock(false);
              console.log("on submit");
              console.log(resLogin.data);
              const loginDecptyData = encryptData.decrypt((resLogin?.data?.data));
              const parsedLoginData = JSON.parse(loginDecptyData)
              console.log(parsedLoginData,"loginDecptyData")
              if (
                resLogin.status === 200 &&
                parsedLoginData?.status === errorCodeConfig.APIDefaultCode.Success
              ) {
                const data = {
                  ...parsedLoginData,
                  accessToken: parsedLoginData?.data?.token,
                  // refreshToken:
                  // resLogin?.data?.data?.refreshToken !== null &&
                  // resLogin?.data?.data?.refreshToken !== "" &&
                  // resLogin?.data?.data?.refreshToken !== undefined
                  //     ? resLogin?.data?.data?.refreshToken
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

                  setGoLoginFlag(true)
                  if (redirectLogin == true) {
                   dispatch(handleLogin(data))
                    navigate(getHomeRouteForLoggedInUser());
                  }


              }
            })
  }



  //** Submit
  const onSubmit = (data) => {
    if (
      (showOnlyMobile && !showOnlyEmail && data.mobileOtp.trim() === '') ||
      (showOnlyEmail && data.emailOtp.trim() === '')
    ) {
      setErrorMessage('Please enter a valid OTP.');
      return;
    }
    clearErrorMessage();
    const users = {

      email : emailId ,
      emailCode : showOnlyEmail ? data.emailOtp : '' ,
      mobileNo : "",
      otp : "",
      contactType : showOnlyEmail ? 1 : 2
    };

    // if (Object.values(data).every((field) => field.length > 0)) {
    // ** Validate Password
    setBlock(true);
    // ** API - Service

   const newData = { data: encryptData.encrypt(JSON.stringify(users)) };

    registrationService
      .UserRegistationVerification(newData)
      .then((response) => {
        setBlock(false);
        const registrationVerficationDecptyData = encryptData.decrypt((response?.data?.data));
        const res = JSON.parse(registrationVerficationDecptyData)
        console.log(res,"loginDecptyData")
        if (res?.status === 1) {

          setShowOnlyEmail(false);
          setShowOnlyMobile(false);
          setShowHideBtn(true);
          toast.success(res?.successMessage, {
            position: "top-right", duration: messageShowDuration
          });
          setBtnDisable(true);

        } else {
          Swal.fire({
            icon: "error",
            title: "",
            text: res?.errorMessage,
            customClass: {
              confirmButton: "btn btn-danger",
            },
            buttonsStyling: false
          });
        }
      })
      .catch((error) => {
        setBlock(false);
        Swal.fire({
          icon: "error",
          title: "",
          text: error?.message,
          customClass: {
            confirmButton: "btn btn-danger",
          },
          buttonsStyling: false
        });
      });

  };

  const obscureEmail = (email) => {

    const [name, domain] = email.split("@");

    return `${name[0]}${new Array(name.length).join("*")}@${domain}`;
  };


  // **   Resend OTP - Email
  const ResendOtpFuncEmail = () => {

    const payLoadForEmail = {
      email : emailId ,
      mobile : "",
      contactType : showOnlyEmail ? 1 : 2
    }

   const encryptPayLoadForEmail = { data: encryptData.encrypt(JSON.stringify(payLoadForEmail)) };

   setMinutes(0);
   setSeconds(60);
    setBlock(true)
    registrationService
      .UserRegistationReSendOTP(encryptPayLoadForEmail)
      .then((response) => {
        const registrationVerficationDecptyData = encryptData.decrypt((response?.data?.data));
        const res = JSON.parse(registrationVerficationDecptyData)
        console.log(res,"loginDecptyData")

        // const res = response?.data
        if (
          res?.status == 1
        ) {
          setBlock(false)

          toast.success(res?.successMessage, {
            position: "top-right",duration: messageShowDuration
          });

        } else {
          setBlock(false)
          toast.error(res?.errorMessage, {
            position: "top-right",duration: messageShowDuration
          });
        }
      })
      .catch((error) => {
        setBlock(false)
        Swal.fire({
          icon: "error",
          title: "",
          text: error?.message,
          customClass: {
            confirmButton: "btn btn-danger",
          },
          buttonsStyling: false
        });
      });
   }
  //** Resend OTP - Mobile
  const ResendOtpFunc = () => {

    const payLoadForMobile = {
      email : emailId ,
      mobile : mobileNo,
      contactType : showOnlyEmail ? 1 : 2
    }
   const encryptPayLoadForMobile = { data: encryptData.encrypt(JSON.stringify(payLoadForMobile)) };


    // const newData1 =payLoadForMobile
    setMinutes(0);
    setSeconds(60);
    setBlock(true)
    registrationService
      .UserRegistationReSendOTP(encryptPayLoadForMobile)
      .then((response) => {
        const registrationVerficationDecptyData = encryptData.decrypt((response?.data?.data));
        const res = JSON.parse(registrationVerficationDecptyData)
        console.log(res,"loginDecptyData")
        // const res = response?.data
        if (
          res?.status == 1
        ) {
          setBlock(false)

          toast.success(res?.successMessage, {
            position: "top-right",duration: messageShowDuration
          });

        } else {
          setBlock(false)
          toast.error(res?.errorMessage, {
            position: "top-right",duration: messageShowDuration
          });
        }
      })
      .catch((error) => {
        setBlock(false)
        Swal.fire({
          icon: "error",
          title: "",
          text: error?.message,
          customClass: {
            confirmButton: "btn btn-danger",
          },
          buttonsStyling: false
        });
      });
  };

  //** Rest Timeer
  const resetTimer = function () {
    if (!timer) {
      setTimer(60);
    }
  };

  useEffect(() => {
    if (timer > 0) {
      setTimeout(timeOutCallback, 1000);
    } else {
      setShowTimer(false);
    }
  }, [timer, timeOutCallback, showTimer]);


  // ** New Timer
  useEffect(() => {
    const interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }

      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(interval);
        } else {
          setSeconds(59);
          setMinutes(minutes - 1);
        }
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [seconds]);


  const Loader = () => {
    return (
      <Fragment>
        <Spinner />
        <CardText className="mb-0 mt-1 text-white">Please Wait...</CardText>
      </Fragment>
    );
  };


  // ** Mobile OTP
  const mobileOTPSend = () => {

    const mobileNumber = getValues('mobileNo1')

    if (mobileNumber.length !== 10 || mobileNumber == null || mobileNumber == "" || mobileNumber == undefined) {
      setError('mobileNo1', { type: 'manual', message: "Please enter correct mobile no.", required: true })
      return false;
    } else {
      clearErrors("mobileNo1")
    }


    const payLoad = {
      id : userId,
      mobile : mobileNumber,
      email : emailId
    }

    const newData = payLoad
    const  entrptPayload = {
      data : encryptData.encrypt(JSON.stringify(newData))
     }

    setBlock(true)
    setMinutes(0);
    setSeconds(60);

    registrationService
      .UserRegistationMobleUpdateOTP(entrptPayload)
      .then((response) => {
        const resetLinkDecptyData = encryptData.decrypt((response?.data?.data));
        const res = JSON.parse(resetLinkDecptyData)
        console.log(res,"loginDecptyData")
        if (res?.status == 1) {
          setMobileNumber(mobileNumber)

          setBlock(false)
           setShowOnlyMobile(true);
           setShowHideBtn(false);
          toast.success(res?.successMessage, {
            position: "top-right",duration: messageShowDuration
          });
        } else {
          setBlock(false)

          toast.error(res?.errorMessage, {
            position: "top-right",duration: messageShowDuration
          });
        }
      })
      .catch((error) => {
        setBlock(false)

        Swal.fire({
          icon: "error",
          title: "",
          text: error?.message,
          customClass: {
            confirmButton: "btn btn-danger",
          },
          buttonsStyling: false
        });
      });
  };


  const ValidateString = (data) => {
    if (data == undefined || data == "" || data.trim().length == 0) {
      console.log('data1')
      return false;
    }
    else {
      return true;
    }
  }


// ** Category save
  const submitCategory = () => {

    const category1 = getValues("FkCategoryId");
    const membership1 = getValues("MemberShipNumber")

    const mem = getValues("MemberShipNumber")
     if (!category1?.value) {
      setError("FkCategoryId", {
        type: "manual",
        message: "Please select Categary!",
        required: true,
      });
      return false;
    } else {
      setError("FkCategoryId", {
        type: "manual",
        message: "",
        required: true,
      });
    }
    if (((category1?.value == 2 || category1?.value == 3 || category1?.value == 4) && (!ValidateString(mem)))) {
      // alert("su")
      setError("MemberShipNumber", {
        type: "manual",
        message: "Please Enter Membership Number",
        required: true,
      });
      return false;
    }


    const payLoad = {
      "CategoryId": category1?.value,
      "memberShipNumber": membership1,
      "id": userId
    }


    const newData =payLoad ;
    setBlock(true)
    registrationService
      .UpdateCategoryIdAndMemberShipNo(newData)
      .then((response) => {
        setBlock(false)

        const res = response?.data;
        if (
          res?.status === 1

        ) {
          toast.success(res?.successMessage, {
            position: "top-right",
          });

          setTimeout(() => {

            let userPayload = {
              emailmobile: emailId,
              password: sourceTypeRefs == 1 ? "" : logPd,
              sourceType: sourceTypeRefs,
            }

            loginFunc(userPayload , true)

          }, 1000);
        } else {
          Swal.fire({
            icon: "error",
            title: "",
            text: res?.data?.errorMessage,
            customClass: {
              confirmButton: "btn btn-danger",
            },
          });
        }
      })
      .catch((error) => {
        setBlock(false)

        Swal.fire({
          icon: "error",
          title: "",
          text: error?.message,
          customClass: {
            confirmButton: "btn btn-danger",
          },
        });
      });


  };

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


  return (
<div>
{block && <div className="loading1">Loading&#8230;</div>}
<div className="auth-wrapper auth-cover">
  <Row className="auth-inner m-0">
    <Col
      className="d-none d-lg-flex align-items-center p-5"
      lg="6"
      sm="12"
    >
      <Link
        className="brand-logo col-lg-6"
        to="/"
        onClick={(e) => e.preventDefault()}
      >
        <img
          className="img-fluid col-lg-3 m-auto"
          src={GenericGSTLogo}
          alt="power-gst-logo"
        />
      </Link>
      <div className="col-lg-11 m-auto d-lg-flex align-items-center justify-content-center px-5">

        {showOnlyEmail ? <img className="img-fluid" src={resetLogo} alt="Login Cover" /> : showOnlyMobile && !showOnlyEmail ? <img className="img-fluid" src={resetLogo} alt="Login Cover" /> : <img className="img-fluid" src={mobileScreenLogo} alt="Login Cover" />}
      </div>
    </Col>
    <Col
      className="d-flex align-items-center auth-bg px-2 p-lg-5"
      lg="6"
      sm="12"
    >
      <Col className="px-xl-2 mx-auto" sm="8" md="6" lg="8">
        {!goLoginFlag ? <CardTitle tag="h2" className="fw-bold mb-1 text-center">
          {console.log("showOnlyMobile", showOnlyMobile)}
          {showOnlyMobile && !showOnlyEmail ?
            ' Mobile OTP Verification'
            : showOnlyMobile && showOnlyEmail ? 'Email OTP Verification' : 'Enter Mobile Number'
          }
        </CardTitle> :
          <CardTitle tag="h2" className="fw-bold mb-1 text-center">
            Select Category
          </CardTitle>}

        {showOnlyEmail && <Alert color="success"> <div className="alert-body font-small-2">{!location?.state?.IsMailVerify && <p>
          <small className="me-50">
            <span className="fw-bold">
              Email OTP has been sent to your :{" "}
            </span>{" "}
            <b> {emailshow}</b>
          </small>
        </p>}
        </div></Alert>}
        {showOnlyMobile && !showOnlyEmail ? (
          <Alert color="success">
            <div className="alert-body font-small-2">

              <p>
                <small className="me-50">
                  <span className="fw-bold">
                    Mobile OTP has been sent to your :
                  </span>{" "}

                  <b>{printMobile ? printMobile : mobileNumber ? mobileNumber?.slice(0, 2) + mobileNumber?.slice(2)?.replace(/.(?=...)/g, "*") : ''}</b>

                </small>
              </p>
            </div>
          </Alert>
        ) : (
          ""
        )}
        {!goLoginFlag && !showOnlyEmail && !showHideBtn && <div>
          <ChevronLeft
            className="rotate-rtl me-25 text-danger"
            size={14}
            style={{ cursor: "pointer" }}
            onClick={backToMobileno}
          />
          <span className="align-middle text-danger" style={{ cursor: "pointer" }} onClick={backToMobileno}>
            Click to change Mobile Number
          </span>
        </div>}


        <Form
          className="auth-reset-password-form mt-2"
          onSubmit={handleSubmit(onSubmit)}
        >
          {showOnlyEmail && <>{!(location?.state?.IsMailVerify) && <div className='mb-1'>
            <Label className="form-label" for="email-Otp">
              Email OTP
            </Label>
            <Controller
              id="emailOtp"
              name="emailOtp"
              control={control}
              render={({ field }) => (
                <Input
                  placeholder="Email OTP"
                  maxLength={6}
                  style={{marginLeft:"0px"}}
                  autoFocus
                  onKeyDown={(event) => {
                    if (event.keyCode === 13) {
                      event.preventDefault();
                    }
                  }}
                  // type="text"
                  autoComplete={'off'}
                  {...field}
                  invalid={errors.emailOtp && true}
                  onChange={(e) => field.onChange(e.target.value = e.target.value.toUpperCase())}

                />
              )}
            />
            {errors.emailOtp && (
              <FormFeedback>{errors.emailOtp.message}</FormFeedback>
            )}

          </div>} </>}
          {!goLoginFlag && !showOnlyEmail && !showHideBtn && sourceTypeRefs == 1 ? (
            <>


              <div className="mb-1">
                <Label className="form-label" for="mobile-Otp">
                  Mobile OTP
                </Label>
                <Controller
                  id="mobileOtp"
                  name="mobileOtp"
                  control={control}
                  render={({ field }) => (
                    <Input
                      placeholder="Mobile OTP"
                      maxLength={6}
                      onKeyDown={(event) => {
                        if (event.keyCode === 13) {
                          event.preventDefault();
                        }
                      }}
                      // type="number"
                      // autoComplete={'off'}
                      {...field}
                      invalid={errors.mobileOtp && true}
                      onChange={(e) =>
                        field.onChange(e.target.value.replace(/\D/g, ""))
                      }

                    />
                  )}
                />
              </div>{" "}
              {errors.mobileOtp && (
                <FormFeedback>{errors.mobileOtp.message}</FormFeedback>
              )}{" "}

            </>
          ) : (
            <>

              {(!goLoginFlag && !showOnlyEmail && !showOnlyMobile && showHideBtn) && (
                <Row className='mb-1' >
                  <Col sm={12}>
                    <Label className="form-label" for="mobile-Otp">
                      Mobile No
                    </Label>
                    <Controller
                      // id="mobileNo1"
                      name="mobileNo1"
                      control={control}
                      render={({ field }) => (
                        <Input
                          placeholder="Mobile No"
                          autoComplete={'off'}

                          invalid={errors.mobileNo1 && true}
                          {...field}
                          onChange={(e) =>
                            field.onChange(e.target.value.replace(/\D/g, ""))
                          }

                          onKeyDown={(event) => {
                            if (event.keyCode === 13) {
                              event.preventDefault();
                            }
                          }}

                          minLength={10}
                          maxLength={10}
                          autoFocus

                        />
                      )}
                    />
                    {errors.mobileNo1 && (
                      <FormFeedback>{errors.mobileNo1.message}</FormFeedback>
                    )}
                  </Col>

                </Row>)}

              {(showHideBtn == false && !showOnlyEmail && sourceTypeRefs == 0) && (
                <>

                  <div className="mb-1">
                    <Label className="form-label" for="mobile-Otp">
                      Mobile OTP
                    </Label>
                    <Controller
                      id="mobileOtp1"
                      name="mobileOtp1"
                      control={control}
                      render={({ field }) => (
                        <Input
                          placeholder="Mobile OTP"
                          maxLength={6}
                          onKeyDown={(event) => {
                            if (event.keyCode === 13) {
                              event.preventDefault();
                            }
                          }}
                          // onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))}
                          {...field}
                          invalid={errors.mobileOtp1 && true}
                          onChange={(e) =>
                            field.onChange(e.target.value.replace(/\D/g, ""))
                          }
                        />
                      )}
                    />
                  </div>{" "}
                  {errors.mobileOtp1 && (
                    <FormFeedback>
                      {errors.mobileOtp1.message}
                    </FormFeedback>
                  )}
                </>
              )}

              {goLoginFlag && (<Row className='mb-1' >
                <Col sm={12}>
                  <Label className="form-label" for="mobile-Otp">
                    Category
                  </Label>
                  <Controller
                    id="FkCategoryId"
                    name="FkCategoryId"
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
                </Col>


              </Row>)}
              {goLoginFlag && (<Row className='mb-1' >
                <Col sm={12}>
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
                        invalid={errors.MemberShipNumber && true}


                        {...field}
                      />
                    )}
                  />
                  {errors.MemberShipNumber && <FormFeedback>{errors.MemberShipNumber.message}</FormFeedback>}

                </Col>


              </Row>)}
            </>
          )}

          {!goLoginFlag && showHideBtn && (
            <Button color="danger" block onClick={mobileOTPSend} >
              Send Mobile OTP
            </Button>
          )}

          {goLoginFlag && (
            <Button color="danger" block onClick={submitCategory} >
              Save
            </Button>
          )}
          {errorMessage && showOnlyEmail && (
            <div className="mb-1" style={{ color: '#bd0101' }} role="alert">
              {errorMessage}
            </div>
          )}
          {!showHideBtn && showOnlyEmail && (<>
            <Button color="danger" block disabled={btnDisable}>
              Validate Email
            </Button>

            <p className="text-center mt-2">
              <span className="me-25">Didn't get the OTP ? </span>
              <span>
              {seconds > 0 || minutes > 0 ? (
                        <span className="text-danger">
                          {" "}
                          {  seconds < 10 ? `00:0${seconds}` : `00:`+seconds}
                          {" "}
                        </span>
                      ) : (
                        <span
                          onClick={ResendOtpFuncEmail}
                          className="text-danger"
                          style={{ cursor: "pointer" }}
                        >
                          Resend
                        </span>
                      )}

              </span>
            </p></>
          )}
          {errorMessage && !showOnlyEmail && (
            <div className="mb-1" style={{ color: '#bd0101' }} role="alert">
              {errorMessage}
            </div>
          )}

          {!goLoginFlag && !showOnlyEmail && !showHideBtn && (<>
            <Button color="danger" block onClick={() => {
              mobileValidate(getValues(sourceTypeRefs == 1 ? 'mobileOtp' : 'mobileOtp1'))
            }
            }>
              Validate Mobile
            </Button>
          </>)}
        </Form>

        {(!goLoginFlag && showHideBtn == false && !showOnlyEmail) && (
          <p className="text-center mt-2">
            <span className="me-25">Didn't get the OTP ? </span>
            <span>
                {seconds > 0 || minutes > 0 ? (
                        <span className="text-danger">
                          {" "}
                          {  seconds < 10 ? `00:0${seconds}` : `00:`+seconds}
                          {" "}
                        </span>
                      ) : (
                        <span
                          onClick={ResendOtpFunc}
                          className="text-danger"
                          style={{ cursor: "pointer" }}
                        >
                          Resend
                        </span>
                      )}
            </span>
          </p>
        )}

        <p className="text-center mt-2">
          <Link to="/login">
            <ChevronLeft
              className="rotate-rtl me-25 text-danger"
              size={14}
            />
            <span className="align-middle text-danger">
              Back to Login
            </span>
          </Link>
        </p>
      </Col>
    </Col>
  </Row>
</div>
</div>
  );
};

export default RegistrationVerificationCover;
