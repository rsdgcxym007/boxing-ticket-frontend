<template>
  <div class="flex items-center justify-center">
    <button
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
</template>

<script setup>
const props = defineProps({
  seat: String,
  selectedSeats: Array,
});

const bookedSeats = ["101", "202"]; // Mock

function getSeatImage(seat) {
  console.log("seatseatseatseat");
  console.log("seat", seat);

  if (bookedSeats.includes(seat)) return "/images/seat-booked.png";
  if (props.selectedSeats.includes(seat)) return "/images/seat-selected.png";
  return "/images/armchair.png";
}
</script>
