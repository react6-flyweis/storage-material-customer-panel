import React from "react";
import { ProjectDrawingsPageText } from "@/data/text/ProjectDrawingsPageText";
import buildingIcon from "@/assets/icon/building.svg";
import drawingIcon from "@/assets/icon/drawing.svg";
import PurpleCalendarIcon from "@/assets/icon/PurpleCalendarIcon.svg";
import { Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  useGetCustomerDrawingsQuery,
  type CustomerDrawingsSummaryItem,
} from "@/redux/api/drawingsApi";

const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-5 flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-6 animate-pulse">
      {/* Left Details Section: Image + Project Metadata Skeleton */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 flex-1 min-w-0">
        <div className="w-full sm:w-[200px] h-[120px] shrink-0 rounded-xl bg-slate-200 flex items-center justify-center">
          <Building2 className="w-8 h-8 text-slate-300" />
        </div>
        <div className="space-y-3 flex-1 min-w-0">
          <div className="h-6 bg-slate-200 rounded-md w-48" />
          <div className="h-4 bg-slate-200 rounded-md w-24" />
          <div className="h-4 bg-slate-200 rounded-md w-36" />
        </div>
      </div>

      {/* Right Section: Stats & Action Skeleton */}
      <div className="flex flex-wrap sm:flex-nowrap items-center justify-between xl:justify-end gap-4 sm:gap-6 xl:gap-8 border-t xl:border-t-0 pt-4 xl:pt-0 border-slate-100 shrink-0">
        <div className="hidden xl:block w-[1px] h-16 bg-slate-200 shrink-0" />

        <div className="flex flex-col items-center sm:items-start space-y-2 min-w-[80px] shrink-0">
          <div className="w-10 h-10 rounded-full bg-slate-200 shrink-0" />
          <div className="space-y-1">
            <div className="h-6 w-8 bg-slate-200 rounded-md" />
            <div className="h-3 w-16 bg-slate-200 rounded-md" />
          </div>
        </div>

        <div className="hidden sm:block w-[1px] h-14 bg-slate-200 shrink-0" />

        <div className="flex flex-col items-center sm:items-start space-y-2 min-w-[95px] shrink-0">
          <div className="w-10 h-10 rounded-full bg-slate-200 shrink-0" />
          <div className="space-y-1">
            <div className="h-6 w-8 bg-slate-200 rounded-md" />
            <div className="h-3 w-20 bg-slate-200 rounded-md" />
          </div>
        </div>

        <div className="hidden sm:block w-[1px] h-14 bg-slate-200 shrink-0" />

        <div className="flex flex-col items-center sm:items-start space-y-2 min-w-[95px] shrink-0">
          <div className="w-10 h-10 rounded-full bg-slate-200 shrink-0" />
          <div className="space-y-1">
            <div className="h-4 w-20 bg-slate-200 rounded-md" />
            <div className="h-3 w-16 bg-slate-200 rounded-md" />
          </div>
        </div>

        <div className="pl-0 sm:pl-2 shrink-0">
          <div className="w-20 h-10 rounded-lg bg-slate-200" />
        </div>
      </div>
    </div>
  );
};

