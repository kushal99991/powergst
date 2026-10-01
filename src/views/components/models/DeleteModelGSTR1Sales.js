import {
  Row,
  Col,
  Label,
  Button,
  Modal,
  ModalBody,
  Form,
  Input,
} from "reactstrap";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Select from "react-select";
// ** Utils
import { selectThemeColors } from "@utils";
// ** Styles
import "@styles/react/libs/react-select/_react-select.scss";
import { DROPDOWN_PLACEHOLDER, SELECT_MAXSIZE } from "../../../configs/config";
import errorCodeConfig from "../../../configs/apiErrorCodeConfig";
import makeAnimated from "react-select/animated";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { X } from "react-feather";
import gstr1PurchaseInvoiceService from "../../../services/gstr1/gstr1Services/gstr1PurchaseInvoiceService";
import { globleVariable } from "../../../configs/globalVariable";
import LocalFunction from "../../../configs/getLocalFunction";
import SessionFunction from "../../../configs/getSessionFunction";
import CompanyList from "./CompanyList";
import SectionListForDeleteModel from "./SelectSectionList";
import gstr1BfiledPanService from "../../../services/gstr1/gstr1DataFileService/gstr1FileDataService";
import {
  checkDifferentIsGreaterThatOne,
  deleteModalConfirm,
  takeCompanyNameAsFirst,
} from "../../../services/utils";

const animatedComponents = makeAnimated();

