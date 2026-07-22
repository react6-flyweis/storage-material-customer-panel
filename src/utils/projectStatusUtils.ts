export interface StatusBadgeConfig {
  label: string;
  className: string;
  dotColor: string;
}

export const LIFECYCLE_STEPS = [
  { key: "design", title: "Design" },
  { key: "fabrication", title: "Fabrication" },
  { key: "dispatch", title: "Dispatch" },
  { key: "install", title: "Install" },
  { key: "complete", title: "Complete" },
];

export const STATUS_MAP: Record<string, number> = {
  // Design / Early stages
  initial_contact: 0,
  requirements_gathered: 0,
  proposal_received: 0,
  proposal_sent: 0,
  quotation_sent: 0,
  design: 0,
  
  // Fabrication / Deal stages
  negotiation: 1,
  deal_closed: 1,
  paid: 1,
  payment_done: 1,
  fabrication: 1,

  // Dispatch / Delivery
  delivered: 2,
  dispatch: 2,
  dispatched: 2,

  // Install
  install: 3,
  installation: 3,
  in_progress: 3,

  // Complete
  building_done: 4,
  completed: 4,
  complete: 4,
};

export const getStatusBadgeConfig = (status?: string): StatusBadgeConfig => {
  if (!status) {
    return {
      label: "Active Project",
      className: "bg-[#E6F4EA] text-[#16A34A]",
      dotColor: "bg-[#16A34A]",
    };
  }

  const normalized = status.toLowerCase().trim();

  const formattedLabel = normalized
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const label = formattedLabel.toLowerCase().includes("project")
    ? formattedLabel
    : `${formattedLabel} Project`;

  switch (normalized) {
    case "completed":
    case "complete":
    case "building_done":
    case "deal_closed":
    case "active":
      return {
        label,
        className: "bg-[#E6F4EA] text-[#16A34A]",
        dotColor: "bg-[#16A34A]",
      };
    case "in_progress":
    case "install":
    case "installation":
    case "dispatch":
    case "dispatched":
    case "fabrication":
      return {
        label,
        className: "bg-[#EFF6FF] text-[#2563EB]",
        dotColor: "bg-[#2563EB]",
      };
    case "proposal_received":
    case "proposal_sent":
    case "quotation_sent":
    case "negotiation":
      return {
        label,
        className: "bg-[#FEF3C7] text-[#D97706]",
        dotColor: "bg-[#D97706]",
      };
    case "cancelled":
    case "rejected":
    case "lost":
      return {
        label,
        className: "bg-[#FEE2E2] text-[#DC2626]",
        dotColor: "bg-[#DC2626]",
      };
    case "pending":
    case "initial_contact":
    case "requirements_gathered":
    default:
      return {
        label,
        className: "bg-[#F3F4F6] text-[#4B5563]",
        dotColor: "bg-[#6B7280]",
      };
  }
};
