// ** React Imports
import { Fragment, useState, useEffect, useRef } from "react";
// ** Custom Components
import InputPasswordToggle from "@components/input-password-toggle";
// ** Custom Components
import Breadcrumbs from "@components/breadcrumbs";
import errorCodeConfig from "../../../configs/apiErrorCodeConfig";
// ** Reactstrap Imports
import {
  Row,
  Col,
  Form,
  Card,
  Input,
  Label,
  Button,
  CardBody,
  FormFeedback,
  UncontrolledTooltip,
} from "reactstrap";
import moment from "moment/moment";
import { useForm, Controller } from "react-hook-form";
import companyNewService from "../../../services/company/companyNewService";
// ** Styles
import "@styles/react/pages/page-profile.scss";
import Swal from "sweetalert2";
import { Download } from "react-feather";
import withReactContent from "sweetalert2-react-content";
import toast from "react-hot-toast";
// import UserMastetServie from "../../../services/userMasterService";
// import { SECRET_PARAMETER } from "../../../configs/config";
// ** Model
import { VendorColumns, emptyColumns } from "./user-list-column";
import SMPTService from "../../../services/smptService";
import classnames from "classnames";
import Select, { components } from "react-select"; // eslint-disable-line
// import makeAnimated from 'react-select/animated'
import { selectThemeColors } from "@utils";
import $ from "jquery";
// ** Handsontable
import { HotTable, HotColumn } from "@handsontable/react";
import Handsontable from "handsontable";
import { registerRenderer, textRenderer } from "handsontable/renderers";
import { registerAllModules } from "handsontable/registry";
import smptService from "../../../services/smptService";
import { DROPDOWN_PLACEHOLDER, messageShowDuration } from "@configs/config";

// ** Session get and set
import { globleVariable } from "../../../configs/globalVariable";
import LocalFunction from "../../../configs/getLocalFunction";
import SessionFunction from "../../../configs/getSessionFunction";
import { RowSize, columnHeaderSize } from "../../../configs/config";
import { handleKeyPressPass, handleKeyPressText, handlePasteText } from "../../../helper/validation";

const isuserId = LocalFunction.getLocalValue(globleVariable.userId, true);
const isStateList = JSON.parse(
  LocalFunction.getLocalValue(globleVariable.stateList, true)
);

const MySwal = withReactContent(Swal);
registerAllModules();

const sourceType = localStorage.getItem("sourceType");

let updateUserId = null;
let updateRoleId = null;
let updateReferredBy = null;
let updateRole = null;
let isChecked = false;

