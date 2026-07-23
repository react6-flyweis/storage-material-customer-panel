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
}

export interface LoadAndBundle {
  loadId: string;
  bundleCount: number | null;
  truckNumber: string | null;
  totalWeight: number;
}

export interface PackingListSummary {
  totalParts: number | null;
  bundleTypes: string[] | null;
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
    getDeliveries: builder.query<GetDeliveriesResponseData, { tab: string; project?: string }>({
      query: ({ tab, project }) => ({
        url: project ? `/api/customer/deliveries/${project}` : "/api/customer/deliveries",
        method: "GET",
        params: { tab },
      }),
      transformResponse: (response: GetDeliveriesApiResponse) =>
        response.data as GetDeliveriesResponseData,
    }),
    getDeliveryById: builder.query<Delivery, string>({
      query: (deliveryId) => ({
        url: `/api/customer/deliveries/${deliveryId}`,
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<{ delivery: Delivery }>) =>
        response.data?.delivery as Delivery,
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
      transformResponse: (response: GetDeliveriesSummaryApiResponse) =>
        response.data as GetDeliveriesSummaryResponseData,
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
} = deliveriesApi;

