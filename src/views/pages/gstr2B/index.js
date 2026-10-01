// ** React Imports
import { Fragment, useState, useEffect } from 'react'
import { Link, useLocation, useSearchParams, useNavigate } from 'react-router-dom'
// ** Reactstrap Imports
import { Row, Col, TabContent, TabPane, CardText, Card, CardBody } from 'reactstrap'
// ** Demo Components
import Tabs from './tabs'
import Breadcrumbs from '@components/breadcrumbs'
//** Error Code file
// import errorCodeConfig from '../../../configs/apiErrorCodeConfig'
// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/pages/page-account-settings.scss'
import GSTR2BITC from './gstr-2b-itc'
import GSTR2BITCNonITc from './gstr-2b-non-itc'
import GSTR2BConstants from './Constants'
import Spinner from './../../../@core/components/spinner/Loading-spinner'
import DropDownGSTRExport from '../../components/dropdown-GSTR/index'
import DropDownGSTRDwownload from '../../components/dropdown-GSTR-Download/dropdownGSTRDownload';
import DropDownGSTRSplitImport from '../../components/dropdown-GSTR-Import/dropdownGSTRImport';
import { keysMap  } from "../../../configs/config";
import { globleVariable } from "../../../configs/globalVariable";
import LocalFunction from '../../../configs/getLocalFunction'
import SessionFunction from '../../../configs/getSessionFunction'
import { urlEndpointConfig } from "@configs/urlEndpoint";


// * Export button List
const exportButtonList = [
  { id: '1', name: `Export Summary [${keysMap.EXPORT_SUMMARY_DATA}]`  },
  { id: '2', name: `Export Data [${keysMap.EXPORT_ALL_DATA}]` }
]

//** Import List
const ImportButtonList = [
  { id: '1', name: 'Govt. Excel' },
]

const gstrSettings = () => {
  const location = useLocation();
  let clientId = null
  let finYears = null
  let finMonths = null

  console.log('gst2b--', location.state)

  const  userIds = localStorage.getItem(globleVariable.userId) &&  LocalFunction.getLocalValue(globleVariable.userId, true);
  const clientIds = sessionStorage.getItem(globleVariable.G_UCParId) && SessionFunction.getSessionValue(globleVariable.G_UCParId, true);
  const GFY =  sessionStorage.getItem(globleVariable.G_FY) && SessionFunction.getSessionValue(globleVariable.G_FY, true);
  const GFM = sessionStorage.getItem(globleVariable.G_FM) && SessionFunction.getSessionValue(globleVariable.G_FM, true);
  const token = localStorage.getItem(globleVariable.tokenKey) &&  LocalFunction.getLocalValue(globleVariable.tokenKey, true);
  const GGSTIN =  sessionStorage.getItem(globleVariable.G_GSTIN) && SessionFunction.getSessionValue(globleVariable.G_GSTIN, true);
 
  const subId =  localStorage.getItem(globleVariable.subscriptionId) &&  LocalFunction.getLocalValue(globleVariable.subscriptionId, true);


  //** location state
  if (location.state !== null) {
     console.log('gst2b->', location.state)
    // GSTR2BConstants.SELECT_CLIENTID = sessionStorage.getItem("G_UCID") !== null ? sessionStorage.getItem("G_UCID") : null;;
    // GSTR2BConstants.FIN_YEAR = sessionStorage.getItem("G_FY") !== null ? sessionStorage.getItem("G_FY") : null;;
    // GSTR2BConstants.FIN_MONTH = sessionStorage.getItem("G_FM") !== null ? sessionStorage.getItem("G_FM") : null;

    GSTR2BConstants.SELECT_CLIENTID =  location?.state?.clientId !== null ? location?.state?.clientId : null;;
    GSTR2BConstants.FIN_YEAR = location?.state?.finYear !== null ? location?.state?.finYear : null;;
    GSTR2BConstants.FIN_MONTH = location?.state?.finMonth !== null ? location?.state?.finMonth : null;;
  }

  //** Hook
  const [activeTab, setActiveTab] = useState('1')
  const [titleShow, setTitleShow] = useState('GSTR-2B')
  const [block, setBlock] = useState(false)
  const [downloadDate, setDownloadDate] = useState(false)    


  useEffect(() => {
    return () => setBlock(false)
  }, [])

 
  //** Tab click event
  const toggleTab = tab => {
    setActiveTab(tab)
  }

  //** spinner event
  const loadFunction = (value) => {
    setBlock(value)
  }


  return (
    <div>
      {block && <div className="loading1">Loading&#8230;</div>}
      <Fragment>
        <div className='content-header row py-1'>
          <div className='content-header-left col-md-6 col-12'>
            <div className='row breadcrumbs-top mb-0'>
              <div className='col-12'>
                <Breadcrumbs title={titleShow} data={[{ title: 'GST Returns',link: urlEndpointConfig.GSTR_All }, { title: 'GSTR 2B Summary' }]} />
              </div>
            </div>
          </div>  
          <div className='content-header-right text-md-end col-md-6 col-12 d-md-block d-none'>
            <DropDownGSTRDwownload setDownloadDate={setDownloadDate}  loadFunction={loadFunction} userId={userIds} clientId={clientIds} finYear={GFY} finMonth={GFM}  subscriptionId={subId} GstIn={GGSTIN}   isLoading={block} ></DropDownGSTRDwownload>
            {/* <DropDownGSTRSplitImport loadFunction={loadFunction} clientId={clientIds} finYear={GFY} finMonth={GFM}   isLoading={block}  userId={userIds}  GstIn={GGSTIN} ></DropDownGSTRSplitImport> */}
            <DropDownGSTRExport   item={exportButtonList} loadFunction={loadFunction} clientId={clientIds} finYear={sessionStorage.getItem(globleVariable.selectExportFromDt)} finMonth={sessionStorage.getItem(globleVariable.selectExportToDt)}  isLoading={block}  token={token}  subscriptionId={subId} GstIn={GGSTIN}  userId={userIds}  ></DropDownGSTRExport>
          </div>
        </div>
        <Row>
          <Col>
            <Tabs loadFunction={loadFunction} className='mb-2' activeTab={activeTab} toggleTab={toggleTab} downloadDate={downloadDate} setDownloadDate={setDownloadDate}  />
            <TabContent activeTab={activeTab}  >
              <TabPane tabId='1' key="1">
                <GSTR2BITC userId={userIds} clientId={clientIds} finYear={GFY} finMonth={GFM}  subscriptionId={subId} GstIn={GGSTIN} />
              </TabPane>
              <TabPane tabId='2' key="2">
                <GSTR2BITCNonITc userId={userIds} clientId={clientIds} finYear={GFY} finMonth={GFM}  subscriptionId={subId} GstIn={GGSTIN} />
              </TabPane>
            </TabContent>
          </Col>
        </Row>
      </Fragment>
    </div>
  )
}

export default gstrSettings
