import { useState, useEffect } from "react";
import {
  Modal,
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

// ** Third Party Components
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import toast from "react-hot-toast";
import { X } from "react-feather";
const MySwal = withReactContent(Swal);

const defaultValues = {
  panno: "",
};

const PanVerifyModal = (props) => {
  console.log(props, "propsprops");
  const { composeOpen, toggleCompose, setSelectedPan } = props;

  // ** Hooks
  const [block, setBlock] = useState(false);
  const [isRequestOpen, setIsRequestOpen] = useState(false);

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors },
    clearErrors,
    setValue,
    reset,
  } = useForm({ defaultValues });

  useEffect(() => {
    if (composeOpen == true) {
      setSelectedPan(null);
      reset();
    }
  }, [composeOpen]);

  const onClose = (e) => {
    reset();
    e.preventDefault();
  };

  const onSubmit = (data) => {
    if (data) {
      setSelectedPan(data.panno);
      toggleCompose();
    }
  };

  // ** Toggles Compose POPUP
  const togglePopUp = (e) => {
    reset();
    setIsRequestOpen(false);
    toggleCompose();
  };

  // ** Escape key - disable
  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      // Prevent closing the modal when the Escape key is pressed
      e.stopPropagation();
    }
  };

  return (
    <div>
      {block && <div className="loading1">Loading&#8230;</div>}
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Modal
          backdrop="static"
          isOpen={composeOpen}
          onKeyDown={handleKeyDown}
          className="modal-dialog-centered modal-sm"
        >
          <div className="modal-header">
            <h2 className="modal-title w-100 text-center">Send OTP</h2>
            <div className="modal-actions">
              <a onClick={togglePopUp} className="text-body">
                <X size={14} />
              </a>
            </div>
          </div>
          <ModalBody className="px-sm-5 mx-30 pb-2">
            <Row tag="form" className="gy-1 pt-75">
              <Col xs={12}>
                <Label className="form-label requiredlable">
                  PAN Number Of Authorized Signatory
                </Label>
                <Controller
                  id="panno"
                  name="panno"
                  control={control}
                  rules={{
                    required: "Please enter valid PAN Number.",
                    pattern: {
                      value: /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/,
                      message: "Please enter valid PAN Number.",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      autoFocus
                      type="text"
                      placeholder=""
                      invalid={errors.panno && true}
                      {...field}
                    />
                  )}
                />
                {errors.panno && (
                  <FormFeedback>{errors.panno.message}</FormFeedback>
                )}
              </Col>
              <Col xs={12} className="text-center mt-2 pt-50">
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
    </div>
  );
};

export default PanVerifyModal;
