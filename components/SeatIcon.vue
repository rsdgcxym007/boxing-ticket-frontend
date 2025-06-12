<template>
  <div class="flex flex-col items-center w-12">
    <!-- Seat Icon Button -->
    <button
      class="transition-transform duration-200 hover:scale-120 focus:outline-none"
      @click="$emit('toggle', seat)"
      :disabled="isBooked"
    >
      <img
        :src="getSeatImage(seat)"
        alt="seat icon"
        class="w-full h-full object-contain drop-shadow-md"
      />
    </button>

    <!-- Seat Number -->
    <span
      class="mt-1 text-xs font-medium tracking-tight"
      :class="{
        'text-gray-400 line-through': isBooked,
        'text-blue-600 font-semibold': isSelected && !isBooked,
        'text-gray-800': !isSelected && !isBooked,
      }"
    >
      {{ seat }}
    </span>
  </div>
</template>

<script setup>
const props = defineProps({
  seat: String,
  selectedSeats: Array,
});

const bookedSeats = ["101", "202"]; // Mock data

const isBooked = bookedSeats.includes(props.seat);
const isSelected = computed(() => props.selectedSeats.includes(props.seat));

function getSeatImage(seat) {
  if (isBooked) return "/images/seat-booked.png";
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
