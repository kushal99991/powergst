// ** React Imports
import { Fragment, useEffect } from 'react'

// ** Reactstrap Imports
import { Row, Col } from 'reactstrap'

import ListWizardVertical from './ListWizardVertical'

// ** Custom Components
import BreadCrumbs from '@components/breadcrumbs'

const Wizard = () => {
  return (
    <Fragment>
      <BreadCrumbs title='Dashboard' data={[]} />
      <Row className="mt-0"  >
        <Col sm='12'>
          <ListWizardVertical   />
        </Col>

      </Row>
    </Fragment>
  )
}
export default Wizard
