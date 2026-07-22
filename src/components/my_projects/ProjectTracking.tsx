import React from "react";
import { Download, Eye, FolderPlus, FileText } from "lucide-react";
import type { ProjectDetailsResponseData } from "@/redux/api/projectsApi";
import { STATUS_MAP } from "@/utils/projectStatusUtils";
import { Card, CardContent, CardHeader } from "../ui/card";

interface ProjectTrackingProps {
  data?: ProjectDetailsResponseData;
}

const LIFECYCLE_STEPS_DATA = [
  {
    id: 1,
    title: "Design",
    completedDate: "12 May 2025",
    completedBy: "Sarah Lee",
  },
  {
    id: 2,
    title: "Fabrication",
    completedDate: "12 May 2025",
    completedBy: "Michael Smith",
  },
  {
    id: 3,
    title: "Dispatch",
    completedDate: "12 May 2025",
    completedBy: "David Brown",
  },
  {
    id: 4,
    title: "Install",
    startedDate: "12 May 2025",
    startedBy: "Installation Team",
    currentStage: "Wall Panel Installation",
    completionPercentage: 80,
    expectedCompletion: "08 Jun 2025",
    notes: "Installation is proceeding as per schedule.",
  },
  {
    id: 5,
    title: "Complete",
  },
];

