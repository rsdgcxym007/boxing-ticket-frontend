<template>
  <!-- Wrapper ทั้งหมด -->
  <div class="w-full">
    <!-- Desktop (≥768px) -->
    <div
      v-if="!isMobile"
      class="fixed bottom-6 mb-20 left-1/2 -translate-x-1/2 w-[calc(100%-48px)] max-w-6xl bg-white shadow-xl rounded-2xl px-8 py-4 flex flex-wrap justify-between items-center gap-4 z-50"
    >
      <!-- ที่นั่งที่เลือก -->
      <div class="flex-1 min-w-[200px]">
        <div class="text-sm text-gray-500 mb-1 font-medium">
          ที่นั่งที่เลือก
        </div>
        <div class="text-blue-600 font-bold text-base break-words">
          {{ selectedSeats.join(" , ") }}
        </div>
      </div>

      <!-- ราคารวม -->
      <div class="flex-1 min-w-[120px] text-center">
        <div class="text-sm text-gray-500 mb-1 font-medium">ราคารวม</div>
        <div class="text-blue-600 font-extrabold text-xl">
          {{ totalPrice.toLocaleString() }} บาท
        </div>
      </div>

      <!-- ปุ่มส่วนลด -->
      <div class="min-w-fit">
        <button
          class="flex items-center gap-2 border border-blue-500 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 transition"
        >
          <i class="fa-solid fa-percent" />
          <span class="font-medium">ส่วนลด และโปรโมชั่น</span>
        </button>
      </div>

      <!-- ปุ่มดำเนินการ -->
      <div class="min-w-fit">
        <button
          class="bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white px-6 py-2 rounded-md shadow font-semibold transition"
        >
          ดำเนินการต่อ
        </button>
      </div>
    </div>

    <!-- Mobile (<768px) -->
    <div
      v-else
      class="fixed bottom-0 pb-23 left-0 right-0 z-50 bg-white p-4 border-t shadow-md rounded-t-2xl"
    >
      <div class="flex flex-col gap-3">
        <!-- ที่นั่ง -->
        <div class="text-sm text-center">
          <div class="font-semibold">ที่นั่งที่เลือก</div>
          <div class="text-blue-600 font-bold text-xs break-words">
            {{ selectedSeats.join(" , ") }}
          </div>
        </div>

        <!-- ราคารวม -->
        <div class="text-center text-blue-600 font-bold text-lg">
          {{ totalPrice.toLocaleString() }} บาท
        </div>

        <!-- ส่วนลด -->
        <button
          class="flex items-center justify-center border border-blue-500 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50"
        >
          <i class="fa-solid fa-percent mr-2" />
          ส่วนลด และโปรโมชั่น
        </button>

        <!-- ดำเนินการ -->
        <button
          class="bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white px-6 py-2 rounded-md shadow-md"
        >
          ดำเนินการต่อ
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

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

const isMobile = ref(false);

onMounted(() => {
  isMobile.value = window.innerWidth < 768;
  window.addEventListener("resize", () => {
    isMobile.value = window.innerWidth < 768;
  });
});
</script>
