// ** Reactstrap Imports
import {
    Button,
   Nav, NavItem, NavLink,
} from 'reactstrap'
import React, { useState } from 'react';
// ** Icons Imports
import { useEffect } from 'react';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'react-feather';

const Tabs = ({ activeTab, toggleTab, btnType }) => {
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
        else{
        }
   
    }, [])
    const navigate = useNavigate()
    const backPage = () => {
        navigate("/gst-returns/IIF");
    }


    return (
        <div className='content-header row'>
            <div className='content-header-left col-md-9 col-12'>
                <div className='row breadcrumbs-top'>
                    <div className='col-12'>

                        <Nav pills className='nav-pill-danger mb-2'>
                            <NavItem>
                                <NavLink active={activeTab === '1'} onClick={() => toggleTab('1')} >
                                    <span className='fw-bold'>B2B</span>
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink active={activeTab === '2'} onClick={() => toggleTab('2')}  >
                                    <span className='fw-bold'>B2BA</span>
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink active={activeTab === '3'} onClick={() => toggleTab('3')}  >
                                    <span className='fw-bold'>CDNR</span>
                                </NavLink>
                            </NavItem>
                            
                            <NavItem>
                                <NavLink active={activeTab === '4'} onClick={() => toggleTab('4')}  >
                                    <span className='fw-bold'>CDNRA</span>
                                </NavLink>
                            </NavItem>
                        </Nav>
                    </div>
                </div>

            </div>

            <div className="col-md-3  px-0">
                <Button
                    type="button"
                    className="me-1 btn-sm float-end"
                    outline
                    id="back"
                    onClick={() => backPage()}
                    color="danger"
                >
                    <ChevronLeft size={18} /> Back To Summary
                    {/* <i className="fa fa-file-excel-o"></i> Back  */}
                </Button>
            </div>
        </div>

    )
}

export default Tabs
