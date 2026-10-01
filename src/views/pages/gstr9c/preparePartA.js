import { globleVariable } from "@configs/globalVariable";
import { registerAllModules } from "handsontable/registry";
import React, { Fragment, useRef, useState } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import {
  Card,
  CardBody,
  Col,
  Label,
  Row,
  TabContent,
  TabPane,
} from "reactstrap";
import { SELECT_MAXSIZE } from "../../../configs/config";
import { selectThemeColors } from "../../../utility/Utils";
import Footer from "./footer";
import SessionFunction from "@configs/getSessionFunction";
import LocalFunction from "@configs/getLocalFunction";
import Tabs from "./tabs";
import Part1 from "./preparePartA/Part1";
import Part2 from "./preparePartA/Part2";
import Part3 from "./preparePartA/Part3";
import Part4 from "./preparePartA/Part4";
import Part5 from "./preparePartA/Part5";

registerAllModules();

const PreparePartA = ({
  block,
  setBlock,
  stepper,
  activeTab,
  setActiveTab,
  changeFound
}) => {
  const part1Ref = useRef(null);
  const part2Ref = useRef(null);
  const part3Ref = useRef(null);
  const part4Ref = useRef(null);
  const part5Ref = useRef(null);

  const animatedComponents = makeAnimated();

  const G_GSTIN =
    sessionStorage.getItem(globleVariable.G_GSTIN) &&
    SessionFunction.getSessionValue(globleVariable.G_GSTIN, true);
  const GFY =
    sessionStorage.getItem(globleVariable.G_FY) &&
    SessionFunction.getSessionValue(globleVariable.G_FY, true);
  const decryptedUserData = LocalFunction.getLocalValue(
    globleVariable.userData,
    true
  );

  const UserId =
    localStorage.getItem(globleVariable.userId) &&
    LocalFunction.getLocalValue(globleVariable.userId, true);
  const UserClientId =
    sessionStorage.getItem(globleVariable.G_UCParId) &&
    SessionFunction.getSessionValue(globleVariable.G_UCParId, true);
  const subscriptionId =
    localStorage.getItem(globleVariable.subscriptionId) &&
    LocalFunction.getLocalValue(globleVariable.subscriptionId, true);
  const userData = decryptedUserData && JSON.parse(decryptedUserData);
  const finYearOption = userData && userData.data.rangeFiltersGSTR9C;
  const filterYear = finYearOption?.filter((p) => p.value == GFY)[0] || finYearOption[0];
  const finYearId = finYearOption?.filter((p) => p.value == GFY)[0]?.value || finYearOption[0].value;

  const toggleTab = (tab) => {
    const successCallback = () => {
      setActiveTab(tab);
    };
    if (activeTab == 1) {
      part1Ref?.current?.checkDataIsPendingForSave(successCallback);
    } else if (activeTab == 2) {
      part2Ref?.current?.checkDataIsPendingForSave(successCallback);
    } else if (activeTab == 3) {
      part3Ref?.current?.checkDataIsPendingForSave(successCallback);
    } else if (activeTab == 4) {
      part4Ref?.current?.checkDataIsPendingForSave(successCallback);
    } else if (activeTab == 5) {
      part5Ref?.current?.checkDataIsPendingForSave(successCallback);
    } else {
      successCallback();
    }
  };

  const subToggle = (id, currentOpen, setThis) => {
    let setThisOpen = [...currentOpen];
    if (setThisOpen.includes(id)) {
      setThisOpen = setThisOpen.filter((item) => item !== id);
    } else {
      setThisOpen.push(id);
    }
    setThis(setThisOpen);
  };

  return (
    <Fragment>
      <div className="content-header-left col-md-12 col-12">
        <div className="row breadcrumbs-top mb-1">
          <div className="col-md-6"></div>
          <div className="col-md-6">
            <div className="row">
              <div className="col-md-12">
                <div className="row">
                  <div className="col-md-5"></div>
                  <Label className="form-label col-md-4 pt-half text-end">
                    Financial Year
                  </Label>
                  <Select
                    id="from"
                    placeholder="From"
                    isClearable={false}
                    theme={selectThemeColors}
                    closeMenuOnSelect={true}
                    options={[]}
                    className="basic-multi-select col-md-3 ps-0"
                    classNamePrefix="select"
                    components={animatedComponents}
                    value={filterYear}
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
          <Col md={12}>
            <Tabs
              className="mb-2"
              activeTab={activeTab}
              toggleTab={toggleTab}
            />
            <TabContent activeTab={activeTab}>
              <TabPane tabId="1" key="1">
                <div>
                  <p className="heading-font-18-weight">
                    Part - I Basic Details
                  </p>
                </div>
                {activeTab == 1 ? (
                  <Part1
                    ref={part1Ref}
                    stepper={stepper}
                    UserClientId={UserClientId}
                    finYearId={finYearId}
                    UserId={UserId}
                    toggle={subToggle}
                    setBlock={setBlock}
                    block={block}
                    subscriptionId={subscriptionId}
                    G_GSTIN={G_GSTIN}
                    changeFound={changeFound}
                  />
                ) : null}
              </TabPane>

              <TabPane tabId="2" key="2">
                <div>
                  <p className="heading-font-18-weight">
                    Part II - Reconciliation of turnover declared in audited
                    Annual Financial Statement with that in Annual Return
                    (GSTR9)
                  </p>
                </div>
                {activeTab == 2 ? (
                  <Part2
                    ref={part2Ref}
                    setBlock={setBlock}
                    block={block}
                    stepper={stepper}
                    activeTab={activeTab}
                    UserClientId={UserClientId}
                    finYearId={finYearId}
                    UserId={UserId}
                    subscriptionId={subscriptionId}
                    G_GSTIN={G_GSTIN}
                    toggle={subToggle}
                  />
                ) : null}
              </TabPane>

              <TabPane tabId="3" key="3">
                <div>
                  <p className="heading-font-18-weight">
                    Part III - Reconciliation of tax paid
                  </p>
                </div>
                {activeTab == 3 ? (
                  <Part3
                    ref={part3Ref}
                    stepper={stepper}
                    activeTab={activeTab}
                    UserClientId={UserClientId}
                    finYearId={finYearId}
                    UserId={UserId}
                    subscriptionId={subscriptionId}
                    G_GSTIN={G_GSTIN}
                    toggle={subToggle}
                    setBlock={setBlock}
                    block={block}
                  />
                ) : null}
              </TabPane>

              <TabPane tabId="4" key="4">
                <div>
                  <p className="heading-font-18-weight">
                    Part IV - Reconciliation of Input Tax Credit (ITC)
                  </p>
                </div>
                {activeTab == 4 ? (
                  <Part4
                    ref={part4Ref}
                    stepper={stepper}
                    UserClientId={UserClientId}
                    finYearId={finYearId}
                    UserId={UserId}
                    toggle={subToggle}
                    setBlock={setBlock}
                    block={block}
                    subscriptionId={subscriptionId}
                    G_GSTIN={G_GSTIN}
                  />
                ) : null}
              </TabPane>

              <TabPane tabId="5" key="5">
                <div>
                  <p className="heading-font-18-weight">
                    Part V - Auditor's recommendation on additional Liability
                    due to non-reconciliation
                  </p>
                </div>
                {activeTab == 5 ? (
                  <Part5
                    ref={part5Ref}
                    stepper={stepper}
                    activeTab={activeTab}
                    UserClientId={UserClientId}
                    finYearId={finYearId}
                    UserId={UserId}
                    subscriptionId={subscriptionId}
                    G_GSTIN={G_GSTIN}
                    toggle={subToggle}
                    setBlock={setBlock}
                    block={block}
                  />
                ) : null}
              </TabPane>
            </TabContent>
          </Col>
        </Row>
      </div>
    </Fragment>
  );
};

export default PreparePartA;
