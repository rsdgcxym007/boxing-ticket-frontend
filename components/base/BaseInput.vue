<!-- BaseInput.vue -->
<template>
  <div class="mb-4">
    <label
      v-if="label"
      :for="inputId"
      class="block text-sm font-medium text-gray-700 mb-1"
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
}

const props = withDefaults(defineProps<Props>(), {
  type: "text",
  disabled: false,
  required: false,
  size: "md",
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
  const baseClasses =
    "block w-full border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200";
  const sizes = {
    sm: "py-1.5 text-sm",
    md: "py-2 text-base",
    lg: "py-3 text-lg",
  };

  // Adjust padding based on slots
  const paddingClasses = () => {
    let leftPadding = "pl-3";
    let rightPadding = "pr-3";

    if (props.size === "lg") {
      leftPadding = "pl-4";
      rightPadding = "pr-4";
    }

    if (slots.prefix) {
      leftPadding = props.size === "lg" ? "pl-12" : "pl-10";
    }

    if (slots.suffix) {
      rightPadding = props.size === "lg" ? "pr-12" : "pr-10";
    }

    return `${leftPadding} ${rightPadding}`;
  };

  const stateClasses = props.error
    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
    : "border-gray-300 focus:border-blue-500 focus:ring-blue-500 hover:border-gray-400";

  const disabledClasses = props.disabled
    ? "bg-gray-50 cursor-not-allowed opacity-60"
    : "bg-white";

  return `${baseClasses} ${
    sizes[props.size]
  } ${paddingClasses()} ${stateClasses} ${disabledClasses}`;
});

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit("update:modelValue", target.value);
};
</script>
