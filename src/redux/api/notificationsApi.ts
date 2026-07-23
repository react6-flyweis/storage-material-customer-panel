import { createApi } from "@/redux/utils/createApi";
import type { ApiResponse } from "./apiResponse";
import { baseQueryWithReauth } from "./baseQueryWithReauth";

export interface NotificationItem {
  _id: string;
  userId: string | null;
  customerId: string;
  leadId: string | null;
  title: string;
  body: string;
  type: "system" | "drawing" | "payment" | "meeting" | string;
  priority: "low" | "medium" | "high" | string;
  isRead: boolean;
  refId: string | null;
  refModel: string | null;
  __v?: number;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationStats {
  total: number;
  unread: number;
  highPriority: number;
  today: number;
}

export interface GetNotificationsResponseData {
  notifications: NotificationItem[];
  total: number;
  stats: NotificationStats;
}

export type GetNotificationsApiResponse = ApiResponse<GetNotificationsResponseData>;

export interface GetNotificationsQueryParams {
  filter?: string;
}

export interface MarkNotificationReadResponseData {
  notificationId: string;
  isRead: boolean;
}

export type MarkNotificationReadApiResponse = ApiResponse<MarkNotificationReadResponseData>;

export const notificationsApi = createApi({
  reducerPath: "notificationsApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Notifications"],
  endpoints: (builder) => ({
    getNotifications: builder.query<
      GetNotificationsApiResponse,
      GetNotificationsQueryParams | void
    >({
      query: (params) => ({
        url: "/api/customer/notifications",
        method: "GET",
        params: params?.filter ? { filter: params.filter } : undefined,
      }),
      providesTags: ["Notifications"],
    }),
    markNotificationAsRead: builder.mutation<
      MarkNotificationReadApiResponse,
      string
    >({
      query: (notificationId) => ({
        url: `/api/customer/notifications/${notificationId}/read`,
        method: "PUT",
      }),
      invalidatesTags: ["Notifications"],
    }),
    markAllNotificationsAsRead: builder.mutation<ApiResponse<Record<string, never>>, void>({
      query: () => ({
        url: "/api/customer/notifications/read-all",
        method: "PUT",
      }),
      invalidatesTags: ["Notifications"],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
} = notificationsApi;


