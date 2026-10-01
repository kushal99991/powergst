import Breadcrumbs from "@components/breadcrumbs";
import Wizard from "@components/wizard";
import React, { Fragment, useEffect, useRef, useState } from "react";
import {ChevronDown, DownloadCloud } from "react-feather";
import { useHotkeys } from "react-hotkeys-hook";
import { useLocation } from "react-router-dom";
import { Button, UncontrolledTooltip,DropdownToggle, DropdownMenu, DropdownItem,UncontrolledButtonDropdown } from "reactstrap";
import { keysMap, enableOnFormTags } from "../../../../configs/config";
import { urlEndpointConfig } from "../../../../configs/urlEndpoint";
import GSTR9CDownload from "./gstr9c-download";
import GSTR9CFiledData from "./gstr9c-filed-data";

const GSTR9CFiled = () => {
  const wizardRef = useRef(null);
  const downloadComponentRef = useRef(null);

  const location = useLocation();
  const filedComponentRef = useRef(null);
  const queryParams = new URLSearchParams(location.search);

  const [stepper, setStepper] = useState(null);
  const [wizardBtn, setWizardBtn] = useState(0);
  const [block, setBlock] = useState(false);
  const [downloadModal, setDownloadModal] = useState(0);
  const [downloadInProgress, setDownloadInProgress] = useState(false);
  const [typeOfDownload,setTypeOfDonwload] = useState("");
  const [activeTab, setactiveTab] = useState();

  const childFunc = useRef(null);

  const wizardData = queryParams.get("gstr9c");

  useHotkeys(
    keysMap.DOWNLOAD_GOVT_DATA,
    () => {
      block == false && wizardBtn == 1 && !downloadInProgress && setDownloadModal(true);
    },
    { enableOnFormTags },
  );

  useHotkeys(
    keysMap.EXPORT_ALL_DATA,
    () => {
      !block && onExportClick();
    },
    { enableOnFormTags },
  );

  useEffect(() => {
    wizardData && stepper !== null && stepper.to(Number(wizardData) + 1);
  }, [stepper]);

  wizardRef?.current?.addEventListener("shown.bs-stepper", function (event) {
    setWizardBtn(event?.detail?.indexStep);
  });

  const onExportClick = () => {
    filedComponentRef?.current?.onExportData();
  };

  const steps = [
    {
      id: "gstr9c-downloads",
      title: "GSTR 9C Downloads",
      content: <GSTR9CDownload downloadComponentRef={downloadComponentRef} childFunc={childFunc} />,
      active: wizardData != 1,
    },
    {
      id: "gstr9c-summary",
      title: "Summary and Invoices Details",
      content: (
        <GSTR9CFiledData
          block={block}
          setBlock={setBlock}
          downloadModal={downloadModal}
          setDownloadModal={setDownloadModal}
          setDownloadInProgress={setDownloadInProgress}
          downloadInProgress={downloadInProgress}
          ref={filedComponentRef}
          typeOfDownload = {typeOfDownload} 

        />
      ),
      active: wizardData == 1,
    },
  ];

  return (
    <Fragment>
      {block && <div className="loading1">Loading&#8230;</div>}

      <div className="content-header row py-1">
        <div className="content-header-left col-md-6 col-12">
          <div className="row breadcrumbs-top">
            <div className="col-12">
              <Breadcrumbs
                title="Gstr9c filed data"
                data={[
                  {title: "Reports", link: urlEndpointConfig.REPORT_ALL },
                  { title: "GSTR 9C Summary"},
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
            {/* <Button
              type="button"
              className="me-1"
              outline
              onClick={() => setDownloadModal(true)}
              id="downloadBtn"
              color="danger"
            >
              <DownloadCloud size={14} />
              <span className="align-middle ms-50">Download </span>
            </Button>
            <UncontrolledTooltip placement="top" target="downloadBtn">
              Download [{keysMap.DOWNLOAD_GOVT_DATA}]
            </UncontrolledTooltip> */}
            <UncontrolledButtonDropdown disabled={activeTab?.btnDisable1}>
                <DropdownToggle color='danger' outline caret className="me-1"  id="downloaddata">
                  <DownloadCloud size={14} />
                  <span className="align-middle ms-50">
                    Download
                  </span>  &nbsp;
                  <ChevronDown size={14} />
                </DropdownToggle>
                <DropdownMenu className="dropdown-reconcilation-purchase-sumary">
                  <DropdownItem onClick={() => {setDownloadModal(true),setTypeOfDonwload("withOTP")}} tag='a' >With OTP    </DropdownItem>
                  <DropdownItem onClick={() => {setDownloadModal(true),setTypeOfDonwload("withOutOTP")}} tag='a'>Without OTP  </DropdownItem>

                </DropdownMenu>
              </UncontrolledButtonDropdown>
            <Button
              type="button"
              className="me-1"
              outline
              id="exportData"
              onClick={() => onExportClick()}
              color="danger"
            >
              <i className="fa fa-file-excel-o"></i>
              <span className="align-middle ms-50">Export </span>
            </Button>
            <UncontrolledTooltip placement="top" target="exportData">
              Export [{keysMap.EXPORT_ALL_DATA} ]
            </UncontrolledTooltip>
          </div>
        )}
      </div>

      <div className="horizontal-wizard">
        <Wizard
          instance={(el) => {
            setStepper(el);
          }}
          ref={wizardRef}
          steps={steps}
          options={{
            linear: false,
          }}
          className="gstr1-wizard"
        />
      </div>
    </Fragment>
  );
};

export default GSTR9CFiled;
