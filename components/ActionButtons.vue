<template>
  <div class="flex justify-center gap-4 mt-4">
    <button
      @click="$emit('cancel')"
      class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl"
    >
      ยกเลิกทั้งหมด
    </button>
    <button
      @click="confirmSelection"
      class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
    >
      ดำเนินการต่อ
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  seats: Array,
});

function confirmSelection() {
  alert(`ที่นั่งที่เลือก: ${props.seats.join(", ")}`);
}
</script>
