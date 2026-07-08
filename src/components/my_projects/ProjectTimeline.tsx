import { Check, CheckCheck } from "lucide-react";

const steps = [
  {
    id: 1,
    title: "Initial Contact",
    status: "completed",
  },
  {
    id: 2,
    title: "Requirements Gathered",
    status: "completed",
  },
  {
    id: 3,
    title: "Proposal Sent",
    status: "completed",
  },
  {
    id: 4,
    title: "Negotiation",
    status: "current",
  },
  {
    id: 5,
    title: "Deal Closed",
    status: "pending",
  },
  {
    id: 6,
    title: "Payment Done",
    status: "pending",
  },
  {
    id: 7,
    title: "Delivered",
    status: "pending",
  },
];

const ProjectTimeline = () => {
  return (
    <div className="rounded-lg bg-white p-5">
      <div className="flex items-center gap-2">
        <span className="text-[18px] font-normal text-[#101828]">
          Lead ID-
        </span>

        <span className="text-[18px] font-bold text-[#101828]">
          Q-2025-1047
        </span>
      </div>

      <h2 className="mt-14 text-[24px] font-semibold text-[#101828]">
        Progress Steps
      </h2>

      <div className="mt-5">
        {steps.map((step) => (
          <div
            key={step.id}
            className="flex items-start justify-between py-5"
          >
            <div className="flex items-center gap-5">
              {step.status === "completed" && (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#3BAA4A] text-white">
                  <Check size={18} strokeWidth={3} />
                </div>
              )}

              {step.status === "current" && (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#3B82F6] text-white text-[16px] font-medium">
                  {step.id}
                </div>
              )}

              {step.status === "pending" && (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#D1D5DB] text-[16px] font-medium text-[#4B5563]">
                  {step.id}
                </div>
              )}

              <div>
                <p
                  className={`text-[16px] ${
                    step.status === "completed"
                      ? "text-[#0B7A24]"
                      : step.status === "current"
                      ? "font-semibold text-[#2563EB]"
                      : "text-[#4B5563]"
                  }`}
                >
                  {step.title}
                </p>

                {step.status === "current" && (
                  <p className="mt-1 text-[14px] text-[#2563EB]">
                    Current Step
                  </p>
                )}
              </div>
            </div>

            {step.status === "completed" && (
              <CheckCheck
                size={28}
                strokeWidth={2.5}
                className="text-[#0B7A24]"
              />
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 border-t border-[#D0D5DD] pt-5">
        <p className="text-[16px] text-[#667085]">
          Progress: Step 4 of 7
        </p>
      </div>
    </div>
  );
};

export default ProjectTimeline;