import { CalendarDays, Loader2 } from "lucide-react";
import { useGetProjectNotesQuery } from "@/redux/api/projectsApi";

interface ProjectNotesProps {
  leadId: string;
}

const ProjectNotes = ({ leadId }: ProjectNotesProps) => {
  const { data, isLoading, error } = useGetProjectNotesQuery(leadId, {
    skip: !leadId,
  });

  if (isLoading) {
    return (
      <div className="rounded-lg border border-[#98A2B3] bg-white p-5">
        <h2 className="text-[20px] font-bold text-[#101828]">Notes</h2>
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
        <h2 className="text-[20px] font-bold text-[#101828]">Notes</h2>
        <div className="my-4 border-t" />
        <p className="text-sm text-red-500 text-center py-4">
          Failed to load notes
        </p>
      </div>
    );
  }

  const notesList = data?.notes || [];

  return (
    <div className="rounded-lg border border-[#98A2B3] bg-white p-5">
      <h2 className="text-[20px] font-bold text-[#101828]">Notes</h2>

      <div className="my-4 border-t" />

      {notesList.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-6">No notes added yet</p>
      ) : (
        <div className="space-y-6 max-h-[400px] overflow-y-auto pr-1">
          {notesList.map((item) => (
            <div key={item._id} className="p-4 rounded-lg bg-[#F8F9FA] border border-[#EAECF0] space-y-2">
              <p className="text-[14px] text-[#344054] leading-relaxed font-medium">
                {item.note}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-[#667085]">
                <CalendarDays size={14} />
                <span>
                  {new Date(item.addedAt).toLocaleDateString(undefined, {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectNotes;
