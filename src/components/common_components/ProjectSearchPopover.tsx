import React, { useState } from "react";
import { Search, Loader2, FolderKanban } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGetProjectsQuery, type Project } from "@/redux/api/projectsApi";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export const ProjectSearchPopover: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const { data, isLoading } = useGetProjectsQuery(
    { page: 1, limit: 100 },
    { skip: !isOpen }
  );

  const projects: Project[] = data?.projects || [];

  const filteredProjects = projects.filter((project) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    return (
      (project.projectName && project.projectName.toLowerCase().includes(term)) ||
      (project.jobId && project.jobId.toLowerCase().includes(term)) ||
      (project.projectId && project.projectId.toLowerCase().includes(term)) ||
      (project.buildingType && project.buildingType.toLowerCase().includes(term)) ||
      (project.location && project.location.toLowerCase().includes(term))
    );
  });

  const handleSelectProject = (projectId: string) => {
    setIsOpen(false);
    setSearchTerm("");
    navigate(`/my_projects/${projectId}`);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className="hidden md:flex items-center bg-[#F8F9FA] rounded-md px-4 xl:py-2 py-1.5 flex-1 max-w-[200px] border border-[#D1D5DB] focus-within:border-[#9CA3AF] focus-within:ring-2 focus-within:ring-blue-100 transition-all cursor-pointer">
          <Search className="w-5 h-5 text-[#9CA3AF] mr-2 shrink-0" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              if (!isOpen) setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            className="bg-transparent border-none outline-none text-sm w-full text-gray-700 placeholder-gray-400"
          />
        </div>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-[320px] p-0 shadow-lg border border-gray-200 rounded-lg overflow-hidden bg-white"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="p-2 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center bg-white rounded-md px-3 py-1.5 border border-gray-200 focus-within:border-blue-500">
            <Search className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Filter projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none text-xs w-full text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>

        <div className="max-h-[300px] overflow-y-auto divide-y divide-gray-100">
          {isLoading ? (
            <div className="flex items-center justify-center py-6 text-gray-500 text-xs gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
              <span>Loading projects...</span>
            </div>
          ) : filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <div
                key={project._id}
                onClick={() => handleSelectProject(project._id)}
                className="p-3 hover:bg-blue-50/50 cursor-pointer transition-colors flex items-start gap-2.5"
              >
                <div className="p-1.5 bg-blue-100 text-blue-600 rounded-md shrink-0 mt-0.5">
                  <FolderKanban className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs font-semibold text-gray-900 truncate">
                      {project.projectName || "Unnamed Project"}
                    </p>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 font-mono font-medium shrink-0">
                      {project.jobId || project.projectId}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1 text-[11px] text-gray-500">
                    <span className="truncate">{project.buildingType || project.location || "N/A"}</span>
                    {project.lifecycleStatus && (
                      <span className="capitalize text-[10px] text-blue-600 font-medium bg-blue-50 px-1.5 py-0.5 rounded">
                        {project.lifecycleStatus.replace(/_/g, " ")}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-6 text-center text-xs text-gray-500">
              No projects found
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ProjectSearchPopover;
