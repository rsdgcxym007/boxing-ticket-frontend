<template>
  <div class="base-checkbox" :class="wrapperClasses">
    <!-- Checkbox with Label (Inline) -->
    <div
      v-if="!labelPosition || labelPosition === 'right'"
      class="flex items-start gap-3"
    >
      <!-- Checkbox Container -->
      <div class="relative flex-shrink-0" :class="checkboxContainerClasses">
        <!-- Hidden Input -->
        <input
          :id="inputId"
          ref="checkboxRef"
          type="checkbox"
          :checked="isChecked"
          :value="value"
          :disabled="disabled"
          :required="required"
          :indeterminate="indeterminate"
          class="sr-only"
          v-bind="$attrs"
          @change="handleChange"
          @focus="handleFocus"
          @blur="handleBlur"
        />

        <!-- Custom Checkbox -->
        <div
          class="flex items-center justify-center transition-all duration-200 cursor-pointer"
          :class="checkboxClasses"
          @click="toggle"
        >
          <!-- Check Icon -->
          <i
            v-if="isChecked && !indeterminate"
            :class="checkIcon"
            class="transition-all duration-200"
          ></i>

          <!-- Indeterminate Icon -->
          <i
            v-else-if="indeterminate"
            :class="indeterminateIcon"
            class="transition-all duration-200"
          ></i>
        </div>

        <!-- Focus Ring -->
        <div
          v-if="isFocused"
          class="absolute inset-0 rounded border-2 border-opacity-50"
          :class="focusRingClasses"
        ></div>
      </div>

      <!-- Label and Content -->
      <div v-if="label || $slots.default" class="flex-1 min-w-0">
        <label
          :for="inputId"
          class="cursor-pointer select-none"
          :class="labelClasses"
        >
          {{ label }}
          <span v-if="required" class="text-red-500 ml-1">*</span>
        </label>

        <!-- Default Slot for custom content -->
        <div v-if="$slots.default" class="mt-1">
          <slot />
        </div>

        <!-- Description -->
        <p v-if="description" class="text-sm mt-1" :class="descriptionClasses">
          {{ description }}
        </p>
      </div>
    </div>

    <!-- Label Above (Stacked) -->
    <div v-else-if="labelPosition === 'top'" class="space-y-2">
      <label
        v-if="label"
        :for="inputId"
        class="block text-sm font-medium"
        :class="labelClasses"
      >
        {{ label }}
        <span v-if="required" class="text-red-500 ml-1">*</span>
      </label>

      <div class="flex items-start gap-3">
        <!-- Checkbox Container -->
        <div class="relative flex-shrink-0" :class="checkboxContainerClasses">
          <!-- Hidden Input -->
          <input
            :id="inputId"
            ref="checkboxRef"
            type="checkbox"
            :checked="isChecked"
            :value="value"
            :disabled="disabled"
            :required="required"
            :indeterminate="indeterminate"
            class="sr-only"
            v-bind="$attrs"
            @change="handleChange"
            @focus="handleFocus"
            @blur="handleBlur"
          />

          <!-- Custom Checkbox -->
          <div
            class="flex items-center justify-center transition-all duration-200 cursor-pointer"
            :class="checkboxClasses"
            @click="toggle"
          >
            <!-- Check Icon -->
            <i
              v-if="isChecked && !indeterminate"
              :class="checkIcon"
              class="transition-all duration-200"
            ></i>

            <!-- Indeterminate Icon -->
            <i
              v-else-if="indeterminate"
              :class="indeterminateIcon"
              class="transition-all duration-200"
            ></i>
          </div>

          <!-- Focus Ring -->
          <div
            v-if="isFocused"
            class="absolute inset-0 rounded border-2 border-opacity-50"
            :class="focusRingClasses"
          ></div>
        </div>

        <!-- Content -->
        <div v-if="$slots.default" class="flex-1 min-w-0">
          <slot />
        </div>
      </div>

      <!-- Description -->
      <p v-if="description" class="text-sm" :class="descriptionClasses">
        {{ description }}
      </p>
    </div>

    <!-- Error Message -->
    <p v-if="error" class="mt-2 text-sm text-red-600 flex items-center gap-1">
      <i class="mdi mdi-alert-circle text-sm"></i>
      {{ error }}
    </p>

    <!-- Success Message -->
    <p
      v-if="success"
      class="mt-2 text-sm text-green-600 flex items-center gap-1"
    >
      <i class="mdi mdi-check-circle text-sm"></i>
      {{ success }}
    </p>

    <!-- Helper Text -->
    <p
      v-if="helperText && !error"
      class="mt-2 text-sm"
      :class="helperTextClasses"
    >
      {{ helperText }}
    </p>
  </div>
