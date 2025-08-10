<template>
  <div
    ref="containerRef"
    class="relative inline-block text-left z-50 export-button-container"
  >
    <div>
      <button
        ref="buttonRef"
        @click="toggleDropdown"
        :disabled="disabled || isExporting"
        :style="buttonStyle"
        :class="[
          'inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm transition-colors min-h-[40px]',
          disabled || isExporting
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
        ]"
      >
        <i class="mdi mdi-download mr-2"></i>
        <span v-if="!isExporting">ส่งออก</span>
        <span v-else>กำลังส่งออก...</span>
        <i class="mdi mdi-chevron-down ml-2"></i>
      </button>
    </div>

    <!-- Progress Bar (when exporting) -->
    <div
      v-if="isExporting"
      class="absolute top-full left-0 right-0 mt-1 z-[99999]"
    >
      <div
        class="bg-white border border-gray-200 rounded-md p-3 shadow-lg min-w-[300px]"
      >
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm text-gray-700">{{ exportStatusText }}</span>
          <span class="text-sm text-gray-500"
            >{{ Math.round(exportProgress) }}%</span
          >
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div
            class="bg-blue-600 h-2 rounded-full transition-all duration-300"
            :style="{ width: `${exportProgress}%` }"
          ></div>
        </div>
        <div v-if="exportError" class="mt-2 text-xs text-red-600">
          {{ exportError }}
        </div>
      </div>
    </div>

    <!-- Backdrop -->
    <div
      v-if="showDropdown"
      class="fixed inset-0 z-[99998]"
      @click="closeDropdown"
    ></div>

    <!-- Dropdown Menu -->
    <Transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="showDropdown && !isExporting"
        @click="$event.stopPropagation()"
        class="export-dropdown-overlay absolute top-full left-0 z-[99999] mt-2 w-72 rounded-lg bg-white shadow-2xl ring-1 ring-gray-200 focus:outline-none border border-gray-200 overflow-hidden"
        style="
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25),
            0 20px 25px -5px rgba(0, 0, 0, 0.1);
          position: absolute !important;
        "
      >
        <div class="p-5">
          <h4
            class="text-sm font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100"
          >
            ตัวเลือกการส่งออก
          </h4>

          <!-- Quick Export Options -->
          <div class="space-y-1 mb-4">
            <button
              @click="quickExport('csv', 'all')"
              class="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center group"
            >
              <i
                class="mdi mdi-file-delimited text-green-600 text-xl mr-4 group-hover:scale-110 transition-transform"
              ></i>
              <div class="flex-1">
                <div class="font-medium text-gray-900">CSV ทั้งหมด</div>
                <div class="text-xs text-gray-500 mt-0.5">
                  {{ totalOrders }} รายการ
                </div>
              </div>
            </button>

            <button
              @click="quickExport('excel', 'all')"
              class="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center group"
            >
              <i
                class="mdi mdi-microsoft-excel text-blue-600 text-xl mr-4 group-hover:scale-110 transition-transform"
              ></i>
              <div class="flex-1">
                <div class="font-medium text-gray-900">Excel ทั้งหมด</div>
                <div class="text-xs text-gray-500 mt-0.5">
                  {{ totalOrders }} รายการ
                </div>
              </div>
            </button>

            <button
              v-if="selectedOrderIds.length > 0"
              @click="quickExport('csv', 'selected')"
              class="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center group"
            >
              <i
                class="mdi mdi-file-delimited text-green-600 text-xl mr-4 group-hover:scale-110 transition-transform"
              ></i>
              <div class="flex-1">
                <div class="font-medium text-gray-900">CSV ที่เลือก</div>
                <div class="text-xs text-gray-500 mt-0.5">
                  {{ selectedOrderIds.length }} รายการ
                </div>
              </div>
            </button>

            <button
              v-if="selectedOrderIds.length > 0"
              @click="quickExport('excel', 'selected')"
              class="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center group"
            >
              <i
                class="mdi mdi-microsoft-excel text-blue-600 text-xl mr-4 group-hover:scale-110 transition-transform"
              ></i>
              <div class="flex-1">
                <div class="font-medium text-gray-900">Excel ที่เลือก</div>
                <div class="text-xs text-gray-500 mt-0.5">
                  {{ selectedOrderIds.length }} รายการ
                </div>
              </div>
            </button>
          </div>

          <div class="border-t border-gray-200 pt-3">
            <button
              @click="openAdvancedDialog"
              class="w-full text-left px-4 py-3 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center group"
            >
              <i
                class="mdi mdi-cog text-xl mr-4 group-hover:rotate-90 transition-transform duration-300"
              ></i>
              <span class="font-medium">ตัวเลือกขั้นสูง...</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onUnmounted } from "vue";
import { useExport } from "~/composables/export";
/**
 * ExportButton Component
 *
 * Props:
 * - selectedOrderIds: Array of selected order IDs
 * - totalOrders: Total number of orders
 * - disabled: Whether the button is disabled
 * - width: Dynamic width (string or number) - e.g. "100%", "200px", 200
 * - height: Dynamic height (string or number) - e.g. "40px", "50px", 40
 *
 * Usage:
 * <ExportButton
 *   :selected-order-ids="orderIds"
 *   :total-orders="1000"
 *   width="100%"
 *   height="45px"
 *   @quick-export="handleExport"
 *   @open-advanced="showAdvanced"
 * />
 */
interface Props {
  selectedOrderIds?: string[];
  totalOrders?: number;
  disabled?: boolean;
  width?: string | number;
  height?: string | number;
}

const props = withDefaults(defineProps<Props>(), {
  selectedOrderIds: () => [],
  totalOrders: 0,
  disabled: false,
  width: "auto",
  height: "40px",
});

