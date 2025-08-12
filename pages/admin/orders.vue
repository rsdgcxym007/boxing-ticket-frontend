<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200"
  >
    <div class="max-w-7xl mx-auto p-4 space-y-6">
      <!-- หัวข้อหลัก -->
      <div
        class="bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-blue-200 p-6"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="bg-blue-500 p-3 rounded-lg shadow-md">
              <i class="mdi mdi-clipboard-text-outline text-white text-xl"></i>
            </div>
            <div>
              <h1 class="text-2xl font-bold text-blue-900">รายการออเดอร์</h1>
              <p class="text-blue-700 text-sm">จัดการและติดตามออเดอร์ทั้งหมด</p>
            </div>
          </div>
          <div class="text-right">
            <div class="text-3xl font-bold text-blue-900">
              {{ pageData.totalCount }}
            </div>
            <div class="text-sm text-blue-600">รายการทั้งหมด</div>
          </div>
        </div>
      </div>

      <!-- ส่วนกรองข้อมูล -->
      <div
        class="bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-blue-200 p-6"
        style="overflow: visible; z-index: 10; position: relative"
      >
        <div class="flex items-center gap-2 mb-6">
          <i class="mdi mdi-filter-outline text-blue-500 text-lg"></i>
          <h2 class="text-lg font-semibold text-blue-900">กรองข้อมูล</h2>
        </div>

        <div
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 relative"
          style="overflow: visible; position: relative"
        >
          <!-- ค้นหา -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-blue-700">
              ค้นหาออเดอร์
            </label>
            <BaseInput
              v-model="pageData.filters.search"
              @input="onOrderIdChange"
              placeholder="เลขที่ออเดอร์, ชื่อ, เบอร์โทร,ชื่อโรงแรมม,V/c"
              class="w-full h-[40px] bg-blue-50/70 border-blue-200 text-blue-900 placeholder-blue-500 focus:ring-blue-500 focus:border-blue-500 rounded-lg shadow-sm"
            />
          </div>

          <!-- วันที่แสดง -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-blue-700">
              วันที่แสดง
            </label>
            <DatePicker
              v-model="pageData.filters.showDate"
              placeholder="เลือกวันที่แสดง"
              @update:modelValue="onShowDateChange"
              minDate=""
              :inputClassName="'w-full text-black rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500'"
              :wrapperClassName="'w-full h-[40.5px]'"
              :inputStyle="{
                height: '40.5px',
                padding: '0 14px',
                minHeight: 0,
                maxHeight: 'none',
                boxSizing: 'border-box',
              }"
            />
          </div>

          <!-- สร้างโดย -->
          <div class="space-y-2 relative z-10">
            <label class="block text-sm font-medium text-blue-700">
              สร้างโดย
            </label>
            <BaseSelect
              v-model="pageData.filters.createdBy"
              :options="masterStaffAdmin"
              clearable
              option-label="name"
              option-value="id"
              placeholder="เลือกผู้สร้างออเดอร์"
              @change="onCreateByChange"
              class="w-full h-[40px] bg-blue-50/70 border-blue-200 text-blue-900 focus:ring-blue-500 focus:border-blue-500 rounded-lg shadow-sm"
            />
          </div>

          <!-- สถานะออเดอร์ -->
          <div class="space-y-2 relative z-10">
            <label class="block text-sm font-medium text-blue-700">
              สถานะออเดอร์
            </label>
            <BaseSelect
              v-model="pageData.filters.status"
              :options="orderStatusOptions"
              placeholder="เลือกสถานะ"
              clearable
              multiple
              :closeOnSelect="false"
              @change="onOrderStatusChange"
              class="w-full h-[40px] bg-blue-50/70 border-blue-200 text-blue-900 focus:ring-blue-500 focus:border-blue-500 rounded-lg shadow-sm"
            />
          </div>

          <!-- วิธีชำระเงิน -->
          <div class="space-y-2 relative z-10">
            <label class="block text-sm font-medium text-blue-700">
              วิธีชำระเงิน
            </label>
            <BaseSelect
              v-model="pageData.filters.paymentMethod"
              :options="paymentMethodOptions"
              placeholder="เลือกวิธีชำระเงิน"
              clearable
              @change="onPaymentMethodChange"
              class="w-full h-[40px] bg-blue-50/70 border-blue-200 text-blue-900 focus:ring-blue-500 focus:border-blue-500 rounded-lg shadow-sm"
            />
          </div>

          <!-- ประเภทการซื้อ -->
          <div class="space-y-2 relative z-10">
            <label class="block text-sm font-medium text-blue-700">
              ประเภทการซื้อ
            </label>
            <BaseSelect
              v-model="pageData.filters.purchaseType"
              :options="purchaseTypeOptions"
              placeholder="เลือกประเภทการซื้อ"
              clearable
              @change="onPurchaseTypeChange"
              class="w-full h-[40px] bg-blue-50/70 border-blue-200 text-blue-900 focus:ring-blue-500 focus:border-blue-500 rounded-lg shadow-sm"
            />
          </div>

          <!-- สถานะการเข้าร่วม -->
          <div class="space-y-2 relative z-10">
            <label class="block text-sm font-medium text-blue-700">
              สถานะการเข้าร่วม
            </label>
            <BaseSelect
              v-model="pageData.filters.attendanceStatus"
              :options="attendanceStatusOptions"
              placeholder="เลือกสถานะการเข้าร่วม"
              clearable
              @change="onAttendanceStatusChange"
              class="w-full h-[40px] bg-blue-50/70 border-blue-200 text-blue-900 focus:ring-blue-500 focus:border-blue-500 rounded-lg shadow-sm"
            />
          </div>

          <!-- ชื่อผู้แนะนำ -->
          <div class="space-y-2 relative z-10">
            <label class="block text-sm font-medium text-blue-700">
              ชื่อผู้แนะนำ
            </label>
            <BaseSelect
              v-model="pageData.filters.referrerName"
              :options="masterData"
              placeholder="เลือกชื่อผู้แนะนำ"
              clearable
              searchable
              @change="onReferrerNameChange"
              class="w-full h-[40px] bg-blue-50/70 border-blue-200 text-blue-900 focus:ring-blue-500 focus:border-blue-500 rounded-lg shadow-sm"
            />
          </div>

          <!-- รายการต่อหน้า -->
          <div class="space-y-2 relative z-10">
            <label class="block text-sm font-medium text-blue-700">
              รายการต่อหน้า
            </label>
            <BaseSelect
              v-model="pageData.limit"
              :options="optionsShowData"
              option-label="label"
              option-value="value"
              placeholder="เลือกรายการต่อหน้า"
              @change="fetchData"
              class="w-full h-[40px] bg-blue-50/70 border-blue-200 text-blue-900 focus:ring-blue-500 focus:border-blue-500 rounded-lg shadow-sm"
            />
          </div>

          <!-- ส่งออกข้อมูล -->
          <div class="space-y-2 relative z-20">
            <label class="block text-sm font-medium text-blue-700">
              ส่งออกข้อมูล
            </label>
            <ExportButton
              :selected-order-ids="selectedOrderIds"
              :filter-ids="pageData.orders.map((o) => o.id)"
              :total-orders="pageData.totalCount"
              :disabled="pageData.loading"
              @quick-export="handleQuickExport"
              @open-advanced="showExportDialog = true"
              width="100%"
              height="40px"
              class="w-full relative z-20"
            />
          </div>

          <!-- นำเข้าข้อมูล -->
          <div class="space-y-2 relative z-20">
            <label class="block text-sm font-medium text-blue-700">
              นำเข้าข้อมูล
            </label>
            <ImportButton
              class="w-full relative z-20"
              width="100%"
              height="40px"
              @import-success="handleImportSuccess"
            />
          </div>

          <!-- ส่งออก PDF -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-blue-700">
              ส่งออก PDF
            </label>
            <BaseButton
              @click="handleExportPDF"
              :disabled="pageData.loading || exportPdfLoading"
              :style="{ width: '100%', height: '40px' }"
              class="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium rounded-lg shadow-md transition-all duration-200 flex items-center justify-center"
            >
              <i class="mdi mdi-file-pdf-box text-lg mr-2"></i>
              <span class="text-sm">PDF</span>
            </BaseButton>
          </div>
        </div>
      </div>

      <!-- ส่วนแสดงรายการออเดอร์ -->
      <!-- รายการออเดอร์ -->
      <div class="space-y-4">
        <!-- Loading State -->
        <div
          v-if="pageData.loading"
          class="bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-blue-200 p-8"
        >
          <div class="text-center">
            <BaseSpinner size="large" />
            <p class="mt-4 text-blue-700 font-medium">กำลังโหลดข้อมูล...</p>
          </div>
        </div>

        <!-- รายการออเดอร์ -->
        <div v-else>
          <!-- เพิ่มส่วนเลือกทั้งหมด -->
          <div
            class="bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-blue-200 p-4 mb-4"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <label class="flex items-center gap-2">
                  <input
                    type="checkbox"
                    :checked="isAllSelected"
                    @change="toggleSelectAll"
                    class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span class="text-sm font-medium text-blue-900">
                    เลือกทั้งหมด
                  </span>
                </label>
                <span class="text-sm text-blue-700">
                  เลือกแล้ว {{ selectedOrderIds.length }} จาก
                  {{ pageData.orders.length }} รายการ
                </span>
              </div>
              <div class="flex items-center gap-2">
                <button
                  v-if="selectedOrderIds.length > 0"
                  @click="clearSelection"
                  class="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  ยกเลิกการเลือก
                </button>
              </div>
            </div>
          </div>

          <AdminOrderCardList
            :orders="pageData.orders"
            :selectedOrderIds="selectedOrderIds"
            :page="pageData.page"
            :hasNext="pageData.page < pageData.totalPage"
            :total="pageData.totalCount"
            :perPage="pageData.limit"
            @update:page="onPageChange"
            @change-seats="onChangeSeats"
            @update-status="onUpdateStatus"
            @cancel-order="onCancelOrder"
            @generate-tickets="onGenerateTickets"
            @edit-order="onEditOrder"
            @update-attendance="onUpdateAttendance"
            @toggle-selection="onToggleSelection"
          />
        </div>
      </div>
    </div>
  </div>

  <!-- Modal สำหรับแสดง Thermal Receipt PDF -->
  <div
    v-if="showThermalModal"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
  >
    <div
      class="bg-white/95 backdrop-blur-md rounded-xl shadow-2xl max-w-3xl w-full mx-4 p-6 relative border border-blue-200"
    >
      <button
        @click="closeThermalModal"
        class="absolute top-4 right-4 w-8 h-8 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full flex items-center justify-center transition-colors"
      >
        <i class="mdi mdi-close text-lg"></i>
      </button>
      <div class="flex items-center gap-3 mb-6">
        <div class="bg-blue-500 p-2 rounded-lg">
          <i class="mdi mdi-file-pdf-box text-white text-lg"></i>
        </div>
        <h3 class="text-xl font-bold text-blue-900">
          Thermal Receipt PDF Preview
        </h3>
      </div>
      <div
        v-if="thermalPdfError"
        class="bg-red-50 border border-red-200 rounded-lg p-4 text-center"
      >
        <i class="mdi mdi-alert-circle text-red-500 text-2xl mb-2"></i>
        <p class="text-red-700 font-medium">
          ไม่สามารถแสดงไฟล์ PDF ได้ หรือไฟล์ว่าง/ผิดรูปแบบ
        </p>
      </div>
      <iframe
        v-if="!thermalPdfError"
        :src="thermalPdfUrl"
        class="w-full h-[600px] rounded-lg border border-blue-200"
      ></iframe>
    </div>
  </div>
  <!-- Modal สำหรับตัวยืน -->
  <StandingTicketModal
    v-model:showModal="showModal"
    :order="orderData"
    :modelValue="showModal"
    :isOpen="showModal"
    @success="fetchData"
    @update:showModal="
      async (value) => {
        if (value == false) {
          await fetchData();
        }
        showModal = value;
      }
    "
  />

  <!-- Modal สำหรับอัพเดทสถานะการเข้าร่วม -->
  <AttendanceUpdateModal
    v-model:showModal="showAttendanceModal"
    :order="selectedOrderForAttendance"
    @success="onAttendanceUpdateSuccess"
    @close="showAttendanceModal = false"
  />

  <!-- Export PDF Modal -->
  <div
    v-if="exportPdfModal"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
  >
    <div
      class="bg-white/95 backdrop-blur-md rounded-xl shadow-2xl max-w-3xl w-full mx-4 p-6 relative border border-blue-200"
    >
      <button
        @click="
          () => {
            exportPdfModal = false;
            if (exportPdfUrl) {
              window.URL.revokeObjectURL(exportPdfUrl);
              exportPdfUrl = '';
            }
          }
        "
        class="absolute top-4 right-4 w-8 h-8 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full flex items-center justify-center transition-colors"
      >
        <i class="mdi mdi-close text-lg"></i>
      </button>
      <div class="flex items-center gap-3 mb-6">
        <div class="bg-blue-500 p-2 rounded-lg">
          <i class="mdi mdi-file-pdf-box text-white text-lg"></i>
        </div>
        <h3 class="text-xl font-bold text-blue-900">PDF Preview</h3>
      </div>
      <div
        v-if="exportPdfError"
        class="bg-red-50 border border-red-200 rounded-lg p-4 text-center"
      >
        <i class="mdi mdi-alert-circle text-red-500 text-2xl mb-2"></i>
        <p class="text-red-700 font-medium">{{ exportPdfError }}</p>
      </div>
      <div
        v-else-if="exportPdfLoading"
        class="flex flex-col items-center justify-center py-12"
      >
        <BaseSpinner size="large" />
        <p class="mt-4 text-blue-700 font-medium">กำลังสร้าง PDF...</p>
      </div>
      <iframe
        v-else-if="exportPdfUrl"
        :src="exportPdfUrl"
        class="w-full h-[600px] rounded-lg border border-blue-200"
      ></iframe>
    </div>
  </div>

  <!-- Export Dialog -->
  <ExportDialog
    :is-open="showExportDialog"
    :selected-order-ids="selectedOrderIds"
    :total-orders="pageData.totalCount"
    :filtered-orders="pageData.totalCount"
    :current-filters="getCurrentFilters()"
    @close="showExportDialog = false"
    @exported="handleExportCompleted"
  />
