import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button, Col, FormFeedback, Input, Label, Modal, ModalBody, Row, Form } from 'reactstrap';
import { X } from "react-feather";
import errorCodeConfig from '../../../configs/apiErrorCodeConfig';
import Swal from 'sweetalert2';
import gstr1FileDataService from '../../../services/gstr1/gstr1DataFileService/gstr1FileDataService';
import toast from 'react-hot-toast';

const WithoutOtpModel = (props) => {
  const [resData, setResData] = useState([]);
  const [block, setBlock] = useState(false);

  const { G_UCParId, openWithoutOtpFailed, toggleComposeWithoutOtp, setopenWithoutOtpFailed } = props;

  const defaultValues = {
    username: "",
    password: ""
  };

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm({ defaultValues });

  const togglePopUp = (e) => {
    reset();
    setopenWithoutOtpFailed(false);
  };

  const onSubmitUpdateData = async (data) => {
    try {
      setBlock(true);
      const res = await gstr1FileDataService.updateClientDataOnWithoutOtp(G_UCParId, data?.username, data?.password);

      if (res?.status === 200 && res?.data?.status === errorCodeConfig.APIDefaultCode.Success) {
        toast.success(res?.data?.successMessage, {
          position: "top-right",
        });
        setopenWithoutOtpFailed(false)
      } else {
        toast.error(res?.data?.errorMessage, {
          position: "top-right",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "",
        text: error?.message,
        customClass: {
          confirmButton: "btn btn-outline-danger",
        },
        buttonsStyling: false,
      });
    } finally {
      setBlock(false);
    }
  };

  const getUserData = async () => {
    try {
      setBlock(true);
      const res = await gstr1FileDataService.getClientDataOnWithoutOtp(G_UCParId);

      if (res?.status === 200 && res?.data?.status === errorCodeConfig.APIDefaultCode.Success) {
        setResData(res?.data?.data);
        setValue("username", res?.data?.data?.username);
        setValue("password", res?.data?.data?.password);
      } else {
        toast.error(res?.data?.errorMessage, {
          position: "top-right",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "",
        text: error?.message,
        customClass: {
          confirmButton: "btn btn-outline-danger",
        },
        buttonsStyling: false,
      });
    } finally {
      setBlock(false);
    }
  };

  useEffect(() => {

    if (openWithoutOtpFailed == true) {
      getUserData()
    }

  }, [openWithoutOtpFailed]);


  return (
    <div>
      {block && <div className="loading1">Loading&#8230;</div>}
      <Form onSubmit={handleSubmit(onSubmitUpdateData)} className='mt-2 pt-50'>
        <Modal
          backdrop="static"
          isOpen={openWithoutOtpFailed}
          toggle={() => setopenWithoutOtpFailed(!openWithoutOtpFailed)}
          className="modal-dialog-centered modal-sm"
        >
          <div className="modal-header">
            <h2 className="modal-title w-100 text-center">Update User Credentials</h2>
            <div className="modal-actions">
              <a className="text-body" onClick={() => setopenWithoutOtpFailed(!openWithoutOtpFailed)}>
                <X size={14} />
              </a>
            </div>
          </div>
          <ModalBody className="px-sm-2 mx-30 pb-2">

            <Row tag="form" className="gy-1 pt-75">
              {/* <Col xs={12}> */}
              {/* <Col xs={12}>
                <Label
                  className="form-label w30"
                  for="CompanyName"
                >
                  <b>Company Name</b>
                </Label>
                <span className="w70" title={resData?.companyName} >{' : '}{resData?.companyName?.length > 30
                  ? resData?.companyName.substring(0, 30) + '...'
                  : resData?.companyName}</span>
              </Col> */}
              <Col xs={12}>
                <Label
                  className="form-label w25"
                  for="TradeName"
                >
                  <b>Trade Name</b>
                </Label>
                <span className="w40" title={resData?.tradeName} >{' : '}{resData?.tradeName?.length > 30
                  ? resData?.tradeName.substring(0, 30) + '...'
                  : resData?.tradeName}</span>
              </Col>
              <Col xs={12}>
                <Label
                  className="form-label w15"
                  for="GstinNumber"
                >
                  <b>GSTIN</b>
                </Label>
                <span className="w40" >{' : '}{resData?.gstinNumber}</span>
              </Col>
              <Col xs={12}>
                <Label className="form-label">Username</Label>
                <Controller
                  id="username"
                  name="username"
                  control={control}
                  rules={{
                    required: "Please enter valid username.",
                  }}
                  render={({ field }) => (
                    <Input
                      autoFocus
                      type="text"
                      placeholder="username"
                      invalid={errors.username && true}
                      {...field}
                    />
                  )}
                />
                {errors.username && (
                  <FormFeedback>{errors.username.message}</FormFeedback>
                )}
              </Col>
              <Col xs={12}>
                <Label className="form-label">Password</Label>
                <Controller
                  id="password"
                  name="password"
                  control={control}
                  rules={{
                    required: "Please enter valid password.",
                  }}
                  render={({ field }) => (
                    <Input
                      autoFocus
                      type="text"
                      placeholder="password"
                      invalid={errors.password && true}
                      {...field}
                    />
                  )}
                />
                {errors.password && (
                  <FormFeedback>{errors.password.message}</FormFeedback>
                )}
              </Col>
              {/* </Col> */}
              <Col xs={12} className="text-center mt-2 pt-50">
                <Button color="secondary" className="me-1" outline onClick={togglePopUp}>
                  Close
                </Button>
                <Button outline color="danger" type="submit">
                  Submit
                </Button>
              </Col>
            </Row>

          </ModalBody>
        </Modal>
      </Form>
    </div>
  );
};

export default WithoutOtpModel;
