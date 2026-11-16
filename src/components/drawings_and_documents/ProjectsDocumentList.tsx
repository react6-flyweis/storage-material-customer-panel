import { ArrowDown, Eye, ExternalLink, FileSignature } from "lucide-react";
import PinkFileIcon from "@/assets/icon/PinkFileIcon.svg";
import { useNavigate } from "react-router-dom";
import DocumentPDF from "../../assets/dummy-pdf_2.pdf";
import { useGetCustomerDocumentsQuery } from "@/redux/api/projectsApi";
import { Button } from "@/components/ui/button";

interface DisplayDocument {
  id: string;
  name: string;
  size: string;
  type: string;
  status: string;
  fileUrl: string;
}

interface DisplayProject {
  projectName: string;
  projectCode: string;
  leadId: string;
  siteLocation: string;
  lastUpdate: string;
  documents: DisplayDocument[];
}

const getDocumentDisplayMeta = (document: {
  name: string;
  status: string;
}) => {
  const normName = (document.name || "").toLowerCase();
  const isAgreement =
    normName.includes("agreement") || normName.includes("contract");

  if (!isAgreement) {
    return {
      displayName: document.name,
      badgeLabel: document.status || "Uploaded",
      badgeColor: "gray" as const,
      isSignable: false,
    };
  }

  const normStatus = (document.status || "").toLowerCase();
  if (normStatus === "completed" || normStatus === "signed") {
    return {
      displayName: "Fabrication & Supply Agreement (Signed)",
      badgeLabel: "Signed",
      badgeColor: "emerald" as const,
      isSignable: false,
    };
  }

  return {
    displayName: "Fabrication & Supply Agreement",
    badgeLabel: "Signature Pending",
    badgeColor: "amber" as const,
    isSignable: true,
  };
};

