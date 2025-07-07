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
      <BaseCard class="bg-[#1a2b4d] border-blue-60 overflow-visible">
        <template #header>
          <h2 class="text-lg font-semibold text-white">กรองข้อมูล</h2>
        </template>

        <div
          class="grid sm:grid-cols-2 md:grid-cols-2 gap-4 relative z-10 overflow-visible"
        >
          <div>
            <label class="block text-sm font-medium text-white"
              >สถานะออเดอร์</label
            >
            <Listbox
              v-model="pageData.filters.status"
              @update:modelValue="onStatusChange"
            >
              <div class="relative z-40">
                <ListboxButton
                  class="relative w-full cursor-pointer rounded-md bg-white py-2 pl-3 pr-10 text-left text-black border shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                      class="cursor-pointer select-none relative py-2 pl-10 pr-4 hover:bg-blue-50"
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
            </Listbox>
          </div>
          <div>
            <label class="block text-sm font-medium text-white">โซน</label>
            <Listbox
              v-model="pageData.filters.zone"
              @update:modelValue="onZoneChange"
            >
              <div class="relative z-30">
                <ListboxButton
                  class="relative w-full cursor-pointer rounded-md bg-white py-2 pl-3 pr-10 text-left text-black border shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                      class="cursor-pointer select-none relative py-2 pl-10 pr-4 hover:bg-blue-50"
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
            </Listbox>
          </div>
          <div>
            <label class="block text-sm font-medium text-white"
              >ค้นหา Order ID</label
            >
            <BaseInput
              v-model="pageData.filters.search"
              @input="onOrderIdChange"
              placeholder="พิมพ์ Order ID..."
              class="bg-white text-black"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-white"
              >รายการต่อหน้า</label
            >
            <Listbox v-model="pageData.limit" @update:modelValue="fetchData">
              <div class="relative z-20">
                <ListboxButton
                  class="relative w-full cursor-pointer rounded-md bg-white py-2 pl-3 pr-10 text-left text-black border shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                      class="cursor-pointer select-none relative py-2 pl-10 pr-4 hover:bg-blue-50"
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
  <TicketDisplay
    v-if="showTicketModal"
    :tickets="generatedTickets"
    @close="showTicketModal = false"
  />
  <!-- Modal สำหรับตั๋วยืน -->
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
const { cancelOrder, generateTickets } = useOrder();
const collapsed = ref(false);

// ตัวแปรสำหรับแสดงตั๋วที่ออกมา
const showTicketModal = ref(false);
const generatedTickets = ref([]);

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
    pageData.orders = res.items;
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

const onGenerateTickets = async (order) => {
  try {
    const tickets = await generateTickets(order.id);

    // แสดงตั๋วที่ออกมา
    generatedTickets.value = tickets;
    showTicketModal.value = true;

    fetchData(); // รีเฟรชข้อมูล
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการออกตั๋ว:", error);
  }
};

const onEditOrder = (order) => {
  console.log("Edit order clicked:", order);
  console.log("Order ID:", order.id);
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
