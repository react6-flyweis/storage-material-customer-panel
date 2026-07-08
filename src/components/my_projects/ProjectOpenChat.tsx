import { Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const initialMessages = [
  {
    id: 1,
    sender: "John Doe",
    content: "Hi, I need a quote for a 40×60 workshop in Texas.",
    timestamp: "2024-10-10 09:30 PM",
    isMe: false,
  },
  {
    id: 2,
    sender: "Sarah Lee",
    content:
      "Hello John! I'd be happy to help you with that. Can you tell me more about the intended use and any specific requirements?",
    timestamp: "2024-10-10 09:35 PM",
    isMe: true,
  },
  {
    id: 3,
    sender: "John Doe",
    content:
      "It will be used for automotive repair. I need overhead doors and good ventilation.",
    timestamp: "2024-10-10 09:40 PM",
    isMe: false,
  },
  {
    id: 4,
    sender: "Sarah Lee",
    content:
      "Perfect! I've prepared a detailed proposal for you. Please review the attached document.",
    timestamp: "2024-10-10 09:45 PM",
    isMe: true,
  },
];

const ProjectOpenChat = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, sending]);

  const handleSend = () => {
    if (!message.trim() || sending) return;

    const text = message;

    setMessage("");
    setSending(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: "Sarah Lee",
          content: text,
          timestamp: new Date().toLocaleString(),
          isMe: true,
        },
      ]);

      setSending(false);
    }, 800);
  };

  return (
    <div className="rounded-lg bg-white p-5">
      <div className="border-b border-[#D0D5DD] pb-5">
        <p className="text-[18px] text-[#101828]">
          Project ID-
          <span className="font-bold">Q-2025-1047</span>
        </p>

        <h2 className="mt-4 text-[24px] font-bold text-[#101828]">
          Chat with John Doe (Project Lead)
        </h2>

        <p className="mt-2 text-[18px] text-[#101828]">
          Q-2025-1047 . Workshop
        </p>
      </div>

      <div className="h-[500px] overflow-y-auto py-5">
        <div className="space-y-4">
          {messages.map((item) => (
            <div
              key={item.id}
              className={`flex ${
                item.isMe ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`rounded-lg px-3 py-2 ${
                  item.isMe
                    ? "max-w-[720px] bg-[#2563EB] text-white"
                    : "max-w-[520px] bg-[#F2F4F7] text-[#101828]"
                }`}
              >
                <p className="mb-1 text-[14px] font-semibold">
                  {item.sender}
                </p>

                <p className="text-[16px] leading-7">
                  {item.content}
                </p>

                <p
                  className={`mt-2 text-[12px] ${
                    item.isMe
                      ? "text-[#D6E4FF]"
                      : "text-[#667085]"
                  }`}
                >
                  {item.timestamp}
                </p>
              </div>
            </div>
          ))}

          {sending && (
            <div className="flex justify-end">
              <div className="rounded-lg bg-[#2563EB] px-3 py-2">
                <div className="flex gap-2">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-white" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-white [animation-delay:0.15s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-white [animation-delay:0.3s]" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t border-[#D0D5DD] pt-3">
        <div className="flex items-center gap-6">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSend();
              }
            }}
            placeholder="Type your message..."
            className="h-[56px] flex-1 rounded-lg border border-[#D0D5DD] px-6 text-[16px] text-[#101828] outline-none"
          />

          <button
            onClick={handleSend}
            disabled={sending}
            className="flex h-[56px] min-w-[148px] items-center justify-center gap-3 rounded-lg bg-[linear-gradient(90deg,#2563EB_0%,#4F46E5_100%)] px-8 text-white disabled:opacity-70"
          >
            <Send size={18} />

            <span className="text-[18px] font-medium">
              {sending ? "Sending..." : "Send"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectOpenChat;