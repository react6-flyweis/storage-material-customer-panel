import ReactECharts from "echarts-for-react";
import ProgressSteps from "./ProgressSteps";
import {
  Building2,
  Landmark,
  CalendarDays,
  MapPin,
  CircleDollarSign,
} from "lucide-react";

const projectDetails = [
  {
    icon: Building2,
    title: "Building Type",
    value: "Workshop",
  },
  {
    icon: CircleDollarSign,
    title: "Quote Value",
    value: "$12,500",
  },
  {
    icon: CalendarDays,
    title: "Created On",
    value: "2024-10-10",
  },
  {
    icon: MapPin,
    title: "Location",
    value: "1816 Bayone Ave, Manchester, NNJ, 098765",
  },
];

const progress = {
  currentStep: 6,
  totalSteps: 8,
  steps: [
    {
      id: 1,
      title: "Initial Contact",
      date: "24-10-10",
      status: "completed",
    },
    {
      id: 2,
      title: "Requirements Gathered",
      date: "24-10-10",
      status: "completed",
    },
    {
      id: 3,
      title: "Proposal Received",
      date: "24-10-10",
      status: "completed",
    },
    {
      id: 4,
      title: "Negotiation",
      date: "24-10-10",
      status: "completed",
    },
    {
      id: 5,
      title: "Deal Closed",
      date: "24-10-10",
      status: "completed",
    },
    {
      id: 6,
      title: "Payment Done",
      status: "current",
    },
    {
      id: 7,
      title: "Delivered",
      status: "pending",
    },
    {
      id: 8,
      title: "Building Done",
      status: "pending",
    },
  ],
};

const projectStatusData = {
  currentStep: 6,
  totalSteps: 14,
  currentStepName: "Payment Done",
  startedOn: "2024-10-10",
  estimatedCompletion: "2024-10-10",
};

const recentActivities = [
  {
    title: "Step updated: Requirements gathered",
    date: "19 Jan 2025",
  },
  {
    title: "Proposal Sent - PR1234",
    date: "18 Jan 2025",
  },
  {
    title: "Negotiated Price received from client",
    date: "18 Jan 2025",
  },
  {
    title: "Deal closed",
    date: "17 Jan 2025",
  },
  {
    title: "2 unread messages",
    date: "17 Jan 2025",
    highlight: true,
  },
];

const notes = [
  {
    lines: [
      "Reliable for long-distance steel transport.",
      "Preferred carrier for Texas routes.",
      "Fast response time during bidding.",
    ],
  },
  {
    lines: [
      "Reliable for long-distance steel transport.",
      "Preferred carrier for Texas routes.",
      "Fast response time during bidding.",
    ],
  },
  {
    lines: [
      "Reliable for long-distance steel transport.",
      "Preferred carrier for Texas routes.",
      "Fast response time during bidding.",
    ],
  },
  {
    lines: [
      "Reliable for long-distance steel transport.",
      "Preferred carrier for Texas routes.",
      "Fast response time during bidding.",
    ],
  },
];

const ProjectBasicInfo = () => {
  const percentage =
    (projectStatusData.currentStep / projectStatusData.totalSteps) * 100;

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
                Project 1- ABC Warehouse
              </h2>

              <span className="inline-flex items-center gap-2 rounded-full bg-[#DDF5E5] px-3 py-1 text-sm font-medium text-[#34A853]">
                🟢 Quotation Sent
              </span>
            </div>

            <p className="mt-1 text-[14px] text-[#101828]">Q-2025-1047</p>
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
        steps={progress.steps}
        currentStep={progress.currentStep}
        totalSteps={progress.totalSteps}
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

              <p className="text-[54px] font-semibold leading-none">6</p>

              <p className="text-[14px] text-[#667085]">of 14</p>
            </div>
          </div>

          <div className="mt-3">
            <p className="text-[14px] text-[#667085]">Current step</p>

            <p className="text-[14px] font-medium text-[#1D4ED8]">
              Payment Done
            </p>
          </div>

          <div className="mt-3 flex items-center gap-3">
            <CalendarDays size={22} />

            <div>
              <p className="text-[14px] font-medium text-[#101828]">
                Started on
              </p>

              <p className="text-[14px] text-[#667085]">2024-10-10</p>
            </div>
          </div>

          <div className="mt-3">
            <p className="text-[14px] font-medium text-[#101828]">
              Estimate Completion
            </p>

            <p className="text-[14px] text-[#667085]">2024-10-10</p>
          </div>
        </div>

        <div className="rounded-lg border border-[#98A2B3] bg-white p-5">
          <h2 className="text-[20px] font-bold text-[#101828]">
            Recent Activity
          </h2>

          <div className="my-4 border-t" />

          <div className="relative">
            <div className="absolute left-[10px] top-2 bottom-2 border-l border-dashed border-[#D0D5DD]" />

            <div className="space-y-8">
              {recentActivities.map((item) => (
                <div key={item.title} className="relative flex gap-2">
                  <div className="z-10 h-5 w-5 rounded-full border-2 border-[#7C3AED] bg-white">
                    <div className="m-[3px] h-2.5 w-2.5 rounded-full bg-[#7C3AED]" />
                  </div>

                  <div>
                    <p
                      className={`text-[14px] ${
                        item.highlight ? "font-semibold" : "font-medium"
                      } text-[#101828]`}
                    >
                      {item.title}
                    </p>

                    <div className="mt-1 flex text-sm items-center gap-2 text-[#667085]">
                      <CalendarDays size={14} />
                      <span>{item.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-[#98A2B3] bg-white p-5">
          <h2 className="text-[20px] font-bold text-[#101828]">Notes</h2>

          <div className="my-4 border-t" />

          <div className="space-y-8">
            {notes.map((group, index) => (
              <div key={index} className="space-y-1">
                {group.lines.map((line, idx) => (
                  <p key={idx} className="text-[14px] text-[#667085]">
                    {line}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectBasicInfo;
