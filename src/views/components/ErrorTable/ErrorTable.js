import React from "react";
import { Table } from "reactstrap";

const ErrorTable = ({ errorDataList, mentionTableName = false }) => {
  const uniqueArray = [];
  const keys = new Set();

  for (const obj of errorDataList) {
    const key = JSON.stringify(obj);
    if (!keys.has(key)) {
      keys.add(key);
      uniqueArray.push(obj);
    }
  }

  const itemList =
    uniqueArray &&
    uniqueArray.map((item, i) => (
      <tr>
        <td>{i + 1}</td>
        {mentionTableName && <td>{item.tableName}</td>}
        <td>{item.rowNo + 1}</td>
        <td>Only Numeric Value Allowed</td>
      </tr>
    ));

  return (
    <div className="errorTable_container">
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Sr No</th>
            {mentionTableName && <th>Table Name</th>}
            <th>Row Number</th>
            <th>Error</th>
          </tr>
        </thead>
        <tbody>{itemList}</tbody>
      </Table>
    </div>
  );
};

export default ErrorTable;
