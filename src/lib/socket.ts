import { io, type Socket } from "socket.io-client";

export function getSocketBaseUrl() {
  const apiBase = import.meta.env.VITE_API_BASE_URL

  return apiBase.replace(/\/$/, "")

  // try {
  //   return new URL(apiBase).origin;
  // } catch {
  //   return apiBase;
  // }
}

export function createChatSocket(
  transports: string[] = ["polling"],
): Socket {
  const base = getSocketBaseUrl();
  return io(`${base}/chat`, {
    transports,
  });
}

export type { Socket };
