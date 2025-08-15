<template>
  <Teleport to="body">
    <div
      v-if="isVisible"
      class="confirm-overlay muay-thai-modal"
      @click="handleOverlayClick"
    >
      <!-- Modal Background -->
      <div class="modal-background">
        <div class="confirm-effects">
          <div class="warning-pulses"></div>
          <div class="decision-rays"></div>
        </div>
      </div>

      <!-- Modal Content -->
      <div class="confirm-modal" @click.stop>
        <!-- Modal Header -->
        <header class="modal-header">
          <div class="warning-indicator">
            <Icon icon="mdi:alert-circle" class="warning-icon" />
            <div class="warning-glow"></div>
          </div>

          <h2 class="modal-title combat-text">{{ title }}</h2>
        </header>

        <!-- Modal Body -->
        <div class="modal-body">
          <p class="modal-message">{{ message }}</p>

          <div v-if="details && details.length > 0" class="message-details">
            <ul class="details-list">
              <li v-for="detail in details" :key="detail" class="detail-item">
                <Icon icon="mdi:circle-small" class="detail-icon" />
                <span>{{ detail }}</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Modal Actions -->
        <footer class="modal-actions">
          <button
            class="action-btn cancel-btn combat-btn"
            @click="handleCancel"
          >
            <Icon icon="mdi:close" class="btn-icon" />
            <span class="combat-text">CANCEL</span>
          </button>

          <button
            class="action-btn confirm-btn combat-btn"
            :class="confirmType"
            @click="handleConfirm"
          >
            <Icon :icon="confirmIcon" class="btn-icon" />
            <span class="combat-text">{{ confirmText }}</span>
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
  title: {
    type: String,
    default: "Confirm Action",
  },
  message: {
    type: String,
    required: true,
  },
  details: {
    type: Array,
    default: () => [],
  },
  confirmText: {
    type: String,
    default: "CONFIRM",
  },
  cancelText: {
    type: String,
    default: "CANCEL",
  },
  confirmType: {
    type: String,
    default: "danger", // 'danger', 'warning', 'primary'
    validator: (value) => ["danger", "warning", "primary"].includes(value),
  },
  closeOnOverlay: {
    type: Boolean,
    default: true,
  },
});

// Emits
const emit = defineEmits(["confirm", "cancel"]);

// Computed
const isVisible = computed(() => true); // Controlled by parent v-if

const confirmIcon = computed(() => {
  switch (props.confirmType) {
    case "danger":
      return "mdi:delete";
    case "warning":
      return "mdi:alert";
    case "primary":
      return "mdi:check";
    default:
      return "mdi:check";
  }
});

// Methods
const handleConfirm = () => {
  emit("confirm");
};

const handleCancel = () => {
  emit("cancel");
};

const handleOverlayClick = () => {
  if (props.closeOnOverlay) {
    handleCancel();
  }
};
</script>

<style scoped>
@import url("/assets/css/muay-thai-theme.css");

/* Modal Overlay */
.confirm-overlay {
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
  animation: overlayFadeIn 0.3s ease-out;
}

@keyframes overlayFadeIn {
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
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.confirm-effects {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.warning-pulses {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(
    circle at 50% 50%,
    rgba(225, 6, 0, 0.1) 0%,
    transparent 60%
  );
  animation: warningPulse 2s ease-in-out infinite;
}

@keyframes warningPulse {
  0%,
  100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.05);
  }
}

.decision-rays {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
      45deg,
      transparent 49%,
      rgba(255, 215, 0, 0.05) 50%,
      transparent 51%
    ),
    linear-gradient(
      -45deg,
      transparent 49%,
      rgba(225, 6, 0, 0.05) 50%,
      transparent 51%
    );
  background-size: 40px 40px;
  animation: raysSweep 4s linear infinite;
}

@keyframes raysSweep {
  0% {
    transform: translateX(-40px) translateY(-40px);
  }
  100% {
    transform: translateX(40px) translateY(40px);
  }
}

