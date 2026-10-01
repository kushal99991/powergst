// ** React Import
import React, { Fragment, useState, useEffect, useRef } from "react";
import {
  Label,
  Input,
  Col,
  Row,
  Button,
  UncontrolledTooltip,
  Table,
  Alert
} from "reactstrap";
// ** Custom Components
import Breadcrumbs from "@components/breadcrumbs";

import { registerAllModules } from "handsontable/registry";
import { HotTable } from "@handsontable/react";
import "@styles/react/pages/page-form-validation.scss";
import { Trash2, X, FilePlus, Download, File , Edit , AlertCircle } from "react-feather";
import Swal from "sweetalert2";

// Import Services.
import GSTR3Services from "../../../../services/gstr3b/gstr3bService";
// Default Imports
import { globleVariable } from "../../../../configs/globalVariable";
import SessionFunction from "../../../../configs/getSessionFunction";
import errorCodeConfig from "../../../../configs/apiErrorCodeConfig";
import { selectThemeColors } from "@utils";
import { SELECT_MAXSIZE } from "../../../../configs/config";
import makeAnimated from "react-select/animated";
import {
  LINK_MESSAGE,
  keysMap,
  enableOnFormTags,
  RowSize, columnHeaderSize
} from "../../../../configs/config";
import Select, { components } from "react-select"; // eslint-disable-line
import LocalFunction from "../../../../configs/getLocalFunction";
import toast from "react-hot-toast";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);
const animatedComponents = makeAnimated();
// import VerificationModal from '../../../views/pages/verification-otp/index'
import VerificationModal from '../../verification-otp/index'
import { urlEndpointConfig } from "@configs/urlEndpoint";

registerAllModules();

