import { useApi } from "../composables/useApi";
import { useToast } from "vue-toastification";

export const useOrder = () => {
  const { get, post, patch, put } = useApi();
  const toast = useToast();

  const getOrders = async ({
    page = 1,
    limit = 10,
    status,
    zone,
    search,
  }: {
    page?: number;
    limit?: number;
    status?: string;
    zone?: string;
    search?: string;
  }) => {
    try {
      const query: Record<string, any> = { page, limit };
      if (status) query.status = status;
      if (zone) query.zone = zone;
      if (search) query.search = search;

      const data = await get("/orders", { query });
      return data;
    } catch (err: any) {
      toast.error(
        `ไม่สามารถโหลดออเดอร์ได้: ${
          err.response?.data?.message || "Unknown error"
        }`
      );
      throw err;
    }
  };
  const submitOrder = async ({
    userId,
    seatIds,
    total,
    showDate,
    method,
    status,
  }: {
    userId: string;
    seatIds: string[];
    total: number;
    showDate: string;
    method: string;
    status: string;
  }) => {
    const payload = {
      userId,
      seatIds,
      showDate,
      total,
      method,
      status,
    };

    try {
      const res = await post("/orders", payload);
      toast.success("สร้างออเดอร์สำเร็จ");
      return res;
    } catch (err: any) {
      toast.error(`สร้างออเดอร์ล้มเหลว: ${err.message || "Unknown error"}`);
      throw err;
    }
  };
  const createStanding = async ({
    userId,
    standingAdultQty,
    standingChildQty,
    showDate,
    method,
    status,
    referrerCode,
    customerName,
  }: {
    userId: string;
    standingAdultQty: number;
    standingChildQty: number;
    showDate: string;
    method: string;
    status: string;
    referrerCode?: string;
    customerName?: string;
  }) => {
    const payload = {
      userId,
      standingAdultQty,
      standingChildQty,
      showDate,
      method,
      status,
      referrerCode,
      customerName,
    };

    try {
      const res = await post("/orders/create-standing", payload);
      toast.success("สร้างออเดอร์สำเร็จ");
      return res;
    } catch (err: any) {
      toast.error(`สร้างออเดอร์ล้มเหลว: ${err.message || "Unknown error"}`);
      throw err;
    }
  };
  const updateStanding = async ({
    id,
    userId,
    standingAdultQty,
    standingChildQty,
    showDate,
    method,
    status,
    referrerCode,
    customerName,
  }: {
    id: string;
    userId: string;
    standingAdultQty?: number;
    standingChildQty?: number;
    showDate?: string;
    method?: string;
    status?: string;
    referrerCode?: string;
    customerName?: string;
  }) => {
    const payload = {
      userId,
      standingAdultQty,
      standingChildQty,
      showDate,
      method,
      status,
      referrerCode,
      customerName,
    };

    try {
      const res = await put(`/orders/${id}/update-standing`, payload);
      toast.success("อัปเดตออเดอร์สำเร็จ");
      return res;
    } catch (err: any) {
      toast.error(`อัปเดตออเดอร์ล้มเหลว: ${err.message || "Unknown error"}`);
      throw err;
    }
  };

  const cancelOrder = async (orderId: string) => {
    try {
      await patch(`/orders/cancel/${orderId}`, {
        status: "CANCELLED",
      });
      toast.info(`ยกเลิกออเดอร์ สำเร็จ`);
    } catch (err: any) {
      toast.error(`ยกเลิกออเดอร์ล้มเหลว: ${err.message || "Unknown error"}`);
      throw err;
    }
  };

  const markAsPaidWithRef = async (orderId: string, refCode?: string) => {
    try {
      await patch(`/orders/${orderId}`, {
        status: "PAID",
        ...(refCode && { referrerCode: refCode }),
      });
      toast.success(`ชำระเงินออเดอร์ ${orderId} สำเร็จ`);
    } catch (err: any) {
      toast.error(
        `ชำระเงินล้มเหลว: ${err.response?.data?.message || "Unknown error"}`
      );
      throw err;
    }
  };

  const changeSeats = async (
    orderId: string,
    newSeatIds: string[],
    showDate: string
  ) => {
    console.log(orderId, newSeatIds, showDate);

    try {
      await patch(`/orders/change-seats/${orderId}`, {
        seatIds: newSeatIds,
        showDate,
      });

      toast.success(`เปลี่ยนที่นั่งออเดอร์ ${orderId} สำเร็จ`);
    } catch (err: any) {
      toast.error(
        `เปลี่ยนที่นั่งล้มเหลว: ${
          err.response?.data?.message || "Unknown error"
        }`
      );
      throw err;
    }
  };

  const updateOrderBooked = async (
    orderId: string,
    newSeatIds: string[],
    showDate: string
  ) => {
    console.log(orderId, newSeatIds, showDate);

    try {
      const data = await patch(`/orders/update-booked/${orderId}`, {
        seatIds: newSeatIds,
        showDate,
      });
      toast.success(`อัพเดท ${orderId} สำเร็จ`);
      return data;
    } catch (err: any) {
      toast.error(
        `อัพเดทล้มเหลว: ${err.response?.data?.message || "Unknown error"}`
      );
      throw err;
    }
  };

  return {
    submitOrder,
    cancelOrder,
    markAsPaidWithRef,
    getOrders,
    changeSeats,
    updateOrderBooked,
    createStanding,
    updateStanding,
  };
};
