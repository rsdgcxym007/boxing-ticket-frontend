import { useApi } from "../composables/useApi";
import { useSingleToast } from "./useSingleToast";

export const usePayments = () => {
  const { get, post, patch } = useApi();
  const { showToast } = useSingleToast();

  // ตรงกับ API: POST /api/v1/payments/standing
  const createStandingPayment = async (payload: {
    orderId: string;
    amount: number;
    method: "QR_CODE" | "CASH" | "BANK_TRANSFER" | "CREDIT_CARD";
    customerName: string;
    referrerCode?: string;
  }) => {
    try {
      const res = await post("/api/v1/payments/standing", payload);
      return res.data;
    } catch (err: any) {
      // toast.error(
      //   `สร้างการจองล้มเหลว: ${err.response?.data?.message || "Unknown error"}`
      // );
      throw err;
    }
  };

  // ตรงกับ API: POST /api/v1/payments/seated
  const createSeatedPayment = async (payload: {
    ticketType: "RINGSIDE" | "STADIUM";
    seatIds: string[];
    showDate: string;
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    method: string;
    referrerCode?: string;
  }) => {
    try {
      const res = await post("/api/v1/payments/seated", payload);
      return res.data;
    } catch (err: any) {
      showToast(
        "error",
        `สร้างการจองล้มเหลว: ${err.response?.data?.message || "Unknown error"}`
      );
      throw err;
    }
  };

  // ตรงกับ API: POST /api/v1/payments/{id}/slip
  const uploadPaymentSlip = async (paymentId: string, slipFile: File) => {
    try {
      const formData = new FormData();
      formData.append("slip", slipFile);

      const res = await post(`/api/v1/payments/${paymentId}/slip`, formData);
      showToast("success", "อัพโหลดสลิปสำเร็จ");
      return res.data;
    } catch (err: any) {
      showToast(
        "error",
        `อัพโหลดสลิปล้มเหลว: ${err.response?.data?.message || "Unknown error"}`
      );
      throw err;
    }
  };

  // ตรงกับ API: GET /api/v1/payments/{id}
  const getPaymentDetails = async (paymentId: string) => {
    try {
      const data = await get(`/api/v1/payments/${paymentId}`);
      return data.data;
    } catch (err: any) {
      showToast(
        "error",
        `ไม่สามารถโหลดข้อมูลการชำระเงินได้: ${
          err.response?.data?.message || "Unknown error"
        }`
      );
      throw err;
    }
  };

  // ตรงกับ API: GET /api/v1/payments/order/{orderId}
  const getPaymentByOrderId = async (orderId: string) => {
    try {
      const data = await get(`/api/v1/payments/order/${orderId}`);
      return data.data;
    } catch (err: any) {
      showToast(
        "error",
        `ไม่สามารถโหลดข้อมูลการชำระเงินได้: ${
          err.response?.data?.message || "Unknown error"
        }`
      );
      throw err;
    }
  };

  // ตรงกับ API: GET /api/v1/payments
  const getPayments = async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    try {
      const data = await get("/api/v1/payments", { query: params });
      return data.data;
    } catch (err: any) {
      showToast(
        "error",
        `ไม่สามารถโหลดรายการการชำระเงินได้: ${
          err.response?.data?.message || "Unknown error"
        }`
      );
      throw err;
    }
  };

  // รองรับ API เดิม (Legacy)
  const createPaymentseated = async (payload: {
    userId: string;
    orderId: string;
    amount: number;
    method: string;
    customerName: string;
    referrerCode?: string;
  }) => {
    try {
      await post("/api/v1/payments/seated", payload);
      showToast("success", "ชำระเงินสำเร็จ");
    } catch (err: any) {
      showToast(
        "error",
        `ชำระเงินล้มเหลว: ${err.response?.data?.message || "Unknown error"}`
      );
      throw err;
    }
  };

  return {
    // New API methods
    createStandingPayment,
    createSeatedPayment,
    uploadPaymentSlip,
    getPaymentDetails,
    getPaymentByOrderId,
    getPayments,
    createPaymentseated,
  };
};
