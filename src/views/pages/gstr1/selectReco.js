import React, { useState, useEffect } from "react";
import errorCodeConfig from "../../../configs/apiErrorCodeConfig";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import Flatpickr from "react-flatpickr";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import {
  Row,
  Col,
  Card,
  Input,
  Label,
  Button,
  Modal,
  ModalBody,
} from "reactstrap";
import { X, FileText,ArrowRight,ArrowLeft } from "react-feather";
import makeAnimated from "react-select/animated";
const animatedComponents = makeAnimated();
import { selectThemeColors } from "@utils";
import Select from "react-select"; // eslint-disable-line
import gstpanService from "../../../services/gstpan/gstpanService";
import recoService from "../../../services/Reco/gstr1vsEinvoiceServices/gstr1vseinvoice";
import { useNavigate } from "react-router-dom";
import { DROPDOWN_PLACEHOLDER } from "../../../configs/config";
import { globleVariable } from "../../../configs/globalVariable";
import LocalFunction from "../../../configs/getLocalFunction";
import SessionFunction from "../../../configs/getSessionFunction";

const SelectReco = ({wizardBtn,stepper}) => {
  console.log(wizardBtn,"steppere")
  // const { composeOpen, toggleCompose, GUCParId, userIds, G_FM, G_FY } = props;
  const GUCParId =  sessionStorage.getItem(globleVariable.G_UCParId) &&
  SessionFunction.getSessionValue(globleVariable.G_UCParId, true);

  const userIds = LocalFunction.getLocalValue(globleVariable.userId, true)
  ? LocalFunction.getLocalValue(globleVariable.userId, true)
  : " ";

  const G_GSTIN = SessionFunction.getSessionValue(globleVariable.G_GSTIN, true);
  const subscriptionId =
    localStorage.getItem(globleVariable.subscriptionId) &&
    LocalFunction.getLocalValue(globleVariable.subscriptionId, true);

    const gstr1Range =
    sessionStorage.getItem(globleVariable.defaultYear) &&
    SessionFunction.getSessionValue(globleVariable.defaultYear, true);

  const [picker1, setPicker1] = useState("");
  const [picker11, setPicker11] = useState("");
  const [picker2, setPicker2] = useState("");
  const [picker22, setPicker22] = useState("");
  const [invalidaDatarows, setvalidaDatarows] = useState([]);
  const [page, setPage] = useState(0);
  const [panData, setPanData] = useState([]);
  const [displayType, setDisplayType] = useState([]);
  const [panDataFrom, setPanDataFrom] = useState([]);
  const [b2panDataFrom, setB2PanDataFrom] = useState([]);
  const [panData1, setPanData1] = useState([]);
  const [docCount, setDocCount] = useState(0);
  const [docCount1, setDocCount1] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [block, setBlock] = useState(false);
  const [check1, setCheck1] = useState(false);
  const [check2, setCheck2] = useState(false);
  const [finFromYear, setFinFormYear] = useState(null);
  const [monthFrom, setMonthFrom] = useState(null);
  const [finFromYear1, setFinFormYear1] = useState(null);
  const [monthFrom1, setMonthFrom1] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [errorMsg2B, setErrorMsg2B] = useState("");
  const [errorMsg2BTo, setErrorMsg2BTo] = useState("");
  const [errorMsgPurchase, setErrorMsgPurchase] = useState("");
  const [errorMsgPurchaseTo, setErrorMsgPurchaseTo] = useState("");
  const [errorMsg2B1, setErrorMsg2B1] = useState("");
  const [errorMsg2B1To, setErrorMsg2B1To] = useState("");
  const [errorMsgPurchase1, setErrorMsgPurchase1] = useState("");
  const [errorMsgPurchase1To, setErrorMsgPurchase1To] = useState("");
  const [radiobtn, setRadiobtn] = useState(true);
  const [sameFlag, setSameFlag] = useState(false);
  const [fDate, setFDate] = useState();
  const [tDate, setTDate] = useState();

  const navigate = useNavigate();

  const b2finYearOption = LocalFunction.getLocalValue(
    globleVariable.rangeFilters,
    true
  );
  const b2YearList =
    b2finYearOption !== undefined &&
    b2finYearOption !== null &&
    b2finYearOption !== "" &&
    b2finYearOption !== "undefined"
      ? JSON.parse(b2finYearOption)
      : [];
  const finYearOption = LocalFunction.getLocalValue(
    globleVariable.rangeFilters,
    true
  );
  const YearList = JSON.parse(finYearOption);



  useEffect(() => {
    if(wizardBtn ==3 && finFromYear != null){
       get2BCount(
        finFromYear.value,
        monthFrom.value,
        picker1,
        picker11
      );
     getPurchaseCount(
        finFromYear1.value,
        monthFrom1.value,
        picker2,
        picker22
      );

    }
  },[wizardBtn]);

  useEffect(() => {
    console.log("default value");

    if (displayType == true) {
      let defaultValueFrom = null;
      let defaultValueTo = null;
      if (
        gstr1Range !== null &&
        gstr1Range !== "" &&
        gstr1Range !== undefined
      ) {
        console.log("set from date");
        defaultValueFrom = panData?.filter(
          (item) => item.value == gstr1Range
        )[0];
      } else {
        defaultValueFrom = panData?.filter(
          (item) =>
            Number(item.value) ==
            Number(
              sessionStorage.getItem(globleVariable.defaultYear) &&
              SessionFunction.getSessionValue(
                globleVariable.defaultYear,
                true
              )
            )
        )[0];
      }

      if (
        defaultValueFrom !== undefined &&
        defaultValueFrom !== null &&
        defaultValueFrom !== ""
      ) {
        setFinFormYear(defaultValueFrom);
        setMonthFrom(defaultValueFrom)
        setFinFormYear1(defaultValueFrom)
        setMonthFrom1(defaultValueFrom)
        sessionStorage.setItem("gstr1DownloadFromDt", defaultValueFrom?.value);
        SessionFunction.setSessionValue(
          globleVariable.gstr1FromDt,
          defaultValueFrom?.value,
          true
        );
      }
      // if (defaultValueTo !== undefined && defaultValueTo !== null && defaultValueTo !== "") {
      //     setMonthFrom(defaultValueTo)
      //     sessionStorage.setItem('gstr1SelectExportToDt', defaultValueTo?.value)
      // }
    }
  }, [displayType]);

  useEffect(() => {
    return () => {
      setBlock(false);
    };
  }, []);

  sessionStorage.removeItem("isReverseCharge");

  const handleCheck1 = (e) => {
    setCheck1(e.target.checked);
    if (!e.target.checked) {
      setPicker1(null);
      setPicker11(null);
      setErrorMsg2B1("");
      setErrorMsg2B1To("");
    }
  };

  const handleCheck2 = (e) => {
    setCheck2(e.target.checked);
    if (!e.target.checked) {
      setPicker2(null);
      setPicker22(null);
      setErrorMsgPurchase1("");
      setErrorMsgPurchase1To("");
    }
  };

  const radio2 = !radiobtn;

  const selectFromYear = (value) => {
    // console.log("value=", value)
    setFinFormYear(value);
    setFDate(value);
    setErrorMsg("");
    setErrorMsg2B("");
    setErrorMsg2BTo("");
    setMonthFrom(
      Number(monthFrom?.srNo) > Number(value?.srNo) ? monthFrom : panDataFrom[0]
    );
    setTDate(
      Number(tDate?.srNo) > Number(value?.srNo) ? tDate : panDataFrom[0]
    );
    const x = b2panDataFrom?.filter(
      (item) => Number(item.srNo) >= Number(value.srNo)
    );

    const y = { ...panDataFrom };
    setPanData(x);
    get2BCount(
      value?.value,
      monthFrom?.srNo > value?.srNo ? monthFrom?.value : panDataFrom[0]?.value,
      picker1,
      picker11
    );
  };

  const selectFromMonth = (value) => {
    setErrorMsg("");
    setErrorMsg2BTo("");
    setMonthFrom(value);
    setTDate(value);

    getPurchaseCount(finFromYear?.value, value?.value, picker2, picker22);
  };

  const selectFromYear1 = (value) => {
    // console.log("value=", value)
    setFinFormYear1(value);
    setFDate(value);
    setErrorMsg("");
    setErrorMsgPurchase("");
    setErrorMsgPurchaseTo("");
    setMonthFrom1(
      Number(monthFrom1?.srNo) > Number(value?.srNo)
        ? monthFrom1
        : panDataFrom[0]
    );
    setTDate(
      Number(tDate?.srNo) > Number(value?.srNo) ? tDate : panDataFrom[0]
    );
    const x = panDataFrom?.filter(
      (item) => Number(item.srNo) >= Number(value.srNo)
    );
    // console.log("month values1=", x);
    const y = { ...panDataFrom };
    setPanData1(x);
    getPurchaseCount(
      value?.value,
      monthFrom1?.srNo > value?.srNo
        ? monthFrom1?.value
        : panDataFrom[0]?.value,
      picker2,
      picker22
    );

    get2BCount(finFromYear?.value, monthFrom?.value, picker1, picker11);
  };

  const selectFromMonth1 = (value) => {
    setErrorMsg("");
    setErrorMsgPurchaseTo("");
    setMonthFrom1(value);
    setTDate(value);
    getPurchaseCount(finFromYear1?.value, value?.value, picker2, picker22);

    get2BCount(finFromYear?.value, monthFrom?.value, picker1, picker11);
  };

  const get2BCount = (fromRange, toRange, fromDate, toDate) => {
    if (fromRange && toRange) {
      recoService
        .getReco2BCount(fromRange, toRange, fromDate, toDate, GUCParId)
        .then((res) => {
          if (
            res.status === 200 &&
            res.data.status === errorCodeConfig.APIDefaultCode.Success
          ) {
            setDocCount(res?.data?.data?.totalRowCount);
            // props.count1(res?.data?.data?.totalRowCount);
          } else {
            // navigate('/2b-purchase-reco', { state: payload });
            Swal.fire({
              icon: "error",
              title: "",
              text: res?.data?.errorMessage,
              customClass: {
                confirmButton: "btn btn-danger",
              },
            });
            // setBlock(false)
          }
        })
        .catch((error) => {
          // setBlock(false)
          Swal.fire({
            icon: "error",
            title: "",
            text: error?.message,
            customClass: {
              confirmButton: "btn btn-danger",
            },
          });
        });
    }
  };

  const getPurchaseCount = (fromRange, toRange, fromDate, toDate) => {
    if (fromRange && toRange) {
      recoService
        .getRecoPurchaseCount(
          fromRange,
          toRange,
          fromDate,
          toDate,
          GUCParId,
          G_GSTIN,
          subscriptionId
        )
        .then((res) => {
          if (
            res.status === 200 &&
            res.data.status === errorCodeConfig.APIDefaultCode.Success
          ) {
            console.log("count data=", res?.data?.data);
            // props.count2(res?.data?.data?.totalRowCount);
            setDocCount1(res?.data?.data?.totalRowCount);
          } else {
            // navigate('/2b-purchase-reco', { state: payload });
            Swal.fire({
              icon: "error",
              title: "",
              text: res?.data?.errorMessage,
              customClass: {
                confirmButton: "btn btn-danger",
              },
            });
          }
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title: "",
            text: error?.message,
            customClass: {
              confirmButton: "btn btn-danger",
            },
          });
        });
    }
  };

  useEffect(() => {
    if(wizardBtn == 3 || wizardBtn == "3"){
    gstpanService
      .getGstPanSummary(userIds, "")
      .then((res) => {
        if (res.status === 200) {
          // console.log("res=", res?.data?.data);
          setPanData(YearList);
          setPanDataFrom(YearList);
          setB2PanDataFrom(b2YearList);
          setPanData1(YearList);
          setDisplayType(true)
        } else {
        }
      })
      .catch((error) => {
        // setBlock(false)
        Swal.fire({
          icon: "error",
          title: "",
          text: error?.message,
          customClass: {
            confirmButton: "btn btn-danger",
          },
        });
      });
    }
  }, [wizardBtn]);

  const sameDate = (e) => {
    setSameFlag(e.target.checked);
    // if (e.target.checked) {
    setFDate(finFromYear);
    setTDate(monthFrom);
    getPurchaseCount(finFromYear?.value, monthFrom?.value, picker2, picker22);
    setErrorMsgPurchase("");
    setErrorMsgPurchaseTo("");

    get2BCount(finFromYear?.value, monthFrom?.value, picker1, picker11);

    //  }
  };

  const onSubmit = () => {
    setBlock(true);
    if (
      finFromYear &&
      monthFrom &&
      (finFromYear1 || fDate) &&
      (monthFrom1 || tDate) &&
      ((fDate && sameFlag) || (finFromYear1 && !sameFlag)) &&
      ((tDate && sameFlag) || (monthFrom1 && !sameFlag)) &&
      ((check2 && picker2 && picker22) ||
        (!check2 && !(picker2 && picker22))) &&
      ((check1 && picker1 && picker11) || (!check1 && !(picker1 && picker11)))
    ) {
      const payload = {
        pageSize: 10,
        gstr1FiledFromFinancialYear: finFromYear?.value.slice(2, 6),
        gstr1FiledFromMonth: finFromYear?.value?.slice(0, 2),
        gstr1FiledToFinancialYear: monthFrom?.value?.slice(2),
        gstr1FiledToMonth: monthFrom?.value?.slice(0, 2),
        gstr1FromFinancialYear: !sameFlag
          ? finFromYear1?.value?.slice(2, 6)
          : fDate?.value?.slice(2, 6),
        gstr1FromMonth: !sameFlag
          ? finFromYear1?.value?.slice(0, 2)
          : fDate?.value?.slice(0, 2),
        gstr1ToFinancialYear: !sameFlag
          ? monthFrom1?.value.slice(2, 6)
          : tDate?.value?.slice(2, 6),
        gstr1ToMonth: !sameFlag
          ? monthFrom1?.value?.slice(0, 2)
          : tDate?.value?.slice(0, 2),
        gstr1FromDate: picker2 ? picker2 : null,
        gstr1ToDate: picker2 ? picker22 : null,
        gstr1FiledFromDate: picker1 ? picker1 : null,
        gstr1FiledToDate: picker1 ? picker11 : null,
        userClientId: GUCParId,
        userId: userIds,
        subscriptionId: subscriptionId,
        gstNumber: G_GSTIN,
        differenceTotalTaxableValue: 1,
        differenceIGST: 1,
        differenceCGST: 1,
        differenceSGST: 1,
        differenceCESS: 1,
        matchExcat: false,
        isReverseCharge: false,
        isDeleteAction: false,
        isSupplierDebitNote: false,
      };
      setErrorMsg("");


      localStorage.setItem("panData", JSON.stringify(panData));
      localStorage.setItem("panData1", JSON.stringify(panData1));
      localStorage.setItem("finFromYear", JSON.stringify(finFromYear));
      localStorage.setItem("monthFrom", JSON.stringify(monthFrom));
      localStorage.setItem("finFromYear1", JSON.stringify(finFromYear1));
      localStorage.setItem("monthFrom1", JSON.stringify(monthFrom1));
      localStorage.setItem("fDate", JSON.stringify(fDate));
      localStorage.setItem("tDate", JSON.stringify(tDate));
      localStorage.setItem("sameFlag", sameFlag);
      localStorage.setItem("check1", check1);
      localStorage.setItem("check2", check2);
      localStorage.setItem("picker1", JSON.stringify(picker1));
      localStorage.setItem("picker2", JSON.stringify(picker2));
      localStorage.setItem("picker11", JSON.stringify(picker11));
      localStorage.setItem("picker22", JSON.stringify(picker22));

      recoService
        .getRecoList(payload)
        .then((res) => {
          if (
            res.status === 200 &&
            res.data.status === errorCodeConfig.APIDefaultCode.Success
          ) {
            SessionFunction.setSessionValue(
              globleVariable.simpleRecoSummary,
              JSON.stringify(res?.data?.data),
              true
            );
            sessionStorage.setItem(
              "GSTR1vsEInvoice",
              // `GSTR1 (${finFromYear?.label} To ${monthFrom?.label}) vs E-Inv (${fDate?.label} To ${tDate?.label})`
              `GSTR1 (${finFromYear?.label} To ${monthFrom?.label}) vs E-Inv (${finFromYear1?.label} To ${monthFrom1?.label})`
            );

            navigate("/reconcilation/gstr1-e-invoice-reco", {
              state: { dataSummary: payload, dataReport: payload },
            });

            setBlock(false);
            // funCheck();
            setErrorMsg("");
            setErrorMsg2B("");
            setErrorMsg2B1("");
            setErrorMsg2B1To("");
            setErrorMsgPurchase("");
            setErrorMsgPurchase1("");
            // setPanData(res?.data?.data)
          } else {
            // navigate('/2b-purchase-reco', { state: payload });
            Swal.fire({
              icon: "error",
              title: "",
              text: res?.data?.errorMessage,
              customClass: {
                confirmButton: "btn btn-danger",
              },
            });
            setBlock(false);
          }
        })
        .catch((error) => {
          setBlock(false);
          Swal.fire({
            icon: "error",
            title: "",
            text: error?.message,
            customClass: {
              confirmButton: "btn btn-danger",
            },
          });
        });
    } else {
      if (!finFromYear) {
        setErrorMsg2B("Please Select!");
      }
      if (!monthFrom) {
        setErrorMsg2BTo("Please Select!");
      }
      if (!((fDate && sameFlag) || (finFromYear1 && !sameFlag))) {
        setErrorMsgPurchase("Please Select!");
      }
      if (!((tDate && sameFlag) || (monthFrom1 && !sameFlag))) {
        setErrorMsgPurchaseTo("Please Select!");
      }
      if (!((check1 && picker1) || (!check1 && !picker1))) {
        setErrorMsg2B1("Please Select!");
      }
      if (!((check1 && picker11) || (!check1 && !picker11))) {
        setErrorMsg2B1To("Please Select!");
      }
      if (!((check2 && picker2) || (!check2 && !picker2))) {
        setErrorMsgPurchase1("Please Select!");
      }
      if (!((check2 && picker22) || (!check2 && !picker22))) {
        setErrorMsgPurchase1To("Please Select!");
      }

      setBlock(false);
    }
  };

  // ** Toggles Compose POPUP
  const togglePopUp = (e) => {
    e.preventDefault();
    setFinFormYear(null);
    setMonthFrom1(null);
    setMonthFrom(null);
    setFinFormYear1(null);
    setFDate(null);
    setTDate(null);
    toggleCompose();
    setSameFlag(false);
    setDocCount(0);
    setDocCount1(0);
    setErrorMsg("");
    setErrorMsg2B("");
    setErrorMsg2BTo("");
    setErrorMsg2B1("");
    setErrorMsg2B1To("");
    setErrorMsgPurchase("");
    setErrorMsgPurchaseTo("");
    setErrorMsgPurchase1("");
    setErrorMsgPurchase1To("");
  };

  const onClickNext = () => {
    navigate('/gst-returns/gstr1-sales?processGstr1Filling=true')
    stepper.next()
  }

  const onClickSkip = () => {
    navigate('/gst-returns/gstr1-sales?processGstr1Filling=false')
    stepper.next()
  }

  return (

    <>
      {block && <div className="loading1">Loading&#8230;</div>}
      <div style={{marginTop:"20px", marginBottom:"10px" }} className="modal-header align-items-center">
        <h2 className="modal-title w-100 text-center ">
          Select Dates To Filter GSTR-1 And E-Invoice Document Data For Reconciliation
        </h2>
        <div className="modal-actions">

        </div>
      </div>
        <div className="mb-2">
          <Row>
            <Col md={7} className="text-danger" style={{ marginTop: "6px" }}>
              <FileText size={14}></FileText> {docCount} Documents
            </Col>
            <Col md="5" className="">
              <div className="d-flex align-items-center">
                <div>
                  <Input
                    type="checkbox"
                    onChange={handleCheck1}
                    checked={check1}
                    id="billing-switch"
                    name="billing-switch"
                  />
                </div>
                <Label size="small" className="ms-1">
                  Select document date for reconciliation
                </Label>
              </div>
            </Col>
          </Row>
          <Row>
            <div className="d-flex align-items-center mb-1"></div>
            <Col md="3">
              <Label className="form-label mb-1">From Month GSTR1</Label>

              <Select
                id="purchaseId_invtype"
                label="Section"
                placeholder={DROPDOWN_PLACEHOLDER}
                maxMenuHeight="120px"
                pageSize={10}
                isClearable={false}
                theme={selectThemeColors}
                closeMenuOnSelect={true}
                components={animatedComponents}
                value={finFromYear}
                options={b2panDataFrom}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={selectFromYear}
              />
              <p className="text-danger mt-1">{errorMsg2B}</p>
            </Col>

            <Col md="3">
              <Label className="form-label mb-1">To Month</Label>
              <Select
                id="purchaseId_invtype1"
                placeholder={DROPDOWN_PLACEHOLDER}
                isClearable={false}
                theme={selectThemeColors}
                closeMenuOnSelect={true}
                maxMenuHeight="120px"
                components={animatedComponents}
                options={panData}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={selectFromMonth}
                value={monthFrom}
              />
              <p className="text-danger mt-1">{errorMsg2BTo}</p>
            </Col>
            <Col md="1"></Col>
            <Col md="5">
              <Row>
                <Col md="6">
                  <Label className="ms-1 mb-1">From</Label>

                  <Flatpickr
                    value={picker1}
                    disabled={!check1}
                    id="startDate"
                    name="startDate"
                    className="form-control "
                    onChange={(date, i) => {
                      setPicker1(i);
                      setErrorMsg2B1("");
                    }}
                    options={{
                      minDate: "01-07-2017",
                      dateFormat: "d-m-Y",
                      // mode: 'range',
                      // defaultDate: ['2020-02-01', '2020-02-15']
                    }}
                  />
                  <p className="text-danger mt-1">{errorMsg2B1}</p>
                </Col>
                <Col md="6">
                  <Label className="ms-1 mb-1">To</Label>
                  <Flatpickr
                    value={picker11}
                    disabled={!check1 || !picker1}
                    id="endDate"
                    name="endDate"
                    className="form-control "
                    onChange={(date, i) => {
                      setPicker11(i);
                      setErrorMsg2B1To("");
                      get2BCount(
                        finFromYear?.value ? finFromYear?.value : "",
                        monthFrom?.value ? monthFrom?.value : "",
                        picker1,
                        i
                      );
                    }}
                    options={{
                      minDate: picker1,
                      dateFormat: "d-m-Y",
                    }}
                  />
                  <p className="text-danger mt-1">{errorMsg2B1To}</p>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>

        <Row>
          <Col xs={12}>
            <div className="d-flex align-items-center mb-2">
              <div className="form-switch">
                <Input
                  type="checkbox"
                  onChange={(e) => {
                    sameDate(e);
                  }}
                  checked={sameFlag}
                  id="billing-switch"
                  name="billing-switch"
                />
              </div>
              <Label
                className="form-check-label fw-bolder"
                for="billing-switch"
              >
                Same as Above
              </Label>
            </div>
          </Col>
        </Row>
        <Row>
          <Col md={7} className="text-danger">
            <FileText size={14}></FileText> {docCount1} Documents
          </Col>
          <Col md="5" className="">
            <div className="d-flex align-items-center mb-1">
              <div>
                <Input
                  type="checkbox"
                  onChange={handleCheck2}
                  checked={check2}
                  id="billing-switch"
                  name="billing-switch"
                />
              </div>
              <Label className="ms-1">
                Select Document date for reconciliation{" "}
              </Label>
            </div>
          </Col>
        </Row>
        <div>
          <Row>
            <Col md="3">
              <Label className="form-label mb-1">From Month E-Invoice</Label>
              <Select
                // styles={preventOverflow}
                id="purchaseId_invtype"
                placeholder={DROPDOWN_PLACEHOLDER}
                maxMenuHeight="120px"
                isClearable={false}
                theme={selectThemeColors}
                closeMenuOnSelect={true}
                components={animatedComponents}
                // imdulti
                value={sameFlag ? fDate : finFromYear1}
                options={panDataFrom}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={selectFromYear1}
              />
              <p className="text-danger mt-1">{errorMsgPurchase}</p>
            </Col>
            <Col md="3">
              <Label className="form-label mb-1">To Month</Label>
              <Select
                id="purchaseId_invtype1"
                placeholder={DROPDOWN_PLACEHOLDER}
                isClearable={false}
                theme={selectThemeColors}
                closeMenuOnSelect={true}
                maxMenuHeight="120px"
                components={animatedComponents}
                value={sameFlag ? tDate : monthFrom1}
                options={panData1}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={selectFromMonth1}
              />
              <p className="text-danger mt-1">{errorMsgPurchaseTo}</p>
            </Col>
            <Col md="1"></Col>
            <Col md={5}>
              <Row>
                <Col md="6">
                  <Label className="ms-1 mb-1">From</Label>
                  <Flatpickr
                    value={picker2}
                    disabled={!check2}
                    id="startDate1"
                    name="startDate1"
                    className="form-control "
                    onChange={(date, i) => {
                      setPicker2(i);
                      setErrorMsgPurchase1("");
                    }}
                    options={{
                      minDate: "01-07-2017",
                      dateFormat: "d-m-Y",
                      // mode: 'range',
                      // defaultDate: ['2020-02-01', '2020-02-15']
                    }}
                  />
                  <p className="text-danger mt-1">{errorMsgPurchase1}</p>
                </Col>
                <Col md="6">
                  <Label className="ms-1 mb-1">To</Label>
                  <Flatpickr
                    value={picker22}
                    disabled={!check2 || !picker2}
                    id="endDate1"
                    name="endDate1"
                    className="form-control "
                    onChange={(date, i) => {
                      setPicker22(i);
                      setErrorMsgPurchase1To("");
                    }}
                    options={{
                      minDate: picker2,
                      dateFormat: "d-m-Y",
                      // mode: 'range',
                      // defaultDate: ['2020-02-01', '2020-02-15']
                    }}
                  />
                  <p className="text-danger mt-1">{errorMsgPurchase1To}</p>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
        <div style={{marginBottom:"25px"}}>
          <Row>
            <Label className="form-label"></Label>
            <div className="text-center mt-1">
              <Button
                className="ms-5"
                color="danger"
                onClick={onSubmit}
                outline
              >
                Start Reconciliation
              </Button>
            </div>
          </Row>
        </div>


      <div style={{ zIndex: "999", }} className='btnFixFooter'>
        <div className="container">
          <div style={{ margintop: "100px" }} className="d-flex justify-content-between">
            <div>
              <Button
                color="danger"
                className="btn-prev"
                onClick={() => stepper.previous()}
              >
                <ArrowLeft
                  size={18}
                  className="align-middle me-sm-25 me-0"
                ></ArrowLeft>
                <span className="align-middle d-sm-inline-block d-none">
                  Previous
                </span>
              </Button>
            </div>

            <div>
              <Button
                color="danger"
                className="btn-next"
                onClick={onClickSkip}
                style={{ marginRight: "10px" }}
              >
                <span className="align-middle d-sm-inline-block d-none"> Skip Reco </span>
                <ArrowRight
                  size={14}
                  className="align-middle ms-sm-25 ms-0"
                ></ArrowRight>
              </Button>

              <Button
                color="danger"
                className="btn-next"
                onClick={onClickNext}
              >
                <span className="align-middle d-sm-inline-block d-none">Proceed with Reco</span>
                <ArrowRight
                  size={14}
                  className="align-middle ms-sm-25 ms-0"
                ></ArrowRight>
              </Button>
            </div>
          </div>
        </div>
      </div>

    </>
  );
};
export default SelectReco;
