import type { TourDefinition } from "../tour.types";
import {
  approveQuotationModal,
  basicInfoTab,
  cancelProjectModal,
  chatTab,
  openProject,
  paymentsTab,
  PROJECT,
  quotationTab,
  rejectQuotationModal,
  rfqTab,
  trackingTab,
} from "./panels";
import { anchor, anchorWithStatus, click, onPage } from "./tour-helpers";

const PROJECT_DRAWINGS = "/project-drawings/:projectId";
const PROJECT_IMAGES = "/project-images/:projectId";

const NO_PROJECT = "You'll see this once you have a project.";
const TABS = anchor("project-tabs");
const NO_QUOTATION = "Shown once our team sends you a quotation.";
const WAITING_DECISION = "Shown while a quotation is waiting for your decision.";

/**
 * Follows a project from request to delivery, with what can be done before and
 * after each approval. Stages the project hasn't reached are still explained.
 */
export const projectJourneyTour: TourDefinition = {
  id: "project-journey",
  name: "Project Journey Guide",
  description: "A project from quotation to payment and tracking.",
  estimatedMinutes: 6,
  steps: [
    // ── 1. The project ──────────────────────────────────────────────────
    {
      id: "pj-tabs",
      route: PROJECT,
      element: TABS,
      title: "1 · Your Project",
      description: "Everything about a project is in these tabs. We'll go through them in order.",
      speechText: "Everything about a project is in these tabs. We'll go through them in order.",
      via: openProject,
      whenMissing: NO_PROJECT,
    },
    ...onPage({ route: PROJECT, panels: [basicInfoTab], whenMissing: NO_PROJECT, fallback: TABS }, [
      {
        id: "pj-summary",
        element: anchor("project-summary"),
        title: "1 · Summary",
        description: "The project's status, buildings, value and location.",
      },
      {
        id: "pj-steps",
        element: anchor("project-steps"),
        title: "1 · Project Steps",
        description: "Each stage, when it was completed and which one you're at. Use the arrows to see them all.",
        side: "top",
      },
      {
        id: "pj-upcoming",
        element: anchor("project-upcoming"),
        title: "1 · Upcoming Delivery",
        description: "The project's next deliveries. <b>View All</b> opens its delivery schedule.",
        side: "top",
      },
      {
        id: "pj-upcoming-view",
        element: anchor("project-upcoming-view"),
        title: "1 · View a Delivery",
        description: "The <b>eye</b> shows that delivery's full instructions.",
        side: "left",
        whenMissing: "Shown once a delivery is scheduled.",
        fallback: anchor("project-upcoming"),
      },
      {
        id: "pj-status",
        element: anchor("project-status"),
        title: "1 · Status, Activity & Notes",
        description: "The current step, what happened recently and notes from the team.",
        side: "top",
      },
      {
        id: "pj-cancel",
        element: anchor("project-cancel-modal"),
        panels: [basicInfoTab, cancelProjectModal],
        title: "1 · Cancel Project",
        description: "Give a reason to request it. Nothing is canceled until you press <b>Cancel Project</b> here.",
      },
    ]),
    {
      id: "pj-drawings",
      route: PROJECT_DRAWINGS,
      element: anchor("project-drawings-list"),
      title: "1 · Project Drawings",
      description: "The project's drawings and building photos, with their approval status. The <b>eye</b> opens one to review it.",
      side: "top",
      via: {
        fromRoute: PROJECT,
        panels: [basicInfoTab],
        openAnyway: true,
        ...click(anchor("project-drawings-btn"), "Open Drawings", "Click <b>Drawings</b> at the top of the project."),
      },
      whenMissing: NO_PROJECT,
    },
    {
      id: "pj-drawings-back",
      route: PROJECT,
      element: TABS,
      title: "2 · Next: the Quotation",
      description: "Back on the project, let's look at its request and quotation.",
      via: {
        fromRoute: PROJECT_DRAWINGS,
        openAnyway: true,
        ...click(anchor("project-drawings-back"), "Back to the Project", "Click <b>Back</b> to return to the project."),
      },
      whenMissing: NO_PROJECT,
    },

    // ── 2. Quotation ────────────────────────────────────────────────────
    ...onPage({ route: PROJECT, panels: [rfqTab], whenMissing: NO_PROJECT, fallback: TABS }, [
      {
        id: "pj-rfq",
        element: anchor("tab-rfq"),
        title: "2 · Your Request (RFQ)",
        description: "What you asked for, with an estimated price range, what's included and optional add-ons.",
        side: "top",
      },
      {
        id: "pj-rfq-download",
        element: anchor("rfq-download"),
        title: "2 · Download the Estimate",
        description: "Saves the estimate as a PDF.",
        side: "top",
        whenMissing: "Shown once a PDF of the estimate is available.",
        fallback: anchor("tab-rfq"),
      },
    ]),
    ...onPage({ route: PROJECT, panels: [quotationTab], fallback: anchor("tab-quotation") }, [
      {
        id: "pj-quote-waiting",
        element: anchorWithStatus("tab-quotation", "waiting"),
        title: "2 · Before the Quotation",
        description: "Until our team sends it, this tab says the quotation is in progress or hasn't been received.",
        whenMissing: "Shown until a quotation is sent to you.",
      },
      {
        id: "pj-quote-header",
        element: anchor("quotation-header"),
        title: "2 · The Quotation",
        description: "Its number, version, status and how long it's valid.",
        whenMissing: NO_QUOTATION,
      },
      {
        id: "pj-quote-preview",
        element: anchor("quotation-preview"),
        title: "2 · Read It",
        description: "The full quotation document.",
        side: "top",
        whenMissing: NO_QUOTATION,
      },
      {
        id: "pj-quote-download",
        element: anchor("quotation-download"),
        title: "2 · Download PDF",
        description: "Saves the quotation.",
        side: "left",
        whenMissing: NO_QUOTATION,
      },
      {
        id: "pj-quote-approve",
        element: anchor("quotation-approve-modal"),
        panels: [quotationTab, approveQuotationModal],
        title: "2 · Approve to Proceed",
        description: "Happy with it? <b>Confirm Approval</b> locks it in and the project moves on.",
        whenMissing: WAITING_DECISION,
      },
      {
        id: "pj-quote-reject",
        element: anchor("quotation-reject-modal"),
        panels: [quotationTab, rejectQuotationModal],
        title: "2 · Or Reject It",
        description: "Say what should change and press <b>Submit Rejection</b>. Sales prepares a new version.",
        whenMissing: WAITING_DECISION,
      },
      {
        id: "pj-quote-header-actions",
        element: anchor("quotation-header-actions"),
        title: "2 · The Same Buttons, Up Here",
        description: "Reject and Approve are also at the top of the page. This <b>Approve to proceed</b> approves right away, without asking again.",
        side: "left",
        whenMissing: WAITING_DECISION,
      },
      {
        id: "pj-quote-rejected",
        element: anchor("quotation-rejected"),
        title: "2 · After You Reject",
        description: "Your feedback is shown here, and Approve and Reject are disabled. A rejection can't be undone; wait for the updated quotation.",
        whenMissing: "Shown once you reject a quotation.",
      },
    ]),

    // ── 3. Chat ─────────────────────────────────────────────────────────
    ...onPage({ route: PROJECT, panels: [chatTab], whenMissing: NO_PROJECT, fallback: TABS }, [
      {
        id: "pj-chat",
        element: anchor("tab-chat"),
        title: "3 · Open Chat",
        description: "Ask about this project. An assistant or our team answers.",
        side: "top",
      },
      {
        id: "pj-chat-input",
        element: anchor("project-chat-input"),
        title: "3 · Write a Message",
        description: "Type here and press send. If the chat session is closed, a note says so instead.",
        side: "top",
      },
    ]),

    // ── 4. Payments ─────────────────────────────────────────────────────
    ...onPage({ route: PROJECT, panels: [paymentsTab], whenMissing: NO_PROJECT, fallback: TABS }, [
      {
        id: "pj-pay-summary",
        element: anchor("project-payments-summary"),
        title: "4 · Payments",
        description: "The project's total, what you've paid and the balance.",
      },
      {
        id: "pj-pay-history",
        element: anchor("project-payments-history"),
        title: "4 · Invoices",
        description: "Each invoice with its amount, due date and status.",
        side: "top",
      },
      {
        id: "pj-pay",
        element: anchor("project-payments-pay"),
        title: "4 · Pay",
        description: "Takes you to Payments to submit your payment's proof.",
        side: "left",
        whenMissing: "Shown on invoices that are pending.",
        fallback: anchor("project-payments-history"),
        branch: { tourId: "payments-guide", label: "Payments Guide (4 min)" },
      },
    ]),

    // ── 5. Tracking ─────────────────────────────────────────────────────
    ...onPage({ route: PROJECT, panels: [trackingTab], whenMissing: NO_PROJECT, fallback: TABS }, [
      {
        id: "pj-track-step",
        element: anchor("tracking-step"),
        title: "5 · Project Tracking",
        description: "The current step: who started it, how complete it is and when it should finish.",
        side: "left",
      },
      {
        id: "pj-track-progress",
        element: anchor("tracking-progress"),
        title: "5 · Overall Progress",
        description: "How far the whole project is.",
        side: "top",
      },
      {
        id: "pj-track-docs",
        element: anchor("tracking-documents"),
        title: "5 · Step Documents",
        description: "Files attached to the current step, to view or download.",
        side: "left",
      },
    ]),

    // ── 6. Images ───────────────────────────────────────────────────────
    {
      id: "pj-images",
      route: PROJECT_IMAGES,
      element: anchor("images-filter"),
      title: "6 · Project Images",
      description: "Photos and videos from the site. Show all of them, or one kind.",
      side: "left",
      via: {
        fromRoute: PROJECT,
        openAnyway: true,
        ...click(anchor("project-tab-Project Images"), "Open Project Images", "Click the <b>Project Images</b> tab."),
      },
      whenMissing: NO_PROJECT,
    },
    ...onPage({ route: PROJECT_IMAGES, whenMissing: NO_PROJECT }, [
      {
        id: "pj-images-item",
        element: anchor("images-item"),
        title: "6 · View an Image",
        description: "Click one to see it larger and move through the rest.",
        whenMissing: "Shown once the site team uploads photos or videos.",
        fallback: anchor("images-filter"),
      },
    ]),
  ],
};
