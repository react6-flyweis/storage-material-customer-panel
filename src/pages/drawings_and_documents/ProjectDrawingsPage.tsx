import React from "react";
import { ArrowLeft, Building2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import buildingIcon from "@/assets/icon/building.svg";
import drawingIcon from "@/assets/icon/drawing.svg";
import PurpleCalendarIcon from "@/assets/icon/PurpleCalendarIcon.svg";
import { useGetProjectBuildingsQuery } from "@/redux/api/drawingsApi";

const OverviewSkeleton: React.FC = () => {
  return (
    <div className="bg-[#F4F7FF] rounded-xl border border-slate-100 shadow-xs p-3.5 md:p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 animate-pulse">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3.5 flex-1 min-w-0">
        <div className="w-full sm:w-[160px] h-[95px] shrink-0 rounded-lg bg-slate-200 flex items-center justify-center">
          <Building2 className="w-8 h-8 text-slate-300" />
        </div>
        <div className="space-y-2 flex-1 min-w-0">
          <div className="h-5 bg-slate-200 rounded-md w-48" />
          <div className="h-3.5 bg-slate-200 rounded-md w-24" />
          <div className="h-3.5 bg-slate-200 rounded-md w-36" />
        </div>
      </div>
      <div className="flex items-center justify-between md:justify-end gap-4 md:gap-6 border-t md:border-t-0 pt-3 md:pt-0 border-slate-200/60">
        <div className="hidden md:block w-[1px] h-14 bg-slate-200" />
        <div className="flex items-center gap-2.5 min-w-[90px]">
          <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0" />
          <div className="space-y-1">
            <div className="h-5 w-6 bg-slate-200 rounded-md" />
            <div className="h-3 w-14 bg-slate-200 rounded-md" />
          </div>
        </div>
        <div className="w-[1px] h-12 md:h-14 bg-slate-200" />
        <div className="flex items-center gap-2.5 min-w-[110px]">
          <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0" />
          <div className="space-y-1">
            <div className="h-5 w-6 bg-slate-200 rounded-md" />
            <div className="h-3 w-16 bg-slate-200 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
};

const BuildingCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-3.5 md:p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 animate-pulse">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3.5 flex-1 min-w-0">
        <div className="w-full sm:w-[150px] h-[90px] shrink-0 rounded-lg bg-slate-200 flex items-center justify-center">
          <Building2 className="w-7 h-7 text-slate-300" />
        </div>
        <div className="space-y-2 flex-1 min-w-0">
          <div className="h-5 bg-slate-200 rounded-md w-36" />
          <div className="h-3.5 bg-slate-200 rounded-md w-20" />
        </div>
      </div>
      <div className="flex items-center justify-between md:justify-end gap-4 md:gap-6 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
        <div className="hidden md:block w-[1px] h-14 bg-slate-200" />
        <div className="flex items-center gap-2.5 min-w-[100px]">
          <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0" />
          <div className="space-y-1">
            <div className="h-5 w-6 bg-slate-200 rounded-md" />
            <div className="h-3 w-16 bg-slate-200 rounded-md" />
          </div>
        </div>
        <div className="w-[1px] h-12 md:h-14 bg-slate-200" />
        <div className="flex items-center gap-2.5 min-w-[85px]">
          <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0" />
          <div className="space-y-1">
            <div className="h-5 w-6 bg-slate-200 rounded-md" />
            <div className="h-3 w-14 bg-slate-200 rounded-md" />
          </div>
        </div>
        <div className="w-[1px] h-12 md:h-14 bg-slate-200" />
        <div className="flex items-center gap-2.5 min-w-[110px]">
          <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0" />
          <div className="space-y-1">
            <div className="h-3.5 w-16 bg-slate-200 rounded-md" />
            <div className="h-3 w-14 bg-slate-200 rounded-md" />
          </div>
        </div>
        <div className="pl-1 sm:pl-2">
          <div className="w-24 h-9 rounded-lg bg-slate-200" />
        </div>
      </div>
    </div>
  );
};

const ProjectDrawingsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, isError } = useGetProjectBuildingsQuery(id || "", {
    skip: !id,
  });

  const projectInfo = data?.project;
  const buildingsList = data?.buildings || [];

  const projectTitle = projectInfo?.projectName?.trim() || "Project Drawings";
  const projectCode = projectInfo?.jobId || "N/A";
  const projectLocation = projectInfo?.location?.trim() || "Location not provided";
  const buildingsCount = buildingsList.length;

  const totalDrawingsCount = buildingsList.reduce(
    (acc, b) => acc + (b.totalDrawings || 0),
    0
  );

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
    <div className="p-4 md:p-5 max-w-[1300px] mx-auto space-y-4 font-sans">
      {/* Header section */}
      <div className="space-y-1">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => navigate(-1)}
            className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-3 py-1 rounded-md text-xs md:text-sm font-medium flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5]" />
            Back
          </button>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">
            {isLoading ? "Loading..." : projectTitle}
          </h1>
        </div>
        <p className="text-xs md:text-sm text-slate-500 font-normal pl-0.5">
          Select a building to view its drawings and documents
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-3.5">
          <OverviewSkeleton />
          <BuildingCardSkeleton />
          <BuildingCardSkeleton />
          <BuildingCardSkeleton />
        </div>
      ) : isError ? (
        <div className="text-center py-10 text-slate-500 font-medium bg-white rounded-xl border border-slate-100 shadow-xs">
          Failed to load building drawings. Please try refreshing.
        </div>
      ) : (
        <div className="space-y-3.5">
          {/* Main Project Overview Card */}
          <div className="bg-[#F4F7FF] rounded-xl border border-slate-100 shadow-xs p-3.5 md:p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Left Info: Image Placeholder + Details */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3.5 flex-1 min-w-0">
              <div className="w-full sm:w-[160px] h-[95px] shrink-0 rounded-lg bg-slate-200 border border-slate-300/60 flex items-center justify-center">
                <Building2 className="w-10 h-10 text-slate-400" />
              </div>

              <div className="flex flex-col space-y-1 min-w-0">
                <h2 className="text-base md:text-lg font-bold text-slate-900 leading-tight">
                  {projectTitle}
                </h2>
                <p className="text-xs font-semibold text-[#2563EB]">
                  {projectCode}
                </p>
                <p className="text-xs text-slate-600 font-normal leading-tight">
                  {projectLocation}
                </p>
              </div>
            </div>

            {/* Middle and Right Stats */}
            <div className="flex items-center justify-between md:justify-end gap-4 md:gap-6 border-t md:border-t-0 pt-3 md:pt-0 border-slate-200/60">
              {/* Divider 1 */}
              <div className="hidden md:block w-[1px] h-14 bg-slate-300/60" />

              {/* Buildings Stat */}
              <div className="flex items-center gap-2.5 min-w-[90px]">
                <div className="w-8 h-8 rounded-full bg-[#EAF7ED] flex items-center justify-center shrink-0">
                  <img src={buildingIcon} alt="Buildings" className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-lg md:text-xl font-bold text-slate-900 block leading-none">
                    {buildingsCount}
                  </span>
                  <span className="text-[11px] md:text-xs text-slate-600 font-medium mt-0.5 block">
                    Buildings
                  </span>
                </div>
              </div>

              {/* Divider 2 */}
              <div className="w-[1px] h-12 md:h-14 bg-slate-300/60" />

              {/* Total Drawings Stat */}
              <div className="flex items-center gap-2.5 min-w-[110px]">
                <div className="w-8 h-8 rounded-full bg-[#EBF2FE] flex items-center justify-center shrink-0">
                  <img src={drawingIcon} alt="Total Drawings" className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-lg md:text-xl font-bold text-slate-900 block leading-none">
                    {totalDrawingsCount}
                  </span>
                  <span className="text-[11px] md:text-xs text-slate-600 font-medium mt-0.5 block">
                    Total Drawings
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Building Cards List */}
          {buildingsList.length === 0 ? (
            <div className="text-center py-10 text-slate-500 font-medium bg-white rounded-xl border border-slate-100 shadow-xs">
              No building drawings available for this project.
            </div>
          ) : (
            buildingsList.map((building, index) => (
              <div
                key={building.buildingLabel || index}
                className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-3.5 md:p-4 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 hover:shadow-sm transition-shadow"
              >
                {/* Left Details: Building Image Placeholder + Info */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3.5 flex-1 min-w-0">
                  <div className="w-full sm:w-[150px] h-[90px] shrink-0 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center">
                    <Building2 className="w-8 h-8 text-slate-400" />
                  </div>

                  <div className="flex flex-col space-y-1 min-w-0">
                    <h3 className="text-base md:text-lg font-bold text-slate-900 leading-tight">
                      {building.buildingLabel}
                    </h3>
                  </div>
                </div>

                {/* Right Stats + Action */}
                <div className="flex flex-wrap sm:flex-nowrap items-center justify-between lg:justify-end gap-3 sm:gap-4 md:gap-6 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100">
                  {/* Divider */}
                  <div className="hidden lg:block w-[1px] h-14 bg-slate-200" />

                  {/* Stat 1: Total Drawings */}
                  <div className="flex items-center gap-2 sm:gap-2.5 min-w-[80px] sm:min-w-[100px]">
                    <div className="w-8 h-8 rounded-full bg-[#EBF2FE] flex items-center justify-center shrink-0">
                      <img src={drawingIcon} alt="Total Drawings" className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-lg md:text-xl font-bold text-slate-900 block leading-none">
                        {building.totalDrawings || 0}
                      </span>
                      <span className="text-[11px] md:text-xs text-slate-600 font-medium mt-0.5 block">
                        Total Drawings
                      </span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="w-[1px] h-10 sm:h-12 md:h-14 bg-slate-200" />

                  {/* Stat 2: Documents */}
                  <div className="flex items-center gap-2 sm:gap-2.5 min-w-[70px] sm:min-w-[85px]">
                    <div className="w-8 h-8 rounded-full bg-[#EAF7ED] flex items-center justify-center shrink-0">
                      <img src={buildingIcon} alt="Documents" className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-lg md:text-xl font-bold text-slate-900 block leading-none">
                        {building.totalDocuments || 0}
                      </span>
                      <span className="text-[11px] md:text-xs text-slate-600 font-medium mt-0.5 block">
                        Documents
                      </span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="w-[1px] h-10 sm:h-12 md:h-14 bg-slate-200" />

                  {/* Stat 3: Last Update */}
                  <div className="flex items-center gap-2 sm:gap-2.5 min-w-[90px] sm:min-w-[110px]">
                    <div className="w-8 h-8 rounded-full bg-[#F5F3FF] flex items-center justify-center shrink-0">
                      <img
                        src={PurpleCalendarIcon}
                        alt="Last Update"
                        className="w-4 h-4"
                      />
                    </div>
                    <div>
                      <span className="text-xs md:text-sm font-bold text-slate-900 block leading-none">
                        {formatDate(building.lastUpdate)}
                      </span>
                      <span className="text-[11px] md:text-xs text-slate-600 font-medium mt-0.5 block">
                        Last Update
                      </span>
                    </div>
                  </div>

                  {/* Open Drawings Button */}
                  <div className="w-full sm:w-auto mt-2 sm:mt-0 sm:pl-2">
                    <button
                      onClick={() => {
                        const buildingParam = encodeURIComponent(building.buildingLabel);
                        navigate(
                          id
                            ? `/project-building-drawings/${id}?building=${buildingParam}`
                            : "/project-building-drawings/default"
                        );
                      }}
                      className="w-full sm:w-auto bg-[#1D51A4] hover:bg-[#18448b] text-white px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-colors whitespace-nowrap shadow-xs cursor-pointer text-center"
                    >
                      Open Drawings
                    </button>
                  </div>
                </div>
              </div>
      ))
          )}
    </div>
  )
}
    </div >
  );
};

export default ProjectDrawingsPage;

