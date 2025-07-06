import { useApi } from "../composables/useApi";
import { useToast } from "vue-toastification";

export const useDashboard = () => {
  const { get, post, patch } = useApi();
  const toast = useToast();

  // ตรงกับ API: GET /api/v1/dashboard
  const getDashboard = async () => {
    try {
      const data = await get("/api/v1/dashboard");
      return data;
    } catch (err: any) {
      toast.error(
        `ไม่สามารถเรียก Dashboard ได้: ${
          err.response?.data?.message || "Unknown error"
        }`
      );
      throw err;
    }
  };

  // ตรงกับ API: GET /api/v1/dashboard/stats
  const getDashboardStats = async () => {
    try {
      const data = await get("/api/v1/dashboard/stats");
      return data;
    } catch (err: any) {
      toast.error(
        `ไม่สามารถเรียกสถิติได้: ${
          err.response?.data?.message || "Unknown error"
        }`
      );
      throw err;
    }
  };

  // ตรงกับ API: GET /api/v1/dashboard/revenue
  const getRevenueAnalytics = async (params?: {
    period?: "daily" | "weekly" | "monthly";
    startDate?: string;
    endDate?: string;
  }) => {
    try {
      const data = await get("/api/v1/dashboard/revenue", { query: params });
      return data;
    } catch (err: any) {
      toast.error(
        `ไม่สามารถเรียกข้อมูลรายได้ได้: ${
          err.response?.data?.message || "Unknown error"
        }`
      );
      throw err;
    }
  };

  // ตรงกับ API: GET /api/v1/dashboard/occupancy
  const getSeatOccupancy = async (params?: {
    showDate?: string;
    zone?: string;
  }) => {
    try {
      const data = await get("/api/v1/dashboard/occupancy", { query: params });
      return data;
    } catch (err: any) {
      toast.error(
        `ไม่สามารถเรียกข้อมูลที่นั่งได้: ${
          err.response?.data?.message || "Unknown error"
        }`
      );
      throw err;
    }
  };

  // ตรงกับ API: GET /api/v1/dashboard/performance
  const getPerformanceMetrics = async () => {
    try {
      const data = await get("/api/v1/dashboard/performance");
      return data;
    } catch (err: any) {
      toast.error(
        `ไม่สามารถเรียกข้อมูลประสิทธิภาพได้: ${
          err.response?.data?.message || "Unknown error"
        }`
      );
      throw err;
    }
  };

  // ตรงกับ API: GET /api/v1/dashboard/referrers
  const getReferrerAnalytics = async (params?: {
    period?: "weekly" | "monthly";
    limit?: number;
  }) => {
    try {
      const data = await get("/api/v1/dashboard/referrers", { query: params });
      return data;
    } catch (err: any) {
      toast.error(
        `ไม่สามารถเรียกข้อมูลผู้แนะนำได้: ${
          err.response?.data?.message || "Unknown error"
        }`
      );
      throw err;
    }
  };

  // ตรงกับ API: GET /api/v1/dashboard/activities
  const getRecentActivities = async (params?: {
    limit?: number;
    type?: string;
  }) => {
    try {
      const data = await get("/api/v1/dashboard/activities", { query: params });
      return data;
    } catch (err: any) {
      toast.error(
        `ไม่สามารถเรียกข้อมูลกิจกรรมได้: ${
          err.response?.data?.message || "Unknown error"
        }`
      );
      throw err;
    }
  };

  // ตรงกับ API: GET /api/v1/dashboard/alerts
  const getSystemAlerts = async () => {
    try {
      const data = await get("/api/v1/dashboard/alerts");
      return data;
    } catch (err: any) {
      toast.error(
        `ไม่สามารถเรียกข้อมูลแจ้งเตือนได้: ${
          err.response?.data?.message || "Unknown error"
        }`
      );
      throw err;
    }
  };

  return {
    // Main dashboard
    getDashboard,
    getDashboardStats,

    // Analytics
    getRevenueAnalytics,
    getSeatOccupancy,
    getPerformanceMetrics,
    getReferrerAnalytics,

    // Activities & Alerts
    getRecentActivities,
    getSystemAlerts,
  };
};
