// ** React Imports
import {
  Fragment,
  useState,
  forwardRef,
  useLayoutEffect,
  useEffect,
  useRef,
} from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

// ** Spinner (Splash Screen)
import Spinner from "./../../../@core/components/spinner/Loading-spinner";
import encryptData from "../../../auth/crypto/crypto";
import DropDownExp from "../../components/dropdownPurchaseExp2A/dropdownExp2A";
import DropDownGSTRDwownload2A from "../../components/dropdown-GSTR-Download/dropdownGSTRDownload2A";
// ** Third Party Components
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import toast from "react-hot-toast";

// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  Input,
  Label,
  Button,
  CardText,
  Tooltip,
  UncontrolledTooltip,
  CardBody,
} from "reactstrap";
import PurchaseSummaryInvoice2A from "../../../services/Reco/Purchase2A/purchaseInvoiceService2A";

//** Error Code file
import errorCodeConfig from "../../../configs/apiErrorCodeConfig";
import DropDownRecoImport2A from "../../components/Dropdown-2A-Import";
// ** Custom Components
import Breadcrumbs from "@components/breadcrumbs";

//** Handsontable
import { HotTable, HotColumn } from "@handsontable/react";
import Handsontable from "handsontable";
import { registerRenderer, textRenderer } from "handsontable/renderers";
import { registerAllModules } from "handsontable/registry";
import { LINK_MESSAGE ,RowSize,columnHeaderSize} from "../../../configs/config";

// ** Utils
import Select, { components } from "react-select"; // eslint-disable-line
import { selectThemeColors } from "@utils";
import makeAnimated from "react-select/animated";
import purchaseInvoiceService from "../../../services/Reco/Purchase/purchaseInvoiceService";
const animatedComponents = makeAnimated();
import { globleVariable } from "../../../configs/globalVariable";

// ** Session get and set
import { globleVariable } from "../../../configs/globalVariable";
import LocalFunction from "../../../configs/getLocalFunction";
import SessionFunction from "../../../configs/getSessionFunction";
import { urlEndpointConfig } from "@configs/urlEndpoint";

const userId = localStorage.getItem(globleVariable.userId) && LocalFunction.getLocalValue(globleVariable.userId, true);
const rangeFilters =  localStorage.getItem(globleVariable.rangeFilters) &&  LocalFunction.getLocalValue(
  globleVariable.rangeFilters
);

const G_FY =  sessionStorage.getItem(globleVariable.G_FY) &&  SessionFunction.getSessionValue(globleVariable.G_FY);
const G_FM =  sessionStorage.getItem(globleVariable.G_FM) && SessionFunction.getSessionValue(globleVariable.G_FM);
const G_UCID =  sessionStorage.getItem(globleVariable.G_UCID) &&  SessionFunction.getSessionValue(globleVariable.G_UCID);

const finYearOption = rangeFilters;
console.warn(finYearOption, "finYearOption");
const YearList =
  finYearOption !== undefined &&
  finYearOption !== null &&
  finYearOption !== "" &&
  finYearOption !== "undefined"
    ? JSON.parse(finYearOption)
    : [];

const ImportButtonList = [{ id: "1", name: "Import Excel" }];

