import { Fragment, useRef } from "react";
import { Col, Label, Row, Button } from "reactstrap";
import { HotTable } from "@handsontable/react";
import { selectThemeColors } from "@utils";
import Select from "react-select";
import { useState } from "react";
import { SELECT_MAXSIZE,RowSize, columnHeaderSize } from "../../../configs/config";
import toast from "react-hot-toast";
import makeAnimated from "react-select/animated";
import { useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import gstr6SummaryService from "../../../services/gstr6/gstr6SummaryService";
import Swal from "sweetalert2";
import errorCodeConfig from "../../../configs/apiErrorCodeConfig";
import { registerRenderer, textRenderer } from "handsontable/renderers";
import { registerAllModules } from "handsontable/registry";

import { globleVariable } from "../../../configs/globalVariable";
import LocalFunction from "../../../configs/getLocalFunction";
import SessionFunction from "../../../configs/getSessionFunction";
// import gstr6SummaryService from "../../../services/gstr6/gstr6SummaryService"
import { downloadURL } from "@helper/downloadUrl";
import { ArrowRight, ArrowLeft } from "react-feather";

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
  // const dispatch = useDispatch();

  const invoiceDetails = [
    {
      data: "typeofInvoice",
      readOnly: true,
      title: "Type Of Invoice",
      width: "300",
    },
    {
      data: "documentCount",
      readOnly: true,
      title: "Documents Count",
    },
    // {
    //     data: "totalITC",
    //     readOnly: true,
    //     title: 'Total ITC'
    // },
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
      data: "typeofInvoiceId",
      title: "Section ID",
    },
  ];

  const itcDistributionDetails = [
    {
      data: "typeofInvoice",
      readOnly: true,
      title: "Type Of Invoice",
      width: "300",
    },
    {
      data: "documentCount",
      readOnly: true,
      title: "Documents Count",
    },
    // {
    //     data: "totalITC",
    //     readOnly: true,
    //     title: 'Total ITC'
    // },
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
      data: "typeofInvoiceId",
      title: "Section ID",
    },
  ];

  const [searchData, setSearchData] = useState(false);
  // const [block, setBlock] = useState(false)
  const navigate = useNavigate();
  const animatedComponents = makeAnimated();
  const [panDataFrom, setPanDataFrom] = useState([]);
  const [panData, setPanData] = useState([]);
  const [displayType, setDisplayType] = useState([]);
  const [finFromYear, setFinFormYear] = useState(null);
  const [monthFrom, setMonthFrom] = useState(null);
  const hotRef = useRef(null);
  const hotRefAmendment = useRef(null);
  const { setGSRT1Data, datas, setDatas, block, setBlock, stepper } =
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

  useEffect(() => {
    let activeTabData = {
      // InvoiceList : data?.slice(0, 11)
      // InvoiceList : datas?.slice(0, 11)
      InvoiceList: datas,
    };
    setGSRT1Data(true, activeTabData);

    // }, [data])
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
    finFromYear !== null && GSTR1SalesSummaryService();
  }, [monthFrom, finFromYear]);

  // console.log(monthFrom,"monthFrom")
  console.log(finFromYear?.value,"monthFrom")

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
        sessionStorage.setItem("gstr6DownloadFromDt", defaultValueFrom?.value);
        SessionFunction.setSessionValue(
          globleVariable.gstr1FromDt,
          defaultValueFrom?.value,
          true
        );
      } else {
        setFinFormYear(panData[0])
        sessionStorage.setItem("gstr6DownloadFromDt", panData[0]?.value);
        SessionFunction.setSessionValue(
          globleVariable.gstr1FromDt,
          panData[0]?.value,
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
    // sessionStorage.setItem("gstr6DownloadFromDt", value?.value);
    // SessionFunction.setSessionValue(
    //   globleVariable.gstr1FromDt,
    //   value?.value,
    //   true
    // );

    setMonthFrom(setDt);
    setPanData(x);
  };

  function localAfterOnCellMouseDown(event, coords, td) {
    const hot = hotRef?.current?.hotInstance;

    if (coords.row !== -1 && coords.col < 1) {
      const typeofInvoiceId = hot.getDataAtRow(coords.row)[6];
      console.log(typeofInvoiceId, "typeofInvoiceId");

      navigate("/gst-returns/gstr6/gstr6-summary-details", {
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
  function localAfterOnCellMouseDownAmendment(event, coords, td) {
    const hot = hotRefAmendment?.current?.hotInstance;

    if (coords.row !== -1 && coords.col < 1) {
      const typeofInvoiceId = hot.getDataAtRow(coords.row)[6];
      console.log(typeofInvoiceId);

      navigate("/gst-returns/gstr6/gstr6-summary-details", {
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
    setBlock(true);
    gstr6SummaryService
      .getGSTR6Summary(G_UCParId, finFromYear?.value, finFromYear?.value)
      .then((res) => {
        // gstr1SummaryServices.getGSTR1Summary(G_UCParId, gstr1Range, gstr1Range).then(res => {
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
  console.log(data, "dataaaaaa");

  // const dummy =[
  //     {typeofInvoice:"ITC recieved for distribution",documentCount:"23",totalITC:"12226",totalITC:"12226",igst:"12",cgst:"13",cess:"14",sgst:"15"},
  //     {typeofInvoice:"Amendment of ITC recived in earlier returns",documentCount:"23",totalITC:"12226",igst:"12",cgst:"13",cess:"14",sgst:"15"},
  //     {typeofInvoice:"Amendment of ITC recived in earlier returns",documentCount:"23",totalITC:"12226",igst:"12",cgst:"13",cess:"14",sgst:"15"},
  //     {typeofInvoice:"Credit Notes/Debit Notes received",documentCount:"23",totalITC:"12226",igst:"12",cgst:"13",cess:"14",sgst:"15"},
  //     {typeofInvoice:"Amendment of Credit Notes/Debit Notes received",documentCount:"23",totalITC:"12226",igst:"12",cgst:"13",cess:"14",sgst:"15"},
  // ]

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
                  <Label className="form-label col-md-4 pt-half text-end ">
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
          <div>
            <style>{`.gstr3bHeading{font-size: 14px !important; font-weight:bold}`}</style>
            <h2 className="gstr3bHeading">Invoice Details</h2>
          </div>
          <Col md={12}>
            <HotTable
              autoWrapRow={true}
              data={datas.slice(0, 4)}
              rowHeights={RowSize}
              columnHeaderHeight={columnHeaderSize}
              autoColumnSize={true}
              afterGetColHeader={theader}
              stretchH="all"
              preventOverflow="horizontal"
              columns={invoiceDetails}
              contextMenu={false}
              bindRowsWithHeaders={true}
              licenseKey="non-commercial-and-evaluation"
              height="auto"
              ref={hotRef}
              afterOnCellMouseDown={localAfterOnCellMouseDown}
              mergeCells={false}
              hiddenColumns={{
                columns: [6],
              }}


              cells={function (row, col) {
                var cp = {};

                const hot = hotRef?.current?.hotInstance;
                cp.className = "child";

                let gstr1Data = datas.slice(0, 4);

                if (gstr1Data.length > 0 ) {

                  if (col == 0){
                    cp.className = "text-danger cursor-pointer";
                  } else if (col > 0) {
                    cp.className = "text-end";
                  }
                }

                return cp;
              }}
            />
          </Col>

          <div>
            <h2 className="mt-1 gstr3bHeading">ITC Distribution Details</h2>
          </div>
          <Col md={12}>
            <HotTable
              data={datas.slice(4, 8)}
              rowHeights={RowSize}
              columnHeaderHeight={columnHeaderSize}
              afterGetColHeader={theader}
              stretchH="all"
              preventOverflow="horizontal"
              columns={itcDistributionDetails}
              contextMenu={false}
              bindRowsWithHeaders={true}
              licenseKey="non-commercial-and-evaluation"
              height="auto"
              // className="myRow"
              ref={hotRefAmendment}
              autoWrapRow={true}
              afterOnCellMouseDown={localAfterOnCellMouseDownAmendment}
              mergeCells={false}
              hiddenColumns={{
                columns: [6],
              }}
              cells={function (row, col) {
                var cp = {};
                const hot = hotRefAmendment?.current?.hotInstance;

                let dataITC = datas.slice(4, 8)

                if (dataITC?.length > 0 ) {
                  cp.className = "child";

                  if (col == 0) {
                    cp.className = "text-danger";
                  }  else if (col > 0) {
                    cp.className = "text-end";
                  }
                }



                return cp;
              }}
            />
          </Col>
        </Row>
      </div>

      <div className="d-flex justify-content-end">
        {/* <Button color="secondary" outline disabled> */}
          {/* <ArrowLeft
            size={14}
            className="align-middle me-sm-25 me-0"
          ></ArrowLeft>
          <span className="align-middle d-sm-inline-block d-none">
            Previous
          </span> */}
        {/* </Button> */}
        <Button
          color="danger"
          className="btn-next"
          onClick={() => stepper.next()}
        >
          <span className="align-middle d-sm-inline-block d-none">Next</span>
          <ArrowRight
            size={14}
            className="align-middle ms-sm-25 ms-0"
          ></ArrowRight>
        </Button>
      </div>
    </Fragment>
  );
};

export default Gstr1SalesSummary;
