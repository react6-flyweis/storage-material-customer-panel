import { useGetProjectsQuery } from "@/redux/api/projectsApi";
import { QrCode, Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";
// import warehouseImg1 from "@/assets/";

export interface ProjectScheduleCardData {
  id: string;
  title: string;
  code: string;
  location: string;
  image: string;
  upcomingCount: number;
  pastCount: number;
  rescheduleCount: number;
}

const placeholderImages = [
  "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=600&q=80",
];

const DeliverySchedule = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useGetProjectsQuery({ page: 1, limit: 100 });
  const projectsList = data?.projects || [];

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

        <div className="flex items-center gap-4">
          <button className="flex bg-white items-center gap-3 px-4 py-2 shadow-sm border border-[#E4E7EC] rounded-xl hover:bg-gray-50 transition-colors text-sm min-w-[200px]">
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
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#1E40AF] border-t-transparent"></div>
        </div>
      ) : projectsList.length === 0 ? (
        <div className="flex h-48 flex-col items-center justify-center text-center p-6 border border-dashed border-gray-200 rounded-xl bg-white">
          <p className="text-gray-500 font-medium text-lg">No projects found</p>
          <p className="text-gray-400 text-sm mt-1">There are no active projects to display delivery schedules for.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {projectsList.map((project, index) => {
            const projectImage = placeholderImages[index % placeholderImages.length] || ""

            return (
              <div
                key={project._id || project.projectId}
                className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 rounded-2xl border border-[#E4E7EC] bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
              >
                {/* Project Left Info */}
                <div className="flex items-center gap-5 min-w-[280px]">
                  <img
                    src={projectImage}
                    alt={project.projectName}
                    className="h-24 w-36 rounded-xl object-cover"
                  />
                  <div>
                    <h3 className="text-lg font-bold text-[#101828]">
                      {project.projectName || "ABC Logistics Warehouse"}
                    </h3>
                    <p className="text-sm text-[#667085] font-medium mt-0.5">
                      {project.jobId || project.projectId || "PEB-1021"}
                    </p>
                    <p className="text-sm text-[#667085] mt-2">
                      {project.location || "Pune, Maharashtra"}
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
                      <p className="text-xl font-bold text-[#101828]">3</p>
                      <p className="text-sm font-medium text-[#4A5565]">Upcoming</p>
                    </div>
                  </div>

                  {/* Past */}
                  <div className="flex items-center gap-3">
                    <div className="flex shrink-0 h-11 w-11 items-center justify-center rounded-full bg-[#E0E7FF] text-[#3730A3]">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-[#101828]">1</p>
                      <p className="text-sm font-medium text-[#4A5565]">Past</p>
                    </div>
                  </div>

                  {/* Reschedule */}
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center shrink-0 rounded-full bg-[#FFEDD5] text-[#9A3412]">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-[#101828]">1</p>
                      <p className="text-sm font-medium text-[#4A5565]">Reschedule</p>
                    </div>
                  </div>
                </div>

                {/* Vertical Divider */}
                <div className="hidden lg:block w-[1px] h-16 bg-[#E4E7EC]" />

                {/* Action Button */}
                <div>
                  <button
                    onClick={() => handleViewProject(project._id || project.projectId)}
                    className="w-full lg:w-auto px-7 py-2.5 rounded-lg bg-[#1E40AF] text-white font-semibold text-sm hover:bg-[#1d3999] transition-colors"
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
