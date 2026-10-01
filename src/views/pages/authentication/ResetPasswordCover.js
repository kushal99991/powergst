// ** React Imports
import { useState, Fragment, useEffect } from 'react'
import { Link, useLocation, useSearchParams, useNavigate } from 'react-router-dom'

// ** Custom Hooks
import { useSkin } from '@hooks/useSkin'
import Swal from 'sweetalert2'

// ** Icons Imports
import { ChevronLeft } from 'react-feather'

// ** Custom Components
import InputPassword from '@components/input-password-toggle'

// ** Reactstrap Imports
import { Row, Col, CardTitle, CardText, Form, Label, Button, FormFeedback, Input } from 'reactstrap'

// ** Illustrations Imports
import illustrationsLight from '@src/assets/images/pages/reset-password-v2.svg'
import illustrationsDark from '@src/assets/images/pages/reset-password-v2-dark.svg'

// ** Styles
import '@styles/react/pages/page-authentication.scss'

// ** Third Party Components
import { useForm, Controller } from 'react-hook-form'
import toast from 'react-hot-toast'

// ** Spinner (Splash Screen)
import Spinner from './../../../@core/components/spinner/Loading-spinner'
import UILoader from './../../../@core/components/ui-loader'

// ** API - Service
import loginService from '../../../services/loginService'

//** Error Code file
import errorCodeConfig from '../../../configs/apiErrorCodeConfig'

import GenericGSTLogo from '@src/assets/images/logo/powerlogo.png'
import resetLogo from '@src/assets/images/pages/reset-new.jpg'
import moment from 'moment/moment'
// ** Encrypt & Decrypt file
import encryptData from '../../../auth/crypto/crypto'
import { SECRET_PARAMETER , messageShowDuration,navigateTimeOut } from '@configs/config'
import { globleVariable } from "../../../configs/globalVariable";


const defaultValues = {
  newPassword: '',
  confirmPassword: '',
}

const ResetPasswordCover = () => {
  // ** Hooks
  const { skin } = useSkin()
  const { search } = useLocation();
  const [searchParams] = new URLSearchParams(search);
  const [userToken, setUserToken] = useState(searchParams !== undefined ? searchParams[0] : null);
  const [btnDisable, setBtnDisable] = useState(false);
  const [block, setBlock] = useState(false)
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    trigger
  } = useForm({ defaultValues })
  const loginDate = moment(new Date()).format("hh:mm:ss");
  const navigate = useNavigate()

  const source = skin === 'dark' ? illustrationsDark : illustrationsLight


  // **  Remove session
