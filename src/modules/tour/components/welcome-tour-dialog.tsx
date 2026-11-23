import { useEffect, useState } from "react";
import { Compass, Sparkles, Volume2, VolumeX } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { tourCoordinator } from "../tour.service";
import { useTourStore } from "../tour.store";
import { customerOverviewTour } from "../tours/customer-overview.tour";

export function WelcomeTourDialog() {
  const navigate = useNavigate();
  const { hasSeenWelcomeModal, setHasSeenWelcomeModal, isAudioMuted, toggleAudioMute } =
    useTourStore();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (hasSeenWelcomeModal || window.innerWidth < 1024) return;
    const timer = window.setTimeout(() => setIsOpen(true), 1200);
    return () => window.clearTimeout(timer);
  }, [hasSeenWelcomeModal]);

  const handleClose = () => {
    setIsOpen(false);
    setHasSeenWelcomeModal(true);
  };

  const handleStart = () => {
    handleClose();
    tourCoordinator.init(navigate);
    void tourCoordinator.startTour(customerOverviewTour);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md text-center rounded-2xl bg-white">
        <DialogHeader className="items-center text-center space-y-2">
          <div className="mx-auto size-12 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[#1D51A4] mb-1">
            <Compass className="size-6 animate-pulse" />
          </div>
          <DialogTitle className="text-xl font-bold text-slate-900 flex items-center justify-center gap-2">
            Welcome to the Customer Panel <Sparkles className="size-4 text-amber-500" />
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-600 text-center">
            Would you like a {customerOverviewTour.estimatedMinutes}-minute guided tour of your
            projects, drawings, payments, deliveries and messages?
          </DialogDescription>
        </DialogHeader>

        <button
          onClick={toggleAudioMute}
          type="button"
          className="mx-auto flex items-center gap-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 px-3 py-1.5 rounded-full transition-colors cursor-pointer"
        >
          {isAudioMuted ? (
            <VolumeX className="size-4 text-red-500" />
          ) : (
            <Volume2 className="size-4 text-blue-600" />
          )}
          {isAudioMuted ? "Voice Guidance: Muted" : "Voice Guidance: Enabled"}
        </button>

        <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-center pt-2">
          <Button onClick={handleStart} className="bg-[#1D51A4] hover:bg-[#163f82] text-white">
            Start Tour ({customerOverviewTour.estimatedMinutes} min)
          </Button>
          <Button
            variant="outline"
            onClick={handleClose}
            className="text-slate-600 border-slate-300"
          >
            Explore on My Own
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
