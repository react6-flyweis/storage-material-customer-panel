import ReactECharts from "echarts-for-react";
import ProgressSteps from "./ProgressSteps";
import ProjectActivityLog from "./ProjectActivityLog";
import ProjectNotes from "./ProjectNotes";
import {
  Building2,
  Landmark,
  CalendarDays,
  MapPin,
  CircleDollarSign,
} from "lucide-react";


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

import type { ProjectDetailsResponseData } from "@/redux/api/projectsApi";

interface ProjectBasicInfoProps {
  data?: ProjectDetailsResponseData;
}

const ProjectBasicInfo = ({ data }: ProjectBasicInfoProps) => {
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

    const date = lead?.createdAt ? new Date(lead.createdAt).toLocaleDateString() : undefined;

    return {
      id: index + 1,
      title: step.title,
      date: index <= currentStepIndex ? date : undefined,
      status,
    };
  });

  const projectDetails = [
    {
      icon: Building2,
      title: "Building Type",
      value: lead?.buildingType || "-",
    },
    {
      icon: CircleDollarSign,
      title: "Quote Value",
      value: lead?.quoteValue !== undefined ? `$${lead.quoteValue.toLocaleString()}` : "-",
    },
    {
      icon: CalendarDays,
      title: "Created On",
      value: lead?.createdAt ? new Date(lead.createdAt).toLocaleDateString() : "-",
    },
    {
      icon: MapPin,
      title: "Location",
      value: lead?.location || "-",
    },
  ];

  const percentage = (currentStep / totalSteps) * 100;

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
            value: percentage,
            itemStyle: {
              color: "#1D4ED8",
            },
          },
          {
            value: 100 - percentage,
            itemStyle: {
              color: "#D9D9D9",
            },
          },
        ],
      },
    ],
  };

  const getStatusLabelAndColor = (status?: string) => {
    if (!status) return { label: "-", className: "bg-gray-100 text-gray-800" };

    // Format status: replace underscores with spaces and capitalize words
    const label = status
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

    if (status === "deal_closed" || status === "quotation_sent" || status === "paid") {
      return { label, className: "bg-[#DDF5E5] text-[#34A853]" };
    }
    return { label, className: "bg-[#EEF4FF] text-[#2563EB]" };
  };

  const statusInfo = getStatusLabelAndColor(lead?.lifecycleStatus);

  return (
    <div className="space-y-5">
      <div className="overflow-hidden rounded-lg border border-[#00000057] bg-white">
        <div className="flex flex-col gap-4 p-5 md:flex-row md:items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-[#EEF4FF]">
            <Landmark className="h-10 w-10 text-[#4A67C2]" />
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-4">
              <h2 className="text-[20px] font-bold text-[#101828]">
                {lead?.buildingType ? `${lead.buildingType} (${lead.location})` : "Project Details"}
              </h2>

              <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${statusInfo.className}`}>
                🟢 {statusInfo.label}
              </span>
            </div>

            <p className="mt-1 text-[14px] text-[#101828]">
              {lead?.jobId || lead?.projectId || "-"}
            </p>
          </div>
        </div>

        <div className="border-t border-[#98A2B3]" />

        <div className="grid gap-3 p-5 md:grid-cols-2 xl:grid-cols-4">
          {projectDetails.map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.title} className="flex gap-4">
                <Icon className="mt-1 h-7 w-7 text-[#101828]" />

                <div>
                  <p className="text-[16px] font-medium text-[#101828]">
                    {item.title}
                  </p>

                  <p className="text-[14px] text-[#667085]">{item.value}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <ProgressSteps
        steps={dynamicSteps}
        currentStep={currentStep}
        totalSteps={totalSteps}
        assignedSales={lead?.assignedSales}
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
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
              {LIFECYCLE_STEPS[currentStepIndex]?.title || "-"}
            </p>
          </div>

          <div className="mt-3 flex items-center gap-3">
            <CalendarDays size={22} />

            <div>
              <p className="text-[14px] font-medium text-[#101828]">
                Started on
              </p>

              <p className="text-[14px] text-[#667085]">
                {lead?.createdAt ? new Date(lead.createdAt).toLocaleDateString() : "-"}
              </p>
            </div>
          </div>

          <div className="mt-3">
            <p className="text-[14px] font-medium text-[#101828]">
              Estimate Completion
            </p>

            <p className="text-[14px] text-[#667085]">-</p>
          </div>
        </div>

        <ProjectActivityLog leadId={lead?._id || ""} />

        <ProjectNotes leadId={lead?._id || ""} />
      </div>
    </div>
  );
};

export default ProjectBasicInfo;
