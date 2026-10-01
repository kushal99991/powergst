import { Nav, NavItem, NavLink } from "reactstrap";
import React from "react";
import { useEffect } from "react";

const Tabs = ({ activeTab, toggleTab }) => {
  return (
    <div className="content-header row">
      <div className="content-header-left col-md-12 col-12">
        <div className="row breadcrumbs-top">
          <div className="col-12">
            <Nav pills className="nav-pill-danger mb-2">
              <NavItem>
                <NavLink
                  active={activeTab === "1"}
                  onClick={() => toggleTab("1")}
                >
                  <span className="fw-bold">
                    <b>Part I (1,2,3A,4)</b> <br />
                    <br />
                    Basic Details
                  </span>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  active={activeTab === "2"}
                  onClick={() => toggleTab("2")}
                >
                  <span className="fw-bold">
                    <b>Part II (Tables: 5-8)</b> <br />
                    <br />
                    Turnover
                  </span>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  active={activeTab === "3"}
                  onClick={() => toggleTab("3")}
                >
                  <span className="fw-bold">
                    <b>Part III (Tables: 9-11)</b> <br />
                    <br />
                    Tax paid
                  </span>
                </NavLink>
              </NavItem>

              <NavItem>
                <NavLink
                  active={activeTab === "4"}
                  onClick={() => toggleTab("4")}
                >
                  <span className="fw-bold">
                    <b>Part IV (Tables: 12-16)</b> <br />
                    <br />
                    ITC details
                  </span>
                </NavLink>
              </NavItem>

              <NavItem>
                <NavLink
                  active={activeTab === "5"}
                  onClick={() => toggleTab("5")}
                >
                  <span className="fw-bold">
                    <b>Part V (Table: 17)</b> <br />
                    <br />
                    Other Information
                  </span>
                </NavLink>
              </NavItem>
            </Nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tabs;
