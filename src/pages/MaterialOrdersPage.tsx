import React from "react";
import { Plus, Layers, Clock, CheckCircle2, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  useGetMaterialOrdersSummaryQuery,
  type MaterialOrdersSummaryProject,
} from "@/redux/api/materialOrdersApi";

const SkeletonCard: React.FC = () => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 rounded-2xl border border-[#E4E7EC] bg-white p-5 shadow-xs animate-pulse">
      {/* Image Placeholder & Project Basic Info Skeleton */}
      <div className="flex items-center gap-5 min-w-[280px]">
        <div className="h-24 w-36 rounded-xl bg-slate-200 shrink-0 flex items-center justify-center">
          <Building2 className="w-7 h-7 text-slate-300" />
        </div>
        <div className="space-y-2.5 flex-1">
          <div className="h-5 bg-slate-200 rounded-md w-40" />
          <div className="h-4 bg-slate-200 rounded-md w-24" />
          <div className="h-4 bg-slate-200 rounded-md w-32" />
        </div>
      </div>

      {/* Vertical Divider */}
      <div className="hidden lg:block w-[1px] h-16 bg-[#E4E7EC]" />

      {/* Order Status Counters Skeleton */}
      <div className="grid grid-cols-3 gap-4 lg:gap-10 flex-1 max-w-xl">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-full bg-slate-200 shrink-0" />
          <div className="space-y-1.5">
            <div className="h-5 w-8 bg-slate-200 rounded-md" />
            <div className="h-3 w-20 bg-slate-200 rounded-md" />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-full bg-slate-200 shrink-0" />
          <div className="space-y-1.5">
            <div className="h-5 w-8 bg-slate-200 rounded-md" />
            <div className="h-3 w-16 bg-slate-200 rounded-md" />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-full bg-slate-200 shrink-0" />
          <div className="space-y-1.5">
            <div className="h-5 w-8 bg-slate-200 rounded-md" />
            <div className="h-3 w-20 bg-slate-200 rounded-md" />
          </div>
        </div>
      </div>

      {/* Vertical Divider */}
      <div className="hidden lg:block w-[1px] h-16 bg-[#E4E7EC]" />

      {/* Action Button Skeleton */}
      <div>
        <div className="w-full lg:w-[84px] h-10 rounded-lg bg-slate-200" />
      </div>
    </div>
  );
};

const MaterialOrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetMaterialOrdersSummaryQuery();
  const projectsList: MaterialOrdersSummaryProject[] = data?.projects || [];

  const handleViewProject = (projectId: string) => {
    navigate(`/project-orders/${projectId}`);
  };

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#101828]">
            Material Orders
          </h1>
          <p className="text-sm text-[#4A5565] mt-1">
            Track and manage all your coil orders in one place.
          </p>
        </div>

        <button
          onClick={() => {
            // Action or modal can be attached here
          }}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1E40AF] px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-[#1d3999] focus:outline-none cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add New Order Request
        </button>
      </div>

      {/* Section Title */}
      <div>
        <h2 className="text-lg font-bold text-[#101828]">Project List</h2>
      </div>

      {/* Loading & Content States */}
      {isLoading ? (
        <div className="space-y-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : isError ? (
        <div className="rounded-2xl bg-white border border-[#E4E7EC] p-8 text-center text-[#4A5565] shadow-xs">
          Failed to load material orders summary. Please try refreshing.
        </div>
      ) : projectsList.length === 0 ? (
        <div className="rounded-2xl bg-white border border-[#E4E7EC] p-8 text-center text-[#4A5565] shadow-xs">
          No material orders found.
        </div>
      ) : (
        <div className="space-y-4">
          {projectsList.map((project, index) => {
            const projectName = project.projectName?.trim() || "Untitled Project";
            const location = project.location?.trim() || "Location unavailable";

            return (
              <div
                key={project.leadId || `project-${index}`}
                className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 rounded-2xl border border-[#E4E7EC] bg-white p-5 shadow-xs transition-shadow hover:shadow-sm"
              >
                {/* Gray Placeholder Image & Project Basic Info */}
                <div className="flex items-center gap-5 min-w-[280px]">
                  <div className="h-24 w-36 rounded-xl bg-slate-100 border border-slate-200 shrink-0 flex flex-col items-center justify-center text-slate-400 gap-1">
                    <Building2 className="w-7 h-7 text-slate-400" />
                    <span className="text-xs font-medium text-slate-400">
                      No Image
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#101828]">
                      {projectName}
                    </h3>
                    {project.jobId && (
                      <p className="text-sm text-[#667085] font-medium mt-0.5">
                        {project.jobId}
                      </p>
                    )}
                    <p className="text-sm text-[#667085] mt-2">{location}</p>
                  </div>
                </div>

                {/* Vertical Divider */}
                <div className="hidden lg:block w-[1px] h-16 bg-[#E4E7EC]" />

                {/* Order Status Counters */}
                <div className="grid grid-cols-3 gap-4 lg:gap-10 flex-1 max-w-xl">
                  {/* New Orders */}
                  <div className="flex items-center gap-3">
                    <div className="flex shrink-0 h-11 w-11 items-center justify-center rounded-full bg-[#EFF6FF] text-[#3B82F6]">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-[#101828]">
                        {project.newOrders ?? 0}
                      </p>
                      <p className="text-sm font-medium text-[#4A5565]">
                        New Orders
                      </p>
                    </div>
                  </div>

                  {/* Pending */}
                  <div className="flex items-center gap-3">
                    <div className="flex shrink-0 h-11 w-11 items-center justify-center rounded-full bg-[#FEF3C7] text-[#D97706]">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-[#101828]">
                        {project.pending ?? 0}
                      </p>
                      <p className="text-sm font-medium text-[#4A5565]">
                        Pending
                      </p>
                    </div>
                  </div>

                  {/* Completed */}
                  <div className="flex items-center gap-3">
                    <div className="flex shrink-0 h-11 w-11 items-center justify-center rounded-full bg-[#DCFCE7] text-[#16A34A]">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-[#101828]">
                        {project.completed ?? 0}
                      </p>
                      <p className="text-sm font-medium text-[#4A5565]">
                        Completed
                      </p>
                    </div>
                  </div>
                </div>

                {/* Vertical Divider */}
                <div className="hidden lg:block w-[1px] h-16 bg-[#E4E7EC]" />

                {/* Action Button */}
                <div>
                  <button
                    onClick={() => handleViewProject(project.leadId)}
                    className="w-full lg:w-auto px-7 py-2.5 rounded-lg bg-[#1E40AF] text-white font-semibold text-sm hover:bg-[#1d3999] transition-colors cursor-pointer"
                  >
                    View
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MaterialOrdersPage;
