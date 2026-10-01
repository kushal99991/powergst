// ** React Imports
import { Fragment, useState, useEffect, useRef } from "react";
// ** Custom Components
import InputPasswordToggle from "@components/input-password-toggle";
// ** Custom Components
import Breadcrumbs from "@components/breadcrumbs";
import errorCodeConfig from "../../../configs/apiErrorCodeConfig";
import CompanyNewService from "../../../services/company/companyNewService";
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
  TabContent,
  TabPane,
  Popover,
  PopoverHeader,
  PopoverBody,
  UncontrolledTooltip,
  CardTitle,
} from "reactstrap";
import moment from "moment/moment";

// ** Third Party Components
import * as yup from "yup";

import { yupResolver } from "@hookform/resolvers/yup";

import { useForm, Controller, set } from "react-hook-form";
// ** Styles
import "@styles/react/pages/page-profile.scss";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import toast from "react-hot-toast";
import UserMastetServie from "../../../services/userMasterService";
import {
  PageSize,
  SECRET_PARAMETER,
  messageShowDuration, RowSize,
  columnHeaderSize
} from "@configs/config";
// ** Model
import Registration from "../../../model/registration";
import userRegistrationService from "../../../services/registrationService";
import encryptData from "../../../auth/crypto/crypto";
import decryptData from "../../../auth/crypto/crypto";
import {
  userListColumns,
  SMTPColumns,
  VendorColumns,
} from "./user-list-column";
import SMPTService from "../../../services/smptService";

import $ from "jquery";
// ** Handsontable
import { HotTable, HotColumn } from "@handsontable/react";
import Handsontable from "handsontable";
import { registerRenderer, textRenderer } from "handsontable/renderers";
import { registerAllModules } from "handsontable/registry";
import smptService from "../../../services/smptService";

// ** Session get and set
import { globleVariable } from "../../../configs/globalVariable";
import LocalFunction from "../../../configs/getLocalFunction";
import SessionFunction from "../../../configs/getSessionFunction";
import ReactPaginate from "react-paginate";
import ProfileVerticalTabs from "./profile-tabs";
import Vendor from "./vendorMaster";
import Select from 'react-select'
import { selectThemeColors } from '@utils'
import classnames from "classnames";

import excellImg from "@src/assets/images/pages/excel.jpg";
import { Download, DownloadCloud, Plus, Trash2 } from "react-feather";
import { onSampleTemplateDownload } from "../../components/DownloadSample/DownloadSampleModal";

// ** Custom Components
import ExtensionsHeader from '@components/extensions-header'
import { useDropzone } from 'react-dropzone'
import { read, utils } from 'xlsx'
import { handleKeyPressPass, handleKeyPressText, handlePasteText } from "../../../helper/validation";


// ** Styles
// import '@styles/react/libs/file-uploader/file-uploader.scss'

const sourceType = LocalFunction.getLocalValue(globleVariable.sourceType, true);
const isuserId = LocalFunction.getLocalValue(globleVariable.userId, true);
const issubscriptionId = LocalFunction.getLocalValue(
  globleVariable.subscriptionId,
  true
);

const MySwal = withReactContent(Swal);
registerAllModules();

let updateUserId = null;
let updateRoleId = null;
let updateReferredBy = null;
let updateRole = null;

