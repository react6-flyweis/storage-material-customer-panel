import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface CustomSelectProps {
  placeholder: string;
  options: string[];
  value: string;
  className?: string;
  onChange: (value: string) => void;
}

export default function CustomSelect({
  placeholder,
  options,
  value,
  onChange,
  className,
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        ref.current &&
        !ref.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex ${className || "h-[52px]"} w-full items-center gap-3 justify-between rounded-lg border border-[#D0D5DD] bg-white px-4 text-sm text-[#101828]`}
      >
        <span
          className={
            value ? "text-[#101828]" : "text-[#667085]"
          }
        >
          {value || placeholder}
        </span>

        {open ? (
          <ChevronUp size={18} />
        ) : (
          <ChevronDown size={18} />
        )}
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-2 w-full rounded-lg border border-[#D0D5DD] bg-white overflow-hidden">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
              className="w-full px-4 py-3 text-left text-sm text-[#101828] transition-colors hover:bg-[#F9FAFB]"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}