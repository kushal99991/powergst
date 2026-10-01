// ** Reactstrap Imports
import {
  Button, Col, Nav, NavItem, NavLink, Label
} from 'reactstrap'
import React, { useState } from 'react';
// ** Icons Imports
import { Search } from 'react-feather'
import { useEffect } from 'react';
import Gstr2bService from '../../../services/gstr/gstr2bService'
import { saveAs } from 'file-saver';
import DropDownGSTRList from '../../components/dropdown-GSTR/index'
import GSTR2BConstants from './Constants';
import DropDownGSTRSplitImport from '../../components/dropdown-GSTR-Import/dropdownGSTRImport';
import { useRef } from 'react';
import DropDownGSTRDwownload from '../../components/dropdown-GSTR-Download/dropdownGSTRDownload';
import toast from 'react-hot-toast'
// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/libs/react-select/_react-select.scss'

// ** Store & Actions
import { getGSTR2BSummary } from '../../../views/apps/user/store'
import { useDispatch, useSelector } from 'react-redux'

import Select, { components } from 'react-select' // eslint-disable-line
import { selectThemeColors } from '@utils'
import makeAnimated from 'react-select/animated'
import { useNavigate } from 'react-router-dom';
const animatedComponents = makeAnimated()

import { globleVariable } from "../../../configs/globalVariable";
import LocalFunction from '../../../configs/getLocalFunction'
import SessionFunction from '../../../configs/getSessionFunction'

import { useHotkeys } from 'react-hotkeys-hook';
import { keysMap, enableOnFormTags, LINK_MESSAGE } from "../../../configs/config";
import { handleExportData } from '@store/layout'



const exportButtonList = [
  { id: '1', name: 'Export Summary' },
  { id: '2', name: 'Export Data' }
]

const ImportButtonList = [
  { id: '1', name: 'Govt. Excel' },

]

// ** Session
const finYearOption = LocalFunction.getLocalValue(globleVariable.rangeFiltersGSTR2B, true);



// localStorage.getItem("rangeFiltersGSTR2B");
const YearList = finYearOption !== undefined && finYearOption !== null && finYearOption !== "" && finYearOption !== 'undefined' ? JSON.parse(finYearOption) : []

