import { useApi } from "../composables/useApi";
import { useToast } from "vue-toastification";

export const useOrder = () => {
  const { post, patch } = useApi();
  const toast = useToast();

  const submitOrder = async ({
    userId,
    seatIds,
    total,
    showDate,
    method,
  }: {
    userId: string;
    seatIds: string[];
    total: number;
    showDate: string;
    method: string;
  }) => {
    const payload = {
      userId,
      seatIds,
      showDate,
      total,
      method,
    };

    try {
      const res = await post("/orders", payload);
      toast.success("✅ สร้างออเดอร์สำเร็จ");
      return res;
    } catch (err: any) {
      toast.error(`❌ สร้างออเดอร์ล้มเหลว: ${err.message || "Unknown error"}`);
      throw err;
    }
  };

  const cancelOrder = async (orderId: string) => {
    try {
      await patch(`/orders/cancel/${orderId}`, {
        status: "CANCELLED",
      });
      toast.info(`🛑 ยกเลิกออเดอร์ ${orderId} สำเร็จ`);
    } catch (err: any) {
      toast.error(`❌ ยกเลิกออเดอร์ล้มเหลว: ${err.message || "Unknown error"}`);
      throw err;
    }
  };

  const markAsPaidWithRef = async (orderId: string, refCode?: string) => {
    try {
      await patch(`/orders/${orderId}`, {
        status: "PAID",
        ...(refCode && { referrerCode: refCode }),
      });
      toast.success(`💰 ชำระเงินออเดอร์ ${orderId} สำเร็จ`);
    } catch (err: any) {
      toast.error(
        `❌ ชำระเงินล้มเหลว: ${err.response?.data?.message || "Unknown error"}`
      );
      throw err;
    }
  };

  return { submitOrder, cancelOrder, markAsPaidWithRef };
};
