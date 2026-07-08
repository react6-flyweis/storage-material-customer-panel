import { CalendarDays } from "lucide-react";

export interface ProgressStep {
  id: number;
  title: string;
  date?: string;
  status: string;
}

export interface ProgressStepsProps {
  title?: string;
  steps: ProgressStep[];
  currentStep: number;
  totalSteps: number;
}

const ProgressSteps = ({
  title = "Progress Step",
  steps,
  currentStep,
  totalSteps,
}: ProgressStepsProps) => {
  return (
    <div className="rounded-lg border border-[#98A2B3] bg-white p-5">
      <h2 className="mb-8 text-[20px] font-bold text-[#101828]">
        {title}
      </h2>

      <div className="mb-8 overflow-x-auto">
  <div className="min-w-[900px]">
    <div className="relative flex justify-between">
      {steps.map((step, index) => (
        <div
          key={step.id}
          className="relative flex flex-1 flex-col items-center"
        >
          {index < steps.length - 1 && (
            <div
              className={`absolute left-1/2 top-[12px] h-[4px] w-full
              ${
                index < currentStep - 1
                  ? "bg-[#1D4ED8]"
                  : "bg-[#E4E7EC]"
              }`}
            />
          )}

          <div
            className={`relative z-10 flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold
            ${
              step.status === "completed"
                ? "bg-[#3AB449] text-white"
                : step.status === "current"
                ? "bg-[#2563EB] text-white"
                : "border border-[#D0D5DD] bg-white text-[#101828]"
            }`}
          >
            {step.id}
          </div>

          <div className="mt-2 text-center">
            <p className="text-[12px] font-semibold leading-6 text-[#667085]">
              {step.title}
            </p>

            <p className="text-[12px] text-[#98A2B3]">
              {step.date || "-"}
            </p>

            {step.status === "current" && (
              <p className="text-[12px] text-[#98A2B3]">
                Current Step
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
</div>

      <div className="rounded-lg bg-[#F9FAFB] p-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          <div>
            <h3 className="text-[14px] font-bold text-[#101828]">
              Progress ({currentStep} of {totalSteps})
            </h3>

            <p className="mt-3 text-[14px] text-[#667085]">
              Current step: Payment Done
            </p>
          </div>

          <div className="border-l border-[#D0D5DD] pl-6">
            <div className="mb-5 flex gap-3">
              <CalendarDays
                size={24}
                className="text-[#101828]"
              />

              <div>
                <p className="text-[14px] font-medium text-[#101828]">
                  Lead Generated
                </p>

                <p className="text-[14px] text-[#667085]">
                  2024-10-10
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <CalendarDays
                size={24}
                className="text-[#101828]"
              />

              <div>
                <p className="text-[14px] font-medium text-[#101828]">
                  Payment Done
                </p>

                <p className="text-[14px] text-[#667085]">
                  2024-10-10
                </p>
              </div>
            </div>
          </div>

          <div className="border-l border-[#D0D5DD] pl-6">
            <h3 className="mb-3 text-[14px] font-bold text-[#101828]">
              Assigned Sales
            </h3>

            <p className="text-[14px] text-[#667085]">
              Sarah Lee
            </p>

            <h3 className="mt-5 text-[14px] font-bold text-[#101828]">
              Priority
            </h3>

            <span className="mt-2 inline-flex rounded-full bg-[#FEF3D7] px-2 py-1 text-xs text-[#D4A72C]">
              Medium
            </span>
          </div>

          <div className="border-l border-[#D0D5DD] pl-6">
            <h3 className="mb-3 text-[14px] font-bold text-[#101828]">
              Next Step
            </h3>

            <p className="text-[14px] leading-6 text-[#667085]">
              After completion payment, the payment done step will complete
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressSteps;