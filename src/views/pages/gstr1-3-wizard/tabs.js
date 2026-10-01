// ** Reactstrap Imports
import {
    Button, Col, Nav, NavItem, NavLink,
} from 'reactstrap'
import React, { useState } from 'react';
import { useEffect } from 'react';


const Tabs = ({ activeTab, toggleTab, btnType }) => {
   
    useEffect(() => {
        if (btnType == 1 || btnType == 2 || btnType == 3 || btnType == 4 || btnType == 11 || btnType == 12) {
            toggleTab('1')
        }
        else if(btnType == 7 || btnType == 8 || btnType == 9 || btnType == 10) {
            toggleTab('2')
        }
        else if (btnType == 5 || btnType == 6) {
            toggleTab('7')
        }
        else if(btnType == 18){
            toggleTab('3')
        }
        else if (btnType == 17){
            toggleTab('5')
        } 
        else if (btnType == 13 ||btnType == 14||btnType == 15||btnType == 16) { // Advance Payment
            toggleTab('6')
        }
        else if(btnType == 19){
            toggleTab('4')
        }
        else{
        }
   
    }, [])

    return (
        <div className='content-header row'>
            <div className='content-header-left col-md-9 col-12'>
                <div className='row breadcrumbs-top'>
                    <div className='col-12'>

                        <Nav pills className='nav-pill-danger mb-2'>
                            <NavItem>
                                <NavLink active={activeTab === '1'} onClick={() => toggleTab('1')} >
                                    {/* <span className='fw-bold'>Purchase Invoice</span> */}
                                    <span className='fw-bold'>Invoices</span>
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink active={activeTab === '2'} onClick={() => toggleTab('2')}  >
                                    {/* <span className='fw-bold'>Vendor Credit/Debit Notes</span> */}
                                    <span className='fw-bold'>Credit/Debit Notes</span>
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink active={activeTab === '7'} onClick={() => toggleTab('7')}  >
                                    <span className='fw-bold'>B2CS/B2CSA</span>
                                </NavLink>
                            </NavItem>
                            
                            <NavItem>
                                <NavLink active={activeTab === '6'} onClick={() => toggleTab('6')}  >
                                    <span className='fw-bold'>Advance Payment</span>
                                </NavLink>
                            </NavItem>

                            <NavItem>
                                <NavLink active={activeTab === '5'} onClick={() => toggleTab('5')}  >
                                    <span className='fw-bold'>Nil Rated /Exempt</span>
                                </NavLink>
                            </NavItem>

                            <NavItem>
                                <NavLink active={activeTab === '4'} onClick={() => toggleTab('4')}  >
                                    {/* <span className='fw-bold'>Input Tax Credit Reversal / Reclaim</span> */}
                                    <span className='fw-bold'>Docs</span>
                                </NavLink>
                            </NavItem>

                            <NavItem>
                                <NavLink active={activeTab === '3'} onClick={() => toggleTab('3')}  >
                                    <span className='fw-bold'>HSN Summary</span>
                                </NavLink>
                            </NavItem>
                        </Nav>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Tabs
