import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimelineStep {
  label: string;
  amount: string;
  isCompleted: boolean;
}

interface TimelineItemProps {
  orderId: string;
  steps: TimelineStep[];
}

const TimelineStep = ({ label, amount, isCompleted }: TimelineStep) => (
  <div className="flex items-center justify-start gap-6 w-fit">
    <div
      className={cn(
        "xl:w-10 xl:h-10 w-8 h-8 rounded-full flex items-center justify-center transition-colors",
        isCompleted
          ? "bg-[#DCFCE7] text-emerald-600"
          : "bg-gray-100 text-gray-400"
      )}
    >
      <Check
        className={cn(
          "xl:w-5 xl:h-5 w-4 h-4",
          isCompleted ? "opacity-100" : "opacity-40"
        )}
      />
    </div>
    <div className="flex flex-col gap-0.5">
      <span className="font-semibold text-gray-900 text-sm md:text-base">
        {label}
      </span>
      <span className="text-gray-400 text-xs md:text-sm">{amount}</span>
    </div>
  </div>
);

const TimelineCard = ({ orderId, steps }: TimelineItemProps) => (
  <div className="md:p-4 p-2 flex flex-col rounded-md bg-white mb-4 last:mb-0 border">
    <h5 className="font-bold text-gray-900 text-sm md:text-base mb-6">
      {orderId}
    </h5>
    <div className="flex flex-wrap md:items-center gap-8 md:gap-16">
      {steps.map((step, idx) => (
        <TimelineStep key={idx} {...step} />
      ))}
    </div>
  </div>
);

export default function PaymentTimeline() {
  const data: TimelineItemProps[] = [
    {
      orderId: "ORD-2024-001-ABC Industries",
      steps: [
        { label: "Deposit", amount: "$1,35,000", isCompleted: true },
        { label: "Progress", amount: "$1,80,000", isCompleted: true },
        { label: "Final", amount: "0", isCompleted: false },
      ],
    },
    {
      orderId: "ORD-2024-001-ABC Industries",
      steps: [
        { label: "Deposit", amount: "$1,35,000", isCompleted: true },
        { label: "Progress", amount: "$1,80,000", isCompleted: true },
        { label: "Final", amount: "0", isCompleted: false },
      ],
    },
    {
      orderId: "ORD-2024-001-ABC Industries",
      steps: [
        { label: "Deposit", amount: "$1,35,000", isCompleted: true },
        { label: "Progress", amount: "$1,80,000", isCompleted: true },
        { label: "Final", amount: "0", isCompleted: false },
      ],
    },
  ];

  return (
    <div className="bg-white rounded-md xl:p-6 p-4">
      <h2 className="md:text-xl font-bold text-black tracking-tight mb-4">
        Payment Timeline
      </h2>
      <div className="space-y-2">
        {data.map((item, index) => (
          <TimelineCard key={index} {...item} />
        ))}
      </div>
    </div>
  );
}
