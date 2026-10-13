// src/mock/gstr1MockData.js
// Mock API responses for GSTR-1 routes and endpoints

export const mockGstr1SummaryData = [
  // Primary Sections (rows 0 - 10)
  {
    typeofInvoice: "4A, 4B, 4C, 6B, 6C - B2B Invoices",
    documentCount: "125",
    totalTaxableAmount: "12,45,600.00",
    igst: "1,12,104.00",
    cgst: "56,052.00",
    sgst: "56,052.00",
    cess: "0.00",
    totalTaxAmount: "2,24,208.00",
    typeofInvoiceId: "0"
  },
  {
    typeofInvoice: "5A, 5B - B2C (Large) Invoices",
    documentCount: "18",
    totalTaxableAmount: "4,50,000.00",
    igst: "81,000.00",
    cgst: "0.00",
    sgst: "0.00",
    cess: "0.00",
    totalTaxAmount: "81,000.00",
    typeofInvoiceId: "1"
  },
  {
    typeofInvoice: "6A - Exports Invoices",
    documentCount: "8",
    totalTaxableAmount: "8,90,500.00",
    igst: "1,60,290.00",
    cgst: "0.00",
    sgst: "0.00",
    cess: "0.00",
    totalTaxAmount: "1,60,290.00",
    typeofInvoiceId: "2"
  },
  {
    typeofInvoice: "7 - B2C (Others)",
    documentCount: "340",
    totalTaxableAmount: "6,20,450.00",
    igst: "18,400.00",
    cgst: "46,640.50",
    sgst: "46,640.50",
    cess: "1,200.00",
    totalTaxAmount: "1,12,881.00",
    typeofInvoiceId: "3"
  },
  {
    typeofInvoice: "8A, 8B, 8C, 8D - Nil Rated Supplies",
    documentCount: "42",
    totalTaxableAmount: "1,15,000.00",
    igst: "0.00",
    cgst: "0.00",
    sgst: "0.00",
    cess: "0.00",
    totalTaxAmount: "0.00",
    typeofInvoiceId: "4"
  },
  {
    typeofInvoice: "9B - Credit / Debit Notes (Registered)",
    documentCount: "12",
    totalTaxableAmount: "85,400.00",
    igst: "7,686.00",
    cgst: "3,843.00",
    sgst: "3,843.00",
    cess: "0.00",
    totalTaxAmount: "15,372.00",
    typeofInvoiceId: "5"
  },
  {
    typeofInvoice: "9B - Credit / Debit Notes (Unregistered)",
    documentCount: "3",
    totalTaxableAmount: "14,200.00",
    igst: "2,556.00",
    cgst: "0.00",
    sgst: "0.00",
    cess: "0.00",
    totalTaxAmount: "2,556.00",
    typeofInvoiceId: "6"
  },
  {
    typeofInvoice: "11A(1), 11A(2) - Tax Liability (Advances Received)",
    documentCount: "5",
    totalTaxableAmount: "50,000.00",
    igst: "4,500.00",
    cgst: "2,250.00",
    sgst: "2,250.00",
    cess: "0.00",
    totalTaxAmount: "9,000.00",
    typeofInvoiceId: "7"
  },
  {
    typeofInvoice: "11B(1), 11B(2) - Adjustment of Advances",
    documentCount: "4",
    totalTaxableAmount: "35,000.00",
    igst: "3,150.00",
    cgst: "1,575.00",
    sgst: "1,575.00",
    cess: "0.00",
    totalTaxAmount: "6,300.00",
    typeofInvoiceId: "8"
  },
  {
    typeofInvoice: "12 - HSN-wise Summary of Outward Supplies",
    documentCount: "48",
    totalTaxableAmount: "33,70,750.00",
    igst: "3,79,886.00",
    cgst: "1,08,785.50",
    sgst: "1,08,785.50",
    cess: "1,200.00",
    totalTaxAmount: "5,98,657.00",
    typeofInvoiceId: "9"
  },
  {
    typeofInvoice: "13 - Documents Issued",
    documentCount: "542",
    totalTaxableAmount: "0.00",
    igst: "0.00",
    cgst: "0.00",
    sgst: "0.00",
    cess: "0.00",
    totalTaxAmount: "0.00",
    typeofInvoiceId: "10"
  },

  // Amendment Data (rows 11+)
  {
    typeofInvoice: "9A - Amended B2B Invoices",
    documentCount: "4",
    totalTaxableAmount: "45,000.00",
    igst: "4,050.00",
    cgst: "2,025.00",
    sgst: "2,025.00",
    cess: "0.00",
    totalTaxAmount: "8,100.00",
    typeofInvoiceId: "11"
  },
  {
    typeofInvoice: "9A - Amended B2C (Large) Invoices",
    documentCount: "1",
    totalTaxableAmount: "28,000.00",
    igst: "5,040.00",
    cgst: "0.00",
    sgst: "0.00",
    cess: "0.00",
    totalTaxAmount: "5,040.00",
    typeofInvoiceId: "12"
  },
  {
    typeofInvoice: "9A - Amended Export Invoices",
    documentCount: "0",
    totalTaxableAmount: "0.00",
    igst: "0.00",
    cgst: "0.00",
    sgst: "0.00",
    cess: "0.00",
    totalTaxAmount: "0.00",
    typeofInvoiceId: "13"
  },
  {
    typeofInvoice: "9C - Amended Credit/Debit Notes (Registered)",
    documentCount: "2",
    totalTaxableAmount: "12,500.00",
    igst: "1,125.00",
    cgst: "562.50",
    sgst: "562.50",
    cess: "0.00",
    totalTaxAmount: "2,250.00",
    typeofInvoiceId: "14"
  },
  {
    typeofInvoice: "9C - Amended Credit/Debit Notes (Unregistered)",
    documentCount: "0",
    totalTaxableAmount: "0.00",
    igst: "0.00",
    cgst: "0.00",
    sgst: "0.00",
    cess: "0.00",
    totalTaxAmount: "0.00",
    typeofInvoiceId: "15"
  },
  {
    typeofInvoice: "10 - Amended B2C (Others)",
    documentCount: "6",
    totalTaxableAmount: "18,200.00",
    igst: "1,638.00",
    cgst: "819.00",
    sgst: "819.00",
    cess: "0.00",
    totalTaxAmount: "3,276.00",
    typeofInvoiceId: "16"
  },
  {
    typeofInvoice: "11B - Amended Tax Liability (Advances)",
    documentCount: "0",
    totalTaxableAmount: "0.00",
    igst: "0.00",
    cgst: "0.00",
    sgst: "0.00",
    cess: "0.00",
    totalTaxAmount: "0.00",
    typeofInvoiceId: "17"
  },
  {
    typeofInvoice: "11B - Amended Adjustment of Advances",
    documentCount: "0",
    totalTaxableAmount: "0.00",
    igst: "0.00",
    cgst: "0.00",
    sgst: "0.00",
    cess: "0.00",
    totalTaxAmount: "0.00",
    typeofInvoiceId: "18"
  }
];

