import React from "react";
import logo from "../../assets/logo.png";
import bellIcon from "../../assets/bellIcon.svg";
import { useNavigate } from "react-router-dom";
import { Menu, User, Settings, LogOut } from "lucide-react";
import ProjectSearchPopover from "./ProjectSearchPopover";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logout } from "@/redux/slices/authSlice";
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
          <Menu className="w-6 h-6" />
        </button>

        <ProjectSearchPopover />
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
              <User className="w-5 h-5 text-gray-600" />
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
              <User className="w-4 h-4 text-gray-500" />
              <span>My profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigate("/settings")}
              className="flex items-center gap-3 px-4 py-2.5"
            >
              <Settings className="w-4 h-4 text-gray-500" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleSignOut}
              className="flex items-center gap-3 px-4 py-2.5 text-red-500 focus:text-red-600 focus:bg-red-50 font-medium"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex items-center shrink-0">
          <img
            src={logo}
            alt="Logo"
            className="object-contain max-h-10"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;

