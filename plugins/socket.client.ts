import { io, Socket } from "socket.io-client";
import { defineNuxtPlugin, useRuntimeConfig } from "nuxt/app";
import type { RuntimeConfig } from "nuxt/schema";

// Global socket instance to prevent multiple connections
let globalSocket: Socket | null = null;

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig() as RuntimeConfig & {
    public: {
      apiBase: string;
      socketUrl?: string;
      wsUrl?: string;
    };
  };

  // Initialize socket connection only once
  const initSocket = () => {
    // Return existing socket if already connected
    if (globalSocket?.connected) {
      console.log("🔌 Using existing socket connection");
      return globalSocket;
    }

    // Disconnect existing socket if not connected
    if (globalSocket) {
      globalSocket.disconnect();
      globalSocket = null;
    }

    // Determine WebSocket URL
    let wsUrl: string;
    if (config.public.wsUrl && typeof config.public.wsUrl === "string") {
      wsUrl = config.public.wsUrl;
    } else if (
      config.public.socketUrl &&
      typeof config.public.socketUrl === "string"
    ) {
      wsUrl = config.public.socketUrl.replace(/^http/, "ws") + "/realtime";
    } else {
      const apiBase =
        (config.public.apiBase as string) || "http://localhost:4000";
      wsUrl = apiBase.replace(/^http/, "ws") + "/realtime";
    }

    console.log("🔌 Creating new socket connection to:", wsUrl);

    globalSocket = io(wsUrl, {
      transports: ["websocket", "polling"],
      timeout: 20000,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      autoConnect: false, // Don't auto-connect, let components manage this
      forceNew: true, // Force new connection
    });

    // Global connection event handlers
    globalSocket.on("connect", () => {
      console.log("🔌 Global socket connected to:", wsUrl);
    });

    globalSocket.on("disconnect", (reason) => {
      console.log("🔌 Global socket disconnected:", reason);
    });

    globalSocket.on("connect_error", (error) => {
      console.error("🚫 Global socket connection error:", error);
    });

    return globalSocket;
  };

  return {
    provide: {
      socket: globalSocket,
      initSocket,
      getSocket: () => globalSocket,
    },
  };
});
