import React, { memo, useMemo } from 'react'
import { useState } from 'react'
import { Fragment } from 'react'
import { useRef } from 'react'
import { Button, Card, CardBody, Col, Row, Table, UncontrolledTooltip } from 'reactstrap'
import { HotTable } from "@handsontable/react";
import { registerAllModules } from "handsontable/registry";
import { useEffect } from 'react'
import { Plus, PlusSquare } from 'react-feather'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'
import errorCodeConfig from '@configs/apiErrorCodeConfig'
import { keysMap, enableOnFormTags, RowSize, columnHeaderSize } from '@configs/config'
import { useHotkeys } from 'react-hotkeys-hook';
import withReactContent from "sweetalert2-react-content";
import { globleVariable } from '@configs/globalVariable'
import LocalFunction from '@configs/getLocalFunction'
import SessionFunction from '@configs/getSessionFunction'
import gstr1PurchaseInvoiceService from '../../../services/gstr1/gstr1Services/gstr1PurchaseInvoiceService'
import Handsontable from "handsontable";
import $ from "jquery";

const MySwal = withReactContent(Swal);
registerAllModules();

const Gstr1SuppliesMade = ({ payload }) => {

    //**  useState And Variable
    const [supplyData, setSupplyData] = useState([]);
    const [block, setBlock] = useState(false)
    const [state, setState] = useState([]);
    const [errorArr, setErrorArr] = useState([]);
    const [getData, setGetData] = useState([]);
    const hotRef = useRef()
    const getPayloaData = payload

    const tblrows = {
        srNo: '',
        type: '',
        eComGSTIN: "",
        suppValue: "",
        igst: "",
        cgst: "",
        sgst: "",
        cgst: "",
        cess: ""
    };

    //**  Get SessionStorage Data
    const G_FY = sessionStorage.getItem(globleVariable.G_FY) && SessionFunction.getSessionValue(globleVariable.G_FY, true)
    const G_FM = sessionStorage.getItem(globleVariable.G_FM) && SessionFunction.getSessionValue(globleVariable.G_FM, true)

    //** Shortcut keys
    useHotkeys(keysMap.SAVE_DATA, () => { block == false && errorArr.length < 1 && saveSupplyData() }, { enableOnFormTags });
    useHotkeys(keysMap.ADD_ENTRY, () => addNewRows(), { enableOnFormTags });

    // ** supplie Columns
    const supplierColumns = [
        {
            data: "srNo",
            title: 'No',
        },
        {
            data: "type",
            type: "dropdown",
            source: state && state?.map((item) => item?.label),
            title: 'Type',
            allowInvalid: false,
            width: 145

        },
        {
            data: "eComGSTIN",
            title: 'GSTIN of e-commerce Operator ',

        },
        {
            data: "suppValue",
            title: 'Net Value Of Supplies (₹)',
            type: "numeric",
            numericFormat: {
                pattern: '0.00'
            },
        },

        {
            data: "igst",
            title: `Integrated Tax (₹)`,
            type: "numeric",
            numericFormat: {
                pattern: '0.00'
            },
        },
        {
            data: "cgst",
            title: `Central Tax (₹)`,
            type: "numeric",
            numericFormat: {
                pattern: '0.00'
            },
        },
        {
            data: "sgst",
            title: `State/UT Tax (₹)`,
            type: "numeric",
            numericFormat: {
                pattern: '0.00'
            },
        },
        {
            data: "cess",
            title: `Cess (₹)`,
            type: "numeric",
            numericFormat: {
                pattern: '0.00'
            },
        },
        {
            data: '',
            title: 'Action'
        }
    ]

    // **  For Data Save
    const saveSupplyData = async () => {
        let errorArray = [];

        if (errorArr) {
            errorArr.sort((a, b) => (a.table > b.table ? 1 : -1)).forEach((err) => {
                const val = supplyData[err.row][supplierColumns[err.col].data];
                if (isNaN(val)) {
                    errorArray.push({ rowNo: err.row });
                }
            });
        }

        if (errorArray.length > 0) {
            return MySwal.fire({
                title: "<strong>Error</strong>",
                icon: "error",
                html: <ErrorTable errorDataList={errorArray} />,
                customClass: {
                    confirmButton: "btn btn-danger",
                },
                buttonsStyling: false,
                width: 600,
            });
        }

        setBlock(true);

        const filledRows = supplyData.filter(row => row.type || row.eComGSTIN || row.suppValue || row.igst || row.cgst || row.sgst || row.cess).length;
        const validatedRows = supplyData.filter(row => row.type && row.eComGSTIN && row.suppValue !== null && row.igst !== null && row.cgst !== null && row.sgst !== null && row.cess !== null).length;

        const finalData = supplyData
            .filter(row => row.type && row.eComGSTIN && row.suppValue !== null && row.igst !== null && row.cgst !== null && row.sgst !== null && row.cess !== null)
            .map((item, index) => ({
                eComGSTIN: String(item.eComGSTIN),
                suppValue: String(item.suppValue)?.replaceAll(",", ""),
                igst: String(item.igst)?.replaceAll(",", ""),
                cgst: String(item.cgst)?.replaceAll(",", ""),
                sgst: String(item.sgst)?.replaceAll(",", ""),
                cess: String(item.cess)?.replaceAll(",", ""),
                type: state.find(place => place.label === item.type)?.value || '',
                originalMonth: getPayloaData?.fromRange || '',
                gstr1SupecoId: getData?.[index]?.gstr1SUPECOId || '',
            }));

        const payload = {
            fkUserClientId: getPayloaData?.userClientId || '',
            userId: LocalFunction.getLocalValue(globleVariable.userId, true),
            returnPeriod: getPayloaData?.fromRange || '',
            fkGstr1SectionId: getPayloaData?.sectionId[0],
            fkFinancialYearId: G_FY,
            month: G_FM,
            data: finalData
        };

        if (filledRows > validatedRows) {
            const errmsg = `${filledRows - validatedRows} row${filledRows - validatedRows > 1 ? 's' : ''} are invalid. All fields are required.`;
            toast.error(errmsg, { position: "top-right" });
            setBlock(false);
        } else {
            try {
                const res = await gstr1PurchaseInvoiceService.saveDataGstr1Supeco(payload);

                if (res.status === 200 && res.data.status === errorCodeConfig.APIDefaultCode.Success) {
                    toast.success(res?.data?.successMessage, { position: "top-right" });
                } else {
                    toast.error(res?.data?.errorMessage, { position: "top-right" });
                }

                getSuppliesData();
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: '',
                    text: error?.message,
                    customClass: {
                        confirmButton: 'btn btn-danger'
                    },
                    buttonsStyling: false
                });
                getSuppliesData();
            } finally {
                setBlock(false);
            }
        }
    };


    // ** For Add A New Row
    function addNewRows(e) {
        setSupplyData([...supplyData, tblrows]);
    }

    // ** For get Data 
    const getSuppliesData = async () => {
        if (!payload || (Object.keys(payload).length === 0 && payload.constructor === Object)) {
            return;
        }

        setBlock(true);

        try {
            const res = await gstr1PurchaseInvoiceService.getDataGstr1Supeco(payload);

            if (res.status === 200 && res.data.status === errorCodeConfig.APIDefaultCode.Success) {
                setBlock(false);
                const { data: { type: stateData, data: supplyDataRes } } = res?.data;

                const updatedData = supplyDataRes.map(item => ({
                    ...item,
                    type: stateData.find(place => place.value === item.type)?.label || '',
                    typeValue: item.type,
                }));

                while (updatedData.length < 5) {
                    updatedData.push({ tblrows });
                }

                setState(stateData);
                setGetData(supplyDataRes);
                setSupplyData(updatedData);
            } else {
                setBlock(false);
                toast.error(res?.data?.errorMessage, {
                    position: "top-right",
                });
            }
        } catch (error) {
            setBlock(false);
            Swal.fire({
                icon: 'error',
                title: '',
                text: error.message,
                customClass: {
                    confirmButton: 'btn btn-danger'
                },
                buttonsStyling: false
            });
        }
    };


    // ** Intial getData Api Call WhenEver Payload Change
    useEffect(() => {

        getSuppliesData();

    }, [payload]);

    // **  For Cell Data Validation
    const cellChange = (change, source) => {
        if (source === 'CopyPaste.paste' || source === 'edit' || source === 'Autofill.fill') {

            const hot = hotRef?.current?.hotInstance;
            let withoutErrArr = []
            for (let i = 0; i < change.length; i++) {
                const [row, col, , value] = change[i]; // Get the edited cell value
                const colIndex = supplierColumns.findIndex((obj) => obj.data === col)

                if (colIndex > 2) {
                    const oldVal = change[i][2]
                    const cellObj = {
                        row: row,
                        col: colIndex
                    }
                    // Check if the edited value is numeric
                    if (isNaN(value)) {
                        setErrorArr(pre => [...pre, cellObj])
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

    // **  For Header AlignMent
    const theader = (col, TH) => {

        if (col == 0 || col == 1 || col == 2) {
            TH.className = 'htLeft'
        } else {
            TH.className = 'htRight'
        }
    };

    // **  Add Delete btn in Grid
    function myBtns(instance, td, row, col, prop, value, cellProperties) {
        Handsontable.renderers.TextRenderer.apply(this, arguments);

        td.innerHTML =
            '<button class="btn add-deactive" title="Delete"><i class="fa fa-trash"></i></button>';
        const hot = hotRef?.current?.hotInstance;
        $(td)
            .find(".add-deactive")
            .on("click", (event) => {

                let { gstr1SUPECOId } = hot?.getSourceDataAtRow(cellProperties.row);
                deleteGSTR1HSNInvoice(gstr1SUPECOId);

            });
    }

    // **  For Delete Data
    const deleteGSTR1HSNInvoice = async (id) => {
        try {
            const result = await MySwal.fire({
                title: "Are you sure delete this Record?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, delete it!",
                customClass: {
                    confirmButton: "btn btn-danger",
                    cancelButton: "btn btn-outline-dark ms-1",
                },
                buttonsStyling: false,
            });

            if (result.isConfirmed) {
                const supecoid = { Gstr1SupecoId: [id] };
                setBlock(true);

                const res = await gstr1PurchaseInvoiceService.deleteDataGstr1Supeco(supecoid);

                if (res?.status === 200 && res?.data?.status === errorCodeConfig.APIDefaultCode.Success) {
                    toast.success(res?.data?.successMessage, { position: "top-right" });
                    getSuppliesData();
                } else {
                    toast.error(res?.data?.errorMessage, { position: "top-right" });
                }
            }
        } catch (error) {
            toast.error(error?.message, { position: "top-right" });
        } finally {
            setBlock(false);
        }
    };

    return (
        <Fragment>
            {block && <div className="loading1">Loading&#8230;</div>}

            <div className='p-0'>
                <Row>
                    <Col md='10'> <h2>Supplies made through E-Commerce Operator(Liable to collect Tax u/s 52 (TCS))</h2></Col>
                    <Col md='2'>
                        <div className="float-end col-md-6 mb-1 text-end">
                            <Button className='btn-icon me' outline color='danger' id="btnSave" onClick={saveSupplyData}>
                                <PlusSquare size={14} />
                                <span className='align-middle ms-50'>Save</span>
                                <UncontrolledTooltip placement="top" target="btnSave">
                                    Save [{keysMap.SAVE_DATA}]
                                </UncontrolledTooltip>
                            </Button>
                        </div>
                    </Col>

                </Row>

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
                                height="auto"
                                rowHeaders={false}
                                stretchH="all"
                                data={supplyData}
                                columns={supplierColumns}

                                afterChange={cellChange}
                                afterGetColHeader={theader}
                                afterRenderer={(TD, row, col, prop, value) => {
                                    if (col > 2 && (errorArr.findIndex(y => y.row == row && y.col == col) != -1)) {
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
                                            col > 2
                                        ) {
                                            if (!reg.test(e.key)) {
                                                e.preventDefault();
                                            }
                                        }
                                    }
                                }}
                                cells={function (row, col) {
                                    var cp = {};
                                    const hot = hotRef?.current?.hotInstance;

                                    if (col === 8 && row < getData?.length) {
                                        cp.renderer = myBtns;
                                        cp.readOnly = true;
                                        cp.className = "text-center";
                                    } else if (col > 2) {
                                        cp.className = 'text-end'
                                    }

                                    return cp;
                                }}

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


export default Gstr1SuppliesMade