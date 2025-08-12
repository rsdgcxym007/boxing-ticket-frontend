<template>
  <div class="qr-scanner-container">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-gray-800 dark:text-white">
        สแกน QR Code
      </h2>
      <button
        @click="$emit('close')"
        class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      >
        <Icon icon="mdi:close" class="text-2xl" />
      </button>
    </div>

    <!-- Scanner Status -->
    <div class="mb-4">
      <div class="flex items-center gap-2 mb-2">
        <div
          class="w-3 h-3 rounded-full"
          :class="
            scannerStatus === 'active'
              ? 'bg-green-500'
              : scannerStatus === 'loading'
              ? 'bg-yellow-500'
              : 'bg-red-500'
          "
        ></div>
        <span class="text-sm text-gray-600 dark:text-gray-400">
          {{ getStatusText() }}
        </span>
      </div>
    </div>

    <!-- Camera View -->
    <div class="relative mb-6">
      <div
        class="relative w-full aspect-square max-w-md mx-auto bg-gray-900 rounded-lg overflow-hidden"
        :class="{ 'border-4 border-green-500': isScanning }"
      >
        <!-- Video Element -->
        <video
          ref="videoElement"
          class="w-full h-full object-cover"
          autoplay
          muted
          playsinline
        ></video>

        <!-- Canvas for processing -->
        <canvas
          ref="canvasElement"
          class="absolute inset-0 w-full h-full"
          style="display: none"
        ></canvas>

        <!-- Scanning Overlay -->
        <div
          v-if="isScanning"
          class="absolute inset-0 flex items-center justify-center"
        >
          <div class="w-64 h-64 border-2 border-green-500 relative">
            <!-- Corner Indicators -->
            <div
              class="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-green-500"
            ></div>
            <div
              class="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-green-500"
            ></div>
            <div
              class="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-green-500"
            ></div>
            <div
              class="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-green-500"
            ></div>

            <!-- Scanning Line -->
            <div
              class="absolute left-0 right-0 h-0.5 bg-green-500 shadow-lg animate-scan"
              style="animation: scan 2s linear infinite"
            ></div>
          </div>
        </div>

        <!-- No Camera Access -->
        <div
          v-if="scannerStatus === 'no-camera'"
          class="absolute inset-0 flex items-center justify-center bg-gray-800 text-white"
        >
          <div class="text-center">
            <Icon icon="mdi:camera-off" class="text-6xl mb-4 text-gray-400" />
            <p class="text-lg mb-2">ไม่สามารถเข้าถึงกล้องได้</p>
            <p class="text-sm text-gray-400">กรุณาอนุญาตการใช้งานกล้อง</p>
          </div>
        </div>

        <!-- Loading State -->
        <div
          v-if="scannerStatus === 'loading'"
          class="absolute inset-0 flex items-center justify-center bg-gray-800 text-white"
        >
          <div class="text-center">
            <div
              class="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"
            ></div>
            <p class="text-lg">กำลังเตรียมกล้อง...</p>
          </div>
        </div>
      </div>

      <!-- Instructions -->
      <div class="mt-4 text-center">
        <p class="text-gray-600 dark:text-gray-400">
          จี่อกล้องไปที่ QR Code เพื่อสแกน
        </p>
      </div>
    </div>

    <!-- Scanner Controls -->
    <div class="flex gap-3 mb-6">
      <button
        v-if="!isScanning"
        @click="startScanning"
        class="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        :disabled="scannerStatus === 'loading'"
      >
        <Icon icon="mdi:qrcode-scan" class="inline mr-2" />
        เริ่มสแกน
      </button>

      <button
        v-else
        @click="stopScanning"
        class="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
      >
        <Icon icon="mdi:stop" class="inline mr-2" />
        หยุดสแกน
      </button>

      <button
        @click="toggleFlash"
        class="px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        :disabled="!hasFlash"
      >
        <Icon :icon="flashOn ? 'mdi:flashlight' : 'mdi:flashlight-off'" />
      </button>

      <button
        @click="switchCamera"
        class="px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        :disabled="cameras.length <= 1"
      >
        <Icon icon="mdi:camera-switch" />
      </button>
    </div>

    <!-- Manual Input -->
    <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
      <h3 class="text-lg font-medium text-gray-800 dark:text-white mb-3">
        ป้อนข้อมูลด้วยตนเอง
      </h3>
      <div class="flex gap-2">
        <input
          v-model="manualInput"
          type="text"
          placeholder="ป้อนรหัส QR หรือ URL"
          class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          @click="processManualInput"
          :disabled="!manualInput.trim()"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ตรวจสอบ
        </button>
      </div>
    </div>

    <!-- Scan History -->
    <div v-if="scanHistory.length > 0" class="mt-6">
      <h3 class="text-lg font-medium text-gray-800 dark:text-white mb-3">
        ประวัติการสแกน
      </h3>
      <div class="space-y-2 max-h-48 overflow-y-auto">
        <div
          v-for="item in scanHistory"
          :key="item.id"
          class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
        >
          <div class="flex-1">
            <div class="font-medium text-gray-800 dark:text-white truncate">
              {{ item.data }}
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400">
              {{ formatTime(item.timestamp) }}
            </div>
          </div>
          <div class="flex gap-2">
            <button
              @click="copyToClipboard(item.data)"
              class="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <Icon icon="mdi:content-copy" />
            </button>
            <button
              @click="removeFromHistory(item.id)"
              class="p-1 text-red-500 hover:text-red-700"
            >
              <Icon icon="mdi:delete" />
            </button>
          </div>
        </div>
      </div>
      <button
        @click="clearHistory"
        class="mt-3 px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
      >
        ล้างประวัติ
      </button>
    </div>

    <!-- Result Modal -->
    <div
      v-if="showResult"
      class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    >
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
        <div class="text-center mb-4">
          <Icon
            :icon="result.success ? 'mdi:check-circle' : 'mdi:alert-circle'"
            :class="[
              'text-6xl mb-4',
              result.success ? 'text-green-500' : 'text-red-500',
            ]"
          />
          <h3 class="text-xl font-bold text-gray-800 dark:text-white">
            {{ result.success ? "สแกนสำเร็จ!" : "เกิดข้อผิดพลาด" }}
          </h3>
        </div>

        <div class="mb-6">
          <div class="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
            <div class="text-sm text-gray-600 dark:text-gray-400 mb-1">
              ข้อมูลที่สแกนได้:
            </div>
            <div
              class="font-mono text-sm text-gray-800 dark:text-white break-all"
            >
              {{ result.data }}
            </div>
          </div>

          <div v-if="result.parsed" class="mt-4">
            <div class="text-sm text-gray-600 dark:text-gray-400 mb-2">
              ข้อมูลที่แยกวิเคราะห์:
            </div>
            <div class="space-y-2">
              <div
                v-for="(value, key) in result.parsed"
                :key="key"
                class="flex justify-between"
              >
                <span class="text-sm text-gray-600 dark:text-gray-400"
                  >{{ key }}:</span
                >
                <span
                  class="text-sm font-medium text-gray-800 dark:text-white"
                  >{{ value }}</span
                >
              </div>
            </div>
          </div>
        </div>

        <div class="flex gap-3">
          <button
            @click="showResult = false"
            class="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            ปิด
          </button>
          <button
            v-if="result.success"
            @click="processResult"
            class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            ดำเนินการต่อ
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from "@iconify/vue";

