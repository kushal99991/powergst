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

import roleService from '../../../services/master/roleService'

const defaultValues = {
    roleName: ''
}

const MySwal = withReactContent(Swal)

const roleMaster = () => {

    const [roleList, setRoleList] = useState([]);
    const roleIdRef = useRef(null);

    const {
        control,
        setError,
        handleSubmit,
        formState: { errors },
        setValue
    } = useForm({ defaultValues })

    useEffect(() => {
        // Get role master data
        GetRoleList()
    }, [])

    //Get role list
    function GetRoleList() {
        roleService.getRole().then(res => {
            if (res.status === 200 && res.data.status === errorCodeConfig.APIDefaultCode.Success) {
                setRoleList(res.data.data);
            }
        });
    }

    //Save role
    const onSubmit = data => {
        if (Object.values(data).every(field => field.length > 0)) {

            if (roleIdRef.value == undefined || roleIdRef.value <= 0) {
                // Save Role
                const role = {
                    roleName: data.roleName,
                    roleAddedBy: 1
                }
                roleService.saveRole(role).then(res => {
                    if (res.status === 200 && res.data.status === errorCodeConfig.APIDefaultCode.Success) {
                        toast.success(res.data.successMessage, {
                            position: "top-center",
                        });
                        setValue("roleName", '');
                        GetRoleList();
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
                // Update role
                const role = {
                    roleId: roleIdRef.value,
                    roleName: data.roleName,
                    roleUpdatedBy: 1
                }
                roleService.updateRole(role).then(res => {
                    if (res.status === 200 && res.data.status === errorCodeConfig.APIDefaultCode.Success) {
                        toast.success(res.data.successMessage, {
                            position: "top-center",
                        });
                        setValue("roleName", '');
                        roleIdRef.value = 0;
                        GetRoleList();
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

    //Delete role
    const DeleteRole = (roleId) => {
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
                const roleDeletedBy = 1;
                roleService.deleteRole(roleId, roleDeletedBy).then(res => {
                    if (res.status === 200 && res.data.status === errorCodeConfig.APIDefaultCode.Success) {
                        toast.success(res.data.successMessage, {
                            position: "top-center",
                        });
                        GetRoleList()
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

    //Edit role get data by id
    const EditRole = (roleId) => {
        roleService.editRole(roleId).then(res => {
            if (res.status === 200 && res.data.status === errorCodeConfig.APIDefaultCode.Success) {
                roleIdRef.value = res.data.data.roleId;
                defaultValues.roleName = res.data.data.roleName;
                setValue("roleName", defaultValues.roleName)
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
        setValue("roleName", '');
        roleIdRef.value = 0;
    }

    return (
        <Fragment>
            <Card>
                <CardHeader className='border-bottom'>
                    <CardTitle tag='h4'>Role Master</CardTitle>
                </CardHeader>
                <CardBody className='py-2 my-25'>
                    <Form className='mt-2 pt-50' onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                        <Row>
                            <Col sm='6' className='mb-1'>
                                <Label className='form-label' for='roleName'>
                                    Role Name
                                </Label>
                                <Controller
                                    id="roleName"
                                    name='roleName'
                                    control={control}
                                    render={({ field }) => (
                                        <Input id='roleName' placeholder='HR/Admin' invalid={errors.roleName && true} {...field} />
                                    )}
                                />
                                {errors && errors.roleName && <FormFeedback>Please enter a valid role name</FormFeedback>}
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
                    <CardTitle tag='h4'>Role List</CardTitle>
                </CardHeader>
                <CardBody className='py-2 my-25'>
                    <Table>
                        <thead>
                            <tr>
                                <th>
                                    Role Id
                                </th>
                                <th>
                                    Role Name
                                </th>
                                <th>
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {roleList.map((item) => (
                                <tr key={item.roleId}>
                                    <td>{item.roleId}</td>
                                    <td>{item.roleName}</td>
                                    <td>
                                        <a onClick={() => EditRole(item.roleId)}>

                                            <Edit2 size={24} />
                                        </a>
                                        <a onClick={() => DeleteRole(item.roleId)}>

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

export default roleMaster