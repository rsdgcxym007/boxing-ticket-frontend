<template>
  <div class="space-y-1">
    <label :for="id" class="block text-sm font-semibold text-gray-700 mb-1">
      {{ label }}
    </label>

    <div :class="wrapperClassName + ' flex items-stretch'">
      <Datepicker
        v-model="displayDate"
        :min-date="minDate"
        :format="displayFormat"
        :auto-apply="true"
        :enable-time-picker="false"
        :clearable="false"
        :disabled-dates="shouldDisable"
        :id="id"
        :input-class-name="inputClassName + ' !h-full !min-h-0 !max-h-none'"
        :input-style="props.inputStyle"
        :placeholder="placeholder"
      />
    </div>
  </div>
</template>

<script setup>
import Datepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { computed, ref, watch } from "vue";
import dayjs from "dayjs";
// ✅ รับค่าจาก parent (v-model)
const model = defineModel(); // format: YYYY-MM-DD
const displayDate = ref(null);

const props = defineProps({
  label: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "เลือกวันที่",
  },
  minDate: {
    type: Date,
    default: new Date(),
  },
  inputClassName: {
    type: String,
    default: "",
  },
  wrapperClassName: {
    type: String,
    default: "",
  },
  inputStyle: {
    type: [Object, String],
    default: undefined,
  },
});

// ✅ จำกัดวันย้อนหลัง
const today = computed(() => new Date());
const allowedWeekdays = [0, 1, 2, 4, 6];

const shouldDisable = (d) => {
  return !allowedWeekdays.includes(d.getDay());
};
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
  const newVal = val ? dayjs(val).format("YYYY-MM-DD HH:mm:ss") : null;
  if (newVal !== model.value) {
    model.value = newVal;
  }
});

// ✅ random id
const id = `datepicker-${Math.random().toString(36).substring(2, 9)}`;
</script>
