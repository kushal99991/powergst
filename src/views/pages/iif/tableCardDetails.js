import Select from "react-select"; // eslint-disable-line
import {
    Row,
    Col,
    Card,
    CardBody,
    Label,
  } from "reactstrap";

const TableCardDetails = ({totalInvoice,totalInvoiceValue,totalTaxableValue,totalIGST,totalSGST,totalCGST,totalCess,id,placeholder,theme,components,options,className,classNamePrefix,onChange,isDisabled,value,idReturnPeriod,placholderReturnPeriod,isClearable,closeMenuOnSelect,optionsReturnPeriod,onChangeReturnPeriod,valueReturnPeriod}) => {

    return(
        <Card>
                <CardBody className="CardBody p-0">
                  <Row className="p-1">
                    <Col md={8}>
                      <table className="table table-bordered summary-table">
                        <tbody>
                          <tr>
                            <td>
                              <p className="mb-0">
                                Invoices <br />
                                <span> {totalInvoice ? totalInvoice : 0}</span>
                              </p>
                            </td>

                            <td>
                              <p className="mb-0">
                                {" "}
                                Invoice Values (₹)
                                <br />
                                <span>
                                  {" "}
                                  {totalInvoiceValue ? totalInvoiceValue : 0}
                                </span>
                              </p>
                            </td>
                            <td>
                              <p className="mb-0">
                                Taxable Values{"  "} (₹)
                                <br />
                                <span>
                                  {totalTaxableValue ? totalTaxableValue : 0}
                                </span>
                              </p>
                            </td>

                            <td>
                              <p className="mb-0">
                                IGST (₹)
                                <br />
                                <span> {totalIGST ? totalIGST : 0}</span>
                              </p>
                            </td>
                            <td>
                              <p className="mb-0">
                                SGST (₹)
                                <br />
                                <span> {totalSGST ? totalSGST : 0}</span>
                              </p>
                            </td>
                            <td>
                              <p className="mb-0">
                                CGST (₹)
                                <br />
                                <span> {totalCGST ? totalCGST : 0}</span>
                              </p>
                            </td>
                            <td>
                              <p className="mb-0">
                                Cess (₹)
                                <br />
                                <span>{totalCess ? totalCess : 0}</span>
                              </p>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </Col>
                    <Col md={4}>
                      <Row>
                        <Col sm={6}>
                          <Label className="form-label">Invoice Type</Label>
                          <Select
                            id={id}
                            placeholder={placeholder}
                            theme={theme}
                            components={components}
                            options={options}
                            className={className}
                            classNamePrefix={classNamePrefix}
                            onChange={onChange}
                            isDisabled={isDisabled}
                            value={value}
                          />
                        </Col>
                        <Col sm={6}>
                          <Label className="form-label">
                            Select Return Period
                          </Label>
                          <Select
                            id={idReturnPeriod}
                            placeholder={placholderReturnPeriod}
                            isClearable={isClearable}
                            theme={theme}
                            closeMenuOnSelect={closeMenuOnSelect}
                            options={optionsReturnPeriod}
                            isDisabled={isDisabled}
                            className={className}
                            classNamePrefix={classNamePrefix}
                            components={components}
                            onChange={onChangeReturnPeriod}
                            value={valueReturnPeriod}
                          />
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
    )

}


export default TableCardDetails
