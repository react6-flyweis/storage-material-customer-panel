import {
  AlertCircle,
  CalendarDays,
  X,
} from "lucide-react";
import { useAcknowledgeRescheduleMutation } from "@/redux/api/deliveriesApi";
import type { DeliveryCardData } from "./NextDeliveryCard";

interface AcknowledgeRescheduleModalProps {
  open: boolean;
  onClose: () => void;
  onAcknowledge?: () => void;
  deliveryData?: DeliveryCardData;
}

export default function AcknowledgeRescheduleModal({
  open,
  onClose,
  onAcknowledge,
  deliveryData,
}: AcknowledgeRescheduleModalProps) {
  const [acknowledgeReschedule, { isLoading }] = useAcknowledgeRescheduleMutation();

  if (!open) return null;

  const handleAcknowledge = async () => {
    try {
      if (deliveryData?.deliveryId) {
        await acknowledgeReschedule(deliveryData.deliveryId).unwrap();
      }
      onAcknowledge?.();
      onClose();
    } catch (error) {
      console.error("Failed to acknowledge reschedule:", error);
    }
  };

  const title = deliveryData?.title || "-";
  const deliveryId = deliveryData?.deliveryId || "-";
  const prevDate = deliveryData?.rescheduleInfo?.previousDate || "-";
  const newDate = deliveryData?.rescheduleInfo?.newDate || deliveryData?.deliveryInfo?.date || "-";
  const reason = deliveryData?.rescheduleInfo?.reason || "-";
  const timeWindow = deliveryData?.deliveryInfo?.timeWindow || "-";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-[512px] max-h-[90vh] overflow-auto rounded-lg bg-white p-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-[48px] w-[48px] items-center justify-center rounded-full bg-[#FF6B00]">
              <CalendarDays className="h-5 w-5 text-white" />
            </div>

            <h2 className="text-[20px] font-bold text-[#101828]">
              Acknowledge Reschedule
            </h2>
          </div>

          <button onClick={onClose}>
            <X className="h-6 w-6 text-[#98A2B3]" />
          </button>
        </div>

        {/* Pending */}
        <div className="mt-6 flex items-center gap-2">
          <span className="text-[16px] font-semibold text-[#101828]">
            Pending acknowledgment
          </span>

          <AlertCircle
            size={18}
            className="text-[#FF3B30]"
          />
        </div>

        {/* Delivery Card */}
        <div className="mt-2 rounded-lg border-2 border-[#F8C98C] bg-[#FFF8F1] p-3">
          <p className="text-[16px] text-[#C2410C]">
            Delivery
          </p>

          <h3 className="mt-2 text-[16px] font-bold text-[#101828]">
            {title}
          </h3>

          <p className="mt-2 text-[16px] text-[#1D4ED8]">
            {deliveryId}
          </p>
        </div>

        {/* Details */}
        <div className="mt-3 rounded-lg border-2 border-[#BFDBFE] bg-[#EFF6FF] p-3">
          <h3 className="text-[16px] font-bold text-[#101828]">
            Reschedule Details:
          </h3>

          <p className="mt-2 text-[14px] text-[#1E40AF]">
            Delivery date moved from {prevDate} to {newDate}
            {reason !== "-" ? ` due to ${reason}` : ""}
          </p>
        </div>

        {/* Date & Time */}
        <div className="mt-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[16px] text-[#667085]">
              New Delivery Date:
            </span>

            <span className="text-[16px] font-bold text-[#101828]">
              {newDate}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[16px] text-[#667085]">
              Time Window:
            </span>

            <span className="text-[16px] font-bold text-[#101828]">
              {timeWindow}
            </span>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-5 rounded-lg border-2 border-[#F8C98C] bg-[#FFFBEA] p-3">
          <p className="text-[14px] text-[#C2410C]">
            By acknowledging this reschedule, you confirm
            that you are aware of the new delivery date
            and will be prepared accordingly.
          </p>
        </div>

        {/* Footer Buttons */}
        <div className="mt-5 grid grid-cols-2 gap-4">
          <button
            onClick={onClose}
            className="h-[52px] rounded-lg border border-[#D0D5DD] text-[16px] font-medium text-[#101828]"
          >
            Cancel
          </button>

          <button
            onClick={handleAcknowledge}
            disabled={isLoading}
            className="h-[52px] rounded-lg bg-[#FF6B00] text-[16px] font-medium text-white hover:bg-[#EA580C] disabled:opacity-50 transition-opacity"
          >
            {isLoading ? "Acknowledging..." : "Acknowledge"}
          </button>
        </div>
      </div>
    </div>
  );
}