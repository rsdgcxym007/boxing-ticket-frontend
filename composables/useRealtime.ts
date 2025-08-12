import { ref, onMounted, onUnmounted, readonly } from "vue";
import { io, Socket } from "socket.io-client";
import { useRuntimeConfig } from "nuxt/app";
import { useAuthStore } from "@/stores/auth";
import { useSingleToast } from "./useSingleToast";

export interface LiveSeatSelection {
  seatId: string;
  userId: string;
  userName?: string;
  action: "select" | "deselect";
  timestamp: string;
}

export interface LiveUpdate {
  type: "seat-update" | "booking-update" | "analytics-update" | "system-update";
  data: any;
  timestamp: string;
}

export interface ConnectionStatus {
  connected: boolean;
  reconnecting: boolean;
  lastConnected?: string;
  connectionCount: number;
}

export interface RoomInfo {
  roomId: string;
  userCount: number;
  activeUsers: string[];
}

export const useRealtime = () => {
  const config = useRuntimeConfig();
  const authStore = useAuthStore();
  const { showToast } = useSingleToast();

  // State
  const socket = ref<Socket | null>(null);
  const connectionStatus = ref<ConnectionStatus>({
    connected: false,
    reconnecting: false,
    connectionCount: 0,
  });
  const liveSeatSelections = ref<LiveSeatSelection[]>([]);
  const activeRooms = ref<string[]>([]);
  const currentRoom = ref<string | null>(null);

  /**
   * Initialize WebSocket connection - Singleton pattern to prevent multiple connections
   */
  const connect = () => {
    // Check if socket already exists and is connected
    if (socket.value?.connected) {
      console.log("🔌 Socket already connected, skipping...");
      return socket.value;
    }

    // Close existing socket if it exists but not connected
    if (socket.value) {
      socket.value.disconnect();
      socket.value = null;
    }

    // Use production URL if available
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

    console.log("🔌 Connecting to WebSocket:", wsUrl);

    // Get token from localStorage since authStore might not have token property
    const token = process.client ? localStorage.getItem("token") || "" : "";

    socket.value = io(wsUrl, {
      transports: ["websocket", "polling"],
      timeout: 20000,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10,
      forceNew: true, // Force new connection to prevent conflicts
      auth: {
        token,
      },
    });

    setupEventListeners();
    return socket.value;
  };

  /**
   * Setup WebSocket event listeners
   */
  const setupEventListeners = () => {
    if (!socket.value) return;

    // Connection events
    socket.value.on("connect", () => {
      connectionStatus.value.connected = true;
      connectionStatus.value.reconnecting = false;
      connectionStatus.value.lastConnected = new Date().toISOString();
      connectionStatus.value.connectionCount++;

      console.log("🔌 WebSocket connected");

      // Auto-join user room if authenticated
      if (authStore.user?.id) {
        joinUserRoom(authStore.user.id);
      }
    });

    socket.value.on("disconnect", (reason) => {
      connectionStatus.value.connected = false;
      console.log("🔌 WebSocket disconnected:", reason);
    });

    socket.value.on("reconnect_attempt", () => {
      connectionStatus.value.reconnecting = true;
      console.log("🔄 WebSocket reconnecting...");
    });

    socket.value.on("reconnect", () => {
      connectionStatus.value.reconnecting = false;
      showToast("success", "เชื่อมต่อระบบสดใหม่แล้ว");
    });

    socket.value.on("connect_error", (error) => {
      console.error("🚫 WebSocket connection error:", error);
      connectionStatus.value.connected = false;
      connectionStatus.value.reconnecting = false;
    });

    // Custom events
    setupCustomEventListeners();
  };

  /**
   * Setup custom event listeners
   */
  const setupCustomEventListeners = () => {
    if (!socket.value) return;

    // Seat selection updates
    socket.value.on("seat-update", (data: LiveSeatSelection) => {
      handleSeatUpdate(data);
    });

    // Live analytics updates
    socket.value.on("analytics-update", (data) => {
      // Emit to parent components that need analytics updates
      window.dispatchEvent(
        new CustomEvent("analytics-update", { detail: data })
      );
    });

    // Room updates
    socket.value.on("room-info", (data: RoomInfo) => {
      console.log(`📍 Room ${data.roomId}: ${data.userCount} users`);
    });

    // System notifications
    socket.value.on("system-notification", (data) => {
      showToast("info", data.message);
    });

    // Booking updates
    socket.value.on("booking-update", (data) => {
      window.dispatchEvent(new CustomEvent("booking-update", { detail: data }));
    });
  };

  /**
   * Handle live seat updates
   */
  const handleSeatUpdate = (data: LiveSeatSelection) => {
    // Don't show updates from current user
    if (data.userId === authStore.user?.id) return;

    if (data.action === "select") {
      // Add to live selections if not already there
      const existing = liveSeatSelections.value.find(
        (s) => s.seatId === data.seatId
      );
      if (!existing) {
        liveSeatSelections.value.push(data);

        // Auto-remove after 30 seconds
        setTimeout(() => {
          removeLiveSeatSelection(data.seatId);
        }, 30000);
      }
    } else {
      removeLiveSeatSelection(data.seatId);
    }
  };

  /**
   * Remove live seat selection
   */
  const removeLiveSeatSelection = (seatId: string) => {
    const index = liveSeatSelections.value.findIndex(
      (s) => s.seatId === seatId
    );
    if (index > -1) {
      liveSeatSelections.value.splice(index, 1);
    }
  };

  /**
   * Join user-specific room
   */
  const joinUserRoom = (userId: string) => {
    if (!socket.value?.connected) return;

    socket.value.emit("join-user", { userId });
    activeRooms.value.push(`user-${userId}`);
    console.log(`📍 Joined user room: ${userId}`);
  };

  /**
   * Join zone-specific room
   */
  const joinZoneRoom = (zoneId: string) => {
    if (!socket.value?.connected) return;

    socket.value.emit("join-zone", { zoneId });
    currentRoom.value = `zone-${zoneId}`;

    if (!activeRooms.value.includes(currentRoom.value)) {
      activeRooms.value.push(currentRoom.value);
    }

    console.log(`📍 Joined zone room: ${zoneId}`);
  };

  /**
   * Leave zone room
   */
  const leaveZoneRoom = (zoneId: string) => {
    if (!socket.value?.connected) return;

    socket.value.emit("leave-zone", { zoneId });

    const roomName = `zone-${zoneId}`;
    const index = activeRooms.value.indexOf(roomName);
    if (index > -1) {
      activeRooms.value.splice(index, 1);
    }

    if (currentRoom.value === roomName) {
      currentRoom.value = null;
    }

    console.log(`📍 Left zone room: ${zoneId}`);
  };

  /**
   * Emit seat selection
   */
  const emitSeatSelection = (seatData: {
    seatId: string;
    userId: string;
    zoneId: string;
    action: "select" | "deselect";
  }) => {
    if (!socket.value?.connected) return;

    socket.value.emit("seat-selection", seatData);
  };

  /**
   * Subscribe to analytics updates
   */
  const subscribeToAnalytics = () => {
    if (!socket.value?.connected) return;

    socket.value.emit("subscribe-analytics");
    console.log("📊 Subscribed to analytics updates");
  };

  /**
   * Unsubscribe from analytics updates
   */
  const unsubscribeFromAnalytics = () => {
    if (!socket.value?.connected) return;

    socket.value.emit("unsubscribe-analytics");
    console.log("📊 Unsubscribed from analytics updates");
  };

  /**
   * Request live updates for a zone
   */
  const requestLiveUpdates = (zoneId: string) => {
    if (!socket.value?.connected) return;

    socket.value.emit("request-live-updates", { zoneId });
  };

  /**
   * Send heartbeat to maintain connection
   */
  const sendHeartbeat = () => {
    if (!socket.value?.connected) return;

    socket.value.emit("heartbeat", {
      timestamp: new Date().toISOString(),
      userId: authStore.user?.id,
    });
  };

  /**
   * Disconnect WebSocket
   */
  const disconnect = () => {
    if (socket.value) {
      socket.value.disconnect();
      socket.value = null;
      connectionStatus.value.connected = false;
      connectionStatus.value.reconnecting = false;
      liveSeatSelections.value = [];
      activeRooms.value = [];
      currentRoom.value = null;
      console.log("🔌 WebSocket disconnected manually");
    }
  };

  /**
   * Reconnect WebSocket
   */
  const reconnect = () => {
    disconnect();
    setTimeout(() => {
      connect();
    }, 1000);
  };

  /**
   * Check if user is selecting a specific seat
   */
  const isSeatBeingSelected = (seatId: string): boolean => {
    return liveSeatSelections.value.some((s) => s.seatId === seatId);
  };

  /**
   * Get who is selecting a specific seat
   */
  const getSeatSelector = (seatId: string): LiveSeatSelection | null => {
    return liveSeatSelections.value.find((s) => s.seatId === seatId) || null;
  };

  /**
   * Auto-connect when user is authenticated
   */
  onMounted(() => {
    if (authStore.isAuthenticated) {
      connect();
    }

    // Set up heartbeat interval
    const heartbeatInterval = setInterval(() => {
      sendHeartbeat();
    }, 30000); // Every 30 seconds

    onUnmounted(() => {
      clearInterval(heartbeatInterval);
      disconnect();
    });
  });

  return {
    // State
    connectionStatus: readonly(connectionStatus),
    liveSeatSelections: readonly(liveSeatSelections),
    activeRooms: readonly(activeRooms),
    currentRoom: readonly(currentRoom),

    // Connection management
    connect,
    disconnect,
    reconnect,

    // Room management
    joinUserRoom,
    joinZoneRoom,
    leaveZoneRoom,

    // Event emission
    emitSeatSelection,
    subscribeToAnalytics,
    unsubscribeFromAnalytics,
    requestLiveUpdates,

    // Utilities
    isSeatBeingSelected,
    getSeatSelector,
    sendHeartbeat,
  };
};
