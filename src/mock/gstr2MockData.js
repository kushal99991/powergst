// src/mock/gstr2MockData.js
// Mock API responses for GSTR-2 / GSTR-2B routes and summary/drilldown

export const mockGstr2bSummaryData = [
  {
    Summary: {
      ITC: [
        {
          SrNo: "1",
          Heading: "Part A - ITC Available",
          SectionName: "",
          IGST: "",
          CGST: "",
          SGST: "",
          Cess: "",
          IsClickable: true,
          GSTR2BSummaryId: 0,
          RowCount: 0,
          SectionId: 0
        },
        {
          SrNo: "I",
          Heading: "All other ITC - Supplies from registered persons",
          SectionName: "Table 4(A)(5)",
          IGST: "2,45,800.00",
          CGST: "1,12,400.00",
          SGST: "1,12,400.00",
          Cess: "0.00",
          IsClickable: false,
          GSTR2BSummaryId: 1,
          RowCount: 145,
          SectionId: 1
        },
        {
          SrNo: "II",
          Heading: "Inward supplies from ISD",
          SectionName: "Table 4(A)(4)",
          IGST: "18,500.00",
          CGST: "0.00",
          SGST: "0.00",
          Cess: "0.00",
          IsClickable: false,
          GSTR2BSummaryId: 2,
          RowCount: 4,
          SectionId: 2
        },
        {
          SrNo: "III",
          Heading: "Inward supplies liable to reverse charge",
          SectionName: "Table 4(A)(3)",
          IGST: "12,200.00",
          CGST: "6,100.00",
          SGST: "6,100.00",
          Cess: "0.00",
          IsClickable: false,
          GSTR2BSummaryId: 3,
          RowCount: 9,
          SectionId: 3
        },
        {
          SrNo: "IV",
          Heading: "Import of goods from overseas on bill of entry",
          SectionName: "Table 4(A)(1)",
          IGST: "95,000.00",
          CGST: "0.00",
          SGST: "0.00",
          Cess: "5,000.00",
          IsClickable: false,
          GSTR2BSummaryId: 4,
          RowCount: 2,
          SectionId: 4
        },
        {
          SrNo: "V",
          Heading: "Import of goods from SEZ units / developers",
          SectionName: "Table 4(A)(1)",
          IGST: "35,400.00",
          CGST: "0.00",
          SGST: "0.00",
          Cess: "0.00",
          IsClickable: false,
          GSTR2BSummaryId: 5,
          RowCount: 1,
          SectionId: 5
        }
      ],
      NonITC: [
        {
          SrNo: "1",
          Heading: "Part B - ITC Not Available",
          SectionName: "",
          IGST: "",
          CGST: "",
          SGST: "",
          Cess: "",
          IsClickable: true,
          GstR2BSummaryId: 0,
          RowCount: 0,
          SectionId: 0
        },
        {
          SrNo: "I",
          Heading: "All other ITC - Supplies from registered persons",
          SectionName: "Table 4(B)(2)",
          IGST: "14,500.00",
          CGST: "7,250.00",
          SGST: "7,250.00",
          Cess: "0.00",
          IsClickable: false,
          GstR2BSummaryId: 6,
          RowCount: 5,
          SectionId: 6
        },
        {
          SrNo: "II",
          Heading: "Inward supplies liable to reverse charge",
          SectionName: "Table 4(B)(2)",
          IGST: "0.00",
          CGST: "0.00",
          SGST: "0.00",
          Cess: "0.00",
          IsClickable: false,
          GstR2BSummaryId: 7,
          RowCount: 0,
          SectionId: 7
        }
      ]
    },
    ITCAvailable: {
      B2BInvoice: [
        {
          SupplierGSTIN: "27AAACB2188G1ZQ",
          SupplierTradeName: "BHARTI AIRTEL LIMITED",
          InvoiceNo: "INV-OCT-8891",
          InvoiceType: "Regular",
          NoteType: "-",
          InvoiceDate: "04-10-2023",
          InvoiceValue: "59,000.00",
          PlaceOfSupply: "27-Maharashtra",
          SupplyAttractReverse: "No",
          Rate: "18.00",
          TaxableValue: "50,000.00",
          IGST: "9,000.00",
          CGST: "0.00",
          SGST: "0.00",
          Cess: "0.00",
          GstR1Period: "102023",
          GstR1FilingDate: "11-11-2023",
          ITCAvailable: "Yes",
          Reason: "",
          TaxRate: "18.00",
          Source: "GSTR-2B",
          IRNNumber: "a8f7c9e03d4b2...890",
          IRNDate: "04-10-2023"
        },
        {
          SupplierGSTIN: "24AABCS1429B1ZT",
          SupplierTradeName: "SUN PHARMACEUTICAL INDUSTRIES LTD",
          InvoiceNo: "SPI-2023-4412",
          InvoiceType: "Regular",
          NoteType: "-",
          InvoiceDate: "09-10-2023",
          InvoiceValue: "1,18,000.00",
          PlaceOfSupply: "24-Gujarat",
          SupplyAttractReverse: "No",
          Rate: "18.00",
          TaxableValue: "1,00,000.00",
          IGST: "0.00",
          CGST: "9,000.00",
          SGST: "9,000.00",
          Cess: "0.00",
          GstR1Period: "102023",
          GstR1FilingDate: "10-11-2023",
          ITCAvailable: "Yes",
          Reason: "",
          TaxRate: "18.00",
          Source: "GSTR-2B",
          IRNNumber: "d3e1b7c9f8021...456",
          IRNDate: "09-10-2023"
        },
        {
          SupplierGSTIN: "06AAACI1681G1ZM",
          SupplierTradeName: "INDUSIND BANK LIMITED",
          InvoiceNo: "IBL/OCT/2023/102",
          InvoiceType: "Regular",
          NoteType: "-",
          InvoiceDate: "15-10-2023",
          InvoiceValue: "23,600.00",
          PlaceOfSupply: "06-Haryana",
          SupplyAttractReverse: "No",
          Rate: "18.00",
          TaxableValue: "20,000.00",
          IGST: "3,600.00",
          CGST: "0.00",
          SGST: "0.00",
          Cess: "0.00",
          GstR1Period: "102023",
          GstR1FilingDate: "11-11-2023",
          ITCAvailable: "Yes",
          Reason: "",
          TaxRate: "18.00",
          Source: "GSTR-2B",
          IRNNumber: "",
          IRNDate: ""
        }
      ],
      B2BDebitNote: [],
      B2BAInvoice: [],
      B2BADebitNote: [],
      ISDInvoice: [],
      ISDAInvoice: [],
      IMPG: [],
      IMPGA: [],
      IMPGSEZ: []
    },
    ITCNotAvailable: {
      B2BInvoice: [
        {
          SupplierGSTIN: "29AAACK2981M1ZX",
          SupplierTradeName: "HOTEL ROYAL ORCHID LTD",
          InvoiceNo: "RO/OCT/554",
          InvoiceType: "Regular",
          NoteType: "-",
          InvoiceDate: "14-10-2023",
          InvoiceValue: "17,700.00",
          PlaceOfSupply: "29-Karnataka",
          SupplyAttractReverse: "No",
          Rate: "18.00",
          TaxableValue: "15,000.00",
          IGST: "2,700.00",
          CGST: "0.00",
          SGST: "0.00",
          Cess: "0.00",
          GstR1Period: "102023",
          GstR1FilingDate: "11-11-2023",
          ITCAvailable: "No",
          Reason: "POS is out of state for restaurant/stay services",
          TaxRate: "18.00",
          Source: "GSTR-2B"
        }
      ],
      B2BDebitNote: [],
      B2BAInvoice: [],
      B2BADebitNote: []
    }
  }
];

