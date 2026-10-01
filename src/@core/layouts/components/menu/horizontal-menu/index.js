// ** Horizontal Menu Components
import UserDropdown from "../../navbar/UserDropdown";
import HorizontalNavMenuItems from "./HorizontalNavMenuItems";
import NotificationDropdown from "../../navbar/NotificationDropdown";
import { globleVariable } from "../../../../../configs/globalVariable";


const HorizontalMenu = ({ menuData }) => {

 

 
   const menuDataRights = [];
   const isMultipleDownloadRight = localStorage.getItem(globleVariable.isMultipleDownload);

  menuData.forEach((route, index) => {
    if (route?.id == 'reco' && isMultipleDownloadRight == 'false') {
        const children1 = route?.children?.filter(child => child?.id !== "recopan" &&
        child?.id !== "recopan2A" );
        const updatedRoute = {...route, children: children1}
        route = updatedRoute;

    } else {
        const children1 = route?.children
        const updatedRoute = {...route, children: children1}
         route = updatedRoute;
    }
      menuDataRights.push(route);
  });



  return (
    <div id="divHeader" className="navbar-container main-menu-content px-0" >
      <ul className="nav navbar-nav float-md-start" id="main-menu-navigation">
        <HorizontalNavMenuItems submenu={false} items={menuDataRights} />
      </ul>
 
      <ul className="float-md-end mt-1 ml-3 mr-1 list-unstyled">
        <UserDropdown></UserDropdown>
      </ul>
     
    
      <ul
        style={{ marginRight: "20px" }}
        className="float-md-end mt-1 mr-2 list-unstyled"
      >
        {localStorage.getItem(globleVariable.userData) && (
          <NotificationDropdown></NotificationDropdown>
        )}
      </ul>



    </div>
  );
};

export default HorizontalMenu;
