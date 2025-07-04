<template>
  <Teleport to="body">
    <div>
      <div
        v-if="show"
        class="fixed inset-0 bg-black/50 z-50 overflow-auto"
        @click.self="onClose"
      >
        <div class="flex justify-center items-start p-4 sm:p-6 md:p-10">
          <div
            class="w-full max-w-[95%] sm:max-w-md md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto my-10 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col max-h-[90vh] overflow-hidden"
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

            <!-- ✅ Content Scrollable -->
            <div class="flex-1 overflow-auto p-6 space-y-6">
              <!-- Selectors -->
              <div class="flex justify-center px-6 pt-4">
                <div class="w-full max-w-xs sm:max-w-sm md:max-w-md p-4">
                  <ZoneSelect
                    v-model="pageData.zoneKey"
                    :options="pageData.zoneOptions"
                    label="ค้นหาโซน"
                    @update:modelValue="onZoneChange"
                  />
                  <div class="mt-4">
                    <DatePicker
                      v-model="pageData.showDate"
                      :placeholder="'เลือกวันที่'"
                      @update:modelValue="handleDateChange"
                    />
                  </div>
                </div>
              </div>

              <!-- 💡 Container ของที่นั่ง -->
              <div class="w-full">
                <div
                  class="max-h-[70vh] overflow-auto bg-white"
                  style="margin: 0 auto"
                >
                  <div class="flex flex-col gap-2 items-center w-full">
                    <div
                      v-for="(row, i) in pageData.currentZoneSeats"
                      :key="i"
                      class="w-full grid place-items-center"
                    >
                      <div
                        class="grid"
                        :style="{
                          gridTemplateColumns: `repeat(${row.length}, minmax(2.10rem, auto))`,
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
                            :ownSeatIds="
                              props.orderData?.seatBookings.map(
                                (b) => b.seat.id
                              ) || []
                            "
                            class="w-8 sm:w-10 md:w-11 transition-transform hover:scale-105 cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Legend -->
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
              <div
                v-if="pageData.selectedSeats.length"
                class="mt-4 border-t pt-6"
              >
                <div
                  class="w-full max-w-[100%] sm:max-w-md md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto bg-white border border-gray-300 rounded-2xl shadow-2xl px-6 py-5"
                >
                  <div class="text-center space-y-3">
                    <p class="text-sm text-gray-600 tracking-wide font-medium">
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
                          props.mode === "change" &&
                          props?.orderData?.status === "PAID"
                            ? "ยืนยันเปลี่ยนที่นั่ง"
                            : "ซื้อตั๋ว"
                        }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ✅ Modal แสดงสรุป -->
    <SummaryModal
      v-if="pageData.showSummaryModal"
      :visible="pageData.showSummaryModal"
      :selectedSeats="pageData.selectedSeats"
      :zone="pageData.zoneKey"
      :total="pageData.selectedSeats.length * 1800"
      :userRole="pageData.userRole"
      :dataZoneSelected="pageData"
      :mode="props.mode"
      @close="onCloseSummaryModal"
      @confirmed="handleConfirmed"
    />
  </Teleport>
</template>

<script setup>
import dayjs from "dayjs";
import { useToast } from "vue-toastification";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const router = useRouter();
const pageData = usePageData();
const { getSeatsByZoneId } = useSeatApi();
const { submitOrder, changeSeats, updateOrderBooked } = useOrder();
const toast = useToast();
const auth = useAuthStore();
const getDateKey = (date) => dayjs(date).format("YYYY-MM-DD");

if (!auth.user) auth.loadUser();

const props = defineProps({
  zoneKey: String,
  show: Boolean,
  mode: { type: String, default: "booking" },
  orderData: Object,
});
const emit = defineEmits(["close"]);

const isFirstOpen = ref(true);
const originalSeatCount = ref(0);

const fetchSeats = async () => {
  try {
    pageData.loading = true;

    const allSeats = await getSeatsByZoneId(
      pageData.zoneKey,
      pageData.showDate
    );

    pageData.currentZoneSeats = buildSeatLayoutFromCoordinates(allSeats);
    const allSeatIds = allSeats.map((s) => s.id);
    const dateKey = getDateKey(pageData.showDate);
    console.log("dateKey", dateKey);

    const orderSeatIds =
      props.orderData?.seatBookings.map((b) => b.seat.id) || [];

    pageData.bookedSeats = allSeats.filter((s) =>
      s.seatBookings?.some((b) => {
        const isSameDay = getDateKey(b.showDate) === dateKey;
        console.log("isSameDay", isSameDay);

        const isBooked = ["BOOKED", "PAID"].includes(b.status);
        const isDifferentFromOrder = !orderSeatIds.includes(s.id);
        return (
          isSameDay &&
          isBooked &&
          (props.mode !== "change" || isDifferentFromOrder)
        );
      })
    );

    const savedSeats = pageData.selectedSeatsMap[dateKey] || [];
    pageData.selectedSeats = savedSeats.filter((s) =>
      allSeatIds.includes(s.id)
    );
  } catch (err) {
    console.error("โหลดที่นั่งล้มเหลว", err);
  } finally {
    pageData.loading = false;
  }
};

const onZoneChange = async (newZone) => {
  if (!newZone) return;
  pageData.zoneKey = newZone;
  pageData.selectedSeats = [];
  await fetchSeats();
};

const handleDateChange = async (newDate) => {
  const dateKey = getDateKey(newDate);
  const orderDateKey = getDateKey(props.orderData?.showDate);
  pageData.showDate = newDate;

  for (const key in pageData.selectedSeatsMap) {
    if (key !== orderDateKey) {
      delete pageData.selectedSeatsMap[key];
    }
  }

  pageData.selectedSeats = pageData.selectedSeatsMap[dateKey] || [];

  pageData.totalAmount = 0;
  await fetchSeats();
};

