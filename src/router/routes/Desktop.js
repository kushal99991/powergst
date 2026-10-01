import { lazy } from 'react'

const TallyConnector = lazy(() => import('../../views/pages/automation/tallyConnector/tallyConnectorImport'))
import { urlEndpointConfig } from "@configs/urlEndpoint"

const DasktopRoutes = [
  {
    path:  urlEndpointConfig.TALLY_CONNECTOR,
    element: <TallyConnector />
  },

]

export default DasktopRoutes