</template>

<script setup>
import { computed, ref, watch, nextTick } from "vue";
import { generateId } from "@/utils/generateId";

// Props
const props = defineProps({
  // Core props
  modelValue: {
    type: [Boolean, Array],
    default: false,
  },
  value: {
    type: [String, Number, Boolean],
    default: true,
  },

  // Content
  label: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    default: "",
  },
  labelPosition: {
    type: String,
    default: "right",
    validator: (value) => ["top", "right"].includes(value),
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
  variant: {
    type: String,
    default: "default",
    validator: (value) => ["default", "outline", "solid"].includes(value),
  },
  shape: {
    type: String,
    default: "rounded",
    validator: (value) => ["square", "rounded", "circle"].includes(value),
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
  indeterminate: {
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

  // Icons
  checkIcon: {
    type: String,
    default: "mdi mdi-check",
  },
  indeterminateIcon: {
    type: String,
    default: "mdi mdi-minus",
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
const isFocused = ref(false);
const checkboxRef = ref(null);
const inputId = generateId("checkbox");

// Computed
const isArray = computed(() => Array.isArray(props.modelValue));

const isChecked = computed(() => {
  if (isArray.value) {
    return props.modelValue.includes(props.value);
  }
  return Boolean(props.modelValue);
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

// Icon size classes
const iconSizeClasses = computed(() => {
  const sizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
    xl: "text-lg",
  };
  return sizes[props.size];
});

// Shape classes
const shapeClasses = computed(() => {
  const shapes = {
    square: "rounded-none",
    rounded: "rounded",
    circle: "rounded-full",
  };
  return shapes[props.shape];
});

// Color and variant classes
const stateClasses = computed(() => {
  if (props.error) {
    return {
      unchecked: "border-red-500 bg-white hover:border-red-600",
      checked: "border-red-500 bg-red-500 hover:bg-red-600",
      text: "text-white",
    };
  }

  if (props.success) {
    return {
      unchecked: "border-green-500 bg-white hover:border-green-600",
      checked: "border-green-500 bg-green-500 hover:bg-green-600",
      text: "text-white",
    };
  }

  const colorMap = {
    blue: {
      unchecked: "border-gray-300 bg-white hover:border-blue-400",
      checked: "border-blue-500 bg-blue-500 hover:bg-blue-600",
      text: "text-white",
    },
    green: {
      unchecked: "border-gray-300 bg-white hover:border-green-400",
      checked: "border-green-500 bg-green-500 hover:bg-green-600",
      text: "text-white",
    },
    red: {
      unchecked: "border-gray-300 bg-white hover:border-red-400",
      checked: "border-red-500 bg-red-500 hover:bg-red-600",
      text: "text-white",
    },
    yellow: {
      unchecked: "border-gray-300 bg-white hover:border-yellow-400",
      checked: "border-yellow-500 bg-yellow-500 hover:bg-yellow-600",
      text: "text-white",
    },
    purple: {
      unchecked: "border-gray-300 bg-white hover:border-purple-400",
      checked: "border-purple-500 bg-purple-500 hover:bg-purple-600",
      text: "text-white",
    },
    gray: {
      unchecked: "border-gray-300 bg-white hover:border-gray-400",
      checked: "border-gray-500 bg-gray-500 hover:bg-gray-600",
      text: "text-white",
    },
    indigo: {
      unchecked: "border-gray-300 bg-white hover:border-indigo-400",
      checked: "border-indigo-500 bg-indigo-500 hover:bg-indigo-600",
      text: "text-white",
    },
    pink: {
      unchecked: "border-gray-300 bg-white hover:border-pink-400",
      checked: "border-pink-500 bg-pink-500 hover:bg-pink-600",
      text: "text-white",
    },
  };

  return colorMap[props.color];
});

// Computed classes
const wrapperClasses = computed(() => ({
  "opacity-50": props.disabled,
  ...props.customClasses.wrapper,
}));

const checkboxContainerClasses = computed(() => ({
  "cursor-not-allowed": props.disabled,
  ...props.customClasses.container,
}));

const checkboxClasses = computed(() => [
  // Base classes
  "border-2 transition-all duration-200",

  // Size classes
  sizeClasses.value,

  // Shape classes
  shapeClasses.value,

  // State classes
  isChecked.value || props.indeterminate
    ? stateClasses.value.checked
    : stateClasses.value.unchecked,

  // Disabled classes
  {
    "cursor-not-allowed opacity-50": props.disabled,
    "cursor-pointer hover:scale-105 active:scale-95": !props.disabled,
  },

  // Custom classes
  props.customClasses.checkbox,
]);

const labelClasses = computed(() => ({
  "text-gray-700": !props.error && !props.disabled,
  "text-red-700": props.error,
  "text-gray-500": props.disabled,
  "font-medium": true,
  ...props.customClasses.label,
}));

const descriptionClasses = computed(() => ({
  "text-gray-500": !props.disabled,
  "text-gray-400": props.disabled,
  ...props.customClasses.description,
}));

const helperTextClasses = computed(() => ({
  "text-gray-500": true,
  ...props.customClasses.helperText,
}));

const focusRingClasses = computed(() => {
  const focusColors = {
    blue: "border-blue-500",
    green: "border-green-500",
    red: "border-red-500",
    yellow: "border-yellow-500",
    purple: "border-purple-500",
    gray: "border-gray-500",
    indigo: "border-indigo-500",
    pink: "border-pink-500",
  };

  return focusColors[props.color] || "border-blue-500";
});

// Watch for indeterminate state
watch(
  () => props.indeterminate,
  (newValue) => {
    nextTick(() => {
      if (checkboxRef.value) {
        checkboxRef.value.indeterminate = newValue;
      }
    });
  },
  { immediate: true }
);

// Methods
const toggle = () => {
  if (props.disabled) return;

  let newValue;

  if (isArray.value) {
    const currentArray = [...props.modelValue];
    const index = currentArray.indexOf(props.value);

    if (index > -1) {
      currentArray.splice(index, 1);
    } else {
      currentArray.push(props.value);
    }

    newValue = currentArray;
  } else {
    newValue = !props.modelValue;
  }

  emit("update:modelValue", newValue);
  emit("change", newValue);
};

const handleChange = (event) => {
  if (props.disabled) return;

  const checked = event.target.checked;
  let newValue;

  if (isArray.value) {
    const currentArray = [...props.modelValue];
    const index = currentArray.indexOf(props.value);

    if (checked && index === -1) {
      currentArray.push(props.value);
    } else if (!checked && index > -1) {
      currentArray.splice(index, 1);
    }

    newValue = currentArray;
  } else {
    newValue = checked;
  }

  emit("update:modelValue", newValue);
  emit("change", newValue);
};

const handleFocus = (event) => {
  isFocused.value = true;
  emit("focus", event);
};

const handleBlur = (event) => {
  isFocused.value = false;
  emit("blur", event);
};

// Remove inherited attributes
defineOptions({
  inheritAttrs: false,
});
</script>

<style scoped>
/* Additional custom styles if needed */
</style>
