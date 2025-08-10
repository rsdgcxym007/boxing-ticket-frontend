<template>
  <div
    class="base-select"
    :class="[wrapperClasses, $attrs.class, $attrs.className]"
  >
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

    <!-- Custom Dropdown Container -->
    <div
      class="relative"
      :class="[containerClasses, $attrs.class, $attrs.className]"
      v-click-outside="closeDropdown"
    >
      <!-- Trigger Button -->
      <button
        ref="triggerRef"
        :id="inputId"
        type="button"
        :disabled="disabled"
        :class="[triggerClasses, $attrs.class, $attrs.className]"
        @click="toggleDropdown"
        @keydown.enter.prevent="toggleDropdown"
        @keydown.space.prevent="toggleDropdown"
        @keydown.escape="closeDropdown"
        @keydown.arrow-down.prevent="highlightNext"
        @keydown.arrow-up.prevent="highlightPrevious"
      >
        <!-- Selected Value Display -->
        <div class="flex items-center min-w-0 h-full w-full">
          <!-- Multiple Selection Tags -->
          <div
            v-if="
              props.multiple &&
              Array.isArray(props.modelValue) &&
              props.modelValue.length > 0
            "
            class="flex gap-1 flex-1 min-w-0 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
            style="scrollbar-width: thin"
          >
            <span
              v-for="value in props.modelValue"
              :key="value"
              class="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md whitespace-nowrap flex-shrink-0"
            >
              <span class="max-w-24 truncate">{{ getOptionLabel(value) }}</span>
              <button
                type="button"
                class="flex-shrink-0 hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                @click.stop="removeOption(value)"
              >
                <i class="mdi mdi-close text-xs"></i>
              </button>
            </span>
          </div>
          <!-- Single Selection or Placeholder -->
          <span
            v-else-if="!props.multiple && selectedDisplay"
            class="block truncate"
            :class="selectedValueClasses"
          >
            {{ selectedDisplay }}
          </span>
          <span v-else class="block truncate text-gray-500">
            {{ placeholder }}
          </span>
          <div
            class="flex items-center justify-center space-x-2 flex-shrink-0 ml-auto h-full"
          >
            <!-- Clear Button -->
            <button
              v-if="clearable && modelValue && !disabled"
              type="button"
              class="p-1 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0"
              @click.stop="clear"
            >
              <i
                class="mdi mdi-close text-gray-400 hover:text-gray-600 text-sm"
              ></i>
            </button>

            <!-- Loading Spinner -->
            <i
              v-if="loading"
              class="mdi mdi-loading mdi-spin text-gray-400 flex-shrink-0"
            ></i>

            <!-- Arrow Icon -->
            <i
              v-else
              :class="[
                arrowIcon,
                'text-gray-400 transition-transform duration-200 flex-shrink-0',
                { 'rotate-180': isOpen },
              ]"
            ></i>
          </div>
        </div>

        <!-- Icons -->
      </button>

      <!-- Dropdown Menu -->
      <Teleport to="body">
        <div
          v-if="isOpen"
          ref="dropdownRef"
          :class="dropdownClasses"
          :style="dropdownStyle"
        >
          <!-- Search Input -->
          <div v-if="searchable" class="p-2 border-b border-gray-100">
            <div class="relative">
              <i
                class="mdi mdi-magnify absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              ></i>
              <input
                ref="searchInput"
                v-model="searchQuery"
                type="text"
                placeholder="ค้นหา..."
                class="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                @keydown.escape="closeDropdown"
                @keydown.arrow-down.prevent="highlightNext"
                @keydown.arrow-up.prevent="highlightPrevious"
                @keydown.enter.prevent="selectHighlighted"
              />
            </div>
          </div>

          <!-- Options List -->
          <div class="max-h-60 overflow-auto py-1">
            <!-- No Options Message -->
            <div
              v-if="filteredOptions.length === 0"
              class="px-4 py-3 text-sm text-gray-500 text-center"
            >
              {{ searchQuery ? "ไม่พบข้อมูลที่ค้นหา" : "ไม่มีตัวเลือก" }}
            </div>

            <!-- Option Items -->
            <button
              v-for="(option, index) in filteredOptions"
              :key="option.value"
              type="button"
              :disabled="option.disabled"
              :class="optionClasses(option, index)"
              @click="selectOption(option)"
              @mouseenter="highlightedIndex = index"
            >
              <!-- Option Content -->
              <div class="flex items-center justify-between w-full">
                <div class="flex items-center space-x-3">
                  <!-- Option Icon -->
                  <i
                    v-if="option.icon"
                    :class="[option.icon, 'text-gray-400']"
                  ></i>

                  <!-- Option Label -->
                  <span class="block truncate">{{ option.label }}</span>

                  <!-- Option Badge/Description -->
                  <span
                    v-if="option.badge"
                    class="ml-2 px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full"
                  >
                    {{ option.badge }}
                  </span>
                </div>

                <!-- Selected Indicator -->
                <i
                  v-if="isSelected(option)"
                  class="mdi mdi-check text-blue-600 ml-2"
                ></i>
              </div>
            </button>
          </div>
        </div>
      </Teleport>
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
  <p v-if="success" class="mt-1 text-sm text-green-600 flex items-center gap-1">
    <i class="mdi mdi-check-circle text-sm"></i>
    {{ success }}
  </p>
