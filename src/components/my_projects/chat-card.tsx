import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AlertCircle, Loader2, Paperclip, Send } from "lucide-react";
import { createChatSocket, type Socket } from "@/lib/socket";
import { useAppSelector } from "@/redux/hooks";
import {
  useGetProjectDetailsQuery,
  useGetChatHistoryQuery,
} from "@/redux/api/projectsApi";

type Props = {
  leadId: string;
};

type ChatMessage = {
  id: string;
  senderType: "customer" | "ai" | "sales" | "admin";
  senderId?: string | null;
  senderName?: string | null;
  content: string;
  createdAt: string;
};

type ChatStatus = {
  leadId: string;
  isChatEnded: boolean;
  chatEndedAt: string | null;
  chatEndedBy: string | null;
  isStaffChatActive: boolean;
  isHandedToSales: boolean;
  isAiActive: boolean;
  canCustomerSend: boolean;
  canStaffSend: boolean;
};



function formatMessageTime(value?: string) {
  return new Date(value ?? Date.now()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function ChatCard({ leadId }: Props) {
  const currentUser = useAppSelector((state) => state.auth.user);

  // Fetch project details for layout/header info (e.g. jobId, buildingType)
  const { data: projectDetails } = useGetProjectDetailsQuery(leadId, {
    skip: !leadId,
  });

  const lead = projectDetails?.lead;

  // Fetch initial chat history
  const { data: historyData, isLoading: isLoadingHistory } = useGetChatHistoryQuery(leadId, {
    skip: !leadId,
  });

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  // Live status states from Socket
  const [chatStatus, setChatStatus] = useState<ChatStatus | null>(null);

  // Typing states
  const [aiTyping, setAiTyping] = useState(false);
  const [salesTyping, setSalesTyping] = useState<{ isTyping: boolean; name?: string }>({
    isTyping: false,
  });

  const socketRef = useRef<Socket | null>(null);
  const typingTimeoutRef = useRef<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Load history messages when loaded
  useEffect(() => {
    if (historyData) {
      const historyMessages = historyData.messages.map((msg, index) => ({
        id: `${index}-${msg.createdAt}`,
        senderType: msg.senderType,
        content: msg.content,
        createdAt: msg.createdAt,
        senderName: msg.senderName,
      }));
      setMessages(historyMessages);
      setChatStatus({
        leadId,
        isChatEnded: historyData.isChatEnded,
        chatEndedAt: historyData.chatEndedAt,
        chatEndedBy: null,
        isStaffChatActive: historyData.isStaffChatActive,
        isHandedToSales: historyData.isHandedToSales,
        isAiActive: historyData.isAiActive,
        canCustomerSend: historyData.canCustomerSend,
        canStaffSend: !historyData.isChatEnded,
      });
    }
  }, [historyData, leadId]);

  // Keep scroll aligned
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, aiTyping, salesTyping.isTyping]);

  // Handle typing state emits
  const emitTyping = useCallback((isTyping: boolean) => {
    const socket = socketRef.current;
    if (!socket?.connected) return;

    if (isTyping) {
      socket.emit("typing_start", { leadId });
    } else {
      socket.emit("typing_stop", { leadId });
    }
  }, [leadId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);

    // Emit typing start
    emitTyping(true);

    if (typingTimeoutRef.current) {
      window.clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = window.setTimeout(() => {
      emitTyping(false);
      typingTimeoutRef.current = null;
    }, 1500);
  };

  // Socket Connection Setup
  useEffect(() => {
    if (!leadId || !currentUser?.customerId) return;

    const socket = createChatSocket();
    socketRef.current = socket;

    const joinRoom = () => {
      socket.emit("join_lead", {
        leadId,
        customerId: currentUser._id,
      });
    };

    socket.on("connect", () => {
      setIsConnected(true);
      setErrorStatus(null);
      joinRoom();
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("connect_error", (err) => {
      setIsConnected(false);
      setErrorStatus(err.message);
    });

    socket.on("chat_status", (status: ChatStatus) => {
      setChatStatus(status);
    });

    socket.on("new_message", (payload: any) => {
      const formattedMessage: ChatMessage = {
        id: payload._id || `${Date.now()}-${payload.content}`,
        senderType: payload.senderType,
        content: payload.content,
        createdAt: payload.createdAt || new Date().toISOString(),
        senderId: payload.senderId,
        senderName: payload.senderName,
      };

      setMessages((prev) => {
        // Prevent duplicate appending
        if (prev.some((m) => m.id === formattedMessage.id)) return prev;
        return [...prev, formattedMessage];
      });
    });

    socket.on("ai_typing", (payload: { isTyping: boolean }) => {
      setAiTyping(payload.isTyping);
    });

    socket.on("sales_typing", (payload: { isTyping: boolean; name?: string }) => {
      setSalesTyping(payload);
    });

    socket.on("staff_chat_active", (payload: ChatStatus & { staffName?: string }) => {
      setChatStatus(payload);
      setAiTyping(false); // Stop AI typing indicators
    });

    socket.on("chat_ended", (payload: ChatStatus) => {
      setChatStatus(payload);
      setAiTyping(false);
      setSalesTyping({ isTyping: false });
    });

    socket.on("chat_reopened", (payload: ChatStatus) => {
      setChatStatus(payload);
    });

    socket.on("chat_error", (payload: { message: string }) => {
      setErrorStatus(payload.message);
    });

    return () => {
      if (typingTimeoutRef.current) {
        window.clearTimeout(typingTimeoutRef.current);
      }
      socket.disconnect();
      socketRef.current = null;
    };
  }, [leadId, currentUser?.customerId, emitTyping]);

  // Send Message
  const handleSendMessage = () => {
    const text = input.trim();
    if (!text || !currentUser?.customerId) return;

    const socket = socketRef.current;
    if (!socket?.connected) {
      setErrorStatus("Chat is still connecting. Please try again in a moment.");
      return;
    }

    // Emit message to backend
    socket.emit("customer_message", {
      leadId,
      customerId: currentUser._id,
      content: text,
    });

    // Local append since server does not echo back customer's own message
    const localMsg: ChatMessage = {
      id: `local-${Date.now()}`,
      senderType: "customer",
      content: text,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, localMsg]);

    setInput("");
    emitTyping(false);
  };

  const isChatEnded = chatStatus?.isChatEnded ?? false;
  const canSend = isConnected && !isChatEnded && input.trim().length > 0;

  return (
    <div className="flex-1 flex flex-col p-0 rounded-lg bg-white shadow">
      <div className="px-6 pt-6 pb-4 border-b">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="text-sm text-gray-500">
            {lead?.jobId && <span className="font-semibold">{lead.jobId}</span>}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            {messages.length === 0 ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-gray-50 px-3 py-1 text-gray-500">
                Not connected
              </span>
            ) : isConnected ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
                Connected
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-amber-700">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Connecting
              </span>
            )}
            {isLoadingHistory ? (
              <span className="text-gray-400">Loading history...</span>
            ) : null}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="h-10 w-10 bg-gray-100">
              <AvatarFallback className="text-sm text-gray-600 font-medium">
                {currentUser?.firstName
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("") || "ME"}
              </AvatarFallback>
            </Avatar>
            {isConnected ? (
              <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse" />
            ) : (
              <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-amber-500 ring-2 ring-white" />
            )}
          </div>
          <div>
            <div className="text-base font-semibold">
              Chat Support
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <span>{lead?.buildingType || "Project Lead"}</span>
              <span>•</span>
              {isConnected ? (
                <span className="text-emerald-600 font-medium">Active now</span>
              ) : (
                <span>Offline</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {errorStatus ? (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorStatus}</span>
          </div>
        ) : null}

        {messages.length === 0 ? (
          <div className="py-12 flex flex-col items-center gap-2 text-center text-sm text-gray-500">
            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-400">
              💬
            </div>
            <div className="font-medium text-gray-700">No messages yet</div>
            <div className="text-xs text-gray-400">
              Start typing below to chat with our assistant or support team.
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => {
              const isMe = message.senderType === "customer";
              const isAiMessage = message.senderType === "ai";
              const senderLabel = isMe
                ? "You"
                : isAiMessage
                  ? "Assistant"
                  : (message.senderName ?? "Support");

              return (
                <div
                  key={message.id}
                  className={`flex gap-2 ${isMe ? "justify-end" : "justify-start"}`}
                >
                  {!isMe ? (
                    <Avatar
                      className={`h-8 w-8 shrink-0 ${isAiMessage ? "bg-blue-50" : "bg-gray-100"}`}
                    >
                      <AvatarFallback
                        className={`text-xs ${isAiMessage ? "text-blue-700" : "text-gray-600"}`}
                      >
                        {isAiMessage ? "AI" : "SP"}
                      </AvatarFallback>
                    </Avatar>
                  ) : null}

                  <div className="flex max-w-[70%] flex-col gap-1">
                    <div
                      className={`text-sm font-medium text-gray-700 ${isMe ? "text-right" : "text-left"}`}
                    >
                      {senderLabel}
                    </div>
                    <div
                      className={`whitespace-pre-wrap rounded-lg p-3 text-sm ${isMe
                        ? "rounded-br-sm bg-blue-600 text-white"
                        : isAiMessage
                          ? "rounded-bl-sm bg-blue-50 text-blue-950"
                          : "rounded-bl-sm bg-gray-100 text-gray-900"
                        }`}
                    >
                      {message.content}
                    </div>
                    <div
                      className={`text-xs text-gray-400 ${isMe ? "text-right" : "text-left"}`}
                    >
                      {formatMessageTime(message.createdAt)}
                    </div>
                  </div>

                  {isMe ? (
                    <Avatar className="h-8 w-8 shrink-0 bg-blue-100">
                      <AvatarFallback className="text-xs text-blue-600">
                        {currentUser?.firstName?.slice(0, 2).toUpperCase() || "ME"}
                      </AvatarFallback>
                    </Avatar>
                  ) : null}
                </div>
              );
            })}

            {/* Live Typing indicators */}
            {aiTyping && (
              <div className="flex gap-2 justify-start items-center text-xs text-gray-500">
                <Avatar className="h-8 w-8 bg-blue-50">
                  <AvatarFallback className="text-xs text-blue-700">AI</AvatarFallback>
                </Avatar>
                <span>Assistant is typing...</span>
              </div>
            )}

            {salesTyping.isTyping && (
              <div className="flex gap-2 justify-start items-center text-xs text-gray-500">
                <Avatar className="h-8 w-8 bg-gray-100">
                  <AvatarFallback className="text-xs text-gray-600">SP</AvatarFallback>
                </Avatar>
                <span>{salesTyping.name || "Support"} is typing...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="relative px-6 py-4 border-t bg-gray-50">
        <div
          className={`flex items-center gap-2 transition-all duration-200 ${isChatEnded
            ? "blur-[1.5px] pointer-events-none select-none opacity-50"
            : ""
            }`}
        >
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 text-gray-500 hover:text-gray-700"
            disabled={isChatEnded}
          >
            <Paperclip className="h-5 w-5" />
          </Button>
          <Input
            value={input}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder={
              !isChatEnded
                ? "Type a message..."
                : "Chat cannot be initiated from here..."
            }
            className="flex-1 bg-white"
            disabled={isChatEnded}
          />
          <Button
            onClick={handleSendMessage}
            size="icon"
            className="h-10 w-10 bg-blue-600 hover:bg-blue-700 text-white"
            disabled={!canSend}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>

        {isChatEnded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50/20">
            <span className="text-sm font-medium text-gray-500 bg-white/90 px-4 py-2 rounded-full shadow-sm border border-gray-100">
              Chat session is closed.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
