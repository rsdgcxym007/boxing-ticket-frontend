import { ref, computed, readonly } from "vue";
import { useApi } from "./useApi";
import { useSingleToast } from "./useSingleToast";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type:
    | "booking_success"
    | "payment_required"
    | "promotion"
    | "system"
    | "reminder"
    | "warning";
  isRead: boolean;
  createdAt: string;
  data?: Record<string, any>;
  actionUrl?: string;
  priority: "low" | "medium" | "high";
  expiresAt?: string;
}

export interface NotificationStats {
  total: number;
  unread: number;
  byType: Record<string, number>;
  recent: number;
}

export interface NotificationPreferences {
  userId: string;
  email: boolean;
  push: boolean;
  sms: boolean;
  types: {
    bookingUpdates: boolean;
    promotions: boolean;
    systemAlerts: boolean;
    reminders: boolean;
    security: boolean;
  };
  quietHours: {
    enabled: boolean;
    start: string; // HH:mm format
    end: string; // HH:mm format
  };
}

export const useNotifications = () => {
  const { get, post, patch } = useApi();
  const { showToast } = useSingleToast();

  // Reactive state
  const notifications = ref<Notification[]>([]);
  const unreadCount = ref(0);
  const loading = ref(false);

  /**
   * Fetch user notifications
   */
  const fetchNotifications = async (
    limit: number = 50,
    offset: number = 0
  ): Promise<Notification[]> => {
    try {
      loading.value = true;
      const response = await get("/notifications", {
        query: { limit, offset },
      });

      if (offset === 0) {
        notifications.value = response.data;
      } else {
        notifications.value.push(...response.data);
      }

      return response.data;
    } catch (error: any) {
      showToast("error", `ไม่สามารถโหลดการแจ้งเตือนได้: ${error.message}`);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Get unread count
   */
  const getUnreadCount = async (): Promise<number> => {
    try {
      const response = await get("/notifications/unread-count");
      unreadCount.value = response.data.count;
      return response.data.count;
    } catch (error: any) {
      console.error("Failed to get unread count:", error);
      return 0;
    }
  };

  /**
   * Mark notification as read
   */
  const markAsRead = async (id: string): Promise<void> => {
    try {
      await patch(`/notifications/${id}/read`, {});

      // Update local state
      const notification = notifications.value.find((n) => n.id === id);
      if (notification && !notification.isRead) {
        notification.isRead = true;
        unreadCount.value = Math.max(0, unreadCount.value - 1);
      }
    } catch (error: any) {
      showToast(
        "error",
        `ไม่สามารถอัปเดตสถานะการแจ้งเตือนได้: ${error.message}`
      );
      throw error;
    }
  };

  /**
   * Mark all notifications as read
   */
  const markAllAsRead = async (): Promise<void> => {
    try {
      await patch("/notifications/mark-all-read", {});

      // Update local state
      notifications.value.forEach((n) => {
        n.isRead = true;
      });
      unreadCount.value = 0;

      showToast("success", "อ่านการแจ้งเตือนทั้งหมดแล้ว");
    } catch (error: any) {
      showToast(
        "error",
        `ไม่สามารถอัปเดตสถานะการแจ้งเตือนได้: ${error.message}`
      );
      throw error;
    }
  };

  /**
   * Delete notification
   */
  const deleteNotification = async (id: string): Promise<void> => {
    try {
      await patch(`/notifications/${id}`, { deleted: true });

      // Remove from local state
      const index = notifications.value.findIndex((n) => n.id === id);
      if (index > -1) {
        const notification = notifications.value[index];
        if (!notification.isRead) {
          unreadCount.value = Math.max(0, unreadCount.value - 1);
        }
        notifications.value.splice(index, 1);
      }

      showToast("success", "ลบการแจ้งเตือนแล้ว");
    } catch (error: any) {
      showToast("error", `ไม่สามารถลบการแจ้งเตือนได้: ${error.message}`);
      throw error;
    }
  };

  /**
   * Get notification statistics
   */
  const getNotificationStats = async (): Promise<NotificationStats> => {
    try {
      const response = await get("/notifications/stats");
      return response.data;
    } catch (error: any) {
      showToast("error", `ไม่สามารถโหลดสถิติการแจ้งเตือนได้: ${error.message}`);
      throw error;
    }
  };

  /**
   * Get notification preferences
   */
  const getNotificationPreferences = async (
    userId: string
  ): Promise<NotificationPreferences> => {
    try {
      const response = await get(`/notifications/preferences/${userId}`);
      return response.data;
    } catch (error: any) {
      showToast(
        "error",
        `ไม่สามารถโหลดการตั้งค่าการแจ้งเตือนได้: ${error.message}`
      );
      throw error;
    }
  };

  /**
   * Update notification preferences
   */
  const updateNotificationPreferences = async (
    userId: string,
    preferences: Partial<NotificationPreferences>
  ): Promise<void> => {
    try {
      await patch(`/notifications/preferences/${userId}`, preferences);
      showToast("success", "บันทึกการตั้งค่าการแจ้งเตือนแล้ว");
    } catch (error: any) {
      showToast("error", `ไม่สามารถบันทึกการตั้งค่าได้: ${error.message}`);
      throw error;
    }
  };

  /**
   * Send promotional notification (Admin only)
   */
  const sendPromotionalNotification = async (notificationData: {
    title: string;
    message: string;
    targetUsers?: string[]; // If empty, sends to all users
    scheduledAt?: string;
    expiresAt?: string;
    actionUrl?: string;
  }) => {
    try {
      const response = await post(
        "/notifications/promotional",
        notificationData
      );
      showToast("success", "ส่งการแจ้งเตือนโปรโมชั่นแล้ว");
      return response.data;
    } catch (error: any) {
      showToast("error", `ไม่สามารถส่งการแจ้งเตือนได้: ${error.message}`);
      throw error;
    }
  };

  /**
   * Test notification (Development only)
   */
  const sendTestNotification = async (
    userId: string,
    type: string = "test"
  ) => {
    try {
      const response = await post("/notifications/test", { userId, type });
      showToast("success", "ส่งการแจ้งเตือนทดสอบแล้ว");
      return response.data;
    } catch (error: any) {
      showToast("error", `ไม่สามารถส่งการแจ้งเตือนทดสอบได้: ${error.message}`);
      throw error;
    }
  };

  // Computed properties
  const unreadNotifications = computed(() =>
    notifications.value.filter((n) => !n.isRead)
  );

  const notificationsByType = computed(() => {
    const grouped: Record<string, Notification[]> = {};
    notifications.value.forEach((notification) => {
      if (!grouped[notification.type]) {
        grouped[notification.type] = [];
      }
      grouped[notification.type].push(notification);
    });
    return grouped;
  });

  const hasUnread = computed(() => unreadCount.value > 0);

  const recentNotifications = computed(() =>
    notifications.value
      .filter((n) => {
        const created = new Date(n.createdAt);
        const today = new Date();
        const diffTime = Math.abs(today.getTime() - created.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 7; // Last 7 days
      })
      .slice(0, 5)
  );

  /**
   * Utility functions
   */
  const getNotificationIcon = (type: string): string => {
    const iconMap: Record<string, string> = {
      booking_success: "heroicons:check-circle",
      payment_required: "heroicons:exclamation-triangle",
      promotion: "heroicons:gift",
      system: "heroicons:cog-6-tooth",
      reminder: "heroicons:clock",
      warning: "heroicons:exclamation-triangle",
      security: "heroicons:shield-check",
    };
    return iconMap[type] || "heroicons:bell";
  };

  const getNotificationColor = (type: string): string => {
    const colorMap: Record<string, string> = {
      booking_success: "text-green-600 bg-green-100",
      payment_required: "text-yellow-600 bg-yellow-100",
      promotion: "text-purple-600 bg-purple-100",
      system: "text-blue-600 bg-blue-100",
      reminder: "text-orange-600 bg-orange-100",
      warning: "text-red-600 bg-red-100",
      security: "text-indigo-600 bg-indigo-100",
    };
    return colorMap[type] || "text-gray-600 bg-gray-100";
  };

  const formatNotificationTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "เมื่อสักครู่";
    if (diffMins < 60) return `${diffMins} นาทีที่แล้ว`;
    if (diffHours < 24) return `${diffHours} ชั่วโมงที่แล้ว`;
    if (diffDays < 7) return `${diffDays} วันที่แล้ว`;

    return date.toLocaleDateString("th-TH", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return {
    // State
    notifications: readonly(notifications),
    unreadCount: readonly(unreadCount),
    loading: readonly(loading),

    // Actions
    fetchNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,

    // Preferences
    getNotificationPreferences,
    updateNotificationPreferences,

    // Admin functions
    sendPromotionalNotification,
    sendTestNotification,

    // Statistics
    getNotificationStats,

    // Computed
    unreadNotifications,
    notificationsByType,
    hasUnread,
    recentNotifications,

    // Utilities
    getNotificationIcon,
    getNotificationColor,
    formatNotificationTime,
  };
};
