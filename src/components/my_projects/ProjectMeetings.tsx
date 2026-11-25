import { cn } from "@/lib/utils";
import GreenCallIcon from "../../assets/icon/GreenCallIcon.svg";
import DarkBlueMailIcon from "../../assets/icon/DarkBlueMailIcon.svg";
import { useGetProjectMeetingsQuery, type MeetingItem } from "@/redux/api/projectsApi";
import { Check, Copy, Loader2 } from "lucide-react";
import { useState } from "react";

/** Join only for a scheduled online meeting that has a link. */
const isMeetingJoinable = (meeting: MeetingItem) =>
  meeting.mode === "online" &&
  meeting.status === "scheduled" &&
  Boolean(meeting.meetingLink?.trim());

const getMeetingStatusLabel = (meeting: MeetingItem) => {
  if (meeting.status === "cancelled") return "Cancelled";
  if (meeting.status === "completed") return "Completed";
  if (meeting.status === "rescheduled") return "Rescheduled";
  if (meeting.mode !== "online") return "In person";
  return "Link pending";
};

const CopyLinkButton = ({ link }: { link: string }) => {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(link);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          // Clipboard unavailable — the Join button still works.
        }
      }}
      className="flex items-center gap-1.5 text-xs text-(--text-color-gray-2) hover:underline cursor-pointer"
      title="Copy meeting link"
    >
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? "Copied" : "Copy link"}
    </button>
  );
};

interface ProjectMeetingsProps {
  leadId: string;
}

const formatMeetingDate = (dateString: string) => {
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

const getMeetingStyles = (index: number) => {
  const styles = [
    {
      accentColor: "#B91C1C",
      bgColor: "#FEF2F2",
      buttonColor: "bg-[#DCFCE7] text-[#16A34A]",
    },
    {
      accentColor: "#EAB308",
      bgColor: "#FEFCE8",
      buttonColor: "bg-[#DBEAFE] text-[#1D51A4]",
    },
    {
      accentColor: "#2563EB",
      bgColor: "#EFF6FF",
      buttonColor: "bg-[#F0FDF4] text-[#15803D]",
    },
  ];
  return styles[index % styles.length];
};

const ProjectMeetings = ({ leadId }: ProjectMeetingsProps) => {
  const { data: meetingsData, isLoading: isMeetingsLoading, error: meetingsError } = useGetProjectMeetingsQuery(
    { leadId, page: 1, limit: 100 },
    { skip: !leadId }
  );

  const meetings = meetingsData?.meetings
    ? [...meetingsData.meetings].sort(
      (a, b) =>
        new Date(b.meetingTime).getTime() - new Date(a.meetingTime).getTime()
    )
    : [];

  return (
    <div className="space-y-6 md:p-6 p-4 md:space-y-8 bg-white rounded-[10px] border border-[#E5E7EB]">
      <h3 className="text-lg font-bold text-(--text-color-black)">
        Meetings
      </h3>

      <div className="space-y-4 max-h-[calc(100vh-400px)] overflow-y-auto">
        {isMeetingsLoading ? (
          <div className="flex h-40 w-full items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-[#2563EB]" />
          </div>
        ) : meetingsError ? (
          <div className="text-center py-6 text-red-500 text-sm">
            Failed to load meetings. Please try again.
          </div>
        ) : meetings.length === 0 ? (
          <div className="text-center py-6 text-gray-500 text-sm">
            No meetings found for this project.
          </div>
        ) : (
          meetings.map((meeting: MeetingItem, index: number) => {
            const styles = getMeetingStyles(index);
            return (
              <div
                key={meeting._id}
                className="relative rounded-xl overflow-hidden border border-gray-100 h-full"
                style={{ backgroundColor: styles.bgColor }}
              >
                <div
                  className="absolute left-0 top-0 bottom-0 w-1.5"
                  style={{ backgroundColor: styles.accentColor }}
                />
                <div className="p-6 pl-8">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-3">
                      <span className="text-sm font-bold text-(--text-color-gray-2)">
                        {formatMeetingDate(meeting.meetingTime)}
                      </span>
                      <h4 className="text-sm font-bold text-(--text-color-gray-2)">
                        {meeting.title}
                      </h4>
                      <div className="space-y-1">
                        <p className="text-xs text-(--text-color-gray-2) font-normal">
                          Organized by {meeting.createdBy?.name || "Admin"}
                        </p>
                        <p className="text-xs text-(--text-color-gray-2)">
                          Duration: {meeting.duration} min
                        </p>
                      </div>
                    </div>
                    {isMeetingJoinable(meeting) ? (
                      <div className="flex flex-col items-end gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            window.open(meeting.meetingLink, "_blank", "noopener,noreferrer")
                          }
                          className={cn(
                            "flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-normal transition-colors min-w-[90px] cursor-pointer hover:opacity-90",
                            styles.buttonColor
                          )}
                        >
                          <img src={GreenCallIcon} alt="online" className="w-4 h-4" />
                          Join meeting
                        </button>
                        <CopyLinkButton link={meeting.meetingLink!} />
                      </div>
                    ) : (
                      <span
                        className={cn(
                          "flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-normal min-w-[90px] opacity-80",
                          styles.buttonColor
                        )}
                      >
                        <img
                          src={meeting.mode === "online" ? GreenCallIcon : DarkBlueMailIcon}
                          alt={meeting.mode}
                          className="w-4 h-4"
                        />
                        {getMeetingStatusLabel(meeting)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ProjectMeetings;
