<template>
  <Teleport to="body">
    <div
      v-if="isVisible"
      class="ticket-modal-overlay muay-thai-modal"
      @click="handleOverlayClick"
    >
      <!-- Modal Background -->
      <div class="modal-background">
        <div class="combat-effects">
          <div class="arena-lights"></div>
          <div class="victory-sparkles"></div>
        </div>
      </div>

      <!-- Modal Content -->
      <div class="ticket-modal" @click.stop>
        <!-- Modal Header -->
        <header class="modal-header">
          <div class="victory-banner" v-if="ticket?.isValid">
            <Icon icon="mdi:trophy" class="trophy-icon" />
            <span class="victory-text combat-text">VICTORY!</span>
            <Icon icon="mdi:trophy" class="trophy-icon" />
          </div>

          <div class="defeat-banner" v-else>
            <Icon icon="mdi:shield-alert" class="alert-icon" />
            <span class="defeat-text combat-text">INVALID TICKET</span>
            <Icon icon="mdi:shield-alert" class="alert-icon" />
          </div>

          <button class="close-btn combat-btn" @click="closeModal">
            <Icon icon="mdi:close" class="close-icon" />
          </button>
        </header>

        <!-- Ticket Information -->
        <div class="ticket-content">
          <!-- Event Details -->
          <section class="event-section">
            <div class="section-header">
              <Icon icon="mdi:fire" class="section-icon" />
              <h2 class="section-title combat-text">FIGHT EVENT</h2>
            </div>

            <div class="event-card">
              <div class="event-poster">
                <img
                  :src="ticket?.eventPoster || '/images/default-fight.jpg'"
                  :alt="ticket?.eventName"
                  class="poster-image"
                />
                <div class="poster-overlay">
                  <Icon icon="mdi:star" class="star-icon" />
                </div>
              </div>

              <div class="event-details">
                <h3 class="event-name combat-text">
                  {{ ticket?.eventName || "Muay Thai Championship" }}
                </h3>
                <div class="event-info">
                  <div class="info-item">
                    <Icon icon="mdi:calendar" class="info-icon" />
                    <span>{{ formatDate(ticket?.showDate) }}</span>
                  </div>
                  <div class="info-item">
                    <Icon icon="mdi:clock" class="info-icon" />
                    <span>{{ ticket?.showTime || "20:00" }}</span>
                  </div>
                  <div class="info-item">
                    <Icon icon="mdi:map-marker" class="info-icon" />
                    <span>{{ ticket?.venue || "Patong Arena" }}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Customer Information -->
          <section class="customer-section">
            <div class="section-header">
              <Icon icon="mdi:account-star" class="section-icon" />
              <h2 class="section-title combat-text">FIGHTER INFO</h2>
            </div>

            <div class="customer-card">
              <div class="customer-avatar">
                <Icon icon="mdi:account-circle" class="avatar-icon" />
                <div
                  class="status-ring"
                  :class="{ valid: ticket?.isValid }"
                ></div>
              </div>

              <div class="customer-details">
                <h3 class="customer-name combat-text">
                  {{ ticket?.customerName || "Unknown Fighter" }}
                </h3>
                <div class="customer-info">
                  <div class="info-item" v-if="ticket?.customerPhone">
                    <Icon icon="mdi:phone" class="info-icon" />
                    <span>{{ ticket?.customerPhone }}</span>
                  </div>
                  <div class="info-item">
                    <Icon icon="mdi:ticket" class="info-icon" />
                    <span>Order: {{ ticket?.orderId }}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Seat Information -->
          <section v-if="ticket?.seats?.length" class="seats-section">
            <div class="section-header">
              <Icon icon="mdi:seat" class="section-icon" />
              <h2 class="section-title combat-text">ARENA SEATS</h2>
            </div>

            <div class="seats-grid">
              <div v-for="seat in ticket.seats" :key="seat" class="seat-card">
                <div class="seat-icon-wrapper">
                  <Icon icon="mdi:seat-outline" class="seat-icon" />
                </div>
                <span class="seat-number combat-text">{{ seat }}</span>
              </div>
            </div>

            <div
              class="seat-type-badge"
              :class="ticket?.ticketType || 'seated'"
            >
              <Icon
                :icon="
                  ticket?.ticketType === 'standing'
                    ? 'mdi:human-handsup'
                    : 'mdi:seat'
                "
                class="type-icon"
              />
              <span class="combat-text">
                {{ ticket?.ticketType === "standing" ? "STANDING" : "SEATED" }}
              </span>
            </div>
          </section>

          <!-- Status Information -->
          <section class="status-section">
            <div class="section-header">
              <Icon icon="mdi:shield-check" class="section-icon" />
              <h2 class="section-title combat-text">BATTLE STATUS</h2>
            </div>

            <div
              class="status-card"
              :class="{ valid: ticket?.isValid, invalid: !ticket?.isValid }"
            >
              <div class="status-indicator">
                <Icon
                  :icon="
                    ticket?.isValid ? 'mdi:check-circle' : 'mdi:alert-circle'
                  "
                  class="status-icon"
                />
              </div>

              <div class="status-details">
                <h3 class="status-title combat-text">
                  {{ ticket?.isValid ? "TICKET VALID" : "TICKET INVALID" }}
                </h3>
                <p class="status-message">
                  {{ getStatusMessage() }}
                </p>

                <div class="status-info">
                  <div class="info-item" v-if="ticket?.checkInTime">
                    <Icon icon="mdi:clock-check" class="info-icon" />
                    <span
                      >Checked in: {{ formatTime(ticket?.checkInTime) }}</span
                    >
                  </div>
                  <div class="info-item" v-if="ticket?.validUntil">
                    <Icon icon="mdi:calendar-clock" class="info-icon" />
                    <span
                      >Valid until: {{ formatDate(ticket?.validUntil) }}</span
                    >
                  </div>
                  <div class="info-item" v-if="ticket?.amount">
                    <Icon icon="mdi:currency-thb" class="info-icon" />
                    <span>Amount: ฿{{ ticket?.amount }}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <!-- Modal Actions -->
        <footer class="modal-actions">
          <button
            v-if="ticket?.isValid && ticket?.attendanceStatus === 'PENDING'"
            class="action-btn primary-action combat-btn"
            @click="confirmCheckIn"
          >
            <Icon icon="mdi:check-bold" class="btn-icon" />
            <span class="combat-text">CONFIRM CHECK-IN</span>
          </button>

          <button
            class="action-btn secondary-action combat-btn"
            @click="scanNext"
          >
            <Icon icon="mdi:qrcode-scan" class="btn-icon" />
            <span class="combat-text">SCAN NEXT</span>
          </button>

          <button
            class="action-btn tertiary-action combat-btn"
            @click="closeModal"
          >
            <Icon icon="mdi:home" class="btn-icon" />
            <span class="combat-text">BACK TO ARENA</span>
          </button>
        </footer>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { Icon } from "@iconify/vue";

