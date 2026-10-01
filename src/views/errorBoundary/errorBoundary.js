import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import illustrationsLight from "@src/assets/images/pages/error.svg";
import GenericGSTLogo from "@src/assets/images/logo/powerlogo.png";
import { Button } from "reactstrap";
import "@styles/base/pages/page-misc.scss";
import { API_URL } from "../../configs/config";
import axios from "axios";

function ErrorBoundary({ children }) {
  const [hasError, setHasError] = useState(false);
  const [errMsg, setErrMsg] = useState(null);
  const [errUrl, setErrUrl] = useState(null);

  const navigate = useNavigate();
  let pageUrl = window.location.href;

  useEffect(() => {
    let errLink = pageUrl?.split("/")?.pop();
    setErrUrl(errLink);
    // debugger
    const handleErrors = (error, info) => {
      console.log(info,"infooooooooo" , error?.message )
      
      if (error?.message?.includes('Failed to fetch dynamically imported module')) {
          window?.location?.reload();
        }

      if(error?.message?.includes("highlight") || error?.message?.includes("readOnly") ||
      error?.message?.includes("start") || error?.message?.includes("n.isMoment") ||
      error?.message?.includes("focus") ||  error?.message?.includes("parentNode") ||
      error?.message?.includes("reading '1'")
     //  || error?.message?.includes("Cannot assign to read only property")
      ){
        console.log(true,"error msg is working")
      }
      else{
        setErrMsg(error?.message);
        setHasError(true);
      }
    };
    window.addEventListener("error", handleErrors);

    return () => {
      window.removeEventListener("error", handleErrors);
    };
  }, []);

  const onClickBackHome = () => {
    navigate("/dashboard/company");
    window.location.reload();
  };

  useEffect(() => {
    if (hasError) {
      let Payload = {
        StackTrace: errUrl,
        ExceptionMessage: errMsg,
        moduleName: "react",
      };
      // ** log error api
      // axios
      //   .post(API_URL + "/api/errorlog/add-error", Payload)
      //   .then((res) => {
      //     console.log("Error", res);
      //   })
      //   .catch((err) => console.log(err));
    }
  }, [hasError]);

  if (hasError) {
    return (
      <>
        <div className="misc-wrapper">
          <a className="brand-logo" href="/">
            <img height={150} src={GenericGSTLogo} alt="power-gst-logo" />
          </a>
          <div className="misc-inner p-2 p-sm-3">
            <div className="w-100 text-center">
              <h2 className="mb-1">Some thing Went Wrong 🕵🏻‍♀️</h2>
              <p className="mb-2">
                Oops! 😖 The requested URL has taking large Time Please try
                again.
              </p>
              <Button
                onClick={onClickBackHome}
                color="danger"
                className="btn-sm-block mb-2"
              >
                Back to home
              </Button>
              <img
                className="img-fluid"
                src={illustrationsLight}
                alt="Not authorized page"
              />
            </div>
          </div>
        </div>
      </>
    );
  }
  return children;
}

export default ErrorBoundary;
