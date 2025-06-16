import { useRuntimeConfig } from "nuxt/app";

export const useApi = () => {
  const config = useRuntimeConfig();
  const base = config.public.apiBase;

  // Generic methods
  const get = async (url: string) => {
    const res = await fetch(`${base}${url}`);

    const contentType = res.headers.get("content-type");
    const isJson = contentType && contentType.includes("application/json");

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText);
    }

    if (isJson) {
      return res.json();
    } else {
      const raw = await res.text();
      console.warn("⚠️ Response is not JSON:", raw);
      throw new Error("Invalid JSON format");
    }
  };

  const post = async (url: string, payload: any) => {
    const res = await fetch(`${base}${url}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Unknown error");
    }

    return result;
  };
  const patch = async (url: string, data: any) => {
    const res = await fetch(`${base}${url}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  };

  const upload = async (url: string, formData: FormData) => {
    const res = await fetch(`${base}${url}`, {
      method: "POST",
      body: formData,
    });
    return res.json();
  };

  // ✅ Custom methods
  const createOrder = (formData: FormData) => upload("/orders", formData);

  const updateOrderStatus = (id: number, status: string) =>
    patch(`/orders/${id}/status`, { status });

  const getAllOrders = () => get("/orders/list");

  const getQRCode = () => get("/orders/qrcode");

  return {
    get,
    post,
    patch,
    upload,
    createOrder,
    updateOrderStatus,
    getAllOrders,
    getQRCode,
  };
};
