import React, { useState, useMemo } from "react";
import { Image as ImageIcon, Video, Play, Loader2 } from "lucide-react";
import {
  useGetProjectMediaQuery,
  type ProjectMediaDocument,
} from "@/redux/api/projectsApi";

import ImageViewerModal, { type ImageItem } from "./ImageViewerModal";

interface ProjectImagesProps {
  leadId: string;
  projectName?: string;
}

type MediaTypeFilter = "all" | "photo" | "video";

const ProjectImages: React.FC<ProjectImagesProps> = ({ leadId, projectName }) => {
  const [mediaType, setMediaType] = useState<MediaTypeFilter>("all");
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  const { data: mediaData, isLoading, isFetching } = useGetProjectMediaQuery(
    {
      leadId,
      type: mediaType === "all" ? undefined : mediaType,
    },
    { skip: !leadId }
  );

  // Extract, deduplicate, and process media items
  const mediaItems: ImageItem[] = useMemo(() => {
    if (!mediaData) return [];

    const rawList: ProjectMediaDocument[] = [];
    if (Array.isArray(mediaData.documents)) {
      rawList.push(...mediaData.documents);
    }
    if (Array.isArray(mediaData.photos)) {
      rawList.push(...mediaData.photos);
    }
    if (Array.isArray(mediaData.videos)) {
      rawList.push(...mediaData.videos);
    }

    // Deduplicate by _id or url
    const seen = new Set<string>();
    const uniqueDocs: ProjectMediaDocument[] = [];
    for (const doc of rawList) {
      const key = doc._id || doc.url;
      if (key && !seen.has(key)) {
        seen.add(key);
        uniqueDocs.push(doc);
      } else if (!key) {
        uniqueDocs.push(doc);
      }
    }

    // Fallback filter if API returned all documents despite query param
    const filteredDocs = uniqueDocs.filter((doc) => {
      if (mediaType === "all") return true;
      if (doc.type) return doc.type.toLowerCase() === mediaType;
      const isVideo = /\.(mp4|webm|mov|ogg)$/i.test(doc.url || "");
      return mediaType === "video" ? isVideo : !isVideo;
    });

    return filteredDocs.map((item) => {
      const formattedDate = item.uploadedAt
        ? new Date(item.uploadedAt).toLocaleString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })
        : "N/A";

      const uploader =
        typeof item.uploadedBy === "object" && item.uploadedBy !== null
          ? [item.uploadedBy.name, item.uploadedBy.role].filter(Boolean).join(" • ")
          : typeof item.uploadedBy === "string"
          ? item.uploadedBy
          : undefined;

      const isVideo =
        item.type === "video" || /\.(mp4|webm|mov|ogg)$/i.test(item.url || "");

      return {
        id: item._id,
        url: item.url,
        title: item.name || (isVideo ? "Site Video" : "Site Photo"),
        date: formattedDate,
        building: item.building || item.buildingLabel || "",
        type: isVideo ? "video" : "photo",
        uploadedBy: uploader,
      };
    });
  }, [mediaData, mediaType]);

  const handleOpenViewer = (index: number) => {
    setViewerIndex(index);
    setIsViewerOpen(true);
  };

  const displayProjectName =
    mediaData?.projectName || projectName || "Project Media";
  const allCount = mediaData?.total ?? (mediaData?.documents?.length || mediaItems.length);
  const photoCount = mediaData?.photoCount;
  const videoCount = mediaData?.videoCount;

  return (
    <div className="space-y-6">
      {/* Header section with project title and media filter tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#101828]">
            {displayProjectName}
          </h2>
          {mediaData?.projectId && (
            <p className="text-xs text-[#667085] mt-0.5">
              Project ID: {mediaData.projectId}
            </p>
          )}
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-2 bg-slate-100/80 p-1 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => setMediaType("all")}
            className={`px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all ${
              mediaType === "all"
                ? "bg-white text-[#2563EB] shadow-xs font-semibold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            All {allCount !== undefined && `(${allCount})`}
          </button>
          <button
            type="button"
            onClick={() => setMediaType("photo")}
            className={`px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all ${
              mediaType === "photo"
                ? "bg-white text-[#2563EB] shadow-xs font-semibold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Photos {photoCount !== undefined && `(${photoCount})`}
          </button>
          <button
            type="button"
            onClick={() => setMediaType("video")}
            className={`px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all ${
              mediaType === "video"
                ? "bg-white text-[#2563EB] shadow-xs font-semibold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Videos {videoCount !== undefined && `(${videoCount})`}
          </button>
        </div>
      </div>

      {/* Main card section containing media grid */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-xs">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div
                key={idx}
                className="border border-slate-200/80 rounded-2xl p-3.5 bg-slate-50 space-y-3"
              >
                <div className="w-full h-48 sm:h-52 bg-slate-200 rounded-xl" />
                <div className="h-4 bg-slate-200 rounded w-1/2" />
                <div className="h-3 bg-slate-200 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : mediaItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
              {mediaType === "video" ? (
                <Video className="w-6 h-6" />
              ) : (
                <ImageIcon className="w-6 h-6" />
              )}
            </div>
            <p className="text-base font-semibold text-slate-700">
              No project {mediaType === "all" ? "media" : mediaType === "photo" ? "photos" : "videos"} found
            </p>
            <p className="text-sm text-slate-500 max-w-sm">
              There are currently no {mediaType === "all" ? "photos or videos" : mediaType === "photo" ? "photos" : "videos"} uploaded for this project.
            </p>
          </div>
        ) : (
          <div className="relative">
            {isFetching && (
              <div className="absolute top-2 right-2 z-10 bg-white/90 px-2 py-1 rounded-md shadow-xs text-xs text-blue-600 flex items-center gap-1.5">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Updating...
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {mediaItems.map((item, index) => (
                <div
                  key={item.id}
                  onClick={() => handleOpenViewer(index)}
                  className="group border border-[#EAECF0] rounded-2xl p-3.5 bg-white transition-all duration-200 hover:shadow-md hover:border-blue-200 cursor-pointer flex flex-col justify-between"
                >
                  <div className="overflow-hidden rounded-xl bg-slate-100 aspect-4/3 relative flex items-center justify-center">
                    {item.type === "video" ? (
                      <>
                        <video
                          src={item.url}
                          className="w-full h-full object-cover"
                          preload="metadata"
                        />
                        <div className="absolute inset-0 bg-black/25 flex items-center justify-center transition-all group-hover:bg-black/35">
                          <div className="w-10 h-10 rounded-full bg-white/90 text-blue-600 flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                            <Play className="w-5 h-5 fill-current ml-0.5" />
                          </div>
                        </div>
                        <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/60 text-white text-[11px] font-medium flex items-center gap-1">
                          <Video className="w-3 h-3" />
                          <span>Video</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <img
                          src={item.url}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/60 text-white text-[11px] font-medium flex items-center gap-1">
                          <ImageIcon className="w-3 h-3" />
                          <span>Photo</span>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="mt-3 px-1 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <p
                        className="text-sm font-semibold text-slate-800 truncate"
                        title={item.title}
                      >
                        {item.title}
                      </p>
                      <p className="text-xs text-[#667085] shrink-0">
                        {item.date}
                      </p>
                    </div>
                    {item.uploadedBy && (
                      <p
                        className="text-xs text-[#667085] truncate"
                        title={`Uploaded by: ${item.uploadedBy}`}
                      >
                        Uploaded by:{" "}
                        <span className="font-medium text-slate-700">
                          {item.uploadedBy}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <ImageViewerModal
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        images={mediaItems}
        currentIndex={viewerIndex}
        onSelectIndex={setViewerIndex}
      />
    </div>
  );
};

export default ProjectImages;
