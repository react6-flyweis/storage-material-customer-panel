import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  MoveLeft, Download,
  Eye,
  FileText,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import TitleSubtitle from "@/components/common_components/TitleSubtitle";
import CustomSelect from "@/components/common_components/CustomSelect";
import ViewDrawingModal from "@/components/drawings_and_documents/ViewDrawingModal";
import { useGetProjectDrawingsQuery } from "@/redux/api/projectsApi";

const getStatusDetails = (status: string) => {
  switch (status?.toLowerCase()) {
    case "approved":
      return {
        label: "Approved",
        colorClass: "bg-[#D1FADF] text-[#16A34A]",
      };
    case "revision required":
    case "revision_required":
    case "rejected":
      return {
        label: "Revision Required",
        colorClass: "bg-[#FEE2E2] text-[#EF4444]",
      };
    case "pending":
    case "pending review":
    case "pending_review":
    default:
      return {
        label: "Pending Review",
        colorClass: "bg-[#FEF3C7] text-[#EAB308]",
      };
  }
};

const isImageFile = (url: string) => {
  if (!url) return false;
  return /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(url);
};

const formatBytes = (bytes: number, decimals = 2) => {
  if (!bytes) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

const ProjectDrawingPage = () => {
  const { id } = useParams()


  const navigate = useNavigate();
  const [status, setStatus] = useState("All");
  const [selectedDrawing, setSelectedDrawing] = useState<any | null>(null);
  const [selectedProjectInfo, setSelectedProjectInfo] =
    useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading } = useGetProjectDrawingsQuery(id || "", {
    skip: !id,
  });

  const drawingsList = data?.drawings || [];

  const filteredDrawings = drawingsList.filter((drawing) => {
    if (!status || status === "All") return true;
    const mappedStatus = getStatusDetails(drawing.status).label;
    return mappedStatus.toLowerCase() === status.toLowerCase();
  });

  const drawingFiles = filteredDrawings.filter((d) => !isImageFile(d.fileUrl));
  const buildingPhotos = filteredDrawings.filter((d) => isImageFile(d.fileUrl));

  const onViewDrawing = (drawing: any) => {
    const statusInfo = getStatusDetails(drawing.status);
    const projectData = {
      projectName: drawing.name,
      projectCode: id,
      siteLocation: "-",
      uploadedBy: drawing.uploadedBy?.name || "N/A",
      lastUpdate: drawing.updatedAt ? new Date(drawing.updatedAt).toLocaleDateString() : "-",
    };
    setSelectedDrawing({
      ...drawing,
      status: statusInfo.label,
      statusColor: statusInfo.colorClass,
    });
    setSelectedProjectInfo(projectData);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#2563EB]" />
      </div>
    );
  }

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
        <TitleSubtitle title="Project Drawings" subtitle="" />
        <CustomSelect
          className="h-10 min-w-[180px]"
          placeholder="Status"
          value={status}
          onChange={setStatus}
          options={[
            "All",
            "Pending Review",
            "Approved",
            "Revision Required",
          ]}
        />
      </div>
      <div className="rounded-lg border border-[#D0D5DD] bg-white p-5">
        <div>
          <h2 className="mb-5 text-[16px] font-bold text-[#101828]">
            Attached Drawings
          </h2>

          {drawingFiles.length === 0 ? (
            <p className="text-sm text-[#667085] pb-5">No drawings found.</p>
          ) : (
            <div className="grid gap-4 lg:grid-cols-3">
              {drawingFiles.map((file) => {
                const statusInfo = getStatusDetails(file.status);
                return (
                  <div
                    key={file._id}
                    className="relative rounded-lg border border-[#EAECF0] bg-white p-3 shadow-sm mt-3"
                  >
                    <span
                      className={`absolute right-4 top-[-14px] rounded-full px-3 py-0.5 text-[12px] font-medium ${statusInfo.colorClass}`}
                    >
                      {statusInfo.label}
                    </span>

                    <div className="flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-2">
                        <FileText
                          size={36}
                          className="text-[#F04478] min-w-9"
                        />

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[14px] font-semibold text-[#101828]" title={file.name}>
                            {file.name}
                          </p>

                          <p className=" text-[14px] text-[#667085]">
                            {formatBytes(file.fileSize)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {file.fileUrl && (
                          <a href={file.fileUrl} target="_blank" rel="noopener noreferrer" download>
                            <Download
                              size={16}
                              className="text-[#101828]"
                            />
                          </a>
                        )}

                        <button onClick={() => onViewDrawing(file)}>
                          <Eye
                            size={16}
                            className="text-[#2563EB]"
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-10">
          <h2 className="mb-5 text-[16px] font-bold text-[#101828]">
            Attached Building Photos
          </h2>

          {buildingPhotos.length === 0 ? (
            <p className="text-sm text-[#667085]">No building photos found.</p>
          ) : (
            <div className="grid gap-4 lg:grid-cols-3">
              {buildingPhotos.map((file) => {
                const statusInfo = getStatusDetails(file.status);
                return (
                  <div
                    key={file._id}
                    className="relative rounded-lg border border-[#EAECF0] bg-white p-3 shadow-sm mt-3"
                  >
                    <span
                      className={`absolute right-4 top-[-14px] rounded-full px-3 py-0.5 text-[12px] font-medium ${statusInfo.colorClass}`}
                    >
                      {statusInfo.label}
                    </span>

                    <div className="flex items-center justify-between gap-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <img
                          src={file.fileUrl}
                          alt={file.name}
                          className="h-[50px] w-[50px] rounded object-cover"
                        />

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[14px] font-semibold text-[#101828]" title={file.name}>
                            {file.name}
                          </p>

                          <p className="mt-1 text-[14px] text-[#667085]">
                            {formatBytes(file.fileSize)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {file.fileUrl && (
                          <a href={file.fileUrl} target="_blank" rel="noopener noreferrer" download>
                            <Download
                              size={16}
                              className="text-[#101828]"
                            />
                          </a>
                        )}

                        <button onClick={() => onViewDrawing(file)}>
                          <Eye
                            size={16}
                            className="text-[#2563EB]"
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <ViewDrawingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        drawing={selectedDrawing}
        projectInfo={selectedProjectInfo}
        onSendMessage={() => {
          setIsModalOpen(false);
        }}
      />
    </div>
  );
};

export default ProjectDrawingPage;
