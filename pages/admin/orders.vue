<template>
  <div class="grid grid-cols-1 px-1 py-1 min-h-screen bg-[#0f1f3c] text-white">
    <div class="p-6 w-full mx-auto text-white space-y-6">
      <!-- หัวข้อหลัก -->
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold text-white">รายการออเดอร์</h1>
        <div class="text-sm text-gray-300">
          ทั้งหมด {{ pageData.totalCount }} รายการ
        </div>
      </div>

      <!-- ส่วนกรองข้อมูล -->
      <BaseCard
        class="bg-gradient-to-r from-[#0f1f3c] to-[#1a2b4d] border-[#3a6ea5] overflow-visible shadow-xl rounded-lg"
      >
        <template #header>
          <h2 class="text-lg font-semibold text-white">กรองข้อมูล</h2>
        </template>

        <div
          class="grid sm:grid-cols-3 md:grid-cols-3 gap-6 relative z-10 overflow-visible p-4"
        >
          <div>
            <label class="block text-sm font-medium text-white mb-2 mt-[1.5px]"
              >ค้นหา เลขที่ออเดอร์, ชื่อ, เบอร์โทร
            </label>
            <BaseInput
              v-model="pageData.filters.search"
              @input="onOrderIdChange"
              placeholder="สามารถค้นหาได้จาก เลขที่ออเดอร์, ชื่อ, เบอร์โทร"
              :className="'w-full bg-white text-black border shadow-md rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:bg-blue-50 h-[40.5px]'"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-white mb-2"
              >วันที่แสดง (Show Date)</label
            >
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
          <div>
            <label class="block text-sm font-medium text-white mb-2"
              >สร้างโดย (Create By)</label
            >
            <BaseSelect
              v-model="pageData.filters.createdBy"
              :options="createByOptions"
              option-label="name"
              option-value="id"
              placeholder="เลือกผู้สร้างออเดอร์"
              @change="onCreateByChange"
              :className="'w-full  h-[40.5px]'"
            />
          </div>
          <!-- Order Status Filter -->
          <div class="flex-1 min-w-[180px]">
            <label class="text-sm font-semibold text-white mb-1 block">
              สถานะออเดอร์
            </label>
            <BaseSelect
              v-model="pageData.filters.status"
              :options="orderStatusOptions"
              placeholder="เลือกสถานะ"
              clearable
              @change="onOrderStatusChange"
              className="w-full h-[40.5px]"
            />
          </div>

          <!-- Payment Method Filter -->
          <div class="flex-1 min-w-[180px]">
            <label class="text-sm font-semibold text-white mb-1 block">
              วิธีชำระเงิน
            </label>
            <BaseSelect
              v-model="pageData.filters.paymentMethod"
              :options="paymentMethodOptions"
              placeholder="เลือกวิธีชำระเงิน"
              clearable
              @change="onPaymentMethodChange"
              className="w-full h-[40.5px]"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-white mb-2"
              >รายการต่อหน้า</label
            >
            <BaseSelect
              v-model="pageData.limit"
              :options="[10, 20, 40]"
              option-label="label"
              option-value="value"
              placeholder="เลือกรายการต่อหน้า"
              @change="fetchData"
              :className="'w-full bg-white text-black border shadow-md rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:bg-blue-50 h-[40.5px]'"
            />
          </div>
        </div>
      </BaseCard>

      <!-- ส่วนแสดงรายการออเดอร์ -->
      <div class="space-y-4">
        <!-- Loading State -->
        <div v-if="pageData.loading" class="text-center py-8">
          <BaseSpinner size="large" />
          <p class="mt-4 text-gray-300">กำลังโหลดข้อมูล...</p>
        </div>

        <!-- รายการออเดอร์ -->
        <div v-else>
          <AdminOrderCardList
            :orders="pageData.orders"
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
          />
        </div>
      </div>
    </div>
  </div>

  <!-- Modal สำหรับแสดง Thermal Receipt PDF -->
  <div
    v-if="showThermalModal"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
  >
    <div
      class="bg-white rounded-lg shadow-2xl max-w-3xl w-full p-4 relative flex flex-col items-center"
      style="z-index: 9999"
    >
      <button
        @click="closeThermalModal"
        class="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
      >
        ✕
      </button>
      <h3 class="text-lg font-bold mb-4 text-center">
        Thermal Receipt PDF Preview
      </h3>
      <div
        v-if="thermalPdfError"
        class="text-red-600 text-center font-bold mb-4"
      >
        ไม่สามารถแสดงไฟล์ PDF ได้ หรือไฟล์ว่าง/ผิดรูปแบบ
      </div>
      <iframe
        v-if="!thermalPdfError"
        :src="thermalPdfUrl"
        width="100%"
        height="600px"
        style="border: none"
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
        console.log('StandingTicketModal showModal updated:', value);
        if (value == false) {
          await fetchData();
        }
        showModal = value;
      }
    "
  />
