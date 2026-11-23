import type { TourDefinition } from "../tour.types";
import {
  acknowledgeModal,
  calendarModal,
  callbackModal,
  contactCompanyModal,
  contactDriverModal,
  deliveryDocumentsModal,
  emailModal,
  equipmentModal,
  instructionsModal,
  scheduleTab,
  siteReadyModal,
} from "./panels";
import { anchor, click, onPage } from "./tour-helpers";

const SCHEDULE = "/project-delivery-schedule/:scheduleProjectId";

const NO_DELIVERY = "You'll see this once a delivery is scheduled for you.";
const NOT_READY = "Shown on an upcoming delivery that hasn't been confirmed yet.";
const TABS = anchor("schedule-tabs");

const upcoming = scheduleTab("upcoming", "Upcoming Deliveries");
const past = scheduleTab("past", "Past Deliveries");
const rescheduled = scheduleTab("rescheduled", "Rescheduled Deliveries");

/** Preparing for a delivery, and what changes once it's on its way or done. */
export const deliveryGuideTour: TourDefinition = {
  id: "delivery-guide",
  name: "Delivery Guide",
  description: "Get your site ready, follow a delivery and handle reschedules.",
  estimatedMinutes: 5,
  steps: [
    {
      id: "dg-project",
      route: "/delivery-schedule",
      element: anchor("schedule-project"),
      title: "1 · Pick a Project",
      description: "Each project shows its upcoming, past and rescheduled deliveries.",
      speechText: "Each project shows its upcoming, past and rescheduled deliveries.",
      whenMissing: "You'll see this once you have a project.",
    },
    {
      id: "dg-tabs",
      route: SCHEDULE,
      element: TABS,
      title: "1 · The Project's Deliveries",
      description: "Switch between upcoming, past and rescheduled deliveries.",
      via: {
        fromRoute: "/delivery-schedule",
        ...click(anchor("schedule-project-view"), "View a Project", "Click <b>View</b> to see the project's deliveries."),
      },
      whenMissing: "You'll see this once you have a project.",
    },
    {
      id: "dg-filter",
      route: SCHEDULE,
      element: anchor("schedule-status-filter"),
      title: "1 · Filter",
      description: "Show only today's deliveries, or upcoming or past ones.",
      side: "left",
      whenMissing: "You'll see this once you have a project.",
    },

    // ── Before delivery ─────────────────────────────────────────────────
    ...onPage({ route: SCHEDULE, panels: [upcoming], whenMissing: NO_DELIVERY, fallback: TABS }, [
      {
        id: "dg-card",
        element: anchor("delivery-card"),
        title: "2 · An Upcoming Delivery",
        description: "The date, time window, driver, weight, equipment and load details.",
        side: "top",
      },
      {
        id: "dg-readiness",
        element: anchor("delivery-readiness"),
        title: "2 · Before It Arrives",
        description: "Shows whether your site and equipment are confirmed. Both should be before the truck comes.",
        side: "top",
        whenMissing: "Shown on an upcoming delivery that isn't on its way yet.",
      },
      {
        id: "dg-site-ready",
        element: anchor("site-ready-modal"),
        panels: [upcoming, siteReadyModal],
        title: "2 · Confirm Site Ready",
        description: "Go through the checklist, then press <b>Confirm Site Ready</b>. The button disappears once it's confirmed.",
        whenMissing: NOT_READY,
      },
      {
        id: "dg-equipment",
        element: anchor("equipment-modal"),
        panels: [upcoming, equipmentModal],
        title: "2 · Confirm Equipment",
        description: "Tick the equipment you have on site, then press <b>Confirm Equipment</b>.",
        whenMissing: NOT_READY,
      },
      {
        id: "dg-driver",
        element: anchor("contact-modal"),
        panels: [upcoming, contactDriverModal],
        title: "3 · Contact Driver",
        description: "The driver's details, with buttons to call.",
      },
      {
        id: "dg-company",
        element: anchor("contact-modal"),
        panels: [upcoming, contactCompanyModal],
        title: "3 · Delivery Company",
        description: "How to reach the company making the delivery.",
      },
      {
        id: "dg-email",
        element: anchor("email-modal"),
        panels: [upcoming, emailModal],
        title: "3 · Email Confirmation",
        description: "Sends you the delivery's details by email. After it's sent, the button reads <b>Confirmation Email Sent</b>.",
        whenMissing: "Available until the confirmation email is sent.",
      },
      {
        id: "dg-calendar",
        element: anchor("calendar-modal"),
        panels: [upcoming, calendarModal],
        title: "3 · Add to Calendar",
        description: "Adds the delivery to your calendar, or copies its details.",
      },
      {
        id: "dg-instructions",
        element: anchor("instructions-modal"),
        panels: [upcoming, instructionsModal],
        title: "3 · Full Instructions",
        description: "Everything the site needs to know, including the packing list summary.",
      },
      {
        id: "dg-callback",
        element: anchor("callback-modal"),
        panels: [upcoming, callbackModal],
        title: "3 · Request Call Back",
        description: "Say why and how urgent it is, and our team calls you.",
      },
      {
        id: "dg-documents",
        element: anchor("documents-modal"),
        panels: [upcoming, deliveryDocumentsModal],
        title: "3 · Download Info",
        description: "Download the delivery details, packing list and instructions, one by one or all together.",
      },
    ]),

    // ── Rescheduled ─────────────────────────────────────────────────────
    ...onPage(
      {
        route: SCHEDULE,
        panels: [rescheduled],
        whenMissing: "Shown while a rescheduled delivery is waiting for you.",
        fallback: TABS,
      },
      [
        {
          id: "dg-rescheduled",
          element: anchor("delivery-rescheduled"),
          title: "4 · If It's Rescheduled",
          description: "You'll see the previous date, the new one and the reason.",
        },
        {
          id: "dg-acknowledge",
          element: anchor("acknowledge-modal"),
          panels: [rescheduled, acknowledgeModal],
          title: "4 · Acknowledge",
          description: "Confirm that you know the new date. The notice disappears once you do.",
        },
      ],
    ),

    // ── After delivery ──────────────────────────────────────────────────
    {
      id: "dg-past",
      route: SCHEDULE,
      element: anchor("delivery-card"),
      panels: [past],
      title: "5 · After Delivery",
      description: "Past deliveries keep their details, without the action buttons.",
      side: "top",
      whenMissing: "Shown once a delivery is completed.",
      fallback: TABS,
    },
  ],
};
