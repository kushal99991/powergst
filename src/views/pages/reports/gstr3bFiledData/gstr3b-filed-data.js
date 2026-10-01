// ** React Imports
import { Fragment, useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from "react-redux";

// ** Spinner (Splash Screen)
import Spinner from '../../../../@core/components/spinner/Loading-spinner'
import encryptData from '../../../../auth/crypto/crypto';
// ** Styles
import '@styles/react/libs/tables/react-dataTable-component.scss'
// ** Third Party Components
import Swal from 'sweetalert2'
import toast from 'react-hot-toast'
import {
    FilePlus,
    Trash2,
    X
} from 'react-feather'
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
    Nav, NavItem, NavLink
} from 'reactstrap'
import { Search } from 'react-feather'
import GSTR3Services from "../../../../services/gstr3b/gstr3bService"
import GSTR3FIFileDataService from '../../../../services/gstr3bFiled/gstr3bFiledService'
//** Error Code file
import errorCodeConfig from '../../../../configs/apiErrorCodeConfig'
// ** Custom Components
import Breadcrumbs from '@components/breadcrumbs'
// import PruchaseTypesModal from './purchase-list-modal'

//** Handsontable
import { HotTable, HotColumn } from "@handsontable/react";
import Handsontable from 'handsontable';
import { registerRenderer, textRenderer } from 'handsontable/renderers';
import { registerAllModules } from 'handsontable/registry';
import { LINK_MESSAGE, keysMap, enableOnFormTags, RowSize, columnHeaderSize } from '../../../../configs/config'

// ** Utils
import Select, { components } from 'react-select' // eslint-disable-line
import { selectThemeColors } from '@utils'
import makeAnimated from 'react-select/animated'
import { SELECT_MAXSIZE } from '../../../../configs/config'
import DeleteModelGSTR3B from '../../../components/models/DeleteModelGSTR3b'

import { useHotkeys } from 'react-hotkeys-hook';
import { getGSTR3BSummary } from '../../../apps/user/store';
import { globleVariable } from '../../../../configs/globalVariable'
import LocalFunction from '../../../../configs/getLocalFunction'
import SessionFunction from '../../../../configs/getSessionFunction'

const animatedComponents = makeAnimated()

// ** Range wise year
const finYearOption = LocalFunction.getLocalValue(globleVariable.rangeFilters, true);
const YearList = finYearOption !== undefined && finYearOption !== null && finYearOption !== "" && finYearOption !== 'undefined' ? JSON.parse(finYearOption) : []

registerAllModules();

