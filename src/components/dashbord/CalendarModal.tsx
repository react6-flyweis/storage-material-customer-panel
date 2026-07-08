import {
  CalendarDays,
  Clock3,
  MapPin,
  Copy,
  X,
} from "lucide-react";

interface CalendarModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CalendarModal({
  open,
  onClose,
}: CalendarModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-[520px] rounded-lg bg-white p-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F97316]">
              <CalendarDays className="h-6 w-6 text-white" />
            </div>

            <h2 className="text-[24px] font-bold text-[#101828]">
              Add to Calendar
            </h2>
          </div>

          <button onClick={onClose}>
            <X className="h-6 w-6 text-slate-400" />
          </button>
        </div>

        <div className="mt-8 rounded-xl border-2 border-[#F7C48A] bg-[#FFF8F1] p-5">
          <h3 className="text-base font-bold text-[#101828]">
            Primary Frame Steel
          </h3>

          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-3 text-sm text-[#101828]">
              <CalendarDays
                size={18}
                className="text-[#F97316]"
              />
              Wednesday, March 25, 2026
            </div>

            <div className="flex items-center gap-3 text-sm text-[#101828]">
              <Clock3 size={18} className="text-[#F97316]" />
              08:00 - 12:00
            </div>

            <div className="flex items-center gap-3 text-sm text-[#101828]">
              <MapPin size={18} className="text-[#F97316]" />
              ABC Logistics Warehouse
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-xl bg-[#F8FAFC] p-5">
          <p className="text-sm font-semibold text-[#344054]">
            Event Description:
          </p>

          <p className="mt-3 text-sm text-[#101828]">
            Main structural steel beams for warehouse frame
          </p>

          <div className="my-4 border-t" />

          <div className="space-y-1 text-sm text-[#4A5565]">
            <p>Driver: John Driver</p>
            <p>Phone: (555) 999-8888</p>
            <p>Delivery Company: FastFreight Logistics</p>
            <p>Delivery ID: DEL-1001</p>
          </div>
        </div>

        <div className="mt-6">
          <h4 className="mb-4 text-base font-semibold text-[#101828]">
            Select Calendar Type:
          </h4>

          <div className="space-y-3">
            <button className="flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm font-medium text-[#101828]">
              <Copy size={18} />
              Copy event details to (Apple Calendar,
              Outlook, etc.)
            </button>

            <button className="flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm font-medium text-[#101828]">
              <Copy size={18} />
              Copy event details to clipboard
            </button>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-10 w-full rounded-lg border py-3 text-sm font-medium text-[#101828]"
        >
          Close
        </button>
      </div>
    </div>
  );
}