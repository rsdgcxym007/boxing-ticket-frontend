<template>
  <div class="text-center text-lg font-medium">
    เลือกแล้ว: {{ seats.length }} ที่นั่ง | ราคารวม:
    {{ totalPrice.toLocaleString() }} บาท
  </div>
</template>

<script setup>
const props = defineProps({
  seats: Array,
});

const seatPrices = {
  R: 1500,
  L: 800,
  RL: 800,
  C: 1000,
};

const totalPrice = computed(() => {
  return props.seats.reduce((sum, seat) => {
    const zone = seat.match(/[A-Z]+/)[0];
    return sum + (seatPrices[zone] || 0);
  }, 0);
});
</script>
