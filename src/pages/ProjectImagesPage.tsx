import React, { useState } from "react";
import { MoveLeft, ChevronDown, Calendar, Image as ImageIcon, Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useGetBuildingDrawingsQuery } from "@/redux/api/drawingsApi";
import { useGetProjectDetailsQuery } from "@/redux/api/projectsApi";

import ImageViewerModal from "@/components/my_projects/ImageViewerModal";

interface ImageItem {
  id: string;
  url: string;
  title: string;
  date: string;
  building: string;
}

const ProjectImagesPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const leadId = id || "";

  const [selectedDate] = useState<string>("Select Date");
  const [selectedBuilding] = useState<string>("Building 1");

  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  const { data: projectDetails } = useGetProjectDetailsQuery(leadId, {
    skip: !leadId,
  });

  const { data: buildingData, isLoading } = useGetBuildingDrawingsQuery(
    { leadId, building: selectedBuilding },
    { skip: !leadId }
  );

  const projectName = projectDetails?.lead?.projectName || "Project";

  // Filter photos from API if available
  const apiPhotos: ImageItem[] = [];
  if (buildingData) {
    const drawingsAndDocs = [...(buildingData.drawings || []), ...(buildingData.documents || [])];
    drawingsAndDocs.forEach((item) => {
      if (
        item.category === "photo" ||
        item.fileType?.includes("image") ||
        /\.(jpg|jpeg|png|webp|gif)$/i.test(item.fileUrl || "")
      ) {
        const formattedDate = item.createdAt
          ? new Date(item.createdAt).toLocaleString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })
          : "N/A";

        apiPhotos.push({
          id: item._id,
          url: item.fileUrl,
          title: item.name || "Project Image",
          date: formattedDate,
          building: item.buildingLabel || selectedBuilding,
        });
      }
    });
  }

  const displayImages = apiPhotos;

  const handleOpenViewer = (index: number) => {
    setViewerIndex(index);
    setIsViewerOpen(true);
  };

  return (
    <div className="p-5 space-y-6">
      {/* Top Header Row with Back Button */}
      <div className="flex items-center gap-4">
        <Button
          onClick={() => navigate(-1)}
          className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white xl:px-4 xl:py-2 xl:text-sm text-xs flex items-center gap-2 rounded-md"
        >
          <MoveLeft className="h-4 w-4" />
          Back
        </Button>
        <h1 className="text-2xl font-bold text-[#101828]">
          {projectName} - Project Images
        </h1>
      </div>

      {/* Building Title & Select Date Filter Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
        <h2 className="text-xl font-bold text-[#101828]">{selectedBuilding}</h2>

        <div className="relative">
          <div className="flex items-center gap-2 px-3.5 py-2 bg-white border border-[#D0D5DD] rounded-lg shadow-2xs text-sm font-medium text-[#344054] cursor-pointer hover:bg-slate-50 transition-colors">
            <Calendar className="w-4 h-4 text-[#667085]" />
            <span>{selectedDate}</span>
            <ChevronDown className="w-4 h-4 text-[#667085] ml-1" />
          </div>
        </div>
      </div>

      {/* Main card section containing image grid */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-xs">
        {isLoading ? (
          <div className="flex h-[300px] w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-[#2563EB]" />
          </div>
        ) : displayImages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
              <ImageIcon className="w-6 h-6" />
            </div>
            <p className="text-base font-medium text-slate-700">No project images found</p>
            <p className="text-sm text-slate-500 max-w-sm">
              There are currently no photos uploaded for this building.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayImages.map((image, index) => (
              <div
                key={image.id}
                onClick={() => handleOpenViewer(index)}
                className="group border border-[#EAECF0] rounded-2xl p-3.5 bg-white transition-all duration-200 hover:shadow-md hover:border-blue-200 cursor-pointer"
              >
                <div className="overflow-hidden rounded-xl bg-slate-100 aspect-4/3 relative">
                  <img
                    src={image.url}
                    alt={image.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="mt-3 px-1">
                  <p className="text-sm font-medium text-[#667085]">{image.date}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ImageViewerModal
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        images={displayImages}
        currentIndex={viewerIndex}
        onSelectIndex={setViewerIndex}
      />
    </div>
  );
};

export default ProjectImagesPage;
