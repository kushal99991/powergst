// ** Reactstrap Imports
import {
    Button,
    Nav, NavItem, NavLink,
} from 'reactstrap'
import React from 'react';
// ** Icons Imports
import { useEffect } from 'react';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'react-feather';


const Tabs = ({ activeTab, toggleTab, btnType }) => {
    const ref = useRef(null)

    useEffect(() => {
        if (btnType == 1 || btnType == 2 || btnType == 3 || btnType == 4 || btnType == 11 || btnType == 12) {
            toggleTab('1')
        }
        else if (btnType == 7 || btnType == 8 || btnType == 9 || btnType == 10) {
            toggleTab('2')
        }
        else if (btnType == 5 || btnType == 6) {
            toggleTab('7')
        }
        else if (btnType == 18) {
            toggleTab('3')
        }
        else if (btnType == 17) {
            toggleTab('5')
        }
        else if (btnType == 13 || btnType == 14 || btnType == 15 || btnType == 16) { // Advance Payment
            toggleTab('6')
        }
        else if (btnType == 19) {
            toggleTab('4')
        }
        else {
            // alert("no such tab")
        }

    }, [])

    const navigate = useNavigate()
    const backPage = () => {
        navigate("/reports/gstr1-filed-data?gstr1=1");
    }

    return (
        <div className='content-header row'>
            <div className='content-header-left col-md-9 col-12'>
                <div className='row breadcrumbs-top'>
                    <div className='col-12'>

                        <Nav pills className='nav-pill-danger mb-2'>
                            <NavItem>
                                <NavLink active={activeTab === '1'} onClick={() => toggleTab('1')} >
                                    <span className='fw-bold'>Invoices</span>
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink active={activeTab === '2'} onClick={() => toggleTab('2')}  >
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

                </Button>
            </div>
        </div>

    )
}

export default Tabs