export const mockGstr2bPaginationResponse = {
  status: 200,
  data: {
    itcEligibility: [
      { label: "All", value: "" },
      { label: "Yes", value: "1" },
      { label: "No", value: "0" }
    ],
    reverseCharge: [
      { label: "All", value: "" },
      { label: "Yes", value: "Y" },
      { label: "No", value: "N" }
    ],
    sectionList: [
      { label: "B2B - Invoices", value: "1" },
      { label: "B2BA - Amended Invoices", value: "2" },
      { label: "CDNR - Credit/Debit Notes", value: "3" },
      { label: "ISD - Inward supplies", value: "4" },
      { label: "IMPG - Import of Goods", value: "5" }
    ],
    rate: [
      { label: "0%", value: "0.00" },
      { label: "5%", value: "5.00" },
      { label: "12%", value: "12.00" },
      { label: "18%", value: "18.00" },
      { label: "28%", value: "28.00" }
    ],
    noteType: [
      { label: "Credit Note", value: "C" },
      { label: "Debit Note", value: "D" }
    ],
    pos: [
      { label: "24-Gujarat", value: "24" },
      { label: "27-Maharashtra", value: "27" },
      { label: "29-Karnataka", value: "29" },
      { label: "07-Delhi", value: "07" }
    ],
    invoiceType: [
      { label: "Regular", value: "R" },
      { label: "SEZ with payment", value: "SEWP" },
      { label: "SEZ without payment", value: "SEWOP" },
      { label: "Deemed Export", value: "DE" }
    ],
    summaryData: [
      {
        SupplierGSTIN: "27AAACB2188G1ZQ",
        SupplierTradeName: "BHARTI AIRTEL LIMITED",
        InvoiceNo: "INV-OCT-8891",
        InvoiceType: "Regular",
        NoteType: "-",
        InvoiceDate: "04-10-2023",
        InvoiceValue: "59,000.00",
        PlaceOfSupply: "27-Maharashtra",
        SupplyAttractReverse: "No",
        Rate: "18.00",
        TaxableValue: "50,000.00",
        IGST: "9,000.00",
        CGST: "0.00",
        SGST: "0.00",
        Cess: "0.00",
        GstR1Period: "102023",
        GstR1FilingDate: "11-11-2023",
        ITCAvailable: "Yes",
        Reason: "",
        TaxRate: "18.00",
        Source: "GSTR-2B"
      },
      {
        SupplierGSTIN: "24AABCS1429B1ZT",
        SupplierTradeName: "SUN PHARMACEUTICAL INDUSTRIES LTD",
        InvoiceNo: "SPI-2023-4412",
        InvoiceType: "Regular",
        NoteType: "-",
        InvoiceDate: "09-10-2023",
        InvoiceValue: "1,18,000.00",
        PlaceOfSupply: "24-Gujarat",
        SupplyAttractReverse: "No",
        Rate: "18.00",
        TaxableValue: "1,00,000.00",
        IGST: "0.00",
        CGST: "9,000.00",
        SGST: "9,000.00",
        Cess: "0.00",
        GstR1Period: "102023",
        GstR1FilingDate: "10-11-2023",
        ITCAvailable: "Yes",
        Reason: "",
        TaxRate: "18.00",
        Source: "GSTR-2B"
      }
    ]
  }
};

export default {
  mockGstr2bSummaryData,
  mockGstr2bPaginationResponse
};
