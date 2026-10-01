// ** React Imports
import { Fragment, useState } from 'react'
import moment from 'moment/moment'
import toast from 'react-hot-toast'
// ** Utils
import { isObjEmpty } from '@utils'
import { SECRET_PARAMETER } from '../../../configs/config'
import encryptData from '../../../auth/crypto/crypto'
// ** Third Party Components
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { ArrowLeft, ArrowRight } from 'react-feather'
import { yupResolver } from '@hookform/resolvers/yup'
// ** Model
import Registration from '../../../model/registration'
import userRegistrationService from '../../../services/registrationService'
import errorCodeConfig from '../../../configs/apiErrorCodeConfig'

// ** Reactstrap Imports
import { Form, Label, Input, Row, Col, Button, FormFeedback } from 'reactstrap'

const defaultValues = {
  firstName: '',
  lastName: '',
  mobile: '',
  email: '',
  password: '',
  confirmPassword: ''
}

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

const AddUserAccountDetails = ({ stepper }) => {

  const [block, setBlock] = useState(false)

  const SignupSchema = yup.object().shape({
    firstName: yup.string().required('Please enter first name'),
    lastName: yup.string().required('Please enter last name'),
    mobile: yup.string()
      .matches(phoneRegExp, 'Mobile number is not valid')
      .min(10, 'Mobile number is not valid')
      .max(10, 'Mobile number is not valid')
      .required('Please enter mobile number'),
    email: yup.string().email('Please enter valid email').required('Please enter email'),
    password: yup.string().required('Please enter password'),
    confirmPassword: yup
      .string()
      .required('Please enter confirm password')
      .oneOf([yup.ref(`password`), null], 'Passwords must match')
  })

  // ** Hooks

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    resolver: yupResolver(SignupSchema)
  })

  const onSubmit = (data) => {
    stepper.next()
    // if (isObjEmpty(errors)) {
    //   const loginDate = moment(new Date()).format("hh:mm:ss");
    //   let encryptPassword = encryptData.encrypt(data.password + SECRET_PARAMETER + loginDate);
    //   const userData = new Registration(
    //     0,
    //     data.firstName,
    //     data.lastName,
    //     data.email,
    //     data.mobile,
    //     encryptPassword,
    //     8,
    //     '',
    //     0,
    //     localStorage.getItem("userId")
    //   );

    //   setBlock(true)
    //   userRegistrationService.UserRegistation(userData).then(res => {
    //     console.log(res);
    //     setBlock(false)

    //     if (res.status === 200 && res.data.status === errorCodeConfig.APIDefaultCode.Success) {
    //       stepper.next()
    //     } else {
    //       toast.error(message, {
    //         position: "top-right",
    //       });
    //     }
    //   }).catch(error => {
    //     setBlock(false)
    //     isErrMsg = true;
    //     message = error.message
    //   })
    // }
  }

  return (
    <Fragment>
      {block && <div className="loading1">Loading&#8230;</div>}
      <div className='content-header'>
        <h5 className='mb-0'>Account Details</h5>
        <small className='text-muted'>Enter Your Account Details.</small>
      </div>
      <Form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
        <Row>
          <Col md='6' className='mb-1'>
            <Label className='form-label requiredlable' for='firstName' >
              First Name
            </Label>
            <Controller
              id='firstName'
              name='firstName'
              control={control}
              render={({ field }) => <Input placeholder='John' invalid={errors.firstName && true} {...field} />}
            />
            {errors.firstName && <FormFeedback>{errors.firstName.message}</FormFeedback>}
          </Col>
          <Col md='6' className='mb-1'>
            <Label className='form-label requiredlable' for='lastName'>
              Last Name
            </Label>
            <Controller
              id='lastName'
              name='lastName'
              control={control}
              render={({ field }) => <Input placeholder='Deo' invalid={errors.lastName && true} {...field} />}
            />
            {errors.lastName && <FormFeedback>{errors.lastName.message}</FormFeedback>}
          </Col>
          <Col md='6' className='mb-1'>
            <Label className='form-label requiredlable' for='Mobile'>
              Mobile Number
            </Label>
            <Controller
              id='mobile'
              name='mobile'
              control={control}
              render={({ field }) => <Input placeholder='1234567890' invalid={errors.mobile && true} {...field} />}
            />
            {errors.mobile && <FormFeedback>{errors.mobile.message}</FormFeedback>}
          </Col>
          <Col md='6' className='mb-1'>
            <Label className='form-label requiredlable' for={`email`}>
              Email
            </Label>
            <Controller
              control={control}
              id='email'
              name='email'
              render={({ field }) => (
                <Input type='email' placeholder='john.doe@email.com' invalid={errors.email && true} {...field} />
              )}
            />
            {errors.email && <FormFeedback>{errors.email.message}</FormFeedback>}
          </Col>
        </Row>
        <Row>
          <div className='form-password-toggle col-md-6 mb-1'>
            <Label className='form-label requiredlable' for='password'>
              Password
            </Label>
            <Controller
              id='password'
              name='password'
              control={control}
              render={({ field }) => <Input type='password' invalid={errors.password && true} {...field} />}
            />
            {errors.password && <FormFeedback>{errors.password.message}</FormFeedback>}
          </div>
          <div className='form-password-toggle col-md-6 mb-1'>
            <Label className='form-label requiredlable' for='confirmPassword'>
              Confirm Password
            </Label>
            <Controller
              control={control}
              id='confirmPassword'
              name='confirmPassword'
              render={({ field }) => <Input type='password' invalid={errors.confirmPassword && true} {...field} />}
            />
            {errors.confirmPassword && <FormFeedback>{errors.confirmPassword.message}</FormFeedback>}
          </div>
        </Row>
        <div className='d-flex justify-content-between'>
          <Button color='secondary' className='btn-prev' outline disabled>
            <ArrowLeft size={14} className='align-middle me-sm-25 me-0'></ArrowLeft>
            <span className='align-middle d-sm-inline-block d-none'>Previous</span>
          </Button>
          <Button type='submit' color='danger' outline className='btn-next'>
            <span className='align-middle d-sm-inline-block d-none'>Next</span>
            <ArrowRight size={14} className='align-middle ms-sm-25 ms-0'></ArrowRight>
          </Button>
        </div>
      </Form>
    </Fragment>
  )
}

export default AddUserAccountDetails
