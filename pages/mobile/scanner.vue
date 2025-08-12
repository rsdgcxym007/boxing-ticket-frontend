<template>
  <div class="scanner-page">
    <!-- Header -->
    <div class="scanner-header">
      <div class="header-content">
        <button @click="$router.go(-1)" class="back-button">
          <Icon icon="mdi:arrow-left" class="text-xl" />
        </button>
        <h1 class="header-title">🔍 QR Scanner</h1>
        <button @click="showHistory = true" class="history-button">
          <Icon icon="mdi:history" class="text-xl" />
        </button>
      </div>
    </div>

    <!-- Camera Scanner -->
    <div class="scanner-container">
      <div class="camera-wrapper" ref="cameraWrapper">
        <video
          ref="videoElement"
          class="camera-video"
          :class="{ 'camera-active': isCameraActive }"
          autoplay
          muted
          playsinline
        ></video>

        <!-- Scanning Overlay -->
        <div class="scan-overlay">
          <div class="scan-frame">
            <div class="corner-tl"></div>
            <div class="corner-tr"></div>
            <div class="corner-bl"></div>
            <div class="corner-br"></div>
          </div>

          <!-- Scanning Animation -->
          <div v-if="isScanning" class="scan-line"></div>
        </div>

        <!-- Manual Input Overlay -->
        <div v-if="showManualInput" class="manual-input-overlay">
          <div class="manual-input-card">
            <h3>กรอก QR Code Manual</h3>
            <textarea
              v-model="manualQRInput"
              placeholder="วาง QR Code data ที่นี่..."
              class="manual-input"
              rows="4"
            ></textarea>
            <div class="manual-input-actions">
              <button @click="showManualInput = false" class="btn-cancel">
                ยกเลิก
              </button>
              <button
                @click="handleManualScan"
                class="btn-scan"
                :disabled="!manualQRInput.trim()"
              >
                สแกน
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Scanner Status -->
      <div class="scanner-status">
        <div v-if="!isCameraActive && !isLoading" class="status-message error">
          <Icon icon="mdi:camera-off" class="text-2xl mb-2" />
          <p>ไม่สามารถเข้าถึงกล้องได้</p>
          <button @click="initCamera" class="btn-retry">ลองอีกครั้ง</button>
        </div>

        <div v-else-if="isLoading" class="status-message loading">
          <div class="loading-spinner"></div>
          <p>กำลังเปิดกล้อง...</p>
        </div>

        <div v-else-if="isCameraActive" class="status-message success">
          <Icon icon="mdi:camera" class="text-2xl mb-2 text-green-500" />
          <p>จ่อ QR Code ที่กล้อง</p>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="action-buttons">
        <button
          @click="toggleFlashlight"
          class="action-btn"
          :class="{ active: isFlashlightOn }"
        >
          <Icon icon="mdi:flashlight" class="text-xl" />
          <span>แฟลช</span>
        </button>

        <button @click="showManualInput = true" class="action-btn">
          <Icon icon="mdi:keyboard" class="text-xl" />
          <span>Manual</span>
        </button>

        <button @click="showHistory = true" class="action-btn">
          <Icon icon="mdi:history" class="text-xl" />
          <span>ประวัติ</span>
        </button>
      </div>
    </div>

    <!-- Scan Result Modal -->
    <ScanResultModal
      v-if="showScanResult"
      :result="scanResult"
      @close="closeScanResult"
      @scan-next="scanNext"
    />

    <!-- Scan History Modal -->
    <ScanHistoryModal v-if="showHistory" @close="showHistory = false" />

    <!-- Error Modal -->
    <ErrorModal
      v-if="showError"
      :error="errorMessage"
      @close="closeError"
      @retry="retryScan"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import { Icon } from "@iconify/vue";
import { useQRScannerStore } from "@/stores/qrScanner";
import { useAuthStore } from "@/stores/auth";
import ScanResultModal from "@/components/mobile/ScanResultModal.vue";
import ScanHistoryModal from "@/components/mobile/ScanHistoryModal.vue";
import ErrorModal from "@/components/mobile/ErrorModal.vue";

// Composables
const qrStore = useQRScannerStore();
const authStore = useAuthStore();

// Refs
const videoElement = ref(null);
const cameraWrapper = ref(null);

// State
const isCameraActive = ref(false);
const isScanning = ref(false);
const isLoading = ref(false);
const isFlashlightOn = ref(false);
const showManualInput = ref(false);
const showScanResult = ref(false);
const showHistory = ref(false);
const showError = ref(false);

// Data
const manualQRInput = ref("");
const scanResult = ref(null);
const errorMessage = ref("");
const mediaStream = ref(null);
const qrScanner = ref(null);

// Check authentication
if (!authStore.isAuthenticated) {
  navigateTo("/mobile/login");
}

