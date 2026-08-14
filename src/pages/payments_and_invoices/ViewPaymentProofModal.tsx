import React from "react";
import {
  FileText,
  DollarSign,
  Hash,
  Calendar,
  Building2,
  ExternalLink,
  Download,
  Clock,
  CheckCircle2,
  XCircle,
  FileCheck,
} from "lucide-react";
import Modal from "@/components/common_components/Modal";
import { Button } from "@/components/ui/button";
import type { PaymentItemDetail } from "@/redux/api/paymentsApi";

interface ViewPaymentProofModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: PaymentItemDetail | null;
  projectName?: string;
}

const formatDate = (dateString?: string | null) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "-";
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const day = date.getUTCDate();
  const month = months[date.getUTCMonth()];
  const year = date.getUTCFullYear();
  return `${day}-${month}-${year}`;
};

const formatCurrency = (val?: number | null) => {
  if (val === undefined || val === null) return "-";
  return `$${val.toLocaleString()}`;
};

const ViewPaymentProofModal: React.FC<ViewPaymentProofModalProps> = ({
  isOpen,
  onClose,
  item,
  projectName,
}) => {
  if (!item) return null;

  const proof = item.paymentProof;
  const status = proof?.status?.toLowerCase() || item.status?.toLowerCase() || "pending_review";

  const getStatusBadge = () => {
    switch (status) {
      case "approved":
      case "paid":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Approved
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            Rejected
          </span>
        );
      case "pending_review":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            Pending Review
          </span>
        );
    }
  };

  const files = proof?.files || [];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Payment Proof Details"
      description="View uploaded transaction details and receipt attachments."
      width="sm:max-w-xl"
      showCloseButton={true}
    >
      <div className="space-y-6">
        {/* Status Header Banner */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white rounded-lg border border-gray-200 shadow-xs">
              <FileCheck className="w-5 h-5 text-(--button-bg-primary-color)" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Payment Status</p>
              <p className="text-sm font-semibold text-gray-900">
                {item.invoiceNumber || "Invoice"}
              </p>
            </div>
          </div>
          <div>{getStatusBadge()}</div>
        </div>

        {/* Payment Summary Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="p-3.5 bg-gray-50/70 rounded-lg border border-gray-100 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
              <Hash className="w-3.5 h-3.5 text-gray-400" />
              Transaction ID
            </div>
            <p className="text-sm font-semibold text-gray-800 break-all">
              {proof?.transactionId || "-"}
            </p>
          </div>

          <div className="p-3.5 bg-gray-50/70 rounded-lg border border-gray-100 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
              <DollarSign className="w-3.5 h-3.5 text-gray-400" />
              Amount Paid
            </div>
            <p className="text-sm font-bold text-gray-900">
              {formatCurrency(proof?.amount ?? item.totalAmount)}
            </p>
          </div>

          <div className="p-3.5 bg-gray-50/70 rounded-lg border border-gray-100 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              Payment Date
            </div>
            <p className="text-sm font-medium text-gray-800">
              {formatDate(proof?.paymentDate || item.paidAt)}
            </p>
          </div>

          <div className="p-3.5 bg-gray-50/70 rounded-lg border border-gray-100 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
              <Building2 className="w-3.5 h-3.5 text-gray-400" />
              Project Name
            </div>
            <p className="text-sm font-medium text-gray-800 truncate">
              {projectName || "-"}
            </p>
          </div>
        </div>

        {/* Notes if any */}
        {proof?.notes && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-gray-600">Customer Notes</p>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-xs text-gray-700 whitespace-pre-wrap">
              {proof.notes}
            </div>
          </div>
        )}

        {/* Review Notes if any */}
        {proof?.reviewNotes && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-gray-600">Review Notes</p>
            <div className="p-3 bg-amber-50/60 rounded-lg border border-amber-200/80 text-xs text-amber-900 whitespace-pre-wrap">
              {proof.reviewNotes}
            </div>
          </div>
        )}

        {/* Uploaded Files Section */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-600">
            Attached Receipts / Proofs ({files.length})
          </p>

          {files.length === 0 ? (
            <div className="p-4 text-center rounded-lg border border-dashed border-gray-200 text-xs text-gray-400">
              No files attached.
            </div>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {files.map((file, idx) => {
                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 bg-gray-50 hover:bg-gray-100/80 rounded-lg border border-gray-200 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <div className="p-1.5 bg-white rounded border border-gray-200 shrink-0">
                        <FileText className="w-4 h-4 text-gray-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-gray-800 truncate">
                          {file.name || `Attachment ${idx + 1}`}
                        </p>
                      </div>
                    </div>

                    {file.url ? (
                      <div className="flex items-center gap-1.5 shrink-0">
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-gray-600 hover:text-(--button-bg-primary-color) hover:bg-white rounded transition-colors"
                          title="Open link"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        <a
                          href={file.url}
                          download={file.name || "payment-proof"}
                          className="p-1.5 text-gray-600 hover:text-(--button-bg-primary-color) hover:bg-white rounded transition-colors"
                          title="Download"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    ) : (
                      <span className="text-[10px] text-gray-400 italic">No URL</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-gray-100 flex justify-end">
          <Button
            type="button"
            onClick={onClose}
            className="bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs px-5 py-2 rounded-md font-medium cursor-pointer"
          >
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ViewPaymentProofModal;