</template>

<script setup>
// นำเข้า composables และ utilities ที่จำเป็น
import { useI18n } from "vue-i18n";
import { reactive, onMounted, ref, onUnmounted, watch } from "vue";
import { useDebounceFn } from "@vueuse/core";
import StandingTicketModal from "~/components/StandingTicketModal.vue";
import AttendanceUpdateModal from "~/components/AttendanceUpdateModal.vue";
import BaseButton from "~/components/base/BaseButton.vue";
import { ZONE_IDS_BY_NAME } from "~~/utils/zoneEnums";
import { useOrder } from "~/composables/useOrder";
import { usePageData } from "~/stores/pageData";
import DatePicker from "~/components/DatePicker.vue";
import { useReferrerMasterData } from "~/composables/useReferrerMasterData";
import {
  orderStatusOptions,
  paymentMethodOptions,
  purchaseTypeOptions,
  attendanceStatusOptions,
} from "~/utils/orderOptions";
import { useSingleToast } from "~/composables/useSingleToast";
import { useExport } from "~/composables/export";
import ExportButton from "~/components/Export/ExportButton.vue";
import ImportButton from "~/components/Export/ImportButton.vue";
import ExportDialog from "~/components/Export/ExportDialog.vue";
import dayjs from "dayjs";
import { navigateTo } from "nuxt/app";

