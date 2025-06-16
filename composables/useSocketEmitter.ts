// composables/useSocketEmitter.ts
import { io } from "socket.io-client";

const socket = io("http://localhost:4000"); // หรือจาก plugin

export const useSocketEmitter = () => {
  const emitOrderCancelled = (orderId: string) => {
    socket.emit("client:order-cancelled", { orderId }); // ส่ง event ไป backend
  };

  return {
    emitOrderCancelled,
  };
};