const AllDrawingsPage = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetCustomerDrawingsQuery();
  const projectsList: CustomerDrawingsSummaryItem[] = data?.projects || [];

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-semibold text-slate-800 font-inter">
          {ProjectDrawingsPageText.header.title}
        </h1>
        <p className="text-sm md:text-base text-slate-500 font-normal">
          {ProjectDrawingsPageText.header.subtitle}
        </p>
      </div>

      <div className="space-y-5">
        {isLoading ? (
          <div className="space-y-4">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : isError ? (
          <div className="text-center py-10 text-slate-500 font-medium bg-white rounded-2xl border border-slate-100 shadow-sm">
            Failed to load drawings summary. Please try refreshing.
          </div>
        ) : projectsList.length === 0 ? (
          <div className="text-center py-10 text-slate-500 font-medium bg-white rounded-2xl border border-slate-100 shadow-sm">
            No drawings available.
          </div>
        ) : (
          projectsList.map((item) => {
            const projectTitle = item.projectName?.trim() || "Untitled Project";
            const projectCode = item.jobId || "N/A";
            const projectLocation = item.location?.trim() || "Location not provided";
            const buildingsCount = item.numberOfBuildings || 0;
            const totalDrawingsCount = item.totalDrawings || 0;
            const lastUpdate = formatDate(item.lastUpdate);

            return (
              <div
                key={item.leadId}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-5 flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-6 hover:shadow-md transition-shadow"
              >
                {/* Left Details Section: Gray Placeholder Image + Project Metadata */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 flex-1 min-w-0">
                  <div className="w-full sm:w-[200px] h-[120px] shrink-0 rounded-xl bg-slate-100 border border-slate-200/60 flex items-center justify-center">
                    <Building2 className="w-10 h-10 text-slate-400" />
                  </div>
                  <div className="flex flex-col space-y-2 min-w-0 flex-1">
                    <h2 className="text-lg md:text-xl font-bold text-slate-900 leading-snug break-words">
                      {projectTitle}
                    </h2>
                    <p className="text-sm font-medium text-[#2563EB] break-words">
                      {projectCode}
                    </p>
                    <p className="text-xs sm:text-sm text-slate-600 font-normal leading-tight break-words">
                      {projectLocation}
                    </p>
                  </div>
                </div>

                {/* Right Section: Stats & Action */}
                <div className="flex flex-wrap sm:flex-nowrap items-center justify-between xl:justify-end gap-4 sm:gap-6 xl:gap-8 border-t xl:border-t-0 pt-4 xl:pt-0 border-slate-100 shrink-0">
                  {/* Vertical Divider */}
                  <div className="hidden xl:block w-[1px] h-16 bg-slate-200 shrink-0" />

                  {/* Stat 1: Buildings */}
                  <div className="flex flex-col items-center sm:items-start space-y-2.5 min-w-[80px] shrink-0">
                    <div className="w-10 h-10 rounded-full bg-[#EAF7ED] flex items-center justify-center text-[#22C55E]">
                      <img src={buildingIcon} alt="Building" />
                    </div>
                    <div>
                      <span className="text-2xl font-bold text-slate-900 block leading-none">
                        {buildingsCount}
                      </span>
                      <span className="text-xs sm:text-sm text-slate-600 font-medium mt-1 block">
                        Buildings
                      </span>
                    </div>
                  </div>

                  {/* Vertical Divider */}
                  <div className="hidden sm:block w-[1px] h-14 bg-slate-200 shrink-0" />

                  {/* Stat 2: Total Drawings */}
                  <div className="flex flex-col items-center sm:items-start space-y-2.5 min-w-[95px] shrink-0">
                    <div className="w-10 h-10 rounded-full bg-[#EBF2FE] flex items-center justify-center text-[#2563EB]">
                      <img src={drawingIcon} alt="Drawing" />
                    </div>
                    <div>
                      <span className="text-2xl font-bold text-slate-900 block leading-none">
                        {totalDrawingsCount}
                      </span>
                      <span className="text-xs sm:text-sm text-slate-600 font-medium mt-1 block">
                        Total Drawings
                      </span>
                    </div>
                  </div>

                  {/* Vertical Divider */}
                  <div className="hidden sm:block w-[1px] h-14 bg-slate-200 shrink-0" />

                  {/* Stat 3: Last Update */}
                  <div className="flex flex-col items-center sm:items-start space-y-2.5 min-w-[95px] shrink-0">
                    <div className="w-10 h-10 rounded-full bg-[#F5F3FF] flex items-center justify-center shrink-0">
                      <img
                        src={PurpleCalendarIcon}
                        alt="Last Update"
                        className="w-5 h-5"
                      />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-slate-900 block leading-none">
                        {lastUpdate}
                      </span>
                      <span className="text-xs sm:text-sm text-slate-600 font-medium mt-1 block">
                        Last Update
                      </span>
                    </div>
                  </div>

                  {/* View Action Button */}
                  <div className="pl-0 sm:pl-2 shrink-0">
                    <button
                      onClick={() => navigate(`/project-buildings/${item.leadId}`)}
                      className="bg-[#1D51A4] hover:bg-[#18448b] text-white px-7 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-xs cursor-pointer"
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AllDrawingsPage;
