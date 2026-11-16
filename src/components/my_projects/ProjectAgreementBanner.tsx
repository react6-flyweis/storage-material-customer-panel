import React, { useState } from "react";
import {
  CheckCircle2,
  ExternalLink,
  Download,
  Loader2,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AgreementStatus } from "@/types/agreement";

export interface ProjectAgreementBannerProps {
  leadId?: string;
  status?: AgreementStatus;
  signerEmail?: string;
  sentAt?: string;
  signedAt?: string;
  signedPdfUrl?: string;
  onSignComplete?: () => void;
}

const formatAgreementBannerText = (options: {
  status: AgreementStatus;
  signerEmail?: string;
  sentAt?: string;
  signedAt?: string;
  signedPdfUrl?: string;
}) => {
  const { status, signerEmail, sentAt, signedAt } = options;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "recent";
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

  if (status === "completed") {
    return {
      title: `Fabrication & Supply Agreement Signed on ${formatDate(
        signedAt || new Date().toISOString()
      )}`,
      body: "Contract successfully executed and archived in your project document vault.",
      actionType: "download" as const,
    };
  }

  return {
    title: "Awaiting your electronic signature",
    body: `Agreement sent to ${
      signerEmail || "your email"
    } on ${formatDate(
      sentAt || new Date().toISOString()
    )}. Awaiting your electronic signature.`,
    actionType: "sign" as const,
  };
};

export const ProjectAgreementBanner: React.FC<ProjectAgreementBannerProps> = ({
  leadId,
  status = "sent",
  signerEmail = "client@thesteel.com",
  sentAt = "2026-11-15T10:30:00Z",
  signedAt,
  signedPdfUrl = "#",
  onSignComplete,
}) => {
  const [signedStatus, setSignedStatus] = useState<AgreementStatus | null>(null);
  const [isSigning, setIsSigning] = useState(false);

  const effectiveStatus = signedStatus || status;

  if (effectiveStatus === "not_sent" || effectiveStatus === "declined" || effectiveStatus === "voided") {
    return null;
  }

  const { title, body } = formatAgreementBannerText({
    status: effectiveStatus,
    signerEmail,
    sentAt,
    signedAt,
    signedPdfUrl,
  });

  const handleSignNow = () => {
    setIsSigning(true);
    // Simulate DocuSign redirect/signing ceremony
    setTimeout(() => {
      setIsSigning(false);
      setSignedStatus("completed");
      if (onSignComplete) onSignComplete();
      // append query param or trigger success modal
      const newUrl = leadId
        ? `/my_projects/${leadId}?signing_complete=true`
        : `${window.location.pathname}?signing_complete=true`;
      window.history.pushState({}, "", newUrl);
      window.dispatchEvent(new PopStateEvent("popstate"));
    }, 1200);
  };

  const handleDownload = () => {
    if (signedPdfUrl && signedPdfUrl !== "#") {
      window.open(signedPdfUrl, "_blank");
    } else {
      alert("Downloading Fabrication & Supply Agreement (Signed).pdf");
    }
  };

  if (effectiveStatus === "completed") {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs transition-all">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm sm:text-base font-bold text-emerald-950">
                {title}
              </h4>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                Executed
              </span>
            </div>
            <p className="text-xs text-emerald-800/80 mt-0.5">{body}</p>
          </div>
        </div>

        <Button
          onClick={handleDownload}
          variant="outline"
          className="border-emerald-300 bg-white hover:bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-medium h-9 px-4 rounded-xl flex items-center gap-2 shrink-0 self-start sm:self-auto cursor-pointer"
        >
          <Download className="w-4 h-4" />
          Download Signed PDF
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-amber-300 bg-gradient-to-r from-amber-50/90 to-blue-50/60 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs transition-all">
      <div className="flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
          <Clock className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-sm sm:text-base font-bold text-slate-900">
              {title}
            </h4>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              DocuSign
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">{body}</p>
        </div>
      </div>

      <Button
        onClick={handleSignNow}
        disabled={isSigning}
        className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs sm:text-sm font-medium h-10 px-5 rounded-xl flex items-center justify-center gap-2 shrink-0 shadow-xs cursor-pointer self-start sm:self-auto"
      >
        {isSigning ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <ExternalLink className="w-4 h-4" />
        )}
        Sign Now on DocuSign
      </Button>
    </div>
  );
};

export default ProjectAgreementBanner;
