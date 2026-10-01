import {
    Row,
    Col,
    Label,
    Button,
    Modal,
    ModalBody,
    ModalHeader,
    Form,
    Input
} from 'reactstrap'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Select from 'react-select'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import Flatpickr from "react-flatpickr";
// ** Utils
import { selectThemeColors } from '@utils'
// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'
import { API_URL_GSTR, DROPDOWN_PLACEHOLDER, SELECT_MAXSIZE } from '../../../configs/config'
import makeAnimated from 'react-select/animated'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'
import {
    X
} from 'react-feather'
import gstr1FileDataService from '../../../services/gstr1/gstr1DataFileService/gstr1FileDataService'
import { Fragment } from 'react'

import {  globleVariable  } from '../../../configs/globalVariable'
import LocalFunction from '../../../configs/getLocalFunction'
import SessionFunction from '../../../configs/getSessionFunction'
import { downloadURL } from '../../../helper/downloadUrl'
import errorCodeConfig from '../../../configs/apiErrorCodeConfig'

const animatedComponents = makeAnimated()

const GSTR1FiledExpDataModel = ({ Heading, toggleCompose, loadFunction,srcLoad,setSrcLoad,fromDate, setFromDate,toDate, setToDate,finFromYear, setFinFormYear,monthFrom, setMonthFrom }) => {

    const [shows, setShows] = useState(true)
    const [block, setBlock] = useState(false)
    const [check1, setCheck1] = useState(false)
    const [panDataFrom, setPanDataFrom] = useState([]);
    const [panData, setPanData] = useState([]);
    const [displayType, setDisplayType] = useState([]);
    const [disableTextBoxClass , setDisableTextBoxClass] = useState('form-control purchseCellDisable')

    //** from and todate usestate 
    // const [fromDate, setFromDate] = useState('')
    // const [toDate, setToDate] = useState('')

    
    // const [finFromYear, setFinFormYear] = useState(null);
    // const [monthFrom, setMonthFrom] = useState(null);

    //** error msg
    const [errorMsg, setErrorMsg] = useState('');
    const [errorMsgFrom, setErrorMsgFrom] = useState('');
    const [errorMsgTo, setErrorMsgTo] = useState('');
    const [errorMsgFromDate, setErrorMsgFromDate] = useState('');
    const [errorMsgToDate, setErrorMsgToDate] = useState('');

    const [finYear, setFineYear] = useState();
    const [finMonth, setFineMonth1] = useState();
    // const [srcLoad, setSrcLoad] = useState(false)

    //**checkbox check
    const [isValid, setisValid] = useState(false);
 
    const token = LocalFunction.getLocalValue(globleVariable.tokenKey, true)
    const rangeFilters = LocalFunction.getLocalValue(globleVariable.rangeFilters, true)
    const gstr1FiledFromDt = SessionFunction.getSessionValue(globleVariable.gstr1FiledFromDt, true)
    const gstr1FiledToDt = SessionFunction.getSessionValue(globleVariable.gstr1FiledToDt, true)
    const G_UCParId = SessionFunction.getSessionValue(globleVariable.G_UCParId, true)
    const userId = LocalFunction.getLocalValue(globleVariable.userId, true)
    const subscriptionId = LocalFunction.getLocalValue(globleVariable.subscriptionId, true)

    // ** Hooks
    const {
        control,
        handleSubmit,
        formState: { errors },
        clearErrors,
    } = useForm()


    const finYearOption = rangeFilters;
    const YearList = finYearOption !== undefined && finYearOption !== null && finYearOption !== "" && finYearOption !== 'undefined' ? JSON.parse(finYearOption) : []

    useEffect(() => {
        setPanDataFrom(YearList)
        setPanData(YearList)
        setDisplayType(true)
        // setGSRT1Data(true)

    }, [])



    // useEffect(() => {
    //     return () => setBlock(false)
    // }, [])

    useEffect(() => {
       
        // console.log('default value');
        // console.log(gstr1FiledFromDt)
        if (displayType == true) {

            let defaultValueFrom = null;
            let defaultValueTo = null;
            if (gstr1FiledFromDt !== null && gstr1FiledFromDt !== "" && gstr1FiledFromDt !== undefined) {
                console.log('set from date')
                defaultValueFrom = panData?.filter((item) => item.value == gstr1FiledFromDt)[0];
            } else {
                defaultValueFrom = panData?.filter((item) => Number(item.value) == Number(SessionFunction.getSessionValue(globleVariable.defaultYear, true)))[0];
            }

            if (gstr1FiledToDt !== null && gstr1FiledToDt !== "" && gstr1FiledToDt !== undefined) {
                defaultValueTo = panData?.filter((item) => item.value == gstr1FiledToDt)[0];
            } else {
                defaultValueTo = panData?.filter((item) => Number(item.value) == Number(SessionFunction.getSessionValue(globleVariable.defaultYear, true)))[0];
            }

            if (defaultValueFrom !== undefined && defaultValueFrom !== null && defaultValueFrom !== "") {
                setFinFormYear(defaultValueFrom)
                //  sessionStorage.setItem('gstr1FromDt', defaultValueFrom?.value)
            }
            if (defaultValueTo !== undefined && defaultValueTo !== null && defaultValueTo !== "") {
                setMonthFrom(defaultValueTo)
                // sessionStorage.setItem('gstr1SelectExportToDt', defaultValueTo?.value)
            }
        }

    }, [displayType])

    //** 
    const handleCheck = (e) => {
        setCheck1(e.target.checked)        
        if (e.target.checked == false ) {
            setDisableTextBoxClass("form-control purchseCellDisable")
            setisValid(false);
            setFromDate(null);
            setToDate(null);
            setErrorMsgFromDate('')
            setErrorMsgToDate('')
        }
        else {
            setDisableTextBoxClass("form-control")
            
            setisValid(true);
        }
    }

    const selectFromYear = (value) => {
        console.log("value=", value)
        setFineYear(value?.value)

        setFinFormYear(value)
        setErrorMsg('');
        setErrorMsgFrom('');
        setErrorMsgTo('');
        const setDt = Number(monthFrom?.srNo) > Number(value?.srNo) ? monthFrom : panDataFrom[0]
        const x = panDataFrom?.filter((item) => Number(item.srNo) >= Number(value.srNo))
        // sessionStorage.setItem('gstr1FromDt', value?.value)
        SessionFunction.setSessionValue(globleVariable.gstr1FiledFromDt, value?.value, true)

        setMonthFrom(setDt)
        setPanData(x);

        // sessionStorage.setItem('gstr1SelectExportToDt', setDt?.value)
        SessionFunction.setSessionValue(globleVariable.gstr1FiledToDt, setDt?.value, true)

    }


    const selectFromMonth = (value) => {
        setErrorMsg('');
        setErrorMsgTo('');
        setMonthFrom(value);
        setFineMonth1(value.value);
        if (Number(finFromYear?.srNo) > Number(value?.srNo)) {
            const fromFilter = panDataFrom?.filter((item) => Number(item.srNo) == Number(value.srNo))[0]
            setFinFormYear(fromFilter)
            // sessionStorage.setItem('gstr1FromDt', fromFilter?.value)
            // sessionStorage.setItem('gstr1SelectExportToDt', fromFilter?.value)
            SessionFunction.setSessionValue(globleVariable.gstr1FiledFromDt, fromFilter?.value, true)
            SessionFunction.setSessionValue(globleVariable.gstr1FiledToDt, fromFilter?.value, true)


        } else {
            // sessionStorage.setItem('gstr1SelectExportToDt', value?.value)
            SessionFunction.setSessionValue(globleVariable.gstr1FiledToDt, value?.value, true)

        }

    }

    const clientId = G_UCParId;

    const onSubmit = () => {
        
        console.log('show date')
        console.log(finFromYear.value, monthFrom.value)
        console.log(fromDate, toDate)
        console.log(isValid)

        //  let isValid 
        if (isValid) {
            if ((fromDate == null || fromDate == "" || fromDate == undefined) &&  
                (toDate == null || toDate == "" || toDate == undefined) )  {
                setErrorMsgFromDate("Please select  From Date");
                setErrorMsgToDate("Please select To Date");
                return;
            }

            if (fromDate == null || fromDate == "" || fromDate == undefined) {
                setErrorMsgToDate("Please select From Date");
                return;
            }

            if (toDate == null || toDate == "" || toDate == undefined) {
                setErrorMsgToDate("Please select To Date");
                return;
            }

        }
       setBlock(true);
        clearErrors();
       
        // setTimeout(() => {
        //     setSrcLoad(true)
        // }, 5);
        // setBlock(true);
        gstr1FileDataService.exportGSTR1FiledExportData(clientId, finFromYear.value, monthFrom.value, fromDate, toDate,subscriptionId, userId,  token).then(res => {
           setBlock(false);
            console.log("export res=", res?.status, res)
            if (res?.status == 200 && res.data.status == errorCodeConfig.APIDefaultCode.Success) {
                setShows(false)
                toggleCompose();

                console.log("res1");
                // setTimeout(() => {
                //     // loadFunction(false);
                //     setSrcLoad(false);
                // }, 1000);
                downloadURL(res.data.data)
            }
            else if (res?.status == 401) {
                setShows(false)
                toggleCompose();
                tokenExpiresRedirect()
            }
            else {
                setShows(false)
                toggleCompose();
                console.log("res2");
                // loadFunction(false);

                toast.error(res.data.errorMessage, {
                    position: "top-right",
                });
            }
        }).catch(error => {
             setShows(false)
        toggleCompose();
             setBlock(false);
            console.log("res2");
            // loadFunction(false);
            setSrcLoad(false);
            setIUrl('');

            // toast.dismiss();
            console.log(error.message)
            Swal.fire({
                icon: 'error',
                title: '',
                text: error?.message,
                customClass: {
                    confirmButton: 'btn btn-danger'
                },
                buttonsStyling: false
            })
        })

    }

    // Modal close
    const closeModal = () => {
        clearErrors();
        setShows(false)
        toggleCompose();
    }


    return (
        <Fragment>
            <Form className='mt-2 pt-50' onSubmit={handleSubmit(onSubmit)}
                onKeyDown={event => {
                    console.log('show key', event.key)
                    if (event.key === "Escape") {
                        closeModal();
                    }
                }}  >
             {block && <div className="loading1">Loading&#8230;</div>}
               
                <Modal backdrop="static" isOpen={shows} toggle={() => setShows(false)} className='modal-dialog-centered modal-sm'>

                    <div className='modal-header'>
                        <h2 className='modal-title  w-100 text-center'>{Heading ? Heading : 'Delete'}</h2>
                        <div className='modal-actions'>
                            <a onClick={() => closeModal()} className='text-body'>
                                <X size={14} />
                            </a>
                        </div>

                    </div>

                    <hr style={{ margin: "0px" }}></hr>
                    <ModalBody>
                        <Row tag='form' className='gy-1 pt-75' >
                            <Row className='mt-1'>
                                <div className='d-flex align-items-center'></div>
                                <Col md="6">
                                    <Label className='form-label mb-1' >
                                        From
                                    </Label>

                                    <Select
                                        // styles={preventOverflow}
                                        id="fromedate"
                                        label="Section"
                                        placeholder={DROPDOWN_PLACEHOLDER}
                                        // // styles={customStyles}
                                        maxMenuHeight="120px"
                                        pageSize={10}
                                        isClearable={false}
                                        theme={selectThemeColors}
                                        closeMenuOnSelect={true}
                                        components={animatedComponents}
                                        value={finFromYear}
                                        // // imdulti
                                        options={panDataFrom}
                                        className="basic-multi-select"
                                        classNamePrefix='select'
                                        onChange={selectFromYear}
                                    />
                                    <p className="text-danger mt-1">
                                        {errorMsgFrom}
                                    </p>
                                </Col>

                                <Col md="6">
                                    <Label className='form-label mb-1' >
                                        To
                                    </Label>
                                    <Select
                                        id="todate"
                                        placeholder={DROPDOWN_PLACEHOLDER}
                                        isClearable={false}
                                        theme={selectThemeColors}
                                        closeMenuOnSelect={true}
                                        maxMenuHeight="120px"
                                        components={animatedComponents}
                                        // // isMulti
                                        // // isDisabled={!(finFromYear && finToYear)}
                                        options={panData}
                                        className="basic-multi-select"
                                        classNamePrefix='select'
                                        onChange={selectFromMonth}
                                        value={monthFrom}
                                    />
                                    <p className="text-danger mt-1">
                                        {errorMsgTo}
                                    </p>

                                </Col>
                            </Row>
                            <Col>
                                <div className='d-flex align-items-center mb-1 '>
                                    <div>
                                        <Input type='checkbox'
                                            onChange={handleCheck}
                                            checked={check1}
                                            id='danger-checkbox'
                                            className='form-check-input' 
                                            name='billing-switch' />

                                    </div>
                                    <Label size="small" className='ms-1' >
                                        Select document date</Label>
                                </div>
                            </Col>
                            <Row>
                                <Col md="6" >
                                    <Label className='mb-1' >
                                        From Date
                                    </Label>

                                    <Flatpickr
                                        value={fromDate}
                                        disabled={!check1}
                                        id='startDate'
                                        name='startDate'
                                       
                                        className={disableTextBoxClass}
                                        onChange={(date, i) => {
                                            setFromDate(i)
                                            setErrorMsgFromDate("");
                                        }}
                                        options={{
                                            minDate: "01-07-2017",
                                            dateFormat: 'd-m-Y',
                                            // mode: 'range',
                                            // defaultDate: ['2020-02-01', '2020-02-15']
                                        }}
                                    />
                                    <p className="text-danger mt-1">
                                        {errorMsgFromDate}
                                    </p>

                                </Col>
                                <Col md="6" >
                                    <Label className=' mb-1' >
                                        To Date
                                    </Label>
                                    <Flatpickr
                                        value={toDate}
                                        disabled={!check1 || !fromDate}
                                        id='endDate'
                                        name='endDate'
                                        className={disableTextBoxClass}
                                        onChange={(date, i) => {
                                            setToDate(i)
                                            setErrorMsgToDate("");
                                        }}
                                        options={{
                                            minDate: fromDate,
                                            dateFormat: 'd-m-Y',
                                            // mode: 'range',
                                            // defaultDate: ['2020-02-01', '2020-02-15']
                                        }}
                                    />
                                    <p className="text-danger mt-1">
                                        {errorMsgToDate}
                                    </p>
                                </Col>
                            </Row>

                            <Col xs={12} className='text-center mt-2 pt-50'>
                                <Button type='submit'
                                    className='me-1'
                                    outline
                                    color='danger'
                                >
                                    Submit
                                </Button>
                                <Button type='reset' color='secondary' outline onClick={closeModal}>
                                    Cancel
                                </Button>
                            </Col>
                        </Row>
                    </ModalBody>
                </Modal>            
            </Form>
            {/* {srcLoad && <div
                style={{ display: 'none' }}
            >
                <iframe
                    src={`${API_URL_GSTR}/api/gstr1-filed/export?UserClientId=${clientId}&FromRange=${finFromYear.value}&ToRange=${monthFrom.value}&DocumnetFromDate=${fromDate}&DocumentToDate=${toDate}&GSTR1SectionId=0&t=${token}`}
                    title="Example Iframe"
                />
            </div>} */}
        </Fragment>
    );
}

export default GSTR1FiledExpDataModel;