// ตั้งค่า metadata สำหรับหน้า
definePageMeta({
  layout: "default",
  middleware: "only-admin-staff",
  title: "รายการออเดอร์",
});

const optionsShowData = [
  { label: "ทั้งหมด", value: -1 },
  { label: "10", value: 10 },
  { label: "20", value: 20 },
  { label: "40", value: 40 },
  { label: "60", value: 60 },
];
// ตัวแปร reactive สำหรับจัดการสถานะ
const showModal = ref(false);
const pageData = usePageData();
const orderData = reactive({});
const { cancelOrder, generateTickets, downloadThermalReceipt, updateOrder } =
  useOrder();
const { showToast } = useSingleToast();
const { exportOrders, exportAllOrders, exportWithProgress } = useExport();

// Attendance update related state
const showAttendanceModal = ref(false);
const selectedOrderForAttendance = ref(null);

// Export related state
const showExportDialog = ref(false);
const selectedOrderIds = ref([]);
const collapsed = ref(false);
const showThermalModal = ref(false);
const generatedTickets = ref([]);
const isDownloadingThermal = ref(false);
const thermalPdfUrl = ref("");
const thermalPdfError = ref(false);

// Selection related computed
const isAllSelected = computed(() => {
  return (
    pageData.orders.length > 0 &&
    selectedOrderIds.value.length === pageData.orders.length
  );
});

