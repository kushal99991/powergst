import {
  Row,
  Col,
  Label,
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  Form,
  Input,
} from "reactstrap";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Select from "react-select";
// ** Utils
import { selectThemeColors } from "@utils";
// ** Styles
import "@styles/react/libs/react-select/_react-select.scss";
import { DROPDOWN_PLACEHOLDER, SELECT_MAXSIZE } from "../../../configs/config";
import errorCodeConfig from "../../../configs/apiErrorCodeConfig";
import makeAnimated from "react-select/animated";
import purchaseInvoiceService from "../../../services/Reco/Purchase/purchaseInvoiceService";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { X } from "react-feather";
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
import { useRef } from "react";

const animatedComponents = makeAnimated();

function DeleteModel({
  Heading,
  SuccessButtonText,
  toggleCompose,
  userId,
  cClientId,
  array,
  fromDate,
  toDate
}) {

  console.log(fromDate , toDate , "toDate")

  //Getting financial year list from localstorage.
  const finYearOption = LocalFunction.getLocalValue(
    globleVariable.rangeFilters,
    true
  ); // localStorage.getItem("rangeFilters");
  const YearList = JSON.parse(finYearOption);

  // ** Hooks
  const {
    control,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm();

  const [loading, setLoading] = useState(true);
  const [shows, setShows] = useState(true);
  const [financialYearList, setFinancialYearList] = useState([]);
  const [financialYearToList, setFinancialYearToList] = useState([]);

  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedYearTo, setSelectedYearTo] = useState(null);
  const [block, setBlock] = useState(false);
  const [allCheckedMail, setAllCheckedMail] = useState(true);
  const [isCheckedMail, setIsCheckedMail] = useState();
  const [checkeddata, setData] = useState([]);

  const [selectedSections, setSelectedSections] = useState([]);
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [companyData, setCompanyData] = useState([]);

  const companyListRef = useRef(null);
  const sectionListRef = useRef(null);

  const onSubmit = async (data) => {
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
      const payload = {
        fromRange: selectedYear?.value,
        toRange: selectedYearTo?.value,
        userClientId: cClientId,
        userId: userId,
        companyGSTIN: selectedCompanies?.map((i) => i.gstinNumber),
        sectionId: selectedSections?.map((i) => i.value),
      };
      clearErrors();
      setShows(false);
      setBlock(true);
      purchaseInvoiceService
        .multiDelete(payload)
        .then((res) => {
          setBlock(false);
          if (
            res.status === 200 &&
            res.data.status === errorCodeConfig.APIDefaultCode.Success
          ) {
            toast.success(res.data.successMessage, {
              position: "top-right",
            });
            toggleCompose();
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

  const UserId = LocalFunction.getLocalValue(globleVariable.userId, true);

  const purchaseDateTo = SessionFunction.getSessionValue(
    globleVariable.defaultYear,
    true
  );

  // console.log(purchaseDate,"purchaseDate")
  console.log(purchaseDateTo, "purchaseDate");

  useEffect(() => {
    const frDates = YearList?.filter((item) => item.value == fromDate.value)[0];
    const toDates = YearList?.filter((item) => item.value == toDate.value)[0];
    if (frDates !== undefined) {
      setSelectedYear(frDates);
      setSelectedYearTo(toDates);
    }
  }, []);

  // ** select option
  const selectFromYear = (value) => {
    // setSelectedYear(value?.value);
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

  // ** delete modal - select all click checkbox
  const handleAllCheck = (e) => {
    setAllCheckedMail(e.target.checked);
  };

  const clearFilters = () => {
    companyListRef?.current?.clearFilters();
    sectionListRef?.current?.clearFilters();
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
    setBlock(true);
    gstr1BfiledPanService
      .getGstr1bPanSummary(UserId, "")
      .then((res) => {
        setBlock(false);
        if (res.status === 200) {
          // setCompanyData(res?.data?.data?.gstinList);
          takeCompanyNameAsFirst(res?.data?.data?.gstinList, setCompanyData);
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

  useEffect(() => {
    purchasecheckdatalist();
  }, []);

  const purchasecheckdatalist = () => {
    setBlock(true);

    if (array) {
      setBlock(false);
      setData(array);

      if (array.length > 0) {
        const initialIsChecked = array?.reduce((acc, d) => {
          acc[d.value] = true;
          return acc;
        }, {});
        setIsCheckedMail(initialIsChecked);
      }
      setLoading(false);
    }
  };

  return (
    <Form
      className="mt-1 pt-50"
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
                <b>To</b>
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

          <Row className="mt-2">
            <Col xs={7}>

              <CompanyList
                companyData={companyData}
                selectedCompanies={selectedCompanies}
                setSelectedCompanies={setSelectedCompanies}
                ref={companyListRef}
              />
            </Col>
            <Col xs={5}>
                <div className="mt-3" >

                </div>
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

export default DeleteModel;
