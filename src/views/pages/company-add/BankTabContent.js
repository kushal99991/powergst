// ** React Imports
import { Fragment, useState, useEffect, useRef } from 'react'
import { Link, useLocation, useSearchParams, useNavigate } from 'react-router-dom'
// ** Third Party Components
import Select from 'react-select'
import { useForm, Controller } from 'react-hook-form'
import 'cleave.js/dist/addons/cleave-phone.us'
import toast from 'react-hot-toast'

//** Error Code file
import errorCodeConfig from '../../../configs/apiErrorCodeConfig'

// ** Spinner (Splash Screen)
import Spinner from './../../../@core/components/spinner/Loading-spinner'
import UILoader from './../../../@core/components/ui-loader'

// ** Reactstrap Imports
import {
  Row, Col, Form, Card, Input, Label, Button, CardBody, CardTitle, CardHeader, FormFeedback, CardText, UncontrolledTooltip,
} from 'reactstrap'

// ** Utils
import { selectThemeColors } from '@utils'

// ** Models
import BankDetailsModel, { BankDetailsEditModel } from '../../../model/bank-details'

// ** Services
import companyService from '../../../services/company/companyNewService';

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import classnames from 'classnames'
// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/pages/page-form-validation.scss'

import $ from 'jquery'
// ** Handsontable
import { HotTable, HotColumn } from "@handsontable/react";
import Handsontable from 'handsontable';
import { registerRenderer, textRenderer } from 'handsontable/renderers';
import { registerAllModules } from 'handsontable/registry';
import { DROPDOWN_PLACEHOLDER , messageShowDuration } from '@configs/config'
import { keysMap, enableOnFormTags } from "../../../configs/config";
import { useHotkeys } from "react-hotkeys-hook";

import { globleVariable } from "../../../configs/globalVariable";
import LocalFunction from '../../../configs/getLocalFunction'


const MySwal = withReactContent(Swal)

