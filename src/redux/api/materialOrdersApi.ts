import { createApi } from "@/redux/utils/createApi";
import type { ApiResponse } from "./apiResponse";
import { baseQueryWithReauth } from "./baseQueryWithReauth";

export interface MaterialOrdersSummaryProject {
  leadId: string;
  projectName: string;
  jobId: string;
  location: string;
  newOrders: number;
  pending: number;
  completed: number;
}

export interface GetMaterialOrdersSummaryResponseData {
  projects: MaterialOrdersSummaryProject[];
}

export type GetMaterialOrdersSummaryApiResponse = ApiResponse<GetMaterialOrdersSummaryResponseData>;

export interface ProjectRequestedItemApi {
  _id: string;
  name: string;
  quantity: number;
  unit: string;
  notes: string;
  lengthFeet: number;
  color: string;
  deliveryStatus: string;
  deliveryId: string | null;
  deliveryReference: string;
  deliveredAt: string | null;
}

export interface ProjectOrderApi {
  _id: string;
  requestId: string;
  leadId: string;
  siteLocation: string;
  buildingLabel: string;
  department: string;
  source: string;
  requestedBy: string | null;
  requestedByCustomer: string;
  requestedItems: ProjectRequestedItemApi[];
  requiredBy: string;
  preferredDeliveryDate: string | null;
  specialInstructions: string;
  priority: string;
  status: string;
  totalAmount: number;
  reviewedBy: string | null;
  reviewedAt: string | null;
  reviewNotes: string;
  attachments: string[];
  requestDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectInfo {
  leadId: string;
  projectName: string;
  jobId: string;
  location: string;
}

export interface GetProjectOrdersResponseData {
  project?: ProjectInfo;
  orders: ProjectOrderApi[];
  total: number;
  counts: {
    newOrders: number;
    pending: number;
    completed: number;
  };
}

export type GetProjectOrdersApiResponse = ApiResponse<GetProjectOrdersResponseData>;

export interface OrderDetailsRequestedItemApi {
  _id: string;
  name: string;
  quantity: number;
  unit: string;
  notes: string;
  lengthFeet: number;
  color: string;
  deliveryStatus: string;
  deliveryId: string | null;
  deliveryReference: string;
  deliveredAt: string | null;
}

export interface OrderDetailsCustomerApi {
  _id: string;
  firstName: string;
  lastName: string;
}

export interface OrderDetailsOrderApi {
  _id: string;
  requestId: string;
  leadId: string;
  siteLocation: string;
  buildingLabel: string;
  department: string;
  source: string;
  requestedBy: string | null;
  requestedByCustomer?: OrderDetailsCustomerApi | null;
  requestedItems: OrderDetailsRequestedItemApi[];
  deliveredItems?: OrderDetailsRequestedItemApi[];
  pendingItems?: OrderDetailsRequestedItemApi[];
  requiredBy: string;
  preferredDeliveryDate: string | null;
  specialInstructions: string;
  priority: string;
  status: string;
  stage?: string;
  createdByName?: string;
  totalAmount: number;
  reviewedBy: string | null;
  reviewedAt: string | null;
  reviewNotes: string;
  attachments: (string | { name?: string; url?: string; size?: string })[];
  requestDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderDetailsQuotationLineItemApi {
  coilType: string;
  lengthFeet: number;
  quantity: number;
  color: string;
  unitPrice: number;
  amount: number;
}

export interface OrderDetailsQuotationApi {
  _id: string;
  quotationNumber: string;
  orderId: string;
  leadId: string;
  customerId: string;
  buildingLabel: string;
  sellerName: string;
  sellerAddress: string;
  sellerEmail: string;
  lineItems: OrderDetailsQuotationLineItemApi[];
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
}

export interface GetProjectOrderDetailsResponseData {
  order: OrderDetailsOrderApi;
  quotation?: OrderDetailsQuotationApi | null;
}

export type GetProjectOrderDetailsApiResponse = ApiResponse<GetProjectOrderDetailsResponseData>;

export const materialOrdersApi = createApi({
  reducerPath: "materialOrdersApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["MaterialOrdersSummary", "ProjectOrders", "OrderDetails"],
  endpoints: (builder) => ({
    getMaterialOrdersSummary: builder.query<
      GetMaterialOrdersSummaryResponseData,
      void
    >({
      query: () => ({
        url: "/api/customer/material-orders/summary",
        method: "GET",
      }),
      transformResponse: (
        response: ApiResponse<GetMaterialOrdersSummaryResponseData>
      ) => response.data as GetMaterialOrdersSummaryResponseData,
      providesTags: ["MaterialOrdersSummary"],
    }),
    getProjectOrders: builder.query<GetProjectOrdersResponseData, string>({
      query: (leadId) => ({
        url: `/api/customer/projects/${leadId}/orders`,
        method: "GET",
      }),
      transformResponse: (
        response: ApiResponse<GetProjectOrdersResponseData>
      ) => response.data as GetProjectOrdersResponseData,
      providesTags: (_result, _error, leadId) => [
        { type: "ProjectOrders", id: leadId },
      ],
    }),
    getProjectOrderDetails: builder.query<
      GetProjectOrderDetailsResponseData,
      { leadId: string; orderId: string }
    >({
      query: ({ leadId, orderId }) => ({
        url: `/api/customer/projects/${leadId}/orders/${orderId}`,
        method: "GET",
      }),
      transformResponse: (
        response: ApiResponse<GetProjectOrderDetailsResponseData>
      ) => response.data as GetProjectOrderDetailsResponseData,
      providesTags: (_result, _error, { orderId }) => [
        { type: "OrderDetails", id: orderId },
      ],
    }),
  }),
});

export const {
  useGetMaterialOrdersSummaryQuery,
  useGetProjectOrdersQuery,
  useGetProjectOrderDetailsQuery,
} = materialOrdersApi;
