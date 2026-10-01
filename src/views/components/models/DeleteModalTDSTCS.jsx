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
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Select from "react-select";
import { selectThemeColors } from "@utils";
import "@styles/react/libs/react-select/_react-select.scss";
import { SELECT_MAXSIZE } from "../../../configs/config";
import errorCodeConfig from "@configs/apiErrorCodeConfig";
import makeAnimated from "react-select/animated";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { X } from "react-feather";
import { globleVariable } from "../../../configs/globalVariable";
import LocalFunction from "../../../configs/getLocalFunction";
import tdstcsFiledService from "../../../services/tdstcsFiled/tdstcsFiledService";
import getSessionFunction from "@configs/getSessionFunction";

const animatedComponents = makeAnimated();

function DeleteModelTDSTCS({
  Heading,
  SuccessButtonText,
  toggleCompose,
  fromYear,
  toYear,
  callBackAfterDelete,
}) {
  const { handleSubmit, clearErrors } = useForm();

  const [loading, setLoading] = useState(true);
  const [shows, setShows] = useState(true);
  const [block, setBlock] = useState(false);
  const [allCheckedMail, setAllCheckedMail] = useState(true);
  const [isCheckedMail, setIsCheckedMail] = useState();
  const [checkedData, setCheckedData] = useState([]);

  const [panDataFrom, setPanDataFrom] = useState([]);
  const [panData, setPanData] = useState([]);
  const [finFromYear, setFinFormYear] = useState(fromYear);
  const [finToYear, setFinToYear] = useState(toYear);

  const finYearOption = LocalFunction.getLocalValue(
    globleVariable.rangeFilters,
    true
  );
  const YearList = JSON.parse(finYearOption);

  const G_UCParId =
    sessionStorage.getItem(globleVariable.G_UCParId) &&
    getSessionFunction.getSessionValue(globleVariable.G_UCParId, true);

  const USerId =
    localStorage.getItem(globleVariable.userId) &&
    LocalFunction.getLocalValue(globleVariable.userId, true);

  const sectionListOfTdsTcs = [
    { sectionname: "TDS", sectionId: 1 },
    { sectionname: "TDSA", sectionId: 2 },
    { sectionname: "TCS", sectionId: 3 },
    { sectionname: "TCSA", sectionId: 4 },
  ];

  const array = [];

  sectionListOfTdsTcs.map((ele, index) => {
    array.push({ label: ele.sectionname, value: ele.sectionId });
  });

  const onSubmit = (data) => {
    const itemList = Object.keys(isCheckedMail)
      .map((key) => {
        if (isCheckedMail[key] === true) {
          return key;
        }
      })
      .filter((p) => p !== null && p !== "" && p !== undefined);

    if (itemList.length > 0) {
      const payLoad = {
        fromRange: finFromYear?.value,
        toRange: finToYear?.value,
        userClientId: G_UCParId,
        userId: USerId,
        sectionId: itemList,
      };
      clearErrors();
      setShows(false);
      setBlock(true);
      tdstcsFiledService
        .deleteAllSection(payLoad)
        .then((res) => {
          setBlock(false);
          if (
            res.status === 200 &&
            res.data.status === errorCodeConfig.APIDefaultCode.Success
          ) {
            callBackAfterDelete();
            toast.success(res.data.successMessage, {
              position: "top-right",
            });
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
    } else {
      toast.error("Please atleast one option select.", {
        position: "top-right",
      });
    }
  };

  const closeModal = () => {
    clearErrors();
    setShows(false);
    toggleCompose();
  };

  const selectFromYear = (value) => {
    setFinFormYear(value);
    const setDt =
      Number(finToYear?.srNo) > Number(value?.srNo)
        ? finToYear
        : panDataFrom[0];
    const x = panDataFrom?.filter(
      (item) => Number(item.srNo) >= Number(value.srNo)
    );

    setFinToYear(setDt);
    setPanData(x);
  };

  const selectFromMonth = (value) => {
    setFinToYear(value);

    if (Number(finFromYear?.srNo) > Number(value?.srNo)) {
      const fromFilter = panDataFrom?.filter(
        (item) => Number(item.srNo) == Number(value.srNo)
      )[0];
      setFinFormYear(fromFilter);
    }
  };

  const handleAllCheck = (e) => {
    setAllCheckedMail(e.target.checked);
  };

  useEffect(() => {
    setPanDataFrom(YearList);
    setPanData(YearList);
  }, []);

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

  const handleSingleCheck = (item, e) => {
    setIsCheckedMail({ ...isCheckedMail, [e.target.name]: e.target.checked });
  };

  useEffect(() => {
    checkedDataList();
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
        className="modal-dialog-centered modal-sm"
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
          <Row key={123}>
            <div style={{ width: "33%" }}>
              <div className="form-check form-check-danger">
                <label className="checkbox-inline">
                  <Input
                    // key={i}
                    type="checkbox"
                    // name={item.value}
                    name="checkall"
                    checked={allCheckedMail}
                    onChange={handleAllCheck}
                  />
                  <span>
                    {" "}
                    <b>All</b>{" "}
                  </span>
                </label>
              </div>
            </div>
          </Row>
          <Row tag="form" className="gy-1 pt-75">
            {!loading
              ? checkedData &&
                checkedData.map((item, i) => {
                  return (
                    <div style={{ width: "33%" }}>
                      <div className="form-check form-check-danger">
                        <label className="checkbox-inline">
                          <Input
                            key={i}
                            type="checkbox"
                            name={item.value}
                            checked={isCheckedMail[item.value]}
                            onChange={(e) => handleSingleCheck(item, e)}
                          />
                          <span>
                            {" "}
                            <b>{item.label}</b>{" "}
                          </span>
                        </label>
                      </div>
                    </div>
                  );
                })
              : ""}
            <Row>
              <Col xs={6}>
                <Label className="form-label mt-2" for="status">
                  <b>From</b>
                </Label>
                <Select
                  id="from"
                  placeholder="From"
                  isClearable={false}
                  theme={selectThemeColors}
                  closeMenuOnSelect={true}
                  options={panDataFrom}
                  className="basic-multi-select col-md-10"
                  classNamePrefix="select"
                  components={animatedComponents}
                  onChange={selectFromYear}
                  value={finFromYear}
                  maxMenuHeight={SELECT_MAXSIZE}
                />
              </Col>
              <Col xs={6}>
                <Label className="form-label mt-2" for="status">
                  <b>To </b>
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
                  classNamePrefix="select"
                  onChange={selectFromMonth}
                  value={finToYear}
                  maxMenuHeight={SELECT_MAXSIZE}
                />
              </Col>
              <Col xs={12} className="text-center mt-2 pt-50">
                <Button type="submit" className="me-1" outline color="danger">
                  {SuccessButtonText ? SuccessButtonText : "Submit"}
                </Button>
                <Button
                  type="reset"
                  color="secondary"
                  outline
                  onClick={closeModal}
                >
                  Cancel
                </Button>
              </Col>
            </Row>
          </Row>
        </ModalBody>
      </Modal>
    </Form>
  );
}

export default DeleteModelTDSTCS;
