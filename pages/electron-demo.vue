<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-3xl font-bold text-white mb-8">
        🚀 Electron Integration Demo
      </h1>

      <!-- Electron Status -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <h3
            class="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200"
          >
            🔍 Environment Info
          </h3>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-400">Platform:</span>
              <span class="font-medium text-gray-800 dark:text-gray-200">
                {{ isElectron ? platform : "Web Browser" }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-400">Environment:</span>
              <span class="font-medium text-gray-800 dark:text-gray-200">
                {{ isElectron ? "Electron App" : "Web Application" }}
              </span>
            </div>
            <div v-if="appVersion" class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-400">App Version:</span>
              <span class="font-medium text-gray-800 dark:text-gray-200">{{
                appVersion
              }}</span>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <h3
            class="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200"
          >
            🔄 Update Status
          </h3>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-400">Status:</span>
              <span class="font-medium text-gray-800 dark:text-gray-200">
                {{ updateStatus || "Not checked" }}
              </span>
            </div>
            <button
              @click="checkUpdates"
              class="w-full mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              :disabled="!isElectron"
            >
              Check for Updates
            </button>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <h3
            class="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200"
          >
            🪟 Window Controls
          </h3>
          <div class="space-y-2">
            <button
              @click="minimizeWindow"
              class="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              :disabled="!isElectron"
            >
              Minimize
            </button>
            <button
              @click="maximizeWindow"
              class="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              :disabled="!isElectron"
            >
              {{ isMaximized ? "Restore" : "Maximize" }}
            </button>
          </div>
        </div>
      </div>

      <!-- Dialog Examples -->
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg mb-8">
        <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
          💬 Native Dialogs
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            @click="showInfoDialog"
            class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            :disabled="!isElectron"
          >
            Show Info Dialog
          </button>
          <button
            @click="showWarningDialog"
            class="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
            :disabled="!isElectron"
          >
            Show Warning Dialog
          </button>
          <button
            @click="showErrorDialog"
            class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            :disabled="!isElectron"
          >
            Show Error Dialog
          </button>
        </div>
      </div>

      <!-- File Operations -->
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg mb-8">
        <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
          📁 File Operations
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            @click="openFileDialog"
            class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            :disabled="!isElectron"
          >
            Open File
          </button>
          <button
            @click="openFolderDialog"
            class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            :disabled="!isElectron"
          >
            Open Folder
          </button>
          <button
            @click="saveFileDialog"
            class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            :disabled="!isElectron"
          >
            Save File
          </button>
        </div>
        <div v-if="selectedFiles.length > 0" class="mt-4">
          <h4 class="font-medium text-gray-800 dark:text-gray-200 mb-2">
            Selected Files:
          </h4>
          <ul class="text-sm text-gray-600 dark:text-gray-400">
            <li v-for="file in selectedFiles" :key="file" class="truncate">
              {{ file }}
            </li>
          </ul>
        </div>
      </div>

      <!-- Navigation Examples -->
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg mb-8">
        <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
          🧭 Quick Navigation
        </h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            @click="navigateTo('/admin/dashboard')"
            class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Dashboard
          </button>
          <button
            @click="navigateTo('/admin/orders')"
            class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Orders
          </button>
          <button
            @click="navigateTo('/ringside')"
            class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Ringside
          </button>
          <button
            @click="navigateTo('/StandingTicketForm')"
            class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Standing
          </button>
        </div>
      </div>

      <!-- Electron Ticket Actions -->
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg mb-8">
        <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
          🎫 Ticket Actions
        </h3>
        <ElectronTicketActions
          :selected-ticket="demoTicket"
          :selected-order="demoOrder"
          :selected-tickets="[demoTicket]"
        />
      </div>

      <!-- Keyboard Shortcuts -->
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
          ⌨️ Keyboard Shortcuts
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 class="font-medium text-gray-800 dark:text-gray-200 mb-2">
              Navigation:
            </h4>
            <ul class="space-y-1 text-gray-600 dark:text-gray-400">
              <li>
                <kbd class="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded"
                  >Ctrl+1</kbd
                >
                Dashboard
              </li>
              <li>
                <kbd class="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded"
                  >Ctrl+2</kbd
                >
                Orders
              </li>
              <li>
                <kbd class="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded"
                  >Ctrl+3</kbd
                >
                Staff
              </li>
              <li>
                <kbd class="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded"
                  >Ctrl+4</kbd
                >
                Audit
              </li>
              <li>
                <kbd class="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded"
                  >Ctrl+5</kbd
                >
                Referrer
              </li>
            </ul>
          </div>
          <div>
            <h4 class="font-medium text-gray-800 dark:text-gray-200 mb-2">
              Actions:
            </h4>
            <ul class="space-y-1 text-gray-600 dark:text-gray-400">
              <li>
                <kbd class="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded"
                  >Ctrl+N</kbd
                >
                New Order
              </li>
              <li>
                <kbd class="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded"
                  >Ctrl+P</kbd
                >
                Print
              </li>
              <li>
                <kbd class="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded"
                  >Ctrl+R</kbd
                >
                Ringside
              </li>
              <li>
                <kbd class="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded"
                  >Ctrl+S</kbd
                >
                Standing
              </li>
              <li>
                <kbd class="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded"
                  >F5</kbd
                >
                Reload
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useHead } from "@unhead/vue";
import { useElectron } from "../composables/useElectron";
import ElectronTicketActions from "../components/ElectronTicketActions.vue";

