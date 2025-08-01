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
              <Icon
                :name="getUpdateIcon()"
                :class="getUpdateIconClass()"
                class="w-8 h-8"
              />
            </div>
            <div>
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
              class="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1"
            >
              <span>Downloading update...</span>
              <span>{{ Math.round(updateProgress.percent) }}%</span>
            </div>
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                :style="{ width: updateProgress.percent + '%' }"
              ></div>
            </div>
            <div
              class="flex justify-between text-xs text-gray-500 dark:text-gray-500 mt-1"
            >
              <span
                >{{ formatBytes(updateProgress.transferred) }} /
                {{ formatBytes(updateProgress.total) }}</span
              >
              <span>{{ formatBytes(updateProgress.bytesPerSecond) }}/s</span>
            </div>
          </div>

          <!-- Version Info -->
          <div
            v-if="updateInfo"
            class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-4"
          >
            <h4 class="font-medium text-gray-900 dark:text-gray-100 mb-2">
              Version {{ updateInfo.version }}
            </h4>
            <div
              v-if="updateInfo.releaseNotes"
              class="text-sm text-gray-600 dark:text-gray-400"
            >
              <p class="mb-1 font-medium">What's new:</p>
              <div class="max-h-32 overflow-y-auto">
                <pre class="whitespace-pre-wrap">{{
                  updateInfo.releaseNotes
                }}</pre>
              </div>
            </div>
            <div
              class="flex justify-between text-xs text-gray-500 dark:text-gray-500 mt-2"
            >
              <span
                >Size: {{ formatBytes(updateInfo.files?.[0]?.size || 0) }}</span
              >
              <span>Released: {{ formatDate(updateInfo.releaseDate) }}</span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex space-x-3">
            <button
              v-if="updateStatus === 'available'"
              @click="downloadUpdate"
              class="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Download Update
            </button>

            <button
              v-if="updateStatus === 'downloaded'"
              @click="installUpdate"
              class="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Restart & Install
            </button>

            <button
              v-if="updateStatus === 'error'"
              @click="retryUpdate"
              class="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>

            <button
              v-if="['available', 'error'].includes(updateStatus)"
              @click="dismissUpdate"
              class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              Later
            </button>

            <button
              v-if="updateStatus === 'downloaded'"
              @click="dismissUpdate"
              class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              Install Later
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import dayjs from "dayjs";
import { useElectron } from "../composables/useElectron";
// If Icon is not globally registered, import it:
// import Icon from "~icons/mdi";

const {
  isElectron,
  updateStatus,
  updateProgress,
  checkForUpdates,
  showMessageBox,
} = useElectron();

const showUpdateNotification = ref(false);
const updateInfo = ref<any>(null);

// Watch for update status changes
watch(updateStatus, (newStatus) => {
  if (["available", "downloading", "downloaded", "error"].includes(newStatus)) {
    showUpdateNotification.value = true;
  } else if (newStatus === "not-available") {
    showUpdateNotification.value = false;
  }
});

const getUpdateIcon = () => {
  switch (updateStatus.value) {
    case "available":
      return "mdi:download-circle";
    case "downloading":
      return "mdi:download";
    case "downloaded":
      return "mdi:check-circle";
    case "error":
      return "mdi:alert-circle";
    default:
      return "mdi:update";
  }
};

const getUpdateIconClass = () => {
  switch (updateStatus.value) {
    case "available":
      return "text-blue-500";
    case "downloading":
      return "text-blue-500 animate-pulse";
    case "downloaded":
      return "text-green-500";
    case "error":
      return "text-red-500";
    default:
      return "text-gray-500";
  }
};

const getUpdateTitle = () => {
  switch (updateStatus.value) {
    case "available":
      return "Update Available";
    case "downloading":
      return "Downloading Update";
    case "downloaded":
      return "Update Ready";
    case "error":
      return "Update Error";
    default:
      return "Update";
  }
};

const getUpdateMessage = () => {
  switch (updateStatus.value) {
    case "available":
      return "A new version of the application is available for download.";
    case "downloading":
      return "The update is being downloaded in the background.";
    case "downloaded":
      return "The update has been downloaded and is ready to install.";
    case "error":
      return "An error occurred while checking for updates.";
    default:
      return "";
  }
};

const downloadUpdate = async () => {
  try {
    // The auto-updater will handle the download
    // This is just for UI feedback
  } catch (error) {
    console.error("Download error:", error);
    await showMessageBox({
      type: "error",
      message: "Failed to download update. Please try again.",
      title: "Download Error",
    });
  }
};

const installUpdate = async () => {
  const result = await showMessageBox({
    type: "question",
    message:
      "The application will restart to install the update. Any unsaved work will be lost. Continue?",
    title: "Install Update",
    buttons: ["Install Now", "Cancel"],
    defaultId: 0,
  });

  if (result?.response === 0) {
    // The auto-updater will handle the restart and installation
    // This trigger is handled by the main process
  }
};

const retryUpdate = async () => {
  try {
    await checkForUpdates();
  } catch (error) {
    console.error("Retry error:", error);
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
    window.electronAPI.onUpdateStatus((event, status, info) => {
      if (info) {
        updateInfo.value = info;
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
