import { useRuntimeConfig } from "nuxt/app";
import { useApi } from "../composables/useApi";
import { useSingleToast } from "./useSingleToast";

export const useExport = () => {
  const { get, post, patch, put } = useApi();
  const { showToast } = useSingleToast();
  const config = useRuntimeConfig();
  const base = config.public.apiBase;

  const postExportSpreadsheet = async (payload: {
    orders: string[];
    format: string;
  }) => {
    const token = localStorage.getItem("token") || "";
    fetch(`${base}/api/v1/orders/export-spreadsheet`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },

      body: JSON.stringify({
        orderIds: { ...payload.orders },
        format: payload.format,
        // includePayments: true,
      }),
    })
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "orders_export.csv";
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        showToast("success", "export spreadsheet สำเร็จ");
      })
      .catch((err) => {
        showToast("error", "Export error: " + err.message);
      });
  };
  return { postExportSpreadsheet };
};