// Props
const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false,
  },
  ticket: {
    type: Object,
    default: null,
  },
});

// Emits
const emit = defineEmits(["close", "confirm-checkin", "scan-next"]);

// Methods
const closeModal = () => {
  emit("close");
};

const handleOverlayClick = () => {
  closeModal();
};

const confirmCheckIn = () => {
  emit("confirm-checkin", props.ticket);
};

const scanNext = () => {
  emit("scan-next");
};

const formatDate = (dateString) => {
  if (!dateString) return "TBA";

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
};

const formatTime = (timeString) => {
  if (!timeString) return "TBA";

  try {
    const date = new Date(timeString);
    return date.toLocaleTimeString("th-TH", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return timeString;
  }
};

const getStatusMessage = () => {
  if (!props.ticket) return "No ticket information";

  if (props.ticket.isValid) {
    if (props.ticket.attendanceStatus === "CHECKED_IN") {
      return "Fighter has already entered the arena!";
    } else {
      return "Ticket is valid and ready for battle entry!";
    }
  } else {
    return "This ticket cannot be used for arena entry.";
  }
};

// Add body scroll lock when modal is open
watch(
  () => props.isVisible,
  (isVisible) => {
    if (process.client) {
      if (isVisible) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    }
  }
);
</script>

<style scoped>
@import url("/assets/css/muay-thai-theme.css");

/* Modal Overlay */
.ticket-modal-overlay {
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
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.combat-effects {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.arena-lights {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(
      circle at 20% 20%,
      rgba(225, 6, 0, 0.1) 0%,
      transparent 40%
    ),
    radial-gradient(
      circle at 80% 80%,
      rgba(255, 215, 0, 0.1) 0%,
      transparent 40%
    );
  animation: lightsFlicker 4s ease-in-out infinite alternate;
}

@keyframes lightsFlicker {
  0%,
  100% {
    opacity: 0.5;
  }
  50% {
    opacity: 0.8;
  }
}

.victory-sparkles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: radial-gradient(
      circle at 10% 30%,
      rgba(255, 215, 0, 0.3) 0%,
      transparent 2%
    ),
    radial-gradient(
      circle at 90% 70%,
      rgba(255, 215, 0, 0.3) 0%,
      transparent 2%
    ),
    radial-gradient(
      circle at 50% 10%,
      rgba(255, 215, 0, 0.3) 0%,
      transparent 2%
    );
  animation: sparkle 2s ease-in-out infinite;
}

@keyframes sparkle {
  0%,
  100% {
    opacity: 0;
    transform: scale(0.8);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}

/* Modal Content */
.ticket-modal {
  position: relative;
  background: linear-gradient(
    145deg,
    rgba(10, 10, 10, 0.95) 0%,
    rgba(26, 26, 26, 0.95) 100%
  );
  border: 2px solid var(--primary-gold);
  border-radius: 20px;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(225, 6, 0, 0.3),
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

.victory-banner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  background: linear-gradient(
    135deg,
    rgba(34, 197, 94, 0.2) 0%,
    rgba(22, 163, 74, 0.2) 100%
  );
  border: 2px solid var(--primary-gold);
  border-radius: 12px;
  margin-bottom: 1rem;
}

.victory-text {
  font-size: 1.2rem;
  color: var(--primary-gold);
}

.trophy-icon {
  font-size: 1.5rem;
  color: var(--primary-gold);
  animation: trophyGlow 2s ease-in-out infinite alternate;
}

@keyframes trophyGlow {
  0% {
    filter: drop-shadow(0 0 5px rgba(255, 215, 0, 0.5));
  }
  100% {
    filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.8));
  }
}

.defeat-banner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  background: linear-gradient(
    135deg,
    rgba(239, 68, 68, 0.2) 0%,
    rgba(220, 38, 38, 0.2) 100%
  );
  border: 2px solid var(--primary-red);
  border-radius: 12px;
  margin-bottom: 1rem;
}

