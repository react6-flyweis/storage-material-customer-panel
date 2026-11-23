import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  width?: string;
  height?: string;
  showHeader?: boolean;
  showCloseButton?: boolean;
  customPadding?: string;
  className?: string;
  /** Lets the product tour find this modal. */
  tourId?: string;
  /** Status of the record shown, so the tour can tell modals apart. */
  tourStatus?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  width = "sm:max-w-2xl",
  height = "max-h-[90vh]",
  showHeader = true,
  showCloseButton = false,
  customPadding = "p-6",
  className,
  tourId,
  tourStatus,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        data-tour={tourId}
        data-tour-status={tourStatus}
        showCloseButton={showCloseButton}
        className={cn(
          "bg-white rounded-xl shadow-2xl w-full p-0 gap-0 overflow-hidden flex flex-col",
          width,
          height,
          className,
        )}
      >
        {showHeader && title ? (
          <DialogHeader className="flex flex-col gap-1.5 p-6 border-b border-[#D5D5D5] text-left">
            <DialogTitle className="md:text-base text-sm font-bold text-gray-800">
              {title}
            </DialogTitle>
            {description ? (
              <DialogDescription className="text-sm text-gray-500">
                {description}
              </DialogDescription>
            ) : (
              <DialogDescription className="sr-only">{title}</DialogDescription>
            )}
          </DialogHeader>
        ) : (
          <>
            <DialogTitle className="sr-only">{title || "Dialog"}</DialogTitle>
            {description && (
              <DialogDescription className="sr-only">
                {description}
              </DialogDescription>
            )}
          </>
        )}

        <div className={cn("overflow-y-auto flex-1", customPadding)}>
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