const GSTR3BFileDataDetails = ({ wizardBtn, setDownloadStart, downloadStart, exportStart, setExportType,downloadDate,setDownloadDate }) => {
    const store = useSelector((state) => state?.users?.GSTR3BSummary);
    const filedSuppliesRowDetails = useSelector((state) => state?.users?.GSTR3BSummary?.[0]?.FiledSuppliesRowDetails);
    const clientIds = sessionStorage.getItem(globleVariable.G_UCParId) && SessionFunction.getSessionValue(globleVariable.G_UCParId, true);
    const subId = localStorage.getItem(globleVariable.subscriptionId) && LocalFunction.getLocalValue(globleVariable.subscriptionId, true);
    const GGSTIN = sessionStorage.getItem(globleVariable.G_GSTIN) && SessionFunction.getSessionValue(globleVariable.G_GSTIN, true);

    const dispatch = useDispatch()


    // ** Hooks
    const [block, setBlock] = useState(false)
    const [modalshow, setModalshow] = useState(false);

    // ** Delete 
    const [deleteModalshow, setDeleteModalshow] = useState(false)
    const [data, setData] = useState([])

    const [finFromYear, setFinFormYear] = useState(null);
    const [panData, setPanData] = useState([]);
    const [monthFrom, setMonthFrom] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');
    const [displayType, setDisplayType] = useState(false)
    const [search, setSearch] = useState(false);
    const [panDataFrom, setPanDataFrom] = useState([]);

    // ** Grids Table Data
    const [supplies, setSupplies] = useState([])
    const [supplyDetails, setSupplyDetails] = useState([])
    const [outwardSupplies, setOutwardSupplies] = useState([])
    const [nilRated, setNilRated] = useState([])
    const [lateFee, setLateFee] = useState([])
    const [eligibleITCs, setEligibleITCs] = useState([])
    const [filedPaymentPage, setFiledPaymentPage] = useState([])
    const [savethenSearch, setSaveThenSearch] = useState(false);
    const [computationData, setComputationData] = useState();



    const G_UCParId = sessionStorage.getItem(globleVariable.G_UCParId) && SessionFunction.getSessionValue(globleVariable.G_UCParId, true)
    const gstr3BFiledFromDt = sessionStorage.getItem(globleVariable.gstr3BFiledFromDt) && SessionFunction.getSessionValue(globleVariable.gstr3BFiledFromDt, true)
    const gstr3BFiledToDt = sessionStorage.getItem(globleVariable.gstr3BFiledToDt) && SessionFunction.getSessionValue(globleVariable.gstr3BFiledToDt, true)
    const defaultYear = sessionStorage.getItem(globleVariable.defaultYear) && SessionFunction.getSessionValue(globleVariable.defaultYear, true)
    // ** Navigate
    const navigate = useNavigate();
    const hotRef = useRef(null);
    const hotRef2 = useRef(null);
    const hotRef3 = useRef(null);
    const hotRefEligibeleITC = useRef(null)
    const hotRefExempt = useRef(null)
    const hotRefIntersetLateFee = useRef(null)

    // ** Loader
    const Loader = () => {
        return (
            <Fragment>
                <Spinner />
                <CardText className='mb-0 mt-1 text-white'>Please Wait...</CardText>
            </Fragment>
        )
    }

    useEffect(() => {
        //  debugger
        if (exportStart == true && wizardBtn == 1) {
            // debugger
            onDateSelect();
            setExportType(false)
        }

    }, [exportStart])

    // ** From and To Year list
    useEffect(() => {
        setPanData(YearList)
        setPanDataFrom(YearList)
        setDisplayType(true);
    }, [])

    function formatBytes(bytes, decimals = 2) {
        if (!+bytes) return '0 Bytes'

        const k = 1024
        const dm = decimals < 0 ? 0 : decimals
        const sizes = ['Bytes', 'KB', 'MB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']

        const i = Math.floor(Math.log(bytes) / Math.log(k))
        // alert(`${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`)
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
    }

    // ** From Month selection
    const selectFromYear = (value) => {
        console.log("value=", value)
        setFinFormYear(value);
        setErrorMsg('');
        const setDt = Number(monthFrom?.srNo) > Number(value?.srNo) ? monthFrom : panDataFrom[0]
        const x = panDataFrom?.filter((item) => Number(item.srNo) >= Number(value.srNo))
        // sessionStorage.setItem('gstr3bSelectExportFromDt', value?.value)
        // SessionFunction.setSessionValue(globleVariable.gstr3BFiledFromDt, value?.value, true)

        setMonthFrom(setDt)
        setPanData(x);

        // setMonthFrom(x != undefined && x != null ? x[0] : null);
        // sessionStorage.setItem('gstr3bToDt', setDt?.value)
        // SessionFunction.setSessionValue(globleVariable.gstr3BFiledToDt, setDt?.value, true)
        // PurchaseSummaryService();
    }

    // ** To Month selection
    const selectFromMonth = (value) => {
        setErrorMsg('');
        setMonthFrom(value);

        if (Number(finFromYear?.srNo) > Number(value?.srNo)) {
            const fromFilter = panDataFrom?.filter((item) => Number(item.srNo) == Number(value.srNo))[0]
            setFinFormYear(fromFilter)
            // sessionStorage.setItem('gstr3bSelectExportFromDt', fromFilter?.value)
            // sessionStorage.setItem('gstr3bToDt', fromFilter?.value)
            // SessionFunction.setSessionValue(globleVariable.gstr3BFiledFromDt, fromFilter?.value, true)
            // SessionFunction.setSessionValue(globleVariable.gstr3BFiledToDt, fromFilter?.value, true)
        } else {
            // sessionStorage.setItem('gstr3bToDt', value?.value)
            // SessionFunction.setSessionValue(globleVariable.gstr3BFiledToDt, value?.value, true)
        }

        //  sessionStorage.setItem('gstr3bToDt', value?.value)
        // PurchaseSummaryService();
    }

    // ** Display for loading 
    useEffect(() => {
        return () => setBlock(false)
    }, [])


    const onDateSelect = () => {
        let defaultValueFrom = null;
        let defaultValueTo = null;
        if (gstr3BFiledFromDt !== null && gstr3BFiledFromDt !== "" && gstr3BFiledFromDt !== undefined) {
            console.log('set from date')
            defaultValueFrom = panDataFrom?.filter((item) => item.value == gstr3BFiledFromDt)[0];
        } else {
            defaultValueFrom = panDataFrom?.filter((item) => Number(item.value) == Number(defaultYear))[0];
        }

        if (gstr3BFiledToDt !== null && gstr3BFiledToDt !== "" && gstr3BFiledToDt !== undefined) {
            defaultValueTo = panData?.filter((item) => item.value == gstr3BFiledToDt)[0];
        } else {
            defaultValueTo = panData?.filter((item) => Number(item.value) == Number(defaultYear))[0];
        }

        if (defaultValueFrom !== undefined && defaultValueFrom !== null && defaultValueFrom !== "") {
            setFinFormYear(defaultValueFrom)
            // sessionStorage.setItem('gstr3bSelectExportFromDt', defaultValueFrom?.value)
            SessionFunction.setSessionValue(globleVariable.gstr3BFiledFromDt, defaultValueFrom?.value, true)
        }
        if (defaultValueTo !== undefined && defaultValueTo !== null && defaultValueTo !== "") {
            setMonthFrom(defaultValueTo)
            // sessionStorage.setItem('gstr3bToDt', defaultValueTo?.value)
            SessionFunction.setSessionValue(globleVariable.gstr3BFiledToDt, defaultValueTo?.value, true)
        }
    }


    // ** Set From and to Date by session
    useEffect(() => {
        console.log('default value');
        if (displayType == true) {

            onDateSelect()
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
        // if (wizardBtn==1) {
        if (!store.length > 0 && wizardBtn == 1) {
            // PurchaseSummaryService();
            const userData = {
                clientid: clientIds,
                finyear: finFromYear?.value,
                // finyear: gstr3BFiledToDt,
                finmonth: monthFrom?.value,
                // finmonth:gstr3BFiledFromDt,
                subscriptionId: subId,
                gstNumber: GGSTIN
            }
            setBlock(true)
            dispatch(getGSTR3BSummary(userData))

        }
        // }
        // }, [search, deleteModalshow,wizardBtn, finFromYear, monthFrom])
    }, [wizardBtn])

    useEffect(() => {
        if (store) {
            console.log(store, "store[0]?.FiledOutwardSupplies")
            setBlock(false)
            setEligibleITCs(store[0]?.FiledEligibleITCs)
            setLateFee(store[0]?.FiledLateFee)
            setNilRated(store[0]?.FiledNilRated)
            setSupplyDetails(store[0]?.FiledSupplyDetails)
            setOutwardSupplies(store[0]?.FiledOutwardSupplies)
            setSupplies(store[0]?.FiledSupplies)
            setFiledPaymentPage(store[0]?.Filedpaymentofpage)
            var paymentOfPageAllData = store[0]?.Filedpaymentofpage;
            var computationOfData = [];
            console.log(paymentOfPageAllData,"ComputationData")
            // if (paymentOfPageAllData != null && paymentOfPageAllData.length > 0) {
            //     computationOfData.push([
            //         "Integrated Tax",
            //         paymentOfPageAllData[0].IGST,
            //         paymentOfPageAllData[2].IGST,
            //         paymentOfPageAllData[2].CGST,
            //         paymentOfPageAllData[2].SGST,
            //         paymentOfPageAllData[2].Cess,
            //         paymentOfPageAllData[6].IGST,
            //         paymentOfPageAllData[8].IGST,///
            //         paymentOfPageAllData[8].IGST,
            //         paymentOfPageAllData[9].IGST,
            //         paymentOfPageAllData[10].IGST,
            //         paymentOfPageAllData[11].IGST,
            //         paymentOfPageAllData[12].IGST,
            //         paymentOfPageAllData[13].IGST,
            //         paymentOfPageAllData[14].IGST,
            //     ]);

            //     computationOfData.push([
            //         "Central Tax",
            //         paymentOfPageAllData[0].CGST,
            //         paymentOfPageAllData[3].IGST,
            //         paymentOfPageAllData[3].CGST,
            //         paymentOfPageAllData[3].SGST,
            //         paymentOfPageAllData[3].Cess,
            //         paymentOfPageAllData[6].CGST,
            //         paymentOfPageAllData[8].CGST,
            //         paymentOfPageAllData[8].CGST,
            //         paymentOfPageAllData[9].CGST,
            //         paymentOfPageAllData[10].CGST,
            //         paymentOfPageAllData[11].CGST,
            //         paymentOfPageAllData[12].CGST,
            //         paymentOfPageAllData[13].CGST,
            //         paymentOfPageAllData[14].CGST,
            //     ]);

            //     computationOfData.push([
            //         "State/UT Tax",
            //         paymentOfPageAllData[0].SGST,
            //         paymentOfPageAllData[4].IGST,
            //         paymentOfPageAllData[4].CGST,
            //         paymentOfPageAllData[4].SGST,
            //         paymentOfPageAllData[4].Cess,
            //         paymentOfPageAllData[6].SGST,
            //         paymentOfPageAllData[8].SGST,
            //         paymentOfPageAllData[8].SGST,
            //         paymentOfPageAllData[9].SGST,
            //         paymentOfPageAllData[10].SGST,
            //         paymentOfPageAllData[11].SGST,
            //         paymentOfPageAllData[12].SGST,
            //         paymentOfPageAllData[13].SGST,
            //         paymentOfPageAllData[14].SGST,
            //     ]);

            //     computationOfData.push([
            //         "Cess",
            //         paymentOfPageAllData[0].Cess,
            //         paymentOfPageAllData[5].IGST,
            //         paymentOfPageAllData[5].CGST,
            //         paymentOfPageAllData[5].SGST,
            //         paymentOfPageAllData[5].Cess,
            //         paymentOfPageAllData[6].Cess,
            //         paymentOfPageAllData[8].Cess,
            //         paymentOfPageAllData[8].Cess,
            //         paymentOfPageAllData[9].Cess,
            //         paymentOfPageAllData[10].Cess,
            //         paymentOfPageAllData[11].Cess,
            //         paymentOfPageAllData[12].Cess,
            //         paymentOfPageAllData[13].Cess,
            //         paymentOfPageAllData[14].Cess,
            //     ]);

            //     setComputationData(computationOfData);
            // }
            if (paymentOfPageAllData != null && paymentOfPageAllData.length > 0) {
                computationOfData.push([
                    "Integrated Tax",
                    paymentOfPageAllData[0].IGST,
                    paymentOfPageAllData[2].IGST,
                    paymentOfPageAllData[3].IGST,
                    paymentOfPageAllData[4].IGST,
                    paymentOfPageAllData[5].IGST,
                    paymentOfPageAllData[6].IGST,
                    paymentOfPageAllData[7].IGST,
                    paymentOfPageAllData[8].IGST,
                    paymentOfPageAllData[9].IGST,
                    paymentOfPageAllData[10].IGST,
                    paymentOfPageAllData[11].IGST,
                    paymentOfPageAllData[12].IGST,
                    paymentOfPageAllData[13].IGST,
                    paymentOfPageAllData[14].IGST,
                ]);

                computationOfData.push([
                    "Central Tax",
                    paymentOfPageAllData[0].CGST,
                    paymentOfPageAllData[2].CGST,
                    paymentOfPageAllData[3].CGST,
                    paymentOfPageAllData[4].CGST,
                    paymentOfPageAllData[5].CGST,
                    paymentOfPageAllData[6].CGST,
                    paymentOfPageAllData[7].CGST,
                    paymentOfPageAllData[8].CGST,
                    paymentOfPageAllData[9].CGST,
                    paymentOfPageAllData[10].CGST,
                    paymentOfPageAllData[11].CGST,
                    paymentOfPageAllData[12].CGST,
                    paymentOfPageAllData[13].CGST,
                    paymentOfPageAllData[14].CGST,
                ]);

                computationOfData.push([
                    "State/UT Tax",
                    paymentOfPageAllData[0].SGST,
                    paymentOfPageAllData[2].SGST,
                    paymentOfPageAllData[3].SGST,
                    paymentOfPageAllData[4].SGST,
                    paymentOfPageAllData[5].SGST,
                    paymentOfPageAllData[6].SGST,
                    paymentOfPageAllData[7].SGST,
                    paymentOfPageAllData[8].SGST,
                    paymentOfPageAllData[9].SGST,
                    paymentOfPageAllData[10].SGST,
                    paymentOfPageAllData[11].SGST,
                    paymentOfPageAllData[12].SGST,
                    paymentOfPageAllData[13].SGST,
                    paymentOfPageAllData[14].SGST,
                ]);

                computationOfData.push([
                    "Cess",
                    paymentOfPageAllData[0].Cess,
                    paymentOfPageAllData[2].Cess,
                    paymentOfPageAllData[3].Cess,
                    paymentOfPageAllData[4].Cess,
                    paymentOfPageAllData[5].Cess,
                    paymentOfPageAllData[6].Cess,
                    paymentOfPageAllData[7].Cess,
                    paymentOfPageAllData[8].Cess,
                    paymentOfPageAllData[9].Cess,
                    paymentOfPageAllData[10].Cess,
                    paymentOfPageAllData[11].Cess,
                    paymentOfPageAllData[12].Cess,
                    paymentOfPageAllData[13].Cess,
                    paymentOfPageAllData[14].Cess,
                ]);

                setComputationData(computationOfData);
            }
            console.log(computationData,"ComputationData")
        }
    }, [store])

    // ** toggle Compose
    const toggleCompose = () => setDeleteModalshow(!deleteModalshow)

    // ** Search
    const PurchaseSummaryService = () => {
        setBlock(true)
        GSTR3FIFileDataService.getAllGSTR3FileData(G_UCParId, gstr3BFiledFromDt, gstr3BFiledToDt).then(res => {
            setBlock(false)
            if (res.status === 200 && res.data.status === errorCodeConfig.APIDefaultCode.Success) {
                setSaveThenSearch(false)
                setData(res?.data?.data)
                setDownloadStart(false)
                // console.log(res?.data?.data,"res?.data?.data")
                setEligibleITCs(res?.data?.data?.filedEligibleITCs)
                setLateFee(res?.data?.data?.filedLateFee)
                setNilRated(res?.data?.data?.filedNilRated)
                setSupplyDetails(res?.data?.data?.filedSupplyDetails)
                // setOutwardSupplies(res?.data?.data?.filedOutwardSupplies)
                setSupplies(res?.data?.data?.filedSupplies)
                setFiledPaymentPage(res?.data?.data?.filedpaymentofpage)
                var paymentOfPageAllData = res?.data?.data?.filedpaymentofpage;
                var computationOfData = [];
                if (paymentOfPageAllData != null && paymentOfPageAllData.length > 0) {
                    computationOfData.push([
                        "Integrated Tax",
                        paymentOfPageAllData[0].igst,
                        paymentOfPageAllData[2].igst,
                        paymentOfPageAllData[3].igst,
                        paymentOfPageAllData[4].igst,
                        paymentOfPageAllData[5].igst,
                        paymentOfPageAllData[6].igst,
                        paymentOfPageAllData[7].igst,
                        paymentOfPageAllData[8].igst,
                        paymentOfPageAllData[9].igst,
                        paymentOfPageAllData[10].igst,
                        paymentOfPageAllData[11].igst,
                        paymentOfPageAllData[12].igst,
                        paymentOfPageAllData[13].igst,
                        paymentOfPageAllData[14].igst,
                    ]);

                    computationOfData.push([
                        "Central Tax",
                        paymentOfPageAllData[0].cgst,
                        paymentOfPageAllData[2].cgst,
                        paymentOfPageAllData[3].cgst,
                        paymentOfPageAllData[4].cgst,
                        paymentOfPageAllData[5].cgst,
                        paymentOfPageAllData[6].cgst,
                        paymentOfPageAllData[7].cgst,
                        paymentOfPageAllData[8].cgst,
                        paymentOfPageAllData[9].cgst,
                        paymentOfPageAllData[10].cgst,
                        paymentOfPageAllData[11].cgst,
                        paymentOfPageAllData[12].cgst,
                        paymentOfPageAllData[13].cgst,
                        paymentOfPageAllData[14].cgst,
                    ]);

                    computationOfData.push([
                        "State/UT Tax",
                        paymentOfPageAllData[0].sgst,
                        paymentOfPageAllData[2].sgst,
                        paymentOfPageAllData[3].sgst,
                        paymentOfPageAllData[4].sgst,
                        paymentOfPageAllData[5].sgst,
                        paymentOfPageAllData[6].sgst,
                        paymentOfPageAllData[7].sgst,
                        paymentOfPageAllData[8].sgst,
                        paymentOfPageAllData[9].sgst,
                        paymentOfPageAllData[10].sgst,
                        paymentOfPageAllData[11].sgst,
                        paymentOfPageAllData[12].sgst,
                        paymentOfPageAllData[13].sgst,
                        paymentOfPageAllData[14].sgst,
                    ]);

                    computationOfData.push([
                        "Cess",
                        paymentOfPageAllData[0].cess,
                        paymentOfPageAllData[2].cess,
                        paymentOfPageAllData[3].cess,
                        paymentOfPageAllData[4].cess,
                        paymentOfPageAllData[5].cess,
                        paymentOfPageAllData[6].cess,
                        paymentOfPageAllData[7].cess,
                        paymentOfPageAllData[8].cess,
                        paymentOfPageAllData[9].cess,
                        paymentOfPageAllData[10].cess,
                        paymentOfPageAllData[11].cess,
                        paymentOfPageAllData[12].cess,
                        paymentOfPageAllData[13].cess,
                        paymentOfPageAllData[14].cess,
                    ]);

                    setComputationData(computationOfData);
                }

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
        document.getElementById('btnNewPurchase').blur();
        setModalshow(!modalshow);
    }
console.log(downloadDate,'downloadDate')

    useEffect(() => {
        if(downloadDate){

            onDateSelect();
            const userData = {
                clientid: clientIds,
                finyear: gstr3BFiledFromDt,
                finmonth: gstr3BFiledFromDt,
                subscriptionId: subId,
                gstNumber: GGSTIN
            }
            setBlock(true)
            dispatch(getGSTR3BSummary(userData))
            setDownloadDate(false)
            if (store) {
                setBlock(false)
            }
        }
    }, [downloadDate]);

    // useEffect(() => {
    //     if (downloadStart) {
    //         // PurchaseSummaryService();
    //         const userData = {
    //             clientid: clientIds,
    //             finyear: finFromYear?.value,
    //             finmonth: monthFrom?.value,
    //             subscriptionId: subId,
    //             gstNumber: GGSTIN
    //         }

    //         SessionFunction.setSessionValue(globleVariable.gstr3BFiledFromDt, finFromYear?.value, true)
    //         SessionFunction.setSessionValue(globleVariable.gstr3BFiledToDt, monthFrom?.value, true)

    //         setBlock(true)
    //         dispatch(getGSTR3BSummary(userData))
    //         if (store) {
    //             setBlock(false)
    //         }
    //         setDownloadStart(false)
    //     }
    // }, [downloadStart])

    // ** Toggle show/hide
    const toggleModal = () => setModalshow(!modalshow)

    // ** Delete Modal Show/Hide 
    const HideShowDeleteModel = () => {
        setDeleteModalshow(!deleteModalshow)
        // document.getElementById('btnDeleteGSTR3B').blur();
    }

    // ** Column
    const handsontableColumns = [
        {
            data: "NatureOfSupplies",
            readOnly: true,
            title: 'Nature of supplies',
            width: 499
        },
        {
            data: "TaxableValue",
            readOnly: true,
            title: 'Total Taxable Value (₹)',
            width: "150px"
        },
        {
            data: "IGST",
            readOnly: true,
            title: 'IGST (₹)'
        },
        {
            data: "CGST",
            readOnly: true,
            title: 'CGST (₹)'
        },
        {
            data: "SGST",
            readOnly: true,
            title: 'SGST (₹)'
        },
        {
            data: "Cess",
            readOnly: true,
            title: 'CESS (₹)'
        }
    ]
    const handsontableColumns2 = [
        {
            data: "NatureOfSupplies",
            readOnly: true,
            title: 'Nature of supplies',
            width: 499
        },
        {
            data: "TaxableValue",
            readOnly: true,
            title: 'Total Taxable Value (₹)',
            width: "150px"
        },
        {
            data: "IGST",
            readOnly: true,
            title: 'IGST (₹)'
        },
        {
            data: "CGST",
            readOnly: true,
            title: 'CGST (₹)'
        },
        {
            data: "SGST",
            readOnly: true,
            title: 'SGST (₹)'
        },
        {
            data: "Cess",
            readOnly: true,
            title: 'CESS (₹)'
        }
    ]
    const handsontableColumns3 = [
        {
            data: "NatureOfSupplies",
            readOnly: true,
            title: 'Nature of supplies',
            width: 200
        },
        {
            data: "TaxableValue",
            readOnly: true,
            title: 'Total Taxable Value (₹)',
            // width:100
        },
        {
            data: "IGST",
            readOnly: true,
            title: 'IGST (₹)'
        },
        {
            data: "Type",
            readOnly: true,
            title: 'Type'
        },
    ]
    const exemptColumns = [
        {
            data: "NatureOfSupplies",
            readOnly: true,
            title: 'Nature of supplies',
            width: 200

        },
        {
            data: "InterStateSupplies",
            readOnly: true,
            title: 'Inter-State-Supplies (₹)'
        },
        {
            data: "IntraStateSupplies",
            readOnly: true,
            title: 'Intra-State-Supplies (₹)'
        },
    ]
    const eligbileColumns = [
        {
            data: "Details",
            readOnly: true,
            title: 'Details',
            width: 400
        },
        {
            data: "IGST",
            readOnly: true,
            title: 'IGST (₹)'
        },
        {
            data: "CGST",
            readOnly: true,
            title: 'CGST (₹)'
        },
        {
            data: "SGST",
            readOnly: true,
            title: 'SGST (₹)'
        },
        {
            data: "Cess",
            readOnly: true,
            title: 'CESS (₹)'
        }
    ]
    const intersetAndLateFeesColumn = [
        {
            data: "Description",
            readOnly: true,
            title: 'Description',
            width: 400
        },
        {
            data: "IGST",
            readOnly: true,
            title: 'IGST (₹)'
        },
        {
            data: "CGST",
            readOnly: true,
            title: 'CGST (₹)'
        },
        {
            data: "SGST",
            readOnly: true,
            title: 'SGST (₹)'
        },
        {
            data: "Cess",
            readOnly: true,
            title: 'CESS (₹)'
        }
    ]


    // **  localAfterOnCellMouseDown
    function localAfterOnCellMouseDown(event, coords, td) {
        const hot = hotRef?.current?.hotInstance;

        if (coords.row !== -1 && coords.col < 1) {
            const typeofInvoiceId = hot.getDataAtRow(coords.row)[6];
            const encrypData = encryptData.encrypt(typeofInvoiceId)

            let arrTypes = [];
            // console.log(data)
            data.filter(obj => obj.typeofInvoiceId == 7 || obj.typeofInvoiceId == 8).map(item => (
                arrTypes.push({
                    'value': item.typeofInvoiceId,
                    'label': item.typeofInvoice
                })
            ))
        }
    }
    function localAfterOnCellMouseDownSupplies(event, coords, td) {
        const hot = hotRef3?.current?.hotInstance;

        if (coords.row !== -1 && coords.col < 1) {
            const suppliesId = hot.getDataAtRow(coords.row)[3];
            const supplyTitle = hot.getDataAtRow(coords.row)[0];
            if (suppliesId != null && suppliesId != undefined && suppliesId != 'null') {
                navigate(`/reports/gstr3b-filed-data/supplies-made`, { state: { suppliesId: suppliesId, title: supplyTitle, rowDetails: filedSuppliesRowDetails } });
            }
        }
    }

    const theader = (col, TH) => {

        if (col > 0) {
            TH.className = 'htRight'
        } else {
            TH.className = 'htLeft'
        }
    };
    const paymentTheader = (col, TH) => {
        console.log(col, "college")
        if (col > 1 && col !== 1) {
            TH.className = 'htRight'
        }
        else if (col == 0) {
            TH.className = 'htLeft'
        }
    }
    // ** Loading 
    const loadFunction = (value) => {
        console.log(value, "valueeeeeeeeeeeeee")
        setBlock(value)
    }

    // ** Loading Export
    const loadFunctionExport = (value, fileName, selectedYear) => {
        setBlock(value);
        // setProgressModal(value);
        // console.log("progress value=", value, fileName, selectedYear);
        // fileName?.name ? setFileName(fileName?.name) : setFileName('')
        // fileName?.size ? setFileSize(formatBytes(fileName?.size)) : setFileSize('')
        // selectedYear ? setFileYear(selectedYear) : setFileYear('')
        // fileName && formatBytes(fileName?.size)
    }


    useEffect(() => {
        if (savethenSearch == true) {
            let hotTable = hotRef?.current?.hotInstance;
            hotTable.deselectCell()
        }
    }, [savethenSearch])

    const onClickSearch = () => {

        const userData = {
            clientid: clientIds,
            finyear: finFromYear?.value,
            finmonth: monthFrom?.value,
            subscriptionId: subId,
            gstNumber: GGSTIN
        }

        SessionFunction.setSessionValue(globleVariable.gstr3BFiledFromDt, finFromYear?.value, true)
        SessionFunction.setSessionValue(globleVariable.gstr3BFiledToDt, monthFrom?.value, true)

        setBlock(true)
        dispatch(getGSTR3BSummary(userData))
        // if (store) {
        //     setBlock(false)
        // }

    }



    return (
        <Fragment>
            {block && <div className="loading1">Loading&#8230;</div>}

            <div className='content-header-left col-md-12 col-12'>
                {/* <div className='row breadcrumbs-top mb-1'>
                    <div className='col-md-6'>
                    </div>
                    <div className='col-md-3'></div>
                  
                    <div className='col-md-3 ps-0'>
                        <div className='row'>
                            <Label className='form-label col-md-5 pt-half px-0' >
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
                                className="basic-multi-select col-md-7 ps-0"
                                classNamePrefix='select'
                                onChange={selectFromMonth}
                                value={monthFrom}
                                maxMenuHeight={SELECT_MAXSIZE}
                            />
                        </div>
                    </div>
                </div> */}
                <div className='row breadcrumbs-top mb-1'>
                    <div className="col-md-6"></div>
                    <div className="col-md-6">
                        <div className="row">
                            <div className="col-md-2"></div>
                            <div className="col-md-4">
                                <div className="row">
                                    <Label className='form-label col-md-2 pt-half ps-0' >
                                        From
                                    </Label>
                                    <Select
                                        id="from"
                                        placeholder="From"
                                        isClearable={false}
                                        theme={selectThemeColors}
                                        closeMenuOnSelect={true}
                                        options={panDataFrom}
                                        className="basic-multi-select col-md-10"
                                        classNamePrefix='select'
                                        components={animatedComponents}
                                        onChange={selectFromYear}
                                        value={finFromYear}
                                        maxMenuHeight={SELECT_MAXSIZE}

                                    />
                                </div>
                            </div>
                            <div className='col-md-4'>
                                <div className='row'>
                                    <Label className='form-label col-md-2 pt-half' >
                                        To
                                    </Label>
                                    <Select
                                        id="to"
                                        placeholder="To"
                                        isClearable={false}
                                        theme={selectThemeColors}
                                        closeMenuOnSelect={true}
                                        options={panData}
                                        components={animatedComponents}
                                        className="basic-multi-select col-md-10"
                                        classNamePrefix='select'
                                        onChange={selectFromMonth}
                                        value={monthFrom}
                                        maxMenuHeight={SELECT_MAXSIZE}
                                    />
                                </div>
                            </div>
                            <div className="col-md-2 text-md-end  ps-0">
                                <Button onClick={onClickSearch}
                                    className="btn-icon btn-round"
                                    color="danger" outline >
                                    <Search size={12} />&nbsp;Search
                                </Button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* First Table Details */}
            <div>
                {/* <style>{`.gstr3bFiledHeading{font-size: 14px !important; font-weight:bold}`}</style> */}
                <h3 className='heading-font-18-weight mt-3'>3.1 Details of outward supplies and inward supplies liable to reverse charge (other than those covered in 3.1.1)</h3>
                {/* <Card>
                    <CardBody className="CardBody p-0"> */}

                <div>
                    <Row>
                        <Col md={12}>
                            <div className="filing-table-border">
                                {outwardSupplies && outwardSupplies?.length > 0 ? <HotTable
                                    data={outwardSupplies}
                                    // data={arr1}
                                    // autoColumnSize={true}
                                    autoColumnSize={{
                                        samplingRatio: 23  // Adjust the samplingRatio as needed
                                    }}
                                    manualColumnResize={true}
                                    stretchH='all'
                                    preventOverflow="horizontal"
                                    columns={handsontableColumns}
                                    contextMenu={false}
                                    rowHeights={RowSize}
                                    columnHeaderHeight={columnHeaderSize}
                                    bindRowsWithHeaders={true}
                                    licenseKey="non-commercial-and-evaluation"
                                    height="auto"
                                    // className='tblborder'
                                    ref={hotRef}
                                    hiddenColumns={{
                                        columns: [6, 7]
                                    }}
                                    afterGetColHeader={theader}
                                    afterOnCellMouseDown={localAfterOnCellMouseDown}
                                    mergeCells={false}
                                    cells={function (row, col) {
                                        var cp = {}

                                        const hot = hotRef?.current?.hotInstance;
                                        cp.className = 'child'
                                        if (col > 0) {
                                            cp.className = 'text-end'
                                        }
                                        if (col == 0 && col == 1) {
                                            cp.className = "green"
                                        }
                                        // console.log(cp,"cpcpcpcp")
                                        if (row === outwardSupplies.length - 1) {
                                            if (col > 0) {
                                                cp.className = "purchseCellDisable text-end"
                                            }
                                        }
                                        if (col === 4) {
                                            cp.className = "purchseCellDisable text-end"
                                        }

                                        if (row === 4) {
                                            if (col > 1) {
                                                cp.className = "purchseCellDisable text-end"
                                            }
                                        }
                                        if (row === 3) {
                                            if (col > 3 && col != 5) {
                                                cp.className = "purchseCellDisable text-end"
                                            }
                                        }
                                        if (row === 2) {
                                            if (col > 1) {
                                                cp.className = "purchseCellDisable text-end"
                                            }
                                        }
                                        if (row === 1) {
                                            if (col > 2 && col != 5) {
                                                cp.className = "purchseCellDisable text-end"
                                            }
                                        }
                                        cp.readOnly = true

                                        return cp
                                    }}
                                    // afterChange={(x, y) => cellChange(x, y)}
                                    // afterRenderer={(TD, row, col, prop, value) => {
                                    //     if ((col == 1 || col == 2|| col == 3|| col==4 || col==5) && (isNaN(value) || value =='') && (block === false)) {
                                    //       TD.style.backgroundColor = "red";
                                    //     }
                                    //   }}
                                    width="100%"
                                    colWidths={100}

                                /> : <HotTable
                                    mergeCells={[{ row: 0, col: 0, rowspan: 1, colspan: 6 }]}
                                    // autoColumnSize={true}
                                    autoColumnSize={{
                                        samplingRatio: 23  // Adjust the samplingRatio as needed
                                    }}
                                    manualColumnResize={true}
                                    ref={hotRef}
                                    stretchH='all'
                                    rowHeights={RowSize}
                                    columnHeaderHeight={columnHeaderSize}
                                    // style={{ overflowX: "hidden", textAlign: "center" }}
                                    data={[{ natureOfSupplies: "No Data Found!" }]}
                                    cells={function (row, col) {
                                        var cp = {};

                                        if (col == 0) {

                                            cp.className = "text-center";
                                        }
                                        return cp;

                                    }}
                                    preventOverflow="horizontal"
                                    columns={handsontableColumns}
                                    contextMenu={false}
                                    bindRowsWithHeaders={true}
                                    licenseKey="non-commercial-and-evaluation"
                                    height="auto"
                                    width="100%"
                                    colWidths={100}
                                    afterGetColHeader={theader}
                                // hiddenColumns={{
                                //     columns: [6, 7]
                                // }}
                                />}
                            </div>
                        </Col>
                    </Row>
                </div>
                {/* </CardBody>
                </Card> */}
            </div>

            {/* Second Table Details */}
            <div>
                <h3 className='heading-font-18-weight mt-3'>3.1.1 Details of supplies notified under sub-section (5) of section 9 of the Central Goods and Services Tax Act, 2017 and corresponding provisions in Integrated  Goods and Services Tax/Union Territory Goods and Services Tax/State Goods and Services Tax Acts  </h3>
                {/* <Card>
                    <CardBody className="CardBody p-0"> */}

                <div>
                    <Row>
                        <Col md={12}>
                            <div className="filing-table-border">
                                {supplyDetails && supplyDetails.length > 0 ? <HotTable
                                    // data={supplies}
                                    data={supplyDetails}
                                    // data={arr3}
                                    // autoColumnSize={true}
                                    autoColumnSize={{
                                        samplingRatio: 23  // Adjust the samplingRatio as needed
                                    }}
                                    manualColumnResize={true}
                                    stretchH='all'
                                    rowHeights={RowSize}
                                    columnHeaderHeight={columnHeaderSize}
                                    preventOverflow="horizontal"
                                    columns={handsontableColumns2}
                                    contextMenu={false}
                                    bindRowsWithHeaders={true}
                                    licenseKey="non-commercial-and-evaluation"
                                    height="auto"
                                    ref={hotRef2}
                                    hiddenColumns={{
                                        columns: [6, 7]
                                    }}
                                    afterGetColHeader={theader}
                                    afterOnCellMouseDown={localAfterOnCellMouseDown}
                                    mergeCells={false}
                                    cells={function (row, col) {
                                        var cp = {}
                                        const hot = hotRef2?.current?.hotInstance;
                                        cp.className = 'child'
                                        if (col > 0) {
                                            cp.className = 'text-end'
                                        }
                                        if (col === 4) {
                                            cp.className = "purchseCellDisable text-end"
                                        }
                                        if (row === supplyDetails.length - 1) {
                                            if (col > 1) {
                                                cp.className = "purchseCellDisable text-end"
                                            }
                                        }
                                        cp.readOnly = true


                                        return cp
                                    }}
                                    // afterChange={(x, y) => cellChangeSubDetails(x, y)}
                                    // afterRenderer={(TD, row, col, prop, value) => {
                                    //     // console.log(value,"valueeeee")
                                    //     if ((col == 1 || col == 2|| col == 3|| col==4 || col==5) && (isNaN(value) || value =='' ||   value == null )) {
                                    //       TD.style.backgroundColor = "red";
                                    //     }
                                    //   }}
                                    width="100%"
                                    colWidths={100}

                                /> : <HotTable
                                    mergeCells={[{ row: 0, col: 0, rowspan: 1, colspan: 6 }]}
                                    // autoColumnSize={true}
                                    autoColumnSize={{
                                        samplingRatio: 23  // Adjust the samplingRatio as needed
                                    }}
                                    manualColumnResize={true}
                                    ref={hotRef2}
                                    stretchH='all'
                                    rowHeights={RowSize}
                                    columnHeaderHeight={columnHeaderSize}
                                    // style={{ overflowX: "hidden", textAlign: "center" }}
                                    data={[{ natureOfSupplies: "No Data Found!" }]}
                                    cells={function (row, col) {
                                        var cp = {};

                                        if (col == 0) {

                                            cp.className = "text-center";
                                        }
                                        return cp;

                                    }}
                                    preventOverflow="horizontal"
                                    columns={handsontableColumns2}
                                    contextMenu={false}
                                    bindRowsWithHeaders={true}
                                    licenseKey="non-commercial-and-evaluation"
                                    height="auto"
                                    width="100%"
                                    afterGetColHeader={theader}
                                    colWidths={100}
                                // hiddenColumns={{
                                //     columns: [6, 7]
                                // }}
                                />}
                            </div>
                        </Col>
                    </Row>
                </div>
                {/* </CardBody>
                </Card> */}
            </div>

            {/* third table will enter in between */}
            <div>
                <h3 className='heading-font-18-weight mt-3'>3.2 Of the supplies shown in 3.1(a) and 3.1.1(i) above,details of inter-State supplies made to unregistered persons, composition taxable persons and UIN holders</h3>
                {/* <Card>
                    <CardBody className="CardBody p-0"> */}
                <div>
                    <Row>
                        <Col md={12}>
                            <div className="filing-table-border">
                                {supplies?.length > 0 ? <HotTable
                                    // data={supplyDetails}
                                    data={supplies}
                                    // data={arr2}
                                    // autoColumnSize={true}
                                    autoColumnSize={{
                                        samplingRatio: 23  // Adjust the samplingRatio as needed
                                    }}
                                    manualColumnResize={true}
                                    stretchH='all'
                                    preventOverflow="horizontal"
                                    columns={handsontableColumns3}
                                    contextMenu={false}
                                    bindRowsWithHeaders={true}
                                    rowHeights={RowSize}
                                    columnHeaderHeight={columnHeaderSize}
                                    licenseKey="non-commercial-and-evaluation"
                                    height="auto"
                                    ref={hotRef3}
                                    afterGetColHeader={theader}
                                    hiddenColumns={{
                                        columns: [3]
                                    }}
                                    afterOnCellMouseDown={localAfterOnCellMouseDownSupplies}
                                    mergeCells={false}
                                    cells={function (row, col) {

                                        var cp = {}
                                        const hot = hotRef3?.current?.hotInstance;

                                        cp.className = 'text-danger child'

                                        if (col > 0) {
                                            cp.className = 'text-end'
                                        }
                                        if (row === supplies?.length - 1) {
                                            cp.className = "test"
                                            if (col > 0) {
                                                cp.className = "text-end"
                                            }
                                        }

                                        cp.readOnly = true

                                        if (col > 0) {
                                            cp.className = "purchseCellDisable text-end"

                                        }
                                        return cp
                                    }}
                                    // afterChange={(x, y) => cellChangeOfSupplies(x, y)}
                                    // afterRenderer={(TD, row, col, prop, value) => {
                                    //     if ((col == 1 || col == 2) && (isNaN(value) || value =='')) {
                                    //       TD.style.backgroundColor = "red";
                                    //     }
                                    //   }}
                                    width="100%"
                                    colWidths={100}
                                /> : <HotTable
                                    mergeCells={[{ row: 0, col: 0, rowspan: 1, colspan: 3 }]}
                                    // autoColumnSize={true}
                                    autoColumnSize={{
                                        samplingRatio: 23  // Adjust the samplingRatio as needed
                                    }}
                                    manualColumnResize={true}
                                    stretchH='all'
                                    rowHeights={RowSize}
                                    columnHeaderHeight={columnHeaderSize}
                                    ref={hotRef3}
                                    // style={{ overflowX: "hidden", textAlign: "center" }}
                                    data={[{ natureOfSupplies: "No Data Found!" }]}
                                    cells={function (row, col) {
                                        var cp = {};

                                        if (col == 0) {

                                            cp.className = "text-center";
                                        }
                                        return cp;

                                    }}
                                    preventOverflow="horizontal"
                                    columns={handsontableColumns3}
                                    contextMenu={false}
                                    bindRowsWithHeaders={true}
                                    licenseKey="non-commercial-and-evaluation"
                                    height="auto"
                                    afterGetColHeader={theader}
                                    width="100%"
                                    colWidths={100}
                                    hiddenColumns={{
                                        columns: [3]
                                    }}
                                />}
                            </div>
                        </Col>
                    </Row>
                </div>
                {/* </CardBody>
                </Card> */}
            </div>

            {/* fourth table in between  */}
            <div>
                <h3 className='heading-font-18-weight mt-3'> 4.Eligible ITC</h3>
                {/* <Card>
                    <CardBody className="CardBody p-0"> */}
                <div>
                    <Row>
                        <Col md={12}>
                            <div className="filing-table-border">
                                {eligibleITCs?.length && eligibleITCs?.length > 0 ?
                                    <><div>{console.log(eligibleITCs[0].CGST, "eligibleITCs")}</div><HotTable
                                        data={eligibleITCs}
                                        // data={arr4}
                                        // autoColumnSize={true}
                                        autoColumnSize={{
                                            samplingRatio: 23  // Adjust the samplingRatio as needed
                                        }}
                                        manualColumnResize={true}
                                        stretchH='all'
                                        preventOverflow="horizontal"
                                        columns={eligbileColumns}
                                        contextMenu={false}
                                        bindRowsWithHeaders={true}
                                        rowHeights={RowSize}
                                        columnHeaderHeight={columnHeaderSize}
                                        licenseKey="non-commercial-and-evaluation"
                                        height="auto"
                                        ref={hotRefEligibeleITC}
                                        afterGetColHeader={theader}
                                        afterOnCellMouseDown={localAfterOnCellMouseDown}
                                        // mergeCells={[{ row: 0, col: 0, rowspan: 1, colspan: 5 }, { row: 6, col: 0, rowspan: 1, colspan: 5 }, { row: 9, col: 0, rowspan: 1, colspan: 5 }, { row: 11, col: 0, rowspan: 1, colspan: 5 }]}
                                        cells={function (row, col) {
                                            var cp = {};
                                            const hot = hotRefEligibeleITC?.current?.hotInstance;
                                            cp.className = 'child';
                                            if (col > 0) {
                                                cp.className = 'text-end';
                                            }
                                            if (row == 0 || row == 6 || row == 9 || row == 11) {
                                                // if (row == 0 || row == 5 || row == 8 || row == 10) {
                                                cp.className = "boldRow";
                                            }
                                            // cp.readOnly = false    
                                            if (row == 0 || row == 6 || row == 9 || row == 11) {
                                                cp.readOnly = true;
                                            }
                                            if (col === 3 && row != 8) {
                                                cp.className = "purchseCellDisable text-end";
                                            }
                                            if (row == 1 || row == 2) {
                                                if (col > 1 && col != 4) {
                                                    cp.className = "purchseCellDisable text-end";
                                                }
                                            }
                                            if (row == 10) {
                                                if (col > 0) {
                                                    cp.className = "purchseCellDisable text-end";
                                                }
                                            }
                                            if (row === eligibleITCs.length - 1) {
                                                if (col > 0) {
                                                    cp.className = "purchseCellDisable text-end";
                                                }
                                            }
                                            cp.readOnly = true;
                                            return cp;
                                        }}
                                        // afterChange={(x, y) => cellChangeEligible(x, y)}
                                        // afterRenderer={(TD, row, col, prop, value) => {
                                        //     if ((col == 1 || col == 2|| col == 3|| col==4) && (isNaN(value) || value =='')) {
                                        //       TD.style.backgroundColor = "red";
                                        //     }
                                        //   }}
                                        width="100%"
                                        colWidths={100} /></> : <HotTable
                                        mergeCells={[{ row: 0, col: 0, rowspan: 1, colspan: 5 }]}
                                        // autoColumnSize={true}
                                        autoColumnSize={{
                                            samplingRatio: 23  // Adjust the samplingRatio as needed
                                        }}
                                        manualColumnResize={true}
                                        rowHeights={RowSize}
                                        columnHeaderHeight={columnHeaderSize}
                                        stretchH='all'
                                        // style={{ overflowX: "hidden", textAlign: "center" }}
                                        data={[{ details: "No Data Found!" }]}
                                        cells={function (row, col) {
                                            var cp = {};

                                            if (col == 0) {

                                                cp.className = "text-center";
                                            }
                                            return cp;

                                        }}
                                        preventOverflow="horizontal"
                                        columns={eligbileColumns}
                                        contextMenu={false}
                                        bindRowsWithHeaders={true}
                                        licenseKey="non-commercial-and-evaluation"
                                        height="auto"
                                        width="100%"
                                        colWidths={100}
                                        afterGetColHeader={theader}
                                        ref={hotRefEligibeleITC}
                                    // hiddenColumns={{
                                    //     columns: [6, 7]
                                    // }}
                                    />}
                            </div>
                        </Col>
                    </Row>
                </div>
                {/* </CardBody>
                </Card> */}
            </div>

            {/* fifth Table is down  */}
            <div>
                <h3 className='heading-font-18-weight mt-3'>5.Exempt, nil-rated and non-GST inward supplies</h3>
                {/* <Card>
                    <CardBody className="CardBody p-0"> */}
                <div>
                    <Row>
                        <Col md={12}>
                            <div className="filing-table-border">
                                {nilRated?.length > 0 ? <HotTable
                                    data={nilRated}
                                    // data={arr5}
                                    // autoColumnSize={true}
                                    autoColumnSize={{
                                        samplingRatio: 23  // Adjust the samplingRatio as needed
                                    }}
                                    manualColumnResize={true}
                                    stretchH='all'
                                    preventOverflow="horizontal"
                                    rowHeights={RowSize}
                                    columnHeaderHeight={columnHeaderSize}
                                    columns={exemptColumns}
                                    contextMenu={false}
                                    bindRowsWithHeaders={true}
                                    licenseKey="non-commercial-and-evaluation"
                                    height="auto"
                                    ref={hotRefExempt}
                                    afterGetColHeader={theader}
                                    // hiddenColumns={{
                                    //     columns: [6, 7]
                                    // }}
                                    afterOnCellMouseDown={localAfterOnCellMouseDown}
                                    mergeCells={false}
                                    cells={function (row, col) {
                                        var cp = {}
                                        const hot = hotRefExempt?.current?.hotInstance;
                                        cp.className = 'child'
                                        if (col > 0) {
                                            cp.className = 'text-end'
                                        }
                                        if (row == nilRated.length - 1) {
                                            if (col > 0) {
                                                cp.className = "purchseCellDisable text-end"
                                            }
                                        }

                                        cp.readOnly = true
                                        return cp
                                    }}
                                    // afterChange={(x, y) => cellChangeOfExempt(x, y)}
                                    // afterRenderer={(TD, row, col, prop, value) => {
                                    //     // console.log(value,"valueeeee")
                                    //     if ((col == 1 || col == 2) && (isNaN(value) || value =='')) {
                                    //       TD.style.backgroundColor = "red";
                                    //     }
                                    // }}
                                    width="100%"
                                    colWidths={100}


                                /> : <HotTable
                                    mergeCells={[{ row: 0, col: 0, rowspan: 1, colspan: 3 }]}
                                    // autoColumnSize={true}
                                    autoColumnSize={{
                                        samplingRatio: 23  // Adjust the samplingRatio as needed
                                    }}
                                    manualColumnResize={true}
                                    stretchH='all'
                                    rowHeights={RowSize}
                                    columnHeaderHeight={columnHeaderSize}
                                    // style={{ overflowX: "hidden", textAlign: "center" }}
                                    data={[{ natureOfSupplies: "No Data Found!" }]}
                                    cells={function (row, col) {
                                        var cp = {};

                                        if (col == 0) {

                                            cp.className = "text-center";
                                        }
                                        return cp;

                                    }}
                                    preventOverflow="horizontal"
                                    columns={exemptColumns}
                                    contextMenu={false}
                                    bindRowsWithHeaders={true}
                                    licenseKey="non-commercial-and-evaluation"
                                    height="auto"
                                    width="100%"
                                    colWidths={100}
                                    ref={hotRefExempt}
                                    afterGetColHeader={theader}
                                // hiddenColumns={{
                                //     columns: [6, 7]
                                // }}
                                />}
                            </div>
                        </Col>
                    </Row>
                </div>
                {/* </CardBody>
                </Card> */}
            </div>

            {/* Sixth Table  */}
            <div>
                <h3 className='heading-font-18-weight mt-3'>5.1 Interest and Late Fees</h3>
                {/* <Card>
                    <CardBody className="CardBody p-0"> */}
                <div>
                    <Row>
                        <Col md={12}>
                            <div className="filing-table-border">
                                {lateFee?.length > 0 ? <HotTable
                                    data={lateFee}
                                    // data={arr6}
                                    // autoColumnSize={true}
                                    autoColumnSize={{
                                        samplingRatio: 23  // Adjust the samplingRatio as needed
                                    }}
                                    manualColumnResize={true}
                                    stretchH='all'
                                    preventOverflow="horizontal"
                                    columns={intersetAndLateFeesColumn}
                                    rowHeights={RowSize}
                                    columnHeaderHeight={columnHeaderSize}
                                    contextMenu={false}
                                    bindRowsWithHeaders={true}
                                    licenseKey="non-commercial-and-evaluation"
                                    height="auto"
                                    ref={hotRefIntersetLateFee}
                                    afterGetColHeader={theader}
                                    // hiddenColumns={{
                                    //     columns: [6, 7]
                                    // }}
                                    afterOnCellMouseDown={localAfterOnCellMouseDown}
                                    mergeCells={false}
                                    cells={function (row, col) {
                                        var cp = {}
                                        const hot = hotRefIntersetLateFee?.current?.hotInstance;
                                        cp.className = 'child'
                                        if (col > 0) {
                                            cp.className = 'text-end'
                                        }
                                        if (row == 2) {
                                            if (col > 0) {
                                              cp.className = "purchseCellDisable text-end";
                                            }
                                          }
                                          if(row ==1){
                                            if(col ==1 || col == 4){
                                              cp.className = "purchseCellDisable text-end";
                                            }
                                          }
                                        cp.readOnly = true

                                        return cp
                                    }}
                                    // afterChange={(x, y) => cellChangeLateFee(x, y)}
                                    // afterRenderer={(TD, row, col, prop, value) => {
                                    //     // console.log(value,"valueeeee")
                                    //     if ((col == 1 || col == 2 ||col == 3 ||col == 4) && (isNaN(value) || value =='')) {
                                    //       TD.style.backgroundColor = "red";
                                    //     }
                                    // }}
                                    width="100%"
                                    colWidths={100}

                                /> : <HotTable
                                    mergeCells={[{ row: 0, col: 0, rowspan: 1, colspan: 5 }]}
                                    // autoColumnSize={true}
                                    autoColumnSize={{
                                        samplingRatio: 23  // Adjust the samplingRatio as needed
                                    }}
                                    manualColumnResize={true}
                                    stretchH='all'
                                    rowHeights={RowSize}
                                    columnHeaderHeight={columnHeaderSize}
                                    // style={{ overflowX: "hidden", textAlign: "center" }}
                                    data={[{ description: "No Data Found!" }]}
                                    cells={function (row, col) {
                                        var cp = {};

                                        if (col == 0) {

                                            cp.className = "text-center";
                                        }
                                        return cp;

                                    }}
                                    preventOverflow="horizontal"
                                    columns={intersetAndLateFeesColumn}
                                    contextMenu={false}
                                    bindRowsWithHeaders={true}
                                    licenseKey="non-commercial-and-evaluation"
                                    height="auto"
                                    width="100%"
                                    colWidths={100}
                                    afterGetColHeader={theader}
                                    ref={hotRefIntersetLateFee}

                                />}
                            </div>
                        </Col>

                    </Row>
                </div>
                {/* </CardBody>
                </Card> */}
            </div>


            {/* Seventh Table Paymetn page */}
            <div>
                <h3 className='heading-font-18-weight mt-3'>Payment Table</h3>
                {/* <Card>
                    <CardBody className="CardBody p-0"> */}

                <div>
                    <Row>
                        <Col md={12}>
                            <div className="filing-table-border">
                                <div> {console.log(computationData, "computationData")}</div>
                                {
                                    computationData?.length > 0 ?
                                        <HotTable
                                            //  columns =  {computationColumns}
                                            data={computationData}
                                            ref={hotRef}
                                            stretchH="all"
                                            rowHeights={RowSize}
                                            columnHeaderHeight={columnHeaderSize}
                                            readOnly={true}
                                            autoColumnSize={{
                                                samplingRatio: 23  // Adjust the samplingRatio as needed
                                            }}
                                            manualColumnResize={true}
                                            height="auto"
                                            colHeaders={true}
                                            
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
                                            nestedHeaders={[
                                                ["", "", { label: "Paid through ITC", colspan: 4 }],
                                                [
                                                    { label: "Description", data: "Description" },
                                                    "<div>Other than <br> reverse charge <br> Tax payable <br> (₹)</div>",
                                                    "Integrated Tax (₹)",
                                                    "Central Tax(₹)",
                                                    "State/UT Tax (₹)",
                                                    "CESS(₹)",
                                                    "<div>Other than <br> reverse <br> charge Tax <br> to be paid  <br> in Cash (₹) <div/>",
                                                    "<div>Reverse <br> charge <br>  Tax <br> payable <br> (₹)<div/>",
                                                    "<div> Reverse <br> charge <br> Tax to  be <br>  paid in <br> Cash (₹) <div/>",
                                                    "Interest <br>  payable (₹)",
                                                    "Interest  <br>  to be paid <br>  in Cash (₹)",
                                                    "Late Fee  <br>  payable (₹)",
                                                    "Late Fee  <br>  to be paid  <br> in Cash (₹)",
                                                    "Utilizable Cash <br>  balance (₹)",
                                                    "Additional Cash  <br>  required (₹)",
                                                ],
                                            ]}
                                            cells={function (row, col) {
                                                var cp = {};
                                                //   const hot = hotRefITC?.current?.hotInstance;
                                                if (col >= 1) {
                                                    cp.className = "text-end";
                                                    cp.readOnly = true;
                                                }
                                                if (row == 0 ||row == 1 || row == 2) {
                                                    if (col == 5) {
                                                        cp.className = "purchseCellDisable text-end"
                                                    }
                                                }
                                                if (row == 1 ) {
                                                    if (col == 4) {
                                                        cp.className = "purchseCellDisable text-end"
                                                    }
                                                }
                                                if (row == 3 ) {
                                                    if (col == 2 || col == 3 || col ==4 ) {
                                                        cp.className = "purchseCellDisable text-end"
                                                    }
                                                }
                                                if (row == 2 ) {
                                                    if (col == 3 ) {
                                                        cp.className = "purchseCellDisable text-end"
                                                    }
                                                }
                                                if (row == 0) {
                                                    if (col == 11 || col == 12 ) {
                                                        cp.className = "purchseCellDisable text-end"
                                                    }
                                                }
                                                if (row == 3) {
                                                    if (col == 11 || col == 12 ) {
                                                        cp.className = "purchseCellDisable text-end"
                                                    }
                                                }
                                                return cp;
                                            }}
                                            beforeCreateRow={function (index, amount) {
                                                let countRow = this?.countRows();
                                                if (this?.isEmptyRow(countRow - 0)) {
                                                    return false;
                                                }
                                                return true;
                                            }}
                                            licenseKey="non-commercial-and-evaluation"
                                
                                        />
                                        :
                                        <HotTable
                                            //  columns =  {computationColumns}
                                            data={computationData}
                                            ref={hotRef}
                                            stretchH="all"
                                            height="auto"
                                            rowHeights={RowSize}
                                            autoColumnSize={{
                                                samplingRatio: 23  // Adjust the samplingRatio as needed
                                            }}
                                            manualColumnResize={true}
                                            columnHeaderHeight={columnHeaderSize}
                                            colHeaders={true}
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
                                            nestedHeaders={[
                                                ["", "", { label: "Paid through ITC", colspan: 4 }],
                                                [
                                                    { label: "Description", data: "Description" },
                                                    "<div>Other than reverse charge  <br> Tax payable (₹)</div>",
                                                    "Integrated Tax (₹)",
                                                    "Central Tax(₹)",
                                                    "State/UT Tax (₹)",
                                                    "CESS(₹)",
                                                    "<div>Other than reverse charge <br>Tax to be paid in Cash (₹) <div/>",
                                                    "<div>Reverse charge <br> Tax payable (₹)<div/>",
                                                    "<div> Reverse charge Tax to  <br> be paid in Cash (₹) <div/>",
                                                    "Interest payable (₹)",
                                                    "Interest to be paid in Cash (₹)",
                                                    "Late Fee payable (₹)",
                                                    "Late Fee to be paid in Cash (₹)",
                                                    "Utilizable Cash balance (₹)",
                                                    "Additional Cash required (₹)",
                                                ],
                                            ]}
                                            cells={function (row, col) {
                                                var cp = {};
                                                //   const hot = hotRefITC?.current?.hotInstance;
                                                if (col > 0) {
                                                    cp.className = "text-end";
                                                    cp.readOnly = true;
                                                }
                                                return cp;
                                            }}
                                            beforeCreateRow={function (index, amount) {
                                                let countRow = this?.countRows();
                                                if (this?.isEmptyRow(countRow - 0)) {
                                                    return false;
                                                }
                                                return true;
                                            }}
                                            licenseKey="non-commercial-and-evaluation"
                                        />
                                }
                            </div>
                        </Col>
                    </Row>
                </div>
                {/* </CardBody>
                </Card> */}
            </div>

            {
                modalshow && <PruchaseTypesModal typeOfInv={data} show={modalshow} toggleModal={toggleModal} frmType={'purSummary'} redirectType="purchase"></PruchaseTypesModal>
            }

            {
                deleteModalshow &&
                <DeleteModelGSTR3B
                    Heading='Delete GSTR3B Summary'
                    SuccessButtonText='Delete'
                    show={deleteModalshow}
                    toggleCompose={toggleCompose}
                ></DeleteModelGSTR3B>
            }


        </Fragment>
    )
}

export default GSTR3BFileDataDetails
