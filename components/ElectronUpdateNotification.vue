<template>
  <Teleport to="body">
    <div
      v-if="isElectron && showUpdateNotification"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4"
      >
        <div class="p-6">
          <!-- Header -->
          <div class="flex items-center space-x-3 mb-4">
            <div class="flex-shrink-0">
              <div
                :class="getUpdateIconClass()"
                class="w-12 h-12 rounded-full flex items-center justify-center"
              >
                <Icon :name="getUpdateIcon()" class="w-6 h-6" />
              </div>
            </div>
            <div class="flex-1">
              <h3
                class="text-lg font-semibold text-gray-900 dark:text-gray-100"
              >
                {{ getUpdateTitle() }}
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                {{ getUpdateMessage() }}
              </p>
            </div>
          </div>

          <!-- Progress Bar (for downloading) -->
          <div
            v-if="updateStatus === 'downloading' && updateProgress"
            class="mb-4"
          >
            <div
              class="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2"
            >
              <span>กำลังดาวน์โหลดอัพเดท...</span>
              <span class="font-medium"
                >{{ Math.round(updateProgress.percent) }}%</span
              >
            </div>
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div
                class="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
                :style="{ width: updateProgress.percent + '%' }"
              ></div>
            </div>
            <div
              class="flex justify-between text-xs text-gray-500 dark:text-gray-500 mt-2"
            >
              <span
                >{{ formatBytes(updateProgress.transferred) }} /
                {{ formatBytes(updateProgress.total) }}</span
              >
              <span
                >{{ formatBytes(updateProgress.bytesPerSecond) }}/วินาที</span
              >
            </div>
            <!-- Estimated time remaining -->
            <div
              v-if="estimatedTime"
              class="text-center text-xs text-gray-500 mt-1"
            >
              เวลาที่เหลือโดยประมาณ: {{ estimatedTime }}
            </div>
          </div>

          <!-- Version Info -->
          <div
            v-if="updateInfo && updateStatus !== 'checking'"
            class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4"
          >
            <h4
              class="font-medium text-gray-900 dark:text-gray-100 mb-2 flex items-center"
            >
              <Icon name="mdi:tag" class="w-4 h-4 mr-2" />
              เวอร์ชั่น {{ updateInfo.version }}
            </h4>
            <div
              v-if="updateInfo.releaseNotes"
              class="text-sm text-gray-600 dark:text-gray-400"
            >
              <p class="mb-2 font-medium text-gray-800 dark:text-gray-200">
                มีอะไรใหม่:
              </p>
              <div
                class="max-h-32 overflow-y-auto bg-white dark:bg-gray-800 rounded p-2 border"
              >
                <pre class="whitespace-pre-wrap text-xs">{{
                  updateInfo.releaseNotes
                }}</pre>
              </div>
            </div>
            <div
              class="flex justify-between text-xs text-gray-500 dark:text-gray-500 mt-3 pt-2 border-t border-gray-200 dark:border-gray-600"
            >
              <span class="flex items-center">
                <Icon name="mdi:file-download" class="w-3 h-3 mr-1" />
                ขนาด: {{ formatBytes(updateInfo.files?.[0]?.size || 0) }}
              </span>
              <span class="flex items-center">
                <Icon name="mdi:calendar" class="w-3 h-3 mr-1" />
                {{ formatDate(updateInfo.releaseDate) }}
              </span>
            </div>
          </div>

          <!-- Error Info -->
          <div
            v-if="updateStatus === 'error' && errorInfo"
            class="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 mb-4 border border-red-200 dark:border-red-800"
          >
            <h4
              class="font-medium text-red-900 dark:text-red-100 mb-2 flex items-center"
            >
              <Icon name="mdi:alert-circle" class="w-4 h-4 mr-2" />
              รายละเอียดข้อผิดพลาด
            </h4>
            <div class="text-sm text-red-700 dark:text-red-300">
              <p class="mb-2">{{ errorInfo.message }}</p>
              <details v-if="errorInfo.stack" class="mt-2">
                <summary class="cursor-pointer text-xs font-medium">
                  ดูรายละเอียดเพิ่มเติม
                </summary>
                <pre
                  class="mt-2 text-xs bg-red-100 dark:bg-red-900/40 p-2 rounded overflow-auto max-h-32"
                  >{{ errorInfo.stack }}</pre
                >
              </details>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex space-x-3">
            <button
              v-if="updateStatus === 'available'"
              @click="downloadUpdate"
              :disabled="isDownloading"
              class="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <Icon name="mdi:download" class="w-4 h-4 mr-2" />
              ดาวน์โหลดอัพเดท
            </button>

            <button
              v-if="updateStatus === 'downloaded'"
              @click="installUpdate"
              class="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
            >
              <Icon name="mdi:restart" class="w-4 h-4 mr-2" />
              รีสตาร์ทและติดตั้ง
            </button>

            <button
              v-if="updateStatus === 'error'"
              @click="retryUpdate"
              class="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
            >
              <Icon name="mdi:refresh" class="w-4 h-4 mr-2" />
              ลองใหม่
            </button>

            <button
              v-if="updateStatus === 'checking'"
              disabled
              class="flex-1 bg-gray-400 text-white px-4 py-2 rounded-lg cursor-not-allowed flex items-center justify-center"
            >
              <Icon name="mdi:loading" class="w-4 h-4 mr-2 animate-spin" />
              กำลังตรวจสอบ...
            </button>

            <button
              v-if="updateStatus === 'downloading'"
              disabled
              class="flex-1 bg-blue-400 text-white px-4 py-2 rounded-lg cursor-not-allowed flex items-center justify-center"
            >
              <Icon name="mdi:download" class="w-4 h-4 mr-2 animate-pulse" />
              กำลังดาวน์โหลด...
            </button>

            <button
              v-if="updateStatus === 'not-available'"
              @click="dismissUpdate"
              class="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
            >
              <Icon name="mdi:check" class="w-4 h-4 mr-2" />
              เรียบร้อย
            </button>

            <button
              v-if="['available', 'error'].includes(updateStatus)"
              @click="dismissUpdate"
              class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              ทีหลัง
            </button>

            <button
              v-if="updateStatus === 'downloaded'"
              @click="dismissUpdate"
              class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              ติดตั้งทีหลัง
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from "vue";
import dayjs from "dayjs";
import { useElectron } from "../composables/useElectron";

