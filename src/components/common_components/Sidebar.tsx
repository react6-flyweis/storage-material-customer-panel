import React from "react";
import iconBg from "../../assets/sideBarIconBg.svg";
import { NAV_ITEMS } from "@/config/navigation.config";

interface SidebarProps {
  isOpen: boolean;
  activeTab: number;
  setActiveTab: (index: number) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  activeTab,
  setActiveTab,
}) => {
  return (
    <div
      className={`
            w-16 lg:w-20
            flex flex-col items-center
            min-h-screen h-full
            fixed left-0 top-0
            z-50 bg-[#1D51A4]
            transition-transform duration-300 ease-in-out
            ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          `}
    >
      <div className="mb-2 h-32 w-full "></div>

      <div className="flex flex-col w-full">
        {NAV_ITEMS.map((item, index) => (
          <div
            className="relative w-full h-19 flex items-center justify-end pr-3"
            key={index}
          >
            {activeTab === index && (
              <div className="absolute inset-y-0 right-0 h-full w-full z-10 pointer-events-none flex justify-end">
                <img
                  src={iconBg}
                  alt=""
                  className="h-full w-auto object-contain"
                />
              </div>
            )}

            <button
              onClick={() => setActiveTab(index)}
              className={`relative z-20 p-2.5 h-10 w-10 rounded-full flex justify-center items-center group focus:outline-none ${item.color}`}
            >
              <img
                src={item.icon}
                alt={item.title}
                className=" object-contain w-full transition-transform hover:scale-105 shadow-lg"
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
