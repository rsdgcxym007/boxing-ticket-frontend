import { useApi } from "../composables/useApi";
import { useToast } from "vue-toastification";

export const usePayments = () => {
  const { get, post, patch } = useApi();
  const toast = useToast();

  const createPayment = async (payload: {
    orderId: string;
    amount: number;
    method: string;
    customerName: string;
    referrerCode?: string;
  }) => {
    try {
      await post("/payments", payload);
      toast.success("ชำระเงินสำเร็จ");
    } catch (err: any) {
      toast.error(
        `ชำระเงินล้มเหลว: ${err.response?.data?.message || "Unknown error"}`
      );
      throw err;
    }
  };

  return { createPayment };
};
