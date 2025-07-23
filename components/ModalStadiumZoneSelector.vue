<template>
  <Teleport to="body">
    <div
      v-show="props.isOpen"
      class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center"
      @click.self="onClose"
    >
      <div
        class="w-full max-w-[95%] sm:max-w-md md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto my-6 flex flex-col bg-white border border-gray-200 rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden"
      >
        <!-- Sticky Header -->
        <div class="sticky top-0 z-20 bg-white px-6 pt-6 pb-4 border-b">
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

        <!-- Scrollable Body -->
        <div class="flex-1 overflow-y-auto p-6 space-y-6">
          <!-- Zone and Date Selectors -->
          <div class="flex justify-center px-6 pt-4">
            <div class="w-full max-w-xs sm:max-w-sm md:max-w-md p-4">
              <BaseSelect
                v-model="pageData.zoneKey"
                :options="pageData.zoneOptions"
                label="ค้นหาโซน"
                placeholder="เลือกโซน"
                searchable
                clearable
                @update:modelValue="onZoneChange"
              />
              <div class="mt-4">
                <DatePicker
                  v-model="pageData.showDate"
                  :placeholder="'\u0e40\u0e25\u0e37\u0e2d\u0e01\u0e27\u0e31\u0e19\u0e17\u0e35\u0e48'"
                  @update:modelValue="handleDateChange"
                />
              </div>
            </div>
          </div>

          <!-- Seat Grid -->
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
                    <div
                      v-for="seat in row"
                      :key="`${seat?.id}-${seatManager.lastUpdateTimestamp.value}`"
                    >
                      <SeatIcon
                        v-if="seat && seat.seatNumber"
                        :seat="{ ...seat }"
                        :status="getSeatStatus(seat)"
                        :selectedSeats="[...seatManager.mySelectedSeats.value]"
                        :bookedSeats="[...(pageData.bookedSeats || [])]"
                        :zoneKey="pageData.zoneKey"
                        @toggle="handleSeatToggle"
                        :ownSeatIds="[
                          ...(props.orderData?.seats.map((b) => b.id) || []),
                        ]"
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
            <div class="flex items-center gap-2 text-green-600 font-semibold">
              <img src="/images/seat-selected.png" class="w-4 h-4" />
              ที่คุณเลือก
            </div>
            <div class="flex items-center gap-2 text-orange-600 font-semibold">
              <div class="w-4 h-4 bg-orange-400 rounded-sm"></div>
              ถูกล็อก
            </div>
            <div class="flex items-center gap-2 text-gray-400 line-through">
              <img src="/images/seat-booked.png" class="w-4 h-4 opacity-50" />
              ไม่ว่าง
            </div>
          </div>

          <!-- Selected Seats Summary -->
          <div
            v-if="seatManager.selectedSeatCount.value > 0"
            class="mt-4 border-t pt-6"
          >
            <div
              class="w-full max-w-full sm:max-w-md md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto bg-white border border-gray-300 rounded-2xl shadow-2xl px-6 py-5"
            >
              <div class="text-center space-y-3">
                <p class="text-sm text-gray-600 tracking-wide font-medium">
                  ที่นั่งที่เลือก
                </p>
                <p class="text-xl font-semibold text-blue-600 tracking-wider">
                  {{ seatManager.getSeatsSummary().seatNumbers }}
                </p>
                <p class="text-lg sm:text-xl font-semibold tracking-wide">
                  <span class="text-blue-600">ราคารวม:</span>
                  <span class="text-cyan-500">
                    {{ seatManager.totalPrice.value }}
                  </span>
                  <span class="ml-1 text-sm text-gray-500">บาท</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Sticky Footer -->
        <div
          v-if="seatManager.selectedSeatCount.value > 0"
          class="sticky bottom-0 z-20 bg-white px-6 py-4 border-t"
        >
          <div class="flex justify-center gap-3 flex-wrap">
            <button
              @click="onClose"
              :disabled="isBookingInProgress || isProcessing"
              class="min-w-[90px] px-4 py-2 border border-blue-500 text-blue-600 text-sm font-semibold rounded-full shadow-sm hover:bg-blue-50 transition-all disabled:opacity-50"
            >
              ย้อนกลับ
            </button>
            <button
              @click="onClear"
              :disabled="isBookingInProgress || isProcessing"
              class="min-w-[90px] px-4 py-2 border border-red-400 text-red-500 text-sm font-semibold rounded-full shadow-sm hover:bg-red-50 transition-all disabled:opacity-50"
            >
              ยกเลิกทั้งหมด
            </button>
            <button
              @click="handleConfirm"
              :disabled="
                isBookingInProgress || isProcessing || !canProceedToBooking
              "
              class="min-w-[90px] px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-400 text-white text-sm font-semibold rounded-full shadow-md hover:opacity-90 transition-all disabled:opacity-50"
            >
              <span v-if="isBookingInProgress || isProcessing">
                <i class="mdi mdi-loading mdi-spin mr-1"></i>
                กำลังจอง...
              </span>
              <span v-else>
                {{
                  props.mode === "change" && props?.orderData?.status === "PAID"
                    ? "ยืนยันเปลี่ยนที่นั่ง"
                    : "ซิ้อตั๋ว"
                }}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Summary Modal -->
    <SummaryModal
      v-if="pageData.showSummaryModal"
      :visible="pageData.showSummaryModal"
      :selectedSeats="seatManager.mySelectedSeats.value"
      :zone="pageData.zoneKey"
      :total="seatManager.totalPrice.value"
      :userRole="pageData.userRole"
      :dataZoneSelected="pageData"
      :mode="props.mode"
      @close="onCloseSummaryModal"
    />
  </Teleport>
