import { ref, onMounted, onUnmounted } from "vue";
import { io, Socket } from "socket.io-client";
import { useSingleToast } from "./useSingleToast";
import { useRuntimeConfig } from "nuxt/app";
export const useWebSocket = () => {
  const { showToast } = useSingleToast();
  const socket = ref<Socket | null>(null);
  const isConnected = ref(false);
  const currentRoom = ref<string | null>(null);
  const config = useRuntimeConfig();
  const base = config.public.socketUrl;

  // เชื่อมต่อ WebSocket
  const connect = (url: string = `${base}/order-updates`) => {
    if (socket.value) {
      socket.value.disconnect();
    }

    socket.value = io(url);
    setupEventListeners();
  };

  // ตั้งค่า Event Listeners
  const setupEventListeners = () => {
    if (!socket.value) return;

    // การเชื่อมต่อ
    socket.value.on("connect", () => {
      isConnected.value = true;
    });

    // การตัดการเชื่อมต่อ
    socket.value.on("disconnect", () => {
      isConnected.value = false;

      // พยายามเชื่อมต่อใหม่หลัง 5 วินาที
      setTimeout(() => {
        if (socket.value) {
          socket.value.connect();
        }
      }, 5000);
    });

    // การ join room สำเร็จ
    socket.value.on("joined_room", (data) => {
      currentRoom.value = data.room;
    });

    // Error handling
    socket.value.on("concurrency_error", (event) => {
      console.error("Concurrency error:", event);
      showToast("error", event.data.message || "เกิดข้อผิดพลาดในระบบ");
    });

    socket.value.on("connect_error", (error) => {
      console.error("Connection error:", error);
      showToast("error", "ไม่สามารถเชื่อมต่อได้");
    });
  };

  // Join room สำหรับ show date
  const joinShowRoom = (showDate: string) => {
    if (!socket.value || !isConnected.value) return;

    socket.value.emit("join_show_room", { showDate });
  };

  // ออกจาก room
  const leaveRoom = () => {
    if (!socket.value || !currentRoom.value) return;

    socket.value.emit("leave_room", { room: currentRoom.value });
    currentRoom.value = null;
  };

  // ส่ง heartbeat
  const sendHeartbeat = () => {
    if (!socket.value || !isConnected.value) return;

    socket.value.emit("heartbeat", { test: true });
  };

  // ตั้งค่า event listener สำหรับ order events
  const onOrderCreated = (callback: (event: any) => void) => {
    if (!socket.value) return;
    socket.value.on("order_created", callback);
    return () => {
      if (socket.value) socket.value.off("order_created", callback);
    };
  };

  const onOrderCancelled = (callback: (event: any) => void) => {
    if (!socket.value) return;
    socket.value.on("order_cancelled", callback);
    return () => {
      if (socket.value) socket.value.off("order_cancelled", callback);
    };
  };

  const onSeatLocked = (callback: (event: any) => void) => {
    if (!socket.value) return;
    socket.value.on("seat_locked", callback);
    return () => {
      if (socket.value) socket.value.off("seat_locked", callback);
    };
  };

  const onSeatUnlocked = (callback: (event: any) => void) => {
    if (!socket.value) return;
    socket.value.on("seat_unlocked", callback);
    return () => {
      if (socket.value) socket.value.off("seat_unlocked", callback);
    };
  };

  const onSeatAvailabilityChanged = (callback: (event: any) => void) => {
    if (!socket.value) return;
    socket.value.on("seat_availability_changed", callback);
    return () => {
      if (socket.value) socket.value.off("seat_availability_changed", callback);
    };
  };

  // ส่งข้อมูลการเปลี่ยนแปลงที่นั่ง
  const broadcastSeatUpdate = (data: {
    zoneKey: string;
    showDate: string;
    selectedSeats: string[];
    action: string;
    userId?: string;
  }) => {
    if (!socket.value || !isConnected.value) {
      console.warn("⚠️ WebSocket not connected, cannot broadcast seat update");
      return;
    }

    socket.value.emit("seat_update", data);
  };

  // รับข้อมูลการเปลี่ยนแปลงที่นั่ง
  const onSeatUpdate = (callback: (event: any) => void) => {
    if (!socket.value) {
      console.warn("⚠️ Socket not available for onSeatUpdate");
      return;
    }

    const eventTypes = [
      "seat_update",
      "seat_selected",
      "seat_deselected",
      "order_created",
      "order_confirmed",
      "seats_cancelled",
      "seat_selection_changed",
    ];

    const socketInstance = socket.value;
    // สร้าง handler ใหม่เพื่อ reference สำหรับถอด listener
    const eventHandlers: { [key: string]: (event: any) => void } = {};
    eventTypes.forEach((eventType) => {
      eventHandlers[eventType] = (event) => {
        callback(event);
      };
      socketInstance.on(eventType, eventHandlers[eventType]);
    });

    // ฟัง event ทั่วไป
    const anyHandler = (eventName: string, ...args: any[]) => {
      if (eventName.includes("seat") || eventName.includes("order")) {
        callback(args[0] || { action: eventName, data: args });
      }
    };
    socketInstance.onAny(anyHandler);

    // คืน unsubscribe function
    return () => {
      eventTypes.forEach((eventType) => {
        socketInstance.off(eventType, eventHandlers[eventType]);
      });
      socketInstance.offAny(anyHandler);
    };
  };

  // ส่งข้อมูล emit ทั่วไป
  const emit = (event: string, data: any) => {
    if (!socket.value || !isConnected.value) {
      console.warn(`⚠️ WebSocket not connected, cannot emit ${event}`);
      return;
    }
    socket.value.emit(event, data);
  };

  // ตัดการเชื่อมต่อ
  const disconnect = () => {
    if (socket.value) {
      socket.value.disconnect();
      socket.value = null;
    }
    isConnected.value = false;
    currentRoom.value = null;
  };

  // Auto-connect on mount
  onMounted(() => {
    connect();
  });

  // Cleanup on unmount
  onUnmounted(() => {
    disconnect();
  });

  return {
    socket,
    isConnected,
    currentRoom,
    connect,
    disconnect,
    joinShowRoom,
    leaveRoom,
    sendHeartbeat,
    onOrderCreated,
    onOrderCancelled,
    onSeatLocked,
    onSeatUnlocked,
    onSeatAvailabilityChanged,
    broadcastSeatUpdate,
    onSeatUpdate,
    emit,
  };
};
