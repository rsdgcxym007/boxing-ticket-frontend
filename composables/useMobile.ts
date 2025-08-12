import { useApi } from "./useApi";
import { useSingleToast } from "./useSingleToast";

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: "maintenance" | "promotion" | "info" | "warning";
  priority: "low" | "medium" | "high";
  isActive: boolean;
  createdAt: string;
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  discountPercent: number;
  validUntil: string;
  imageUrl?: string;
  terms?: string[];
  isActive: boolean;
}

export interface UpcomingEvent {
  id: string;
  title: string;
  eventDate: string;
  venue: string;
  ticketPrice: number;
  availableSeats: number;
  description?: string;
  imageUrl?: string;
  category: string;
}

export interface QuickStats {
  totalEvents: number;
  totalSeats: number;
  availableSeats: number;
  popularZones: string[];
  todaySales: number;
  activeUsers: number;
}

export interface MobileHomeData {
  announcements: Announcement[];
  promotions: Promotion[];
  upcomingEvents: UpcomingEvent[];
  quickStats: QuickStats;
  banners?: Array<{
    id: string;
    imageUrl: string;
    title: string;
    link?: string;
  }>;
}

export interface QRScanResult {
  type: "ticket" | "seat" | "promotion" | "unknown";
  data: any;
  valid: boolean;
  message: string;
}

export interface DeviceSettings {
  userId: string;
  pushNotifications: boolean;
  language: "th" | "en";
  theme: "light" | "dark" | "auto";
  autoSync: boolean;
  offlineMode: boolean;
  notifications: {
    bookingReminders: boolean;
    promotions: boolean;
    systemUpdates: boolean;
  };
}

export interface OfflineData {
  lastSync: string;
  cachedEvents: UpcomingEvent[];
  userBookings: any[];
  favoriteSeats: string[];
  recentSearches: string[];
}

export const useMobile = () => {
  const { get, post, put } = useApi();
  const { showToast } = useSingleToast();

  /**
   * Home Screen Data
   */
  const getHomeScreenData = async (): Promise<MobileHomeData> => {
    try {
      const response = await get("/mobile/home");
      return response.data;
    } catch (error: any) {
      showToast("error", `ไม่สามารถโหลดข้อมูลหน้าหลักได้: ${error.message}`);
      throw error;
    }
  };

  /**
   * QR Code Scanner
   */
  const scanQRCode = async (qrCodeData: string): Promise<QRScanResult> => {
    try {
      const response = await post("/mobile/scanner/qr", {
        qrCodeData,
      });
      return response.data;
    } catch (error: any) {
      showToast("error", `ไม่สามารถสแกน QR Code ได้: ${error.message}`);
      throw error;
    }
  };

  const validateTicketQR = async (ticketId: string, qrData: string) => {
    try {
      const response = await post("/mobile/scanner/validate-ticket", {
        ticketId,
        qrData,
      });
      return response.data;
    } catch (error: any) {
      showToast("error", `ไม่สามารถตรวจสอบตั้วได้: ${error.message}`);
      throw error;
    }
  };

  /**
   * Device Settings
   */
  const getDeviceSettings = async (userId: string): Promise<DeviceSettings> => {
    try {
      const response = await get(`/mobile/settings/${userId}`);
      return response.data;
    } catch (error: any) {
      showToast("error", `ไม่สามารถโหลดการตั้งค่าอุปกรณ์ได้: ${error.message}`);
      throw error;
    }
  };

  const updateDeviceSettings = async (
    userId: string,
    settings: Partial<DeviceSettings>
  ) => {
    try {
      const response = await put(`/mobile/settings/${userId}`, settings);
      showToast("success", "บันทึกการตั้งค่าเรียบร้อยแล้ว");
      return response.data;
    } catch (error: any) {
      showToast("error", `ไม่สามารถบันทึกการตั้งค่าได้: ${error.message}`);
      throw error;
    }
  };

  /**
   * Offline Support
   */
  const getOfflineData = async (userId: string): Promise<OfflineData> => {
    try {
      const response = await get(`/mobile/offline-data/${userId}`);
      return response.data;
    } catch (error: any) {
      showToast("error", `ไม่สามารถโหลดข้อมูลออฟไลน์ได้: ${error.message}`);
      throw error;
    }
  };

  const syncOfflineData = async (userId: string, localData: any) => {
    try {
      const response = await post(`/mobile/sync/${userId}`, localData);
      showToast("success", "ซิงค์ข้อมูลเรียบร้อยแล้ว");
      return response.data;
    } catch (error: any) {
      showToast("error", `ไม่สามารถซิงค์ข้อมูลได้: ${error.message}`);
      throw error;
    }
  };

  /**
   * Push Notifications Registration
   */
  const registerForPushNotifications = async (
    userId: string,
    deviceToken: string,
    platform: "ios" | "android" | "web"
  ) => {
    try {
      const response = await post("/mobile/notifications/register", {
        userId,
        deviceToken,
        platform,
      });
      showToast("success", "ลงทะเบียนการแจ้งเตือนเรียบร้อยแล้ว");
      return response.data;
    } catch (error: any) {
      showToast("error", `ไม่สามารถลงทะเบียนการแจ้งเตือนได้: ${error.message}`);
      throw error;
    }
  };

  const unregisterPushNotifications = async (
    userId: string,
    deviceToken: string
  ) => {
    try {
      const response = await post("/mobile/notifications/unregister", {
        userId,
        deviceToken,
      });
      showToast("success", "ยกเลิกการแจ้งเตือนเรียบร้อยแล้ว");
      return response.data;
    } catch (error: any) {
      showToast("error", `ไม่สามารถยกเลิกการแจ้งเตือนได้: ${error.message}`);
      throw error;
    }
  };

  /**
   * Mobile-specific utilities
   */
  const getAppVersion = async () => {
    try {
      const response = await get("/mobile/app-version");
      return response.data;
    } catch (error: any) {
      console.error("Failed to get app version:", error);
      return { version: "1.0.0", updateAvailable: false };
    }
  };

  const reportBug = async (bugReport: {
    userId: string;
    description: string;
    steps: string[];
    deviceInfo: any;
    screenshot?: string;
  }) => {
    try {
      const response = await post("/mobile/bug-report", bugReport);
      showToast("success", "รายงานปัญหาเรียบร้อยแล้ว ขอบคุณสำหรับการแจ้ง");
      return response.data;
    } catch (error: any) {
      showToast("error", `ไม่สามารถส่งรายงานปัญหาได้: ${error.message}`);
      throw error;
    }
  };

  return {
    // Core Mobile Features
    getHomeScreenData,
    scanQRCode,
    validateTicketQR,

    // Settings Management
    getDeviceSettings,
    updateDeviceSettings,

    // Offline Support
    getOfflineData,
    syncOfflineData,

    // Push Notifications
    registerForPushNotifications,
    unregisterPushNotifications,

    // Utilities
    getAppVersion,
    reportBug,
  };
};
