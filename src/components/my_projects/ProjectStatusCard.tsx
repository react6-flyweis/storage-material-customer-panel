import ReactECharts from "echarts-for-react";
import { CalendarDays } from "lucide-react";
import type { ProjectDetailsResponseData } from "@/redux/api/projectsApi";

interface ProjectStatusCardProps {
  currentStep: number;
  totalSteps: number;
  currentStepTitle: string;
  chartOption: Record<string, unknown>;
  lead?: ProjectDetailsResponseData["lead"];
  projectStepsData?: ProjectDetailsResponseData["projectSteps"];
}

const ProjectStatusCard = ({
  currentStep,
  totalSteps,
  currentStepTitle,
  chartOption,
  lead,
  projectStepsData,
}: ProjectStatusCardProps) => {
  const currentStepKeyLower = currentStepTitle?.toLowerCase() || "";

  const stepObj = projectStepsData?.steps?.find(
    (step) =>
      step.label?.toLowerCase() === currentStepKeyLower ||
      step.key?.toLowerCase() === currentStepKeyLower
  );

  const startedOnDate =
    stepObj?.startedAt ||
    stepObj?.date ||
    (lead?.createdAt ? lead.createdAt : null);

  const estimateCompletionDate = stepObj?.expectedCompletion || null;

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString();
  };

  return (
    <div className="rounded-lg border border-[#98A2B3] bg-white p-5">
      <h2 className="mb-4 text-[20px] font-bold text-[#101828]">
        Project Status
      </h2>

      <div className="my-4 border-t" />

      <div className="relative mx-auto h-[260px] w-[260px]">
        <ReactECharts
          option={chartOption}
          style={{
            height: 260,
            width: 260,
          }}
        />

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-[14px] text-[#667085]">Step</p>

          <p className="text-[54px] font-semibold leading-none">{currentStep}</p>

          <p className="text-[14px] text-[#667085]">of {totalSteps}</p>
        </div>
      </div>

      <div className="mt-3">
        <p className="text-[14px] text-[#667085]">Current step</p>

        <p className="text-[14px] font-medium text-[#1D4ED8]">
          {currentStepTitle}
        </p>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <CalendarDays size={22} />

        <div>
          <p className="text-[14px] font-medium text-[#101828]">
            Started on
          </p>

          <p className="text-[14px] text-[#667085]">
            {formatDate(startedOnDate)}
          </p>
        </div>
      </div>

      <div className="mt-3">
        <p className="text-[14px] font-medium text-[#101828]">
          Estimate Completion
        </p>

        <p className="text-[14px] text-[#667085]">
          {formatDate(estimateCompletionDate)}
        </p>
      </div>
    </div>
  );
};

export default ProjectStatusCard;
