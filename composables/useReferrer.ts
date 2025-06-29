import { useApi } from "../composables/useApi";
import { useToast } from "vue-toastification";
import { useRuntimeConfig } from "nuxt/app";

export const useReferrer = () => {
  const config = useRuntimeConfig();
  const base = config.public.apiBase;
  const { get, post, patch, remove } = useApi();
  const toast = useToast();

  const getReferrers = async ({
    page = 1,
    limit = 10,
    status,
    search,
  }: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }) => {
    try {
      const query: Record<string, any> = { page, limit };
      if (status) query.status = status;
      if (search) query.search = search;

      const data = await get("/referrers", { query });
      return data;
    } catch (err: any) {
      toast.error(
        `ไม่สามารถโหลดรายชื่อผู้แนะนำได้: ${
          err.response?.data?.message || "Unknown error"
        }`
      );
      throw err;
    }
  };

  const getReferrerById = async (id: string) => {
    try {
      const data = await get(`/referrers/${id}/orders`);
      return data;
    } catch (err: any) {
      toast.error(
        `ไม่สามารถโหลดข้อมูลภายในได้: ${
          err.response?.data?.message || "Unknown error"
        }`
      );
      throw err;
    }
  };

  const getReferrerOrders = async (
    id: string,
    filters?: { startDate?: string; endDate?: string }
  ) => {
    try {
      const query: Record<string, string> = {};

      if (filters?.startDate) query.startDate = filters.startDate;
      if (filters?.endDate) query.endDate = filters.endDate;

      const data = await get(`/referrers/${id}/orders`, { query });
      return data;
    } catch (err: any) {
      toast.error(
        `ไม่สามารถโหลดข้อมูลภายในได้: ${
          err.response?.data?.message || "Unknown error"
        }`
      );
      throw err;
    }
  };

  const createReferrer = async ({
    name,
    code,
    note,
  }: {
    name: string;
    code: string;
    note?: string;
  }) => {
    const payload = {
      name,
      code,
      note,
    };

    try {
      const res = await post("/referrers", payload);
      toast.success("สร้างผู้แนะนำสำเร็จ");
      return res;
    } catch (err: any) {
      toast.error(`สร้างผู้แนะนำล้มเหลว: ${err.message || "Unknown error"}`);
      throw err;
    }
  };

  const updateReferrer = async (
    id: string,
    payload: {
      name?: string;
      code?: string;
      note?: string;
      active?: boolean;
    }
  ) => {
    try {
      const res = await patch(`/referrers/${id}`, payload);
      toast.success("อัปเดตผู้แนะนำเรียบร้อย");
      return res;
    } catch (err: any) {
      toast.error(`อัปเดตล้มเหลว: ${err.message || "Unknown error"}`);
      throw err;
    }
  };

  const deleteReferrer = async (id: string) => {
    try {
      const res = await remove(`/referrers/${id}`);
      toast.success("ลบผู้แนะนำเรียบร้อย");
      return res;
    } catch (err: any) {
      toast.error(`ลบผู้แนะนำล้มเหลว: ${err.message || "Unknown error"}`);
      throw err;
    }
  };

  const exportReferrerPdf = async (
    id: string,
    filters?: { startDate?: string; endDate?: string }
  ) => {
    const query: Record<string, string> = {};
    if (filters?.startDate) query.startDate = filters.startDate;
    if (filters?.endDate) query.endDate = filters.endDate;

    const queryString = new URLSearchParams(query).toString();
    const url = `${base}/api/referrers/${id}/export-pdf?${queryString}`;

    window.open(url, "_blank");
  };
  const previewReferrerPdf = async (
    id: string,
    filters?: { startDate?: string; endDate?: string }
  ) => {
    const query: Record<string, string> = {};
    if (filters?.startDate) query.startDate = filters.startDate;
    if (filters?.endDate) query.endDate = filters.endDate;

    const queryString = new URLSearchParams(query).toString();
    const url = `${base}/referrers/${id}/preview-pdf?${queryString}`;
    return url;
  };

  return {
    getReferrers,
    createReferrer,
    updateReferrer,
    getReferrerById,
    getReferrerOrders,
    deleteReferrer,
    exportReferrerPdf,
    previewReferrerPdf,
  };
};
