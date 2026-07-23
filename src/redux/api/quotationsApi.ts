import { createApi } from "@/redux/utils/createApi";
import type { ApiResponse } from "./apiResponse";
import { baseQueryWithReauth } from "./baseQueryWithReauth";

export interface QuotationSummaryProject {
  leadId: string;
  projectName: string;
  jobId: string;
  location: string;
  newQuotation: number;
  pendingApproval: number;
  approved: number;
}

export interface GetQuotationsSummaryResponseData {
  projects: QuotationSummaryProject[];
}

export type GetQuotationsSummaryApiResponse = ApiResponse<GetQuotationsSummaryResponseData>;

export interface QuotationLineItem {
  coilType: string;
  lengthFeet: number;
  quantity: number;
  color: string;
  unitPrice: number;
  amount: number;
}

export interface QuotationSummaryDetails {
  totalCoilTypes: number;
  totalLength: number;
  totalQuantity: number;
}

export interface QuotationDetailsOrderInfo {
  _id: string;
  requestId: string;
  requestDate: string;
}

export interface QuotationDetailsLeadInfo {
  _id: string;
  location: string;
  jobId: string;
  projectName: string;
}

export interface OrderQuotationDetailsData {
  quotation: {
    _id: string;
    quotationNumber: string;
    orderId?: QuotationDetailsOrderInfo | string;
    leadId?: QuotationDetailsLeadInfo | string;
    customerId?: string;
    buildingLabel: string;
    sellerName: string;
    sellerAddress: string;
    sellerEmail: string;
    lineItems: QuotationLineItem[];
    subtotal: number;
    tax: number;
    freight: number;
    totalValue: number;
    paymentMethods: string[];
    status: string;
    respondedAt?: string;
    rejectionReason?: string;
    createdBy?: string;
    sentAt?: string;
    createdAt?: string;
    updatedAt?: string;
    orderRequestId?: string;
    summary?: QuotationSummaryDetails;
  };
}

export type GetOrderQuotationDetailsApiResponse = ApiResponse<OrderQuotationDetailsData>;

export const quotationsApi = createApi({
  reducerPath: "quotationsApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["QuotationsSummary", "OrderQuotationDetails"],
  endpoints: (builder) => ({
    getQuotationsSummary: builder.query<GetQuotationsSummaryResponseData, void>({
      query: () => ({
        url: "/api/customer/quotations/summary",
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<GetQuotationsSummaryResponseData>) =>
        response.data as GetQuotationsSummaryResponseData,
      providesTags: ["QuotationsSummary"],
    }),
    getProjectOrderQuotations: builder.query<
      GetProjectOrderQuotationsResponseData,
      string
    >({
      query: (leadId) => ({
        url: `/api/customer/projects/${leadId}/order-quotations`,
        method: "GET",
      }),
      transformResponse: (
        response: ApiResponse<GetProjectOrderQuotationsResponseData>
      ) => response.data as GetProjectOrderQuotationsResponseData,
      providesTags: ["QuotationsSummary"],
    }),
    getOrderQuotationDetails: builder.query<OrderQuotationDetailsData, string>({
      query: (quotationId) => ({
        url: `/api/customer/order-quotations/${quotationId}`,
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<OrderQuotationDetailsData>) =>
        response.data as OrderQuotationDetailsData,
      providesTags: (_result, _error, quotationId) => [
        { type: "OrderQuotationDetails", id: quotationId },
      ],
    }),
    approveOrderQuotation: builder.mutation<
      ApiResponse<Record<string, unknown>>,
      string
    >({
      query: (quotationId) => ({
        url: `/api/customer/order-quotations/${quotationId}/approve`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, quotationId) => [
        "QuotationsSummary",
        { type: "OrderQuotationDetails", id: quotationId },
      ],
    }),
    rejectOrderQuotation: builder.mutation<
      ApiResponse<Record<string, unknown>>,
      { quotationId: string; reason?: string }
    >({
      query: ({ quotationId, reason }) => ({
        url: `/api/customer/order-quotations/${quotationId}/reject`,
        method: "POST",
        body: reason ? { reason } : {},
      }),
      invalidatesTags: (_result, _error, { quotationId }) => [
        "QuotationsSummary",
        { type: "OrderQuotationDetails", id: quotationId },
      ],
    }),
  }),
});

export interface OrderQuotationItemApi {
  orderId: string;
  quotationId: string;
  quotationRecordId: string;
  buildingLabel: string;
  orderDate: string;
  quotationReceived: string;
  orderValue: number;
  status: string;
}

export interface ProjectInfo {
  leadId: string;
  projectName: string;
  jobId: string;
  location: string;
}

export interface GetProjectOrderQuotationsResponseData {
  project?: ProjectInfo;
  quotations: OrderQuotationItemApi[];
  total: number;
}

export const {
  useGetQuotationsSummaryQuery,
  useGetProjectOrderQuotationsQuery,
  useGetOrderQuotationDetailsQuery,
  useApproveOrderQuotationMutation,
  useRejectOrderQuotationMutation,
} = quotationsApi;
