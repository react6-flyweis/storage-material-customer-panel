import React from "react";
import logo from "../../assets/logo.svg";
import bellIcon from "../../assets/bellIcon.svg";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logout } from "@/redux/slices/authSlice";
import UserIcon from "../../assets/icon/UserIcon";
import { useGetNotificationsQuery } from "@/redux/api/notificationsApi";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";

interface HeaderProps {
  onMenuToggle: () => void;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const email = useAppSelector((state) => state.auth.user?.email);

  const { data: notificationsData } = useGetNotificationsQuery(
    { filter: "all" },
    { pollingInterval: 30000 }
  );

  const unreadCount = notificationsData?.data?.stats?.unread ?? 0;

  const handleSignOut = () => {
    dispatch(logout());
    localStorage.removeItem("activeTab");
    localStorage.removeItem("activeSubTab");
    window.location.href = "/login";
  };

  return (
    <header className="flex items-center justify-between p-3 md:p-4 bg-white shadow-sm rounded-none z-40 sticky top-0 w-full gap-2 md:gap-4">
      <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
        <button
          className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          onClick={onMenuToggle}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>

        <div className="hidden md:flex items-center bg-[#F8F9FA] rounded-md px-4 xl:py-2 py-1.5 flex-1 max-w-[200px] border border-[#D1D5DB] focus-within:border-[#9CA3AF] focus-within:ring-2 focus-within:ring-blue-100 transition-all">
          <Search className="w-5 h-5 text-[#9CA3AF] mr-2" />
          <input
            type="text"
            placeholder="Search projects..."
            className="bg-transparent border-none outline-none text-sm w-full text-gray-700 placeholder-gray-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 lg:gap-6">
        <div className="relative">
          <Button
            variant="ghost"
            onClick={() => navigate("/notification")}
            size="icon"
            className="rounded-full"
          >
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 min-w-[20px] px-1 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center border-2 border-white">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
            <img
              src={bellIcon}
              alt="notifications"
              className="w-8 h-6 object-contain"
            />
          </Button>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full">
              <UserIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 mt-2">
            <DropdownMenuLabel className="font-normal py-3 px-4">
              <div className="flex flex-col space-y-1">
                {/* <p className="text-sm font-semibold text-[#3A57E8] leading-none">
               Customer Panel
                </p> */}
                <p className="text-xs text-gray-500 leading-none">
                  {email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => navigate("/profile")}
              className="flex items-center gap-3 px-4 py-2.5"
            >
              <UserIcon className="w-4 h-4 text-gray-500" />
              <span>My profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigate("/settings")}
              className="flex items-center gap-3 px-4 py-2.5"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4 text-gray-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 0 1 0 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 0 1 0-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleSignOut}
              className="flex items-center gap-3 px-4 py-2.5 text-red-500 focus:text-red-600 focus:bg-red-50 font-medium"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
                />
              </svg>
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex items-center shrink-0">
          <img
            src={logo}
            alt="Logo"
            className="object-contain"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;

