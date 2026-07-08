import type { RouteObject } from "react-router-dom";
import { lazy } from "react";
import { NotFound } from "@/pages/not-found";
import { MainLayout } from "./components/layout/main-layout";
import NotificationsView from "./components/notifications/NotificationsView";
import DeliverySchedule from "./components/delivery-schedule/DeliverySchedule";
import SettingsView from "./components/settings/SettingsView";
import ProfileView from "./components/profile/ProfileView";
import InvoicePreview from "./pages/InvoicePreview";
import ScannedPage from "./components/delivery-schedule/ScannedPage";
import ProjectDrawingPage from "./pages/ProjectDrawingPage";
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const MyProjectsPage = lazy(() => import("@/pages/MyProjectsPage"));
const ProjectDetailsPage = lazy(() => import("@/pages/ProjectDetailsPage"));
const ProjectDrawingsPage = lazy(
  () => import("@/pages/drawings_and_documents/ProjectDrawingsPage")
);
const ProjectDocumentsPage = lazy(
  () => import("@/pages/drawings_and_documents/ProjectDocumentsPage")
);
const Communication = lazy(
  () => import("./components/communication/CommunicationView")
);
const PaymentsPage = lazy(
  () => import("@/pages/payments_and_invoices/PaymentsPage")
);
const InvoicesPage = lazy(
  () => import("@/pages/payments_and_invoices/InvoicesPage")
);
const TaxReportsPage = lazy(
  () => import("@/pages/payments_and_invoices/TaxReportsPage")
);
const DocumentPreviewPage = lazy(
  () => import("@/pages/drawings_and_documents/DocumentPreviewPage")
);

export const adminRoutes: RouteObject[] = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      { path: "/my_projects", element: <MyProjectsPage /> },
      { path: "/my_projects/:id", element: <ProjectDetailsPage /> },
      { path: "/project-drawings/:id", element: <ProjectDrawingPage /> },
      { path: "/drawings", element: <ProjectDrawingsPage /> },
      { path: "/documents", element: <ProjectDocumentsPage /> },
      { path: "/payments", element: <PaymentsPage /> },
      { path: "/invoices", element: <InvoicesPage /> },
      { path: "/tax_reports", element: <TaxReportsPage /> },
      {
        path: "/invoice_preview",
        element: <InvoicePreview />,
      },
      {
        path: "/document_preview",
        element: <DocumentPreviewPage />,
      },

      { path: "/notification", element: <NotificationsView /> },
      { path: "/delivery-schedule", element: <DeliverySchedule /> },
      { path: "/scanned-page", element: <ScannedPage /> },
      {
        path: "settings",
        element: <SettingsView />,
      },
      {
        path: "profile",
        element: <ProfileView />,
      },
      { path: "/communication", element: <Communication /> },
      { path: "*", element: <NotFound /> },
    ],
  },
  { path: "*", element: <NotFound /> },
];
