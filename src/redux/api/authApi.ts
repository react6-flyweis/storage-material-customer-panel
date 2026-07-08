import { createApi } from "@reduxjs/toolkit/query/react";
import { loginSuccess } from "../slices/authSlice";
import type { ApiResponse } from "./apiResponse";
import { baseQueryWithReauth } from "./baseQueryWithReauth";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponseUser {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export type LoginApiResponse = ApiResponse<{
  accessToken: string;
  refreshToken: string;
  role: string;
  user: LoginResponseUser;
}>;

export interface LoginSession {
  user: LoginResponseUser;
  accessToken: string;
  refreshToken: string;
  role: string;
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    login: builder.mutation<LoginSession, LoginRequest>({
      query: (credentials) => ({
        url: "/api/auth/login",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(_credentials, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.role === "customer") {
            dispatch(loginSuccess(data));
          }
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
