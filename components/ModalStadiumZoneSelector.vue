<template>
  <Teleport to="body">
    <div>
      <div
        v-if="pageData.showSeatModal"
        class="fixed inset-0 bg-black/50 z-50 overflow-auto"
        @click.self="onClose"
      >
        <div
          class="flex justify-center items-start p-4 sm:p-6 md:p-10 h-[1000px]"
        >
          <div
            class="w-full h-[80%] max-w-[90%] sm:max-w-md md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto my-10 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
          >
            <div class="sticky top-0 bg-white z-10 px-6 pt-6 pb-4 border-b">
              <button
                class="absolute top-6 right-6 text-gray-400 hover:text-gray-700 text-xl"
                @click="onClose"
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

            <div class="flex justify-center px-6 pt-4">
              <div class="w-full max-w-xs sm:max-w-sm md:max-w-md p-4">
                <DatePicker
                  v-model="pageData.showDate"
                  placeholder="เลือกวันที่"
                  @update:modelValue="handleDateChange"
                />
              </div>
            </div>

            <div class="flex-1 overflow-auto p-6 space-y-6">
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
                    <div v-for="seat in row" :key="seat?.id">
                      <SeatIcon
                        v-if="seat && seat.seatNumber"
                        :seat="seat"
                        :status="getSeatStatus(seat)"
                        :selectedSeats="pageData.selectedSeats"
                        :bookedSeats="pageData.bookedSeats"
                        :zoneKey="pageData.zoneKey"
                        @toggle="toggleSeat"
                        class="w-8 sm:w-10 md:w-11 transition-transform hover:scale-105 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div
                class="flex justify-center flex-wrap gap-6 text-sm text-gray-600 font-medium"
              >
                <div class="flex items-center gap-2">
                  <img src="/images/armchair.png" class="w-4 h-4" /> ว่าง
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
              <Teleport to="body">
                <div
                  v-if="pageData.selectedSeats.length"
                  class="fixed bottom-4 w-full px-4 sm:px-6 z-50"
                >
                  <div
                    class="w-full max-w-[90%] sm:max-w-md md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto bg-white border border-gray-300 rounded-2xl shadow-2xl px-6 py-5"
                  >
                    <div class="text-center space-y-3">
                      <p
                        class="text-sm text-gray-600 tracking-wide font-medium"
                      >
                        ที่นั่งที่เลือก
                      </p>

                      <p
                        class="text-xl font-semibold text-blue-600 tracking-wider"
                      >
                        {{
                          pageData.selectedSeats
                            .map((s) => s?.seatNumber || "—")
                            .join(", ")
                        }}
                      </p>

                      <p class="text-lg sm:text-xl font-semibold tracking-wide">
                        <span class="text-blue-600">ราคารวม:</span>
                        <span class="text-cyan-500">
                          {{
                            props.mode === "change"
                              ? pageData.totalAmount
                              : pageData.selectedSeats.length * 1800
                          }}
                        </span>
                        <span class="ml-1 text-sm text-gray-500">บาท</span>
                      </p>

                      <div class="flex justify-center gap-3 flex-wrap pt-2">
                        <button
                          @click="onClose"
                          class="min-w-[90px] px-4 py-2 border border-blue-500 text-blue-600 text-sm font-semibold rounded-full shadow-sm hover:bg-blue-50 transition-all"
                        >
                          ย้อนกลับ
                        </button>

                        <button
                          @click="pageData.selectedSeats = []"
                          class="min-w-[90px] px-4 py-2 border border-red-400 text-red-500 text-sm font-semibold rounded-full shadow-sm hover:bg-red-50 transition-all"
                        >
                          ยกเลิกทั้งหมด
                        </button>

                        <button
                          @click="handleConfirm"
                          class="min-w-[90px] px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-400 text-white text-sm font-semibold rounded-full shadow-md hover:opacity-90 transition-all"
                        >
                          {{
                            props.mode === "change"
                              ? "ยืนยันเปลี่ยนที่นั่ง"
                              : "ซื้อตั๋ว"
                          }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Teleport>
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
      :total="pageData.selectedSeats.length * 1800"
      :userRole="pageData.userRole"
      :dataZoneSelected="pageData"
      @close="pageData.showSummaryModal = false"
      @confirmed="handleConfirmed"
    />
  </Teleport>
</template>

<script setup>
import { useToast } from "vue-toastification";
const { t } = useI18n();
const router = useRouter();
const pageData = usePageData();
const { getSeatsByZoneId } = useSeatApi();
const { submitOrder } = useOrder();
const toast = useToast();
const auth = useAuthStore();
if (!auth.user) auth.loadUser();

const props = defineProps({
  zoneKey: String,
  mode: { type: String, default: "booking" },
  orderData: Object,
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

let modalHasLoaded = false;

watchEffect(async () => {
  const show = pageData.showSeatModal;
  const zone = pageData.zoneKey;
  const date = pageData.showDate;

  if (!show || !zone || !date) {
    modalHasLoaded = false;
    return;
  }

  if (modalHasLoaded) return;
  modalHasLoaded = true;

  pageData.loading = true;
  try {
    const allSeats = await getSeatsByZoneId(zone, date);
    pageData.currentZoneSeats = buildSeatLayoutFromCoordinates(allSeats);
  } catch (err) {
    console.error("โหลดที่นั่งล้มเหลว:", err);
  } finally {
    pageData.loading = false;
  }
});

let prevDateTime = null;

const handleDateChange = async (newDate) => {
  const newTime = new Date(newDate).getTime();
  if (newTime === prevDateTime) return;
  prevDateTime = newTime;

  if (!pageData.zoneKey) return;

  pageData.loading = true;
  try {
    const allSeats = await getSeatsByZoneId(pageData.zoneKey, newDate);
    pageData.currentZoneSeats = buildSeatLayoutFromCoordinates(allSeats);
  } catch (error) {
    console.error("❌ โหลดที่นั่งล้มเหลว:", error);
  } finally {
    pageData.loading = false;
  }
};

onMounted(() => {
  pageData.loading = true;
  pageData.selectedSeats = [];
  try {
    if (props.mode === "change" && props.orderData) {
      pageData.selectedSeats = props.orderData.seats;
      pageData.showDate = props.orderData.showDate;
      pageData.totalAmount = props.orderData.total;
    }
  } catch (error) {
    console.log("error", error);
  } finally {
    pageData.loading = false;
  }
});

onBeforeUnmount(() => {
  document.body.style.overflow = "";
});

const onClose = () => {
  pageData.resetPageData();
  pageData.showSeatModal = false;
};

const handleConfirm = async () => {
  if (!pageData.selectedSeats.length)
    return toast.warning("กรุณาเลือกที่นั่งก่อน");
  if (props.mode === "booking") {
    try {
      const order = await submitOrder({
        userId: auth.user.providerId,
        seatIds: pageData.selectedSeats.map((s) => s.id),
        total: pageData.selectedSeats.length,
        showDate: pageData.showDate,
        method: "CASH",
      });
      pageData.orderId = order.id;
      pageData.totalAmount = order.total;
      pageData.showSummaryModal = true;
    } catch (err) {
      toast.error(err?.message || "เกิดข้อผิดพลาดในการสั่งซื้อ");
    }
  } else if (props.mode === "change") {
    try {
      await $fetch("/api/orders/change-seats", {
        method: "PATCH",
        body: {
          orderId: props.orderData.id,
          newSeatIds: pageData.selectedSeats.map((s) => s.id),
          showDate: pageData.showDate,
        },
      });
      toast.success("เปลี่ยนที่นั่งเรียบร้อยแล้ว");
      pageData.showSeatModal = false;
    } catch (err) {
      toast.error("ไม่สามารถเปลี่ยนที่นั่งได้");
    }
  }
};

const toggleSeat = (seat) => {
  if (pageData.bookedSeats.includes(seat)) return;
  const index = pageData.selectedSeats.indexOf(seat);
  if (index === -1) {
    if (pageData.selectedSeats.length >= 10)
      return toast.warning("กรุณาเลือกไม่เกิน 10 ที่นั่ง");
    pageData.selectedSeats.push(seat);
  } else {
    pageData.selectedSeats.splice(index, 1);
  }
};

const getSeatStatus = (seat) => {
  if (!seat) return "unavailable";
  if (pageData.bookedSeats.includes(seat)) return "booked";
  if (pageData.selectedSeats.includes(seat)) return "selected";
  return "available";
};
</script>
