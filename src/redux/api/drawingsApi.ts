import { createApi } from "@/redux/utils/createApi";
import type { ApiResponse } from "./apiResponse";
import { baseQueryWithReauth } from "./baseQueryWithReauth";

export interface CustomerDrawingsSummaryItem {
  leadId: string;
  projectName: string;
  jobId: string;
  location: string;
  numberOfBuildings: number;
  totalDrawings: number;
  lastUpdate: string;
}

export interface GetCustomerDrawingsSummaryResponseData {
  projects: CustomerDrawingsSummaryItem[];
}

export type GetCustomerDrawingsSummaryApiResponse = ApiResponse<GetCustomerDrawingsSummaryResponseData>;

export interface BuildingItem {
  buildingLabel: string;
  totalDrawings: number;
  totalDocuments: number;
  lastUpdate: string;
}

export interface ProjectInfo {
  leadId: string;
  projectName: string;
  jobId: string;
  location: string;
}

export interface GetProjectBuildingsResponseData {
  project: ProjectInfo;
  buildings: BuildingItem[];
}

export type GetProjectBuildingsApiResponse = ApiResponse<GetProjectBuildingsResponseData>;

export interface BuildingDrawingItem {
  _id: string;
  leadId: string;
  buildingLabel: string;
  category: "drawing" | "document" | "photo" | string;
  name: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  documentType: string;
  status: string;
  uploadedBy?: {
    _id: string;
    name: string;
  };
  approvedBy?: {
    _id: string;
    name: string;
  } | null;
  approvedAt?: string | null;
  notes?: string;
  revisionNote?: string;
  revisionRequestedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface GetBuildingDrawingsResponseData {
  project?: ProjectInfo;
  buildingLabel: string;
  drawings: BuildingDrawingItem[];
  documents: BuildingDrawingItem[];
}

export type GetBuildingDrawingsApiResponse = ApiResponse<GetBuildingDrawingsResponseData>;

export const drawingsApi = createApi({
  reducerPath: "drawingsApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["CustomerDrawings", "ProjectBuildings", "BuildingDrawings"],
  endpoints: (builder) => ({
    getCustomerDrawings: builder.query<GetCustomerDrawingsSummaryResponseData, void>({
      query: () => ({
        url: "/api/customer/drawings",
        method: "GET",
      }),
      providesTags: ["CustomerDrawings"],
      transformResponse: (response: GetCustomerDrawingsSummaryApiResponse) =>
        response.data as GetCustomerDrawingsSummaryResponseData,
    }),
    getProjectBuildings: builder.query<GetProjectBuildingsResponseData, string>({
      query: (leadId) => ({
        url: `/api/customer/projects/${leadId}/buildings`,
        method: "GET",
      }),
      providesTags: (_result, _error, leadId) => [{ type: "ProjectBuildings", id: leadId }],
      transformResponse: (response: GetProjectBuildingsApiResponse) =>
        response.data as GetProjectBuildingsResponseData,
    }),
    getBuildingDrawings: builder.query<
      GetBuildingDrawingsResponseData,
      { leadId: string; building: string }
    >({
      query: ({ leadId, building }) => ({
        url: `/api/customer/projects/${leadId}/buildings/${building}`,
        method: "GET",
      }),
      providesTags: (_result, _error, { leadId, building }) => [
        { type: "BuildingDrawings", id: `${leadId}-${building}` },
      ],
      transformResponse: (response: GetBuildingDrawingsApiResponse) =>
        response.data as GetBuildingDrawingsResponseData,
    }),
  }),
});

export const {
  useGetCustomerDrawingsQuery,
  useGetProjectBuildingsQuery,
  useGetBuildingDrawingsQuery,
} = drawingsApi;
