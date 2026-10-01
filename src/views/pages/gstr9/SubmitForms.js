import { Controller, useForm } from "react-hook-form";
import VerificationModal from '../../../views/pages/verification-otp/index'
import PanVerifyModal from "../../components/panVerifyModal/index"
import GSTR9Service from "../../../services/gstr9/gstr9Service";
import { useEffect, useState } from "react";
import { Button, Row, Modal, ModalBody, Col, Label, Form } from "reactstrap";
import { ArrowLeft, File } from "react-feather";
import Gstr1DownloadService from "../../../services/gstr1/gstr1Services/gstr1DownloadService";
import { globleVariable } from "../../../configs/globalVariable";

const defaultValues = {
    otp: "",
};

const SubmitForms = (props) => {
    const [block, setBlock] = useState(false);
    const [show, setShow] = useState(false);
    const { clientIds, userIds, GSTIN, stepper, finYear, finMonth, wizardIndex, finYearId } = props;
    const [msgDisplay, setMsgDisplay] = useState(null);
    const [composeOpen, setComposeOpen] = useState(false)
    const toggleCompose1 = () => setComposeOpen(!composeOpen)
    const [panNo, setPanNo] = useState('')
    const [ackNum, setAckNum] = useState(null);
    const [composeOpenPan, setComposeOpenPan] = useState(false);
    const toggleComposePan = () => setComposeOpenPan(!composeOpenPan);
    const [selectedPan, setSelectedPan] = useState(null);

    const acKnowNoFileStatus = sessionStorage.getItem("gstR9AckNumber");
    const acKnowNoFileStatusDate = sessionStorage.getItem("gstR9AckNumberDate");

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({ defaultValues });


    useEffect(() => {
        return () => setBlock(false);
    }, []);

    // ** Toggles close POPUP
    const togglePopUp = (e) => {
        reset();
        setShow(false);
    };

    const FileGSTR9OnClick = (data) => {
        const payLoad = {
            userClientId: clientIds,
            userId: userIds,
            financialYearId: finYearId,
            loggedGSTIN: GSTIN,
            otp: data.otp,
            panNumber: selectedPan
        };

        setBlock(true);
        GSTR9Service.fileGstr9Govt(payLoad)
            .then((res) => {
                if (
                    res.status === 200 &&
                    res.data.status === errorCodeConfig.APIDefaultCode.Success
                ) {

                    const parsedData = JSON.parse(res.data.data);
                    setAckNum(parsedData?.ack_num);

                    if (parsedData?.ack_num !== null && parsedData?.ack_num != "") {
                        sessionStorage.setItem("btnDisable9", "5")
                    }

                    setShow(false);
                    setBlock(false);

                    toast.success(res?.data?.successMessage, {
                        position: "top-right",
                    });
                } else {
                    setShow(false);
                    setBlock(false);
                    Swal.fire({
                        icon: "warning",
                        title: "",
                        text: res?.data?.errorMessage,
                        customClass: {
                            confirmButton: "btn btn-danger",
                        },
                        buttonsStyling: false,
                    });
                }
            })
            .catch((error) => {
                setShow(false);
                setBlock(false);
                Swal.fire({
                    icon: "error",
                    title: "",
                    text: error?.message,
                    customClass: {
                        confirmButton: "btn btn-danger",
                    },
                    buttonsStyling: false,
                });
            });
    };

    const openFileGSTR9 = () => {
        setComposeOpenPan(true)
    };

    const initateEvcOtpOnClick = () => {
        const payLoad = {
            userClientId: clientIds,
            userId: userIds,
            financialYearId: finYearId,
            loggedGSTIN: GSTIN,
            panNumber: selectedPan
        };

        setBlock(true);
        GSTR9Service.generateEvcOtpGovt(payLoad)
            .then((res) => {
                if (res.data.status === errorCodeConfig.APIDefaultCode.GovtOTPExpire) {
                    setBlock(false);
                    setMsgDisplay(res?.data?.errorMessage)
                    setComposeOpen(true)
                        ;
                } else {
                    if (
                        res.status === 200 &&
                        res.data.status === errorCodeConfig.APIDefaultCode.Success
                    ) {
                        setShow(!show);
                        setBlock(false);
                        toast.success(res?.data?.successMessage, {
                            position: "top-right",
                        });
                    } else {
                        setBlock(false);
                        Swal.fire({
                            icon: "warning",
                            title: "",
                            text: res?.data?.errorMessage,
                            customClass: {
                                confirmButton: "btn btn-danger",
                            },
                            buttonsStyling: false,
                        });
                    }
                }
            })
            .catch((error) => {
                setBlock(false);
                Swal.fire({
                    icon: "error",
                    title: "",
                    text: error?.message,
                    customClass: {
                        confirmButton: "btn btn-danger",
                    },
                    buttonsStyling: false,
                });
            });
    };

    const onSubmit = (data) => {
        FileGSTR9OnClick(data);
    };

    useEffect(() => {
        if (selectedPan !== null && selectedPan !== "") {
            initateEvcOtpOnClick();
        }
    }, [selectedPan])

    const handleKeyDown = (e) => {
        if (e.key === "Escape") {
            e.stopPropagation();
        }
    };

    const returnFileStatus = () => {
        const payLoad = {
            clientId: clientIds,
            gstinNumber: GSTIN,
            financialYearIdID: parseInt(finYear),
            month: parseInt(finMonth),
        };

        setBlock(true);
        Gstr1DownloadService.checkFiledUserStatus(payLoad).then((res) => {
            if (
                res.status === 200
            ) {
                setBlock(false);

                if (res?.data?.data?.isGSTR9Filed) {
                    if (res?.data?.data?.gstR9AcknowledgementNumber) {
                        sessionStorage.setItem("gstR9AckNumber", res?.data?.data?.gstR9AcknowledgementNumber);
                        sessionStorage.setItem("gstR9AckNumberDate", res?.data?.data?.gstR9AcknowledgementDate);
                    } else {
                        sessionStorage.removeItem("gstR9AckNumber");
                        sessionStorage.removeItem("gstR9AckNumberDate");
                    }
                    sessionStorage.setItem("btnDisable9", '5');
                }
            }
        }).catch((error) => {
            setBlock(false);
            Swal.fire({
                icon: "error",
                title: "",
                text: error?.message,
                customClass: {
                    confirmButton: "btn btn-danger",
                },
                buttonsStyling: false,
            });
        });
    }

    useEffect(() => {
        if (wizardIndex == 3) {
            returnFileStatus()
        }
    }, [wizardIndex])

    let disableButton = sessionStorage.getItem("btnDisable9") == undefined ||
        sessionStorage.getItem("btnDisable9") == 'undefined' || parseInt(sessionStorage.getItem("btnDisable9")) == 5 ? true :
        parseInt(sessionStorage.getItem("btnDisable9")) == 3 ? false : true

    return (
        <>
            {block && <div className="loading1">Loading&#8230;</div>}
            <Row>
                <Col md={4}></Col>
                <Col md={4}>
                    {
                        parseInt(sessionStorage.getItem("btnDisable9")) == 5 ?
                            <div className="d-flex justify-content-center mb-1">
                                <CheckCircle size={35} color="#28c76f" />
                            </div> : ""
                    }
                </Col>
                <Col md={4}></Col>
            </Row>
            <Row>
                <Col md={4}></Col>
                <Col md={4}>
                    <div className="d-grid mb-1 mb-lg-1">
                        <Button
                            className={disableButton == true ? "btn-icon disabledBtn" : "btn-icon"}
                            outline
                            color="danger"
                            size="lg"
                            onClick={openFileGSTR9}
                            disabled={
                                disableButton
                            }
                        >
                            <File size={25} />
                            <span className="align-middle ms-50 gstr1FilingButton">

                                {!sessionStorage.getItem("btnDisable9") ||
                                    sessionStorage.getItem("btnDisable9") == undefined ||
                                    sessionStorage.getItem("btnDisable9") == 'undefined' ||
                                    parseInt(sessionStorage.getItem("btnDisable9")) == 0 ||
                                    parseInt(sessionStorage.getItem("btnDisable9")) == 1 ||
                                    parseInt(sessionStorage.getItem("btnDisable9")) == 2 ||
                                    parseInt(sessionStorage.getItem("btnDisable9")) == 3 ||
                                    parseInt(sessionStorage.getItem("btnDisable9")) == 4 ?
                                    "File GSTR9" : "GSTR9 Is Already Filed"}
                            </span>
                        </Button>
                    </div>
                </Col>
                <Col md={4}></Col>
            </Row>

            {ackNum ? (
                <Row>
                    <Col md={4}></Col>

                    <Col md={4}>
                        <div className="d-flex justify-content-center mb-0">
                            <Label className="form-label">
                                Acknowledgement Number : {ackNum}
                            </Label>
                        </div>
                    </Col>
                    <Col md={4}></Col>
                </Row>
            ) : (
                ""
            )}


            {acKnowNoFileStatus ? (
                <Row>
                    <Col md={4}></Col>
                    <Col md={4}>
                        <div className="d-flex justify-content-center mb-0">
                            <Label className="form-label">
                                Acknowledgement Number : {acKnowNoFileStatus}
                            </Label>
                        </div>
                    </Col>
                    <Col md={4}></Col>
                </Row>
            ) : (
                ""
            )}

            {acKnowNoFileStatusDate ? (
                <Row>
                    <Col md={4}></Col>
                    <Col md={4}>
                        <div className="d-flex justify-content-center mb-2">
                            <Label className="form-label">
                                Acknowledgement Date : {acKnowNoFileStatusDate}
                            </Label>
                        </div>
                    </Col>
                    <Col md={4}></Col>
                </Row>
            ) : (
                ""
            )}

            <div style={{ zIndex: "999", }} className='btnFixFooter'>
                <div className="container">
                    <div style={{ margintop: "100px" }} className="d-flex justify-content-between">
                        <Button
                            color="danger"
                            className="btn-prev"
                            onClick={() => stepper.previous()}
                        >
                            <ArrowLeft
                                size={14}
                                className="align-middle me-sm-25 me-0"
                            ></ArrowLeft>
                            <span className="align-middle d-sm-inline-block d-none">
                                Previous
                            </span>
                        </Button>
                    </div>
                </div>
            </div>


            <Form onSubmit={handleSubmit(onSubmit)}>
                <Modal
                    backdrop="static"
                    isOpen={show}
                    toggle={() => setShow(!show)}
                    onKeyDown={handleKeyDown}
                    className="modal-dialog-centered modal-sm"
                >
                    <div className="modal-header">
                        <h2 className="modal-title w-100 text-center">OTP</h2>
                    </div>
                    <ModalBody>
                        <Row tag="form" className="gy-1 pt-75">
                            <Col xs={12}>
                                <Label className="form-label">OTP</Label>
                                <Controller
                                    id="otp"
                                    name="otp"
                                    control={control}
                                    rules={{
                                        required: "Please enter valid OTP.",
                                    }}
                                    render={({ field }) => (
                                        <Input
                                            autoFocus
                                            type="text"
                                            placeholder="OTP"
                                            invalid={errors.otp && true}
                                            {...field}
                                            tabIndex="1"
                                            onChange={(e) =>
                                                field.onChange(
                                                    (e.target.value = e.target.value.toUpperCase())
                                                )
                                            }
                                            onKeyPress={(e) => {
                                                if (new RegExp(/[-a-zA-Z0-9]/).test(e.key)) {
                                                } else e.preventDefault();
                                            }}
                                        />
                                    )}
                                />
                                {errors.otp && (
                                    <FormFeedback>{errors.otp.message}</FormFeedback>
                                )}
                            </Col>
                            <Col xs={12} className="text-center mt-2 pt-50">
                                <Button outline color="danger" className="me-1">
                                    Submit{" "}
                                </Button>
                                <Button color="secondary" outline onClick={togglePopUp}>
                                    Close
                                </Button>
                            </Col>
                        </Row>
                    </ModalBody>
                </Modal>
            </Form>
            <VerificationModal composeOpen={composeOpen} toggleCompose={toggleCompose1} userClientIds={clientIds}
                messageDisplay={msgDisplay} otpGSTIN={GSTIN}

            ></VerificationModal>

            <PanVerifyModal
                composeOpen={composeOpenPan}
                toggleCompose={toggleComposePan}
                messageDisplay={msgDisplay}
                setSelectedPan={setSelectedPan}
            ></PanVerifyModal>

        </>
    );
};

export default SubmitForms;