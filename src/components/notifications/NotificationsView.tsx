import { useState } from "react";
import BlueBellIcon from "@/assets/BlueBellIcon.svg";
import YellowBellIcon from "@/assets/yellowBellIcon.svg";
import GreenBellIcon from "@/assets/greenBellIcon.svg";
import SalmonBellIcon from "@/assets/salmonBellIcon.svg";
import StatCard from "../ui/stat-card";
import { UserPlus, FileText, Calendar, DollarSign, Bell, CheckCheck } from "lucide-react";
import TitleSubtitle from "../common_components/TitleSubtitle";
import {
  useGetNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
  type NotificationItem,
} from "@/redux/api/notificationsApi";

// Skeleton Component for Stat Cards
const StatCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 animate-pulse flex items-center justify-between">
    <div className="space-y-2">
      <div className="h-3 w-16 bg-gray-200 rounded"></div>
      <div className="h-6 w-10 bg-gray-300 rounded"></div>
    </div>
    <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
  </div>
);

// Skeleton Component for Notification Item
const NotificationSkeleton: React.FC = () => (
  <div className="p-6 flex flex-col md:flex-row gap-4 border-b border-gray-100 animate-pulse">
    <div className="w-10 h-10 bg-gray-200 rounded-md shrink-0"></div>
    <div className="flex-1 space-y-2">
      <div className="h-4 w-48 bg-gray-200 rounded"></div>
      <div className="h-3 w-3/4 bg-gray-100 rounded"></div>
      <div className="h-3 w-24 bg-gray-100 rounded"></div>
    </div>
  </div>
);

// Format date helper function
const formatNotificationTime = (dateString: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 172800) return "Yesterday";
  return `${Math.floor(diffInSeconds / 86400)} days ago`;
};

