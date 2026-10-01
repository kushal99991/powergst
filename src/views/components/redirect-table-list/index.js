import { ListGroup, ListGroupItem, Badge, Button } from "reactstrap";
import { urlEndpointConfig } from "@configs/urlEndpoint";
import {
  useNavigate,
} from "react-router-dom";
import { Fragment } from "react";
import Breadcrumbs from "@components/breadcrumbs";
import menuOpenPermission from "@helper/menuOpenPermission";
import Swal from "sweetalert2";
import { urlAccessMessage } from "@configs/config";
import { globleVariable } from '@configs/globalVariable'


const RedirectTableList = () => {
  let type = null;
  const currentURL = window.location.pathname;
  const isMultiDownloadRight = localStorage.getItem(globleVariable.isMultipleDownload);

  if (window.location.pathname == "/reports") {
    type = "reports";
  } else if (window.location.pathname == "/gst-returns") {
    type = "gstr";
  } else if (window.location.pathname == "/download-gstin") {
    type = "downloadalldata";
  } else {
    type = "reco";
  }

  const navigate = useNavigate();

  // ** Reports
  const listData = [
    { title: "GSTR 1 Rate Wise Report", path: `${urlEndpointConfig.GSTR1_RATE_REPORT}` },
    { title: "GSTR 3B vs GSTR 1 vs Books", path: `${urlEndpointConfig.GSTR1_VS_GSTR3B_VS_SALES_REPORT}` },
    { title: "GSTR 3B vs GSTR 2B vs Books", path: `${urlEndpointConfig.GSTR3B_VS_GSTR2B_REPORT}` },
    { title: "PAN Based GSTR 3B vs GSTR 2B vs Books", path: `${urlEndpointConfig.GSTR3B_VS_GSTR2B_PURCHASE}` },
    { title: "PAN Based GSTR 3B vs GSTR 1 vs Books", path: `${urlEndpointConfig.PAN_GSTR3B_VS_GSTR1_REPORT}` },    
    { title: "Sales Rate Wise Report", path: `${urlEndpointConfig.SALES_RATE_REPORT}` },
    { title: "Purchase Rate Wise Report", path: `${urlEndpointConfig.PURCHASE_RATE_REPORT}` },
    { title: "Sales HSN Summary", path: `${urlEndpointConfig.SALES_HSN_REPORT}` },
    { title: "GSTR 1 HSN Summary", path: `${urlEndpointConfig.GSTR1_HSN_REPORT}` },
    { title: "GST Filling Status", path: `${urlEndpointConfig.GST_Filling_Status}` },
    { title: "PAN Based Ledger", path: `${urlEndpointConfig.PANBASED_LEDGER}` },
    { title: "GSTR 1 Filed", path: `${urlEndpointConfig.GSTR1_FILED_REPORT}` },
    { title: "GSTR 3B Filed", path: `${urlEndpointConfig.GSTR3B_FILED_REPORT}` },
    { title: "GSTR 6 Filed", path: `${urlEndpointConfig.GSTR6_FILED_REPORT}` },
    { title: "GSTR 6A", path: `${urlEndpointConfig.GSTR6A_FILED_REPORT}` },
    { title: "GSTR 9 Filed", path: `${urlEndpointConfig.GSTR9_FILED_REPORT}` },
    { title: "GSTR 9C Filed", path: `${urlEndpointConfig.GSTR9C_FILED_REPORT}` },
    { title: "ITC 04 Filed", path: `${urlEndpointConfig.ITC04_REPORT}` },
    { title: "CMP 08 Filed", path: `${urlEndpointConfig.CMP08_REPORT}` },
    { title: "IFF Filed", path: `${urlEndpointConfig.IFF_REPORT}` },
    { title: "TDS/TCS Filed", path: `${urlEndpointConfig.TDS_TCS_REPORT}` },
  ];

  const filterIsMultipleRight = (lists) => {
    let itemList = [];
    for (const item of lists) {
      if (!item.title.includes('Pan Based')) {
        itemList.push(item)
      }
    }
    return itemList
  }


  let isReportList = filterIsMultipleRight(listData)
  let ReportRights = isMultiDownloadRight == 'false' ? isReportList : listData



  // ** Returns
  const GSTRRlistData = [
    { title: "GSTR 1", path: `${urlEndpointConfig.GSTR1}` },
    { title: "GSTR 3B", path: `${urlEndpointConfig.GSTR3B}` },
    { title: "GSTR 2B", path: `${urlEndpointConfig.GSTR2B}` },
    { title: "GSTR 2A", path: `${urlEndpointConfig.GSTR2A}` },
    { title: "GSTR 6", path: `${urlEndpointConfig.GSTR6}` },
    { title: "GSTR 6A", path: `${urlEndpointConfig.GSTR6A_FILED_REPORT}` },
    { title: "ITC 04", path: `${urlEndpointConfig.ITC04}` },
    { title: "IFF", path: `${urlEndpointConfig.IFF}` },
    { title: "CMP 08", path: `${urlEndpointConfig.CMP08}` },
    { title: "GSTR 4A", path: `${urlEndpointConfig.GSTR4A}` },
    { title: "GSTR 9", path: `${urlEndpointConfig.GSTR9}` },
    { title: "GSTR 9C", path: `${urlEndpointConfig.GSTR9C}` },
  ];

  // ** Download All Data
  const DownloadAllDataList = [
    { title: "Request OTP", path: `${urlEndpointConfig.REQUESTOTP}` },
    { title: "GSTR 1 Download", path: `${urlEndpointConfig.GSTR1_DOWNLOAD}` },
    { title: "GSTR 3B Download", path: `${urlEndpointConfig.GSTR3B_DOWNLOAD}` },
    { title: "GSTR 2B Download", path: `${urlEndpointConfig.GSTR2B_DOWNLOAD}` },
    { title: "GSTR 2A Download", path: `${urlEndpointConfig.GSTR2A_DOWNLOAD}` },
    { title: "GSTR 6 Download", path: `${urlEndpointConfig.GSTR6_DOWNLOAD}` },
    { title: "GSTR 6A Download", path: `${urlEndpointConfig.GSTR6A_DOWNLOAD}` },
    { title: "ITC 04 Download", path: `${urlEndpointConfig.ITC04_DOWNLOAD}` },
    { title: "IFF Download", path: `${urlEndpointConfig.IFF_DOWNLOAD}` },
    { title: "GSTR 4A Download", path: `${urlEndpointConfig.GSTR4A_DOWNLOAD}` },
    { title: "CMP08 Download", path: `${urlEndpointConfig.CMP08_DOWNLOAD}` },
    { title: "GSTR 9 Download", path: `${urlEndpointConfig.GSTR9_DOWNLOAD}` },
    { title: "GSTR 9C Download", path: `${urlEndpointConfig.GSTR9C_DOWNLOAD}` },
  ];

  // ** Reco
  const recolistData = [
    { title: "Purchase", path: `${urlEndpointConfig.PURCHASE}` },
    {
      title: "GSTR 2B vs Purchase",
      path: `${urlEndpointConfig.GSTR2B_VS_PURCHASE}`,
    },
    {
      title: "PAN Based GSTR 2B vs Purchase",
      path: `${urlEndpointConfig.PANBASE2B_VS_PURCHASE}`,
    },
    {
      title: "GSTR 1 vs E-Invoice",
      path: `${urlEndpointConfig.GSTR1_VS_EINVOICE}`,
    },
    {
      title: "GSTR 2A vs Purchase",
      path: `${urlEndpointConfig.GSTR2A_VS_PURCHASE}`,
    },
    {
      title: "PAN Based GSTR 2A vs Purchase",
      path: `${urlEndpointConfig.GSTR2A_VS_PURCHASE_RECO}`,
    },
  ];


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
    if (type == "reports") {
      return ReportRights.map((item, index) => {
        return (
          <>
            <ListGroupItem className="d-flex justify-content-between align-items-center">
              <span className="heading-font-18-weight"> {item.title} </span>
              <Button
                className="btn btn-danger"
                onClick={() => btnClick(item.path)}
              >
                View
              </Button>
            </ListGroupItem>
          </>
        );
      });
    } else if (type == "gstr") {
      return GSTRRlistData.map((item, index) => {
        return (
          <>
            <ListGroupItem className="d-flex justify-content-between align-items-center">
              <span className="heading-font-18-weight"> {item.title} </span>
              <Button
                className="btn btn-danger"
                onClick={() => btnClick(item.path)}
              >
                View
              </Button>
            </ListGroupItem>
          </>
        );
      });
    } else if (type == "downloadalldata") {
      return DownloadAllDataList.map((item, index) => {
        return (
          <>
            <ListGroupItem className="d-flex justify-content-between align-items-center">
              <span className="heading-font-18-weight"> {item.title} </span>
              <Button
                className="btn btn-danger"
                onClick={() => btnClick(item.path)}
              >
                View
              </Button>
            </ListGroupItem>
          </>
        );
      });
    } else if (type == "reco") {
      return recolistData.map((item, index) => {
        return (
          <>
            <ListGroupItem className="d-flex justify-content-between align-items-center">
              <span className="heading-font-18-weight"> {item.title} </span>
              <Button
                className="btn btn-danger"
                onClick={() => btnClick(item.path)}
              >
                View
              </Button>
            </ListGroupItem>
          </>
        );
      });
    }
  };

  return (
    <Fragment>
      <div className="content-header row py-1">
        <div className="content-header-left col-md-8 col-12">
          <div className="row breadcrumbs-top">
            <div className="col-12">
              {type == "reports" && (
                <Breadcrumbs
                  title="Reports"
                  data={[{ title: "Reports", link: "/dashboard" }]}
                />
              )}

              {type == "gstr" && (
                <Breadcrumbs
                  title="GSTR Returns"
                  data={[{ title: "GSTR Returns", link: "/dashboard" }]}
                />
              )}

              {type == "downloadalldata" && (
                <Breadcrumbs
                  title="Download all data from GSTIN"
                  data={[{ title: "Download all data from GSTIN", link: "/dashboard" }]}
                />
              )}


              {type == "reco" && (
                <Breadcrumbs
                  title=""
                  data={[{ title: "Reconciliation", link: "/dashboard" }]}
                />
              )}
            </div>
          </div>
        </div>
        <div className="content-header-right text-md-end col-md-4 col-12 d-md-block d-none"></div>
      </div>

      {type == "reports" && listData && (
        <div className="align-items-center mb-2">
          <ListGroup style={{ width: "60%" }}>{renderData()}</ListGroup>
        </div>
      )}

      {type == "gstr" && GSTRRlistData && (
        <div className="align-items-center mb-2">
          <ListGroup style={{ width: "60%" }}>{renderData()}</ListGroup>
        </div>
      )}
      {type == "downloadalldata" && DownloadAllDataList && (
        <div className="align-items-center mb-2">
          <ListGroup style={{ width: "60%" }}>{renderData()}</ListGroup>
        </div>
      )}
      {type == "reco" && recolistData && (
        <div className="align-items-center mb-2">
          <ListGroup style={{ width: "60%" }}>{renderData()}</ListGroup>
        </div>
      )}
    </Fragment>
  );
};

export default RedirectTableList;