// Selection functions
const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedOrderIds.value = [];
  } else {
    selectedOrderIds.value = pageData.orders.map((order) => order.id);
  }
};

const clearSelection = () => {
  selectedOrderIds.value = [];
};

const onToggleSelection = (orderId) => {
  const index = selectedOrderIds.value.indexOf(orderId);
  if (index > -1) {
    selectedOrderIds.value.splice(index, 1);
  } else {
    selectedOrderIds.value.push(orderId);
  }
};

const exportPdfModal = ref(false);
const exportPdfUrl = ref("");
const exportPdfLoading = ref(false);
const exportPdfError = ref("");
const {
  masterData,
  masterStaffAdmin,
  fetchMasterData,
  fetchMasterStaffAdmin,
  fetchAllMasterData,
} = useReferrerMasterData();

const createByOptions = ref([]); // เพิ่มบรรทัดนี้เพื่อกำหนดค่าเริ่มต้นให้กับ createByOptions

const getZoneLabel = (value) => {
  return (
    pageData.zoneOptions.find((s) => s.value === value)?.label || "ทั้งหมด"
  );
};

const getStatusLabel = (value) => {
  return (
    pageData.statusOptions.find((s) => s.value === value)?.name || "ทั้งหมด"
  );
};

const fetchData = async () => {
  pageData.loading = true;

  try {
    const res = await useOrder().getOrders({
      page: pageData.page,
      limit: pageData.limit,
      status: pageData.filters.status,
      search: pageData.filters.search,
      zone: ZONE_IDS_BY_NAME[pageData.filters.zone] || undefined,
      createdBy: pageData.filters.createdBy || undefined,
      showDate:
        dayjs(
          pageData.filters.showDate ? pageData.filters.showDate : new Date()
        ).format("YYYY-MM-DD") || new Date(),
      paymentMethod: pageData.filters.paymentMethod || undefined,
      purchaseType: pageData.filters.purchaseType || undefined,
      attendanceStatus: pageData.filters.attendanceStatus || undefined,
      referrerName: pageData.filters.referrerName || undefined,
    });

    pageData.orders = res.data;
    // ไม่ต้อง auto-select ทุกรายการแล้ว เหลือแค่รายการที่เลือกไว้ก่อนหน้า
    selectedOrderIds.value = selectedOrderIds.value.filter((id) =>
      res.data.some((order) => order.id === id)
    );
    pageData.totalCount = res.total;
    pageData.totalPage = res.totalPages;
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการโหลดข้อมูล:", error);
  } finally {
    pageData.loading = false;
  }
};

