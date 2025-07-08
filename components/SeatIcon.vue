<template>
  <div
    class="flex flex-col items-center justify-center"
    :style="{ width: size, height: size }"
  >
    <button
      class="w-full h-full relative transition-transform duration-200 hover:scale-110 focus:outline-none"
      @click="$emit('toggle', seat, isBooked)"
      :disabled="isBooked"
    >
      <img
        :src="getSeatImage()"
        alt="seat icon"
        class="w-full h-full object-contain drop-shadow-md pointer-events-none"
        :class="{
          '-rotate-90': zoneKey === 'left',
          'rotate-90': zoneKey === 'right',
          'rotate-180': zoneKey === 'front-ringside',
        }"
      />
    </button>
    <span
      class="block mt-[-0.25rem] text-[0.55em] leading-tight font-semibold text-center"
      :class="{
        'text-gray-400 line-through': isBooked,
        'text-blue-600': isSelected && !isBooked,
        'text-gray-800': !isSelected && !isBooked,
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

  // ✅ ใช้ bookingStatus เป็นหลัก (ตามข้อมูลจริงจาก API)
  const isStatusBlocked = ["BOOKED", "PAID", "PENDING", "RESERVED"].includes(
    seat.value?.bookingStatus
  );

  // ตรวจสอบจาก bookedSeats ที่ส่งมาจาก parent component (backup)
  const isInBookedList = props.bookedSeats.some(
    (bookedSeat) => bookedSeat.id === seat.value?.id
  );

  // ลด log ให้แสดงเฉพาะที่นั่งที่มีการเปลี่ยนแปลง status
  const finalIsBooked = (isStatusBlocked || isInBookedList) && !isOwnSeat;

  return finalIsBooked;
});

const isSelected = computed(() =>
  selectedSeats.value.some((s) => s.id === seat.value?.id)
);

function getSeatImage() {
  if (isBooked.value) return "/images/seat-booked.png";
  if (isSelected.value) return "/images/seat-selected.png";
  return "/images/armchair.png";
}
</script>

<style scoped>
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
