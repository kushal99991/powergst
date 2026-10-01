import { ListGroup, ListGroupItem, Badge, Button } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { Fragment, useEffect, useState } from "react";
import menuOpenPermission from "@helper/menuOpenPermission";
import Swal from "sweetalert2";
import { urlAccessMessage } from "@configs/config";
import { globleVariable } from "@configs/globalVariable";

const GSTReturnDetail = ({ displayData, displayTitle, stepper, wizardBtn, type }) => {

  const [dataList, setDataList] = useState([])
  const currentURL = window.location.pathname;
  const isMultiDownloadRight = localStorage.getItem(
    globleVariable.isMultipleDownload
  );

  // if (window.location.pathname == "/reports") {
  //   type = "reports";
  // } else if (window.location.pathname == "/gst-returns") {
  //   type = "gstr";
  // } else if (window.location.pathname == "/download-gstin") {
  //   type = "downloadalldata";
  // } else {
  //   type = "reco";
  // }

  useEffect(() => {

    let isReportList = filterIsMultipleRight(displayData);
    let ReportRights = isMultiDownloadRight == "false" ? isReportList : displayData;
    let displayListData = (type == "reports" || type == "reco") ? ReportRights : displayData;

    setDataList(displayListData)

  }, [wizardBtn])

  const navigate = useNavigate();

  const filterIsMultipleRight = (lists) => {
    let itemList = [];
    for (const item of lists) {
      if (!item.title.includes("PAN Based")) {
        itemList.push(item);
      }
    }
    return itemList;
  };



  // ** View button
  const btnClick = (value) => {
    // ** Registration type wise permission menu
    let returnUrl = menuOpenPermission(value?.split("?")[0]);
    if (returnUrl == true) {
      navigate(currentURL);
      Swal.fire({
        icon: "warning",
        title: "",
        text: urlAccessMessage,
        customClass: {
          confirmButton: "btn btn-danger",
        },
        buttonsStyling: false,
      });
    } else {
      navigate(value);
    }
  };
  const renderData = () => {
    // Calculate the middle index
    const middleIndex = Math.ceil(dataList.length / 2);

    // Split the dataList into two parts
    const firstHalf = dataList.slice(0, middleIndex);
    const secondHalf = dataList.slice(middleIndex);

    // Render the first half
    const renderFirstHalf = firstHalf.map((item, index) => (
      <ListGroupItem className="d-flex justify-content-between align-items-center">
        <span className="heading-font-18-weight">
         
          {item.title}{" "}
        </span>
        <Button
          className="btn btn-danger round"
          // color="white"
          // style={{ color: '#0170bd' }}
          onClick={() => btnClick(item.path)}
        >
          View
        </Button>
      </ListGroupItem>
    ));

    // Render the second half
    const renderSecondHalf = secondHalf.map((item, index) => (
      <ListGroupItem className="d-flex justify-content-between align-items-center">
        <span className="heading-font-18-weight">
      
          {item.title}{" "}
        </span>
        <Button
          className="btn btn-danger round"
          // color="white"
          // style={{ color: '#0170bd' }}
          onClick={() => btnClick(item.path)}
        >
          View
        </Button>
      </ListGroupItem>
    ));

    return (

      <div className="d-flex">
  
        <div className="align-items-center me-3 custom-scrollbar" style={{ width: "70%", overflowY: "auto", height: "370px" }} >
          <ListGroup>{renderFirstHalf}</ListGroup>
        </div>
        <div className="align-items-center custom-scrollbar" style={{ width: "70%", overflowY: "auto", height: "370px"}}>
          <ListGroup>{renderSecondHalf}</ListGroup>
        </div>
      </div>
    );
  };

  // const renderData = () => {
  //   return dataList.map((item, index) => {
  //     return (
  //       <>
  //         <ListGroupItem className="d-flex justify-content-between align-items-center">
  //           <span className="heading-font-18-weight">
  //             <span className="me-1">
  //               <Badge className="btn-danger" pill>
  //                 {index + 1}
  //               </Badge>
  //             </span>
  //             {item.title}{" "}
  //           </span>
  //           <Button
  //             className="btn btn-danger round"
  //             onClick={() => btnClick(item.path)}
  //           >
  //             View
  //           </Button>
  //         </ListGroupItem>
  //       </>
  //     );
  //   });
  // };

  return (
    <Fragment>

      <h1 className="mb-1"> {displayTitle} </h1>
      {dataList && dataList.length > 0 && (
        <div className="align-items-center mb-1">
          <ListGroup style={{overflowY: "auto", height: "370px" }} className="custom-scrollbar">
            {renderData()}
          </ListGroup>
        </div>
      )}
    </Fragment>
  );
};

export default GSTReturnDetail;
