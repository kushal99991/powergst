import { useContext, useEffect, useState, Fragment, useRef } from 'react'
import toast from 'react-hot-toast'
import { useForm, Controller } from 'react-hook-form'
import errorCodeConfig from '../../../configs/apiErrorCodeConfig'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
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
    Card,
    CardBody,
    CardHeader,
    Table,
    UncontrolledTooltip
} from 'reactstrap'

import {
    Edit2,
    Trash2,
} from 'react-feather'

import actionService from '../../../services/master/actionService'

const defaultValues = {
    actionName: ''
}

const MySwal = withReactContent(Swal)

const actionmaster = () => {

    const [actionList, setActionList] = useState([]);
    const actionIdRef = useRef(null);
    actionIdRef.value = 0;

    const {
        control,
        setError,
        handleSubmit,
        formState: { errors },
        setValue
    } = useForm({ defaultValues })

    useEffect(() => {
        // Get action master data
        GetActionList()
    }, [])

    //Get action list
    function GetActionList() {
        actionService.getAction().then(res => {
            if (res.status === 200 && res.data.status === errorCodeConfig.APIDefaultCode.Success) {
                setActionList(res.data.data);
            }
        });
    }

    //Save action
    const onSubmit = data => {
        if (Object.values(data).every(field => field.length > 0)) {

            if (actionIdRef.value <= 0) {
                // Save action
                const action = {
                    actionName: data.actionName,
                    actionAddedBy: 1
                }
                actionService.saveAction(action).then(res => {
                    if (res.status === 200 && res.data.status === errorCodeConfig.APIDefaultCode.Success) {
                        toast.success(res.data.successMessage, {
                            position: "top-center",
                        });
                        setValue("actionName", '');
                        GetActionList();
                    }
                    else {
                        Swal.fire({
                                    icon: 'error',
                                    title: '',
                                    text: res?.data?.errorMessage,
                                })
                    }
                });
            }
            else {
                // Update action
                const action = {
                    actionId: actionIdRef.value,
                    actionName: data.actionName,
                    actionUpdatedBy: 1
                }
                actionService.updateAction(action).then(res => {
                    if (res.status === 200 && res.data.status === errorCodeConfig.APIDefaultCode.Success) {
                        toast.success(res.data.successMessage, {
                            position: "top-center",
                        });
                        setValue("actionName", '');
                        actionIdRef.value = 0;
                        GetActionList();
                    }
                    else {
                        Swal.fire({
                                    icon: 'error',
                                    title: '',
                                    text: res?.data?.errorMessage,
                                })
                    }
                });
            }

        }
        else {
            for (const key in data) {
                if (data[key].length === 0) {
                    setError(key, {
                        type: 'manual'
                    })
                }
            }
        }
    }

    //Delete action
    const DeleteAction = (actionId) => {
        return MySwal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            customClass: {
                confirmButton: 'btn btn-danger',
                cancelButton: 'btn btn-outline-danger ms-1'
            },
            buttonsStyling: false
        }).then(function (result) {
            if (result.value) {
                const actionDeletedBy = 1;
                actionService.deleteAction(actionId, actionDeletedBy).then(res => {
                    if (res.status === 200 && res.data.status === errorCodeConfig.APIDefaultCode.Success) {
                        toast.success(res.data.successMessage, {
                            position: "top-center",
                        });
                        GetActionList()
                    }
                    else {
                        Swal.fire({
                                    icon: 'error',
                                    title: '',
                                    text: res?.data?.errorMessage,
                                })
                    }
                });
            }
        })
    }

    //Edit action get data by id
    const EditAction = (actionId) => {
        actionService.editAction(actionId).then(res => {
            if (res.status === 200 && res.data.status === errorCodeConfig.APIDefaultCode.Success) {
                actionIdRef.value = res.data.data.actionId;
                defaultValues.actionName = res.data.data.actionName;
                setValue("actionName", defaultValues.actionName)
            }
            else {
                toast.error(res.data.errorMessage, {
                    position: "top-center",
                });
            }
        });
    }

    //Reset form 
    const resetForm = () => {
        setValue("actionName", '');
        actionIdRef.value = 0;
    }

    return (
        <Fragment>
            <Card>
                <CardHeader className='border-bottom'>
                    <CardTitle tag='h4'>Action Master</CardTitle>
                </CardHeader>
                <CardBody className='py-2 my-25'>
                    <Form className='mt-2 pt-50' onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                        <Row>
                            <Col sm='6' className='mb-1'>
                                <Label className='form-label' for='actionName'>
                                    Action Name
                                </Label>
                                <Controller
                                    id="actionName"
                                    name='actionName'
                                    control={control}
                                    render={({ field }) => (
                                        <Input id='actionName' placeholder='Add/Update/Delete' invalid={errors.actionName && true} {...field} />
                                    )}
                                />
                                {errors && errors.actionName && <FormFeedback>Please enter a valid action name</FormFeedback>}
                            </Col>


                            <Col className='mt-2' sm='12'>
                                <Button type='submit' className='me-1' color='danger'>
                                    Save changes
                                </Button>
                                <Button color='secondary' outline type='button' onClick={resetForm}>
                                    Discard
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </CardBody>
            </Card>
            <Card>
                <CardHeader className='border-bottom'>
                    <CardTitle tag='h4'>Action List</CardTitle>
                </CardHeader>
                <CardBody className='py-2 my-25'>
                    <Table>
                        <thead>
                            <tr>
                                <th>
                                    Action Id
                                </th>
                                <th>
                                    Action Name
                                </th>
                                <th>
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {actionList.map((item) => (
                                <tr key={item.actionId}>
                                    <td>{item.actionId}</td>
                                    <td>{item.actionName}</td>
                                    <td>
                                        <a onClick={() => EditAction(item.actionId)}>

                                            <Edit2 size={24} />
                                        </a>
                                        <a onClick={() => DeleteAction(item.actionId)}>

                                            <Trash2 size={24} />
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </CardBody>
            </Card>
        </Fragment>
    )
}

export default actionmaster