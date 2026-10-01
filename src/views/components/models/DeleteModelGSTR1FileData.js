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
// ** Utils
import { selectThemeColors } from '@utils'
// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'
import { DROPDOWN_PLACEHOLDER, SELECT_MAXSIZE } from '../../../configs/config'
import errorCodeConfig from '../../../configs/apiErrorCodeConfig';
import makeAnimated from 'react-select/animated'
import purchaseInvoiceService from '../../../services/Reco/Purchase/purchaseInvoiceService'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'
import {
    X
} from 'react-feather'
// import gstr1PurchaseInvoiceService from '../../../services/gstr1/gstr1Services.js/gstr1PurchaseInvoiceService'
import gstr1PurchaseInvoiceService from '../../../services/gstr1/gstr1Services/gstr1PurchaseInvoiceService'
import GSTR1FileDataAPIService from '../../../services/gstr1/gstr1DataFileService/gstr1FileDataService'

import { globleVariable} from '../../../configs/globalVariable';
import LocalFunction from '../../../configs/getLocalFunction';
import SessionFunction from '../../../configs/getSessionFunction';

const animatedComponents = makeAnimated()


function DeleteModelGSTR1FileData({ Heading, SuccessButtonText, toggleCompose }) {
    //Getting financial year list from localstorage.

    // const finYearOption = localStorage.getItem("rangeFilters");
    // const YearList = JSON.parse(finYearOption)
     const finYearOption = LocalFunction.getLocalValue(globleVariable.rangeFilters, true);
    const YearList = JSON.parse(finYearOption)
    const G_UCParId = SessionFunction.getSessionValue(globleVariable.G_UCParId , true);
    const userIds = LocalFunction.getLocalValue(globleVariable.userId , true);



    // ** Hooks
    const {
        control,
        handleSubmit,
        formState: { errors },
        clearErrors,
    } = useForm()



    // const [mailFormData, setMailFormData] = useState(GSTR1SelectOptionsList);
    const [loading, setLoading] = useState(true);
    const [isCheckedMail, setIsCheckedMail] = useState();
    const [allCheckedMail, setAllCheckedMail] = useState(true);

    const [checkeddata, setData] = useState([]);
    const [shows, setShows] = useState(true)
    const [financialYearList, setFinancialYearList] = useState([]);
    const [selectedYear, setSelectedYear] = useState(null);
    const [block, setBlock] = useState(false)


    useEffect(() => {
        const frData = YearList?.filter((item) => item.value == sessionStorage.getItem(globleVariable.gstr1FromDt))[0];
       
        if (frData !== undefined) {
            setSelectedYear(frData)
        }
    }, [])


    // ** delete modal - select all click checkbox
    const handleAllCheck = e => {

        setAllCheckedMail(e.target.checked);
    };

    useEffect(() => {
        if (!loading) {
            setIsCheckedMail(current => {
                const nextIsChecked = {}
                Object.keys(current).forEach(key => {
                    nextIsChecked[key] = allCheckedMail;
                })
                return nextIsChecked;
            });
        }
    }, [allCheckedMail, loading]);

    // ** delete modal - single click checkbox
    const handleSingleCheck = (item, e) => {
        setIsCheckedMail({ ...isCheckedMail, [e.target.name]: e.target.checked });
    };

   

    useEffect(() => {
        gstr1checkdatalist();
       
    }, [])


    const gstr1checkdatalist = () => {
        setBlock(true);
        gstr1PurchaseInvoiceService.getgstr1checkdata().then(res => {
            if (res.status === 200 && res.data.status === errorCodeConfig.APIDefaultCode.Success) {
                setBlock(false)
                setData(res.data.data.sectionList)
                console.log(res.data.data.sectionList, "checkdata")
                console.log(res.data.data.sectionList[0], "checkdata1")

                if (res.data.data.sectionList.length > 0) {
                    const initialIsChecked = res?.data?.data?.sectionList?.reduce((acc, d) => {
                        console.log("initial checked1=", acc);
                        console.log("initial checked2=", d);

                        acc[d.value] = true;
                        return acc;
                    }, {})
                    setIsCheckedMail(initialIsChecked)
                    console.log("initial checked3=", initialIsChecked);

                }

                setLoading(false)
            }

        })
    }



    const onSubmit = data => {
        // setBlock(true);
        clearErrors();
        setShows(false)
        console.log("data delete");
        console.log(data);

        const itemList = Object.keys(isCheckedMail).map((key) => {
            if (isCheckedMail[key] === true) {
                return key;
            }
        }).filter(p => p !== null && p !== "" && p !== undefined);

        console.log(itemList)
        console.log("selectedYear --- now")

        console.log(selectedYear)


        const payload = {

            "deleteRange": selectedYear?.value,
            "userClientId":G_UCParId ,
            "userId": userIds,
            "sectionId": itemList,
        }

        console.log(payload);
        GSTR1FileDataAPIService.gstr1delete(payload).then(res => {
            setBlock(false);
            if (res.status === 200 && res.data.status === errorCodeConfig.APIDefaultCode.Success) {
                toast.success(res.data.successMessage, {
                    position: "top-right",
                });
                toggleCompose();
            }
            else {
                Swal.fire({
                    icon: 'error',
                    title: '',
                    text: res?.data?.errorMessage,
                    customClass: {
                        confirmButton: 'btn btn-danger'
                    },
                    buttonsStyling: false
                })

                toggleCompose();
            }

        }).catch(error => {
            setBlock(false);
            Swal.fire({
                icon: 'error',
                title: '',
                text: error?.message,
                customClass: {
                    confirmButton: 'btn btn-danger'
                },
                buttonsStyling: false
            })

            toggleCompose();
        });
    }

    // Modal close
    const closeModal = () => {
        clearErrors();
        setShows(false)
        toggleCompose();
    }

    useEffect(() => {

        setFinancialYearList(YearList);
    }, [])

    // ** select option
    const selectFromYear = (value) => {
        setSelectedYear(value);
    }


    return (

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

                {/* <ModalHeader className='bg-transparent d-inline-block' onClick={() => closeModal}>
                    <div className='text-center'>
                        <h1 className='text-danger'>{Heading ? Heading : 'Delete'}</h1>
                    </div>
                </ModalHeader> */}
                <hr style={{ margin: "0px" }}></hr>
                <ModalBody>

                    <div style={{ width: '33%' }} >
                        <div className='form-check form-check-danger'>
                            <label className="checkbox-inline">
                                <Input
                                    // key={i}
                                    type="checkbox"
                                    // name={item.value}
                                    name="checkall"
                                    checked={allCheckedMail}
                                    onChange={handleAllCheck}
                                />
                                <span>  <b>All</b> </span>

                            </label>
                        </div>
                    </div>
                    <Row tag='form' className='gy-1 pt-75' >

                        {!loading ? checkeddata && checkeddata.map((item, i) => {
                            return (

                                <div style={{ width: '33%' }} >

                                    <div className='form-check form-check-danger' >
                                        <label className="checkbox-inline">
                                            <Input
                                                key={i}
                                                type="checkbox"
                                                name={item.value}
                                                checked={isCheckedMail[item.value]}
                                                onChange={(e) => handleSingleCheck(item, e)}
                                            />
                                            <span>  <b>{item.label}</b> </span>

                                        </label>
                                    </div>

                                </div>
                            )
                        }
                        ) : ""
                        }
                        <Row>
                            <Col xs={3}>
                            </Col>
                            <Col xs={6}>
                                <Label className='form-label mt-2' for='status'>
                                    <b>Return Period</b>
                                </Label>
                                <Select
                                    id="purchaseId_invtype"
                                    placeholder={DROPDOWN_PLACEHOLDER}
                                    maxMenuHeight={SELECT_MAXSIZE}
                                    isClearable={false}
                                    theme={selectThemeColors}
                                    closeMenuOnSelect={true}
                                    components={animatedComponents}
                                    options={financialYearList}
                                    className="basic-multi-select"
                                    classNamePrefix='select'
                                    // defaultValue={}
                                    value={selectedYear}
                                    onChange={selectFromYear}
                                />
                            </Col>
                            <Col xs={12} className='text-center mt-2 pt-50'>
                                <Button type='submit'
                                    className='me-1'
                                    outline
                                    color='danger'
                                >
                                    {SuccessButtonText ? SuccessButtonText : 'Submit'}
                                </Button>
                                <Button type='reset' color='secondary' outline onClick={closeModal}>
                                    Cancel
                                </Button>
                            </Col>
                        </Row>
                    </Row>

                </ModalBody>

            </Modal>
        </Form>
    );
}

export default DeleteModelGSTR1FileData;