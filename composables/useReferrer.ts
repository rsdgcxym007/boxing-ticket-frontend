import { useApi } from "../composables/useApi";
import { useSingleToast } from "./useSingleToast";
import { useRuntimeConfig } from "nuxt/app";

export const useReferrer = () => {
  const config = useRuntimeConfig();
  const base = config.public.apiBase;
  const { get, post, patch, remove } = useApi();
  const { showToast } = useSingleToast();

  // ตรงกับ API: GET /api/v1/referrers
  const getReferrers = async ({
    page = 1,
    limit = 10,
    status,
    search,
    sortBy,
  }: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
    sortBy?: string;
  }) => {
    try {
      const query: Record<string, any> = { page, limit };
      if (status) query.status = status;
      if (search) query.search = search;
      if (sortBy) query.sortBy = sortBy;

      const data = await get("/api/v1/referrers", { query });
      return data.data;
    } catch (err: any) {
      showToast(
        "error",
        `ไม่สามารถโหลดรายชื่อผู้แนะนำได้: ${
          err.response?.data?.message || "Unknown error"
        }`
      );
      throw err;
    }
  };

  // ตรงกับ API: POST /api/v1/referrers
  const createReferrer = async (payload: {
    name: string;
    code: string;
    email?: string;
    phone?: string;
    description?: string;
  }) => {
    try {
      const data = await post("/api/v1/referrers", payload);
      showToast("success", "สร้างผู้แนะนำสำเร็จ");
      return data.data;
    } catch (err: any) {
      showToast(
        "error",
        `สร้างผู้แนะนำล้มเหลว: ${
          err.response?.data?.message || "Unknown error"
        }`
      );
      throw err;
    }
  };

  // ตรงกับ API: PUT /api/v1/referrers/{id}
  const updateReferrer = async (
    id: string,
    payload: {
      name?: string;
      code?: string;
      email?: string;
      phone?: string;
      commissionRate?: number;
      description?: string;
      status?: string;
    }
  ) => {
    try {
      const data = await patch(`/api/v1/referrers/${id}`, payload);
      showToast("success", "อัพเดทผู้แนะนำสำเร็จ");
      return data.data;
    } catch (err: any) {
      showToast(
        "error",
        `อัพเดทผู้แนะนำล้มเหลว: ${
          err.response?.data?.message || "Unknown error"
        }`
      );
      throw err;
    }
  };

  // ตรงกับ API: GET /api/v1/referrers/{id}/orders
  const getReferrerOrders = async (
    id: string,
    params?: {
      page?: number;
      limit?: number;
      startDate?: string;
      endDate?: string;
      status?: string;
    }
  ) => {
    try {
      const data = await get(`/api/v1/referrers/${id}/orders`, {
        query: params,
      });
      return data.data;
    } catch (err: any) {
      showToast(
        "error",
        `ไม่สามารถโหลดข้อมูลออเดอร์ได้: ${
          err.response?.data?.message || "Unknown error"
        }`
      );
      throw err;
    }
  };

  // ตรงกับ API: GET /api/v1/referrers/{id}/export-pdf
  const exportReferrerReport = async (
    id: string,
    params?: {
      startDate?: string;
      endDate?: string;
      format?: "pdf" | "excel";
    }
  ) => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.startDate) queryParams.append("startDate", params.startDate);
      if (params?.endDate) queryParams.append("endDate", params.endDate);
      if (params?.format) queryParams.append("format", params.format);

      const url = `${base}/api/v1/referrers/${id}/export-pdf?${queryParams.toString()}`;

      // Open PDF in new tab
      window.open(url, "_blank");
      showToast("success", "กำลังเตรียมรายงาน...");

      return { success: true, url };
    } catch (err: any) {
      showToast(
        "error",
        `ไม่สามารถส่งออกรายงานได้: ${
          err.response?.data?.message || "Unknown error"
        }`
      );
      throw err;
    }
  };

  // สำหรับ PDF Preview - ใช้ Blob URL
  const getReferrerPdfForPreview = async (
    id: string,
    params?: {
      startDate?: string;
      endDate?: string;
    }
  ) => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.startDate) queryParams.append("startDate", params.startDate);
      if (params?.endDate) queryParams.append("endDate", params.endDate);

      const url = `${base}/api/v1/referrers/${id}/export-pdf?${queryParams.toString()}`;

      // Fetch PDF as blob
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/pdf",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      return {
        success: true,
        url: blobUrl,
        blob: blob,
      };
    } catch (err: any) {
      console.error("Error fetching PDF:", err);
      showToast(
        "error",
        `ไม่สามารถโหลด PDF ได้: ${err.message || "Unknown error"}`
      );
      throw err;
    }
  };

  // Legacy method - รองรับเดิม
  const getReferrerById = async (id: string) => {
    try {
      const data = await get(`/referrers/${id}/orders`);
      return data.data;
    } catch (err: any) {
      showToast(
        "error",
        `ไม่สามารถโหลดข้อมูลภายในได้: ${
          err.response?.data?.message || "Unknown error"
        }`
      );
      throw err;
    }
  };

  return {
    // New API methods
    getReferrers,
    createReferrer,
    updateReferrer,
    getReferrerOrders,
    exportReferrerReport,
    getReferrerPdfForPreview, // เพิ่มฟังก์ชันใหม่
    // Legacy methods
    getReferrerById,
  };
};
