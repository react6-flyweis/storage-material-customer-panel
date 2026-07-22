import React from "react";

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

  return (
    <div className="rounded-xl border border-[#EAECF0] bg-white p-6 shadow-xs">
      <h2 className="text-lg font-bold text-[#101828] mb-6">{title}</h2>

      {/* Stepper horizontal line and nodes */}
      <div className="overflow-x-auto pb-4">
        <div className="min-w-[700px] px-4">
          <div className="relative flex items-center justify-between">
            {/* Steps loop */}
            {steps.map((step, index) => {
              const isCompleted = step.status === "completed";
              const isCurrent = step.status === "current";

              // Line color to next step
              let connectorBg = "bg-[#D0D5DD]"; // Gray default
              if (index < currentStep - 1) {
                connectorBg = "bg-[#16A34A]"; // Green for completed segments
              } else if (index === currentStep - 1) {
                connectorBg = "bg-[#2563EB]"; // Blue connector leading into active step if needed, or blue segment
              }

              // Circle node styling
              let circleStyle = "bg-[#94A3B8] text-white"; // Gray 5
              if (isCompleted) {
                circleStyle = "bg-[#16A34A] text-white"; // Green
              } else if (isCurrent) {
                circleStyle = "bg-[#2563EB] text-white"; // Blue
              }

              return (
                <div key={step.id} className="relative flex flex-1 flex-col items-center">
                  {/* Connecting Line between circles */}
                  {index < steps.length - 1 && (
                    <div
                      className={`absolute left-[50%] top-5 -translate-y-1/2 h-[3px] w-full ${connectorBg}`}
                      style={{ zIndex: 0 }}
                    />
                  )}

                  {/* Circle Step Number */}
                  <div
                    className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full text-base font-bold transition-colors ${circleStyle}`}
                  >
                    {step.id}
                  </div>

                  {/* Step Label & Subtitle */}
                  <div className="mt-3 text-center max-w-[130px]">
                    <p className="text-sm font-bold text-[#101828]">{step.title}</p>
                    <p className="mt-0.5 text-xs text-[#667085] leading-tight">
                      {step.subtitle || (step.date ? `Completed on ${step.date}` : "Pending")}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
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