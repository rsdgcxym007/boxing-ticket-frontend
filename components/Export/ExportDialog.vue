<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 overflow-y-auto"
    @click="closeDialog"
  >
    <div class="flex min-h-full items-center justify-center p-4">
      <div
        @click.stop
        class="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
      >
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-medium leading-6 text-gray-900">
            <i class="mdi mdi-download mr-2 text-blue-600"></i>
            ส่งออกข้อมูลออเดอร์
          </h3>
          <button
            @click="closeDialog"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <i class="mdi mdi-close text-xl"></i>
          </button>
        </div>

        <div class="space-y-4">
          <!-- Format Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              เลือกรูปแบบไฟล์
            </label>
            <div class="grid grid-cols-2 gap-3">
              <label
                :class="[
                  'relative flex cursor-pointer rounded-lg border p-4 focus:outline-none transition-all',
                  selectedFormat === 'csv'
                    ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-500'
                    : 'border-gray-300 hover:border-gray-400',
                ]"
              >
                <input
                  v-model="selectedFormat"
                  type="radio"
                  value="csv"
                  class="sr-only"
                />
                <div class="flex items-center">
                  <div class="text-sm">
                    <div class="font-medium text-gray-900 flex items-center">
                      <i class="mdi mdi-file-delimited text-green-600 mr-2"></i>
                      CSV File
                    </div>
                    <div class="text-gray-500">ไฟล์ข้อความที่แยกด้วยจุลภาค</div>
                  </div>
                </div>
                <i
                  v-if="selectedFormat === 'csv'"
                  class="mdi mdi-check-circle text-blue-600 absolute top-2 right-2"
                ></i>
              </label>

              <label
                :class="[
                  'relative flex cursor-pointer rounded-lg border p-4 focus:outline-none transition-all',
                  selectedFormat === 'excel'
                    ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-500'
                    : 'border-gray-300 hover:border-gray-400',
                ]"
              >
                <input
                  v-model="selectedFormat"
                  type="radio"
                  value="excel"
                  class="sr-only"
                />
                <div class="flex items-center">
                  <div class="text-sm">
                    <div class="font-medium text-gray-900 flex items-center">
                      <i class="mdi mdi-microsoft-excel text-blue-600 mr-2"></i>
                      Excel File
                    </div>
                    <div class="text-gray-500">ไฟล์ Excel พร้อมฟอร์แมต</div>
                  </div>
                </div>
                <i
                  v-if="selectedFormat === 'excel'"
                  class="mdi mdi-check-circle text-blue-600 absolute top-2 right-2"
                ></i>
              </label>
            </div>
          </div>

          <!-- Data Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              เลือกข้อมูล
            </label>
            <div class="space-y-2">
              <label class="flex items-center">
                <input
                  v-model="exportType"
                  type="radio"
                  value="all"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span class="ml-2 text-sm text-gray-700">
                  ออเดอร์ทั้งหมด
                  <span class="text-gray-500">({{ totalOrders }} รายการ)</span>
                </span>
              </label>

              <label class="flex items-center">
                <input
                  v-model="exportType"
                  type="radio"
                  value="selected"
                  :disabled="selectedOrderIds.length === 0"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 disabled:opacity-50"
                />
                <span class="ml-2 text-sm text-gray-700">
                  ออเดอร์ที่เลือก
                  <span class="text-gray-500"
                    >({{ selectedOrderIds.length }} รายการ)</span
                  >
                </span>
              </label>

              <label class="flex items-center">
                <input
                  v-model="exportType"
                  type="radio"
                  value="filtered"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span class="ml-2 text-sm text-gray-700">
                  ออเดอร์ตามฟิลเตอร์ปัจจุบัน
                  <span class="text-gray-500"
                    >({{ filteredOrders }} รายการ)</span
                  >
                </span>
              </label>
            </div>
          </div>

          <!-- Additional Options -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              ตัวเลือกเพิ่มเติม
            </label>
            <div class="space-y-2">
              <label class="flex items-center">
                <input
                  v-model="includePaymentDetails"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span class="ml-2 text-sm text-gray-700">
                  รวมรายละเอียดการชำระเงิน
                </span>
              </label>

              <label class="flex items-center">
                <input
                  v-model="includeSeatDetails"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span class="ml-2 text-sm text-gray-700">
                  รวมรายละเอียดที่นั่ง
                </span>
              </label>

              <label class="flex items-center">
                <input
                  v-model="includeCustomerInfo"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span class="ml-2 text-sm text-gray-700">
                  รวมข้อมูลลูกค้า
                </span>
              </label>
            </div>
          </div>

          <!-- Progress Section -->
          <div v-if="isExporting" class="bg-gray-50 rounded-lg p-4">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-gray-700">
                {{ exportStatusText }}
              </span>
              <span class="text-sm text-gray-500">
                {{ Math.round(exportProgress) }}%
              </span>
            </div>

            <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div
                class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                :style="{ width: `${exportProgress}%` }"
              ></div>
            </div>

            <div class="flex items-center text-sm text-gray-600">
              <i class="mdi mdi-loading mdi-spin mr-2"></i>
              <span>กำลังประมวลผล...</span>
            </div>
          </div>

          <!-- Error Message -->
          <div
            v-if="exportError"
            class="bg-red-50 border border-red-200 rounded-lg p-4"
          >
            <div class="flex items-center">
              <i class="mdi mdi-alert-circle text-red-400 mr-2"></i>
              <div>
                <h4 class="text-sm font-medium text-red-800">เกิดข้อผิดพลาด</h4>
                <p class="text-sm text-red-700 mt-1">{{ exportError }}</p>
              </div>
            </div>
          </div>

          <!-- Success Message -->
          <div
            v-if="exportSuccess"
            class="bg-green-50 border border-green-200 rounded-lg p-4"
          >
            <div class="flex items-center">
              <i class="mdi mdi-check-circle text-green-400 mr-2"></i>
              <div>
                <h4 class="text-sm font-medium text-green-800">ส่งออกสำเร็จ</h4>
                <p class="text-sm text-green-700 mt-1">
                  ไฟล์ได้ถูกดาวน์โหลดแล้ว
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="mt-6 flex space-x-3 justify-end">
          <button
            @click="closeDialog"
            :disabled="isExporting"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
          >
            ยกเลิก
          </button>
          <button
            @click="handleExport"
            :disabled="isExporting || isExportDisabled"
            class="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span v-if="!isExporting" class="flex items-center">
              <i class="mdi mdi-download mr-2"></i>
              ส่งออก {{ selectedFormat.toUpperCase() }}
            </span>
            <span v-else class="flex items-center">
              <i class="mdi mdi-loading mdi-spin mr-2"></i>
              กำลังส่งออก...
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useExport } from "~/composables/export";
interface Props {
  isOpen: boolean;
  selectedOrderIds?: string[];
  totalOrders?: number;
  filteredOrders?: number;
  currentFilters?: any;
}

