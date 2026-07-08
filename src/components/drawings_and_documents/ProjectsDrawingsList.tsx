import { ArrowDown, Eye } from "lucide-react";
import { projectDrawingsMockData } from "@/data/ProjectDrawingsData";
import type { Drawing, ProjectWithDrawings } from "@/data/ProjectDrawingsData";
import { cn } from "@/lib/utils";
import PinkFileIcon from "@/assets/icon/PinkFileIcon.svg";
import { useState } from "react";
import ViewDrawingModal from "./ViewDrawingModal";
import DrawingPlanImg from "../../assets/DrawingPlanImg.svg";
import SuccessModal from "../common_components/SuccessModal";

const StatusPill = ({ status }: { status: Drawing["status"] }) => {
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
  drawing: Drawing;
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
            <a href={DrawingPlanImg} download="dashboard-image.png">
              <ArrowDown className="h-4 w-4 text-[#333333] cursor-pointer" />
            </a>
            <Eye
              className="h-4 w-4 text-[#1D51A4] cursor-pointer"
              onClick={onView}
            />
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-2">
          <a href={DrawingPlanImg} download="dashboard-image.png">
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
  const [selectedDrawing, setSelectedDrawing] = useState<Drawing | null>(null);
  const [selectedProjectInfo, setSelectedProjectInfo] =
    useState<ProjectWithDrawings | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");

  const onViewDrawing = (drawing: Drawing, project: ProjectWithDrawings) => {
    setSelectedDrawing(drawing);
    setSelectedProjectInfo(project);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100/50 overflow-hidden">
      <div className="md:p-6 p-4 border-b border-gray-300">
        <h2 className="md:text-xl text-lg font-semibold text-(--text-color-black) font-inter">
          Projects & Drawings
        </h2>
      </div>

      <div className="md:p-6 p-4 space-y-8">
        {projectDrawingsMockData.map((project, index) => (
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
        ))}
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