export const mockGstr1Invoices = [
  {
    SupplierGSTIN: "24AAACG1234F1Z8",
    ReceiverName: "RELIANCE RETAIL LIMITED",
    InvoiceNumber: "INV-2023-001",
    InvoiceDate: "05-10-2023",
    InvoiceValue: "1,41,600.00",
    PlaceOfSupply: "24-Gujarat",
    SupplyAttractReverse: "No",
    InvoiceType: "Regular",
    Rate: "18.00",
    TotalTaxableAmount: "1,20,000.00",
    IntegratedTax: "0.00",
    CentralTax: "10,800.00",
    StateTax: "10,800.00",
    Cess: "0.00",
    TotalTaxAmount: "21,600.00"
  },
  {
    SupplierGSTIN: "27AABCT3521M1ZV",
    ReceiverName: "TATA CONSULTANCY SERVICES",
    InvoiceNumber: "INV-2023-002",
    InvoiceDate: "12-10-2023",
    InvoiceValue: "2,95,000.00",
    PlaceOfSupply: "27-Maharashtra",
    SupplyAttractReverse: "No",
    InvoiceType: "Regular",
    Rate: "18.00",
    TotalTaxableAmount: "2,50,000.00",
    IntegratedTax: "45,000.00",
    CentralTax: "0.00",
    StateTax: "0.00",
    Cess: "0.00",
    TotalTaxAmount: "45,000.00"
  },
  {
    SupplierGSTIN: "29AABCU9603R1ZX",
    ReceiverName: "INFOSYS TECHNOLOGIES LTD",
    InvoiceNumber: "INV-2023-003",
    InvoiceDate: "18-10-2023",
    InvoiceValue: "94,400.00",
    PlaceOfSupply: "29-Karnataka",
    SupplyAttractReverse: "No",
    InvoiceType: "Regular",
    Rate: "18.00",
    TotalTaxableAmount: "80,000.00",
    IntegratedTax: "14,400.00",
    CentralTax: "0.00",
    StateTax: "0.00",
    Cess: "0.00",
    TotalTaxAmount: "14,400.00"
  },
  {
    SupplierGSTIN: "07AAACW3456L1Z2",
    ReceiverName: "WIPRO ENTERPRISES",
    InvoiceNumber: "INV-2023-004",
    InvoiceDate: "22-10-2023",
    InvoiceValue: "1,88,800.00",
    PlaceOfSupply: "07-Delhi",
    SupplyAttractReverse: "No",
    InvoiceType: "Regular",
    Rate: "18.00",
    TotalTaxableAmount: "1,60,000.00",
    IntegratedTax: "28,800.00",
    CentralTax: "0.00",
    StateTax: "0.00",
    Cess: "0.00",
    TotalTaxAmount: "28,800.00"
  },
  {
    SupplierGSTIN: "24AAACL5821K1ZM",
    ReceiverName: "LARSEN & TOUBRO LTD",
    InvoiceNumber: "INV-2023-005",
    InvoiceDate: "26-10-2023",
    InvoiceValue: "4,24,800.00",
    PlaceOfSupply: "24-Gujarat",
    SupplyAttractReverse: "No",
    InvoiceType: "Regular",
    Rate: "18.00",
    TotalTaxableAmount: "3,60,000.00",
    IntegratedTax: "0.00",
    CentralTax: "32,400.00",
    StateTax: "32,400.00",
    Cess: "0.00",
    TotalTaxAmount: "64,800.00"
  }
];

export const mockGstr1Master = {
  status: 200,
  data: [
    { value: "0", label: "4A, 4B, 4C, 6B, 6C - B2B Invoices" },
    { value: "1", label: "5A, 5B - B2C (Large) Invoices" },
    { value: "2", label: "6A - Exports Invoices" },
    { value: "3", label: "7 - B2C (Others)" },
    { value: "4", label: "8A, 8B, 8C, 8D - Nil Rated Supplies" },
    { value: "5", label: "9B - Credit / Debit Notes (Registered)" },
    { value: "6", label: "9B - Credit / Debit Notes (Unregistered)" },
    { value: "7", label: "11A(1), 11A(2) - Tax Liability (Advances Received)" },
    { value: "8", label: "11B(1), 11B(2) - Adjustment of Advances" },
    { value: "9", label: "12 - HSN-wise Summary of Outward Supplies" },
    { value: "10", label: "13 - Documents Issued" }
  ]
};

export default {
  mockGstr1SummaryData,
  mockGstr1Invoices,
  mockGstr1Master
};
