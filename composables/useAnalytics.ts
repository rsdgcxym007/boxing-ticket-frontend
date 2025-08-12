import { useApi } from "./useApi";
import { useSingleToast } from "./useSingleToast";

export interface DailySalesData {
  date: string;
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  hourlyBreakdown: Array<{
    hour: number;
    sales: number;
    orders: number;
  }>;
  paymentMethods: Record<
    string,
    {
      amount: number;
      count: number;
    }
  >;
}

export interface MonthlySalesData {
  year: number;
  month: number;
  totalSales: number;
  totalOrders: number;
  dailyBreakdown: Array<{
    date: string;
    sales: number;
    orders: number;
  }>;
}

export interface RealtimeHealth {
  systemStatus: "healthy" | "warning" | "critical";
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  activeConnections: number;
  responseTime: number;
}

export interface BusinessMetrics {
  currentSales: number;
  onlineUsers: number;
  todayOrders: number;
  conversionRate: number;
  popularZones: string[];
}

export interface SalesPredicition {
  predictedSales: number;
  confidence: number;
  factors: string[];
  recommendations: string[];
}

export interface SeatUtilization {
  zone: string;
  totalSeats: number;
  occupiedSeats: number;
  utilizationRate: number;
  revenue: number;
}

export const useAnalytics = () => {
  const { get } = useApi();
  const { showToast } = useSingleToast();

  /**
   * Sales Analytics
   */
  const getDailySales = async (date?: string): Promise<DailySalesData> => {
    try {
      const response = await get("/analytics/sales/daily", {
        query: { date: date || new Date().toISOString().split("T")[0] },
      });
      return response.data;
    } catch (error: any) {
      showToast(
        "error",
        `ไม่สามารถโหลดข้อมูลยอดขายรายวันได้: ${error.message}`
      );
      throw error;
    }
  };

  const getMonthlySales = async (
    year: number,
    month: number
  ): Promise<MonthlySalesData> => {
    try {
      const response = await get("/analytics/sales/monthly", {
        query: { year, month },
      });
      return response.data;
    } catch (error: any) {
      showToast(
        "error",
        `ไม่สามารถโหลดข้อมูลยอดขายรายเดือนได้: ${error.message}`
      );
      throw error;
    }
  };

  const getWeeklyComparison = async () => {
    try {
      const response = await get("/analytics/sales/weekly-comparison");
      return response.data;
    } catch (error: any) {
      showToast(
        "error",
        `ไม่สามารถโหลดข้อมูลเปรียบเทียบรายสัปดาห์ได้: ${error.message}`
      );
      throw error;
    }
  };

  const getDateRangeSales = async (startDate: string, endDate: string) => {
    try {
      const response = await get("/analytics/sales/date-range", {
        query: { startDate, endDate },
      });
      return response.data;
    } catch (error: any) {
      showToast(
        "error",
        `ไม่สามารถโหลดข้อมูลยอดขายช่วงวันที่ได้: ${error.message}`
      );
      throw error;
    }
  };

  /**
   * Realtime Monitoring
   */
  const getSystemHealth = async (): Promise<RealtimeHealth> => {
    try {
      const response = await get("/analytics/realtime/health");
      return response.data;
    } catch (error: any) {
      showToast("error", `ไม่สามารถโหลดสถานะระบบได้: ${error.message}`);
      throw error;
    }
  };

  const getPerformanceMetrics = async () => {
    try {
      const response = await get("/analytics/realtime/performance");
      return response.data;
    } catch (error: any) {
      showToast("error", `ไม่สามารถโหลดข้อมูลประสิทธิภาพได้: ${error.message}`);
      throw error;
    }
  };

  const getBusinessMetrics = async (): Promise<BusinessMetrics> => {
    try {
      const response = await get("/analytics/realtime/business");
      return response.data;
    } catch (error: any) {
      showToast("error", `ไม่สามารถโหลดข้อมูลธุรกิจได้: ${error.message}`);
      throw error;
    }
  };

  /**
   * Predictions & Optimization
   */
  const getSalesPredictions = async (
    days: number = 30
  ): Promise<SalesPredicition> => {
    try {
      const response = await get("/analytics/predictions/sales", {
        query: { days },
      });
      return response.data;
    } catch (error: any) {
      showToast("error", `ไม่สามารถโหลดการพยากรณ์ยอดขายได้: ${error.message}`);
      throw error;
    }
  };

  const getDemandForecasting = async (zoneId: string, weeks: number = 4) => {
    try {
      const response = await get("/analytics/predictions/demand", {
        query: { zoneId, weeks },
      });
      return response.data;
    } catch (error: any) {
      showToast(
        "error",
        `ไม่สามารถโหลดการพยากรณ์ความต้องการได้: ${error.message}`
      );
      throw error;
    }
  };

  const getRevenueOptimization = async (zoneId: string) => {
    try {
      const response = await get("/analytics/optimization/revenue", {
        query: { zoneId },
      });
      return response.data;
    } catch (error: any) {
      showToast(
        "error",
        `ไม่สามารถโหลดข้อมูลเพิ่มประสิทธิภาพรายได้ได้: ${error.message}`
      );
      throw error;
    }
  };

  const getSeatUtilization = async (
    zoneId?: string
  ): Promise<SeatUtilization[]> => {
    try {
      const response = await get("/analytics/seats/utilization", {
        query: zoneId ? { zoneId } : {},
      });
      return response.data;
    } catch (error: any) {
      showToast(
        "error",
        `ไม่สามารถโหลดข้อมูลการใช้งานที่นั่งได้: ${error.message}`
      );
      throw error;
    }
  };

  return {
    // Sales Analytics
    getDailySales,
    getMonthlySales,
    getWeeklyComparison,
    getDateRangeSales,

    // Realtime Monitoring
    getSystemHealth,
    getPerformanceMetrics,
    getBusinessMetrics,

    // Predictions & Optimization
    getSalesPredictions,
    getDemandForecasting,
    getRevenueOptimization,
    getSeatUtilization,
  };
};