const {
  isElectron,
  updateStatus,
  updateProgress,
  checkForUpdates,
  downloadUpdate: electronDownloadUpdate,
  installUpdate: electronInstallUpdate,
  showMessageBox,
} = useElectron();

const showUpdateNotification = ref(false);
const updateInfo = ref<any>(null);
const errorInfo = ref<any>(null);
const isDownloading = computed(() => updateStatus.value === "downloading");

// Watch for update status changes
watch(updateStatus, (newStatus) => {
  console.log("Update status changed:", newStatus);
  if (["available", "downloading", "downloaded", "error"].includes(newStatus)) {
    showUpdateNotification.value = true;
  } else if (newStatus === "not-available") {
    // Show brief notification for no updates available
    showUpdateNotification.value = true;
    setTimeout(() => {
      showUpdateNotification.value = false;
    }, 3000); // Hide after 3 seconds
  }
});

const getUpdateIcon = () => {
  switch (updateStatus.value) {
    case "checking":
      return "mdi:magnify";
    case "available":
      return "mdi:download-circle";
    case "downloading":
      return "mdi:download";
    case "downloaded":
      return "mdi:check-circle";
    case "error":
      return "mdi:alert-circle";
    case "not-available":
      return "mdi:check-circle-outline";
    default:
      return "mdi:update";
  }
};

