import React, { useState } from "react";
import { X, ArrowDown, Paperclip, Loader2 } from "lucide-react";
import DrawingPlanImg from "../../assets/DrawingPlanImg.svg";
import Modal from "../common_components/Modal";
import { Button } from "../ui/button";
import {
  useAddDrawingCommentMutation,
  useApproveDrawingMutation,
  useRequestDrawingRevisionMutation,
} from "@/redux/api/projectsApi";

interface ViewDrawingModalProps {
  isOpen: boolean;
  onClose: () => void;
  drawing: any | null;
  projectInfo: {
    leadId?: string;
    projectName: string;
    projectCode: string;
    buildingLabel?: string;
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
  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState(false);
  const [revisionReason, setRevisionReason] = useState("");
  const [reasonError, setReasonError] = useState("");
  const [comment, setComment] = useState("");

  const [addDrawingComment, { isLoading: isSendingComment }] = useAddDrawingCommentMutation();
  const [approveDrawing, { isLoading: isApproving }] = useApproveDrawingMutation();
  const [requestDrawingRevision, { isLoading: isRequestingRevision }] = useRequestDrawingRevisionMutation();

  const isUpdating = isSendingComment || isApproving || isRequestingRevision;

  const handleRequestRevision = async () => {
    if (!revisionReason.trim()) {
      setReasonError("Please enter revision");
      return;
    }
    const drawingId = drawing?._id || drawing?.id;
    const leadId = drawing?.leadId || projectInfo?.leadId || projectInfo?.projectCode;
    if (!leadId || !drawingId) return;

    try {
      await requestDrawingRevision({
        leadId,
        drawingId,
        note: revisionReason,
      }).unwrap();
      setReasonError("");
      setRevisionReason("");
      setIsRevisionModalOpen(false);
      onClose();
    } catch (err: any) {
      console.error("Failed to request revision:", err);
      setReasonError(err?.data?.message || err?.message || "Failed to request revision. Please try again.");
    }
  };

  const handleApprove = async () => {
    const drawingId = drawing?._id || drawing?.id;
    const leadId = drawing?.leadId || projectInfo?.leadId || projectInfo?.projectCode;
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
    const leadId = drawing?.leadId || projectInfo?.leadId || projectInfo?.projectCode;
    if (!leadId || !drawingId) return;

    try {
      await addDrawingComment({
        leadId,
        drawingId,
        text: comment.trim(),
      }).unwrap();
      setComment("");
      onClose();
      onSendMessage();
    } catch (err) {
      console.error("Failed to send comment:", err);
    }
  };

  const handleDownload = async () => {
    const url = drawing.fileUrl || DrawingPlanImg;
    const filename = drawing.name ? `${drawing.name}.${url.split('.').pop()?.split('?')[0] || 'pdf'}` : 'download';
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed via blob, falling back to direct link", error);
      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.download = filename;
      link.click();
    }
  };

  const normalizedStatus = String(drawing?.status || "").toLowerCase().trim();
  const isApproved = normalizedStatus === "approved";
  const isRevisionRequired =
    normalizedStatus === "revision required" ||
    normalizedStatus === "revision_required" ||
    normalizedStatus === "rejected";
  const isPending = !isApproved && !isRevisionRequired;

  const revisionText = (
    drawing?.revisionNote ||
    drawing?.revisionReason ||
    drawing?.notes ||
    ""
  ).trim();
  const commentsList = Array.isArray(drawing?.comments) ? drawing.comments : [];
  const hasRevision = Boolean(revisionText);

  // Get the latest comment
  const latestComment =
    commentsList.length > 0 ? commentsList[commentsList.length - 1] : null;
  const latestCommentText = (
    typeof latestComment === "string"
      ? latestComment
      : latestComment?.text || ""
  ).trim();

  const hasComment = Boolean(latestCommentText);

