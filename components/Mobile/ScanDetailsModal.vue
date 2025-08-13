<template>
  <Teleport to="body">
    <div
      v-if="isVisible"
      class="scan-details-overlay muay-thai-modal"
      @click="closeModal"
    >
      <!-- Modal Background -->
      <div class="modal-background">
        <div class="details-effects">
          <div class="scan-rays"></div>
          <div class="data-particles"></div>
        </div>
      </div>

      <!-- Modal Content -->
      <div class="scan-details-modal" @click.stop>
        <!-- Modal Header -->
        <header class="modal-header">
          <div class="scan-status-banner" :class="scan?.result">
            <Icon
              :icon="
                scan?.result === 'success'
                  ? 'mdi:check-circle'
                  : 'mdi:alert-circle'
              "
              class="status-icon"
            />
            <span class="status-text combat-text">
              {{
                scan?.result === "success" ? "SUCCESSFUL SCAN" : "FAILED SCAN"
              }}
            </span>
          </div>

          <button class="close-btn combat-btn" @click="closeModal">
            <Icon icon="mdi:close" class="close-icon" />
          </button>
        </header>

        <!-- Scan Information -->
        <div class="scan-details-content">
          <!-- Basic Info Section -->
          <section class="info-section">
            <div class="section-header">
              <Icon icon="mdi:information" class="section-icon" />
              <h2 class="section-title combat-text">SCAN DETAILS</h2>
            </div>

            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">Scan ID</div>
                <div class="info-value">{{ scan?.id || "N/A" }}</div>
              </div>

              <div class="info-item">
                <div class="info-label">Timestamp</div>
                <div class="info-value">
                  {{ formatDateTime(scan?.timestamp) }}
                </div>
              </div>

              <div class="info-item">
                <div class="info-label">Location</div>
                <div class="info-value">{{ scan?.location || "Unknown" }}</div>
              </div>

              <div class="info-item">
                <div class="info-label">Device ID</div>
                <div class="info-value">{{ scan?.deviceId || "N/A" }}</div>
              </div>
            </div>
          </section>

          <!-- Customer Section -->
          <section
            v-if="scan?.customerName || scan?.orderId"
            class="customer-section"
          >
            <div class="section-header">
              <Icon icon="mdi:account" class="section-icon" />
              <h2 class="section-title combat-text">FIGHTER INFO</h2>
            </div>

            <div class="customer-card">
              <div class="customer-avatar">
                <Icon icon="mdi:account-circle" class="avatar-icon" />
              </div>

              <div class="customer-details">
                <h3 class="customer-name">
                  {{ scan?.customerName || "Unknown Fighter" }}
                </h3>
                <div class="customer-info">
                  <div class="customer-item" v-if="scan?.orderId">
                    <Icon icon="mdi:ticket" class="customer-icon" />
                    <span>Order: {{ scan?.orderId }}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- QR Data Section -->
          <section class="qr-section">
            <div class="section-header">
              <Icon icon="mdi:qrcode" class="section-icon" />
              <h2 class="section-title combat-text">QR CODE DATA</h2>
            </div>

            <div class="qr-data-container">
              <div class="qr-preview">
                <Icon icon="mdi:qrcode-scan" class="qr-icon" />
              </div>

              <div class="qr-content">
                <div class="qr-text">
                  {{ scan?.qrData || "No QR data available" }}
                </div>
                <button
                  v-if="scan?.qrData"
                  class="copy-btn combat-btn"
                  @click="copyQRData"
                >
                  <Icon icon="mdi:content-copy" class="copy-icon" />
                  <span>{{ copied ? "COPIED!" : "COPY" }}</span>
                </button>
              </div>
            </div>
          </section>

          <!-- Error Section (if failed) -->
          <section
            v-if="scan?.result === 'failed' && scan?.error"
            class="error-section"
          >
            <div class="section-header">
              <Icon icon="mdi:alert" class="section-icon" />
              <h2 class="section-title combat-text">ERROR DETAILS</h2>
            </div>

            <div class="error-card">
              <div class="error-icon-wrapper">
                <Icon icon="mdi:alert-circle" class="error-icon" />
              </div>

              <div class="error-details">
                <h3 class="error-title">Scan Failed</h3>
                <p class="error-message">{{ scan?.error }}</p>

                <div class="error-suggestions">
                  <h4 class="suggestions-title">Possible Solutions:</h4>
                  <ul class="suggestions-list">
                    <li>Ensure QR code is clearly visible and not damaged</li>
                    <li>Check if the ticket is still valid</li>
                    <li>Verify network connection</li>
                    <li>Try scanning again with better lighting</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <!-- Technical Details -->
          <section class="technical-section">
            <div class="section-header">
              <Icon icon="mdi:cog" class="section-icon" />
              <h2 class="section-title combat-text">TECHNICAL DATA</h2>
            </div>

            <div class="technical-grid">
              <div class="tech-item">
                <div class="tech-label">Scan Result</div>
                <div class="tech-value" :class="scan?.result">
                  {{ scan?.result?.toUpperCase() || "UNKNOWN" }}
                </div>
              </div>

              <div class="tech-item">
                <div class="tech-label">Staff ID</div>
                <div class="tech-value">{{ scan?.staffId || "N/A" }}</div>
              </div>

              <div class="tech-item">
                <div class="tech-label">Staff Name</div>
                <div class="tech-value">{{ scan?.staffName || "Unknown" }}</div>
              </div>

              <div class="tech-item">
                <div class="tech-label">Scan Duration</div>
                <div class="tech-value">{{ calculateScanDuration() }}ms</div>
              </div>
            </div>
          </section>
        </div>

        <!-- Modal Actions -->
        <footer class="modal-actions">
          <button
            v-if="scan?.result === 'failed'"
            class="action-btn retry-action combat-btn"
            @click="retryScan"
          >
            <Icon icon="mdi:refresh" class="btn-icon" />
            <span class="combat-text">RETRY SCAN</span>
          </button>

          <button
            class="action-btn export-action combat-btn"
            @click="exportScanData"
          >
            <Icon icon="mdi:download" class="btn-icon" />
            <span class="combat-text">EXPORT DATA</span>
          </button>

          <button
            class="action-btn close-action combat-btn"
            @click="closeModal"
          >
            <Icon icon="mdi:close-circle" class="btn-icon" />
            <span class="combat-text">CLOSE</span>
          </button>
        </footer>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed } from "vue";
