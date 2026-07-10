import { ArrowDown, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import PinkFileIcon from "@/assets/icon/PinkFileIcon.svg";
import { useState } from "react";
import ViewDrawingModal from "./ViewDrawingModal";
import DrawingPlanImg from "../../assets/DrawingPlanImg.svg";
import SuccessModal from "../common_components/SuccessModal";
import { useGetCustomerDocumentsQuery } from "@/redux/api/projectsApi";

interface DisplayDrawing {
  id: string;
  leadId: string;
  name: string;
  size: string;
  type: string;
  status: "Approved" | "Pending Review" | "Revision Required";
  fileUrl: string;
  updatedAt: string;
}

interface DisplayProject {
  projectName: string;
  projectCode: string;
  leadId: string;
  uploadedBy: string;
  siteLocation: string;
  lastUpdate: string;
  drawings: DisplayDrawing[];
}

const mapStatus = (status: string): "Approved" | "Pending Review" | "Revision Required" => {
  switch (status) {
    case "approved":
    case "Approved":
      return "Approved";
    case "under_review":
    case "Pending Review":
      return "Pending Review";
    case "revision_required":
    case "Revision Required":
      return "Revision Required";
    default:
      return "Pending Review";
  }
};

const StatusPill = ({ status }: { status: "Approved" | "Pending Review" | "Revision Required" }) => {
  const statusStyles = {
    Approved: "bg-[#DCFCE7] text-[#3AB449]",
    "Pending Review": "bg-[#FEFAE2] text-[#F0CC16]",
    "Revision Required": "bg-[#FEE2E2] text-[#EF4444]",
  };

  return (
    <span
      className={cn(
        "px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap absolute -top-3 right-3",
        statusStyles[status]
      )}
    >
      {status}
    </span>
  );
};

const DrawingCard = ({
  drawing,
  onView,
}: {
  drawing: DisplayDrawing;
  onView: () => void;
}) => {
  return (
    <div className="bg-white border border-gray-100 rounded-md md:p-3 p-2 flex items-center justify-between gap-4 group hover:shadow-md transition-shadow flex-1 relative">
      <StatusPill status={drawing.status} />
      <div className="flex items-center gap-2">
        <div className="xl:w-10 xl:h-10 w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-red-500">
          <img src={PinkFileIcon} alt="" className="xl:h-6 h-5 xl:w-6 w-5" />
        </div>
        <div className="flex flex-col mr-4">
          <span className="text-sm font-semibold text-gray-900 transition-colors">
            {drawing.name}
          </span>
          <span className="text-xs text-gray-400">{drawing.size}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex flex-col items-end gap-4 relative">
          <div className="flex items-center gap-3 lg:hidden">
            <a href={drawing.fileUrl || DrawingPlanImg} download target="_blank" rel="noopener noreferrer">
              <ArrowDown className="h-4 w-4 text-[#333333] cursor-pointer" />
            </a>
            <Eye
              className="h-4 w-4 text-[#1D51A4] cursor-pointer"
              onClick={onView}
            />
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-2">
          <a href={drawing.fileUrl || DrawingPlanImg} download target="_blank" rel="noopener noreferrer">
            <ArrowDown className="h-4 w-4 text-[#333333] cursor-pointer" />
          </a>
          <Eye
            className="h-5 w-5 text-[#1D51A4] cursor-pointer transition-colors"
            onClick={onView}
          />
        </div>
      </div>
    </div>
  );
};

const ProjectsDrawingsList = () => {
  const [selectedDrawing, setSelectedDrawing] = useState<DisplayDrawing | null>(null);
  const [selectedProjectInfo, setSelectedProjectInfo] =
    useState<DisplayProject | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");

  const { data, isLoading, isError } = useGetCustomerDocumentsQuery({ type: "drawing" });

  const onViewDrawing = (drawing: DisplayDrawing, project: DisplayProject) => {
    setSelectedDrawing(drawing);
    setSelectedProjectInfo(project);
    setIsModalOpen(true);
  };

  const projectDrawings: DisplayProject[] = (data?.projects || []).map((p) => {
    const firstDoc = p.documents?.[0];
    const uploadedBy = firstDoc?.uploadedBy?.name || "Admin";
    const lastUpdate = firstDoc?.uploadedAt 
      ? new Date(firstDoc.uploadedAt).toLocaleDateString()
      : "-";

    return {
      projectName: p.lead.projectName || p.lead.buildingType || "Untitled Project",
      projectCode: p.lead.jobId || "-",
      leadId: p.lead._id,
      uploadedBy,
      siteLocation: p.lead.location || "-",
      lastUpdate,
      drawings: p.documents.map((d) => ({
        id: d._id,
        leadId: p.lead._id,
        name: d.name,
        size: d.fileSize ? `${(d.fileSize / 1024).toFixed(1)} KB` : "0 KB",
        type: d.fileType || "pdf",
        status: mapStatus(d.status),
        fileUrl: d.url,
        updatedAt: d.uploadedAt,
      })),
    };
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100/50 overflow-hidden">
      <div className="md:p-6 p-4 border-b border-gray-300">
        <h2 className="md:text-xl text-lg font-semibold text-(--text-color-black) font-inter">
          Projects & Drawings
        </h2>
      </div>

      <div className="md:p-6 p-4 space-y-8">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1D51A4]"></div>
          </div>
        ) : isError ? (
          <div className="text-center py-10 text-red-500 font-medium">
            Failed to load drawings. Please try again.
          </div>
        ) : projectDrawings.length === 0 ? (
          <div className="text-center py-10 text-gray-500 font-medium">
            No projects or drawings found.
          </div>
        ) : (
          projectDrawings.map((project, index) => (
            <div
              key={index}
              className="md:space-y-6 space-y-4 border p-4 rounded-md"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="md:text-xl text-base font-semibold text-(--text-color-black) font-inter">
                    {project.projectName}
                  </h3>
                  <p className="md:text-base text-xs text-(--text-color-gray-2)">
                    {project.projectCode}
                  </p>
                </div>
                <div className="flex items-start gap-10 flex-wrap ml-auto">
                  <div>
                    <p className="md:text-sm text-xs text-black tracking-wider">
                      Uploaded By
                    </p>
                    <p className="md:text-sm text-xs font-normal text-black">
                      {project.uploadedBy}
                    </p>
                  </div>
                  <div className="max-w-[120px]">
                    <p className="md:text-sm text-xs font-normal text-black">
                      {project.siteLocation}
                    </p>
                  </div>
                  <div className="col-span-2 lg:col-span-1">
                    <p className="text-xs text-(--text-color-gray-2) tracking-wider">
                      Last Update on
                    </p>
                    <p className="md:text-sm text-xs font-normal text-black">
                      {project.lastUpdate}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h4 className="md:text-base text-sm font-semibold text-black">
                  Attachments & Drawings
                </h4>
                <div className="grid xl:grid-cols-3 lg:grid-cols-2 grid-cols-1 gap-4 justify-between">
                  {project.drawings.map((drawing) => (
                    <DrawingCard
                      key={drawing.id}
                      drawing={drawing}
                      onView={() => onViewDrawing(drawing, project)}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <ViewDrawingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        drawing={selectedDrawing}
        projectInfo={selectedProjectInfo}
        onSendMessage={() => {
          setIsModalOpen(false);
          setIsSuccessModalOpen(true);
          setModalTitle("Comment Sent Successfully");
        }}
      />
      
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title={modalTitle}
      />
    </div>
  );
};

export default ProjectsDrawingsList;
