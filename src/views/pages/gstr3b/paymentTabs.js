// ** Reactstrap Imports
import {
    Button, Col, Nav, NavItem, NavLink,
    DropdownMenu,
    DropdownItem,
    BreadcrumbItem,
    DropdownToggle,
    UncontrolledButtonDropdown
} from 'reactstrap'
import React, { useState } from 'react';
// ** Icons Imports
import { User, Lock, Bookmark, Link, Bell, Home, Edit, Layers, Grid, CheckSquare, MessageSquare, Mail, Calendar } from 'react-feather'
import { useEffect } from 'react';
import { useRef } from 'react';


const Tabs = ({ activeTab, toggleTab, btnType }) => {
    const ref = useRef(null)
    return (
        <div className='content-header row'>
            <div className='content-header-left col-md-9 col-12'>
                <div className='row breadcrumbs-top'>
                    <div className='col-12'>

                        <Nav pills className='nav-pill-danger mb-2'>
                            <NavItem>
                                <NavLink active={activeTab === '1'} onClick={() => toggleTab('1')} >
                                    <span className='fw-bold'>GSTN's Calculation</span>
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink active={activeTab === '2'} onClick={() => toggleTab('2')}  >
                                    <span className='fw-bold'>GSTN's Calculation</span>
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
