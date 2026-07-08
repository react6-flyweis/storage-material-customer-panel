import { useState } from "react";
import MegaphoneIcon from "../../assets/new-images/megaphone.svg";
import { Bell, DownloadIcon, FileIcon, UserPlus, X } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function ChatInfoDrawer({ open, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<"members" | "files">("members");

  if (!open) return null;

  return (
    <div className="absolute right-[-1px] top-0 -bottom-[1px] inset-0 z-50 flex justify-end">
      <div className="w-[332px] h-full bg-white flex flex-col shadow-[0px_4px_4px_0px_#00000040]">
        <div className="p-4 flex items-center gap-8">
          <button onClick={onClose}>
            <X className="h-5 w-5 text-[#6B7280]" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#3B82F6] rounded-[8px] flex items-center justify-center">
                <img src={MegaphoneIcon} alt="" />
            </div>

            <div>
                <p className="font-semibold text-[#111827] text-base">Marketing Team</p>
                <p className="text-sm text-[#6B7280]">2 members · Marketing</p>
            </div>
          </div>
        </div>

        <p className="px-4 text-sm text-[#6B7280]">
          Marketing department discussions and campaigns
        </p>

        <button className="flex items-center justify-center text-sm gap-2 px-4 py-4 pt-6 text-[#6B7280]">
           <Bell className="h-5 w-5" />
           Mute
        </button>

        <div className="flex border-b">
          <button
            onClick={() => setActiveTab("members")}
            className={`flex-1 py-3 text-sm ${
              activeTab === "members"
                ? "text-[#2563EB] border-b-2 border-[#2563EB] font-medium"
                : "text-[#6B7280] border-b-2 border-transparent"
            }`}
          >
            Members
          </button>

          <button
            onClick={() => setActiveTab("files")}
            className={`flex-1 py-3 text-sm ${
              activeTab === "files"
                ? "text-[#2563EB] border-b-2 border-[#2563EB] font-medium"
                : "text-[#6B7280] border-b-2 border-transparent"
            }`}
          >
            Files
          </button>
        </div>

        <div className="flex-1 overflow-auto scroll-hide p-4">
          {activeTab === "members" && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src="https://i.pravatar.cc/40?img=1"
                  className="w-8 h-8 rounded-full"
                />
                <div className="flex-1">
                  <p className="font-medium text-[#111827] text-sm">John Doe</p>
                  <p className="text-[12px] text-[#6B7280]">Marketing</p>
                </div>
                <span className="px-3 py-1 text-xs bg-[#DBEAFE] text-[#2563EB] rounded-full">
                  Admin
                </span>
              </div>
              <div className="flex items-center gap-3">
                <img
                  src="https://i.pravatar.cc/40?img=1"
                  className="w-8 h-8 rounded-full"
                />
                <div className="flex-1">
                  <p className="font-medium text-[#111827] text-sm">John Doe</p>
                  <p className="text-[12px] text-[#6B7280]">Marketing</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <img
                  src="https://i.pravatar.cc/40?img=1"
                  className="w-8 h-8 rounded-full"
                />
                <div className="flex-1">
                  <p className="font-medium text-[#111827] text-sm">John Doe</p>
                  <p className="text-[12px] text-[#6B7280]">Marketing</p>
                </div>
              </div>

              <button className="flex items-center text-[#6B7280] text-sm justify-center gap-2 !mt-6 w-full">
                <UserPlus className="h-5 w-5" />
                 Add member
              </button>
            </div>
          )}

          {activeTab === "files" && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-[8px] bg-[#DBEAFE] flex items-center justify-center">
                  <FileIcon className="h-4 w-4 text-[#2563EB]" />
                </div>

                <div className="flex-1">
                  <p className="font-medium text-sm text-[#000]">
                    Q1-Marketing-Budget-2024
                  </p>
                  <p className="text-[12px] text-[#6B7280]">Sarah Johnson</p>
                </div>

                <button>
                  <DownloadIcon className="h-5 w-5 text-[#6B7280]" />
                </button>
              </div>
              
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
