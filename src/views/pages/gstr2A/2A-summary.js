// ** React Imports
import { Fragment, useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
// ** Spinner (Splash Screen)
import Spinner from "./../../../@core/components/spinner/Loading-spinner";
import DropDown2AExp from "../../components/dropdownPurchaseExp2A/2AExport";
// ** Styles
import "@styles/react/libs/tables/react-dataTable-component.scss";
// ** Third Party Components
import toast from "react-hot-toast";
// ** Store & Actions
import { getGSTR2ASummary } from '../gstr2A/store'
import { useDispatch, useSelector } from 'react-redux'
// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  Input,
  Label,
  CardText,
  Tooltip,
  UncontrolledTooltip,
  CardBody,
  Progress,
  Button,
} from "reactstrap";
//** Error Code file
import DropDownGSTRDwownload2A from "../../components/dropdown-GSTR-Download/dropdownGSTRDownload2A";
// ** Custom Components
import Breadcrumbs from "@components/breadcrumbs";
//** Handsontable
import { HotTable, HotColumn } from "@handsontable/react";
import { registerRenderer, textRenderer } from "handsontable/renderers";
import { registerAllModules } from "handsontable/registry";
import {
  LINK_MESSAGE,
  keysMap,
  enableOnFormTags,
  RowSize,columnHeaderSize
} from "../../../configs/config";
// ** Utils
import Select, { components } from "react-select"; // eslint-disable-line
import { selectThemeColors } from "@utils";
import makeAnimated from "react-select/animated";
import { SELECT_MAXSIZE } from "../../../configs/config";
import { useHotkeys } from "react-hotkeys-hook";
const animatedComponents = makeAnimated();
// ** Session get and set
import { globleVariable } from "../../../configs/globalVariable";
import LocalFunction from "../../../configs/getLocalFunction";
import SessionFunction from "../../../configs/getSessionFunction";
import { Search } from "react-feather";
import { handleExportData } from '@store/layout'
import { urlEndpointConfig } from "@configs/urlEndpoint";

const rangeFilters = localStorage.getItem(globleVariable.rangeFilters) && LocalFunction.getLocalValue(
  globleVariable.rangeFilters,
  true
);
const userId = localStorage.getItem(globleVariable.userId) && LocalFunction.getLocalValue(globleVariable.userId, true);
const gstr1FiledFromDt = sessionStorage.getItem(globleVariable.gstr1FiledFromDt) && SessionFunction.getSessionValue(globleVariable.gstr1FiledFromDt, true)
    const gstr1FiledToDt = sessionStorage.getItem(globleVariable.gstr1FiledToDt) && SessionFunction.getSessionValue(globleVariable.gstr1FiledToDt, true)
    const isdefaultYear = sessionStorage.getItem(globleVariable.defaultYear) && SessionFunction.getSessionValue(globleVariable.defaultYear, true)
    
const G_UCParId = sessionStorage.getItem(globleVariable.G_UCParId) && SessionFunction.getSessionValue(
  globleVariable.G_UCParId,
  true
);
const G_FY = sessionStorage.getItem(globleVariable.G_FY) && SessionFunction.getSessionValue(globleVariable.G_FY, true);
const G_FM = sessionStorage.getItem(globleVariable.G_FM) && SessionFunction.getSessionValue(globleVariable.G_FM, true);

const G_UCID = sessionStorage.getItem(globleVariable.G_UCID) && SessionFunction.getSessionValue(globleVariable.G_UCID, true);

// ** Import Dropdown list
// const ImportButtonList = [{ id: "1", name: "Import Excel" }];

// const pageCount = 0;

// ** Range wise year
const finYearOption = rangeFilters;
const YearList =
  finYearOption !== undefined &&
    finYearOption !== null &&
    finYearOption !== "" &&
    finYearOption !== "undefined"
    ? JSON.parse(finYearOption)
    : [];

registerAllModules();

