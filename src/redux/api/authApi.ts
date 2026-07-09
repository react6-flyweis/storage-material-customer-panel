import { createApi } from "@reduxjs/toolkit/query/react";
import { loginSuccess } from "../slices/authSlice";
import type { ApiResponse } from "./apiResponse";
import { baseQueryWithReauth } from "./baseQueryWithReauth";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginCustomer {
  _id: string;
  firstName: string;
  email: string;
  customerId: string;
  photo: string | null;
}

export type LoginApiResponse = ApiResponse<{
  accessToken: string;
  refreshToken: string;
  customer: LoginCustomer;
}>;

export interface LoginSession {
  customer: LoginCustomer;
  accessToken: string;
  refreshToken: string;
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    login: builder.mutation<LoginSession, LoginRequest>({
      query: (credentials) => ({
        url: "/api/customer/auth/login",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(_credentials, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(loginSuccess(data));
        } catch {
          // Login errors are handled by the caller.
        }
      },
      transformResponse: (response: LoginApiResponse) =>
        response.data as LoginSession,
    }),
  }),
});

export const { useLoginMutation } = authApi;
