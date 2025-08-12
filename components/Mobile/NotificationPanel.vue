<template>
  <div class="notification-panel">
    <div
      class="fixed inset-0 bg-black bg-opacity-50 z-50"
      @click="$emit('close')"
    >
      <!-- Panel Container -->
      <div
        class="fixed top-0 right-0 w-full max-w-md h-full bg-white shadow-xl transform transition-transform duration-300"
        @click.stop
      >
        <!-- Header -->
        <div class="notification-header">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-white">🔔 การแจ้งเตือน</h2>
            <div class="flex items-center space-x-2">
              <button
                v-if="unreadCount > 0"
                @click="markAllAsRead"
                class="text-sm text-blue-100 hover:text-white transition-colors"
              >
                อ่านทั้งหมด
              </button>
              <button
                @click="$emit('close')"
                class="p-1 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors"
              >
                <Icon name="heroicons:x-mark" class="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>

        <!-- Content -->
        <div class="notification-content">
          <!-- Loading State -->
          <div v-if="loading" class="flex items-center justify-center py-8">
            <Icon
              name="heroicons:arrow-path"
              class="w-6 h-6 animate-spin text-gray-500"
            />
            <span class="ml-2 text-gray-500">กำลังโหลด...</span>
          </div>

          <!-- Empty State -->
          <div v-else-if="notifications.length === 0" class="text-center py-8">
            <Icon
              name="heroicons:bell-slash"
              class="w-12 h-12 text-gray-400 mx-auto mb-3"
            />
            <p class="text-gray-500">ไม่มีการแจ้งเตือน</p>
          </div>

          <!-- Notification List -->
          <div v-else class="space-y-2">
            <div
              v-for="notification in notifications"
              :key="notification.id"
              :class="[
                'notification-item',
                !notification.isRead ? 'notification-unread' : '',
              ]"
              @click="handleNotificationClick(notification)"
            >
              <div class="flex items-start space-x-3">
                <!-- Icon -->
                <div
                  :class="[
                    'notification-icon',
                    getNotificationIconClass(notification.type),
                  ]"
                >
                  <Icon
                    :name="getNotificationIcon(notification.type)"
                    class="w-4 h-4"
                  />
                </div>

                <!-- Content -->
                <div class="flex-1 min-w-0">
                  <h4 class="notification-title">
                    {{ notification.title }}
                  </h4>
                  <p class="notification-message">
                    {{ notification.message }}
                  </p>
                  <div class="flex items-center justify-between mt-2">
                    <p class="notification-time">
                      {{ formatNotificationTime(notification.createdAt) }}
                    </p>
                    <div class="flex items-center space-x-2">
                      <!-- Priority Badge -->
                      <span
                        v-if="notification.priority === 'high'"
                        class="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full"
                      >
                        ด่วน
                      </span>

                      <!-- Action Button -->
                      <button
                        v-if="notification.actionUrl"
                        class="text-xs text-blue-600 hover:underline"
                        @click.stop="handleAction(notification)"
                      >
                        ดูรายละเอียด
                      </button>

                      <!-- Delete Button -->
                      <button
                        @click.stop="deleteNotification(notification.id)"
                        class="text-xs text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Icon name="heroicons:trash" class="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Unread Indicator -->
                <div
                  v-if="!notification.isRead"
                  class="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"
                />
              </div>
            </div>
          </div>

          <!-- Load More Button -->
          <div v-if="hasMore" class="p-4 text-center">
            <button
              @click="loadMore"
              :disabled="loadingMore"
              class="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              {{ loadingMore ? "กำลังโหลด..." : "โหลดเพิ่มเติม" }}
            </button>
          </div>
        </div>

        <!-- Filter/Sort Options -->
        <div class="notification-footer">
          <div class="flex items-center justify-between">
            <select
              v-model="filterType"
              @change="applyFilter"
              class="text-sm border rounded px-2 py-1"
            >
              <option value="">ทั้งหมด</option>
              <option value="booking_success">การจองสำเร็จ</option>
              <option value="payment_required">รอชำระเงิน</option>
              <option value="promotion">โปรโมชั่น</option>
              <option value="system">ระบบ</option>
            </select>

            <div class="text-sm text-gray-500">
              {{ unreadCount }} / {{ totalCount }} ยังไม่อ่าน
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { navigateTo } from "nuxt/app";
import { useNotifications } from "~/composables/useNotifications";
import { useSingleToast } from "~/composables/useSingleToast";

