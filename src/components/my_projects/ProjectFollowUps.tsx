import GreenCallIcon from "../../assets/icon/GreenCallIcon.svg";
import DarkBlueMailIcon from "../../assets/icon/DarkBlueMailIcon.svg";
import PurpleBellIcon from "../../assets/icon/PurpleBellIcon.svg";
import BlueMellIcon from "../../assets/icon/BlueMellIcon.svg";
import { useGetProjectFollowUpsQuery, type FollowUpItem } from "@/redux/api/projectsApi";
import { Loader2 } from "lucide-react";

interface ProjectFollowUpsProps {
  leadId: string;
}

const formatFollowUpDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateString;
  }
};

const getIcon = (index: number) => {
  const icons = [PurpleBellIcon, BlueMellIcon, GreenCallIcon, DarkBlueMailIcon];
  return icons[index % icons.length];
};

const ProjectFollowUps = ({ leadId }: ProjectFollowUpsProps) => {
  const { data: followUpsData, isLoading: isFollowUpsLoading, error: followUpsError } = useGetProjectFollowUpsQuery(
    { leadId, page: 1, limit: 100 },
    { skip: !leadId }
  );

  const followUps = followUpsData?.followUps
    ? [...followUpsData.followUps].sort(
      (a, b) =>
        new Date(b.followUpDate).getTime() - new Date(a.followUpDate).getTime()
    )
    : [];

  return (
    <div className="space-y-2  md:space-y-0 bg-white rounded-[10px] border border-[#E5E7EB] ">
      <div className="flex items-center justify-between md:p-6 md:pb-1 p-4">
        <div>
          <h3 className="text-lg font-bold text-(--text-color-black)">
            Follow Up
          </h3>
          <p className="text-sm text-(--text-color-gray-2)">
            Recent activities
          </p>
        </div>
      </div>
      <hr className="my-4 border-[#E5E7EB]" />
      <div className="space-y-4 md:p-6 md:pt-1 p-4 max-h-[calc(100vh-400px)] overflow-y-auto">
        {isFollowUpsLoading ? (
          <div className="flex h-40 w-full items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-[#2563EB]" />
          </div>
        ) : followUpsError ? (
          <div className="text-center py-6 text-red-500 text-sm">
            Failed to load follow-ups. Please try again.
          </div>
        ) : followUps.length === 0 ? (
          <div className="text-center py-6 text-gray-500 text-sm">
            No follow-ups found for this project.
          </div>
        ) : (
          followUps.map((item: FollowUpItem, index: number) => (
            <div
              key={item._id}
              className="flex items-start gap-4 p-5 bg-[#F8FAFC] rounded-xl"
            >
              <div className="bg-white p-2.5 rounded-full shadow-sm flex justify-center items-center">
                <img src={getIcon(index)} alt={item.assignedTo?.name || "User"} className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-normal text-(--text-color-black) truncate">
                    {item.assignedTo?.name || "Unassigned"}
                  </h4>
                  <span className="text-xs text-(--text-color-gray-2) whitespace-nowrap">
                    {formatFollowUpDate(item.followUpDate)}
                  </span>
                </div>
                <p className="text-xs text-(--text-color-gray-2) mt-1 line-clamp-2">
                  {item.notes}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProjectFollowUps;
