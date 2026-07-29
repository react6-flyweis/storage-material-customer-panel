import React from "react";
import noQuotationImg from "@/assets/images/no-quotation.png";

interface NoQuotationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NoQuotationModal: React.FC<NoQuotationModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center space-y-6 shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-[#101828]">
            Quotation Not Received Yet
          </h2>
          <p className="text-lg font-medium text-[#64748B]">
            We will Update you soon
          </p>
        </div>

        <div className="flex justify-center py-2">
          <img
            src={noQuotationImg}
            alt="Quotation Not Received"
            className="w-48 h-auto object-contain"
          />
        </div>

        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-2xl bg-[#4F46E5] hover:bg-[#4338CA] text-white font-bold text-base transition-colors shadow-md cursor-pointer"
        >
          Ok
        </button>
      </div>
    </div>
  );
};

export default NoQuotationModal;
