<template>
  <div class="realtime-seat-map">
    <!-- Connection Status -->
    <div class="connection-status mb-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <div
            :class="[
              'w-3 h-3 rounded-full',
              connectionStatus.connected
                ? 'bg-green-500 animate-pulse'
                : 'bg-red-500',
            ]"
          />
          <span class="text-sm text-gray-600">
            {{
              connectionStatus.connected ? "เชื่อมต่อแล้ว" : "ไม่ได้เชื่อมต่อ"
            }}
          </span>
        </div>

        <!-- Live Activity Indicator -->
        <div
          v-if="liveSelections.length > 0"
          class="flex items-center space-x-2"
        >
          <Icon name="heroicons:eye" class="w-4 h-4 text-orange-500" />
          <span class="text-sm text-orange-600">
            {{ liveSelections.length }} คนกำลังเลือกที่นั่ง
          </span>
        </div>
      </div>
    </div>

    <!-- Stage Area -->
    <div class="stage-area mb-6">
      <div class="stage-indicator">
        <Icon name="heroicons:tv" class="w-6 h-6 text-gray-600 mr-2" />
        เวทีมวย (BOXING RING)
      </div>
    </div>

    <!-- Seat Legend -->
    <div class="seat-legend mb-6">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="flex items-center space-x-2">
          <div class="seat-sample seat-available" />
          <span class="text-sm">ว่าง</span>
        </div>
        <div class="flex items-center space-x-2">
          <div class="seat-sample seat-selected" />
          <span class="text-sm">เลือกแล้ว</span>
        </div>
        <div class="flex items-center space-x-2">
          <div class="seat-sample seat-occupied" />
          <span class="text-sm">ไม่ว่าง</span>
        </div>
        <div class="flex items-center space-x-2">
          <div class="seat-sample seat-live-selection" />
          <span class="text-sm">กำลังเลือก</span>
        </div>
      </div>
    </div>

    <!-- Seat Grid -->
    <div class="seat-grid">
      <div v-for="(row, rowIndex) in seatGrid" :key="rowIndex" class="seat-row">
        <div class="row-label">{{ getRowLabel(rowIndex) }}</div>
        <div class="seats">
          <div
            v-for="(seat, seatIndex) in row"
            :key="`${rowIndex}-${seatIndex}`"
            :class="[
              'seat',
              getSeatClass(seat),
              { 'seat-disabled': !seat || seat.status === 'disabled' },
            ]"
            :style="getSeatStyle(seat)"
            @click="selectSeat(seat)"
            @mouseenter="showSeatTooltip(seat, $event)"
            @mouseleave="hideSeatTooltip"
          >
            <span v-if="seat" class="seat-number">{{ seat.number }}</span>

            <!-- Live Selection Indicator -->
            <div
              v-if="seat && isSeatLiveSelected(seat.id)"
              class="live-indicator"
            >
              <Icon name="heroicons:user" class="w-3 h-3" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Zone Selector -->
    <div class="zone-selector mt-6">
      <h3 class="text-lg font-semibold mb-3">เลือกโซน</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button
          v-for="zone in availableZones"
          :key="zone.id"
          :class="[
            'zone-button',
            selectedZone === zone.id ? 'zone-active' : 'zone-inactive',
          ]"
          @click="changeZone(zone.id)"
        >
          <div class="zone-info">
            <div class="zone-name">{{ zone.name }}</div>
            <div class="zone-price">฿{{ zone.price.toLocaleString() }}</div>
            <div class="zone-available">
              {{ zone.available }}/{{ zone.total }} ที่
            </div>
          </div>
        </button>
      </div>
    </div>

    <!-- Selection Summary -->
    <div v-if="selectedSeats.length > 0" class="selection-summary">
      <div class="summary-header">
        <h4 class="font-semibold">
          ที่นั่งที่เลือก ({{ selectedSeats.length }} ที่)
        </h4>
        <button
          @click="clearSelection"
          class="text-sm text-red-600 hover:underline"
        >
          ล้างทั้งหมด
        </button>
      </div>

      <div class="selected-seats">
        <div
          v-for="seat in selectedSeats"
          :key="seat.id"
          class="selected-seat-item"
        >
          <div class="seat-details">
            <span class="seat-id">{{ seat.id }}</span>
            <span class="seat-zone">{{ seat.zone }}</span>
          </div>
          <div class="seat-price">฿{{ seat.price.toLocaleString() }}</div>
          <button @click="removeSeat(seat.id)" class="remove-seat">
            <Icon name="heroicons:x-mark" class="w-4 h-4" />
          </button>
        </div>
      </div>

      <div class="summary-total">
        <div class="total-price">รวม: ฿{{ totalPrice.toLocaleString() }}</div>
        <button @click="proceedToBooking" class="proceed-button">
          จองที่นั่ง
        </button>
      </div>
    </div>

    <!-- Live Activity Feed -->
    <div
      v-if="showActivityFeed && liveActivities.length > 0"
      class="activity-feed"
    >
      <h4 class="font-semibold mb-2">กิจกรรมล่าสุด</h4>
      <div class="activities">
        <div
          v-for="activity in liveActivities.slice(0, 5)"
          :key="activity.id"
          class="activity-item"
        >
          <Icon name="heroicons:user" class="w-4 h-4 text-blue-500" />
          <span class="activity-text">
            มีคนเลือกที่นั่ง {{ activity.seatId }}
          </span>
          <span class="activity-time">{{
            formatTime(activity.timestamp)
          }}</span>
        </div>
      </div>
    </div>

    <!-- Seat Tooltip -->
    <div
      v-if="tooltipSeat && showTooltip"
      ref="tooltip"
      class="seat-tooltip"
      :style="tooltipStyle"
    >
      <div class="tooltip-content">
        <div class="tooltip-seat-id">{{ tooltipSeat.id }}</div>
        <div class="tooltip-zone">{{ tooltipSeat.zone }}</div>
        <div class="tooltip-price">
          ฿{{ tooltipSeat.price?.toLocaleString() }}
        </div>
        <div
          v-if="tooltipSeat.status === 'occupied'"
          class="tooltip-status occupied"
        >
          ไม่ว่าง
        </div>
        <div
          v-else-if="isSeatLiveSelected(tooltipSeat.id)"
          class="tooltip-status live"
        >
          กำลังมีคนเลือก
        </div>
        <div v-else class="tooltip-status available">คลิกเพื่อเลือก</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import { navigateTo } from "nuxt/app";
