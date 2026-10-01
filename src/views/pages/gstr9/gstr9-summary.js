import { Fragment, useRef, useCallback } from "react";
import {
  Col, Label, Row, TabContent, TabPane, Card, CardBody,
} from "reactstrap";
import { selectThemeColors } from "@utils";
import Select from "react-select";
import { useState } from "react";
import { SELECT_MAXSIZE } from "../../../configs/config";
import makeAnimated from "react-select/animated";
import { useNavigate, useOutletContext } from "react-router-dom";
import { registerAllModules } from "handsontable/registry";
import { globleVariable } from "../../../configs/globalVariable";
import LocalFunction from "../../../configs/getLocalFunction";
import SessionFunction from "../../../configs/getSessionFunction";
import Tabs from "./tabs";
import Part1 from "./summary-invoice-part/Part1";
import Part2 from "./summary-invoice-part/Part2";
import Part3 from "./summary-invoice-part/Part3";
import Part5 from "./summary-invoice-part/Part5";
import Part6 from "./summary-invoice-part/Part6";
import Part4 from "./summary-invoice-part/Part4";

registerAllModules();


const Gstr9Summary = () => {

  const animatedComponents = makeAnimated();
  const [panDataFrom, setPanDataFrom] = useState([]);
  const [open, setOpen] = useState("1");
  const [block, setBlock] = useState(false);

  const part2Ref = useRef();
  const part3Ref = useRef();
  const part4Ref = useRef();
  const part5Ref = useRef();
  const part6Ref = useRef();
  // const { stepper } = props;

  const { stepper, wizardBtn, activeTab, setActiveTab } =
    useOutletContext();

  const toggle = (id) => {
    open === id ? setOpen() : setOpen(id);
  };

  const G_GSTIN =
    sessionStorage.getItem(globleVariable.G_GSTIN) &&
    SessionFunction.getSessionValue(globleVariable.G_GSTIN, true);
  let GFY =
    sessionStorage.getItem(globleVariable.G_FY) &&
    SessionFunction.getSessionValue(globleVariable.G_FY, true);
  const userDatadecrypt = LocalFunction.getLocalValue(
    globleVariable.userData,
    true
  );

  const USerId = localStorage.getItem(globleVariable.userId) && LocalFunction.getLocalValue(globleVariable.userId, true)
  const G_UCParId =
    sessionStorage.getItem(globleVariable.G_UCParId) &&
    SessionFunction.getSessionValue(globleVariable.G_UCParId, true);
  const subscriptionId = localStorage.getItem(globleVariable.subscriptionId) && LocalFunction.getLocalValue(globleVariable.subscriptionId, true);
  const userData = userDatadecrypt && JSON.parse(userDatadecrypt);
  const finYearOption = userData && userData.data.rangeFiltersGSTR9;

  const filterYear = finYearOption?.filter((p) => p.value == GFY)[0] || finYearOption[0];
  const finYearId = finYearOption?.filter((p) => p.value == GFY)[0]?.value || finYearOption[0].value;

  const toggleTab = (tab) => {
    console.log("tab click", tab);

    const successCallback = () => {
      setActiveTab(activeTab)
    }

    if (activeTab == 4) {
      part4Ref.current.checkDataIsPendingForSave(successCallback)
    } else if (activeTab == 5) {
      part5Ref.current.checkDataIsPendingForSave(successCallback)
    } else if (activeTab == 6) {
      part6Ref.current.checkDataIsPendingForSave(successCallback)
    }
    else if (activeTab == 2) {
      part2Ref.current.checkDataIsPendingForSave(successCallback)
    }
    else if (activeTab == 3) {
      part3Ref.current.checkDataIsPendingForSave(successCallback)
    }
    else {
      // put other code here
      successCallback()
    }

  };


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
                  <Label className="form-label col-md-4 pt-half text-end">
                    Financial Year
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
            <TabContent activeTab={activeTab} >
              {/* Part1 Basic Detail  */}
              <TabPane tabId="1" key="1">
                <Card>
                  <CardBody className="CardBody p-0">
                    <div>
                      <p className="heading-font-18-weight">Part - I Basic Details</p>
                    </div>
                    <Row>
                      <Col sm="12">
                        <Part1 G_GSTIN={G_GSTIN} stepper={stepper} />
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </TabPane>

              {/* Part-2 Table4-5  */}
              <TabPane tabId="2" key="2">
                <div>
                  <p className="heading-font-18-weight">Part II - Details of Outward and Inward supplies declared during the financial year</p>
                </div>
                <Part2 ref={part2Ref} setBlock={setBlock} block={block} stepper={stepper} activeTab={activeTab} G_UCParId={G_UCParId} finYearId={finYearId} USerId={USerId} subscriptionId={subscriptionId} G_GSTIN={G_GSTIN} />
              </TabPane>

              {/* Part-3  Table-6-7-8*/}
              <TabPane tabId="3" key="3" >
                <div>
                  <p className="heading-font-18-weight">Part III - Details of ITC as declared in returns filed during the financial year</p>
                </div>
                <Part3 ref={part3Ref} stepper={stepper} activeTab={activeTab} G_UCParId={G_UCParId} finYearId={finYearId} USerId={USerId} subscriptionId={subscriptionId} G_GSTIN={G_GSTIN} />
              </TabPane>

              {/* Part4 Table-9  */}
              <TabPane tabId="4" key="4">
                <div>
                  <p className="heading-font-18-weight">Part IV</p>
                </div>
                {activeTab == 4 ?
                  <Part4 ref={part4Ref} stepper={stepper} open={open} toggle={toggle} G_UCParId={G_UCParId} finYearId={finYearId} USerId={USerId} />
                  : null}
              </TabPane>

              {/* Part5 Table-10-14  */}

              <TabPane tabId="5" key="5">
                <div>
                  <p className="heading-font-18-weight">Part V - For FY 2022-23 Particulars of the transactions for the previous FY declared in returns of April to March of current FY or upto date of filing of annual return of previous FY whichever is earlier</p>
                </div>
                <Part5 ref={part5Ref} stepper={stepper} activeTab={activeTab} G_UCParId={G_UCParId} finYearId={finYearId} USerId={USerId} subscriptionId={subscriptionId} G_GSTIN={G_GSTIN} />
              </TabPane>

              {/**  Part6 Table-15 To 19  **/}
              <TabPane tabId="6" key="6">
                <div>
                  <p className="heading-font-18-weight">Part VI - Other Information</p>
                </div>
                <Part6 ref={part6Ref} stepper={stepper} activeTab={activeTab} G_UCParId={G_UCParId} finYearId={finYearId} USerId={USerId} subscriptionId={subscriptionId} G_GSTIN={G_GSTIN} />
              </TabPane>

            </TabContent>
          </Col>
        </Row>
      </div>


    </Fragment>
  );
};

export default Gstr9Summary;
