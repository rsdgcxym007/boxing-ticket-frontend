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

    <!-- Scanner Status -->
    <div class="scanner-status">
      <div
        class="status-indicator"
        :class="{ active: isScanning, ready: scannerReady }"
      >
        <div class="status-dot"></div>
        <span>{{ scannerStatusText }}</span>
      </div>
    </div>

    <!-- HTML5 QR Scanner -->
    <div class="scanner-container">
      <div id="qr-reader" ref="qrReader" class="qr-scanner-wrapper"></div>
    </div>

    <!-- Action Buttons -->
    <div class="action-buttons">
      <button
        @click="toggleScanner"
        class="action-btn primary"
        :disabled="isLoading"
      >
        <Icon
          :icon="isScanning ? 'mdi:stop' : 'mdi:qrcode-scan'"
          class="text-xl"
        />
        <span>{{ isScanning ? "หยุดสแกน" : "เริ่มสแกน" }}</span>
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

    <!-- Manual Input Modal -->
    <div
      v-if="showManualInput"
      class="modal-overlay"
      @click="showManualInput = false"
    >
      <div class="manual-input-modal" @click.stop>
        <div class="modal-header">
          <h3>กรอก QR Code ด้วยมือ</h3>
          <button @click="showManualInput = false" class="close-btn">
            <Icon icon="mdi:close" class="text-xl" />
          </button>
        </div>

        <div class="modal-body">
          <textarea
            v-model="manualQRInput"
            placeholder="วาง QR Code ข้อมูลที่นี่..."
            class="qr-input"
            rows="4"
          ></textarea>

          <div class="modal-actions">
            <button @click="showManualInput = false" class="btn-secondary">
              ยกเลิก
            </button>
            <button
              @click="handleManualScan"
              class="btn-primary"
              :disabled="!manualQRInput.trim() || isScanning"
            >
              <Icon
                v-if="isScanning"
                icon="mdi:loading"
                class="animate-spin mr-2"
              />
              สแกน
            </button>
          </div>
        </div>
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
import { ref, onMounted, onUnmounted, nextTick, computed } from "vue";
import { Icon } from "@iconify/vue";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useQRScannerStore } from "@/stores/qrScanner";
import { useAuthStore } from "@/stores/auth";
import ScanResultModal from "@/components/Mobile/ScanResultModal.vue";
import ScanHistoryModal from "@/components/Mobile/ScanHistoryModal.vue";
import ErrorModal from "@/components/Mobile/ErrorModal.vue";

// Define page meta
definePageMeta({
  layout: "mobile",
  middleware: ["auth", "mobile-guest-only"],
});

// Composables
const qrStore = useQRScannerStore();
const authStore = useAuthStore();

// Refs
const qrReader = ref(null);

// State
const isScanning = ref(false);
const isLoading = ref(false);
const scannerReady = ref(false);
const showManualInput = ref(false);
const showScanResult = ref(false);
const showHistory = ref(false);
const showError = ref(false);

// Data
const manualQRInput = ref("");
const scanResult = ref(null);
const errorMessage = ref("");
const html5QrcodeScanner = ref(null);
const lastScannedCode = ref("");
const scanCooldown = ref(false);

// Computed
const scannerStatusText = computed(() => {
  if (isLoading.value) return "กำลังเตรียมกล้อง...";
  if (!scannerReady.value) return "กำลังโหลด Scanner...";
  if (isScanning.value) return "กำลังสแกน...";
  return "พร้อมสแกน QR Code";
});

// Check authentication when component mounts
onMounted(async () => {
  if (!authStore.isAuthenticated) {
    navigateTo("/mobile/login");
    return;
  }

  await nextTick();
  await initScanner();
});

// Methods
const initScanner = async () => {
  try {
    isLoading.value = true;
    console.log("🎥 Initializing HTML5 QR Scanner...");

    const config = {
      fps: 10, // Frames per second for scanning
      qrbox: {
        width: 250,
        height: 250,
      },
      aspectRatio: 1.0,
      disableFlip: false,
      videoConstraints: {
        facingMode: "environment", // Use back camera
      },
    };

    html5QrcodeScanner.value = new Html5QrcodeScanner(
      "qr-reader",
      config,
      false // verbose logging
    );

    html5QrcodeScanner.value.render(onScanSuccess, onScanFailure);

    scannerReady.value = true;
    isLoading.value = false;
    console.log("✅ HTML5 QR Scanner initialized successfully");
  } catch (error) {
    console.error("❌ Scanner initialization failed:", error);
    isLoading.value = false;
    showErrorMessage("ไม่สามารถเปิดกล้องได้: " + error.message);
  }
};

const onScanSuccess = async (decodedText, decodedResult) => {
  console.log("🔍 QR Code scanned:", decodedText);

  // Prevent duplicate scans
  if (scanCooldown.value || lastScannedCode.value === decodedText) {
    return;
  }

  // Set cooldown
  scanCooldown.value = true;
  lastScannedCode.value = decodedText;

  // Pause scanner temporarily
  if (html5QrcodeScanner.value) {
    html5QrcodeScanner.value.pause(true);
  }

  isScanning.value = true;

  try {
    // Play scan sound
    playWebAudioSound();

    await handleQRScan(decodedText);
  } catch (error) {
    console.error("QR processing error:", error);
    showErrorMessage("เกิดข้อผิดพลาดในการประมวลผล QR Code");
  } finally {
    isScanning.value = false;

    // Resume scanner after delay
    setTimeout(() => {
      if (html5QrcodeScanner.value) {
        html5QrcodeScanner.value.resume();
      }
      scanCooldown.value = false;
    }, 2000);
  }
};

