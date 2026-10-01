import React from 'react'
import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import Breadcrumbs from '@components/breadcrumbs'
import { Fragment } from 'react'
import { useRef } from 'react'
import { Button, Card, CardBody, Col, Row, Table, UncontrolledTooltip } from 'reactstrap'
import { HotTable, HotColumn } from "@handsontable/react";
import { registerAllModules } from "handsontable/registry";
import { useEffect } from 'react'
import { Plus, PlusSquare } from 'react-feather'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'
import errorCodeConfig from '../../../configs/apiErrorCodeConfig'
import { keysMap, enableOnFormTags, RowSize, columnHeaderSize } from '../../../configs/config'
import GSTR3bService from '../../../services/gstr3b/gstr3bService'
import { useHotkeys } from 'react-hotkeys-hook';
import withReactContent from "sweetalert2-react-content";
import { globleVariable } from '../../../configs/globalVariable'
import LocalFunction from '../../../configs/getLocalFunction'
import SessionFunction from '../../../configs/getSessionFunction'
import { urlEndpointConfig } from "@configs/urlEndpoint";

const MySwal = withReactContent(Swal);
registerAllModules();

const SuppliesMade = () => {

  const tblrows = {
    placeOfSupply: "",
    taxableValue: "",
    igst: "",
  };

  const location = useLocation()
  const [supplyData, setSupplyData] = useState([]);
  const [block, setBlock] = useState(false)
  const [state, setState] = useState([]);
  const [errorArr, setErrorArr] = useState([]);
  const [disableSave, setDisableSave] = useState(false)

  useEffect(() => {
    errorArr.length > 0 ? setDisableSave(true) : setDisableSave(false)
  })

  const hotRef = useRef()

  let supplyTitle = '';
  let supplyId = 1;

  //** Shortcut keys
  useHotkeys(keysMap.SAVE_DATA, () => { block == false && errorArr.length < 1 && saveSupplyData() }, { enableOnFormTags });
  useHotkeys(keysMap.ADD_ENTRY, () => addNewRows(), { enableOnFormTags });

  const G_UCParId = sessionStorage.getItem(globleVariable.G_UCParId) && SessionFunction.getSessionValue(globleVariable.G_UCParId, true)
  const G_UCID = sessionStorage.getItem(globleVariable.G_UCID) && SessionFunction.getSessionValue(globleVariable.G_UCID, true)
  const gstr3BToDt = sessionStorage.getItem(globleVariable.gstr3BToDt) && SessionFunction.getSessionValue(globleVariable.gstr3BToDt, true)

  // ** supplie Columns
  const supplierColumns = [
    {
      data: "placeOfSupply",
      type: "dropdown",
      source: state && state.map((item) => item.text),
      title: `<div> Place of Supply <span style="color: red;">*</span></div>`,
      allowInvalid: false,

    },
    {
      data: "taxableValue",
      // title: "Total Taxable Value (₹)*",
      title: `<div> Total Taxable Value (₹) <span style="color: red;">*</span></div>`,
      type: "numeric",
      numericFormat: {
        pattern: '0.00'
      },
    },

    {
      data: "igst",
      // title: `IGST (₹) *`,
      title: `<div> IGST (₹) <span style="color: red;">*</span></div>`,
      type: "numeric",
      numericFormat: {
        pattern: '0.00'
      },
    },
    {
      data: "placeOfSupplyValue",
      title: "Place Of Supplay Value *"
    }
  ]

  if (location.state !== null) {
    supplyId = location.state.suppliesId !== null && location.state.suppliesId !== "null" ? location.state.suppliesId : 1
    supplyTitle = location.state.title !== null && location.state.title !== "null" ? location.state.title : ''
  }

  useEffect(() => {
    getSuppliesData()
  }, [])

  // For Data Save
  const saveSupplyData = () => {

    let errorArray = [];

    errorArr && errorArr.sort((a, b) => a.table > b.table ? 1 : -1).map((err) => {
      var val = supplyData[err.row][supplierColumns[err.col].data]
      if (isNaN(val)) {
        errorArray.push({
          rowNo: err.row
        });
      }
    })
    // console.log(errorArray, "errorArr...");
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
      setBlock(true)
      console.log(supplyData, "supplyData");
      const filledRows = supplyData.filter(x => x.placeOfSupply || x.taxableValue || x.igst).length
      const validatedRows = supplyData.filter(x => x.placeOfSupply && x.taxableValue && x.igst).length
      const finalData = supplyData.filter((i) => i.placeOfSupply && i.taxableValue && i.igst).map((item) => ({
        taxableValue: String(item.taxableValue),
        igst: String(item.igst),
        placeOfSupply: state.find(place => place.text === item.placeOfSupply)?.value || ''
      }))
      const payload = {
        "userClientId": G_UCID,
        "userId": LocalFunction.getLocalValue(globleVariable.userId, true),
        "range": gstr3BToDt,
        "type": supplyId,
        "data": finalData
      }

      if (filledRows > validatedRows) {
        const errmsg = (filledRows - validatedRows === 1) ? `${filledRows - validatedRows } row is invalid.` : `${filledRows - validatedRows} rows are invalid.`;
        toast.error(` ${errmsg} All three fields are required.`,
          { position: "top-right", }
        )
        setBlock(false)
      }

      else {
        GSTR3bService.Gstr3bSaveSuppliesData(payload).then((res) => {
          if (res.status === 200 && res.data.status === errorCodeConfig.APIDefaultCode.Success) {
            setBlock(false);
            console.log(res);
            toast.success(res.data.successMessage, {
              position: "top-right",
            });
            getSuppliesData()
          }
          else {
            setBlock(false)
            toast.error(res?.data?.errorMessage, {
              position: "top-right",
            });
          }
        }).catch((error) => {
          setBlock(false)
          getSuppliesData()
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
    }
  }

  // For Add A New Row
  function addNewRows(e) {
    setSupplyData([...supplyData, tblrows]);
  }

  const getSuppliesData = () => {
    setBlock(true)
    GSTR3bService.getGSTR3BSupplies(G_UCParId, gstr3BToDt, supplyId).then((res) => {

      if (res.status === 200 && res.data.status === errorCodeConfig.APIDefaultCode.Success) {
        setBlock(false)
        console.log(res, "supplies data");
        setState(res.data?.data?.state);
        const supplyDataRes = res.data?.data?.details
        const supplyDataLen = res.data?.data?.details?.length
        const stateData = res.data?.data?.state
        const updatedData = supplyDataRes.map(item => ({
          ...item,
          placeOfSupply: stateData.find(place => place.value === item.placeOfSupply)?.text || '',
          placeOfSupplyValue: item.placeOfSupply
        }));
        if (supplyDataLen < 5) {
          for (let i = 0; i < 5 - supplyDataLen; i++) {
            updatedData.push({ tblrows });
          }
        }
        console.log(updatedData, "final supply data");
        setSupplyData(updatedData)
      } else {
        setBlock(false)
        toast.error(res?.data?.errorMessage, {
          position: "top-right",
        });
      }


    }).catch((error) => {
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

  const cellChange = (change, source) => {
    if (source === 'CopyPaste.paste' || source === 'edit' || source === 'Autofill.fill') {

      const hot = hotRef?.current?.hotInstance;
      let withoutErrArr = []
      for (let i = 0; i < change.length; i++) {
        const [row, col, , value] = change[i]; // Get the edited cell value
        const colIndex = supplierColumns.findIndex((obj) => obj.data === col)

        if (colIndex > 0) {
          const oldVal = change[i][2]
          const cellObj = {
            row: row,
            col: colIndex
          }
          // Check if the edited value is numeric
          // if (isNaN(value)) {
          //   setErrorArr(pre => [...pre, cellObj])
          // }
          // else {
            if (errorArr.findIndex(y => y.row == cellObj.row && y.col == cellObj.col) != -1) {
              withoutErrArr.push(cellObj)
            }

          // }
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
  var breadTitle = 'Supply'
  const theader = (col, TH) => {

    if (col == 1 || col == 2 || col == 3) {
      TH.className = 'htRight'
    } else {
      TH.className = 'htLeft'
    }
  };
  return (
    <Fragment>
      {block && <div className="loading1">Loading&#8230;</div>}
      <div className='content-header row py-1'>
        <div className='content-header-left col-md-8 col-12'>
          <div className='row breadcrumbs-top'>
            <div className='col-12'>
              <Breadcrumbs title='Supplies Made' data={[{ title: 'GST Returns',link: urlEndpointConfig.GSTR_All }, { title: 'GSTR-3B Summary', link: '/gst-returns/gstr3b' }, { title: `${supplyTitle}` }]} />
            </div>
          </div>
        </div>
        <div className='content-header-right text-md-end col-md-4 col-12 d-md-block d-none'>
          <Button className='btn-icon me-1' outline color='danger' id="btnSave" onClick={saveSupplyData}>
            <PlusSquare size={14} />
            <span className='align-middle ms-50'>Save</span>
            <UncontrolledTooltip placement="top" target="btnSave">
              Save [{keysMap.SAVE_DATA}]
            </UncontrolledTooltip>
          </Button>
        </div>

      </div>
      <div className='p-0'>
        <h2 className="mb-1">{supplyTitle}</h2>
      </div>
      <Card>
        <CardBody className="CardBody p-0">
          <Row>
            <div className="col-lg-12 ">
              <HotTable
                id="tblsupply"
                rowHeights={RowSize}
                columnHeaderHeight={columnHeaderSize}
                ref={hotRef}
                preventOverflow="horizontal"
                contextMenu={false}
                // rowHeights="35"
                height="auto"
                rowHeaders={false}
                stretchH="all"
                data={supplyData}
                columns={supplierColumns}
                hiddenColumns={{
                  columns: [3]
                }}
                afterChange={cellChange}
                afterGetColHeader={theader}
                afterRenderer={(TD, row, col, prop, value) => {
                  if (col > 0 && (errorArr.findIndex(y => y.row == row && y.col == col) != -1)) {
                    TD.style.backgroundColor = "red";
                  }

                }}
                licenseKey="non-commercial-and-evaluation"
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
                      col == 2
                    ) {
                      if (!reg.test(e.key)) {
                        e.preventDefault();
                      }
                    }
                  }
                }}
              // beforeCreateRow={function (index, amount) {
              //   let countRow = this?.countRows();
              //   if (this?.isEmptyRow(countRow - 0)) {
              //     return false;
              //   }
              //   return true;
              // }}
              />
            </div>
            <div className="col-lg-12 py-1 px-0">
              <Button
                className="btn-icon ms-1"
                color="danger"
                outline
                id="btnAddRow"
                onClick={(e) => addNewRows(e)}
                size="sm"
              >
                <Plus size={14} />
                <span className="align-middle ms-50">
                  Add Line
                </span>
                <UncontrolledTooltip placement="top" target="btnAddRow">
                  Add Line [{keysMap.ADD_ENTRY}]
                </UncontrolledTooltip>
              </Button>
            </div>
          </Row>
        </CardBody>
      </Card>


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
        <td>{item.rowNo + 1}</td>
        <td>Only Numeric Value Allowed</td>
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


export default SuppliesMade