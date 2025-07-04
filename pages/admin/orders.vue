<template>
  <div class="grid grid-cols-1 px-1 py-1 min-h-screen bg-[#0f1f3c] text-white">
    <div class="p-6 w-full mx-auto text-white space-y-6">
      <h1 class="text-2xl font-bold">รายการออเดอร์</h1>

      <div class="flex flex-wrap gap-4">
        <!-- สถานะออเดอร์ -->
        <div class="flex-1 min-w-[200px] max-w-[333px]">
          <label class="block text-sm font-semibold mb-1">สถานะออเดอร์</label>
          <Listbox
            v-model="pageData.filters.status"
            @update:modelValue="onStatusChange"
          >
            <div class="relative">
              <ListboxButton
                class="relative w-full cursor-pointer rounded-md bg-white py-2 pl-3 pr-10 text-left text-black border shadow focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <span class="block truncate">
                  {{ getStatusLabel(pageData.filters.status) }}
                </span>
              </ListboxButton>
              <Transition name="fade">
                <ListboxOptions
                  class="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md bg-gray-800 text-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5"
                >
                  <ListboxOption
                    v-for="option in pageData.statusOptions"
                    :key="option.value"
                    :value="option.value"
                    v-slot="{ selected }"
                    class="cursor-pointer select-none relative py-2 pl-10 pr-4 hover:bg-gray-600"
                  >
                    <span
                      class="block truncate"
                      :class="selected ? 'font-bold text-primary' : ''"
                    >
                      {{ option.name }}
                    </span>
                    <span
                      v-if="selected"
                      class="absolute inset-y-0 left-0 flex items-center pl-3"
                    >
                      ✅
                    </span>
                  </ListboxOption>
                </ListboxOptions>
              </Transition>
            </div>
          </Listbox>
        </div>

        <!-- ค้นหาโซน -->
        <div class="flex-1 min-w-[200px] max-w-[333px]">
          <label class="block text-sm font-semibold mb-1">ค้นหาโซน</label>
          <Listbox
            v-model="pageData.filters.zone"
            @update:modelValue="onZoneChange"
          >
            <div class="relative">
              <ListboxButton
                class="relative w-full cursor-pointer rounded-md bg-white py-2 pl-3 pr-10 text-left text-black border shadow focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <span class="block truncate">
                  {{ getZoneLabel(pageData.filters.zone) }}
                </span>
              </ListboxButton>
              <Transition name="fade">
                <ListboxOptions
                  class="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md bg-gray-800 text-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5"
                >
                  <ListboxOption
                    v-for="zone in pageData.zoneOptions"
                    :key="zone.value"
                    :value="zone.value"
                    v-slot="{ selected }"
                    class="cursor-pointer select-none relative py-2 pl-10 pr-4 hover:bg-gray-600"
                  >
                    <span
                      class="block truncate"
                      :class="selected ? 'font-bold text-primary' : ''"
                    >
                      {{ zone.label || "ทั้งหมด" }}
                    </span>
                    <span
                      v-if="selected"
                      class="absolute inset-y-0 left-0 flex items-center pl-3"
                    >
                      ✅
                    </span>
                  </ListboxOption>
                </ListboxOptions>
              </Transition>
            </div>
          </Listbox>
        </div>

        <!-- 🧾 ค้นหา Order ID -->
        <div class="flex-1 min-w-[200px] max-w-[333px]">
          <label class="block text-sm font-semibold mb-1">ค้นหา Order ID</label>
          <input
            v-model="pageData.filters.search"
            @input="onOrderIdChange"
            placeholder="พิมพ์ Order ID..."
            class="w-full p-2 rounded-md border border-gray-300 bg-white focus:ring-2 focus:ring-primary text-black"
          />
        </div>

        <div class="flex-1 min-w-[200px] max-w-[333px]">
          <label class="block text-sm font-semibold mb-1"
            >จำนวนรายการต่อหน้า</label
          >
          <Listbox v-model="pageData.limit" @update:modelValue="fetchData">
            <div class="relative">
              <ListboxButton
                class="relative w-full cursor-pointer rounded-md bg-white py-2 pl-3 pr-10 text-left text-black border shadow focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <span class="block truncate">
                  {{ pageData.limit }} รายการ
                </span>
              </ListboxButton>
              <Transition name="fade">
                <ListboxOptions
                  class="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md bg-gray-800 text-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5"
                >
                  <ListboxOption
                    v-for="n in [5, 10, 20]"
                    :key="n"
                    :value="n"
                    v-slot="{ selected }"
                    class="cursor-pointer select-none relative py-2 pl-10 pr-4 hover:bg-gray-600"
                  >
                    <span
                      class="block truncate"
                      :class="selected ? 'font-bold text-primary' : ''"
                    >
                      {{ n }} รายการ
                    </span>
                    <span
                      v-if="selected"
                      class="absolute inset-y-0 left-0 flex items-center pl-3"
                    >
                      ✅
                    </span>
                  </ListboxOption>
                </ListboxOptions>
              </Transition>
            </div>
          </Listbox>
        </div>
      </div>

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
      />
    </div>
  </div>
  <ModalStadiumZoneSelector
    :zoneKey="pageData.selectedZone"
    :show="pageData.showZoneModal"
    @close="onClose"
    :orderData="orderData"
    mode="change"
  />
  <StandingTicketModal
    v-model:showModal="showModal"
    :order="orderData"
    @success="fetchData"
  />
  
  <!-- Ticket Display Modal -->
  <TicketDisplay
    v-if="showTicketModal"
    :tickets="generatedTickets"
    @close="showTicketModal = false"
  />
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { reactive, onMounted } from "vue";
import { useDebounceFn } from "@vueuse/core";
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/vue";
import { Transition } from "vue";
import { Search } from "lucide-vue-next";
import { ZONE_IDS_BY_NAME } from "~~/utils/zoneEnums";
import dayjs from "dayjs";

const showModal = ref(false);
const selectedOrder = ref(null);
const pageData = usePageData();
const route = useRoute();
const orderData = reactive({});
const { cancelOrder, generateTickets } = useOrder();
const collapsed = ref(false);

// สำหรับแสดงตั๋ว
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

    pageData.orders = res.items;
    pageData.totalCount = res.total;
    pageData.totalPage = res.totalPages;
    showModal.value = false;
  } catch (error) {
    console.log("fetchData", error);
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
  } else {
    Object.assign(orderData, order);
    pageData.selectedZone = order.zoneName;
    pageData.showZoneModal = true;
  }
};

const onCancelOrder = async (order) => {
  await cancelOrder(order.id);
  fetchData();
};

const onGenerateTickets = async (order) => {
  try {
    const tickets = await generateTickets(order.id);
    console.log("Generated tickets:", tickets);
    
    // แสดงตั๋วที่ออกมา
    generatedTickets.value = tickets;
    showTicketModal.value = true;
    
    fetchData();
  } catch (error) {
    console.error("Failed to generate tickets:", error);
  }
};

const onOrderIdChange = useDebounceFn(() => {
  pageData.page = 1;
  fetchData();
}, 500);

const onStatusChange = () => {
  pageData.page = 1;
  fetchData();
};

const onZoneChange = useDebounceFn(() => {
  pageData.page = 1;
  fetchData();
}, 500);

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
onMounted(() => {
  handleResize();
  fetchData();
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
