// composables/useWebSocket.ts
import { io, Socket } from "socket.io-client";
import { onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "./useToast";
import { useRuntimeConfig } from "nuxt/app";

let socket: Socket | null = null;
let isConnected = false;

const handledOrderIds = new Set<string>(); // ✅ กันยิงซ้ำ
const config = useRuntimeConfig();
const base = config.public.apiBase;
export const useWebSocket = (
  orderId: string | "*",
  onOrderCancelled?: (orderId: string) => void
) => {
  const router = useRouter();
  const { showToast } = useToast();

  const connectSocket = () => {
    if (socket && isConnected) return;

    socket = io(`${base}`);
    isConnected = true;

    socket.on("connect", () => {
      console.log("✅ WebSocket connected");
    });

    socket.off("order-cancelled");

    socket.on("order-cancelled", (data) => {
      const isMatch = orderId === "*" || data.orderId === orderId;

      // ✅ ถ้าเคยทำไปแล้ว ไม่ต้องทำซ้ำ
      if (!isMatch || handledOrderIds.has(data.orderId)) return;

      handledOrderIds.add(data.orderId); // ✅ จดไว้ว่าเคยทำแล้ว

      console.log("📨 รับ order-cancelled:", data.orderId);

      if (orderId !== "*") {
        showToast("⏰ คำสั่งซื้อนี้หมดเวลาและถูกยกเลิก", "error");
        router.push("/");
      }

      onOrderCancelled?.(data.orderId);
    });

    socket.on("disconnect", () => {
      console.warn("🔌 WebSocket disconnected");
    });

    socket.on("connect_error", (err) => {
      console.error("❌ WebSocket connection error:", err.message);
    });
  };

  const disconnectSocket = () => {
    if (socket) {
      socket.disconnect();
      socket = null;
      isConnected = false;
      handledOrderIds.clear(); // ✅ เคลียร์เมื่อออกจาก component
      console.log("🧹 Socket disconnected manually");
    }
  };

  onBeforeUnmount(() => {
    disconnectSocket();
  });

  return {
    connectSocket,
    disconnectSocket,
  };
};