const onCreateByChange = () => {
  pageData.page = 1;
  fetchData();
};
const onShowDateChange = () => {
  pageData.page = 1;
  fetchData();
};

const onChangeSeats = (order) => {
  Object.assign(orderData, order);
  pageData.selectedZone = order.zoneName;
  pageData.showZoneModal = true;
};

const onUpdateStatus = (order) => {
  if (order.seats.length === 0) {
    Object.assign(orderData, order);
    showModal.value = true;
  }
};
const onOrderStatusChange = () => {
  pageData.page = 1;
  fetchData();
};
const onPaymentMethodChange = () => {
  pageData.page = 1;
  fetchData();
};

const onPurchaseTypeChange = () => {
  pageData.page = 1;
  fetchData();
};

const onAttendanceStatusChange = () => {
  pageData.page = 1;
  fetchData();
};
const onReferrerNameChange = () => {
  pageData.page = 1;
  fetchData();
};

const handleExportPDF = async () => {
  try {
    const query = {
      status: pageData.filters.status || undefined,
      search: pageData.filters.search || undefined,
      createdBy: pageData.filters.createdBy || undefined,
      showDate: pageData.filters.showDate
        ? dayjs(pageData.filters.showDate).format("YYYY-MM-DD")
        : dayjs(new Date()).format("YYYY-MM-DD"),
      paymentMethod: pageData.filters.paymentMethod || undefined,
      purchaseType: pageData.filters.purchaseType || undefined,
      attendanceStatus: pageData.filters.attendanceStatus || undefined,
      referrerName: pageData.filters.referrerName || undefined,
    };
    Object.keys(query).forEach(
      (key) => query[key] === undefined && delete query[key]
    );
    await navigateTo({
      path: "/admin/orders-export",
      query,
    });
  } catch (error) {
    showToast("error", "เกิดข้อผิดพลาดในการส่งออก PDF");
  }
};

