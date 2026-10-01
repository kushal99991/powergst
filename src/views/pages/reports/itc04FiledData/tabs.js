// ** Reactstrap Imports
import { Button, Nav, NavItem, NavLink } from "reactstrap";
import React from "react";
// ** Icons Imports
import { useEffect } from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "react-feather";
import { useNavigate } from "react-router-dom";

const Tabs = ({ activeTab, toggleTab, btnType }) => {
  useEffect(() => {
    if (btnType == 1) {
      toggleTab("1");
    } else if (btnType == 2) {
      toggleTab("2");
    } else if (btnType == 3) {
      toggleTab("3");
    } else if (btnType == 4) {
      toggleTab("4");
    } else if (btnType == 5) {
      toggleTab("5");
    } else if (btnType == 6) {
      toggleTab("6");
    } else {
    }
  }, []);

  const navigate = useNavigate()
  const backPage = () => {
    navigate("/reports/itc04-filed-data?itc04=1");
  }

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
                  <span className="fw-bold">Table 4</span>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  active={activeTab === "2"}
                  onClick={() => toggleTab("2")}
                >
                  <span className="fw-bold">Table 5A</span>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  active={activeTab === "3"}
                  onClick={() => toggleTab("3")}
                >
                  <span className="fw-bold">Table 5B</span>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  active={activeTab === "4"}
                  onClick={() => toggleTab("4")}
                >
                  <span className="fw-bold">Table 5C</span>
                </NavLink>
              </NavItem>
              {/* <NavItem>
                <NavLink
                  active={activeTab === "5"}
                  onClick={() => toggleTab("5")}
                >
                  <span className="fw-bold">Distribution of ITC</span>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  active={activeTab === "6"}
                  onClick={() => toggleTab("6")}
                >
                  <span className="fw-bold">Amend of Distribution of ITC</span>
                </NavLink>
              </NavItem> */}
            </Nav>

          </div>
        </div>
      </div>
      <div className="col-md-3  px-0">
        {/* <a href="/reports/itc04-filed-data?itc04=1" className="float-end text-danger"> <ChevronLeft size={18} />Back To Summary</a> */}
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