import { Icon } from "@iconify/vue";

// Props
const props = defineProps({
  scan: {
    type: Object,
    default: null,
  },
});

// Emits
const emit = defineEmits(["close", "retry"]);

// State
const copied = ref(false);

// Computed
const isVisible = computed(() => !!props.scan);

// Methods
const closeModal = () => {
  emit("close");
};

const retryScan = () => {
  emit("retry", props.scan);
  closeModal();
};

const copyQRData = async () => {
  try {
    await navigator.clipboard.writeText(props.scan?.qrData || "");
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (error) {
    console.error("Failed to copy QR data:", error);
  }
};

const exportScanData = () => {
  try {
    const data = {
      ...props.scan,
      exportTimestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `scan-${props.scan?.id || Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Export failed:", error);
  }
};

const formatDateTime = (timestamp) => {
  if (!timestamp) return "N/A";

  try {
    const date = new Date(timestamp);
    return date.toLocaleString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  } catch {
    return "Invalid Date";
  }
};

const calculateScanDuration = () => {
  // Mock calculation - in real app, this would be stored
  return Math.floor(Math.random() * 1000) + 500;
};
</script>

<style scoped>
@import url("/assets/css/muay-thai-theme.css");

/* Modal Overlay */
.scan-details-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  animation: modalFadeIn 0.3s ease-out;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Modal Background */
.modal-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
}

.details-effects {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.scan-rays {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: conic-gradient(
    from 0deg at 50% 50%,
    transparent 0deg,
    rgba(225, 6, 0, 0.1) 45deg,
    transparent 90deg,
    rgba(255, 215, 0, 0.1) 135deg,
    transparent 180deg,
    rgba(225, 6, 0, 0.1) 225deg,
    transparent 270deg,
    rgba(255, 215, 0, 0.1) 315deg,
    transparent 360deg
  );
  animation: scanRays 8s linear infinite;
}

@keyframes scanRays {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.data-particles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: radial-gradient(
      circle at 20% 30%,
      rgba(255, 215, 0, 0.2) 0%,
      transparent 2%
    ),
    radial-gradient(circle at 80% 20%, rgba(225, 6, 0, 0.2) 0%, transparent 2%),
    radial-gradient(
      circle at 40% 70%,
      rgba(255, 215, 0, 0.2) 0%,
      transparent 2%
    ),
    radial-gradient(circle at 70% 80%, rgba(225, 6, 0, 0.2) 0%, transparent 2%);
  animation: dataFloat 6s ease-in-out infinite;
}

@keyframes dataFloat {
  0%,
  100% {
    opacity: 0.3;
    transform: translateY(0);
  }
  50% {
    opacity: 0.8;
    transform: translateY(-10px);
  }
}

/* Modal Content */
.scan-details-modal {
  position: relative;
  background: linear-gradient(
    145deg,
    rgba(10, 10, 10, 0.95) 0%,
    rgba(26, 26, 26, 0.95) 100%
  );
  border: 2px solid var(--primary-gold);
  border-radius: 20px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.8), 0 0 50px rgba(225, 6, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  animation: modalSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(50px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Modal Header */
.modal-header {
  position: relative;
  padding: 1.5rem 1.5rem 0;
  text-align: center;
}

.scan-status-banner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1rem;
  border: 2px solid;
}

.scan-status-banner.success {
  background: linear-gradient(
    135deg,
    rgba(34, 197, 94, 0.2) 0%,
    rgba(22, 163, 74, 0.2) 100%
  );
  border-color: #22c55e;
}

.scan-status-banner.failed {
  background: linear-gradient(
    135deg,
    rgba(239, 68, 68, 0.2) 0%,
    rgba(220, 38, 38, 0.2) 100%
  );
  border-color: var(--primary-red);
}

.status-icon {
  font-size: 1.8rem;
}

.scan-status-banner.success .status-icon {
  color: #22c55e;
  animation: successPulse 2s ease-in-out infinite;
}

.scan-status-banner.failed .status-icon {
  color: var(--primary-red);
  animation: errorShake 0.5s ease-in-out;
}

@keyframes successPulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
}

@keyframes errorShake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-3px);
  }
  75% {
    transform: translateX(3px);
  }
}

.status-text {
  font-size: 1.2rem;
}

.scan-status-banner.success .status-text {
  color: #22c55e;
}

.scan-status-banner.failed .status-text {
  color: var(--primary-red);
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 40px;
  height: 40px;
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: rgba(225, 6, 0, 0.8);
  border-color: var(--primary-gold);
  color: white;
}

/* Scan Details Content */
.scan-details-content {
  padding: 0 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Section Styles */
.section-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.section-icon {
  font-size: 1.3rem;
  color: var(--primary-red);
}

.section-title {
  font-size: 1rem;
  color: var(--primary-gold);
  margin: 0;
}

/* Info Section */
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.info-item {
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 8px;
  padding: 1rem;
}

.info-label {
  font-size: 0.8rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.5rem;
}

.info-value {
  font-size: 0.95rem;
  color: var(--text-light);
  font-weight: 600;
  word-break: break-all;
}

/* Customer Section */
.customer-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 12px;
  padding: 1rem;
}

.customer-avatar {
  flex-shrink: 0;
}

.avatar-icon {
  font-size: 3rem;
  color: var(--text-light);
}

.customer-name {
  font-size: 1.2rem;
  color: var(--primary-gold);
  margin: 0 0 0.5rem 0;
}

.customer-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.customer-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: var(--text-light);
}

.customer-icon {
  font-size: 1rem;
  color: var(--primary-red);
}

/* QR Section */
.qr-data-container {
  display: flex;
  gap: 1rem;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 12px;
  padding: 1rem;
}

.qr-preview {
  flex-shrink: 0;
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qr-icon {
  font-size: 2.5rem;
  color: var(--primary-gold);
}

.qr-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.qr-text {
  font-family: monospace;
  font-size: 0.85rem;
  color: var(--text-light);
  background: rgba(0, 0, 0, 0.7);
  border-radius: 6px;
  padding: 0.75rem;
  word-break: break-all;
  max-height: 100px;
  overflow-y: auto;
}

.copy-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--primary-gold);
  color: var(--dark-bg);
  border: none;
  border-radius: 6px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  align-self: flex-start;
}

.copy-btn:hover {
  background: var(--primary-red);
  color: white;
}

/* Error Section */
.error-card {
  display: flex;
  gap: 1rem;
  background: rgba(239, 68, 68, 0.1);
  border: 2px solid var(--primary-red);
  border-radius: 12px;
  padding: 1rem;
}

.error-icon-wrapper {
  flex-shrink: 0;
}

.error-icon {
  font-size: 2.5rem;
  color: var(--primary-red);
}

.error-title {
  font-size: 1.1rem;
  color: var(--primary-red);
  margin: 0 0 0.5rem 0;
}

.error-message {
  color: var(--text-light);
  margin: 0 0 1rem 0;
  font-size: 0.9rem;
}

.suggestions-title {
  font-size: 0.9rem;
  color: var(--primary-gold);
  margin: 0 0 0.5rem 0;
}

.suggestions-list {
  color: var(--text-muted);
  font-size: 0.85rem;
  margin: 0;
  padding-left: 1rem;
}

.suggestions-list li {
  margin-bottom: 0.25rem;
}

/* Technical Section */
.technical-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.tech-item {
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
}

.tech-label {
  font-size: 0.8rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.5rem;
}

.tech-value {
  font-size: 1rem;
  font-weight: 700;
  text-transform: uppercase;
}

.tech-value.success {
  color: #22c55e;
}

.tech-value.failed {
  color: var(--primary-red);
}

.tech-value:not(.success):not(.failed) {
  color: var(--primary-gold);
}

/* Modal Actions */
.modal-actions {
  padding: 1.5rem;
  display: flex;
  gap: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  border-radius: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.retry-action {
  background: linear-gradient(135deg, var(--primary-red) 0%, #b91c1c 100%);
  color: white;
}

.retry-action:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(225, 6, 0, 0.4);
}

.export-action {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
}

.export-action:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(59, 130, 246, 0.4);
}

.close-action {
  background: rgba(0, 0, 0, 0.5);
  border-color: rgba(255, 255, 255, 0.3);
  color: var(--text-light);
}

.close-action:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: var(--primary-gold);
}

.btn-icon {
  font-size: 1.2rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .scan-details-modal {
    margin: 0.5rem;
    border-radius: 16px;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .technical-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .qr-data-container {
    flex-direction: column;
    text-align: center;
  }

  .modal-actions {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .modal-header,
  .scan-details-content,
  .modal-actions {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .technical-grid {
    grid-template-columns: 1fr;
  }

  .customer-card {
    flex-direction: column;
    text-align: center;
  }
}
</style>
