import { Fragment, useEffect, useRef, useState } from "react";
import Breadcrumbs from "@components/breadcrumbs";
import Wizard from "@components/wizard";
import {
  Outlet,
  useFetcher,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import CMP08FiledData from "./cmp08-filed-data";
import GSTR3BFiledDownload from "./cmp08-downloads";
import GSTR3BExportButton from "../../../components/dropDownGSTR3bFileDataExport/index";
import {
  Button,
  Modal,
  ModalBody,
  Row,
  Col,
  Label,
  UncontrolledTooltip,
} from "reactstrap";
import { globleVariable } from "../../../../configs/globalVariable";
import LocalFunction from "../../../../configs/getLocalFunction";
import SessionFunction from "../../../../configs/getSessionFunction";
import { useHotkeys } from "react-hotkeys-hook";
import { keysMap, enableOnFormTags } from "../../../../configs/config";
import gstr3bFiledService from "../../../../services/gstr3bFiled/gstr3bFiledService";
import {
  X,
  DownloadCloud,
} from "react-feather";
import makeAnimated from "react-select/animated";
import Select, { components } from "react-select"; // eslint-disable-line
import { selectThemeColors } from "@utils";
import { DROPDOWN_PLACEHOLDER } from "../../../../configs/config";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { handleExportData } from "@store/layout";
import { downloadURL } from "../../../../helper/downloadUrl";
import { tokenExpiresRedirect } from "../../../../utility/Utils";
import errorCodeConfig from "../../../../configs/apiErrorCodeConfig";
import VerificationModal from "../../../../views/pages/verification-otp/index";
import cmp08FiledService from "../../../../services/cmp08Filed/cmp08FiledService";
import { urlEndpointConfig } from "../../../../configs/urlEndpoint";

const animatedComponents = makeAnimated();

const GSTR3BFiled = () => {
  const wizardRef = useRef(null);
  const dispatch = useDispatch();

  // ** State
  const [stepper, setStepper] = useState(null);
  console.log("stepper", stepper);

  const [block, setBlock] = useState(false);

  const [wizardBtn, setWizardBtn] = useState(0);
  const [summary, setSummary] = useState(true);
  const [activeTab, setactiveTab] = useState();
  const [downloadStart, setDownloadStart] = useState(false);
  const [downloadModal, setDownloadModal] = useState(false);
  const [finFromYearDownload, setFinFormYearDownload] = useState(null);
  const [displayType, setDisplayType] = useState([]);
  const [panDataFrom, setPanDataFrom] = useState([]);
  const [panData, setPanData] = useState([]);
  const [exportType, setExportType] = useState(false);
  const [msgDisplay, setMsgDisplay] = useState(null);
  const [downloadDate, setDownloadDate] = useState(false);
  const location = useLocation();
  const [typeOfDownload,setTypeOfDonwload] = useState("");
  const queryParams = new URLSearchParams(location.search);
  const wizardData = queryParams.get("gstr3b");

  //** Shortcut keys
  useHotkeys(
    keysMap.CLEAR_DATA,
    () => {
      !block;
    },
    { enableOnFormTags }
  );
  // useHotkeys(keysMap.DOWNLOAD_GOVT_DATA, () => { block == false && !downloadStart  ? downloadGovtGstr3Filed() : '' }, { enableOnFormTags });
  useHotkeys(
    keysMap.DOWNLOAD_GOVT_DATA,
    () => {
      block == false && wizardBtn == 1 && !downloadStart
        ? setDownloadModal(true)
        : "";
    },
    { enableOnFormTags }
  );

  useHotkeys(
    keysMap.EXPORT_ALL_DATA,
    () => {
      !block && exportButtonCMP08();
    },
    { enableOnFormTags }
  );

  const [composeOpen, setComposeOpen] = useState(false);
  const toggleCompose = () => setComposeOpen(!composeOpen);

  const G_UCParId =
    sessionStorage.getItem(globleVariable.G_UCParId) &&
    SessionFunction.getSessionValue(globleVariable.G_UCParId, true);
  const userIds =
    localStorage.getItem(globleVariable.userId) &&
    LocalFunction.getLocalValue(globleVariable.userId, true);
  const gstr3BFiledFromDt =
    sessionStorage.getItem(globleVariable.gstr3BFiledFromDt) &&
    SessionFunction.getSessionValue(globleVariable.gstr3BFiledFromDt, true);
  const gstr3BFiledToDt =
    sessionStorage.getItem(globleVariable.gstr3BFiledToDt) &&
    SessionFunction.getSessionValue(globleVariable.gstr3BFiledToDt, true);
  const isdefaultYear =
    sessionStorage.getItem(globleVariable.defaultYear) &&
    SessionFunction.getSessionValue(globleVariable.defaultYear, true);
  const gstr3BToDt =
    sessionStorage.getItem(globleVariable.defaultYear) !== null &&
    sessionStorage.getItem(globleVariable.defaultYear) !== "" &&
    sessionStorage.getItem(globleVariable.defaultYear) !== undefined
      ? SessionFunction?.getSessionValue(globleVariable?.defaultYear, true)
      : "";
  const token = LocalFunction.getLocalValue(globleVariable.tokenKey, true);
  const finYearLoggedIn = parseInt(gstr3BToDt?.slice(2)) - 1;
  const finMonthLoggedIn = parseInt(gstr3BToDt?.slice(0, 2));

  useEffect(() => {
    console.log("default value");
    if (displayType == true) {
      let defaultValueFrom = null;
      let defaultValueTo = null;

      if (
        defaultValueFrom !== undefined &&
        defaultValueFrom !== null &&
        defaultValueFrom !== ""
      ) {
        defaultValueFrom = panDataFrom?.filter(
          (item) => item.value == itc04DateRange
        )[0];
        setFinFormYearDownload(defaultValueFrom);
      } else {
        const matchingYearFrom = panDataFrom?.filter(
          (item) => item?.value?.slice(2) == finYearLoggedIn
        );
        const defaultValueFrom = matchingYearFrom?.filter(
          (item) =>
            item?.value?.slice(0, 2) == finMonthLoggedIn ||
            item?.value?.slice(0, 2) == finMonthLoggedIn + 1 ||
            item?.value?.slice(0, 2) == finMonthLoggedIn + 2
        );

        if (finYearLoggedIn < 2018) {
          const defaultValueFrom = panDataFrom[panDataFrom?.length - 1];
          setFinFormYearDownload(defaultValueFrom);
        } else {
          if (finYearLoggedIn == 2018 && defaultValueFrom?.length == 0) {
            const defaultValueFrom = panDataFrom[panDataFrom?.length - 1];
            setFinFormYearDownload(defaultValueFrom);
          } else {
            if (defaultValueFrom?.length == 0) {
              setFinFormYearDownload(panDataFrom[0]);
            } else {
              setFinFormYearDownload(defaultValueFrom);
            }
          }
        }
      }
    }
  }, [displayType]);

  const finYearOption =
    localStorage.getItem(globleVariable.rangeFiltersCMP08) &&
    LocalFunction.getLocalValue(globleVariable.rangeFiltersCMP08, true);
  const YearList =
    finYearOption !== undefined &&
    finYearOption !== null &&
    finYearOption !== "" &&
    finYearOption !== "undefined"
      ? JSON.parse(finYearOption)
      : [];
  const subId =
    localStorage.getItem(globleVariable.subscriptionId) &&
    LocalFunction.getLocalValue(globleVariable.subscriptionId, true);
  const GGSTIN =
    sessionStorage.getItem(globleVariable.G_GSTIN) &&
    SessionFunction.getSessionValue(globleVariable.G_GSTIN, true);

  const storeExport = useSelector((state) => state?.layout?.exportData);

  useEffect(() => {
    setPanData(YearList);
    setPanDataFrom(YearList);
    setDisplayType(true);
  }, []);

  const setGSRT3bFiledData = (summary, tabBtnData) => {

    setSummary(summary);
    setactiveTab(tabBtnData);
  };



  const onDateSelect = () => {
    let defaultValueFrom = null;
    let defaultValueTo = null;
    if (
      gstr3BFiledFromDt !== null &&
      gstr3BFiledFromDt !== "" &&
      gstr3BFiledFromDt !== undefined
    ) {
      console.log("set from date");
      defaultValueFrom = panData?.filter(
        (item) => item.value == gstr3BFiledFromDt
      )[0];
    } else {
      defaultValueFrom = panData?.filter(
        (item) => Number(item.value) == Number(isdefaultYear)
      )[0];
    }

    if (
      gstr3BFiledToDt !== null &&
      gstr3BFiledToDt !== "" &&
      gstr3BFiledToDt !== undefined
    ) {
      defaultValueTo = panData?.filter(
        (item) => item.value == gstr3BFiledToDt
      )[0];
    } else {
      defaultValueTo = panData?.filter(
        (item) => Number(item.value) == Number(isdefaultYear)
      )[0];
    }

    if (
      defaultValueFrom !== undefined &&
      defaultValueFrom !== null &&
      defaultValueFrom !== ""
    ) {
      setFinFormYearDownload(defaultValueFrom);
      // sessionStorage.setItem('gstr1FiledFromDt', defaultValueFrom?.value)
      SessionFunction.setSessionValue(
        globleVariable.gstr3BFiledFromDt,
        defaultValueFrom?.value,
        true
      );
    }
    if (
      defaultValueTo !== undefined &&
      defaultValueTo !== null &&
      defaultValueTo !== ""
    ) {
      // setMonthFrom(defaultValueTo)
      SessionFunction.setSessionValue(
        globleVariable.gstr3BFiledToDt,
        defaultValueTo?.value,
        true
      );

      // sessionStorage.setItem('gstr1FiledToDt', defaultValueTo?.value)
    }
  };


  useEffect(() => {
    //wizardData && stepper !== null  && stepper.to(2)
    wizardData && stepper !== null && stepper.to(Number(wizardData) + 1);
  }, [stepper]);

  const childFunc = useRef(null);


  const steps = [
    {
      id: "cmp08-downloads",
      title: "CMP 08 Downloads",
      content: <GSTR3BFiledDownload childFunc={childFunc} downloadModal={downloadModal} setDownloadModal ={setDownloadModal} setTypeOfDonwload = {setTypeOfDonwload} typeOfDownload = {typeOfDownload}  />,
      // content: <Outlet context={{ setGSRT3bFiledData, stepper, wizardBtn, block, setBlock }} />,
      active: wizardData == 1 ? false : true,
    },
    {
      id: "cmp08-summary",
      title: "Summary and Invoices Details",
      content: (
        <CMP08FiledData
          wizardBtn={wizardBtn}
          setDownloadStart={setDownloadStart}
          exportStart={exportType}
          setExportType={setExportType}
          downloadStart={downloadStart}
          downloadDate={downloadDate}
          setDownloadDate={setDownloadDate}
          setFinFormYearDownload={setFinFormYearDownload}
          finFromYearDownload={finFromYearDownload}
        />
      ),
      active: wizardData == 1 ? true : false,
    },
  ];
  wizardRef?.current?.addEventListener("shown.bs-stepper", function (event) {
    setWizardBtn(event?.detail?.indexStep);
    console.log(event?.detail?.indexStep, "event?.detail?.indexStep");
  });
  const loadFunction = (value) => {
    setBlock(value);
  };

  const closeModal = () => {
    // clearErrors();
    setDownloadModal(false);
  };

  // ** Loading Export
  const loadFunctionExport = (value, fileName, selectedYear) => {
    setBlock(value);
  };


  const SelectReturnPeriodYear = (value) => {

    setFinFormYearDownload(value);
  };

  const downloadGovtCMP08Filed = () => {
    console.log("click download");
    setBlock(true);
    const downloadGovtCMP08Filed = typeOfDownload == 'withOTP' ?  cmp08FiledService.downloadGovtCMP08Filed :  cmp08FiledService.downloadGovtCMP08FiledWithOutOtp
    downloadGovtCMP08Filed(G_UCParId,userIds, finFromYearDownload?.value !== null &&  finFromYearDownload?.value !== undefined &&
        finFromYearDownload?.value !== ""  ?  finFromYearDownload?.value : panDataFrom[0].value,
        subId,
        GGSTIN
      )
      .then((res) => {
        console.log(res);
        setBlock(false);
        if (res.data.status === errorCodeConfig.APIDefaultCode.GovtOTPExpire) {
          closeModal();
          setMsgDisplay(res?.data?.errorMessage);
          setBlock(false);
          // loadFunction(false);
          setComposeOpen(true);
          // toast.dismiss();
          // dispatch(handleModelOTP(!store.layout.modelVerifyOTP));
        } else {
          if (
            res?.status == 200 &&
            res?.data?.status === errorCodeConfig.APIDefaultCode.Success
          ) {
            setDownloadStart(true);
            setDownloadModal(false);
            setDownloadDate(true)
            SessionFunction.setSessionValue(globleVariable.gstr3BFiledFromDt, finFromYearDownload?.value, true)

            toast.success(res.data.successMessage, {
              position: "top-right",
            });
          } else {
            toast.error(res?.data?.errorMessage, {
              position: "top-right",
            });
            setDownloadModal(false);
          }
        }
      })
      .catch((error) => {
        setBlock(false);
        setDownloadModal(false);
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
  };



  useEffect(() => {
    if (displayType == true) {
      onDateSelect();
    }
  }, [displayType]);

  // ** Export
  const exportButtonCMP08 = () => {

    const fromDate =  SessionFunction.getSessionValue(
      globleVariable.gstr3BFiledFromDt,
      true
    );
    const toDate =   SessionFunction.getSessionValue(
      globleVariable.gstr3BFiledToDt,
      true
    );



    setBlock(true);
    cmp08FiledService
      .exportCMP08Filed(
        G_UCParId,
        fromDate !== "" && fromDate !== null  && fromDate !== undefined ? fromDate   : isdefaultYear,
        toDate !== "" && toDate !== null  && toDate !== undefined ? toDate   : isdefaultYear,
        subId,
        GGSTIN,
        userIds,
        token
      )
      .then((res) => {
        if (
          res.status == 200 &&
          res?.data?.status == errorCodeConfig.APIDefaultCode.Success
        ) {
          setBlock(false);
          setExportType(true);


          downloadURL(res.data.data);

        } else if (res?.status == 401) {
          setExportType(true);
          tokenExpiresRedirect();
        } else {
          setExportType(true);

          loadFunction(false);
          toast.error(res?.data?.errorMessage, {
            position: "top-right",
          });
        }
      })
      .catch((error) => {
        console.log("res2");
        loadFunction(false);
        console.log(error.message);
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


  return (
    <Fragment>
      {block && <div className="loading1">Loading&#8230;</div>}

      <div className="content-header row py-1">
        <div className="content-header-left col-md-6 col-12">
          <div className="row breadcrumbs-top">
            <div className="col-12">
              <Breadcrumbs
                title="Cmp08 filed data"
                data={[
                  {title: "Reports", link: urlEndpointConfig.REPORT_ALL },
                  { title: "CMP 08 Summary"},
                ]}
              />
            </div>
          </div>
        </div>

        {wizardBtn === 0 && (
          <div className="content-header-right text-md-end col-md-6 col-12 d-md-block d-none">
            <Button
              type="button"
              className="me-1"
              outline
              color="danger"
              id="clearbtn"
              onClick={() => childFunc.current()}
            >
              <i className="fa fa-filter fa-lg"></i>
              <span className="align-middle ms-50">Clear</span>
            </Button>
            <UncontrolledTooltip placement="top" target="clearbtn">
              Clear [{keysMap.CLEAR_DATA}]
            </UncontrolledTooltip>
          </div>
        )}
        {wizardBtn === 1 && (
          <div className="content-header-right text-md-end col-md-6 col-12 d-md-block d-none">
            <Button
              type="button"
              className="me-1"
              outline
              onClick={() => setDownloadModal(true)}
              // disabled={activeTab.btnDisable1}
              id="downloaddata"
              color="danger"
            >
              <DownloadCloud size={14} />
              <span className="align-middle ms-50">Download </span>
            </Button>
            <UncontrolledTooltip placement="top" target="downloaddata">
              Download [{keysMap.DOWNLOAD_GOVT_DATA}]
            </UncontrolledTooltip>
            <Button
              type="button"
              className="me-1"
              outline
              id="exportdata"
              onClick={exportButtonCMP08}
              color="danger"
            >
              <DownloadCloud size={14} />
              <span className="align-middle ms-50">Export </span>
            </Button>
            <UncontrolledTooltip placement="top" target="exportdata">
              Export [{keysMap.EXPORT_ALL_DATA} ]
            </UncontrolledTooltip>
            {/* <GSTR3BExportButton setWizardBtn={setWizardBtn} stepper={stepper} handleExportData={handleExportData} subId={subId} userIds={userIds} loadFunction={loadFunctionExport} clientId={G_UCParId} GGSTIN={GGSTIN} finYear={gstr3BFiledFromDt} finMonth={gstr3BFiledToDt}  isloading={block} /> */}
          </div>
        )}

      </div>
      <div className="horizontal-wizard">
        <Wizard
          instance={(el) => setStepper(el)}
          ref={wizardRef}
          steps={steps}
          options={{
            linear: false,
          }}
          className="gstr1-wizard"
        />
      </div>

      <Modal
        backdrop="static"
        isOpen={downloadModal}
        toggle={() => setDownloadModal(!downloadModal)}
        className="modal-dialog-centered  modal-sm"
      >
        <div className="modal-header">
          <h2 className="modal-title w-100 text-center">Download Data</h2>
          <div className="modal-actions">
            <a
              onClick={() => setDownloadModal(!downloadModal)}
              className="text-body" >
              <X size={14} />
            </a>
          </div>
        </div>

        <hr></hr>
        <ModalBody className="px-sm-2 mx-30 pb-2">
          <Row tag="form" className="gy-1 pt-75">
            <Col xs={2}></Col>
            <Col xs={7}>
              <Label className="form-label" for="status">
                <b> Return Period </b>
              </Label>
              <Select
                id="purchaseId_invtype"
                maxMenuHeight="120px"
                isClearable={false}
                theme={selectThemeColors}
                closeMenuOnSelect={true}
                components={animatedComponents}
                placeholder={DROPDOWN_PLACEHOLDER}
                options={panDataFrom}
                className="basic-multi-select"
                classNamePrefix="select"
                value={finFromYearDownload}
                onChange={SelectReturnPeriodYear}
              />
            </Col>
            <Col xs={3}></Col>

            <Col xs={12} className="text-center pt-50">
              <Button
                className="me-1"
                color="danger"
                onClick={downloadGovtCMP08Filed}
                outline>
                Continue
              </Button>
              <Button
                type="reset"
                color="secondary"
                outline
                onClick={closeModal}
              >
                Cancel
              </Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
      <VerificationModal
        composeOpen={composeOpen}
        toggleCompose={toggleCompose}
        userClientIds={G_UCParId}
        messageDisplay={msgDisplay}
      ></VerificationModal>
    </Fragment>
  );
};

export default GSTR3BFiled;
