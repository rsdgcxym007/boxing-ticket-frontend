import { useApi } from "../composables/useApi";
import { useToast } from "vue-toastification";

export const useOrder = () => {
  const { post, patch } = useApi();
  const toast = useToast();

  const submitOrder = async ({
    zone,
    selectedSeats,
    total,
    method,
    orderId,
  }: {
    zone: string;
    selectedSeats: string[];
    total: number;
    method: string;
    orderId: string;
  }) => {
    try {
      const payload = {
        orderId,
        zone,
        seats: selectedSeats,
        total,
        method,
      };

      const { data } = await post("/api/orders", payload);
      toast.success("✅ สร้างออเดอร์สำเร็จ");
      return data;
    } catch (err: any) {
      toast.error(`❌ สร้างออเดอร์ล้มเหลว: ${err.message || "Unknown error"}`);
      throw err;
    }
  };

  const cancelOrder = async (orderId: string) => {
    try {
      await patch(`/api/orders/cancel/${orderId}`, {
        status: "CANCELLED",
      });
      toast.info(`🛑 ยกเลิกออเดอร์ ${orderId} สำเร็จ`);
    } catch (err: any) {
      toast.error(`❌ ยกเลิกออเดอร์ล้มเหลว: ${err.message}`);
      throw err;
    }
  };

  const markAsPaid = async (orderId: string) => {
    try {
      await patch(`/api/orders/${orderId}/status`, {
        status: "PAID",
      });
      toast.success(`💰 ชำระเงินออเดอร์ ${orderId} สำเร็จ`);
    } catch (err: any) {
      toast.error(`❌ ชำระเงินล้มเหลว: ${err.message}`);
      throw err;
    }
  };

  return { submitOrder, cancelOrder, markAsPaid };
};
