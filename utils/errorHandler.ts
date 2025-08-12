import type { ApiError, ApiResponse } from "~/types/api";

/**
 * Enhanced API error handling utilities
 */
export class ApiErrorHandler {
  /**
   * Extract meaningful error message from various error response formats
   */
  static extractMessage(error: any): string {
    // Handle string errors
    if (typeof error === "string") {
      return error;
    }

    // Handle array of errors
    if (Array.isArray(error)) {
      return error.map((e) => this.extractMessage(e)).join(", ");
    }

    // Handle object errors
    if (error && typeof error === "object") {
      // Check common error properties
      if (error.message) return this.extractMessage(error.message);
      if (error.error) return this.extractMessage(error.error);
      if (error.details) return this.extractMessage(error.details);

      // Handle validation errors
      if (error.errors && Array.isArray(error.errors)) {
        return error.errors.map((e: any) => this.extractMessage(e)).join(", ");
      }

      // Handle nested error objects
      if (error.response?.data?.message) {
        return this.extractMessage(error.response.data.message);
      }

      return "Unknown error occurred";
    }

    return "Unknown error occurred";
  }

  /**
   * Create standardized API error object
   */
  static createApiError(
    message: string,
    status?: number,
    code?: string,
    details?: any
  ): ApiError {
    return {
      message,
      status,
      code,
      details,
    };
  }

  /**
   * Handle different types of API errors
   */
  static handleApiError(error: any): ApiError {
    // Network errors
    if (error.name === "NetworkError" || error.code === "NETWORK_ERROR") {
      return this.createApiError(
        "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต",
        0,
        "NETWORK_ERROR"
      );
    }

    // Timeout errors
    if (error.name === "TimeoutError" || error.code === "TIMEOUT") {
      return this.createApiError(
        "การเชื่อมต่อหมดเวลา กรุณาลองใหม่อีกครั้ง",
        408,
        "TIMEOUT"
      );
    }

    // HTTP errors
    if (error.status) {
      switch (error.status) {
        case 400:
          return this.createApiError(
            "ข้อมูลที่ส่งไม่ถูกต้อง กรุณาตรวจสอบและลองใหม่",
            400,
            "BAD_REQUEST"
          );
        case 401:
          return this.createApiError(
            "กรุณาเข้าสู่ระบบเพื่อดำเนินการต่อ",
            401,
            "UNAUTHORIZED"
          );
        case 403:
          return this.createApiError(
            "คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้",
            403,
            "FORBIDDEN"
          );
        case 404:
          return this.createApiError("ไม่พบข้อมูลที่ต้องการ", 404, "NOT_FOUND");
        case 429:
          return this.createApiError(
            "มีการใช้งานมากเกินไป กรุณารอสักครู่แล้วลองใหม่",
            429,
            "TOO_MANY_REQUESTS"
          );
        case 500:
          return this.createApiError(
            "เกิดข้อผิดพลาดในระบบ กรุณาติดต่อผู้ดูแลระบบ",
            500,
            "INTERNAL_SERVER_ERROR"
          );
        case 502:
        case 503:
        case 504:
          return this.createApiError(
            "เซิร์ฟเวอร์ไม่สามารถให้บริการได้ในขณะนี้ กรุณาลองใหม่ภายหลัง",
            error.status,
            "SERVICE_UNAVAILABLE"
          );
        default:
          return this.createApiError(
            this.extractMessage(error.message) ||
              `เกิดข้อผิดพลาด (${error.status})`,
            error.status,
            "HTTP_ERROR"
          );
      }
    }

    // Generic error
    return this.createApiError(
      this.extractMessage(error),
      undefined,
      "UNKNOWN_ERROR",
      error
    );
  }

  /**
   * Get user-friendly error message for display
   */
  static getDisplayMessage(error: ApiError): string {
    const baseMessage = error.message;

    // Add retry suggestion for certain errors
    if (error.code === "NETWORK_ERROR" || error.code === "TIMEOUT") {
      return `${baseMessage}\n\nเคล็ดลับ: ลองรีเฟรชหน้าเว็บหรือตรวจสอบสัญญาณอินเทอร์เน็ต`;
    }

    if (error.code === "SERVICE_UNAVAILABLE") {
      return `${baseMessage}\n\nระบบกำลังปรับปรุง กรุณาลองใหม่ในอีกสักครู่`;
    }

    return baseMessage;
  }

