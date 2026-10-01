// ** Reactstrap Imports
import { Button, Nav, NavItem, NavLink } from "reactstrap";
import React from "react";
// ** Icons Imports
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "react-feather";

const Tabs = ({ activeTab, toggleTab }) => {
  const navigate = useNavigate();
  const backPage = () => {
    navigate("/gst-returns/tdstcs", { state: { stayOn: 2 } });
  };

  return (
    <div className="content-header row">
      <div className="content-header-left col-md-9 col-12">
        <div className="row breadcrumbs-top">
          <div className="col-12">
            <Nav pills className="nav-pill-danger mb-2">
              <NavItem>
                <NavLink
                  active={activeTab === "1"}
                  onClick={() => toggleTab("1")}
                >
                  <span className="fw-bold">TDS credit received</span>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  active={activeTab === "2"}
                  onClick={() => toggleTab("2")}
                >
                  <span className="fw-bold">
                    TDS credit received Amendments
                  </span>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  active={activeTab === "3"}
                  onClick={() => toggleTab("3")}
                >
                  <span className="fw-bold">TCS credit received</span>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  active={activeTab === "4"}
                  onClick={() => toggleTab("4")}
                >
                  <span className="fw-bold">
                    TCS credit received Amendments
                  </span>
                </NavLink>
              </NavItem>
            </Nav>
          </div>
        </div>
      </div>
      <div className="col-md-3  px-0">
        <Button
          type="button"
          className="me-1 btn-sm float-end"
          outline
          id="back"
          onClick={() => backPage()}
          color="danger"
        >
          <ChevronLeft size={18} /> Back To Summary
        </Button>
      </div>
    </div>
  );
};

export default Tabs;
