import type { TourDefinition } from "../tour.types";
import { paidInvoices, unpaidInvoices, userMenu } from "./panels";
import { ANY_PAGE, anchor, click, onPage } from "./tour-helpers";

const NO_PROJECT = "You'll see this once you have a project.";
const NO_DELIVERY = "You'll see this once a delivery is scheduled for you.";
const NO_NOTIFICATION = "Notifications are listed here as they arrive.";

/** Every page in the sidebar and header, with what can be done on each. */
export const customerOverviewTour: TourDefinition = {
  id: "customer-overview",
  name: "Customer Walkthrough",
  description: "Every page of the customer panel and the actions on it.",
  estimatedMinutes: 8,
  steps: [
    // ── Layout ──────────────────────────────────────────────────────────
    ...onPage({ route: ANY_PAGE }, [
      {
        id: "shell-sidebar",
        element: anchor("sidebar"),
        title: "The Sidebar",
        description: "Every section has an icon here. Sections with several pages list them next to the icons.",
        speechText: "Welcome to your panel. Use the sidebar to move between sections.",
        side: "right",
        whenMissing: "On smaller screens, the menu button at the top left opens it.",
      },
      {
        id: "shell-search",
        element: anchor("header-search"),
        title: "Search Projects",
        description: "Find one of your projects from any page.",
      },
      {
        id: "shell-bell",
        element: anchor("header-notifications"),
        title: "The Bell",
        description: "Brings you to your notifications from any page. The badge counts unread ones.",
      },
    ]),

    // ── Dashboard ───────────────────────────────────────────────────────
    ...onPage({ route: "/dashboard" }, [
      {
        id: "dash-stats",
        element: anchor("dashboard-stats"),
        title: "Dashboard: Your Projects",
        description: "Active and closed projects, drawings to approve and the timeline at a glance.",
        speechText: "These cards summarize your projects.",
      },
      {
        id: "dash-deliveries",
        element: anchor("dashboard-deliveries"),
        title: "Dashboard: Delivery Tracking",
        description: "How many deliveries are in transit, staged, ready, upcoming, delayed or rescheduled.",
        side: "top",
      },
      {
        id: "dash-project",
        element: anchor("dashboard-project"),
        title: "Dashboard: Active Project",
        description: "Your current project's progress, stage, next milestone and project manager.",
        side: "right",
      },
      {
        id: "dash-drawings",
        element: anchor("dashboard-drawings"),
        title: "Dashboard: Drawings & Approvals",
        description: "Drawings waiting for your review, approved, revised or needing clarification. Click one to open your drawings.",
        side: "left",
      },
      {
        id: "dash-finance",
        element: anchor("dashboard-finance"),
        title: "Dashboard: Financial Overview",
        description: "Total value, what you've paid, what's pending and your next invoice.",
        side: "right",
      },
      {
        id: "dash-messages",
        element: anchor("dashboard-messages"),
        title: "Dashboard: Recent Messages",
        description: "The latest messages from the team.",
        side: "top",
      },
      {
        id: "dash-notifications",
        element: anchor("dashboard-notifications"),
        title: "Dashboard: Notifications",
        description: "What's new. <b>View All Notifications</b> opens the full list.",
        side: "left",
      },
      {
        id: "dash-shipments",
        element: anchor("dashboard-shipments"),
        title: "Dashboard: Shipment Breakdown",
        description: "Your loads and bundles on the way.",
        side: "top",
      },
      {
        id: "dash-next",
        element: anchor("delivery-card"),
        title: "Dashboard: Next Delivery",
        description: "Everything about your next delivery, with buttons to prepare for it.",
        side: "top",
        whenMissing: NO_DELIVERY,
        branch: {
          tourId: "delivery-guide",
          label: "Delivery Guide (5 min)",
          description: "Want to see every delivery action, before and after it arrives?",
        },
      },
    ]),

    // ── My projects ─────────────────────────────────────────────────────
    ...onPage({ route: "/my_projects" }, [
      {
        id: "proj-stats",
        element: anchor("projects-stats"),
        title: "My Projects: Summary",
        description: "Your total, active, in-progress and canceled projects.",
      },
      {
        id: "proj-list",
        element: anchor("projects-list"),
        title: "My Projects: The List",
        description: "Each project with its location, dates, manager, status and amount.",
        side: "top",
      },
      {
        id: "proj-filter",
        element: anchor("projects-filter"),
        title: "My Projects: Filter",
        description: "Show only projects with a certain status.",
        side: "left",
      },
      {
        id: "proj-view",
        element: anchor("project-row-view"),
        title: "My Projects: View",
        description: "Opens the project, with its quotation, documents, chat, payments and tracking.",
        side: "left",
        whenMissing: NO_PROJECT,
        fallback: anchor("projects-list"),
        branch: {
          tourId: "project-journey",
          label: "Project Journey Guide (6 min)",
          description: "Want to follow a project from quotation to delivery?",
        },
      },
    ]),
    {
      id: "create-submit",
      route: "/add-new-project",
      element: anchor("project-create-submit"),
      title: "New Project: Submit",
      description: "Sends your request. Our team prepares a quotation from it.",
      side: "top",
      via: {
        fromRoute: "/my_projects",
        openAnyway: true,
        ...click(anchor("projects-create"), "Create a Project", "Click <b>Create New Project</b> to open the form."),
      },
    },

    // ── Drawings ────────────────────────────────────────────────────────
    ...onPage({ route: "/drawings" }, [
      {
        id: "draw-project",
        element: anchor("drawings-project"),
        title: "Drawings: By Project",
        description: "Each project with its number of buildings and drawings, and when they last changed.",
        whenMissing: "You'll see your projects here once they have drawings.",
      },
      {
        id: "draw-view",
        element: anchor("drawings-project-view"),
        title: "Drawings: View",
        description: "Opens the project's buildings, where you review and approve their drawings.",
        side: "left",
        whenMissing: "Shown on each project with drawings.",
        branch: {
          tourId: "drawing-approval",
          label: "Drawing Approval Guide (4 min)",
          description: "Want to see how to approve a drawing or ask for a revision?",
        },
      },
    ]),

    // ── Payments & invoices ─────────────────────────────────────────────
    ...onPage({ route: "/payments" }, [
      {
        id: "pay-stats",
        element: anchor("payments-stats"),
        title: "Payments: Summary",
        description: "Total value, pending and paid amounts, and your next invoice.",
      },
      {
        id: "pay-upcoming",
        element: anchor("payments-upcoming"),
        title: "Payments: Upcoming",
        description: "What's due next. After paying, use <b>Upload</b> to send your receipt.",
        side: "top",
        branch: {
          tourId: "payments-guide",
          label: "Payments Guide (4 min)",
          description: "Want to follow a payment from upload to approval?",
        },
      },
      {
        id: "pay-overdue",
        element: anchor("payments-overdue"),
        title: "Payments: Overdue",
        description: "Payments past their due date.",
        side: "top",
      },
      {
        id: "pay-history",
        element: anchor("payments-history"),
        title: "Payments: History",
        description: "Payments you've made, with their status. The <b>eye</b> shows the proof you sent.",
        side: "top",
      },
    ]),
    ...onPage({ route: "/invoices" }, [
      {
        id: "inv-filters",
        element: anchor("invoice-filters"),
        title: "Invoices: Paid or Unpaid",
        description: "Switch between paid and unpaid invoices.",
      },
      {
        id: "inv-paid",
        element: anchor("invoice-list"),
        panels: [paidInvoices],
        title: "Invoices: Paid",
        description: "Invoices already settled.",
        side: "top",
      },
      {
        id: "inv-unpaid",
        element: anchor("invoice-list"),
        panels: [unpaidInvoices],
        title: "Invoices: Unpaid",
        description: "Invoices still to be paid.",
        side: "top",
      },
      {
        id: "inv-download",
        element: anchor("invoice-download"),
        title: "Invoices: Download",
        description: "Saves the invoice.",
        side: "left",
        whenMissing: "Shown on every invoice.",
        fallback: anchor("invoice-list"),
      },
      {
        id: "inv-view",
        element: anchor("invoice-view"),
        title: "Invoices: View",
        description: "Opens the invoice, where you can also submit a remark or a payment proof.",
        side: "left",
        whenMissing: "Shown on every invoice.",
        fallback: anchor("invoice-list"),
      },
    ]),

    // ── Delivery schedule ───────────────────────────────────────────────
    ...onPage({ route: "/delivery-schedule" }, [
      {
        id: "sched-project",
        element: anchor("schedule-project"),
        title: "Delivery Schedule",
        description: "Each project with its upcoming, past and rescheduled deliveries.",
        whenMissing: NO_PROJECT,
      },
      {
        id: "sched-view",
        element: anchor("schedule-project-view"),
        title: "Delivery Schedule: View",
        description: "Opens the project's deliveries.",
        side: "left",
        whenMissing: NO_PROJECT,
      },
    ]),

    // ── Notifications ───────────────────────────────────────────────────
    ...onPage({ route: "/notification" }, [
      {
        id: "notif-stats",
        element: anchor("notifications-stats"),
        title: "Notifications: Summary",
        description: "Total, unread, high priority and today's notifications.",
      },
      {
        id: "notif-filters",
        element: anchor("notifications-filters"),
        title: "Notifications: Filters",
        description: "Show only unread ones, or one topic such as drawings, finance or meetings.",
      },
      {
        id: "notif-row",
        element: anchor("notification-row"),
        title: "Notifications: Open One",
        description: "Click a notification to open what it's about. It's marked as read.",
        side: "top",
        whenMissing: NO_NOTIFICATION,
      },
      {
        id: "notif-read-all",
        element: anchor("notifications-read-all"),
        title: "Notifications: Mark All as Read",
        description: "Clears every unread notification at once.",
        side: "left",
        whenMissing: "Appears at the top while you have unread notifications.",
      },
    ]),

    // ── Communication ───────────────────────────────────────────────────
    ...onPage({ route: "/communication" }, [
      {
        id: "chat-input",
        element: anchor("chat-input"),
        title: "Communication: Write a Message",
        description: "Type your message and press <b>Send</b>.",
        side: "top",
      },
    ]),

    // ── Profile ─────────────────────────────────────────────────────────
    {
      id: "profile-info",
      route: "/profile",
      element: anchor("profile-info"),
      title: "Profile: Your Details",
      description: "Keep your name, email, phone, company and address up to date, then press <b>Save Changes</b>.",
      via: {
        fromRoute: "/communication",
        panels: [userMenu],
        openAnyway: true,
        ...click(anchor("user-menu-profile"), "Open My Profile", "Click <b>My profile</b> in your menu."),
      },
    },
    ...onPage({ route: "/profile" }, [
      {
        id: "overview-end",
        element: anchor("tour-hub-btn"),
        title: "That's the Panel",
        description: "Open this menu any time to replay the walkthrough or take one of the detailed guides.",
        speechText: "That's the whole panel. Open this menu any time to replay the walkthrough or take a detailed guide.",
      },
    ]),
  ],
};
