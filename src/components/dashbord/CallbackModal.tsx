import {
  Mail,
  MessageSquare,
  X,
} from "lucide-react";
import { useState } from "react";
import CustomSelect from "../common_components/CustomSelect";

interface CallbackModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CallbackModal({
  open,
  onClose,
}: CallbackModalProps) {
    const [priority, setPriority] = useState("");
const [reason, setReason] = useState("");
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-[520px] rounded-lg bg-white p-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#3B5FB8]">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>

            <h2 className="text-[24px] font-bold text-[#101828]">
              Request Callback
            </h2>
          </div>

          <button onClick={onClose}>
            <X className="h-6 w-6 text-slate-400" />
          </button>
        </div>

        <div className="mt-8 rounded-xl border-2 border-[#BEDBFF] bg-[#EFF6FF] p-5">
          <p className="text-xs font-semibold text-[#193CB8]">
            Delivery
          </p>

          <p className="mt-1 text-base font-bold text-[#101828]">
            Primary Frame Steel
          </p>

          <p className="mt-2 text-sm text-[#4A5565]">
            DEL - 1001
          </p>

          <p className="mt-2 text-sm font-semibold text-[#155DFC]">
            Status: Scheduled
          </p>
        </div>

        <div className="mt-5">
          <label className="mb-3 block text-base font-semibold text-[#101828]">
            Reason for Callback
          </label>

          <textarea
            rows={4}
            placeholder="Please describe the reason you need a call back (eg: reschedule request, delivery questions)"
            className="w-full resize-none rounded-xl border px-4 py-3 text-sm outline-none placeholder:text-[#98A2B3]"
          />
        </div>

        <div className="mt-4 rounded-xl bg-[#F8FAFC] p-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#DCE8FF]">
              <Mail className="h-6 w-6 text-[#2563EB]" />
            </div>

            <div>
              <p className="text-sm text-[#4A5565]">
                Our team will contact you within 2 business days.
              </p>

              <p className="text-base font-semibold text-[#101828]">
                (555) 123-4567
              </p>

              <p className="text-base font-semibold text-[#101828]">
                austin.mcclume@abclogistics.com
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
  <CustomSelect
    placeholder="Select Priority"
    value={priority}
    onChange={setPriority}
    options={["Urgent", "Normal"]}
  />

  <CustomSelect
    placeholder="Select Reason"
    value={reason}
    onChange={setReason}
    options={[
      "Delivery timing issue",
      "Equipment issue",
      "Reschedule request",
      "General question",
    ]}
  />
</div>

        <p className="mt-4 text-sm text-[#4A5565]">
          We will contact you within 1–2 hours (urgent)
        </p>

        <div className="mt-10 grid grid-cols-2 gap-4">
          <button
            onClick={onClose}
            className="rounded-lg border py-3 text-sm font-medium text-[#101828]"
          >
            Cancel
          </button>

          <button className="flex items-center justify-center gap-2 rounded-lg bg-[#3B5FB8] py-3 text-sm font-medium text-white">
            <MessageSquare size={18} />
            Request Callback
          </button>
        </div>
      </div>
    </div>
  );
}