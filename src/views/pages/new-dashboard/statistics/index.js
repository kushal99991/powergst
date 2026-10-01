// ** React Imports
import { Fragment , useEffect } from 'react'

// ** Reactstrap Imports
import { Row, Col } from 'reactstrap'

import gstrall from "@src/assets/images/pages/gstr-all.png";
//**Returns Image */
import gstr1 from "@src/assets/images/pages/gstr-1.png";
import gstr3b from "@src/assets/images/pages/gstr-3b.png";
import gstr2b from "@src/assets/images/pages/GSTR2B.png";
import gstr2A from "@src/assets/images/pages/GSTR2A.png";
import gstr6 from "@src/assets/images/pages/GSTR6.png";
//**Reconciliation Image */
import pr from "@src/assets/images/pages/pr.png";
import twobvspr from "@src/assets/images/pages/twob-vs-pr.png";
import pantwobvspr from "@src/assets/images/pages/pan-twob-vs-pr.png";
import onevseinvoice from "@src/assets/images/pages/one-vs-e-Invoice.png";
import twoavspr from "@src/assets/images/pages/twoa-vs-pr.png";
//**Report Image */
import threebvs1vssr from "@src/assets/images/pages/threeb-vs-1-vs-sr.png";
import threebvs2bvspr from "@src/assets/images/pages/threeb-vs-2b-vs-pr.png";
import gstr1rate from "@src/assets/images/pages/gstr-1-rates.png";
import gstr1hsn from "@src/assets/images/pages/gstr-1-hsn.png";
import gstr1filed from "@src/assets/images/pages/gstr-1-filed.png";
//**Ledger Image */
import lr from "@src/assets/images/pages/lr.png";


import itc04 from "@src/assets/images/pages/itc04.png";
import gstr9 from "@src/assets/images/pages/gstr-9.png";
import { globleVariable } from '@configs/globalVariable'

// ** Custom Components
import StatsVertical from '@components/widgets/stats/StatsVertical'



