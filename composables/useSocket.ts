// composables/useWebSocket.ts
import { io, Socket } from "socket.io-client";
import { onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import { useRuntimeConfig } from "nuxt/app";

let socket: Socket | null = null;
let isConnected = false;
const handledOrderIds = new Set<string>();

type dataDto = {
  event: string;
  orderId: string;
  zone: string;
  seats: string;
  total: number;
  method: string;
  createdAt: string;
  status: string;
  expiresAt: string;
  slipPath: null;
  transactionId: string;
  paidAt: string;
  id: number;
  updatedAt: string;
};
export const useWebSocket = (
  listenOrderId: string | "*",
  onOrderCancelled?: (orderId: string) => void
) => {
  const toast = useToast();
  const config = useRuntimeConfig();
  const baseURL = config.public.apiBase;

  const connectSocket = () => {
    if (socket && isConnected) return;

    socket = io(`${baseURL}`);
    isConnected = true;

    socket.on("connect", () => {});

    socket.on("order-cancelled", (data: dataDto) => {
      // toast.warning(
      //   `⏰ คำสั่งซื้อ ${data.orderId} Zone ${data.zone}  ที่นั่ง ${data.seats} นี้หมดเวลาและถูกยกเลิก`
      // );
      onOrderCancelled?.(data.orderId);
    });

    socket.on("order-created", (data: dataDto) => {
      // toast.warning(`⏰ Zone ${data.zone}  ที่นั่ง ${data.seats} ถูกจองแล้ว`);
      onOrderCancelled?.(data.orderId);
    });

    socket.on("disconnect", () => {
      console.warn("🔌 WebSocket disconnected");
    });

    socket.on("connect_error", (err) => {
      console.error("WebSocket error:", err.message);
    });
  };

  const disconnectSocket = () => {
    if (socket) {
      socket.disconnect();
      socket = null;
      isConnected = false;
      handledOrderIds.clear();
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