// Props & Emits
defineEmits(["close"]);

// Composables
const notificationsStore = useNotifications();
const { showToast } = useSingleToast();

// State
const loading = ref(false);
const loadingMore = ref(false);
const filterType = ref("");
const currentPage = ref(1);
const pageSize = 20;

// Computed
const notifications = computed(() => notificationsStore.notifications.value);
const unreadCount = computed(() => notificationsStore.unreadCount.value);
const totalCount = computed(() => notifications.value.length);
const hasMore = computed(
  () => notifications.value.length >= currentPage.value * pageSize
);

/**
 * Load notifications
 */
const loadNotifications = async (reset = false) => {
  if (reset) {
    currentPage.value = 1;
    loading.value = true;
  } else {
    loadingMore.value = true;
  }

  try {
    const offset = reset ? 0 : (currentPage.value - 1) * pageSize;
    await notificationsStore.fetchNotifications(pageSize, offset);

    if (!reset) {
      currentPage.value++;
    }
  } catch (error) {
    showToast("error", "ไม่สามารถโหลดการแจ้งเตือนได้");
  } finally {
    loading.value = false;
    loadingMore.value = false;
  }
};

const loadMore = () => {
  loadNotifications(false);
};

/**
 * Handle notification interactions
 */
const handleNotificationClick = async (notification: any) => {
  // Mark as read if not already read
  if (!notification.isRead) {
    await notificationsStore.markAsRead(notification.id);
  }

  // Handle action if exists
  if (notification.actionUrl) {
    await handleAction(notification);
  }
};

const handleAction = async (notification: any) => {
  if (notification.actionUrl) {
    await navigateTo(notification.actionUrl);
  }
};

const markAllAsRead = async () => {
  try {
    await notificationsStore.markAllAsRead();
  } catch (error) {
    showToast("error", "ไม่สามารถอัปเดตสถานะการแจ้งเตือนได้");
  }
};

const deleteNotification = async (id: string) => {
  try {
    await notificationsStore.deleteNotification(id);
  } catch (error) {
    showToast("error", "ไม่สามารถลบการแจ้งเตือนได้");
  }
};

/**
 * Filter and utilities
 */
const applyFilter = () => {
  // In a real implementation, this would filter the notifications
  // For now, just reload with the filter
  loadNotifications(true);
};

const getNotificationIcon = (type: string): string => {
  return notificationsStore.getNotificationIcon(type);
};

const getNotificationIconClass = (type: string): string => {
  return notificationsStore.getNotificationColor(type);
};

const formatNotificationTime = (dateString: string): string => {
  return notificationsStore.formatNotificationTime(dateString);
};

/**
 * Initialize
 */
onMounted(async () => {
  await loadNotifications(true);
  await notificationsStore.getUnreadCount();
});
</script>

<style scoped>
.notification-panel {
  z-index: 9999;
}

.notification-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem;
  color: white;
}

.notification-content {
  flex: 1;
  overflow-y: auto;
  max-height: calc(100vh - 120px);
}

.notification-footer {
  padding: 1rem;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
}

.notification-item {
  padding: 1rem;
  border-bottom: 1px solid #f3f4f6;
  cursor: pointer;
  transition: background-color 0.2s;
}

.notification-item:hover {
  background-color: #f9fafb;
}

.notification-unread {
  background-color: #eff6ff;
  border-left: 4px solid #3b82f6;
}

.notification-icon {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.notification-title {
  font-weight: 500;
  font-size: 0.875rem;
  color: #1f2937;
  line-height: 1.25;
}

.notification-message {
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.25rem;
  line-height: 1.4;
}

.notification-time {
  font-size: 0.75rem;
  color: #9ca3af;
}
</style>
