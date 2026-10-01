
import GSTR1DownloadService from "../../../services/gstr1/gstr1Services/gstr1DownloadService";
import Swal from "sweetalert2";
import errorCodeConfig from "@configs/apiErrorCodeConfig";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { urlEndpointConfig } from '@configs/urlEndpoint'

const NilReturnFillingFunc = () => {

  const navigate = useNavigate();



  // ** Process-to-file
  const processToFileFunc = (payLoad ) => {

    let statusValue = null;
    let statusMsg = null
    var retrunValues =  {}

    GSTR1DownloadService.proceedFileGstr1Govt(payLoad)
      .then((res) => {
        console.log("res-", res)

        if (res.data.status === errorCodeConfig.APIDefaultCode.GovtOTPExpire) {
           toast.error(res?.data?.errorMessage, {
              position: "top-right",
            });

            setTimeout(() => {
              navigate(urlEndpointConfig.REQUESTOTP)
            }, 200);

            statusValue =  res.data.status;
            statusMsg = res?.data?.errorMessage

        } else{
          if (
            res.status === 200 &&
            res.data.status === errorCodeConfig.APIDefaultCode.Success
          ) {

            statusValue =  res.data.status;
            statusMsg = res?.data?.successMessage


            generateSummaryFunc(payLoad)

          } else {

            statusValue =  res.data.status;
            statusMsg = res?.data?.errorMessage

          }
        }
        retrunValues = {status : statusValue , msg :  statusMsg }
        return retrunValues
      })
      .catch((error) => {
        statusValue = null
        statusMsg = error.message
        retrunValues = {status : statusValue , msg :  statusMsg }
        return retrunValues
      });




  };

  // ** Generate-summary
  const generateSummaryFunc = (payLoad) => {
    let statusValue = null;
    let statusMsg = null
    var retrunValues =  {}

    GSTR1DownloadService.getGstr1SummaryGovt(payLoad)
      .then((res) => {
        if (res.data.status === errorCodeConfig.APIDefaultCode.GovtOTPExpire) {
          toast.error(res?.data?.errorMessage, {
            position: "top-right",
          });

          setTimeout(() => {
            navigate(urlEndpointConfig.REQUESTOTP)
          }, 200);

          statusValue =  res.data.status;
          statusMsg = res?.data?.errorMessage

        } else {
          if (
            res.status === 200 &&
            res.data.status === errorCodeConfig.APIDefaultCode.Success
          ) {

            statusValue =  res.data.status;
            statusMsg = res?.data?.successMessage

          } else {
            statusValue =  res.data.status;
            statusMsg = res?.data?.errorMessage
          }
        }

      })
      .catch((error) => {
        statusValue =  null ;
        statusMsg =  error.message
      });

      retrunValues = {status : statusValue , msg :  statusMsg }

      return retrunValues

  };

  return {
    processToFileFunc ,  generateSummaryFunc
  }

}

  export default   NilReturnFillingFunc
