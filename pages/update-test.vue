<template>
  <div class="min-h-screen bg-gray-100 py-8">
    <div class="max-w-4xl mx-auto px-4">
      <div class="bg-white rounded-lg shadow-lg p-6">
        <h1 class="text-2xl font-bold text-gray-900 mb-6">
          ทดสอบระบบอัพเดท Electron
        </h1>

        <!-- App Info -->
        <div class="bg-blue-50 rounded-lg p-4 mb-6">
          <h2 class="text-lg font-semibold text-blue-900 mb-2">ข้อมูลแอป</h2>
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span class="font-medium text-blue-800">แพลตฟอร์ม:</span>
              <span class="ml-2">{{ platform }}</span>
            </div>
            <div>
              <span class="font-medium text-blue-800">เวอร์ชั่นปัจจุบัน:</span>
              <span class="ml-2">{{ appVersion || "กำลังโหลด..." }}</span>
            </div>
            <div>
              <span class="font-medium text-blue-800">Electron:</span>
              <span class="ml-2">{{ isElectron ? "ใช่" : "ไม่ใช่" }}</span>
            </div>
            <div>
              <span class="font-medium text-blue-800">สถานะอัพเดท:</span>
              <span class="ml-2">{{ updateStatus || "ไม่มีข้อมูล" }}</span>
            </div>
          </div>
        </div>

        <!-- Update Controls -->
        <div class="bg-gray-50 rounded-lg p-4 mb-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">
            การควบคุมอัพเดท
          </h2>
          <div class="flex flex-wrap gap-3">
            <button
              @click="checkUpdates"
              :disabled="isChecking"
              class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <Icon
                name="mdi:refresh"
                class="w-4 h-4 mr-2"
                :class="{ 'animate-spin': isChecking }"
              />
              {{ isChecking ? "กำลังตรวจสอบ..." : "ตรวจสอบอัพเดท" }}
            </button>

            <button
              @click="forceShowNotification"
              class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
            >
              <Icon name="mdi:bell" class="w-4 h-4 mr-2" />
              แสดง Notification
            </button>

            <button
              @click="simulateDownloading"
              class="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center"
            >
              <Icon name="mdi:download" class="w-4 h-4 mr-2" />
              จำลองการดาวน์โหลด
            </button>

            <button
              @click="simulateComplete"
              class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center"
            >
              <Icon name="mdi:check-circle" class="w-4 h-4 mr-2" />
              จำลองการดาวน์โหลดเสร็จ
            </button>
          </div>
        </div>

        <!-- Update Progress -->
        <div v-if="updateProgress" class="bg-yellow-50 rounded-lg p-4 mb-6">
          <h2 class="text-lg font-semibold text-yellow-900 mb-2">
            ความคืบหน้าการดาวน์โหลด
          </h2>
          <div class="space-y-2">
            <div class="flex justify-between text-sm">
              <span>{{ Math.round(updateProgress.percent) }}%</span>
              <span
                >{{ formatBytes(updateProgress.transferred) }} /
                {{ formatBytes(updateProgress.total) }}</span
              >
            </div>
            <div class="w-full bg-yellow-200 rounded-full h-3">
              <div
                class="bg-yellow-600 h-3 rounded-full transition-all duration-300"
                :style="{ width: updateProgress.percent + '%' }"
              ></div>
            </div>
            <div class="text-xs text-yellow-700">
              ความเร็ว: {{ formatBytes(updateProgress.bytesPerSecond) }}/วินาที
            </div>
          </div>
        </div>

        <!-- Log -->
        <div class="bg-gray-900 rounded-lg p-4">
          <h2 class="text-lg font-semibold text-white mb-2">Log</h2>
          <div class="bg-black rounded p-3 max-h-64 overflow-y-auto">
            <div
              v-for="(log, index) in logs"
              :key="index"
              class="text-green-400 text-xs font-mono mb-1"
            >
              [{{ log.time }}] {{ log.message }}
            </div>
          </div>
          <button
            @click="clearLogs"
            class="mt-2 text-xs text-gray-400 hover:text-white"
          >
            ล้าง Log
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useElectron } from "../composables/useElectron";

const {
  isElectron,
  platform,
  appVersion,
  updateStatus,
  updateProgress,
  checkForUpdates,
  getAppVersion,
} = useElectron();

const isChecking = ref(false);
const logs = ref<Array<{ time: string; message: string }>>([]);

const addLog = (message: string) => {
  const time = new Date().toLocaleTimeString();
  logs.value.unshift({ time, message });
  if (logs.value.length > 100) {
    logs.value = logs.value.slice(0, 100);
  }
};

const clearLogs = () => {
  logs.value = [];
};

const checkUpdates = async () => {
  if (!isElectron.value) {
    addLog("ไม่สามารถตรวจสอบอัพเดทได้ เนื่องจากไม่ได้รันใน Electron");
    return;
  }

  isChecking.value = true;
  addLog("เริ่มตรวจสอบอัพเดท...");

  try {
    const result = await checkForUpdates();
    addLog(`ผลการตรวจสอบ: ${result}`);
  } catch (error) {
    addLog(`เกิดข้อผิดพลาด: ${error}`);
  } finally {
    isChecking.value = false;
  }
};

const forceShowNotification = () => {
  if (!isElectron.value) {
    addLog("ไม่สามารถแสดง notification ได้ เนื่องจากไม่ได้รันใน Electron");
    return;
  }

  addLog("บังคับแสดง update notification");
  // จำลองการมี update available
  (updateStatus as any).value = "available";
};

const simulateDownloading = () => {
  if (!isElectron.value) {
    addLog("ไม่สามารถจำลองการดาวน์โหลดได้ เนื่องจากไม่ได้รันใน Electron");
    return;
  }

  addLog("จำลองการดาวน์โหลด...");
  (updateStatus as any).value = "downloading";

  // จำลอง progress
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 10;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      addLog("การดาวน์โหลดเสร็จสิ้น");
    }

    (updateProgress as any).value = {
      percent: progress,
      transferred: (progress / 100) * 157286400, // 150MB
      total: 157286400,
      bytesPerSecond: 1048576 * 2, // 2MB/s
    };
  }, 500);
};

const simulateComplete = () => {
  if (!isElectron.value) {
    addLog("ไม่สามารถจำลองการดาวน์โหลดเสร็จได้ เนื่องจากไม่ได้รันใน Electron");
    return;
  }

  addLog("จำลองการดาวน์โหลดเสร็จสิ้น");
  (updateStatus as any).value = "downloaded";
  (updateProgress as any).value = {
    percent: 100,
    transferred: 157286400,
    total: 157286400,
    bytesPerSecond: 0,
  };
};

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// Watch for status changes
watch(updateStatus, (newStatus) => {
  addLog(`สถานะอัพเดทเปลี่ยนเป็น: ${newStatus}`);
});

watch(updateProgress, (newProgress) => {
  if (newProgress) {
    addLog(`ความคืบหน้า: ${Math.round(newProgress.percent)}%`);
  }
});

onMounted(async () => {
  addLog("เริ่มต้นหน้าทดสอบ");
  addLog(`แพลตฟอร์ม: ${platform.value}`);
  addLog(`Electron: ${isElectron.value ? "ใช่" : "ไม่ใช่"}`);

  if (isElectron.value) {
    try {
      await getAppVersion();
      addLog(`เวอร์ชั่นแอป: ${appVersion.value}`);
    } catch (error) {
      addLog(`ไม่สามารถดึงเวอร์ชั่นแอปได้: ${error}`);
    }
  }
});
</script>