// ฟังก์ชันสำหรับสร้าง filters object
const getCurrentFilters = () => {
  return {
    status: pageData.filters.status,
    search: pageData.filters.search,
    zone: ZONE_IDS_BY_NAME[pageData.filters.zone] || undefined,
    createdBy: pageData.filters.createdBy || undefined,
    showDate: dayjs(
      pageData.filters.showDate ? pageData.filters.showDate : new Date()
    ).format("YYYY-MM-DD"),
    paymentMethod: pageData.filters.paymentMethod || undefined,
    purchaseType: pageData.filters.purchaseType || undefined,
    attendanceStatus: pageData.filters.attendanceStatus || undefined,
    referrerName: pageData.filters.referrerName || undefined,
  };
};

// Export functions
const handleQuickExport = async (format, type) => {
  console.log(
    "Quick export:",
    format,
    type,
    "Selected IDs:",
    selectedOrderIds.value
  );

  try {
    const { exportOrders, exportAllOrders, exportWithProgress } = useExport();

    if (type === "all") {
      // ส่งออกทั้งหมดตาม filters ปัจจุบัน
      const filters = getCurrentFilters();

      // ส่ง filters แทนการส่ง orderIds ว่าง
      await exportWithProgress(
        pageData.orders.map((o) => o.id),
        format,
        { filters }
      );
    } else {
      // ส่งออกเฉพาะที่เลือก
      if (selectedOrderIds.value.length === 0) {
        showToast("warning", "กรุณาเลือกออเดอร์ที่ต้องการส่งออก");
        return;
      }
      await exportOrders(selectedOrderIds.value, format);
    }

    showToast("success", `กำลังส่งออกไฟล์ ${format.toUpperCase()}`);
  } catch (error) {
    console.error("Export failed:", error);
    showToast("error", "การส่งออกล้มเหลว");
  }
};

const handleExportCompleted = (options) => {
  console.log("Export completed:", options);
  showToast("success", `ส่งออกไฟล์ ${options.format.toUpperCase()} สำเร็จ`);
};

