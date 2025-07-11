<template>
  <div class="base-radio-group" :class="wrapperClasses">
    <!-- Group Label -->
    <fieldset>
      <legend
        v-if="label"
        class="text-sm font-medium mb-3"
        :class="labelClasses"
      >
        {{ label }}
        <span v-if="required" class="text-red-500 ml-1">*</span>
      </legend>

      <!-- Options Container -->
      <div :class="containerClasses">
        <div
          v-for="option in normalizedOptions"
          :key="option.value"
          class="radio-option"
          :class="optionClasses"
        >
          <!-- Radio Input -->
          <div class="relative flex items-start">
            <!-- Hidden Input -->
            <input
              :id="`${groupId}-${option.value}`"
              :name="name || groupId"
              type="radio"
              :value="option.value"
              :checked="modelValue === option.value"
              :disabled="disabled || option.disabled"
              :required="required"
              class="sr-only"
              @change="handleChange(option.value)"
              @focus="handleFocus"
              @blur="handleBlur"
            />

            <!-- Custom Radio -->
            <div
              class="flex items-center justify-center transition-all duration-200 cursor-pointer"
              :class="radioClasses(option)"
              @click="
                !disabled && !option.disabled && selectOption(option.value)
              "
            >
              <!-- Check Dot -->
              <div
                v-if="modelValue === option.value"
                class="rounded-full transition-all duration-200"
                :class="dotClasses"
              ></div>
            </div>

            <!-- Label and Content -->
            <div class="ml-3 flex-1 min-w-0">
              <label
                :for="`${groupId}-${option.value}`"
                class="cursor-pointer select-none"
                :class="optionLabelClasses(option)"
              >
                {{ option.label }}
              </label>

              <!-- Description -->
              <p
                v-if="option.description"
                class="text-sm mt-1"
                :class="optionDescriptionClasses(option)"
              >
                {{ option.description }}
              </p>
            </div>
          </div>
        </div>

        <!-- Custom Slot for Options -->
        <slot name="options" />
      </div>
    </fieldset>

    <!-- Helper Text -->
    <p
      v-if="helperText && !error"
      class="mt-3 text-sm"
      :class="helperTextClasses"
    >
      {{ helperText }}
    </p>

    <!-- Error Message -->
    <p v-if="error" class="mt-3 text-sm text-red-600 flex items-center gap-1">
      <i class="mdi mdi-alert-circle text-sm"></i>
      {{ error }}
    </p>

    <!-- Success Message -->
    <p
      v-if="success"
      class="mt-3 text-sm text-green-600 flex items-center gap-1"
    >
      <i class="mdi mdi-check-circle text-sm"></i>
      {{ success }}
    </p>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { generateId } from "@/utils/generateId";

// Props
const props = defineProps({
  // Core props
  modelValue: {
    type: [String, Number, Boolean],
    default: null,
  },
  options: {
    type: Array,
    required: true,
  },
  name: {
    type: String,
    default: "",
  },

  // Content
  label: {
    type: String,
    default: "",
  },

  // Layout
  direction: {
    type: String,
    default: "vertical",
    validator: (value) => ["vertical", "horizontal", "grid"].includes(value),
  },
  columns: {
    type: Number,
    default: 2,
  },

  // Appearance
  size: {
    type: String,
    default: "md",
    validator: (value) => ["sm", "md", "lg", "xl"].includes(value),
  },
  color: {
    type: String,
    default: "blue",
    validator: (value) =>
      [
        "blue",
        "green",
        "red",
        "yellow",
        "purple",
        "gray",
        "indigo",
        "pink",
      ].includes(value),
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
});

// Emits
const emit = defineEmits(["update:modelValue", "change", "focus", "blur"]);

// Reactive state
const groupId = generateId("radio-group");

// Computed
const normalizedOptions = computed(() => {
  return props.options.map((option) => {
    if (typeof option === "string" || typeof option === "number") {
      return {
        label: String(option),
        value: option,
        disabled: false,
        description: "",
      };
    }
    return {
      label: option.label || option.text || String(option.value),
      value: option.value,
      disabled: option.disabled || false,
      description: option.description || "",
    };
  });
});

// Size classes
const sizeClasses = computed(() => {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-8 h-8",
  };
  return sizes[props.size];
});

