import { createApi } from "@/redux/utils/createApi";
import type { ApiResponse } from "./apiResponse";
import { baseQueryWithReauth } from "./baseQueryWithReauth";

export interface ProjectDocument {
  url: string;
  name: string;
  type: string;
  uploadedBy: string;
  _id: string;
  uploadedAt: string;
}

export interface Project {
  _id: string;
  buildingType: string;
  location: string;
  source: string;
  jobId: string;
  projectName: string;
  assignedSales: string | null;
  quoteValue: number;
  lifecycleStatus: string;
  isQuoteReady: boolean;
  documents: ProjectDocument[];
  projectId: string;
}

export interface GetProjectsParams {
  page: number;
  limit: number;
}

export interface GetProjectsResponseData {
  projects: Project[];
  total: number;
  page: number;
  limit: number;
  stats?: {
    total: number;
    active: number;
    workInProgress: number;
    cancelled: number;
  };
}

export type GetProjectsApiResponse = ApiResponse<GetProjectsResponseData>;

export const projectsApi = createApi({
  reducerPath: "projectsApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Drawings", "Quotation"],
  endpoints: (builder) => ({
    getProjects: builder.query<GetProjectsResponseData, GetProjectsParams>({
      query: ({ page, limit }) => ({
        url: "/api/customer/projects",
        method: "GET",
        params: { page, limit },
      }),
      transformResponse: (response: GetProjectsApiResponse) =>
        response.data as GetProjectsResponseData,
    }),
    getProjectDetails: builder.query<ProjectDetailsResponseData, string>({
      query: (id) => ({
        url: `/api/customer/projects/${id}`,
        method: "GET",
      }),
      transformResponse: (response: GetProjectDetailsApiResponse) =>
        response.data as ProjectDetailsResponseData,
    }),
    getProjectDrawings: builder.query<GetProjectDrawingsResponseData, string>({
      query: (id) => ({
        url: `/api/customer/projects/${id}/drawings`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Drawings", id }],
      transformResponse: (response: GetProjectDrawingsApiResponse) =>
        response.data as GetProjectDrawingsResponseData,
    }),
    updateDrawingStatus: builder.mutation<
      ApiResponse<Drawing>,
      { leadId: string; drawingId: string; status: string; notes?: string }
    >({
      query: ({ leadId, drawingId, status, notes }) => ({
        url: `/api/customer/projects/${leadId}/drawings/${drawingId}`,
        method: "PUT",
        body: { status, notes },
      }),
    }),
    approveDrawing: builder.mutation<
      ApiResponse<Drawing>,
      { leadId: string; drawingId: string }
    >({
      query: ({ leadId, drawingId }) => ({
        url: `/api/customer/projects/${leadId}/drawings/${drawingId}/approve`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, { leadId }) => [{ type: "Drawings", id: leadId }],
    }),
    requestDrawingRevision: builder.mutation<
      ApiResponse<Drawing>,
      { leadId: string; drawingId: string; note: string }
    >({
      query: ({ leadId, drawingId, note }) => ({
        url: `/api/customer/projects/${leadId}/drawings/${drawingId}/request-revision`,
        method: "POST",
        body: { note },
      }),
      invalidatesTags: (_result, _error, { leadId }) => [{ type: "Drawings", id: leadId }],
    }),
    getProjectActivity: builder.query<GetProjectActivityResponseData, GetProjectActivityParams>({
      query: ({ leadId, page = 1, limit = 20 }) => ({
        url: `/api/customer/projects/${leadId}/activity`,
        method: "GET",
        params: { page, limit },
      }),
      transformResponse: (response: GetProjectActivityApiResponse) =>
        response.data as GetProjectActivityResponseData,
    }),
    getProjectNotes: builder.query<GetProjectNotesResponseData, string>({
      query: (leadId) => ({
        url: `/api/customer/projects/${leadId}/notes`,
        method: "GET",
      }),
      transformResponse: (response: GetProjectNotesApiResponse) =>
        response.data as GetProjectNotesResponseData,
    }),
    getProjectFollowUps: builder.query<GetProjectFollowUpsResponseData, GetProjectFollowUpsParams>({
      query: ({ leadId, page = 1, limit = 20 }) => ({
        url: `/api/customer/projects/${leadId}/followups`,
        method: "GET",
        params: { page, limit },
      }),
      transformResponse: (response: GetProjectFollowUpsApiResponse) =>
        response.data as GetProjectFollowUpsResponseData,
    }),
    getProjectMeetings: builder.query<GetProjectMeetingsResponseData, GetProjectMeetingsParams>({
      query: ({ leadId, page = 1, limit = 20 }) => ({
        url: `/api/customer/projects/${leadId}/meetings`,
        method: "GET",
        params: { page, limit },
      }),
      transformResponse: (response: GetProjectMeetingsApiResponse) =>
        response.data as GetProjectMeetingsResponseData,
    }),
    getProjectRFQ: builder.query<ProjectRFQResponseData, string>({
      query: (leadId) => ({
        url: `/api/customer/projects/${leadId}/rfq`,
        method: "GET",
      }),
      transformResponse: (response: GetProjectRFQApiResponse) =>
        response.data as ProjectRFQResponseData,
    }),
    cancelProject: builder.mutation<
      ApiResponse<void>,
      { leadId: string; reason: string }
    >({
      query: ({ leadId, reason }) => ({
        url: `/api/customer/projects/${leadId}/cancel`,
        method: "POST",
        body: { reason },
      }),
    }),
    getCustomerDocuments: builder.query<GetCustomerDocumentsResponseData, { type?: string } | void>({
      query: (params) => ({
        url: "/api/customer/documents",
        method: "GET",
        params: params || { type: "drawing" },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.projects.map(({ lead }) => ({ type: "Drawings" as const, id: lead._id })),
              "Drawings",
            ]
          : ["Drawings"],
      transformResponse: (response: GetCustomerDocumentsApiResponse) =>
        response.data as GetCustomerDocumentsResponseData,
    }),
    getProjectPaymentsSummary: builder.query<ProjectPaymentsSummaryResponseData, string>({
      query: (leadId) => ({
        url: `/api/customer/projects/${leadId}/payments/summary`,
        method: "GET",
      }),
      transformResponse: (response: GetProjectPaymentsSummaryApiResponse) =>
        response.data as ProjectPaymentsSummaryResponseData,
    }),
    getProjectQuotation: builder.query<GetProjectQuotationResponseData, string>({
      query: (leadId) => ({
        url: `/api/customer/projects/${leadId}/quotation`,
        method: "GET",
      }),
      providesTags: (_result, _error, leadId) => [{ type: "Quotation", id: leadId }],
      transformResponse: (response: GetProjectQuotationApiResponse) =>
        response.data as GetProjectQuotationResponseData,
    }),
    approveQuotation: builder.mutation<ApiResponse<unknown>, string>({
      query: (leadId) => ({
        url: `/api/customer/projects/${leadId}/quotation/approve`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, leadId) => [{ type: "Quotation", id: leadId }],
    }),
    rejectQuotation: builder.mutation<
      ApiResponse<unknown>,
      { leadId: string; reason?: string }
    >({
      query: ({ leadId, reason }) => ({
        url: `/api/customer/projects/${leadId}/quotation/reject`,
        method: "POST",
        body: { reason },
      }),
      invalidatesTags: (_result, _error, { leadId }) => [{ type: "Quotation", id: leadId }],
    }),
    getChatHistory: builder.query<
      {
        isChatEnded: boolean;
        chatEndedAt: string | null;
        isStaffChatActive: boolean;
        isHandedToSales: boolean;
        isAiActive: boolean;
        canCustomerSend: boolean;
        messages: {
          senderType: "customer" | "ai" | "sales" | "admin";
          content: string;
          createdAt: string;
          senderName?: string;
        }[];
      },
      string
    >({
      query: (leadId) => ({
        url: `/api/public/chat/history/${leadId}`,
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<{
        isChatEnded: boolean;
        chatEndedAt: string | null;
        isStaffChatActive: boolean;
        isHandedToSales: boolean;
        isAiActive: boolean;
        canCustomerSend: boolean;
        messages: {
          senderType: "customer" | "ai" | "sales" | "admin";
          content: string;
          createdAt: string;
          senderName?: string;
        }[];
      }>) => response.data as {
        isChatEnded: boolean;
        chatEndedAt: string | null;
        isStaffChatActive: boolean;
        isHandedToSales: boolean;
        isAiActive: boolean;
        canCustomerSend: boolean;
        messages: {
          senderType: "customer" | "ai" | "sales" | "admin";
          content: string;
          createdAt: string;
          senderName?: string;
        }[];
      },
    }),
  }),
});

export interface RFQInfo {
  jobId: string;
  projectName: string;
  buildingType: string;
  roofStyle: string;
  sqft: string;
  width: number;
  length: number;
  location: string;
  quoteValue: number;
  isQuoteReady: boolean;
  lifecycleStatus: string;
  aiSummary: string | null;
  aiQuoteData: string | null;
}

export interface IncludedMaterial {
  name: string;
  description: string;
  quantity: number;
  _id: string;
}

export interface OptionalAddOn {
  name: string;
  description: string;
  price: number;
  _id: string;
}

export interface Quotation {
  _id: string;
  leadId: string;
  customerId: string;
  createdBy: string;
  buildingType: string;
  basePrice: number;
  maxPrice: number;
  sqft: string;
  width: number;
  length: number;
  height: number;
  currency: string;
  roofStyle: string;
  validTill: string;
  location: string;
  windLoad: string;
  snowLoad: string;
  paymentTerms: string;
  companyName: string;
  estimatedDelivery: string;
  includedMaterials: IncludedMaterial[];
  optionalAddOns: OptionalAddOn[];
  specialNote: string;
  internalNotes: string;
  priorityLevel: string;
  status: string;
  rejectReason?: string;
  sentAt: string | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ProjectRFQResponseData {
  rfq: RFQInfo;
  quotation: Quotation | null;
}

export type GetProjectRFQApiResponse = ApiResponse<ProjectRFQResponseData>;

export interface MeetingCreator {
  _id: string;
  name: string;
  email: string;
}

export interface MeetingItem {
  _id: string;
  customerId: string;
  leadId: string;
  title: string;
  createdBy: MeetingCreator;
  assignedTo: string;
  meetingTime: string;
  duration: number;
  mode: string;
  meetingLink?: string;
  notes: string;
  status: string;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface GetProjectMeetingsParams {
  leadId: string;
  page?: number;
  limit?: number;
}

export interface GetProjectMeetingsResponseData {
  meetings: MeetingItem[];
  total: number;
  page: number;
  limit: number;
  stats: {
    total: number;
    scheduled: number;
    completed: number;
    cancelled: number;
  };
}

export type GetProjectMeetingsApiResponse = ApiResponse<GetProjectMeetingsResponseData>;

export interface FollowUpAssignedTo {
  _id: string;
  name: string;
  email: string;
}

export interface FollowUpItem {
  _id: string;
  leadId: string;
  customerId: string;
  assignedTo: FollowUpAssignedTo;
  createdBy: string;
  followUpDate: string;
  notes: string;
  priority: string;
  status: string;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface GetProjectFollowUpsParams {
  leadId: string;
  page?: number;
  limit?: number;
}

export interface GetProjectFollowUpsResponseData {
  followUps: FollowUpItem[];
  total: number;
  page: number;
  limit: number;
  stats: {
    total: number;
    pending: number;
    completed: number;
  };
}

export type GetProjectFollowUpsApiResponse = ApiResponse<GetProjectFollowUpsResponseData>;

export interface DrawingUploadedBy {
  _id: string;
  name: string;
}

export interface Drawing {
  _id: string;
  leadId: string;
  name: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  documentType: string;
  status: string;
  uploadedBy: DrawingUploadedBy;
  approvedBy: string | null;
  approvedAt: string | null;
  notes: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface GetProjectDrawingsResponseData {
  drawings: Drawing[];
  embeddedDocuments: unknown[];
  total: number;
}

export type GetProjectDrawingsApiResponse = ApiResponse<GetProjectDrawingsResponseData>;

export interface ProjectInvoice {
  _id: string;
  leadId: string;
  customerId: string;
  quotationId: string | null;
  invoiceNumber: string;
  description: string;
  paymentScheduleId: string | null;
  paymentScheduleStageId: string | null;
  daysToPay: number | null;
  dueDate: string | null;
  poNumber: string;
  subtotal: number;
  markupTotal: number;
  tax: number;
  discount: number;
  depositAmount: number;
  totalAmount: number;
  status: string;
  sentAt: string | null;
  paidAt: string | null;
  date: string;
  lineItems: unknown[];
  createdAt: string;
  updatedAt: string;
  paymentSchedule: unknown;
}

export interface ProjectDetailsResponseData {
  lead: {
    _id: string;
    customerId: string;
    buildingType: string;
    location: string;
    assignedSales: string | null;
    quoteValue: number;
    lifecycleStatus: string;
    documents: ProjectDocument[];
    jobId: string;
    projectId: string;
    createdAt?: string;
  };
  quotation: unknown;
  quoteSummary: unknown;
  invoices: ProjectInvoice[];
  paymentSchedule: unknown;
}

export type GetProjectDetailsApiResponse = ApiResponse<ProjectDetailsResponseData>;

export interface ActivityPerformedBy {
  _id: string;
  name: string;
  role: string;
}

export interface ActivityMetadata {
  poOrderId?: string;
  assignedTo?: string;
  assignedToName?: string;
  projectName?: string;
  invoiceNumber?: string;
  totalAmount?: number;
  note?: string;
  docId?: string;
  name?: string;
  url?: string;
  followUpDate?: string;
  priority?: string;
  status?: string;
  adminNotes?: string;
  escalationId?: string;
  employeeName?: string;
  poNumber?: string;
  lifecycleStatus?: string;
  buildingType?: string;
  location?: string;
  quoteValue?: number;
  followUpId?: string;
  meetingId?: string;
  title?: string;
  meetingTime?: string;
  mode?: string;
  changes?: {
    title?: string;
    notes?: string;
  };
}

export interface ActivityItem {
  _id: string;
  type: string;
  action: string;
  leadId: string;
  customerId: string;
  performedBy: ActivityPerformedBy;
  metadata: ActivityMetadata;
  createdAt: string;
  __v: number;
}

export interface GetProjectActivityParams {
  leadId: string;
  page?: number;
  limit?: number;
}

export interface GetProjectActivityResponseData {
  activity: ActivityItem[];
  total: number;
  page: number;
  limit: number;
}

export type GetProjectActivityApiResponse = ApiResponse<GetProjectActivityResponseData>;

export interface NoteItem {
  _id: string;
  note: string;
  addedAt: string;
}

export interface GetProjectNotesResponseData {
  notes: NoteItem[];
  generalNotes: string;
  total: number;
}

export type GetProjectNotesApiResponse = ApiResponse<GetProjectNotesResponseData>;

export interface CustomerDocument {
  _id: string;
  name: string;
  url: string;
  type: string;
  documentType: string;
  status: string;
  fileType: string;
  fileSize: number;
  notes: string;
  revisionNote?: string;
  uploadedBy: {
    _id: string;
    name: string;
  };
  uploadedAt: string;
  source: string;
}

export interface CustomerProjectWithDrawings {
  lead: {
    _id: string;
    jobId: string;
    projectName: string;
    buildingType: string;
    location: string;
    lifecycleStatus: string;
  };
  documents: CustomerDocument[];
  count: number;
}

export interface GetCustomerDocumentsResponseData {
  projects: CustomerProjectWithDrawings[];
  totalDocuments: number;
}

export type GetCustomerDocumentsApiResponse = ApiResponse<GetCustomerDocumentsResponseData>;

export interface ProjectPaymentsSummaryResponseData {
  totalPayment: number;
  totalPaid: number;
  outstandingBalance: number;
}

export type GetProjectPaymentsSummaryApiResponse = ApiResponse<ProjectPaymentsSummaryResponseData>;

export interface GetProjectQuotationResponseData {
  quotation: Quotation | null;
}

export type GetProjectQuotationApiResponse = ApiResponse<GetProjectQuotationResponseData>;

export const {
  useGetProjectsQuery,
  useGetProjectDetailsQuery,
  useGetProjectDrawingsQuery,
  useUpdateDrawingStatusMutation,
  useApproveDrawingMutation,
  useRequestDrawingRevisionMutation,
  useGetProjectActivityQuery,
  useGetProjectNotesQuery,
  useGetProjectFollowUpsQuery,
  useGetProjectMeetingsQuery,
  useGetProjectRFQQuery,
  useCancelProjectMutation,
  useGetCustomerDocumentsQuery,
  useGetProjectPaymentsSummaryQuery,
  useGetProjectQuotationQuery,
  useApproveQuotationMutation,
  useRejectQuotationMutation,
  useGetChatHistoryQuery,
} = projectsApi;


