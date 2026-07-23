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

export interface DashboardRequestedItem {
  _id?: string;
  name?: string;
  quantity?: number;
  unit?: string;
  notes?: string;
  lengthFeet?: number;
  color?: string;
  deliveryStatus?: string;
  deliveryId?: string | null;
  deliveryReference?: string;
  deliveredAt?: string | null;
}

export interface DashboardOrder {
  _id: string;
  requestId?: string;
  leadId?: string;
  siteLocation?: string;
  buildingLabel?: string;
  department?: string;
  source?: string;
  requestedBy?: unknown;
  requestedByCustomer?: string;
  requestedItems?: DashboardRequestedItem[];
  requiredBy?: string;
  preferredDeliveryDate?: string | null;
  specialInstructions?: string;
  priority?: string;
  status?: string;
  totalAmount?: number;
  reviewedBy?: unknown;
  reviewedAt?: string | null;
  reviewNotes?: string;
  attachments?: unknown[];
  requestDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DashboardNotification {
  _id: string;
  userId?: string | null;
  customerId?: string;
  leadId?: string;
  title: string;
  body: string;
  type?: string;
  priority?: string;
  isRead?: boolean;
  refId?: string | null;
  refModel?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface DashboardRecentMessage {
  _id: string;
  leadId?: string;
  customerId?: string;
  senderType?: string;
  senderId?: string;
  channel?: string;
  senderName?: string;
  content: string;
  isRead?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface DashboardResponseData {
  activeProjects: number;
  closedProjects: number;
  drawingsAndApprovals: number;
  projectTimeline: number | string | null;
  totalProjectValue: number;
  totalPaid: number;
  totalPending: number;
  upcomingInvoice: unknown | null;
  deliveryTracking: DeliveryTracking;
  shipmentBreakdown: ShipmentBreakdown;
  ordersList?: DashboardOrder[];
  notificationsFeed?: DashboardNotification[];
  recentMessages?: DashboardRecentMessage[];
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
