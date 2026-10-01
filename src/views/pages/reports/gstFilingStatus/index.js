import Handsontable from "handsontable";
import { HotTable } from "@handsontable/react";
import { registerAllModules } from "handsontable/registry";
import { Fragment, useEffect, useRef, useState, useMemo } from "react";
import Breadcrumbs from "@components/breadcrumbs";
import getGstFilingStatusService from "../../../../services/gst-filing-status/gst-filing-status";
import errorCodeConfig from "@configs/apiErrorCodeConfig";
import LocalFunction from "@configs/getLocalFunction";
import SessionFunction from "@configs/getSessionFunction";
import { globleVariable } from "@configs/globalVariable";
import { Label, Form, Input, InputGroup, InputGroupText, Button, CardText, Badge, UncontrolledTooltip } from "reactstrap";
import Select from "react-select"; // eslint-disable-line
import { selectThemeColors } from "@utils";
import makeAnimated from "react-select/animated";
import { SELECT_MAXSIZE } from "@configs/config";
import { Filter } from "react-feather";
// ** Icons Imports
import { Search } from 'react-feather'
import AdvanceFilters from './advanceFilter'
import ReactPaginate from "react-paginate";
import Swal from "sweetalert2";
import { keysMap, enableOnFormTags } from "../../../../configs/config";
import { useHotkeys } from "react-hotkeys-hook";
import { downloadURL } from "../../../../helper/downloadUrl";
import { toast } from "react-hot-toast";
import { urlEndpointConfig } from "@configs/urlEndpoint";



// register Handsontable's modules
registerAllModules();

const animatedComponents = makeAnimated();

// const finYearOption = LocalFunction.getLocalValue(
//   globleVariable.rangeFiltersFilingStatus
// );

const decryptedUserData = LocalFunction.getLocalValue(globleVariable.userData, true);
const userData = decryptedUserData && JSON.parse(decryptedUserData);
debugger
const finYearOption = userData && userData.data.rangeFiltersFilingStatus;


const YearList =
  finYearOption !== undefined &&
    finYearOption !== null &&
    finYearOption !== "" &&
    finYearOption !== "undefined"
    ? finYearOption
    : [];

