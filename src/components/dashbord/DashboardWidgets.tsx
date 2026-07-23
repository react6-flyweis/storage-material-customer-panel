import BlueStackIcon from "@/assets/icon/BlueStackIcon.svg";
import InvoiceDueIcon from "@/assets/icon/InvoiceDueIcon.svg";
import TotalExpensesIcon from "@/assets/icon/TotalExpensesIcon.svg";
import PurpleHashIcon from "@/assets/icon/PurpleHashIcon.svg";

import BlueCallIcon from "@/assets/icon/BlueCallIcon.svg";
import GreenMailIcon from "@/assets/icon/GreenMailIcon.svg";
import PurpleCalendarIcon from "@/assets/icon/PurpleCalendarIcon.svg";
import { useNavigate } from "react-router-dom";
import type { DashboardResponseData } from "@/redux/api/dashboardApi";

interface DashboardWidgetsProps {
  data?: DashboardResponseData;
}

const formatCurrency = (val?: number | null) => {
  if (val === undefined || val === null) return "$0";
  return `$${val.toLocaleString()}`;
};

const formatTime = (dateStr?: string) => {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return dateStr;
  }
};

const getPriorityDotColor = (priority?: string) => {
  const norm = (priority || "").toLowerCase();
  if (norm === "high") return "bg-[#EF4444]";
  if (norm === "medium") return "bg-[#EAB308]";
  return "bg-[#3B82F6]";
};

const DashboardWidgets = ({ data }: DashboardWidgetsProps) => {
  const navigate = useNavigate();

  const financialCards = [
    {
      title: formatCurrency(data?.totalProjectValue),
      subtitle: "Total Project Value",
      icon: BlueStackIcon,
      bg: "bg-[#E9F8FB]",
    },
    {
      title: formatCurrency(data?.totalPaid),
      subtitle: "Total Paid",
      icon: InvoiceDueIcon,
      bg: "bg-[#E9F5F4]",
    },
    {
      title: formatCurrency(data?.totalPending),
      subtitle: "Total Pending",
      icon: TotalExpensesIcon,
      bg: "bg-[#FCEFEA]",
    },
    {
      title: data?.upcomingInvoice ? String(data.upcomingInvoice) : "None",
      subtitle: "Upcoming Invoice",
      icon: PurpleHashIcon,
      bg: "bg-purple-50",
    },
  ];

  const recentMessages = data?.recentMessages || [];
  const notificationsFeed = data?.notificationsFeed || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
      {/* Column 1: Financial Overview */}
      <div className="bg-white rounded-md xl:p-6 p-4 flex flex-col h-full">
        <h2 className="md:text-lg font-light text-black-400 mb-6">
          Financial Overview
        </h2>
        <div className="flex flex-col gap-4">
          {financialCards.map((card, idx) => (
            <div
              key={idx}
              className="border border-gray-100 rounded-lg p-4 flex items-center justify-between"
            >
              <div>
                <h3 className="xl:text-lg font-medium text-gray-900">
                  {card.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1">{card.subtitle}</p>
              </div>
              <div
                className={`w-12 h-12 rounded-lg ${card.bg} flex items-center justify-center`}
              >
                <img src={card.icon} alt="" className="h-5 w-5" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Column 2: Recent Messages / RFIs */}
      <div className="bg-white rounded-md xl:p-6 p-4 flex flex-col h-full">
        <h2 className="md:text-[17px] font-semibold text-black-400 mb-6">
          Recent Messages / RFIs
        </h2>
        <div className="flex flex-col gap-6">
          {recentMessages.length === 0 ? (
            <p className="text-sm text-gray-500">No recent messages</p>
          ) : (
            recentMessages.slice(0, 4).map((msg, idx) => {
              const icons = [BlueCallIcon, GreenMailIcon, PurpleCalendarIcon];
              const bgs = ["bg-[#DBEAFE]", "bg-[#DCFCE7]", "bg-[#F3E8FF]"];
              const iconImg = icons[idx % icons.length];
              const bgClass = bgs[idx % bgs.length];

              return (
                <div key={msg._id || idx} className="flex items-center gap-4">
                  <div
                    className={`w-8 h-8 rounded-lg ${bgClass} flex items-center justify-center flex-shrink-0`}
                  >
                    <img src={iconImg} alt="" className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-gray-900 leading-tight">
                      {msg.content}
                    </h4>
                    <p className="text-xs mt-1 text-[#717171]">
                      {msg.senderName || "Admin"} • {msg.channel || "general"}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-gray-400">
                        {formatTime(msg.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Column 3: Notifications Feed */}
      <div className="bg-white rounded-md xl:p-6 p-4 flex flex-col h-full">
        <div className="p-0 pb-0 grow">
          <h2 className="text-sm font-bold text-[#3E4857] pb-4 mb-2 border-b border-[#00000021]">
            Notifications
          </h2>
          <div className="flex flex-col gap-5">
            {notificationsFeed.length === 0 ? (
              <p className="text-sm text-gray-500">No new notifications</p>
            ) : (
              notificationsFeed.slice(0, 5).map((item) => (
                <div key={item._id} className="flex gap-3 items-start">
                  <div
                    className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${getPriorityDotColor(
                      item.priority
                    )}`}
                  />
                  <div>
                    <p className="text-sm text-gray-800 leading-relaxed font-medium">
                      {item.title}
                    </p>
                    <p className="text-xs text-[#888888] mt-1">{item.body}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="p-4 pb-0 border-t border-[#00000021] mt-4">
          <button
            className="w-full text-center text-(--text-color-primary-blue) font-medium text-sm hover:underline cursor-pointer"
            onClick={() => navigate("/notification")}
          >
            View All Notifications
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardWidgets;
