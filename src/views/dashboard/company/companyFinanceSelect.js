import { useState, useEffect } from "react";
import {
  Modal,
  ModalBody,
  Row,
  Col,
  Button,
  Label,
  FormFeedback,
  Form,
} from "reactstrap";
import classnames from "classnames";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import { X } from "react-feather";
import LocalFunction from "../../../configs/getLocalFunction";
import SessionFunction from "../../../configs/getSessionFunction";
import { globleVariable } from "../../../configs/globalVariable";
import { useNavigate } from "react-router-dom";
import CompanyNewService from "../../../services/company/companyNewService";
// ** Utils
import { selectThemeColors } from "@utils";
import { useLocation } from "react-router-dom";
//** redux
import { useDispatch, useSelector } from "react-redux";
import { handleCompanyDashboard, handleGSTR1FiledSummary, handleGSTR2BSummary, handleGSTR3BSummary } from "../../../views/apps/user/store";
import { handleGSTR6AFiled } from "../../pages/reports/gstr6AFiledData/store"
import { handleGSTR2ASummary } from "../../pages/gstr2A/store";
import { handleItc04Filed } from "../../pages/reports/itc04FiledData/store";

import StaticDataServices from "../../../services/master/staticdataService";
import moment from "moment";
import { filterCurrentMonthWise } from "@helper/filterArray";
import ClearSession from "@helper/clearSession";
import { handleCMP08Filed } from "../../pages/reports/cmp08FiledData/store";

const defaultValues = {
  finyearstatus: null,
  finyearsmonth: null,
};

