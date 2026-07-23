import React from "react";
import { useParams } from "react-router-dom";
import { Download, Eye, FolderPlus, FileText, Loader2 } from "lucide-react";
import {
  useGetProjectTrackingQuery,
  type ProjectDetailsResponseData,
  type ProjectStep,
} from "@/redux/api/projectsApi";
import { Card, CardContent, CardHeader } from "../ui/card";

interface ProjectTrackingProps {
  data?: ProjectDetailsResponseData;
  leadId?: string;
}

const formatDate = (dateString?: string | null) => {
  if (!dateString) return null;
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
};

const formatDateTime = (dateString?: string | null) => {
  if (!dateString) return null;
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return (
      date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }) +
      ", " +
      date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    );
  } catch {
    return dateString;
  }
};

const ProjectTracking: React.FC<ProjectTrackingProps> = ({ data, leadId: propLeadId }) => {
  const { id: paramLeadId } = useParams<{ id: string }>();
  const activeLeadId = propLeadId || paramLeadId || data?.lead?._id || data?.lead?.projectId || "";

  const { data: trackingData, isLoading, error } = useGetProjectTrackingQuery(activeLeadId, {
    skip: !activeLeadId,
  });

  const lead = data?.lead;
  const project = trackingData?.project;
  const projectSteps = trackingData?.projectSteps;

  const rawSales = lead?.assignedSales as unknown;
  const customerName =
    typeof rawSales === "string" && rawSales.trim() !== ""
      ? rawSales
      : typeof rawSales === "object" && rawSales !== null && "name" in rawSales
        ? String((rawSales as { name?: string }).name || "Customer")
        : project?.projectName || "Customer";

  const projectId = project?.jobId || lead?.jobId || lead?.projectId || "Q-2025-1047";

  const steps: ProjectStep[] = projectSteps?.steps || [];
  const currentStepNum = projectSteps?.currentStepNumber || 1;
  const currentStepIndex = Math.max(0, currentStepNum - 1);
  const totalSteps = projectSteps?.totalSteps || (steps.length > 0 ? steps.length : 5);
  const activePercentage = projectSteps?.overallProgressPct ?? Math.round((currentStepNum / totalSteps) * 100);

  const activeStep: ProjectStep | undefined = steps[currentStepIndex] || steps.find((s) => s.status === "in_progress") || steps[0];

  const attachments = activeStep?.attachments || [];

  if (isLoading) {
    return (
      <Card className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#2563EB]" />
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="min-h-[400px] flex items-center justify-center p-6 text-red-500">
        Failed to load project tracking data. Please try again later.
      </Card>
    );
  }

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
              {steps.map((step, index) => {
                const stepNum = index + 1;
                const isCompleted = step.status === "completed";
                const isCurrent = step.status === "in_progress";
                const isPending = step.status === "pending";

                let circleClass = "bg-[#9CA3AF] text-white"; // default pending
                if (isCompleted) {
                  circleClass = "bg-[#16A34A] text-white";
                } else if (isCurrent) {
                  circleClass = "bg-[#2563EB] text-white";
                }

                return (
                  <div key={step.key || index} className="relative">
                    {/* Vertical Connector Line */}
                    {index < steps.length - 1 && (
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
                            {step.label}
                          </h3>
                          <div className="mt-1 text-xs text-[#667085] leading-relaxed">
                            {isCompleted && (
                              <>
                                <p>Completed on {formatDate(step.completedAt || step.date) || "-"},</p>
                                <p>By {step.completedBy || "Team"}</p>
                              </>
                            )}
                            {isCurrent && (
                              <>
                                <p>Started on {formatDate(step.startedAt || step.date) || "-"},</p>
                                <p>By {step.startedBy || "Team"}</p>
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
                    {index < steps.length - 1 && (
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
                Step {currentStepNum} of {totalSteps}
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

            {activeStep ? (
              <>
                <div className="mt-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2563EB] text-base font-bold text-white">
                      {currentStepNum}
                    </div>
                    <h3 className="text-lg font-bold text-[#101828]">
                      {activeStep.label}
                    </h3>
                  </div>

                  <span className="inline-flex items-center rounded-full bg-[#EFF6FF] px-3.5 py-1 text-xs font-semibold text-[#2563EB] capitalize">
                    {activeStep.status === "in_progress" ? "In Progress" : activeStep.status}
                  </span>
                </div>

                <div className="mt-6 space-y-3.5 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[#667085]">Started on:</span>
                    <span className="font-bold text-[#101828]">
                      {formatDateTime(activeStep.startedAt) || formatDate(activeStep.date) || "-"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[#667085]">Started by:</span>
                    <span className="font-bold text-[#101828]">
                      {activeStep.startedBy || "-"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[#667085]">Current Stage:</span>
                    <span className="font-bold text-[#101828]">
                      {activeStep.currentStage || "-"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[#667085]">Completion :</span>
                    <span className="font-bold text-[#101828]">
                      {activeStep.completionPct}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[#667085]">Expected Completion:</span>
                    <span className="font-bold text-[#101828]">
                      {formatDate(activeStep.expectedCompletion) || "-"}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-4 pt-1">
                    <span className="text-[#667085] shrink-0">Notes:</span>
                    <span className="text-right font-bold text-[#101828]">
                      {activeStep.notes || "-"}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <p className="mt-4 text-sm text-[#667085]">No active step details available.</p>
            )}
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
              {attachments.length > 0 ? (
                attachments.map((doc, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-xl border border-[#F2F4F7] bg-[#FAFAFA] p-3.5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FEF2F2] text-[#EF4444]">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#101828] truncate max-w-[180px]" title={doc.name}>
                          {doc.name}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => doc.url && window.open(doc.url, "_blank")}
                        className="text-[#475467] hover:text-[#101828] transition-colors"
                        title="Download"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => doc.url && window.open(doc.url, "_blank")}
                        className="text-[#2563EB] hover:text-[#1D4ED8] transition-colors"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-[#667085] py-2">No attachments available for this step.</p>
              )}
            </div>

            {attachments.length > 0 && (
              <div className="mt-5 flex justify-center">
                <button
                  onClick={() => { }}
                  className="w-full rounded-lg bg-[#1D4ED8] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1E40AF]"
                >
                  View All
                </button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectTracking;