const Tabs = ({ activeTab, toggleTab, loadFunction, dateSelection, dateSelectionFunc, downloadDate, setDownloadDate }) => {

  const ref = useRef(null)
  const [panDataFrom, setPanDataFrom] = useState([]);
  const store = useSelector(state => state?.users?.GSTR2BSummary);
  const storeExport = useSelector(state => state?.layout?.exportData);

  const [finFromYear, setFinFormYear] = useState(null);
  const [panData, setPanData] = useState([]);
  const [monthFrom, setMonthFrom] = useState(null);
  const [displayType, setDisplayType] = useState(false)
  const [search, setSearch] = useState(false)
  const [errorMsg, setErrorMsg] = useState('');
  const [block, setBlock] = useState(false)
  //  const [monthTo, setMonthTo] = useState(null);
  const [enabled, setEnabled] = useState(false)
  // const value = sessionStorage.getItem("check");
  const dispatch = useDispatch()
  const navigate = useNavigate();

  // ** Session

  const isCmpySelection = sessionStorage.getItem(globleVariable.isCompany) !== null && sessionStorage.getItem(globleVariable.isCompany) !== "" &&
    sessionStorage.getItem(globleVariable.isCompany) !== undefined && sessionStorage.getItem(globleVariable.isCompany) !== false &&
    sessionStorage.getItem(globleVariable.isCompany) !== 'false' ? true : false;

  const clientIds = sessionStorage.getItem(globleVariable.G_UCParId) && SessionFunction.getSessionValue(globleVariable.G_UCParId, true);
  const defaultYear = sessionStorage.getItem(globleVariable.defaultYear) && SessionFunction.getSessionValue(globleVariable.defaultYear, true);

  const GGSTIN = sessionStorage.getItem(globleVariable.G_GSTIN) && SessionFunction.getSessionValue(globleVariable.G_GSTIN, true);
  const subId = localStorage.getItem(globleVariable.subscriptionId) && LocalFunction.getLocalValue(globleVariable.subscriptionId, true);

  console.log(dateSelection, "show select export")


  // ** set From and To month
  useEffect(() => {
    setPanData(YearList)
    setPanDataFrom(YearList)
    if (isCmpySelection == true) {
      setDisplayType(true);
    }
  }, [])


  //** Shortcut keys
  useHotkeys(keysMap.SEARCH_DATA, () => searchData(), { enableOnFormTags });

  useEffect(() => {
    return () => setBlock(false)
  }, [])


  //** store data
  useEffect(() => {
    if (isCmpySelection == true) {
      if (store !== undefined) {
        setBlock(false);
      }
    }

  }, [store])

  useEffect(() => {

    if (storeExport == true) {
      console.log('export data', storeExport)
      // debugger
      onDateSelect();
      dispatch(handleExportData(false))
    }

  }, [storeExport])


  useEffect(() => {
    if (downloadDate == true) {

      onDateSelect();
      setDownloadDate(false)
    }
  }, [downloadDate])



  //** Select from onChange
  const selectFromYear = (value) => {
    setFinFormYear(value);
    // sessionStorage.setItem("check",false)
    setErrorMsg('');
    const setDt = Number(monthFrom?.srNo) < Number(value?.srNo) ? monthFrom : panDataFrom[0]
    setMonthFrom(setDt)
    const x = panDataFrom?.filter((item) => Number(item.srNo) <= Number(value.srNo))
    setPanData(x);
    // sessionStorage.removeItem("check");
    //  sessionStorage.setItem(globleVariable.selectExportFromDt, value?.value)
    //  sessionStorage.setItem(globleVariable.selectExportToDt, setDt?.value)
    //  sessionStorage.setItem(globleVariable.GSTR_2BFrdt,value?.value)
    //  sessionStorage.setItem(globleVariable.GSTR_2BTodt,setDt?.value)

    //** call redux

    // console.log('client id ', clientIds)
    // const userData = {
    //   clientid: clientIds,
    //   // sessionStorage.getItem("G_UCParId"),
    //   finyear: value?.value,
    //   finmonth: setDt?.value,
    //   subscriptionId: subId,
    //   gstNumber: GGSTIN
    // }

    // setBlock(true)
    // dispatch(getGSTR2BSummary(userData))

  }


  //** Select To onChange
  const selectFromMonth = (value) => {
    // localStorage.setItem("check1",false)
    setErrorMsg('');
    // setMonthTo(value);
    setMonthFrom(value);

    if (Number(finFromYear?.srNo) > Number(value?.srNo)) {
      const fromFilter = panDataFrom?.filter((item) => Number(item.srNo) == Number(value.srNo))[0]
      setFinFormYear(fromFilter)
      // sessionStorage.setItem(globleVariable.selectExportFromDt, fromFilter?.value)
      //  sessionStorage.setItem(globleVariable.selectExportToDt, fromFilter?.value)
      //  sessionStorage.setItem(globleVariable.GSTR_2BFrdt,fromFilter?.value)
      //  sessionStorage.setItem(globleVariable.GSTR_2BTodt,fromFilter?.value)
    } else {
      //  sessionStorage.setItem(globleVariable.selectExportToDt, value?.value)
      //  sessionStorage.setItem(globleVariable.GSTR_2BTodt, value?.value)
    }

    // const userData = {
    //   clientid: clientIds,
    //   finyear: sessionStorage.getItem(globleVariable.selectExportFromDt),
    //   finmonth: sessionStorage.getItem(globleVariable.selectExportToDt),
    //   subscriptionId: subId,
    //   gstNumber: GGSTIN
    // }

    // setBlock(true)
    // dispatch(getGSTR2BSummary(userData))
  };


  //** set from and to date then call api 
  useEffect(() => {
    console.log('call api', search)
    if (search == true) {

      const userData = {
        clientid: clientIds,
        finyear: finFromYear?.value,
        finmonth: monthFrom?.value,
        subscriptionId: subId,
        gstNumber: GGSTIN
      }

      if (store?.length == 0 && store !== undefined && store !== null && monthFrom?.value != undefined) {
        setBlock(true)
        dispatch(getGSTR2BSummary(userData))
        localStorage.setItem("setRefreshAPIReportDataDeletGSTR2B", false)
      }

    }
  }, [search])

  const checkAPIFire = sessionStorage.getItem("setRefreshAPIReportDataDeletGSTR2B");
  useEffect(() => {
    if (checkAPIFire == "true" || checkAPIFire == true) {
      const userData = {
        clientid: clientIds,
        finyear: finFromYear?.value,
        finmonth: monthFrom?.value,
        subscriptionId: subId,
        gstNumber: GGSTIN
      }
      if (monthFrom?.value != undefined && finFromYear?.value != undefined) {
        setBlock(true)
        dispatch(getGSTR2BSummary(userData))
        sessionStorage.setItem("setRefreshAPIReportDataDeletGSTR2B", false)
      }
    }
  }, [checkAPIFire, monthFrom?.value])



  //** Set from and to date 
  useEffect(() => {

    if (isCmpySelection == false) {

      toast.error(LINK_MESSAGE, {
        position: "top-right",
      });

      setTimeout(() => {
        navigate("/dashboard/company")
      }, 1000);
    } else {
      if (displayType == true) {
        // debugger
        onDateSelect();
        setSearch(true)
      }
    }

  }, [displayType])

  const onDateSelect = () => {
    let defaultValueFrom = null;
    let defaultValueTo = null;
    // alert("hello date change")

    if (sessionStorage.getItem(globleVariable.GSTR_2BFrdt) !== null && sessionStorage.getItem(globleVariable.GSTR_2BFrdt) !== "" && sessionStorage.getItem(globleVariable.GSTR_2BFrdt) !== undefined) {

      defaultValueFrom = panData?.filter((item) => item.value == sessionStorage.getItem(globleVariable.GSTR_2BFrdt))[0];


    } else {
      defaultValueFrom = panData?.filter((item) => Number(item.value) == Number(defaultYear))[0];
    }

    if (sessionStorage.getItem(globleVariable.GSTR_2BTodt) !== null && sessionStorage.getItem(globleVariable.GSTR_2BTodt) !== "" && sessionStorage.getItem(globleVariable.GSTR_2BTodt) !== undefined) {
      defaultValueTo = panData?.filter((item) => item.value == sessionStorage.getItem(globleVariable.GSTR_2BTodt))[0];
    } else {
      defaultValueTo = panData?.filter((item) => Number(item.value) == Number(defaultYear))[0];
    }

    if (defaultValueFrom !== undefined && defaultValueFrom !== null && defaultValueFrom !== "") {

      setFinFormYear(defaultValueFrom)
      sessionStorage.setItem(globleVariable.selectExportFromDt, defaultValueFrom?.value)
    } else {
      if (!finFromYear?.value) {

        setFinFormYear(panData[0])
        sessionStorage.setItem(globleVariable.selectExportFromDt, panData[0]?.value)
      }
      // alert("hello date change else")

    }
    if (defaultValueTo !== undefined && defaultValueTo !== null && defaultValueTo !== "") {
      setMonthFrom(defaultValueTo)
      sessionStorage.setItem(globleVariable.selectExportToDt, defaultValueTo?.value)
    } else {
      if (!monthFrom?.value) {
        setMonthFrom(panData[0])
        sessionStorage.setItem(globleVariable.selectExportToDt, panData[0]?.value)
      }

    }

  }


  // }, [displayType,checkValue1 != undefined  , checkValue != undefined,])
  // }, [displayType,(sessionStorage.getItem("check"))])


  // ** Search
  const searchData = () => {
    const userData = {
      clientid: clientIds,
      finyear: finFromYear?.value,
      finmonth: monthFrom?.value,
      subscriptionId: subId,
      gstNumber: GGSTIN
    }
    sessionStorage.setItem(globleVariable.selectExportFromDt, userData?.finyear)
    sessionStorage.setItem(globleVariable.selectExportToDt, userData?.finmonth);
    sessionStorage.setItem(globleVariable.selectExportFromDt, finFromYear?.value)
    sessionStorage.setItem(globleVariable.selectExportToDt, monthFrom?.value)

    setBlock(true)
    dispatch(getGSTR2BSummary(userData))
    setDisplayType(false);
  }

  const onClickSearch = () => {
    // if (finFromYear?.value || monthFrom?.value) {

    const userData = {
      clientid: clientIds,
      finyear: finFromYear?.value,
      finmonth: monthFrom?.value,
      subscriptionId: subId,
      gstNumber: GGSTIN
    }
    sessionStorage.setItem(globleVariable.GSTR_2BFrdt, userData?.finyear)
    sessionStorage.setItem(globleVariable.GSTR_2BTodt, userData?.finmonth)
    sessionStorage.setItem(globleVariable.selectExportFromDt, finFromYear?.value)
    sessionStorage.setItem(globleVariable.selectExportToDt, monthFrom?.value)

    console.log(userData, "userData")
    setBlock(true)
    dispatch(getGSTR2BSummary(userData))
    // }
  }


  return (
    <div className='content-header row'>
      {block && <div className="loading1">Loading&#8230;</div>}
      <div className='content-header-left col-md-12 col-12'>
        <div className='row breadcrumbs-top'>
          <div className='col-md-6'>
            <Nav pills className='nav-pill-danger '>
              <NavItem>
                <NavLink active={activeTab === '1'} onClick={() => toggleTab('1')} >
                  <span className='fw-bold'>ITC Available</span>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink active={activeTab === '2'} onClick={() => toggleTab('2')}  >
                  <span className='fw-bold'>ITC Not Available</span>
                </NavLink>
              </NavItem>
            </Nav>
          </div>
          {/* <div className='col-md-2'></div> */}
          {/* <div style={{display:"flex",justifyContent:"end"}}> */}
          <div className="col-md-6">
            <div className="row ">
              {/* <div className="col-md-1"></div> */}
              <div className="col-md-2 ps-0"></div>
              <div className="col-md-4 px-0">
                <div className="row">
                  <Label className='form-label col-md-3 pt-half' >
                    From
                  </Label>
                  <Select
                    id="from"
                    placeholder="From"
                    isClearable={false}
                    theme={selectThemeColors}
                    closeMenuOnSelect={true}
                    options={panDataFrom}
                    className="basic-multi-select col-md-9 ps-0"
                    classNamePrefix='select'
                    components={animatedComponents}
                    onChange={selectFromYear}
                    value={finFromYear}
                    maxMenuHeight="150px"
                  />
                </div>
              </div>
              <div className='col-md-4 pe-0'>
                <div className='row'>
                  <Label className='form-label col-md-2 pt-half' >
                    To
                  </Label>
                  <Select
                    id="to"
                    placeholder="To"
                    isClearable={false}
                    theme={selectThemeColors}
                    closeMenuOnSelect={true}
                    options={panData}
                    components={animatedComponents}
                    className="basic-multi-select col-md-10 ps-0"
                    classNamePrefix='select'
                    onChange={selectFromMonth}
                    value={monthFrom}
                    maxMenuHeight="150px" />

                </div>

              </div>
              <div className='col-md-2 text-end ps-0'>
                <Button onClick={onClickSearch}
                  className="btn-icon btn-round"
                  color="danger" outline>
                  <Search size={12} />&nbsp;Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Tabs
