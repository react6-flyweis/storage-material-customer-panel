import {
  CreditCard,
  FileCheck,
  FolderOpen,
  HelpCircle,
  PlayCircle,
  RotateCcw,
  Truck,
  Volume2,
  VolumeX,
  type LucideIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { notify } from "../tour.adapter";
import { tourCoordinator } from "../tour.service";
import { useTourStore } from "../tour.store";
import type { TourDefinition } from "../tour.types";
import { customerOverviewTour } from "../tours/customer-overview.tour";
import { deliveryGuideTour } from "../tours/delivery-guide.tour";
import { drawingApprovalTour } from "../tours/drawing-approval.tour";
import { paymentsGuideTour } from "../tours/payments-guide.tour";
import { projectJourneyTour } from "../tours/project-journey.tour";

interface TourMenuEntry {
  tour: TourDefinition;
  label: string;
  hint: string;
  icon: LucideIcon;
  iconClassName: string;
}

const TOUR_MENU: TourMenuEntry[] = [
  {
    tour: customerOverviewTour,
    label: "Start Walkthrough",
    hint: "Every page and what you can do on it",
    icon: PlayCircle,
    iconClassName: "text-[#1D51A4]",
  },
  {
    tour: projectJourneyTour,
    label: "Project Journey Guide",
    hint: "From quotation to payment and tracking",
    icon: FolderOpen,
    iconClassName: "text-[#A855F7]",
  },
  {
    tour: drawingApprovalTour,
    label: "Drawing Approval Guide",
    hint: "Review, approve or ask for a revision",
    icon: FileCheck,
    iconClassName: "text-[#3AB449]",
  },
  {
    tour: paymentsGuideTour,
    label: "Payments Guide",
    hint: "Submit proof and follow its review",
    icon: CreditCard,
    iconClassName: "text-slate-800",
  },
  {
    tour: deliveryGuideTour,
    label: "Delivery Guide",
    hint: "Get your site ready and follow deliveries",
    icon: Truck,
    iconClassName: "text-[#2B7FFF]",
  },
];

export function TourHubMenu() {
  const navigate = useNavigate();
  const { isAudioMuted, toggleAudioMute, resetAllTours, setHasSeenWelcomeModal } = useTourStore();

  const handleLaunch = (tour: TourDefinition) => {
    tourCoordinator.init(navigate);
    // Let the menu close first, so it isn't what the tour starts on.
    window.setTimeout(() => void tourCoordinator.startTour(tour), 250);
  };

  const handleToggleMute = () => {
    toggleAudioMute();
    notify(isAudioMuted ? "Voice guidance enabled" : "Voice guidance muted");
  };

  const handleReset = () => {
    resetAllTours();
    // Forget the progress without popping up the welcome dialog right away.
    setHasSeenWelcomeModal(true);
    notify("Walkthrough history reset");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          data-tour="tour-hub-btn"
          className="rounded-full hover:bg-slate-100"
          title="Product Walkthrough"
          aria-label="Product walkthrough"
        >
          <HelpCircle className="size-5 text-gray-700" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-72 bg-white shadow-lg border border-slate-200 p-2"
      >
        <div className="flex items-center justify-between px-2 py-1">
          <span className="text-xs font-semibold uppercase text-slate-500 tracking-wider">
            Product Walkthrough
          </span>
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleToggleMute}
              className="size-7 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100"
              title={isAudioMuted ? "Unmute voice guidance" : "Mute voice guidance"}
            >
              {isAudioMuted ? (
                <VolumeX className="size-4 text-red-500" />
              ) : (
                <Volume2 className="size-4 text-blue-600" />
              )}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleReset}
              className="size-7 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              title="Reset walkthrough history"
            >
              <RotateCcw className="size-3.5" />
            </Button>
          </div>
        </div>

        <DropdownMenuSeparator />

        {TOUR_MENU.map(({ tour, label, hint, icon: Icon, iconClassName }) => (
          <DropdownMenuItem
            key={tour.id}
            onClick={() => handleLaunch(tour)}
            className="flex items-center gap-2.5 cursor-pointer py-2 text-sm text-slate-700"
          >
            <Icon className={`size-4 shrink-0 ${iconClassName}`} />
            <div>
              <div className="font-medium">
                {label}{" "}
                <span className="text-xs text-slate-400">· {tour.estimatedMinutes} min</span>
              </div>
              <div className="text-xs text-slate-500">{hint}</div>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
