import { useState, useEffect } from "react";
import { Modal, ModalBody, Row, Col, Button, Label, Input } from "reactstrap";

const advanceFilters = ({ composeOpen , toggleCompose , setAdvFilterRecord , advFilterRecord , setAllowFilter }) => {

const [selectedValue, setSelectedValue] = useState(''),
[FillingTypeCheckbox, setFillingTypeCheckbox] = useState([]),
[returnTypeCheckbox, setReturnTypeCheckbox] = useState([]);

  const filingStatus = [
    { id: 'Filed', title: "Filed" },
    { id: 'Not Filed', title: "Not Filed" }
  ];

  const returnType = [
    { id: 'GSTR1', title: "GSTR-1" },
    { id: 'GSTR3B', title: "GSTR-3B" },
    { id: 'CMP', title: "CMP-08" },
    { id: 'GSTR6', title: "GSTR-6" },
    { id: 'ITC04', title: "ITC-04" },
    { id: 'IFF', title: "IFF" }
  ];


  const taxpayerType = [
    { id: 'Regular', title: "Regular" },
    { id: 'Composition', title: "Composition" },
    { id: 'ISD', title: "ISD" },
  ]

  const handleOnChange = (e, id) => {
    setSelectedValue(id);
  }

  // ** Filling onChange event
  const handleCheckboxFillingChange = (e) => {
    const { id, checked } = e.target;
    if (checked) {
      setFillingTypeCheckbox([...FillingTypeCheckbox, id]); // Add id to selectedCheckboxes array if checked
    } else {
      setFillingTypeCheckbox(FillingTypeCheckbox.filter(item => item !== id)); // Remove id from selectedCheckboxes array if unchecked
    }
  };

   // ** Return onChange event
  const handleCheckboxReturnChange = (e) => {
    const { id, checked } = e.target;
    if (checked) {
      setReturnTypeCheckbox([...returnTypeCheckbox, id]); // Add id to selectedCheckboxes array if checked
    } else {
      setReturnTypeCheckbox(returnTypeCheckbox.filter(item => item !== id)); // Remove id from selectedCheckboxes array if unchecked
    }
  };

  const onApplyFilter = () => {
    let isFilterApply = false

    const objFilter = {
      TaxType : selectedValue,
      FilingStatus : FillingTypeCheckbox,
      ReturnType : returnTypeCheckbox
    }

    setAdvFilterRecord(objFilter)
    toggleCompose()
    setAllowFilter(true);
  }

  useEffect(() => {

    if (advFilterRecord) {

        // ** checkbox
        if (advFilterRecord.TaxType) {
          setSelectedValue(advFilterRecord.TaxType); // Set the value of the first status
        }

         if (advFilterRecord?.FilingStatus?.length > 0) {
            const selectedFilingStatus = advFilterRecord.FilingStatus.filter(id => id !== null);
            const filteredFilingStatus = filingStatus.filter(item => selectedFilingStatus.includes(item.id));
            setFillingTypeCheckbox(filteredFilingStatus.map(item => item.id));
          }

          if (advFilterRecord?.ReturnType?.length > 0) {
            const selectedReturnStatus = advFilterRecord.ReturnType.filter(id => id !== null);
            const filteredReturnStatus = returnType.filter(item => selectedReturnStatus.includes(item.id));
            setReturnTypeCheckbox(filteredReturnStatus.map(item => item.id));
          }
    }


  },[advFilterRecord])

  const clearFunc = () => {
    setFillingTypeCheckbox([]);
    setSelectedValue(null); // Assuming setSelectedValue is for a radio button
    setReturnTypeCheckbox([]);
  }

  return (
    <Modal
      backdrop="static"
      isOpen={composeOpen}
      toggle={toggleCompose}
      className="modal-dialog-centered">
      <div className="modal-header">
        <h2 className="modal-title w-100 text-center">Advanced Filters</h2>
      </div>
      <ModalBody className="px-sm-2 mx-30 pb-2">
        <Row>
          <Col className="md-12 text-end">
            <Label className="text-danger cursor-pointer"    onClick={clearFunc}  >Clear</Label>
          </Col>
        </Row>
        <Row>
          <Col className="md-4">
            <div className="multi-range-price">
              <h6 className="filter-title mt-0 fw-bolder"> Taxpayer Type</h6>
              <ul className="list-unstyled price-range">
              {taxpayerType.map((status) => {
                  return (
                    <li key={status.id} className="mt-1">
                      <div className="form-check mt-0">
                          <Input type="radio" id={status.id} value={status.id} name="price-range-radio"
                          onChange={(e) => handleOnChange(e, status.id)}
                          checked={selectedValue === status.id}
                          />
                          <Label className="form-check-label"  for={status.id}>
                            <h6>{status.title}</h6>
                          </Label>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </Col>
          <Col className="md-4">
            <div id="product-categories">
              <h6 className="filter-title fw-bolder">Filing Status</h6>
              <ul className="list-unstyled categories-list">
                {filingStatus.map((status) => {
                  return (
                    <li key={status.title} className="mt-1">
                      <div className="form-check">
                        <Input
                          type="checkbox"
                          id={status.id}
                          checked={FillingTypeCheckbox.includes(status.id)} // Set checked attribute based on whether the status
                          onChange={handleCheckboxFillingChange} // Call handleCheckboxFillingChange function on change event

                        />
                        <Label className="form-check-label" for={status.title}>
                          <h6> {status.title}</h6>
                        </Label>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </Col>
          <Col className="md-4">
            {" "}
            <div id="product-categories">
              <h6 className="filter-title fw-bolder">Return Type</h6>
              <ul className="list-unstyled">
                {returnType.map((status) => {
                  return (
                    <li key={status.title} className="mt-1">
                      <div className="form-check">
                        <Input
                          type="checkbox"
                          id={status.id}
                          checked={returnTypeCheckbox.includes(status.id)} // Set checked attribute based on whether the status
                          onChange={handleCheckboxReturnChange} // Call handleCheckboxFillingChange function on change event

                        />
                        <Label className="form-check-label" for={status.title}>
                          <h6> {status.title}</h6>
                        </Label>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </Col>
        </Row>
        <br></br>
        <Row className="justify-content-end mx-0">
          <Col
            className="d-flex align-items-center justify-content-end"
            md="6"
            sm="12">
            <Button type="submit" className="me-1" color="secondary"  onClick={toggleCompose} outline>
              Cancel
            </Button>
            <Button color="danger" onClick={onApplyFilter} >Apply</Button>
          </Col>
        </Row>
      </ModalBody>
    </Modal>
  );
};

export default advanceFilters;
