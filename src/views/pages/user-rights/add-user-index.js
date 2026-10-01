// ** React Imports
import { Fragment } from 'react'

// ** Reactstrap Imports
import { Row, Col, CardBody, Card } from 'reactstrap'

// ** Custom Components
import BreadCrumbs from '@components/breadcrumbs'
import AddUserTabs from './add-user-tabs'

const AddUserIndex = () => {
  return (

    <Card className='bg-transparent shadow-none'>
      <Col sm='12'>
        <AddUserTabs />
      </Col>
    </Card>
  )
}
export default AddUserIndex
