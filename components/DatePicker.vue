<template>
  <div class="space-y-1">
    <label :for="id" class="block text-sm font-semibold text-gray-700 mb-1">
      {{ label }}
    </label>

    <Datepicker
      v-model="displayDate"
      :min-date="today"
      :format="displayFormat"
      :auto-apply="true"
      :enable-time-picker="false"
      :id="id"
      input-class-name="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      placeholder="เลือกวันที่"
    />
  </div>
</template>

<script setup>
import Datepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { computed, ref, watch } from "vue";

// ✅ รับค่าจาก parent (v-model)
const model = defineModel(); // format: YYYY-MM-DD
const displayDate = ref(null);

defineProps({
  label: {
    type: String,
    default: "เลือกวันที่",
  },
});

// ✅ จำกัดวันย้อนหลัง
const today = computed(() => new Date());

// ✅ รูปแบบแสดงผล (DD-MM-YYYY)
const displayFormat = (date) => {
  const d = new Date(date);
  return `${String(d.getDate()).padStart(2, "0")}-${String(
    d.getMonth() + 1
  ).padStart(2, "0")}-${d.getFullYear()}`;
};

// ✅ sync parent → display
watch(
  () => model.value,
  (val) => {
    displayDate.value = val ? new Date(val) : null;
  },
  { immediate: true }
);

// ✅ sync display → parent
watch(displayDate, (val) => {
  if (val) {
    model.value = new Date(val).toISOString().split("T")[0];
  } else {
    model.value = null;
  }
});

// ✅ random id
const id = `datepicker-${Math.random().toString(36).substring(2, 9)}`;
</script>
