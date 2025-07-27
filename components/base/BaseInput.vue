<!-- BaseInput.vue -->
<template>
  <div class="mb-4">
    <label
      v-if="label"
      :for="inputId"
      class="block text-sm font-medium text-gray-700 mb-2"
    >
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <div class="relative">
      <!-- Prefix slot -->
      <div
        v-if="$slots.prefix"
        class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
      >
        <slot name="prefix" />
      </div>

      <input
        :id="inputId"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :inputmode="inputmode"
        :pattern="pattern"
        :class="inputClasses"
        @input="handleInput"
        @blur="$emit('blur', $event)"
        @focus="$emit('focus', $event)"
      />

      <!-- Suffix slot -->
      <div
        v-if="$slots.suffix"
        class="absolute inset-y-0 right-0 flex items-center pr-3"
      >
        <slot name="suffix" />
      </div>
    </div>

    <p v-if="error" class="mt-1 text-sm text-red-600">
      {{ error }}
    </p>

    <p v-if="hint && !error" class="mt-1 text-sm text-gray-500">
      {{ hint }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, useSlots } from "vue";

interface Props {
  modelValue?: string | number;
  label?: string;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  hint?: string;
  size?: "sm" | "md" | "lg";
  className?: string; // เพิ่ม prop className
  inputmode?:
    | "text"
    | "search"
    | "email"
    | "tel"
    | "url"
    | "none"
    | "numeric"
    | "decimal";
  pattern?: string; // เพิ่ม prop pattern
}

const props = withDefaults(defineProps<Props>(), {
  type: "text",
  disabled: false,
  required: false,
  size: "md",
  inputmode: undefined,
  pattern: undefined,
});

const emit = defineEmits<{
  "update:modelValue": [value: string | number];
  blur: [event: Event];
  focus: [event: Event];
}>();

const slots = useSlots();

const inputId = computed(
  () => `input-${Math.random().toString(36).substring(2, 9)}`
);

const inputClasses = computed(() => {
  // If className is provided, use only that (plus base, state, disabled classes). Otherwise, use defaultShape.
  const defaultShape = "rounded-lg w-full h-[40.5px] px-4 py-2.5";
  const baseClasses =
    "block shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200";
  const stateClasses = props.error
    ? "border border-red-300 focus:border-red-500 focus:ring-red-500"
    : "border border-gray-300 focus:border-blue-500 focus:ring-blue-500 hover:border-gray-400";
  const disabledClasses = props.disabled
    ? "bg-gray-50 cursor-not-allowed opacity-60"
    : "bg-white";
  return `${baseClasses} ${stateClasses} ${disabledClasses} ${
    props.className ? props.className : defaultShape
  }  px-4 py-2.5`.trim();
});

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit("update:modelValue", target.value);
};
</script>
