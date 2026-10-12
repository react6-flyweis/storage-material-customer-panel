import React, { useState, useRef, useEffect } from "react";
import {
  Loader2,
  AlertTriangle,
  RefreshCw,
  Download,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import noQuotationImg from "@/assets/images/no-quotation.png";
import {
  useGetProjectQuotationQuery,
  useGetQuotationHtmlPreviewQuery,
  useDownloadQuotationPdfMutation,
  useApproveQuotationMutation,
  useRejectQuotationMutation,
} from "@/redux/api/projectsApi";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import SuccessModal from "@/components/common_components/SuccessModal";

interface ProjectQuotationProps {
  leadId: string;
}

const formatCurrency = (val?: number | null) => {
  if (val === undefined || val === null || isNaN(val)) return "";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(val);
};

const formatDate = (dateStr?: string | null) => {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
};

const ProjectQuotation: React.FC<ProjectQuotationProps> = ({ leadId }) => {
  const {
    data: quotationResponse,
    isLoading: isQuotationLoading,
    error: quotationError,
    refetch: refetchQuotation,
  } = useGetProjectQuotationQuery(leadId, {
    skip: !leadId,
  });

  // Derive response fields
  const availability = quotationResponse?.availability;
  const quotation = quotationResponse?.quotation;
  const quoteSummary = quotationResponse?.quoteSummary;
  const preview = quotationResponse?.preview;

  const [iframeHeight, setIframeHeight] = useState<number>(850);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Modals state
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectionError, setRejectionError] = useState<string | null>(null);

  // Success modal state
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successModalTitle, setSuccessModalTitle] = useState("");
  const [successModalSubSubTitle, setSuccessModalSubSubTitle] = useState("");

  // Mutations
  const [approveQuotation, { isLoading: isApproving }] =
    useApproveQuotationMutation();
  const [rejectQuotation, { isLoading: isRejecting }] =
    useRejectQuotationMutation();
  const [downloadQuotationPdf, { isLoading: isDownloadingPdf }] =
    useDownloadQuotationPdfMutation();

  const {
    data: htmlPreviewData,
    isLoading: isHtmlLoading,
    isError: isHtmlError,
    refetch: refetchHtmlPreview,
  } = useGetQuotationHtmlPreviewQuery(
    { previewUrl: preview?.htmlUrl, leadId },
    {
      skip: !leadId || availability === "pending" || (!preview?.htmlUrl && !quotation),
    }
  );

  // Auto-adjust iframe height to match HTML proposal content
  const handleIframeLoad = () => {
    try {
      const iframe = iframeRef.current;
      if (iframe && iframe.contentWindow?.document?.body) {
        const bodyHeight = iframe.contentWindow.document.body.scrollHeight;
        if (bodyHeight > 300) {
          setIframeHeight(Math.max(bodyHeight + 40, 750));
        }
      }
    } catch {
      setIframeHeight(950);
    }
  };

  useEffect(() => {
    if (htmlPreviewData) {
      const timer1 = setTimeout(handleIframeLoad, 300);
      const timer2 = setTimeout(handleIframeLoad, 1000);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [htmlPreviewData]);

  // Actions
  const handleDownloadPdf = async () => {
    if (!leadId) return;
    try {
      const blob = await downloadQuotationPdf({
        leadId,
        pdfUrl: preview?.pdfUrl,
      }).unwrap();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `Quotation-${quotation?.quoteNumber || leadId}.pdf`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download PDF quotation:", err);
    }
  };

  const handleApprove = async () => {
    try {
      await approveQuotation(leadId).unwrap();
      setIsApproveModalOpen(false);
      setSuccessModalTitle("Quotation Approved Successfully");
      setSuccessModalSubSubTitle(
        "Our project team has been notified and will proceed with next steps."
      );
      setIsSuccessModalOpen(true);
      setTimeout(() => {
        setIsSuccessModalOpen(false);
      }, 4000);
      refetchQuotation();
    } catch (err) {
      console.error("Failed to approve quotation:", err);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      setRejectionError("Please provide a reason for rejecting the quotation.");
      return;
    }
    try {
      setRejectionError(null);
      await rejectQuotation({
        leadId,
        reason: rejectionReason.trim(),
      }).unwrap();
      setIsRejectModalOpen(false);
      setRejectionReason("");
      setSuccessModalTitle("Quotation Rejected Successfully");
      setSuccessModalSubSubTitle(
        "Your feedback has been sent to the sales team to prepare revisions."
      );
      setIsSuccessModalOpen(true);
      setTimeout(() => {
        setIsSuccessModalOpen(false);
      }, 4000);
      refetchQuotation();
    } catch (err: unknown) {
      const apiErr = err as { data?: { message?: string } };
      setRejectionError(
        apiErr?.data?.message || "Failed to reject quotation. Please try again."
      );
    }
  };

  // Loading state
  if (isQuotationLoading) {
    return (
      <div className="flex flex-col h-100 w-full items-center justify-center bg-white rounded-xl border border-slate-200/80 shadow-xs gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-[#1D51A4]" />
        <p className="text-sm font-medium text-slate-600">
          Loading quotation details...
        </p>
      </div>
    );
  }

  // Pending / Processing / 404 UI
  const is404 =
    (quotationError as { status?: number })?.status === 404 ||
    (!isQuotationLoading && !quotationResponse && !quotation);

  if (availability === "pending" || is404) {
    const serverMessage =
      quotationResponse?.message ||
      (quotationResponse as { data?: { message?: string } })?.data?.message ||
      (availability === "pending"
        ? "We will Update you soon"
        : "Quotation Not Received Yet");

    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-8 sm:p-14 text-center w-full space-y-6">
        <div className="space-y-2 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#101828]">
            {availability === "pending"
              ? "Quotation In Progress"
              : "Quotation Not Received Yet"}
          </h2>
          <p className="text-base sm:text-lg font-medium text-[#64748B]">
            {serverMessage}
          </p>
        </div>

        <div className="flex justify-center py-4">
          <img
            src={noQuotationImg}
            alt="Quotation Not Received"
            className="w-56 sm:w-64 h-auto object-contain"
          />
        </div>
      </div>
    );
  }

  // Error state
  if (quotationError) {
    return (
      <div className="bg-white rounded-2xl border border-red-200 shadow-sm p-8 text-center space-y-4 w-full my-4">
        <div className="h-12 w-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-slate-900">
            Failed to Load Quotation
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">
            {quotationResponse?.message ||
              "There was an issue retrieving quotation details. Please try refreshing."}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetchQuotation()}
          className="text-xs px-4 rounded-xl border-slate-200 cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
          Retry
        </Button>
      </div>
    );
  }

  // Quotation is Ready
  const effectiveStatus = (
    quotation?.status ||
    quotation?.workflowStatus ||
    "sent"
  ).toLowerCase();
  const isApproved = effectiveStatus === "accepted";
  const isRejected = effectiveStatus === "rejected";
  const isPendingDecision = !isApproved && !isRejected;

  const quoteNumber =
    quotation?.quoteNumber || (quotation?._id ? `QT-${quotation._id.slice(-6).toUpperCase()}` : "QT-001");
  const finalPrice = quotation?.finalPrice ?? quotation?.sourceEstimate?.grandTotal;
  const clientNotes =
    quotation?.clientNotes ||
    (quotation as unknown as { rejectReason?: string })?.rejectReason;

  // Summary text extraction from quoteSummary
  const summaryText =
    quotationResponse?.quoteSummary?.summary ||
    (quotationResponse as unknown as { data?: { quoteSummary?: { summary?: string } } })?.data
      ?.quoteSummary?.summary ||
    (quotation as unknown as { quoteSummary?: { summary?: string } })?.quoteSummary?.summary ||
    (quotation as unknown as { summary?: string })?.summary ||
    (typeof quotationResponse?.quoteSummary === "string"
      ? (quotationResponse.quoteSummary as string)
      : null);

  return (
    <div className="space-y-5 w-full">
      {/* Top Header Card with Actions */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="text-xl md:text-2xl font-bold text-[#0F172A]">
              Quote {quoteNumber}
            </h2>
            {quotation?.versionNumber && (
              <Badge variant="outline" className="text-xs font-semibold text-slate-600 bg-slate-50 border-slate-300">
                v{quotation.versionNumber}
              </Badge>
            )}
            {isApproved ? (
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-semibold flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                Approved
              </Badge>
            ) : isRejected ? (
              <Badge className="bg-red-50 text-red-700 border-red-200 text-xs font-semibold flex items-center gap-1">
                <XCircle className="h-3 w-3 text-red-600" />
                Rejected
              </Badge>
            ) : (
              <Badge className="bg-blue-50 text-[#1D51A4] border-blue-200 text-xs font-semibold flex items-center gap-1">
                <Clock className="h-3 w-3 text-[#1D51A4]" />
                Ready for Review
              </Badge>
            )}
          </div>
          <p className="text-xs text-slate-500">
            Generated {formatDate(quotation?.createdAt || quoteSummary?.generatedAt)}
            {quotation?.validTill && ` • Valid until ${formatDate(quotation.validTill)}`}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Download PDF button */}
          <Button
            size="sm"
            variant="outline"
            onClick={handleDownloadPdf}
            disabled={isDownloadingPdf}
            className="border-slate-200 text-slate-700 hover:bg-slate-50 h-9 px-3.5 text-xs font-medium rounded-lg flex items-center gap-1.5 cursor-pointer"
            title="Download PDF Quotation Document"
          >
            {isDownloadingPdf ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Download className="h-3.5 w-3.5 text-slate-600" />
            )}
            <span>{isDownloadingPdf ? "Downloading..." : "Download PDF"}</span>
          </Button>

          {/* Customer Decision Actions */}
          {isPendingDecision && (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsRejectModalOpen(true)}
                disabled={isApproving || isRejecting}
                className="border-red-200 text-red-600 hover:bg-red-50 h-9 px-3.5 text-xs font-medium rounded-lg flex items-center gap-1.5 cursor-pointer"
              >
                <XCircle className="h-3.5 w-3.5" />
                Reject
              </Button>
              <Button
                size="sm"
                onClick={() => setIsApproveModalOpen(true)}
                disabled={isApproving || isRejecting}
                className="bg-[#1D51A4] hover:bg-[#163e80] text-white h-9 px-4 text-xs font-medium rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                {isApproving ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <CheckCircle2 className="h-3.5 w-3.5" />
                )}
                Approve to Proceed
              </Button>
            </>
          )}

          {isRejected && (
            <>
              <Button
                size="sm"
                variant="outline"
                disabled
                className="border-slate-200 text-slate-400 bg-slate-50 h-9 px-3.5 text-xs font-medium rounded-lg flex items-center gap-1.5 cursor-not-allowed opacity-60"
              >
                <XCircle className="h-3.5 w-3.5" />
                Reject
              </Button>
              <Button
                size="sm"
                disabled
                className="bg-slate-200 text-slate-400 h-9 px-4 text-xs font-medium rounded-lg flex items-center gap-1.5 cursor-not-allowed opacity-60"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                Approve to Proceed
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Rejection Feedback Banner */}
      {isRejected && (
        <div className="bg-amber-50/80 border border-amber-200/90 rounded-xl p-3.5 sm:p-4 shadow-2xs space-y-1.5">
          <div className="flex items-center gap-2">
            <XCircle className="h-4 w-4 text-red-600 shrink-0" />
            <h4 className="font-semibold text-slate-900 text-xs sm:text-sm">
              Quotation Rejected
            </h4>
          </div>
          {clientNotes && (
            <div className="text-xs text-slate-700 pl-6">
              <span className="font-medium text-slate-900">Your feedback: </span>
              <span className="italic text-slate-600">"{clientNotes}"</span>
            </div>
          )}
          <p className="text-xs text-slate-500 pl-6">
            Sales will send an updated quotation — you cannot undo this rejection.
          </p>
        </div>
      )}

      {/* Quotation Summary - Compact Size */}
      {summaryText && (
        <div className="bg-slate-50/80 rounded-xl border border-slate-200/80 p-3.5 sm:p-4 shadow-2xs space-y-1">
          <h3 className="text-xs font-semibold text-slate-700">
            Quotation Summary
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">
            {summaryText}
          </p>
        </div>
      )}

      {/* HTML Document Preview Card */}
      <div className="w-full bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        {isHtmlLoading ? (
          <div className="flex flex-col items-center justify-center py-28 text-slate-400 gap-3 min-h-125">
            <Loader2 className="h-8 w-8 text-[#1D51A4] animate-spin" />
            <p className="text-sm font-medium text-slate-600">
              Loading document preview...
            </p>
          </div>
        ) : isHtmlError || !htmlPreviewData ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center gap-3 min-h-100">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-800">
                Preview Unavailable
              </p>
              <p className="text-xs text-slate-500 max-w-sm">
                Unable to load the HTML preview directly.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetchHtmlPreview()}
              className="text-xs flex items-center gap-1.5 mt-2 cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Retry
            </Button>
          </div>
        ) : (
          <iframe
            ref={iframeRef}
            title="Quotation Preview"
            srcDoc={htmlPreviewData}
            onLoad={handleIframeLoad}
            className="w-full border-none block"
            style={{
              height: `${iframeHeight}px`,
              minHeight: "750px",
            }}
            sandbox="allow-same-origin allow-scripts"
          />
        )}
      </div>

      {/* Approve Confirmation Modal */}
      <Dialog open={isApproveModalOpen} onOpenChange={setIsApproveModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              Approve Quotation
            </DialogTitle>
          </DialogHeader>
          <div className="py-3 space-y-3">
            <p className="text-sm text-slate-600">
              Are you sure you want to approve Quote{" "}
              <strong className="font-semibold text-slate-900">{quoteNumber}</strong>{" "}
              {finalPrice ? `for ${formatCurrency(finalPrice)}` : ""}?
            </p>
            <p className="text-xs text-slate-500">
              Upon approval, our project management team will lock in the proposal
              and begin scheduling production drawings and fabrication.
            </p>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsApproveModalOpen(false)}
              disabled={isApproving}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleApprove}
              disabled={isApproving}
              className="bg-[#1D51A4] hover:bg-[#163e80] text-white"
            >
              {isApproving && <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />}
              Confirm Approval
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Reason Modal */}
      <Dialog open={isRejectModalOpen} onOpenChange={setIsRejectModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              Reject Quotation
            </DialogTitle>
          </DialogHeader>
          <div className="py-3 space-y-3">
            <p className="text-sm text-slate-600">
              Please let our sales and engineering team know what changes or
              revisions are needed before you can proceed.
            </p>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">
                Reason / Revision Details <span className="text-red-500">*</span>
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => {
                  setRejectionReason(e.target.value);
                  if (rejectionError) setRejectionError(null);
                }}
                rows={4}
                placeholder="e.g. Dimensions need adjustment, price exceeds budget, need additional walk-in doors..."
                className="w-full text-sm p-3 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#1D51A4]/20 focus:border-[#1D51A4] resize-none"
              />
              {rejectionError && (
                <p className="text-xs text-red-600">{rejectionError}</p>
              )}
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsRejectModalOpen(false);
                setRejectionError(null);
              }}
              disabled={isRejecting}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleReject}
              disabled={isRejecting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isRejecting && <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />}
              Submit Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title={successModalTitle}
        subSubTitle={successModalSubSubTitle}
      />
    </div>
  );
};

export default ProjectQuotation;
