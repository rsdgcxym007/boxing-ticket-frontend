import { ref, computed } from "vue";
import { useSingleToast } from "./useSingleToast";
import { useWebSocket } from "./useWebSocket";
import { useSeatManager } from "./useSeatManager";
import { useEnhancedOrderSystem } from "./useEnhancedOrderSystem";
import { useOrder } from "./useOrder";

export interface OrderData {
  seatIds: string[];
  showDate: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  ticketType: string;
  paymentMethod: string;
  referrerCode?: string;
  standingAdultQty?: number;
  standingChildQty?: number;
  note?: string;
  quantity?: number;
  source?: string;
  status?: string;
}

export const useTicketBookingManager = () => {
  const { showToast } = useSingleToast();
  const {
    joinShowRoom,
    onOrderCreated,
    onOrderCancelled,
    onSeatLocked,
    onSeatUnlocked,
    onSeatAvailabilityChanged,
  } = useWebSocket();
  const {
    selectedSeats,
    updateSeatStatus,
    setAutoUnlockTimer,
    clearAutoUnlockTimer,
    refreshSeatAvailability,
    clearSelection,
    SEAT_STATUS,
  } = useSeatManager();
  const { lockSeats, unlockSeats, getSystemHealth, getSystemStats } =
    useEnhancedOrderSystem();
  const { submitOrder, cancelOrder } = useOrder();

  const isBookingInProgress = ref(false);
  const currentShowDate = ref<string>("");
  const systemHealth = ref<any>(null);

  // เริ่มต้นระบบ booking
  const initializeBooking = async (showDate: string) => {
    try {
      currentShowDate.value = showDate;

      console.log("showDate", showDate);

      // Join WebSocket room
      joinShowRoom(showDate);

      // ตั้งค่า WebSocket event listeners
      setupWebSocketListeners();

      // รีเฟรช seat availability
      const res = await refreshSeatAvailability(showDate);
      console.log("res", res);

      // ตรวจสอบสถานะระบบ
      const checkSystemHealths = await checkSystemHealth();
      console.log("checkSystemHealths", checkSystemHealths);

      showToast("success", "เริ่มต้นระบบจองตั๋วสำเร็จ");
    } catch (error) {
      console.error("Failed to initialize booking:", error);
      showToast("error", "ไม่สามารถเริ่มต้นระบบจองตั๋วได้");
    }
  };

  // ตั้งค่า WebSocket event listeners
  const setupWebSocketListeners = () => {
    // เมื่อมี order ใหม่
    onOrderCreated((event) => {
      console.log("🎫 New order created:", event);
      refreshSeatAvailability(currentShowDate.value);
      // toast.success("มีการจองใหม่!");
    });

    // เมื่อมีการยกเลิก order
    onOrderCancelled((event) => {
      console.log("❌ Order cancelled:", event);
      refreshSeatAvailability(currentShowDate.value);
      // toast.info("มีการยกเลิกจอง");
    });

    // เมื่อมีที่นั่งถูกล็อก
    onSeatLocked((event) => {
      console.log("🔒 Seats locked:", event);
      updateSeatStatus(event.data.seatIds, SEAT_STATUS.LOCKED);
    });

    // เมื่อมีที่นั่งถูกปลดล็อก
    onSeatUnlocked((event) => {
      console.log("🔓 Seats unlocked:", event);
      updateSeatStatus(event.data.seatIds, SEAT_STATUS.AVAILABLE);
    });

    // เมื่อสถานะที่นั่งเปลี่ยน
    onSeatAvailabilityChanged((event) => {
      console.log("🎯 Seat availability changed:", event);
      updateSeatStatus(event.data.seatIds, event.data.status);
    });
  };

  // เลือกที่นั่งพร้อมล็อก
  const selectSeatsWithLock = async (seatIds: string[]) => {
    try {
      // ล็อกที่นั่งชั่วคราว
      await lockSeats(seatIds, currentShowDate.value);

      // อัปเดต UI
      updateSeatStatus(seatIds, SEAT_STATUS.SELECTED);

      // ตั้ง auto-unlock timer (4 นาที)
      setAutoUnlockTimer(async () => {
        await unlockSeats(seatIds, currentShowDate.value);
        clearSelection();
      }, 4);
    } catch (error) {
      console.error("Failed to select seats:", error);
      showToast("error", "ไม่สามารถเลือกที่นั่งได้");
      throw error;
    }
  };

  // สร้าง order พร้อมป้องกัน concurrency
  const createOrderWithProtection = async (orderData: OrderData) => {
    if (isBookingInProgress.value) {
      showToast("warning", "กำลังดำเนินการจอง กรุณารอสักครู่");
      return;
    }

    try {
      isBookingInProgress.value = true;

      // ปลดล็อกที่นั่ง
      if (orderData.seatIds.length > 0) {
        await unlockSeats(orderData.seatIds, orderData.showDate);
      }

      // สร้าง order
      const result = await submitOrder(orderData);

      // ยกเลิก auto-unlock timer
      clearAutoUnlockTimer();

      // ล้างการเลือกที่นั่ง
      clearSelection();

      showToast("success", "สร้างออเดอร์สำเร็จ!");
      return result;
    } catch (error: any) {
      console.error("Failed to create order:", error);

      // จัดการ error ตาม status code
      if (error.response?.status === 409) {
        showToast("error", "ที่นั่งถูกจองแล้ว กรุณาเลือกที่นั่งอื่น");
        await refreshSeatAvailability(currentShowDate.value);
      } else if (error.response?.status === 429) {
        showToast("error", "คำขอมากเกินไป กรุณาลองใหม่อีกครั้ง");
      } else {
        showToast("error", "ไม่สามารถสร้างออเดอร์ได้");
      }

      throw error;
    } finally {
      isBookingInProgress.value = false;
    }
  };

  // ยกเลิก order
  const cancelOrderWithProtection = async (orderId: string) => {
    try {
      const result = await cancelOrder(orderId);

      // รีเฟรช seat availability
      await refreshSeatAvailability(currentShowDate.value);

      showToast("success", "ยกเลิกออเดอร์สำเร็จ");
      return result;
    } catch (error) {
      console.error("Failed to cancel order:", error);
      showToast("error", "ไม่สามารถยกเลิกออเดอร์ได้");
      throw error;
    }
  };

  // ตรวจสอบสถานะระบบ
  const checkSystemHealth = async () => {
    try {
      const health = await getSystemHealth();
      systemHealth.value = health;

      // if (health) {
      //   toast.warning("ระบบมีปัญหาบางอย่าง");
      // }

      return health;
    } catch (error) {
      console.error("Failed to check system health:", error);
      showToast("error", "ไม่สามารถตรวจสอบสถานะระบบได้");
    }
  };

  // ยกเลิกการเลือกที่นั่งและปลดล็อก
  const cancelSeatSelection = async (seatsId: string) => {
    if (seatsId) {
      await unlockSeats(seatsId, currentShowDate.value);
      clearSelection();
      clearAutoUnlockTimer();
      showToast("info", "ยกเลิกการเลือกที่นั่งแล้ว");
    }
  };

  // ตรวจสอบว่าสามารถจองได้หรือไม่
  const canProceedToBooking = computed(() => {
    return selectedSeats.value.length > 0 && !isBookingInProgress.value;
  });

  // ข้อมูลสถิติระบบ
  const getSystemStatistics = async () => {
    try {
      const stats = await getSystemStats();
      return stats;
    } catch (error) {
      console.error("Failed to get system statistics:", error);
      return null;
    }
  };

  return {
    // States
    isBookingInProgress,
    currentShowDate,
    systemHealth,
    selectedSeats,
    canProceedToBooking,

    // Methods
    initializeBooking,
    selectSeatsWithLock,
    createOrderWithProtection,
    cancelOrderWithProtection,
    checkSystemHealth,
    cancelSeatSelection,
    getSystemStatistics,
    refreshSeatAvailability,
  };
};