// Emits
const emit = defineEmits(["close", "scan-result"]);

// Reactive data
const videoElement = ref(null);
const canvasElement = ref(null);
const stream = ref(null);
const isScanning = ref(false);
const scannerStatus = ref("idle"); // idle, loading, active, no-camera
const hasFlash = ref(false);
const flashOn = ref(false);
const cameras = ref([]);
const currentCameraIndex = ref(0);
const manualInput = ref("");
const showResult = ref(false);
const result = ref({});

const scanHistory = ref([
  {
    id: 1,
    data: "https://example.com/ticket/12345",
    timestamp: new Date(Date.now() - 60000),
  },
  {
    id: 2,
    data: "TICKET-67890-VIP",
    timestamp: new Date(Date.now() - 120000),
  },
]);

// Methods
const getStatusText = () => {
  const statusMap = {
    idle: "พร้อมใช้งาน",
    loading: "กำลังเตรียมกล้อง...",
    active: "กำลังสแกน...",
    "no-camera": "ไม่สามารถเข้าถึงกล้องได้",
  };
  return statusMap[scannerStatus.value] || "ไม่ทราบสถานะ";
};

const requestCameraPermission = async () => {
  try {
    scannerStatus.value = "loading";

    // Get available cameras
    const devices = await navigator.mediaDevices.enumerateDevices();
    cameras.value = devices.filter((device) => device.kind === "videoinput");

    // Request camera access
    const constraints = {
      video: {
        deviceId: cameras.value[currentCameraIndex.value]?.deviceId,
        facingMode: "environment", // Prefer back camera
      },
    };

    stream.value = await navigator.mediaDevices.getUserStream(constraints);

    if (videoElement.value) {
      videoElement.value.srcObject = stream.value;
      await videoElement.value.play();
    }

    // Check for flash capability
    const track = stream.value.getVideoTracks()[0];
    const capabilities = track.getCapabilities();
    hasFlash.value = capabilities.torch === true;

    scannerStatus.value = "active";
    return true;
  } catch (error) {
    console.error("Camera access error:", error);
    scannerStatus.value = "no-camera";
    return false;
  }
};

