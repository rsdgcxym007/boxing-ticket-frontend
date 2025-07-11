<template>
  <div class="base-select" :class="wrapperClasses">
    <!-- Label -->
    <label
      v-if="label"
      :for="inputId"
      class="block text-sm font-medium mb-2"
      :class="labelClasses"
    >
      {{ label }}
      <span v-if="required" class="text-red-500 ml-1">*</span>
    </label>

    <!-- Select Container -->
    <div class="relative" :class="containerClasses">
      <!-- Select Element -->
      <select
        :id="inputId"
        :value="modelValue"
        :disabled="disabled"
        :required="required"
        :multiple="multiple"
        :class="selectClasses"
        v-bind="$attrs"
        @input="handleInput"
        @change="handleChange"
        @focus="handleFocus"
        @blur="handleBlur"
      >
        <!-- Placeholder option -->
        <option
          v-if="placeholder && !multiple"
          value=""
          disabled
          :selected="!modelValue"
        >
          {{ placeholder }}
        </option>

        <!-- Options from array -->
        <option
          v-for="option in normalizedOptions"
          :key="option.value"
          :value="option.value"
          :disabled="option.disabled"
        >
          {{ option.label }}
        </option>

        <!-- Slot for custom options -->
        <slot name="options" />
      </select>

      <!-- Custom Arrow Icon -->
      <div
        v-if="!multiple"
        class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
        :class="iconClasses"
      >
        <i
          :class="[
            arrowIcon,
            'transition-transform duration-200',
            { 'rotate-180': isFocused },
          ]"
        ></i>
      </div>

      <!-- Loading Spinner -->
      <div
        v-if="loading"
        class="absolute inset-y-0 right-0 flex items-center pr-3"
      >
        <i class="mdi mdi-loading mdi-spin text-gray-400"></i>
      </div>
    </div>

    <!-- Helper Text -->
    <p
      v-if="helperText && !error"
      class="mt-1 text-sm"
      :class="helperTextClasses"
    >
      {{ helperText }}
    </p>

    <!-- Error Message -->
    <p v-if="error" class="mt-1 text-sm text-red-600 flex items-center gap-1">
      <i class="mdi mdi-alert-circle text-sm"></i>
      {{ error }}
    </p>

    <!-- Success Message -->
    <p
      v-if="success"
      class="mt-1 text-sm text-green-600 flex items-center gap-1"
    >
      <i class="mdi mdi-check-circle text-sm"></i>
      {{ success }}
    </p>
  </div>
</template>

<script setup>
import { computed, ref, useAttrs } from "vue";
import { generateId } from "@/utils/generateId";

// Props
const props = defineProps({
  // Core props
  modelValue: {
    type: [String, Number, Array, Boolean],
    default: null,
  },
  options: {
    type: Array,
    default: () => [],
  },

  // Appearance
  label: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "Select an option",
  },
  size: {
    type: String,
    default: "md",
    validator: (value) => ["sm", "md", "lg", "xl"].includes(value),
  },
  variant: {
    type: String,
    default: "default",
    validator: (value) =>
      ["default", "outline", "filled", "ghost"].includes(value),
  },
  color: {
    type: String,
    default: "blue",
    validator: (value) =>
      ["blue", "green", "red", "yellow", "purple", "gray"].includes(value),
  },

  // States
  disabled: {
    type: Boolean,
    default: false,
  },
  required: {
    type: Boolean,
    default: false,
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },

  // Validation
  error: {
    type: String,
    default: "",
  },
  success: {
    type: String,
    default: "",
  },
  helperText: {
    type: String,
    default: "",
  },

  // Customization
  customClasses: {
    type: Object,
    default: () => ({}),
  },
  arrowIcon: {
    type: String,
    default: "mdi mdi-chevron-down",
  },

  // Advanced
  clearable: {
    type: Boolean,
    default: false,
  },
  searchable: {
    type: Boolean,
    default: false,
  },
});

// Emits
const emit = defineEmits([
  "update:modelValue",
  "change",
  "focus",
  "blur",
  "clear",
]);

// Reactive state
const isFocused = ref(false);
const inputId = generateId("select");

