import { useState, useEffect , useCallback } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  Input,
  Row,
  Col,
  Button,
  Label,
  FormFeedback,
  Form,
} from "reactstrap";

import { useForm, Controller } from "react-hook-form";

// ** Store & Actions
import { useDispatch, useSelector } from "react-redux";

import {
  handleModelOTP,
  handleModelOTPSend,
  handleModelOTPClientId,
} from "@store/layout";

// ** Third Party Components
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import AuthenticationService from "../../../services/authentication/authenticationService";
import errorCodeConfig from "../../../configs/apiErrorCodeConfig";
import toast from "react-hot-toast";
import { X } from "react-feather";

const MySwal = withReactContent(Swal);

const defaultValues = {
  otp: "",
};

const VerificationOTP = props => {

  const { composeOpen, toggleCompose , userClientIds , messageDisplay , setSelectedItem, types,setComposeOpen, otpGSTIN } = props
  // ** Hooks
  const [block, setBlock] = useState(false);

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors },
    clearErrors,
    setValue,
    reset
  } = useForm({ defaultValues });

  const store = useSelector((state) => state);
  const dispatch = useDispatch();

  const [isOpen, setIsModalOpen] = useState(store.layout.modelVerifyOTP);
  const [userClientId, setUserClientId] = useState(
    store.layout.downloadClientId
  );
  const [isRequestOpen , setIsRequestOpen] = useState(false)
  const [showTimer, setShowTimer] = useState(true)
  const [timer, setTimer] = useState(60);
  const timeOutCallback = useCallback(() => setTimer(currTimer => currTimer - 1), []);


  useEffect(() => {
    if (isRequestOpen == true) {
      if (timer > 0) {
        setTimeout(timeOutCallback, 1000)
      } else {
        setShowTimer(false)
      }
    }

  }, [timer, timeOutCallback, showTimer , isRequestOpen]);


  // ** Send OTP
  const SendOTP = (userClientId) => {
    setBlock(true);
    AuthenticationService.gstrSendOTP(userClientId)
      .then((res) => {
        setBlock(false);
        if (
          res.status === 200 &&
          res.data.status === errorCodeConfig.APIDefaultCode.Success
        ) {
          setShowTimer(true)
          toast.success(res.data.successMessage, {
            position: "top-right",
          });
          resetTimer();
        } else {
          toast.error(res.data.errorMessage, {
            position: "top-right",
          });
          setIsRequestOpen(false);
          setComposeOpen(false)

          if (types == "requestotp") {
            setSelectedItem("1") // request otp
          }

        }
      })
      .catch((error) => {
        setBlock(false);
        setIsRequestOpen(false);
        setComposeOpen(false)
        Swal.fire({
          icon: "error",
          title: "",
          text: error?.message,
        });
      });
  };


  // ** Conformation send OTP
  useEffect(() => {
    if (composeOpen == true) {
      MySwal.fire({
        title: messageDisplay,
        text: "Do you want to send government OTP?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes",
        customClass: {
          confirmButton: "btn btn-outline-danger",
          cancelButton: "btn btn-outline-dark ms-1",
        },
        buttonsStyling: false,
      }).then(function (result) {
        if (result.value) {
            setIsRequestOpen(true);
            console.log("userClientId", userClientIds);
          if (
            userClientIds !== null &&
            userClientIds !== ""
          ) {
                //  setShowTimer(true)
                //   resetTimer()
             SendOTP(userClientIds);
          }
        } else if (result.dismiss === MySwal.DismissReason.cancel) {
           reset();
           togglePopUp()
        }
      });
    }
  }, [composeOpen]);


  // ** Close - Old Code
  const onClose = (e) => {
    reset();
    dispatch(handleModelOTPSend(!store.layout.modelSendOTP));
    dispatch(handleModelOTP(!store.layout.modelVerifyOTP));
    dispatch(handleModelOTPClientId(null));
    e.preventDefault();
  };


  // ** OnSubmit
  const onSubmit = (data) => {
    sessionStorage.removeItem("btnDisable")
    sessionStorage.removeItem("btnDisable1")
    sessionStorage.removeItem("btnDisable6")
    sessionStorage.removeItem("btnDisable04")
    // Validate OTP
    if (
        userClientIds !== null &&
        userClientIds !== ""
    ) {
      AuthenticationService.gstrVerifyOTP(
        data?.otp?.trim(),
        userClientIds
      ).then((res) => {
        console.log(res);
        if (
          res.status === 200 &&
          res.data.status === errorCodeConfig.APIDefaultCode.Success
          ) {
            // verify message show
            console.log("types-" , types )
            if (types == 'gstr1') {
              setSelectedItem("5") // gstr1 govt file
              sessionStorage.setItem("btnDisable" , "5")
            } else if ( types == 'gstr6') {
              setSelectedItem("5") // gstr6 govt file
              sessionStorage.setItem("btnDisable6" , "5")
            } else if ( types == 'itc04') {
              setSelectedItem("5") // itc04 govt file
              sessionStorage.setItem("btnDisable4" , "5")
            }

            // ** Request OTP
            if (types == "requestotp") {
              setSelectedItem("1") // request otp
            }

            toast.success(res?.data?.successMessage, {
              position: "top-right",
            });

            togglePopUp()
        } else {

          if (types == "requestotp") {
            setSelectedItem("1") // request otp
          }

          toast.error(res?.data?.errorMessage, {
            position: "top-right",
          });
          togglePopUp()
        }
      });
    }
  };

    // ** Toggles Compose POPUP
    const togglePopUp = e => {
        reset()
        setShowTimer(false)
        setTimer(60)
        setIsRequestOpen(false);
        toggleCompose();
    }

    // ** Reset OTP
    const ResendOtpFunc = () => {
      reset()
      SendOTP(userClientIds)

    }

   //** Rest Timeer
  const resetTimer = function () {
    if (!timer) {
      setTimer(60);
    }
  };

  // useEffect(() => {
  //   if (isRequestOpen == true) {
  //     setShowTimer(true)
  //     resetTimer()
  //   }
  // } ,[isRequestOpen])

  useEffect(() => {
    setShowTimer(true)
    resetTimer();
  } ,[])

  return (
    <div>
      {block && <div className="loading1">Loading&#8230;</div>}
      {isRequestOpen == true && (
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Modal
            backdrop="static"
            isOpen={composeOpen}
            toggle={togglePopUp}
            className="modal-dialog-centered modal-sm"
          >
            <div className="modal-header text-center">
              <h3 className="modal-title text-center m-auto fw-bolder">
                Enter OTP to authorize connection
              </h3> 
              <div className="modal-actions">
                <a onClick={togglePopUp} className="text-body">
                  <X size={14} />
                </a>
              </div>
            </div>

            <ModalBody >
               <Row>
               <Col xs={12}>
                <h3>OTP is sent for GSTIN: <b>{otpGSTIN} </b></h3>
                </Col>
              </Row>
              <Row tag="form" className="gy-1 pt-75">
                <Col xs={12}>
                  <Label className="form-label">Enter OTP</Label>
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
                        placeholder="Enter OTP"
                        maxLength='6'
                        invalid={errors.otp && true}
                        {...field}

                      />
                    )}
                  />
                  {errors.otp && (
                    <FormFeedback>{errors.otp.message}</FormFeedback>
                  )}
                </Col>
                <Col xs={12} className="mt-0 pt-50">
                  <Row>
                     <Col xs={10} className="pe-0">
                     <p className='text-end'>
                     <span className='me-25'>Didn't get the OTP ? </span>
                      </p>
                    </Col>
                    <Col xs={2} className="text-end ps-0">

                    <span>
                    {
                      showTimer ? <span className='text-danger' > {timer >= 10 ? '00:' + timer : '00:' + 0 + timer}   </span> :
                        <span onClick={!block &&  ResendOtpFunc} className='text-danger' style={{ cursor: 'pointer' }} >Resend</span>
                    }
                  </span>

                    </Col>
                  </Row>

                </Col>

                <Col xs={12} className="text-center mt-0 pt-50">
                  <Button outline color="danger" className="me-1">
                    Submit
                  </Button>
                  <Button color="secondary" outline onClick={togglePopUp}>
                    Close
                  </Button>
                </Col>
              </Row>
            </ModalBody>
          </Modal>
        </Form>
      )}
    </div>
  );
};

export default VerificationOTP;
