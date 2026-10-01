import errorCodeConfig from "@configs/apiErrorCodeConfig";
import { DROPDOWN_PLACEHOLDER } from "@configs/config";
import LocalFunction from "@configs/getLocalFunction";
import SessionFunction from "@configs/getSessionFunction";
import { globleVariable } from "@configs/globalVariable";
import { selectThemeColors } from "@utils";
import React, { forwardRef, Fragment, useEffect, useImperativeHandle, useState } from "react";
import { Search, X } from "react-feather";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import {
  Button,
  Card,
  CardBody,
  Col,
  Label,
  Modal,
  ModalBody,
  Row,
  TabContent,
  TabPane,
} from "reactstrap";
import Swal from "sweetalert2";
import { downloadURL } from "../../../../helper/downloadUrl";
import gstr9FiledService from "../../../../services/gstr9Filed/gstr9FiledService";
import { tokenExpiresRedirect } from "../../../../utility/Utils";
import VerificationModal from "../../../../views/pages/verification-otp/index";
import { getGSTR9Summary } from "../../../apps/user/store";
import Tabs from "../../gstr9/tabs";
import Part1 from "./summery-parts/Part1";
import Part2 from "./summery-parts/Part2";
import Part3 from "./summery-parts/Part3";
import Part4 from "./summery-parts/Part4";
import Part5 from "./summery-parts/Part5";
import Part6 from "./summery-parts/Part6";

