// ** Navigation imports
import pages from './pages'
import dashboards from './dashboards'
import Masters from './master'
import Tools from './tool'
import reports from './reports'
import ledgers from './ledgers'
import SupportTicket from './support-ticket'
import GSTRetrun from './gst-return'
import GstPan from './gstpanbased'
import Reco from './reco'


// ** Merge & Export
export default [...dashboards, ...GSTRetrun, ...reports]
