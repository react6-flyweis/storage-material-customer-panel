import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Loader2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useGetProjectsQuery, type Project } from "@/redux/api/projectsApi";
import { cn } from "@/lib/utils";

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}

function formatLifecycleStatus(status?: string): string {
  if (!status) return "";
  return status
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getStatusBadgeClassName(status?: string): string {
  if (!status) return "bg-gray-100 text-gray-700";
  const normalized = status.toLowerCase();

  if (
    normalized.includes("complete") ||
    normalized.includes("building_done") ||
    normalized.includes("deal_closed") ||
    normalized.includes("paid")
  ) {
    return "bg-emerald-50 text-emerald-700 border border-emerald-200/60";
  }

  if (
    normalized.includes("progress") ||
    normalized.includes("install") ||
    normalized.includes("fabrication") ||
    normalized.includes("dispatch")
  ) {
    return "bg-blue-50 text-blue-700 border border-blue-200/60";
  }

  if (
    normalized.includes("proposal") ||
    normalized.includes("negotiation") ||
    normalized.includes("quotation")
  ) {
    return "bg-amber-50 text-amber-700 border border-amber-200/60";
  }

  if (
    normalized.includes("cancel") ||
    normalized.includes("reject") ||
    normalized.includes("lost")
  ) {
    return "bg-red-50 text-red-700 border border-red-200/60";
  }

  return "bg-gray-100 text-gray-700";
}

export function HeaderSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const debouncedSearch = useDebounce(searchTerm, 300);

  const { data, isLoading } = useGetProjectsQuery(
    { page: 1, limit: 100 },
    { skip: !isOpen }
  );

  const projects: Project[] = data?.projects ?? [];

  const filteredProjects = projects.filter((project) => {
    const term = debouncedSearch.toLowerCase().trim();
    if (!term) return true;
    return (
      (project.projectName && project.projectName.toLowerCase().includes(term)) ||
      (project.jobId && project.jobId.toLowerCase().includes(term)) ||
      (project.projectId && project.projectId.toLowerCase().includes(term)) ||
      (project.buildingType && project.buildingType.toLowerCase().includes(term)) ||
      (project.location && project.location.toLowerCase().includes(term))
    );
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelectProject = (projectId: string) => {
    setIsOpen(false);
    setSearchTerm("");
    navigate(`/my_projects/${projectId}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    } else if (e.key === "Enter" && filteredProjects.length > 0 && isOpen) {
      handleSelectProject(filteredProjects[0]._id);
    }
  };

  const isDebouncing = searchTerm.trim() !== "" && searchTerm.trim() !== debouncedSearch.trim();
  const showLoading = isLoading || isDebouncing;

  return (
    <div ref={containerRef} className="relative w-44 sm:w-64 md:w-72 lg:w-80">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        <Input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search projects..."
          className="pl-9 pr-8 bg-gray-50 border-gray-200 text-sm focus-visible:bg-white transition-colors"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => {
              setSearchTerm("");
            }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute left-0 top-full mt-1.5 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden w-full min-w-[280px] sm:min-w-[320px] max-w-[calc(100vw-2rem)]">
          {showLoading ? (
            <div className="flex items-center justify-center gap-2 py-6 text-xs text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
              <span>Searching projects...</span>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="py-6 text-center text-xs text-gray-500">
              No projects found
            </div>
          ) : (
            <div>
              <div className="px-3 py-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider bg-gray-50/80 border-b border-gray-100">
                Projects
              </div>
              <ul className="max-h-72 overflow-y-auto divide-y divide-gray-100">
                {filteredProjects.map((project) => {
                  const idBadge = project.jobId || project.projectId;
                  const displayId = idBadge ? (idBadge.startsWith("#") ? idBadge : `#${idBadge}`) : null;
                  const buildingOrLocation =
                    [project.buildingType, project.location]
                      .filter(Boolean)
                      .join(" • ") || "N/A";

                  return (
                    <li key={project._id}>
                      <button
                        type="button"
                        onClick={() => handleSelectProject(project._id)}
                        className="w-full text-left px-3.5 py-2.5 hover:bg-gray-50 transition-colors flex flex-col gap-0.5 group cursor-pointer"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-medium text-sm text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                            {project.projectName || "Unnamed Project"}
                          </span>
                          {project.lifecycleStatus && (
                            <span
                              className={cn(
                                "text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0",
                                getStatusBadgeClassName(project.lifecycleStatus)
                              )}
                            >
                              {formatLifecycleStatus(project.lifecycleStatus)}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between gap-2 text-xs text-gray-500">
                          <span className="truncate">{buildingOrLocation}</span>
                          {displayId && (
                            <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 shrink-0 font-medium">
                              {displayId}
                            </span>
                          )}
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default HeaderSearch;
