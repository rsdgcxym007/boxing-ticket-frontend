import { useRuntimeConfig } from "nuxt/app";
import { useApi } from "../composables/useApi";
import { useSingleToast } from "./useSingleToast";

export const useOrder = () => {
  const { get, post, patch, put } = useApi();
  const { showToast } = useSingleToast();
  const config = useRuntimeConfig();
  const base = config.public.apiBase;
  // ตรงกับ API: GET /api/v1/orders
  const getOrders = async ({
    page = 1,
    limit = 10,
    status,
    zone,
    search,
    startDate,
    endDate,
    createdBy,
    showDate,
    paymentMethod,
  }: {
    page?: number;
    limit?: number;
    status?: string;
    zone?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
    createdBy?: string;
    showDate?: string;
    paymentMethod?: string;
  }) => {
    try {
      const query: Record<string, any> = { page, limit };
      console.log("showDate"), showDate;

      if (status) query.status = status;
      if (zone) query.zone = zone;
      if (search) query.search = search;
      if (startDate) query.startDate = startDate;
      if (endDate) query.endDate = endDate;
      if (createdBy) query.createdBy = createdBy;
      if (showDate) query.showDate = showDate;
      if (paymentMethod) query.paymentMethod = paymentMethod;

      const data = await get("/api/v1/orders", { query });
      return data.data;
    } catch (err: any) {
      showToast(
        "error",
        `ไม่สามารถโหลดออเดอร์ได้: ${
          err.response?.data?.message || "Unknown error"
        }`
      );
      throw err;
    }
  };

  // ตรงกับ API: GET /api/v1/orders/{id}
  const getOrderById = async (orderId: string) => {
    try {
      const data = await get(`/api/v1/orders/${orderId}`);
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

  // ตรงกับ API: POST /api/v1/orders (Updated)
  const submitOrder = async ({
    customerName,
    customerPhone,
    customerEmail,
    ticketType,
    quantity,
    seatIds,
    showDate,
    referrerCode,
    paymentMethod,
    note,
    source,
    standingAdultQty,
    standingChildQty,
    status,
  }: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    ticketType: string;
    quantity?: number;
    seatIds?: string[];
    showDate: string;
    referrerCode?: string;
    paymentMethod?: string;
    note?: string;
    source?: string;
    standingAdultQty?: number;
    standingChildQty?: number;
    status?: string; // Optional status for the order
  }) => {
    const payload = {
      customerName,
      customerPhone,
      customerEmail,
      ticketType,
      quantity,
      seatIds,
      showDate,
      referrerCode,
      paymentMethod,
      note,
      source,
      standingAdultQty,
      standingChildQty,
      status,
    };

    try {
      const res = await post("/api/v1/orders", payload);
      return res.data;
    } catch (err: any) {
      showToast("error", `${err || "Unknown error"}`);
      throw err;
    }
  };

  // ตรงกับ API: PATCH /api/v1/orders/{id}/cancel
  const cancelOrder = async (orderId: string) => {
    try {
      const res = await patch(`/api/v1/orders/${orderId}/cancel`, {});
      return res.data;
    } catch (err: any) {
      showToast("error", `ยกเลิกออเดอร์ล้มเหลว: ${err || "Unknown error"}`);
      throw err;
    }
  };

  // ตรงกับ API: PATCH /api/v1/orders/{id}/confirm-payment
  const confirmPayment = async (orderId: string) => {
    try {
      const res = await patch(`/api/v1/orders/${orderId}/confirm-payment`, {});
      return res.data;
    } catch (err: any) {
      showToast("error", `ยืนยันการชำระเงินล้มเหลว: ${err || "Unknown error"}`);
      throw err;
    }
  };
  // ตรงกับ API: PUT /orders/:id/update-standing-order
  const updateStanding = async ({
    id,
    customerName,
    customerPhone,
    customerEmail,
    ticketType,
    showDate,
    referrerCode,
    paymentMethod,
    note,
    source,
    standingAdultQty,
    standingChildQty,
  }: {
    id: string;
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    ticketType: string;
    showDate: string;
    referrerCode?: string;
    paymentMethod?: string;
    note?: string;
    source?: string;
    standingAdultQty?: number;
    standingChildQty?: number;
  }) => {
    const payload = {
      customerName,
      customerPhone,
      customerEmail,
      ticketType,
      showDate,
      referrerCode,
      paymentMethod,
      note,
      source,
      standingAdultQty,
      standingChildQty,
    };

    try {
      const res = await patch(
        `/api/v1/orders/${id}/update-standing-order`,
        payload
      );
      return res;
    } catch (err: any) {
      showToast(
        "error",
        `อัปเดตออเดอร์ล้มเหลว: ${err.message || "Unknown error"}`
      );
      throw err;
    }
  };

  const markAsPaidWithRef = async (orderId: string, refCode?: string) => {
    try {
      await patch(`/api/v1/orders/${orderId}/confirm-payment`, {
        ...(refCode && { referrerCode: refCode }),
      });
      showToast("success", `ชำระเงินออเดอร์ ${orderId} สำเร็จ`);
    } catch (err: any) {
      showToast(
        "error",
        `ชำระเงินล้มเหลว: ${err.response?.data?.message || "Unknown error"}`
      );
      throw err;
    }
  };

  const changeSeats = async (
    orderId: string,
    seatIds: string[],
    newReferrerCode?: string,
    newCustomerName?: string,
    newCustomerPhone?: string,
    newCustomerEmail?: string,
    newShowDate?: string
  ) => {
    try {
      const payload: any = {
        seatIds,
      };

      if (newReferrerCode !== undefined)
        payload.newReferrerCode = newReferrerCode;
      if (newCustomerName !== undefined)
        payload.newCustomerName = newCustomerName;
      if (newCustomerPhone !== undefined)
        payload.newCustomerPhone = newCustomerPhone;
      if (newCustomerEmail !== undefined)
        payload.newCustomerEmail = newCustomerEmail;
      if (newShowDate !== undefined) payload.newShowDate = newShowDate;

      await patch(`/api/v1/orders/${orderId}/change-seats`, payload);

      showToast("success", `เปลี่ยนที่นั่งออเดอร์ ${orderId} สำเร็จ`);
    } catch (err: any) {
      showToast(
        "error",
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
      const data = await patch(`/api/v1/orders/update-booked/${orderId}`, {
        seatIds: newSeatIds,
        showDate,
      });
      showToast("success", `อัพเดท ${orderId} สำเร็จ`);
      return data;
    } catch (err: any) {
      showToast(
        "error",
        `อัพเดทล้มเหลว: ${err.response?.data?.message || "Unknown error"}`
      );
      throw err;
    }
  };

  const generateTickets = async (orderId: string) => {
    try {
      const data = await get(`/api/v1/orders/${orderId}/tickets`);
      showToast("success", "ออกตั๋วสำเร็จ");
      return data.data;
    } catch (err: any) {
      showToast("error", `ออกตั๋วล้มเหลว: ${err || "Unknown error"}`);
      throw err;
    }
  };

  const downloadThermalReceipt = async (orderId: string) => {
    try {
      const response = await fetch(
        `${base}/api/v1/referrers/${orderId}/thermal-receipt`,
        {
          method: "GET",
          headers: {
            Accept: "application/pdf",
          },
        }
      );
      if (!response.ok) {
        throw new Error("ไม่สามารถดาวน์โหลดใบเสร็จได้");
      }
      const blob = await response.blob();
      return blob;
    } catch (err) {
      console.error("Error in downloadThermalReceipt:", err);
      return undefined;
    }
  };
  const getMasterStaffAdmin = async () => {
    try {
      const data = await get("/api/v1/orders/master/staff-admin");
      return data.data;
    } catch (err: any) {
      showToast(
        "error",
        `ไม่สามารถโหลดข้อมูลผู้แนะนำได้: ${
          err.response?.data?.message || "Unknown error"
        }`
      );
      throw err;
    }
  };

  return {
    getOrders,
    getOrderById,
    submitOrder,
    cancelOrder,
    confirmPayment,
    markAsPaidWithRef,
    changeSeats,
    updateOrderBooked,
    updateStanding,
    generateTickets,
    downloadThermalReceipt,
    getMasterStaffAdmin,
  };
};

/**
 * ดาวน์โหลด Thermal Receipt PDF สำหรับ orderId
 */
