<template>
  <Teleport to="body">
    <div
      v-if="props.isOpen"
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

            <!-- Connection Status -->
            <div class="flex justify-center mt-2">
              <div class="flex items-center gap-2 text-xs">
                <div
                  :class="[
                    'w-2 h-2 rounded-full',
                    isConnected ? 'bg-green-500' : 'bg-red-500',
                  ]"
                ></div>
                <span :class="isConnected ? 'text-green-600' : 'text-red-600'">
                  {{ isConnected ? "เชื่อมต่อแล้ว" : "ไม่ได้เชื่อมต่อ" }}
                </span>
              </div>
            </div>
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
              <div class="flex items-center gap-2 text-green-600 font-semibold">
                <img src="/images/seat-selected.png" class="w-4 h-4" />
                ที่คุณเลือก
              </div>
              <div
                class="flex items-center gap-2 text-orange-600 font-semibold"
              >
                <div class="w-4 h-4 bg-orange-400 rounded-sm"></div>
                ถูกล็อก
              </div>
              <div class="flex items-center gap-2 text-gray-400 line-through">
                <img src="/images/seat-booked.png" class="w-4 h-4 opacity-50" />
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
                  <p class="text-xl font-semibold text-blue-600 tracking-wider">
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
                      @click="handleMarkOrder"
                      :disabled="
                        isBookingInProgress ||
                        isProcessing ||
                        !canProceedToBooking
                      "
                      class="min-w-[90px] px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-400 text-white text-sm font-semibold rounded-full shadow-md hover:opacity-90 transition-all disabled:opacity-50"
                    >
                      <span v-if="isBookingInProgress || isProcessing">
                        <i class="mdi mdi-loading mdi-spin mr-1"></i>
                        กำลังจอง...
                      </span>
                      <span v-else>
                        {{
                          props.mode === "change"
                            ? "จองที่นั่ง"
                            : "ยืนยันการจอง"
                        }}
                      </span>
                    </button>
                    <button
                      @click="handleConfirm"
                      :disabled="
                        isBookingInProgress ||
                        isProcessing ||
                        !canProceedToBooking
                      "
                      class="min-w-[90px] px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-400 text-white text-sm font-semibold rounded-full shadow-md hover:opacity-90 transition-all disabled:opacity-50"
                    >
                      <span v-if="isBookingInProgress || isProcessing">
                        <i class="mdi mdi-loading mdi-spin mr-1"></i>
                        กำลังจอง...
                      </span>
                      <span v-else>
                        {{
                          props.mode === "change" &&
                          props?.orderData?.status === "PAID"
                            ? "ยืนยันเปลี่ยนที่นั่ง"
                            : "ซื้อตั๋ว"
                        }}
                      </span>
                    </button>
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
    />
  </Teleport>
</template>

<script setup>
import dayjs from "dayjs";
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
import { useToast } from "vue-toastification";
import { useI18n } from "vue-i18n";
import { SummaryModal } from "@/components";
import { usePageData } from "@/stores/pageData";
import { useAuthStore } from "@/stores/auth";
import { useSeatApi } from "@/composables/useSeatApi";
import { useOrder } from "@/composables/useOrder";
import { buildSeatLayoutFromCoordinates } from "@/utils/buildSeatLayout";
import { useTicketBookingManager } from "@/composables/useTicketBookingManager";
import { useSeatManager } from "@/composables/useSeatManager";
import { useWebSocket } from "@/composables/useWebSocket";
import { useEnhancedOrderSystem } from "@/composables/useEnhancedOrderSystem";

const { t } = useI18n();
const pageData = usePageData();
const { getSeatsByZoneId } = useSeatApi();
const toast = useToast();
const auth = useAuthStore();

// ===== Enhanced Booking System =====
let bookingManager = null;
let seatManager = null;
let webSocketManager = null;