</template>

<script setup>
import dayjs from "dayjs";
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
import { useSingleToast } from "@/composables/useSingleToast";
const { showToast } = useSingleToast();
import { useI18n } from "vue-i18n";
import { SummaryModal } from "@/components";
import { usePageData } from "@/stores/pageData";
import { useAuthStore } from "@/stores/auth";
import { useSeatApi } from "@/composables/useSeatApi";
import { useOrder } from "@/composables/useOrder";
import { buildSeatLayoutFromCoordinates } from "@/utils/buildSeatLayout";
import { useIntegratedSeatBooking } from "@/composables/useIntegratedSeatBooking";
import { ref as vueRef } from "vue";

const { t } = useI18n();
const pageData = usePageData();
const { getSeatsByZoneId } = useSeatApi();
const auth = useAuthStore();

// ===== New Integrated Seat Booking System =====
const seatBookingSystem = useIntegratedSeatBooking();
const {
  isProcessing,
  isBookingInProgress,
  canProceedToBooking,
  maxSelectableSeats,
  seatManager,
  initializeSeats,
  refreshSeats,
  clearAllSelections,
  createBooking,
  cleanup,
} = seatBookingSystem;

// ===== Authentication =====
if (!auth.user) auth.loadUser();

// ====================
// Props และ Emits
// ====================
const props = defineProps({
  zoneKey: String,
  isOpen: Boolean,
  mode: { type: String, default: "booking" },
  orderData: Object,
});

const emit = defineEmits(["close"]);

// ====================
// Reactive State
// ====================
const isFirstOpen = ref(true);
const originalSeatCount = ref(0);

// ====================
// Computed Properties
// ====================
const isConnected = computed(() => false); // Will be updated with WebSocket status

// ====================
// Helper Functions
// ====================
const getDateKey = (date) => dayjs(date).format("YYYY-MM-DD");
const getCurrentUserId = () => auth?.user?.id || "anonymous";

// ====================
// ดึงข้อมูลที่นั่งและเริ่มต้นระบบ
// ====================
const fetchAndInitializeSeats = async () => {
  if (!pageData.zoneKey || !pageData.showDate) return;

  try {
    pageData.loading = true;

    // ใช้ new integrated system
    const success = await initializeSeats(
      getSeatsByZoneId,
      pageData.zoneKey,
      pageData.showDate
    );

    if (success) {
      // Update pageData for compatibility with existing UI
      pageData.currentZoneSeats = buildSeatLayoutFromCoordinates(
        seatManager.allSeats.value
      );
      pageData.bookedSeats = seatManager.allSeats.value.filter(
        (seat) => seatManager.getSeatStatus(seat) === "BOOKED"
      );
    }
  } catch (error) {
    console.error("❌ โหลดที่นั่งล้มเหลว:", error);
    showToast("error", "ไม่สามารถโหลดข้อมูลที่นั่งได้");
  } finally {
    pageData.loading = false;
  }
};

