import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Building2, User } from "lucide-react";
import type { ActiveProjectOverview } from "@/redux/api/dashboardApi";

interface ActiveProjectsOverviewProps {
  data?: ActiveProjectOverview | null;
}

const formatDate = (dateStr?: string | null) => {
  if (!dateStr) return "-";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr || "-";
  }
};

const ActiveProjectsOverview = ({ data }: ActiveProjectsOverviewProps) => {
  if (!data) {
    return (
      <Card className="w-full bg-white border border-slate-100/80 shadow-sm rounded-2xl p-5 md:p-6 gap-0">
        <CardHeader className="p-0 mb-5">
          <CardTitle className="text-lg md:text-xl font-bold text-slate-900">
            Active Project Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <p className="text-sm text-slate-500">No active project overview available.</p>
        </CardContent>
      </Card>
    );
  }

  const projectName = data.projectName || "-";
  const projectCode = data.projectCode || "-";
  const siteLocation = data.siteLocation || "-";
  const progressPercentage = data.progressPct !== undefined && data.progressPct !== null
    ? `${data.progressPct}% Completed`
    : "-";
  const currentStatus = data.currentStage || "-";
  const nextMilestoneDate = data.nextMilestone?.targetDate
    ? `${data.nextMilestone.title ? data.nextMilestone.title + " - " : ""}${formatDate(data.nextMilestone.targetDate)}`
    : data.nextMilestone?.title || "-";
  
  const pmName = data.projectManager?.name || "Not assigned";
  const pmPhone = data.projectManager?.phone || "";
  const pmAvatar = data.projectManager?.avatar || "";
  const projectImage = data.image || null;

  return (
    <Card className="w-full bg-white border border-slate-100/80 shadow-sm rounded-2xl p-5 md:p-6 gap-0">
      <CardHeader className="p-0 mb-5">
        <CardTitle className="text-lg md:text-xl font-bold text-slate-900">
          Active Project Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 space-y-5">
        {/* Top Info Section: Warehouse image + Title & details */}
        <div className="flex items-start gap-4 sm:gap-5">
          {projectImage ? (
            <img
              src={projectImage}
              alt={projectName}
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover shrink-0 shadow-xs"
            />
          ) : (
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 text-slate-400">
              <Building2 className="w-10 h-10" />
            </div>
          )}
          <div className="flex flex-col justify-center py-1 gap-1">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              {projectName}
            </h3>
            <p className="text-sm text-slate-600 font-normal">
              Project Code: {projectCode}
            </p>
            <p className="text-sm text-slate-500 font-medium">
              Site Location: {siteLocation}
            </p>
          </div>
        </div>

        {/* Status / Progress Summary Box */}
        <div className="bg-[#F8FAFC] rounded-2xl p-4 sm:p-5 border border-slate-100">
          <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-200/80">
            <div className="pr-2 border-r border-slate-200/80">
              <p className="text-sm text-slate-500 font-medium mb-1">
                Progress
              </p>
              <p className="text-base sm:text-lg font-bold text-slate-900">
                {progressPercentage}
              </p>
            </div>
            <div className="pl-2">
              <p className="text-sm text-slate-500 font-medium mb-1">
                Current Stage
              </p>
              <p className="text-base sm:text-lg font-bold text-slate-900">
                {currentStatus}
              </p>
            </div>
          </div>

          <div className="pt-4">
            <p className="text-sm text-slate-500 font-medium mb-1">
              Next Milestone
            </p>
            <p className="text-base sm:text-lg font-bold text-slate-900">
              {nextMilestoneDate}
            </p>
          </div>
        </div>

        {/* Assigned Project Manager Footer Row */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-3">
            {pmAvatar ? (
              <img
                src={pmAvatar}
                alt={pmName}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover shrink-0"
              />
            ) : (
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 text-slate-400">
                <User className="w-5 h-5" />
              </div>
            )}
            <div>
              <p className="text-xs sm:text-sm font-medium text-[#2563EB]">
                Assigned project manager
              </p>
              <p className="text-sm sm:text-base font-bold text-slate-900">
                {pmName}
              </p>
            </div>
          </div>
          {pmPhone ? (
            <span className="text-sm sm:text-base font-bold text-slate-900 whitespace-nowrap">
              {pmPhone}
            </span>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActiveProjectsOverview;