// ฟังก์ชันเริ่มต้น composables
const initializeComposables = () => {
  try {
    pageData.loading = true;
    bookingManager = useTicketBookingManager();
    seatManager = useSeatManager();
    webSocketManager = useWebSocket();
    pageData.loading = false;
  } catch (error) {
    console.error("❌ เริ่มต้น Composables ล้มเหลว:", error);
    // ใช้ fallback values
    bookingManager = {
      initializeBooking: async () => {},
      selectSeatsWithLock: async () => {},
      createOrderWithProtection: async () => ({}),
      cancelSeatSelection: async () => {},
      isBookingInProgress: ref(false),
      canProceedToBooking: ref(true),
      systemHealth: ref({ status: "unknown" }),
    };
    seatManager = {
      updateSeatStatus: () => {},
      canSelectSeat: () => true,
      refreshSeatData: async () => {},
      SEAT_STATUS: {
        BOOKED: "BOOKED",
        AVAILABLE: "AVAILABLE",
        SELECTED: "SELECTED",
      },
    };
    webSocketManager = {
      isConnected: ref(false),
      broadcastSeatUpdate: () => {},
      onSeatUpdate: () => {},
      emit: () => {},
      joinShowRoom: () => {},
    };
    pageData.loading = false;
  }
};

// เริ่มต้น composables
initializeComposables();

// ===== Helper Functions =====
const getDateKey = (date) => dayjs(date).format("YYYY-MM-DD");
const getCurrentUserId = () => auth?.user.providerId || "anonymous";

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
const isProcessing = ref(false);

// ====================
// Computed Properties
// ====================
const isConnected = computed(
  () => webSocketManager?.isConnected?.value || false
);
const isBookingInProgress = computed(
  () => bookingManager?.isBookingInProgress?.value || false
);
const canProceedToBooking = computed(
  () => bookingManager?.canProceedToBooking?.value || true
);
const systemHealth = computed(
  () => bookingManager?.systemHealth?.value || { status: "unknown" }
);

// ====================
// ระบบจัดการที่นั่ง
// ====================

// ฟังก์ชันรับ event การเปลี่ยนแปลงที่นั่งจากคนอื่น
const handleSeatUpdateFromOthers = async (event) => {
  console.log("🎯 handleSeatUpdateFromOthers ถูกเรียก!", event);
  try {
    const currentUserId = getCurrentUserId();

    // ไม่ต้องอัพเดทถ้าเป็น event จากตัวเอง
    if (event.data.userId === currentUserId) {
      console.log("🔄 ข้าม event จากตัวเอง");
      return;
    }

    // ตรวจสอบว่าเป็น event ของโซนและวันที่เดียวกันหรือไม่
    const currentDateKey = getDateKey(pageData.showDate);
    console.log("currentDateKey", event.data.showDate, currentDateKey);
    console.log("event.zoneKe", event.data.zoneKey, pageData.zoneKey);

    if (
      event.data.zoneKey !== pageData.zoneKey ||
      event.data.showDate !== currentDateKey
    ) {
      console.log("🔄 ข้าม event ของโซน/วันที่อื่น", {
        eventZone: event.data.zoneKey,
        currentZone: pageData.zoneKey,
        eventDate: event.data.showDate,
        currentDate: currentDateKey,
      });
      return;
    }

    // ✅ Refresh ข้อมูลที่นั่งเพื่อให้ UI อัปเดต (ข้าม initialization)
    console.log("🔄 กำลัง refresh ข้อมูลที่นั่งจาก event...");
    await fetchSeats(true);
    console.log("✅ Refresh ข้อมูลที่นั่งเสร็จแล้ว");

    // แสดง notification ตาม action
    const actionMessages = {
      seat_selected: "มีการเลือกที่นั่งใหม่",
      seat_deselected: "มีการยกเลิกที่นั่ง",
      order_created: "มีการสร้างออเดอร์ใหม่",
      order_confirmed: "มีการยืนยันออเดอร์",
      seats_cancelled: "มีการยกเลิกที่นั่ง",
      seat_selection_changed: "มีการเปลี่ยนแปลงที่นั่ง",
    };

    const message = actionMessages[event.action] || "มีการเปลี่ยนแปลงที่นั่ง";
    toast.info(message, { timeout: 2000 });
    pageData.loading = false;
  } catch (error) {
    pageData.loading = false;
    console.error("❌ จัดการ event ล้มเหลว:", error);
  }
};