const getUpdateIconClass = () => {
  switch (updateStatus.value) {
    case "checking":
      return "bg-blue-100 text-blue-600";
    case "available":
      return "bg-blue-100 text-blue-600";
    case "downloading":
      return "bg-blue-100 text-blue-600";
    case "downloaded":
      return "bg-green-100 text-green-600";
    case "error":
      return "bg-red-100 text-red-600";
    case "not-available":
      return "bg-green-100 text-green-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const getUpdateTitle = () => {
  switch (updateStatus.value) {
    case "checking":
      return "กำลังตรวจสอบอัพเดท";
    case "available":
      return "มีอัพเดทใหม่";
    case "downloading":
      return "กำลังดาวน์โหลดอัพเดท";
    case "downloaded":
      return "อัพเดทพร้อมติดตั้ง";
    case "error":
      return "เกิดข้อผิดพลาด";
    case "not-available":
      return "ใช้เวอร์ชันล่าสุดแล้ว";
    default:
      return "อัพเดท";
  }
};

const getUpdateMessage = () => {
  switch (updateStatus.value) {
    case "checking":
      return "กำลังตรวจสอบเวอร์ชั่นใหม่จากเซิร์ฟเวอร์";
    case "available":
      return "พบเวอร์ชั่นใหม่ของแอปพลิเคชัน พร้อมให้ดาวน์โหลด";
    case "downloading":
      return "กำลังดาวน์โหลดอัพเดทในพื้นหลัง";
    case "downloaded":
      return "ดาวน์โหลดอัพเดทเสร็จแล้ว พร้อมติดตั้ง";
    case "error":
      return "เกิดข้อผิดพลาดในการตรวจสอบหรือดาวน์โหลดอัพเดท";
    case "not-available":
      return "คุณใช้งานเวอร์ชั่นล่าสุดอยู่แล้ว";
    default:
      return "";
  }
};

const estimatedTime = computed(() => {
  if (!updateProgress.value || !updateProgress.value.bytesPerSecond)
    return null;

  const remaining =
    updateProgress.value.total - updateProgress.value.transferred;
  const seconds = Math.ceil(remaining / updateProgress.value.bytesPerSecond);

  if (seconds < 60) return `${seconds} วินาที`;
  if (seconds < 3600) return `${Math.ceil(seconds / 60)} นาที`;
  return `${Math.ceil(seconds / 3600)} ชั่วโมง`;
});

const downloadUpdate = async () => {
  try {
    await electronDownloadUpdate();
  } catch (error) {
    console.error("Download error:", error);
    await showMessageBox({
      type: "error",
      message: "ไม่สามารถดาวน์โหลดอัพเดทได้ กรุณาลองใหม่",
      title: "เกิดข้อผิดพลาด",
    });
  }
};

const installUpdate = async () => {
  const result = await showMessageBox({
    type: "question",
    message:
      "แอปพลิเคชั่นจะรีสตาร์ทเพื่อติดตั้งอัพเดท งานที่ยังไม่ได้บันทึกจะหายไป ต้องการดำเนินการต่อหรือไม่?",
    title: "ติดตั้งอัพเดท",
    buttons: ["ติดตั้งเลย", "ยกเลิก"],
    defaultId: 0,
  });

  if (result?.response === 0) {
    try {
      await electronInstallUpdate();
    } catch (error) {
      console.error("Install error:", error);
      await showMessageBox({
        type: "error",
        message: "ไม่สามารถติดตั้งอัพเดทได้ กรุณาลองใหม่",
        title: "เกิดข้อผิดพลาด",
      });
    }
  }
};

const retryUpdate = async () => {
  try {
    await checkForUpdates();
  } catch (error) {
    console.error("Retry error:", error);
    await showMessageBox({
      type: "error",
      message: "ไม่สามารถตรวจสอบอัพเดทได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต",
      title: "เกิดข้อผิดพลาด",
    });
  }
};

const dismissUpdate = () => {
  showUpdateNotification.value = false;
};

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const formatDate = (date: string | Date): string => {
  return dayjs(date).format("MMM D, YYYY");
};

// Listen for update info from main process
onMounted(() => {
  if (isElectron.value && window.electronAPI) {
    window.electronAPI.onUpdateStatus((event: any, statusData: any) => {
      console.log("Received update status:", statusData);
      if (statusData && typeof statusData === "object") {
        if (statusData.info) {
          updateInfo.value = statusData.info;
        }
        if (statusData.error) {
          errorInfo.value = statusData.error;
        }
      }
    });
  }
});
</script>

<style scoped>
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
