// ** Reactstrap Imports
import {
  Button, Col, Nav, NavItem, NavLink,
  DropdownToggle,
  UncontrolledButtonDropdown,
  Tooltip,
  Modal,
  ModalBody,
  ModalHeader,
  Label,
  Row,
} from 'reactstrap'
import React, { useState, useRef, useEffect, Fragment } from 'react';
import Swal from 'sweetalert2'
import Select from 'react-select' // eslint-disable-line
import { selectThemeColors } from '@utils'
import makeAnimated from 'react-select/animated'
const animatedComponents = makeAnimated()
// ** Icons Imports
import {
  Download,  X
} from 'react-feather'
import Gstr2bService from '../../../services/gstr/gstr2bService'
// ** Third Party Imports
import toast from 'react-hot-toast'
import errorCodeConfig from '../../../configs/apiErrorCodeConfig'

// ** Store & Actions
import { getGSTR2BSummary } from '../../../views/apps/user/store'
import { useDispatch, useSelector } from 'react-redux'
import { DROPDOWN_PLACEHOLDER } from '../../../configs/config';
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);
import { useHotkeys } from 'react-hotkeys-hook';
import { keysMap , enableOnFormTags } from "../../../configs/config";
import { globleVariable } from "../../../configs/globalVariable";
import LocalFunction from '../../../configs/getLocalFunction'
import SessionFunction from '../../../configs/getSessionFunction'