const PurchaseSummary2A = () => {
  const [block, setBlock] = useState(false);
  const [modalshow, setModalshow] = useState(false);
  const [data, setData] = useState([]);
  const [typeOfInv, setTypeofInv] = useState([]);
  const [finFromYear, setFinFormYear] = useState(null);
  const [panData, setPanData] = useState([]);
  const [monthFrom, setMonthFrom] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [displayType, setDisplayType] = useState(false);
  const [panDataFrom, setPanDataFrom] = useState([]);
  const [search, setSearch] = useState(false);

  const navigate = useNavigate();
  const hotRef = useRef(null);
  const defaultYear = sessionStorage.getItem(globleVariable.defaultYear) && SessionFunction.getSessionValue(globleVariable.defaultYear,true);

  const Loader = () => {
    return (
      <Fragment>
        <Spinner />
        <CardText className="mb-0 mt-1 text-white">Please Wait...</CardText>
      </Fragment>
    );
  };

  useEffect(() => {
    setPanData(YearList);
    setPanDataFrom(YearList);
    setDisplayType(true);
  }, []);

  const selectFromYear = (value) => {
    console.log("value=", value);
    setFinFormYear(value);
    setErrorMsg("");
    const x = panDataFrom?.filter(
      (item) => Number(item.srNo) > Number(value.srNo)
    );
    // const y = { ...panData,  x }
    setPanData(x);
    // console.log("month values2=", y);

    sessionStorage.setItem("purSelectExportFromDt", value?.value);
  };

  const selectFromMonth = (value) => {
    setErrorMsg("");
    setMonthFrom(value);
    sessionStorage.setItem("purSelectExportToDt", value?.value);
  };

  useEffect(() => {
    return () => setBlock(false);
  }, []);

  useEffect(() => {
    console.log("default value");
    console.log(sessionStorage.getItem("2BFrdt"));
    if (displayType == true) {
      let defaultValueFrom = null;
      let defaultValueTo = null;
      if (
        sessionStorage.getItem(globleVariable.purchaeFrdt) !== null &&
        sessionStorage.getItem(globleVariable.purchaeFrdt) !== "" &&
        sessionStorage.getItem(globleVariable.purchaeFrdt) !== undefined
      ) {
        console.log("set from date");
        defaultValueFrom = panData?.filter(
          (item) =>
            item.value == sessionStorage.getItem(globleVariable.purchaeFrdt)
        )[0];
      } else {
        defaultValueFrom = panData?.filter(
          (item) => Number(item.value) == Number(defaultYear)
        )[0];
      }

      if (
        sessionStorage.getItem(globleVariable.purchaeTodt) !== null &&
        sessionStorage.getItem(globleVariable.purchaeTodt) !== "" &&
        sessionStorage.getItem(globleVariable.purchaeTodt) !== undefined
      ) {
        defaultValueTo = panData?.filter(
          (item) =>
            item.value == sessionStorage.getItem(globleVariable.purchaeTodt)
        )[0];
      } else {
        defaultValueTo = panData?.filter(
          (item) => Number(item.value) == Number(defaultYear)
        )[0];
      }

      if (
        defaultValueFrom !== undefined &&
        defaultValueFrom !== null &&
        defaultValueFrom !== ""
      ) {
        setFinFormYear(defaultValueFrom);
        sessionStorage.setItem(
          "purSelectExportFromDt",
          defaultValueFrom?.value
        );
      }
      if (
        defaultValueTo !== undefined &&
        defaultValueTo !== null &&
        defaultValueTo !== ""
      ) {
        setMonthFrom(defaultValueTo);
        sessionStorage.setItem("purSelectExportToDt", defaultValueTo?.value);
      }

      setSearch(true);
    }
  }, [displayType]);

  useEffect(() => {
    console.log(
      "is company login",
      sessionStorage.getItem(globleVariable.isCompany)
    );
    if (
      sessionStorage.getItem(globleVariable.isCompany) == false ||
      sessionStorage.getItem(globleVariable.isCompany) == "false"
    ) {
      toast.error(LINK_MESSAGE, {
        position: "top-right",
      });

      setTimeout(() => {
        navigate("/dashboard/company");
      }, 1000);
    }
  }, []);

  useEffect(() => {
    if (search == true) {
      AdvSearchFilter();
    }
  }, [search]);

  const AdvSearchFilter = () => {
    PurchaseSummaryService();
  };

  const PurchaseSummaryService = () => {
    setBlock(true);
    PurchaseSummaryInvoice2A.getPurchaseSummary(
      G_UCParId,
      finFromYear?.value,
      monthFrom?.value
    )
      .then((res) => {
        if (
          res.status === 200 &&
          res.data.status === errorCodeConfig.APIDefaultCode.Success
        ) {
          setBlock(false);
          setData(res.data.data);
        } else {
          setBlock(false);
          setData([]);
        }
      })
      .catch((error) => {
        setBlock(false);
        Swal.fire({
          icon: "error",
          title: "",
          text: error?.message,
        });
      });
  };


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
      title: "Total Taxable Amount",
    },
    {
      data: "IGST",
      readOnly: true,
      title: "IGST",
    },
    {
      data: "CGST",
      readOnly: true,
      title: "CGST",
    },
    {
      data: "SGST",
      readOnly: true,
      title: "SGST",
    },
    {
      data: "TypeOfInvoiceId",
      readOnly: true,
      title: "typeofInvoiceId",
    },
    {
      data: "Sectionname",
      readOnly: true,
      title: "sectionname",
    },
  ];

  function localAfterOnCellMouseDown(event, coords, td) {
    const hot = hotRef?.current?.hotInstance;

    if (coords.row !== -1) {
      const typeofInvoiceId = hot.getDataAtRow(coords.row)[6];
      console.log(typeofInvoiceId);
      const encrypData = encryptData.encrypt(typeofInvoiceId);

      if (typeofInvoiceId < 7) {
        const decryptUrl = encryptData.encryptData(
          "clientId=" +
            G_UCID +
            "&rows=" +
            data.rowCount +
            "&isItc=1&section=" +
            data.section
        );
        navigate(`/gst-returns/gstr2a/invoiceGstr2A/${encrypData}`, {
          state: {
            titles: "",
            finyear: finFromYear.value,
            finmonth: monthFrom.value,
          },
        });
      }
    }
  }

  const loadFunction = (value) => {
    setBlock(value);
    console.log("load value=", value);
  };

  return (
    <Fragment>
      {block && <div className="loading1">Loading&#8230;</div>}
      <div className="content-header row">
        <div className="content-header-left col-md-9 col-12">
          <div className="row breadcrumbs-top">
            <div className="col-12">
              {/* link: '/gst-returns/gstr2a' */}
              <Breadcrumbs
                title="GSTR-2A Summary"
                data={[
                  { title: "GST Returns",link: urlEndpointConfig.GSTR_All },
                 
                  { title: "GSTR 2A Summary" },
                ]}
              />
            </div>
          </div>
        </div>
        <div className="content-header-right text-md-end col-md-3 col-12 d-md-block d-none py-1">
          &nbsp;
          <DropDownGSTRDwownload2A
            loadFunction={loadFunction}
            PurchaseSummaryService={PurchaseSummaryService}
            userId={userId}
            clientId={G_UCID}
            finYear={G_FY}
            finMonth={G_FM}
          ></DropDownGSTRDwownload2A>{" "}
          &nbsp;
          <DropDownRecoImport2A
            PurchaseSummaryService={PurchaseSummaryService}
            loadFunction={loadFunction}
            item={ImportButtonList}
            clientId={G_UCID}
            finYear={G_FY}
            finMonth={G_FM}
          ></DropDownRecoImport2A>
          &nbsp;
          <DropDownExp
            loadFunction={loadFunction}
            clientId={G_UCID}
            finYear={sessionStorage.getItem(
              globleVariable.purSelectExportFromDt
            )}
            finMonth={sessionStorage.getItem(
              globleVariable.purSelectExportToDt
            )}
          />
        </div>
      </div>

      <Card>
        <CardBody>
          <Row>
            <Col sm={2}>
              <Label className="form-label">From Month</Label>
              <Select
                id="from"
                placeholder="From"
                isClearable={false}
                theme={selectThemeColors}
                closeMenuOnSelect={true}
                options={panDataFrom}
                className="basic-multi-select"
                classNamePrefix="select"
                components={animatedComponents}
                onChange={selectFromYear}
                value={finFromYear}
              />
            </Col>

            <Col sm={2}>
              <Label className="form-label">End Month</Label>
              <Select
                id="to"
                placeholder="To"
                isClearable={false}
                theme={selectThemeColors}
                closeMenuOnSelect={true}
                options={panData}
                components={animatedComponents}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={selectFromMonth}
                value={monthFrom}
              />
            </Col>
            <Col sm={4} style={{ paddingTop: "23px" }}>
              <Button
                className="me-1"
                color="danger"
                outline
                onClick={AdvSearchFilter}
              >
                Search
              </Button>
            </Col>
          </Row>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <div>
            <Row>
              <Col md={12}>
                {data?.length > 0 ? (
                  <HotTable
                    data={data}
                    rowHeights={RowSize}
                    columnHeaderHeight={columnHeaderSize}      
                    autoColumnSize={true}
                    stretchH="all"
                    preventOverflow="horizontal"
                    // columnSorting={true}
                    columns={handsontableColumns}
                    nestedRows={true}
                    contextMenu={false}
                    bindRowsWithHeaders={true}
                    licenseKey="non-commercial-and-evaluation"
                    // rowHeights="30"
                    height="auto"
                    ref={hotRef}
                    hiddenColumns={{ columns: [6, 7] }}
                    afterOnCellMouseDown={localAfterOnCellMouseDown}
                    mergeCells={false}
                  />
                ) : (
                  <HotTable
                    // style={{ textAlign: "center" }}
                    mergeCells={[{ row: 0, col: 0, rowspan: 1, colspan: 6 }]}
                    rowHeights={RowSize}
                    columnHeaderHeight={columnHeaderSize}      
                    autoColumnSize={true}
                    stretchH="all"
                    style={{ overflowX: "hidden", textAlign: "center" }}
                    ref={hotRef}
                    data={[{ typeofInvoice: "No Data Found!" }]}
                    preventOverflow="horizontal"
                    // columnSorting={true}
                    columns={handsontableColumns}
                    nestedRows={true}
                    contextMenu={false}
                    bindRowsWithHeaders={true}
                    licenseKey="non-commercial-and-evaluation"
                    // rowHeights="30"
                    height="auto"
                    hiddenColumns={{ columns: [6, 7] }}
                  />
                )}
              </Col>
            </Row>
          </div>
        </CardBody>
      </Card>

      {modalshow && (
        <PruchaseTypesModal
          typeOfInv={data}
          show={modalshow}
        ></PruchaseTypesModal>
      )}
    </Fragment>
  );
};

export default PurchaseSummary2A;
