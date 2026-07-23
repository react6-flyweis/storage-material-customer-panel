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

export interface PhoneInfo {
  number: string;
  countryCode: string;
}

export interface CustomerProfile {
  _id: string;
  customerId: string;
  firstName: string;
  lastName?: string;
  email: string;
  phone?: PhoneInfo | string;
  passwordChangedAt?: string | null;
  photo?: string | null;
  isActive?: boolean;
  source?: string;
  company?: string;
  isOnline?: boolean;
  location?: string;
  resetOtpVerified?: boolean;
  lastSeenAt?: string;
  onlineAt?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

export interface GetProfileResponseData {
  customer: CustomerProfile;
}

export type GetProfileApiResponse = ApiResponse<GetProfileResponseData>;

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: PhoneInfo | string;
  company?: string;
  location?: string;
  photo?: string | null;
  currentPassword?: string;
  newPassword?: string;
  [key: string]: unknown;
}

export type UpdateProfileApiResponse = ApiResponse<{
  customer: CustomerProfile;
}>;

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export type ChangePasswordApiResponse = ApiResponse<null>;

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["CustomerProfile"],
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
    getProfile: builder.query<GetProfileApiResponse, void>({
      query: () => ({
        url: "/api/customer/profile",
        method: "GET",
      }),
      providesTags: ["CustomerProfile"],
    }),
    updateProfile: builder.mutation<UpdateProfileApiResponse, UpdateProfileRequest>({
      query: (body) => ({
        url: "/api/customer/profile",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["CustomerProfile"],
    }),
    changePassword: builder.mutation<ChangePasswordApiResponse, ChangePasswordRequest>({
      query: (body) => ({
        url: "/api/customer/auth/change-password",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
} = authApi;


