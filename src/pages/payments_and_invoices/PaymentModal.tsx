import React, { useState, useRef } from "react";
import {
  Upload,
  X,
  FileText,
  DollarSign,
  Hash,
  Calendar,
  Loader2,
  Receipt,
  Trash2,
  AlertCircle,
  Building2,
} from "lucide-react";
import Modal from "@/components/common_components/Modal";
import SuccessModal from "@/components/common_components/SuccessModal";
import {
  useSubmitPaymentProofMutation,
  type PaymentProofFile,
} from "@/redux/api/paymentsApi";
import { uploadFileToS3 } from "@/utils/s3Upload";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceId?: string;
  invoiceNumber?: string;
  amount?: number | string;
  projectName?: string;
  dueDate?: string;
  onSuccess?: () => void;
}

interface UploadedFileItem extends PaymentProofFile {
  size?: number;
  type?: string;
  progress?: number;
  uploading?: boolean;
}

interface PaymentProofFormProps {
  onClose: () => void;
  invoiceId?: string;
  invoiceNumber?: string;
  initialAmount?: number | string;
  projectName?: string;
  dueDate?: string;
  onSuccess: () => void;
}

const PaymentProofForm: React.FC<PaymentProofFormProps> = ({
  onClose,
  invoiceId,
  invoiceNumber,
  initialAmount,
  projectName,
  dueDate,
  onSuccess,
}) => {
  const [transactionId, setTransactionId] = useState("");
  const [paymentDate, setPaymentDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });
  const [amount, setAmount] = useState<string>(() => {
    if (initialAmount !== undefined && initialAmount !== null) {
      return typeof initialAmount === "string"
        ? initialAmount.replace(/[^0-9.]/g, "")
        : String(initialAmount);
    }
    return "";
  });
  const [notes, setNotes] = useState("");
  const [files, setFiles] = useState<UploadedFileItem[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);

  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [submitPaymentProof, { isLoading: isSubmitting }] =
    useSubmitPaymentProofMutation();

  const handleFileUpload = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    setErrorMessage("");

    const selectedFiles = Array.from(fileList);

    for (const file of selectedFiles) {
      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage(`File "${file.name}" exceeds maximum allowed size of 10MB.`);
        return;
      }
    }

    setIsUploading(true);

    try {
      for (const file of selectedFiles) {
        // Add placeholder item with 0 progress
        setFiles((prev) => [
          ...prev,
          {
            name: file.name,
            url: "",
            size: file.size,
            type: file.type,
            progress: 0,
            uploading: true,
          },
        ]);

        try {
          const fileUrl = await uploadFileToS3(file, "customer-uploads", (progress) => {
            setFiles((prev) =>
              prev.map((f) =>
                f.name === file.name && f.uploading ? { ...f, progress } : f
              )
            );
          });

          setFiles((prev) =>
            prev.map((f) =>
              f.name === file.name && f.uploading
                ? { ...f, url: fileUrl, uploading: false, progress: 100 }
                : f
            )
          );
        } catch (uploadErr) {
          console.error("S3 Upload error for file:", file.name, uploadErr);
          // Remove failed upload
          setFiles((prev) => prev.filter((f) => !(f.name === file.name && f.uploading)));
          setErrorMessage(
            uploadErr instanceof Error
              ? uploadErr.message
              : `Failed to upload "${file.name}" to storage.`
          );
        }
      }
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!invoiceId) {
      setErrorMessage("Invoice ID is missing. Please select a valid invoice.");
      return;
    }

    if (!transactionId.trim()) {
      setErrorMessage("Please enter the transaction reference / ID.");
      return;
    }

    if (!paymentDate) {
      setErrorMessage("Please select the payment date.");
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setErrorMessage("Please enter a valid payment amount.");
      return;
    }

    const readyFiles = files.filter((f) => !f.uploading && f.url);
    if (readyFiles.length === 0) {
      setErrorMessage("Please upload at least one payment proof document / receipt.");
      return;
    }

    try {
      const payloadFiles: PaymentProofFile[] = readyFiles.map((f) => ({
        url: f.url,
        name: f.name,
      }));

      await submitPaymentProof({
        invoiceId,
        body: {
          files: payloadFiles,
          transactionId: transactionId.trim(),
          paymentDate,
          amount: parsedAmount,
          notes: notes.trim() || undefined,
        },
      }).unwrap();

      onSuccess();
    } catch (err: unknown) {
      console.error("Failed to submit payment proof:", err);
      const apiErr = err as { data?: { message?: string } };
      setErrorMessage(
        apiErr?.data?.message ||
        "Failed to submit payment proof. Please verify your details and try again."
      );
    }
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="px-6 py-4.5 border-b border-[#EAECF0] flex items-center justify-between bg-white">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#101828]">
              Submit Payment Proof
            </h2>
            <p className="text-xs text-[#667085]">
              Upload transfer receipt and reference for manual verification
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="text-[#98A2B3] hover:text-[#101828] hover:bg-gray-100 transition-colors p-1.5 rounded-lg cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {/* Invoice Info Card */}
        {(invoiceNumber || projectName || initialAmount !== undefined) && (
          <div className="bg-[#F8FAFC] border border-[#EAECF0] rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                  Invoice
                </span>
                <span className="text-sm font-bold text-[#0F172A]">
                  {invoiceNumber || invoiceId || "-"}
                </span>
              </div>
              {projectName && (
                <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>{projectName}</span>
                </div>
              )}
              {dueDate && (
                <div className="text-xs text-[#94A3B8]">
                  Due date: <span className="text-[#475569] font-medium">{dueDate}</span>
                </div>
              )}
            </div>

            {initialAmount !== undefined && (
              <div className="text-right">
                <span className="text-xs text-[#64748B] block">Invoice Total</span>
                <span className="text-xl font-bold text-[#2563EB]">
                  ${Number(initialAmount).toLocaleString()}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Error banner */}
        {errorMessage && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form Fields Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Transaction ID */}
          <div>
            <label className="block text-xs font-semibold text-[#344054] mb-1.5">
              Transaction ID / Ref # <span className="text-rose-500">*</span>
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3 text-[#98A2B3] pointer-events-none">
                <Hash className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="e.g. TXN784923"
                className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-[#D0D5DD] rounded-xl text-sm text-[#101828] placeholder-[#98A2B3] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all"
              />
            </div>
          </div>

          {/* Payment Date */}
          <div>
            <label className="block text-xs font-semibold text-[#344054] mb-1.5">
              Payment Date <span className="text-rose-500">*</span>
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3 text-[#98A2B3] pointer-events-none">
                <Calendar className="w-4 h-4" />
              </div>
              <input
                type="date"
                required
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-[#D0D5DD] rounded-xl text-sm text-[#101828] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all"
              />
            </div>
          </div>

          {/* Amount Paid */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-[#344054] mb-1.5">
              Amount Paid ($) <span className="text-rose-500">*</span>
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3 text-[#98A2B3] pointer-events-none">
                <DollarSign className="w-4 h-4" />
              </div>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="10000"
                className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-[#D0D5DD] rounded-xl text-sm font-semibold text-[#101828] placeholder-[#98A2B3] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-[#344054] mb-1.5">
              Payment Notes / Remarks (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Paid via bank transfer from Chase account"
              className="w-full px-3.5 py-2 bg-white border border-[#D0D5DD] rounded-xl text-sm text-[#101828] placeholder-[#98A2B3] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] resize-none transition-all"
            />
          </div>
        </div>

        {/* Proof of Payment File Upload */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-[#344054]">
              Receipt / Proof Document <span className="text-rose-500">*</span>
            </label>
            <span className="text-xs text-[#98A2B3]">PDF, PNG, JPG up to 10MB</span>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => handleFileUpload(e.target.files)}
            accept=".pdf,image/png,image/jpeg,image/jpg,image/webp"
            className="hidden"
            multiple
          />

          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-colors ${isDragOver
              ? "border-[#2563EB] bg-blue-50/50"
              : "border-[#D0D5DD] hover:border-[#2563EB] bg-[#F8FAFC]"
              }`}
          >
            <div className="mx-auto w-10 h-10 rounded-full bg-blue-100/60 text-[#2563EB] flex items-center justify-center mb-2">
              <Upload className="w-5 h-5" />
            </div>
            <p className="text-xs font-semibold text-[#101828]">
              <span className="text-[#2563EB] hover:underline">Click to upload</span> or drag and drop
            </p>
            <p className="text-[11px] text-[#667085] mt-0.5">
              Bank transfer receipt, wire confirmation, or payment slip
            </p>
          </div>

          {/* Uploaded Files List */}
          {files.length > 0 && (
            <div className="mt-3 space-y-2">
              {files.map((file, idx) => (
                <div
                  key={idx}
                  className="p-2.5 bg-white border border-[#E4E7EC] rounded-xl shadow-2xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <div className="h-8 w-8 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0">
                        {file.uploading ? (
                          <Loader2 className="w-4 h-4 animate-spin text-[#2563EB]" />
                        ) : (
                          <FileText className="w-4 h-4" />
                        )}
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-semibold text-[#101828] truncate">
                          {file.name}
                        </p>
                        <p className="text-[10px] text-[#667085]">
                          {file.uploading
                            ? `Uploading... ${file.progress || 0}%`
                            : file.size
                            ? formatFileSize(file.size)
                            : "Uploaded"}
                        </p>
                      </div>
                    </div>

                    {!file.uploading && (
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(idx)}
                        className="text-[#98A2B3] hover:text-rose-600 p-1 rounded-lg transition-colors cursor-pointer"
                        title="Remove file"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {file.uploading && (
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-[#2563EB] h-1.5 rounded-full transition-all duration-200"
                        style={{ width: `${file.progress || 0}%` }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#F2F4F7]">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting || isUploading}
            className="px-4 py-2.5 rounded-xl border border-[#D0D5DD] text-sm font-semibold text-[#344054] hover:bg-[#F9FAFB] transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={
              isSubmitting ||
              isUploading ||
              files.filter((f) => !f.uploading && f.url).length === 0 ||
              !transactionId.trim()
            }
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting...
              </>
            ) : isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Uploading Receipt...
              </>
            ) : (
              "Submit Proof"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  invoiceId,
  invoiceNumber,
  amount,
  projectName,
  dueDate,
  onSuccess,
}) => {
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const handleSuccess = () => {
    onClose();
    setIsSuccessModalOpen(true);
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        showHeader={false}
        width="sm:max-w-xl"
        customPadding="p-0"
      >
        {isOpen && (
          <PaymentProofForm
            onClose={onClose}
            invoiceId={invoiceId}
            invoiceNumber={invoiceNumber}
            initialAmount={amount}
            projectName={projectName}
            dueDate={dueDate}
            onSuccess={handleSuccess}
          />
        )}
      </Modal>

      {/* Success Modal */}
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title="Payment Proof Submitted"
        subTitle="Your payment details have been sent for manual verification."
        subSubTitle="Our finance team will verify the payment and update the status within 24 hours."
      />
    </>
  );
};

export default PaymentModal;
