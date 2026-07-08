
import TitleSubtitle from "../components/common_components/TitleSubtitle";
import BlueAddUserIcon from "../assets/icon/BlueAddUserIcon.svg";
import StatCard from "@/components/ui/stat-card";
import { dashboardText } from "@/data/text/DashboardText";
import ActiveProjectsOverview from "../components/dashbord/ActiveProjectsOverview";
import DrawingsAndApprovals from "../components/dashbord/DrawingsAndApprovals";
import GreenCheckIcon from "../assets/icon/GreenCheckIcon.svg";
import YellowDollerIcon from "../assets/icon/YellowDollerIcon.svg";
import SalmonGrowthIcon from "../assets/icon/SalmonGrowthIcon.svg";
import DashboardWidgets from "@/components/dashbord/DashboardWidgets";
import Ship1 from "../assets/new-images/ship-1.svg";
import Ship2 from "../assets/new-images/ship-2.svg";
import { useState } from "react";

const nextDeliveryData = {
  title: "Primary Frame Steel",
  description: "Main structural steel beams for warehouse frame",
  deliveryId: "DEL-1001",
  status: "inTransit",

  deliveryInfo: {
    date: "Wednesday, March 25, 2026",
    trackingStatus: "Out for Delivery",
    eta: "Arriving in 45 mins",
    timeWindow: "08:00 - 12:00",
    company: "FastFreight Logistics",
    driver: "John Driver",
    driverPhone: "(555) 999-8888",
    estimatedWeight: "45,000 lbs",
    equipment: ["5,000 lb Forklift required", "Crane needed"],
  },

  siteContact: {
    name: "Warehouse Supervisor",
    phone: "(555) 789-0123",
    instructions: "Please coordinate with the loading dock before arrival.",
    specialNotes: "Site requires proof of delivery and photo confirmation.",
  },

  logistics: {
    company: "ABC Logistics",
    driver: "John Doe",
    phone: "(555) 123-4567",
    communications: [
      "Confirmation sent ✔",
      "48hr reminder ✔",
      "24hr reminder ✔",
      "Reschedule notification ⚠️",
    ],
  },
};

import {
  Truck,
  BadgeDollarSign,
  PackageCheck,
  Users,
  CalendarDays,
  Clock3,
  AlertCircle,
  RefreshCcw,
  ClipboardList,
  CircleCheck,
} from "lucide-react";
import DashStatCard from "@/components/ui/dash-stat-card";
import NextDeliveryCard from "@/components/dashbord/NextDeliveryCard";

const shipmentBreakdown = [
  {
    title: "Total Loads",
    value: "3 trucks",
    description: "Load 1 → 45,000 lbs → 12 bundles",
    icon: ClipboardList,
    iconBg: "bg-violet-600",
    accent: "text-emerald-600",
    shape: "bg-violet-100",
    bgImg: Ship1,
  },
  {
    title: "Total Bundles",
    value: "72 bundles",
    description: "Load 2 → 42,500 lbs → 10 bundles",
    icon: CircleCheck,
    iconBg: "bg-emerald-600",
    accent: "text-emerald-600",
    shape: "bg-emerald-100",
    bgImg: Ship2,
  },
];

export const deliveryTrackingStats = [
  {
    title: "In Transit",
    value: 1,
    icon: Truck,
    borderColor: "#3B82F6",
    iconBg: "#3B82F6",
  },
  {
    title: "Staged",
    value: 5,
    icon: BadgeDollarSign,
    borderColor: "#3B82F6",
    iconBg: "#3B82F6",
  },
  {
    title: "Ready",
    value: 6,
    icon: PackageCheck,
    borderColor: "#3B82F6",
    iconBg: "#3B82F6",
  },
  {
    title: "Total Today",
    value: 7,
    icon: Users,
    borderColor: "#3B82F6",
    iconBg: "#3B82F6",
  },
  {
    title: "Upcoming Deliveries",
    value: 3,
    icon: CalendarDays,
    borderColor: "#22C55E",
    iconBg: "#22C55E",
  },
  {
    title: "Deliveries This Week",
    value: 4,
    icon: Clock3,
    borderColor: "#22C55E",
    iconBg: "#22C55E",
  },
  {
    title: "Delayed Deliveries",
    value: 5,
    icon: AlertCircle,
    borderColor: "#22C55E",
    iconBg: "#22C55E",
  },
  {
    title: "Rescheduled Deliveries",
    value: 6,
    icon: RefreshCcw,
    borderColor: "#22C55E",
    iconBg: "#22C55E",
  },
];

type TabType = "today" | "week" | "month";

export const DashboardStats = [
  {
    title: "Active Projects",
    value: "1",
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
    title: "Projects Closed",
    value: "12",
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
    title: "Drawings and Approvals",
    value: "74",
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
    title: "Project Timeline",
    value: "5 days",
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

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<TabType>("today");
  console.log("activeTab:", setActiveTab);
  return (
    <div className="p-5 space-y-6">
      {/* <FilterTabs
        activeTab={activeTab}
        onChange={setActiveTab}
      /> */}
      <TitleSubtitle
        title={dashboardText.header.title}
        subtitle={dashboardText.header.subtitle}
      />

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

      <div>
        <p className="text-[#212B36] text-[18px] font-semibold mb-3">
          Delivery Tracking
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {deliveryTrackingStats.map((item) => {
            const Icon = item.icon;

            return (
              <DashStatCard
                key={item.title}
                title={item.title}
                value={item.value}
                icon={<Icon size={24} />}
                borderColor={item.borderColor}
                iconBg={item.iconBg}
              />
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="">
          <ActiveProjectsOverview />
        </div>
        <div className="">
          <DrawingsAndApprovals activeFilter={activeTab} />
        </div>
      </div>

      <DashboardWidgets />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {shipmentBreakdown.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="relative overflow-hidden rounded-lg border bg-white"
            >
              <div className="flex items-center justify-between px-6 py-5">
                <div>
                  <p className="text-lg text-slate-500">{item.title}</p>
                  <h3 className="mt-1 text-xl font-semibold text-slate-900">
                    {item.value}
                  </h3>
                </div>

                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-full ${item.iconBg}`}
                >
                  <Icon className="h-7 w-7 text-white" />
                </div>
              </div>

              <div className="border-t px-6 py-4">
                <p className={`flex items-center gap-1 text-lg ${item.accent}`}>
                  ↗ {item.description}
                </p>
              </div>

              <div className="absolute bottom-0 right-0">
                <img src={item.bgImg} alt="" />
              </div>
            </div>
          );
        })}
      </div>

      <NextDeliveryCard data={nextDeliveryData} dashboardpage={true} />
    </div>
  );
};

export default Dashboard;