// ====================
// การจัดการโซนและวันที่
// ====================
const onZoneChange = async (newZone) => {
  if (!newZone || isProcessing.value) return;

  pageData.zoneKey = newZone;
  await fetchAndInitializeSeats();
};

const handleDateChange = async (newDate) => {
  if (!newDate || isProcessing.value) return;

  pageData.showDate = newDate;
  await fetchAndInitializeSeats();
};

// ====================
// การจัดการเลือกที่นั่ง
// ====================
const handleSeatToggle = async (seat) => {
  const success = await seatBookingSystem.toggleSeat(seat);

  if (success) {
    // Update pageData for compatibility
    pageData.currentZoneSeats = buildSeatLayoutFromCoordinates(
      seatManager.allSeats.value
    );
  }
};

// ====================
// การจัดการสถานะที่นั่ง
// ====================
const getSeatStatus = (seat) => {
  if (!seat) return "unavailable";

  // ปลดล็อคทันทีถ้า isLockedUntil ไม่มีค่า
  if (seat.isLockedUntil === null || seat.isLockedUntil === undefined) {
    // console.log("seat", seat);

    // ถ้า seat ถูกจองจริง ๆ ให้คืน "BOOKED"
    if (
      seat.bookingStatus === "BOOKED" ||
      seatManager.getSeatStatus(seat) === "BOOKED"
    ) {
      return "BOOKED";
    }
    return "AVAILABLE";
  }
  // ถ้า isLockedUntil มีค่า ให้คืน "locked"
  if (seat.isLockedUntil) {
    return "locked";
  }

  // fallback: คืนสถานะจาก seatManager
  return seatManager.getSeatStatus(seat);
};

// ====================
// การจัดการการจอง
// ====================
const handleConfirm = async () => {
  if (seatManager.selectedSeatCount.value === 0) {
    showToast("warning", "กรุณาเลือกที่นั่งก่อน");
    return;
  }

  try {
    const orderData = {
      showDate: getDateKey(pageData.showDate),
      customerName: "",
      customerPhone: "",
      customerEmail: "",
      ticketType: "RINGSIDE",
      paymentMethod: "CASH",
      source: "OTHER",
      status: "PENDING",
    };

    const order = await createBooking(orderData);

    if (order) {
      pageData.orderId = order.id || order.orderId;
      pageData.totalAmount = order.total || seatManager.totalPrice.value;
      emit("close");
      pageData.showSummaryModal = true;

      // toast.success("สร้างการจองสำเร็จ");
    }
  } catch (error) {
    console.error("❌ สร้างการจองล้มเหลว:", error);
    showToast("error", "เกิดข้อผิดพลาดในการจอง");
  }
};

const handleMarkOrder = async () => {
  if (seatManager.selectedSeatCount.value === 0) {
    showToast("warning", "กรุณาเลือกที่นั่งก่อน");
    return;
  }

  try {
    const orderData = {
      showDate: getDateKey(pageData.showDate),
      customerName: "",
      customerPhone: "",
      customerEmail: "",
      ticketType: "RINGSIDE",
      paymentMethod: "CASH",
      source: "OTHER",
      status: "BOOKED",
    };

    await createBooking(orderData);

    showToast("success", "จองที่นั่งเรียบร้อยแล้ว");
    await resetAndClose();
  } catch (error) {
    console.error("❌ จองที่นั่งล้มเหลว:", error);
    showToast("error", "เกิดข้อผิดพลาดในการจอง");
    if (!success) {
      showToast("warning", "ไม่สามารถเลือกที่นั่งนี้ได้");
    }
  }
};

