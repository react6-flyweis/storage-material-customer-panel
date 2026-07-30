export type OrderRawStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "fulfilled"
  | "cancelled";

export type OrderStage =
  | "new_order"
  | "quotation_received"
  | "quotation_approved"
  | "order_confirmed"
  | "completed"
  | "cancelled"
  | "rejected";

export const deriveOrderStage = (
  status?: string,
  stage?: string,
  quotationStatus?: string,
  hasQuotation?: boolean
): OrderStage => {
  if (stage) {
    const normStage = stage.toLowerCase().trim();
    if (
      normStage === "new_order" ||
      normStage === "quotation_received" ||
      normStage === "quotation_approved" ||
      normStage === "order_confirmed" ||
      normStage === "completed" ||
      normStage === "cancelled" ||
      normStage === "rejected"
    ) {
      return normStage as OrderStage;
    }
    // Handle alternative stage string variants if sent by API
    if (normStage === "quote_receive" || normStage === "quotation_sent") {
      return "quotation_received";
    }
    if (normStage === "quote_approve") return "order_confirmed";
    if (normStage === "confirmed") return "order_confirmed";
    if (normStage === "fulfilled" || normStage === "delivered") return "completed";
  }

  const normStatus = (status || "").toLowerCase().trim();
  if (normStatus === "cancelled") return "cancelled";
  if (normStatus === "rejected") return "rejected";
  if (
    normStatus === "fulfilled" ||
    normStatus === "completed" ||
    normStatus === "delivered"
  ) {
    return "completed";
  }
  if (normStatus === "approved" || normStatus === "order_confirmed") {
    return "order_confirmed";
  }

  // When raw status is "pending":
  const normQuotStatus = (quotationStatus || "").toLowerCase().trim();
  if (normQuotStatus === "approved") return "order_confirmed";
  if (normQuotStatus === "sent" || hasQuotation) return "quotation_received";

  return "new_order";
};

export interface OrderBadgeConfig {
  label: string;
  prefix?: string;
  badgeClass: string;
  dotClass: string;
  category:
    | "New Orders"
    | "Quotation Received"
    | "Pending"
    | "Completed"
    | "Cancelled"
    | "Rejected";
}

export const getOrderStageBadgeConfig = (stage: OrderStage): OrderBadgeConfig => {
  switch (stage) {
    case "new_order":
      return {
        label: "New Order",
        prefix: "+ ",
        badgeClass: "bg-[#0084FF] text-white",
        dotClass: "bg-white",
        category: "New Orders",
      };
    case "quotation_received":
      return {
        label: "Quotation Received",
        badgeClass: "bg-[#9333EA] text-white",
        dotClass: "bg-white",
        category: "Quotation Received",
      };
    case "quotation_approved":
    case "order_confirmed":
      return {
        label: "Pending",
        badgeClass: "bg-[#D97706] text-white",
        dotClass: "bg-white",
        category: "Pending",
      };
    case "completed":
      return {
        label: "Delivered",
        badgeClass: "bg-[#22C55E] text-white",
        dotClass: "bg-white",
        category: "Completed",
      };
    case "cancelled":
      return {
        label: "Cancelled",
        badgeClass: "bg-[#6B7280] text-white",
        dotClass: "bg-white",
        category: "Cancelled",
      };
    case "rejected":
      return {
        label: "Rejected",
        badgeClass: "bg-[#DC2626] text-white",
        dotClass: "bg-white",
        category: "Rejected",
      };
    default:
      return {
        label: "New Order",
        prefix: "+ ",
        badgeClass: "bg-[#0084FF] text-white",
        dotClass: "bg-white",
        category: "New Orders",
      };
  }
};

export interface OrderStepItem {
  id: string;
  label: string;
  completed: boolean;
  active: boolean;
}

export const getOrderStepperSteps = (stage: OrderStage): OrderStepItem[] => {
  const steps = [
    { id: "requested", label: "New Order" },
    { id: "quote_receive", label: "Quotation Receive" },
    { id: "quote_approve", label: "Quotation Approve" },
    { id: "confirmed", label: "Order Confirmed" },
    { id: "completed", label: "Completed" },
  ];

  switch (stage) {
    case "new_order":
      return steps.map((step, idx) => ({
        ...step,
        completed: idx === 0,
        active: idx === 0,
      }));

    case "quotation_received":
      return steps.map((step, idx) => ({
        ...step,
        completed: idx <= 1,
        active: idx === 1,
      }));

    case "quotation_approved":
    case "order_confirmed":
      // Requested -> Quotation Receive -> Quotation Approve -> Order Confirmed all completed ✓
      return steps.map((step, idx) => ({
        ...step,
        completed: idx <= 3,
        active: idx === 3,
      }));

    case "completed":
      // All 5 steps completed ✓
      return steps.map((step) => ({
        ...step,
        completed: true,
        active: step.id === "completed",
      }));

    case "cancelled":
    case "rejected":
      return steps.map((step, idx) => ({
        ...step,
        completed: idx === 0,
        active: idx === 0,
      }));

    default:
      return steps.map((step, idx) => ({
        ...step,
        completed: idx === 0,
        active: idx === 0,
      }));
  }
};
