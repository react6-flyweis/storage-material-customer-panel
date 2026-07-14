import { useLocation } from "react-router-dom";
import ChatCard from "./chat-card";

const ProjectOpenChat = () => {
  const location = useLocation();
  const leadId = location?.pathname?.split("/")?.filter(Boolean)?.[1] || "";

  if (!leadId) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center text-red-500 bg-white rounded-lg shadow">
        Invalid Project ID.
      </div>
    );
  }

  return <ChatCard leadId={leadId} />;
};

export default ProjectOpenChat;