// Methods
const initCamera = async () => {
  try {
    isLoading.value = true;

    // Request camera permission
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: "environment", // Use back camera
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
    });

    if (videoElement.value) {
      videoElement.value.srcObject = stream;
      mediaStream.value = stream;
      isCameraActive.value = true;

      await nextTick();
      await videoElement.value.play();

      // Initialize QR Scanner
      await initQRScanner();
    }
  } catch (error) {
    console.error("Camera initialization failed:", error);
    handleCameraError(error);
  } finally {
    isLoading.value = false;
  }
};

const initQRScanner = async () => {
  try {
    // Dynamic import to avoid SSR issues
    const { QrScanner } = await import("qr-scanner");

    if (videoElement.value) {
      qrScanner.value = new QrScanner(
        videoElement.value,
        (result) => handleScanSuccess(result.data),
        {
          highlightScanRegion: true,
          highlightCodeOutline: true,
          preferredCamera: "environment",
          maxScansPerSecond: 3,
          calculateScanRegion: () => ({
            x: 0.1,
            y: 0.1,
            width: 0.8,
            height: 0.8,
          }),
        }
      );

      await qrScanner.value.start();
      console.log("✅ QR Scanner initialized successfully");
    }
  } catch (error) {
    console.error("QR Scanner initialization failed:", error);
    showErrorMessage("ไม่สามารถเปิด QR Scanner ได้");
  }
};

const handleScanSuccess = async (qrData) => {
  if (isScanning.value) return; // Prevent multiple scans

  try {
    isScanning.value = true;

    // Vibrate if supported
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }

    // Play scan sound (optional)
    playScanSound();

    console.log("📱 QR Code scanned:", qrData.substring(0, 50) + "...");

    // Process QR Code through store
    const result = await qrStore.scanQRCode(qrData);

    scanResult.value = result;
    showScanResult.value = true;

    // Pause scanner while showing result
    if (qrScanner.value) {
      qrScanner.value.pause();
    }
  } catch (error) {
    console.error("Scan processing failed:", error);
    handleScanError(error);
  } finally {
    setTimeout(() => {
      isScanning.value = false;
    }, 1000);
  }
};

const handleManualScan = async () => {
  if (!manualQRInput.value.trim()) return;

  try {
    showManualInput.value = false;
    isScanning.value = true;

    const result = await qrStore.scanQRCode(manualQRInput.value.trim());

    scanResult.value = result;
    showScanResult.value = true;
    manualQRInput.value = "";
  } catch (error) {
    console.error("Manual scan failed:", error);
    handleScanError(error);
  } finally {
    isScanning.value = false;
  }
};

const handleScanError = (error) => {
  const errorMessages = {
    QR_INVALID: "QR Code ไม่ถูกต้องหรือเสียหาย",
    QR_EXPIRED: "QR Code หมดอายุแล้ว",
    ALREADY_CHECKED_IN: "ลูกค้าได้เช็คอินแล้ว",
    INVALID_CREDENTIALS: "ไม่มีสิทธิ์เข้าถึง",
    NETWORK_ERROR: "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้",
  };

  errorMessage.value =
    errorMessages[error.code] ||
    error.message ||
    "เกิดข้อผิดพลาดในการสแกน QR Code";
  showError.value = true;
};

const handleCameraError = (error) => {
  let message = "ไม่สามารถเข้าถึงกล้องได้";

  if (error.name === "NotAllowedError") {
    message = "กรุณาอนุญาตการใช้งานกล้อง";
  } else if (error.name === "NotFoundError") {
    message = "ไม่พบกล้องในอุปกรณ์";
  } else if (error.name === "NotSupportedError") {
    message = "เบราว์เซอร์ไม่รองรับการใช้งานกล้อง";
  }

  showErrorMessage(message);
};

const toggleFlashlight = async () => {
  try {
    if (mediaStream.value) {
      const track = mediaStream.value.getVideoTracks()[0];
      const capabilities = track.getCapabilities();

      if (capabilities.torch) {
        await track.applyConstraints({
          advanced: [{ torch: !isFlashlightOn.value }],
        });
        isFlashlightOn.value = !isFlashlightOn.value;
      } else {
        showErrorMessage("อุปกรณ์ไม่รองรับแฟลช");
      }
    }
  } catch (error) {
    console.error("Flashlight toggle failed:", error);
    showErrorMessage("ไม่สามารถควบคุมแฟลชได้");
  }
};

const playScanSound = () => {
  try {
    const audio = new Audio("/sounds/scan-beep.mp3");
    audio.volume = 0.3;
    audio.play().catch(() => {
      // Ignore audio play errors (user interaction required)
    });
  } catch (error) {
    // Ignore audio errors
  }
};

const showErrorMessage = (message) => {
  errorMessage.value = message;
  showError.value = true;
};

const closeScanResult = () => {
  showScanResult.value = false;
  scanResult.value = null;

  // Resume scanner
  if (qrScanner.value && isCameraActive.value) {
    qrScanner.value.start();
  }
};

const scanNext = () => {
  closeScanResult();
};

