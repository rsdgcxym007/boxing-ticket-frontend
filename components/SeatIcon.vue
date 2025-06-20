<template>
  <div class="flex flex-col items-center w-12 pointer-events-auto">
    <!-- Seat Icon Button -->
    <button
      class="transition-transform duration-200 hover:scale-120 focus:outline-none pointer-events-auto"
      @click="$emit('toggle', seat)"
      :disabled="isBooked"
    >
      <img
        :src="getSeatImage(seat)"
        alt="seat icon"
        class="w-full h-full object-contain drop-shadow-md pointer-events-none"
        :class="{
          'rotate-[-90deg]': zoneKey === 'left',
          '-rotate-[-90deg]': zoneKey === 'right',
          '-rotate-[180deg]': zoneKey === 'front-ringside',
        }"
      />
    </button>

    <!-- Seat Number -->
    <span
      class="text-xs font-medium tracking-tight pointer-events-none"
      :class="{
        'text-gray-400 line-through': ['BOOKED', 'PAID'].includes(seat?.status),
        'text-blue-600 font-semibold': isSelected && !isBooked,
        'text-gray-800': !isSelected && !isBooked,
      }"
    >
      {{ seat?.seatNumber || "" }}
    </span>
  </div>
</template>

<script setup>
const props = defineProps({
  seat: String,
  selectedSeats: {
    type: Array,
    default: () => [],
  },
  bookedSeats: {
    type: Array,
    default: () => [],
  },
  zoneKey: { type: String, default: "" },
});

const { seat, selectedSeats, bookedSeats } = toRefs(props);
console.log("seat", seat.value);
console.log(" bookedSeats.value", bookedSeats.value);

const isBooked = computed(() =>
  ["Booked", "PAID"].includes(seat.value?.status)
);
// console.log("isBooked", isBooked.value);

const isSelected = computed(() => selectedSeats.value.includes(seat.value));

// console.log("isSelected", isSelected.value);

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
.pointer-events-none {
  pointer-events: none;
}
.pointer-events-auto {
  pointer-events: auto;
}
</style>