// Computed
const normalizedOptions = computed(() => {
  return props.options.map((option) => {
    if (typeof option === "string" || typeof option === "number") {
      return {
        label: String(option),
        value: option,
        disabled: false,
      };
    }
    return {
      label: option.label || option.text || String(option.value),
      value: option.value,
      disabled: option.disabled || false,
    };
  });
});

// Size classes
const sizeClasses = computed(() => {
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2.5 text-base",
    lg: "px-4 py-3 text-lg",
    xl: "px-6 py-4 text-xl",
  };
  return sizes[props.size];
});

// Variant classes
const variantClasses = computed(() => {
  const variants = {
    default: `border-gray-300 bg-white focus:border-${props.color}-500 focus:ring-${props.color}-500`,
    outline: `border-2 border-${props.color}-500 bg-transparent focus:border-${props.color}-600 focus:ring-${props.color}-500`,
    filled: `border-transparent bg-${props.color}-50 focus:bg-white focus:border-${props.color}-500 focus:ring-${props.color}-500`,
    ghost: `border-transparent bg-transparent hover:bg-${props.color}-50 focus:bg-white focus:border-${props.color}-500 focus:ring-${props.color}-500`,
  };
  return variants[props.variant];
});

// Error/Success state classes
const stateClasses = computed(() => {
  if (props.error) {
    return "border-red-500 focus:border-red-500 focus:ring-red-500 text-red-900";
  }
  if (props.success) {
    return "border-green-500 focus:border-green-500 focus:ring-green-500";
  }
  return "";
});

// Computed classes
const wrapperClasses = computed(() => ({
  "opacity-50 cursor-not-allowed": props.disabled,
  ...props.customClasses.wrapper,
}));

const labelClasses = computed(() => ({
  "text-gray-700": !props.error,
  "text-red-700": props.error,
  ...props.customClasses.label,
}));

const containerClasses = computed(() => ({
  ...props.customClasses.container,
}));

const selectClasses = computed(() => [
  // Base classes
  "block w-full rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 appearance-none",

  // Size classes
  sizeClasses.value,

  // Variant classes
  variantClasses.value,

  // State classes
  stateClasses.value,

  // Disabled classes
  {
    "cursor-not-allowed opacity-50": props.disabled,
    "cursor-pointer": !props.disabled,
  },

  // Multiple select classes
  {
    "pr-10": !props.multiple,
    "pr-8": props.multiple,
  },

  // Custom classes
  props.customClasses.select,
]);

const iconClasses = computed(() => ({
  "text-gray-400": !props.error && !props.success,
  "text-red-500": props.error,
  "text-green-500": props.success,
  ...props.customClasses.icon,
}));

const helperTextClasses = computed(() => ({
  "text-gray-500": true,
  ...props.customClasses.helperText,
}));

// Methods
const handleInput = (event) => {
  const value = props.multiple
    ? Array.from(event.target.selectedOptions, (option) => option.value)
    : event.target.value;

  emit("update:modelValue", value);
};

const handleChange = (event) => {
  const value = props.multiple
    ? Array.from(event.target.selectedOptions, (option) => option.value)
    : event.target.value;

  emit("change", value, event);
};

const handleFocus = (event) => {
  isFocused.value = true;
  emit("focus", event);
};

const handleBlur = (event) => {
  isFocused.value = false;
  emit("blur", event);
};

const clear = () => {
  const value = props.multiple ? [] : "";
  emit("update:modelValue", value);
  emit("clear");
};

// Remove inherited attributes
defineOptions({
  inheritAttrs: false,
});
</script>

<style scoped>
/* Custom scrollbar for multiple select */
select[multiple] {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e0 #f7fafc; /* Replace theme("colors.gray.400") and theme("colors.gray.100") */
}

select[multiple]::-webkit-scrollbar {
  width: 8px;
}

select[multiple]::-webkit-scrollbar-track {
  background: #f7fafc; /* Replace theme("colors.gray.100") */
  border-radius: 4px;
}

select[multiple]::-webkit-scrollbar-thumb {
  background: #cbd5e0; /* Replace theme("colors.gray.400") */
  border-radius: 4px;
}

select[multiple]::-webkit-scrollbar-thumb:hover {
  background: #a0aec0; /* Replace theme("colors.gray.500") */
}
</style>
