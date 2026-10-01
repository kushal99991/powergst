import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  Row,
  Col,
  Card,
  Input,
  Label,
  CardText,
  CardBody,
} from "reactstrap";

//** Handsontable
import { HotTable, HotColumn } from "@handsontable/react";
import Handsontable from "handsontable";
import { registerRenderer, textRenderer } from "handsontable/renderers";
import { registerAllModules } from "handsontable/registry";
import { useRef } from "react";
import GSTR1DownloadService from "../../../services/gstr1/gstr1Services/gstr1DownloadService";
import gstr3bDownloadService from "../../../services/gstr3b/gstr3bDownloadService";
import Swal from "sweetalert2";
import errorCodeConfig from "../../../configs/apiErrorCodeConfig";
import { RowSize, columnHeaderSize } from "../../../configs/config";

//** register Handsontable's modules
registerAllModules();


const GSTR3bfiledPdf = () => {
  // ** Hooks

  const [open, setOpen] = useState("1");
  const [gstr1PdfData, setGstr1PdfData] = useState([]);
  const [margeCell, setMargeCell] = useState([]);
  const [SearchCall, setSearchCall] = useState(false);
  const [block, setBlock] = useState(false);
  const [outwardSuppliesDe, setOutwardSuppliesDe] = useState([]);
  const [suppliesDe, setSuppliesDe] = useState([]);
  const [supplyDetailsDe, setSupplyDetailsDe] = useState([]);
  const [eligibleITCsDe, setEligibleITCsDe] = useState([]);
  const [nilRatedDe, setNilRatedDe] = useState([]);
  const [lateFeeDe, setLateFeeDe] = useState([]);
  const [paymetnPage, setPaymentPage] = useState([]);

  let paramsEncoded = window.location.href.split('?');

  const hotRef = useRef(null);
  const hotRef2 = useRef(null);
  const hotRef3 = useRef(null);
  const hotRefEligibeleITC = useRef(null)
  const hotRefExempt = useRef(null)
  const hotRefIntersetLateFee = useRef(null)
  // ** Columne
  const handsontableColumns = [
    {
      data: "natureOfSupplies",
      readOnly: true,
      title: "Nature of supplies",
      width: 499,
    },
    {
      data: "taxableValue",
      readOnly: true,
      title: "Total Taxable Value (₹)",
      type: "numeric",
      width: '155px',
      numericFormat: {
        pattern: '0,0.00',
        culture: 'en-IN'
      },
    },
    {
      data: "igst",
      readOnly: true,
      title: "IGST (₹)",
      type: "numeric",
      numericFormat: {
        pattern: '0,0.00',
        culture: 'en-IN'
      },
    },
    {
      data: "cgst",
      readOnly: true,
      title: "CGST (₹)",
      type: "numeric",
      numericFormat: {
        pattern: '0,0.00',
        culture: 'en-IN'
      },
    },
    {
      data: "sgst",
      readOnly: true,
      title: "SGST (₹)",
      type: "numeric",
      numericFormat: {
        pattern: '0,0.00',
        culture: 'en-IN'
      },
    },
    {
      data: "cess",
      readOnly: true,
      title: "CESS (₹)",
      type: "numeric",
      numericFormat: {
        pattern: '0,0.00',
        culture: 'en-IN'
      },
    },
  ];

  const handsontableColumns2 = [
    {
      data: "natureOfSupplies",
      readOnly: true,
      title: 'Nature of supplies',
      width: 499
    },
    {
      data: "taxableValue",
      readOnly: true,
      title: 'Total Taxable Value (₹)',
      width: "150px"
    },
    {
      data: "igst",
      readOnly: true,
      title: 'IGST (₹)'
    },
    {
      data: "cgst",
      readOnly: true,
      title: 'CGST (₹)'
    },
    {
      data: "igst",
      readOnly: true,
      title: 'SGST (₹)'
    },
    {
      data: "cess",
      readOnly: true,
      title: 'CESS (₹)'
    }
  ]

  const handsontableColumns3 = [
    {
      data: "natureOfSupplies",
      readOnly: true,
      title: 'Nature of supplies',
      width: 200
    },
    {
      data: "taxableValue",
      readOnly: true,
      title: 'Total Taxable Value (₹)',
      // width:100
    },
    {
      data: "igst",
      readOnly: true,
      title: 'IGST (₹)'
    },
    {
      data: "type",
      readOnly: true,
      title: 'Type'
    },
  ]

  const exemptColumns = [
    {
      data: "natureOfSupplies",
      readOnly: true,
      title: 'Nature of supplies',
      width: 200

    },
    {
      data: "interStateSupplies",
      readOnly: true,
      title: 'Inter-State-Supplies (₹)'
    },
    {
      data: "intraStateSupplies",
      readOnly: true,
      title: 'Intra-State-Supplies (₹)'
    },
  ]
  const eligbileColumns = [
    {
      data: "details",
      readOnly: true,
      title: 'Details',
      width: 400
    },
    {
      data: "igst",
      readOnly: true,
      title: 'IGST (₹)'
    },
    {
      data: "cgst",
      readOnly: true,
      title: 'CGST (₹)'
    },
    {
      data: "sgst",
      readOnly: true,
      title: 'SGST (₹)'
    },
    {
      data: "cess",
      readOnly: true,
      title: 'CESS (₹)'
    }
  ]
  const intersetAndLateFeesColumn = [
    {
      data: "description",
      readOnly: true,
      title: 'Description',
      width: 400
    },
    {
      data: "igst",
      readOnly: true,
      title: 'IGST (₹)'
    },
    {
      data: "cgst",
      readOnly: true,
      title: 'CGST (₹)'
    },
    {
      data: "igst",
      readOnly: true,
      title: 'SGST (₹)'
    },
    {
      data: "cess",
      readOnly: true,
      title: 'CESS (₹)'
    }
  ]

  useEffect(() => {
    return () => setBlock(false);
  }, []);

  // ** toggle
  const toggle = (id) => {
    open === id ? setOpen() : setOpen(id);
  };

  function isArray(arr) {
    return arr instanceof Array;
  }

  const setArrayValue = (parentArray) => {
    let arr = [];
    for (let i = 0; i < parentArray.length; i++) {
      for (let j = 0; j < parentArray[i].length; j++) {
        if (isArray(parentArray[i][j])) {
          // console.log(parentArray[i][j])
          for (let k = 0; k < parentArray[i][j].length; k++) {
            arr.push(parentArray[i][j][k]);
          }
        }
      }
    }

    return arr;
  };

  useEffect(() => {
    try {
      if (gstr1PdfData?.length > 0) {
        // const hot = hotRef?.current?.hotInstance;
        // console.log(hot?.getSourceData());
        // let arr = hot?.getSourceData();
        // let margeArr = []
        // for (let i = 0; i < arr.length; i++) {
        //   if (arr[i]["isMerge"] == true) {
        //     margeArr.push({
        //       row: i,
        //       col: 0,
        //       rowspan: 1,
        //       colspan: 8,
        //     });
        //   }
        // }
        // setMargeCell(margeArr);
      }
    } catch (error) {
      setBlock(false)
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

  }, [gstr1PdfData]);

  // ** API Call
  useEffect(() => {
    setBlock(true)
    const payLoad = atob(paramsEncoded[1]);
    gstr3bDownloadService.gstr3bGovtReturnErrorLogStatus(payLoad)
      .then((res) => {
        console.log("res", res.data.data);
        if (
          res.status === 200 &&
          res.data.status === errorCodeConfig.APIDefaultCode.Success
        ) {
          // var result = Object.entries(res.data.data);
          // let arrValue = setArrayValue(result);
          // var result1 = arrValue;
          // setGstr1PdfData(result1);
          // setTimeout(() => {
          //   const hot = hotRef?.current?.hotInstance;
          //   hot?.getPlugin('mergeCells').merge()
          //   setBlock(false)
          // }, 2000);
          setOutwardSuppliesDe(
            res?.data?.data?.filedOutwardSupplies.map((ele) => ({
              cess: ele?.cess,
              cgst: ele?.cgst,
              description: ele?.description,
              details: ele?.details,
              igst: ele.igst,
              interStateSupplies: ele.interStateSupplies,
              intraStateSupplies: ele.intraStateSupplies,
              natureOfSupplies: ele.natureOfSupplies,
              placeOfSupply: ele.placeOfSupply,
              // sgst:ele.cgst,
              sgst: ele?.sgst,
              taxableValue: ele.taxableValue,
              type: ele.type,
              typeText: ele.typeText,
            }))
          );
          setSuppliesDe(
            res?.data?.data?.filedSupplyDetails.map((ele) => ({
              cess: ele?.cess,
              cgst: ele?.cgst,
              description: ele?.description,
              details: ele?.details,
              igst: ele.igst,
              interStateSupplies: ele.interStateSupplies,
              intraStateSupplies: ele.intraStateSupplies,
              natureOfSupplies: ele.natureOfSupplies,
              placeOfSupply: ele.placeOfSupply,
              // sgst:ele.cgst,
              sgst: ele.sgst,
              taxableValue: ele.taxableValue,
              type: ele.type,
              typeText: ele.typeText,
            }))
          );

          setSupplyDetailsDe(
            res?.data?.data?.filedSupplies.map((ele) => ({
              cess: ele?.cess,
              cgst: ele?.cgst,
              description: ele?.description,
              details: ele?.details,
              igst: ele.igst,
              interStateSupplies: ele.interStateSupplies,
              intraStateSupplies: ele.intraStateSupplies,
              natureOfSupplies: ele.natureOfSupplies,
              placeOfSupply: ele.placeOfSupply,
              // sgst:ele.cgst,
              sgst: ele.sgst,
              taxableValue: ele.taxableValue,
              type: ele.type,
              typeText: ele.typeText,
            }))
          );
          setEligibleITCsDe(
            res?.data?.data?.filedEligibleITCs.map((ele) => ({
              cess: ele?.cess,
              cgst: ele?.cgst,
              description: ele?.description,
              details: ele?.details,
              igst: ele.igst,
              interStateSupplies: ele.interStateSupplies,
              intraStateSupplies: ele.intraStateSupplies,
              natureOfSupplies: ele.natureOfSupplies,
              placeOfSupply: ele.placeOfSupply,
              // sgst:ele.cgst,
              sgst: ele.sgst,
              taxableValue: ele.taxableValue,
              type: ele.type,
              typeText: ele.typeText,
            }))
          );
          setNilRatedDe(
            res?.data?.data?.filedNilRated.map((ele) => ({
              cess: ele?.cess,
              cgst: ele?.cgst,
              description: ele?.description,
              details: ele?.details,
              igst: ele.igst,
              interStateSupplies: ele.interStateSupplies,
              intraStateSupplies: ele.intraStateSupplies,
              natureOfSupplies: ele.natureOfSupplies,
              placeOfSupply: ele.placeOfSupply,
              // sgst:ele.cgst,
              sgst: ele.sgst,
              taxableValue: ele.taxableValue,
              type: ele.type,
              typeText: ele.typeText,
            }))
          );
          setLateFeeDe(
            res?.data?.data?.filedLateFee.map((ele) => ({
              cess: ele?.cess,
              cgst: ele?.cgst,
              description: ele?.description,
              details: ele?.details,
              igst: ele.igst,
              interStateSupplies: ele.interStateSupplies,
              intraStateSupplies: ele.intraStateSupplies,
              natureOfSupplies: ele.natureOfSupplies,
              placeOfSupply: ele.placeOfSupply,
              // sgst:ele.cgst,
              sgst: ele.sgst,
              taxableValue: ele.taxableValue,
              type: ele.type,
              typeText: ele.typeText,
            }))
          );
          var paymentOfPageAllData = res?.data?.data?.filedpaymentofpage;
          var computationOfData = [];
          // setPaymentPage(res?.data?.data?.filedpaymentofpage)
          if (paymentOfPageAllData != null && paymentOfPageAllData.length > 0) {
            computationOfData.push([
                "Integrated Tax",
                paymentOfPageAllData[0].igst,
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

            setPaymentPage(computationOfData);
        }
          setBlock(false)

        } else {
          setBlock(false)
        }
      })
      .catch((error) => {
        setBlock(false)
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
  }, []);


  const theader = (col, TH) => {

    if (col > 0) {
      TH.className = 'htRight'
    } else {
      TH.className = 'htLeft'
    }
  }

  const data = [
    {
      "finMonthYear": null,
      "natureOfSupplies": "(a) Outward taxable supplies (other than zero rated, nil rated and exempted)",
      "details": null,
      "description": null,
      "taxableValue": "0.00",
      "igst": "0.00",
      "cgst": "0.00",
      "sgst": "0.00",
      "cess": "0.00",
      "placeOfSupply": null,
      "interStateSupplies": null,
      "intraStateSupplies": null,
      "typeText": null,
      "type": null
    },
    {
      "finMonthYear": null,
      "natureOfSupplies": "(b) Outward taxable supplies (zero rated)",
      "details": null,
      "description": null,
      "taxableValue": "65155444.00",
      "igst": "0.00",
      "cgst": "0.00",
      "sgst": "0.00",
      "cess": "0.00",
      "placeOfSupply": null,
      "interStateSupplies": null,
      "intraStateSupplies": null,
      "typeText": null,
      "type": null
    },
    {
      "finMonthYear": null,
      "natureOfSupplies": "(c) Other outward supplies (Nil rated, exempted)",
      "details": null,
      "description": null,
      "taxableValue": "0.00",
      "igst": "0.00",
      "cgst": "0.00",
      "sgst": "0.00",
      "cess": "0.00",
      "placeOfSupply": null,
      "interStateSupplies": null,
      "intraStateSupplies": null,
      "typeText": null,
      "type": null
    },
    {
      "finMonthYear": null,
      "natureOfSupplies": "(d) Inward supplies (liable to reverse charge)",
      "details": null,
      "description": null,
      "taxableValue": "0.00",
      "igst": "0.00",
      "cgst": "0.00",
      "sgst": "0.00",
      "cess": "0.00",
      "placeOfSupply": null,
      "interStateSupplies": null,
      "intraStateSupplies": null,
      "typeText": null,
      "type": null
    },
    {
      "finMonthYear": null,
      "natureOfSupplies": "(e) Non-GST outward supplies",
      "details": null,
      "description": null,
      "taxableValue": "0.00",
      "igst": "0.00",
      "cgst": "0.00",
      "sgst": "0.00",
      "cess": "0.00",
      "placeOfSupply": null,
      "interStateSupplies": null,
      "intraStateSupplies": null,
      "typeText": null,
      "type": null
    },
    {
      "finMonthYear": null,
      "natureOfSupplies": "Total",
      "details": null,
      "description": null,
      "taxableValue": "65155444.00",
      "igst": "0.00",
      "cgst": "0.00",
      "sgst": "0.00",
      "cess": "0.00",
      "placeOfSupply": null,
      "interStateSupplies": null,
      "intraStateSupplies": null,
      "typeText": null,
      "type": null
    }
  ]

  const data1 = [
    {
        "finMonthYear": null,
        "natureOfSupplies": "(i)Taxable supplies on which electronic commerce operator pays tax under sub-section (5) of  section 9 [to be furnished  by the electronic  commerce operator]",
        "details": null,
        "description": null,
        "taxableValue": "0.00",
        "igst": "0.00",
        "cgst": "0.00",
        "sgst": "0.00",
        "cess": "0.00",
        "placeOfSupply": null,
        "interStateSupplies": null,
        "intraStateSupplies": null,
        "typeText": null,
        "type": null
    },
    {
        "finMonthYear": null,
        "natureOfSupplies": "(ii)Taxable supplies made by the registered person through  electronic commerce operator , on which electronic commerce operator is required to pay tax  under sub-section (5) of  section 9[to be furnished by the registered person making supplies through electronic commerce operator].",
        "details": null,
        "description": null,
        "taxableValue": "0.00",
        "igst": "0.00",
        "cgst": "0.00",
        "sgst": "0.00",
        "cess": "0.00",
        "placeOfSupply": null,
        "interStateSupplies": null,
        "intraStateSupplies": null,
        "typeText": null,
        "type": null
    },
    {
        "finMonthYear": null,
        "natureOfSupplies": "Total",
        "details": null,
        "description": null,
        "taxableValue": "0.00",
        "igst": "0.00",
        "cgst": "0.00",
        "sgst": "0.00",
        "cess": "0.00",
        "placeOfSupply": null,
        "interStateSupplies": null,
        "intraStateSupplies": null,
        "typeText": null,
        "type": null
    }
]



  return (
    <>
      <style>{`.accordion-button {
  background-color: #f29394  !important;
}

.accordion-button:focus {
  box-shadow: none;
}

.accordion-button:not(.collapsed) {
  color: #212529;
}`}</style>
      <div className="" >
        {block && <div className="loading1">Loading&#8230;</div>}

        <div style={{ width: "70%", margin: "auto" }}>

          <Accordion open={open} toggle={toggle}>
            <AccordionItem>
              <AccordionHeader targetId="1"  > CONSOLIDATED 3B SUMMARY</AccordionHeader>
              <AccordionBody accordionId="1">
                <div>
                  <div style={{ paddingLeft: "5px", paddingTop: "10px", paddingBottom: "6px", background: "navajowhite", marginBottom: "10px", marginTop: "10px" }} >
                    <h3 style={{ fontSize: "16px", fontWeight: "bold" }}>  3.1 Details of outward supplies and inward supplies liable to reverse charge (other than those covered in 3.1.1) </h3>
                  </div>
                  <Card>
                    <CardBody className="CardBody p-0">
                      <div>
                        <Row>
                          <Col md={12}>
                            <div className="Gstr1-report">
                              {console.log(outwardSuppliesDe,"outwardSuppliesDeoutwardSuppliesDe")}
                              {outwardSuppliesDe?.length > 0 ? (
                                <HotTable
                                  data={outwardSuppliesDe}
                                  autoColumnSize={{
                                    samplingRatio: 23  // Adjust the samplingRatio as needed
                                  }}
                                  manualColumnResize={true}
                                  stretchH='all'
                                  preventOverflow="horizontal"
                                  columns={handsontableColumns}
                                  contextMenu={false}
                                  rowHeights={RowSize}
                                  columnHeaderHeight={columnHeaderSize}
                                  bindRowsWithHeaders={true}
                                  licenseKey="non-commercial-and-evaluation"
                                  height="auto"
                                  ref={hotRef}
                                  hiddenColumns={{
                                    columns: [6, 7]
                                  }}
                                  afterGetColHeader={theader}
                                  // afterOnCellMouseDown={localAfterOnCellMouseDown}
                                  mergeCells={false}
                                  cells={function (row, col) {
                                    var cp = {}

                                    const hot = hotRef?.current?.hotInstance;
                                    // cp.className = 'child'
                                    if (col > 0) {
                                      cp.className = 'text-end'
                                    }
                                    if (col == 0 && col == 1) {
                                      cp.className = "green"
                                    }
                                    // console.log(cp,"cpcpcpcp")
                                    // if (row === outwardSuppliesDe.length - 1) {
                                    //   if (col > 0) {
                                    //     cp.className = "purchseCellDisable text-end"
                                    //   }
                                    // }
                                    // if (col === 4) {
                                    //   cp.className = "purchseCellDisable text-end"
                                    // }

                                    // if (row === 4) {
                                    //   if (col > 1) {
                                    //     cp.className = "purchseCellDisable text-end"
                                    //   }
                                    // }
                                    // if (row === 3) {
                                    //   if (col > 3 && col != 5) {
                                    //     cp.className = "purchseCellDisable text-end"
                                    //   }
                                    // }
                                    // if (row === 2) {
                                    //   if (col > 1) {
                                    //     cp.className = "purchseCellDisable text-end"
                                    //   }
                                    // }
                                    // if (row === 1) {
                                    //   if (col > 2 && col != 5) {
                                    //     cp.className = "purchseCellDisable text-end"
                                    //   }
                                    // }
                                    cp.readOnly = true

                                    return cp
                                  }}

                                  width="100%"
                                  colWidths={100}

                                />

                              ) : (
                                <HotTable
                                  data={[{ natureOfSupplies: "No Data Found" }]}
                                  autoColumnSize={{
                                    samplingRatio: 23  // Adjust the samplingRatio as needed
                                  }}
                                  manualColumnResize={true}
                                  stretchH='all'
                                  preventOverflow="horizontal"
                                  columns={handsontableColumns}
                                  contextMenu={false}
                                  rowHeights={RowSize}
                                  columnHeaderHeight={columnHeaderSize}
                                  bindRowsWithHeaders={true}
                                  licenseKey="non-commercial-and-evaluation"
                                  height="auto"
                                  // className='tblborder'
                                  ref={hotRef}
                                  hiddenColumns={{
                                    columns: [6, 7]
                                  }}
                                  afterGetColHeader={theader}
                                  // afterOnCellMouseDown={localAfterOnCellMouseDown}
                                  mergeCells={[{ row: 0, col: 0, rowspan: 1, colspan: 6 }]}
                                  // cells={function (row, col) {
                                  //   var cp = {}

                                  //   const hot = hotRef?.current?.hotInstance;
                                  //   cp.className = 'child'
                                  //   if (col > 0) {
                                  //     cp.className = 'text-end'
                                  //   }
                                  //   if (col == 0 && col == 1) {
                                  //     cp.className = "green"
                                  //   }
                                  //   // console.log(cp,"cpcpcpcp")
                                  //   if (row === outwardSuppliesDe.length - 1) {
                                  //     if (col > 0) {
                                  //       cp.className = "purchseCellDisable text-end"
                                  //     }
                                  //   }
                                  //   if (col === 4) {
                                  //     cp.className = "purchseCellDisable text-end"
                                  //   }

                                  //   if (row === 4) {
                                  //     if (col > 1) {
                                  //       cp.className = "purchseCellDisable text-end"
                                  //     }
                                  //   }
                                  //   if (row === 3) {
                                  //     if (col > 3 && col != 5) {
                                  //       cp.className = "purchseCellDisable text-end"
                                  //     }
                                  //   }
                                  //   if (row === 2) {
                                  //     if (col > 1) {
                                  //       cp.className = "purchseCellDisable text-end"
                                  //     }
                                  //   }
                                  //   if (row === 1) {
                                  //     if (col > 2 && col != 5) {
                                  //       cp.className = "purchseCellDisable text-end"
                                  //     }
                                  //   }
                                  //   cp.readOnly = true

                                  //   return cp
                                  // }}

                                  width="100%"
                                  colWidths={100}
                                />
                              )}
                            </div>
                          </Col>
                        </Row>
                      </div>
                    </CardBody>
                  </Card>
                </div>

                <div>
                  <div style={{ paddingLeft: "5px", paddingTop: "10px", paddingBottom: "6px", background: "navajowhite", marginBottom: "10px", marginTop: "10px" }}>
                    <h3 style={{ fontSize: "16px", fontWeight: "bold" }}> 3.1.1 Details of supplies notified under sub-section (5) of section 9 of the CGST Act, 2017 and corresponding provisions in IGST/UTGST/SGST Acts </h3>
                  </div>
                  <Card>
                    <CardBody className="CardBody p-0">
                      <div>
                        <Row>
                          <Col md={12}>
                            <div className="Gstr1-report">
                              {suppliesDe?.length > 0 ? (
                                <HotTable
                                  data={suppliesDe}
                                  autoColumnSize={{
                                    samplingRatio: 23  // Adjust the samplingRatio as needed
                                  }}
                                  manualColumnResize={true}
                                  stretchH='all'
                                  rowHeights={RowSize}
                                  columnHeaderHeight={columnHeaderSize}
                                  preventOverflow="horizontal"
                                  columns={handsontableColumns2}
                                  contextMenu={false}
                                  bindRowsWithHeaders={true}
                                  licenseKey="non-commercial-and-evaluation"
                                  height="auto"
                                  ref={hotRef2}
                                  hiddenColumns={{
                                    columns: [6, 7]
                                  }}
                                  afterGetColHeader={theader}
                                  mergeCells={false}
                                  cells={function (row, col) {
                                    var cp = {}
                                    const hot = hotRef2?.current?.hotInstance;
                                    // cp.className = 'child'
                                    if (col > 0) {
                                      cp.className = 'text-end'
                                    }
                                    // if (col === 4) {
                                    //   cp.className = "purchseCellDisable text-end"
                                    // }
                                    // if (row === data1.length - 1) {
                                    //   if (col > 1) {
                                    //     cp.className = "purchseCellDisable text-end"
                                    //   }
                                    // }
                                    cp.readOnly = true


                                    return cp
                                  }}
                                  width="100%"
                                  colWidths={100}

                                />

                              ) : (
                                <HotTable
                                  mergeCells={[{ row: 0, col: 0, rowspan: 1, colspan: 6 }]}
                                  // autoColumnSize={true}
                                  autoColumnSize={{
                                    samplingRatio: 23  // Adjust the samplingRatio as needed
                                  }}
                                  manualColumnResize={true}
                                  ref={hotRef2}
                                  stretchH='all'
                                  rowHeights={RowSize}
                                  columnHeaderHeight={columnHeaderSize}
                                  // style={{ overflowX: "hidden", textAlign: "center" }}
                                  data={[{ NatureOfSupplies: "No Data Found!" }]}
                                  cells={function (row, col) {
                                    var cp = {};

                                    if (col == 0) {

                                      cp.className = "text-center";
                                    }
                                    return cp;

                                  }}
                                  preventOverflow="horizontal"
                                  columns={handsontableColumns2}
                                  contextMenu={false}
                                  bindRowsWithHeaders={true}
                                  licenseKey="non-commercial-and-evaluation"
                                  height="auto"
                                  width="100%"
                                  afterGetColHeader={theader}
                                  colWidths={100}
                                />
                              )}
                            </div>
                          </Col>
                        </Row>
                      </div>
                    </CardBody>
                  </Card>
                </div>

                <div>
                  <div style={{ paddingLeft: "5px", paddingTop: "10px", paddingBottom: "6px", background: "navajowhite", marginBottom: "10px", marginTop: "10px" }}>
                      <h3 style={{ fontSize: "16px", fontWeight: "bold" }}> 3.2 Out Of the supplies made in 3.1(a) and 3.1.1(i),details of inter-state supplies made  </h3>
                  </div>
                  <Card>
                    <CardBody className="CardBody p-0">
                      <div>
                        <Row>
                          <Col md={12}>
                            <div className="Gstr1-report">
                              {supplyDetailsDe?.length > 0 ? (
                                <HotTable
                                  data={supplyDetailsDe}
                                  autoColumnSize={{
                                    samplingRatio: 23  // Adjust the samplingRatio as needed
                                  }}
                                  manualColumnResize={true}
                                  stretchH='all'
                                  preventOverflow="horizontal"
                                  columns={handsontableColumns3}
                                  contextMenu={false}
                                  bindRowsWithHeaders={true}
                                  rowHeights={RowSize}
                                  columnHeaderHeight={columnHeaderSize}
                                  licenseKey="non-commercial-and-evaluation"
                                  height="auto"
                                  ref={hotRef3}
                                  afterGetColHeader={theader}
                                  hiddenColumns={{
                                    columns: [3]
                                  }}
                                  mergeCells={false}
                                  cells={function (row, col) {

                                    var cp = {}
                                    const hot = hotRef3?.current?.hotInstance;

                                    // cp.className = 'text-danger child'

                                    if (col > 0) {
                                      cp.className = 'text-end'
                                    }
                                    cp.readOnly = true
                                    // if (row === supplyDetailsDe?.length - 1) {
                                    //   cp.className = "test"
                                    //   if (col > 0) {
                                    //     cp.className = "text-end"
                                    //   }
                                    // }

                                    // cp.readOnly = true

                                    // if (col > 0) {
                                    //   cp.className = "purchseCellDisable text-end"

                                    // }
                                    return cp
                                  }}
                                  // afterChange={(x, y) => cellChangeOfSupplies(x, y)}
                                  // afterRenderer={(TD, row, col, prop, value) => {
                                  //     if ((col == 1 || col == 2) && (isNaN(value) || value =='')) {
                                  //       TD.style.backgroundColor = "red";
                                  //     }
                                  //   }}
                                  width="100%"
                                  colWidths={100}
                                />

                              ) : (
                                <HotTable
                                  mergeCells={[{ row: 0, col: 0, rowspan: 1, colspan: 3 }]}
                                  // autoColumnSize={true}
                                  autoColumnSize={{
                                    samplingRatio: 23  // Adjust the samplingRatio as needed
                                  }}
                                  manualColumnResize={true}
                                  stretchH='all'
                                  rowHeights={RowSize}
                                  columnHeaderHeight={columnHeaderSize}
                                  ref={hotRef3}
                                  // style={{ overflowX: "hidden", textAlign: "center" }}
                                  data={[{ NatureOfSupplies: "No Data Found!" }]}
                                  cells={function (row, col) {
                                    var cp = {};

                                    if (col == 0) {

                                      cp.className = "text-center";
                                    }
                                    return cp;

                                  }}
                                  preventOverflow="horizontal"
                                  columns={handsontableColumns3}
                                  contextMenu={false}
                                  bindRowsWithHeaders={true}
                                  licenseKey="non-commercial-and-evaluation"
                                  height="auto"
                                  afterGetColHeader={theader}
                                  width="100%"
                                  colWidths={100}
                                  hiddenColumns={{
                                    columns: [3]
                                  }}
                                />
                              )}
                            </div>
                          </Col>
                        </Row>
                      </div>
                    </CardBody>
                  </Card>
                </div>

                <div>
                <div style={{ paddingLeft: "5px", paddingTop: "10px", paddingBottom: "6px", background: "navajowhite", marginBottom: "10px", marginTop: "10px" }}>
                  <h3 style={{ fontSize: "16px", fontWeight: "bold" }}> 4.Eligible ITC </h3>
                  </div>
                  <Card>
                    <CardBody className="CardBody p-0">
                      <div>
                        <Row>
                          <Col md={12}>
                            <div className="Gstr1-report">
                              {eligibleITCsDe?.length > 0 ? (
                                <HotTable
                                  data={eligibleITCsDe}
                                  autoColumnSize={{
                                    samplingRatio: 23  // Adjust the samplingRatio as needed
                                  }}
                                  manualColumnResize={true}
                                  stretchH='all'
                                  preventOverflow="horizontal"
                                  columns={eligbileColumns}
                                  contextMenu={false}
                                  bindRowsWithHeaders={true}
                                  rowHeights={RowSize}
                                  columnHeaderHeight={columnHeaderSize}
                                  licenseKey="non-commercial-and-evaluation"
                                  height="auto"
                                  ref={hotRefEligibeleITC}
                                  afterGetColHeader={theader}
                                  cells={function (row, col) {
                                    var cp = {};
                                    const hot = hotRefEligibeleITC?.current?.hotInstance;
                                    // cp.className = 'child';
                                    if (col > 0) {
                                      cp.className = 'text-end';
                                    }
                                    if (row == 0 || row == 6 || row == 9 || row == 11) {
                                      // if (row == 0 || row == 5 || row == 8 || row == 10) {
                                      cp.className = "boldRow";
                                    }
                                    // cp.readOnly = false    
                                    if (row == 0 || row == 6 || row == 9 || row == 11) {
                                      cp.readOnly = true;
                                    }
                                    // if (col === 3 && row != 8) {
                                    //   cp.className = "purchseCellDisable text-end";
                                    // }
                                    // if (row == 1 || row == 2) {
                                    //   if (col > 1 && col != 4) {
                                    //     cp.className = "purchseCellDisable text-end";
                                    //   }
                                    // }
                                    // if (row == 10) {
                                    //   if (col > 0) {
                                    //     cp.className = "purchseCellDisable text-end";
                                    //   }
                                    // }
                                    // if (row === eligibleITCsDe.length - 1) {
                                    //   if (col > 0) {
                                    //     cp.className = "purchseCellDisable text-end";
                                    //   }
                                    // }
                                    cp.readOnly = true;
                                    return cp;
                                  }}
                                  width="100%"
                                  colWidths={100}
                                />

                              ) : (
                                <HotTable
                                  mergeCells={[{ row: 0, col: 0, rowspan: 1, colspan: 5 }]}
                                  autoColumnSize={{
                                    samplingRatio: 23  // Adjust the samplingRatio as needed
                                  }}
                                  manualColumnResize={true}
                                  rowHeights={RowSize}
                                  columnHeaderHeight={columnHeaderSize}
                                  stretchH='all'
                                  data={[{ Details: "No Data Found!" }]}
                                  cells={function (row, col) {
                                    var cp = {};

                                    if (col == 0) {

                                      cp.className = "text-center";
                                    }
                                    return cp;

                                  }}
                                  preventOverflow="horizontal"
                                  columns={eligbileColumns}
                                  contextMenu={false}
                                  bindRowsWithHeaders={true}
                                  licenseKey="non-commercial-and-evaluation"
                                  height="auto"
                                  width="100%"
                                  colWidths={100}
                                  afterGetColHeader={theader}
                                  ref={hotRefEligibeleITC}

                                />
                              )}
                            </div>
                          </Col>
                        </Row>
                      </div>
                    </CardBody>
                  </Card>
                </div>

                <div>
                <div style={{ paddingLeft: "5px", paddingTop: "10px", paddingBottom: "6px", background: "navajowhite", marginBottom: "10px", marginTop: "10px" }}>
                  <h3 style={{ fontSize: "16px", fontWeight: "bold" }}>  5.Values of exempt, nil-rated and non-GST inward supplies </h3>
                </div>
                  <Card>
                    <CardBody className="CardBody p-0">
                      <div>
                        <Row>
                          <Col md={12}>
                            <div className="Gstr1-report">
                              {nilRatedDe?.length > 0 ? (
                                <HotTable
                                  data={nilRatedDe}
                                  autoColumnSize={{
                                    samplingRatio: 23  // Adjust the samplingRatio as needed
                                  }}
                                  manualColumnResize={true}
                                  stretchH='all'
                                  preventOverflow="horizontal"
                                  rowHeights={RowSize}
                                  columnHeaderHeight={columnHeaderSize}
                                  columns={exemptColumns}
                                  contextMenu={false}
                                  bindRowsWithHeaders={true}
                                  licenseKey="non-commercial-and-evaluation"
                                  height="auto"
                                  ref={hotRefExempt}
                                  afterGetColHeader={theader}
                                  mergeCells={false}
                                  cells={function (row, col) {
                                    var cp = {}
                                    const hot = hotRefExempt?.current?.hotInstance;
                                    // cp.className = 'child'
                                    if (col > 0) {
                                      cp.className = 'text-end'
                                    }
                                    // if (row == nilRatedDe.length - 1) {
                                    //   if (col > 0) {
                                    //     cp.className = "purchseCellDisable text-end"
                                    //   }
                                    // }

                                    cp.readOnly = true
                                    return cp
                                  }}
                                  width="100%"
                                  colWidths={100}
                                />

                              ) : (
                                <HotTable
                                mergeCells={[{ row: 0, col: 0, rowspan: 1, colspan: 3 }]}
                                autoColumnSize={{
                                    samplingRatio: 23  // Adjust the samplingRatio as needed
                                }}
                                manualColumnResize={true}
                                stretchH='all'
                                rowHeights={RowSize}
                                columnHeaderHeight={columnHeaderSize}
                                data={[{ NatureOfSupplies: "No Data Found!" }]}
                                cells={function (row, col) {
                                    var cp = {};

                                    if (col == 0) {

                                        cp.className = "text-center";
                                    }
                                    return cp;

                                }}
                                preventOverflow="horizontal"
                                columns={exemptColumns}
                                contextMenu={false}
                                bindRowsWithHeaders={true}
                                licenseKey="non-commercial-and-evaluation"
                                height="auto"
                                width="100%"
                                colWidths={100}
                                ref={hotRefExempt}
                                afterGetColHeader={theader}
                            />
                              )}
                            </div>
                          </Col>
                        </Row>
                      </div>
                    </CardBody>
                  </Card>
                </div>

                <div>
                <div style={{ paddingLeft: "5px", paddingTop: "10px", paddingBottom: "6px", background: "navajowhite", marginBottom: "10px", marginTop: "10px" }}>
                  <h3 style={{ fontSize: "16px", fontWeight: "bold" }}> 5.1 Interest and Late Fees for previous tax period </h3>
                  </div>
                  <Card>
                    <CardBody className="CardBody p-0">
                      <div>
                        <Row>
                          <Col md={12}>
                            <div className="Gstr1-report">
                              {lateFeeDe?.length > 0 ? (
                                <HotTable
                                  data={lateFeeDe}
                                  autoColumnSize={{
                                    samplingRatio: 23  // Adjust the samplingRatio as needed
                                  }}
                                  manualColumnResize={true}
                                  stretchH='all'
                                  preventOverflow="horizontal"
                                  columns={intersetAndLateFeesColumn}
                                  rowHeights={RowSize}
                                  columnHeaderHeight={columnHeaderSize}
                                  contextMenu={false}
                                  bindRowsWithHeaders={true}
                                  licenseKey="non-commercial-and-evaluation"
                                  height="auto"
                                  ref={hotRefIntersetLateFee}
                                  afterGetColHeader={theader}
                                  mergeCells={false}
                                  cells={function (row, col) {
                                    var cp = {}
                                    const hot = hotRefIntersetLateFee?.current?.hotInstance;
                                    // cp.className = 'child'
                                    if (col > 0) {
                                      cp.className = 'text-end'
                                    }
                                    // if (row == 2) {
                                    //   if (col > 0) {
                                    //     cp.className = "purchseCellDisable text-end";
                                    //   }
                                    // }
                                    // if (row == 1) {
                                    //   if (col == 1 || col == 4) {
                                    //     cp.className = "purchseCellDisable text-end";
                                    //   }
                                    // }
                                    cp.readOnly = true

                                    return cp
                                  }}
                                  width="100%"
                                  colWidths={100}

                                />

                              ) : (
                                <HotTable
                                mergeCells={[{ row: 0, col: 0, rowspan: 1, colspan: 5 }]}
                                autoColumnSize={{
                                    samplingRatio: 23  // Adjust the samplingRatio as needed
                                }}
                                manualColumnResize={true}
                                stretchH='all'
                                rowHeights={RowSize}
                                columnHeaderHeight={columnHeaderSize}
                                data={[{ Description: "No Data Found!" }]}
                                cells={function (row, col) {
                                    var cp = {};

                                    if (col == 0) {

                                        cp.className = "text-center";
                                    }
                                    return cp;

                                }}
                                preventOverflow="horizontal"
                                columns={intersetAndLateFeesColumn}
                                contextMenu={false}
                                bindRowsWithHeaders={true}
                                licenseKey="non-commercial-and-evaluation"
                                height="auto"
                                width="100%"
                                colWidths={100}
                                afterGetColHeader={theader}
                                ref={hotRefIntersetLateFee}
                            />
                              )}
                            </div>
                          </Col>
                        </Row>
                      </div>
                    </CardBody>
                  </Card>
                </div>


                <div>
                <div style={{ paddingLeft: "5px", paddingTop: "10px", paddingBottom: "6px", background: "navajowhite", marginBottom: "10px", marginTop: "10px" }}>
                  <h3 style={{ fontSize: "16px", fontWeight: "bold" }}> 6.1 Payment of Tax </h3>
                  </div>
                  <Card>
                    <CardBody className="CardBody p-0">
                      <div>
                        <Row>
                          <Col md={12}>
                            <div className="Gstr1-report">
                              {paymetnPage?.length > 0 ? (
                                <HotTable
                                  data={paymetnPage}
                                  ref={hotRef}
                                  stretchH="all"
                                  rowHeights={RowSize}
                                  columnHeaderHeight={columnHeaderSize}
                                  readOnly={true}
                                  autoColumnSize={{
                                    samplingRatio: 23  // Adjust the samplingRatio as needed
                                  }}
                                  manualColumnResize={true}
                                  height="auto"
                                  colHeaders={true}
                                  nestedHeaders={[
                                    ["", "", { label: "Paid through ITC", colspan: 4 }],
                                    [
                                      { label: "Description", data: "Description" },
                                      "<div>Other than <br> reverse charge <br> Tax payable <br> (₹)</div>",
                                      "Integrated Tax (₹)",
                                      "Central Tax(₹)",
                                      "State/UT Tax (₹)",
                                      "CESS(₹)",
                                      "<div>Other than <br> reverse <br> charge Tax <br> to be paid  <br> in Cash (₹) <div/>",
                                      "<div>Reverse <br> charge <br>  Tax <br> payable <br> (₹)<div/>",
                                      "<div> Reverse <br> charge <br> Tax to  be <br>  paid in <br> Cash (₹) <div/>",
                                      "Interest <br>  payable (₹)",
                                      "Interest  <br>  to be paid <br>  in Cash (₹)",
                                      "Late Fee  <br>  payable (₹)",
                                      "Late Fee  <br>  to be paid  <br> in Cash (₹)",
                                      "Utilizable Cash <br>  balance (₹)",
                                      "Additional Cash  <br>  required (₹)",
                                    ],
                                  ]}
                                  cells={function (row, col) {
                                    var cp = {};
                                    //   const hot = hotRefITC?.current?.hotInstance;
                                    if (col >= 1) {
                                      cp.className = "text-end";
                                      cp.readOnly = true;
                                    }
                                    // if (row == 0 || row == 1 || row == 2) {
                                    //   if (col == 5) {
                                    //     cp.className = "purchseCellDisable text-end"
                                    //   }
                                    // }
                                    // if (row == 1) {
                                    //   if (col == 4) {
                                    //     cp.className = "purchseCellDisable text-end"
                                    //   }
                                    // }
                                    // if (row == 3) {
                                    //   if (col == 2 || col == 3 || col == 4) {
                                    //     cp.className = "purchseCellDisable text-end"
                                    //   }
                                    // }
                                    // if (row == 2) {
                                    //   if (col == 3) {
                                    //     cp.className = "purchseCellDisable text-end"
                                    //   }
                                    // }
                                    // if (row == 0) {
                                    //   if (col == 11 || col == 12) {
                                    //     cp.className = "purchseCellDisable text-end"
                                    //   }
                                    // }
                                    // if (row == 3) {
                                    //   if (col == 11 || col == 12) {
                                    //     cp.className = "purchseCellDisable text-end"
                                    //   }
                                    // }
                                    cp.readOnly =true
                                    return cp;
                                  }}

                                  licenseKey="non-commercial-and-evaluation"
                                />

                              ) : (
                                <HotTable
                                  //  columns =  {computationColumns}
                                  data={[]}
                                  ref={hotRef}
                                  stretchH="all"
                                  height="auto"
                                  rowHeights={RowSize}
                                  autoColumnSize={{
                                    samplingRatio: 23  // Adjust the samplingRatio as needed
                                  }}
                                  manualColumnResize={true}
                                  columnHeaderHeight={columnHeaderSize}
                                  colHeaders={true}
                                  nestedHeaders={[
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
                                      "Utilizable Cash balance (₹)",
                                      "Additional Cash required (₹)",
                                    ],
                                  ]}
                                  cells={function (row, col) {
                                    var cp = {};
                                    //   const hot = hotRefITC?.current?.hotInstance;
                                    if (col > 0) {
                                      cp.className = "text-end";
                                      cp.readOnly = true;
                                    }
                                    return cp;
                                  }}
                                  licenseKey="non-commercial-and-evaluation"
                                />
                              )}
                            </div>
                          </Col>
                        </Row>
                      </div>
                    </CardBody>
                  </Card>
                </div>


              </AccordionBody>
            </AccordionItem>
          </Accordion>

        </div></div></>
  );
};

export default GSTR3bfiledPdf;