// ====================
// Lifecycle Hooks
// ====================
// ไม่ต้องเซ็ตค่าอะไรใน onMounted

onBeforeUnmount(() => {
  cleanup();
});

// ====================
// Watchers
// ====================

watch(
  () => props.isOpen,
  async (isOpen) => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");

      // 1. เซ็ตค่า pageData
      let showDate = props.orderData?.showDate;
      if (showDate) {
        let d = dayjs(showDate, "YYYY-MM-DD", true);
        if (d.isValid()) showDate = d.format("YYYY-MM-DD");
        else {
          d = dayjs(showDate, "DD/MM/YYYY", true);
          if (d.isValid()) showDate = d.format("YYYY-MM-DD");
          else {
            d = dayjs(showDate);
            if (d.isValid()) showDate = d.format("YYYY-MM-DD");
            else if (/^\d{2}\/\d{2}\/\d{4}$/.test(showDate)) {
              const [day, month, year] = showDate.split("/");
              showDate = `${year}-${month.padStart(2, "0")}-${day.padStart(
                2,
                "0"
              )}`;
            } else {
              showDate = new Date();
            }
          }
        }
      } else {
        showDate = new Date();
      }
      pageData.zoneKey = props.zoneKey;
      pageData.showDate = showDate;

      // 2. clear selections (ไม่ await เพื่อไม่ trigger ซ้อน)
      clearAllSelections();

      // 3. fetch/init seats
      await fetchAndInitializeSeats();

      // 4. fallback select seats (mode change)
      if (props.mode === "change" && props.orderData) {
        const fallbackSeats = props.orderData.seats.map((b) => b.seat);
        originalSeatCount.value = fallbackSeats.length;
        const allSeatIds = seatManager.allSeats.value.map((s) => s.id);
        fallbackSeats.forEach((seat) => {
          if (allSeatIds.includes(seat.id)) {
            seatManager.selectSeat(seat.id);
          }
        });
      }
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }
);

watch(
  () => seatManager.lastUpdateTimestamp.value,
  async () => {
    try {
      pageData.loading = true;
      // Trigger API call to fetch updated seat data
      const updatedSeats = await getSeatsByZoneId(
        pageData.zoneKey,
        pageData.showDate
      );
      // Sync state in seatManager
      seatManager.initializeSeats(updatedSeats.data);
      // เคลียร์ layout และ bookedSeats ก่อน เพื่อ force Vue ให้ render ใหม่
      pageData.currentZoneSeats = [];
      pageData.bookedSeats = [];
      await Promise.resolve(); // nextTick workaround
      // Build layout ใหม่จาก state ล่าสุด
      const freshSeats = seatManager.allSeats.value.map((seat) => ({
        ...seat,
        bookingStatus: seatManager.getSeatStatus(seat),
      }));
      pageData.currentZoneSeats = buildSeatLayoutFromCoordinates(freshSeats);
      pageData.bookedSeats = freshSeats.filter(
        (seat) => seatManager.getSeatStatus(seat) === "BOOKED"
      );
      pageData.loading = false;
    } catch (error) {
      console.error("❌ Failed to fetch updated seats:", error);
      pageData.loading = false;
    }
  }
);

// ====================
// การจัดการปิด Modal
// ====================
const resetAndClose = async () => {
  const zone = pageData.zoneKey;
  await clearAllSelections();
  pageData.resetPageData();
  pageData.zoneKey = zone; // set กลับหลัง reset
  pageData.showSeatModal = false;
  cleanup();
  emit("close");
};

const onClose = async () => {
  await resetAndClose();
};

const onClear = async () => {
  pageData.currentZoneSeats = buildSeatLayoutFromCoordinates(
    seatManager.allSeats.value
  );
  const success = await clearAllSelections();
  if (success) {
    pageData.totalAmount = 0;
  }
};

const onCloseSummaryModal = async () => {
  pageData.showSummaryModal = false;
  const success = await clearAllSelections();
  await resetAndClose();
};

onBeforeUnmount(() => {
  document.body.classList.remove("overflow-hidden");
  cleanup();
});
</script>
