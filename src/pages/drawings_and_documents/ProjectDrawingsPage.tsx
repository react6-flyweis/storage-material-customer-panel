import TitleSubtitle from "@/components/common_components/TitleSubtitle";
import { ProjectDrawingsPageText } from "@/data/text/ProjectDrawingsPageText";
import ProjectsDrawingsList from "@/components/drawings_and_documents/ProjectsDrawingsList";

const ProjectDrawingsPage = () => {
  return (
    <div className="p-5 space-y-6">
      <TitleSubtitle
        title={ProjectDrawingsPageText.header.title}
        subtitle={ProjectDrawingsPageText.header.subtitle}
      />
      <ProjectsDrawingsList />
    </div>
  );
};

export default ProjectDrawingsPage;
