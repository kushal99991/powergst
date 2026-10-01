// Part 2 Table(4-5) Column And Data
const table4Column = [
  {
    title: "",
    data: "serialNumber",
    width: 35,
    readOnly: true
  },
  {
    title: "Nature of Supplies",
    data: "natureOfSupplies",
    readOnly: true
  },
  {
    title: "Taxable Value",
    data: "taxableValue",
    type: "numeric",
    numericFormat: {
      pattern: '0,0.00',
      culture: 'en-IN'
    },
  },
  {
    title: "Integrated Tax",
    data: "igst",
    type: "numeric",
    numericFormat: {
      pattern: '0,0.00',
      culture: 'en-IN'
    },
  },
  {
    title: "Central Tax",
    data: "cgst",
    type: "numeric",
    numericFormat: {
      pattern: '0,0.00',
      culture: 'en-IN'
    },
  },
  {
    title: "State/UT Tax",
    data: "sgst",
    type: "numeric",
    numericFormat: {
      pattern: '0,0.00',
      culture: 'en-IN'
    },
  },
  {
    title: "Cess",
    data: "cess",
    type: "numeric",
    numericFormat: {
      pattern: '0,0.00',
      culture: 'en-IN'
    },
  },
  {
    title: "Notes",
    data: "notes",
  }
];

const table5Column = [
  {
    title: "",
    data: "serialNumber",
    readOnly: true
    // width: 35
  },
  {
    title: "Nature of Supplies",
    data: "natureOfSupplies",
    width: '270px',
    readOnly: 'true'
  },
  {
    title: "Taxable Value (₹)",
    data: "taxableValue",
    type: "numeric",
    numericFormat: {
      pattern: '0,0.00',
      culture: 'en-IN'
    },
  },
  {
    title: "Integrated Tax (₹)",
    data: "igst",
    type: "numeric",
    numericFormat: {
      pattern: '0,0.00',
      culture: 'en-IN'
    },
  },
  {
    title: "Central Tax (₹)",
    data: "cgst",
    type: "numeric",
    numericFormat: {
      pattern: '0,0.00',
      culture: 'en-IN'
    },
  },
  {
    title: "State/UT Tax (₹)",
    data: "sgst",
    type: "numeric",
    numericFormat: {
      pattern: '0,0.00',
      culture: 'en-IN'
    },
  },
  {
    title: "Cess (₹)",
    data: "cess",
    type: "numeric",
    numericFormat: {
      pattern: '0,0.00',
      culture: 'en-IN'
    },
  },
  {
    title: "Notes",
    data: "notes",
  }
];

// Part 3 Table Column 6,7,8
const part3Table6 = [
  {
    title: "",
    data: "serialNumber",
    width: 35,
    readOnly: true
  },
  {
    title: "Description",
    data: "description",
    width: 200,
    readOnly: true
  },
  {
    title: "Type",
    data: "type",
    readOnly: true
  },
  {
    title: "Integrated Tax",
    data: "igst",
    type: "numeric",
    numericFormat: {
      pattern: '0.00'
    },
  },
  {
    title: "Central Tax",
    data: "cgst",
    type: "numeric",
    numericFormat: {
      pattern: '0.00'
    },
  },
  {
    title: "State/UT Tax",
    data: "sgst",
    type: "numeric",
    numericFormat: {
      pattern: '0.00'
    },
  },
  {
    title: "Cess",
    data: "cess",
    type: "numeric",
    numericFormat: {
      pattern: '0.00'
    },
  },
  {
    title: "Notes",
    data: "notes",
  }
];

const part3Table7 = [
  {
    title: "",
    data: "serialNumber",
    width: 35,
    readOnly: true
  },
  {
    title: "Description",
    data: "description",
    readOnly: true,
    width: 350,
  },
  {
    title: "Integrated Tax",
    data: "igst",
    type: "numeric",
    numericFormat: {
      pattern: '0.00'
    },
  },
  {
    title: "Central Tax",
    data: "cgst",
    type: "numeric",
    numericFormat: {
      pattern: '0.00'
    },
  },
  {
    title: "State/UT Tax",
    data: "sgst",
    type: "numeric",
    numericFormat: {
      pattern: '0.00'
    },
  },
  {
    title: "Cess",
    data: "cess",
    type: "numeric",
    numericFormat: {
      pattern: '0.00'
    },
  },
  {
    title: "Notes",
    data: "notes",
  }
];

