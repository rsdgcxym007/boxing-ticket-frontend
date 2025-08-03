<template>
  <Teleport to="body">
    <div
      v-show="props.isOpen"
      class="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
      @click.self="onClose"
    >
      <div
        class="w-full max-w-[95%] sm:max-w-md md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto my-6 flex flex-col bg-white/95 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl max-h-[90vh] overflow-hidden"
      >
        <!-- Sticky Header -->
        <div
          class="sticky top-0 z-20 bg-gradient-to-r from-white to-slate-50 px-6 pt-6 pb-4 border-b border-slate-200 shadow-sm"
        >
          <button
            class="absolute top-6 right-6 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full p-2 transition-all duration-300 group"
            @click="onClose"
          >
            <i
              class="mdi mdi-close text-xl group-hover:rotate-90 transition-transform"
            ></i>
          </button>
          <div class="text-center">
            <div class="flex items-center justify-center gap-3 mb-2">
              <div
                class="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg"
              >
                <i class="mdi mdi-seat-outline text-white text-2xl"></i>
              </div>
              <h2
                class="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent"
              >
                {{ t("selectSeats") }}
              </h2>
            </div>
            <div
              class="inline-flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-full border border-indigo-200"
            >
              <i class="mdi mdi-map-marker text-indigo-600"></i>
              <span class="text-sm text-slate-600">{{ t("zone") }}:</span>
              <span class="font-bold text-indigo-700 uppercase tracking-wide">
                {{ pageData.zoneKey.replace("-", " ") }}
              </span>
            </div>
          </div>
        </div>

        <!-- Scrollable Body -->
        <div class="flex-1 overflow-y-auto p-6 space-y-6">
          <!-- Zone and Date Selectors -->

          <div class="flex justify-center">
            <div class="w-full max-w-2xl sm:max-w-3xl md:max-w-4xl">
              <div
                class="bg-white rounded-2xl p-3 border border-slate-200 shadow-xl"
              >
                <div class="space-y-6">
                  <!-- Purchase Type -->
                  <div
                    class="flex flex-row flex-wrap items-center gap-3 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-6 w-full"
                  >
                    <label
                      class="text-sm flex items-center gap-2 text-slate-700 font-semibold whitespace-nowrap"
                    >
                      <i class="mdi mdi-store-outline text-orange-500" />
                      ประเภทการซื้อ
                    </label>
                    <div
                      class="flex flex-row flex-wrap items-center gap-3 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-6 w-full"
                    >
                      <label
                        v-for="option in purchaseTypeOptionsForForm.filter(
                          (o) => o.value === 'ONSITE' || o.value === 'BOOKING'
                        )"
                        :key="option.value"
                        class="flex items-center gap-[1px] cursor-pointer px-1 py-1 rounded-lg border-2 transition-all duration-300 shadow-sm text-xs min-w-[110px] max-w-[150px] sm:min-w-[120px] sm:max-w-[160px] md:min-w-[130px] md:max-w-[170px] lg:min-w-[140px] lg:max-w-[180px] xl:min-w-[150px] xl:max-w-[200px]"
                        :class="
                          pageData.purchaseType === option.value
                            ? 'border-orange-400 bg-gradient-to-br from-orange-50 to-orange-100 shadow-md'
                            : 'border-slate-300 bg-white hover:border-orange-300 hover:bg-orange-50/50 hover:shadow-md'
                        "
                        style="min-width: 120px; max-width: 160px"
                      >
                        <input
                          type="radio"
                          v-model="pageData.purchaseType"
                          :value="option.value"
                          class="accent-orange-500 w-4 h-4 mr-1"
                        />
                        <div
                          class="flex items-center w-full justify-center gap-3"
                        >
                          <div
                            class="p-0.5 gap-3 rounded-md transition-colors flex items-center justify-center"
                            :class="
                              pageData.purchaseType === option.value
                                ? 'bg-orange-500 text-white'
                                : 'bg-slate-100 text-slate-600'
                            "
                            style="min-width: 16px; min-height: 16px"
                          >
                            <i :class="`mdi ${option.icon} text-xs`"></i>
                          </div>
                          <div class="flex flex-col justify-center">
                            <p
                              class="font-bold text-slate-800 text-xs leading-tight"
                            >
                              {{ option.label }}
                            </p>
                            <p class="text-[9px] text-slate-600 leading-tight">
                              {{ option.description }}
                            </p>
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                  <!-- Zone & Date Row -->
                  <div
                    class="flex flex-col sm:flex-row gap-4 items-center w-full"
                  >
                    <div class="flex-1 w-full">
                      <label
                        class="text-sm font-semibold text-slate-700 mb-2 block"
                      >
                        <i
                          class="mdi mdi-map-marker-outline text-blue-500 mr-2"
                        ></i>
                        เลือกโซน
                      </label>
                      <BaseSelect
                        v-model="pageData.zoneKey"
                        :options="pageData.zoneOptions"
                        placeholder="เลือกโซน"
                        searchable
                        clearable
                        @update:modelValue="onZoneChange"
                        class="w-full h-[40.5px]"
                      />
                    </div>
                    <div class="flex-1 w-full">
                      <label
                        class="text-sm font-semibold text-slate-700 mb-2 block"
                      >
                        <i
                          class="mdi mdi-calendar-outline text-green-500 mr-2"
                        ></i>
                        เลือกวันที่
                      </label>
                      <DatePicker
                        v-model="pageData.showDate"
                        placeholder="เลือกวันที่"
                        @update:modelValue="handleDateChange"
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
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Seat Grid -->
          <div class="w-full">
            <div
              class="max-h-[70vh] overflow-auto bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border border-slate-200 shadow-inner p-6"
              style="margin: 0 auto"
            >
              <div class="flex flex-col gap-3 items-center w-full">
                <div
                  v-for="(row, i) in pageData.currentZoneSeats"
                  :key="i"
                  class="w-full grid place-items-center"
                >
                  <div
                    class="grid gap-2"
                    :style="{
                      gridTemplateColumns: `repeat(${row.length}, minmax(2.2rem, auto))`,
                    }"
                  >
                    <div
                      v-for="seat in row"
                      :key="`${seat?.id}-${seatManager.lastUpdateTimestamp.value}`"
                      class="flex flex-col items-center justify-center"
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
                        class="w-8 sm:w-10 md:w-11 transition-all duration-300 hover:scale-105 cursor-pointer mb-3"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Legend -->
          <div
            class="flex justify-center flex-wrap gap-6 text-sm font-medium bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-4 border border-slate-200"
          >
            <div
              class="flex items-center gap-3 px-3 py-2 bg-white rounded-lg shadow-sm border border-slate-200"
            >
              <div
                class="w-6 h-6 bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-300 rounded-lg flex items-center justify-center"
              >
                <i class="mdi mdi-seat text-slate-600 text-sm"></i>
              </div>
              <span class="text-slate-700 font-semibold">ว่าง</span>
            </div>

            <div
              class="flex items-center gap-3 px-3 py-2 bg-white rounded-lg shadow-sm border border-blue-200"
            >
              <div
                class="w-6 h-6 bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-blue-300 rounded-lg flex items-center justify-center"
              >
                <i class="mdi mdi-check-circle text-white text-sm"></i>
              </div>
              <span class="text-blue-600 font-semibold">เลือกแล้ว</span>
            </div>

            <div
              class="flex items-center gap-3 px-3 py-2 bg-white rounded-lg shadow-sm border border-amber-200"
            >
              <div
                class="w-6 h-6 bg-gradient-to-br from-amber-100 to-orange-200 border-2 border-amber-400 rounded-lg flex items-center justify-center"
              >
                <i class="mdi mdi-lock text-amber-600 text-sm"></i>
              </div>
              <span class="text-amber-600 font-semibold">ถูกล็อก</span>
            </div>

            <div
              class="flex items-center gap-3 px-3 py-2 bg-white rounded-lg shadow-sm border border-gray-200"
            >
              <div
                class="w-6 h-6 bg-gray-200 border-2 border-gray-300 rounded-lg flex items-center justify-center"
              >
                <i class="mdi mdi-close-circle text-gray-400 text-sm"></i>
              </div>
              <span class="text-gray-500 font-semibold line-through"
                >ไม่ว่าง</span
              >
            </div>
          </div>

          <!-- Selected Seats Summary -->
          <div v-if="seatManager.selectedSeatCount.value > 0" class="mt-6">
            <div
              class="w-full max-w-full sm:max-w-md md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl shadow-xl px-6 py-5"
            >
              <div class="text-center space-y-4">
                <div class="flex items-center justify-center gap-2 mb-2">
                  <i class="mdi mdi-seat-outline text-blue-600 text-xl"></i>
                  <p
                    class="text-sm text-blue-700 tracking-wide font-bold uppercase"
                  >
                    ที่นั่งที่เลือก
                  </p>
                </div>

                <div class="bg-white/60 rounded-xl p-3 border border-blue-200">
                  <p class="text-xl font-bold text-blue-800 tracking-wider">
                    {{ seatManager.getSeatsSummary().seatNumbers }}
                  </p>
                </div>

                <div class="flex items-center justify-center gap-2">
                  <i class="mdi mdi-cash-multiple text-emerald-600 text-xl"></i>
                  <p class="text-lg sm:text-xl font-bold tracking-wide">
                    <span class="text-slate-700">ราคารวม:</span>
                    <span class="text-emerald-600 ml-2">
                      {{ seatManager.totalPrice.value.toLocaleString() }}
                    </span>
                    <span class="ml-1 text-sm text-slate-500 font-medium"
                      >บาท</span
                    >
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sticky Footer -->
        <div
          v-if="seatManager.selectedSeatCount.value > 0"
          class="sticky bottom-0 z-20 bg-gradient-to-r from-white to-slate-50 px-6 py-4 border-t border-slate-200 shadow-lg"
        >
          <div class="flex justify-center gap-4 flex-wrap">
            <button
              @click="onClose"
              :disabled="isBookingInProgress || isProcessing"
              class="group min-w-[100px] px-5 py-2.5 border-2 border-slate-300 text-slate-600 text-sm font-semibold rounded-xl shadow-sm hover:bg-slate-50 hover:border-slate-400 transition-all duration-300 disabled:opacity-50 flex items-center gap-2"
            >
              <i
                class="mdi mdi-arrow-left text-sm group-hover:translate-x-[-2px] transition-transform"
              ></i>
              ย้อนกลับ
            </button>

            <button
              @click="onClear"
              :disabled="isBookingInProgress || isProcessing"
              class="group min-w-[100px] px-5 py-2.5 border-2 border-red-300 text-red-600 text-sm font-semibold rounded-xl shadow-sm hover:bg-red-50 hover:border-red-400 transition-all duration-300 disabled:opacity-50 flex items-center gap-2"
            >
              <i
                class="mdi mdi-close-circle text-sm group-hover:rotate-90 transition-transform"
              ></i>
              ยกเลิกทั้งหมด
            </button>

            <button
              @click="handleMarkOrder"
              :disabled="isBookingInProgress || isProcessing"
              class="group min-w-[100px] px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-sm font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 flex items-center gap-2"
            >
              <i
                class="mdi mdi-close-circle text-sm group-hover:rotate-90 transition-transform"
              ></i>
              จองตั๋ว
            </button>

            <button
              @click="handleConfirm"
              :disabled="
                isBookingInProgress || isProcessing || !canProceedToBooking
              "
              class="group min-w-[100px] px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-sm font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 flex items-center gap-2"
            >
              <span
                v-if="isBookingInProgress || isProcessing"
                class="flex items-center gap-2"
              >
                <i class="mdi mdi-loading mdi-spin text-sm"></i>
                กำลังจอง...
              </span>
              <span v-else class="flex items-center gap-2">
                <i
                  class="mdi mdi-ticket-confirmation text-sm group-hover:scale-110 transition-transform"
                ></i>
                {{
                  props.mode === "change" && props?.orderData?.status === "PAID"
                    ? "ยืนยันเปลี่ยนที่นั่ง"
                    : "ซื้อตั๋ว"
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
      :purchaseType="pageData.purchaseType"
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
import { useImagePath } from "@/composables/useImagePath";

const { getImagePath } = useImagePath();
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
import { purchaseTypeOptions } from "@/utils/orderOptions";

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

const purchaseTypeOptionsForForm = computed(() =>
  purchaseTypeOptions.map((option) => ({
    ...option,
    icon:
      option.value === "WEBSITE"
        ? "mdi-web"
        : option.value === "BOOKING"
        ? "mdi-phone-in-talk"
        : "mdi-store",
    description:
      option.value === "WEBSITE"
        ? "ซื้อผ่านเว็บไซต์"
        : option.value === "BOOKING"
        ? "BOOKING"
        : "ซื้อหน้างาน",
  }))
);
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
      purchaseType: pageData.purchaseType,
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
      purchaseType: pageData.purchaseType,
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
</style>
