import { Fragment, useRef } from "react";
import { Button, Col, Label, Row } from "reactstrap";
import { useEffect } from "react";
import { registerAllModules } from "handsontable/registry";
import { Search, ArrowRight, ArrowLeft } from "react-feather";

registerAllModules();

const Gstr9FileDataSummary = ({ block, setBlock, stepper }) => {

  useEffect(() => {
    return () => setBlock(false);
  }, []);


  return (
    <>
      <Fragment>
        {block && <div className="loading1">Loading&#8230;</div>}

        <div className="content-header-left col-md-12 col-12">

          <div className="row breadcrumbs-top mb-1">
            <div className="col-md-6"></div>
            <div className="col-md-6">

              {/* <div className="row">
              <div className="col-md-12">
                <div className="row">
                  <div className="col-md-5"></div>
                  <Label className="form-label col-md-4 pt-half text-end">
                    Return Period
                  </Label>
                  <Select
                    id="from"
                    placeholder="From"
                    isClearable={false}
                    theme={selectThemeColors}
                    closeMenuOnSelect={true}
                    options={panDataFrom}
                    className="basic-multi-select col-md-3 ps-0"
                    classNamePrefix="select"
                    components={animatedComponents}
                    onChange={selectFromYear}
                    value={finFromYear}
                    maxMenuHeight={SELECT_MAXSIZE}
                    isDisabled={true}
                  />
                </div>
              </div>
            </div> */}

            </div>
          </div>
        </div>

      </Fragment>

      <div style={{ zIndex: "999", }} className='btnFixFooter'>
        <div className="container">
          <div className="d-flex justify-content-between">
              <Button
                color="danger"
                className="btn-prev"
                onClick={() => stepper.previous()}
                >
              <ArrowLeft
                size={14}
                className="align-middle me-sm-25 me-0"
              ></ArrowLeft>
              <span className="align-middle d-sm-inline-block d-none">
                Previous
              </span>
            </Button>
            {/* <Button
              color="danger"
              className="btn-next"
              onClick={() => stepper.next()}
            >
              <span className="align-middle d-sm-inline-block d-none">Next</span>
              <ArrowRight
                size={14}
                className="align-middle ms-sm-25 ms-0"
              ></ArrowRight>
            </Button> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Gstr9FileDataSummary;