const onScanFailure = (error) => {
  // This is called frequently during scanning, so we don't log it
  // console.log("Scan error:", error);
};

const toggleScanner = () => {
  if (isScanning.value) {
    stopScanner();
  } else {
    startScanner();
  }
};

const startScanner = () => {
  if (html5QrcodeScanner.value) {
    html5QrcodeScanner.value.resume();
    isScanning.value = true;
  }
};

const stopScanner = () => {
  if (html5QrcodeScanner.value) {
    html5QrcodeScanner.value.pause(true);
    isScanning.value = false;
  }
};

const handleQRScan = async (qrData) => {
  try {
    let processedQRData = qrData;

    // Check if QR code is a URL containing our endpoint
    if (qrData.includes("/api/v1/mobile/scanner/check-in/")) {
      const url = new URL(qrData);
      processedQRData = url.searchParams.get("qr") || qrData;
    }

    // Use the QR scanner store to process the scan
    const result = await qrStore.scanQRCode(processedQRData);

    if (result.success) {
      scanResult.value = result.data;
      showScanResult.value = true;

      // Vibrate on success (if supported)
      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
      }
    } else {
      showErrorMessage(result.message || "QR Code ไม่ถูกต้อง");
    }
  } catch (error) {
    console.error("API Error:", error);
    showErrorMessage("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
  }
};

const handleManualScan = async () => {
  if (!manualQRInput.value.trim()) return;

  isScanning.value = true;

  try {
    await handleQRScan(manualQRInput.value.trim());
    showManualInput.value = false;
    manualQRInput.value = "";
  } catch (error) {
    console.error("Manual scan error:", error);
  } finally {
    isScanning.value = false;
  }
};

const playWebAudioSound = () => {
  try {
    // Create Web Audio API sound
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1);

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 0.2
    );

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
  } catch (error) {
    console.log("Audio not supported:", error);
  }
};

const showErrorMessage = (message) => {
  errorMessage.value = message;
  showError.value = true;
};

const closeScanResult = () => {
  showScanResult.value = false;
  scanResult.value = null;
};

const closeError = () => {
  showError.value = false;
  errorMessage.value = "";
};

const scanNext = () => {
  closeScanResult();
  startScanner();
};

const retryScan = () => {
  closeError();
  startScanner();
};

// Health check for scanner
const performHealthCheck = () => {
  if (!html5QrcodeScanner.value) {
    console.warn("⚠️ Scanner health check: Scanner not initialized");
    return;
  }
  console.log("✅ Scanner health check: OK");
};

// Cleanup
onUnmounted(() => {
  if (html5QrcodeScanner.value) {
    html5QrcodeScanner.value.clear();
  }
});

// Periodic health check
onMounted(() => {
  const healthCheckInterval = setInterval(performHealthCheck, 10000);

  onUnmounted(() => {
    clearInterval(healthCheckInterval);
  });
});
</script>

<style scoped>
/* Scanner Page */
.scanner-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
}

/* Header */
.scanner-header {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding: 1rem;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.back-button,
.history-button {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-button:hover,
.history-button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.header-title {
  color: white;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

/* Scanner Status */
.scanner-status {
  padding: 1rem;
  text-align: center;
}

.status-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: white;
  font-weight: 500;
}

.status-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #fbbf24;
  animation: pulse 2s infinite;
}

.status-indicator.ready .status-dot {
  background: #10b981;
}

.status-indicator.active .status-dot {
  background: #3b82f6;
  animation: blink 1s infinite;
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

@keyframes blink {
  0%,
  50% {
    opacity: 1;
  }
  51%,
  100% {
    opacity: 0.3;
  }
}

/* Scanner Container */
.scanner-container {
  flex: 1;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.qr-scanner-wrapper {
  width: 100%;
  max-width: 400px;
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

/* Action Buttons */
.action-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  padding: 1rem;
  flex-wrap: wrap;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 12px;
  padding: 1rem;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 80px;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.action-btn.primary {
  background: rgba(59, 130, 246, 0.8);
  min-width: 120px;
}

.action-btn.primary:hover {
  background: rgba(59, 130, 246, 0.9);
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.action-btn span {
  font-size: 0.875rem;
  font-weight: 500;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.manual-input-modal {
  background: white;
  border-radius: 15px;
  width: 100%;
  max-width: 400px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;
  padding: 0.25rem;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #e5e7eb;
  color: #374151;
}

.modal-body {
  padding: 1rem;
}

.qr-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-family: "Courier New", monospace;
  font-size: 0.875rem;
  resize: vertical;
  min-height: 80px;
  margin-bottom: 1rem;
}

.qr-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.modal-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.btn-primary {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
}

.btn-primary:hover {
  background: #2563eb;
}

.btn-primary:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.btn-secondary {
  background: #e5e7eb;
  color: #374151;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: #d1d5db;
}
</style>
