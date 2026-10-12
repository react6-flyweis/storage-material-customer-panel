import { createApi } from "@/redux/utils/createApi";
import type { ApiResponse } from "./apiResponse";
import { baseQueryWithReauth } from "./baseQueryWithReauth";

export interface DirectChatMessage {
  messageId?: string;
  _id?: string;
  customerId?: string;
  senderType: "customer" | "admin" | "sales" | string;
  senderId?: string | null;
  senderName?: string | null;
  content: string;
  isReadByCustomer?: boolean;
  isReadByStaff?: boolean;
  createdAt: string;
}

export interface DirectChatSummary {
  customerId?: string;
  unreadCount: number;
  lastMessage?: DirectChatMessage | null;
}

export interface DirectChatMessagesResponse {
  messages: DirectChatMessage[];
  pagination?: {
    page: number;
    limit: number;
    total?: number;
    hasMore?: boolean;
  };
}

export const customerChatApi = createApi({
  reducerPath: "customerChatApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["CustomerDirectChat", "CustomerDirectChatMessages"],
  endpoints: (builder) => ({
    getDirectChatSummary: builder.query<ApiResponse<DirectChatSummary>, void>({
      query: () => ({
        url: "/api/customer/chat/direct",
        method: "GET",
      }),
      providesTags: ["CustomerDirectChat"],
    }),
    getDirectChatMessages: builder.query<
      ApiResponse<DirectChatMessagesResponse | DirectChatMessage[]>,
      { page?: number; limit?: number } | void
    >({
      query: (params) => ({
        url: "/api/customer/chat/direct/messages",
        method: "GET",
        params: {
          page: params?.page ?? 1,
          limit: params?.limit ?? 50,
        },
      }),
      providesTags: ["CustomerDirectChatMessages"],
    }),
    sendDirectChatMessage: builder.mutation<
      ApiResponse<DirectChatMessage>,
      { content: string }
    >({
      query: (body) => ({
        url: "/api/customer/chat/direct/messages",
        method: "POST",
        body,
      }),
      invalidatesTags: ["CustomerDirectChat", "CustomerDirectChatMessages"],
    }),
  }),
});

export const {
  useGetDirectChatSummaryQuery,
  useGetDirectChatMessagesQuery,
  useSendDirectChatMessageMutation,
} = customerChatApi;