const part3Table8 = [
  {
    title: "",
    data: "serialNumber",
    width: 35,
    readOnly: true
  },
  {
    title: "Description",
    data: "description",
    width: 200,
    readOnly: true
  },
  {
    title: "Integrated Tax",
    data: "igst",
    type: "numeric",
    numericFormat: {
      pattern: '0.00'
    },
  },
  {
    title: "Central Tax",
    data: "cgst",
    type: "numeric",
    numericFormat: {
      pattern: '0.00'
    },
  },
  {
    title: "State/UT Tax",
    data: "sgst",
    type: "numeric",
    numericFormat: {
      pattern: '0.00'
    },
  },
  {
    title: "Cess",
    data: "cess",
    type: "numeric",
    numericFormat: {
      pattern: '0.00'
    },
  },
  {
    title: "Notes",
    data: "notes",
  }
];


// Part 5 Table Column  10,14 

const part5Table10 = [
  {
    title: "",
    data: "serialNumber",
    width: 35,
    readOnly: 'true'
  },
  {
    title: "Description",
    data: "description",
    readOnly: 'true'
  },
  {
    title: "Taxable Value",
    data: "taxableValue",
    type: "numeric",
    numericFormat: {
      pattern: '0.00'
    },
  },
  {
    title: "Integrated Tax",
    data: "igst",
    type: "numeric",
    numericFormat: {
      pattern: '0.00'
    },
  },
  {
    title: "Central Tax",
    data: "cgst",
    type: "numeric",
    numericFormat: {
      pattern: '0.00'
    },
  },
  {
    title: "State/UT Tax",
    data: "sgst",
    type: "numeric",
    numericFormat: {
      pattern: '0.00'
    },
  },
  {
    title: "Cess",
    data: "cess",
    type: "numeric",
    numericFormat: {
      pattern: '0.00'
    },
  },
  {
    title: "Notes",
    data: "notes",
  }
];

const part5Table14 = [
  {
    title: "Description",
    data: "description",
    readOnly: 'true'
  },
  {
    title: "Tax Payable",
    data: "taxPayable",
    type: "numeric",
    numericFormat: {
      pattern: '0.00'
    },
  },
  {
    title: "Tax Paid",
    data: "taxPaid",
    type: "numeric",
    numericFormat: {
      pattern: '0.00'
    },
  },
  {
    title: "Notes",
    data: "notes",
  }
];

// Part-4 Table9 Column And Data
const table9Column = [
  {
    title: "Description",
    data: "description",
    readOnly: 'true'
    // width: 35
  },
  {
    title: "Tax Payable (₹)",
    data: "taxPayable",
    width: '270px',

  },
  {
    title: "Paid through Cash (₹)",
    data: "cash",
  },
  {
    title: "Paid through ITC- IGST (₹)",
    data: "igst",
  },
  {
    title: "Paid through ITC- CGST (₹)",
    data: "cgst",
  },
  {
    title: "Paid through ITC- SGST (₹)",
    data: "sgst",
  },
  {
    title: "Cess (₹)",
    data: "cess",
  },
  {
    title: "Notes",
    data: "notes",
  }
];
const table9Data = [
  {
    description: 'Integrated Tax',
    taxPayable: '-',
    cash: '-',
    integratedTax: '-',
    centralTax: '-',
    stateUTtax: '-',
    cess: '-',
    notes: '-'
  },
  {
    description: 'Central Tax',
    taxPayable: '-',
    cash: '-',
    integratedTax: '-',
    centralTax: '-',
    stateUTtax: '-',
    cess: '-',
    notes: '-'
  },
  {
    description: 'State/UT Tax',
    taxPayable: '-',
    cash: '-',
    integratedTax: '-',
    centralTax: '-',
    stateUTtax: '-',
    cess: '-',
    notes: '-'
  },
  {
    description: 'Cess',
    taxPayable: '-',
    cash: '-',
    integratedTax: '-',
    centralTax: '-',
    stateUTtax: '-',
    cess: '-',
    notes: '-'
  },
  {
    description: 'Interest',
    taxPayable: '-',
    cash: '-',
    integratedTax: '-',
    centralTax: '-',
    stateUTtax: '-',
    cess: '-',
    notes: '-'
  },
  {
    description: 'Late Fee',
    taxPayable: '-',
    cash: '-',
    integratedTax: '-',
    centralTax: '-',
    stateUTtax: '-',
    cess: '-',
    notes: '-'
  },
  {
    description: 'Penalty',
    taxPayable: '-',
    cash: '-',
    integratedTax: '-',
    centralTax: '-',
    stateUTtax: '-',
    cess: '-',
    notes: '-'
  },
  {
    description: 'Others',
    taxPayable: '-',
    cash: '-',
    integratedTax: '-',
    centralTax: '-',
    stateUTtax: '-',
    cess: '-',
    notes: '-'
  }
];