const ProjectTracking: React.FC<ProjectTrackingProps> = ({ data }) => {
  const lead = data?.lead;

  const currentStatusKey = lead?.lifecycleStatus?.toLowerCase() || "";
  const currentStepIndex = currentStatusKey in STATUS_MAP ? STATUS_MAP[currentStatusKey] : 3; // Default to step 4 (index 3) if not set
  const currentStep = currentStepIndex + 1;
  const totalSteps = LIFECYCLE_STEPS_DATA.length;

  const formattedCreatedDate = lead?.createdAt
    ? new Date(lead.createdAt).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    : "12 May 2025";

  const rawSales = lead?.assignedSales as unknown;
  const customerName =
    typeof rawSales === "string" && rawSales.trim() !== ""
      ? rawSales
      : typeof rawSales === "object" && rawSales !== null && "name" in rawSales
        ? String((rawSales as { name?: string }).name || "John Doe")
        : "John Doe";
  const projectId = lead?.jobId || lead?.projectId || "Q-2025-1047";

  const activeStepData = LIFECYCLE_STEPS_DATA[currentStepIndex] || LIFECYCLE_STEPS_DATA[3];
  const activePercentage = Math.round((currentStep / totalSteps) * 100);

  // Documents from lead or fallback mockup matching design
  const docsList = lead?.documents && lead.documents.length > 0
    ? lead.documents.map((doc) => ({
      id: doc._id,
      name: doc.name || "Document.pdf",
      size: "15.2 MB",
      url: doc.url,
    }))
    : [
      { id: "1", name: "Installation.pdf", size: "15.2 MB", url: "#" },
      { id: "2", name: "Safety.pdf", size: "15.2 MB", url: "#" },
    ];

  return (
    <Card className="">
      {/* Title & Header */}
      <CardHeader>
        <h1 className="text-2xl font-bold text-[#101828]">
          Track Project lifecycle - {customerName}
        </h1>
        <p className="mt-1 text-sm font-medium text-[#667085]">{projectId}</p>
      </CardHeader>

      {/* Grid Layout */}
      <CardContent className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Progress Steps */}
        <div className="flex flex-col justify-between rounded-2xl border border-[#EAECF0] bg-white p-6 shadow-xs lg:col-span-7">
          <div>
            <h2 className="text-lg font-bold text-[#101828]">Progress Steps</h2>

            <div className="relative mt-6">
              {LIFECYCLE_STEPS_DATA.map((step, index) => {
                const stepNum = index + 1;
                const isCompleted = index < currentStepIndex;
                const isCurrent = index === currentStepIndex;
                const isPending = index > currentStepIndex;

                let circleClass = "bg-[#9CA3AF] text-white"; // default pending
                if (isCompleted) {
                  circleClass = "bg-[#16A34A] text-white";
                } else if (isCurrent) {
                  circleClass = "bg-[#2563EB] text-white";
                }

                return (
                  <div key={step.id} className="relative">
                    {/* Vertical Connector Line */}
                    {index < LIFECYCLE_STEPS_DATA.length - 1 && (
                      <div
                        className="absolute left-5 top-10 -ml-px h-full w-0.5 bg-[#E5E7EB]"
                        style={{ zIndex: 0 }}
                      />
                    )}

                    <div className="relative z-10 flex items-start justify-between py-4">
                      {/* Left Circle & Details */}
                      <div className="flex items-start gap-4">
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-base font-bold transition-colors ${circleClass}`}
                        >
                          {stepNum}
                        </div>

                        <div className="pt-0.5">
                          <h3 className="text-base font-bold text-[#101828]">
                            {step.title}
                          </h3>
                          <div className="mt-1 text-xs text-[#667085] leading-relaxed">
                            {isCompleted && (
                              <>
                                <p>Completed on {step.completedDate || formattedCreatedDate},</p>
                                <p>By {step.completedBy || "Team"}</p>
                              </>
                            )}
                            {isCurrent && (
                              <>
                                <p>Started on {step.startedDate || formattedCreatedDate},</p>
                                <p>By {step.startedBy || customerName}</p>
                              </>
                            )}
                            {isPending && <p>Pending</p>}
                          </div>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="pt-1">
                        {isCompleted && (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E6F4EA] px-3 py-1 text-xs font-semibold text-[#16A34A]">
                            <span className="h-2 w-2 rounded-full bg-[#16A34A]" />
                            Completed
                          </span>
                        )}
                        {isCurrent && (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EFF6FF] px-3.5 py-1 text-xs font-semibold text-[#2563EB]">
                            In Progress
                          </span>
                        )}
                        {isPending && (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F3F4F6] px-3.5 py-1 text-xs font-semibold text-[#6B7280]">
                            Pending
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Divider line between steps */}
                    {index < LIFECYCLE_STEPS_DATA.length - 1 && (
                      <div className="ml-14 border-b border-[#F2F4F7]" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Overall Progress */}
          <div className="mt-6 border-t border-[#EAECF0] pt-4">
            <span className="text-xs font-semibold text-[#667085]">
              Overall Progress
            </span>
            <div className="mt-2 flex items-center justify-between gap-4">
              <span className="text-xs font-bold text-[#101828] whitespace-nowrap">
                Step {currentStep} of {totalSteps}
              </span>

              <div className="relative h-3 w-full overflow-hidden rounded-full bg-[#E5E7EB]">
                <div
                  className="h-full rounded-full bg-[#16A34A] transition-all duration-300"
                  style={{ width: `${activePercentage}%` }}
                />
              </div>

              <span className="text-xs font-bold text-[#344054]">
                {activePercentage}%
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Stacked Cards */}
        <div className="flex flex-col gap-6 lg:col-span-5">
          {/* Current Step Details Card */}
          <div className="rounded-2xl border border-[#EAECF0] bg-white p-6 shadow-xs">
            <h2 className="text-lg font-bold text-[#101828]">Current Step Details</h2>

            <div className="mt-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2563EB] text-base font-bold text-white">
                  {currentStep}
                </div>
                <h3 className="text-lg font-bold text-[#101828]">
                  {activeStepData.title}
                </h3>
              </div>

              <span className="inline-flex items-center rounded-full bg-[#EFF6FF] px-3.5 py-1 text-xs font-semibold text-[#2563EB]">
                In Progress
              </span>
            </div>

            <div className="mt-6 space-y-3.5 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-[#667085]">Started on:</span>
                <span className="font-bold text-[#101828]">
                  {activeStepData.startedDate || "28 May 2025, 10:30 AM"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#667085]">Started by:</span>
                <span className="font-bold text-[#101828]">
                  {activeStepData.startedBy || "Installation Team"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#667085]">Current Stage:</span>
                <span className="font-bold text-[#101828]">
                  {activeStepData.currentStage || "Wall Panel Installation"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#667085]">Completion :</span>
                <span className="font-bold text-[#101828]">
                  {activeStepData.completionPercentage ?? 80}%
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#667085]">Expected Completion:</span>
                <span className="font-bold text-[#101828]">
                  {activeStepData.expectedCompletion || "08 Jun 2025"}
                </span>
              </div>

              <div className="flex items-start justify-between gap-4 pt-1">
                <span className="text-[#667085] shrink-0">Notes:</span>
                <span className="text-right font-bold text-[#101828]">
                  {activeStepData.notes || "Installation is proceeding as per schedule."}
                </span>
              </div>
            </div>
          </div>

          {/* Attachments & Documents Card */}
          <div className="rounded-2xl border border-[#EAECF0] bg-white p-6 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2563EB] text-white">
                <FolderPlus className="h-4 w-4" />
              </div>
              <h2 className="text-lg font-bold text-[#101828]">
                Attachments & Documents
              </h2>
            </div>

            <div className="mt-5 space-y-3">
              {docsList.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between rounded-xl border border-[#F2F4F7] bg-[#FAFAFA] p-3.5"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FEF2F2] text-[#EF4444]">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#101828]">{doc.name}</p>
                      <p className="text-xs text-[#667085]">{doc.size}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => doc.url && doc.url !== "#" && window.open(doc.url, "_blank")}
                      className="text-[#475467] hover:text-[#101828] transition-colors"
                      title="Download"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => doc.url && doc.url !== "#" && window.open(doc.url, "_blank")}
                      className="text-[#2563EB] hover:text-[#1D4ED8] transition-colors"
                      title="View"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 flex justify-center">
              <button
                onClick={() => { }}
                className="w-full rounded-lg bg-[#1D4ED8] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1E40AF]"
              >
                View All
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectTracking;
