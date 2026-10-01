import { useEffect, useState } from "react";
import { registerAllModules } from "handsontable/registry";
import { Row, Col, TabContent, TabPane } from "reactstrap";
import Tabs from "./tabs";
import Tab1 from "./invoice-parts/Tab1";
import Tab3 from "./invoice-parts/Tab3";
import Tab2 from "./invoice-parts/Tab2";
import { useOutletContext, useLocation } from "react-router-dom";
import Tab4 from "./invoice-parts/Tab4";

registerAllModules();

const TDSTCSDataInvoices = () => {
  const [activeTab, setActiveTab] = useState("1");

  const {
    stepper,
    setTdsTcsSectionId,
    setTDSTCSData,
    block,
    setFromYear,
    setToYear,
  } = useOutletContext();

  const { state } = useLocation();

  const sectionId = state?.sectionId;
  const finFromYear = state?.finFromYear;
  const finToYear = state?.finToYear;

  useEffect(() => {
    if (finFromYear) setFromYear(finFromYear);
    if (finToYear) setToYear(finToYear);
  }, [finFromYear, finToYear]);

  useEffect(() => {
    stepper != null && stepper.to(2);
  }, [stepper]);

  const fromYear = finFromYear;
  const toYear = finToYear;

  useEffect(() => {
    if (sectionId) {
      setTdsTcsSectionId(sectionId);
      setActiveTab(sectionId);
    }
  }, [sectionId]);

  const toggleTab = (tab) => {
    setActiveTab(tab);
    setTdsTcsSectionId(tab);
  };

  return (
    <div>
      {block && <div className="loading1">Loading&#8230;</div>}

      <div>
        <Row>
          <Col xs={12}>
            <Tabs
              className="mb-2"
              activeTab={activeTab}
              toggleTab={toggleTab}
            />
            <TabContent activeTab={activeTab}>
              {activeTab == 1 && (
                <TabPane tabId="1" key="1">
                  <Tab1
                    fromYear={fromYear}
                    toYear={toYear}
                    setTDSTCSData={setTDSTCSData}
                    stepper={stepper}
                  />
                </TabPane>
              )}
              {activeTab == 2 && (
                <TabPane tabId="2" key="2">
                  <Tab2
                    fromYear={fromYear}
                    toYear={toYear}
                    setTDSTCSData={setTDSTCSData}
                    stepper={stepper}
                  />
                </TabPane>
              )}
              {activeTab == 3 && (
                <TabPane tabId="3" key="3">
                  <Tab3
                    fromYear={fromYear}
                    toYear={toYear}
                    setTDSTCSData={setTDSTCSData}
                    stepper={stepper}
                  />
                </TabPane>
              )}
              {activeTab == 4 && (
                <TabPane tabId="4" key="4">
                  <Tab4
                    fromYear={fromYear}
                    toYear={toYear}
                    setTDSTCSData={setTDSTCSData}
                    stepper={stepper}
                  />
                </TabPane>
              )}
            </TabContent>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default TDSTCSDataInvoices;
