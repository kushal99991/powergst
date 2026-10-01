// ** Reducers Imports
import navbar from './navbar'
import layout from './layout'
import auth from './authentication'
import users from '@src/views/apps/user/store'
import gstrDatatable from '@src/views/pages/gstr2B/store'
// import excelData from '@src/views/pages/purchase/Excel-Validate/store'
import gstr6AData from '@src/views/pages/reports/gstr6AFiledData/store'
import gstr2AData from '@src/views/pages/gstr2A/store'
import itcO4Filed from '@src/views/pages/reports/itc04FiledData/store'
import hsnSumReport from '@src/views/pages/reports/gstr1HsnSummary/store'
import salesSumReport from '@src/views/pages/reports/salesHsnSummary/store'
import purchaseRateReport from'@src/views/pages/reports/purchaseRatewiseSummary/store'
import salesRateSumReport from'@src/views/pages/reports/salesRatewiseSummary/store'
import gstr1filedRateReport from'@src/views/pages/reports/gstr1filedRateWise/store'
import cmp08Filed from "../views/pages/reports/cmp08FiledData/store"
import iFFFiledReport from '../views/pages/reports/iffFiledData/store/index'
import gstr4ASummary from "../views/pages/gstr4A/store/index"
import gstr1ExcelData from "../views/pages/gstr1/Excel-Validate/store/index.js"
import iffExceData from "../views/pages/iif/Excel-Validate/store/index.js"
import gstr6ExcelData from '@src/views/pages/gstr6/Excel-Validate/store'

const rootReducer = {
  auth,
  users,
  navbar,
  layout,
  gstrDatatable,
  // excelData,
  gstr6AData,
  gstr2AData,
  itcO4Filed,
  hsnSumReport,
  salesSumReport,
  purchaseRateReport,
  salesRateSumReport,
  gstr1filedRateReport,
  cmp08Filed,
  iFFFiledReport,
  gstr4ASummary,
  gstr1ExcelData,
  iffExceData,
  gstr6ExcelData
}

export default rootReducer
