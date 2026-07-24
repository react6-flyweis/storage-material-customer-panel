import React from "react";
import {
  useGetDeliveriesSummaryQuery,
  type DeliverySummaryProject,
} from "@/redux/api/deliveriesApi";
import { Truck, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";



const SkeletonDeliveryCard: React.FC = () => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 rounded-2xl border border-[#E4E7EC] bg-white p-5 shadow-xs animate-pulse">
      {/* Image & Project Basic Info Skeleton */}
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

      {/* Delivery Status Counters Skeleton */}
      <div className="grid grid-cols-3 gap-6 lg:gap-12 flex-1 max-w-xl">
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
            <div className="h-3 w-12 bg-slate-200 rounded-md" />
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

const DeliverySchedule: React.FC = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useGetDeliveriesSummaryQuery();
  const projectsList: DeliverySummaryProject[] = data?.projects || [];

  const handleViewProject = (projectId: string) => {
    navigate(`/project-delivery-schedule/${projectId}`);
  };

  return (
    <div className="p-5 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#101828]">My Delivery Schedule</h1>
          <p className="text-sm text-[#4A5565] mt-1">
            Track your project deliveries and receive notifications
          </p>
        </div>

        {/* <div className="flex items-center gap-4">
          <button className="flex bg-white items-center gap-3 px-4 py-2 shadow-xs border border-[#E4E7EC] rounded-xl hover:bg-gray-50 transition-colors text-sm min-w-[200px]">
            <div className="bg-[#1E40AF] text-white rounded-full w-9 h-9 flex items-center justify-center font-bold text-sm">
              AM
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-[#101828] leading-tight">
                Austin McClume
              </p>
              <p className="text-xs text-[#667085] leading-tight">
                ABC Logistics Warehouse
              </p>
            </div>
          </button>

          <button className="flex items-center gap-2 rounded-lg bg-[#1E40AF] px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90">
            <QrCode className="w-4 h-4" />
            Scan QR
          </button>
        </div> */}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <SkeletonDeliveryCard />
          <SkeletonDeliveryCard />
          <SkeletonDeliveryCard />
        </div>
      ) : projectsList.length === 0 ? (
        <div className="flex h-48 flex-col items-center justify-center text-center p-6 border border-dashed border-gray-200 rounded-xl bg-white">
          <p className="text-gray-500 font-medium text-lg">No delivery schedules found</p>
          <p className="text-gray-400 text-sm mt-1">
            There are no active projects to display delivery schedules for.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {projectsList.map((project) => {
            return (
              <div
                key={project.leadId}
                className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 rounded-2xl border border-[#E4E7EC] bg-white p-5 shadow-xs transition-shadow hover:shadow-md"
              >
                {/* Project Left Info */}
                <div className="flex items-center gap-5 min-w-[280px]">
                  <div className="h-24 w-36 rounded-xl bg-[#F2F4F7] border border-[#E4E7EC] shrink-0 flex items-center justify-center text-[#667085]">
                    <Building2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#101828]">
                      {project.projectName}
                    </h3>
                    <p className="text-sm text-[#667085] font-medium mt-0.5">
                      {project.jobId}
                    </p>
                    <p className="text-sm text-[#667085] mt-2">
                      {project.location}
                    </p>
                  </div>
                </div>

                {/* Vertical Divider */}
                <div className="hidden lg:block w-[1px] h-16 bg-[#E4E7EC]" />

                {/* Counters */}
                <div className="grid grid-cols-3 gap-6 lg:gap-12 flex-1 max-w-xl">
                  {/* Upcoming */}
                  <div className="flex items-center gap-3">
                    <div className="flex shrink-0 h-11 w-11 items-center justify-center rounded-full bg-[#DCFCE7] text-[#166534]">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-[#101828]">
                        {project.upcoming}
                      </p>
                      <p className="text-sm font-medium text-[#4A5565]">Upcoming</p>
                    </div>
                  </div>

                  {/* Past */}
                  <div className="flex items-center gap-3">
                    <div className="flex shrink-0 h-11 w-11 items-center justify-center rounded-full bg-[#E0E7FF] text-[#3730A3]">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-[#101828]">
                        {project.past}
                      </p>
                      <p className="text-sm font-medium text-[#4A5565]">Past</p>
                    </div>
                  </div>

                  {/* Reschedule */}
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center shrink-0 rounded-full bg-[#FFEDD5] text-[#9A3412]">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-[#101828]">
                        {project.rescheduled}
                      </p>
                      <p className="text-sm font-medium text-[#4A5565]">
                        Reschedule
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

export default DeliverySchedule;