const emit = defineEmits<{
  quickExport: [format: "csv" | "excel", type: "all" | "selected"];
  openAdvanced: [];
}>();

const {
  exportAllOrders,
  exportOrders,
  isExporting,
  exportProgress,
  exportError,
  exportStatusText,
} = useExport();

// Refs
const containerRef = ref<HTMLElement>();
const buttonRef = ref<HTMLElement>();
const showDropdown = ref(false);

// Computed style for dynamic sizing
const buttonStyle = computed(() => {
  const style: Record<string, string> = {};

  if (props.width) {
    style.width =
      typeof props.width === "number" ? `${props.width}px` : props.width;
  }

  if (props.height) {
    style.height =
      typeof props.height === "number" ? `${props.height}px` : props.height;
  }

  return style;
});

const toggleDropdown = () => {
  if (!props.disabled && !isExporting.value) {
    showDropdown.value = !showDropdown.value;

    // Position dropdown when opened
    if (showDropdown.value) {
      nextTick(() => {
        positionDropdown();
      });
    }
  }
};

const positionDropdown = () => {
  const dropdown = document.querySelector(
    ".export-dropdown-overlay"
  ) as HTMLElement;

  if (!dropdown || !buttonRef.value) {
    console.log("ExportButton: Missing elements", {
      dropdown: !!dropdown,
      buttonRef: !!buttonRef.value,
    });
    return;
  }

  const rect = buttonRef.value.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  const viewportWidth = window.innerWidth;

  // Calculate position
  let top = rect.bottom + 8;
  let left = rect.left;

  console.log("ExportButton: Positioning", {
    buttonRect: rect,
    viewport: { width: viewportWidth, height: viewportHeight },
    calculated: { top, left },
  });

  // Adjust if dropdown would go off-screen
  if (left + 200 > viewportWidth) {
    left = viewportWidth - 200 - 16;
  }

  if (top + 300 > viewportHeight) {
    top = rect.top - 300 - 8;
  }

  // Ensure minimum distance from edges
  if (left < 16) left = 16;
  if (top < 16) top = 16;

  console.log("ExportButton: Final position", { top, left });

  // Apply position
  dropdown.style.top = `${top}px`;
  dropdown.style.left = `${left}px`;
};

const closeDropdown = () => {
  showDropdown.value = false;
};

const quickExport = async (
  format: "csv" | "excel",
  type: "all" | "selected"
) => {
  console.log("Quick export clicked:", {
    format,
    type,
    selectedOrderIds: props.selectedOrderIds,
  });
  closeDropdown();

  try {
    let result;
    if (type === "all") {
      console.log("Exporting all orders...");
      result = await exportAllOrders(format);
    } else {
      console.log("Exporting selected orders...", props.selectedOrderIds);
      result = await exportOrders(props.selectedOrderIds, format);
    }

    console.log("Export result:", result);

    // Emit only if export was successful
    if (result !== undefined) {
      emit("quickExport", format, type);
    }
  } catch (error: any) {
    console.error("Quick export failed:", error);
    // Error is already handled in the composable, so we don't need to do anything here
  }
};

const openAdvancedDialog = () => {
  emit("openAdvanced");
  closeDropdown();
};

// Click outside handler
const handleClickOutside = (event: Event) => {
  if (!containerRef.value) return;

  const target = event.target as HTMLElement;

  // Check if click is outside the container
  if (!containerRef.value.contains(target)) {
    console.log("ExportButton: Click outside detected, closing dropdown");
    closeDropdown();
  }
};

// Lifecycle hooks
onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
/* Ensure the component has proper stacking context */
.relative {
  position: relative;
  z-index: auto;
}

/* Enhanced dropdown positioning and styling */
.export-dropdown-overlay {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  z-index: 2147483647 !important; /* ใช้ค่าสูงสุด */
  min-width: 288px; /* 18rem */
  max-width: 320px; /* 20rem */
}

.absolute.left-0 {
  z-index: 2147483647 !important; /* ใช้ค่าสูงสุด */
  min-width: 288px; /* 18rem */
  max-width: 320px; /* 20rem */
  position: fixed !important; /* เปลี่ยนเป็น fixed */
}

/* Enhanced shadow for dropdown menu */
.shadow-2xl {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.05);
}

/* Backdrop styling with blur effect */
.fixed.inset-0 {
  z-index: 2147483646 !important;
  backdrop-filter: blur(2px);
  background-color: rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease-in-out;
}

/* Progress bar positioning */
.absolute.top-full {
  z-index: 2147483647 !important;
}

/* Button hover effects with enhanced animations */
.hover\:bg-gray-50:hover {
  background-color: rgb(249 250 251);
  transform: translateX(2px);
}

.hover\:bg-blue-50:hover {
  background-color: rgb(239 246 255);
  transform: translateX(2px);
}

/* Group hover effects for icons */
.group:hover .group-hover\:scale-110 {
  transform: scale(1.1);
}

.group:hover .group-hover\:rotate-90 {
  transform: rotate(90deg);
}

/* Smooth transitions for all interactive elements */
.transition-colors {
  transition: background-color 0.15s ease-in-out, color 0.15s ease-in-out,
    transform 0.15s ease-in-out;
}

.transition-transform {
  transition: transform 0.2s ease-in-out;
}

/* Enhanced menu item styling */
.rounded-lg {
  border-radius: 0.5rem;
}

/* Improved typography */
.font-semibold {
  font-weight: 600;
}

/* Border styling */
.border-gray-100 {
  border-color: rgb(243 244 246);
}

.border-gray-200 {
  border-color: rgb(229 231 235);
}

/* Overflow hidden for clean rounded corners */
.overflow-hidden {
  overflow: hidden;
}
</style>
