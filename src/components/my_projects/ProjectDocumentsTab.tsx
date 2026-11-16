import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  FileSignature,
  Download,
  Eye,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ProjectDetailsResponseData } from "@/redux/api/projectsApi";
import type { AgreementStatus } from "@/types/agreement";

interface ProjectDocumentsTabProps {
  data?: ProjectDetailsResponseData;
  leadId: string;
  contractStatus?: AgreementStatus;
}

interface VaultItem {
  id: string;
  name: string;
  category: "agreement" | "drawing" | "specification" | "general";
  size: string;
  uploadedAt: string;
  status: "pending" | "signed" | "approved" | "available";
  url?: string;
}

export const ProjectDocumentsTab: React.FC<ProjectDocumentsTabProps> = ({
  data,
  leadId,
  contractStatus = "sent",
}) => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [agreementState, setAgreementState] =
    useState<AgreementStatus>(contractStatus);

  const lead = data?.lead;
  const projectName = lead?.projectName || "Commercial Steel Warehouse";
  const signerEmail =
    (typeof lead?.assignedSales === "object" && lead?.assignedSales?.email) ||
    "client@thesteel.com";

  // Build document list with dynamic contract + lead documents
  const documents: VaultItem[] = [
    {
      id: "contract-1",
      name:
        agreementState === "completed"
          ? "Fabrication & Supply Agreement (Signed)"
          : "Fabrication & Supply Agreement",
      category: "agreement",
      size: "248.5 KB",
      uploadedAt: "2026-11-15T10:30:00Z",
      status: agreementState === "completed" ? "signed" : "pending",
      url: "#",
    },
    ...(lead?.documents || []).map((doc, idx) => ({
      id: doc._id || `doc-${idx}`,
      name: doc.name || `Document ${idx + 1}`,
      category: (doc.type?.toLowerCase().includes("drawing")
        ? "drawing"
        : "specification") as "drawing" | "specification",
      size: "1.2 MB",
      uploadedAt: doc.uploadedAt || new Date().toISOString(),
      status: "available" as const,
      url: doc.url,
    })),
    {
      id: "spec-1",
      name: "Engineering Structural Specifications & Load Calculations",
      category: "specification",
      size: "3.4 MB",
      uploadedAt: "2026-11-14T14:20:00Z",
      status: "approved",
      url: "#",
    },
    {
      id: "dwg-1",
      name: "Architectural Layout & Elevation Plan - Rev B",
      category: "drawing",
      size: "4.8 MB",
      uploadedAt: "2026-11-13T09:15:00Z",
      status: "approved",
      url: "#",
    },
  ];

  const filteredDocuments = documents.filter((doc) => {
    const matchesCategory =
      activeCategory === "all" || doc.category === activeCategory;
    const matchesSearch = doc.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "Recent";
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

  const handleSignAgreement = () => {
    // Simulate DocuSign redirect/completion
    setTimeout(() => {
      setAgreementState("completed");
      navigate(`/my_projects/${leadId}?signing_complete=true`);
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Featured DocuSign Agreement Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs ${
                agreementState === "completed"
                  ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                  : "bg-amber-50 text-amber-600 border border-amber-200"
              }`}
            >
              {agreementState === "completed" ? (
                <CheckCircle2 className="w-6 h-6" />
              ) : (
                <FileSignature className="w-6 h-6" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <Badge
                  variant="outline"
                  className={`${
                    agreementState === "completed"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                      : "bg-amber-50 text-amber-800 border-amber-300"
                  } text-xs font-semibold`}
                >
                  {agreementState === "completed" ? (
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Signed & Executed
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Signature Pending
                    </span>
                  )}
                </Badge>
                <span className="inline-flex items-center gap-1 text-xs text-slate-500 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  DocuSign eSignature
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Fabrication & Supply Agreement
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mt-0.5">
                {agreementState === "completed"
                  ? `Legally executed contract for ${projectName}. Electronic signature verified.`
                  : `Awaiting your electronic signature. Sent to ${signerEmail}. Sign electronically to release engineering and material production.`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 self-start md:self-center">
            {agreementState === "completed" ? (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => alert("Downloading signed PDF agreement...")}
                  className="text-xs h-9 px-4 rounded-xl border-slate-200 hover:bg-slate-50 text-slate-700 flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-4 h-4 text-slate-500" />
                  Download Signed PDF
                </Button>
                <Button
                  size="sm"
                  onClick={() =>
                    navigate("/document_preview", {
                      state: {
                        documentName: "Fabrication & Supply Agreement (Signed)",
                        documentUrl: "#",
                        documentType: "Agreement",
                      },
                    })
                  }
                  className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs h-9 px-4 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Eye className="w-4 h-4" />
                  Preview
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                onClick={handleSignAgreement}
                className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs sm:text-sm font-medium h-10 px-5 rounded-xl flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <ExternalLink className="w-4 h-4" />
                Review & Sign on DocuSign
              </Button>
            )}
          </div>
        </div>

        {/* Contract Meta Info Bar */}
        <div className="bg-slate-50/70 px-5 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-6 flex-wrap">
            <span>
              <strong className="text-slate-700">Project:</strong> {projectName}
            </span>
            <span>
              <strong className="text-slate-700">Job ID:</strong>{" "}
              {lead?.jobId || "JOB-2026-884"}
            </span>
            <span>
              <strong className="text-slate-700">Sent Date:</strong> Nov 15,
              2026
            </span>
          </div>
          <span className="text-slate-400">
            256-Bit SSL Encrypted & Non-Repudiation Audit Trail
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {[
              { id: "all", label: "All Documents" },
              { id: "agreement", label: "Agreements" },
              { id: "drawing", label: "Drawings" },
              { id: "specification", label: "Specifications" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  activeCategory === cat.id
                    ? "bg-[#2563EB] text-white shadow-2xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#2563EB] bg-slate-50/50"
            />
          </div>
        </div>

        {/* Documents Table / Grid */}
        <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
          {filteredDocuments.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500">
              No documents found matching your filter criteria.
            </div>
          ) : (
            filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                    <FileText className="w-5 h-5 text-[#2563EB]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-slate-900 truncate">
                      {doc.name}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {doc.size} • Uploaded {formatDate(doc.uploadedAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {doc.category === "agreement" &&
                  doc.status === "pending" ? (
                    <Button
                      size="sm"
                      onClick={handleSignAgreement}
                      className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs h-8 px-3 rounded-lg flex items-center gap-1.5 cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Sign Now ↗
                    </Button>
                  ) : (
                    <>
                      <button
                        onClick={() =>
                          alert(`Downloading ${doc.name}...`)
                        }
                        title="Download"
                        className="p-2 rounded-lg border border-slate-200 hover:bg-white text-slate-600 transition-colors cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() =>
                          navigate("/document_preview", {
                            state: {
                              documentName: doc.name,
                              documentUrl: doc.url || "#",
                              documentType: doc.category,
                            },
                          })
                        }
                        title="Preview"
                        className="p-2 rounded-lg border border-slate-200 hover:bg-white text-[#2563EB] transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDocumentsTab;
