import { useState } from "react";
import ChatInfoDrawer from "./chatInfoModal";
import { Search, MessageCircle, MoveLeft, VideoIcon, AlertCircle } from "lucide-react";
import Megaphone from "../../assets/new-images/megaphone.svg";

const departments = [
  { name: "Marketing Team", color: "bg-blue-500", count: 3 },
  { name: "Accounting Team", color: "bg-green-500" },
  { name: "Construction Team", color: "bg-yellow-500", count: 1 },
  { name: "Plant Management", color: "bg-purple-500" },
];

const directChats = [
  {
    name: "Michael Chen",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Sarah Johnson",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "David Miller",
    avatar: "https://randomuser.me/api/portraits/men/75.jpg",
  },
];

export default function CommunicationView() {
  const [activeTab, setActiveTab] = useState<"departments" | "direct">(
    "departments"
  );
  const [activeChat, setActiveChat] = useState(false);
  const [mobileChatOpen, setMobileChatOpen] = useState(false);
  const [chatMeta, setChatMeta] = useState<{
    name: string;
    type: "department" | "direct";
  } | null>(null);
  const [openInfoModal, setOpenInfoModal] = useState(false);
  return (
    <div className="h-[calc(100vh-90px)] rounded-xl overflow-hidden p-5">
      <div className="h-full overflow-hidden bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] relative">
        <div className="flex border-b">
          <div className={`md:w-[320px] w-full md:border-r flex-col bg-white ${mobileChatOpen ? "hidden" : "flex"}`}>
            <div className="p-4 pb-0 flex items-center gap-3">
              <div className="relative">
                <img
                  src="https://i.pravatar.cc/40"
                  className="w-10 h-10 rounded-full"
                />
                <span className="absolute left-7 top-7 w-3 h-3 bg-green-500 rounded-full" />
              </div>
              <div>
                <p className="font-semibold text-base text-[#111827]">Sarah Johnson</p>
                <p className="text-sm text-[#6B7280]">Marketing</p>
              </div>
            </div>

            <div className="p-4 border-b">
              <div className="flex items-center border border-[#D1D5DB] rounded-lg px-3 py-2">
                <Search className="h-4 w-4 text-[#9CA3AF]" />
                <input
                  placeholder="Search chats..."
                  className="ml-2 outline-none w-full text-sm placeholder:text-[#9CA3AF] text-[#111827]"
                />
              </div>
            </div>

            <div className="flex border-b">
              <button
                onClick={() => setActiveTab("departments")}
                className={`flex-1 py-3 text-sm font-medium ${
                  activeTab === "departments"
                    ? "text-[#2563EB] border-b-2 border-[#2563EB]"
                    : "text-[#6B7280] border-b-2 border-transparent"
                }`}
              >
                Departments
              </button>

              <button
                onClick={() => setActiveTab("direct")}
                className={`flex-1 py-3 text-sm font-medium ${
                  activeTab === "direct"
                    ? "text-[#2563EB] border-b-2 border-[#2563EB]"
                    : "text-[#6B7280] border-b-2 border-transparent"
                }`}
              >
                Direct
              </button>
            </div>

            <div className="p-2 space-y-1 h-[calc(100vh-413px)] overflow-auto scroll-hide">
              {activeTab === "departments" &&
                departments.map((item) => (
                  <div
                    key={item.name}
                    onClick={() => {
                      setActiveChat(true);
                      setChatMeta({
                        name: item.name,
                        type: "department",
                      });
                      if (window.innerWidth < 767) {
                        setMobileChatOpen(true);
                      }
                    }}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer
                      ${
                        chatMeta?.name === item.name && chatMeta?.type === "department"
                          ? "bg-[#EFF6FF]"
                          : "hover:bg-[#EFF6FF]"
                      }
                    `}
                  >
                    <div
                      className={`w-8 h-8 rounded-[8px] ${item.color} flex items-center justify-center text-white`}
                    >
                      <img src={Megaphone} alt="" />
                    </div>

                    <span className="flex-1 text-sm font-medium text-[#111827]">
                      {item.name}
                    </span>

                    {item.count && (
                      <span className="bg-[#3B82F6] text-white text-xs px-2 py-0.5 rounded-full">
                        {item.count}
                      </span>
                    )}
                  </div>
                ))}

              {activeTab === "direct" &&
                directChats.map((user) => (
                  <div
                    key={user.name}
                    onClick={() => {
                      setActiveChat(true);
                      setChatMeta({
                        name: user.name,
                        type: "direct",
                      });
                      if (window.innerWidth < 767) {
                        setMobileChatOpen(true);
                      }
                    }}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer
                      ${
                        chatMeta?.name === user.name && chatMeta?.type === "direct"
                          ? "bg-[#EFF6FF]"
                          : "hover:bg-[#EFF6FF]"
                      }
                    `}
                  >

                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />

                    <span className="font-medium text-sm text-[#111827]">
                      {user.name}
                    </span>
                  </div>
                ))}
            </div>

            <div className="p-4 border-t text-[#4B5563] flex justify-center h-[58px]">
              <span className="text-sm flex justify-center items-center font-medium">+ New Chat</span>
            </div>
          </div>
          <div className={`flex-1 ${mobileChatOpen ? "md:flex" : "hidden"} md:flex flex-col`}>
            <div className="flex-1 flex flex-col ">
              {!activeChat ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <div className="text-gray-300 text-6xl mb-4">
                    <MessageCircle className="h-16 w-16" />
                  </div>
                  <p className="text-lg font-medium text-[#111827]">
                    Select a chat to start messaging
                  </p>
                  <p className="text-base text-[#6B7280] mt-2">
                    Choose from your departments, direct messages, or
                    cross-department channels
                  </p>
                </div>
              ) : (
                <>
                  <div className="border-b px-6 py-4 flex items-center justify-between bg-white">
                    <div className="flex items-center cursor-pointer gap-3">
                      <div className="h-10 flex items-center md:hidden" onClick={() => setMobileChatOpen(false)}>
                        <MoveLeft className="h-5 w-5 text-[#6B7280]" />
                      </div>
                      <div className="w-10 h-10 rounded-[8px] bg-[#3B82F6] flex items-center justify-center text-white" onClick={() => setOpenInfoModal(true)}>
                        <img src={Megaphone} alt="" />
                      </div>
                      <div onClick={() => setOpenInfoModal(true)}>
                        <p className="font-semibold text-base text-[#111827]">
                          Marketing Team
                        </p>
                        <p className="text-sm text-[#6B7280] flex items-center gap-1">
                          2 members <span className="text-3xl leading-[14px]">·</span> Marketing
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center md:gap-5 gap-2 text-[#6B7280]">
                      {/* <img className="cursor-pointer" src={CallIcon} alt="" /> */}
                      <VideoIcon className="h-5 w-5 cursor-pointer" />
                      <span onClick={() => setOpenInfoModal(true)} className="cursor-pointer">
                      <AlertCircle className="h-5 w-5 cursor-pointer" />
                      </span>
                    </div>
                  </div>

                  <div className="p-6 space-y-6 h-[calc(100vh-314px)] overflow-auto bg-white">
                    <div className="flex gap-3 items-start">
                      <img
                        src="https://i.pravatar.cc/40?img=3"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium text-[#111827] text-sm">John Doe</p>
                        <div className="mt-1 bg-[#F3F4F6] rounded-[10px] px-4 py-3 max-w-md text-[13px]">
                          Hi, I need a quote for a 40×60 workshop in Texas.
                          <p className="text-[11px] text-[#767676] mt-1">
                            2024-10-10 09:30 pm
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 items-start justify-end">
                      <div className="text-right">
                        <p className="font-medium text-[#111827] text-sm">Sarah Lee</p>
                        <div className="mt-1 text-start bg-[#2563EB] text-white rounded-[10px] text-[13px] px-4 py-3 max-w-md">
                          Hello John! I'd be happy to help you with that. Can
                          you tell me more about the intended use and
                          requirements?
                          <p className="text-[11px] text-[#E5E7EB] mt-1">
                            2024-10-10 09:30 pm
                          </p>
                        </div>
                      </div>
                      <img
                        src="https://i.pravatar.cc/40?img=5"
                        className="w-8 h-8 rounded-full"
                      />
                    </div>

                    <div className="flex gap-3 items-start">
                      <div className="text-2xl">🤖</div>
                      <div>
                        <p className="font-medium text-[#111827] text-sm">
                          Artificial Intelligence
                        </p>
                        <div className="mt-1 bg-[#F3F4F6] rounded-[10px] px-4 py-3 max-w-md text-[13px]">
                          Okay Sir, sending details to your inbox
                          <p className="text-[11px] text-[#767676] mt-1">
                            2024-10-10 09:30 pm
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 items-start justify-end">
                      <div className="text-right">
                        <p className="font-medium text-[#111827] text-sm">Sarah Lee</p>
                        <div className="mt-1 text-start bg-[#2563EB] text-white rounded-[10px] text-[13px] px-4 py-3 max-w-md">
                          Hello John! I'd be happy to help you with that. Can
                          you tell me more about the intended use and
                          requirements?
                          <p className="text-[11px] text-[#E5E7EB] mt-1">
                            2024-10-10 09:30 pm
                          </p>
                        </div>
                      </div>
                      <img
                        src="https://i.pravatar.cc/40?img=5"
                        className="w-8 h-8 rounded-full"
                      />
                    </div>

                    <div className="flex gap-3 items-start">
                      <div className="text-2xl">🤖</div>
                      <div>
                        <p className="font-medium text-[#111827] text-sm">
                          Artificial Intelligence
                        </p>
                        <div className="mt-1 bg-[#F3F4F6] rounded-[10px] px-4 py-3 max-w-md text-[13px]">
                          Okay Sir, sending details to your inbox
                          <p className="text-[11px] text-[#767676] mt-1">
                            2024-10-10 09:30 pm
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 items-start justify-end">
                      <div className="text-right">
                        <p className="font-medium text-[#111827] text-sm">Sarah Lee</p>
                        <div className="mt-1 text-start bg-[#2563EB] text-white rounded-[10px] text-[13px] px-4 py-3 max-w-md">
                          Hello John! I'd be happy to help you with that. Can
                          you tell me more about the intended use and
                          requirements?
                          <p className="text-[11px] text-[#E5E7EB] mt-1">
                            2024-10-10 09:30 pm
                          </p>
                        </div>
                      </div>
                      <img
                        src="https://i.pravatar.cc/40?img=5"
                        className="w-8 h-8 rounded-full"
                      />
                    </div>

                    <div className="flex gap-3 items-start">
                      <div className="text-2xl">🤖</div>
                      <div>
                        <p className="font-medium text-[#111827] text-sm">
                          Artificial Intelligence
                        </p>
                        <div className="mt-1 bg-[#F3F4F6] rounded-[10px] px-4 py-3 max-w-md text-[13px]">
                          Okay Sir, sending details to your inbox
                          <p className="text-[11px] text-[#767676] mt-1">
                            2024-10-10 09:30 pm
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="px-4 py-[10px] border-t flex items-center gap-3 bg-white">
              <input
                placeholder="Type your message..."
                className="flex-1 border border-[#D6D6D6] rounded-[8px] px-4 h-[40px] text-sm placeholder:text-[#767676] flex items-center outline-none"
              />
              <button className="bg-gradient-to-r from-[#2563EB] to-[#4F46E5] text-white px-6 h-[38px] flex rounded-[8px] items-center gap-2">
                ➤ Send
              </button>
            </div>
          </div>
        </div>
        <div className="flex items-center h-11">
          <div className={`md:w-[320px] w-full px-4 py-1 text-sm text-[#6B7280] items-center justify-center gap-1 ${mobileChatOpen ? "hidden" : "flex"} md:flex`}>
            <span className="inline-block mr-1">🟢</span> Online <span className="text-3xl">·</span> 4 users online
          </div>
          <div className={`flex-1 text-center text-sm text-[#6B7280] py-3 ${mobileChatOpen ? "md:flex" : "hidden"} md:flex justify-center`}>
            Last sync: just now
          </div>
        </div>
        <ChatInfoDrawer open={openInfoModal} onClose={() => setOpenInfoModal(false)} />
      </div>
    </div>
  );
}
