import { Check, CheckCheck } from "lucide-react";
import type { ProjectDetailsResponseData } from "@/redux/api/projectsApi";

const LIFECYCLE_STEPS = [
  { key: "initial_contact", title: "Initial Contact" },
  { key: "requirements_gathered", title: "Requirements Gathered" },
  { key: "proposal_received", title: "Proposal Received" },
  { key: "negotiation", title: "Negotiation" },
  { key: "deal_closed", title: "Deal Closed" },
  { key: "paid", title: "Payment Done" },
  { key: "delivered", title: "Delivered" },
  { key: "building_done", title: "Building Done" },
];

const STATUS_MAP: Record<string, number> = {
  initial_contact: 0,
  requirements_gathered: 1,
  proposal_received: 2,
  proposal_sent: 2,
  quotation_sent: 2,
  negotiation: 3,
  deal_closed: 4,
  paid: 5,
  payment_done: 5,
  delivered: 6,
  building_done: 7,
  completed: 7,
  complete: 7,
};

interface ProjectTimelineProps {
  data?: ProjectDetailsResponseData;
}

const ProjectTimeline = ({ data }: ProjectTimelineProps) => {
  const lead = data?.lead;
  const currentStatusKey = lead?.lifecycleStatus?.toLowerCase() || "";
  const currentStepIndex = currentStatusKey in STATUS_MAP ? STATUS_MAP[currentStatusKey] : 0;
  const currentStep = currentStepIndex + 1;
  const totalSteps = LIFECYCLE_STEPS.length;

  const dynamicSteps = LIFECYCLE_STEPS.map((step, index) => {
    let status = "pending";
    if (index < currentStepIndex) {
      status = "completed";
    } else if (index === currentStepIndex) {
      status = "current";
    }

    return {
      id: index + 1,
      title: step.title,
      status,
    };
  });

  return (
    <div className="rounded-lg bg-white p-5">
      <div className="flex items-center gap-2">
        <span className="text-[18px] font-normal text-[#101828]">
          Lead ID-
        </span>

        <span className="text-[18px] font-bold text-[#101828]">
          {lead?.jobId || lead?.projectId || "-"}
        </span>
      </div>

      <h2 className="mt-14 text-[24px] font-semibold text-[#101828]">
        Progress Steps
      </h2>

      <div className="mt-5">
        {dynamicSteps.map((step) => (
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
          Progress: Step {currentStep} of {totalSteps}
        </p>
      </div>
    </div>
  );
};

export default ProjectTimeline;