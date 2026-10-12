import { createApi } from "@/redux/utils/createApi";
import type { ApiResponse } from "./apiResponse";
import { baseQueryWithReauth } from "./baseQueryWithReauth";

export interface DeliveryCompany {
  name: string;
  driver: string;
  phone: string;
  email: string;
}

export interface SiteContact {
  name: string;
  phone: string;
  email?: string;
}

export interface ReceivingPoc {
  name: string;
  phone: string;
  email: string;
}

export interface DeliveryTeam {
  company: string;
  driver: string;
  phone: string;
  email: string;
}

export interface Project {
  leadId: string;
  projectId: string;
  projectName: string;
  jobId?: string;
  location?: string;
}

export interface LoadAndBundle {
  loadId: string;
  bundleCount: number | null;
  truckNumber: string | null;
  totalWeight: number;
}

export interface PackingListSummary {
  totalParts: number | null;
  bundleTypes: number | string | null;
  material: string;
}

export interface Delivery {
  deliveryId: string;
  deliveryNumber: string;
  status: string;
  description: string;
  deliveryDate: string;
  timings?: string;
  pickupDate?: string | null;
  deliveryLocation?: string;
  estimatedWeight: number;
  loadingEquipment: string[];
  siteInstructions?: string;
  specialNotes?: string;
  siteContact: SiteContact;
  receivingPoc?: ReceivingPoc | null;
  deliveryCompany?: DeliveryCompany | null;
  deliveryTeam?: DeliveryTeam | null;
  project: Project;
  loadAndBundle?: LoadAndBundle | null;
  packingListSummary?: PackingListSummary | null;
  siteReadiness?: {
    siteReady: boolean;
    equipmentReady: boolean;
  } | null;
  confirmationEmailSent?: boolean;
  confirmationEmailSentAt?: string | null;
  reschedule?: {
    acknowledged?: boolean;
    acknowledgedAt?: string | null;
    previousDate?: string;
    newDate?: string;
    reason?: string;
  } | null;
}

export interface GetDeliveriesResponseData {
  deliveries: Delivery[];
  total: number;
  tabs: {
    upcoming: number;
    past: number;
    rescheduled: number;
  };
}

export type GetDeliveriesApiResponse = ApiResponse<GetDeliveriesResponseData>;

export const deliveriesApi = createApi({
  reducerPath: "deliveriesApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getDeliveries: builder.query<
      GetDeliveriesResponseData,
      { tab?: string; project?: string; leadId?: string }
    >({
      query: ({ tab = "upcoming", project, leadId }) => {
        const id = leadId || project;
        return {
          url: id ? `/api/customer/deliveries/${id}` : "/api/customer/deliveries",
          method: "GET",
          params: {
            tab,
            ...(id ? { leadId: id } : {}),
          },
        };
      },
      transformResponse: (response: ApiResponse<GetDeliveriesResponseData | Delivery[]>) => {
        if (Array.isArray(response.data)) {
          const list = response.data;
          return {
            deliveries: list,
            total: list.length,
            tabs: {
              upcoming: list.filter((d) => d.status === "scheduled" || d.status === "in_transit").length,
              past: list.filter((d) => d.status === "delivered").length,
              rescheduled: list.filter((d) => d.status === "rescheduled" || Boolean(d.reschedule)).length,
            },
          };
        }
        const data = response.data as GetDeliveriesResponseData;
        return {
          deliveries: data?.deliveries || [],
          total: data?.total ?? (data?.deliveries?.length || 0),
          tabs: data?.tabs || {
            upcoming: 0,
            past: 0,
            rescheduled: 0,
          },
        };
      },
    }),
    getDeliveryById: builder.query<Delivery, string>({
      query: (deliveryId) => ({
        url: `/api/customer/deliveries/${deliveryId}`,
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<{ delivery: Delivery } | Delivery>) => {
        const raw = response.data;
        if (raw && typeof raw === "object" && "delivery" in raw) {
          return (raw as { delivery: Delivery }).delivery;
        }
        return raw as Delivery;
      },
    }),
    sendConfirmationEmail: builder.mutation<ApiResponse<unknown>, string>({
      query: (deliveryId) => ({
        url: `/api/customer/deliveries/${deliveryId}/confirmation-email`,
        method: "POST",
      }),
    }),
    getDeliveryCalendar: builder.query<string, string>({
      query: (deliveryId) => ({
        url: `/api/customer/deliveries/${deliveryId}/calendar`,
        method: "GET",
        responseHandler: (response) => response.text(),
      }),
    }),
    getDeliveryCalendarDetails: builder.query<
      {
        title: string;
        description: string;
        location: string;
        startDate: string;
        endDate: string;
        googleCalendarUrl: string;
        outlookCalendarUrl: string;
        plainText: string;
        icsDownloadUrl: string;
      },
      string
    >({
      query: (deliveryId) => ({
        url: `/api/customer/deliveries/${deliveryId}/calendar/details`,
        method: "GET",
      }),
      transformResponse: (
        response: ApiResponse<{
          title: string;
          description: string;
          location: string;
          startDate: string;
          endDate: string;
          googleCalendarUrl: string;
          outlookCalendarUrl: string;
          plainText: string;
          icsDownloadUrl: string;
        }>
      ) => response.data!,
    }),
    requestCallback: builder.mutation<
      { message: string; eta: string },
      { deliveryId: string; body: { note?: string; priority?: string; reason?: string } }
    >({
      query: ({ deliveryId, body }) => ({
        url: `/api/customer/deliveries/${deliveryId}/request-callback`,
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponse<{ message: string; eta: string }>) =>
        response.data!,
    }),
    downloadDeliveryDetails: builder.query<Blob, string>({
      query: (deliveryId) => ({
        url: `/api/customer/deliveries/${deliveryId}/download`,
        method: "GET",
        responseHandler: (response) => response.blob(),
      }),
    }),
    downloadPackingList: builder.query<Blob, string>({
      query: (deliveryId) => ({
        url: `/api/customer/deliveries/${deliveryId}/download/packing-list`,
        method: "GET",
        responseHandler: (response) => response.blob(),
      }),
    }),
    downloadInstructions: builder.query<Blob, string>({
      query: (deliveryId) => ({
        url: `/api/customer/deliveries/${deliveryId}/download/instructions`,
        method: "GET",
        responseHandler: (response) => response.blob(),
      }),
    }),
    getDeliveriesSummary: builder.query<GetDeliveriesSummaryResponseData, void>({
      query: () => ({
        url: "/api/customer/deliveries/summary",
        method: "GET",
      }),
      transformResponse: (
        response: ApiResponse<GetDeliveriesSummaryResponseData | DeliverySummaryProject[]>
      ) => {
        if (Array.isArray(response.data)) {
          return { projects: response.data };
        }
        return (response.data || { projects: [] }) as GetDeliveriesSummaryResponseData;
      },
    }),
    confirmSiteReady: builder.mutation<
      ApiResponse<{ deliveryId: string; siteReadyConfirmation: unknown }>,
      { deliveryId: string; checklist?: Record<string, boolean> }
    >({
      query: ({ deliveryId, checklist }) => ({
        url: `/api/customer/deliveries/${deliveryId}/confirm-site-ready`,
        method: "POST",
        body: checklist ? { checklist } : {},
      }),
    }),
    confirmEquipment: builder.mutation<
      ApiResponse<{ deliveryId: string; equipmentConfirmation: unknown }>,
      { deliveryId: string; checklist?: Record<string, boolean> }
    >({
      query: ({ deliveryId, checklist }) => ({
        url: `/api/customer/deliveries/${deliveryId}/confirm-equipment`,
        method: "POST",
        body: checklist ? { checklist } : {},
      }),
    }),
    acknowledgeReschedule: builder.mutation<ApiResponse<unknown>, string>({
      query: (deliveryId) => ({
        url: `/api/customer/deliveries/${deliveryId}/acknowledge-reschedule`,
        method: "POST",
      }),
    }),
    scanBundle: builder.mutation<ScanBundleResponseData, { bundleId: string }>({
      query: (body) => ({
        url: "/api/customer/bundles/scan",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponse<ScanBundleResponseData>) =>
        response.data as ScanBundleResponseData,
    }),
    getBundleDetails: builder.query<ScanBundleResponseData, string>({
      query: (bundleId) => ({
        url: `/api/customer/bundles/${bundleId}`,
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<ScanBundleResponseData>) =>
        response.data as ScanBundleResponseData,
    }),
    reportBundleIssue: builder.mutation<
      ApiResponse<{ issue: string }>,
      { bundleId: string; issue: string }
    >({
      query: ({ bundleId, issue }) => ({
        url: `/api/customer/bundles/${bundleId}/report-issue`,
        method: "POST",
        body: { issue },
      }),
    }),
    contactBundleSupport: builder.mutation<
      ApiResponse<{ message: string }>,
      { bundleId: string; message: string }
    >({
      query: ({ bundleId, message }) => ({
        url: `/api/customer/bundles/${bundleId}/contact-support`,
        method: "POST",
        body: { message },
      }),
    }),
    downloadBundleDetails: builder.query<Blob, string>({
      query: (bundleId) => ({
        url: `/api/customer/bundles/${bundleId}/download`,
        method: "GET",
        responseHandler: (response) => response.blob(),
      }),
    }),
    downloadBundlePackingList: builder.query<Blob, string>({
      query: (bundleId) => ({
        url: `/api/customer/bundles/${bundleId}/download/packing-list`,
        method: "GET",
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
});

export interface DeliverySummaryProject {
  leadId: string;
  projectName: string;
  jobId: string;
  location: string;
  upcoming: number;
  past: number;
  rescheduled: number;
}

export interface ScanBundleItemSourceLineSnapshot {
  _id?: string;
  vendorLineNo?: string;
  extractionFormat?: string;
  qty?: number;
  pieceQty?: number;
  totalLinearFeet?: number;
  safeTotalLinearFeet?: number;
  uom?: string;
  partCode?: string | null;
  vendorProductCode?: string | null;
  description?: string;
  color?: string | null;
  lengthText?: string;
  lengthFeet?: number;
  reportedLengthFeet?: number;
  shippingLengthFeet?: number;
  weight?: number | null;
  rawWeight?: number;
  resolvedWeight?: number;
  unitWeight?: number;
  totalWeight?: number;
  weightMultiplier?: number;
  weightBasis?: string;
  weightConfidence?: number;
  weightMissing?: boolean;
  weightWarnings?: string[];
  weightSource?: string;
  bomMatchedTotalWeight?: number;
  bomMatchedUnitWeight?: number;
  matchedBomItemIds?: string[];
  unitPrice?: number;
  priceUnit?: string;
  amount?: number;
  pieceMark?: string;
  warnings?: string[];
}

export interface ScanBundleItem {
  _id?: string;
  vendorQuoteLineId?: string;
  partCode?: string;
  description?: string;
  category?: string;
  color?: string;
  qty?: number;
  lengthFeet?: number;
  widthFeet?: number | null;
  heightFeet?: number | null;
  weight?: number;
  unitWeight?: number;
  totalWeight?: number;
  weightBasis?: string;
  weightSource?: string;
  markIds?: string[];
  sourceLineSnapshot?: ScanBundleItemSourceLineSnapshot;
}

export interface ScanBundleProject {
  leadId?: string;
  projectName?: string;
  jobId?: string;
}

export interface ScanBundleTruck {
  packingListNo?: string;
  truck?: string;
}

export interface ScanBundleDeliveryReference {
  deliveryNumber?: string;
  destination?: string;
  status?: string;
}

export interface ScanBundleData {
  bundleId?: string;
  bundleNo?: string;
  bundleType?: string;
  title?: string;
  totalQty?: number;
  totalWeight?: number;
  maxLengthFeet?: number;
  status?: string;
  items?: ScanBundleItem[];
  project?: ScanBundleProject;
  truck?: ScanBundleTruck;
  deliveryReference?: ScanBundleDeliveryReference;
}

export interface ScanBundleResponseData {
  bundle?: ScanBundleData;
  [key: string]: unknown;
}

export interface GetDeliveriesSummaryResponseData {
  projects: DeliverySummaryProject[];
}

export type GetDeliveriesSummaryApiResponse = ApiResponse<GetDeliveriesSummaryResponseData>;

export const {
  useGetDeliveriesQuery,
  useGetDeliveryByIdQuery,
  useSendConfirmationEmailMutation,
  useLazyGetDeliveryCalendarQuery,
  useGetDeliveryCalendarDetailsQuery,
  useRequestCallbackMutation,
  useLazyDownloadDeliveryDetailsQuery,
  useLazyDownloadPackingListQuery,
  useLazyDownloadInstructionsQuery,
  useGetDeliveriesSummaryQuery,
  useConfirmSiteReadyMutation,
  useConfirmEquipmentMutation,
  useAcknowledgeRescheduleMutation,
  useScanBundleMutation,
  useGetBundleDetailsQuery,
  useLazyGetBundleDetailsQuery,
  useReportBundleIssueMutation,
  useContactBundleSupportMutation,
  useLazyDownloadBundleDetailsQuery,
  useLazyDownloadBundlePackingListQuery,
} = deliveriesApi;

