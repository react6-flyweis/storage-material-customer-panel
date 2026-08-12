import React from "react";
import { ArrowLeft, Building2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import buildingIcon from "@/assets/icon/building.svg";
import drawingIcon from "@/assets/icon/drawing.svg";
import PurpleCalendarIcon from "@/assets/icon/PurpleCalendarIcon.svg";
import { useGetProjectBuildingsQuery } from "@/redux/api/drawingsApi";

const OverviewSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6 px-1 py-1 animate-pulse">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1 min-w-0">
        <div className="w-full sm:w-[160px] md:w-[180px] h-[100px] sm:h-[110px] shrink-0 rounded-xl bg-slate-200 flex items-center justify-center">
          <Building2 className="w-8 h-8 text-slate-300" />
        </div>
        <div className="space-y-2 flex-1 min-w-0">
          <div className="h-6 bg-slate-200 rounded-md w-52" />
          <div className="h-4 bg-slate-200 rounded-md w-24" />
          <div className="h-4 bg-slate-200 rounded-md w-36" />
        </div>
      </div>
      <div className="flex flex-wrap sm:flex-nowrap items-center justify-between sm:justify-end gap-4 sm:gap-6 lg:gap-8 border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-200/60 shrink-0">
        <div className="hidden lg:block w-px h-14 bg-slate-200 shrink-0" />
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-full bg-slate-200 shrink-0" />
          <div className="space-y-1">
            <div className="h-6 w-8 bg-slate-200 rounded-md" />
            <div className="h-3.5 w-16 bg-slate-200 rounded-md" />
          </div>
        </div>
        <div className="w-px h-10 sm:h-12 bg-slate-200 shrink-0" />
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-full bg-slate-200 shrink-0" />
          <div className="space-y-1">
            <div className="h-6 w-8 bg-slate-200 rounded-md" />
            <div className="h-3.5 w-20 bg-slate-200 rounded-md" />
          </div>
        </div>
        <div className="w-px h-10 sm:h-12 bg-slate-200 shrink-0" />
        <div className="flex flex-col items-center justify-center shrink-0">
          <div className="h-3.5 w-20 bg-slate-200 rounded-md mb-2" />
          <div className="h-7 w-18 bg-slate-200 rounded-full" />
        </div>
      </div>
    </div>
  );
};

const BuildingCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100/80 shadow-xs p-4 sm:p-5 flex flex-col 2xl:flex-row items-stretch 2xl:items-center justify-between gap-5 2xl:gap-6 animate-pulse">
      <div className="flex items-center gap-4 shrink-0">
        <div className="w-[140px] sm:w-[160px] h-[90px] sm:h-[100px] shrink-0 rounded-xl bg-slate-200 flex items-center justify-center">
          <Building2 className="w-8 h-8 text-slate-300" />
        </div>
        <div className="space-y-2 min-w-[130px] shrink-0">
          <div className="h-6 bg-slate-200 rounded-md w-32" />
          <div className="h-4 bg-slate-200 rounded-md w-20" />
          <div className="h-4 bg-slate-200 rounded-md w-24" />
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between 2xl:justify-end gap-4 sm:gap-6 2xl:gap-8 border-t 2xl:border-t-0 pt-4 2xl:pt-0 border-slate-100">
        <div className="hidden 2xl:block w-px h-14 bg-slate-200 shrink-0" />
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-200 shrink-0" />
          <div className="space-y-1">
            <div className="h-6 w-8 bg-slate-200 rounded-md" />
            <div className="h-3.5 w-20 bg-slate-200 rounded-md" />
          </div>
        </div>
        <div className="w-px h-10 sm:h-12 bg-slate-200 shrink-0" />
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-200 shrink-0" />
          <div className="space-y-1">
            <div className="h-6 w-8 bg-slate-200 rounded-md" />
            <div className="h-3.5 w-16 bg-slate-200 rounded-md" />
          </div>
        </div>
        <div className="w-px h-10 sm:h-12 bg-slate-200 shrink-0" />
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-200 shrink-0" />
          <div className="space-y-1">
            <div className="h-4 w-20 bg-slate-200 rounded-md" />
            <div className="h-3.5 w-16 bg-slate-200 rounded-md" />
          </div>
        </div>
        <div className="w-full sm:w-auto mt-2 sm:mt-0 2xl:ml-2 shrink-0">
          <div className="w-28 h-10 rounded-xl bg-slate-200" />
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

  const projectTitle = projectInfo?.projectName?.trim() || "ABC Logistic Warehouse";
  const projectCode = projectInfo?.jobId || "PEB-1021";
  const projectLocation = projectInfo?.location?.trim() || "Pune, Maharashtra";
  const buildingsCount = buildingsList.length;

  const totalDrawingsCount = buildingsList.reduce(
    (acc, b) => acc + (b.totalDrawings || 0),
    0
  );

  const formatDate = (dateString?: string) => {
    if (!dateString) return "12 April 2026";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="p-4 md:p-6 font-sans">
      <div className="max-w-[1300px] mx-auto space-y-6">
        {/* Header section */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-3.5 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors shadow-xs cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
              Back
            </button>
            <h1 className="text-2xl md:text-3xl font-semibold text-[#1E293B] tracking-tight">
              {isLoading ? "Loading..." : projectTitle}
            </h1>
          </div>
          <p className="text-xs md:text-sm text-[#64748B] font-medium pl-0.5">
            Select a building to view its drawings and documents
          </p>
        </div>

        {/* Outer card container with light gray background (#F8FAFC) */}
        <div className="bg-[#F8FAFC] rounded-2xl border border-slate-200/80 p-4 sm:p-6 space-y-6 shadow-xs">
          {isLoading ? (
            <div className="space-y-4">
              <OverviewSkeleton />
              <BuildingCardSkeleton />
              <BuildingCardSkeleton />
              <BuildingCardSkeleton />
            </div>
          ) : isError ? (
            <div className="text-center py-12 text-slate-500 font-medium bg-white rounded-2xl border border-slate-100/80 shadow-xs">
              Failed to load building drawings. Please try refreshing.
            </div>
          ) : (
            <>
              {/* Main Project Overview Top Section */}
              <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6 px-1 py-1">
                {/* Left Info: Image + Details */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1 min-w-0">
                  <div className="w-full sm:w-[160px] md:w-[180px] h-[100px] sm:h-[110px] shrink-0 rounded-xl overflow-hidden bg-white border border-slate-200/80 flex items-center justify-center shadow-2xs">
                    <Building2 className="w-10 h-10 text-slate-400" />
                  </div>

                  <div className="flex flex-col space-y-1 min-w-0">
                    <h2 className="text-lg md:text-xl font-bold text-[#0F172A] leading-snug">
                      {projectTitle}
                    </h2>
                    <p className="text-xs md:text-sm font-medium text-[#2563EB]">
                      {projectCode}
                    </p>
                    <p className="text-xs md:text-sm text-[#64748B] font-normal leading-relaxed mt-0.5">
                      {projectLocation}
                    </p>
                  </div>
                </div>

                {/* Middle and Right Stats */}
                <div className="flex flex-wrap sm:flex-nowrap items-center justify-between sm:justify-end gap-4 sm:gap-6 lg:gap-8 border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-200/60 shrink-0">
                  {/* Divider 1 */}
                  <div className="hidden lg:block w-px h-14 bg-slate-300/60 shrink-0" />

                  {/* Buildings Stat */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="w-10 h-10 rounded-full bg-[#EBFDED] flex items-center justify-center shrink-0">
                      <img src={buildingIcon} alt="Buildings" className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xl md:text-2xl font-bold text-[#0F172A] block leading-none">
                        {buildingsCount}
                      </span>
                      <span className="text-xs text-[#64748B] font-medium mt-1 block whitespace-nowrap">
                        Buildings
                      </span>
                    </div>
                  </div>

                  {/* Divider 2 */}
                  <div className="w-px h-10 sm:h-12 bg-slate-300/60 shrink-0" />

                  {/* Total Drawings Stat */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="w-10 h-10 rounded-full bg-[#EEF4FF] flex items-center justify-center shrink-0">
                      <img src={drawingIcon} alt="Total Drawings" className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xl md:text-2xl font-bold text-[#0F172A] block leading-none">
                        {totalDrawingsCount}
                      </span>
                      <span className="text-xs text-[#64748B] font-medium mt-1 block whitespace-nowrap">
                        Total Drawings
                      </span>
                    </div>
                  </div>

                  {/* Divider 3 */}
                  <div className="w-px h-10 sm:h-12 bg-slate-300/60 shrink-0" />

                  {/* Project Status Badge */}
                  <div className="flex flex-col items-center justify-center shrink-0">
                    <span className="text-xs text-[#64748B] font-medium mb-1.5 block text-center whitespace-nowrap">
                      Project Status
                    </span>
                    <span className="bg-[#DCFCE7] text-[#166534] px-3.5 py-1 rounded-full text-xs font-semibold tracking-wide whitespace-nowrap">
                      Active
                    </span>
                  </div>
                </div>
              </div>

              {/* Building Cards List below overview inside outer container */}
              <div className="space-y-4">
                {buildingsList.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 font-medium bg-white rounded-2xl border border-slate-100/80 shadow-xs">
                    No building drawings available for this project.
                  </div>
                ) : (
                  buildingsList.map((building, index) => (
                    <div
                      key={building.buildingLabel || index}
                      className="bg-white rounded-2xl border border-slate-100/80 shadow-xs p-4 sm:p-5 flex flex-col 2xl:flex-row items-stretch 2xl:items-center justify-between gap-5 2xl:gap-6 hover:shadow-md transition-shadow duration-200"
                    >
                      {/* Left Details: Building Image Placeholder + Info */}
                      <div className="flex items-center gap-4 shrink-0">
                        <div className="w-[140px] sm:w-[160px] h-[90px] sm:h-[100px] shrink-0 rounded-xl overflow-hidden bg-slate-100 border border-slate-200/60 flex items-center justify-center">
                          <Building2 className="w-8 h-8 text-slate-400" />
                        </div>

                        <div className="flex flex-col space-y-1 min-w-[130px] shrink-0">
                          <h3 className="text-base sm:text-lg font-bold text-[#0F172A] leading-snug whitespace-nowrap">
                            {building.buildingLabel}
                          </h3>
                          <p className="text-xs font-medium text-[#2563EB] whitespace-nowrap">
                            BLDG-A
                          </p>
                          <p className="text-xs text-[#64748B] font-normal mt-0.5 whitespace-nowrap">
                            Ground Floor
                          </p>
                        </div>
                      </div>

                      {/* Right Stats + Action */}
                      <div className="flex flex-wrap items-center justify-between 2xl:justify-end gap-4 sm:gap-6 2xl:gap-8 border-t 2xl:border-t-0 pt-4 2xl:pt-0 border-slate-100">
                        {/* Divider */}
                        <div className="hidden 2xl:block w-px h-14 bg-slate-200/80 shrink-0" />

                        {/* Stat 1: Total Drawings */}
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#EEF4FF] flex items-center justify-center shrink-0">
                            <img src={drawingIcon} alt="Total Drawings" className="w-4 h-4 sm:w-5 sm:h-5" />
                          </div>
                          <div className="shrink-0">
                            <span className="text-lg sm:text-xl md:text-2xl font-bold text-[#0F172A] block leading-none">
                              {building.totalDrawings || 0}
                            </span>
                            <span className="text-xs text-[#64748B] font-medium mt-1 block whitespace-nowrap">
                              Total Drawings
                            </span>
                          </div>
                        </div>

                        {/* Divider */}
                        <div className="w-px h-10 sm:h-12 bg-slate-200/80 shrink-0" />

                        {/* Stat 2: Documents */}
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#EBFDED] flex items-center justify-center shrink-0">
                            <img src={buildingIcon} alt="Documents" className="w-4 h-4 sm:w-5 sm:h-5" />
                          </div>
                          <div className="shrink-0">
                            <span className="text-lg sm:text-xl md:text-2xl font-bold text-[#0F172A] block leading-none">
                              {building.totalDocuments || 4}
                            </span>
                            <span className="text-xs text-[#64748B] font-medium mt-1 block whitespace-nowrap">
                              Documents
                            </span>
                          </div>
                        </div>

                        {/* Divider */}
                        <div className="w-px h-10 sm:h-12 bg-slate-200/80 shrink-0" />

                        {/* Stat 3: Last Update */}
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#F5F3FF] flex items-center justify-center shrink-0">
                            <img
                              src={PurpleCalendarIcon}
                              alt="Last Update"
                              className="w-4 h-4 sm:w-5 sm:h-5"
                            />
                          </div>
                          <div className="shrink-0">
                            <span className="text-xs sm:text-sm font-bold text-[#0F172A] block leading-none whitespace-nowrap">
                              {formatDate(building.lastUpdate)}
                            </span>
                            <span className="text-xs text-[#64748B] font-medium mt-1 block whitespace-nowrap">
                              Last Update
                            </span>
                          </div>
                        </div>

                        {/* Open Drawings Button */}
                        <div className="w-full sm:w-auto mt-2 sm:mt-0 2xl:ml-2 shrink-0">
                          <button
                            onClick={() => {
                              const buildingParam = encodeURIComponent(building.buildingLabel);
                              navigate(
                                id
                                  ? `/project-building-drawings/${id}?building=${buildingParam}`
                                  : "/project-building-drawings/default"
                              );
                            }}
                            className="w-full sm:w-auto bg-[#1E56A0] hover:bg-[#194785] text-white px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-colors whitespace-nowrap shadow-xs cursor-pointer text-center"
                          >
                            Open Drawings
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDrawingsPage;
