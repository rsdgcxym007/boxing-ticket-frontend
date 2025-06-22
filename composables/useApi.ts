import { useRuntimeConfig } from "nuxt/app";

export const useApi = () => {
  const config = useRuntimeConfig();
  const base = config.public.apiBase;

  // ดึง token จาก localStorage
  const getToken = () => {
    if (process.client) {
      return localStorage.getItem("token") || "";
    }
    return "";
  };

  // ตรวจสอบและจัดการ Response ทุกรูปแบบ
  const handleResponse = async (res: Response) => {
    const result = await res.json();

    if (!res.ok || result.statusCode >= 400) {
      throw new Error(result.message || "Unknown error");
    }

    return result.data?.data ?? result.data;
  };

  // GET
  const get = async (
    url: string,
    options?: { query?: Record<string, any> }
  ) => {
    const queryString = options?.query
      ? "?" + new URLSearchParams(options.query).toString()
      : "";

    const res = await fetch(`${base}${url}${queryString}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    return handleResponse(res);
  };

  // POST (JSON)
  const post = async (url: string, payload: any) => {
    const res = await fetch(`${base}${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  };

  // PATCH (JSON)
  const patch = async (url: string, payload: any) => {
    const res = await fetch(`${base}${url}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  };

  // UPLOAD (FormData)
  const upload = async (url: string, formData: FormData) => {
    const res = await fetch(`${base}${url}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
      body: formData,
    });
    return handleResponse(res);
  };

  // DELETE (กรณีต้องใช้)
  const remove = async (url: string) => {
    const res = await fetch(`${base}${url}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return handleResponse(res);
  };

  const createOrder = (payload: any) => post("/orders", payload);
  const cancelOrder = (orderId: string) =>
    patch(`/orders/cancel/${orderId}`, {});
  const getOrderById = (orderId: string) => get(`/orders/${orderId}`);
  const getAllOrders = () => get("/orders/list"); // optional

  // PAYMENT
  const payWithCash = (payload: { orderId: string; amount: number }) =>
    post("/payments/cash", payload);

  const generateQRCode = (payload: { orderId: string; amount: number }) =>
    post("/payments/qr", payload);

  const checkPaymentStatus = (paymentId: string) =>
    get(`/payments/status/${paymentId}`);

  // SEAT
  const getSeatsByZone = (zoneId: string) => get(`/seats/by-zone/${zoneId}`);
  const updateSeatStatus = (seatId: string, status: string) =>
    patch(`/seats/${seatId}`, { status });

  // REFERRER
  const getAllReferrers = () => get("/referrers");
  const getReferrerById = (id: string) => get(`/referrers/${id}`);

  return {
    // generic
    get,
    post,
    patch,
    upload,
    remove,

    // custom
    createOrder,
    cancelOrder,
    getOrderById,
    getAllOrders,
    payWithCash,
    generateQRCode,
    checkPaymentStatus,
    getSeatsByZone,
    updateSeatStatus,
    getAllReferrers,
    getReferrerById,
  };
};