const closeError = () => {
  showError.value = false;
  errorMessage.value = "";
};

const retryScan = () => {
  closeError();
  if (!isCameraActive.value) {
    initCamera();
  }
};

const cleanup = () => {
  // Stop QR Scanner
  if (qrScanner.value) {
    qrScanner.value.stop();
    qrScanner.value.destroy();
    qrScanner.value = null;
  }

  // Stop camera stream
  if (mediaStream.value) {
    mediaStream.value.getTracks().forEach((track) => track.stop());
    mediaStream.value = null;
  }

  // Turn off flashlight
  if (isFlashlightOn.value) {
    isFlashlightOn.value = false;
  }

  isCameraActive.value = false;
};

// Lifecycle
onMounted(async () => {
  await nextTick();
  await initCamera();
});

onUnmounted(() => {
  cleanup();
});

// SEO
definePageMeta({
  layout: "mobile",
  middleware: "auth",
});

useSeoMeta({
  title: "QR Scanner - Patong Boxing",
  description: "Scan QR codes for ticket check-in",
});
</script>

<style scoped>
.scanner-page {
  min-height: 100vh;
  background: #000;
  display: flex;
  flex-direction: column;
}

/* Header */
.scanner-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  padding-top: env(safe-area-inset-top);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
}

.back-button,
.history-button {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.back-button:active,
.history-button:active {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(0.95);
}

.header-title {
  color: white;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}

/* Scanner Container */
.scanner-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-top: calc(80px + env(safe-area-inset-top));
}

.camera-wrapper {
  position: relative;
  flex: 1;
  min-height: 400px;
  background: #000;
  overflow: hidden;
}

.camera-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.3s;
}

.camera-video.camera-active {
  opacity: 1;
}

/* Scan Overlay */
.scan-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}

.scan-frame {
  position: relative;
  width: 250px;
  height: 250px;
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-radius: 12px;
}

.scan-frame::before {
  content: "";
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: transparent;
  border-radius: 12px;
  backdrop-filter: blur(0);
}

/* Corner indicators */
.corner-tl,
.corner-tr,
.corner-bl,
.corner-br {
  position: absolute;
  width: 30px;
  height: 30px;
  border: 3px solid #00ff88;
}

.corner-tl {
  top: -3px;
  left: -3px;
  border-right: none;
  border-bottom: none;
  border-radius: 12px 0 0 0;
}

.corner-tr {
  top: -3px;
  right: -3px;
  border-left: none;
  border-bottom: none;
  border-radius: 0 12px 0 0;
}

.corner-bl {
  bottom: -3px;
  left: -3px;
  border-right: none;
  border-top: none;
  border-radius: 0 0 0 12px;
}

.corner-br {
  bottom: -3px;
  right: -3px;
  border-left: none;
  border-top: none;
  border-radius: 0 0 12px 0;
}

/* Scanning Animation */
.scan-line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #00ff88, transparent);
  animation: scan-animation 2s linear infinite;
}

@keyframes scan-animation {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(250px);
  }
}

/* Manual Input Overlay */
.manual-input-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.manual-input-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  width: 100%;
  max-width: 400px;
}

.manual-input-card h3 {
  margin: 0 0 1rem 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
}

.manual-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-family: monospace;
  font-size: 0.875rem;
  resize: vertical;
  min-height: 80px;
}

.manual-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.manual-input-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
}

.btn-cancel,
.btn-scan {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-cancel {
  background: #f3f4f6;
  color: #374151;
}

.btn-cancel:active {
  background: #e5e7eb;
}

.btn-scan {
  background: #3b82f6;
  color: white;
}

.btn-scan:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.btn-scan:not(:disabled):active {
  background: #2563eb;
}

/* Scanner Status */
.scanner-status {
  padding: 1rem;
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.status-message {
  text-align: center;
  color: white;
}

.status-message.error {
  color: #ef4444;
}

.status-message.loading {
  color: #3b82f6;
}

.status-message.success {
  color: #10b981;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid rgba(59, 130, 246, 0.3);
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 0.5rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.btn-retry {
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
}

.btn-retry:active {
  background: #2563eb;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  justify-content: space-around;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.8);
  padding-bottom: calc(1rem + env(safe-area-inset-bottom));
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: none;
  border-radius: 12px;
  min-width: 70px;
  transition: all 0.2s;
}

.action-btn:active {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(0.95);
}

.action-btn.active {
  background: #3b82f6;
  color: white;
}

.action-btn span {
  font-size: 0.75rem;
  font-weight: 500;
}

/* Responsive */
@media (max-width: 375px) {
  .scan-frame {
    width: 200px;
    height: 200px;
  }

  .corner-tl,
  .corner-tr,
  .corner-bl,
  .corner-br {
    width: 25px;
    height: 25px;
  }

  .action-btn {
    min-width: 60px;
    padding: 0.5rem;
  }

  .action-btn span {
    font-size: 0.6875rem;
  }
}
</style>
