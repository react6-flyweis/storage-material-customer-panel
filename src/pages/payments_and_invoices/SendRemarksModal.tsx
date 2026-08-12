import { useState } from "react";
import Modal from "@/components/common_components/Modal";
import SuccessModalCheckIcon from "@/assets/SuccessModalCheckIcon.svg";

interface SendRemarksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess?: (remark: string) => void;
}

export default function SendRemarksModal({
  isOpen,
  onClose,
  onSubmitSuccess,
}: SendRemarksModalProps) {
  const [remarkText, setRemarkText] = useState("");
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const handleSubmit = () => {
    onClose();
    if (onSubmitSuccess) {
      onSubmitSuccess(remarkText);
    }
    setRemarkText("");
    setIsSuccessModalOpen(true);
  };

  const handleCloseSuccess = () => {
    setIsSuccessModalOpen(false);
  };

  return (
    <>
      {/* Send Remarks Dialog */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        showHeader={false}
        width="max-w-[480px]"
        customPadding="p-6"
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Send Remarks</h2>
          <p className="mt-1 text-sm text-[#717680]">Share your remarks</p>

          <div className="mt-5">
            <textarea
              rows={5}
              value={remarkText}
              onChange={(e) => setRemarkText(e.target.value)}
              placeholder="Please reduce the material cost and revise transportation charges."
              className="w-full rounded-xl border border-[#D0D5DD] p-3.5 text-xs text-gray-800 placeholder-[#101828] outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
            />
          </div>

          <div className="mt-6 flex justify-center">
            <button
              onClick={handleSubmit}
              className="w-full max-w-[240px] rounded-xl bg-[#E12929] py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#C92222] transition-colors"
            >
              Send Revision Request
            </button>
          </div>
        </div>
      </Modal>

      {/* Remark Submitted Success Dialog */}
      <Modal
        isOpen={isSuccessModalOpen}
        onClose={handleCloseSuccess}
        showHeader={false}
        width="max-w-[420px]"
        customPadding="p-6"
      >
        <div className="text-center py-2">
          <h2 className="text-2xl font-bold text-gray-900">Remark Submitted</h2>
          <p className="mt-1.5 text-base text-[#717680]">We will Update you soon</p>

          <div className="my-6 flex justify-center">
            <img
              src={SuccessModalCheckIcon}
              alt="Success Check"
              className="h-20 w-20 object-contain"
            />
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleCloseSuccess}
              className="w-full max-w-[240px] rounded-xl bg-[#3B52E8] py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#2F42C7] transition-colors"
            >
              Ok
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
