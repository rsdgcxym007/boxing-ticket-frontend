import { useApi } from "../composables/useApi";
import { useSingleToast } from "./useSingleToast";

export const useDashboard = () => {
  const { get, post, patch } = useApi();
  const { showToast } = useSingleToast();

  // ตรงกับ API: GET /api/v1/dashboard
  const getDashboard = async () => {
    try {
      const data = await get("/api/v1/dashboard");
      return data.data;
    } catch (err: any) {
      showToast(
        "error",
        `ไม่สามารถเรียก Dashboard ได้: ${
          err.response?.data?.message || "Unknown error"
        }`
      );
      throw err;
    }
  };

  // ตรงกับ API: GET /api/v1/dashboard/referrer-performance
  const getTodayReferrerPerformance = async () => {
    try {
      const data = await get("/api/v1/dashboard/referrer-performance");
      return data.data;
    } catch (err: any) {
      showToast(
        "error",
        `ไม่สามารถเรียกข้อมูล Referrer วันนี้ได้: ${
          err.response?.data?.message || "Unknown error"
        }`
      );
      throw err;
    }
  };

  // ตรงกับ API: GET /api/v1/dashboard/all-referrers
  const getAllReferrerPerformance = async () => {
    try {
      const data = await get("/api/v1/dashboard/all-referrers");
      return data;
    } catch (err: any) {
      showToast(
        "error",
        `ไม่สามารถเรียกข้อมูล Referrer ทั้งหมดได้: ${
          err.response?.data?.message || "Unknown error"
        }`
      );
      throw err;
    }
  };

  // ตรงกับ API: GET /api/v1/dashboard/ticket-sales
  const getTicketSalesSummary = async () => {
    try {
      const data = await get("/api/v1/dashboard/ticket-sales");
      return data;
    } catch (err: any) {
      showToast(
        "error",
        `ไม่สามารถเรียกข้อมูลยอดขายตั๋วได้: ${
          err.response?.data?.message || "Unknown error"
        }`
      );
      throw err;
    }
  };

  // ตรงกับ API: GET /api/v1/dashboard/revenue-summary
  const getRevenueSummary = async () => {
    try {
      const data = await get("/api/v1/dashboard/revenue-summary");
      return data.data;
    } catch (err: any) {
      showToast(
        "error",
        `ไม่สามารถเรียกข้อมูลรายได้ได้: ${
          err.response?.data?.message || "Unknown error"
        }`
      );
      throw err;
    }
  };

  // ตรงกับ API: GET /api/v1/dashboard/seat-availability
  const getSeatAvailability = async (showDate?: string) => {
    try {
      const data = await get("/api/v1/dashboard/seat-availability", {
        query: { showDate },
      });
      return data.data;
    } catch (err: any) {
      showToast(
        "error",
        `ไม่สามารถเรียกข้อมูลที่นั่งว่างได้: ${
          err.response?.data?.message || "Unknown error"
        }`
      );
      throw err;
    }
  };

  // ตรงกับ API: GET /api/v1/dashboard/customer-analytics
  const getCustomerAnalytics = async () => {
    try {
      const data = await get("/api/v1/dashboard/customer-analytics");
      return data.data;
    } catch (err: any) {
      showToast(
        "error",
        `ไม่สามารถเรียกข้อมูลลูกค้าได้: ${
          err.response?.data?.message || "Unknown error"
        }`
      );
      throw err;
    }
  };

  // ตรงกับ API: GET /api/v1/dashboard/system-health
  const getSystemHealth = async () => {
    try {
      const data = await get("/api/v1/dashboard/system-health");
      return data.data;
    } catch (err: any) {
      showToast(
        "error",
        `ไม่สามารถเรียกข้อมูลสถานะระบบได้: ${
          err.response?.data?.message || "Unknown error"
        }`
      );
      throw err;
    }
  };

  // ตรงกับ API: GET /api/v1/dashboard/quick-stats
  const getQuickStats = async () => {
    try {
      const data = await get("/api/v1/dashboard/quick-stats");
      return data.data;
    } catch (err: any) {
      showToast(
        "error",
        `ไม่สามารถเรียกข้อมูลสถิติด่วนได้: ${
          err.response?.data?.message || "Unknown error"
        }`
      );
      throw err;
    }
  };

  return {
    getDashboard,
    getTodayReferrerPerformance,
    getAllReferrerPerformance,
    getTicketSalesSummary,
    getRevenueSummary,
    getSeatAvailability,
    getCustomerAnalytics,
    getSystemHealth,
    getQuickStats,
  };
};
