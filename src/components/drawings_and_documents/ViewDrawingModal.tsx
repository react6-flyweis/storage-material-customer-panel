import React, { useState } from "react";
import { X, ArrowDown, Paperclip, Loader2 } from "lucide-react";
import DrawingPlanImg from "../../assets/DrawingPlanImg.svg";
import Modal from "../common_components/Modal";
import { Button } from "../ui/button";
import {
  useUpdateDrawingStatusMutation,
  useApproveDrawingMutation,
  useRequestDrawingRevisionMutation,
} from "@/redux/api/projectsApi";

interface ViewDrawingModalProps {
  isOpen: boolean;
  onClose: () => void;
  drawing: any | null;
  projectInfo: {
    projectName: string;
    projectCode: string;
    siteLocation: string;
    uploadedBy: string;
    lastUpdate: string;
  } | null;
  onSendMessage: () => void;
}

const ViewDrawingModal: React.FC<ViewDrawingModalProps> = ({
  isOpen,
  onClose,
  drawing,
  projectInfo,
  onSendMessage,
}) => {
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [reasonError, setReasonError] = useState("");
  const [comment, setComment] = useState("");

  const [updateDrawingStatus, { isLoading: isSendingComment }] = useUpdateDrawingStatusMutation();
  const [approveDrawing, { isLoading: isApproving }] = useApproveDrawingMutation();
  const [requestDrawingRevision, { isLoading: isRequestingRevision }] = useRequestDrawingRevisionMutation();

  const isUpdating = isSendingComment || isApproving || isRequestingRevision;

  const handleCancelProject = async () => {
    if (!cancelReason.trim()) {
      setReasonError("Please enter revision");
      return;
    }
    const drawingId = drawing?._id || drawing?.id;
    const leadId = drawing?.leadId || projectInfo?.projectCode;
    if (!leadId || !drawingId) return;

    try {
      await requestDrawingRevision({
        leadId,
        drawingId,
        note: cancelReason,
      }).unwrap();
      setReasonError("");
      setCancelReason("");
      setIsCancelModalOpen(false);
      onClose();
    } catch (err) {
      console.error("Failed to request revision:", err);
    }
  };

  const handleApprove = async () => {
    const drawingId = drawing?._id || drawing?.id;
    const leadId = drawing?.leadId || projectInfo?.projectCode;
    if (!leadId || !drawingId) return;

    try {
      await approveDrawing({
        leadId,
        drawingId,
      }).unwrap();
      onClose();
    } catch (err) {
      console.error("Failed to approve drawing:", err);
    }
  };

  const handleSendComment = async () => {
    if (!comment.trim()) return;
    const drawingId = drawing?._id || drawing?.id;
    const leadId = drawing?.leadId || projectInfo?.projectCode;
    if (!leadId || !drawingId) return;

    try {
      await updateDrawingStatus({
        leadId,
        drawingId,
        status: drawing?.status || "pending",
        notes: comment,
      }).unwrap();
      setComment("");
      onClose();
      onSendMessage();
    } catch (err) {
      console.error("Failed to send comment:", err);
    }
  };
  
  if (!drawing || !projectInfo) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      showHeader={false}
      customPadding="p-0"
      width="max-w-4xl"
    >
      <div className="bg-white rounded-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-4 py-4 lg:px-6 lg:py-6 flex items-start justify-between bg-white sticky top-0 z-10">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
            <div>
              <h2 className="xl:text-xl text-base font-semibold text-black leading-tight w-[240px] overflow-hidden whitespace-nowrap text-ellipsis">
                {drawing.name}
              </h2>
              <p className="text-sm text-(-text-color-gray-2) font-normal">
                {projectInfo?.projectCode}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
              <div>
                <p className="text-sm text-black font-normal tracking-wider">
                  Pune,
                </p>
                <p className="text-sm font-normal text-black">Maharashtra</p>
              </div>
              <div>
                <p className="text-sm text-black font-normal tracking-wider">
                  Uploaded By:
                </p>
                <p className="text-sm font-normal text-black">
                  {projectInfo?.uploadedBy}
                </p>
              </div>
              <div>
                <p className="text-xs text-(--text-color-gray-2) font-normal tracking-wider">
                  Received on
                </p>
                <p className="text-sm font-normal text-black">
                  {projectInfo?.lastUpdate}
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors group ml-4"
          >
            <X className="w-6 h-6 text-black group-hover:text-gray-900" />
          </button>
        </div>

        {/* Content - Image Area */}
        <div className="flex-1 overflow-y-auto flex items-center justify-center min-h-[300px]">
          <div className="relative w-full h-full max-w-3xl shadow-sm  rounded-lg overflow-hidden p-0">
            {/* Large Mock Drawing Image */}
            <div className="w-full aspect-4/3rounded flex items-center justify-center relative group">
              <img
                src={drawing.fileUrl || DrawingPlanImg}
                alt="Drawing Plan"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>

        {/* Footer - Conditional UI */}
        <div className="p-6 mt-2 border-t border-gray-300 bg-white">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <button className="flex items-center gap-2 md:px-4 px-2 py-1 bg-[#9CA3AF] hover:bg-[#E2E8F0] text-white rounded-full md:text-base text-sm font-medium transition-all">
              <a href={drawing.fileUrl || DrawingPlanImg} download target="_blank" rel="noopener noreferrer" className="flex flex-wrap items-center gap-2">
              <ArrowDown className="md:w-5 md:h-5 w-4 h-4" />
              Download
              </a>
            </button>

            <div className="flex items-center gap-3 ml-auto flex-wrap">
              {drawing.status === "Approved" ? (
                <div className="flex items-center gap-2">
                  <p className="text-black text-sm font-normal">
                    {drawing.updatedAt ? new Date(drawing.updatedAt).toLocaleDateString() : ""}
                  </p>
                  <span className="px-5 py-1.5 bg-[#DCFCE7] text-[#16A34A] rounded-full text-sm font-medium border border-[#BBF7D0]">
                    Approved
                  </span>
                </div>
              ) : drawing.status === "Revision Required" ? (
                <span className="px-5 py-1.5 bg-[#FFF7ED] text-[#FF9409] rounded-full text-sm font-medium border border-[#FFEDD5]">
                  Sent for Revision
                </span>
              ) : (
                <>
                  <button
                    onClick={() => setIsCancelModalOpen(true)}
                    disabled={isUpdating}
                    className="px-5 py-1.5 bg-[#FF9409] text-white rounded-full text-sm font-medium shadow-sm shadow-orange-100 disabled:opacity-50"
                  >
                    Revision Required
                  </button>
                  <button
                    onClick={handleApprove}
                    disabled={isUpdating}
                    className="px-5 py-1.5 bg-[#3AB449] text-white rounded-full text-sm font-normal shadow-sm shadow-green-100 disabled:opacity-50 flex items-center gap-1"
                  >
                    {isUpdating && <Loader2 className="h-3 w-3 animate-spin" />}
                    Approve
                  </button>
                </>
              )}
            </div>
          </div>

          <Modal
            isOpen={isCancelModalOpen}
            onClose={() => {
              setIsCancelModalOpen(false);
              setCancelReason("");
              setReasonError("");
            }}
            showHeader={false}
            width="max-w-[520px]"
            customPadding="p-0"
          >
            <div className="rounded-lg bg-white px-5 py-8">
              <h2 className="text-center text-[32px] font-bold text-[#101828]">
                Revision Needed
              </h2>

              <div className="mt-10">
                <label className="mb-4 block text-[18px] font-medium text-[#101828]">
                  Please add what revision you want
                </label>

                <textarea
                  value={cancelReason}
                  onChange={(e) => {
                    setCancelReason(e.target.value);
                    if (reasonError) setReasonError("");
                  }}
                  placeholder="Write your revision"
                  rows={5}
                  className={`w-full resize-none rounded-lg border p-4 text-[16px] outline-none ${
                    reasonError ? "border-red-500" : "border-[#D0D5DD]"
                  }`}
                />

                {reasonError && (
                  <p className="mt-2 text-sm text-red-500">{reasonError}</p>
                )}
              </div>

              <div className="mt-10 flex justify-center">
                <button
                  onClick={handleCancelProject}
                  disabled={isUpdating}
                  className="h-[48px] w-full rounded-lg bg-[linear-gradient(90deg,#2563EB_0%,#4F46E5_100%)] text-base font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isUpdating && <Loader2 className="h-5 w-5 animate-spin" />}
                  Submit
                </button>
              </div>
            </div>
          </Modal>

          {drawing.status === "Pending Review" && (
            <div className="mt-6 flex items-center gap-2 border border-gray-200 rounded-xl p-2 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Type your Comment..."
                className="flex-1 px-3 py-2 text-sm text-gray-600 outline-none"
              />
              <button className="p-2 text-[#00000080] hover:text-gray-600">
                <Paperclip className="w-5 h-5 -rotate-5" />
              </button>
              <Button
                onClick={handleSendComment}
                disabled={isUpdating || !comment.trim()}
                className="text-sm font-normal bg-[linear-gradient(90deg,#2563EB_0%,#4F46E5_100%)] hover:bg-blue-700 text-white rounded-lg flex items-center md:gap-2 gap-1 md:px-6 px-3 py-3 h-auto disabled:opacity-50"
              >
                {isUpdating && <Loader2 className="h-4 w-4 animate-spin" />}
                Send Comment
              </Button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ViewDrawingModal;
