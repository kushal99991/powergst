// ** React Imports
import { Fragment, useEffect, useRef, useState } from 'react'
import { Link, useLocation, useSearchParams, useNavigate } from 'react-router-dom'
// ** Third Party Components
import Select from 'react-select'
import Cleave from 'cleave.js/react'
import { useForm, Controller } from 'react-hook-form'
import 'cleave.js/dist/addons/cleave-phone.us'
import Flatpickr from 'react-flatpickr'


// ** Reactstrap Imports
import {
  Row, Col, Form, Card, Input, Label, Button, CardBody, CardTitle, CardHeader,
  FormFeedback,
  CardText,
  UncontrolledTooltip
} from 'reactstrap'
import moment from 'moment/moment'

// ** Utils
import { selectThemeColors } from '@utils'
import toast from 'react-hot-toast'
import $ from 'jquery'

// ** Spinner (Splash Screen)
import Spinner from './../../../@core/components/spinner/Loading-spinner'
import UILoader from './../../../@core/components/ui-loader'

//** Error Code file
import errorCodeConfig from '../../../configs/apiErrorCodeConfig'

import PromoterSignatoryModel, { PromoterSignatoryEditModel } from '../../../model/client-promoter-signatory'
import companyService from '../../../services/company/companyNewService';

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import encryptData from '../../../auth/crypto/crypto'

import classnames from 'classnames'
// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/pages/page-form-validation.scss'

// ** Handsontable
import { HotTable, HotColumn } from "@handsontable/react";
import Handsontable from 'handsontable';
import { registerRenderer, textRenderer } from 'handsontable/renderers';
import { registerAllModules } from 'handsontable/registry';
import { DROPDOWN_PLACEHOLDER } from '../../../configs/config'

import { useHotkeys } from "react-hotkeys-hook";
import { keysMap, enableOnFormTags } from "../../../configs/config";
import { globleVariable } from '../../../configs/globalVariable'
import LocalFunction from '../../../configs/getLocalFunction'
import { messageShowDuration } from '@configs/config'

const MySwal = withReactContent(Swal)

const stateOptionsLists =  JSON.parse(LocalFunction?.getLocalValue(globleVariable?.stateList , true));
const stateOptionsList =  JSON.parse(stateOptionsLists)


// ** Hooks
const defaultValues = {
  firstname: '',
  middlename: '',
  lastname: '',
  fatherhusbandfirstname: '',
  fatherhusbandmiddlename: '',
  fatherhusbandlastname: '',
  mobileno: '',
  phoneno: '',
  emailid: '',
  designation: '',
  panno: '',
  dinno: '',
  passportno: '',
  aadhaarno: '',
  buildingno: '',
  floornumber: '',
  buildingname: '',
  roadorstreet: '',
  areaorlocality: '',
  districtcity: '',
  pincode: '',
  stateSelect: null,
  dateOfBirth: ''

}

