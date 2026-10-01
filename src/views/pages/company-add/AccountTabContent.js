// ** React Imports
import { Fragment, useEffect, useState } from 'react'
import { Link, useLocation, useSearchParams, useNavigate, json } from 'react-router-dom'
// ** Third Party Components
import Select from 'react-select'
import { useForm, Controller } from 'react-hook-form'
import 'cleave.js/dist/addons/cleave-phone.us'
import Swal from 'sweetalert2'
import toast from 'react-hot-toast'
// ** Spinner (Splash Screen)
import Spinner from './../../../@core/components/spinner/Loading-spinner'

//** Error Code file
import errorCodeConfig from '../../../configs/apiErrorCodeConfig'

// ** Reactstrap Imports
import {
  Row, Col, Form, Card, Input, Label, Button, CardBody, CardTitle, CardHeader,
  CardText,
  FormFeedback, Modal, ModalHeader, ModalBody, InputGroup, UncontrolledTooltip
} from 'reactstrap'

// ** Utils
import InputPasswordToggle from '@components/input-password-toggle'

// ** Model
import CompanyAdd, { CompanyEdit } from '../../../model/company-add'
import companyNewService from '../../../services/company/companyNewService';
import ImportGSTCompany from '../../../services/company/importCompany';

import { selectThemeColors } from '@utils'
import { getImportData } from '../../../views/apps/user/store'
import { useDispatch, useSelector } from 'react-redux'
import CompanyConstants from './Constants'
import { DROPDOWN_PLACEHOLDER } from '../../../configs/config'
import encryptData from '../../../auth/crypto/crypto'
import classnames from 'classnames'
// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/pages/page-form-validation.scss'

import { useHotkeys } from "react-hotkeys-hook";
import { keysMap, enableOnFormTags } from "../../../configs/config";
import { globleVariable } from "../../../configs/globalVariable";
import LocalFunction from '../../../configs/getLocalFunction'
import { messageShowDuration } from '@configs/config'
import withReactContent from "sweetalert2-react-content";
import { handleKeyPressPass, handleKeyPressText, handlePasteText } from '../../../helper/validation'

const MySwal = withReactContent(Swal);


const companyOptionsList = [
  // { value: '0', label: '--Select Company Type--' },
  { value: '0', label: DROPDOWN_PLACEHOLDER },
  { value: '1', label: 'Proprietorship' },
  { value: '2', label: 'Partnership' },
  { value: '3', label: 'Hindu Undivided Family' },
  { value: '4', label: 'Private Limited Company' },
  { value: '5', label: 'Public Limited Company' },
  { value: '6', label: 'Society/Club/Trust/Association of Persons' },
  { value: '7', label: 'Public Sector Undertaking' },
  { value: '8', label: 'Government Department' },
  { value: '9', label: 'Limited Liability Partnership' },
  { value: '10', label: 'Unlimited Company' },
  { value: '11', label: 'Statutory Body' },
  { value: '12', label: 'Local Authority' },
  { value: '13', label: 'Foreign Limited Liability Partnership' },
  { value: '14', label: 'Foreign Limited Registered (In India)' },
  { value: '15', label: 'Other (Please Specify)' }
]

const typeOfRegOptionList = [
  // { value: '0', label: '--Select Registration Type--' },
  { value: '1', label: 'Regular' },
  { value: '2', label: 'Composition' },
  { value: '3', label: 'Input Service Distributor (ISD)' },
  { value: '4', label: 'Casual Taxable Person' },
]

const gstr1FilingList = [
  // { value: '0', label: '--Select Type Of Filing--' },
  { value: '1', label: 'Monthly' },
  { value: '2', label: 'Quarterly' },
]

const yesNoList = [
  // { value: '-0', label: '--Select--' },
  { value: '1', label: 'Yes' },
  { value: '0', label: 'No' },
]

const clientStatusList = [
  // { value: '-0', label: '--Select--' },
  { value: '1', label: 'Active' },
  { value: '0', label: 'Inactive' },
]

// ** Hooks
const defaultValues = {
  gstinusername: '',
  gstinpassword: '',
  ewaybillusername: '',
  ewaybillpassword: '',
  icegateusername: '',
  icegatepassword: '',
  companyname: '',
  tradename: '',
  gstinno: '',
  mobileno: '',
  emailid: '',
  fileno: '',
  groupname: '',
  contactpersonname: '',
  contactpersondesignation: '',
  contactpersonemail: '',
  contactpersonofficeno: '',
  contactpersonmobileno: '',
  othCompScheme: null,
  othForeginTaxable: null,
  othServiceDistributor: null,
  othTDSApplicable: null,
  othEommerceOperator: null,
  othITC04Applicable: null,
  clientStatus: null,
  gstr1Filling: null,
  typeOfReg: null
}

