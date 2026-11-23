import type { TourDefinition, TourId } from "../tour.types";
import { customerOverviewTour } from "./customer-overview.tour";
import { deliveryGuideTour } from "./delivery-guide.tour";
import { drawingApprovalTour } from "./drawing-approval.tour";
import { paymentsGuideTour } from "./payments-guide.tour";
import { projectJourneyTour } from "./project-journey.tour";

export const TOURS_REGISTRY: Record<TourId, TourDefinition> = {
  "customer-overview": customerOverviewTour,
  "project-journey": projectJourneyTour,
  "drawing-approval": drawingApprovalTour,
  "payments-guide": paymentsGuideTour,
  "delivery-guide": deliveryGuideTour,
};
