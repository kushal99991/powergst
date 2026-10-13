// ** React Imports
import { Fragment, useState } from "react";

// ** Reactstrap Imports
import {
  Alert,
  Card,
  CardBody,
  CardText,
  Table,
  Row,
  Col
} from "reactstrap";
import power from "../../../../power.png";
// import "./terms.css";
import trialSvg from "@src/assets/images/illustration/pricing-Illustration.svg";
import noticeimg from "@src/assets/images/pages/notice-page-image.png";
import noticesolution from "@src/assets/images/pages/gst-notice.jpg";
import noticesolution1 from "@src/assets/images/pages/gst-notice1.png";

const homeScreenDashboard = () => {
  const [open, setOpen] = useState("1");
  const [active, setActive] = useState("1");

  return (
    <Fragment>
      <Card className="homepage">
        <div
          style={{
            boxShadow: "0 4px 24px #22292f1a",
            padding: "10px",
            position: "fixed",
            width: "100%",
            backgroundColor: "#fff",
            zIndex: "1",
          }}
        >
          <h1 className="text-center">
            <span className="float-start d-flex">
              <img src={power} width={100}></img>
            </span>
            <span className="float-end d-flex">
              <a href="/login" className="btn btn-danger">
                Sign In
              </a>
              <a href="/register" className="btn btn-danger ms-2">
                Sign Up
              </a>
            </span>
          </h1>
        </div>
        <br></br>
        <br></br>
        <br></br>
        <CardBody>
          {/* Img component Start*/}
          <div className="pricing-free-trial py-5 my-2">
            <Row>
              <Col className="mx-auto px-5" lg="12" sm="12">
                <div className="pricing-trial-content d-flex justify-content-between">
                  <div className="text-center text-md-start my-auto col-lg-8 ">
                    <h1>Auto Fetching of Income Tax & GST Notices</h1>
                    <br></br>
                    <br></br>
                    <h2 className="text-danger">
                      NoticeAlert - Auto Fetching Income tax & GST notices
                      including Response, Deadlines & Stores in Centralise
                      Manner
                    </h2>
                    <br></br>
                    <br></br>
                    <h5>
                      "Stay Informed, Stay Compliant: NoticeAlert Keeps You
                      Ahead!"
                    </h5>
                    <div className="mt-2 mt-lg-3">
                      {/* <Button color='danger' >Login</Button> */}
                    </div>
                  </div>
                  <div className=" col-lg-4 my-auto">
                    <img
                      className=" img-fluid"
                      src={noticesolution1}
                      alt="trial svg"
                      style={{
                        transform: "scaleX(1)",
                      }}
                    />
                  </div>
                </div>
              </Col>
            </Row>
          </div>
          <h2 className="text-center" style={{ color: "#0f5998" }}>
            Features of NoticeAlert
          </h2>
          <div className="pricing-free-trial pt-5">
            <Row>
              <Col className="mx-auto px-5" lg="12" sm="12">
                <div className="pricing-trial-content d-flex justify-content-between">
                  <div className=" col-lg-5 pe-5 text-center">
                    <img
                      className=" w-100 img-fluid"
                      src={noticesolution}
                      alt="trial svg"
                      style={{ transform: "scaleX(1)", borderRadius: "5px" }}
                    />
                  </div>
                  <div className="text-center text-md-start col-lg-7 text-black fw-bolder my-auto">
                    <ul>
                      <li>
                        Auto Fetching Notice from Income tax & GST Portal
                        including Notices PDFs & Responses.
                      </li>
                      <br></br>
                      <li>
                        Upon successful downloading of a notice, the system can
                        trigger notifications or alerts to the designated
                        recipients within the taxpayer's organization.
                      </li>
                      <br></br>
                      <li>
                        It tracks the status of downloaded notices, including
                        response deadlines and actions taken or pending.
                      </li>
                      <br></br>
                      <li>
                        NoticeAlert is a centralized Notice Repository. Collate
                        all notices on a single platform
                      </li>
                      <br></br>
                      <li>It send due date reminders to users</li>
                      <br></br>
                      <li>
                        Add due date, issue dates and compliance date to outlook
                        & Google calendar.
                      </li>
                    </ul>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </CardBody>
      </Card>
      <div className="footer mt-4 bg-black py-2 px-5">
        <Row>
          <Col className="mx-auto text-white" lg="4">
            +91 63540 11142 | +91 97731 38204 | +91 983 983 0986
          </Col>
          <Col className="mx-auto text-white" lg="4">
            support@example.com | sales@example.com
          </Col>
          <Col className="mx-auto text-white" lg="4">
            909-910, Zion Z-1, Nr. Avalon Hotel, Sindhu Bhavan Marg, Bodakdev,
            Ahmedabad, Gujarat-380054
          </Col>
        </Row>
      </div>
    </Fragment>
  );
};

export default homeScreenDashboard;
