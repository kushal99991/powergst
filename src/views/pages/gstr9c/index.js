import React, {
  useEffect,
  Fragment,
  useState,
  useRef,
  useReducer,
} from "react";
import Breadcrumbs from "@components/breadcrumbs";
import Wizard from "@components/wizard";
import PreparePartA from "./preparePartA";
import DownloadJson from "./downloadJson";
import DeleteModelGSTR9c from "../../components/models/DeleteModelGSTR9c";
import getSessionFunction from "@configs/getSessionFunction";
import { globleVariable } from "@configs/globalVariable";
import LocalFunction from "@configs/getLocalFunction";
import SessionFunction from "@configs/getSessionFunction";
import { Button, Row, UncontrolledTooltip, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import { ArrowLeft, ArrowRight, Download, Trash2, ChevronDown } from "react-feather";
import { keysMap, enableOnFormTags } from "@configs/config";
import { useHotkeys } from "react-hotkeys-hook";
import gstr9cService from "../../../services/gstr9c/gstr9cService";
import errorCodeConfig from "../../../configs/apiErrorCodeConfig";
import { downloadURL } from "../../../helper/downloadUrl";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import DropDownGstr9CImport from "../../components/Dropdown-GSTR9C-Import";
import UploadGstr9c from "./UploadGstr9c";
import Gstr1DownloadService from "../../../services/gstr1/gstr1Services/gstr1DownloadService";
import SubmitForms from "./SubmitForms";

const GSTR9C = () => {
  const wizardRef = useRef(null);

  const [block, setBlock] = useState(false);
  const [wizardBtn, setWizardBtn] = useState(0);
  const [stepper, setStepper] = useState(null);
  const [activeTab, setActiveTab] = useState("1");
  const [changeFound, setChangeFound] = useState(0);
  const [returnStatus9c, setReturnStatus9c] = useState(false);

  const [deleteModelShow, setDeleteModelShow] = useState(false);
  const [deleteType, setDeleteType] = useState('single')

  wizardRef?.current?.addEventListener("shown.bs-stepper", function (event) {
    setWizardBtn(event?.detail?.indexStep);
  });

  const G_UCParId =
    sessionStorage.getItem(globleVariable.G_UCParId) &&
    getSessionFunction.getSessionValue(globleVariable.G_UCParId, true);
  const USerId =
    localStorage.getItem(globleVariable.userId) &&
    LocalFunction.getLocalValue(globleVariable.userId, true);
  const GFY =
    sessionStorage.getItem(globleVariable.G_FY) &&
    SessionFunction.getSessionValue(globleVariable.G_FY, true);
  const G_GSTIN =
    sessionStorage.getItem(globleVariable.G_GSTIN) &&
    SessionFunction.getSessionValue(globleVariable.G_GSTIN, true);

  const userDatadecrypt = LocalFunction.getLocalValue(
    globleVariable.userData,
    true
  );

  const GFM =
    sessionStorage.getItem(globleVariable.G_FM) &&
    SessionFunction.getSessionValue(globleVariable.G_FM, true);

  const userData = userDatadecrypt && JSON.parse(userDatadecrypt);
  const finYearOption = userData && userData.data.rangeFiltersGSTR9C;
  const filterYear = finYearOption?.filter((p) => p.value == GFY)[0] || finYearOption[0];
  const finYearId = finYearOption?.filter((p) => p.value == GFY)[0]?.value || finYearOption[0].value;

  const isMultipleCompanyDelete = userData && userData.data.isMultipleCompanyDelete;


  const exportAllData = () => {
    setBlock(true);
    gstr9cService
      .exportData(G_UCParId, finYearId, USerId, G_GSTIN)
      .then((res) => {
        if (
          res?.status == 200 &&
          res?.data?.status == errorCodeConfig.APIDefaultCode.Success
        ) {
          downloadURL(res.data.data);
        } else {
          toast.error(res?.data?.errorMessage, {
            position: "top-right",
          });
        }
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "",
          text: error?.message,
          customClass: {
            confirmButton: "btn btn-outline-danger",
          },
          buttonsStyling: false,
        });
      })
      .finally(() => {
        setBlock(false);
      });
  };


  const onClickExportJSONAPIGstr9c = () => {
    const payLoad = {
      userClientId: G_UCParId,
      userId: LocalFunction.getLocalValue(globleVariable.userId, true),
      financialYearId: parseInt(GFY),
      loggedGSTIN: G_GSTIN,

    };
    setBlock(true);
    console.log(payLoad, "payLoadpayLoadpayLoadpayLoad");
    gstr9cService.gstr9cExportJson(payLoad)
      .then((res) => {
        setBlock(false);

        if (
          res?.status === 200 &&
          res.data.status === errorCodeConfig.APIDefaultCode.Success
        ) {

          downloadURL(res?.data?.data);

          console.log(res?.data.data, "url");
          // toast.success(res.data.successMessage, {
          //   position: "top-right",
          // });
        } else {
          setBlock(false);
          Swal.fire({
            icon: "error",
            title: "",
            text: res?.data?.errorMessage,
            customClass: {
              confirmButton: "btn btn-danger",
            },
            buttonsStyling: false,
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

  }
  const toggleDeleteCompose = () => {
    setDeleteModelShow(!deleteModelShow);
  };


  const multipleDeleteFunc = (type) => {
    if (type == 'single') {
      setDeleteType('single')
    } else if (type == 'multiple') {
      setDeleteType('multiple')
    }
    toggleDeleteCompose()
  }


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

  const returnFileStatus = () => {
    // sessionStorage.removeItem("gstR9CAckNumber");
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
          if (res?.data?.data?.isGSTR9CFiled) {
            if (res?.data?.data?.gstR9CAcknowledgementNumber) {
              sessionStorage.setItem(
                "gstR9CAckNumber",
                res?.data?.data?.gstR9CAcknowledgementNumber
              );
            }
            sessionStorage.setItem("btnDisable9c", "5");
            // stepper.next();
            setReturnStatus9c(true);
          } else {
            sessionStorage.setItem("btnDisable9c", " ");
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

  useEffect(() => {
    if (wizardBtn == 0) {
      returnFileStatus();
    }
  }, [wizardBtn]);

  const steps = [
    {
      id: "import-data",
      title: "Import Data",
      content: (
        <>
          <DropDownGstr9CImport
            stepper={stepper}
            block={block}
            setBlock={setBlock}
            filterYear={filterYear}
          ></DropDownGstr9CImport>
        </>
      ),
    },
    {
      id: "gstr9c-summary",
      title: "Summary & Invoices",
      content: (
        <>
          {wizardBtn == 1 ? (
            <PreparePartA
              stepper={stepper}
              block={block}
              setBlock={setBlock}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              changeFound={changeFound}
            />
          ) : null}
        </>
      ),
    },
    {
      id: "upload-data",
      title: "Upload Data",
      content: (
        <UploadGstr9c
          stepper={stepper}
          clientIds={G_UCParId}
          GSTIN={G_GSTIN}
          userIds={USerId}
          wizardIndex={wizardBtn}
          isGSTR9CFiledStatus={returnStatus9c}
          finYearId={finYearId}
        />
      ),
    },
    {
      id: "submit-return",
      title: "Submit Return",
      content: (
        <SubmitForms
          userIds={USerId}
          clientIds={G_UCParId}
          GSTIN={G_GSTIN}
          stepper={stepper}
          finYear={GFY}
          finMonth={GFM}
          wizardIndex={wizardBtn}
          finYearId={finYearId}
        />
      ),
    },
  ];

  const RenderBreadcrumbs = () => {
    let postTitle = "";

    switch (true) {
      case wizardBtn == 0:
        postTitle = "GSTR 9C Import Data";
        break;

      case wizardBtn == 1:
        postTitle = "GSTR 9C Summary & Invoices";
        break;

      case wizardBtn == 2:
        postTitle = "GSTR 9C Upload Data";
        break;

      case wizardBtn == 3:
        postTitle = "GSTR 9C Submit Return";
        break;
    }

    return (
      <Breadcrumbs
        title="GSTR 9C"
        data={[
          { title: "GST Returns", link: `/gst-returns` },
          {
            title: postTitle,
            link: `/gst-returns/gstr9c`,
          },
        ]}
      />
    );
  };

  return (
    <Fragment>
      {block && <div className="loading1">Loading&#8230;</div>}

      <div className="content-header row py-1">
        <div className="content-header-left col-md-6 col-12">
          <div className="row breadcrumbs-top">
            <div className="col-12">
              <RenderBreadcrumbs />
            </div>
          </div>
        </div>

        <div className="content-header-right text-md-end col-md-6 col-12 d-md-block d-none">
          {((wizardBtn == 0 || wizardBtn == 1) && isMultipleCompanyDelete == 0) && (
            <Button
              className="btn-icon me-1"
              outline
              color="danger"
              id="btnDeleteGSTR9C"
              onClick={toggleDeleteCompose}
            >
              <Trash2 size={14} />
              <span className="align-middle ms-50">Delete</span>
              <UncontrolledTooltip placement="top" target="btnDeleteGSTR9C">
                Delete [{keysMap.DELETE_DATA}]
              </UncontrolledTooltip>
            </Button>
          )}


          {
            isMultipleCompanyDelete == 1 &&
            <UncontrolledButtonDropdown>
              <DropdownToggle color='danger' outline caret className="me-1">
                <Trash2 size={14} />
                <span className="align-middle ms-50">
                  Delete
                </span>  &nbsp;
                <ChevronDown size={14} />
              </DropdownToggle>
              <DropdownMenu className="dropdown-delete">
                <DropdownItem tag='a' onClick={() => multipleDeleteFunc('single')}  >Single Company Delete</DropdownItem>
                <DropdownItem tag='a' onClick={() => multipleDeleteFunc('multiple')}>Multiple Company Delete</DropdownItem>

              </DropdownMenu>
            </UncontrolledButtonDropdown>

          }


          <Button
            type="button"
            outline
            onClick={exportAllData}
            color="danger"
            id="btnExp1"
            className="me-1"
          >
            <i className="fa fa-file-excel-o"></i>&nbsp; Export
            <UncontrolledTooltip placement="top" target="btnExp1">
              Export [{keysMap.EXPORT_DATA}]
            </UncontrolledTooltip>
          </Button>

          <Button
            type="button"
            outline
            onClick={onClickExportJSONAPIGstr9c}
            color="danger"
            id="exportjsonData"
          >
            <i className="fa fa-file-code-o"></i>&nbsp; Export JSON
            <UncontrolledTooltip placement="top" target="exportjsonData">
              Export JSON
            </UncontrolledTooltip>
          </Button>
        </div>
      </div>

      <div className="horizontal-wizard">
        <Wizard
          instance={(el) => setStepper(el)}
          ref={wizardRef}
          steps={steps}
          options={{ linear: false }}
          className="gstr1-wizard"
        />
      </div>

      {deleteModelShow && (
        <DeleteModelGSTR9c
          Heading="Delete GSTR 9C"
          SuccessButtonText="Delete"
          show={deleteModelShow}
          toggleCompose={toggleDeleteCompose}
          G_UCParId={G_UCParId}
          userId={USerId}
          finYearId={finYearId}
          setActiveTab={setActiveTab}
          setChangeFound={setChangeFound}
          Company_GSTIN={G_GSTIN}
          deleteType={deleteType}
        ></DeleteModelGSTR9c>
      )}
    </Fragment>
  );
};

export default GSTR9C;
