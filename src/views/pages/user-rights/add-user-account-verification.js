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
import { globleVariable } from "../../../configs/globalVariable";
import LocalFunction from '../../../configs/getLocalFunction'


const defaultValues = {
    emailCode: '',
    mobileOTP: ''
}

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

const UserAccountVerificationDetails = ({ stepper }) => {

    const [block, setBlock] = useState(false)
    const userIds = LocalFunction.getLocalValue(globleVariable.userId, ture);

    const SignupSchema = yup.object().shape({
        emailOTP: yup.string().required('Please enter email code'),
        mobileOTP: yup.string().required('Please enter mobile otp')
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
        if (isObjEmpty(errors)) {
            const loginDate = moment(new Date()).format("hh:mm:ss");
            let encryptPassword = encryptData.encrypt(data.password + SECRET_PARAMETER + loginDate);
            const userData = new Registration(
                0,
                data.firstName,
                data.lastName,
                data.email,
                data.mobile,
                encryptPassword,
                8,
                '',
                0,
                userIds
            );

            setBlock(true)
            userRegistrationService.UserRegistation(userData).then(res => {
                console.log(res);
                setBlock(false)

                if (res.status === 200 && res.data.status === errorCodeConfig.APIDefaultCode.Success) {
                    stepper.next()
                } else {
                    toast.error(message, {
                        position: "top-right",
                    });
                }
            }).catch(error => {
                setBlock(false)
                isErrMsg = true;
                message = error.message
            })
        }
    }

    return (
        <Fragment>
            {block && <div className="loading1">Loading&#8230;</div>}
            <div className='content-header'>
                <h5 className='mb-0'>Account Verification</h5>
                <small className='text-muted'>Email / Mobile Verification</small>
            </div>
            <Form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
                <Row>
                    <Col md='6' className='mb-1'>
                        <Label className='form-label requiredlable' for='firstName' >
                            Email Code
                        </Label>
                        <Controller
                            id='emailOTP'
                            name='emailOTP'
                            control={control}
                            render={({ field }) => (
                                <Input
                                    maxLength={10}
                                    autoFocus
                                    type='text'
                                    placeholder='Email OTP'
                                    invalid={errors.emailOTP && true}
                                    {...field}
                                // onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))}

                                />
                            )}
                        />
                        {errors.emailOTP && <FormFeedback>{errors.emailOTP.message}</FormFeedback>}
                    </Col>
                    <Col md='6' className='mb-1'>
                        <Label className='form-label requiredlable' for='lastName'>
                            Mobile OTP
                        </Label>
                        <Controller
                            id='mobileOTP'
                            name='mobileOTP'
                            control={control}
                            render={({ field }) => (
                                <Input
                                    maxLength={10}
                                    type='text'
                                    placeholder='Mobile OTP'
                                    invalid={errors.mobileOTP && true}
                                    // onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))}
                                    {...field}
                                />
                            )}
                        />
                        {errors.mobileOTP && <FormFeedback>{errors.mobileOTP.message}</FormFeedback>}
                    </Col>
                </Row>
                <div className='d-flex justify-content-between'>
                    <Button type='button' color='secondary' outline className='btn-prev' onClick={() => stepper.previous()}>
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

export default UserAccountVerificationDetails
