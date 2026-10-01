// ** Icons Import
import { Activity, Box } from 'react-feather'

export default [
  {
    id: 'invoice',
    title: 'Invoice',
    icon: <Box />,
    children: [
        {
            id: 'purchase',
            title: 'Purchase',
            icon: <Activity />,
            navLink: ''
          },
    ]
  }
]