
import ProgressSteps from "./ProgressSteps";
import ProjectStatusCard from "./ProjectStatusCard";
import ProjectActivityLog from "./ProjectActivityLog";
import ProjectNotes from "./ProjectNotes";
import ProjectOrdersList from "./ProjectOrdersList";
import ProjectUpcomingDelivery from "./ProjectUpcomingDelivery";
import {
  Building2,
  CalendarDays,
  MapPin,
  CircleDollarSign,
} from "lucide-react";


import type { ProjectDetailsResponseData } from "@/redux/api/projectsApi";
import {
  getStatusBadgeConfig,
  LIFECYCLE_STEPS,
  STATUS_MAP,
} from "@/utils/projectStatusUtils";

interface ProjectBasicInfoProps {
  data?: ProjectDetailsResponseData;
}

const ProjectBasicInfo = ({ data }: ProjectBasicInfoProps) => {
  const lead = data?.lead;

  const projectStepsData = data?.projectSteps;

  const currentStatusKey = lead?.lifecycleStatus?.toLowerCase() || "";
  const fallbackStepIndex = currentStatusKey in STATUS_MAP ? STATUS_MAP[currentStatusKey] : 0;

  const currentStep = projectStepsData?.currentStepNumber ?? (fallbackStepIndex + 1);
  const totalSteps = projectStepsData?.totalSteps ?? LIFECYCLE_STEPS.length;
  const overallProgressPct = projectStepsData?.overallProgressPct ?? Math.round((currentStep / totalSteps) * 100);

  const dynamicSteps = projectStepsData?.steps?.length
    ? projectStepsData.steps.map((step, index) => {
      let subtitle = "Pending";
      if (step.status === "completed") {
        const dateStr = step.completedAt || step.date;
        const formatted = dateStr
          ? new Date(dateStr).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
          : "";
        subtitle = formatted ? `Completed on\n${formatted}` : "Completed";
      } else if (step.status === "in_progress") {
        const dateStr = step.startedAt || step.date;
        const formatted = dateStr
          ? new Date(dateStr).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
          : "";
        subtitle = formatted ? `Started on\n${formatted}` : "In Progress";
      }

      return {
        id: index + 1,
        title: step.label || step.key,
        date: step.date ? new Date(step.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : undefined,
        subtitle,
        status: step.status === "in_progress" ? "current" : step.status,
      };
    })
    : LIFECYCLE_STEPS.map((step, index) => {
      let status = "pending";
      let subtitle = "Pending";

      const formattedDate = lead?.createdAt
        ? new Date(lead.createdAt).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
        : "12 May 2025";

      if (index < fallbackStepIndex) {
        status = "completed";
        subtitle = `Completed on\n${formattedDate}`;
      } else if (index === fallbackStepIndex) {
        status = "current";
        subtitle = `Started on\n${formattedDate}`;
      }

      return {
        id: index + 1,
        title: step.title,
        date: index <= fallbackStepIndex ? formattedDate : undefined,
        subtitle,
        status,
      };
    });

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toISOString().split("T")[0];
  };

  const totalBuildingsCount = lead?.buildingsCount ?? lead?.totalBuildings ?? lead?.buildingCount ?? "-";

  const projectDetails = [
    {
      icon: Building2,
      title: "Total Buildings",
      value: totalBuildingsCount,
    },
    {
      icon: CircleDollarSign,
      title: "Quote Value",
      value: lead?.quoteValue !== undefined && lead?.quoteValue !== null ? `$${lead.quoteValue.toLocaleString()}` : "-",
    },
    {
      icon: CalendarDays,
      title: "Created On",
      value: formatDate(lead?.createdAt),
    },
    {
      icon: MapPin,
      title: "Location",
      value: lead?.location || "-",
    },
  ];

  const currentStepTitle = projectStepsData?.currentStepLabel || dynamicSteps[currentStep - 1]?.title || LIFECYCLE_STEPS[fallbackStepIndex]?.title || "-";

  const chartOption = {
    series: [
      {
        type: "pie",
        radius: ["78%", "92%"],
        silent: true,
        label: {
          show: false,
        },
        data: [
          {
            value: overallProgressPct,
            itemStyle: {
              color: "#1D4ED8",
            },
          },
          {
            value: 100 - overallProgressPct,
            itemStyle: {
              color: "#D9D9D9",
            },
          },
        ],
      },
    ],
  };

  const statusInfo = getStatusBadgeConfig(lead?.lifecycleStatus);

  return (
    <div className="space-y-5">
      <div className="overflow-hidden rounded-2xl border border-[#EAECF0] bg-white p-5 md:p-6 shadow-xs">
        <div className="flex flex-col gap-5 sm:gap-6 md:flex-row md:items-stretch">
          <div className="flex h-44 w-full items-center justify-center rounded-xl bg-gray-200 shrink-0 md:h-auto md:w-56 lg:w-64">
            <Building2 className="h-12 w-12 text-gray-400" />
          </div>

          <div className="flex flex-1 flex-col justify-between pt-1">
            <div>
              <div>
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs sm:text-sm font-semibold ${statusInfo.className}`}>
                  <span className={`h-2 w-2 rounded-full shrink-0 ${statusInfo.dotColor}`} />
                  {statusInfo.label}
                </span>
              </div>

              <h2 className="mt-2.5 text-xl font-bold text-[#101828] md:text-2xl">
                {lead?.projectName || "Project Details"}
              </h2>

              <p className="mt-1 text-xs sm:text-sm font-medium text-[#475467]">
                {lead?.jobId || lead?.projectId || "-"}
              </p>
            </div>

            <div className="my-4 border-t border-[#EAECF0]" />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-0 md:divide-x divide-[#EAECF0]">
              {projectDetails.map((item, index) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className={`flex items-start gap-3 ${index === 0
                      ? "md:pr-4"
                      : index === projectDetails.length - 1
                        ? "md:pl-4"
                        : "md:px-4"
                      }`}
                  >
                    <Icon className="mt-0.5 h-5 w-5 text-[#344054] shrink-0" />

                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-[#101828]">
                        {item.title}
                      </p>

                      <p className="mt-0.5 text-xs sm:text-sm text-[#667085]">
                        {item.value}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <ProgressSteps
        steps={dynamicSteps}
        currentStep={currentStep}
        totalSteps={totalSteps}
        assignedSales={lead?.assignedSales}
      />
      <ProjectOrdersList leadId={lead?._id || ""} />

      <ProjectUpcomingDelivery leadId={lead?._id || ""} />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <ProjectStatusCard
          currentStep={currentStep}
          totalSteps={totalSteps}
          currentStepTitle={currentStepTitle}
          chartOption={chartOption}
          lead={lead}
          projectStepsData={projectStepsData}
        />

        <ProjectActivityLog leadId={lead?._id || ""} />

        <ProjectNotes leadId={lead?._id || ""} />
      </div>

    </div>
  );
};

export default ProjectBasicInfo;