const Profile = (props) => {
  const { tabId } = props;
  const [fromTitle, setFromTitle] = useState("Profile Details");
  const [btnTitle, setBtnTitle] = useState("Update");
  const [block, setBlock] = useState(false);
  const [userListData, setUserListData] = useState([]);
  const [smtpSettingData, setSmtpSettingData] = useState([]);
  const [vendorData, setVendorData] = useState([]);

  const [types, setTypes] = useState(false);
  const [refreshApi, setRefreshApi] = useState(false);
  const [enableSSL, setEnableSSL] = useState(false);
  const [smtpId, setSmtpId] = useState(null);
  const [btnDisable, setBtnDisable] = useState(true);
  const hotRef = useRef(null);
  const hotRefSMTP = useRef(null);
  const hotRefVendor = useRef(null);
  const inputFile = useRef(null);

  const typesList = [
    { value: "1", label: "To" },
    { value: "2", label: "Cc" },
    { value: "3", label: "Bcc" },
  ];

  //**  Session Get DecryptData
  const isG_UCParId =
    sessionStorage.getItem(globleVariable.G_UCParId) &&
    SessionFunction.getSessionValue(globleVariable.G_UCParId, true);
  const isG_UCID =
    sessionStorage.getItem(globleVariable.G_UCID) &&
    SessionFunction.getSessionValue(globleVariable.G_UCID, true);

  useEffect(() => {
    return () => setBlock(false);
  }, []);

  // ** Hooks
  const defaultValues = {
    vendorId: 0,
    userClientId: 0,
    code: "",
    legalCompanyName: "",
    tradeName: "",
    gstinNumber: "",
    email: "",
    panNumber: "",
    contactPerson: "",
    phoneNumber: "",
    alternateMobileNumber: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    type: "",
  };

  // ** States
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors },
    getValues,
    clearErrors,
    reset,
    setValue,
  } = useForm({ defaultValues });

  useEffect(() => {
    if (tabId == 5) {
      setFromTitle("Vendor List");
      setBtnTitle("Save");
      vendorDetail();
    }
  }, []);

  function colHeaders(col) {
    let txt;
    switch (col) {
      case 0:
        txt = "<input type='checkbox' class='checker'  ";
        txt += isChecked ? 'checked="checked"' : "";
        txt += ">";
        return txt;
    }
  }

  const GSTINCheck = (gstin) => {
    if (
      gstin == " " ||
      gstin == null ||
      gstin == undefined ||
      gstin.trim().length == 0
    ) {
      // setError("gstinNumber", {
      //   type: "manual",
      //   message: "Please insert GSTIN",
      // });
    } else {
      companyNewService
        .getGSTINValidate(gstin)
        .then((res) => {
          if (
            res.status === 200 &&
            res.data.status === errorCodeConfig.APIDefaultCode.Success
          ) {
            clearErrors("gstinNumber");
          } else {
            setValue("gstinNumber", null);
            setError("gstinNumber", {
              type: "manual",
              message: res.data.errorMessage,
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
        });
    }
  };

  //** Filter CSTIN
  const theader = (col, TH) => {
    if (col != 4) {
      const button = TH.children[0].children[0];
      button.parentNode.removeChild(button);
    }
    if (col == 15) {
      TH.className = "htCenter";
    } else {
      TH.className = "htLeft";
    }
  };

  const vendorDetail = (value) => {
    setBlock(true);
    let payload;
    if (value) {
      payload = {
        userClientId: isG_UCParId,
        gstin: [value],
      };
    } else {
      payload = {
        userClientId: isG_UCParId,
        gstin: [],
      };
    }

    SMPTService.getVendor(payload)
      .then((res) => {
        setBlock(false);
        if (res.status == 200) {
          const resData = res?.data?.data;
          if (resData == null) {
            setVendorData([]);
          } else {
            setVendorData(resData);
          }
        } else {
          setBlock(false);
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
          text: error.message,
          customClass: {
            confirmButton: "btn btn-danger",
          },
          buttonsStyling: false,
        });
      });
  };

  const handleChangefile = (e) => {
    const chosenFiles = Array.prototype.slice.call(e.target.files);
    var fileName = e.target.files[0];

    if (e.target.files.length > 0) {
      if (
        fileName.name.lastIndexOf(".xlsx").toString().toLowerCase() === -1 &&
        fileName.name.lastIndexOf(".xls").toString().toLowerCase() === -1
      ) {
        toast.error("Please note: only excel file formats are allowed.", {
          position: "top-right",
          duration: messageShowDuration,
        });
      } else {
        const uploadData = new FormData();
        chosenFiles.forEach((item) => {
          uploadData.append(`File`, item);
        });

        setBlock(true);
        // loadFunction(true);
        //Old code of user client
        //Gstr2bService.importGSTR2BGovtFile(uploadData, sessionStorage.getItem("G_UCID")

        //New Code
        smptService
          .importVendorMasterListFile(uploadData, isG_UCParId, isuserId)
          .then((res) => {
            setBlock(false);

            if (
              res.status === 200 &&
              res.data.status === errorCodeConfig.APIDefaultCode.Success
            ) {
              toast.success(res.data.successMessage, {
                position: "top-right",
                duration: messageShowDuration,
              });
              vendorDetail();

              e.target.value = null;
              // inputFile.current.remove();
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
          });
      }
    }
    // setTooltipOpen(false)
    e.target.value = null;
  };

  const fileselect = () => {
    inputFile.current.click();
  };

  const deleteSMTP = async (smtpId) => {
    return MySwal.fire({
      title: "Are you sure delete this  record ?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      customClass: {
        confirmButton: "btn btn-outline-danger",
        cancelButton: "btn btn-outline-dark ms-1",
      },
      buttonsStyling: false,
      allowOutsideClick: false,
    }).then(function (result) {
      if (result.value) {
        var delArr = [];
        if (smtpId) {
          delArr = [smtpId];
        } else {
          if (vendorData?.length > 0) {
            for (let i = 0; i < vendorData?.length; i++) {
              if (
                vendorData[i].isChecked == "true" ||
                vendorData[i].isChecked == true
              ) {
                delArr.push(vendorData[i].vendorId);
              }
            }
          }
        }

        var payload = {
          vendorIds: delArr,
          userId: isuserId,
        };

        // setBlock(true);
        smptService
          .deleteVendor(payload)
          .then((res) => {
            setBlock(false);
            if (
              res.status == 200 &&
              res.data.status === errorCodeConfig.APIDefaultCode.Success
            ) {
              toast.success(res.data.successMessage, {
                position: "top-right",
                duration: messageShowDuration,
              });
              vendorDetail();
            } else {
              setBlock(false);
              Swal.fire({
                icon: "error",
                title: "",
                text: res?.data?.errorMessage,
                // text:"something went wrong",
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
              text: error.message,
              customClass: {
                confirmButton: "btn btn-danger",
              },
              buttonsStyling: false,
            });
          });
      }
    });
  };

  const stateList = JSON.parse(isStateList);

  function myBtnsVendor(instance, td, row, col, prop, value, cellProperties) {
    Handsontable.renderers.TextRenderer.apply(this, arguments);

    if (tabId == 5) {
      td.innerHTML =
        '<button class="btn add-edit"><i class="fa fa-edit" title="Edit"></i></button><button class="btn add-delete" title="Delete"><i class="fa fa-trash"></i></button>';

      const hotVendor = hotRefVendor?.current?.hotInstance;

      if (row !== -1 && col == 15) {
        const {
          vendorId,
          code,
          legalCompanyName,
          tradeName,
          gstin,
          email,
          panNumber,
          contactPerson,
          phoneNumber,
          alternateMobileNumber,
          address,
          city,
          stateId,
          pincode,
          type,
        } = hotVendor?.getSourceDataAtRow(cellProperties.row);

        $(td)
          .find(".add-edit")
          .on("click", (event) => {
            const userData = hotVendor.getSourceDataAtRow(cellProperties.row);

            const newX = stateList?.filter((item) => item.value == stateId)[0];

            if (userData !== null) {
              clearErrors();

              let filterType = typesList.filter(
                (p) =>
                  p.label.toString().toLowerCase() ==
                  type.toString().toLowerCase()
              )[0];

              setValue("code", code);
              setValue("legalCompanyName", legalCompanyName);
              setValue("tradeName", tradeName);
              setValue("gstinNumber", gstin);
              setValue("email", email);
              setValue("panNumber", panNumber);
              setValue("contactPerson", contactPerson);
              setValue("phoneNumber", phoneNumber);
              setValue("alternateMobileNumber", alternateMobileNumber);
              setValue("address", address);
              setValue("city", city);
              setValue("state", newX);
              setValue("pincode", pincode);
              setValue(
                "type",
                filterType !== "" &&
                  filterType !== null &&
                  filterType !== undefined
                  ? filterType
                  : ""
              );
              setValue("vendorId", vendorId);
              setBtnTitle("Update");
            }
          });

        $(td)
          .find(".add-delete")
          .on("click", (event) => {
            deleteSMTP(vendorId);
          });
      } else {
        td.innerHTML =
          '<button class="btn"><i className="add-edit fa fa-edit" title="Edit"></i></button>';
        const hot = hotRef?.current?.hotInstance;
        $(td)
          .find(".add-edit")
          .on("click", (event) => {
            // const userData = hot.getSourceDataAtRow(cellProperties.row);
            // props.funcUser(userData);
            // props.profileData(2);
          });
      }
    }
  }

  //** Validation string trim
  const ValidateString = (data) => {
    if (data == undefined || data == "" || data.trim().length == 0) {
      return false;
    } else {
      return true;
    }
  };

  const onSubmitVendor = (data) => {
    let isValid = true;

    if (!ValidateString(data.legalCompanyName)) {
      setError("legalCompanyName", {
        type: "manual",
        message: "Invalid LegalName Of Company",
      });
      isValid = false;
    }
    if (!ValidateString(data.tradeName)) {
      setError("tradeName", {
        type: "manual",
        message: "Invalid TradeName Of Company",
      });
      isValid = false;
    }

    if (isValid == true) {
      let payLoad = {};
      if (isG_UCID == null || isG_UCID == "" || isG_UCID == undefined) {
        toast.error("Please select company login first!", {
          position: "top-right",
          duration: messageShowDuration,
        });
      } else {
        if (btnTitle) {
          payLoad = {
            userId: isuserId,
            getVendormasterAPIModels: [
              {
                vendorId: btnTitle == "save" ? 0 : data?.vendorId,
                userClientId: isG_UCParId,
                code:
                  data.code !== null && data.code !== ""
                    ? data.code.trim()
                    : "",
                legalCompanyName:
                  data.legalCompanyName !== null && data.legalCompanyName !== ""
                    ? data.legalCompanyName.trim()
                    : "",
                tradeName:
                  data.tradeName !== null && data.tradeName !== ""
                    ? data.tradeName.trim()
                    : "",
                gstin:
                  data.gstinNumber !== null && data.gstinNumber !== ""
                    ? data.gstinNumber.trim()
                    : "",
                email:
                  data.email !== null && data.email !== ""
                    ? data.email.trim()
                    : "",
                panNumber:
                  data.panNumber !== null && data.panNumber !== ""
                    ? data.panNumber.trim()
                    : "",
                contactPerson:
                  data.contactPerson !== null && data.contactPerson !== ""
                    ? data.contactPerson.trim()
                    : "",
                phoneNumber: data.phoneNumber,
                alternateMobileNumber: data.alternateMobileNumber,
                address:
                  data.address !== null && data.address !== ""
                    ? data.address.trim()
                    : "",
                city:
                  data.city !== null && data.city !== ""
                    ? data.city.trim()
                    : "",
                state: data.state?.value?.toString(),
                pincode: data.pincode,
                type:
                  data?.type?.value !== null &&
                  data?.type?.value !== "" &&
                  data?.type?.value !== undefined
                    ? data?.type?.label
                    : "",
              },
            ],
          };

          smptService
            .addEditVendor(payLoad)
            .then((res) => {
              setBlock(false);

              if (
                res.status == 200 &&
                res.data.status === errorCodeConfig.APIDefaultCode.Success
              ) {
                resetForm();
                vendorDetail();
                toast.success(res.data.successMessage, {
                  position: "top-right",
                  duration: messageShowDuration,
                });
              } else {
                setBlock(false);
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
                text: error.message,
                customClass: {
                  confirmButton: "btn btn-danger",
                },
                buttonsStyling: false,
              });
            });
        }
      }
    }
  };

  const resetForm = () => {
    setEnableSSL(false);
    setBtnTitle("Save");
    reset();
  };

  function localAfterOnCellMouseDown(event, coords, td) {
    let hot = hotRefVendor?.current?.hotInstance;

    if (coords.col == 0 && coords.col !== 15) {
      const totalRows = hot?.countRows();
      // setCurrentCol1(coords?.col)
      if (event.target.classList.contains("checker")) {
        if (!isChecked) {
          isChecked = true;
          for (let index = 0; index < totalRows; index++) {
            hot.setDataAtCell(index, 0, true);
          }
        } else {
          isChecked = false;
          for (let index = 0; index < totalRows; index++) {
            hot.setDataAtCell(index, 0, false);
          }
        }
      }
    }

    //  }
  }

  return (
    <>
      <Fragment>
        {block && <div className="loading1">Loading&#8230;</div>}
        <Card className="bg-transparent">
          <CardBody className="p-0">
            <div className="content-header">
              <Row>
                <Col md="10" className="mb-1">
                  
                  <h2 className="mb-0">{fromTitle}</h2>
                </Col>
                <Col md="2" className="mb-1 justify-content-end text-end px-0">
                  <Button
                    className=" me-1  ms-1 btn-icon btn-round dropdown-toggle btn "
                    outline
                    color="danger"
                    id="btnImport"
                    onClick={fileselect}
                  >
                    <Download size={14} />
                    <span className="align-middle ms-50">Import</span>
                  </Button>
                  <input
                    type="file"
                    id="file"
                    ref={inputFile}
                    onChange={(e) => handleChangefile(e)}
                    // Remove CSS
                    style={{ display: "none" }}
                  />
                  <UncontrolledTooltip placement="top" target="btnImport">
                    Import
                  </UncontrolledTooltip>
                </Col>
              </Row>
            </div>

            {tabId == 5 && (
              <>
                <Form
                  className="mt-1 pt-50"
                  onSubmit={handleSubmit(onSubmitVendor)}
                >
                  <Row>
                    <Col md="4" className="mb-1">
                      <Label className="form-label">Vendor Code</Label>
                      <Controller
                        id="code"
                        name="code"
                        control={control}
                        render={({ field }) => (
                          <Input
                            placeholder=""
                            invalid={errors?.code?.message && true} 
                            {...field}
                            // onChange={(e) =>
                            //   field.onChange(e.target.value.replace(/\s/g, ""))
                            // }
                            onKeyPress={(e) => handleKeyPressPass(e, setError,'code','Vendor Code','space')}
                            onPaste={(e) => handlePasteText(e, setError,'code','Vendor Code','space')}
                          
                          />
                        )}
                      />
                      {errors.code && (
                        <FormFeedback>{errors.code.message}</FormFeedback>
                      )}
                    </Col>

                    <Col md="4" className="mb-1">
                      <Label className="form-label requiredlable">
                        Email Id
                      </Label>
                      <Controller
                        rules={{
                          required: "Please enter valid email.",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Please enter valid email.",
                          },
                        }}
                        id="email"
                        name="email"
                        control={control}
                        render={({ field }) => (
                          <Input
                            placeholder=""
                            invalid={errors?.email?.message && true}
                            {...field}
                            onPaste={(e) => handlePasteText(e, setError,'email','email','space')}
                            onKeyPress={(e) => handleKeyPressText(e, setError,'email')}
                          />
                        )}
                      />
                      {errors.email && (
                        <FormFeedback>{errors.email.message}</FormFeedback>
                      )}
                    </Col>

                    <Col md="4" className="mb-1">
                      <Label className="form-label requiredlable">
                        Legal Name of Company
                      </Label>
                      <Controller
                        rules={{
                          required: "Please enter legal name.",
                        }}
                        id="legalCompanyName"
                        name="legalCompanyName"
                        control={control}
                        render={({ field }) => (
                          <Input
                            placeholder=""
                            invalid={errors?.legalCompanyName?.message && true}
                            {...field}
                            onKeyPress={(e) => handleKeyPressPass(e, setError,'legalCompanyName','legal Company Name','allowSpace')}
                            onPaste={(e) => handlePasteText(e, setError,'legalCompanyName','legal Company Name','allowSpace')}
                          />
                        )}
                      />
                      {errors.legalCompanyName && (
                        <FormFeedback>
                          {errors.legalCompanyName.message}
                        </FormFeedback>
                      )}
                    </Col>

                    <Col md="4" className="mb-1">
                      <Label className="form-label requiredlable">
                        Trade Name of Company
                      </Label>
                      <Controller
                        rules={{
                          required: "Please enter trade name.",
                        }}
                        id="tradeName"
                        name="tradeName"
                        control={control}
                        render={({ field }) => (
                          <Input
                            placeholder=""
                            invalid={errors?.tradeName?.message && true}
                            {...field}
                            onChange={field.onChange}
                            onKeyPress={(e) => handleKeyPressPass(e, setError,'tradeName','tradeName','allowSpace')}
                            onPaste={(e) => handlePasteText(e, setError,'tradeName','tradeName','allowSpace')}
                          />
                        )}
                      />
                      {errors.tradeName && (
                        <FormFeedback>{errors.tradeName.message}</FormFeedback>
                      )}
                    </Col>

                    <Col md="4" className="mb-1">
                      <Label className="form-label requiredlable">GSTIN</Label>
                      <Controller
                        rules={{ required: "Please enter valid GST" }}
                        id="gstinNumber"
                        name="gstinNumber"
                        control={control}
                        render={({ field }) => (
                          <Input
                            placeholder=""
                            invalid={errors.gstinNumber && true}
                            {...field}
                            onChange={(e) =>
                              field.onChange(e.target.value.replace(/\s/g, ""))
                            }
                            onKeyPress={(e) => {
                              if (new RegExp(/[a-zA-Z0-9"]/).test(e.key)) {
                              } else e.preventDefault();
                            }}
                            maxLength={15}
                            onBlur={(e) => GSTINCheck(e.target.value)}
                          />
                        )}
                      />
                      {errors.gstinNumber && (
                        <FormFeedback>
                          {errors.gstinNumber.message}
                        </FormFeedback>
                      )}
                    </Col>
                    <Col md="4" className="mb-1">
                      <Label className="form-label requiredlable">Type</Label>

                      <Controller
                        id="type"
                        name="type"
                        control={control}
                        rules={{ required: "Please enter Type" }}
                        render={({ field }) => (
                          <Select
                            isClearable={false}
                            value={field.value}
                            options={typesList}
                            placeholder={DROPDOWN_PLACEHOLDER}
                            classNamePrefix="select"
                            theme={selectThemeColors}
                            onChange={field.onChange}
                            className={classnames("react-select", {
                              "is-invalid": errors.type && true,
                            })}
                            {...field}
                          />
                        )}
                      />
                      {errors.type && (
                        <FormFeedback>{errors.type.message}</FormFeedback>
                      )}
                    </Col>
                  </Row>

                  <Row>
                    <Col md="4" className="mb-1">
                      <Label className="form-label">Pan Number</Label>
                      <Controller
                        id="panNumber"
                        name="panNumber"
                        control={control}
                        rules={{
                          pattern: {
                            value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i,
                            message: "Please enter valid panno.",
                          },
                        }}
                        render={({ field }) => (
                          <Input
                            placeholder=""
                            minLength={10}
                            maxLength={10}
                            invalid={errors?.panNumber?.message && true} 
                            {...field}
                            // onChange={(e) =>
                            //   field.onChange(e.target.value.replace(/\s/g, ""))
                            // }
                            onKeyPress={(e) => handleKeyPressPass(e, setError,'panNumber','panNumber','space')}
                            onPaste={(e) => handlePasteText(e, setError,'panNumber','panNumber','space')}
                          />
                        )}
                      />
                      {errors.panNumber && (
                        <FormFeedback>{errors.panNumber.message}</FormFeedback>
                      )}
                    </Col>

                    <Col md="4" className="mb-1">
                      <Label className="form-label">Contact Person</Label>
                      <Controller
                        id="contactPerson"
                        name="contactPerson"
                        control={control}
                        render={({ field }) => (
                          <Input
                            placeholder=""
                            invalid={errors?.contactPerson?.message && true} 
                            {...field}
                            onChange={field.onChange}
                            // onChange={(e) =>
                            //   field.onChange(e.target.value.replace(/\s/g, ""))
                            // }
                            onKeyPress={(e) => handleKeyPressPass(e, setError,'contactPerson','contactPerson','allowSpace')}
                            onPaste={(e) => handlePasteText(e, setError,'contactPerson','contactPerson','allowSpace')}
                          />
                        )}
                      />
                      {errors.contactPerson && (
                        <FormFeedback>
                          {errors.contactPerson.message}
                        </FormFeedback>
                      )}
                    </Col>

                    <Col md="4" className="mb-1">
                      <Label className="form-label">Phone Number</Label>
                      <Controller
                        id="phoneNumber"
                        name="phoneNumber"
                        control={control}
                        render={({ field }) => (
                          <Input
                            // type="number"
                            minLength={10}
                            maxLength={10}
                            placeholder=""
                            invalid={errors.phoneNumber && true}
                            {...field}
                            onChange={(e) =>
                              field.onChange(e.target.value.replace(/\D/g, ""))
                            }
                          />
                        )}
                      />
                      {errors.phoneNumber && (
                        <FormFeedback>
                          {errors.phoneNumber.message}
                        </FormFeedback>
                      )}
                    </Col>

                    <Col md="4" className="mb-1">
                      <Label className="form-label">Alternate Number</Label>
                      <Controller
                        id="alternateMobileNumber"
                        name="alternateMobileNumber"
                        control={control}
                        render={({ field }) => (
                          <Input
                            // type="number"
                            placeholder=""
                            minLength={10}
                            maxLength={10}
                            invalid={errors.alternateMobileNumber && true}
                            {...field}
                            onChange={(e) =>
                              field.onChange(e.target.value.replace(/\D/g, ""))
                            }
                          />
                        )}
                      />
                      {errors.alternateMobileNumber && (
                        <FormFeedback>
                          {errors.alternateMobileNumber.message}
                        </FormFeedback>
                      )}
                    </Col>

                    <Col md="4" className="mb-1">
                      <Label className="form-label">Address</Label>
                      <Controller
                        id="address"
                        name="address"
                        control={control}
                        render={({ field }) => (
                          <Input
                            type="text"
                            placeholder=""
                            invalid={errors?.address?.message && true} 
                            {...field}
                            onKeyPress={(e) => handleKeyPressPass(e, setError,'address','address','allowSpace')}
                            onPaste={(e) => handlePasteText(e, setError,'address','address','allowSpace')}
                          />
                        )}
                      />
                      {errors.address && (
                        <FormFeedback>{errors.address.message}</FormFeedback>
                      )}
                    </Col>
                    <Col md="4" className="mb-1">
                      <Label className="form-label">City</Label>
                      <Controller
                        id="city"
                        name="city"
                        control={control}
                        render={({ field }) => (
                          <Input
                            type="text"
                            placeholder=""
                            invalid={errors?.city?.message && true}
                            {...field}
                            onKeyPress={(e) => handleKeyPressPass(e, setError,'city','city','allowSpace')}
                            onPaste={(e) => handlePasteText(e, setError,'city','city','allowSpace')}
                          />
                        )}
                      />
                      {errors.city && (
                        <FormFeedback>{errors.city.message}</FormFeedback>
                      )}
                    </Col>

                    <Col md="4">
                      <Label className="form-label">State</Label>

                      <Controller
                        id="state"
                        name="state"
                        control={control}
                        render={({ field }) => (
                          <Select
                            isClearable={false}
                            classNamePrefix="select"
                            value={field.value}
                            options={stateList}
                            {...field}
                            invalid={errors.state && true}
                            theme={selectThemeColors}
                            className={classnames("react-select", {
                              "is-invalid": errors.state && true,
                            })}
                          />
                        )}
                      />
                      {errors.state && (
                        <FormFeedback>{errors.state.message}</FormFeedback>
                      )}
                    </Col>
                    <Col md="4" className="mb-1">
                      <Label className="form-label">Pincode</Label>
                      <Controller
                        id="pincode"
                        name="pincode"
                        control={control}
                        render={({ field }) => (
                          <Input
                            // type="number"
                            placeholder=""
                            invalid={errors.pincode && true}
                            {...field}
                            minLength={6}
                            maxLength={6}
                            onChange={(e) =>
                              field.onChange(e.target.value.replace(/\D/g, ""))
                            }
                          />
                        )}
                      />
                      {errors.pincode && (
                        <FormFeedback>{errors.pincode.message}</FormFeedback>
                      )}
                    </Col>
                    <Col
                      className="d-flex align-items-center mt-1 justify-content-end"
                      md="4"
                      sm="12"
                    >
                      <Button
                        type="submit"
                        className="me-1"
                        color="primary"
                        outline

                      >
                        {btnTitle}
                      </Button>

                      <Button
                        color="secondary"
                        onClick={resetForm}
                        outline

                      >
                        Discard
                      </Button>

                      <Button
                        className="ms-1"
                        outline
                        color="secondary"

                        id="btnDelete"
                        disabled={btnDisable}
                        onClick={() => deleteSMTP(false)}
                      >
                        Delete
                      </Button>
                    </Col>
                  </Row>
                </Form>{" "}
                <br />{" "}
                {vendorData?.length ? (
                  <HotTable
                    ref={hotRefVendor}
                    // mergeCells={[{ row: 0, col: 0, rowspan: 1, colspan: 7 }]}
                    data={vendorData}
                    rowHeights={RowSize}
                    columnHeaderHeight={columnHeaderSize}
                    autoColumnSize={{
                      samplingRatio: 23, // Adjust the samplingRatio as needed
                    }}
                    manualColumnResize={true}
                    autoWrapRow={true}
                    colHeaders={colHeaders}
                    preventOverflow="horizontal"
                    columns={VendorColumns}
                    licenseKey="non-commercial-and-evaluation"
                    height="auto"
                    hiddenColumns={false}
                    afterGetColHeader={theader}
                    dropdownMenu={{
                      items: {
                        filter_by_value: {
                          name: "Search Value",
                          // hide the 'Filter by value' list from all columns but the first one
                        },
                        clear: {
                          name: `<button id='btnClear' name='Clear'   tabIndex="-1"  value='Clear'>Clear</button>`,
                          //disabled: true,
                          callback: function (key, selection, clickEvent) {
                            var src = clickEvent.target;

                            if (src.tagName.toLowerCase() === "button") {
                              if (clickEvent.target.id == "btnClear") {
                                var searchInput = document.querySelector(
                                  ".htUIMultipleSelectSearch.htUIInput"
                                );
                                var value = searchInput.children[0].value; // alert(data);

                                vendorDetail(value);
                              }

                              clickEvent.stopImmediatePropagation();
                            }

                            clickEvent.stopImmediatePropagation();
                          },
                        },

                        filter_action_bar: {},
                      },
                    }}
                    filters={true}
                    afterFilter={function (data) {
                      var searchInput = document.querySelector(
                        ".htUIMultipleSelectSearch.htUIInput"
                      );
                      var value = searchInput.children[0].value; // alert(data);

                      vendorDetail(value);
                      // purchaseSummaryList2(activeTab);
                    }}
                    nestedRows={true}
                    // autoColumnSize={true}
                    rowHeaders={false}
                    contextMenu={false}
                    bindRowsWithHeaders={true}
                    stretchH="all"
                    readOnly={true}
                    afterOnCellMouseDown={localAfterOnCellMouseDown}
                    // fixedColumnsStart={14}
                    cells={function (row, col) {
                      const cellPrp = {};

                      if (col === 0) {
                        let hot = hotRefVendor?.current?.hotInstance;
                        let valuebtn = hot.getData();

                        const filterData = valuebtn.filter((p) => p[0] == true);

                        if (filterData.length > 0) {
                          setBtnDisable(false);
                        } else {
                          setBtnDisable(true);
                        }
                      }

                      if (col === 15) {
                        cellPrp.renderer = myBtnsVendor;
                        cellPrp.readOnly = true;
                        cellPrp.className = "text-center"
                      }
                      return cellPrp;
                    }}
                    mergeCells={false}
                  />
                ) : (
                  <HotTable
                    ref={hotRefVendor}
                    mergeCells={[{ row: 0, col: 0, rowspan: 1, colspan: 9 }]}
                    //  isChecked
                    // data={vendorData}
                    autoWrapRow={true}
                    rowHeights={RowSize}
                    columnHeaderHeight={columnHeaderSize}
                    autoColumnSize={{
                      samplingRatio: 23, // Adjust the samplingRatio as needed
                    }}
                    manualColumnResize={true}
                    // Remove CSS
                    // style={{ textAlign: "center" }}
                    data={[{ isChecked: "No Data Found!" }]}
                    colHeaders={colHeaders}
                    preventOverflow="horizontal"
                    columns={emptyColumns}
                    nestedRows={true}
                    contextMenu={false}
                    bindRowsWithHeaders={true}
                    licenseKey="non-commercial-and-evaluation"
                    height="auto"
                    afterGetColHeader={theader}
                    cells={function (row, col) {
                      var cp = {};
                  
                      if (!vendorData.length > 0) {
                       
                          cp.className = "text-center";
                      
                      }
                      return cp;
                    }}
                    dropdownMenu={{
                      items: {
                        filter_by_value: {
                          name: "Search Value",
                          // hide the 'Filter by value' list from all columns but the first one
                        },

                        clear: {
                          name: `<button id='btnClear' name='Clear' tabIndex= "-1"   value='Clear'>Clear</button>`,
                          //disabled: true,
                          callback: function (key, selection, clickEvent) {
                            var src = clickEvent.target;

                            if (src.tagName.toLowerCase() === "button") {
                              if (clickEvent.target.id == "btnClear") {
                                var searchInput = document.querySelector(
                                  ".htUIMultipleSelectSearch.htUIInput"
                                );
                                var value = searchInput.children[0].value; // alert(data);
                                vendorDetail(value);
                              }
                              clickEvent.stopImmediatePropagation();
                            }

                            clickEvent.stopImmediatePropagation();
                          },
                        },

                        filter_action_bar: {},
                      },
                    }}
                    afterFilter={function (data) {
                      var searchInput = document.querySelector(
                        ".htUIMultipleSelectSearch.htUIInput"
                      );
                      var value = searchInput.children[0].value; // alert(data);
                      vendorDetail(value);
                    }}
                    filters={true}
                    // autoColumnSize={true}
                    rowHeaders={false}
                    stretchH="all"
                    readOnly={true}
                    afterOnCellMouseDown={localAfterOnCellMouseDown}
                  />
                )}
              </>
            )}
          </CardBody>
        </Card>
      </Fragment>
    </>
  );
};

export default Profile;
