import React from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Modal from "@/components/common_components/Modal";

export interface ImageItem {
  id: string;
  url: string;
  title: string;
  date: string;
  building: string;
}

interface ImageViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: ImageItem[];
  currentIndex: number;
  onSelectIndex: (index: number) => void;
}

const ImageViewerModal: React.FC<ImageViewerModalProps> = ({
  isOpen,
  onClose,
  images,
  currentIndex,
  onSelectIndex,
}) => {
  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex] || images[0];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectIndex((currentIndex - 1 + images.length) % images.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectIndex((currentIndex + 1) % images.length);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      showHeader={false}
      width="max-w-2xl"
      customPadding="p-0"
    >
      <div className="bg-white rounded-2xl p-4 sm:p-5 space-y-3 relative flex flex-col">
        {/* Header row with date & close button */}
        <div className="flex items-center justify-between">
          <span className="text-sm sm:text-base font-medium text-[#667085]">
            {currentImage.date}
          </span>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main image preview container with left/right carousel arrows */}
        <div className="relative overflow-hidden rounded-xl bg-slate-900 h-[320px] sm:h-[400px] w-full flex items-center justify-center">
          <img
            src={currentImage.url}
            alt={currentImage.title}
            className="w-full h-full object-contain"
          />

          {images.length > 1 && (
            <>
              {/* Previous Button */}
              <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center text-slate-800 hover:bg-white transition-all hover:scale-105"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Next Button */}
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center text-slate-800 hover:bg-white transition-all hover:scale-105"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ImageViewerModal;
