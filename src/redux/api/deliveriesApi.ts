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
}

export interface Project {
  leadId: string;
  projectId: string;
  projectName: string;
}

export interface Delivery {
  deliveryId: string;
  deliveryNumber: string;
  status: string;
  description: string;
  deliveryDate: string;
  timings?: string;
  pickupDate?: string | null;
  estimatedWeight: number;
  loadingEquipment: string[];
  siteInstructions?: string;
  specialNotes?: string;
  siteContact: SiteContact;
  deliveryCompany?: DeliveryCompany | null;
  project: Project;
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
    getDeliveries: builder.query<GetDeliveriesResponseData, { tab: string }>({
      query: ({ tab }) => ({
        url: "/api/customer/deliveries",
        method: "GET",
        params: { tab },
      }),
      transformResponse: (response: GetDeliveriesApiResponse) =>
        response.data as GetDeliveriesResponseData,
    }),
  }),
});

export const { useGetDeliveriesQuery } = deliveriesApi;