const GSTR9FiledData = forwardRef(
  (
    { block, setBlock, downloadModal, setDownloadModal, downloadInProgress, setDownloadInProgress,typeOfDownload },
    ref,
  ) => {
    const animatedComponents = makeAnimated();

    const [composeOpen, setComposeOpen] = useState(false);
    const toggleCompose = () => setComposeOpen(!composeOpen);

    const clientIds =
      sessionStorage.getItem(globleVariable.G_UCParId) &&
      SessionFunction.getSessionValue(globleVariable.G_UCParId, true);
    const GGSTIN =
      sessionStorage.getItem(globleVariable.G_GSTIN) &&
      SessionFunction.getSessionValue(globleVariable.G_GSTIN, true);
    const subId =
      localStorage.getItem(globleVariable.subscriptionId) &&
      LocalFunction.getLocalValue(globleVariable.subscriptionId, true);

    const dispatch = useDispatch();

    const [activeTab, setActiveTab] = useState("1");
    const [selectedFromYear, setSelectedFromYear] = useState(null);
    const [selectedToYear, setSelectedToYear] = useState(null);
    const [selectedDownloadYear, setSelectedDownloadYear] = useState(null);
    const [msgDisplay, setMsgDisplay] = useState(null);

    const G_GSTIN =
      sessionStorage.getItem(globleVariable.G_GSTIN) &&
      SessionFunction.getSessionValue(globleVariable.G_GSTIN, true);
    const G_UCParId =
      sessionStorage.getItem(globleVariable.G_UCParId) &&
      SessionFunction.getSessionValue(globleVariable.G_UCParId, true);
    const userIds =
      localStorage.getItem(globleVariable.userId) &&
      LocalFunction.getLocalValue(globleVariable.userId, true);
      const token = LocalFunction.getLocalValue(globleVariable.tokenKey , true )
    const GFY =
      sessionStorage.getItem(globleVariable.G_FY) &&
      SessionFunction.getSessionValue(globleVariable.G_FY, true);

    const toggleTab = (tab) => {
      setActiveTab(tab);
    };

    // get list of year option
    const decryptedUserData = LocalFunction.getLocalValue(globleVariable.userData, true);
    const userData = decryptedUserData && JSON.parse(decryptedUserData);
    const yearOptions = userData && userData.data.rangeFiltersGSTR9;

    const store = useSelector((state) => state?.users?.GSTR9Summary);

    const data = store?.[0];

    const getData = (fromYear, toYear) => {
      const payload = {
        toYear,
        fromYear,
        clientId: clientIds,
        subscriptionId: subId,
        gstNumber: GGSTIN,
        setLoader: setBlock,
        setDownloadInProgress,
      };

      dispatch(getGSTR9Summary(payload));
    };

    const setDefaultData = () => {
      if (yearOptions) {
        
        let defaultYear
        if(yearOptions?.filter((item) => item.value == GFY)[0] == undefined){
           defaultYear = yearOptions[0];
        }else{
           defaultYear = yearOptions?.filter((item) => item.value == GFY)[0];
         }
         
        setSelectedFromYear(defaultYear);
        setSelectedDownloadYear(defaultYear);
        setSelectedToYear(defaultYear);

        getData(defaultYear?.value, defaultYear?.value);
      }
    };

    useEffect(() => {
      setDefaultData();
    }, []);

    const onClickSearch = () => {
      getData(selectedFromYear.value, selectedToYear.value);
    };

    const onSelectFromYear = (value) => {
      if (selectedToYear && value.value > selectedToYear?.value) {
        setSelectedToYear(value);
      }

      setSelectedFromYear(value);
    };

    const onSelectToYear = (value) => {
      setSelectedToYear(value);
    };

    const subToggle = (id, setOpenState, currentOpen) => {
      let setThisOpen = [...currentOpen];
      if (setThisOpen.includes(id)) {
        setThisOpen = setThisOpen.filter((item) => item !== id);
      } else {
        setThisOpen.push(id);
      }
      setOpenState(setThisOpen);
    };

    const singleYearDownload = () => {
      if (downloadInProgress) return;

      setBlock(true);
      const singleYearDownload = typeOfDownload == 'withOTP' ?  gstr9FiledService.singleYearDownload :  gstr9FiledService.singleYearDownloadWithOutOtp
      singleYearDownload(G_UCParId, userIds, selectedDownloadYear.value, subId, GGSTIN)
        .then((res) => {
          setBlock(false);
          if (res.data.status === errorCodeConfig.APIDefaultCode.GovtOTPExpire) {
            closeModal();
            setMsgDisplay(res?.data?.errorMessage);
            setBlock(false);
            setComposeOpen(true);
          } else {
            if (
              res?.status == 200 &&
              res?.data?.status === errorCodeConfig.APIDefaultCode.Success
            ) {
              setDownloadModal(false);

              setDownloadInProgress(true);

              setSelectedFromYear(selectedDownloadYear);
              setSelectedToYear(selectedDownloadYear);

              getData(selectedDownloadYear.value, selectedDownloadYear.value);

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

    const closeModal = () => {
      setDownloadModal(!downloadModal);
    };

    useImperativeHandle(ref, () => ({
      onExportData() {
        setBlock(true);
        gstr9FiledService
          .getSavedExportFileData(
            G_UCParId,
            userIds,
            selectedFromYear.value,
            selectedToYear.value,
            subId,
            GGSTIN,
            token
          )
          .then((res) => {
            if (res.status == 200 && res?.data?.status == errorCodeConfig.APIDefaultCode.Success) {
              downloadURL(res.data.data);
            } else if (res?.status == 401) {
              tokenExpiresRedirect();
            } else {
              // loadFunction(false);
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
                confirmButton: "btn btn-danger",
              },
              buttonsStyling: false,
            });
          })
          .finally(() => {
            setBlock(false);
          });
      },
    }));

    return (
      <Fragment>
        {block && <div className="loading1">Loading&#8230;</div>}

        <div className="content-header-left col-md-12 col-12">
          <div className="row breadcrumbs-top mb-1">
            <div className="col-md-6"></div>
            <div className="col-md-6">
              <div className="row">
                <div className="col-md-2"></div>
                <div className="col-md-4">
                  <div className="row">
                    <Label className="form-label col-md-2 pt-half ps-0">From</Label>
                    <Select
                      id="from"
                      isClearable={false}
                      theme={selectThemeColors}
                      closeMenuOnSelect={true}
                      components={animatedComponents}
                      options={yearOptions}
                      className="basic-multi-select col-md-10"
                      classNamePrefix="select"
                      onChange={onSelectFromYear}
                      value={selectedFromYear}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="row">
                    <Label className="form-label col-md-2 pt-half">To</Label>
                    <Select
                      id="to"
                      isClearable={false}
                      theme={selectThemeColors}
                      closeMenuOnSelect={true}
                      components={animatedComponents}
                      options={
                        selectedFromYear?.value
                          ? yearOptions.filter((year) => year.value >= selectedFromYear.value)
                          : yearOptions
                      }
                      className="basic-multi-select col-md-10"
                      classNamePrefix="select"
                      onChange={onSelectToYear}
                      value={selectedToYear}
                    />
                  </div>
                </div>
                <div className="col-md-2 text-md-end  ps-0">
                  <Button
                    onClick={onClickSearch}
                    className="btn-icon btn-round"
                    color="danger"
                    outline
                  >
                    <Search size={12} />
                    &nbsp;Search
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 ">
          <Row className="mb-2">
            <Col md={12}>
              <Tabs className="mb-2" activeTab={activeTab} toggleTab={toggleTab} />
              <TabContent activeTab={activeTab}>
                <TabPane tabId="1" key="1">
                  <Card>
                    <CardBody className="CardBody p-0">
                      <div>
                        <p className="heading-font-18-weight">Part - I Basic Details</p>
                      </div>
                      <Row>
                        <Col sm="12">
                          <Part1 G_GSTIN={G_GSTIN} data={data} toggle={subToggle} />
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </TabPane>

                {/* Part-2 Table4-5  */}
                <TabPane tabId="2" key="2">
                  <div>
                    <p className="heading-font-18-weight">
                      Part II - Details of Outward and Inward supplies declared during the financial
                      year
                    </p>
                  </div>
                  <Part2 data={data} toggle={subToggle} />
                </TabPane>

                {/* Part-3  Table-6-7-8*/}
                <TabPane tabId="3" key="3">
                  <div>
                    <p className="heading-font-18-weight">
                      Part III - Details of ITC as declared in returns filed during the financial
                      year
                    </p>
                  </div>
                  <Part3 data={data} toggle={subToggle} />
                </TabPane>

                {/* Part4 Table-9  */}
                <TabPane tabId="4" key="4">
                  <div>
                    <p className="heading-font-18-weight">Part IV</p>
                  </div>
                  {activeTab == 4 ? <Part4 data={data} toggle={subToggle} /> : null}
                </TabPane>

                {/* Part5 Table-10-14  */}

                <TabPane tabId="5" key="5">
                  <div>
                    <p className="heading-font-18-weight">
                      Part V - For FY 2022-23 Particulars of the transactions for the previous FY
                      declared in returns of April to March of current FY or upto date of filing of
                      annual return of previous FY whichever is earlier
                    </p>
                  </div>
                  <Part5 data={data} toggle={subToggle} />
                </TabPane>

                {/**  Part6 Table-15 To 19  **/}
                <TabPane tabId="6" key="6">
                  <div>
                    <p className="heading-font-18-weight">Part VI - Other Information</p>
                  </div>
                  <Part6 data={data} toggle={subToggle} />
                </TabPane>
              </TabContent>
            </Col>
          </Row>
        </div>

        <Modal
          backdrop="static"
          isOpen={downloadModal}
          toggle={closeModal}
          className="modal-dialog-centered  modal-sm"
        >
          <div className="modal-header">
            <h2 className="modal-title w-100 text-center">Download Data</h2>
            <div className="modal-actions">
              <a onClick={closeModal} className="text-body">
                <X size={14} />
              </a>
            </div>
          </div>

          <hr
          //  style={{ margin: "0px" }}
          ></hr>
          <ModalBody className="px-sm-2 mx-30 pb-2">
            <Row tag="form" className="gy-1 pt-75">
              <Col xs={3}></Col>
              <Col xs={6}>
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
                  options={yearOptions}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  value={selectedDownloadYear}
                  onChange={(value) => setSelectedDownloadYear(value)}
                />
              </Col>

              <Col xs={12} className="text-center pt-50">
                <Button className="me-1" color="danger" onClick={singleYearDownload} outline>
                  Continue
                </Button>
                <Button type="reset" color="secondary" outline onClick={closeModal}>
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
          otpGSTIN={GGSTIN}
        ></VerificationModal>
      </Fragment>
    );
  },
);

export default GSTR9FiledData;
