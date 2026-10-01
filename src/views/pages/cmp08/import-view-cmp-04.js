// ** React Imports
import { Fragment, useState, forwardRef, useLayoutEffect, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
// ** Reactstrap Imports
import {
    Row,
    Col,
    Card,
    Input,
    Label,
    Button,
    CardTitle,
    CardHeader,
    CardText,
    CardBody,
    AccordionItem,
    AccordionHeader,
    AccordionBody,
    ListGroup, ListGroupItem, Table, UncontrolledAccordion,
    Accordion
} from 'reactstrap'
import classnames from 'classnames'
// ** Custom Components
import Breadcrumbs from '@components/breadcrumbs'

import {  globleVariable  } from '../../../configs/globalVariable'
import LocalFunction from '../../../configs/getLocalFunction'
import SessionFunction from '../../../configs/getSessionFunction'
import itc04SummaryService from '../../../services/itc04Services/itc04SummaryService'
import {  downloadURL } from '@helper/downloadUrl'
import Swal from 'sweetalert2'
import toast from "react-hot-toast";
import errorCodeConfig from '../../../configs/apiErrorCodeConfig'
const ImportViewITC04 = () => {

    const [block, setBlock] = useState(false)
    const [accordionTitle, setAccordionTitle] = useState('Show Sheet Wise Detail')
    const [open, setOpen] = useState('0')
    const [fileFormat, setFileFormat] = useState('Government Excel Format')
    const Navigate = useNavigate();

    const location = useLocation();
    let ImportData = null
    let ImportedDate = null
    if (location.state !== null) {
        ImportData = location.state.importData !== null ? location.state.importData : null;
        ImportedDate = location.state.importedDate !== null ? location.state.importedDate : null;
    }

    const toggle = id => {
        console.log(open)
        open === id ? setOpen('0') : setOpen(id)
        open === id ? setAccordionTitle('Show Sheet Wise Detail') : setAccordionTitle('Hide Detail')
    }

    const OnProcessClick = () => {
        // sessionStorage.setItem("flagT", "true");
        // SessionFunction.setSessionValue(globleVariable.f_g1, "true", true)
        // console.log(ImportData)
        // if (ImportData.sheetWiseCount.length > 0) {
            // Navigate('/itc-returns', { state: { importData: ImportData, importedDate:ImportedDate } })
        //     //   navigate('/purchase/import-data-summary', { state: { importData: res.data.data } })
        // }
        Navigate("/gst-returns/itc-returns")
    }

    const onClickDownloadExportError = () => {
        console.log(ImportData?.guid,"importDatat")
        setBlock(true)
        itc04SummaryService.exportITC04ErrorFileData(ImportData.guid).then((res) => {
            if (res?.status == 200) {
              console.log("res1" , res.data.data );
              setBlock(false);
              downloadURL(res.data.data)
              
            } else {
              console.log("res2");
              setBlock(false);
    
              toast.error(res.headers.errormessage, {
                position: "top-right",
              });
            }
          })
          .catch((error) => {
            setBlock(false);
            Swal.fire({
              icon: "error",
              title: "",
              text: error?.message,
              customClass: {
                confirmButton: "btn btn-outline-danger",
              },
              buttonsStyling: false,
            });
          });
      };
    
    return (
        <Fragment>
            {/* <Breadcrumbs title='Purchase Import' data={[{ title: 'Purchase Summary', link: '/purchase-summary' }, { title: 'Purchase Import' }]} /> */}
            {block && <div className="loading1">Loading&#8230;</div>}
            <div className='content-header row py-1'>
                <div className='content-header-left col-md-8 col-12'>
                    <div className='row breadcrumbs-top mb-0'>
                        <div className='col-12'>
                            <Breadcrumbs title='Purchase Import Summary' data={[{ title: 'GST Returns' }, { title: 'ITC 04  Summary', link: '/gst-returns/itc-returns' }, { title: 'ITC 04 Import Summary' }]} />

                        </div>
                    </div>
                </div>
                <div className='content-header-right text-md-end col-md-4 col-12 d-md-block d-none'>
                </div>
            </div>

            <Card>
                <CardBody>
                    <div className='text-center'>
                        <h3 className='mt-2 pb-50'>We&#39;ve imported your data!</h3>
                        <div className='mb-2 pb-75'>
                            <Button color='success' className='me-1' onClick={OnProcessClick} outline  >
                                Continue
                            </Button>
                            <Button color='danger' className='me-1' onClick={onClickDownloadExportError} outline  >
                                <i className="fa fa-file-excel-o"></i> {"      "}
                                Download Error
                            </Button>
                        </div>
                        <div className='d-flex align-items-center justify-content-center mb-1'>
                            <h6 className='me-50 mb-0'>You&#39;ve imported the following data</h6>

                        </div>
                        {/* <h6>{fileFormat}</h6> */}
                        <h6><b>{LocalFunction.getLocalValue(globleVariable.p_file, true)}</b></h6>

                        <div className='col-md-4 offset-md-4'>
                            {
                                ImportData && (
                                    <>
                                        <div
                                            key="1"
                                            className={classnames('d-flex justify-content-start align-items-center mt-1')} >
                                            <div>
                                                <h6 className='mb-0 fw-bolder'>No of Sheets</h6>
                                            </div>
                                            <div className='ms-auto'>
                                                <h6 className='fw-bolder' >{ImportData.totalSheet}</h6>
                                            </div>
                                        </div>

                                        <div
                                            key="2"
                                            className={classnames('d-flex justify-content-start align-items-center mt-1')} >
                                            <div>
                                                <h6 className='mb-0'>No of Records</h6>
                                            </div>
                                            <div className='ms-auto'>
                                                <h6 className='fw-bolder' >{ImportData.totalRecord}</h6>
                                            </div>
                                        </div>

                                        <div
                                            key="3"
                                            className={classnames('d-flex justify-content-start align-items-center mt-1')} >
                                            <div>
                                                <h6 className='mb-0'>Passed</h6>
                                            </div>
                                            <div className='ms-auto'>
                                                <h6  className='fw-bolder'>{ImportData.totalPass}</h6>
                                            </div>
                                        </div>

                                        <div
                                            key="4"
                                            className={classnames('d-flex justify-content-start align-items-center mt-1')} >
                                            <div>
                                                <h6 className='mb-0'>Failed</h6>
                                            </div>
                                            <div className='ms-auto '>
                                                <h6 className='fw-bolder' >{ImportData.totalFailed}</h6>
                                            </div>
                                        </div>
                                        <div
                                            key="5"
                                            className={classnames('d-flex justify-content-start align-items-center mt-1')} >
                                            <div>
                                                <h6 className='mb-0'>Duplicate</h6>
                                            </div>
                                            <div className='ms-auto'>
                                                <h6 className='fw-bolder' >{ImportData.totalDuplicate}</h6>
                                            </div>
                                        </div>

                                        <Accordion open={open} toggle={toggle} >
                                            <AccordionItem key="1">
                                                <AccordionHeader tag='h2' targetId="1">
                                                <div className='text-primary fw-bolder text-decoration-underline' > {accordionTitle} </div>  
                                                </AccordionHeader>
                                                <AccordionBody accordionId="1">
                                                    {
                                                        ImportData &&
                                                        ImportData.sheetWiseCount.map((data, i) => (
                                                            <div  key={i}>
                                                                <hr></hr>
                                                                <div
                                                                    // key={i}
                                                                    className={classnames('d-flex justify-content-start align-items-center mt-1')} >
                                                                    <div>
                                                                        <h6 className='mb-0'>
                                                                            <b>
                                                                                {data.sheetName.toString().toUpperCase()}
                                                                            </b>
                                                                        </h6>
                                                                    </div>
                                                                </div>
                                                                <hr></hr>
                                                                <div
                                                                    // key={i + 1}
                                                                    className={classnames('d-flex justify-content-start align-items-center mt-1')} >
                                                                    <div>
                                                                        <h6 className='mb-0'>Pass</h6>
                                                                    </div>
                                                                    <div className='ms-auto'>
                                                                        <h6 >{data.pass}</h6>
                                                                    </div>
                                                                </div>
                                                                <div
                                                                    // key={i + 2}
                                                                    className={classnames('d-flex justify-content-start align-items-center mt-1')} >
                                                                    <div>
                                                                        <h6 className='mb-0'>Fail</h6>
                                                                    </div>
                                                                    <div className='ms-auto'>
                                                                        <h6 >{data.failed}</h6>
                                                                    </div>
                                                                </div>
                                                                <div
                                                                    // key={i + 3}
                                                                    className={classnames('d-flex justify-content-start align-items-center mt-1')} >
                                                                    <div>
                                                                        <h6 className='mb-0'>Duplicate</h6>
                                                                    </div>
                                                                    <div className='ms-auto'>
                                                                        <h6 >{data.duplicate}</h6>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))
                                                    }

                                                </AccordionBody>
                                            </AccordionItem>
                                        </Accordion>
                                    </>
                                )}
                        </div>
                    </div>
                </CardBody>
            </Card>
        </Fragment>
    )
}

export default ImportViewITC04
