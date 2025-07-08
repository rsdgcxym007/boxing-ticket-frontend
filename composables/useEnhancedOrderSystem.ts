import { useApi } from "../composables/useApi";
import { useToast } from "vue-toastification";

export const useEnhancedOrderSystem = () => {
  const { get, post } = useApi();
  const toast = useToast();

  // ล็อกที่นั่งชั่วคราว
  const lockSeats = async (seatIds, showDate) => {
    try {
      const response = await post("/api/v1/orders/seats/lock", {
        seatIds,
        showDate,
      });
      return response.data;
    } catch (err) {
      toast.error(
        `ไม่สามารถล็อกที่นั่งได้: ${
          err.response?.data?.message || "Unknown error"
        }`
      );
      throw err;
    }
  };

  // ปลดล็อกที่นั่ง
  const unlockSeats = async (seatIds, showDate) => {
    try {
      const response = await post("/api/v1/orders/seats/unlock", {
        seatIds,
        showDate,
      });

      return response;
    } catch (err) {
      toast.error(
        `ไม่สามารถปลดล็อกที่นั่งได้: ${
          err.response?.data?.message || "Unknown error"
        }`
      );
      throw err;
    }
  };

  // ตรวจสอบสถานะระบบ
  const getSystemHealth = async () => {
    try {
      const response = await get("/api/v1/orders/system/health");
      return response.data;
    } catch (err) {
      toast.error(
        `ไม่สามารถตรวจสอบสถานะระบบได้: ${
          err.response?.data?.message || "Unknown error"
        }`
      );
      throw err;
    }
  };

  // ดูสถิติระบบ
  const getSystemStats = async () => {
    try {
      const response = await get("/api/v1/orders/system/stats");
      return response.data;
    } catch (err) {
      toast.error(
        `ไม่สามารถดึงข้อมูลสถิติระบบได้: ${
          err.response?.data?.message || "Unknown error"
        }`
      );
      throw err;
    }
  };

  return {
    lockSeats,
    unlockSeats,
    getSystemHealth,
    getSystemStats,
  };
};
