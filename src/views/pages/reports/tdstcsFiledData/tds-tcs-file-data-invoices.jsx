import { useEffect, useState } from "react";
import { registerAllModules } from "handsontable/registry";
import { Row, Col, TabContent, TabPane } from "reactstrap";
import Tabs from "./tabs";
import Tab1 from "./summary-parts/Tab1";
import Tab3 from "./summary-parts/Tab3";
import Tab2 from "./summary-parts/Tab2";
import { useOutletContext, useLocation } from "react-router-dom";
import Tab4 from "./summary-parts/Tab4";

registerAllModules();

const TDSTCSFileDataInvoices = () => {
  const [block, setBlock] = useState(false);
  const [activeTab, setActiveTab] = useState("1");
  const [btnDisable1, setbtnDisable1] = useState(false);

  const { stepper, setTdsTcsSectionId, setTDSTCSData } = useOutletContext();

  const { state } = useLocation();

  useEffect(() => {
    stepper != null && stepper.to(2);
    setTdsTcsSectionId("1");
    // setTDSTCSData(false)
    let activeTabData = {
      activeTab:activeTab,
      btnDisable1: btnDisable1,
    };
    // setTDSTCSData(false, { activeTab, })
    setTDSTCSData(false,activeTabData)
    
  }, [stepper,btnDisable1,activeTab]);

  const fromYear = state?.finFromYear;
  const toYear = state?.finToYear;

  const sectionId = state?.sectionId
  
  useEffect(()=> {
    if (sectionId) {
      setTdsTcsSectionId(sectionId)
      setActiveTab(sectionId)
    } 
  }, [sectionId])

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
              // btnType={url}
            />
            <TabContent activeTab={activeTab}>
              {activeTab == 1 && (
                <TabPane tabId="1" key="1">
                  <Tab1 btnDisable1={btnDisable1} setbtnDisable1={setbtnDisable1} fromYear={fromYear} toYear={toYear}  setTDSTCSData={setTDSTCSData}/>
                </TabPane>
              )}
              {activeTab == 2 && (
                <TabPane tabId="2" key="2">
                  <Tab2 btnDisable1={btnDisable1} setbtnDisable1={setbtnDisable1} fromYear={fromYear} toYear={toYear} setTDSTCSData={setTDSTCSData} />
                </TabPane>
              )}
              {activeTab == 3 && (
                <TabPane tabId="3" key="3">
                  <Tab3 btnDisable1={btnDisable1} setbtnDisable1={setbtnDisable1} fromYear={fromYear} toYear={toYear} setTDSTCSData={setTDSTCSData} />
                </TabPane>
              )}
              {activeTab == 4 && (
                <TabPane tabId="4" key="4">
                  <Tab4 btnDisable1={btnDisable1} setbtnDisable1={setbtnDisable1} fromYear={fromYear} toYear={toYear} setTDSTCSData={setTDSTCSData} />
                </TabPane>
              )}
            </TabContent>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default TDSTCSFileDataInvoices;
