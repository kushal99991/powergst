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
import Swal from "sweetalert2";
import errorCodeConfig from "../../../configs/apiErrorCodeConfig";

//** register Handsontable's modules
registerAllModules();


const GSTR1filedPdf = () => {
  // ** Hooks

  console.log("show printing")

  const [open, setOpen] = useState("1");
  const [gstr1PdfData, setGstr1PdfData] = useState([]);
  const [margeCell, setMargeCell] = useState([]);
  const [SearchCall, setSearchCall] = useState(false);
  const [block, setBlock] = useState(false);
  let paramsEncoded = window.location.href.split('?');
 // const [refId, setRerId] = useState(paramsEncoded[1])

  const hotRef = useRef(null);

  // ** Columne
  const gstr1PdfColumns = [
    {
      data: "description",
      title: "Description",
      width : 200,
      
    },
    {
      data: "noOfRecords",
      title: "<a> No Of <br> Record</a>",
      className : "text-center"
    },
    {
      data: "documentType",
      title: "<a>Document <br> Type</a>",
      className : "text-center"
    },
    {
      data: "invoiceValue",
      title: "Value  (₹)",
      className : "text-end"
    },
    {
      data: "igst",
      title: "<a>Integrate Tax <br>(₹) </a> ",
      className : "text-end"
    },
    {
      data: "cgst",
      title: "<a>Central Tax <br>(₹)</a>",
      className : "text-end"
    },
    {
      data: "sgst",
      title: "<a>State Tax <br>(₹)</a>",
      className : "text-end"
    },
    {
      data: "cess",
      title: "<a>Cess Tax <br>(₹)</a>  ",
      className : "text-end"
    },
  ];

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
    } catch(error)  {
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
    GSTR1DownloadService.gstr1GovtReturnErrorLogStatus(payLoad)
      .then((res) => {
        console.log("res", res.data.data);
        if (
          res.status === 200 &&
          res.data.status === errorCodeConfig.APIDefaultCode.Success
        ) {
          var result = Object.entries(res.data.data);
          let arrValue = setArrayValue(result);
          var result1 = arrValue;
          setGstr1PdfData(result1);
          setTimeout(() => {
            const hot = hotRef?.current?.hotInstance;
            hot?.getPlugin('mergeCells').merge()
            setBlock(false)
          }, 2000);
         
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

    <div style={{ width: "70%" ,  margin:"auto"  }}>
              
          <Accordion  open={open} toggle={toggle}>
              <AccordionItem>
                  <AccordionHeader targetId="1"  > CONSOLIDATED SUMMARY</AccordionHeader>
                  <AccordionBody accordionId="1">
                      <Card>
                          <CardBody className="CardBody p-0">
                              <div>
                                  <Row>
                                      <Col md={12}>
                                          <div className="Gstr1-report">
                                              {gstr1PdfData?.length > 0 ? (
                                                  <HotTable
                                                      autoColumnSize={true}
                                                      stretchH="all"
                                                      ref={hotRef}
                                                      id="Itc"
                                                      data={gstr1PdfData}
                                                      preventOverflow="horizontal"
                                                    
                                                      rowHeaders={function (index) {
                                                          return "";
                                                      } }
                                                      columns={gstr1PdfColumns}
                                                      nestedRows={true}
                                                      contextMenu={false}
                                                      // bindRowsWithHeaders={true}
                                                      licenseKey="non-commercial-and-evaluation"
                                                      height="auto"
                                                      readOnly={true}
                                                      rowHeights={25}
                                                      // hiddenColumns={{
                                                      //     columns: [7, 8, 9, 10]
                                                      // }}
                                                      // afterOnCellMouseDown={localAfterOnCellMouseDown}
                                                      mergeCells={[{row: 0, col: 0, rowspan: 1, colspan: 8 } , 
                                                        {row: 2, col: 0, rowspan: 1, colspan: 8 },
                                                        {row: 4, col: 0, rowspan: 1, colspan: 8 },
                                                        {row: 6, col: 0, rowspan: 1, colspan: 8 },
                                                        {row: 10, col: 0, rowspan: 1, colspan: 8 },    
                                                        {row: 14, col: 0, rowspan: 1, colspan: 8 },  
                                                        {row: 16, col: 0, rowspan: 1, colspan: 8 },     
                                                        {row: 18, col: 0, rowspan: 1, colspan: 8 },         
                                                        {row: 23, col: 0, rowspan: 1, colspan: 8 },  
                                                        {row: 25, col: 0, rowspan: 1, colspan: 8 },         
                                                        {row: 27, col: 0, rowspan: 1, colspan: 8 },
                                                        {row: 29, col: 0, rowspan: 1, colspan: 8 },   
                                                        {row: 33, col: 0, rowspan: 1, colspan: 8 },
                                                        {row: 37, col: 0, rowspan: 1, colspan: 8 },
                                                        {row: 39, col: 0, rowspan: 1, colspan: 8 },
                                                        {row: 39, col: 0, rowspan: 1, colspan: 8 },
                                                        {row: 41, col: 0, rowspan: 1, colspan: 8 },
                                                        {row: 43, col: 0, rowspan: 1, colspan: 8 },
                                                        {row: 45, col: 0, rowspan: 1, colspan: 8 },   
                                                        {row: 47, col: 0, rowspan: 1, colspan: 8 },   
                                                        {row: 49, col: 0, rowspan: 1, colspan: 8 },   
                                                        {row: 51, col: 0, rowspan: 1, colspan: 8 },  
                                                         {row: 53, col: 0, rowspan: 1, colspan: 8 }, 
                                                         {row: 57, col: 0, rowspan: 1, colspan: 8 }, 
                                                         {row: 59, col: 0, rowspan: 1, colspan: 8 }, 
                                                         {row: 61, col: 0, rowspan: 1, colspan: 8 }, 
                                                         {row: 63, col: 0, rowspan: 1, colspan: 8 }, 
                                                         {row: 65, col: 0, rowspan: 1, colspan: 8 }, 
                                                         {row: 67, col: 0, rowspan: 1, colspan: 8 }, 
                                                         {row: 69, col: 0, rowspan: 1, colspan: 8 },
                                                         {row: 71, col: 0, rowspan: 1, colspan: 8 }, 

                                                         {row: 75, col: 0, rowspan: 1, colspan: 8 }, 
                                                         {row: 77, col: 0, rowspan: 1, colspan: 8 }, 
                                                         {row: 79, col: 0, rowspan: 1, colspan: 8 }, 
                                                         {row: 81, col: 0, rowspan: 1, colspan: 8 }, 
                                                         {row: 83, col: 0, rowspan: 1, colspan: 8 }, 
                                                         {row: 85, col: 0, rowspan: 1, colspan: 8 }, 
                                                         {row: 87, col: 0, rowspan: 1, colspan: 8 }, 
                                                         {row: 89, col: 0, rowspan: 1, colspan: 8 }, 
                                                         {row: 91, col: 0, rowspan: 1, colspan: 8 }, 
                                                         {row: 93, col: 0, rowspan: 1, colspan: 8 }, 

                                                      ]}
                                                    
                                                      cells={function (row, col) {
                                                          var cp = {};
                                                          const hot = hotRef?.current?.hotInstance;
                                                          const srNumber = hot?.getSourceDataAtRow(row)["isMerge"];

                                                          if (srNumber == true) {
                                                              cp.className = "boldRow";
                                                          }

                                                          if (row > 0) {
                                                            if (row == 95) {
                                                              //  cp.className = "boldRow";
    
                                                                if (col == 0) {
                                                                  cp.className = "boldRow";
                                                                }
    
                                                              
                                                                if (col > 1 ) {
                                                                  cp.className = "text-end boldRow";
                                                                }
    
                                                              }
    
                                                              // ** 5A - Taxable outward							
                                                               if ((col === 5 || col === 6 ) && (row == 5 || row == 6 || row == 7 || row == 8 ||  row == 9   )) {
                                                                cp.className = "purchseCellDisable"
                                                               }
    
                                                               if ((col === 4 || col === 7 ) &&  row == 9) {
                                                                cp.className = "purchseCellDisable"
                                                               }
    
                                                               // ** 6A - Exports
                                                               if ((col === 5 || col === 6 ) && (row == 11 || row == 12 || row == 13 )) {
                                                                cp.className = "purchseCellDisable"
                                                               }
    
                                                               if ((col === 4 || col === 7 ) &&  row == 13) {
                                                                cp.className = "purchseCellDisable"
                                                               }
    
                                                               //** 8 - Nil rated, exempted and non GST outward supplies
                                                               if ((col === 4 || col === 5 || col === 6 || col === 7 ) && (row == 19 || row == 20 || row == 21 || row == 22 )) {
                                                                cp.className = "purchseCellDisable"
                                                               }
    
                                                               // ** 9A - Amendment to Inter-State supplies 
                                                               if (( col === 5 || col === 6 ) && (row == 27 || row == 28 )) {
                                                                cp.className = "purchseCellDisable"
                                                               }
    
                                                                 // ** 9A - Amendment to Export supplies
                                                                 if (( col === 5 || col === 6 ) && (row == 30 || row == 31  || row == 32  )) {
                                                                  cp.className = "purchseCellDisable"
                                                                 }
    
                                                                 if (( col === 4 || col === 7 ) && (row == 32 )) {
                                                                  cp.className = "purchseCellDisable"
                                                                 }
                                                              
                                                                 // ** 9A - Amendment to supplies made to SEZ
                                                                 if (( col === 5 || col === 6 ) && (row == 34 || row == 35  || row == 36 )) {
                                                                  cp.className = "purchseCellDisable"
                                                                 }
    
                                                                 if (( col === 4 || col === 7 ) && (row == 36  )) {
                                                                  cp.className = "purchseCellDisable"
                                                                 }
                                                          
                                                          }

                                                          return cp;
                                                      } }
                                                      autoWrapRow={true}
                                                      colWidths={100} />
                                              ) : (
                                                  <HotTable
                                                      rowHeights={30}
                                                      autoColumnSize={true}
                                                      stretchH="all"
                                                      style={{ textAlign: "center" }}
                                                      data={[{ srNo: "No Data Found!" }]}
                                                      mergeCells={[
                                                          { row: 0, col: 0, rowspan: 1, colspan: 8 },
                                                      ]}
                                                      rowHeaders={function (index) {
                                                          return "";
                                                      } }
                                                      cells={function (row, col) {
                                                        var cp = {};
                                                        const hot = hotRef?.current?.hotInstance;
                                                        const srNumber = hot?.getSourceDataAtRow(row)["isMerge"];

                                                        if (srNumber == true) {
                                                            cp.className = "boldRow";
                                                        }

                                                        if (row == 95) {
                                                        //  cp.className = "boldRow";

                                                          if (col == 0) {
                                                            cp.className = "boldRow";
                                                          }

                                                        
                                                          if (col > 1 ) {
                                                            cp.className = "text-end boldRow";
                                                          }

                                                        }

                                                        // ** 5A - Taxable outward							
                                                         if ((col === 5 || col === 6 ) && (row == 5 || row == 6 || row == 7 || row == 8 ||  row == 9   )) {
                                                          cp.className = "purchseCellDisable"
                                                         }

                                                         if ((col === 4 || col === 7 ) &&  row == 9) {
                                                          cp.className = "purchseCellDisable"
                                                         }

                                                         // ** 6A - Exports
                                                         if ((col === 5 || col === 6 ) && (row == 11 || row == 12 || row == 13 )) {
                                                          cp.className = "purchseCellDisable"
                                                         }

                                                         if ((col === 4 || col === 7 ) &&  row == 13) {
                                                          cp.className = "purchseCellDisable"
                                                         }

                                                         //** 8 - Nil rated, exempted and non GST outward supplies
                                                         if ((col === 4 || col === 5 || col === 6 || col === 7 ) && (row == 19 || row == 20 || row == 21 || row == 22 )) {
                                                          cp.className = "purchseCellDisable"
                                                         }

                                                         // ** 9A - Amendment to Inter-State supplies 
                                                         if (( col === 5 || col === 6 ) && (row == 27 || row == 28 )) {
                                                          cp.className = "purchseCellDisable"
                                                         }

                                                           // ** 9A - Amendment to Export supplies
                                                           if (( col === 5 || col === 6 ) && (row == 30 || row == 31  || row == 32  )) {
                                                            cp.className = "purchseCellDisable"
                                                           }

                                                           if (( col === 4 || col === 7 ) && (row == 32 )) {
                                                            cp.className = "purchseCellDisable"
                                                           }
                                                        
                                                           // ** 9A - Amendment to supplies made to SEZ
                                                           if (( col === 5 || col === 6 ) && (row == 34 || row == 35  || row == 36 )) {
                                                            cp.className = "purchseCellDisable"
                                                           }

                                                           if (( col === 4 || col === 7 ) && (row == 36  )) {
                                                            cp.className = "purchseCellDisable"
                                                           }

                                                        
                                                      
                                                        return cp;
                                                    } }
                                                      columns={gstr1PdfColumns}
                                                      nestedRows={true}
                                                      contextMenu={false}
                                                      bindRowsWithHeaders={true}
                                                      licenseKey="non-commercial-and-evaluation"
                                                      height="auto"
                                                      readOnly={true}
                                                      colWidths={100} />
                                              )}
                                          </div>
                                      </Col>
                                  </Row>
                              </div>
                          </CardBody>
                      </Card>
                  </AccordionBody>
              </AccordionItem>
          </Accordion>
          
      </div></div></>
  );
};

export default GSTR1filedPdf;
