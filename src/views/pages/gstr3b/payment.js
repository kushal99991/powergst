// ** React Imports
import { Fragment, useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

// ** Spinner (Splash Screen)
import Spinner from './../../../@core/components/spinner/Loading-spinner'
import encryptData from '../../../auth/crypto/crypto';
import { onSnapshot, collection, getDocs, deleteDoc } from "@firebase/firestore"
import db from "../../../firebase/firebase"
import { doc } from 'firebase/firestore';
import { deleteNotification } from '../../apps/user/store'
import { useDispatch, useSelector } from 'react-redux'

// ** Styles
import '@styles/react/libs/tables/react-dataTable-component.scss'
// ** Third Party Components
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import toast from 'react-hot-toast'
import {
    FilePlus
} from 'react-feather'
import { urlEndpointConfig } from "@configs/urlEndpoint";
// ** Reactstrap Imports
import {
    Row,
    Col,
    Card,
    Input,
    Label,
    Button,
    Modal,
    ModalBody,
    CardTitle,
    CardHeader,
    CardText,
    Tooltip,
    UncontrolledTooltip,
    CardBody,
    Progress,
    TabContent, TabPane, Table
} from 'reactstrap'
import GSTR3Services from "../../../services/gstr3b/gstr3bService"
//** Error Code file
import errorCodeConfig from '../../../configs/apiErrorCodeConfig'
// ** Custom Components
import Breadcrumbs from '@components/breadcrumbs'
// import PruchaseTypesModal from './purchase-list-modal'

//** Handsontable
import { HotTable, HotColumn } from "@handsontable/react";
import Handsontable from 'handsontable';
import { registerRenderer, textRenderer } from 'handsontable/renderers';
import { registerAllModules } from 'handsontable/registry';
import { LINK_MESSAGE, keysMap, enableOnFormTags } from '../../../configs/config'

// ** Utils
import Select from 'react-select' // eslint-disable-line
import { selectThemeColors } from '@utils'
import makeAnimated from 'react-select/animated'
import { SELECT_MAXSIZE ,RowSize, columnHeaderSize} from '../../../configs/config'
import DeleteModel from '../../components/models/DeleteModel'
import PaymentTabs from "./paymentTabs"
import { useHotkeys } from 'react-hotkeys-hook';
import { globleVariable } from '../../../configs/globalVariable'
import LocalFunction from '../../../configs/getLocalFunction'
import SessionFunction from '../../../configs/getSessionFunction'

const MySwal = withReactContent(Swal);
const animatedComponents = makeAnimated()

// ** Import Dropdown list
const ImportButtonList = [
    { id: '1', name: 'Import Excel' },
]

const pageCount = 0;

// ** Range wise year
const finYearOption = LocalFunction.getLocalValue(globleVariable.rangeFilters, true);
const YearList = finYearOption !== undefined && finYearOption !== null && finYearOption !== "" && finYearOption !== 'undefined' ? JSON.parse(finYearOption) : []

registerAllModules();

const PaymentPage = () => {
    // ** Hooks
    const [block, setBlock] = useState(false)
    const [modalshow, setModalshow] = useState(false);

    // ** Progress modal
    const [progressModal, setProgressModal] = useState(false);
    const [count, setCount] = useState(0);
    const [count1, setCount1] = useState(0);

    //** File
    const [fileName, setFileName] = useState('');
    const [fileSize, setFileSize] = useState('');
    const [fileYear, setFileYear] = useState('');
    const [progressMessage, setProgressMessage] = useState('');

    // ** Delete
    const [deleteModalshow, setDeleteModalshow] = useState(false)
    const [data, setData] = useState([])

    const [typeOfInv, setTypeofInv] = useState([])
    const [finFromYear, setFinFormYear] = useState(null);
    const [panData, setPanData] = useState([]);
    const [monthFrom, setMonthFrom] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');
    const [displayType, setDisplayType] = useState(false)
    const [search, setSearch] = useState(false);
    const [switchOn, setSwitchOn] = useState(false);
    const [panDataFrom, setPanDataFrom] = useState([]);
    const [tooltipOpen, setTooltipOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('1')
    const [paymentPageDetails, setPaymentPageDetails] = useState([])
    const [errorArr, setErrorArr] = useState([]);

    // ** Session
    const data1 = LocalFunction.getLocalValue(globleVariable.userId, true) ? LocalFunction.getLocalValue(globleVariable.userId, true) : " "

    //** Shortcut keys
    useHotkeys(keysMap.DELETE_DATA, () => { block == false && HideShowDeleteModel() }, { enableOnFormTags });
    useHotkeys(keysMap.ADD_INVOICE, () => { block == false && invModalOpen() }, { enableOnFormTags });


    const G_UCParId = sessionStorage.getItem(globleVariable.G_UCParId) && SessionFunction.getSessionValue(globleVariable.G_UCParId, true)
    const G_GSTIN = sessionStorage.getItem(globleVariable.G_GSTIN) && SessionFunction.getSessionValue(globleVariable.G_GSTIN, true)
    const gstr3BToDt = sessionStorage.getItem(globleVariable.gstr3BToDt) && SessionFunction.getSessionValue(globleVariable.gstr3BToDt, true)

    // ** Navigate
    const navigate = useNavigate();
    const hotRef = useRef(null);



    // ** From and To Year list
    useEffect(() => {
        setPanData(YearList)
        setPanDataFrom(YearList)
        setDisplayType(true);
    }, [])

    // ** Firestore
    useEffect(() =>
        onSnapshot(doc(db, "GSTR3BImportExcelProgress", data1), (doc) => {
            console.log("new firestore changes1", doc?.data());
            if (doc?.data()) {
                console.log("progress data=", doc?.data()?.name)
                setCount(doc?.data()?.name)
                const newValue = doc?.data()?.name
                const count11 = newValue?.split('/');
                setCount1(count11);

            } else {
                setCount(0)
                // setNotification([])
            }
        }),

        []
    );

    // ** Firestore
    useEffect(() =>
        onSnapshot(doc(db, "GSTR3BImportExcelProgressMessage", data1), (doc) => {
            console.log("new firestore changes1", doc?.data());
            if (doc?.data()) {
                console.log("progress data=", doc?.data()?.name)
                // setCount(doc?.data()?.GSTR3BImportExcelProgress)
                setProgressMessage(doc?.data()?.name)
                // setNotification([doc.data()])
            } else {
                setCount(0)
                // setNotification([])
            }
        }),

        []
    );

    // ** OnClick  event - Firestore
    const handleFireStore = (value) => {
        setSwitchOn(value)
        setCount1(0);
        setCount(0);
        setProgressMessage('');
        // debugger
    }

    // ** format Bytes
    function formatBytes(bytes, decimals = 2) {
        if (!+bytes) return '0 Bytes'

        const k = 1024
        const dm = decimals < 0 ? 0 : decimals
        const sizes = ['Bytes', 'KB', 'MB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']

        const i = Math.floor(Math.log(bytes) / Math.log(k))
        // alert(`${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`)
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
    }

    const paymentTheader = (col, TH) => {
        console.log(col, "college")
        if (col > 1 && col !== 1) {
            TH.className = 'htRight'
        }
        else if (col == 0) {
            TH.className = 'htLeft'
        }
    }
    // ** To Month selection
    const selectFromMonth = (value) => {
        setErrorMsg('');
        setMonthFrom(value);
        // sessionStorage.setItem('gstr3bToDt', value?.value)
        SessionFunction.setSessionValue(globleVariable.gstr3BToDt, value?.value, true)
    }

    // ** Display for loading
    useEffect(() => {
        return () => setBlock(false)
    }, [])

    // ** Set From and to Date by session
    useEffect(() => {
        console.log('default value');
        if (displayType == true) {
            let defaultValueFrom = null;
            let defaultValueTo = null;


            if (gstr3BToDt !== null && gstr3BToDt !== "" && gstr3BToDt !== undefined) {
                defaultValueTo = panData?.filter((item) => item.value == gstr3BToDt)[0];
            } else {
                defaultValueTo = panData?.filter((item) => Number(item.value) == Number(SessionFunction.getSessionValue(globleVariable.defaultYear, true)))[0];
            }
            if (defaultValueTo !== undefined && defaultValueTo !== null && defaultValueTo !== "") {
                setMonthFrom(defaultValueTo)
                // sessionStorage.setItem('gstr3bToDt', defaultValueTo?.value)
                SessionFunction.setSessionValue(globleVariable.gstr3BToDt, defaultValueTo?.value, true)

            }

            setSearch(true)

        }

    }, [displayType])

    // ** Check select company
    useEffect(() => {
        console.log("is company login", sessionStorage.getItem("isCompany"))
        if (sessionStorage.getItem("isCompany") == false || sessionStorage.getItem("isCompany") == "false") {
            toast.error(LINK_MESSAGE, {
                position: "top-right",
            });
            setTimeout(() => {
                navigate("/dashboard/company")
            }, 1000);
        }
    }, [])

    // ** Search
    useEffect(() => {
        if (!deleteModalshow && search) {
            PurchaseSummaryService();
            // document.getElementById('btnDeletePurchase').blur();
        }
    }, [search, deleteModalshow, monthFrom])

    // ** toggle Compose
    const toggleCompose = () => setDeleteModalshow(!deleteModalshow)

    // ** Search
    const PurchaseSummaryService = () => {
        setBlock(true)
        GSTR3Services.getAllDataPaymentPage(G_UCParId, gstr3BToDt, gstr3BToDt).then(res => {
            if (res.status === 200 && res.data.status === errorCodeConfig.APIDefaultCode.Success) {
                setBlock(false)
                setPaymentPageDetails(res?.data?.data)
                // toast.success(res.data.successMessage, {
                //     position: "top-right",
                //   });

            } else {
                setBlock(false)
                toast.error(res?.data?.errorMessage, {
                    position: "top-right",
                });
            }
        }).catch(error => {
            setBlock(false)
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

    // ** Modal show/Hide
    const invModalOpen = () => {
        // document.getElementById('btnNewPurchase').blur();
        setModalshow(!modalshow);
    }

    // ** Toggle show/hide
    const toggleModal = () => setModalshow(!modalshow)

    // ** Delete Modal Show/Hide
    const HideShowDeleteModel = () => {
        setDeleteModalshow(!deleteModalshow)
        // document.getElementById('btnDeletePurchase').blur();
    }

    // ** Column
    const handsontableColumns = [
        {
            data: "details",
            readOnly: true,
            title: 'Details',
            width: 300,
            // colspan:3


        },
        {
            data: "additonalSubDetails",
            width: 150,
            readOnly: true
        },

        {
            data: "totalTaxableValue",
            readOnly: false,
            title: 'Total Taxable value (₹)',
            type: "numeric",
            numericFormat: {
                pattern: '0.00'
            },
        },
        {
            data: "igst",
            readOnly: false,
            title: 'IGST (₹)',
            type: "numeric",
            numericFormat: {
                pattern: '0.00'
            },
        },
        {
            data: "cgst",
            readOnly: false,
            title: 'CGST (₹)',
            type: "numeric",
            numericFormat: {
                pattern: '0.00'
            },
        },
        {
            data: "sgst",
            readOnly: false,
            title: 'SGST (₹)',
            type: "numeric",
            numericFormat: {
                pattern: '0.00'
            },
        },
        {
            data: "cess",
            readOnly: false,
            title: 'CESS (₹)',
            type: "numeric",
            numericFormat: {
                pattern: '0.00'
            },
        }
    ]




    // **  localAfterOnCellMouseDown
    function localAfterOnCellMouseDown(event, coords, td) {
        const hot = hotRef?.current?.hotInstance;

        if (coords.row !== -1 && coords.col < 1) {
            const typeofInvoiceId = hot.getDataAtRow(coords.row)[6];
            const encrypData = encryptData.encrypt(typeofInvoiceId)

            let arrTypes = [];
            console.log(data)
            data.filter(obj => obj.typeofInvoiceId == 7 || obj.typeofInvoiceId == 8).map(item => (
                arrTypes.push({
                    'value': item.typeofInvoiceId,
                    'label': item.typeofInvoice
                })
            ))

        }
    }

    // ** Loading
    const loadFunction = (value, fileName, selectedYear) => {
        setProgressModal(value);
        handleFireStore(false);

        fileName?.name ? setFileName(fileName?.name) : setFileName('')
        fileName?.size ? setFileSize(formatBytes(fileName?.size)) : setFileSize('')
        selectedYear ? setFileYear(selectedYear) : setFileYear('')
        fileName && formatBytes(fileName?.size)
    }

    // ** Loading Export
    const loadFunctionExport = (value, fileName, selectedYear) => {
        setBlock(value);
    }

    const toggleTab = (tab) => {
        console.log(tab, "tabbb")
        setActiveTab(tab)
    }

    const cellChange = (change, source) => {

        if (source === 'CopyPaste.paste' || source === 'edit' || source === 'Autofill.fill') {

            const hot = hotRef?.current?.hotInstance;
            let withoutErrArr = []
            for (let i = 0; i < change.length; i++) {
                const [row, col, , value] = change[i]; // Get the edited cell value
                const colIndex = handsontableColumns.findIndex((obj) => obj.data === col)

                if (colIndex > 1) {
                    const oldVal = change[i][2]
                    const cellObj = {
                        row: row,
                        col: colIndex,
                        validationMsg: 'Error In Cell.'
                    }
                    // Check if the edited value is numeric
                    console.log(value, "valueValue")
                    console.log(typeof (value), "valueValue")
                    if (isNaN(value)) {
                        //   console.log(value,"valueValue")
                        cellObj.validationMsg = "Only Numeric Value Allowed"
                        setErrorArr(pre => [...pre, cellObj])
                    }
                    else if ((value === null && (oldVal !== undefined && oldVal !== null || oldVal === null)) || value === "") {
                        if (value !== 0) {

                            cellObj.validationMsg = "Empty Value not Allowed"
                            setErrorArr(pre => [...pre, cellObj])
                        }
                    }
                    else {
                        if (errorArr.findIndex(y => y.row == cellObj.row && y.col == cellObj.col) != -1) {
                            withoutErrArr.push(cellObj)
                        }

                    }
                }

            }

            if (withoutErrArr.length > 0) {
                const withErrArr = errorArr
                const filteredArr = withErrArr.filter(itemX => !withoutErrArr.some(itemY =>
                    itemY.row === itemX.row && itemY.col === itemX.col && itemY.tab === itemX.tab
                ));
                setErrorArr(filteredArr)
            }
        }
    }

    console.log(errorArr, "ErrorArrr")

    const onClickSaveButtonOfPaymentPage = () => {
        let errorArray = [];
        debugger;
        errorArr && errorArr.sort((a, b) => a.table > b.table ? 1 : -1).map((err) => {
            var val = paymentPageDetails[err.row][handsontableColumns[err.col].data]
            debugger;
            if (isNaN(val) || val == null || val == "") {
                errorArray.push({
                    rowNo: err.row,
                    validationMsg: err.validationMsg
                });
            }


        })
        if (errorArray.length > 0) {
            return MySwal.fire({
                title: "<strong>Error</strong>",
                icon: "error",
                html: <ErrorTable errorDataList={errorArray}></ErrorTable>,
                customClass: {
                    confirmButton: "btn btn-danger",
                },
                buttonsStyling: false,
                width: 600,
            });
        }
        else {
            var paymentOfPageRowData = paymentPageDetails;
            if (paymentOfPageRowData != null && paymentOfPageRowData.length > 0) {
                for (var x = 0; x < paymentOfPageRowData.length; x++) {
                    paymentOfPageRowData[x].igst = paymentOfPageRowData[x].igst ?  String(paymentOfPageRowData[x].igst) : null
                    paymentOfPageRowData[x].cgst =paymentOfPageRowData[x].cgst ?  String(paymentOfPageRowData[x].cgst) : null
                    paymentOfPageRowData[x].sgst = paymentOfPageRowData[x].sgst ?  String(paymentOfPageRowData[x].sgst) : null
                    paymentOfPageRowData[x].cess = paymentOfPageRowData[x].cess ? String(paymentOfPageRowData[x].cess) : null
                    paymentOfPageRowData[x].totalTaxableValue =paymentOfPageRowData[x].totalTaxableValue ?  String(paymentOfPageRowData[x].totalTaxableValue) : null
                }
            }


            setBlock(true)
            console.log("Just Created Page")
            const payLoad = {
                userClientId: G_UCParId,
                range: gstr3BToDt,
                gstin: G_GSTIN,
                userId: data1,
                paymentOfPageData: paymentOfPageRowData
            };
            GSTR3Services.gstr3bSavePaymentPage(payLoad)
                .then((res) => {
                    if (res?.status === 200 && res.data.status === errorCodeConfig.APIDefaultCode.Success) {
                        setBlock(false)
                        toast.success(res.data.successMessage, {
                            position: "top-right",
                        });
                        setTimeout(() => {
                            PurchaseSummaryService()
                        }, 2000)


                    }
                    else {
                        setBlock(false)
                        Swal.fire({
                            icon: "error",
                            title: "",
                            text: res?.data?.errorMessage || res?.data?.title,
                            customClass: {
                                confirmButton: "btn btn-danger",
                            },
                            buttonsStyling: false,
                        });
                    }

                }).catch((error) => {
                    Swal.fire({
                        icon: "error",
                        title: "",
                        text: error?.message,
                        customClass: {
                            confirmButton: "btn btn-danger",
                        },
                        buttonsStyling: false,
                    });
                })
        }

    }

    const arr = [
        {
            details: "1. Tax payable other then reverse charge and Supplies u/s 9(5)",
            totalTaxableValue: "0.00",
            igst: "0.00",
            cgst: "0.00",
            sgst: "0.00",
            cess: "0.00",
        }, {
            details: "Paid Through ITC"
        },
        {
            additonalSubDetails: "2. Integrated tax- IGST",
            totalTaxableValue: "0.00",
            igst: "0.00",
            cgst: "0.00",
            sgst: "0.00",
            cess: "0.00",

        },
        {
            additonalSubDetails: "3. Central Tax- CGST",
            totalTaxableValue: "0.00",
            igst: "0.00",
            cgst: "0.00",
            sgst: "0.00",
            cess: "0.00",

        },
        {
            additonalSubDetails: "4. State/UT tax",
            totalTaxableValue: "0.00",
            igst: "0.00",
            cgst: "0.00",
            sgst: "0.00",
            cess: "0.00",

        },
        {
            additonalSubDetails: "5. CESS",
            totalTaxableValue: "0.00",
            igst: "0.00",
            cgst: "0.00",
            sgst: "0.00",
            cess: "0.00",

        },
        {
            details: "6. Other than reverse charge Tax to be paid in Cash (1-2-3-4-5)",
            totalTaxableValue: "0.00",
            igst: "0.00",
            cgst: "0.00",
            sgst: "0.00",
            cess: "0.00"
        },
        {
            details: "7. Tax Payable for supplies u/s 9(5)",
            totalTaxableValue: "0.00",
            igst: "0.00",
            cgst: "0.00",
            sgst: "0.00",
            cess: "0.00"
        },
        {
            details: "8. Tax to be paid in cash for supplies u/s 9(5)",
            totalTaxableValue: "0.00",
            igst: "0.00",
            cgst: "0.00",
            sgst: "0.00",
            cess: "0.00"
        },
        {
            details: "9. Reverse charge payable",
            totalTaxableValue: "0.00",
            igst: "0.00",
            cgst: "0.00",
            sgst: "0.00",
            cess: "0.00"
        }, {
            details: "10. Reverse charge tax to be paid in cash",
            totalTaxableValue: "0.00",
            igst: "0.00",
            cgst: "0.00",
            sgst: "0.00",
            cess: "0.00"
        },
        {
            details: "11. Interest Payable",
            totalTaxableValue: "0.00",
            igst: "0.00",
            cgst: "0.00",
            sgst: "0.00",
            cess: "0.00"
        }, {
            details: "12. Interest to be paid in cash",
            totalTaxableValue: "0.00",
            igst: "0.00",
            cgst: "0.00",
            sgst: "0.00",
            cess: "0.00"
        },
        {
            details: "13. Late fee payable",
            totalTaxableValue: "0.00",
            igst: "0.00",
            cgst: "0.00",
            sgst: "0.00",
            cess: "0.00"
        },
        {
            details: "14. Late fee to be paid in cash",
            totalTaxableValue: "0.00",
            igst: "0.00",
            cgst: "0.00",
            sgst: "0.00",
            cess: "0.00"
        },
        {
            details: "15. Utilizable cash balance",
            totalTaxableValue: "0.00",
            igst: "0.00",
            cgst: "0.00",
            sgst: "0.00",
            cess: "0.00"
        },
        {

            details: "16. Additional cash required",
            totalTaxableValue: "0.00",
            igst: "0.00",
            cgst: "0.00",
            sgst: "0.00",
            cess: "0.00"
        }
    ]

    return (
        <Fragment>
            {block && <div className="loading1">Loading&#8230;</div>}
            <div className='content-header row py-1'>
                <div className='content-header-left col-md-8 col-12'>
                    <div className='row breadcrumbs-top'>
                        <div className='col-12'>
                            <Breadcrumbs title='Purchase Summary' data={[{ title: 'GST Returns',link: urlEndpointConfig.GSTR_All }, { title: 'GSTR-3B Summary', link: '/gst-returns/gstr3b' }, { title: 'Payment Page' }]} />
                        </div>
                    </div>
                </div>
                <div className='content-header-right text-md-end col-md-4 col-12 d-md-block d-none'>
                    <Button className='btn-icon me-1' outline color='danger' id="btnSaveGSTR3B"
                        onClick={onClickSaveButtonOfPaymentPage}
                    // disabled={errorArr.length>0}
                    >
                        <FilePlus size={14} />
                        <span className="align-middle ms-50"> Save </span>
                    </Button>
                    <UncontrolledTooltip placement='top' target='btnSaveGSTR3B'>
                        Save [Shortcut: {keysMap.SAVE_DATA} ]
                    </UncontrolledTooltip>
                </div>
            </div>
            {/* First Table Details */}
            <div className='content-header-left col-md-12 col-12'>

                <div className='row breadcrumbs-top mb-1'>
                    <div className='col-md-6'>
                    </div>
                    <div className="col-md-6">
                    <div className="row">
                    <div className='col-md-12'>
                        <div className='row'>
                        <div className="col-md-5"></div>
                            <Label className='form-label col-md-4 pt-half text-end' >
                                Select Return Period
                            </Label>
                            <Select
                                id="to"
                                placeholder="To"
                                isClearable={false}
                                theme={selectThemeColors}
                                closeMenuOnSelect={true}
                                options={panData}
                                components={animatedComponents}
                                className="basic-multi-select col-md-3 ps-0"
                                classNamePrefix='select'
                                onChange={selectFromMonth}
                                value={monthFrom}
                                maxMenuHeight={SELECT_MAXSIZE}
                            />
                        </div>
                    </div>
                </div>
            </div>
            </div>
            </div>
            <div>
                <Card>
                    <CardBody className="CardBody p-0">

                        <div>
                            <Row>
                                <Col md={12}>
                                    {paymentPageDetails?.length > 0 ? <HotTable
                                        // data={data}
                                        rowHeights={RowSize}
                                        columnHeaderHeight={columnHeaderSize}
                                        data={paymentPageDetails}
                                        autoColumnSize={true}
                                        stretchH='all'
                                        preventOverflow="horizontal"
                                        columns={handsontableColumns}
                                        contextMenu={false}
                                        bindRowsWithHeaders={true}
                                        licenseKey="non-commercial-and-evaluation"
                                        height="auto"
                                        ref={hotRef}
                                        afterGetColHeader={paymentTheader}
                                        afterChange={cellChange}
                                        beforeKeyDown={function (e, col) {
                                            // Delete and Backspace , copy and paste

                                            if (
                                                e.keyCode == 8 ||
                                                e.keyCode == 46 ||
                                                e.keyCode == 67 ||
                                                e.keyCode == 86
                                            ) {
                                            } else {
                                                var reg = /^[0-9.]+|[\b]+$/;
                                                let col = this?.getSelectedLast()[1];
                                                if (
                                                    col == 1 ||
                                                    col == 2 ||
                                                    col == 3 ||
                                                    col == 4 ||
                                                    col == 5 ||
                                                    col == 6
                                                ) {
                                                    if (!reg.test(e.key)) {
                                                        e.preventDefault();
                                                    }
                                                }
                                            }
                                        }}
                                        afterOnCellMouseDown={localAfterOnCellMouseDown}
                                        mergeCells={[{ row: 1, col: 0, rowspan: 5, colspan: 1 }, { row: 0, col: 0, rowspan: 1, colspan: 2 }, { row: 6, col: 0, rowspan: 1, colspan: 2 }, { row: 7, col: 0, rowspan: 1, colspan: 2 }, { row: 8, col: 0, rowspan: 1, colspan: 2 }, { row: 9, col: 0, rowspan: 1, colspan: 2 }, { row: 10, col: 0, rowspan: 1, colspan: 2 }, { row: 11, col: 0, rowspan: 1, colspan: 2 }, { row: 12, col: 0, rowspan: 1, colspan: 2 }, { row: 13, col: 0, rowspan: 1, colspan: 2 }, { row: 14, col: 0, rowspan: 1, colspan: 2 }, { row: 15, col: 0, rowspan: 1, colspan: 2 }, { row: 16, col: 0, rowspan: 1, colspan: 2 }]}
                                        // mergeCells={arr? mergeCellsTest : false}
                                        cells={function (row, col) {

                                            var cp = {}
                                            const hot = hotRef?.current?.hotInstance;
                                            cp.className = 'child'
                                            data
                                            if (col > 1) {
                                                cp.className = 'text-end'
                                            }
                                            if (col == 0 && col == 1) {
                                                cp.className = "green"
                                            }
                                            if (row == 4 || row == 3 || row == 2 || row == 11 || row == 12) {
                                                if (col == 6) {
                                                    cp.className = "purchseCellDisable text-end"
                                                    cp.readOnly = true
                                                }
                                            }

                                            if (row == 5 || row == 3) {
                                                if (col == 5) {
                                                    cp.className = "purchseCellDisable text-end"
                                                    cp.readOnly = true
                                                }
                                            }

                                            if (row == 5 || row == 4) {
                                                if (col == 4) {
                                                    cp.className = "purchseCellDisable text-end"
                                                    cp.readOnly = true
                                                }
                                            }
                                            if (row == 11 || row == 12) {
                                                if (col == 3) {
                                                    cp.className = "purchseCellDisable text-end"
                                                    cp.readOnly = true
                                                }
                                            }
                                            if (row == 5) {
                                                if (col == 3) {
                                                    cp.className = "purchseCellDisable text-end"
                                                    cp.readOnly = true
                                                }
                                            }

                                            return cp
                                        }}
                                        hiddenRows={{
                                            rows: [1]
                                        }}
                                        afterRenderer={(TD, row, col, prop, value) => {
                                            if (col > 1 && (errorArr.findIndex(y => y.row == row && y.col == col) != -1)) {
                                                TD.style.backgroundColor = "red";
                                            }

                                        }}

                                        width="100%"
                                        nestedHeaders={[
                                            [{ label: "Details", colspan: 2 }, { label: "Total Taxable value (₹)", colspan: 0 }, { label: "IGST (₹)", colspan: 0 }, { label: "CGST (₹)", colspan: 0 }, { label: "SGST (₹)", colspan: 0 }, { label: "CESS (₹)", colspan: 0 }],

                                        ]}

                                        colWidths={100}

                                    /> : <HotTable
                                        mergeCells={[{ row: 0, col: 0, rowspan: 1, colspan: 7 }]}
                                        autoColumnSize={true}
                                        ref={hotRef}
                                        rowHeights={RowSize}
                                        columnHeaderHeight={columnHeaderSize}
                                        stretchH='all'
                                        style={{ overflowX: "hidden", textAlign: "center" }}
                                        data={[{ details: "No Data Found!" }]}
                                        preventOverflow="horizontal"
                                        columns={handsontableColumns}
                                        contextMenu={false}
                                        bindRowsWithHeaders={true}
                                        licenseKey="non-commercial-and-evaluation"
                                        height="auto"
                                        hiddenColumns={{
                                            columns: arr ? "" : [1]
                                        }}
                                    />}
                                </Col>
                            </Row>
                        </div>
                    </CardBody>
                </Card>
            </div>

            {
                modalshow && <PruchaseTypesModal typeOfInv={data} show={modalshow} toggleModal={toggleModal} frmType={'purSummary'} redirectType="purchase"></PruchaseTypesModal>
            }

            {
                deleteModalshow &&
                <DeleteModel
                    Heading='Delete Purchase Invoice'
                    SuccessButtonText='Delete'
                    show={deleteModalshow}
                    toggleCompose={toggleCompose}

                ></DeleteModel>
            }
            {<Modal
                backdrop="static"
                isOpen={progressModal}
                className={"modal-dialog-centered"}
            >
                <div className="modal-header">
                    <h2 className="modal-title w-100 text-center">
                        Import Excel Progress
                    </h2>
                </div>
                <ModalBody>
                    {true && <div className="center-progress">
                        <br />
                        <span className='mt-3'><b>File Name : </b>{fileName}</span>
                        <br />
                        <span className='mt-3'><b>File Size : </b>{fileSize} | <b>Fin Mon - Year : </b>{fileYear} </span>
                        <br />
                        <br />
                        <span className='mt-3'><b>{progressMessage !== null && progressMessage !== "" ? progressMessage : "Please wait..."}</b></span>
                        <br />
                        <br />
                        <Progress color='#fce4e4' value={(Number(count1[0]) * 100) / Number(count1[1])} />
                        <br />
                        <span>{count} sheets  completed  </span>
                    </div>}
                </ModalBody>
            </Modal>
            }

        </Fragment>
    )
}

function ErrorTable({ errorDataList }) {
    //   console.log(errorDataList , 'errorDataList')
    const uniqueArray = [];
    const keys = new Set();

    for (const obj of errorDataList) {
        const key = JSON.stringify(obj);
        if (!keys.has(key)) {
            keys.add(key);
            uniqueArray.push(obj);
        }
    }

    const itemList =
        uniqueArray &&
        uniqueArray.map((item, i) => (
            <tr>
                <td>{i + 1}</td>
                <td>{item.rowNo + 1 > 1 ? item.rowNo + 1 - 1 : item.rowNo + 1}</td>
                <td>{item.validationMsg}</td>
            </tr>
        ));

    return (
        <div className='errorTable_container'>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Sr No</th>
                        <th>Row Number</th>
                        <th>Error</th>
                    </tr>
                </thead>
                <tbody>
                    {itemList}

                </tbody>
            </Table>
        </div>
    );
}

export default PaymentPage
