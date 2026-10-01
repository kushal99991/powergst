import React, { useState } from "react";
import { Fragment, useRef } from "react";
import {
  Button,
  Col,
  Label,
  Row,
  Card,
  CardBody,
  UncontrolledTooltip,
  Badge
} from "reactstrap";
import { HotTable } from "@handsontable/react";
import { selectThemeColors } from "@utils";
import Select from "react-select";
import {
  RowSize,
  SELECT_MAXSIZE,
  columnHeaderSize,
  keysMap,
  enableOnFormTags,
  RowSizeLarge,
} from "@configs/config";
import Breadcrumbs from "@components/breadcrumbs";
import { registerAllModules } from "handsontable/registry";
import { registerRenderer, textRenderer } from "handsontable/renderers";
import { globleVariable } from "../../../../configs/globalVariable";
import LocalFunction from "../../../../configs/getLocalFunction";
import SessionFunction from "../../../../configs/getSessionFunction";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { downloadURL } from "@helper/downloadUrl";
import errorCodeConfig from "../../../../configs/apiErrorCodeConfig";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { useHotkeys } from "react-hotkeys-hook";
import PanGSTR3BvsGSTR1 from "../../../../services/panGstr3bvsGstr1Reports/service";
import { urlEndpointConfig } from "@configs/urlEndpoint";
import {
  proceesDataForExpandedColumns,
  proceesData,
} from "./functionalityToGetData";
import makeAnimated from "react-select/animated";
import gstr3bvs2bvsbooksData from "../gstr1vs3bvsSalesReport/gstr1vs3bvsSalesReport";

const animatedComponents = makeAnimated();

