import { createApi } from "@/redux/utils/createApi";
import type { ApiResponse } from "./apiResponse";
import { baseQueryWithReauth } from "./baseQueryWithReauth";

export interface PaymentLead {
  buildingType?: string;
  location?: string;
}

export interface PaymentLineItem {
  images?: string[];
  items?: string[];
  rate?: number;
  markup?: number;
  quantity?: number;
  tax?: number;
  total?: number;
  _id?: string;
}

export interface PaymentItemDetail {
  _id: string;
  leadId: string;
  customerId: string;
  quotationId: string | null;
  invoiceNumber: string;
  date: string;
  paymentScheduleId: string | null;
  daysToPay: number | null;
  poNumber: string;
  subtotal: number;
  markupTotal: number;
  discount: number;
  depositAmount: number;
  totalAmount: number;
  status: string;
  sentAt: string | null;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
  lead?: PaymentLead;
  lineItems?: PaymentLineItem[];
}

export interface PaymentsResponseData {
  upcoming: PaymentItemDetail[];
  overdue: PaymentItemDetail[];
  paid: PaymentItemDetail[];
}

export type GetPaymentsApiResponse = ApiResponse<PaymentsResponseData>;

export interface InvoiceProjectLead {
  _id: string;
  buildingType?: string;
  location?: string;
  lifecycleStatus?: string;
}

export interface InvoiceLineItem {
  images?: string[];
  items?: string[];
  rate: number;
  markup: number;
  quantity: number;
  tax: number;
  total: number;
  _id: string;
  effectiveRate?: number;
  markupAmount?: number;
  taxAmount?: number;
}

export interface InvoiceDetail {
  _id: string;
  leadId: string;
  customerId: string;
  quotationId: string | null;
  invoiceNumber: string;
  date: string;
  paymentScheduleId: string | null;
  paymentScheduleStageId?: string | null;
  daysToPay: number;
  dueDate: string;
  poNumber: string;
  lineItems: InvoiceLineItem[];
  subtotal: number;
  markupTotal: number;
  discount: number;
  depositAmount: number;
  totalAmount: number;
  status: string;
  sentAt: string | null;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentScheduleStage {
  _id?: string;
  stageName?: string | null;
  amount?: number | null;
  amountType?: "percentage" | "fixed" | string | null;
  dueDate?: string | null;
  status?: string | null;
  invoiceId?: string | null;
}

export interface PaymentScheduleDocument {
  _id: string;
  leadId?: string | null;
  customerId?: string | null;
  totalAmount?: number | null;
  stages?: PaymentScheduleStage[] | null;
}

export interface InvoiceDetailResponseData {
  invoice: InvoiceDetail;
  paymentSchedule?: PaymentScheduleDocument | null;
}

export type InvoiceDetailApiResponse = ApiResponse<InvoiceDetailResponseData>;

export interface InvoiceProject {
  lead?: InvoiceProjectLead;
  invoices: InvoiceDetail[];
  projectTotal: number;
  projectPaid: number;
  projectPending: number;
}

export interface InvoicesResponseData {
  projects: InvoiceProject[];
}

export type GetInvoicesApiResponse = ApiResponse<InvoicesResponseData>;

export interface UpcomingInvoiceDue {
  _id: string;
  totalAmount: number;
  dueDate: string;
  status: string;
}

export interface InvoiceStatsBreakdown {
  totalInvoiced: number;
  paid: number;
  pending: number;
  overdue: number;
  invoiceCount: number;
}

export interface InvoiceStatsResponseData {
  totalProjectValue: number;
  pendingAmount: number;
  amountPaid: number;
  upcomingInvoiceDue: UpcomingInvoiceDue | null;
  breakdown: InvoiceStatsBreakdown;
}

export type GetInvoiceStatsApiResponse = ApiResponse<InvoiceStatsResponseData>;

export const paymentsApi = createApi({
  reducerPath: "paymentsApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getPayments: builder.query<PaymentsResponseData, void>({
      query: () => ({
        url: "/api/customer/payments",
        method: "GET",
      }),
      transformResponse: (response: GetPaymentsApiResponse) =>
        response.data as GetPaymentsApiResponse["data"],
    }),
    getInvoices: builder.query<InvoicesResponseData, void>({
      query: () => ({
        url: "/api/customer/payments/invoices",
        method: "GET",
      }),
      transformResponse: (response: GetInvoicesApiResponse) =>
        response.data as InvoicesResponseData,
    }),
    getInvoiceDetail: builder.query<InvoiceDetailResponseData, string>({
      query: (invoiceId) => ({
        url: `/api/invoices/${invoiceId}`,
        method: "GET",
      }),
      transformResponse: (response: InvoiceDetailApiResponse) =>
        response.data as InvoiceDetailResponseData,
    }),
    getInvoiceStats: builder.query<InvoiceStatsResponseData, void>({
      query: () => ({
        url: "/api/customer/payments/invoice-stats",
        method: "GET",
      }),
      transformResponse: (response: GetInvoiceStatsApiResponse) =>
        response.data as InvoiceStatsResponseData,
    }),
  }),
});

export const {
  useGetPaymentsQuery,
  useGetInvoicesQuery,
  useGetInvoiceDetailQuery,
  useGetInvoiceStatsQuery,
} = paymentsApi;


