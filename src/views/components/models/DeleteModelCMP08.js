import {
  Row,
  Col,
  Label,
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  Form,
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
import gstr3bService from "../../../services/gstr3b/gstr3bService";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { X } from "react-feather";

import { globleVariable } from "../../../configs/globalVariable";
import LocalFunction from "../../../configs/getLocalFunction";
import SessionFunction from "../../../configs/getSessionFunction";
import cmp08Service from "../../../services/cmp08/cmp08Service";
import CompanyList from "./CompanyList";
import gstpanService from "../../../services/gstpan/gstpanService";
import { deleteModalConfirm, takeCompanyNameAsFirst } from "../../../services/utils";

const animatedComponents = makeAnimated();

function DeleteModelCMP08({
  Heading,
  SuccessButtonText,
  toggleCompose,
  CMP08SummaryServiceCall,
  gstr3BToDt,
  Company_GSTIN,
  deleteType
}) {
  //Getting financial year list from localstorage.
  const finYearOption = LocalFunction.getLocalValue(
    globleVariable.rangeFiltersCMP08,
    true
  );
  const YearList = JSON.parse(finYearOption);

  // ** Hooks
  const {
    control,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm();

  const [shows, setShows] = useState(true);
  const [financialYearList, setFinancialYearList] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedYearTo, setSelectedYearTo] = useState(null);
  const [block, setBlock] = useState(false);

  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [companyData, setCompanyData] = useState([]);

  const gstr1FromDt = sessionStorage.getItem("cmp08DownloadDate");
  console.log(gstr1FromDt, "finYearOption");

  useEffect(() => {
    const frData = YearList?.filter((item) => item.value == gstr1FromDt)[0];
    console.log(frData, "frDattttta");
    if (frData !== undefined) {
      setSelectedYear(frData);
      setSelectedYearTo(frData);
    }
  }, []);

  const G_UCParId = SessionFunction.getSessionValue(
    globleVariable.G_UCParId,
    true
  );
  const G_GSTIN = SessionFunction.getSessionValue(globleVariable.G_GSTIN, true);

  const UserId = LocalFunction.getLocalValue(globleVariable.userId, true);

  const companyListRef = useRef(null);

  useEffect(() => {
    gstpanService
      .getGstPanSummaryCMP(UserId, "")
      .then((res) => {
        if (res.status === 200) {
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
        // setBlock(false)
        Swal.fire({
          icon: "error",
          title: "",
          text: error?.message,
          customClass: {
            confirmButton: "btn btn-danger",
          },
          buttonsStyling: false,
        });
      });
  }, []);

  const onSubmit = async (data) => {
    if (selectedCompanies?.length < 1) {
      toast.error("Kindly ensure that a company is selected.", {
        position: "top-right",
      });
      return;
    }

    const isDeleteConfirm = await deleteModalConfirm();

    if (isDeleteConfirm) {
      setBlock(true);
      clearErrors();
      setShows(false);
      try {
        const payload = {
          FKUserClientId: G_UCParId,
          fromRange: selectedYear?.value,
          toRange: selectedYearTo?.value,
          // GSTNumber: G_GSTIN,
          UserId: UserId,
          companyGSTIN: selectedCompanies?.map((i) => i.gstinNumber),
        };
        const res = await cmp08Service.multiDelete(payload);
        setBlock(false);
        if (
          res.status === 200 &&
          res.data.status === errorCodeConfig.APIDefaultCode.Success
        ) {
          toast.success(res.data.successMessage, {
            position: "top-right",
          });
          await toggleCompose();
          await CMP08SummaryServiceCall(gstr3BToDt);
        } else {
          await Swal.fire({
            icon: "error",
            title: "",
            text: res?.data?.errorMessage,
            customClass: {
              confirmButton: "btn btn-danger",
            },
            buttonsStyling: false,
          });

          await toggleCompose();
        }
      } catch (error) {
        setBlock(false);
        await Swal.fire({
          icon: "error",
          title: "",
          text: error?.message,
          customClass: {
            confirmButton: "btn btn-danger",
          },
          buttonsStyling: false,
        });

        await toggleCompose();
      }
    }
  };

  const clearFilters = () => {
    companyListRef?.current?.clearFilters();
  };

  // Modal close
  const closeModal = () => {
    clearErrors();
    setShows(false);
    toggleCompose();
  };

  useEffect(() => {
    setFinancialYearList(YearList);
  }, []);

  // ** select option
  // const selectFromYear = (value) => {
  //   setSelectedYear(value?.value);
  // };
  const selectFromYear = (value) => {
    setSelectedYear(value);
    const setDt =
      Number(YearList?.srNo) > Number(value?.srNo)
        ? selectedYearTo
        : YearList[0];

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
                options={financialYearList}
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
            <Col xs={12}>
              <CompanyList
                companyData={companyData}
                selectedCompanies={selectedCompanies}
                setSelectedCompanies={setSelectedCompanies}
                ref={companyListRef}
              />
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </Form>
  );
}

export default DeleteModelCMP08;
