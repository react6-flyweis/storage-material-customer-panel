import { CalendarDays, Loader2 } from "lucide-react";
import { useGetProjectActivityQuery } from "@/redux/api/projectsApi";
import type { ActivityItem } from "@/redux/api/projectsApi";

interface ProjectActivityLogProps {
  leadId: string;
}

const getActivityMessage = (item: ActivityItem): string => {
  const { action, metadata } = item;

  switch (action) {
    case "lead.released_to_plant":
      return `Released to Plant${metadata.assignedToName ? ` (Assigned to: ${metadata.assignedToName})` : ""}`;
    case "invoice.created":
      return `Invoice Created (${metadata.invoiceNumber || "N/A"}${metadata.totalAmount ? ` - $${metadata.totalAmount.toLocaleString()}` : ""})`;
    case "lead.escalated":
      return `Project Escalated${metadata.note ? `: "${metadata.note}"` : ""}`;
    case "lead.document_removed":
      return `Document Removed: ${metadata.name || "N/A"}`;
    case "lead.document_added":
      return `Document Added: ${metadata.name || "N/A"}`;
    case "followup.created":
      return `Follow Up Created${metadata.followUpDate ? ` for ${new Date(metadata.followUpDate).toLocaleDateString()}` : ""}${metadata.priority ? ` [${metadata.priority.toUpperCase()}]` : ""}`;
    case "lead.po_approved":
      return `PO Approved${metadata.adminNotes ? `: "${metadata.adminNotes}"` : ""}`;
    case "escalation.resolved":
      return `Escalation Resolved${metadata.employeeName ? ` (Assigned to: ${metadata.employeeName})` : ""}`;
    case "lead.po_raised":
      return `PO Raised${metadata.poNumber ? ` (${metadata.poNumber})` : ""}`;
    case "lead.lifecycle_updated": {
      const status = metadata.lifecycleStatus || "";
      const formattedStatus = status
        .split("_")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
      return `Lifecycle Updated: ${formattedStatus || status}`;
    }
    case "lead.edited": {
      const parts = [];
      if (metadata.buildingType) parts.push(`Building Type: ${metadata.buildingType}`);
      if (metadata.location) parts.push(`Location: ${metadata.location}`);
      if (metadata.quoteValue !== undefined) parts.push(`Value: $${metadata.quoteValue.toLocaleString()}`);
      return `Project Edited${parts.length > 0 ? ` (${parts.join(", ")})` : ""}`;
    }
    case "followup.completed":
      return "Follow Up Completed";
    case "meeting.completed":
      return "Meeting Completed";
    case "meeting.edited":
      return `Meeting Rescheduled: ${metadata.changes?.title || metadata.changes?.notes || "Details updated"}`;
    case "meeting.created":
      return `Meeting Created: ${metadata.title || "N/A"}${metadata.meetingTime ? ` (Time: ${new Date(metadata.meetingTime).toLocaleString()})` : ""}`;
    default:
      // Fallback formatting for any unhandled actions
      return action
        .replace(/^(lead|followup|meeting|invoice|escalation)\./, "")
        .split(/[._]/)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
  }
};

const ProjectActivityLog = ({ leadId }: ProjectActivityLogProps) => {
  const { data, isLoading, error } = useGetProjectActivityQuery({
    leadId,
    page: 1,
    limit: 20,
  });

  if (isLoading) {
    return (
      <div className="rounded-lg border border-[#98A2B3] bg-white p-5">
        <h2 className="text-[20px] font-bold text-[#101828]">Recent Activity</h2>
        <div className="my-4 border-t" />
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-[#2563EB]" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-[#98A2B3] bg-white p-5">
        <h2 className="text-[20px] font-bold text-[#101828]">Recent Activity</h2>
        <div className="my-4 border-t" />
        <p className="text-sm text-red-500 text-center py-4">
          Failed to load recent activity
        </p>
      </div>
    );
  }

  const activities = data?.activity || [];

  return (
    <div className="rounded-lg border border-[#98A2B3] bg-white p-5">
      <h2 className="text-[20px] font-bold text-[#101828]">Recent Activity</h2>

      <div className="my-4 border-t" />

      {activities.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-6">No recent activity</p>
      ) : (
        <div className="relative">
          <div className="absolute left-[10px] top-2 bottom-2 border-l border-dashed border-[#D0D5DD]" />

          <div className="space-y-8 max-h-[400px] overflow-y-auto pr-1">
            {activities.map((item) => (
              <div key={item._id} className="relative flex gap-2">
                <div className="z-10 h-5 w-5 rounded-full border-2 border-[#7C3AED] bg-white shrink-0">
                  <div className="m-[3px] h-2.5 w-2.5 rounded-full bg-[#7C3AED]" />
                </div>

                <div>
                  <p className="text-[14px] font-medium text-[#101828]">
                    {getActivityMessage(item)}
                  </p>
                  <p className="text-xs text-[#667085] mt-0.5">
                    by {item.performedBy?.name || "System"} ({item.performedBy?.role || "system"})
                  </p>

                  <div className="mt-1 flex text-sm items-center gap-2 text-[#667085]">
                    <CalendarDays size={14} />
                    <span>
                      {new Date(item.createdAt).toLocaleDateString(undefined, {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectActivityLog;
