import React from "react";
import { Check, CheckCheck, X } from "lucide-react";

import Modal from "../common_components/Modal";
import { Button } from "../ui/button";

interface TrackLeadsLifecycleModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadData?: {
    id: string;
    name: string;
  };
}

const lifecycleData = {
  currentStep: 4,
  totalSteps: 5,
  steps: [
    {
      id: 1,
      title: "Design",
      status: "completed",
    },
    {
      id: 2,
      title: "Fabrication",
      status: "completed",
    },
    {
      id: 3,
      title: "Dispatch",
      status: "completed",
    },
    {
      id: 4,
      title: "Install",
      status: "current",
    },
    {
      id: 5,
      title: "Complete",
      status: "pending",
    },
  ],
};

const TrackLeadsLifecycleModal: React.FC<
  TrackLeadsLifecycleModalProps
> = ({
  isOpen,
  onClose,
  leadData = {
    id: "Q-2025-1047",
    name: "John Doe",
  },
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      showHeader={false}
      customPadding="p-0"
      width="max-w-[890px]"
    >
      <div className="overflow-hidden rounded-lg bg-white">
        <div className="flex items-start justify-between border-b border-[#D0D5DD] p-5">
          <div>
            <h2 className="text-[24px] font-bold text-[#101828]">
              Track Leads lifecycle - {leadData.name}
            </h2>

            <p className="mt-2 text-[18px] text-[#101828]">
              {leadData.id}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1"
          >
            <X
              size={20}
              strokeWidth={1.5}
              className="text-[#101828]"
            />
          </button>
        </div>

        <div className="p-5">
          <h3 className="mb-4 text-[20px] font-medium text-[#101828]">
            Progress Steps
          </h3>

          <div className="rounded-lg bg-[#F9FAFB]">
            <div className="p-5 flex flex-col gap-4">
              {lifecycleData.steps.map((step) => (
                <div
                  key={step.id}
                  className="flex items-start justify-between"
                >
                  <div className="flex items-start gap-5">
                    {step.status === "completed" && (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#3BAA4A] text-white">
                        <Check
                          size={18}
                          strokeWidth={3}
                        />
                      </div>
                    )}

                    {step.status === "current" && (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#3B82F6] text-[16px] font-medium text-white">
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
                      size={30}
                      strokeWidth={2.5}
                      className="text-[#0B7A24]"
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="border-t border-[#D0D5DD] p-5">
              <p className="text-[16px] text-[#667085]">
                Progress: Step{" "}
                {lifecycleData.currentStep} of{" "}
                {lifecycleData.totalSteps}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end p-5 pt-0">
          <Button
            onClick={onClose}
            className="h-[44px] rounded-lg px-5 bg-[linear-gradient(90deg,#2563EB_0%,#4F46E5_100%)] text-white"
          >
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default TrackLeadsLifecycleModal;