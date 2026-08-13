import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import TitleSubtitle from "@/components/common_components/TitleSubtitle";
import { MyProjectPageText } from "@/data/text/MyProjectPageText";
import ProjectsList from "@/components/my_projects/ProjectsList";
import StatCard from "@/components/ui/stat-card";
import BlueAddUserIcon from "../assets/icon/BlueAddUserIcon.svg";
import GreenCheckIcon from "../assets/icon/GreenCheckIcon.svg";
import YellowDollerIcon from "../assets/icon/YellowDollerIcon.svg";
import SalmonGrowthIcon from "../assets/icon/SalmonGrowthIcon.svg";
import { useGetProjectsQuery } from "@/redux/api/projectsApi";

const MyProjectsPage = () => {
  const { data } = useGetProjectsQuery({ page: 1, limit: 20 });
  const stats = data?.stats;

  const DashboardStats = [
    {
      title: "Total Projects",
      value: stats?.total !== undefined ? String(stats.total) : "-",
      icon: (
        <img
          src={BlueAddUserIcon}
          alt="active-projects"
          className="md:size-6 size-5 p-1"
        />
      ),
      color: "bg-[#1D51A4]",
    },
    {
      title: "Active Projects",
      value: stats?.active !== undefined ? String(stats.active) : "-",
      icon: (
        <img
          src={GreenCheckIcon}
          alt="projects-closed"
          className="md:size-6 size-5 p-1"
        />
      ),
      color: "bg-[#3AB449]",
    },
    {
      title: "Work in Progress",
      value: stats?.workInProgress !== undefined ? String(stats.workInProgress) : "-",
      icon: (
        <img
          src={YellowDollerIcon}
          alt="drawings-approvals"
          className="md:size-7 size-5"
        />
      ),
      color: "bg-[#EAB308]",
    },
    {
      title: "Canceled",
      value: stats?.cancelled !== undefined ? String(stats.cancelled) : "-",
      icon: (
        <img
          src={SalmonGrowthIcon}
          alt="project-timeline"
          className="md:size-7 size-5 p-1"
        />
      ),
      color: "bg-[#FD8D5B]",
    },
  ];

  return (
    <div className="p-5 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <TitleSubtitle
          title={MyProjectPageText.header.title}
          subtitle={MyProjectPageText.header.subtitle}
        />
        <Link
          to="/add-new-project"
          className="flex items-center gap-2.5 bg-[#1D51A4] hover:bg-[#163e80] text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer self-start sm:self-auto shrink-0"
        >
          <span className="w-5 h-5 rounded-full bg-white flex items-center justify-center shrink-0">
            <Plus className="w-3.5 h-3.5 text-[#1D51A4]" strokeWidth={3} />
          </span>
          <span>Create New Project</span>
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {DashboardStats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>
      <ProjectsList />
    </div>
  );
};

export default MyProjectsPage;
