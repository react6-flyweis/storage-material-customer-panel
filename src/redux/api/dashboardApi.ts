import { createApi } from "@/redux/utils/createApi";
import type { ApiResponse } from "./apiResponse";
import { baseQueryWithReauth } from "./baseQueryWithReauth";

export interface DeliveryTracking {
  inTransit: number;
  staged: number;
  ready: number;
  totalToday: number;
  upcomingDeliveries: number;
  deliveriesThisWeek: number;
  delayedDeliveries: number;
  rescheduledDeliveries: number;
}

export interface ShipmentBreakdown {
  totalLoads: number;
  totalBundles: number | null;
}

export interface NextDelivery {
  deliveryId: string;
  deliveryNumber: string;
  description: string;
  status: string;
  deliveryDate: string;
  estimatedWeight: number;
}

export interface DashboardResponseData {
  activeProjects: number;
  closedProjects: number;
  drawingsAndApprovals: number;
  projectTimeline: string | null;
  totalProjectValue: number;
  totalPaid: number;
  totalPending: number;
  upcomingInvoice: unknown | null;
  deliveryTracking: DeliveryTracking;
  shipmentBreakdown: ShipmentBreakdown;
  nextDelivery: NextDelivery | null;
}

export type GetDashboardApiResponse = ApiResponse<DashboardResponseData>;

export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getDashboard: builder.query<DashboardResponseData, void>({
      query: () => ({
        url: "/api/customer/dashboard",
        method: "GET",
      }),
      transformResponse: (response: GetDashboardApiResponse) =>
        response.data as DashboardResponseData,
    }),
  }),
});

export const { useGetDashboardQuery } = dashboardApi;