localStorage.removeItem(globleVariable.userData);
localStorage.removeItem(globleVariable.sourceType);
localStorage.removeItem(globleVariable.userId);
localStorage.removeItem(globleVariable.subscriptionId);
sessionStorage.removeItem(globleVariable.isCompany);
 

  useEffect(() => {
    const userData = {
      token: userToken
    }
    loginService.resetPasswordValidateToken(userData).then(res => {
      if (res.status === 200 && res.data.status === errorCodeConfig.APIDefaultCode.Success) {
      } else {
        // setBtnDisable(true);
        toast.error(res.data.errorMessage, {
          position: "top-right", duration :  messageShowDuration
        });
      }
    }).catch(error => {
      Swal.fire({
            icon: 'error',
            title: '',
            text: error?.message,
            customClass: {
              confirmButton: 'btn btn-danger'
            },
            buttonsStyling: false
        });
    })
  }, [])


  //** Submit
  const onSubmit = data => {

    let encryptPassword = encryptData.encrypt(data.confirmPassword + SECRET_PARAMETER + loginDate);
    const users = {
      token: userToken,
      password: encryptPassword
    };
    const  entrptResetPasswordPayload = {
      data : encryptData.encrypt(JSON.stringify(users))
     }

    if (Object.values(data).every(field => field.length > 0)) {
      // ** Validate Password
      const validPasswrod = ValidatePassword(data);
      if (validPasswrod === true) {
        setBlock(true)
        // ** API - Service
        loginService.chagnePassword(entrptResetPasswordPayload).then(res => {
          const resetLinkDecptyData = encryptData.decrypt((res?.data?.data));
          const parsedResetData = JSON.parse(resetLinkDecptyData)
          console.log(parsedResetData,"loginDecptyData")
          setBlock(false)
          if (res.status === 200 && parsedResetData.status === errorCodeConfig.APIDefaultCode.Success) {
            toast.success(parsedResetData.successMessage, {
              position: "top-right",duration: messageShowDuration
            });
            setBtnDisable(true);

            localStorage.removeItem('userNm')
            localStorage.removeItem('userPw')
            localStorage.removeItem('rChk')

            setTimeout(() => {
              navigate('/login', { state: { emailId: parsedResetData?.data } });
            }, navigateTimeOut);
          } else {
            Swal.fire({
                        icon: 'error',
                        title: '',
                        text: parsedResetData?.errorMessage,
                        customClass: {
                          confirmButton: 'btn btn-danger'
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
                    confirmButton: 'btn btn-danger'
                  },
                  buttonsStyling: false
            })
        })
      } else {

        setError("confirmPassword", { message: "Passwords do not match.", required: true })
        // setError("confirmPassword", { message : "Passwords do not match." , required : true } )
      }
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

  // ** Validate Password
  const ValidatePassword = (data) => {
    if (data.newPassword === data.confirmPassword) {
      return true
    } else {
      return false
    }
  }

  //** Password Restriction Validate 
  const PasswordRestrictionValidate = (colValue) => {
    const regix = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$');
    const setPassword = getValues(colValue);
    var result = regix.test(setPassword);

    if (result === false) {
      return false
    } else {
      return true
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

  return (
    // <UILoader blocking={block} loader={<Loader />}>
    <div>
      {block && <div className="loading1">Loading&#8230;</div>}
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
              
              <Form className='auth-reset-password-form' onSubmit={!block && handleSubmit(onSubmit)} >
              <CardTitle
                tag="h2"
                className="fw-bolder text-dark mb-1 text-center"
              >
              {/* <img className='img-fluid col-lg-4 m-auto' src={GenericGSTLogo} alt='power-gst-logo' /> */}
                </CardTitle>
               
                <CardTitle tag='h2' className='fw-bold mb-1 text-center'>
                Reset Password
              </CardTitle>
               
                <div className='mb-1'>
                  <Label className='form-label requiredlable' for='new-password'>
                    New Password
                  </Label>
                  <Controller
                    id='newPassword'
                    name='newPassword'
                    control={control}

                    rules={{
                      required: "Please enter new password",
                      pattern: {
                        value: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/,
                        message: 'Password must have at least 8 characters include at least 1 lowercase character, 1 uppercase character, 1 number and 1 special character.'
                      }
                    }}

                    render={({ field }) => (
                      <InputPassword className='input-group-merge' autoFocus invalid={errors.newPassword && true}  {...field} />
                    )}
                  />
                  {errors.newPassword && <FormFeedback>{errors.newPassword.message}</FormFeedback>}

                </div>
                <div className='mb-1'>
                  <Label className='form-label requiredlable' for='confirm-password'>
                    Confirm Password
                  </Label>
                  <Controller
                    id='confirmPassword'
                    name='confirmPassword'
                    control={control}
                    rules={{
                      required: "Please enter confirm password",
                      pattern: {
                        value: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/,
                        message: 'Password must have at least 8 characters include at least 1 lowercase character, 1 uppercase character, 1 number and 1 special character.'
                      }
                    }}
                    render={({ field }) => (
                      <InputPassword className='input-group-merge' invalid={errors.confirmPassword && true}  {...field} />
                    )}
                  />
                  {errors.confirmPassword && <FormFeedback>{errors.confirmPassword.message}</FormFeedback>}
                </div>

                <Button color='danger' block disabled={btnDisable} >
                  Set New Password
                </Button>
              </Form>
              {/* <p className='text-center mt-2'>
                <Link to='/login'>
                  <ChevronLeft className='rotate-rtl me-25 text-danger' size={14} />
                  <span className='align-middle text-danger'>Back to login</span>
                </Link>
              </p> */}
            </Col>
          </Col>
        </Row>
      </div>
    </div>
    // </UILoader>
  )
}

export default ResetPasswordCover
