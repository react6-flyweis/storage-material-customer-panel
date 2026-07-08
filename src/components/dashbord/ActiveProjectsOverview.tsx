import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../ui/card";
import { activeProjectData } from "@/data/mockData";
import { useNavigate } from "react-router-dom";

const ActiveProjectsOverview = () => {
  const navigate = useNavigate();
  return (
    <Card className="w-full h-full bg-white border-none gap-4 py-4 px-2">
      <CardHeader className="pb-0 px-2">
        <CardTitle className="text-lg font-normal text-(--text-color-black)">
          Active Projects Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 px-2 pb-0">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-2">
          <div className="bg-[#EFF6FF] px-3 py-2 rounded-lg">
            <p className="text-xs text-[#848484] mb-1">Project Name</p>
            <p className="text-sm font-semibold text-gray-800">
              {activeProjectData.projectName}
            </p>
          </div>
          <div className="bg-[#EFF6FF] px-3 py-2 rounded-lg">
            <p className="text-xs text-[#848484] mb-1">Project Code / ID</p>
            <p className="text-sm font-semibold text-gray-800">
              {activeProjectData.projectCode}
            </p>
          </div>
        </div>

        <div className="bg-[#EBF3FF] px-3 py-2 rounded-lg">
          <p className="text-xs text-[#848484] mb-1">Site Location</p>
          <p className="text-sm font-semibold text-gray-800">
            {activeProjectData.siteLocation}
          </p>
        </div>

        <div className="bg-[#F2FAF4] px-3 py-2 rounded-lg">
          <p className="text-xs text-[#848484] mb-1">Progress Percentage</p>
          <p className="text-sm font-semibold text-gray-800">
            {activeProjectData.progressPercentage}
          </p>
        </div>

        <div className="bg-[#F2FAF4] px-3 py-2 rounded-lg">
          <p className="text-xs text-[#848484] mb-1">Current Status:</p>
          <p className="text-sm font-semibold text-gray-800">
            {activeProjectData.currentStatus}
          </p>
        </div>

        <div className="bg-[#FFFBEB] px-3 py-2 rounded-lg">
          <p className="text-xs text-[#848484] mb-1">Next Milestone Date</p>
          <p className="text-sm font-semibold text-gray-800">
            {activeProjectData.nextMilestoneDate}
          </p>
        </div>

        <div className="bg-[#FFFBEB] px-3 py-2 rounded-lg">
          <p className="text-xs text-[#848484] mb-1">
            Assigned Project Manager
          </p>
          <p className="text-sm font-semibold text-gray-800">
            {activeProjectData.assignedProjectManager}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <div
          onClick={() => navigate("/my_projects")}
          className="text-(--button-bg-primary-color) text-decoration-none text-sm font-medium cursor-pointer"
        >
          Open full project
        </div>
      </CardFooter>
    </Card>
  );
};

export default ActiveProjectsOverview;
