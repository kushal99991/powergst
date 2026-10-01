import { useContext, useEffect, useState, Fragment, useRef } from 'react'
import toast from 'react-hot-toast'
import { useForm, Controller } from 'react-hook-form'
import errorCodeConfig from '../../../configs/apiErrorCodeConfig'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Select, { components } from 'react-select'
import { selectThemeColors } from '@utils'
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

import formService from '../../../services/master/formService'


const defaultValues = {
    formName: '',
    icon: '',
    frontFormName: '',
    isChild: false,
    parentForm: 0
}

const MySwal = withReactContent(Swal)


const formMaster = () => {

    const [formList, setformList] = useState([]);
    const [formDropdown, setFormDropdown] = useState([]);
    const [enableDisableParent, setEnableDisableParent] = useState(true);
    const [dropdownValue, setDropdownValue] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isChild, setIsChild] = useState(false);
    const formIdRef = useRef(null);
    const {
        control,
        setError,
        handleSubmit,
        formState: { errors },
        setValue
    } = useForm({ defaultValues })


    useEffect(() => {
        // Get form master data
        GetformList()
    }, [])

    //Get form list
    function GetformList() {
        formService.getForm().then(res => {
            if (res.status === 200 && res.data.status === errorCodeConfig.APIDefaultCode.Success) {
                setformList(res.data.data);
                var formList = [];
                for (var x = 0; x < res.data.data.length; x++) {
                    formList.push({
                        value: res.data.data[x].formId,
                        label: res.data.data[x].formName
                    });
                }

                setFormDropdown(formList);
            }
        });
    }

    //Save form
    const onSubmit = data => {
        if (formIdRef.value == undefined || formIdRef.value <= 0) {
            // Save form

            const form = {
                formName: data.formName,
                formAddedBy: 1,
                parentID: selectedOption!=null && selectedOption.value!='' ?  selectedOption.value : 0,
            }
            formService.saveForm(form).then(res => {
                if (res.status === 200 && res.data.status === errorCodeConfig.APIDefaultCode.Success) {
                    toast.success(res.data.successMessage, {
                        position: "top-center",
                    });
                    resetForm();
                    GetformList();
                }
                else {
                    toast.error(res.data.errorMessage, {
                        position: "top-center",
                    });
                }
            });
        }
        else {
            // Update form
            if (selectedOption.value != null && formIdRef.value === selectedOption.value) {
                toast.error('Form and parent form cannot be same.', {
                    position: "top-center",
                });
            }
            else {
                const form = {
                    formName: data.formName,
                    UpdatedBy: 1,
                    parentID: selectedOption!=null && selectedOption.value!='' ?  selectedOption.value : 0,
                    formId: formIdRef.value
                }
                formService.updateForm(form).then(res => {
                    if (res.status === 200 && res.data.status === errorCodeConfig.APIDefaultCode.Success) {
                        toast.success(res.data.successMessage, {
                            position: "top-center",
                        });
                        resetForm();
                        GetformList();
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
    }

    //Delete form
    const DeleteForm = (formId) => {
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
                const formDeletedBy = 1;
                formService.deleteForm(formId, formDeletedBy).then(res => {
                    if (res.status === 200 && res.data.status === errorCodeConfig.APIDefaultCode.Success) {
                        toast.success(res.data.successMessage, {
                            position: "top-center",
                        });
                        GetformList()
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

    //Edit form get data by id
    const EditForm = (formId) => {
        formService.editForm(formId).then(res => {
            if (res.status === 200 && res.data.status === errorCodeConfig.APIDefaultCode.Success) {
                formIdRef.value = res.data.data.formId;
                defaultValues.formName = res.data.data.formName;
                setValue("formName", defaultValues.formName)
                if (res.data.data.parentID > 0) {
                    setIsChild(true)
                    setEnableDisableParent(false);
                    const filterVal = formDropdown.filter(p => p.value == res.data.data.parentID)[0];
                    filterValue(filterVal)
                }
                else {
                    setIsChild(false)
                    setEnableDisableParent(true);
                    filterValue({ value: '', label: 'Select' })
                }
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
        setValue("formName", '');
        formIdRef.value = 0;
        filterValue({ value: '', label: 'Select' })
        setIsChild(false)
        setEnableDisableParent(true);
    }

    //Handle change event of checkbox
    const handleChange = () => {
        setIsChild(!isChild)
        if (!isChild)
            setEnableDisableParent(false);
        else {
            filterValue({ value: '', label: 'Select' })
            setEnableDisableParent(true);
        }
    };

    const filterValue = (selectedOption) => {
        setSelectedOption(selectedOption)
    }

    return (
        <Fragment>
            <Card>
                <CardHeader className='border-bottom'>
                    <CardTitle tag='h4'>Form Master</CardTitle>
                </CardHeader>
                <CardBody className='py-2 my-25'>
                    <Form className='mt-2 pt-50' onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                        <Row>
                            <Col sm='6' className='mb-1'>
                                <Label className='form-label' for='formName'>
                                    Form Name
                                </Label>
                                <Controller
                                    id="formName"
                                    name='formName'
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <Input id='formName' placeholder='Client Master' invalid={errors.formName && true} {...field} />
                                    )}
                                />
                                {errors && errors.formName && <FormFeedback>Please enter a valid form name</FormFeedback>}
                            </Col>
                            
                            <Col sm='1' className='mb-1'>

                                <div className='form-check form-check-danger'>
                                    <Input type='checkbox'
                                        id="isChild"
                                        name='isChild'
                                        checked={isChild}
                                        onChange={(e) => handleChange(e.target.value)}
                                    />
                                    <Label className='form-check-label' for='isChild'>
                                        Is Child ?
                                    </Label>
                                </div>
                            </Col>
                            
                            <Col sm='5' className='mb-1'>
                                <Label className='form-label' for='parentForm'>
                                    Parent Form
                                </Label>

                                <Select

                                    theme={selectThemeColors}
                                    className='react-select'
                                    classNamePrefix='select'
                                    value={selectedOption}
                                    options={formDropdown}
                                    isClearable={false}
                                    onChange={filterValue}
                                    isDisabled={enableDisableParent}
                                />
                                {errors && errors.parentForm && <FormFeedback>Please select parent form</FormFeedback>}
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
                    <CardTitle tag='h4'>Form List</CardTitle>
                </CardHeader>
                <CardBody className='py-2 my-25'>
                    <Table>
                        <thead>
                            <tr>
                                <th>
                                    Form Id
                                </th>
                                <th>
                                    Form Name
                                </th>
                                <th>
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {formList.map((item) => (
                                <tr key={item.formId}>
                                    <td>{item.formId}</td>
                                    <td>{item.formName}</td>
                                    <td>
                                        <a onClick={() => EditForm(item.formId)}>

                                            <Edit2 size={24} />
                                        </a>
                                        <a onClick={() => DeleteForm(item.formId)}>

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

export default formMaster