/* Modal Content */
.confirm-modal {
  position: relative;
  background: linear-gradient(
    145deg,
    rgba(13, 13, 13, 0.95) 0%,
    rgba(26, 26, 26, 0.95) 100%
  );
  border: 2px solid var(--primary-red);
  border-radius: 20px;
  max-width: 450px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(225, 6, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  animation: modalSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Modal Header */
.modal-header {
  text-align: center;
  padding: 2rem 2rem 1rem;
  position: relative;
}

.warning-indicator {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  margin-bottom: 1rem;
}

.warning-icon {
  font-size: 3rem;
  color: var(--primary-red);
  z-index: 2;
  animation: warningBounce 1s ease-in-out infinite;
}

@keyframes warningBounce {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.warning-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(
    circle,
    rgba(225, 6, 0, 0.4) 0%,
    rgba(225, 6, 0, 0.2) 50%,
    transparent 70%
  );
  border-radius: 50%;
  animation: glowPulse 2s ease-in-out infinite;
}

@keyframes glowPulse {
  0%,
  100% {
    transform: scale(0.8);
    opacity: 0.6;
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
  }
}

.modal-title {
  font-size: 1.5rem;
  color: var(--primary-red);
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

/* Modal Body */
.modal-body {
  padding: 0 2rem 1rem;
  text-align: center;
}

.modal-message {
  font-size: 1.1rem;
  color: var(--text-light);
  line-height: 1.6;
  margin: 0 0 1rem 0;
}

.message-details {
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 12px;
  padding: 1rem;
  margin-top: 1rem;
}

.details-list {
  list-style: none;
  padding: 0;
  margin: 0;
  text-align: left;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-muted);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.detail-item:last-child {
  margin-bottom: 0;
}

.detail-icon {
  font-size: 1rem;
  color: var(--primary-gold);
  flex-shrink: 0;
}

/* Modal Actions */
.modal-actions {
  display: flex;
  gap: 1rem;
  padding: 1.5rem 2rem 2rem;
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
  cursor: pointer;
}

.cancel-btn {
  background: rgba(0, 0, 0, 0.6);
  border-color: rgba(255, 255, 255, 0.3);
  color: var(--text-light);
}

.cancel-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: var(--primary-gold);
  transform: translateY(-2px);
}

.confirm-btn {
  color: white;
  position: relative;
  overflow: hidden;
}

.confirm-btn::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.2) 50%,
    transparent 100%
  );
  transition: left 0.5s ease;
}

.confirm-btn:hover::before {
  left: 100%;
}

/* Confirm Button Types */
.confirm-btn.danger {
  background: linear-gradient(135deg, var(--primary-red) 0%, #b91c1c 100%);
  border-color: #dc2626;
}

.confirm-btn.danger:hover {
  background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(225, 6, 0, 0.4);
}

.confirm-btn.warning {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  border-color: #f59e0b;
}

.confirm-btn.warning:hover {
  background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(245, 158, 11, 0.4);
}

.confirm-btn.primary {
  background: linear-gradient(135deg, var(--primary-gold) 0%, #d4af37 100%);
  border-color: var(--primary-gold);
  color: var(--dark-bg);
}

.confirm-btn.primary:hover {
  background: linear-gradient(135deg, #d4af37 0%, #b8860b 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 215, 0, 0.4);
}

.btn-icon {
  font-size: 1.2rem;
}

/* Responsive Design */
@media (max-width: 480px) {
  .confirm-modal {
    margin: 1rem;
    border-radius: 16px;
  }

  .modal-header {
    padding: 1.5rem 1.5rem 1rem;
  }

  .modal-body {
    padding: 0 1.5rem 1rem;
  }

  .modal-actions {
    padding: 1rem 1.5rem 1.5rem;
    flex-direction: column;
    gap: 0.75rem;
  }

  .modal-title {
    font-size: 1.3rem;
  }

  .modal-message {
    font-size: 1rem;
  }

  .action-btn {
    padding: 0.875rem 1rem;
  }
}

@media (max-width: 375px) {
  .warning-indicator {
    width: 56px;
    height: 56px;
  }

  .warning-icon {
    font-size: 2.5rem;
  }

  .modal-title {
    font-size: 1.2rem;
  }
}
</style>