const startScanning = async () => {
  const hasAccess = await requestCameraPermission();
  if (hasAccess) {
    isScanning.value = true;
    startQRDetection();
  }
};

const stopScanning = () => {
  isScanning.value = false;
  if (stream.value) {
    stream.value.getTracks().forEach((track) => track.stop());
    stream.value = null;
  }
  scannerStatus.value = "idle";
};

const startQRDetection = () => {
  // Simulate QR code detection
  const detectInterval = setInterval(() => {
    if (!isScanning.value) {
      clearInterval(detectInterval);
      return;
    }

    // Simulate finding a QR code occasionally
    if (Math.random() < 0.1) {
      // 10% chance per check
      clearInterval(detectInterval);

      // Simulate different types of QR codes
      const qrTypes = [
        "https://boxing-ticket.com/verify/ticket/ABC123",
        "TICKET-VIP-789012",
        "https://promo.boxing.com/discount/SAVE20",
        '{"ticketId": "T123456", "seat": "A-15", "event": "Boxing Championship"}',
      ];

      const randomQR = qrTypes[Math.floor(Math.random() * qrTypes.length)];
      handleQRDetected(randomQR);
    }
  }, 1000);
};

const handleQRDetected = (data) => {
  // Add to history
  const historyItem = {
    id: Date.now(),
    data,
    timestamp: new Date(),
  };

  scanHistory.value.unshift(historyItem);

  // Limit history to 10 items
  if (scanHistory.value.length > 10) {
    scanHistory.value = scanHistory.value.slice(0, 10);
  }

  // Parse QR data
  const parsed = parseQRData(data);

  result.value = {
    success: true,
    data,
    parsed,
  };

  showResult.value = true;
  stopScanning();

  // Emit result
  emit("scan-result", result.value);
};

const parseQRData = (data) => {
  try {
    // Try to parse as JSON
    const json = JSON.parse(data);
    return json;
  } catch {
    // Try to parse as URL
    try {
      const url = new URL(data);
      const params = {};
      url.searchParams.forEach((value, key) => {
        params[key] = value;
      });
      return {
        url: url.origin + url.pathname,
        params,
      };
    } catch {
      // Parse as simple string
      if (data.includes("-")) {
        const parts = data.split("-");
        return {
          type: parts[0],
          id: parts[1],
          category: parts[2] || null,
        };
      }
      return { raw: data };
    }
  }
};

const processManualInput = () => {
  if (!manualInput.value.trim()) return;

  handleQRDetected(manualInput.value.trim());
  manualInput.value = "";
};

const toggleFlash = async () => {
  if (!stream.value || !hasFlash.value) return;

  try {
    const track = stream.value.getVideoTracks()[0];
    await track.applyConstraints({
      advanced: [{ torch: !flashOn.value }],
    });
    flashOn.value = !flashOn.value;
  } catch (error) {
    console.error("Flash toggle error:", error);
  }
};

const switchCamera = async () => {
  if (cameras.value.length <= 1) return;

  currentCameraIndex.value =
    (currentCameraIndex.value + 1) % cameras.value.length;

  if (isScanning.value) {
    stopScanning();
    await nextTick();
    startScanning();
  }
};

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    // Show success feedback
  } catch (error) {
    console.error("Copy failed:", error);
  }
};

const removeFromHistory = (id) => {
  scanHistory.value = scanHistory.value.filter((item) => item.id !== id);
};

const clearHistory = () => {
  scanHistory.value = [];
};

const processResult = () => {
  // Process the scan result (verify ticket, apply promotion, etc.)
  console.log("Processing result:", result.value);
  showResult.value = false;
  emit("close");
};

// Cleanup on unmount
onUnmounted(() => {
  stopScanning();
});
</script>

<style scoped>
.qr-scanner-container {
  width: 100%;
  max-width: 32rem;
  margin: 0 auto;
  padding: 1rem;
}

@keyframes scan {
  0% {
    top: 0;
  }
  50% {
    top: 50%;
  }
  100% {
    top: 100%;
  }
}

.animate-scan {
  animation: scan 2s linear infinite;
}
</style>
