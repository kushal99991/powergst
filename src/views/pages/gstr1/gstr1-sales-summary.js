import { Fragment, useRef } from "react";
import { Col, Label, Row, Button } from "reactstrap";
import { HotTable } from "@handsontable/react";
import { selectThemeColors } from "@utils";
import Select from "react-select";
import { useState } from "react";
import { SELECT_MAXSIZE } from "../../../configs/config";
import toast from "react-hot-toast";
import makeAnimated from "react-select/animated";
import { useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import gstr1SummaryServices from "../../../services/gstr1/gstr1Services/gstr1SummaryServices";
import Swal from "sweetalert2";
import errorCodeConfig from "@configs/apiErrorCodeConfig";
import { registerRenderer, textRenderer } from "handsontable/renderers";
import { registerAllModules } from "handsontable/registry";

import { globleVariable } from "@configs/globalVariable";
import LocalFunction from "@configs/getLocalFunction";
import SessionFunction from "@configs/getSessionFunction";
import { RowSize, columnHeaderSize } from "@configs/config";

import { ArrowRight, ArrowLeft , FileText } from "react-feather";
import withReactContent from "sweetalert2-react-content";
import NilReturnFillingFunc from "./nilReturnFillingFunc"
import GSTR1DownloadService from "../../../services/gstr1/gstr1Services/gstr1DownloadService";
import { urlEndpointConfig } from "@configs/urlEndpoint";

const MySwal = withReactContent(Swal);

const finYearOption = LocalFunction.getLocalValue(
  globleVariable.rangeFilters,
  true
);
const YearList =
  finYearOption !== undefined &&
    finYearOption !== null &&
    finYearOption !== "" &&
    finYearOption !== "undefined"
    ? JSON.parse(finYearOption)
    : [];

registerAllModules();

const typeofInvoices = [];

const Gstr1SalesSummary = () => {

  // const { processToFileFunc , generateSummaryFunc }  = NilReturnFillingFunc();

  const gtsr1DataColumn = [
    {
      data: "typeofInvoice",
      readOnly: true,
      title: "Type Of Invoice",
      // width: '400'
    },
    {
      data: "documentCount",
      readOnly: true,
      title: "Document Count",
    },
    {
      data: "totalTaxableAmount",
      readOnly: true,
      title: "Taxable Amount (₹)",
    },
    {
      data: "igst",
      readOnly: true,
      title: "IGST (₹)",
    },
    {
      data: "cgst",
      readOnly: true,
      title: "CGST (₹)",
    },
    {
      data: "sgst",
      readOnly: true,
      title: "SGST (₹)",
    },
    {
      data: "cess",
      readOnly: true,
      title: "CESS (₹)",
    },
    {
      data: "totalTaxAmount",
      readOnly: true,
      title: "Total Tax (₹)",
    },
    {
      data: "typeofInvoiceId",
      readOnly: true,
      title: "typeofInvoiceId",
    },
  ];

  const [searchData, setSearchData] = useState(false);
  const navigate = useNavigate();
  const animatedComponents = makeAnimated();
  const [panDataFrom, setPanDataFrom] = useState([]);
  const [panData, setPanData] = useState([]);
  const [displayType, setDisplayType] = useState([]);
  const [finFromYear, setFinFormYear] = useState(null);
  const [monthFrom, setMonthFrom] = useState(null);
  const hotRef = useRef(null);
  const hotRefAmendment = useRef(null);
  const { setGSRT1Data, datas, setDatas, block, setBlock, stepper,wizardBtn } =
    useOutletContext();

  const [data, setData] = useState([]);

  const G_UCParId =
    sessionStorage.getItem(globleVariable.G_UCParId) &&
    SessionFunction.getSessionValue(globleVariable.G_UCParId, true);
  const G_GSTIN =
    sessionStorage.getItem(globleVariable.G_GSTIN) &&
    SessionFunction.getSessionValue(globleVariable.G_GSTIN, true);
  const gstr1Range =
    sessionStorage.getItem(globleVariable.defaultYear) &&
    SessionFunction.getSessionValue(globleVariable.defaultYear, true);

    const clientId =
    sessionStorage.getItem(globleVariable.G_UCParId) &&
    SessionFunction.getSessionValue(globleVariable.G_UCParId, true);

    const userIds =
    localStorage.getItem(globleVariable.userId) &&
    LocalFunction.getLocalValue(globleVariable.userId, true);

  useEffect(() => {
    let activeTabData = {
      InvoiceList: datas,
    };
    setGSRT1Data(true, activeTabData);

  }, [datas]);

  useEffect(() => {
    setPanDataFrom(YearList);
    setPanData(YearList);
    setDisplayType(true);
    setGSRT1Data(true);
  }, []);

  const theader = (col, TH) => {
    if (col == 0) {
      TH.className = "htLeft";
    } else {
      TH.className = "htRight";
    }
  };

  useEffect(() => {
    if(wizardBtn == 2){
    finFromYear !== null && GSTR1SalesSummaryService();
    }
  }, [monthFrom, finFromYear,wizardBtn]);

  useEffect(() => {
    return () => setBlock(false);
  }, []);

  useEffect(() => {
    console.log("default value");

    if (displayType == true) {
      let defaultValueFrom = null;
      let defaultValueTo = null;
      if (
        gstr1Range !== null &&
        gstr1Range !== "" &&
        gstr1Range !== undefined
      ) {
        console.log("set from date");
        defaultValueFrom = panData?.filter(
          (item) => item.value == gstr1Range
        )[0];
      } else {
        defaultValueFrom = panData?.filter(
          (item) =>
            Number(item.value) ==
            Number(
              sessionStorage.getItem(globleVariable.defaultYear) &&
              SessionFunction.getSessionValue(
                globleVariable.defaultYear,
                true
              )
            )
        )[0];
      }


      if (
        defaultValueFrom !== undefined &&
        defaultValueFrom !== null &&
        defaultValueFrom !== ""
      ) {
        setFinFormYear(defaultValueFrom);
        sessionStorage.setItem("gstr1DownloadFromDt", defaultValueFrom?.value);
        SessionFunction.setSessionValue(
          globleVariable.gstr1FromDt,
          defaultValueFrom?.value,
          true
        );
      }

    }
  }, [displayType]);

  const selectFromYear = (value) => {
    console.log("value=", value);
    setFinFormYear(value);
    const setDt =
      Number(monthFrom?.srNo) > Number(value?.srNo)
        ? monthFrom
        : panDataFrom[0];
    const x = panDataFrom?.filter(
      (item) => Number(item.srNo) >= Number(value.srNo)
    );
    sessionStorage.setItem("gstr1DownloadFromDt", value?.value);
    SessionFunction.setSessionValue(
      globleVariable.gstr1FromDt,
      value?.value,
      true
    );

    setMonthFrom(setDt);
    setPanData(x);
  };

  function localAfterOnCellMouseDown(event, coords, td) {
    const hot = hotRef?.current?.hotInstance;

    if (coords.row !== -1 && coords.col < 1) {
      const typeofInvoiceId = hot.getDataAtRow(coords.row)[8];
      const data = hot.getDataAtRow(coords.row)[0];

      navigate("/gst-returns/gstr1-sales/gstr1-summary-details", {
        state: {
          titles: data,
          finyear: finFromYear.value,
          finmonth: finFromYear?.label,
          sectionId: coords.row,
          // sectionType: arrTypes
        },
      });
    }
  }
  function localAfterOnCellMouseDownAmendment(event, coords, td) {
    const hot = hotRefAmendment?.current?.hotInstance;

    if (coords.row !== -1 && coords.col < 1) {
      const typeofInvoiceId = hot.getDataAtRow(coords.row)[8];
      const data = hot.getDataAtRow(coords.row)[0];

      navigate("/gst-returns/gstr1-sales/gstr1-summary-details", {
        state: {
          titles: "",
          finyear: finFromYear.value,
          finmonth: finFromYear.value,
          sectionId: typeofInvoiceId,
          // sectionType: arrTypes
        },
      });
    }
  }

  const GSTR1SalesSummaryService = () => {

    sessionStorage.removeItem("gstR1AckNumber");
    setBlock(true);
    gstr1SummaryServices
      .getGSTR1Summary(G_UCParId, gstr1Range, gstr1Range)
      .then((res) => {
        if (
          res.status === 200 &&
          res.data.status === errorCodeConfig.APIDefaultCode.Success
        ) {
          setBlock(false);
          setData(res.data.data);
          setDatas(res.data.data);
          setSearchData(true);
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


 // ** Nil Return Filling
  const NilReturnFilling = () => {
    return MySwal.fire({
      title: "Are you sure you want to file nil return for " +  finFromYear?.label ,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      customClass: {
        confirmButton: "btn btn-danger",
        cancelButton: "btn btn-outline-dark ms-1",
      },
      buttonsStyling: false,
    }).then(function (result) {
      if (result.value) {

        const payLoad = {
          userClientId: clientId,
          userId: userIds,
          returnPeriod: sessionStorage.getItem("gstr1DownloadFromDt"),
          loggedGSTIN: G_GSTIN,
          isNilFiling : true
        };
        processToFileFunc(payLoad)

      }
    })

  }


  const errorMsg = (err) => {
    Swal.fire({
      icon: "warning",
      title: "",
      text: err,
      customClass: {
        confirmButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });
  }


   // ** Process-to-file
   const processToFileFunc = (payLoad ) => {
    debugger
    setBlock(true)
    GSTR1DownloadService.proceedFileGstr1Govt(payLoad)
      .then((res) => {
        if (res.data.status === errorCodeConfig.APIDefaultCode.GovtOTPExpire) {
          setBlock(false)
           toast.error(res?.data?.errorMessage, {
              position: "top-right",
            });

            setTimeout(() => {
              navigate(urlEndpointConfig.REQUESTOTP)
            }, 200);

         } else {
          if (
            res.status === 200 &&
            res.data.status === errorCodeConfig.APIDefaultCode.Success
          ) {
            generateSummaryFunc(payLoad)
          } else {
            stepper.to(1);
            setBlock(false)
            errorMsg(res?.data?.errorMessage);
          }
        }
      })
      .catch((error) => {
        stepper.to(1);
        setBlock(false)
        errorMsg(error?.message);
      });
  };


  // ** Generate-summary
  const generateSummaryFunc = (payLoad) => {
     GSTR1DownloadService.getGstr1SummaryGovt(payLoad)
       .then((res) => {
         if (res.data.status === errorCodeConfig.APIDefaultCode.GovtOTPExpire) {
          setBlock(false)
           toast.error(res?.data?.errorMessage, {
             position: "top-right",
           });

           setTimeout(() => {
             navigate(urlEndpointConfig.REQUESTOTP)
           }, 200);

         } else {
           if (
             res.status === 200 &&
             res.data.status === errorCodeConfig.APIDefaultCode.Success
           ) {
            setBlock(false)
             toast.success(res?.data?.successMessage, {
               position: "top-right",
             });
             stepper.to(6);

           } else {
            stepper.to(5);
            setBlock(false)
             errorMsg(res?.data?.errorMessage);
           }
         }

       })
       .catch((error) => {
        stepper.to(5);
        setBlock(false)
        errorMsg(error?.message);
       });
   };



  return (
    <Fragment>
      {block && <div className="loading1">Loading&#8230;</div>}

      <div className="content-header-left col-md-12 col-12">
        <div className="row breadcrumbs-top mb-1">
          <div className="col-md-6"></div>
          <div className="col-md-6">

            <div className="row">
              <div className="col-md-12">
                <div className="row">
                  <div className="col-md-5"></div>
                  <Label className="form-label col-md-4 pt-half text-end">
                    Return Period
                  </Label>
                  <Select
                    id="from"
                    placeholder="From"
                    isClearable={false}
                    theme={selectThemeColors}
                    closeMenuOnSelect={true}
                    options={panDataFrom}
                    className="basic-multi-select col-md-3 ps-0"
                    classNamePrefix="select"
                    components={animatedComponents}
                    onChange={selectFromYear}
                    value={finFromYear}
                    maxMenuHeight={SELECT_MAXSIZE}
                    isDisabled={true}
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
      <div className="col-12 ">
        <Row className="mb-2">
          <Col md={12}>
            {/* {data?.length > 0 ?  */}
            {datas?.length > 0 ? (
              <HotTable
                rowHeights={RowSize}
                columnHeaderHeight={columnHeaderSize}
                autoWrapRow={true}
                data={datas.slice(0, 11)}
                // data={data.slice(0, 11)}
                autoColumnSize={true}
                afterGetColHeader={theader}
                stretchH="all"
                preventOverflow="horizontal"
                columns={gtsr1DataColumn}
                contextMenu={false}
                bindRowsWithHeaders={true}
                licenseKey="non-commercial-and-evaluation"
                height="auto"
                ref={hotRef}
                afterOnCellMouseDown={localAfterOnCellMouseDown}
                mergeCells={false}
                hiddenColumns={{
                  columns: [8],
                }}
                cells={function (row, col) {
                  var cp = {};
                  const hot = hotRef?.current?.hotInstance;
                  cp.className = "child";
                  if (col == 0) {
                    cp.className = "text-danger myRow";
                  }
                  if (col > 0) {
                    cp.className = "text-end";
                  }

                  return cp;
                }}
              />
            ) : (
              <HotTable
              rowHeights={RowSize}
              columnHeaderHeight={columnHeaderSize}
                autoWrapRow={true}
                afterGetColHeader={theader}
                mergeCells={[{ row: 0, col: 0, rowspan: 1, colspan: 8 }]}
                autoColumnSize={true}
                stretchH="all"
                style={{ overflowX: "hidden", textAlign: "center" }}
                data={[{ typeofInvoice: "No Data Found!" }]}
                preventOverflow="horizontal"
                columns={gtsr1DataColumn}
                contextMenu={false}
                bindRowsWithHeaders={true}
                hiddenColumns={{
                  columns: [8],
                }}
                licenseKey="non-commercial-and-evaluation"
                height="auto"
              />
            )}
          </Col>
          <div>
            <h2 className="mt-2 mb-1">Amendment Data</h2>
          </div>
          <Col md={12}>
            {datas?.length > 0 ? (
              <HotTable
              rowHeights={RowSize}
              columnHeaderHeight={columnHeaderSize}

                data={datas.slice(11)}

                afterGetColHeader={theader}
                stretchH="all"
                preventOverflow="horizontal"
                columns={gtsr1DataColumn}
                contextMenu={false}
                bindRowsWithHeaders={true}
                licenseKey="non-commercial-and-evaluation"
                height="auto"
                ref={hotRefAmendment}
                autoWrapRow={true}
                afterOnCellMouseDown={localAfterOnCellMouseDownAmendment}
                mergeCells={false}
                hiddenColumns={{
                  columns: [8],
                }}
                cells={function (row, col) {
                  var cp = {};
                  const hot = hotRefAmendment?.current?.hotInstance;
                  cp.className = "child";
                  if (col == 0) {
                    cp.className = "text-danger myRow";
                  }
                  if (col > 0) {
                    cp.className = "text-end";
                  }

                  return cp;
                }}

              />
            ) : (
              <HotTable
              rowHeights={RowSize}
              columnHeaderHeight={columnHeaderSize}
                mergeCells={[{ row: 0, col: 0, rowspan: 1, colspan: 8 }]}
                autoColumnSize={true}
                stretchH="all"
                afterGetColHeader={theader}
                autoWrapRow={true}
                style={{ overflowX: "hidden", textAlign: "center" }}
                data={[{ typeofInvoice: "No Data Found!" }]}
                preventOverflow="horizontal"
                columns={gtsr1DataColumn}
                contextMenu={false}
                hiddenColumns={{
                  columns: [8],
                }}
                bindRowsWithHeaders={true}
                licenseKey="non-commercial-and-evaluation"
                height="auto"
              />
            )}
          </Col>
        </Row>
      </div>

      <div style={{ zIndex: "999", }} className='btnFixFooter'>
    <div className="container">
      <div style={{ margintop: "25px" }} className="d-flex justify-content-between">
        <Button color="danger" className="btn-prev" onClick={() => stepper.previous()}>
          <ArrowLeft
            size={14}
            className="align-middle me-sm-25 me-0"
          ></ArrowLeft>
          <span className="align-middle d-sm-inline-block d-none">
            Previous
          </span>
        </Button>


        <div>
            <Button
          color="danger"
          className="btn-next me-1"
          onClick={() => NilReturnFilling() } >
            <FileText
            size={14}
            className="align-middle ms-sm-25 ms-1"
            style={{marginRight:"5px"}}
          ></FileText>
          <span className="align-middle d-sm-inline-block d-none">File Nil Return</span>

        </Button>

        <Button
          color="danger"
          className="btn-next"
          onClick={() => stepper.next()} >
          <span className="align-middle d-sm-inline-block d-none">Next</span>
          <ArrowRight
            size={14}
            className="align-middle ms-sm-25 ms-0"
          ></ArrowRight>
        </Button>
      </div>

      </div>
    </div>
    </div>
    </Fragment>
  );
};

export default Gstr1SalesSummary;
