import { ArrowDown, Eye } from "lucide-react";
import { projectDocumentsMockData } from "@/data/ProjectDrawingsData";
import type { Document } from "@/data/ProjectDrawingsData";
import PinkFileIcon from "@/assets/icon/PinkFileIcon.svg";
import { useNavigate } from "react-router-dom";
import DocumentPDF from "../../assets/dummy-pdf_2.pdf";

const DocumentCard = ({ document }: { document: Document }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white border border-gray-100 rounded-md md:p-4 p-2 flex items-center justify-between gap-4 group hover:shadow-md transition-shadow flex-1">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-red-500">
          <img src={PinkFileIcon} alt="" className="h-6 w-6" />
        </div>
        <div className="flex flex-col mr-4">
          <span className="text-sm font-semibold text-gray-900 transition-colors truncate max-w-[150px] lg:max-w-none">
            {document.name}
          </span>
          <span className="text-xs text-gray-400">{document.size}</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex flex-col items-end gap-4 relative">
          <div className="flex items-center gap-3 lg:hidden">
            <a href={DocumentPDF} download="dashboard.pdf">
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
                      documentName: document.name,
                      documentType: document.name.includes("Agreement")
                        ? "Agreement"
                        : "Contract",
                    },
                  });
                }
              }}
            />
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-3">
          <a href={DocumentPDF} download="dashboard.pdf">
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
                    documentName: document.name,
                    documentType: document.name.includes("Agreement")
                      ? "Agreement"
                      : "Contract",
                  },
                });
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

const ProjectsDocumentList = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100/50 overflow-hidden">
      <div className="md:p-6 p-4 border-b border-gray-300">
        <h2 className="md:text-xl text-lg font-semibold text-(--text-color-black) font-inter">
          Agreement & Contract
        </h2>
      </div>

      <div className="p-4 space-y-6">
        {projectDocumentsMockData.map((project, index) => (
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
                    25-apr-2026
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
                  <DocumentCard key={document.id} document={document} />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsDocumentList;