const props = withDefaults(defineProps<Props>(), {
  selectedOrderIds: () => [],
  totalOrders: 0,
  filteredOrders: 0,
  currentFilters: () => ({}),
});

const emit = defineEmits<{
  close: [];
  exported: [options: ExportOptions];
}>();

interface ExportOptions {
  format: "csv" | "excel";
  type: "all" | "selected" | "filtered";
  includePaymentDetails: boolean;
  includeSeatDetails: boolean;
  includeCustomerInfo: boolean;
  orderIds?: string[];
  filters?: any;
}

const {
  exportOrdersAdvanced,
  isExporting,
  exportProgress,
  exportError,
  exportSuccess,
  exportStatusText,
  resetExportState,
} = useExport();

// Form state
const selectedFormat = ref<"csv" | "excel">("csv");
const exportType = ref<"all" | "selected" | "filtered">("all");
const includePaymentDetails = ref(true);
const includeSeatDetails = ref(true);
const includeCustomerInfo = ref(true);

// Computed
const isExportDisabled = computed(() => {
  return exportType.value === "selected" && props.selectedOrderIds.length === 0;
});

// Methods
const closeDialog = () => {
  if (!isExporting.value) {
    resetExportState();
    emit("close");
  }
};

const handleExport = async () => {
  try {
    const options: ExportOptions = {
      format: selectedFormat.value,
      type: exportType.value,
      includePaymentDetails: includePaymentDetails.value,
      includeSeatDetails: includeSeatDetails.value,
      includeCustomerInfo: includeCustomerInfo.value,
    };

    if (exportType.value === "selected") {
      options.orderIds = props.selectedOrderIds;
    } else if (exportType.value === "filtered") {
      options.filters = props.currentFilters;
    }

    await exportOrdersAdvanced(options);

    emit("exported", options);

    // Auto close after success
    setTimeout(() => {
      closeDialog();
    }, 2000);
  } catch (error) {
    console.error("Export failed:", error);
  }
};

// Watch for dialog open/close
watch(
  () => props.isOpen,
  (newValue) => {
    if (newValue) {
      // Reset form when dialog opens
      exportType.value = props.selectedOrderIds.length > 0 ? "selected" : "all";
    }
  }
);
</script>
