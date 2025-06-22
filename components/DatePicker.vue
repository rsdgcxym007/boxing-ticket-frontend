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
      :clearable="false"
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

// sync parent → display (มีเช็คกันซ้ำ)
watch(
  () => model.value,
  (val) => {
    const newDate = val ? new Date(val) : null;
    if (
      !displayDate.value ||
      newDate.getTime() !== new Date(displayDate.value).getTime()
    ) {
      displayDate.value = newDate;
    }
  },
  { immediate: true }
);

// sync display → parent (มีเช็คกันซ้ำ)
watch(displayDate, (val) => {
  const newVal = val ? new Date(val).toISOString().split("T")[0] : null;
  if (newVal !== model.value) {
    model.value = newVal;
  }
});

// ✅ random id
const id = `datepicker-${Math.random().toString(36).substring(2, 9)}`;
</script>
