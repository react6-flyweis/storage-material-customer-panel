import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export type ProjectStatusOption = "All Projects" | "Proposed" | "Confirmed";

interface ProjectStatusFilterProps {
  selectedStatus: ProjectStatusOption;
  onStatusChange: (status: ProjectStatusOption) => void;
}

const STATUS_OPTIONS: ProjectStatusOption[] = [
  "All Projects",
  "Proposed",
  "Confirmed",
];

export default function ProjectStatusFilter({
  selectedStatus,
  onStatusChange,
}: ProjectStatusFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Closed State Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2.5 px-4 py-2 border border-[#4B5E77] rounded-md bg-white text-sm font-medium text-[#1E293B] hover:bg-slate-50 transition-colors cursor-pointer"
      >
        <span>
          Project Status: <span className="font-semibold">{selectedStatus}</span>
        </span>
        <ChevronDown className="w-4 h-4 text-[#1E293B] stroke-[2.5]" />
      </button>

      {/* Open Popover Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-0 z-50 min-w-60 bg-white rounded-2xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 animate-in fade-in zoom-in-95 duration-100">
          {/* Header */}
          <div
            className="flex items-center justify-between cursor-pointer pb-4"
            onClick={() => setIsOpen(false)}
          >
            <span className="text-[17px] font-medium text-[#64748B]">
              Project Status
            </span>
            <ChevronUp className="w-5 h-5 text-[#1E293B] stroke-[2.5]" />
          </div>

          {/* Options */}
          <div className="space-y-3">
            {STATUS_OPTIONS.map((option) => {
              const isSelected = selectedStatus === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    onStatusChange(option);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left text-base transition-colors cursor-pointer font-semibold ${
                    isSelected
                      ? "text-black font-bold"
                      : "text-black hover:text-[#1D51A4]"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
