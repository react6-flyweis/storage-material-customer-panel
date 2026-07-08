import TitleSubtitle from "@/components/common_components/TitleSubtitle";
import ProjectsDocumentList from "@/components/drawings_and_documents/ProjectsDocumentList";
import { ProjectDocumentsPageText } from "@/data/text/ProjectDocumentsPageText";

const ProjectDocumentsPage = () => {
  return (
    <div className="p-5 space-y-6">
      <TitleSubtitle
        title={ProjectDocumentsPageText.header.title}
        subtitle={ProjectDocumentsPageText.header.subtitle}
      />
      <ProjectsDocumentList />
    </div>
  );
};

export default ProjectDocumentsPage;
