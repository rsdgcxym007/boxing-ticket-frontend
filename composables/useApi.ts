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
      // fallback กรณี response ไม่ใช่ json
      throw new Error("API ส่งข้อมูลผิดรูปแบบ");
    }

    // กรณี error response แบบใหม่
    if (!res.ok || result.success === false || result.statusCode >= 400) {
      // รวม message, errors, path, timestamp
      let errorMsg = result.message || result.error || "Unknown error";
      if (Array.isArray(result.errors) && result.errors.length > 0) {
        errorMsg +=
          "\n" + result.errors.map((e: any) => e.message || e).join("\n");
      }
      if (result.path) {
        errorMsg += `\n[API Path: ${result.path}]`;
      }
      if (result.timestamp) {
        errorMsg += `\n[Time: ${result.timestamp}]`;
      }
      throw new Error(errorMsg);
    }
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
