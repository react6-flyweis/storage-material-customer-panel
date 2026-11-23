import type { TourDefinition } from "../tour.types";
import { drawingModal, drawingRevisionModal } from "./panels";
import { anchor, anchorWithStatus, click, onPage } from "./tour-helpers";

const BUILDINGS = "/project-buildings/:drawingsProjectId";
const BUILDING = "/project-building-drawings/:drawingsBuildingProjectId";

const NO_DRAWINGS = "You'll see this once drawings are sent to you.";
const WAITING = "Shown while a drawing is waiting for your review.";

const pending = drawingModal("pending");
const approved = drawingModal("approved");
const revision = drawingModal("revision");

/** How a drawing is reviewed, and what it looks like after each decision. */
export const drawingApprovalTour: TourDefinition = {
  id: "drawing-approval",
  name: "Drawing Approval Guide",
  description: "Review a drawing, approve it or ask for a revision.",
  estimatedMinutes: 4,
  steps: [
    {
      id: "da-project",
      route: "/drawings",
      element: anchor("drawings-project"),
      title: "1 · Pick a Project",
      description: "Your drawings are grouped by project.",
      speechText: "Your drawings are grouped by project.",
      whenMissing: NO_DRAWINGS,
    },
    {
      id: "da-buildings",
      route: BUILDINGS,
      element: anchor("buildings-overview"),
      title: "1 · The Project's Buildings",
      description: "How many buildings and drawings the project has.",
      via: {
        fromRoute: "/drawings",
        ...click(anchor("drawings-project-view"), "View a Project", "Click <b>View</b> to see the project's buildings."),
      },
      whenMissing: NO_DRAWINGS,
    },
    {
      id: "da-building",
      route: BUILDINGS,
      element: anchor("building-card"),
      title: "1 · A Building",
      description: "Each building with its number of drawings and last update.",
      side: "top",
      whenMissing: NO_DRAWINGS,
      fallback: anchor("buildings-overview"),
    },
    {
      id: "da-drawings",
      route: BUILDING,
      element: anchor("building-drawings"),
      title: "2 · The Building's Drawings",
      description: "Every drawing, with its approval status on top.",
      side: "top",
      via: {
        fromRoute: BUILDINGS,
        ...click(anchor("building-open"), "Open Drawings", "Click <b>Open Drawings</b> on a building."),
      },
      whenMissing: NO_DRAWINGS,
    },
    ...onPage({ route: BUILDING, fallback: anchor("building-drawings"), whenMissing: NO_DRAWINGS }, [
      {
        id: "da-filter",
        element: anchor("building-filter"),
        title: "2 · Filter by Status",
        description: "Show only approved drawings, pending ones or those sent for revision.",
        side: "left",
      },
      {
        id: "da-download",
        element: anchor("drawing-download"),
        title: "2 · Download",
        description: "The arrow opens the file. The <b>eye</b> next to it opens the drawing for review.",
        side: "left",
      },

      // ── Before the decision ───────────────────────────────────────────
      {
        id: "da-pending",
        element: anchorWithStatus("drawing-modal", "pending"),
        panels: [pending],
        title: "3 · Before You Decide",
        description: "A drawing that is <b>Pending Review</b> waits for you. Look at it closely here.",
        whenMissing: WAITING,
      },
      {
        id: "da-modal-download",
        element: anchor("drawing-modal-download"),
        panels: [pending],
        title: "3 · Download It",
        description: "Save it to check it with your team.",
        side: "top",
        whenMissing: WAITING,
      },
      {
        id: "da-comment",
        element: anchor("drawing-comment"),
        panels: [pending],
        title: "3 · Leave a Comment",
        description: "Suggest something without deciding yet, then press <b>Send Comment</b>.",
        side: "top",
        whenMissing: "Shown on drawings waiting for review that have no comment yet.",
      },
      {
        id: "da-approve",
        element: anchor("drawing-approve"),
        panels: [pending],
        title: "3 · Approve",
        description: "Accepts the drawing right away, so make sure it's correct first.",
        side: "top",
        whenMissing: WAITING,
      },
      {
        id: "da-revision",
        element: anchor("drawing-revision-modal"),
        panels: [pending, drawingRevisionModal],
        title: "3 · Or Ask for a Revision",
        description: "Write what should change and press <b>Submit</b>. The team sends you a new version.",
        whenMissing: WAITING,
      },

      // ── After the decision ────────────────────────────────────────────
      {
        id: "da-approved",
        element: anchor("drawing-decision"),
        panels: [approved],
        title: "4 · After You Approve",
        description: "The buttons are replaced by <b>Approved</b> and the date. You can still view and download it.",
        side: "top",
        whenMissing: "Shown once you approve a drawing.",
      },
      {
        id: "da-revised",
        element: anchor("drawing-decision"),
        panels: [revision],
        title: "4 · After Asking for a Revision",
        description: "It's marked <b>Sent for Revision</b>, and you can't approve it until the new version arrives.",
        side: "top",
        whenMissing: "Shown once you ask for a revision.",
      },
      {
        id: "da-feedback",
        element: anchor("drawing-feedback"),
        panels: [revision],
        title: "4 · Your Feedback",
        description: "Your revision message and suggestions stay with the drawing.",
        side: "top",
        whenMissing: "Shown on drawings with a revision message or comment.",
      },
    ]),
  ],
};