let isActive = false;
const Profile = (props) => {

  const inputFile = useRef(null);
  let resData = null;

  const userIds = LocalFunction.getLocalValue(globleVariable.userId, true);
  const { activeTab } = props;
  const [tabId, setTabId] = useState("1");
  const [fromTitle, setFromTitle] = useState("User Profile");
  const [btnTitle, setBtnTitle] = useState("Update");
  const [block, setBlock] = useState(false);
  const [userListData, setUserListData] = useState([]);
  const [userListDataFilter, setUserListDataFilter] = useState([]);
  const [smtpSettingData, setSmtpSettingData] = useState([]);
  const [vendorData, setVendorData] = useState([]);
  const [companyList, setCompanyList] = useState([]);
  const [addEditData, setaddEditData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectData, setSelectData] = useState([]);
  const [updateUserListData, setUpdatedUserListData] = useState([]);
  const [types, setTypes] = useState(false);
  const [refreshApi, setRefreshApi] = useState(false);
  const [enableSSL, setEnableSSL] = useState(false);
  const [smtpId, setSmtpId] = useState(null);
  const [editUrl, setEditUrl] = useState(false);
  const [showTab, setShowTab] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState([])
  const [categoryId, setCategoryId] = useState(null)
  const [popoverOpenGSTIN, setPopoverOpenGSTIN] = useState(false);

  const [currentCol1Download, setCurrentCol1Download] = useState();
  const [searchVal1Download, setSearchVal1Download] = useState([]);
  const [currentColDownload, setCurrentColDownload] = useState([]);

  const [page, setPage] = useState(0);


  const [currentColUser1Download, setCurrentColUser1Download] = useState();
  const [searchValUserDownload, setSearchValUserDownload] = useState([]);
  const [currentColUserDownload, setCurrentColUserDownload] = useState([]);

  const [selectRowCount, setSelectRowCount] = useState(0);
  const [filterGSTIN, setFilterGSTIN] = useState([]);
  const [selectCheckAll , setSelectCheckAll] = useState(false)
  const [ isMultipleDelete, setIsMultipleDelete] = useState(false)

  const hotRef = useRef(null);
  const hotRefSMTP = useRef(null);
  const hotRefVendor = useRef(null);
  const hotRefCompany = useRef(null);
  let categoryList = [];
  let arrDownload = []
  let arrFilter = [];

  const isG_UCParId =
    sessionStorage.getItem(globleVariable.G_UCParId) &&
    SessionFunction.getSessionValue(globleVariable.G_UCParId, true);
  const isG_UCID =
    sessionStorage.getItem(globleVariable.G_UCID) &&
    SessionFunction.getSessionValue(globleVariable.G_UCID, true);
  const isCompany = sessionStorage.getItem(globleVariable.isCompany);

  const refSelect = useRef(null)

  const user_Id =
    localStorage.getItem(globleVariable.userId) &&
    LocalFunction.getLocalValue(globleVariable.userId, true);

  // const [name, setName] = useState('')
  // const getTableData = (arr, name) => {

  //   setName(name)
  // }

  // const { getRootProps, getInputProps } = useDropzone({
  //   multiple: false,
  //   onDrop: result => {
  //     const reader = new FileReader()
  //     reader.onload = function () {
  //       const fileData = reader.result
  //       const wb = read(fileData, { type: 'binary' })

  //       wb.SheetNames.forEach(function (sheetName) {
  //         const rowObj = utils.sheet_to_row_object_array(wb.Sheets[sheetName])
  //         getTableData(rowObj, result[0].name)
  //       })
  //     }
  //     if (result.length && result[0].name.endsWith('xlsx')) {
  //       reader.readAsBinaryString(result[0])
  //     } else {
  //       toast.error(
  //         () => (
  //           <p className='mb-0'>
  //             You can only upload <span className='fw-bolder'>.xlsx</span>, <span className='fw-bolder'>.xls</span> &{' '}
  //             <span className='fw-bolder'>.csv</span> Files!.
  //           </p>
  //         ),
  //         {
  //           style: {
  //             minWidth: '380px'
  //           }
  //         }
  //       )
  //     }
  //   }
  // })


  //** import Company
  const onClickiImportCompanyFile = (btnId) => {
    inputFile.current.click();
  };

  useEffect(() => {   
    return () => setBlock(false);
  }, []);

  const showErrors = (field, valueLen, min) => {
    if (valueLen === 0) {
      return `${field} field is required`;
    } else if (valueLen > 0 && valueLen < min) {
      return `${field} must be at least ${min} characters`;
    } else {
      return "";
    }
  };

  const SignupSchema = yup.object().shape({
    newPassword: yup
      .string()
      .min(8, (obj) => showErrors("New Password", obj.value.length, obj.min))
      .required(),
    confirmPassword: yup
      .string()
      .min(8, (obj) =>
        showErrors("Confirm Password", obj.value.length, obj.min)
      )
      .required()
      .oneOf([yup.ref(`newPassword`), null], "Passwords must match"),
  });

  // ** Hooks
  const defaultValues = {
    companyName: "",
    firstName: "",
    lastName: "",
    emailId: "",
    mobileNo: "",
    newPassword: "",
    confirmPassword: "",
    roleId: "",
    displayName: "",
    smtpserverName: "",
    smtpPortNo: "",
    smtpUserName: "",
    clientId: "",
    newPassword1: "",
    FkCategoryId: ""
  };

  //** button - Action column
  function myLables(instance, td, row, col, prop, value, cellProperties) {
    Handsontable.renderers.TextRenderer.apply(this, arguments);
    td.innerHTML = `<div class="truncated">${value !== null && value !== "" ? value : ""
      }</div>`;
  }

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
  } = useForm({
    defaultValues,
    //  resolver: yupResolver(SignupSchema)
  });


  useEffect(() => {
    isActive = false

    setSearchVal1Download([]);
    setCurrentColDownload([])
    // setCompanyList([])
    GetCategoryMasterList();
    if (tabId == 1) {
      userDetail(isuserId);
      setFromTitle("User Profile");
      reset();
      setUpdatedUserListData([]);
      setSelectData([]);
    } else if (tabId == 2) {
      setIsMultipleDelete(false)
      setFromTitle("Add User");
      if (fromTitle == "Add User") {
        setSelectData([]);

      }

      reset();
      setBtnTitle("Save");

      const filterCategory = categoryOptions?.filter(p => p.label.toString().toLowerCase() == categoryId.toString().toLowerCase())[0];
      if (filterCategory) {
        setValue("FkCategoryId", filterCategory);
      }

      // ** Get User Details
    } else if (tabId == 3) {
      setFromTitle("Manage User");
      if (fromTitle == "Manage User") {
        setSelectData([]);
      }
      setUpdatedUserListData([]);
      setSelectData([]);
      reset();
      //  usersList();
    } else if (tabId == 5) {
      setUpdatedUserListData([]);
      setFromTitle("Vendor List");
      setSelectData([]);
      // usersList();
    } else if (tabId == 6) {
      // setUpdatedUserListData([]);
      setFromTitle("Import User Excel");
      // setSelectData([]);
      // usersList();
    } else {
      setFromTitle("SMTP Setting");
      setBtnTitle("Save");
      smtpSettingDetail();
      setUpdatedUserListData([]);
      setSelectData([]);
    }
  }, [tabId]);

  useEffect(() => {
    if (tabId == 2 && refreshApi == true) {
      setFromTitle("Add User");
      reset();
      setBtnTitle("Save");
    }
  }, [tabId, refreshApi]);
  useEffect(() => {
    if (tabId == 3) {
      setTypes(false);
      usersList();
    }
  }, [tabId]);

  useEffect(() => {
    if (tabId == 2 && updateUserListData.length) {
      getCompanyData();

      if (
        updateUserListData !== undefined &&
        updateUserListData !== null &&
        updateUserListData !== ""
      ) {
        setTypes(true);
        const resData = updateUserListData[0];
        updateUserId = resData.userId;
        updateRoleId = resData.roleId;
        updateReferredBy = resData.referredBy;
        updateRole = resData.role;
        setValue("companyName", resData.companyName);
        setValue("firstName", resData.firstName);
        setValue("lastName", resData.lastName);
        setValue("mobileNo", resData.mobile);
        setValue("emailId", resData.email);
        setValue("roleId", resData.roleId);
        setSelectData(resData?.clientId);
        setIsMultipleDelete(resData?.isMultipleCompanyDelete == 1 ? true : false )



        if (sourceType == 0) {
          setValue(
            "newPassword",
            resData.password !== "" && resData.password !== null
              ? decryptData.decrypt(resData.password)
              : ""
          );

          setValue(
            "confirmPassword",
            resData.password !== "" && resData.password !== null
              ? decryptData.decrypt(resData.password)
              : ""
          );
        }
        setFromTitle("Edit User");
        setBtnTitle("Update");
        clearErrors();
      }
    }
  }, [tabId]);


  useEffect(() => {
    const hot = hotRefCompany?.current?.hotInstance;
    const totalRows = hot?.getSourceData()

    for (let index = 0; index < totalRows?.length; index++) {

          if (totalRows[index]["isActive"] == true) {
            hot?.setDataAtCell(index, 0, true);
          }

    }
  }, [currentPage])

  const toggleBulkFilter = (btnType) => {
    setPopoverOpenGSTIN(!popoverOpenGSTIN);
  }

  useEffect(() => {
    const gstinInput = document.getElementById("gstin-bulk-gst")
    if (popoverOpenGSTIN && gstinInput) {
      gstinInput.value = filterGSTIN?.join(",") ? filterGSTIN?.join(",") : filterGSTIN
    }

  }, [popoverOpenGSTIN]);

  const textSplitArray = (values) => {
    let filterValue;
    if (values.indexOf(",") != -1) {
      filterValue = values.split(",");
    } else {
      values = values + "\n";
      filterValue = values.split("\n");
    }
    return filterValue;
  };

  // ** Bulk Search
  const BulkSearch = () => {
    setPopoverOpenGSTIN(false);
    const gstInValue = document.getElementById("gstin-bulk-gst").value;

    if (gstInValue) {
      const fitlerValue = textSplitArray(gstInValue);

      setFilterGSTIN(fitlerValue)



      if (fitlerValue && companyList?.length > 0) {

        let checkedData = companyList?.map(ele => ({
          ...ele,
          isActive: selectData.includes(ele?.clientId)  || fitlerValue.some(filter => filter.toString().includes(ele.gstinNumber?.toString())),
        }));

        setCompanyList(checkedData)


        const countsSelect = checkedData?.filter(p => p.isActive == true);

        setSelectRowCount(countsSelect?.length)

        let newK = [];
        checkedData?.map((item, index) => {
          if (item?.isActive) {
            newK.push(item?.clientId);
          }
        });

        setSelectData(newK);
      }
    }
  }


  const bulkClearFilter = (btnType) => {
    setPopoverOpenGSTIN(false);
    let gstInValue = document.getElementById("gstin-bulk-gst");
    document.getElementById("gstin-bulk-gst").value = "";
    setFilterGSTIN([]);
    let checkedData = companyList?.map(ele => ({
      ...ele,
      isActive: false,
    }));
    setCompanyList(checkedData);
    setSelectRowCount(0)
    setSelectData([])
  }

  // ** SMTP List
  const smtpSettingDetail = () => {
    setBlock(true);
    SMPTService.getSmtpSetting(userIds)
      .then((res) => {
        setBlock(false);
        if (res.status == 200) {
          const resData = res?.data?.data;
          if (resData == null) {
            setSmtpSettingData([]);
          } else {
            setSmtpSettingData(resData);
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

  //** User Profile User Detail
  const userDetail = (userId) => {
    setBlock(true);
    UserMastetServie.getUser(userId)
      .then((res) => {
        setBlock(false);

        if (res.status == 200) {
          const resData = res?.data?.data;
          setValue("companyName", resData.companyName);
          setValue("firstName", resData.firstName);
          setValue("lastName", resData.lastName);
          setValue("mobileNo", resData.mobile);
          setValue("emailId", resData.email);
          setValue("roleId", resData.roleId);

          if (resData?.category !== undefined && resData?.category !== null &&
            resData?.category !== "") {
            setCategoryId(resData?.category)
            const filterCategory = categoryList.filter(p => p.label.toString().toLowerCase() == resData?.category.toString().toLowerCase())[0];
            if (filterCategory) {
              setValue("FkCategoryId", filterCategory);
            }
          }

          if (sourceType == 0) {
            setValue(
              "newPassword",
              resData.password !== "" && resData.password !== null
                ? decryptData.decrypt(resData.password)
                : ""
            );

            setValue(
              "confirmPassword",
              resData.password !== "" && resData.password !== null
                ? decryptData.decrypt(resData.password)
                : ""
            );
          }
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

  //**  User List
  const usersList = (types) => {
    setBlock(true);
    UserMastetServie.getUserList(issubscriptionId, userIds)
      .then((res) => {
        setBlock(false);
        if (res.status == 200) {
          const resData = res?.data?.data;

          setUserListData(resData);
          setUserListDataFilter(resData)
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

  // ** Add User
  const addUsers = (data) => {
    const loginDate = moment(new Date()).format("hh:mm:ss");
    let encryptPassword = encryptData.encrypt(
      data.newPassword + SECRET_PARAMETER + loginDate
    );

    const userData = new Registration(
      0,
      data.firstName,
      data.lastName,
      data.emailId,
      data.mobileNo,
      encryptPassword,
      8,
      "",
      0,
      isuserId,
      data.companyName,
      selectData,
      '',
      '',
      isMultipleDelete == true ? 1 : 0
    );

    if (selectData.length > 0) {
      setBlock(true);
      userRegistrationService
        .UserRegistationAddUser(userData)
        .then((res) => {
          if (
            res.status === 200 &&
            res.data.status === errorCodeConfig.APIDefaultCode.Success
          ) {
            setBlock(false);
            reset();
            toast.success(res?.data?.successMessage, {
              position: "top-right",
              duration: messageShowDuration,
            });
            isActive = false;
            setSelectData([]);
            setTabId("3");
            getCompanyData();
          } else {
            setBlock(false);
            toast.error(res?.data?.errorMessage, {
              position: "top-right",
              duration: messageShowDuration,
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
    } else {
      toast.error("Please Select at least one record", {
        position: "top-right",
        duration: messageShowDuration,
      });
    }
  };

  // ** Update Function
  const updateUserRecord = (data) => {

    setBlock(true);
    UserMastetServie.updateUser({ ...data, clientId: selectData })
      .then((res) => {
        setBlock(false);

        if (
          res.status == 200 &&
          res.data.status === errorCodeConfig.APIDefaultCode.Success
        ) {
          toast.success(
            res.data.successMessage,
            {
              position: "top-right",
              duration: messageShowDuration,
            },
            2000
          );
          setSelectData([]);

          if (tabId == 2 && types == true) {
            setRefreshApi(true);
            reset();
            setFromTitle("Add User");
            setBtnTitle("Save");
            setTabId("3");
            setTypes(false);
            // props.profileData(3);
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

  // ** onSubmit function
  const updateUserDetail = (data) => {
    // debugger
    let isValid = true;

    const password = getValues("newPassword");
    const confirmPasword = getValues("confirmPassword");
    // debugger
    if (password !== confirmPasword) {
      setError("confirmPassword", {
        message: "Passwords do not match.",
        required: true,
      });
      isValid = false;
    } else {
      clearErrors("confirmPassword");
    }

    let isUserProfile = false;
    if (fromTitle == "User Profile") {
      isUserProfile = true;
    }

    //validate string trim
    if (!ValidateString(data.companyName)) {
      setError("companyName", {
        type: "manual",
        message: "Please enter valid company / firm name.",
      });
      isValid = false;
    }

    if (!ValidateString(data.newPassword)) {
      setError("newPassword", {
        type: "manual",
        message: "Invalid New Password",
      });
      isValid = false;
    }

    if (!ValidateString(data.confirmPassword)) {
      setError("confirmPassword", {
        type: "manual",
        message: "Invalid Confirm Password",
      });
      isValid = false;
    } else {
      if (isValid == true) {
        if (tabId == 1 && types == false) {
          const payLoad = {
            userId: isuserId,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.emailId,
            mobile: data.mobileNo,
            password:
              sourceType == 0 ? decryptData.encrypt(data.newPassword) : null,
            roleId: data.roleId,
            referredBy: "",
            companyName: data.companyName,
            IsUserProfile: isUserProfile,
            IsMultipleCompanyDelete : isMultipleDelete == true ? 1 : 0
          };
          updateUserRecord(payLoad);
        } else if (tabId == 2 && types == false) {
          // ** Add new User
          addUsers(data);
        } else if (tabId == 2 && types == true) {
          const payLoad = {
            userId: updateUserId,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.emailId,
            mobile: data.mobileNo,
            password: decryptData.encrypt(data.newPassword),
            roleId: updateRoleId,
            referredBy: updateReferredBy,
            companyName: data.companyName,
            IsUserProfile: isUserProfile,
            IsMultipleCompanyDelete : isMultipleDelete == true ? 1 : 0
          };

          updateUserRecord(payLoad);
        }
      }
    }
  };

  //** OnSubmit SMTP Setting
  const onSubmitSmtpSetting = (data) => {
    let isValid = true;

    if (!ValidateString(data?.displayName)) {
      setError("displayName", {
        type: "manual",
        message: "Invalid display name.",
      });
      isValid = false;
    }

    if (!ValidateString(data?.smtpserverName)) {
      setError("smtpserverName", {
        type: "manual",
        message: "Invalid server name.",
      });
      isValid = false;
    }

    if (!ValidateString(data?.smtpUserName)) {
      setError("smtpUserName", {
        type: "manual",
        message: "Invalid user name.",
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
        let encryptPassword = encryptData.encrypt(data.newPassword1);

        if (btnTitle == "Save") {
          payLoad = {
            displayName: data.displayName,
            smtpUser: data.smtpUserName,
            smtpPassword: encryptPassword,
            smtpServer: data.smtpserverName,
            smtpPort: data.smtpPortNo,
            enableSSL: enableSSL,
            insertedBy: isuserId,
            userId: userIds,
          };
          setBlock(true);
          smptService
            .addSmtpSetting(payLoad)
            .then((res) => {
              setBlock(false);

              if (
                res.status == 200 &&
                res.data.status === errorCodeConfig.APIDefaultCode.Success
              ) {
                resetForm();
                smtpSettingDetail();
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
        } else {
          payLoad = {
            smtpId: smtpId,
            displayName: data.displayName,
            smtpUser: data.smtpUserName,
            smtpPassword: encryptPassword,
            smtpServer: data.smtpserverName,
            smtpPort: data.smtpPortNo,
            enableSSL: enableSSL,
            updatedBy: isuserId,
            userId: userIds,
          };
          setBlock(true);
          smptService
            .updateSmtpSetting(payLoad)
            .then((res) => {
              setBlock(false);

              if (
                res.status == 200 &&
                res.data.status === errorCodeConfig.APIDefaultCode.Success
              ) {
                resetForm();
                toast.success(
                  res.data.successMessage,
                  {
                    position: "top-right",
                    duration: messageShowDuration,
                  },
                  2000
                );
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

  // ** Validate Password
  const ValidatePassword = () => {
    const password = getValues("newPassword");
    const confirmPasword = getValues("confirmPassword");

    if (password !== confirmPasword) {
      setError("confirmPassword", {
        message: "Passwords do not match.",
        required: true,
      });
      return;
    } else {
      clearErrors("confirmPassword");
    }
  };

  // ** data type check function
  function isInteger(value) {
    const num = value.trim();
    return !(
      value.match(/\s/g) ||
      num == "" ||
      isNaN(num) ||
      typeof value == "number"
    );
  }

  // ** Mobile Validation
  const mobileValidation = (data) => {
    if (data !== null) {
      if (isInteger(data) == true) {
        if (data.length !== 10) {
          setValue("mobileNo", "");
          setError("mobileNo", {
            type: "manual",
            message: "Please enter valid mobile number.",
            required: true,
          });
          return false;
        } else {
          clearErrors("mobileNo");
        }
      }
    } else {
      setError("mobileNo", {
        type: "manual",
        message: "Please enter valid mobile number.",
        required: true,
      });
    }
  };

  // ** validate string;
  const ValidateString = (data) => {
    if (data == undefined || data == "" || data?.trim().length == 0) {
      return false;
    } else {
      return true;
    }
  };

  //** Delete SMTP
  const deleteSMTP = (smtpId) => {
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
        setBlock(true);
        smptService
          .deleteSmtpSetting(smtpId, isuserId)
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
              smtpSettingDetail();
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
    });
  };

  //** Delete User
  const deleteUser = (id) => {

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

        const UserObj = {

          userId: id,
        };


        setBlock(true);
        UserMastetServie
          .deleteUser(UserObj)
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
              usersList();
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
    });
  };

  //** Button Function
  function myBtns(instance, td, row, col, prop, value, cellProperties) {
    Handsontable.renderers.TextRenderer.apply(this, arguments);

    if (tabId == 4) {
      td.innerHTML =
        '<button class="btn"><i class="add-edit fa fa-edit" title="Edit"></i></button><button class="btn"><i class="add-delete fa fa-trash"></i></button>';
      const hotsmtp = hotRefSMTP?.current?.hotInstance;
      const {
        displayName,
        enableSSL,
        smtpPassword,
        smtpPort,
        smtpServer,
        smtpUser,
        smtpSettingId,
      } = hotsmtp?.getSourceDataAtRow(cellProperties.row) || {};
      $(td)
        .find(".add-edit")
        .on("click", (event) => {
          const userData = hotsmtp.getSourceDataAtRow(cellProperties.row);

          if (userData !== null) {
            let decryptPasswd = decryptData.decrypt(smtpPassword);
            clearErrors();

            setValue("displayName", displayName);
            setValue("newPassword1", decryptPasswd);
            setValue("smtpPortNo", smtpPort);
            setValue("smtpserverName", smtpServer);
            setValue("smtpUserName", smtpUser);
            setEnableSSL(enableSSL);
            setSmtpId(smtpSettingId);
            setBtnTitle("Update");
          }
        });

      $(td)
        .find(".add-delete")
        .on("click", (event) => {
          deleteSMTP(smtpSettingId);
        });
    } else if (tabId == 3) {
      td.innerHTML =
        '<button class="btn"><i class="add-edit fa fa-edit" title="Edit"></i></button><button class="btn"><i class="add-delete fa fa-trash"></i></button>';
      const hot = hotRef?.current?.hotInstance;

      $(td)
        .find(".add-edit")
        .on("click", (event) => {
          setEditUrl(true);
          setTypes(true);
          const userData = hot.getSourceDataAtRow(cellProperties.row);
debugger
          setSelectData(userData?.clientId);
          setUpdatedUserListData([userData]);
          // props.funcUser(userData);
          // props.profileData(2);
          setTabId("2");
        });

      $(td)
        .find(".add-delete")
        .on("click", (event) => {
          let { userId } = hot?.getSourceDataAtRow(cellProperties.row);

          deleteUser(userId);
        });

    }
  }


   // ** Upload Excel
   const UploadExcel = (uploadData) => {
    setBlock(true);
    UserMastetServie
      .UserImportExcel(
        uploadData,
        user_Id,
        0,

      )
      .then((res) => {
        if (
          res.status === 200 &&
          res.data.status === errorCodeConfig.APIDefaultCode.Success
        ) {
          toast.success(res.data.successMessage, {
            position: "top-right",
          });
          toggle("3");

        }
        // else if (res.status === 200 && res.data.status == "-13004") {
        //   resData = JSON.parse(JSON.stringify(res?.data?.data));
        //   if (resData !== undefined) {
        //     var csssClass = "";
        //     let htmltblData =
        //       "<div style='' class='import-error-height'><table class='table text-start' style=''><thead style='" +
        //       csssClass +
        //       "' ><tr style='" +
        //       csssClass +
        //       "'><th style='" +
        //       csssClass +
        //       "'>Row No</th><th style='" +
        //       csssClass +
        //       "'>Error</th>";
        //     for (let i = 0; i < resData.length; i++) {
        //       htmltblData += `<tr style="${csssClass}"><td style="${csssClass}">${resData[i].row}</td><td style="${csssClass}">${resData[i].invoiceNumber}</td><td style="${csssClass} ; text-align:left">${resData[i].description}</td></tr>`;
        //     }

        //     htmltblData += "</tbody></table></div>";
        //     return MySwal.fire({
        //       title: "<strong>Data missing below fields.</strong>",
        //       icon: "error",
        //       html: htmltblData,
        //       customClass: {
        //         confirmButton: "btn btn-outline-danger",
        //         cancelButton: "btn btn-outline-secondary ms-1 me-1",
        //       },
        //       showCancelButton: true,
        //       confirmButtonText: "OK",
        //       cancelButtonText: "Cancel",
        //       buttonsStyling: false,
        //       width: "80%",
        //       height: "350px",
        //       // heightAuto:true
        //     });
        //   }
        // } else if (res.status === 200 && res.data.status == "-13002") {
        //   resData = JSON.parse(JSON.stringify(res.data.data));

        //   var csssClass = "";
        //   let htmltblData =
        //     "<div style='' class='import-error-height'><table class='table text-start' style=''><thead style='" +
        //     csssClass +
        //     "' ><tr style='" +
        //     csssClass +
        //     "'><th style='" +
        //     csssClass +
        //     "'>Row No</th><th style='" +
        //     csssClass +
        //     "'>Error</th>";

        //   for (let i = 0; i < resData?.length; i++) {
        //     htmltblData += `<tr style="${csssClass}"><td style="${csssClass}">${
        //       i + 1
        //     }</td><td style="${csssClass} ; text-align:left">${
        //       resData[i].item2
        //     }</td></tr>`;
        //   }

        //   htmltblData += "</tbody></table></div>";

        //   return MySwal.fire({
        //     title: "<strong>Import Error-</strong>",
        //     html: htmltblData,
        //     customClass: {
        //       confirmButton: "btn btn-outline-danger",
        //     },
        //     buttonsStyling: false,
        //     allowOutsideClick: false,
        //     width: "60%",
        //     height: "350px",
        //   });
        // }

        else {
          Swal.fire({
            icon: "error",
            title: "",
            text: res?.data?.errorMessage,
            customClass: {
              confirmButton: "btn btn-outline-danger",
            },
            buttonsStyling: false,
            allowOutsideClick: false,
          });
        }
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "",
          text: error?.message,
          customClass: {
            confirmButton: "btn btn-outline-danger",
          },
          buttonsStyling: false,
        });
      })
      .finally(() => {
        setBlock(false);
      });
  };

  //** handleImportChange  File select function */

  const handleImportChange = (e) => {
    const chosenFiles = Array.prototype.slice.call(e.target.files);
    var fileName = e.target.files[0];
    if (e.target.files.length > 0) {
      if (
        fileName.name.lastIndexOf(".XLSX").toString().toLowerCase() === -1 &&
        fileName.name.lastIndexOf(".XLS").toString().toLowerCase() === -1
      ) {
        toast.error("Please note: only excel file formats are allowed.", {
          position: "top-right",
        });
      } else {
        const uploadData = new FormData();
        chosenFiles.forEach((item) => {
          uploadData.append(`File`, item);
        });
        UploadExcel(uploadData);
        e.target.value = null;
      }
    }
    e.target.value = null;
  };




  //** onClick - Checkbox SSL
  const handleChange = () => {
    setEnableSSL(!enableSSL);
  };

  // ** Reset
  const resetForm = () => {
    setEnableSSL(false);
    setBtnTitle("Save");
    reset();
  };

  const theaderuserlist = (col, TH) => {
    if (col === 5) {
      const button = TH.children[0].children[0];
      button.parentNode.removeChild(button);
    }
    if (col == 5) {
      TH.className = "htCenter";
    } else {
      TH.className = "htLeft";
    }



    if (currentColUserDownload.length > 0) {

      let uniq = [...new Set(currentColUserDownload)];

      for (let i = 0; i < uniq.length; i++) {
        var obj = {};

        for (let j = 0; j < searchValUserDownload.length; j++) {
          if (i == j) {
            obj[uniq[i]] = searchValUserDownload[j]?.trim();
            arrFilter.push(obj);
          }
        }
      }

      let finalObj = {};
      for (let i = 0; i < arrFilter.length; i++) {
        Object.assign(finalObj, arrFilter[i]);
      }



      userListColumns.forEach((ele, index) => {
        const columnIndex = index;
        const buttonExists = document.querySelector(`#userhotDownload .ht_clone_top thead th:nth-child(${columnIndex + 1}) button`);

        const columnMatchesCondition = Object.keys(finalObj).includes(ele.data);

        // Check if column value is not null
        const columnValueValid = finalObj[ele.data] !== null && finalObj[ele.data] !== "";


        if (buttonExists && columnMatchesCondition && columnValueValid) {
          const TH = document.querySelector(`#userhotDownload .ht_clone_top thead th:nth-child(${columnIndex + 1})`);

          if (TH) {
            TH.classList.add("htFiltersActive");
          } else {
            // TH.classList.remove("htFiltersActive");
          }
        }
      });
    }
  };

  const theaderSMTP = (col, TH) => {
    if (col == 4) {
      TH.className = "htCenter";
    } else {
      TH.className = "htLeft";
    }
  };

  const companyColumnsName = [
    { data: "isActive", type: "checkbox", readOnly: false, width: 20 },
    {
      data: "srNo",
      title: "Sr.No",
      readOnly: true,
    },
    {
      data: "companyName",
      title: "Company Name",
      readOnly: true,
      width: 150,
    },

    {
      data: "tradeName",
      title: "Trade Name",
      readOnly: true,
      width: 150,
    },
    {
      data: "gstinNumber",
      title: "GSTIN",
      readOnly: true,

    },
  ];

  const emptyCompanyColumnsName = [
    { data: "isActive", title: " ", width: 1, readOnly: true },
    {
      data: "srNo",
      title: "Sr.No",
      readOnly: true,
    },

    {
      data: "companyName",
      title: "Company Name",
      readOnly: true,
      width: 150,
    },

    {
      data: "tradeName",
      title: "Trade Name",
      readOnly: true,
      width: 150,
    },
    {
      data: "gstinNumber",
      title: "GSTIN",
      readOnly: true,
      // width: 130,
    },
  ];

  const getCompanyData = () => {

    const payload = {
      userId: userIds,
      companyName: "",
      tradeName: "",
      gstinNumber: "",
    };
    setBlock(true);
    setCurrentPage(0);
    CompanyNewService.getCompanyByUserId(payload)
      .then((res) => {
        setBlock(false);
        if (
          res.status == 200 &&
          res.data.status == errorCodeConfig.APIDefaultCode.Success
        ) {
          setCompanyList(res?.data?.data);
          setaddEditData(res?.data?.data)
        } else {
          setCompanyList(res?.data?.data);
          setaddEditData(res?.data?.data)
          setBlock(false);
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
  };

  const colHeaders = (col) => {
    let txt;
    switch (col) {
      case 0:
        txt = "<input type='checkbox' class='checker1'  ";
        txt += isActive ? 'checked="checked"' : "";
        txt += ">";
        return txt;
    }
  };

  useEffect(() => {
    // setCompanyList([]);
    // setaddEditData([])

    if (tabId == '2') {
      getCompanyData();
    }

    console.log(tabId)

  }, [tabId]);

  function localAfterOnCellMouseDown(event, coords, td) {
    const hot = hotRefCompany?.current?.hotInstance;

    // setCurrentCol1(coords?.col)
    const totalRows = hot.countRows();
    setCurrentCol1Download(coords?.col);
    if (coords?.row == -1 && coords?.col == 0) {

      if (
        !event.target.classList.contains("checker1") ||
        event.target.classList.contains("checker1")
      ) {
        if (!isActive) {
          isActive = true;
          for (let index = 0; index < totalRows; index++) {
            hot?.setDataAtCell(index, 0, true);
          }
          setSelectRowCount(refSelect.current)
        } else {
          isActive = false;
          for (let index = 0; index < totalRows; index++) {
            hot?.setDataAtCell(index, 0, false);
          }
          setSelectRowCount(refSelect.current)
        }
      }
    }
    if (coords?.row !== -1 && coords?.col == 0) {

      let checkValue = hot?.getDataAtRowProp(coords?.row, "isActive");
      hot?.setDataAtCell(coords?.row, 0, !checkValue);

      setSelectRowCount(refSelect.current)
    }



    //** Set Value
    const Index = currentColDownload?.findIndex(
      (item) => companyColumnsName[coords?.col]?.data == item
    );

    if (Index != -1) {
      setTimeout(function () {
        var searchInput = document?.querySelector(
          ".htUIMultipleSelectSearch.htUIInput"
        );
        if (searchInput !== null) {
          searchInput.children[0].value = searchVal1Download[Index];
        }
      }, 200);
    } else {
      setTimeout(function () {
        var searchInput = document?.querySelector(
          ".htUIMultipleSelectSearch.htUIInput"
        ); // searchInput.children[0].innerHTML ="hii1"
        if (searchInput !== null) {
          searchInput.children[0].value = "";
        }
      }, 100);
    }
  }

  function localAfterOnCellMouseDownUser(event, coords, td) {
    const hot = hotRef?.current?.hotInstance;

    // setCurrentCol1(coords?.col)

    setCurrentColUser1Download(coords?.col);


    //** Set Value
    const Index = currentColUserDownload?.findIndex(
      (item) => userListColumns[coords?.col]?.data == item
    );

    if (Index != -1) {
      setTimeout(function () {
        var searchInput = document?.querySelector(
          ".htUIMultipleSelectSearch.htUIInput"
        );
        if (searchInput !== null) {
          searchInput.children[0].value = searchValUserDownload[Index];
        }
      }, 200);
    } else {
      setTimeout(function () {
        var searchInput = document?.querySelector(
          ".htUIMultipleSelectSearch.htUIInput"
        ); // searchInput.children[0].innerHTML ="hii1"
        if (searchInput !== null) {
          searchInput.children[0].value = "";
        }
      }, 100);
    }
  }

  const localBeforeSetRangeStart = (coords) => {
    const { row, col } = coords;

    // Check if the user is trying to select the checkbox cell (column index 0)

    if (col === 0) {
      // const isChecked = hotRefCompany?.current?.hotInstance?.getDataAtCell(
      //   row,
      //   col
      // );
      // hotRefCompany?.current?.hotInstance?.setDataAtCell(row, col, !isChecked);
      const isChecked = hotRefCompany?.getDataAtCell(row, col);
      hotRefCompany?.setDataAtCell(row, col, !isChecked);
      // Prevent selecting the cell, since we manually toggled the checkbox
      return false;
    }
  };
  // ele?.isActive == false || ele?.isActive == undefined ? (selectData.includes(ele?.clientId) ? true : false) : ele?.isActive,

  const pageCountWithout = Math.ceil(
    companyList?.length && companyList?.length / PageSize
  );
  const para1 = currentPage * PageSize;
  const para2 = (currentPage * PageSize) + PageSize;


  let resolve = companyList
    ? companyList.map((ele) => ({
      ...ele,
      isActive: selectData.includes(ele?.clientId),
    }))
    : [];



  let datas = resolve ? resolve.slice(para1, para2) : [];

  let dataWithout = datas ? datas : [];


  if (fromTitle === "Edit User") {
    for (let i = 0; i < dataWithout.length; i++) {
      const ele = dataWithout[i];

      if (ele.isActive !== true) {
        isActive = false;
        break;
      } else {
        isActive = true;
      }
    }
  }


  const cellChange = (change, source) => {
   // const x = change?.length && change[0][0];
    if (change?.length > 0) {

      if (change[0][1] == "isActive") {


      const companyListArr = resolve;

      // Initialize newK with existing selected data or an empty array
      let newK = selectData?.length ? [...selectData] : [];

      // Create a Set for faster lookup
      const newKSet = new Set(newK);

      companyListArr.forEach(item => {
        if (item?.isActive) {
          // Add active clientIds to newKSet
          newKSet.add(item.clientId);
        } else {
          // Remove inactive clientIds from newKSet
          newKSet.delete(item.clientId);
        }
      });

      // Convert the Set back to an array
      newK = Array.from(newKSet);

      refSelect.current = newK.length;

      setSelectData(newK);


      }
    }
  };

  const theader = (col, TH) => {
    if (col === 0 || col == 1) {
      const button = TH.children[0].children[0];
      button.parentNode.removeChild(button);
    }
    if (col >= 0) {
      TH.className = "htLeft";
    }
    if (currentColDownload.length > 0) {

      let uniq = [...new Set(currentColDownload)];

      for (let i = 0; i < uniq.length; i++) {
        var obj = {};

        for (let j = 0; j < searchVal1Download.length; j++) {
          if (i == j) {
            obj[uniq[i]] = searchVal1Download[j]?.trim();
            arrFilter.push(obj);
          }
        }
      }

      let finalObj = {};
      for (let i = 0; i < arrFilter.length; i++) {
        Object.assign(finalObj, arrFilter[i]);
      }



      companyColumnsName.forEach((ele, index) => {
        const columnIndex = index;
        const buttonExists = document.querySelector(`#hotDownload .ht_clone_top thead th:nth-child(${columnIndex + 1}) button`);

        const columnMatchesCondition = Object.keys(finalObj).includes(ele.data);

        // Check if column value is not null
        const columnValueValid = finalObj[ele.data] !== null && finalObj[ele.data] !== "";



        if (buttonExists && columnMatchesCondition && columnValueValid) {
          // .tab-pane.active
          const TH = document.querySelector(`#hotDownload .ht_clone_top thead th:nth-child(${columnIndex + 1})`);

          if (TH) {
            TH.classList.add("htFiltersActive");
          } else {
            TH.classList.remove("htFiltersActive");
          }
        }
      });
    }

  };

    const selectAllRecordData = () => {
      const hot = hotRefCompany?.current?.hotInstance;
      const totalRows = hot.countRows();

        console.log(isActive, "isActive")

      if (isActive == true) {
        for (let index = 0; index < totalRows; index++) {
          hot?.setDataAtCell(index, 0, true);
        }
      } else {
        for (let index = 0; index < totalRows; index++) {
          hot?.setDataAtCell(index, 0, false);
        }
      }

    }

  const handlePageClick = (event) => {
    setCurrentPage(event?.selected);

  };

  const toggle = (tab) => {
    setTabId(tab);
    setSelectRowCount(0);
    setFilterGSTIN([]);
    setSelectData([])
    sessionStorage.setItem("AddUserTabIndex", tab);
  };

  //** get CategoryMaster
  const GetCategoryMasterList = () => {
    userRegistrationService.GetCategoryMaster().then(res => {

      if (res.status == 200) {
        const fromOptions = res.data?.data?.map((v, index) => {
          return {
            label: v.text,
            value: v.value,
            key: index,
          };
        });

        categoryList = fromOptions;
        setCategoryOptions(fromOptions)
      }
    })
  }

  function gstListFilter(arr) {

    let addArr = [];
    var flag = false;
    let updatedData = [];
    let finalObj = {}
    for (let i = 0; i < arr.length; i++) {
      Object.assign(finalObj, arr[i]);
    }
    updatedData = addEditData
      .filter((item) =>
        finalObj.companyName?.length ? item.companyName?.toLowerCase().includes(finalObj.companyName.toLowerCase()) : item
      )
      .filter((companydata) =>
        finalObj.tradeName?.length ? companydata.tradeName?.toLowerCase().includes(finalObj.tradeName?.toLowerCase()) : companydata
      )
      .filter((gstin) =>
        finalObj.gstinNumber?.length ? gstin?.gstinNumber?.toLowerCase().includes(finalObj?.gstinNumber.toLowerCase()) : gstin
      )

    flag = true;

    addArr.push(...updatedData);
    setPage(0);
    setCurrentPage(0);


    let uniq = [...new Set(addArr)];

    return uniq;
  }



  function gstUserListFilter(arr) {

    let addArr = [];
    var flag = false;
    let updatedData = [];
    let finalObj = {}

    for (let i = 0; i < arr.length; i++) {
      Object.assign(finalObj, arr[i]);
    }

    updatedData = userListDataFilter
      .filter((itemCompanyName) =>
        finalObj.companyName?.length
          ? itemCompanyName?.companyName?.toLowerCase().includes(finalObj?.companyName?.toLowerCase())
          : itemCompanyName
      )
      .filter((itemFirstName) =>
        finalObj.firstName?.length
          ? itemFirstName?.firstName?.toLowerCase().includes(finalObj?.firstName?.toLowerCase())
          : itemFirstName
      )
      .filter((itemLastName) =>
        finalObj.lastName?.length
          ? itemLastName?.lastName?.toLowerCase().includes(finalObj?.lastName?.toLowerCase())
          : itemLastName
      )
      .filter((itemEmail) =>
        finalObj.email?.length
          ? itemEmail?.email?.toLowerCase().includes(finalObj?.email?.toLowerCase())
          : itemEmail
      )

      .filter((itemMobile) =>
        finalObj.mobile?.length
          ? itemMobile?.mobile?.toLowerCase().includes(finalObj?.mobile?.toLowerCase())
          : itemMobile
      )

    flag = true;

    addArr.push(...updatedData);
    setPage(0);



    let uniq = [...new Set(addArr)];

    return uniq;
  }


  const selectAllevent = (event) => {
    setSelectCheckAll(event.target.checked)


    let checkedData = companyList?.map(ele => ({
      ...ele,
      isActive:  event.target.checked == true ? true : false ,
    }));

    setCompanyList(checkedData)

    const countsSelect = checkedData?.filter(p => p.isActive == true);

    setSelectRowCount(countsSelect?.length)

    let newK = [];
    checkedData?.map((item, index) => {
      if (item?.isActive) {
        newK.push(item?.clientId);
      }
    });

    setSelectData(newK);

  }

  const selectIsMulitpleDelete = (event) => {
    setIsMultipleDelete(event.target.checked)
  }

  return (
    <>
      <Fragment>
        {block && <div className="loading1">Loading&#8230;</div>}
        <div className="content-header row py-1">
          <div className="content-header-left col-md-8 col-12">
            <div className="row breadcrumbs-top mb-0">
              <div className="col-12 mb-1">
                <Breadcrumbs title="Settings" data={[{ title: "Settings" }]} />
              </div>
            </div>
          </div>
          <div className="content-header-right">
            <div className="nav-vertical">
              <Row>
                <Col md={3}>
                  <ProfileVerticalTabs active={tabId} toggle={toggle} />

                </Col>
                <Col md={9}>
                  <Card className="bg-transparent">
                    <CardBody>
                      {tabId != "5" && (
                        <div className="content-header">
                          <Row>
                            <Col md="4">
                              <h2 className="mb-0">{fromTitle} </h2>
                            </Col>
                            <Col md="8">
                              {
                                tabId == "2" &&

                                <Col className="d-flex align-items-center justify-content-end ">

                                  <div className="btn-wrapper text-end">
                                    <Button
                                      className="btn-icon btn-round dropdown-toggle btn"
                                      size="sm"
                                      outline
                                      color="danger"
                                      id="btnImport"
                                      onClick={() => {
                                        toggle("6");
                                      }}
                                    >
                                      <Download size={14} />
                                      <span className="align-middle ms-50">Import User Excel</span>
                                    </Button>
                                    <UncontrolledTooltip placement="top" target="btnImport">
                                      Import User Excel
                                    </UncontrolledTooltip>
                                  </div>
                                </Col>
                              }
                              {
                                tabId == "3" &&

                                <Col className="d-flex align-items-center justify-content-end ">
                                  <div className="btn-wrapper text-end">
                                    <Button
                                      className="btn-icon btn-round dropdown-toggle btn me-1"
                                      // size="sm"
                                      outline
                                      color="danger"
                                      id="btnManageuser"
                                      onClick={() => {
                                        toggle("2");
                                      }}
                                    >
                                      <Plus size={14} />
                                      <span className="align-middle ms-50">Add User</span>
                                    </Button>
                                    <UncontrolledTooltip placement="top" target="btnManageuser">
                                      Add User
                                    </UncontrolledTooltip>
                                  </div>

                                  <div className="btn-wrapper text-end">
                                    <Button
                                      className="btn-icon btn-round dropdown-toggle btn"
                                      size="sm"
                                      outline
                                      color="danger"
                                      id="btnImport"
                                      onClick={() => {
                                        toggle("6");
                                      }}
                                    >
                                      <Download size={14} />
                                      <span className="align-middle ms-50">Import User Excel</span>
                                    </Button>
                                    <UncontrolledTooltip placement="top" target="btnImport">
                                      Import User Excel
                                    </UncontrolledTooltip>
                                  </div>
                                </Col>
                              }
{
                                tabId == "6" &&

                                <Col className="d-flex align-items-center justify-content-end ">

<span
                                className="d-flex cursor-pointer"
                                onClick={() =>
                                  onSampleTemplateDownload({ setBlock, modelFor: "SettingImport" })
                                }
                              >
                                <Download size={14} />
                                <h6 className="text-danger" style={{ marginLeft: '5px' }}>Download Sample File</h6>
                              </span>
                                </Col>
                              }
                            </Col>


                          </Row>

                        </div>
                      )}
                      <TabContent activeTab={tabId == "1" ? "1" : "2"}>
                        <TabPane
                          tabId={tabId == "1" ? "1" : "2"}
                          key={tabId == "1" ? "1" : "2"}
                        >


                          {(tabId == "1" || tabId == "2") && (
                            <Form
                              className="mt-1 pt-50"
                              onSubmit={handleSubmit(updateUserDetail)}
                            >
                              <Row>
                                <Col md="6" className="mb-1">
                                  <Label className="form-label requiredlable">
                                    First Name
                                  </Label>
                                  <Controller
                                    rules={{
                                      required: "Please enter first name.",
                                    }}
                                    id="firstName"
                                    name="firstName"
                                    control={control}
                                    render={({ field }) => (
                                      <Input
                                        placeholder=""
                                        invalid={errors?.firstName?.message && true}
                                        {...field}
                                        onChange={(e) =>
                                          field.onChange(
                                            e.target.value.replace(/\s/g, "")
                                          )
                                        }
                                        onKeyPress={(e) => handleKeyPressPass(e, setError,'firstName','firstName','space')}
                                        onPaste={(e) => handlePasteText(e, setError,'firstName','firstName','space')}
                                      />
                                    )}
                                  />
                                  {errors.firstName && (
                                    <FormFeedback>
                                      {errors.firstName.message}
                                    </FormFeedback>
                                  )}
                                </Col>
                                <Col md="6" className="mb-1">
                                  <Label className="form-label requiredlable">
                                    Last Name
                                  </Label>
                                  <Controller
                                    rules={{
                                      required: "Please enter last name.",
                                    }}
                                    id="lastName"
                                    name="lastName"
                                    control={control}
                                    render={({ field }) => (
                                      <Input
                                        placeholder=""
                                        invalid={errors?.lastName?.message && true}
                                        {...field}
                                        onChange={(e) =>
                                          field.onChange(
                                            e.target.value.replace(/\s/g, "")
                                          )
                                        }
                                      onKeyPress={(e) => handleKeyPressPass(e, setError,'lastName','lastName','space')}
                                      onPaste={(e) => handlePasteText(e, setError,'lastName','lastName','space')}
                                      />
                                    )}
                                  />
                                  {errors.lastName && (
                                    <FormFeedback>
                                      {errors.lastName.message}
                                    </FormFeedback>
                                  )}
                                </Col>
                                <Col md="6" className="mb-1">
                                  <Label className="form-label requiredlable">
                                    Company / Firm Name
                                  </Label>
                                  <Controller
                                    rules={{
                                      required:
                                        "Please enter company / firm name.",
                                    }}
                                    id="companyName"
                                    name="companyName"
                                    control={control}
                                    render={({ field }) => (
                                      <Input
                                        placeholder=""
                                        invalid={errors?.companyName?.message && true}
                                        {...field}
                                        onKeyPress={(e) => handleKeyPressPass(e, setError,'companyName','companyName','allowSpace')}
                                        onPaste={(e) => handlePasteText(e, setError,'companyName','companyName','allowSpace')}
                                      // onChange={(e) =>
                                      //   field.onChange(e.target.value.replace(/\s/g, ""))
                                      // }
                                      />
                                    )}
                                  />
                                  {errors.companyName && (
                                    <FormFeedback>
                                      {errors.companyName.message}
                                    </FormFeedback>
                                  )}
                                </Col>
                                <Col md="6" className="mb-1">
                                  <Label className="form-label requiredlable">
                                    Email Id
                                  </Label>
                                  <Controller
                                    rules={{
                                      required: "Please enter valid email.",
                                      pattern: {
                                        value:
                                          /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Please enter valid email.",
                                      },
                                    }}
                                    id="emailId"
                                    name="emailId"
                                    control={control}
                                    render={({ field }) => (
                                      <Input
                                        placeholder=""
                                        disabled={tabId == 1}
                                        invalid={errors?.emailId?.message && true}
                                        {...field}
                                        maxLength={250}
                                        onPaste={(e) => handlePasteText(e, setError,'emailId','emailId','email')}
                                        onKeyPress={(e) => handleKeyPressText(e, setError,'emailId')}
                                      />
                                    )}
                                  />
                                  {errors.emailId && (
                                    <FormFeedback>
                                      {errors.emailId.message}
                                    </FormFeedback>
                                  )}
                                </Col>
                                <Col md="3" className="mb-1">
                                  <Label className="form-label requiredlable">
                                    Mobile No
                                  </Label>
                                  <Controller
                                    rules={{
                                      required: "Please enter mobile no.",
                                    }}
                                    id="mobileNo"
                                    name="mobileNo"
                                    control={control}
                                    render={({ field }) => (
                                      <Input
                                        placeholder=""
                                        disabled={tabId == 1}
                                        invalid={errors?.mobileNo?.message && true}
                                        {...field}
                                        onChange={(e) =>
                                          field.onChange(
                                            e.target.value.replace(/\D/g, "")
                                          )
                                        }
                                        minLength={10}
                                        maxLength={10}
                                        onBlur={(e) =>
                                          mobileValidation(e.target.value)
                                        }
                                        // onPaste={(e) => handlePasteText(e, setError,'mobileNo','mobileNo','mobile')}
                                        // onKeyPress={(e) => handleKeyPressPass(e, setError,'mobileNo','mobileNo','mobile')}
                                      />
                                    )}
                                  />
                                  {errors.mobileNo && (
                                    <FormFeedback>
                                      {errors.mobileNo.message}
                                    </FormFeedback>
                                  )}
                                </Col>

                                <Col md="3" className="mb-1">
                                  <Label className='form-label' for='FkCategoryId'>
                                    Category
                                  </Label>
                                  <Controller
                                    id="FkCategoryId"
                                    name="FkCategoryId"

                                    control={control}
                                    render={({ field }) => (
                                      <Select
                                        isDisabled={true}
                                        isClearable={false}
                                        classNamePrefix="select"
                                        options={categoryOptions}
                                        {...field}
                                        invalid={errors.FkCategoryId && true}
                                        theme={selectThemeColors}
                                        className={classnames("react-select", {
                                          "is-invalid": errors.FkCategoryId && true,
                                        })}

                                      />
                                    )}
                                  />
                                  {errors.FkCategoryId && (
                                    <FormFeedback>{errors.FkCategoryId.message}</FormFeedback>
                                  )}

                                </Col>


                                {sourceType == 0 ? (
                                  <>
                                    <Col md="3" className="mb-1">
                                      <Label className="form-label requiredlable">
                                        Password
                                      </Label>
                                      <Controller
                                        rules={{
                                          required: "Please enter password.",
                                          pattern: {
                                            value:
                                              /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/,
                                            message:
                                              "Password must have at least 8 characters include at least 1 lowercase character, 1 uppercase character, 1 number and 1 special character.",
                                          },
                                        }}
                                        id="newPassword"
                                        name="newPassword"
                                        control={control}
                                        render={({ field }) => (
                                          <InputPasswordToggle
                                            htmlFor="newPassword"
                                            autoComplete="new-password"
                                            className="input-group-merge"
                                            placeholder=""
                                            invalid={errors?.newPassword?.message && true}
                                            // invalid={(errors.newPassword?.type =="required" || ( errors.newPassword?.type =="manual" && errors.newPassword?.message != "")) && true} {...field}
                                            {...field}
                                            onKeyPress={(e) => handleKeyPressPass(e, setError,'newPassword','password','password')}
                                            onPaste={(e) => handlePasteText(e, setError,'newPassword','password','password')}
                                          />
                                        )}
                                      />
                                      {errors.newPassword && (
                                        <FormFeedback className="d-block">
                                          {errors.newPassword.message}
                                        </FormFeedback>
                                      )}
                                    </Col>
                                    <Col md="3" className="mb-1">
                                      <Label className="form-label requiredlable">
                                        Confirm Password
                                      </Label>
                                      <Controller
                                        rules={{
                                          required:
                                            "Please enter confirm password.",
                                          pattern: {
                                            value:
                                              /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/,
                                            message:
                                              "Password must have at least 8 characters include at least 1 lowercase character, 1 uppercase character, 1 number and 1 special character.",
                                          },
                                        }}
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        control={control}
                                        render={({ field }) => (
                                          <InputPasswordToggle
                                            htmlFor="confirmPassword"
                                            autoComplete="new-password"
                                            className="input-group-merge"
                                            placeholder=""
                                            invalid={errors?.confirmPassword?.message && true}
                                            // invalid={(errors.confirmPassword?.type =="required" || ( errors.confirmPassword?.type =="manual" && errors.confirmPassword?.message != "")) && true} {...field}
                                            {...field}
                                            onBlur={() => ValidatePassword()}
                                            onKeyPress={(e) => handleKeyPressPass(e, setError,'confirmPassword','confirmPassword','password')}
                                            onPaste={(e) => handlePasteText(e, setError,'confirmPassword','confirmPassword','password')}
                                          />
                                        )}
                                      />
                                      {errors.confirmPassword && (
                                        <FormFeedback className="d-block">
                                          {errors.confirmPassword.message}
                                        </FormFeedback>
                                      )}
                                    </Col>
                                  </>
                                ) : (
                                  ""
                                )}
                                {
                                  tabId == 2 &&
                                  <>
                                  <Row>
                                    <Col  className="mb-2">


                                    <input type='checkbox' id='danger-checkbox1'
                                      checked={isMultipleDelete}
                                      onChange={selectIsMulitpleDelete}
                                      /> {" "}

                                      <Label className='form-check-label' >
                                      {" "} Multiple Company Delete  {" "}
                                      </Label> {" "}

                                    </Col>
                                  </Row>

                                  <Row>

                                    <Col md="8" className="mb-1 " >

                                      <Button
                                        size="sm"
                                        className={`me-1 `}
                                        outline
                                        color="danger"
                                        id="popBottomC"
                                        onClick={(e) => {
                                          e.preventDefault(); // Prevent default form submission behavior
                                          // Add your custom onClick logic here
                                        }}
                                      >
                                        <i className="fa fa-filter fa-lg"></i>
                                        <span className="align-middle ms-25">Company GSTIN</span>
                                      </Button>
                                      <Popover
                                        placement="bottom"
                                        target="popBottomC"
                                        isOpen={popoverOpenGSTIN}
                                        toggle={() => toggleBulkFilter("gstin")}
                                        trigger="legacy"
                                      >
                                        <PopoverHeader color="danger">GSTIN Selection</PopoverHeader>
                                        <PopoverBody>
                                          <Input
                                            type="textarea"
                                            rows="2"
                                            id="gstin-bulk-gst"

                                          />
                                          <br></br>
                                          <Button
                                            size="sm"
                                            color="danger"
                                            className="me-1"
                                            outline
                                            onClick={(e) => BulkSearch("gstin")}
                                          >
                                            Bulk Selection
                                          </Button>
                                          <Button
                                            size="sm"
                                            color="secondary"
                                            className="me-1"
                                            outline
                                            onClick={(e) => bulkClearFilter("gstin")}
                                          >
                                            Clear
                                          </Button>
                                        </PopoverBody>
                                      </Popover>


                                      <input type='checkbox' id='danger-checkbox1'
                                      checked={selectCheckAll}
                                      onChange={selectAllevent}
                                      /> {" "}
                                      <Label className='form-check-label' >
                                          All Select  {" "}
                                      </Label> {" "}

                                      <span style={{ fontWeight: "bold" }} className='p-0'>{ selectData ? ` (${selectData.length}  ${selectData.length > 1 ? 'companies have' : 'company has'}  been selected ) ` : ''}</span>



                                    </Col>

                                  </Row>
                                  </>
                                }
                                {tabId == 2 ? (
                                  <Col md="12" className="mb-1">
                                    {companyList?.length ?
                                      <HotTable
                                        id="hotDownload"
                                        autoWrapRow={false}
                                        data={dataWithout.length > 0 ? dataWithout : [{ srNo: "No Data Found!" }]}
                                        columns={companyColumnsName}
                                        style={!dataWithout.length > 0 ? { textAlign: "center", overflowX: "hidden" } : ""}
                                        rowHeights={RowSize}
                                        hiddenColumns={!dataWithout?.length ? {
                                          columns: [0],
                                        } : ''}
                                        columnHeaderHeight={columnHeaderSize}
                                        licenseKey="non-commercial-and-evaluation"
                                        height="auto"
                                        autoColumnSize={true}
                                        stretchH="all"
                                        preventOverflow="horizontal"
                                        colHeaders={(x) => colHeaders(x)}
                                        ref={hotRefCompany}
                                        afterOnCellMouseDown={
                                          localAfterOnCellMouseDown
                                        }
                                        // beforeSetRangeStart={
                                        //   localBeforeSetRangeStart
                                        // }
                                        comments={true}
                                        mergeCells={!dataWithout?.length ? [{ row: 0, col: 1, rowspan: 1, colspan: 4 }] : false}
                                        afterChange={(x, y) => cellChange(x, y)}
                                        afterGetColHeader={theader}
                                        cells={function (row, col) {
                                          var cp = {};
                                          // if ( col == 4) {
                                          //   cp.className = "text-end";
                                          // }
                                          if (!dataWithout?.length > 0) {
                                            if (col == 3) {
                                              cp.className = "text-center";
                                            }
                                          }
                                          if (col == 2 || col == 3) {
                                            if (dataWithout[row]?.companyName?.length > 25) {
                                              cp.comment = {
                                                value: dataWithout[row]?.companyName,
                                                style: { width: 200, height: 50 },
                                              };
                                            }
                                            if (dataWithout[row]?.tradeName?.length > 25) {
                                              cp.comment = {
                                                value: dataWithout[row]?.tradeName,
                                                style: { width: 200, height: 50 },
                                              };
                                            }
                                            cp.renderer = myLables;
                                          }
                                          //  }
                                          return cp;
                                        }}
                                        dropdownMenu={{
                                          items: {
                                            filter_by_value: {
                                              name: "Search Value",
                                            },
                                            clear: {
                                              name: `<button id='btnClear' name='Clear' tabIndex="-1"   value='Clear'>Clear</button>`,
                                              callback: function (key, selection, clickEvent) {

                                                var src = clickEvent.target;

                                                if (src.tagName.toLowerCase() === "button") {
                                                  if (clickEvent.target.id == "btnClear") {
                                                    var value = "";
                                                    const x = searchVal1Download;
                                                    if (!searchVal1Download?.length) {
                                                      x.push(value);
                                                      let y = currentColDownload;
                                                      y.push(companyColumnsName[currentCol1Download]?.data);
                                                      setSearchVal1Download(x);
                                                      setCurrentColDownload(y);

                                                    } else {
                                                      const Index = currentColDownload?.findIndex(
                                                        (item) => companyColumnsName[currentCol1Download]?.data == item
                                                      );

                                                      if (Index != -1) {
                                                        const xyz = searchVal1Download;
                                                        xyz[Index] = value;
                                                        setSearchVal1Download(xyz);
                                                      } else {
                                                        x.push(value);
                                                        let y = currentColDownload;
                                                        y.push(companyColumnsName[currentCol1Download]?.data);
                                                        setSearchVal1Download(x);
                                                        setCurrentColDownload(y);
                                                      }
                                                    }
                                                    let uniq = [...new Set(currentColDownload)];

                                                    for (let i = 0; i < uniq.length; i++) {
                                                      var obj = {};

                                                      for (let j = 0; j < searchVal1Download.length; j++) {

                                                        if (i == j) {
                                                          obj[uniq[i]] = searchVal1Download[j];
                                                          arrDownload.push(obj)
                                                        }
                                                      }
                                                    }
                                                    let newFilterData = gstListFilter(arrDownload);

                                                    setCompanyList([...newFilterData])
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
                                          var value = searchInput.children[0].value;

                                          const x = searchVal1Download;
                                          if (!searchVal1Download?.length) {
                                            x.push(value);
                                            let y = currentColDownload;
                                            y.push(companyColumnsName[currentCol1Download]?.data);
                                            setSearchVal1Download(x);
                                            setCurrentColDownload(y);

                                          } else {
                                            const Index = currentColDownload?.findIndex(
                                              (item) => companyColumnsName[currentCol1Download]?.data == item
                                            );

                                            if (Index != -1) {
                                              const xyz = searchVal1Download;
                                              xyz[Index] = value;
                                              setSearchVal1Download(xyz);
                                            } else {
                                              x.push(value);
                                              let y = currentColDownload;
                                              y.push(companyColumnsName[currentCol1Download]?.data);
                                              setSearchVal1Download(x);
                                              setCurrentColDownload(y);
                                            }
                                          }
                                          let uniq = [...new Set(currentColDownload)];

                                          for (let i = 0; i < uniq.length; i++) {
                                            var obj = {};

                                            for (let j = 0; j < searchVal1Download.length; j++) {

                                              if (i == j) {
                                                obj[uniq[i]] = searchVal1Download[j];
                                                arrDownload.push(obj)
                                              }
                                            }
                                          }
                                          let newFilterData = gstListFilter(arrDownload);

                                          setCompanyList([...newFilterData])
                                        }}
                                      />
                                      : <HotTable
                                        id="hotDownload"
                                        autoWrapRow={true}
                                        data={[{ srNo: "No Data Found!" }]}
                                        columns={emptyCompanyColumnsName}
                                        rowHeights={RowSize}
                                        // hiddenColumns={{
                                        //   columns: [0],
                                        // }}
                                        contextMenu={false}
                                        columnHeaderHeight={columnHeaderSize}
                                        licenseKey="non-commercial-and-evaluation"
                                        height="auto"
                                        autoColumnSize={true}
                                        stretchH="all"
                                        preventOverflow="horizontal"
                                        colHeaders={(x) => colHeaders(x)}
                                        ref={hotRefCompany}
                                        afterOnCellMouseDown={
                                          localAfterOnCellMouseDown
                                        }
                                        // beforeSetRangeStart={
                                        //   localBeforeSetRangeStart
                                        // }
                                        mergeCells={[{ row: 0, col: 1, rowspan: 1, colspan: 4 }]}
                                        afterChange={(x, y) => cellChange(x, y)}
                                        afterGetColHeader={theader}
                                        cells={function (row, col) {
                                          var cp = {};
                                          if (col == 4) {
                                            cp.className = "text-end";
                                          }
                                          if (!dataWithout?.length > 0) {
                                            if (col == 1) {
                                              cp.className = "text-center";
                                            }
                                          }
                                          return cp;
                                        }}
                                        dropdownMenu={{
                                          items: {
                                            filter_by_value: {
                                              name: "Search Value",
                                            },
                                            clear: {
                                              name: `<button id='btnClear' name='Clear' tabIndex="-1"   value='Clear'>Clear</button>`,
                                              callback: function (key, selection, clickEvent) {

                                                var src = clickEvent.target;

                                                if (src.tagName.toLowerCase() === "button") {
                                                  if (clickEvent.target.id == "btnClear") {
                                                    var value = "";
                                                    const x = searchVal1Download;
                                                    if (!searchVal1Download?.length) {
                                                      x.push(value);
                                                      let y = currentColDownload;
                                                      y.push(companyColumnsName[currentCol1Download]?.data);
                                                      setSearchVal1Download(x);
                                                      setCurrentColDownload(y);

                                                    } else {
                                                      const Index = currentColDownload?.findIndex(
                                                        (item) => companyColumnsName[currentCol1Download]?.data == item
                                                      );

                                                      if (Index != -1) {
                                                        const xyz = searchVal1Download;
                                                        xyz[Index] = value;
                                                        setSearchVal1Download(xyz);
                                                      } else {
                                                        x.push(value);
                                                        let y = currentColDownload;
                                                        y.push(companyColumnsName[currentCol1Download]?.data);
                                                        setSearchVal1Download(x);
                                                        setCurrentColDownload(y);
                                                      }
                                                    }
                                                    let uniq = [...new Set(currentColDownload)];

                                                    for (let i = 0; i < uniq.length; i++) {
                                                      var obj = {};

                                                      for (let j = 0; j < searchVal1Download.length; j++) {

                                                        if (i == j) {
                                                          obj[uniq[i]] = searchVal1Download[j];
                                                          arrDownload.push(obj)
                                                        }
                                                      }
                                                    }
                                                    let newFilterData = gstListFilter(arrDownload);
                                                    debugger
                                                    setCompanyList([...newFilterData])
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
                                          var value = searchInput.children[0].value;

                                          const x = searchVal1Download;
                                          if (!searchVal1Download?.length) {
                                            x.push(value);
                                            let y = currentColDownload;
                                            y.push(companyColumnsName[currentCol1Download]?.data);
                                            setSearchVal1Download(x);
                                            setCurrentColDownload(y);

                                          } else {
                                            const Index = currentColDownload?.findIndex(
                                              (item) => companyColumnsName[currentCol1Download]?.data == item
                                            );

                                            if (Index != -1) {
                                              const xyz = searchVal1Download;
                                              xyz[Index] = value;
                                              setSearchVal1Download(xyz);
                                            } else {
                                              x.push(value);
                                              let y = currentColDownload;
                                              y.push(companyColumnsName[currentCol1Download]?.data);
                                              setSearchVal1Download(x);
                                              setCurrentColDownload(y);
                                            }
                                          }
                                          let uniq = [...new Set(currentColDownload)];

                                          for (let i = 0; i < uniq.length; i++) {
                                            var obj = {};

                                            for (let j = 0; j < searchVal1Download.length; j++) {

                                              if (i == j) {
                                                obj[uniq[i]] = searchVal1Download[j];
                                                arrDownload.push(obj)
                                              }
                                            }
                                          }
                                          let newFilterData = gstListFilter(arrDownload);
                                          debugger
                                          setCompanyList([...newFilterData])
                                        }}
                                      />}

                                    {
                                      <ReactPaginate
                                        breakLabel="..."
                                        nextLabel=""
                                        onPageChange={handlePageClick}
                                        pageRangeDisplayed={2}
                                        pageCount={pageCountWithout}
                                        forcePage={currentPage}
                                        // pageCount={searchValue.length ? Math.ceil(filteredData.length / 7) : Math.ceil(data.length / 7) || 1}
                                        previousLabel=""
                                        renderOnZeroPageCount={null}
                                        marginPagesDisplayed={2}
                                        activeClassName="active"
                                        pageClassName="page-item"
                                        breakClassName="page-item"
                                        nextLinkClassName="page-link"
                                        pageLinkClassName="page-link"
                                        breakLinkClassName="page-link"
                                        previousLinkClassName="page-link"
                                        nextClassName="page-item next-item"
                                        previousClassName="page-item prev-item"
                                        containerClassName="pagination react-paginate separated-pagination pagination-sm justify-content-end pe-1 mt-1"
                                      />
                                    }
                                  </Col>
                                ) : (
                                  ""
                                )}
                                <Col className="d-flex align-items-center justify-content-end ">
                                  <div className="btn-wrapper text-end">
                                    <Button type="submit" color="primary" outline>
                                      {btnTitle}
                                    </Button>
                                  </div>

                                </Col>
                              </Row>
                            </Form>
                          )}
                        </TabPane>
                      </TabContent>

                      <TabPane tabId="3" key={"3"}>
                        {tabId == "3" && (
                          <Fragment>
                            <br></br>
                            {userListData?.length ?
                              <HotTable
                                id="userhotDownload"
                                autoWrapRow={false}
                                ref={hotRef}
                                data={userListData !== undefined && userListData !== null && userListData !== "" ? userListData : []}
                                columns={userListColumns}
                                rowHeights={RowSize}
                                columnHeaderHeight={columnHeaderSize}
                                afterGetColHeader={theaderuserlist}
                                licenseKey="non-commercial-and-evaluation"
                                height="auto"
                                autoColumnSize={true}
                                rowHeaders={false}
                                stretchH="all"
                                readOnly={true}
                                preventOverflow="horizontal"
                                // colHeaders={(x) => colHeaders(x)}
                                hiddenColumns={{
                                  columns: [6, 7, 8, 9, 10],
                                }}
                                afterOnCellMouseDown={
                                  localAfterOnCellMouseDownUser
                                }
                                dropdownMenu={{
                                  items: {
                                    filter_by_value: {
                                      name: "Search Value",
                                    },
                                    clear: {
                                      name: `<button id='btnClear' name='Clear' tabIndex="-1"   value='Clear'>Clear</button>`,
                                      callback: function (key, selection, clickEvent) {

                                        var src = clickEvent.target;

                                        if (src.tagName.toLowerCase() === "button") {
                                          if (clickEvent.target.id == "btnClear") {
                                            var searchInput = document.querySelector(
                                              ".htUIMultipleSelectSearch.htUIInput"
                                            );
                                            var value = "";
                                            const x = searchValUserDownload;
                                            if (!searchValUserDownload?.length) {
                                              x.push(value);
                                              let y = currentColUserDownload;
                                              y.push(userListColumns[currentColUser1Download]?.data);
                                              setSearchValUserDownload(x);
                                              setCurrentColUserDownload(y);

                                            } else {
                                              const Index = currentColUserDownload?.findIndex(
                                                (item) => userListColumns[currentColUser1Download]?.data == item
                                              );

                                              if (Index != -1) {
                                                const xyz = searchValUserDownload;
                                                xyz[Index] = value;
                                                setSearchValUserDownload(xyz);
                                              } else {
                                                x.push(value);
                                                let y = currentColUserDownload;
                                                y.push(userListColumns[currentColUser1Download]?.data);
                                                setSearchValUserDownload(x);
                                                setCurrentColUserDownload(y);
                                              }
                                            }
                                            let uniq = [...new Set(currentColUserDownload)];

                                            for (let i = 0; i < uniq.length; i++) {
                                              var obj = {};

                                              for (let j = 0; j < searchValUserDownload.length; j++) {

                                                if (i == j) {
                                                  obj[uniq[i]] = searchValUserDownload[j];
                                                  arrDownload.push(obj)
                                                }
                                              }
                                            }
                                            let newFilterData = gstUserListFilter(arrDownload);
                                            setUserListData([...newFilterData])
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
                                  var value = searchInput.children[0].value;

                                  const x = searchValUserDownload;
                                  if (!searchValUserDownload?.length) {
                                    x.push(value);
                                    let y = currentColUserDownload;
                                    y.push(userListColumns[currentColUser1Download]?.data);
                                    setSearchValUserDownload(x);
                                    setCurrentColUserDownload(y);

                                  } else {
                                    const Index = currentColUserDownload?.findIndex(
                                      (item) => userListColumns[currentColUser1Download]?.data == item
                                    );

                                    if (Index != -1) {
                                      const xyz = searchValUserDownload;
                                      xyz[Index] = value;
                                      setSearchValUserDownload(xyz);
                                    } else {
                                      x.push(value);
                                      let y = currentColUserDownload;
                                      y.push(userListColumns[currentColUser1Download]?.data);
                                      setSearchValUserDownload(x);
                                      setCurrentColUserDownload(y);
                                    }
                                  }
                                  let uniq = [...new Set(currentColUserDownload)];

                                  for (let i = 0; i < uniq.length; i++) {
                                    var obj = {};

                                    for (let j = 0; j < searchValUserDownload.length; j++) {

                                      if (i == j) {
                                        obj[uniq[i]] = searchValUserDownload[j];
                                        arrDownload.push(obj)
                                      }
                                    }
                                  }
                                  let newFilterData = gstUserListFilter(arrDownload);
                                  setUserListData([...newFilterData])
                                }}
                                // comments={true}
                                mergeCells={false}
                                cells={function (row, col) {
                                  const cellPrp = {};
                                  if (col === 5) {
                                    cellPrp.className = "text-center";
                                    cellPrp.renderer = myBtns;
                                    cellPrp.readOnly = true;
                                  }
                                  // if (col == 0 || col == 1 || col == 2 || col == 3 || col == 4) {
                                  //   if (userListData[row]?.companyName?.length > 25) {
                                  //     cellPrp.comment = {
                                  //       value: userListData[row]?.companyName,
                                  //       style: { width: 200, height: 50 },
                                  //     };
                                  //   }
                                  //   if (userListData[row]?.firstName?.length > 25) {
                                  //     cellPrp.comment = {
                                  //       value: userListData[row]?.firstName,
                                  //       style: { width: 200, height: 50 },
                                  //     };
                                  //   }
                                  //   if (userListData[row]?.lastName?.length > 25) {
                                  //     cellPrp.comment = {
                                  //       value: userListData[row]?.lastName,
                                  //       style: { width: 200, height: 50 },
                                  //     };
                                  //   }
                                  //   if (userListData[row]?.email?.length > 25) {
                                  //     cellPrp.comment = {
                                  //       value: userListData[row]?.email,
                                  //       style: { width: 200, height: 50 },
                                  //     };
                                  //   }
                                  //   if (userListData[row]?.mobile?.length > 25) {
                                  //     cellPrp.comment = {
                                  //       value: userListData[row]?.mobile,
                                  //       style: { width: 200, height: 50 },
                                  //     };
                                  //   }
                                  //   cellPrp.renderer = myLables;
                                  // }


                                  return cellPrp;
                                }}

                              /> :
                              <HotTable
                                id="userhotDownload"
                                autoWrapRow={false}
                                ref={hotRef}
                                data={[{ companyName: "No Data Found!" }]}
                                columns={userListColumns}
                                rowHeights={RowSize}
                                columnHeaderHeight={columnHeaderSize}
                                afterGetColHeader={theaderuserlist}
                                licenseKey="non-commercial-and-evaluation"
                                height="auto"
                                autoColumnSize={true}
                                rowHeaders={false}
                                stretchH="all"
                                readOnly={true}
                                preventOverflow="horizontal"
                                // colHeaders={(x) => colHeaders(x)}
                                hiddenColumns={{
                                  columns: [6, 7, 8, 9, 10],
                                }}

                                dropdownMenu={{
                                  items: {
                                    filter_by_value: {
                                      name: "Search Value",
                                    },
                                    clear: {
                                      name: `<button id='btnClear' name='Clear' tabIndex="-1"   value='Clear'>Clear</button>`,
                                      callback: function (key, selection, clickEvent) {

                                        var src = clickEvent.target;

                                        if (src.tagName.toLowerCase() === "button") {
                                          if (clickEvent.target.id == "btnClear") {
                                            var searchInput = document.querySelector(
                                              ".htUIMultipleSelectSearch.htUIInput"
                                            );
                                            var value = "";
                                            const x = searchValUserDownload;
                                            if (!searchValUserDownload?.length) {
                                              x.push(value);
                                              let y = currentColUserDownload;
                                              y.push(userListColumns[currentColUser1Download]?.data);
                                              setSearchValUserDownload(x);
                                              setCurrentColUserDownload(y);

                                            } else {
                                              const Index = currentColUserDownload?.findIndex(
                                                (item) => userListColumns[currentColUser1Download]?.data == item
                                              );

                                              if (Index != -1) {
                                                const xyz = searchValUserDownload;
                                                xyz[Index] = value;
                                                setSearchValUserDownload(xyz);
                                              } else {
                                                x.push(value);
                                                let y = currentColUserDownload;
                                                y.push(userListColumns[currentColUser1Download]?.data);
                                                setSearchValUserDownload(x);
                                                setCurrentColUserDownload(y);
                                              }
                                            }
                                            let uniq = [...new Set(currentColUserDownload)];

                                            for (let i = 0; i < uniq.length; i++) {
                                              var obj = {};

                                              for (let j = 0; j < searchValUserDownload.length; j++) {

                                                if (i == j) {
                                                  obj[uniq[i]] = searchValUserDownload[j];
                                                  arrDownload.push(obj)
                                                }
                                              }
                                            }
                                            let newFilterData = gstUserListFilter(arrDownload);
                                            setUserListData([...newFilterData])
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
                                  var value = searchInput.children[0].value;

                                  const x = searchValUserDownload;
                                  if (!searchValUserDownload?.length) {
                                    x.push(value);
                                    let y = currentColUserDownload;
                                    y.push(userListColumns[currentColUser1Download]?.data);
                                    setSearchValUserDownload(x);
                                    setCurrentColUserDownload(y);

                                  } else {
                                    const Index = currentColUserDownload?.findIndex(
                                      (item) => userListColumns[currentColUser1Download]?.data == item
                                    );

                                    if (Index != -1) {
                                      const xyz = searchValUserDownload;
                                      xyz[Index] = value;
                                      setSearchValUserDownload(xyz);
                                    } else {
                                      x.push(value);
                                      let y = currentColUserDownload;
                                      y.push(userListColumns[currentColUser1Download]?.data);
                                      setSearchValUserDownload(x);
                                      setCurrentColUserDownload(y);
                                    }
                                  }
                                  let uniq = [...new Set(currentColUserDownload)];

                                  for (let i = 0; i < uniq.length; i++) {
                                    var obj = {};

                                    for (let j = 0; j < searchValUserDownload.length; j++) {

                                      if (i == j) {
                                        obj[uniq[i]] = searchValUserDownload[j];
                                        arrDownload.push(obj)
                                      }
                                    }
                                  }
                                  let newFilterData = gstUserListFilter(arrDownload);
                                  setUserListData([...newFilterData])
                                }}
                                comments={true}
                                mergeCells={[{ row: 0, col: 0, rowspan: 1, colspan: 6 }]}
                                cells={function (row, col) {
                                  var cp = {};

                                  if (col == 0) {

                                    cp.className = "text-center";
                                  }
                                  return cp;

                                }}

                              />
                            }
                          </Fragment>
                        )}
                      </TabPane>

                      <TabPane tabId="4" key={4}>
                        {tabId == 4 && (
                          <>
                            <Form
                              className="mt-1 pt-50"
                              onSubmit={handleSubmit(onSubmitSmtpSetting)}
                            >
                              <Row>
                                <Col md="4" className="mb-1">
                                  <Label className="form-label requiredlable">
                                    Display Name
                                  </Label>
                                  <Controller
                                    rules={{
                                      required:
                                        "Please enter display name.",
                                    }}
                                    id="displayName"
                                    name="displayName"
                                    control={control}
                                    render={({ field }) => (
                                      <Input
                                        placeholder=""
                                        invalid={errors?.displayName?.message && true}
                                        {...field}
                                        onChange={field.onChange}
                                        onKeyPress={(e) => handleKeyPressPass(e, setError,'displayName','displayName','allowSpace')}
                                        onPaste={(e) => handlePasteText(e, setError,'displayName','displayName','allowSpace')}
                                      />
                                    )}
                                  />
                                  {errors.displayName && (
                                    <FormFeedback>
                                      {errors.displayName.message}
                                    </FormFeedback>
                                  )}
                                </Col>

                                <Col md="4" className="mb-1">
                                  <Label className="form-label requiredlable">
                                    SMTP User Name
                                  </Label>
                                  <Controller
                                    rules={{
                                      required:
                                        "Please enter SMTPS user name.",
                                    }}
                                    id="smtpUserName"
                                    name="smtpUserName"
                                    control={control}
                                    render={({ field }) => (
                                      <Input
                                        placeholder=""
                                        invalid={
                                          errors?.smtpUserName?.message && true
                                        }
                                        {...field}
                                        onKeyPress={(e) => handleKeyPressPass(e, setError,'smtpUserName','smtpUserName','Space')}
                                        onPaste={(e) => handlePasteText(e, setError,'smtpUserName','smtpUserName','Space')}
                                      />
                                    )}
                                  />
                                  {errors.smtpUserName && (
                                    <FormFeedback>
                                      {errors.smtpUserName.message}
                                    </FormFeedback>
                                  )}
                                </Col>

                                <Col md="4" className="mb-1">
                                  <Label className="form-label requiredlable">
                                    Password
                                  </Label>
                                  <Controller
                                    rules={{
                                      required: "Please enter password.",
                                      // pattern: {
                                      //   value: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/,
                                      //   message: 'Password must have at least 8 characters include at least 1 lowercase character, 1 uppercase character, 1 number and 1 special character.'
                                      // }
                                    }}
                                    id="newPassword1"
                                    name="newPassword1"
                                    control={control}
                                    render={({ field }) => (
                                      <InputPasswordToggle
                                        className="input-group-merge"
                                        placeholder=""
                                        invalid={errors?.newPassword1?.message && true}
                                        {...field}
                                        onKeyPress={(e) => handleKeyPressPass(e, setError,'newPassword1','Password','password')}
                                        onPaste={(e) => handlePasteText(e, setError,'newPassword1','Password','password')}
                                      />
                                    )}
                                  />
                                  {errors.newPassword1 && (
                                    <FormFeedback>
                                      {errors.newPassword1.message}
                                    </FormFeedback>
                                  )}
                                </Col>
                              </Row>

                              <Row>
                                <Col md="4" className="mb-1">
                                  <Label className="form-label requiredlable">
                                    SMTP Server Name
                                  </Label>
                                  <Controller
                                    rules={{
                                      required:
                                        "Please enter SMTP server name.",
                                    }}
                                    id="smtpserverName"
                                    name="smtpserverName"
                                    control={control}
                                    render={({ field }) => (
                                      <Input
                                        placeholder=""
                                        invalid={errors?.smtpserverName?.message && true}
                                        {...field}
                                        onChange={field.onChange}
                                        onKeyPress={(e) => handleKeyPressPass(e, setError,'smtpserverName','smtpserverName','allowSpace')}
                                        onPaste={(e) => handlePasteText(e, setError,'smtpserverName','smtpserverName','allowSpace')}
                                      />
                                    )}
                                  />
                                  {errors.smtpserverName && (
                                    <FormFeedback>
                                      {errors.smtpserverName.message}
                                    </FormFeedback>
                                  )}
                                </Col>
                                <Col md="4" className="mb-1">
                                  <Label className="form-label requiredlable">
                                    SMTP Port No.
                                  </Label>
                                  <Controller
                                    rules={{
                                      required:
                                        "Please enter SMTP Port No.",
                                    }}
                                    id="smtpPortNo"
                                    name="smtpPortNo"
                                    control={control}
                                    render={({ field }) => (
                                      <Input
                                        type="number"
                                        placeholder=""
                                        invalid={errors.smtpPortNo && true}
                                        {...field}
                                        onChange={(e) =>
                                          field.onChange(
                                            e.target.value.replace(
                                              /\s/g,
                                              ""
                                            )
                                          )
                                        }
                                      />
                                    )}
                                  />
                                  {errors.smtpPortNo && (
                                    <FormFeedback>
                                      {errors.smtpPortNo.message}
                                    </FormFeedback>
                                  )}
                                </Col>
                                <Col md="4" className="mb-1 mt-2">
                                  <div
                                    className="form-check mb-1  mt-1"
                                  // Remove CSS
                                  // style={{ marginTop: "20px" }}
                                  >
                                    <Input
                                      type="checkbox"
                                      id="enableSSL"
                                      name="enableSSL"
                                      checked={enableSSL}
                                      readOnly
                                      onChange={handleChange}
                                    />
                                    <Label
                                      className="form-check-label"
                                      for="enable-SSL"
                                      onChange={handleChange}
                                    >
                                      Enable SSL
                                    </Label>
                                  </div>
                                </Col>
                              </Row>
                              <Row className="justify-content-end">
                                <Col className="" md="8" sm="12">
                                  <strong>
                                    <a
                                      target="_blank"
                                      href="https://support.google.com/mail/answer/185833?hl=en"
                                    >
                                      {" "}
                                      <div className="alert-body">
                                        {" "}
                                        <u>
                                          {" "}
                                          If there is two factor
                                          authentication then please
                                          generate and enter password as
                                          shown in given link
                                        </u>{" "}
                                      </div>{" "}
                                    </a>
                                  </strong>
                                </Col>

                                <Col
                                  className="d-flex align-items-center justify-content-end"
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
                                </Col>
                              </Row>
                            </Form>{" "}
                            <br />{" "}
                            <HotTable
                              ref={hotRefSMTP}
                              data={smtpSettingData}
                              rowHeights={RowSize}
                              columnHeaderHeight={columnHeaderSize}
                              columns={SMTPColumns}
                              afterGetColHeader={theaderSMTP}
                              licenseKey="non-commercial-and-evaluation"
                              height="auto"
                              autoColumnSize={true}
                              rowHeaders={false}
                              stretchH="all"
                              readOnly={true}
                              cells={function (row, col) {
                                const cellPrp = {};
                                if (col === 4) {
                                  cellPrp.renderer = myBtns;
                                  cellPrp.readOnly = true;
                                  cellPrp.className = "text-center";
                                }
                                return cellPrp;
                              }}
                            ></HotTable>
                          </>
                        )}

                      </TabPane>


                      {isCompany == true || isCompany == "true" ? (
                        <>


                          <TabPane tabId="5" key={"5"}>
                            {tabId == "5" && <Vendor tabId={"5"}></Vendor>}
                          </TabPane>
                        </>
                      ) : (
                        ""
                      )}

                      <TabPane tabId="6" key={6}>
                        {tabId == 6 && (
                          <>


                            <Col sm='12'>
                              <Card>
                                <CardBody>
                                  <Row>
                                  {/* <div {...getRootProps({ className: 'dropzone file-browser-drop-box' })}>
                                      <input {...getInputProps()} /> */}
                                    <div className='dropzone file-browser-drop-box'   onClick={onClickiImportCompanyFile}>
                                      <input type="file"
                                        id="file"
                                        ref={inputFile}
                                        onChange={(e) => handleImportChange(e)}
                                        style={{ display: "none" }} />
                                      <div className='d-flex align-items-center justify-content-center flex-column'

                                      >
                                        <DownloadCloud size={64} />

                                        <h5>Drop Files here or click to upload</h5>
                                        <p className='text-secondary'>
                                          Drop files here or click{' '}
                                          <a href='/' onClick={e => e.preventDefault()} className="text-danger">
                                            browse
                                          </a>{' '}
                                          thorough your machine
                                        </p>
                                      </div>
                                    </div>

                                  </Row>
                                  {/* <CardTitle tag='h3' className="mt-1 fw-bold">{name}</CardTitle> */}
                                </CardBody>
                              </Card>
                            </Col>


                            {/* <div
                              className="drop-area mt-1 "
                              onDragOver={handleDragOver}
                              onDrop={handleDrop}
                            >
                              <Download size={14} className="me-1" />
                              Drop import file here
                              Or click to select files
                              <p className="mt-1 text-center"> <input type="file" className="" /> </p>

                            </div> */}
                            {/* <Col xl='3' md='3' sm='6'>
                              <div
                                // onClick={onClickiImportCompanyFile}
                                style={{ cursor: "pointer" }}
                                className="card p-2 text-center">
                                <div >
                                  <img className="img-fluid w-25 m-auto" src={excellImg} />
                                </div>
                                <p style={{ fontWeight: "bold" }}> Single File Excel</p>
                              </div>
                            </Col> */}
                          </>
                        )}
                      </TabPane>

                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </Fragment>
    </>
  );
};

export default Profile;
