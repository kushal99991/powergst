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
import errorCodeConfig from "@configs/apiErrorCodeConfig";
import makeAnimated from "react-select/animated";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { X } from "react-feather";
import { globleVariable } from "../../../configs/globalVariable";
import LocalFunction from "../../../configs/getLocalFunction";
import SessionFunction from "../../../configs/getSessionFunction";
import gstr9cService from "../../../services/gstr9c/gstr9cService";
import CompanyList from "./CompanyList";
import SectionListForDeleteModel from "./SelectSectionList";
import GSTR9CFiledService from "../../../services/gstr9CFiled/gstr9CFiledService";
import { deleteModalConfirm, takeCompanyNameAsFirst } from "../../../services/utils";

const animatedComponents = makeAnimated();

function DeleteModelGSTR9c({
  Heading,
  SuccessButtonText,
  toggleCompose,
  userId,
  G_UCParId,
  finYearId,
  setActiveTab,
  setChangeFound,
  Company_GSTIN,
  deleteType
}) {
  // ** Hooks
  const {
    control,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm();

  const [loading, setLoading] = useState(true);
  const [shows, setShows] = useState(true);
  const [selectedYear, setSelectedYear] = useState(null);
  const [block, setBlock] = useState(false);
  const [allCheckedMail, setAllCheckedMail] = useState(true);
  const [isCheckedMail, setIsCheckedMail] = useState();
  const [checkedData, setCheckedData] = useState([]);

  const userDatadecrypt = LocalFunction.getLocalValue(
    globleVariable.userData,
    true
  );
  let GFY =
    sessionStorage.getItem(globleVariable.G_FY) &&
    SessionFunction.getSessionValue(globleVariable.G_FY, true);
  const userData = userDatadecrypt && JSON.parse(userDatadecrypt);
  const finYearOption = userData && userData.data.rangeFiltersGSTR9C;

  const UserId = LocalFunction.getLocalValue(globleVariable.userId, true);

  const companyListRef = useRef(null);
  const sectionListRef = useRef(null);

  const sectionListOfGstr9 = [
    { sectionname: "Table1", sectionId: 1 },
    { sectionname: "Table5", sectionId: 2 },
    { sectionname: "Table6", sectionId: 3 },
    { sectionname: "Table7", sectionId: 4 },
    { sectionname: "Table8", sectionId: 5 },
    { sectionname: "Table9", sectionId: 6 },
    { sectionname: "Table10", sectionId: 7 },
    { sectionname: "Table11", sectionId: 8 },
    { sectionname: "Table12", sectionId: 9 },
    { sectionname: "Table13", sectionId: 10 },
    { sectionname: "Table14", sectionId: 11 },
    { sectionname: "Table15", sectionId: 12 },
    { sectionname: "Table16", sectionId: 13 },
    { sectionname: "Table17", sectionId: 14 },
  ];

  const [selectedSections, setSelectedSections] = useState([]);
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [companyData, setCompanyData] = useState([]);

  const array = [];

  sectionListOfGstr9.map((ele, index) => {
    array.push({ label: ele.sectionname, value: ele.sectionId });
  });

  useEffect(() => {
    setBlock(true);
    GSTR9CFiledService.getPanSummery(UserId, "")
      .then((res) => {
        if (res.status === 200) {
          setBlock(false);
          // setCompanyData(res?.data?.data?.gstinList);

          let companyDataShow = [];
          if (deleteType == 'single') {
             companyDataShow =  res?.data?.data?.gstinList.filter(p => p.gstinNumber == Company_GSTIN)
          } else {
            companyDataShow  = res?.data?.data?.gstinList
          }

          takeCompanyNameAsFirst(companyDataShow, setCompanyData);
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

  const onSubmit = async (data) => {
    if (selectedCompanies?.length < 1 || selectedSections?.length < 1) {
      toast.error("Kindly ensure that a section or company is selected.", {
        position: "top-right",
      });
      return;
    }

    const isDeleteConfirm = await deleteModalConfirm();

    if (isDeleteConfirm) {
      const payLoad = {
        UserClientId: String(G_UCParId),
        FinancialYearId: selectedYear,
        UserId: userId,
        companyGSTIN: selectedCompanies?.map((i) => i.gstinNumber),
        sectionId: selectedSections?.map((i) => i.value),
      };
      clearErrors();
      setShows(false);
      // setBlock(true);
      gstr9cService
        .multiDelete(payLoad)
        .then((res) => {
          setBlock(false);
          if (
            res.status === 200 &&
            res.data.status === errorCodeConfig.APIDefaultCode.Success
          ) {
            toast.success(res.data.successMessage, {
              position: "top-right",
            });
            setActiveTab("1");
            setChangeFound((pre) => ++pre);
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
        })
        .finally(() => {
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

  const selectFromYear = (value) => {
    setSelectedYear(value?.value);
  };

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
    checkedDataList();
    if (selectedYear == null) {
      setSelectedYear(finYearId);
    }
  }, []);

  const checkedDataList = () => {
    setBlock(true);

    if (array) {
      setBlock(false);
      setCheckedData(array);

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

  const clearFilters = () => {
    companyListRef?.current?.clearFilters();
    sectionListRef?.current?.clearFilters();
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
                <b>Financial Year</b>
              </Label>
              <Select
                id="purchaseId_invtype"
                placeholder={DROPDOWN_PLACEHOLDER}
                maxMenuHeight={SELECT_MAXSIZE}
                isClearable={false}
                theme={selectThemeColors}
                closeMenuOnSelect={true}
                components={animatedComponents}
                options={finYearOption}
                className="basic-multi-select"
                classNamePrefix="select"
                defaultValue={
                  finYearOption?.filter((p) => p.value == GFY)[0] ||
                  finYearOption[0]
                }
                onChange={selectFromYear}
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
                sections={checkedData}
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

export default DeleteModelGSTR9c;
