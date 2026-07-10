
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
import { useGetDashboardQuery } from "@/redux/api/dashboardApi";

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
  Loader2,
} from "lucide-react";
import DashStatCard from "@/components/ui/dash-stat-card";
import NextDeliveryCard from "@/components/dashbord/NextDeliveryCard";

type TabType = "today" | "week" | "month";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<TabType>("today");
  console.log("activeTab:", setActiveTab);

  const { data: dashboardData, isLoading } = useGetDashboardQuery();

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#2563EB]" />
      </div>
    );
  }

  const dashboardStats = [
    {
      title: "Active Projects",
      value: String(dashboardData?.activeProjects ?? 0),
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
      value: String(dashboardData?.closedProjects ?? 0),
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
      value: String(dashboardData?.drawingsAndApprovals ?? 0),
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
      value: dashboardData?.projectTimeline ? `${dashboardData.projectTimeline}` : "-",
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

  const deliveryTrackingStats = [
    {
      title: "In Transit",
      value: dashboardData?.deliveryTracking?.inTransit ?? "-",
      icon: Truck,
      borderColor: "#3B82F6",
      iconBg: "#3B82F6",
    },
    {
      title: "Staged",
      value: dashboardData?.deliveryTracking?.staged ?? "-",
      icon: BadgeDollarSign,
      borderColor: "#3B82F6",
      iconBg: "#3B82F6",
    },
    {
      title: "Ready",
      value: dashboardData?.deliveryTracking?.ready ?? "-",
      icon: PackageCheck,
      borderColor: "#3B82F6",
      iconBg: "#3B82F6",
    },
    {
      title: "Total Today",
      value: dashboardData?.deliveryTracking?.totalToday ?? "-",
      icon: Users,
      borderColor: "#3B82F6",
      iconBg: "#3B82F6",
    },
    {
      title: "Upcoming Deliveries",
      value: dashboardData?.deliveryTracking?.upcomingDeliveries ?? "-",
      icon: CalendarDays,
      borderColor: "#22C55E",
      iconBg: "#22C55E",
    },
    {
      title: "Deliveries This Week",
      value: dashboardData?.deliveryTracking?.deliveriesThisWeek ?? "-",
      icon: Clock3,
      borderColor: "#22C55E",
      iconBg: "#22C55E",
    },
    {
      title: "Delayed Deliveries",
      value: dashboardData?.deliveryTracking?.delayedDeliveries ?? "-",
      icon: AlertCircle,
      borderColor: "#22C55E",
      iconBg: "#22C55E",
    },
    {
      title: "Rescheduled Deliveries",
      value: dashboardData?.deliveryTracking?.rescheduledDeliveries ?? "-",
      icon: RefreshCcw,
      borderColor: "#22C55E",
      iconBg: "#22C55E",
    },
  ];

  const shipmentBreakdown = [
    {
      title: "Total Loads",
      value: `${dashboardData?.shipmentBreakdown?.totalLoads ?? "-"} loads`,
      description: `Active loads assigned to your shipments`,
      icon: ClipboardList,
      iconBg: "bg-violet-600",
      accent: "text-emerald-600",
      shape: "bg-violet-100",
      bgImg: Ship1,
    },
    {
      title: "Total Bundles",
      value: dashboardData?.shipmentBreakdown?.totalBundles !== null && dashboardData?.shipmentBreakdown?.totalBundles !== undefined
        ? `${dashboardData.shipmentBreakdown.totalBundles} bundles`
        : "-",
      description: dashboardData?.shipmentBreakdown?.totalBundles !== null && dashboardData?.shipmentBreakdown?.totalBundles !== undefined
        ? `Total bundles in transit: ${dashboardData.shipmentBreakdown.totalBundles}`
        : "No bundle information available",
      icon: CircleCheck,
      iconBg: "bg-emerald-600",
      accent: "text-emerald-600",
      shape: "bg-emerald-100",
      bgImg: Ship2,
    },
  ];

  const nextDelivery = dashboardData?.nextDelivery;
  const nextDeliveryData = nextDelivery ? {
    title: nextDelivery.deliveryNumber || "Delivery",
    description: nextDelivery.description || "",
    deliveryId: nextDelivery.deliveryId || "",
    status: nextDelivery.status === "in_transit" ? "inTransit" : (nextDelivery.status || "scheduled"),
    deliveryInfo: {
      date: nextDelivery.deliveryDate ? new Date(nextDelivery.deliveryDate).toLocaleDateString("en-US", {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      }) : "-",
      trackingStatus: nextDelivery.status === "in_transit" ? "Out for Delivery" : "-",
      eta: "-",
      timeWindow: "-",
      company: "-",
      driver: "-",
      driverPhone: "-",
      estimatedWeight: nextDelivery.estimatedWeight ? `${nextDelivery.estimatedWeight.toLocaleString()} lbs` : "-",
      equipment: [],
    },
    siteContact: {
      name: "-",
      phone: "-",
      instructions: "-",
      specialNotes: "-",
    },
    logistics: {
      company: "-",
      driver: "-",
      phone: "-",
      communications: [],
    },
  } : null;

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
        {dashboardStats.map((stat, index) => (
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

      {nextDeliveryData && (
        <NextDeliveryCard data={nextDeliveryData} dashboardpage={true} />
      )}
    </div>
  );
};

export default Dashboard;