const CompanyFinanceSelect = (props) => {
  const navigate = useNavigate();
  // ** Store
  const dispatch = useDispatch();

  const Locationsearch = useLocation();

  // ** Months
  const MonthOptions = [
    // { value: 0, label: "--Select Month--" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
  ];



  const { composeOpen, toggleCompose } = props;
  let defaultMonth = null;
  let defaultYear = null;

  const userDatadecrypt = LocalFunction.getLocalValue(
    globleVariable.userData,
    true
  );

  const userData = userDatadecrypt && JSON.parse(userDatadecrypt);
  const finYearOption = userData && userData.data.financialYearList;

  const latestyear = finYearOption[0]?.value

  console.log(finYearOption, 'finYearOption')
  console.log(latestyear, 'latestyear')

  const [gstin, setGstin] = useState(null);
  const [regType, setRegType] = useState(null);
  const [companyName, setCompanyName] = useState(null);
  const [tradeName, setTradeName] = useState(null);
  const [FinYears, setFinYears] = useState(null);
  const [GFinm, setGFinm] = useState(null);
  const [redirectApi, setRedirectApi] = useState(false);
  const [selectedYear, setSelectedYear] = useState('');
  console.log(selectedYear, 'selectedYear--');

  const [monthArray, setMonthArray] = useState([]);
  const serverDateDecpryt = LocalFunction.getLocalValue(globleVariable.serverDateTime, true);
  const serverDate =
    serverDateDecpryt !== null &&
      serverDateDecpryt !== "" &&
      serverDateDecpryt !== undefined
      ? JSON.parse(serverDateDecpryt).split("T")[0]
      : null;
  const currMonth = new Date(serverDate);
  const preMonth = currMonth.setMonth(currMonth.getMonth() - 1);
  const setMonth = moment(new Date(preMonth)).format("YYYY-MM-DD").split("-")[1];


  //** State List
  const getStateData = () => {
    StaticDataServices.getStateName()
      .then((res) => {
        if (
          res.status === 200 &&
          res.data.status === errorCodeConfig.APIDefaultCode.Success
        ) {
          const stateData = JSON.stringify(res.data.data);
          localStorage.setItem("sList", encryptData.encryptData(JSON.stringify(stateData)));
        }
      })
      .catch((error) => { });
  };

  useEffect(() => {
    const userId = LocalFunction.getLocalValue(globleVariable.userId, true);
    getStateData();
    console.log('iss-', userId)
    // getCompanyData(userId);
    clearErrors();
    let GFY =
      sessionStorage.getItem(globleVariable.G_FY) &&
      SessionFunction.getSessionValue(globleVariable.G_FY, true);
    let GFM =
      sessionStorage.getItem(globleVariable.G_FM) &&
      SessionFunction.getSessionValue(globleVariable.G_FM, true);

    defaultMonth = MonthOptions.filter(
      (p) => p.value == GFM
    )[0];


    if (defaultMonth == undefined || defaultMonth == null || defaultMonth == '') {
      defaultMonth = MonthOptions[0]
    }

    if (GFY == undefined || GFY == null) {
      defaultYear = finYearOption?.[0];
    } else {
      defaultYear = finYearOption?.filter((item) => item.value == GFY)[0];
    }

    // defaultYear = finYearOption?.filter((item)=>item.value == GFY)[0];
    setValue("finyearstatus", defaultYear);
    setValue("finyearsmonth", defaultMonth);
    setSelectedYear(defaultYear);

    setMonthArray(MonthOptions);
    handleYearChange(defaultYear)
    GFY !== undefined && GFY !== null && handleYearChange(defaultYear)
  }, []);

  useEffect(() => {
    if (composeOpen) {
      let GTradeName =
        sessionStorage.getItem(globleVariable.G_TradeName) &&
        SessionFunction.getSessionValue(globleVariable.G_TradeName, true);
      let GRegType =
        sessionStorage.getItem(globleVariable.G_RegType) &&
        SessionFunction.getSessionValue(globleVariable.G_RegType, true);
      let GFY =
        sessionStorage.getItem(globleVariable.G_FY) &&
        SessionFunction.getSessionValue(globleVariable.G_FY, true);
      let GFM =
        sessionStorage.getItem(globleVariable.G_FM) &&
        SessionFunction.getSessionValue(globleVariable.G_FM, true);
      let GGSTIN =
        sessionStorage.getItem(globleVariable.G_GSTIN) &&
        SessionFunction.getSessionValue(globleVariable.G_GSTIN, true);

      setGstin(GGSTIN);
      setRegType(GRegType);
      setTradeName(GTradeName);

      const filterYear = finYearOption?.filter((p) => p.value == GFY)[0];
      const filterMonth = MonthOptions?.filter((p) => p.value == GFM)[0];

      if (filterYear !== undefined) {
        setValue("finyearstatus", filterYear);
      }

      if (filterMonth !== undefined) {
        setValue("finyearsmonth", filterMonth);
      }
    }
  }, [composeOpen]);

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors },
    clearErrors,
    setValue,
    reset,
  } = useForm({ defaultValues });

  const onSubmit = (data) => {
    // debugger
    let redirectUrl = true;
    const finyear = selectedYear?.value;
    const finmonth = data?.finyearsmonth?.value;

    if (
      data?.finyearstatus?.value == "" ||
      data?.finyearstatus?.value == null ||
      data?.finyearstatus?.value == undefined ||
      (data?.finyearstatus?.value == "0" && data?.finyearstatus?.value == 0)
    ) {
      redirectUrl = false;
    } else if (
      finyear == "" ||
      (finmonth == null) | (finmonth == "0") ||
      finmonth.value == 0
    ) {
      redirectUrl = false;
    }

    if (redirectUrl == true || redirectUrl == "true") {

      ClearSession();

      setFinYears(selectedYear.label);

      setGFinm(finmonth);
      SessionFunction.setSessionValue(globleVariable.G_FY, finyear, true);
      SessionFunction.setSessionValue(globleVariable.G_FM, finmonth, true);
      SessionFunction.setSessionValue(globleVariable.FinYear, selectedYear.label, true);
      SessionFunction.setSessionValue(
        globleVariable.FinMonth,
        data.finyearsmonth.label,
        true
      );
      // sessionStorage.setItem(globleVariable.isCompany, true);

      setRedirectApi(true);
    }
  };
  //** Redirect route - Api services
  useEffect(() => {
    if (redirectApi == true) {

      dispatch(handleCompanyDashboard([]));
      dispatch(handleGSTR2BSummary([]));
      dispatch(handleGSTR3BSummary([]));
      dispatch(handleGSTR1FiledSummary([]));
      dispatch(handleGSTR6AFiled([]));
      dispatch(handleGSTR2ASummary([]));
      dispatch(handleItc04Filed([]));
      dispatch(handleCMP08Filed([]));

      const GFM = GFinm;
      const finYear = FinYears;

      CompanyNewService.getCompanyloggedData(GFM, finYear).then((res) => {
        console.log(res);
        if (res.status == 200) {
          SessionFunction.setSessionValue(
            globleVariable.defaultYear,
            res.data.data,
            true
          );
          setRedirectApi(false);

          navigate(window.location.pathname, { state: Locationsearch?.state });
          toggleCompose();

          //   document
          //     .getElementById("DivisionAppContent")
          //     .classList.add("app-content");
          //   document
          //     .getElementById("DivisionAppContent")
          //     .classList.remove("app-content-new");
        }
      });
    }
  }, [redirectApi]);

  // ** Toggles Compose POPUP
  const togglePopUp = (e) => {
    //  setIsRequestOpen(false);
    toggleCompose();
  };

  const monthDataFilter = filterCurrentMonthWise(MonthOptions, serverDate);

  // ** Year select - onchagne
  const handleYearChange = (e) => {
    setSelectedYear(e)
    console.log("year selection", e);
    if (e.value == 1) {
      let filterMonth = MonthOptions.filter(
        (p) => p.value < 4 || p.value > 6);
      if (filterMonth !== undefined) {
        setMonthArray(filterMonth)
        setValue("finyearsmonth", filterMonth[1]);
        // monthArray.push(filterMonth)
      }
      console.log("year selection", e, filterMonth);
    } else if (latestyear == e.value) {

      setMonthArray(monthDataFilter);
      defaultMonth = monthDataFilter.filter(
        (p) => p.value == setMonth.replace(/^0+/, "")
      )[0];

      if (defaultMonth == undefined ||
        defaultMonth == null ||
        defaultMonth == ""
      ) {
        defaultMonth = monthDataFilter[0];
      }

      setValue("finyearsmonth", defaultMonth);
    } else {
      setMonthArray(MonthOptions)
      defaultMonth = MonthOptions.filter(
        (p) => p.value == setMonth.replace(/^0+/, "")
      )[0];
      if (defaultMonth == undefined || defaultMonth == null || defaultMonth == '') {
        defaultMonth = MonthOptions[0]
      }
      setValue("finyearsmonth", defaultMonth);
      // monthArray.push(MonthOptions)
    }
  }

  return (
    <div>
      {composeOpen && (
        <Form className="mt-2 pt-50" onSubmit={handleSubmit(onSubmit)}>
          <Modal
            backdrop="static"
            isOpen={composeOpen}
            toggle={togglePopUp}
            className="modal-dialog-centered"
          >
            <div className="modal-header">
              <h2 className="modal-title w-100 text-center">
                Select Return Year
              </h2>
              <div className="modal-actions">
                <a onClick={togglePopUp} className="text-body">
                  <X size={14} />
                </a>
              </div>
            </div>
            {/* style={{ margin: "0px" }} */}
            <hr></hr>
            <ModalBody className="px-sm-2 mx-30 pb-2">
              <Row tag="form" className="gy-1 pt-75">
                <Col xs={12}>
                  <Label className="w20" for="cmpyName" >
                    <b>Trade Name</b>
                  </Label>
                  <span className="w70" >{tradeName}</span>
                </Col>
                <Col xs={6}>
                  <Label
                    className="form-label w30"
                    for="gstIn"

                  >
                    <b>GSTIN</b>
                  </Label>
                  <span className="w70" >{gstin}</span>
                </Col>
                <Col xs={6}>
                  <Label
                    className="form-label w60"
                    for="RegTYpe"

                  >
                    <b>Registration Type</b>
                  </Label>
                  <span className="w40" >{regType}</span>
                </Col>
                <Col xs={6}>
                  <Label className="form-label" for="status">
                    <b>Select Year</b>
                  </Label>
                  <Controller
                    id="finyearstatus"
                    name="finyearstatus"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Select
                        isClearable={false}
                        // value={field.value}
                        value={selectedYear}
                        options={finYearOption}
                        defaultValue={defaultYear}
                        classNamePrefix="select"
                        theme={selectThemeColors}
                        // onChange={field.onChange}
                        onChange={(e) => {
                          handleYearChange(e);
                        }}
                        className={classnames("react-select", {
                          "is-invalid": errors.finyearstatus && true,
                        })}
                      // {...field}
                      />
                    )}
                  />
                  {errors.finyearstatus && (
                    <FormFeedback>Please select financial year</FormFeedback>
                  )}
                </Col>
                <Col xs={6}>
                  <Label className="form-label" for="months">
                    <b>Select Month</b>
                  </Label>
                  <Controller
                    id="finyearsmonth"
                    name="finyearsmonth"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Select
                        isClearable={false}
                        value={field.value}
                        options={monthArray}
                        classNamePrefix="select"
                        theme={selectThemeColors}
                        onChange={field.onChange}
                        defaultValue={defaultMonth}
                        className={classnames("react-select", {
                          "is-invalid": errors.finyearsmonth && true,
                        })}
                        {...field}
                      />
                    )}
                  />
                  {errors.finyearsmonth && (
                    <FormFeedback>Please select month</FormFeedback>
                  )}
                </Col>
                <Col xs={12} className="text-center pt-50">
                  <Button type="submit" className="me-1" color="danger" outline>
                    Continue
                  </Button>
                  <Button
                    type="reset"
                    color="secondary"
                    outline
                    onClick={togglePopUp}
                  >
                    Cancel
                  </Button>
                </Col>
              </Row>
            </ModalBody>
          </Modal>
        </Form>
      )}
    </div>
  );
};

export default CompanyFinanceSelect;