const NotificationsView = () => {
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const { data, isLoading, isFetching, error } = useGetNotificationsQuery(
    { filter: activeFilter },
    { pollingInterval: 30000 }
  );
  const [markNotificationAsRead] = useMarkNotificationAsReadMutation();
  const [markAllNotificationsAsRead, { isLoading: isMarkingAll }] = useMarkAllNotificationsAsReadMutation();

  const handleNotificationClick = (notification: NotificationItem) => {
    if (!notification.isRead) {
      markNotificationAsRead(notification._id);
    }
  };

  const handleMarkAllRead = () => {
    markAllNotificationsAsRead();
  };

  const notifications: NotificationItem[] = data?.data?.notifications || [];
  const stats = data?.data?.stats;
  const unreadCount = stats?.unread ?? 0;

  const equipmentStats = [
    {
      title: "Total",
      value: stats?.total !== undefined ? String(stats.total) : "0",
      icon: (
        <img
          src={BlueBellIcon}
          alt="total-notifications"
          className="md:size-5 size-4"
        />
      ),
      color: "bg-[#1D51A4]",
    },
    {
      title: "Unread",
      value: stats?.unread !== undefined ? String(stats.unread) : "0",
      icon: (
        <img src={GreenBellIcon} alt="unread-notifications" className="md:size-5 size-4" />
      ),
      color: "bg-[#3AB449]",
    },
    {
      title: "High Priority",
      value: stats?.highPriority !== undefined ? String(stats.highPriority) : "0",
      icon: (
        <img
          src={YellowBellIcon}
          alt="high-priority-notifications"
          className="md:size-5 size-4"
        />
      ),
      color: "bg-[#F59E0B]",
    },
    {
      title: "Today",
      value: stats?.today !== undefined ? String(stats.today) : "0",
      icon: (
        <img
          src={SalmonBellIcon}
          alt="today-notifications"
          className="md:size-5 size-4"
        />
      ),
      color: "bg-[#FD8D5B]",
    },
  ];

  const filterTabs = [
    { label: "All", value: "all" },
    { label: "Unread", value: "unread" },
    { label: "Drawings", value: "drawings" },
    { label: "Finance", value: "finance" },
    { label: "Meetings", value: "meetings" },
  ];

  const getIconStyles = (type: string) => {
    switch (type) {
      case "drawing":
        return { bg: "bg-blue-100", text: "text-blue-600" };
      case "payment":
      case "finance":
        return { bg: "bg-yellow-100", text: "text-yellow-600" };
      case "system":
        return { bg: "bg-red-100", text: "text-red-600" };
      case "meeting":
        return { bg: "bg-cyan-100", text: "text-cyan-600" };
      case "user":
      case "new":
        return { bg: "bg-[#DBEAFE]", text: "text-[#1D51A4]" };
      default:
        return { bg: "bg-gray-100", text: "text-gray-600" };
    }
  };

  const renderIcon = (type: string) => {
    const styles = getIconStyles(type);
    let IconComponent = Bell;

    if (type === "user" || type === "new") {
      IconComponent = UserPlus;
    } else if (type === "drawing") {
      IconComponent = FileText;
    } else if (type === "payment" || type === "finance") {
      IconComponent = DollarSign;
    } else if (type === "meeting") {
      IconComponent = Calendar;
    } else if (type === "system") {
      IconComponent = Bell;
    }

    return (
      <div
        className={`w-10 h-10 rounded-md flex items-center justify-center shrink-0 ${styles.bg} ${styles.text}`}
      >
        <IconComponent className="w-5 h-5" />
      </div>
    );
  };

  return (
    <div className="p-5 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <TitleSubtitle
          title="Notifications"
          subtitle="Stay updated with project changes, approvals, drawings, dispatches, billings, and communication."
        />
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            disabled={isMarkingAll}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-[#1D51A4] hover:bg-blue-100 font-medium text-xs sm:text-sm rounded-lg transition-colors cursor-pointer self-start sm:self-auto disabled:opacity-50"
          >
            <CheckCheck className="w-4 h-4" />
            <span>{isMarkingAll ? "Marking all read..." : "Mark all as read"}</span>
          </button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {isLoading
          ? Array.from({ length: 4 }).map((_, idx) => (
            <StatCardSkeleton key={idx} />
          ))
          : equipmentStats.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
            />
          ))}
      </div>

      {/* Filters Header */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-col md:flex-row items-start md:items-center gap-4">
        <span className="text-gray-700 font-medium md:text-lg text-xs mr-2">
          Filter by:
        </span>
        <div className="flex flex-wrap gap-2">
          {filterTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveFilter(tab.value)}
              className={`px-6 py-2 rounded-lg md:text-sm text-xs font-medium transition-colors
                ${activeFilter === tab.value
                  ? "bg-(--button-bg-primary-color) text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading || isFetching ? (
          <div className="divide-y divide-gray-100">
            {Array.from({ length: 5 }).map((_, idx) => (
              <NotificationSkeleton key={idx} />
            ))}
          </div>
        ) : error ? (
          <div className="p-12 text-center text-red-500 font-medium">
            Failed to load notifications. Please try again.
          </div>
        ) : notifications.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                onClick={() => handleNotificationClick(notification)}
                className={`p-6 flex flex-col md:flex-row gap-4 hover:bg-gray-50 transition-colors cursor-pointer group ${!notification.isRead ? "bg-blue-50/30" : ""
                  }`}
              >
                {/* Icon */}
                {renderIcon(notification.type)}

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="text-gray-900 font-semibold md:text-base text-xs">
                      {notification.title}
                    </h3>
                    {!notification.isRead && (
                      <span className="inline-block w-2 h-2 rounded-full bg-blue-600 shrink-0"></span>
                    )}
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed mb-2">
                    {notification.body}
                  </p>
                  <span className="text-gray-400 text-xs font-medium">
                    {formatNotificationTime(notification.createdAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-gray-500">
            No notifications found in this category.
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsView;
