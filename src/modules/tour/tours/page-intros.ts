import type { TourPageIntro } from "../tour.types";

/**
 * Shown over the whole page the first time a tour reaches it, before the tour
 * goes through its sections. Keyed by step route, without the query string.
 */
export const PAGE_INTROS: Partial<Record<string, TourPageIntro>> = {
  "/dashboard": {
    title: "Your Dashboard",
    description: "Everything about your projects on one page: progress, drawings, payments, messages and deliveries. Next, we'll go through each section.",
  },
  "/my_projects": {
    title: "My Projects",
    description: "All of your projects, with totals on top and the list below.",
  },
  "/my_projects/:projectId": {
    title: "Your Project",
    description: "Everything about one project, organized in tabs. Next, we'll go through each one.",
  },
  "/add-new-project": {
    title: "Create a Project",
    description: "Fill in this form to request a project: its details, specifications and any notes. Fields with * are required.",
  },
  "/drawings": {
    title: "Drawings",
    description: "Your projects' drawings, one card per project.",
  },
  "/project-buildings/:drawingsProjectId": {
    title: "Project Buildings",
    description: "The project's buildings, with the drawings of each one.",
  },
  "/project-building-drawings/:drawingsBuildingProjectId": {
    title: "Building Drawings",
    description: "Every drawing of one building, with its approval status and actions.",
  },
  "/project-drawings/:projectId": {
    title: "Project Drawings",
    description: "All drawings and building photos of one project.",
  },
  "/project-images/:projectId": {
    title: "Project Images",
    description: "Photos and videos the site team has shared.",
  },
  "/payments": {
    title: "Payments",
    description: "What you've paid, what's coming up and what's overdue, all on one page.",
  },
  "/invoices": {
    title: "Invoices",
    description: "All of your invoices, paid and unpaid, with filters on top.",
  },
  "/invoice_preview": {
    title: "Invoice",
    description: "One invoice in full, with the actions you can take on it.",
  },
  "/delivery-schedule": {
    title: "Delivery Schedule",
    description: "Your projects and their deliveries, one card per project.",
  },
  "/project-delivery-schedule/:scheduleProjectId": {
    title: "Project Deliveries",
    description: "Every delivery of one project: upcoming, past and rescheduled.",
  },
  "/notification": {
    title: "Notifications",
    description: "Every update sent to you, with totals, filters and the full list.",
  },
  "/communication": {
    title: "Communication",
    description: "Your direct line to the support team: your conversations and search on the left, messages on the right.",
  },
  "/profile": {
    title: "Your Profile",
    description: "Your details, profile picture and password, all on one page.",
  },
};
