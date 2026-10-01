import { useEffect, Fragment, useRef, useState } from "react";
import Breadcrumbs from "@components/breadcrumbs";
import Wizard from "@components/wizard";
import { Outlet, useLocation } from "react-router-dom";
import { UncontrolledTooltip, Button } from "reactstrap";
import { ArrowLeft, ArrowRight, Trash2 } from "react-feather";
// import Gstr9Download from "./gstr9-download";
import { registerAllModules } from "handsontable/registry";
// import DeleteModelGSTR9 from "../../components/models/DeleteModelGSTR9";
import getSessionFunction from "@configs/getSessionFunction";
import LocalFunction from "@configs/getLocalFunction";
import SessionFunction from "@configs/getSessionFunction";
import { globleVariable } from "@configs/globalVariable";
import { keysMap, enableOnFormTags } from "@configs/config";
import gstr9Service from "../../../services/gstr9/gstr9Service";
import { downloadURL } from "@helper/downloadUrl";
import { useHotkeys } from "react-hotkeys-hook";
import errorCodeConfig from "@configs/apiErrorCodeConfig";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
// import DropDownGstr9Import from "../../components/Dropdown-GSTR9-Import";
import Gstr1DownloadService from "../../../services/gstr1/gstr1Services/gstr1DownloadService";
import tdstcsFiledService from "../../../services/tdstcsFiled/tdstcsFiledService";
import DeleteModelTDSTCS from "../../components/models/DeleteModalTDSTCS";
import Footer from "./footer";
// import SubmitForms from "./SubmitForms";

registerAllModules();

