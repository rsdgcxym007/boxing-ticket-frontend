import { ref, reactive } from "vue";
import { useApi } from "../composables/useApi";
import { useToast } from "vue-toastification";
import type { AuditLog } from "../types/order";

export interface AuditStats {
  totalLogs: number;
  activeUsers: number;
  suspiciousActivities: number;
  todayLogs: number;
  weeklyLogs: number;
  monthlyLogs: number;
}

export interface UserActivity {
  userId: string;
  userName: string;
  userEmail: string;
  activity: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
}

export interface SuspiciousActivity {
  id: string;
  activity: string;
  timestamp: string;
  riskLevel: "low" | "medium" | "high" | "critical";
  status: "pending" | "reviewed" | "resolved" | "ignored";
  details: {
    ipAddress: string;
    userAgent: string;
    userId?: string;
    attemptCount?: number;
    pattern?: string;
  };
}

export interface EntityHistory {
  entityId: string;
  entityType: string;
  changes: Array<{
    field: string;
    oldValue: any;
    newValue: any;
    timestamp: string;
    userId: string;
    userName: string;
  }>;
}

export const useAudit = () => {
  const { get, post, put } = useApi();
  const toast = useToast();

  // Reactive state
  const loading = ref(false);
  const auditLogs = ref<AuditLog[]>([]);
  const stats = ref<AuditStats | null>(null);
  const suspiciousActivities = ref<SuspiciousActivity[]>([]);

  // ดึงข้อมูล audit logs ทั้งหมด
  const getAuditLogs = async (params?: {
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
    userId?: string;
    action?: string;
    entityType?: string;
    query?: string;
  }) => {
    try {
      loading.value = true;
      const queryParams: Record<string, any> = {
        page: params?.page || 1,
        limit: params?.limit || 20,
      };

      if (params?.startDate) queryParams.startDate = params.startDate;
      if (params?.endDate) queryParams.endDate = params.endDate;
      if (params?.userId) queryParams.userId = params.userId;
      if (params?.action) queryParams.action = params.action;
      if (params?.entityType) queryParams.entityType = params.entityType;
      if (params?.query) queryParams.search = params.query;

      const data = await get("/api/v1/audit", { query: queryParams });
      auditLogs.value = data.data?.logs || [];
      return {
        logs: data.data?.logs || [],
        total: data.data?.total || 0,
        totalPages: data.data?.totalPages || 1,
      };
    } catch (err: any) {
      auditLogs.value = [];
      toast.error(
        `ไม่สามารถโหลด audit logs ได้: ${
          err.response?.data?.message || "Unknown error"
        }`
      );
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // ดึงข้อมูลสถิติของ audit logs
  const getAuditStats = async (): Promise<AuditStats> => {
    try {
      const data = await get("/api/v1/audit/stats");
      stats.value = data.data;
      return data.data;
    } catch (err: any) {
      toast.error(
        `ไม่สามารถโหลดสถิติ audit ได้: ${
          err.response?.data?.message || "Unknown error"
        }`
      );
      throw err;
    }
  };

  // ดึงข้อมูลกิจกรรมของผู้ใช้
  const getUserActivity = async (params?: {
    userId?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
  }): Promise<UserActivity[]> => {
    try {
      const query: Record<string, any> = {};

      if (params?.userId) query.userId = params.userId;
      if (params?.startDate) query.startDate = params.startDate;
      if (params?.endDate) query.endDate = params.endDate;
      if (params?.limit) query.limit = params.limit;

      const data = await get("/api/v1/audit/user-activity", { query });
      return data.data;
    } catch (err: any) {
      toast.error(
        `ไม่สามารถโหลดกิจกรรมผู้ใช้ได้: ${
          err.response?.data?.message || "Unknown error"
        }`
      );
      throw err;
    }
  };

  // ดึงข้อมูลประวัติของ entity
  const getEntityHistory = async (
    entityType: string,
    entityId: string
  ): Promise<EntityHistory> => {
    try {
      const data = await get("/api/v1/audit/entity-history", {
        query: { entityType, entityId },
      });
      return data.data;
    } catch (err: any) {
      toast.error(
        `ไม่สามารถโหลดประวัติ entity ได้: ${
          err.response?.data?.message || "Unknown error"
        }`
      );
      throw err;
    }
  };

  // ค้นหา audit logs ตามเงื่อนไข
  const searchAuditLogs = async (params: {
    query: string;
    filters?: {
      startDate?: string;
      endDate?: string;
      userId?: string;
      action?: string;
      entityType?: string;
    };
    page?: number;
    limit?: number;
  }) => {
    try {
      const searchParams: Record<string, any> = {
        q: params.query,
        page: params.page || 1,
        limit: params.limit || 20,
      };

      if (params.filters) {
        Object.assign(searchParams, params.filters);
      }

      const data = await get("/api/v1/audit/search", { query: searchParams });
      return data.data;
    } catch (err: any) {
      toast.error(
        `ไม่สามารถค้นหา audit logs ได้: ${
          err.response?.data?.message || "Unknown error"
        }`
      );
      throw err;
    }
  };

  // รายงานกิจกรรมที่น่าสงสัย
  const getSuspiciousActivities = async (params?: {
    startDate?: string;
    endDate?: string;
    riskLevel?: string;
    limit?: number;
  }): Promise<SuspiciousActivity[]> => {
    try {
      const query: Record<string, any> = {};

      if (params?.startDate) query.startDate = params.startDate;
      if (params?.endDate) query.endDate = params.endDate;
      if (params?.riskLevel) query.riskLevel = params.riskLevel;
      if (params?.limit) query.limit = params.limit;

      const data = await get("/api/v1/audit/reports/suspicious", { query });
      suspiciousActivities.value = data.data || [];
      return data.data || [];
    } catch (err: any) {
      suspiciousActivities.value = [];
      toast.error(
        `ไม่สามารถโหลดรายงานกิจกรรมที่น่าสงสัยได้: ${
          err.response?.data?.message || "Unknown error"
        }`
      );
      throw err;
    }
  };

  // ส่งออกรายงาน audit
  const exportAuditReport = async (params: {
    format: "csv" | "excel" | "pdf";
    startDate: string;
    endDate: string;
    filters?: {
      userId?: string;
      action?: string;
      entityType?: string;
    };
  }) => {
    try {
      const exportParams: Record<string, any> = {
        format: params.format,
        startDate: params.startDate,
        endDate: params.endDate,
      };

      if (params.filters) {
        Object.assign(exportParams, params.filters);
      }

      const data = await post("/api/v1/audit/export", exportParams);

      if (data.data.fileUrl) {
        // Open download link
        const link = document.createElement("a");
        link.href = data.data.fileUrl;
        link.download = data.data.fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success("กำลังดาวน์โหลดรายงาน...");
      }

      return data.data;
    } catch (err: any) {
      toast.error(
        `ไม่สามารถส่งออกรายงานได้: ${
          err.response?.data?.message || "Unknown error"
        }`
      );
      throw err;
    }
  };

  // อัปเดตสถานะของกิจกรรมที่น่าสงสัย
  const updateSuspiciousActivityStatus = async (
    id: string,
    status: SuspiciousActivity["status"]
  ) => {
    try {
      const data = await put(`/api/v1/audit/suspicious/${id}/status`, {
        status,
      });
      toast.success("อัปเดตสถานะเรียบร้อยแล้ว");
      return data.data;
    } catch (err: any) {
      toast.error(
        `ไม่สามารถอัปเดตสถานะได้: ${
          err.response?.data?.message || "Unknown error"
        }`
      );
      throw err;
    }
  };

  return {
    // State
    loading,
    auditLogs,
    stats,
    suspiciousActivities,
    // Methods
    getAuditLogs,
    getAuditStats,
    getUserActivity,
    getEntityHistory,
    searchAuditLogs,
    getSuspiciousActivities,
    exportAuditReport,
    updateSuspiciousActivityStatus,
  };
};