const PurchaseSummary2A = () => {
  // ** Hooks

  const [block, setBlock] = useState(false);

  // const [typeOfInv, setTypeofInv] = useState([]);
  const [finFromYear, setFinFormYear] = useState(null);
  const [panData, setPanData] = useState([]);
  const [monthFrom, setMonthFrom] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [displayType, setDisplayType] = useState(false);
  const [search, setSearch] = useState(false);
  // const [switchOn, setSwitchOn] = useState(false);
  const [panDataFrom, setPanDataFrom] = useState([]);
  const [exportType, setExportType] = useState(false)
  const [downloadDate, setDownloadDate] = useState(false)    
  // const [tooltipOpen, setTooltipOpen] = useState(false);
  const dispatch = useDispatch()


  const store = useSelector(state => state?.gstr2AData?.GSTR2ASummary[0]?.Summary);
  const storeExport = useSelector(state => state?.layout?.exportData);


  console.log(store, '2asummarydata');
  // ** Session
  // const data1 = userId ? userId : " ";

  const isCmpySelection = sessionStorage.getItem(globleVariable.isCompany) !== null && sessionStorage.getItem(globleVariable.isCompany) !== "" &&
    sessionStorage.getItem(globleVariable.isCompany) !== undefined && sessionStorage.getItem(globleVariable.isCompany) !== false &&
    sessionStorage.getItem(globleVariable.isCompany) !== 'false' ? true : false;

  const clientIds = sessionStorage.getItem(globleVariable.G_UCParId) && SessionFunction.getSessionValue(globleVariable.G_UCParId, true);
  const GGSTIN = sessionStorage.getItem(globleVariable.G_GSTIN) && SessionFunction.getSessionValue(globleVariable.G_GSTIN, true);
  const subId = localStorage.getItem(globleVariable.subscriptionId) && LocalFunction.getLocalValue(globleVariable.subscriptionId, true);
  const defaultYear = sessionStorage.getItem(globleVariable.defaultYear) && SessionFunction.getSessionValue(
    globleVariable.defaultYear,
    true
  );

  //** Shortcut keys


  useHotkeys(keysMap.SEARCH_DATA, () => searchData(), { enableOnFormTags });


  // ** Navigate
  const navigate = useNavigate();
  const hotRef = useRef(null);

  // ** Loader
  // const Loader = () => {
  //   return (
  //     <Fragment>
  //       <Spinner />
  //       <CardText className="mb-0 mt-1 text-white">Please Wait...</CardText>
  //     </Fragment>
  //   );
  // };


  // ** Display for loading
  useEffect(() => {
    return () => setBlock(false);
  }, []);

  // ** From and To Year list
  useEffect(() => {
    setPanData(YearList);
    setPanDataFrom(YearList);
    if (isCmpySelection == true) {
      setDisplayType(true);
    }
  }, []);

  //** store data
  useEffect(() => {
    if (isCmpySelection == true) {
      if (store !== undefined) {
        setBlock(false);
      }
    }

  }, [store])

  useEffect(() => {

    if (exportType == true || storeExport == true) {
      console.log('export data', storeExport)
      onDateSelect();
      dispatch(handleExportData(false))
      setExportType(false)
    }

  }, [exportType, storeExport])

  // ** From Month selection
  const selectFromYear = (value) => {
    console.log("value=", value);
    setFinFormYear(value);
    setErrorMsg("");
    const setDt =
      Number(monthFrom?.srNo) > Number(value?.srNo)
        ? monthFrom
        : panDataFrom[0];
    const x = panDataFrom?.filter(
      (item) => Number(item.srNo) >= Number(value.srNo)
    );
    //  sessionStorage.setItem("purSelectExportFromDt", value?.value);

    setMonthFrom(setDt);
    setPanData(x);

    // setMonthFrom(x != undefined && x != null ? x[0] : null);
    //   sessionStorage.setItem("purSelectExportToDt", setDt?.value);
    // PurchaseSummaryService();
  };

  // ** To Month selection
  const selectFromMonth = (value) => {
    setErrorMsg("");
    setMonthFrom(value);

    if (Number(finFromYear?.srNo) > Number(value?.srNo)) {
      const fromFilter = panDataFrom?.filter(
        (item) => Number(item.srNo) == Number(value.srNo)
      )[0];
      setFinFormYear(fromFilter);
      // sessionStorage.setItem("purSelectExportFromDt", fromFilter?.value);
      // sessionStorage.setItem("purSelectExportToDt", fromFilter?.value);
    } else {
      // sessionStorage.setItem("purSelectExportToDt", value?.value);
    }

    //  sessionStorage.setItem('purSelectExportToDt', value?.value)
    // PurchaseSummaryService();
  };

  useEffect(() => {
    console.log('call api', search)
    if (search == true) {
      const userData = {
        clientid: clientIds,
        finyear: finFromYear?.value,
        finmonth: monthFrom?.value,
        subscriptionId: subId,
        gstNumber: GGSTIN

      }

      setBlock(true)
      dispatch(getGSTR2ASummary(userData))
    }
  }, [search]);

  const checkAPIFire = sessionStorage.getItem("setRefreshAPIReportDataDeletGSTR2A");

  useEffect(() => {
    if (checkAPIFire== "true" || checkAPIFire==true) {
      const userData = {
        clientid: clientIds,
        finyear: finFromYear?.value,
        finmonth: monthFrom?.value,
        subscriptionId: subId,
        gstNumber: GGSTIN

      }

      if (monthFrom?.value != undefined && finFromYear?.value !=undefined) {
        setBlock(true)
        dispatch(getGSTR2ASummary(userData))
        sessionStorage.setItem("setRefreshAPIReportDataDeletGSTR2A",false)
      }
    }
  }, [checkAPIFire,monthFrom?.value])
  

  //** Set from and to date 
  useEffect(() => {

    if (isCmpySelection == false) {

      toast.error(LINK_MESSAGE, {
        position: "top-right",
      });

      setTimeout(() => {
        navigate("/dashboard/company")
      }, 1000);
    } else {
      if (displayType == true) {
        // debugger
        onDateSelect();
        setSearch(true)
      }
    }

  }, [displayType])


  // const onDateSelect = () => {
  //   let defaultValueFrom = null;
  //   let defaultValueTo = null;

  //   if (sessionStorage.getItem(globleVariable.selectExportFromDt) !== null && sessionStorage.getItem(globleVariable.selectExportFromDt) !== "" && sessionStorage.getItem(globleVariable.selectExportFromDt) !== undefined) {

  //     defaultValueFrom = panDataFrom?.filter((item) => item.value == sessionStorage.getItem(globleVariable.selectExportFromDt))[0];


  //   } else {
  //     defaultValueFrom = panDataFrom?.filter((item) => Number(item.value) == Number(defaultYear))[0];
  //   }

  //   if (sessionStorage.getItem(globleVariable.selectExportToDt) !== null && sessionStorage.getItem(globleVariable.selectExportToDt) !== "" && sessionStorage.getItem(globleVariable.selectExportToDt) !== undefined) {
  //     defaultValueTo = panData?.filter((item) => item.value == sessionStorage.getItem(globleVariable.selectExportToDt))[0];
  //   } else {
  //     defaultValueTo = panData?.filter((item) => Number(item.value) == Number(defaultYear))[0];
  //   }

  //   if (defaultValueFrom !== undefined && defaultValueFrom !== null && defaultValueFrom !== "") {
  //     setFinFormYear(defaultValueFrom)
  //     sessionStorage.setItem(globleVariable.selectExportFromDt, defaultValueFrom?.value)
  //   } else {
  //     setFinFormYear(panData[0])
  //     sessionStorage.setItem(globleVariable.selectExportFromDt, panData[0]?.value)
  //   }
  //   if (defaultValueTo !== undefined && defaultValueTo !== null && defaultValueTo !== "") {
  //     setMonthFrom(defaultValueTo)
  //     sessionStorage.setItem(globleVariable.selectExportToDt, defaultValueTo?.value)
  //   } else {
  //     setMonthFrom(panData[0])
  //     sessionStorage.setItem(globleVariable.selectExportToDt, panData[0]?.value)
  //   }

  // }
  const onDateSelect = () => {
    let defaultValueFrom = null;
    let defaultValueTo = null;
    if (gstr1FiledFromDt !== null && gstr1FiledFromDt !== "" && gstr1FiledFromDt !== undefined) {
        defaultValueFrom = panDataFrom?.filter((item) => item.value == gstr1FiledFromDt)[0];
    } else {
        defaultValueFrom = panDataFrom?.filter((item) => Number(item.value) == Number(isdefaultYear))[0];
    }

    if (gstr1FiledToDt !== null && gstr1FiledToDt !== "" && gstr1FiledToDt !== undefined) {
        defaultValueTo = panDataFrom?.filter((item) => item.value == gstr1FiledToDt)[0];
    } else {
        defaultValueTo = panDataFrom?.filter((item) => Number(item.value) == Number(isdefaultYear))[0];
    }

    if (defaultValueFrom !== undefined && defaultValueFrom !== null && defaultValueFrom !== "") {
        setFinFormYear(defaultValueFrom)
        // sessionStorage.setItem('gstr1FiledFromDt', defaultValueFrom?.value)
        SessionFunction.setSessionValue(globleVariable.gstr1FiledFromDt, defaultValueFrom?.value, true)
    }
    if (defaultValueTo !== undefined && defaultValueTo !== null && defaultValueTo !== "") {
        setMonthFrom(defaultValueTo)
        SessionFunction.setSessionValue(globleVariable.gstr1FiledToDt, defaultValueTo?.value, true)
        // sessionStorage.setItem('gstr1FiledToDt', defaultValueTo?.value)
    }
}



  useEffect(() => {
    if (downloadDate == true) {
      onDateSelect();
      setDownloadDate(false)
    }
  },[downloadDate])


  // ** Search
  const searchData = () => {
    const userData = {
      clientid: clientIds,
      finyear: finFromYear?.value,
      finmonth: monthFrom?.value,
      subscriptionId: subId,
      gstNumber: GGSTIN
    }


    setBlock(true)
    dispatch(getGSTR2ASummary(userData))
    setDisplayType(false);
  }

  const onClickSearch = () => {


    const userData = {
      clientid: clientIds,
      finyear: finFromYear?.value,
      finmonth: monthFrom?.value,
      subscriptionId: subId,
      gstNumber: GGSTIN
    }


    sessionStorage.setItem(globleVariable.selectExportFromDt, finFromYear?.value)
    sessionStorage.setItem(globleVariable.selectExportToDt, monthFrom?.value)



    console.log(userData, "userData")
    setBlock(true)
    dispatch(getGSTR2ASummary(userData))
    // }
  }




  // ** Column
  const handsontableColumns = [
    {
      data: "TypeofInvoice",
      readOnly: true,
      title: "Type Of Invoice",
    },
    {
      data: "DocumentCount",
      readOnly: true,
      title: "Document Count",
    },
    {
      data: "TotalTaxableAmount",
      readOnly: true,
      title: "Total Taxable Amt (₹)",
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
      data: "TypeofInvoiceId",
      readOnly: true,
      title: "typeofInvoiceId",
    },
    {
      data: "Sectionname",
      readOnly: true,
      title: "sectionname",
    },
    {
      data: "CESS",
      readOnly: true,
      title: "Cess (₹)",
    },
  ];

  // **  localAfterOnCellMouseDown

  function localAfterOnCellMouseDown(event, coords, td) {
    const hot = hotRef?.current?.hotInstance;
    if (coords.row !== -1 && coords.col < 1) {
      const typeofInvoiceId = hot.getSourceDataAtRow(coords.row)['TypeofInvoiceId']
      const sectionName = hot.getSourceDataAtRow(coords.row)['Sectionname']

      // debugger


      navigate(`/gst-returns/gstr2a/invoiceGstr2A`, {
        state: {
          titles: "",
          finyear: sessionStorage.getItem(globleVariable.selectExportFromDt),
          finmonth: sessionStorage.getItem(globleVariable.selectExportToDt),
          sectionId: typeofInvoiceId,
          isclientId: G_UCParId,
        },
      });
    }
  }
  function formatINR(x) {
    return x.toLocaleString("en-IN", { minimumFractionDigits: 2 });
  }
  function formatTotalWithoutDecimal(x) {
    return x.toLocaleString("en-IN");
  }

  // *** with round figer value
  function emptyRender(instance, td, row, col, prop, value, cellProperties) {
    textRenderer.apply(this, arguments);
    if ( 
      col == 2 ||
      col == 3 ||
      col == 4 ||
      col == 5 ||
      col == 8) {
      let currnecyVal = formatINR(Number(value));


      if (currnecyVal !== 0) {
        td.innerText = currnecyVal;
      }
    }
    if (col == 1) {
      let currnecyVal = formatTotalWithoutDecimal(Number(value));


      if (currnecyVal !== 0) {
        td.innerText = currnecyVal;
      }
    }

  }



  //** Hide filter / text align option
  const theader = (col, TH) => {
    if (col < 1) {
      TH.className = "htLeft";
    } else {
      TH.className = "htRight";
    }
  };

  // ** Loading
  const loadFunction = (value, fileName, selectedYear) => {
    // setProgressModal(value);
    setBlock(value);
  };

  const loadFunctionExport = (value, fileName, selectedYear) => {
    setBlock(value);
  };

  return (
    <Fragment>
      {block && <div className="loading1">Loading&#8230;</div>}
      <div className="content-header row py-1">
        <div className="content-header-left col-md-6 col-12">
          <div className="row breadcrumbs-top mb-0">
            <div className="col-12">
              <Breadcrumbs
                title="GSTR-2A Summary"
                data={[
                  { title: "GST Returns",link: urlEndpointConfig.GSTR_All },
                 
                  { title: "GSTR 2A Summary" },
                ]}
              />
              {/* <Breadcrumbs title='Purchase Summary' data={[{ title: 'Reconciliation' }, { title: 'Purchase Summary' }]} /> */}
            </div>
          </div>
        </div>
        <div className="content-header-right text-md-end col-md-6 col-12 d-md-block d-none">
          <DropDownGSTRDwownload2A
            loadFunction={loadFunction}
            // PurchaseSummaryService={PurchaseSummaryService}
            userId={userId}
            clientId={G_UCID}
            finYear={G_FY}
            finMonth={G_FM}
            subscriptionId={subId}
            gstNumber={GGSTIN}
            setDownloadDate={setDownloadDate}
          ></DropDownGSTRDwownload2A>

          <DropDown2AExp
            loadFunction={loadFunctionExport}
            clientId={G_UCParId}
            finYear={sessionStorage.getItem(
              globleVariable.selectExportFromDt, finFromYear?.value
            )}
            finMonth={sessionStorage.getItem(
              globleVariable.selectExportToDt, monthFrom?.value
            )}
            // finYear={G_FY}
            // finMonth={G_FM}
            sectionId={0}
            subscriptionId={subId}
            gstNumber={GGSTIN}
            userId={userId}
            setExportType={setExportType}
          />
        </div>
      </div>
      <Row>
        <Col>
          <div className="content-header row py-1">
            <div className="content-header-left col-md-12 col-12">
              <div className="row breadcrumbs-top">

                <div className="col-md-6"></div>
                <div className="col-md-6">
                  <div className="row ">
                    {/* <div className="col-md-1"></div> */}
                    <div className="col-md-2 ps-0"></div>
                    <div className="col-md-4 ps-0">
                      <div className="row">
                        <Label className="form-label col-md-3 pt-half ">From</Label>
                        <Select
                          id="from"
                          placeholder="From"
                          isClearable={false}
                          theme={selectThemeColors}
                          closeMenuOnSelect={true}
                          options={panDataFrom}
                          className="basic-multi-select col-md-9 ps-0 "
                          classNamePrefix="select"
                          components={animatedComponents}
                          onChange={selectFromYear}
                          value={finFromYear}
                          maxMenuHeight={SELECT_MAXSIZE}

                        />
                      </div>
                    </div>
                    <div className="col-md-4 ps-0">
                      <div className="row">
                        <Label className="form-label col-md-2 pt-half">To</Label>
                        <Select
                          id="to"
                          placeholder="To"
                          isClearable={false}
                          theme={selectThemeColors}
                          closeMenuOnSelect={true}
                          options={panData}
                          components={animatedComponents}
                          className="basic-multi-select col-md-10 ps-0 "
                          classNamePrefix="select"
                          onChange={selectFromMonth}
                          value={monthFrom}
                          maxMenuHeight={SELECT_MAXSIZE}
                        />

                      </div>

                    </div>
                    <div className="col-md-2  text-end ps-0">
                      <Button
                        onClick={onClickSearch}
                        className="btn-icon btn-round"
                        color="danger" outline >
                        <Search size={12} />&nbsp;Search
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Card>
            <CardBody className="CardBody p-0">
              <Row>
                <Col md={12}>
                  <div>
                    {store?.length > 0 ? (
                      <HotTable
                        data={store !== undefined && store !== null && store !== "" ? store : [{ SrNo: "No Data Found!" }]}
                        rowHeights={RowSize}
                        columnHeaderHeight={columnHeaderSize}          
                        autoColumnSize={true}
                        stretchH="all"
                        preventOverflow="horizontal"
                        columns={handsontableColumns}
                        contextMenu={false}
                        bindRowsWithHeaders={true}
                        licenseKey="non-commercial-and-evaluation"
                        afterGetColHeader={theader}
                        height="auto"
                        ref={hotRef}
                        hiddenColumns={{
                          columns: [6, 7],
                        }}
                        afterOnCellMouseDown={localAfterOnCellMouseDown}
                        mergeCells={false}
                        cells={function (row, col) {
                          var cp = {};
                          const hot = hotRef?.current?.hotInstance;


                          cp.className = "child";
                          if (col !== null) {

                            cp.renderer = emptyRender;
                          }

                          if (col == 0) {
                            cp.className = "text-danger cursor-pointer";
                          } else   if (col > 0) {
                            cp.className = "text-end";
                          }
                          return cp;
                        }}
                      />
                    ) : (
                      <HotTable
                        mergeCells={[{ row: 0, col: 0, rowspan: 1, colspan: 7 }]}
                        rowHeights={RowSize}
                        columnHeaderHeight={columnHeaderSize}          
                        autoColumnSize={true}
                        stretchH="all"
                        style={{ overflowX: "hidden", textAlign: "center" }}
                        data={[{ typeofInvoice: "No Data Found!" }]}
                        preventOverflow="horizontal"
                        columns={handsontableColumns}
                        contextMenu={false}
                        afterGetColHeader={theader}
                        bindRowsWithHeaders={true}
                        licenseKey="non-commercial-and-evaluation"
                        height="auto"
                        hiddenColumns={{
                          columns: [6, 7],
                        }}
                      />
                    )}
                  </div>
                </Col>
              </Row>

            </CardBody>
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
};

export default PurchaseSummary2A;
