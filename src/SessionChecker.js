import React, { useEffect, useState } from 'react';
import { X } from 'react-feather';
import { Button, Col, Label, Modal, ModalBody, Row } from 'reactstrap';
import { isUserLoggedIn } from '@utils';
import LocalFunction from './configs/getLocalFunction'
import { tokenExpiresRedirect } from './utility/Utils';
import decryptData from '../src/auth/crypto/crypto'


// ** Store & Actions
import { useDispatch, useSelector } from 'react-redux'
import { handleLogout } from '@store/authentication'
import loginService from './services/loginService';
import errorCodeConfig from './configs/apiErrorCodeConfig';
import useJwt from './auth/jwt/useJwt';

const config = useJwt.jwtConfig;

const SessionTimeoutChecker = () => {
    const [showPopup, setShowPopup] = useState(false);
    const [block, setBlock] = useState(false);
    console.log(Date.now(), "we are in session tracker page", sessionStorage.getItem('loginTime'), parseInt(sessionStorage.getItem('loginTime'), 10));

    const loginTime = sessionStorage.getItem('loginTime');
    useEffect(() => {
        console.log("we time is being checked here");

        if (!loginTime) return;

        // const eightHours = 8 * 60 * 60 * 1000;
        // const eightHours = hours * minutes * 60 * 1000;

        //original setup
        const eightHoursPopup = 7 * 60 * 60 * 1000 + 45 * 60 * 1000;;
        const eightHoursMain = 8 * 60 * 60 * 1000;
        const checkSessionTime = 5 * 60 * 1000

        //test setup
        // const eightHoursPopup = 4 * 60 * 1000;;
        // const eightHoursMain = 5 * 60 * 1000;
        // const checkSessionTime = 60 * 1000

        const checkSession = () => {
            const now = Date.now();
            const sessionStart = parseInt(loginTime, 10);
            const timeElapsed = now - sessionStart
            const timeRemaining = eightHoursMain - timeElapsed
            const hours = Math.floor(timeRemaining / (1000 * 60 * 60))
            const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
            console.log("we time is being checked here after every 4s", hours, "hours &", minutes, "minutes left");
            if (now - sessionStart >= eightHoursPopup) {
                // alert("time is done")
                setShowPopup(true);
            }
            if (now - sessionStart >= eightHoursMain) {

                handleLogout()
            }
        };

        const intervalId = setInterval(checkSession, checkSessionTime);

        return () => clearInterval(intervalId);
    }, [new Date().getTime()]);

    //   useEffect(() => {
    //     const checkSession = () => {
    //       const loginTime = sessionStorage.getItem('loginTime');
    //   console.log("we are in session tracker page", loginTime);

    //       if (!loginTime) return;

    //       const currentTime = new Date().getTime();
    //     //   const sessionDuration = 8 * 60 * 60 * 1000; // 8 hours in milliseconds
    //       const sessionDuration = 8000; // 8 hours in milliseconds

    //       if (currentTime - parseInt(loginTime, 10) > sessionDuration) {
    //         alert("time is done")
    //         setShowPopup(true);
    //       }
    //     };

    //     checkSession();
    //   }, [new Date().getTime()]);

    // You can use showPopup state to conditionally render your popup component

    const handleLoginAgain = () => {
        setBlock(true);
        loginService
            .loginUser(JSON.parse(sessionStorage.getItem('L_C')))
            .then((res) => {
                setBlock(false);
                if (
                    res.status === 200 &&
                    res.data.status === errorCodeConfig.APIDefaultCode.Success
                ) {
                    setShowPopup(false)
                    const loginTime = new Date().getTime();
                    sessionStorage.setItem('loginTime', loginTime);
                    const tokenKey = decryptData.encryptData(res?.data?.data?.token)
                    localStorage.setItem(config.storageTokenKeyName, tokenKey)
                    localStorage.setItem(config.storageRefreshTokenKeyName, res?.data?.data?.refreshToken)

                }
            })
    }

    const handleLogout = () => {
        tokenExpiresRedirect();
    }


    return (
        <>
            {block && <div className="loading1">Loading&#8230;</div>}
            <Modal
                // backdrop="static"
                isOpen={showPopup}
                toggle={() => setShowPopup(!showPopup)}
                className="modal-dialog-centered modal-sm"
            >
                <div className="modal-header">
                    <h2 className="modal-title w-100 text-center">
                        Session Timeout
                    </h2>
                    <div className="modal-actions">
                        <a onClick={() => setShowPopup(!showPopup)} className="text-body">
                            <X size={14} />
                        </a>
                    </div>
                </div>
                {/* <hr></hr> */}
                <ModalBody className="px-sm-2 mx-30">
                    <Row tag='form' className='gy-1' >
                        <Col xs={3}>
                        </Col>
                        <Col xs={12}>
                            <p>
                                <span className='boldText'> Your session will get expire in next 15 minutes!</span>
                                <br />  Do you want to extend ongoing session for next 8 hours?
                            </p>
                        </Col>

                        <Col xs={12} className='text-center'>
                            <Button className='me-1' type='reset' color='secondary' outline onClick={() => setShowPopup(false)}>
                                Cancel
                            </Button>
                            <Button color='danger' onClick={handleLoginAgain} outline>
                                Yes! Extend Session
                            </Button>

                        </Col>
                    </Row>
                </ModalBody>
            </Modal>

        </>
    );
};

export default SessionTimeoutChecker;