import {  globleVariable  } from '../../../configs/globalVariable'
import SessionFunction from '../../../configs/getSessionFunction'
import CompanyFinanceSelect from '../../dashboard/company/companyFinanceSelect';
import  { useEffect, useState } from 'react'
import { useHotkeys } from "react-hotkeys-hook";
import { keysMap, enableOnFormTags } from "../../../configs/config";

function CompanyTitle() {

  const [composeOpen, setComposeOpen] = useState(false);
  const [lblTradeName , setTradeName] = useState(null)
  const [lblFinYear, setFinYear] = useState(null)
  const [lblFinMonth, setFinMonth] = useState(null)
  const [lblgstIn, setGSTIN] = useState(null)

  const toggleCompose = () => setComposeOpen(!composeOpen);

  const IsCompanyLogin = sessionStorage.getItem(globleVariable.isCompany)
  const tradeName =   IsCompanyLogin == 'true'  && SessionFunction.getSessionValue(globleVariable.G_TradeName , true) ;
  const finYear = IsCompanyLogin == 'true'  && SessionFunction.getSessionValue(globleVariable.FinYear , true)
  const finMonth =  IsCompanyLogin == 'true'  && SessionFunction.getSessionValue(globleVariable.FinMonth , true)
  const gstIn =   IsCompanyLogin == 'true'  && SessionFunction.getSessionValue(globleVariable.G_GSTIN , true)

  useHotkeys(keysMap.OPEN_COMPANY_MODAL  , () =>  {  IsCompanyLogin == 'true' &&  onClickCompanyModal()  } );

const onClickCompanyModal = () => {
  setComposeOpen(true);
}

useEffect(() => {

  if (IsCompanyLogin == 'true' || composeOpen == false ) {
    setTradeName(tradeName)
    setFinYear(finYear)
    setFinMonth(finMonth)
    setGSTIN(gstIn)
  }

},[IsCompanyLogin, composeOpen , tradeName ])


  return (  localStorage.getItem(globleVariable.userData) &&  IsCompanyLogin == 'true' ? <><div className='py-1 bg-light' id='CompanyTitleDivision'>

    <div className='container'>
      <div className='content-header row'>
        <div className='content-header-left col-md-12 col-12'>
          <div className='row'>
            <div className='col-12'>
              <div className='d-sm-block d-none col-12 text-end'>
                <i className='fa fa-building-o me-1'></i>
                <span className='fw-bolder me-25'>{tradeName}  |  {gstIn} |  {finMonth} | <a className='text-danger' onClick={onClickCompanyModal}> {finYear} [{keysMap.OPEN_COMPANY_MODAL}]</a>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div><CompanyFinanceSelect
    composeOpen={composeOpen}
    toggleCompose={toggleCompose}
  ></CompanyFinanceSelect></>

  : "");



}

export default CompanyTitle;