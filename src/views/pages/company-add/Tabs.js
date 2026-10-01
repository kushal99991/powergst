// ** Reactstrap Imports
import { Nav, NavItem, NavLink } from 'reactstrap'
import React, { useState } from 'react';
import CompanyConstants from './Constants'
// ** Icons Imports
import { User, Lock, Bookmark, Link, Bell, Home, Edit, Layers } from 'react-feather'
import { useEffect } from 'react';

const Tabs = ({ activeTab, toggleTab }) => {

  const [disableTab, setDisableTab] = useState(true);

  ///** Tab Disable
  useEffect(() => {
    console.log('tab show next time')
    if (CompanyConstants.ADD_COMPANY == true) {
      setDisableTab(false)
    }
  })

  return (
    <Nav pills className='nav-pill-danger mb-2'>
      <NavItem>
        <NavLink active={activeTab === '1'} onClick={() => toggleTab('1')} >
          <User size={14} className='me-50' />
          <span className='fw-bold'>Basic Info</span>
        </NavLink>
      </NavItem>
             {/*  Don't Remove This code  */}

      {/* <NavItem style={disableTab?{cursor:"not-allowed"}:{}}>
        <NavLink style={disableTab?{cursor:"not-allowed"}:{}} active={activeTab === '2'} onClick={() => toggleTab('2')} disabled={disableTab} >
          <Edit style={disableTab?{cursor:"not-allowed"}:{}} size={14} className='me-50' />
          <span style={disableTab?{cursor:"not-allowed"}:{}} className='fw-bold'>Principal Place</span>
        </NavLink>
      </NavItem> */}
      {/* <NavItem style={disableTab?{cursor:"not-allowed"}:{}}>
        <NavLink active={activeTab === '3'} onClick={() => toggleTab('3')} disabled={disableTab} >
          <Bookmark size={14} className='me-50' />
          <span className='fw-bold'>Nature Of Business Activities</span>
        </NavLink>
      </NavItem>
      <NavItem style={disableTab?{cursor:"not-allowed"}:{}}>
        <NavLink active={activeTab === '4'} onClick={() => toggleTab('4')} disabled={disableTab} >
          <Bell size={14} className='me-50' />
          <span className='fw-bold'>Promoters/Partner Details</span>
        </NavLink>
      </NavItem>
      <NavItem style={disableTab?{cursor:"not-allowed"}:{}}>
        <NavLink active={activeTab === '5'} onClick={() => toggleTab('5')} disabled={disableTab} >
          <Layers size={14} className='me-50' />
          <span className='fw-bold'>Signatory Details</span>
        </NavLink>
      </NavItem>
      <NavItem style={disableTab?{cursor:"not-allowed"}:{}}>
        <NavLink active={activeTab === '6'} onClick={() => toggleTab('6')} disabled={disableTab} >
          <Home size={14} className='me-50' />
          <span className='fw-bold'>Bank Details</span>
        </NavLink>
      </NavItem>
      <NavItem style={disableTab?{cursor:"not-allowed"}:{}}>
        <NavLink active={activeTab === '7'} onClick={() => toggleTab('7')} disabled={disableTab} >
          <Link size={14} className='me-50' />
          <span className='fw-bold'>Commodities Details</span>
        </NavLink>
      </NavItem> */}
    </Nav>
  )
}

export default Tabs
