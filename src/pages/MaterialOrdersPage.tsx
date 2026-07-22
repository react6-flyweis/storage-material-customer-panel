import React from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGetProjectsQuery } from "@/redux/api/projectsApi";
import { Layers, Clock, CheckCircle2 } from "lucide-react";

const placeholderImages = [
  "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=600&q=80",
];

const MaterialOrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useGetProjectsQuery({ page: 1, limit: 100 });
  const projectsList = data?.projects || [];

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
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1E40AF] px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-[#1d3999] focus:outline-none"
        >
          <Plus className="w-4 h-4" />
          Add New Order Request
        </button>
      </div>

      {/* Section Title */}
      <div>
        <h2 className="text-lg font-bold text-[#101828]">Project List</h2>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#1E40AF] border-t-transparent" />
        </div>
      ) : projectsList.length === 0 ? (
        /* Empty State with Fallback Mock Cards if API has no projects or empty array */
        <div className="space-y-4">
          {[
            {
              id: "peb-1",
              name: "ABC Logistics Warehouse",
              code: "PEB-1021",
              location: "Pune, Maharashtra",
              image: placeholderImages[0],
              newOrders: 3,
              pending: 1,
              completed: 1,
            },
            {
              id: "peb-2",
              name: "Riverside Warehouse",
              code: "PEB-1021",
              location: "Pune, Maharashtra",
              image: placeholderImages[1],
              newOrders: 3,
              pending: 1,
              completed: 1,
            },
            {
              id: "peb-3",
              name: "ABC Logistics Warehouse",
              code: "PEB-1021",
              location: "Pune, Maharashtra",
              image: placeholderImages[2],
              newOrders: 3,
              pending: 1,
              completed: 1,
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 rounded-2xl border border-[#E4E7EC] bg-white p-5 shadow-xs transition-shadow hover:shadow-sm"
            >
              {/* Image & Project Basic Info */}
              <div className="flex items-center gap-5 min-w-[280px]">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-24 w-36 rounded-xl object-cover"
                />
                <div>
                  <h3 className="text-lg font-bold text-[#101828]">
                    {item.name}
                  </h3>
                  <p className="text-sm text-[#667085] font-medium mt-0.5">
                    {item.code}
                  </p>
                  <p className="text-sm text-[#667085] mt-2">
                    {item.location}
                  </p>
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
                      {item.newOrders}
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
                      {item.pending}
                    </p>
                    <p className="text-sm font-medium text-[#4A5565]">Pending</p>
                  </div>
                </div>

                {/* Completed */}
                <div className="flex items-center gap-3">
                  <div className="flex shrink-0 h-11 w-11 items-center justify-center rounded-full bg-[#DCFCE7] text-[#16A34A]">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-[#101828]">
                      {item.completed}
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
                  onClick={() => handleViewProject(item.id)}
                  className="w-full lg:w-auto px-7 py-2.5 rounded-lg bg-[#1E40AF] text-white font-semibold text-sm hover:bg-[#1d3999] transition-colors"
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {projectsList.map((project, index) => {
            const projectImage =
              placeholderImages[index % placeholderImages.length] || "";

            return (
              <div
                key={project._id || project.projectId || index}
                className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 rounded-2xl border border-[#E4E7EC] bg-white p-5 shadow-xs transition-shadow hover:shadow-sm"
              >
                {/* Image & Project Basic Info */}
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

                {/* Order Status Counters */}
                <div className="grid grid-cols-3 gap-4 lg:gap-10 flex-1 max-w-xl">
                  {/* New Orders */}
                  <div className="flex items-center gap-3">
                    <div className="flex shrink-0 h-11 w-11 items-center justify-center rounded-full bg-[#EFF6FF] text-[#3B82F6]">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-[#101828]">3</p>
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
                      <p className="text-xl font-bold text-[#101828]">1</p>
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
                      <p className="text-xl font-bold text-[#101828]">1</p>
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
                    onClick={() =>
                      handleViewProject(project._id || project.projectId)
                    }
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

export default MaterialOrdersPage;
