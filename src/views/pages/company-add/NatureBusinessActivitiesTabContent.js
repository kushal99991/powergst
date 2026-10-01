// ** React Imports
import { Fragment, useState, useEffect } from 'react'

// ** Third Party Components
import { useForm, Controller } from 'react-hook-form'
import 'cleave.js/dist/addons/cleave-phone.us'
import Swal from 'sweetalert2'
import toast from 'react-hot-toast'
import { Link, useLocation, useSearchParams, useNavigate } from 'react-router-dom'
//** Error Code file
import errorCodeConfig from '../../../configs/apiErrorCodeConfig'

// ** Spinner (Splash Screen)
import Spinner from './../../../@core/components/spinner/Loading-spinner'

// ** Reactstrap Imports
import { Row, Col, Form, Card, Input, Label, Button, CardBody, CardTitle, CardHeader, FormFeedback, CardText, UncontrolledTooltip } from 'reactstrap'

// ** Models
import NatureOfBusinessModel from '../../../model/nature-Business-Activities'

// ** Services
import companyService from '../../../services/company/companyNewService';

import { useHotkeys } from "react-hotkeys-hook";
import { keysMap, enableOnFormTags } from "../../../configs/config";

import { useDispatch, useSelector } from 'react-redux'
import { getAllCopmpanyDataById } from '../../../views/apps/user/store'
import { messageShowDuration } from '@configs/config'