const TDSTCS = () => {
  const wizardRef = useRef(null);

  // ** State
  const [stepper, setStepper] = useState(null);
  const [block, setBlock] = useState(false);
  const [wizardBtn, setWizardBtn] = useState(0);
  const [deleteModalshow, setDeleteModalshow] = useState(false);
  const [activeTab, setActiveTab] = useState();
  const [summary, setSummary] = useState(true);
  const [returnStatus9, setReturnStatus9] = useState(false);
  const [tdsTcsSectionId, setTdsTcsSectionId] = useState("0");
  const [finFromYear, setFinFormYear] = useState(null);
  const [finToYear, setFinToYear] = useState(null);

  const toggleDeleteCompose = () => {
    setDeleteModalshow(!deleteModalshow);
  };

  const { state } = useLocation();

  const G_UCParId =
    sessionStorage.getItem(globleVariable.G_UCParId) &&
    getSessionFunction.getSessionValue(globleVariable.G_UCParId, true);

  const GFY =
    sessionStorage.getItem(globleVariable.G_FY) &&
    SessionFunction.getSessionValue(globleVariable.G_FY, true);

  const G_GSTIN =
    sessionStorage.getItem(globleVariable.G_GSTIN) &&
    SessionFunction.getSessionValue(globleVariable.G_GSTIN, true);

  const GFM =
    sessionStorage.getItem(globleVariable.G_FM) &&
    SessionFunction.getSessionValue(globleVariable.G_FM, true);

  wizardRef?.current?.addEventListener("shown.bs-stepper", function (event) {
    setWizardBtn(event?.detail?.indexStep);
  });

  // ShortCut Key
  useHotkeys(
    keysMap.EXPORT_DATA,
    () => {
      block == false && exportAllData();
    },
    { enableOnFormTags }
  );

  useHotkeys(
    keysMap.DELETE_DATA,
    () => {
      (wizardBtn == 0 || wizardBtn == 1) &&
        block == false &&
        toggleDeleteCompose();
    },
    { enableOnFormTags }
  );

  const exportAllData = () => {
    setBlock(true);
    tdstcsFiledService
      .tdstcsReturnExport(
        G_UCParId,
        finFromYear?.value,
        finToYear?.value,
        tdsTcsSectionId,
        G_GSTIN
      )
      .then((res) => {
        if (
          res?.status == 200 &&
          res?.data?.status == errorCodeConfig.APIDefaultCode.Success
        ) {
          setBlock(false);
          downloadURL(res?.data?.data);
        } else if (res?.status == 401) {
          setBlock(false);
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
            confirmButton: "btn btn-outline-danger",
          },
          buttonsStyling: false,
        });
      });
  };

  const returnFileStatus = () => {
    // sessionStorage.removeItem("gstR9AckNumber")
    const payLoad = {
      clientId: G_UCParId,
      gstinNumber: G_GSTIN,
      financialYearIdID: parseInt(GFY),
      month: parseInt(GFM),
    };
    setBlock(true);
    Gstr1DownloadService.checkFiledUserStatus(payLoad)
      .then((res) => {
        if (
          res.status === 200 &&
          res.data.status === errorCodeConfig.APIDefaultCode.Success
        ) {
          setBlock(false);
          if (res?.data?.data?.isGSTR9Filed) {
            if (res?.data?.data?.gstR9AcknowledgementNumber) {
              sessionStorage.setItem(
                "gstR9AckNumber",
                res?.data?.data?.gstR9AcknowledgementNumber
              );
            }
            sessionStorage.setItem("btnDisable9", "5");
            // stepper.next();
            setReturnStatus9(true);
          } else {
            sessionStorage.setItem("btnDisable9", "");
          }
        } else {
          setBlock(false);
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

  const setTDSTCSData = (summary, tabBtnData) => {
    setSummary(summary);
    setActiveTab(tabBtnData);
  };

  useEffect(() => {
    if (wizardBtn == 0) {
      //   returnFileStatus();
    }
  }, [wizardBtn]);

  useEffect(() => {
    if (state?.stayOn && stepper) {
      stepper.to(state.stayOn);
    }
  }, [state, stepper]);

  // ** Wizard Steps
  const steps = [
    {
      id: "importData",
      title: "Import Data",
      content: (
        <>
          {/* <DropDownGstr9Import
            stepper={stepper}
            block={block}
            setBlock={setBlock}
            filterYear={filterYear}
          ></DropDownGstr9Import> */}

          <Footer
            stepper={stepper}
            onNext={() => stepper.next()}
            onPrevious={() => stepper.previous()}
            firstPage={true}
          />
        </>
      ),
    },
    {
      id: "tds-tcs-summary",
      title: "Summary & Invoices",
      content: (
        <Outlet
          context={{
            block,
            setBlock,
            stepper,
            wizardBtn,
            activeTab,
            setActiveTab,
            setTdsTcsSectionId,
            setTDSTCSData,
            setFromYear: setFinFormYear,
            setToYear: setFinToYear,
          }}
        />
      ),
    },
    {
      id: "save-data",
      title: "Upload Data",
      className: "text-danger myRow",
      content: (
        // <Gstr9Download
        //   stepper={stepper}
        //   clientIds={G_UCParId}
        //   GSTIN={G_GSTIN}
        //   userIds={userIds}
        //   wizardIndex={wizardBtn}
        //   isGSTR9FiledStatus={returnStatus9}
        //   finYearId={finYearId}
        // ></Gstr9Download>
        <Footer
          stepper={stepper}
          onNext={() => stepper.next()}
          onPrevious={() => stepper.previous()}
        />
      ),
    },
    {
      id: "tdsTcsFiled-summary",
      title: "Submit Return",
      content: (
        // <SubmitForms
        //   userIds={userIds}
        //   clientIds={G_UCParId}
        //   GSTIN={G_GSTIN}
        //   stepper={stepper}
        //   finYear={GFY}
        //   finMonth={GFM}
        //   finYearId={finYearId}
        //   wizardIndex={wizardBtn}
        // />
        <Footer
          stepper={stepper}
          onNext={() => stepper.next()}
          onPrevious={() => stepper.previous()}
          lastPage={true}
        />
      ),
    },
  ];

  return (
    <Fragment>
      {block && <div className="loading1">Loading&#8230;</div>}
      <div className="content-header row py-1">
        <div className="content-header-left col-md-6 col-12">
          <div className="row breadcrumbs-top">
            <div className="col-12">
              {wizardBtn == 0 ? (
                <Breadcrumbs
                  title="Purchase Summary"
                  data={[
                    { title: "GST Returns" },
                    { title: "TDS/TCS Import Data" },
                  ]}
                />
              ) : wizardBtn == 1 ? (
                <Breadcrumbs
                  title="Purchase Summary"
                  data={[
                    { title: "GST Returns" },
                    { title: "TDS/TCS Summary & Invoices" },
                  ]}
                />
              ) : wizardBtn == 2 ? (
                <Breadcrumbs
                  title="Purchase Summary"
                  data={[
                    { title: "GST Returns" },
                    { title: "TDS/TCS Upload Data" },
                  ]}
                />
              ) : (
                <Breadcrumbs
                  title="Purchase Summary"
                  data={[
                    { title: "GST Returns" },
                    { title: "TDS/TCS Submit Return" },
                  ]}
                />
              )}
            </div>
          </div>
        </div>

        <div className="content-header-right text-md-end col-md-6 col-12 d-md-block d-none">
          {wizardBtn == 1 && (
            <>
              <Button
                className="btn-icon me-1"
                outline
                color="danger"
                id="btnDeleteTDSTCS"
                onClick={toggleDeleteCompose}
              >
                <Trash2 size={14} />
                <span className="align-middle ms-50">Delete</span>
                <UncontrolledTooltip placement="top" target="btnDeleteTDSTCS">
                  Delete [{keysMap.DELETE_DATA}]
                </UncontrolledTooltip>
              </Button>
              <Button
                className="me-1"
                type="button"
                outline
                onClick={exportAllData}
                color="danger"
                id="btnExp1"
              >
                <i className="fa fa-file-excel-o"></i> {"    "}
                Export
                <UncontrolledTooltip placement="top" target="btnExp1">
                  Export [{keysMap.EXPORT_DATA}]
                </UncontrolledTooltip>
              </Button>
            </>
          )}

          {(activeTab?.activeTab == 1 ||
            activeTab?.activeTab == 2 ||
            activeTab?.activeTab == 3 ||
            activeTab?.activeTab == 4) && (
            <>
              <Button
                type="button"
                className="me-1"
                outline
                color="danger"
                id="clearbtn"
                onClick={activeTab.clearFilters}
              >
                <i className="fa fa-filter fa-lg"></i>
                <span className="align-middle ms-50">Clear</span>
              </Button>
              <UncontrolledTooltip placement="top" target="clearbtn">
                Clear [{keysMap.CLEAR_DATA}]
              </UncontrolledTooltip>
            </>
          )}
        </div>
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
      {deleteModalshow && (
        <DeleteModelTDSTCS
          Heading="Delete TDS/TCS"
          SuccessButtonText="Delete"
          show={deleteModalshow}
          toggleCompose={toggleDeleteCompose}
          fromYear={finFromYear}
          toYear={finToYear}
          callBackAfterDelete={() => {
            if (summary) {
              activeTab.getData(finFromYear?.value, finToYear?.value);
            } else {
              activeTab.getData();
            }
          }}
        ></DeleteModelTDSTCS>
      )}
    </Fragment>
  );
};

export default TDSTCS;
