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
          class="grid sm:grid-cols-2 md:grid-cols-2 gap-6 relative z-10 overflow-visible p-4"
        >
          <!-- <div>
            <label class="block text-sm font-medium text-white mb-2"
              >สถานะออเดอร์</label
            > -->
          <!-- <Listbox
              v-model="pageData.filters.status"
              @update:modelValue="onStatusChange"
            >
              <div class="relative z-40">
                <ListboxButton
                  class="relative w-full cursor-pointer rounded-md bg-white py-2 pl-3 pr-10 text-left text-black border shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:bg-blue-50"
                >
                  <span class="block truncate">
                    {{ getStatusLabel(pageData.filters.status) }}
                  </span>
                  <span
                    class="absolute inset-y-0 right-0 flex items-center pr-2"
                  >
                    <svg
                      class="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </span>
                </ListboxButton>
                <Transition name="fade">
                  <ListboxOptions
                    class="absolute z-40 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white text-gray-900 py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5"
                  >
                    <ListboxOption
                      v-for="option in pageData.statusOptions"
                      :key="option.value"
                      :value="option.value"
                      v-slot="{ selected }"
                      class="cursor-pointer select-none relative py-2 pl-10 pr-4 hover:bg-blue-100"
                    >
                      <span
                        class="block truncate"
                        :class="selected ? 'font-semibold text-blue-600' : ''"
                      >
                        {{ option.name }}
                      </span>
                      <span
                        v-if="selected"
                        class="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600"
                        >✓</span
                      >
                    </ListboxOption>
                  </ListboxOptions>
                </Transition>
              </div>
            </Listbox> -->
          <!-- </div> -->
          <!-- <div> -->
          <!-- <label class="block text-sm font-medium text-white mb-2">โซน</label> -->
          <!-- <Listbox
              v-model="pageData.filters.zone"
              @update:modelValue="onZoneChange"
            >
              <div class="relative z-30">
                <ListboxButton
                  class="relative w-full cursor-pointer rounded-md bg-white py-2 pl-3 pr-10 text-left text-black border shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:bg-blue-50"
                >
                  <span class="block truncate">
                    {{ getZoneLabel(pageData.filters.zone) }}
                  </span>
                  <span
                    class="absolute inset-y-0 right-0 flex items-center pr-2"
                  >
                    <svg
                      class="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </span>
                </ListboxButton>
                <Transition name="fade">
                  <ListboxOptions
                    class="absolute z-30 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white text-gray-900 py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5"
                  >
                    <ListboxOption
                      v-for="zone in pageData.zoneOptions"
                      :key="zone.value"
                      :value="zone.value"
                      v-slot="{ selected }"
                      class="cursor-pointer select-none relative py-2 pl-10 pr-4 hover:bg-blue-100"
                    >
                      <span
                        class="block truncate"
                        :class="selected ? 'font-semibold text-blue-600' : ''"
                      >
                        {{ zone.label || "ทั้งหมด" }}
                      </span>
                      <span
                        v-if="selected"
                        class="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600"
                        >✓</span
                      >
                    </ListboxOption>
                  </ListboxOptions>
                </Transition>
              </div>
            </Listbox> -->
          <!-- </div> -->
          <div>
            <label class="block text-sm font-medium text-white mb-2"
              >ค้นหา Order ID</label
            >
            <BaseInput
              v-model="pageData.filters.search"
              @input="onOrderIdChange"
              placeholder="พิมพ์ Order ID..."
              :className="'w-full bg-white text-black border shadow-md rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:bg-blue-50 h-[37px]'"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-white mb-2"
              >รายการต่อหน้า</label
            >
            <Listbox v-model="pageData.limit" @update:modelValue="fetchData">
              <div class="relative z-20">
                <ListboxButton
                  class="relative w-full cursor-pointer rounded-md bg-white py-2 pl-3 pr-10 text-left text-black border shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:bg-blue-50"
                >
                  <span class="block truncate">
                    {{ pageData.limit }} รายการ
                  </span>
                  <span
                    class="absolute inset-y-0 right-0 flex items-center pr-2"
                  >
                    <svg
                      class="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </span>
                </ListboxButton>
                <Transition name="fade">
                  <ListboxOptions
                    class="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white text-gray-900 py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5"
                  >
                    <ListboxOption
                      v-for="n in [10, 20, 40]"
                      :key="n"
                      :value="n"
                      v-slot="{ selected }"
                      class="cursor-pointer select-none relative py-2 pl-10 pr-4 hover:bg-blue-100"
                    >
                      <span
                        class="block truncate"
                        :class="selected ? 'font-semibold text-blue-600' : ''"
                      >
                        {{ n }} รายการ
                      </span>
                      <span
                        v-if="selected"
                        class="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600"
                        >✓</span
                      >
                    </ListboxOption>
                  </ListboxOptions>
                </Transition>
              </div>
            </Listbox>
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

  <!-- Modal สำหรับแสดงตั๋วที่ออกมา -->
  <!--
  <TicketDisplay
    v-if="showTicketModal"
    :tickets="generatedTickets"
    @close="showTicketModal = false"
    @download-thermal="handleDownloadThermal"
  />
  <div v-if="showTicketModal" class="flex justify-center mt-6">
    <button
      @click="handleDownloadThermal(generatedTickets[0]?.orderId)"
      class="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-2 transition-colors"
      :disabled="isDownloadingThermal || !generatedTickets[0]?.orderId"
    >
      <i class="mdi mdi-file-pdf-box"></i>
      <span v-if="isDownloadingThermal">กำลังโหลด...</span>
      <span v-else>แสดง Thermal Receipt PDF</span>
    </button>
  </div>
  -->
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
import { useRoute, useRouter } from "vue-router";
import { reactive, onMounted, ref, onUnmounted, watch } from "vue";
import { useDebounceFn } from "@vueuse/core";
import StandingTicketModal from "~/components/StandingTicketModal.vue";
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/vue";
import { Transition } from "vue";
import { ZONE_IDS_BY_NAME } from "~~/utils/zoneEnums";
import { useOrder } from "~/composables/useOrder";
import { usePageData } from "~/stores/pageData";
import TicketDisplay from "~/components/TicketDisplay.vue";

// ตั้งค่า metadata สำหรับหน้า
definePageMeta({
  layout: "default",
  middleware: "only-admin-staff",
  title: "รายการออเดอร์",
});

// ตัวแปร reactive สำหรับจัดการสถานะ
const showModal = ref(false);
const selectedOrder = ref(null);
const pageData = usePageData();
const route = useRoute();
const router = useRouter();
const orderData = reactive({});
const { cancelOrder, generateTickets, downloadThermalReceipt } = useOrder();
const collapsed = ref(false);
const showThermalModal = ref(false);
const showTicketModal = ref(false);
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

/**
 * ฟังก์ชันสำหรับโหลดข้อมูลออเดอร์จาก API
 */
const fetchData = async () => {
  pageData.loading = true;
  try {
    const res = await useOrder().getOrders({
      page: pageData.page,
      limit: pageData.limit,
      status: pageData.filters.status,
      search: pageData.filters.search,
      zone: ZONE_IDS_BY_NAME[pageData.filters.zone] || undefined,
    });
    // อัพเดทข้อมูลในหน้า
    console.log("res", res);

    pageData.orders = res.data;
    pageData.totalCount = res.total;
    pageData.totalPage = res.totalPages;
    // showModal.value = false;
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการโหลดข้อมูล:", error);
  } finally {
    pageData.loading = false;
  }
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
      showDate: ticket.showDate || "01/07/2025",
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
