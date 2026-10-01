// ** React Imports
import { Fragment , useEffect } from 'react'
// ** Third Party Components
import { Row, Col } from 'reactstrap'
// **  Components
import CompanyDashboard from './companyDashboard'
// ** Styles
import  CompanyConstants  from '../../pages/company-add/Constants';

const Tables = () => {
  console.log("NODE_ENV" , console.log(process.env.NODE_ENV))
  CompanyConstants.ADD_COMPANY = false;
  return (
    <Fragment>
      <Row>
        <Col sm='12'>
          <CompanyDashboard />
        </Col>
      </Row>
    </Fragment>
  )
}

export default Tables
