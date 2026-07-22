import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { activeProjectData } from "@/data/mockData";

interface ActiveProjectsOverviewProps {
  data?: {
    projectName?: string;
    projectCode?: string;
    siteLocation?: string;
    progressPercentage?: string;
    currentStatus?: string;
    nextMilestoneDate?: string;
    assignedProjectManager?: string;
    pmPhone?: string;
    projectImage?: string;
    pmAvatar?: string;
  };
}

const ActiveProjectsOverview = ({ data }: ActiveProjectsOverviewProps) => {
  const project = {
    projectName: data?.projectName || activeProjectData.projectName || "ABC Logistics Warehouse",
    projectCode: data?.projectCode || activeProjectData.projectCode || "PR-0987",
    siteLocation: data?.siteLocation || activeProjectData.siteLocation || "Baner, Pune",
    progressPercentage: data?.progressPercentage || activeProjectData.progressPercentage || "78% Completed",
    currentStatus: data?.currentStatus || activeProjectData.currentStatus || "Under Fabrication",
    nextMilestoneDate: data?.nextMilestoneDate || activeProjectData.nextMilestoneDate || "12 April 2026",
    assignedProjectManager: data?.assignedProjectManager || activeProjectData.assignedProjectManager || "Riya Sharma",
    pmPhone: data?.pmPhone || activeProjectData.pmPhone || "+91-0987654321",
    projectImage: data?.projectImage || activeProjectData.projectImage || "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=400&q=80",
    pmAvatar: data?.pmAvatar || activeProjectData.pmAvatar || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
  };

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
          <img
            src={project.projectImage}
            alt={project.projectName}
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover shrink-0 shadow-xs"
          />
          <div className="flex flex-col justify-center py-1 gap-1">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              {project.projectName}
            </h3>
            <p className="text-sm text-slate-600 font-normal">
              Project Code: {project.projectCode}
            </p>
            <p className="text-sm text-slate-500 font-medium">
              Site Location: {project.siteLocation}
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
                {project.progressPercentage}
              </p>
            </div>
            <div className="pl-2">
              <p className="text-sm text-slate-500 font-medium mb-1">
                Current Stage
              </p>
              <p className="text-base sm:text-lg font-bold text-slate-900">
                {project.currentStatus}
              </p>
            </div>
          </div>

          <div className="pt-4">
            <p className="text-sm text-slate-500 font-medium mb-1">
              Next Milestone
            </p>
            <p className="text-base sm:text-lg font-bold text-slate-900">
              {project.nextMilestoneDate}
            </p>
          </div>
        </div>

        {/* Assigned Project Manager Footer Row */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-3">
            <img
              src={project.pmAvatar}
              alt={project.assignedProjectManager}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover shrink-0"
            />
            <div>
              <p className="text-xs sm:text-sm font-medium text-[#2563EB]">
                Assigned project manager
              </p>
              <p className="text-sm sm:text-base font-bold text-slate-900">
                {project.assignedProjectManager}
              </p>
            </div>
          </div>
          <span className="text-sm sm:text-base font-bold text-slate-900 whitespace-nowrap">
            {project.pmPhone}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActiveProjectsOverview;