  const renderRevisionAndComments = () => {
    if (!hasRevision && !hasComment) return null;

    return (
      <div
        className={`grid gap-4 py-2 border-b border-gray-200 ${hasRevision && hasComment
            ? "grid-cols-1 md:grid-cols-2"
            : "grid-cols-1"
          }`}
      >
        {hasRevision && (
          <div
            className={`${hasComment ? "md:border-r md:border-gray-200 md:pr-4" : ""
              }`}
          >
            <h4 className="text-base font-bold text-[#101828] mb-1.5">
              Revision Message
            </h4>
            <p className="text-sm text-[#475467] leading-relaxed break-words">
              {revisionText}
            </p>
          </div>
        )}

        {hasComment && (
          <div className={`${hasRevision ? "md:pl-4" : ""}`}>
            <h4 className="text-base font-bold text-[#101828] mb-1.5">
              Your Suggestions
            </h4>
            <div className="text-sm text-[#475467]">
              <p className="leading-relaxed break-words">{latestCommentText}</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (!drawing || !projectInfo) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      showHeader={false}
      customPadding="p-0"
      width="sm:max-w-4xl"
    >
      <div className="bg-white rounded-2xl w-full shadow-2xl overflow-hidden flex flex-col h-[85vh]">
        {/* Header */}
        <div className="px-4 py-2 lg:px-6 lg:py-3 flex items-start justify-between bg-white sticky top-0 z-10">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-1">
            <div>
              <h2 className="xl:text-xl text-base font-semibold text-black leading-tight w-[240px] overflow-hidden whitespace-nowrap text-ellipsis">
                {drawing.name}
              </h2>
              <p className="text-sm text-(-text-color-gray-2) font-normal">
                {drawing?.buildingLabel || drawing?.building || projectInfo?.buildingLabel || projectInfo?.projectCode}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-1">
              {/* <div>
                <p className="text-sm text-black font-normal tracking-wider">
                  Pune,
                </p>
                <p className="text-sm font-normal text-black">Maharashtra</p>
              </div> */}
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

        {/* Content - Image / PDF Preview Area */}
        <div className="flex-1 min-h-0 bg-gray-50 p-2 flex items-center justify-center">
          <div className="relative w-full h-full shadow-sm rounded-lg overflow-hidden flex items-center justify-center">
            {drawing.fileUrl?.toLowerCase().endsWith(".pdf") || drawing.type?.toLowerCase().includes("pdf") ? (
              <iframe
                src={`${drawing.fileUrl}#toolbar=0`}
                title={drawing.name || "PDF Document"}
                className="w-full h-full border-0 rounded-lg flex-1"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center relative group">
                <img
                  src={drawing.fileUrl || DrawingPlanImg}
                  alt="Drawing Plan"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            )}
          </div>
        </div>

        {/* Footer - Conditional UI */}
        <div className="p-3 lg:px-6 lg:py-3 border-t border-gray-300 bg-white space-y-3">
          {/* Revision Message & Customer Suggestions (Comments) */}
          {renderRevisionAndComments()}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 md:px-4 px-2 py-1 bg-[#9CA3AF] hover:bg-[#E2E8F0] text-white rounded-full md:text-base text-sm font-medium transition-all cursor-pointer"
            >
              <ArrowDown className="md:w-5 md:h-5 w-4 h-4" />
              Download
            </button>

            <div className="flex items-center gap-3 ml-auto flex-wrap">
              {isApproved ? (
                <div className="flex items-center gap-2">
                  <p className="text-black text-sm font-normal">
                    {drawing.updatedAt ? new Date(drawing.updatedAt).toLocaleDateString() : ""}
                  </p>
                  <span className="px-5 py-1.5 bg-[#DCFCE7] text-[#16A34A] rounded-full text-sm font-medium border border-[#BBF7D0]">
                    Approved
                  </span>
                </div>
              ) : isRevisionRequired ? (
                <span className="px-5 py-1.5 bg-[#FFF7ED] text-[#FF9409] rounded-full text-sm font-medium border border-[#FFEDD5]">
                  Sent for Revision
                </span>
              ) : (
                <>
                  <button
                    onClick={() => setIsRevisionModalOpen(true)}
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
            isOpen={isRevisionModalOpen}
            onClose={() => {
              setIsRevisionModalOpen(false);
              setRevisionReason("");
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
                  value={revisionReason}
                  onChange={(e) => {
                    setRevisionReason(e.target.value);
                    if (reasonError) setReasonError("");
                  }}
                  placeholder="Write your revision"
                  rows={5}
                  className={`w-full resize-none rounded-lg border p-4 text-[16px] outline-none ${reasonError ? "border-red-500" : "border-[#D0D5DD]"
                    }`}
                />

                {reasonError && (
                  <p className="mt-2 text-sm text-red-500">{reasonError}</p>
                )}
              </div>

              <div className="mt-10 flex justify-center">
                <button
                  onClick={handleRequestRevision}
                  disabled={isUpdating}
                  className="h-[48px] w-full rounded-lg bg-[linear-gradient(90deg,#2563EB_0%,#4F46E5_100%)] text-base font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isUpdating && <Loader2 className="h-5 w-5 animate-spin" />}
                  Submit
                </button>
              </div>
            </div>
          </Modal>

          {/* Show comment box only in pending drawings that don't have comments yet */}
          {isPending && (!Array.isArray(drawing?.comments) || drawing.comments.length === 0) && (
            <div className="mt-2 flex items-center gap-2 border border-gray-200 rounded-xl p-1.5 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Type your Comment..."
                className="flex-1 px-3 py-1 text-sm text-gray-600 outline-none"
              />
              <button className="p-1 text-[#00000080] hover:text-gray-600">
                <Paperclip className="w-5 h-5 -rotate-5" />
              </button>
              <Button
                onClick={handleSendComment}
                disabled={isUpdating || !comment.trim()}
                className="text-sm font-normal bg-[linear-gradient(90deg,#2563EB_0%,#4F46E5_100%)] hover:bg-blue-700 text-white rounded-lg flex items-center md:gap-2 gap-1 md:px-4 px-3 py-1.5 h-auto disabled:opacity-50"
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
