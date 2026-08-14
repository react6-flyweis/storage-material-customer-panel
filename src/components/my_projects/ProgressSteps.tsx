import React, { useRef, useEffect } from "react";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";

export interface ProgressStep {
  id: number;
  title: string;
  date?: string;
  status: "completed" | "current" | "pending" | string;
  subtitle?: string;
}

export interface ProgressStepsProps {
  title?: string;
  steps: ProgressStep[];
  currentStep: number;
  totalSteps: number;
  assignedSales?: string | { name?: string } | null;
  priority?: string;
}

const ProgressSteps: React.FC<ProgressStepsProps> = ({
  title = "Project Steps",
  steps,
  currentStep,
  totalSteps,
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((currentStep / totalSteps) * 100)));
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activeStepRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to active step on load & when steps/currentStep change
  useEffect(() => {
    const timer = setTimeout(() => {
      if (activeStepRef.current && scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const element = activeStepRef.current;
        const elementLeft = element.offsetLeft;
        const elementWidth = element.offsetWidth;
        const containerWidth = container.offsetWidth;

        container.scrollTo({
          left: Math.max(0, elementLeft - containerWidth / 2 + elementWidth / 2),
          behavior: "smooth",
        });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [currentStep, steps]);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -280 : 280,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="rounded-xl border border-[#EAECF0] bg-white p-6 shadow-xs">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-[#101828]">{title}</h2>
        
        {/* Navigation scroll buttons for desktop/tablet */}
        {steps.length > 5 && (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => scroll("left")}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#D0D5DD] bg-white text-[#475467] hover:bg-[#F9FAFB] hover:text-[#1D2939] transition-colors shadow-2xs cursor-pointer"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#D0D5DD] bg-white text-[#475467] hover:bg-[#F9FAFB] hover:text-[#1D2939] transition-colors shadow-2xs cursor-pointer"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Stepper horizontal line and nodes with smooth scrolling */}
      <div
        ref={scrollContainerRef}
        className="w-full overflow-x-auto pb-4 pt-1 scroll-smooth focus:outline-none"
        style={{ scrollbarWidth: "thin" }}
      >
        <div className="inline-flex min-w-full items-start px-2">
          {/* Steps loop */}
          {steps.map((step, index) => {
            const isCompleted = step.status === "completed";
            const isCurrent = step.status === "current" || step.id === currentStep;

            // Line color to next step
            let connectorBg = "bg-[#E4E7EC]"; // Gray default
            if (index < currentStep - 1 || isCompleted) {
              connectorBg = "bg-[#16A34A]"; // Green for completed segments
            } else if (index === currentStep - 1 || isCurrent) {
              connectorBg = "bg-[#2563EB]"; // Blue connector leading into active step
            }

            // Circle node styling
            let circleStyle = "bg-[#F2F4F7] text-[#667085] border-2 border-[#D0D5DD]"; // Gray
            if (isCompleted) {
              circleStyle = "bg-[#16A34A] text-white border-2 border-[#16A34A]"; // Green
            } else if (isCurrent) {
              circleStyle = "bg-[#2563EB] text-white border-2 border-[#2563EB] ring-4 ring-blue-100"; // Blue
            }

            return (
              <div
                key={step.id}
                ref={isCurrent ? activeStepRef : undefined}
                className="relative flex w-32 sm:w-36 shrink-0 flex-col items-center"
              >
                {/* Connecting Line between circles */}
                {index < steps.length - 1 && (
                  <div
                    className={`absolute left-[50%] top-5 -translate-y-1/2 h-[3px] w-full ${connectorBg}`}
                    style={{ zIndex: 0 }}
                  />
                )}

                {/* Circle Step Number */}
                <div
                  className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm sm:text-base font-bold transition-all shadow-xs ${circleStyle}`}
                >
                  {isCompleted ? <Check className="h-5 w-5 stroke-[2.5]" /> : step.id}
                </div>

                {/* Step Label & Subtitle */}
                <div className="mt-3 text-center w-full px-2">
                  <p className="text-xs sm:text-sm font-semibold text-[#101828] leading-tight">
                    {step.title}
                  </p>
                  <p className="mt-1 text-[11px] sm:text-xs text-[#667085] leading-tight whitespace-pre-line">
                    {step.subtitle || (step.date ? `Completed on\n${step.date}` : "Pending")}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="mt-4 rounded-xl bg-[#F8F9FA] p-4 flex flex-col gap-2">
        <span className="text-xs font-semibold text-[#667085]">Overall Progress</span>
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-[#101828] whitespace-nowrap">
            Step {currentStep} of {totalSteps}
          </span>
          <div className="relative h-3 w-full overflow-hidden rounded-full bg-[#E5E7EB]">
            <div
              className="h-full rounded-full bg-[#16A34A] transition-all duration-300"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <span className="text-xs font-bold text-[#4B5563]">{percentage}%</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressSteps;