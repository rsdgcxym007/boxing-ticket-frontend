<!-- components/SeatSummary.vue -->
<template>
  <div class="w-full bg-white p-4 shadow rounded-lg">
    <!-- Desktop -->
    <div class="hidden md:flex justify-between items-center gap-4">
      <div class="text-sm text-center">
        <div class="font-semibold">ที่นั่งที่เลือก</div>
        <div class="text-blue-600 font-bold">
          {{ selectedSeats.join(" , ") }}
        </div>
      </div>

      <div class="text-right">
        <div class="text-gray-500 text-sm">ราคารวม</div>
        <div class="text-blue-600 font-bold text-xl">{{ totalPrice }} บาท</div>
      </div>

      <button
        class="flex items-center justify-center border border-blue-500 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50"
      >
        <i class="fa-solid fa-percent mr-2" />
        ส่วนลด และโปรโมชั่น
      </button>

      <button
        class="bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-6 py-2 rounded-md"
      >
        ดำเนินการต่อ
      </button>
    </div>

    <!-- Mobile -->
    <div class="flex flex-col gap-3 md:hidden">
      <div class="text-sm text-center">
        <div class="font-semibold">ที่นั่งที่เลือก</div>
        <div class="text-blue-600 font-bold text-xs break-words">
          {{ selectedSeats.join(" , ") }}
        </div>
      </div>

      <div class="text-center text-blue-600 font-bold text-lg">
        {{ totalPrice }} บาท
      </div>

      <button
        class="flex items-center justify-center border border-blue-500 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50"
      >
        <i class="fa-solid fa-percent mr-2" />
        ส่วนลด และโปรโมชั่น
      </button>

      <button
        class="bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-6 py-2 rounded-md"
      >
        ดำเนินการต่อ
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  selectedSeats: {
    type: Array,
    default: () => [],
  },
  totalPrice: {
    type: Number,
    default: 0,
  },
});
</script>
