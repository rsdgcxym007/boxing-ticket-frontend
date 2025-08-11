<template>
  <div ref="containerRef" class="relative import-button-container z-50">
    <!-- Hidden File Input -->
    <input
      id="fileInputImport"
      ref="fileInput"
      type="file"
      accept=".csv,.xls,.xlsx"
      @change="handleFileSelect"
      class="hidden"
    />

    <!-- Import Button -->
    <button
      ref="buttonRef"
      @click="handleButtonClick"
      :disabled="isImporting"
      :style="{ width: props.width, height: props.height }"
      :class="[
        'flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition-colors duration-200',
        { 'opacity-50': isImporting },
        props.class,
      ]"
    >
      <Icon
        :name="isImporting ? 'eos-icons:loading' : 'mdi:file-import'"
        class="w-4 h-4"
      />
      <span v-if="isImporting" class="text-sm">
        {{ importStatusText }} ({{ importProgress }}%)
      </span>
      <span v-else class="text-sm">นำเข้าข้อมูล</span>
      <Icon
        name="mdi:chevron-down"
        class="w-4 h-4 transition-transform duration-200"
        :class="{ 'rotate-180': showDropdown }"
      />
    </button>

    <!-- Quick feedback toast -->
    <div
      v-if="showQuickFeedback"
      class="absolute top-full left-0 mt-2 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg shadow-lg"
      style="z-index: 1000001"
    >
      คลิกเพื่อเลือกไฟล์ที่ต้องการนำเข้า
    </div>

    <!-- Backdrop for dropdown -->
    <div
      v-if="showDropdown && selectedFile"
      class="dropdown-backdrop"
      @click="closeDropdown"
    ></div>

    <!-- Dropdown Menu for Options (only show when file is selected) -->
    <div
      v-if="showDropdown && selectedFile"
      @click="preventClose"
      class="dropdown-overlay"
    >
      <div class="p-4">
        <h3 class="font-semibold text-gray-800 mb-3">นำเข้าข้อมูลออเดอร์</h3>

        <!-- Selected File Info -->
        <div class="mb-4 p-2 bg-blue-50 border border-blue-200 rounded">
          <p class="text-sm text-blue-800">
            ✓ เลือกไฟล์: {{ selectedFile.name }} ({{
              Math.round(selectedFile.size / 1024)
            }}KB)
          </p>
          <button
            @click="resetFile"
            class="text-xs text-red-600 hover:text-red-800 mt-1"
          >
            เลือกไฟล์ใหม่
          </button>
        </div>

        <!-- Import Options -->
        <div class="space-y-2 mb-4">
          <label class="flex items-center text-sm">
            <input
              v-model="importOptions.validateData"
              type="checkbox"
              class="mr-2 rounded"
            />
            ตรวจสอบข้อมูล
          </label>
          <label class="flex items-center text-sm">
            <input
              v-model="importOptions.preventDuplicates"
              type="checkbox"
              class="mr-2 rounded"
            />
            ป้องกันข้อมูลซ้ำ
          </label>
          <label class="flex items-center text-sm">
            <input
              v-model="importOptions.updateExisting"
              type="checkbox"
              class="mr-2 rounded"
            />
            อัปเดตข้อมูลที่มีอยู่
          </label>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-2">
          <button
            @click="performImport"
            :disabled="!selectedFile || isImporting"
            class="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white text-sm rounded-lg transition-colors duration-200"
          >
            {{ isImporting ? "กำลังนำเข้า..." : "นำเข้า" }}
          </button>
          <button
            @click="closeDropdown"
            class="px-3 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 text-sm rounded-lg transition-colors duration-200"
          >
            ยกเลิก
          </button>
        </div>

        <!-- Progress Bar -->
        <div v-if="isImporting" class="mt-3">
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div
              class="bg-green-600 h-2 rounded-full transition-all duration-300"
              :style="{ width: `${importProgress}%` }"
            ></div>
          </div>
          <p class="text-xs text-gray-600 mt-1 text-center">
            {{ importStatusText }} {{ importProgress }}%
          </p>
        </div>

        <!-- Import Result -->
        <div
          v-if="importResult && importSuccess"
          class="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg"
        >
          <h4 class="text-sm font-semibold text-green-800 mb-1">ผลการนำเข้า</h4>
          <ul class="text-xs text-green-700 space-y-1">
            <!-- รองรับ format ใหม่ -->
            <li v-if="(importResult as any).ordersUpdated !== undefined">
              ✓ อัปเดตออเดอร์:
              {{ (importResult as any).ordersUpdated || 0 }} รายการ
            </li>
            <li v-if="(importResult as any).paymentsUpdated !== undefined">
              ✓ อัปเดตการชำระเงิน:
              {{ (importResult as any).paymentsUpdated || 0 }} รายการ
            </li>
            <li
              v-if="(importResult as any).commissionsRecalculated !== undefined"
            >
              ✓ คำนวณค่าคอมมิชชันใหม่:
              {{ (importResult as any).commissionsRecalculated || 0 }} รายการ
            </li>
            <li v-if="(importResult as any).details?.length">
              📋 รายละเอียด: {{ (importResult as any).details.length }} ออเดอร์
            </li>

            <!-- รองรับ format เก่า -->
            <li v-if="importResult.imported !== undefined">
              ✓ นำเข้าสำเร็จ: {{ importResult.imported || 0 }} รายการ
            </li>
            <li v-if="importResult.updated !== undefined">
              ✓ อัปเดต: {{ importResult.updated }} รายการ
            </li>
            <li v-if="importResult.duplicates !== undefined">
              ⚠ ข้าม (ซ้ำ): {{ importResult.duplicates }} รายการ
            </li>

            <!-- แสดง errors สำหรับทั้งสอง format -->
            <li v-if="importResult.errors?.length">
              ❌ ข้อผิดพลาด: {{ importResult.errors.length }} รายการ
            </li>
          </ul>

          <!-- แสดงรายละเอียดเพิ่มเติมสำหรับ format ใหม่ -->
          <div v-if="(importResult as any).details?.length" class="mt-2">
            <button
              @click="showDetails = !showDetails"
              class="text-xs text-green-600 hover:text-green-800 underline"
            >
              {{ showDetails ? "ซ่อน" : "แสดง" }}รายละเอียด
            </button>
            <div v-if="showDetails" class="mt-2 max-h-32 overflow-y-auto">
              <div
                v-for="detail in (importResult as any).details"
                :key="detail.orderNumber"
                class="text-xs bg-white p-2 rounded border mb-1"
              >
                <div class="font-medium text-gray-800">
                  {{ detail.orderNumber }}
                </div>
                <div class="text-gray-600">
                  เปลี่ยนแปลง: {{ detail.changes?.join(", ") || "ไม่ระบุ" }}
                </div>
                <div
                  :class="detail.success ? 'text-green-600' : 'text-red-600'"
                >
                  {{ detail.success ? "✓ สำเร็จ" : "❌ ล้มเหลว" }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Error Display -->
        <div
          v-if="importError"
          class="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg"
        >
          <p class="text-sm text-red-700">{{ importError }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, nextTick, onMounted, onUnmounted } from "vue";
import { useExport } from "~/composables/export";

// Props
interface Props {
  width?: string;
  height?: string;
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  width: "auto",
  height: "40px",
  class: "",
});

// Define emits
const emit = defineEmits<{
  "import-success": [result: any];
  "import-error": [error: any];
}>();

// Extend HTMLElement interface
interface ExtendedHTMLElement extends HTMLElement {
  clickAwayEvent?: (event: Event) => void;
}

// Composables
const {
  isImporting,
  importProgress,
  importError,
  importSuccess,
  importResult,
  importStatusText,
  importOrdersFromFile,
  resetImportState,
} = useExport();

// State
const containerRef = ref<HTMLElement>();
const buttonRef = ref<HTMLElement>();
const showDropdown = ref(false);
const selectedFile = ref<File | null>(null);
const fileInput = ref<HTMLInputElement>();
const showQuickFeedback = ref(false);
const showDetails = ref(false);

// Import options
const importOptions = reactive({
  validateData: true,
  preventDuplicates: true,
  updateExisting: false,
});

// Methods
const handleButtonClick = (event: Event) => {
  event.preventDefault();
  event.stopPropagation();

  console.log("Import button clicked");

  if (!selectedFile.value) {
    // No file selected, open file picker
    console.log("Opening file picker");
    if (fileInput.value) {
      fileInput.value.click();
    }
    // Show quick feedback
    showQuickFeedback.value = true;
    setTimeout(() => {
      showQuickFeedback.value = false;
    }, 2000);
  } else {
    // File already selected, toggle dropdown
    console.log("Current dropdown state:", showDropdown.value);
    showDropdown.value = !showDropdown.value;
    console.log("New dropdown state:", showDropdown.value);

    // Position dropdown
    if (showDropdown.value) {
      nextTick(() => {
        positionDropdown();
      });
    }
  }
};