import { useRealtime } from "~/composables/useRealtime";
import { useSeatApi } from "~/composables/useSeatApi";
import { useSingleToast } from "~/composables/useSingleToast";

interface Seat {
  id: string;
  number: string;
  zone: string;
  price: number;
  status: "available" | "occupied" | "disabled";
}

interface Zone {
  id: string;
  name: string;
  price: number;
  available: number;
  total: number;
}

interface Props {
  zoneId: string;
  showActivityFeed?: boolean;
  maxSelections?: number;
}

const props = withDefaults(defineProps<Props>(), {
  showActivityFeed: false,
  maxSelections: 8,
});

const emit = defineEmits([
  "seat-selected",
  "seat-deselected",
  "selection-changed",
]);

// Composables
const realtime = useRealtime();
const seatApi = useSeatApi();
const { showToast } = useSingleToast();

// State
const seatGrid = ref<Seat[][]>([]);
const selectedSeats = ref<Seat[]>([]);
const selectedZone = ref(props.zoneId);
const availableZones = ref<Zone[]>([]);
const liveActivities = ref<any[]>([]);
const tooltipSeat = ref<Seat | null>(null);
const showTooltip = ref(false);
const tooltipStyle = ref({});

// Computed
const connectionStatus = computed(() => realtime.connectionStatus.value);
const liveSelections = computed(() => realtime.liveSeatSelections.value);

const totalPrice = computed(() => {
  return selectedSeats.value.reduce((sum, seat) => sum + (seat.price || 0), 0);
});

/**
 * Seat management
 */
const loadSeats = async () => {
  try {
    const seatsData = await seatApi.getSeatsByZoneId(selectedZone.value);
    seatGrid.value = seatsData.seatGrid || [];
    availableZones.value = seatsData.zones || [];
  } catch (error) {
    showToast("error", "ไม่สามารถโหลดข้อมูลที่นั่งได้");
  }
};

