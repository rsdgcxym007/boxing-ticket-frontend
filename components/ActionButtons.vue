<template>
  <div class="flex justify-center gap-4 mt-4">
    <BaseButton variant="danger" @click="$emit('cancel')">
      ยกเลิกทั้งหมด
    </BaseButton>
    <BaseButton variant="primary" @click="confirmSelection">
      ดำเนินการต่อ
    </BaseButton>
  </div>
</template>

<script setup lang="ts">
import BaseButton from "./base/BaseButton.vue";

interface Props {
  seats: string[];
}

const props = defineProps<Props>();
const emit = defineEmits<{
  cancel: [];
}>();

function confirmSelection() {
  alert(`ที่นั่งที่เลือก: ${props.seats.join(", ")}`);
}
</script>