const GstFilingStatus = () => {
  // ** decrypt variable
  const G_UCParId = SessionFunction.getSessionValue(globleVariable.G_UCParId, true);
  const G_GSTIN = SessionFunction.getSessionValue(globleVariable.G_GSTIN, true);
  const userIds = LocalFunction.getLocalValue(globleVariable.userId, true);
  const subscriptionId = LocalFunction.getLocalValue(globleVariable.subscriptionId, true);
  const UserId = localStorage.getItem(globleVariable.userId) && LocalFunction.getLocalValue(globleVariable.userId, true)
  const UserClientId = sessionStorage.getItem(globleVariable.G_UCParId) && SessionFunction.getSessionValue(globleVariable.G_UCParId, true)




  // ** Hooks
  const [gstStatusData, setGSTStatusData] = useState([]),
    [dataFrom, setDataFrom] = useState([]),
    [displayType, setDisplayType] = useState(false),
    [finFromYear, setFinFromYear] = useState(null),
    [block, setBlock] = useState(false),
    [filteredData, setFilteredData] = useState([]),
    [searchTerm, setSearchTerm] = useState(''),
    [composeOpen, setComposeOpen] = useState(false),
    [advFilterRecord, setAdvFilterRecord] = useState([]),
    [allowFilter, setAllowFilter] = useState(false),
    [gstStatusDataFilter, setGSTStatusDataFilter] = useState([]),
    // [pageCount , setPageCount] = useState(0),
    [currentPage, setCurrentPage] = useState(0),
    [rowsPerPage, setRowsPerPage] = useState(10);

  const [lastGeneratedDate, setLastGeneratedDate] = useState(false)

  // ** Client side pagination
  const para1 = currentPage * rowsPerPage;
  const para2 = currentPage * rowsPerPage + rowsPerPage;
  let dataStatusReport = filteredData && filteredData.slice(para1, para2);
  const pageCount = Math.ceil(filteredData?.length && filteredData.length / rowsPerPage);



  useEffect(() => {
    return () => setBlock(false);
  }, []);

  // ** Date list
  useEffect(() => {
    setDataFrom(YearList);
    setDisplayType(true);
  }, []);

  // ** Date set then search
  useEffect(() => {
    if (displayType == true) {
      //  selectFromYear(YearList[0]);
      CheckExistDataService()
      setDisplayType(false);
    }
  }, [displayType]);

  // ** Date dropdown select then search
  const selectFromYear = (e) => {
    setFinFromYear(e);
    searchGSTFillingStatus(e);

  };

  const exportGSTFiling = () => {
    setBlock(true);
    getGstFilingStatusService
      .exportGstFilingStatus(
        UserClientId,
        UserId,
        finFromYear?.value,
        subscriptionId,
        G_GSTIN,
      )
      .then((res) => {
        if (res?.status == 200 && res?.data?.status == errorCodeConfig.APIDefaultCode.Success) {

          setBlock(false);
          downloadURL(res.data.data)

        } else {

          setBlock(false);
          toast.error(res.data.errorMessage, {
            position: "top-right",
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
            confirmButton: "btn btn-outline-danger",
          },
          buttonsStyling: false,
        });
      });
  }

  useHotkeys(
    keysMap.EXPORT_SUMMARY_DATA,
    () => {
      !block && exportGSTFiling();
    },
    { enableOnFormTags }
  );

  // ** Search

  async function searchGSTFillingStatus(fromData) {
    try {

      const payLoad = {
        userClientId: G_UCParId,
        userId: userIds,
        subscriptionId: subscriptionId,
        financialYear: fromData.value,
        gstNumber: G_GSTIN,
      };


      setBlock(true)
      const response = await getGstFilingStatusService.getGstFilingStatusService(
        payLoad
      );

      console.log(response, "getGstFilingStatusService-response");
      if (response !== null) {
        setBlock(false)
        setGSTStatusData(response[0].CompanyReturnFiledDetails);
        setFilteredData(response[0].CompanyReturnFiledDetails);

        if (response?.[0]?.LastGeneratedReportDate) {
          setLastGeneratedDate(response?.[0]?.LastGeneratedReportDate)
        }
      } else {
        setBlock(false)
        setGSTStatusData([]);
        setFilteredData([]);
      }



    } catch (error) {
      setBlock(false)
      // Handle error
      console.error(error);
    }
  }



  // const searchGSTFillingStatus = (fromData) => {

  //   const payLoad = {
  //     userClientId: G_UCParId,
  //     userId: userIds,
  //     subscriptionId: subscriptionId,
  //     financialYear: fromData.value,
  //     gstNumber: G_GSTIN,
  //   };

  //   setBlock(true);
  //   getGstFilingStatusService.getGstFilingStatusService(payLoad).then((res) => {
  //     setDisplayType(false);
  //     if (
  //       res.status === 200 &&
  //       res.data.status === errorCodeConfig.APIDefaultCode.Success
  //     ) {
  //       setBlock(false);
  //       setGSTStatusData(res.data.data.companyReturnFiledDetails);
  //       setFilteredData(res.data.data.companyReturnFiledDetails);
  //     } else {
  //       setBlock(false);
  //       Swal.fire({
  //         icon: "error",
  //         title: "",
  //         text: error?.message,
  //         customClass: {
  //           confirmButton: "btn btn-danger",
  //         },
  //         buttonsStyling: false,
  //       });
  //     }
  //   });
  // };

  // const filteredDataMemoized = useMemo(() => {
  //   const value = searchTerm.toLowerCase();
  //   if (!value) return gstStatusData;

  //   return gstStatusData.filter(item =>
  //     item?.tradeName?.toLowerCase().includes(value) ||
  //     item?.gstNumber?.toLowerCase().includes(value) ||
  //     item?.registrationType?.toLowerCase().includes(value)
  //   );
  // }, [searchTerm, gstStatusData]);

  // useEffect(() => {
  //   setFilteredData(filteredDataMemoized);
  // }, [filteredDataMemoized]);

  // const handleFilter = (e) => {
  //   setSearchTerm(e.target.value);
  // };

  const handleFilter = (e) => {

    const value = e.target.value,
      SearchQueryLower = e.target.value.toLowerCase()

    setSearchTerm(e.target.value)

    let arr = []


    if (value.length) {

      if (allowFilter == true) {
        arr = gstStatusDataFilter.filter(item => {
          return (
            item?.TradeName?.toLowerCase().includes(SearchQueryLower)
            || item?.GSTNumber?.toLowerCase().includes(SearchQueryLower)
            || item?.RegistrationType?.toLowerCase().includes(SearchQueryLower)

          )
        })

      } else {
        arr = gstStatusData.filter(item => {
          return (
            item?.TradeName?.toLowerCase().includes(SearchQueryLower)
            || item?.GSTNumber?.toLowerCase().includes(SearchQueryLower)
            || item?.RegistrationType?.toLowerCase().includes(SearchQueryLower)

          )
        })
      }

      setCurrentPage(0);
      setFilteredData([...arr])
    } else {
      setCurrentPage(0);
      if (allowFilter == true) {

        setFilteredData([...gstStatusDataFilter])
      } else {
        setFilteredData([...gstStatusData])
      }


    }
  }

  const checkReturnType = (returnArray, returnTypes) => {
    for (const returnItem of returnArray) {
      if (returnItem.returnName && returnTypes.includes(returnItem.returnName.toLowerCase())) {
        return true;
      }
    }
    return false;
  };

  // ** Advance filter
  const advanceFiltersData = () => {
    let isFilter = true
    let arr = [];

    if (advFilterRecord) {

      if ((advFilterRecord?.TaxType == null || advFilterRecord?.TaxType == "") &&
        advFilterRecord.FilingStatus.length == 0 && advFilterRecord.ReturnType.length == 0) {
        isFilter = false
      }


      if (isFilter == true) {

        arr = gstStatusData.filter(item => {
          const taxTypeExists = advFilterRecord.TaxType != null && advFilterRecord.TaxType !== "";
          const filingStatusExists = advFilterRecord.FilingStatus.length > 0;
          const returnTypeExists = advFilterRecord.ReturnType.length > 0;

          if (taxTypeExists) {
            // Check if taxType matches
            if (!item.RegistrationType || !item.RegistrationType.toLowerCase().includes(advFilterRecord.TaxType.toLowerCase())) {
              return false;
            }
          }

          if (filingStatusExists) {
            // Check filingStatus
            const filings = advFilterRecord.FilingStatus;
            const returns = item.Returns;

            if (!returns || !Object.values(returns).flat().some(returnItem => filings.includes(returnItem.IsFiled ? 'Filed' : 'Not Filed'))) {
              return false;
            }
          }

          if (returnTypeExists) {
            // Check returnType
            const returnTypes = advFilterRecord.ReturnType.map(type => type.toLowerCase());
            const returns = item.Returns;

            if (!returns || !Object.values(returns).flat().some(returnItem => returnTypes.includes(returnItem.ReturnName?.toLowerCase()))) {
              return false;
            }
          }

          // Include the item if all conditions are met
          return taxTypeExists || filingStatusExists || returnTypeExists;
        });

        setCurrentPage(0);
        setFilteredData([...arr])
        setGSTStatusDataFilter([...arr])
      } else {
        setCurrentPage(0);
        setFilteredData([...gstStatusData])
        setGSTStatusDataFilter([...gstStatusData])
      }
    }
  }


  useEffect(() => {
    if (allowFilter == true) {

      advanceFiltersData()
    }
  }, [advFilterRecord])



  const onChange = e => {

    handleFilter(e)

  }

  const advanceFilteronClick = (e) => {
    e.preventDefault()
    setComposeOpen(true)
  }


  const theader = (col, TH) => {
    if (col == 0) {
      TH.className = "htLeft";
    }
  };

  let renderIndex = 0;

  const toggleCompose = () => setComposeOpen(!composeOpen);


  const noRecordFound = () => {
    return (
      <div style={{ borderStyle: "solid", borderWidth: "thin" }} >
        <h6 className="text-center" style={{ margin: "auto", padding: "5px" }}  > No Record found </h6>
      </div>
    )
  }

  const tableTitle = (index, list) => {
    return (
      <h3 className="heading-font-18-weight">
        {`${index + 1}.  ${list.TradeName}
       ${list.RegistrationType ? ` | ${list.RegistrationType}` : ''}
      `}
      </h3>
    )
  }


  //** Pagination Onclick
  const handlePageClick = (event) => {
    setCurrentPage(event?.selected);
    //  if (currentPage < pageCount - 1) { // Check if there are more pages
    //   setCurrentPage(prevPage => prevPage + 1); // Increment the current page
    //  }
  };


  async function CheckExistDataService() {
    try {
      setBlock(true)
      const response = await getGstFilingStatusService.getCheckExistData(
        G_UCParId,
        userIds,
        G_GSTIN,
        'GSTFillingStatus'
      );

      // Process response
      console.log(response, "response");

      if (response !== undefined) {
        setBlock(false)

        setGSTStatusData(response[0].CompanyReturnFiledDetails);
        setFilteredData(response[0].CompanyReturnFiledDetails);

        if (response?.[0]?.LastGeneratedReportDate) {
          setLastGeneratedDate(response?.[0]?.LastGeneratedReportDate)

          let fromToDate = response?.[0]?.FromRange
          let defaultYear = YearList.filter(p => p.value == fromToDate)[0];
          setFinFromYear(defaultYear)

        }

      } else {
        setBlock(false)
        setGSTStatusData([]);
        setFilteredData([]);
      }

    } catch (error) {
      // Handle error
      console.error(error);
    }
  }


  return (
    <Fragment>
      {block && <div className="loading1">Loading&#8230;</div>}
      <div className="content-header row py-1">
        <div className="content-header-left col-md-5 col-6">
          <div className="row breadcrumbs-top">
            <div className="col-12">
              <Breadcrumbs
                title="Purchase Summary"
                data={[
                  { title: "Reports", link: urlEndpointConfig.REPORT_ALL },
                  { title: "GST Filing Status Report" },
                ]}
              />
            </div>
          </div>
        </div>
        <div className="content-header-right text-md-end col-md-7 col-6 d-md-block d-none">

          <Button
            className="btn-icon"
            outline
            color="danger"
            id="btnhsnexp"
            onClick={finFromYear?.value && exportGSTFiling}
          >
            <i className="fa fa-file-excel-o"></i>

            <span className="align-middle ms-50">
              Export
            </span>
          </Button>
          <UncontrolledTooltip placement="top" target="btnhsnexp">
            Export [{keysMap.EXPORT_SUMMARY_DATA}]
          </UncontrolledTooltip>
        </div>
      </div>
      <div className="content-header-left col-md-12 col-12 pt-half">
        <div className="row">
          <div className="col-md-3">
            <Form className='kb-search-input' onSubmit={e => e.preventDefault()}>
              <InputGroup className='input-group-merge'>
                <InputGroupText>
                  <Search size={14} />
                </InputGroupText>
                <Input value={searchTerm} onChange={e => onChange(e)} placeholder='Search by GSTIN, Trade Name, Reg.Type' />
              </InputGroup>
            </Form>
          </div>
          <div className="col-md-3">
            <Button
              onClick={advanceFilteronClick}
              className="btn-icon btn-round"
              color="danger"
              outline
            >

              <Filter size={14} />&nbsp;Advance Filter
            </Button>

          </div>
          <div className="col-md-6">
            <div className="row ">
              <div className="col-md-6">

                {
                  lastGeneratedDate &&
                  <Badge className="me-1" color='light-warning'>  Last Generated Report Date :  {lastGeneratedDate} </Badge>
                }

              </div>
              <div className="col-md-6">
                <div className="row">
                  <Label className="form-label col-md-5 pt-half text-end ">
                    Return Period
                  </Label>
                  <Select
                    id="from"
                    placeholder="From"
                    isClearable={false}
                    theme={selectThemeColors}
                    closeMenuOnSelect={true}
                    options={dataFrom}
                    className="basic-multi-select col-md-7"
                    classNamePrefix="select"
                    components={animatedComponents}
                    onChange={selectFromYear}
                    value={finFromYear}
                    maxMenuHeight={SELECT_MAXSIZE}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-12">
        {dataStatusReport &&
          dataStatusReport.map((list, index) => {

            const data = [];
            const nestedHeaders = [];
            const subnestedHeaders = [];
            let gstinShow = false;


            const gstNumber = list.GSTNumber; // Assuming GST number is available at gstin
            data.push(gstNumber); // Push GST number as the first cell

            const activityNames = list.Returns && Object.keys(list.Returns);

            if (activityNames) {
              gstinShow = true;
              renderIndex = renderIndex + 1

              activityNames.forEach((activityName) => {
                const periods = list.Returns[activityName].map(
                  (item) => item.Month
                )


                const subHeaderDetail = list.Returns[activityName].map(
                  (item) => item
                );
                const uniquePeriods = Array.from(new Set(periods));

                // first header
                nestedHeaders.push({
                  label: `${activityName.toString().toUpperCase()}`,
                  colspan: uniquePeriods.length,
                });

                // Second  header
                uniquePeriods.forEach((period) => {
                  subnestedHeaders.push(period);
                });

                // grid data
                subHeaderDetail.forEach((state) => {
                  let FiledValue =
                    state.IsFiled == true ? "Filed" : "Not Filed";
                  let FiledDateValue = state.FilingDate;
                  data.push(FiledValue + " : " + FiledDateValue);
                });
              });
            }



            if (gstinShow == true) {
              const showHeaders = [
                ["GSTINs", ...nestedHeaders],
                ["", ...subnestedHeaders],
              ];

              return (
                <div className="pt-2">

                  {
                    tableTitle(index, list)
                  }

                  <HotTable
                    data={[data]} // Your data
                    stretchH="all"
                    cells={function (row, col) {
                      var cp = {};
                      if (col > 0) {
                        cp.className = "text-center";
                      } else {
                        cp.className = "boldRow";
                      }

                      return cp;
                    }}
                    colHeaders={true}
                    rowHeaders={false}
                    height="auto"
                    nestedHeaders={showHeaders}
                    autoWrapRow={true}
                    licenseKey="non-commercial-and-evaluation"
                    readOnly={true}
                    afterGetColHeader={theader}
                  ></HotTable>


                </div>
              );
            } else {

              return (
                <div className="pt-2">
                  {
                    tableTitle(index, list)
                  } {
                    noRecordFound()
                  }
                </div>

              )

            }
          })}

        {filteredData?.length ? (
          <ReactPaginate
            breakLabel="..."
            nextLabel=""
            onPageChange={handlePageClick}
            pageRangeDisplayed={2}
            pageCount={pageCount}
            previousLabel=""
            renderOnZeroPageCount={null}
            forcePage={currentPage}
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
        ) : (
          <></>
        )}

        {
          filteredData.length == 0 ? <h6 className="text-center mt-2" > No Record found </h6> : ""
        }

      </div>
      <br></br>

      {
        composeOpen && <AdvanceFilters composeOpen={composeOpen} toggleCompose={toggleCompose}
          setAdvFilterRecord={setAdvFilterRecord} advFilterRecord={advFilterRecord} setAllowFilter={setAllowFilter}
        ></AdvanceFilters>
      }




    </Fragment>
  );
};

export default GstFilingStatus;