const AccountTabs = props => {

  const { store, activeTabs, userIds, subscriptionIds } = props;
  const dispatch = useDispatch()
  const [show, setShow] = useState(false)
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

  const [editClientId, setEditClientId] = useState(clientId);
  const [importSearch, setImportSearch] = useState(false);
  const [btnDisable, setBtnDisable] = useState(false)
  const [validGstin, setValidGstin] = useState();

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors },
    getValues,
    clearErrors,
    reset,
    setValue
  } = useForm({ defaultValues })


  // ** States
  let [compSchema, setcompSchema] = useState(false);
  const [block, setBlock] = useState(false)
  const [btnName, setBtnName] = useState('Save')
  const [apiCall, setApiCall] = useState(true);
  const stores = useSelector(state => state.users)

  const navigator = useNavigate();

  const navigateDashboard=()=>{
    return MySwal.fire({
      title: "",
      text: "Are you sure you want to go back?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      // reverseButtons: true,
      customClass: {
        confirmButton: "btn btn-outline-danger ms-1",
        cancelButton: "btn btn-outline-secondary ms-1",
      },
      buttonsStyling: false,
    }).then( (result)=>{
      if(result.value){
    navigator('/dashboard/company')
      }
    }
    )
  }

  const [companyTypeOption, setCompanyTypeOption] = useState({ value: '0', label: DROPDOWN_PLACEHOLDER });
  const [RegTypeOption, setRegTypeOption] = useState({ value: '0', label: DROPDOWN_PLACEHOLDER });
  const [gstrfillingOption, setgstrfilling] = useState({ value: '0', label: DROPDOWN_PLACEHOLDER });

  // const [gstinno, setgstinno] = useState('');
  //** Shortcut keys
  useHotkeys(keysMap.SAVE_DATA, () => { activeTabs == 1 && block == false && handleSubmit(onSubmit)() }, {
    enableOnFormTags,
  });
    useHotkeys(keysMap.IMPORT_DATA, () => { block == false && ImportGSTINData() }, {
      enableOnFormTags,
    });

  useEffect(() => {
    return () => setBlock(false)
  }, [])

  useEffect(() => {
    //** get data
    if (editClientId !== null && editClientId !== "") {
      setBlock(true)
      setTimeout(() => {

        setValueCompany(store.allCopmpanyDataById.data);
        setBlock(false)
      }, 3000);
      setBtnName('Update')
    }

  }, [store])

  useEffect(() => {
    if (importSearch == true) {
      setValueCompany(stores.importData.data)
    }

  }, [importSearch])

  //**  default value
  useEffect(() => {
    setValue("othCompScheme", yesNoList[1])
    setValue("othForeginTaxable", yesNoList[1])
    setValue("othServiceDistributor", yesNoList[1])
    setValue("othTDSApplicable", yesNoList[1])
    setValue("othITC04Applicable", yesNoList[1])
    setValue("othEommerceOperator", yesNoList[1])
    setValue("clientStatus", clientStatusList[0])
  }, [])


  //** Set Values
  const setValueCompany = (data) => {
    if (data !== undefined) {

      // Company detail
      const decryptPass= (data['password'] !== null && data['password'] !== undefined) ? encryptData.decrypt(data['password']) : ''
      const decryptUserName= (data['username'] !== null &&  data['username'] !== undefined) ? encryptData.decrypt(data['username']) : ''
      setEditClientId(data['clientId'])
      setValue("gstinusername", decryptUserName)
      setValue("gstinpassword",decryptPass)
      setValue("tradename", data['tradeName'])
      setValue("gstinno", data['gstinNumber'])
      setValidGstin(data['gstinNumber'])
      setValue("companyname", data['companyName'])
      setValue("companyname", data['companyName'])
      setValue("mobileno", data['mobileNo'])
      setValue("emailid", data['email'])
      setValue("fileno", data['code'])
      setValue("groupname", data['groupName'])

      if (data['companyType'] !== null && data['companyType'] !== "") {
        const findComanyType = companyOptionsList.filter(p => p.value == data['companyType'])[0];
        if (findComanyType !== null && findComanyType !== "") {
          filterCompanyTypeValue(findComanyType)
        }
      }


      if (data['gstR1FilingType'] !== null && data['gstR1FilingType'] !== "") {
        const findFilingType = gstr1FilingList.filter(p => p.value == data['gstR1FilingType'])[0];

        if (findFilingType !== null && findFilingType !== "" && findFilingType !== undefined) {
          setValue("gstr1Filling", findFilingType)
        }
      }

      if (data['registrationType'] !== null && data['registrationType'] !== "") {
        const findRegType = typeOfRegOptionList.filter(p => p.value == data['registrationType'])[0];
        if (findRegType !== null && findRegType !== "") {
          setValue("typeOfReg", findRegType)
        }
      }

      // Other Information Of The Company
      if (data['isCompositionScheme'] !== null && data['isCompositionScheme'] !== "") {
        const compSchema = data['isCompositionScheme'] == true ? '1' : '0'
        const findCompSchema = yesNoList.filter(p => p.value == compSchema)[0];
        if (findCompSchema !== null && findCompSchema !== "") {
          setValue("othCompScheme", findCompSchema)
        }
      }

      if (data['isECommerceOperator'] !== null && data['isECommerceOperator'] !== "") {
        const ecommerOperation = data['isECommerceOperator'] == true ? '1' : '0'
        const findEcommerOperation = yesNoList.filter(p => p.value == ecommerOperation)[0];
        if (findEcommerOperation !== null && findEcommerOperation !== "") {
          setValue("othEommerceOperator", findEcommerOperation)
        }
      }

      if (data['isForeignTaxPerson'] !== null && data['isForeignTaxPerson'] !== "") {
        const fTaxPerson = data['isForeignTaxPerson'] == true ? '1' : '0'
        const findFTaxPerson = yesNoList.filter(p => p.value == fTaxPerson)[0];
        if (findFTaxPerson !== null && findFTaxPerson !== "") {
          setValue("othForeginTaxable", findFTaxPerson)
        }
      }

      if (data['isInputServiceDistributor'] !== null && data['isInputServiceDistributor'] !== "") {
        const inputSerDistributor = data['isInputServiceDistributor'] == true ? '1' : '0'
        const findInputSerDistributor = yesNoList.filter(p => p.value == inputSerDistributor)[0];

        if (findInputSerDistributor !== null && findInputSerDistributor !== "") {
          setValue("othServiceDistributor", findInputSerDistributor)
        }
      }

      if (data['isTDSApplicable'] !== null && data['isTDSApplicable'] !== "") {
        const TDSApp = data['isTDSApplicable'] == true ? '1' : '0'
        const findTDSApp = yesNoList.filter(p => p.value == TDSApp)[0];

        if (findTDSApp !== null && findTDSApp !== "") {
          setValue("othTDSApplicable", findTDSApp)
        }
      }

      if (data['isitC04Applicable'] !== null && data['isitC04Applicable'] !== "") {
        const itc04App = data['isitC04Applicable'] == true ? '1' : '0'
        const finditc04App = yesNoList.filter(p => p.value == itc04App)[0];

        if (finditc04App !== null && finditc04App !== "") {
          setValue("othITC04Applicable", finditc04App)
        }
      }

      if (data['clientStatus'] !== null && data['clientStatus'] !== "") {
        const clientStatuses = data['clientStatus'] == true ? '1' : '0'
        const findClientStatuses = clientStatusList.filter(p => p.value == clientStatuses)[0];
        if (findClientStatuses !== null && findClientStatuses !== "") {
          setValue("clientStatus", findClientStatuses);
        }
      }

      // Contact Person Details
      setValue("contactpersondesignation", data['contactPersonDesignation'])
      setValue("contactpersonemail", data['contactPersonEmail'])
      setValue("contactpersonmobileno", data['contactPersonMobileNo'])
      setValue("contactpersonofficeno", data['contactPersonOfficeNo'])
      setValue("contactpersonname", data['contactPersonName'])

      setValue("ewaybillusername", data['ewayBillUserName'])
      setValue("ewaybillpassword", data['ewayBillPassword'])

      setValue("icegateusername", data['iceGateUserName'])
      setValue("icegatepassword", data['iceGatePassword'])

    }
  }


  //** Reset
  const resetForm = () => {
    setBtnDisable(false)
    setCompanyTypeOption(companyOptionsList[0]);
    setgstrfilling(gstr1FilingList[0]);
    setRegTypeOption(typeOfRegOptionList[0]);
    reset();
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


  //** Onsubmit
  const onSubmit = data => {
    let isValid = true;

    if (!ValidateString(data.gstinusername)) {
      setError('gstinusername', { type: 'manual', message: 'Invalid Username' })
      isValid = false;
    }
    if (!ValidateString(data.gstinpassword)) {
      setError('gstinpassword', { type: 'manual', message: 'Invalid Password' })
      isValid = false;
    }
    if (!ValidateString(data.companyname)) {
      setError('companyname', { type: 'manual', message: 'Invalid Company Name' })
      isValid = false;
    }
    if (!ValidateString(data.gstinno)) {
      setError('gstinno', { type: 'manual', message: 'Invalid GSTIN No' })
      isValid = false;
    }
    if (!ValidateString(data.tradename)) {
      setError('tradename', { type: 'manual', message: 'Invalid Trade Name' })
      isValid = false;
    }


    if (isValid == false) {
    } else {

      const gstPayload = {
        gstIn : data.gstinno
      }

      const  entrptPayload = {
        data : encryptData.encrypt(JSON.stringify(gstPayload))
       }

      companyNewService.getGSTINValidate(entrptPayload).then(res => {

        console.log(res)
        const loginDecptyData = encryptData.decrypt((res?.data?.data));
        const parsedLoginData = JSON.parse(loginDecptyData)


        if (res.status === 200 && parsedLoginData.status === errorCodeConfig.APIDefaultCode.Success) {
          if (btnName == "Save") {

            const companyData = new CompanyAdd(
              data.gstinno.trim(),
              data.companyname.trim(),
              data.tradename !== "" && data.tradename !== null ? data.tradename.trim() : '',
              data.fileno !== "" && data.fileno !== null ? data.fileno.trim() : '',
              data.groupname !== "" && data.groupname !== null ? data.groupname.trim() : '',
              companyTypeOption.value !== 0 ? parseInt(companyTypeOption.value) : null, // Company Type
              data.mobileno !== "" && data.mobileno !== null ? data.mobileno.trim() : '',
              data.emailid !== "" && data.emailid !== null ? data.emailid.trim() : '',
              // data.gstr1Filling.value,
              // data.typeOfReg.value,
              data?.gstr1Filling?.value !== null && data?.gstr1Filling?.value !== "" && data?.gstr1Filling?.value !== undefined ? data?.gstr1Filling?.value : "",
              data?.typeOfReg?.value !== null && data?.typeOfReg?.value !== "" && data?.typeOfReg?.value !== undefined ? data?.typeOfReg?.value : 0,
              data.gstinusername !== "" && data.gstinusername !== null ? encryptData.encrypt(data.gstinusername.trim()) : '',
              data.gstinpassword !== "" && data.gstinpassword !== null ? encryptData.encrypt(data.gstinpassword.trim()) : '',
              data.othCompScheme.value == 1 ? true : false,
              data.othForeginTaxable.value == 1 ? true : false,
              data.othServiceDistributor.value == 1 ? true : false,
              data.othTDSApplicable.value == 1 ? true : false,
              data.othEommerceOperator.value == 1 ? true : false,
              data.othITC04Applicable.value == 1 ? true : false,
              data.clientStatus.value == 1 ? true : false, // clientStatus
              data.contactpersonname !== "" && data.contactpersonname !== null ? data.contactpersonname.trim() : '',
              data.contactpersondesignation !== "" && data.contactpersondesignation !== null ? data.contactpersondesignation.trim() : '',
              data.contactpersonemail !== "" && data.contactpersonemail !== null ? data.contactpersonemail.trim() : '',
              data.contactpersonofficeno !== "" && data.contactpersonofficeno !== null ? data.contactpersonofficeno.trim() : '',
              data.contactpersonmobileno !== "" && data.contactpersonmobileno !== null ? data.contactpersonmobileno.trim() : '',
              userIds, // insert by
              userIds, // userid
              data.ewaybillusername !== "" && data.ewaybillusername !== null ? data.ewaybillusername.trim() : '',
              data.ewaybillpassword !== "" && data.ewaybillpassword !== null ? data.ewaybillpassword.trim() : '',
              data.icegateusername !== "" && data.icegateusername !== null ? data.icegateusername.trim() : '',
              data.icegatepassword !== "" && data.icegatepassword !== null ? data.icegatepassword.trim() : '',

            );


            setBlock(true)
            setBtnDisable(true)
            companyNewService.AddNewCompany(companyData).then(res => {

              console.log(res)
              if (res.status === 200 && res.data.status === errorCodeConfig.APIDefaultCode.Success) {
                setBlock(false)
                // toast.success(res.data.successMessage, {
                //   position: "top-right", duration: 3000,
                // });
                // navigator('/dashboard/company')

                Swal.fire({
                  icon: 'success',
                  title: 'Message',
                  text: res.data.successMessage,
                  customClass: {
                    confirmButton: 'btn btn-danger'
                  },
                  buttonsStyling: false,
                  allowOutsideClick: false

                }).then(function() {
                  navigator('/dashboard/company')
              });

              } else {
                setBlock(false)
                Swal.fire({
                  icon: 'error',
                  title: '',
                  text: res?.data?.errorMessage,
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
              setBtnDisable(false)
            })
          } else if (btnName == "Update") {

            console.log(data)

            const companyData = new CompanyEdit(
              editClientId,
              data.gstinno.toString().trim(),
              data.companyname.toString().trim(),
              data.tradename !== "" && data.tradename !== null ? data.tradename.toString().trim() : '',
              data.fileno !== "" && data.fileno !== null ? data.fileno.trim() : '',
              data.groupname !== "" && data.groupname !== null ? data.groupname.trim() : '',
              companyTypeOption.value !== 0 ? parseInt(companyTypeOption.value) : null, // Company Type
              data.mobileno !== "" && data.mobileno !== null ? data.mobileno.trim() : '',
              data.emailid !== "" && data.emailid !== null ? data.emailid.trim() : '',
              // data.gstr1Filling.value,
              // data.typeOfReg.value,
              data?.gstr1Filling?.value !== null && data?.gstr1Filling?.value !== "" && data?.gstr1Filling?.value !== undefined ? data?.gstr1Filling?.value : "",
              data?.typeOfReg?.value !== null && data?.typeOfReg?.value !== "" && data?.typeOfReg?.value !== undefined ? data?.typeOfReg?.value : 0,
              data.gstinusername !== "" && data.gstinusername !== null ? encryptData.encrypt(data.gstinusername.trim()) : '',
              data.gstinpassword !== "" && data.gstinpassword !== null ? encryptData.encrypt(data.gstinpassword.trim())  : '',
              data.othCompScheme.value == 1 ? true : false,
              data.othForeginTaxable.value == 1 ? true : false,
              data.othServiceDistributor.value == 1 ? true : false,
              data.othTDSApplicable.value == 1 ? true : false,
              data.othEommerceOperator.value == 1 ? true : false,
              data.othITC04Applicable.value == 1 ? true : false,
              data.clientStatus.value == 1 ? true : false, // clientStatus
              data.contactpersonname !== "" && data.contactpersonname !== null ? data.contactpersonname.trim() : '',
              data.contactpersondesignation !== "" && data.contactpersondesignation !== null ? data.contactpersondesignation.trim() : '',
              data.contactpersonemail !== "" && data.contactpersonemail !== null ? data.contactpersonemail.trim() : '',
              data.contactpersonofficeno !== "" && data.contactpersonofficeno !== null ? data.contactpersonofficeno.trim() : '',
              data.contactpersonmobileno !== "" && data.contactpersonmobileno !== null ? data.contactpersonmobileno.trim() : '',
              userIds, // insert by
              userIds, // userid
              data.ewaybillusername !== "" && data.ewaybillusername !== null ? data.ewaybillusername.trim() : '',
              data.ewaybillpassword !== "" && data.ewaybillpassword !== null ? data.ewaybillpassword.trim() : '',
              data.icegateusername !== "" && data.icegateusername !== null ? data.icegateusername.trim() : '',
              data.icegatepassword !== "" && data.icegatepassword !== null ? data.icegatepassword.trim() : '',


            );
            setBlock(true)
            setBtnDisable(true)
            companyNewService.editCompany(companyData).then(res => {

              if (res.status === 200 && res.data.status === errorCodeConfig.APIDefaultCode.Success) {
                setBlock(false)

                Swal.fire({
                  icon: 'success',
                  title: 'Message',
                  text: res.data.successMessage,
                  customClass: {
                    confirmButton: 'btn btn-danger'
                  },
                  buttonsStyling: false,
                  allowOutsideClick: false
                }).then(function() {
                  navigator('/dashboard/company')
              });

                // toast.success(res.data.successMessage, {
                //   position: "top-right", duration: 3000,
                // });
                // navigator('/dashboard/company')
              } else {
                setBlock(false)
                Swal.fire({
                  icon: 'error',
                  title: '',
                  text: res?.data?.errorMessage,
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
              setBtnDisable(false)
            })
          }

        }
        else {
          setValue('gstinno', "");
          setError('gstinno', { type: 'manual', message: res.data.errorMessage })

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
        setBtnDisable(false)
      })

    }
  }
console.log(errors,'errorsPrint')
  // ** Filters
  const filterCompanyTypeValue = (selectedOption) => {
    setCompanyTypeOption(selectedOption)
  }


  // ** GSTIN Validation
  const GSTINValidate = (colValue) => {
    const regix = new RegExp('^([0][1-9]|[1-2][0-9]|[3][0-7])([a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1})+$');
    const setPassword = getValues(colValue);
    var result = regix.test(setPassword);

    if (result === false) {
      return false
    } else {
      return true
    }
  }

  // ** GSTIN validation check - api service
  const GSTINCheck = (gstin) => {
    if (gstin == " " || gstin == null || gstin == undefined || gstin.trim().length == 0) {
      setError('gstinno', { type: 'manual', message: 'Please insert GSTIN' })
    } else {

      const gstPayload = {
        gstIn : gstin
      }

      const  entrptPayload = {
        data : encryptData.encrypt(JSON.stringify(gstPayload))
       }

      companyNewService.getGSTINValidate(entrptPayload).then(res => {
        console.log(res)

        const loginDecptyData = encryptData.decrypt((res?.data?.data));
        const parsedLoginData = JSON.parse(loginDecptyData)

        console.log(parsedLoginData, " parsedLoginData")

        if (res.status === 200 && parsedLoginData.status === errorCodeConfig.APIDefaultCode.Success) {
          clearErrors('gstinno')

        }
        else {
          setValue('gstinno', null);
          setError('gstinno', { type: 'manual', message: res.data.errorMessage })

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

  //** Import - data
  const ImportGSTINData = () => {

    if ((getValues('gstinusername') == null || getValues('gstinusername') == "") &&
      (getValues('gstinpassword') == null || getValues('gstinpassword') == "")) {
      setError('gstinusername', { type: 'manual', message: "Please insert username" })
      setError('gstinpassword', { type: 'manual', message: "Please insert password" })
    }

    else if (getValues('gstinusername') == null || getValues('gstinusername') == "" || !ValidateString(getValues('gstinusername'))) {
      setError('gstinusername', { type: 'manual', message: "Please insert username" })
    } else if (getValues('gstinpassword') == null || getValues('gstinpassword') == "" || !ValidateString(getValues('gstinpassword'))) {
      setError('gstinpassword', { type: 'manual', message: "Please insert password" })
    }
    else {
      clearErrors();
      const gstData = {
        "userId": userIds,
        "userName": encryptData.encrypt(getValues('gstinusername')),
        "password": encryptData.encrypt(getValues('gstinpassword')),
        "subscriptionId": subscriptionIds
      }

      setBlock(true)
      console.log(gstData);
      setBtnDisable(true)
      ImportGSTCompany.ImportCompany(gstData).then(res => {

        if (res.status === 200 && res.data.status === errorCodeConfig.APIDefaultCode.Success) {

          setBlock(false)
          Swal.fire({
            icon: 'success',
            title: 'Message',
            text: res.data.successMessage,
            customClass: {
              confirmButton: 'btn btn-danger'
            },
            buttonsStyling: false,
            allowOutsideClick: false
          }).then(function() {
            navigator('/dashboard/company')
           // window.location = "redirectURL";
        });

         // toast.success("Successfully data imported.", { position: "top-right" });
          // setTimeout(() => {
          //   setBlock(false)
          //   LocalFunction.setLocalValue(globleVariable.vimportData, res.data.data.clientId, true)

          //   CompanyConstants.ADD_COMPANY = true;
          //   console.log(CompanyConstants.ADD_COMPANY)
          //   clearErrors();
          //   dispatch(getImportData(res.data))
          //   setImportSearch(true)
          //   setBtnName('Update')
          // }, 3000);
        } else {
          setBlock(false)
          localStorage.removeItem(globleVariable.vimportData);
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
        localStorage.removeItem(globleVariable.vimportData);
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
      setBtnDisable(false)
    }
  }


  //** integer value check function
  function isInteger(value) {
    const num = value.trim();
    return !(value.match(/\s/g) || num == "" || isNaN(num) || (typeof (value) == 'number'))
  }

  //** Mobile validation
  const mobileValidation = (data) => {
    if (data !== null) {
      if (isInteger(data) == true) {
        if (data.length !== 10) {
          setValue("mobileno", "");
          setError('mobileno', { type: 'manual', message: "Please enter valid mobile number.", required: true })
          return false;
        } else {
          clearErrors("mobileno")
        }
      }
    } else {
      setError('mobileno', { type: 'manual', message: "Please enter valid mobile number.", required: true })
    }
  }

  return (
    <Fragment>
      {/* <UILoader blocking={block} loader={<Loader />}> */}
      {block && <div className="loading1">Loading&#8230;</div>}
      <Form className='mt-2 pt-50' onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardBody className='py-2 my-25'>
            <div className='content-header'>
              <h5 className='mb-0'>GST Information</h5>
            </div>
            <br></br>
            <Row>
            <Col md='3' className='mb-1'>
                <Label className='form-label requiredlable'>
                  GSTIN Username
                </Label>
                <Controller
                  id='gstinusername'
                  name='gstinusername'
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => <Input placeholder='' maxLength={50} onPaste={(e) => handlePasteText(e, setError,'gstinusername','GSTIN Username','allowSpace')}  onKeyPress={(e) => handleKeyPressPass(e, setError,'gstinusername','GSTIN Username','allowSpace')} invalid={(errors.gstinusername?.type =="required" || ( errors.gstinusername?.type =="manual" && errors.gstinusername?.message != "")) && true} {...field} />}
                />
                {console.log(errors.gstinusername?.type,"errors.gstinusername")}
                {(errors.gstinusername?.type =="required" || (errors?.gstinusername?.type =="manual" && errors.gstinusername?.message !=""))  && <FormFeedback>Please enter a valid GSTIN Username</FormFeedback>}
              </Col>
              <Col md='3' className='mb-1'>
                <Label className='form-label requiredlable'>
                  GSTIN Password
                </Label>
                <Controller
                  id='gstinpassword'
                  name='gstinpassword'
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => <InputPasswordToggle maxLength={50} autoComplete="new-password" className='input-group-merge' placeholder=''
                  onPaste={(e) => handlePasteText(e, setError,'gstinpassword','GSTIN Password','password')}
                  onKeyPress={(e) => handleKeyPressPass(e, setError,'gstinpassword','GSTIN Password','password')}
                  invalid={(errors.gstinpassword?.type =="required" || ( errors.gstinpassword?.type =="manual" && errors.gstinpassword?.message != "")) && true} {...field} />}
                />
                {errors.gstinpassword && <FormFeedback>Please enter a valid GSTIN Password</FormFeedback>}
              </Col>

              <Col md='3' className='mb-1'>
                <Label className='form-label'>
                </Label>
                <div>
                  <Button className='me-1' disabled={btnDisable}   id="importcompany" color='danger' onClick={ImportGSTINData} outline>
                    Import Company
                  </Button>
                  <UncontrolledTooltip placement="top" target="importcompany">
                    Import Company [{keysMap.IMPORT_DATA}]
                  </UncontrolledTooltip>
                </div>
              </Col>
            </Row>

            {/*  Don't Remove This Code */}

            {/* <Row>
              <Col md='3' className='mb-1'>
                <Label className='form-label'>
                  E-way Bill Username
                </Label>
                <Controller
                  control={control}
                  id='ewaybillusername'
                  name='ewaybillusername'
                  render={({ field }) => (
                    <Input placeholder='' maxLength={50} invalid={errors.ewaybillusername && true} {...field} />
                  )}
                />
                {errors.ewaybillusername && <FormFeedback>{errors.ewaybillusername.message}</FormFeedback>}
              </Col>
              <Col md='3' className='mb-1'>
                <Label className='form-label'>
                  E-way Bill Password
                </Label>
                <Controller
                  control={control}
                  id='ewaybillpassword'
                  name='ewaybillpassword'
                  render={({ field }) => (
                    <InputPasswordToggle maxLength={50} className='input-group-merge' invalid={errors.ewaybillpassword && true} {...field} />
                  )}
                />
                {errors.ewaybillpassword && <FormFeedback>{errors.ewaybillpassword.message}</FormFeedback>}
              </Col>

              <Col md='3' className='mb-1'>
                <Label className='form-label' >
                  ICE GATE Username
                </Label>
                <Controller
                  control={control}
                  id='icegateusername'
                  name='icegateusername'
                  render={({ field }) => (
                    <Input placeholder='' maxLength={50} invalid={errors.icegateusername && true} {...field} />
                  )}
                />
                {errors.icegateusername && <FormFeedback>{errors.icegateusername.message}</FormFeedback>}
              </Col>
              <Col md='3' className='mb-1'>
                <Label className='form-label' for={`email`}>
                  ICE GATE password
                </Label>
                <Controller
                  control={control}
                  id='icegatepassword'
                  name='icegatepassword'
                  render={({ field }) => (
                    <InputPasswordToggle maxLength={50} className='input-group-merge' invalid={errors.icegatepassword && true} {...field} />
                  )}
                />
                {errors.icegatepassword && <FormFeedback>{errors.icegatepassword.message}</FormFeedback>}
              </Col>
            </Row> */}
          </CardBody>
        </Card>

        <Card>
          <CardBody className='py-2 my-25'>
            <div className='content-header'>
              <h5 className='mb-0'>Company Information</h5>
            </div><br />
            <Row>
              <Col md='3' className='mb-1'>
                <Label className='form-label requiredlable' for='company-name'>
                  Company Name / Taxable Person Name
                </Label>
                <Controller
                  id='companyname'
                  name='companyname'
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) =>
                  <Input placeholder='' maxLength={100}
                    onPaste={(e) => handlePasteText(e, setError,'companyname','company name','allowSpace')}
                    onKeyPress={(e) => handleKeyPressPass(e, setError,'companyname','company name','allowSpace')}
                    //  invalid={errors?.companyname && true} {...field} />}
                    invalid={errors?.companyname?.message ||errors?.companyname?.type=="required" && true} {...field}
                  />
                }
                />
                {(errors?.companyname?.message!="" || errors?.companyname?.type=="required") && <FormFeedback>Please enter a valid company name</FormFeedback>}
              </Col>
              <Col md='3' className='mb-1'>
                <Label className='form-label requiredlable' >
                  Trade Name
                </Label>
                <Controller
                  control={control}
                  id='tradename'
                  name='tradename'
                  rules={{ required: true }}
                  render={({ field }) => (
                  <Input placeholder='' maxLength={100}
                    onPaste={(e) => handlePasteText(e, setError, 'tradename', 'trade name', 'allowSpace')}
                    onKeyPress={(e) => handleKeyPressPass(e, setError, 'tradename', 'trade name', 'allowSpace')}
                    invalid={errors?.tradename?.message ||errors?.tradename?.type=="required" && true} {...field}
                  />
                  )}
                />
                {/* {(errors?.tradename?.message!="" || errors?.tradename?.type=="required") && <FormFeedback>{errors?.tradename?.message}</FormFeedback>} */}
                { (errors?.tradename?.message!="" || errors?.tradename?.type=="required")  && <FormFeedback>Please enter a valid trade name</FormFeedback>}
              </Col>
              <Col md='3' className='mb-1'>
                <Label className='form-label requiredlable' for='gstin-no'>
                  GSTIN No
                </Label>
                <Controller
                  id='gstinno'
                  name='gstinno'
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) =>
                    <Input
                      disabled={(btnName == 'Update' ? true : false) }
                      placeholder=''
                      invalid={errors.gstinno && true}
                      {...field}
                      maxLength={15}
                      onChange={(e) => field.onChange(e.target.value = e.target.value.toUpperCase())}
                      // value={validGstin}
                      onBlur={(e) => GSTINCheck(e.target.value)}
                      // onKeyPress={(e) => {
                      //   if (new RegExp(/[a-zA-Z0-9"]/).test(e.key)) {
                      //   } else e.preventDefault();
                      // }}
                      onPaste={(e) => {
                        if (new RegExp(/[a-zA-Z0-9"]/).test(e.key)) {
                        } else e.preventDefault();
                      }}
                    />}
                />
                {errors.gstinno && <FormFeedback>Please enter a valid GSTIN</FormFeedback>}
              </Col>
              <Col md='3' className='mb-1'>
                <Label className='form-label' >
                  Company Type
                </Label>
                <Select
                  theme={selectThemeColors}
                  className='react-select'
                  classNamePrefix='select'
                  value={companyTypeOption}
                  placeholder={DROPDOWN_PLACEHOLDER}
                  options={companyOptionsList}
                  isClearable={false}
                  onChange={filterCompanyTypeValue}
                />
              </Col>
            </Row>
            <Row>
              <Col md='3' className='mb-1'>
                <Label className='form-label'>
                  Mobile No
                </Label>
                <Controller
                rules={{
                  // pattern: /^\d{10}$/, // Regular expression to validate 10 digits
                  // message: "Please enter a valid 10-digit mobile number."
                  pattern: {
                    value: /^\d{10}$/,
                    message: "Please enter a valid mobile no."
                  }
                }}
                  id='mobileno'
                  name='mobileno'
                  control={control}
                  render={({ field }) => <Input placeholder='' invalid={errors.mobileno && true} {...field}
                    onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))}
                    maxLength={10}
                    // onBlur={(e) => mobileValidation(e.target.value)}
                  />}
                />
                {errors.mobileno && <FormFeedback>{errors.mobileno.message}</FormFeedback>}
              </Col>
              <Col md='3' className='mb-1'>
                <Label className='form-label' >
                  Email Id
                </Label>
                <Controller
                  control={control}
                  id='emailid'
                  name='emailid'
                  rules={{
                    pattern: {
                      // value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\s*$/i,
                      value: /^(?!.*yopmail)[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Please enter valid email."
                    }
                  }}
                  render={({ field }) => (
                    <Input placeholder='' maxLength={200}  onPaste={(e) => handlePasteText(e, setError,'emailid','email','email')}
                    onKeyPress={(e) => handleKeyPressText(e, setError,'emailid')} invalid={errors?.emailid?.message && true} {...field} />
                  )}
                />
                {errors.emailid && <FormFeedback>{errors.emailid.message}</FormFeedback>}
              </Col>
              <Col md='3' className='mb-1'>
                <Label className='form-label'>
                  Code /File No
                </Label>
                <Controller
                  id='fileno'
                  name='fileno'
                  control={control}
                  render={({ field }) => <Input placeholder='' invalid={errors.fileno && true} {...field} maxLength={10} />}
                />
                {errors.fileno && <FormFeedback>{errors.fileno.message}</FormFeedback>}
              </Col>
              <Col md='3' className='mb-1'>
                <Label className='form-label'>
                  Group Name
                </Label>
                <Controller
                  id='groupname'
                  name='groupname'
                  control={control}
                  render={({ field }) =>
                  <Input placeholder='' invalid={errors.groupname?.message && true} {...field} maxLength={100}
                  onPaste={(e) => handlePasteText(e, setError, 'groupname', 'groupname', 'allowSpace')}
                  onKeyPress={(e) => handleKeyPressPass(e, setError, 'groupname', 'groupname', 'allowSpace')}
                  />}

                />
                {errors.groupname && <FormFeedback>{errors.groupname.message}</FormFeedback>}
              </Col>
            </Row>
            <Row>
              <Col md='3' className='mb-1'>
                <Label className='form-label' >
                  GSTR 1 Filing
                </Label>

                <Controller
                  id='gstr1Filling'
                  name='gstr1Filling'
                  control={control}
                  render={({ field }) =>
                    <Select
                      isClearable={false}
                      value={field.value}
                      options={gstr1FilingList}
                      placeholder={DROPDOWN_PLACEHOLDER}
                      classNamePrefix='select'
                      theme={selectThemeColors}
                      onChange={field.onChange}
                      className={classnames('react-select', { 'is-invalid': errors.gstr1Filling && true })}
                      {...field}
                    />
                  }
                />

                {errors.gstr1Filling && <FormFeedback>Please select GSTR1 Filing</FormFeedback>}
              </Col>
              <Col md='3' className='mb-1'>
                <Label className='form-label requiredlable' >
                  Type of Registration
                </Label>

                <Controller
                  id='typeOfReg'
                  name='typeOfReg'
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) =>
                    <Select
                      isClearable={false}
                      value={field.value}
                      options={typeOfRegOptionList}
                      placeholder={DROPDOWN_PLACEHOLDER}
                      classNamePrefix='select'
                      theme={selectThemeColors}
                      onChange={field.onChange}
                      className={classnames('react-select', { 'is-invalid': errors.typeOfReg && true })}
                      {...field}
                    />
                  }
                />

                {errors.typeOfReg && <FormFeedback>Please select type of registration </FormFeedback>}

              </Col>
            </Row>
          </CardBody>
        </Card>

             {/*  Don't Remove This code  */}

        {/* <Card>
          <CardBody className='py-2 my-25'>
            <div className='content-header'>
              <h5 className='mb-0'>Other Information Of The Company </h5>
            </div><br />
            <Row>
              <Col md='3' className='mb-1'>
                <Label className='form-label requiredlable' >
                  Are you following composition schema ?
                </Label>
                <Controller
                  id='othCompScheme'
                  name='othCompScheme'
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) =>
                    <Select
                      isClearable={false}
                      value={field.value}
                      options={yesNoList}
                      classNamePrefix='select'
                      theme={selectThemeColors}
                      onChange={field.onChange}
                      className={classnames('react-select', { 'is-invalid': errors.othCompScheme && true })}
                      {...field}
                    />
                  }
                />
                {errors.othCompScheme && <FormFeedback>Please select composition schema</FormFeedback>}
              </Col>
              <Col md='3' className='mb-1'>
                <Label className='form-label requiredlable' >
                  Are you foreign taxable person(Foreign)?
                </Label>
                <Controller
                  id='othForeginTaxable'
                  name='othForeginTaxable'
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) =>
                    <Select
                      isClearable={false}
                      value={field.value}
                      options={yesNoList}
                      classNamePrefix='select'
                      theme={selectThemeColors}
                      onChange={field.onChange}
                      className={classnames('react-select', { 'is-invalid': errors.othForeginTaxable && true })}
                      {...field}
                    />
                  }
                />
                {errors.othForeginTaxable && <FormFeedback>Please select foreign taxable person</FormFeedback>}

              </Col>
              <Col md='3' className='mb-1'>
                <Label className='form-label requiredlable' >
                  Are you input service distributor ?
                </Label>
                <Controller
                  id='othServiceDistributor'
                  name='othServiceDistributor'
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) =>
                    <Select
                      isClearable={false}
                      value={field.value}
                      options={yesNoList}
                      classNamePrefix='select'
                      theme={selectThemeColors}
                      onChange={field.onChange}
                      className={classnames('react-select', { 'is-invalid': errors.othServiceDistributor && true })}
                      {...field}
                    />
                  }
                />

                {errors.othServiceDistributor && <FormFeedback>Please select input service distributor</FormFeedback>}
              </Col>
              <Col md='3' className='mb-1'>

                <Label className='form-label requiredlable' >
                  Is TDS applicable to your company ?&nbsp;
                </Label>
                <Controller
                  id='othTDSApplicable'
                  name='othTDSApplicable'
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) =>
                    <Select
                      isClearable={false}
                      value={field.value}
                      options={yesNoList}
                      classNamePrefix='select'
                      theme={selectThemeColors}
                      onChange={field.onChange}
                      className={classnames('react-select', { 'is-invalid': errors.othTDSApplicable && true })}
                      {...field}
                    />
                  }
                />
                {errors.othTDSApplicable && <FormFeedback>Please select TDS applicable</FormFeedback>}
              </Col>

            </Row>
            <Row>
              <Col md='3' className='mb-1'>
                <Label className='form-label requiredlable' >
                  Are you an Ecommerce Operator ?&nbsp;
                </Label>
                <Controller
                  id='othEommerceOperator'
                  name='othEommerceOperator'
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) =>
                    <Select
                      isClearable={false}
                      value={field.value}
                      options={yesNoList}
                      classNamePrefix='select'
                      theme={selectThemeColors}
                      onChange={field.onChange}
                      className={classnames('react-select', { 'is-invalid': errors.othEommerceOperator && true })}
                      {...field}
                    />
                  }
                />

                {errors.othEommerceOperator && <FormFeedback>Please select an e-commerce Operator</FormFeedback>}

              </Col>
              <Col md='3' className='mb-1'>
                <Label className='form-label requiredlable' >
                  Is ITC-04 applicable ? &nbsp;
                </Label>
                <Controller
                  id='othITC04Applicable'
                  name='othITC04Applicable'
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) =>
                    <Select
                      isClearable={false}
                      value={field.value}
                      options={yesNoList}
                      classNamePrefix='select'
                      theme={selectThemeColors}
                      onChange={field.onChange}
                      className={classnames('react-select', { 'is-invalid': errors.othITC04Applicable && true })}
                      {...field}
                    />
                  }
                />

                {errors.othITC04Applicable && <FormFeedback>Please select ITC-04 applicable</FormFeedback>}

              </Col>
              <Col md='3' className='mb-1'>
                <Label className='form-label' >
                  Client Status
                </Label>
                <Controller
                  id='clientStatus'
                  name='clientStatus'
                  control={control}
                  render={({ field }) =>
                    <Select
                      isClearable={false}
                      value={field.value}
                      options={clientStatusList}
                      classNamePrefix='select'
                      theme={selectThemeColors}
                      onChange={field.onChange}
                      className={classnames('react-select', { 'is-invalid': errors.clientStatus && true })}
                      {...field}
                    />
                  }
                />

                {errors.clientStatus && <FormFeedback>{errors.clientStatus.message}</FormFeedback>}

              </Col>
            </Row>
          </CardBody>
        </Card> */}
        <Card>

          <CardBody className='py-2 my-25'>
            <div className='content-header'>
              <h5 className='mb-0'>Contact Person Details</h5>
            </div><br />
            <Row>
              <Col md='3' className='mb-1'>
                <Label className='form-label'>
                  Contact Person Name
                </Label>
                <Controller
                  id='contactpersonname'
                  name='contactpersonname'
                  control={control}
                  render={({ field }) => <Input placeholder='' maxLength={100}
                  onPaste={(e) => handlePasteText(e, setError,'contactpersonname','Contact Person Name','allowSpace')}
                  onKeyPress={(e) => handleKeyPressPass(e, setError,'contactpersonname','Contact Person Name','allowSpace')}
                  // invalid={errors?.contactpersonname?.message && true} {...field} />
                  invalid={(errors.contactpersonname?.type =="required" || ( errors.contactpersonname?.type =="manual" && errors.contactpersonname?.message != "")) && true} {...field} />}
                />
                {errors.contactpersonname && <FormFeedback>{errors.contactpersonname.message}</FormFeedback>}
              </Col>
              {/* <Col md='3' className='mb-1'>
                <Label className='form-label'>
                  Contact Person Designation
                </Label>
                <Controller
                  control={control}
                  id='contactpersondesignation'
                  name='contactpersondesignation'
                  render={({ field }) => (
                    <Input placeholder='' maxLength={100} invalid={errors.contactpersondesignation && true} {...field} />
                  )}
                />
                {errors.contactpersondesignation && <FormFeedback>{errors.contactpersondesignation.message}</FormFeedback>}
              </Col> */}
              <Col md='2' className='mb-1'>
                <Label className='form-label' >
                  Contact Person Email
                </Label>
                <Controller
                  rules={{
                    pattern: {
                      // value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\s*$/i,
                      value: /^(?!.*yopmail)[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Please enter valid email."
                    }
                  }}
                  control={control}
                  id='contactpersonemail'
                  name='contactpersonemail'
                  render={({ field }) => (
                    <Input placeholder='' type='text' maxLength={100} invalid={errors?.contactpersonemail?.message && true} {...field}
                    onPaste={(e) => handlePasteText(e, setError,'contactpersonemail','contactpersonemail','email')}
                    onKeyPress={(e) => handleKeyPressText(e, setError,'contactpersonemail')}
                    />
                  )}
                />
                {errors?.contactpersonemail && <FormFeedback>{errors?.contactpersonemail?.message}</FormFeedback>}
              </Col>
              {/* <Col md='2' className='mb-1'>
                <Label className='form-label' >
                  Contact Person Office No.
                </Label>
                <Controller
                  control={control}
                  id='contactpersonofficeno'
                  name='contactpersonofficeno'
                  render={({ field }) => (
                    <Input placeholder='' invalid={errors.contactpersonofficeno && true} {...field}
                      onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))}
                      maxLength={10}
                    />
                  )}
                />
                {errors.contactpersonofficeno && <FormFeedback>{errors.contactpersonofficeno.message}</FormFeedback>}
              </Col> */}
              <Col md='2' className='mb-1'>
                <Label className='form-label' >
                  Contact Person Mobile No.
                </Label>
                <Controller
                 rules={{
                  // pattern: /^\d{10}$/, // Regular expression to validate 10 digits
                  // message: "Please enter a valid 10-digit mobile number."
                  pattern: {
                    value: /^\d{10}$/,
                    message: "Please enter a valid mobile no."
                  }
                }}

                  control={control}
                  id='contactpersonmobileno'
                  name='contactpersonmobileno'
                  render={({ field }) => (
                    <Input placeholder='' invalid={errors.contactpersonmobileno && true} {...field}
                      onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))}
                      maxLength={10}

                    />
                  )}
                />
                {errors.contactpersonmobileno && <FormFeedback>{errors.contactpersonmobileno.message}</FormFeedback>}
              </Col>
            </Row>
            <div className='btnFixFooter'>
              <Row className='justify-content-end mx-0'>
                <Col className='d-flex align-items-center justify-content-end' md='6' sm='12'>
                  <Button id="updatebtn" type='submit' className='me-1' color='danger' outline disabled={btnDisable}>
                    {btnName}
                  </Button>
                  <UncontrolledTooltip placement="top" target="updatebtn">
                  {btnName} [{keysMap.SAVE_DATA}]
                  </UncontrolledTooltip>
                  <Button color='secondary' className='me-1' onClick={resetForm} outline>
                    Reset
                  </Button>
                  <Button color='secondary' onClick={navigateDashboard} outline >
                    Back
                  </Button>
                </Col>
              </Row>
            </div>
          </CardBody>
        </Card>
      </Form>
    </Fragment>
  )
}

export default AccountTabs
