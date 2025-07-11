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
    const result = await res.json();

    if (!res.ok || result.statusCode >= 400) {
      throw new Error(result.message || "Unknown error");
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