</template>

<script setup>
import { computed, ref, nextTick, onMounted, onUnmounted } from "vue";

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
    default: "เลือกตัวเลือก",
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
  closeOnSelect: {
    type: Boolean,
    default: true,
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
const isOpen = ref(false);
const searchQuery = ref("");
const highlightedIndex = ref(-1);
const dropdownRef = ref(null);
const searchInput = ref(null);
const inputId = `select-${Math.random().toString(36).substr(2, 9)}`;

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
      icon: option.icon || null,
      badge: option.badge || null,
    };
  });
});

const filteredOptions = computed(() => {
  if (!props.searchable || !searchQuery.value) {
    return normalizedOptions.value;
  }

  return normalizedOptions.value.filter((option) =>
    option.label.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const selectedDisplay = computed(() => {
  if (props.multiple && Array.isArray(props.modelValue)) {
    if (props.modelValue.length === 0) return null;
    if (props.modelValue.length === 1) {
      const option = normalizedOptions.value.find(
        (opt) => opt.value === props.modelValue[0]
      );
      return option?.label;
    }
    return `${props.modelValue.length} รายการที่เลือก`;
  }

  const option = normalizedOptions.value.find(
    (opt) => opt.value === props.modelValue
  );
  return option?.label || null;
});

const triggerRef = ref(null);

const dropdownStyle = computed(() => {
  if (!triggerRef.value) return {};

  const rect = triggerRef.value.getBoundingClientRect();

  return {
    position: "absolute",
    top: `${rect.bottom + window.scrollY}px`,
    left: `${rect.left + window.scrollX}px`,
    width: `${rect.width}px`,
    zIndex: 9999,
  };
});

// Size classes
const sizeClasses = computed(() => {
  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2.5 text-base",
    lg: "px-4 py-3 text-lg",
    xl: "px-6 py-4 text-xl",
  };
  return sizes[props.size];
});

// Variant classes
const variantClasses = computed(() => {
  const variants = {
    default: `border-gray-300 bg-white hover:border-gray-400 focus:border-${props.color}-500 focus:ring-${props.color}-500`,
    outline: `border-2 border-${props.color}-500 bg-transparent hover:bg-${props.color}-50 focus:border-${props.color}-600 focus:ring-${props.color}-500`,
    filled: `border-transparent bg-${props.color}-50 hover:bg-${props.color}-100 focus:bg-white focus:border-${props.color}-500 focus:ring-${props.color}-500`,
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

const triggerClasses = computed(() => [
  // Base classes
  "relative border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 text-left",

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

  // Open state
  {
    [`border-${props.color}-500 ring-2 ring-${props.color}-500 ring-opacity-50`]:
      isOpen.value && !props.error,
  },

  // Custom classes
  props.customClasses.trigger,
]);

const selectedValueClasses = computed(() => ({
  "text-gray-900": !props.error,
  "text-red-900": props.error,
}));

const dropdownClasses = computed(() => [
  "absolute z-[9999] w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden",
  "top-full left-0 right-0",
  "transform translate-y-0",
  {
    "border-red-300": props.error,
    "border-green-300": props.success,
  },
]);

const helperTextClasses = computed(() => ({
  "text-gray-500": true,
  ...props.customClasses.helperText,
}));

// Methods
const toggleDropdown = () => {
  if (props.disabled) return;

  if (isOpen.value) {
    closeDropdown();
  } else {
    openDropdown();
  }
};

const openDropdown = async () => {
  isOpen.value = true;
  highlightedIndex.value = -1;
  searchQuery.value = "";

  await nextTick();

  // Focus search input if searchable
  if (props.searchable && searchInput.value) {
    searchInput.value.focus();
  }

  emit("focus");
};

const closeDropdown = () => {
  isOpen.value = false;
  highlightedIndex.value = -1;
  emit("blur");
};

const selectOption = (option) => {
  if (option.disabled) return;

  if (props.multiple) {
    const currentValue = Array.isArray(props.modelValue)
      ? props.modelValue
      : [];
    const newValue = currentValue.includes(option.value)
      ? currentValue.filter((v) => v !== option.value)
      : [...currentValue, option.value];

    emit("update:modelValue", newValue);
    emit("change", newValue);

    // Only close if closeOnSelect is true
    if (props.closeOnSelect) {
      closeDropdown();
    }
  } else {
    emit("update:modelValue", option.value);
    emit("change", option.value);
    closeDropdown();
  }
};

const removeOption = (valueToRemove) => {
  if (!props.multiple) return;

  const currentValue = Array.isArray(props.modelValue) ? props.modelValue : [];
  const newValue = currentValue.filter((v) => v !== valueToRemove);

  emit("update:modelValue", newValue);
  emit("change", newValue);
};

const getOptionLabel = (value) => {
  const option = normalizedOptions.value.find((opt) => opt.value === value);
  return option?.label || String(value);
};

const isSelected = (option) => {
  if (props.multiple && Array.isArray(props.modelValue)) {
    return props.modelValue.includes(option.value);
  }
  return props.modelValue === option.value;
};

const optionClasses = (option, index) => [
  "w-full px-4 py-3 text-left text-sm transition-colors duration-150",
  {
    "bg-gray-50 text-gray-400 cursor-not-allowed": option.disabled,
    "hover:bg-gray-50 cursor-pointer": !option.disabled,
    "bg-blue-50 text-blue-700":
      index === highlightedIndex.value && !option.disabled,
    "bg-blue-100": isSelected(option) && !option.disabled,
  },
];

const highlightNext = () => {
  if (filteredOptions.value.length === 0) return;

  highlightedIndex.value =
    highlightedIndex.value < filteredOptions.value.length - 1
      ? highlightedIndex.value + 1
      : 0;
};

const highlightPrevious = () => {
  if (filteredOptions.value.length === 0) return;

  highlightedIndex.value =
    highlightedIndex.value > 0
      ? highlightedIndex.value - 1
      : filteredOptions.value.length - 1;
};

const selectHighlighted = () => {
  if (
    highlightedIndex.value >= 0 &&
    filteredOptions.value[highlightedIndex.value]
  ) {
    selectOption(filteredOptions.value[highlightedIndex.value]);
  }
};

const clear = () => {
  const value = props.multiple ? [] : "";
  emit("update:modelValue", value);
  emit("change", value);
  emit("clear");
};

// Click outside directive
const clickOutsideHandler = (event) => {
  const container = event.target.closest(".base-select");
  if (!container || !container.contains(event.target)) {
    closeDropdown();
  }
};

// Lifecycle
onMounted(() => {
  document.addEventListener("click", clickOutsideHandler);
});

onUnmounted(() => {
  document.removeEventListener("click", clickOutsideHandler);
});

// Custom directive for click outside
const vClickOutside = {
  beforeMount(el, binding) {
    el.clickOutsideEvent = function (event) {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event);
      }
    };
    document.addEventListener("click", el.clickOutsideEvent);
  },
  unmounted(el) {
    document.removeEventListener("click", el.clickOutsideEvent);
  },
};
</script>

<style scoped>
/* Custom scrollbar for dropdown options */
.max-h-60 {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e0 #f7fafc;
}

.max-h-60::-webkit-scrollbar {
  width: 6px;
}

.max-h-60::-webkit-scrollbar-track {
  background: #f7fafc;
  border-radius: 3px;
}

.max-h-60::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 3px;
}

.max-h-60::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}

/* Ensure relative container for proper dropdown positioning */
.base-select {
  position: relative;
}

/* Multiple selection tags styling */
.base-select .inline-flex {
  word-break: break-word;
}

/* Horizontal scrollbar for tags */
.overflow-x-auto {
  scrollbar-width: thin;
  scrollbar-color: #d1d5db transparent;
}

.overflow-x-auto::-webkit-scrollbar {
  height: 4px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 2px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* Dropdown animation */
.absolute.z-50 {
  animation: dropdown-enter 0.2s ease-out;
  transform-origin: top;
}

@keyframes dropdown-enter {
  0% {
    opacity: 0;
    transform: translateY(-10px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Smooth transitions */
.base-select * {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Focus ring animation */
.focus\:ring-2:focus {
  animation: ring-pulse 0.2s ease-out;
}

@keyframes ring-pulse {
  0% {
    box-shadow: 0 0 0 0 currentColor;
  }
  100% {
    box-shadow: 0 0 0 3px currentColor;
  }
}

/* Prevent container overflow issues */
.relative {
  overflow: visible;
}
</style>
