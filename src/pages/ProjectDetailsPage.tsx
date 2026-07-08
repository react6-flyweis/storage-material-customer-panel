import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MoveLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { myProjectsData } from "@/data/text/MyProjectsData";

import TitleSubtitle from "@/components/common_components/TitleSubtitle";
import ProjectBasicInfo from "@/components/my_projects/ProjectBasicInfo";
import ProjectOpenChat from "@/components/my_projects/ProjectOpenChat";
import ProjectQuotation from "@/components/my_projects/ProjectQuotation";
import ProjectRFQ from "@/components/my_projects/ProjectRFQ";
import ProjectTimeline from "@/components/my_projects/ProjectTimeline";
import ProjectFollowUps from "@/components/my_projects/ProjectFollowUps";
import ProjectPayments from "@/components/my_projects/ProjectPayments";
import TrackLeadsLifecycleModal from "@/components/my_projects/TrackLeadsLifecycleModal";
import SuccessModal from "@/components/common_components/SuccessModal";
import Modal from "@/components/common_components/Modal";

const tabs = [
  "Basic info",
  "RFQ",
  "Quotation",
  "Open Chat",
  "Timeline",
  "Follow Ups",
  "Payments",
  "Project Tracking",
];

const ProjectDetailsPage = () => {
  const location=useLocation();
  const id=location?.pathname?.split("/")?.filter(Boolean)?.[1]
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Basic info");
  const [isTrackLifecycleOpen, setIsTrackLifecycleOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [reasonError, setReasonError] = useState("");
const handleCancelProject = () => {
  if (!cancelReason.trim()) {
    setReasonError("Please enter cancellation reason");
    return;
  }

  setReasonError("");
  setCancelReason("");
  setIsCancelModalOpen(false);

  setModalTitle("Project Cancelled Successfully");
  setIsSuccessModalOpen(true);

  console.log("Cancellation Reason:", cancelReason);

  setTimeout(() => {
    setIsSuccessModalOpen(false);
    navigate("/my_projects");
  }, 5000);
};

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
        {activeTab === "Basic info" && (
          <div className="flex items-center gap-3">
            <Button onClick={()=>navigate(`/project-drawings/${id}`)} className="bg-[#78787833] hover:bg-[##787878] text-black xl:px-4 xl:py-2 xl:text-sm text-xs rounded-md">
              Drawings & Images
            </Button>
            <Button
              onClick={() => setIsCancelModalOpen(true)}
              className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white xl:px-4 xl:py-2 xl:text-sm text-xs rounded-md"
            >
              Cancel Project
            </Button>
          </div>
        )}
        {activeTab === "Quotation" && (
          <div className="flex items-center gap-3">
            <Button className="bg-[#78787833] hover:bg-[##787878] text-black xl:px-4 xl:py-2 xl:text-sm text-xs rounded-md">
              Reject
            </Button>
            <Button
              onClick={() => {
                setIsSuccessModalOpen(true);
                setModalTitle("Approved Successfully");
                setTimeout(() => {
                  setIsSuccessModalOpen(false);
                }, 5000);
              }}
              className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white xl:px-4 xl:py-2 xl:text-sm text-xs rounded-md"
            >
              Approve to proceed
            </Button>
          </div>
        )}

        <SuccessModal
          isOpen={isSuccessModalOpen}
          onClose={() => setIsSuccessModalOpen(false)}
          title={modalTitle}
        />

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
              Project Cancelation
            </h2>

            <div className="mt-10">
              <label className="mb-4 block text-[18px] font-medium text-[#101828]">
                Add Cancelation Reason
              </label>

              <textarea
                value={cancelReason}
                onChange={(e) => {
                  setCancelReason(e.target.value);
                  if (reasonError) setReasonError("");
                }}
                placeholder="Enter Reason"
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
                className="h-[48px] w-full rounded-lg bg-[linear-gradient(90deg,#2563EB_0%,#4F46E5_100%)] text-base font-semibold text-white"
              >
                Cancel Project
              </button>
            </div>
          </div>
        </Modal>
        
      </div>
      <TitleSubtitle
        title="Project Details"
        subtitle="Stay updated with your latest activities and alerts"
      />

      <div className="border-b border-gray-300 overflow-x-auto px-2 md:px-0">
        <div className="flex items-center justify-start md:gap-20 gap-12 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => {
                if (tab === "Project Tracking") {
                  setIsTrackLifecycleOpen(true);
                } else {
                  setActiveTab(tab);
                }
              }}
              className={cn(
                "pb-3 text-sm font-medium transition-all relative",
                activeTab === tab
                  ? "text-[#2563EB]"
                  : "text-gray-500 hover:text-gray-700",
              )}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#2563EB] rounded-t-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="min-h-[400px] max-w-7xl">
        {activeTab === "Basic info" ? (
          <ProjectBasicInfo />
        ) : activeTab === "RFQ" ? (
          <ProjectRFQ />
        ) : activeTab === "Quotation" ? (
          <ProjectQuotation />
        ) : activeTab === "Open Chat" ? (
          <ProjectOpenChat />
        ) : activeTab === "Timeline" ? (
          <ProjectTimeline />
        ) : activeTab === "Follow Ups" ? (
          <ProjectFollowUps />
        ) : activeTab === "Payments" ? (
          <ProjectPayments />
        ) : (
          <>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {activeTab} Content
            </h2>
          </>
        )}
      </div>

      <TrackLeadsLifecycleModal
        isOpen={isTrackLifecycleOpen}
        onClose={() => setIsTrackLifecycleOpen(false)}
      />
    </div>
  );
};

export default ProjectDetailsPage;