const NatureBusinessActivitiesTab = props => {

  const { store, importsId , activeTabs , userIds ,subscriptionIds  } = props;

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
  // const [importSearch, setImportSearch] = useState(localStorage.getItem(globleVariable.vimportData) !== null && localStorage.getItem(globleVariable.vimportData) !== '' &&
  //   localStorage.getItem(globleVariable.vimportData) !== undefined ? localStorage.getItem(globleVariable.vimportData) : null)

  
  // ** Hooks
  const defaultValues = {
  }

  const {
    control,
    setError,
    handleSubmit,
    clearErrors,
    formState: { errors },
    setValue
  } = useForm({ defaultValues })

  // ** States
  const [avatar, setAvatar] = useState('')
  const [bondedWareHouse, setBondedWareHouse] = useState(false);
  const [eou, setEou] = useState(false);
  const [exportChk, setExportChk] = useState(false);
  const [importChk, setImportChk] = useState(false);
  const [supplierService, setSupplierService] = useState(false);
  const [leasingBusiness, setLeasingBusiness] = useState(false);
  const [officeSale, setOfficeSale] = useState(false);
  const [retailBusiness, setRetailBusiness] = useState(false);
  const [warehouse, setWarehouse] = useState(false);
  const [wholesale, setWholesale] = useState(false);
  const [workContract, setWorkContract] = useState(false);
  const [goodsReceipt, setGoodReceipt] = useState(false);
  const [factoryManufacturing, setFactoryManufacturing] = useState(false);
  const [inputService, setInputService] = useState(false);
  const [serviceProvision, setServiceProvision] = useState(false);
  const [sez, setSez] = useState(false);
  const [other, setOther] = useState(false);
  const [clientNatureOfBusinessId, setClientNatureOfBusinessId] = useState(null)
  const [block, setBlock] = useState(false)
  const [btnDisable, setBtnDisable] = useState(false)
  const [searchApi , setSearchApi] = useState(false)
  const [searchData , setSearchData] = useState(false)
  const dispatch = useDispatch()

  useHotkeys(keysMap.SAVE_DATA, () =>  {  activeTabs == 3 && block == false &&  handleSubmit(onSubmit)() } , {
    enableOnFormTags,
  });


  useEffect(() => {
    console.log('edit nature')
    if (editClientId !== null && editClientId !== "") {
      console.log('edit nature in ')
      if (store.allCopmpanyDataById.data) {
        setBlock(true)
        setTimeout(() => {
          setBlock(false)
          setEditClientId(editClientId)
          setValueCompany(store.allCopmpanyDataById.data.nature);
        }, 3000);
      }
    }
  }, [store])


  useEffect(() => {
    console.log('searchpromoter')
    if (importsId !== null && importsId !== "") {
      setEditClientId(importsId)
      console.log('edit nature')
      if (store.importData.data !== undefined) {
        setTimeout(() => {
          setValueCompany(store.importData.data.nature);
        }, 2000);
      }
    }
  }, [store])


  useEffect(() => {
    
    if (editClientId !== null && editClientId !== "" && searchData == true ) {
      setEditClientId(editClientId)
      if (store.allCopmpanyDataById.data !== undefined) {
        clearErrors()
        setTimeout(() => {
          setValueCompany(store.allCopmpanyDataById.data.nature);
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



  const SelectionhandleChange = (ColValue) => {
    if (ColValue == "bondedWarehouse") {
      setBondedWareHouse(!bondedWareHouse)
    } else if (ColValue == "EOU") {
      setEou(!eou)
    } else if (ColValue == "Export") {
      setExportChk(!exportChk)
    } else if (ColValue == "Import") {
      setImportChk(!importChk)
    } else if (ColValue == "SupplierService") {
      setSupplierService(!supplierService)
    } else if (ColValue == "LeasingBusiness") {
      setLeasingBusiness(!leasingBusiness)
    } else if (ColValue == "OfficeSale") {
      setOfficeSale(!officeSale)
    } else if (ColValue == "RetailBusiness") {
      setRetailBusiness(!retailBusiness)
    } else if (ColValue == "Warehouse") {
      setWarehouse(!warehouse)
    } else if (ColValue == "Wholesale") {
      setWholesale(!wholesale)
    } else if (ColValue == "WorkContract") {
      setWorkContract(!workContract)
    } else if (ColValue == "GoodsReceipt") {
      setGoodReceipt(!goodsReceipt)
    } else if (ColValue == "FactoryManufacturing") {
      setFactoryManufacturing(!factoryManufacturing)
    } else if (ColValue == "InputService") {
      setInputService(!inputService)
    } else if (ColValue == "ServiceProvision") {
      setServiceProvision(!serviceProvision)
    } else if (ColValue == "Sez") {
      setSez(!sez)
    } else if (ColValue == "Other") {
      setOther(!other)
    }

  };


  const Loader = () => {
    return (
      <Fragment>
        <Spinner />
        <CardText className='mb-0 mt-1 text-white'>Please Wait...</CardText>
      </Fragment>
    )
  }

  //** Set values
  const setValueCompany = (data) => {
    if (data.length > 0) {
      setClientNatureOfBusinessId(data[0]['clientNatureOfBusinessId'])

      for (let i = 0; i < data.length; i++) {
        if (data[i]['natureName'] == "Bonded Warehouse") {
          setBondedWareHouse(true)
        } else if (data[i]['natureName'] == "EOU/STP/EHTP") {
          setEou(true)
        } else if (data[i]['natureName'] == "Export") {
          setExportChk(true)
        } else if (data[i]['natureName'] == "Import") {
          setImportChk(true)
        } else if (data[i]['natureName'] == "Supplier of service") {
          setSupplierService(true)
        } else if (data[i]['natureName'] == "Leasing Business") {
          setLeasingBusiness(true)
        } else if (data[i]['natureName'] == "Office/Sale Office") {
          setOfficeSale(true)
        } else if (data[i]['natureName'] == "Retails Business") {
          setRetailBusiness(true)
        } else if (data[i]['natureName'] == "Warehouse/Depot") {
          setWarehouse(true)
        } else if (data[i]['natureName'] == "Wholesale Business") {
          setWholesale(true)
        } else if (data[i]['natureName'] == "Work Contract") {
          setWorkContract(true)
        } else if (data[i]['natureName'] == "Recipient of Goods/Services") {
          setGoodReceipt(true);
        } else if (data[i]['natureName'] == "Factory/Manufacturing") {
          setFactoryManufacturing(true)
        } else if (data[i]['natureName'] == "Input Service Distributor (ISD)") {
          setInputService(true)
        } else if (data[i]['natureName'] == "Service Provision") {
          setServiceProvision(true)
        } else if (data[i]['natureName'] == "SEZ") {
          setSez(true)
        } else if (data[i]['natureName'] == "Other") {
          setOther(true)
        }
      }
    }
  }

  //** Onsubmit
  const onSubmit = data => {
    let isValid = true;
    const natureOfBusinessAPIModel = [];
    if (bondedWareHouse) {
      natureOfBusinessAPIModel.push(new NatureOfBusinessModel(
        'Bonded Warehouse',
        'bwh'
      ))
    }
    if (eou) {
      natureOfBusinessAPIModel.push(new NatureOfBusinessModel(
        'EOU/STP/EHTP',
        'ese'
      ))
    }
    if (exportChk) {
      natureOfBusinessAPIModel.push(new NatureOfBusinessModel(
        'Export',
        'exp'
      ))
    }
    if (importChk) {
      natureOfBusinessAPIModel.push(new NatureOfBusinessModel(
        'Import',
        'imp'
      ))
    }
    if (supplierService) {
      natureOfBusinessAPIModel.push(new NatureOfBusinessModel(
        'Supplier of service',
        'sos'
      ))
    }
    if (leasingBusiness) {
      natureOfBusinessAPIModel.push(new NatureOfBusinessModel(
        'Leasing Business',
        'lbu'
      ))
    }
    if (officeSale) {
      natureOfBusinessAPIModel.push(new NatureOfBusinessModel(
        'Office/Sale Office',
        'oso'
      ))
    }
    if (retailBusiness) {
      natureOfBusinessAPIModel.push(new NatureOfBusinessModel(
        'Retails Business',
        'rbu'
      ))
    }
    if (warehouse) {
      natureOfBusinessAPIModel.push(new NatureOfBusinessModel(
        'Warehouse/Depot',
        'whd'
      ))
    }
    if (wholesale) {
      natureOfBusinessAPIModel.push(new NatureOfBusinessModel(
        'Wholesale Business',
        'wbu'
      ))
    }
    if (workContract) {
      natureOfBusinessAPIModel.push(new NatureOfBusinessModel(
        'Work Contract',
        'wco'
      ))
    }
    if (goodsReceipt) {
      natureOfBusinessAPIModel.push(new NatureOfBusinessModel(
        'Recipient of Goods/Services',
        'sre'
      ))
    }
    if (factoryManufacturing) {
      natureOfBusinessAPIModel.push(new NatureOfBusinessModel(
        'Factory/Manufacturing',
        'fmf'
      ))
    }
    if (inputService) {
      natureOfBusinessAPIModel.push(new NatureOfBusinessModel(
        'Input Service Distributor (ISD)',
        'isd'
      ))
    }
    if (serviceProvision) {
      natureOfBusinessAPIModel.push(new NatureOfBusinessModel(
        'Service Provision',
        'spr'
      ))
    }
    if (sez) {
      natureOfBusinessAPIModel.push(new NatureOfBusinessModel(
        'SEZ',
        'sez'
      ))
    }
    if (other) {
      natureOfBusinessAPIModel.push(new NatureOfBusinessModel(
        'Other',
        'oth'
      ))
    }

    console.log(natureOfBusinessAPIModel)

    if (
      bondedWareHouse == false &&
      eou == false &&
      exportChk == false &&
      importChk == false &&
      supplierService == false &&
      leasingBusiness == false &&
      officeSale == false &&
      retailBusiness == false &&
      warehouse == false &&
      wholesale == false &&
      workContract == false &&
      goodsReceipt == false &&
      factoryManufacturing == false &&
      inputService == false &&
      serviceProvision == false &&
      sez == false &&
      other == false) {
      isValid = false;
    }

    console.log(isValid);

    if (isValid == false) {
      toast.error("Please select atleast one checkbox.", {
        position: "top-right", duration : messageShowDuration, 
      });
      return false;
    }

    console.log(editClientId)
    console.log(clientNatureOfBusinessId)

    if (editClientId !== null && editClientId !== "" && clientNatureOfBusinessId !== null) {
      console.log('edit data');
      const natureAPIModel = {
        fkClientId: editClientId,
        addNatures: natureOfBusinessAPIModel
      }

      setBlock(true)
      setBtnDisable(true);
      companyService.editNatureofbusiness(natureAPIModel).then(res => {
        if (res.status === 200 && res.data.status === errorCodeConfig.APIDefaultCode.Success) {
         
          setBlock(false)
          toast.success(res.data.successMessage, {
            position: "top-right", duration: messageShowDuration
          });
          setBtnDisable(false);
        } else {

          setBlock(false)
           Swal.fire({
            icon: 'error',
            title: '',
            text: res.data.errorMessage,
          })
          setBtnDisable(false);
        }
      })

    } else {

      if (editClientId == null) {
        toast.error("Please add company.", {
          position: "top-right", duration: messageShowDuration
        });
        return false;
      }

      const natureAPIModel = {
        fkClientId: editClientId,
        addNatures: natureOfBusinessAPIModel
      }

      setBlock(true)
      companyService.addNatureofbusiness(natureAPIModel).then(res => {
        if (res.status === 200 && res.data.status === errorCodeConfig.APIDefaultCode.Success) {
          // setBtnDisable(true)
          setSearchApi(true)
          setBlock(false)
          toast.success(res.data.successMessage, {
            position: "top-right", duration : messageShowDuration
          });
        } else {
          setBlock(false)
           Swal.fire({
            icon: 'error',
            title: '',
            text: res.data.errorMessage,
          })
        }
      })
    }
  }

  //** Reset form
  const ResetForm = () => {
    setBtnDisable(false)
    setBondedWareHouse(false)
    setEou(false)
    setExportChk(false)
    setImportChk(false)
    setSupplierService(false)
    setLeasingBusiness(false)
    setOfficeSale(false)
    setRetailBusiness(false)
    setWarehouse(false)
    setWholesale(false)
    setWorkContract(false)
    setGoodReceipt(false)
    setFactoryManufacturing(false)
    setInputService(false)
    setServiceProvision(false)
    setSez(false)
    setOther(false)
  }

  return (
    <Fragment>
      {block && <div className="loading1">Loading&#8230;</div>}
      {/* <UILoader blocking={block} loader={<Loader />}> */}
      <Card>
        <CardBody className='py-2 my-25'>
          <div className='content-header'>
            <h5 className='mb-0'>Nature Of Business Carried Out</h5>
          </div>
          <Form className='mt-2 pt-50' onSubmit={handleSubmit(onSubmit)}>
            <div className='demo-inline-spacing'>
              <div className='form-check form-check-danger'>
                <Input type='checkbox' id='danger-checkbox1'
                  checked={bondedWareHouse}
                  onChange={(e) => SelectionhandleChange("bondedWarehouse")} />
                <Label className='form-check-label' >
                  Bonded Warehouse
                </Label>
              </div>
              <div className='form-check form-check-danger'>
                <Input type='checkbox' id='danger-checkbox2'
                  checked={eou}
                  onChange={(e) => SelectionhandleChange("EOU")} />
                <Label className='form-check-label' >
                  EOU/STP/EHTP
                </Label>
              </div>
              <div className='form-check form-check-danger'>
                <Input type='checkbox' id='danger-checkbox3'
                  checked={exportChk}
                  onChange={(e) => SelectionhandleChange("Export")} />
                <Label className='form-check-label'>
                  Export
                </Label>
              </div>
              <div className='form-check form-check-danger'>
                <Input type='checkbox' id='danger-checkbox4'
                  checked={importChk}
                  onChange={(e) => SelectionhandleChange("Import")} />
                <Label className='form-check-label' >
                  Import
                </Label>
              </div>
              <div className='form-check form-check-danger'>
                <Input type='checkbox' id='danger-checkbox5'
                  checked={supplierService}
                  onChange={(e) => SelectionhandleChange("SupplierService")} />
                <Label className='form-check-label'>
                  Supplier of service
                </Label>
              </div>
              <div className='form-check form-check-danger'>
                <Input type='checkbox' id='danger-checkbox6'
                  checked={leasingBusiness}
                  onChange={(e) => SelectionhandleChange("LeasingBusiness")} />
                <Label className='form-check-label' >
                  Leasing Business
                </Label>
              </div>
              <div className='form-check form-check-danger'>
                <Input type='checkbox' id='danger-checkbox7'
                  checked={officeSale}
                  onChange={(e) => SelectionhandleChange("OfficeSale")} />
                <Label className='form-check-label'>
                  Office/Sale Office
                </Label>
              </div>
              <div className='form-check form-check-danger'>
                <Input type='checkbox' id='danger-checkbox8'
                  checked={retailBusiness}
                  onChange={(e) => SelectionhandleChange("RetailBusiness")}
                />
                <Label className='form-check-label' >
                  Retails Business
                </Label>
              </div>
              <div className='form-check form-check-danger'>
                <Input type='checkbox' id='danger-checkbox9'
                  checked={warehouse}
                  onChange={(e) => SelectionhandleChange("Warehouse")} />
                <Label className='form-check-label'>
                  Warehouse/Depot
                </Label>
              </div>
              <div className='form-check form-check-danger'>
                <Input type='checkbox' id='danger-checkbox10'
                  checked={wholesale}
                  onChange={(e) => SelectionhandleChange("Wholesale")} />
                <Label className='form-check-label' >
                  Wholesale Business
                </Label>
              </div>
              <div className='form-check form-check-danger'>
                <Input type='checkbox' id='danger-checkbox11'
                  checked={workContract}
                  onChange={(e) => SelectionhandleChange("WorkContract")} />
                <Label className='form-check-label' >
                  Work Contract
                </Label>
              </div>
              <div className='form-check form-check-danger'>
                <Input type='checkbox' id='danger-checkbox12'
                  checked={goodsReceipt}
                  onChange={(e) => SelectionhandleChange("GoodsReceipt")} />
                <Label className='form-check-label' >
                  Recipient of Goods/Services
                </Label>
              </div>
              <div className='form-check form-check-danger'>
                <Input type='checkbox' id='danger-checkbox13'
                  checked={factoryManufacturing}
                  onChange={(e) => SelectionhandleChange("FactoryManufacturing")} />
                <Label className='form-check-label' >
                  Factory/Manufacturing
                </Label>
              </div>
              <div className='form-check form-check-danger'>
                <Input type='checkbox' id='danger-checkbox14'
                  checked={inputService}
                  onChange={(e) => SelectionhandleChange("InputService")} />
                <Label className='form-check-label' >
                  Input Service Distributor (ISD)
                </Label>
              </div>
              <div className='form-check form-check-danger'>
                <Input type='checkbox' id='danger-checkbox15'
                  checked={serviceProvision}
                  onChange={(e) => SelectionhandleChange("ServiceProvision")} />
                <Label className='form-check-label' >
                  Service Provision
                </Label>
              </div>
              <div className='form-check form-check-danger'>
                <Input type='checkbox' id='danger-checkbox16'
                  checked={sez}
                  onChange={(e) => SelectionhandleChange("Sez")} />
                <Label className='form-check-label'>
                  SEZ
                </Label>
              </div>
              <div className='form-check form-check-danger'>
                <Input type='checkbox' id='danger-checkbox17'
                  checked={other}
                  onChange={(e) => SelectionhandleChange("Other")} />
                <Label className='form-check-label' >
                  Other
                </Label>
              </div>
            </div>
            <br />
            <div className='btnFixFooter'>
              <Row className='justify-content-end mx-0'>
                <Col className='d-flex align-items-center justify-content-end' md='6' sm='12'>
                  <Button  id="savebtn" type='submit' className='me-1'  color='danger' outline disabled={btnDisable}>
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
      {/* </UILoader> */}
    </Fragment >
  )
}

export default NatureBusinessActivitiesTab