// Dot size classes
const dotSizeClasses = computed(() => {
  const sizes = {
    sm: "w-2 h-2",
    md: "w-2.5 h-2.5",
    lg: "w-3 h-3",
    xl: "w-4 h-4",
  };
  return sizes[props.size];
});

// Direction classes
const directionClasses = computed(() => {
  const directions = {
    vertical: "space-y-3",
    horizontal: "flex flex-wrap gap-6",
    grid: `grid gap-4 grid-cols-${props.columns}`,
  };
  return directions[props.direction];
});

// Color classes
const colorClasses = computed(() => {
  const colors = {
    blue: {
      unchecked: "border-gray-300 bg-white hover:border-blue-400",
      checked: "border-blue-500 bg-white",
      dot: "bg-blue-500",
    },
    green: {
      unchecked: "border-gray-300 bg-white hover:border-green-400",
      checked: "border-green-500 bg-white",
      dot: "bg-green-500",
    },
    red: {
      unchecked: "border-gray-300 bg-white hover:border-red-400",
      checked: "border-red-500 bg-white",
      dot: "bg-red-500",
    },
    yellow: {
      unchecked: "border-gray-300 bg-white hover:border-yellow-400",
      checked: "border-yellow-500 bg-white",
      dot: "bg-yellow-500",
    },
    purple: {
      unchecked: "border-gray-300 bg-white hover:border-purple-400",
      checked: "border-purple-500 bg-white",
      dot: "bg-purple-500",
    },
    gray: {
      unchecked: "border-gray-300 bg-white hover:border-gray-400",
      checked: "border-gray-500 bg-white",
      dot: "bg-gray-500",
    },
    indigo: {
      unchecked: "border-gray-300 bg-white hover:border-indigo-400",
      checked: "border-indigo-500 bg-white",
      dot: "bg-indigo-500",
    },
    pink: {
      unchecked: "border-gray-300 bg-white hover:border-pink-400",
      checked: "border-pink-500 bg-white",
      dot: "bg-pink-500",
    },
  };
  return colors[props.color];
});

// Computed classes
const wrapperClasses = computed(() => ({
  "opacity-50": props.disabled,
  ...props.customClasses.wrapper,
}));

const labelClasses = computed(() => ({
  "text-gray-700": !props.error,
  "text-red-700": props.error,
  ...props.customClasses.label,
}));

const containerClasses = computed(() => [
  directionClasses.value,
  props.customClasses.container,
]);

const optionClasses = computed(() => ({
  ...props.customClasses.option,
}));

const radioClasses = computed(() => (option) => [
  // Base classes
  "border-2 rounded-full transition-all duration-200",

  // Size classes
  sizeClasses.value,

  // State classes
  props.modelValue === option.value
    ? colorClasses.value.checked
    : colorClasses.value.unchecked,

  // Disabled classes
  {
    "cursor-not-allowed opacity-50": props.disabled || option.disabled,
    "cursor-pointer hover:scale-105 active:scale-95":
      !props.disabled && !option.disabled,
  },

  // Error state
  {
    "border-red-500": props.error && props.modelValue === option.value,
  },

  // Custom classes
  props.customClasses.radio,
]);

const dotClasses = computed(() => [
  dotSizeClasses.value,
  colorClasses.value.dot,
  props.customClasses.dot,
]);

const optionLabelClasses = computed(() => (option) => ({
  "text-gray-700": !props.error && !props.disabled && !option.disabled,
  "text-red-700": props.error,
  "text-gray-500": props.disabled || option.disabled,
  "font-medium": true,
  ...props.customClasses.optionLabel,
}));

const optionDescriptionClasses = computed(() => (option) => ({
  "text-gray-500": !props.disabled && !option.disabled,
  "text-gray-400": props.disabled || option.disabled,
  ...props.customClasses.optionDescription,
}));

const helperTextClasses = computed(() => ({
  "text-gray-500": true,
  ...props.customClasses.helperText,
}));

// Methods
const selectOption = (value) => {
  if (props.disabled) return;

  emit("update:modelValue", value);
  emit("change", value);
};

const handleChange = (value) => {
  if (props.disabled) return;

  emit("update:modelValue", value);
  emit("change", value);
};

const handleFocus = (event) => {
  emit("focus", event);
};

const handleBlur = (event) => {
  emit("blur", event);
};
</script>

<style scoped>
/* Additional custom styles if needed */
</style>
