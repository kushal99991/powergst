import { Fragment, useRef } from "react";
import { Button, Col, Label, Row } from "reactstrap";
import { HotTable } from "@handsontable/react";
import { selectThemeColors } from "@utils";
import Select from "react-select";
import { useState } from "react";
import {
  RowSize,
  SELECT_MAXSIZE,
  columnHeaderSize,
} from "../../../configs/config";
import toast from "react-hot-toast";
import makeAnimated from "react-select/animated";
import { useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import Swal from "sweetalert2";
import { registerAllModules } from "handsontable/registry";
import { globleVariable } from "../../../configs/globalVariable";
import LocalFunction from "../../../configs/getLocalFunction";
import SessionFunction from "../../../configs/getSessionFunction";
import { getGSTR1FiledSummary } from "../../apps/user/store";
import { useDispatch, useSelector } from "react-redux";
import { Search, ArrowRight, ArrowLeft, FileText } from "react-feather";
import { textRenderer } from "handsontable/renderers";
import withReactContent from "sweetalert2-react-content";
import NilReturnFillingFunc from "./nilReturnFillingFunc";
import errorCodeConfig from "@configs/apiErrorCodeConfig";
import GSTR1DownloadService from "../../../services/gstr1/gstr1Services/gstr1DownloadService";
import { urlEndpointConfig } from "@configs/urlEndpoint";
import encryptData from "../../../auth/crypto/crypto"
const MySwal = withReactContent(Swal);

const finYearOption =
  localStorage.getItem(globleVariable.rangeFilters) &&
  LocalFunction.getLocalValue(globleVariable.rangeFilters, true);
const YearList =
  finYearOption !== undefined &&
    finYearOption !== null &&
    finYearOption !== "" &&
    finYearOption !== "undefined"
    ? JSON.parse(finYearOption)
    : [];

registerAllModules();

const Gstr1FileDataSummary = ({
  setGSRT1Data,
  wizardBtn,
  block,
  setBlock,
  downloadStart,
  setDownloadStart,
  stepper,
  setWizardBtn
}) => {
  //  const { processToFileFunc, generateSummaryFunc } = NilReturnFillingFunc();

  const gstrfiledDataState = useSelector(
    (state) => state?.users?.GSTR1FiledSummary[0]?.Summary
  );
  useEffect(() => {
    if(gstrfiledDataState?.length > 0 ){
      setDownloadStart(false)
    }
  },[gstrfiledDataState])

  const gtsr1DataColumn = [
    {
      data: "TypeofInvoice",
      readOnly: true,
      title: "Type Of Invoice",
      width: "320",
    },
    {
      data: "DocumentCount",
      readOnly: true,
      title: "Document Count",
      width: "120",
    },
    {
      data: "TotalTaxableAmount",
      readOnly: true,
      title: "Taxable Amount (₹)",
      width: "130",
    },
    {
      data: "IGST",
      readOnly: true,
      title: "IGST (₹)",
    },
    {
      data: "CGST",
      readOnly: true,
      title: "CGST (₹)",
    },
    {
      data: "SGST",
      readOnly: true,
      title: "SGST (₹)",
    },
    {
      data: "Cess",
      readOnly: true,
      title: "CESS (₹)",
    },
    {
      data: "TotalTaxAmount",
      readOnly: true,
      title: "Total Tax (₹)",
    },
    {
      data: "TypeofInvoiceId",
      readOnly: true,
      title: "typeofInvoiceId",
    },
  ];

  const gstr1FiledFromDt =
    sessionStorage?.getItem(globleVariable?.gstr1FiledFromDt) &&
    SessionFunction?.getSessionValue(globleVariable?.gstr1FiledFromDt, true);
  const gstr1FiledToDt =
    sessionStorage?.getItem(globleVariable?.gstr1FiledToDt) &&
    SessionFunction?.getSessionValue(globleVariable?.gstr1FiledToDt, true);
  const isdefaultYear =
    sessionStorage.getItem(globleVariable.defaultYear) &&
    SessionFunction.getSessionValue(globleVariable.defaultYear, true);
  const isG_UCParId =
    sessionStorage.getItem(globleVariable.G_UCParId) &&
    SessionFunction.getSessionValue(globleVariable.G_UCParId, true);

  const navigate = useNavigate();
  const animatedComponents = makeAnimated();
  const [panDataFrom, setPanDataFrom] = useState([]);
  const [panData, setPanData] = useState([]);
  const [displayType, setDisplayType] = useState([]);
  const [finFromYear, setFinFormYear] = useState(null);
  const [monthFrom, setMonthFrom] = useState(null);
  const [monthFromForApi, setMonthFromForApi] = useState(null);
  const hotRef = useRef(null);
  const hotRefAmendment = useRef(null);

  const [data, setData] = useState([]);

  const dispatch = useDispatch();

  const clientId =
    sessionStorage.getItem(globleVariable.G_UCParId) &&
    SessionFunction.getSessionValue(globleVariable.G_UCParId, true);
  const subId =
    localStorage.getItem(globleVariable.subscriptionId) &&
    LocalFunction.getLocalValue(globleVariable.subscriptionId, true);
  const GGSTIN =
    sessionStorage.getItem(globleVariable.G_GSTIN) &&
    SessionFunction.getSessionValue(globleVariable.G_GSTIN, true);

  const userIds =
    localStorage.getItem(globleVariable.userId) &&
    LocalFunction.getLocalValue(globleVariable.userId, true);

  useEffect(() => {
    setPanDataFrom(YearList);
    setPanData(YearList);
    setDisplayType(true);
    setGSRT1Data(true);
  }, []);

  useEffect(() => {
    if (wizardBtn == 0 && finFromYear !== null) {
      const userData = {
        clientid: clientId,
        finyear: finFromYear?.value,
        finmonth: monthFrom?.value,
        subscriptionId: subId,
        gstNumber: GGSTIN,
        upload: false,
      };

      setBlock(true);
      dispatch(getGSTR1FiledSummary(userData));
    }
  }, [wizardBtn, monthFromForApi]);

  useEffect(() => {
    if (wizardBtn == 0) {
      if (gstrfiledDataState) {
        setBlock(false);
        //*** Set Data As per RequireMent And Hide other Data (Show Only B2B,CDNR,CDNUR,EXP,HSN)
        const indexes = [0, 3, 4, 5, 9];
        const selectedData = indexes.map(index => gstrfiledDataState[index]);
        // setData(selectedData);
        setData(selectedData);

      }
    }
  }, [gstrfiledDataState, wizardBtn]);

  useEffect(() => {
    return () => setBlock(false);
  }, []);

  useEffect(() => {
    if (displayType == true) {
      let defaultValueFrom = null;
      let defaultValueTo = null;

      defaultValueFrom = panData?.filter(
        (item) => Number(item.value) == Number(isdefaultYear)
      )[0];

      defaultValueTo = panData?.filter(
        (item) => Number(item.value) == Number(isdefaultYear)
      )[0];

      if (
        defaultValueFrom !== undefined &&
        defaultValueFrom !== null &&
        defaultValueFrom !== ""
      ) {
        setFinFormYear(defaultValueFrom);
        setMonthFromForApi(defaultValueFrom);
        // sessionStorage.setItem('gstr1FiledFromDt', defaultValueFrom?.value)
        SessionFunction.setSessionValue(
          globleVariable.gstr1FiledFromDt,
          defaultValueFrom?.value,
          true
        );
      }
      if (
        defaultValueTo !== undefined &&
        defaultValueTo !== null &&
        defaultValueTo !== ""
      ) {
        setMonthFrom(defaultValueTo);
        SessionFunction.setSessionValue(
          globleVariable.gstr1FiledToDt,
          defaultValueTo?.value,
          true
        );
      }
    }
  }, [displayType, wizardBtn]);

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

    setMonthFrom(setDt);
    setPanData(x);
  };

  const theader = (col, TH) => {
    if (col == 0) {
      TH.className = "htLeft";
    } else {
      TH.className = "htRight";
    }
  };

  function localAfterOnCellMouseDown(event, coords, td) {
    const hot = hotRef?.current?.hotInstance;

    if (coords.row !== -1 && coords.col < 1) {
      const typeofInvoiceId = hot.getDataAtRow(coords.row)[8];
      const data = hot.getDataAtRow(coords.row)[0];
      const encrypData = encryptData.encrypt(`s=${typeofInvoiceId}&r=${0}&f=${0}&fr=${finFromYear.value
      }&to=${monthFrom.value}`);
      const redirectUrl = `/reports/gstr1-filed-data/gstr1-file-data-details?${encrypData} `;

      window.open(redirectUrl.toString(), "_blank");
    }
  }
  
  // function localAfterOnCellMouseDownAmendment(event, coords, td) {
  //   const hot = hotRefAmendment?.current?.hotInstance;

  //   if (coords.row !== -1 && coords.col < 1) {
  //     const typeofInvoiceId = hot.getDataAtRow(coords.row)[8];
  //     const data = hot.getDataAtRow(coords.row)[0];

  //     const redirectUrl = `/reports/gstr1-filed-data/gstr1-file-data-details?s=${typeofInvoiceId}&r=${0}&f=${0}&fr=${finFromYear.value
  //       }&to=${monthFrom.value}`;

  //     window.open(redirectUrl.toString(), "_blank");
  //   }
  // }

  useEffect(() => {
    if (downloadStart) {
      const userData = {
        clientid: clientId,
        finyear: finFromYear?.value,
        finmonth: monthFrom?.value,
        subscriptionId: subId,
        gstNumber: GGSTIN,
        upload: false,
      };

      setBlock(true);
      dispatch(getGSTR1FiledSummary(userData));
    }
  }, [downloadStart]);

  function emptyRender(instance, td, row, col, prop, value, cellProperties) {
    textRenderer.apply(this, arguments);
    if (
      col == 1 ||
      col == 2 ||
      col == 3 ||
      col == 4 ||
      col == 5 ||
      col == 6 ||
      col == 7
    ) {
      let currnecyVal =
        col == 1
          ? formatTotalWithoutDecimal(Number(value))
          : formatINR(Number(value));

      if (currnecyVal !== 0) {
        td.innerText = currnecyVal;
      }
    }
  }

  function formatINR(x) {
    return x.toLocaleString("en-IN", { minimumFractionDigits: 2 });
  }

  function formatTotalWithoutDecimal(x) {
    return x.toLocaleString("en-IN");
  }

  const NilReturnFilling = () => {
    return MySwal.fire({
      title:
        "Are you sure you want to file nil return for " + finFromYear?.label,
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
          loggedGSTIN: GGSTIN,
          isNilFiling: true,
        };

        processToFileFunc(payLoad);


      }
    });
  };

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
  const processToFileFunc = (payLoad) => {
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
    <>
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
        <div style={{ marginBottom: "30px" }} className="col-12">
          <div>
            <Row>
              <Col md={12}>
                {data?.length > 0 ? (
                  <HotTable
                    data={data.slice(0, 11)}
                    stretchH="all"
                    preventOverflow="horizontal"
                    columns={gtsr1DataColumn}
                    contextMenu={false}
                    bindRowsWithHeaders={true}
                    licenseKey="non-commercial-and-evaluation"
                    height="auto"
                    rowHeights={RowSize}
                    autoColumnSize={{
                      samplingRatio: 23, // Adjust the samplingRatio as needed
                    }}
                    manualColumnResize={true}
                    columnHeaderHeight={columnHeaderSize}
                    ref={hotRef}
                    afterOnCellMouseDown={localAfterOnCellMouseDown}
                    mergeCells={false}
                    hiddenColumns={{
                      columns: [8],
                    }}
                    afterGetColHeader={theader}
                    cells={function (row, col) {
                      var cp = {};
                      const hot = hotRef?.current?.hotInstance;
                      if (col !== null) {
                        cp.renderer = emptyRender;
                      }
                      cp.className = "child";
                      if (col > 0) {
                        cp.className = "text-end";
                      }

                      if (col == 0) {
                        cp.className = "text-danger cursor-pointer";
                      }

                      return cp;
                    }}
                    width="100%"
                    colWidths={100}
                    selectionMode="single"
                  />
                ) : (
                  <HotTable
                    mergeCells={[{ row: 0, col: 0, rowspan: 1, colspan: 8 }]}
                    // autoColumnSize={true}
                    autoColumnSize={{
                      samplingRatio: 23, // Adjust the samplingRatio as needed
                    }}
                    manualColumnResize={true}
                    stretchH="all"
                    rowHeights={RowSize}
                    columnHeaderHeight={columnHeaderSize}
                    // style={{ overflowX: "hidden", textAlign: "center" }}
                    data={[{ typeofInvoice: "No Data Found!" }]}
                    cells={function (row, col) {
                      var cp = {};

                      if (col == 0) {
                        cp.className = "text-center";
                      }
                      return cp;
                    }}
                    preventOverflow="horizontal"
                    columns={gtsr1DataColumn}
                    contextMenu={false}
                    bindRowsWithHeaders={true}
                    hiddenColumns={{
                      columns: [8],
                    }}
                    afterGetColHeader={theader}
                    licenseKey="non-commercial-and-evaluation"
                    height="auto"
                  />
                )}
              </Col>
              {/* <div>
                <h2 className="mt-2 mb-1">Amendment Data2</h2>
              </div>
              <Col md={12}>
                {data?.length > 0 ? (
                  <HotTable
                    data={data.slice(11)}
                    stretchH="all"
                    preventOverflow="horizontal"
                    columns={gtsr1DataColumn}
                    rowHeights={RowSize}
                    columnHeaderHeight={columnHeaderSize}
                    contextMenu={false}
                    bindRowsWithHeaders={true}
                    licenseKey="non-commercial-and-evaluation"
                    height="auto"
                    ref={hotRefAmendment}
                    autoColumnSize={{
                      samplingRatio: 23, // Adjust the samplingRatio as needed
                    }}
                    manualColumnResize={true}
                    afterOnCellMouseDown={localAfterOnCellMouseDownAmendment}
                    mergeCells={false}
                    afterGetColHeader={theader}
                    hiddenColumns={{
                      columns: [8],
                    }}
                    cells={function (row, col) {
                      var cp = {};
                      const hot = hotRefAmendment?.current?.hotInstance;
                      if (col !== null) {
                        cp.renderer = emptyRender;
                      }
                      cp.className = "child";
                      if (col > 0) {
                        cp.className = "text-end";
                      }
                      if (col == 0) {
                        cp.className = "text-danger cursor-pointer";
                      }

                      return cp;
                    }}
                    width="100%"
                    colWidths={100}
                    selectionMode="single"
                  />
                ) : (
                  <HotTable
                    mergeCells={[{ row: 0, col: 0, rowspan: 1, colspan: 8 }]}
                    // autoColumnSize={true}
                    autoColumnSize={{
                      samplingRatio: 23, // Adjust the samplingRatio as needed
                    }}
                    manualColumnResize={true}
                    stretchH="all"
                    rowHeights={RowSize}
                    columnHeaderHeight={columnHeaderSize}
                    // style={{ overflowX: "hidden", textAlign: "center" }}
                    data={[{ typeofInvoice: "No Data Found!" }]}
                    preventOverflow="horizontal"
                    columns={gtsr1DataColumn}
                    contextMenu={false}
                    hiddenColumns={{
                      columns: [8],
                    }}
                    cells={function (row, col) {
                      var cp = {};

                      if (col == 0) {
                        cp.className = "text-center";
                      }
                      return cp;
                    }}
                    afterGetColHeader={theader}
                    bindRowsWithHeaders={true}
                    licenseKey="non-commercial-and-evaluation"
                    height="auto"
                  />
                )}
              </Col> */}
            </Row>
          </div>
        </div>
      </Fragment>

      <div style={{ zIndex: "999" }} className="btnFixFooter">
        <div className="container">
          <div className="d-flex justify-content-end">
            {/* <Button color="secondary" className="btn-prev" outline disabled>
              <ArrowLeft
                size={14}
                className="align-middle me-sm-25 me-0"
              ></ArrowLeft>
              <span className="align-middle d-sm-inline-block d-none">
                Previous Test
              </span>
            </Button> */}
            <div>
              <Button
                color="danger"
                className="btn-next me-1"
                onClick={() => NilReturnFilling()}
              >
                 <FileText
                  size={14}
                  className="align-middle ms-sm-25 ms-1"
                  style={{marginRight:"5px"}}
                ></FileText>
                <span className="align-middle d-sm-inline-block d-none">
                  File Nil Return
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
      </div>
    </>
  );
};

export default Gstr1FileDataSummary;
