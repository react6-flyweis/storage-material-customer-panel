import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MoveLeft,  Download,
  Eye,
  FileText, } from "lucide-react";
import { Button } from "@/components/ui/button";
import TitleSubtitle from "@/components/common_components/TitleSubtitle";
import CustomSelect from "@/components/common_components/CustomSelect";
import ViewDrawingModal from "@/components/drawings_and_documents/ViewDrawingModal";
import { myProjectsData } from "@/data/text/MyProjectsData";

const drawingFiles = [
  {
    id: 1,
    name: "Architectural Plans.pdf",
    size: "15.2 MB",
    status: "Pending Review",
    statusColor:
      "bg-[#FEF3C7] text-[#EAB308]",
    type: "file",
  },
  {
    id: 2,
    name: "Structural Drawings.dwg",
    size: "15.2 MB",
    status: "Approved",
    statusColor:
      "bg-[#D1FADF] text-[#16A34A]",
    type: "file",
  },
  {
    id: 3,
    name: "Specifications.docx",
    size: "15.2 MB",
    status: "Revision Required",
    statusColor:
      "bg-[#FEE2E2] text-[#EF4444]",
    type: "file",
  },
];

const buildingPhotos = [
  {
    id: 1,
    name: "Architectural Plans.pdf",
    size: "15.2 MB",
    status: "Pending Review",
    statusColor:
      "bg-[#FEF3C7] text-[#EAB308]",
    image:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=300",
  },
  {
    id: 2,
    name: "Structural Building.dwg",
    size: "15.2 MB",
    status: "Approved",
    statusColor:
      "bg-[#D1FADF] text-[#16A34A]",
    image:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=300",
  },
  {
    id: 3,
    name: "Specifications.docx",
    size: "15.2 MB",
    status: "Revision Required",
    statusColor:
      "bg-[#FEE2E2] text-[#EF4444]",
    image:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=300",
  },
];

const ProjectDrawingPage = () => {
    const location=useLocation();
  const id=location?.pathname?.split("/")?.filter(Boolean)?.[1]

  const navigate = useNavigate();
  const [status, setStatus] = useState("");
 const [selectedDrawing, setSelectedDrawing] = useState<any | null>(null);
  const [selectedProjectInfo, setSelectedProjectInfo] =
    useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
 const onViewDrawing = (drawing: any) => {
  const projectData=myProjectsData?.find((i)=>i.projectCode===id)
    setSelectedDrawing(drawing);
    setSelectedProjectInfo(projectData);
    setIsModalOpen(true);
  };
  console.log(isModalOpen)

  return (
    <div className="p-5 space-y-6">
      <div className="flex items-center flex-wrap justify-between gap-2">
        <Button
          onClick={() => navigate(-1)}
          className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white xl:px-4 xl:py-2 xl:text-sm text-xs flex items-center gap-2 rounded-md"
        >
          <MoveLeft className="h-4 w-4" />
          Back
        </Button>
      </div>
      <div className="flex items-center justify-between gap-3">
        <TitleSubtitle title="Project 1 - Drawings" subtitle="" />
              <CustomSelect
          className="h-10 min-w-[150px]"
          placeholder="Status"
          value={status}
          onChange={setStatus}
          options={[
            "All",
            "Active",
            "Critical",
            "Stable",
            "Discharged",
            "inactive",
          ]}
        />
      </div>
    <div className="rounded-lg border border-[#D0D5DD] bg-white p-5">
      <div>
        <h2 className="mb-5 text-[16px] font-bold text-[#101828]">
          Attached Drawings
        </h2>

        <div className="grid gap-4 lg:grid-cols-3">
          {drawingFiles.map((file) => (
            <div
              key={file.id}
              className="relative rounded-lg border border-[#EAECF0] bg-white p-3 shadow-sm"
            >
              <span
                className={`absolute right-4 top-[-14px] rounded-full px-3 py-0.5 text-[12px] font-medium ${file.statusColor}`}
              >
                {file.status}
              </span>

              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                  <FileText
                    size={36}
                    className="text-[#F04478] min-w-9"
                  />

                  <div>
                    <p className="truncate text-[14px] font-semibold text-[#101828]">
                      {file.name}
                    </p>

                    <p className=" text-[14px] text-[#667085]">
                      {file.size}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button>
                    <Download
                      size={16}
                      className="text-[#101828]"
                    />
                  </button>

                  <button onClick={()=>onViewDrawing(file)}>
                    <Eye
                      size={16}
                      className="text-[#2563EB]"
                      
                    />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10">
        <h2 className="mb-5 text-[16px] font-bold text-[#101828]">
          Attached Building Photos
        </h2>

        <div className="grid gap-4 lg:grid-cols-3">
          {buildingPhotos.map((file) => (
            <div
              key={file.id}
              className="relative rounded-lg border border-[#EAECF0] bg-white p-3 shadow-sm"
            >
              <span
                className={`absolute right-4 top-[-14px] rounded-full px-3 py-0.5 text-[12px] font-medium ${file.statusColor}`}
              >
                {file.status}
              </span>

              <div className="flex items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <img
                    src={file.image}
                    alt={file.name}
                    className="h-[50px] w-[50px] rounded object-cover"
                  />

                  <div>
                    <p className="truncate text-[14px] font-semibold text-[#101828]">
                      {file.name}
                    </p>

                    <p className="mt-1 text-[14px] text-[#667085]">
                      {file.size}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button>
                    <Download
                      size={16}
                      className="text-[#101828]"
                    />
                  </button>

                  <button onClick={()=>onViewDrawing(file)}>
                    <Eye
                      size={16}
                      className="text-[#2563EB]"
                    />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
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
    </div>
  );
};

export default ProjectDrawingPage;
