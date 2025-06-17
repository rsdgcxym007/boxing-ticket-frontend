<template>
  <Teleport to="body">
    <div>
      <!-- Backdrop -->
      <div
        v-if="pageData.showSeatModal"
        class="fixed inset-0 bg-black/50 z-50 overflow-auto"
        @click.self="onClose"
      >
        <!-- Center Wrapper -->
        <div
          class="flex justify-center items-start min-h-screen p-4 sm:p-6 md:p-10"
        >
          <!-- Modal Container -->
          <div
            class="w-full max-w-[90%] sm:max-w-md md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto my-10 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
          >
            <!-- Sticky Header -->
            <div class="sticky top-0 bg-white z-10 px-6 pt-6 pb-4 border-b">
              <button
                class="absolute top-6 right-6 text-gray-400 hover:text-gray-700 text-xl"
                @click="pageData.showSeatModal = false"
              >
                ✕
              </button>
              <h2 class="text-xl font-bold text-center text-gray-800">
                {{ t("selectSeats") }}
              </h2>
              <p class="text-center text-sm text-gray-500 mt-1">
                {{ t("zone") }}:
                <span class="font-semibold text-indigo-600">
                  {{ pageData.zoneKey.replace("-", " ").toUpperCase() }}
                </span>
              </p>
            </div>

            <!-- Scrollable Seat Area -->
            <div class="flex-1 overflow-auto p-6 space-y-6">
              <!-- Seat Layout (❌ no border/bg wrapper) -->
              <div class="w-full">
                <div class="flex flex-col items-center gap-4 min-w-[400px]">
                  <div
                    v-for="(row, i) in pageData.currentZoneSeats"
                    :key="i"
                    class="grid justify-center"
                    :style="{
                      gridTemplateColumns: `repeat(${row.length}, minmax(1.75rem, auto))`,
                      gap: '0.5rem',
                    }"
                  >
                    <div
                      v-for="seat in row"
                      :key="seat"
                      @click="toggleSeat(seat)"
                    >
                      <SeatIcon
                        v-if="seat"
                        :seat="seat"
                        :status="getSeatStatus(seat)"
                        :selectedSeats="pageData.selectedSeats"
                        :bookedSeats="pageData.bookedSeats"
                        :zoneKey="pageData.zoneKey"
                        class="w-8 sm:w-10 md:w-11 transition-transform hover:scale-105 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Legend -->
              <div
                class="flex justify-center flex-wrap gap-6 text-sm text-gray-600 font-medium"
              >
                <div class="flex items-center gap-2">
                  <img src="/images/armchair.png" class="w-4 h-4" />
                  ว่าง
                </div>
                <div
                  class="flex items-center gap-2 text-green-600 font-semibold"
                >
                  <img src="/images/seat-selected.png" class="w-4 h-4" />
                  ที่คุณเลือก
                </div>
                <div class="flex items-center gap-2 text-gray-400 line-through">
                  <img
                    src="/images/seat-booked.png"
                    class="w-4 h-4 opacity-50"
                  />
                  ไม่ว่าง
                </div>
              </div>

              <!-- Summary (No box, clean layout) -->
              <div
                v-if="pageData.selectedSeats.length"
                class="text-center space-y-4"
              >
                <!-- ที่นั่งที่เลือก -->
                <div class="text-sm text-gray-500 font-medium">
                  {{ t("selectedSeats") }}
                </div>
                <div
                  class="text-base sm:text-lg font-semibold text-blue-600 tracking-wide"
                >
                  {{ pageData.selectedSeats.join(", ") }}
                </div>

                <!-- ราคารวม (ไม่มีกรอบ) -->
                <div
                  class="text-lg sm:text-xl font-bold text-blue-700 tracking-wide"
                >
                  {{ t("totalPrice") }}:
                  <span class="text-cyan-500 font-bold">
                    {{ pageData.selectedSeats.length * 1 }}
                  </span>
                  <span class="ml-1 text-sm text-gray-500">{{
                    t("baht")
                  }}</span>
                </div>

                <!-- ปุ่ม -->
                <div class="flex justify-center gap-3 flex-wrap pt-3">
                  <button
                    @click="pageData.showSeatModal = false"
                    class="px-5 py-2 text-blue-500 font-medium text-sm border border-blue-500 rounded-full hover:bg-blue-50 transition"
                  >
                    {{ t("back") }}
                  </button>
                  <button
                    @click="handleBuyTicket"
                    class="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-medium text-sm rounded-full hover:opacity-90 shadow-md transition"
                  >
                    {{ t("checkout") }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SummaryModal
        v-if="pageData.showSummaryModal"
        :visible="pageData.showSummaryModal"
        :selectedSeats="pageData.selectedSeats"
        :zone="pageData.zoneKey"
        :total="pageData.selectedSeats.length * 1"
        :userRole="pageData.userRole"
        :dataZoneSelected="pageData"
        @close="pageData.showSummaryModal = false"
        @confirmed="handleConfirmed"
      /></div
  ></Teleport>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { watch, nextTick, onBeforeUnmount } from "vue";
import { usePageData } from "@/composables/usePageData";
import { useSeatApi } from "@/composables/useSeatApi";
import { useOrder } from "@/composables/useOrder"; // เพิ่ม
import { useWebSocket } from "@/composables/useSocket";
const { submitOrder } = useOrder();
const { showToast } = useToast();
const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const pageData = usePageData();
const { getSeatsByZone, getBookedSeats } = useSeatApi();

const props = defineProps({
  zoneKey: String,
});

watch(
  () => props.zoneKey,
  async (newZone) => {
    if (!newZone) return;

    pageData.zoneKey = "";
    await nextTick();
    pageData.zoneKey = newZone;
    pageData.showSeatModal = true;
  },
  { immediate: true }
);

watch(
  () => pageData.showSeatModal,
  async (show) => {
    const body = document.body;

    if (show && pageData.zoneKey) {
      pageData.currentZoneSeats = await getSeatsByZone(pageData.zoneKey);
      pageData.bookedSeats = await getBookedSeats();
    } else {
      body.style.overflow = "";
      pageData.zoneKey = "";
      pageData.selectedSeats = [];
    }
  }
);

const refreshBookedSeats = async () => {
  console.log("🔁 reload booked seats from websocket");
  nextTick(async () => {
    pageData.bookedSeats = await getBookedSeats();
  });
};

const { connectSocket, disconnectSocket } = useWebSocket(
  "*",
  refreshBookedSeats
);

onMounted(() => {
  connectSocket();
});

onBeforeUnmount(() => {
  document.body.style.overflow = "";
  disconnectSocket();
});
const onClose = () => {
  pageData.showSeatModal = false;
};
function handleConfirmed() {
  pageData.showSummaryModal = false;
}
const handleBuyTicket = async () => {
  if (!pageData.selectedSeats.length) {
    showToast("กรุณาเลือกที่นั่งก่อน", "warning");
    return;
  }

  try {
    const order = await submitOrder({
      orderId: `ORDER${Date.now()}`.slice(0, 17),
      zone: props.zoneKey,
      selectedSeats: pageData.selectedSeats,
      total: pageData.selectedSeats.length,
      method: "qr",
    });

    pageData.orderId = order.orderId;
    pageData.totalAmount = order.total;

    // ปิด modal ที่เลือก
    pageData.showSummaryModal = true;
  } catch (err) {
    console.log("err", err);

    // ✅ แสดงข้อความ error จริงจาก backend
    const message =
      err?.message ||
      err?.response?.data?.message ||
      "เกิดข้อผิดพลาดในการสั่งซื้อ";

    showToast(message, "error");
  }
};

// ✅ เลือกที่นั่ง
function toggleSeat(seat) {
  if (pageData.bookedSeats.includes(seat)) return;
  const index = pageData.selectedSeats.indexOf(seat);
  if (index === -1) {
    if (pageData.selectedSeats.length >= 10) return;
    pageData.selectedSeats.push(seat);
  } else {
    pageData.selectedSeats.splice(index, 1);
  }
}

// ✅ สถานะที่นั่ง
function getSeatStatus(seat) {
  if (!seat) return "unavailable";
  if (pageData.bookedSeats.includes(seat)) return "booked";
  if (pageData.selectedSeats.includes(seat)) return "selected";
  return "available";
}
</script>
