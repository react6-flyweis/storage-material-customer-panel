import React, { useState } from "react";
import { ArrowLeft, Building2 } from "lucide-react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useGetBuildingDrawingsQuery, type BuildingDrawingItem } from "@/redux/api/drawingsApi";
import { useGetProjectDetailsQuery } from "@/redux/api/projectsApi";
import ViewDrawingModal from "@/components/drawings_and_documents/ViewDrawingModal";

const SkeletonCard: React.FC = () => (
  <div className="border border-slate-200 rounded-lg p-4 flex items-center justify-between bg-white shadow-xs animate-pulse">
    <div className="flex items-center gap-3 min-w-0 flex-1">
      <div className="w-8 h-8 rounded bg-slate-200 shrink-0" />
      <div className="space-y-2 flex-1 min-w-0">
        <div className="h-4 bg-slate-200 rounded w-3/4" />
        <div className="h-3 bg-slate-200 rounded w-1/4" />
      </div>
    </div>
    <div className="flex items-center gap-2.5 shrink-0 ml-4">
      <div className="w-4 h-4 bg-slate-200 rounded" />
      <div className="w-4 h-4 bg-slate-200 rounded" />
    </div>
  </div>
);

const SkeletonSection: React.FC<{ title: string }> = ({ title }) => (
  <div className="bg-white rounded-xl border border-slate-200 p-5 md:p-6 space-y-4">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 animate-pulse">
      <div className="space-y-2">
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        <div className="h-4 bg-slate-200 rounded w-24" />
      </div>
      <div className="flex flex-wrap items-center gap-6 sm:gap-8">
        <div className="space-y-1">
          <div className="h-3 bg-slate-200 rounded w-16" />
          <div className="h-4 bg-slate-200 rounded w-24" />
        </div>
        <div className="space-y-1">
          <div className="h-3 bg-slate-200 rounded w-16" />
          <div className="h-4 bg-slate-200 rounded w-28" />
        </div>
        <div className="space-y-1">
          <div className="h-3 bg-slate-200 rounded w-16" />
          <div className="h-4 bg-slate-200 rounded w-24" />
        </div>
      </div>
    </div>

    <div>
      <div className="h-4 bg-slate-200 rounded w-40 mb-3 animate-pulse" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  </div>
);

const ProjectBuildingDrawingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();

  const buildingNameParam = searchParams.get("building") || "Building A";
  const leadId = id || "";

  const [selectedDrawing, setSelectedDrawing] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: buildingData,
    isLoading: isBuildingLoading,
    isError: isBuildingError,
  } = useGetBuildingDrawingsQuery(
    { leadId, building: buildingNameParam },
    { skip: !leadId }
  );

  const { data: projectDetails } = useGetProjectDetailsQuery(leadId, {
    skip: !leadId,
  });

  const lead = buildingData?.project || projectDetails?.lead;
  const projectTitle = lead?.projectName?.trim() || "Project";
  const projectCode = lead?.jobId || leadId || "N/A";
  const projectLocation = lead?.location?.trim() || "Location not provided";

  const buildingLabel = buildingData?.buildingLabel || buildingNameParam;
  const drawingsList = buildingData?.drawings || [];
  const documentsList = buildingData?.documents || [];

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "0 MB";
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const handleOpenDrawing = (item: BuildingDrawingItem) => {
    setSelectedDrawing({
      _id: item._id,
      id: item._id,
      name: item.name,
      status: item.status,
      fileUrl: item.fileUrl,
      fileType: item.fileType,
      fileSize: item.fileSize,
      leadId: item.leadId || leadId,
      buildingLabel: item.buildingLabel,
      category: item.category,
      documentType: item.documentType,
      notes: item.notes,
      revisionNote: item.revisionNote,
    });
    setIsModalOpen(true);
  };

  const handleDownload = (item: BuildingDrawingItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.fileUrl) {
      window.open(item.fileUrl, "_blank", "noopener,noreferrer");
    }
  };

  const getStatusBadge = (status: string) => {
    const s = status?.toLowerCase();
    if (s === "approved") {
      return (
        <span className="absolute -top-3 right-4 bg-[#D1FADF] text-[#12B76A] text-xs font-medium px-3 py-0.5 rounded-full">
          Approved
        </span>
      );
    }
    if (s === "pending" || s === "pending review" || s === "under_review") {
      return (
        <span className="absolute -top-3 right-4 bg-[#FEF3C7] text-[#D97706] text-xs font-medium px-3 py-0.5 rounded-full">
          {s === "under_review" ? "Under Review" : "Pending Review"}
        </span>
      );
    }
    return null;
  };

  const renderFileIconOrPreview = (item: BuildingDrawingItem) => {
    const isImage =
      item.category === "photo" ||
      ["jpg", "jpeg", "png", "webp", "gif"].includes(item.fileType?.toLowerCase() || "");

    if (isImage && item.fileUrl) {
      return (
        <img
          src={item.fileUrl}
          alt={item.name}
          className="w-10 h-8 rounded object-cover shrink-0 border border-slate-200"
          onError={(e) => {
            // Fallback icon on error
            (e.target as HTMLElement).style.display = "none";
          }}
        />
      );
    }

    const firstChar = item.name ? item.name.charAt(0).toUpperCase() : "D";
    return (
      <div className="w-8 h-8 rounded bg-pink-50 text-pink-600 font-bold flex items-center justify-center text-xs shrink-0 border border-pink-100">
        {firstChar}
      </div>
    );
  };

  const getLatestUpdateDate = () => {
    const allItems = [...drawingsList, ...documentsList];
    if (allItems.length === 0) return "N/A";
    const dates = allItems
      .map((item) => item.updatedAt || item.createdAt)
      .filter(Boolean) as string[];
    if (dates.length === 0) return "N/A";
    dates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    return formatDate(dates[0]);
  };

  const getUploadedByName = () => {
    const itemWithUser = [...drawingsList, ...documentsList].find(
      (item) => item.uploadedBy?.name
    );
    return itemWithUser?.uploadedBy?.name || "Admin User";
  };

  return (
    <div className="p-4 md:p-5 max-w-[1300px] mx-auto space-y-6 font-sans">
      {/* Header section */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-4 py-2 text-xs md:text-sm font-medium flex items-center gap-2 rounded-md transition-colors shadow-xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            {projectTitle} Drawings & Documents
          </h1>
          <p className="text-sm md:text-base text-slate-500 font-normal mt-1">
            All structural, fabrication, and erection drawings and documents for{" "}
            <span className="font-semibold text-slate-700">{buildingLabel}</span>.
          </p>
        </div>
      </div>

      {isBuildingLoading ? (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-[#D0D5DD] p-6 space-y-6 shadow-xs animate-pulse">
            <div className="h-7 bg-slate-200 rounded w-48" />
            <SkeletonSection title="Drawings" />
            <SkeletonSection title="Documents" />
          </div>
        </div>
      ) : isBuildingError ? (
        <div className="text-center py-12 text-slate-500 font-medium bg-white rounded-xl border border-slate-200 shadow-xs">
          Failed to load building drawings and documents. Please try refreshing.
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-[#D0D5DD] p-6 space-y-6 shadow-xs">
            {/* Building Header */}
            <div className="flex items-center gap-3">
              <Building2 className="w-6 h-6 text-[#1D51A4]" />
              <h2 className="text-xl md:text-2xl font-bold text-slate-900">
                {buildingLabel}
              </h2>
            </div>

            {/* Drawings Section */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 md:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Drawings</h3>
                  <p className="text-xs md:text-sm text-slate-400 font-medium">
                    {projectCode}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-6 sm:gap-8 text-xs md:text-sm text-slate-600">
                  <div>
                    <span className="text-slate-400 block text-xs">Uploaded By:</span>
                    <span className="font-semibold text-slate-700">
                      {getUploadedByName()}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-xs">Location</span>
                    <span className="font-semibold text-slate-700">
                      {projectLocation}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-xs">Last Update on</span>
                    <span className="font-semibold text-slate-700">
                      {getLatestUpdateDate()}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-600 mb-3">
                  Attachments & Drawings
                </h4>
                {drawingsList.length === 0 ? (
                  <p className="text-xs md:text-sm text-slate-500 py-4 text-center border border-dashed border-slate-200 rounded-lg">
                    No drawings available for this building.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {drawingsList.map((item) => (
                      <div
                        key={item._id}
                        onClick={() => handleOpenDrawing(item)}
                        className="relative border border-slate-200 rounded-lg p-4 flex items-center justify-between bg-white shadow-xs hover:border-blue-400 hover:shadow-sm transition-all cursor-pointer"
                      >
                        {getStatusBadge(item.status)}
                        <div className="flex items-center gap-3 min-w-0 pr-2">
                          {renderFileIconOrPreview(item)}
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-slate-800 truncate">
                              {item.name}
                            </p>
                            <p className="text-xs text-slate-400">
                              {formatFileSize(item.fileSize)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2.5 text-slate-600 shrink-0 text-sm">
                          <span
                            className="hover:text-slate-900 cursor-pointer"
                            title="Download / View URL"
                            onClick={(e) => handleDownload(item, e)}
                          >
                            ↓
                          </span>
                          <span
                            className="hover:text-slate-900 cursor-pointer"
                            title="View details"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenDrawing(item);
                            }}
                          >
                            👁
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Documents Section */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 md:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Documents</h3>
                  <p className="text-xs md:text-sm text-slate-400 font-medium">
                    {projectCode}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-6 sm:gap-8 text-xs md:text-sm text-slate-600">
                  <div>
                    <span className="text-slate-400 block text-xs">Location</span>
                    <span className="font-semibold text-slate-700">
                      {projectLocation}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-xs">Last Update on</span>
                    <span className="font-semibold text-slate-700">
                      {getLatestUpdateDate()}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-600 mb-3">
                  Attachments & Documents
                </h4>
                {documentsList.length === 0 ? (
                  <p className="text-xs md:text-sm text-slate-500 py-4 text-center border border-dashed border-slate-200 rounded-lg">
                    No documents available for this building.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {documentsList.map((item) => (
                      <div
                        key={item._id}
                        onClick={() => handleOpenDrawing(item)}
                        className="relative border border-slate-200 rounded-lg p-4 flex items-center justify-between bg-white shadow-xs hover:border-blue-400 hover:shadow-sm transition-all cursor-pointer"
                      >
                        {getStatusBadge(item.status)}
                        <div className="flex items-center gap-3 min-w-0 pr-2">
                          {renderFileIconOrPreview(item)}
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-slate-800 truncate">
                              {item.name}
                            </p>
                            <p className="text-xs text-slate-400">
                              {formatFileSize(item.fileSize)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2.5 text-slate-600 shrink-0 text-sm">
                          <span
                            className="hover:text-slate-900 cursor-pointer"
                            title="Download / View URL"
                            onClick={(e) => handleDownload(item, e)}
                          >
                            ↓
                          </span>
                          <span
                            className="hover:text-slate-900 cursor-pointer"
                            title="View details"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenDrawing(item);
                            }}
                          >
                            👁
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Drawing Modal */}
      <ViewDrawingModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedDrawing(null);
        }}
        drawing={selectedDrawing}
        projectInfo={{
          projectName: projectTitle,
          projectCode: projectCode,
          siteLocation: projectLocation,
          uploadedBy: getUploadedByName(),
          lastUpdate: getLatestUpdateDate(),
        }}
        onSendMessage={() => { }}
      />
    </div>
  );
};

export default ProjectBuildingDrawingsPage;
