import { useState } from "react";
import { MessageSquare, X } from "lucide-react";
import { useContactBundleSupportMutation } from "@/redux/api/deliveriesApi";

interface BundleContactSupportModalProps {
  open: boolean;
  onClose: () => void;
  bundleId: string;
  onSuccess: (title: string) => void;
}

export default function BundleContactSupportModal({
  open,
  onClose,
  bundleId,
  onSuccess,
}: BundleContactSupportModalProps) {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [contactSupport, { isLoading }] = useContactBundleSupportMutation();

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bundleId || !message.trim()) return;
    setError("");

    try {
      await contactSupport({
        bundleId,
        message: message.trim(),
      }).unwrap();
      setMessage("");
      onClose();
      onSuccess("Support Request Sent");
    } catch (err: unknown) {
      console.error("Failed to contact support:", err);
      const errData = err as { data?: { message?: string }; message?: string } | undefined;
      setError(errData?.data?.message || errData?.message || "Failed to contact support. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-(--button-bg-primary-color)">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>

            <h2 className="text-[24px] font-bold text-[#101828]">
              Contact Support
            </h2>
          </div>

          <button onClick={onClose}>
            <X className="h-6 w-6 text-slate-400" />
          </button>
        </div>

        <div className="mt-6 rounded-xl border-2 border-[#BEDBFF] bg-[#EFF6FF] p-4">
          <p className="text-xs font-semibold text-[#193CB8]">Bundle</p>
          <p className="mt-1 text-base font-bold text-[#101828]">
            Bundle Details — {bundleId}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#101828]">
              Message
            </label>
            <textarea
              rows={4}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your query or request help identifying this bundle..."
              className="w-full resize-none rounded-xl border border-[#D0D5DD] p-3 text-sm outline-none placeholder:text-[#98A2B3] focus:border-[#2563EB]"
            />
          </div>

          {error && (
            <p className="text-sm font-semibold text-red-600">{error}</p>
          )}

          <div className="mt-6 grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#D0D5DD] py-3 text-sm font-medium text-[#101828]"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading || !message.trim()}
              className="flex items-center justify-center gap-2 rounded-lg bg-(--button-bg-primary-color) py-3 text-sm font-medium text-white disabled:opacity-50"
            >
              {isLoading ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