const positionDropdown = () => {
  const dropdown = document.querySelector(".dropdown-overlay") as HTMLElement;

  if (!dropdown || !buttonRef.value) {
    console.log("ImportButton: Missing elements", {
      dropdown: !!dropdown,
      buttonRef: !!buttonRef.value,
    });
    return;
  }

  const rect = buttonRef.value.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  const viewportWidth = window.innerWidth;

  // Calculate position - เพิ่มระยะห่างจากปุ่ม
  let top = rect.bottom + 8;
  let left = rect.left;

  console.log("ImportButton: Positioning", {
    buttonRect: rect,
    viewport: { width: viewportWidth, height: viewportHeight },
    calculated: { top, left },
  });

  // Adjust if dropdown would go off-screen
  if (left + 256 > viewportWidth) {
    left = viewportWidth - 256 - 16;
  }

  if (top + 400 > viewportHeight) {
    top = rect.top - 400 - 8;
  }

  // Ensure minimum distance from edges
  if (left < 16) left = 16;
  if (top < 16) top = 16;

  console.log("ImportButton: Final position", { top, left });

  // Apply position
  dropdown.style.top = `${top}px`;
  dropdown.style.left = `${left}px`;
};

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  console.log("File selected:", target.files);
  if (target.files && target.files.length > 0) {
    selectedFile.value = target.files[0];
    console.log(
      "Selected file:",
      selectedFile.value.name,
      selectedFile.value.size
    );
    // Show dropdown automatically when file is selected
    showDropdown.value = true;
    // Position dropdown
    nextTick(() => {
      positionDropdown();
    });
  }
};

const resetFile = () => {
  selectedFile.value = null;
  if (fileInput.value) {
    fileInput.value.value = "";
  }
  showDropdown.value = false;
  console.log("File reset");
};

const performImport = async () => {
  if (!selectedFile.value) {
    console.log("No file selected");
    return;
  }

  console.log("Starting import...", selectedFile.value.name);

  try {
    // Determine format from file extension
    const fileName = selectedFile.value.name.toLowerCase();
    const format = fileName.endsWith(".csv") ? "csv" : "excel";

    console.log("Import options:", {
      file: selectedFile.value.name,
      format,
      validateData: importOptions.validateData,
      preventDuplicates: importOptions.preventDuplicates,
      updateExisting: importOptions.updateExisting,
    });

    await importOrdersFromFile({
      file: selectedFile.value,
      format,
      validateData: importOptions.validateData,
      preventDuplicates: importOptions.preventDuplicates,
      updateExisting: importOptions.updateExisting,
    });

    // Emit success event พร้อมผลลัพธ์
    emit("import-success", importResult.value);

    // Reset form after successful import
    setTimeout(() => {
      selectedFile.value = null;
      if (fileInput.value) {
        fileInput.value.value = "";
      }
      resetImportState();
    }, 3000);
  } catch (error) {
    console.error("Import failed:", error);
    // Emit error event
    emit("import-error", error);
  }
};

const closeDropdown = () => {
  console.log("Closing dropdown");
  showDropdown.value = false;
};

// Prevent dropdown from closing when clicking inside
const preventClose = (event: Event) => {
  event.stopPropagation();
};

// Click outside handler
const handleClickOutside = (event: Event) => {
  if (!containerRef.value) return;

  const target = event.target as HTMLElement;

  // Check if click is outside the container
  if (!containerRef.value.contains(target)) {
    console.log("Click outside detected, closing dropdown");
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

// Click away directive (kept as backup)
const vClickAway = {
  mounted(el: ExtendedHTMLElement, binding: any) {
    el.clickAwayEvent = (event: Event) => {
      if (!(el === event.target || el.contains(event.target as Node))) {
        binding.value();
      }
    };
    document.addEventListener("click", el.clickAwayEvent);
  },
  unmounted(el: ExtendedHTMLElement) {
    if (el.clickAwayEvent) {
      document.removeEventListener("click", el.clickAwayEvent);
    }
  },
};
</script>

<style scoped>
/* Container styling */
.import-button-container {
  position: relative;
  z-index: auto;
}

/* File input enhancements */
.hidden {
  display: none !important;
}

/* Button width and height can be overridden by parent */
.import-button-container button {
  transition: all 0.2s ease-in-out;
}

.import-button-container button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Fixed dropdown positioning - ใช้ absolute positioning แทน fixed */
.dropdown-overlay {
  position: absolute !important;
  top: 100% !important;
  left: 0 !important;
  width: 320px !important;
  max-width: 90vw !important;
  background: white !important;
  border: 1px solid #d1d5db !important;
  border-radius: 0.5rem !important;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 20px 25px -5px rgba(0, 0, 0, 0.1) !important;
  z-index: 999999 !important;
  margin-top: 4px !important;
}

/* Backdrop to prevent clicks */
.dropdown-backdrop {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  z-index: 999998 !important;
  background: transparent !important;
}
</style>