const selectSeat = (seat: any) => {
  if (!seat || seat.status === "occupied" || seat.status === "disabled") return;

  // Check if seat is being selected by someone else
  if (isSeatLiveSelected(seat.id)) {
    showToast("warning", "มีคนกำลังเลือกที่นั่งนี้อยู่");
    return;
  }

  const isSelected = selectedSeats.value.find((s) => s.id === seat.id);

  if (isSelected) {
    // Deselect seat
    selectedSeats.value = selectedSeats.value.filter((s) => s.id !== seat.id);
    emit("seat-deselected", seat);

    // Emit to realtime
    realtime.emitSeatSelection({
      seatId: seat.id,
      userId: "current-user", // Replace with actual user ID
      zoneId: selectedZone.value,
      action: "deselect",
    });
  } else {
    // Check max selections
    if (selectedSeats.value.length >= props.maxSelections) {
      showToast("warning", `เลือกได้สูงสุด ${props.maxSelections} ที่นั่ง`);
      return;
    }

    // Select seat
    selectedSeats.value.push(seat);
    emit("seat-selected", seat);

    // Emit to realtime
    realtime.emitSeatSelection({
      seatId: seat.id,
      userId: "current-user", // Replace with actual user ID
      zoneId: selectedZone.value,
      action: "select",
    });
  }

  emit("selection-changed", selectedSeats.value);
};

const removeSeat = (seatId: string) => {
  const seat = selectedSeats.value.find((s) => s.id === seatId);
  if (seat) {
    selectSeat(seat);
  }
};

const clearSelection = () => {
  selectedSeats.value.forEach((seat) => {
    realtime.emitSeatSelection({
      seatId: seat.id,
      userId: "current-user",
      zoneId: selectedZone.value,
      action: "deselect",
    });
  });

  selectedSeats.value = [];
  emit("selection-changed", []);
};

/**
 * Zone management
 */
const changeZone = async (zoneId: string) => {
  if (selectedSeats.value.length > 0) {
    // Ask for confirmation
    const confirm = window.confirm(
      "การเปลี่ยนโซนจะล้างที่นั่งที่เลือกไว้ ดำเนินการต่อ?"
    );
    if (!confirm) return;

    clearSelection();
  }

  // Leave current zone
  realtime.leaveZoneRoom(selectedZone.value);

  selectedZone.value = zoneId;

  // Join new zone
  realtime.joinZoneRoom(zoneId);

  await loadSeats();
};

/**
 * Seat styling and interaction
 */
const getSeatClass = (seat: any) => {
  if (!seat) return "seat-empty";

  const isSelected = selectedSeats.value.find((s) => s.id === seat.id);
  const isLiveSelected = isSeatLiveSelected(seat.id);

  if (seat.status === "occupied") return "seat-occupied";
  if (isSelected) return "seat-selected";
  if (isLiveSelected) return "seat-live-selection";
  return "seat-available";
};

const getSeatStyle = (seat: any) => {
  if (!seat) return {};

  // Add any dynamic styling here
  return {};
};

const isSeatLiveSelected = (seatId: string) => {
  return liveSelections.value.some((selection) => selection.seatId === seatId);
};

const getRowLabel = (rowIndex: number) => {
  return String.fromCharCode(65 + rowIndex); // A, B, C, etc.
};

/**
 * Tooltip management
 */
const showSeatTooltip = (seat: any, event: MouseEvent) => {
  if (!seat) return;

  tooltipSeat.value = seat;
  showTooltip.value = true;

  // Position tooltip
  const rect = (event.target as HTMLElement).getBoundingClientRect();
  tooltipStyle.value = {
    position: "fixed",
    left: `${rect.left + rect.width / 2}px`,
    top: `${rect.top - 10}px`,
    transform: "translate(-50%, -100%)",
    zIndex: 9999,
  };
};

const hideSeatTooltip = () => {
  showTooltip.value = false;
  tooltipSeat.value = null;
};

/**
 * Booking flow
 */
const proceedToBooking = () => {
  if (selectedSeats.value.length === 0) return;

  // Navigate to booking page with selected seats
  navigateTo({
    path: "/booking/confirm",
    query: {
      seats: selectedSeats.value.map((s) => s.id).join(","),
      zone: selectedZone.value,
    },
  });
};

/**
 * Utility functions
 */
