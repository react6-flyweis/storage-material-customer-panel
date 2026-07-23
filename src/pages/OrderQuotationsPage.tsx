import React from "react";
import { useNavigate } from "react-router-dom";
import { useGetQuotationsSummaryQuery, type QuotationSummaryProject } from "@/redux/api/quotationsApi";
import { FileCheck, ClipboardCheck, CheckCircle2, Building2 } from "lucide-react";

export interface QuotationProjectItem {
  id: string;
  name: string;
  code: string;
  location: string;
  newQuotation: number;
  pendingApproval: number;
  approved: number;
}

const SkeletonCard: React.FC = () => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 rounded-2xl border border-white/60 bg-white p-5 shadow-xs animate-pulse">
      {/* Image Placeholder & Project Basic Info Skeleton */}
      <div className="flex items-center gap-5 min-w-[300px]">
        <div className="h-28 w-44 rounded-xl bg-slate-200 shrink-0 flex items-center justify-center">
          <Building2 className="w-8 h-8 text-slate-300" />
        </div>
        <div className="space-y-3 flex-1">
          <div className="h-5 bg-slate-200 rounded-md w-40" />
          <div className="h-4 bg-slate-200 rounded-md w-24" />
          <div className="h-4 bg-slate-200 rounded-md w-32" />
        </div>
      </div>

      {/* Status Counters Section Skeleton */}
      <div className="flex flex-wrap lg:flex-nowrap items-center justify-between gap-4 lg:gap-8 flex-1 max-w-2xl">
        <div className="hidden lg:block w-[1px] h-20 bg-[#E2E8F0]" />

        <div className="flex flex-col items-start min-w-[100px] space-y-2">
          <div className="h-10 w-10 rounded-full bg-slate-200" />
          <div className="h-6 w-8 bg-slate-200 rounded-md" />
          <div className="h-3 w-20 bg-slate-200 rounded-md" />
        </div>

        <div className="hidden lg:block w-[1px] h-20 bg-[#E2E8F0]" />

        <div className="flex flex-col items-start min-w-[100px] space-y-2">
          <div className="h-10 w-10 rounded-full bg-slate-200" />
          <div className="h-6 w-8 bg-slate-200 rounded-md" />
          <div className="h-3 w-20 bg-slate-200 rounded-md" />
        </div>

        <div className="hidden lg:block w-[1px] h-20 bg-[#E2E8F0]" />

        <div className="flex flex-col items-start min-w-[100px] space-y-2">
          <div className="h-10 w-10 rounded-full bg-slate-200" />
          <div className="h-6 w-8 bg-slate-200 rounded-md" />
          <div className="h-3 w-20 bg-slate-200 rounded-md" />
        </div>

        <div className="hidden lg:block w-[1px] h-20 bg-[#E2E8F0]" />
      </div>

      {/* Action Button Skeleton */}
      <div className="flex items-center justify-end min-w-[110px]">
        <div className="w-full lg:w-[100px] h-10 rounded-lg bg-slate-200" />
      </div>
    </div>
  );
};

const OrderQuotationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetQuotationsSummaryQuery();
  const projectsList = data?.projects || [];

  const handleViewProject = (projectId: string) => {
    navigate(`/project-order-quotations/${projectId}`);
  };

  const displayList: QuotationProjectItem[] = projectsList.map(
    (p: QuotationSummaryProject, idx: number) => ({
      id: p.leadId || `proj-${idx}`,
      name: p.projectName?.trim() || "Untitled Project",
      code: p.jobId || ``,
      location: p.location?.trim() || "Location unavailable",
      newQuotation: p.newQuotation || 0,
      pendingApproval: p.pendingApproval || 0,
      approved: p.approved || 0,
    })
  );

  return (
    <div className="p-6 md:p-8 space-y-6 bg-[#E5ECFF] min-h-screen">
      {/* Header Section */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-[#1E293B]">
          Order Quotations
        </h1>
        <p className="text-sm text-[#64748B] mt-1">
          View and manage all your order quotations approve, reject, and more.
        </p>
      </div>

      {/* Section Title */}
      <div>
        <h2 className="text-lg font-bold text-[#1E293B]">Project List</h2>
      </div>

      {/* Skeleton Loading State */}
      {isLoading ? (
        <div className="space-y-5">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : isError ? (
        <div className="rounded-2xl bg-white p-8 text-center text-[#64748B] shadow-xs">
          Failed to load order quotations summary. Please try refreshing.
        </div>
      ) : displayList.length === 0 ? (
        <div className="rounded-2xl bg-white p-8 text-center text-[#64748B] shadow-xs">
          No order quotations found.
        </div>
      ) : (
        <div className="space-y-5">
          {displayList.map((item) => (
            <div
              key={item.id}
              className="flex flex-col xl:flex-row xl:items-center justify-between gap-5 sm:gap-6 rounded-2xl border border-white/60 bg-white p-4 sm:p-5 shadow-xs transition-shadow hover:shadow-sm"
            >
              {/* Image & Project Basic Info */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5 min-w-0 xl:min-w-[280px]">
                <div className="h-24 sm:h-28 w-full sm:w-44 rounded-xl bg-slate-100 border border-slate-200 shrink-0 flex flex-col items-center justify-center text-slate-400 gap-1">
                  <Building2 className="w-7 h-7 sm:w-8 sm:h-8 text-slate-400" />
                  <span className="text-xs font-medium text-slate-400">No Image</span>
                </div>
                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-[#0F172A] leading-snug break-words">
                    {item.name}
                  </h3>
                  <p className="text-xs sm:text-sm font-semibold text-[#94A3B8] mt-1">
                    {item.code}
                  </p>
                  <p className="text-xs sm:text-sm font-medium text-[#64748B] mt-2 sm:mt-3 leading-tight break-words">
                    {item.location}
                  </p>
                </div>
              </div>

              {/* Status Counters Section */}
              <div className="grid grid-cols-3 sm:flex sm:flex-wrap lg:flex-nowrap items-center justify-between gap-3 sm:gap-4 lg:gap-6 flex-1 max-w-full xl:max-w-2xl border-t border-b xl:border-none border-slate-100 py-3 xl:py-0">
                {/* Vertical Divider for XL screens */}
                <div className="hidden xl:block w-[1px] h-16 bg-[#E2E8F0]" />

                {/* New Quotation */}
                <div className="flex flex-col items-start min-w-0">
                  <div className="flex shrink-0 h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-[#EFF6FF] text-[#3B82F6] mb-2 sm:mb-3">
                    <FileCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <span className="text-xl sm:text-2xl font-bold text-[#0F172A]">
                    {item.newQuotation}
                  </span>
                  <span className="text-[11px] sm:text-xs font-semibold text-[#64748B] mt-0.5 leading-tight">
                    New Quotation
                  </span>
                </div>

                {/* Vertical Divider */}
                <div className="hidden xl:block w-[1px] h-16 bg-[#E2E8F0]" />

                {/* Pending Approval */}
                <div className="flex flex-col items-start min-w-0">
                  <div className="flex shrink-0 h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-[#FEF9C3] text-[#EAB308] mb-2 sm:mb-3">
                    <ClipboardCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <span className="text-xl sm:text-2xl font-bold text-[#0F172A]">
                    {item.pendingApproval}
                  </span>
                  <span className="text-[11px] sm:text-xs font-semibold text-[#64748B] mt-0.5 leading-tight">
                    Pending Approval
                  </span>
                </div>

                {/* Vertical Divider */}
                <div className="hidden xl:block w-[1px] h-16 bg-[#E2E8F0]" />

                {/* Approved */}
                <div className="flex flex-col items-start min-w-0">
                  <div className="flex shrink-0 h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-[#DCFCE7] text-[#22C55E] mb-2 sm:mb-3">
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <span className="text-xl sm:text-2xl font-bold text-[#0F172A]">
                    {item.approved}
                  </span>
                  <span className="text-[11px] sm:text-xs font-semibold text-[#64748B] mt-0.5 leading-tight">
                    Approved
                  </span>
                </div>

                {/* Vertical Divider */}
                <div className="hidden xl:block w-[1px] h-16 bg-[#E2E8F0]" />
              </div>

              {/* Action Button */}
              <div className="flex items-center justify-end w-full xl:w-auto min-w-0 xl:min-w-[100px]">
                <button
                  onClick={() => handleViewProject(item.id)}
                  className="w-full xl:w-[100px] py-2.5 rounded-lg bg-[#1E40AF] text-white font-medium text-sm hover:bg-[#1d3999] transition-colors shadow-xs cursor-pointer"
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderQuotationsPage;
