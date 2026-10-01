// ** React Imports
import { useEffect, useState, Fragment } from 'react'
import { Link, useNavigate } from 'react-router-dom'
// ** Custom Hooks
import { useSkin } from '@hooks/useSkin'
// ** Icons Imports
import { ChevronLeft } from 'react-feather'
// ** Reactstrap Imports
import { Row, Col, CardTitle, CardText, Form, Label, Input, Button, FormFeedback } from 'reactstrap'
import encryptData from "../../../auth/crypto/crypto";
// ** Styles
import '@styles/react/pages/page-authentication.scss'
// ** Third Party Components
import { useForm, Controller } from 'react-hook-form'
import toast from 'react-hot-toast'
// ** API - Service
import loginService from '../../../services/loginService'
// ** config
import { URL_FORGETMAIL,messageShowDuration } from '@configs/config'
//** Error Code file
import errorCodeConfig from '../../../configs/apiErrorCodeConfig'
import GenericGSTLogo from '@src/assets/images/logo/powerlogo.png'
import forgetNewLogo from '@src/assets/images/pages/forgot-new.jpg'
import { globleVariable } from "../../../configs/globalVariable";
import { handleKeyPressText, handlePasteText } from '../../../helper/validation'


const defaultValues = {
  emailId: '',
}

// **  Remove session
localStorage.removeItem(globleVariable.userData);
localStorage.removeItem(globleVariable.sourceType);
localStorage.removeItem(globleVariable.userId);
localStorage.removeItem(globleVariable.subscriptionId);
sessionStorage.removeItem(globleVariable.isCompany);


const ForgotPasswordCover = () => {
  // ** Hooks
  const { skin } = useSkin()
  const [block, setBlock] = useState(false)
  const [btnDisable, setBtnDisable] = useState(false);
  const navigate = useNavigate()

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    clearErrors
  } = useForm({ defaultValues })



  useEffect(() => {
    return () => setBlock(false)
  }, [])

  //** Submit
  const onSubmit = data => {
    if (Object.values(data).every(field => field.length > 0)) {

      const users = {
        email: data.emailId,
        url: URL_FORGETMAIL
      }

      //** API Service Call
      setBlock(true)
      const  entrptResetPasswordPayload = {
        data : encryptData.encrypt(JSON.stringify(users))
       }
      
      loginService.forgetPassword(entrptResetPasswordPayload).then(res => {
        console.log(res,"loginDecptyData");
        const resetLinkDecptyData = encryptData.decrypt((res?.data?.data));
        const parsedResetData = JSON.parse(resetLinkDecptyData)
        console.log(parsedResetData,"loginDecptyData")
        if (res.status === 200 && parsedResetData?.status === errorCodeConfig.APIDefaultCode.Success) {
          setBlock(false)
          setBtnDisable(true);
          toast.success(parsedResetData.successMessage, {
            position: "top-right",duration: messageShowDuration
          });

          localStorage.removeItem(globleVariable.userNm)
          localStorage.removeItem(globleVariable.userPw)
          localStorage.removeItem(globleVariable.rChk)

          setTimeout(() => {
            navigate('/login', { state: { emailId: users.email  } });
          }, 3000);

        } else {
          setBlock(false)
          setError("emailId", { message: parsedResetData.errorMessage, required: true })
        }
      }).catch(error => {
        setBlock(false)
        toast.error(error.message, { position: "top-right",duration: messageShowDuration});
      })
    } else {
      setBlock(false)
      for (const key in data) {
        if (data[key].length === 0) {
          setError(key, {
            type: 'manual'
          })
        }
      }
    }
  }


  return (
    <div>
      {block && <div className="loading1">Loading&#8230;</div>}
      <div className='auth-wrapper auth-cover'>
        <Row className='auth-inner m-0 bg-white'>
          <Link className='brand-logo' to='/' onClick={e => e.preventDefault()}>
          </Link>
          <Col className='d-none d-lg-flex align-items-center p-5' lg='6' sm='12'>
            <Link className='brand-logo col-lg-6' to='/' onClick={e => e.preventDefault()}>
               <img className='img-fluid col-lg-3 m-auto' src={GenericGSTLogo} alt='power-gst-logo' />
            </Link>
            <div className='col-lg-11 m-auto d-lg-flex align-items-center justify-content-center px-5'>
              <img className='img-fluid' src={forgetNewLogo} alt='Login Cover' />
            </div>
          </Col>
          <Col className='d-flex align-items-center auth-bg px-2 p-lg-5 bg-light' lg='6' sm='12'>
            <Col className='px-xl-2 m-auto' sm='8' md='6' lg='8'>

              <Form className='auth-forgot-password-form ' onSubmit={ !block && handleSubmit(onSubmit)}>
              <CardTitle
                tag="h2"
                className="fw-bolder text-dark mb-1 text-center"
              >
                </CardTitle>
                <CardTitle tag='h2' className='fw-bold mb-1 text-center'>
                Forgot Password ?
              </CardTitle>
                <div className='mb-1'>
                  <Label className='form-label requiredlable' for='login-email'>
                    Email
                  </Label>
                  <Controller
                    id='emailId'
                    name='emailId'
                    control={control}
                    rules={{
                      required: "Please enter valid email.",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Please enter valid email."
                      }
                    }}
                    render={({ field }) => (
                      <Input
                        maxLength={100}
                        autoFocus
                        placeholder='john@example.com'
                        invalid={errors?.emailId?.message && true}
                        {...field}
                        onPaste={(e) => handlePasteText(e, setError,'emailId','email','email')}
                        onKeyPress={(e) => handleKeyPressText(e, setError,'emailId')}
                      />
                    )}
                  />
                  {errors.emailId && <FormFeedback>{errors.emailId.message}</FormFeedback>}
                </div>
                <Button type='submit' color='danger' block disabled={btnDisable} >
                  Send reset link
                </Button>
                <p className='text-center mt-2'>
                <Link to='/login'>
                  <ChevronLeft className='rotate-rtl me-25 text-danger' size={14} />
                  <span className='align-middle text-danger'>Back to login</span>
                </Link>
              </p>
              </Form>

            </Col>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default ForgotPasswordCover