const formatTime = (timestamp: string) => {
  return new Date(timestamp).toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Realtime setup
 */
const setupRealtime = () => {
  realtime.connect();
  realtime.joinZoneRoom(selectedZone.value);
  realtime.requestLiveUpdates(selectedZone.value);
};

/**
 * Watch for zone changes
 */
watch(
  () => props.zoneId,
  (newZoneId) => {
    if (newZoneId !== selectedZone.value) {
      changeZone(newZoneId);
    }
  }
);

/**
 * Initialize
 */
onMounted(async () => {
  await loadSeats();
  setupRealtime();
});

onUnmounted(() => {
  realtime.leaveZoneRoom(selectedZone.value);
  clearSelection();
});
</script>

<style scoped>
.realtime-seat-map {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

.stage-area {
  text-align: center;
}

.stage-indicator {
  display: inline-flex;
  align-items: center;
  padding: 1rem 2rem;
  background: linear-gradient(45deg, #f59e0b, #d97706);
  color: white;
  border-radius: 0.5rem;
  font-weight: 600;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.seat-legend {
  background: white;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.seat-sample {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 0.25rem;
  border: 2px solid transparent;
}

.seat-grid {
  background: white;
  padding: 2rem;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
}

.seat-row {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}

.row-label {
  width: 2rem;
  text-align: center;
  font-weight: 600;
  color: #6b7280;
}

.seats {
  display: flex;
  gap: 0.25rem;
  flex: 1;
  justify-content: center;
}

.seat {
  position: relative;
  width: 2rem;
  height: 2rem;
  border-radius: 0.25rem;
  border: 2px solid transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.75rem;
  font-weight: 500;
}

.seat-empty {
  visibility: hidden;
}

.seat-available {
  background: #e5e7eb;
  border-color: #d1d5db;
  color: #374151;
}

.seat-available:hover {
  background: #d1d5db;
  transform: scale(1.1);
}

.seat-selected {
  background: #3b82f6;
  border-color: #2563eb;
  color: white;
}

.seat-occupied {
  background: #ef4444;
  border-color: #dc2626;
  color: white;
  cursor: not-allowed;
}

.seat-live-selection {
  background: #f59e0b;
  border-color: #d97706;
  color: white;
  animation: pulse 2s infinite;
}

.seat-disabled {
  opacity: 0.3;
  pointer-events: none;
}

.live-indicator {
  position: absolute;
  top: -0.25rem;
  right: -0.25rem;
  background: #f59e0b;
  border-radius: 50%;
  width: 1rem;
  height: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.zone-selector {
  background: white;
  padding: 1.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.zone-button {
  padding: 1rem;
  border-radius: 0.5rem;
  transition: all 0.2s;
  text-align: left;
  width: 100%;
}

.zone-active {
  background: #3b82f6;
  color: white;
}

.zone-inactive {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #e5e7eb;
}

.zone-inactive:hover {
  background: #e5e7eb;
}

.zone-name {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.zone-price {
  font-size: 0.875rem;
  opacity: 0.8;
}

.zone-available {
  font-size: 0.75rem;
  opacity: 0.7;
}

.selection-summary {
  background: white;
  padding: 1.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 2px solid #3b82f6;
}

.summary-header {
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: 1rem;
}

.selected-seats {
  margin-bottom: 1rem;
}

.selected-seat-item {
  display: flex;
  align-items: center;
  justify-content: between;
  padding: 0.5rem;
  background: #f8fafc;
  border-radius: 0.375rem;
  margin-bottom: 0.5rem;
}

.seat-details {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.seat-id {
  font-weight: 600;
  color: #1f2937;
}

.seat-zone {
  font-size: 0.875rem;
  color: #6b7280;
}

.remove-seat {
  color: #ef4444;
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: background-color 0.2s;
}

.remove-seat:hover {
  background: #fee2e2;
}

.summary-total {
  display: flex;
  justify-content: between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.total-price {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
}

.proceed-button {
  background: #10b981;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: background-color 0.2s;
}

.proceed-button:hover {
  background: #059669;
}

.activity-feed {
  background: white;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-top: 1rem;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f3f4f6;
  font-size: 0.875rem;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-text {
  flex: 1;
  color: #374151;
}

.activity-time {
  color: #9ca3af;
  font-size: 0.75rem;
}

.seat-tooltip {
  background: #1f2937;
  color: white;
  padding: 0.75rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  pointer-events: none;
  font-size: 0.875rem;
}

.tooltip-content {
  text-align: center;
}

.tooltip-seat-id {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.tooltip-zone,
.tooltip-price {
  margin-bottom: 0.25rem;
}

.tooltip-status {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  margin-top: 0.5rem;
}

.tooltip-status.available {
  background: #10b981;
}

.tooltip-status.occupied {
  background: #ef4444;
}

.tooltip-status.live {
  background: #f59e0b;
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