const onCancelOrder = async (order) => {
  try {
    await cancelOrder(order.id);
    fetchData();
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการยกเลิกออเดอร์:", error);
  }
};
const handleDownloadThermal = async (orderId) => {
  isDownloadingThermal.value = true;
  thermalPdfError.value = false;
  try {
    const blob = await downloadThermalReceipt(orderId);
    if (!blob || blob.size < 1000) {
      thermalPdfError.value = true;
      thermalPdfUrl.value = "";
      showThermalModal.value = true;
      return;
    }
    const url = window.URL.createObjectURL(blob);
    thermalPdfUrl.value = url;
    showThermalModal.value = true;
  } catch (err) {
    thermalPdfError.value = true;
    thermalPdfUrl.value = "";
    showThermalModal.value = true;
  } finally {
    isDownloadingThermal.value = false;
  }
};

const closeThermalModal = () => {
  showThermalModal.value = false;
  thermalPdfError.value = false;
  if (thermalPdfUrl.value) {
    window.URL.revokeObjectURL(thermalPdfUrl.value);
    thermalPdfUrl.value = "";
  }
};
const onGenerateTickets = async (order) => {
  try {
    const tickets = await generateTickets(order.id);
    generatedTickets.value = tickets.tickets.map((ticket) => ({
      orderId: ticket.orderId,
      seatNumber: ticket?.seatNumber,
      customerName: ticket.customerName || "ผู้ซื้อตั๋ว",
      showDate: ticket.showDate || "",
      type: ticket.type,
      zone: ticket?.zone?.name,
    }));
    // เปิด preview thermal receipt PDF อัตโนมัติหลังสร้างตั๋ว
    if (generatedTickets.value.length > 0) {
      await handleDownloadThermal(generatedTickets.value[0].orderId);
    }
    fetchData();
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการออกตั๋ว:", error);
  }
};

const onEditOrder = (order) => {
  // Navigate to edit page
  navigateTo(`/admin/order/${order.id}/edit`);
};

// ฟังก์ชันสำหรับอัพเดทสถานะการเข้าร่วม
const onUpdateAttendance = (order) => {
  selectedOrderForAttendance.value = order;
  showAttendanceModal.value = true;
};

// ฟังก์ชันสำหรับจัดการเมื่ออัพเดทสถานะการเข้าร่วมสำเร็จ
const onAttendanceUpdateSuccess = () => {
  showAttendanceModal.value = false;
  selectedOrderForAttendance.value = null;
  fetchData(); // รีเฟรชข้อมูล
};

// ฟังก์ชันสำหรับจัดการเมื่อ import ข้อมูลสำเร็จ
const handleImportSuccess = (result) => {
  console.log("Import success:", result);
  showToast("success", "นำเข้าข้อมูลสำเร็จ กำลังรีเฟรชหน้า...");
  // รีเฟรชข้อมูลหลังจาก import สำเร็จ
  setTimeout(() => {
    fetchData();
  }, 1000);
};

// ฟังก์ชันที่มี debounce สำหรับการค้นหา
const onOrderIdChange = useDebounceFn(() => {
  pageData.page = 1;
  fetchData();
}, 500);

/**
 * ฟังก์ชันสำหรับเปลี่ยนสถานะการกรอง
 */
const onStatusChange = () => {
  pageData.page = 1;
  fetchData();
};

// ฟังก์ชันที่มี debounce สำหรับการเปลี่ยนโซน
const onZoneChange = useDebounceFn(() => {
  pageData.page = 1;
  fetchData();
}, 500);

/**
 * ฟังก์ชันสำหรับปิด modal
 */
const onClose = async () => {
  pageData.showZoneModal = false;
  await fetchData();
};

const onPageChange = (p) => {
  pageData.page = p;
  fetchData();
};

const handleResize = () => {
  collapsed.value = window.innerWidth < 768;
};

onMounted(async () => {
  await fetchAllMasterData();

  handleResize();
  await fetchData();
  window.addEventListener("resize", handleResize);
});
// เมื่อ component ถูกทำลาย
onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});

