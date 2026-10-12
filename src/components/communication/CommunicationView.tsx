import { useState, useEffect, useRef } from "react";
import ChatInfoDrawer from "./chatInfoModal";
import { Search, MessageCircle, MoveLeft, AlertCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import logo from "../../assets/logo.png";
import { useAppSelector } from "@/redux/hooks";
import { createChatSocket, type Socket } from "@/lib/socket";
import {
  useGetDirectChatSummaryQuery,
  useGetDirectChatMessagesQuery,
  useSendDirectChatMessageMutation,
  type DirectChatMessage,
} from "@/redux/api/customerChatApi";

function formatTime(val?: string) {
  if (!val) return "";
  const d = new Date(val);
  if (isNaN(d.getTime())) return "";

  const now = new Date();
  const isToday =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();

  const timeStr = d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  if (isToday) return timeStr;

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    d.getDate() === yesterday.getDate() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getFullYear() === yesterday.getFullYear();

  if (isYesterday) return `Yesterday ${timeStr}`;

  return `${d.toLocaleDateString("en-US", { month: "short", day: "numeric" })} ${timeStr}`;
}

export default function CommunicationView() {
  const currentUser = useAppSelector((state) => state.auth.user);

  const [mobileChatOpen, setMobileChatOpen] = useState(true);
  const [openInfoModal, setOpenInfoModal] = useState(false);
  const [inputText, setInputText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [messages, setMessages] = useState<DirectChatMessage[]>([]);
  const [isSocketConnected, setIsSocketConnected] = useState(false);

  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // RTK Query hooks
  const { data: summaryData, refetch: refetchSummary } = useGetDirectChatSummaryQuery(
    undefined,
    { pollingInterval: 20000 }
  );

  const { data: historyData } = useGetDirectChatMessagesQuery({
    page: 1,
    limit: 100,
  });

  const [sendDirectMessage, { isLoading: isSending }] =
    useSendDirectChatMessageMutation();

  // Load backend message history
  useEffect(() => {
    if (historyData?.data) {
      const rawList: DirectChatMessage[] = Array.isArray(historyData.data)
        ? historyData.data
        : historyData.data.messages || [];

      const sorted = [...rawList].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      setMessages(sorted);
    }
  }, [historyData]);

  // Real-time socket
  useEffect(() => {
    const customerId = currentUser?._id || currentUser?.customerId;
    const socket = createChatSocket();
    socketRef.current = socket;

    socket.on("connect", () => {
      setIsSocketConnected(true);
      if (customerId) {
        socket.emit("join_customer_direct", { customerId });
      }
    });

    socket.on("disconnect", () => {
      setIsSocketConnected(false);
    });

    socket.on("customer_direct_message", (incoming: any) => {
      const newMsg: DirectChatMessage = {
        messageId: incoming.messageId || incoming._id,
        _id: incoming._id || incoming.messageId,
        customerId: incoming.customerId,
        senderType: incoming.senderType || "admin",
        senderName: incoming.senderName || "MR Storage Staff",
        content: incoming.content,
        createdAt: incoming.createdAt || new Date().toISOString(),
        isReadByCustomer: false,
        isReadByStaff: true,
      };

      setMessages((prev) => {
        const idToMatch = newMsg.messageId || newMsg._id;
        if (idToMatch && prev.some((m) => (m.messageId || m._id) === idToMatch)) {
          return prev;
        }
        return [...prev, newMsg];
      });

      refetchSummary();
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [currentUser?._id, currentUser?.customerId, refetchSummary]);

  // Scroll to bottom on updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message
  const handleSendMessage = async () => {
    const text = inputText.trim();
    if (!text || isSending) return;

    const tempId = `temp-${Date.now()}`;
    const optimisticMsg: DirectChatMessage = {
      messageId: tempId,
      _id: tempId,
      customerId: currentUser?._id || currentUser?.customerId,
      senderType: "customer",
      senderName: currentUser?.firstName || "You",
      content: text,
      createdAt: new Date().toISOString(),
      isReadByCustomer: true,
      isReadByStaff: false,
    };

    setMessages((prev) => [...prev, optimisticMsg]);
    setInputText("");

    try {
      await sendDirectMessage({ content: text }).unwrap();
      refetchSummary();
    } catch {
      // Message stays in UI
    }
  };

  const summary = summaryData?.data;
  const unreadCount = summary?.unreadCount || 0;
  const lastMessage =
    messages.length > 0
      ? messages[messages.length - 1]
      : summary?.lastMessage;

  const filteredMessages = searchQuery.trim()
    ? messages.filter((m) =>
        m.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : messages;

  // Customer initials
  const customerInitials = (currentUser?.firstName || "Customer")
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase() || "CU";

  return (
    <div className="h-[calc(100vh-90px)] rounded-xl overflow-hidden p-5">
      <div className="h-full overflow-hidden bg-white rounded-xl border border-[#E5E7EB] relative flex flex-col">
        <div className="flex flex-1 min-h-0">
          {/* ======================= LEFT SIDEBAR ======================= */}
          <div
            className={`md:w-[320px] w-full md:border-r flex flex-col bg-white ${
              mobileChatOpen ? "hidden" : "flex"
            } md:flex`}
          >
            {/* Real User Profile with Avatar Component */}
            <div className="p-4 pb-3 flex items-center gap-3 border-b">
              <div className="relative">
                <Avatar className="w-10 h-10 border border-gray-200 bg-blue-50">
                  {currentUser?.photo ? (
                    <AvatarImage
                      src={currentUser.photo}
                      alt={currentUser.firstName}
                      className="object-cover"
                    />
                  ) : null}
                  <AvatarFallback className="bg-blue-600 text-white font-semibold text-sm">
                    {customerInitials}
                  </AvatarFallback>
                </Avatar>
                <span
                  className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                    isSocketConnected ? "bg-green-500" : "bg-amber-400"
                  }`}
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-base text-[#111827] truncate">
                  {currentUser?.firstName || "Customer"}
                </p>
                <p className="text-xs text-[#6B7280] truncate">
                  {currentUser?.email ||
                    (currentUser?.customerId
                      ? `ID: ${currentUser.customerId}`
                      : "Customer Account")}
                </p>
              </div>
            </div>

            {/* Search Input */}
            <div className="p-4 border-b">
              <div className="flex items-center border border-[#D1D5DB] rounded-lg px-3 py-2">
                <Search className="h-4 w-4 text-[#9CA3AF]" />
                <input
                  placeholder="Search chats..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="ml-2 outline-none w-full text-sm placeholder:text-[#9CA3AF] text-[#111827]"
                />
              </div>
            </div>

            {/* Conversation Item */}
            <div className="p-2 space-y-1 flex-1 overflow-y-auto scroll-hide">
              <div
                onClick={() => {
                  if (window.innerWidth < 767) {
                    setMobileChatOpen(true);
                  }
                }}
                className="flex items-center gap-3 p-3 rounded-lg cursor-pointer bg-[#EFF6FF] border border-blue-100 transition-colors"
              >
                <div className="relative shrink-0">
                  <div className="w-10 h-10 rounded-xl bg-white border border-blue-200 p-1 flex items-center justify-center">
                    <img
                      src={logo}
                      alt="MR Storage"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span
                    className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${
                      isSocketConnected ? "bg-green-500" : "bg-amber-400"
                    }`}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-sm text-[#111827] truncate">
                      MR Storage Support
                    </p>
                    <span className="text-[10px] text-[#6B7280] shrink-0 ml-1">
                      {formatTime(lastMessage?.createdAt)}
                    </span>
                  </div>
                  <p className="text-xs text-[#6B7280] truncate mt-0.5">
                    {lastMessage
                      ? `${
                          lastMessage.senderType === "customer"
                            ? "You: "
                            : (lastMessage.senderName || "Staff") + ": "
                        }${lastMessage.content}`
                      : "Direct line to MR Storage team"}
                  </p>
                </div>

                {unreadCount > 0 && (
                  <span className="bg-[#3B82F6] text-white text-xs px-2 py-0.5 rounded-full shrink-0 font-medium">
                    {unreadCount}
                  </span>
                )}
              </div>
            </div>

            {/* Bottom Support Info Label */}
            <div className="p-4 border-t text-[#6B7280] flex justify-center items-center h-12">
              <span className="text-xs font-medium text-[#6B7280]">
                Official Account Communications
              </span>
            </div>
          </div>

          {/* ======================= RIGHT THREAD PANE ======================= */}
          <div
            className={`flex-1 ${
              mobileChatOpen ? "md:flex" : "hidden"
            } md:flex flex-col bg-white`}
          >
            {/* Thread Header */}
            <div className="border-b px-6 py-4 flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center cursor-pointer gap-3">
                <div
                  className="h-10 flex items-center md:hidden"
                  onClick={() => setMobileChatOpen(false)}
                >
                  <MoveLeft className="h-5 w-5 text-[#6B7280]" />
                </div>
                <div
                  className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-200 p-1 flex items-center justify-center shrink-0"
                  onClick={() => setOpenInfoModal(true)}
                >
                  <img
                    src={logo}
                    alt="MR Storage"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div onClick={() => setOpenInfoModal(true)}>
                  <p className="font-semibold text-base text-[#111827]">
                    MR Storage Support Team
                  </p>
                  <p className="text-sm text-[#6B7280] flex items-center gap-1">
                    Sales & Plant Support <span className="text-3xl leading-[14px]">·</span>{" "}
                    {isSocketConnected ? "Active now" : "Online"}
                  </p>
                </div>
              </div>

              <div className="flex items-center text-[#6B7280]">
                <button
                  type="button"
                  title="Channel Details"
                  onClick={() => setOpenInfoModal(true)}
                  className="p-1 rounded-md hover:bg-gray-100 hover:text-gray-800 transition-colors cursor-pointer"
                >
                  <AlertCircle className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Thread Messages */}
            <div className="p-6 space-y-6 flex-1 overflow-y-auto bg-white">
              {filteredMessages.length === 0 ? (
                <div className="py-16 flex flex-col items-center justify-center text-center text-[#6B7280]">
                  <div className="h-16 w-16 flex items-center justify-center rounded-full bg-blue-50 text-blue-600 mb-3">
                    <MessageCircle className="w-8 h-8" />
                  </div>
                  <p className="text-base font-semibold text-[#111827]">
                    Welcome to MR Storage Support
                  </p>
                  <p className="text-sm text-[#6B7280] mt-1 max-w-sm">
                    Send a message below to coordinate directly with our plant, sales, and operations team.
                  </p>
                </div>
              ) : (
                filteredMessages.map((msg, index) => {
                  const isMe = msg.senderType === "customer";
                  const senderName = isMe
                    ? currentUser?.firstName || "You"
                    : msg.senderName ||
                      (msg.senderType === "plant"
                        ? "Plant Team"
                        : msg.senderType === "sales"
                        ? "Sales Team"
                        : "MR Storage Staff");

                  if (!isMe) {
                    return (
                      <div
                        key={msg._id || msg.messageId || index}
                        className="flex gap-3 items-start"
                      >
                        <Avatar className="w-8 h-8 shrink-0 border border-gray-200 bg-white">
                          <AvatarImage
                            src={logo}
                            alt="MR Storage"
                            className="object-contain p-1"
                          />
                          <AvatarFallback className="bg-gray-100 text-gray-700 text-xs font-semibold">
                            MR
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-[#111827] text-sm">
                            {senderName}
                          </p>
                          <div className="mt-1 bg-[#F3F4F6] rounded-[10px] px-4 py-3 max-w-md text-[13px] text-[#111827]">
                            {msg.content}
                            <p className="text-[11px] text-[#767676] mt-1">
                              {formatTime(msg.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={msg._id || msg.messageId || index}
                      className="flex gap-3 items-start justify-end"
                    >
                      <div className="text-right">
                        <p className="font-medium text-[#111827] text-sm">
                          {senderName}
                        </p>
                        <div className="mt-1 text-start bg-[#2563EB] text-white rounded-[10px] text-[13px] px-4 py-3 max-w-md">
                          {msg.content}
                          <p className="text-[11px] text-[#E5E7EB] mt-1">
                            {formatTime(msg.createdAt)}
                          </p>
                        </div>
                      </div>
                      <Avatar className="w-8 h-8 shrink-0 border border-gray-200 bg-blue-50">
                        {currentUser?.photo ? (
                          <AvatarImage
                            src={currentUser.photo}
                            alt={currentUser.firstName}
                            className="object-cover"
                          />
                        ) : null}
                        <AvatarFallback className="bg-blue-600 text-white text-xs font-semibold">
                          {customerInitials}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  );
                })
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Composer */}
            <div className="px-4 py-[10px] border-t flex items-center gap-3 bg-white shrink-0">
              <input
                placeholder="Type your message..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                disabled={isSending}
                className="flex-1 border border-[#D6D6D6] rounded-[8px] px-4 h-[40px] text-sm placeholder:text-[#767676] flex items-center outline-none text-[#111827]"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isSending}
                className="bg-gradient-to-r from-[#2563EB] to-[#4F46E5] text-white px-6 h-[38px] flex rounded-[8px] items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                ➤ Send
              </button>
            </div>
          </div>
        </div>

        {/* Drawer Modal */}
        <ChatInfoDrawer
          open={openInfoModal}
          onClose={() => setOpenInfoModal(false)}
        />
      </div>
    </div>
  );
}
