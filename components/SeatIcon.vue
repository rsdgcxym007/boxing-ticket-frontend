<template>
  <div
    class="flex flex-col items-center justify-center"
    :style="{ width: size, height: size }"
  >
    <button
      class="w-full h-full relative transition-transform duration-200 hover:scale-110 focus:outline-none"
      @click="$emit('toggle', seat, isBooked || isLocked)"
      :disabled="isBooked || isLocked"
    >
      <img
        :src="getSeatImage()"
        alt="seat icon"
        class="w-full h-full object-contain drop-shadow-md pointer-events-none"
        :class="{
          '-rotate-90': zoneKey === 'left',
          'rotate-90': zoneKey === 'right',
          'rotate-180': zoneKey === 'front-ringside',
          'seat-locked': isLocked && !isBooked,
        }"
      />
    </button>
    <span
      class="block mt-[-0.25rem] text-[0.55em] leading-tight font-semibold text-center"
      :class="{
        'text-gray-400 line-through': isBooked,
        'text-orange-600': isLocked && !isBooked,
        'text-blue-600': isSelected && !isBooked && !isLocked,
        'text-gray-800': !isSelected && !isBooked && !isLocked,
        'opacity-50': isBooked,
      }"
    >
      {{ seat?.seatNumber || "" }}
    </span>
  </div>
</template>

<script setup>
const props = defineProps({
  seat: Object,
  selectedSeats: Array,
  bookedSeats: Array,
  status: String, // เพิ่ม status prop
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

  // ลด log ให้แสดงเฉพาะที่นั่งที่มีการเปลี่ยนแปลง status
  const finalIsBooked = (isStatusBlocked || isInBookedList) && !isOwnSeat;

  return finalIsBooked;
});

const isLocked = computed(() => {
  const isOwnSeat = props.ownSeatIds.includes(seat.value?.id);

  // ✅ ถ้าเป็นที่นั่งที่เราเลือกอยู่ ให้อยู่ในสถานะเลือกได้ (ไม่ถูกล็อค)
  const isMySelection = selectedSeats.value.some(
    (s) => s.id === seat.value?.id
  );
  if (isMySelection) {
    return false; // ไม่ถูกล็อคเพราะเป็นที่นั่งที่เราเลือก
  }

  // ตรวจสอบจาก status property ที่ส่งมาจาก parent
  const isStatusLocked = props.status === "locked";

  // ตรวจสอบจาก bookingStatus
  const isBookingStatusLocked = ["SELECTED", "locked", "LOCKED"].includes(
    seat.value?.bookingStatus
  );

  // ✅ ตรวจสอบ isLockedUntil ว่าตรงกับวันที่ปัจจุบันหรือไม่
  let isLockedUntilValid = false;
  if (seat.value?.isLockedUntil) {
    const today = new Date();
    const lockDate = new Date(seat.value.isLockedUntil);

    // เช็คว่าเป็นวันเดียวกันหรือไม่
    const isSameDay = today.toDateString() === lockDate.toDateString();
    const isStillLocked = lockDate > today; // ยังไม่หมดเวลาล็อค

    isLockedUntilValid = isSameDay && isStillLocked;
  }

  // Debug log
  if (isStatusLocked || isBookingStatusLocked || isLockedUntilValid) {
    console.log(`🔒 Seat ${seat.value?.seatNumber} lock check:`, {
      status: props.status,
      bookingStatus: seat.value?.bookingStatus,
      isLockedUntil: seat.value?.isLockedUntil,
      isStatusLocked,
      isBookingStatusLocked,
      isLockedUntilValid,
      isOwnSeat,
      isMySelection,
      finalLocked:
        (isStatusLocked || isBookingStatusLocked || isLockedUntilValid) &&
        !isOwnSeat,
    });
  }

  return (
    (isStatusLocked || isBookingStatusLocked || isLockedUntilValid) &&
    !isOwnSeat
  );
});

const isSelected = computed(() =>
  selectedSeats.value.some((s) => s.id === seat.value?.id)
);

function getSeatImage() {
  if (isBooked.value) return "/images/seat-booked.png";
  if (isLocked.value) return "/images/seat-booked.png"; // ใช้ภาพเดียวกับที่จองแล้วแต่จะมีสีต่าง
  if (isSelected.value) return "/images/seat-selected.png";
  return "/images/armchair.png";
}
</script>

<style scoped>
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.seat-locked {
  filter: brightness(0.8) sepia(100%) saturate(200%) hue-rotate(15deg);
}
</style>
