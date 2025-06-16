import { useRuntimeConfig } from "nuxt/app";

const config = useRuntimeConfig();
const base = config.public.apiBase;
import { io } from "socket.io-client";

const socket = io(`${base}`);

export const useSocketEmitter = () => {
  const emitOrderCancelled = (orderId: string) => {
    socket.emit("client:order-cancelled", { orderId }); // ส่ง event ไป backend
  };

  return {
    emitOrderCancelled,
  };
};
