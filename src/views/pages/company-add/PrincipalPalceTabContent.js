// ** React Imports
import { Fragment, useState, useEffect, useLayoutEffect } from 'react'

// ** Third Party Components
import Select from 'react-select'
import Swal from 'sweetalert2'

import { useForm, Controller } from 'react-hook-form'
import 'cleave.js/dist/addons/cleave-phone.us'
import toast from 'react-hot-toast'
import classnames from 'classnames'
import { Link, useLocation, useSearchParams, useNavigate } from 'react-router-dom'
// ** Reactstrap Imports
import { Row, Col, Form, Card, Input, Label, Button, CardBody, CardTitle, CardHeader, FormFeedback, CardText, UncontrolledTooltip } from 'reactstrap'

// ** Utils
import { selectThemeColors } from '@utils'
//** Error Code file
import errorCodeConfig from '../../../configs/apiErrorCodeConfig'
import { useDispatch, useSelector } from 'react-redux'
import PrinciplaPlaceModel, { PrincipalPlaceEditModel } from '../../../model/principal-place'
import companyService from '../../../services/company/companyNewService';

// ** Spinner (Splash Screen)
import Spinner from './../../../@core/components/spinner/Loading-spinner'

// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/pages/page-form-validation.scss'
import { DROPDOWN_PLACEHOLDER } from '../../../configs/config'

import { useHotkeys } from "react-hotkeys-hook";
import { keysMap, enableOnFormTags } from "../../../configs/config";
import { globleVariable } from '../../../configs/globalVariable'
import LocalFunction from '../../../configs/getLocalFunction'
import { getAllCopmpanyDataById } from '../../../views/apps/user/store'
import { messageShowDuration } from '@configs/config'

const stateOptionsLists =  JSON.parse(LocalFunction?.getLocalValue(globleVariable?.stateList , true));
const stateOptionsList =  JSON.parse(stateOptionsLists)
// JSON.parse(localStorage.getItem("StateList"))

// ** Hooks
const defaultValues = {
  flatno: '',
  floorno: '',
  buildingname: '',
  roadstreet: '',
  arealocaility: '',
  citydistict: '',
  state: '',
  pincode: '',
  stateSelect: null
}