const DropDownGSTRSplitImport = ({ clientId, finYear, finMonth, loadFunction , isLoading , userId , GstIn  }) => {

  //** Hook
  const [tooltipOpen, setTooltipOpen] = useState(false)
  const [selectId, setSelectId] = useState(null)
  const inputFile = useRef(null)
  const [show, setShow] = useState(false);
  const [panData, setPanData] = useState([]);
  const [panDataFrom, setPanDataFrom] = useState([]);
  const [finFromYear, setFinFormYear] = useState(null);
  const [finToYear, setFinToYear] = useState(null);
  const [monthFrom, setMonthFrom] = useState(null);
  const [monthTo, setMonthTo] = useState(null);
  const [files, setFiles] = useState([])
  const [block, setBlock] = useState(false)
  const ref = useRef(null);
  const dispatch = useDispatch()
  const [uploadStatus, setUploadStatus] = useState(false);

  //** Range wise year
  const finYearOption = LocalFunction.getLocalValue(globleVariable.rangeFiltersGSTR2B , true);
  const YearList = finYearOption !== undefined &&  finYearOption !== null &&  finYearOption !== "" && finYearOption !== 'undefined' ? JSON.parse(finYearOption) : [];

  //** From and To Date
  useEffect(() => {
    setPanData(YearList);
    setPanDataFrom(YearList);
    return () => setBlock(false)
  }, [])


   //** Shortcut keys
   useHotkeys(keysMap.IMPORT_DATA , () =>  { isLoading == false && exSelect()  } , {enableOnFormTags}  );

  // ** Search
  const gstrSummary = () => {
    const userData = {
      clientid: clientId,
      finyear:  sessionStorage.getItem(globleVariable.selectExportFromDt),
      finmonth: sessionStorage.getItem(globleVariable.selectExportToDt)
    }
    dispatch(getGSTR2BSummary(userData))
  }

  // ** From month - selection
  const selectFromYear = (value) => {
    console.log("value=", value)
    setFinFormYear(value?.value);

  }

  // ** To month - selection
  const selectFromMonth = (value) => {
    // setErrorMsg('');
    setMonthTo(value);
    setMonthFrom(value?.value);
  }


   // ** onChange - select file
  const handleChange = (e) => {
    const chosenFiles = Array.prototype.slice.call(e.target.files)
    var fileName = e.target.files[0];
    if (e.target.files.length > 0) {
      if (fileName.name.lastIndexOf('.xlsx').toString().toLowerCase()  === -1 && fileName.name.lastIndexOf('.xls').toString().toLowerCase()  === -1) {
        toast.error("Please note: only excel file formats are allowed.", { position: "top-right" })
      } else {
        const uploadData = new FormData();
        chosenFiles.forEach(item => {
          uploadData.append(`File`, item);
        });

        setBlock(true)
        loadFunction(true);

        //** New Code
        Gstr2bService.importGSTR2BGovtFile(uploadData,
          clientId,
          userId,
          finFromYear ? finFromYear : panDataFrom?.filter((item) => item.value == sessionStorage.getItem(globleVariable.selectExportFromDt))[0]?.value,
          GstIn
        ).then(res => {
          console.log(res);
          setBlock(false);
          loadFunction(false);
          if (res.status === 200 && res.data.status === errorCodeConfig.APIDefaultCode.Success) {
            toast.success(res.data.successMessage, {
              position: "top-right",
            });
            gstrSummary()
            setShow(false);
            e.target.value = null
          } else {
            Swal.fire({
              icon: 'error',
              title: '',
              text: res?.data?.errorMessage,
              customClass: {
                confirmButton: 'btn btn-outline-danger'
              },
              buttonsStyling: false
            })
            setShow(false);
            // inputFile.current.remove();
          }
        }).catch(error => {
          setBlock(false)
          loadFunction(false);
          setShow(false);
          Swal.fire({
            icon: 'error',
            title: '',
            text: error?.message,
            customClass: {
              confirmButton: 'btn btn-outline-danger'
            },
            buttonsStyling: false
          })
        })
      }
    }
    setTooltipOpen(false)
    e.target.value = null
  };


  // **  dropdown select
  const exSelect = () => {
    setFinFormYear(null)
    setShow(true)
    setTooltipOpen(false);
    document.getElementById('exportGstr2bImport').blur();
  }

  //** import
  const onClickiImportFile = () => {
    console.log('govt file')
    return MySwal.fire({
      title: "Click 'YES' If you wish to replace data then along with this your reconciliation action(If taken) will also be deleted.",
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      customClass: {
        confirmButton: 'btn btn-outline-danger ms-1',
        cancelButton: 'btn btn-outline-secondary ms-1'
      },
      buttonsStyling: false,
    }).then(function (result) {
      if (result.value) {
        inputFile.current.click();
      } else {
        setShow(false);
      }
    })
  }

  // ** Close modal
  const closeModal = () => {
    setShow(false)
  }

  return (
    <Fragment>
      <UncontrolledButtonDropdown onClick={() => exSelect()} >
        <DropdownToggle color='danger' className=' me-1 btn-icon btn-round dropdown-toggle'
          id="exportGstr2bImport" outline >
          <Download size={14} />
          <span className='align-middle ms-50'>Import [{keysMap.IMPORT_DATA}] </span>
          <Tooltip
            placement='top'
            isOpen={tooltipOpen}
            target='exportGstr2bImport'
            toggle={() => setTooltipOpen(!tooltipOpen)}
          >
            Import
          </Tooltip>
        </DropdownToggle>
      </UncontrolledButtonDropdown>

      <Modal backdrop="static" isOpen={show} toggle={() => setShow(!show)} className='modal-dialog-centered  modal-sm'>
        <div className='modal-header'>
          <h2 className='modal-title w-100 text-center'>Import Data</h2>
          <div className='modal-actions'>
            <a  onClick={() => setShow(!show)} className='text-body'>
              <X size={14} />
            </a>
          </div>
        </div>

        <hr style={{ margin: "0px" }}></hr>
        <ModalBody className='px-sm-2 mx-30 pb-2'>
          <Row tag='form' className='gy-1 pt-75' >
            <Col xs={3}>
            </Col>
            <Col xs={6}>
              <Label className='form-label' for='status'>
                <b>Return Period</b>
              </Label>
              <Select
                id="purchaseId_invtype"
                maxMenuHeight="120px"
                isClearable={false}
                theme={selectThemeColors}
                closeMenuOnSelect={true}
                components={animatedComponents}
                placeholder={DROPDOWN_PLACEHOLDER}
                options={panDataFrom}
                className="basic-multi-select"
                classNamePrefix='select'
                defaultValue={panDataFrom?.filter((item) => item.value == sessionStorage.getItem(globleVariable.selectExportFromDt))[0]}
                onChange={selectFromYear}
              />
            </Col>

            <Col xs={12} className='text-center pt-50'>
              <Button className='me-1' color='danger' onClick={onClickiImportFile} outline>
                Continue
              </Button>
              <Button type='reset' color='secondary' outline onClick={closeModal}>
                Cancel
              </Button>
              <input type='file' id='file' multiple ref={inputFile} onChange={(e) => handleChange(e)} style={{ display: 'none' }} />
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </Fragment>
  )
}


export default DropDownGSTRSplitImport