function toggleSeat(seat) {
  const seatId = seat.id;
  const isAlreadySelected = pageData.selectedSeats.some((s) => s.id === seatId);

  if (isAlreadySelected) {
    pageData.selectedSeats = pageData.selectedSeats.filter(
      (s) => s.id !== seatId
    );
  } else {
    const maxSelectable =
      props.mode === "change" && props.orderData.status === "PAID"
        ? originalSeatCount.value
        : 10;

    if (pageData.selectedSeats.length >= maxSelectable) {
      toast.warning(
        `คุณสามารถเลือกได้สูงสุด ${maxSelectable} ที่นั่งตามจำนวนที่ซื้อไว้`,
        { id: "max-seat-warning" }
      );
      return;
    }

    pageData.selectedSeats.push(seat);
  }

  const dateKey = getDateKey(pageData.showDate);
  pageData.selectedSeatsMap[dateKey] = [...pageData.selectedSeats];
}

const getSeatStatus = (seat) => {
  if (!seat) return "unavailable";
  const isSelected = pageData.selectedSeats.some((s) => s.id === seat.id);
  const isBooked = pageData.bookedSeats.some((b) => b.id === seat.id);
  if (isSelected) return "selected";
  if (isBooked) return "booked";
  return "available";
};

const handleConfirm = async () => {
  if (!pageData.selectedSeats.length) {
    toast.warning("กรุณาเลือกที่นั่งก่อน");
    return;
  }
  if (props.mode === "change" && props.orderData?.status === "PAID") {
    const selectedCount = pageData.selectedSeats.length;
    const originalCount = originalSeatCount.value;

    if (selectedCount !== originalCount) {
      toast.warning(
        `คุณต้องเลือกที่นั่งให้ครบ ${originalCount} ที่นั่งตามที่เคยชำระเงินแล้ว`
      );
      return;
    }
  }

  const showDateStr = dayjs(pageData.showDate).format("DD-MM-YYYY'");
  const todayStr = dayjs().format("DD-MM-YYYY'");

  const orderPayload = {
    seatIds: pageData.selectedSeats.map((s) => s.id),
    showDate: dayjs(pageData.showDate).format("YYYY-MM-DD"),
    method: "CASH",
    status: showDateStr === todayStr ? "PENDING" : "BOOKED",
  };

  try {
    pageData.loading = true;

    if (props.mode === "booking") {
      const order = await submitOrder(orderPayload);
      if (order.status === "PENDING") {
        pageData.orderId = order.id;
        pageData.totalAmount = order.total;
        const dateKey = getDateKey(pageData.showDate);
        pageData.selectedSeatsMap[dateKey] = [...pageData.selectedSeats];
        pageData.showSummaryModal = true;
      } else {
        pageData.showSeatModal = false;
        // toast.success("จองล่วงหน้าเรียบร้อย");
        emit("close");
      }
    } else if (props.mode === "change") {
      if (props.orderData.status === "PAID") {
        await changeSeats(
          props.orderData.id,
          orderPayload.seatIds,
          orderPayload.showDate
        );
        toast.success("เปลี่ยนที่นั่งเรียบร้อย");
        pageData.showSeatModal = false;
        pageData.selectedSeatsMap = {};
        emit("close");
      } else {
        const updated = await updateOrderBooked(
          props.orderData.id,
          orderPayload.seatIds,
          orderPayload.showDate
        );
        pageData.orderId = updated.id;
        pageData.totalAmount = updated.total;
        pageData.selectedSeats = updated.seats;
        const dateKey = getDateKey(pageData.showDate);
        pageData.selectedSeatsMap[dateKey] = [...updated.seats];
        pageData.showSummaryModal = true;
      }
    }
  } catch (err) {
    toast.error(err.message || "เกิดข้อผิดพลาด");
  } finally {
    pageData.loading = false;
  }
};

onMounted(() => {
  pageData.showDate = props.orderData?.showDate || new Date();
  pageData.zoneKey = props.zoneKey;
});

watch(
  () => props.show,
  async (isOpen) => {
    if (isOpen) {
      isFirstOpen.value = true;
      pageData.showSeatModal = true;
      pageData.showDate = props.orderData?.showDate || new Date();
      await onZoneChange(props.zoneKey);
      if (props.mode === "change" && props.orderData) {
        const fallbackSeats = props.orderData.seatBookings.map((b) => b.seat);
        const dateKey = getDateKey(pageData.showDate);
        pageData.selectedSeats = [];

        pageData.selectedSeats = [...fallbackSeats];
        pageData.selectedSeatsMap[dateKey] = [...fallbackSeats];
        pageData.totalAmount = props.orderData.total;
        originalSeatCount.value = fallbackSeats.length;
        isFirstOpen.value = false;
      }
    }
  }
);

watch(
  () => pageData.showSeatModal,
  async (isOpen) => {
    if (isOpen && !props.show) {
      await fetchSeats();
    }
  }
);

const onClose = () => {
  pageData.resetPageData();
  pageData.showSeatModal = false;
  pageData.selectedSeatsMap = {};
  emit("close");
};
const onCloseSummaryModal = () => {
  pageData.resetPageData();
  pageData.showSummaryModal = false;
  pageData.showSeatModal = false;
  pageData.selectedSeatsMap = {};
  emit("close");
};

onBeforeUnmount(() => {
  document.body.style.overflow = "";
});
</script>
