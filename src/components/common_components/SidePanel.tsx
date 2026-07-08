import { NAV_ITEMS } from "@/config/navigation.config";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CommonText } from "@/data/text/CommonText";
import React, { useState, useRef, useEffect } from "react";
import UserIcon from "../../assets/icon/UserIcon";
import { useNavigate } from "react-router-dom";

interface SidePanelProps {
  isOpen: boolean;
  activeTab: number;
  activeSubTab: string;
  onSubTabClick: (label: string, path: string) => void;
}

const SidePanel: React.FC<SidePanelProps> = ({
  isOpen,
  activeTab,
  activeSubTab,
  onSubTabClick,
}) => {
  const sidePanelPaddingTop = 24;
  const headerBlockHeight = 130;
  const itemHeight = 76;

  const topPosition =
    sidePanelPaddingTop + headerBlockHeight + activeTab * itemHeight;

  const currentNav = NAV_ITEMS[activeTab];
    const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSignOut = () => {
    navigate("/login");
  };

  return (
    <div
      className={`
        w-56 min-h-screen 
        fixed left-14 md:left-16 lg:left-20 top-0 
        z-40
        flex flex-col 
        transition-all duration-300 ease-in-out
        overflow-y-auto
        shrink-0
        ${isOpen ? "translate-x-0" : "-translate-x-[200%] md:translate-x-0"}
        bg-[#E5ECFF] p-3 pt-6
      `}
    >
      <div className="flex flex-col h-full fade-in duration-300">
         <div className="relative" ref={profileRef}>
        <div className="mb-2 mx-auto" onClick={() => setIsProfileOpen(!isProfileOpen)}>
          <h2 className="text-(--text-color-primary-blue) font-bold text-lg leading-tight mb-1">
            {CommonText.PanelName}
          </h2>
          <p className="text-black text-sm font-normal">
            {CommonText.UserEmail}
          </p>
        </div>
         {isProfileOpen && (
            <div className="absolute left-0 w-full bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-2 pb-2 border-b border-gray-100">
                <button
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-left"
                  onClick={() => {
                    navigate("/profile");
                    setIsProfileOpen(false);
                  }}
                >
                  <UserIcon className="w-5 h-5 text-gray-500" />

                  <p className="text-(--text-color-gray-two) font-light">
                    My profile
                  </p>
                </button>
                <button
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-left"
                  onClick={() => {
                    setIsProfileOpen(false);
                    navigate("/settings");
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5 text-(--text-color-gray-two)"
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
                  <p className="text-[#3E4857] font-light">Settings</p>
                </button>
              </div>
              <div className="px-2 pt-2">
                <button
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors text-left font-medium"
                  onClick={handleSignOut}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
                    />
                  </svg>
                  Sign out
                </button>
              </div>
            </div>
          )}
          </div>


        <div className="flex items-center justify-between rounded-md p-1 mb-6">
          <span className="md:text-sm text-black font-normal bg-[#D8DEEA] px-10 py-1">
            TODAY
          </span>
          <div className="flex">
            <button className="p-1 hover:bg-gray-300 rounded text-gray-500">
              <ChevronLeft />
            </button>
            <button className="p-1 hover:bg-gray-300 rounded text-gray-500">
              <ChevronRight />
            </button>
          </div>
        </div>
      </div>
      <div
        className="absolute left-4 right-4 transition-all duration-300 ease-out pointer-events-auto"
        style={{ top: `${topPosition}px` }}
      >
        {/* Title */}
        {currentNav?.title && (
          <button
            className={`w-full text-sm text-white rounded-lg md:py-3 py-2 font-medium shadow-sm ${currentNav.color}`}
          >
            {currentNav.title}
          </button>
        )}

        {/* Sub-items */}
        {currentNav.items?.length ? (
          <div className="flex flex-col gap-2 fade-in pl-0">
            {currentNav.items.map((item) => {
              const isActive = activeSubTab === item.label;

              return (
                <button
                  key={item.label}
                  onClick={() => onSubTabClick(item.label, item.path)}
                  style={
                    isActive
                      ? {
                          borderColor: currentNav.color
                            .replace("bg-[", "")
                            .replace("]", ""),
                        }
                      : undefined
                  }
                  className={`w-full py-3 px-4 rounded-lg shadow-sm text-left text-sm transition-colors font-semibold
    ${
      isActive
        ? `border-2 ${currentNav.color} text-white`
        : "bg-white text-gray-600 hover:bg-gray-50 border-2 border-transparent"
    }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default SidePanel;
