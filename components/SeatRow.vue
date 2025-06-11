<template>
  <div class="flex gap-1 items-center justify-center" v-if="seats?.length">
    <span class="w-32 text-xs text-gray-500 font-medium text-right">{{
      zone
    }}</span>
    <div class="flex gap-1">
      <button
        v-for="seat in seats"
        :key="seat"
        class="w-8 h-8"
        @click="$emit('toggle', seat)"
        :disabled="bookedSeats.includes(seat)"
      >
        <img
          :src="getSeatImage(seat)"
          alt="seat"
          class="w-full h-full object-contain"
        />
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  seats: Array,
  zone: String,
  selectedSeats: Array,
});

const bookedSeats = ["R5", "L10"]; // mock data

function getSeatImage(seat) {
  if (bookedSeats.includes(seat)) return "/images/seat-booked.png";
  if (props.selectedSeats.includes(seat)) return "/images/seat-selected.png";
  return "/images/armchair.png";
}
</script>

<style scoped></style>
