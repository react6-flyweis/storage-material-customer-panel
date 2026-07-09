import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetProjectsQuery } from "@/redux/api/projectsApi";
import { PaginationComp } from "../common_components/PaginationComp";

const formatStatus = (status: string) => {
  if (!status) return "-";
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const ProjectsList = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const { data, isLoading, isError } = useGetProjectsQuery({
    page,
    limit: rowsPerPage,
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (newSize: number) => {
    setRowsPerPage(newSize);
    setPage(1);
  };

  const projects = data?.projects || [];
  const totalItems = data?.total || 0;

  return (
    <div className="bg-white rounded-md shadow-sm border border-gray-100 overflow-hidden">
      <div className="xl:p-6 p-4 border-b border-[#00000026]">
        <h2 className="text-xl font-semibold text-gray-800">Projects List</h2>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-275 p-6">
          {/* Table Header */}
          <div className="grid grid-cols-8 gap-4 px-6 mb-4 text-sm font-medium text-gray-500">
            <div className="col-span-1">Project Name</div>
            <div className="col-span-1">Site Location</div>
            <div className="col-span-1">Start Date</div>
            <div className="col-span-1">End Date</div>
            <div className="col-span-1">Manager</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-1">Project Amount</div>
            <div className="col-span-1 text-center">Progress</div>
          </div>

          {/* Projects List */}
          <div className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1D51A4]"></div>
              </div>
            ) : isError ? (
              <div className="text-center py-10 text-red-500 font-medium">
                Failed to load projects. Please try again.
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-10 text-gray-500 font-medium">
                No projects found.
              </div>
            ) : (
              projects.map((project) => (
                <div
                  key={project._id}
                  onClick={() => navigate(`/my_projects/${project._id}`)}
                  className="grid grid-cols-8 gap-2.5 items-center p-6 border border-[#00000026] rounded-md hover:shadow-md transition-shadow bg-white cursor-pointer"
                >
                  {/* Project Name */}
                  <div className="col-span-1">
                    <h3 className="font-semibold text-black leading-tight truncate">
                      {project.projectName || project.buildingType || "Untitled Project"}
                    </h3>
                    <p className="text-xs text-(--text-color-gray-2) mt-1">
                      {project.projectId || project.jobId}
                    </p>
                  </div>

                  {/* Site Location */}
                  <div className="col-span-1">
                    <p className="text-sm text-black">{project.location || "-"}</p>
                  </div>

                  {/* Start Date */}
                  <div className="col-span-1">
                    <p className="text-xs text-gray-400">Date</p>
                    <p className="text-sm font-medium text-black">-</p>
                  </div>

                  {/* End Date */}
                  <div className="col-span-1">
                    <p className="text-xs text-gray-400">Date</p>
                    <p className="text-sm font-medium text-black">-</p>
                  </div>

                  {/* Manager */}
                  <div className="col-span-1">
                    <p className="text-xs text-gray-400">-</p>
                    <p className="text-sm font-medium text-black">-</p>
                  </div>

                  {/* Status */}
                  <div className="col-span-1">
                    <p className="text-xs text-gray-400">Status</p>
                    <span className="text-sm font-normal text-blue-600 hover:underline">
                      {formatStatus(project.lifecycleStatus)}
                    </span>
                  </div>

                  {/* Project Amount */}
                  <div className="col-span-1">
                    <p className="text-xs text-gray-400">Amount</p>
                    <p className="md:text-lg font-bold text-[#3AB449]">
                      {project.quoteValue ? `$${project.quoteValue.toLocaleString()}` : "-"}
                    </p>
                  </div>

                  {/* Progress */}
                  <div className="col-span-1 text-center">
                    <div className="inline-block px-4 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                      -
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {!isLoading && !isError && totalItems > 0 && (
            <PaginationComp
              totalItems={totalItems}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectsList;
