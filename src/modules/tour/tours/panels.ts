import type { TourPanelConfig, TourStepViaConfig } from "../tour.types";
import { anchor, anchorWithStatus, click, modal, tab } from "./tour-helpers";

// Pages, modals, menus and tabs shared by several tours.

export const PROJECT = "/my_projects/:projectId";

export const openProject: TourStepViaConfig = {
  fromRoute: "/my_projects",
  openAnyway: true,
  ...click(anchor("project-row-view"), "Open a Project", "Click the <b>eye</b> to open the project."),
};

/** A tab on a project's page. */
export const projectTab = (label: string, contentAnchor: string): TourPanelConfig =>
  tab(
    contentAnchor,
    click(anchor(`project-tab-${label}`), `${label} Tab`, `Click the <b>${label}</b> tab.`),
  );

export const basicInfoTab = projectTab("Basic info", "tab-basic-info");
export const rfqTab = projectTab("RFQ", "tab-rfq");
export const quotationTab = projectTab("Quotation", "tab-quotation");
export const chatTab = projectTab("Open Chat", "tab-chat");
export const paymentsTab = projectTab("Payments", "tab-payments");
export const trackingTab = projectTab("Project Tracking", "tracking-step");

export const cancelProjectModal = modal(
  "project-cancel-modal",
  click(anchor("project-cancel"), "Cancel a Project", "<b>Cancel Project</b> asks for a reason first."),
);

export const approveQuotationModal = modal(
  "quotation-approve-modal",
  click(anchor("quotation-approve"), "Approve the Quotation", "<b>Approve to Proceed</b> asks you to confirm first."),
);

export const rejectQuotationModal = modal(
  "quotation-reject-modal",
  click(anchor("quotation-reject"), "Reject the Quotation", "<b>Reject</b> asks what should change first."),
);

export const userMenu = modal(
  "user-menu",
  click(anchor("user-menu-btn"), "Open Your Menu", "Your profile lives behind this button."),
);

/** A drawing that is at the given stage of its approval. */
export const drawingModal = (stage: "pending" | "approved" | "revision") => {
  const label = { pending: "Pending Review", approved: "Approved", revision: "Sent for Revision" }[stage];
  return modal(
    "drawing-modal",
    click(
      anchorWithStatus("drawing-view", stage),
      `Open a Drawing (${label})`,
      `Click the <b>eye</b> on a drawing marked <b>${label}</b>.`,
    ),
    { element: anchorWithStatus("drawing-modal", stage) },
  );
};

export const drawingRevisionModal = modal(
  "drawing-revision-modal",
  click(anchor("drawing-revision"), "Ask for a Revision", "<b>Revision Required</b> asks what should change first."),
);

export const paymentProofForm = modal(
  "payment-proof-form",
  click(
    anchorWithStatus("payment-upload", "open"),
    "Upload Payment Proof",
    "<b>Upload</b> opens the payment proof form.",
  ),
);

/** A payment whose proof has the given review status. */
export const paymentProofModal = (status: string, label: string) =>
  modal(
    "payment-proof-modal",
    click(
      anchorWithStatus("payment-proof", status),
      `View a Proof (${label})`,
      `Click the <b>eye</b> on a payment that is <b>${label.toLowerCase()}</b>.`,
    ),
    { element: anchorWithStatus("payment-proof-modal", status) },
  );

const deliveryModal = (tourId: string, button: string, label: string) =>
  modal(tourId, click(anchor(button), label, `<b>${label}</b> opens this window.`));

export const contactDriverModal = deliveryModal("contact-modal", "delivery-contact-driver", "Contact Driver");
export const contactCompanyModal = deliveryModal("contact-modal", "delivery-contact-company", "Delivery Company");
export const emailModal = deliveryModal("email-modal", "delivery-email", "Email Confirmation");
export const calendarModal = deliveryModal("calendar-modal", "delivery-calendar", "Add to Calendar");
export const instructionsModal = deliveryModal("instructions-modal", "delivery-instructions", "View Full Delivery Instructions");
export const callbackModal = deliveryModal("callback-modal", "delivery-callback", "Request Call Back");
export const deliveryDocumentsModal = deliveryModal("documents-modal", "delivery-documents", "Download Info (PDF)");
export const siteReadyModal = deliveryModal("site-ready-modal", "delivery-site-ready", "Confirm Site Ready");
export const equipmentModal = deliveryModal("equipment-modal", "delivery-equipment", "Confirm Equipment");
export const acknowledgeModal = deliveryModal("acknowledge-modal", "delivery-acknowledge", "Acknowledge");

/** One of the tabs of a project's delivery schedule. */
export const scheduleTab = (id: "upcoming" | "past" | "rescheduled", label: string): TourPanelConfig => ({
  element: anchorWithStatus("schedule-tabs", id),
  open: click(anchor(`schedule-tab-${id}`), `Open ${label}`, `Click <b>${label}</b>.`),
  isTab: true,
});

export const unpaidInvoices: TourPanelConfig = {
  element: anchorWithStatus("invoice-filters", "unpaid"),
  open: click(anchor("invoice-filter-unpaid"), "Show Unpaid", "<b>Unpaid</b> lists the invoices you still owe."),
  isTab: true,
};

export const paidInvoices: TourPanelConfig = {
  element: anchorWithStatus("invoice-filters", "paid"),
  open: click(anchor("invoice-filter-paid"), "Show Paid", "<b>Paid</b> lists the invoices already settled."),
  isTab: true,
};
