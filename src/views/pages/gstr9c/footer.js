import React from "react";
import { ArrowLeft, ArrowRight, FilePlus } from "react-feather";
import { Button } from "reactstrap";

const Footer = ({ stepper, onSave, onPrevious, onNext }) => {
  if (onSave) {
    return (
      <div style={{ zIndex: "999" }} className="btnFixFooter">
        <div className="container">
          <div
            style={{ margintop: "25px" }}
            className="d-flex justify-content-between row"
          >
            <div className="col-md-4 text-start">
              <Button color="danger" className="btn-prev " onClick={onPrevious}>
                <ArrowLeft
                  size={14}
                  className="align-middle me-sm-25 me-0"
                ></ArrowLeft>
                <span className="align-middle d-sm-inline-block d-none">
                  Previous
                </span>
              </Button>
            </div>

            <div className="col-md-8 text-end">
              <Button
                className="btn-icon me-2"
                outline
                color="danger"
                id="btnSaveGSTR9C"
                onClick={() => onSave()}
              >
                <FilePlus size={14} />
                <span className="align-middle d-sm-inline-block d-none ms-50 ">
                  Save
                </span>
              </Button>
              <Button color="danger" className="btn-next " onClick={onNext}>
                <span className="align-middle d-sm-inline-block d-none">
                  Next
                </span>
                <ArrowRight
                  size={14}
                  className="align-middle ms-sm-25 ms-0"
                ></ArrowRight>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  } else
    return (
      <div style={{ zIndex: "999" }} className="btnFixFooter">
        <div className="container">
          <div
            style={{ marginTop: "25px" }}
            className="d-flex justify-content-between"
          >
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
            <Button
              color="danger"
              className="btn-next"
              onClick={() => stepper.next()}
            >
              <span className="align-middle d-sm-inline-block d-none">
                Next
              </span>
              <ArrowRight
                size={14}
                className="align-middle ms-sm-25 ms-0"
              ></ArrowRight>
            </Button>
          </div>
        </div>
      </div>
    );
};

export default Footer;