// ตั้งค่า WebSocket listeners (ใช้ flag เพื่อป้องกันการตั้งค่าซ้ำ)
const listenersSetup = ref(false);

const setupWebSocketListeners = () => {
  // ป้องกันการตั้งค่า listeners ซ้ำ
  if (listenersSetup.value) {
    console.log("🔗 WebSocket listeners ถูกตั้งค่าไว้แล้ว, ข้าม...");
    return;
  }

  console.log("🔧 กำลังตั้งค่า WebSocket listeners...", {
    webSocketManager: !!webSocketManager,
    onSeatUpdate: !!webSocketManager?.onSeatUpdate,
    joinShowRoom: !!webSocketManager?.joinShowRoom,
    isConnected: isConnected.value,
  });

  if (webSocketManager?.onSeatUpdate) {
    webSocketManager.onSeatUpdate(handleSeatUpdateFromOthers);
    listenersSetup.value = true;
    console.log("🔗 ตั้งค่า WebSocket listeners สำเร็จ");
  } else {
    console.warn("⚠️ WebSocket onSeatUpdate ไม่พร้อมใช้งาน");
  }

  // Join room สำหรับ show date
  if (webSocketManager?.joinShowRoom && pageData.showDate) {
    const dateKey = getDateKey(pageData.showDate);
    webSocketManager.joinShowRoom(dateKey);
    console.log("🚪 เข้าร่วม room:", dateKey);
  } else {
    console.warn("⚠️ WebSocket joinShowRoom ไม่พร้อมใช้งาน หรือไม่มี showDate");
  }
};

const initializeBookingSystem = async () => {
  if (!pageData.showDate || isProcessing.value) return;

  try {
    isProcessing.value = true;
    const showDate = getDateKey(pageData.showDate);

    if (bookingManager?.initializeBooking) {
      await bookingManager.initializeBooking(showDate);
    }

    // ตั้งค่า WebSocket listeners
    setupWebSocketListeners();
  } catch (error) {
    console.error("❌ เริ่มต้นระบบจองล้มเหลว:", error);
    toast.error("ไม่สามารถเริ่มต้นระบบจองได้");
  } finally {
    isProcessing.value = false;
  }
};

