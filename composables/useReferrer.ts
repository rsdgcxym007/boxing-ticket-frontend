import { useApi } from "../composables/useApi";
import { useToast } from "vue-toastification";

export const useReferrer = () => {
  const { get, post, patch } = useApi();
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

  // ✅ สร้าง Referrer ใหม่
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

  return {
    getReferrers,
    createReferrer,
    updateReferrer,
  };
};
