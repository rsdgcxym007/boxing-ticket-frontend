import { useApi } from "../composables/useApi";
const { post, patch } = useApi();

export const useOrder = () => {
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
    const payload = {
      orderId,
      zone,
      seats: selectedSeats,
      total,
      method,
    };

    const { data } = await post("/api/orders", payload);

    // if (data.data.mew) throw new Error("❌ Order submit failed");
    return data;
  };
  const cancelOrder = async (orderId: string) => {
    const { error } = await patch(`/api/orders/cancel/${orderId}`, {
      erId: "ORDER123456",
      status: "CANCELLED",
    });
    if (error) throw new Error("❌ ยกเลิกออเดอร์ล้มเหลว");
  };

  return { submitOrder, cancelOrder };
};