const PromotersPartnerTabs = props => {

  console.log('PromotersPartnerTabs')
  const { store, importsId , activeTabs } = props;
  const { search } = useLocation();
  const location = useLocation();
  const [searchParams] = new URLSearchParams(search);
  const hotRef = useRef(null)
  const fpdt1 = useRef(null);

  let decrptyUrl = null;
  if (searchParams !== undefined) {
    //  decrptyUrl = encryptData.decrypt(searchParams[0])
  } else {
    decrptyUrl = null;
  }

  let clientId = null
  if (location.state !== null) {
    clientId = location.state.clientId !== null ? location.state.clientId : null;
  }


  const [editClientId, setEditClientId] = useState(clientId);
  const [importSearch, setImportSearch] = useState(localStorage.getItem(globleVariable.vimportData))


  // data.fullName.split(' ')[0]
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    getValues,
    clearErrors,
    watch
  } = useForm({ defaultValues })

  const dateReceived = watch("dateOfBirth");

  // ** States
  const [fetchdata, setfetchdata] = useState([])
  const [stateid, setStateid] = useState({ value: '0', label: '--Select State--' });
  const [gender, setGender] = useState("1");
  const [indianCitizen, setIndianCitizen] = useState(true);
  const [authSign, setauthSign] = useState(true);
  const [clientPromoterId, setCclientPromoterId] = useState(null);
  const [importData, setImportData] = useState(false)
  const [refData, setrefData] = useState(false);

  const [block, setBlock] = useState(false)
  const [picker, setPicker] = useState(new Date())
  const [btnDisable, setBtnDisable] = useState(false)
  const [dobSelection, setDobSelection] = useState(null);
  const form = useRef(null);

   //** Shortcut keys
  useHotkeys(keysMap.SAVE_DATA, () =>  {  activeTabs == 4 && block == false &&  handleSubmit(onSubmit)() } , {
    enableOnFormTags,
  });


  useEffect(() => {
    if (editClientId !== null && editClientId !== "") {
      setEditClientId(editClientId)
      console.log('edit promoter')
      clearErrors()
      if (store.allCopmpanyDataById.data !== undefined) {
        setTimeout(() => {
          console.log(store.allCopmpanyDataById)
          setfetchdata(store.allCopmpanyDataById.data.promoter);
        }, 2000);
      }

    }

  }, [store])


  useEffect(() => {
    if (importsId !== null && importsId !== "") {
      setEditClientId(importsId)
      clearErrors()
      console.log('edit signator')
      if (store.importData.data !== undefined) {
        setTimeout(() => {
          setfetchdata(store.importData.data.promoter)
        }, 2000);
      }

    }
  }, [store])


  useEffect(() => {
    return () => setBlock(false)
  }, [])

  const Loader = () => {
    return (
      <Fragment>
        <Spinner />
        <CardText className='mb-0 mt-1 text-white'>Please Wait...</CardText>
      </Fragment>
    )
  }

  const getPromoterAndPartnerData = (clientId) => {
    // console.log('refersh data');
    // console.log(clientId)
    companyService.getClientPromoterSignatory(clientId, false).then(res => {
      console.log(res);
      if (res.status === 200 && res.data.status === errorCodeConfig.APIDefaultCode.Success) {
        setfetchdata(res.data.data);
      } else {
        setfetchdata([]);
      }

    }).catch(error => {
      Swal.fire({
        icon: 'error',
        title: '',
        text: error?.message,
        customClass: {
          confirmButton: 'btn btn-danger'
        },
        buttonsStyling: false,
      });
    })

  }


  //** Edit - click event
  const editRecord = (data) => {
    console.log(data);
    clearErrors();
    //setBtnDisable(false)
    setValueCompany(data);
  }

  // ** Delete Record 
  const deletePromoters = (id) => {
    console.log(id)

    return MySwal.fire({
      title: 'Are you sure delete this record ?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      customClass: {
        confirmButton: 'btn btn-danger',
        cancelButton: 'btn btn-outline-dark ms-1'
      },
      buttonsStyling: false,
      allowOutsideClick: false
    }).then(function (result) {
      if (result.value) {
        setBlock(true)
        companyService.deleteSignPromoterId(id).then(res => {
          console.log(res);
          if (res.status === 200 && res.data.status === errorCodeConfig.APIDefaultCode.Success) {
            setBlock(false)
            toast.success(res.data.successMessage, {
              position: "top-right",
            });

            getPromoterAndPartnerData(editClientId)
            reset();
          } else {
            setBlock(false)
            Swal.fire({
              icon: 'error',
              title: '',
              text: res?.data?.errorMessage,
              customClass: {
                confirmButton: 'btn btn-danger'
              },
              buttonsStyling: false,
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
            buttonsStyling: false,
          })
        })
      }
    })

  }


  //** Set Values
  const setValueCompany = (data) => {
    // if (data.length > 0) {
    console.log('set edit data');
    console.log(data)
    setValue("firstname", data['firstName'])
    setValue("middlename", data['middleName'])
    setValue("lastname", data['lastName'])
    setValue("fatherhusbandfirstname", data['fatherFirstName'])
    setValue("fatherhusbandmiddlename", data['fatherMiddleName'])
    setValue("fatherhusbandlastname", data['fatherLastName'])
    setValue("mobileno", data['mobile'])
    setValue("phoneno", data['phoneNo'])
    setValue("emailid", data['email'])
    setValue("designation", data['designation'])
    setValue("panno", data['panNo'])
    setValue("dinno", data['dinNo'])
    setValue("passportno", data['passportNo'])
    setValue("aadhaarno", data['aadharNo'])
    setValue("buildingno", data['buildingNo'])
    setValue("floornumber", data['floorNo'])
    setValue("buildingname", data['buildingName'])
    setValue("roadorstreet", data['road'])
    setValue("areaorlocality", data['area'])
    setValue("districtcity", data['district'])
    setValue("pincode", data['pincode'])
    setGender(data['gender'])
    setauthSign(data['isAuthSign'] == "true" || data['isAuthSign'] == "True" || data['isAuthSign'] == true ? true : false)
    setIndianCitizen(data['isIndian'] == "false" || data['isIndian'] == "True" || data['isIndian'] == true ? true : false)
    setCclientPromoterId(data['clientPromoterId'])
    const filterstate = stateOptionsList.filter(p => p.value == data['stateId'])[0];
    setValue("stateSelect", filterstate)
    setCclientPromoterId(data['clientPromoterId'])
    // console.log(data['dob'].split('T')[0])
    setValue("dateOfBirth",
      data['dob'] !== null && data['dob'] !== '' &&
        data['dob'] !== undefined ?
        moment(new Date(data['dob'].split('T')[0])).format("DD-MM-YYYY") : ''
    );

    setDobSelection(data['dob'] !== null && data['dob'] !== '' &&
      data['dob'] !== undefined ?
      data['dob'] : '')

    //  moment(new Date(data['dob'].split('T')[0])).format("DD-MM-YYYY")
    // setValue("dateOfBirth", data['dob'] !== null && data['dob'] !== '' &&
    //   data['dob'] !== undefined ?
    //   moment(new Date(data['dob'].split('T')[0])).format("DD-MM-YYYY") : '')
  }

  const SelectionhandleChange = (selectedOption) => {
    setStateid(selectedOption)
  };


  function onChangeValue(event) {
    setGender(event.target.value);
    console.log(event.target.value);
  }

  function CitizenOnChange(event) {
    setIndianCitizen(event.target.value);
  }

  function authSingOnChange(event) {
    setauthSign(event.target.value);
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
    console.log(data);
    console.log(data.dateOfBirth)
    let IsValid = true;

    if (!ValidateString(data.firstname)) {
      setError('firstname', { type: 'manual', message: 'Invalid First Name' })
      IsValid = false;
    }
    if (!ValidateString(data.middlename)) {
      setError('middlename', { type: 'manual', message: 'Invalid Middle Name' })
      IsValid = false;
    }
    if (!ValidateString(data.lastname)) {
      setError('lastname', { type: 'manual', message: 'Invalid Last Name' })
      IsValid = false;
    }
    if (!ValidateString(data.fatherhusbandfirstname)) {
      setError('fatherhusbandfirstname', { type: 'manual', message: 'Invalid Father First Name' })
      IsValid = false;
    }
    if (!ValidateString(data.fatherhusbandmiddlename)) {
      setError('fatherhusbandmiddlename', { type: 'manual', message: 'Invalid Father Middle Name' })
      IsValid = false;
    }
    if (!ValidateString(data.fatherhusbandlastname)) {
      setError('fatherhusbandlastname', { type: 'manual', message: 'Invalid Father Last Name' })
      IsValid = false;
    }
    if (!ValidateString(dobSelection)) {
      setError('dateOfBirth', { type: 'manual', message: 'Invalid DOB' })
      IsValid = false;
    }
    if (!ValidateString(data.mobileno)) {
      setError('mobileno', { type: 'manual', message: 'Invalid Mobile No' })
      IsValid = false;
    }
    if (!ValidateString(data.emailid)) {
      setError('emailid', { type: 'manual', message: 'Invalid Email Id' })
      IsValid = false;
    }
    if (!ValidateString(data.designation)) {
      setError('designation', { type: 'manual', message: 'Invalid Designation' })
      IsValid = false;
    }
    if (!ValidateString(data.panno)) {
      setError('panno', { type: 'manual', message: 'Invalid Pan No' })
      IsValid = false;
    }
    if (!ValidateString(data.buildingno)) {
      setError('buildingno', { type: 'manual', message: 'Invalid Building No' })
      IsValid = false;
    }
    if (!ValidateString(data.roadorstreet)) {
      setError('roadorstreet', { type: 'manual', message: 'Invalid Road/Street' })
      IsValid = false;
    }
    if (!ValidateString(data.areaorlocality)) {
      setError('areaorlocality', { type: 'manual', message: 'Invalid Area/Locality' })
      IsValid = false;
    }
    if (!ValidateString(data.districtcity)) {
      setError('districtcity', { type: 'manual', message: 'Invalid District/City' })
      IsValid = false;
    }
    if (!ValidateString(data.pincode)) {
      setError('pincode', { type: 'manual', message: 'Invalid Pincode' })
      IsValid = false;
    }

    if (IsValid == true) {
      if (editClientId !== null && editClientId !== "" && clientPromoterId !== null) {
        console.log('edit');
        const companyData = new PromoterSignatoryEditModel(
          clientPromoterId,
          editClientId,
          data.firstname.trim(),
          data.middlename.trim(),
          data.lastname.trim(),
          data.fatherhusbandfirstname.trim(),
          data.fatherhusbandmiddlename.trim(),
          data.fatherhusbandlastname.trim(),
          dobSelection,
          // moment(new Date(data.dateOfBirth)).format("YYYY-MM-DD"),
          gender,
          data.mobileno.trim(),
          data.phoneno !== "" && data.phoneno !== null ? data.phoneno.trim() : '',
          data.emailid.trim(),
          data.designation.trim(),
          data.panno.trim(),
          data.dinno !== "" && data.dinno !== null ? data.dinno.trim() : '',
          indianCitizen == 1 ? true : false,
          data.passportno !== "" &&  data.passportno !== null ? data.passportno.trim() : '',
          data.aadhaarno !== "" &&  data.aadhaarno !== null ? data.aadhaarno.trim() : '',
          data.buildingno.trim(),
          data.floornumber !== "" &&  data.floornumber !== null ? data.floornumber.trim() : '',
          data.buildingname !== "" && data.buildingname !== null ? data.buildingname.trim() : '',
          data.roadorstreet.trim(),
          data.areaorlocality.trim(),
          data.stateSelect.value,
          data.districtcity.trim(),
          data.pincode.trim(),
          authSign == 1 ? true : false,
          false
        )

        setBlock(true)
        setBtnDisable(true)
        companyService.editClientPromoterSignatory(companyData).then(res => {
          console.log(res)
          if (res.status === 200 && res.data.status === errorCodeConfig.APIDefaultCode.Success) {
            setBlock(false)
            toast.success(res.data.successMessage, {
              position: "top-right", duration :  messageShowDuration
            });
            getPromoterAndPartnerData(editClientId)
            reset();
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
              buttonsStyling: false,
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
            buttonsStyling: false,
          })
          setBtnDisable(true)
        })
      } else {

        if (editClientId == null) {
          toast.error("Please add company.", {
            position: "top-right",
            duration :  messageShowDuration
          });
          return false;
        }

        const companyData = new PromoterSignatoryModel(
          editClientId,
          data.firstname.trim(),
          data.middlename.trim(),
          data.lastname.trim(),
          data.fatherhusbandfirstname.trim(),
          data.fatherhusbandmiddlename.trim(),
          data.fatherhusbandlastname.trim(),
          dobSelection,
          // moment(new Date(data.dateOfBirth)).format("YYYY-MM-DD"),
          gender,
          data.mobileno.trim(),
          data.phoneno !== "" && data.phoneno !== null ? data.phoneno.trim() : '',
          data.emailid.trim(),
          data.designation.trim(),
          data.panno.trim(),
          data.dinno !== "" && data.dinno !== null ? data.dinno.trim() : '',
          indianCitizen == 1 ? true : false,
          data.passportno !== "" && data.passportno !== null ? data.passportno.trim() : '',
          data.aadhaarno !== "" && data.aadhaarno !== null ?  data.aadhaarno.trim() : '',
          data.buildingno.trim(),
          data.floornumber !== "" && data.floornumber !== null ? data.floornumber.trim() : '',
          data.buildingname !== "" &&   data.buildingname !== null ? data.buildingname.trim() : '',
          data.roadorstreet.trim(),
          data.areaorlocality.trim(),
          data.stateSelect.value,
          data.districtcity.trim(),
          data.pincode.trim(),
          authSign == 1 ? true : false,
          false
        )

        setBlock(true)
        setBtnDisable(true)
        companyService.addClientPromoterSignatory(companyData).then(res => {
          console.log(res)
          if (res.status === 200 && res.data.status === errorCodeConfig.APIDefaultCode.Success) {
            // setBtnDisable(true);
            setBlock(false)
            toast.success(res.data.successMessage, {
              position: "top-right",duration :  messageShowDuration
            });
            getPromoterAndPartnerData(editClientId)
            reset();
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
              buttonsStyling: false,
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
            buttonsStyling: false,
          })
          
          setBtnDisable(false)
        })
      }
    }

  }

  //** Reset form
  const resetForm = () => {
    setBtnDisable(false);
    reset();
  }


  
   //** text align option
   const theader = (col, TH) => {
  
    if (col == 0 || col == 1 || col == 2 || col == 3 || col == 4 || col == 5 ) {
      TH.className = 'htLeft'
    }
  };

 //** Column
  const ColumneHandsonTbl = [
    {
      data: "firstName",
      title: "First Name",
      readOnly: true,
     

    },
    {
      data: "lastName",
      title: "Last Name",
      readOnly: true
    },
    {
      data: "designation",
      title: "Designation",
      readOnly: true
    },
    {
      data: "panNo",
      title: "Pan No",
      readOnly: true
    },
    {
      data: "mobile",
      title: "Mobile",
      readOnly: true
    },
    {
      data: "email",
      title: "Email",
      readOnly: true
    },
    {
      title: "Action",
      className: "htCenter"

    },
    {
      data: "aadharNo",
      title: "aadharNo",
      readOnly: true
    },
    {
      data: "area",
      title: "area",
      readOnly: true
    },
    {
      data: "buildingName",
      title: "buildingName",
      readOnly: true
    },
    {
      data: "buildingNo",
      title: "buildingNo",
      readOnly: true
    },
    {
      data: "clientPromoterId",
      title: "clientPromoterId",
      readOnly: true
    },
    {
      data: "dinNo",
      title: "dinNo",
      readOnly: true
    },
    {
      data: "district",
      title: "district",
      readOnly: true
    },
    {
      data: "dob",
      title: "dob",
      readOnly: true
    },
    {
      data: "fatherFirstName",
      title: "fatherFirstName",
      readOnly: true
    },
    {
      data: "fatherLastName",
      title: "fatherLastName",
      readOnly: true
    },
    {
      data: "fatherMiddleName",
      title: "fatherMiddleName",
      readOnly: true
    },
    {
      data: "floorNo",
      title: "floorNo",
      readOnly: true
    },
    {
      data: "gender",
      title: "gender",
      readOnly: true
    },
    {
      data: "isAuthSign",
      title: "isAuthSign",
      readOnly: true
    },
    {
      data: "isIndian",
      title: "isIndian",
      readOnly: true
    },
    {
      data: "middleName",
      title: "middleName",
      readOnly: true
    },
    {
      data: "passportNo",
      title: "passportNo",
      readOnly: true
    },
    {
      data: "phoneNo",
      title: "phoneNo",
      readOnly: true
    },
    {
      data: "pincode",
      title: "pincode",
      readOnly: true
    },
    {
      data: "road",
      title: "road",
      readOnly: true
    },
    {
      data: "state",
      title: "state",
      readOnly: true
    },
    {
      data: "stateId",
      title: "stateId",
      readOnly: true
    },
  ]

  // ** button -  Action Column
  function myBtns(instance, td, row, col, prop, value, cellProperties) {
    Handsontable.renderers.TextRenderer.apply(this, arguments);

    // td.innerHTML = '<button type="button" className="btn btn-primary">Edit</button><button type="button" className="btn btn-primary">Deactive</button><button type="button" className="btn btn-primary">Connect</button>'
    td.innerHTML = '<button class="btn"><i class="add-edit fa fa-edit" title="Edit"></i></button><button class="btn" title="Delete"><i class="add-delete fa fa-trash"></i></button>'

    const hot = hotRef?.current?.hotInstance;
    //**  Delete
    $(td).find('.add-delete').on('click', event => {
      console.log('delete')
      //  console.log(instance.col)
      deletePromoters(hot.getDataAtRow(cellProperties.row)[11])
    });

    //**  edit
    $(td).find('.add-edit').on('click', event => {
      console.log('edit')
      // console.log(hot.getDataAtRow(cellProperties.row))
      // console.log(hot.getSourceDataAtRow(cellProperties.row))

      const data = {
        "firstName": hot.getSourceDataAtRow(cellProperties.row)['firstName'],
        "lastName": hot.getSourceDataAtRow(cellProperties.row)['lastName'],
        "designation": hot.getSourceDataAtRow(cellProperties.row)['designation'],
        "panNo": hot.getSourceDataAtRow(cellProperties.row)['panNo'],
        "mobile": hot.getSourceDataAtRow(cellProperties.row)['mobile'],
        "email": hot.getSourceDataAtRow(cellProperties.row)['email'],
        "aadharNo": hot.getSourceDataAtRow(cellProperties.row)['aadharNo'],
        "area": hot.getSourceDataAtRow(cellProperties.row)['area'],
        "buildingName": hot.getSourceDataAtRow(cellProperties.row)['buildingName'],
        "buildingNo": hot.getSourceDataAtRow(cellProperties.row)['buildingNo'],
        "clientPromoterId": hot.getSourceDataAtRow(cellProperties.row)['clientPromoterId'],
        "dinNo": hot.getSourceDataAtRow(cellProperties.row)['dinNo'],
        "district": hot.getSourceDataAtRow(cellProperties.row)['district'],
        "dob": hot.getSourceDataAtRow(cellProperties.row)['dob'],
        "fatherFirstName": hot.getSourceDataAtRow(cellProperties.row)['fatherFirstName'],
        "fatherLastName": hot.getSourceDataAtRow(cellProperties.row)['fatherLastName'],
        "fatherMiddleName": hot.getSourceDataAtRow(cellProperties.row)['fatherMiddleName'],
        "floorNo": hot.getSourceDataAtRow(cellProperties.row)['floorNo'],
        "gender": hot.getSourceDataAtRow(cellProperties.row)['gender'],
        "isAuthSign": hot.getSourceDataAtRow(cellProperties.row)['isAuthSign'],
        "isIndian": hot.getSourceDataAtRow(cellProperties.row)['isIndian'],
        "middleName": hot.getSourceDataAtRow(cellProperties.row)['middleName'],
        "passportNo": hot.getSourceDataAtRow(cellProperties.row)['passportNo'],
        "phoneNo": hot.getSourceDataAtRow(cellProperties.row)['phoneNo'],
        "pincode": hot.getSourceDataAtRow(cellProperties.row)['pincode'],
        "road": hot.getSourceDataAtRow(cellProperties.row)['road'],
        "state": hot.getSourceDataAtRow(cellProperties.row)['state'],
        "stateId": hot.getSourceDataAtRow(cellProperties.row)['stateId'],

      }

      editRecord(data)

    });

  }


  return (
    <Fragment>
      {block && <div className="loading1">Loading&#8230;</div>}
      {/* <UILoader blocking={block} loader={<Loader />}> */}

      <Form className='mt-2 pt-50' onSubmit={handleSubmit(onSubmit)} id="promoterFrm" ref={form} >
        <Card>
          <CardBody className='py-2 my-25'>
            <div className='content-header'>
              <h5 className='mb-0'>Personal Information</h5>
            </div>
            <br></br>
            <Row>
              <Col md='2' className='mb-1'>
                <Label className='form-label requiredlable'>
                  First Name
                </Label>
                <Controller
                  id='firstname'
                  name='firstname'
                  rules={{ required: true }}
                  control={control}
                  render={({ field }) => <Input placeholder='' invalid={errors.firstname && true} {...field} />}
                />
                {errors.firstname && <FormFeedback>Please enter a first name</FormFeedback>}

              </Col>
              <Col md='2' className='mb-1'>
                <Label className='form-label requiredlable'>
                  Middle Name
                </Label>
                <Controller
                  control={control}
                  id='middlename'
                  name='middlename'
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Input placeholder='' invalid={errors.middlename && true} {...field} />
                  )}
                />
                {errors.middlename && <FormFeedback>Please enter a middle name</FormFeedback>}
              </Col>

              <Col md='2' className='mb-1'>
                <Label className='form-label requiredlable'>
                  Last Name
                </Label>
                <Controller
                  control={control}
                  id='lastname'
                  name='lastname'
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Input placeholder='' invalid={errors.lastname && true} {...field} />
                  )}
                />
                {errors.lastname && <FormFeedback>Please enter a last name</FormFeedback>}
              </Col>
              <Col md='2' className='mb-1'>
                <Label className='form-label requiredlable'>
                  Father/Husband First Name
                </Label>
                <Controller
                  id='fatherhusbandfirstname'
                  name='fatherhusbandfirstname'
                  rules={{ required: true }}
                  control={control}
                  render={({ field }) => <Input placeholder='' invalid={errors.fatherhusbandfirstname && true} {...field} />}
                />
                {errors.fatherhusbandfirstname && <FormFeedback>Please enter a father/husband first name</FormFeedback>}
              </Col>
              <Col md='2' className='mb-1'>
                <Label className='form-label requiredlable'>
                  Father/Husband Middle Name
                </Label>
                <Controller
                  id='fatherhusbandmiddlename'
                  name='fatherhusbandmiddlename'
                  rules={{ required: true }}
                  control={control}
                  render={({ field }) => <Input placeholder='' invalid={errors.fatherhusbandmiddlename && true} {...field} />}
                />
                {errors.fatherhusbandmiddlename && <FormFeedback>Please enter a father/husband middle name</FormFeedback>}
              </Col>
              <Col md='2' className='mb-1'>
                <Label className='form-label requiredlable'>
                  Father/Husband Last Name
                </Label>
                <Controller
                  id='fatherhusbandlastname'
                  name='fatherhusbandlastname'
                  rules={{ required: true }}
                  control={control}
                  render={({ field }) => <Input placeholder='' invalid={errors.fatherhusbandlastname && true} {...field} />}
                />
                {errors.fatherhusbandlastname && <FormFeedback>Please enter father/husband last name</FormFeedback>}
              </Col>
            </Row>

            <Row>
              <Col md='2' className='mb-1'>
                <Label className='form-label requiredlable'>
                  Date Of Birth
                </Label>
                <Controller
                  control={control}
                  id='ProdateOfBirth'
                  name='dateOfBirth'
                  rules={{ required: true }}
                  render={({ field: { ref, ...field } }) => (
                    <Flatpickr
                      value={field.value}
                     // ref={ref}
                      // innerRef={ref}
                      {...field}
                      onChange={function (selectedDates, dateStr, instance) {
                        const newDate = moment(new Date(selectedDates)).format('YYYY-MM-DD');
                        setDobSelection(newDate);
                        field.onChange(selectedDates)
                        console.log(newDate); //value picked from date picker
                        // onChange={field.onChange}
                      }}
                      options={{
                        // allowInput: true, 
                        dateFormat: 'd-m-Y',
                        maxDate: new Date(),

                      }}
                      className={classnames('form-control', {
                        'is-invalid': errors?.dateOfBirth && true
                      })}

                      invalid={errors.dateOfBirth && true}
                    />
                  )}
                />
                {errors?.dateOfBirth && <FormFeedback>Please select date of birth</FormFeedback>}

              </Col>
              <Col md='2' className='mb-1'>
                <Label className='form-label requiredlable'>
                  Gender
                </Label>

                {/* style={{ paddingTop: '10px' }} */}
                <div className='d-flex' onChange={onChangeValue}  >
                  <div className=' form-check mb-1'>
                    <Input
                      type='radio'
                      id='radio-male-a'
                      name='i18n-lang-radio'
                      value="1"
                      checked={gender == "1"}
                      readOnly
                    />
                    <Label className='form-check-label'>
                      Male &nbsp;
                    </Label>
                  </div>
                  <div className='form-check mb-1'>
                    <Input
                      type='radio'
                      id='radio-female-a'
                      name='i18n-lang-radio'
                      value="2"
                      checked={gender == "2"}
                      readOnly
                    />
                    <Label className='form-check-label'>
                      Female &nbsp;
                    </Label>
                  </div>
                  <div className='form-check mb-1'>
                    <Input
                      type='radio'
                      id='radio-other-a'
                      name='i18n-lang-radio'
                      value="3"
                      checked={gender == "3"}
                      readOnly
                    />
                    <Label className='form-check-label' >
                      Other
                    </Label>
                  </div>
                </div>
              </Col>
              <Col md='2' className='mb-1'>
                <Label className='form-label requiredlable'>
                  Mobile No
                </Label>
                <Controller
                  id='mobileno'
                  name='mobileno'
                  rules={{ required: true }}
                  control={control}
                  render={({ field }) => <Input placeholder='' invalid={errors.mobileno && true} {...field}
                    onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))}
                    maxLength={10}
                  />}
                />
                {errors.mobileno && <FormFeedback>Please enter a mobile no</FormFeedback>}
              </Col>
              <Col md='2' className='mb-1'>
                <Label className='form-label'>
                  Phone No
                </Label>
                <Controller
                  id='phoneno'
                  name='phoneno'

                  control={control}
                  render={({ field }) => <Input placeholder='' invalid={errors.phoneno && true} {...field}
                    onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))}
                    maxLength={15}
                  />}
                />
                {errors.phoneno && <FormFeedback>{errors.phoneno.message}</FormFeedback>}
              </Col>

              <Col md='2' className='mb-1'>
                <Label className='form-label requiredlable'>
                  Email Id
                </Label>
                <Controller
                  id='emailid'
                  name='emailid'
                  rules={{
                    required: "Please enter valid email.",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Please enter valid email."
                    }
                  }}
                  control={control}
                  render={({ field }) => <Input placeholder='' invalid={errors.emailid && true} {...field} />}
                />
                {errors.emailid && <FormFeedback>Please enter a email</FormFeedback>}
              </Col>

            </Row>
          </CardBody>
        </Card>
        <Card>
          <CardBody className='py-2 my-25'>
            <div className='content-header'>
              <h5 className='mb-0'>Identity Information</h5>
            </div>
            <br />
            <Row>
              <Col md='2' className='mb-1'>
                <Label className='form-label requiredlable'>
                  Designation
                </Label>
                <Controller
                  rules={{ required: true }}
                  id='designation'
                  name='designation'
                  control={control}
                  render={({ field }) => <Input placeholder='' invalid={errors.designation && true} {...field} />}
                />
                {errors.designation && <FormFeedback>Please enter a designation</FormFeedback>}
              </Col>
              <Col md='2' className='mb-1'>
                <Label className='form-label requiredlable'>
                  Pan No
                </Label>
                <Controller
                  rules={{ required: "Plesae enter valid pan no.",
                    pattern: {
                      value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i,
                      message: "Please enter valid panno."
                    }
                   }}
                  id='panno'
                  name='panno'
                  control={control}
                  render={({ field }) => <Input maxLength="10" placeholder='' invalid={errors.panno && true} {...field} 
                  onChange={(e) =>
                    field.onChange(e.target.value.replace(/\s/g, ""))
                  }
                  />}
                />
                {errors.panno && <FormFeedback>Please enter valid pan no</FormFeedback>}
              </Col>
              <Col md='2' className='mb-1'>
                <Label className='form-label'>
                  DIN No.
                </Label>
                <Controller
                  id='dinno'
                  name='dinno'
                  control={control}
                  render={({ field }) => <Input placeholder='' invalid={errors.dinno && true} {...field} />}
                />
                {errors.dinno && <FormFeedback>{errors.dinno.message}</FormFeedback>}
              </Col>

              <Col md='2' className='mb-1'>
                <Label className='form-label requiredlable'>
                  Indian Citizen
                </Label>
                {/* style={{ paddingTop: '10px' }} */}
                <div className='d-flex' onChange={CitizenOnChange} >
                  <div className=' form-check mb-1'>
                    <Input
                      type='radio'
                      id='radio-citizen-yes-a'
                      name='citizen-radio'
                      value="1"
                      checked={indianCitizen == "1"}
                      readOnly
                    />
                    <Label className='form-check-label' for='radio-citizen-yes'>
                      Yes &nbsp; &nbsp;
                    </Label>
                  </div>
                  <div className='form-check mb-1'>
                    <Input
                      type='radio'
                      id='radio-citizen-no-a'
                      name='citizen-radio'
                      value="0"
                      checked={indianCitizen == "0"}
                      readOnly
                    />
                    <Label className='form-check-label' for='radio-citizen-no'>
                      No
                    </Label>
                  </div>
                </div>
              </Col>
              <Col md='2' className='mb-1'>
                <Label className='form-label'>
                  Passport No.
                </Label>
                <Controller
                  id='passportno'
                  name='passportno'
                  control={control}
                  render={({ field }) => <Input maxLength="20"  placeholder='' invalid={errors.passportno && true} {...field} 
                  onChange={(e) =>
                    field.onChange(e.target.value.replace(/\s/g, ""))
                  }
                  />}
                />
                {errors.passportno && <FormFeedback>{errors.passportno.message}</FormFeedback>}
              </Col>
              <Col md='2' className='mb-1'>
                <Label className='form-label'>
                  Aadhaar No.
                </Label>
                <Controller
                  id='aadhaarno'
                  name='aadhaarno'
                  control={control}
                  render={({ field }) => <Input maxLength="12" placeholder='' invalid={errors.aadhaarno && true} {...field} 
                  onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))}
                  // onChange={(e) =>
                  //   field.onChange(e.target.value.replace(/\s/g, ""))
                  // }
                  />}
                />
                {errors.aadhaarno && <FormFeedback>{errors.aadhaarno.message}</FormFeedback>}
              </Col>
            </Row>
          </CardBody>
        </Card>
        <Card>
          <CardBody className='py-2 my-25'>
            <div className='content-header'>
              <h5 className='mb-0'>Residential Address in India</h5>
            </div>
            <br />
            <Row>
              <Col md='3' className='mb-1'>
                <Label className='form-label requiredlable'>
                  Building No/Flat No.
                </Label>
                <Controller
                  id='buildingno'
                  name='buildingno'
                  rules={{ required: true }}
                  control={control}
                  render={({ field }) => <Input placeholder='' invalid={errors.buildingno && true} {...field} />}
                />
                {errors.buildingno && <FormFeedback>Please enter a building no/flat no</FormFeedback>}
              </Col>
              <Col md='3' className='mb-1'>
                <Label className='form-label'>
                  Floor Number
                </Label>
                <Controller
                  control={control}
                  id='floornumber'
                  name='floornumber'
                  render={({ field }) => (
                    <Input placeholder='' invalid={errors.floornumber && true} {...field} />
                  )}
                />
                {errors.floornumber && <FormFeedback>{errors.floornumber.message}</FormFeedback>}
              </Col>

              <Col md='3' className='mb-1'>
                <Label className='form-label'>
                  Building Name
                </Label>
                <Controller
                  control={control}
                  id='buildingname'
                  name='buildingname'
                  render={({ field }) => (
                    <Input placeholder='' invalid={errors.buildingname && true} {...field} />
                  )}
                />
                {errors.buildingname && <FormFeedback>{errors.buildingname.message}</FormFeedback>}
              </Col>
              <Col md='3' className='mb-1'>
                <Label className='form-label requiredlable'>
                  Road/Street
                </Label>
                <Controller
                  control={control}
                  rules={{ required: true }}
                  id='roadorstreet'
                  name='roadorstreet'
                  render={({ field }) => (
                    <Input placeholder='' invalid={errors.roadorstreet && true} {...field} />
                  )}
                />
                {errors.roadorstreet && <FormFeedback>Please enter a road/street</FormFeedback>}
              </Col>
            </Row>
            <Row>
              <Col md='3' className='mb-1'>
                <Label className='form-label requiredlable'>
                  Area/Locality
                </Label>
                <Controller
                  rules={{ required: true }}
                  id='areaorlocality'
                  name='areaorlocality'
                  control={control}
                  render={({ field }) => <Input placeholder='' invalid={errors.areaorlocality && true} {...field} />}
                />
                {/* <Input type='textarea' name='text' id='exampleText' rows='3' placeholder='Textarea' /> */}
                {errors.areaorlocality && <FormFeedback>Please enter a area/locality</FormFeedback>}
              </Col>

              <Col md='3' className='mb-1'>
                <Label className='form-label requiredlable'>
                  District/City
                </Label>
                <Controller
                  rules={{ required: true }}
                  id='districtcity'
                  name='districtcity'
                  control={control}
                  render={({ field }) => <Input placeholder='' invalid={errors.districtcity && true} {...field} />}
                />
                {errors.districtcity && <FormFeedback>Please enter a district/city</FormFeedback>}
              </Col>

              <Col md='3' className='mb-1'>
                <Label className='form-label requiredlable'>
                  State
                </Label>
                <Controller
                  id='stateSelect'
                  name='stateSelect'
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) =>
                    <Select
                      isClearable={false}
                      value={field.value}
                      placeholder={DROPDOWN_PLACEHOLDER}
                      options={stateOptionsList}
                      classNamePrefix='select'
                      theme={selectThemeColors}
                      onChange={field.onChange}
                      className={classnames('react-select', { 'is-invalid': errors.stateSelect && true })}
                      {...field}
                    />
                  }
                />

                {errors.stateSelect && <FormFeedback>Please select state</FormFeedback>}

              </Col>

              <Col md='1' className='mb-1'>
                <Label className='form-label requiredlable'>
                  Pin Code
                </Label>
                <Controller
                  rules={{ required: true }}
                  id='pincode'
                  name='pincode'
                  control={control}
                  render={({ field }) => <Input placeholder='' invalid={errors.pincode && true} {...field}
                    onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))}
                  />}
                />
                {errors.pincode && <FormFeedback>Enter a pin code</FormFeedback>}
              </Col>
              <Col md='2' className='mb-1'>
                <Label className='form-label'>
                  Authorized Signatory
                </Label>
                {/* style={{ paddingTop: '10px' }}  */}
                <div className='d-flex' onChange={authSingOnChange} >
                  <div className=' form-check mb-1'>
                    <Input
                      type='radio'
                      id='radio-auth-yes-a'
                      name='auth-radio'
                      value="1"
                      checked={authSign == "1"}
                      readOnly
                    />
                    <Label className='form-check-label' >
                      Yes &nbsp; &nbsp;
                    </Label>
                  </div>
                  <div className='form-check mb-1'>
                    <Input

                      type='radio'
                      id='radio-auth-no-a'
                      name='auth-radio'
                      value="0"
                      checked={authSign == "0"}
                      readOnly
                    />
                    <Label className='form-check-label'>
                      No
                    </Label>
                  </div>
                </div>
              </Col>
            </Row>
            <div className='btnFixFooter'>
              <Row className='justify-content-end mx-0'>
                <Col className='d-flex align-items-center justify-content-end' md='6' sm='12'>
                  <Button  id="savebtn" type='submit' className='me-1' color='danger' outline disabled={btnDisable} form="promoterFrm">
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
          </CardBody>
        </Card>
      </Form>

      <Card>
        <CardBody>
          <div>
            <HotTable
              ref={hotRef}
              data={fetchdata}
              height="auto"
              autoColumnSize={true}
              rowHeaders={false}
              stretchH='all'
              columns={ColumneHandsonTbl}
              readOnly={true}
              licenseKey="non-commercial-and-evaluation"
              preventOverflow="horizontal"
              cells={function (row, col) {
                const cellPrp = {};
                if (col === 6) {
                  cellPrp.renderer = myBtns;
                  cellPrp.readOnly = true;
                  // console.log(cellPrp);
                }
                return cellPrp
              }}
              hiddenColumns={{
                columns: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28]
              }}
              afterGetColHeader={theader}
            />
          </div>
        </CardBody>
      </Card>
      {/* </UILoader> */}




    </Fragment>
  )
}

export default PromotersPartnerTabs