const DocumentCard = ({
  document,
  leadId,
}: {
  document: DisplayDocument;
  leadId?: string;
}) => {
  const navigate = useNavigate();
  const meta = getDocumentDisplayMeta(document);

  return (
    <div className="bg-white border border-gray-100 rounded-md md:p-4 p-2.5 flex items-center justify-between gap-4 group hover:shadow-md transition-shadow flex-1 min-w-[280px]">
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            meta.isSignable
              ? "bg-amber-50 text-amber-600"
              : meta.badgeColor === "emerald"
              ? "bg-emerald-50 text-emerald-600"
              : "bg-gray-50 text-red-500"
          }`}
        >
          {meta.isSignable ? (
            <FileSignature className="h-5 w-5" />
          ) : (
            <img src={PinkFileIcon} alt="" className="h-6 w-6" />
          )}
        </div>
        <div className="flex flex-col mr-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-gray-900 transition-colors truncate max-w-[170px] lg:max-w-none">
              {meta.displayName}
            </span>
            {meta.badgeLabel && (
              <span
                className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${
                  meta.badgeColor === "amber"
                    ? "bg-amber-50 text-amber-800 border-amber-200"
                    : meta.badgeColor === "emerald"
                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                    : "bg-gray-100 text-gray-700 border-gray-200"
                }`}
              >
                {meta.badgeLabel}
              </span>
            )}
          </div>
          <span className="text-xs text-gray-400">{document.size}</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {meta.isSignable ? (
          <Button
            size="sm"
            onClick={() =>
              navigate(`/my_projects/${leadId || "demo"}?signing_complete=true`)
            }
            className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-medium h-8 px-3 rounded-md flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Sign Now ↗
          </Button>
        ) : (
          <>
            <div className="flex items-center gap-3 lg:hidden">
              <a
                href={document.fileUrl || DocumentPDF}
                download
                target="_blank"
                rel="noopener noreferrer"
              >
                <ArrowDown className="h-4 w-4 text-[#333333] cursor-pointer" />
              </a>
              <Eye
                className="h-4 w-4 text-[#1D51A4] cursor-pointer"
                onClick={() => {
                  if (document.name.toLowerCase().includes("invoice")) {
                    navigate("/invoice_preview", {
                      state: { invoiceNumber: document.id },
                    });
                  } else {
                    navigate("/document_preview", {
                      state: {
                        documentName: meta.displayName,
                        documentUrl: document.fileUrl,
                        documentType: meta.displayName.includes("Agreement")
                          ? "Agreement"
                          : "Contract",
                      },
                    });
                  }
                }}
              />
            </div>
            <div className="hidden lg:flex items-center gap-3">
              <a
                href={document.fileUrl || DocumentPDF}
                download
                target="_blank"
                rel="noopener noreferrer"
              >
                <ArrowDown className="h-4 w-4 text-[#333333] cursor-pointer" />
              </a>
              <Eye
                className="h-5 w-5 text-[#1D51A4] cursor-pointer transition-colors"
                onClick={() => {
                  if (document.name.toLowerCase().includes("invoice")) {
                    navigate("/invoice_preview", {
                      state: { invoiceNumber: document.id },
                    });
                  } else {
                    navigate("/document_preview", {
                      state: {
                        documentName: meta.displayName,
                        documentUrl: document.fileUrl,
                        documentType: meta.displayName.includes("Agreement")
                          ? "Agreement"
                          : "Contract",
                      },
                    });
                  }
                }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const ProjectsDocumentList = () => {
  const { data, isLoading, isError } = useGetCustomerDocumentsQuery({ type: "contract" });

  const projectDocuments: DisplayProject[] = (data?.projects || []).map((p) => {
    const firstDoc = p.documents?.[0];
    const lastUpdate = firstDoc?.uploadedAt 
      ? new Date(firstDoc.uploadedAt).toLocaleDateString()
      : "-";

    const docs =
      p.documents && p.documents.length > 0
        ? p.documents.map((d) => ({
            id: d._id,
            name: d.name,
            size: d.fileSize ? `${(d.fileSize / 1024).toFixed(1)} KB` : "0 KB",
            type: d.fileType || "pdf",
            status: d.status,
            fileUrl: d.url,
          }))
        : [
            {
              id: `agreement-${p.lead._id}`,
              name: "Fabrication & Supply Agreement",
              size: "248.5 KB",
              type: "pdf",
              status: "sent",
              fileUrl: "",
            },
          ];

    return {
      projectName: p.lead.projectName || p.lead.buildingType || "Untitled Project",
      projectCode: p.lead.jobId || "-",
      leadId: p.lead._id,
      siteLocation: p.lead.location || "-",
      lastUpdate,
      documents: docs,
    };
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100/50 overflow-hidden">
      <div className="md:p-6 p-4 border-b border-gray-300">
        <h2 className="md:text-xl text-lg font-semibold text-(--text-color-black) font-inter">
          Agreement & Contract
        </h2>
      </div>

      <div className="p-4 space-y-6">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1D51A4]"></div>
          </div>
        ) : isError ? (
          <div className="text-center py-10 text-red-500 font-medium">
            Failed to load documents. Please try again.
          </div>
        ) : projectDocuments.length === 0 ? (
          <div className="text-center py-10 text-gray-500 font-medium">
            No projects or documents found.
          </div>
        ) : (
          projectDocuments.map((project, index) => (
            <div
              key={index}
              className="md:space-y-6 space-y-4 border p-4 rounded-md"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="md:text-xl text-base font-semibold text-(--text-color-black) font-inter">
                    {project.projectName}
                  </h3>
                  <p className="md:text-base text-xs text-(--text-color-gray-2)">
                    {project.projectCode}
                  </p>
                </div>
                <div className="flex items-start gap-10 flex-wrap">
                  <div className="max-w-[120px]">
                    <p className="md:text-sm text-xs font-normal text-black">
                      {project.siteLocation}
                    </p>
                  </div>
                  <div className="max-w-[120px]">
                    <p className="text-xs font-normal text-black">
                      Last Update On
                    </p>
                    <p className="text-md font-normal text-black">
                      {project.lastUpdate}
                    </p>
                  </div>
                </div>
              </div>

              <div className="">
                <h4 className="md:text-base text-sm font-semibold text-black mb-4">
                  Attachments & Documents
                </h4>
                <div className="flex flex-wrap gap-6 justify-between">
                  {project.documents.map((document) => (
                    <DocumentCard
                      key={document.id}
                      document={document}
                      leadId={project.leadId}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProjectsDocumentList;