// ====================
// ดึงข้อมูลที่นั่ง
// ====================
const fetchSeats = async (skipInitialization = false) => {
  if (!pageData.zoneKey || !pageData.showDate) return;

  try {
    pageData.loading = true;
    const allSeats = await getSeatsByZoneId(
      pageData.zoneKey,
      pageData.showDate
    );

    // ✅ กรองที่นั่งที่ seatNumber === null ออก
    const validSeats = allSeats;

    pageData.currentZoneSeats = buildSeatLayoutFromCoordinates(validSeats);

    const dateKey = getDateKey(pageData.showDate);
    const orderSeatIds =
      props.orderData?.seatBookings.map((b) => b.seat.id) || [];

    pageData.bookedSeats = validSeats.filter((seat) => {
      const currentDateKey = getDateKey(pageData.showDate);
      const seatLockDate = seat.isLockedUntil
        ? getDateKey(seat.isLockedUntil)
        : null;

      if (
        ["BOOKED", "PAID", "PENDING", "RESERVED"].includes(seat.status) &&
        (!seat.isLockedUntil || seatLockDate === currentDateKey)
      ) {
        seat.bookingStatus = seat.status;
      }

      const isBookedStatus = ["BOOKED", "PAID", "PENDING", "RESERVED"].includes(
        seat.bookingStatus
      );
      const isOwnSeat = orderSeatIds.includes(seat.id);

      if (props.mode === "change" && isOwnSeat) {
        return false;
      }

      return isBookedStatus;
    });

    // เรียกคืนที่นั่งที่เลือกไว้
    const savedSeats = pageData.selectedSeatsMap[dateKey] || [];
    const allSeatIds = validSeats.map((s) => s.id);
    pageData.selectedSeats = savedSeats.filter((s) =>
      allSeatIds.includes(s.id)
    );

    // เริ่มต้นระบบจองหลังจากโหลดที่นั่งเสร็จ (เฉพาะครั้งแรก)
    if (!skipInitialization) {
      await initializeBookingSystem();
    }

    console.log("✅ โหลดที่นั่งสำเร็จ", {
      total: allSeats.length,
      valid: validSeats.length,
      booked: pageData.bookedSeats.length,
    });
  } catch (error) {
    console.error("❌ โหลดที่นั่งล้มเหลว:", error);
    toast.error("ไม่สามารถโหลดข้อมูลที่นั่งได้");
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
  pageData.selectedSeats = [];
  await fetchSeats();
};

const handleDateChange = async (newDate) => {
  if (!newDate || isProcessing.value) return;

  const dateKey = getDateKey(newDate);
  const orderDateKey = getDateKey(props.orderData?.showDate);

  pageData.showDate = newDate;

  // ล้างที่นั่งที่เลือกไว้ในวันอื่น (เก็บไว้เฉพาะวันที่ order เดิม)
  for (const key in pageData.selectedSeatsMap) {
    if (key !== orderDateKey) {
      delete pageData.selectedSeatsMap[key];
    }
  }

  pageData.selectedSeats = pageData.selectedSeatsMap[dateKey] || [];
  pageData.totalAmount = 0;

  await fetchSeats();
};

// ====================
// การจัดการเลือกที่นั่ง
// ====================
const toggleSeat = async (seat) => {
  if (isProcessing.value || isBookingInProgress.value) {
    toast.warning("กำลังดำเนินการ กรุณารอสักครู่");
    return;
  }

  const seatId = seat.id;

  // ตรวจสอบว่าสามารถเลือกที่นั่งนี้ได้ไหม
  if (seatManager?.canSelectSeat && !seatManager.canSelectSeat(seatId)) {
    toast.warning("ไม่สามารถเลือกที่นั่งนี้ได้");
    return;
  }

  const isAlreadySelected = pageData.selectedSeats.some((s) => s.id === seatId);

  if (isAlreadySelected) {
    // ยกเลิกการเลือกที่นั่ง
    await removeSeatSelection(seatId);
  } else {
    // เพิ่มการเลือกที่นั่ง
    await addSeatSelection(seat);
  }

  // อัพเดท selectedSeatsMap
  const dateKey = getDateKey(pageData.showDate);
  pageData.selectedSeatsMap[dateKey] = [...pageData.selectedSeats];
};

// ฟังก์ชันส่งข้อมูลอัพเดทไปให้คนอื่น
const broadcastSeatUpdate = async (action = "seat_selection_changed") => {
  try {
    const updateData = {
      zoneKey: pageData.zoneKey,
      showDate: getDateKey(pageData.showDate),
      selectedSeats: pageData.selectedSeats.map((s) => s.id),
      action,
      userId: getCurrentUserId(),
      timestamp: new Date().toISOString(),
    };

    console.log("📡 ส่งข้อมูลอัพเดทไปให้คนอื่น", updateData);

    // ส่งข้อมูลผ่าน WebSocket
    if (webSocketManager?.broadcastSeatUpdate) {
      webSocketManager.broadcastSeatUpdate(updateData);
    }
  } catch (error) {
    console.error("❌ ส่งข้อมูลอัพเดทล้มเหลว:", error);
  }
};

// ฟังก์ชันย่อยสำหรับเพิ่มการเลือกที่นั่ง
const addSeatSelection = async (seat) => {
  const seatId = seat.id;

  // ตรวจสอบจำนวนที่นั่งสูงสุด
  const maxSelectable = getMaxSelectableSeats();

  if (pageData.selectedSeats.length >= maxSelectable) {
    toast.warning(`คุณสามารถเลือกได้สูงสุด ${maxSelectable} ที่นั่ง`, {
      id: "max-seat-warning",
    });
    return;
  }

  try {
    isProcessing.value = true;

    // เพิ่มที่นั่งลงใน pageData ก่อน
    pageData.selectedSeats.push(seat);

    // ✅ ไม่ต้องใช้ seatManager.updateSeatStatus เพราะ Vue จะอัปเดต UI อัตโนมัติ

    // ล็อกที่นั่งด้วย enhanced system
    if (bookingManager?.selectSeatsWithLock) {
      await bookingManager.selectSeatsWithLock([seatId]);
    }

    console.log("✅ เลือกที่นั่งสำเร็จ:", seat.seatNumber);
    toast.success(`เลือกที่นั่ง ${seat.seatNumber} สำเร็จ`, { timeout: 2000 });

    // ส่ง event การเปลี่ยนแปลงที่นั่ง
    await broadcastSeatUpdate("seat_selected");
  } catch (error) {
    console.error("❌ ล็อกที่นั่งล้มเหลว:", error);

    // ถ้าล็อกล้มเหลว ให้ยกเลิกการเลือก
    pageData.selectedSeats = pageData.selectedSeats.filter(
      (s) => s.id !== seatId
    );

    // ✅ ไม่ต้องใช้ seatManager.updateSeatStatus เพราะ Vue จะอัปเดต UI อัตโนมัติ

    toast.error("ไม่สามารถเลือกที่นั่งได้ อาจมีคนอื่นเลือกไปแล้ว");
  } finally {
    isProcessing.value = false;
  }
};

// ฟังก์ชันย่อยสำหรับยกเลิกการเลือกที่นั่ง
const removeSeatSelection = async (seatId) => {
  try {
    isProcessing.value = true;

    // ยกเลิกการเลือกใน pageData
    pageData.selectedSeats = pageData.selectedSeats.filter(
      (s) => s.id !== seatId
    );


    // ปลดล็อกที่นั่งที่ถูกยกเลิก - ส่งเป็น array ของ seatId
    if (bookingManager?.cancelSeatSelection) {
      const res = await bookingManager.cancelSeatSelection([seatId]);
    }

    // ส่ง event การเปลี่ยนแปลงที่นั่ง
    await broadcastSeatUpdate("seat_deselected");
  } catch (error) {
    console.error("❌ ปลดล็อกที่นั่งล้มเหลว:", error);

    // ถ้าปลดล็อกล้มเหลว ให้คืนที่นั่งกลับไป
    const seatToRestore = pageData.currentZoneSeats
      .flat()
      .find((seat) => seat?.id === seatId);

    if (seatToRestore) {
      pageData.selectedSeats.push(seatToRestore);
      console.log("🔄 คืนที่นั่งกลับไปเนื่องจากปลดล็อกล้มเหลว");
    }
  } finally {
    isProcessing.value = false;
  }
};

// ฟังก์ชันย่อยสำหรับคำนวณจำนวนที่นั่งสูงสุด
const getMaxSelectableSeats = () => {
  return props.mode === "change" && props.orderData?.status === "PAID"
    ? originalSeatCount.value
    : 10;
};

// ====================
// การจัดการสถานะที่นั่ง
// ====================
const getSeatStatus = (seat) => {
  if (!seat) return "unavailable";

  const isSelected = pageData.selectedSeats.some((s) => s.id === seat.id);
  const isBooked = pageData.bookedSeats.some((b) => b.id === seat.id);

  if (isSelected) return "SELECTED";
  if (isBooked) return "BOOKED";
  return "available";
};

// ====================
// การจัดการการจอง
// ====================
const handleConfirm = async () => {
  if (!pageData.selectedSeats.length) {
    toast.warning("กรุณาเลือกที่นั่งก่อน");
    return;
  }

  if (isBookingInProgress.value || isProcessing.value) {
    toast.warning("กำลังดำเนินการจอง กรุณารอสักครู่");
    return;
  }

  try {
    isProcessing.value = true;
    console.log("🎫 กำลังสร้าง order...");

    const orderData = createOrderData("PENDING");

    let order = null;
    if (bookingManager?.createOrderWithProtection) {
      order = await bookingManager.createOrderWithProtection(orderData);
    } else {
      // Fallback ถ้าไม่มี enhanced system
      const { submitOrder } = useOrder();
      order = await submitOrder(orderData);
    }

    if (order && (order.status === "PENDING" || order.status === "PENDING")) {
      // เก็บข้อมูล order
      pageData.orderId = order.id || order.orderId;
      pageData.totalAmount = order.total;

      // บันทึกที่นั่งที่เลือก
      const dateKey = getDateKey(pageData.showDate);
      pageData.selectedSeatsMap[dateKey] = [...pageData.selectedSeats];

      console.log("✅ สร้าง order สำเร็จ", {
        orderId: pageData.orderId,
        totalAmount: pageData.totalAmount,
      });

      // ส่ง event การสร้าง order
      await broadcastSeatUpdate("order_created");

      // เปิด Summary Modal
      pageData.showSummaryModal = true;
    } else {
      throw new Error("ไม่สามารถสร้าง order ได้");
    }
  } catch (error) {
    console.error("❌ สร้าง order ล้มเหลว:", error);
    handleBookingError(error);
  } finally {
    isProcessing.value = false;
  }
};

const handleMarkOrder = async () => {
  if (!pageData.selectedSeats.length) {
    toast.warning("กรุณาเลือกที่นั่งก่อน");
    return;
  }

  if (isBookingInProgress.value || isProcessing.value) {
    toast.warning("กำลังดำเนินการจอง กรุณารอสักครู่");
    return;
  }

  try {
    isProcessing.value = true;
    console.log("📋 กำลังจองที่นั่ง...");

    const orderData = createOrderData("BOOKED");

    if (bookingManager?.createOrderWithProtection) {
      await bookingManager.createOrderWithProtection(orderData);
    } else {
      // Fallback ถ้าไม่มี enhanced system
      const { submitOrder } = useOrder();
      await submitOrder(orderData);
    }

    toast.success("จองที่นั่งเรียบร้อยแล้ว");

    // ส่ง event การจอง
    await broadcastSeatUpdate("order_confirmed");

    await resetAndClose();
  } catch (error) {
    console.error("❌ จองที่นั่งล้มเหลว:", error);
    handleBookingError(error);
  } finally {
    isProcessing.value = false;
  }
};

// ฟังก์ชันย่อยสำหรับสร้าง order data
const createOrderData = (status) => {
  return {
    seatIds: pageData.selectedSeats.map((s) => s.id),
    showDate: getDateKey(pageData.showDate),
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    ticketType: "RINGSIDE",
    paymentMethod: "CASH",
    source: "OTHER",
    status: status,
  };
};

// ฟังก์ชันย่อยสำหรับจัดการ error
const handleBookingError = async (error) => {
  if (error.response?.status === 409) {
    toast.error("ที่นั่งถูกจองแล้ว กรุณาเลือกที่นั่งอื่น");
    await fetchSeats(); // รีเฟรช seat availability
  } else if (error.response?.status === 429) {
    toast.error("คำขอมากเกินไป กรุณาลองใหม่อีกครั้ง");
  } else {
    toast.error(error.message || "เกิดข้อผิดพลาดในการจอง");
  }
};

// ====================
// Lifecycle Hooks
// ====================
onMounted(() => {
  pageData.showDate = props.orderData?.showDate || new Date();
  pageData.zoneKey = props.zoneKey;
  console.log("🚀 Modal mounted");
});

onBeforeUnmount(() => {
  document.body.style.overflow = "";
  console.log("🔚 Modal unmounted");
});

// ====================
// Watchers
// ====================
watch(
  () => props.isOpen,
  async (isOpen) => {
    if (isOpen) {
      console.log("📱 Modal เปิดแล้ว");
      isFirstOpen.value = true;
      pageData.showSeatModal = true;
      pageData.showDate = props.orderData?.showDate || new Date();

      await onZoneChange(props.zoneKey);

      // จัดการโหมดเปลี่ยนที่นั่ง
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
    } else {
      console.log("📱 Modal ปิดแล้ว");
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

// ====================
// การจัดการปิด Modal
// ====================
const resetAndClose = async () => {
  pageData.resetPageData();
  pageData.showSeatModal = false;
  pageData.selectedSeatsMap = {};
  listenersSetup.value = false; // รีเซ็ต listeners flag
  emit("close");
};

const onClose = async () => {
  // ปลดล็อกที่นั่งที่เลือกไว้
  if (pageData.selectedSeats.length > 0) {
    try {
      if (bookingManager?.cancelSeatSelection) {
        await bookingManager.cancelSeatSelection(
          pageData.selectedSeats.map((s) => s.id)
        );
      }

      // ส่ง event การยกเลิกที่นั่ง
      await broadcastSeatUpdate("seats_cancelled");

      console.log("✅ ปลดล็อกที่นั่งสำเร็จ");
    } catch (error) {
      console.error("❌ ปลดล็อกที่นั่งล้มเหลว:", error);
    }
  }

  await resetAndClose();
};
const onClear = async () => {
  if (isProcessing.value || isBookingInProgress.value) {
    toast.warning("กำลังดำเนินการ กรุณารอสักครู่");
    return;
  }

  // รีเซ็ตที่นั่งที่เลือก

  // ปลดล็อกที่นั่งที่เลือกไว้
  if (bookingManager?.cancelSeatSelection) {
    await bookingManager.cancelSeatSelection(
      pageData.selectedSeats.map((s) => s.id)
    );
    console.log("✅ ปลดล็อกที่นั่งสำเร็จ");
  }
  pageData.selectedSeats = [];
  pageData.selectedSeatsMap = {};
  pageData.totalAmount = 0;
  // ส่ง event การยกเลิกที่นั่ง
  await broadcastSeatUpdate("seats_cancelled");

  toast.success("ยกเลิกการเลือกที่นั่งทั้งหมดแล้ว");
};

const onCloseSummaryModal = async () => {
  // ปลดล็อกที่นั่งที่เลือกไว้
  if (pageData.selectedSeats.length > 0) {
    try {
      if (bookingManager?.cancelSeatSelection) {
        await bookingManager.cancelSeatSelection();
      }

      // ส่ง event การยกเลิกที่นั่ง
      await broadcastSeatUpdate("seats_cancelled");

      console.log("✅ ปลดล็อกที่นั่งสำเร็จ");
    } catch (error) {
      console.error("❌ ปลดล็อกที่นั่งล้มเหลว:", error);
    }
  }

  pageData.resetPageData();
  pageData.showSummaryModal = false;
  pageData.showSeatModal = false;
  pageData.selectedSeatsMap = {};
  listenersSetup.value = false; // รีเซ็ต listeners flag
  emit("close");
};

onBeforeUnmount(() => {
  document.body.style.overflow = "";
  listenersSetup.value = false; // รีเซ็ต listeners flag
  console.log("🔚 Modal unmounted");
});
</script>
