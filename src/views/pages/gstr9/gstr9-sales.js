import { useEffect, Fragment, useRef, useState } from "react";
import Breadcrumbs from "@components/breadcrumbs";
import Wizard from "@components/wizard";
import { Outlet } from "react-router-dom";
import { UncontrolledTooltip, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import { Trash2, ChevronDown } from "react-feather";
import Gstr9Download from "./gstr9-download";
import { registerAllModules } from "handsontable/registry";
import DeleteModelGSTR9 from "../../components/models/DeleteModelGSTR9";
import Gstr9FileDataSummary from "./gstr9-file-data-summary";
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
import DropDownGstr9Import from "../../components/Dropdown-GSTR9-Import";
import Gstr1DownloadService from "../../../services/gstr1/gstr1Services/gstr1DownloadService";
import SubmitForms from "./SubmitForms";
import { urlEndpointConfig } from '@configs/urlEndpoint';

registerAllModules();

const Gstr9Purchase = () => {
  const wizardRef = useRef(null);

  // ** State
  const [stepper, setStepper] = useState(null);
  const [block, setBlock] = useState(false);
  const [wizardBtn, setWizardBtn] = useState(0);
  const [deleteModalshow, setDeleteModalshow] = useState(false);
  const toggleCompose = () => setDeleteModalshow(!deleteModalshow);
  const [activeTab, setActiveTab] = useState("1");
  const [returnStatus9, setReturnStatus9] = useState(false);
  const [deleteType, setDeleteType] = useState('single')




  // ** Delete Modal Show/Hide
  const HideShowDeleteModel = () => {
    setDeleteModalshow(!deleteModalshow);
    if (isMultipleCompanyDelete == 0) {
      document.getElementById("btnDeleteGSTR9C").blur();
    }
  };

  const multipleDeleteFunc = (type) => {
    if (type == 'single') {
      setDeleteType('single')
    } else if (type == 'multiple') {
      setDeleteType('multiple')
    }
    HideShowDeleteModel()
  }

  const userIds =
    localStorage.getItem(globleVariable.userId) &&
      LocalFunction.getLocalValue(globleVariable.userId, true)
      ? LocalFunction.getLocalValue(globleVariable.userId, true)
      : " ";

  const G_UCParId =
    sessionStorage.getItem(globleVariable.G_UCParId) &&
    getSessionFunction.getSessionValue(globleVariable.G_UCParId, true);
  const userDatadecrypt = LocalFunction.getLocalValue(
    globleVariable.userData,
    true
  );



  let GFY =
    sessionStorage.getItem(globleVariable.G_FY) &&
    SessionFunction.getSessionValue(globleVariable.G_FY, true);
  const userData = userDatadecrypt && JSON.parse(userDatadecrypt);
  const finYearOption = userData && userData.data.rangeFiltersGSTR9;
  const filterYear = finYearOption?.filter((p) => p.value == GFY)[0] || finYearOption[0];
  const finYearId = finYearOption?.filter((p) => p.value == GFY)[0]?.value || finYearOption[0].value;
  const USerId = localStorage.getItem(globleVariable.userId) && LocalFunction.getLocalValue(globleVariable.userId, true)
  const G_GSTIN =
    sessionStorage.getItem(globleVariable.G_GSTIN) &&
    SessionFunction.getSessionValue(globleVariable.G_GSTIN, true);

  const GFM =
    sessionStorage.getItem(globleVariable.G_FM) &&
    SessionFunction.getSessionValue(globleVariable.G_FM, true);

  const isMultipleCompanyDelete = userData && userData.data.isMultipleCompanyDelete;


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
      (wizardBtn == 0 || wizardBtn == 1) && block == false && HideShowDeleteModel();
    },
    { enableOnFormTags }
  );

  const exportAllData = () => {
    setBlock(true);

    gstr9Service
      .gstr9ExportData(G_UCParId, finYearId, USerId, G_GSTIN)
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


  const onClickExportJSONAPIGstr9 = () => {
    const payLoad = {
      userClientId: G_UCParId,
      userId: LocalFunction.getLocalValue(globleVariable.userId, true),
      financialYearId: parseInt(GFY),
      loggedGSTIN: G_GSTIN,
    };
    setBlock(true);
    console.log(payLoad, "payLoadpayLoadpayLoadpayLoad");
    gstr9Service.gstr9ExportJson(payLoad)
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


  const returnFileStatus = () => {
    // sessionStorage.removeItem("gstR9AckNumber")
    const payLoad = {
      clientId: G_UCParId,
      gstinNumber: G_GSTIN,
      financialYearIdID: parseInt(GFY),
      month: parseInt(GFM),
    };
    setBlock(true);
    Gstr1DownloadService.checkFiledUserStatus(payLoad).then((res) => {
      if (
        res.status === 200 &&
        res.data.status === errorCodeConfig.APIDefaultCode.Success
      ) {
        setBlock(false);
        if (res?.data?.data?.isGSTR9Filed) {
          if (res?.data?.data?.gstR9AcknowledgementNumber) {
            sessionStorage.setItem("gstR9AckNumber", res?.data?.data?.gstR9AcknowledgementNumber);
          }
          sessionStorage.setItem("btnDisable9", '5');
          // stepper.next();
          setReturnStatus9(true)
        } else {
          sessionStorage.setItem("btnDisable9", '');
        }
      } else {
        setBlock(false);
      }
    }).catch((error) => {
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

  useEffect(() => {
    if (wizardBtn == 0) {
      returnFileStatus()
    }
  }, [wizardBtn]);

  // ** Wizard Steps
  const steps = [
    {
      id: "importData",
      title: "Import Data",
      content: (
        <>
          <DropDownGstr9Import
            stepper={stepper} block={block} setBlock={setBlock} filterYear={filterYear}
          ></DropDownGstr9Import>
        </>
      ),
    },
    {
      id: "gstr9-summary",
      title: "Summary & Invoices",
      content: (
        <Outlet
          context={{
            block,
            setBlock,
            stepper,
            wizardBtn,
            activeTab,
            setActiveTab
          }}
        />
      ),
    },
    {
      id: "save-data",
      title: "Upload Data",
      className: "text-danger myRow",
      content: (
        <Gstr9Download
          stepper={stepper}
          clientIds={G_UCParId}
          GSTIN={G_GSTIN}
          userIds={userIds}
          wizardIndex={wizardBtn}
          isGSTR9FiledStatus={returnStatus9}
          finYearId={finYearId}
        ></Gstr9Download>
      ),
    },
    {
      id: "gstr1Filed-summary",
      title: "Submit Return",
      content: (
        <SubmitForms
          userIds={userIds}
          clientIds={G_UCParId}
          GSTIN={G_GSTIN}
          stepper={stepper}
          finYear={GFY}
          finMonth={GFM}
          finYearId={finYearId}
          wizardIndex={wizardBtn}
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
              {wizardBtn == 0 ? <Breadcrumbs
                title="Purchase Summary"
                data={[{ title: "GST Returns", link: urlEndpointConfig.GSTR_All }, { title: "GSTR 9 Import Data" }]}
              /> : wizardBtn == 1 ? <Breadcrumbs
                title="Purchase Summary"
                data={[{ title: "GST Returns", link: urlEndpointConfig.GSTR_All }, { title: "GSTR 9 Summary & Invoices" }]}
              /> : wizardBtn == 2 ? <Breadcrumbs
                title="Purchase Summary"
                data={[{ title: "GST Returns", link: urlEndpointConfig.GSTR_All }, { title: "GSTR 9 Upload Data" }]}
              /> : <Breadcrumbs
                title="Purchase Summary"
                data={[{ title: "GST Returns", link: urlEndpointConfig.GSTR_All }, { title: "GSTR 9 Submit Return" }]}
              />}
            </div>
          </div>
        </div>


        <div className="content-header-right text-md-end col-md-6 col-12 d-md-block d-none">
          {
            (wizardBtn == 0 || wizardBtn == 1) && isMultipleCompanyDelete == 0 &&

            <Button
              className="btn-icon me-1"
              outline
              color="danger"
              id="btnDeleteGSTR9C"
              onClick={HideShowDeleteModel}
            >
              <Trash2 size={14} />
              <span className="align-middle ms-50">
                Delete
              </span>
              <UncontrolledTooltip placement="top" target="btnDeleteGSTR9C">
                Delete [{keysMap.DELETE_DATA}]
              </UncontrolledTooltip>
            </Button>

          }


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
            className="me-1"
            color="danger"
            id='btnExp1'
          >
            <i className="fa fa-file-excel-o"></i>&nbsp; Export
            <UncontrolledTooltip placement="top" target="btnExp1">
              Export [{keysMap.EXPORT_DATA}]
            </UncontrolledTooltip>
          </Button>

          <Button
            type="button"
            outline
            onClick={onClickExportJSONAPIGstr9}
            color="danger"
            id='exportjsonData'
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
          options={{
            linear: false,
          }}
          className="gstr1-wizard"
        />
      </div>
      {deleteModalshow && (
        <DeleteModelGSTR9
          Heading="Delete GSTR9"
          SuccessButtonText="Delete"
          show={deleteModalshow}
          toggleCompose={toggleCompose}
          G_UCParId={G_UCParId}
          userId={USerId}
          finYearId={finYearId}
          setActiveTab={setActiveTab}
          Company_GSTIN={G_GSTIN}
          deleteType={deleteType}
        ></DeleteModelGSTR9>
      )}
    </Fragment>
  );
};

export default Gstr9Purchase;
