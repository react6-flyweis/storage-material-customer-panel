import React from "react";
import { MoveLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useGetProjectDetailsQuery } from "@/redux/api/projectsApi";
import ProjectImages from "@/components/my_projects/ProjectImages";

const ProjectImagesPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const leadId = id || "";

  const { data: projectDetails } = useGetProjectDetailsQuery(leadId, {
    skip: !leadId,
  });

  const projectName = projectDetails?.lead?.projectName || "Project";

  return (
    <div className="p-5 space-y-6">
      {/* Top Header Row with Back Button */}
      <div className="flex items-center gap-4">
        <Button
          onClick={() => navigate(-1)}
          className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white xl:px-4 xl:py-2 xl:text-sm text-xs flex items-center gap-2 rounded-md"
        >
          <MoveLeft className="h-4 w-4" />
          Back
        </Button>
        <h1 className="text-2xl font-bold text-[#101828]">
          {projectName} - Project Media
        </h1>
      </div>

      <ProjectImages leadId={leadId} projectName={projectName} />
    </div>
  );
};

export default ProjectImagesPage;
