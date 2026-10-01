// ** Reactstrap Imports
import { TabContent, TabPane, Nav, NavItem, NavLink } from "reactstrap";

// ** Session get
import { globleVariable } from "../../../configs/globalVariable";

const ProfileVerticalTabs = ({ active, toggle }) => {
  const isCompany = sessionStorage.getItem(globleVariable.isCompany);

  return (
    <Nav tabs fill className="nav-left w-100">
    
      <NavItem className={active == "1" ? "active border-dark" : "border-dark"}>
        <NavLink
          className="font-size-meduim"
          onClick={() => {
            toggle("1");
          }}
        >
          User Profile
        </NavLink>
      </NavItem>
      <NavItem className={active == "3" ? "active border-dark" : "border-dark"}>
        <NavLink
          className="font-size-meduim"
          onClick={() => {
            toggle("3");
          }}
        >
          Manage User
        </NavLink>
      </NavItem>
      <NavItem className={active == "2" ? "active border-dark" : "border-dark"}>
        <NavLink
          className="font-size-meduim"
          onClick={() => {
            toggle("2");
          }}
        >
          Add/Edit User
        </NavLink>
      </NavItem>
      

      <NavItem
        className={active == "4" ? "active border-dark" : "border-dark"}
      >
        <NavLink
          className="font-size-meduim"
          onClick={() => {
            toggle("4");
          }}
        >
          SMTP Setting
        </NavLink>
      </NavItem>

      {isCompany == true || isCompany == "true" ? (
        <>

          <NavItem
            className={active == "5" ? "active border-dark" : "border-dark"}
          >
            <NavLink
              className="font-size-meduim"
              onClick={() => {
                toggle("5");
              }}
            >
              Vendor Master
            </NavLink>
          </NavItem>
        </>
      ) : (
        ""
      )}


      <NavItem
        className={active == "6" ? "active border-dark" : "border-dark"}
      >
        <NavLink
          className="font-size-meduim"
          onClick={() => {
            toggle("6");
          }}
        >
          Import User Excel
        </NavLink>
      </NavItem>
    </Nav>
  );
};
export default ProfileVerticalTabs;