  /**
   * Determine if error should trigger a retry
   */
  static shouldRetry(error: ApiError): boolean {
    const retryableCodes = ["NETWORK_ERROR", "TIMEOUT", "SERVICE_UNAVAILABLE"];

    const retryableStatuses = [408, 429, 502, 503, 504];

    return (
      retryableCodes.includes(error.code!) ||
      (error.status && retryableStatuses.includes(error.status))
    );
  }

  /**
   * Get retry delay based on error type and attempt count
   */
  static getRetryDelay(error: ApiError, attempt: number): number {
    // Exponential backoff with jitter
    const baseDelay = 1000; // 1 second
    const maxDelay = 30000; // 30 seconds

    let delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);

    // Add jitter (±25%)
    const jitter = delay * 0.25 * (Math.random() - 0.5);
    delay += jitter;

    // Special cases
    if (error.status === 429) {
      // Rate limiting - longer delay
      delay = Math.max(delay, 5000);
    }

    return Math.floor(delay);
  }
}

/**
 * Retry utility with exponential backoff
 */
export async function withRetry<T>(
  apiCall: () => Promise<T>,
  maxAttempts: number = 3,
  onRetry?: (attempt: number, error: ApiError) => void
): Promise<T> {
  let lastError: ApiError;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await apiCall();
    } catch (error: any) {
      lastError = ApiErrorHandler.handleApiError(error);

      // Don't retry on the last attempt or non-retryable errors
      if (
        attempt === maxAttempts - 1 ||
        !ApiErrorHandler.shouldRetry(lastError)
      ) {
        throw lastError;
      }

      // Calculate delay and notify callback
      const delay = ApiErrorHandler.getRetryDelay(lastError, attempt);
      onRetry?.(attempt + 1, lastError);

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
}

/**
 * Validate API response format
 */
export function validateApiResponse<T>(response: any): ApiResponse<T> {
  if (!response || typeof response !== "object") {
    throw new Error("Invalid API response format");
  }

  // Ensure required fields exist
  if (response.success === undefined) {
    response.success = response.data !== undefined;
  }

  if (!response.success && !response.error && !response.message) {
    response.message = "Unknown error occurred";
  }

  return response as ApiResponse<T>;
}

/**
 * Log error for debugging (development only)
 */
export function logError(error: ApiError, context?: string): void {
  if (process.env.NODE_ENV === "development") {
    console.group(`🚫 API Error${context ? ` (${context})` : ""}`);
    console.error("Message:", error.message);
    console.error("Status:", error.status);
    console.error("Code:", error.code);
    if (error.details) {
      console.error("Details:", error.details);
    }
    console.groupEnd();
  }
}

/**
 * Format error for user notification
 */
export function formatErrorForNotification(error: ApiError): {
  title: string;
  message: string;
  type: "error" | "warning" | "info";
} {
  let type: "error" | "warning" | "info" = "error";

  // Determine notification type
  if (error.code === "NETWORK_ERROR" || error.code === "TIMEOUT") {
    type = "warning";
  } else if (error.status === 401 || error.status === 403) {
    type = "info";
  }

  return {
    title: getErrorTitle(error),
    message: ApiErrorHandler.getDisplayMessage(error),
    type,
  };
}

/**
 * Get appropriate error title
 */
function getErrorTitle(error: ApiError): string {
  if (error.code === "NETWORK_ERROR") return "ปัญหาการเชื่อมต่อ";
  if (error.code === "TIMEOUT") return "หมดเวลาการเชื่อมต่อ";
  if (error.status === 401) return "กรุณาเข้าสู่ระบบ";
  if (error.status === 403) return "ไม่มีสิทธิ์เข้าถึง";
  if (error.status === 404) return "ไม่พบข้อมูล";
  if (error.status === 429) return "ใช้งานมากเกินไป";
  if (error.status && error.status >= 500) return "ข้อผิดพลาดระบบ";

  return "เกิดข้อผิดพลาด";
}