// Debugging: Add logs to verify modal state
watch(showModal, (newValue) => {
  console.log("showModal state changed:", newValue);
});

watch(orderData, (newValue) => {
  console.log("orderData updated:", newValue);
});
</script>

<style scoped>
/* Export/Import Button dropdown z-index fix */
:deep(.export-button),
:deep(.import-button),
:deep(.export-button-container),
:deep(.import-button-container) {
  z-index: 999 !important;
  position: relative !important;
}

:deep(.export-button .dropdown),
:deep(.import-button .dropdown),
:deep(.export-dropdown),
:deep(.import-dropdown),
:deep(.dropdown-overlay),
:deep(.export-dropdown-overlay) {
  z-index: 999999 !important;
  position: absolute !important;
}

:deep(.dropdown-menu),
:deep(.dropdown-content) {
  z-index: 999999 !important;
  position: absolute !important;
}

/* Force dropdown to appear below buttons */
:deep(.import-button-container .dropdown-overlay) {
  top: calc(100% + 4px) !important;
  left: 0 !important;
  right: auto !important;
  transform: none !important;
}

:deep(.export-button-container .export-dropdown-overlay) {
  top: calc(100% + 4px) !important;
  left: 0 !important;
  right: auto !important;
  transform: none !important;
}

/* BaseSelect dropdown z-index fix */
:deep(.multiselect) {
  z-index: 50 !important;
}

:deep(.multiselect__content-wrapper) {
  z-index: 50 !important;
  position: absolute !important;
}

:deep(.multiselect__content) {
  z-index: 50 !important;
}

:deep(.multiselect--active) {
  z-index: 50 !important;
}

/* Grid container overflow fix */
.grid {
  overflow: visible !important;
}

.grid > div {
  overflow: visible !important;
}

/* Input และ Select customization */
:deep(.dp__input_reg) {
  height: 40.5px;
  padding: 0 30px;
  min-height: 0;
  max-height: none;
  box-sizing: border-box;
  width: 100%;
  color: #000;
  border-radius: 0.375rem;
  border: 1px solid #d1d5db;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
}

/* Loading animation */
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Backdrop blur for modals */
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}

.backdrop-blur-md {
  backdrop-filter: blur(12px);
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: rgb(241, 245, 249);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: rgb(148, 163, 184);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgb(100, 116, 139);
}

/* Responsive design enhancements */
@media (max-width: 640px) {
  .grid-cols-1 {
    grid-template-columns: 1fr;
  }
}

@media (min-width: 640px) {
  .sm\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 768px) {
  .md\:grid-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .lg\:grid-cols-4 {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

/* Enhanced button hover effects */
.hover\:from-emerald-600:hover {
  background-image: linear-gradient(
    to right,
    rgb(5, 150, 105),
    var(--tw-gradient-to)
  );
}

.hover\:to-emerald-700:hover {
  --tw-gradient-to: rgb(4, 120, 87);
}

/* Card shadow effects */
.shadow-lg {
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
}

.shadow-2xl {
  box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
}

/* Glass morphism effect */
.bg-white\/90 {
  background-color: rgb(255 255 255 / 0.9);
}

.bg-white\/95 {
  background-color: rgb(255 255 255 / 0.95);
}

.bg-blue-50\/70 {
  background-color: rgb(239 246 255 / 0.7);
}

/* Interactive states */
.hover\:bg-blue-200:hover {
  background-color: rgb(219, 234, 254);
}

.focus\:ring-blue-500:focus {
  --tw-ring-color: rgb(59, 130, 246);
}

.focus\:border-blue-500:focus {
  border-color: rgb(59, 130, 246);
}

/* Text colors */
.text-blue-900 {
  color: rgb(30, 58, 138);
}

.text-blue-700 {
  color: rgb(29, 78, 216);
}

.text-blue-600 {
  color: rgb(37, 99, 235);
}

.text-blue-500 {
  color: rgb(59, 130, 246);
}

.placeholder-blue-500::placeholder {
  color: rgb(59, 130, 246);
}
</style>