const PrincipalPalceTabs = props => {

  const { store, importsId , activeTabs , userIds ,subscriptionIds   } = props;

  // const [importSearch, setImportSearch] = useState(localStorage.getItem(globleVariable.vimportData) !== null && localStorage.getItem(globleVariable.vimportData) !== '' &&
  //   localStorage.getItem(globleVariable.vimportData) !== undefined ? localStorage.getItem(globleVariable.vimportData) : null)

  const { search } = useLocation();
  const [searchParams] = new URLSearchParams(search);
  const location = useLocation();
  let decrptyUrl = null;

  if (searchParams !== undefined) {
    // decrptyUrl = encryptData.decrypt(searchParams[0])
  } else {
    decrptyUrl = null;
  }

  let clientId = null
  if (location.state !== null) {
    clientId = location.state.clientId !== null ? location.state.clientId : null;
  }

  // ** States
  const [editClientId, setEditClientId] = useState(clientId);
  const [stateid, setStateid] = useState({ value: '0', label: '--Select State--' });
  const [block, setBlock] = useState(false)
  const [clientPrinciplePlaceId, setClientPrinciplePlaceId] = useState(null)
  const [importDataSearch, setImportDataSearch] = useState(false);
  const [btnDisable, setBtnDisable] = useState(false)
  const [searchApi , setSearchApi] = useState(false)
  const [searchData , setSearchData] = useState(false)
  const dispatch = useDispatch()

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    clearErrors
  } = useForm({ defaultValues })


  useEffect(() => {
    return () => setBlock(false)
  }, [])


  //** Reset form
  const resetForm = () => {
    setBtnDisable(false)
    reset();
  }

    //** Shortcut keys
    useHotkeys(keysMap.SAVE_DATA, () =>  { activeTabs  == 2  && block == false &&  handleSubmit(onSubmit)() } , {
      enableOnFormTags,
  });

  const Loader = () => {
    return (
      <Fragment>
        <Spinner />
        <CardText className='mb-0 mt-1 text-white'>Please Wait...</CardText>
      </Fragment>
    )
  }


  //** Search - edit
  useEffect(() => {
   
    if (editClientId !== null && editClientId !== "") {
      setEditClientId(editClientId)
      console.log('edit show')
      if (store.allCopmpanyDataById.data !== undefined) {
        clearErrors()
        setTimeout(() => {
          console.log(store.allCopmpanyDataById)
          setValueCompany(store.allCopmpanyDataById.data.principleOfBusiness);
        }, 2000);
      }
    }
  }, [store])

  // ** save 
  useEffect(() => {
   
    if (editClientId !== null && editClientId !== "" && searchData == true ) {
      setEditClientId(editClientId)
      console.log('edit show')
      if (store.allCopmpanyDataById.data !== undefined) {
        clearErrors()
        setTimeout(() => {
          console.log(store.allCopmpanyDataById)
          setValueCompany(store.allCopmpanyDataById.data.principleOfBusiness);
          
        }, 2000);
      }
    }
  }, [searchData])

  useEffect(() => {
   
    if (editClientId !== null && editClientId !== '' && searchApi == true ) {
      dispatch(getAllCopmpanyDataById(editClientId))
      setSearchData(true)
    }
  }, [searchApi])


  //** Search with import company
  useEffect(() => {
    if (importsId !== null && importsId !== "") {
      setEditClientId(importsId)
      if (store.importData.data !== undefined) {
        setTimeout(() => {
          setValueCompany(store.importData.data.principleOfBusiness);
        }, 2000);
      }
    }
  }, [store])


  //** Set Value
  const setValueCompany = (data) => {
    setSearchApi(false)
    setSearchData(false)
    if (data.length > 0) {
      clearErrors()
      //setEditClientId(importSearch)
      setValue("flatno", data[0]['buildingNo'])
      setValue("floorno", data[0]['floorNumber'])
      setValue("buildingname", data[0]['buildingName'])
      setValue("roadstreet", data[0]['roadStreet'])
      setValue("citydistict", data[0]['district'])
      setValue("pincode", data[0]['pincode'])
      setClientPrinciplePlaceId(data[0]['clientPrinciplePlaceId'])
      setValue("arealocaility", data[0]['area'])
      const filterState = stateOptionsList.filter(p => p.value == data[0]['stateId'])[0]
      setValue("stateSelect", filterState)
    }
  }

  //** Validation string trim
  const ValidateString = (data) => {
    if (data == undefined || data == "" || data.trim().length == 0) {
      return false;
    }
    else {
      return true;
    }
  }

  //** onSubmit
  const onSubmit = data => {
    let IsValid = true;

    if (!ValidateString(data.flatno)) {
      setError('flatno', { type: 'manual', message: 'Invalid Flat No' })
      IsValid = false;
    }
    if (!ValidateString(data.buildingname)) {
      setError('buildingname', { type: 'manual', message: 'Invalid Building Name' })
      IsValid = false;
    }
    if (!ValidateString(data.roadstreet)) {
      setError('roadstreet', { type: 'manual', message: 'Invalid Road/Street' })
      IsValid = false;
    }
    if (!ValidateString(data.arealocaility)) {
      setError('arealocaility', { type: 'manual', message: 'Invalid Area/Locality' })
      IsValid = false;
    }
    if (!ValidateString(data.citydistict)) {
      setError('citydistict', { type: 'manual', message: 'Invalid City/District' })
      IsValid = false;
    }
    if (!ValidateString(data.pincode)) {
      setError('pincode', { type: 'manual', message: 'Invalid Pincode' })
      IsValid = false;
    }

    if (IsValid == true) {
      if (editClientId !== null && editClientId !== "" && clientPrinciplePlaceId !== null) {
        const companyData = new PrincipalPlaceEditModel(
          clientPrinciplePlaceId,
          editClientId,
          data.flatno.trim(),
          data.floorno.trim(),
          data.buildingname.trim(),
          data.roadstreet.trim(),
          data.arealocaility.trim(),
          data.citydistict.trim(),
          data.stateSelect.value,
          data.pincode.trim()
        )
        setBlock(true)
        setBtnDisable(true)
        companyService.editPrinciplePlaceofBusiness(companyData).then(res => {
          
          console.log(res)
          if (res.status === 200 && res.data.status === errorCodeConfig.APIDefaultCode.Success) {
            setBlock(false)
          
            toast.success(res.data.successMessage, {
              position: "top-right", duration: messageShowDuration
            });

            setBtnDisable(false)

          } else {
            setBlock(false)
            Swal.fire({
              icon: 'error',
              title: '',
              text: res.data.errorMessage,
              customClass: {
                confirmButton: 'btn btn-danger'
              },
              buttonsStyling: false
            })
            setBtnDisable(false)
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
        if (editClientId == null) {
          toast.error("Please add company.", {
            position: "top-right",
          });
          return false;
        }
        const companyData = new PrinciplaPlaceModel(
          editClientId,
          data.flatno.trim(),
          data.floorno.trim(),
          data.buildingname.trim(),
          data.roadstreet.trim(),
          data.arealocaility.trim(),
          data.citydistict.trim(),
          data.stateSelect.value,
          data.pincode.trim()
        )

        setBlock(true)
        companyService.addPrinciplePlaceofBusiness(companyData).then(res => {
         
          console.log(res)
          if (res.status === 200 && res.data.status === errorCodeConfig.APIDefaultCode.Success) {
            setBlock(false)
            setSearchApi(true)
            toast.success(res.data.successMessage, {
              position: "top-right",
              duration: messageShowDuration
            });
            
          } else {
            setBlock(false)
            Swal.fire({
              icon: 'error',
              title: '',
              text: res.data.errorMessage,
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
      }
    }

  }

  return (
    // <UILoader blocking={block} loader={<Loader />}>
    <Fragment>
      {block && <div className="loading1">Loading&#8230;</div>}
      <Card>
        <CardBody className='py-2 my-25'>
          <div className='content-header'>
            <h5 className='mb-0'>Principal Place Of Business</h5>
          </div>
          <Form className='mt-2 pt-50' onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col md='3' className='mb-1'>
                <Label className='form-label requiredlable'>
                  Building No/Flat No.
                </Label>
                <Controller
                  rules={{ required: true }}
                  id='flatno'
                  name='flatno'
                  control={control}
                  render={({ field }) => <Input placeholder='' invalid={errors.flatno && true} {...field} maxLength={250} />}
                />
                {errors.flatno && <FormFeedback>Please enter Flat No.</FormFeedback>}
              </Col>
              <Col md='3' className='mb-1'>
                <Label className='form-label'>
                  Floor Number
                </Label>
                <Controller
                  control={control}
                  id='floorno'
                  name='floorno'
                  render={({ field }) => (
                    <Input placeholder='' invalid={errors.floorno && true} {...field} maxLength={250} />
                  )}
                />
                {errors.floorno && <FormFeedback>Please enter floor no</FormFeedback>}
              </Col>
              <Col md='3' className='mb-1'>
                <Label className='form-label requiredlable'>
                  Building Name
                </Label>
                <Controller
                  control={control}
                  rules={{ required: true }}
                  id='buildingname'
                  name='buildingname'
                  render={({ field }) => (
                    <Input placeholder='' invalid={errors.buildingname && true} {...field} maxLength={250} />
                  )}
                />
                {errors.buildingname && <FormFeedback>Please enter building name</FormFeedback>}
              </Col>
              <Col md='3' className='mb-1'>
                <Label className='form-label requiredlable'>
                  Road/Street
                </Label>
                <Controller
                  control={control}
                  id='roadstreet'
                  name='roadstreet'
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Input placeholder='' invalid={errors.roadstreet && true} {...field} maxLength={250} />
                  )}
                />
                {errors.roadstreet && <FormFeedback>Please enter road/street</FormFeedback>}
              </Col>
            </Row>
            <Row>
              <Col md='3' className='mb-1'>
                <Label className='form-label requiredlable'>
                  Area/Locality
                </Label>
                <Controller
                  id='arealocaility'
                  name='arealocaility'
                  rules={{ required: true }}
                  control={control}
                  render={({ field }) => <Input placeholder='' type='textarea' rows='2' invalid={errors.arealocaility && true} {...field}  maxLength={250} />}
                />
                {/* <Input type='textarea' name='text' id='exampleText' rows='3' placeholder='Textarea' /> */}
                {errors.arealocaility && <FormFeedback>Please enter area/locality</FormFeedback>}
              </Col>
              <Col md='3' className='mb-1'>
                <Label className='form-label requiredlable'>
                  District/City
                </Label>
                <Controller
                  id='citydistict'
                  name='citydistict'
                  rules={{ required: true }}
                  control={control}
                  render={({ field }) => <Input placeholder='' invalid={errors.citydistict && true} {...field} maxLength={250} />}
                />
                {errors.citydistict && <FormFeedback>Please enter district/city</FormFeedback>}
              </Col>
              <Col md='3' className='mb-1'>
                <Label className='form-label requiredlable' for='react-select'>
                  State
                </Label>
                <Controller
                  id='react-select'
                  control={control}
                  name='stateSelect'
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select
                      isClearable={false}
                      value={field.value}
                      options={stateOptionsList}
                      placeholder={DROPDOWN_PLACEHOLDER}
                      classNamePrefix='select'
                      theme={selectThemeColors}
                      onChange={field.onChange}
                      className={classnames('react-select', { 'is-invalid': errors.stateSelect && true })}
                      {...field}
                    />
                  )}
                />
                {errors.stateSelect && <FormFeedback>Please select State</FormFeedback>}
              </Col>

              <Col md='3' className='mb-1'>
                <Label className='form-label requiredlable'>
                  Pin Code
                </Label>
                <Controller
                  id='pincode'
                  name='pincode'
                  rules={{ required: true }}
                  control={control}
                  render={({ field }) => <Input placeholder='' maxLength={6}
                    invalid={errors.pincode && true} {...field}
                    onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))}
                  />}
                />
                {errors.pincode && <FormFeedback>Please enter pincode</FormFeedback>}
              </Col>
            </Row>
            <div className='btnFixFooter'>
              <Row className='justify-content-end mx-0'>
                <Col className='d-flex align-items-center justify-content-end' md='6' sm='12'>
                  <Button id="savebtn" type='submit' className='me-1' color='danger' outline disabled={btnDisable} >
                    Save 
                  </Button>
                  <UncontrolledTooltip placement="top" target="savebtn">
                  Save [{keysMap.SAVE_DATA}]
                  </UncontrolledTooltip>
                  <Button color='secondary' onClick={resetForm} outline>
                    Reset
                  </Button>
                </Col>
              </Row>
            </div>
          </Form>
        </CardBody>
      </Card>
    </Fragment >
    // </UILoader>
  )
}

export default PrincipalPalceTabs