const computationtax = () => {
  const cashLedgerObj = {
    igst: "",
    cgst: "",
    sgst: "",
    cess: "",
    total: "",
  };

  // ** Hooks
  const [block, setBlock] = useState(false);
  const [computationData, setComputationData] = useState();
  const [itcLedgerData, setItcLedgerData] = useState([{
          description: "Integrated Tax",
          openingBalance: "0.00",
          itCearned: "0.00",
          totalITCAvailable: "0.00",
          itcUtilized: "0.00",
          closingITC: "0.00",
        }, {
          description: "Central Tax",
          openingBalance: "0.00",
          itCearned: "0.00",
          totalITCAvailable: "0.00",
          itcUtilized: "0.00",
          closingITC: "0.00",
        },
        {
          description: "State/UT Tax",
          openingBalance: "0.00",
          itCearned: "0.00",
          totalITCAvailable: "0.00",
          itcUtilized: "0.00",
          closingITC: "0.00",
        },
        {
          description: "Cess",
          openingBalance: "0.00",
          itCearned: "0.00",
          totalITCAvailable: "0.00",
          itcUtilized: "0.00",
          closingITC: "0.00",
        },
        {
          description: "Total",
          openingBalance: "0.00",
          itCearned: "0.00",
          totalITCAvailable: "0.00",
          itcUtilized: "0.00",
          closingITC: "0.00",
        },
        ]);
  const [cashLedgerData, setCashLedgerData] = useState([cashLedgerObj]);
  const [panData, setPanData] = useState([]);
  const [monthFrom, setMonthFrom] = useState(null);
  const [displayType, setDisplayType] = useState(false);
  const [errorArr, setErrorArr] = useState([]);
  const [manualEntry , setManualEntry] = useState(false)
  const  [manualTitle , setManualTitle] = useState("Manual")

  const [msgDisplay, setMsgDisplay] = useState(null);
  const [composeOpen, setComposeOpen] = useState(false)
  const toggleCompose1 = () => setComposeOpen(!composeOpen)
  const [disableText , setDisableText] = useState(true);

  const [isCheck, setIsCheck] = useState(false);

  const nestHed = [
    ["", "", { label: "Paid through ITC", colspan: 4 }],
    [
      { label: "Description", data: "Description" },
      "<div>Other than reverse charge  <br> Tax payable (₹)</div>",
      "Integrated Tax (₹)",
      "Central Tax(₹)",
      "State/UT Tax (₹)",
      "CESS(₹)",
      "<div>Other than reverse charge <br>Tax to be paid in Cash (₹) <div/>",
      "<div>Reverse charge <br> Tax payable (₹)<div/>",
      "<div> Reverse charge Tax to  <br> be paid in Cash (₹) <div/>",
      "Interest payable (₹)",
      "Interest to be paid in Cash (₹)",
      "Late Fee payable (₹)",
      "Late Fee to be paid in Cash (₹)",
      "Total tax to be paid in Cash (₹)",
      "Utilizable Cash balance (₹)",
      "Additional Cash required (₹)",
    ],
  ]

  const finYearOption = LocalFunction.getLocalValue(
    globleVariable.rangeFilters,
    true
  );

  const userIds =
  localStorage.getItem(globleVariable.userId) &&
    LocalFunction.getLocalValue(globleVariable.userId, true)
    ? LocalFunction.getLocalValue(globleVariable.userId, true)
    : " ";



  const YearList =
    finYearOption !== undefined &&
    finYearOption !== null &&
    finYearOption !== "" &&
    finYearOption !== "undefined"
      ? JSON.parse(finYearOption)
      : [];

  const hotRef = useRef(null);
  const hotRefITC = useRef(null);
  const hotRefCash = useRef(null);

  useEffect(() => {
    setPanData(YearList);
    setDisplayType(true);
  }, []);

  useEffect(() => {
    GetPaymentOfPageData();
  }, []);

  // ** Set From and to Date by session
  useEffect(() => {
    console.log("default value");
    if (displayType == true) {
      let defaultValueFrom = null;
      let defaultValueTo = null;

      if (
        gstr3BToDt !== null &&
        gstr3BToDt !== "" &&
        gstr3BToDt !== undefined
      ) {
        defaultValueTo = panData?.filter((item) => item.value == gstr3BToDt)[0];
      } else {
        defaultValueTo = panData?.filter(
          (item) =>
            Number(item.value) ==
            Number(
              SessionFunction.getSessionValue(globleVariable.defaultYear, true)
            )
        )[0];
      }
      if (
        defaultValueTo !== undefined &&
        defaultValueTo !== null &&
        defaultValueTo !== ""
      ) {
        setMonthFrom(defaultValueTo);
        SessionFunction.setSessionValue(
          globleVariable.gstr3BToDt,
          defaultValueTo?.value,
          true
        );
      }
    }
  }, [displayType]);

  //Get all default data from session
  const G_UCParId =
    sessionStorage.getItem(globleVariable.G_UCParId) &&
    SessionFunction.getSessionValue(globleVariable.G_UCParId, true);
  const gstr3BToDt =
    sessionStorage.getItem(globleVariable.gstr3BToDt) &&
    SessionFunction.getSessionValue(globleVariable.gstr3BToDt, true);
  const G_GSTIN =
    sessionStorage.getItem(globleVariable.G_GSTIN) &&
    SessionFunction.getSessionValue(globleVariable.G_GSTIN, true);
  const UserId = LocalFunction.getLocalValue(globleVariable.userId, true)
    ? LocalFunction.getLocalValue(globleVariable.userId, true)
    : " ";
    const subscriptionId = localStorage.getItem(globleVariable.subscriptionId) && LocalFunction.getLocalValue(globleVariable.subscriptionId, true);

    // const G_GSTIN = SessionFunction.getSessionValue(globleVariable.G_GSTIN, true);


  // ** ITC Ledger
  const itcLedgerColumns = [
    {
      title: "Description",
      data: "description",
      readOnly: true,
    },
    {
      title: "Opening Balance",
      type: "numeric",
      numericFormat: {
        pattern: '0,0.00',
        culture: 'en-IN'
    },
      data: "openingBalance",
      readOnly: true,
    },
    {
      title: "ITC Earned",
      type: "numeric",
      numericFormat: {
        pattern: '0,0.00',
        culture: 'en-IN'
    },
      data: "itCearned",
      readOnly: true,
    },
    {
      title: "Total ITC Available",
      //  readOnly: true,
      type: "numeric",
      numericFormat: {
        pattern: '0,0.00',
        culture: 'en-IN'
    },
      data: "totalITCAvailable",
    },
    {
      title: "ITC Utilized",
      type: "numeric",
      numericFormat: {
        pattern: '0,0.00',
        culture: 'en-IN'
    },
      data: "itcUtilized",
    },
    {
      title: "Closing ITC",
      type: "numeric",
      numericFormat: {
        pattern: '0,0.00',
        culture: 'en-IN'
    },
      data: "closingITC",
      readOnly: true,
    },
  ];

  // ** Cash Ledger
  const cashLedgerColumns = [
    {
      title: "IGST",
      data: "igst",
      type: "numeric",
      numericFormat: {
        pattern: '0,0.00',
        culture: 'en-IN'
    },
    },
    {
      title: "CGST",
      data: "cgst",
      type: "numeric",
      numericFormat: {
        pattern: '0,0.00',
        culture: 'en-IN'
    },
    },
    {
      title: "SGST",
      data: "sgst",
      type: "numeric",
      numericFormat: {
        pattern: '0,0.00',
        culture: 'en-IN'
    },
    },
    {
      title: "CESS",
      type: "numeric",
      data: "cess",
      numericFormat: {
        pattern: '0,0.00',
        culture: 'en-IN'
    },
    },
    {
      title: "Total",
      data: "total",
      type: "numeric",
      numericFormat: {
        pattern: '0,0.00',
        culture: 'en-IN'
    },
    },
  ];

  const ItcLedgerSearch = () => {
    GSTR3Services.getGstr3bItcledger(G_UCParId, gstr3BToDt, gstr3BToDt, G_GSTIN)
      .then((res) => {
        if (
          res.status === 200 &&
          res.data.status === errorCodeConfig.APIDefaultCode.Success
        ) {
          console.log("response - itc", res.data.data);
          setItcLedgerData(res.data.data);
        } else {
          Swal.fire({
            icon: "error",
            title: "",
            text: error?.message,
            customClass: {
              confirmButton: "btn btn-danger",
            },
            buttonsStyling: false,
          });
        }
      })
      .catch((error) => {
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

  const cashLedgerSearch = () => {
    GSTR3Services.getGstr3bCashledger(
      G_UCParId,
      gstr3BToDt,
      gstr3BToDt,
      G_GSTIN
    )
      .then((res) => {
        if (
          res.status === 200 &&
          res.data.status === errorCodeConfig.APIDefaultCode.Success
        ) {
          console.log("response - cash");
          setCashLedgerData(res.data.data);
        } else {
          Swal.fire({
            icon: "error",
            title: "",
            text: error?.message,
            customClass: {
              confirmButton: "btn btn-danger",
            },
            buttonsStyling: false,
          });
        }
      })
      .catch((error) => {
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

  //Get Payment Of Page Data First Grid
  const GetPaymentOfPageData = () => {
    setBlock(true);
    GSTR3Services.getAllDataPaymentPage(
      G_UCParId,
      gstr3BToDt,
      gstr3BToDt,
      G_GSTIN
    )
      .then((res) => {
        if (
          res.status === 200 &&
          res.data.status === errorCodeConfig.APIDefaultCode.Success
        ) {
          setBlock(false);
          var paymentOfPageAllData = res?.data?.data;
          var computationOfData = [];
          if (paymentOfPageAllData != null && paymentOfPageAllData.length > 0) {
            computationOfData.push([
              "Integrated Tax",
              paymentOfPageAllData[0].igst,
              paymentOfPageAllData[1].igst,
              paymentOfPageAllData[2].igst,
              paymentOfPageAllData[3].igst,
              paymentOfPageAllData[4].igst,
              paymentOfPageAllData[5].igst,
              paymentOfPageAllData[6].igst,
              paymentOfPageAllData[7].igst,
              paymentOfPageAllData[8].igst,
              paymentOfPageAllData[9].igst,
              paymentOfPageAllData[10].igst,
              paymentOfPageAllData[11].igst,
              paymentOfPageAllData[12].igst,
              paymentOfPageAllData[13].igst,
              paymentOfPageAllData[14].igst,
            ]);

            computationOfData.push([
              "Central Tax",
              paymentOfPageAllData[0].cgst,
              paymentOfPageAllData[1].cgst,
              paymentOfPageAllData[2].cgst,
              paymentOfPageAllData[3].cgst,
              paymentOfPageAllData[4].cgst,
              paymentOfPageAllData[5].cgst,
              paymentOfPageAllData[6].cgst,
              paymentOfPageAllData[7].cgst,
              paymentOfPageAllData[8].cgst,
              paymentOfPageAllData[9].cgst,
              paymentOfPageAllData[10].cgst,
              paymentOfPageAllData[11].cgst,
              paymentOfPageAllData[12].cgst,
              paymentOfPageAllData[13].cgst,
              paymentOfPageAllData[14].cgst,
            ]);

            computationOfData.push([
              "State/UT Tax",
              paymentOfPageAllData[0].sgst,
              paymentOfPageAllData[1].sgst,
              paymentOfPageAllData[2].sgst,
              paymentOfPageAllData[3].sgst,
              paymentOfPageAllData[4].sgst,
              paymentOfPageAllData[5].sgst,
              paymentOfPageAllData[6].sgst,
              paymentOfPageAllData[7].sgst,
              paymentOfPageAllData[8].sgst,
              paymentOfPageAllData[9].sgst,
              paymentOfPageAllData[10].sgst,
              paymentOfPageAllData[11].sgst,
              paymentOfPageAllData[12].sgst,
              paymentOfPageAllData[13].sgst,
              paymentOfPageAllData[14].sgst,
            ]);

            computationOfData.push([
              "Cess",
              paymentOfPageAllData[0].cess,
              paymentOfPageAllData[1].cess,
              paymentOfPageAllData[2].cess,
              paymentOfPageAllData[3].cess,
              paymentOfPageAllData[4].cess,
              paymentOfPageAllData[5].cess,
              paymentOfPageAllData[6].cess,
              paymentOfPageAllData[7].cess,
              paymentOfPageAllData[8].cess,
              paymentOfPageAllData[9].cess,
              paymentOfPageAllData[10].cess,
              paymentOfPageAllData[11].cess,
              paymentOfPageAllData[12].cess,
              paymentOfPageAllData[13].cess,
              paymentOfPageAllData[14].cess,
            ]);


            setComputationData(computationOfData);
          }
        } else {
          setBlock(false);
          toast.error(res?.data?.errorMessage, {
            position: "top-right",
          });
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

  //Get ITC Ledger Second Grid
  const GetITCLedger = () => {
    setIsCheck(false)
    setBlock(true);
    GSTR3Services.getGSTR3BComputationOfTax(G_UCParId, gstr3BToDt, UserId,G_GSTIN,subscriptionId)
      .then((res) => {
        if (
          res.status === 200
          &&
          res.data.status === errorCodeConfig.APIDefaultCode.Success
        ) {
          setDisableText(false)
          setBlock(false);
          const itcLedgerData = res?.data?.data?.itcLedgerData
          console.log(res?.data?.data?.cashLedgerData,"res?.data?.data");

           setCashLedgerData(res?.data?.data?.cashLedgerData)
          // setCashLedgerData([
          //   {
          //     cess : 1000,
          //     cgst : 2000,
          //     igst : 3000,
          //     sgst : 4000,
          //     total : 5000

          //   }
          // ])

          if(itcLedgerData != null && itcLedgerData.length> 0){
            setItcLedgerData([{
              description: "Integrated Tax",
              openingBalance:itcLedgerData[0].igst,
              itCearned: itcLedgerData[1].igst,
              totalITCAvailable:itcLedgerData[2].igst,
              itcUtilized:itcLedgerData[3].igst,
              closingITC:itcLedgerData[4].igst,
          },{
            description:"Central Tax",
            openingBalance:itcLedgerData[0].cgst,
            itCearned: itcLedgerData[1].cgst,
            totalITCAvailable:itcLedgerData[2].cgst,
            itcUtilized:itcLedgerData[3].cgst,
            closingITC:itcLedgerData[4].cgst,
          },
          {
            description:"State/UT Tax",
            openingBalance:itcLedgerData[0].sgst,
            itCearned: itcLedgerData[1].sgst,
            totalITCAvailable:itcLedgerData[2].sgst,
            itcUtilized:itcLedgerData[3].sgst,
            closingITC:itcLedgerData[4].sgst,
          },
          {
            description:"Cess",
            openingBalance:itcLedgerData[0].cess,
            itCearned: itcLedgerData[1].cess,
            totalITCAvailable:itcLedgerData[2].cess,
            itcUtilized:itcLedgerData[3].cess,
            closingITC:itcLedgerData[4].cess,
          },
          {
            description:"Total",
            openingBalance:itcLedgerData[5].totalOpeningBal,
            itCearned: itcLedgerData[5].totalITCEarned,
            totalITCAvailable:itcLedgerData[5].totalITCAvailable,
            itcUtilized:itcLedgerData[5].totalITCUtilized,
            closingITC:itcLedgerData[5].totalClosingITC,
          },
        ])
          }
          else{
            setItcLedgerData()
          }
          var paymentOfPageAllData = res?.data?.data?.paymentofTaxData;
          var computationOfData = [];
          if (paymentOfPageAllData != null && paymentOfPageAllData.length > 0) {
            computationOfData.push([
              "Integrated Tax",
              paymentOfPageAllData[0].igst,
              paymentOfPageAllData[1].igst,
              paymentOfPageAllData[2].igst,
              paymentOfPageAllData[3].igst,
              paymentOfPageAllData[4].igst,
              paymentOfPageAllData[5].igst,
              paymentOfPageAllData[6].igst,
              paymentOfPageAllData[7].igst,
              paymentOfPageAllData[8].igst,
              paymentOfPageAllData[9].igst,
              paymentOfPageAllData[10].igst,
              paymentOfPageAllData[11].igst,
              paymentOfPageAllData[12].igst,
              paymentOfPageAllData[13].igst,
              paymentOfPageAllData[14].igst,
            ]);

            computationOfData.push([
              "Central Tax",
              paymentOfPageAllData[0].cgst,
              paymentOfPageAllData[1].cgst,
              paymentOfPageAllData[2].cgst,
              paymentOfPageAllData[3].cgst,
              paymentOfPageAllData[4].cgst,
              paymentOfPageAllData[5].cgst,
              paymentOfPageAllData[6].cgst,
              paymentOfPageAllData[7].cgst,
              paymentOfPageAllData[8].cgst,
              paymentOfPageAllData[9].cgst,
              paymentOfPageAllData[10].cgst,
              paymentOfPageAllData[11].cgst,
              paymentOfPageAllData[12].cgst,
              paymentOfPageAllData[13].cgst,
              paymentOfPageAllData[14].cgst,
            ]);

            computationOfData.push([
              "State/UT Tax",
              paymentOfPageAllData[0].sgst,
              paymentOfPageAllData[1].sgst,
              paymentOfPageAllData[2].sgst,
              paymentOfPageAllData[3].sgst,
              paymentOfPageAllData[4].sgst,
              paymentOfPageAllData[5].sgst,
              paymentOfPageAllData[6].sgst,
              paymentOfPageAllData[7].sgst,
              paymentOfPageAllData[8].sgst,
              paymentOfPageAllData[9].sgst,
              paymentOfPageAllData[10].sgst,
              paymentOfPageAllData[11].sgst,
              paymentOfPageAllData[12].sgst,
              paymentOfPageAllData[13].sgst,
              paymentOfPageAllData[14].sgst,
            ]);

            computationOfData.push([
              "Cess",
              paymentOfPageAllData[0].cess,
              paymentOfPageAllData[1].cess,
              paymentOfPageAllData[2].cess,
              paymentOfPageAllData[3].cess,
              paymentOfPageAllData[4].cess,
              paymentOfPageAllData[5].cess,
              paymentOfPageAllData[6].cess,
              paymentOfPageAllData[7].cess,
              paymentOfPageAllData[8].cess,
              paymentOfPageAllData[9].cess,
              paymentOfPageAllData[10].cess,
              paymentOfPageAllData[11].cess,
              paymentOfPageAllData[12].cess,
              paymentOfPageAllData[13].cess,
              paymentOfPageAllData[14].cess,
            ]);

            setComputationData(computationOfData);
          }
          // const
          // setItcLedgerData(res?.data?.data);
        } else if (res.data.status === errorCodeConfig.APIDefaultCode.GovtOTPExpire)  {

          setMsgDisplay(res?.data?.errorMessage)
          setBlock(false);
          setComposeOpen(true)

        } else {
          setBlock(false);
          toast.error(res?.data?.errorMessage, {
            position: "top-right",
          });
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

  const GetAllData = () => {

   setManualEntry(false)
  //  setManualTitle("Manual")
    GetITCLedger();

    //  cashLedgerSearch();
  };

  //Save all data
  const onClickSaveButtonOfPaymentPage = () => {
    let isValid = true;
    // let errorArray = [];
    // errorArr &&
    //   errorArr
    //     .sort((a, b) => (a.table > b.table ? 1 : -1))
    //     .map((err) => {
    //       var val = computationData[err.row][handsontableColumns[err.col].data];
    //       if (isNaN(val) || val == null || val == "") {
    //         errorArray.push({
    //           rowNo: err.row,
    //           validationMsg: err.validationMsg,
    //         });
    //       }
    //     });
    if (errorArr.length > 0) {
      return MySwal.fire({
        title: "<strong>Error</strong>",
        icon: "error",
        html: <ErrorTable errorDataList={errorArr}></ErrorTable>,
        customClass: {
          confirmButton: "btn btn-danger",
        },
        buttonsStyling: false,
        width: 600,
      });
    } else {
      var paymentOfPageRowData = computationData;
      var saveComputationOfTax = [];

      // ** Main Data
      if (paymentOfPageRowData != null && paymentOfPageRowData.length > 0) {
        for (var y = 1, Z = 1; y < 15; y++, Z++) {
          var detail = "";
          var additionalDetails = "";
          var igst = "";
          var cgst = "";
          var sgst = "";
          var cess = "";

          if (Z == 1) detail = "1. Other then reverse charge Tax payable";
          else if (Z == 2) detail = "Paid Through ITC";
          else if (Z == 3 || Z == 4 || Z == 5 || Z == 6) detail = null;
          else if (Z == 7)
            detail =
              "6. Other than reverse charge Tax to be paid in Cash (1-2-3-4-5)";
          else if (Z == 8) detail = "7. Reverse charge Tax payable";
          else if (Z == 9) detail = "8. Reverse charge tax to be paid in cash";
          else if (Z == 10) detail = "9. Interest Payable";
          else if (Z == 11) detail = "10. Interest to be paid in cash";
          else if (Z == 12) detail = "11. Late fee payable";
          else if (Z == 13) detail = "12. Late fee to be paid in cash";
          else if (Z == 14) detail = "13. Utilizable cash balance";
          else if (Z == 15) detail = "14. Additional cash required";
          if (Z == 3) additionalDetails = "2. Integrated tax- IGST";
          else if (Z == 4) additionalDetails = "3. Central Tax- CGST";
          else if (Z == 5) additionalDetails = "4. State/UT tax";
          else if (Z == 6) additionalDetails = "5. CESS";

          for (var a = 0; a < 4; a++) {
            if (a == 0) igst = paymentOfPageRowData[a][y] !== null && paymentOfPageRowData[a][y] !== "" ?
              paymentOfPageRowData[a][y].toString() : "0";
            else if (a == 1) sgst =  paymentOfPageRowData[a][y] !== null &&
            paymentOfPageRowData[a][y] !== "" ?  paymentOfPageRowData[a][y].toString() : "0";
            else if (a == 2) cgst = paymentOfPageRowData[a][y] !== null &&
            paymentOfPageRowData[a][y] !== "" ? paymentOfPageRowData[a][y].toString() : "0";
            else if (a == 3) cess = paymentOfPageRowData[a][y] !== null &&
            paymentOfPageRowData[a][y] !== "" ? paymentOfPageRowData[a][y].toString() : "0";
          }

          if (y == 2) {
            saveComputationOfTax.push({
              //  additonalSubDetails: null,
              igst: "0.00",
              cgst: "0.00",
              sgst: "0.00",
              cess: "0.00",
              details: "Paid Through ITC",
              //  gstr3BPaymentId: null,
              taxableValue: "0.00",
            });

            saveComputationOfTax.push({
              //  additonalSubDetails: '2. Integrated tax- IGST',
              igst: igst !== null && igst !== "" ? igst.toString() : "0",
              cgst: cgst !== null && cgst !== "" ? cgst.toString() : "0",
              sgst: sgst !== null && sgst !== "" ? sgst.toString() : "0",
              cess:  cess !== null && cess !== "" ? cess.toString() : "0",
              details: "",
              //   gstr3BPaymentId: null,
              taxableValue: "0.00",
            });
            Z++;
          } else {
            saveComputationOfTax.push({
              //   additonalSubDetails: additionalDetails,
              igst: igst !== null && igst !== "" ?  igst.toString() : "0",
              cgst: cgst !== null && cgst !== "" ? cgst.toString() : "0",
              sgst:  sgst !== null && sgst !== "" ? sgst.toString() : "0",
              cess:  cess !== null && cess !== "" ? cess.toString() : "0",
              details: detail !== null && detail !== "" ? detail : "",
              //  gstr3BPaymentId: null,
              taxableValue: "0.00",
            });
          }
        }
      }

      console.log("Just Created Page", itcLedgerData, cashLedgerData);

      // ** ITC
      let itcDataSave = [];

      if (itcLedgerData?.length > 0) {
        for (let i = 0; i < itcLedgerData.length; i++) {
          itcDataSave.push({
            description: itcLedgerData[i].description,
            openingBalance:
              itcLedgerData[i].openingBalance !== "" &&
              itcLedgerData[i].openingBalance !== null
                ? itcLedgerData[i].openingBalance.toString()
                : "0.00",
            itCearned:
              itcLedgerData[i].itCearned !== "" &&
              itcLedgerData[i].itCearned !== null
                ? itcLedgerData[i].itCearned.toString()
                : "0.00",
            totalITCAvailable:
              itcLedgerData[i].totalITCAvailable !== "" &&
              itcLedgerData[i].totalITCAvailable !== null
                ? itcLedgerData[i].totalITCAvailable.toString()
                : "0.00",
            itcUtilized:
              itcLedgerData[i].itcUtilized !== "" &&
              itcLedgerData[i].itcUtilized !== null
                ? itcLedgerData[i].itcUtilized.toString()
                : "0.00",
            closingITC:
              itcLedgerData[i].closingITC !== "" &&
              itcLedgerData[i].closingITC !== null
                ? itcLedgerData[i].closingITC.toString()
                : "0.00",
          });
        }
      } else {
        isValid = false;
      }

      // ** Cash
      let cashDataSave = [];

      if (cashLedgerData?.length > 0) {
        for (let i = 0; i < cashLedgerData.length; i++) {
          cashDataSave.push({
            igst:
              cashLedgerData[i].igst !== "" && cashLedgerData[i].igst !== null
                ? cashLedgerData[i].igst.toString()
                : "0.00",
            cgst:
              cashLedgerData[i].cgst !== "" && cashLedgerData[i].cgst !== null
                ? cashLedgerData[i].cgst.toString()
                : "0.00",
            sgst:
              cashLedgerData[i].sgst !== "" && cashLedgerData[i].sgst !== null
                ? cashLedgerData[i].sgst.toString()
                : "0.00",
            cess:
              cashLedgerData[i].cess !== "" && cashLedgerData[i].cess !== null
                ? cashLedgerData[i].cess.toString()
                : "0.00",
            total:
              cashLedgerData[i].total !== "" && cashLedgerData[i].total !== null
                ? cashLedgerData[i].total.toString()
                : "0.00",
          });
        }
      } else {
        isValid = false;
      }

      if (isValid) {
        const payLoad = {
          userClientId: G_UCParId,
          range: gstr3BToDt,
          gstin: G_GSTIN,
          userId: UserId,
          paymentofPage: saveComputationOfTax,
          itcLedger: itcDataSave,
          cashLedger: cashDataSave,
        };
        setBlock(true);
        GSTR3Services.gstr3bSaveComputationTax(payLoad)
          .then((res) => {
            if (
              res?.status === 200 &&
              res.data.status === errorCodeConfig.APIDefaultCode.Success
            ) {
              // setBlock(false)
              toast.success(res.data.successMessage, {
                position: "top-right",
              });

              ItcLedgerSearch();
              cashLedgerSearch();
              GetITCLedger();
            } else {
              setBlock(false);
              Swal.fire({
                icon: "error",
                title: "",
                text: res?.data?.errorMessage || res?.data?.title,
                customClass: {
                  confirmButton: "btn btn-danger",
                },
                buttonsStyling: false,
              });
            }
          })
          .catch((error) => {
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
      } else {
        Swal.fire({
          icon: "error",
          title: "",
          text: "data is required.",
          customClass: {
            confirmButton: "btn btn-danger",
          },
          buttonsStyling: false,
        });
      }
    }
  };

  // ** To Month selection
  const selectFromMonth = (value) => {
    setMonthFrom(value);
    SessionFunction.setSessionValue(
      globleVariable.gstr3BToDt,
      value?.value,
      true
    );
  };

  // ** calculation cell on change handsontable function - itc
  function CellValueOnBeforeChange(changes, source) {
    if (changes) {
      if (changes.length > 1) {
        return;
      }
      var row = changes[0][0];
      var prop = changes[0][1];
      var value = changes[0][3];


      console.log("itc cell chagne")

      const hot = hotRefITC?.current?.hotInstance;

      if (prop == "totalITCAvailable" || prop == "itcUtilized") {
        let taxableValue = hot.getDataAtRowProp(row, "totalITCAvailable");
        let itcUtilizedValue = hot.getDataAtRowProp(row, "itcUtilized");
        let totClosingValue = taxableValue - itcUtilizedValue;

        hot.setSourceDataAtCell(row, "closingITC", totClosingValue, "");
      }

      CalcFunction(row, prop);
    }
  }

  const CalcFunction = (row, colName) => {
    console.log("calc" , row, colName )
    const hot = hotRefITC?.current?.hotInstance;
    let totOpeningBal = 0.0;
    let totItc = 0.0;
    let totItcAvaliable = 0.0;
    let itcUtilized = 0.0;
    let closingITC = 0.0;

    for (let i = 0; i < itcLedgerData.length - 1; i++) {
      totOpeningBal +=
        itcLedgerData[i].openingBalance !== "" &&
        itcLedgerData[i].openingBalance !== null &&
        itcLedgerData[i].openingBalance !== undefined
          ? Number(parseFloat(itcLedgerData[i].openingBalance).toFixed(2))
          : 0.0;

      totItc +=
        itcLedgerData[i].itCearned !== "" &&
        itcLedgerData[i].itCearned !== null &&
        itcLedgerData[i].itCearned !== undefined
          ? Number(parseFloat(itcLedgerData[i].itCearned).toFixed(2))
          : 0.0;

      totItcAvaliable +=
        itcLedgerData[i].totalITCAvailable !== "" &&
        itcLedgerData[i].totalITCAvailable !== null &&
        itcLedgerData[i].totalITCAvailable !== undefined
          ? Number(parseFloat(itcLedgerData[i].totalITCAvailable).toFixed(2))
          : 0.0;

      itcUtilized +=
        itcLedgerData[i].itcUtilized !== "" &&
        itcLedgerData[i].itcUtilized !== null &&
        itcLedgerData[i].itcUtilized !== undefined
          ? Number(parseFloat(itcLedgerData[i].itcUtilized).toFixed(2))
          : 0.0;

      closingITC +=
        itcLedgerData[i].closingITC !== "" &&
        itcLedgerData[i].closingITC !== null &&
        itcLedgerData[i].closingITC !== undefined
          ? Number(parseFloat(itcLedgerData[i].closingITC).toFixed(2))
          : 0.0;
    }

    if (colName == "openingBalance") {
      hot.setSourceDataAtCell(4, colName, totOpeningBal, "");
    } else if (colName == "itCearned") {
      hot.setSourceDataAtCell(4, colName, totItc, "");
    } else if (colName == "totalITCAvailable") {
      hot.setSourceDataAtCell(4, colName, totItcAvaliable, "");
    } else if (colName == "itcUtilized") {
      hot.setSourceDataAtCell(4, colName, itcUtilized, "");
    }
    hot.setSourceDataAtCell(4, "closingITC", closingITC, "");
  };

  const itctheader = (col, TH) => {
    if (col > 0) {
      TH.className = "htRight";
    } else {
      TH.className = "htLeft";
    }
  };

  const cashtheader = (col, TH) => {
    if (col >= 0) {
      TH.className = "htRight";
    }
  };





  // ** ITC Calcution
  const itcPaidFunc = (row, col) => {

    let errorMsg = ""
    let errorShow = false;

    const hot = hotRef?.current?.hotInstance; // First grid
    const hotITC = hotRefITC?.current?.hotInstance; // second grid
    const hotCash = hotRefCash?.current?.hotInstance; // second grid

    var reverseChargeTaxPayableValue = hot?.getDataAtRowProp(row, 1);  // other than reverse charge tax payble
    var igstValue = hot?.getDataAtRowProp(row, 2) !== null &&   hot?.getDataAtRowProp(row, 2) != ""  ?  hot?.getDataAtRowProp(row, 2) : 0  ;  // IGST
    var cgstValue = hot?.getDataAtRowProp(row, 3) !== null && hot?.getDataAtRowProp(row, 3) !== "" ? hot?.getDataAtRowProp(row, 3) : 0 ;  // CGST
    let sgstValue = hot?.getDataAtRowProp(row, 4) !== null &&  hot?.getDataAtRowProp(row, 4) !== "" ?  hot?.getDataAtRowProp(row, 4) : 0 ;  // SGST
    let cessValue = hot?.getDataAtRowProp(row, 5) !== null && hot?.getDataAtRowProp(row, 5) !== "" ? hot?.getDataAtRowProp(row, 5) : 0 ;  // CESS

     //** Check Amount not greather then gst
     let checkGSTAmt =   Number(parseFloat(igstValue).toFixed(2)) +
     Number(parseFloat(cgstValue).toFixed(2)) +
     Number(parseFloat(sgstValue).toFixed(2)) +
     Number(parseFloat(cessValue).toFixed(2));



     let gstTotal =  Number(parseFloat(reverseChargeTaxPayableValue).toFixed(2)) - (
      (igstValue !== null &&  igstValue !== "" && igstValue !== undefined &&  !isNaN(igstValue) ?  Number(parseFloat(igstValue).toFixed(2)) : 0 )
      + (cgstValue !== null &&  cgstValue !== "" && cgstValue !== undefined &&  !isNaN(cgstValue) ?  Number(parseFloat(cgstValue).toFixed(2)) : 0 )
      +   (sgstValue !== null &&  sgstValue !== "" && sgstValue !== undefined &&  !isNaN(sgstValue) ?  Number(parseFloat(sgstValue).toFixed(2)) : 0 )
    +  (cessValue !== null &&  cessValue !== "" && cessValue !== undefined  &&  !isNaN(cessValue) ?  Number(parseFloat(cessValue).toFixed(2)) : 0 ));



     if ( Number(parseFloat(checkGSTAmt).toFixed(2)) < Number(parseFloat(reverseChargeTaxPayableValue).toFixed(2))  ) {
        errorShow = true;
        console.log("not valid amount")

        if (col == 2 ) {
          hot?.setSourceDataAtCell(row, 2, 0 , 0);
        } else if (col == 3) {
          hot?.setSourceDataAtCell(row, 3, 0 , 0);
        } else if (col == 4) {
          hot?.setSourceDataAtCell(row, 4, 0 , 0);
        } else if (col == 5 ) {
          hot?.setSourceDataAtCell(row, 5, 0 , 0);
        }
     } else {
      let setAmount =  gstTotal !== null && gstTotal !== "" && gstTotal !== undefined  &&  gstTotal !== null   ?   Number(parseFloat(gstTotal).toFixed(2))  : reverseChargeTaxPayableValue;
      hot?.setSourceDataAtCell(row, 6, setAmount , 0); // tax to be paid in cash
     }


     console.log(gstTotal, "gstTotalgstTotal")

     if (Number(gstTotal) < 0) {
      console.log(gstTotal, "gstTotalgstTotal -1")

      var igstValue = hot?.getDataAtRowProp(row, 2) !== null && hot?.getDataAtRowProp(row, 2) !== "" ? hot?.getDataAtRowProp(row, 2) : 0 ;  // IGST
      var cgstValue = hot?.getDataAtRowProp(row, 3) !== null &&  hot?.getDataAtRowProp(row, 3)  !== ""  ? hot?.getDataAtRowProp(row, 3) : 0 ;  // CGST
      let sgstValue = hot?.getDataAtRowProp(row, 4) !== null &&  hot?.getDataAtRowProp(row, 4) !== "" ?  hot?.getDataAtRowProp(row, 4) : 0 ;  // SGST
      let cessValue = hot?.getDataAtRowProp(row, 5) !== null && hot?.getDataAtRowProp(row, 5) !== "" ? hot?.getDataAtRowProp(row, 5) : 0 ;  // CESS

      let gstTotal1 =  Number(parseFloat(reverseChargeTaxPayableValue).toFixed(2)) - (
        (igstValue !== null &&  igstValue !== "" && igstValue !== undefined &&  !isNaN(igstValue) ?  Number(parseFloat(igstValue).toFixed(2)) : 0 )
        + (cgstValue !== null &&  cgstValue !== "" && cgstValue !== undefined &&  !isNaN(cgstValue) ?  Number(parseFloat(cgstValue).toFixed(2)) : 0 )
        +   (sgstValue !== null &&  sgstValue !== "" && sgstValue !== undefined &&  !isNaN(sgstValue) ?  Number(parseFloat(sgstValue).toFixed(2)) : 0 )
      +  (cessValue !== null &&  cessValue !== "" && cessValue !== undefined  &&  !isNaN(cessValue) ?  Number(parseFloat(cessValue).toFixed(2)) : 0 ));


      hot?.setSourceDataAtCell(row, 6,  Number(parseFloat(gstTotal1).toFixed(2)), 0); // tax to be paid in cash
     } else {
      let setAmount =  gstTotal !== null && gstTotal !== "" && gstTotal !== undefined  &&  gstTotal !== null   ?   Number(parseFloat(gstTotal).toFixed(2))  : reverseChargeTaxPayableValue;
      hot?.setSourceDataAtCell(row, 6, setAmount , 0); // tax to be paid in cash
     }
  }


  const CalcFunctionPaidITC = (row , col) => {
    // ** First Grid - Paid through ITC
    let errorMsg = ""
    let errorShow = false;

    const hot = hotRef?.current?.hotInstance; // First grid
    const hotITC = hotRefITC?.current?.hotInstance; // second grid
    const hotCash = hotRefCash?.current?.hotInstance; // second grid


    itcPaidFunc(row, col)


    //** Other then reverse charge tax to be paid in cash
    let othReverseTaxPaidCashValue = hot?.getDataAtRowProp(row, 6);

    //** Reverse charge tax to be paid in cash
    let reverseTaxPayableValue = hot?.getDataAtRowProp(row, 8);

    //**  late fee to be paid in cash
    let reverseTaxPaidCashValue = hot?.getDataAtRowProp(row, 12);

    //**  Total - Reverse charge
    let reverseAmntTotal =   Number(parseFloat(othReverseTaxPaidCashValue).toFixed(2)) +
     Number(parseFloat(reverseTaxPayableValue).toFixed(2)) +   Number(parseFloat(reverseTaxPaidCashValue).toFixed(2));

    // ** ITC Table/  Grid
    let newState = [...itcLedgerData];



      //**  Total tax to be paid in cash
      hot?.setSourceDataAtCell(row, 13, reverseAmntTotal ?? 0, 0);




    let totalTaxPaidInCase = hot?.getDataAtRowProp(row, 13) !== "" &&  hot?.getDataAtRowProp(row, 13) !== null ?  hot?.getDataAtRowProp(row, 13) : 0  ;   // Additional cash required
    let utilizatableCashBal = hot?.getDataAtRowProp(row, 14) !== "" && hot?.getDataAtRowProp(row, 14) !== null ? hot?.getDataAtRowProp(row, 14) : 0   ;  // Utilizatable cash balance



    hot?.setSourceDataAtCell(row , 15, (Number(parseFloat(utilizatableCashBal).toFixed(2)) -   Number(parseFloat(totalTaxPaidInCase).toFixed(2))) , 0 )


    // ** Second grid - update (ITC Utilized and Closing ITC)

    const itc1RowAmount = Number(parseFloat(hot?.getDataAtRowProp(0, 2)).toFixed(2)) +  Number(parseFloat(hot?.getDataAtRowProp(1, 2)).toFixed(2)) +
    Number(parseFloat(hot?.getDataAtRowProp(2, 2)).toFixed(2))  +   Number(parseFloat( hot?.getDataAtRowProp(3, 2)).toFixed(2));

    const itc2RowAmount =  Number(parseFloat(hot?.getDataAtRowProp(0, 4)).toFixed(2)) +  Number(parseFloat(hot?.getDataAtRowProp(1, 4)).toFixed(2)) +
    Number(parseFloat(hot?.getDataAtRowProp(2, 4)).toFixed(2))  +   Number(parseFloat(hot?.getDataAtRowProp(3, 4)).toFixed(2));

    const itc3RowAmount =  Number(parseFloat(hot?.getDataAtRowProp(0, 3)).toFixed(2)) +  Number(parseFloat(hot?.getDataAtRowProp(1, 3)).toFixed(2)) +
    Number(parseFloat(hot?.getDataAtRowProp(2, 3)).toFixed(2))  +   Number(parseFloat( hot?.getDataAtRowProp(3, 3)).toFixed(2)) ;;

    const itc4RowAmount = Number(parseFloat( hot?.getDataAtRowProp(0, 5)).toFixed(2)) +   Number(parseFloat(hot?.getDataAtRowProp(1, 5)).toFixed(2)) +
    Number(parseFloat(hot?.getDataAtRowProp(2, 5)).toFixed(2)) +  Number(parseFloat(hot?.getDataAtRowProp(3, 5)).toFixed(2));



     // ** ITC Utilized
     //** Total ITC Available
     let itcAvaiableIGST = itc1RowAmount !== null && itc1RowAmount !== "" && itc1RowAmount !== undefined && !isNaN(itc1RowAmount)  ? itc1RowAmount : 0  ;
     let itcAvaiableCGST = itc2RowAmount !== null && itc2RowAmount !== "" && itc2RowAmount !== undefined && !isNaN(itc2RowAmount)   ? itc2RowAmount : 0  ;
     let itcAvaiableSGST = itc3RowAmount !== null && itc3RowAmount !== "" && itc3RowAmount !== undefined && !isNaN(itc3RowAmount)  ? itc3RowAmount : 0  ;
     let itcAvaiableCESS = itc4RowAmount !== null && itc4RowAmount !== "" && itc4RowAmount !== undefined && !isNaN(itc4RowAmount)  ? itc4RowAmount : 0  ;


     console.log(itcAvaiableIGST ,  itcAvaiableCGST,  itcAvaiableSGST , itcAvaiableCESS , "itcAvaiableCESS" )

      // ** Total ITC Avaiable


      if ( Number(parseFloat(itcAvaiableIGST).toFixed(2)) >  Number(parseFloat(newState[0].totalITCAvailable).toFixed(2)) ) {
          hot?.setSourceDataAtCell(row, col , 0 , 0);
      }

      if (   Number(parseFloat(itcAvaiableCGST).toFixed(2)) >    Number(parseFloat(newState[1].totalITCAvailable ).toFixed(2)) ) {
        hot?.setSourceDataAtCell(row, col , 0 , 0);
      }

      if (  Number(parseFloat(itcAvaiableSGST).toFixed(2)) >   Number(parseFloat(newState[2].totalITCAvailable ).toFixed(2)) ) {
        hot?.setSourceDataAtCell(row, col , 0 , 0);
      }

      if (   Number(parseFloat(itcAvaiableCESS).toFixed(2)) >   Number(parseFloat(newState[3].totalITCAvailable ).toFixed(2)) ) {
        hot?.setSourceDataAtCell(row, col , 0 , 0);
      }

      itcPaidFunc(row, col)



      const itc1RowAmount1 = Number(parseFloat(hot?.getDataAtRowProp(0, 2) ).toFixed(2)) +  Number(parseFloat(hot?.getDataAtRowProp(1, 2)).toFixed(2)) +
      Number(parseFloat(hot?.getDataAtRowProp(2, 2)).toFixed(2))  +   Number(parseFloat( hot?.getDataAtRowProp(3, 2)).toFixed(2));

      const itc2RowAmount1 =  Number(parseFloat(hot?.getDataAtRowProp(0, 4)).toFixed(2)) +  Number(parseFloat(hot?.getDataAtRowProp(1, 4)).toFixed(2)) +
      Number(parseFloat(hot?.getDataAtRowProp(2, 4)).toFixed(2))  +   Number(parseFloat(hot?.getDataAtRowProp(3, 4)).toFixed(2));

      const itc3RowAmount1 =  Number(parseFloat(hot?.getDataAtRowProp(0, 3)).toFixed(2)) +  Number(parseFloat(hot?.getDataAtRowProp(1, 3)).toFixed(2)) +
      Number(parseFloat(hot?.getDataAtRowProp(2, 3)).toFixed(2))  +   Number(parseFloat( hot?.getDataAtRowProp(3, 3)).toFixed(2)) ;

      const itc4RowAmount1 = Number(parseFloat( hot?.getDataAtRowProp(0, 5)).toFixed(2)) +   Number(parseFloat(hot?.getDataAtRowProp(1, 5)).toFixed(2)) +
      Number(parseFloat(hot?.getDataAtRowProp(2, 5)).toFixed(2)) +  Number(parseFloat(hot?.getDataAtRowProp(3, 5)).toFixed(2));

      console.log(itc1RowAmount1 , itc2RowAmount1 , itc3RowAmount1 ,  itc4RowAmount1 , "itc4RowAmount1itc4RowAmount1")




    newState[0].itcUtilized = itc1RowAmount1 != null && itc1RowAmount1 != "" && itc1RowAmount1 != undefined &&  !isNaN(itc1RowAmount1)  ? Number(parseFloat(itc1RowAmount1).toFixed(2))    : 0;
    newState[1].itcUtilized = itc2RowAmount1 !== null && itc2RowAmount1 !== "" && itc2RowAmount1 !== undefined && !isNaN(itc2RowAmount1) ?   Number(parseFloat(itc2RowAmount1).toFixed(2)) : 0;
    newState[2].itcUtilized = itc3RowAmount1  !== null && itc3RowAmount1 !== "" && itc3RowAmount1 !== undefined && !isNaN(itc3RowAmount1)  ?   Number(parseFloat(itc3RowAmount1).toFixed(2)) : 0;
    newState[3].itcUtilized = itc4RowAmount1  !== null && itc4RowAmount1 !== "" && itc4RowAmount1 !== undefined && !isNaN(itc4RowAmount1)  ?   Number(parseFloat(itc4RowAmount1).toFixed(2))  : 0;


     // ** Closing ITC
    let itcClosingIGSTAmount =    Number(parseFloat(newState[0].totalITCAvailable ).toFixed(2)) -  (itc1RowAmount1 !== null && itc1RowAmount1 !== "" && itc1RowAmount1 !== undefined && !isNaN(itc1RowAmount1) ?  Number(parseFloat(itc1RowAmount1).toFixed(2)) : 0 ) ;
    let itcClosingCGSTAmount =    Number(parseFloat( newState[1].totalITCAvailable ).toFixed(2)) -  (itc2RowAmount1 !== null && itc2RowAmount1 !== "" && itc2RowAmount1 !== undefined && !isNaN(itc2RowAmount1)  ?  Number(parseFloat(itc2RowAmount1).toFixed(2)) : 0 ) ;
    let itcClosingSGSTAmount =     Number(parseFloat(newState[2].totalITCAvailable ).toFixed(2))  -  (itc3RowAmount1 !== null && itc3RowAmount1 !== "" && itc3RowAmount1 !== undefined && !isNaN(itc3RowAmount1)  ?  Number(parseFloat(itc3RowAmount1).toFixed(2)) : 0 );
    let itcClosingCESSAmount =    Number(parseFloat( newState[3].totalITCAvailable ).toFixed(2))  -  (itc4RowAmount1 !== null && itc4RowAmount1 !== "" && itc4RowAmount1 !== undefined  && !isNaN(itc4RowAmount1) ?  Number(parseFloat(itc4RowAmount1).toFixed(2))  : 0 );



    console.log(itcClosingIGSTAmount,  itcClosingCGSTAmount , itcClosingSGSTAmount , itcClosingCESSAmount , "itcClosingCESSAmountitcClosingCESSAmount")

    if ( Number(itcClosingIGSTAmount) < 0) {
      itcClosingIGSTAmount = 0
    }

    if (  Number(itcClosingCGSTAmount) < 0) {
      itcClosingCGSTAmount = 0
    }

    if (Number(itcClosingSGSTAmount) < 0) {
      itcClosingSGSTAmount = 0
    }

    if (Number(itcClosingCESSAmount) < 0) {
      itcClosingCESSAmount = 0
    }

     newState[0].closingITC =  itcClosingIGSTAmount !== null && itcClosingIGSTAmount !== "" && itcClosingIGSTAmount !== undefined &&  !isNaN(itcClosingIGSTAmount)  ?  Number(parseFloat(itcClosingIGSTAmount).toFixed(2)) : 0  ;
     newState[1].closingITC =   itcClosingCGSTAmount !==  null && itcClosingCGSTAmount !== "" &&  itcClosingCGSTAmount !== undefined &&  !isNaN(itcClosingCGSTAmount)  ?   Number(parseFloat(itcClosingCGSTAmount).toFixed(2)) : 0 ;
     newState[2].closingITC =  itcClosingSGSTAmount  !==  null &&  itcClosingSGSTAmount !== "" && itcClosingSGSTAmount !== undefined  &&  !isNaN(itcClosingSGSTAmount)   ?  Number(parseFloat(itcClosingSGSTAmount).toFixed(2))  : 0 ;
     newState[3].closingITC =   itcClosingCESSAmount !== null && itcClosingCESSAmount !== "" && itcClosingCESSAmount !== undefined  &&  !isNaN(itcClosingCESSAmount)   ?    Number(parseFloat(itcClosingCESSAmount).toFixed(2)) : 0 ;

     newState[4].closingITC =  Number(itcClosingIGSTAmount) +   Number(parseFloat(itcClosingCGSTAmount).toFixed(2)) +
     Number(parseFloat(itcClosingSGSTAmount).toFixed(2)) +  Number(parseFloat(itcClosingCESSAmount).toFixed(2))

    setItcLedgerData(newState)

  }

  const cellChangeEligible = (change, source) => {
    if(source === "CopyPaste.paste") document.body.classList.add("is-copy");

    if (source === "CopyPaste.paste" ||
      source === "edit" ||
      source === "Autofill.fill") {


      const hot = hotRef?.current?.hotInstance;
      let withoutErrArr = [];

      change.forEach(([row, col, oldValue, newValue]) => {
        if(row <= 5){
        const sanitizedValue = typeof newValue === 'string' ? newValue.replace(/,/g, '') : newValue;
        if(oldValue != newValue){
        if (col == 2  || col == 3 || col ==4 ) {
            hot?.setDataAtRowProp(row, hot?.colToProp(col), sanitizedValue);
        }
      }
      // The value to set Error
      const colIndex = col

      if (
        colIndex == 1 ||
        colIndex == 2 ||
        colIndex == 3 ||
        colIndex == 4 ||
        colIndex == 5
      ) {
        // const oldVal = change[i][2];
        const cellObj = {
          row: row,
          col: colIndex,
          table: "Paid Through ITC Table",
        };
        // Check if the edited value is numeric
        if (isNaN(sanitizedValue)) {
          setErrorArr((pre) => [...pre, cellObj]);
        } else {
          if (
            errorArr.findIndex(
              (y) =>
                y.row == cellObj.row &&
                y.col == cellObj.col &&
                y.table == cellObj.table
            ) != -1
          ) {
            withoutErrArr.push(cellObj);
          }
        }
      }
    }
      });


      if (withoutErrArr.length > 0) {
        const withErrArr = errorArr;
        const filteredArr = withErrArr.filter(
          (itemX) =>
            !withoutErrArr.some(
              (itemY) =>
                itemY.row === itemX.row &&
                itemY.col === itemX.col &&
                itemY.table === itemX.table
            )
        );
        setErrorArr(filteredArr);
      }


      var row = change[0][0];
      var col = change[0][1];
      var newValue = change[0][3];

      if(itcLedgerData?.length > 0 && itcLedgerData != undefined && itcLedgerData != null){
        CalcFunctionPaidITC(row , col )
      }

     // }
    }




    // if (source !== "loadData" && change && change.length > 0) {
    //   for (const [row, col, oldValue, newValue] of change) {
    //     if (row === 2 && col == 2) {
    //       const initialValue = !Number.isNaN(parseFloat(
    //         hotRef?.current?.hotInstance?.getDataAtCell(row, 2)
    //       )) ? hotRef?.current?.hotInstance?.getDataAtCell(row, 2): hotRef?.current?.hotInstance?.setDataAtCell(
    //         row,
    //         2,
    //         "0"
    //       );
    //     }
    //     if (row === 1 && col == 2) {
    //       const initialValue = !Number.isNaN(parseFloat(
    //         hotRef?.current?.hotInstance?.getDataAtCell(row, 2)
    //       )) ? hotRef?.current?.hotInstance?.getDataAtCell(row, 2): hotRef?.current?.hotInstance?.setDataAtCell(
    //         row,
    //         2,
    //         "0"
    //       );
    //     }
    //   }
    // }
  }


  // ** Paid Through ITC  - First Grid set zero
  const paidThroghITCTableSetValue = () => {
    const hot = hotRef?.current?.hotInstance; // First grid
    const hotCash = hotRefCash?.current?.hotInstance; // First grid

    // hot?.setSourceDataAtCell(0, 2, 0, 0);
    // hot?.setSourceDataAtCell(0, 3, 0, 0);
    // hot?.setSourceDataAtCell(0, 4, 0, 0);
    // hot?.setSourceDataAtCell(0, 5, 0, 0);

    // hot?.setSourceDataAtCell(1, 2, 0, 0);
    // hot?.setSourceDataAtCell(1, 3, 0, 0);
    // hot?.setSourceDataAtCell(1, 4, 0, 0);
    // hot?.setSourceDataAtCell(1, 5, 0, 0);

    // hot?.setSourceDataAtCell(2, 2, 0, 0);
    // hot?.setSourceDataAtCell(2, 3, 0, 0);
    // hot?.setSourceDataAtCell(2, 4, 0, 0);
    // hot?.setSourceDataAtCell(2, 5, 0, 0);

    // hot?.setSourceDataAtCell(3, 2, 0, 0);
    // hot?.setSourceDataAtCell(3, 3, 0, 0);
    // hot?.setSourceDataAtCell(3, 4, 0, 0);
    // hot?.setSourceDataAtCell(3, 5, 0, 0);


    let igstCashLedger = hotCash?.getDataAtRowProp(0, 0) !== null && hotCash?.getDataAtRowProp(0, 0) !== "" ? hotCash?.getDataAtRowProp(0, 0) : 0  ;
    let cgstCashLedger = hotCash?.getDataAtRowProp(0, 1) !== null &&  hotCash?.getDataAtRowProp(0, 1) !==  "" ?  hotCash?.getDataAtRowProp(0, 1) : 0 ;
    let sgstCashLedger = hotCash?.getDataAtRowProp(0, 2) !== null &&  hotCash?.getDataAtRowProp(0, 2) !== null  ?  hotCash?.getDataAtRowProp(0, 2) : 0 ;
    let cessCashLedger = hotCash?.getDataAtRowProp(0, 3) !== null &&  hotCash?.getDataAtRowProp(0, 3) !== null ? hotCash?.getDataAtRowProp(0, 3) : 0

    // let newState = [...cashLedgerData];

    // let igstCashLedger = newState[0].igst ;
    // let cgstCashLedger = newState[0].cgst;
    // let sgstCashLedger = newState[0].sgst;
    // let cessCashLedger = newState[0].cess;


     //**
     let  totTaxPaidInCashIGST = hot?.getDataAtRowProp(0, 13) !== "" &&   hot?.getDataAtRowProp(0, 13) !== null ?  hot?.getDataAtRowProp(0, 13) : 0 ;
     let  totTaxPaidInCashCGST = hot?.getDataAtRowProp(1, 13) !== "" &&   hot?.getDataAtRowProp(1, 13) !== null ?  hot?.getDataAtRowProp(1, 13) : 0 ;
     let  totTaxPaidInCashSGST = hot?.getDataAtRowProp(2, 13) !== "" &&   hot?.getDataAtRowProp(2, 13) !== null ?  hot?.getDataAtRowProp(2, 13) : 0 ;
     let  totTaxPaidInCashCESS = hot?.getDataAtRowProp(3, 13) !== "" &&   hot?.getDataAtRowProp(3, 13) !== null ?  hot?.getDataAtRowProp(3, 13) : 0 ;




    hot?.setSourceDataAtCell(0, 14, igstCashLedger ?? 0  , 0);  // IGST
    hot?.setSourceDataAtCell(1, 14, sgstCashLedger ?? 0 , 0);   // SGST (swapped into CGST)
    hot?.setSourceDataAtCell(2, 14, cgstCashLedger ?? 0, 0);    // CGST (swapped into SGST)
    hot?.setSourceDataAtCell(3, 14, cessCashLedger ?? 0 , 0);  // cess

    hot?.setSourceDataAtCell(0, 15,  (totTaxPaidInCashIGST - (igstCashLedger ?? 0 )) , 0);  // IGST
    hot?.setSourceDataAtCell(1, 15,  (totTaxPaidInCashCGST -  (sgstCashLedger ?? 0)), 0);   // CGST
    hot?.setSourceDataAtCell(2, 15,  (totTaxPaidInCashSGST -  (cgstCashLedger ?? 0)) , 0);    // SGST
    hot?.setSourceDataAtCell(3, 15,  (totTaxPaidInCashCESS -  (cessCashLedger ?? 0)), 0);  // cess


  }


  // ** Manual Entry button
  const onClickManualEntry = () => {
    setManualEntry(true)
      // if (manualTitle ==  "Auto" ) {
      //   GetAllData();
      // } {
        paidThroghITCTableSetValue();
      // }

      setIsCheck(true)

      // setManualEntry(prevTitle => (prevTitle == true ? false : true));
      // setManualTitle(prevTitle => (prevTitle == "Auto" ? "Manual" : "Auto"));

  }



  return (
    <Fragment>
      <style>{`.gstr3bHeading{font-size: 14px !important; font-weight:bold}`}</style>
      {block && <div className="loading1">Loading&#8230;</div>}
      <div className="content-header row py-1">
        <div className="content-header-left col-md-8 col-12">
          <div className="row breadcrumbs-top">
            <div className="col-12">
              <Breadcrumbs
                title="Purchase Summary"
                data={[
                  { title: "GST Returns",link: urlEndpointConfig.GSTR_All },
                  { title: "GSTR-3B Summary", link: "/gst-returns/gstr3b" },
                  { title: "Computation" },
                ]}
              />



            </div>
          </div>
        </div>
        <div className="content-header-right text-md-end col-md-4 col-12 d-md-block d-none">

        <Button
            className="btn-icon me-1"
            outline
            color="danger"
            id="btnGetGSTR3BComptManual"
            disabled={disableText}
            onClick={() => onClickManualEntry("manual")} >

            <Edit size={14} />
            <span className="align-middle ms-50">Manual</span>
          </Button>

          <UncontrolledTooltip placement="top" target="btnGetGSTR3BComptManual">
              Manual Calculation of ITC Set off
          </UncontrolledTooltip>

          {/* <Button
            className="btn-icon me-1"
            outline
            color="danger"
            id="btnGetGSTR3BComptAuto"
            onClick={() => onClickManualEntry("auto")} >
            <File size={14} />
            <span className="align-middle ms-50">Auto</span>
          </Button> */}

          <Button
            className="btn-icon me-1"
            outline
            color="danger"
            id="btnGetGSTR3BComputationOfTax"
            onClick={GetAllData}
            // disabled={errorArr.length>0}
            >
            <Download size={14} />
            <span className="align-middle ms-50"> Get Data </span>
          </Button>
          <Button
            className="btn-icon me-1"
            outline
            color="danger"
            id="btnSaveGSTR3B"
            onClick={onClickSaveButtonOfPaymentPage}
           //  disabled={true}
          >
            <FilePlus size={14} />
            <span className="align-middle ms-50">
              {" "}
              Save
            </span>
          </Button>
          <UncontrolledTooltip placement="top" target="btnSaveGSTR3B">
            Save [Shortcut: {keysMap.SAVE_DATA} ]
          </UncontrolledTooltip>


        </div>
      </div>

      <div className="content-header-left col-md-12 col-12">
        <div className="row breadcrumbs-top mb-1">
          <div className="col-md-6">

          {
                  isCheck == true  &&  <Alert color='danger'>
                  <div className='alert-body'>
                    <AlertCircle size={12} />{' '}
                    <span className='ms-0'>
                    Click on Get data again for Auto ITC set off.
                    </span>
                  </div>
                </Alert>
                  }


          </div>
          <div className="col-md-6">

            <div className="row">
              <div className="col-md-12">
                <div className="row">
                  <div className="col-md-5"></div>
              <Label className="form-label col-md-4 pt-half text-end">
                 Return Period
              </Label>
              <Select
                id="to"
                placeholder="To"
                isClearable={false}
                theme={selectThemeColors}
                closeMenuOnSelect={true}
                isDisabled={true}
                options={panData}
                components={animatedComponents}
                className="basic-multi-select col-md-3 ps-0"
                classNamePrefix="select"
                onChange={selectFromMonth}
                value={monthFrom}
                maxMenuHeight={SELECT_MAXSIZE}
              />
              </div>
              </div>
            </div>

          </div>
        </div>
      </div>
      <Row className="mb-3">
        <Col>
          <HotTable
            //  columns =  {computationColumns}
            data={computationData}
            rowHeights={RowSize}
            columnHeaderHeight={columnHeaderSize}
            ref={hotRef}
            stretchH="all"
            height="auto"
            colHeaders={true}
            selectionMode={"single"}
            beforeKeyDown={function (e, col) {
              // Delete and Backspace , copy and paste
              if (
                e.keyCode == 8 ||
                e.keyCode == 46 ||
                e.keyCode == 67 ||
                e.keyCode == 86
              ) {
              } else {
                var reg = /^[0-9.]+|[\b]+$/;
                let col = this?.getSelectedLast()[1];
                if (
                  col == 1 ||
                  col == 2 ||
                  col == 3 ||
                  col == 4 ||
                  col == 5 ||
                  col == 6
                ) {
                  if (!reg.test(e.key)) {
                    e.preventDefault();
                  }
                }
              }
            }}
            afterRenderer={(TD, row, col, prop, value) => {
              if (
                (col == 1 ||
                  col == 2 ||
                  col == 3 ||
                  col == 4 ||
                  col == 5) &&
                errorArr.findIndex(
                  (y) =>
                    y.row == row &&
                    y.col == col
                    // y.table == "Paid Through ITC Table"
                ) != -1 &&
                block === false && value
              ) {
                TD.style.backgroundColor = "red";
              }
            }}
            nestedHeaders={nestHed}
            cells={function (row, col) {
              var cp = {};
              const hot = hotRefITC?.current?.hotInstance;

              cp.type = "numeric"
              cp.numericFormat =  {
                pattern: '0,0.00',
                culture: 'en-IN'
            }

              if (col > 0) {
                cp.className = "text-end";
                cp.readOnly = true;



              }
              if (col == 0) {
                cp.readOnly = true;
              }
              if(col ==5){
                if(row ==0 || row==1 || row ==2){
                  cp.className = "purchseCellDisable text-end";
                  cp.readOnly = true;
                }

                if (manualEntry == true) {
                  if (row == 3) {

                    cp.readOnly = false;
                  }
                }

              }
              if(col ==4){
                if(row==1 || row ==3){
                  cp.className = "purchseCellDisable text-end";
                  cp.readOnly = true;
                }

                if (manualEntry == true) {
                  if(row==0  || row == 2){
                    cp.readOnly = false;
                  }
                }

              }
              if(col ==3){
                if(row==2 || row ==3 ){
                  cp.className = "purchseCellDisable text-end";
                  cp.readOnly = true;
                }
                if (manualEntry == true) {
                  if(row==0 || row ==1 ){
                    cp.readOnly = false;
                  }
                }
              }
              if(col ==2){
                if(row ==3){
                  cp.className = "purchseCellDisable text-end";
                  cp.readOnly = true;
                }
              }
              if(col ==2){
                if (manualEntry == true) {
                  if(row ==2 || row == 1 ||   row == 0 ){
                    cp.readOnly = false;
                  }
                } else {
                  if(row ==2 || row ==1){

                    cp.readOnly = true;
                  }
                }

              }

              return cp;
            }}
            afterChange={(x, y) => cellChangeEligible(x, y)}
            beforeCreateRow={function (index, amount) {
              let countRow = this?.countRows();
              if (this?.isEmptyRow(countRow - 0)) {
                return false;
              }
              return true;
            }}
            licenseKey="non-commercial-and-evaluation"
          />
        </Col>
      </Row>

      <div>
        <h2 className="gstr3bHeading">ITC Ledger</h2>
        <Row className="mb-3">
          <Col>
            <HotTable
              ref={hotRefITC}
              rowHeights={RowSize}
              columnHeaderHeight={columnHeaderSize}
              columns={itcLedgerColumns}
              data={itcLedgerData}
              readOnly={false}
              stretchH="all"
              height="auto"
              colHeaders={true}
              selectionMode={"single"}
              afterGetColHeader={itctheader}
              licenseKey="non-commercial-and-evaluation"
              afterChange={CellValueOnBeforeChange}
              beforeCreateRow={function (index, amount) {
                let countRow = this?.countRows();
                if (this?.isEmptyRow(countRow - 0)) {
                  return false;
                }
                return true;
              }}
              cells={function (row, col) {
                var cp = {};
                const hot = hotRefITC?.current?.hotInstance;
                if (row == 4) {
                  if(col == 0 ){
                    cp.className = "purchseCellDisable";
                    cp.readOnly = true;
                  }
                }
                if (col > 0) {
                  cp.className = "text-end";
                  cp.readOnly = true;
                }
                if (row === itcLedgerData?.length - 1) {
                  if (col > 0) {
                    cp.className = "disabledFill text-end"
                    cp.className = "purchseCellDisable text-end";
                  }
                }
                return cp;
              }}
              beforeKeyDown={function (e, col) {
                // Delete and Backspace , copy and paste
                if (
                  e.keyCode == 8 ||
                  e.keyCode == 46 ||
                  e.keyCode == 67 ||
                  e.keyCode == 86
                ) {
                } else {
                  var reg = /^[0-9.]+|[\b]+$/;
                  let col = this?.getSelectedLast()[1];

                  if (
                    col == 1 ||
                    col == 2 ||
                    col == 3 ||
                    col == 4 ||
                    col == 5
                  ) {
                    if (!reg.test(e.key)) {
                      e.preventDefault();
                    }
                  }
                }
              }}
            />
          </Col>
        </Row>
      </div>
      <div>
        <h2 className="gstr3bHeading">Cash Ledger</h2>
        <Row>
          <Col>
            <HotTable
              readOnly={true}
              ref={hotRefCash}
              rowHeights={RowSize}
              columnHeaderHeight={columnHeaderSize}
              columns={cashLedgerColumns}
              data={cashLedgerData}
              afterGetColHeader={cashtheader}
              stretchH="all"
              height="auto"
              selectionMode={"single"}
              colHeaders={true}
              licenseKey="non-commercial-and-evaluation"
              beforeCreateRow={function (index, amount) {
                let countRow = this?.countRows();
                if (this?.isEmptyRow(countRow - 0)) {
                  return false;
                }
                return true;
              }}
              cells={function (row, col) {
                var cp = {};
                const hot = hotRefITC?.current?.hotInstance;
                if (col >= 0) {
                  cp.className = "text-end";
                  cp.readOnly = true;
                }
                return cp;
              }}
            />
          </Col>
        </Row>
      </div>
      <VerificationModal composeOpen={composeOpen} toggleCompose={toggleCompose1} userClientIds={G_UCParId}
        messageDisplay={msgDisplay}  otpGSTIN={G_GSTIN}

      ></VerificationModal>
    </Fragment>
  );
};

function ErrorTable({ errorDataList }) {
  //   console.log(errorDataList , 'errorDataList')
  const uniqueArray = [];
  const keys = new Set();

  for (const obj of errorDataList) {
    const key = JSON.stringify(obj);
    if (!keys.has(key)) {
      keys.add(key);
      uniqueArray.push(obj);
    }
  }

  const itemList =
    uniqueArray &&
    uniqueArray.map((item, i) => {
      console.log(item,"iteeemmmmm")
      return(
      <tr>
        <td>{i + 1}</td>
        <td>{item.table}</td>
        <td>{item.row + 1}</td>
        <td>Only Numeric Value Allowed</td>
      </tr>
    )});

  return (
    <div className="errorTable_container">
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Sr No</th>
            <th>Table</th>
            <th>Row Number</th>
            <th>Error</th>
          </tr>
        </thead>
        <tbody>{itemList}</tbody>
      </Table>
    </div>
  );
}

export default computationtax;
