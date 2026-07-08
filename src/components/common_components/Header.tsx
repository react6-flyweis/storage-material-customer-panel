import React from "react";
import logo from "../../assets/logo.svg";
import bellIcon from "../../assets/bellIcon.svg";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

interface HeaderProps {
  onMenuToggle: () => void;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const navigate = useNavigate();

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
          <button
            onClick={() => navigate("/notification")}
            className="text-gray-500 hover:text-gray-700 relative p-1 rounded-full hover:bg-gray-50 transition-colors"
          >
            <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center border-2 border-white">
              3
            </span>
            <img
              src={bellIcon}
              alt="notifications"
              className="w-8 h-6 object-contain"
            />
          </button>
        </div>
        {/* <div className="relative" ref={profileRef}>
          <button
            className="text-gray-500 hover:text-gray-700 relative focus:outline-none bg-(--button-bg-primary-color) rounded-full p-2"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4 text-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 20.25a7.5 7.5 0 0 1 15 0"
              />
            </svg>
          </button>
        </div> */}

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
