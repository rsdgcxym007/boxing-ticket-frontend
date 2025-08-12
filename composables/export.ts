import { ref, computed, readonly } from "vue";
import { useRuntimeConfig } from "nuxt/app";
import { useSingleToast } from "./useSingleToast";
import { useWebSocket } from "./useWebSocket";

interface ExportOptions {
  format: "csv" | "excel";
  type: "all" | "selected" | "filtered";
  includePaymentDetails?: boolean;
  includeSeatDetails?: boolean;
  includeCustomerInfo?: boolean;
  orderIds?: string[];
  filters?: {
    status?: any;
    search?: string;
    zone?: string;
    createdBy?: string;
    showDate?: string;
    paymentMethod?: string;
    purchaseType?: string;
    attendanceStatus?: string;
    referrerName?: string;
  };
}

interface ImportOptions {
  file: File;
  format: "csv" | "excel";
  validateData?: boolean;
  preventDuplicates?: boolean;
  updateExisting?: boolean;
}

interface ImportResult {
  success: boolean;
  imported: number;
  updated: number;
  errors: string[];
  duplicates: number;
  message: string;
}

export const useExport = () => {
  const { showToast } = useSingleToast();
  const {
    onExportProgress,
    onExportCompleted,
    onExportFailed,
    joinExportRoom,
    leaveExportRoom,
  } = useWebSocket();
  const config = useRuntimeConfig();
  const base = config.public.apiBase;

  // State
  const isExporting = ref(false);
  const exportProgress = ref(0);
  const exportError = ref("");
  const exportSuccess = ref(false);
  const currentExportId = ref<string | null>(null);

  // Import state
  const isImporting = ref(false);
  const importProgress = ref(0);
  const importError = ref("");
  const importSuccess = ref(false);
  const importResult = ref<ImportResult | null>(null);

  // Computed
  const exportStatusText = computed(() => {
    if (exportProgress.value < 25) return "เตรียมข้อมูล...";
    if (exportProgress.value < 50) return "กำลังประมวลผล...";
    if (exportProgress.value < 75) return "สร้างไฟล์...";
    if (exportProgress.value < 100) return "เกือบเสร็จแล้ว...";
    return "เสร็จสิ้น";
  });

  const importStatusText = computed(() => {
    if (importProgress.value < 25) return "กำลังอ่านไฟล์...";
    if (importProgress.value < 50) return "ตรวจสอบข้อมูล...";
    if (importProgress.value < 75) return "บันทึกข้อมูล...";
    if (importProgress.value < 100) return "เกือบเสร็จแล้ว...";
    return "เสร็จสิ้น";
  });

  // Reset state
  const resetExportState = () => {
    isExporting.value = false;
    exportProgress.value = 0;
    exportError.value = "";
    exportSuccess.value = false;
    if (currentExportId.value) {
      leaveExportRoom(currentExportId.value);
      currentExportId.value = null;
    }
  };

  // Reset import state
  const resetImportState = () => {
    isImporting.value = false;
    importProgress.value = 0;
    importError.value = "";
    importSuccess.value = false;
    importResult.value = null;
  };

  // Enhanced export with progress tracking
  const exportWithProgress = async (
    orderIds: string[],
    format: "csv" | "excel" = "csv",
    options: Partial<ExportOptions> = {}
  ) => {
    try {
      resetExportState();
      isExporting.value = true;
      exportError.value = "";

      // Generate export ID for tracking
      const exportId = `export_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      currentExportId.value = exportId;

      // Join export room for progress updates
      joinExportRoom(exportId);

      // Setup progress listeners
      const progressCleanup = onExportProgress((event: any) => {
        if (event.exportId === exportId) {
          exportProgress.value = event.progress || 0;
        }
      });

      const completedCleanup = onExportCompleted((event: any) => {
        if (event.exportId === exportId) {
          exportProgress.value = 100;
          exportSuccess.value = true;
          if (event.downloadUrl) {
            downloadFile(
              event.downloadUrl,
              event.filename || `orders-export-${format}`
            );
          }
          setTimeout(resetExportState, 2000);
        }
      });

      const failedCleanup = onExportFailed((event: any) => {
        if (event.exportId === exportId) {
          exportError.value = event.error || "การส่งออกล้มเหลว";
          isExporting.value = false;
        }
      });

      // Prepare request payload
      const payload = {
        orderIds: orderIds.length > 0 ? orderIds : [],
        format,
        exportId,
        filters: options.filters || {},
        options: {
          includePaymentDetails: options.includePaymentDetails ?? true,
          includeSeatDetails: options.includeSeatDetails ?? true,
          includeCustomerInfo: options.includeCustomerInfo ?? true,
          ...options,
        },
      };

      // Send export request using fetch
      const token = localStorage.getItem("token") || "";
      console.log("Sending export request:", { payload, base });

      const response = await fetch(`${base}/api/v1/orders/export-spreadsheet`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      console.log(
        "Export response:",
        response.status,
        response.headers.get("content-type")
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Check if response is JSON or file
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        // WebSocket-enabled response
        const responseData = await response.json();

        if (!responseData || responseData.success === false) {
          throw new Error(responseData?.message || "การส่งออกล้มเหลว");
        }

        return responseData;
      } else {
        // Direct file download
        const blob = await response.blob();

        if (blob.size === 0) {
          throw new Error("ไฟล์ที่ส่งออกว่างเปล่า");
        }

        // Get filename from Content-Disposition header
        const disposition = response.headers.get("content-disposition");
        let filename = `orders_export.${format === "excel" ? "xlsx" : "csv"}`;
        if (disposition) {
          const filenameMatch = disposition.match(/filename="(.+)"/);
          if (filenameMatch) {
            filename = filenameMatch[1];
          }
        }

        // Download file directly
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        // Update progress and success state
        exportProgress.value = 100;
        exportSuccess.value = true;
        showToast("success", "ส่งออกข้อมูลสำเร็จ");

        // Reset state after delay
        setTimeout(resetExportState, 2000);

        return { success: true, message: "Export completed successfully" };
      }

      // Cleanup listeners after completion
      setTimeout(() => {
        progressCleanup?.();
        completedCleanup?.();
        failedCleanup?.();
      }, 5000);

      return { success: true, message: "Export completed successfully" };
    } catch (error: any) {
      console.error("Export error:", error);
      exportError.value = error.message || "เกิดข้อผิดพลาดในการส่งออก";
      isExporting.value = false;
      showToast("error", exportError.value);
      throw error;
    }
  };

  // Quick export for all orders
  const exportAllOrders = async (format: "csv" | "excel" = "csv") => {
    return exportWithProgress([], format);
  };

  // Quick export for selected orders
  const exportOrders = async (
    orderIds: string[],
    format: "csv" | "excel" = "csv"
  ) => {
    if (!orderIds || orderIds.length === 0) {
      showToast("warning", "กرุณาเลือกออเดอร์ที่ต้องการส่งออก");
      return;
    }
    return exportWithProgress(orderIds, format);
  };

  // Advanced export with full options
  const exportOrdersAdvanced = async (options: ExportOptions) => {
    try {
      const orderIds =
        options.type === "selected" ? options.orderIds || [] : [];
      return await exportWithProgress(orderIds, options.format, options);
    } catch (error) {
      console.error("Advanced export failed:", error);
      throw error;
    }
  };

  // Import orders from file
  const importOrdersFromFile = async (
    options: ImportOptions
  ): Promise<ImportResult> => {
    try {
      console.log("Import function called with options:", options);
      resetImportState();
      isImporting.value = true;
      importError.value = "";

      // Validate file
      if (!options.file) {
        throw new Error("กรุณาเลือกไฟล์ที่ต้องการ import");
      }

      console.log("File validation:", {
        name: options.file.name,
        size: options.file.size,
        type: options.file.type,
      });

      const allowedTypes = [
        "text/csv",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ];

      if (!allowedTypes.includes(options.file.type)) {
        throw new Error("รองรับเฉพาะไฟล์ .csv, .xls, .xlsx เท่านั้น");
      }

      // Check file size (50MB limit)
      const maxSize = 50 * 1024 * 1024; // 50MB
      if (options.file.size > maxSize) {
        throw new Error("ขนาดไฟล์เกิน 50MB");
      }

      // Simulate progress
      importProgress.value = 10;

      // Create FormData
      const formData = new FormData();
      formData.append("file", options.file);
      formData.append("format", options.format);
      formData.append("validateData", String(options.validateData ?? true));
      formData.append(
        "preventDuplicates",
        String(options.preventDuplicates ?? true)
      );
      formData.append(
        "updateExisting",
        String(options.updateExisting ?? false)
      );

      importProgress.value = 25;

      // Send import request
      const token = localStorage.getItem("token") || "";
      const response = await fetch(`${base}/api/v1/orders/import-file`, {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      importProgress.value = 50;

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const result = await response.json();
      importProgress.value = 75;

      // Validate response
      if (!result || result.success === false) {
        throw new Error(result?.message || "การ import ล้มเหลว");
      }
      console.log("result", result);

      importProgress.value = 100;
      importSuccess.value = true;
      importResult.value = result.data;

      // Show success message
      const message =
        `Import สำเร็จ: นำเข้า ${result.imported || 0} รายการ` +
        (result.updated ? `, อัปเดต ${result.updated} รายการ` : "") +
        (result.duplicates ? `, ข้าม ${result.duplicates} รายการซ้ำ` : "");

      showToast("success", message);

      // Reset state after delay
      setTimeout(resetImportState, 3000);

      return result;
    } catch (error: any) {
      console.error("Import error:", error);
      importError.value = error.message || "เกิดข้อผิดพลาดในการ import";
      isImporting.value = false;
      showToast("error", importError.value);
      throw error;
    }
  };

  // Legacy method (backward compatibility)
  const postExportSpreadsheet = async (payload: {
    orders: string[];
    format: string;
    filters?: any;
  }) => {
    const token = localStorage.getItem("token") || "";

    try {
      const requestPayload = {
        orderIds: Array.isArray(payload.orders)
          ? payload.orders
          : [payload.orders].flat(),
        format: payload.format,
        filters: payload.filters || {},
      };

      const response = await fetch(`${base}/api/v1/orders/export-spreadsheet`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(requestPayload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();

      if (blob.size === 0) {
        throw new Error("ไฟล์ที่ส่งออกว่างเปล่า");
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `orders_export.${
        payload.format === "excel" ? "xlsx" : "csv"
      }`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      showToast("success", "ส่งออกข้อมูลสำเร็จ");
    } catch (err: any) {
      console.error("Export error:", err);
      showToast("error", "การส่งออกล้มเหลว: " + err.message);
      throw err;
    }
  };

  // Helper function to download file
  const downloadFile = (url: string, filename: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("success", "ดาวน์โหลดไฟล์สำเร็จ");
  };

  return {
    // Export State
    isExporting: readonly(isExporting),
    exportProgress: readonly(exportProgress),
    exportError: readonly(exportError),
    exportSuccess: readonly(exportSuccess),
    exportStatusText,

    // Import State
    isImporting: readonly(isImporting),
    importProgress: readonly(importProgress),
    importError: readonly(importError),
    importSuccess: readonly(importSuccess),
    importResult: readonly(importResult),
    importStatusText,

    // Export Methods
    exportWithProgress,
    exportAllOrders,
    exportOrders,
    exportOrdersAdvanced,
    resetExportState,

    // Import Methods
    importOrdersFromFile,
    resetImportState,

    // Legacy method
    postExportSpreadsheet,
  };
};
