// composables/useIntegratedSeatBooking.ts
import { ref, computed, onBeforeUnmount } from "vue";
import { useSingleToast } from "./useSingleToast";
import {
  useRealTimeSeatManager,
  type WebSocketSeatEvent,
} from "./useRealTimeSeatManager";
import { useWebSocket } from "./useWebSocket";
import { useTicketBookingManager } from "./useTicketBookingManager";
import dayjs from "dayjs";

export const useIntegratedSeatBooking = () => {
  const { showToast } = useSingleToast();
  const seatManager = useRealTimeSeatManager();
  const webSocket = useWebSocket();

  // ===== State =====
  const isProcessing = ref(false);
  const isBookingInProgress = ref(false);
  const currentZoneKey = ref<string>("");
  const currentShowDate = ref<string>("");
  const listenersSetup = ref(false);
  let seatUpdateUnsubscribe: (() => void) | null | undefined = null;

  // ===== Booking Manager =====
  let bookingManager: any = null;

  const initializeBookingManager = async () => {
    try {
      bookingManager = useTicketBookingManager();
    } catch (error) {
      console.error("❌ เริ่มต้น booking manager ล้มเหลว:", error);
      // Fallback
      bookingManager = {
        selectSeatsWithLock: async () => ({ success: false }),
        cancelSeatSelection: async () => ({ success: false }),
        createOrderWithProtection: async () => ({}),
        initializeBooking: async () => {},
        isBookingInProgress: ref(false),
        canProceedToBooking: ref(true),
      };
    }
  };

  // ===== Computed Properties =====
  const canProceedToBooking = computed(() => {
    return (
      !isProcessing.value &&
      !isBookingInProgress.value &&
      seatManager.selectedSeatCount.value > 0
    );
  });

  const maxSelectableSeats = ref(10);

  // ===== Helper Functions =====
  const getDateKey = (date: Date | string): string => {
    return dayjs(date).format("YYYY-MM-DD");
  };

  const getCurrentUserId = (): string => {
    // Use the same logic as seatManager for consistency
    return "user-" + Date.now(); // Fallback for now
  };

  // ===== WebSocket Event Handling =====
  const handleWebSocketEvent = (event: any) => {
    // ตรวจสอบว่าเป็น event ของโซนและวันที่ปัจจุบัน
    const eventData = event.data || event;

    if (
      eventData.zoneKey !== currentZoneKey.value ||
      eventData.showDate !== currentShowDate.value
    ) {
      return;
    }

    // แปลง event เป็นรูปแบบที่ seatManager เข้าใจ
    const seatEvent: WebSocketSeatEvent = {
      action: eventData.action || "seat_selected",
      userId: eventData.userId || "unknown",
      seatIds: eventData.selectedSeats || [],
      zoneKey: eventData.zoneKey || currentZoneKey.value,
      showDate: eventData.showDate || currentShowDate.value,
      timestamp: eventData.timestamp || new Date().toISOString(),
    };

    // ส่งต่อไปยัง seatManager
    seatManager.handleWebSocketEvent(seatEvent);
  };

  const setupWebSocketListeners = () => {
    // ถ้ามี listener เดิมอยู่ ให้ถอดออกก่อน
    if (seatUpdateUnsubscribe) {
      if (typeof seatUpdateUnsubscribe === "function") {
        seatUpdateUnsubscribe();
      }
      seatUpdateUnsubscribe = null;
      listenersSetup.value = false;
    }

    if (webSocket.onSeatUpdate) {
      const unsub = webSocket.onSeatUpdate(handleWebSocketEvent);
      if (typeof unsub === "function") {
        seatUpdateUnsubscribe = unsub;
      } else {
        seatUpdateUnsubscribe = null;
      }
      listenersSetup.value = true;
    }

    if (webSocket.joinShowRoom && currentShowDate.value) {
      webSocket.joinShowRoom(currentShowDate.value);
    }
  };

  // ===== Seat Management =====
  const initializeSeats = async (
    fetchFunction: Function,
    zoneKey: string,
    showDate: string | Date
  ) => {
    try {
      isProcessing.value = true;

      // อัปเดต context
      currentZoneKey.value = zoneKey;
      currentShowDate.value = getDateKey(showDate);

      // ดึงข้อมูลที่นั่ง
      const seats = await fetchFunction(zoneKey, showDate);

      // เริ่มต้น seat manager
      seatManager.initializeSeats(seats.data);

      // ตั้งค่า WebSocket
      setupWebSocketListeners();

      // เริ่มต้น booking system
      if (bookingManager?.initializeBooking) {
        await bookingManager.initializeBooking(currentShowDate.value);
      }

      return true;
    } catch (error) {
      console.error("❌ เริ่มต้นที่นั่งล้มเหลว:", error);
      showToast("error", "ไม่สามารถโหลดข้อมูลที่นั่งได้");
      return false;
    } finally {
      isProcessing.value = false;
    }
  };

  const refreshSeats = async (fetchFunction: Function) => {
    if (!currentZoneKey.value || !currentShowDate.value) return false;

    return await seatManager.refreshSeatsWithoutLosingSelection(
      fetchFunction,
      currentZoneKey.value,
      currentShowDate.value
    );
  };

  // ===== Seat Selection =====
  const selectSeat = async (seat: any): Promise<boolean> => {
    if (isProcessing.value || isBookingInProgress.value) {
      showToast("warning", "กำลังดำเนินการ กรุณารอสักครู่");
      return false;
    }

    const seatId = seat.id;

    // ตรวจสอบว่าสามารถเลือกได้
    if (!seatManager.canSelectSeat(seatId)) {
      showToast("warning", "ไม่สามารถเลือกที่นั่งนี้ได้");
      return false;
    }

    // ตรวจสอบจำนวนสูงสุด
    if (seatManager.selectedSeatCount.value >= maxSelectableSeats.value) {
      showToast(
        "warning",
        `คุณสามารถเลือกได้สูงสุด ${maxSelectableSeats.value} ที่นั่ง`
      );
      return false;
    }

    try {
      isProcessing.value = true;

      // เลือกที่นั่งใน local state ก่อน
      const selected = seatManager.selectSeat(seatId);
      if (!selected) {
        showToast("error", "ไม่สามารถเลือกที่นั่งได้");
        return false;
      }

      // ล็อกที่นั่งผ่าน API
      let apiSuccess = true;
      if (bookingManager?.selectSeatsWithLock) {
        const result = await bookingManager.selectSeatsWithLock([seatId]);
        apiSuccess = result?.success !== false;
      }

      if (apiSuccess) {
        // ส่ง WebSocket event
        await broadcastSeatUpdate("seat_selected", [seatId]);
        showToast("success", `เลือกที่นั่ง ${seat.seatNumber} สำเร็จ`, {
          timeout: 2000,
        });
        return true;
      } else {
        seatManager.deselectSeat(seatId);
        showToast("error", "ไม่สามารถเลือกที่นั่งได้ อาจมีคนอื่นเลือกไปแล้ว");
        return false;
      }
    } catch (error) {
      console.error("❌ เลือกที่นั่งล้มเหลว:", error);
      seatManager.deselectSeat(seatId);
      showToast("error", "เกิดข้อผิดพลาดในการเลือกที่นั่ง");
      return false;
    } finally {
      isProcessing.value = false;
    }
  };

  const deselectSeat = async (seatId: string): Promise<boolean> => {
    if (isProcessing.value || isBookingInProgress.value) {
      showToast("warning", "กำลังดำเนินการ กรุณารอสักครู่");
      return false;
    }

    try {
      isProcessing.value = true;

      // ยกเลิกใน local state
      const wasSelected = seatManager.deselectSeat(seatId);
      if (!wasSelected) {
        return false;
      }

      // ปลดล็อกผ่าน API
      if (bookingManager?.cancelSeatSelection) {
        await bookingManager.cancelSeatSelection([seatId]);
      }

      // ส่ง WebSocket event
      await broadcastSeatUpdate("seat_deselected", [seatId]);

      return true;
    } catch (error) {
      console.error("❌ ยกเลิกที่นั่งล้มเหลว:", error);
      // คืนที่นั่งกลับไปถ้าล้มเหลว
      seatManager.selectSeat(seatId);
      return false;
    } finally {
      isProcessing.value = false;
    }
  };

  const toggleSeat = async (seat: any): Promise<boolean> => {
    const seatId = seat.id;
    const isSelected = seatManager.mySelectedSeats.value.some(
      (s) => s.id === seatId
    );

    if (isSelected) {
      return await deselectSeat(seatId);
    } else {
      return await selectSeat(seat);
    }
  };

  const clearAllSelections = async (): Promise<boolean> => {
    if (isProcessing.value || isBookingInProgress.value) {
      showToast("warning", "กำลังดำเนินการ กรุณารอสักครู่");
      return false;
    }

    try {
      isProcessing.value = true;

      const selectedSeatIds = seatManager.mySelectedSeats.value.map(
        (s) => s.id
      );

      if (selectedSeatIds.length === 0) {
        return true;
      }

      // ล้างใน local state
      seatManager.clearMySelections();

      // ปลดล็อกผ่าน API
      if (bookingManager?.cancelSeatSelection) {
        await bookingManager.cancelSeatSelection(selectedSeatIds);
      }

      // ส่ง WebSocket event
      await broadcastSeatUpdate("seats_cancelled", selectedSeatIds);

      // toast.success("ยกเลิกการเลือกที่นั่งทั้งหมดแล้ว");
      return true;
    } catch (error) {
      console.error("❌ ล้างการเลือกล้มเหลว:", error);
      showToast("error", "เกิดข้อผิดพลาดในการยกเลิกที่นั่ง");
      return false;
    } finally {
      isProcessing.value = false;
    }
  };

  // ===== WebSocket Broadcasting =====
  const broadcastSeatUpdate = async (action: string, seatIds: string[]) => {
    try {
      const updateData = {
        action,
        userId: getCurrentUserId(),
        selectedSeats: seatIds,
        zoneKey: currentZoneKey.value,
        showDate: currentShowDate.value,
        timestamp: new Date().toISOString(),
      };

      if (webSocket.broadcastSeatUpdate) {
        webSocket.broadcastSeatUpdate(updateData);
      }
    } catch (error) {
      console.error("❌ ส่งข้อมูลอัปเดตล้มเหลว:", error);
    }
  };

  // ===== Booking Functions =====
  const createBooking = async (orderData: any) => {
    if (seatManager.selectedSeatCount.value === 0) {
      showToast("warning", "กรุณาเลือกที่นั่งก่อน");
      return null;
    }

    try {
      isBookingInProgress.value = true;

      const bookingData = {
        ...orderData,
        seatIds: seatManager.mySelectedSeats.value.map((s) => s.id),
        showDate: currentShowDate.value,
      };

      let order = null;
      if (bookingManager?.createOrderWithProtection) {
        order = await bookingManager.createOrderWithProtection(bookingData);
      }

      console.log("📦 สร้างการจอง:", order);

      if (order) {
        // ส่ง WebSocket event
        await broadcastSeatUpdate(
          "order_created",
          seatManager.mySelectedSeats.value.map((s) => s.id)
        );

        return order;
      } else {
        throw new Error("ไม่สามารถสร้างการจองได้");
      }
    } catch (error) {
      console.error("❌ สร้างการจองล้มเหลว:", error);
      throw error;
    } finally {
      isBookingInProgress.value = false;
    }
  };

  // ===== Cleanup =====
  const cleanup = () => {
    seatManager.cleanup();
    if (seatUpdateUnsubscribe) {
      if (typeof seatUpdateUnsubscribe === "function") {
        seatUpdateUnsubscribe();
      }
      seatUpdateUnsubscribe = null;
      listenersSetup.value = false;
    }
    currentZoneKey.value = "";
    currentShowDate.value = "";
  };

  // ===== Initialization =====
  onBeforeUnmount(() => {
    cleanup();
  });

  // Initialize booking manager
  initializeBookingManager();

  // ===== Return API =====
  return {
    // State
    isProcessing,
    isBookingInProgress,
    canProceedToBooking,
    maxSelectableSeats,

    // Seat Manager
    seatManager,

    // Functions
    initializeSeats,
    refreshSeats,
    selectSeat,
    deselectSeat,
    toggleSeat,
    clearAllSelections,
    createBooking,
    cleanup,

    // WebSocket
    setupWebSocketListeners,
    broadcastSeatUpdate,
  };
};