.defeat-text {
  font-size: 1.2rem;
  color: var(--primary-red);
}

.alert-icon {
  font-size: 1.5rem;
  color: var(--primary-red);
  animation: alertPulse 1s ease-in-out infinite;
}

@keyframes alertPulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
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

.close-icon {
  font-size: 1.2rem;
}

/* Ticket Content */
.ticket-content {
  padding: 0 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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

/* Event Section */
.event-card {
  display: flex;
  gap: 1rem;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 12px;
  padding: 1rem;
}

.event-poster {
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.poster-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.poster-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(225, 6, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.star-icon {
  font-size: 1.5rem;
  color: var(--primary-gold);
}

.event-details {
  flex: 1;
}

.event-name {
  font-size: 1.1rem;
  color: var(--primary-gold);
  margin: 0 0 0.5rem 0;
}

.event-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: var(--text-light);
}

.info-icon {
  font-size: 1rem;
  color: var(--primary-red);
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
  position: relative;
  flex-shrink: 0;
}

.avatar-icon {
  font-size: 3rem;
  color: var(--text-light);
}

.status-ring {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 20px;
  height: 20px;
  border: 3px solid var(--primary-red);
  border-radius: 50%;
  background: var(--primary-red);
}

.status-ring.valid {
  border-color: #22c55e;
  background: #22c55e;
}

.customer-name {
  font-size: 1.1rem;
  color: var(--primary-gold);
  margin: 0 0 0.5rem 0;
}

.customer-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

/* Seats Section */
.seats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.seat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  background: rgba(0, 0, 0, 0.7);
  border: 2px solid var(--primary-gold);
  border-radius: 8px;
  padding: 0.75rem;
}

.seat-icon-wrapper {
  width: 32px;
  height: 32px;
  background: var(--primary-red);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.seat-icon {
  font-size: 1.2rem;
  color: white;
}

.seat-number {
  font-size: 0.9rem;
  color: var(--primary-gold);
}

.seat-type-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--primary-red);
  border-radius: 20px;
  align-self: center;
}

.seat-type-badge.standing {
  background: var(--primary-gold);
  color: var(--dark-bg);
}

.type-icon {
  font-size: 1rem;
}

/* Status Section */
.status-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 12px;
  padding: 1rem;
}

.status-card.valid {
  border: 2px solid #22c55e;
  background: rgba(34, 197, 94, 0.1);
}

.status-card.invalid {
  border: 2px solid var(--primary-red);
  background: rgba(225, 6, 0, 0.1);
}

.status-indicator {
  flex-shrink: 0;
}

.status-icon {
  font-size: 2.5rem;
}

.status-card.valid .status-icon {
  color: #22c55e;
}

.status-card.invalid .status-icon {
  color: var(--primary-red);
}

.status-title {
  font-size: 1.1rem;
  margin: 0 0 0.5rem 0;
}

.status-card.valid .status-title {
  color: #22c55e;
}

.status-card.invalid .status-title {
  color: var(--primary-red);
}

.status-message {
  color: var(--text-light);
  margin: 0 0 0.75rem 0;
  font-size: 0.9rem;
}

.status-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

/* Modal Actions */
.modal-actions {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.action-btn {
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

.primary-action {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  color: white;
}

.primary-action:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(34, 197, 94, 0.4);
}

.secondary-action {
  background: linear-gradient(135deg, var(--primary-red) 0%, #b91c1c 100%);
  border-color: var(--primary-gold);
  color: white;
}

.secondary-action:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(225, 6, 0, 0.4);
}

.tertiary-action {
  background: rgba(0, 0, 0, 0.5);
  border-color: rgba(255, 255, 255, 0.3);
  color: var(--text-light);
}

.tertiary-action:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: var(--primary-gold);
}

.btn-icon {
  font-size: 1.2rem;
}

/* Responsive Design */
@media (max-width: 480px) {
  .ticket-modal {
    margin: 0.5rem;
    border-radius: 16px;
  }

  .modal-header,
  .ticket-content,
  .modal-actions {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .event-card {
    flex-direction: column;
    text-align: center;
  }

  .event-poster {
    align-self: center;
  }

  .seats-grid {
    grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
  }

  .modal-actions {
    gap: 0.75rem;
  }

  .action-btn {
    padding: 0.875rem;
  }
}
</style>