const StatisticsCards = () => {
  // ** class
  const classNames = "dashboard-card-height";
  const isMultiDownloadRight = localStorage.getItem(globleVariable.isMultipleDownload)
  const isCompany = sessionStorage.getItem(globleVariable.isCompany)

  useEffect(() => {
    if (isCompany == false || isCompany == 'false') {
      document.getElementById('main-menu-navigation').style.visibility = 'hidden';
    } else {
      document.getElementById('main-menu-navigation').style.visibility = 'visible';
    }
  },[])



  return (
    <Fragment>
      <Row className=''>
      </Row>
      <Row className=''>
        {/* Stats With Icons */}
        <h2>Returns</h2>

        <Col xl='2' md='4' sm='6'>
          <StatsVertical className={classNames}  icon={<img src={gstrall} height={12} style={{borderRadius:0, marginTop:0}}></img>}color='info' stats='All GSTR' statTitle='' path="/gst-returns"  />
        </Col>

        <Col xl='2' md='4' sm='6'>
          <StatsVertical  className={classNames}  icon={<img src={gstr1} height={25} style={{borderRadius:0, marginTop:5}}></img>} color='warning' stats='GSTR 1' statTitle='' path="/gst-returns/gstr1-sales"  />
        </Col>
        <Col xl='2' md='4' sm='6'>
          <StatsVertical className={classNames}   icon={<img src={gstr3b} height={25} style={{borderRadius:0, marginTop:5}}></img>} color='danger' stats='GSTR 3B' statTitle='' path="/gst-returns/gstr3b" />
        </Col>

        <Col xl='2' md='4' sm='6'>
          <StatsVertical  className={classNames}  icon={<img src={gstr2b} height={25} style={{borderRadius:0, marginTop:5}}></img>} color='primary' stats='GSTR 2B' statTitle='' path="/gst-returns/gstr2b-summary" />
        </Col>

        <Col xl='2' md='4' sm='6'>
          <StatsVertical  className={classNames}  icon={<img src={gstr2A} height={25} style={{borderRadius:0, marginTop:5}}></img>} color='success' stats='GSTR 2A' statTitle='' path="/gst-returns/gstr2a" />
        </Col>

        <Col xl='2' md='4' sm='6'>
          <StatsVertical className={classNames}   icon={<img src={gstr6} height={25} style={{borderRadius:0, marginTop:5}}></img>} color='warning' stats='GSTR 6' statTitle='' path="/gst-returns/gstr6" />
        </Col>
      </Row>
      <Row className=''>
        {/* Stats With Icons */}
        <h2>Reconciliation</h2>

        <Col xl='2' md='4' sm='6'>
          <StatsVertical className={classNames}   icon={<img src={gstrall} height={12} style={{borderRadius:0, marginTop:0}}></img>} color='info' stats='All Reconciliation' statTitle='' path="/reconcilation" />
        </Col>

        <Col xl='2' md='4' sm='6'>
          <StatsVertical className={classNames}   icon={<img src={pr} height={12} style={{borderRadius:0, marginTop:5}}></img>} color='warning' stats='Purchase' statTitle='' path="/reconcilation/purchase-summary" />
        </Col>
        <Col xl='2' md='4' sm='6'>
          <StatsVertical className={classNames}   icon={<img src={twobvspr} height={25} style={{borderRadius:0, marginTop:5}}></img>} color='danger' stats='GSTR 2B vs Purchase' statTitle='' path="/reconcilation/2b-vs-purchase" />
        </Col>

      {
          isMultiDownloadRight == 'true' ?
          <Col xl='2' md='4' sm='6'>
          <StatsVertical className={classNames}   icon={<img src={pantwobvspr} height={24} style={{borderRadius:0, marginTop:5}}></img>} color='primary' stats='PAN Based GSTR 2B vs Purchase' statTitle=''  path="/reconcilation/pan-2b-vs-purchase" />
        </Col> : ""
      }

        <Col xl='2' md='4' sm='6'>
          <StatsVertical className={classNames}   icon={<img src={onevseinvoice} height={25} style={{borderRadius:0, marginTop:5}}></img>} color='success' stats='GSTR 1 vs E-Invoice' statTitle='' path="/reconcilation/gstr1-vs-e-invoice"   />
        </Col>
        <Col xl='2' md='4' sm='6'>
          <StatsVertical className={classNames}   icon={<img src={twoavspr} height={25} style={{borderRadius:0, marginTop:5}}></img>} color='warning' stats='GSTR 2A vs Purchase' statTitle='' path="/reconcilation/2a-vs-purchase" />
        </Col>



        {/* Stats With Icons */}
      </Row>
      <Row className=''>
        {/* Stats With Icons */}
        <h2>Reports</h2>
        <Col xl='2' md='4' sm='6'>
          <StatsVertical className={classNames}   icon={<img src={gstrall} height={12} style={{borderRadius:0, marginTop:0}}></img>} color='info' stats='All Reports' statTitle=''  path="/reports" />
        </Col>
        <Col xl='2' md='4' sm='6'>
          <StatsVertical className={classNames}   icon={<img src={threebvs1vssr} height={25} style={{borderRadius:0, marginTop:5}}></img>} color='warning' stats='GSTR 3B vs GSTR 1 vs Books' statTitle='' path="/reports/gstr1-gstr3b-salesreport" />
        </Col>
        <Col xl='2' md='4' sm='6'>
          <StatsVertical className={classNames}  icon={<img src={threebvs2bvspr} height={25} style={{borderRadius:0, marginTop:5}}></img>} color='danger' stats='GSTR 3B vs GSTR 2B vs Books' statTitle=''  path="/reports/gstr3b-gstr2b-books" />
        </Col>
        <Col xl='2' md='4' sm='6'>
          <StatsVertical className={classNames}   icon={<img src={gstr1rate} height={24} style={{borderRadius:0, marginTop:5}}></img>} color='primary' stats='GSTR 1 Rate Wise Report' statTitle=''  path="/reports/gstr1filed-ratewise-report" />
        </Col>
        <Col xl='2' md='4' sm='6'>
          <StatsVertical className={classNames}   icon={<img src={gstr1hsn} height={24} style={{borderRadius:0, marginTop:5}}></img>} color='success' stats='GSTR 1 HSN Summary' statTitle='' path="/reports/gstr1-hsnSummary-report" />
        </Col>
        <Col xl='2' md='4' sm='6'>
          <StatsVertical className={classNames}   icon={<img src={gstr1filed} height={24} style={{borderRadius:0, marginTop:5}}></img>} color='warning' stats='GSTR 1 Filed' statTitle='' path="/reports/gstr1-filed-data?gstr1=1" />
        </Col>

      </Row>

      <Row className=''>
        {/* Stats With Icons */}
        <h2>Ledgers</h2>
        <Col xl='2' md='4' sm='6'>
          <StatsVertical className={classNames}   icon={<img src={lr} height={12} style={{borderRadius:0, marginTop:2}}></img>} color='info' stats='Cash Ledger' statTitle=''  path="/ledgers/cash-ledger"  />
        </Col>
        <Col xl='2' md='4' sm='6'>
          <StatsVertical className={classNames}   icon={<img src={lr} height={12} style={{borderRadius:0, marginTop:2}}></img>} color='warning' stats='Credit Ledger' statTitle=''  path="/ledgers/credit-ledger" />
        </Col>
      </Row>
        <Row className='px-4'>
        </Row>
      < Row>
      </Row>
    </Fragment>
  )
}

export default StatisticsCards
