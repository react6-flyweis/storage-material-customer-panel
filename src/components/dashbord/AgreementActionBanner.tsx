import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileSignature,
  ExternalLink,
  Loader2,
  Mail,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { type AgreementStatus, shouldDisplayActionBanner } from "@/types/agreement";

export interface AgreementActionBannerProps {
  leadId?: string;
  projectName?: string;
  status?: AgreementStatus;
  envelopeEmail?: string;
  onSignClick?: () => void;
}

export const AgreementActionBanner: React.FC<AgreementActionBannerProps> = ({
  leadId = "demo-project",
  projectName = "Commercial Steel Warehouse",
  status = "sent",
  envelopeEmail = "client@thesteel.com",
  onSignClick,
}) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!shouldDisplayActionBanner(status)) {
    return null;
  }

  const handleReviewAndSign = () => {
    if (onSignClick) {
      onSignClick();
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    // Simulate DocuSign redirect to post-signing callback in UI mode
    setTimeout(() => {
      setIsLoading(false);
      navigate(`/my_projects/${leadId}?signing_complete=true`);
    }, 600);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border-2 border-amber-300/90 bg-gradient-to-r from-amber-50/90 via-white to-blue-50/70 p-5 md:p-6 shadow-sm transition-all animate-in fade-in duration-300">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        {/* Left column: icon + text */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100/90 border border-amber-200 text-amber-700 flex items-center justify-center shrink-0 shadow-2xs">
            <FileSignature className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200/80">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                Action Required
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                DocuSign eSignature
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Action Required: Review & Sign Agreement
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              Your Fabrication & Supply Agreement for project{" "}
              <strong className="font-semibold text-slate-900">
                {projectName}
              </strong>{" "}
              is ready. Please sign electronically to proceed to engineering and
              production.
            </p>

            {errorMessage && (
              <div className="flex items-center gap-1.5 text-xs text-red-600 pt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right column: actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 lg:pl-4">
          <Button
            onClick={handleReviewAndSign}
            disabled={isLoading}
            className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-5 py-2.5 rounded-xl font-medium text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer h-11"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ExternalLink className="w-4 h-4" />
            )}
            Review & Sign on DocuSign
          </Button>

          <a
            href={`mailto:${envelopeEmail}?subject=DocuSign Agreement for ${encodeURIComponent(
              projectName
            )}`}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white/80 hover:bg-slate-50 text-xs sm:text-sm font-medium text-slate-700 transition-colors h-11"
          >
            <Mail className="w-4 h-4 text-slate-500" />
            <span>Check Email for link</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default AgreementActionBanner;
