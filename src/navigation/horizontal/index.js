// ** Navigation imports

import dashboards from './dashboards'
import reports from './reports'
import ledgers from './ledgers'
import GSTRetrun from './gst-return'
import Reco from './reco'
import GstPan from './gstpanbased'
import loginPortal from './loginPortal'
// ** Merge & Export

const NavigationData = [...dashboards, ...GSTRetrun, ...reports, ...loginPortal]
export default NavigationData
