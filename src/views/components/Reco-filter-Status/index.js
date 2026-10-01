import { Button, Nav, NavItem, NavLink } from "reactstrap";

const RecoFilterStatusComponent = ({ activeTab, toggleTab, switchReco, isBulkSelect }) => {

  return (

    // **  don't remove this code - button color all reco*/ 

    // <Nav style={
    //   isBulkSelect ? { pointerEvents: "none", opacity: "0.4" } : {}
    // } pills className="nav-pill-danger float-end">
    //   <NavItem>
    //     <a active={activeTab === "0"} onClick={() => toggleTab("0")}
    //       style={{
    //         backgroundColor: "#ffff",
    //         border: activeTab === "0" ? "2px solid black" : "1px solid #157bc2",
    //         padding: "10px 5px",
    //         marginRight: "5px",
    //         // fontWeight: activeTab === "0" ? 'fw-bolder' : 'normal',
    //         color: activeTab === 0 ? '' : 'black'
    //       }} >
    //       <span style={{ fontWeight: activeTab === "0" ? '1000' : "normal" }}>All Invoices</span>
    //     </a>
    //   </NavItem>
    //   <NavItem>
    //     <a active={activeTab === "1"} onClick={() => toggleTab("1")}
    //       style={{
    //         backgroundColor: "#6eb958",
    //         border: activeTab === "1" ? "2px solid black" : "1px solid #6eb958",
    //         padding: "10px 5px",
    //         marginRight: "5px",
    //         // fontWeight:'700' ,
    //         color: activeTab === 1 ? '' : 'black'
    //       }}>
    //       <span style={{ fontWeight: activeTab === "1" ? '1000' : "normal" }}>Matched</span>
    //     </a>
    //   </NavItem>
    //   <NavItem>
    //     <a active={activeTab === "2"} onClick={() => toggleTab("2")}
    //       style={{
    //         backgroundColor: "#e47d7d",
    //         border: activeTab === "2" ? "2px solid  black" : "1px solid #e47d7d ",
    //         padding: "10px 5px",
    //         marginRight: "5px",
    //         // fontWeight: activeTab === "2" ? 'fw-bolder' : 'normal',
    //         color: activeTab === 2 ? '' : 'black'
    //       }}>
    //       <span style={{ fontWeight: activeTab === "2" ? '1000' : "normal" }}>MisMatched</span>
    //     </a>
    //   </NavItem>
    //   <NavItem>
    //     <a active={activeTab === "3"} onClick={() => toggleTab("3")}
    //       style={{
    //         backgroundColor: "#b3e8a4",
    //         border: activeTab === "3" ? "2px solid black" : "1px solid #b3e8a4",
    //         padding: "10px 5px",
    //         marginRight: "5px",
    //         // fontWeight: activeTab === "3" ? 'fw-bolder' : 'normal',
    //         color: activeTab === 3 ? '' : 'black'
    //       }}>
    //       <span style={{ fontWeight: activeTab === "3" ? '1000' : "normal" }}>Match With Auto.</span>
    //     </a>
    //   </NavItem>
    //   <NavItem>
    //     <a active={activeTab === "4"} onClick={() => toggleTab("4")}
    //       style={{
    //         backgroundColor: "#f5f5a0",
    //         border: activeTab === "4" ? "2px solid black" :  "1px solid #f5f5a0", padding: "10px 5px",
    //         marginRight: "5px",
    //         // fontWeight: activeTab === '4' ? 'fw-bolder' : 'normal',
    //         color: activeTab === 4 ? '' : 'black'
    //       }}>
    //       <span style={{ fontWeight: activeTab === "4" ? '1000' : "normal" }}>
    //         {switchReco === "einvoice" ? "Not In GSTR1" : "Not In A/C"}
    //       </span>

    //     </a>
    //   </NavItem>
    //   <NavItem>
    //     <a active={activeTab === "5"} onClick={() => toggleTab("5")}
    //       style={{
    //         backgroundColor: "#7cb7e2",
    //         border: activeTab === "5" ? "2px solid black" : "1px solid #7cb7e2",
    //         padding: "10px 5px",
    //         marginRight: "5px",
    //         // fontWeight: activeTab === "5" ? 'fw-bolder' : 'normal',
    //         color: activeTab === 5 ? '' : 'black'
    //       }}>
    //       <span style={{ fontWeight: activeTab === "5" ? '1000' : "normal" }}>
    //         {switchReco === "2A" ? "Not In 2A" : switchReco === "einvoice" ? "Not In E-Inv." : "Not In 2B"}
    //       </span>
    //     </a>
    //   </NavItem>
    // </Nav>
    <Nav style={
      isBulkSelect ? { pointerEvents: "none", opacity: "0.4" } : {}
    } pills className="nav-pill-danger float-end">
      <NavItem>
        <NavLink active={activeTab === "0"} onClick={() => toggleTab("0")} >
          <span className="fw-bold">All Invoices</span>
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink active={activeTab === "1"} onClick={() => toggleTab("1")}>
          <span className="fw-bold">Matched</span>
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink active={activeTab === "2"} onClick={() => toggleTab("2")}>
          <span className="fw-bold">MisMatched</span>
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink active={activeTab === "3"} onClick={() => toggleTab("3")}>
          <span className="fw-bold">Match With Auto.</span>
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink active={activeTab === "4"} onClick={() => toggleTab("4")}>
          <span className="fw-bold">
            {switchReco === "einvoice" ? "Not In GSTR1" : "Not In A/C"}
          </span>

        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink active={activeTab === "5"} onClick={() => toggleTab("5")}>
          <span className="fw-bold">
            {switchReco === "2A" ? "Not In 2A" : switchReco === "einvoice" ? "Not In E-Inv." : "Not In 2B"}
          </span>
        </NavLink>
      </NavItem>
    </Nav>
  );
};

export default RecoFilterStatusComponent
