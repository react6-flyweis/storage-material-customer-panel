import React from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface ProjectRequestSuccessModalProps {
  open: boolean;
  onClose: () => void;
}

export const ProjectRequestSuccessModal: React.FC<ProjectRequestSuccessModalProps> = ({
  open,
  onClose,
}) => {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent showCloseButton={false} className="max-w-md rounded-3xl p-8 text-center sm:max-w-md">
        <div className="flex flex-col items-center justify-center space-y-4">
          {/* Green Checkmark Badge */}
          <div className="w-20 h-20 rounded-full bg-linear-to-b from-[#4ADE80] to-[#22C55E] flex items-center justify-center shadow-lg shadow-green-200">
            <Check className="w-10 h-10 text-white stroke-3" />
          </div>

          <DialogHeader className="space-y-3 text-center sm:text-center">
            <DialogTitle className="text-2xl font-bold text-[#1E293B]">
              Project Request Submitted
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-500 leading-relaxed px-2">
              Our team will review your requirements and assign a sales specialist to your project. You can track the project request from your Projects section.
            </DialogDescription>
          </DialogHeader>

          <div className="pt-4 w-full flex justify-center">
            <Button
              onClick={onClose}
              className="w-32 bg-[#1D51A4] hover:bg-[#163e80] text-white font-semibold py-2.5 rounded-lg text-sm shadow-sm transition-colors cursor-pointer"
            >
              OK
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectRequestSuccessModal;