</template>

<script setup>
// นำเข้า composables และ utilities ที่จำเป็น
import { useI18n } from "vue-i18n";
import { reactive, onMounted, ref, onUnmounted, watch } from "vue";
import { useDebounceFn } from "@vueuse/core";
import StandingTicketModal from "~/components/StandingTicketModal.vue";
import { ZONE_IDS_BY_NAME } from "~~/utils/zoneEnums";
import { useOrder } from "~/composables/useOrder";
import { usePageData } from "~/stores/pageData";
import DatePicker from "~/components/DatePicker.vue";
import { useReferrerMasterData } from "~/composables/useReferrerMasterData";
import dayjs from "dayjs";

// ตั้งค่า metadata สำหรับหน้า
definePageMeta({
  layout: "default",
  middleware: "only-admin-staff",
  title: "รายการออเดอร์",
});

// ตัวแปร reactive สำหรับจัดการสถานะ
const showModal = ref(false);
const pageData = usePageData();
const orderData = reactive({});
const { cancelOrder, generateTickets, downloadThermalReceipt } = useOrder();
const collapsed = ref(false);
const showThermalModal = ref(false);
const generatedTickets = ref([]);
const isDownloadingThermal = ref(false);
const thermalPdfUrl = ref("");
const thermalPdfError = ref(false);

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
  console.log("pageData.filters.showDate", pageData.filters.showDate);

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
    });

    pageData.orders = res.data;
    pageData.totalCount = res.total;
    pageData.totalPage = res.totalPages;
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการโหลดข้อมูล:", error);
  } finally {
    pageData.loading = false;
  }
};

const { fetchMasterStaffAdmin } = useReferrerMasterData();
const createByOptions = ref([]);

const loadCreateByOptions = async () => {
  try {
    const data = await fetchMasterStaffAdmin();
    createByOptions.value = Array.isArray(data) ? data : [];
  } catch (e) {
    createByOptions.value = [];
  }
};

const onCreateByChange = () => {
  pageData.page = 1;
  fetchData();
};
const onShowDateChange = () => {
  console.log("321321321");

  pageData.page = 1;
  fetchData();
};
onMounted(() => {
  handleResize();
  fetchData();
  loadCreateByOptions();
  window.addEventListener("resize", handleResize);
});

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

// เมื่อ component ถูกโหลด
onMounted(() => {
  handleResize();
  fetchData();
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
/* BaseCard Styling */
.BaseCard {
  background: linear-gradient(135deg, #0f1f3c, #1a2b4d);
  border: 1px solid #2a4a6e;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  overflow: visible;
}

/* Header Styling */
.BaseCard h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #d1d5db;
  margin-bottom: 1rem;
}

/* Grid Styling */
.grid {
  display: grid;
  gap: 1rem;
}

/* Listbox Styling */
.ListboxButton {
  background: #1a2b4d;
  color: #d1d5db;
  border: 1px solid #2a4a6e;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}
.ListboxButton:hover {
  background: #2a4a6e;
  border-color: #3a6ea5;
}
.ListboxButton:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(58, 110, 165, 0.5);
}

/* Listbox Options Styling */
.ListboxOptions {
  background: #1a2b4d;
  color: #d1d5db;
  border-radius: 4px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}
.ListboxOption {
  padding: 0.5rem 1rem;
  transition: background 0.3s ease;
}
.ListboxOption:hover {
  background: #2a4a6e;
}
.ListboxOption.selected {
  font-weight: 600;
  color: #3a6ea5;
}

/* Input Styling */
.BaseInput {
  background: #1a2b4d;
  color: #d1d5db;
  border: 1px solid #2a4a6e;
  border-radius: 4px;
  padding: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}
.BaseInput:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(58, 110, 165, 0.5);
}

/* Label Styling */
label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #d1d5db;
  margin-bottom: 0.5rem;
}

/* CSS Animation สำหรับการเปลี่ยนแปลงที่นุ่มนวล */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Custom scrollbar for better UX */
.overflow-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.overflow-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.overflow-auto::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Debug styles for modal visibility */
.StandingTicketModal {
  z-index: 9999;
  display: block !important;
}
</style>
