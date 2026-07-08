import { useNavigate } from "react-router-dom";
import { myProjectsData } from "@/data/text/MyProjectsData";
import { PaginationComp } from "../common_components/PaginationComp";


const ProjectsList = () => {
  const navigate = useNavigate();

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
            {myProjectsData.map((project, index) => (
              <div
                key={index}
                onClick={() => navigate(`/my_projects/${project.projectCode}`)}
                className="grid grid-cols-8 gap-2.5 items-center p-6 border border-[#00000026] rounded-md hover:shadow-md transition-shadow bg-white cursor-pointer"
              >
                {/* Project Name */}
                <div className="col-span-1">
                  <h3 className="font-semibold text-black leading-tight">
                    {project.projectName}
                  </h3>
                  <p className="text-xs text-(--text-color-gray-2) mt-1">
                    {project.projectCode}
                  </p>
                </div>

                {/* Site Location */}
                <div className="col-span-1">
                  <p className="text-sm text-black">{project.siteLocation}</p>
                </div>

                {/* Start Date */}
                <div className="col-span-1">
                  <p className="text-xs text-gray-400">Date</p>
                  <p className="text-sm font-medium text-black">
                    {project.startDate}
                  </p>
                </div>

                {/* End Date */}
                <div className="col-span-1">
                  <p className="text-xs text-gray-400">Date</p>
                  <p className="text-sm font-medium text-black">
                    {project.endDate}
                  </p>
                </div>

                {/* Manager */}
                <div className="col-span-1">
                  <p className="text-xs text-gray-400">{project.role}</p>
                  <p className="text-sm font-medium text-black">
                    {project.manager}
                  </p>
                </div>

                {/* Status */}
                <div className="col-span-1">
                  <p className="text-xs text-gray-400">{project.status}</p>
                  <button className="text-sm font-normal text-blue-600 hover:underline">
                    {project.statusText}
                  </button>
                </div>

                {/* Project Amount */}
                <div className="col-span-1">
                  <p className="text-xs text-gray-400">Amount</p>
                  <p className="md:text-lg font-bold text-[#3AB449]">
                    {project.projectAmount}
                  </p>
                </div>

                {/* Progress */}
                <div className="col-span-1 text-center">
                  <div
                    className={`inline-block px-4 py-1.5 rounded-full text-xs font-medium ${project.progressColor} ${project.progressTextColor}`}
                  >
                    {project.progress}%
                  </div>
                </div>
              </div>
            ))}
          </div>
          <PaginationComp
            totalItems={myProjectsData.length}
            page={1}
            rowsPerPage={5}
            onPageChange={(page) => console.log(page)}
            onRowsPerPageChange={(size) => console.log(size)}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectsList;
