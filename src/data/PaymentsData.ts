export interface PaymentItem {
  id: string;
  projectName: string;
  dueDate: string;
  amount: string;
  overdueFrom?: string;
}

export interface PaymentHistoryItem {
  transactionId: string;
  projectName: string;
  paymentDate: string;
  amount: string;
  tax: string;
  mode: string;
  status: "Paid" | "Pending" | "Failed";
}

export interface InvoiceListItem {
  invoiceId: string;
  projectName: string;
  milestone: string;
  amount: string;
  invoiceDate: string;
  status: "Paid" | "Pending" | "Failed";
}

export const upcomingPayments: PaymentItem[] = [
  {
    id: "TXN784923",
    projectName: "ABC Logistic Warehouse",
    dueDate: "23-Mar-2025",
    amount: "$40,000",
    overdueFrom: "15 Aug 2025",
  },
];

export const overduePayments: PaymentItem[] = [
  {
    id: "TXN784923",
    projectName: "ABC Logistic Warehouse",
    dueDate: "10-Jan-2025",
    amount: "$10,000",
    overdueFrom: "15 Aug 2025",
  },
];

export const paymentHistory: PaymentHistoryItem[] = [
  {
    transactionId: "INV-557",
    projectName: "ABC Logistic Warehouse",
    paymentDate: "10-Jan-2025",
    amount: "$10,000",
    tax: "$200",
    mode: "Paypal",
    status: "Paid",
  },
  {
    transactionId: "INV-557",
    projectName: "ABC Logistic Warehouse",
    paymentDate: "10-Jan-2025",
    amount: "$10,000",
    tax: "$200",
    mode: "Paypal",
    status: "Paid",
  },
  {
    transactionId: "INV-557",
    projectName: "ABC Logistic Warehouse",
    paymentDate: "10-Jan-2025",
    amount: "$10,000",
    tax: "$200",
    mode: "Paypal",
    status: "Paid",
  },
  {
    transactionId: "INV-557",
    projectName: "ABC Logistic Warehouse",
    paymentDate: "10-Jan-2025",
    amount: "$10,000",
    tax: "$200",
    mode: "Paypal",
    status: "Paid",
  },
  {
    transactionId: "INV-557",
    projectName: "ABC Logistic Warehouse",
    paymentDate: "10-Jan-2025",
    amount: "$10,000",
    tax: "$200",
    mode: "Paypal",
    status: "Paid",
  },
  {
    transactionId: "INV-557",
    projectName: "ABC Logistic Warehouse",
    paymentDate: "10-Jan-2025",
    amount: "$10,000",
    tax: "$200",
    mode: "Paypal",
    status: "Paid",
  },
  {
    transactionId: "INV-557",
    projectName: "ABC Logistic Warehouse",
    paymentDate: "10-Jan-2025",
    amount: "$10,000",
    tax: "$200",
    mode: "Paypal",
    status: "Paid",
  },
];

export const invoiceList: InvoiceListItem[] = [
  {
    invoiceId: "INV-557",
    projectName: "ABC Logistic Warehouse",
    milestone: "Fabrication Stage",
    amount: "$10,000",
    invoiceDate: "10-Jan-2025",
    status: "Paid",
  },
  {
    invoiceId: "INV-557",
    projectName: "ABC Logistic Warehouse",
    milestone: "Fabrication Stage",
    amount: "$10,000",
    invoiceDate: "10-Jan-2025",
    status: "Paid",
  },
  {
    invoiceId: "INV-557",
    projectName: "ABC Logistic Warehouse",
    milestone: "Fabrication Stage",
    amount: "$10,000",
    invoiceDate: "10-Jan-2025",
    status: "Paid",
  },
];

export interface TaxReportItem {
  date: string;
  buildingType: string;
  city: string;
  taxId: string;
  state: string;
  zip: string;
  taxRate: string;
  contractAmount: string;
  taxDue: string;
}

export const taxReportList: TaxReportItem[] = [
  {
    date: "1/15/2024",
    buildingType: "PEMB",
    city: "Houston",
    taxId: "2564",
    state: "TX",
    zip: "55645",
    taxRate: "8.25%",
    contractAmount: "$45,000",
    taxDue: "$3,712.5",
  },
  {
    date: "1/18/2024",
    buildingType: "Storage",
    city: "Des Moines",
    taxId: "2564",
    state: "TX",
    zip: "55645",
    taxRate: "6%",
    contractAmount: "$32,000",
    taxDue: "$1,920",
  },
  {
    date: "1/22/2024",
    buildingType: "Shed",
    city: "Baton Rouge",
    taxId: "2564",
    state: "TX",
    zip: "55645",
    taxRate: "9.45%",
    contractAmount: "$28,500",
    taxDue: "$2,693.25",
  },
  {
    date: "1/25/2024",
    buildingType: "Commercial",
    city: "Dallas",
    taxId: "2564",
    state: "TX",
    zip: "55645",
    taxRate: "8.25%",
    contractAmount: "$67,000",
    taxDue: "$5,527.5",
  },
  {
    date: "1/28/2024",
    buildingType: "PEMB",
    city: "Omaha",
    taxId: "2564",
    state: "TX",
    zip: "55645",
    taxRate: "5.5%",
    contractAmount: "$38,000",
    taxDue: "$2,090",
  },
  {
    date: "1/30/2024",
    buildingType: "Storage",
    city: "Oklahoma City",
    taxId: "2564",
    state: "TX",
    zip: "55645",
    taxRate: "4.5%",
    contractAmount: "$41,000",
    taxDue: "$1,845",
  },
];
