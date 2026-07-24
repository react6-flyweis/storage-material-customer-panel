import { useState } from "react";
import { AlertCircle, X } from "lucide-react";
import { useReportBundleIssueMutation } from "@/redux/api/deliveriesApi";

interface BundleReportIssueModalProps {
  open: boolean;
  onClose: () => void;
  bundleId: string;
  onSuccess: (title: string) => void;
}

export default function BundleReportIssueModal({
  open,
  onClose,
  bundleId,
  onSuccess,
}: BundleReportIssueModalProps) {
  const [issue, setIssue] = useState("");
  const [error, setError] = useState("");
  const [reportIssue, { isLoading }] = useReportBundleIssueMutation();

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bundleId || !issue.trim()) return;
    setError("");

    try {
      await reportIssue({
        bundleId,
        issue: issue.trim(),
      }).unwrap();
      setIssue("");
      onClose();
      onSuccess("Issue Reported Successfully");
    } catch (err: unknown) {
      console.error("Failed to report issue:", err);
      const errData = err as { data?: { message?: string }; message?: string } | undefined;
      setError(errData?.data?.message || errData?.message || "Failed to report issue. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FD8D5B]">
              <AlertCircle className="h-6 w-6 text-white" />
            </div>

            <h2 className="text-[24px] font-bold text-[#101828]">
              Report Issue
            </h2>
          </div>

          <button onClick={onClose}>
            <X className="h-6 w-6 text-slate-400" />
          </button>
        </div>

        <div className="mt-6 rounded-xl border-2 border-[#FED7AA] bg-[#FFF7ED] p-4">
          <p className="text-xs font-semibold text-[#C2410C]">Bundle</p>
          <p className="mt-1 text-base font-bold text-[#101828]">
            Bundle Details — {bundleId}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#101828]">
              Issue Description
            </label>
            <textarea
              rows={4}
              required
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              placeholder="Please describe the issue (e.g. Received quantity does not match label)..."
              className="w-full resize-none rounded-xl border border-[#D0D5DD] p-3 text-sm outline-none placeholder:text-[#98A2B3] focus:border-[#FD8D5B]"
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
              disabled={isLoading || !issue.trim()}
              className="flex items-center justify-center gap-2 rounded-lg bg-[#FD8D5B] py-3 text-sm font-medium text-white disabled:opacity-50"
            >
              {isLoading ? "Submitting..." : "Report Issue"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