const router = useRouter();
// Navigation helper for demo buttons
const navigateTo = (path: string) => {
  router.push(path);
};

const {
  isElectron,
  platform,
  appVersion,
  updateStatus,
  isMaximized,
  checkForUpdates,
  minimizeWindow: electronMinimize,
  maximizeWindow: electronMaximize,
  showMessageBox,
  showOpenDialog,
  showSaveDialog,
} = useElectron();

const selectedFiles = ref<string[]>([]);

// Demo data
const demoTicket = {
  id: "DEMO-001",
  zone: "VIP",
  seat: "A1",
  price: 2500,
};

const demoOrder = {
  id: "ORDER-001",
  total: 5000,
  tickets: 2,
};

// Dialog functions
const showInfoDialog = async () => {
  await showMessageBox({
    type: "info",
    title: "Information",
    message: "This is an information dialog from Electron!",
    detail:
      "Native dialogs provide better user experience in desktop applications.",
  });
};

const showWarningDialog = async () => {
  await showMessageBox({
    type: "warning",
    title: "Warning",
    message: "This is a warning dialog.",
    detail: "This type of dialog is used to warn users about potential issues.",
  });
};

const showErrorDialog = async () => {
  await showMessageBox({
    type: "error",
    title: "Error",
    message: "This is an error dialog.",
    detail:
      "Error dialogs are used to inform users about problems that occurred.",
  });
};

// File operations
const openFileDialog = async () => {
  const result = await showOpenDialog({
    title: "Select a file",
    filters: [
      { name: "All Files", extensions: ["*"] },
      { name: "Text Files", extensions: ["txt", "md"] },
      { name: "Images", extensions: ["jpg", "png", "gif"] },
    ],
    properties: ["openFile", "multiSelections"],
  });

  if (result && !result.canceled) {
    selectedFiles.value = result.filePaths;
  }
};

const openFolderDialog = async () => {
  const result = await showOpenDialog({
    title: "Select a folder",
    properties: ["openDirectory"],
  });

  if (result && !result.canceled) {
    selectedFiles.value = result.filePaths;
  }
};

const saveFileDialog = async () => {
  const result = await showSaveDialog({
    title: "Save file",
    defaultPath: "export.txt",
    filters: [
      { name: "Text Files", extensions: ["txt"] },
      { name: "All Files", extensions: ["*"] },
    ],
  });

  if (result && !result.canceled && result.filePath) {
    selectedFiles.value = [result.filePath];
  }
};

// Window controls
const minimizeWindow = async () => {
  await electronMinimize();
};

const maximizeWindow = async () => {
  await electronMaximize();
};

// Update check
const checkUpdates = async () => {
  await checkForUpdates();
};

// Set page title
useHead({
  title: "Electron Demo - Patong Boxing",
});
</script>

<style scoped>
kbd {
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas,
    "Liberation Mono", "Courier New", monospace;
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1;
}
</style>