function DeleteModelGSTR1Sales({
  Heading,
  SuccessButtonText,
  toggleCompose,
  GSTR1SalesSummaryService,
  loadFunction,
  Company_GSTIN,
  deleteType
}) {
  //** Getting financial year list from localstorage.
  const finYearOption = LocalFunction.getLocalValue(
    globleVariable.rangeFilters,
    true
  );
  const YearList = JSON.parse(finYearOption);
  // console.log(YearList, "date year")

  const userDatadecrypt = LocalFunction.getLocalValue(
    globleVariable.userData,
    true
  );

  const userData = userDatadecrypt && JSON.parse(userDatadecrypt);
  const isMultipleDelete = userData && userData.data.isMultipleCompanyDelete;


  // ** Hooks
  const {
    control,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm();

  // const [mailFormData, setMailFormData] = useState(GSTR1SelectOptionsList);
  const [loading, setLoading] = useState(true);
  const [loading1, setLoading1] = useState(true);
  const [isCheckedMail, setIsCheckedMail] = useState();
  const [allCheckedMail, setAllCheckedMail] = useState(true);
  const [checkeddata, setData] = useState([]);
  const [shows, setShows] = useState(true);
  const [financialYearList, setFinancialYearList] = useState([]);
  const [financialYearToList, setFinancialYearToList] = useState([]);

  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedYearTo, setSelectedYearTo] = useState(null);
  const [block, setBlock] = useState(false);

  const [selectedSections, setSelectedSections] = useState([]);
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [companyData, setCompanyData] = useState([]);

  const companyListRef = useRef(null);
  const sectionListRef = useRef(null);

  const G_UCParId = SessionFunction.getSessionValue(
    globleVariable.G_UCParId,
    true
  );
  const gstr1FromDt = SessionFunction.getSessionValue(
    globleVariable.gstr1FromDt,
    true
  );

  const UserId = LocalFunction.getLocalValue(globleVariable.userId, true);

  useEffect(() => {
    const frData = YearList?.filter((item) => item.value == gstr1FromDt)[0];
    if (frData !== undefined) {
      setSelectedYear(frData);
      setSelectedYearTo(frData);
    }
  }, []);

  // ** delete modal - select all click checkbox
  const handleAllCheck = (e) => {
    setAllCheckedMail(e.target.checked);
  };

  useEffect(() => {
    if (!loading) {
      setIsCheckedMail((current) => {
        const nextIsChecked = {};
        Object.keys(current).forEach((key) => {
          nextIsChecked[key] = allCheckedMail;
        });
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
  }, []);

  const gstr1checkdatalist = () => {
    setBlock(true);
    gstr1PurchaseInvoiceService.getgstr1checkdata().then((res) => {
      if (
        res.status === 200 &&
        res.data.status === errorCodeConfig.APIDefaultCode.Success
      ) {
        setBlock(false);
        setData(res.data.data.sectionList);
        if (res.data.data.sectionList.length > 0) {
          const initialIsChecked = res?.data?.data?.sectionList?.reduce(
            (acc, d) => {
              acc[d.value] = true;
              return acc;
            },
            {}
          );
          setIsCheckedMail(initialIsChecked);
        }
        setLoading(false);
      }
    });
  };

  useEffect(() => {
    setBlock(true);
    gstr1BfiledPanService
      .getGstr1bPanSummary(UserId, "")
      .then((res) => {
        setBlock(false);
        if (res.status === 200) {
          // setCompanyData(res?.data?.data?.gstinList);
          let companyDataShow = [];
          if (deleteType == 'single') {
             companyDataShow =  res?.data?.data?.gstinList.filter(p => p.gstinNumber == Company_GSTIN)
          } else {
            companyDataShow  = res?.data?.data?.gstinList
          }

          takeCompanyNameAsFirst(companyDataShow , setCompanyData);
        }
      })
      .catch((error) => {
        setBlock(false);
        Swal.fire({
          icon: "error",
          title: "",
          text: error?.message,
        });
      });
  }, []);

  const clearFilters = () => {
    companyListRef?.current?.clearFilters();
    sectionListRef?.current?.clearFilters();
  };

  const onSubmit = async () => {
    if (
      checkDifferentIsGreaterThatOne(
        `${selectedYear?.value}`,
        `${selectedYearTo?.value}`
      )
    ) {
      toast.error("Maximum period of one year is allowed.", {
        position: "top-right",
      });
      return;
    }

    if (selectedCompanies?.length < 1 || selectedSections?.length < 1) {
      toast.error("Kindly ensure that a section or company is selected.", {
        position: "top-right",
      });
      return;
    }

    const isDeleteConfirm = await deleteModalConfirm();

    if (isDeleteConfirm) {
      clearErrors();
      setShows(false);
      setBlock(true);

      const payload = {
        fromRange: selectedYear?.value,
        toRange: selectedYearTo?.value,
        userClientId: G_UCParId,
        userId: LocalFunction.getLocalValue(globleVariable.userId, true),
        companyGSTIN: selectedCompanies?.map((i) => i.gstinNumber),
        sectionId: selectedSections?.map((i) => i.value),
      };

      gstr1PurchaseInvoiceService
        .multiDelete(payload)
        .then((res) => {
          if (
            res.status === 200 &&
            res.data.status === errorCodeConfig.APIDefaultCode.Success
          ) {
            toast.success(res.data.successMessage, {
              position: "top-right",
            });
            // setBlock(false);
            toggleCompose();
            // setTimeout(() => {
              GSTR1SalesSummaryService();
            // }, 800);
          } else {
            Swal.fire({
              icon: "error",
              title: "",
              text: res?.data?.errorMessage,
              customClass: {
                confirmButton: "btn btn-danger",
              },
              buttonsStyling: false,
            });
            setBlock(false);
            toggleCompose();
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
            buttonsStyling: false,
          });

          toggleCompose();
        });
    }
  };

  // Modal close
  const closeModal = () => {
    clearErrors();
    setShows(false);
    toggleCompose();
  };

  useEffect(() => {
    setFinancialYearList(YearList);
    setFinancialYearToList(YearList)
  }, []);

  // ** select option
  const selectFromYear = (value) => {
    setSelectedYear(value);
    const setDt =
      Number(YearList?.srNo) > Number(value?.srNo)
        ? selectedYearTo
        : YearList[0];

      const dateFromList = financialYearList?.filter(
        (item) => Number(item.srNo) >= Number(value.srNo)
      );

    setFinancialYearToList(dateFromList);

    setSelectedYearTo(setDt);
  };
  const selectToYear = (value) => {
    setSelectedYearTo(value);
    if (Number(selectedYear?.srNo) > Number(value?.srNo)) {
      const fromFilter = YearList?.filter(
        (item) => Number(item.srNo) == Number(value.srNo)
      )[0];
      setSelectedYear(fromFilter);
    }
  };

  return (
    <Form
      className="mt-2 pt-50"
      onSubmit={handleSubmit(onSubmit)}
      onKeyDown={(event) => {
        console.log("show key", event.key);
        if (event.key === "Escape") {
          closeModal();
        }
      }}
    >
      {block && <div className="loading1">Loading&#8230;</div>}
      <Modal
        backdrop="static"
        isOpen={shows}
        toggle={() => setShows(false)}
        className="modal-dialog-centered modal-lg"
      >
        <div className="modal-header">
          <h2 className="modal-title  w-100 text-center">
            {Heading ? Heading : "Delete"}
          </h2>
          <div className="modal-actions">
            <a onClick={() => closeModal()} className="text-body">
              <X size={14} />
            </a>
          </div>
        </div>
        <hr style={{ margin: "0px" }}></hr>
        <ModalBody>
          <Row>
            <Col xs={4}>
              <Label className="form-label" for="status">
                <b>From</b>
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
                classNamePrefix="select"
                value={selectedYear}
                onChange={selectFromYear}
              />
            </Col>
            <Col xs={4}>
              <Label className="form-label" for="status">
                <b>To </b>
              </Label>
              <Select
                id="purchaseId_invtype"
                placeholder={DROPDOWN_PLACEHOLDER}
                maxMenuHeight={SELECT_MAXSIZE}
                isClearable={false}
                theme={selectThemeColors}
                closeMenuOnSelect={true}
                components={animatedComponents}
                options={financialYearToList}
                className="basic-multi-select"
                classNamePrefix="select"
                value={selectedYearTo}
                onChange={selectToYear}
              />
            </Col>
            <Col xs={4}>
              <Button
                type="submit"
                onClick={onSubmit}
                className="mt-2 me-1"
                outline
                color="danger"
              >
                {SuccessButtonText ? SuccessButtonText : "Submit"}
              </Button>
              <Button
                type="button"
                onClick={clearFilters}
                className="mt-2"
                outline
                color="danger"
              >
                Clear
              </Button>
            </Col>
          </Row>

          <Row className="mt-3">
            <Col xs={7}>
              <CompanyList
                companyData={companyData}
                selectedCompanies={selectedCompanies}
                setSelectedCompanies={setSelectedCompanies}
                ref={companyListRef}
              />
            </Col>
            <Col xs={5}>
            <div className="mt-3" ></div>
              <SectionListForDeleteModel
                sections={checkeddata}
                setSelectedSections={setSelectedSections}
                selectedSections={selectedSections}
                ref={sectionListRef}
              />
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </Form>
  );
}

export default DeleteModelGSTR1Sales;