const BankTabs = props => {
  const hotRef = useRef(null)
  const accountType = [];
  const { store, importsId, activeTabs } = props;

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

  const [btnDisable, setBtnDisable] = useState(false)
  const [editClientId, setEditClientId] = useState(clientId);
  const [clientBankId, setClientBankId] = useState(null);
  const [block, setBlock] = useState(false)
  const [importSearch, setImportSearch] = useState(localStorage.getItem(globleVariable.vimportData) !== null && localStorage.getItem(globleVariable.vimportData) !== '' &&
    localStorage.getItem(globleVariable.vimportData) !== undefined ? localStorage.getItem(globleVariable.vimportData) : null)
  // ** Hooks
  const defaultValues = {
    accountNo: '',
    ifscCode: '',
    bankName: '',
    bankAddress: '',
    bsrCode: '',
    micrCode: '',
    bankType: null
  }

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    clearErrors
  } = useForm({ defaultValues })

  // ** States
  const [avatar, setAvatar] = useState('')
  const [fetchdata, setfetchdata] = useState([])
  const [selectedOption, setSelectedOption] = useState(null);
  const [accountTypeDropdown, setAccountTypeDropdown] = useState([]);
  const [accountTypeError, setAccountTypeError] = useState(false);


  useHotkeys(keysMap.SAVE_DATA, () =>  {  activeTabs == 6 && block == false &&  handleSubmit(onSubmit)() } , {
    enableOnFormTags,
  });


  useEffect(() => {
    accountType.push({
      value: '1',
      label: 'Current'
    })
    accountType.push({
      value: '2',
      label: 'Saving'
    })
    accountType.push({
      value: '3',
      label: 'Cash/Credit'
    })
    accountType.push({
      value: '4',
      label: 'Other'
    })
    setAccountTypeDropdown(accountType);
  }, [])


  // ** redux state data get
  useEffect(() => {
    if (editClientId !== null && editClientId !== "") {
      console.log('edit bank')
      setEditClientId(editClientId)
      if (store.allCopmpanyDataById.data !== undefined) {
        clearErrors()
        setTimeout(() => {
          setfetchdata(store.allCopmpanyDataById.data.bank)
        }, 2000);
      }

    }

  }, [store])


   // ** redux state data get - import company
  useEffect(() => {
    if (importsId !== null && importsId !== "") {
      setEditClientId(importsId)
      console.log('import bank')
      if (store.importData.data !== undefined) {
        clearErrors()
        setTimeout(() => {
          setfetchdata(store.importData.data.bank)
        }, 2000);
      }
    }
  }, [store])

  const Loader = () => {
    return (
      <Fragment>
        <Spinner />
        <CardText className='mb-0 mt-1 text-white'>Please Wait...</CardText>
      </Fragment>
    )
  }

  useEffect(() => {
    return () => setBlock(false)
  }, [])

  //** Set Values
  const setValueCompany = (data) => {
    console.log('set data');
    if (data !== undefined) {
      setValue("accountNo", data['accountNo'])
      setValue("bankAddress", data['bankAddress'])
      setValue("bankName", data['bankName'])
      setValue("ifscCode", data['ifscCode'] !== null && data['ifscCode'] !== '' && data['ifscCode'] !== undefined ? data['ifscCode'] : null)
      setValue("bsrCode", data['bsrCode'] !== null && data['bsrCode'] !== '' && data['bsrCode'] !== undefined ? data['bsrCode'] : null)
      setValue("micrCode", data['micrCode'] !== null && data['micrCode'] !== '' && data['micrCode'] !== undefined ? data['micrCode'] : null)
      const filterAcType = accountTypeDropdown.filter(p => p.value == data['accountTypeId'])[0]
      console.log(filterAcType)
      filterValue(filterAcType);
      setValue("bankType", filterAcType)
      setClientBankId(data['clientBankId'])
    }
  }

  //**  Validation string trim 
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
    //   if (Object.values(data).every(field => field.length > 0)) {

    let IsValid = true;

    if (!ValidateString(data.accountNo)) {
      setError('accountNo', { type: 'manual', message: 'Invalid Account No' })
      IsValid = false;
    }
    if (!ValidateString(data.ifscCode)) {
      setError('ifscCode', { type: 'manual', message: 'Invalid IFSC Code' })
      IsValid = false;
    }
    if (!ValidateString(data.bankName)) {
      setError('bankName', { type: 'manual', message: 'Invalid Bank Name' })
      IsValid = false;
    }

    if (IsValid == true) {
      if (editClientId !== null && editClientId !== "" && clientBankId !== null) {
        console.log('edit bank')
        const bankDetailsAPIModel = new BankDetailsEditModel(
          clientBankId,
          data.accountNo.trim(),
          data.bankType.value.trim(),
          data.ifscCode.trim(),
          data.bankName.trim(),
          data.bankAddress.trim(),
          data.bsrCode !== null && data.bsrCode.trim() !== "" ? data.bsrCode.trim() : "",
          data.micrCode !== null && data.micrCode.trim() !== "" ? data.micrCode.trim() : "",
          editClientId
        )
        setBlock(true)
        setBtnDisable(true)
        companyService.editBankDetail(bankDetailsAPIModel).then(res => {
          setBlock(false)
          if (res.status === 200 && res.data.status === errorCodeConfig.APIDefaultCode.Success) {
            toast.success(res.data.successMessage, {
              position: "top-right", duration : messageShowDuration
            });

            GetBanklist(editClientId)
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
          setBlock(false);
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
      } else {

        if (editClientId == null) {
          toast.error("Please add company.", {
            position: "top-right",duration : messageShowDuration
          });
          return false;
        }

        const bankDetailsAPIModel = new BankDetailsModel(
          data.accountNo.trim(),
          data.bankType.value.trim(),
          data.ifscCode.trim(),
          data.bankName.trim(),
          data.bankAddress.trim(),
          data.bsrCode.trim(),
          data.micrCode.trim(),
          editClientId
        )
        setBlock(true)
        setBtnDisable(true)
        companyService.addBankDetail(bankDetailsAPIModel).then(res => {
          setBlock(false)
          if (res.status === 200 && res.data.status === errorCodeConfig.APIDefaultCode.Success) {
            toast.success(res.data.successMessage, {
              position: "top-right", duration : messageShowDuration
            });
            GetBanklist(editClientId)
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
        })
      }

      if (selectedOption == null || selectedOption.value == null || selectedOption.value == undefined) {
        setAccountTypeError(true);
      }
    }
  }

  //** Reset form
  const ResetForm = () => {
    reset();
    setClientBankId(null);
  }

  //** Bank List
  const GetBanklist = (clientId) => {
    console.log(clientId);
    companyService.getBankList(clientId).then(res => {
      console.log(res.data.data)
      if (res.status === 200 && res.data.status === errorCodeConfig.APIDefaultCode.Success) {
        setfetchdata(res.data.data);
      } else {
        setfetchdata([]);
      }
    })
  }

  //** Filters
  const filterValue = (selectedOption) => {
    console.log(selectedOption)
    setSelectedOption(selectedOption)
    if (selectedOption == null || selectedOption.value == null || selectedOption.value == undefined) {
      setAccountTypeError(true);
    }
    else {
      setAccountTypeError(false);
    }
  }


  // ** Edit Record 
  const editRecord = (data) => {
    console.log(data);
    clearErrors()
    setValueCompany(data);
  }

  // ** Delete Record 
  const deleteBank = (bankId) => {
    console.log(bankId)
    return MySwal.fire({
      title: 'Are you sure delete this bank record ?',
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

        companyService.deleteBankId(bankId).then(res => {
          console.log(res);
          if (res.status === 200 && res.data.status === errorCodeConfig.APIDefaultCode.Success) {
            toast.success(res.data.successMessage, {
              position: "top-right", duration : messageShowDuration
            });
            reset();
            GetBanklist(editClientId)
          } else {
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


  //** Column
  const ColumneHandsonTbl = [
    {
      data: "bankName",
      title: "Bank Name",
      readOnly: true,
      className: "htLeft"
    },
    {
      data: "accountNo",
      title: "Account No",
      readOnly: true
    },
    {
      data: "accountType",
      title: "Account Type",
      readOnly: true
    },
    {
      title: "Action",
      className: "htCenter"
    },
    {
      data: "accountTypeId",
      title: "accountTypeId",
      readOnly: true
    },
    {
      data: "bankAddress",
      title: "bankAddress",
      readOnly: true
    },
    {
      data: "bsrCode",
      title: "bsrCode",
      readOnly: true
    },
    {
      data: "clientBankId",
      title: "clientBankId",
      readOnly: true
    },
    {
      data: "ifscCode",
      title: "ifscCode",
      readOnly: true
    },
    {
      data: "micrCode",
      title: "micrCode",
      readOnly: true
    },

  ]

  //* button - dynamic button in Handsontable 
  function myBtns(instance, td, row, col, prop, value, cellProperties) {
    Handsontable.renderers.TextRenderer.apply(this, arguments);
    td.innerHTML = '<button class="btn"><i class="add-edit fa fa-edit"></i></button><button class="btn"><i class="add-delete fa fa-trash"></i></button>'
    const hot = hotRef?.current?.hotInstance;
    $(td).find('.add-delete').on('click', event => {

      deleteBank(hot.getDataAtRow(cellProperties.row)[7])
    });

    $(td).find('.add-edit').on('click', event => {
      // console.log('edit')
      // console.log(hot.getDataAtRow(cellProperties.row))
      // console.log(hot.getData(cellProperties.row))

      const data = {
        "bankName": hot.getDataAtRow(cellProperties.row)[0],
        "accountNo": hot.getDataAtRow(cellProperties.row)[1],
        "accountType": hot.getDataAtRow(cellProperties.row)[2],
        "accountTypeId": hot.getDataAtRow(cellProperties.row)[4],
        "bankAddress": hot.getDataAtRow(cellProperties.row)[5],
        "bsrCode": hot.getDataAtRow(cellProperties.row)[6],
        "clientBankId": hot.getDataAtRow(cellProperties.row)[7],
        "ifscCode": hot.getDataAtRow(cellProperties.row)[8],
        "micrCode": hot.getDataAtRow(cellProperties.row)[9],
      }

      editRecord(data)
    });
  }

   //** text align option
   const theader = (col, TH) => {
  
    if (col == 0 || col == 1 || col == 2 ) {
      TH.className = 'htLeft'
    }
  };

  return (
    <Fragment>
      {block && <div className="loading1">Loading&#8230;</div>}
      {/* <UILoader blocking={block} loader={<Loader />}> */}
      <Card>
        <CardBody className='py-2 my-25'>
          <div className='content-header'>
            <h5 className='mb-0'>Bank Account Maintained By The Application For Conducting Business</h5>
          </div>
          <Form className='mt-2 pt-50' onSubmit={handleSubmit(onSubmit)}>

            <Row>
              <Col md='2' className='mb-1'>
                <Label className='form-label requiredlable'>
                  Account No
                </Label>
                <Controller
                  rules={{ required: true , pattern : /^[A-Za-z0-9]+$/ }}
                  id='accountNo'
                  name='accountNo'
                  control={control}
                  render={({ field }) => <Input placeholder=''  maxLength={16} invalid={errors.accountNo && true} {...field}
                  onChange={(e) =>
                    field.onChange(e.target.value.replace(/\s/g, ""))
                  } 
                  />}
                />
                {errors.accountNo && <FormFeedback>Please enter a valid account number.</FormFeedback>}
              </Col>
              <Col md='2' className='mb-1'>
                <Label className='form-label requiredlable'>
                  Account Type
                </Label>
                <Controller
                  id='bankType'
                  name='bankType'
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) =>
                    <Select
                      isClearable={false}
                      value={field.value}
                      placeholder={DROPDOWN_PLACEHOLDER}
                      options={accountTypeDropdown}
                      classNamePrefix='select'
                      theme={selectThemeColors}
                      onChange={field.onChange}
                      className={classnames('react-select', { 'is-invalid': errors.bankType && true })}
                      {...field}
                    />
                  }
                />
                {errors.bankType && <FormFeedback>Please select account type.</FormFeedback>}
              </Col>

              <Col md='2' className='mb-1'>
                <Label className='form-label requiredlable'>
                  IFSC Code
                </Label>
                <Controller
                  rules={{ required: true }}
                  control={control}
                  id='ifscCode'
                  name='ifscCode'
                  render={({ field }) => (
                    <Input placeholder='' maxLength={11} invalid={errors.ifscCode && true} {...field} />
                  )}
                />
                {errors.ifscCode && <FormFeedback>Please enter valid ifsc code.</FormFeedback>}
              </Col>
              <Col md='6' className='mb-1'>
                <Label className='form-label requiredlable'>
                  Bank Name
                </Label>
                <Controller
                  rules={{ required: true }}
                  control={control}
                  id='bankName'
                  name='bankName'
                  render={({ field }) => (
                    <Input placeholder=''  maxLength={100} invalid={errors.bankName && true} {...field} />
                  )}
                />
                {errors.bankName && <FormFeedback>Please enter valid bank name.</FormFeedback>}
              </Col>
            </Row>
            <Row>
              <Col md='4' className='mb-1'>
                <Label className='form-label'>
                  Bank Address
                </Label>
                <Controller
                  id='bankAddress'
                  name='bankAddress'
                  control={control}
                  render={({ field }) => <Input placeholder=''  maxLength={500} type='textarea' rows='2' invalid={errors.bankAddress && true} {...field} />}
                />
                {errors.bankAddress && <FormFeedback>Please enter valid bank address.</FormFeedback>}
              </Col>
              <Col md='2' className='mb-1'>
                <Label className='form-label'>
                  BSR Code
                </Label>
                <Controller
                  id='bsrCode'
                  name='bsrCode'
                  control={control}
                  render={({ field }) => <Input placeholder='' maxLength={7} invalid={errors.bsrCode && true} {...field} />}
                />
                {errors.bsrCode && <FormFeedback>Please enter a valid bsr code.</FormFeedback>}
              </Col>
              <Col md='2' className='mb-1'>
                <Label className='form-label'>
                  MICR Code
                </Label>
                <Controller
                  id='micrCode'
                  name='micrCode'
                  control={control}
                  render={({ field }) => <Input placeholder='' maxLength={9} invalid={errors.micrCode && true} {...field} />}
                />
                {errors.micrCode && <FormFeedback>Please enter a valid micr code.</FormFeedback>}
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
                  <Button color='secondary' outline onClick={ResetForm}>
                    Reset
                  </Button>
                </Col>
              </Row>
            </div>
          </Form>
        </CardBody>
      </Card>
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
              cells={function (row, col) {
                const cellPrp = {};
                if (col === 3) {
                  cellPrp.renderer = myBtns;
                  cellPrp.readOnly = true;

                }
                return cellPrp
              }}
              hiddenColumns={{
                columns: [4, 5, 6, 7, 8, 9]
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

export default BankTabs
