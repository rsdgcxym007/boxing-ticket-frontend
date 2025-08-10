import { useRuntimeConfig } from "nuxt/app";

export const useApi = () => {
  const config = useRuntimeConfig();
  const base = config.public.apiBase;

  const getToken = () => {
    if (process.client) {
      return localStorage.getItem("token") || "";
    }
    return "";
  };

  const handleResponse = async (res: Response) => {
    let result;
    try {
      result = await res.json();
    } catch (e) {
      throw new Error("API ส่งข้อมูลผิดรูปแบบ");
    }

    // 🧠 รองรับ string, array, object ทุกชนิด
    function extractMessage(obj: any): string {
      if (!obj) return "";

      if (typeof obj === "string") {
        // ข้ามข้อความที่ดูเหมือน status code เช่น "400"
        if (obj === result.statusCode?.toString()) return "";
        return obj;
      }

      if (Array.isArray(obj)) {
        return obj.map(extractMessage).filter(Boolean).join("\n");
      }

      if (typeof obj === "object") {
        if (obj.message) return extractMessage(obj.message);
        if (obj.error) return extractMessage(obj.error);
        return Object.values(obj)
          .map(extractMessage)
          .filter(Boolean)
          .join("\n");
      }

      return String(obj);
    }

    // ⚠️ ตรวจจับ error case
    if (!res.ok || result.success === false || result.statusCode >= 400) {
      // ✅ ลำดับความสำคัญ: message > error > fallback
      let errorMsg = extractMessage(result.message);

      if (!errorMsg || errorMsg.trim() === "") {
        errorMsg = extractMessage(result.error) || "Unknown error";
      }

      // 🔁 รวม errors array ถ้ามี
      if (Array.isArray(result.errors) && result.errors.length > 0) {
        errorMsg +=
          "\n" + result.errors.map((e: any) => extractMessage(e)).join("\n");
      }

      // 🔖 เพิ่ม path และเวลา
      if (result.path) {
        errorMsg += `\n[API Path: ${result.path}]`;
      }
      if (result.timestamp) {
        errorMsg += `\n[Time: ${result.timestamp}]`;
      }
      throw new Error(errorMsg);
    }

    // Success toast (optional, only if you want to show on every success)
    // toast.success(result.message || "สำเร็จ");
    return result;
  };

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

  const put = async (url: string, payload: any) => {
    const res = await fetch(`${base}${url}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  };

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

  const remove = async (url: string) => {
    const res = await fetch(`${base}${url}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return handleResponse(res);
  };

  return {
    // generic
    get,
    post,
    put,
    patch,
    upload,
    remove,
  };
};