const Pangstr3bvsgstr1vsPurchaseData = () => {

  const [block, setBlock] = useState(false);
  const [searchApi, setSearchApi] = useState(false);
  const [data, setData] = useState([]);
  const [dataExpandable, setDataExpandable] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [searchDate, setSearchDate] = useState(null);
  const [showExpandColumns, setShowExpandColumns] = useState(false);
  const [showExpandRows, setShowExpandRows] = useState(false);
  const [showExpandRows1, setShowExpandRows1] = useState(false);
  const [allData, setAllData] = useState([]);
  const [options, setOptions] = useState([]);
  const [value, setValue] = useState([]);
  const [lastGeneratedDate , setLastGeneratedDate] = useState(false)

  const hotRef = useRef(null);
  const hotRef1 = useRef(null);

  const navigate = useNavigate();

  const collapseFunction = () => {
    setTimeout(() => {
      const hotMatching = hotRef?.current?.hotInstance;
      hotMatching?.getPlugin("nestedRows")?.collapsingUI.collapseAll();
    }, 300);
  };

  const collapseFunction1 = () => {
    setTimeout(() => {
      const hotMatching = hotRef1?.current?.hotInstance;
      hotMatching?.getPlugin("nestedRows")?.collapsingUI.collapseAll();
    }, 300);
  };

  let defaultYear = null;
  // const word =  selectedYear?.label !=null && selectedYear?.label != undefined ? selectedYear?.label: "2023-2024"
  const word =
    selectedYear?.label ??
    sessionStorage.getItem("combinationYear") ??
    "2023-2024";
  const [startYear, endYear] =
    word != undefined && word != null && word?.split("-");

    const rowWidth = '130px'

  const column = [
    {
      data: "description",
      title: "Description",
    },
    {
      data: `Total${startYear}`,
      title: `Total`,
      width: rowWidth
    },
    {
      data: `monthFormApril${startYear}`,
      title: `April-${startYear}`,
      width: rowWidth
    },
    {
      data: `monthFormMay${startYear}`,
      title: `May-${startYear}`,
      width: rowWidth
    },
    {
      data: `monthFormJune${startYear}`,
      title: `June-${startYear}`,
      width: rowWidth
    },
    {
      data: `monthFormJuly${startYear}`,
      title: `July-${startYear}`,
      width: rowWidth
    },
    {
      data: `monthFormAug${startYear}`,
      title: `Aug-${startYear}`,
      width: rowWidth
    },
    {
      data: `monthFormSept${startYear}`,
      title: `Sept-${startYear}`,
      width: rowWidth
    },
    {
      data: `monthFormOct${startYear}`,
      title: `Oct-${startYear}`,
      width: rowWidth
    },
    {
      data: `monthFormNov${startYear}`,
      title: `Nov-${startYear}`,
      width: rowWidth
    },
    {
      data: `monthFormDec${startYear}`,
      title: `Dec-${startYear}`,
      width: rowWidth
    },
    {
      data: `monthFormJan${endYear}`,
      title: `Jan-${endYear}`,
      width: rowWidth
    },
    {
      data: `monthFormFeb${endYear}`,
      title: `Feb-${endYear}`,
      width: rowWidth
    },
    {
      data: `monthFormMarch${endYear}`,
      title: `March-${endYear}`,
      width: rowWidth
    },
  ];

  const column1 = [
    {
      data: "description",
      title: "Description",
    },
    {
      data: `Total${startYear}`,
      title: `Total Tax`,
      width: rowWidth
    },
    {
      data: `monthFormTotTaxableValue${startYear}`,
      title: `TaxableValue`,
      width: rowWidth
    },
    {
      data: `monthFormTotIGST${startYear}`,
      title: `IGST`,
      width: rowWidth
    },
    {
      data: `monthFormTotCGST${startYear}`,
      title: `CGST`,
      width: rowWidth
    },
    {
      data: `monthFormTotSGST${startYear}`,
      title: `SGST`,
      width: rowWidth
    },
    {
      data: `monthFormTotCESS${startYear}`,
      title: `CESS`,
      width: rowWidth
    },
    {
      data: `monthFormAprilTotalTax${startYear}`,
      title: `Total tax`,
      width: rowWidth
    },
    {
      data: `monthFormAprilTaxableValue${startYear}`,
      title: `TaxableValue`,
      width: rowWidth
    },
    {
      data: `monthFormAprilIGST${startYear}`,
      title: `IGST`,
      width: rowWidth
    },
    {
      data: `monthFormAprilCGST${startYear}`,
      title: `CGST`,
      width: rowWidth
    },
    {
      data: `monthFormAprilSGST${startYear}`,
      title: `SGST`,
      width: rowWidth
    },
    {
      data: `monthFormAprilCESS${startYear}`,
      title: `CESS`,
      width: rowWidth
    },
    {
      data: `monthFormMayTotalTax${startYear}`,
      title: `Total Tax`,
      width: rowWidth
    },
    {
      data: `monthFormMayTaxableValue${startYear}`,
      title: `TaxableValue`,
      width: rowWidth
    },
    {
      data: `monthFormMayIGST${startYear}`,
      title: `IGST`,
      width: rowWidth
    },
    {
      data: `monthFormMayCGST${startYear}`,
      title: `CGST`,
      width: rowWidth
    },
    {
      data: `monthFormMaySGST${startYear}`,
      title: `SGST`,
      width: rowWidth
    },
    {
      data: `monthFormMayCESS${startYear}`,
      title: `CESS`,
      width: rowWidth
    },
    {
      data: `monthFormJuneTotalTax${startYear}`,
      title: `Total Tax`,
      width: rowWidth
    },
    {
      data: `monthFormJuneTaxableValue${startYear}`,
      title: `TaxableValue`,
      width: rowWidth
    },
    {
      data: `monthFormJuneIGST${startYear}`,
      title: `IGST`,
      width: rowWidth
    },
    {
      data: `monthFormJuneCGST${startYear}`,
      title: `CGST`,
      width: rowWidth
    },
    {
      data: `monthFormJuneSGST${startYear}`,
      title: `SGST`,
      width: rowWidth
    },
    {
      data: `monthFormJuneCESS${startYear}`,
      title: `CESS`,
      width: rowWidth
    },
    {
      data: `monthFormJulyTotalTax${startYear}`,
      title: `Total Tax`,
      width: rowWidth
    },
    {
      data: `monthFormJulyTaxableValue${startYear}`,
      title: `TaxableValue`,
      width: rowWidth
    },
    {
      data: `monthFormJulyIGST${startYear}`,
      title: `IGST`,
      width: rowWidth
    },
    {
      data: `monthFormJulyCGST${startYear}`,
      title: `CGST`,
      width: rowWidth
    },
    {
      data: `monthFormJulySGST${startYear}`,
      title: `SGST`,
      width: rowWidth
    },
    {
      data: `monthFormJulyCESS${startYear}`,
      title: `CESS`,
      width: rowWidth
    },
    {
      data: `monthFormAugTotalTax${startYear}`,
      title: `Total Tax`,
      width: rowWidth
    },
    {
      data: `monthFormAugTaxableValue${startYear}`,
      title: `TaxableValue`,
      width: rowWidth
    },
    {
      data: `monthFormAugIGST${startYear}`,
      title: `IGST`,
      width: rowWidth
    },
    {
      data: `monthFormAugCGST${startYear}`,
      title: `CGST`,
      width: rowWidth
    },
    {
      data: `monthFormAugSGST${startYear}`,
      title: `SGST`,
      width: rowWidth
    },
    {
      data: `monthFormAugCESS${startYear}`,
      title: `CESS`,
      width: rowWidth
    },
    {
      data: `monthFormSepTotalTax${startYear}`,
      title: `Total Tax`,
      width: rowWidth
    },
    {
      data: `monthFormSepTaxableValue${startYear}`,
      title: `TaxableValue`,
      width: rowWidth
    },
    {
      data: `monthFormSepIGST${startYear}`,
      title: `IGST`,
      width: rowWidth
    },
    {
      data: `monthFormSepCGST${startYear}`,
      title: `CGST`,
      width: rowWidth
    },
    {
      data: `monthFormSepSGST${startYear}`,
      title: `SGST`,
      width: rowWidth
    },
    {
      data: `monthFormSepCESS${startYear}`,
      title: `CESS`,
      width: rowWidth
    },

    {
      data: `monthFormOctTotalTax${startYear}`,
      title: `Total Tax`,
      width: rowWidth
    },
    {
      data: `monthFormOctTaxableValue${startYear}`,
      title: `TaxableValue`,
      width: rowWidth
    },
    {
      data: `monthFormOctIGST${startYear}`,
      title: `IGST`,
      width: rowWidth
    },
    {
      data: `monthFormOctCGST${startYear}`,
      title: `CGST`,
      width: rowWidth
    },
    {
      data: `monthFormOctSGST${startYear}`,
      title: `SGST`,
      width: rowWidth
    },
    {
      data: `monthFormOctCESS${startYear}`,
      title: `CESS`,
      width: rowWidth
    },

    {
      data: `monthFormNovTotalTax${startYear}`,
      title: `Total Tax`,
      width: rowWidth
    },
    {
      data: `monthFormNovTaxableValue${startYear}`,
      title: `TaxableValue`,
      width: rowWidth
    },
    {
      data: `monthFormNovIGST${startYear}`,
      title: `IGST`,
      width: rowWidth
    },
    {
      data: `monthFormNovCGST${startYear}`,
      title: `CGST`,
      width: rowWidth
    },
    {
      data: `monthFormNovSGST${startYear}`,
      title: `SGST`,
      width: rowWidth
    },
    {
      data: `monthFormNovCESS${startYear}`,
      title: `CESS`,
      width: rowWidth
    },

    {
      data: `monthFormDecTotalTax${startYear}`,
      title: `Total Tax`,
      width: rowWidth
    },
    {
      data: `monthFormDecTaxableValue${startYear}`,
      title: `TaxableValue`,
      width: rowWidth
    },
    {
      data: `monthFormDecIGST${startYear}`,
      title: `IGST`,
      width: rowWidth
    },
    {
      data: `monthFormDecCGST${startYear}`,
      title: `CGST`,
      width: rowWidth
    },
    {
      data: `monthFormDecSGST${startYear}`,
      title: `SGST`,
      width: rowWidth
    },
    {
      data: `monthFormDecCESS${startYear}`,
      title: `CESS`,
      width: rowWidth
    },

    {
      data: `monthFormJanTotalTax${endYear}`,
      title: `Total Tax`,
      width: rowWidth
    },
    {
      data: `monthFormJanTaxableValue${startYear}`,
      title: `TaxableValue`,
      width: rowWidth
    },
    {
      data: `monthFormJanIGST${endYear}`,
      title: `IGST`,
      width: rowWidth
    },
    {
      data: `monthFormJanCGST${endYear}`,
      title: `CGST`,
      width: rowWidth
    },
    {
      data: `monthFormJanSGST${endYear}`,
      title: `SGST`,
      width: rowWidth
    },
    {
      data: `monthFormJanCESS${endYear}`,
      title: `CESS`,
      width: rowWidth
    },

    {
      data: `monthFormFebTotalTax${endYear}`,
      title: `Total Tax`,
      width: rowWidth
    },
    {
      data: `monthFormFebTaxableValue${startYear}`,
      title: `TaxableValue`,
      width: rowWidth
    },
    {
      data: `monthFormFebIGST${endYear}`,
      title: `IGST`,
      width: rowWidth
    },
    {
      data: `monthFormFebCGST${endYear}`,
      title: `CGST`,
      width: rowWidth
    },
    {
      data: `monthFormFebSGST${endYear}`,
      title: `SGST`,
      width: rowWidth
    },
    {
      data: `monthFormFebCESS${endYear}`,
      title: `CESS`,
      width: rowWidth
    },

    {
      data: `monthFormMarchTotalTax${endYear}`,
      title: `Total Tax`,
      width: rowWidth
    },
    {
      data: `monthFormMarchTaxableValue${startYear}`,
      title: `TaxableValue`,
      width: rowWidth
    },
    {
      data: `monthFormMarchIGST${endYear}`,
      title: `IGST`,
      width: rowWidth
    },
    {
      data: `monthFormMarchCGST${endYear}`,
      title: `CGST`,
      width: rowWidth
    },
    {
      data: `monthFormMarchSGST${endYear}`,
      title: `SGST`,
      width: rowWidth
    },
    {
      data: `monthFormMarchCESS${endYear}`,
      title: `CESS`,
      width: rowWidth
    },
  ];

  const nestedPaymentOfTaxColumns = [
    [
      "Description",
      "","",
      { label: "Total", colspan:6 },
      { label: `April-${startYear}`, colspan:6},
      { label: `May-${startYear}`, colspan:6},
      { label: `June-${startYear}`,colspan:6},
      { label: `July-${startYear}`,colspan:6},
      { label: `August-${startYear}`,colspan:6},
      { label: `September-${startYear}`,colspan:6},
      { label: `October-${startYear}`,colspan:6},
      { label: `November-${startYear}`,colspan:6},
      { label: `December-${startYear}`,colspan:6},
      { label: `January-${endYear}`,colspan:6},
      { label: `Febuary-${endYear}`,colspan:6},
      { label:`March-${endYear}`,colspan:6},
    ],
    [
      "",
      "Total Tax",
      "Taxable Value",
      "IGST",
      "CGST",
      "SGST",
      "CESS",
      "Total Tax",
      "Taxable Value",
      "IGST",
      "CGST",
      "SGST",
      "CESS",
      "Total Tax",
      "Taxable Value",
      "IGST",
      "CGST",
      "SGST",
      "CESS",
      "Total Tax",
      "Taxable Value",
      "IGST",
      "CGST",
      "SGST",
      "CESS",
      "Total Tax",
      "Taxable Value",
      "IGST",
      "CGST",
      "SGST",
      "CESS",
      "Total Tax",
      "Taxable Value",
      "IGST",
      "CGST",
      "SGST",
      "CESS",
      "Total Tax",
      "Taxable Value",
      "IGST",
      "CGST",
      "SGST",
      "CESS",
      "Total Tax",
      "Taxable Value",
      "IGST",
      "CGST",
      "SGST",
      "CESS",
      "Total Tax",
      "Taxable Value",
      "IGST",
      "CGST",
      "SGST",
      "CESS",
      "Total Tax",
      "Taxable Value",
      "IGST",
      "CGST",
      "SGST",
      "CESS",
      "Total Tax",
      "Taxable Value",
      "IGST",
      "CGST",
      "SGST",
      "CESS",
      "Total Tax",
      "Taxable Value",
      "IGST",
      "CGST",
      "SGST",
      "CESS",
      "Total Tax",
      "Taxable Value",
      "IGST",
      "CGST",
      "SGST",
      "CESS",
    ],
  ];

  // ** User Data Decrypt
  const userDatadecrypt = LocalFunction.getLocalValue(
    globleVariable.userData,
    true
  );
  const userData = userDatadecrypt && JSON.parse(userDatadecrypt);

  // ** Fin Year List
  const finYearOption = userData && userData.data.financialYearList;

  const finYearDefault = SessionFunction.getSessionValue(
    globleVariable.FinYear,
    true
  );

  const GGSTIN =
    sessionStorage.getItem(globleVariable.G_GSTIN) &&
    SessionFunction.getSessionValue(globleVariable.G_GSTIN, true);

  const GY =
    sessionStorage.getItem(globleVariable.F_Y) &&
    SessionFunction.getSessionValue(globleVariable.F_Y, true);

  console.log(GY, "GYYYYYYYYYYY");
  const UserClientId =
    sessionStorage.getItem(globleVariable.G_UCParId) &&
    SessionFunction.getSessionValue(globleVariable.G_UCParId, true);

  const UserId =
    localStorage.getItem(globleVariable.userId) &&
    LocalFunction.getLocalValue(globleVariable.userId, true);

  const subscriptionId =
    localStorage.getItem(globleVariable.subscriptionId) &&
    LocalFunction.getLocalValue(globleVariable.subscriptionId, true);


  registerAllModules();

  useHotkeys(
    keysMap.EXPORT_SUMMARY_DATA,
    () => {
      !block && exportGstr1filedRateReport();
    },
    { enableOnFormTags }
  );

  // ** Year select - onchagne
  const handleYearChange = (e) => {
    const word = e.label;
    const [startYear, endYear] = word.split("-");
    setSelectedYear(e);
    setShowExpandRows1(false);
    setShowExpandRows(false);
    PanGSTR3bvsGSTR1vsBooksService(e.label)

    // setBlock(true);

    // PanGSTR3BvsGSTR1.getPanGstr3bvsgstr1vsBooksApi(
    //   UserClientId,
    //   subscriptionId,
    //   GGSTIN,
    //   e.label,
    //   UserId
    // )
    //   .then((res) => {
    //     if (
    //       res.status === 200 &&
    //       res.data.status === errorCodeConfig.APIDefaultCode.Success
    //     ) {
    //       setBlock(false);
    //       const dataArray =
    //         res?.data?.data?.panBasedGstr3BVsGstr1VsBooksRootModel;
    //       const optionsFromAPI =
    //         res?.data?.data?.panBasedGstr3BVsGstr1VsBooksRootModel;
    //       setAllData(dataArray);
    //       setOptions(
    //         optionsFromAPI.map((ele, index) => {
    //           console.log(ele.label, "lablellle");
    //           return {
    //             label: ele?.gstin,
    //             value: ele?.label,
    //           };
    //         })
    //       );
    //       setValue({
    //         label: optionsFromAPI?.[0]?.gstin,
    //         value: optionsFromAPI?.[0]?.label,
    //       });
    //       proceesData(
    //         dataArray?.[optionsFromAPI?.[0]?.label]?.expandedNode,
    //         startYear,
    //         endYear,
    //         setData
    //       );
    //       proceesDataForExpandedColumns(
    //         dataArray?.[optionsFromAPI?.[0]?.label]?.expandedNode,
    //         startYear,
    //         endYear,
    //         setDataExpandable
    //       );
    //       collapseFunction();
    //       collapseFunction1();
    //     } else {
    //       setBlock(false);
    //       toast.error(res?.data?.errorMessage, {
    //         position: "top-right",
    //       });
    //     }
      // })
      // .catch((error) => {
      //   setBlock(false);
      //   Swal.fire({
      //     icon: "error",
      //     title: "",
      //     text: error?.message,
      //     customClass: {
      //       confirmButton: "btn btn-danger",
      //     },
      //     buttonsStyling: false,
      //   });
      // });
  };

  useEffect(() => {
    if (
      sessionStorage.getItem(globleVariable.isCompany) == false ||
      sessionStorage.getItem(globleVariable.isCompany) == "false"
    ) {
      setTimeout(() => {
        navigate(urlEndpointConfig.DASHBOARD_COMPANY);
      }, 1000);
    }
  }, []);

  const theaderdata = (col, TH) => {
    if (col == 0) {
      TH.className = "htLeft";
    } else {
      TH.className = "htRight";
    }
  };

  useEffect(() => {
    // if (finYearDefault) {
    //   defaultYear = finYearOption.filter((p) => p.label == finYearDefault)[0];
    // } else {
    //   defaultYear = finYearOption[0];
    // }
    // setSelectedYear(defaultYear);
    setSearchApi(true);
  }, []);

  useEffect(() => {
    if (searchApi == true) {
    //  PanGSTR3bvsGSTR1vsBooksService();

      CheckExistDataService()
      setSearchApi(false);
    }
  }, [searchApi]);

  // ** Export date set
  const dateFilter = () => {
    const filterDate = finYearOption.filter(
      (p) => p.value == searchDate.value
    )[0];
    if (filterDate != undefined) {
      setSelectedYear(filterDate);
    }
  };

  // ** Export
  const exportGstr1filedRateReport = () => {
    // dateFilter();  Commented for testing purpose

    if (selectedYear?.label !== null &&  selectedYear?.label !== undefined ) {

    setBlock(true);
    setShowExpandRows1(false);
    setShowExpandRows(false);
    PanGSTR3BvsGSTR1.getPanGstr3bvsgstr1vsBooksApiExport(
      UserClientId,
      subscriptionId,
      GGSTIN,
      selectedYear.label,
      UserId
    )
      .then((res) => {
        setBlock(false);
        if (
          res?.status == 200 &&
          res?.data?.status == errorCodeConfig.APIDefaultCode.Success
        ) {
          collapseFunction();
          collapseFunction1();
          downloadURL(res.data.data);
        } else {
          collapseFunction();
          collapseFunction1();
          toast.error(res.data.errorMessage, {
            position: "top-right",
          });
        }
      })
      .catch((error) => {
        collapseFunction();
        collapseFunction1();
        setBlock(false);
        Swal.fire({
          icon: "error",
          title: "",
          text: error?.message,
          customClass: {
            confirmButton: "btn btn-outline-danger",
          },
          buttonsStyling: false,
        });
      });
    }
  };

  useEffect(() => {
    return () => setBlock(false);
  }, []);




  // ** Search
  // const PanGSTR3bvsGSTR1vsBooksService = () => {
  //   setBlock(true);
  //   PanGSTR3BvsGSTR1.getPanGstr3bvsgstr1vsBooksApi(
  //     UserClientId,
  //     subscriptionId,
  //     GGSTIN,
  //     selectedYear.label,
  //     UserId
  //   )
  //     .then((res) => {
  //       if (
  //         res.status === 200 &&
  //         res.data.status === errorCodeConfig.APIDefaultCode.Success
  //       ) {
  //         setBlock(false);
  //         const dataArray =
  //           res?.data?.data?.panBasedGstr3BVsGstr1VsBooksRootModel;
  //         const optionsFromAPI =
  //           res?.data?.data?.panBasedGstr3BVsGstr1VsBooksRootModel;
  //         setAllData(dataArray);
  //         setOptions(
  //           optionsFromAPI.map((ele, index) => {
  //             console.log(ele.label, "lablellle");
  //             return {
  //               label: ele?.gstin,
  //               value: ele?.label,
  //             };
  //           })
  //         );
  //         setValue({
  //           label: optionsFromAPI?.[0]?.gstin,
  //           value: optionsFromAPI?.[0]?.label,
  //         });
  //         proceesData(
  //           dataArray?.[optionsFromAPI?.[0]?.label]?.expandedNode,
  //           startYear,
  //           endYear,
  //           setData
  //         );
  //         proceesDataForExpandedColumns(
  //           dataArray?.[optionsFromAPI?.[0]?.label]?.expandedNode,
  //           startYear,
  //           endYear,
  //           setDataExpandable
  //         );
  //         collapseFunction();
  //       } else {
  //         setBlock(false);
  //         toast.error(res?.data?.errorMessage, {
  //           position: "top-right",
  //         });
  //       }
  //     })
  //     .catch((error) => {
  //       setBlock(false);
  //       Swal.fire({
  //         icon: "error",
  //         title: "",
  //         text: error?.message,
  //         customClass: {
  //           confirmButton: "btn btn-danger",
  //         },
  //         buttonsStyling: false,
  //       });
  //     });
  // };


  async function CheckExistDataService() {
    try {
      setBlock(true)
        const response = await PanGSTR3BvsGSTR1.getPanGstr3bvsgstr1vsBooksCheckExistData(
          UserClientId,
          subscriptionId,
          GGSTIN,
          'PanBasedGSTR1VSGSTR3BVSSalesReport'
        );

        // Process response
        console.log(response , "response");


        if (response !== undefined) {

          setBlock(false)

          const dataArray =
          response[0]?.panBasedGstr3BVsGstr1VsBooksRootModel;
          const optionsFromAPI =
          response[0]?.panBasedGstr3BVsGstr1VsBooksRootModel;


          if (response?.[0]?.LastGeneratedReportDate) {
            setLastGeneratedDate(response?.[0]?.LastGeneratedReportDate)

            let fromToDate = response?.[0]?.FromRange + '-' + response?.[0]?.ToRange
            defaultYear = finYearOption.filter(p => p.label ==fromToDate)[0];

            setSelectedYear(defaultYear)

          }

          if (dataArray?.length > 0) {

              setAllData(dataArray);
              setOptions(
                optionsFromAPI.map((ele, index) => {

                  return {
                    label: ele?.GSTIN,
                    value: ele?.Label,
                  };
                })
              );
              setValue({
                label: optionsFromAPI?.[0]?.GSTIN,
                value: optionsFromAPI?.[0]?.Label,
              });
              proceesData(
                dataArray?.[optionsFromAPI?.[0]?.Label]?.ExpandedNode,
                response?.[0]?.FromRange,
                response?.[0]?.ToRange,
                setData
              );
              proceesDataForExpandedColumns(
                dataArray?.[optionsFromAPI?.[0]?.Label]?.ExpandedNode,
                response?.[0]?.FromRange,
                response?.[0]?.ToRange,
                setDataExpandable
              );
              collapseFunction();
            }

        } else {
          setBlock(false)
          ClearDataFunc()
        }

    } catch (error) {
        // Handle error
        console.error(error);
    }
}



  async function PanGSTR3bvsGSTR1vsBooksService(selectedYear) {
    try {
      setBlock(true)
        const response = await PanGSTR3BvsGSTR1.getPanGstr3bvsgstr1vsBooksApi(
          UserClientId,
          subscriptionId,
          GGSTIN,
          selectedYear,
          UserId
        );

        // Process response
        console.log(response , "PanGSTR3bvsGSTR1vsBooksService-response");
        if (response !== null) {
debugger
          let strDate = selectedYear.split("-")

               setBlock(false);

               const dataArray =
               response[0]?.panBasedGstr3BVsGstr1VsBooksRootModel;
               const optionsFromAPI =
               response[0]?.panBasedGstr3BVsGstr1VsBooksRootModel;

               if (response?.[0]?.LastGeneratedReportDate) {
                 setLastGeneratedDate(response?.[0]?.LastGeneratedReportDate)
               }


               setAllData(dataArray);
               setOptions(
                 optionsFromAPI.map((ele, index) => {

                   return {
                     label: ele?.GSTIN,
                     value: ele?.Label,
                   };
                 })
               );
               setValue({
                 label: optionsFromAPI?.[0]?.GSTIN,
                 value: optionsFromAPI?.[0]?.Label,
               });
               proceesData(
                 dataArray?.[optionsFromAPI?.[0]?.Label]?.ExpandedNode,
                 strDate[0],
                 strDate[1],
                 setData
               );
               proceesDataForExpandedColumns(
                 dataArray?.[optionsFromAPI?.[0]?.Label]?.ExpandedNode,
                 strDate[0],
                 strDate[1],
                 setDataExpandable
               );
               collapseFunction();


          } else {
            setBlock(false)
            ClearDataFunc()
          }

    } catch (error) {
      setBlock(false)
        // Handle error
        console.error(error);
    }
  }




  const onClickCollpase = () => {
    setShowExpandColumns(!showExpandColumns);
    collapseFunction();
    collapseFunction1();
  };

  const onClickCollpaseRows = () => {
    const hotMatching = hotRef?.current?.hotInstance;
    if (showExpandRows == true) {
      setTimeout(() => {
        hotMatching?.getPlugin("nestedRows")?.collapsingUI.collapseAll();
      }, 300);
      setShowExpandRows(false);
    } else {
      setTimeout(() => {
        hotMatching?.getPlugin("nestedRows")?.collapsingUI.expandAll();
      }, 300);
      setShowExpandRows(true);
    }
  };

  const onClickCollpaseRows2 = () => {
    const hotMatching = hotRef1?.current?.hotInstance;
    if (showExpandRows1 == true) {
      setTimeout(() => {
        hotMatching?.getPlugin("nestedRows")?.collapsingUI.collapseAll();
      }, 300);
      setShowExpandRows1(false);
    } else {
      setTimeout(() => {
        hotMatching?.getPlugin("nestedRows")?.collapsingUI.expandAll();
      }, 300);
      setShowExpandRows1(true);
    }
  };

  const onToggleSectionsDropDonw = (e) => {
    setValue({
      label: e.label,
      value: e.value,
    });
    setShowExpandRows(false);
    setShowExpandRows1(false);
    proceesData(allData?.[e.value]?.ExpandedNode, startYear, endYear, setData);

    proceesDataForExpandedColumns(
      allData?.[e.value]?.ExpandedNode,
      startYear,
      endYear,
      setDataExpandable
    );
    collapseFunction();
    collapseFunction1();
  };

  return (
    <Fragment>
      {block && <div className="loading1">Loading&#8230;</div>}
      <div className="content-header row py-1">
        <div className="content-header-left col-md-5 col-6">
          <div className="row breadcrumbs-top">
            <div className="col-12">
              <Breadcrumbs
                title="GSTR1 Rate Wise Report"
                data={[
                  { title: "Reports",link: urlEndpointConfig.REPORT_ALL },
                  {
                    title: "PAN Based GSTR 3B vs GSTR 1 vs Books",
                    // link: "/reports/gstr3b-gstr2b-purchase",
                  },
                ]}
              />
            </div>
          </div>
        </div>
        <div className="content-header-right text-md-end col-md-7 col-6 d-md-block d-none">

                {
                  lastGeneratedDate &&
                  <Badge className="me-1" color='light-warning'>  Last Generated Report Date :  {lastGeneratedDate} </Badge>
                 }


          <Button
            className="btn-icon"
            outline
            color="danger"
            // disabled={true}
            id="btnExportSum"
            onClick={exportGstr1filedRateReport}
          >
            <i className="fa fa-file-excel-o"></i>

            <span className="align-middle ms-50">Export</span>
          </Button>
          <UncontrolledTooltip placement="top" target="btnExportSum">
            Export [{keysMap.EXPORT_SUMMARY_DATA}]
          </UncontrolledTooltip>
        </div>
      </div>

      <div className="content-header-left col-md-12 col-12">
        <div className="row breadcrumbs-top mb-1">
          <div className="col-md-6 mt-1">
            <div className="row">

              {!showExpandColumns ? (
                <div style={{paddingRight:"4px",width:"24%"}} className="col-md-3">
                  <Button
                    onClick={onClickCollpaseRows}
                    className="btn-icon btn-round"
                    // style={{ marginRight: "10px" }}
                    disabled={data.length > 0 ? false : true}
                    color="danger"
                    outline
                  >
                    {showExpandRows ? "Collapse All Rows" : "Expand All Rows"}
                  </Button>
                </div>
              ) : (
                <div style={{paddingRight:"4px",width:"24%"}} className="col-md-3">
                  <Button
                    onClick={onClickCollpaseRows2}
                    className="btn-icon btn-round"
                    disabled={data.length > 0 ? false : true}
                    color="danger"
                    outline
                  >
                    {showExpandRows1 ? "Collapse All Rows" : "Expand All Rows"}
                  </Button>
                </div>
              )}
              <div style={{ width: "30%", paddingLeft:"0px" }} className="col-md-4">
                <Button
                  onClick={onClickCollpase}
                  className="btn-icon btn-round"
                  color="danger"
                  outline
                  disabled={data.length > 0 ? false : true}
                >
                  {showExpandColumns
                    ? "Collapse All Columns"
                    : "Expand All Columns"}
                </Button>
              </div>
              <div className="col-md-1">
                <Label
                  style={{ marginRight: "2px" }}
                  className="form-label pt-half"
                >
                  GSTIN
                </Label>
              </div>
              <div className="col-md-4">
                <Select
                  aria-label="sections"
                  id="purchaseId_invtype"
                  placeholder="Select*"
                  maxMenuHeight="120px"
                  isClearable={false}
                  theme={selectThemeColors}
                  closeMenuOnSelect={true}
                  components={animatedComponents}
                  isDisabled={options?.length > 0 ? false : true}
                  options={options}
                  className="basic-multi-select col-md-12"
                  classNamePrefix="select"
                  onChange={onToggleSectionsDropDonw}
                  value={value}
                />
              </div>
              {/* remove code */}
            </div>
          </div>
          <div className="col-md-6 mt-1">
            <div className="row">
              <div className="col-md-3"></div>

              <div className="col-md-9">
                <div className="row">
                  <Label className="form-label col-md-8 pt-half text-end">
                    Select Year
                  </Label>

                  <Select
                    isClearable={false}
                    value={selectedYear}
                    options={finYearOption}
                    defaultValue={defaultYear}
                    classNamePrefix="select"
                    className="basic-multi-select col-md-4"
                    theme={selectThemeColors}
                    onChange={handleYearChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Card>
        <CardBody className="CardBody p-0">
          <div>
            <Row>
              <Col
                md={12}
                style={{ display: showExpandColumns ? "none" : "block" }}
              >
                {data.length > 0 && (
                   <div

                    style={{
                      height: "330px",
                      width: "100%",
                     overflowX : "hidden"
                    }}

                  >
                    <HotTable
                      autoColumnSize={{
                        samplingRatio: 23, // Adjust the samplingRatio as needed
                      }}

                     height="330px"
                      fixedColumnsStart={1}
                      collapsibleColumns={true}
                      afterGetColHeader={theaderdata}
                      id="Itc"
                      ref={hotRef}
                      className="hotTableReportBorder"
                      data={data}
                      columns={column}
                      comments={true}
                      commentedCellClassName="custom-cell"
                      nestedRows={true}
                      contextMenu={false}
                      bindRowsWithHeaders={true}
                      readOnly={true}
                      licenseKey="non-commercial-and-evaluation"
                      rowHeaders={function (index) {
                        return "";
                      }}
                      mergeCells={false}
                      manualColumnResize={true}
                       autoWrapRow={true}
                      columnHeaderHeight={RowSizeLarge}
                      rowHeights={RowSizeLarge}
                       autoWrapCol={true}
                      cells={function (row, col) {
                        var cp = {};

                        cp.className = "child";
                        if (col > 0) {
                          cp.className = "text-end";
                        }
                        if ((row == 0 || row == 5 || row == 46) && col == 0) {
                          cp.className = "parent";
                        }
                        if(( (row  >= 1 && row <= 4) || row ==6  || row ==23 || row == 47 || row == 64) && col ==0){
                          cp.className = "reportsTreeView1"
                       }
                       if((row == 7 || (row >= 12 && row <=22) || row ==24 || row == 35 || row == 48 || (row >= 53 && row <= 63) || row == 65 || row == 76 ) && col ==0){
                       cp.className = "reportsTreeView2"
                     }
                       if(((row >= 8 && row <= 11)|| (row >= 25 &&  row <= 34) || (row >= 36 &&  row <= 45) || (row >= 49 && row <= 52) || (row >= 66 && row <= 75) || (row>=77 && row <= 86)) && col ==0){
                       cp.className = "reportsTreeView3"
                     }


                        return cp;
                      }}
                    />
                  </div>
                )}
              </Col>

              <div style={{ display: !showExpandColumns ? "none" : "block" }}>
                <Col md={12}>
                  {data.length > 0 && (
                    <div
                    className="htRowHeaders htColumnHeaders"
                      style={{
                        height: "330px",
                        width: "100%",
                       overflowX : "hidden"
                      }}

                    >
                      <HotTable
                       height="330px"
                        afterGetColHeader={theaderdata}
                        id="GSTR3BvsGSTR1vsBooks"
                        ref={hotRef1}
                        data={dataExpandable}
                        className="hotTableReportBorder"
                        autoColumnSize={{
                          samplingRatio: 23, // Adjust the samplingRatio as needed
                        }}

                        columns={column1}
                        readOnly={true}
                        licenseKey="non-commercial-and-evaluation"
                        rowHeaders={function (index) {
                          return "";
                        }}
                        fixedColumnsStart={1}
                        viewportColumnRenderingOffset={1000}
                        nestedRows={true}
                        mergeCells={false}
                         autoWrapRow={true}
                        columnHeaderHeight={RowSizeLarge}
                        rowHeights={RowSizeLarge}
                         autoWrapCol={true}
                        nestedHeaders={nestedPaymentOfTaxColumns}
                        cells={function (row, col) {
                          var cp = {};

                          cp.className = "child";
                          if (col > 0) {
                            cp.className = "text-end";
                          }
                          if ((row == 0 || row == 5 || row == 46) && col == 0) {
                            cp.className = "parent";
                          }
                          if(( (row  >= 1 && row <= 4) || row ==6  || row ==23 || row == 47 || row == 64) && col ==0){
                            cp.className = "reportsTreeView1"
                         }
                         if((row == 7 || (row >= 12 && row <=22) || row ==24 || row == 35 || row == 48 || (row >= 53 && row <= 63) || row == 65 || row == 76 ) && col ==0){
                         cp.className = "reportsTreeView2"
                       }
                         if(((row >= 8 && row <= 11)|| (row >= 25 &&  row <= 34) || (row >= 36 &&  row <= 45) || (row >= 49 && row <= 52) || (row >= 66 && row <= 75) || (row>=77 && row <= 86)) && col ==0){
                         cp.className = "reportsTreeView3"
                       }
                          return cp;
                        }}
                      />
                    </div>
                  )}
                </Col>
              </div>
            </Row>
          </div>
          <div></div>
        </CardBody>
      </Card>
    </Fragment>
  );
};

export default Pangstr3bvsgstr1vsPurchaseData;
