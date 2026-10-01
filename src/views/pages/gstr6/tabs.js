// ** Reactstrap Imports
import {
    Button, Col, Nav, NavItem, NavLink,
    DropdownMenu,
    DropdownItem,
    BreadcrumbItem,
    DropdownToggle,
    UncontrolledButtonDropdown,

} from 'reactstrap'
import React, { useState } from 'react';
// ** Icons Imports
import { User, Lock, Bookmark, Link, Bell, Home, Edit, Layers, Grid, CheckSquare, MessageSquare, Mail, Calendar,ChevronLeft } from 'react-feather'
import { useEffect } from 'react';
import { useRef } from 'react';
import {useNavigate} from "react-router-dom"

const Tabs = ({ activeTab, toggleTab, btnType }) => {
    const ref = useRef(null)

    useEffect(() => {
        if (btnType == 1) {
            toggleTab('1')
        }
        else if(btnType == 2) {
            toggleTab('2')
        }
        else if (btnType == 3) {
            toggleTab('3')
        }
        else if(btnType == 4){
            toggleTab('4')
        }
        else if (btnType == 5){
            toggleTab('5')
        } 
        else if (btnType == 6){
            toggleTab('6')
        }else if (btnType == 7){
            toggleTab('7')
        }else if (btnType == 8){
            toggleTab('8')
        } 
        else{
        }
   
    }, [])


  const navigate = useNavigate()
  const backPage = () => {
    navigate("/gst-returns/gstr6");
  }
  
    return (
        <div className='content-header row'>
            <div className='content-header-left col-md-10 col-12'>
                <div className='row breadcrumbs-top'>
                    <div className='col-12'>

                        <Nav pills className='nav-pill-danger mb-2'>
                            <NavItem>
                                <NavLink active={activeTab === '1'} onClick={() => toggleTab('1')} >
                                    {/* <span className='fw-bold'>Purchase Invoice</span> */}
                                    <span className='fw-bold'>B2B</span>
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink active={activeTab === '2'} onClick={() => toggleTab('2')}  >
                                    {/* <span className='fw-bold'>Vendor Credit/Debit Notes</span> */}
                                    <span className='fw-bold'>ITC received(B2BA)</span>
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink active={activeTab === '3'} onClick={() => toggleTab('3')}  >
                                    <span className='fw-bold'>CDN</span>
                                </NavLink>
                            </NavItem>
                            
                            <NavItem>
                                <NavLink active={activeTab === '4'} onClick={() => toggleTab('4')}  >
                                    <span className='fw-bold'>CDNA</span>
                                </NavLink>
                            </NavItem>

                            <NavItem>
                                <NavLink active={activeTab === '5'} onClick={() => toggleTab('5')}  >
                                    <span className='fw-bold'>Distribution of ITC</span>
                                </NavLink>
                            </NavItem>

                            <NavItem>
                                <NavLink active={activeTab === '6'} onClick={() => toggleTab('6')}  >
                                    {/* <span className='fw-bold'>Input Tax Credit Reversal / Reclaim</span> */}
                                    <span className='fw-bold'>Amend of Distribution of ITC</span>
                                </NavLink>
                            </NavItem>

                            <NavItem>
                                <NavLink active={activeTab === '7'} onClick={() => toggleTab('7')}  >
                                    {/* <span className='fw-bold'>Input Tax Credit Reversal / Reclaim</span> */}
                                    <span className='fw-bold'>Total ITC Available</span>
                                </NavLink>
                            </NavItem>

                            <NavItem>
                                <NavLink active={activeTab === '8'} onClick={() => toggleTab('8')}  >
                                    {/* <span className='fw-bold'>Input Tax Credit Reversal / Reclaim</span> */}
                                    <span className='fw-bold'>Late Fee</span>
                                </NavLink>
                            </NavItem>
                        {/* 
                            <NavItem>
                                <NavLink active={activeTab === '3'} onClick={() => toggleTab('3')}  >
                                    <span className='fw-bold'>HSN Summary</span>
                                </NavLink>
                            </NavItem> */}
                        </Nav>
                    </div>
                </div>
            </div>
            <div className="col-md-2  px-0">
        <Button
          type="button"
          className="me-1 btn-sm float-end"
          outline
          id="back"
          onClick={() => backPage()}
          color="danger"
        >
          <ChevronLeft size={18} /> Back 

        </Button>
             </div>
        </div>

    )
}

export default Tabs