// Part-6 Table(15-16-17-18-19)  Column And Data
const table15Column = [
  {
    title: '',
    data: 'serialNumber',
    width: 35,
    readOnly: 'true'
  },
  {
    title: "Details",
    data: "details",
    readOnly: 'true'
  },
  {
    title: "Integrated Tax (₹)",
    data: "igst",
  },
  {
    title: "Central Tax (₹)",
    data: "cgst",
  },
  {
    title: "State/UT Tax (₹)",
    data: "sgst",
  },
  {
    title: "Cess (₹)",
    data: "cess",
  },
  {
    title: "Interest (₹)",
    data: "interest",
  },
  {
    title: "Penalty (₹)",
    data: "penalty",
  },
  {
    title: "Late Fee/Others (₹)",
    data: "lateFeeOrOthers",
  },
  {
    title: "Notes",
    data: "notes",
  }
];

//Table-16
const table16Column = [
  {
    title: '',
    data: 'serialNumber',
    width: 35,
    readOnly: 'true'
  },
  {
    title: "Details",
    data: "details",
    readOnly: 'true'
  },
  {
    title: "Taxable Value (₹)",
    data: "taxableValue"
  },
  {
    title: "Integrated Tax (₹)",
    data: "igst",
  },
  {
    title: "Central Tax (₹)",
    data: "cgst",
  },
  {
    title: "State/UT Tax (₹)",
    data: "sgst",
  },
  {
    title: "Cess (₹)",
    data: "cess",
  },
  {
    title: "Notes",
    data: "notes",
  }
];

//Table-17
const table17Column = [
  {
    title: 'Code',
    data: 'code'
  },
  {
    title: "UQC",
    data: "uqc"
  },
  {
    title: "Total Quantity",
    data: "totalQuantity"
  },
  {
    title: "Taxable Value (₹)",
    data: "taxableValue"
  },
  {
    title: "Rate of Tax",
    data: "rate"
  },
  {
    title: "Integrated Tax (₹)",
    data: "igst",
  },
  {
    title: "Central Tax (₹)",
    data: "cgst",
  },
  {
    title: "State/UT Tax (₹)",
    data: "sgst",
  },
  {
    title: "Cess (₹)",
    data: "cess",
  },
  {
    title: "Notes",
    data: "notes",
  },
  {
    title: "Actions",
    data: "actions",
  }
];

//Table-18
const table18Column = [
  {
    title: 'Code',
    data: 'code'
  },
  {
    title: "UQC",
    data: "uqc"
  },
  {
    title: "Total Quantity",
    data: "totalQuantity"
  },
  {
    title: "Taxable Value (₹)",
    data: "taxableValue"
  },
  {
    title: "Rate of Tax",
    data: "rate"
  },
  {
    title: "Integrated Tax (₹)",
    data: "igst",
  },
  {
    title: "Central Tax (₹)",
    data: "cgst",
  },
  {
    title: "State/UT Tax (₹)",
    data: "sgst",
  },
  {
    title: "Cess (₹)",
    data: "cess",
  },
  {
    title: "Notes",
    data: "notes",
  },
  {
    title: "Actions",
    data: "actions",
  }
];

//Table-19
const table19Column = [
  {
    title: '',
    data: 'serialNumber',
    readOnly: 'true',
    width: 15
  },
  {
    title: "Description",
    data: "description",
    readOnly: 'true'
  },
  {
    title: "Payable (₹)",
    data: "payable"
  },
  {
    title: "Paid (₹)",
    data: "paid"
  },
  {
    title: "Notes",
    data: "notes",
  }
];

export { table4Column, table5Column, table9Column, table9Data, table15Column, table16Column, table17Column, table18Column, table19Column, part3Table6, part3Table7, part3Table8, part5Table10, part5Table14 }

