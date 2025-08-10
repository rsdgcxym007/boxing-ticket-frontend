<template>
  <div
    class="flex flex-col items-center justify-center gap-1 relative"
    :style="{ width: size, height: 'auto', minHeight: size }"
  >
    <button
      class="w-8 h-8 relative transition-all duration-300 hover:scale-110 focus:outline-none rounded-lg flex items-center justify-center"
      @click="$emit('toggle', seat, isBooked || isLocked)"
      :disabled="isBooked || isLocked"
      :class="getSeatClasses()"
      style="position: relative"
    >
      <i
        :class="getSeatIcon()"
        class="text-lg transition-all duration-300"
        :style="{
          transform:
            zoneKey === 'left'
              ? 'rotate(0deg)'
              : zoneKey === 'right'
              ? 'rotate(180deg)'
              : zoneKey === 'front-ringside'
              ? 'rotate(180deg)'
              : 'rotate(0deg)',
        }"
      />
      <!-- เอฟเฟกต์ ripple สำหรับ selected -->
      <div
        v-if="isSelected && !isBooked && !isLocked"
        class="absolute inset-0 rounded-lg bg-blue-400/20 animate-pulse"
      ></div>
    </button>
    <span
      v-if="seat?.seatNumber"
      class="block w-8 text-xs font-bold text-center pointer-events-none select-none relative z-10 leading-tight py-0.5"
      :class="getSeatNumberClasses()"
      style="
        background: rgba(255, 255, 255, 0.9);
        border-radius: 0.25rem;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
      "
    >
      {{ seat?.seatNumber }}
    </span>
  </div>
</template>

<script setup>
import { computed, toRefs } from "vue";

const props = defineProps({
  seat: Object,
  selectedSeats: Array,
  bookedSeats: Array,
  status: String,
  zoneKey: { type: String, default: "" },
  size: { type: String, default: "2rem" },
  ownSeatIds: {
    type: Array,
    default: () => [],
  },
});

const { seat, selectedSeats } = toRefs(props);

const isBooked = computed(() => {
  const isOwnSeat = props.ownSeatIds.includes(seat.value?.id);
  const isStatusBlocked = ["BOOKED", "PAID", "PENDING", "RESERVED"].includes(
    seat.value?.bookingStatus
  );
  const isInBookedList = props.bookedSeats.some(
    (bookedSeat) => bookedSeat.id === seat.value?.id
  );
  const finalIsBooked = (isStatusBlocked || isInBookedList) && !isOwnSeat;
  return finalIsBooked;
});

const isLocked = computed(() => {
  const isOwnSeat = props.ownSeatIds.includes(seat.value?.id);
  const isMySelection = selectedSeats.value.some(
    (s) => s.id === seat.value?.id
  );
  if (isMySelection) {
    return false;
  }

  const isStatusLocked = props.status === "locked";
  const isBookingStatusLocked = ["SELECTED", "locked", "LOCKED"].includes(
    seat.value?.bookingStatus
  );

  let isLockedUntilValid = false;
  if (seat.value?.isLockedUntil) {
    const today = new Date();
    const lockDate = new Date(seat.value.isLockedUntil);
    const isSameDay = today.toDateString() === lockDate.toDateString();
    const isStillLocked = lockDate > today;
    isLockedUntilValid = isSameDay && isStillLocked;
  }

  return (
    (isStatusLocked || isBookingStatusLocked || isLockedUntilValid) &&
    !isOwnSeat
  );
});

const isSelected = computed(() => {
  // ตรวจสอบว่าเป็นที่นั่งของออเดอร์ปัจจุบันหรือไม่ (ต้องแสดงเป็นสีเขียวเสมอ)
  const isOwnSeat = props.ownSeatIds.includes(seat.value?.id);
  if (isOwnSeat) {
    return true;
  }

  // ตรวจสอบว่าอยู่ในรายการที่เลือกใหม่หรือไม่
  const isInSelectedList = selectedSeats.value.some(
    (s) => s.id === seat.value?.id
  );
  if (isInSelectedList) {
    return true;
  }

  return false;
});

// ฟังก์ชันสำหรับกำหนด CSS classes ของที่นั่ง
const getSeatClasses = () => {
  if (isBooked.value) {
    return "bg-gray-200 border-2 border-gray-300 text-gray-400 cursor-not-allowed shadow-inner";
  }
  if (isLocked.value) {
    return "bg-gradient-to-br from-amber-100 to-orange-200 border-2 border-amber-400 text-amber-600 cursor-not-allowed shadow-md";
  }
  if (isSelected.value) {
    // ตรวจสอบว่าเป็นที่นั่งของออเดอร์ปัจจุบันหรือไม่
    const isOwnSeat = props.ownSeatIds.includes(seat.value?.id);
    if (isOwnSeat) {
      // ที่นั่งของออเดอร์ปัจจุบัน - สีเขียว
      return "bg-gradient-to-br from-green-400 to-green-600 border-2 border-green-300 text-white shadow-lg ring-2 ring-green-300 ring-opacity-50";
    } else {
      // ที่นั่งที่เลือกใหม่ - สีน้ำเงิน
      return "bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-blue-300 text-white shadow-lg ring-2 ring-blue-300 ring-opacity-50";
    }
  }
  return "bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-300 text-slate-600 hover:from-slate-100 hover:to-slate-200 hover:border-slate-400 hover:shadow-md active:scale-95";
};

// ฟังก์ชันสำหรับกำหนด icon
const getSeatIcon = () => {
  if (isBooked.value) {
    return "mdi mdi-close-circle";
  }
  if (isLocked.value) {
    return "mdi mdi-lock";
  }
  if (isSelected.value) {
    return "mdi mdi-check-circle";
  }
  return "mdi mdi-seat";
};

// ฟังก์ชันสำหรับกำหนด CSS classes ของหมายเลขที่นั่ง
const getSeatNumberClasses = () => {
  if (isBooked.value) {
    return "text-gray-400 line-through opacity-60";
  }
  if (isLocked.value) {
    return "text-amber-600 font-extrabold";
  }
  if (isSelected.value) {
    // ตรวจสอบว่าเป็นที่นั่งของออเดอร์ปัจจุบันหรือไม่
    const isOwnSeat = props.ownSeatIds.includes(seat.value?.id);
    if (isOwnSeat) {
      // ที่นั่งของออเดอร์ปัจจุบัน - สีเขียว
      return "text-green-600 font-extrabold bg-white/80 px-1 rounded text-shadow";
    } else {
      // ที่นั่งที่เลือกใหม่ - สีน้ำเงิน
      return "text-blue-600 font-extrabold bg-white/80 px-1 rounded text-shadow";
    }
  }
  return "text-slate-700 font-semibold";
};
</script>

<style scoped>
button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.text-shadow {
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

/* เอฟเฟกต์สำหรับ hover state */
button:not(:disabled):hover {
  transform: scale(1.1);
}

button:not(:disabled):active {
  transform: scale(0.95);
}

/* เอฟเฟกต์สำหรับ selected state */
button.selected {
  animation: selectedPulse 2s infinite;
}

@keyframes selectedPulse {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4);
  }
  50% {
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
  }
}

/* เอฟเฟกต์สำหรับ locked state */
.locked-shake {
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-2px);
  }
  75% {
    transform: translateX(2px);
  }
}
</style>
