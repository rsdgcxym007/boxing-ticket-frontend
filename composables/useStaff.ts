import { useApi } from "../composables/useApi";
import { useSingleToast } from "./useSingleToast";

export interface Staff {
  id: string;
  staffCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: "admin" | "manager" | "staff" | "supervisor";
  status: "active" | "inactive" | "suspended" | "terminated";
  department?: string;
  position?: string;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface CreateStaffData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: "admin" | "manager" | "staff" | "supervisor";
  department?: string;
  position?: string;
  permissions?: string[];
}

export interface UpdateStaffData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  department?: string;
  position?: string;
  permissions?: string[];
}

export interface StaffSummary {
  counts: {
    total: number;
    active: number;
    inactive: number;
    suspended: number;
    terminated: number;
  };
  distribution: {
    byRole: Record<string, number>;
    byDepartment: Record<string, number>;
  };
  growth: {
    thisMonth: number;
    lastMonth: number;
  };
}

export const useStaff = () => {
  const { get, post, patch, remove } = useApi();
  const { showToast } = useSingleToast();

  // ตรงกับ API: POST /api/v1/staff
  const createStaff = async (data: CreateStaffData) => {
    try {
      const response = await post("/api/v1/staff", data);
      return response.data;
    } catch (err: any) {
      showToast(
        "error",
        `สร้างพนักงานล้มเหลว: ${err.message || "Unknown error"}`
      );
      throw err;
    }
  };

  // ตรงกับ API: GET /api/v1/staff
  const getStaffList = async (params?: {
    page?: number;
    limit?: number;
    role?: string;
    status?: string;
    department?: string;
    search?: string;
  }) => {
    try {
      const response = await get("/api/v1/staff", { query: params });
      return response;
    } catch (err: any) {
      showToast(
        "error",
        `โหลดรายการพนักงานล้มเหลว: ${err.message || "Unknown error"}`
      );
      throw err;
    }
  };

  // ตรงกับ API: GET /api/v1/staff/:id
  const getStaffById = async (id: string) => {
    try {
      const response = await get(`/api/v1/staff/${id}`);
      return response.data;
    } catch (err: any) {
      showToast(
        "error",
        `โหลดข้อมูลพนักงานล้มเหลว: ${err.message || "Unknown error"}`
      );
      throw err;
    }
  };

  // ตรงกับ API: PATCH /api/v1/staff/:id
  const updateStaff = async (id: string, data: UpdateStaffData) => {
    try {
      const response = await patch(`/api/v1/staff/${id}`, data);
      showToast("success", "อัปเดตข้อมูลพนักงานสำเร็จ");
      return response.data;
    } catch (err: any) {
      showToast(
        "error",
        `อัปเดตข้อมูลพนักงานล้มเหลว: ${err.message || "Unknown error"}`
      );
      throw err;
    }
  };

  // ตรงกับ API: PATCH /api/v1/staff/:id/status
  const changeStaffStatus = async (
    id: string,
    status: "active" | "inactive" | "suspended" | "terminated",
    reason?: string
  ) => {
    try {
      const response = await patch(`/api/v1/staff/${id}/status`, {
        status,
        reason,
      });
      showToast("success", "เปลี่ยนสถานะพนักงานสำเร็จ");
      return response.data;
    } catch (err: any) {
      showToast(
        "error",
        `เปลี่ยนสถานะพนักงานล้มเหลว: ${err.message || "Unknown error"}`
      );
      throw err;
    }
  };

  // ตรงกับ API: DELETE /api/v1/staff/:id
  const deleteStaff = async (id: string) => {
    try {
      const response = await remove(`/api/v1/staff/${id}`);
      showToast("success", "ลบพนักงานสำเร็จ");
      return response.data;
    } catch (err: any) {
      showToast("error", `ลบพนักงานล้มเหลว: ${err.message || "Unknown error"}`);
      throw err;
    }
  };

  // ตรงกับ API: GET /api/v1/staff/analytics/summary
  const getStaffSummary = async (): Promise<StaffSummary> => {
    try {
      const response = await get("/api/v1/staff/analytics/summary");
      return response.data;
    } catch (err: any) {
      showToast(
        "error",
        `โหลดสรุปข้อมูลพนักงานล้มเหลว: ${err.message || "Unknown error"}`
      );
      throw err;
    }
  };

  // ตรงกับ API: GET /api/v1/staff/meta/departments
  const getDepartments = async (): Promise<string[]> => {
    try {
      const response = await get("/api/v1/staff/meta/departments");
      return response.data;
    } catch (err: any) {
      showToast(
        "error",
        `โหลดรายการแผนกล้มเหลว: ${err.message || "Unknown error"}`
      );
      throw err;
    }
  };

  // API Integration endpoints
  const getDashboardData = async () => {
    try {
      const response = await get("/api/v1/api-integration/dashboard");
      return response.data;
    } catch (err: any) {
      showToast(
        "error",
        `โหลดข้อมูล Dashboard ล้มเหลว: ${err.message || "Unknown error"}`
      );
      throw err;
    }
  };

  const getAnalyticsData = async () => {
    try {
      const response = await get("/api/v1/api-integration/analytics");
      return response.data;
    } catch (err: any) {
      showToast(
        "error",
        `โหลดข้อมูล Analytics ล้มเหลว: ${err.message || "Unknown error"}`
      );
      throw err;
    }
  };

  const getPerformanceData = async () => {
    try {
      const response = await get("/api/v1/api-integration/performance");
      return response.data;
    } catch (err: any) {
      showToast(
        "error",
        `โหลดข้อมูล Performance ล้มเหลว: ${err.message || "Unknown error"}`
      );
      throw err;
    }
  };

  const getAuditData = async () => {
    try {
      const response = await get("/api/v1/api-integration/audit");
      return response.data;
    } catch (err: any) {
      showToast(
        "error",
        `โหลดข้อมูล Audit ล้มเหลว: ${err.message || "Unknown error"}`
      );
      throw err;
    }
  };

  const getSystemOverview = async () => {
    try {
      const response = await get("/api/v1/api-integration/system");
      return response.data;
    } catch (err: any) {
      showToast(
        "error",
        `โหลดข้อมูลภาพรวมระบบล้มเหลว: ${err.message || "Unknown error"}`
      );
      throw err;
    }
  };

  const getAvailableEndpoints = async () => {
    try {
      const response = await get("/api/v1/api-integration/endpoints");
      return response.data;
    } catch (err: any) {
      showToast(
        "error",
        `โหลดรายการ Endpoints ล้มเหลว: ${err.message || "Unknown error"}`
      );
      throw err;
    }
  };

  const clearCache = async () => {
    try {
      const response = await remove("/api/v1/api-integration/cache");
      showToast("success", "ล้าง Cache สำเร็จ");
      return response.data;
    } catch (err: any) {
      showToast(
        "error",
        `ล้าง Cache ล้มเหลว: ${err.message || "Unknown error"}`
      );
      throw err;
    }
  };

  // Reset Staff Password
  const resetStaffPassword = async (staffId: string): Promise<any> => {
    try {
      const response = await patch(
        `/api/v1/staff/${staffId}/reset-password`,
        {}
      );
      showToast("success", "รีเซ็ตรหัสผ่านพนักงานสำเร็จ");
      return response.data;
    } catch (err: any) {
      showToast(
        "error",
        `รีเซ็ตรหัสผ่านล้มเหลว: ${err.message || "Unknown error"}`
      );
      throw err;
    }
  };

  // Link Staff to Existing User
  const linkStaffToUser = async (
    staffId: string,
    userId: string
  ): Promise<any> => {
    try {
      const response = await patch(`/api/v1/staff/${staffId}/link-user`, {
        userId,
      });
      showToast("success", "เชื่อมต่อพนักงานกับผู้ใช้สำเร็จ");
      return response.data;
    } catch (err: any) {
      showToast(
        "error",
        `เชื่อมต่อพนักงานล้มเหลว: ${err.message || "Unknown error"}`
      );
      throw err;
    }
  };

  // Get Staff Permissions
  const getStaffPermissions = async (): Promise<string[]> => {
    try {
      const response = await get("/api/v1/staff/my/permissions");
      return response.data;
    } catch (err: any) {
      showToast(
        "error",
        `โหลดสิทธิ์พนักงานล้มเหลว: ${err.message || "Unknown error"}`
      );
      throw err;
    }
  };

  return {
    // Core Staff Management
    createStaff,
    getStaffList,
    getStaffById,
    updateStaff,
    changeStaffStatus,
    deleteStaff,
    resetStaffPassword,
    linkStaffToUser,
    getStaffPermissions,

    // Analytics & Meta
    getStaffSummary,
    getDepartments,

    // API Integration
    getDashboardData,
    getAnalyticsData,
    getPerformanceData,
    getAuditData,
    getSystemOverview,
    getAvailableEndpoints,
    clearCache,
  };
};
