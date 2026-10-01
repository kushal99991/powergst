// ** React Imports
import { Fragment, useState, useEffect } from 'react'
import { Link, useLocation, useSearchParams, useNavigate } from 'react-router-dom'
// ** Third Party Components
import toast from 'react-hot-toast'

// ** Reactstrap Imports
import { Row, Col, TabContent, TabPane } from 'reactstrap'

// ** Demo Components
import Tabs from './Tabs'
import Breadcrumbs from '@components/breadcrumbs'
import AccountTabContent from './AccountTabContent'
import { handleCompanyDashboard } from '../../../views/apps/user/store'
//** Error Code file
import errorCodeConfig from '../../../configs/apiErrorCodeConfig'

// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/pages/page-account-settings.scss'
import PrincipalPalceTabs from './PrincipalPalceTabContent'
import NatureBusinessActivitiesTab from './NatureBusinessActivitiesTabContent'
import PromotersPartnerTabs from './PromotersPartnerTabContent'
import SignatoryTabs from './SignatoryTabContent'
import BankTabs from './BankTabContent'
import CommoditiesTabs from './CommoditiesTabContent'

// ** Store & Actions
import { getAllCopmpanyDataById, getData } from '../../../views/apps/user/store'
import { useDispatch, useSelector } from 'react-redux'
import CompanyConstants from './Constants'
import encryptData from '../../../auth/crypto/crypto'

import { globleVariable } from "../../../configs/globalVariable";
import LocalFunction from '../../../configs/getLocalFunction'


const AccountSettings = () => {
  // ** States
  const [activeTab, setActiveTab] = useState('1')
  const [data, setData] = useState(null)
  const dispatch = useDispatch()
  const store = useSelector(state => state.users)
  const { search } = useLocation();
  const [searchParams] = new URLSearchParams(search);
  const location = useLocation();

  let decrptyUrl = null;
  if (searchParams !== undefined) {
    const setUrl = searchParams[0].replaceAll(' ', '+')
    decrptyUrl = encryptData.decrypt(setUrl)
  } else {
    decrptyUrl = null;
  }

  let clientId = null
  if (location.state !== null) {
    clientId = location.state.clientId !== null ? location.state.clientId : null;
  }

  const [editClientId, setEditClientId] = useState(decrptyUrl);
  const [titleShow, setTitleShow] = useState('Create New Company');
  const [isShowCompanyTitle, setIsShowCompanyTitle] = useState(true);

  const userIds = LocalFunction.getLocalValue(globleVariable.userId, true);
  const subscriptionIds = LocalFunction.getLocalValue(globleVariable.subscriptionId, true);
 
  let importId = localStorage.getItem(globleVariable.vimportData)

  //** toggle-tab 
  const toggleTab = tab => {
    setActiveTab(tab)
  }

  //** search 
  useEffect(() => {
    console.log('show client id >>', editClientId);
    if (editClientId !== null && editClientId !== '') {
      setTitleShow('Update Company')
      dispatch(getAllCopmpanyDataById(editClientId))
      CompanyConstants.ADD_COMPANY = true;
    }
  }, [])


  useEffect(() => {
    dispatch(handleCompanyDashboard([]))
    var isShowCompanyTitle = true;
    isShowCompanyTitle = sessionStorage.getItem(globleVariable.isCompany);
    if (isShowCompanyTitle == 'false') {
      setIsShowCompanyTitle(false);
      // document.getElementById("CompanyTitleDivision")?.classList?.add("d-none")
      document.getElementById("DivisionAppContent").classList.add("app-content-new")
      document.getElementById("DivisionAppContent").classList.remove("app-content")
      //document.getElementById("DivisionAppContent").style.padding ="4.5rem 2rem 0 2rem !important;";
    }
  }, [])


  return (
    <Fragment>
      <div className='content-header row py-1'>
        <div className='content-header-left col-md-8 col-12'>
          <div className='row breadcrumbs-top mb-0'>
            <div className='col-12'>
              {/* <Breadcrumbs title={titleShow} data={[{ title: '' }]} /> */}
            </div>
          </div>
        </div>
        <div className='content-header-right text-md-end col-md-4 col-12 d-md-block d-none'>
        </div>
      </div>
      {/* <Breadcrumbs title={titleShow} data={[{ title: '' }]} /> */}
      <Row>
        <Col xs={12}>
          <Tabs className='mb-2' activeTab={activeTab} toggleTab={toggleTab} />
          <TabContent activeTab={activeTab} className="m-200">
            <TabPane tabId='1' key="1" >
              <AccountTabContent store={store} importsId={importId} activeTabs={activeTab} userIds={userIds}  subscriptionIds={subscriptionIds}   />
            </TabPane>
            <TabPane tabId='2' key="2">
              <PrincipalPalceTabs store={store} importsId={importId} activeTabs={activeTab} userIds={userIds}  subscriptionIds={subscriptionIds}  />
            </TabPane>
            <TabPane tabId='3' key="3">
              <NatureBusinessActivitiesTab store={store} importsId={importId} activeTabs={activeTab}  userIds={userIds}  subscriptionIds={subscriptionIds} />
            </TabPane>
            <TabPane tabId='4' key="4">
              <PromotersPartnerTabs store={store} importsId={importId} activeTabs={activeTab}  userIds={userIds}  subscriptionIds={subscriptionIds}/>
            </TabPane>
            <TabPane tabId='5' key="5">
              <SignatoryTabs store={store} importsId={importId} activeTabs={activeTab}  userIds={userIds}  subscriptionIds={subscriptionIds} />
            </TabPane>
            <TabPane tabId='6' key="6">
              <BankTabs store={store} importsId={importId} activeTabs={activeTab}  userIds={userIds}  subscriptionIds={subscriptionIds} />
            </TabPane>
            <TabPane tabId='7' key="7">
              <CommoditiesTabs store={store} importsId={importId} activeTabs={activeTab}  userIds={userIds}  subscriptionIds={subscriptionIds} />
            </TabPane>
          </TabContent>
        </Col>
      </Row>
    </Fragment>
  )
}

export default AccountSettings
